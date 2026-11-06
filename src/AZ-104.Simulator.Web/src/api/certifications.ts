import { request } from "./client";
import type { CertificationsByVendor } from "../types/certification";

export function getAllCertifications(): Promise<CertificationsByVendor> {
  return request<CertificationsByVendor>("/api/certifications/getAllCertifications");
}
