import { useTheme } from '@mui/material'
import { ToastContainer } from 'react-toastify'

export default function ToastCustom() {
    const theme = useTheme()

    return <ToastContainer position='top-right' theme={theme.palette.mode} />
}
