"use client";

import { useEffect, useState } from "react";
import { supabase, ANSWER_OPTIONS, AnswerValue } from "@/lib/supabase";
import ResultsChart from "./ResultsChart";

const VOTE_STORAGE_KEY = "alsama_survey_vote";

type Counts = Record<AnswerValue, number>;

const emptyCounts = (): Counts => ({
  excited: 0,
  unsure: 0,
  nervous: 0,
  overwhelmed: 0,
});

export default function Survey() {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(
    null
  );
  const [counts, setCounts] = useState<Counts>(emptyCounts());
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore any vote already made from this browser.
  useEffect(() => {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY) as AnswerValue | null;
    if (stored) setSelectedAnswer(stored);
  }, []);

  // Load current totals, then keep them live via Supabase Realtime.
  useEffect(() => {
    const loadCounts = async () => {
      const { data, error } = await supabase.from("votes").select("answer");

      if (!error && data) {
        const next = emptyCounts();
        for (const row of data) {
          const answer = row.answer as AnswerValue;
          if (answer in next) next[answer] += 1;
        }
        setCounts(next);
      }
      setLoading(false);
    };

    loadCounts();

    // Subscribe to every new vote and bump the matching count in place.
    const channel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        (payload) => {
          const answer = payload.new.answer as AnswerValue;
          setCounts((prev) => ({
            ...prev,
            [answer]: (prev[answer] ?? 0) + 1,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = async (answer: AnswerValue) => {
    if (selectedAnswer || submitting) return;

    setSubmitting(true);
    const { error } = await supabase.from("votes").insert({ answer });
    setSubmitting(false);

    if (!error) {
      localStorage.setItem(VOTE_STORAGE_KEY, answer);
      setSelectedAnswer(answer);
    }
  };

  return (
    <main>
      <h1>How are you feeling about going AI-Native at Alsama?</h1>

      <div className="card">
        {!selectedAnswer && (
          <div className="options">
            {ANSWER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                className="option-button"
                onClick={() => handleVote(value)}
                disabled={submitting}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {selectedAnswer && (
          <p className="helper-text">
            Thanks for sharing! Your response has been recorded — here&apos;s
            how everyone is feeling so far.
          </p>
        )}

        {!loading && (
          <ResultsChart counts={counts} selectedAnswer={selectedAnswer} />
        )}
      </div>
    </main>
  );
}
