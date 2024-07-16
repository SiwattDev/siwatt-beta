import { Box, Paper, useTheme } from '@mui/material'
import { useContext } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { Kit } from '../../../../../../types/BudgetTypes'

export default function KitItem({ kit }: { kit: Kit }) {
    const { budget } = useContext(BudgetContext)
    const theme = useTheme()

    return (
        <Paper
            className={`mb-3 p-3 d-flex border ${
                budget.kit?.id === kit.id
                    ? 'border-2 border-dark shadow'
                    : 'shadow-sm'
            }`}
            sx={{
                background: theme.palette.background.paper,
            }}
            elevation={0}
        >
            <Box className='flex-fill me-3'></Box>
        </Paper>
    )
}
