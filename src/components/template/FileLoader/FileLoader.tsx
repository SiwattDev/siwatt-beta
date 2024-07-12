import { CloudUploadRounded } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useRef, useState } from 'react'

type FileLoaderProps = {
    acceptedTypes: string[]
    maxQuantity: number
    sx?: object
    onFilesChanged: (files: File[]) => void
}

type SelectedFile = File

export default function FileLoader({
    acceptedTypes,
    maxQuantity,
    sx,
    onFilesChanged,
}: FileLoaderProps) {
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setSelectedFile(file)
        if (file) {
            onFilesChanged([file])
        } else {
            onFilesChanged([])
        }
    }

    return (
        <Box
            className='border rounded px-3 py-2'
            sx={{
                ...sx,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Typography
                variant='h6'
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    textAlign: 'center',
                    lineHeight: 1.5,
                }}
            >
                {selectedFile
                    ? selectedFile.name
                    : 'Nenhum arquivo selecionado'}
            </Typography>
            <input
                ref={inputRef}
                hidden
                type='file'
                accept={acceptedTypes.join(',')}
                onChange={handleFileChange}
                multiple={maxQuantity > 1}
            />
            {selectedFile ? (
                <Box
                    sx={{
                        width: '100%',
                        height: 'calc(100% - 30px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt='Imagem'
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                        }}
                        onClick={() => inputRef.current?.click()}
                    />
                </Box>
            ) : (
                <Box
                    className='border rounded p-2 px-3 d-flex flex-column align-items-center justify-content-center'
                    onClick={() => inputRef.current?.click()}
                    sx={{
                        cursor: 'pointer',
                        width: '100%',
                        height: 'calc(100% - 48px)',
                    }}
                >
                    <CloudUploadRounded sx={{ fontSize: 50 }} />
                    <Typography variant='h6'>Selecionar arquivo</Typography>
                </Box>
            )}
        </Box>
    )
}
