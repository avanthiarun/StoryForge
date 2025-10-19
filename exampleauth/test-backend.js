const axios = require('axios');

// Test script to verify the backend is working
async function testBackend() {
  const baseURL = 'http://localhost:3001';
  
  console.log('🧪 Testing Atlassian Auth Backend...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test auth URL generation
    console.log('\n2. Testing auth URL generation...');
    const authResponse = await axios.get(`${baseURL}/api/auth/atlassian`);
    console.log('✅ Auth URL generated successfully');
    console.log('🔗 Auth URL:', authResponse.data.authUrl);
    
    // Test user profile (should fail without auth)
    console.log('\n3. Testing user profile endpoint (should fail)...');
    try {
      await axios.get(`${baseURL}/api/user/profile`);
      console.log('❌ Unexpected: User profile accessible without auth');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ User profile correctly protected (401 Unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    console.log('\n🎉 Backend tests completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure your .env file has the correct Atlassian credentials');
    console.log('2. Start the frontend with: npm run frontend');
    console.log('3. Open http://localhost:3000 in your browser');
    console.log('4. Click "Connect with Atlassian" to test the full flow');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend is running:');
      console.log('   cd backend && npm run dev');
    }
  }
}

// Run the test
testBackend();
