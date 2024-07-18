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
import { useState } from 'react'
import { Kit } from '../../../../../../types/BudgetTypes'

type KitModalProps = {
    kit: Kit
    setKit: (kit: Kit) => void
    open: boolean
    onClose: () => void
}

export default function KitModal({
    kit,
    setKit,
    open,
    onClose,
}: KitModalProps) {
    const [kitData, setKitData] = useState({} as Kit)

    const handleClose = () => {
        onClose()
        setKitData({} as Kit)
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <DialogTitle>Editar Kit {kit.id}</DialogTitle>
            <DialogContent>
                <TextField
                    label='ID'
                    value={kitData.id}
                    onChange={(e) =>
                        setKitData({ ...kitData, id: e.target.value })
                    }
                    size='small'
                    fullWidth
                    className='mb-3'
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant='body1'>Placas</Typography>
                        <TextField
                            label='Modelo'
                            value={kitData.modules?.model || ''}
                            onChange={(e) =>
                                setKitData({
                                    ...kitData,
                                    modules: {
                                        ...kitData.modules,
                                        model: e.target.value,
                                    },
                                })
                            }
                            fullWidth
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='body1'>Inversor(es)</Typography>
                        <TextField
                            label='Modelo'
                            value={kitData.inverter?.model || ''}
                            onChange={(e) =>
                                setKitData({
                                    ...kitData,
                                    inverter: {
                                        ...kitData.inverter,
                                        model: e.target.value,
                                    },
                                })
                            }
                            fullWidth
                            size='small'
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        setKit(kitData)
                        handleClose()
                    }}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
