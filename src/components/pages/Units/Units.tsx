import { AddRounded, ApartmentRounded } from '@mui/icons-material'
import { Box, Fab, Grid, Tooltip } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useUtils from '../../../hooks/useUtils'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import NotFound from '../NotFound/NotFound'
import UnitItem from './UnitItem'
import BranchesForm from './UnitsForm'

type Unit = {
    id: string
    name: string
    cnpj: string
}

export default function Units() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [units, setUnits] = useState<Unit[]>([])
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { user } = useContext(UserContext)

    const getUnits = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${baseURL}/docs`, {
                params: {
                    user: user.id,
                    path: 'units',
                },
            })
            console.log(response.data)
            setUnits(response.data)
            setLoading(false)
        } catch (error) {
            setUnits([])
            setLoading(false)
            console.log(error)
            const err: any = error
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({
                message,
                type: code === 'DOCUMENTS_NOT_FOUND' ? 'warning' : 'error',
            })
        }
    }

    useEffect(() => {
        getUnits()
    }, [])

    if (loading) return <Loading message='Procurando unidades' />

    return (
        <React.Fragment>
            <PageHeader
                icon={<ApartmentRounded />}
                title='Unidades'
                path={['dashboard', 'units']}
            />
            {units && units.length > 0 ? (
                <Grid container spacing={2}>
                    {units.map((unit: any) => (
                        <Grid item xs={12} md={6} lg={4} key={unit.id}>
                            <UnitItem unit={unit} refresh={getUnits} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className='my-5'>
                    <NotFound
                        title='Nada aqui'
                        message='Nenhuma unidade encontrada'
                    />
                </Box>
            )}
            <Tooltip title='Nova filial'>
                <Fab
                    color='default'
                    aria-label='add'
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => setOpen(true)}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
            <BranchesForm
                open={open}
                onClose={() => {
                    setOpen(false)
                    getUnits()
                }}
            />
        </React.Fragment>
    )
}
