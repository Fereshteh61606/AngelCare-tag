import { PersonInfo } from '../types';
import { supabase, toDatabase, fromDatabase } from '../lib/supabase';

if (!supabase) {
  throw new Error('Supabase client not initialized. Check environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const savePersonInfo = async (person: PersonInfo): Promise<void> => {
  try {
    console.log('Attempting to save person to Supabase:', { id: person.id, name: person.name, lastName: person.lastName });
    const dbPerson = toDatabase(person);
    const { data, error } = await supabase!
      .from('persons')
      .insert([dbPerson])
      .select(); // Return the inserted data for confirmation

    if (error) {
      console.error('Supabase insert error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
    console.log('Person saved successfully to Supabase:', data);
  } catch (error) {
    console.error('Error saving person info to Supabase:', error);
    throw error;
  }
};

export const getPersonsData = async (): Promise<PersonInfo[]> => {
  try {
    console.log('Fetching all persons from Supabase');
    const { data, error } = await supabase!
      .from('persons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
    console.log('Persons fetched successfully:', data ? data.length : 0, 'records');
    return data ? data.map(fromDatabase) : [];
  } catch (error) {
    console.error('Error fetching persons data from Supabase:', error);
    throw error;
  }
};

export const getPersonById = async (id: string): Promise<PersonInfo | null> => {
  try {
    console.log('Fetching person by ID from Supabase:', id);
    const { data, error } = await supabase!
      .from('persons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch by ID error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
    console.log('Person fetched successfully:', data ? data.id : 'Not found');
    return data ? fromDatabase(data) : null;
  } catch (error) {
    console.error('Error fetching person by ID from Supabase:', error);
    throw error;
  }
};

export const deletePersonById = async (id: string): Promise<void> => {
  try {
    console.log('Deleting person by ID from Supabase:', id);
    const { error } = await supabase!
      .from('persons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
    console.log('Person deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting person from Supabase:', error);
    throw error;
  }
};

// Generate unique personal code
export const generatePersonalCode = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp.slice(-6)}${random}`;
};