import { ModeCommentRounded } from '@mui/icons-material'
import { Card, CardContent, Typography } from '@mui/material'
import { Visit } from '../../../../../types/VisitTypes'

export default function VisitComment({ visit }: { visit: Visit }) {
    return (
        <Card>
            <CardContent>
                <Typography variant='h6'>
                    <ModeCommentRounded
                        sx={{ verticalAlign: 'text-top', mr: 1 }}
                    />
                    Comentário
                </Typography>
                <Typography>
                    {visit.comment || 'Nenhum comentário informado.'}
                </Typography>
            </CardContent>
        </Card>
    )
}
