import { firestore } from '../Services/firebase-config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface Cost {
    id?: string; // Use string for Firestore document IDs
    restaurant: string;
    price: number;
    date: string;
    location: string;
}

const costsCollection = collection(firestore, 'costs');

export async function addCost(data: Cost): Promise<string> {
    const docRef = await addDoc(costsCollection, data);
    return docRef.id; // Return the Firestore document ID
}

export async function getCosts(): Promise<Cost[]> {
    const snapshot = await getDocs(costsCollection);
    const costs: Cost[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Cost
    }));
    return costs;
}

export async function deleteCost(id: string): Promise<void> {
    const docRef = doc(firestore, 'costs', id);
    await deleteDoc(docRef);
}

// Update Cost
export async function updateCost(id: string, data: Partial<Cost>): Promise<void> {
    const docRef = doc(firestore, 'costs', id);
    // Ensure only fields to be updated are included
    const updateData: { [key: string]: any } = {};
    
    if (data.restaurant !== undefined) updateData.restaurant = data.restaurant;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.location !== undefined) updateData.location = data.location;

    await updateDoc(docRef, updateData);
}
