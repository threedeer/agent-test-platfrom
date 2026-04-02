import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, Play, Edit2, Trash2, Tag, Clock, 
  CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronRight, User, 
  Link as LinkIcon, Calendar, Layers, Box, Info, Code, Target, Zap,
  LayoutGrid, List as ListIcon, BarChart3, Activity, Share2, Mail, 
  History, ArrowRight, ExternalLink, Copy, Archive, Shield, Settings,
  Database, FileText, CheckCircle, Terminal
} from "lucide-react";
import { TestCase, TestSuite, TestSuiteStatus } from "@/types";
import { cn } from "@/lib/utils";

interface LibraryViewProps {
  testSuites: TestSuite[];
  testCases: TestCase[];
  onExecute: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ testSuites, testCases, onExecute, onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [filter, setFilter] = useState("全部");

  const filterChips = ["全部", "核心", "最近更新", "已执行", "已被流程引用", "未维护"];

  const stats = [
    { label: "测试集总数", value: testSuites.length, icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "测试用例总数", value: testCases.length, icon: Database, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "近7天更新", value: 12, icon: History, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "核心测试集", value: 5, icon: Shield, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "最近执行数", value: 128, icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "被流程引用数", value: 42, icon: Share2, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const getStatusColor = (status: TestSuiteStatus) => {
    switch (status) {
      case "enabled": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "draft": return "bg-slate-100 text-slate-600 border-slate-200";
      case "maintenance": return "bg-amber-100 text-amber-700 border-amber-200";
      case "archived": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusLabel = (status: TestSuiteStatus) => {
    switch (status) {
      case "enabled": return "启用";
      case "draft": return "草稿";
      case "maintenance": return "维护中";
      case "archived": return "归档";
      default: return status;
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "failed": return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      case "partial": return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-300" />;
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case "success": return "通过";
      case "failed": return "失败";
      case "partial": return "部分失败";
      default: return "未执行";
    }
  };

  if (selectedSuiteId) {
    const suite = testSuites.find(s => s.id === selectedSuiteId);
    if (!suite) return null;
    return <TestSuiteDetail suite={suite} testCases={testCases.filter(tc => tc.suiteId === suite.id)} onBack={() => setSelectedSuiteId(null)} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 页面标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">测试库</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">统一管理测试集、测试用例与测试资产</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Plus className="w-4 h-4" />
            新建测试集
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <LinkIcon className="w-4 h-4" />
            导入测试集
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold shadow-lg shadow-brand/20 hover:opacity-90 transition-all">
            <Settings className="w-4 h-4" />
            批量管理
          </button>
        </div>
      </div>

      {/* 资产摘要区 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
            <div className="text-xl font-black text-slate-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 搜索筛选区 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
            <input 
              type="text" 
              placeholder="搜索测试集 / 标签 / 接口" 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode("card")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "card" ? "bg-white text-brand shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("table")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-white text-brand shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
            <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-brand/20">
              <option>最近更新</option>
              <option>最近执行</option>
              <option>用例数</option>
              <option>通过率</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterChips.map(chip => (
            <button 
              key={chip}
              onClick={() => setFilter(chip)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                filter === chip 
                  ? "bg-brand text-white border-brand shadow-md shadow-brand/20" 
                  : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
              )}
            >
              {chip}
            </button>
          ))}
          <button className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
            <Plus className="w-3 h-3" />
            高级筛选
          </button>
        </div>
      </div>

      {/* 测试集列表区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testSuites.map(suite => (
          <motion.div 
            key={suite.id}
            layoutId={suite.id}
            className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand/20 transition-all overflow-hidden flex flex-col group"
          >
            {/* 卡片头部 */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {suite.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-black uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-tighter", getStatusColor(suite.status))}>
                  {getStatusLabel(suite.status)}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-brand transition-colors line-clamp-1">{suite.name}</h3>
              <div className="flex items-center gap-2 mt-2 text-xs font-bold text-slate-400">
                <Box className="w-3.5 h-3.5" />
                <span>所属模块：{suite.module}</span>
              </div>
            </div>

            {/* 卡片主体 */}
            <div className="px-6 py-4 bg-slate-50/50 grid grid-cols-2 gap-4 border-y border-slate-100">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">用例数</div>
                <div className="text-sm font-black text-slate-900">{suite.caseCount}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">关联接口</div>
                <div className="text-sm font-black text-slate-900">{suite.interfaceCount}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">更新时间</div>
                <div className="text-sm font-black text-slate-900">{suite.updatedAt.split(' ')[0]}</div>
              </div>
            </div>

            {/* 执行信息区 */}
            <div className="p-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getResultIcon(suite.lastExecution?.result || "")}
                  <span className="text-xs font-black text-slate-700">{getResultLabel(suite.lastExecution?.result || "")}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{suite.lastExecution?.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500">{suite.lastExecution?.passRate}% 通过率</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500">{suite.lastExecution?.environment}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 流程联动区 */}
            <div className="px-6 py-3 bg-slate-100/30 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400" title="控制台引用">
                  <Terminal className="w-3 h-3" />
                  {suite.citations.console}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400" title="流程引用">
                  <Zap className="w-3 h-3" />
                  {suite.citations.flow}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400" title="报告数">
                  <FileText className="w-3 h-3" />
                  {suite.citations.reports}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400" title="邮件发送">
                  <Mail className="w-3 h-3" />
                  {suite.citations.emails}
                </div>
              </div>
              <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* 卡片底部操作 */}
            <div className="p-4 grid grid-cols-2 gap-3 mt-auto">
              <button 
                onClick={() => setSelectedSuiteId(suite.id)}
                className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-100 transition-all"
              >
                查看详情
              </button>
              <button 
                onClick={() => onExecute(suite.id)}
                className="flex items-center justify-center gap-2 py-2 bg-brand/5 text-brand rounded-xl text-xs font-black hover:bg-brand hover:text-white transition-all"
              >
                在控制台执行
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Sub-components for Detail Views ---

interface TestSuiteDetailProps {
  suite: TestSuite;
  testCases: TestCase[];
  onBack: () => void;
}

const TestSuiteDetail: React.FC<TestSuiteDetailProps> = ({ suite, testCases, onBack }) => {
  const [activeTab, setActiveTab] = useState("概览");
  const tabs = ["概览", "测试用例", "执行记录", "报告记录", "发送记录", "变更记录"];

  return (
    <div className="space-y-8 pb-12">
      {/* 顶部导航 */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <button onClick={onBack} className="hover:text-brand transition-colors">测试库</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">测试集详情</span>
      </nav>

      {/* 页面头部 */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{suite.name}</h2>
              <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest", 
                suite.status === "enabled" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"
              )}>
                {suite.status === "enabled" ? "启用" : "维护中"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {suite.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-black uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>更新时间：{suite.updatedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl text-sm font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all">
              <Play className="w-4 h-4" />
              在控制台执行
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all">
              <Share2 className="w-4 h-4" />
              引用到流程
            </button>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 流程状态条 */}
        <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between max-w-4xl">
          {[
            { label: "输入对象", status: "已引用" },
            { label: "生成用例", status: "已生成" },
            { label: "执行测试", status: "已执行" },
            { label: "测试报告", status: "已产出报告" },
            { label: "发送邮件", status: "已发送" },
          ].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2 group cursor-help">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-black text-sm shadow-inner">
                  {idx + 1}
                </div>
                <div className="text-[10px] font-black text-slate-900">{step.label}</div>
                <div className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">{step.status}</div>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-100 mx-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand/20 animate-shimmer" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-100 px-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-sm font-black transition-all relative",
              activeTab === tab ? "text-brand" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "概览" && <OverviewTab suite={suite} />}
        {activeTab === "测试用例" && <TestCasesTab testCases={testCases} />}
        {activeTab === "执行记录" && <div className="p-20 text-center text-slate-400 font-bold italic">执行记录模块开发中...</div>}
        {activeTab === "报告记录" && <div className="p-20 text-center text-slate-400 font-bold italic">报告记录模块开发中...</div>}
        {activeTab === "发送记录" && <div className="p-20 text-center text-slate-400 font-bold italic">发送记录模块开发中...</div>}
        {activeTab === "变更记录" && <div className="p-20 text-center text-slate-400 font-bold italic">变更记录模块开发中...</div>}
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ suite: TestSuite }> = ({ suite }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：基本信息卡 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-brand" />
          <h4 className="text-sm font-black text-slate-900">基本信息</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">测试集描述</div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">{suite.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">所属模块</div>
              <div className="text-sm font-black text-slate-900">{suite.module}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">适用环境</div>
              <div className="text-sm font-black text-slate-900">测试 / 预发 / 生产</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">创建时间</div>
              <div className="text-sm font-black text-slate-900">{suite.createdAt}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最新版本</div>
              <div className="text-sm font-black text-slate-900">v2.4.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* 中间：执行摘要卡 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h4 className="text-sm font-black text-slate-900">执行摘要</h4>
        </div>
        <div className="grid grid-cols-2 gap-y-6">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近执行时间</div>
            <div className="text-sm font-black text-slate-900">{suite.lastExecution?.time}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近执行环境</div>
            <div className="text-sm font-black text-slate-900">{suite.lastExecution?.environment}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近通过率</div>
            <div className="text-lg font-black text-emerald-500">{suite.lastExecution?.passRate}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">平均耗时</div>
            <div className="text-sm font-black text-slate-900">3m 12s</div>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-50">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">最近失败原因 TOP 3</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">断言失败：预期 200 实际 500</span>
              <span className="text-rose-500">42%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: "42%" }} />
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">鉴权过期：Token Invalid</span>
              <span className="text-amber-500">28%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: "28%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：流程联动摘要卡 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-purple-500" />
          <h4 className="text-sm font-black text-slate-900">流程联动摘要</h4>
        </div>
        <div className="space-y-4">
          {[
            { label: "被控制台引用次数", value: suite.citations.console, icon: Terminal },
            { label: "被流程编排引用次数", value: suite.citations.flow, icon: Zap },
            { label: "历史报告数", value: suite.citations.reports, icon: FileText },
            { label: "邮件发送次数", value: suite.citations.emails, icon: Mail },
            { label: "关联接口数", value: suite.interfaceCount, icon: LinkIcon },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-600">{item.label}</span>
              </div>
              <span className="text-sm font-black text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TestCasesTab: React.FC<{ testCases: TestCase[] }> = ({ testCases }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索用例名称..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            筛选
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button className="px-4 py-2 bg-brand text-white rounded-xl text-xs font-bold shadow-lg shadow-brand/20 hover:opacity-90 transition-all">
            新增用例
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
            批量执行
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">用例名称</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">优先级</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">最近执行</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {testCases.map(tc => (
              <tr key={tc.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm",
                      tc.method === "GET" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {tc.method}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">{tc.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{tc.path}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                    tc.priority === "P0" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {tc.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-600">启用</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      {tc.lastExecutionResult === "success" ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                      <span className="text-xs font-bold text-slate-700">{tc.lastExecutionResult === "success" ? "通过" : "失败"}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{tc.lastExecutionTime || "从未执行"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
