# Oficina IA · agentes en vivo

Oficina pixel con agentes que **caminan a su escritorio, ejecutan la tarea en tiempo real con IA
y te envían el entregable por correo**. Corre 100 % local.

## Arranque
```bash
cd oficina-ia
npm install
cp .env.example .env     # pon tu IA_API_KEY y tu SMTP (Gmail → contraseña de aplicación)
npm start
```
Abre **http://localhost:8080**

## Uso
Clic en un agente → **Asignar tarea** (o *Ver tareas → Nuevo objetivo*) → escribe la tarea →
**⚡ Crear y ejecutar con IA**. Mira el avance con **👁 Ver en vivo**; al terminar llega el correo.
