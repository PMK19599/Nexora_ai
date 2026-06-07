import { askClaudeJSON } from '../config/claude';

export const askAI = async <T>(
  prompt: string,
  fallbackFn: () => T,
  systemPrompt = 'You are an expert AI education assistant. ALWAYS respond with valid JSON only. No markdown, no explanation, just the JSON object.'
): Promise<T> => {
  // Option 1: Groq API (FREE — llama3)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && groqKey.length > 10) {
    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });
      if (resp.ok) {
        const json: any = await resp.json();
        const text = json.choices?.[0]?.message?.content || '';
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned) as T;
      }
    } catch (e: any) {
      console.warn('Groq API failed:', e.message);
    }
  }

  // Option 2: Claude API
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  if (claudeKey && claudeKey.length > 10) {
    try {
      return await askClaudeJSON<T>(prompt, systemPrompt);
    } catch (e: any) {
      console.warn('Claude API failed:', e.message);
    }
  }

  // Option 3: Fallback
  return fallbackFn();
};

export const getEmbedding = async (text: string): Promise<number[]> => {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.length > 10) {
    try {
      const resp = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text
        })
      });
      if (resp.ok) {
        const json = await resp.json() as any;
        return json.data[0].embedding;
      }
    } catch (e: any) {
      console.warn('OpenAI Embeddings API failed:', e.message);
    }
  }

  // Fallback: Deterministic vector generation of length 384
  const vectorSize = 384;
  const vector = new Array(vectorSize).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);

  for (const word of words) {
    if (!word) continue;
    let hash = 0;
    for (let charIndex = 0; charIndex < word.length; charIndex++) {
      hash = (hash << 5) - hash + word.charCodeAt(charIndex);
      hash |= 0;
    }
    const index = Math.abs(hash) % vectorSize;
    vector[index] += 1;
  }

  // Normalize vector (L2 norm)
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < vectorSize; i++) {
      vector[i] /= magnitude;
    }
  }

  return vector;
};
