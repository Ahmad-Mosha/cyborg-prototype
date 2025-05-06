export type MessageType = {
  type: "user" | "cyborg";
  text: string;
  time: string;
};

export interface VideoAnalysisResult {
  exercise: string;
  overall_performance: string;
  error_rate: number;
  errors: string[];
}
