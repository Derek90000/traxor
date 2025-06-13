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

    // Use the secret from environment variables
    const authToken = userToken || process.env.REIGENT_SECRET;
    
    if (!authToken) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'No authentication token available' })
      };
    }

    console.log(`Making request to: https://api.reisearch.box${endpoint}`);

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