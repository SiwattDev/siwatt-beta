import {
    ArrowBackRounded,
    ArrowForward,
    DescriptionRounded,
    DoneRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    Card,
    CardContent,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    useTheme,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { BudgetContext } from '../../../../contexts/BudgetContext'
import { Budget } from '../../../../types/BudgetTypes'
import PageHeader from '../../../template/PageHeader/PageHeader'
import ToastCustom from '../../../template/ToastCustom/ToastCustom'
// Step Components
import ClientStep from './Steps/ClientStep/ClientStep'
import ConsumptionStep from './Steps/ConsumptionStep/ConsumptionStep'
import KitStep from './Steps/KitStep/KitStep'
import ReviewStep from './Steps/ReviewStep/ReviewStep'
import ValidityStep from './Steps/ValidityStep/Validity'

const steps = ['Cliente', 'Consumo', 'Kit', 'Validade', 'Revisão']

const getStepContent = (step: number) => {
    switch (step) {
        case 0:
            return <ClientStep />
        case 1:
            return <ConsumptionStep />
        case 2:
            return <KitStep />
        case 3:
            return <ValidityStep />
        case 4:
            return <ReviewStep />
        default:
            return 'Unknown step'
    }
}

const validateStep = (step: number, budget: Budget) => {
    switch (step) {
        case 0:
            return budget.client
        case 1:
            return (
                budget.consumption &&
                budget.consumption?.energyBills?.length &&
                budget.consumption.roofType &&
                budget.consumption.networkType
            )
        case 2:
            return (
                budget.kit &&
                budget.kit.modules.id &&
                budget.kit.modules.quantity &&
                budget.kit.modules.totalPrice &&
                budget.kit.inverter.id &&
                budget.kit.inverter.quantity &&
                budget.kit.inverter.totalPrice
            )
        case 3:
            return budget.validity
        case 4:
            return true
        default:
            return false
    }
}

export default function NewBudget() {
    const theme = useTheme()
    const [activeStep, setActiveStep] = useState(0)
    const { budget } = useContext(BudgetContext)

    const handleNext = () => {
        if (validateStep(activeStep, budget)) {
            if (activeStep === steps.length - 1) {
                console.log('Finalizar ação específica')
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1)
            }
        } else {
            toast.error('Por favor, preencha todos os campos obrigatórios (*).')
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    return (
        <React.Fragment>
            <PageHeader
                icon={<DescriptionRounded />}
                title='Novo Orçamento'
                path={['dashboard', 'budgets', 'new']}
            />

            <Paper sx={{ p: 2 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step
                            key={label}
                            sx={{
                                color: '#3e4c5c',
                            }}
                        >
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Card sx={{ mt: 2 }}>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 2,
                    }}
                >
                    {getStepContent(activeStep)}
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                            variant='contained'
                        >
                            <ArrowBackRounded />
                        </Button>
                        <Button variant='contained' onClick={handleNext}>
                            {activeStep === steps.length - 1 ? (
                                <DoneRounded />
                            ) : (
                                <ArrowForward />
                            )}
                        </Button>
                    </Box>
                    <Typography
                        variant='caption'
                        color={theme.palette.text.secondary}
                    >
                        Campos obrigatórios (*)
                    </Typography>
                </CardContent>
            </Card>
            <ToastCustom />
        </React.Fragment>
    )
}
