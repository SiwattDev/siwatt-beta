import { Client, Seller } from './EntityTypes'

type Kit = {
    modules: {
        id: string
        model: string
        unitPrice: number
        amount?: number // depreciated
        quantity?: number
        totalPrice: number
        power: number
    }
    inverter: {
        id: string
        model: string
        unitPrice: number
        amount?: number // depreciated
        quantity?: number
        totalPrice: number
        maxPower: number
    }
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

type Budget = {
    id: number
    client: Client | string
    uf?: string
    cityName: string
    consumption: Consumption
    kit: Kit
    validity: string
    peakGeneration: number
    seller: Seller | string
    status: string
}

export type { Budget, Consumption, EnergyBill, Kit }
