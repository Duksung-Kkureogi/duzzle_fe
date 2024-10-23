import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";

import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: React.PropsWithChildren<{
      args?: ConstructorParameters<typeof TextGeometry>;
    }>;
  }
}

interface NFTInfo {
  owner: string;
  creationDate: string;
  uniqueId: string;
}

function NFTInfoText({
  info,
  position,
}: {
  info: NFTInfo;
  position: [number, number, number];
}) {
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "https://raw.githubusercontent.com/examples/three.js/Nanum Gothic_Regular.json",
      (loadedFont) => {
        setFont(loadedFont);
      }
    );
  }, []);

  const textMaterial = useMemo(
    () => new THREE.MeshPhongMaterial({ color: 0x000000 }),
    []
  );

  if (!font) return null;

  const createTextMesh = (text: string, yOffset: number) => (
    <mesh
      position={[position[0], position[1] + yOffset, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <textGeometry args={[text, { font, size: 5, height: 1 }]} />
      <primitive object={textMaterial} attach="material" />
    </mesh>
  );

  return (
    <group>
      {createTextMesh(`소유자: ${info.owner}`, 10)}
      {createTextMesh(`생성일: ${info.creationDate}`, 0)}
      {createTextMesh(`고유 ID: ${info.uniqueId}`, -10)}
    </group>
  );
}

function Lights() {
  return (
    <>
      {/* 단일 전역 조명만 사용 */}
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      {/* 약한 주변광 추가 */}
      <ambientLight intensity={2} />
    </>
  );
}

function Model({ url, nftInfo }: { url: string; nftInfo: NFTInfo }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const originalMaterial = child.material;
          const newMaterial = new THREE.MeshStandardMaterial({
            color: originalMaterial.color,
            map: originalMaterial.map,
            transparent: originalMaterial.transparent,
            opacity: originalMaterial.opacity,
            flatShading: true,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0,
          });

          child.material = newMaterial;
        }
      }
    });
  }, [scene]);

  return (
    <>
      <primitive object={scene} />
      <NFTInfoText info={nftInfo} position={[0, 150, 0]} />
    </>
  );
}

function ThreeDScene({
  width,
  height,
  url,
  nftInfo,
}: {
  width: string;
  height: string;
  url: string;
  nftInfo: NFTInfo;
}) {
  return (
    <div style={{ width, height }}>
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.LinearDisplayP3ColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[200, 200, 200]}
          fov={45}
          near={1}
          far={2000}
        />
        <color attach="background" args={["#f0f8ff"]} />

        <Suspense fallback={null}>
          <Model url={url} nftInfo={nftInfo} />
        </Suspense>

        <Lights />

        <OrbitControls
          target={[0, 50, 0]}
          maxPolarAngle={Math.PI / 2}
          minDistance={100}
          maxDistance={500}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {/* 후처리 효과 모두 제거 */}
      </Canvas>
    </div>
  );
}

export default ThreeDScene;
