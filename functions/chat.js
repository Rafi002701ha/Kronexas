export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const messages = body.messages || [];
    const systemPrompt = body.system || '';

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return new Response(
        JSON.stringify({ content: [{ type: 'text', text: `Error: ${data.error.message}` }] }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const text = data?.choices?.[0]?.message?.content || 'I could not generate a response.';

    return new Response(
      JSON.stringify({ content: [{ type: 'text', text }] }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to reach Groq API: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}