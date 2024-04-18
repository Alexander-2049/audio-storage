export interface SongInterface {
  song_id: string;
  file_size: number;
  title: string;
  artist: string;
  duration: number;
}

export class AudioPlayer {
  private playlist: Song[];
  private shuffled_playlist: Song[];
  private context: AudioContext;
  private analyzer: AnalyserNode;
  private source: AudioBufferSourceNode | null;
  private isPlaying: boolean;
  private gainNode: GainNode;

  constructor() {
    this.playlist = [];
    this.shuffled_playlist = [];
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
    this.analyzer = this.context.createAnalyser();
    this.analyzer.fftSize = 2048;
    this.source = null;
    this.isPlaying = false; // Initialize isPlaying to false
  }

  static async requestSongInfo(id: string) {
    console.log("Requesting song info...");
    const response = await fetch("/api/music/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ id: id.toString() }),
    });
    const decoded: SongInterface = await response.json();
    console.log("Song info has been received");
    return decoded;
  }

  static async requestChunk(id: string, startByte: number, endByte: number) {
    console.log("Requesting a chunk " + id + " " + startByte + " " + endByte);
    const response = await fetch("/api/music/chunks", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Range: `bytes=${startByte}-${endByte}`,
      },
      body: new URLSearchParams({ id: id.toString() }),
    });

    const arrayBuffer = await response.arrayBuffer();
    console.log(
      "Chunk has been received " + id + " " + startByte + " " + endByte
    );
    return arrayBuffer;
  }

  public async play(songId: string | null = null) {
    console.log("play()");
    if (!songId && !this.source) {
      throw new Error("No song is loaded to play.");
    }

    if (!this.source) {
      const song = this.playlist.find(
        (s) => s.getSongData().song_id === songId
      );
      if (!song) {
        throw new Error("Song not found in the playlist.");
      }

      await song.loadChunks();
      const audio_buffer = song.getAudioBuffer();
      if (!audio_buffer) {
        throw new Error("AudioBuffer is empty");
      }
      this.source = this.context.createBufferSource();
      this.source.buffer = audio_buffer;
      this.source.connect(this.gainNode);
      this.source.connect(this.context.destination);

      if (this.isPlaying) {
        // If audio is already playing, do nothing
        return;
      }

      this.source.start(0);
      this.isPlaying = true;
    } else if (this.source) {
      this.context.resume();
      this.isPlaying = true;
    }
  }

  public pause() {
    console.log("pause()");
    if (this.source && this.isPlaying) {
      this.context.suspend();
      this.isPlaying = false; // Update isPlaying to false when paused
    }
  }

  public async addSongToPlaylist(songInfo: SongInterface) {
    console.log("Adding song to playlist...");
    try {
      // Create a new Song instance with the fetched song data
      const newSong = new Song(songInfo);

      // Load chunks of song data asynchronously
      await newSong.loadChunks();

      const chunks = newSong.getChunks();
      const audio_data = chunks.map((chunk) => chunk.getData());
      const audio_buffer = await this.decodeAudioData(audio_data);
      newSong.setAudioBuffer(audio_buffer);

      // Add the new song to the playlist
      this.playlist.push(newSong);
      console.log("Successfully added song to playlist...");
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      throw new Error("Error adding song to playlist.");
    }
  }

  public moveTo(time: number) {
    if (this.source) {
      if (this.isPlaying) {
        // If currently playing, stop the source node
        this.source.stop();
      }
      this.source.disconnect();

      // Create a new source node
      const newSource = this.context.createBufferSource();
      if (!this.source.buffer) {
        throw new Error("Buffer is null");
      }
      newSource.buffer = this.source.buffer; // Set the buffer to the current buffer
      newSource.connect(this.context.destination);
      newSource.connect(this.gainNode);

      // Calculate the time offset within the audio buffer
      const offset = time % newSource.buffer.duration;

      // Start playing from the specified time offset
      newSource.start(0, offset);

      // Update the source reference
      this.source = newSource;

      this.isPlaying = true;
    }
  }

  public getContext() {
    return this.context;
  }

  private async decodeAudioData(
    audioData: ArrayBuffer[]
  ): Promise<AudioBuffer> {
    console.log("Decoding audio data...");
    const audioBuffer = await this.context.decodeAudioData(audioData[0]);
    console.log("Decoded data has been received");
    return audioBuffer;
  }

  public getCurrentTime(): number {
    if (this.context && this.source) {
      return this.context.currentTime;
    }
    return 0;
  }

  public setVolume(volume: number | string) {
    if (typeof volume === "string") {
      volume = Number(volume).valueOf() | 0.1;
    }

    if (volume < 0) volume = -1;
    else if (volume > 1) volume = 1;
    else {
      volume -= 1;
    }
    this.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
  }
}

export class Song {
  private chunks: Chunk[];
  private audio_buffer?: AudioBuffer;
  private song_data: SongInterface;

  constructor(song_data: SongInterface) {
    this.chunks = [];
    this.song_data = song_data;
  }

  public async loadChunks() {
    // Logic to load chunks of song data asynchronously
    if (this.chunks.length === 0) {
      const chunkData = await this.loadChunkData();
      const chunk = new Chunk(chunkData);
      this.chunks.push(chunk);
    }
  }

  private async loadChunkData() {
    // Logic to load chunk data asynchronously, using this.song_data.song_id
    const chunkData = await AudioPlayer.requestChunk(
      this.song_data.song_id,
      // Specify startByte and endByte
      0,
      this.song_data.file_size - 1
    );
    return chunkData;
  }

  public getChunks(): Chunk[] {
    return this.chunks;
  }

  public getSongData(): SongInterface {
    return this.song_data;
  }

  public getAudioBuffer(): AudioBuffer | undefined {
    return this.audio_buffer;
  }

  public setAudioBuffer(audio_buffer: AudioBuffer) {
    this.audio_buffer = audio_buffer;
    return this.audio_buffer;
  }
}

export class Chunk {
  private data: ArrayBuffer;

  constructor(data: ArrayBuffer) {
    this.data = data;
  }

  public getData(): ArrayBuffer {
    return this.data;
  }
}
