-- Personal Information QR Code System Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the persons table
CREATE TABLE IF NOT EXISTS persons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT,
    personal_code TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    additional_info TEXT,
    disease_or_problem TEXT,
    status TEXT,
    emergency_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now
-- In production, you might want more restrictive policies
CREATE POLICY "Allow all operations on persons" ON persons
    FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_persons_created_at ON persons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_persons_personal_code ON persons(personal_code);

-- Insert sample data (optional)
INSERT INTO persons (id, name, last_name, address, personal_code, phone_number, additional_info, disease_or_problem, status, emergency_note) VALUES
('sample-1', 'John', 'Doe', '123 Main St, City', '1234567890', '+1-555-0123', 'Sample user for testing', 'None', 'Active', 'Emergency contact: Jane Doe +1-555-0124')
ON CONFLICT (id) DO NOTHING;