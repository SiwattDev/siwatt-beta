type Address = {
    road?: string
    number?: number
    city?: string
    uf?: string
    cep?: number
    reference?: string
    neighborhood?: string
}

type DirectContact = {
    birthday: string
    cpf: number
    email: string
    name: string
    phone: number
}

type Entity = {
    id: string
    name: string
    email: string
    phone: string
    cpf?: string
    cnpj?: string
    address: Address
}

type User = Entity & Address

type Seller = Entity & {
    user_type?: string // Depreciated
    type: string
}

type Client = Entity & {
    seller: Seller
    direct_contact?: DirectContact // Depreciated
    directContact?: DirectContact
}

export type { Client, Entity, Seller, User }
