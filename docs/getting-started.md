# 🚀 Getting Started

## Prerequisites

- Node.js 20.x or higher
- [Bun](https://bun.sh/) runtime

## Environment Setup

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

## Installation & Development

1. Install dependencies:

   ```bash
   bun install
   ```

2. Run the development server:

   ```bash
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Production Build

1. Build the application:

   ```bash
   bun build
   ```

2. Start the production server:
   ```bash
   bun start
   ```