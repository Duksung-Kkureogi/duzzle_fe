import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useThree, extend } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  Bloom,
  SMAA,
  EffectComposer,
  BrightnessContrast,
  HueSaturation,
} from "@react-three/postprocessing";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import * as THREE from "three";
// import { ShaderPass } from "postprocessing";

class ColorCorrectionEffect extends Effect {
  constructor({ brightness = 1, contrast = 1, saturation = 1 }) {
    super("ColorCorrectionEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ["brightness", { value: brightness }],
        ["contrast", { value: contrast }],
        ["saturation", { value: saturation }],
      ]),
    });
  }
}

const fragmentShader = `
  uniform float brightness;
  uniform float contrast;
  uniform float saturation;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb * brightness;
    color = (color - 0.5) * contrast + 0.5;
    float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(vec3(gray), color, saturation);
    outputColor = vec4(color, inputColor.a);
  }
`;

function ColorCorrection({ brightness = 1, contrast = 1, saturation = 1 }) {
  const { gl } = useThree();

  useEffect(() => {
    const effect = new ColorCorrectionEffect({
      brightness,
      contrast,
      saturation,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const composer = gl.getContext().__postprocessingComposer;
    if (composer) {
      composer.addEffect(effect);
    }
    return () => {
      if (composer) {
        composer.removeEffect(effect);
      }
    };
  }, [gl, brightness, contrast, saturation]);

  return null;
}

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { ShaderMaterial } from "three";
import { BlendFunction, Effect } from "postprocessing";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: React.PropsWithChildren<{
      args?: ConstructorParameters<typeof TextGeometry>;
    }>;
  }
}

interface ColorAdjustmentShaderParameters {
  uniforms: {
    tDiffuse: { value: THREE.Texture | null };
    saturation: { value: number };
    brightness: { value: number };
    contrast: { value: number };
  };
  vertexShader: string;
  fragmentShader: string;
}

const ColorAdjustmentShader: ColorAdjustmentShaderParameters = {
  uniforms: {
    tDiffuse: { value: null },
    saturation: { value: 1.1 }, // 채도
    contrast: { value: 1.1 }, // 대비
    brightness: { value: 1.05 }, // 밝기
  },
  vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
  fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float saturation;
      uniform float contrast;
      uniform float brightness;
      varying vec2 vUv;
      void main() {
        vec4 tex = texture2D(tDiffuse, vUv);
        vec3 gray = vec3(dot(tex.rgb, vec3(0.299, 0.587, 0.114)));
        vec3 saturated = mix(gray, tex.rgb, saturation);
        vec3 contrasted = (saturated - 0.5) * contrast + 0.5;
        gl_FragColor = vec4(contrasted * brightness, tex.a);
      }
    `,
};

extend({ ShaderPass, EffectComposer });

function ColorAdjustment() {
  const { gl } = useThree();
  const pass = useMemo(() => new ShaderPass(ColorAdjustmentShader as any), []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const composer = (gl as any).getContext().composer;
    if (composer) {
      composer.addPass(pass);
    }
    return () => {
      if (composer) {
        composer.removePass(pass);
      }
    };
  }, [gl, pass]);

  return null;
}

function UserNameText({ userName }: { userName: string }) {
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (loadedFont) => {
        setFont(loadedFont);
      }
    );
  }, []);

  if (!font) return null;

  return (
    <mesh position={[0, 150, 0]} rotation={[-Math.PI, 0, 0]}>
      <textGeometry args={[userName, { font, size: 20, height: 5 }]} />
      <meshPhongMaterial color="#000000" />
    </mesh>
  );
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

function Model({ url, nftInfo }: { url: string; nftInfo: NFTInfo }) {
  const { scene } = useGLTF(url);
  const { gl } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1;
          child.material.roughness = 0.7;
          child.material.metalness = 0.2;
          child.material.needsUpdate = true;
          // const gammaCorrect = (color: number) => Math.pow(color / 255, 2.2);
          // if (child.material instanceof THREE.MeshStandardMaterial) {
          //   const c4dRed = 200;
          //   const c4dGreen = 150;
          //   const c4dBlue = 100;
          //   child.material.color.setRGB(
          //     gammaCorrect(c4dRed),
          //     gammaCorrect(c4dGreen),
          //     gammaCorrect(c4dBlue)
          //   );
          // }
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

// function Lights() {
//   return (
//     <>
//       <ambientLight intensity={0.5} color="#fff5e6" />
//       {/* <directionalLight
//         position={[10, 10, 5]}
//         intensity={0.9}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-bias={-0.0001} // 그림자 품질 개선
//       /> */}
//     </>
//   );
// }

function Lights() {
  return (
    <>
      {/* 부드러운 주변광, 모든 방향에서 동일한 빛을 제공 */}
      <ambientLight intensity={0.7} color="#ffffff" />

      {/* 직사광, 특정 방향에서 들어오는 강한 빛과 그림자 */}
      <directionalLight
        position={[10, 10, 10]} // 빛의 위치 설정
        intensity={0.5} // 빛의 강도
        castShadow // 그림자를 활성화
        shadow-mapSize-width={4096} // 그림자의 해상도
        shadow-mapSize-height={4096}
        shadow-camera-far={50} // 그림자 카메라의 원거리 클리핑
        shadow-camera-near={0.1} // 근거리 클리핑
        shadow-camera-left={-10} // 그림자 카메라의 왼쪽 경계
        shadow-camera-right={10} // 오른쪽 경계
        shadow-camera-top={10} // 위쪽 경계
        shadow-camera-bottom={-10} // 아래쪽 경계
      />
    </>
  );
}

// ThreeDScene 컴포넌트
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
        shadows
        gl={{
          preserveDrawingBuffer: true,
          // toneMapping:THREE.LinearToneMapping ,
          toneMapping: THREE.ACESFilmicToneMapping,
          // toneMapping: THREE.CineonToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[-300, 0, -300]}
          fov={35}
          near={1}
          far={1000}
          rotation={[0, 0, 0]}
        />
        <color attach="background" args={["#e6e6e6"]} />
        {/* <color attach="background" args={["#e0e0e0"]} /> */}

        <Suspense fallback={null}>
          <Model url={url} nftInfo={nftInfo} />
          {/* <Environment
            preset="studio"
            background={false}
            environmentIntensity={0.05}
          /> */}
        </Suspense>
        <Lights />
        <OrbitControls target={[0, 0, 0]} />
        {/* <EffectComposer>
          <Bloom
            intensity={0.1}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
          />
          <SMAA />
        </EffectComposer> */}
        {/* <ColorAdjustment /> */}
        {/* <EffectComposer>
          <Bloom
            intensity={0.05}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
          />
          <BrightnessContrast brightness={0} contrast={0.2} />
          <HueSaturation saturation={0.1} />
          <SMAA />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
}

export default ThreeDScene;
