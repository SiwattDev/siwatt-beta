import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useUtils from '../../../hooks/useUtils'
import { Product } from '../../../types/BudgetTypes'
import Loading from '../../template/Loading/Loading'

export default function ProductForm({
    productToEdit,
    open,
    onClose,
}: {
    productToEdit?: Product
    open: boolean
    onClose: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState<Product>(
        productToEdit || ({} as Product)
    )
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    const handleInputChange =
        (field: keyof Product) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setProduct({ ...product, [field]: value })
        }

    const handleSelectChange =
        (field: keyof Product) => (e: SelectChangeEvent<string>) => {
            setProduct({ ...product, [field]: e.target.value })
        }

    const saveProduct = async () => {
        setLoading(true)
        try {
            if (
                !product.type ||
                !product.model ||
                !product.price ||
                !product.power
            ) {
                showAlert({
                    message: 'Preencha todos os campos obrigatórios',
                    type: 'error',
                })
                return
            }

            if (!productToEdit) {
                await axios.post(`${baseURL}/doc?user=${user.id}`, {
                    path: 'kits/itens/itens',
                    data: product,
                })
            } else {
                await axios.put(`${baseURL}/doc?user=${user.id}`, {
                    path: 'kits/itens/itens',
                    id: productToEdit.id,
                    data: product,
                })
            }

            showAlert({
                message: 'Produto salvo com sucesso',
                type: 'success',
            })
            setProduct({} as Product)
            onClose()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
            const err: any = error
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        }
    }

    useEffect(() => {
        if (productToEdit) {
            setProduct(productToEdit)
        } else {
            setProduct({} as Product)
        }
    }, [productToEdit])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle>
                {productToEdit ? 'Edição' : 'Adicionar'} Novo Produto
            </DialogTitle>
            <DialogContent className='pt-2'>
                {loading ? (
                    <Loading />
                ) : (
                    <React.Fragment>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                label='Tipo'
                                value={product.type || ''}
                                onChange={handleSelectChange('type')}
                            >
                                <MenuItem value=''>Selecione um tipo</MenuItem>
                                <MenuItem value='module'>Placa Solar</MenuItem>
                                <MenuItem value='inverter'>Inversor</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            size='small'
                            label='Modelo'
                            value={product.model || ''}
                            onChange={handleInputChange('model')}
                            fullWidth
                            className='mt-2'
                        />
                        <TextField
                            size='small'
                            label='Potência'
                            value={product.power || ''}
                            onChange={handleInputChange('power')}
                            fullWidth
                            className='mt-2'
                        />
                        <TextField
                            size='small'
                            label='Preço'
                            value={product.price || ''}
                            onChange={handleInputChange('price')}
                            fullWidth
                            className='mt-2'
                        />
                    </React.Fragment>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant='contained' onClick={saveProduct}>
                    {productToEdit ? 'Salvar' : 'Adicionar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
