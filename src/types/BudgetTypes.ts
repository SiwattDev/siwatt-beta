import { Client, Seller } from './EntityTypes'

type Product = {
    id: string
    model: string
    unitPrice: number
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
}

export type { Budget, Consumption, EnergyBill, Kit, Product }
