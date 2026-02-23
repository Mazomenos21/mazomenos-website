import {useRef, useMemo, useState, Suspense} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {Stars, OrbitControls, Line, Billboard} from "@react-three/drei";
import * as THREE from "three";
import {TextureLoader} from "three";
import {motion} from "framer-motion";

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const techData = {
    Languages: {
        color: "#2dd4bf",
        items: [
            {name: "C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg"},
            {
                name: "C++",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"
            },
            {name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg"},
            {
                name: "JavaScript",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
            },
            {name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg"},
            {
                name: "Python",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
            },
            {name: "R", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg"},

            {
                name: "PowerShell",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg"
            },
        ],
        radius: 4,
        orbitTilt: 0.08,
    },
    "Databases": {
        color: "#38bdf8",
        items: [
            {
                name: "MongoDB",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg"
            },
            {name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg"},
            {
                name: "PostgreSQL",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
            },
            {
                name: "SQLite",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg"
            },
        ],
        radius: 7,
        orbitTilt: 0.15,
    },
    Frameworks: {
        color: "#a78bfa",
        items: [
            {
                name: "Bootstrap",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg"
            },
            {name: "Django", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg"},
            {
                name: "Node.js",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
            },
            {name: "fastAPI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg"},
            {name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"},
            {
                name: "Spring",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg"
            },
            {
                name: "WordPress",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-original.svg"
            },
            {
                name: "NPM",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg"
            },
            {name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"},
        ],
        radius: 10,
        orbitTilt: 0.05,
    },
    Platforms: {
        color: "#fb923c",
        items: [
            {name: "Azure", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg"},
            {
                name: "Google Cloud",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg"
            },
            {name:  "Heroku", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/heroku/heroku-original.svg"},

            {
                name: "GitHub Pages",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
            },
            {name: "Linux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg"},
            {name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"},
            {
                name: "Arduino",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/arduino/arduino-original.svg"
            },
        ],
        radius: 13,
        orbitTilt: 0.12,
    },
} as const;

// ---------------------------------------------------------------------------
// ORBIT RING
// ---------------------------------------------------------------------------

const OrbitRing = ({radius, color}: { radius: number; color: string }) => {
    const points = useMemo<[number, number, number][]>(() => {
        return Array.from({length: 129}, (_, i) => {
            const a = (i / 128) * Math.PI * 2;
            return [Math.cos(a) * radius, 0, Math.sin(a) * radius];
        });
    }, [radius]);

    return <Line points={points} color={color} transparent opacity={0.2} lineWidth={1}/>;
};

// ---------------------------------------------------------------------------
// GLOW TEXTURE — gradiente radial en canvas para simular bloom sin postprocessing.
// AdditiveBlending suma el color del halo al fondo igual que un bloom real,
// pero sin necesitar un framebuffer extra ni ninguna dependencia extra.
// ---------------------------------------------------------------------------

const useGlowTexture = () =>
    useMemo(() => {
        const size = 128;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(0.3, "rgba(255,255,255,0.35)");
        g.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }, []);

// ---------------------------------------------------------------------------
// TECH PLANET — esfera emisiva + glow aditivo + sprite de logo
// ---------------------------------------------------------------------------

interface TechPlanetProps {
    name: string;
    logo: string;
    radius: number;
    angle: number;
    color: string;
    size: number;
}

const TechPlanet = ({logo, radius, angle, color, size}: TechPlanetProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const initialAngle = useRef(angle);
    const speed = 0.28 / Math.sqrt(radius); // 3ª ley de Kepler

    const logoTex = useLoader(TextureLoader, logo);
    const glowTex = useGlowTexture();
    const glowColor = useMemo(() => new THREE.Color(color), [color]);

    useFrame(({clock}) => {
        const t = initialAngle.current + clock.getElapsedTime() * speed;
        if (groupRef.current) {
            groupRef.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
        }
        if (glowRef.current) {
            const pulse = 1 + Math.sin(clock.getElapsedTime() * 2 + angle) * 0.08;
            glowRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Esfera base con emisivo para dar volumen */}
            <mesh>
                <sphereGeometry args={[size, 24, 24]}/>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.7}
                    roughness={0.35}
                    metalness={0.1}
                />
            </mesh>

            {/* Halo aditivo — simula bloom sin postprocessing */}
            <Billboard>
                <mesh ref={glowRef}>
                    <planeGeometry args={[size * 5.5, size * 5.5]}/>
                    <meshBasicMaterial
                        map={glowTex}
                        color={glowColor}
                        transparent
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </Billboard>

            {/* Logo SVG como sprite siempre mirando a la cámara */}
            <Billboard>
                <mesh position={[0, 0, size + 0.02]}>
                    <planeGeometry args={[size * 2.2, size * 2.2]}/>
                    <meshBasicMaterial
                        map={logoTex}
                        transparent
                        alphaTest={0.05}
                        depthWrite={false}
                    />
                </mesh>
            </Billboard>
        </group>
    );
};

// ---------------------------------------------------------------------------
// SUN (mejorado) — superficie animada con ShaderMaterial + corona aditiva
// ---------------------------------------------------------------------------

const Sun = () => {
    const coreRef = useRef<THREE.Mesh>(null);
    const coronaRef = useRef<THREE.Mesh>(null);
    const glowTex = useGlowTexture();

    // Shader material para simular la superficie solar
    const shaderMat = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: {value: 0},
                uColor: {value: new THREE.Color('#ffb86b')},
                uNoiseScale: {value: 1.6},
            },
            vertexShader: `
                varying vec3 vPos;
                varying vec3 vNormal;
                void main() {
                    vPos = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor;
                uniform float uNoiseScale;
                varying vec3 vPos;

                // Small, cheap hash / value noise
                float hash(float n) { return fract(sin(n) * 43758.5453123); }
                float noise(vec3 x) {
                    vec3 p = floor(x);
                    vec3 f = fract(x);
                    f = f * f * (3.0 - 2.0 * f);
                    float n = p.x + p.y * 57.0 + 113.0 * p.z;
                    float res = mix(
                        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x), mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
                        f.z
                    );
                    return res;
                }

                void main() {
                    // proyectamos la posición en la esfera y aplicamos ruido animado
                    vec3 nPos = normalize(vPos) * uNoiseScale;
                    float n  = 0.0;
                    float freq = 1.0;
                    float amp = 1.0;
                    // varias octavas para un ruido con detalle
                    for (int i = 0; i < 4; i++) {
                        n += noise(nPos * freq + vec3(uTime * 0.12));
                        freq *= 2.0;
                        amp *= 0.5;
                    }
                    n = clamp(n, 0.0, 1.0);

                    // brillo según proximidad al centro de la esfera (simula núcleo más brillante)
                    float radial = pow(1.0 - length(vPos) / 1.6, 1.8);

                    // paleta: mezcla entre color base y tonos amarillos/naranjas
                    vec3 col = mix(uColor * 0.55, vec3(1.0, 0.92, 0.5), smoothstep(0.18, 0.7, n));
                    col *= (radial * 1.2 + 0.5);

                    // añadir pequeñas variaciones localmente
                    col += vec3(n * 0.12);

                    gl_FragColor = vec4(col, 1.0);
                }
            `,
            transparent: false,
            side: THREE.FrontSide,
        });
    }, []);

    useFrame(({clock}) => {
        const t = clock.getElapsedTime();
        // animaciones: rotación lenta y actualizar tiempo del shader
        if (shaderMat && (shaderMat as THREE.ShaderMaterial).uniforms) {
            (shaderMat as THREE.ShaderMaterial).uniforms.uTime.value = t;
        }
        if (coreRef.current) coreRef.current.rotation.y = t * 0.12;
        if (coronaRef.current) {
            coronaRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06);
        }
    });

    return (
        <group>
            {/* Núcleo: esfera con shader animado */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                {/* React Three Fiber: usar primitive para asignar material creado manualmente */}
                <primitive object={shaderMat} attach="material" />
            </mesh>

            {/* Corona del sol con halo aditivo (mantengo la aproximación previa) */}
            <Billboard>
                <mesh ref={coronaRef}>
                    <planeGeometry args={[18, 18]} />
                    <meshBasicMaterial
                        map={glowTex}
                        color={new THREE.Color('#ffb86b')}
                        transparent
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            </Billboard>

            {/* Una sola luz puntual con tono cálido para la escena */}
            <pointLight color="#ffb86b" intensity={4} distance={60} decay={1.2} />
        </group>
    );
};

// ---------------------------------------------------------------------------
// SCENE
// ---------------------------------------------------------------------------

const SolarSystemScene = () => (
    <>
        <ambientLight intensity={0.1}/>
        <Stars radius={120} depth={60} count={5000} factor={3} saturation={0} fade speed={0.5}/>
        <Sun/>

        {Object.entries(techData).map(([category, data], catIdx) => (
            <group key={category} rotation={[data.orbitTilt, catIdx * 0.35, 0]}>
                <OrbitRing radius={data.radius} color={data.color}/>
                <Suspense fallback={null}>
                    {data.items.map((tech, i) => {
                        const size = 0.3 + ((i * 13 + catIdx * 7) % 10) / 10 * 0.2;
                        return (
                            <TechPlanet
                                key={tech.name}
                                name={tech.name}
                                logo={tech.logo}
                                radius={data.radius}
                                angle={(i / data.items.length) * Math.PI * 2}
                                color={data.color}
                                size={size}
                            />
                        );
                    })}
                </Suspense>
            </group>
        ))}

        <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={6}
            maxDistance={28}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 8}
            autoRotate
            autoRotateSpeed={0.05}
            makeDefault
        />
    </>
);

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------

const TechSolarSystem = () => {
    const [isReady, setIsReady] = useState(false);

    return (
        <section id="techstack" className="section-padding">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6}}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        Tech <span className="text-gradient">Stack</span>
                    </h2>
                    <div className="w-16 h-1 bg-primary rounded-full mb-4"/>
                    <p className="text-muted-foreground mb-8 text-sm">
                        Explore my tech universe — drag to rotate, scroll to zoom
                    </p>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, scale: 0.95}}
                    whileInView={{opacity: 1, scale: 1}}
                    viewport={{once: true}}
                    transition={{duration: 0.8, delay: 0.2}}
                    className="relative w-full rounded-2xl overflow-hidden glass"
                    style={{height: "600px"}}
                >
                    <Canvas
                        camera={{position: [0, 14, 20], fov: 48}}
                        gl={{antialias: true, powerPreference: "high-performance", alpha: false}}
                        dpr={[1, 1.5]}
                        onCreated={() => setIsReady(true)}
                        style={{width: "100%", height: "100%"}}
                    >
                        <SolarSystemScene/>
                    </Canvas>

                    {!isReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-card">
                            <div
                                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {Object.entries(techData).map(([category, data]) => (
                        <div key={category} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: data.color}}/>
                            <span className="text-sm text-muted-foreground">{category}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechSolarSystem;
