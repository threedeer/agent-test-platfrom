import React, { useState } from "react";
import { Terminal, Activity, BarChart3, AlertTriangle, List, Filter, Copy, ChevronDown, ChevronUp, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogEntry, StepStatus } from "@/types";

interface AgentMonitorProps {
  taskId: string;
  currentStep: number;
  currentSubtask: string;
  currentAction: string;
  duration: string;
  metrics: {
    apis: number;
    cases: number;
    executed: number;
    success: number;
    failed: number;
    reports: number;
  };
  risks: { id: string; message: string; type: "error" | "warning" }[];
  logs: LogEntry[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogClick?: (testCaseId: string) => void;
}

export const AgentMonitor: React.FC<AgentMonitorProps> = ({
  taskId,
  currentStep,
  currentSubtask,
  currentAction,
  duration,
  metrics,
  risks,
  logs,
  isCollapsed,
  onToggleCollapse,
  onLogClick,
}) => {
  const [filter, setFilter] = useState<"all" | "info" | "warning" | "error">("all");

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "info") return log.level === "info" || log.level === "success";
    return log.level === filter;
  });

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.level.toUpperCase()}: ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className={cn(
        "fixed right-6 top-20 bottom-6 bg-white/80 backdrop-blur-2xl border border-black/[0.05] shadow-2xl rounded-3xl flex flex-col transition-all duration-500 z-40 overflow-hidden",
        isCollapsed ? "w-14" : "w-[300px]"
      )}
    >
      {/* 顶部状态条 */}
      <div className="p-4 bg-white/40 border-b border-black/[0.03] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,199,89,0.5)]" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
            </div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">实时监控</h3>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-black/[0.03] rounded-lg transition-colors text-slate-400 hover:text-slate-600"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 -rotate-90" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* A. 顶部摘要 (Summary) (Task 6) */}
          <section className="p-6 border-b border-black/[0.03] bg-slate-50/30 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">当前状态</span>
                <span className={cn(
                  "text-xs font-black flex items-center gap-1.5",
                  currentStep === 3 && metrics.failed > 0 ? "text-rose-600" : "text-emerald-600"
                )}>
                  <Activity className="w-3 h-3" />
                  {currentStep === 3 && metrics.failed > 0 ? "检测到异常" : "正在执行任务"}
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">运行时长</span>
                <span className="text-xs font-mono font-bold text-slate-600">{duration}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-2xl border border-black/[0.02] shadow-sm">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  {currentStep === 3 ? "已执行 / 总数" : "当前步骤"}
                </span>
                <span className="text-xs font-black text-slate-700">
                  {currentStep === 3 ? `${metrics.executed} / ${metrics.cases}` : `${currentStep} / 5`}
                </span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-black/[0.02] shadow-sm">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  {currentStep === 3 ? "成功率" : "已生成用例"}
                </span>
                <span className={cn(
                  "text-xs font-black",
                  currentStep === 3 && metrics.failed > 0 ? "text-rose-600" : "text-slate-700"
                )}>
                  {currentStep === 3 ? `${metrics.executed > 0 ? Math.round((metrics.success / metrics.executed) * 100) : 0}%` : `${metrics.cases} 条`}
                </span>
              </div>
            </div>

            {currentStep === 3 && metrics.failed > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">异常用例</span>
                </div>
                <span className="text-xs font-black text-rose-600">{metrics.failed} 条</span>
              </div>
            )}

            {risks.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">检测到异常</span>
                  <span className="text-[10px] text-rose-700 font-bold leading-tight">{risks[0].message}</span>
                </div>
              </div>
            )}
          </section>

          {/* B. 下方日志流 (Log Stream) (Task 6 & 10) */}
          <section className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.03] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">执行日志</span>
              </div>
              <div className="flex items-center gap-1">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-[9px] font-black text-slate-400 bg-transparent focus:outline-none uppercase tracking-widest cursor-pointer hover:text-slate-600"
                >
                  <option value="all">全部日志</option>
                  <option value="info">仅关键</option>
                  <option value="error">仅错误</option>
                </select>
                <button
                  onClick={copyLogs}
                  className="p-1 hover:bg-black/[0.03] rounded-lg text-slate-400 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-5 font-mono">
              {filteredLogs.slice(0, 30).map((log) => (
                <div 
                  key={log.id} 
                  className={cn(
                    "flex gap-3 group transition-all",
                    log.testCaseId && "cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg"
                  )}
                  onClick={() => log.testCaseId && onLogClick?.(log.testCaseId)}
                >
                  <span className="text-[9px] text-slate-300 shrink-0 mt-1">{log.timestamp.split(' ')[1] || log.timestamp}</span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        log.level === "info" && "bg-slate-300",
                        log.level === "warning" && "bg-amber-400",
                        log.level === "error" && "bg-rose-500",
                        log.level === "success" && "bg-emerald-500"
                      )} />
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-tighter",
                        log.level === "info" && "text-slate-400",
                        log.level === "warning" && "text-amber-600",
                        log.level === "error" && "text-rose-600",
                        log.level === "success" && "text-emerald-600"
                      )}>
                        {log.level === "info" ? "INFO" : log.level === "warning" ? "WARN" : log.level === "error" ? "ERROR" : "SUCCESS"}
                      </span>
                    </div>
                    <p className={cn(
                      "text-[10px] leading-relaxed transition-colors",
                      log.level === "error" ? "text-rose-700 font-bold" : "text-slate-500 group-hover:text-slate-800"
                    )}>
                      {log.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
