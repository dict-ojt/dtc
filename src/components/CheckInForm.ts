import { showToast, showConfirmation, setButtonLoading, loadUserId, saveUserId } from "../utils";
import { api } from "../api";
import { validateCheckIn } from "../types";
import type { LogEntryRequest, Service } from "../types";

export function CheckInForm(): string {
	return `
    <div id="loginSection" class="tab-content">
      <form id="loginForm">
        <!-- Welcome Card -->
        <div class="welcome-card">
          <div class="welcome-icon">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div class="welcome-text">
            <h2>Welcome Back!</h2>
            <p>Enter your User ID and select the services you need today</p>
          </div>
        </div>

        <div class="form-section checkin-section">
          <div id="userInfoBannerContainer"></div>

          <div class="input-group user-id-input">
            <label for="loginUserId" class="input-label">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              User ID <span class="required">*</span>
            </label>
            <div class="user-id-wrapper">
              <input type="text" id="loginUserId" class="input-field input-large" placeholder="XX-XXXXX" required maxlength="8" style="text-transform: uppercase;">
              <div class="input-hint">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
                </svg>
                Format: XX-XXXXX
              </div>
            </div>
          </div>

          <!-- Service Selection -->
          <div class="input-group">
            <label class="input-label service-label">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
              </svg>
              Select Services <span class="required">*</span>
            </label>
            <p class="helper-text service-helper">Tap to select one or more services you need today</p>
            <div class="service-grid enhanced">
              <label class="service-card enhanced printing">
                <input type="checkbox" name="services" value="Printing" class="service-input">
                <div class="service-card-bg"></div>
                <div class="service-icon-wrapper">
                  <svg class="service-icon" width="40" height="40" viewBox="0 0 24 24">
                    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                  </svg>
                </div>
                <div class="service-content">
                  <h3 class="service-title">Printing</h3>
                  <p class="service-description">Documents, ID photos, certificates</p>
                </div>
                <div class="service-checkmark">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </label>

              <label class="service-card enhanced pcuse">
                <input type="checkbox" name="services" value="PC Use" class="service-input">
                <div class="service-card-bg"></div>
                <div class="service-icon-wrapper">
                  <svg class="service-icon" width="40" height="40" viewBox="0 0 24 24">
                    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                  </svg>
                </div>
                <div class="service-content">
                  <h3 class="service-title">PC Use</h3>
                  <p class="service-description">Internet, research, work tasks</p>
                </div>
                <div class="service-checkmark">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </label>

              <label class="service-card enhanced training">
                <input type="checkbox" name="services" value="Training" class="service-input">
                <div class="service-card-bg"></div>
                <div class="service-icon-wrapper">
                  <svg class="service-icon" width="40" height="40" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  </svg>
                </div>
                <div class="service-content">
                  <h3 class="service-title">Training</h3>
                  <p class="service-description">Seminars, workshops, courses</p>
                </div>
                <div class="service-checkmark">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </label>
            </div>
            <div id="serviceError" class="error-message" style="display: none;">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Please select at least one service
            </div>
          </div>

          <button type="submit" id="loginBtn" class="submit-btn checkin-btn">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Complete Check-In
          </button>
        </div>
      </form>
    </div>
  `;
}

export function setupCheckInForm(): void {
	const form = document.getElementById("loginForm") as HTMLFormElement;
	const userIdInput = document.getElementById("loginUserId") as HTMLInputElement;

	const savedUserId = loadUserId();
	if (savedUserId && !userIdInput.value) {
		userIdInput.value = savedUserId;
	}

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
				saveUserId(userId);
				showToast(`✓ Check-in successful! Services: ${services.join(", ")}`);
				form.reset();
				setCheckInUserId(userId);
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
