export default () => {
    const extractNumbers = (inputString: string) => {
        let numberString = inputString.replace(/\D/g, '')
        let number = Number(numberString)
        return number
    }

    const getNumberString = (inputString: string) => {
        let numberString = inputString.replace(/\D/g, '')
        return numberString
    }

    const backendErros = (code: string) => {
        switch (code) {
            case 'MISSING_PARAMS':
                return 'Parâmetros ausentes'
            case 'DOCUMENT_NOT_FOUND':
                return 'Documento não encontrado'
            case 'DOCUMENT_DELETED':
                return 'Documento excluído'
            case 'ERROR_GETTING_DOCUMENT':
                return 'Erro ao buscar documento'
            case 'DOCUMENTS_NOT_FOUND':
                return 'Documentos não encontrados'
            case 'ERROR_GETTING_DOCUMENTS':
                return 'Erro ao buscar documentos'
            case 'ERROR_ADDING_DOCUMENT':
                return 'Erro ao adicionar documento'
            case 'ERROR_UPDATING_DOCUMENT':
                return 'Erro ao atualizar documento'
            case 'ERROR_DELETING_DOCUMENT':
                return 'Erro ao excluir documento'
            case 'ERROR_CREATING_USER':
                return 'Erro ao criar usuário'
            case 'ERROR_CREATING_USER_DATA':
                return 'Erro ao criar dados do usuário'
            case 'ERROR_SENDING_EMAIL':
                return 'Erro ao enviar email'
            case 'ERROR_DELETING_USER':
                return 'Erro ao excluir usuário'
            case 'NO_PERMISSION':
                return 'Sem permissão'
            case 'USER_NOT_FOUND':
                return 'Usuário não encontrado'
            case 'INTERNAL_ERROR':
                return 'Erro interno'
            case 'ERROR_LOGGING_ACTION':
                return 'Erro ao salvar log da ação'
            case 'MISSING_USER':
                return 'Usuário ausente'
            case 'INVALID_USER_TYPE':
                return 'Tipo de usuário inválido'
            case 'ERROR_RENDERING_EJS_TEMPLATE':
                return 'Erro ao renderizar template EJS'
            case 'PASSWORD_TOO_SHORT':
                return 'Senha muito curta'
            case 'NOT_FOUND':
                return 'Nada encontrado'
            case 'ERROR_UPLOADING_FILE':
                return 'Erro ao carregar arquivo'
            case 'ERROR_GETTING_FUNNEL_DATA':
                return 'Erro ao buscar dados do funil'
            case 'NO_SUITABLE_KITS':
                return 'Nenhum kit disponível'
            default:
                return 'Erro inesperado'
        }
    }

    return { extractNumbers, getNumberString, backendErros }
}
