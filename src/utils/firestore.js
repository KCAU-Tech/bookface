import { collection, addDoc, updateDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Add a new document to a collection
export async function addDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error adding document:', error);
    return { error: error.message, success: false };
  }
}

// Add a document with a specific ID
export async function setDocument(collectionName, docId, data) {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error setting document:', error);
    return { error: error.message, success: false };
  }
}

// Update an existing document
export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating document:', error);
    return { error: error.message, success: false };
  }
}

// get a document
export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), success: true };
    } else {
      return { success: false, error: 'Document not found' };
    }
  } catch (error) {
    console.error('Error getting document:', error);
    return { error: error.message, success: false };
  }
}