import {
    ApartmentRounded,
    BadgeRounded,
    BentoRounded,
    DescriptionRounded,
    Diversity3Rounded,
    HandshakeRounded,
    MenuRounded,
    MonetizationOnRounded,
    PeopleAltRounded,
    ShareLocationRounded,
} from '@mui/icons-material'
import {
    Backdrop,
    Box,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SidebarLink from './SidebarLink'
import ToggleSidebar from './ToggleSidebar'

const Container = styled.aside`
    position: relative;
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.2s ease-in-out;
    bottom: 0;
    left: 0;
    height: 100%;
    max-width: 250px;
    z-index: 14;
`

export default function Sidebar() {
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
    const [open, setOpen] = useState<boolean>(isMdUp)
    const location = useLocation()
    const links = [
        { to: 'funnel', icon: <MonetizationOnRounded />, text: 'Funil' },
        { to: 'budgets', icon: <DescriptionRounded />, text: 'Orçamentos' },
        { to: 'clients', icon: <PeopleAltRounded />, text: 'Clientes' },
        { to: 'visits', icon: <ShareLocationRounded />, text: 'CRM Visitas' },
        { to: 'products', icon: <BentoRounded />, text: 'Produtos' },
        { to: 'agents', icon: <BadgeRounded />, text: 'Usuários' },
        { to: 'teams', icon: <Diversity3Rounded />, text: 'Equipes' },
        { to: 'partners', icon: <HandshakeRounded />, text: 'Parceiros' },
        { to: 'units', icon: <ApartmentRounded />, text: 'Unidades' },
    ]

    return (
        <React.Fragment>
            <Container
                style={{
                    width: open ? (isMdUp ? '200px' : '250px') : '0px',
                    padding: open ? '0px 10px 10px 10px' : '0px 5px',
                    position: isMdUp ? 'relative' : 'fixed',
                    background:
                        theme.palette.mode === 'dark'
                            ? theme.palette.background.default
                            : '#fff',
                }}
            >
                <Box
                    sx={{
                        display: open ? 'block' : 'none',
                    }}
                >
                    {!isMdUp && (
                        <React.Fragment>
                            <Typography variant='h5' className='m-2'>
                                <MenuRounded /> Menu
                            </Typography>
                            <Divider
                                orientation='horizontal'
                                flexItem
                                variant='fullWidth'
                                sx={{
                                    borderColor: theme.palette.primary.main,
                                    opacity: 0.5,
                                    my: '10px',
                                }}
                            />
                        </React.Fragment>
                    )}
                    {links.map(({ to, icon, text }, index) => (
                        <Box
                            onClick={() => setOpen(isMdUp ? true : false)}
                            key={to + index}
                        >
                            <SidebarLink
                                to={to}
                                icon={icon}
                                text={text}
                                active={location.pathname.includes(to)}
                            />
                        </Box>
                    ))}
                </Box>
                <ToggleSidebar open={open} onClick={() => setOpen(!open)} />
                <Typography
                    sx={{ fontSize: '12px', display: open ? 'block' : 'none' }}
                >
                    © {new Date().getFullYear()} - Siwatt by VANSISTEM
                </Typography>
            </Container>
            {!isMdUp && open && (
                <Backdrop
                    open={open}
                    sx={{ zIndex: 13 }}
                    onClick={() => setOpen(false)}
                />
            )}
        </React.Fragment>
    )
}
