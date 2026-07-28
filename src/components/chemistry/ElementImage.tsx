import { useEffect, useMemo, useRef, useState } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import silveryMetalSample from "@/assets/silvery-metal-sample.jpg";
import { getElementImage, type ImageKind } from "@/lib/elementImages";

interface ElementImageProps {
  atomicNumber: number;
  name?: string;
  className?: string;
}

const KIND_LABEL: Record<ImageKind, string> = {
  "real-photo": "Real photograph",
  "silvery-placeholder": "Reference sample",
  "conceptual": "Conceptual visual",
};

const KIND_VARIANT: Record<ImageKind, "default" | "secondary" | "outline"> = {
  "real-photo": "default",
  "silvery-placeholder": "secondary",
  "conceptual": "outline",
};

export function ElementImage({ atomicNumber, name, className }: ElementImageProps) {
  const info = useMemo(() => getElementImage(atomicNumber), [atomicNumber]);
  const [src, setSrc] = useState(info.primary);
  const [missing, setMissing] = useState(false);
  const fallbackIndex = useRef(0);

  useEffect(() => {
    setSrc(info.primary);
    setMissing(false);
    fallbackIndex.current = 0;
  }, [atomicNumber, info.primary]);

  const displayName = name ?? info.name;

  return (
    <div className={className}>
      <div className="mx-auto w-full max-w-[240px] aspect-square rounded-lg overflow-hidden border border-border bg-muted/30 flex items-center justify-center relative">
        <img
          key={`${atomicNumber}-${src}`}
          src={src}
          alt={`Appearance of ${displayName}`}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 240px"
          width={240}
          height={240}
          className="w-full h-full object-cover"
          onError={() => {
            const next = info.fallbacks[fallbackIndex.current];
            if (next) {
              fallbackIndex.current += 1;
              setSrc(next);
              return;
            }
            if (src !== silveryMetalSample) {
              setSrc(silveryMetalSample);
              setMissing(true);
            }
          }}
        />

        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={KIND_VARIANT[info.kind]}
                  className="text-[10px] px-1.5 py-0 h-5 cursor-help backdrop-blur-sm bg-background/80"
                >
                  <Info className="h-3 w-3 mr-1" aria-hidden />
                  {KIND_LABEL[info.kind]}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px] text-xs">
                {info.note}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {missing && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
              Fallback used
            </Badge>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        {info.kind === "real-photo"
          ? `Appearance of ${displayName} at room temperature`
          : `${KIND_LABEL[info.kind]} for ${displayName}`}
      </p>
    </div>
  );
}
