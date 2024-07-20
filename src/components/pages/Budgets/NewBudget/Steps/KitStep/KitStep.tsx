import { Box, Typography } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { UserContext } from '../../../../../../contexts/UserContext'
import { baseURL } from '../../../../../../globals'
import useUtils from '../../../../../../hooks/useUtils'
import { Kit } from '../../../../../../types/BudgetTypes'
import Loading from '../../../../../template/Loading/Loading'
import ReferenceHelper from '../ConsumptionStep/ReferenceHelper'
import KitItem from './KitItem'

export default function KitStep() {
    const [suggestedKits, setSuggestedKits] = useState<Kit[]>([])
    const [loading, setLoading] = useState(true)
    const { budget } = useContext(BudgetContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { user } = useContext(UserContext)

    useEffect(() => {
        const getKits = async () => {
            try {
                const response = await axios.get(`${baseURL}/generate-kits`, {
                    params: {
                        user: user.id,
                        budget,
                    },
                })

                if (response.data.kits.length === 0) {
                    throw new Error('Nenhum kit encontrado')
                }

                setSuggestedKits(response.data.kits)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            }
        }

        getKits()
    }, [])

    const setKit = (id: string, kit: Kit) => {
        setSuggestedKits((prevKits) =>
            prevKits.map((suggestedKit) =>
                suggestedKit.id === id ? kit : suggestedKit
            )
        )
    }

    if (loading) return <Loading message='Gerando sugestões de kits...' />

    return (
        <Box className='w-100'>
            <ReferenceHelper />
            <Typography variant='h6' className='mb-3 mt-3'>
                Selecione o Kit
            </Typography>
            {suggestedKits.map((kit) => (
                <KitItem key={kit.id} kit={kit} setKit={setKit} />
            ))}
        </Box>
    )
}
