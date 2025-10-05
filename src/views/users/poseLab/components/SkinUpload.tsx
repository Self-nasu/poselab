import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

interface SkinUploadProps {
  onSkinUpload: (skinFile: File, skinImage: HTMLImageElement) => void;
}

export const SkinUpload = ({ onSkinUpload }: SkinUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedSkin, setUploadedSkin] = useState<{
    file: File;
    image: HTMLImageElement;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateSkinFile = (file: File): boolean => {
    if (!file.type.includes("png")) {
      alert("Please upload a PNG file");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return false;
    }
    return true;
  };

  const loadSkinImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 64 || img.height !== 64) {
          reject(new Error("Skin must be 64x64 pixels"));
          return;
        }
        resolve(img);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!validateSkinFile(file)) return;

    try {
      const skinImage = await loadSkinImage(file);
      const preview = URL.createObjectURL(file);
      
      setUploadedSkin({ file, image: skinImage, preview });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load skin");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleLoadCharacter = () => {
    if (uploadedSkin) {
      onSkinUpload(uploadedSkin.file, uploadedSkin.image);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-4">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-gaming rounded-lg flex items-center justify-center mx-auto mb-4 shadow-glow">
            <ImageIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Minecraft Skin Viewer
          </h1>
          <p className="text-muted-foreground">
            Upload your 64x64 Minecraft skin PNG to view it in 3D
          </p>
        </div>

        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer
            ${isDragOver 
              ? "border-primary bg-primary/5 shadow-glow" 
              : "border-border hover:border-primary/50 hover:bg-primary/5"
            }
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadedSkin ? (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto border border-border rounded-lg overflow-hidden bg-card">
                <img
                  src={uploadedSkin.preview}
                  alt="Uploaded skin"
                  className="w-full h-full object-contain pixel-art"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{uploadedSkin.file.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                64x64 PNG • Ready to load
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-foreground font-medium mb-1">
                  Drop your skin here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG files only • 64x64 pixels
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".png"
          className="hidden"
          onChange={handleFileSelect}
        />

        {uploadedSkin && (
          <Button
          className="w-full mt-6 bg-gradient-gaming hover:shadow-glow transition-smooth"
          size="lg"
          onClick={handleLoadCharacter}
          >
            Load Character
          </Button>
        )}
      </Card>
    </div>
  );
};