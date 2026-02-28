#!/usr/bin/env node
// One-time script to generate AUTH_PASSWORD_HASH and AUTH_SECRET for .env / Vercel
// Usage: node scripts/generate-password-hash.mjs

import crypto from 'node:crypto';
import { createInterface } from 'node:readline';

function readPassword(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    if (process.stdin.isTTY) {
      process.stdout.write(prompt);
      process.stdin.setRawMode(true);
      let password = '';

      process.stdin.on('data', function onData(ch) {
        const char = ch.toString('utf8');
        if (char === '\r' || char === '\n') {
          process.stdin.setRawMode(false);
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(password);
        } else if (char === '\u0003') {
          process.stdout.write('\n');
          process.exit(1);
        } else if (char === '\u007f') {
          password = password.slice(0, -1);
        } else {
          password += char;
        }
      });
    } else {
      // Non-TTY fallback (piped input)
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

async function main() {
  console.log('=== Password Hash Generator ===\n');

  const password = await readPassword('Enter password: ');
  if (!password) {
    console.error('Error: password cannot be empty');
    process.exit(1);
  }

  const salt = crypto.randomBytes(16);
  const saltHex = salt.toString('hex');

  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  const hashHex = hash.toString('hex');

  const secret = crypto.randomBytes(32).toString('hex');

  console.log('\nAdd these to your .env.local or Vercel environment variables:\n');
  console.log(`AUTH_PASSWORD_HASH=${saltHex}.${hashHex}`);
  console.log(`AUTH_SECRET=${secret}`);
  console.log('\nAlso set AUTH_USERNAME=<your desired username>');
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
