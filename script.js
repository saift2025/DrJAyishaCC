/* Utilities */
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

const els = {
  medicine: document.getElementById("medicine"),
  fees: document.getElementById("fees"),
  prepPercent: document.getElementById("prepPercent"),
  transportPercent: document.getElementById("transportPercent"),
  medicineOut: document.getElementById("medicineOut"),
  feesOut: document.getElementById("feesOut"),
  prepOut: document.getElementById("prepOut"),
  transOut: document.getElementById("transOut"),
  prepPctOut: document.getElementById("prepPctOut"),
  transPctOut: document.getElementById("transPctOut"),
  totalOut: document.getElementById("totalOut"),
  resetBtn: document.getElementById("resetBtn"),
  copyBtn: document.getElementById("copyBtn"),
  copyStatus: document.getElementById("copyStatus"),
  year: document.getElementById("year"),
  qrImage: document.getElementById("qrImage"),
  downloadQR: document.getElementById("downloadQR"),
  printQR: document.getElementById("printQR"),
};

function sanitizeNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function calculate() {
  const medicine = sanitizeNumber(els.medicine.value);
  const fees = sanitizeNumber(els.fees.value);
  const prepPct = sanitizeNumber(els.prepPercent.value);
  const transPct = sanitizeNumber(els.transportPercent.value);

  const preparation = (prepPct / 100) * fees;
  const transport = (transPct / 100) * fees;
  const total = medicine + fees + preparation + transport;

  els.medicineOut.textContent = medicine > 0 ? INR.format(medicine) : "—";
  els.feesOut.textContent = fees > 0 ? INR.format(fees) : "—";
  els.prepOut.textContent = preparation > 0 ? INR.format(preparation) : (fees > 0 ? INR.format(0) : "—");
  els.transOut.textContent = transport > 0 ? INR.format(transport) : (fees > 0 ? INR.format(0) : "—");

  els.prepPctOut.textContent = prepPct > 0 ? `${prepPct}%` : "—";
  els.transPctOut.textContent = transPct > 0 ? `${transPct}%` : "—";

  els.totalOut.textContent = INR.format(total);
}

function resetForm() {
  els.medicine.value = "";
  els.fees.value = "";
  els.prepPercent.value = "";
  els.transportPercent.value = "";
  calculate();
  els.copyStatus.textContent = "";
}

async function copySummary() {
  const med = sanitizeNumber(els.medicine.value);
  const fee = sanitizeNumber(els.fees.value);
  const prepPct = sanitizeNumber(els.prepPercent.value);
  const transPct = sanitizeNumber(els.transportPercent.value);
  const preparation = (prepPct / 100) * fee;
  const transport = (transPct / 100) * fee;
  const total = med + fee + preparation + transport;

  const lines = [
    `Dr. J Ayisha • Cost Summary`,
    `Medicine: ${INR.format(med)}`,
    `Fees: ${INR.format(fee)}`,
    `Preparation (${prepPct}% of Fees): ${INR.format(preparation)}`,
    `Transport & Packaging (${transPct}% of Fees): ${INR.format(transport)}`,
    `Total: ${INR.format(total)}`
  ];

  const text = lines.join("\n");
  try {
    await navigator.clipboard.writeText(text);
    els.copyStatus.textContent = "Summary copied to clipboard.";
    setTimeout(() => (els.copyStatus.textContent = ""), 2500);
  } catch {
    els.copyStatus.textContent = "Copy failed. Select and copy manually.";
    setTimeout(() => (els.copyStatus.textContent = ""), 2500);
  }
}

/* QR for current page via Google Chart API */
function setQR() {
  const url = window.location.href;
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(url)}&choe=UTF-8`;
  els.qrImage.src = qrUrl;
}

function downloadQR() {
  const link = document.createElement("a");
  link.href = els.qrImage.src;
  link.download = "dr-ayisha-page-qr.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printQR() {
  const w = window.open("", "_blank", "width=420,height=480");
  const img = els.qrImage.src;
  w.document.write(`
    <html>
      <head><title>QR • Dr. J Ayisha</title></head>
      <body style="display:grid;place-items:center;margin:0;padding:24px;font-family:system-ui">
        <img src="${img}" style="width:300px;height:300px"/>
        <p style="margin-top:8px;color:#334">Scan to open: ${window.location.href}</p>
        <script>window.onload = () => setTimeout(() => window.print(), 300);<\/script>
      </body>
    </html>
  `);
  w.document.close();
}

/* Wire up */
["input", "change"].forEach(evt => {
  els.medicine.addEventListener(evt, calculate);
  els.fees.addEventListener(evt, calculate);
  els.prepPercent.addEventListener(evt, calculate);
  els.transportPercent.addEventListener(evt, calculate);
});

els.resetBtn.addEventListener("click", resetForm);
els.copyBtn.addEventListener("click", copySummary);
els.downloadQR.addEventListener("click", downloadQR);
els.printQR.addEventListener("click", printQR);

els.year.textContent = new Date().getFullYear();

calculate();
setQR();
