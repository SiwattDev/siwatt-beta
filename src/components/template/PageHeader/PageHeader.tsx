import { Box, Breadcrumbs, Paper, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Chip = styled(Typography)`
    font-size: 12px !important;
    padding: 0px 8px;
    border-radius: 15px;
`

type PageHeaderProps = {
    icon: JSX.Element
    title: string
    path: string[]
}

export default function PageHeader({ icon, title, path }: PageHeaderProps) {
    const theme = useTheme()
    return (
        <Paper className='p-3 d-flex flex-wrap gap-2 mb-3'>
            <Box className='d-flex gap-2'>
                {icon} <Typography>{title}</Typography>
            </Box>
            <Breadcrumbs>
                {path.map((currentPath, index) => {
                    const fullPath = path.slice(0, index + 1).join('/')

                    return (
                        <Link
                            to={`/${fullPath}`}
                            key={currentPath + index}
                            style={{ textDecoration: 'none' }}
                        >
                            <Chip
                                sx={{
                                    backgroundColor: theme.palette.primary.pale,
                                    color:
                                        theme.palette.mode === 'dark'
                                            ? '#fff'
                                            : theme.palette.primary.main,
                                }}
                            >
                                {currentPath}
                            </Chip>
                        </Link>
                    )
                })}
            </Breadcrumbs>
        </Paper>
    )
}
