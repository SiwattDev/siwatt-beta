import { ImageRounded } from '@mui/icons-material'
import { Card, CardContent, Typography } from '@mui/material'
import { Visit } from '../../../../../types/VisitTypes'
import StyledImage from './StyledImage'

export default function VisitImages({ visit }: { visit: Visit }) {
    return (
        <Card>
            <CardContent>
                <Typography variant='h6'>
                    <ImageRounded sx={{ verticalAlign: 'text-top', mr: 1 }} />{' '}
                    Imagens da Visita
                </Typography>
                {visit.visitImages.map((image, index) => (
                    <StyledImage
                        key={index}
                        src={image}
                        alt='imagem da visita'
                    />
                ))}
            </CardContent>
        </Card>
    )
}
