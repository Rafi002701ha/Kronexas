exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    // Convert Anthropic format to Gemini format
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      }
    );

    const data = await response.json();

    // Convert Gemini response back to Anthropic format
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.';

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: [{ type: 'text', text: text }]
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to reach Gemini API' })
    };
  }
};
