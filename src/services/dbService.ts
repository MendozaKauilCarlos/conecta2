import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  Timestamp,
  type DocumentData
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getTemplates = async () => {
  const path = 'templates';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const getTemplate = async (templateId: string) => {
  const path = `templates/${templateId}`;
  try {
    const docSnap = await getDoc(doc(db, "templates", templateId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const submitDocument = async (templateId: string, data: any) => {
  const path = 'submissions';
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    const submissionId = `${auth.currentUser.uid}_${templateId}_${Date.now()}`;
    await setDoc(doc(db, "submissions", submissionId), {
      userId: auth.currentUser.uid,
      templateId,
      data,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return submissionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getUserSubmissions = async () => {
  const path = 'submissions';
  try {
    if (!auth.currentUser) return [];
    const q = query(collection(db, "submissions"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const syncUserProfile = async (userData: any) => {
  const path = `users/${auth.currentUser?.uid}`;
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...userData,
        email: auth.currentUser.email,
        role: 'student',
        updatedAt: Timestamp.now()
      });
    } else {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};
