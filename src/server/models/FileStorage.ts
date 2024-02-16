import fs from "fs";

export default class FileStorage {
  storageName: string;

  constructor(storageName: string) {
    this.storageName = storageName;

    if (!fs.existsSync("storage/" + storageName))
      fs.mkdirSync("storage/" + storageName, { recursive: true });
  }

  writeToFile(fileName: string, data: Buffer): void {
    const filePath = `storage/${this.storageName}/${fileName}`;
    fs.writeFileSync(filePath, data);
  }

  readFromFile(fileName: string, callback: (data: Buffer) => void): void {
    const filePath = `storage/${this.storageName}/${fileName}`;
    if (fs.existsSync(filePath)) {
      const readStream = fs.createReadStream(filePath);

      readStream.on("data", (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          callback(chunk);
        } else {
          // Convert string chunk to Buffer
          callback(Buffer.from(chunk));
        }
      });

      readStream.on("error", (error) => {
        console.error("Error reading file:", error);
      });
    } else {
      console.error("File not found:", filePath);
    }
  }
}
