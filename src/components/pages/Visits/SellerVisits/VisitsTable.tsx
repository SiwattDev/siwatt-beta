import { MoreVertRounded, VisibilityRounded } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchContext } from '../../../../contexts/SearchContext'
import { Visit } from '../../../../types/VisitTypes'
import DynamicTable from '../../../template/DynamicTable/DynamicTable'
import SimpleMenu from '../../../template/SimpleMenu/SimpleMenu'

export default function VisitsTable({ visits }: { visits: Visit[] }) {
    const { search } = useContext(SearchContext)
    const navigate = useNavigate()

    const fieldLabels = {
        'clientData.name': 'Nome do Cliente',
        visitImages: 'Imagens da Visita',
        date: 'Data',
        locationData: 'Localização',
        energyBills: 'Contas de Energia',
        id: 'ID',
        comment: 'Comentário',
        user: 'Usuário',
    }

    const defaultVisibleFields = [
        'clientData.name',
        'visitImages',
        'date',
        'locationData',
        'energyBills',
    ]

    const customColumns = [
        {
            title: 'Ações',
            render: (row: any) => (
                <SimpleMenu
                    trigger={
                        <Button
                            size='small'
                            variant='contained'
                            sx={{
                                minWidth: 0,
                            }}
                        >
                            <MoreVertRounded fontSize='small' />
                        </Button>
                    }
                    items={[
                        {
                            icon: <VisibilityRounded />,
                            label: 'Ver detalhes',
                            onClick: () => navigate(row.id),
                        },
                    ]}
                />
            ),
        },
    ]

    const replaceToDynamicTable = (visits: Visit[]) => {
        const data = visits.map((visit: Visit) => {
            return {
                ...visit,
                'clientData.name': visit.clientData?.name || 'N/A',
                visitImages:
                    visit.visitImages?.length > 0
                        ? `Sim, ${visit.visitImages.length}`
                        : 'Não',
                date: new Date(visit.date).toLocaleDateString('pt-BR'),
                locationData: `${visit.locationData.latitude}, ${visit.locationData.longitude}`,
                energyBills:
                    visit.energyBills?.length || 0 > 0
                        ? `Sim, ${visit.energyBills?.length}`
                        : 'Não',
            }
        })

        return data
    }

    return (
        <DynamicTable
            data={replaceToDynamicTable(visits)}
            defaultVisibleFields={defaultVisibleFields}
            fieldLabels={fieldLabels}
            filterText={search}
            customColumns={customColumns}
        />
    )
}
