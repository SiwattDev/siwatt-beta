import {
    UserCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'

type User = {
    email: string
    password: string
}

export default () => {
    const loginErros = [
        { code: 'auth/invalid-email', message: 'Email inválido' },
        { code: 'auth/user-disabled', message: 'Conta desativada' },
        { code: 'auth/user-not-found', message: 'Email não encontrado' },
        { code: 'auth/wrong-password', message: 'Senha inválida' },
        { code: 'auth/too-many-requests', message: 'Muitas tentativas' },
        { code: 'auth/network-request-failed', message: 'Falha de rede' },
        {
            code: 'auth/invalid-password',
            message: 'A senha precisa ter pelo menos seis caracteres',
        },
        {
            code: 'auth/email-already-exists',
            message: 'O e-mail fornecido já está em uso por outro usuário',
        },
        {
            code: 'auth/operation-not-allowed',
            message: 'Método de login desativado',
        },
        { code: 'auth/internal-error', message: 'Erro interno do servidor' },
        { code: 'auth/invalid-credential', message: 'Credencial inválida' },
        {
            code: 'auth/invalid-argument',
            message: 'Argumento inválido fornecido',
        },
        {
            code: 'auth/user-token-expired',
            message: 'Token do usuário expirado',
        },
        {
            code: 'auth/user-token-revoked',
            message: 'Token do usuário revogado',
        },
        {
            code: 'auth/unauthorized-continue-uri',
            message: 'URL de continuação não autorizada',
        },
        { code: 'auth/invalid-uid', message: 'UID inválido' },
    ]

    const login = async ({
        email,
        password,
    }: User): Promise<UserCredential & { token: string }> => {
        try {
            const loginResponse = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            const token = await loginResponse.user.getIdToken()

            return { ...loginResponse, token }
        } catch (error: any) {
            error.message = loginErros.find(
                (loginError) => loginError.code === error.code
            )?.message
            return Promise.reject(error)
        }
    }

    const logout = async (): Promise<void> => await auth.signOut()

    const resetPassword = async (email: string): Promise<void> =>
        await sendPasswordResetEmail(auth, email)

    return { login, logout, resetPassword }
}
