// stdin keeps the Google token out of process arguments, URLs and logs.
import { verifyGoogleIdentity } from '../node/google-identity.mjs';
const deadline = setTimeout(() => process.exit(1), 12000);
try {
  let input = '';
  for await (const part of process.stdin) {
    input += part;
    if (input.length > 16000) throw Error('Too large');
  }
  const { credential, clientId, nonce } = JSON.parse(input);
  const identity = await verifyGoogleIdentity(credential, clientId, nonce);
  process.stdout.write(JSON.stringify(identity));
} catch { process.exitCode = 1; }
finally { clearTimeout(deadline); }
