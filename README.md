# HireBot AI App Lite

HireBot AI App Lite is a streamlined technical assessment platform for evaluating candidates' programming skills. This application allows recruiters and hiring managers to create customized assessments, manage candidates, and evaluate their technical knowledge efficiently.

## Features

- **Candidate Management**: Add and track candidates through the hiring process
- **Customizable Assessments**: Create assessments with questions filtered by programming language, topic, and position
- **Interactive Question Interface**: Multiple-choice questions with explanations and free-form text answers
- **Code Snippets Support**: Questions can include formatted code snippets for technical evaluations
- **Submission Scoring**: Automatic scoring of candidate submissions

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Context API
- **API Integration**: Custom API services for questions, candidates, and submissions

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- [Bun](https://bun.sh/) runtime

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hirebot-ai-app-lite.git
   cd hirebot-ai-app-lite
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run the development server:
   ```bash
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable UI components
- `/src/contexts`: React context providers
- `/src/services`: API service functions
- `/src/types`: TypeScript type definitions
- `/src/lib`: Utility functions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
