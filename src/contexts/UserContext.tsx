import { ReactNode, createContext, useState } from 'react'
import { User } from '../types/EntityTypes'

type UserContextType = {
    user: User
    setUser: React.Dispatch<React.SetStateAction<User>>
}

const UserContext = createContext<UserContextType>({
    user: {} as User,
    setUser: () => {},
})

function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>({} as User)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
