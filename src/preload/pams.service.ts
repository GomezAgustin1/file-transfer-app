interface HeaderInterface {
  org: string
  nms: string
  idu: string
  fgb: string
  hgb: string
  msg: string
  pri: string
  tid: string
  nse: string
  fen: string
  hen: string
}

export class Pams {
  header: HeaderInterface = {} as HeaderInterface
  messages: string = ''
  to: string = '' // Institucion destino
  area: string | null = null
  event = 'pam'
  hour: string
  date: string
  filename: string | null = null
  institution: string | undefined
  description: string | null = null

  constructor(
    public content: string,
    filename: string,
    includeArea = true,
    institutions: Map<string, string>,
  ) {
    // this.messages = messages
    this.saveHeader(content)
    this.saveMessages(content)
    includeArea && this.saveArea(filename)

    this.to = this.header.tid.substring(0, 4)
    this.date = this.header.fgb
    this.hour = this.header.hgb.substring(0, 5)
    this.filename = filename
    this.institution = institutions.get(this.header.tid)
  }

  private saveMessages(content: string) {
    this.messages = content.replace(/(ORG|NMS|IDU|FGB|HGB|MSG|PRI|TID|NSE|FEN|HEN):([^:\n]+)\n/g, '')
  }

  private saveHeader(content: string) {
    const headerRegex = /(ORG|NMS|IDU|FGB|HGB|MSG|PRI|TID|NSE|FEN|HEN):([^\n]+)/g
    let match
    while ((match = headerRegex.exec(content)) !== null) {
      const [, key, value] = match
      switch (key) {
        case 'MSG':
          this.header.msg = value.trim().substring(0, 3)
          break
        case 'TID':
          this.header.tid = value.trim().substring(0, 4)
          break
        default:
          this.header[key.toLowerCase()] = value.trim()
          break
      }
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
