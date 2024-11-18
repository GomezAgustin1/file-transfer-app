import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { FileService } from './file.service';
import MessagesService from './messages.service';
import { InstitutionService } from './institution.service';
// import { cwd } from 'process';

async function prepareConfig() {
  const CONFIG_FILE_NAME = 'config.json';
  const CONFIG_FILE_CONTENT = `{
  "area": 10
}`;
  const fileService = new FileService();

  try {
    // Check if the file exists
    const fileExists = await fileService.fileExists(CONFIG_FILE_NAME);

    if (fileExists) {
      // File exists, return the file data
      const configData = await fileService.getFile(CONFIG_FILE_NAME);
      return JSON.parse(configData);
    } else {
      // File doesn't exist, create the file and return an empty object
      await fileService.createFile({ filename: CONFIG_FILE_NAME, content: CONFIG_FILE_CONTENT });
      return {};
    }
  } catch (error) {
    console.error(error);
    return null; // Add a return statement to handle the error case
  }
}

// async function getPublicIP() {
//   try {
//     const response = await fetch('https://api.ipify.org/?format=json');
//     const data = await response.json();
//     return data.ip;
//   } catch (error) {
//     console.error(error);
//     return null; // Add a return statement to handle the error case
//   }
// }

export async function messagesFlowHandler() {
  try {
    const config = await prepareConfig();

    // GET necessary data
    const fileService = new FileService();
    const institutionService = new InstitutionService();
    // const ip = await getPublicIP();
    const ip = '127.0.0.1';
    debugger;

    const { pamsFolderPath, tamsFolderPath } = await institutionService.getInstitutionConnectionDetails(
      ip,
      config.area
    );

    const institutions = await institutionService.getInstitutions();

    const pamsFiles = await fileService.getFiles(pamsFolderPath);
    const pamsData: string[] = await fileService.readFilesContent(pamsFolderPath, pamsFiles);

    const tamsFiles = await fileService.getFiles(tamsFolderPath);
    const tamsData: string[] = await fileService.readFilesContent(tamsFolderPath, tamsFiles);

    // Process Messages
    const messageService = new MessagesService(institutions);

    pamsData.forEach((content, index) => {
      if (messageService.isPamMultipleMessages(content)) {
        messageService.addMultiplePamMessages(content, pamsFiles[index]);
      } else {
        messageService.addMessage(content, pamsFiles[index]);
      }
    });

    tamsData.forEach((content, index) => {
      messageService.addMessage(content, tamsFiles[index]);
    });

    await messageService.populateMessagesDescription();

    return messageService.getMessages();
  } catch (error) {
    console.error(error);
    return null; // Add a return statement to handle the error case
  }
}

// Custom APIs for renderer
const api = {
  messagesFlowHandler,
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

// async function createPamsTamsDir() {
//   const fileService = new FileService();
//   const pamsFolderPath = cwd() + '/pams-files';
//   const tamsFolderPath = cwd() + '/tams-files';

//   try {
//     // Check if the directories exist
//     const pamsDirExists = await fileService.directoryExists(pamsFolderPath);
//     const tamsDirExists = await fileService.directoryExists(tamsFolderPath);

//     if (!pamsDirExists) {
//       await fileService.createDirectory({ dirPath: pamsFolderPath });
//     }

//     if (!tamsDirExists) {
//       await fileService.createDirectory({ dirPath: tamsFolderPath });
//     }
//   } catch (error) {
//     console.error(error);
//     return null; // Add a return statement to handle the error case
//   }
// }
