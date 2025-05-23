# 📁 Project Structure

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