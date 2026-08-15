export type AiAssistantModuleContext = 'CLIMA' | 'DESEMPENO' | 'GENERAL';

export interface AiAssistantEntityContext {
  idModelo: number | null;
  idFlujo: number | null;
}

export interface AiAssistantChatRequest {
  conversationId: string | null;
  message: string;
  moduleContext: AiAssistantModuleContext;
  route: string | null;
  organizacionId: number | null;
  entityContext: AiAssistantEntityContext;
  locale: string;
}

export interface AiAssistantClassification {
  allowed: boolean;
  domain: AiAssistantModuleContext | 'OUT_OF_SCOPE';
  intent: string;
  confidence: number;
}

export interface AiAssistantChatData {
  conversationId: string;
  answer: string;
  answerText?: string;
  answerFormat?: 'html' | 'text' | string;
  classification: AiAssistantClassification;
  needsClarification: boolean;
  suggestedActions: unknown[];
}

export interface AiAssistantUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface AiAssistantChatResponse {
  ok: boolean;
  data: AiAssistantChatData;
  meta?: {
    model?: string;
    classifierModel?: string;
    promptVersion?: string;
    responseId?: string | null;
    usage?: AiAssistantUsage;
    latencyMs?: number;
  };
}

export interface AiAssistantHistoryMessage {
  id: number | string;
  role: 'USER' | 'ASSISTANT' | string;
  content: string;
  contentText?: string;
  contentFormat?: 'html' | 'text' | string;
  classification?: AiAssistantClassification | null;
  intent?: string | null;
  createdAt?: string | null;
}

export interface AiAssistantConversation {
  conversationId: string;
  organizacionId: number;
  domain: string;
  title: string;
  status: string;
  totalMessages: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  expiresAt?: string | null;
}

export interface AiAssistantConversationResponse {
  ok: boolean;
  data: {
    conversation: AiAssistantConversation;
    messages: AiAssistantHistoryMessage[];
    historyLimit: number;
  };
  message?: string | null;
}

export interface AiAssistantArchiveResponse {
  ok: boolean;
  data: {
    conversationId: string;
    status: string;
  };
  message?: string | null;
}
