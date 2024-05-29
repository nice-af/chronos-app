import { atom, useAtomValue } from 'jotai';
import { JiraAccountTokensAtom, JiraClientsAtom, LoginModel, UUID } from '../types/accounts.types';
import { store } from './store';

export const primaryUUIDAtom = atom<UUID>('' as UUID);
export const loginsAtom = atom<LoginModel[]>([]);
export const jiraAccountTokensAtom = atom<JiraAccountTokensAtom>({});
export const jiraClientsAtom = atom<JiraClientsAtom>({});

export const useLoginByUUID = (uuid: UUID) => {
  return useAtomValue(loginsAtom).find(login => login.uuid === uuid);
};

export function getLoginByUUID(uuid: UUID) {
  return store.get(loginsAtom).find(login => login.uuid === uuid);
}
