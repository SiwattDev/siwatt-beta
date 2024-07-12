import { Grid, Paper, Typography } from '@mui/material'

export default function ReferenceHelper() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
                <Paper sx={{ p: 2 }} elevation={3}>
                    <Typography variant='body1'>Consumo médio</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
                <Paper sx={{ p: 2 }} elevation={3}>
                    <Typography variant='body1'>Potência necessária</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
                <Paper sx={{ p: 2 }} elevation={3}>
                    <Typography variant='body1'>Tamanho da usina</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
                <Paper sx={{ p: 2 }} elevation={3}>
                    <Typography variant='body1'>Preço sugerido</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}
