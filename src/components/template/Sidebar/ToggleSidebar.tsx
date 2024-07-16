import { useTheme } from '@mui/material'
import styled from 'styled-components'

const ToggleSidebarContainer = styled.button`
    position: absolute;
    top: 50%;
    right: -13px;
    height: 76px;
    width: 13px;
    padding: 0px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(1) translateY(-50%) !important;
    z-index: 1;
    & * {
        transform: scale(1) !important;
    }
`

export default function ToggleSidebar({
    open,
    onClick,
}: {
    open: boolean
    onClick: () => void
}) {
    const theme = useTheme()

    return (
        <ToggleSidebarContainer
            onClick={onClick}
            aria-label='Mostrar/Esconder barra lateral'
        >
            <svg
                viewBox='0 0 14 60'
                style={{
                    filter: 'drop-shadow(4px 0px 3px rgba(0, 0, 0, 0.2))',
                }}
            >
                <path
                    d='M 0 0 A 7 7 0 0 0 7 7 A 7 7 0 0 1 14 14 V 46 A 7 7 0 0 1 7 53 A 7 7 0 0 0 0 60 Z'
                    fill={
                        theme.palette.mode === 'dark'
                            ? theme.palette.background.default
                            : '#fff'
                    }
                ></path>
            </svg>
            <svg
                id='svg2'
                fill='currentColor'
                aria-hidden='true'
                width='12'
                height='12'
                viewBox='0 0 12 12'
                xmlns='http://www.w3.org/2000/svg'
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginLeft: '-6px',
                    marginTop: '-6px',
                    rotate: open ? '90deg' : '-90deg',
                    transition: 'all 0.3s ease 0s',
                }}
            >
                <path
                    d='M2.22 4.47c.3-.3.77-.3 1.06 0L6 7.19l2.72-2.72a.75.75 0 0 1 1.06 1.06L6.53 8.78c-.3.3-.77.3-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06Z'
                    fill={theme.palette.text.primary}
                ></path>
            </svg>
        </ToggleSidebarContainer>
    )
}
