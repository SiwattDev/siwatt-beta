import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material'

export default function Confirm({
    open,
    onClose,
    title,
    message,
    onConfirm,
    onCancel,
}: {
    open: boolean
    onClose: () => void
    title?: string
    message?: string
    onConfirm: () => void
    onCancel?: () => void
}) {
    return (
        <Dialog
            open={open}
            onClick={() => {
                onClose()
                if (onCancel) onCancel()
            }}
        >
            <DialogTitle>{title || 'Confirmar'}</DialogTitle>
            <DialogContent>
                <Typography>
                    {message || 'Tem certeza que deseja executar esta ação?'}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onClose()
                        if (onCancel) onCancel()
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        onConfirm()
                        onClose()
                    }}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
