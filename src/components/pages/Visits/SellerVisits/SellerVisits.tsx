import { ShareLocationRounded } from '@mui/icons-material'
import { Box, Card, Grid } from '@mui/material'
import axios from 'axios'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertContext } from '../../../../contexts/AlertContext'
import { UserContext } from '../../../../contexts/UserContext'
import { baseURL } from '../../../../globals'
import useUtils from '../../../../hooks/useUtils'
import { Seller } from '../../../../types/EntityTypes'
import { Visit } from '../../../../types/VisitTypes'
import Loading from '../../../template/Loading/Loading'
import PageHeader from '../../../template/PageHeader/PageHeader'
import SelectPeriod from '../../../template/SelectPeriod/SelectPeriod'
import SellerData from './SellerData'
import VisitsGraph from './VisitsGraph'
import VisitsMap from './VisitsMap'
import VisitsTable from './VisitsTable'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

type SellerWithVisits = {
    seller?: Seller
    visits?: Visit[]
}

export default function SellerVisits() {
    const [loading, setLoading] = useState(true)
    const { sellerId } = useParams()
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const [sellersWithVisits, setSellersWithVisits] =
        useState<SellerWithVisits>({} as SellerWithVisits)
    const [dateRange, setDateRange] = useState<{
        startDate: string
        endDate: string
    }>({
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const sellerResponse = await axios.get(`${baseURL}/doc`, {
                    params: {
                        user: user.id,
                        path: 'users',
                        id: sellerId,
                    },
                })

                const visitsResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'visits',
                    },
                })

                const sellerVisits = visitsResponse.data.filter(
                    (visit: any) => visit.user === sellerId
                )

                setSellersWithVisits({
                    seller: sellerResponse.data,
                    visits: sellerVisits,
                })
                setLoading(false)
            } catch (error: any) {
                setLoading(false)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            }
        }

        fetchData()
    }, [])

    const filteredVisits = useMemo(() => {
        if (!sellersWithVisits.visits) return []
        return sellersWithVisits.visits.filter((visit) => {
            const visitDate = dayjs(visit.date)
            return (
                visitDate.isSameOrAfter(dayjs(dateRange.startDate)) &&
                visitDate.isSameOrBefore(dayjs(dateRange.endDate))
            )
        })
    }, [dateRange, sellersWithVisits.visits])

    const handleDateChange = (period: {
        startDate: string
        endDate: string
    }) => {
        setDateRange(period)
    }

    if (loading)
        return (
            <Loading message='Carregando dados do vendedor e das visitas...' />
        )

    return (
        <React.Fragment>
            <PageHeader
                title='Visitas do Vendedor'
                icon={<ShareLocationRounded />}
                path={['dashboard', 'visits', 'sellers', sellerId as string]}
            />
            <SelectPeriod
                onChange={handleDateChange}
                period={{
                    startDate: dayjs(dateRange.startDate),
                    endDate: dayjs(dateRange.endDate),
                }}
            />
            <Box className='my-3' />
            <SellerData seller={sellersWithVisits.seller as Seller} />
            <Box className='my-3' />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <div style={{ height: '400px' }}>
                            <VisitsGraph
                                dateRange={dateRange}
                                visits={filteredVisits}
                            />
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', minHeight: '400px' }}>
                        <VisitsMap visits={filteredVisits} />
                    </Card>
                </Grid>
            </Grid>
            <Box className='my-3' />
            <VisitsTable visits={filteredVisits} />
        </React.Fragment>
    )
}
