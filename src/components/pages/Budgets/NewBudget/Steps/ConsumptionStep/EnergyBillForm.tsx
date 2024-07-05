import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from '@mui/material'

export default function EnergyBillForm({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const months = [
        'JAN',
        'FEV',
        'MAR',
        'ABR',
        'MAI',
        'JUN',
        'JUL',
        'AGO',
        'SET',
        'OUT',
        'NOV',
        'DEZ',
    ]
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Adicionar conta de energia</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} className='mt-1'>
                    {months.map((month) => (
                        <Grid item xs={4} key={month}>
                            <TextField label={month} size='small' />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='text'>
                    Cancelar
                </Button>
                <Button onClick={onClose} variant='contained'>
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
