import { AddRounded, Diversity3Rounded } from '@mui/icons-material'
import { Fab, Grid, Tooltip } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useUtils from '../../../hooks/useUtils'
import { Seller } from '../../../types/EntityTypes'
import { Team } from '../../../types/TeamType'
import { Unit } from '../../../types/UnitType'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import NewTeam from './NewTeam/NewTeam'
import TeamItem from './TeamItem'

export default function Teams() {
    const [open, setOpen] = useState(false)
    const [teams, setTeams] = useState<Team[]>([])
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'teams',
                    },
                })

                const teamsData = response.data

                const processedTeams = await Promise.all(
                    teamsData.map(async (team: Team) => {
                        const sellersData: Seller[] = await Promise.all(
                            team.sellers.map(
                                async (sellerId): Promise<Seller> => {
                                    const sellerData = await axios.get(
                                        `${baseURL}/doc`,
                                        {
                                            params: {
                                                user: user.id,
                                                path: 'users',
                                                id: sellerId,
                                            },
                                        }
                                    )

                                    return sellerData.data
                                }
                            )
                        )

                        const managerData = await axios.get(`${baseURL}/doc`, {
                            params: {
                                user: user.id,
                                path: 'users',
                                id: team.manager,
                            },
                        })

                        const unitData = await axios.get(`${baseURL}/doc`, {
                            params: {
                                user: user.id,
                                path: 'units',
                                id: team.unit,
                            },
                        })

                        return {
                            ...team,
                            sellers: sellersData,
                            manager: managerData.data,
                            unit: unitData.data,
                        }
                    })
                )

                setTeams(processedTeams)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            }
        }

        fetchTeams()
    }, [])

    if (loading) return <Loading />

    return (
        <React.Fragment>
            <PageHeader
                title='Equipes'
                icon={<Diversity3Rounded />}
                path={['dashboard', 'teams']}
            />
            <Grid container spacing={2}>
                {teams.map((team) => (
                    <Grid item xs={12} sm={6} md={4} key={team.id}>
                        <TeamItem
                            team={
                                team as Team & { sellers: Seller[]; unit: Unit }
                            }
                        />
                    </Grid>
                ))}
            </Grid>
            <Tooltip title='Nova equipe'>
                <Fab
                    color='default'
                    aria-label='add'
                    sx={{ position: 'fixed', bottom: 25, right: 25 }}
                    onClick={() => setOpen(true)}
                >
                    <AddRounded />
                </Fab>
            </Tooltip>
            <NewTeam open={open} onClose={() => setOpen(false)} />
        </React.Fragment>
    )
}
