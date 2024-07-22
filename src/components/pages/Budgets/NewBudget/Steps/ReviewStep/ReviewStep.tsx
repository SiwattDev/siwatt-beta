import { Box } from '@mui/material'
import ClientData from './ClientData'
import ConsumptionData from './ConsumptionData'
import KitData from './KitData'
import ValidityData from './ValidityData'

export default function ReviewStep() {
    return (
        <Box sx={{ width: '100%' }}>
            <ClientData />
            <br />
            <ConsumptionData />
            <br />
            <KitData />
            <br />
            <ValidityData />
        </Box>
    )
}
