import { createClient } from "@supabase/supabase-js";

// Public client used in the browser. The anon key is safe to expose,
// but the `votes` table should rely on RLS policies (insert + select only).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// The set of valid answers, matching the `votes.answer` CHECK constraint.
export const ANSWER_OPTIONS = [
  { value: "excited", label: "Excited" },
  { value: "unsure", label: "Unsure" },
  { value: "nervous", label: "Nervous" },
  { value: "overwhelmed", label: "Overwhelmed" },
] as const;

export type AnswerValue = (typeof ANSWER_OPTIONS)[number]["value"];
