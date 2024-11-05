import axios from 'axios'
import { Pams } from './pams.service'
import { Tams } from './tams.service'

class MessagesService {
  private messages: Array<Pams | Tams>

  constructor(private institutions) {
    this.messages = []
  }

  getMessages() {
    return this.messages
  }

  isPam(content: string): boolean {
    return content.substring(0, 3) === 'ORG'
  }

  isTam(content: string): boolean {
    return content.substring(0, 3) === 'OSN'
  }

  isPamMultipleMessages(content: string): boolean {
    if (!this.isPam(content)) return false
    const count = (content.match(/MSG/g) || []).length
    return count > 1
  }

  addMultiplePamMessages(content: string, filename: string): void {
    const commonHeader = content.match(/(ORG|NMS|IDU|FGB|HGB):([^\n]+)\n/g)?.join('') //This header is common for all the messages in the file
    const messages = content.split('MSG')
    messages.shift() // It is taking the common headers as the first message, so i remove it
    messages.forEach((message) => {
      this.addMessage(`${commonHeader}MSG${message}`, filename, false)
    })
  }

  addMessage(content: string, filename: string, includeArea?: boolean): void {
    if (this.isPam(content)) {
      const pam = new Pams(content, filename, includeArea, this.institutions)
      this.messages.push(pam)
    }
    if (this.isTam(content)) {
      const tam = new Tams(content, filename, this.institutions)
      this.messages.push(tam)
    }
  }

  async populateMessagesDescription() {
    try {
      const promises = this.messages.map((message) => {
        try {
          const response = axios.get(`http://localhost:3002/schema/${message.header.msg}`, {
            headers: {
              Authorization: 'Bearer 2csFtx3bvfg2sfVWzXGsLldzwGZEl7NkRTYkwk15Xs623JG5MznLKcywFoSrpKKn',
            },
          })
          return response
        } catch (error) {
          console.log(error)
          return Promise.resolve({ data: { description: 'No se encontró la descripción' } })
        }
      })

      const results = await Promise.allSettled(promises)
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.messages[index].description = result.value.data.description
        } else {
          this.messages[index].description = ''
        }
      })
      console.log(2)
      return
    } catch (error) {
      console.error('Error occurred while populating messages description:', error)
      return
    }
  }
}

export default MessagesService
