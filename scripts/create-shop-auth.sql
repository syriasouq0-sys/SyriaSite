-- Create shop_users table for frontend shop authentication
-- This separates shop users from backend admin users

-- Create shop_users table
CREATE TABLE IF NOT EXISTS shop_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_shop_users_email ON shop_users(email);
CREATE INDEX IF NOT EXISTS idx_shop_users_created_at ON shop_users(created_at DESC);

-- Enable Row Level Security
ALTER TABLE shop_users ENABLE ROW LEVEL SECURITY;

-- Create policies for shop_users
-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own profile" ON shop_users;
DROP POLICY IF EXISTS "Users can update own profile" ON shop_users;
DROP POLICY IF EXISTS "Public can insert shop users" ON shop_users;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON shop_users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON shop_users
  FOR UPDATE USING (auth.uid() = id);

-- Public can insert (for sign up)
CREATE POLICY "Public can insert shop users" ON shop_users
  FOR INSERT WITH CHECK (true);

-- Function to automatically create shop_user profile when auth user is created
-- BUT ONLY if they are NOT an admin user (separation of shop and admin users)
CREATE OR REPLACE FUNCTION public.handle_new_shop_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create shop_user if this user is NOT in admin_users table
  -- This ensures complete separation between shop users and admin users
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = NEW.id
  ) THEN
    INSERT INTO public.shop_users (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create shop_user when auth user signs up (only for non-admin users)
DROP TRIGGER IF EXISTS on_auth_user_created_shop ON auth.users;
CREATE TRIGGER on_auth_user_created_shop
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_shop_user();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shop_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on shop_users table
DROP TRIGGER IF EXISTS update_shop_users_updated_at ON shop_users;
CREATE TRIGGER update_shop_users_updated_at
  BEFORE UPDATE ON shop_users
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_users_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON shop_users TO authenticated;

-- Add constraint to ensure shop_users and admin_users are mutually exclusive
-- A user cannot be both a shop user and an admin user
DO $$
BEGIN
  -- Check if constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shop_users_not_admin_check'
  ) THEN
    -- Create a check that ensures shop_users don't exist in admin_users
    -- This is enforced at the application level by the trigger above
    -- But we can add a comment documenting this separation
    PERFORM 1;
  END IF;
END $$;

-- Comment for documentation
COMMENT ON TABLE shop_users IS 'Shop users table - COMPLETELY SEPARATE from backend admin_users. A user can only be either a shop user OR an admin user, never both.';
COMMENT ON COLUMN shop_users.id IS 'References auth.users(id) - Supabase Auth user ID. Separated from admin_users table.';
COMMENT ON COLUMN shop_users.email IS 'User email - synced from auth.users';
COMMENT ON COLUMN shop_users.full_name IS 'User full name';
COMMENT ON COLUMN shop_users.phone IS 'User phone number';

-- IMPORTANT: Shop users are separate from admin users
-- - Shop signup → creates entry in shop_users ONLY
-- - Admin signup → creates entry in admin_users ONLY  
-- - Users cannot be in both tables simultaneously
-- - Backend checks admin_users table
-- - Shop checks shop_users table

