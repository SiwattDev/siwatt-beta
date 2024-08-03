import axios from 'axios'
import { isCNPJ } from 'brazilian-values'
import { useContext } from 'react'
import { AlertContext } from '../contexts/AlertContext'
import { BudgetContext } from '../contexts/BudgetContext'
import { baseURL } from '../globals'
import { Consumption } from '../types/BudgetTypes'
import { CnpjData } from '../types/CNPJType'
import useAPI from './useAPI'

type Month =
    | 'JAN'
    | 'FEV'
    | 'MAR'
    | 'ABR'
    | 'MAI'
    | 'JUN'
    | 'JUL'
    | 'AGO'
    | 'SET'
    | 'OUT'
    | 'NOV'
    | 'DEZ'

type GetNeededPowerProps = {
    averageConsumption: number
    networkType: 'single-phase' | 'two-phase' | 'three-phase'
    solarIrradiation: number
}

type SolarIrradiation = number[]

export default () => {
    const { showAlert } = useContext(AlertContext)
    const { APICNPJ, APICep } = useAPI()
    const { budget } = useContext(BudgetContext)

    const extractNumbers = (inputString: string) => {
        let numberString = inputString.replace(/\D/g, '')
        let number = Number(numberString)
        return number
    }

    const getNumberString = (inputString: string) => {
        let numberString = inputString.replace(/\D/g, '')
        return numberString
    }

    const backendErros = (code: string) => {
        switch (code) {
            case 'MISSING_PARAMS':
                return 'Parâmetros ausentes'
            case 'DOCUMENT_NOT_FOUND':
                return 'Documento não encontrado'
            case 'DOCUMENT_DELETED':
                return 'Documento excluído'
            case 'ERROR_GETTING_DOCUMENT':
                return 'Erro ao buscar documento'
            case 'DOCUMENTS_NOT_FOUND':
                return 'Documentos não encontrados'
            case 'ERROR_GETTING_DOCUMENTS':
                return 'Erro ao buscar documentos'
            case 'ERROR_ADDING_DOCUMENT':
                return 'Erro ao adicionar documento'
            case 'ERROR_UPDATING_DOCUMENT':
                return 'Erro ao atualizar documento'
            case 'ERROR_DELETING_DOCUMENT':
                return 'Erro ao excluir documento'
            case 'ERROR_CREATING_USER':
                return 'Erro ao criar usuário'
            case 'ERROR_CREATING_USER_DATA':
                return 'Erro ao criar dados do usuário'
            case 'ERROR_SENDING_EMAIL':
                return 'Erro ao enviar email'
            case 'ERROR_DELETING_USER':
                return 'Erro ao excluir usuário'
            case 'NO_PERMISSION':
                return 'Sem permissão'
            case 'USER_NOT_FOUND':
                return 'Usuário não encontrado'
            case 'INTERNAL_ERROR':
                return 'Erro interno'
            case 'ERROR_LOGGING_ACTION':
                return 'Erro ao salvar log da ação'
            case 'MISSING_USER':
                return 'Usuário ausente'
            case 'INVALID_USER_TYPE':
                return 'Tipo de usuário inválido'
            case 'ERROR_RENDERING_EJS_TEMPLATE':
                return 'Erro ao renderizar template EJS'
            case 'PASSWORD_TOO_SHORT':
                return 'Senha muito curta'
            case 'NOT_FOUND':
                return 'Nada encontrado'
            case 'ERROR_UPLOADING_FILE':
                return 'Erro ao carregar arquivo'
            case 'ERROR_GETTING_FUNNEL_DATA':
                return 'Erro ao buscar dados do funil'
            case 'NO_SUITABLE_KITS':
                return 'Nenhum kit disponível'
            case 'INVALID_PARAMS':
                return 'Parâmetros inválidos'
            default:
                return 'Erro inesperado'
        }
    }

    const getCnpjData = async (cnpj: string): Promise<CnpjData | null> => {
        if (!isCNPJ(cnpj)) {
            showAlert({
                message: 'CNPJ inválido',
                type: 'error',
            })
            return null
        }

        try {
            const data = await APICNPJ(cnpj)
            if (data?.estabelecimento?.cnpj) {
                const newCnpjData: CnpjData = {
                    type: data.estabelecimento.tipo || null,
                    address: {
                        cep: data.estabelecimento.cep || null,
                        locality: null,
                        street: null,
                        uf: null,
                    },
                    email: data.estabelecimento.email || null,
                }

                if (data.estabelecimento.cep) {
                    try {
                        const cepData = await APICep(data.estabelecimento.cep)
                        newCnpjData.address.locality =
                            cepData.localidade || null
                        newCnpjData.address.street = cepData.logradouro || null
                        newCnpjData.address.uf = cepData.uf || null
                    } catch {
                        showAlert({
                            message: 'Erro ao buscar dados do CEP',
                            type: 'error',
                        })
                        newCnpjData.address.locality = null
                        newCnpjData.address.street = null
                        newCnpjData.address.uf = null
                    }
                }
                return newCnpjData
            } else {
                showAlert({
                    message: 'CNPJ não encontrado',
                    type: 'error',
                })
                return null
            }
        } catch {
            showAlert({
                message: 'Erro ao buscar dados do CNPJ',
                type: 'error',
            })
            return null
        }
    }

    const calculateAverageEnergyBill = (consumption: Consumption): number => {
        let monthlyTotal: Record<Month, number> = {
            JAN: 0,
            FEV: 0,
            MAR: 0,
            ABR: 0,
            MAI: 0,
            JUN: 0,
            JUL: 0,
            AGO: 0,
            SET: 0,
            OUT: 0,
            NOV: 0,
            DEZ: 0,
        }

        if (!consumption?.energyBills || consumption?.energyBills?.length === 0)
            return 0

        consumption.energyBills.forEach((bill) => {
            Object.entries(bill.months).forEach(([month, value]) => {
                if (monthlyTotal.hasOwnProperty(month as Month)) {
                    monthlyTotal[month as Month] += Number(value)
                }
            })
        })

        let totalConsumption = Object.values(monthlyTotal).reduce(
            (total, value) => total + value,
            0
        )
        let totalMonths = Object.keys(monthlyTotal).length as number

        return totalConsumption / totalMonths
    }

    const getNeededPower = ({
        averageConsumption = 0,
        networkType = 'single-phase',
        solarIrradiation = 0,
    }: GetNeededPowerProps) => {
        const networkTypeValues = {
            'single-phase': 30,
            'two-phase': 50,
            'three-phase': 100,
        }

        if (!averageConsumption || !networkType || !solarIrradiation) return 0

        const networkTypeValue = networkTypeValues[networkType]
        const average = solarIrradiation
        const result =
            (averageConsumption - networkTypeValue) / 30 / (average * 0.75)

        return result
    }

    const getSolarIrradiation = async (): Promise<SolarIrradiation> => {
        if (!budget?.solarPlantSite?.city) return []

        const response = await axios.get(`${baseURL}/solar-irradiation`, {
            params: { cityName: budget.solarPlantSite.city },
        })

        if (response.status !== 200)
            throw { message: 'Erro ao buscar irradiação solar' }

        return response.data.solarIrradiation
    }

    const calculatePlantPrice = (kitPrice: number): number => {
        const taxPercentages = [
            0.1, 0.1, 0.05, 0.05, 0.05, 0.01, 0.1, 0.08, 0.01,
        ]
        const fixedTax = 250
        const percentage = 0.2
        const rate1 = 0.067
        const rate2 = 0.155
        const finalRate = 0.0219

        const totalTax = taxPercentages.reduce(
            (acc, tax) => acc + tax * kitPrice,
            fixedTax
        )
        const baseValueWithTax = kitPrice + totalTax
        const additionalCost1 = baseValueWithTax * percentage
        const additionalCost2 = baseValueWithTax * percentage
        const additionalCost3 =
            rate1 * (baseValueWithTax + additionalCost1 + additionalCost2)
        const additionalCost4 = rate2 * additionalCost2

        const totalCost =
            kitPrice +
            totalTax +
            additionalCost1 +
            additionalCost2 +
            additionalCost3 +
            additionalCost4
        const finalValue = totalCost + finalRate * totalCost

        return finalValue
    }

    return {
        extractNumbers,
        getNumberString,
        backendErros,
        getCnpjData,
        calculateAverageEnergyBill,
        getNeededPower,
        getSolarIrradiation,
        calculatePlantPrice,
    }
}
