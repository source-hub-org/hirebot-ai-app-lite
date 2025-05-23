import { cn } from '@/libs/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ReactNode } from 'react'

/**
 * Base form field interface
 */
export interface FormField {
  name: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
  extraLabel?: ReactNode
}

/**
 * Base form errors interface
 */
export interface FormErrors {
  [key: string]: string | undefined
  general?: string
}

/**
 * Auth form props interface
 */
export interface AuthFormProps<
  T extends { [key: string]: string | number | boolean | undefined | null },
> {
  className?: string
  title: string
  subtitle: string
  fields: FormField[]
  values: T
  errors: FormErrors
  isLoading: boolean
  successMessage?: string | null
  errorMessage?: string | null
  submitButtonText: string
  loadingButtonText: string
  footerContent?: ReactNode
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  extraContent?: ReactNode
}

/**
 * Reusable authentication form component
 */
export function AuthForm<
  T extends { [key: string]: string | number | boolean | undefined | null },
>({
  className,
  title,
  subtitle,
  fields,
  values,
  errors,
  isLoading,
  successMessage,
  errorMessage,
  submitButtonText,
  loadingButtonText,
  footerContent,
  onChange,
  onSubmit,
  extraContent,
}: AuthFormProps<T>) {
  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={onSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-balance text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Show a success message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{successMessage}</div>
      )}

      {/* Show a general error message */}
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{errorMessage}</div>
      )}

      <div className="grid gap-6">
        {fields.map(field => (
          <div key={field.name} className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.extraLabel}
            </div>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={String(values[field.name] || '')}
              onChange={onChange}
              required={field.required}
              aria-invalid={!!errors[field.name]}
            />
            {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]}</p>}
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? loadingButtonText : submitButtonText}
        </Button>

        {extraContent}
      </div>

      {footerContent}
    </form>
  )
}
