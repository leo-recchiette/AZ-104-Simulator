import { request } from "./client";
import { CERTIFICATION_ID } from "../constants";
import type {
  AnswerSubmissionDto,
  AnswerCheckResultDto,
  ExamScoreDto,
  ExamAttemptDto,
  ExamAttemptDetailDto,
  SaveExamAttemptDto,
} from "../types/answer";

/** Le domande si riconoscono dal numero solo dentro la certificazione. */
const CERTIFICATION_QUERY = new URLSearchParams({ certificationId: CERTIFICATION_ID }).toString();

export function checkAnswers(submissions: AnswerSubmissionDto[]): Promise<AnswerCheckResultDto[]> {
  return request<AnswerCheckResultDto[]>(`/api/results/checkAnswers?${CERTIFICATION_QUERY}`, {
    method: "POST",
    body: JSON.stringify(submissions),
  });
}

export function getScore(submissions: AnswerSubmissionDto[]): Promise<ExamScoreDto> {
  return request<ExamScoreDto>(`/api/results/getScore?${CERTIFICATION_QUERY}`, {
    method: "POST",
    body: JSON.stringify(submissions),
  });
}

export function saveAttempt(attempt: SaveExamAttemptDto): Promise<ExamAttemptDto> {
  return request<ExamAttemptDto>("/api/results/saveAttempt", {
    method: "POST",
    body: JSON.stringify({ ...attempt, certificationId: CERTIFICATION_ID }),
  });
}

export function getAllAttempts(): Promise<ExamAttemptDto[]> {
  return request<ExamAttemptDto[]>(`/api/results/getAllAttempts?${CERTIFICATION_QUERY}`);
}

/** Un tentativo dello storico con domande, risposte date e soluzioni. */
export function getAttempt(id: number): Promise<ExamAttemptDetailDto> {
  return request<ExamAttemptDetailDto>(`/api/results/getAttempt/${id}`);
}
