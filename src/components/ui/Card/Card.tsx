import React from 'react'
import styles from './Card.module.css'



interface CardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hoverable = false
}) => {
  return (
      <div className={[styles.card, hoverable ? styles.hoverable : '', className].join(' ')}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
          {children}
    </div>
  )
}

