// Oficina IA · puente local
// Da a la oficina las mismas capacidades que en el link (IA, descargas, historial),
// pero usando el servidor local y tu propia clave: la IA puede ver imágenes.
(function () {
  const IMG_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const toBase64 = blob => new Promise((ok, ko) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(',')[1]);
    r.onerror = () => ko(r.error);
    r.readAsDataURL(blob);
  });

  async function streamRound(body, signal, onDelta) {
    const res = await fetch('/api/sample', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal });
    if (!res.ok) throw Object.assign(new Error(await res.text()), { code: 'server_error' });
    const reader = res.body.getReader(), dec = new TextDecoder();
    let buf = '', done = null;
    for (;;) {
      const { value, done: end } = await reader.read();
      if (end) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const ev = JSON.parse(buf.slice(0, i));
        buf = buf.slice(i + 1);
        if (ev.t === 'text') onDelta(ev.d);
        else if (ev.t === 'done') done = ev;
        else if (ev.t === 'error') throw Object.assign(new Error(ev.message), { code: 'server_error' });
      }
    }
    if (!done) throw Object.assign(new Error('Respuesta incompleta del servidor'), { code: 'server_error' });
    return done;
  }

  async function sample(input, opts = {}) {
    const turns = typeof input === 'string' ? [{ role: 'user', content: input }] : input.map(t => ({ ...t }));
    const messages = turns.map(t => ({ role: t.role, content: [{ type: 'text', text: t.content }] }));
    const imgs = opts.images ? [...(opts.images instanceof Blob ? [opts.images] : opts.images)] : [];
    if (imgs.length) {
      const last = messages[messages.length - 1];
      const blocks = [];
      for (const b of imgs) blocks.push({ type: 'image', source: { type: 'base64', media_type: IMG_TYPES.includes(b.type) ? b.type : 'image/png', data: await toBase64(b) } });
      last.content = [...blocks, ...last.content];
    }
    const tools = opts.tools || [];
    const toolDefs = tools.map(t => ({ name: t.name, description: t.description, input_schema: t.inputSchema || { type: 'object', properties: {} } }));
    let text = '';
    for (let round = 0; round < 40; round++) {
      const done = await streamRound({ messages, tools: toolDefs, modelTier: opts.modelTier }, opts.signal, d => {
        text += d;
        opts.onText && opts.onText({ text, delta: d });
      });
      messages.push({ role: 'assistant', content: done.content });
      const calls = done.content.filter(c => c.type === 'tool_use');
      if (done.stop_reason !== 'tool_use' || !calls.length) return { text, truncated: done.stop_reason === 'max_tokens' };
      const results = [];
      for (const c of calls) {
        const tool = tools.find(t => t.name === c.name);
        try {
          const out = tool ? await tool.execute(c.input || {}) : { error: 'Herramienta desconocida' };
          results.push({ type: 'tool_result', tool_use_id: c.id, content: JSON.stringify(out ?? null).slice(0, 60000) });
        } catch (e) {
          results.push({ type: 'tool_result', tool_use_id: c.id, is_error: true, content: String(e && e.message || e) });
        }
      }
      messages.push({ role: 'user', content: results });
      if (text && !text.endsWith('\n')) { text += '\n\n'; opts.onText && opts.onText({ text, delta: '\n\n' }); }
    }
    return { text, truncated: true };
  }
  sample.limits = async () => ({ maxInputBytes: 900000, images: { maxCount: 20, mediaTypes: IMG_TYPES } });
  sample.json = async (input, opts) => JSON.parse((await sample(input, opts)).text.replace(/^```(json)?|```$/g, ''));

  const downloads = {
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data]);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      return { saved: true };
    },
  };

  const api = (path, body) => fetch(path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : undefined).then(r => r.json());
  const snap = (id, data) => ({ id, exists: !!data, data: () => data });
  const db = {
    collection(name) {
      return {
        async get() {
          const docs = await api('/api/db/' + encodeURIComponent(name));
          const list = Object.entries(docs).map(([id, d]) => snap(id, d));
          return { docs: list, size: list.length, empty: !list.length };
        },
        doc(id) {
          return {
            async get() { const docs = await api('/api/db/' + encodeURIComponent(name)); return snap(id, docs[id]); },
            async set(data) { await api('/api/db/' + encodeURIComponent(name), { id, data }); },
            async delete() { await api('/api/db/' + encodeURIComponent(name), { id, data: null }); },
          };
        },
      };
    },
  };

  const assets = {
    async upload(blob) {
      const res = await fetch('/api/blob', { method: 'POST', headers: { 'content-type': blob.type || 'application/octet-stream' }, body: blob });
      if (!res.ok) throw Object.assign(new Error(await res.text()), { code: 'upstream_error' });
      const { id } = await res.json();
      return { id, url: '/_blob/' + id, sizeBytes: blob.size, contentType: blob.type };
    },
  };

  const caps = { sample, downloads, db, assets };
  window.claude = { use: async name => caps[name] || null };
})();
