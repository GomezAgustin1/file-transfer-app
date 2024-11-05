import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { FileService } from './file.service'
import MessagesService from './messages.service'
import { InstitutionService } from './institution.service'
import { join } from 'path'
import { cwd } from 'process'

// const CONFIG_FILE = join(__dirname, '..', '..', '..', '..', '..', '..', 'config.json')
const CONFIG_FILE = join(cwd(), 'config.json')

export function getConfig() {
  console.log('CONFIG_FILE:', CONFIG_FILE)
  // const fileService = new FileService()
  // const configData = await fileService.getFile(CONFIG_FILE)
  // const config = JSON.parse(configData)
  return CONFIG_FILE
}

export async function messagesFlowHandler() {
  try {
    // GET necessary data
    const fileService = new FileService()
    const institutionService = new InstitutionService()

    const configData = await fileService.getFile(CONFIG_FILE)
    const config = JSON.parse(configData)
    const ip = '8.8.8.8'
    const { pamsFolderPath, tamsFolderPath } = await institutionService.getInstitutionConnectionDetails(ip, config.area)

    const institutions = await institutionService.getInstitutions()

    const pamsFiles = await fileService.getFiles(pamsFolderPath)
    const pamsData: string[] = await fileService.readFilesContent(pamsFolderPath, pamsFiles)

    const tamsFiles = await fileService.getFiles(tamsFolderPath)
    const tamsData: string[] = await fileService.readFilesContent(tamsFolderPath, tamsFiles)

    // Process Messages
    const messageService = new MessagesService(institutions)

    pamsData.forEach((content, index) => {
      if (messageService.isPamMultipleMessages(content)) {
        messageService.addMultiplePamMessages(content, pamsFiles[index])
      } else {
        messageService.addMessage(content, pamsFiles[index])
      }
    })

    tamsData.forEach((content, index) => {
      messageService.addMessage(content, tamsFiles[index])
    })

    await messageService.populateMessagesDescription()

    return messageService.getMessages()
  } catch (error) {
    console.error(error)
    return null // Add a return statement to handle the error case
  }
}

// Custom APIs for renderer
const api = {
  messagesFlowHandler,
  getConfig,
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
