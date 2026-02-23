import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Text, Float, OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const techData = {
  "Lenguajes": {
    color: "#2dd4bf",
    items: ["C", "C++", "Java", "JavaScript", "PHP", "Python", "R", "PowerShell"],
    radius: 4,
  },
  "Bases de Datos": {
    color: "#38bdf8",
    items: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
    radius: 7,
  },
  "Frameworks": {
    color: "#a78bfa",
    items: ["Bootstrap", "Django", "Node.js", "React", "Spring", "WordPress", "NPM"],
    radius: 10,
  },
  "Plataformas": {
    color: "#fb923c",
    items: ["Azure", "Google Cloud", "GitHub Pages", "Linux", "Git", "Arduino"],
    radius: 13,
  },
};

const OrbitRing = ({ radius, color }: { radius: number; color: string }) => {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={0.15}
      lineWidth={1}
    />
  );
};

const TechPlanet = ({ name, radius, angle, speed, color, size }: {
  name: string; radius: number; angle: number; speed: number; color: string; size: number;
}) => {
  const ref = useRef<THREE.Group>(null);
  const initialAngle = useRef(angle);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = initialAngle.current + clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
  });

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        <pointLight color={color} intensity={0.5} distance={3} />
        <Text
          position={[0, size + 0.4, 0]}
          fontSize={0.35}
          color={color}
          anchorX="center"
          anchorY="bottom"
        >
          {name}
        </Text>
      </Float>
    </group>
  );
};

const Sun = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1} />
      </mesh>
      <pointLight color="#2dd4bf" intensity={3} distance={30} />
      <Text position={[0, 2.3, 0]} fontSize={0.5} color="#2dd4bf" anchorX="center" anchorY="bottom">
        Tech Stack
      </Text>
    </group>
  );
};

// Pre-compute sizes to avoid Math.random() in render
const planetSizes: Record<string, Record<string, number>> = {};
Object.entries(techData).forEach(([cat, data]) => {
  planetSizes[cat] = {};
  data.items.forEach((item, i) => {
    planetSizes[cat][item] = 0.35 + (((i * 7 + 3) % 10) / 10) * 0.15;
  });
});

const SolarSystemScene = () => {
  return (
    <>
      <ambientLight intensity={0.15} />
      <Sun />
      {Object.entries(techData).map(([category, data]) => (
        <group key={category}>
          <OrbitRing radius={data.radius} color={data.color} />
          {data.items.map((tech, i) => (
            <TechPlanet
              key={tech}
              name={tech}
              radius={data.radius}
              angle={(i / data.items.length) * Math.PI * 2}
              speed={0.15 / (data.radius / 4)}
              color={data.color}
              size={planetSizes[category][tech]}
            />
          ))}
        </group>
      ))}
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={8}
        maxDistance={30}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
};

const TechSolarSystem = () => {
  const [isReady, setIsReady] = useState(false);

  return (
    <section id="techstack" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground mb-8 text-sm">
            Explora mi universo tecnológico — arrastra para rotar, scroll para zoom
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full rounded-2xl overflow-hidden glass"
          style={{ height: "600px" }}
        >
          <Canvas
            camera={{ position: [0, 12, 18], fov: 50 }}
            onCreated={() => setIsReady(true)}
            style={{ width: "100%", height: "100%" }}
          >
            <SolarSystemScene />
          </Canvas>

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </motion.div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {Object.entries(techData).map(([category, data]) => (
            <div key={category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
              <span className="text-sm text-muted-foreground">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSolarSystem;
