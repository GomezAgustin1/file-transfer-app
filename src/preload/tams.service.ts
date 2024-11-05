interface HeaderInterface {
  osn: string
  msg: string // Código del tipo de mensaje
  tid: string //institucion origen
  fhe: string
  fhr: string
  nse: string
}

export class Tams {
  header: HeaderInterface = {} as HeaderInterface
  message: string = ''
  area: string | null = null
  hour: string
  date: string
  filename: string | null = null
  event = 'tam'
  institution: string | undefined | null = null
  description: string | null = null

  constructor(
    public content: string,
    filename: string,
    institutions: Map<string, string>,
  ) {
    this.saveHeader(content)
    this.saveMessages(content)
    this.filename = filename
    this.saveArea(filename)
    this.date = this.header.fhr.slice(0, 8)
    this.hour = this.header.fhr.substring(8, 14)
    this.institution = institutions.get(this.header.tid)
  }

  private saveMessages(content: string) {
    this.message = content.replace(/(OSN|MSG|TID|FHE|FHR|NSE) ([^\n]+)\n/g, '')
  }

  private saveHeader(content: string): void {
    const headers = content.match(/(OSN|MSG|TID|FHE|FHR|NSE) ([^\n]+)/g)
    if (headers) {
      headers.forEach((header) => {
        const [key, ...rest] = header.split(' ', 10)
        const value = rest.join(' ').replace(/\r/g, '')
        switch (key) {
          case 'OSN':
            this.header.osn = value
            break
          case 'MSG':
            this.header.msg = value.substring(0, 3)
            break
          case 'TID':
            this.header.tid = value.substring(0, 4)
            break
          case 'FHE':
            this.header.fhe = value
            break
          case 'FHR':
            this.header.fhr = value
            break
          case 'NSE':
            this.header.nse = value
            break
        }
      })
    } else {
      this.header = {} as HeaderInterface
    }
  }

  private saveArea(filename: string | null | undefined) {
    if (!filename) return
    const dotIndex = filename.indexOf('.')
    if (dotIndex !== -1) {
      this.area = filename.substring(dotIndex + 1, dotIndex + 3)
    }
  }
}
