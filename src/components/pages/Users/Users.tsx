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
import { User } from '../../../types/EntityTypes'
import DynamicTable from '../../template/DynamicTable/DynamicTable'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import SimpleMenu from '../../template/SimpleMenu/SimpleMenu'

export default function Users() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { search } = useContext(SearchContext)

    const fieldLabels = {
        id: 'ID',
        'address.reference': 'Referência do Endereço',
        'address.number': 'Número',
        'address.uf': 'UF',
        'address.road': 'Rua',
        'address.city': 'Cidade',
        'address.neighborhood': 'Bairro',
        'address.cep': 'CEP',
        type_entity: 'Tipo de Entidade',
        phone: 'Telefone',
        name: 'Nome',
        email: 'Email',
    }

    const defaultVisibleFields = ['name', 'phone', 'email', 'address.cep']

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
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'users',
                    },
                })

                setUsers(response.data)
            } catch (error: any) {
                console.error(error)
                const code =
                    error?.response?.data?.code || error.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || error.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (loading) return <Loading message='Procurando dados dos usuários...' />

    const visibleFields = defaultVisibleFields.filter((field) =>
        users.some(
            (user: User) =>
                field
                    .split('.')
                    .reduce(
                        (o, key) =>
                            o && typeof o === 'object'
                                ? o[key as keyof typeof o]
                                : '',
                        user as any
                    ) !== ''
        )
    )

    return (
        <React.Fragment>
            <PageHeader
                title='Users'
                icon={<PeopleAlt />}
                path={['dashboard', 'users']}
            />
            {users && users.length > 0 && (
                <DynamicTable
                    data={users}
                    defaultVisibleFields={visibleFields}
                    fieldLabels={fieldLabels}
                    filterText={search}
                    customColumns={customColumns}
                />
            )}
        </React.Fragment>
    )
}
