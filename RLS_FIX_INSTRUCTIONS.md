# 🔒 Fix RLS Policies for Products Table

## Problem
Products are timing out because Row Level Security (RLS) policies are blocking anonymous access to the `products` table.

## Solution
Run the SQL script `scripts/fix-products-rls.sql` in your Supabase SQL Editor.

## Step-by-Step Instructions

### 1. Open Supabase Dashboard
- Go to https://supabase.com/dashboard
- Select your project

### 2. Open SQL Editor
- Click on **SQL Editor** in the left sidebar
- Click **New Query**

### 3. Copy the SQL Script
Open the file `scripts/fix-products-rls.sql` and copy **ALL** of its contents.

### 4. Paste and Run
- Paste the SQL script into the SQL Editor
- Click **RUN** (or press Ctrl+Enter)
- Wait for the success message

### 5. Verify
- You should see: "Success. No rows returned" or similar success message
- If you see errors, check that:
  - You have admin access to the database
  - The `products` table exists
  - The `admin_users` table exists (for admin policies)

### 6. Test Your App
- Refresh your browser
- Products should now load without timing out
- Check console for: `✅ Success! Fetched X products`

## What the Script Does

1. **Drops existing conflicting policies** - Removes any old policies that might conflict
2. **Creates public read policy** - Allows ANYONE (anonymous or authenticated) to read products:
   ```sql
   CREATE POLICY "Anyone can read products" 
     ON products 
     FOR SELECT 
     USING (true);
   ```
3. **Protects write operations** - Only admins can create/update/delete products
4. **Enables RLS** - Ensures Row Level Security is active

## Troubleshooting

### If you get errors:

**Error: "relation admin_users does not exist"**
- If you don't have an `admin_users` table, you can modify the INSERT/UPDATE/DELETE policies to use a different check, or temporarily disable them.

**Error: "permission denied"**
- Make sure you're logged in as a Supabase project owner/admin
- Check that you have the correct database permissions

**Products still not loading after running script**
- Verify the policy was created: Go to **Authentication** → **Policies** → Check `products` table
- Check browser console for any new error messages
- Try clearing browser cache and hard refresh (Ctrl+Shift+R)

## Alternative: Disable RLS Temporarily (NOT RECOMMENDED FOR PRODUCTION)

If you need a quick test, you can temporarily disable RLS:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING:** This makes ALL products visible to everyone without any security. Only use for testing!

