import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.main`
    grid-area: content;
    padding: 0px 10px 10px 0px;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    max-height: 100%;
`

const ScrollBox = styled(Box)`
    background-color: ${(props) =>
        props.theme.palette.mode === 'dark'
            ? '#000'
            : props.theme.palette.background.default};
    border-radius: 10px;
    padding: 18px;
    height: inherit;
    max-height: inherit;
    overflow: auto;
    position: relative;

    &::-webkit-scrollbar {
        width: 15px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: ${(props) => props.theme.palette.text.primary};
        border-radius: 8px;
        border: 5px solid transparent;
        background-clip: content-box;
    }
`

export default function Content() {
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

    return (
        <Container style={{ paddingLeft: isMdUp ? '0px' : '10px' }}>
            <ScrollBox theme={theme}>
                <Outlet />
            </ScrollBox>
        </Container>
    )
}
