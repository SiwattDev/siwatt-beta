import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../../contexts/AlertContext'
import { UserContext } from '../../../../../../contexts/UserContext'
import { baseURL } from '../../../../../../globals'
import useUtils from '../../../../../../hooks/useUtils'
import { Kit, Product } from '../../../../../../types/BudgetTypes'
import Loading from '../../../../../template/Loading/Loading'

type KitModalProps = {
    kit: Kit
    setKit: (kit: Kit) => void
    open: boolean
    onClose: () => void
}

type ProductWithString = {
    id: string
    model?: string
    power?: string
    quantity?: string
    unitPrice?: string
    totalPrice?: string
}

type ProductWithType = ProductWithString & { type: 'module' | 'inverter' }

function ProductValues({
    productData,
    onChange,
    productOptions,
}: {
    productData: Product
    onChange: (product: Product) => void
    productOptions: Product[]
}) {
    const initialData: ProductWithString = {
        ...productData,
        power: productData.power?.toString() || '',
        quantity: productData.quantity?.toString() || '',
        unitPrice: productData.unitPrice?.toString() || '',
        totalPrice: productData.totalPrice?.toString() || '',
    }
    const [data, setData] = useState(initialData)

    const extractNumbers = (value: string) => {
        value = value.replace(/[^0-9.]/g, '')
        const parts = value.split('.')
        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('')
        return value
    }

    const handleChange =
        (field: keyof ProductWithString) =>
        (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
            const value = extractNumbers(e.target.value as string)

            const newProduct = { ...data, [field]: value }

            if (field === 'quantity' || field === 'unitPrice') {
                const quantity = parseFloat(newProduct.quantity || '0')
                const unitPrice = parseFloat(newProduct.unitPrice || '0')
                newProduct.totalPrice = (quantity * unitPrice).toFixed(2)
            } else if (field === 'totalPrice') {
                const quantity = parseFloat(newProduct.quantity || '1')
                const totalPrice = parseFloat(newProduct.totalPrice || '0')
                newProduct.unitPrice = (totalPrice / quantity).toFixed(2)
            }

            setData(newProduct)
            onChange({
                id: productData.id,
                model: newProduct.model || '',
                power: parseFloat(newProduct.power || '0'),
                quantity: parseFloat(newProduct.quantity || '0'),
                unitPrice: parseFloat(newProduct.unitPrice || '0'),
                totalPrice: parseFloat(newProduct.totalPrice || '0'),
            })
        }

    return (
        <React.Fragment>
            <Select
                label='Modelo'
                size='small'
                fullWidth
                className='mb-3'
                value={data.model || ''}
                onChange={(e) => {
                    console.log(e.target.value)
                    const selectedProduct = productOptions.find(
                        (product) => product.model === e.target.value
                    )
                    if (selectedProduct) {
                        const newProductData = {
                            ...data,
                            model: selectedProduct.model,
                            power: selectedProduct.power.toString(),
                            unitPrice: extractNumbers(
                                selectedProduct.price || '0'
                            ).toString(),
                            totalPrice: (
                                parseFloat(data.quantity || '0') *
                                parseFloat(
                                    extractNumbers(selectedProduct.price || '0')
                                )
                            ).toFixed(2),
                        }
                        setData(newProductData)
                        onChange({
                            id: productData.id,
                            model: selectedProduct.model,
                            power: selectedProduct.power,
                            quantity: parseFloat(data.quantity || '0'),
                            unitPrice: parseFloat(
                                extractNumbers(selectedProduct.price || '0')
                            ),
                            totalPrice: parseFloat(newProductData.totalPrice),
                        })
                    }
                }}
            >
                {productOptions.map((product) => (
                    <MenuItem key={product.id} value={product.model}>
                        {product.model}
                    </MenuItem>
                ))}
            </Select>
            <TextField
                label='Potência'
                size='small'
                fullWidth
                className='mb-3'
                value={data.power || ''}
                onChange={handleChange('power')}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>W</InputAdornment>
                    ),
                }}
            />
            <TextField
                label='Quantidade'
                type='number'
                size='small'
                fullWidth
                className='mb-3'
                value={data.quantity || ''}
                onChange={handleChange('quantity')}
            />
            <TextField
                label='Preço Unitário'
                size='small'
                fullWidth
                className='mb-3'
                value={data.unitPrice || ''}
                onChange={handleChange('unitPrice')}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>R$</InputAdornment>
                    ),
                }}
            />
            <TextField
                label='Preço Total'
                size='small'
                fullWidth
                className='mb-3'
                value={data.totalPrice || ''}
                onChange={handleChange('totalPrice')}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>R$</InputAdornment>
                    ),
                }}
            />
        </React.Fragment>
    )
}

export default function KitModal({
    kit,
    setKit,
    open,
    onClose,
}: KitModalProps) {
    const [kitData, setKitData] = useState(kit)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState({
        modules: [] as Product[],
        inverters: [] as Product[],
    })
    const { backendErros } = useUtils()
    const { showAlert } = useContext(AlertContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setKitData(kit)
    }, [kit])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        path: 'kits/itens/itens',
                        user: user.id,
                    },
                })

                if (!response.data)
                    throw {
                        message: 'Nenhum kit encontrado',
                        code: 'NO_SUITABLE_KITS',
                    }

                const modules = response.data.filter(
                    (item: ProductWithType) => item.type === 'module'
                )

                const inverters = response.data.filter(
                    (item: ProductWithType) => item.type === 'inverter'
                )

                setProducts({ modules, inverters })
                setLoading(false)
            } catch (error) {
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleClose = () => {
        onClose()
        setKitData(kit)
    }

    const handleModulesChange = (modules: Product) => {
        setKitData((prev) => ({ ...prev, modules }))
    }

    const handleInverterChange = (inverter: Product) => {
        setKitData((prev) => ({ ...prev, inverter }))
    }

    const handleSave = () => {
        const { id, modules, inverter } = kitData

        if (
            !id ||
            !modules.id ||
            !modules.model ||
            !modules.power ||
            !modules.unitPrice ||
            !modules.totalPrice ||
            !inverter.id ||
            !inverter.model ||
            !inverter.power ||
            !inverter.unitPrice ||
            !inverter.totalPrice
        ) {
            showAlert({
                message:
                    'Por favor, preencha todos os campos obrigatórios. (*)',
                type: 'error',
            })
            return
        }

        setKit(kitData)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <DialogTitle>Editar Kit {kit.id}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Loading message='Carregando produtos...' />
                ) : (
                    <React.Fragment>
                        <TextField
                            label='ID'
                            value={kitData.id}
                            onChange={(e) =>
                                setKitData({ ...kitData, id: e.target.value })
                            }
                            size='small'
                            fullWidth
                            className='mb-3'
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant='body1'>Placas</Typography>
                                <ProductValues
                                    productData={kitData.modules}
                                    onChange={handleModulesChange}
                                    productOptions={products.modules}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant='body1'>
                                    Inversor(es)
                                </Typography>
                                <ProductValues
                                    productData={kitData.inverter}
                                    onChange={handleInverterChange}
                                    productOptions={products.inverters}
                                />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
            </DialogContent>
            <DialogActions>
                <Button disabled={loading} onClick={handleClose}>
                    Cancelar
                </Button>
                <Button
                    disabled={loading}
                    variant='contained'
                    onClick={handleSave}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
