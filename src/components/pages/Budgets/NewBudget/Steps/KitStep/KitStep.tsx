import { Box, Typography } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { baseURL } from '../../../../../../globals'
import useUtils from '../../../../../../hooks/useUtils'
import { Kit } from '../../../../../../types/BudgetTypes'
import KitItem from './KitItem'

export default function KitStep() {
    const [suggestedKits, setSuggestedKits] = useState<Kit[]>([])
    const { budget } = useContext(BudgetContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    useEffect(() => {
        const getKits = async () => {
            try {
                const response = await axios.get(`${baseURL}/generate-kits`, {
                    params: {
                        user: 'AbeLZE8meAfox9FFa07HeseFkww2',
                        budget,
                    },
                })
                setSuggestedKits(response.data.kits)
            } catch (error) {
                console.log(error)
                const err: any = error
                const code = err?.response?.data?.code || err.code
                const message = backendErros(code) || err.message
                showAlert({ message, type: 'error' })
            }
        }

        getKits()
    }, [])

    return (
        <Box className='w-100'>
            <Typography variant='h6' className='mb-3'>
                Selecione o Kit
            </Typography>
            {suggestedKits.map((kit) => (
                <KitItem key={kit.id} kit={kit} />
            ))}
        </Box>
    )
}
