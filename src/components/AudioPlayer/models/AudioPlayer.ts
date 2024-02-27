export class AudioPlayer {
  private playlist: Song[];
  private context: AudioContext;
  private analyzer: AnalyserNode;

  constructor() {
    this.playlist = [];
    this.context = new AudioContext();
    this.analyzer = this.context.createAnalyser();
    this.analyzer.fftSize = 2048;
  }

  private async requestChunk(id: number, startByte: number, endByte: number) {
    const response = await fetch("/api/music/chunks", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Range: `bytes=${startByte}-${endByte}`,
      },
      body: new URLSearchParams({ id: id.toString() }),
    });

    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  }
}

export class Song {
  private isPlaying: boolean;
  private chunks: Chunk[];

  constructor() {
    this.isPlaying = false;
    this.chunks = [];
  }

  private appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    const buff1 = new Uint8Array(buffer1);
    const buff2 = new Uint8Array(buffer2);
    tmp.set(buff1, 0);
    tmp.set(buff2, buffer1.byteLength);
    return tmp.buffer;
  }
}

export class Chunk {}
