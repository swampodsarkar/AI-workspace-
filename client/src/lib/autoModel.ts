export interface ToolConfig {
  model: string
  systemPrompt: string
  label: string
  icon: string
  credits: number
}

const tools: Record<string, ToolConfig> = {
  'code': {
    model: 'deepseek/deepseek-coder',
    systemPrompt: 'You are an expert programmer. Generate clean, efficient code with comments. Return ONLY the code, no explanations unless asked.',
    label: 'DeepSeek Coder',
    icon: 'Code',
    credits: 2
  },
  'email': {
    model: 'google/gemini-2.0-flash-exp:free',
    systemPrompt: 'You are a professional email writer. Write clear, effective emails. Return JSON with "subject" and "body" fields.',
    label: 'Gemini Flash',
    icon: 'Mail',
    credits: 1
  },
  'document': {
    model: 'google/gemini-2.0-flash-exp:free',
    systemPrompt: 'You are a professional document editor. Write and improve documents with clear structure and formatting.',
    label: 'Gemini Flash',
    icon: 'PenSquare',
    credits: 1
  },
  'meme': {
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    systemPrompt: 'You are a meme generator. Generate funny short memes in the requested style. Return ONLY the meme text (2-4 lines max). Use line breaks for punchline.',
    label: 'Llama 3.2',
    icon: 'Image',
    credits: 1
  },
  'image': {
    model: 'google/gemini-2.0-flash-exp:free',
    systemPrompt: 'Generate a detailed image prompt from the user request. Return ONLY the prompt text, no explanations.',
    label: 'Gemini Flash',
    icon: 'Image',
    credits: 4
  },
  'excel': {
    model: 'qwen/qwen2.5-72b-instruct:free',
    systemPrompt: 'You are a data analyst. Modify tabular data based on user queries. Return ONLY a JSON array of arrays.',
    label: 'Qwen 2.5',
    icon: 'Table',
    credits: 1
  },
  'analysis': {
    model: 'qwen/qwen2.5-72b-instruct:free',
    systemPrompt: 'You are a senior data analyst. Provide clear, concise analysis with insights and recommendations. Use bullet points and numbers.',
    label: 'Qwen 2.5',
    icon: 'BarChart3',
    credits: 1
  },
  'website': {
    model: 'deepseek/deepseek-coder',
    systemPrompt: 'You are a web developer. Generate complete HTML pages with inline CSS/JS. Use modern design, gradients, and responsive layout. Return ONLY valid HTML.',
    label: 'DeepSeek Coder',
    icon: 'Globe',
    credits: 2
  },
  'pdf': {
    model: 'google/gemini-2.0-flash-exp:free',
    systemPrompt: 'You are a PDF document expert. Help users with PDF-related tasks and document processing.',
    label: 'Gemini Flash',
    icon: 'FileText',
    credits: 1
  },
}

export function getToolConfig(toolId: string): ToolConfig {
  return tools[toolId] || {
    model: 'openrouter/auto',
    systemPrompt: 'You are a helpful AI assistant.',
    label: 'Auto',
    icon: 'Bot',
    credits: 1
  }
}

export function getToolModel(toolId: string): string {
  return getToolConfig(toolId).model
}

export function getToolSystemPrompt(toolId: string): string {
  return getToolConfig(toolId).systemPrompt
}

export function getToolLabel(toolId: string): string {
  return getToolConfig(toolId).label
}

export function getToolCredits(toolId: string): number {
  return getToolConfig(toolId).credits
}
