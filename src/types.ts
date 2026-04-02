export type StepStatus = "not-started" | "in-progress" | "pending-confirmation" | "completed" | "error";

export interface Step {
  id: number;
  name: string;
  status: StepStatus;
  duration?: string;
  outputCount?: number;
}

export type TestCaseStatus = "draft" | "enabled" | "maintenance" | "archived";
export type TestSuiteStatus = "draft" | "enabled" | "maintenance" | "archived";

export interface TestCase {
  id: string;
  suiteId: string;
  name: string;
  priority: "P0" | "P1" | "P2" | "P3";
  type: "功能" | "异常" | "边界" | "鉴权" | "性能前置" | string;
  status: TestCaseStatus;
  
  // Request Definition
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  authType?: string;
  preconditions?: string;

  // Assertions
  assertions?: {
    statusCode?: string;
    fields?: { field: string; expected: any; operator: string }[];
    business?: string[];
    performance?: { maxDuration: number };
    custom?: string;
  };

  // Execution Info
  lastExecutionResult?: "success" | "failed" | "partial" | "not-executed";
  lastExecutionTime?: string;
  
  // Metadata
  source: "AI生成" | "人工编辑" | "引用而来" | string;
  version?: string;
  citationCount?: number;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  module: string;
  tags: string[];
  status: TestSuiteStatus;
  createdAt: string;
  updatedAt: string;
  
  // Stats
  caseCount: number;
  interfaceCount: number;
  
  // Execution Info
  lastExecution?: {
    time: string;
    result: "success" | "failed" | "partial" | "not-executed";
    environment: string;
    passRate: number;
  };
  
  // Citations
  citations: {
    console: number;
    flow: number;
    reports: number;
    emails: number;
  };

  cases?: TestCase[];
}

export type FailureType = "鉴权失败" | "参数错误" | "超时" | "断言失败" | "其他";

export interface ExecutionResult {
  id: string;
  testCaseId: string;
  status: "success" | "failed" | "skipped";
  responseCode?: number;
  duration?: number;
  request?: {
    url: string;
    headers: any;
    body: any;
  };
  response?: any;
  errorReason?: string;
  failureType?: FailureType;
  responseData?: any;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  step?: number;
  testCaseId?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  state: AppState;
}

export interface GlobalState {
  projects: Project[];
  activeProjectId: string | null;
}

export type ViewType = "console" | "library" | "reports" | "logs";

export interface ReportSummary {
  id: string;
  timestamp: string;
  testSuiteName: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  duration: number;
  status: "success" | "failed" | "partial";
}

export interface AppState {
  currentView: ViewType;
  currentStep: number;
  isAutoExecuting: boolean;
  steps: Step[];
  testContext: {
    docText: string;
    businessContext: string;
    generationPlan?: string;
    regenerationRequirements?: string;
    reportSpecifications?: string;
    authRequirements: {
      apiName: string;
      params: { key: string; value: string }[];
    }[];
    parsedResult?: {
      endpoints: number;
      docs: number;
      failedItems: string[];
      authDetected: string;
      completeness: number;
    };
  };
  selectedCaseIds: string[];
  testCases: TestCase[];
  testSuites: TestSuite[];
  executionConfig: {
    baseUrl: string;
    headers: Record<string, string>;
    auth: string;
    timeout: number;
    retries: number;
  };
  executionResults: ExecutionResult[];
  report: {
    summary: string;
    risks: string[];
    recommendations: string[];
    version: number;
  };
  reports: ReportSummary[];
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
}
