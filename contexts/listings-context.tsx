import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { rentalListings, type RentalListing } from '@/data/rentals';

type ListingsContextValue = {
  listings: RentalListing[];
  addListing: (listing: Omit<RentalListing, 'id'>) => void;
  editListing: (id: string, listing: Partial<RentalListing>) => void;
  deleteListing: (id: string) => void;
  getUserListings: (email: string) => RentalListing[];
};

const ListingsContext = createContext<ListingsContextValue | undefined>(undefined);
const STORAGE_KEY = 'listings_data';

export function ListingsProvider({ children }: PropsWithChildren) {
  const [listings, setListings] = useState<RentalListing[]>(rentalListings);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved) as RentalListing[];
        setListings(parsed);
      })
      .catch(() => {
        setListings(rentalListings);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listings)).catch(() => {
      // ignore write failures silently
    });
  }, [listings]);

  const addListing = (listing: Omit<RentalListing, 'id'>) => {
    setListings((prev) => [
      {
        ...listing,
        id: `room-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const editListing = (id: string, updates: Partial<RentalListing>) => {
    setListings((prev) =>
      prev.map((listing) => (listing.id === id ? { ...listing, ...updates } : listing)),
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  const getUserListings = (email: string) => {
    return listings.filter((listing) => listing.ownerEmail === email);
  };

  const value = useMemo(() => ({ listings, addListing, editListing, deleteListing, getUserListings }), [listings]);

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within ListingsProvider');
  }
  return context;
}
