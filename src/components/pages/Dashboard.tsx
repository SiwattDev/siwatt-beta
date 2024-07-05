import { useTheme } from '@mui/material'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { UserContext } from '../../contexts/UserContext'
import { auth } from '../../firebase'
import { baseURL } from '../../globals'
import Content from '../template/Content/Content'
import Header from '../template/Header/Header'
import Loading from '../template/Loading/Loading'
import Sidebar from '../template/Sidebar/Sidebar'
import ToastCustom from '../template/ToastCustom/ToastCustom'

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
                        toast.error('Erro ao buscar os dados do usuário')

                    setUser(userData.data)
                    setLoading(false)
                } catch (error) {
                    console.log('Erro:', error)
                    toast.success('Erro ao buscar os dados do usuário')
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
            <ToastCustom />
        </Container>
    )
}
