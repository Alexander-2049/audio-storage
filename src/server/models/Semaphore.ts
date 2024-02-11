export default class Semaphore {
  private maxCount: number;
  private currentCount: number;
  private queue: (() => void)[];

  constructor(maxCount: number) {
    this.maxCount = maxCount;
    this.currentCount = 0;
    this.queue = [];
  }

  async acquire(): Promise<void> {
    if (this.currentCount < this.maxCount) {
      this.currentCount++;
      return Promise.resolve();
    } else {
      return new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }
  }

  release(): void {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve?.();
    } else {
      this.currentCount--;
    }
  }
}