import React from "react";
import { cn } from "@/lib/utils";
import { StepStatus } from "@/types";

interface StatusBadgeProps {
  status: StepStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "in-progress":
      case "processing":
      case "running":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
      case "success":
      case "passed":
        return "bg-success/10 text-success border-success/20";
      case "pending-confirmation":
      case "pending":
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "error":
      case "failed":
      case "failed-to-parse":
        return "bg-error/10 text-error border-error/20";
      case "not-started":
      case "disabled":
      case "skipped":
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "in-progress": return "进行中";
      case "completed": return "已完成";
      case "pending-confirmation": return "待确认";
      case "error": return "异常";
      case "not-started": return "未开始";
      case "success": return "成功";
      case "failed": return "失败";
      case "skipped": return "跳过";
      default: return status;
    }
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
        getStatusStyles(),
        className
      )}
    >
      {getStatusLabel()}
    </span>
  );
};
