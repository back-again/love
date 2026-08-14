export interface QuizOption {
  text: string;
  trait: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}
