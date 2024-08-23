import { Client, Seller } from './EntityTypes'

type Product = {
    type?: 'module' | 'inverter'
    id: string
    model: string
    unitPrice: number
    price?: string // depreciated
    amount?: number // depreciated
    quantity?: number
    totalPrice: number
    power: number
}

type Kit = {
    id: string
    modules: Product
    inverter: Product
}

type EnergyBill = {
    id: string
    months: {
        [key: string]: number
    }
    photoEnergyBill: string
    photoConsumptionGraph: string
}

type Consumption = {
    energyBills: EnergyBill[]
    energyBillForInstallation: string
    roofType: 'metal' | 'ceramic' | 'concrete' | 'ground-mounted'
    networkType: 'single-phase' | 'two-phase' | 'three-phase'
}

type SolarPlantSite = {
    uf: string
    city: string
}

type Budget = {
    id: number
    client: Client | string
    uf?: string // depreciated
    cityName?: string // depreciated
    solarPlantSite: SolarPlantSite
    consumption: Consumption
    kit: Kit
    validity: string
    peakGeneration: number
    seller: Seller | string
    status: string
    draft?: boolean
    editing?: boolean
    plantValue: number
    createdAt: string
    updatedAt?: string
}

type BudgetWithClientData = Budget & { client: Client; seller: Seller }

type BudgetResult = {
    cityName: string
    latitude: number
    longitude: number
    idealInclination: number
    correctionFactor: number
    peakGeneration: number
    solarIrradiationData: number[]
    averageSolarIrradiation: number
    energyGeneration: number[]
    averageEnergyGeneration: number
    averageConsumption: number
    panelQuantity: number
    areaNeeded: number
    neededPower: number
    plantValue: number
    creditCardInstallments: number[]
    bankFinancingInstallments: number[]
    investmentReturnPayback: {
        monthlySavings: number
        returnIn25Years: number[]
        paybackInYears: number
        remainingMonths: number
    }
    tariffReadjustment: number[]
    investmentReturn: number[]
}

export type {
    Budget,
    BudgetResult,
    BudgetWithClientData,
    Consumption,
    EnergyBill,
    Kit,
    Product,
}
