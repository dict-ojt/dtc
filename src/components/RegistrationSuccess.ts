import { copyToClipboard, downloadQRImage, generateQRCode, setButtonLoading } from "../utils";

export function showRegistrationComplete(userId: string, onGoToCheckIn: () => void): void {
	const qrUrl = generateQRCode(`${window.location.origin}${window.location.pathname}?id=${userId}`);

	const modal = document.createElement("div");
	modal.className = "confirmation-modal";
	modal.innerHTML = `
    <div class="confirmation-content" style="max-width: 550px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <svg width="64" height="64" fill="#10b981" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
      <h3 style="font-size: 22px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 8px;">Registration Successful!</h3>
      <p style="color: #64748b; text-align: center; margin-bottom: 20px; font-size: 15px;">Your registration is complete. Use this ID to check in.</p>
      
      <!-- User ID Display with Copy -->
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <p style="color: #0369a1; font-size: 12px; font-weight: 600; margin-bottom: 12px;">YOUR USER ID</p>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <p style="color: #0c4a6e; font-size: 36px; font-weight: 700; font-family: monospace; letter-spacing: 3px; flex: 1;">${userId}</p>
          <button type="button" class="copy-btn" id="copyUserIdBtn">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            Copy
          </button>
        </div>
        <button type="button" class="download-btn" id="quickCheckInBtn" style="margin: 0; width: 100%; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
          Use for Quick Check-In
        </button>
      </div>

      <!-- QR Code -->
      <div style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
        <p style="color: #64748b; font-size: 12px; font-weight: 600; margin-bottom: 12px;">📱 SCAN THIS QR CODE</p>
        <img id="qrCodeImage" src="${qrUrl}" alt="Check-in QR Code" style="width: 200px; height: 200px; margin: 0 auto; display: block;">
        <div style="display: flex; gap: 8px; justify-content: center; margin-top: 12px; flex-wrap: wrap;">
          <button type="button" class="download-btn" id="downloadQrBtn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Download QR Image
          </button>
        </div>
      </div>

      <!-- Instructions -->
      <div style="background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); border: 2px solid #a855f7; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <p style="color: #6b21a8; font-size: 12px; font-weight: 600; margin-bottom: 12px;">✓ IMPORTANT:</p>
        <ul style="color: #7c3aed; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Save your User ID for future visits</li>
          <li>Share the QR code to auto-fill check-in</li>
          <li>Scan the code or use your ID to check in</li>
        </ul>
      </div>

      <div class="confirmation-buttons" style="grid-template-columns: 1fr;">
        <button type="button" class="confirm-yes" id="goToCheckInBtn" style="margin: 0; width: 100%; padding: 14px;">
          ✓ Go to Check-In
        </button>
      </div>
    </div>
  `;
	document.body.appendChild(modal);

	// Setup button handlers
	document.getElementById("copyUserIdBtn")?.addEventListener("click", async () => {
		const copyBtn = document.getElementById("copyUserIdBtn") as HTMLButtonElement | null;
		try {
			setButtonLoading(copyBtn, true, "Copying...");
			await copyToClipboard(userId);
		} finally {
			setButtonLoading(copyBtn, false);
		}
	});

	document.getElementById("downloadQrBtn")?.addEventListener("click", async () => {
		const downloadBtn = document.getElementById("downloadQrBtn") as HTMLButtonElement | null;
		try {
			setButtonLoading(downloadBtn, true, "Downloading...");
			await downloadQRImage(qrUrl, `qr-code-${userId}.png`);
		} finally {
			setButtonLoading(downloadBtn, false);
		}
	});

	document.getElementById("quickCheckInBtn")?.addEventListener("click", () => {
		modal.remove();
		onGoToCheckIn();
	});

	document.getElementById("goToCheckInBtn")?.addEventListener("click", () => {
		modal.remove();
		onGoToCheckIn();
	});
}
