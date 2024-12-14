import { LockRounded } from '@mui/icons-material'
import { Card, CardContent, Typography } from '@mui/material'
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
            {budget.status === 'pending_review' ? (
                <Card elevation={3}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 100,
                        }}
                    >
                        <LockRounded className='me-1' /> BLOQUEADO
                    </CardContent>
                </Card>
            ) : (
                <KitItem kit={budget.kit} setKit={() => {}} viewOnly={true} />
            )}
        </React.Fragment>
    )
}
