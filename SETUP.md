# Connect Silva Harbor to a database (Supabase)

This lets people sign up once and log in from any device or browser with their plans intact.
Supabase is free to start. Menu names may differ slightly as the dashboard changes.

## 1. Create the project
1. Go to supabase.com, sign up with GitHub, click **New project**.
2. Name it `silva-harbor`, set a database password (save it), pick the region closest to your users, create it, and wait a minute or two.

## 2. Create the tasks table
Open **SQL Editor → New query**, paste this, and click **Run**:

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  notes text not null default '',
  priority text not null default 'medium' check (priority in ('high','medium','low')),
  due text not null default '',
  done boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index tasks_user_idx on public.tasks (user_id);

alter table public.tasks enable row level security;

create policy "Read own tasks"   on public.tasks for select using (auth.uid() = user_id);
create policy "Add own tasks"    on public.tasks for insert with check (auth.uid() = user_id);
create policy "Edit own tasks"   on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own tasks" on public.tasks for delete using (auth.uid() = user_id);
```

The policies are what keep each person's tasks private. Don't skip them.

## 3. Get your keys
Open **Project Settings → API Keys** (or click **Connect**). Copy:
- **Project URL**
- The **anon / publishable** key (never the `service_role` or secret key)

## 4. Tell Supabase where your site lives
Open **Authentication → URL Configuration**:
- **Site URL**: `https://silvaharbor.vercel.app`
- **Redirect URLs**: add `https://silvaharbor.vercel.app/**` and `http://localhost:5173/**`

This is what makes the confirmation and reset-password links work.

## 5. Email confirmation
Under **Authentication → Sign In / Providers → Email**, "Confirm email" is on by default, so new users must click a link before logging in. Keep it on for real use. Turn it off while testing if you don't want to wait for emails. Supabase's built-in email sender is heavily limited, so for real users add your own SMTP provider later.

## 6. Run it on your computer
1. In the project root (next to `package.json`), create a file named `.env.local` with:
   ```
   VITE_SUPABASE_URL=your project URL
   VITE_SUPABASE_ANON_KEY=your anon key
   ```
2. Run `npm install` (installs `@supabase/supabase-js`), then `npm run dev`.

## 7. Put the keys on Vercel
1. Vercel → your project → **Settings → Environment Variables**.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values (all environments).
3. **Deployments → latest → ⋯ → Redeploy**. Keys are read at build time, so a redeploy is required.

## 8. Test
Sign up, add a task, log out, then log in from your phone or another browser. Your task should be there.
