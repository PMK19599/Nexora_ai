import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export const getClaudeClient = (): Anthropic => {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
  return client;
};

export const askClaude = async (prompt: string, system = 'You are an expert AI education assistant.', maxTokens = 4096): Promise<string> => {
  const c = getClaudeClient();
  const msg = await c.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
  });
  const block = msg.content.find((b) => b.type === 'text');
  return block ? block.text : '';
};

export const askClaudeJSON = async <T>(prompt: string, system = 'You are an expert AI education assistant. Always respond with valid JSON only, no markdown.', maxTokens = 4096): Promise<T> => {
  const raw = await askClaude(prompt, system, maxTokens);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (e: any) {
    throw new Error(`Claude returned invalid JSON: ${e.message}. Response preview: "${cleaned.substring(0, 200)}"`);
  }
};
