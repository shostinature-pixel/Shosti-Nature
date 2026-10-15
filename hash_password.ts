
import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'shosti2026';
const saltRounds = 12;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log(`Hash: ${hash}`);
});
