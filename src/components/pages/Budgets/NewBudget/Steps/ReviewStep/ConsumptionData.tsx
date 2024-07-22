import React from 'react'
import EnergyBillTable from '../ConsumptionStep/EnergyBillTable'

export default function ConsumptionData() {
    return (
        <React.Fragment>
            <EnergyBillTable viewOnly={true} />
        </React.Fragment>
    )
}
