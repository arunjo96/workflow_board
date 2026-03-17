import {useEffect} from 'react'
import styles from './Toast.module.css'
import { useAppDispatch, useAppSelector } from '../../../store'
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from "react-icons/fi"
import { MdOutlineClose } from "react-icons/md";
import { removeToast } from '../../../store/toastSlice'

const ICONS = {
  success: <FiCheckCircle />,
  error: <FiXCircle />,
  warning: <FiAlertTriangle />,
  info: <FiInfo />,
}


export const ToastContainer: React.FC = () => {
    const messages = useAppSelector((s) => s.toast.messages)
  const dispatch = useAppDispatch()
  return (
    <div className={styles.container} aria-live="polite" aria-label="Notifications">
      {messages.map((msg) => (
        <ToastItem
          key={msg.id}
          id={msg.id}
          message={msg.message}
          type={msg.type}
          onDismiss={() => dispatch(removeToast(msg.id))}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  onDismiss: () => void
}

const ToastItem: React.FC<ToastItemProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className={[styles.toast, styles[type]].join(' ')} role="alert">
      <span className={styles.icon}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>

      <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
        <MdOutlineClose />
      </button>
    </div>
  )
}

