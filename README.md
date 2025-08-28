# TikTok Slideshow Generator

A professional web application that generates engaging TikTok slideshow content using AI-powered prompts, with customizable backgrounds, gradients, typography, and color options.

## ✨ Features

- **AI-Powered Content Generation**: Create slideshow content from simple text prompts
- **Professional Design Tools**: Customize fonts, colors, and backgrounds
- **Background Options**: Choose from AI-suggested images or beautiful gradients
- **Typography Customization**: 8 professional font families with color selection
- **TikTok-Optimized**: 9:16 aspect ratio slides perfect for TikTok videos
- **Multiple Export Options**: Download individual slides or all slides at once
- **Clean, Professional UI**: Modern interface designed for business use

## 🏗️ Project Structure

```
slideshow-app/
├── frontend/                 # React Next.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── app/            # Next.js app router
│   │   └── styles/         # CSS and styling
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js Express backend server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration files
│   ├── package.json
│   └── README.md
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Pexels API Key** (for background images)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd slideshow-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# PEXELS_API_KEY=your_pexels_api_key_here
# PORT=5000

# Start the backend server
npm run dev
```

**Backend Dependencies:**
- Express.js - Web framework
- node-yahoo-finance2 - Financial data API
- CORS - Cross-origin resource sharing
- dotenv - Environment variable management

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start the frontend development server
npm run dev
```

**Frontend Dependencies:**
- Next.js 14 - React framework
- Tailwind CSS - Utility-first CSS framework
- Lucide React - Icon library
- html2canvas - HTML to canvas conversion
- Google Fonts - Typography options

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PEXELS_API_KEY=your_pexels_api_key_here
PORT=5000
NODE_ENV=development
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Getting a Pexels API Key

1. Visit [Pexels API](https://www.pexels.com/api/)
2. Sign up for a free account
3. Generate an API key
4. Add it to your backend `.env` file

## 📱 How to Use

1. **Generate Content**: Enter a topic or choose from suggestions
2. **Customize Design**: Select fonts, colors, and backgrounds
3. **Preview Slides**: See how your slides will look
4. **Download**: Export individual slides or all slides as PNG
5. **Create TikTok**: Upload slides to TikTok with generated description

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Frontend Development

```bash
cd frontend

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### API Endpoints

- `POST /api/generate-slideshow` - Generate slideshow content
- `GET /api/search-images` - Search for background images
- `GET /api/health` - Health check endpoint

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2
- Any Node.js hosting platform

### Frontend Deployment

The frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS S3 + CloudFront
- Any static hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### Important Notes:
- **Any modifications or derivative works must also be open-source under the same license.**
- **If you use this project or modify it, you must provide attribution by linking to the original source: BrandCraft.**
- **If you deploy this project as a web service, you must provide access to the modified source code.**
- **For more details, see the [LICENSE](LICENSE) file in this repository.**

### Contact for Support:
- **Twitter**: [@hi_itsbey](https://x.com/hi_itsbey)

## 🙏 Acknowledgments

- **Pexels** for providing high-quality background images
- **OpenAI** for AI content generation capabilities
- **Next.js** team for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: [link-to-docs-if-available]

## 🔮 Roadmap

- [ ] Video export functionality
- [ ] More animation options
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Mobile app version

---

**Made with ❤️ by [Your Name]**

*This project requires attribution when used publicly. Please respect the license terms.*
