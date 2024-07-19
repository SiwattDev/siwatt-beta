import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { formatToCEP, formatToCNPJ, isCNPJ } from 'brazilian-values'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useAPI from '../../../hooks/useAPI'
import useUtils from '../../../hooks/useUtils'

type Unit = {
    id?: string
    name: string
    cnpj: string
}

type CnpjData = {
    type: string | null
    address: {
        cep: string | null
        locality: string | null
        street: string | null
        uf: string | null
    }
    email: string | null
}

export default function UnitsForm({
    open,
    onClose,
    unitId,
}: {
    open: boolean
    onClose: (data: Unit | null) => void
    unitId?: string | null
}) {
    const [unit, setUnit] = useState<Unit>({ name: '', cnpj: '' })
    const [cnpjData, setCnpjData] = useState<CnpjData | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [nameError, setNameError] = useState<string | null>(null)
    const [cnpjError, setCnpjError] = useState<string | null>(null)
    const { extractNumbers, getNumberString, backendErros } = useUtils()
    const { APICNPJ, APICep } = useAPI()
    const { showAlert } = useContext(AlertContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (unitId) {
            setLoading(true)
            axios
                .get(`${baseURL}/doc`, {
                    params: {
                        user: user.id,
                        path: 'units',
                        id: unitId,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    setUnit(response.data)
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error)
                    const err: any = error
                    const code =
                        err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                    const message =
                        backendErros(code) || err.message || 'Erro inesperado'
                    showAlert({ message, type: 'error' })
                })
        }
    }, [unitId])

    useEffect(() => {
        if (isCNPJ(unit.cnpj)) {
            setLoading(true)
            APICNPJ(extractNumbers(unit.cnpj))
                .then((data: any) => {
                    if (data?.data?.estabelecimento?.cnpj) {
                        const newCnpjData: CnpjData = {
                            type: data.data.estabelecimento.tipo || null,
                            address: {
                                cep: data.data.estabelecimento.cep || null,
                                locality: null,
                                street: null,
                                uf: null,
                            },
                            email: data.data.estabelecimento.email || null,
                        }
                        setCnpjData(newCnpjData)

                        APICep(data.data.estabelecimento.cep)
                            .then((cepData: any) => {
                                setLoading(false)
                                setCnpjData((prevCnpjData) =>
                                    prevCnpjData
                                        ? {
                                              ...prevCnpjData,
                                              address: {
                                                  ...prevCnpjData.address,
                                                  locality:
                                                      cepData.data.localidade ||
                                                      null,
                                                  street:
                                                      cepData.data.logradouro ||
                                                      null,
                                                  uf: cepData.data.uf || null,
                                              },
                                          }
                                        : null
                                )
                            })
                            .catch(() => {
                                setLoading(false)
                                showAlert({
                                    message: 'Erro ao buscar dados do CEP',
                                    type: 'error',
                                })
                                setCnpjData((prevCnpjData) =>
                                    prevCnpjData
                                        ? {
                                              ...prevCnpjData,
                                              address: {
                                                  ...prevCnpjData.address,
                                                  locality: null,
                                                  street: null,
                                                  uf: null,
                                              },
                                          }
                                        : null
                                )
                            })
                    }
                })
                .catch(() => {
                    setLoading(false)
                    showAlert({
                        message: 'Erro ao buscar dados do CNPJ',
                        type: 'error',
                    })
                })
        }
    }, [unit.cnpj])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setUnit({ ...unit, name: newName })
        setNameError(
            newName.length >= 5
                ? null
                : 'O nome deve ter pelo menos 5 caracteres'
        )
    }

    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCnpj = getNumberString(e.target.value.toString())
        setUnit({ ...unit, cnpj: newCnpj })
        setCnpjError(isCNPJ(newCnpj) ? null : 'CNPJ inválido')
    }

    const saveUnit = async () => {
        try {
            setSaving(true)
            if (!unit.name) throw new Error('Nome é obrigatório')
            if (!unit.cnpj) throw new Error('CNPJ é obrigatório')
            if (!isCNPJ(unit.cnpj)) throw new Error('CNPJ inválido')

            const response = unitId
                ? await axios.put(`${baseURL}/doc?user=${user.id}`, {
                      path: 'units',
                      id: unitId,
                      data: unit,
                  })
                : await axios.post(`${baseURL}/doc?user=${user.id}`, {
                      path: 'units',
                      data: unit,
                  })

            if (!response.data) throw new Error('Erro ao salvar filial')

            showAlert({
                message: 'Filial salva com sucesso',
                type: 'success',
            })
            onClose(response.data)
        } catch (error) {
            console.log(error)
            const err: any = error
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={() => onClose(null)}
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle>
                {unitId ? 'Editar Filial' : 'Nova Filial'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    size='small'
                    value={unit.name}
                    onChange={handleNameChange}
                    label='Nome'
                    aria-label='Nome'
                    fullWidth
                    className='mb-3'
                    disabled={loading}
                    error={!!nameError}
                    helperText={nameError}
                />
                <TextField
                    size='small'
                    value={
                        isCNPJ(unit.cnpj) ? formatToCNPJ(unit.cnpj) : unit.cnpj
                    }
                    onChange={handleCnpjChange}
                    label='CNPJ'
                    aria-label='CNPJ'
                    fullWidth
                    disabled={loading}
                    error={!!cnpjError}
                    helperText={cnpjError}
                />
                {cnpjData && !loading && (
                    <Box>
                        {cnpjData.type && (
                            <Typography className='mt-3'>
                                <strong>Estabelecimento:</strong>{' '}
                                {cnpjData.type}
                            </Typography>
                        )}
                        {cnpjData.address.cep && (
                            <Typography className='mt-2'>
                                <strong>Endereço:</strong>{' '}
                                {cnpjData.address.street
                                    ? `${cnpjData.address.street}, ${cnpjData.address.locality}, ${formatToCEP(cnpjData.address.cep)} - ${cnpjData.address.uf}`
                                    : formatToCEP(cnpjData.address.cep)}
                            </Typography>
                        )}
                        {cnpjData.email && (
                            <Typography className='mt-2'>
                                <strong>E-mail:</strong> {cnpjData.email}
                            </Typography>
                        )}
                    </Box>
                )}
                {loading && (
                    <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        className='mt-3'
                    >
                        <CircularProgress size={24} className='me-2' />
                        <Typography className='ml-2'>
                            Carregando dados do CNPJ...
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)}>Cancelar</Button>
                <Button
                    variant='contained'
                    onClick={saveUnit}
                    disabled={loading || saving}
                >
                    {saving ? (
                        <CircularProgress size={24} color='inherit' />
                    ) : (
                        'Confirmar'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
