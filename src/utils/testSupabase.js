// Simple script to test Supabase connection
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

// Create the client with service role key for admin access
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

async function testSupabaseConnection() {
  console.log('Attempting to connect to Supabase with service role key...');
  
  try {
    // Try auth check first
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth connection error:', authError.message);
      return false;
    }
    
    console.log('✅ Supabase auth connection successful!');
    console.log('Auth state:', authData.session ? 'Has session' : 'No session');
    
    // Create a simple test table using the Supabase API
    console.log('Attempting to create a test table...');
    
    // First try a simple SQL query to check if the table exists
    const { error: sqlError } = await supabase.rpc(
      'test_connection_status',
      {},
      { count: 'exact' }
    );
    
    let dbTestPassed = false;
    let createTableError = null;
    
    if (sqlError) {
      // Create the test table if RPC function doesn't exist
      console.log('Creating test table directly...');
      
      const { error: insertError } = await supabase
        .from('test_connection')
        .upsert(
          { 
            id: 1, 
            test_message: 'Connection successful', 
            created_at: new Date().toISOString() 
          },
          { onConflict: 'id' }
        );
      
      if (insertError) {
        console.error('❌ Error creating/updating test table:', insertError.message);
        createTableError = insertError;
        
        if (insertError.code === '42P01') { // relation does not exist
          console.log('Table does not exist. Trying to create it...');
          
          // Create table with a direct call (simplified approach)
          try {
            const createTableResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({
                name: 'test_connection',
                schema: 'public',
                columns: [
                  { name: 'id', type: 'int4', primaryKey: true },
                  { name: 'test_message', type: 'text' },
                  { name: 'created_at', type: 'timestamptz' }
                ]
              })
            });
            
            if (createTableResponse.ok) {
              console.log('✅ Successfully created test table!');
              dbTestPassed = true;
            } else {
              console.error('❌ Failed to create table via API:', await createTableResponse.text());
            }
          } catch (fetchError) {
            console.error('❌ Failed to create table via API:', fetchError.message);
          }
        }
      } else {
        console.log('✅ Successfully created/updated test record!');
        dbTestPassed = true;
      }
    } else {
      console.log('✅ Connection test successful via RPC function!');
      dbTestPassed = true;
    }
    
    // Check storage buckets (a good way to test service role permissions)
    console.log('Checking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing storage buckets:', bucketsError.message);
    } else {
      console.log('✅ Successfully listed storage buckets!');
      console.log(`Found ${buckets.length} storage buckets`);
      if (buckets.length > 0) {
        console.log('Bucket names:');
        buckets.forEach(bucket => console.log(`- ${bucket.name}`));
      }
    }
    
    console.log('\n📊 Connection Test Summary:');
    console.log('1. Auth API: ✅ Connected successfully');
    console.log(`2. Database: ${dbTestPassed ? '✅ Connected successfully' : '❌ Issues detected'}`);
    console.log(`3. Storage: ${bucketsError ? '❌ Issues detected' : '✅ Connected successfully'}`);
    
    const overallStatus = (authError === null && dbTestPassed && bucketsError === null) 
      ? '✅ PASSED: Your Supabase connection is working correctly!' 
      : '⚠️ PARTIAL: Your Supabase connection works but with some limitations.';
    
    console.log(`\n${overallStatus}`);
    
    return true;
  } catch (err) {
    console.error('❌ Unexpected error testing Supabase connection:', err);
    return false;
  }
}

// Execute the test
testSupabaseConnection();