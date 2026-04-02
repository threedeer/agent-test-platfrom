import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Search, Filter, Trash2, Download, Play, Pause, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { LogEntry } from "@/types";
import { cn } from "@/lib/utils";

interface LogsViewProps {
  logs: LogEntry[];
  onClear: () => void;
  onDownload: () => void;
}

export const LogsView: React.FC<LogsViewProps> = ({ logs, onClear, onDownload }) => {
  const [filter, setFilter] = useState<LogEntry["level"] | "all">("all");
  const [search, setSearch] = useState("");
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === "all" || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || 
                         log.timestamp.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">日志系统</h2>
          <p className="text-sm text-slate-500 mt-1">实时监控测试执行过程中的详细系统日志</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="搜索日志内容..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all w-64"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all outline-none"
          >
            <option value="all">全部级别</option>
            <option value="info">信息 (Info)</option>
            <option value="success">成功 (Success)</option>
            <option value="warning">警告 (Warning)</option>
            <option value="error">错误 (Error)</option>
          </select>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button 
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={cn(
              "p-2 rounded-xl transition-all",
              isAutoScroll ? "bg-accent/10 text-accent" : "bg-slate-100 text-slate-400"
            )}
            title={isAutoScroll ? "停止自动滚动" : "开启自动滚动"}
          >
            {isAutoScroll ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
          </button>
          <button 
            onClick={onDownload}
            className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
            title="导出日志"
          >
            <Download className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={onClear}
            className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
            title="清空日志"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-slate-900/20 border border-slate-800">
        <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Terminal Output</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Lines: {filteredLogs.length}</span>
            <span>Status: Connected</span>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-auto p-6 font-mono text-sm custom-scrollbar"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
              <Terminal className="w-12 h-12 mb-4" />
              <p>等待日志输出...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex gap-4 group">
                  <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={cn(
                    "shrink-0 font-bold uppercase w-16",
                    log.level === "info" ? "text-blue-400" :
                    log.level === "success" ? "text-emerald-400" :
                    log.level === "warning" ? "text-amber-400" :
                    log.level === "error" ? "text-rose-400" : "text-slate-400"
                  )}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 break-all group-hover:text-white transition-colors">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
