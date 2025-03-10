import { ReactNode, createContext, useState } from 'react'
import { Company } from '../types/CompanyTypes'

type CompanyContextType = {
    company: Company
    setCompany: React.Dispatch<React.SetStateAction<Company>>
}

const CompanyContext = createContext<CompanyContextType>({
    company: {} as Company,
    setCompany: () => {},
})

function CompanyProvider({ children }: { children: ReactNode }) {
    const [company, setCompany] = useState<Company>({} as Company)

    return (
        <CompanyContext.Provider value={{ company, setCompany }}>
            {children}
        </CompanyContext.Provider>
    )
}

export { CompanyContext, CompanyProvider }
