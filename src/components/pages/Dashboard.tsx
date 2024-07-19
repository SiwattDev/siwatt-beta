import { useTheme } from '@mui/material'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { AlertContext } from '../../contexts/AlertContext'
import { UserContext } from '../../contexts/UserContext'
import { auth } from '../../firebase'
import { baseURL } from '../../globals'
import useAuth from '../../hooks/useAuth'
import useUtils from '../../hooks/useUtils'
import Content from '../template/Content/Content'
import Header from '../template/Header/Header'
import Loading from '../template/Loading/Loading'
import Sidebar from '../template/Sidebar/Sidebar'

const Container = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        'header header'
        'sidebar content';
    height: 100vh;
    width: 100vw;
    overflow: hidden;
`

export default function Dashboard() {
    const [loading, setLoading] = useState<boolean>(true)
    const theme = useTheme()
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const { logout } = useAuth()
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    useEffect(() => {
        const subscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userData = await axios.get(`${baseURL}/users`, {
                        params: {
                            user: user.uid,
                            uid: user.uid,
                        },
                    })

                    if (!userData.data)
                        showAlert({
                            message: 'Erro ao buscar os dados do usuário',
                            type: 'error',
                        })

                    setUser(userData.data)
                    setLoading(false)
                    showAlert({
                        message: 'Entrou como ' + userData.data.name,
                        type: 'success',
                    })
                } catch (error) {
                    console.log(error)
                    const err: any = error
                    const code =
                        err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                    const message =
                        backendErros(code) || err.message || 'Erro inesperado'
                    showAlert({ message, type: 'error' })
                    logout()
                    navigate('/')
                }
            } else {
                setLoading(false)
                navigate('/')
            }
        })

        return () => subscribe()
    }, [])

    if (loading) {
        return <Loading fullPage message='Validando autenticação...' />
    }

    return (
        <Container
            style={{
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : '#fff',
                color: theme.palette.text.primary,
            }}
        >
            <Header />
            <Sidebar />
            <Content />
        </Container>
    )
}
