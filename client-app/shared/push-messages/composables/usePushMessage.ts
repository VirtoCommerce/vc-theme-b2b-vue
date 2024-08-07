import { useMarkPushMessageRead } from "@/core/api/graphql/push-messages/mutations/markPushMessageRead";
import { useMarkPushMessageUnread } from "@/core/api/graphql/push-messages/mutations/markPushMessageUnread";
import type { Ref } from "vue";

export function usePushMessage(pushMessage: Ref<VcPushMessageType>, optimistic = true) {
  const { mutate: _markRead } = useMarkPushMessageRead(optimistic);
  async function markRead() {
    await _markRead({ command: { messageId: pushMessage.value.id } });
  }

  const { mutate: _markUnread } = useMarkPushMessageUnread(optimistic);
  async function markUnread() {
    await _markUnread({ command: { messageId: pushMessage.value.id } });
  }

  async function toggleRead() {
    if (pushMessage.value.isRead) {
      await markUnread();
    } else {
      await markRead();
    }
  }

  return {
    pushMessage,
    markRead,
    markUnread,
    toggleRead,
  };
}
