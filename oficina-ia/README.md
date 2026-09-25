# Oficina IA · agentes en vivo (versión local)

La misma oficina que el link, pero corriendo en tu computadora con tu propia clave de IA:
- La IA **ve imágenes** (diseños, capturas, fotos) y puede copiarlas o analizarlas.
- No aparece ninguna marca externa: solo `http://localhost:8080`.
- El historial de tareas se guarda en `datos/historial.json`.

## Arranque en Windows
1. Instala Node.js (https://nodejs.org, versión LTS).
2. Doble clic en **iniciar.bat**. La primera vez se abre el Bloc de notas: pega tu clave en `IA_API_KEY`, guarda y cierra.
3. Se abre el navegador en **http://localhost:8080**.

## Arranque manual
```bash
cd oficina-ia
npm install
cp .env.example .env   # pon tu IA_API_KEY
npm start
```
