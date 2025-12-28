import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Pose } from "./posePresets";

interface PoseControlsProps {
    pose: Pose;
    onPoseChange: (
        bodyPart: keyof Pose["poseConfig"],
        axis: "x" | "y" | "z" | "bendAngle",
        value: number
    ) => void;
}

export const PoseControls = ({ pose, onPoseChange }: PoseControlsProps) => {
    const bodyParts = [
        { key: "head" as const, label: "Head", color: "text-yellow-400" },
        { key: "body" as const, label: "Body", color: "text-orange-400" },
        { key: "leftUpperArm" as const, label: "Left Arm", color: "text-blue-400", supportsBend: true },
        { key: "rightUpperArm" as const, label: "Right Arm", color: "text-purple-400", supportsBend: true },
        { key: "leftUpperLeg" as const, label: "Left Leg", color: "text-green-400", supportsBend: true },
        { key: "rightUpperLeg" as const, label: "Right Leg", color: "text-indigo-400", supportsBend: true },
    ];

    const axes = [
        { key: "x" as const, label: "X (Pitch)", color: "text-red-400" },
        { key: "y" as const, label: "Y (Yaw)", color: "text-green-400" },
        { key: "z" as const, label: "Z (Roll)", color: "text-blue-400" },
    ];

    return (
        <div>
            <h4 className="font-semibold text-foreground mb-4">
                Manual Controls <span className="text-primary text-xs">(Bendable)</span>
            </h4>

            {/* --- BODY CONTROLS --- */}
            <div className="space-y-4 overflow-y-auto">
                {bodyParts.map((bodyPart) => (
                    <div
                        key={bodyPart.key}
                        className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50"
                    >
                        <h4 className={`text-sm font-medium ${bodyPart.color}`}>{bodyPart.label}</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {axes.map((axis) => (
                                <div key={axis.key} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Label className={`text-xs ${axis.color} font-medium`}>
                                            {axis.key.toUpperCase()}
                                        </Label>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {pose.poseConfig[bodyPart.key][axis.key]}°
                                        </span>
                                    </div>
                                    <Slider
                                        value={[pose.poseConfig[bodyPart.key][axis.key]]}
                                        onValueChange={([value]) =>
                                            onPoseChange(bodyPart.key, axis.key, value)
                                        }
                                        min={-180}
                                        max={180}
                                        step={5}
                                        className="w-full h-2"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Bend Angle Control for Bendable Model */}
                        {bodyPart.supportsBend && (
                            <div className="mt-2 pt-2 border-t border-border/30">
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="text-xs text-amber-400 font-medium">
                                        BEND
                                    </Label>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {pose.poseConfig[bodyPart.key].bendAngle || 0}°
                                    </span>
                                </div>
                                <Slider
                                    value={[pose.poseConfig[bodyPart.key].bendAngle || 0]}
                                    onValueChange={([value]) =>
                                        onPoseChange(bodyPart.key, "bendAngle", value)
                                    }
                                    min={0}
                                    max={120}
                                    step={5}
                                    className="w-full h-2"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- FACIAL CONTROLS (Optional) --- */}
            {pose.facial && (
                <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-foreground mb-2">Facial Controls</h4>

                    {pose.facial.eyes && (
                        <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50">
                            <h4 className="text-sm font-medium text-blue-400">Eyes</h4>
                            <Label className="text-xs text-muted-foreground">Blink</Label>
                            <Slider
                                value={[pose.facial.eyes.blink]}
                                min={0}
                                max={1}
                                step={0.05}
                                className="w-full h-2"
                            />
                        </div>
                    )}

                    {pose.facial.mouth && (
                        <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50">
                            <h4 className="text-sm font-medium text-pink-400">Mouth</h4>
                            <Label className="text-xs text-muted-foreground">Smile</Label>
                            <Slider
                                value={[pose.facial.mouth.smile]}
                                min={0}
                                max={1}
                                step={0.05}
                                className="w-full h-2"
                            />
                            <Label className="text-xs text-muted-foreground">Open</Label>
                            <Slider
                                value={[pose.facial.mouth.open]}
                                min={0}
                                max={1}
                                step={0.05}
                                className="w-full h-2"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
