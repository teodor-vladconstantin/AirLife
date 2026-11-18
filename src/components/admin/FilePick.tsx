"use client";
import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Branded file button: the browser's default "Choose file" input stays hidden.
export const FilePick = ({ label, multiple, disabled, onChange }: { label: string; multiple?: boolean; disabled?: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => { onChange(e); e.target.value = ""; }} />
      <Button type="button" variant="outline" disabled={disabled} onClick={() => ref.current?.click()}>
        <ImagePlus className="w-4 h-4 mr-2 text-primary" />{label}
      </Button>
    </>
  );
};
