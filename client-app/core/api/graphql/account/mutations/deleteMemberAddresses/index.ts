import client from "@core/api/graphql/graphql-client";
import { InputMemberAddressType, Mutations, MutationsDeleteMemberAddressesArgs } from "@core/api/graphql/types";
import mutationDocument from "./deleteMemberAddressesMutation.graphql";

export default async function deleteMemberAddresses(
  memberId: string,
  addresses: InputMemberAddressType[]
): Promise<void> {
  await client.mutate<Pick<Mutations, "deleteMemberAddresses">, MutationsDeleteMemberAddressesArgs>({
    mutation: mutationDocument,
    variables: {
      command: {
        memberId,
        addresses,
      },
    },
  });
}
