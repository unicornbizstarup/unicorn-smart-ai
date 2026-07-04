async function main() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  
  // Test with standard v1beta API
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'ping' }] }],
      }),
    });

    console.log('Gemini API v1beta Status with NEW key:', res.status);
    const data = await res.json();
    if (res.status === 200) {
      console.log('Success! Response text:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      console.log('Error Data:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

main();
