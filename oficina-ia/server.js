// Oficina IA · servidor local
// Sirve la oficina, ejecuta tareas con el motor de IA y envía el resultado por correo.
const http = require('http');
const fs = require('fs');
const path = require('path');

loadEnv(path.join(__dirname, '.env'));

const PORT = +process.env.PORT || 8080;
const PROVIDER = (process.env.IA_PROVIDER || 'anthropic').toLowerCase();
const API_KEY = process.env.IA_API_KEY || '';
const MODEL = process.env.IA_MODEL || (PROVIDER === 'openai' ? 'gpt-4o-mini' : 'claude-sonnet-5');
const MAIL_TO = process.env.MAIL_TO || '';
const OFFICE_NAME = process.env.OFFICE_NAME || 'Oficina IA';

let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: +process.env.SMTP_PORT || 465,
    secure: (process.env.SMTP_PORT || '465') === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function systemPrompt(agent) {
  return `Eres ${agent.name}, integrante de "${OFFICE_NAME}". Tu rol: ${agent.role}. ${agent.description || ''}
Responde siempre en español, con un entregable completo, claro y listo para usar (usa títulos y listas cuando ayuden).
Nunca menciones qué empresa, modelo o proveedor de IA te impulsa; si te lo preguntan, di que eres un agente de ${OFFICE_NAME}.`;
}

// Llama al motor de IA en modo streaming y entrega cada fragmento a onText.
async function runAI(agent, task, onText) {
  const user = `Tarea: ${task.title}\n\nContexto: ${task.context || 'Sin contexto adicional.'}`;
  let url, headers, body;
  if (PROVIDER === 'openai') {
    url = process.env.IA_BASE_URL || 'https://api.openai.com/v1/chat/completions';
    headers = { 'content-type': 'application/json', authorization: `Bearer ${API_KEY}` };
    body = { model: MODEL, stream: true, messages: [{ role: 'system', content: systemPrompt(agent) }, { role: 'user', content: user }] };
  } else {
    url = 'https://api.anthropic.com/v1/messages';
    headers = { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' };
    body = { model: MODEL, max_tokens: 4096, stream: true, system: systemPrompt(agent), messages: [{ role: 'user', content: user }] };
  }
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`El motor de IA respondió ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const decoder = new TextDecoder();
  let buf = '', full = '';
  for await (const chunk of res.body) {
    buf += decoder.decode(chunk, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') continue;
      let ev;
      try { ev = JSON.parse(data); } catch { continue; }
      const text = PROVIDER === 'openai' ? ev.choices?.[0]?.delta?.content : ev.type === 'content_block_delta' ? ev.delta?.text : null;
      if (ev.type === 'error') throw new Error(ev.error?.message || 'Error del motor de IA');
      if (text) { full += text; onText(text); }
    }
  }
  return full;
}

const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function sendMail(to, agent, task, result) {
  if (!transporter) throw new Error('Correo no configurado (faltan SMTP_USER y SMTP_PASS en .env).');
  await transporter.sendMail({
    from: `"${agent.name} · ${OFFICE_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: `✅ ${task.title}`,
    text: `${agent.name} (${agent.role}) terminó tu tarea.\n\n${result}\n\n— ${OFFICE_NAME}`,
    html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:680px">
      <p style="color:#5e8d80;margin:0">${escHtml(OFFICE_NAME)}</p>
      <h2 style="margin:4px 0 2px">${escHtml(task.title)}</h2>
      <p style="color:#666;margin:0 0 16px">Entregado por <b>${escHtml(agent.name)}</b> · ${escHtml(agent.role)}</p>
      <div style="white-space:pre-wrap;line-height:1.5;border-left:4px solid #c9a24b;padding-left:14px">${escHtml(result)}</div>
    </div>`,
  });
}

function readBody(req) {
  return new Promise((ok, fail) => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 1e6) req.destroy(); });
    req.on('end', () => { try { ok(JSON.parse(d || '{}')); } catch (e) { fail(e); } });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url.startsWith('/?'))) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(__dirname, 'public.html')).pipe(res);
  }
  if (req.method === 'GET' && req.url === '/api/estado') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ia: !!API_KEY, correo: !!transporter, destinatario: MAIL_TO, oficina: OFFICE_NAME }));
  }
  if (req.method === 'POST' && req.url === '/api/tarea') {
    let input;
    try { input = await readBody(req); } catch { res.writeHead(400); return res.end(); }
    res.writeHead(200, { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-cache' });
    const send = o => res.write(JSON.stringify(o) + '\n');
    const agent = input.agent || { name: 'Agente', role: 'Asistente' };
    const task = { title: String(input.title || '').slice(0, 300), context: String(input.context || '').slice(0, 5000) };
    const to = input.email || MAIL_TO;
    try {
      if (!API_KEY) throw new Error('Motor de IA no configurado (falta IA_API_KEY en .env).');
      send({ tipo: 'estado', texto: 'Analizando la tarea…' });
      const result = await runAI(agent, task, t => send({ tipo: 'texto', texto: t }));
      send({ tipo: 'estado', texto: 'Entregable listo. Enviando correo…' });
      if (to) {
        try { await sendMail(to, agent, task, result); send({ tipo: 'correo', ok: true, texto: `Enviado a ${to}` }); }
        catch (e) { send({ tipo: 'correo', ok: false, texto: e.message }); }
      }
      send({ tipo: 'fin', resultado: result });
    } catch (e) {
      send({ tipo: 'error', texto: e.message });
    }
    return res.end();
  }
  res.writeHead(404); res.end('No encontrado');
});

server.listen(PORT, () => {
  console.log(`\n  ${OFFICE_NAME} lista →  http://localhost:${PORT}\n`);
  console.log(`  Motor IA: ${API_KEY ? 'configurado' : 'FALTA IA_API_KEY'} · Correo: ${transporter ? 'configurado' : 'FALTA SMTP_USER/SMTP_PASS'}\n`);
});
