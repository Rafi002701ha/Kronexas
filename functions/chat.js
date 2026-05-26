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
        model: 'model:'llama-3.3-70b-versatile',',
        messages: groqMessages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
    return new Response(
      JSON.stringify({ content: [{ type: 'text', text }] }),
      { headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }}
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ content: [{ type: 'text', text: 'Error: ' + error.message }] }),
      { status: 500, headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }}
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
