import { request } from "./client";
import type { DrawMode, QuestionDto } from "../types/question";

export function getExam(certificationId: string, count: number, draw: DrawMode): Promise<QuestionDto[]> {
  const params = new URLSearchParams({ certificationId, count: String(count), draw });
  return request<QuestionDto[]>(`/api/questions/getExam?${params}`);
}
