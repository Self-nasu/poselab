import { useState } from "react";
import { SkinUpload } from "./components/SkinUpload";
import { CharacterViewer } from "@/views/users/LabUtils/CharacterViewer";

const Index = () => {
  const viewMode = "skin";
  const [skinData, setSkinData] = useState<{
    file: File;
    image: HTMLImageElement;
  } | null>(null);

  const handleSkinUpload = (file: File, image: HTMLImageElement) => {
    setSkinData({ file, image });
  };

  const handleNewSkin = () => {
    setSkinData(null);
  };

  if (viewMode === "skin") {
    return (
      <div className="min-h-screen">
        {!skinData ? (
          <SkinUpload onSkinUpload={handleSkinUpload} />
        ) : (
          <CharacterViewer
            skinImage={skinData.image}
            onNewSkin={handleNewSkin}
          />
        )}
      </div>
    );
  }

  return null;
};

export default Index;