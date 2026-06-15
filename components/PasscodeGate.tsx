"use client";

import { FormEvent, useState } from "react";

const STORAGE_KEY = "alsama_survey_unlocked";

export default function PasscodeGate({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const expected = process.env.NEXT_PUBLIC_SURVEY_PASSCODE;

    if (code === expected) {
      localStorage.setItem(STORAGE_KEY, "true");
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <main>
      <h1>AI-Native at Alsama</h1>
      <form className="gate" onSubmit={handleSubmit}>
        <p>Enter the passcode to take the survey.</p>
        <input
          type="password"
          autoFocus
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(false);
          }}
          placeholder="Passcode"
        />
        {error && <p className="error-text">That passcode isn&apos;t right. Try again.</p>}
        <button type="submit" className="primary-button">
          Enter
        </button>
      </form>
    </main>
  );
}

// Exported so the page can check unlock status without duplicating the key.
export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}
