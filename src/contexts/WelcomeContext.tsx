import { ReactNode, createContext, useState } from 'react'
import { Company } from '../types/CompanyTypes'

type Data = {
    user: {
        name: string
        email: string
    }
    company: Company
}

type WelcomeContextType = {
    data: Data
    setData: React.Dispatch<React.SetStateAction<Data>>
}

const WelcomeContext = createContext<WelcomeContextType>({
    data: {} as Data,
    setData: () => {},
})

function WelcomeProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<Data>({} as Data)

    return (
        <WelcomeContext.Provider value={{ data, setData }}>
            {children}
        </WelcomeContext.Provider>
    )
}

export { WelcomeContext, WelcomeProvider }
