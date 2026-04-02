export const ASSISTANT_STANDARDS = {
  version: "1.0.0",
  lastUpdated: "2026-03-28",
  generationCriteria: [
    {
      title: "接口覆盖率 (Interface Coverage)",
      description: "确保 100% 覆盖已识别的 API 端点，包括所有 HTTP 方法。",
      standard: ">= 95%"
    },
    {
      title: "用例多样性 (Case Diversity)",
      description: "包含正向流程、边界值测试、异常输入测试及安全性校验。",
      standard: "正向:异常 = 4:6"
    },
    {
      title: "优先级分配 (Priority Logic)",
      description: "核心业务流程标记为 P0，辅助功能为 P1，边缘场景为 P2。",
      standard: "业务驱动"
    },
    {
      title: "断言质量 (Assertion Quality)",
      description: "每个用例至少包含 2 个关键断言（状态码 + 业务字段）。",
      standard: "双重校验"
    }
  ],
  agentConditions: {
    model: "Gemini 3.1 Pro",
    temperature: 0.2,
    contextWindow: "128k tokens",
    reasoningLevel: "High"
  },
  feedbackLoop: "支持实时反馈与用例动态修正，确保测试意图的准确传达。"
};
