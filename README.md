# Sorogan App v1.0

A simple web application for reading and studying classical texts, designed for "sorogan" style learning.

## Features

*   **Master Index:** Displays a list of available texts from a central `master-index.json`.
*   **Learning View:** Provides a dedicated view for reading and interacting with a selected text.
*   **Dynamic Data Loading:** Fetches lesson data dynamically from JSON files.
*   **Responsive Design:** The application is designed to work on various screen sizes.
*   **Vite-powered:** Built with Vite for a fast development experience.
*   **Deployment:** Configured for easy deployment to GitHub Pages.

## Project Structure

```
sorogan-app/
├── .github/workflows/deploy.yml  # GitHub Actions workflow for deployment
├── public/                       # Static assets that are copied to the build directory
│   ├── data/                     # Lesson data files
│   └── master-index.json         # Main index of all lessons
├── src/
│   ├── js/                       # JavaScript modules
│   │   ├── api.js                # Handles data fetching
│   │   ├── dom.js                # DOM element selections
│   │   ├── events.js             # Event listeners
│   │   ├── main.js               # Main application entry point
│   │   ├── state.js              # Application state management
│   │   ├── ui.js                 # UI rendering and manipulation
│   │   └── utils.js              # Utility functions
│   └── style.css                 # Main stylesheet
├── .gitignore
├── index.html
├── package.json
├── README.md                     # This file
└── vite.config.js
```

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18 or higher)
*   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/ppalhijaziyyah/sorogan-app.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd sorogan-app
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Development

To run the application in development mode with hot-reloading, use the following command:

```bash
npm run dev
```

This will start a local development server, and you can view the application in your browser at the URL provided.

### Building for Production

To build the application for production, use the following command:

```bash
npm run build
```

This will create a `dist` directory with the optimized and bundled application files.

## Deployment

This project is configured to deploy to GitHub Pages automatically whenever changes are pushed to the `main` branch. The deployment is handled by the GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

The `homepage` field in `package.json` and the `base` property in `vite.config.js` are configured for deployment to the correct repository URL.
