import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material'
import FileLoader from '../../../../../template/FileLoader/FileLoader'

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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label='ID da conta de energia'
                            size='small'
                            fullWidth
                            type='number'
                            required
                        />
                    </Grid>
                    {months.map((month) => (
                        <Grid item xs={12} sm={6} md={4} key={month}>
                            <TextField
                                type='number'
                                label={month}
                                size='small'
                                required
                                fullWidth
                            />
                        </Grid>
                    ))}
                    <Grid container item xs={12} md={6}>
                        <Grid item xs={12}>
                            <Typography className='mb-1'>
                                Foto da conta de energia:
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FileLoader
                                acceptedTypes={['png', 'jpg', 'jpeg']}
                                maxQuantity={1}
                                sx={{ height: '150px', overflow: 'hidden' }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} md={6}>
                        <Grid item xs={12}>
                            <Typography className='mb-1'>
                                Foto do gráfico de consumo:
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FileLoader
                                acceptedTypes={['png', 'jpg', 'jpeg']}
                                maxQuantity={1}
                                sx={{ height: '150px', overflow: 'hidden' }}
                            />
                        </Grid>
                    </Grid>
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
