import { PersonInfo } from '../types';
import { supabase, toDatabase, fromDatabase, DatabasePersonInfo } from '../lib/supabase';

const STORAGE_KEY = 'personal_info_data';

// Fallback to localStorage if Supabase is not configured
const useLocalStorage = !supabase;

export const savePersonInfo = async (person: PersonInfo): Promise<void> => {
  if (useLocalStorage) {
    // Fallback to localStorage
    const existingData = getPersonsDataSync();
    const updatedData = [...existingData, person];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return;
  }

  try {
    const dbPerson = toDatabase(person);
    const { error } = await supabase!
      .from('persons')
      .insert([dbPerson]);

    if (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving person info:', error);
    // Fallback to localStorage on error
    const existingData = getPersonsDataSync();
    const updatedData = [...existingData, person];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  }
};

export const getPersonsData = async (): Promise<PersonInfo[]> => {
  if (useLocalStorage) {
    return getPersonsDataSync();
  }

  try {
    const { data, error } = await supabase!
      .from('persons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching from Supabase:', error);
      return getPersonsDataSync(); // Fallback to localStorage
    }

    return data ? data.map(fromDatabase) : [];
  } catch (error) {
    console.error('Error fetching persons data:', error);
    return getPersonsDataSync(); // Fallback to localStorage
  }
};

export const getPersonsDataSync = (): PersonInfo[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPersonById = async (id: string): Promise<PersonInfo | null> => {
  if (useLocalStorage) {
    const data = getPersonsDataSync();
    return data.find(person => person.id === id) || null;
  }

  try {
    const { data, error } = await supabase!
      .from('persons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching person by ID from Supabase:', error);
      // Fallback to localStorage
      const localData = getPersonsDataSync();
      return localData.find(person => person.id === id) || null;
    }

    return data ? fromDatabase(data) : null;
  } catch (error) {
    console.error('Error fetching person by ID:', error);
    // Fallback to localStorage
    const localData = getPersonsDataSync();
    return localData.find(person => person.id === id) || null;
  }
};

export const deletePersonById = async (id: string): Promise<void> => {
  if (useLocalStorage) {
    const data = getPersonsDataSync();
    const filteredData = data.filter(person => person.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return;
  }

  try {
    const { error } = await supabase!
      .from('persons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting person:', error);
    // Fallback to localStorage
    const data = getPersonsDataSync();
    const filteredData = data.filter(person => person.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
  }
};

// Generate unique personal code
export const generatePersonalCode = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp.slice(-6)}${random}`;
};