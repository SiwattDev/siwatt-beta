import { Grid } from '@mui/material'
import EnergyBillTable from './EnergyBillTable'
import ReferenceHelper from './ReferenceHelper'
import Selects from './Selects'

export default function ConsumptionStep() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ReferenceHelper />
            </Grid>
            <Grid item xs={12}>
                <EnergyBillTable />
            </Grid>
            <Grid item xs={12}>
                <Selects />
            </Grid>
        </Grid>
    )
}
