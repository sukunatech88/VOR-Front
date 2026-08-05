# VOR Frontend — Guía técnica, operación y empalme

> **Producto:** VOR Connected Finance Platform
> **Componente:** Frontend Phase 1 MVP
> **Repositorio:** `VOR-Front`
> **Rama principal:** `main`
> **Commit de referencia:** `ba3b0ed`
> **Stack:** React · TypeScript · Vite · Auth0 · TanStack Query
> **Audiencia:** desarrollo, UX, arquitectura, soporte y empalme técnico

---

## 0. Hoja privada de accesos y configuración

> [!CAUTION]
> Complete los valores faltantes únicamente en una copia privada. No guardar contraseñas, tokens, Client Secrets o credenciales bancarias en el repositorio.
>
> Las variables `VITE_*` se incorporan al bundle del navegador y deben considerarse públicas.

### 0.1 Repositorio y entorno

| Recurso | Valor inicial o placeholder | Dónde verificarlo | ¿Secreto? |
|---|---|---|---:|
| URL repositorio frontend | `<COMPLETAR>` | GitHub → VOR-Front | No |
| Rama principal | `main` | `git branch --show-current` | No |
| Ruta local sugerida | `C:\Users\danie\IdeaProjects\VOR-Front` | Equipo local | No |
| URL frontend | `http://localhost:5173` | Vite | No |
| URL backend | `http://localhost:8080` | `VITE_API_BASE_URL` | No |

### 0.2 Auth0 SPA

| Campo | Valor | Dónde verificarlo | ¿Secreto? |
|---|---|---|---:|
| Nombre aplicación SPA | `<COMPLETAR>` | Auth0 → Applications → Applications | No |
| Auth0 Domain | `<COMPLETAR>` | SPA → Settings | No |
| SPA Client ID | `<COMPLETAR>` | SPA → Settings | No |
| Auth0 Audience | `<COMPLETAR>` | Auth0 → Applications → APIs → VOR API | No |
| Callback local | `http://localhost:5173/auth/callback` | Allowed Callback URLs | No |
| Logout local | `http://localhost:5173` | Allowed Logout URLs | No |
| Web Origin local | `http://localhost:5173` | Allowed Web Origins | No |
| Test user email | `<COMPLETAR>` | Auth0 → User Management → Users | Sensible |
| Test user password | `<COMPLETAR_MANUALMENTE>` | Canal seguro / reset | **Sí** |
| SPA Client Secret | **NO USAR / NO CONFIGURAR EN EL FRONTEND** | Auth0 | **Sí** |

### 0.3 Variables `.env.local`

| Variable | Valor inicial o placeholder | ¿Secreto? |
|---|---|---:|
| `VITE_API_BASE_URL` | `http://localhost:8080` | No |
| `VITE_AUTH0_DOMAIN` | `<AUTH0_DOMAIN>` | No |
| `VITE_AUTH0_CLIENT_ID` | `<AUTH0_SPA_CLIENT_ID>` | No |
| `VITE_AUTH0_AUDIENCE` | `<AUTH0_API_IDENTIFIER>` | No |

---

## 1. Resumen ejecutivo

El frontend VOR es una Single Page Application para operar el ciclo de archivos y mensajes financieros procesados por el backend.

### Capacidades actuales

- login y logout con Auth0;
- callback protegido;
- rutas autenticadas;
- autorización visual por permisos;
- Dashboard;
- File Registry;
- Message Hub;
- Processing;
- Payment Monitor;
- Statement Monitor;
- Bank Connections;
- base de User Administration;
- manejo de errores;
- 404 autenticado;
- consumo tipado de la API;
- cache y sincronización con TanStack Query;
- validación runtime con Zod.

---

## 2. Arquitectura actual

```text
┌───────────────────────────────┐
│ Navegador                     │
├───────────────────────────────┤
│ React + TypeScript            │
│ React Router                  │
│ Auth0 React SDK               │
│ TanStack Query                │
│ Zod                           │
│ API Client                    │
└──────────────┬────────────────┘
               │
               │ Access Token
               │ REST / JSON
               ▼
┌───────────────────────────────┐
│ VOR Backend                   │
│ http://localhost:8080         │
└───────────────────────────────┘
```

El frontend no se conecta directamente a PostgreSQL, SFTP o almacenamiento local. Toda operación pasa por el backend.

---

## 3. Stack verificado

| Tecnología | Versión |
|---|---|
| React | 19.2.4 |
| React DOM | 19.2.4 |
| TypeScript | 6.0.x |
| Vite | 8.0.x |
| React Router DOM | 7.14.x |
| Auth0 React SDK | 2.22.x |
| TanStack Query | 5.96.x |
| Zod | 4.3.x |
| Tailwind CSS | 4.2.x |
| Lucide React | 1.7.x |
| ESLint | 9.39.x |
| Prettier | 3.8.x |
| React Compiler plugin | 1.0.0 |

Scripts disponibles:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

Actualmente no existe un script de pruebas frontend en `package.json`. La incorporación de pruebas automatizadas es un pendiente explícito.

---

## 4. Organización del código

```text
src/
├── app/
│   ├── layout/
│   ├── providers/
│   └── router/
├── assets/
├── core/
│   ├── auth/
│   ├── config/
│   ├── constants/
│   ├── http/
│   ├── types/
│   └── utils/
├── features/
│   ├── auth/
│   ├── bank-connections/
│   ├── dashboard/
│   ├── file-registry/
│   ├── message-hub/
│   ├── payment-monitor/
│   ├── processing/
│   ├── statement-monitor/
│   └── user-administration/
└── shared/
```

| Área | Responsabilidad |
|---|---|
| `app` | Providers, layout y router |
| `core` | Configuración, Auth0, permisos, HTTP, tipos y utilidades |
| `features` | Módulos funcionales |
| `shared` | Componentes y utilidades reutilizables |
| `assets` | Recursos visuales |

---

## 5. Requisitos previos

- Git.
- Node.js compatible con Vite 8.
- npm.
- Backend VOR activo.
- Aplicación SPA configurada en Auth0.
- Usuario VOR con rol y permisos.

```powershell
node --version
npm --version
git --version
```

---

## 6. Clonar e instalar

```powershell
git clone <URL_REPOSITORIO_FRONTEND>
cd VOR-Front
git checkout main
git pull origin main
```

Si `package-lock.json` está presente y alineado:

```powershell
npm ci
```

Para actualizar o resolver dependencias durante desarrollo:

```powershell
npm install
```

Verificar:

```powershell
git branch --show-current
git status --short
```

La rama esperada es `main`.

---

## 7. Variables de entorno

El frontend valida las variables con Zod en:

```text
src/core/config/env.ts
```

Crear el archivo local:

```powershell
Copy-Item .env.example .env.local
```

Contenido:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
VITE_AUTH0_DOMAIN=<AUTH0_DOMAIN>
VITE_AUTH0_CLIENT_ID=<AUTH0_SPA_CLIENT_ID>
VITE_AUTH0_AUDIENCE=<AUTH0_API_IDENTIFIER>
```

### Comportamiento de validación

- `VITE_API_BASE_URL` debe ser una URL válida.
- Todas las variables son obligatorias.
- El frontend elimina `/` finales de la URL base.
- Si falta una variable, la aplicación lanza un error indicando cuáles son inválidas o ausentes.
- Vite debe reiniciarse después de cambiar `.env.local`.

> No colocar `AUTH0_CLIENT_SECRET`, contraseñas, tokens, claves privadas ni credenciales SFTP en `.env.local`.

---

## 8. Auth0: implementación real del frontend

### 8.1 Configuración del provider

El provider se encuentra en:

```text
src/app/providers/auth-provider.tsx
```

Configuración relevante:

```tsx
<Auth0Provider
  domain={auth0Domain}
  clientId={auth0ClientId}
  authorizationParams={{
    audience: auth0Audience,
    redirect_uri: `${window.location.origin}/auth/callback`,
    scope: VOR_AUTHORIZATION_SCOPE,
  }}
  cacheLocation="memory"
  onRedirectCallback={handleRedirectCallback}
>
  {children}
</Auth0Provider>
```

### 8.2 Qué significa esta configuración

| Elemento | Significado |
|---|---|
| `domain` | Tenant Auth0 usado para autenticación |
| `clientId` | Identificador público de la SPA |
| `audience` | API VOR para la cual se solicita el access token |
| `redirect_uri` | Callback local `/auth/callback` |
| `scope` | Scopes solicitados por VOR |
| `cacheLocation="memory"` | El cache de tokens no se persiste manualmente en `localStorage` |
| `onRedirectCallback` | Devuelve al usuario a la ruta solicitada o a `/dashboard` |

El callback sólo acepta rutas internas que empiecen por `/` y rechaza rutas que empiecen por `//`, reduciendo el riesgo de redirecciones externas no controladas.

### 8.3 URLs que deben configurarse en Auth0

Ruta:

```text
Auth0 Dashboard
→ Applications
→ Applications
→ seleccionar la SPA VOR
→ Settings
```

| Campo | Valor local |
|---|---|
| Allowed Callback URLs | `http://localhost:5173/auth/callback` |
| Allowed Logout URLs | `http://localhost:5173` |
| Allowed Web Origins | `http://localhost:5173` |
| Allowed Origins (CORS), si aplica | `http://localhost:5173` |

En producción no deben usarse URLs localhost.

### 8.4 Authorization Code + PKCE

La SPA usa el flujo recomendado para aplicaciones que se ejecutan en navegador:

```text
Usuario
  ↓
SPA solicita autenticación
  ↓
Auth0 Universal Login
  ↓
Authorization Code + PKCE
  ↓
Callback /auth/callback
  ↓
Auth0 React SDK obtiene tokens
  ↓
SPA consume la API con Access Token
```

La SPA no puede proteger un Client Secret. Por eso el Client Secret no forma parte de la configuración del frontend.

---

## 9. Usuarios, roles y permisos

### 9.1 Verificar un usuario VOR

```text
Auth0 Dashboard
→ User Management
→ Users
→ seleccionar usuario
```

Revisar:

- estado activo;
- email;
- conexión de identidad;
- último login;
- Roles;
- Permissions;
- metadata o organización, cuando aplique.

### 9.2 Verificar roles

```text
User Management
→ Users
→ usuario
→ Roles
```

Blueprint Phase 1 propone:

| Rol sugerido | Uso esperado |
|---|---|
| Admin | Configuración y operación completa |
| Operator | Procesamiento y operación diaria |
| Viewer | Consulta sin acciones críticas |

Los nombres reales deben comprobarse en el tenant.

### 9.3 Verificar permisos

```text
User Management
→ Users
→ usuario
→ Permissions
```

La API debe tener RBAC habilitado y los permisos deben incluirse en el access token.

Permisos relevantes del MVP:

```text
operations:read
files:register
messages:process
status-reports:apply
dispatch:execute
poller:run
bank-connections:manage
bank-connections:test
bank-connections:lifecycle
```

La interfaz puede ocultar acciones según permisos, pero la protección definitiva siempre corresponde al backend.

---

## 10. Tokens: dónde verificarlos y cómo usarlos

### 10.1 Token correcto para el backend

El frontend debe enviar un **Access Token** emitido para la audience de la API VOR.

No debe enviar:

- ID Token como credencial de API;
- Management API Token;
- token de otra API;
- token vencido;
- token copiado manualmente como configuración permanente.

### 10.2 Verificar una llamada autenticada

1. Abrir `http://localhost:5173`.
2. Iniciar sesión.
3. Abrir DevTools con `F12`.
4. Ir a **Network**.
5. Ejecutar una acción que consulte el backend.
6. Seleccionar un request a `http://localhost:8080`.
7. Revisar **Request Headers**.
8. Confirmar `Authorization: Bearer ...`.

No copiar el valor completo del token en documentación o chats.

### 10.3 Claims relevantes

| Claim | Control |
|---|---|
| `iss` | Debe coincidir con `AUTH0_ISSUER_URI` |
| `aud` | Debe incluir `AUTH0_AUDIENCE` |
| `sub` | Identifica al usuario |
| `iat` | Fecha de emisión |
| `exp` | Fecha de expiración |
| `scope` | Scopes concedidos |
| `permissions` | Permisos efectivos del usuario |
| `org_id` | Organización VOR, cuando esté configurado |
| `bank_connection_id` | Conexión bancaria, cuando esté configurado |

El frontend no debe construir, modificar ni firmar tokens.

### 10.4 Logs Auth0

```text
Auth0 Dashboard
→ Monitoring
→ Logs
```

Verificar allí:

- login exitoso;
- login fallido;
- callback inválido;
- usuario bloqueado;
- error de conexión;
- error de consentimiento;
- acciones administrativas.

---

## 11. Providers de aplicación

Archivos relevantes:

```text
src/app/providers/
```

Responsabilidades esperadas:

| Provider | Responsabilidad |
|---|---|
| Auth Provider | Sesión Auth0, callback y tokens |
| API Client Provider | Cliente autenticado para backend |
| Query Provider | Cache y sincronización TanStack Query |
| App Providers | Composición general |

---

## 12. Cliente HTTP

Ruta:

```text
src/core/http/
```

Responsabilidades:

- usar `VITE_API_BASE_URL`;
- obtener el access token mediante el SDK;
- agregar `Authorization: Bearer <token>`;
- enviar y recibir JSON;
- manejar errores HTTP;
- preservar detalles operativos útiles;
- no imprimir tokens en logs.

Fuente de verdad del contrato:

```text
http://localhost:8080/v3/api-docs
```

---

## 13. TanStack Query

TanStack Query gestiona:

- loading;
- success;
- error;
- cache;
- invalidación;
- refetch;
- sincronización después de mutaciones.

Después de operaciones como Register, Retry, Poller, Dispatch, Test Connection o cambios de estado, deben invalidarse las queries relacionadas.

---

## 14. Zod y contratos runtime

Zod se utiliza para validar:

- variables de entorno;
- respuestas de la API;
- formularios;
- estructuras runtime.

Un error de Zod puede significar:

- backend y frontend desalineados;
- campo faltante;
- campo nulo inesperado;
- enum nuevo;
- endpoint antiguo;
- DTO cambiado sin actualizar el frontend.

No debe ocultarse silenciosamente una incompatibilidad de contrato.

---

## 15. Módulos funcionales

### Dashboard

- métricas;
- fallos recientes;
- salud de conexiones;
- accesos rápidos.

### File Registry

- listado y filtros;
- registro manual;
- estados;
- detalle;
- acciones de procesamiento.

### Message Hub

- mensajes;
- tipo ISO;
- estado;
- timeline;
- retry;
- resultados.

### Processing

- acciones de pipeline;
- Poller inbound;
- elegibilidad;
- presentación de resultados.

### Payment Monitor

- instrucciones;
- transacciones;
- estados;
- reportes `pain.002`;
- matching;
- trazas.

### Statement Monitor

- extractos `camt.053`;
- balances;
- movimientos;
- detalle.

### Bank Connections

- listado;
- detalle;
- configuración;
- prueba;
- activación;
- estado y auditoría.

### User Administration

Existe una base de módulo en el frontend. El alcance final de usuarios, perfiles y autorización debe alinearse con Auth0 y con la futura separación de autorización de negocio.

---

## 16. Ejecutar el frontend

```powershell
cd C:\Users\danie\IdeaProjects\VOR-Front
npm ci
npm run dev
```

URL predeterminada:

```text
http://localhost:5173
```

Vite informará otra URL si el puerto está ocupado.

---

## 17. Scripts y controles

### Desarrollo

```powershell
npm run dev
```

### Lint

```powershell
npm run lint
```

### Build

```powershell
npm run build
```

Este script ejecuta:

```text
tsc -b
vite build
```

Salida:

```text
dist/
```

### Preview

```powershell
npm run preview
```

### Control antes de commit

```powershell
npm run lint
npm run build
git diff --check
git status --short
```

---

## 18. Checklist funcional

- [ ] `.env.local` creado.
- [ ] Backend en puerto 8080.
- [ ] Frontend en puerto 5173.
- [ ] Callback Auth0 configurado.
- [ ] Usuario activo.
- [ ] Rol asignado.
- [ ] Permisos efectivos.
- [ ] Login exitoso en Auth0 Logs.
- [ ] Dashboard carga.
- [ ] File Registry carga.
- [ ] Message Hub carga.
- [ ] Processing carga.
- [ ] Payment Monitor carga.
- [ ] Statement Monitor carga.
- [ ] Bank Connections carga.
- [ ] Requests incluyen access token.
- [ ] No hay secretos en Git.
- [ ] `npm run lint` exitoso.
- [ ] `npm run build` exitoso.

---

## 19. Troubleshooting

### 19.1 Variables inválidas

Síntoma:

```text
Invalid or missing environment variables
```

Revisar `.env.local` y reiniciar Vite.

### 19.2 Login no redirige correctamente

Revisar:

- Allowed Callback URLs;
- `http://localhost:5173/auth/callback`;
- Auth0 Domain;
- Client ID;
- errores en Auth0 Logs;
- consola del navegador.

### 19.3 Pantalla en blanco después del login

Revisar:

- consola;
- ruta `/auth/callback`;
- variables Auth0;
- respuesta del provider;
- ruta de retorno;
- permisos;
- error Zod.

### 19.4 Error 401

Revisar:

- audience frontend y backend;
- issuer;
- token vencido;
- request sin Authorization;
- uso accidental de ID Token;
- sesión Auth0.

### 19.5 Error 403

Revisar:

- rol del usuario;
- permisos del usuario;
- RBAC de la API;
- `permissions` en access token;
- claims de ownership;
- fallback local.

### 19.6 Login funciona, pero no aparecen permisos nuevos

1. Revisar rol y permisos en Auth0.
2. Confirmar Add Permissions in Access Token.
3. Cerrar sesión.
4. Iniciar sesión nuevamente.
5. Revisar el token nuevo.

Los tokens ya emitidos no se actualizan automáticamente cuando cambia un rol.

### 19.7 Error CORS

Confirmar:

```text
Frontend: http://localhost:5173
Backend VOR_CORS_ALLOWED_ORIGINS: http://localhost:5173
```

### 19.8 Backend no responde

```powershell
Test-NetConnection localhost -Port 8080
```

Validar también:

```text
http://localhost:8080/actuator/health
```

### 19.9 Build exitoso, pero pantalla falla

Revisar:

- consola del navegador;
- Network;
- respuesta real del backend;
- schemas Zod;
- OpenAPI;
- permisos;
- estados no contemplados.

---

## 20. Orden de empalme para Alejandro

1. Completar la hoja privada sin cometer secretos.
2. Clonar `VOR-Front`.
3. Cambiar a `main`.
4. Instalar dependencias.
5. Configurar `.env.local`.
6. Revisar la SPA en Auth0.
7. Revisar callback, logout y web origins.
8. Revisar usuario, roles y permisos.
9. Levantar el backend.
10. Ejecutar lint y build.
11. Iniciar Vite.
12. Probar login.
13. Revisar token en Network sin copiarlo.
14. Recorrer todos los módulos.
15. Comparar requests con OpenAPI.

Validación inicial:

```powershell
git checkout main
git pull origin main
npm ci
npm run lint
npm run build
npm run dev
```

---

## 21. Estado actual y pendientes

### Implementado

- Auth0Provider;
- callback seguro;
- cache en memoria;
- API audience;
- rutas protegidas;
- módulos operativos Phase 1;
- TanStack Query;
- Zod;
- lint y build.

### Pendiente

- pruebas automatizadas frontend;
- usuarios y perfiles completos;
- autorización de negocio avanzada;
- UX de pipeline automático;
- errores acumulados;
- multitransacción;
- rechazos parciales;
- responsive y refinamiento visual;
- observabilidad frontend;
- telemetría y monitoreo productivo.

---

## 22. Reglas de seguridad y desarrollo

- Nunca poner Client Secret en una SPA.
- No guardar access tokens manualmente en `localStorage`.
- No imprimir tokens en consola.
- No subir `.env.local`.
- No subir `node_modules/`.
- No subir `dist/`.
- Mantener permisos centralizados.
- No confiar únicamente en ocultar botones; el backend debe autorizar.
- Validar contratos con Zod.
- Mantener query keys consistentes.
- Invalidar queries después de mutaciones.
- Mostrar loading, error y empty state.
- Mantener el frontend alineado con OpenAPI.
- Ejecutar lint y build antes de commit.
- Ejecutar `git diff --check`.
- No hacer force push.

---

## 23. Fuentes de verdad

En caso de discrepancia:

1. Código vigente en `main`.
2. `package.json` y lockfile.
3. `.env.example`.
4. OpenAPI del backend.
5. Configuración real de la SPA y API en Auth0.
6. Código del Auth Provider y API Client.
7. Blueprint Phase 1.
8. Arquitectura v3.0 como dirección futura.
