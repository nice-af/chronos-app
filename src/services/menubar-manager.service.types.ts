export enum MenubarState {
  Paused = 'paused',
  Running = 'running',
}

export interface ManubarManagerService {
  setMenubarText: (newText: string) => void;
  setMenubarState: (newState: MenubarState) => void;
}
