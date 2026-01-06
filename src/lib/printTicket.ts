import { QueueTicket } from "./queueStore";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import jsPDF from "jspdf";

const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), false);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
};

export const printTicketDirectly = async (ticket: QueueTicket) => {
  const logoPath = "/Kementerian Imigrasi.png";

  if (window.electron && window.electron.printSilent) {
    const html = generateTicketHTML(ticket, logoPath);
    try {
      const result = await window.electron.printSilent({ html });
      if (result.success) return;
    } catch (error) {
      console.error("Electron print error:", error);
    }
  }

  // ================= JSPDF: SUPER COMPACT (35mm) =================
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 35], // Tinggi dipangkas ke 35mm
  });

  const CENTER_X = 36.5;
  const SAFE_WIDTH = 60;

  try {
    const logoBase64 = await getBase64ImageFromUrl(logoPath);
    // Logo diperbesar ke 12x12mm, posisi y sangat atas (1mm)
    doc.addImage(logoBase64, "PNG", CENTER_X - 6, 1, 12, 12);
  } catch (e) {
    console.error("Logo error", e);
  }

  // Y dimulai sangat mepet setelah logo
  let y = 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11); // Font diperbesar
  doc.text("KEMENTERIAN IMIGRASI\nDAN PEMASYARAKATAN", CENTER_X, y, {
    align: "center",
    maxWidth: SAFE_WIDTH,
    lineHeightFactor: 0.9
  });

  y += 7.5;
  doc.setFontSize(10); // Font diperbesar
  doc.text("RUTAN KELAS I DEPOK", CENTER_X, y, { align: "center" });

  y += 3.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5); // Font diperbesar
  const timeStr = `${format(ticket.createdAt, "dd/MM/yyyy")} | ${format(ticket.createdAt, "HH:mm")} WIB`;
  doc.text(timeStr, CENTER_X, y, { align: "center" });

  // Garis putus-putus sangat mepet
  y += 2.5;
  doc.setLineDashPattern([1, 1], 0);
  doc.line(CENTER_X - 28, y, CENTER_X + 28, y);

  // Nomor Antrian (Jumbo & Mepet)
  y += 9.5;
  doc.setFontSize(56); // Font diperbesar maksimal
  doc.setFont("helvetica", "bold");
  doc.text(ticket.formattedNumber, CENTER_X, y, { align: "center" });

  y += 1.5;
  doc.line(CENTER_X - 28, y, CENTER_X + 28, y);

  // Footer sangat mepet bawah
  y += 4.5;
  const serviceName = ticket.serviceType === "A"
    ? "PENDAFTARAN KUNJUNGAN"
    : "INFORMASI & PENGADUAN";

  doc.setFontSize(9);
  doc.text(serviceName, CENTER_X, y, { align: "center", maxWidth: SAFE_WIDTH });

  y += 3.5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text("~ Terimakasih Telah Menunggu ~", CENTER_X, y, { align: "center" });

  const pdfBlob = doc.output("blob");
  const pdfURL = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "0"; iframe.style.height = "0";
  iframe.src = pdfURL;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(pdfURL);
      }, 2000);
    }, 500);
  };
};

// ================= HTML: SUPER COMPACT (FOR ELECTRON) =================
const generateTicketHTML = (ticket: QueueTicket, logoPath: string) => {
  const serviceName = ticket.serviceType === "A"
    ? "PENDAFTARAN KUNJUNGAN"
    : "INFORMASI & PENGADUAN";

  const fullLogoPath = window.location.origin + logoPath;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @page { size: 80mm auto; margin: 0; }
    body { margin: 0; padding: 0; width: 80mm; display: flex; justify-content: center; background: white; }
    .container {
      width: 62mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      font-family: Arial, sans-serif;
      padding: 1mm 0; /* Padding sangat tipis */
      margin-left: -6mm; 
    }
    .logo { width: 45px; height: 45px; margin-bottom: 0px; object-fit: contain; }
    .title { font-weight: bold; font-size: 15px; line-height: 1; margin-bottom: 2px; }
    .number { 
      font-weight: bold; font-size: 72px; line-height: 0.9; margin: 2px 0;
      border-top: 1.5px dashed black; border-bottom: 1.5px dashed black;
      padding: 2px 0; width: 100%;
    }
    .label { font-weight: bold; font-size: 13px; }
    .service { font-weight: bold; font-size: 11px; margin-top: 2px; }
    .thanks { font-size: 9.5px; font-style: italic; margin-top: 1px; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${fullLogoPath}" class="logo" />
    <div class="title">KEMENTERIAN IMIGRASI<br/>DAN PEMASYARAKATAN</div>
    <div style="font-weight:bold; font-size:12px;">RUTAN KELAS I DEPOK</div>
    <div style="font-size:10px;">
      ${format(ticket.createdAt, "dd/MM/yyyy")} | ${format(ticket.createdAt, "HH:mm")} WIB
    </div>
    
    <div class="number">${ticket.formattedNumber}</div>
    
    <div class="service">${serviceName}</div>
    <div class="thanks">~ Terimakasih Telah Menunggu ~</div>
  </div>
</body>
</html>
`;
};