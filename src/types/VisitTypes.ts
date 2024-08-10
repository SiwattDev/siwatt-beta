type ClientData = {
    cnpj?: string
    cpf?: string
    fantasyName?: string
    name: string
    phone: string
}

type LocationData = {
    latitude: number
    longitude: number
}

type EnergyBill = {
    energyBill: string
    energyBillGraph: string
}

type Visit = {
    id: string
    clientData: ClientData
    comment: string
    date: number
    locationData: LocationData
    visitImages: string[]
    energyBills?: EnergyBill[]
    user: string
}

export type { Visit }
