import { showToast, showConfirmation, updateAgeGroup, setButtonLoading } from "../utils";
import { api } from "../api";
import { validateRegistration } from "../types";
import type { CreateUserRequest } from "../types";

export function RegistrationForm(): string {
	// Set max date for birthdate
	const today = new Date().toISOString().split("T")[0];

	return `
    <form id="attendanceForm" class="tab-content active">
      <!-- Personal Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">Personal Information</h2>
        </div>

        <!-- Full Name -->
        <div class="grid-4">
          <div class="input-group">
            <label class="input-label">First Name <span class="required">*</span></label>
            <input type="text" id="firstName" class="input-field" placeholder="Juan" required>
          </div>
          <div class="input-group">
            <label class="input-label">Middle Initial</label>
            <input type="text" id="middleInitial" class="input-field" placeholder="D" maxlength="1">
            <p class="helper-text">Optional</p>
          </div>
          <div class="input-group">
            <label class="input-label">Last Name <span class="required">*</span></label>
            <input type="text" id="lastName" class="input-field" placeholder="Dela Cruz" required>
          </div>
          <div class="input-group">
            <label class="input-label">Suffix</label>
            <select id="suffix" class="input-field">
              <option value="">None</option>
              <option value="Jr.">Jr.</option>
              <option value="Sr.">Sr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
            <p class="helper-text">Optional</p>
          </div>
        </div>

        <!-- Email -->
        <div class="input-group">
          <label class="input-label">Email <span class="required">*</span></label>
          <input type="email" id="email" class="input-field" placeholder="juandelacruz@email.com" required>
          <p class="helper-text">Enter a valid email address</p>
        </div>

        <!-- Gender -->
        <div class="input-group">
          <label class="input-label">Gender <span class="required">*</span></label>
          <div class="radio-group grid-3">
            <label class="radio-option">
              <input type="radio" name="gender" value="Male" required>
              <span>👨 Male</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="gender" value="Female">
              <span>👩 Female</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="gender" value="Prefer not to say">
              <span>🤐 Prefer not to say</span>
            </label>
          </div>
        </div>

        <!-- Birthdate -->
        <div class="input-group">
          <label class="input-label">Birthdate <span class="required">*</span></label>
          <input type="date" id="birthdate" class="input-field" required max="${today}">
          <p class="helper-text">Select your date of birth</p>
        </div>

        <!-- Age Group (Auto-calculated) -->
        <div class="input-group">
          <label class="input-label">Age Group <span style="color: #64748b; font-weight: normal;">(Auto-calculated)</span></label>
          <div id="ageGroupDisplay" style="padding: 12px 16px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 10px; font-size: 16px; font-weight: 600; color: #0c4a6e; text-align: center;">
            Select birthdate to calculate
          </div>
          <input type="hidden" id="ageGroup" name="ageGroup" value="">
          <p class="helper-text">Auto-calculated based on your birthdate</p>
        </div>

        <!-- Phone Number -->
        <div class="input-group">
          <label class="input-label">Phone Number <span class="required">*</span></label>
          <input type="tel" id="phone" class="input-field" placeholder="09XXXXXXXXX" pattern="09[0-9]{9}" maxlength="11" required>
          <p class="helper-text">Must start with 09 and be 11 digits (e.g., 09171234567)</p>
        </div>
      </div>

      <!-- Location Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">Location</h2>
        </div>

        <!-- Nationality -->
        <div class="input-group">
          <label class="input-label">Select Nationality <span class="required">*</span></label>
          <select id="nationality" class="input-field" required>
            <option value="">Select nationality...</option>
            <option value="Filipino">🇵🇭 Filipino</option>
            <option value="American">🇺🇸 American</option>
            <option value="Australian">🇦🇺 Australian</option>
            <option value="British">🇬🇧 British</option>
            <option value="Canadian">🇨🇦 Canadian</option>
            <option value="Chinese">🇨🇳 Chinese</option>
            <option value="French">🇫🇷 French</option>
            <option value="German">🇩🇪 German</option>
            <option value="Indian">🇮🇳 Indian</option>
            <option value="Indonesian">🇮🇩 Indonesian</option>
            <option value="Italian">🇮🇹 Italian</option>
            <option value="Japanese">🇯🇵 Japanese</option>
            <option value="Korean">🇰🇷 Korean</option>
            <option value="Malaysian">🇲🇾 Malaysian</option>
            <option value="Spanish">🇪🇸 Spanish</option>
            <option value="Thai">🇹🇭 Thai</option>
            <option value="Vietnamese">🇻🇳 Vietnamese</option>
            <option value="Other">🌍 Other</option>
          </select>
        </div>

        <!-- Region -->
        <div class="input-group">
          <label class="input-label">Select Region <span class="required">*</span></label>
          <select id="region" class="input-field" required>
            <option value="">Select region...</option>
            <option value="Region I">🗺️ Region I – Ilocos Region</option>
            <option value="Region II">🗺️ Region II – Cagayan Valley</option>
            <option value="Region III">🗺️ Region III – Central Luzon</option>
            <option value="Region IV-A">🗺️ Region IV-A – CALABARZON</option>
            <option value="Region IV-B">🗺️ Region IV-B – MIMAROPA Region</option>
            <option value="Region V">🗺️ Region V – Bicol Region</option>
            <option value="Region VI">🗺️ Region VI – Western Visayas</option>
            <option value="Region VII">🗺️ Region VII – Central Visayas</option>
            <option value="Region VIII">🗺️ Region VIII – Eastern Visayas</option>
            <option value="Region IX">🗺️ Region IX – Zamboanga Peninsula</option>
            <option value="Region X">🗺️ Region X – Northern Mindanao</option>
            <option value="Region XI">🗺️ Region XI – Davao Region</option>
            <option value="Region XII">🗺️ Region XII – SOCCSKSARGEN</option>
            <option value="Region XIII">🗺️ Region XIII – Caraga</option>
            <option value="NCR">🗺️ NCR – National Capital Region</option>
            <option value="CAR">🗺️ CAR – Cordillera Administrative Region</option>
            <option value="BARMM">🗺️ BARMM – Bangsamoro Autonomous Region</option>
          </select>
        </div>

        <!-- Address -->
        <div class="input-group">
          <label class="input-label">Address <span class="required">*</span></label>
          <div class="grid-2" style="margin-bottom: 12px;">
            <div>
              <input type="text" id="building" class="input-field" placeholder="Building / House No." required>
              <p class="helper-text">Building / House Number *</p>
            </div>
            <div>
              <input type="text" id="street" class="input-field" placeholder="Street Name">
              <p class="helper-text">Street (Optional)</p>
            </div>
          </div>
          <div class="grid-3">
            <div>
              <input type="text" id="barangay" class="input-field" placeholder="Barangay" required>
              <p class="helper-text">Barangay *</p>
            </div>
            <div>
              <input type="text" id="city" class="input-field" placeholder="City / Municipality" required>
              <p class="helper-text">City / Municipality *</p>
            </div>
            <div>
              <input type="text" id="province" class="input-field" placeholder="Province" required>
              <p class="helper-text">Province *</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Professional Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">Professional Information</h2>
        </div>

        <!-- Sector -->
        <div class="input-group">
          <label class="input-label">Select Sector <span class="required">*</span></label>
          <div class="radio-group grid-3">
            <label class="radio-option">
              <input type="radio" name="sector" value="Out of school youth" required>
              <span>📚 Out of school youth</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="sector" value="Student">
              <span>🎓 Student</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="sector" value="Teacher">
              <span>🏫 Teacher</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="sector" value="Professional">
              <span>💼 Professional</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="sector" value="Other">
              <span>📋 Other</span>
            </label>
          </div>
        </div>

        <div class="grid-3">
          <div class="input-group">
            <label class="input-label">Agency <span class="required">*</span></label>
            <input type="text" id="agency" class="input-field" placeholder="Enter agency name" required>
          </div>
          <div class="input-group">
            <label class="input-label">Office / Affiliation <span class="required">*</span></label>
            <input type="text" id="office" class="input-field" placeholder="Enter office/affiliation" required>
          </div>
          <div class="input-group">
            <label class="input-label">Designation / Position <span class="required">*</span></label>
            <input type="text" id="designation" class="input-field" placeholder="Enter position" required>
          </div>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">Additional Information</h2>
        </div>

        <div class="grid-3">
          <!-- Senior Citizen -->
          <div class="input-group">
            <label class="input-label">Are you a Senior Citizen? <span class="required">*</span></label>
            <div class="checkbox-group">
              <label class="radio-option">
                <input type="radio" name="seniorCitizen" value="Yes" required>
                <span>✅ Yes</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="seniorCitizen" value="No">
                <span>❌ No</span>
              </label>
            </div>
          </div>

          <!-- Differently Abled -->
          <div class="input-group">
            <label class="input-label">Are you Differently Abled? <span class="required">*</span></label>
            <div class="checkbox-group">
              <label class="radio-option">
                <input type="radio" name="differentlyAbled" value="Yes" required>
                <span>✅ Yes</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="differentlyAbled" value="No">
                <span>❌ No</span>
              </label>
            </div>
          </div>

          <!-- Solo Parent -->
          <div class="input-group">
            <label class="input-label">Are you a Solo Parent? <span class="required">*</span></label>
            <div class="checkbox-group">
              <label class="radio-option">
                <input type="radio" name="soloParent" value="Yes" required>
                <span>✅ Yes</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="soloParent" value="No">
                <span>❌ No</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Civil Status -->
        <div class="input-group">
          <label class="input-label">Civil Status <span class="required">*</span></label>
          <div class="radio-group grid-4">
            <label class="radio-option">
              <input type="radio" name="civilStatus" value="Single" required>
              <span>💍 Single</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="civilStatus" value="Married">
              <span>👫 Married</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="civilStatus" value="Widowed">
              <span>🕊️ Widowed</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="civilStatus" value="Divorced">
              <span>📄 Divorced</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="civilStatus" value="Separated">
              <span>⏸️ Separated</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="civilStatus" value="Annulled">
              <span>⚖️ Annulled</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="civilStatus" value="Domestic Partnership">
              <span>🏠 Domestic Partnership</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="submitBtn" class="submit-btn">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Submit Registration
      </button>
    </form>
  `;
}

export function setupRegistrationForm(onSuccess: (userId: string) => void): void {
	const form = document.getElementById("attendanceForm") as HTMLFormElement;
	const birthdateInput = document.getElementById("birthdate") as HTMLInputElement;

	// Setup birthdate change handler
	if (birthdateInput) {
		birthdateInput.addEventListener("change", updateAgeGroup);
	}

	// Setup phone input formatting
	const phoneInput = document.getElementById("phone") as HTMLInputElement;
	if (phoneInput) {
		phoneInput.addEventListener("input", () => {
			phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "").slice(0, 11);
		});
	}

	form?.addEventListener("submit", async (e) => {
		e.preventDefault();
		const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement | null;

		const confirmed = await showConfirmation(
			"Confirm Submission",
			"Are you sure you want to submit this information?"
		);
		if (!confirmed) return;

		const ageGroup = (document.getElementById("ageGroup") as HTMLInputElement).value;
		if (!ageGroup) {
			showToast("Please select your birthdate", "error");
			return;
		}

		const registrationData: CreateUserRequest = {
			first_name: (document.getElementById("firstName") as HTMLInputElement).value,
			middle_initial: (document.getElementById("middleInitial") as HTMLInputElement).value || undefined,
			last_name: (document.getElementById("lastName") as HTMLInputElement).value,
			suffix: (document.getElementById("suffix") as HTMLSelectElement).value as any || undefined,
			email: (document.getElementById("email") as HTMLInputElement).value,
			gender: (document.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value as any,
			birthdate: (document.getElementById("birthdate") as HTMLInputElement).value,
			phone: (document.getElementById("phone") as HTMLInputElement).value,
			nationality: (document.getElementById("nationality") as HTMLSelectElement).value as any,
			region: (document.getElementById("region") as HTMLSelectElement).value as any,
			address: {
				building: (document.getElementById("building") as HTMLInputElement).value,
				street: (document.getElementById("street") as HTMLInputElement).value || undefined,
				barangay: (document.getElementById("barangay") as HTMLInputElement).value,
				city: (document.getElementById("city") as HTMLInputElement).value,
				province: (document.getElementById("province") as HTMLInputElement).value,
			},
			sector: (document.querySelector('input[name="sector"]:checked') as HTMLInputElement)?.value as any,
			agency: (document.getElementById("agency") as HTMLInputElement).value,
			office: (document.getElementById("office") as HTMLInputElement).value,
			designation: (document.getElementById("designation") as HTMLInputElement).value,
			senior_citizen: (document.querySelector('input[name="seniorCitizen"]:checked') as HTMLInputElement)?.value as any,
			differently_abled: (document.querySelector('input[name="differentlyAbled"]:checked') as HTMLInputElement)?.value as any,
			solo_parent: (document.querySelector('input[name="soloParent"]:checked') as HTMLInputElement)?.value as any,
			civil_status: (document.querySelector('input[name="civilStatus"]:checked') as HTMLInputElement)?.value as any,
		};

		const validationError = validateRegistration(registrationData);
		if (validationError) {
			showToast(validationError, "error");
			return;
		}

		try {
			setButtonLoading(submitBtn, true, "Submitting...");
			const response = await api.createUser(registrationData);
			if (response.success && response.user) {
				showToast(`✓ Registration successful! Your ID is: ${response.user.user_id}`);
				form.reset();
				const ageGroupDisplay = document.getElementById("ageGroupDisplay");
				if (ageGroupDisplay) {
					ageGroupDisplay.textContent = "Select birthdate to calculate";
					ageGroupDisplay.style.background = "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)";
					ageGroupDisplay.style.borderColor = "#0ea5e9";
					ageGroupDisplay.style.color = "#0c4a6e";
				}
				onSuccess(response.user.user_id);
			} else {
				showToast(response.error || "Registration failed", "error");
			}
		} catch (error) {
			showToast(error instanceof Error ? error.message : "Registration failed", "error");
		} finally {
			setButtonLoading(submitBtn, false);
		}
	});
}
