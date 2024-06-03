import { AccountId, CloudId, UUID } from '../types/accounts.types';

export function getAccountIdFromUUID(uuid: UUID): AccountId {
  return uuid.split('__')[0] as AccountId;
}

export function getCloudIdFromUUID(uuid: UUID): CloudId {
  return uuid.split('__')[1] as CloudId;
}

export function getUUID(accountId: AccountId, cloudId: CloudId): UUID {
  return `${accountId}__${cloudId}` as UUID;
}
