import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  List, FileText, MessageSquare, History, Plus, Trash2, Edit3, RefreshCw, 
  CheckCircle2, AlertCircle, ChevronRight, Filter, Save, ArrowRight, Info, 
  Search, MoreVertical, Copy, Loader2, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TestCase, StepStatus } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";

interface GenerateStepProps {
  testCases: TestCase[];
  selectedCaseIds: string[];
  onToggleCase: (id: string) => void;
  onToggleAll: () => void;
  regenerationRequirements: string;
  onRegenerationRequirementsChange: (value: string) => void;
  onUpdateCase: (id: string, updates: Partial<TestCase>) => void;
  onDeleteCase: (id: string) => void;
  onAddCase: () => void;
  onRegenerate: (id?: string) => Promise<void>;
  onConfirmAll: () => void;
  onSaveToLibrary: () => void;
  isRegenerating: boolean;
  isMonitorCollapsed: boolean;
}

export const GenerateStep: React.FC<GenerateStepProps> = ({
  testCases,
  selectedCaseIds,
  onToggleCase,
  onToggleAll,
  regenerationRequirements,
  onRegenerationRequirementsChange,
  onUpdateCase,
  onDeleteCase,
  onAddCase,
  onRegenerate,
  onConfirmAll,
  onSaveToLibrary,
  isRegenerating,
  isMonitorCollapsed,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegenReq, setShowRegenReq] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "P1": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "P2": return "bg-sky-500/10 text-sky-600 border-sky-500/20";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const getAssertionStrings = (assertions: TestCase['assertions']) => {
    if (!assertions) return [];
    const strings: string[] = [];
    if (assertions.statusCode) strings.push(`状态码: ${assertions.statusCode}`);
    if (assertions.business) strings.push(...assertions.business);
    if (assertions.performance) strings.push(`响应时间 < ${assertions.performance.maxDuration}ms`);
    if (assertions.custom) strings.push(assertions.custom);
    return strings;
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(testCases, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "test_cases.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredCases = testCases.filter(tc => {
    const matchesSearch = tc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tc.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || tc.priority === filterType || tc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const p0Count = testCases.filter(c => c.priority === "P0").length;
  const p1Count = testCases.filter(c => c.priority === "P1").length;
  const p2Count = testCases.filter(c => c.priority === "P2").length;
  const coverageCount = new Set(testCases.map(c => c.path)).size;

  return (
    <div className="flex flex-col gap-6 h-auto">
      {/* 1. 页面状态与摘要 */}
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">测试用例</h2>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                isRegenerating 
                  ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse" 
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              )}>
                {isRegenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>正在生成测试用例...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>已生成测试用例，等待确认</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                <span className="text-slate-400">已生成:</span>
                <span className="text-slate-900">{testCases.length} 条</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                <span className="text-slate-400">覆盖接口:</span>
                <span className="text-slate-900">{coverageCount} 个</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">P0: {p0Count}</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">P1: {p1Count}</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">P2: {p2Count}</span>
              </div>
            </div>
          </div>

          {!isRegenerating && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-700">请确认生成的测试用例后进入下一步</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. 工作台工具栏 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-brand transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索用例名称、ID 或端点..."
              className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/30 transition-all w-64"
            />
          </div>
          <div className="w-px h-6 bg-slate-100 mx-1" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-brand/5 transition-all"
          >
            <option value="all">所有优先级</option>
            <option value="P0">P0 核心</option>
            <option value="P1">P1 高级</option>
            <option value="P2">P2 普通</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddCase}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增用例</span>
          </button>
          <button
            onClick={onSaveToLibrary}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-brand hover:bg-brand/5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存到测试库</span>
          </button>
          <button
            onClick={() => setShowRegenReq(!showRegenReq)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              showRegenReq 
                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")} />
            <span>重新生成</span>
          </button>
          <div className="w-px h-6 bg-slate-100 mx-1" />
          <button
            onClick={handleExport}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
            title="导出"
          >
            <Save className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Regeneration Requirements Area */}
      <AnimatePresence>
        {showRegenReq && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-brand/5 border border-brand/10 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand" />
                <span className="text-xs font-black text-brand uppercase tracking-widest">重新生成要求 (AI 指令)</span>
              </div>
              <span className="text-[10px] text-brand/60 font-bold">针对已选中的 {selectedCaseIds.length} 条用例进行优化</span>
            </div>
            <textarea
              value={regenerationRequirements}
              onChange={(e) => onRegenerationRequirementsChange(e.target.value)}
              placeholder="输入重新生成的要求，例如：增加边界值测试、优化断言逻辑、补充异常场景..."
              className="w-full h-20 p-4 bg-white border border-brand/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all text-xs resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={() => onRegenerate()}
                disabled={isRegenerating || selectedCaseIds.length === 0}
                className="px-6 py-2 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand/20"
              >
                {isRegenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                立即重新生成
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. 测试用例表格区 */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[300px] h-auto max-h-[800px]">
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-sm text-slate-400 font-black uppercase tracking-widest text-[10px] z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={testCases.length > 0 && selectedCaseIds.length === testCases.length}
                    onChange={onToggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20"
                  />
                </th>
                <th className="px-4 py-4">用例名称</th>
                <th className="px-4 py-4">预期结果</th>
                <th className="px-4 py-4">优先级</th>
                <th className="px-4 py-4">端点</th>
                <th className="px-4 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCases.map((tc) => (
                <tr 
                  key={tc.id} 
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    selectedCaseIds.includes(tc.id) && "bg-brand/[0.02]"
                  )}
                >
                  <td className="px-6 py-5">
                    <input 
                      type="checkbox" 
                      checked={selectedCaseIds.includes(tc.id)}
                      onChange={() => onToggleCase(tc.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20"
                    />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-slate-800 leading-tight">{tc.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">#{tc.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col gap-1.5 max-w-[240px]">
                      {getAssertionStrings(tc.assertions).slice(0, 2).map((as, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-[11px] text-slate-600 line-clamp-1">{as}</span>
                        </div>
                      ))}
                      {getAssertionStrings(tc.assertions).length > 2 && (
                        <span className="text-[10px] text-slate-400 font-bold pl-5">+{getAssertionStrings(tc.assertions).length - 2} 更多断言</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-tighter", getPriorityColor(tc.priority))}>
                      {tc.priority}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-black text-brand px-1.5 py-0.5 bg-brand/5 rounded text-[10px]">{tc.method}</span>
                      <span className="text-slate-500 truncate max-w-[150px]">{tc.path}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <StatusBadge status={tc.status} className="text-[10px] font-black uppercase tracking-tighter" />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors" title="详情">
                        <Info className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors" title="编辑">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onRegenerate(tc.id)}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors" 
                        title="重新生成该条"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteCase(tc.id)}
                        className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Search className="w-12 h-12 stroke-[1px] opacity-10" />
              <p className="text-sm font-bold italic">未找到匹配搜索条件的测试用例</p>
            </div>
          )}
        </div>
        
        {/* 4. 表格下方摘要与 AI 建议 */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">测试类型分布</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">功能测试: {testCases.filter(c => c.type === "functional").length}</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">异常测试: {testCases.filter(c => c.type === "error").length}</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">鉴权测试: {testCases.filter(c => c.type === "security").length}</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              当前状态: <span className="text-emerald-600">待确认</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-4">
            <div className="w-8 h-8 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-brand" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-black text-slate-800">AI 智能建议</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                已根据 API 结构、认证方式和业务上下文自动生成功能、异常、鉴权及性能相关测试用例。
                <span className="text-brand font-bold ml-1">建议补充：</span> 边界值测试、认证失败场景。
              </p>
            </div>
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
              一键优化
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
