-- =============================================
-- AI Workspace - Database Schema (Supabase/PostgreSQL)
-- =============================================

-- Users (synced from Clerk)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free', -- free, pro_monthly, pro_yearly, enterprise
  credits_used INT DEFAULT 0,
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat History
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  model TEXT DEFAULT 'openrouter/auto',
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files / Cloud Storage
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  storage_path TEXT,
  folder TEXT DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (Document Editor)
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  title TEXT DEFAULT 'Untitled',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PDF Tools History
CREATE TABLE IF NOT EXISTS pdf_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  type TEXT, -- merge, split, compress, convert
  status TEXT DEFAULT 'pending',
  input_file TEXT,
  output_file TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions / Payments
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  plan TEXT,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  bkash_transaction_id TEXT,
  nagad_transaction_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chats_user ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_files_user ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
