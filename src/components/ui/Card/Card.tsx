import React from 'react'
import styles from './Card.module.css'



interface CardProps {
    children: React.ReactNode
    classname?: string
    onClick?: () => void
    hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({
    children,
    classname = '',
    onClick,
    hoverable = false
}) => {
  return (
      <div className={[styles.card, hoverable ? styles.hoverable : '', classname].join('')}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
          {children}
    </div>
  )
}

