import QrScanner from "qr-scanner";
import qrScannerWorkerUrl from "qr-scanner/qr-scanner-worker.min.js?url";
import { showToast } from "../utils";
import { validateUserId } from "../types";

QrScanner.WORKER_PATH = qrScannerWorkerUrl;

export function QRScanner(): string {
	return `
    <div id="qrScanSection" class="tab-content">
      <!-- QR Welcome Card -->
      <div class="qr-welcome-card">
        <div class="qr-welcome-icon">
          <svg width="56" height="56" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-1h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
          </svg>
        </div>
        <div class="qr-welcome-text">
          <h2>Quick Check-In</h2>
          <p>Scan your QR code for instant access</p>
        </div>
      </div>

      <div class="qr-options-grid">
        <!-- Camera Scan Card -->
        <div class="qr-option-card camera-card">
          <div class="qr-option-header">
            <div class="qr-option-icon camera">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
              </svg>
            </div>
            <div>
              <h3>Camera Scan</h3>
              <p>Use your device camera</p>
            </div>
          </div>
          <div class="qr-video-wrapper">
            <video id="qrVideo" muted playsinline></video>
            <div class="qr-scan-frame" aria-hidden="true">
              <span class="corner tl"></span>
              <span class="corner tr"></span>
              <span class="corner bl"></span>
              <span class="corner br"></span>
              <span class="scan-line"></span>
            </div>
            <div class="camera-overlay">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" opacity="0.3">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-1h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
              </svg>
            </div>
          </div>
          <div class="qr-camera-controls">
            <button id="startQrBtn" type="button" class="qr-btn start-btn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Start Camera
            </button>
            <button id="stopQrBtn" type="button" class="qr-btn stop-btn" disabled>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z"/>
              </svg>
              Stop
            </button>
          </div>
          <p id="cameraStatus" class="camera-status">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
            </svg>
            Tap "Start Camera" to begin scanning
          </p>
        </div>

        <!-- Upload Card -->
        <div class="qr-option-card upload-card">
          <div class="qr-option-header">
            <div class="qr-option-icon upload">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>
            </div>
            <div>
              <h3>Upload Image</h3>
              <p>From your gallery or files</p>
            </div>
          </div>
          <div id="uploadArea" class="upload-area enhanced">
            <div class="upload-content">
              <div class="upload-icon-wrapper">
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
              <p class="upload-title">Drag & Drop QR Image</p>
              <p class="upload-subtitle">or click to browse files</p>
              <span class="upload-formats">PNG, JPG, GIF supported</span>
              <input type="file" id="qrFileInput" accept="image/*" style="display: none;">
            </div>
            <div class="upload-loading" aria-live="polite">
              <span class="spinner" aria-hidden="true"></span>
              <span>Processing image...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Area -->
      <div id="qrResultContainer" class="qr-result-container" style="display: none;">
        <div class="qr-result-card">
          <div class="result-success-icon">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h3 class="result-title">QR Code Detected!</h3>
          <p id="qrResultText" class="result-user-id">User ID: AB-12345</p>
          <button id="useQrBtn" type="button" class="result-action-btn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
            </svg>
            Proceed to Check-In
          </button>
        </div>
      </div>
    </div>
  `;
}

export function setupQRScanner(onQRDetected: (userId: string) => void): void {
	const uploadArea = document.getElementById("uploadArea");
	const qrFileInput = document.getElementById("qrFileInput") as HTMLInputElement;
	const useQrBtn = document.getElementById("useQrBtn");
	const resultContainer = document.getElementById("qrResultContainer");
	const resultText = document.getElementById("qrResultText");
	const startQrBtn = document.getElementById("startQrBtn") as HTMLButtonElement | null;
	const stopQrBtn = document.getElementById("stopQrBtn") as HTMLButtonElement | null;
	const videoEl = document.getElementById("qrVideo") as HTMLVideoElement | null;
	const cameraStatus = document.getElementById("cameraStatus");

	let currentQRUserId: string | null = null;
	let qrScanner: QrScanner | null = null;

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

	function setCameraButtons(isActive: boolean) {
		if (startQrBtn) startQrBtn.disabled = isActive;
		if (stopQrBtn) stopQrBtn.disabled = !isActive;
	}

	function setCameraStatus(message: string, isError = false) {
		if (!cameraStatus) return;
		cameraStatus.textContent = message;
		cameraStatus.setAttribute("data-state", isError ? "error" : "normal");
	}

	function parseUserId(data: string): string | null {
		const trimmed = data.trim();
		if (!trimmed) return null;
		try {
			const url = new URL(trimmed);
			const paramId = url.searchParams.get("id");
			if (paramId) return paramId.toUpperCase();
		} catch {
			// Not a URL, fall back to plain string
		}
		return trimmed.toUpperCase();
	}

	function showResult(userId: string) {
		currentQRUserId = userId;
		if (resultText) {
			resultText.textContent = `User ID: ${userId}`;
		}
		if (resultContainer) {
			resultContainer.style.display = "block";
		}
	}

	function handleDecoded(data: string) {
		const userId = parseUserId(data);
		if (!userId || !validateUserId(userId)) {
			showToast("Invalid QR code. Expected User ID like AB-12C3D.", "error");
			return;
		}
		showResult(userId);
		showToast("QR code detected. Redirecting to check-in.");
		onQRDetected(userId);
		void stopCamera();
	}

	async function startCamera() {
		if (!videoEl) return;
		try {
			if (!qrScanner) {
				qrScanner = new QrScanner(
					videoEl,
					(result) => {
						handleDecoded(result.data);
					},
					{ returnDetailedScanResult: true, preferredCamera: "environment" }
				);
			}
			await qrScanner.start();
			setCameraButtons(true);
			setCameraStatus("Scanning... Hold your QR code inside the frame.");
		} catch (err) {
			showToast("Camera access failed. Please allow camera permission.", "error");
			qrScanner?.destroy();
			qrScanner = null;
			setCameraButtons(false);
			setCameraStatus("Camera is off. Tap Start Camera to begin scanning.", true);
		}
	}

	async function stopCamera() {
		if (qrScanner) {
			await qrScanner.stop();
			qrScanner.destroy();
			qrScanner = null;
		}
		setCameraButtons(false);
		setCameraStatus("Camera is off. Tap Start Camera to begin scanning.");
	}

	async function handleQRFile(file: File) {
		if (!file) return;

		const uploadAreaEl = uploadArea as HTMLDivElement | null;
		if (uploadAreaEl) {
			uploadAreaEl.classList.add("is-loading");
		}

		try {
			const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
			handleDecoded(result.data);
		} catch (err) {
			showToast("No QR code found in the image.", "error");
		} finally {
			if (uploadAreaEl) uploadAreaEl.classList.remove("is-loading");
		}
	}

	startQrBtn?.addEventListener("click", () => {
		void startCamera();
	});

	stopQrBtn?.addEventListener("click", () => {
		void stopCamera();
	});

	document.querySelectorAll(".tab-button").forEach((btn) => {
		btn.addEventListener("click", () => {
			const tab = (btn as HTMLElement).dataset.tab;
			if (tab !== "qrscan") {
				void stopCamera();
			}
		});
	});

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			void stopCamera();
		}
	});

	void QrScanner.hasCamera().then((hasCamera) => {
		if (!hasCamera) {
			setCameraButtons(false);
			if (startQrBtn) startQrBtn.disabled = true;
			setCameraStatus("No camera detected on this device.", true);
		}
	});
}

// Function to check URL parameters for auto-fill
export function checkUrlParams(): string | null {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}
