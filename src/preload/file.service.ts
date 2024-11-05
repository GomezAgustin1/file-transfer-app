import fs from 'fs'
import path from 'path'

interface MoveFileOptions {
  originFilePath: string
  destinationFolderPath: string
}

export class FileService {
  // function to read files from electron
  async getFiles(path: string): Promise<string[]> {
    try {
      const files = await new Promise<string[]>(async (resolve, reject) => {
        fs.readdir(path, (err, files) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(files)
          }
        })
      })
      return files
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getFile(path: string): Promise<string> {
    try {
      const file = await fs.readFileSync(`${path}`, { encoding: 'utf8' })
      return file
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // Read and print the files content
  async readFilesContent(folderPath: string, files: string[]): Promise<string[]> {
    const fileContents: string[] = []
    for (const file of files) {
      const data = await fs.readFileSync(`${folderPath}/${file}`, { encoding: 'utf8' })
      fileContents.push(data)
    }
    return fileContents
  }

  async moveFile({ originFilePath, destinationFolderPath }: MoveFileOptions): Promise<void> {
    try {
      await fs.promises.rename(originFilePath, `${destinationFolderPath}/${path.basename(originFilePath)}`)
      console.log(`File ${originFilePath} moved to ${destinationFolderPath}`)
    } catch (error) {
      console.error(`Error moving file ${originFilePath}:`, error)
      throw error
    }
  }
}
