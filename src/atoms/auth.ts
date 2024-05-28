import { atom } from 'jotai';
import { JiraAccountModel, JiraAuthsAtom, JiraClientsAtom } from '../services/storage.service';

export const jiraAccountsAtom = atom<JiraAccountModel[]>([]);
export const jiraAuthsAtom = atom<JiraAuthsAtom>({});
export const jiraClientsAtom = atom<JiraClientsAtom>({});
