import { useTheme } from '@mui/material'
import { createContext, ReactNode } from 'react'
import { toast, ToastContainer } from 'react-toastify'

type Alert = {
    message: string
    type: 'success' | 'warning' | 'info' | 'error'
}

type AlertContext = {
    showAlert: ({ message, type }: Alert) => void
}

const AlertContext = createContext({} as AlertContext)

const truncateMessage = (message: string, limit: number): string => {
    return message.length > limit ? message.slice(0, limit) + '...' : message
}

const AlertProvider = ({ children }: { children: ReactNode }) => {
    const theme = useTheme()
    const showAlert = ({ message, type }: Alert) => {
        const truncatedMessage = truncateMessage(message, 60)

        switch (type) {
            case 'success':
                toast.success(truncatedMessage)
                break
            case 'warning':
                toast.warning(truncatedMessage)
                break
            case 'info':
                toast.info(truncatedMessage)
                break
            case 'error':
                toast.error(truncatedMessage)
                break
            default:
        }
    }

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <ToastContainer position='top-right' theme={theme.palette.mode} />
        </AlertContext.Provider>
    )
}

export { AlertContext, AlertProvider }
