# HireBot AI App Lite

HireBot AI App Lite is a streamlined technical assessment platform for evaluating candidates' programming skills. This application allows recruiters and hiring managers to create customized assessments, manage candidates, and evaluate their technical knowledge efficiently.

<div align="center">
  <img src="./assets/screenshot.png" alt="HireBot AI App Lite Screenshot" width="800"/>
</div>

## 📋 Table of Contents

- [Features](#-features)
- [Architecture & Design](#-architecture--design)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

- **Candidate Management**
  - Add and track candidates through the hiring process
  - Detailed candidate profiles with skills and experience level
  - Organize candidates by position and status

- **Assessment Creation & Management**
  - Create customized assessments with targeted questions
  - Filter questions by programming language, topic, and position
  - Set time limits and difficulty levels for assessments

- **Rich Question Types**
  - Multiple-choice questions with detailed explanations
  - Free-form essay questions for open-ended responses
  - Code snippets with syntax highlighting for technical evaluations
  - Markdown support for rich text formatting

- **Evaluation & Analysis**
  - Automatic scoring of candidate submissions
  - Comprehensive submission analysis with statistics
  - Detailed answer breakdowns and performance metrics
  - Comparison tools for evaluating multiple candidates

- **User Experience**
  - Responsive design for desktop and mobile devices
  - Dark/light mode support
  - Accessible UI components following WCAG guidelines
  - Interactive and intuitive user interface

## 🏗 Architecture & Design

HireBot AI App Lite follows modern web development practices and architectural patterns:

### Design Patterns

- **Component-Based Architecture**: Modular UI components for reusability and maintainability
- **Container/Presentation Pattern**: Separation of data fetching and presentation logic
- **Context API Pattern**: Global state management using React Context
- **Custom Hooks Pattern**: Encapsulated reusable logic with custom React hooks
- **Repository Pattern**: Abstracted data access through service layers

### State Management

- **React Context API**: For global application state (auth, loading, etc.)
- **React Query**: For server state management with caching, background updates, and optimistic UI
- **Form State**: Managed with React Hook Form for efficient form handling

### API Integration

- **Service Layer**: Abstracted API calls through service modules
- **Axios Interceptors**: Centralized request/response handling
- **Error Handling**: Consistent error management across API calls
- **Data Transformation**: Standardized data formatting between client and server

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 15.3**: React framework with App Router for server components and routing
- **React 19**: UI library with latest features and improvements
- **TypeScript 5.8**: Type-safe JavaScript development

### UI & Styling
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **Shadcn UI**: Accessible and customizable component library
- **Radix UI**: Unstyled, accessible UI primitives
- **Geist Fonts**: Typography from Vercel's design system
- **Lucide Icons**: Beautiful, consistent icon set

### State Management & Data Fetching
- **TanStack Query (React Query)**: Data fetching, caching, and state management
- **React Context API**: Global state management
- **React Hook Form**: Form state management with validation
- **Zod**: TypeScript-first schema validation

### API & Data Handling
- **Axios**: HTTP client for API requests
- **React Markdown**: Markdown rendering with syntax highlighting
- **remark-gfm**: GitHub Flavored Markdown support

### Development & Testing
- **Bun**: JavaScript runtime and package manager
- **Turbopack**: Fast development experience
- **Jest 29**: Testing framework
- **React Testing Library**: Component testing utilities
- **ESLint & Prettier**: Code quality and formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- [Bun](https://bun.sh/) runtime

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hirebot-ai-app-lite.git
   cd hirebot-ai-app-lite
   ```

2. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

3. Configure environment variables in `.env.local`

### Installation & Development

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run the development server:
   ```bash
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Production Build

1. Build the application:
   ```bash
   bun build
   ```

2. Start the production server:
   ```bash
   bun start
   ```

## 📁 Project Structure

```
hirebot-ai-app-lite/
├── assets/                # Static assets and images
├── docs/                  # Documentation files
├── public/                # Public static files
├── src/
│   ├── app/               # Next.js App Router pages and layouts
│   ├── components/        # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Common UI components
│   │   ├── layout/        # Layout components
│   │   ├── question/      # Question-related components
│   │   └── ui/            # Shadcn UI components
│   ├── config/            # Configuration files
│   ├── contexts/          # React context providers
│   ├── helpers/           # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── libs/              # Library configurations
│   │   └── axios/         # Axios configuration
│   ├── middlewares/       # Next.js middleware
│   ├── pages/             # API routes (for Next.js API)
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── .env.example           # Example environment variables
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── jest.config.js         # Jest configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🧪 Testing

The project uses Jest and React Testing Library for testing components and functionality.

### Testing Strategy

- **Unit Tests**: Testing individual components and functions
- **Integration Tests**: Testing component interactions
- **Context Tests**: Testing React context providers
- **Hook Tests**: Testing custom React hooks

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests for a specific component
bun test -- LoadingComponent
```

## 👥 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write tests for new features or bug fixes
- Update documentation as needed
- Keep pull requests focused on a single feature or fix
- Ensure all tests pass before submitting

### Development Workflow

1. Pick an issue from the issue tracker or create a new one
2. Discuss the implementation approach in the issue
3. Implement the feature or fix
4. Add tests and documentation
5. Submit a pull request
6. Address review feedback

### Code of Conduct

- Be respectful and inclusive in all interactions
- Provide constructive feedback
- Focus on the best outcome for the project
- Help others learn and grow

## 📄 License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

The GPL-3.0 license ensures that:
- You can use, modify, and distribute the software
- Any modifications must be made available under the same license
- The source code must be made available when the software is distributed
- There is no warranty for the program

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Query management with [TanStack Query](https://tanstack.com/query)
- Form handling with [React Hook Form](https://react-hook-form.com)
- Validation with [Zod](https://zod.dev)
- Runtime powered by [Bun](https://bun.sh)
