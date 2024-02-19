import fs from "fs";
import Stack from "./Stack";
import { IncomingMessage } from "http";

class FileStorage {
  private writingStack: Stack;
  private downloading: Map<string, boolean>; // Using a Map to track downloading files

  constructor(maxConcurrentWrites: number) {
    if (!fs.existsSync("storage")) fs.mkdirSync("storage");
    this.writingStack = new Stack(maxConcurrentWrites);
    this.downloading = new Map();
  }

  async writeToFile(fileName: string, data: Buffer): Promise<void> {
    const filePath = `storage/${fileName}`;
    if (fs.existsSync(filePath) || this.downloading.has(fileName)) {
      throw new Error("File already exists or is being downloaded");
    }
    this.downloading.set(fileName, true); // Adding the file to downloading Map
    await this.writingStack.acquire();
    fs.writeFileSync(filePath, data);
    this.downloading.delete(fileName); // Removing the file from downloading Map
    this.writingStack.release();
  }

  async writeFileFromStream(
    fileName: string,
    stream: fs.ReadStream | IncomingMessage
  ): Promise<void> {
    const filePath = `storage/${fileName}`;
    if (fs.existsSync(filePath) || this.downloading.has(fileName)) {
      throw new Error("File already exists or is being downloaded");
    }
    this.downloading.set(fileName, true); // Adding the file to downloading Map
    await this.writingStack.acquire();
    const writeStream = fs.createWriteStream(filePath);

    return new Promise<void>((resolve, reject) => {
      stream.pipe(writeStream);

      writeStream.on("finish", () => {
        this.downloading.delete(fileName); // Removing the file from downloading Map
        this.writingStack.release();
        resolve();
      });

      writeStream.on("error", (err) => {
        this.downloading.delete(fileName); // Removing the file from downloading Map
        this.writingStack.release();
        reject(err);
      });
    });
  }

  async readFileFully(fileName: string): Promise<Buffer> {
    const filePath = `storage/${fileName}`;
    while (true) {
      if (fs.existsSync(filePath) && !this.downloading.has(fileName)) {
        try {
          return fs.readFileSync(filePath);
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // NOT TESTED
  streamFileToCallback(
    fileName: string,
    callback: (data: Buffer) => void
  ): void {
    const filePath = `storage/${fileName}`;
    if (this.downloading.has(fileName)) {
      throw new Error("File is being downloaded");
    }
    const readStream = fs.createReadStream(filePath);
    readStream.on("data", (chunk) => {
      if (Buffer.isBuffer(chunk)) {
        callback(chunk);
      } else {
        // Convert string chunk to Buffer
        callback(Buffer.from(chunk));
      }
    });
    readStream.on("end", () => {
      readStream.close();
    });
    readStream.on("error", (error) => {
      console.error("Error streaming file:", error);
    });
  }

  existsSync(fileName: string) {
    const filePath = `storage/${fileName}`;
    if (this.downloading.has(fileName) || fs.existsSync(filePath)) {
      return true;
    } else {
      return false;
    }
  }

  sizeSync(fileName: string) {
    const filePath = `storage/${fileName}`;
    const stats = fs.statSync(filePath);
    return stats.size;
  }
}

const filestorage = new FileStorage(5);
export default filestorage;
