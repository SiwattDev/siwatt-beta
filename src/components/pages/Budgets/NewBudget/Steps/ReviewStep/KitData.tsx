import { Typography } from '@mui/material'
import React, { useContext } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import KitItem from '../KitStep/KitItem'

export default function KitData() {
    const { budget } = useContext(BudgetContext)

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Kit Selecionado:
            </Typography>
            <KitItem kit={budget.kit} setKit={() => {}} viewOnly={true} />
        </React.Fragment>
    )
}
