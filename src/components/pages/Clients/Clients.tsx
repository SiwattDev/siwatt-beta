import { PeopleAlt } from '@mui/icons-material'
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

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'clients',
                    },
                })

                if (!response.data)
                    throw {
                        message: 'Nenhum cliente encontrado',
                        code: 'NOT_FOUND',
                    }

                setLoading(false)
                setClients(response.data)
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
                />
            )}
        </React.Fragment>
    )
}
