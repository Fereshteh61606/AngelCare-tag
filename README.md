# Personal Information QR Code System

A secure, healthcare-focused web application for managing personal information with QR code generation. Features admin controls, persistent database storage, and professional healthcare design.

## 🏥 Features

- **Secure Admin Access**: Environment-based password protection
- **Persistent Database**: Supabase integration with localStorage fallback
- **Healthcare Design**: Scientifically-backed color psychology
- **QR Code Generation**: High-quality, printable QR codes
- **Privacy Controls**: Users see only their data, admins see all
- **Responsive Design**: Works on all devices
- **Bilingual Support**: English and Persian (فارسی)

## 🚀 Quick Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_ADMIN_PASSWORD=YourSecurePassword123!
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Supabase Database Setup

1. **Create Supabase Account**: Go to [supabase.com](https://supabase.com)
2. **Create New Project**: Choose a name and password
3. **Get Credentials**: 
   - Go to Settings → API
   - Copy Project URL and anon public key
   - Update your `.env` file
4. **Setup Database**: 
   - Go to SQL Editor in Supabase
   - Run the SQL from `supabase/migrations/create_persons_table.sql`

### 3. Install & Run

```bash
npm install
npm run dev
```

## 📦 Deployment to Vercel

### Step-by-Step Vercel Deployment:

1. **Prepare Your Repository**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to your project
   - Go to Settings → Environment Variables
   - Add these variables:
     ```
     VITE_ADMIN_PASSWORD=YourSecurePassword123!
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Alternative: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🔐 Security Features

- **Environment Variables**: Passwords stored securely
- **Database Security**: Supabase RLS policies
- **Admin Authentication**: Secure password-based access
- **Data Privacy**: Users can only see their own data
- **Fallback Storage**: Works even without database

## 🎨 Healthcare Color Psychology

The color scheme is scientifically designed for healthcare:

- **Soft Blues**: Reduce anxiety, build trust
- **Emerald Greens**: Promote healing, positive outcomes  
- **Clean Whites**: Medical cleanliness standards
- **Warm Accents**: Approachable, human-centered care

## 📱 How to Use

### For Users:
1. Visit the website
2. Add your personal information
3. Print/download your QR code
4. Share QR code for emergency access

### For Admins:
1. Click "Admin Access" button
2. Enter admin password
3. View all user information
4. Print QR codes for distribution
5. Manage user data securely

## 🛠 Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS (Healthcare optimized)
- **Database**: Supabase (with localStorage fallback)
- **QR Codes**: qrcode library with custom styling
- **Deployment**: Vercel (recommended)
- **Icons**: Lucide React

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Database Schema

```sql
CREATE TABLE persons (
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
```

## 🚨 Emergency Use

This system is designed for emergency situations:
- QR codes provide instant access to critical information
- Medical conditions are clearly highlighted
- Emergency notes are prominently displayed
- Works offline once loaded

## 📄 License

Open source - free for personal and commercial use.

## 🆘 Support

For issues:
1. Check browser console for errors
2. Verify environment variables are set
3. Ensure Supabase is properly configured
4. Test with different browsers

---

**Healthcare-Grade Security & Privacy** 🏥