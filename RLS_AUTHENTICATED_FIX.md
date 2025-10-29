# Fix: Products Not Loading When Signed In

## Problem

When users are signed in, products (both featured and store products) are not fetching. However, when signed out, products load normally.

## Root Cause

This is a **Row Level Security (RLS) policy issue**. When a user is signed in, Supabase treats their requests as coming from the `authenticated` role instead of the `public` (anonymous) role. 

The existing RLS policies may only allow anonymous users (`public` role) to read products, but not explicitly allow authenticated users (`authenticated` role).

## Solution

We need to create **explicit RLS policies** that allow **BOTH** anonymous and authenticated users to read products.

## How to Fix

1. **Open your Supabase Dashboard**
   - Go to SQL Editor

2. **Run the fix script**
   - Copy and paste the contents of `scripts/FIX-RLS-AUTHENTICATED-USERS.sql`
   - Click "Run" or press Ctrl+Enter

3. **Verify the fix**
   - The script will display verification queries showing the policies were created
   - You should see two SELECT policies:
     - "Anonymous can read products" (for `public` role)
     - "Authenticated can read products" (for `authenticated` role)

4. **Test**
   - Refresh your browser while signed in
   - Products should now load correctly
   - Sign out and verify products still load (should work as before)

## What the Script Does

1. Drops all existing conflicting policies on the `products` table
2. Ensures RLS is enabled
3. Creates an explicit policy for anonymous users (`public` role)
4. Creates an explicit policy for authenticated users (`authenticated` role)
5. Creates admin-only write policies (if `admin_users` table exists)
6. Verifies the policies were created correctly

## Technical Details

In Supabase/PostgreSQL RLS:
- **`public` role**: Anonymous users (not signed in)
- **`authenticated` role**: Signed-in users

When you create a policy without specifying `TO`, it defaults to `PUBLIC`, but Supabase may handle this differently. Creating explicit policies for both roles ensures reliable access regardless of authentication state.

## Verification Query

After running the script, you can verify the policies exist with:

```sql
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
AND cmd = 'SELECT';
```

You should see two policies:
1. One with `roles = '{public}'` (anonymous users)
2. One with `roles = '{authenticated}'` (authenticated users)

## If Problems Persist

If products still don't load after running the script:

1. Check the browser console for any RLS errors
2. Verify the policies were created: Run the verification query above
3. Check that RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'products';`
4. Try refreshing the page or clearing browser cache

