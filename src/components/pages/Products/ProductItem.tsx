import { DeleteRounded, EditRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Tooltip,
    Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import { useConfirm } from '../../../hooks/useConfirm'
import useUtils from '../../../hooks/useUtils'
import { Product } from '../../../types/BudgetTypes'
import Confirm from '../../template/Confirm/Confirm'
import ProductForm from './ProductForm'

export default function ProductItem({
    product,
    update,
}: {
    product: Product
    update: () => void
}) {
    const [editing, setEditing] = useState(false)
    const { extractNumbers } = useUtils()
    const { showConfirm, confirmState } = useConfirm()
    const { showAlert } = useContext(AlertContext)
    const { user } = useContext(UserContext)
    const { backendErros } = useUtils()
    const oneLineStyle = {
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }

    const replaceType = (type: 'module' | 'inverter') => {
        switch (type) {
            case 'module':
                return 'Placa solar'
            case 'inverter':
                return 'Inversor'
        }
    }

    const deleteProduct = (id: string) => {
        if (!id) {
            showAlert({
                message: 'Erro ao excluir produto',
                type: 'error',
            })
            return
        }
        showConfirm({
            title: 'Excluir produto',
            message: 'Tem certeza que deseja excluir este produto?',
            onConfirm: async () => {
                try {
                    await axios.delete(`${baseURL}/doc?user=${user.id}`, {
                        params: {
                            path: 'kits/itens/itens',
                            id: id,
                        },
                    })

                    showAlert({
                        message: 'Produto excluído',
                        type: 'success',
                    })
                    update()
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

    return (
        <React.Fragment>
            <Card sx={{ height: '100%' }}>
                <CardContent
                    sx={{ paddingBottom: '16px !important', padding: 2 }}
                >
                    <Tooltip title={product.model} placement='top'>
                        <Typography sx={oneLineStyle} variant='h6'>
                            {product.model}
                        </Typography>
                    </Tooltip>
                    <Typography>
                        <strong>Tipo:</strong>{' '}
                        {replaceType(product.type as 'module' | 'inverter')}
                    </Typography>
                    <Typography>
                        <strong>Potência:</strong> {product.power}
                    </Typography>
                    <Typography>
                        <strong>Preço:</strong>{' '}
                        {extractNumbers(product.price as string).toLocaleString(
                            'pt-BR',
                            {
                                style: 'currency',
                                currency: 'BRL',
                            }
                        )}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box />
                        {/* <Tooltip title='Ativar/desativar produto'>
                            <Switch />
                        </Tooltip> */}
                        <ButtonGroup size='small' variant='contained'>
                            <Button onClick={() => setEditing(true)}>
                                <EditRounded fontSize='small' />
                            </Button>
                            <Button color='error'>
                                <DeleteRounded
                                    fontSize='small'
                                    onClick={() => deleteProduct(product.id)}
                                />
                            </Button>
                        </ButtonGroup>
                    </Box>
                </CardContent>
            </Card>
            <ProductForm
                productToEdit={product}
                open={editing}
                onClose={() => {
                    setEditing(false)
                    update()
                }}
            />
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
