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
import styled from 'styled-components'
import LogoIcon from '../../../assets/icon-logo.png'
import LogoText from '../../../assets/logo.png'
import { DarkModeContext } from '../../../contexts/DarkModeContext'
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
                <img src={LogoIcon} width='35' height='35' />
                {isMdUp && <img src={LogoText} height='25' className='ms-2' />}
            </Box>
            <SearchNavigator />
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                }}
            >
                <IconButton onClick={toggleTheme}>
                    {darkMode ? <LightModeRounded /> : <DarkModeRounded />}
                </IconButton>
                <IconButton
                    onClick={handleClick}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
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
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </Box>
        </Container>
    )
}
