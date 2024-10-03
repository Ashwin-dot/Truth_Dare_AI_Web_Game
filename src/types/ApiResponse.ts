import { Message } from "@/model/User";

// export interface ApiResponse {
//   success: boolean;
//   message: string;
//   isAcceptingMessages?: boolean;
//   messages?: Array<Message>
// };

export interface ISummaryBody {
  text: string;
  type: "wikipedia_article" | "financial_report" | "academic_paper";
}

export interface ISummary {
  text: string;
}

export interface IAIResponseData {
  summaries: ISummary[];
}

export interface AIResponse {
  status: "success" | "failed";
  message: string;
  data?: IAIResponseData;
}
