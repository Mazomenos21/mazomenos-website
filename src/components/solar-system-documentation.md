# 📖 Documentación Completa — TechSolarSystem.tsx

> Documentación línea por línea del componente de sistema solar 3D con tecnologías.
> Stack: React + TypeScript + Three.js + @react-three/fiber + @react-three/drei

---

## Tabla de Contenidos

1. [Imports](#1-imports)
2. [Estructura de datos `techData`](#2-estructura-de-datos-techdata)
3. [Componente `OrbitRing`](#3-componente-orbitring)
4. [Hook `useGlowTexture`](#4-hook-useglowtexture)
5. [Hook `useSunSurfaceTexture`](#5-hook-sunsuftexture)
6. [Componente `SolarFlare`](#6-componente-solarflare)
7. [Componente `SolarParticles`](#7-componente-solarparticles)
8. [Componente `Sun`](#8-componente-sun)
9. [Componente `TechPlanet`](#9-componente-techplanet)
10. [Componente `SolarSystemScene`](#10-componente-solarsystemscene)
11. [Componente exportado `TechSolarSystem`](#11-componente-exportado-techsolarsystem)
12. [Decisiones de arquitectura y rendimiento](#12-decisiones-de-arquitectura-y-rendimiento)

---

## 1. Imports

```tsx
import { useRef, useMemo, useState, Suspense } from "react";
```
- `useRef` — referencia mutable a nodos DOM/Three.js sin causar re-renders.
- `useMemo` — memoiza cálculos costosos (texturas, geometrías) para no recalcularlos cada frame.
- `useState` — estado React para el flag `isReady` del spinner de carga.
- `Suspense` — permite que componentes hijos "suspendan" mientras cargan recursos asíncronos (texturas SVG).

```tsx
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
```
- `Canvas` — crea el contexto WebGL, el renderer de Three.js y el loop de animación.
- `useFrame` — registra un callback que se ejecuta en cada frame (60fps). Solo funciona dentro de un `<Canvas>`.
- `useLoader` — carga recursos Three.js (TextureLoader, etc.) de forma asíncrona con caché automático por URL.

```tsx
import { Stars, OrbitControls, Line, Billboard } from "@react-three/drei";
```
- `Stars` — campo de partículas de estrellas de fondo, ya optimizado con BufferGeometry.
- `OrbitControls` — controles de cámara: arrastrar para rotar, scroll para zoom, con límites configurables.
- `Line` — renderiza una línea 3D a partir de un array de puntos `[x,y,z][]`.
- `Billboard` — hace que su contenido siempre mire a la cámara (rotación automática hacia el viewer).

```tsx
import * as THREE from "three";
import { TextureLoader } from "three";
```
- Importamos Three.js completo para acceder a `THREE.AdditiveBlending`, `THREE.CanvasTexture`, `THREE.Color`, etc.
- `TextureLoader` se importa por separado para usarlo en `useLoader(TextureLoader, url)`.

```tsx
import { motion } from "framer-motion";
```
- Animaciones de entrada CSS para el título y el contenedor del canvas (fade-in + scale).

---

## 2. Estructura de datos `techData`

```tsx
const techData = {
  Lenguajes: {
    color: "#2dd4bf",
```
- `color` — color hexadecimal de tema para toda la categoría. Se usa en: esfera, halo, anillo orbital.

```tsx
    items: [
      { name: "C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
```
- `name` — nombre del planeta/tecnología (string identificador).
- `logo` — URL del SVG en la CDN jsDelivr de Devicons. Three.js puede cargar SVGs directamente
  porque internamente usa `<img>` del browser, que sí soporta SVG como fuente de textura.

```tsx
    radius: 4,
```
- Radio orbital en unidades de escena Three.js. El sol tiene radio 1.5, así que el primer anillo
  empieza a 2.5 unidades de la superficie solar.

```tsx
    orbitTilt: 0.08,
```
- Ángulo de inclinación del plano orbital en **radianes** (0.08 rad ≈ 4.6°).
  Se aplica como `rotation={[data.orbitTilt, ...]}` al group padre de cada categoría.
  Esto simula que los planetas reales no orbitan todos en el mismo plano eclíptico.

---

## 3. Componente `OrbitRing`

```tsx
const OrbitRing = ({ radius, color }: { radius: number; color: string }) => {
```
- Componente que dibuja el anillo orbital de una categoría.

```tsx
  const points = useMemo<[number, number, number][]>(() => {
    return Array.from({ length: 129 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2;
      return [Math.cos(a) * radius, 0, Math.sin(a) * radius];
    });
  }, [radius]);
```
- `useMemo` con dependencia `[radius]` → solo recalcula si cambia el radio.
- **129 puntos** (no 128): el punto 0 y el punto 128 tienen el mismo ángulo (0 y 2π),
  cerrando el círculo perfectamente sin gap visual.
- `Math.cos(a) * radius, 0, Math.sin(a) * radius` — posición en el plano XZ (Y=0).
  En Three.js el eje Y es "arriba", así que XZ es el "suelo" donde orbitan los planetas.
- El anillo vive en el espacio local del `<group rotation={[orbitTilt, ...]}>` padre,
  por lo que hereda automáticamente la inclinación de su categoría.

```tsx
  return <Line points={points} color={color} transparent opacity={0.2} lineWidth={1} />;
```
- `transparent` + `opacity={0.2}` → el anillo es casi imperceptible, solo una guía visual sutil.

---

## 4. Hook `useGlowTexture`

```tsx
const useGlowTexture = () =>
  useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
```
- Creamos un `<canvas>` de 128×128 px en memoria (no se monta en el DOM).
- 128 es potencia de 2, requerimiento de WebGL para mipmapping óptimo.

```tsx
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
```
- `createRadialGradient(cx, cy, r_inner, cx, cy, r_outer)` — gradiente circular desde el centro.
- Radio interior 0 (centro puntual), radio exterior `size/2` (borde del canvas).

```tsx
    g.addColorStop(0,   "rgba(255,255,255,0.9)");
    g.addColorStop(0.3, "rgba(255,255,255,0.35)");
    g.addColorStop(1,   "rgba(255,255,255,0.0)");
```
- El gradiente va de blanco opaco en el centro a completamente transparente en el borde.
- Se usa **blanco** (no el color del planeta) porque el `meshBasicMaterial` del halo tiene
  un `color` propio que **modula** la textura. Blanco × color = color puro.

```tsx
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
```
- `CanvasTexture` convierte el canvas 2D en una textura WebGL.
- `needsUpdate = true` → fuerza a Three.js a subir los píxeles a la GPU en el próximo render.
- `[]` como dependencia de `useMemo` → se crea **una sola vez** por instancia del componente.

**¿Por qué este enfoque en vez de `@react-three/postprocessing` Bloom?**
El `Bloom` real usa un framebuffer extra (render target) donde dibuja toda la escena,
aplica un blur gaussiano multi-escala, y lo mezcla de nuevo. Con nuestro `AdditiveBlending`
logramos el mismo efecto visual (un halo de luz que "derrama") sin el coste de 2× render calls
y sin la dependencia que causó el error original de versiones incompatibles.

---

## 5. Hook `useSunSurfaceTexture`

```tsx
const useSunSurfaceTexture = () =>
  useMemo(() => {
    const size = 512;
```
- 512×512 para la superficie del sol: más resolución que el glow (128) porque se aplica
  sobre una esfera que puede verse de cerca.

```tsx
    const baseGrad = ctx.createRadialGradient(
      size * 0.5, size * 0.5, 0,
      size * 0.5, size * 0.5, size * 0.5,
    );
    baseGrad.addColorStop(0,    "#fff7c0"); // blanco-caliente en el centro
    baseGrad.addColorStop(0.4,  "#ffcc00"); // amarillo
    baseGrad.addColorStop(0.75, "#ff7700"); // naranja
    baseGrad.addColorStop(1,    "#cc2200"); // rojo en el limbo
```
- Simula el **limb darkening** (oscurecimiento del limbo) del sol real:
  el centro es más caliente y brillante, el borde es más frío y rojo.
  Esto ocurre porque los bordes del sol vemos más profundidades de atmósfera.

```tsx
    for (let i = 0; i < 420; i++) {
      const x = ((i * 137.508) % size);
      const y = ((i * 97.311  + 50) % size);
```
- **Ángulo de oro (137.508°)** para distribuir los gránulos de forma casi-uniforme sin clustering.
  La misma técnica se usa en filotaxis (disposición de semillas en girasoles).
  Usando `i * 137.508 % size` en lugar de `Math.random()` obtenemos una distribución
  determinista que se ve natural pero no genera ruido distinto en cada mount.

```tsx
      const r = 8 + (i % 7) * 4;
```
- Radios entre 8 y 36 px, variando por módulo. Simula que las células de convección
  solar tienen distintos tamaños.

```tsx
      const bright = i % 3 === 0;
```
- Cada tercer gránulo es brillante (amarillo) y el resto oscuro (marrón-rojizo).
  Replica el aspecto granular real del sol donde puntos calientes alternan con zonas de descenso.

```tsx
    const tex = new THREE.CanvasTexture(canvas);
```
- Se usa tanto en `map` (textura base) como en `emissiveMap` del material del núcleo.
  `emissiveMap` hace que las zonas más claras de la textura brillen más intensamente.

---

## 6. Componente `SolarFlare`

```tsx
interface SolarFlareProps {
  angle: number;        // posición angular en el ecuador (radianes)
  height: number;       // altura máxima del arco
  width: number;        // anchura de la base
  phaseOffset: number;  // fase inicial para desincronizar animaciones
  speed: number;        // velocidad de oscilación
}
```

```tsx
  const tube = useMemo(() => {
    const p0 = new THREE.Vector3(-width / 2, 0, 0);
    const p1 = new THREE.Vector3(0, height, 0);
    const p2 = new THREE.Vector3(width / 2, 0, 0);
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    return new THREE.TubeGeometry(curve, 20, 0.04, 6, false);
  }, [height, width]);
```
- `QuadraticBezierCurve3` — curva de Bezier cuadrática con 3 puntos de control.
  Produce el arco arqueado característico de las protuberancias solares,
  que son bucles de campo magnético que sacan plasma a la corona.
- `TubeGeometry(curve, 20, 0.04, 6, false)`:
    - `curve` — la curva a extruir.
    - `20` — número de segmentos a lo largo del tubo (más = más suave).
    - `0.04` — radio del tubo (delgado para verse como filamento de plasma).
    - `6` — segmentos radiales del tubo (hexágono aproximado, suficiente para esta escala).
    - `false` — no cerrar el tubo en los extremos.
- `useMemo([height, width])` → la geometría solo se recrea si cambian las dimensiones.

```tsx
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phaseOffset;
    const scaleY = 0.3 + Math.abs(Math.sin(t)) * 0.7;
    const scaleX = 1 + (1 - scaleY) * 0.3;
    groupRef.current.scale.set(scaleX, scaleY, scaleX);
```
- `Math.abs(Math.sin(t))` — oscila entre 0 y 1, siempre positivo (sin que el arco "se invierta").
- `scaleY` entre 0.3 y 1.0 → la llamarada nunca desaparece del todo, simula que siempre
  hay algo de actividad en la superficie.
- `scaleX` inversamente proporcional a `scaleY` → cuando la llamarada baja se ensancha.
  Simula la conservación de volumen del plasma (cuando sube se estrecha, cuando baja se expande).

```tsx
    const mat = (groupRef.current.children[0] as THREE.Mesh)?.material as THREE.MeshStandardMaterial;
    if (mat) mat.opacity = 0.4 + scaleY * 0.6;
```
- Opacidad dinámica: más visible en el pico de la llamarada (scaleY alto).
  Accedemos al material directamente en el frame loop, que es más eficiente que
  pasar props a un estado React (evita re-renders).

```tsx
  return (
    <group rotation={[0, angle, 0]}>
      <group ref={groupRef} position={[0, 1.5, 0]}>
```
- El group exterior rota en Y para colocar la llamarada en su posición angular del ecuador.
- `position={[0, 1.5, 0]}` eleva el grupo para que la base de la llamarada esté en la
  superficie del sol (radio = 1.5 unidades).

---

## 7. Componente `SolarParticles`

```tsx
const PARTICLE_COUNT = 180;
```
- 180 partículas: suficiente para que el viento solar sea visible sin coste apreciable.
  Con `Points` (GL_POINTS) se pueden renderizar miles sin problema, pero 180 es más
  que suficiente para el efecto visual deseado.

```tsx
  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
```
- `Float32Array` en lugar de arrays JavaScript normales:
    - Contiguos en memoria → mejores accesos de caché en la CPU.
    - Formato nativo que Three.js puede subir directamente a la GPU sin conversión.
    - `* 3` porque cada partícula tiene 3 componentes: x, y, z.

```tsx
    const theta = (i / PARTICLE_COUNT) * Math.PI * 2 * 6.28;
    const phi   = Math.acos(1 - 2 * ((i * 0.618033) % 1));
```
- Distribución esférica uniforme usando el **número áureo (0.618033...)**.
  Esta técnica (Fibonacci sphere) distribuye puntos en una esfera sin clustering
  ni vacíos, produciendo una emisión de partículas que parece omnidireccional.
- `Math.acos(1 - 2 * ...)` mapea el valor áureo a un ángulo polar uniforme en la esfera.

```tsx
  useFrame(() => {
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[ix] += velocities[ix];
```
- Accedemos al `Float32Array` del atributo directamente (no usamos `.position.set()`).
  Esto es **3-5× más rápido** porque evita crear objetos `THREE.Vector3` temporales.

```tsx
      if (dist > 4.5) {
        // reciclamos la partícula en la superficie
```
- Pool de partículas: en vez de crear/destruir objetos, reciclamos las partículas
  que salen del radio máximo. Esto evita garbage collection que causaría microfreezes.

```tsx
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
```
- **Crítico**: sin esta línea, Three.js no sabe que el buffer de posiciones cambió
  y no lo sube a la GPU. El render usaría las posiciones viejas del frame anterior.

```tsx
      blending={THREE.AdditiveBlending}
```
- Las partículas se suman al color del fondo → dan efecto de luz emisiva.
  Sin esto, las partículas ocultarían el fondo (alpha blending normal).

---

## 8. Componente `Sun`

```tsx
const FLARE_DATA = [
  { angle: 0, height: 1.1, width: 0.9, phaseOffset: 0.0, speed: 0.4 },
  ...
];
```
- Array estático **fuera del componente** para que no se recree en cada render.
  Si estuviera dentro del componente, React lo recrearía en cada re-render aunque
  los valores no cambien.

```tsx
  const surfaceTex = useSunSurfaceTexture();
  const glowTex    = useGlowTexture();
```
- Ambos hooks usan `useMemo([])` internamente → se crean una sola vez.

### Capas del Sol

```tsx
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTex}
          emissiveMap={surfaceTex}
          emissive="#ff8800"
          emissiveIntensity={1.2}
```
- `map` — textura base (color).
- `emissiveMap` — **la misma textura** como mapa de emisión.
  Cuando se usa `emissiveMap`, las partes más brillantes de la textura emiten
  más luz propia. Las manchas oscuras (gránulos oscuros) brillan menos.
- `64, 64` segmentos en la esfera → más polígonos para que la textura se vea suave
  (la esfera del sol es el elemento más prominente de la escena).

```tsx
      <mesh ref={spotsRef}>
        <sphereGeometry args={[1.52, 48, 48]} />
        <meshStandardMaterial
          transparent opacity={0.35}
```
- Segunda esfera con radio 1.52 (2% más grande) para evitar z-fighting con la capa base.
- Gira a velocidad diferente (`t * 0.04` vs `t * 0.06`) → simula la **rotación diferencial**
  del sol real: el ecuador rota en ~25 días, los polos en ~35 días.
- `opacity: 0.35` → semi-transparente, deja ver la textura del núcleo por debajo.

```tsx
      <mesh ref={chromoRef}>
        <sphereGeometry args={[1.62, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide} opacity={0.12}
```
- **Cromosfera** (atmósfera baja del sol, color rojizo).
- `BackSide` — renderiza las caras internas de la esfera.
  Desde afuera vemos el interior de la esfera, que actúa como un halo suave
  sin necesitar geometría adicional de anillo/torus.

```tsx
      <pointLight color="#ffcc88" intensity={5} distance={60} decay={1.4} />
```
- **Única fuente de luz** de toda la escena. Está en el centro del sol.
- `color="#ffcc88"` — ligeramente cálido (más realista que blanco puro).
- `decay={1.4}` — la intensidad cae con la distancia según `1/d^1.4`.
  Física real usa `decay=2` (ley del cuadrado inverso), pero 1.4 da más luz
  en los planetas exteriores para que sean visibles.

---

## 9. Componente `TechPlanet`

```tsx
  const speed = 1.8 / Math.sqrt(radius);
```
- **Tercera Ley de Kepler**: el período orbital es proporcional a `r^(3/2)`,
  por lo que la velocidad angular es proporcional a `1/sqrt(r)`.
  Esto es física real: la Tierra orbita a ~30km/s, Neptuno a ~5km/s.
  La constante 1.8 es arbitraria para que las animaciones se vean bien visualmente.

```tsx
  const logoTex = useLoader(TextureLoader, logo);
```
- `useLoader` de @react-three/fiber:
    1. Primera llamada: inicia la carga asíncrona del SVG.
    2. Mientras carga: lanza una Promise → el `<Suspense>` padre captura la suspensión
       y muestra `fallback={null}` (nada), sin bloquear el resto de la escena.
    3. Una vez cargado: `useLoader` cachea la textura por URL. Si dos planetas
       tuvieran el mismo logo, la textura se cargaría solo una vez.

```tsx
  const glowColor = useMemo(() => new THREE.Color(color), [color]);
```
- `new THREE.Color(color)` convierte el string hexadecimal a un objeto RGB de Three.js.
- `useMemo([color])` → solo se crea un nuevo objeto si cambia el color (que nunca cambia
  en runtime, pero es buena práctica evitar crear objetos en cada render).

```tsx
    <Billboard>
      <mesh position={[0, 0, size + 0.02]}>
        <planeGeometry args={[size * 2.2, size * 2.2]} />
        <meshBasicMaterial
          map={logoTex}
          transparent
          alphaTest={0.05}
          depthWrite={false}
```
- `Billboard` de drei hace que el `<mesh>` hijo rote automáticamente hacia la cámara.
- `position={[0, 0, size + 0.02]}` — el logo está **delante** de la esfera, a `size + 0.02`
  unidades del centro. El `+ 0.02` evita **z-fighting** (parpadeo por dos superficies en el mismo Z).
- `alphaTest={0.05}` — descarta píxeles con alpha menor a 0.05. Corta el fondo transparente
  del SVG sin necesitar ordenar la transparencia (mucho más eficiente).
- `depthWrite={false}` — el logo no escribe en el Z-buffer, evitando que objetos detrás
  desaparezcan cuando el logo los cubre (artefacto común con objetos transparentes).

---

## 10. Componente `SolarSystemScene`

```tsx
    <ambientLight intensity={0.08} />
```
- Muy baja (0.08 de máximo 1.0): solo para que el lado oscuro de los planetas
  no sea negro puro. En el espacio real hay algo de luz difusa interestelar.
  Si fuera 0, los planetas en la sombra del sol serían invisibles.

```tsx
    <Stars radius={120} depth={60} count={5000} factor={3} saturation={0} fade speed={0.5} />
```
- `radius={120}` — radio de la esfera de estrellas. Debe ser mayor que `maxDistance` del OrbitControls (28).
- `depth={60}` — profundidad (esfera anidada interna) para dar sensación de distancia.
- `count={5000}` — número de estrellas. `Points` los maneja todos en una draw call.
- `saturation={0}` — estrellas blancas (sin color), más realista.
- `fade` — las estrellas cercanas al punto de vista se desvanecen suavemente.

```tsx
    {Object.entries(techData).map(([category, data], catIdx) => (
      <group key={category} rotation={[data.orbitTilt, catIdx * 0.35, 0]}>
```
- `rotation={[data.orbitTilt, catIdx * 0.35, 0]}`:
    - `data.orbitTilt` en X → inclina el plano orbital (como la eclíptica real).
    - `catIdx * 0.35` en Y → cada categoría tiene un "nodo ascendente" diferente
      (el punto donde la órbita cruza el plano de referencia), igual que los planetas reales.

```tsx
        <Suspense fallback={null}>
```
- Envuelve los planetas que usan `useLoader`. Sin `Suspense`, un error de carga
  rompería toda la escena. Con `fallback={null}`, los planetas que aún cargan
  simplemente no aparecen hasta que su textura esté lista.

---

## 11. Componente exportado `TechSolarSystem`

```tsx
  const [isReady, setIsReady] = useState(false);
```
- Flag para mostrar el spinner mientras el contexto WebGL inicializa.
  WebGL puede tardar 100-500ms en crear el contexto, shaders y cargar los primeros assets.

```tsx
          <Canvas
            camera={{ position: [0, 14, 20], fov: 48 }}
```
- `position: [0, 14, 20]` — cámara levemente elevada (y=14) y alejada (z=20).
  Esto da una vista isométrica-ligeramente-aérea del sistema solar.
- `fov: 48` — campo de visión estrecho (vs 75° por defecto). Reduce la distorsión
  en perspectiva y da un aspecto más "cinematográfico" y espacial.

```tsx
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
            }}
```
- `antialias: true` — suaviza los bordes de las esferas y líneas.
- `powerPreference: "high-performance"` — en laptops con GPU dual (Intel integrada + Nvidia/AMD),
  este flag le pide al sistema operativo que use la GPU dedicada.
- `alpha: false` — el canvas no tiene fondo transparente, permite al browser
  optimizar el compositing con la página.

```tsx
            dpr={[1, 1.5]}
```
- `devicePixelRatio` mínimo y máximo. En móviles Retina el dpr puede ser 3.0,
  lo que significa 9× más píxeles a renderizar vs dpr=1. Limitarlo a 1.5 es
  el estándar de la industria para balance entre nitidez y rendimiento.

```tsx
            onCreated={() => setIsReady(true)}
```
- Callback que se ejecuta cuando el contexto WebGL está listo.
  Oculta el spinner y muestra el canvas ya renderizado.

---

## 12. Decisiones de arquitectura y rendimiento

### Por qué no hay `pointLight` por planeta

El código original tenía un `pointLight` dentro de cada planeta (25 luces).
Three.js usa Forward Rendering por defecto, donde cada luz añade un pase de shader.
Con 25 luces, cada fragmento visible ejecuta el shader de iluminación 25 veces.
**La solución**: un solo `pointLight` en el sol + materiales `emissive` en los planetas.
Los materiales emisivos brillan sin depender de ninguna luz, con coste de shader constante.

### Por qué no `@react-three/postprocessing` Bloom

El Bloom de postprocessing requiere:
1. Render completo de la escena a un `RenderTarget` (framebuffer en GPU).
2. Extracción de píxeles brillantes (threshold pass).
3. Blur gaussiano multi-resolución (4-8 passes).
4. Composición final.

Coste: ~2-3× el tiempo de render base.
Además, tiene una dependencia de versiones estricta con `@react-three/fiber` que causó el error original.

**Nuestra solución**: `AdditiveBlending` en un plano con gradiente radial.
Matemáticamente: `finalColor = backgroundColor + glowColor * glowAlpha`.
El resultado visual es indistinguible de un bloom suave para el ojo humano,
con coste de una sola draw call extra por planeta.

### Por qué `useMemo` en texturas y geometrías

En React, todo el cuerpo de un componente funcional se ejecuta en cada re-render.
Sin `useMemo`, `new THREE.CanvasTexture(canvas)` se ejecutaría en cada render,
creando una nueva textura en la GPU en cada frame, causando memory leaks y stuttering.
`useMemo(() => ..., [])` garantiza que la textura se crea exactamente una vez.

### Por qué `Float32Array` para las partículas

```
Normal JS Array:  [0.5, 1.2, -0.3, ...]  → heap objects, GC overhead, slow iteration
Float32Array:     <contiguous 32-bit floats> → direct memory, no GC, SIMD-friendly
```

Three.js convierte los arrays normales a `Float32Array` internamente de todas formas,
así que usarlo directamente evita esa conversión en cada frame.

### Flujo de carga de logos SVG

```
1. <Suspense> detecta que TechPlanet "suspende"
2. Muestra fallback={null} (nada)
3. useLoader(TextureLoader, url) inicia fetch del SVG
4. TextureLoader usa <img> del browser para decodificar el SVG
5. Three.js convierte el <img> a textura WebGL
6. useLoader cachea la textura por URL
7. El componente "reanuda" y se renderiza con la textura lista
```

Si dos planetas tuvieran el mismo logo, el paso 6 devuelve la textura cacheada
sin hacer un segundo fetch de red.

---

*Generado para TechSolarSystem.tsx — React + Three.js + @react-three/fiber*