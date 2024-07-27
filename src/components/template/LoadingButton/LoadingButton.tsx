import { Button, ButtonProps, CircularProgress } from '@mui/material'

interface LoadingButtonProps extends ButtonProps {
    children: React.ReactNode
    loading?: boolean
}

export default function LoadingButton({
    children,
    loading,
    ...props
}: LoadingButtonProps) {
    return (
        <Button {...props} disabled={loading}>
            {loading && <CircularProgress size={24} />}
            {children}
        </Button>
    )
}
