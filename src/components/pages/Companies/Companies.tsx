import {
    AdminPanelSettingsRounded,
    BusinessRounded,
    HelpRounded,
    SaveRounded,
} from '@mui/icons-material'
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Admin, Company } from '../../../types/CompanyTypes'
import FileLoader from '../../template/FileLoader/FileLoader'
import PageHeader from '../../template/PageHeader/PageHeader'

export default function Companies() {
    const theme = useTheme()
    const [companyData, setCompanyData] = useState<Company>({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        logo: null,
        color: theme.palette.primary.main,
        admin: null,
    })
    const [file, setFile] = useState<File | null>()
    const [openDialog, setOpenDialog] = useState(false)
    const [adminData, setAdminData] = useState<Admin>({
        name: '',
        email: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCompanyData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (files: File[]) => {
        setFile(files.length > 0 ? files[0] : null)
    }

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyData((prev) => ({ ...prev, color: e.target.value }))
    }

    const handleAddAdmin = () => {
        setCompanyData((prev) => ({ ...prev, admin: adminData }))
        setOpenDialog(false)
        setAdminData({ name: '', email: '' })
    }

    const handleSaveCompany = () => {
        console.log(companyData)
    }

    useEffect(() => {
        console.log(file)
    }, [file])

    return (
        <React.Fragment>
            <PageHeader
                title='Cadastro de empresas'
                icon={<BusinessRounded />}
                path={['dashboard', 'companies']}
            />
            <Card>
                <CardContent>
                    <Typography variant='h5' className='mb-3'>
                        Cadastrar nova empresa
                    </Typography>
                    <TextField
                        label='Nome'
                        name='name'
                        placeholder='Nome da empresa'
                        size='small'
                        fullWidth
                        className='mb-3'
                        value={companyData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label='CNPJ'
                        name='cnpj'
                        placeholder='CNPJ da empresa'
                        size='small'
                        fullWidth
                        className='mb-3'
                        value={companyData.cnpj}
                        onChange={handleChange}
                    />
                    <TextField
                        label='E-mail'
                        name='email'
                        placeholder='E-mail da empresa'
                        size='small'
                        fullWidth
                        className='mb-3'
                        type='email'
                        value={companyData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        label='Telefone'
                        name='phone'
                        placeholder='Telefone da empresa'
                        size='small'
                        fullWidth
                        className='mb-3'
                        type='tel'
                        value={companyData.phone}
                        onChange={handleChange}
                    />
                    <Typography>Logo da empresa:</Typography>
                    <FileLoader
                        acceptedTypes={['png', 'jpg', 'jpeg', 'webp']}
                        maxQuantity={1}
                        onFilesChanged={handleFileChange}
                    />
                    <Box className='d-flex align-items-center gap-2 mt-3 mb-3'>
                        <Typography>Cor base:</Typography>
                        <input
                            type='color'
                            value={companyData.color}
                            onChange={handleColorChange}
                            style={{
                                border: 'none',
                                padding: '0px',
                                width: '25px',
                                height: '25px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                            }}
                        />
                    </Box>
                    <Typography>
                        Usuário Admin:{' '}
                        <Tooltip title='Usuário admin da empresa que está sendo adicionada'>
                            <HelpRounded sx={{ fontSize: 14 }} />
                        </Tooltip>
                    </Typography>
                    {companyData.admin ? (
                        <Typography className='mb-3'>
                            {companyData.admin.name} - {companyData.admin.email}
                        </Typography>
                    ) : (
                        <Button
                            variant='outlined'
                            color='inherit'
                            startIcon={<AdminPanelSettingsRounded />}
                            size='small'
                            onClick={() => setOpenDialog(true)}
                        >
                            Adicionar
                        </Button>
                    )}
                    <Button
                        startIcon={<SaveRounded />}
                        variant='contained'
                        size='small'
                        fullWidth
                        className='mt-3'
                        onClick={handleSaveCompany}
                    >
                        Salvar empresa
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Adicionar Usuário Admin</DialogTitle>
                <DialogContent>
                    <TextField
                        label='Nome'
                        name='name'
                        placeholder='Nome do usuário'
                        size='small'
                        fullWidth
                        className='mb-3'
                        value={adminData.name}
                        onChange={(e) =>
                            setAdminData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />
                    <TextField
                        label='E-mail'
                        name='email'
                        placeholder='E-mail do usuário'
                        size='small'
                        fullWidth
                        type='email'
                        value={adminData.email}
                        onChange={(e) =>
                            setAdminData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        color='inherit'
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleAddAdmin} variant='contained'>
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
