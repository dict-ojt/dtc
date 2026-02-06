import { copyToClipboard, downloadQRImage, generateQRCode, setButtonLoading } from "../utils";

export function showRegistrationComplete(userId: string, onGoToCheckIn: () => void): void {
	const qrUrl = generateQRCode(`${window.location.origin}${window.location.pathname}?id=${userId}`);

	const modal = document.createElement("div");
	modal.className = "confirmation-modal";
	modal.innerHTML = `
    <div class="success-modal-content">
      <!-- Success Header -->
      <div class="success-header">
        <div class="success-icon-container">
          <div class="success-icon-ring"></div>
          <div class="success-icon">
            <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
        </div>
        <h3 class="success-title">Registration Complete!</h3>
        <p class="success-subtitle">Welcome to DICT Data Training Center</p>
      </div>
      
      <!-- User ID Card -->
      <div class="user-id-card">
        <div class="user-id-label">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
          YOUR USER ID
        </div>
        <div class="user-id-value-container">
          <span class="user-id-value">${userId}</span>
          <button type="button" class="copy-id-btn" id="copyUserIdBtn">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy
          </button>
        </div>
        <button type="button" class="quick-checkin-btn" id="quickCheckInBtn">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
          </svg>
          Use for Quick Check-In
        </button>
      </div>

      <!-- QR Code Section -->
      <div class="qr-code-card">
        <div class="qr-code-header">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-1h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
          </svg>
          Your QR Code
        </div>
        <div class="qr-code-wrapper">
          <img id="qrCodeImage" src="${qrUrl}" alt="Check-in QR Code" class="qr-code-image">
        </div>
        <p class="qr-code-hint">Scan this code for instant check-in</p>
        <button type="button" class="download-qr-btn" id="downloadQrBtn">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download QR Image
        </button>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <div class="tips-header">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
          </svg>
          Quick Tips
        </div>
        <ul class="tips-list">
          <li>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Save your User ID for future visits
          </li>
          <li>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Screenshot or download your QR code
          </li>
          <li>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Use QR or ID for faster check-in
          </li>
        </ul>
      </div>

      <!-- Action Button -->
      <button type="button" class="go-checkin-btn" id="goToCheckInBtn">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Continue to Check-In
      </button>
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
