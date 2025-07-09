export class NgxDatablex{
  id_quiz: number;
  type: string;
  name: string;
  label: string;
  required: string;
  score: string;
  value_correct: string;
  file_type: string;

  constructor(paramsList: NgxDatablex) {
    {
      this.id_quiz = paramsList.id_quiz || 0;
      this.type = paramsList.type || '';
      this.name = paramsList.name || '';
      this.label = paramsList.label || '';
      this.required = paramsList.required || '';
      this.score = paramsList.score || '';
      this.value_correct = paramsList.value_correct || '';
      this.file_type = paramsList.file_type || '';
    }
  }

}
