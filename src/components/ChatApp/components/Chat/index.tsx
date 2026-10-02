import { useActionState, useRef } from 'react';
import clsx from 'clsx';

import styles from './index.module.css';
import SendButton from './SendButton';
import type { ChatProps } from './types';
import type { Message } from '../../types';


export function Chat({ activeChat, onSendMessageAction }: ChatProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [, action] = useActionState(async (_prevState: any, formData: FormData) => {
    const textToSend = formData.get('message') as string;

    if (!textToSend?.trim() || !activeChat) return null;

    formRef.current?.reset();

    try {
      await onSendMessageAction(activeChat.chatId, textToSend);
    } catch (error) {
      console.error(error);
      return;
    }
    return null;
  }, null);

  if (!activeChat) {
    return (
      <main className={styles.chat}>
        <div className={styles.noChatSelected}>
          <span>Выберите чат или создайте новый</span>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.chat}>
      <h2 className={styles.chatTitle}>{activeChat!.chatName}</h2>
      <div className={styles.messages}>
        {activeChat.messages.map((message: Message) => {
          const isMe = message.sender === 'me';
          return (
            <div key={message.id} className={clsx(styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperOther)} >
              <div className={clsx(styles.message, isMe ? styles.messageMe : styles.messageOther)}>
                {message.text}
              </div>
            </div>
          );
        })}
      </div>
      <form action={action} ref={formRef} className={styles.messageForm}>
        <input
          name="message"
          type="text"
          placeholder="Написать сообщение..."
          className={styles.messageInput}
          required
        />
        <SendButton />
      </form>
    </main>
  );
}
