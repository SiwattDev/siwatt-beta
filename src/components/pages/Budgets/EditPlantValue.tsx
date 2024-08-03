import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'
import { useState } from 'react'

export default function EditPlantValue({
    open,
    onClose,
}: {
    open: boolean
    onClose: (newValue?: number) => void
}) {
    const [value, setValue] = useState<number | undefined>()

    const handleSave = () => {
        if (value !== undefined) {
            onClose(value)
        }
    }

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Alterar Valor do Orçamento</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin='dense'
                    label='Novo Valor'
                    type='number'
                    fullWidth
                    variant='outlined'
                    value={value ?? ''}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancelar</Button>
                <Button onClick={handleSave} color='primary'>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
