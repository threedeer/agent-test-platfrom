import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Clock, Calendar, Download, FileText, ChevronRight, CheckCircle2, XCircle, AlertCircle, Search, Filter } from "lucide-react";
import { ReportSummary } from "@/types";
import { cn } from "@/lib/utils";

interface ReportsViewProps {
  reports: ReportSummary[];
  onViewReport: (id: string) => void;
  onDownload: (id: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ reports, onViewReport, onDownload }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">报告库</h2>
          <p className="text-sm text-slate-500 mt-1">查看历史测试执行报告和趋势分析</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="搜索报告名称..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4" />
            日期范围
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20 hover:opacity-90 transition-all">
            <Download className="w-4 h-4" />
            导出全部
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">98.4%</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">平均通过率</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">+5</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">128</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">本周执行次数</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">-24s</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">2m 45s</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">平均执行时长</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">报告名称</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">执行时间</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">通过率</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">耗时</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">状态</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{report.testSuiteName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-500 font-mono">{report.timestamp}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-emerald-500">{report.passedCases}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-400">{report.totalCases}</span>
                    </div>
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${(report.passedCases / report.totalCases) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-500">{report.duration}s</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    report.status === "success" ? "bg-emerald-100 text-emerald-600" :
                    report.status === "failed" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {report.status === "success" ? "通过" : report.status === "failed" ? "失败" : "部分通过"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onViewReport(report.id)}
                      className="p-2 text-slate-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDownload(report.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <Download className="w-4 h-4" />
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
