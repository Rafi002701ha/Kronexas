exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    const messages = body.messages || [];
    const systemPrompt = body.system || '';

    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const geminiBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: geminiMessages,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      }
    );

    const data = await response.json();

    // Log full response for debugging
    console.log('Gemini status:', response.status);
    console.log('Gemini response:', JSON.stringify(data));

    // Check for API error
    if (data.error) {
      console.log('Gemini error:', data.error.message);
      return {
        statusCode: 200,
        body: JSON.stringify({
          content: [{ type: 'text', text: `API Error: ${data.error.message}` }]
        })
      };
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.';

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: [{ type: 'text', text: text }]
      })
    };

  } catch (error) {
    console.log('Catch error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to reach Gemini API: ' + error.message })
    };
  }
};
