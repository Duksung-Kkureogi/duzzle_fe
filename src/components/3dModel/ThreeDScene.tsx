import React, { Suspense, useEffect, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Text,
  Plane,
} from "@react-three/drei";
import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Minted, PieceDto } from "../../Data/DTOs/PieceDTO";
import { ContractAddress } from "../../constant/contract";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: React.PropsWithChildren<{
      args?: ConstructorParameters<typeof TextGeometry>;
    }>;
  }
}

function NFTInfoText({
  info,
  position,
}: {
  info: PieceDto;
  position: [number, number, number];
}) {
  const { zoneNameKr, zoneNameUs } = info;
  const { season, owner, nftThumbnailUrl, tokenId, description, architect } =
    info.data as Minted;

  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(nftThumbnailUrl, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, [nftThumbnailUrl]);

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const textProps = {
    fontSize: 7,
    color: "black",
    anchorX: "center" as const,
    anchorY: "middle" as const,
    font: "/fonts/SingleDay-Regular.ttf",
    material: new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 0.5,
      side: THREE.DoubleSide,
    }),
    letterSpacing: 0.1,
    resolution: 1024,
  };

  const titleProps = {
    ...textProps,
    fontSize: 10,
    color: "#1a365d",
    fontWeight: "bold",
  };

  const contentProps = {
    ...textProps,
    fontSize: 6,
    maxWidth: 120,
    lineHeight: 1.5,
    anchorY: "top" as const,
  };

  useEffect(() => {
    // 폰트 스타일 추가
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'Single Day';
        src: url('/fonts/SingleDay-Regular.ttf') format('truetype');
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const firstY = 120;
  const sectionPadding = -30;
  const linePadding = -10;
  const descriptionPadding = -20;
  const sideOffset = 80;

  return (
    <group position={position}>
      {/* 왼쪽 섹션 */}
      <group position={[-sideOffset, firstY, 0]}>
        {/* NFT 기본 정보 */}
        <group>
          <Text {...titleProps}>NFT 정보</Text>
          <Text position={[0, linePadding, 0]} {...textProps}>
            {`토큰 ID: ${tokenId}`}
          </Text>
          <Text position={[0, linePadding * 2, 0]} {...textProps}>
            {`컨트랙트 주소: ${formatWalletAddress(
              ContractAddress.PuzzlePiece
            )}`}
          </Text>
          <Text position={[0, linePadding * 3, 0]} {...textProps}>
            {`시즌: ${season}`}
          </Text>
        </group>

        {/* 위치 정보 */}
        <group position={[0, sectionPadding * 2, 0]}>
          <Text {...titleProps}>위치 정보</Text>
          <Text position={[0, linePadding, 0]} {...textProps}>
            {zoneNameKr}
          </Text>
          <Text position={[0, linePadding * 2, 0]} {...textProps}>
            {`(${zoneNameUs})`}
          </Text>
        </group>
      </group>

      {/* 중앙 섹션 - 썸네일 이미지 */}
      {texture && (
        <group position={[0, firstY - 30, 0]}>
          <Plane args={[40, 40]} position={[0, 0, 0]}>
            <meshBasicMaterial
              map={texture}
              side={THREE.DoubleSide}
              transparent={true}
            />
          </Plane>
          <Text position={[0, 25, 0]} {...titleProps}>
            조각 정보
          </Text>
        </group>
      )}

      {/* 오른쪽 섹션 */}
      <group position={[sideOffset, firstY, 0]}>
        {/* 소유자 정보 */}
        <group>
          <Text {...titleProps}>소유자 정보</Text>
          <Text position={[0, linePadding, 0]} {...textProps}>
            {owner.name}
          </Text>
          <Text position={[0, linePadding * 2, 0]} {...textProps}>
            {formatWalletAddress(owner.walletAddress)}
          </Text>
        </group>

        {/* 상세 정보 */}
        <group position={[0, sectionPadding * 2, 0]}>
          <Text {...titleProps}>상세 정보</Text>
          {architect && (
            <Text
              position={[0, descriptionPadding, 0]}
              {...textProps}
            >
              {`건축가: ${architect}`}
            </Text>
          )}
          {description && (
            <Text position={[0, descriptionPadding - 10, 0]} {...contentProps}>
              {description}
            </Text>
          )}
        </group>
      </group>
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

function Model({ url, nftInfo }: { url: string; nftInfo?: PieceDto }) {
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
      {nftInfo && <NFTInfoText info={nftInfo} position={[0, 150, 0]} />}
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
  nftInfo?: PieceDto;
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
          maxDistance={600}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

export default ThreeDScene;
