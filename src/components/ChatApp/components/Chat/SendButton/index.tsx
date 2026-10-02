import { useFormStatus } from 'react-dom';

import styles from './index.module.css';


function SendButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={styles.sendButton} disabled={pending}>
            {pending ? 'Отправка...' : 'Отправить'}
        </button>
    );
}

export default SendButton;