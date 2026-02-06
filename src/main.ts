import "./style.css";
import { Header } from "./components/Header";
import { TabNav } from "./components/TabNav";
import { RegistrationForm, setupRegistrationForm } from "./components/RegistrationForm";
import { CheckInForm, setupCheckInForm, setCheckInUserId } from "./components/CheckInForm";
import { QRScanner, setupQRScanner, checkUrlParams } from "./components/QRScanner";
import { showRegistrationComplete } from "./components/RegistrationSuccess";
import { switchTab, loadUserId } from "./utils";
import { validateUserId } from "./types";

function renderApp(): void {
	const app = document.getElementById("app");
	if (!app) return;

	app.innerHTML = `
    <div class="app-container">
      <div class="app-content">
        ${Header()}
        ${TabNav()}
        ${RegistrationForm()}
        ${CheckInForm()}
        ${QRScanner()}
        <div id="toastContainer"></div>
      </div>
    </div>
  `;

	// Setup tab navigation
	document.querySelectorAll(".tab-button").forEach((btn) => {
		btn.addEventListener("click", () => {
			const tab = (btn as HTMLElement).dataset.tab;
			if (tab) switchTab(tab);
		});
	});

	// Setup registration form
	setupRegistrationForm((userId: string) => {
		showRegistrationComplete(userId, () => {
			switchTab("login");
			setCheckInUserId(userId);
		});
	});

	// Setup check-in form
	setupCheckInForm();

	// Setup QR scanner
	setupQRScanner((userId: string) => {
		switchTab("login");
		setCheckInUserId(userId);
	});

	// Check URL params for auto-fill
	const autoFillUserId = checkUrlParams();
	if (autoFillUserId) {
		switchTab("login");
		setCheckInUserId(autoFillUserId);
		return;
	}

	const savedUserId = loadUserId();
	if (savedUserId && validateUserId(savedUserId)) {
		switchTab("login");
		setCheckInUserId(savedUserId);
	}
}

// Initialize app
renderApp();
