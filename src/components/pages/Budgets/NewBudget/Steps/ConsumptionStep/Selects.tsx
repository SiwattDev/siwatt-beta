import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material'

export default function Selects() {
    return (
        <Box>
            <Typography variant='h6' className='mb-2'>
                Informações da Instalação
            </Typography>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel>Unidade instaladora *</InputLabel>
                <Select label='Unidade instaladora *' required>
                    <MenuItem value='teste'>teste</MenuItem>
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel>Estado *</InputLabel>
                <Select label='Estado *' required>
                    <MenuItem value='teste'>teste</MenuItem>
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel>Cidade *</InputLabel>
                <Select label='Cidade *' required>
                    <MenuItem value='teste'>teste</MenuItem>
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth className='mb-3'>
                <InputLabel>Tipo de teto *</InputLabel>
                <Select label='Tipo de teto *' required>
                    <MenuItem value='teste'>teste</MenuItem>
                </Select>
            </FormControl>
            <FormControl size='small' fullWidth>
                <InputLabel>Tipo de rede *</InputLabel>
                <Select label='Tipo de rede *' required>
                    <MenuItem value='teste'>teste</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}
