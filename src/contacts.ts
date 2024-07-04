import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';

export interface IContact {
  id: string;
  createdAt: number;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
}

async function getContacts(query?: string | null): Promise<IContact[]> {
  await fakeNetwork(`getContacts:${query}`);
  let contacts: IContact[] | null = await localforage.getItem('contacts');
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] });
  }
  return contacts.sort(sortBy('last', 'createdAt'));
}

async function createContact(): Promise<IContact> {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const contact: IContact = { id, createdAt: Date.now() };
  const contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

async function getContact(id: string): Promise<IContact | null> {
  await fakeNetwork(`contact:${id}`);
  const contacts: IContact[] | null = await localforage.getItem('contacts');
  if (!contacts) return null;
  const contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

async function updateContact(
  id: string,
  updates: Partial<IContact>
): Promise<IContact> {
  await fakeNetwork();
  const contacts: IContact[] | null = await localforage.getItem('contacts');
  if (!contacts) throw new Error('No contacts found');
  const contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error(`No contact found for id ${id}`);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

async function deleteContact(id: string): Promise<boolean> {
  const contacts: IContact[] | null = await localforage.getItem('contacts');
  if (!contacts) return false;
  const index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: IContact[]): Promise<IContact[]> {
  return localforage.setItem('contacts', contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key?: string): Promise<void> {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key!]) {
    return;
  }

  fakeCache[key!] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}

export { getContacts, createContact, getContact, updateContact, deleteContact };
