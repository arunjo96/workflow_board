import React from 'react'
import styles from './TextArea.module.css'


interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, error, id, className = '', ...rest }, ref) => {
    const inputId = id || `text-area-${Math.random().toString(36).slice(2)}`
  return (
    <div className={styles.wrapper}>
        {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={[styles.textarea, error ? styles.hasError : '', className].join(' ')}
          aria-invalid={!!error}
          {...rest}
        />
        {error && <span className={styles.error} role="alert">{error}</span>}
      </div>
    )
}
)
TextArea.displayName = 'TextArea'


