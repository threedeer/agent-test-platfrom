import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, FileText, Briefcase, ChevronDown, ChevronUp, Plus, Trash2, 
  Layout, Info, Loader2, RefreshCw, Lock, ShieldCheck, ShieldAlert,
  Upload, Link, Code, MessageSquare, Sparkles, CheckCircle2, ChevronRight,
  Zap, BookOpen, Settings2, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InputStepProps {
  data: {
    docText: string;
    businessContext: string;
    generationPlan?: string;
    authRequirements: {
      apiName: string;
      params: { key: string; value: string }[];
    }[];
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onImportFromLibrary: () => void;
  isParsing: boolean;
  parsedResult?: {
    endpoints: number;
    docs: number;
    failedItems: string[];
    authDetected: string;
    completeness: number;
  };
}

export const InputStep: React.FC<InputStepProps> = ({ 
  data, 
  onChange, 
  onNext,
  onImportFromLibrary,
  isParsing,
  parsedResult,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "upload" | "url">("text");

  const handleDocChange = (text: string) => {
    onChange("docText", text);
  };

  const addAuthRequirement = () => {
    const newReq = { 
      apiName: `API #${data.authRequirements.length + 1}`, 
      params: [{ key: "Token", value: "" }] 
    };
    onChange("authRequirements", [...data.authRequirements, newReq]);
  };

  const updateAuthReq = (index: number, field: string, value: any) => {
    const updated = [...data.authRequirements];
    updated[index] = { ...updated[index], [field]: value };
    onChange("authRequirements", updated);
  };

  const addParam = (index: number) => {
    if (data.authRequirements[index].params.length >= 3) return;
    const updated = [...data.authRequirements];
    updated[index].params.push({ key: "Key", value: "" });
    onChange("authRequirements", updated);
  };

  const updateParam = (reqIndex: number, paramIndex: number, field: "key" | "value", value: string) => {
    const updated = [...data.authRequirements];
    updated[reqIndex].params[paramIndex][field] = value;
    onChange("authRequirements", updated);
  };

  const removeParam = (reqIndex: number, paramIndex: number) => {
    const updated = [...data.authRequirements];
    updated[reqIndex].params.splice(paramIndex, 1);
    onChange("authRequirements", updated);
  };

  const removeAuthReq = (index: number) => {
    onChange("authRequirements", data.authRequirements.filter((_, i) => i !== index));
  };

  const isAuthDetected = (text: string) => {
    if (!text.trim()) return false;
    const authPatterns = [
      /authorization:\s*.+/i,
      /api-key:\s*.+/i,
      /x-api-key:\s*.+/i,
      /token:\s*.+/i,
      /bearer\s+.+/i,
      /cookie:\s*.+/i
    ];
    return authPatterns.some(pattern => pattern.test(text));
  };

  const showAuthSupplement = data.docText.trim().length > 0 && !isAuthDetected(data.docText);

  const quickTags = ["登录鉴权", "分页查询", "创建订单", "状态流转", "参数校验", "异常分支"];

  const handleTagClick = (tag: string) => {
    const current = data.businessContext.trim();
    const prefix = current ? (current.endsWith("\n") ? "" : "\n") : "";
    onChange("businessContext", current + prefix + `• ${tag}：`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* 1. 核心任务区 (首屏强聚焦) */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">配置测试环境</h2>
          <p className="text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
            提供 API 文档、URL 和认证信息，AI 将自动解析结构并生成测试用例。
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* API 输入引导 */}
          <div className="border-b border-slate-50 bg-slate-50/30 p-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[
                { id: "text", label: "文本/cURL 导入", icon: Code },
                { id: "upload", label: "上传文件", icon: Upload },
                { id: "url", label: "从 URL 导入", icon: Link },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    activeTab === tab.id 
                      ? "bg-white text-brand shadow-sm" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
              <div className="w-px h-4 bg-slate-200 mx-2" />
              <button
                onClick={onImportFromLibrary}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-brand hover:bg-brand/5 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>从测试库引用</span>
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black text-brand uppercase tracking-widest hover:bg-brand/5 rounded-lg transition-all">
              <BookOpen className="w-3.5 h-3.5" />
              查看示例
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="relative">
              <textarea
                value={data.docText}
                onChange={(e) => handleDocChange(e.target.value)}
                placeholder="粘贴 Swagger/OpenAPI 文档、接口 URL、cURL，或直接描述 API 业务场景..."
                className="w-full h-[240px] p-6 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-brand/5 focus:border-brand/30 transition-all font-mono text-sm resize-none leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400">
                  <Globe className="w-3 h-3" />
                  自动检测已激活
                </div>
                <span className="text-[10px] font-black text-slate-300">
                  {data.docText.length} CHARS
                </span>
              </div>
            </div>

            {/* 业务场景描述 (升级为高价值字段) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-brand rounded-full" />
                  <label className="text-sm font-black text-slate-800">业务场景描述 (推荐)</label>
                </div>
                <span className="text-[10px] font-bold text-brand bg-brand/5 px-2 py-0.5 rounded-full">
                  增强生成质量的关键项
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                描述核心业务逻辑、关键链路、异常规则，有助于生成更准确的测试用例。
              </p>
              <div className="relative">
                <textarea
                  value={data.businessContext}
                  onChange={(e) => onChange("businessContext", e.target.value)}
                  placeholder="例如：登录后需要获取 Token 并在后续请求头中携带；创建订单时库存不足应返回 400..."
                  className="w-full h-24 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-brand/5 focus:border-brand/30 transition-all text-sm resize-none leading-relaxed"
                />
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                  {quickTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:border-brand hover:text-brand transition-all"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 主按钮 */}
            <div className="pt-4">
              <button 
                onClick={onNext}
                disabled={!data.docText.trim() || isParsing}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand/20",
                  data.docText.trim() 
                    ? "bg-brand text-white hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                {isParsing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>开始解析并生成测试用例</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 业务补充区 (次级区) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 身份认证补充 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-black text-slate-800">身份认证补充</h3>
            </div>
            <button 
              onClick={addAuthRequirement}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-brand transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-4 min-h-[120px] flex flex-col justify-center">
            {data.authRequirements.length === 0 ? (
              <div className="text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-slate-200 mx-auto" />
                <p className="text-[10px] text-slate-400">如需特殊鉴权，请点击上方添加</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.authRequirements.map((req, reqIndex) => (
                  <div key={reqIndex} className="p-3 bg-slate-50 rounded-xl relative group">
                    <button 
                      onClick={() => removeAuthReq(reqIndex)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <input 
                      type="text"
                      value={req.apiName}
                      onChange={(e) => updateAuthReq(reqIndex, "apiName", e.target.value)}
                      className="bg-transparent text-[11px] font-bold text-slate-700 w-full mb-2 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      {req.params.map((p, pi) => (
                        <input 
                          key={pi}
                          type="text"
                          value={p.value}
                          onChange={(e) => updateParam(reqIndex, pi, "value", e.target.value)}
                          placeholder={p.key}
                          className="flex-1 px-2 py-1 bg-white border border-slate-100 rounded text-[10px] focus:outline-none focus:border-brand/30"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 生成规范 (重新定义为 AI 默认规范卡片) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-black text-slate-800">AI 默认生成规范</h3>
            </div>
            <button className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline">
              编辑规则
            </button>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10 space-y-2.5">
              {[
                "分析 API 路径与方法",
                "提取请求参数与响应结构",
                "识别业务逻辑依赖",
                "覆盖正向与边界用例",
                "补充鉴权与安全测试"
              ].map((rule, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-brand" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部帮助引导 */}
      <div className="pt-10 border-t border-slate-100 flex items-center justify-center gap-12">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-slate-900">极速解析</span>
            <span className="text-[9px] text-slate-400">秒级识别复杂文档</span>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-slate-900">质量保障</span>
            <span className="text-[9px] text-slate-400">覆盖 95% 以上业务场景</span>
          </div>
        </div>
      </div>
    </div>
  );
};
