import { collection, addDoc, updateDoc, doc, setDoc, getDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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

// delete document
export async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { error: error.message, success: false };
  }
}

// Get a collection of documents
export async function getCollection(collectionPath, options = {}) {
  try {
    const collectionRef = collection(db, collectionPath);
    
    // Build query with options
    let q = collectionRef;
    
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'desc'));
    }
    
    if (options.where) {
      options.where.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }
    
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
    
    const documents = [];
    querySnapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { data: documents, success: true };
  } catch (error) {
    console.error('Error getting collection:', error);
    return { error: error.message, success: false };
  }
}

// This function specifically gets comments for a post
export async function getComments(postId, limit = 50) {
  return getCollection(`posts/${postId}/comments`, {
    orderBy: { field: 'createdAt', direction: 'desc' },
    limit: limit
  });
}

// This function checks if a user has liked a post
export async function checkPostLike(postId, userId) {
  try {
    const result = await getDocument(`posts/${postId}/likes`, userId);
    return { 
      isLiked: result.success && result.data?.liked,
      success: true 
    };
  } catch (error) {
    console.error('Error checking post like:', error);
    return { error: error.message, success: false };
  }
}