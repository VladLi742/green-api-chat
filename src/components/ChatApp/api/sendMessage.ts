import { getAuthCredentials } from "../../../utils/auth";


export default async function sendMessage(chatId: string, text: string) {
    const { idInstance, apiTokenInstance } = getAuthCredentials();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message: text }),
    });

    if (!response.ok) throw new Error('Не удалось отправить сообщение');
}