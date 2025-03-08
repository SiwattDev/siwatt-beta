type EntityTypes = 'user' | 'client' | 'supplier' | 'partner'

type Address = {
    road?: string // Depreciated
    street?: string
    number?: number
    city?: string
    uf?: string
    cep?: string
    reference?: string
    neighborhood?: string
}

type DirectContact = {
    birthday: string
    cpf: string
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

type User = Entity &
    Address & {
        user_type:
            | 'business_intermediator'
            | 'ceo'
            | 'commercial_diretor'
            | 'commercial_manager'
            | 'sales_manager'
        password?: string
        unit: string
        company: string
    }

type Seller = Entity & {
    user_type: string // Depreciated
}

type Client = Entity & {
    seller: Seller | string
    direct_contact?: DirectContact // Depreciated
    directContact?: DirectContact
    stateRegistration?: string
    fantasyName?: string
}

type Supplier = Entity & {
    direct_contact?: DirectContact // Depreciated
    directContact?: DirectContact
    stateRegistration?: string
    fantasyName?: string
}

type Partner = Entity

export type {
    Address,
    Client,
    DirectContact,
    Entity,
    EntityTypes,
    Partner,
    Seller,
    Supplier,
    User,
}
