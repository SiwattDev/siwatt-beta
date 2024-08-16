import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'
import { UserContext } from '../../../../contexts/UserContext'
import { baseURL } from '../../../../globals'
import useUtils from '../../../../hooks/useUtils'
import { Seller, User } from '../../../../types/EntityTypes'
import { Team } from '../../../../types/TeamType'
import { Unit } from '../../../../types/UnitType'
import Loading from '../../../template/Loading/Loading'
import TeamForm from './TeamForm'

interface TeamDialogProps {
    open: boolean
    onClose: () => void
}

const NewTeam: React.FC<TeamDialogProps> = ({ open, onClose }) => {
    const [team, setTeam] = useState<Team>({
        id: 0,
        manager: '',
        name: '',
        sellers: [],
        unit: '',
    })
    const [activeSeller, setActiveSeller] = useState<Seller | null>(null)
    const [managers, setManagers] = useState<User[]>([])
    const [sellers, setSellers] = useState<Seller[]>([])
    const [units, setUnits] = useState<Unit[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const usersResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'users',
                    },
                })

                const unitsResponse = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'units',
                    },
                })

                const managersUsers = usersResponse.data.filter(
                    (item: User) => item.type === 'sales-manager'
                )
                setManagers(managersUsers)

                const sellersUsers = usersResponse.data.filter(
                    (item: Seller) =>
                        item.type === 'seller' || item.user_type === 'seller'
                )
                setSellers(sellersUsers)
                setUnits(unitsResponse.data)
            } catch (error) {
                console.error(error)
                const err = error as any
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user.id])

    const handleAddSeller = () => {
        if (!activeSeller) return
        if (
            team.sellers.some(
                (seller) =>
                    (typeof seller !== 'string' &&
                        seller.id === activeSeller.id) ||
                    seller === activeSeller.id
            )
        ) {
            showAlert({ message: 'Vendedor já adicionado', type: 'error' })
            setActiveSeller(null)
            return
        }
        setTeam((prevTeam) => ({
            ...prevTeam,
            sellers: [...(prevTeam.sellers as string[]), activeSeller.id],
        }))
        setActiveSeller(null)
    }

    const addTeam = async () => {
        if (
            !team.name ||
            !team.manager ||
            team.sellers.length === 0 ||
            !team.unit
        ) {
            showAlert({
                message:
                    'Preencha todos os campos e adicione pelo menos um vendedor',
                type: 'error',
            })
            return
        }

        setLoading(true)
        try {
            const response = await axios.post(
                `${baseURL}/doc?user=${user.id}`,
                {
                    path: 'teams',
                    data: team,
                }
            )

            showAlert({ message: 'Equipe adicionada', type: 'success' })
            onClose()
        } catch (error) {
            console.error(error)
            const err = error as any
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose()
                setTeam({
                    ...team,
                    name: '',
                    manager: '',
                    sellers: [],
                    unit: '',
                })
            }}
            fullWidth
            maxWidth='xs'
        >
            <DialogTitle>Adicionar Equipe</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Loading />
                ) : (
                    <TeamForm
                        team={team}
                        managers={managers}
                        units={units}
                        sellers={sellers}
                        setTeam={setTeam}
                        activeSeller={activeSeller}
                        setActiveSeller={setActiveSeller}
                        handleAddSeller={handleAddSeller}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={addTeam}
                    color='primary'
                    variant='contained'
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Adicionar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewTeam
