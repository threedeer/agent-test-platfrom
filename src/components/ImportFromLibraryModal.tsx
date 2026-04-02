import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, Layers, Box, ChevronRight, Check, Info, Plus } from "lucide-react";
import { TestSuite } from "@/types";
import { cn } from "@/lib/utils";

interface ImportFromLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (suiteId: string) => void;
  testSuites: TestSuite[];
}

export const ImportFromLibraryModal: React.FC<ImportFromLibraryModalProps> = ({ isOpen, onClose, onImport, testSuites }) => {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuites = testSuites.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">从测试库引用</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">选择已有的测试集引用到当前控制台流程</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Search & Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索测试集名称、模块、标签..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {filteredSuites.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-bold italic">
                    未找到匹配的测试集
                  </div>
                ) : (
                  filteredSuites.map((suite) => (
                    <div
                      key={suite.id}
                      onClick={() => setSelectedSuiteId(suite.id)}
                      className={cn(
                        "p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                        selectedSuiteId === suite.id
                          ? "border-brand bg-brand/5 shadow-lg shadow-brand/5"
                          : "border-slate-50 bg-slate-50 hover:border-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                          selectedSuiteId === suite.id ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-white text-slate-400 shadow-sm"
                        )}>
                          <Box className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-900">{suite.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{suite.module}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{suite.caseCount} 个用例</span>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{suite.lastExecution?.passRate}% 通过率</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectedSuiteId === suite.id ? (
                        <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-lg shadow-brand/20">
                          <Check className="w-5 h-5" />
                        </div>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-all" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Info className="w-4 h-4" />
                  <span>引用后将自动填充测试用例并进入执行阶段</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => selectedSuiteId && onImport(selectedSuiteId)}
                    disabled={!selectedSuiteId}
                    className="px-8 py-3 bg-brand text-white rounded-2xl text-sm font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    确认引用
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
