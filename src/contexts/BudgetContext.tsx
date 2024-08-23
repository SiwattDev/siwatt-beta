import { createContext, useEffect, useState } from 'react'
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
    const [budget, setBudget] = useState<Budget>(() => {
        const savedBudget = localStorage.getItem('budget')
        if (savedBudget) {
            const parsedBudget = JSON.parse(savedBudget)
            // Verificar se o orçamento salvo não é vazio
            if (Object.keys(parsedBudget).length > 0) {
                return { ...parsedBudget, draft: true }
            }
        }
        return {} as Budget // Inicializa com orçamento vazio
    })

    useEffect(() => {
        if (Object.keys(budget).length > 0) {
            localStorage.setItem('budget', JSON.stringify(budget))
        } else {
            localStorage.removeItem('budget')
        }
    }, [budget])

    const updateBudget: React.Dispatch<React.SetStateAction<Budget>> = (
        newBudget
    ) => {
        setBudget((prevBudget) => {
            const updatedBudget =
                typeof newBudget === 'function'
                    ? newBudget(prevBudget)
                    : newBudget

            if (Object.keys(updatedBudget).length === 0) return {} as Budget
            else {
                const { draft, ...cleanBudget } = updatedBudget
                return cleanBudget
            }
        })
    }

    return (
        <BudgetContext.Provider value={{ budget, setBudget: updateBudget }}>
            {children}
        </BudgetContext.Provider>
    )
}

export { BudgetContext, BudgetProvider }
