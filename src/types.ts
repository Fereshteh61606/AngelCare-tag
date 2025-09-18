export interface PersonInfo {
  id: string;
  name: string;
  lastName: string;
  address: string;
  personalCode: string;
  phoneNumber: string;
  additionalInfo: string;
  diseaseOrProblem: string;
  status: string;
  emergencyNote: string;
  createdAt: string;
}

export type Language = 'en' | 'fa';

export interface AdminAuth {
  isAuthenticated: boolean;
  password: string;
}