import { useFormStatus } from "react-dom";

import styles from './index.module.css';


export default function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={styles.submitButton} disabled={pending}>
            {pending ? '...' : '+'}
        </button>
    );
}