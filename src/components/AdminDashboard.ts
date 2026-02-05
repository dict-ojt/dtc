import { showToast, setButtonLoading } from "../utils";
import { api } from "../api";
import type { UserRegistration, CheckInEntry, Service } from "../types";

let registrations: UserRegistration[] = [];
let checkins: CheckInEntry[] = [];
let regCurrentPage = 1;
let regItemsPerPage = 10;
let filteredRegistrations: UserRegistration[] = [];
let checkinCurrentPage = 1;
let checkinItemsPerPage = 10;
let filteredCheckins: CheckInEntry[] = [];

export function AdminDashboard(): string {
	return `
    <div id="adminSection" class="tab-content">
      <!-- Admin Login Form -->
      <form id="adminLoginForm">
        <div class="form-section" style="max-width: 400px; margin: 60px auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div class="logo-container">
              <img src="https://imgur.com/hcMvsXb.png" alt="DTC Logo" style="width: 60px; height: 60px; object-fit: contain;" loading="lazy" 
                onerror="console.error('Logo failed to load'); this.style.background='#0ea5e9'; this.innerHTML='🛡️';">
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Admin Login</h1>
            <p style="color: #64748b; font-size: 14px;">DTC Tuguegarao Dashboard</p>
          </div>

          <div class="input-group">
            <label for="adminUsername" class="input-label">Username <span class="required">*</span></label>
            <input type="text" id="adminUsername" class="input-field" placeholder="Enter username" required>
          </div>

          <div class="input-group">
            <label for="adminPassword" class="input-label">Password <span class="required">*</span></label>
            <input type="password" id="adminPassword" class="input-field" placeholder="Enter password" required>
          </div>

          <button type="submit" id="adminLoginBtn" class="submit-btn">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            Admin Login
          </button>
        </div>
      </form>

      <!-- Admin Dashboard -->
      <div id="adminDashboard" style="display: none;">
        <!-- Top Bar -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <button id="logoutBtn" class="confirm-no" style="padding: 10px 20px; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>

        <!-- Statistics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="stat-card">
            <div style="margin-bottom: 8px;">
              <svg width="40" height="40" fill="#10b981" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div id="totalRegistrations" class="stat-value" style="color: #10b981;">0</div>
            <div class="stat-label">Total Registrations</div>
          </div>

          <div class="stat-card">
            <div style="margin-bottom: 8px;">
              <svg width="40" height="40" fill="#06b6d4" viewBox="0 0 24 24">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
            </div>
            <div id="totalCheckins" class="stat-value" style="color: #06b6d4;">0</div>
            <div class="stat-label">Total Check-ins</div>
          </div>

          <div class="stat-card">
            <div style="margin-bottom: 8px;">
              <svg width="40" height="40" fill="#f59e0b" viewBox="0 0 24 24">
                <path d="M7 11H1v2h6v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-11h6v-2h-6V9c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2z"/>
              </svg>
            </div>
            <div id="todayCheckins" class="stat-value" style="color: #f59e0b;">0</div>
            <div class="stat-label">Today's Check-ins</div>
          </div>
        </div>

        <!-- Service Breakdown Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="stat-card">
            <div style="margin-bottom: 8px;">
              <svg width="40" height="40" fill="#8b5cf6" viewBox="0 0 24 24">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
              </svg>
            </div>
            <div id="printingCount" class="stat-value" style="color: #8b5cf6;">0</div>
            <div class="stat-label">Printing Services</div>
          </div>

          <div class="stat-card">
            <div style="margin-bottom: 8px;">
              <svg width="40" height="40" fill="#ec4899" viewBox="0 0 24 24">
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
              </svg>
            </div>
            <div id="pcUseCount" class="stat-value" style="color: #ec4899;">0</div>
            <div class="stat-label">PC Use Services</div>
          </div>

          <div class="stat-card">
            <div style="margin-bottom: 8px;">
              <svg width="40" height="40" fill="#14b8a6" viewBox="0 0 24 24">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            </div>
            <div id="trainingCount" class="stat-value" style="color: #14b8a6;">0</div>
            <div class="stat-label">Training Services</div>
          </div>
        </div>

        <!-- Registrations Table -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800">Recent Registrations</h2>
          </div>

          <!-- Filters -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #0369a1; display: block; margin-bottom: 6px;">Sort By</label>
                <select id="regSortBy" class="input-field" style="font-size: 13px; padding: 10px 12px;">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                </select>
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #0369a1; display: block; margin-bottom: 6px;">From Date</label>
                <input type="date" id="regStartDate" class="input-field" style="font-size: 13px; padding: 10px 12px;">
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #0369a1; display: block; margin-bottom: 6px;">To Date</label>
                <input type="date" id="regEndDate" class="input-field" style="font-size: 13px; padding: 10px 12px;">
              </div>
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 600; color: #0369a1; display: block; margin-bottom: 6px;">Search by Name or Email</label>
              <input type="text" id="regSearch" class="input-field" placeholder="Search..." style="font-size: 13px; padding: 10px 12px;">
            </div>
          </div>

          <div id="regLoading" class="loading-card" style="display: none;">
            <span class="spinner" aria-hidden="true"></span>
            <span>Loading registrations...</span>
          </div>
          <div style="overflow-x: auto;">
            <table id="registrationTable">
              <thead>
                <tr>
                  <th>Reg #</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Agency</th>
                  <th>Region</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody id="registrationTableBody">
                <tr>
                  <td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">No registrations yet</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; flex-wrap: wrap; gap: 12px;">
            <span id="regPaginationInfo" style="color: #64748b; font-size: 13px; font-weight: 600;">Page 1 of 1</span>
            <div style="display: flex; gap: 8px;">
              <button id="regPrevBtn" class="confirm-no" style="padding: 8px 16px; font-size: 13px; display: flex; align-items: center; gap: 6px;">← Prev</button>
              <button id="regNextBtn" class="confirm-no" style="padding: 8px 16px; font-size: 13px; display: flex; align-items: center; gap: 6px;">Next →</button>
            </div>
          </div>
        </div>

        <!-- Check-ins Table -->
        <div class="form-section">
          <div class="section-header" style="border-color: #10b981;">
            <div class="section-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800">Recent Check-ins</h2>
          </div>

          <div style="display: flex; justify-content: flex-end; margin: 6px 0 12px;">
            <button id="exportCheckinsBtn" class="confirm-no" style="padding: 8px 14px; font-size: 13px; display: flex; align-items: center; gap: 6px;">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4h5.66V9h3.84L12 2z"/>
              </svg>
              Export CSV
            </button>
          </div>

          <!-- Filters -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #065f46; display: block; margin-bottom: 6px;">Sort By</label>
                <select id="checkinSortBy" class="input-field" style="font-size: 13px; padding: 10px 12px;">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #065f46; display: block; margin-bottom: 6px;">Service</label>
                <select id="serviceFilter" class="input-field" style="font-size: 13px; padding: 10px 12px;">
                  <option value="">All Services</option>
                  <option value="Printing">🖨️ Printing</option>
                  <option value="PC Use">💻 PC Use</option>
                  <option value="Training">📚 Training</option>
                </select>
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #065f46; display: block; margin-bottom: 6px;">From Date</label>
                <input type="date" id="checkinStartDate" class="input-field" style="font-size: 13px; padding: 10px 12px;">
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #065f46; display: block; margin-bottom: 6px;">To Date</label>
                <input type="date" id="checkinEndDate" class="input-field" style="font-size: 13px; padding: 10px 12px;">
              </div>
            </div>
          </div>

          <div id="checkinLoading" class="loading-card" style="display: none;">
            <span class="spinner" aria-hidden="true"></span>
            <span>Loading check-ins...</span>
          </div>
          <div style="overflow-x: auto;">
            <table id="checkinTable">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Services</th>
                  <th>Check-in Time</th>
                </tr>
              </thead>
              <tbody id="checkinTableBody">
                <tr>
                  <td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">No check-ins yet</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; flex-wrap: wrap; gap: 12px;">
            <span id="checkinPaginationInfo" style="color: #64748b; font-size: 13px; font-weight: 600;">Page 1 of 1</span>
            <div style="display: flex; gap: 8px;">
              <button id="checkinPrevBtn" class="confirm-no" style="padding: 8px 16px; font-size: 13px; display: flex; align-items: center; gap: 6px;">← Prev</button>
              <button id="checkinNextBtn" class="confirm-no" style="padding: 8px 16px; font-size: 13px; display: flex; align-items: center; gap: 6px;">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function setupAdminDashboard(): void {
	const loginForm = document.getElementById("adminLoginForm") as HTMLFormElement;
	const dashboard = document.getElementById("adminDashboard") as HTMLDivElement;
	const logoutBtn = document.getElementById("logoutBtn");

	loginForm?.addEventListener("submit", async (e) => {
		e.preventDefault();
		const loginBtn = document.getElementById("adminLoginBtn") as HTMLButtonElement | null;

		const username = (document.getElementById("adminUsername") as HTMLInputElement).value;
		const password = (document.getElementById("adminPassword") as HTMLInputElement).value;

		if (username === "admin" && password === "Password123!") {
			try {
				setButtonLoading(loginBtn, true, "Signing in...");
				loginForm.style.display = "none";
				dashboard.style.display = "block";
				await loadAdminData();
				showToast("✓ Admin login successful!");
			} finally {
				setButtonLoading(loginBtn, false);
			}
		} else {
			showToast("Invalid credentials", "error");
		}
	});

	logoutBtn?.addEventListener("click", () => {
		dashboard.style.display = "none";
		loginForm.style.display = "block";
		loginForm.reset();
		showToast("Logged out");
	});

	document.getElementById("exportCheckinsBtn")?.addEventListener("click", () => {
		exportCheckinsCsv();
	});

	// Setup filter listeners
	document.getElementById("regSortBy")?.addEventListener("change", filterAndDisplayRegistrations);
	document.getElementById("regStartDate")?.addEventListener("change", filterAndDisplayRegistrations);
	document.getElementById("regEndDate")?.addEventListener("change", filterAndDisplayRegistrations);
	document.getElementById("regSearch")?.addEventListener("input", filterAndDisplayRegistrations);

	document.getElementById("regPrevBtn")?.addEventListener("click", () => {
		if (regCurrentPage > 1) {
			regCurrentPage--;
			displayRegistrationPage();
		}
	});

	document.getElementById("regNextBtn")?.addEventListener("click", () => {
		const totalPages = Math.ceil(filteredRegistrations.length / regItemsPerPage);
		if (regCurrentPage < totalPages) {
			regCurrentPage++;
			displayRegistrationPage();
		}
	});

	document.getElementById("checkinSortBy")?.addEventListener("change", filterAndDisplayCheckins);
	document.getElementById("serviceFilter")?.addEventListener("change", filterAndDisplayCheckins);
	document.getElementById("checkinStartDate")?.addEventListener("change", filterAndDisplayCheckins);
	document.getElementById("checkinEndDate")?.addEventListener("change", filterAndDisplayCheckins);

	document.getElementById("checkinPrevBtn")?.addEventListener("click", () => {
		if (checkinCurrentPage > 1) {
			checkinCurrentPage--;
			displayCheckinPage();
		}
	});

	document.getElementById("checkinNextBtn")?.addEventListener("click", () => {
		const totalPages = Math.ceil(filteredCheckins.length / checkinItemsPerPage);
		if (checkinCurrentPage < totalPages) {
			checkinCurrentPage++;
			displayCheckinPage();
		}
	});
}

async function loadAdminData() {
	const regLoading = document.getElementById("regLoading") as HTMLDivElement | null;
	const checkinLoading = document.getElementById("checkinLoading") as HTMLDivElement | null;
	if (regLoading) regLoading.style.display = "flex";
	if (checkinLoading) checkinLoading.style.display = "flex";

	try {
		// Load stats
		const statsResponse = await api.getStats();
		if (statsResponse.success) {
			const stats = statsResponse.stats;
			document.getElementById("totalRegistrations")!.textContent = stats.total_registrations.toString();
			document.getElementById("totalCheckins")!.textContent = stats.total_checkins.toString();
			document.getElementById("todayCheckins")!.textContent = stats.today_checkins.toString();
			document.getElementById("printingCount")!.textContent = stats.services.printing.toString();
			document.getElementById("pcUseCount")!.textContent = stats.services.pc_use.toString();
			document.getElementById("trainingCount")!.textContent = stats.services.training.toString();
		}

		// Load registrations
		const usersResponse = await api.getUsers({ limit: 1000 });
		if (usersResponse.success) {
			registrations = usersResponse.users;
			filterAndDisplayRegistrations();
		}

		// Load check-ins
		const logsResponse = await api.getLogs({ limit: 1000 });
		if (logsResponse.success) {
			checkins = logsResponse.logs;
			filterAndDisplayCheckins();
		}
	} catch (error) {
		showToast("Failed to load admin data", "error");
	} finally {
		if (regLoading) regLoading.style.display = "none";
		if (checkinLoading) checkinLoading.style.display = "none";
	}
}

function filterAndDisplayRegistrations() {
	const sortBy = (document.getElementById("regSortBy") as HTMLSelectElement).value;
	const startDate = (document.getElementById("regStartDate") as HTMLInputElement).value;
	const endDate = (document.getElementById("regEndDate") as HTMLInputElement).value;
	const searchText = (document.getElementById("regSearch") as HTMLInputElement).value.toLowerCase();

	let filtered = registrations.filter((r) => {
		const regDate = new Date(r.created_at * 1000);
		const start = startDate ? new Date(startDate) : new Date("1900-01-01");
		const end = endDate ? new Date(endDate) : new Date("2100-12-31");

		const dateMatch = regDate >= start && regDate <= end;
		const searchMatch =
			!searchText ||
			r.first_name.toLowerCase().includes(searchText) ||
			r.last_name.toLowerCase().includes(searchText) ||
			r.email.toLowerCase().includes(searchText);

		return dateMatch && searchMatch;
	});

	if (sortBy === "newest") {
		filtered.sort((a, b) => b.created_at - a.created_at);
	} else if (sortBy === "oldest") {
		filtered.sort((a, b) => a.created_at - b.created_at);
	} else if (sortBy === "name_asc") {
		filtered.sort((a, b) => (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name));
	} else if (sortBy === "name_desc") {
		filtered.sort((a, b) => (b.first_name + b.last_name).localeCompare(a.first_name + a.last_name));
	}

	filteredRegistrations = filtered;
	regCurrentPage = 1;
	displayRegistrationPage();
}

function displayRegistrationPage() {
	const startIdx = (regCurrentPage - 1) * regItemsPerPage;
	const endIdx = startIdx + regItemsPerPage;
	const pageData = filteredRegistrations.slice(startIdx, endIdx);

	const regBody = document.getElementById("registrationTableBody");
	if (!regBody) return;

	if (pageData.length === 0) {
		regBody.innerHTML =
			'<tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">No registrations found</td></tr>';
	} else {
		regBody.innerHTML = pageData
			.map(
				(r, idx) => `
          <tr style="background: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
            <td style="font-weight: 600; color: #0ea5e9;">${startIdx + idx + 1}</td>
            <td style="font-family: monospace; font-weight: 600; color: #0369a1;">${r.user_id}</td>
            <td style="color: #1e293b; font-weight: 500;">${r.first_name} ${r.last_name}</td>
            <td style="color: #64748b; font-size: 13px;">${r.email}</td>
            <td style="color: #64748b;">${r.agency}</td>
            <td style="color: #64748b;">${r.region}</td>
            <td style="color: #64748b; font-size: 13px;">${new Date(r.created_at * 1000).toLocaleString()}</td>
          </tr>
        `
			)
			.join("");
	}

	const totalPages = Math.ceil(filteredRegistrations.length / regItemsPerPage) || 1;
	const paginationInfo = document.getElementById("regPaginationInfo");
	if (paginationInfo) {
		paginationInfo.textContent = `Page ${regCurrentPage} of ${totalPages} (${filteredRegistrations.length} total)`;
	}

	const prevBtn = document.getElementById("regPrevBtn") as HTMLButtonElement;
	const nextBtn = document.getElementById("regNextBtn") as HTMLButtonElement;
	if (prevBtn) prevBtn.disabled = regCurrentPage === 1;
	if (nextBtn) nextBtn.disabled = regCurrentPage === totalPages;
}

function filterAndDisplayCheckins() {
	const sortBy = (document.getElementById("checkinSortBy") as HTMLSelectElement).value;
	const serviceFilter = (document.getElementById("serviceFilter") as HTMLSelectElement).value;
	const startDate = (document.getElementById("checkinStartDate") as HTMLInputElement).value;
	const endDate = (document.getElementById("checkinEndDate") as HTMLInputElement).value;

	let filtered = checkins.filter((c) => {
		const checkinDate = new Date(c.entry_time * 1000);
		const start = startDate ? new Date(startDate) : new Date("1900-01-01");
		const end = endDate ? new Date(endDate) : new Date("2100-12-31");

		const dateMatch = checkinDate >= start && checkinDate <= end;
		const serviceMatch = !serviceFilter || c.services.includes(serviceFilter as Service);

		return dateMatch && serviceMatch;
	});

	if (sortBy === "newest") {
		filtered.sort((a, b) => b.entry_time - a.entry_time);
	} else {
		filtered.sort((a, b) => a.entry_time - b.entry_time);
	}

	filteredCheckins = filtered;
	checkinCurrentPage = 1;
	displayCheckinPage();
}

function displayCheckinPage() {
	const startIdx = (checkinCurrentPage - 1) * checkinItemsPerPage;
	const endIdx = startIdx + checkinItemsPerPage;
	const pageData = filteredCheckins.slice(startIdx, endIdx);

	const checkinBody = document.getElementById("checkinTableBody");
	if (!checkinBody) return;

	if (pageData.length === 0) {
		checkinBody.innerHTML =
			'<tr><td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">No check-ins found</td></tr>';
	} else {
		checkinBody.innerHTML = pageData
			.map((c, idx) => {
				const reg = registrations.find((r) => r.user_id === c.user_id);
				const name = reg ? `${reg.first_name} ${reg.last_name}` : "Unknown";
				const serviceColors: Record<string, string> = {
					Printing: "#8b5cf6",
					"PC Use": "#ec4899",
					Training: "#14b8a6",
				};
				const services = c.services
					.map(
						(s) =>
							`<span style="background: ${serviceColors[s] || "#94a3b8"}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; margin: 2px;">${s}</span>`
					)
					.join(" ");

				return `
            <tr style="background: ${idx % 2 === 0 ? "#ffffff" : "#f0fdf4"};">
              <td style="font-family: monospace; font-weight: 600; color: #059669;">${c.user_id}</td>
              <td style="color: #1e293b; font-weight: 500;">${name}</td>
              <td>${services}</td>
              <td style="color: #64748b; font-size: 13px;">${new Date(c.entry_time * 1000).toLocaleString()}</td>
            </tr>
          `;
			})
			.join("");
	}

	const totalPages = Math.ceil(filteredCheckins.length / checkinItemsPerPage) || 1;
	const paginationInfo = document.getElementById("checkinPaginationInfo");
	if (paginationInfo) {
		paginationInfo.textContent = `Page ${checkinCurrentPage} of ${totalPages} (${filteredCheckins.length} total)`;
	}

	const prevBtn = document.getElementById("checkinPrevBtn") as HTMLButtonElement;
	const nextBtn = document.getElementById("checkinNextBtn") as HTMLButtonElement;
	if (prevBtn) prevBtn.disabled = checkinCurrentPage === 1;
	if (nextBtn) nextBtn.disabled = checkinCurrentPage === totalPages;
}

function exportCheckinsCsv() {
	if (filteredCheckins.length === 0) {
		showToast("No check-ins to export", "error");
		return;
	}

	const header = ["User ID", "Name", "Services", "Check-in Time"];
	const rows = filteredCheckins.map((entry) => {
		const reg = registrations.find((r) => r.user_id === entry.user_id);
		const name = reg ? `${reg.first_name} ${reg.last_name}` : "Unknown";
		const services = entry.services.join("; ");
		const checkinTime = new Date(entry.entry_time * 1000).toLocaleString();
		return [entry.user_id, name, services, checkinTime].map(escapeCsvValue);
	});

	const csv = [header.map(escapeCsvValue).join(","), ...rows.map((row) => row.join(","))].join("\n");
	const today = new Date().toISOString().slice(0, 10);
	downloadCsvFile(csv, `attendance-logs-${today}.csv`);
}

function escapeCsvValue(value: string): string {
	if (/[",\n]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

function downloadCsvFile(csv: string, filename: string) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
	showToast("✓ Attendance logs exported!");
}
