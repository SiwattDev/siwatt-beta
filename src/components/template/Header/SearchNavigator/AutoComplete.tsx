import {
    DescriptionRounded,
    PersonAddRounded,
    SearchRounded,
} from '@mui/icons-material'
import {
    Autocomplete,
    InputAdornment,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    TextField,
    useTheme,
} from '@mui/material'
import React, { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchContext } from '../../../../contexts/SearchContext'

type Action = {
    title: string
    icon: string
    action: () => void
}

export default function AutoComplete({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)
    const { setSearch } = useContext(SearchContext)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement> & {
            target: HTMLInputElement
        }
    ) => {
        setSearch(event.target.value)
        if (event.key === 'Enter') {
            const selectedOption = actions.find(
                (option) => option.title === event.target.value
            )
            if (selectedOption) {
                selectedOption.action()
                setOpen(false)
            }
        }
    }

    const actions: Action[] = [
        {
            title: 'Novo Orçamento',
            icon: 'description',
            action: () => navigate('/dashboard/budgets/new'),
        },
        {
            title: 'Nova Entidade',
            icon: 'personAdd',
            action: () => navigate('/dashboard/create-entity'),
        },
    ]

    const iconsComponents: Record<string, JSX.Element> = {
        description: <DescriptionRounded />,
        personAdd: <PersonAddRounded />,
    }

    return (
        <Stack
            width={300}
            sx={{
                pointerEvents: 'all',
            }}
        >
            <Autocomplete
                size='small'
                freeSolo
                options={actions}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option
                    }
                    return option.title
                }}
                renderOption={(props, option) => (
                    <ListItem
                        {...props}
                        key={option.title}
                        onClick={() => {
                            option.action()
                            setOpen(false)
                        }}
                    >
                        <ListItemIcon>
                            {iconsComponents[option.icon]}
                        </ListItemIcon>
                        <ListItemText primary={option.title} />
                    </ListItem>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Pesquisar...'
                        inputRef={inputRef}
                        onKeyUp={handleKeyDown}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchRounded />
                                </InputAdornment>
                            ),
                            style: {
                                background: theme.palette.background.paper,
                            },
                        }}
                    />
                )}
            />
        </Stack>
    )
}
