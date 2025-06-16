const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const requestBody = JSON.parse(event.body);
    
    // Use the hardcoded secret key
    const REI_SECRET_KEY = 'f37b4018b61af7f466844eb436cc378c842ebcfa45aecd21f49c434f0fd2442a';
    
    console.log('Making request to REI API...');

    // Make request to REI API
    const response = await fetch('https://api.reisearch.box/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${REI_SECRET_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('REI API Error:', response.status, data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'REI API error',
          details: data
        })
      };
    }

    console.log('✅ Successful REI API response');
    return {
      statusCode: 200,
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