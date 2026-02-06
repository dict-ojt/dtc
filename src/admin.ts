import "./style.css";
import { showToast, setButtonLoading } from "./utils";
import { api } from "./api";
import type { UserRegistration, CheckInEntry } from "./types";

// Admin state
let registrations: UserRegistration[] = [];
let checkins: CheckInEntry[] = [];
let currentCalendarDate = new Date();
let selectedDate: string | null = null;
let activeView: "checkins" | "registrations" = "checkins";
let displayMode: "logs" | "calendar" | "analytics" = "logs";
let regCurrentPage = 1;
let checkinCurrentPage = 1;
const itemsPerPage = 10;

// Filter state
let checkinSortBy = "newest";
let checkinServiceFilter = "";
let checkinStartDate = "";
let checkinEndDate = "";
let checkinSearch = "";

let regSortBy = "newest";
let regStartDate = "";
let regEndDate = "";
let regSearch = "";
let regAgencySearch = "";

// Check authentication
function checkAuth(): boolean {
	return sessionStorage.getItem("dict_admin_auth") === "true";
}

function setAuth(authenticated: boolean): void {
	if (authenticated) {
		sessionStorage.setItem("dict_admin_auth", "true");
	} else {
		sessionStorage.removeItem("dict_admin_auth");
	}
}

function renderApp(): void {
	const app = document.getElementById("app");
	if (!app) return;

	if (!checkAuth()) {
		renderLoginPage(app);
	} else {
		renderDashboard(app);
	}
}

function renderLoginPage(app: HTMLElement): void {
	app.innerHTML = `
    <div class="admin-login-page">
      <div class="admin-login-container">
        <div class="admin-login-header">
          <div class="admin-logo-container">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/DICT_Agency_Seal.svg/1200px-DICT_Agency_Seal.svg.png" 
                 alt="DICT Logo" 
                 style="width: 80px; height: 80px; object-fit: contain;"
                 onerror="this.src='https://imgur.com/hcMvsXb.png';">
          </div>
          <h1>DICT Region 2</h1>
          <p>Admin Dashboard</p>
        </div>
        
        <form id="adminLoginForm" class="admin-login-form">
          <div class="input-group">
            <label for="adminUsername" class="input-label">Username</label>
            <input type="text" id="adminUsername" class="input-field" placeholder="Enter username" required autocomplete="username">
          </div>
          
          <div class="input-group">
            <label for="adminPassword" class="input-label">Password</label>
            <input type="password" id="adminPassword" class="input-field" placeholder="Enter password" required autocomplete="current-password">
          </div>
          
          <button type="submit" id="adminLoginBtn" class="submit-btn admin-btn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            Sign In
          </button>
        </form>
        
        <div class="admin-login-footer">
          <a href="index.html" class="back-link">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Main Site
          </a>
        </div>
      </div>
    </div>
  `;

	setupLoginForm();
}

function setupLoginForm(): void {
	const form = document.getElementById("adminLoginForm") as HTMLFormElement;

	form?.addEventListener("submit", async (e) => {
		e.preventDefault();
		const loginBtn = document.getElementById("adminLoginBtn") as HTMLButtonElement;

		const username = (document.getElementById("adminUsername") as HTMLInputElement).value;
		const password = (document.getElementById("adminPassword") as HTMLInputElement).value;

		if (username === "admin" && password === "Password123!") {
			try {
				setButtonLoading(loginBtn, true, "Signing in...");
				await new Promise(resolve => setTimeout(resolve, 500));
				setAuth(true);
				showToast("Login successful!");
				renderApp();
			} finally {
				setButtonLoading(loginBtn, false);
			}
		} else {
			showToast("Invalid credentials", "error");
		}
	});
}

function renderDashboard(app: HTMLElement): void {
	app.innerHTML = `
    <div class="admin-dashboard">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/DICT_Agency_Seal.svg/1200px-DICT_Agency_Seal.svg.png" 
               alt="DICT Logo" 
               class="sidebar-logo"
               onerror="this.src='https://imgur.com/hcMvsXb.png';">
          <div class="sidebar-title">
            <h2>DICT Region 2</h2>
            <span>Admin Dashboard</span>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <button class="nav-item ${activeView === 'checkins' ? 'active' : ''}" data-view="checkins">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
            </svg>
            Check-ins
          </button>
          <button class="nav-item ${activeView === 'registrations' ? 'active' : ''}" data-view="registrations">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6z"/>
            </svg>
            Registrations
          </button>
          <div class="nav-divider"></div>
          <button class="nav-item" id="securityBtn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            Security
          </button>
        </nav>
        
        <div class="sidebar-footer">
          <a href="index.html" class="nav-item">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Main Site
          </a>
          <button id="logoutBtn" class="nav-item logout">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <!-- Top Header (No Themes) -->
        <header class="admin-header">
          <div class="header-left">
            <button id="menuToggle" class="menu-toggle">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <h1>Administrator Dashboard</h1>
          </div>
          <div class="header-right">
             <div class="admin-user-profile">
                <div class="admin-avatar">A</div>
                <div class="admin-info">
                   <span class="admin-name">DICT Admin</span>
                   <span class="admin-role">Super User</span>
                </div>
             </div>
          </div>
        </header>

        <!-- Statistics Cards -->
        <section class="stats-section">
          <div class="stat-card stat-blue clickable-stat" data-stat="registrations">
            <div class="stat-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div class="stat-info">
              <span id="totalRegistrations" class="stat-value">0</span>
              <span class="stat-label">Total Registrations</span>
            </div>
          </div>

          <div class="stat-card stat-red clickable-stat" data-stat="checkins">
            <div class="stat-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
            </div>
            <div class="stat-info">
              <span id="totalCheckins" class="stat-value">0</span>
              <span class="stat-label">Total Check-ins</span>
            </div>
          </div>

          <div class="stat-card stat-yellow clickable-stat" data-stat="today-checkins">
            <div class="stat-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
            </div>
            <div class="stat-info">
              <span id="todayCheckins" class="stat-value">0</span>
              <span class="stat-label">Today's Check-ins</span>
            </div>
          </div>
        </section>

        <!-- Service Statistics -->
        <section class="service-stats">
          <div class="service-stat printing clickable-stat" data-stat="printing">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
            </svg>
            <span id="printingCount" class="service-count">0</span>
            <span class="service-label">Printing</span>
          </div>
          <div class="service-stat pcuse clickable-stat" data-stat="pcuse">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
            </svg>
            <span id="pcUseCount" class="service-count">0</span>
            <span class="service-label">PC Use</span>
          </div>
          <div class="service-stat training clickable-stat" data-stat="training">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>
            <span id="trainingCount" class="service-count">0</span>
            <span class="service-label">Training</span>
          </div>
        </section>

        <!-- View Mode Toggle & Title -->
        <section class="view-header">
          <h2 class="view-title">${displayMode === 'analytics' ? 'Analytics' : (activeView === 'checkins' ? 'Check-ins' : 'Registrations')}</h2>
          <div class="view-toggle">
            <button class="toggle-btn ${displayMode === 'logs' ? 'active' : ''}" data-mode="logs">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
              Logs
            </button>
            <button class="toggle-btn ${displayMode === 'calendar' ? 'active' : ''}" data-mode="calendar">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
              Calendar
            </button>
            <button class="toggle-btn ${displayMode === 'analytics' ? 'active' : ''}" data-mode="analytics">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Analytics
            </button>
          </div>
        </section>

        <!-- Analytics Section (shown when analytics mode) -->
        <section id="analyticsSection" class="analytics-section" style="display: ${displayMode === 'analytics' ? 'block' : 'none'}">
          <div class="analytics-grid">
            <!-- Weekly Activity Chart -->
            <div class="analytics-card">
              <h3 class="analytics-card-title">Weekly Check-ins</h3>
              <div id="weeklyChart" class="chart-container"></div>
            </div>
            
            <!-- Service Distribution -->
            <div class="analytics-card">
              <h3 class="analytics-card-title">Service Distribution</h3>
              <div id="serviceChart" class="chart-container"></div>
            </div>
            
            <!-- Registration Trends -->
            <div class="analytics-card">
              <h3 class="analytics-card-title">Monthly Registrations</h3>
              <div id="registrationChart" class="chart-container"></div>
            </div>
            
            <!-- Top Agencies -->
            <div class="analytics-card">
              <h3 class="analytics-card-title">Top Agencies</h3>
              <div id="agencyChart" class="chart-container"></div>
            </div>
          </div>
        </section>

        <!-- Calendar Section (shown when calendar mode) -->
        <section id="calendarSection" class="calendar-section" style="display: ${displayMode === 'calendar' ? 'block' : 'none'}">
          <div class="calendar-header">
            <div class="calendar-nav">
              <button id="prevMonth" class="calendar-nav-btn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <span id="currentMonth" class="current-month"></span>
              <button id="nextMonth" class="calendar-nav-btn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="calendar-grid">
            <div class="calendar-weekdays">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div id="calendarDays" class="calendar-days"></div>
          </div>

          <!-- Selected Date Data -->
          <div id="selectedDateSection" style="display: ${selectedDate ? 'block' : 'none'}; margin-top: 1.5rem;">
            <h3 id="selectedDateTitle" style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem;"></h3>
            <div class="table-container">
              <table id="calendarDataTable">
                <thead id="calendarTableHead"></thead>
                <tbody id="calendarTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Logs Section (shown when logs mode) -->
        <section id="logsSection" class="data-section" style="display: ${displayMode === 'logs' ? 'block' : 'none'}">
          <!-- Filters -->
          <div class="filters-section">
            <div class="filters-grid">
              ${activeView === 'checkins' ? `
                <div class="filter-group">
                  <label class="filter-label">Sort By</label>
                  <select id="checkinSortBy" class="filter-select">
                    <option value="newest" ${checkinSortBy === 'newest' ? 'selected' : ''}>Newest First</option>
                    <option value="oldest" ${checkinSortBy === 'oldest' ? 'selected' : ''}>Oldest First</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">Service</label>
                  <select id="checkinServiceFilter" class="filter-select">
                    <option value="" ${checkinServiceFilter === '' ? 'selected' : ''}>All Services</option>
                    <option value="Printing" ${checkinServiceFilter === 'Printing' ? 'selected' : ''}>Printing</option>
                    <option value="PC Use" ${checkinServiceFilter === 'PC Use' ? 'selected' : ''}>PC Use</option>
                    <option value="Training" ${checkinServiceFilter === 'Training' ? 'selected' : ''}>Training</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">From Date</label>
                  <input type="date" id="checkinStartDate" class="filter-input" value="${checkinStartDate}">
                </div>
                <div class="filter-group">
                  <label class="filter-label">To Date</label>
                  <input type="date" id="checkinEndDate" class="filter-input" value="${checkinEndDate}">
                </div>
                <div class="filter-group filter-search">
                  <label class="filter-label">Search</label>
                  <input type="text" id="checkinSearch" class="filter-input" placeholder="Search by User ID or Name..." value="${checkinSearch}">
                </div>
              ` : `
                <div class="filter-group">
                  <label class="filter-label">Sort By</label>
                  <select id="regSortBy" class="filter-select">
                    <option value="newest" ${regSortBy === 'newest' ? 'selected' : ''}>Newest First</option>
                    <option value="oldest" ${regSortBy === 'oldest' ? 'selected' : ''}>Oldest First</option>
                    <option value="name_asc" ${regSortBy === 'name_asc' ? 'selected' : ''}>Name A-Z</option>
                    <option value="name_desc" ${regSortBy === 'name_desc' ? 'selected' : ''}>Name Z-A</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">From Date</label>
                  <input type="date" id="regStartDate" class="filter-input" value="${regStartDate}">
                </div>
                <div class="filter-group">
                  <label class="filter-label">To Date</label>
                  <input type="date" id="regEndDate" class="filter-input" value="${regEndDate}">
                </div>
                <div class="filter-group">
                  <label class="filter-label">Agency</label>
                  <input type="text" id="regAgencySearch" class="filter-input" placeholder="Search by agency..." value="${regAgencySearch}">
                </div>
                <div class="filter-group filter-search">
                  <label class="filter-label">Search</label>
                  <input type="text" id="regSearch" class="filter-input" placeholder="Search by Name or Email..." value="${regSearch}">
                </div>
              `}
            </div>
            <div class="filters-actions">
              <button id="clearFilters" class="clear-filters-btn">Clear Filters</button>
              <button id="exportBtn" class="export-btn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          <div id="dataLoading" class="loading-card" style="display: none;">
            <span class="spinner"></span>
            <span>Loading data...</span>
          </div>

          <div class="table-container">
            <table id="dataTable">
              <thead id="tableHead"></thead>
              <tbody id="tableBody"></tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <span id="paginationInfo" class="pagination-info">Page 1 of 1</span>
            <div class="pagination-buttons">
              <button id="prevPage" class="pagination-btn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                Previous
              </button>
              <button id="nextPage" class="pagination-btn">
                Next
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <!-- Mobile Overlay -->
      <div id="sidebarOverlay" class="sidebar-overlay"></div>
    </div>
    <div id="toastContainer"></div>

    <!-- Security Modal -->
    <div id="securityModal" class="admin-modal">
      <div class="admin-modal-content">
        <div class="admin-modal-header">
          <h3>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            Security Settings
          </h3>
          <button id="closeSecurityModal" class="modal-close-btn">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <form id="securityForm" class="admin-modal-body">
          <div class="input-group">
            <label for="currentPassword" class="input-label">Current Password</label>
            <input type="password" id="currentPassword" class="input-field" placeholder="Enter current password" required>
          </div>
          <div class="input-group">
            <label for="newUsername" class="input-label">New Username (optional)</label>
            <input type="text" id="newUsername" class="input-field" placeholder="Leave blank to keep current">
          </div>
          <div class="input-group">
            <label for="newPassword" class="input-label">New Password (optional)</label>
            <input type="password" id="newPassword" class="input-field" placeholder="Leave blank to keep current">
          </div>
          <div class="input-group">
            <label for="confirmPassword" class="input-label">Confirm New Password</label>
            <input type="password" id="confirmPassword" class="input-field" placeholder="Confirm new password">
          </div>
          <div class="admin-modal-footer">
            <button type="button" id="cancelSecurityBtn" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

	setupDashboard();
}

function setupDashboard(): void {
	// Theme switcher code removed


	// Navigation
	document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
		btn.addEventListener("click", () => {
			const view = (btn as HTMLElement).dataset.view as "checkins" | "registrations";
			activeView = view;
			selectedDate = null;
			regCurrentPage = 1;
			checkinCurrentPage = 1;
			renderApp();
		});
	});

	// View mode toggle
	document.querySelectorAll(".toggle-btn").forEach(btn => {
		btn.addEventListener("click", () => {
			const mode = (btn as HTMLElement).dataset.mode as "logs" | "calendar" | "analytics";
			displayMode = mode;
			selectedDate = null;
			renderApp();
		});
	});

	// Logout
	document.getElementById("logoutBtn")?.addEventListener("click", () => {
		setAuth(false);
		showToast("Logged out successfully");
		renderApp();
	});

	// Mobile menu
	const menuToggle = document.getElementById("menuToggle");
	const sidebar = document.querySelector(".admin-sidebar");
	const overlay = document.getElementById("sidebarOverlay");

	menuToggle?.addEventListener("click", () => {
		sidebar?.classList.toggle("open");
		overlay?.classList.toggle("active");
	});

	overlay?.addEventListener("click", () => {
		sidebar?.classList.remove("open");
		overlay?.classList.remove("active");
	});

	// Clickable stat cards
	document.querySelectorAll(".clickable-stat").forEach(card => {
		card.addEventListener("click", () => {
			const stat = (card as HTMLElement).dataset.stat;
			handleStatClick(stat || "");
		});
	});

	// Security modal
	const securityBtn = document.getElementById("securityBtn");
	const securityModal = document.getElementById("securityModal");
	const closeSecurityModal = document.getElementById("closeSecurityModal");
	const cancelSecurityBtn = document.getElementById("cancelSecurityBtn");
	const securityForm = document.getElementById("securityForm") as HTMLFormElement;

	securityBtn?.addEventListener("click", () => {
		securityModal?.classList.add("active");
	});

	closeSecurityModal?.addEventListener("click", () => {
		securityModal?.classList.remove("active");
	});

	cancelSecurityBtn?.addEventListener("click", () => {
		securityModal?.classList.remove("active");
	});

	securityModal?.addEventListener("click", (e) => {
		if (e.target === securityModal) {
			securityModal.classList.remove("active");
		}
	});

	securityForm?.addEventListener("submit", (e) => {
		e.preventDefault();
		handleSecurityUpdate();
	});

	// Calendar navigation
	document.getElementById("prevMonth")?.addEventListener("click", () => {
		currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
		renderCalendar();
	});

	document.getElementById("nextMonth")?.addEventListener("click", () => {
		currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
		renderCalendar();
	});

	// Filter listeners
	if (activeView === "checkins") {
		document.getElementById("checkinSortBy")?.addEventListener("change", (e) => {
			checkinSortBy = (e.target as HTMLSelectElement).value;
			checkinCurrentPage = 1;
			displayData();
		});
		document.getElementById("checkinServiceFilter")?.addEventListener("change", (e) => {
			checkinServiceFilter = (e.target as HTMLSelectElement).value;
			checkinCurrentPage = 1;
			displayData();
		});
		document.getElementById("checkinStartDate")?.addEventListener("change", (e) => {
			checkinStartDate = (e.target as HTMLInputElement).value;
			checkinCurrentPage = 1;
			displayData();
		});
		document.getElementById("checkinEndDate")?.addEventListener("change", (e) => {
			checkinEndDate = (e.target as HTMLInputElement).value;
			checkinCurrentPage = 1;
			displayData();
		});
		document.getElementById("checkinSearch")?.addEventListener("input", (e) => {
			checkinSearch = (e.target as HTMLInputElement).value;
			checkinCurrentPage = 1;
			displayData();
		});
	} else {
		document.getElementById("regSortBy")?.addEventListener("change", (e) => {
			regSortBy = (e.target as HTMLSelectElement).value;
			regCurrentPage = 1;
			displayData();
		});
		document.getElementById("regStartDate")?.addEventListener("change", (e) => {
			regStartDate = (e.target as HTMLInputElement).value;
			regCurrentPage = 1;
			displayData();
		});
		document.getElementById("regEndDate")?.addEventListener("change", (e) => {
			regEndDate = (e.target as HTMLInputElement).value;
			regCurrentPage = 1;
			displayData();
		});
		document.getElementById("regSearch")?.addEventListener("input", (e) => {
			regSearch = (e.target as HTMLInputElement).value;
			regCurrentPage = 1;
			displayData();
		});
		document.getElementById("regAgencySearch")?.addEventListener("input", (e) => {
			regAgencySearch = (e.target as HTMLInputElement).value;
			regCurrentPage = 1;
			displayData();
		});
	}

	// Clear filters
	document.getElementById("clearFilters")?.addEventListener("click", () => {
		if (activeView === "checkins") {
			checkinSortBy = "newest";
			checkinServiceFilter = "";
			checkinStartDate = "";
			checkinEndDate = "";
			checkinSearch = "";
		} else {
			regSortBy = "newest";
			regStartDate = "";
			regEndDate = "";
			regSearch = "";
			regAgencySearch = "";
		}
		renderApp();
	});

	// Export
	document.getElementById("exportBtn")?.addEventListener("click", exportData);

	// Pagination
	document.getElementById("prevPage")?.addEventListener("click", () => {
		if (activeView === "checkins") {
			if (checkinCurrentPage > 1) {
				checkinCurrentPage--;
				displayData();
			}
		} else {
			if (regCurrentPage > 1) {
				regCurrentPage--;
				displayData();
			}
		}
	});

	document.getElementById("nextPage")?.addEventListener("click", () => {
		const data = getFilteredData();
		const totalPages = Math.ceil(data.length / itemsPerPage);
		if (activeView === "checkins") {
			if (checkinCurrentPage < totalPages) {
				checkinCurrentPage++;
				displayData();
			}
		} else {
			if (regCurrentPage < totalPages) {
				regCurrentPage++;
				displayData();
			}
		}
	});

	// Load data
	loadAdminData();
}

async function loadAdminData(): Promise<void> {
	const loading = document.getElementById("dataLoading");
	if (loading) loading.style.display = "flex";

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
		}

		// Load check-ins
		const logsResponse = await api.getLogs({ limit: 1000 });
		if (logsResponse.success) {
			checkins = logsResponse.logs;
		}

		if (displayMode === "calendar") {
			renderCalendar();
		} else if (displayMode === "analytics") {
			renderAnalytics();
		} else {
			displayData();
		}
	} catch (error) {
		showToast("Failed to load admin data", "error");
	} finally {
		if (loading) loading.style.display = "none";
	}
}

function renderCalendar(): void {
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

	const year = currentCalendarDate.getFullYear();
	const month = currentCalendarDate.getMonth();

	const monthLabel = document.getElementById("currentMonth");
	if (monthLabel) {
		monthLabel.textContent = `${monthNames[month]} ${year}`;
	}

	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Collect items per day with names
	const dayData: Record<string, { count: number; names: string[] }> = {};
	const data = activeView === "checkins" ? checkins : registrations;

	data.forEach(item => {
		const timestamp = activeView === "checkins"
			? (item as CheckInEntry).entry_time
			: (item as UserRegistration).created_at;
		const date = new Date(timestamp * 1000);
		const dateStr = formatDateKey(date);

		if (!dayData[dateStr]) {
			dayData[dateStr] = { count: 0, names: [] };
		}
		dayData[dateStr].count++;

		// Get name for display
		if (activeView === "checkins") {
			const checkin = item as CheckInEntry;
			const reg = registrations.find(r => r.user_id === checkin.user_id);
			if (reg) {
				dayData[dateStr].names.push(`${reg.first_name} ${reg.last_name}`);
			}
		} else {
			const reg = item as UserRegistration;
			dayData[dateStr].names.push(`${reg.first_name} ${reg.last_name}`);
		}
	});

	const calendarDays = document.getElementById("calendarDays");
	if (!calendarDays) return;

	let html = "";

	// Empty cells before first day
	for (let i = 0; i < firstDay; i++) {
		html += `<div class="calendar-day empty"></div>`;
	}

	// Days of month
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month, day);
		const dateStr = formatDateKey(date);
		const data = dayData[dateStr] || { count: 0, names: [] };
		const isToday = date.getTime() === today.getTime();
		const isSelected = selectedDate === dateStr;
		const hasData = data.count > 0;

		// Show up to 3 names and "+X MORE" for extras
		const maxNamesToShow = 3;
		const namesToShow = data.names.slice(0, maxNamesToShow);
		const extraCount = data.names.length - maxNamesToShow;

		let namesHtml = "";
		if (hasData) {
			namesHtml = `<div class="day-names">`;
			namesToShow.forEach(name => {
				namesHtml += `<div class="day-name-item">• ${name}</div>`;
			});
			if (extraCount > 0) {
				namesHtml += `<div class="day-name-more">+ ${extraCount} MORE</div>`;
			}
			namesHtml += `</div>`;
		}

		html += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasData ? 'has-data' : ''}" 
           data-date="${dateStr}">
        <div class="day-header">
          <span class="day-number">${day}</span>
          ${data.count > 0 ? `<span class="day-count">${data.count}</span>` : ''}
        </div>
        ${namesHtml}
      </div>
    `;
	}

	calendarDays.innerHTML = html;

	// Add click handlers
	document.querySelectorAll(".calendar-day[data-date]").forEach(dayEl => {
		dayEl.addEventListener("click", () => {
			const date = (dayEl as HTMLElement).dataset.date;
			if (date) {
				selectedDate = selectedDate === date ? null : date;
				renderCalendar();
				displayCalendarData();
			}
		});
	});

	displayCalendarData();
}

function displayCalendarData(): void {
	const section = document.getElementById("selectedDateSection");
	const title = document.getElementById("selectedDateTitle");
	const tableHead = document.getElementById("calendarTableHead");
	const tableBody = document.getElementById("calendarTableBody");

	if (!section || !title || !tableHead || !tableBody) return;

	if (!selectedDate) {
		section.style.display = "none";
		return;
	}

	section.style.display = "block";
	title.textContent = `${activeView === 'checkins' ? 'Check-ins' : 'Registrations'} for ${formatDisplayDate(selectedDate)}`;

	const data = (activeView === "checkins" ? checkins : registrations).filter(item => {
		const timestamp = activeView === "checkins"
			? (item as CheckInEntry).entry_time
			: (item as UserRegistration).created_at;
		return formatDateKey(new Date(timestamp * 1000)) === selectedDate;
	});

	if (activeView === "checkins") {
		tableHead.innerHTML = `<tr><th>User ID</th><th>Name</th><th>Services</th><th>Time</th></tr>`;
		if (data.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="4" class="empty-message">No check-ins on this date</td></tr>`;
		} else {
			tableBody.innerHTML = (data as CheckInEntry[]).map((c, idx) => {
				const reg = registrations.find(r => r.user_id === c.user_id);
				const name = reg ? `${reg.first_name} ${reg.last_name}` : "Unknown";
				const services = c.services.map(s => `<span class="service-tag ${s.toLowerCase().replace(' ', '-')}">${s}</span>`).join("");
				return `<tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
					<td class="user-id">${c.user_id}</td>
					<td>${name}</td>
					<td class="services-cell">${services}</td>
					<td class="timestamp">${new Date(c.entry_time * 1000).toLocaleTimeString()}</td>
				</tr>`;
			}).join("");
		}
	} else {
		tableHead.innerHTML = `<tr><th>User ID</th><th>Name</th><th>Email</th><th>Agency</th></tr>`;
		if (data.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="4" class="empty-message">No registrations on this date</td></tr>`;
		} else {
			tableBody.innerHTML = (data as UserRegistration[]).map((r, idx) => `
				<tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
					<td class="user-id">${r.user_id}</td>
					<td>${r.first_name} ${r.last_name}</td>
					<td class="email">${r.email}</td>
					<td>${r.agency}</td>
				</tr>
			`).join("");
		}
	}
}

function renderAnalytics(): void {
	// Weekly Check-ins Chart
	const weeklyContainer = document.getElementById("weeklyChart");
	if (weeklyContainer) {
		const last7Days: string[] = [];
		const dayCounts: number[] = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = formatDateKey(date);
			last7Days.push(date.toLocaleDateString("en-US", { weekday: "short" }));
			const count = checkins.filter(c => formatDateKey(new Date(c.entry_time * 1000)) === dateStr).length;
			dayCounts.push(count);
		}
		const maxCount = Math.max(...dayCounts, 1);
		weeklyContainer.innerHTML = `
			<div class="bar-chart">
				${last7Days.map((day, i) => `
					<div class="bar-group">
						<div class="bar-wrapper">
							<div class="bar" style="height: ${(dayCounts[i] / maxCount) * 100}%">
								<span class="bar-value">${dayCounts[i]}</span>
							</div>
						</div>
						<span class="bar-label">${day}</span>
					</div>
				`).join("")}
			</div>
		`;
	}

	// Service Distribution Chart
	const serviceContainer = document.getElementById("serviceChart");
	if (serviceContainer) {
		let printingCount = 0, pcUseCount = 0, trainingCount = 0;
		checkins.forEach(c => {
			if (c.services.includes("Printing")) printingCount++;
			if (c.services.includes("PC Use")) pcUseCount++;
			if (c.services.includes("Training")) trainingCount++;
		});
		const total = printingCount + pcUseCount + trainingCount || 1;
		const printingPct = (printingCount / total) * 100;
		const pcUsePct = (pcUseCount / total) * 100;
		const trainingPct = (trainingCount / total) * 100;

		serviceContainer.innerHTML = `
			<div class="donut-chart-container">
				<svg class="donut-chart" viewBox="0 0 42 42">
					<circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--gray-100)" stroke-width="3"></circle>
					<circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#8b5cf6" stroke-width="3" 
						stroke-dasharray="${printingPct} ${100 - printingPct}" stroke-dashoffset="25"></circle>
					<circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ec4899" stroke-width="3" 
						stroke-dasharray="${pcUsePct} ${100 - pcUsePct}" stroke-dashoffset="${25 - printingPct}"></circle>
					<circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#14b8a6" stroke-width="3" 
						stroke-dasharray="${trainingPct} ${100 - trainingPct}" stroke-dashoffset="${25 - printingPct - pcUsePct}"></circle>
				</svg>
				<div class="donut-legend">
					<div class="legend-item"><span class="legend-color" style="background: #8b5cf6"></span>Printing (${printingCount})</div>
					<div class="legend-item"><span class="legend-color" style="background: #ec4899"></span>PC Use (${pcUseCount})</div>
					<div class="legend-item"><span class="legend-color" style="background: #14b8a6"></span>Training (${trainingCount})</div>
				</div>
			</div>
		`;
	}

	// Monthly Registrations Chart
	const registrationContainer = document.getElementById("registrationChart");
	if (registrationContainer) {
		const last6Months: string[] = [];
		const monthCounts: number[] = [];
		for (let i = 5; i >= 0; i--) {
			const date = new Date();
			date.setMonth(date.getMonth() - i);
			const monthStr = date.toLocaleDateString("en-US", { month: "short" });
			const year = date.getFullYear();
			const month = date.getMonth();
			last6Months.push(monthStr);
			const count = registrations.filter(r => {
				const regDate = new Date(r.created_at * 1000);
				return regDate.getFullYear() === year && regDate.getMonth() === month;
			}).length;
			monthCounts.push(count);
		}
		const maxCount = Math.max(...monthCounts, 1);
		registrationContainer.innerHTML = `
			<div class="line-chart">
				<svg viewBox="0 0 300 120" preserveAspectRatio="none">
					<defs>
						<linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="var(--primary-500)" stop-opacity="0.3"/>
							<stop offset="100%" stop-color="var(--primary-500)" stop-opacity="0"/>
						</linearGradient>
					</defs>
					<polyline fill="url(#lineGradient)" stroke="none" points="0,100 ${monthCounts.map((c, i) => `${i * 60},${100 - (c / maxCount) * 80}`).join(" ")} 300,100"/>
					<polyline fill="none" stroke="var(--primary-500)" stroke-width="2" points="${monthCounts.map((c, i) => `${i * 60},${100 - (c / maxCount) * 80}`).join(" ")}"/>
					${monthCounts.map((c, i) => `<circle cx="${i * 60}" cy="${100 - (c / maxCount) * 80}" r="4" fill="var(--primary-500)"/>`).join("")}
				</svg>
				<div class="line-labels">
					${last6Months.map((m, i) => `<span>${m}<br><strong>${monthCounts[i]}</strong></span>`).join("")}
				</div>
			</div>
		`;
	}

	// Top Agencies Chart
	const agencyContainer = document.getElementById("agencyChart");
	if (agencyContainer) {
		const agencyCounts: Record<string, number> = {};
		registrations.forEach(r => {
			agencyCounts[r.agency] = (agencyCounts[r.agency] || 0) + 1;
		});
		const sortedAgencies = Object.entries(agencyCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);
		const maxAgencyCount = sortedAgencies[0]?.[1] || 1;

		agencyContainer.innerHTML = `
			<div class="horizontal-bar-chart">
				${sortedAgencies.map(([agency, count]) => `
					<div class="h-bar-group">
						<span class="h-bar-label" title="${agency}">${agency.length > 20 ? agency.substring(0, 20) + "..." : agency}</span>
						<div class="h-bar-wrapper">
							<div class="h-bar" style="width: ${(count / maxAgencyCount) * 100}%">
								<span class="h-bar-value">${count}</span>
							</div>
						</div>
					</div>
				`).join("")}
				${sortedAgencies.length === 0 ? '<p class="empty-chart-message">No agency data available</p>' : ''}
			</div>
		`;
	}
}

function getFilteredData(): (CheckInEntry | UserRegistration)[] {
	let data = activeView === "checkins" ? [...checkins] : [...registrations];

	if (activeView === "checkins") {
		// Apply filters for check-ins
		if (checkinServiceFilter) {
			data = (data as CheckInEntry[]).filter(c => c.services.includes(checkinServiceFilter as any));
		}
		if (checkinStartDate) {
			const start = new Date(checkinStartDate).getTime() / 1000;
			data = (data as CheckInEntry[]).filter(c => c.entry_time >= start);
		}
		if (checkinEndDate) {
			const end = new Date(checkinEndDate + "T23:59:59").getTime() / 1000;
			data = (data as CheckInEntry[]).filter(c => c.entry_time <= end);
		}
		if (checkinSearch) {
			const search = checkinSearch.toLowerCase();
			data = (data as CheckInEntry[]).filter(c => {
				const reg = registrations.find(r => r.user_id === c.user_id);
				const name = reg ? `${reg.first_name} ${reg.last_name}`.toLowerCase() : "";
				return c.user_id.toLowerCase().includes(search) || name.includes(search);
			});
		}
		// Sort
		if (checkinSortBy === "newest") {
			(data as CheckInEntry[]).sort((a, b) => b.entry_time - a.entry_time);
		} else {
			(data as CheckInEntry[]).sort((a, b) => a.entry_time - b.entry_time);
		}
	} else {
		// Apply filters for registrations
		if (regStartDate) {
			const start = new Date(regStartDate).getTime() / 1000;
			data = (data as UserRegistration[]).filter(r => r.created_at >= start);
		}
		if (regEndDate) {
			const end = new Date(regEndDate + "T23:59:59").getTime() / 1000;
			data = (data as UserRegistration[]).filter(r => r.created_at <= end);
		}
		if (regAgencySearch) {
			const search = regAgencySearch.toLowerCase();
			data = (data as UserRegistration[]).filter(r =>
				r.agency.toLowerCase().includes(search)
			);
		}
		if (regSearch) {
			const search = regSearch.toLowerCase();
			data = (data as UserRegistration[]).filter(r =>
				r.first_name.toLowerCase().includes(search) ||
				r.last_name.toLowerCase().includes(search) ||
				r.email.toLowerCase().includes(search)
			);
		}
		// Sort
		if (regSortBy === "newest") {
			(data as UserRegistration[]).sort((a, b) => b.created_at - a.created_at);
		} else if (regSortBy === "oldest") {
			(data as UserRegistration[]).sort((a, b) => a.created_at - b.created_at);
		} else if (regSortBy === "name_asc") {
			(data as UserRegistration[]).sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
		} else if (regSortBy === "name_desc") {
			(data as UserRegistration[]).sort((a, b) => `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`));
		}
	}

	return data;
}

function displayData(): void {
	const tableHead = document.getElementById("tableHead");
	const tableBody = document.getElementById("tableBody");
	if (!tableHead || !tableBody) return;

	const data = getFilteredData();
	const currentPage = activeView === "checkins" ? checkinCurrentPage : regCurrentPage;
	const startIdx = (currentPage - 1) * itemsPerPage;
	const pageData = data.slice(startIdx, startIdx + itemsPerPage);
	const totalPages = Math.ceil(data.length / itemsPerPage) || 1;

	if (activeView === "checkins") {
		tableHead.innerHTML = `<tr><th>User ID</th><th>Name</th><th>Services</th><th>Check-in Time</th></tr>`;

		if (pageData.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="4" class="empty-message">No check-ins found</td></tr>`;
		} else {
			tableBody.innerHTML = (pageData as CheckInEntry[]).map((c, idx) => {
				const reg = registrations.find(r => r.user_id === c.user_id);
				const name = reg ? `${reg.first_name} ${reg.last_name}` : "Unknown";
				const services = c.services.map(s => `<span class="service-tag ${s.toLowerCase().replace(' ', '-')}">${s}</span>`).join("");

				return `
          <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
            <td class="user-id">${c.user_id}</td>
            <td>${name}</td>
            <td class="services-cell">${services}</td>
            <td class="timestamp">${new Date(c.entry_time * 1000).toLocaleString()}</td>
          </tr>
        `;
			}).join("");
		}
	} else {
		tableHead.innerHTML = `<tr><th>#</th><th>User ID</th><th>Name</th><th>Email</th><th>Agency</th><th>Date</th></tr>`;

		if (pageData.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="6" class="empty-message">No registrations found</td></tr>`;
		} else {
			tableBody.innerHTML = (pageData as UserRegistration[]).map((r, idx) => `
        <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
          <td class="row-number">${startIdx + idx + 1}</td>
          <td class="user-id">${r.user_id}</td>
          <td>${r.first_name} ${r.last_name}</td>
          <td class="email">${r.email}</td>
          <td>${r.agency}</td>
          <td class="timestamp">${new Date(r.created_at * 1000).toLocaleString()}</td>
        </tr>
      `).join("");
		}
	}

	// Update pagination
	const paginationInfo = document.getElementById("paginationInfo");
	if (paginationInfo) {
		paginationInfo.textContent = `Page ${currentPage} of ${totalPages} (${data.length} total)`;
	}

	const prevBtn = document.getElementById("prevPage") as HTMLButtonElement;
	const nextBtn = document.getElementById("nextPage") as HTMLButtonElement;
	if (prevBtn) prevBtn.disabled = currentPage === 1;
	if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function formatDateKey(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
	const date = new Date(dateStr + "T00:00:00");
	return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function exportData(): void {
	const data = getFilteredData();

	if (data.length === 0) {
		showToast("No data to export", "error");
		return;
	}

	let csv: string;
	const today = new Date().toISOString().slice(0, 10);

	if (activeView === "checkins") {
		const header = ["User ID", "First Name", "Last Name", "Email", "Services", "Check-in Time"];
		const rows = (data as CheckInEntry[]).map(entry => {
			const reg = registrations.find(r => r.user_id === entry.user_id);
			return [
				entry.user_id,
				reg?.first_name || "",
				reg?.last_name || "",
				reg?.email || "",
				entry.services.join("; "),
				new Date(entry.entry_time * 1000).toLocaleString()
			].map(escapeCsvValue);
		});
		csv = [header.map(escapeCsvValue).join(","), ...rows.map(row => row.join(","))].join("\n");
		downloadCsvFile(csv, `checkins-${today}.csv`);
	} else {
		const header = ["User ID", "First Name", "Last Name", "Email", "Agency", "Region", "Registration Date"];
		const rows = (data as UserRegistration[]).map(r => [
			r.user_id,
			r.first_name,
			r.last_name,
			r.email,
			r.agency,
			r.region,
			new Date(r.created_at * 1000).toLocaleString()
		].map(escapeCsvValue));
		csv = [header.map(escapeCsvValue).join(","), ...rows.map(row => row.join(","))].join("\n");
		downloadCsvFile(csv, `registrations-${today}.csv`);
	}
}

function escapeCsvValue(value: string): string {
	if (/[",\n]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

function downloadCsvFile(csv: string, filename: string): void {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
	showToast("Data exported successfully!");
}

// Handle clickable stat card navigation
function handleStatClick(stat: string): void {
	const today = formatDateKey(new Date());

	switch (stat) {
		case "registrations":
			activeView = "registrations";
			displayMode = "logs";
			regCurrentPage = 1;
			break;
		case "checkins":
			activeView = "checkins";
			displayMode = "logs";
			checkinCurrentPage = 1;
			break;
		case "today-checkins":
			activeView = "checkins";
			displayMode = "calendar";
			selectedDate = today;
			break;
		case "printing":
			activeView = "checkins";
			displayMode = "logs";
			checkinServiceFilter = "Printing";
			checkinCurrentPage = 1;
			break;
		case "pcuse":
			activeView = "checkins";
			displayMode = "logs";
			checkinServiceFilter = "PC Use";
			checkinCurrentPage = 1;
			break;
		case "training":
			activeView = "checkins";
			displayMode = "logs";
			checkinServiceFilter = "Training";
			checkinCurrentPage = 1;
			break;
	}
	renderApp();
}

// Handle security settings update
function handleSecurityUpdate(): void {
	const currentPasswordInput = document.getElementById("currentPassword") as HTMLInputElement;
	const newUsernameInput = document.getElementById("newUsername") as HTMLInputElement;
	const newPasswordInput = document.getElementById("newPassword") as HTMLInputElement;
	const confirmPasswordInput = document.getElementById("confirmPassword") as HTMLInputElement;

	const currentPassword = currentPasswordInput.value;
	const newUsername = newUsernameInput.value.trim();
	const newPassword = newPasswordInput.value;
	const confirmPassword = confirmPasswordInput.value;

	// Verify current password (hardcoded for now - in production, this would be server-side)
	if (currentPassword !== "Password123!") {
		showToast("Current password is incorrect", "error");
		return;
	}

	// Validate new password if provided
	if (newPassword && newPassword !== confirmPassword) {
		showToast("New passwords do not match", "error");
		return;
	}

	if (newPassword && newPassword.length < 8) {
		showToast("New password must be at least 8 characters", "error");
		return;
	}

	// Show success (in production, this would update credentials on the server)
	let message = "Settings updated successfully";
	if (newUsername) {
		message = `Username would be changed to: ${newUsername}`;
	}
	if (newPassword) {
		message = newUsername ? "Username and password updated" : "Password updated successfully";
	}

	showToast(message);

	// Close modal and clear form
	document.getElementById("securityModal")?.classList.remove("active");
	(document.getElementById("securityForm") as HTMLFormElement)?.reset();
}

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
	if (currentTheme === "system") {
		applyTheme("system");
	}
});

// Initialize app
renderApp();
