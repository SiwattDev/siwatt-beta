import {
    AccountCircleRounded,
    DarkModeRounded,
    LightModeRounded,
    PersonAddRounded,
} from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import LogoIcon from '../../../assets/icon-logo.webp'
import { AlertContext } from '../../../contexts/AlertContext'
import { DarkModeContext } from '../../../contexts/DarkModeContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useAuth from '../../../hooks/useAuth'
import useUtils from '../../../hooks/useUtils'
import SearchNavigator from './SearchNavigator/SearchNavigator'

const Container = styled.header`
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
`

type Company = {
    admin: string
    cnpj: string
    color: string
    email: string
    id: string
    logo: string
    name: string
    phone: string
}

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { darkMode, toggleTheme } = useContext(DarkModeContext)
    const [company, setCompany] = useState<Company | null>(null)
    const open = Boolean(anchorEl)
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget)

    const handleClose = () => setAnchorEl(null)

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`${baseURL}/doc`, {
                    params: {
                        user: user.id,
                        path: 'companies',
                        id: user.company,
                    },
                })

                setCompany(response.data)
            } catch (error: any) {
                console.error(error)
                const code =
                    error?.response?.data?.code || error.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || error.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            }
        }

        if (user.company) fetchCompany()
    }, [user])

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
                <img
                    src={company?.logo || LogoIcon}
                    width='auto'
                    height='35'
                    alt='Logo Siwatt'
                />
            </Box>
            <SearchNavigator />
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '10px',
                }}
            >
                <Tooltip title='Nova entidade'>
                    <IconButton
                        aria-label='Nova entidade'
                        onClick={() => navigate('/dashboard/create-entity')}
                    >
                        <PersonAddRounded />
                    </IconButton>
                </Tooltip>
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
