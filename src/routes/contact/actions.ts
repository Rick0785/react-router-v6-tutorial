import { IContact, getContact, updateContact } from '../../contacts';
import { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router-dom';

export const loader = async ({
  params,
}: LoaderFunctionArgs<{
  params: {
    contactId: string;
  };
}>): Promise<IContact | null> => {
  console.log('Contact loader');
  const contact = await getContact(params.contactId!);
  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  }
  console.log({ contact });
  return contact;
};

export const action = async ({
  request,
  params,
}: ActionFunctionArgs<{
  request: Request;
  params: {
    contactId: string;
  };
}>) => {
  const formData = await request.formData();
  return updateContact(params.contactId!, {
    favorite: formData.get('favorite') === 'true',
  });
};
