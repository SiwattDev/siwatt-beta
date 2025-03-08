import { ShareLocationRounded } from '@mui/icons-material'
import { Grid } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useUtils from '../../../hooks/useUtils'
import { Seller } from '../../../types/EntityTypes'
import { Visit } from '../../../types/VisitTypes'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import SellerVisitsItem from './SellerVisitsItem'

type SellerWithVisits = {
    seller: Seller
    visits: Visit[]
}

export default function Visits() {
    const [loading, setLoading] = useState(true)
    const [sellersWithVisits, setSellersWithVisits] = useState<
        SellerWithVisits[]
    >([])
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const visitsResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'visits',
                    },
                })

                const usersResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'users',
                    },
                })

                const visitsData: Visit[] = visitsResponse.data
                const sellersData: Seller[] = usersResponse.data.filter(
                    (user: Seller) =>
                        user.user_type === 'seller' ||
                        user.user_type === 'seller'
                )

                const visitsBySeller = sellersData.map((seller) => {
                    const sellerVisits = visitsData.filter(
                        (visit) => visit.user === seller.id
                    )
                    return {
                        seller: seller,
                        visits: sellerVisits,
                    }
                })

                setSellersWithVisits(visitsBySeller)
                setLoading(false)
            } catch (error) {
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <Loading message='Carregando dados...' />

    return (
        <React.Fragment>
            <PageHeader
                title='CRM Visitas'
                icon={<ShareLocationRounded />}
                path={['dashboard', 'visits']}
            />
            <Grid container spacing={2}>
                {sellersWithVisits.map((sellerWithVisits) => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        key={sellerWithVisits.seller.id}
                    >
                        <SellerVisitsItem data={sellerWithVisits} />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    )
}
