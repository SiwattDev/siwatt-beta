import { Box, Typography } from '@mui/material'
import InConstructionIllustration from '../../../assets/in-construction.webp'

export default function InConstruction() {
    return (
        <Box>
            <img
                src={InConstructionIllustration}
                alt='Ilustração de página em construção'
            />
            <Typography variant='h6'>Em construção</Typography>
        </Box>
    )
}
