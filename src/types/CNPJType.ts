type Size = {
    id: string
    descricao: string
}

type LegalNature = {
    id: string
    descricao: string
}

type Qualification = {
    id: number
    descricao: string
}

type Partner = {
    cpf_cnpj_socio: string
    nome: string
    tipo: string
    data_entrada: string
    cpf_representante_legal: string
    nome_representante: string | null
    faixa_etaria: string
    atualizado_em: string
    pais_id: string
    qualificacao_socio: Qualification
    qualificacao_representante: Qualification | null
}

type SecondaryActivity = {
    id: string
    secao: string
    divisao: string
    grupo: string
    classe: string
    subclasse: string
    descricao: string
}

type MainActivity = {
    id: string
    secao: string
    divisao: string
    grupo: string
    classe: string
    subclasse: string
    descricao: string
}

type Country = {
    id: string
    iso2: string
    iso3: string
    nome: string
    comex_id: string
}

type State = {
    id: number
    nome: string
    sigla: string
    ibge_id: number
}

type City = {
    id: number
    nome: string
    ibge_id: number
    siafi_id: string
}

type StateRegistration = {
    inscricao_estadual: string
    ativo: boolean
    atualizado_em: string
    estado: State
}

type Establishment = {
    cnpj: string
    atividades_secundarias: SecondaryActivity[]
    cnpj_raiz: string
    cnpj_ordem: string
    cnpj_digito_verificador: string
    tipo: string
    nome_fantasia: string | null
    situacao_cadastral: string
    data_situacao_cadastral: string
    data_inicio_atividade: string
    nome_cidade_exterior: string | null
    tipo_logradouro: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cep: string
    ddd1: string
    telefone1: string
    ddd2: string | null
    telefone2: string | null
    ddd_fax: string | null
    fax: string | null
    email: string
    situacao_especial: string | null
    data_situacao_especial: string | null
    atividade_principal: MainActivity
    pais: Country
    estado: State
    cidade: City
    motivo_situacao_cadastral: string | null
    inscricoes_estaduais: StateRegistration[]
}

type CompanyInfo = {
    cnpj_raiz: string
    razao_social: string
    capital_social: string
    responsavel_federativo: string
    atualizado_em: string
    porte: Size
    natureza_juridica: LegalNature
    qualificacao_do_responsavel: Qualification
    socios: Partner[]
    simples: string | null
    estabelecimento: Establishment
}

type CnpjData = {
    type: string | null
    address: {
        cep: string | null
        locality: string | null
        street: string | null
        uf: string | null
    }
    email: string | null
}

export type { CnpjData, CompanyInfo }
