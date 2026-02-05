import { showToast, showConfirmation, setButtonLoading } from "../utils";
import { api } from "../api";
import { validateCheckIn } from "../types";
import type { LogEntryRequest, Service } from "../types";

export function CheckInForm(): string {
	return `
    <div id="loginSection" class="tab-content">
      <form id="loginForm">
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800">User Check In</h2>
          </div>

          <div id="userInfoBannerContainer"></div>

          <div class="input-group">
            <label for="loginUserId" class="input-label">User ID <span class="required">*</span></label>
            <input type="text" id="loginUserId" class="input-field" placeholder="XX-XXXXX" required maxlength="8" style="text-transform: uppercase;">
            <p class="helper-text">Enter your ID in format: XX-XXXXX (e.g., AB-12C3D)</p>
          </div>

          <!-- Service Selection -->
          <div class="input-group">
            <label class="input-label">Select Services You Need <span class="required">*</span></label>
            <p class="helper-text" style="margin-bottom: 12px;">Choose at least one service</p>
            <div class="service-grid">
              <label class="service-card">
                <input type="checkbox" name="services" value="Printing" class="service-checkbox">
                <div class="service-image-container">
                  <svg class="service-icon" width="80" height="80" fill="#0ea5e9" viewBox="0 0 24 24">
                    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                  </svg>
                </div>
                <div class="service-checkmark">✓</div>
                <h3 class="service-title">Printing</h3>
                <p class="service-description">Document printing services</p>
              </label>

              <label class="service-card">
                <input type="checkbox" name="services" value="PC Use" class="service-checkbox">
                <div class="service-image-container">
                  <svg class="service-icon" width="80" height="80" fill="#0ea5e9" viewBox="0 0 24 24">
                    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                  </svg>
                </div>
                <div class="service-checkmark">✓</div>
                <h3 class="service-title">PC Use</h3>
                <p class="service-description">Computer workstation access</p>
              </label>

              <label class="service-card">
                <input type="checkbox" name="services" value="Training" class="service-checkbox">
                <div class="service-image-container">
                  <svg class="service-icon" width="80" height="80" fill="#0ea5e9" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  </svg>
                </div>
                <div class="service-checkmark">✓</div>
                <h3 class="service-title">Training</h3>
                <p class="service-description">Skills development programs</p>
              </label>
            </div>
            <div id="serviceError" class="helper-text" style="color: #ef4444; display: none; margin-top: 8px;">
              Please select at least one service
            </div>
          </div>

          <button type="submit" id="loginBtn" class="submit-btn">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
            </svg>
            Check In
          </button>
        </div>
      </form>
    </div>
  `;
}

export function setupCheckInForm(): void {
	const form = document.getElementById("loginForm") as HTMLFormElement;
	const userIdInput = document.getElementById("loginUserId") as HTMLInputElement;

	// Convert to uppercase
	userIdInput?.addEventListener("input", () => {
		userIdInput.value = userIdInput.value.toUpperCase();
	});

	form?.addEventListener("submit", async (e) => {
		e.preventDefault();
		const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement | null;

		const userId = userIdInput.value.toUpperCase();
		const services = Array.from(
			document.querySelectorAll('input[name="services"]:checked')
		).map((c) => (c as HTMLInputElement).value) as Service[];

		if (services.length === 0) {
			const errorEl = document.getElementById("serviceError");
			if (errorEl) errorEl.style.display = "block";
			return;
		}

		const errorEl = document.getElementById("serviceError");
		if (errorEl) errorEl.style.display = "none";

		const checkInData: LogEntryRequest = {
			user_id: userId,
			services,
		};

		const validationError = validateCheckIn(checkInData);
		if (validationError) {
			showToast(validationError, "error");
			return;
		}

		// Get user info for confirmation
		try {
			setButtonLoading(loginBtn, true, "Verifying...");
			const userResponse = await api.getUser(userId);
			if (!userResponse.success || !userResponse.user) {
				showToast("User ID not found. Please register first.", "error");
				return;
			}

			const userName = `${userResponse.user.first_name} ${userResponse.user.last_name}`;
			const confirmed = await showConfirmation(
				"Confirm Check-In",
				`Check in as ${userName} with services: ${services.join(", ")}?`
			);
			if (!confirmed) return;

			setButtonLoading(loginBtn, true, "Checking in...");
			const response = await api.logEntry(checkInData);
			if (response.success) {
				showToast(`✓ Check-in successful! Services: ${services.join(", ")}`);
				form.reset();
			} else {
				showToast(response.error || "Check-in failed", "error");
			}
		} catch (error) {
			showToast(error instanceof Error ? error.message : "Check-in failed", "error");
		} finally {
			setButtonLoading(loginBtn, false);
		}
	});
}

export function setCheckInUserId(userId: string): void {
	const input = document.getElementById("loginUserId") as HTMLInputElement;
	if (input) {
		input.value = userId;
		input.focus();
	}
}
