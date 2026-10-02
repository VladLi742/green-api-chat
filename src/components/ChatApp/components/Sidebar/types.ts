import type { Chat } from '../../types';


export interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onCreateChatAction: (formData: FormData) => Promise<void>;
  onClickChat: ({ chatId }: { chatId: string }) => () => void;
}
