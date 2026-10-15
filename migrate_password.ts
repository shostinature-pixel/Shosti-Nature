
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, 'data/store.json');

const store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

if (store.adminPassword && !store.adminPasswordHash) {
    const saltRounds = 12;
    const hash = bcrypt.hashSync(store.adminPassword, saltRounds);
    store.adminPasswordHash = hash;
    delete store.adminPassword;
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
    console.log('Successfully migrated password to hash.');
} else {
    console.log('Already migrated or no password found.');
}
