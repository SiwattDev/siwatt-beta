import {
    ArrowBackRounded,
    ArrowForward,
    CloseRounded,
    DescriptionRounded,
    DoneRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    useTheme,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertContext } from '../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../contexts/BudgetContext'
import { UserContext } from '../../../../contexts/UserContext'
import { baseURL } from '../../../../globals'
import useUtils from '../../../../hooks/useUtils'
import { Budget } from '../../../../types/BudgetTypes'
import Loading from '../../../template/Loading/Loading'
import PageHeader from '../../../template/PageHeader/PageHeader'
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
                budget.consumption.energyBills.length &&
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
    const { showAlert } = useContext(AlertContext)
    const theme = useTheme()
    const [activeStep, setActiveStep] = useState(0)
    const [saving, setSaving] = useState(false)
    const { budget, setBudget } = useContext(BudgetContext)
    const { backendErros } = useUtils()
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const draftAlertShown = useRef(false)
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            axios
                .get(`${baseURL}/doc?path=budgets&id=${id}`)
                .then((response) => setBudget(response.data))
                .catch((error) => {
                    console.error(error)
                    showAlert({
                        message: 'Erro ao carregar orçamento para edição',
                        type: 'error',
                    })
                })
        }
    }, [id, setBudget, showAlert])

    const handleNext = async () => {
        if (validateStep(activeStep, budget)) {
            if (activeStep === steps.length - 1) {
                setSaving(true)
                try {
                    let response
                    if (budget.editing) {
                        response = await axios.put(
                            `${baseURL}/doc?user=${user.id}`,
                            {
                                path: 'budgets',
                                data: budget,
                                id: budget.id,
                            }
                        )
                    } else {
                        response = await axios.post(
                            `${baseURL}/doc?user=${user.id}`,
                            {
                                path: 'budgets',
                                data: budget,
                                id: budget.id || null,
                            }
                        )
                    }

                    if (!response.data)
                        throw {
                            message: `Erro ao ${budget.editing ? 'atualizar' : 'criar'} orçamento`,
                            code: 'UNKNOWN_ERROR',
                        }

                    navigate(`/dashboard/budgets/${response.data.id}`)
                    setSaving(false)
                    showAlert({
                        message: `Orçamento ${budget.editing ? 'atualizado' : 'criado'} com sucesso!`,
                        type: 'success',
                    })
                } catch (error) {
                    setSaving(false)
                    console.error(error)
                    const err: any = error
                    const code =
                        err.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                    const message =
                        backendErros(code) || err.message || 'Erro inesperado'
                    showAlert({ message, type: 'error' })
                }
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1)
            }
        } else {
            showAlert({
                message: 'Por favor, preencha todos os campos obrigatórios (*)',
                type: 'warning',
            })
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    useEffect(() => {
        if (budget.draft && !draftAlertShown.current) {
            showAlert({
                message: 'Você está editando um rascunho',
                type: 'info',
            })
            draftAlertShown.current = true
        }
    }, [budget.draft, showAlert])

    if (saving) return <Loading message='Salvando orçamento...' />

    return (
        <React.Fragment>
            <PageHeader
                icon={<DescriptionRounded />}
                title={budget.editing ? 'Editar Orçamento' : 'Novo Orçamento'}
                path={['dashboard', 'budgets', budget.editing ? 'edit' : 'new']}
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
                    <Box className='text-center'>
                        {budget.draft && (
                            <Typography
                                variant='caption'
                                color={theme.palette.success.main}
                                className='d-flex align-items-center gap-2'
                                onClick={() => {
                                    localStorage.removeItem('budget')
                                    setBudget({} as Budget)
                                    setActiveStep(0)
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '5px',
                                        height: '5px',
                                        background: theme.palette.success.main,
                                        boxShadow: `0px 0px 5px ${theme.palette.success.main}`,
                                        borderRadius: '50%',
                                    }}
                                ></Box>
                                Você está editando um rascunho
                                <IconButton
                                    onClick={() => {
                                        localStorage.removeItem('budget')
                                        setBudget({} as Budget)
                                        setActiveStep(0)
                                    }}
                                    className='p-1'
                                >
                                    <CloseRounded sx={{ fontSize: '12px' }} />
                                </IconButton>
                            </Typography>
                        )}
                        <Typography
                            variant='caption'
                            color={theme.palette.text.secondary}
                        >
                            Campos obrigatórios (*)
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
