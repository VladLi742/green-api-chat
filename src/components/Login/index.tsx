import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { ReactElement } from 'react';

import styles from './index.module.css';
import { LoginProps } from './types';
import { setAuthCredentials } from '../../utils/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.button} type="submit" disabled={pending}>
      {pending ? 'Проверка...' : 'Войти'}
    </button>
  );
}

export function Login({ onLogin }: LoginProps): ReactElement {
  const [error, action] = useActionState(async (_prevState: any, formData: FormData) => {
    const idInstance = formData.get('idInstance') as string;
    const apiTokenInstance = formData.get('apiTokenInstance') as string;

    if (!idInstance?.trim() || !apiTokenInstance?.trim()) {
      return 'Заполните все поля';
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/waInstance${idInstance.trim()}/getStateInstance/${apiTokenInstance.trim()}`
      );

      if (!response.ok) {
        return 'Неверные учетные данные. Проверьте idInstance и apiTokenInstance.';
      }

      setAuthCredentials({
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      });
      onLogin();
      return null;
    } catch (e) {
      console.error('Ошибка авторизации:', e);
      return 'Ошибка сети. Проверьте подключение к интернету.';
    }
  }, null);

  return (
    <div className={styles.login}>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} action={action}>
        <h2 className={styles.title}>Вход</h2>

        <input
          name="idInstance"
          className={styles.input}
          type="text"
          placeholder="idInstance"
          required
        />
        <input
          name="apiTokenInstance"
          className={styles.input}
          type="password"
          placeholder="apiTokenInstance"
          required
        />
        <SubmitButton />
      </form>
    </div>
  );
}
