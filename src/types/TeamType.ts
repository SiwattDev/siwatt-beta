import { Seller } from './EntityTypes'
import { Unit } from './UnitType'

type Team = {
    id: number
    manager: string
    name: string
    sellers: string[] | Seller[]
    unit: string | Unit
}

export type { Team }
