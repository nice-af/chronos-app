import axios from 'axios';
import { Buffer } from 'buffer';
import { Project as JiraProject } from 'jira.js/out/version3/models';
import { jiraAuthAtom, projectsAtom, store, upsertProjectAtom } from '../atoms';
import { Project } from '../types/global.types';

export function createNewLocalProject(project: JiraProject): Project {
  return {
    id: project.id,
    key: project.key,
    _avatarUrl: project.avatarUrls?.['48x48'] ?? '',
    avatar: null,
    name: project.name,
  };
}

export function getProjectByIssueKey(issueKey: string) {
  const projectId = issueKey.split('-')[0];
  const projects = store.get(projectsAtom);
  return projects.find(p => p.key === projectId) ?? null;
}

export async function loadAvatarForProject(project: Project) {
  if (project.avatar) {
    return;
  }
  const avatarUrl = project._avatarUrl;
  const imageRes = await axios.get(avatarUrl, {
    responseType: 'arraybuffer',
    headers: { Authorization: `Bearer ${store.get(jiraAuthAtom)!.accessToken}` },
  });
  const base64 = Buffer.from(imageRes.data, 'binary').toString('base64');
  store.set(upsertProjectAtom, { ...project, avatar: `data:image/jpeg;charset=utf-8;base64,${base64}` });
}
