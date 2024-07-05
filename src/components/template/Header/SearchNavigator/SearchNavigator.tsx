import { SearchRounded } from '@mui/icons-material'
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AutoComplete from './AutoComplete'
import SearchModal from './SearchModal'

export default function SearchNavigator() {
    const theme = useTheme()
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault()
                setOpen(true)
            }
            if (event.key === 'Escape') {
                event.preventDefault()
                setOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <React.Fragment>
            {isSmUp ? (
                <AutoComplete setOpen={setOpen} />
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: theme.palette.background.default,
                        padding: '5px',
                        borderRadius: '50px',
                        border: '1px solid #3e4c5c',
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpen(true)}
                >
                    <Button
                        variant='contained'
                        sx={{
                            minWidth: '0px',
                            padding: '0px',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                        }}
                    >
                        <SearchRounded fontSize='small' />
                    </Button>
                    <Typography className='me-2'>Pesquisar</Typography>
                </Box>
            )}
            {open && <SearchModal setOpen={setOpen} />}
        </React.Fragment>
    )
}
