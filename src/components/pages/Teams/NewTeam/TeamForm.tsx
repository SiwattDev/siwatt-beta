import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { Seller, User } from '../../../../types/EntityTypes'
import { Team } from '../../../../types/TeamType'
import { Unit } from '../../../../types/UnitType'
import SellerList from './SellerList'

interface TeamFormProps {
    team: Team
    managers: User[]
    units: Unit[]
    sellers: Seller[]
    setTeam: React.Dispatch<React.SetStateAction<Team>>
    activeSeller: Seller | null
    setActiveSeller: React.Dispatch<React.SetStateAction<Seller | null>>
    handleAddSeller: () => void
}

const TeamForm: React.FC<TeamFormProps> = ({
    team,
    managers,
    units,
    sellers,
    setTeam,
    activeSeller,
    setActiveSeller,
    handleAddSeller,
}) => {
    return (
        <>
            <TextField
                size='small'
                label='Nome da Equipe'
                fullWidth
                value={team.name}
                onChange={(e) => setTeam({ ...team, name: e.target.value })}
            />
            <FormControl fullWidth className='mt-3' size='small'>
                <InputLabel>Gerente</InputLabel>
                <Select
                    label='Gerente'
                    value={team.manager}
                    onChange={(e) =>
                        setTeam({ ...team, manager: e.target.value })
                    }
                >
                    <MenuItem value=''>Selecione um gerente</MenuItem>
                    {managers.map((manager) => (
                        <MenuItem key={manager.id} value={manager.id}>
                            {manager.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <SellerList
                team={team}
                sellers={sellers}
                activeSeller={activeSeller}
                setActiveSeller={setActiveSeller}
                handleAddSeller={handleAddSeller}
                setTeam={setTeam}
            />
            <FormControl fullWidth className='mt-3' size='small'>
                <InputLabel>Unidade Vinculadora</InputLabel>
                <Select
                    label='Unidade Vinculadora'
                    value={team.unit || ''}
                    onChange={(e) => setTeam({ ...team, unit: e.target.value })}
                >
                    <MenuItem value=''>Selecione uma unidade</MenuItem>
                    {units.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                            {unit.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}

export default TeamForm
