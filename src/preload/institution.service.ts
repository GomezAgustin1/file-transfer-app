import axios from 'axios'
import path from 'path'

interface Institution {
  id: string
  fullName: string
  rut: string
  name: string
  areaCode: string
  isActive: boolean
  userDni: string | null
  address: string
  serviceNumber: string
  maxUsers: number
  maxArea: number
  backups: string
  migrationIndicator: string
  corrCreditCapVI: string
  corrCreditCapXIX: string
  corrDepositCapXIX: string
  corrInvestment: string
  corrCentralBankAccount: string
  auxCentralBankCode: string
  tidCentralBank: string
  sepAlphaFields: string
  sepBetaLines: string
  sepGammaFieldEnd: string
  secFolioATM: string
  tandemCode: string
  virtualTid: string
  tandemConnectivityStatus: string
  families: any[]
}

export class InstitutionService {
  institutions: Map<string, string> = new Map()

  constructor() {
    this.getInstitutions()
  }

  async getInstitutions(): Promise<any> {
    try {
      const response = await axios('http://100.66.52.20:3000/api/institution', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer 2csFtx3bvfg2sfVWzXGsLldzwGZEl7NkRTYkwk15Xs623JG5MznLKcywFoSrpKKn',
        },
      })
      const institution: Institution[] = response.data
      institution.forEach((institution) => this.institutions.set(institution.id, institution.name))

      return this.institutions
    } catch (error) {
      console.error('Error: ', error)
    }
  }

  async getInstitutionConnectionDetails(ip: string, area: number) {
    console.log(ip, area)
    return {
      pamsFolderPath: path.join(process.cwd(), 'pams-files'),
      tamsFolderPath: path.join(process.cwd(), 'tams-files'),
      outputFolder: 'src/preload/finished',
    }
  }
}
