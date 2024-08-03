import { AddRounded } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { UserContext } from '../../../../../../contexts/UserContext'
import { baseURL } from '../../../../../../globals'
import useUtils from '../../../../../../hooks/useUtils'
import { Kit } from '../../../../../../types/BudgetTypes'
import Loading from '../../../../../template/Loading/Loading'
import ReferenceHelper from '../../ReferenceHelper/ReferenceHelper'
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
            setLoading(true)
            try {
                const response = await axios.get(`${baseURL}/generate-kits`, {
                    params: {
                        user: user.id,
                        budget,
                    },
                })

                if (response.data.kits.length === 0) {
                    throw {
                        message: 'Nenhum kit encontrado',
                        code: 'NO_SUITABLE_KITS',
                    }
                }

                let newSuggestedKits = response.data.kits
                const selectedKit = budget.kit

                if (selectedKit) {
                    const isDuplicate = newSuggestedKits.some(
                        (kit: Kit) =>
                            JSON.stringify(kit.modules) ===
                                JSON.stringify(selectedKit.modules) &&
                            JSON.stringify(kit.inverter) ===
                                JSON.stringify(selectedKit.inverter)
                    )

                    if (!isDuplicate) {
                        newSuggestedKits = [selectedKit, ...newSuggestedKits]
                    } else {
                        newSuggestedKits = newSuggestedKits.filter(
                            (kit: Kit) =>
                                JSON.stringify(kit.modules) !==
                                    JSON.stringify(selectedKit.modules) ||
                                JSON.stringify(kit.inverter) !==
                                    JSON.stringify(selectedKit.inverter)
                        )
                        newSuggestedKits = [selectedKit, ...newSuggestedKits]
                    }
                }

                setSuggestedKits(newSuggestedKits)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                if (code === 'NO_SUITABLE_KITS') {
                    showAlert({
                        message,
                        type: 'info',
                    })
                } else {
                    showAlert({ message, type: 'error' })
                }
            }
        }

        getKits()
    }, [user.id])

    const setKit = (id: string, kit: Kit) => {
        setSuggestedKits((prevKits) =>
            prevKits.map((suggestedKit) =>
                suggestedKit.id === id ? kit : suggestedKit
            )
        )
    }

    const isIncompleteKit = (kit: Kit): boolean => {
        const totalFields = 10
        const filledFields =
            Object.values(kit.modules).filter((value) => value).length +
            Object.values(kit.inverter).filter((value) => value).length
        return filledFields <= totalFields / 2
    }

    const addNewKit = () => {
        const existingIncompleteKit = suggestedKits.find(isIncompleteKit)
        if (existingIncompleteKit) {
            showAlert({
                message:
                    'Por favor, complete o kit em branco existente antes de adicionar um novo.',
                type: 'warning',
            })
            return
        }

        const prod = {
            id: '',
            model: '',
            unitPrice: 0,
            totalPrice: 0,
            power: 0,
        }
        const newKit: Kit = {
            id: `kit-${Date.now()}`,
            modules: prod,
            inverter: prod,
        }
        setSuggestedKits((prevKits) => [...prevKits, newKit])
        showAlert({
            message: 'Por favor, edite o novo kit em branco.',
            type: 'info',
        })
    }

    if (loading) return <Loading message='Gerando sugestões de kits...' />

    return (
        <Box className='w-100'>
            <ReferenceHelper />
            <Typography variant='h6' className='mb-3 mt-3'>
                Selecione o Kit
            </Typography>
            {suggestedKits.length === 0 ? (
                <Typography variant='body1' className='mb-3 mt-3'>
                    Nenhum kit encontrado
                </Typography>
            ) : (
                suggestedKits.map((kit) => (
                    <KitItem key={kit.id} kit={kit} setKit={setKit} />
                ))
            )}
            <Box className='mt-3 d-flex justify-content-center'>
                <Button variant='contained' color='primary' onClick={addNewKit}>
                    <AddRounded className='me-2' /> Adicionar Novo Kit
                </Button>
            </Box>
        </Box>
    )
}
