import {
    DeleteRounded,
    EditRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Tooltip,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { formatToCNPJ } from 'brazilian-values'
import React, { useContext, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import { useConfirm } from '../../../hooks/useConfirm'
import useUtils from '../../../hooks/useUtils'
import Confirm from '../../template/Confirm/Confirm'
import UnitsForm from './UnitsForm'

type Unit = {
    id: string
    name: string
    cnpj: string
}

export default function UnitItem({
    unit,
    refresh,
}: {
    unit: Unit
    refresh: () => void
}) {
    const [open, setOpen] = useState(false)
    const { showConfirm, confirmState } = useConfirm()
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { user } = useContext(UserContext)

    const deleteUnit = (id: string) => {
        showConfirm({
            title: 'Excluir unidade',
            message: 'Tem certeza que deseja excluir esta unidade?',
            onConfirm: async () => {
                try {
                    const response = await axios.delete(
                        `${baseURL}/doc?user=${user.id}`,
                        {
                            params: {
                                path: 'units',
                                id: id,
                            },
                        }
                    )

                    console.log(response)

                    showAlert({
                        message: 'Unidade excluída',
                        type: 'success',
                    })
                    refresh()
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
            onCancel: () => {
                console.log('cancelar')
            },
        })
        console.log('deletar', id)
    }

    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <Typography variant='h6'>{unit.name}</Typography>
                    <Typography>
                        <strong>CNPJ</strong>: {formatToCNPJ(unit.cnpj)}
                    </Typography>
                    <ButtonGroup
                        variant='contained'
                        size='small'
                        className='mt-2'
                    >
                        <Tooltip title='Ver'>
                            <Button>
                                <VisibilityRounded fontSize='small' />
                            </Button>
                        </Tooltip>
                        <Tooltip title='Editar'>
                            <Button onClick={() => setOpen(true)}>
                                <EditRounded fontSize='small' />
                            </Button>
                        </Tooltip>
                        <Tooltip title='Excluir'>
                            <Button
                                color='error'
                                onClick={() => deleteUnit(unit.id)}
                            >
                                <DeleteRounded fontSize='small' />
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </CardContent>
            </Card>
            {open && (
                <UnitsForm
                    open={open}
                    onClose={() => {
                        setOpen(false)
                        refresh()
                    }}
                    unitId={unit.id}
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
