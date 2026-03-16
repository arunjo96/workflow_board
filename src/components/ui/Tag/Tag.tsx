
import React from 'react'
import styles from './Tag.module.css'
import { FiX } from "react-icons/fi";


interface TagProps { 
    label: string
    color?: string
    onRemove?: () => void
}

export const Tag: React.FC<TagProps> = ({label, color, onRemove}) => {
  return (
     <span className={styles.tag} style={color ? { borderColor: color, color } : undefined}>
      {label}
      {onRemove && (
        <button
          className={styles.remove}
          onClick={onRemove}
          aria-label={`Remove tag ${label}`}
          type="button"
        >
          <FiX />
        </button>
      )}
    </span>
  )
}


