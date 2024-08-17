import { GoogleMap, MarkerF } from '@react-google-maps/api'
import { Visit } from '../../../../types/VisitTypes'

export default function VisitsMap({ visits }: { visits: Visit[] }) {
    return (
        <GoogleMap
            mapContainerStyle={{
                width: '100%',
                height: 'inherit',
            }}
            zoom={13}
            center={{
                lat: visits[0]?.locationData.latitude || 0,
                lng: visits[0]?.locationData.longitude || 0,
            }}
        >
            {visits.map((visit, index) => (
                <MarkerF
                    title={visit.clientData.name}
                    key={index}
                    position={{
                        lat: visit.locationData.latitude,
                        lng: visit.locationData.longitude,
                    }}
                />
            ))}
        </GoogleMap>
    )
}
