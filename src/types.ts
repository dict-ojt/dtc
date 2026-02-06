// Shared types for Attendance System
// Used by both client and server

export type Gender = "Male" | "Female" | "Prefer not to say";

export type Suffix = "" | "Jr." | "Sr." | "II" | "III" | "IV";

export type Nationality =
	| "Filipino"
	| "American"
	| "Australian"
	| "British"
	| "Canadian"
	| "Chinese"
	| "French"
	| "German"
	| "Indian"
	| "Indonesian"
	| "Italian"
	| "Japanese"
	| "Korean"
	| "Malaysian"
	| "Spanish"
	| "Thai"
	| "Vietnamese"
	| "Other";

export type Region =
	| "Region I"
	| "Region II"
	| "Region III"
	| "Region IV-A"
	| "Region IV-B"
	| "Region V"
	| "Region VI"
	| "Region VII"
	| "Region VIII"
	| "Region IX"
	| "Region X"
	| "Region XI"
	| "Region XII"
	| "Region XIII"
	| "NCR"
	| "CAR"
	| "BARMM";

export type Sector =
	| "Out of school youth"
	| "Student"
	| "Teacher"
	| "Professional"
	| "Other";

export type CivilStatus =
	| "Single"
	| "Married"
	| "Widowed"
	| "Divorced"
	| "Separated"
	| "Annulled"
	| "Domestic Partnership";

export type YesNo = "Yes" | "No";

export type Service = "Printing" | "PC Use" | "Training";

export type AgeGroup = "Under 18" | "18-24" | "25-34" | "35-44" | "45+";

// Address type
export interface Address {
	building: string;
	street?: string;
	barangay: string;
	city: string;
	province: string;
}

// Full user registration data
export interface UserRegistration {
	user_id: string; // Format: XX-XXXXX (e.g., AB-12C3D)
	first_name: string;
	middle_initial?: string;
	last_name: string;
	suffix?: Suffix;
	email: string;
	gender: Gender;
	birthdate: string; // YYYY-MM-DD format
	age_group: AgeGroup;
	phone: string; // 11 digits, starts with 09
	nationality: Nationality;
	region: Region;
	address: Address;
	sector: Sector;
	agency: string;
	office: string;
	designation: string;
	senior_citizen: YesNo;
	differently_abled: YesNo;
	solo_parent: YesNo;
	civil_status: CivilStatus;
	created_at: number; // Unix timestamp
}

// Check-in entry data
export interface CheckInEntry {
	id: number;
	user_id: string;
	services: Service[]; // Can be multiple services
	entry_time: number; // Unix timestamp
}

// Request types
export interface CreateUserRequest {
	first_name: string;
	middle_initial?: string;
	last_name: string;
	suffix?: Suffix;
	email: string;
	gender: Gender;
	birthdate: string;
	phone: string;
	nationality: Nationality;
	region: Region;
	address: Address;
	sector: Sector;
	agency: string;
	office: string;
	designation: string;
	senior_citizen: YesNo;
	differently_abled: YesNo;
	solo_parent: YesNo;
	civil_status: CivilStatus;
}

export interface LogEntryRequest {
	user_id: string;
	services: Service[];
}

// Response types
export interface UserResponse {
	success: boolean;
	user?: UserRegistration;
	error?: string;
}

export interface CheckInResponse {
	success: boolean;
	entry?: CheckInEntry;
	error?: string;
}

export interface LogsResponse {
	success: boolean;
	logs: CheckInEntry[];
	count: number;
	total: number;
}

export interface UsersListResponse {
	success: boolean;
	users: UserRegistration[];
	count: number;
	total: number;
}

// Service statistics
export interface ServiceStats {
	printing: number;
	pc_use: number;
	training: number;
}

export interface DashboardStats {
	total_registrations: number;
	total_checkins: number;
	today_checkins: number;
	services: ServiceStats;
}

// Delete response
export interface DeleteResponse {
	success: boolean;
	deleted: number;
	error?: string;
}

// Filter options for queries
export interface LogFilters {
	user_id?: string;
	service?: Service;
	start_date?: string; // YYYY-MM-DD
	end_date?: string; // YYYY-MM-DD
}

export interface UserFilters {
	search?: string; // Search by name or email
	region?: Region;
	sector?: Sector;
	start_date?: string;
	end_date?: string;
}

// Validation utilities
export const VALIDATION = {
	USER_ID_PATTERN: /^[A-Z0-9]{2}-[A-Z0-9]{5}$/,
	PHONE_PATTERN: /^09[0-9]{9}$/,
	EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	SERVICES: ["Printing", "PC Use", "Training"] as Service[],
	SUFFIXES: ["", "Jr.", "Sr.", "II", "III", "IV"] as Suffix[],
	GENDERS: ["Male", "Female", "Prefer not to say"] as Gender[],
	CIVIL_STATUSES: [
		"Single",
		"Married",
		"Widowed",
		"Divorced",
		"Separated",
		"Annulled",
		"Domestic Partnership",
	] as CivilStatus[],
	SECTORS: ["Out of school youth", "Student", "Teacher", "Professional", "Other"] as Sector[],
	REGIONS: [
		"Region I",
		"Region II",
		"Region III",
		"Region IV-A",
		"Region IV-B",
		"Region V",
		"Region VI",
		"Region VII",
		"Region VIII",
		"Region IX",
		"Region X",
		"Region XI",
		"Region XII",
		"Region XIII",
		"NCR",
		"CAR",
		"BARMM",
	] as Region[],
	NATIONALITIES: [
		"Filipino",
		"American",
		"Australian",
		"British",
		"Canadian",
		"Chinese",
		"French",
		"German",
		"Indian",
		"Indonesian",
		"Italian",
		"Japanese",
		"Korean",
		"Malaysian",
		"Spanish",
		"Thai",
		"Vietnamese",
		"Other",
	] as Nationality[],
	YES_NO: ["Yes", "No"] as YesNo[],
};

// Helper function to generate User ID
export function generateUserId(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let id = "";
	// First 2 characters: letters only
	for (let i = 0; i < 2; i++) {
		id += chars.charAt(Math.floor(Math.random() * 26)); // A-Z only
	}
	id += "-";
	// Last 5 characters: letters and numbers
	for (let i = 0; i < 5; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
}

// Helper function to calculate age group
export function calculateAgeGroup(birthdate: string): AgeGroup {
	const birth = new Date(birthdate);
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}

	if (age < 18) return "Under 18";
	if (age < 25) return "18-24";
	if (age < 35) return "25-34";
	if (age < 45) return "35-44";
	return "45+";
}

// Validation functions
export function validateUserId(userId: string): boolean {
	return VALIDATION.USER_ID_PATTERN.test(userId);
}

export function validatePhone(phone: string): boolean {
	return VALIDATION.PHONE_PATTERN.test(phone);
}

export function validateEmail(email: string): boolean {
	return VALIDATION.EMAIL_PATTERN.test(email);
}

export function validateServices(services: string[]): services is Service[] {
	return services.length > 0 && services.every((s) => VALIDATION.SERVICES.includes(s as Service));
}

export function validateRegistration(data: CreateUserRequest): string | null {
	if (!data.first_name?.trim()) return "First name is required";
	if (!data.last_name?.trim()) return "Last name is required";
	if (!data.email?.trim()) return "Email is required";
	if (!validateEmail(data.email)) return "Invalid email format";
	if (!data.phone?.trim()) return "Phone number is required";
	if (!validatePhone(data.phone)) return "Phone must be 11 digits starting with 09";
	if (!data.birthdate) return "Birthdate is required";
	if (!data.gender) return "Gender is required";
	if (!data.nationality) return "Nationality is required";
	if (!data.region) return "Region is required";
	if (!data.sector) return "Sector is required";
	if (!data.agency?.trim()) return "Agency is required";
	if (!data.office?.trim()) return "Office/Affiliation is required";
	if (!data.designation?.trim()) return "Designation is required";
	if (!data.civil_status) return "Civil status is required";
	if (!data.senior_citizen) return "Senior citizen status is required";
	if (!data.differently_abled) return "Differently abled status is required";
	if (!data.solo_parent) return "Solo parent status is required";
	if (!data.address?.building?.trim()) return "Building/House number is required";
	if (!data.address?.barangay?.trim()) return "Barangay is required";
	if (!data.address?.city?.trim()) return "City/Municipality is required";
	if (!data.address?.province?.trim()) return "Province is required";
	return null;
}

export function validateCheckIn(data: LogEntryRequest): string | null {
	if (!data.user_id?.trim()) return "User ID is required";
	if (!validateUserId(data.user_id)) return "Invalid User ID format (XX-XXXXX)";
	if (!data.services || data.services.length === 0) return "At least one service is required";
	if (!validateServices(data.services)) return "Invalid service selection";
	return null;
}
