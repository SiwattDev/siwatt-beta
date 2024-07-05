import { createContext, useState } from 'react'
import { Budget } from '../types/BudgetTypes'

type BudgetContextType = {
    budget: Budget
    setBudget: React.Dispatch<React.SetStateAction<Budget>>
}

const BudgetContext = createContext<BudgetContextType>({
    budget: {} as Budget,
    setBudget: () => {},
})

function BudgetProvider({ children }: { children: React.ReactNode }) {
    const [budget, setBudget] = useState<Budget>({} as Budget)

    return (
        <BudgetContext.Provider value={{ budget, setBudget }}>
            {children}
        </BudgetContext.Provider>
    )
}

export { BudgetContext, BudgetProvider }
