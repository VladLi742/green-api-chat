const authCredentials = {
  idInstance: '',
  apiTokenInstance: ''
};

export function setAuthCredentials({ idInstance, apiTokenInstance }: { idInstance: string, apiTokenInstance: string }) {
  authCredentials.idInstance = idInstance;
  authCredentials.apiTokenInstance = apiTokenInstance;

  return authCredentials;
}

export function getAuthCredentials() {
  return authCredentials;
}

export function hasAuthCredentials() {
  return Boolean(authCredentials.idInstance && authCredentials.apiTokenInstance);
}
