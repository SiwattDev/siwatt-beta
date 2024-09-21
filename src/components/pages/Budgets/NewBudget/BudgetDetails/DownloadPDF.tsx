import { DownloadRounded } from '@mui/icons-material'
import { Button } from '@mui/material'
import axios from 'axios'
import React, { useContext } from 'react'
import { UserContext } from '../../../../../contexts/UserContext'
import { baseURL } from '../../../../../globals'
import {
    BudgetResult,
    BudgetWithClientData,
} from '../../../../../types/BudgetTypes'
import LoadingButton from '../../../../template/LoadingButton/LoadingButton'

export default function DownloadPDF({
    budget,
    result,
}: {
    budget: BudgetWithClientData
    result: BudgetResult
}) {
    const [downloading, setDownloading] = React.useState(false)
    const { user } = useContext(UserContext)

    const downloadPDF = async () => {
        setDownloading(true)
        try {
            const response = await axios({
                url: `${baseURL}/generate-budget`,
                params: {
                    user: user.id,
                },
                method: 'POST',
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    ...budget,
                    ...result,
                }),
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Orç. ${budget.client.name}.pdf`)
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
            setDownloading(false)
        } catch (error) {
            setDownloading(false)
            console.error('Erro:', error)
        }
    }

    return (
        <React.Fragment>
            {downloading ? (
                <LoadingButton
                    variant='contained'
                    color='primary'
                    className='mt-3'
                    loading={true}
                >
                    Baixando PDF...
                </LoadingButton>
            ) : (
                <Button
                    variant='contained'
                    onClick={downloadPDF}
                    color='primary'
                    className='mt-3'
                    startIcon={<DownloadRounded />}
                >
                    Baixar PDF
                </Button>
            )}
        </React.Fragment>
    )
}
