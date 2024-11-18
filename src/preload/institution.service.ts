import axios from 'axios';
import path from 'path';
import { CONFIG } from './config';

interface Institution {
  id: string;
  fullName: string;
  rut: string;
  name: string;
  areaCode: string;
  isActive: boolean;
  userDni: string | null;
  address: string;
  serviceNumber: string;
  maxUsers: number;
  maxArea: number;
  backups: string;
  migrationIndicator: string;
  corrCreditCapVI: string;
  corrCreditCapXIX: string;
  corrDepositCapXIX: string;
  corrInvestment: string;
  corrCentralBankAccount: string;
  auxCentralBankCode: string;
  tidCentralBank: string;
  sepAlphaFields: string;
  sepBetaLines: string;
  sepGammaFieldEnd: string;
  secFolioATM: string;
  tandemCode: string;
  virtualTid: string;
  tandemConnectivityStatus: string;
  families: any[];
}

export class InstitutionService {
  institutions: Map<string, string> = new Map();

  constructor() {
    this.getInstitutions();
  }

  async getInstitutions(): Promise<any> {
    try {
      const response = await axios(`${CONFIG.ADMIN_BACK}/api/institution`, {
        method: 'GET',
        headers: CONFIG.HEADERS,
      });
      debugger;
      const institution: Institution[] = response.data;
      institution.forEach((institution) => this.institutions.set(institution.id, institution.name));

      return this.institutions;
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  async getInstitutionConnectionDetails(ip: string, area: number) {
    console.log(ip, area);
    const response = await axios.get(`${CONFIG.ADMIN_BACK}/api/area?id=${area}`, {
      headers: CONFIG.HEADERS,
    });

    const areaDetails = response.data[0];
    debugger;
    return {
      pamsFolderPath: path.join(areaDetails.pathPams),
      tamsFolderPath: path.join(areaDetails.distributionPath),
      // outputFolder: path.join(pathSams),
    };
  }
}
