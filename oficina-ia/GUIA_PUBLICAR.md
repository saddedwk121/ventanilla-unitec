# Publicar Oficina IA con tu propio dominio

Resultado: la oficina en `https://tu-dominio.com`, protegida con contraseña, sin marcas externas,
y que se actualiza sola cada vez que Claude sube un cambio a GitHub.

## Lo que necesitas y cuánto cuesta
| Qué | Dónde | Costo aproximado |
|---|---|---|
| Hospedaje del servidor | Render (render.com) | Gratis (plan Free) · 7 USD/mes si quieres que nunca se duerma |
| Dominio | Cloudflare Registrar o Porkbun | .com ≈ 10–11 USD/año · .xyz/.site ≈ 2–5 USD el primer año |
| Clave de IA | console.anthropic.com | Pago por uso; pon un límite mensual |

## Paso 1 · Clave de IA
1. Entra a https://console.anthropic.com y crea tu cuenta.
2. En **Billing** agrega saldo (con 5–10 USD empiezas) y en **Limits** pon un tope mensual.
3. En **API Keys** crea una clave y guárdala (empieza con `sk-ant-`).

## Paso 2 · Publicar en Render
1. Entra a https://render.com y regístrate **con tu cuenta de GitHub**.
2. Autoriza a Render a ver el repositorio `saddedwk121/ventanilla-unitec`.
3. Clic en **New → Blueprint**, elige el repositorio. Render lee el archivo `render.yaml` y te pide:
   - `IA_API_KEY`: pega tu clave del paso 1.
   - `APP_PASSWORD`: inventa una contraseña larga (la pedirá la página al abrirla).
4. Clic en **Apply**. En 1–3 minutos tendrás una dirección tipo `https://oficina-ia.onrender.com`.
5. Ábrela: usuario `oficina` y tu contraseña.

## Paso 3 · Tu dominio propio
1. Compra el dominio en https://www.cloudflare.com/products/registrar/ (precio de costo) o https://porkbun.com.
2. En Render: tu servicio → **Settings → Custom Domains → Add** → escribe `oficina.tu-dominio.com`.
3. Render te muestra un registro **CNAME**. Cópialo en el DNS de tu dominio (Cloudflare/Porkbun → DNS → Add record):
   - Tipo `CNAME`, nombre `oficina`, destino `oficina-ia.onrender.com` (si usas Cloudflare, deja la nube en gris "DNS only").
4. Espera 5–30 minutos. Render activa el candado HTTPS gratis.

## Cómo se actualiza "en tiempo real" con Claude
1. Tú le pides el cambio a Claude en el chat.
2. Claude lo programa, lo prueba y lo sube a GitHub (rama `claude/sharp-mendel-kc771y`).
3. Render detecta el cambio y vuelve a publicar solo (1–2 minutos). Recargas tu página y ya está.

> Si en una sesión nueva Claude trabaja en otra rama, cámbiala en Render → Settings → Build & Deploy → Branch,
> o fusiona el PR a `main` y pon `main` como rama.

## Recomendaciones
- **Nunca** publiques sin `APP_PASSWORD`: cualquiera podría gastar tu saldo de IA.
- Pon un **límite de gasto mensual** en console.anthropic.com.
- El plan Free de Render se "duerme" tras 15 min sin uso: la primera visita tarda ~50 s en despertar. Si te molesta, cambia a Starter (7 USD/mes).
- En el plan Free, los archivos guardados en el servidor se borran cuando se vuelve a publicar. Tu historial de tareas se queda en tu navegador; para guardarlo también en el servidor, usa Starter + Disk (≈ 0.25 USD/GB al mes) montado en `/opt/render/project/src/oficina-ia/datos`.
- No subas nunca tu `.env` ni tu clave a GitHub (ya está excluido en `.gitignore`).
