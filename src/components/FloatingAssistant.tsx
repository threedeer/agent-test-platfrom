import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MessageSquare, ChevronRight, Zap, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingAssistantProps {
  currentStep: number;
  isProcessing: boolean;
  metrics: {
    apis: number;
    cases: number;
    executed: number;
    success: number;
    failed: number;
  };
  risks: { id: string; message: string; type: "error" | "warning" }[];
  className?: string;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ 
  currentStep, 
  isProcessing,
  metrics,
  risks,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusLabel = () => {
    if (isProcessing) return "分析中...";
    if (risks.length > 0) return `检测到 ${risks.length} 个问题`;
    if (currentStep === 2 && metrics.cases === 0) return "建议生成测试用例";
    return "就绪并处于活动状态";
  };

  const ParrotIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,2C10.89,2 10,2.89 10,4V6H8V4C8,2.89 7.11,2 6,2C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,20V10C20,8.89 19.11,8 18,8H16V4C16,2.89 15.11,2 14,2H12M12,4H14V6H12V4M6,4H7V6H6V4M18,10V20H6V8H18V10M14,12H10V14H14V12M14,16H10V18H14V16Z" />
    </svg>
  );

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, originX: "100%", originY: "0%" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-12 right-0 w-80 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-black/[0.05] overflow-hidden flex flex-col z-[100]"
          >
            {/* Header */}
            <div className="p-4 border-b border-black/[0.03] flex items-center justify-between bg-white/40">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand fill-brand" />
                  <span className="font-bold text-[10px] text-slate-800 uppercase tracking-widest">AI 助手</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={cn(
                    "w-1 h-1 rounded-full",
                    isProcessing ? "bg-brand animate-pulse" : (risks.length > 0 || (currentStep === 4 && metrics.failed > 0)) ? "bg-rose-500" : "bg-emerald-500"
                  )} />
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                    {getStatusLabel()}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-black/[0.03] p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 h-[380px] overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-brand" />
                </div>
                <div className="bg-slate-50/80 rounded-2xl rounded-tl-none p-4 border border-black/[0.02]">
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {currentStep === 1 ? "我已经分析了您的 API 文档。一切看起来都很扎实，但我建议添加更多业务上下文以获得更好的测试覆盖率。" : 
                     currentStep === 2 ? "测试用例已生成。我已经针对边缘情况进行了优化。您希望我添加特定于安全的场景吗？" :
                     currentStep === 4 ? (
                       metrics.failed > 0 
                       ? `我检测到 ${metrics.failed} 个失败。大多数似乎与超时问题有关。我应该生成失败分析报告吗？`
                       : "所有测试均已成功通过。系统健康状况最佳。准备好分发报告。"
                     ) :
                     "执行正在进行中。我正在实时监控异常和性能瓶颈。"}
                  </p>
                </div>
              </div>

              {risks.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">活动警报</span>
                  {risks.map(risk => (
                    <div key={risk.id} className="p-3 rounded-xl bg-rose-50 border border-rose-500/10 flex items-center gap-3">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      <span className="text-[10px] text-rose-700 font-bold">{risk.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/40 border-t border-black/[0.03]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="问我任何问题..."
                  className="w-full pl-4 pr-10 py-3 bg-slate-100/50 border border-transparent rounded-xl text-[11px] text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-brand/5 focus:bg-white focus:border-brand/20 transition-all shadow-inner"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-brand/20">
                  <MessageSquare className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <div className="relative">
        <motion.div
          layout
          initial={false}
          animate={{ width: isOpen ? 44 : 160 }}
          className={cn(
            "h-10 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-black/[0.05] flex items-center overflow-hidden cursor-pointer group relative",
            isOpen ? "justify-center" : "px-2"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500",
            isOpen ? "bg-black/[0.03] text-slate-400" : "bg-brand text-white group-hover:scale-110 shadow-lg shadow-brand/20"
          )}>
            {isOpen ? <X className="w-4 h-4" /> : <ParrotIcon />}
          </div>
          
          {!isOpen && (
            <div className="ml-2 flex-1 min-w-0 pr-2">
              <div className="text-[10px] font-bold text-slate-800 uppercase tracking-widest truncate">
                测试伙伴
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[8px] text-slate-400 font-bold truncate">
                  {getStatusLabel()}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {!isOpen && risks.length > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xl z-10">
            {risks.length}
          </div>
        )}
      </div>
    </div>
  );
};

