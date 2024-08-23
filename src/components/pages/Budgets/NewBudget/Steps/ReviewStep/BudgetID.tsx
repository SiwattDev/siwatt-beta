import { TextField } from '@mui/material'
import React, { useContext } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'

export default function BudgetID() {
    const { budget, setBudget } = useContext(BudgetContext)

    return (
        <React.Fragment>
            <TextField
                label='ID'
                value={budget.id}
                type='number'
                size='small'
                className='mb-3'
                fullWidth
                onChange={(e) =>
                    setBudget((prevData) => ({
                        ...prevData,
                        id: parseInt(e.target.value),
                    }))
                }
            />
        </React.Fragment>
    )
}
