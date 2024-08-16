import {
    AddRounded,
    DeleteRounded,
    EditRounded,
    MoreVertRounded,
    PeopleAlt,
    VisibilityRounded,
} from '@mui/icons-material'
import { Button } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { SearchContext } from '../../../contexts/SearchContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useUtils from '../../../hooks/useUtils'
import { Client } from '../../../types/EntityTypes'
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
                            onClick: () => {},
                        },
                        {
                            icon: <EditRounded />,
                            label: 'Editar',
                            onClick: () => {},
                        },
                        {
                            icon: <DeleteRounded />,
                            label: 'Excluir',
                            onClick: () => {},
                        },
                        {
                            icon: <AddRounded />,
                            label: 'Mais ações',
                            onClick: () => {},
                        },
                    ]}
                />
            ),
        },
    ]

    useEffect(() => {
        const fetchClients = async () => {
            try {
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

                setLoading(false)
                setClients(clientsWithSellerData)
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
                    data={clients}
                    defaultVisibleFields={visibleFields}
                    fieldLabels={fieldLabels}
                    filterText={search}
                    customColumns={customColumns}
                />
            )}
        </React.Fragment>
    )
}
