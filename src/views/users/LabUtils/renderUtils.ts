import * as THREE from "three";
import { RenderSettings } from "./RenderDialog";

export const createHighQualityRender = async (
  scene: THREE.Scene,
  camera: THREE.Camera,
  settings: RenderSettings,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; previewUrl: string }> => {
  const { width, height, transparentBackground, quality } = settings;

  onProgress?.(10);

  // Clone camera to avoid affecting the main view
  const renderCamera = camera.clone();
  
  // Update camera aspect ratio to match render dimensions
  if (renderCamera instanceof THREE.PerspectiveCamera) {
    renderCamera.aspect = width / height;
    renderCamera.updateProjectionMatrix();
  }

  onProgress?.(20);

  // Create offscreen renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: transparentBackground,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(quality);

  onProgress?.(40);

  // Store original background
  const originalBackground = scene.background;

  if (transparentBackground) {
    scene.background = null;
    renderer.setClearColor(0x000000, 0);
  }

  onProgress?.(60);

  // Render the scene
  renderer.render(scene, renderCamera);

  onProgress?.(80);

  // Get the canvas data
  const canvas = renderer.domElement;
  const previewUrl = canvas.toDataURL("image/png", 1.0);

  onProgress?.(90);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      "image/png",
      1.0
    );
  });

  // Restore original background
  scene.background = originalBackground;

  // Cleanup
  renderer.dispose();

  onProgress?.(100);

  return { blob, previewUrl };
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};