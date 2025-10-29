# 🔍 Troubleshooting RLS Policy Issues

## Current Status
Your products query is **timing out after 8 seconds**, which means RLS policies are blocking access.

## Step-by-Step Fix

### Step 1: Run Diagnostic Script
1. Open Supabase Dashboard → SQL Editor
2. Run `scripts/diagnose-rls.sql` 
3. Check the results:
   - Does the `products` table exist?
   - Is RLS enabled?
   - What policies currently exist?
   - Is there a SELECT policy that allows anonymous access?

### Step 2: Check Current Policies
In Supabase Dashboard:
1. Go to **Authentication** → **Policies**
2. Find the `products` table
3. Check what policies exist
4. Look for a policy named **"Anyone can read products"**
   - If it exists: Check if it has `USING (true)` condition
   - If it doesn't exist: This is the problem!

### Step 3: Run Fix Script
1. Run `scripts/fix-products-rls.sql` in SQL Editor
2. You should see: `✅ Successfully created "Anyone can read products" policy`
3. If you get errors, check:
   - Do you have admin access?
   - Does the `products` table exist?
   - Are there conflicting policies?

### Step 4: Verify Fix
After running the fix script, run `scripts/verify-rls-policies.sql` to confirm:
- Policy exists
- Policy allows SELECT
- Query works

### Step 5: Test in Browser
1. Refresh your browser
2. Check console for: `✅ Success! Fetched X products`
3. Products should display

## Common Issues

### Issue: "Policy already exists"
- **Solution**: The fix script now drops existing policies first. Run it again.

### Issue: Query still times out after running script
- **Possible causes**:
  1. Script didn't complete successfully
  2. Another policy is blocking (check all policies)
  3. RLS is enabled but no SELECT policy exists
  4. Policy exists but has wrong conditions

### Issue: Table not found
- Check if table name is exactly `products` (case-sensitive)
- Check if table is in `public` schema
- If table is in different schema, update the script

## Quick Test Query
Run this directly in Supabase SQL Editor to test if products are accessible:
```sql
SELECT COUNT(*) FROM products;
```
- If this works: RLS is OK, issue is elsewhere
- If this times out: RLS is blocking, need to fix policies
- If this errors: Table doesn't exist or wrong schema

