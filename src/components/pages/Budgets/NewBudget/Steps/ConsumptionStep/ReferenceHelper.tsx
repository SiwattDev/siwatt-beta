import { Grid, Paper, Typography } from '@mui/material'

export default function ReferenceHelper() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2 }} elevation={3}>
                    <Typography variant='body1'>TESTE 01</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2 }} elevation={3}>
                    <Typography variant='body1'>TESTE 01</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2 }} elevation={3}>
                    <Typography variant='body1'>TESTE 01</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}
