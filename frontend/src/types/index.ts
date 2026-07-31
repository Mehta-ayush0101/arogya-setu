// ===== USER ROLES =====
export type UserRole = 'patient' | 'asha_worker' | 'phc_doctor' | 'district_officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  village?: string;
  district?: string;
  state?: string;
  language: 'en' | 'hi' | 'gu';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ===== PATIENT =====
export interface Patient {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  weight?: number;
  height?: number;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact: EmergencyContact;
  ashaWorker?: string;
  primaryDoctor?: string;
  healthScore?: number;
  lastVisit?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

// ===== VITALS =====
export interface Vitals {
  id: string;
  patientId: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  bloodSugar?: number;
  oxygenSaturation?: number;
  weight?: number;
  recordedAt: string;
  recordedBy: string;
}

// ===== APPOINTMENTS =====
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'missed';
export type AppointmentType = 'in_person' | 'teleconsult' | 'home_visit';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  phcId: string;
  phcName: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  aiTriageResult?: TriageResult;
  meetingLink?: string;
  createdAt: string;
}

// ===== AI TRIAGE =====
export type SeverityLevel = 'emergency' | 'urgent' | 'routine' | 'self_care';

export interface TriageResult {
  id: string;
  patientId: string;
  symptoms: string;
  possibleConditions: PossibleCondition[];
  severity: SeverityLevel;
  severityExplanation: string;
  recommendedAction: string;
  confidence: number;
  aiModel: string;
  language: string;
  voiceInput?: boolean;
  createdAt: string;
}

export interface PossibleCondition {
  name: string;
  nameLocal?: string;
  probability: number;
  description: string;
}

// ===== MEDICINE =====
export interface Medicine {
  id: string;
  name: string;
  nameLocal?: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  barcode?: string;
}

export interface MedicineStock {
  id: string;
  medicineId: string;
  medicine: Medicine;
  phcId: string;
  quantity: number;
  minStockLevel: number;
  expiryDate: string;
  batchNumber: string;
  lastUpdated: string;
  status: 'adequate' | 'low' | 'critical' | 'expired';
}

export interface MedicineRequest {
  id: string;
  medicineId: string;
  medicineName: string;
  requestedBy: string;
  phcId: string;
  quantity: number;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'approved' | 'dispatched' | 'received';
  createdAt: string;
}

// ===== PHC =====
export interface PHC {
  id: string;
  name: string;
  address: string;
  district: string;
  state: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  doctors: string[];
  services: string[];
  timings: string;
  isActive: boolean;
  distanceKm?: number;
}

// ===== VILLAGE =====
export interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  coordinates: { lat: number; lng: number };
  ashaWorkerId?: string;
  phcId?: string;
}

// ===== NOTIFICATIONS =====
export type NotificationType = 'appointment' | 'medicine' | 'emergency' | 'followup' | 'system' | 'health_tip';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ===== HEALTH RECORDS =====
export interface HealthRecord {
  id: string;
  patientId: string;
  type: 'prescription' | 'lab_report' | 'imaging' | 'discharge_summary' | 'vaccination';
  title: string;
  description?: string;
  fileUrl?: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  tags: string[];
}

// ===== FOLLOW-UP =====
export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  ashaWorkerId: string;
  condition: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'pending' | 'completed' | 'missed' | 'rescheduled';
  notes?: string;
  homeVisit: boolean;
}

// ===== EMERGENCY =====
export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  address: string;
  description: string;
  status: 'active' | 'dispatched' | 'resolved' | 'cancelled';
  ambulanceId?: string;
  estimatedTime?: number;
  createdAt: string;
}

// ===== ANALYTICS =====
export interface HealthAnalytics {
  totalPatients: number;
  totalAppointments: number;
  completedConsultations: number;
  emergencyRequests: number;
  medicinesLowStock: number;
  activeAshaWorkers: number;
  monthlyData: MonthlyData[];
  diseaseDistribution: DiseaseData[];
  ageDistribution: AgeData[];
}

export interface MonthlyData {
  month: string;
  appointments: number;
  consultations: number;
  emergencies: number;
}

export interface DiseaseData {
  name: string;
  value: number;
  color: string;
}

export interface AgeData {
  range: string;
  count: number;
}

// ===== AI CONVERSATION =====
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice?: boolean;
  audioUrl?: string;
  language?: string;
}

export interface AIConversation {
  id: string;
  patientId: string;
  messages: ConversationMessage[];
  triageResult?: TriageResult;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ===== FORM TYPES =====
export interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  village?: string;
  district?: string;
  state?: string;
  language?: string;
}

export interface SymptomFormData {
  symptoms: string;
  duration: string;
  severity: number;
  language: string;
  additionalInfo?: string;
}

export interface AppointmentFormData {
  doctorId: string;
  phcId: string;
  date: string;
  time: string;
  type: AppointmentType;
  symptoms?: string;
}

// ===== DASHBOARD STATS =====
export interface PatientDashboardStats {
  healthScore: number;
  nextAppointment?: Appointment;
  activeMedications: number;
  missedFollowUps: number;
  recentVitals?: Vitals;
  upcomingVaccinations: number;
}

export interface DoctorDashboardStats {
  todayAppointments: number;
  pendingReviews: number;
  totalPatients: number;
  completedToday: number;
  emergencyAlerts: number;
}

export interface AshaDashboardStats {
  todayHomeVisits: number;
  pendingFollowUps: number;
  medicinesLowStock: number;
  assignedPatients: number;
  completedThisMonth: number;
}
