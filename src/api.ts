import type {
	CreateUserRequest,
	LogEntryRequest,
	UserResponse,
	CheckInResponse,
	LogsResponse,
	UsersListResponse,
	DashboardStats,
	Service,
	DeleteResponse,
} from "./types";

const API_BASE_URL = "https://dict-db.stevendavemiranda2.workers.dev";

// Session management
let sessionId: string | null = null;

export function setSessionId(id: string | null): void {
	sessionId = id;
	if (id) {
		sessionStorage.setItem('dict_admin_session', id);
	} else {
		sessionStorage.removeItem('dict_admin_session');
	}
}

export function getSessionId(): string | null {
	if (!sessionId) {
		sessionId = sessionStorage.getItem('dict_admin_session');
	}
	return sessionId;
}

async function apiRequest<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options?.headers instanceof Headers 
			? Object.fromEntries(options.headers.entries())
			: (options?.headers as Record<string, string>))
	};

	// Add session ID if available
	const session = getSessionId();
	if (session) {
		headers['X-Session-Id'] = session;
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	// Handle 401 Unauthorized - clear session
	if (response.status === 401) {
		setSessionId(null);
		throw new Error(response.statusText || "Unauthorized");
	}

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: "Unknown error" }));
		throw new Error(error.error || `HTTP ${response.status}`);
	}

	return response.json();
}

export const api = {
	// Create new user
	async createUser(data: CreateUserRequest): Promise<UserResponse> {
		return apiRequest<UserResponse>("/api/users", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	// Get all users
	async getUsers(params?: {
		limit?: number;
		offset?: number;
		search?: string;
		region?: string;
		sector?: string;
	}): Promise<UsersListResponse> {
		const searchParams = new URLSearchParams();
		if (params?.limit) searchParams.set("limit", params.limit.toString());
		if (params?.offset) searchParams.set("offset", params.offset.toString());
		if (params?.search) searchParams.set("search", params.search);
		if (params?.region) searchParams.set("region", params.region);
		if (params?.sector) searchParams.set("sector", params.sector);

		const query = searchParams.toString();
		return apiRequest<UsersListResponse>(`/api/users${query ? `?${query}` : ""}`);
	},

	// Get user by ID
	async getUser(userId: string): Promise<UserResponse> {
		return apiRequest<UserResponse>(`/api/users/${userId}`);
	},

	// Log entry (check-in)
	async logEntry(data: LogEntryRequest): Promise<CheckInResponse> {
		return apiRequest<CheckInResponse>("/api/entry", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	// Get attendance logs
	async getLogs(params?: {
		limit?: number;
		offset?: number;
		user_id?: string;
		service?: Service;
		start_date?: string;
		end_date?: string;
	}): Promise<LogsResponse> {
		const searchParams = new URLSearchParams();
		if (params?.limit) searchParams.set("limit", params.limit.toString());
		if (params?.offset) searchParams.set("offset", params.offset.toString());
		if (params?.user_id) searchParams.set("user_id", params.user_id);
		if (params?.service) searchParams.set("service", params.service);
		if (params?.start_date) searchParams.set("start_date", params.start_date);
		if (params?.end_date) searchParams.set("end_date", params.end_date);

		const query = searchParams.toString();
		return apiRequest<LogsResponse>(`/api/logs${query ? `?${query}` : ""}`);
	},

	// Get dashboard statistics
	async getStats(): Promise<{ success: boolean; stats: DashboardStats }> {
		return apiRequest<{ success: boolean; stats: DashboardStats }>("/api/stats");
	},

	// Health check
	async healthCheck(): Promise<{ status: string; timestamp: string }> {
		return apiRequest<{ status: string; timestamp: string }>("/api/health");
	},

	// Delete all users (registrations)
	async deleteAllUsers(): Promise<DeleteResponse> {
		return apiRequest<DeleteResponse>("/api/users", {
			method: "DELETE",
		});
	},

	// Delete all logs (check-ins)
	async deleteAllLogs(): Promise<DeleteResponse> {
		return apiRequest<DeleteResponse>("/api/logs", {
			method: "DELETE",
		});
	},

	// Admin authentication
	async adminLogin(username: string, password: string): Promise<{
		success: boolean;
		sessionId: string;
		message: string;
	}> {
		return apiRequest('/api/admin/login', {
			method: 'POST',
			body: JSON.stringify({ username, password }),
		});
	},

	// Admin logout
	async adminLogout(): Promise<{ success: boolean; message: string }> {
		return apiRequest('/api/admin/logout', {
			method: 'POST',
		});
	},

	// Update admin credentials
	async updateAdminCredentials(data: {
		currentPassword: string;
		newUsername?: string;
		newPassword?: string;
	}): Promise<{ success: boolean; message: string }> {
		return apiRequest('/api/admin/credentials', {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},
};
