import { AddRounded, DescriptionRounded } from '@mui/icons-material'
import { Fab, Grid, Tooltip } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../contexts/AlertContext'
import { baseURL } from '../../../globals'
import { Budget } from '../../../types/BudgetTypes'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import BudgetItem from './BudgetItem'

export default function Budgets() {
    const [loading, setLoading] = useState(true)
    const [budgets, setBudgets] = useState<Budget[]>([])
    const navigate = useNavigate()
    const { showAlert } = useContext(AlertContext)

    useEffect(() => {
        const getBudgets = async () => {
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: 'AbeLZE8meAfox9FFa07HeseFkww2',
                        path: 'budgets',
                    },
                })

                if (!response.data) {
                    showAlert({
                        message: 'Erro ao buscar os orçamentos',
                        type: 'error',
                    })
                    return
                }

                setBudgets(response.data)
                setLoading(false)
            } catch (error) {
                const err: any = error
                showAlert({
                    message: `Erro ao buscar os orçamentos: ${err.code}`,
                    type: 'error',
                })
                setLoading(false)
            }
        }

        getBudgets()
    }, [])

    if (loading) return <Loading message='Carregando orçamentos...' />

    return (
        <React.Fragment>
            <PageHeader
                icon={<DescriptionRounded />}
                title='Orçamentos'
                path={['dashboard', 'budgets']}
            />
            <Grid container spacing={2}>
                {budgets.map((budget: Budget) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={budget.id}>
                        <BudgetItem budget={budget} />
                    </Grid>
                ))}
            </Grid>
            <Tooltip title='Novo orçamento' placement='left'>
                <Fab
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 12,
                    }}
                    color='default'
                    onClick={() => navigate('new')}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
        </React.Fragment>
    )
}
