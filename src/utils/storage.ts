import { PersonInfo } from '../types';
import { supabase, toDatabase, fromDatabase } from '../lib/supabase';

if (!supabase) {
  throw new Error('Supabase client not initialized. Check environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const savePersonInfo = async (person: PersonInfo): Promise<void> => {
  try {
    const dbPerson = toDatabase(person);
    const { error } = await supabase!
      .from('persons')
      .insert([dbPerson]);

    if (error) {
      console.error('Supabase insert error:', error.message, error.details, error.hint);
      throw error;
    }
    console.log('Person saved to Supabase:', person.id);
  } catch (error) {
    console.error('Error saving person info to Supabase:', error);
    throw error;
  }
};

export const getPersonsData = async (): Promise<PersonInfo[]> => {
  try {
    const { data, error } = await supabase!
      .from('persons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error.message, error.details, error.hint);
      throw error;
    }

    return data ? data.map(fromDatabase) : [];
  } catch (error) {
    console.error('Error fetching persons data from Supabase:', error);
    throw error;
  }
};

export const getPersonById = async (id: string): Promise<PersonInfo | null> => {
  try {
    const { data, error } = await supabase!
      .from('persons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch by ID error:', error.message, error.details, error.hint);
      throw error;
    }

    return data ? fromDatabase(data) : null;
  } catch (error) {
    console.error('Error fetching person by ID from Supabase:', error);
    throw error;
  }
};

export const deletePersonById = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase!
      .from('persons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error.message, error.details, error.hint);
      throw error;
    }
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