
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, 'data/store.json');

const store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

if (store.adminPasswordHash && !store.admins) {
    store.admins = [
        {
            email: 'admin@shostinature.com',
            passwordHash: store.adminPasswordHash
        }
    ];
    delete store.adminPasswordHash;
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
    console.log('Successfully migrated to admins array.');
} else {
    console.log('Already migrated or no password hash found.');
}
