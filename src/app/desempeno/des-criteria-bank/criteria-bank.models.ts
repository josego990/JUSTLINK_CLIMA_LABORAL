export type CriteriaBankQuestionType = 'LIKERT_1_5' | 'ABIERTA';

export interface CriteriaBankQuestion {
  id: string;
  code?: string | null;
  text: string;
  type: CriteriaBankQuestionType;
  suggestedScaleId?: number | null;
  suggestedScaleCode?: string | null;
  suggestedScale: string | null;
  required?: boolean;
  order?: number;
  active?: boolean;
}

export interface CriteriaBankCriterion {
  id: string;
  organizationId: number;
  code: string;
  name: string;
  description: string;
  suggestedDimension: string;
  requiredLevel: number;
  tags: string[];
  active: boolean;
  questions: CriteriaBankQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface CriteriaBankImportQuestion {
  text: string;
  type: CriteriaBankQuestionType;
  suggestedScale: string | null;
}

export interface CriteriaBankImportCriterion {
  code: string;
  name: string;
  description: string;
  suggestedDimension: string;
  requiredLevel: number;
  tags: string[];
  questions: CriteriaBankImportQuestion[];
  sourceRows: number[];
}

export interface CriteriaBankImportResult {
  criteria: CriteriaBankImportCriterion[];
  rowCount: number;
  questionCount: number;
}

export interface CriteriaBankListResponse {
  items: CriteriaBankCriterion[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  summary: {
    activeCriteria: number;
    activeQuestions: number;
  };
  availableTags: Array<{ id: number; name: string }>;
}
