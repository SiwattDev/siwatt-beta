import { Grid, Paper, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../../contexts/BudgetContext'
import useUtils from '../../../../../hooks/useUtils'

interface InfoCardProps {
    title: string
    value: string | null
    sx?: any
}

interface ShowAlertProps {
    message: string
    type: 'error' | 'warning'
}

const getFontColor = (
    plantSize: number | null,
    neededPower: number | null
): string => {
    if (
        plantSize === null ||
        plantSize === 0 ||
        neededPower === null ||
        neededPower === 0
    ) {
        return 'inherit'
    }
    const ratio = plantSize / neededPower
    if (ratio < 0.9) {
        return 'white'
    }
    if (ratio < 1) {
        return 'orange'
    }
    return 'inherit'
}

const getCardStyle = (
    plantSize: number | null,
    neededPower: number | null
): React.CSSProperties => {
    if (
        plantSize === null ||
        plantSize === 0 ||
        neededPower === null ||
        neededPower === 0
    ) {
        return {}
    }
    const ratio = plantSize / neededPower
    if (ratio < 0.9) {
        return { backgroundColor: 'red' }
    }
    return {}
}

const handleAlerts = (
    plantSize: number | null,
    neededPower: number | null,
    showAlert: (alert: ShowAlertProps) => void
) => {
    if (
        plantSize !== null &&
        plantSize !== 0 &&
        neededPower !== null &&
        neededPower !== 0
    ) {
        const ratio = plantSize / neededPower
        if (ratio < 0.9) {
            showAlert({
                message:
                    'O tamanho da usina está muito abaixo da potência necessária.',
                type: 'error',
            })
        } else if (ratio < 1) {
            showAlert({
                message:
                    'O tamanho da usina está abaixo da potência necessária.',
                type: 'warning',
            })
        }
    }
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, sx }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, height: '100%', ...sx }} elevation={3}>
            <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                <strong>{title}:</strong> {value !== null ? value : 'N/A'}
            </Typography>
        </Paper>
    </Grid>
)

const ReferenceHelper: React.FC = () => {
    const { budget } = useContext(BudgetContext)
    const { showAlert } = useContext(AlertContext)
    const {
        calculateAverageEnergyBill,
        getNeededPower,
        getSolarIrradiation,
        calculatePlantPrice,
    } = useUtils()
    const [averageBill, setAverageBill] = useState<number | null>(null)
    const [neededPower, setNeededPower] = useState<number | null>(null)
    const [plantSize, setPlantSize] = useState<number | null>(null)
    const [plantPrice, setPlantPrice] = useState<number | null>(null)

    const { consumption, kit } = budget
    const { modules, inverter } = kit || {}
    const modulePower = modules?.power || 0
    const moduleQuantity = modules?.quantity || 1
    const inverterPrice = inverter?.totalPrice || 0
    const modulesPrice = modules?.totalPrice || 0

    useEffect(() => {
        const fetchData = async () => {
            try {
                const averageConsumption =
                    calculateAverageEnergyBill(consumption)
                setAverageBill(averageConsumption)

                const solarIrradiation = await getSolarIrradiation()
                const averageSolarIrradiation =
                    solarIrradiation.reduce((prev, curr) => prev + curr, 0) /
                    solarIrradiation.length
                const needed = getNeededPower({
                    averageConsumption: averageConsumption,
                    networkType: consumption?.networkType,
                    solarIrradiation: averageSolarIrradiation,
                })
                setNeededPower(parseFloat(needed.toFixed(2)))

                const plantSizePower = (modulePower * moduleQuantity) / 1000
                setPlantSize(parseFloat(plantSizePower.toFixed(2)))

                const kitPrice = inverterPrice + modulesPrice
                const plantPrice = await calculatePlantPrice(kitPrice)
                setPlantPrice(
                    kitPrice ? parseFloat(plantPrice.toFixed(2)) : null
                )
            } catch (error) {
                console.error(error)
                showAlert({
                    message: 'Erro ao calcular dados de referência',
                    type: 'error',
                })
            }
        }

        fetchData()
    }, [
        consumption,
        modulePower,
        moduleQuantity,
        inverterPrice,
        modulesPrice,
        calculateAverageEnergyBill,
        getNeededPower,
        getSolarIrradiation,
        calculatePlantPrice,
        showAlert,
    ])

    useEffect(() => {
        if (plantSize !== null && neededPower !== null) {
            handleAlerts(plantSize, neededPower, showAlert)
        }
    }, [plantSize, neededPower, showAlert])

    return (
        <Grid container spacing={2}>
            <InfoCard
                title='Consumo médio'
                value={averageBill !== null ? `${averageBill} KW` : null}
            />
            <InfoCard
                title='Potência necessária'
                value={neededPower !== null ? `${neededPower} KWp` : null}
            />
            <InfoCard
                title='Tamanho da usina'
                value={
                    plantSize !== null && plantSize > 0
                        ? `${plantSize} KWh/mês`
                        : null
                }
                sx={{
                    ...getCardStyle(plantSize, neededPower),
                    color: getFontColor(plantSize, neededPower),
                }}
            />
            <InfoCard
                title='Preço sugerido'
                value={
                    plantPrice !== null
                        ? plantPrice.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                          })
                        : null
                }
            />
        </Grid>
    )
}

export default ReferenceHelper
