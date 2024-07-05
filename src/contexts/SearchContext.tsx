import { ReactNode, createContext, useState } from 'react'

type SearchContextType = {
    search: string
    setSearch: (search: string) => void
}

const SearchContext = createContext<SearchContextType>({
    search: '',
    setSearch: () => {},
})

function SearchProvider({ children }: { children: ReactNode }) {
    const [search, setSearch] = useState('')

    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    )
}

export { SearchContext, SearchProvider }
