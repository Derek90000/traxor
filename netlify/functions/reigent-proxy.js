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

    // HARDCODED SECRET KEY FOR TESTING - Replace with your actual key
    const HARDCODED_SECRET = 'your_secret_key_here'; // Replace this with your actual secret key
    
    // Use userToken if provided, otherwise use hardcoded secret
    const authToken = userToken || HARDCODED_SECRET;
    
    console.log('Netlify Function - Key check:', {
      hasUserToken: !!userToken,
      hasHardcodedSecret: !!HARDCODED_SECRET && HARDCODED_SECRET !== 'your_secret_key_here',
      tokenLength: authToken ? authToken.length : 0,
      tokenPreview: authToken && authToken !== 'your_secret_key_here' ? `${authToken.substring(0, 8)}...` : 'placeholder',
      endpoint: endpoint
    });
    
    if (!authToken || authToken === 'your_secret_key_here') {
      console.error('No valid authentication token found. Please replace the hardcoded secret key.');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'No authentication token available',
          debug: 'Please replace "your_secret_key_here" with your actual Reigent secret key in the Netlify function'
        })
      };
    }

    console.log(`Making request to: https://api.reisearch.box${endpoint}`);
    console.log(`Using auth token length: ${authToken.length}`);

    // Make request to Reigent API
    const response = await fetch(`https://api.reisearch.box${endpoint}`, {
      method: endpoint.includes('/chat/completions') ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: endpoint.includes('/chat/completions') ? JSON.stringify(requestData) : undefined
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', response.status, data);
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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        details: 'Check Netlify function logs for more information'
      })
    };
  }
};