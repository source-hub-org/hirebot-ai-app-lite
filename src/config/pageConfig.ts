// src/config/pageConfig.ts
interface PageConfig {
  title: string
  description: string
}

interface PageConfigMap {
  [key: string]: PageConfig
}

const pageConfig: PageConfigMap = {
  '/': {
    title: 'HireBot AI',
    description: 'Streamline your technical hiring process with AI-powered assessments.',
  },
  '/about': {
    title: 'About Us',
    description: 'Learn more about HireBot AI and our mission to transform technical hiring.',
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with our team for support or inquiries.',
  },
  '/login': {
    title: 'Login',
    description: 'Access your HireBot AI account.',
  },
  '/submissions/new': {
    title: 'Create new test',
    description: 'Start building your custom test from scratch with our intuitive interface.',
  },
  // Add more routes as needed
}

// Default config for routes not found in the map
const defaultConfig: PageConfig = {
  title: 'HireBot AI',
  description: 'AI-powered technical assessment platform',
}

export const getPageConfig = (path: string): PageConfig => {
  return pageConfig[path] || defaultConfig
}

export default pageConfig
