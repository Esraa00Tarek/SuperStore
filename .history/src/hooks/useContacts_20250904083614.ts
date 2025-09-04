import { useState, useEffect, useCallback } from 'react';
import { contactsCollection } from '@/services/firebaseService';

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'in-progress' | 'resolved';
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactsCollection.getAll();
      setContacts(data as Contact[]);
    } catch (err) {
      setError('Failed To Fetch Contacts');
      console.error('Error Fetching Contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'status'>) => {
    try {
      const added = await contactsCollection.add({
        ...contact,
        createdAt: new Date().toISOString(),
        status: 'new' as const
      });
      // Ensure all Contact fields are present
      const newContact: Contact = {
        id: added.id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: new Date(added.createdAt ?? new Date().toISOString()),
        status: added.status ?? 'new'
      };
      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (err) {
      setError('Failed To Add Contact');
      console.error('Error Adding Contact:', err);
      throw err;
    }
  };

  const updateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      await contactsCollection.update(id, { status });
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        )
      );
    } catch (err) {
      setError('Failed to update contact status');
      console.error('Error updating contact status:', err);
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await contactsCollection.delete(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (err) {
      setError('Failed to delete contact');
      console.error('Error deleting contact:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContactStatus,
    deleteContact,
    refetch: fetchContacts
  };
};
