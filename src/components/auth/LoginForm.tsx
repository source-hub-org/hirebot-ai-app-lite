import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLoading } from '@/hooks/useLoading'
import { LoginCredentials as BaseLoginCredentials } from '@/types/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthForm, FormErrors, FormField } from './AuthForm'
import { validateEmail, validatePassword } from '@/utils/formValidation'

// Extended interface with index signature
interface LoginCredentials extends BaseLoginCredentials {
  [key: string]: string | undefined
}

/**
 * Login form component
 */
export function LoginForm({ className }: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { login, isLoading, error } = useAuth()
  const { withLoading } = useLoading()

  // Check for registration success message in URL
  useEffect(() => {
    if (searchParams) {
      const registered = searchParams.get('registered')
      if (registered === 'success') {
        setSuccessMessage('Registration successful! You can now log in with your credentials.')
      }
    }
  }, [searchParams])

  /**
   * Handles input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  /**
   * Validates form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const emailError = validateEmail(credentials.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(credentials.password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Clear any previous errors and success messages
    setErrors({})
    setSuccessMessage(null)

    try {
      // Use withLoading to show global loading state during login
      await withLoading(async () => {
        await login(credentials)
        // The router.replace happens inside the login function
      })
    } catch (error) {
      console.error('Login form error:', error)

      // Set a general error message
      setErrors({
        general: error instanceof Error ? error.message : 'Login failed. Please try again.',
      })
    }
  }

  /**
   * Handles GitHub login
   */
  const handleGitHubLogin = () => {
    // Implement GitHub OAuth login
    alert('GitHub login not implemented yet')
  }

  // Define form fields
  const loginFields: FormField[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'm@example.com',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      extraLabel: (
        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
          Forgot your password?
        </a>
      ),
    },
  ]

  // Define extra content (GitHub login)
  const extraContent = (
    <>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        onClick={handleGitHubLogin}
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            fill="currentColor"
          />
        </svg>
        Login with GitHub
      </button>
    </>
  )

  // Define footer content
  const footerContent = (
    <div className="text-center text-sm">
      Don&apos;t have an account?{' '}
      <Link href="/register" className="font-medium text-primary hover:underline">
        Sign up
      </Link>
    </div>
  )

  return (
    <AuthForm
      className={className}
      title="Login to your account"
      subtitle="Enter your email below to login to your account"
      fields={loginFields}
      values={credentials}
      errors={errors}
      isLoading={isLoading}
      successMessage={successMessage}
      errorMessage={error || errors.general}
      submitButtonText="Login"
      loadingButtonText="Logging in..."
      onChange={handleChange}
      onSubmit={handleSubmit}
      extraContent={extraContent}
      footerContent={footerContent}
    />
  )
}
