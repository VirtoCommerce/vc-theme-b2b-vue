import mutationDocument from "./deleteMemberAddressesMutation.graphql";
import type { InputMemberAddressType, Mutations, MutationsDeleteMemberAddressesArgs } from "@/xapi/types";

export default async function deleteMemberAddresses(
  addresses: InputMemberAddressType[],
  memberId: string
): Promise<void> {
  const { $graphqlClient } = useNuxtApp();

  await $graphqlClient.mutate<Required<Pick<Mutations, "deleteMemberAddresses">>, MutationsDeleteMemberAddressesArgs>({
    mutation: mutationDocument,
    variables: {
      command: {
        memberId,
        addresses,
      },
    },
  });
}
