import { PersonPinCircleRounded } from '@mui/icons-material'
import { Box } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertContext } from '../../../../../contexts/AlertContext'
import { UserContext } from '../../../../../contexts/UserContext'
import { baseURL } from '../../../../../globals'
import useUtils from '../../../../../hooks/useUtils'
import { Visit } from '../../../../../types/VisitTypes'
import Loading from '../../../../template/Loading/Loading'
import PageHeader from '../../../../template/PageHeader/PageHeader'
import Actions from './Actions'
import ClientData from './ClientData'
import EnergyBills from './EnergyBills'
import VisitComment from './VisitComment'
import VisitImages from './VisitImages'
import VisitLocal from './VisitLocal'
import VisitTime from './VisitTime'

export default function VisitDetails() {
    const { sellerId, visitId } = useParams()
    const [loading, setLoading] = useState(true)
    const [visit, setVisit] = useState<Visit>({} as Visit)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { user } = useContext(UserContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`${baseURL}/doc`, {
                    params: {
                        user: user.id,
                        path: 'visits',
                        id: visitId,
                    },
                })

                if (!result.data)
                    throw {
                        message: 'Erro ao buscar dados',
                        code: 'UNKNOWN_ERROR',
                    }

                setVisit(result.data)
                setLoading(false)
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

        fetchData()
    }, [])

    if (loading) return <Loading message='Carregando Dados da Visita...' />

    return (
        <React.Fragment>
            <PageHeader
                title='Detalhes da Visita'
                icon={<PersonPinCircleRounded />}
                path={[
                    'dashboard',
                    'visits',
                    'seller',
                    sellerId as string,
                    visitId as string,
                ]}
            />
            <VisitLocal visit={visit} />
            <Box sx={{ mt: 2 }} />
            <ClientData visit={visit} />
            <Box sx={{ mt: 2 }} />
            <VisitTime visit={visit} />
            <Box sx={{ mt: 2 }} />
            <VisitImages visit={visit} />
            <Box sx={{ mt: 2 }} />
            <VisitComment visit={visit} />
            <Box sx={{ mt: 2 }} />
            <EnergyBills visit={visit} />
            <Box sx={{ mt: 2 }} />
            <Actions visit={visit} />
        </React.Fragment>
    )
}
