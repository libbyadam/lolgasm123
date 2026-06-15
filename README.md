# AI-Native at Alsama — Survey

A single-question survey: **"How are you feeling about going AI-Native at Alsama?"**
Built with Next.js (App Router) and Supabase.

## Features

- Passcode-gated access (`libbyisthebest` by default)
- One submission per browser (tracked via `localStorage`)
- Live-updating bar chart of results via Supabase Realtime
- Highlights the option the current visitor voted for
- Cream / serif styling

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env file and fill in your Supabase project details:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   NEXT_PUBLIC_SURVEY_PASSCODE=libbyisthebest
   ```

3. In Supabase, make sure the `votes` table exists (already provided):

   ```sql
   CREATE TABLE votes (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     answer text NOT NULL CHECK (answer IN ('excited', 'unsure', 'nervous', 'overwhelmed')),
     created_at timestamp with time zone DEFAULT now()
   );
   ```

4. Enable Row Level Security and add policies that allow the anon key to
   insert and read votes (without exposing other tables):

   ```sql
   ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Anyone can insert a vote"
     ON votes FOR INSERT
     TO anon
     WITH CHECK (true);

   CREATE POLICY "Anyone can read vote totals"
     ON votes FOR SELECT
     TO anon
     USING (true);
   ```

5. Enable **Realtime** for the `votes` table (Database → Replication → toggle
   on for `votes`) so the chart updates live for everyone.

6. Run locally:

   ```bash
   npm run dev
   ```

## Deploying to Vercel

1. Push this repo to GitHub (already done).
2. Import the repo in Vercel.
3. Add the three environment variables from `.env.local` in the Vercel
   project settings (Production, Preview, and Development).
4. Deploy.

## Notes

- The passcode check is client-side, intended as a light gate to keep the
  survey link from being stumbled on — it is not a substitute for real
  authentication.
- "One submission per browser" is enforced via `localStorage`. Clearing
  browser storage or using a different browser/device allows another vote.
