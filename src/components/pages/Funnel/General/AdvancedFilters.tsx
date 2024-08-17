import { CloseRounded, ExpandMoreRounded } from '@mui/icons-material'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    IconButton,
    TextField,
    useTheme,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type City = {
    id: number
    nome: string
}

export default function AdvancedFilters() {
    const theme = useTheme()
    const [cities, setCities] = useState<City[]>([])
    const [selectedCities, setSelectedCities] = useState<City[]>([
        { id: 2900108, nome: 'Abaíra' },
    ])

    useEffect(() => {
        const getCities = async () => {
            const response = await axios.get(
                'https://servicodados.ibge.gov.br/api/v1/localidades/estados/BA/municipios'
            )

            setCities(response.data)
        }

        getCities()
    }, [])

    return (
        <React.Fragment>
            <Accordion sx={{ borderRadius: '3px' }}>
                <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                    Filtros Avançados
                </AccordionSummary>
                <AccordionDetails>
                    <Autocomplete
                        disablePortal
                        options={cities.map((city) => ({
                            label: city.nome,
                            id: city.id,
                        }))}
                        renderInput={(params) => (
                            <TextField {...params} label='Cidade' />
                        )}
                    />
                    <Box className='my-3' />
                    {selectedCities.map((city) => (
                        <span
                            className='border rounded-pill px-2'
                            key={city.id}
                            data-bs-theme={theme.palette.mode}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                            }}
                        >
                            {city.nome}
                            <IconButton className='p-0'>
                                <CloseRounded sx={{ fontSize: '16px' }} />
                            </IconButton>
                        </span>
                    ))}
                </AccordionDetails>
            </Accordion>
        </React.Fragment>
    )
}
