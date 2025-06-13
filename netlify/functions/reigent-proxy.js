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

    // Check for both possible environment variable names
    const authToken = userToken || process.env.REIGENT_SECRET || process.env.VITE_REIGENT_SECRET || process.env.VITE_REI_API_KEY;
    
    if (!authToken) {
      console.error('No authentication token found. Available env vars:', Object.keys(process.env).filter(key => key.includes('REI') || key.includes('REIGENT')));
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'No authentication token available',
          debug: 'Check environment variable configuration'
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