import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  CertificateFrontHTML,
  CertificateBackHTML,
  CERT_W,
  CERT_H,
  type CertificateData,
} from "@/components/CertificateHTML";

async function ensureFontsLoaded(): Promise<void> {
  const existing = document.querySelector<HTMLLinkElement>(
    'link[href*="fonts.googleapis.com/css2"]'
  );
  if (!existing) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    await new Promise((r) => setTimeout(r, 600));
  }
  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 300));
}

function createOffscreenContainer(): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;left:-9999px;top:0;width:${CERT_W}px;height:${CERT_H}px;`;
  document.body.appendChild(el);
  return el;
}

export async function generateCertificatePDF(
  data: CertificateData
): Promise<void> {
  await ensureFontsLoaded();

  const frontEl = createOffscreenContainer();
  const backEl = createOffscreenContainer();

  const frontRoot = createRoot(frontEl);
  const backRoot = createRoot(backEl);

  frontRoot.render(<CertificateFrontHTML data={data} />);
  backRoot.render(<CertificateBackHTML data={data} />);

  await new Promise((r) => setTimeout(r, 800));
  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 400));

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const opts: any = {
    width: CERT_W,
    height: CERT_H,
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#f8fafc",
  };

  const frontCanvas = await html2canvas(frontEl, opts);
  const backCanvas = await html2canvas(backEl, opts);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  frontRoot.unmount();
  backRoot.unmount();
  document.body.removeChild(frontEl);
  document.body.removeChild(backEl);

  const pdfW = 297;
  const pdfH = 210;
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  pdf.addImage(
    frontCanvas.toDataURL("image/png"),
    "PNG",
    0,
    0,
    pdfW,
    pdfH
  );

  pdf.addPage("a4", "landscape");
  pdf.addImage(
    backCanvas.toDataURL("image/png"),
    "PNG",
    0,
    0,
    pdfW,
    pdfH
  );

  pdf.setProperties({
    title: `Certificado - ${data.studentName}`,
    subject: data.course,
    author: "Engrena Cursos",
  });

  pdf.save(`certificado-${data.validationCode}.pdf`);
}
