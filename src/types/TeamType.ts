import { Seller, User } from './EntityTypes'
import { Unit } from './UnitType'

type Team = {
    id: number
    manager: string | User
    name: string
    sellers: string[] | Seller[]
    unit: string | Unit
}

export type { Team }
