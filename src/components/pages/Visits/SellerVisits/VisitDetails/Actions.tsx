import { NoteAddRounded, PersonAddAltRounded } from '@mui/icons-material'
import { Button, Card, CardContent } from '@mui/material'
import { useEffect } from 'react'
import { Visit } from '../../../../../types/VisitTypes'

export default function Actions({ visit }: { visit: Visit }) {
    useEffect(() => {}, [visit])

    return (
        <Card>
            <CardContent sx={{ display: 'flex', gap: 2 }}>
                <Button variant='contained'>
                    <PersonAddAltRounded sx={{ mr: 1 }} /> Cadastrar Cliente
                </Button>
                <Button variant='contained'>
                    <NoteAddRounded sx={{ mr: 1 }} /> Gerar Orçamento
                </Button>
            </CardContent>
        </Card>
    )
}
