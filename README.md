# Mazomenos Website

Sitio web/portfolio tipo SPA construido con React y Vite, con Tailwind + shadcn-ui para UI, animaciones con Framer Motion y una seccion 3D con React Three Fiber.

## Desarrollo local

Requisitos: Node.js.

Instalar dependencias (elige un manager):

```sh
npm i
# o
pnpm i
# o
bun i
```

Levantar el servidor:

```sh
npm run dev
```

## Scripts

Definidos en `package.json`:

- `dev`: servidor de desarrollo (Vite)
- `build`: build de produccion
- `build:dev`: build en modo development
- `preview`: preview del build
- `lint`: ESLint
- `test`: Vitest (run)
- `test:watch`: Vitest (watch)

## Tecnologias

### Base

- Vite 5 + React 18 + TypeScript
- Alias de imports: `@/*` -> `src/*` (config en `vite.config.ts` y `tsconfig.json`)

### Estilos y UI

- Tailwind CSS (config en `tailwind.config.ts`, PostCSS en `postcss.config.js`)
- shadcn-ui (componentes locales en `src/components/ui/*`, config en `components.json`)
- Radix UI (primitives accesibles via `@radix-ui/react-*`)
- Tokens/tema con CSS variables en `src/index.css` (background/foreground/primary/etc)

### Navegacion

- React Router DOM (router en `src/App.tsx`; paginas en `src/pages/*`)

### Data / estado asincrono

- TanStack React Query (provider en `src/App.tsx`)

### Animaciones

- Framer Motion (secciones en `src/components/*Section.tsx`)

### 3D

- three + @react-three/fiber + @react-three/drei
- Ejemplo: `src/components/TechSolarSystem.tsx` renderiza la seccion 3D con `Canvas` y `OrbitControls`

### Formularios/validacion (instalado)

- react-hook-form + zod + @hookform/resolvers

### Testing

- Vitest + Testing Library + JSDOM (config en `vitest.config.ts`, setup en `src/test/setup.ts`)

### Lint

- ESLint (flat config) + typescript-eslint (config en `eslint.config.js`)

## Arquitectura y estructura

- `index.html`: HTML base (monta la app en `#root`)
- `src/main.tsx`: entrypoint React
- `src/App.tsx`: providers globales (React Query, tooltips/toasts) + router
- `src/pages/Index.tsx`: pagina principal (compone secciones)
- `src/pages/NotFound.tsx`: pagina 404
- `src/components/*`: secciones del sitio (Navbar, Hero, About, Projects, Contact, TechSolarSystem)
- `src/components/ui/*`: componentes UI estilo shadcn
- `src/lib/utils.ts`: utilidades (ej. `cn` para combinar clases)
- `src/index.css`: estilos globales + tokens + utilidades

## Deploy

El build de Vite genera un sitio estatico en `dist/` (comando `npm run build`) que puedes desplegar en cualquier hosting estatico.

## Lovable (opcional)

Este repo fue creado/gestionado desde Lovable en algun momento. Si usas Lovable para editar y publicar, configura tu URL de proyecto en esta seccion.

- URL: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
