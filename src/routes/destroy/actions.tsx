import { redirect, ActionFunctionArgs } from 'react-router-dom';
import { deleteContact } from '../../contacts';

export const action = async ({
  params,
}: ActionFunctionArgs<{
  params: {
    contactId: string;
  };
}>): Promise<Response> => {
  console.log('Destroy action');
  throw new Error('oh dang!');
  await deleteContact(params.contactId!);
  return redirect('/');
};
