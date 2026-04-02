import React from "react";
import { Check, AlertCircle, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Step, StepStatus } from "@/types";

interface StepBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

const StatusIcon = ({ status }: { status: StepStatus }) => {
  switch (status) {
    case "completed":
      return <Check className="w-4 h-4 text-success" />;
    case "error":
      return <AlertCircle className="w-4 h-4 text-error" />;
    case "in-progress":
      return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    case "pending-confirmation":
      return <Clock className="w-4 h-4 text-warning" />;
    default:
      return null;
  }
};

export const StepBar: React.FC<StepBarProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = step.status === "completed";
          const isError = step.status === "error";
          const isPending = step.status === "pending-confirmation";
          const isNotStarted = step.status === "not-started";

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "flex items-center gap-3 cursor-pointer transition-all group relative",
                  isActive ? "opacity-100 scale-105" : "opacity-40 hover:opacity-70",
                  !isCompleted && !isActive && "cursor-not-allowed"
                )}
                onClick={() => (isCompleted || isActive) && onStepClick(step.id)}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                    isActive && "border-brand bg-brand text-white shadow-xl shadow-brand/20",
                    isCompleted && "border-emerald-100 bg-emerald-50 text-emerald-500",
                    isError && "border-rose-100 bg-rose-50 text-rose-500",
                    isPending && "border-amber-100 bg-amber-50 text-amber-500",
                    isNotStarted && "border-slate-100 bg-slate-50 text-slate-300"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : isError ? (
                    <AlertCircle className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <span className="text-sm font-black">{step.id}</span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-[12px] font-black uppercase tracking-wider transition-colors",
                      isActive ? "text-slate-900" : "text-slate-400"
                    )}
                  >
                    {step.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-md",
                      isActive && "bg-brand text-white",
                      isCompleted && "bg-emerald-100 text-emerald-600",
                      isError && "bg-rose-100 text-rose-600",
                      isPending && "bg-amber-100 text-amber-600",
                      isNotStarted && "bg-slate-100 text-slate-400"
                    )}>
                      {step.status === "not-started" ? "未开始" : 
                       step.status === "in-progress" ? "进行中" : 
                       step.status === "completed" ? "已完成" : 
                       step.status === "error" ? "错误" : "待确认"}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <motion.div 
                    layoutId="active-step-indicator"
                    className="absolute -bottom-6 left-0 right-0 h-1.5 bg-brand rounded-full shadow-[0_4px_12px_rgba(var(--brand-rgb),0.3)]"
                  />
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-slate-100 relative min-w-[20px]">
                  <div
                    className={cn(
                      "absolute inset-0 bg-brand/20 transition-all duration-700",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
