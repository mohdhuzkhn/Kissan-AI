# Kissan AI

An AI-powered farming advisory platform that helps farmers and agronomists make better decisions through intelligent crop analysis, field monitoring, and data-driven insights.

---

## Overview

**Kissan AI** ("Kissan" meaning *farmer* in Hindi/Urdu) is a web application that brings large-language-model reasoning to agriculture. It gives farmers a single place to get crop advisory guidance, analyze field data, track logs over time, and view analytics — all powered by Google's Gemini AI models.

The app is built as a modern single-page application with a tabbed workflow, making it easy to move between advisory chat, analytics dashboards, field data analysis, and historical field logs.

---

## Features

- **AI Crop Advisory** – Conversational, AI-driven guidance on crop health, farming practices, and agronomic decisions.
- **Analytics Dashboard** – Visual insights into field performance and trends over time.
- **Field Analyzer** – Upload and analyze field data or imagery to detect issues and opportunities.
- **Field Logs** – Maintain a running history of field activity and observations.
- **Gemini-Powered Reasoning** – Uses Google's Gemini models via a dedicated service layer for AI responses.
- **Modern Front-End** – Built with Vite, React, and TypeScript for a fast, responsive UI.
- **Configurable API Keys** – All external AI services are configurable via environment variables.
- **Production Ready** – Easily deployable to Vercel, Netlify, or any static-site host.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React |
| Language | TypeScript |
| Styling | CSS (custom design system) |
| AI Backend | Google Gemini via `geminiService.ts` |
| Version Control | Git & GitHub |

---

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm (or Yarn) installed globally

### Installation

```bash
# Clone the repository
git clone https://github.com/mohdhuzkhn/Kissan-AI.git
cd Kissan-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Open .env.local and add your API keys (e.g., GEMINI_API_KEY)
```

### Running the Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to see the app in action.

### Building for Production

```bash
npm run build
# The static files are generated in the `dist/` directory.
```

Deploy the resulting `dist/` folder to any static-site host (Vercel, Netlify, etc.).

---

## Project Structure

```
src/
├─ App.tsx                     # Root component
├─ main.tsx                    # Application entry point
├─ components/                 # Reusable UI components
├─ tabs/                       # Feature tabs
│  ├─ Advisory.tsx             #   AI crop advisory chat
│  ├─ Analytics.tsx            #   Field analytics dashboard
│  ├─ Analyzer.tsx             #   Field data / image analyzer
│  └─ FieldLogs.tsx            #   Historical field activity logs
├─ services/
│  └─ geminiService.ts         # Wrapper for Gemini API calls
├─ lib/
│  └─ utils.ts                 # Helper utilities
└─ index.css                   # Global styles

index.html                     # HTML template
.env.example                   # Example environment configuration
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes with clear messages.
4. Open a pull request describing the changes.

Please ensure linting and TypeScript checks pass before submitting.

---

## License

This project is licensed under the MIT License — see the [LICENSE](https://github.com/mohdhuzkhn/Kissan-AI/blob/main/LICENSE) file for details.

---

## Contact

- **Author**: Mohd Huzkhan
- **GitHub**: [@mohdhuzkhn](https://github.com/mohdhuzkhn)
- **Issues**: Feel free to open an issue for bug reports or feature requests.
