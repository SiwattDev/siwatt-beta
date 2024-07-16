import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'

type State = {
    id: number
    sigla: string
    nome: string
    regiao: {
        id: number
        sigla: string
        nome: string
    }
}

type City = {
    id: number
    nome: string
}

export default function Selects() {
    const { budget, setBudget } = useContext(BudgetContext)
    const [states, setStates] = useState<State[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [loadingStates, setLoadingStates] = useState(true)
    const [loadingCities, setLoadingCities] = useState(true)

    useEffect(() => {
        const fetchStates = async () => {
            const response = await axios.get(
                'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
            )
            setStates(response.data)
            setLoadingStates(false)
        }

        fetchStates()
    }, [])

    useEffect(() => {
        const fetchCities = async () => {
            if (!budget.solarPlantSite?.uf) return
            setLoadingCities(true)
            const response = await axios.get(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${budget.solarPlantSite.uf}/municipios`
            )
            setCities(response.data)
            setLoadingCities(false)
        }

        fetchCities()
    }, [budget.solarPlantSite?.uf])

    return (
        <Box>
            <Typography variant='h6' className='mb-2'>
                Informações da Instalação
            </Typography>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel required>Unidade instaladora</InputLabel>
                <Select
                    label='Unidade instaladora'
                    required
                    value={budget.consumption?.energyBillForInstallation || ''}
                    onChange={(event) =>
                        setBudget({
                            ...budget,
                            consumption: {
                                ...budget.consumption,
                                energyBillForInstallation: event.target.value,
                            },
                        })
                    }
                >
                    {budget.consumption?.energyBills?.length > 0 &&
                        budget.consumption.energyBills.map((energyBill) => (
                            <MenuItem key={energyBill.id} value={energyBill.id}>
                                {energyBill.id}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel required>Estado</InputLabel>
                <Select
                    label='Estado'
                    required
                    value={loadingStates ? '' : budget.solarPlantSite?.uf || ''}
                    onChange={(event) =>
                        setBudget({
                            ...budget,
                            solarPlantSite: {
                                ...budget.solarPlantSite,
                                uf: event.target.value,
                            },
                        })
                    }
                >
                    <MenuItem value=''>
                        <em>-- Selecione o estado --</em>
                    </MenuItem>
                    {states.map((state) => (
                        <MenuItem key={state.id} value={state.sigla}>
                            {state.sigla}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel required>Cidade</InputLabel>
                <Select
                    label='Cidade'
                    required
                    value={
                        loadingCities ? '' : budget.solarPlantSite?.city || ''
                    }
                    onChange={(event) =>
                        setBudget({
                            ...budget,
                            solarPlantSite: {
                                ...budget.solarPlantSite,
                                city: event.target.value,
                            },
                        })
                    }
                >
                    <MenuItem value=''>-- Selecione a cidade --</MenuItem>
                    {cities.map((city) => (
                        <MenuItem key={city.id} value={city.nome}>
                            {city.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel required>Tipo de teto</InputLabel>
                <Select
                    label='Tipo de teto'
                    required
                    value={budget.consumption?.roofType || ''}
                    onChange={(event) =>
                        setBudget({
                            ...budget,
                            consumption: {
                                ...budget.consumption,
                                roofType: event.target.value as
                                    | 'metal'
                                    | 'ceramic'
                                    | 'concrete'
                                    | 'ground-mounted',
                            },
                        })
                    }
                >
                    {[
                        { value: 'metal', label: 'Metálico' },
                        { value: 'ceramic', label: 'Cerâmico' },
                        { value: 'concrete', label: 'Lage' },
                        { value: 'ground-mounted', label: 'Solo' },
                    ].map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth>
                <InputLabel required>Tipo de rede</InputLabel>
                <Select
                    label='Tipo de rede'
                    required
                    value={budget.consumption?.networkType || ''}
                    onChange={(event) =>
                        setBudget({
                            ...budget,
                            consumption: {
                                ...budget.consumption,
                                networkType: event.target.value as
                                    | 'single-phase'
                                    | 'two-phase'
                                    | 'three-phase',
                            },
                        })
                    }
                >
                    {[
                        { value: 'single-phase', label: 'Monofásico' },
                        { value: 'two-phase', label: 'Bifásico' },
                        { value: 'three-phase', label: 'Trifásico' },
                    ].map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}
