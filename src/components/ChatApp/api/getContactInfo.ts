import { getAuthCredentials } from "../../../utils/auth";

export default async function getContactInfo(formattedNumber: string) {
    try {
        const { idInstance, apiTokenInstance } = getAuthCredentials();
        const hasSymbol = formattedNumber.includes('@');

        if (!hasSymbol) {
            formattedNumber = formattedNumber + '@c.us';
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/waInstance${idInstance}/getContactInfo/${apiTokenInstance}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: formattedNumber })
        });

        if (!response.ok) throw new Error('Не удалось получить информацию о контакте');

        const data = await response.json() as { chatId: string, name: string };

        return {
            chatId: data?.chatId ?? formattedNumber,
            chatName: data?.name ?? formattedNumber.split('@')[0],
        };
    } catch (error) {
        console.error('Не удалось получить информацию о контакте:', error);
    }
}