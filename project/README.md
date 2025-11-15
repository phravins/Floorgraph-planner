# 🏠 Rendero - AI Floor Plan Generator

##  Overview

**Rendero** is an innovative AI-powered home design platform that transforms your dream home vision into reality. Using advanced artificial intelligence and professional architectural algorithms, Rendero generates detailed 2D floor plans and 3D visualizations instantly based on your specific requirements.

##  Features

###  AI-Powered Design Generation
- **Instant Floor Plans**: Generate professional blueprints in under 30 seconds using Stability AI
- **Smart Layout Optimization**: AI analyzes space constraints and requirements
- **Multiple Design Styles**: Choose from Modern Contemporary, Traditional Indian, Minimalist, and more

###  User-Friendly Interface
- **Multi-Step Form**: Intuitive 4-step process for gathering requirements
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Preview**: Visual feedback throughout the design process

###  Comprehensive Planning
- **Site Analysis**: Input plot dimensions, orientation, and location details
- **Room Customization**: Specify bedroom sizes, bathroom types, kitchen layouts
- **Amenity Selection**: Choose from parking, garden, elevator, office space, and more
- **Floor Planning**: Support for single to multi-floor homes

###  Advanced AI Integration
- **Stability AI API**: Powered by state-of-the-art image generation (SD3 model)
- **Professional Rendering**: Architectural-grade quality outputs
- **Custom Prompts**: AI generates context-aware design suggestions

###  File Management
- **Secure Storage**: Generated plans stored with timestamp-based naming
- **Multiple Formats**: JPEG outputs optimized for construction use
- **Download Ready**: High-resolution files for architects and builders

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI framework with hooks
- **TypeScript 5.9.2** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **ESLint** - Code linting and formatting

### Backend
- **Node.js + Express 4.21.2** - Primary backend server
- **Flask** - Alternative Python backend (app.py)
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Node Fetch** - HTTP client for API calls

### Database & Storage
- **PostgreSQL** - Primary database with postgres.js driver
- **File System** - Local storage for generated images in `uploads/` and `Generated O/P's/` directories

### AI & APIs
- **Stability AI API** - Image generation service with SD3 model
- **Custom AI Prompts** - Specialized for architectural design

### Development Tools
- **Vite** - Fast development and build tool
- **TypeScript** - Type checking and compilation
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing with Autoprefixer
- **Concurrently** - Run multiple scripts simultaneously

---

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Python 3.8+** (for Flask backend, optional)
- **Git** for version control
- **PostgreSQL** (optional, for database features)
- **Stability AI API Key** (sign up at [stability.ai](https://stability.ai))

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rendero-floorplan-generator
```

### 2. Install Dependencies
```bash
# Install frontend and backend dependencies
npm install

# If using yarn
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Stability AI Configuration
STABILITY_API_KEY=your_stability_ai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (optional)
DATABASE_URL=postgresql://username:password@localhost:5432/rendero_db

# Frontend Configuration
VITE_BACKEND_URL=http://localhost:3001
VITE_SUPABASE_ANON_KEY=your_supabase_key_if_using
```

### 4. Database Setup (Optional)
If using PostgreSQL:
```bash
# Create database
createdb rendero_db

# The app will automatically create tables using the schema in src/lib/db.ts
```

### 5. Start the Application

#### Development Mode (Recommended)
```bash
# Start both frontend and backend concurrently
npm run start:all

# Or run them separately:
# Terminal 1: Start backend server
npm run server:dev

# Terminal 2: Start frontend development server
npm run dev
```

#### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📖 Usage

### 1. Access the Application
Open your browser and navigate to:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

### 2. Generate Floor Plans
1. **Step 1**: Enter personal and site information (name, phone, plot dimensions)
2. **Step 2**: Define space requirements (bedrooms, bathrooms, floors)
3. **Step 3**: Select desired features and amenities (garden, parking, elevator)
4. **Step 4**: Choose kitchen preferences and generate AI floor plan

### 3. View Results
- Generated floor plans are displayed immediately
- Download high-resolution versions
- Consult with architects for further customization

---

## 🔌 API Endpoints

### Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information and status |
| `GET` | `/health` | Server health check |
| `GET` | `/api/test` | Test API connectivity |
| `POST` | `/generate-floorplan` | Generate AI floor plan |
| `GET` | `/uploads/:filename` | Serve generated images |

### Generate Floor Plan Request
```javascript
POST /generate-floorplan
Content-Type: application/json

{
  "sqft": 2400,
  "depth": 60,
  "width": 40,
  "directions": "North facing",
  "bathrooms": "standard",
  "masterbedroom": "spacious",
  "masterbedrooms": "1",
  "floors": "2",
  "garden": "Yes",
  "varanda": "No",
  "design": "Modern Contemporary",
  "description": "Custom user requirements"
}
```

---

## 📁 Project Structure

```
rendero-floorplan-generator/
├── src/
│   ├── components/
│   │   └── UserInputForm.tsx     # Multi-step form component
│   ├── lib/
│   │   └── db.ts                 # PostgreSQL database connection
│   ├── App.tsx                   # Main React application
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles with Tailwind
│   └── vite-env.d.ts            # TypeScript declarations
├── server.js                     # Express backend server
├── app.py                        # Flask backend (alternative)
├── package.json                  # Project dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── eslint.config.js             # ESLint configuration
├── tsconfig.json                # TypeScript project config
├── tsconfig.app.json            # TypeScript app config
├── tsconfig.node.json           # TypeScript node config
├── uploads/                     # Generated floor plans storage
├── Generated O/P's/            # Additional output directory
├── dist/                        # Production build output
└── .gitignore                   # Git ignore rules
```

---

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. Customize the design by:
- Modifying `tailwind.config.js` for theme colors and fonts
- Updating component classes in React files
- Adding custom CSS in `src/index.css`

### AI Prompts
Modify floor plan generation prompts in `server.js`:
```javascript
const prompt = `
You are a skilled architect specializing in architectural layout visualization.
Your task is to generate an image of a 2D architectural floor plan...

User Inputs:
Total plot area: ${sqft} sqft
// ... customize as needed
`;
```

### Form Fields
Add new form fields by updating:
- `UserInputForm.tsx` for frontend form validation and UI
- `server.js` for backend processing and AI prompt integration

### Database Schema
Modify database schema in `src/lib/db.ts` for additional features.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Test API endpoints thoroughly
- Maintain responsive design principles
- Add proper error handling and loading states
- Follow ESLint rules for code consistency

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---


### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page for common problems
- Join our community discussions
- Contact our support team for personalized assistance

---

## 🙏 Acknowledgments

- **Stability AI** for providing powerful image generation capabilities
- **React & TypeScript** communities for excellent documentation
- **Open source contributors** for making development tools available
- **Architectural professionals** for design guidance and validation


  <p>Built with ❤️ for dreamers and builders</p>

  phravins - EPL-2.0-LICENCE
 

