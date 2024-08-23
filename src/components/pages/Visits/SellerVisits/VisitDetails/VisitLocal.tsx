import { MapRounded } from '@mui/icons-material'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import { Visit } from '../../../../../types/VisitTypes'

export default function VisitLocal({ visit }: { visit: Visit }) {
    return (
        <Card>
            <CardContent>
                <Typography variant='h6'>
                    <MapRounded sx={{ verticalAlign: 'text-top', mr: 1 }} />
                    Local da Visita
                </Typography>
                <Box className='px-5'>
                    <GoogleMap
                        mapContainerStyle={{
                            width: '100%',
                            height: '400px',
                            borderRadius: '10px',
                            marginTop: '10px',
                        }}
                        zoom={17}
                        center={{
                            lat: visit.locationData.latitude,
                            lng: visit.locationData.longitude,
                        }}
                    >
                        <MarkerF
                            title={visit.clientData.name}
                            position={{
                                lat: visit.locationData.latitude,
                                lng: visit.locationData.longitude,
                            }}
                        />
                    </GoogleMap>
                </Box>
            </CardContent>
        </Card>
    )
}
