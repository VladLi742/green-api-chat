import type { Chat } from '../../types';

export interface ChatProps {
  activeChat: Chat | undefined;
  onSendMessageAction: (chatId: string, text: string) => Promise<void>;
}
