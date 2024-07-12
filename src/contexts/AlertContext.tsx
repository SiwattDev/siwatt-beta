import { useTheme } from '@mui/material'
import { createContext, ReactNode } from 'react'
import { toast, ToastContainer } from 'react-toastify'

type Alert = {
    message: string
    type: string
}

type AlertContext = {
    showAlert: ({ message, type }: Alert) => void
}

const AlertContext = createContext({} as AlertContext)

const AlertProvider = ({ children }: { children: ReactNode }) => {
    const theme = useTheme()
    const showAlert = ({ message, type }: Alert) => {
        switch (type) {
            case 'success':
                toast.success(message)
                break
            case 'warning':
                toast.warning(message)
                break
            case 'info':
                toast.info(message)
                break
            case 'error':
                toast.error(message)
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
