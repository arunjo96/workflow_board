
import React from 'react'
import styles from './Select.module.css'


interface SelectOption{
    label: string
    value: string
}

interface SelectProps extends React.HTMLProps<HTMLSelectElement>{
    label?: string
    error?: string
    options: SelectOption[]
}


 export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className = '', ...rest }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`
    return (
      <div className={styles.wrapper}>
        {label && <label htmlFor={selectId} className={styles.label}>{label}</label>}
        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            id={selectId}
            className={[styles.select, error ? styles.hasError : '', className].join(' ')}
            {...rest}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className={styles.arrow}>▾</span>
        </div>
        {error && <span className={styles.error} role="alert">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'


