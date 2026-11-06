import { request } from "./client";
import type {
  AnswerSubmissionDto,
  AnswerCheckResultDto,
  ExamScoreDto,
  ExamAttemptDto,
  ExamAttemptDetailDto,
  SaveExamAttemptDto,
} from "../types/answer";

/** Le domande si riconoscono dal numero solo dentro la certificazione. */
const certificationQuery = (certificationId: string) => new URLSearchParams({ certificationId }).toString();

export function checkAnswers(certificationId: string, submissions: AnswerSubmissionDto[]): Promise<AnswerCheckResultDto[]> {
  return request<AnswerCheckResultDto[]>(`/api/results/checkAnswers?${certificationQuery(certificationId)}`, {
    method: "POST",
    body: JSON.stringify(submissions),
  });
}

export function getScore(certificationId: string, submissions: AnswerSubmissionDto[]): Promise<ExamScoreDto> {
  return request<ExamScoreDto>(`/api/results/getScore?${certificationQuery(certificationId)}`, {
    method: "POST",
    body: JSON.stringify(submissions),
  });
}

export function saveAttempt(certificationId: string, attempt: SaveExamAttemptDto): Promise<ExamAttemptDto> {
  return request<ExamAttemptDto>("/api/results/saveAttempt", {
    method: "POST",
    body: JSON.stringify({ ...attempt, certificationId }),
  });
}

export function getAllAttempts(certificationId: string): Promise<ExamAttemptDto[]> {
  return request<ExamAttemptDto[]>(`/api/results/getAllAttempts?${certificationQuery(certificationId)}`);
}

/** Un tentativo dello storico con domande, risposte date e soluzioni. */
export function getAttempt(id: number): Promise<ExamAttemptDetailDto> {
  return request<ExamAttemptDetailDto>(`/api/results/getAttempt/${id}`);
}
