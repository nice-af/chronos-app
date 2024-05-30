import axios from 'axios';
import { Buffer } from 'buffer';
import { Project as JiraProject } from 'jira.js/out/version3/models';
import { jiraAccountTokensAtom, projectsAtom, store, upsertProjectAtom } from '../atoms';
import { UUID } from '../types/accounts.types';
import { Project } from '../types/global.types';
import { getAccountIdFromUUID } from './account.service';

export function createNewLocalProject(project: JiraProject, uuid: UUID): Project {
  return {
    id: project.id,
    key: project.key,
    _avatarUrl: project.avatarUrls?.['48x48'] ?? '',
    avatar: null,
    name: project.name,
    uuid,
  };
}

export function getProjectByIssueKey(issueKey: string, uuid: UUID) {
  const projectId = issueKey.split('-')[0];
  const projects = store.get(projectsAtom);
  return projects.find(p => p.key === projectId && p.uuid === uuid) ?? null;
}

export async function loadAvatarForProject(project: Project) {
  if (project.avatar) {
    return;
  }

  const tokens = store.get(jiraAccountTokensAtom)?.[getAccountIdFromUUID(project.uuid)];
  if (!tokens) {
    // No tokens for this account found. Maybe it isn't initialized yet
    return;
  }
  const avatarUrl = project._avatarUrl + '?format=png';
  const imageRes = await axios.get(avatarUrl, {
    responseType: 'arraybuffer',
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });
  const base64 = Buffer.from(imageRes.data, 'binary').toString('base64');
  store.set(upsertProjectAtom, { ...project, avatar: `data:image/png;charset=utf-8;base64,${base64}` });
}
