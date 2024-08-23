import { Box, Grid } from '@mui/material'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'
import { UserContext } from '../../../../contexts/UserContext'
import { baseURL } from '../../../../globals'
import useUtils from '../../../../hooks/useUtils'
import { Budget, BudgetWithClientData } from '../../../../types/BudgetTypes'
import { Team } from '../../../../types/TeamType'
import { Unit } from '../../../../types/UnitType'
import { Visit } from '../../../../types/VisitTypes'
import Loading from '../../../template/Loading/Loading'
import SelectPeriod from '../../../template/SelectPeriod/SelectPeriod'
import VisitsGraph from '../../Visits/SellerVisits/VisitsGraph'
import BudgetChart from './BudgetsChart'
import BudgetsTable from './BudgetsTable'

export default function General() {
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const [loading, setLoading] = useState(true)
    const [budgets, setBudgets] = useState<BudgetWithClientData[]>([])
    const [visits, setVisits] = useState<Visit[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [units, setUnits] = useState<Unit[]>([])
    const [dateRange, setDateRange] = useState<{
        startDate: string
        endDate: string
    }>({
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
    })

    useEffect(() => {}, [teams, units])

    const handleDateChange = (period: {
        startDate: string
        endDate: string
    }) => {
        setDateRange(period)
    }

    useEffect(() => {
        const fetchBudgets = async () => {
            setLoading(true)
            try {
                const budgetsResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'budgets',
                    },
                })

                const visitsResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'visits',
                    },
                })

                const teamsResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'teams',
                    },
                })

                const unitsResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'units',
                    },
                })

                if (
                    !budgetsResponse.data ||
                    !visitsResponse.data ||
                    !teamsResponse.data ||
                    !unitsResponse.data
                )
                    showAlert({
                        message: 'Adicione mais dados',
                        type: 'error',
                    })

                const budgetsWithClientData = budgetsResponse.data.map(
                    async (budget: Budget) => {
                        const clientId = budget.client

                        const clientResponse = await axios.get(
                            `${baseURL}/doc`,
                            {
                                params: {
                                    user: user.id,
                                    path: 'clients',
                                    id: clientId,
                                },
                            }
                        )

                        const sellerId = clientResponse.data.seller

                        const sellerResponse = await axios.get(
                            `${baseURL}/doc`,
                            {
                                params: {
                                    user: user.id,
                                    path: 'users',
                                    id: sellerId,
                                },
                            }
                        )

                        return {
                            ...budget,
                            client: clientResponse.data,
                            seller: sellerResponse.data,
                        }
                    }
                )

                setBudgets(await Promise.all(budgetsWithClientData))
                setVisits(visitsResponse.data)
                setTeams(teamsResponse.data)
                setUnits(unitsResponse.data)
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

        fetchBudgets()
    }, [])

    const filteredVisits = useMemo(() => {
        if (!visits) return []
        return visits.filter((visit) => {
            const visitDate = dayjs(visit.date)
            return (
                visitDate.isSameOrAfter(dayjs(dateRange.startDate)) &&
                visitDate.isSameOrBefore(dayjs(dateRange.endDate))
            )
        })
    }, [dateRange, visits])

    const filteredBudgets = useMemo(() => {
        if (!budgets) return []
        return budgets.filter((budget) => {
            const budgetDate = dayjs(new Date(budget.createdAt))
            console.log('budgetDate', budget.createdAt)
            return (
                budgetDate.isSameOrAfter(dayjs(dateRange.startDate)) &&
                budgetDate.isSameOrBefore(dayjs(dateRange.endDate))
            )
        })
    }, [dateRange, budgets])

    if (loading) return <Loading />

    return (
        <React.Fragment>
            <SelectPeriod
                onChange={handleDateChange}
                period={{
                    startDate: dayjs(dateRange.startDate),
                    endDate: dayjs(dateRange.endDate),
                }}
            />
            {/* <Box className='my-3' />
            <AdvancedFilters /> */}
            <Box className='my-3' />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <div style={{ height: '350px' }}>
                        <BudgetChart budgets={filteredBudgets} />
                    </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div style={{ height: '350px' }}>
                        <VisitsGraph
                            visits={filteredVisits}
                            dateRange={dateRange}
                        />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <BudgetsTable budgets={filteredBudgets} />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
