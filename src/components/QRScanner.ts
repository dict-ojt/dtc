import { showToast } from "../utils";

export function QRScanner(): string {
	return `
    <div id="qrScanSection" class="tab-content">
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-1h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">QR Code Scanner</h2>
        </div>

        <!-- Upload Area -->
        <div id="uploadArea" class="upload-area">
          <div class="upload-content">
            <svg width="64" height="64" fill="#0ea5e9" viewBox="0 0 24 24" style="margin: 0 auto 16px; display: block; opacity: 0.5;">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <p style="font-size: 18px; font-weight: 600; color: #0c4a6e; margin-bottom: 8px;">Drag and drop QR code image</p>
            <p style="color: #64748b; margin-bottom: 12px;">or click to browse</p>
            <input type="file" id="qrFileInput" accept="image/*" style="display: none;">
          </div>
          <div class="upload-loading" aria-live="polite">
            <span class="spinner" aria-hidden="true"></span>
            <span>Scanning QR code...</span>
          </div>
        </div>

        <!-- Result Area -->
        <div id="qrResultContainer" style="display: none; margin-top: 24px;">
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; padding: 24px; text-align: center;">
            <svg width="48" height="48" fill="#10b981" viewBox="0 0 24 24" style="margin: 0 auto 16px; display: block;">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <p style="font-size: 16px; font-weight: 600; color: #065f46; margin-bottom: 12px;">QR Code Recognized!</p>
            <p id="qrResultText" style="font-size: 14px; color: #059669; word-break: break-all; margin-bottom: 16px; font-family: monospace;">User ID: AB-12345</p>
            <button id="useQrBtn" type="button" class="download-btn" style="margin: 0 auto; display: flex; justify-content: center;">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
              Use This ID for Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function setupQRScanner(onQRDetected: (userId: string) => void): void {
	const uploadArea = document.getElementById("uploadArea");
	const qrFileInput = document.getElementById("qrFileInput") as HTMLInputElement;
	const useQrBtn = document.getElementById("useQrBtn");

	let currentQRUserId: string | null = null;

	uploadArea?.addEventListener("click", () => qrFileInput?.click());
	uploadArea?.addEventListener("dragover", (e) => {
		e.preventDefault();
		uploadArea.classList.add("dragover");
	});
	uploadArea?.addEventListener("dragleave", () => uploadArea.classList.remove("dragover"));
	uploadArea?.addEventListener("drop", (e) => {
		e.preventDefault();
		uploadArea.classList.remove("dragover");
		const files = (e as DragEvent).dataTransfer?.files;
		if (files && files[0]) {
			handleQRFile(files[0]);
		}
	});

	qrFileInput?.addEventListener("change", (e) => {
		const files = (e.target as HTMLInputElement).files;
		if (files && files[0]) {
			handleQRFile(files[0]);
		}
	});

	useQrBtn?.addEventListener("click", () => {
		if (currentQRUserId) {
			onQRDetected(currentQRUserId);
		}
	});

	function handleQRFile(file: File) {
		if (!file) return;

		const uploadAreaEl = uploadArea as HTMLDivElement | null;
		if (uploadAreaEl) {
			uploadAreaEl.classList.add("is-loading");
		}

		const reader = new FileReader();
		reader.onerror = () => {
			showToast("Error processing QR Code", "error");
			if (uploadAreaEl) uploadAreaEl.classList.remove("is-loading");
		};
		reader.onload = (e) => {
			const img = new Image();
			img.onerror = () => {
				showToast("Error processing QR Code", "error");
				if (uploadAreaEl) uploadAreaEl.classList.remove("is-loading");
			};
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				try {
					// Try to decode QR using a simple approach
					// In production, you might want to use a QR library like jsQR
					// For now, we'll just show an error since jsQR isn't included
					void ctx.getImageData(0, 0, canvas.width, canvas.height);
					showToast("QR scanning requires jsQR library. Please enter your User ID manually.", "error");
				} catch (err) {
					showToast("Error processing QR Code", "error");
				} finally {
					if (uploadAreaEl) uploadAreaEl.classList.remove("is-loading");
				}
			};
			img.src = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}
}

// Function to check URL parameters for auto-fill
export function checkUrlParams(): string | null {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}
