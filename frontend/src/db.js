import { openDB } from 'idb';

const dbPromise = openDB('respriz-db', 1, {
    upgrade(db) {
        db.createObjectStore('costs', {
            keyPath: 'id',
            autoIncrement: true,
        });
    },
});

export async function addCost(data) {
    const db = await dbPromise;
    const id = await db.add('costs', data);
    return Number(id); // Cast to number
}

export async function getCosts() {
    const db = await dbPromise;
    return await db.getAll('costs');
}

export async function deleteCost(id) {
    const db = await dbPromise;
    await db.delete('costs', id);
}
