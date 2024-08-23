import { AutoGraphRounded } from '@mui/icons-material'
import { Box, Card, CardContent, Typography } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertContext } from '../../../../../contexts/AlertContext'
import { UserContext } from '../../../../../contexts/UserContext'
import { baseURL } from '../../../../../globals'
import useUtils from '../../../../../hooks/useUtils'
import {
    BudgetResult,
    BudgetWithClientData,
} from '../../../../../types/BudgetTypes'
import Loading from '../../../../template/Loading/Loading'
import PageHeader from '../../../../template/PageHeader/PageHeader'
import KitItem from '../Steps/KitStep/KitItem'
import ValidityData from '../Steps/ReviewStep/ValidityData'
import DownloadPDF from './DownloadPDF'
import EntityData from './EntityData'
import Investment from './Investment'
import MonthlyGeneration from './MonthlyGeneration'
import Payback from './Payback'
import PaymentMethods from './PaymentMethods'
import TariffReadjustment from './TariffReadjustment'
import TotalInvestmentReturn from './TotalInvestmentReturn'

export default function BudgetDetails() {
    const { id } = useParams()
    const [result, setResult] = useState<BudgetResult>({} as BudgetResult)
    const [loading, setLoading] = useState(true)
    const [budget, setBudget] = useState<BudgetWithClientData>(
        {} as BudgetWithClientData
    )
    const { calculateAverageEnergyBill } = useUtils()
    const { user } = useContext(UserContext)
    const { backendErros } = useUtils()
    const { showAlert } = useContext(AlertContext)

    const roofType = {
        metal: 'Metálico',
        ceramic: 'Cerâmico',
        concrete: 'Lage',
        'ground-mounted': 'Solo',
    }

    useEffect(() => {
        const fetchResult = async () => {
            if (!user || !user.id || !id) return

            try {
                const budgetData = await axios.get(`${baseURL}/doc`, {
                    params: {
                        user: user.id,
                        path: 'budgets',
                        id: id.toString(),
                    },
                })

                const clientData = await axios.get(`${baseURL}/doc`, {
                    params: {
                        user: user.id,
                        path: 'clients',
                        id: budgetData.data.client,
                    },
                })

                const sellerData = await axios.get(`${baseURL}/doc`, {
                    params: {
                        user: user.id,
                        path: 'users',
                        id: clientData.data.seller,
                    },
                })

                setBudget({
                    ...budgetData.data,
                    client: clientData.data,
                    seller: sellerData.data,
                })

                const resultData = await axios.get(
                    `${baseURL}/calculate-solar-energy`,
                    {
                        params: {
                            cityName: budgetData.data.solarPlantSite.city,
                            averageConsumption: calculateAverageEnergyBill(
                                budgetData.data.consumption
                            ),
                            powerSupplyType:
                                budgetData.data.consumption.networkType,
                            panelPower: budgetData.data.kit.modules.power,
                            kitPrice:
                                budgetData.data.kit.modules.totalPrice +
                                budgetData.data.kit.inverter.totalPrice,
                        },
                    }
                )

                setResult(resultData.data)
                setLoading(false)

                await axios.put(`${baseURL}/doc?user=${user.id}`, {
                    path: 'budgets',
                    id: id.toString(),
                    data: {
                        ...budgetData.data,
                        plantValue: resultData.data.plantValue,
                        peakGeneration: resultData.data.peakGeneration,
                    },
                })

                showAlert({
                    message: 'Dados atualizados com sucesso',
                    type: 'success',
                })
            } catch (error) {
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            }
        }

        fetchResult()
    }, [user.id])

    if (loading) return <Loading message='Calculando...' />

    return (
        <React.Fragment>
            <PageHeader
                title='Detalhes do Orçamento'
                icon={<AutoGraphRounded />}
                path={['dashboard', 'budgets', id || '']}
            />
            <Card>
                <CardContent>
                    <EntityData budget={budget} />
                    <Box className='mb-3' />
                    <MonthlyGeneration result={result} budget={budget} />
                    <Typography variant='h6' className='mb-2 mt-3'>
                        Kit Selecionado:
                    </Typography>
                    <KitItem
                        kit={budget.kit}
                        setKit={() => {}}
                        viewOnly={true}
                    />
                    <Typography variant='h6' className='mb-2 mt-3'>
                        Tipo de Telhado: {roofType[budget.consumption.roofType]}
                    </Typography>
                    <Investment result={result} budget={budget} />
                    <Box className='mb-3' />
                    <ValidityData budgetData={budget} />
                    <Box className='mb-3' />
                    <PaymentMethods result={result} />
                    <Box className='mb-3' />
                    <Payback result={result} />
                    <Box className='mb-3' />
                    <TariffReadjustment result={result} />
                    <Box className='mb-3' />
                    <TotalInvestmentReturn result={result} />
                    <Box className='mb-3' />
                    <DownloadPDF budget={budget} result={result} />
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
