import { CloudUploadRounded } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

type FileLoaderProps = {
    acceptedTypes: string[]
    maxQuantity: number
    sx?: object
    onFilesChanged: (files: File[]) => void
    initialFiles?: { name: string; url: string }[]
}

type SelectedFile = File | { name: string; url: string }

export default function FileLoader({
    acceptedTypes,
    maxQuantity,
    sx,
    onFilesChanged,
    initialFiles = [],
}: FileLoaderProps) {
    const [selectedFiles, setSelectedFiles] =
        useState<SelectedFile[]>(initialFiles)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (initialFiles.length > 0) {
            setSelectedFiles(initialFiles)
        }
    }, [initialFiles])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        setSelectedFiles(files)
        onFilesChanged(files)
    }

    const handleClick = () => {
        inputRef.current?.click()
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
                {selectedFiles.length > 0
                    ? selectedFiles
                          .map((file) =>
                              file instanceof File ? file.name : file.url
                          )
                          .join(', ')
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
            {selectedFiles.length > 0 ? (
                <Box
                    sx={{
                        width: '100%',
                        height: 'calc(100% - 30px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {selectedFiles.map((file) =>
                        file instanceof File ? (
                            <img
                                key={file.name}
                                src={URL.createObjectURL(file)}
                                alt='Imagem'
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                }}
                                onClick={handleClick}
                            />
                        ) : (
                            <img
                                key={file.name}
                                src={file.url}
                                alt='Imagem'
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                }}
                                onClick={handleClick}
                            />
                        )
                    )}
                </Box>
            ) : (
                <Box
                    className='border rounded p-2 px-3 d-flex flex-column align-items-center justify-content-center'
                    onClick={handleClick}
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
