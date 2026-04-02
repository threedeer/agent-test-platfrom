import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, Play, Pause, RefreshCw, CheckCircle2, XCircle, SkipForward, 
  Clock, Activity, List, Search, Terminal, AlertTriangle, ChevronDown, 
  ChevronUp, Loader2, ChevronRight, LayoutDashboard, BarChart3, Zap, 
  RotateCcw, FileDown, Eye, MoreHorizontal, ExternalLink, AlertOctagon,
  Filter, ArrowUpDown, Download, Info, Edit3, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TestCase, ExecutionResult, StepStatus } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";

interface ExecuteStepProps {
  testCases: TestCase[];
  executionResults: ExecutionResult[];
  onExecute: (ids?: string[]) => Promise<void>;
  onStop: () => void;
  isExecuting: boolean;
  config: {
    baseUrl: string;
    headers: Record<string, string>;
    auth: string;
    timeout: number;
    retries: number;
  };
  onConfigChange: (field: string, value: any) => void;
  highlightedCaseId?: string | null;
}

export const ExecuteStep: React.FC<ExecuteStepProps> = ({
  testCases,
  executionResults,
  onExecute,
  onStop,
  isExecuting,
  config,
  onConfigChange,
  highlightedCaseId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [onlyFailed, setOnlyFailed] = useState(false);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(true);

  useEffect(() => {
    if (highlightedCaseId) {
      setExpandedCaseId(highlightedCaseId);
      const element = document.getElementById(`case-${highlightedCaseId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedCaseId]);

  useEffect(() => {
    if (executionResults.length === 0 && !isExecuting) {
      onExecute();
    }
  }, []);

  const stats = useMemo(() => {
    const total = testCases.length;
    const executed = executionResults.length;
    const success = executionResults.filter((r) => r.status === "success").length;
    const failed = executionResults.filter((r) => r.status === "failed").length;
    const skipped = executionResults.filter((r) => r.status === "skipped").length;
    const progress = (executed / total) * 100 || 0;
    const successRate = executed > 0 ? Math.round((success / executed) * 100) : 0;
    const avgDuration = executed > 0 
      ? Math.round(executionResults.reduce((acc, r) => acc + (r.duration || 0), 0) / executed) 
      : 0;

    let status: "未开始" | "执行中" | "已完成" | "部分失败" | "已终止" = "未开始";
    if (isExecuting) status = "执行中";
    else if (executed === 0) status = "未开始";
    else if (failed > 0) status = "部分失败";
    else if (executed === total) status = "已完成";

    return { total, executed, success, failed, skipped, progress, successRate, avgDuration, status };
  }, [testCases, executionResults, isExecuting]);

  const filteredCases = useMemo(() => {
    return testCases.filter(tc => {
      const res = executionResults.find(r => r.testCaseId === tc.id);
      const matchesSearch = tc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tc.path.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = onlyFailed ? res?.status === "failed" : (
        statusFilter === "all" || 
        (statusFilter === "success" && res?.status === "success") ||
        (statusFilter === "failed" && res?.status === "failed") ||
        (statusFilter === "pending" && !res)
      );
      const matchesPriority = priorityFilter === "all" || tc.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [testCases, executionResults, searchQuery, statusFilter, priorityFilter, onlyFailed]);

  const handleRetryFailed = () => {
    const failedIds = executionResults
      .filter(r => r.status === "failed")
      .map(r => r.testCaseId);
    if (failedIds.length > 0) {
      onExecute(failedIds);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-auto">
      {/* 1. 统一执行控制头部 (Task 1 & 2) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500",
                isExecuting ? "bg-brand/10 text-brand animate-pulse" : 
                stats.status === "已完成" ? "bg-emerald-50 text-emerald-600" :
                stats.status === "部分失败" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400"
              )}>
                {isExecuting ? <Activity className="w-6 h-6" /> : 
                 stats.status === "已完成" ? <CheckCircle2 className="w-6 h-6" /> :
                 stats.status === "部分失败" ? <AlertTriangle className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-widest">执行测试</h2>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    isExecuting ? "bg-brand/10 text-brand" : 
                    stats.status === "已完成" ? "bg-emerald-100 text-emerald-700" :
                    stats.status === "部分失败" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {stats.status}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                  {isExecuting ? "正在执行自动化测试用例..." : `共 ${stats.total} 条用例，已执行 ${stats.executed} 条`}
                </p>
              </div>
            </div>
          </div>

          <div className="h-12 w-px bg-slate-100" />

          <div className="flex flex-col gap-2 w-72">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">总体进度</span>
              <span className="text-[10px] font-black text-slate-900 tabular-nums">{stats.executed} / {stats.total}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                className={cn(
                  "h-full transition-all duration-500",
                  stats.failed > 0 ? "bg-rose-500" : "bg-brand"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {stats.failed > 0 && !isExecuting && (
            <button
              onClick={handleRetryFailed}
              className="px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              仅重试失败项
            </button>
          )}
          
          {isExecuting ? (
            <button
              onClick={onStop}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
            >
              <Pause className="w-4 h-4 fill-current" />
              停止执行
            </button>
          ) : (
            <button
              onClick={() => onExecute()}
              className="px-6 py-3 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-brand/20"
            >
              <Play className="w-4 h-4 fill-current" />
              {stats.executed > 0 ? "重新运行" : "运行全部测试"}
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI 仪表盘 (Task 1 & 2) */}
      <div className="grid grid-cols-12 gap-6 shrink-0">
        <div className="col-span-9 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm grid grid-cols-5 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">总用例数</span>
            <span className="text-3xl font-black text-slate-900 tabular-nums">{stats.total}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">通过数</span>
            <span className="text-3xl font-black text-emerald-600 tabular-nums">{stats.success}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">失败数</span>
            <span className="text-3xl font-black text-rose-600 tabular-nums">{stats.failed}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-brand uppercase tracking-widest">成功率</span>
            <span className="text-3xl font-black text-brand tabular-nums">{stats.successRate}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">平均耗时</span>
            <span className="text-3xl font-black text-slate-900 tabular-nums">{stats.avgDuration}ms</span>
          </div>
        </div>

        {/* 引导文案 (Task 9) */}
        <AnimatePresence>
          {stats.failed > 0 && !isExecuting && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-3 bg-rose-50 border border-rose-100 rounded-3xl p-5 flex items-start gap-4"
            >
              <AlertOctagon className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">下一步建议</span>
                <p className="text-[12px] font-bold text-rose-500 leading-relaxed">
                  当前有 {stats.failed} 条用例执行失败，建议先查看失败详情或重试失败项后再生成报告。
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Environment Card */}
        <div className="col-span-3 bg-slate-900 rounded-3xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">当前执行环境</span>
            </div>
            <button 
              onClick={() => setIsConfigCollapsed(!isConfigCollapsed)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white truncate max-w-[200px]">{config.baseUrl}</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[8px] font-black uppercase tracking-tighter">已激活</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-400">{config.timeout}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-400">{config.retries}次重试</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 增强工作台表格 */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[400px] h-auto max-h-[800px]">
        {/* 表格工具栏 (Task 3) */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索用例名称或路径..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand w-64 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none"
              >
                <option value="all">所有状态</option>
                <option value="success">成功</option>
                <option value="failed">失败</option>
                <option value="pending">未执行</option>
              </select>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none"
              >
                <option value="all">所有优先级</option>
                <option value="P0">P0 核心</option>
                <option value="P1">P1 重要</option>
                <option value="P2">P2 次要</option>
              </select>
              <button 
                onClick={() => setOnlyFailed(!onlyFailed)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border",
                  onlyFailed ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                只看失败项
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
          </div>
        </div>

        <div className="overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-sm text-slate-400 font-black uppercase tracking-widest text-[10px] z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-24">状态</th>
                <th className="px-6 py-4">测试用例</th>
                <th className="px-6 py-4">接口路径</th>
                <th className="px-6 py-4 w-40">执行结果</th>
                <th className="px-6 py-4 w-32">耗时</th>
                <th className="px-6 py-4 text-right w-40">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCases.map((tc) => {
                const res = executionResults.find((r) => r.testCaseId === tc.id);
                const isRunning = isExecuting && !res;
                const isFailed = res?.status === "failed";

                return (
                  <React.Fragment key={tc.id}>
                    <tr 
                      id={`case-${tc.id}`}
                      className={cn(
                        "hover:bg-slate-50/50 transition-all group relative",
                        isFailed && "bg-rose-50/30",
                        highlightedCaseId === tc.id && "bg-brand/5 ring-1 ring-inset ring-brand/20"
                      )}
                    >
                      <td className="px-6 py-5 relative">
                        {isFailed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />}
                        {res ? (
                          <StatusBadge status={res.status} className="text-[9px] font-black uppercase tracking-tighter" />
                        ) : isRunning ? (
                          <div className="flex items-center gap-2 text-brand">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">执行中</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">等待中</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-brand transition-colors">{tc.name}</span>
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                              tc.priority === "P0" ? "bg-rose-100 text-rose-600" :
                              tc.priority === "P1" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                            )}>
                              {tc.priority}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all">{tc.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="font-black text-brand px-1.5 py-0.5 bg-brand/5 rounded">{tc.method}</span>
                          <span className="text-slate-500 truncate max-w-[200px]">{tc.path}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {res ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs font-mono font-black",
                                res.responseCode && res.responseCode < 400 ? "text-emerald-600" : "text-rose-600"
                              )}>
                                {res.responseCode || "ERR"}
                              </span>
                              {isFailed && (
                                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-500 text-[8px] font-black rounded uppercase tracking-tighter border border-rose-100">
                                  {res.failureType || "断言失败"}
                                </span>
                              )}
                            </div>
                            {isFailed && <span className="text-[9px] text-rose-400 font-bold uppercase tracking-tighter">Check Failed</span>}
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-slate-300">---</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {res ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-300" />
                            <span className="text-xs font-mono text-slate-500 font-bold">{res.duration}ms</span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-slate-300">--</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => setExpandedCaseId(expandedCaseId === tc.id ? null : tc.id)}
                            title="查看详情"
                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-brand transition-all border border-transparent hover:border-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onExecute([tc.id])}
                            title="重试"
                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-all border border-transparent hover:border-slate-100"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button 
                            title="更多操作"
                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 展开详情区 */}
                    <AnimatePresence>
                      {expandedCaseId === tc.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-50/50"
                        >
                          <td colSpan={6} className="px-6 py-6 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Terminal className="w-4 h-4 text-slate-400" />
                                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">请求详情</h4>
                                </div>
                                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[11px] text-slate-300 space-y-2">
                                  <div className="flex gap-4">
                                    <span className="text-brand font-bold">METHOD:</span>
                                    <span>{tc.method}</span>
                                  </div>
                                  <div className="flex gap-4">
                                    <span className="text-brand font-bold">URL:</span>
                                    <span className="break-all">{config.baseUrl}{tc.path}</span>
                                  </div>
                                  <div className="pt-2 border-t border-white/10">
                                    <span className="text-slate-500 block mb-1">HEADERS:</span>
                                    <pre className="text-[10px]">{JSON.stringify(config.headers, null, 2)}</pre>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-slate-400" />
                                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">响应结果</h4>
                                </div>
                                {res ? (
                                  <div className="bg-white border border-slate-200 rounded-2xl p-5 font-mono text-[11px] space-y-4 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                      <span className="text-slate-400 font-bold">STATUS:</span>
                                      <span className={cn("font-black px-2 py-0.5 rounded", res.responseCode < 400 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                                        {res.responseCode}
                                      </span>
                                    </div>
                                    <div className="flex gap-4">
                                      <span className="text-slate-400 font-bold">TIME:</span>
                                      <span className="text-slate-600 font-black">{res.duration}ms</span>
                                    </div>
                                  </div>
                                  
                                  {isFailed && res.errorReason && (
                                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                                      <span className="text-rose-600 font-black block mb-1 uppercase text-[9px] tracking-widest">失败原因 / 错误详情</span>
                                      <p className="text-rose-500 font-bold leading-relaxed">{res.errorReason}</p>
                                    </div>
                                  )}

                                  <div className="pt-4 border-t border-slate-100">
                                    <span className="text-slate-400 font-black block mb-2 uppercase text-[9px] tracking-widest">响应体 (Response Body)</span>
                                    <pre className="text-[10px] text-slate-600 overflow-auto max-h-48 custom-scrollbar bg-slate-50 p-3 rounded-xl border border-slate-100">
                                      {JSON.stringify(res.responseData || res.response || { message: "No response body" }, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                                ) : (
                                  <div className="h-32 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs italic">
                                    等待执行结果...
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Search className="w-12 h-12 stroke-[1px] opacity-10" />
              <p className="text-sm font-bold italic">未找到匹配搜索条件的测试用例</p>
            </div>
          )}
        </div>
        
        {/* 4. 结果闭环操作区 */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">通过率: {stats.successRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">失败项: {stats.failed}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <FileDown className="w-3.5 h-3.5" />
              导出执行报告
            </button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              跳转报告分析
            </button>
          </div>
        </div>
      </div>

      {/* 4. 环境配置弹窗 */}
      <AnimatePresence>
        {!isConfigCollapsed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">编辑执行环境</h3>
                </div>
                <button 
                  onClick={() => setIsConfigCollapsed(true)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">基准 URL</label>
                  <input 
                    type="text" 
                    value={config.baseUrl}
                    onChange={(e) => onConfigChange("baseUrl", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">超时时间 (ms)</label>
                    <input 
                      type="number" 
                      value={config.timeout}
                      onChange={(e) => onConfigChange("timeout", parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">重试次数</label>
                    <input 
                      type="number" 
                      value={config.retries}
                      onChange={(e) => onConfigChange("retries", parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsConfigCollapsed(true)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  保存并关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
