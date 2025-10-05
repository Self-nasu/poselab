import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { MinecraftCharacter } from "./MinecraftCharacter";
import { PoseControls } from "./PoseControls";
import { LightingControls, Light } from "./LightingControls";
import { LightRenderer } from "./LightRenderer";
import { RenderDialog, RenderSettings } from "./RenderDialog";
import { createHighQualityRender } from "./renderUtils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";

interface CharacterViewerProps {
  skinImage: HTMLImageElement;
  onNewSkin: () => void;
}

const PRESET_POSES = {
  standing: {
    leftUpperArm: { x: 0, y: 0, z: 0 },
    leftLowerArm: { x: 0, y: 0, z: 0 },
    rightUpperArm: { x: 0, y: 0, z: 0 },
    rightLowerArm: { x: 0, y: 0, z: 0 },
    leftUpperLeg: { x: 0, y: 0, z: 0 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: 0, y: 0, z: 0 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 0, y: 0, z: 0 },
    body: { x: 0, y: 0, z: 0 },
  },
  walking: {
    leftUpperArm: { x: -20, y: 0, z: 0 },
    leftLowerArm: { x: -15, y: 0, z: 0 },
    rightUpperArm: { x: 20, y: 0, z: 0 },
    rightLowerArm: { x: 15, y: 0, z: 0 },
    leftUpperLeg: { x: 25, y: 0, z: 0 },
    leftLowerLeg: { x: -20, y: 0, z: 0 },
    rightUpperLeg: { x: -25, y: 0, z: 0 },
    rightLowerLeg: { x: 20, y: 0, z: 0 },
    head: { x: 0, y: 0, z: 0 },
    body: { x: 0, y: 0, z: 0 },
  },
  waving: {
    leftUpperArm: { x: 0, y: 0, z: 0 },
    leftLowerArm: { x: 0, y: 0, z: 0 },
    rightUpperArm: { x: -80, y: 0, z: 30 },
    rightLowerArm: { x: -45, y: 0, z: 15 },
    leftUpperLeg: { x: 0, y: 0, z: 0 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: 0, y: 0, z: 0 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 0, y: 15, z: 0 },
    body: { x: 0, y: 0, z: 0 },
  },
  sitting: {
    leftUpperArm: { x: 0, y: 0, z: 0 },
    leftLowerArm: { x: -30, y: 0, z: 0 },
    rightUpperArm: { x: 0, y: 0, z: 0 },
    rightLowerArm: { x: -30, y: 0, z: 0 },
    leftUpperLeg: { x: 90, y: 0, z: 0 },
    leftLowerLeg: { x: -90, y: 0, z: 0 },
    rightUpperLeg: { x: 90, y: 0, z: 0 },
    rightLowerLeg: { x: -90, y: 0, z: 0 },
    head: { x: 0, y: 0, z: 0 },
    body: { x: 0, y: 0, z: 0 },
  },
  running: {
    leftUpperArm: { x: -45, y: 0, z: 0 },
    leftLowerArm: { x: -60, y: 0, z: 0 },
    rightUpperArm: { x: 45, y: 0, z: 0 },
    rightLowerArm: { x: 60, y: 0, z: 0 },
    leftUpperLeg: { x: 45, y: 0, z: 0 },
    leftLowerLeg: { x: -45, y: 0, z: 0 },
    rightUpperLeg: { x: -45, y: 0, z: 0 },
    rightLowerLeg: { x: 45, y: 0, z: 0 },
    head: { x: 5, y: 0, z: 0 },
    body: { x: 5, y: 0, z: 0 },
  },
  combat: {
    leftUpperArm: { x: -45, y: 30, z: 0 },
    leftLowerArm: { x: -90, y: 0, z: 0 },
    rightUpperArm: { x: -30, y: -45, z: 15 },
    rightLowerArm: { x: -60, y: 0, z: 0 },
    leftUpperLeg: { x: 15, y: 0, z: 0 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: -15, y: 0, z: 0 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 0, y: -15, z: 0 },
    body: { x: 0, y: -10, z: 0 },
  },
};

export const CharacterViewer = ({ skinImage, onNewSkin }: CharacterViewerProps) => {
  const [currentPose, setCurrentPose] = useState(PRESET_POSES.standing);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESET_POSES>("standing");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [renderDialogOpen, setRenderDialogOpen] = useState(false);
  const [lights, setLights] = useState<Light[]>([
    {
      id: "light-1",
      type: "directional",
      position: [10, 10, 5],
      color: "#ffffff",
      intensity: 1.2,
    },
    {
      id: "light-2",
      type: "directional",
      position: [-10, 5, -5],
      color: "#ffffff",
      intensity: 0.3,
    },
  ]);

  const handlePoseChange = (bodyPart: keyof typeof currentPose, axis: 'x' | 'y' | 'z', value: number) => {
    setCurrentPose(prev => ({
      ...prev,
      [bodyPart]: {
        ...prev[bodyPart],
        [axis]: value
      }
    }));
    setSelectedPreset("standing"); // Reset preset selection when manually adjusting
  };

  const handlePresetChange = (preset: keyof typeof PRESET_POSES) => {
    setCurrentPose(PRESET_POSES[preset]);
    setSelectedPreset(preset);
  };

  const resetPose = () => {
    setCurrentPose(PRESET_POSES.standing);
    setSelectedPreset("standing");
    toast("Pose reset to standing position");
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error("Canvas not found");
      return;
    }

    const link = document.createElement('a');
    link.download = 'minecraft-character-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success("Screenshot saved!");
  };

  const handleHighQualityRender = async (
    settings: RenderSettings,
    onProgress: (progress: number) => void
  ) => {
    if (!scene || !camera) {
      toast.error("Scene not ready");
      throw new Error("Scene not ready");
    }

    try {
      const result = await createHighQualityRender(scene, camera, settings, onProgress);
      return result;
    } catch (error) {
      console.error("Render error:", error);
      toast.error("Failed to create high quality render");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* 3D Viewer */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center shadow-glow">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Character Viewer</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={onNewSkin}
              >
                <Upload className="w-4 h-4" />
                New Skin
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={takeScreenshot}
              >
                <Camera className="w-4 h-4" />
                Screenshot
              </Button>
              <Button
                className="flex items-center gap-2 bg-gradient-gaming hover:shadow-glow transition-smooth"
                onClick={() => setRenderDialogOpen(true)}
              >
                <Download className="w-4 h-4" />
                HQ Render
              </Button>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 2, 8], fov: 45 }}
          className="w-full h-full"
          gl={{ 
            preserveDrawingBuffer: true, 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
          }}
          onCreated={({ scene: threeScene, camera: threeCamera }) => {
            setScene(threeScene);
            setCamera(threeCamera);
          }}
        >
          {/* eslint-disable-next-line */}
          <ambientLight intensity={0.4} />
          <LightRenderer lights={lights} />
          
          <MinecraftCharacter skinImage={skinImage} pose={currentPose} />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            target={[0, 0, 0]}
            enableDamping={true}
            dampingFactor={0.05}
          />
          
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Lighting Controls */}
          <LightingControls lights={lights} onLightsChange={setLights} />
          {/* Preset Poses */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Preset Poses</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PRESET_POSES).map((preset) => (
                <Button
                  key={preset}
                  variant={selectedPreset === preset ? "default" : "secondary"}
                  className="capitalize text-xs h-8"
                  size="sm"
                  onClick={() => handlePresetChange(preset as keyof typeof PRESET_POSES)}
                >
                  {preset}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-3 flex items-center gap-2"
              size="sm"
              onClick={resetPose}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Pose
            </Button>
          </Card>

          {/* Pose Controls */}
          <PoseControls
            pose={currentPose}
            onPoseChange={handlePoseChange}
          />
        </div>
      </div>

      <RenderDialog
        open={renderDialogOpen}
        onOpenChange={setRenderDialogOpen}
        onRender={handleHighQualityRender}
      />
    </div>
  );
};