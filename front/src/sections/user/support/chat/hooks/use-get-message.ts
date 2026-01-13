// types
import { API_URL } from 'src/config-global';
import type { ISupportChatMessage } from 'src/types';

// ----------------------------------------------------------------------

type Props = {
  message: ISupportChatMessage;
  currentUserId: string;
};

export default function useGetMessage({ message, currentUserId }: Props) {
  const senderDetails =
    message.senderId === currentUserId
      ? {
        type: 'me',
      }
      : {
        avatarUrl: message.isAi
          ? '/assets/chat/ai.png'
          : `${!message.sender?.avatar?.includes("http") ? `${API_URL}/` : ""}${message.sender?.avatar}`,
        firstName: message.sender?.username,
      };

  const me = senderDetails.type === 'me';

  const hasImage = !!message.attachment;

  return {
    hasImage,
    me,
    senderDetails,
  };
}
