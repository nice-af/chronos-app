import { atom } from 'jotai';
import { JiraAccountModel, JiraAuthsAtom, JiraClientsAtom } from '../services/storage.service';
import { worklogsLocalAtom, worklogsRemoteAtom } from './worklog';

export const jiraAccountsAtom = atom<JiraAccountModel[]>([]);
export const jiraAuthsAtom = atom<JiraAuthsAtom>({});
export const jiraClientsAtom = atom<JiraClientsAtom>({});

export const logoutAtom = atom(null, (_get, set) => {
  set(jiraAuthsAtom, {});
  set(jiraClientsAtom, {});
  set(worklogsLocalAtom, []);
  set(worklogsRemoteAtom, []);
  // TODO: Clean projects atom?
});
