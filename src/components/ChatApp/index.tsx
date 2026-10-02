import { useState, useEffect, useOptimistic } from 'react';

import styles from './index.module.css';

import { Sidebar } from './components/Sidebar';
import { Chat as ChatComponent } from './components/Chat';

import sendMessage from './api/sendMessage';
import getContactInfo from './api/getContactInfo';
import isPhoneValid from './utils/isPhoneValid';
import receiveNotification from './api/receiveNotification';

import type { Chat, Message } from './types';


export function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [optimisticChats, addOptimisticMessage] = useOptimistic<Chat[], { chatId: string; message: Message }>(
    chats,
    (state, { chatId, message }) => {
      return state.map(chat => {
        if (chat.chatId !== chatId) return chat;

        const isMessageExists = chat.messages.some(msg => msg.id === message.id);
        if (isMessageExists) return chat;

        return { ...chat, messages: [...chat.messages, message] };
      });
    }
  );

  useEffect(() => {
    const abortController = new AbortController();

    const fetchNotifcation = async () => {
      const notification = await receiveNotification(abortController);

      if (!notification) {
        if (!abortController.signal.aborted) {
          await fetchNotifcation();
        }
        return;
      }

      const { receiptId, idMessage, incomingChatId, chatName, text } = notification;

      setChats((prevChats: Chat[]) => {
        const existingChatIndex = prevChats.findIndex((chat: Chat) => chat.chatId === incomingChatId);

        const newMessage: Message = {
          id: idMessage || receiptId.toString(),
          text,
          sender: 'other',
        };

        if (existingChatIndex === -1) {
          return [...prevChats, { chatId: incomingChatId, chatName, messages: [newMessage] }];
        }

        const newChats = [...prevChats];
        const existingChat = newChats[existingChatIndex];

        const isMessageExists = existingChat.messages.some((message: Message) => message.id === newMessage.id);
        if (isMessageExists) return prevChats;

        newChats[existingChatIndex] = {
          ...existingChat,
          messages: [...existingChat.messages, newMessage]
        };

        return newChats;
      });

      if (!abortController.signal.aborted) {
        await fetchNotifcation();
      }
    };

    fetchNotifcation();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleCreateChatAction = async (formData: FormData) => {
    const newChatInput = formData.get('phone') as string;
    const formattedNumber = newChatInput.trim().replace(/\D/g, '');

    if (!isPhoneValid(formattedNumber)) {
      alert('Пожалуйста, введите корректный мобильный номер. Он должен начинаться с 79 и содержать 11 цифр (например, 79991234567)');
      return;
    }

    const contactInfo = await getContactInfo(formattedNumber);

    if (!contactInfo) {
      alert('Не удалось создать чат');
      return;
    }

    setChats((prevChats: Chat[]) => {
      const isChatExists = prevChats.some((chat: Chat) => chat.chatId === contactInfo.chatId);

      if (isChatExists) return prevChats;

      return [...prevChats, { chatId: contactInfo.chatId, chatName: contactInfo.chatName, messages: [] }];
    });
    setActiveChatId(contactInfo.chatId);
  };

  const handleSendMessageAction = async (chatId: string, text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'me',
    };

    addOptimisticMessage({ chatId, message });

    await sendMessage(chatId, text);

    setChats((prevChats: Chat[]) =>
      prevChats.map((chat: Chat) => {
        if (chat.chatId !== chatId) return chat;

        const isMessageExists = chat.messages.some(msg => msg.id === message.id);
        if (isMessageExists) return chat;

        return { ...chat, messages: [...chat.messages, message] };
      })
    );
  };

  const handleClickChat = ({ chatId }: { chatId: string }) => () => {
    setActiveChatId(chatId);
  };

  const activeChat = optimisticChats.find((chat: Chat) => chat.chatId === activeChatId);

  return (
    <div className={styles.chatApp}>
      <Sidebar
        chats={optimisticChats}
        activeChatId={activeChatId}
        onCreateChatAction={handleCreateChatAction}
        onClickChat={handleClickChat}
      />
      <ChatComponent activeChat={activeChat} onSendMessageAction={handleSendMessageAction} />
    </div>
  );
}
