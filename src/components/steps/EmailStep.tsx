import React, { useState } from "react";
import { 
  Mail, Send, Eye, Paperclip, Link, UserPlus, History, 
  CheckCircle2, XCircle, RefreshCw, Loader2, Layout, FileText, PieChart, Save 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepStatus } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";

interface EmailStepProps {
  email: {
    to: string;
    cc: string;
    subject: string;
    body: string;
    history: {
      time: string;
      to: string;
      status: "success" | "failed";
    }[];
  };
  onUpdateEmail: (updates: Partial<EmailStepProps["email"]>) => void;
  onSend: () => Promise<void>;
  isSending: boolean;
}

export const EmailStep: React.FC<EmailStepProps> = ({ email, onUpdateEmail, onSend, isSending }) => {
  const [showFullPreview, setShowFullPreview] = useState(false);

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">邮件分发</h2>
          <p className="text-xs text-slate-500">
            配置如何与利益相关者共享测试报告。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2 px-4 py-2 text-xs">
            <Layout className="w-3.5 h-3.5" />
            <span>加载模板</span>
          </button>
          <button className="btn-secondary flex items-center gap-2 px-4 py-2 text-xs">
            <Save className="w-3.5 h-3.5" />
            <span>保存配置</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-8 overflow-hidden">
        {/* Configuration Form */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">撰写报告邮件</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <Paperclip className="w-3 h-3" />
              <span>test_report_v2.pdf (2.4MB)</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">收件人</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={email.to}
                    onChange={(e) => onUpdateEmail({ to: e.target.value })}
                    placeholder="qa-team@example.com, dev@example.com"
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all bg-slate-50/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">抄送人</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={email.cc}
                    onChange={(e) => onUpdateEmail({ cc: e.target.value })}
                    placeholder="pm@example.com"
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all bg-slate-50/30"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">邮件主题</label>
              <input
                type="text"
                value={email.subject}
                onChange={(e) => onUpdateEmail({ subject: e.target.value })}
                placeholder="[测试报告] 项目 Alpha - 2026-03-27"
                className="w-full px-4 py-3 text-sm font-bold rounded-xl border border-slate-200 focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all bg-slate-50/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">邮件正文</label>
              <textarea
                value={email.body}
                onChange={(e) => onUpdateEmail({ body: e.target.value })}
                placeholder="输入邮件正文..."
                className="w-full h-64 p-6 text-sm rounded-2xl border border-slate-200 focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all resize-none bg-slate-50/30 leading-relaxed shadow-inner"
              />
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={onSend}
              disabled={isSending || !email.to}
              className={cn(
                "w-full py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all shadow-xl uppercase tracking-widest active:scale-[0.98]",
                isSending ? "bg-slate-100 text-slate-400" : "bg-accent text-white hover:bg-accent/90 shadow-accent/20"
              )}
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{isSending ? "正在发送报告..." : "发送测试报告"}</span>
            </button>
          </div>
        </div>

        {/* Side Info */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Preview Card */}
          <div 
            onClick={() => setShowFullPreview(true)}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col cursor-pointer group hover:border-accent/30 transition-all"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">实时预览</h3>
              </div>
              <span className="text-[10px] font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity">点击查看全文</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-2xl -mr-12 -mt-12" />
                <div className="space-y-1 relative z-10">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">主题</span>
                  <p className="text-[11px] font-bold text-white line-clamp-1">{email.subject || "无主题"}</p>
                </div>
                <div className="space-y-1 relative z-10">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">正文预览</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic font-medium line-clamp-3">
                    "{email.body || "测试执行已完成。请参阅随附的详细报告。"}"
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center gap-2 relative z-10">
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                    <FileText className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">test_report_v2.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-black/[0.05]">
            <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-brand" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">邮件全文预览</h3>
              </div>
              <button 
                onClick={() => setShowFullPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-12 custom-scrollbar bg-slate-50/30">
              <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-black/[0.02] overflow-hidden">
                {/* Email Header */}
                <div className="p-8 border-b border-slate-100 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">主题</span>
                      <h4 className="text-lg font-bold text-slate-900">{email.subject || "[测试报告] 项目 Alpha"}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">日期</span>
                      <p className="text-xs font-bold text-slate-600">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">发件人</span>
                      <p className="text-xs font-bold text-slate-600">AI 智能测试平台 <span className="font-medium text-slate-400">&lt;noreply@test-platform.ai&gt;</span></p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">收件人</span>
                      <p className="text-xs font-bold text-slate-600">{email.to || "未指定"}</p>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-10 space-y-8">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {email.body || "尊敬的团队成员，\n\n测试执行已顺利完成。附件中是本次测试的详细报告，包含了所有 API 的测试结果、性能指标以及潜在风险分析。\n\n请查阅并根据报告中的建议进行后续操作。"}
                    </p>
                  </div>

                  {/* Attachment Placeholder */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <FileText className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">test_report_v2.pdf</p>
                        <p className="text-[10px] text-slate-400 font-medium">2.4 MB • PDF 文档</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-accent transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center">
                      <Layout className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">智能测试平台自动生成</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link className="w-3.5 h-3.5 text-slate-300" />
                    <PieChart className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
