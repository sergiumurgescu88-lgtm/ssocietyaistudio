import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SpeakerNameInputProps {
  label: string;
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
  onReset: () => void;
  error?: string;
}

const SPEAKER_NAME_REGEX = /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]*$/;

export default function SpeakerNameInput({ label, value, defaultValue, onChange, onReset, error }: SpeakerNameInputProps) {
  const handleChange = (val: string) => {
    if (SPEAKER_NAME_REGEX.test(val) && val.length <= 20) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground block">{label} *</label>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-muted border-border"
          placeholder={defaultValue}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onReset}
          title={`Reset to ${defaultValue}`}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Default: {defaultValue}</p>
        <p className="text-xs text-muted-foreground">{value.length}/20</p>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
