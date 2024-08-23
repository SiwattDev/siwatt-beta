import axios from 'axios'
import { CompanyInfo } from '../types/CNPJType'
import { Cep } from '../types/CepType'

function useAPI() {
    const APICNPJ = (cnpj: string): Promise<CompanyInfo> => {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://publica.cnpj.ws/cnpj/${cnpj}`)
                .then((resp) => resolve(resp.data))
                .catch((err) => reject(err))
        })
    }

    const APICep = (cep: string): Promise<Cep> => {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://viacep.com.br/ws/${cep}/json/`)
                .then((resp) => resolve(resp.data))
                .catch((err) => reject(err))
        })
    }

    return { APICNPJ, APICep }
}
export default useAPI
