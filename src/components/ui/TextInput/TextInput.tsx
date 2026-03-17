import React from 'react'
import styles from './TextInput.module.css'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
  helperText?: string
  
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({
    label, error, helperText, id, className = '', ...rest
}, ref) => {
const inputId = id || `input-${Math.random().toString(36).slice(2)}`
    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[styles.input, error ? styles.hasError : '', className].join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {error && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className={styles.helper}>{helperText}</span>
        )}
      </div>
    )
  }
)
TextInput.displayName = 'TextInput'


