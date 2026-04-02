import React from "react";
import { motion } from "framer-motion";
import { FileText, Edit3, CheckCircle2, Info, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportConfirmStepProps {
  reportSpecifications: string;
  onChange: (value: string) => void;
  metrics: {
    total: number;
    success: number;
    failed: number;
    duration: number;
  };
}

export const ReportConfirmStep: React.FC<ReportConfirmStepProps> = ({
  reportSpecifications,
  onChange,
  metrics,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">确认报告生成规范</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          测试执行已完成。在生成最终报告之前，请确认或修改报告的生成规范和包含的内容。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-2">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">通过用例</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-700">{metrics.success}</span>
            <span className="text-xs font-bold text-emerald-600/60">/ {metrics.total}</span>
          </div>
        </div>
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col gap-2">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">失败用例</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-rose-700">{metrics.failed}</span>
            <span className="text-xs font-bold text-rose-600/60">/ {metrics.total}</span>
          </div>
        </div>
        <div className="p-6 bg-brand/5 border border-brand/10 rounded-2xl flex flex-col gap-2">
          <span className="text-[10px] font-bold text-brand uppercase tracking-widest">执行耗时</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-brand">{metrics.duration}</span>
            <span className="text-xs font-bold text-brand/60">ms</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand" />
            <label className="text-sm font-bold text-slate-700">报告生成规范 (AI 指令)</label>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <Info className="w-3 h-3" />
            支持 Markdown 格式
          </div>
        </div>
        
        <div className="relative group">
          <textarea
            value={reportSpecifications}
            onChange={(e) => onChange(e.target.value)}
            placeholder="输入报告生成的具体要求，例如：重点关注 P0 失败用例，增加安全风险分析..."
            className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all font-mono text-sm resize-none shadow-inner leading-relaxed"
          />
          <div className="absolute top-4 right-4">
            <Edit3 className="w-4 h-4 text-slate-300" />
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-800">提示</p>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              AI 将根据上述规范分析测试结果并生成总结。您可以要求 AI 针对特定的失败原因进行深度分析，或自定义报告的展示重点。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
