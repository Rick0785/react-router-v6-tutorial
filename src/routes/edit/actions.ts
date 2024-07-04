import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { updateContact } from '../../contacts';

export const action = async ({
  request,
  params,
}: ActionFunctionArgs<{
  request: Request;
  params: {
    contactId: string;
  };
}>): Promise<Response> => {
  console.log('EditContact action');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const contact = await updateContact(params.contactId!, updates);
  console.log({ contact });
  return redirect(`/contacts/${params.contactId}`);
};
