import { useMemo, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

import { Pose } from "./posePresets";

interface MinecraftCharacterProps {
    skinImage: HTMLImageElement;
    pose: Pose["poseConfig"];
    facial?: Pose["facial"];
}

export function BendableMinecraftCharacter({ skinImage, pose, facial }: MinecraftCharacterProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Create material helper
    const createMaterial = useCallback((x: number, y: number, w: number, h: number) => {
        const canvas = document.createElement("canvas");
        canvas.width = w * 8;
        canvas.height = h * 8;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 8, h * 8);
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = true;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        texture.magFilter = 1003; // NearestFilter for pixelated look
        texture.minFilter = 1003;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
    }, [skinImage]);

    // Facials: System for swapping eye/mouth textures
    const createSubTextureMaterial = useCallback((x: number, y: number, w: number, h: number, opacity = 1) => {
        const canvas = document.createElement("canvas");
        canvas.width = w * 8;
        canvas.height = h * 8;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 8, h * 8);
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        return new THREE.MeshLambertMaterial({ map: texture, transparent: true, opacity });
    }, [skinImage]);

    // Create a complete limb with two-bone system
    const createLimbSystem = useCallback(() => {
    const upperBone = new THREE.Bone();
    const lowerBone = new THREE.Bone();

    // Bone hierarchy
    upperBone.position.set(0, 0, 0);
    lowerBone.position.set(0, -6, 0);
    upperBone.add(lowerBone);

    // Geometry stays centered
    const geometry = new THREE.BoxGeometry(4, 12, 4, 1, 24, 1);

    const pos = geometry.attributes.position;
    const skinIndices: number[] = [];
    const skinWeights: number[] = [];

    // Vertex Y range: -6 → +6
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);

        let upper = 0;
        let lower = 0;

        if (y >= 0) {
            // Upper half
            upper = 1;
            lower = 0;
        } else if (y <= -6) {
            // Lower half
            upper = 0;
            lower = 1;
        } else {
            // Smooth blend between 0 and -6
            const t = Math.abs(y) / 6;
            upper = 1 - t;
            lower = t;
        }

        skinIndices.push(0, 1, 0, 0);
        skinWeights.push(upper, lower, 0, 0);
    }

    geometry.setAttribute(
        "skinIndex",
        new THREE.Uint16BufferAttribute(skinIndices, 8)
    );
    geometry.setAttribute(
        "skinWeight",
        new THREE.Float32BufferAttribute(skinWeights, 8)
    );

    return { upperBone, lowerBone, geometry };
}, []);


    // Create limb systems
    const limbSystems = useMemo(() => ({
        leftArm: createLimbSystem(),
        rightArm: createLimbSystem(),
        leftLeg: createLimbSystem(),
        rightLeg: createLimbSystem(),
    }), [createLimbSystem]);

    // Create separate bones for head and body
    const staticBones = useMemo(() => ({
        head: new THREE.Bone(),
        body: new THREE.Bone(),
    }), []);

    // Materials
    const headMaterials = useMemo(() => [
        createMaterial(16, 8, 8, 8),
        createMaterial(0, 8, 8, 8),
        createMaterial(8, 0, 8, 8),
        createMaterial(16, 0, 8, 8),
        createMaterial(8, 8, 8, 8),
        createMaterial(24, 8, 8, 8),
    ], [createMaterial]);


    const bodyMaterials = useMemo(() => [
        createMaterial(16, 20, 4, 12),
        createMaterial(28, 20, 4, 12),
        createMaterial(20, 16, 8, 4),
        createMaterial(28, 16, 8, 4),
        createMaterial(20, 20, 8, 12),
        createMaterial(32, 20, 8, 12),
    ], [createMaterial]);

    const armMaterials = useMemo(() => [
        createMaterial(44, 20, 4, 12),
        createMaterial(52, 20, 4, 12),
        createMaterial(44, 16, 4, 4),
        createMaterial(48, 16, 4, 4),
        createMaterial(44, 20, 4, 12),
        createMaterial(48, 20, 4, 12),
    ], [createMaterial]);

    const legMaterials = useMemo(() => [
        createMaterial(4, 20, 4, 12),
        createMaterial(12, 20, 4, 12),
        createMaterial(4, 16, 4, 4),
        createMaterial(8, 16, 4, 4),
        createMaterial(4, 20, 4, 12),
        createMaterial(8, 20, 4, 12),
    ], [createMaterial]);

    // Create skinned meshes
    const meshes = useMemo(() => {
        const createSkinnedLimb = (geom: THREE.BoxGeometry, mats: THREE.Material[], system: any) => {
            const mesh = new THREE.SkinnedMesh(geom, mats);
            mesh.frustumCulled = false; // Prevent culling issues with animation

            // Create and bind skeleton
            const skeleton = new THREE.Skeleton([system.upperBone, system.lowerBone]);
            mesh.add(system.upperBone);
            mesh.bind(skeleton);

            // Set proper bind matrix (identity for origin-based bones)
            // mesh.bindMatrix.identity();
            // mesh.bindMatrixInverse.identity();

            return mesh;
        };

        return {
            leftArmMesh: createSkinnedLimb(limbSystems.leftArm.geometry, armMaterials, limbSystems.leftArm),
            rightArmMesh: createSkinnedLimb(limbSystems.rightArm.geometry, armMaterials, limbSystems.rightArm),
            leftLegMesh: createSkinnedLimb(limbSystems.leftLeg.geometry, legMaterials, limbSystems.leftLeg),
            rightLegMesh: createSkinnedLimb(limbSystems.rightLeg.geometry, legMaterials, limbSystems.rightLeg),
        };
    }, [limbSystems, armMaterials, legMaterials]);

    // Initialize limb positions (Skeleton offset)
    // We move the bones to position, and keep the meshes at origin.
    // This ensures consistent SkinnedMesh behavior.
   useEffect(() => {
    limbSystems.leftArm.upperBone.position.set(-6, 24, 0);
    limbSystems.rightArm.upperBone.position.set(6, 24, 0);

    limbSystems.leftLeg.upperBone.position.set(-2, 12, 0);
    limbSystems.rightLeg.upperBone.position.set(2, 12, 0);
}, [limbSystems]);


    // Apply pose mapping PRESET -> BONES
    useEffect(() => {
        const deg2rad = (deg: number) => (deg * Math.PI) / 180;

        // Safely access pose properties with defaults
        const safePose = {
            head: pose?.head || { x: 0, y: 10, z: 0 },
            body: pose?.body || { x: 0, y: 100, z: 0 },
            leftUpperArm: pose?.leftUpperArm || { x: 50, y: 0, z: 0, bendAngle: 0 },
            rightUpperArm: pose?.rightUpperArm || { x: -50, y: 0, z: 0, bendAngle: 0 },
            leftUpperLeg: pose?.leftUpperLeg || { x: 50, y: 0, z: 0, bendAngle: 0 },
            rightUpperLeg: pose?.rightUpperLeg || { x: 50, y: 0, z: 0, bendAngle: 0 },
        };

        staticBones.head.rotation.set(deg2rad(safePose.head.x), deg2rad(safePose.head.y), deg2rad(safePose.head.z));
        staticBones.body.rotation.set(deg2rad(safePose.body.x), deg2rad(safePose.body.y), deg2rad(safePose.body.z));

        // Arms mapping: Upper part to upperBone, bendAngle to lowerBone
        limbSystems.leftArm.upperBone.rotation.set(
            deg2rad(safePose.leftUpperArm.x),
            deg2rad(safePose.leftUpperArm.y),
            deg2rad(safePose.leftUpperArm.z)
        );
        limbSystems.leftArm.lowerBone.rotation.set(
            deg2rad(safePose.leftUpperArm.bendAngle || 0),
            0,
            0
        );

        limbSystems.rightArm.upperBone.rotation.set(
            deg2rad(safePose.rightUpperArm.x),
            deg2rad(safePose.rightUpperArm.y),
            deg2rad(safePose.rightUpperArm.z)
        );
        limbSystems.rightArm.lowerBone.rotation.set(
            deg2rad(safePose.rightUpperArm.bendAngle || 0),
            0,
            0
        );

        // Legs mapping: Upper part to upperBone, bendAngle to lowerBone
        limbSystems.leftLeg.upperBone.rotation.set(
            deg2rad(safePose.leftUpperLeg.x),
            deg2rad(safePose.leftUpperLeg.y),
            deg2rad(safePose.leftUpperLeg.z)
        );
        limbSystems.leftLeg.lowerBone.rotation.set(
            deg2rad(safePose.leftUpperLeg.bendAngle || 0),
            0,
            0
        );

        limbSystems.rightLeg.upperBone.rotation.set(
            deg2rad(safePose.rightUpperLeg.x),
            deg2rad(safePose.rightUpperLeg.y),
            deg2rad(safePose.rightUpperLeg.z)
        );
        limbSystems.rightLeg.lowerBone.rotation.set(
            deg2rad(safePose.rightUpperLeg.bendAngle || 0),
            0,
            0
        );
    }, [pose, staticBones, limbSystems]);

    // Facial materials
    const eyeMaterial = useMemo(() => createSubTextureMaterial(8, 12, 8, 2), [createSubTextureMaterial]);
    const mouthMaterial = useMemo(() => createSubTextureMaterial(8, 14, 8, 2), [createSubTextureMaterial]);

    return (
        <group ref={groupRef} position={[0, -2, 0]} scale={0.125}>
            {/* Head - with bone for rotation */}
            <primitive object={staticBones.head} position={[0, 24, 0]}>
                <mesh
                    geometry={new THREE.BoxGeometry(8, 8, 8)}
                    material={headMaterials}
                    position={[0, 4, 0]} // Position mesh so pivot is at bottom
                />

                {/* Facial Features (Secondary Planes) */}
                {/* <group position={[0, 4, 0]}>
                    <mesh position={[
                        (facial?.eyes?.x || 0) * 0.1,
                        (facial?.eyes?.y || 0) * 0.1,
                        4.01
                    ]}>
                        <planeGeometry args={[8, 2]} />
                        <primitive object={eyeMaterial} attach="material" />
                    </mesh>

                    <mesh position={[0, -2 - (facial?.mouth?.smile || 0) * 0.1, 4.01]}>
                        <planeGeometry args={[8, 2]} />
                        <primitive object={mouthMaterial} attach="material" />
                    </mesh>
                </group> */}
            </primitive>

            {/* Body - with bone for rotation */}
            <primitive object={staticBones.body} position={[0, 12, 0]}>
                <mesh
                    geometry={new THREE.BoxGeometry(8, 12, 4)}
                    material={bodyMaterials}
                    position={[0, 6, 0]} // Pivot at bottom (Waist)
                />
            </primitive>

            {/* Limbs - skinned meshes positioned at origin, controlled by bones */}
            {/* <primitive object={meshes.leftArmMesh} /> */}
            {/* <primitive object={meshes.rightArmMesh} /> */}
            {/* <primitive object={meshes.leftLegMesh} /> */}
            {/* <primitive object={meshes.rightLegMesh} /> */}
        </group>
    );
}
