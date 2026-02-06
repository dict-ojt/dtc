// Utility functions

const USER_ID_STORAGE_KEY = "dict:userId";

export function saveUserId(userId: string): void {
	try {
		localStorage.setItem(USER_ID_STORAGE_KEY, userId);
	} catch {
		// Ignore storage failures (private mode, quota, etc.)
	}
}

export function loadUserId(): string | null {
	try {
		return localStorage.getItem(USER_ID_STORAGE_KEY);
	} catch {
		return null;
	}
}

export function showToast(message: string, type: "success" | "error" = "success"): void {
	const container = document.getElementById("toastContainer");
	if (!container) return;

	const toast = document.createElement("div");
	toast.className = `toast ${type}`;
	toast.innerHTML = `
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      ${type === "success"
			? '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'
			: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
		}
    </svg>
    ${message}
  `;
	container.appendChild(toast);
	setTimeout(() => toast.remove(), 4000);
}

export function setButtonLoading(
	button: HTMLButtonElement | null,
	isLoading: boolean,
	loadingText = "Loading..."
): void {
	if (!button) return;

	if (isLoading) {
		if (!button.dataset.originalHtml) {
			button.dataset.originalHtml = button.innerHTML;
		}
		button.disabled = true;
		button.classList.add("is-loading");
		button.setAttribute("aria-busy", "true");
		button.innerHTML = `
      <span class="spinner" aria-hidden="true"></span>
      <span>${loadingText}</span>
    `;
		return;
	}

	const originalHtml = button.dataset.originalHtml;
	if (originalHtml) {
		button.innerHTML = originalHtml;
	}
	button.disabled = false;
	button.classList.remove("is-loading");
	button.removeAttribute("aria-busy");
}

export function copyToClipboard(text: string): Promise<void> {
	return navigator.clipboard.writeText(text).then(() => {
		showToast("✓ Copied to clipboard!");
	}).catch(() => {
		showToast("Failed to copy", "error");
	});
}

export async function copyQRImageToClipboard(qrUrl: string): Promise<void> {
	try {
		const response = await fetch(qrUrl);
		const blob = await response.blob();
		await navigator.clipboard.write([
			new ClipboardItem({ "image/png": blob }),
		]);
		showToast("✓ QR code copied to clipboard!");
	} catch {
		showToast("Failed to copy QR code", "error");
	}
}

export async function downloadQRImage(qrUrl: string, filename: string): Promise<void> {
	try {
		const response = await fetch(qrUrl);
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
		showToast("✓ QR image downloaded!");
	} catch {
		showToast("Failed to download QR image", "error");
	}
}

export function generateQRCode(text: string): string {
	const encodedText = encodeURIComponent(text);
	return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedText}`;
}

export function showConfirmation(
	title = "Confirm Submission",
	message = "Are you sure?"
): Promise<boolean> {
	return new Promise((resolve) => {
		const modal = document.createElement("div");
		modal.className = "confirmation-modal";
		modal.innerHTML = `
      <div class="confirmation-content">
        <div style="text-align: center; margin-bottom: 16px;">
          <svg width="64" height="64" fill="#f59e0b" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
        </div>
        <h3 style="font-size: 20px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 8px;">${title}</h3>
        <p style="color: #64748b; text-align: center; margin-bottom: 24px;">${message}</p>
        <div class="confirmation-buttons">
          <button class="confirm-no" type="button">❌ No</button>
          <button class="confirm-yes" type="button">✓ Yes</button>
        </div>
      </div>
    `;
		document.body.appendChild(modal);

		const confirmYes = modal.querySelector(".confirm-yes") as HTMLButtonElement;
		const confirmNo = modal.querySelector(".confirm-no") as HTMLButtonElement;

		confirmYes.addEventListener("click", () => {
			modal.remove();
			resolve(true);
		});

		confirmNo.addEventListener("click", () => {
			modal.remove();
			resolve(false);
		});
	});
}

export function updateAgeGroup(): void {
	const birthdateInput = document.getElementById("birthdate") as HTMLInputElement;
	const ageGroupDisplay = document.getElementById("ageGroupDisplay");
	const ageGroupInput = document.getElementById("ageGroup") as HTMLInputElement;

	if (!birthdateInput || !ageGroupDisplay || !ageGroupInput) return;

	const birthdate = birthdateInput.value;
	if (!birthdate) return;

	const birth = new Date(birthdate);
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}

	let ageGroup = "";
	if (age < 18) ageGroup = "Under 18";
	else if (age < 25) ageGroup = "18-24";
	else if (age < 35) ageGroup = "25-34";
	else if (age < 45) ageGroup = "35-44";
	else ageGroup = "45+";

	ageGroupInput.value = ageGroup;
	ageGroupDisplay.textContent = ageGroup;
	ageGroupDisplay.style.background = "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)";
	ageGroupDisplay.style.borderColor = "#10b981";
	ageGroupDisplay.style.color = "#065f46";
}

export function formatDate(timestamp: number): string {
	return new Date(timestamp * 1000).toLocaleString();
}

export function formatDateInput(date: Date): string {
	return date.toISOString().split("T")[0];
}

export function switchTab(tab: string): void {
	// Update tab buttons
	document.querySelectorAll(".tab-button").forEach((btn) => {
		btn.classList.remove("active");
		if ((btn as HTMLElement).dataset.tab === tab) {
			btn.classList.add("active");
		}
	});

	// Update tab content
	document.querySelectorAll(".tab-content").forEach((content) => {
		content.classList.remove("active");
	});

	const contentMap: Record<string, string> = {
		register: "attendanceForm",
		login: "loginSection",
		qrscan: "qrScanSection",
	};

	const contentId = contentMap[tab];
	if (contentId) {
		const content = document.getElementById(contentId);
		if (content) {
			content.classList.add("active");
		}
	}
}
