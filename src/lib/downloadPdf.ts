function safeStudentName(studentName: string): string {
  return studentName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function buildCertificatePdfFilename(
  codigo: string,
  studentName: string
): string {
  return `certificado_${safeStudentName(studentName)}_${codigo}.pdf`;
}

export async function downloadCertificatePdf(
  codigo: string,
  studentName: string
): Promise<void> {
  const res = await fetch(`/api/certificados/${encodeURIComponent(codigo)}/pdf`);
  if (!res.ok) throw new Error("Erro ao gerar PDF");

  const blob = await res.blob();
  triggerBlobDownload(blob, buildCertificatePdfFilename(codigo, studentName));
}

export function buildCarteirinhaPdfFilename(
  codigo: string,
  studentName: string
): string {
  return `carteirinha_${safeStudentName(studentName)}_${codigo}.pdf`;
}

export async function downloadCarteirinhaPdf(
  codigo: string,
  studentName: string
): Promise<void> {
  const res = await fetch(
    `/api/certificados/${encodeURIComponent(codigo)}/carteirinha/pdf`
  );
  if (!res.ok) throw new Error("Erro ao gerar PDF da carteirinha");

  const blob = await res.blob();
  triggerBlobDownload(blob, buildCarteirinhaPdfFilename(codigo, studentName));
}
