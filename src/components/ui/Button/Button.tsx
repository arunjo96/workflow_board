import React from 'react'
import styles from './Button.module.css'


type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
    children: React.ReactNode
}

 export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...rest
}) => {
    return (
        <button className={[styles.btn, styles[variant], styles[size], className].join(' ')}
            disabled={disabled || loading} {...rest}
            aria-busy={loading}>
            {loading && <span className={styles.spinner} aria-hidden />}
            {children}
        </button>
    )
}



