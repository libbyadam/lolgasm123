"use client";

import { useEffect, useState } from "react";
import PasscodeGate, { isUnlocked } from "@/components/PasscodeGate";
import Survey from "@/components/Survey";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setUnlocked(isUnlocked());
    setChecked(true);
  }, []);

  // Avoid a flash of the gate while we check localStorage.
  if (!checked) return null;

  if (!unlocked) {
    return <PasscodeGate onUnlock={() => setUnlocked(true)} />;
  }

  return <Survey />;
}
