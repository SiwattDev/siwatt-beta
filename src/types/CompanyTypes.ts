interface Company {
    name: string
    cnpj: string
    email: string
    phone: string
    logo: string | null
    color: string
    admin: Admin | null
}

interface Admin {
    name: string
    email: string
}

export type { Admin, Company }
