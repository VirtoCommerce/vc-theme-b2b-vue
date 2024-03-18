import { useMutation } from "@/core/api/graphql/composables/useMutation";
import { MarkAllPushMessagesUnreadDocument, OperationNames } from "@/core/api/graphql/types";
import type { GetPushMessagesQuery } from "@/core/api/graphql/types";

export function useMarkAllPushMessagesUnread() {
  return useMutation(MarkAllPushMessagesUnreadDocument, {
    // TODO: Remove all code below in next iteration when XAPI will return objects from mutations
    optimisticResponse: {
      markAllPushMessagesUnread: true,
    },
    updateQueries: {
      [OperationNames.Query.GetPushMessages]: (previousQueryResult, { mutationResult }) => {
        if (mutationResult.data?.markAllPushMessagesUnread) {
          const pushMessagesQueryResult = previousQueryResult as GetPushMessagesQuery;
          return {
            ...pushMessagesQueryResult,
            // TODO: Move this code to optimisticResponse in next iteration for better UX responsitibility
            pushMessages: {
              unreadCount: pushMessagesQueryResult.pushMessages.items.length,
              items: pushMessagesQueryResult.pushMessages.items.map((pushMessage) => ({
                ...pushMessage,
                status: "Unread",
              })),
            },
          };
        } else {
          return { ...previousQueryResult };
        }
      },
    },
    // Just in case we did something wrong in cache
    refetchQueries: [OperationNames.Query.GetPushMessages],
  });
}