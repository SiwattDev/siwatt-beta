import { useState } from 'react'

export interface ConfirmOptions {
    title: string
    message: string
    onConfirm?: () => void
    onCancel?: () => void
}

export function useConfirm() {
    const [confirmState, setConfirmState] = useState<ConfirmOptions>({
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {},
    })

    const showConfirm = ({
        title,
        message,
        onConfirm = () => {},
        onCancel = () => {},
    }: ConfirmOptions) => {
        setConfirmState({
            title,
            message,
            onConfirm: () => {
                setConfirmState({ ...confirmState, title: '', message: '' })
                onConfirm()
            },
            onCancel: () => {
                setConfirmState({ ...confirmState, title: '', message: '' })
                onCancel()
            },
        })
    }

    return { showConfirm, confirmState }
}
