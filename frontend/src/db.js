
import { openDB } from 'idb';

const dbPromise = openDB('respriz-db', 1, {
    upgrade(db) {
        // Create a store for storing restaurant cost data
        db.createObjectStore('costs', {
            keyPath: 'id',
            autoIncrement: true,
        });
    },
});

export async function addCost(data) {
    const db = await dbPromise;
    await db.add('costs', data);
}

export async function getCosts() {
    const db = await dbPromise;
    return await db.getAll('costs');
}

export async function deleteCost(id) {
    const db = await dbPromise;
    await db.delete('costs', id);
}

export async function updateCost(id, data) {
    const db = await dbPromise;
    await db.put('costs', { ...data, id });
}
