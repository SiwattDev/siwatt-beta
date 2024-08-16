import { AddRounded, BentoRounded } from '@mui/icons-material'
import { Fab, Grid, Tooltip } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useUtils from '../../../hooks/useUtils'
import { Product } from '../../../types/BudgetTypes'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import ProductItem from './ProductItem'

export default function Products() {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        path: 'kits/itens/itens',
                        user: user.id,
                    },
                })

                setProducts(response.data)
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

        fetchProducts()
    }, [])

    if (loading) return <Loading message='Carregando os produtos...' />

    return (
        <React.Fragment>
            <PageHeader
                title='Produtos'
                icon={<BentoRounded />}
                path={['dashboard', 'products']}
            />
            <Grid container spacing={2}>
                {products &&
                    products.map((prod) => (
                        <Grid item xs={12} md={6} lg={4} key={prod.id}>
                            <ProductItem product={prod} />
                        </Grid>
                    ))}
            </Grid>
            <Tooltip title='Novo Produto'>
                <Fab
                    color='default'
                    sx={{ position: 'fixed', bottom: 25, right: 25 }}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
        </React.Fragment>
    )
}
