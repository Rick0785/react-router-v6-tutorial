import { redirect, LoaderFunctionArgs } from 'react-router-dom';
import { IContact, getContacts, createContact } from '../../contacts';

export const loader = async ({
  request,
}: LoaderFunctionArgs<{ request: Request }>): Promise<{
  contacts: IContact[];
  q: string | null;
}> => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const contacts = await getContacts(q);
  return { contacts, q };
};

export async function action(): Promise<Response> {
  console.log('action');
  const contact = await createContact();
  console.log(contact);
  return redirect(`/contacts/${contact.id}/edit`);
}
