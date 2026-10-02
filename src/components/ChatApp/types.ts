export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
}

export interface Chat {
  chatId: string;
  chatName: string;
  messages: Message[];
}
