import { Card, CardContent, Typography } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { UserContext } from '../../../../../../contexts/UserContext'
import { baseURL } from '../../../../../../globals'
import useUtils from '../../../../../../hooks/useUtils'
import { Client } from '../../../../../../types/EntityTypes'
import Loading from '../../../../../template/Loading/Loading'

export default function ClientData() {
    const { budget } = useContext(BudgetContext)
    const [client, setClient] = useState<Client | null>(null)
    const [loading, setLoading] = useState(true)
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    useEffect(() => {
        const getClientData = async () => {
            try {
                if (typeof budget.client === 'string') {
                    const clientResponse = await axios.get(`${baseURL}/doc`, {
                        params: {
                            user: user.id,
                            path: 'clients',
                            id: budget.client,
                        },
                    })

                    if (!clientResponse.data)
                        throw {
                            message: 'Cliente não encontrado',
                            code: 'NOT_FOUND',
                        }

                    const clientData = clientResponse.data

                    if (typeof clientData.seller === 'string') {
                        const sellerResponse = await axios.get(
                            `${baseURL}/doc`,
                            {
                                params: {
                                    user: user.id,
                                    path: 'users',
                                    id: clientData.seller,
                                },
                            }
                        )

                        clientData.seller = sellerResponse.data
                    }

                    setClient(clientData)
                } else {
                    setClient(budget.client)
                }

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

        getClientData()
    }, [budget.client, user.id, backendErros, showAlert])

    if (loading) return <Loading message='Carregando dados...' />

    return (
        <React.Fragment>
            <Typography variant='h6'>Cliente:</Typography>
            <Card elevation={3} className='mt-2 p-0'>
                <CardContent className='px-4 py-3'>
                    <Typography>
                        <strong>Nome:</strong> {client?.name}
                    </Typography>
                    <Typography>
                        <strong>Telefone:</strong> {client?.phone}
                    </Typography>
                    <Typography>
                        <strong>CEP:</strong> {client?.address?.cep}
                    </Typography>
                    <Typography>
                        <strong>Vendedor:</strong> {client?.seller?.name}
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
