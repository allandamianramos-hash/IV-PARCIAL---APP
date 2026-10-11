import { PublicClientApplication } from '@azure/msal-browser';

window.RumboMicrosoft = {
  async create(clientId) {
    const client = new PublicClientApplication({
      auth: { clientId, authority: 'https://login.microsoftonline.com/common',
        redirectUri: location.origin + '/microsoft-callback.html' },
      cache: { cacheLocation: 'sessionStorage' },
      system: { loggerOptions: { piiLoggingEnabled: false, loggerCallback() {} } },
    });
    await client.initialize();
    return client;
  },
};
