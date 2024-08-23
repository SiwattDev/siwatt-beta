import { Button, ButtonGroup, Card, CardContent } from '@mui/material'
import { useEffect, useState } from 'react'

export default function SelectType({
    onSelect,
}: {
    onSelect: (type: 'general' | 'bySeller') => void
}) {
    const [type, setType] = useState<'general' | 'bySeller'>('general')

    useEffect(() => {
        onSelect(type)
    }, [type])

    return (
        <Card>
            <CardContent>
                <ButtonGroup fullWidth>
                    <Button
                        variant={type === 'general' ? 'contained' : 'outlined'}
                        onClick={() => setType('general')}
                    >
                        Geral
                    </Button>
                    <Button
                        variant={type === 'bySeller' ? 'contained' : 'outlined'}
                        onClick={() => setType('bySeller')}
                    >
                        Por Vendedor
                    </Button>
                </ButtonGroup>
            </CardContent>
        </Card>
    )
}
