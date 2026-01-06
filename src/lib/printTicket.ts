import { QueueTicket } from "./queueStore";
import { format } from "date-fns";

/**
 * Generates a clean, robust HTML template for an 80mm thermal printer.
 * Uses @page size: 80mm auto to ensure the printer only prints what's needed.
 */
const generateTicketHTML = (ticket: QueueTicket, logoPath: string) => {
  const serviceName = ticket.serviceType === "A"
    ? "PENDAFTARAN KUNJUNGAN"
    : "INFORMASI & PENGADUAN";

  const fullLogoPath = logoPath.startsWith('http') 
    ? logoPath 
    : window.location.origin + logoPath;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { 
      size: 80mm auto; 
      margin: 0; 
    }
    body { 
      margin: 0; 
      padding: 0; 
      width: 80mm; 
      font-family: 'Arial', sans-serif;
      background: white;
      -webkit-print-color-adjust: exact;
    }
    .container {
      width: 72mm;
      margin: 0 auto;
      padding: 5mm 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .logo { 
      width: 50px; 
      height: 50px; 
      margin-bottom: 5px; 
      object-fit: contain; 
    }
    .title { 
      font-weight: bold; 
      font-size: 14px; 
      line-height: 1.2; 
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    .subtitle {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    .datetime {
      font-size: 10px;
      margin-bottom: 10px;
      color: #333;
    }
    .divider {
      width: 100%;
      border-top: 1.5px dashed black;
      margin: 5px 0;
    }
    .number-box {
      width: 100%;
      padding: 5px 0;
      margin: 5px 0;
    }
    .number { 
      font-weight: bold; 
      font-size: 64px; 
      line-height: 1;
      margin: 0;
    }
    .service { 
      font-weight: bold; 
      font-size: 12px; 
      margin-top: 5px;
      text-transform: uppercase;
    }
    .thanks { 
      font-size: 10px; 
      font-style: italic; 
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${fullLogoPath}" class="logo" />
    <div class="title">KEMENTERIAN IMIGRASI<br/>DAN PEMASYARAKATAN</div>
    <div class="subtitle">RUTAN KELAS I DEPOK</div>
    <div class="datetime">
      ${format(ticket.createdAt, "dd/MM/yyyy")} | ${format(ticket.createdAt, "HH:mm")} WIB
    </div>
    
    <div class="divider"></div>
    <div class="number-box">
      <h1 class="number">${ticket.formattedNumber}</h1>
    </div>
    <div class="divider"></div>
    
    <div class="service">${serviceName}</div>
    <div class="thanks">~ Terimakasih Telah Menunggu ~</div>
  </div>
</body>
</html>
`;
};

export const printTicketDirectly = async (ticket: QueueTicket) => {
  const logoPath = "/Kementerian Imigrasi.png";
  const html = generateTicketHTML(ticket, logoPath);

  // 1. SILENT PRINTING (ELECTRON)
  if (window.electron && window.electron.printSilent) {
    try {
      const result = await window.electron.printSilent({ html });
      if (result.success) return;
    } catch (error) {
      console.error("Electron print error:", error);
    }
  }

  // 2. BROWSER PRINTING (FALLBACK)
  // We use an iframe to contain the print job and force styles correctly.
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "100%";
  iframe.style.bottom = "100%";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error("Could not create iframe document for printing");
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Helper to wait for images
  const waitForImages = () => {
    const images = doc.getElementsByTagName("img");
    const promises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    return Promise.all(promises);
  };

  try {
    await waitForImages();
    
    // Small delay to ensure rendering is complete
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Remove iframe after print dialog is handled
        // Note: print() is blocking in most browsers until dialog is closed
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      } catch (printError) {
        console.error("Print execution error:", printError);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }
    }, 500);
  } catch (error) {
    console.error("Error preparing ticket for print:", error);
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
};