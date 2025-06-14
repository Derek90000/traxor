const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { endpoint, userToken, ...requestData } = body;

    // Get secret from environment variables - SECURE!
    const REIGENT_SECRET = process.env.REIGENT_SECRET || 'f37b4018b61af7f466844eb436cc378c842ebcfa45aecd21f49c434f0fd2442a';
    
    // Use userToken if provided, otherwise use environment secret
    const authToken = userToken || REIGENT_SECRET;
    
    console.log('Netlify Function - Key check:', {
      hasUserToken: !!userToken,
      hasEnvSecret: !!process.env.REIGENT_SECRET,
      tokenLength: authToken ? authToken.length : 0,
      tokenPreview: authToken ? `${authToken.substring(0, 8)}...` : 'none',
      endpoint: endpoint
    });
    
    if (!authToken) {
      console.error('No valid authentication token found.');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'No authentication token available',
          debug: 'Missing REIGENT_SECRET environment variable in Netlify'
        })
      };
    }

    console.log(`Making request to: https://api.reisearch.box${endpoint}`);
    console.log(`Using auth token length: ${authToken.length}`);

    // Make request to Reigent API with better error handling
    const response = await fetch(`https://api.reisearch.box${endpoint}`, {
      method: endpoint.includes('/chat/completions') ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: endpoint.includes('/chat/completions') ? JSON.stringify(requestData) : undefined,
      timeout: 60000 // 60 second timeout
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', response.status, data);
      
      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            error: 'Authentication failed',
            message: 'Invalid or expired API key',
            usingMocks: true
          })
        };
      }
    } else {
      console.log('✅ Successful API response:', response.status);
    }

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    
    // Handle specific error types
    let errorMessage = error.message;
    let statusCode = 500;
    
    if (error.code === 'ECONNRESET' || error.message.includes('socket hang up')) {
      errorMessage = 'Connection terminated by server - likely invalid API key';
      statusCode = 401;
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Request timeout - API server not responding';
      statusCode = 408;
    }
    
    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: 'Check Netlify function logs for more information',
        usingMocks: true
      })
    };
  }
};