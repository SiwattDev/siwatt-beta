import { ArrowForwardRounded } from '@mui/icons-material'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { formatToCEP, formatToPhone, isCEP, isPhone } from 'brazilian-values'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useContext, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'
import { auth } from '../../../../firebase'
import { baseURL } from '../../../../globals'
import useAPI from '../../../../hooks/useAPI'
import useUtils from '../../../../hooks/useUtils'

export default function CompleteInfo({ onNext }: { onNext: () => void }) {
    const [phone, setPhone] = useState('')
    const [cep, setCep] = useState('')
    const [city, setCity] = useState('')
    const [neighborhood, setNeighborhood] = useState('')
    const [uf, setUf] = useState('')
    const [street, setStreet] = useState('')
    const [loading, setLoading] = useState(false)
    const { APICep } = useAPI()
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    const getCepData = async (cep: string) => {
        if (cep.length !== 9) return
        try {
            const data = await APICep(cep)
            setCity(data.localidade)
            setNeighborhood(data.bairro)
            setUf(data.uf)
            setStreet(data.logradouro)
        } catch (error) {
            console.error('Erro ao buscar CEP:', error)
        }
    }

    const handleSubmit = async () => {
        if (
            !phone ||
            !cep ||
            !city ||
            !neighborhood ||
            !uf ||
            !street ||
            !isCEP(cep) ||
            !isPhone(phone)
        ) {
            showAlert({
                message: 'Preencha todos os campos antes de continuar.',
                type: 'error',
            })
            return
        }

        setLoading(true)

        const user = auth.currentUser
        if (!user) {
            showAlert({
                message: 'Usuário não encontrado. Faça login novamente.',
                type: 'error',
            })
            setLoading(false)
            return
        }

        const { email, displayName } = user
        const defaultPassword = 'senha@123'

        try {
            await user.delete()
            await axios.post(
                `${baseURL}/users?user=AbeLZE8meAfox9FFa07HeseFkww2`,
                {
                    data: {
                        name: displayName || 'Teste',
                        email,
                        phone,
                        password: defaultPassword,
                        address: {
                            cep,
                            city,
                            neighborhood,
                            uf,
                            street,
                        },
                        type: 'ceo',
                    },
                }
            )

            await signInWithEmailAndPassword(
                auth,
                email as string,
                defaultPassword
            )
            showAlert({
                message: 'Usuário recriado e autenticado com sucesso!',
                type: 'success',
            })

            onNext()
        } catch (error) {
            console.error(error)
            const err: any = error
            const code = err.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Typography variant='h6' className='m-0 mb-3'>
                Precisamos de mais algumas informações
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>Dados:</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label='Telefone'
                        size='small'
                        fullWidth
                        value={phone}
                        onChange={(e) =>
                            setPhone(formatToPhone(e.target.value))
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Endereço:</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='CEP'
                        size='small'
                        fullWidth
                        value={cep}
                        onChange={(e) => {
                            const formattedCep = formatToCEP(e.target.value)
                            setCep(formattedCep)
                            getCepData(formattedCep)
                        }}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label='Cidade'
                        size='small'
                        fullWidth
                        value={city}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label='Bairro'
                        size='small'
                        fullWidth
                        value={neighborhood}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField label='UF' size='small' fullWidth value={uf} />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label='Rua'
                        size='small'
                        fullWidth
                        value={street}
                    />
                </Grid>
            </Grid>
            <Box className='d-flex justify-content-end mt-3'>
                <Button
                    variant='contained'
                    size='small'
                    endIcon={<ArrowForwardRounded />}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Continuar'}
                </Button>
            </Box>
        </>
    )
}
