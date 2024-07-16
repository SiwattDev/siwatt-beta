import {
    AccountCircleRounded,
    DarkModeRounded,
    LightModeRounded,
} from '@mui/icons-material'
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import LogoIcon from '../../../assets/icon-logo.webp'
import LogoText from '../../../assets/logo.webp'
import { DarkModeContext } from '../../../contexts/DarkModeContext'
import useAuth from '../../../hooks/useAuth'
import SearchNavigator from './SearchNavigator/SearchNavigator'

const Container = styled.header`
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px;
`

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { darkMode, toggleTheme } = useContext(DarkModeContext)
    const open = Boolean(anchorEl)
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => setAnchorEl(null)

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    marginRight: '10px',
                }}
            >
                <img src={LogoIcon} width='35' height='35' alt='Logo Siwatt' />
                {isMdUp && (
                    <img
                        src={LogoText}
                        height='25'
                        className='ms-2'
                        alt='Nome Siwatt'
                    />
                )}
            </Box>
            <SearchNavigator />
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                }}
            >
                <IconButton onClick={toggleTheme} aria-label='Mudar tema'>
                    {darkMode ? <LightModeRounded /> : <DarkModeRounded />}
                </IconButton>
                <IconButton
                    onClick={handleClick}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    aria-label='Ações da conta'
                >
                    <AccountCircleRounded />
                </IconButton>
                <Menu
                    id='basic-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleClose()
                            logout()
                            navigate('/')
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Container>
    )
}
