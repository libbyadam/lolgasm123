import { ANSWER_OPTIONS, AnswerValue } from "@/lib/supabase";

export default function ResultsChart({
  counts,
  selectedAnswer,
}: {
  counts: Record<AnswerValue, number>;
  selectedAnswer: AnswerValue | null;
}) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="results">
      {ANSWER_OPTIONS.map(({ value, label }) => {
        const count = counts[value] ?? 0;
        const percent = total === 0 ? 0 : Math.round((count / total) * 100);
        const isSelected = value === selectedAnswer;

        return (
          <div
            key={value}
            className={`result-row${isSelected ? " is-selected" : ""}`}
          >
            <div className="result-label-row">
              <span className="result-label">
                {label}
                {isSelected ? " (your answer)" : ""}
              </span>
              <span className="result-percent">{percent}%</span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill${isSelected ? " is-selected" : ""}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="total-votes">
        {total} {total === 1 ? "response" : "responses"} so far
      </p>
    </div>
  );
}
