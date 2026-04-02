import React, { useState } from "react";
import { 
  FileText, BarChart3, AlertTriangle, CheckCircle2, XCircle, History, 
  Download, Edit3, Save, RefreshCw, ChevronRight, List, PieChart,
  TrendingUp, Zap, Layers, ShieldCheck, AlertCircle, Lightbulb,
  MessageSquare, Info
} from "lucide-react";
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area
} from "recharts";
import { cn } from "@/lib/utils";
import { TestCase, ExecutionResult } from "@/types";

interface ReportStepProps {
  testCases: TestCase[];
  executionResults: ExecutionResult[];
  report: {
    summary: string;
    risks: string[];
    recommendations: string[];
    version: number;
  };
  reportSpecifications: string;
  onUpdateSpecifications: (value: string) => void;
  onUpdateReport: (updates: Partial<ReportStepProps["report"]>) => void;
  onRegenerate: (requirements: string) => Promise<void>;
  isRegenerating: boolean;
}

const COLORS = ['#667eea', '#00b894', '#e17055', '#f39c12', '#0984e3', '#6c5ce7'];

export const ReportStep: React.FC<ReportStepProps> = ({
  testCases,
  executionResults,
  report,
  reportSpecifications,
  onUpdateSpecifications,
  onUpdateReport,
  onRegenerate,
  isRegenerating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const stats = {
    total: 465, // Using HTML values for visual match
    closed: 405,
    toFix: 50,
    toVerify: 7,
    toRelease: 3,
    avgTime: "28.7d",
    closedRate: "87.1%"
  };

  const statusData = [
    { name: '已关闭', value: 405 },
    { name: '待修复', value: 50 },
    { name: '待验证', value: 7 },
    { name: '待发布', value: 3 },
  ];

  const priorityData = [
    { name: 'P1', value: 198 },
    { name: 'P2', value: 87 },
    { name: 'P3', value: 120 },
    { name: 'P4', value: 60 },
  ];

  const trendData = [
    { month: '10月', count: 120 },
    { month: '11月', count: 180 },
    { month: '12月', count: 150 },
    { month: '1月', count: 210 },
    { month: '2月', count: 190 },
    { month: '3月', count: 240 },
  ];

  const insights = [
    { id: 1, text: "当前共记录线上问题 465 个，已关闭 405 个（关闭率 87.1%），遗留待修复 50 个，整体处理情况良好。" },
    { id: 2, text: "缺陷等级分布中，P1 级 198 个（42.6%），P2 级 87 个（18.7%），高等级（P1+P2）合计占比 61.3%，质量风险较高，需重点关注。" },
    { id: 3, text: "优先级方面，紧急问题 49 个，高优先级 267 个，高紧急度问题合计占 68.0%，说明大多数问题业务影响面较大。" },
    { id: 4, text: "问题最集中模块：工作流智能体（127 个，占 27.3%），其次为产品化后端（61 个），建议加强该模块研发质量管控。" },
    { id: 5, text: "根因分析显示，研发问题-异常处理不够 是最主要原因（150 个，占 32.3%），建议针对性制定开发规范和 Code Review 检查项。" },
  ];

  return (
    <div className="flex flex-col h-full gap-6 bg-[#f4f6fb] -m-8 p-8 overflow-y-auto custom-scrollbar">
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-black/[0.03]">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">质量分析报告</h2>
          <button 
            onClick={() => setShowSpecs(!showSpecs)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              showSpecs ? "bg-brand text-white" : "bg-brand/5 text-brand hover:bg-brand/10"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>报告生成规范</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <Download className="w-4.5 h-4.5" />
          </button>
          <button className="btn-primary px-6 py-2 text-xs">发送报告</button>
        </div>
      </div>

      {/* 报告规范编辑区 */}
      {showSpecs && (
        <div className="bg-brand/5 border border-brand/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand" />
            <span className="text-xs font-bold text-brand">报告生成规范 (AI 指令)</span>
          </div>
          <textarea
            value={reportSpecifications}
            onChange={(e) => onUpdateSpecifications(e.target.value)}
            className="w-full h-32 p-4 bg-white border border-brand/10 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 transition-all resize-none"
            placeholder="输入报告生成的具体要求..."
          />
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
              重新生成报告
            </button>
          </div>
        </div>
      )}

      {/* 报告主体 - 模拟 HTML 样式 */}
      <div className="max-w-[900px] mx-auto w-full space-y-5">
        {/* Header */}
        <div className="bg-[#2d3436] text-white p-8 rounded-2xl text-center shadow-xl">
          <h1 className="text-2xl font-bold text-[#a29bfe] tracking-[0.2em] mb-2">📊 线上问题质量分析报告</h1>
          <div className="text-white/70 text-xs flex items-center justify-center gap-4">
            <span>数据来源：E3 平台实时拉取</span>
            <span className="w-px h-3 bg-white/20" />
            <span>统计时间：2026-03-09 14:12</span>
          </div>
          <div className="text-white/40 text-[10px] mt-2">报告生成时间：2026-03-09 14:12:46</div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: "问题总数", value: "465", sub: "全部问题记录", color: "#667eea" },
            { label: "已关闭", value: "405", sub: "关闭率 87.1%", color: "#00b894" },
            { label: "待修复", value: "50", sub: "占比 10.8%", color: "#e17055" },
            { label: "待验证", value: "7", sub: "等待验证", color: "#f39c12" },
            { label: "待发布", value: "3", sub: "等待发布", color: "#0984e3" },
            { label: "平均解决时长", value: "28.7d", sub: "687.6 小时", color: "#6c5ce7" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border-t-4" style={{ borderColor: item.color }}>
              <div className="text-[10px] font-bold text-slate-500 mb-1">{item.label}</div>
              <div className="text-xl font-black text-slate-900 mb-1" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[9px] text-slate-400">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Quality Insights */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 pb-3 border-b-2 border-[#6c5ce7] mb-4 flex items-center gap-2">
            💡 质量洞察分析
          </h2>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div key={insight.id} className="relative pl-12 pr-4 py-3 bg-[#f8f9ff] border-l-4 border-[#6c5ce7] rounded-r-xl text-xs leading-relaxed text-slate-700 group hover:bg-[#f0f2ff] transition-colors">
                <span className="absolute left-3 top-3 w-5 h-5 bg-[#667eea] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                  {insight.id}
                </span>
                {insight.text}
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 pb-3 border-b-2 border-[#0984e3] mb-6 flex items-center gap-2">
            📈 趋势分析
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#fafbff] border border-[#eef0f8] rounded-2xl p-4">
              <div className="text-center text-xs font-bold text-slate-600 mb-4">缺陷状态分布</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={statusData}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-[#fafbff] border border-[#eef0f8] rounded-2xl p-4">
              <div className="text-center text-xs font-bold text-slate-600 mb-4">缺陷等级分布（P1~P4）</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="mt-6 bg-[#fafbff] border border-[#eef0f8] rounded-2xl p-6">
            <div className="text-center text-xs font-bold text-slate-600 mb-4">月度缺陷趋势（按创建时间）</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#667eea" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Legacy Issues Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 pb-3 border-bottom-2 border-[#e17055] mb-4 flex items-center gap-2">
            🚨 遗留问题列表（待修复共 50 个）
          </h2>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {["紧急：7 个", "P1 级：13 个", "P2 级：12 个", "涉及模块：13 个"].map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold rounded-md whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
          <div className="overflow-hidden border border-slate-100 rounded-xl">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="bg-[#2d3436] text-white">
                  <th className="p-3">#</th>
                  <th className="p-3">ID</th>
                  <th className="p-3">标题</th>
                  <th className="p-3">优先级</th>
                  <th className="p-3">等级</th>
                  <th className="p-3">所属模块</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: "431202", title: "【工作流】问答节点多轮回答报错", priority: "中", level: "P3", module: "工作流智能体" },
                  { id: "429386", title: "客户反馈迭代节点中删除知识库、添加新节点会恢复成原样", priority: "高", level: "P3", module: "我的智能体" },
                  { id: "427416", title: "工作流智能体点击分析页面，报错。uid：18608501533", priority: "高", level: "P3", module: "工作流智能体" },
                  { id: "426754", title: "分支节点无问题但是一直报校验不通过", priority: "紧急", level: "P3", module: "产品化前端" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-400">{i + 1}</td>
                    <td className="p-3 font-mono">{row.id}</td>
                    <td className="p-3 font-medium text-slate-700 max-w-[200px] truncate">{row.title}</td>
                    <td className="p-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-bold",
                        row.priority === "紧急" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                      )}>{row.priority}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold">{row.level}</span>
                    </td>
                    <td className="p-3 text-slate-500">{row.module}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-6 text-[10px] text-slate-400">
            📊 Quality Analysis Report | 由 quality-analysis-report 技能自动生成 | 2026-03-09 14:12:46
          </div>
        </div>
      </div>
    </div>
  );
};
