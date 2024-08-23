import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AutoComplete from './AutoComplete'

export default function SearchModal({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(true)
        return () => setShow(false)
    }, [])

    const backdropStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: '15',
    }

    const modalStyle = {
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: show ? 'translate(-50%, -0%)' : 'translate(-50%, -10%)',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: '16',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <React.Fragment>
            <Box
                sx={backdropStyle}
                onClick={() => {
                    setShow(false)
                    setTimeout(() => setOpen(false), 300)
                }}
            />
            <Box sx={modalStyle}>
                <AutoComplete setOpen={setOpen} />
            </Box>
        </React.Fragment>
    )
}
