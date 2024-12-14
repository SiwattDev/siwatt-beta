import {
    DeleteRounded,
    EditRounded,
    MoreVertRounded,
    PeopleAlt,
} from '@mui/icons-material'
import { Button } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../contexts/AlertContext'
import { SearchContext } from '../../../contexts/SearchContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import { useConfirm } from '../../../hooks/useConfirm'
import useUtils from '../../../hooks/useUtils'
import { Client, EntityTypes } from '../../../types/EntityTypes'
import Confirm from '../../template/Confirm/Confirm'
import DynamicTable from '../../template/DynamicTable/DynamicTable'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import SimpleMenu from '../../template/SimpleMenu/SimpleMenu'

export default function Clients() {
    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState<Client[]>([])
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { search } = useContext(SearchContext)
    const { showConfirm, confirmState } = useConfirm()
    const navigate = useNavigate()

    const fetchClients = async () => {
        try {
            setLoading(true)
            const clientsResponse = await axios.get(`${baseURL}/docs`, {
                params: {
                    user: user.id,
                    path: 'clients',
                },
            })

            const usersResponse = await axios.get(`${baseURL}/docs`, {
                params: {
                    user: user.id,
                    path: 'users',
                },
            })

            const sellers = usersResponse.data.filter(
                (user: any) =>
                    user.type === 'seller' || user.user_type === 'seller'
            )

            const clientsWithSellerData = clientsResponse.data.map(
                (client: any) => {
                    return {
                        ...client,
                        seller: sellers.find(
                            (seller: any) => seller.id === client.seller
                        )?.name,
                    }
                }
            )

            console.log('Dados dos clientes:', clientsWithSellerData)

            setClients(clientsWithSellerData)
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

    const editClient = (row: any, entityType: EntityTypes) => {
        navigate('/dashboard/create-entity', {
            state: { entity: row, entityType },
        })
    }

    const deleteClient = (id: string) => {
        if (!id) {
            showAlert({
                message: 'Erro ao excluir cliente',
                type: 'error',
            })
            return
        }
        showConfirm({
            title: 'Excluir cliente',
            message: 'Tem certeza que deseja excluir este cliente?',
            onConfirm: async () => {
                try {
                    await axios.delete(`${baseURL}/doc?user=${user.id}`, {
                        params: {
                            path: 'clients',
                            id: id,
                        },
                    })

                    showAlert({
                        message: 'Cliente excluído',
                        type: 'success',
                    })

                    setLoading(true)
                    await fetchClients()
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
            },
            onCancel: () => {},
        })
    }

    const fieldLabels = {
        id: 'ID',
        seller: 'Vendedor',
        store_facade: 'Fachada da Loja',
        fantasy_name: 'Nome Fantasia',
        'address.reference': 'Referência do Endereço',
        'address.number': 'Número',
        'address.uf': 'UF',
        'address.road': 'Rua',
        'address.city': 'Cidade',
        'address.neighborhood': 'Bairro',
        'address.cep': 'CEP',
        type_entity: 'Tipo de Entidade',
        cpf: 'CPF',
        cnpj: 'CNPJ',
        'direct_contact.phone': 'Telefone de Contato Direto',
        'direct_contact.name': 'Nome do Contato Direto',
        'direct_contact.cpf': 'CPF do Contato Direto',
        'direct_contact.birth_of_date': 'Data de Nascimento do Contato Direto',
        'direct_contact.email': 'Email do Contato Direto',
        state_registration: 'Inscrição Estadual',
        docs: 'Documentos',
        phone: 'Telefone',
        name: 'Nome',
        email: 'Email',
    }

    const defaultVisibleFields = [
        'name',
        'phone',
        'seller',
        'cpf',
        'cnpj',
        'address.cep',
    ]

    const customColumns = [
        {
            title: 'Ações',
            render: (row: Client) => (
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
                            icon: <EditRounded />,
                            label: 'Editar',
                            onClick: () => editClient(row, 'client'),
                        },
                        {
                            icon: <DeleteRounded />,
                            label: 'Excluir',
                            onClick: () => deleteClient(row.id),
                        },
                    ]}
                />
            ),
        },
    ]

    useEffect(() => {
        fetchClients()
    }, [])

    if (loading) return <Loading message='Procurando dados dos clientes...' />

    const visibleFields = defaultVisibleFields.filter((field) =>
        clients.some((client) => field in client)
    )

    return (
        <React.Fragment>
            <PageHeader
                title='Clientes'
                icon={<PeopleAlt />}
                path={['dashboard', 'clients']}
            />
            {clients && clients.length > 0 && (
                <DynamicTable
                    tableID='clients-table'
                    data={clients}
                    defaultVisibleFields={visibleFields}
                    fieldLabels={fieldLabels}
                    filterText={search}
                    customColumns={customColumns}
                    key={clients.map((client) => client.id).join()}
                />
            )}
            <Confirm
                open={!!confirmState.title}
                onClose={() =>
                    showConfirm({ ...confirmState, title: '', message: '' })
                }
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm ?? (() => {})}
                onCancel={confirmState.onCancel}
            />
        </React.Fragment>
    )
}
