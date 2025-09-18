/*
  # Personal Information QR Code System Database Setup

  1. New Tables
    - `persons`
      - `id` (text, primary key) - Unique identifier for each person
      - `name` (text, required) - First name
      - `last_name` (text, required) - Last name  
      - `address` (text, optional) - Home address
      - `personal_code` (text, required) - Auto-generated unique personal code
      - `phone_number` (text, required) - Contact phone number
      - `additional_info` (text, optional) - Additional personal information
      - `disease_or_problem` (text, optional) - Medical conditions or health issues
      - `status` (text, optional) - Current status
      - `emergency_note` (text, optional) - Emergency contact or critical information
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `persons` table
    - Add policy for public read access (for QR code scanning)
    - Add policy for authenticated users to manage data

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for QR code lookups by ID
*/

-- Create the persons table
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT DEFAULT '',
    personal_code TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    additional_info TEXT DEFAULT '',
    disease_or_problem TEXT DEFAULT '',
    status TEXT DEFAULT '',
    emergency_note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for QR code scanning
CREATE POLICY "Allow public read access for QR scanning" ON persons
    FOR SELECT USING (true);

-- Create policy to allow all operations for authenticated users (admin)
CREATE POLICY "Allow all operations for authenticated users" ON persons
    FOR ALL TO authenticated USING (true);

-- Create policy to allow anonymous users to insert their own data
CREATE POLICY "Allow anonymous insert" ON persons
    FOR INSERT TO anon WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_persons_created_at ON persons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_persons_personal_code ON persons(personal_code);
CREATE INDEX IF NOT EXISTS idx_persons_id ON persons(id);

-- Insert sample data for testing (optional)
INSERT INTO persons (
    id, 
    name, 
    last_name, 
    address, 
    personal_code, 
    phone_number, 
    additional_info, 
    disease_or_problem, 
    status, 
    emergency_note
) VALUES (
    'sample_person_001',
    'John',
    'Doe',
    '123 Healthcare Ave, Medical City',
    'HC001234',
    '+1-555-0123',
    'Sample patient for testing QR code system',
    'No known allergies',
    'Active',
    'Emergency contact: Jane Doe +1-555-0124'
) ON CONFLICT (id) DO NOTHING;