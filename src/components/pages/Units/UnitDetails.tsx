import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import { formatToCEP } from 'brazilian-values'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import useUtils from '../../../hooks/useUtils'
import { CnpjData } from '../../../types/CNPJType'
import { Unit } from '../../../types/UnitType'
import Loading from '../../template/Loading/Loading'

export default function UnitDetails({
    open,
    onClose,
    unit,
}: {
    open: boolean
    onClose: () => void
    unit: Unit
}) {
    const [loading, setLoading] = useState(true)
    const [cnpjData, setCnpjData] = useState<CnpjData>({} as CnpjData)
    const { showAlert } = useContext(AlertContext)
    const { getCnpjData } = useUtils()

    useEffect(() => {
        getCnpjData(unit.cnpj).then((cnpjData) => {
            setLoading(false)
            if (!cnpjData) {
                showAlert({
                    message: 'Erro inesperado ao buscar o CNPJ',
                    type: 'error',
                })
                return
            }

            setCnpjData(cnpjData)
        })
    }, [unit])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Detalhes da Unidade - {unit.name}</DialogTitle>
            <DialogContent>
                <Typography>
                    <strong>ID:</strong> {unit.id}
                </Typography>
                <Typography className='mt-2'>
                    <strong>CNPJ:</strong> {unit.cnpj}
                </Typography>
                {loading ? (
                    <Loading message='Carregando dados do CNPJ...' />
                ) : (
                    <React.Fragment>
                        {cnpjData.type && (
                            <Typography className='mt-2'>
                                <strong>Estabelecimento:</strong>{' '}
                                {cnpjData.type}
                            </Typography>
                        )}
                        {cnpjData?.address?.cep && (
                            <Typography className='mt-2'>
                                <strong>Endereço:</strong>{' '}
                                {cnpjData.address.street
                                    ? `${cnpjData.address.street}, ${cnpjData.address.locality}, ${formatToCEP(cnpjData.address.cep)} - ${cnpjData.address.uf}`
                                    : formatToCEP(cnpjData.address.cep)}
                            </Typography>
                        )}
                        {cnpjData.email && (
                            <Typography className='mt-2'>
                                <strong>E-mail:</strong> {cnpjData.email}
                            </Typography>
                        )}
                    </React.Fragment>
                )}
            </DialogContent>
        </Dialog>
    )
}
