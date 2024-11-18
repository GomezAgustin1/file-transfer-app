import fs from 'fs';
import path from 'path';

interface MoveFileOptions {
  originFilePath: string;
  destinationFolderPath: string;
}

interface CreateFileInterface {
  filename: string;
  content: string;
}

export interface IFileService {
  getFiles(path: string): Promise<string[]>;
  getFile(path: string): Promise<string>;
  readFilesContent(folderPath: string, files: string[]): Promise<string[]>;
  moveFile(options: MoveFileOptions): Promise<void>;
  createFile(options: CreateFileInterface): Promise<void>;
}

export class FileService implements IFileService {
  async getFiles(path: string): Promise<string[]> {
    try {
      const files = await new Promise<string[]>(async (resolve, reject) => {
        fs.readdir(path, (err, files) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(files);
          }
        });
      });
      return files;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getFile(path: string): Promise<string> {
    try {
      const file = await fs.readFileSync(`${path}`, { encoding: 'utf8' });
      return file;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async readFilesContent(folderPath: string, files: string[]): Promise<string[]> {
    const fileContents: string[] = [];
    for (const file of files) {
      const data = await fs.readFileSync(`${folderPath}/${file}`, { encoding: 'utf8' });
      fileContents.push(data);
    }
    return fileContents;
  }

  async moveFile({ originFilePath, destinationFolderPath }: MoveFileOptions): Promise<void> {
    try {
      await fs.promises.rename(originFilePath, `${destinationFolderPath}/${path.basename(originFilePath)}`);
      console.log(`File ${originFilePath} moved to ${destinationFolderPath}`);
    } catch (error) {
      console.error(`Error moving file ${originFilePath}:`, error);
      throw error;
    }
  }

  async createFile({ filename, content }: CreateFileInterface): Promise<void> {
    try {
      const currentDirectory = process.cwd();
      await fs.promises.writeFile(`${currentDirectory}/${filename}`, content);
      console.log(`File ${filename} created.`);
    } catch (error) {
      console.error(`Error creating file ${filename}:`, error);
      throw error;
    }
  }

  async createDirectory({ dirPath }) {
    try {
      await fs.promises.mkdir(dirPath);
      console.log(`Directory ${dirPath} created.`);
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
      throw error;
    }
  }

  async fileExists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return false;
      }
      console.error(`Error checking if file ${filePath} exists:`, error);
      throw error;
    }
  }

  async directoryExists(dirPath) {
    try {
      await fs.promises.access(dirPath);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return false;
      }
      console.error(`Error checking if directory ${dirPath} exists:`, error);
      throw error;
    }
  }
}
