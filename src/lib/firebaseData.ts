import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Event {
  id: string;
  date: string;
  time?: string;
  endTime?: string;
  team: string;
  status: 'reserved' | 'in-use' | 'completed';
  participants?: string;
  target?: string;
  shots?: number;
  notes?: string;
  tempMembers?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TeamMember {
  id: string;
  name: string;
  studentId: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  color?: {
    bg: string;
    border: string;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error getting events: ', error);
    return [];
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, 'events', id);
    const docSnap = await getDoc(eventRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Event;
    }
    return null;
  } catch (error) {
    console.error('Error getting event: ', error);
    return null;
  }
};

export const addEvent = async (event: Omit<Event, 'id'> & { id?: string }): Promise<Event | null> => {
  try {
    const eventsRef = collection(db, 'events');
    const newEvent = {
      ...event,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    let docRef;
    
    if (event.id) {
      docRef = doc(db, 'events', event.id);
      await setDoc(docRef, newEvent);
      return {
        ...newEvent,
        id: event.id
      } as Event;
    } else {
      docRef = await addDoc(eventsRef, newEvent);
      return {
        ...newEvent,
        id: docRef.id
      } as Event;
    }
  } catch (error) {
    console.error('Error adding event: ', error);
    return null;
  }
};

export const updateEvent = async (event: Event): Promise<Event | null> => {
  try {
    const { id, ...rest } = event;
    const eventRef = doc(db, 'events', id);
    
    try {
      await updateDoc(eventRef, {
        ...rest,
        updatedAt: serverTimestamp()
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'not-found') {
        console.log('Document not found, creating new one with ID:', id);
        
        await setDoc(eventRef, {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        throw error;
      }
    }
    
    const updatedDocSnap = await getDoc(eventRef);
    if (updatedDocSnap.exists()) {
      return {
        id,
        ...updatedDocSnap.data()
      } as Event;
    }
    
    return event;
  } catch (error) {
    console.error('Error updating event: ', error);
    return null;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error('Error deleting event: ', error);
    return false;
  }
};

export const getTeams = async (): Promise<Team[]> => {
  try {
    const teamsRef = collection(db, 'teams');
    const snapshot = await getDocs(teamsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Team));
  } catch (error) {
    console.error('Error getting teams: ', error);
    return [];
  }
};

export const getTeamById = async (id: string): Promise<Team | null> => {
  try {
    const teamRef = doc(db, 'teams', id);
    const docSnap = await getDoc(teamRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Team;
    }
    return null;
  } catch (error) {
    console.error('Error getting team: ', error);
    return null;
  }
};

export const getTeamByName = async (name: string): Promise<Team | null> => {
  try {
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('name', '==', name));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Team;
    }
    return null;
  } catch (error) {
    console.error('Error getting team by name: ', error);
    return null;
  }
};

export const addTeam = async (team: Omit<Team, 'id'>): Promise<Team | null> => {
  try {
    const teamsRef = collection(db, 'teams');
    const newTeam = {
      ...team,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(teamsRef, newTeam);
    return {
      id: docRef.id,
      ...newTeam
    } as Team;
  } catch (error) {
    console.error('Error adding team: ', error);
    return null;
  }
};

export const updateTeam = async (team: Team): Promise<Team | null> => {
  try {
    const { id, ...rest } = team;
    const teamRef = doc(db, 'teams', id);
    
    await updateDoc(teamRef, {
      ...rest,
      updatedAt: serverTimestamp()
    });
    
    return team;
  } catch (error) {
    console.error('Error updating team: ', error);
    return null;
  }
};

export const deleteTeam = async (id: string): Promise<boolean> => {
  try {
    const teamRef = doc(db, 'teams', id);
    await deleteDoc(teamRef);
    return true;
  } catch (error) {
    console.error('Error deleting team: ', error);
    return false;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
}; 