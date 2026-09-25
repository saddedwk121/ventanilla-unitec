# Publicar tu Oficina IA en tu propio dominio privado (guía desde cero)

**Resultado final:** entras a `https://oficina.tu-dominio.com`, te pide usuario y contraseña, y solo las
personas que tú autorices pueden entrar. Cada persona ve únicamente sus tareas y archivos. Cuando le pides
un cambio a Claude en el chat, la página se actualiza sola en 1–2 minutos.

## Conceptos (en 30 segundos)
- **GitHub**: donde está guardado el código. Claude sube ahí cada cambio.
- **Render**: una computadora en internet que ejecuta tu oficina 24/7 y le da una dirección web.
- **Dominio**: el nombre bonito (`tu-dominio.com`) que compras y apuntas a Render.
- **Clave de IA**: la "llave" que permite a los agentes pensar; se paga por uso.

## Costos
| Qué | Dónde | Costo |
|---|---|---|
| Hospedaje | Render | Gratis para empezar · 7 USD/mes (Starter) para que nunca se duerma |
| Dominio | Cloudflare o Porkbun | .com ≈ 10–11 USD/año · .xyz/.site ≈ 2–5 USD primer año |
| IA | console.anthropic.com | Pago por uso, con límite mensual que tú pones |

---

## PASO 1 · Clave de IA (10 min)
1. Abre https://console.anthropic.com → **Sign up** (con tu correo).
2. Menú **Billing** → **Add credits** → agrega 5 o 10 USD con tu tarjeta.
3. Menú **Limits** → pon un **límite mensual** (por ejemplo 20 USD) para no llevarte sorpresas.
4. Menú **API Keys** → **Create Key** → nombre `oficina` → **copia la clave** (empieza con `sk-ant-`) y guárdala en un lugar seguro. Solo se muestra una vez.

## PASO 2 · Decide quién puede entrar (2 min)
Escribe en un bloc de notas una línea así, con una cuenta por persona separadas por comas:
```
jose:MiClaveLarga2026!,ana:OtraClaveDeAna#77,luis:ClaveDeLuis$55
```
- Formato: `usuario:contraseña`. Sin espacios. Contraseñas largas (12+ caracteres).
- Para agregar o quitar personas después, solo cambias esta línea en Render (Paso 3.6).

## PASO 3 · Publicar en Render (15 min)
1. Abre https://render.com → **Get Started** → **GitHub** (entra con tu cuenta de GitHub `saddedwk121`).
2. Render pide permiso para ver tus repositorios → elige **Only select repositories** → `ventanilla-unitec` → **Install**.
3. En el panel de Render: botón **New +** → **Blueprint**.
4. Elige el repositorio `ventanilla-unitec`. Render encuentra el archivo `render.yaml` y te muestra el servicio `oficina-ia`.
5. Te pide dos valores:
   - `IA_API_KEY` → pega la clave del Paso 1.
   - `APP_USERS` → pega la línea del Paso 2.
6. Clic en **Apply**. Espera 2–3 minutos hasta que diga **Live** (en verde).
7. Arriba verás tu dirección, tipo `https://oficina-ia.onrender.com`. Ábrela: el navegador te pide usuario y contraseña → entra con los tuyos. ✅

> Para cambiar personas o contraseñas: Render → tu servicio → **Environment** → edita `APP_USERS` → **Save Changes** (se reinicia solo).

## PASO 4 · Comprar tu dominio (10 min)
Recomendado: **Cloudflare** (vende al precio de costo, sin sobreprecio al renovar).
1. Abre https://dash.cloudflare.com → crea tu cuenta.
2. Menú **Domain Registration** → **Register Domains** → busca el nombre que quieras (ej. `finanzas-jea.com`).
3. Cómpralo con tu tarjeta (≈ 10.5 USD/año un .com).

(Alternativa más barata el primer año: https://porkbun.com, dominios .xyz o .site desde 2–5 USD.)

## PASO 5 · Conectar el dominio a Render (10 min + espera)
1. En Render: tu servicio **oficina-ia** → **Settings** → **Custom Domains** → **Add Custom Domain** → escribe `oficina.tu-dominio.com` → **Save**.
2. Render te muestra que debes crear un registro **CNAME** apuntando a `oficina-ia.onrender.com`.
3. En Cloudflare: tu dominio → **DNS** → **Records** → **Add record**:
   - Type: `CNAME`
   - Name: `oficina`
   - Target: `oficina-ia.onrender.com`
   - Proxy status: **DNS only** (nube gris)
   - **Save**
4. Vuelve a Render y presiona **Verify**. En 5–30 minutos aparece **Certificate issued** (candado HTTPS gratis).
5. Abre `https://oficina.tu-dominio.com` → usuario y contraseña → listo. 🎉

## PASO 6 (opcional, más seguridad) · Acceso solo con correo autorizado
Además de la contraseña, puedes exigir que la persona reciba un código en su correo:
1. En Cloudflare, en el registro DNS del Paso 5, cambia a **Proxied** (nube naranja).
2. Menú **Zero Trust** → plan **Free** (hasta 50 personas, gratis).
3. **Access → Applications → Add an application → Self-hosted** → dominio `oficina.tu-dominio.com`.
4. **Policy**: Action **Allow**, Include **Emails** → escribe los correos autorizados (el tuyo y los de tu equipo).
5. Guardar. Ahora, al entrar, Cloudflare pide el correo, envía un código, y solo esos correos pasan.

---

## Cómo trabajas conmigo (Claude) después
1. Me pides el cambio en el chat de Claude Code (este proyecto).
2. Lo programo, lo pruebo y lo subo a GitHub (rama `claude/sharp-mendel-kc771y`).
3. Render lo detecta y vuelve a publicar solo. En 1–2 minutos recargas tu página y ves el cambio con el aviso **✅ Actualizado**.

> Si en una sesión nueva trabajo en otra rama, cámbiala en Render → **Settings → Build & Deploy → Branch**,
> o fusiona el PR a `main` y usa `main`.

## Recomendaciones
- Nunca compartas tu `IA_API_KEY`; solo va en Render. No la escribas en el chat ni en GitHub.
- Pon límite de gasto mensual en Anthropic y revísalo cada mes.
- Plan Free de Render: se duerme tras 15 min sin uso (la primera visita tarda ~50 s). Para uso diario del equipo, **Starter 7 USD/mes**.
- En el plan Free, los archivos guardados en el servidor se borran al actualizar; tu historial también queda en tu navegador. Para conservarlo en el servidor: Starter + **Disk** (≈ 0.25 USD/GB/mes) montado en `/opt/render/project/src/oficina-ia/datos`.
- Usa contraseñas distintas por persona y cámbialas si alguien deja el equipo.
