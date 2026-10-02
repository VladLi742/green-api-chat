import { useActionState } from 'react';
import clsx from 'clsx';

import styles from './index.module.css';
import SubmitButton from './SubmitButton';
import type { SidebarProps } from './types';
import type { Chat } from '../../types';


export function Sidebar({
  chats,
  activeChatId,
  onCreateChatAction,
  onClickChat,
}: SidebarProps) {
  const [, action] = useActionState(async (_prevState: any, formData: FormData) => {
    await onCreateChatAction(formData);
    return null;
  }, null);

  const handleRenderChatListItem = (chat: Chat) => {
    const isActive = activeChatId === chat.chatId;
    const hasMessages = chat.messages.length > 0;
    return (
      <li
        key={chat.chatId}
        className={clsx(styles.chatListItem, isActive && styles.activeChat)}
        onClick={onClickChat({ chatId: chat.chatId })}
      >
        <span className={styles.chatAvatar}>{chat.chatName.substring(0, 2)}</span>
        <div className={styles.chatInfo}>
          <div className={styles.chatName}>{chat.chatName}</div>
          <div className={styles.chatPreview}>
            {hasMessages ? chat.messages.at(-1)?.text : 'Нет сообщений'}
          </div>
        </div>
      </li>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <form action={action} className={styles.newChatForm}>
          <input
            name="phone"
            className={styles.newChatInput}
            type="tel"
            placeholder="Номер телефона"
            maxLength={11}
            required
          />
          <SubmitButton />
        </form>
      </div>
      <ul className={styles.chats}>
        {chats.map(handleRenderChatListItem)}
      </ul>
    </aside>
  );
}
