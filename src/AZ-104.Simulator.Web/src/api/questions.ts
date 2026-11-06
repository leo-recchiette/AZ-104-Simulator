import { request } from "./client";
import type { DrawMode, QuestionDto, QuestionType } from "../types/question";

export function getExam(certificationId: string, count: number, draw: DrawMode, type?: QuestionType): Promise<QuestionDto[]> {
  const params = new URLSearchParams({ certificationId, count: String(count), draw });
  if (type) params.set("type", type);
  return request<QuestionDto[]>(`/api/questions/getExam?${params}`);
}
