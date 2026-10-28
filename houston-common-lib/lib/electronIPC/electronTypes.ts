export interface ElectronWebContents {
  send(channel: string, ...args: any[]): void;
}

export interface ElectronIpcMain {
  on(channel: string, listener: (...args: any[]) => void): unknown;
}
