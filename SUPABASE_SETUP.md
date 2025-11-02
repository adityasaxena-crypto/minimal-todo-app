# Supabase Setup Guide

This guide will help you set up Supabase authentication and database for the AI Kanban Board.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: AI Kanban Board
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait for the project to be created (1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon)
2. Click on **API** in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Add Keys to Your Project

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. Restart your dev server: `npm run dev`

## Step 4: Create the Tasks Table

1. In Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Paste this SQL code:

```sql
-- Create tasks table
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'backlog',
    tags TEXT[] DEFAULT '{}',
    ai_enhanced BOOLEAN DEFAULT FALSE,
    ai_suggested_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own tasks
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own tasks
CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy: Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX tasks_created_at_idx ON tasks(created_at DESC);
```

4. Click **Run** button
5. You should see "Success. No rows returned"

## Step 5: Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Scroll down to **Email Templates** (optional)
4. Customize the confirmation email if desired

## Step 6: Test the Application

1. Make sure your dev server is running: `npm run dev`
2. Open `http://localhost:3000`
3. You should see a login/signup page
4. Create a new account:
   - Enter your email
   - Enter a password (min 6 characters)
   - Click "Sign Up"
5. Check your email for verification link
6. Click the verification link
7. Go back to the app and sign in
8. Start creating tasks!

## Features Enabled

✅ **User Authentication**
- Email/password signup
- Email verification
- Secure login/logout

✅ **Per-User Data**
- Each user sees only their own tasks
- Tasks are synced across devices
- Real-time updates (optional)

✅ **Security**
- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure API keys

## Troubleshooting

### "Invalid API key" error
- Check that you copied the correct anon key from Supabase
- Make sure there are no extra spaces in the `.env` file
- Restart the dev server after changing `.env`

### "Failed to create task" error
- Make sure you ran the SQL script to create the tasks table
- Check that RLS policies are created
- Verify you're logged in

### Email not received
- Check spam folder
- In Supabase dashboard, go to Authentication → Users to see if account was created
- You can manually verify users in the dashboard for testing

### Tasks not loading
- Open browser console (F12) and check for errors
- Verify your Supabase URL and key are correct
- Make sure the tasks table exists

## Optional: Enable Realtime

To enable real-time sync across devices:

1. In Supabase dashboard, go to **Database** → **Replication**
2. Find the `tasks` table
3. Enable replication
4. Tasks will now sync in real-time!

## Migration from LocalStorage

If you had tasks in localStorage before:

1. The old tasks won't automatically migrate
2. They're still in your browser's localStorage
3. You can manually recreate important tasks
4. Or export localStorage data and import to Supabase (advanced)

## Next Steps

- Customize email templates in Supabase
- Add profile pictures (Supabase Storage)
- Enable social auth (Google, GitHub, etc.)
- Add team collaboration features
- Set up database backups

## Support

If you encounter issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Check browser console for errors
3. Verify all SQL policies are created
4. Test with a fresh account