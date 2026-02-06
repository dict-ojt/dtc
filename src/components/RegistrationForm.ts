import { showToast, showConfirmation, updateAgeGroup, setButtonLoading, saveUserId } from "../utils";
import { api } from "../api";
import { validateRegistration } from "../types";
import type { CreateUserRequest } from "../types";

export function RegistrationForm(): string {
	// Set max date for birthdate
	const today = new Date().toISOString().split("T")[0];

	return `
    <form id="attendanceForm" class="tab-content active">
      <!-- Welcome Card -->
      <div class="registration-welcome-card">
        <div class="registration-welcome-icon">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="registration-welcome-text">
          <h2>Create Your Account</h2>
          <p>Join the DICT DTC community and access our services</p>
        </div>
        <div class="registration-steps">
          <button type="button" class="step-item" data-section="section-personal">
            <span class="step-number">1</span>
            <span class="step-label">Personal</span>
          </button>
          <div class="step-divider"></div>
          <button type="button" class="step-item" data-section="section-location">
            <span class="step-number">2</span>
            <span class="step-label">Location</span>
          </button>
          <div class="step-divider"></div>
          <button type="button" class="step-item" data-section="section-professional">
            <span class="step-number">3</span>
            <span class="step-label">Work</span>
          </button>
          <div class="step-divider"></div>
          <button type="button" class="step-item" data-section="section-additional">
            <span class="step-number">4</span>
            <span class="step-label">Additional</span>
          </button>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div id="section-personal" class="form-section registration-section">
        <div class="section-header enhanced">
          <div class="section-number">1</div>
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="section-text">
            <h2>Personal Information</h2>
            <p>Tell us about yourself</p>
          </div>
        </div>

        <!-- Full Name -->
        <div class="form-group-label">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
          </svg>
          Full Name
        </div>
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
          <label class="input-label">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Email <span class="required">*</span>
          </label>
          <input type="email" id="email" class="input-field" placeholder="juandelacruz@email.com" required>
          <p class="helper-text">Enter a valid email address for notifications</p>
        </div>

        <!-- Gender -->
        <div class="input-group">
          <label class="input-label">Gender <span class="required">*</span></label>
          <div class="gender-options">
            <label class="gender-option">
              <input type="radio" name="gender" value="Male" required>
              <div class="gender-card">
                <div class="gender-icon male">
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 9c1.29 0 2.5.41 3.47 1.11L17.58 5H13V3h8v8h-2V6.41l-5.11 5.09c.7.97 1.11 2.18 1.11 3.5 0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6zm0 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                  </svg>
                </div>
                <span>Male</span>
              </div>
            </label>
            <label class="gender-option">
              <input type="radio" name="gender" value="Female">
              <div class="gender-card">
                <div class="gender-icon female">
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.69 2 6 4.69 6 8c0 2.97 2.16 5.44 5 5.92V16H8v2h3v4h2v-4h3v-2h-3v-2.08c2.84-.48 5-2.95 5-5.92 0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                  </svg>
                </div>
                <span>Female</span>
              </div>
            </label>
            <label class="gender-option">
              <input type="radio" name="gender" value="Prefer not to say">
              <div class="gender-card">
                <div class="gender-icon other">
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.03.05-.09.15-.18.32-.25.5-.01.03-.03.05-.04.08-.01.02-.01.04-.02.07-.12.34-.2.75-.2 1.25h2c0-.42.11-.77.28-1.07.02-.03.03-.06.05-.09.08-.14.18-.27.28-.39.01-.01.02-.03.03-.04.1-.12.21-.23.33-.34.96-.91 2.26-1.65 1.99-3.56-.24-1.74-1.61-3.21-3.35-3.47z"/>
                  </svg>
                </div>
                <span>Prefer not to say</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Birthdate & Age Group -->
        <div class="grid-2">
          <div class="input-group">
            <label class="input-label">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
              Birthdate <span class="required">*</span>
            </label>
            <input type="date" id="birthdate" class="input-field" required max="${today}">
            <p class="helper-text">Select your date of birth</p>
          </div>
          <div class="input-group">
            <label class="input-label">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 000 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
              </svg>
              Age Group <span class="auto-label">(Auto)</span>
            </label>
            <div id="ageGroupDisplay" class="age-group-display">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
              </svg>
              Select birthdate to calculate
            </div>
            <input type="hidden" id="ageGroup" name="ageGroup" value="">
          </div>
        </div>

        <!-- Phone Number -->
        <div class="input-group">
          <label class="input-label">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            Phone Number <span class="required">*</span>
          </label>
          <input type="tel" id="phone" class="input-field" placeholder="09XXXXXXXXX" pattern="09[0-9]{9}" maxlength="11" required>
          <p class="helper-text">Must start with 09 and be 11 digits (e.g., 09171234567)</p>
        </div>
      </div>

      <!-- Location Section -->
      <div id="section-location" class="form-section registration-section">
        <div class="section-header enhanced">
          <div class="section-number">2</div>
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="section-text">
            <h2>Location Details</h2>
            <p>Where are you from?</p>
          </div>
        </div>

        <!-- Nationality & Region -->
        <div class="grid-2">
          <div class="input-group">
            <label class="input-label">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Nationality <span class="required">*</span>
            </label>
            <select id="nationality" class="input-field" required>
              <option value="">Select nationality...</option>
              <option value="Filipino">Filipino</option>
              <option value="American">American</option>
              <option value="Australian">Australian</option>
              <option value="British">British</option>
              <option value="Canadian">Canadian</option>
              <option value="Chinese">Chinese</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Indian">Indian</option>
              <option value="Indonesian">Indonesian</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Malaysian">Malaysian</option>
              <option value="Spanish">Spanish</option>
              <option value="Thai">Thai</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
              </svg>
              Region <span class="required">*</span>
            </label>
            <select id="region" class="input-field" required>
              <option value="">Select region...</option>
              <option value="Region I">Region I - Ilocos Region</option>
              <option value="Region II">Region II - Cagayan Valley</option>
              <option value="Region III">Region III - Central Luzon</option>
              <option value="Region IV-A">Region IV-A - CALABARZON</option>
              <option value="Region IV-B">Region IV-B - MIMAROPA Region</option>
              <option value="Region V">Region V - Bicol Region</option>
              <option value="Region VI">Region VI - Western Visayas</option>
              <option value="Region VII">Region VII - Central Visayas</option>
              <option value="Region VIII">Region VIII - Eastern Visayas</option>
              <option value="Region IX">Region IX - Zamboanga Peninsula</option>
              <option value="Region X">Region X - Northern Mindanao</option>
              <option value="Region XI">Region XI - Davao Region</option>
              <option value="Region XII">Region XII - SOCCSKSARGEN</option>
              <option value="Region XIII">Region XIII - Caraga</option>
              <option value="NCR">NCR - National Capital Region</option>
              <option value="CAR">CAR - Cordillera Administrative Region</option>
              <option value="BARMM">BARMM - Bangsamoro Autonomous Region</option>
            </select>
          </div>
        </div>

        <!-- Address -->
        <div class="input-group">
          <label class="input-label address-label">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Complete Address <span class="required">*</span>
          </label>
          <div class="address-grid">
            <div class="address-row">
              <div class="input-group">
                <input type="text" id="building" class="input-field" placeholder="Building / House No." required>
                <p class="helper-text">Building / House No. *</p>
              </div>
              <div class="input-group">
                <input type="text" id="street" class="input-field" placeholder="Street Name">
                <p class="helper-text">Street (Optional)</p>
              </div>
            </div>
            <div class="address-row three-col">
              <div class="input-group">
                <input type="text" id="barangay" class="input-field" placeholder="Barangay" required>
                <p class="helper-text">Barangay *</p>
              </div>
              <div class="input-group">
                <input type="text" id="city" class="input-field" placeholder="City / Municipality" required>
                <p class="helper-text">City / Municipality *</p>
              </div>
              <div class="input-group">
                <input type="text" id="province" class="input-field" placeholder="Province" required>
                <p class="helper-text">Province *</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Professional Information Section -->
      <div id="section-professional" class="form-section registration-section">
        <div class="section-header enhanced">
          <div class="section-number">3</div>
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
          </div>
          <div class="section-text">
            <h2>Professional Information</h2>
            <p>Your occupation and affiliation</p>
          </div>
        </div>

        <!-- Sector -->
        <div class="input-group">
          <label class="input-label">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
            Select Sector <span class="required">*</span>
          </label>
          <div class="sector-grid">
            <label class="sector-card">
              <input type="radio" name="sector" value="Out of school youth" required>
              <div class="sector-content">
                <div class="sector-icon osy">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                  </svg>
                </div>
                <span>Out of School Youth</span>
              </div>
            </label>
            <label class="sector-card">
              <input type="radio" name="sector" value="Student">
              <div class="sector-content">
                <div class="sector-icon student">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  </svg>
                </div>
                <span>Student</span>
              </div>
            </label>
            <label class="sector-card">
              <input type="radio" name="sector" value="Teacher">
              <div class="sector-content">
                <div class="sector-icon teacher">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  </svg>
                </div>
                <span>Teacher</span>
              </div>
            </label>
            <label class="sector-card">
              <input type="radio" name="sector" value="Professional">
              <div class="sector-content">
                <div class="sector-icon professional">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                  </svg>
                </div>
                <span>Professional</span>
              </div>
            </label>
            <label class="sector-card">
              <input type="radio" name="sector" value="Other">
              <div class="sector-content">
                <div class="sector-icon other">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                  </svg>
                </div>
                <span>Other</span>
              </div>
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
      <div id="section-additional" class="form-section registration-section">
        <div class="section-header enhanced">
          <div class="section-number">4</div>
          <div class="section-icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </div>
          <div class="section-text">
            <h2>Additional Information</h2>
            <p>Help us serve you better</p>
          </div>
        </div>

        <div class="quick-questions">
          <!-- Senior Citizen -->
          <div class="quick-question-card">
            <div class="question-content">
              <div class="question-icon senior">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                </svg>
              </div>
              <span class="question-text">Are you a Senior Citizen?</span>
            </div>
            <div class="yes-no-toggle">
              <label class="toggle-option">
                <input type="radio" name="seniorCitizen" value="Yes" required>
                <span class="toggle-yes">Yes</span>
              </label>
              <label class="toggle-option">
                <input type="radio" name="seniorCitizen" value="No">
                <span class="toggle-no">No</span>
              </label>
            </div>
          </div>

          <!-- Differently Abled -->
          <div class="quick-question-card">
            <div class="question-content">
              <div class="question-icon pwd">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                </svg>
              </div>
              <span class="question-text">Are you Differently Abled (PWD)?</span>
            </div>
            <div class="yes-no-toggle">
              <label class="toggle-option">
                <input type="radio" name="differentlyAbled" value="Yes" required>
                <span class="toggle-yes">Yes</span>
              </label>
              <label class="toggle-option">
                <input type="radio" name="differentlyAbled" value="No">
                <span class="toggle-no">No</span>
              </label>
            </div>
          </div>

          <!-- Solo Parent -->
          <div class="quick-question-card">
            <div class="question-content">
              <div class="question-icon solo">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <span class="question-text">Are you a Solo Parent?</span>
            </div>
            <div class="yes-no-toggle">
              <label class="toggle-option">
                <input type="radio" name="soloParent" value="Yes" required>
                <span class="toggle-yes">Yes</span>
              </label>
              <label class="toggle-option">
                <input type="radio" name="soloParent" value="No">
                <span class="toggle-no">No</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Civil Status -->
        <div class="input-group">
          <label class="input-label">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            Civil Status <span class="required">*</span>
          </label>
          <div class="civil-status-grid">
            <label class="civil-option">
              <input type="radio" name="civilStatus" value="Single" required>
              <span>Single</span>
            </label>
            <label class="civil-option">
              <input type="radio" name="civilStatus" value="Married">
              <span>Married</span>
            </label>
            <label class="civil-option">
              <input type="radio" name="civilStatus" value="Widowed">
              <span>Widowed</span>
            </label>
            <label class="civil-option">
              <input type="radio" name="civilStatus" value="Divorced">
              <span>Divorced</span>
            </label>
            <label class="civil-option">
              <input type="radio" name="civilStatus" value="Separated">
              <span>Separated</span>
            </label>
            <label class="civil-option">
              <input type="radio" name="civilStatus" value="Annulled">
              <span>Annulled</span>
            </label>
            <label class="civil-option wide">
              <input type="radio" name="civilStatus" value="Domestic Partnership">
              <span>Domestic Partnership</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <p class="submit-note">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          By submitting, you agree to our data privacy policy
        </p>
        <button type="submit" id="submitBtn" class="submit-btn registration-submit">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          Complete Registration
        </button>
      </div>
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

	// Setup step navigation
	const stepItems = document.querySelectorAll(".step-item[data-section]");
	stepItems.forEach((step) => {
		step.addEventListener("click", () => {
			const sectionId = step.getAttribute("data-section");
			if (sectionId) {
				const section = document.getElementById(sectionId);
				if (section) {
					section.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}
		});
	});

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
				saveUserId(response.user.user_id);
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
