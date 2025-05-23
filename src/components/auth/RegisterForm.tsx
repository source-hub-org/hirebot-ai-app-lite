import { useState } from 'react'
import { useLoading } from '@/hooks/useLoading'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import authService, { RegistrationData } from '@/services/authService'
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validatePasswordConfirmation,
} from '@/utils/formValidation'
import { AuthForm, FormErrors, FormField } from './AuthForm'

/**
 * Registration form data interface
 */
interface RegistrationFormData {
  email: string
  username: string
  password: string
  password_confirmation: string
  [key: string]: string | undefined
}

/**
 * Registration form component
 */
export function RegisterForm({ className }: React.ComponentPropsWithoutRef<'form'>) {
  const router = useRouter()
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { withLoading } = useLoading()

  /**
   * Handles input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  /**
   * Validates all form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const usernameError = validateUsername(formData.username)
    if (usernameError) newErrors.username = usernameError

    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError

    const confirmationError = validatePasswordConfirmation(
      formData.password,
      formData.password_confirmation
    )
    if (confirmationError) newErrors.password_confirmation = confirmationError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Prepares registration data for API submission
   */
  const prepareRegistrationData = (): RegistrationData => {
    return {
      email: formData.email,
      username: formData.username,
      password: formData.password,
    }
  }

  /**
   * Handles successful registration
   */
  const handleRegistrationSuccess = () => {
    // Navigate to login page with success message in query params
    router.push('/login?registered=success')
  }

  /**
   * Handles registration error
   */
  const handleRegistrationError = (error: unknown) => {
    console.error('Registration error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Registration failed. Please try again.'
    setServerError(errorMessage)
  }

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Clear any previous errors
    setErrors({})
    setServerError(null)

    try {
      // Use withLoading to show global loading state during registration
      await withLoading(async () => {
        setIsLoading(true)
        const registrationData = prepareRegistrationData()
        await authService.register(registrationData)
        handleRegistrationSuccess()
      })
    } catch (error) {
      handleRegistrationError(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Define form fields
  const registerFields: FormField[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'm@example.com',
      required: true,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'johndoe',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
    },
    {
      name: 'password_confirmation',
      label: 'Confirm Password',
      type: 'password',
      required: true,
    },
  ]

  // Define footer content
  const footerContent = (
    <div className="text-center text-sm">
      Already have an account?{' '}
      <Link href="/login" className="font-medium text-primary hover:underline">
        Log in
      </Link>
    </div>
  )

  return (
    <AuthForm
      className={className}
      title="Create an account"
      subtitle="Enter your details below to create your account"
      fields={registerFields}
      values={formData}
      errors={errors}
      isLoading={isLoading}
      errorMessage={serverError}
      submitButtonText="Register"
      loadingButtonText="Creating account..."
      onChange={handleChange}
      onSubmit={handleSubmit}
      footerContent={footerContent}
    />
  )
}
