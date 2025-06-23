# React Dashboard Application

A modern, full-featured dashboard application built with React, TypeScript, and Supabase.

## 🚀 Features

- **Authentication System**: Complete sign-up/sign-in with user profiles
- **User Management**: Role-based access control (Admin, Editor, Viewer, Vendor, User)
- **Project Management**: Create, manage, and share projects
- **Design Studio**: Interactive canvas for design work
- **Swatch Book**: Comprehensive paint swatch management
- **Material Library**: Textures, colors, and design assets
- **Real-time Collaboration**: Share projects with team members
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- Git for version control

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd react-dashboard-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Get your project credentials**:
   - Go to Settings > API
   - Copy your Project URL and anon key

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Set Up Database

Run the migrations in your Supabase dashboard:

1. Go to the SQL Editor in your Supabase dashboard
2. Run each migration file in order:
   - `supabase/migrations/20250623085341_noisy_dream.sql`
   - `supabase/migrations/20250623085350_sweet_thunder.sql`  
   - `supabase/migrations/20250623090240_tiny_hall.sql`

### 5. Test Your Connection

```bash
npm run dev
```

The app will open at `http://localhost:5173`. In development mode, you'll see a connection status indicator in the top-right corner that will test your Supabase setup.

## 🔐 Database Schema

### Users Table
- `id` (uuid) - Primary key, references auth.users
- `email` (text) - User email
- `role` (enum) - User role (admin, editor, viewer, vendor, user)
- `profile` (uuid) - Reference to user_profiles
- `is_active` (boolean) - Account status
- `status` (enum) - User status
- `last_login` (timestamptz) - Last login time
- Timestamps and version control

### User Profiles Table
- `_id` (uuid) - Primary key
- `email` (text) - User email
- `name` (text) - Full name
- `dob` (date) - Date of birth (optional)
- `projects` (jsonb) - Project data
- `image` (text) - Profile image URL
- `image_thumb` (text) - Thumbnail URL
- Timestamps

### Projects Table
- Project management with access controls
- Public/private visibility options
- Progress tracking and status management

## 🎯 User Roles

- **Admin**: Full system access, user management
- **Editor**: Create and edit projects, manage content
- **Viewer**: Read-only access to projects
- **Vendor**: Can import swatches and materials
- **User**: Basic user access

## 🔧 Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Linting
```bash
npm run lint
```

## 📂 Project Structure

```
src/
├── api/           # API layer (authApi, userApi)
├── components/    # Reusable React components
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── lib/           # Library configurations (Supabase)
├── models/        # TypeScript interfaces and types
├── pages/         # Page components
├── redux/         # Redux store and slices
├── routes/        # React Router configuration
├── services/      # Business logic services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🚀 Deployment

The application can be deployed to various platforms:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **Railway**: Connect and deploy from GitHub

Make sure to set your environment variables in your deployment platform.

## 🧪 Testing Connection

The app includes built-in connection testing:

1. **Connection Status**: Visible in development mode
2. **Automatic Tests**: Run on app startup
3. **Manual Testing**: Click "Run Tests" in the connection status panel

Tests include:
- Basic Supabase connection
- Database schema validation
- Authentication system
- Row Level Security (RLS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the connection status panel for diagnostic information
2. Verify your Supabase credentials are correct
3. Ensure all migrations have been run
4. Check the browser console for detailed error messages

For additional help, please open an issue in the repository.