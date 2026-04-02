import React from "react";
import { ChevronLeft, Save, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionFooterProps {
  onNext: () => void;
  nextLabel: string;
  isNextLoading?: boolean;
  isNextDisabled?: boolean;
  isAutoExecuting?: boolean;
  className?: string;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  onNext,
  nextLabel,
  isNextLoading = false,
  isNextDisabled = false,
  isAutoExecuting = false,
  className,
}) => {
  if (!nextLabel) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-8 py-4 flex items-center justify-end shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-50",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onNext}
          disabled={isNextDisabled || isNextLoading || isAutoExecuting}
          className={cn(
            "btn-primary flex items-center gap-2 min-w-[200px] justify-center py-3",
            (isNextDisabled || isAutoExecuting) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isNextLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="uppercase tracking-wide text-xs">{nextLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
