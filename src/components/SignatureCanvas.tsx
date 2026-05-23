"use client";

import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";
import { Button } from "@/components/ui/button";

export function SignatureCanvas({ onEnd }: { onEnd: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      padRef.current = new SignaturePad(canvasRef.current, {
        penColor: "black",
        backgroundColor: "white",
      });
      padRef.current.addEventListener("endStroke", () => {
        if (padRef.current && !padRef.current.isEmpty()) {
          onEnd(padRef.current.toDataURL());
        }
      });
    }
    return () => padRef.current?.off();
  }, [onEnd]);

  const clear = () => {
    padRef.current?.clear();
    onEnd("");
  };

  return (
    <div className="space-y-2">
      <div className="border border-[var(--color-border-strong)] rounded-md overflow-hidden bg-white touch-none">
        <canvas ref={canvasRef} className="w-full h-40" width={400} height={160} />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={clear}>Borrar firma</Button>
    </div>
  );
}