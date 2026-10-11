// stdin keeps the Microsoft token out of process arguments, URLs and logs.
import { verifyMicrosoftIdentity } from '../node/microsoft-identity.mjs';
const deadline = setTimeout(() => process.exit(1), 12000);
try {
  let input = '';
  for await (const part of process.stdin) {
    input += part;
    if (input.length > 16000) throw Error('Too large');
  }
  const { credential, clientId, nonce } = JSON.parse(input);
  const identity = await verifyMicrosoftIdentity(credential, clientId, nonce);
  process.stdout.write(JSON.stringify(identity));
} catch (error) {
  const reason = typeof error.code === 'string' && /^ERR_[A-Z_]+$/.test(error.code) ? error.code :
    error.message === 'Invalid signing key issuer' ? 'SIGNING_KEY_ISSUER' : 'INVALID_IDENTITY';
  process.stderr.write(reason); process.exitCode = 1;
}
finally { clearTimeout(deadline); }
