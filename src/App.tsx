import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepBar } from "@/components/StepBar";
import { AgentMonitor } from "@/components/AgentMonitor";
import { Sidebar } from "@/components/Sidebar";
import { InputStep } from "@/components/steps/InputStep";
import { GenerateStep } from "@/components/steps/GenerateStep";
import { ExecuteStep } from "@/components/steps/ExecuteStep";
import { ReportStep } from "@/components/steps/ReportStep";
import { ReportConfirmStep } from "@/components/steps/ReportConfirmStep";
import { EmailStep } from "@/components/steps/EmailStep";
import { LibraryView } from "@/components/views/LibraryView";
import { ReportsView } from "@/components/views/ReportsView";
import { LogsView } from "@/components/views/LogsView";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { SaveToLibraryModal } from "@/components/SaveToLibraryModal";
import { ImportFromLibraryModal } from "@/components/ImportFromLibraryModal";
import { AppState, Step, TestCase, ExecutionResult, LogEntry, ViewType, TestSuite } from "@/types";
import { cn } from "@/lib/utils";
import { Terminal, Activity, BarChart3, AlertTriangle, List, Filter, Copy, ChevronDown, ChevronUp, Layout, Settings, History, Plus, ChevronLeft, RefreshCw, Loader2, ChevronRight } from "lucide-react";

const INITIAL_STEPS: Step[] = [
  { id: 1, name: "输入对象", status: "in-progress" },
  { id: 2, name: "生成用例", status: "not-started" },
  { id: 3, name: "执行测试", status: "not-started" },
  { id: 4, name: "测试报告", status: "not-started" },
  { id: 5, name: "发送邮件", status: "not-started" },
];

const INITIAL_STATE: AppState = {
  currentView: "console",
  currentStep: 1,
  steps: INITIAL_STEPS,
  testContext: {
    docText: "",
    businessContext: "",
    generationPlan: "1. 分析 API 路径与方法\n2. 提取请求参数与响应结构\n3. 识别业务逻辑依赖\n4. 生成 P0 核心功能用例\n5. 生成异常与边界值用例\n6. 补充鉴权与安全测试用例",
    regenerationRequirements: "",
    reportSpecifications: "1. 包含测试执行概览 (通过率、时长)\n2. 详细列出所有失败用例及其错误原因\n3. 提供风险评估与改进建议\n4. 包含接口响应时间分布图表\n5. 附带完整的请求/响应日志链接",
    authRequirements: [],
  },
  selectedCaseIds: [],
  testCases: [
    { 
      id: "tc-1", 
      suiteId: "ts-1", 
      name: "获取用户信息 - 成功", 
      priority: "P0", 
      type: "功能", 
      status: "enabled",
      method: "GET", 
      path: "/api/user/profile", 
      assertions: { statusCode: "200", business: ["返回用户信息包含用户名"] },
      lastExecutionResult: "success", 
      lastExecutionTime: "2026-04-02 14:32",
      source: "AI生成", 
      version: "v1.0",
      citationCount: 5
    },
    { 
      id: "tc-2", 
      suiteId: "ts-1", 
      name: "获取用户信息 - 未授权", 
      priority: "P1", 
      type: "鉴权", 
      status: "enabled",
      method: "GET", 
      path: "/api/user/profile", 
      assertions: { statusCode: "401", business: ["返回未授权错误"] },
      lastExecutionResult: "failed", 
      lastExecutionTime: "2026-04-02 14:32",
      source: "AI生成", 
      version: "v1.0",
      citationCount: 2
    },
    { 
      id: "tc-3", 
      suiteId: "ts-2", 
      name: "创建订单 - 参数校验", 
      priority: "P0", 
      type: "异常", 
      status: "maintenance",
      method: "POST", 
      path: "/api/order/create", 
      assertions: { statusCode: "400", business: ["提示参数校验失败"] },
      lastExecutionResult: "not-executed", 
      source: "人工编辑", 
      version: "v1.1",
      citationCount: 0
    },
  ],
  testSuites: [
    {
      id: "ts-1",
      name: "用户中心核心接口测试集",
      description: "覆盖用户登录、注册、个人资料获取及修改等核心业务流程。",
      module: "用户中心",
      tags: ["核心", "P0", "登录"],
      status: "enabled",
      createdAt: "2026-03-25 10:00",
      updatedAt: "2026-04-02 14:20",
      caseCount: 24,
      interfaceCount: 8,
      lastExecution: {
        time: "今天 14:32",
        result: "partial",
        environment: "测试环境",
        passRate: 92
      },
      citations: {
        console: 2,
        flow: 3,
        reports: 5,
        emails: 2
      }
    },
    {
      id: "ts-2",
      name: "支付模块回归测试集",
      description: "针对支付下单、回调、退款等流程进行全量回归。",
      module: "支付模块",
      tags: ["支付", "回归", "高风险"],
      status: "maintenance",
      createdAt: "2026-03-20 14:00",
      updatedAt: "2026-03-30 09:15",
      caseCount: 45,
      interfaceCount: 12,
      lastExecution: {
        time: "昨天 10:00",
        result: "success",
        environment: "生产环境",
        passRate: 100
      },
      citations: {
        console: 1,
        flow: 5,
        reports: 12,
        emails: 8
      }
    }
  ],
  executionConfig: {
    baseUrl: "https://api.example.com",
    headers: { "Content-Type": "application/json" },
    auth: "",
    timeout: 5000,
    retries: 3,
  },
  executionResults: [],
  report: {
    summary: "测试执行完成，系统运行稳定。主要接口响应正常，未发现严重阻塞性问题。",
    risks: ["部分接口响应时间超过 500ms", "鉴权失败重试机制未完全覆盖"],
    recommendations: ["优化数据库查询索引", "增加限流保护机制"],
    version: 1,
  },
  reports: [
    { id: "1", timestamp: "2026-03-27 10:45", testSuiteName: "用户中心 API 测试", totalCases: 24, passedCases: 22, failedCases: 2, duration: 120, status: "partial" },
    { id: "2", timestamp: "2026-03-26 15:20", testSuiteName: "支付系统回归测试", totalCases: 45, passedCases: 45, failedCases: 0, duration: 300, status: "success" },
  ],
  email: {
    to: "qa-team@example.com",
    cc: "pm@example.com",
    subject: "[测试报告] API 自动化测试任务 - 2026-03-27",
    body: "测试执行完成，详细见报告。",
    history: [],
  },
  isAutoExecuting: false,
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [isMonitorCollapsed, setIsMonitorCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", timestamp: "10:45:01", level: "info", message: "系统初始化完成" },
    { id: "2", timestamp: "10:45:05", level: "success", message: "Agent 已就绪，等待输入测试对象" },
  ]);

  const addLog = (message: string, level: LogEntry["level"] = "info", testCaseId?: string) => {
    const newLog: LogEntry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      level,
      message,
      testCaseId,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const updateStepStatus = (stepId: number, status: Step["status"], outputCount?: number, duration?: string) => {
    setState((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === stepId ? { ...s, status, outputCount, duration } : s)),
    }));
  };

  const [highlightedCaseId, setHighlightedCaseId] = useState<string | null>(null);

  const handleSaveToLibrary = (data: any) => {
    console.log("Saving to library:", data);
    addLog(`成功保存到测试库: ${data.name || data.selectedSuiteId}`, "success");
    setIsSaveModalOpen(false);
  };

  const handleImportFromLibrary = (suiteId: string) => {
    const suite = state.testSuites.find(s => s.id === suiteId);
    if (suite) {
      const suiteCases = state.testCases.filter(tc => tc.suiteId === suiteId);
      setState(prev => ({
        ...prev,
        testCases: suiteCases,
        currentStep: 3,
        steps: prev.steps.map(s => 
          s.id <= 2 ? { ...s, status: "completed" } : 
          s.id === 3 ? { ...s, status: "in-progress" } : s
        )
      }));
      addLog(`从测试库引用了测试集: ${suite.name}，共 ${suiteCases.length} 个用例`, "success");
      setIsImportModalOpen(false);
    }
  };

  const handleNext = async () => {
    if (state.currentStep === 5) return;

    setIsProcessing(true);
    
    if (state.currentStep === 1) {
      addLog("正在确认输入并生成测试用例...", "info");
      if (!state.testContext.parsedResult) {
        await handleParse();
      }
      await handleGenerateCases();
    } else if (state.currentStep === 3) {
      addLog("正在完成测试执行...", "info");
      await handleExecute();
    } else {
      addLog(`正在完成步骤 ${state.currentStep}...`, "info");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    updateStepStatus(state.currentStep, "completed", state.currentStep === 2 ? state.testCases.length : undefined, "00:01:20");
    
    const nextStep = state.currentStep + 1;
    updateStepStatus(nextStep, "in-progress");
    
    setState((prev) => ({ ...prev, currentStep: nextStep }));
    setIsProcessing(false);
    addLog(`进入步骤 ${nextStep}: ${INITIAL_STEPS[nextStep - 1].name}`, "success");
  };

  const handlePrev = () => {
    if (state.currentStep === 1 || state.isAutoExecuting) return;
    setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const handleAutoExecute = async () => {
    if (state.isAutoExecuting) return;
    
    setState(prev => ({ ...prev, isAutoExecuting: true }));
    addLog("开启全流程自动执行模式...", "info");

    // We need to use a sequence that doesn't rely on stale state
    // Step 1: Parse
    if (state.currentStep <= 1) {
      await handleParse();
      await new Promise(r => setTimeout(r, 800));
      // Manual transition to step 2
      updateStepStatus(1, "completed", undefined, "00:01:20");
      updateStepStatus(2, "in-progress");
      setState(prev => ({ ...prev, currentStep: 2 }));
      addLog("进入步骤 2: 生成用例", "success");
      await new Promise(r => setTimeout(r, 500));
    }

    // Step 2: Generate
    // Note: We check the latest state by using functional updates or just assuming sequence
    await handleGenerateCases();
    await new Promise(r => setTimeout(r, 800));
    updateStepStatus(2, "completed", 5, "00:01:20");
    updateStepStatus(3, "in-progress");
    setState(prev => ({ ...prev, currentStep: 3 }));
    addLog("进入步骤 3: 执行测试", "success");
    await new Promise(r => setTimeout(r, 500));

    // Step 3: Execute
    await handleExecute();
    await new Promise(r => setTimeout(r, 800));
    updateStepStatus(3, "completed", undefined, "00:01:20");
    updateStepStatus(4, "in-progress");
    setState(prev => ({ ...prev, currentStep: 4 }));
    addLog("进入步骤 4: 测试报告", "success");
    await new Promise(r => setTimeout(r, 1500)); // Give time to see report

    // Step 4 -> 5
    updateStepStatus(4, "completed", undefined, "00:01:20");
    updateStepStatus(5, "in-progress");
    setState(prev => ({ ...prev, currentStep: 5 }));
    addLog("进入步骤 5: 发送邮件", "success");
    await new Promise(r => setTimeout(r, 800));

    // Step 5: Email
    await handleSendEmail();
    updateStepStatus(5, "completed", undefined, "00:01:20");

    setState(prev => ({ ...prev, isAutoExecuting: false }));
    addLog("全流程自动执行完成", "success");
  };

  const handleParse = async () => {
    setIsProcessing(true);
    addLog("正在解析 API 输入内容...", "info");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Simulate parsing multiple APIs from docText
    const lines = state.testContext.docText.split('\n');
    const detectedEndpoints = lines.filter(l => l.match(/^(GET|POST|PUT|DELETE|PATCH)\s+/i) || l.includes('http')).length || 1;
    
    // Check if auth is provided for all detected requirements
    const allAuthProvided = state.testContext.authRequirements.every(req => 
      req.params.every(p => p.value.trim() !== "")
    );

    setState((prev) => ({
      ...prev,
      testContext: {
        ...prev.testContext,
        parsedResult: {
          endpoints: detectedEndpoints * 2,
          docs: 1,
          failedItems: [],
          authDetected: allAuthProvided ? "Custom Auth" : "None",
          completeness: 85,
        },
      },
    }));
    
    setIsProcessing(false);
    if (!allAuthProvided && state.testContext.authRequirements.length > 0) {
      addLog("解析完成，部分身份认证信息不完整，建议补充", "warning");
    } else {
      addLog(`解析完成，识别到 ${detectedEndpoints * 2} 个接口`, "success");
    }
    updateStepStatus(1, "pending-confirmation");
  };

  const handleGenerateCases = async () => {
    setIsProcessing(true);
    addLog("正在生成测试用例...", "info");
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const mockCases: TestCase[] = [
      { id: "1", suiteId: "ts-1", name: "检查 API 健康状况", priority: "P0", type: "功能", method: "GET", path: "/health", status: "enabled", source: "AI生成", assertions: { statusCode: "200", business: ["响应包含 'status' 字段"] } },
      { id: "2", suiteId: "ts-1", name: "未授权访问受保护资源", priority: "P0", type: "鉴权", method: "GET", path: "/api/v1/profile", status: "enabled", source: "AI生成", assertions: { statusCode: "401" } },
      { id: "3", suiteId: "ts-1", name: "请求不存在的端点", priority: "P1", type: "异常", method: "GET", path: "/api/v1/unknown", status: "enabled", source: "AI生成", assertions: { statusCode: "404" } },
      { id: "4", suiteId: "ts-1", name: "资源列表查询性能", priority: "P2", type: "性能前置", method: "GET", path: "/api/v1/resources", status: "enabled", source: "AI生成", assertions: { performance: { maxDuration: 500 } } },
      { id: "5", suiteId: "ts-1", name: "使用错误格式的 JSON 提交", priority: "P1", type: "边界", method: "POST", path: "/api/v1/resources", status: "enabled", source: "AI生成", assertions: { statusCode: "400" } },
    ];

    setState((prev) => ({ 
      ...prev, 
      testCases: mockCases,
      selectedCaseIds: mockCases.map(c => c.id) // Default all selected
    }));
    setIsProcessing(false);
    addLog("成功生成 5 条测试用例", "success");
    updateStepStatus(2, "pending-confirmation", 5);
  };

  const handleExecute = async (ids?: string[]) => {
    setIsProcessing(true);
    const targetCases = ids ? state.testCases.filter(tc => ids.includes(tc.id)) : state.testCases;
    addLog(`开始执行 ${targetCases.length} 个测试用例...`, "info");
    
    const results = [...state.executionResults];
    for (const tc of targetCases) {
      addLog(`正在执行: ${tc.name}`, "info", tc.id);
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const status = Math.random() > 0.2 ? "success" : "failed";
      const newResult: ExecutionResult = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        testCaseId: tc.id,
        status,
        responseCode: status === "success" ? 200 : (Math.random() > 0.5 ? 401 : 500),
        duration: Math.floor(Math.random() * 300) + 100,
        errorReason: status === "failed" ? "断言失败：预期为 200 但实际为 500" : undefined,
        failureType: status === "failed" ? (Math.random() > 0.5 ? "鉴权失败" : "断言失败") : undefined,
      };
      
      const existingIdx = results.findIndex(r => r.testCaseId === tc.id);
      if (existingIdx >= 0) {
        results[existingIdx] = newResult;
      } else {
        results.push(newResult);
      }
      
      setState((prev) => ({ ...prev, executionResults: [...results] }));
      if (status === "failed") addLog(`执行失败: ${tc.name}`, "error", tc.id);
      else addLog(`执行成功: ${tc.name}`, "success", tc.id);
    }

    setIsProcessing(false);
    addLog("测试执行完毕", "success");
    updateStepStatus(3, "completed", results.length);
  };

  const handleSendEmail = async () => {
    setIsProcessing(true);
    addLog("正在发送邮件...", "info");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newHistory = {
      time: new Date().toLocaleTimeString(),
      to: state.email.to,
      status: "success" as const,
    };

    setState((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        history: [newHistory, ...prev.email.history],
      },
    }));
    
    setIsProcessing(false);
    addLog("邮件发送成功", "success");
    updateStepStatus(5, "completed");

    // 自动预览报告
    setTimeout(() => {
      setShowReportPreview(true);
    }, 800);
  };

  const handleClosePreview = () => {
    setShowReportPreview(false);
    setState((prev) => ({
      ...prev,
      currentStep: 1,
      steps: INITIAL_STEPS,
      testContext: {
        ...prev.testContext,
        docText: "",
        parsedResult: undefined,
      },
      executionResults: [],
    }));
    addLog("流程已重置，返回第一步", "info");
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <InputStep
            data={state.testContext}
            onChange={(f, v) => setState((prev) => ({ ...prev, testContext: { ...prev.testContext, [f]: v } }))}
            onNext={handleNext}
            onImportFromLibrary={() => setIsImportModalOpen(true)}
            isParsing={isProcessing}
            parsedResult={state.testContext.parsedResult}
          />
        );
      case 2:
        return (
          <GenerateStep
            testCases={state.testCases}
            selectedCaseIds={state.selectedCaseIds}
            onToggleCase={(id) => setState((prev) => ({
              ...prev,
              selectedCaseIds: prev.selectedCaseIds.includes(id)
                ? prev.selectedCaseIds.filter(cid => cid !== id)
                : [...prev.selectedCaseIds, id]
            }))}
            onToggleAll={() => setState((prev) => ({
              ...prev,
              selectedCaseIds: prev.selectedCaseIds.length === prev.testCases.length
                ? []
                : prev.testCases.map(c => c.id)
            }))}
            regenerationRequirements={state.testContext.regenerationRequirements || ""}
            onRegenerationRequirementsChange={(v) => setState((prev) => ({
              ...prev,
              testContext: { ...prev.testContext, regenerationRequirements: v }
            }))}
            onUpdateCase={(id, updates) => setState((prev) => ({ ...prev, testCases: prev.testCases.map((c) => (c.id === id ? { ...c, ...updates } : c)) }))}
            onDeleteCase={(id) => setState((prev) => ({ ...prev, testCases: prev.testCases.filter((c) => c.id !== id) }))}
            onAddCase={() => {}}
            onRegenerate={handleGenerateCases}
            onConfirmAll={() => {}}
            onSaveToLibrary={() => setIsSaveModalOpen(true)}
            isRegenerating={isProcessing}
            isMonitorCollapsed={isMonitorCollapsed}
          />
        );
      case 3:
        return (
          <ExecuteStep
            testCases={state.testCases}
            executionResults={state.executionResults}
            onExecute={handleExecute}
            onStop={() => setIsProcessing(false)}
            isExecuting={isProcessing}
            config={state.executionConfig}
            onConfigChange={(f, v) => setState((prev) => ({ ...prev, executionConfig: { ...prev.executionConfig, [f]: v } }))}
            highlightedCaseId={highlightedCaseId}
          />
        );
      case 4:
        return (
          <ReportStep
            testCases={state.testCases}
            executionResults={state.executionResults}
            report={state.report}
            reportSpecifications={state.testContext.reportSpecifications || ""}
            onUpdateSpecifications={(v) => setState((prev) => ({
              ...prev,
              testContext: { ...prev.testContext, reportSpecifications: v }
            }))}
            onUpdateReport={(u) => setState((prev) => ({ ...prev, report: { ...prev.report, ...u } }))}
            onRegenerate={async () => {}}
            isRegenerating={isProcessing}
          />
        );
      case 5:
        return (
          <EmailStep
            email={state.email}
            onUpdateEmail={(u) => setState((prev) => ({ ...prev, email: { ...prev.email, ...u } }))}
            onSend={handleSendEmail}
            isSending={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  const getNextLabel = () => {
    switch (state.currentStep) {
      case 1: return isProcessing ? "正在解析..." : "确认并生成测试用例";
      case 2: return isProcessing ? "正在生成..." : "确认用例并进入执行配置";
      case 3: return isProcessing ? "正在执行..." : "确认结果并生成报告";
      case 4: return isProcessing ? "正在生成报告..." : "确认报告并进入发送";
      case 5: return "";
      default: return "下一步";
    }
  };

  const renderView = () => {
    switch (state.currentView) {
      case "console":
        return (
          <div className="flex flex-col h-full">
            {/* 步骤条 */}
            <div className="bg-white border-b border-black/[0.05] py-4 mb-8 -mx-8 px-8">
              <div className="max-w-7xl mx-auto">
                <StepBar steps={state.steps} currentStep={state.currentStep} onStepClick={(id) => setState((prev) => ({ ...prev, currentStep: id }))} />
              </div>
            </div>
            <div className="flex-1">
              {renderStep()}
            </div>
          </div>
        );
      case "library":
        return (
          <LibraryView 
            testSuites={state.testSuites}
            testCases={state.testCases} 
            onExecute={(id) => {
              const suite = state.testSuites.find(s => s.id === id);
              if (suite) {
                const suiteCases = state.testCases.filter(tc => tc.suiteId === id);
                setState(prev => ({
                  ...prev,
                  testCases: suiteCases,
                  currentView: "console",
                  currentStep: 3,
                  steps: prev.steps.map(s => 
                    s.id <= 2 ? { ...s, status: "completed" } : 
                    s.id === 3 ? { ...s, status: "in-progress" } : s
                  )
                }));
                addLog(`在控制台开始执行测试集: ${suite.name}`, "info");
              }
            }}
            onEdit={() => {}}
            onDelete={(id) => setState(prev => ({ ...prev, testCases: prev.testCases.filter(c => c.id !== id) }))}
          />
        );
      case "reports":
        return (
          <ReportsView 
            reports={state.reports} 
            onViewReport={() => {}} 
            onDownload={() => addLog("正在导出报告...", "info")} 
          />
        );
      case "logs":
        return (
          <LogsView 
            logs={logs} 
            onClear={() => setLogs([])} 
            onDownload={() => addLog("正在导出日志...", "info")} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* 报告预览弹窗 */}
      <AnimatePresence>
        {showReportPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-12"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* 关闭按钮 */}
              <button 
                onClick={handleClosePreview}
                className="absolute top-6 right-6 z-[110] p-2 bg-white/80 backdrop-blur hover:bg-white rounded-full shadow-lg border border-slate-200 text-slate-500 hover:text-slate-900 transition-all group"
              >
                <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
              </button>

              <div className="flex-1 overflow-hidden p-8">
                <ReportStep
                  testCases={state.testCases}
                  executionResults={state.executionResults}
                  report={state.report}
                  reportSpecifications={state.testContext.reportSpecifications || ""}
                  onUpdateSpecifications={(v) => setState((prev) => ({
                    ...prev,
                    testContext: { ...prev.testContext, reportSpecifications: v }
                  }))}
                  onUpdateReport={(u) => setState((prev) => ({ ...prev, report: { ...prev.report, ...u } }))}
                  onRegenerate={async () => {}}
                  isRegenerating={false}
                />
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-center">
                <button 
                  onClick={handleClosePreview}
                  className="px-8 py-3 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:opacity-90 transition-all"
                >
                  关闭预览并返回首页
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <Sidebar 
        currentView={state.currentView} 
        onViewChange={(view) => setState(prev => ({ ...prev, currentView: view }))}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航 */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-black/[0.05] flex items-center justify-between px-6 sticky top-0 z-50 shadow-none">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
                {state.currentView === "console" ? "测试控制台" : 
                 state.currentView === "library" ? "测试库管理" : 
                 state.currentView === "reports" ? "报告中心" : "系统日志"}
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                {state.currentView === "console" ? "Test Console" : 
                 state.currentView === "library" ? "Test Library" : 
                 state.currentView === "reports" ? "Report Center" : "System Logs"}
              </span>
            </div>
            
            <div className="h-6 w-px bg-black/[0.05] mx-2" />
            
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">当前状态</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  state.isAutoExecuting ? "bg-accent animate-pulse" : isProcessing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                )} />
                <span className="text-[11px] font-bold text-slate-600">
                  {state.isAutoExecuting ? "自动执行工作流" : isProcessing ? "正在处理请求..." : "准备就绪"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {state.currentView === "console" && (
              <div className="flex items-center gap-2">
                {state.currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    disabled={state.isAutoExecuting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 text-xs font-bold transition-all hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>返回</span>
                  </button>
                )}
                <button
                  onClick={handleAutoExecute}
                  disabled={state.isAutoExecuting || isProcessing}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-brand/10 ${
                    state.isAutoExecuting 
                    ? "bg-white text-brand border border-brand/20" 
                    : "bg-brand text-white hover:opacity-90"
                  } disabled:opacity-50`}
                >
                  {state.isAutoExecuting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>{state.isAutoExecuting ? "自动执行中" : "一键自动执行"}</span>
                </button>
                
                {getNextLabel() && (
                  <button
                    onClick={handleNext}
                    disabled={isProcessing || state.isAutoExecuting}
                    className={cn(
                      "flex items-center gap-1.5 px-5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-accent/20 bg-accent text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>{getNextLabel()}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            <div className="w-px h-4 bg-black/[0.05] mx-1" />

            <FloatingAssistant 
              currentStep={state.currentStep} 
              isProcessing={isProcessing}
              metrics={{
                apis: state.testContext.parsedResult?.endpoints || 0,
                cases: state.testCases.length,
                executed: state.executionResults.length,
                success: state.executionResults.filter((r) => r.status === "success").length,
                failed: state.executionResults.filter((r) => r.status === "failed").length,
              }}
              risks={state.testContext.parsedResult?.failedItems.map((m) => ({ id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15), message: m, type: "error" as const })) || []}
              className="mr-2"
            />

            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
              <History className="w-4.5 h-4.5" />
            </button>
            
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-black/[0.05] flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden shadow-sm">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${state.email.to}`} alt="avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className={cn(
          "flex-1 w-full p-8 transition-all duration-500 relative overflow-hidden",
          state.currentView === "console" 
            ? (isMonitorCollapsed ? "pr-24" : "pr-[320px]")
            : "pr-8"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentView + (state.currentView === "console" ? state.currentStep : "")}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="h-full workbench-container min-h-[600px] flex flex-col"
            >
              <div className="flex-1 overflow-auto custom-scrollbar p-8">
                {renderView()}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 右侧监控面板 - 仅在控制台视图显示 */}
        {state.currentView === "console" && (
          <AgentMonitor
            taskId="TASK-1774597704463"
            currentStep={state.currentStep}
            currentSubtask={INITIAL_STEPS[state.currentStep - 1].name}
            currentAction={isProcessing ? "Agent 正在思考并执行动作..." : "等待用户确认或操作"}
            duration="00:05:48"
            metrics={{
              apis: state.testContext.parsedResult?.endpoints || 0,
              cases: state.testCases.length,
              executed: state.executionResults.length,
              success: state.executionResults.filter((r) => r.status === "success").length,
              failed: state.executionResults.filter((r) => r.status === "failed").length,
              reports: state.report.version,
            }}
            risks={state.testContext.parsedResult?.failedItems.map((m) => ({ id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15), message: m, type: "error" })) || []}
            logs={logs}
            isCollapsed={isMonitorCollapsed}
            onToggleCollapse={() => setIsMonitorCollapsed(!isMonitorCollapsed)}
            onLogClick={(id) => setHighlightedCaseId(id)}
          />
        )}
      </div>
      <SaveToLibraryModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        onSave={handleSaveToLibrary}
        testSuites={state.testSuites}
      />

      <ImportFromLibraryModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportFromLibrary}
        testSuites={state.testSuites}
      />
    </div>
  );
}
