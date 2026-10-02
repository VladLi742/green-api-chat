import { getAuthCredentials } from "../../../utils/auth";


export default async function receiveNotification(abortController: AbortController) {
    const DEFAULT_POLL_DELAY_MILLISECONDS = 2000;
    const ERROR_POLL_DELAY_MILLISECONDS = 5000;

    try {
        const { idInstance, apiTokenInstance } = getAuthCredentials();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`, {
            signal: abortController.signal
        });

        if (!response.ok) {
            await sleep({ milliseconds: ERROR_POLL_DELAY_MILLISECONDS });
            return receiveNotification(abortController);
        }

        const data = await response.json();

        if (!data || !data.receiptId) {
            await sleep({ milliseconds: DEFAULT_POLL_DELAY_MILLISECONDS });
            return receiveNotification(abortController);
        }

        const { receiptId, body } = data;

        await deleteNotification(receiptId, abortController);

        const isIncomingTextMessage = body.typeWebhook === 'incomingMessageReceived' && body.messageData?.typeMessage === 'textMessage';
        if (!isIncomingTextMessage) throw new Error('Получено не текстовое сообщение');

        return {
            idMessage: body.idMessage,
            receiptId,
            incomingChatId: body.senderData.chatId,
            chatName: body.senderData.chatName || body.senderData.senderName || body.senderData.chatId,
            text: body.messageData.textMessageData.textMessage,
        };
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('Отменено получение уведомления');
            return;
        }

        console.error('Ошибка при получении уведомления:', error);
        await sleep({ milliseconds: ERROR_POLL_DELAY_MILLISECONDS });
    }
}

function sleep({ milliseconds }: { milliseconds: number }) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function deleteNotification(receiptId: string, abortController: AbortController) {
    const { idInstance, apiTokenInstance } = getAuthCredentials();

    await fetch(`${import.meta.env.VITE_API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`, {
        method: 'DELETE',
        signal: abortController.signal
    });
}