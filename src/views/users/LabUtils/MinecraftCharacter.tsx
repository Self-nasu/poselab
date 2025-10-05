import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, BoxGeometry, MeshLambertMaterial, CanvasTexture, MeshPhongMaterial } from "three";

interface MinecraftCharacterProps {
  skinImage: HTMLImageElement;
  pose: {
    leftUpperArm: { x: number; y: number; z: number };
    leftLowerArm: { x: number; y: number; z: number };
    rightUpperArm: { x: number; y: number; z: number };
    rightLowerArm: { x: number; y: number; z: number };
    leftUpperLeg: { x: number; y: number; z: number };
    leftLowerLeg: { x: number; y: number; z: number };
    rightUpperLeg: { x: number; y: number; z: number };
    rightLowerLeg: { x: number; y: number; z: number };
    head: { x: number; y: number; z: number };
    body: { x: number; y: number; z: number };
  };
}

export const MinecraftCharacter = ({ skinImage, pose }: MinecraftCharacterProps) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const leftUpperArmRef = useRef<Group>(null);
  const leftLowerArmRef = useRef<Group>(null);
  const rightUpperArmRef = useRef<Group>(null);
  const rightLowerArmRef = useRef<Group>(null);
  const leftUpperLegRef = useRef<Group>(null);
  const leftLowerLegRef = useRef<Group>(null);
  const rightUpperLegRef = useRef<Group>(null);
  const rightLowerLegRef = useRef<Group>(null);

  // Apply pose rotations with proper joint hierarchy
  useEffect(() => {
    if (headRef.current) {
      headRef.current.rotation.set(
        (pose.head.x * Math.PI) / 180,
        (pose.head.y * Math.PI) / 180,
        (pose.head.z * Math.PI) / 180
      );
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.set(
        (pose.body.x * Math.PI) / 180,
        (pose.body.y * Math.PI) / 180,
        (pose.body.z * Math.PI) / 180
      );
    }
    
    // Left arm joints
    if (leftUpperArmRef.current) {
      leftUpperArmRef.current.rotation.set(
        (pose.leftUpperArm.x * Math.PI) / 180,
        (pose.leftUpperArm.y * Math.PI) / 180,
        (pose.leftUpperArm.z * Math.PI) / 180
      );
    }
    if (leftLowerArmRef.current) {
      leftLowerArmRef.current.rotation.set(
        (pose.leftLowerArm.x * Math.PI) / 180,
        (pose.leftLowerArm.y * Math.PI) / 180,
        (pose.leftLowerArm.z * Math.PI) / 180
      );
    }
    
    // Right arm joints
    if (rightUpperArmRef.current) {
      rightUpperArmRef.current.rotation.set(
        (pose.rightUpperArm.x * Math.PI) / 180,
        (pose.rightUpperArm.y * Math.PI) / 180,
        (pose.rightUpperArm.z * Math.PI) / 180
      );
    }
    if (rightLowerArmRef.current) {
      rightLowerArmRef.current.rotation.set(
        (pose.rightLowerArm.x * Math.PI) / 180,
        (pose.rightLowerArm.y * Math.PI) / 180,
        (pose.rightLowerArm.z * Math.PI) / 180
      );
    }
    
    // Left leg joints
    if (leftUpperLegRef.current) {
      leftUpperLegRef.current.rotation.set(
        (pose.leftUpperLeg.x * Math.PI) / 180,
        (pose.leftUpperLeg.y * Math.PI) / 180,
        (pose.leftUpperLeg.z * Math.PI) / 180
      );
    }
    if (leftLowerLegRef.current) {
      leftLowerLegRef.current.rotation.set(
        (pose.leftLowerLeg.x * Math.PI) / 180,
        (pose.leftLowerLeg.y * Math.PI) / 180,
        (pose.leftLowerLeg.z * Math.PI) / 180
      );
    }
    
    // Right leg joints
    if (rightUpperLegRef.current) {
      rightUpperLegRef.current.rotation.set(
        (pose.rightUpperLeg.x * Math.PI) / 180,
        (pose.rightUpperLeg.y * Math.PI) / 180,
        (pose.rightUpperLeg.z * Math.PI) / 180
      );
    }
    if (rightLowerLegRef.current) {
      rightLowerLegRef.current.rotation.set(
        (pose.rightLowerLeg.x * Math.PI) / 180,
        (pose.rightLowerLeg.y * Math.PI) / 180,
        (pose.rightLowerLeg.z * Math.PI) / 180
      );
    }
  }, [pose]);

  // Create UV-mapped materials for proper texture mapping
  // Three.js BoxGeometry face order: right, left, top, bottom, front, back
  const createCubeMaterials = (uvMap: {
    right: [number, number, number, number],
    left: [number, number, number, number],
    top: [number, number, number, number],
    bottom: [number, number, number, number],
    front: [number, number, number, number],
    back: [number, number, number, number]
  }) => {
    return [uvMap.right, uvMap.left, uvMap.top, uvMap.bottom, uvMap.front, uvMap.back].map(([x, y, w, h]) => {
      const canvas = document.createElement('canvas');
      canvas.width = w * 4; // Scale up for better quality
      canvas.height = h * 4;
      const ctx = canvas.getContext('2d')!;
      
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 4, h * 4);
      
      const texture = new CanvasTexture(canvas);
      texture.flipY = false;
      texture.generateMipmaps = false;
      texture.magFilter = 1003; // NearestFilter for pixelated look
      texture.minFilter = 1003;
      
      return new MeshPhongMaterial({ 
        map: texture,
        transparent: true,
        alphaTest: 0.1
      });
    });
  };

  // Improved geometry with proper proportions
  const headGeometry = new BoxGeometry(8, 8, 8);
  const bodyGeometry = new BoxGeometry(8, 12, 4);
  const upperArmGeometry = new BoxGeometry(4, 6, 4);
  const lowerArmGeometry = new BoxGeometry(4, 6, 4);
  const upperLegGeometry = new BoxGeometry(4, 6, 4);
  const lowerLegGeometry = new BoxGeometry(4, 6, 4);

  // Overlay geometry (slightly larger for second layer)
  const headOverlayGeometry = new BoxGeometry(8.5, 8.5, 8.5);
  const bodyOverlayGeometry = new BoxGeometry(8.5, 12.5, 4.5);
  const upperArmOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);
  const lowerArmOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);
  const upperLegOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);
  const lowerLegOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);

  // UV mappings for each body part (based on standard Minecraft skin layout)
  const headMaterials = createCubeMaterials({
    right: [0, 8, 8, 8],    // Right side
    left: [16, 8, 8, 8],    // Left side  
    top: [8, 0, 8, 8],      // Top
    bottom: [16, 0, 8, 8],  // Bottom
    front: [8, 8, 8, 8],    // Front
    back: [24, 8, 8, 8]     // Back
  });

  const bodyMaterials = createCubeMaterials({
    right: [16, 20, 4, 12],  // Right side
    left: [28, 20, 4, 12],   // Left side
    top: [20, 16, 8, 4],     // Top
    bottom: [28, 16, 8, 4],  // Bottom
    front: [20, 20, 8, 12],  // Front
    back: [32, 20, 8, 12]    // Back
  });

  const leftArmMaterials = createCubeMaterials({
    right: [32, 52, 4, 12],  // Right side
    left: [40, 52, 4, 12],   // Left side
    top: [36, 48, 4, 4],     // Top
    bottom: [40, 48, 4, 4],  // Bottom
    front: [36, 52, 4, 12],  // Front
    back: [44, 52, 4, 12]    // Back
  });

  const rightArmMaterials = createCubeMaterials({
    right: [40, 20, 4, 12],  // Right side
    left: [48, 20, 4, 12],   // Left side
    top: [44, 16, 4, 4],     // Top
    bottom: [48, 16, 4, 4],  // Bottom
    front: [44, 20, 4, 12],  // Front
    back: [52, 20, 4, 12]    // Back
  });

  const leftLegMaterials = createCubeMaterials({
    right: [16, 52, 4, 12],  // Right side
    left: [24, 52, 4, 12],   // Left side
    top: [20, 48, 4, 4],     // Top
    bottom: [24, 48, 4, 4],  // Bottom
    front: [20, 52, 4, 12],  // Front
    back: [28, 52, 4, 12]    // Back
  });

  const rightLegMaterials = createCubeMaterials({
    right: [0, 20, 4, 12],   // Right side
    left: [8, 20, 4, 12],    // Left side
    top: [4, 16, 4, 4],      // Top
    bottom: [8, 16, 4, 4],   // Bottom
    front: [4, 20, 4, 12],   // Front
    back: [12, 20, 4, 12]    // Back
  });

  // Overlay materials (second layer from skin texture)
  const headOverlayMaterials = createCubeMaterials({
    right: [32, 8, 8, 8],    // Right side
    left: [48, 8, 8, 8],     // Left side  
    top: [40, 0, 8, 8],      // Top
    bottom: [48, 0, 8, 8],   // Bottom
    front: [40, 8, 8, 8],    // Front
    back: [56, 8, 8, 8]      // Back
  });

  const bodyOverlayMaterials = createCubeMaterials({
    right: [16, 36, 4, 12],  // Right side
    left: [28, 36, 4, 12],   // Left side
    top: [20, 32, 8, 4],     // Top
    bottom: [28, 32, 8, 4],  // Bottom
    front: [20, 36, 8, 12],  // Front
    back: [32, 36, 8, 12]    // Back
  });

  const leftArmOverlayMaterials = createCubeMaterials({
    right: [48, 52, 4, 12],  // Right side
    left: [56, 52, 4, 12],   // Left side
    top: [52, 48, 4, 4],     // Top
    bottom: [56, 48, 4, 4],  // Bottom
    front: [52, 52, 4, 12],  // Front
    back: [60, 52, 4, 12]    // Back
  });

  const rightArmOverlayMaterials = createCubeMaterials({
    right: [40, 36, 4, 12],  // Right side
    left: [48, 36, 4, 12],   // Left side
    top: [44, 32, 4, 4],     // Top
    bottom: [48, 32, 4, 4],  // Bottom
    front: [44, 36, 4, 12],  // Front
    back: [52, 36, 4, 12]    // Back
  });

  const leftLegOverlayMaterials = createCubeMaterials({
    right: [0, 52, 4, 12],   // Right side
    left: [8, 52, 4, 12],    // Left side
    top: [4, 48, 4, 4],      // Top
    bottom: [8, 48, 4, 4],   // Bottom
    front: [4, 52, 4, 12],   // Front
    back: [12, 52, 4, 12]    // Back
  });

  const rightLegOverlayMaterials = createCubeMaterials({
    right: [0, 36, 4, 12],   // Right side
    left: [8, 36, 4, 12],    // Left side
    top: [4, 32, 4, 4],      // Top
    bottom: [8, 32, 4, 4],   // Bottom
    front: [4, 36, 4, 12],   // Front
    back: [12, 36, 4, 12]    // Back
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={0.1}>
      {/* Head - pivot at bottom center */}
      <group ref={headRef} position={[0, 24, 0]}>
        <mesh
          position={[0, 4, 0]}
          geometry={headGeometry}
          material={headMaterials}
        />
        <mesh
          position={[0, 4, 0]}
          geometry={headOverlayGeometry}
          material={headOverlayMaterials}
        />
      </group>
      
      {/* Body - pivot at top center */}
      <group ref={bodyRef} position={[0, 24, 0]}>
        <mesh
          position={[0, -6, 0]}
          geometry={bodyGeometry}
          material={bodyMaterials}
        />
        <mesh
          position={[0, -6, 0]}
          geometry={bodyOverlayGeometry}
          material={bodyOverlayMaterials}
        />
      </group>
      
      {/* Left Arm - Complete arm with elbow joint */}
      <group ref={leftUpperArmRef} position={[-6, 24, 0]}>
        {/* Upper arm */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmGeometry}
          material={leftArmMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmOverlayGeometry}
          material={leftArmOverlayMaterials}
        />
        
        {/* Lower arm group - pivot at elbow */}
        <group ref={leftLowerArmRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmGeometry}
            material={leftArmMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmOverlayGeometry}
            material={leftArmOverlayMaterials}
          />
        </group>
      </group>
      
      {/* Right Arm - Complete arm with elbow joint */}
      <group ref={rightUpperArmRef} position={[6, 24, 0]}>
        {/* Upper arm */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmGeometry}
          material={rightArmMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmOverlayGeometry}
          material={rightArmOverlayMaterials}
        />
        
        {/* Lower arm group - pivot at elbow */}
        <group ref={rightLowerArmRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmGeometry}
            material={rightArmMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmOverlayGeometry}
            material={rightArmOverlayMaterials}
          />
        </group>
      </group>
      
      {/* Left Leg - Complete leg with knee joint */}
      <group ref={leftUpperLegRef} position={[-2, 12, 0]}>
        {/* Upper leg */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegGeometry}
          material={leftLegMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegOverlayGeometry}
          material={leftLegOverlayMaterials}
        />
        
        {/* Lower leg group - pivot at knee */}
        <group ref={leftLowerLegRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegGeometry}
            material={leftLegMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegOverlayGeometry}
            material={leftLegOverlayMaterials}
          />
        </group>
      </group>
      
      {/* Right Leg - Complete leg with knee joint */}
      <group ref={rightUpperLegRef} position={[2, 12, 0]}>
        {/* Upper leg */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegGeometry}
          material={rightLegMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegOverlayGeometry}
          material={rightLegOverlayMaterials}
        />
        
        {/* Lower leg group - pivot at knee */}
        <group ref={rightLowerLegRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegGeometry}
            material={rightLegMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegOverlayGeometry}
            material={rightLegOverlayMaterials}
          />
        </group>
      </group>
    </group>
  );
};