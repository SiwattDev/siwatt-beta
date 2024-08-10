import {
    MoreVertRounded,
    ShareLocationRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import { Box, Button, Card, Grid, useTheme } from '@mui/material'
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import axios from 'axios'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertContext } from '../../../../contexts/AlertContext'
import { SearchContext } from '../../../../contexts/SearchContext'
import { UserContext } from '../../../../contexts/UserContext'
import { baseURL } from '../../../../globals'
import useUtils from '../../../../hooks/useUtils'
import { Seller } from '../../../../types/EntityTypes'
import { Visit } from '../../../../types/VisitTypes'
import DynamicTable from '../../../template/DynamicTable/DynamicTable'
import Loading from '../../../template/Loading/Loading'
import PageHeader from '../../../template/PageHeader/PageHeader'
import ResponsiveBarChart from '../../../template/ResponsiveBarChart/ResponsiveBarChart'
import SelectPeriod from '../../../template/SelectPeriod/SelectPeriod'
import SimpleMenu from '../../../template/SimpleMenu/SimpleMenu'

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
    const { search } = useContext(SearchContext)
    const [dateRange, setDateRange] = useState<{
        startDate: string
        endDate: string
    }>({
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
    })
    const theme = useTheme()

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

                if (!sellerResponse.data || !visitsResponse.data) {
                    throw {
                        message: 'Erro ao buscar dados',
                        code: 'UNKNOWN_ERROR',
                    }
                }

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

    const fieldLabels = {
        'clientData.name': 'Nome do Cliente',
        visitImages: 'Imagens da Visita',
        date: 'Data',
        locationData: 'Localização',
        energyBills: 'Contas de Energia',
        id: 'ID',
        comment: 'Comentário',
        user: 'Usuário',
    }

    const defaultVisibleFields = [
        'clientData.name',
        'visitImages',
        'date',
        'locationData',
        'energyBills',
    ]

    const customColumns = [
        {
            title: 'Ações',
            render: (row: any) => (
                <SimpleMenu
                    trigger={
                        <Button
                            size='small'
                            variant='contained'
                            sx={{
                                minWidth: 0,
                            }}
                        >
                            <MoreVertRounded fontSize='small' />
                        </Button>
                    }
                    items={[
                        {
                            icon: <VisibilityRounded />,
                            label: 'Ver detalhes',
                            onClick: () => console.log(row),
                        },
                    ]}
                />
            ),
        },
    ]

    const replaceToDynamicTable = (visits: Visit[]) => {
        const data = visits.map((visit: Visit) => {
            return {
                ...visit,
                'clientData.name': visit.clientData?.name || 'N/A',
                visitImages:
                    visit.visitImages?.length > 0
                        ? `Sim, ${visit.visitImages.length}`
                        : 'Não',
                date: new Date(visit.date).toLocaleDateString('pt-BR'),
                locationData: `${visit.locationData.latitude}, ${visit.locationData.longitude}`,
                energyBills:
                    visit.energyBills?.length > 0
                        ? `Sim, ${visit.energyBills.length}`
                        : 'Não',
            }
        })

        return data
    }

    const generateChartData = useMemo(() => {
        const startDate = dayjs(dateRange.startDate)
        const endDate = dayjs(dateRange.endDate)
        const allDates = []
        let currentDate = startDate
        while (currentDate.isSameOrBefore(endDate)) {
            allDates.push(currentDate.format('YYYY-MM-DD'))
            currentDate = currentDate.add(1, 'day')
        }

        const counts = allDates.reduce((acc: any, date) => {
            acc[date] = 0
            return acc
        }, {})

        filteredVisits.forEach((visit) => {
            const dateString = dayjs(visit.date).format('YYYY-MM-DD')
            counts[dateString] = (counts[dateString] || 0) + 1
        })

        const sortedDates = Object.keys(counts).sort((a, b) =>
            dayjs(a).isBefore(dayjs(b)) ? -1 : 1
        )

        const data = {
            labels: sortedDates.map((date) => dayjs(date).format('DD/MM/YYYY')),
            datasets: [
                {
                    label: 'Visitas',
                    data: sortedDates.map((date) => counts[date]),
                    backgroundColor: theme.palette.success.light,
                    borderWidth: 0,
                },
            ],
        }

        return data
    }, [dateRange])

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
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <ResponsiveBarChart
                            data={generateChartData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Visitas por Data',
                                        color: theme.palette.text.primary,
                                        font: {
                                            size: 20,
                                            family: '"Roboto","Helvetica","Arial",sans-serif',
                                        },
                                    },
                                },
                                animation: false,
                            }}
                            title='Visitas por Data'
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', minHeight: '400px' }}>
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%',
                                height: 'inherit',
                            }}
                            zoom={13}
                            center={{
                                lat: filteredVisits[0].locationData.latitude,
                                lng: filteredVisits[0].locationData.longitude,
                            }}
                        >
                            {filteredVisits.map((visit, index) => (
                                <MarkerF
                                    title={visit.clientData.name}
                                    key={index}
                                    position={{
                                        lat: visit.locationData.latitude,
                                        lng: visit.locationData.longitude,
                                    }}
                                />
                            ))}
                        </GoogleMap>
                    </Card>
                </Grid>
            </Grid>
            <Box className='my-3' />
            <DynamicTable
                data={replaceToDynamicTable(filteredVisits)}
                defaultVisibleFields={defaultVisibleFields}
                fieldLabels={fieldLabels}
                filterText={search}
                customColumns={customColumns}
            />
        </React.Fragment>
    )
}
