import client from "@core/api/graphql/graphql-client";
import { MemberAddressType } from '@core/api/graphql/types';
import { currencyCode, currentUserId, locale, storeId } from "@core/constants";
import getMyAddressesQueryDocument from './getMyAddressesQuery.graphql';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getMyAddresses(): Promise<MemberAddressType[]> {
  const { data } = await client.query({
    query: getMyAddressesQueryDocument
  });
  console.log(data);
  return data?.me?.contact?.addresses;
}
export default getMyAddresses;
