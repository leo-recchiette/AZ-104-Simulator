/** Una certificazione del catalogo, come la restituisce GET api/certifications/getAllCertifications. */
export interface CertificationDto {
  /** Es. 'microsoft': e' anche la chiave di CertificationsByVendor. */
  vendor: string;
  /** Nome della cartella del dataset: e' il certificationId che chiedono gli altri endpoint. */
  id: string;
  questionCount: number;
  /** Unita' della simulazione, non domande: un gruppo conta come una. */
  examQuestionCount: number;
  examTimeLimitMinutes: number;
}

/** Chiave: il vendor (nome della cartella), nell'ordine dell'API. */
export type CertificationsByVendor = Record<string, CertificationDto[]>;
