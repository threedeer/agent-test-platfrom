import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Plus, Check, ChevronRight, Info, Search, Tag, Box } from "lucide-react";
import { TestSuite } from "@/types";
import { cn } from "@/lib/utils";

interface SaveToLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  testSuites: TestSuite[];
}

export const SaveToLibraryModal: React.FC<SaveToLibraryModalProps> = ({ isOpen, onClose, onSave, testSuites }) => {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    module: "",
    tags: [] as string[],
  });

  const handleSave = () => {
    onSave({ mode, selectedSuiteId, ...formData });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-0 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">保存到测试库</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">将当前生成的测试用例持久化到测试资产库中</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Mode Toggle */}
              <div className="flex p-1.5 bg-slate-100 rounded-[24px]">
                <button
                  onClick={() => setMode("new")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-sm font-black transition-all",
                    mode === "new" ? "bg-white text-brand shadow-lg" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Plus className="w-4 h-4" />
                  新建测试集
                </button>
                <button
                  onClick={() => setMode("existing")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-sm font-black transition-all",
                    mode === "existing" ? "bg-white text-brand shadow-lg" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Layers className="w-4 h-4" />
                  更新现有测试集
                </button>
              </div>

              {mode === "new" ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">测试集名称</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例如：用户中心核心接口测试集"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属模块</label>
                      <select
                        value={formData.module}
                        onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all appearance-none"
                      >
                        <option value="">请选择模块</option>
                        <option value="用户中心">用户中心</option>
                        <option value="支付模块">支付模块</option>
                        <option value="订单系统">订单系统</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">标签 (逗号分隔)</label>
                      <input
                        type="text"
                        placeholder="核心, P0, 登录"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">描述信息</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="简要描述该测试集覆盖的业务场景..."
                      rows={3}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索现有测试集..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {testSuites.map((suite) => (
                      <div
                        key={suite.id}
                        onClick={() => setSelectedSuiteId(suite.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                          selectedSuiteId === suite.id
                            ? "border-brand bg-brand/5"
                            : "border-slate-50 bg-slate-50 hover:border-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            selectedSuiteId === suite.id ? "bg-brand text-white" : "bg-white text-slate-400"
                          )}>
                            <Box className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{suite.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{suite.module} · {suite.caseCount} 个用例</div>
                          </div>
                        </div>
                        {selectedSuiteId === suite.id && (
                          <div className="w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Info className="w-4 h-4" />
                  <span>保存后可在测试库中随时引用和执行</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={mode === "new" ? !formData.name : !selectedSuiteId}
                    className="px-8 py-3 bg-brand text-white rounded-2xl text-sm font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    确认保存
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
