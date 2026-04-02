import React from "react";
import { motion } from "framer-motion";
import { Layout, Terminal, BarChart3, Database, History, Settings, ChevronLeft, ChevronRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { ViewType } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: "console", name: "控制台", icon: Layout, description: "测试工作流" },
    { id: "library", name: "测试库", icon: Database, description: "用例管理" },
    { id: "reports", name: "报告库", icon: BarChart3, description: "历史报告" },
    { id: "logs", name: "日志系统", icon: Terminal, description: "实时日志" },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 220 }}
      className="h-screen bg-white border-r border-black/[0.05] flex flex-col sticky top-0 z-[60] shadow-2xl shadow-slate-200/20"
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-5 border-b border-black/[0.03]">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shadow-xl shadow-brand/20 group-hover:scale-105 transition-transform shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <h1 className="text-xs font-bold tracking-tight text-slate-900 leading-none">智能测试平台</h1>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Intelligent Testing</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={cn(
              "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all group relative",
              currentView === item.id 
                ? "bg-brand/10 text-brand shadow-sm" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            )}
          >
            <item.icon className={cn(
              "w-4.5 h-4.5 transition-transform group-hover:scale-110 shrink-0",
              currentView === item.id ? "text-brand" : "text-slate-300 group-hover:text-brand"
            )} />
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-start"
              >
                <span className="text-xs font-bold leading-none">{item.name}</span>
                <span className={cn(
                  "text-[9px] font-medium mt-1",
                  currentView === item.id ? "text-brand/60" : "text-slate-300"
                )}>
                  {item.description}
                </span>
              </motion.div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="p-3 border-t border-black/[0.03] space-y-1">
        <button className="w-full flex items-center gap-3 p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group">
          <Settings className="w-4.5 h-4.5 text-slate-400 group-hover:text-brand transition-colors shrink-0" />
          {!isCollapsed && <span className="text-xs font-bold">系统设置</span>}
        </button>
        <button 
          onClick={onToggleCollapse}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group"
        >
          {isCollapsed ? <ChevronRight className="w-4.5 h-4.5 text-slate-400" /> : <ChevronLeft className="w-4.5 h-4.5 text-slate-400" />}
          {!isCollapsed && <span className="text-xs font-bold">收起菜单</span>}
        </button>
      </div>
    </motion.aside>
  );
};
