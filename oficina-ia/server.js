// Oficina IA · servidor local
// Sirve la oficina y hace de puente con el motor de IA usando tu propia clave.
const http = require('http');
const fs = require('fs');
const path = require('path');

loadEnv(path.join(__dirname, '.env'));

const PORT = +process.env.PORT || 8080;
const API_KEY = process.env.IA_API_KEY || '';
const MODEL = process.env.IA_MODEL || 'claude-sonnet-5';
const MAX_TOKENS = +process.env.IA_MAX_TOKENS || 16000;
const DB_FILE = path.join(__dirname, 'datos', 'historial.json');

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function readBody(req, limit = 60e6) {
  return new Promise((ok, fail) => {
    const chunks = [];
    let size = 0;
    req.on('data', c => { size += c.length; if (size > limit) { req.destroy(); fail(new Error('Petición demasiado grande')); } else chunks.push(c); });
    req.on('end', () => { try { ok(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch (e) { fail(e); } });
  });
}

// ---------- IA ----------
async function sample(body, send) {
  if (!API_KEY) throw new Error('Falta IA_API_KEY en el archivo .env');
  const res = await fetch(process.env.IA_BASE_URL || 'https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      stream: true,
      messages: body.messages,
      ...(body.tools && body.tools.length ? { tools: body.tools } : {}),
    }),
  });
  if (!res.ok) throw new Error(`El motor de IA respondió ${res.status}: ${(await res.text()).slice(0, 400)}`);

  const content = [];
  let stop = null, buf = '';
  const dec = new TextDecoder();
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      let ev;
      try { ev = JSON.parse(line.slice(5)); } catch { continue; }
      if (ev.type === 'content_block_start') {
        const b = { ...ev.content_block };
        if (b.type === 'tool_use') b._json = '';
        content[ev.index] = b;
      } else if (ev.type === 'content_block_delta') {
        const b = content[ev.index];
        if (ev.delta.type === 'text_delta') { b.text = (b.text || '') + ev.delta.text; send({ t: 'text', d: ev.delta.text }); }
        else if (ev.delta.type === 'input_json_delta') b._json += ev.delta.partial_json;
      } else if (ev.type === 'content_block_stop') {
        const b = content[ev.index];
        if (b && b.type === 'tool_use') { try { b.input = b._json ? JSON.parse(b._json) : {}; } catch { b.input = {}; } delete b._json; }
      } else if (ev.type === 'message_delta') {
        stop = ev.delta.stop_reason;
      } else if (ev.type === 'error') {
        throw new Error(ev.error && ev.error.message || 'Error del motor de IA');
      }
    }
  }
  // Solo se devuelven bloques que la API acepta de vuelta en el historial.
  const clean = content.filter(Boolean).filter(b => b.type === 'text' || b.type === 'tool_use');
  send({ t: 'done', content: clean, stop_reason: stop });
}

// ---------- Historial ----------
function loadDb() { try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return {}; } }
function saveDb(db) { fs.mkdirSync(path.dirname(DB_FILE), { recursive: true }); fs.writeFileSync(DB_FILE, JSON.stringify(db)); }

// ---------- Página ----------
function page() {
  const html = fs.readFileSync(path.join(__dirname, 'oficina-link.html'), 'utf8');
  return html.replace(/<head>/i, '<head><script src="/local-shim.js"></script>');
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(page());
    }
    if (req.method === 'GET' && url.pathname === '/local-shim.js') {
      res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8' });
      return fs.createReadStream(path.join(__dirname, 'local-shim.js')).pipe(res);
    }
    if (req.method === 'POST' && url.pathname === '/api/sample') {
      const body = await readBody(req);
      res.writeHead(200, { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-cache' });
      const send = o => res.write(JSON.stringify(o) + '\n');
      try { await sample(body, send); } catch (e) { send({ t: 'error', message: e.message }); }
      return res.end();
    }
    const m = url.pathname.match(/^\/api\/db\/([\w.-]+)$/);
    if (m) {
      const db = loadDb();
      const col = db[m[1]] = db[m[1]] || {};
      if (req.method === 'POST') {
        const { id, data } = await readBody(req, 5e6);
        if (data === null) delete col[id]; else col[id] = data;
        saveDb(db);
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(col));
    }
    res.writeHead(404); res.end('No encontrado');
  } catch (e) {
    res.writeHead(500); res.end(e.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n  Oficina IA lista  →  http://localhost:${PORT}\n`);
  console.log(`  Motor IA: ${API_KEY ? 'configurado (' + MODEL + ')' : 'FALTA IA_API_KEY en .env'}\n`);
});
