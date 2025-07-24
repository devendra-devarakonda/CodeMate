import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";

const AnimatedModel = ({
  url,
  targetPosition,
  targetScale,
  rotation,
  delay = 0,
}) => {
  const ref = useRef();
  const { scene } = useGLTF(url);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState([0.001, 0.001, 0.001]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame(() => {
    if (!ref.current || !visible) return;

    ref.current.scale.x += (targetScale[0] - ref.current.scale.x) * 0.03;
    ref.current.scale.y += (targetScale[1] - ref.current.scale.y) * 0.03;
    ref.current.scale.z += (targetScale[2] - ref.current.scale.z) * 0.03;

    const t = performance.now() / 1000;
    const bounceY = Math.sin(t * 1.5) * 0.05;
    ref.current.position.set(
      targetPosition[0],
      targetPosition[1] + bounceY,
      targetPosition[2]
    );

    if (rotation) ref.current.rotation.set(...rotation);
  });

  if (!visible) return null;
  return <primitive object={scene} ref={ref} scale={scale} />;
};

const RotatingGroup = ({ dragState }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;

    // Apply velocity drag
    dragState.current.rotationY += dragState.current.velocity;
    dragState.current.velocity *= 0.95;

    groupRef.current.rotation.y = dragState.current.rotationY;
  });

  return (
    <group ref={groupRef}>
      <AnimatedModel
        url="/assets/Profesional_PC.glb"
        targetPosition={[-1, 0.5, 0.1]}
        targetScale={[0.002, 0.002, 0.002]}
        rotation={[0, Math.PI / 5, 0]}
      />
      <AnimatedModel
        url="/assets/Adjustable Desk.glb"
        targetPosition={[-0.4, -1, -0.2]}
        rotation={[0.009, Math.PI / 0.6, 0]}
        targetScale={[1.5, 1.5, 1.5]}
      />
      <AnimatedModel
        url="/assets/Light Desk.glb"
        targetPosition={[0.6, 0.4, -0.3]}
        rotation={[0.009, Math.PI / 0.59, 0]}
        targetScale={[1.2, 1.2, 1.2]}
      />
    </group>
  );
};

const DevRoomScene = () => {
  const containerRef = useRef();
  const dragState = useRef({
    isDragging: false,
    lastX: 0,
    velocity: 0,
    rotationY: 0,
  });

  useEffect(() => {
    const el = containerRef.current;

    const handleDown = (e) => {
      dragState.current.isDragging = true;
      dragState.current.lastX = e.clientX;
    };

    const handleMove = (e) => {
      if (!dragState.current.isDragging) return;
      const deltaX = e.clientX - dragState.current.lastX;
      dragState.current.lastX = e.clientX;
      dragState.current.velocity = deltaX * 0.005;
    };

    const handleUp = () => {
      dragState.current.isDragging = false;
    };

    el.addEventListener("pointerdown", handleDown);
    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerup", handleUp);
    el.addEventListener("pointerleave", handleUp);

    return () => {
      el.removeEventListener("pointerdown", handleDown);
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerup", handleUp);
      el.removeEventListener("pointerleave", handleUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] xl:h-[650px] cursor-grab active:cursor-grabbing z-40"
    >
      <Canvas camera={{ position: [2.4, 2.2, 2.13], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <RotatingGroup dragState={dragState} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default DevRoomScene;
