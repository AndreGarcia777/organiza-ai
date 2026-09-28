import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

// Carregador pequeno de .env para evitar dependências no MVP. Variáveis já definidas
// no ambiente têm prioridade (ideal para deploy e CI).
try {
  const envFile = await readFile(join(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
} catch { /* .env é opcional */ }

const port = process.env.PORT || 3000;
const publicDir = join(process.cwd(), 'public');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

const systemPrompt = `Você é o Organiza, um assistente de finanças pessoais brasileiro, educativo e acolhedor.
Entenda lançamentos e metas a partir de linguagem natural. Não invente valores. Use linguagem simples.
Nunca dê aconselhamento financeiro profissional, promessas de retorno ou sugestões de investimento. Responda sempre em JSON válido, sem markdown, no formato:
{"reply":"mensagem curta", "transaction":{"type":"expense|income", "amount":number, "category":"Alimentação|Transporte|Moradia|Saúde|Lazer|Educação|Contas|Compras|Outros", "description":"texto"}|null, "goal":{"name":"texto", "target":number, "deadline":"texto"}|null}`;

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

async function askOpenAI(message) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', instructions: systemPrompt, input: message, store: false })
  });
  if (!response.ok) throw new Error('Não foi possível consultar a OpenAI.');
  const data = await response.json();
  return JSON.parse(data.output_text);
}

async function askGemini(message) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: 'user', parts: [{ text: message }] }], generationConfig: { responseMimeType: 'application/json' } })
  });
  if (!response.ok) throw new Error('Não foi possível consultar o Gemini.');
  const data = await response.json();
  return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/assistant') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body || '{}');
        if (!message?.trim()) return json(res, 400, { error: 'Envie uma mensagem.' });
        const provider = process.env.AI_PROVIDER || 'demo';
        if (provider === 'openai' && process.env.OPENAI_API_KEY) return json(res, 200, await askOpenAI(message));
        if (provider === 'gemini' && process.env.GEMINI_API_KEY) return json(res, 200, await askGemini(message));
        return json(res, 200, { demo: true });
      } catch (error) { return json(res, 502, { error: error.message || 'A IA não respondeu agora.' }); }
    });
    return;
  }
  const requested = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const file = normalize(join(publicDir, requested));
  if (!file.startsWith(publicDir)) { res.writeHead(403); return res.end(); }
  try { const content = await readFile(file); res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }); res.end(content); }
  catch { res.writeHead(404); res.end('Página não encontrada'); }
});

server.listen(port, () => console.log(`Organiza AI disponível em http://localhost:${port}`));
