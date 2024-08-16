import { MonetizationOnRounded } from '@mui/icons-material'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import PageHeader from '../../template/PageHeader/PageHeader'
import General from './General/General'
import SelectType from './SelectType'

export default function Funnel() {
    const [type, setType] = useState<'general' | 'bySeller'>('general')

    return (
        <React.Fragment>
            <PageHeader
                title='Funil de vendas'
                icon={<MonetizationOnRounded />}
                path={['dashboard', 'funnel']}
            />
            <SelectType onSelect={setType} />
            <Box className='my-3' />
            {type === 'general' && <General />}
        </React.Fragment>
    )
}
