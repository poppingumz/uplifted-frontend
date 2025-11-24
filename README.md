# UpliftEd - Frontend Client

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Cypress](https://img.shields.io/badge/Testing-Cypress-17202C.svg)](https://www.cypress.io/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

The **UpliftEd Frontend** is a responsive, single-page application (SPA) built with **React** and **Vite**. It provides the user interface for students to take quizzes and track progress, and for teachers to manage course content.

> **Note:** This repository communicates with the [UpliftEd Backend API](LINK_TO_BACKEND_REPO).

---

## Table of Contents
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Running with Docker](#-running-with-docker)
- [Testing (E2E)](#-testing-e2e)
- [Project Structure](#-project-structure)

---

## Key Features

### User Interface
* **Role-Based Views:** Dynamic dashboard rendering based on user role (`Student` vs. `Teacher`).
* **Real-Time Updates:** Integrated **WebSockets** to display live notifications for new assignments.
* **Interactive Quizzes:** Custom-built quiz player with immediate scoring feedback.
* **Responsive Design:** Optimized layout for various screen sizes.

### Engineering
* **Fast Build Tooling:** Utilizes **Vite** for Hot Module Replacement (HMR) and optimized production builds.
* **End-to-End Testing:** Automated testing suites using **Cypress** to ensure critical user flows work correctly.
* **CI/CD Integration:** Automated build and test pipelines configured via `.gitlab-ci.yml`.

---

## Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React.js (v18) |
| **Build Tool** | Vite |
| **State/Routing** | React Router DOM, Context API |
| **HTTP Client** | Axios (with Interceptors for JWT) |
| **Testing** | Cypress (E2E) |
| **Linting** | ESLint |
| **Containerization** | Docker |

---

## Getting Started

### Prerequisites
* Node.js (v18+)
* npm (v9+)

### Installation
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/uplifted-frontend.git](https://github.com/YOUR_USERNAME/uplifted-frontend.git)
    cd uplifted-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_BASE_URL=http://localhost:8080
    VITE_WS_URL=ws://localhost:8080/ws
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5173`.

---

## Running with Docker

To run the frontend in a containerized environment (matching production):

1.  **Build the Image**
    ```bash
    docker build -t uplifted-frontend .
    ```

2.  **Run the Container**
    ```bash
    docker run -p 3000:80 uplifted-frontend
    ```
    *This serves the production build using Nginx.*

---

## Testing (E2E)

This project uses **Cypress** for End-to-End testing to simulate real user scenarios.

### Run Tests Headlessly (CI Mode)
```bash
npm run cy:run
