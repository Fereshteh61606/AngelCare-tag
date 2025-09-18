import { createClient } from '@supabase/supabase-js';
import { PersonInfo } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using localStorage as fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table structure
export interface DatabasePersonInfo {
  id: string;
  name: string;
  last_name: string;
  address: string;
  personal_code: string;
  phone_number: string;
  additional_info: string;
  disease_or_problem: string;
  status: string;
  emergency_note: string;
  created_at: string;
}

// Convert between app format and database format
export const toDatabase = (person: PersonInfo): Omit<DatabasePersonInfo, 'created_at'> => ({
  id: person.id,
  name: person.name,
  last_name: person.lastName,
  address: person.address,
  personal_code: person.personalCode,
  phone_number: person.phoneNumber,
  additional_info: person.additionalInfo,
  disease_or_problem: person.diseaseOrProblem,
  status: person.status,
  emergency_note: person.emergencyNote,
});

export const fromDatabase = (dbPerson: DatabasePersonInfo): PersonInfo => ({
  id: dbPerson.id,
  name: dbPerson.name,
  lastName: dbPerson.last_name,
  address: dbPerson.address,
  personalCode: dbPerson.personal_code,
  phoneNumber: dbPerson.phone_number,
  additionalInfo: dbPerson.additional_info,
  diseaseOrProblem: dbPerson.disease_or_problem,
  status: dbPerson.status,
  emergencyNote: dbPerson.emergency_note,
  createdAt: dbPerson.created_at,
});