import { Button, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'

type SidebarLinkProps = {
    to: string
    icon: JSX.Element
    text: string
    active?: boolean
}

export default function SidebarLink({
    to,
    icon,
    text,
    active,
}: SidebarLinkProps) {
    const theme = useTheme()

    return (
        <Link to={`/dashboard/${to}`} className='w-100'>
            <Button
                fullWidth
                variant='text'
                className='rounded-pill py-1 px-3 justify-content-start mb-1'
                sx={{
                    color: theme.palette.text.primary,
                    backgroundColor: active
                        ? theme.palette.primary.pale
                        : 'transparent',
                    '&:hover': {
                        backgroundColor: theme.palette.hover.pale,
                    },
                    '&:active': {
                        color: theme.palette.primary.main,
                    },
                }}
                startIcon={icon}
            >
                {text}
            </Button>
        </Link>
    )
}
