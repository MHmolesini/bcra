export type DebtData = {
    periodo: string
    entidad: string
    monto: number
    situacion: number
  }
  
  export type ApiResponse = {
    status: number
    results: {
      identificacion: number
      denominacion: string
      periodos: Array<{
        periodo: string
        entidades: Array<{
          entidad: string
          situacion: number
          monto: number
          enRevision: boolean
          procesoJud: boolean
        }>
      }>
    }
  }
  
  export type CurrentDebtResponse = {
    status: number
    results: {
      identificacion: number
      denominacion: string
      periodos: Array<{
        periodo: string
        entidades: Array<{
          entidad: string
          situacion: number
          monto: number
        }>
      }>
    }
  }
  
  export type RejectedCheckResponse = {
    status: number
    results: {
      identificacion: number
      denominacion: string
      causales: Array<{
        causal: string
        entidades: Array<{
          entidad: number
          detalle: Array<{
            nroCheque: number
            fechaRechazo: string
            monto: number
            fechaPago: string | null
            fechaPagoMulta: string | null
            estadoMulta: string | null
            ctaPersonal: boolean
            denomJuridica: string | null
            enRevision: boolean
            procesoJud: boolean
          }>
        }>
      }>
    }
  }
  
  export type RejectedCheck = {
    causal: string
    entidad: number
    nroCheque: number
    fechaRechazo: string
    monto: number
    fechaPago: string
    fechaPagoMulta: string
    estadoMulta: string
    ctaPersonal: string
    denomJuridica: string
    enRevision: string
    procesoJud: string
  }