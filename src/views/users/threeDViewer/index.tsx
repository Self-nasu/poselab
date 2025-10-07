import { useState, useEffect } from "react";
import { ModelUpload } from "./components/ModelUpload";
import { ModelViewer } from "@/views/users/LabUtils/ModelViewer";

const Index = () => {
  const [modelData, setModelData] = useState<{ file?: File; url: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load default model automatically
  useEffect(() => {
    const loadDefaultModel = async () => {
      // Example: load a default GLB model
      const defaultUrl = "/models/default-model.glb";
      setModelData({ url: defaultUrl });
    };
    loadDefaultModel();
  }, []);

  const handleModelUpload = (file: File, url: string) => {
    setModelData({ file, url });
    setIsModalOpen(false);
  };

  if (!modelData) return null;

  return (
    <div className="relative h-[92.2vh] w-full flex flex-col items-center justify-center">
      {/* Model Viewer */}
      <ModelViewer
        modelUrl={modelData.url}
        onChangeModelClick={() => setIsModalOpen(true)}
      />

      {/* Modal for Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-2xl mx-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
              Upload New Model
            </h2>

            <ModelUpload onModelUpload={handleModelUpload} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
