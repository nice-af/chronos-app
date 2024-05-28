import { atom } from 'jotai';
import { JiraAccountModel, JiraAuthsAtom, JiraClientsAtom } from '../services/storage.service';

export const primaryJiraAccountIdAtom = atom<string>('');
export const jiraAccountsAtom = atom<JiraAccountModel[]>([]);
export const jiraAuthsAtom = atom<JiraAuthsAtom>({});
export const jiraClientsAtom = atom<JiraClientsAtom>({});
