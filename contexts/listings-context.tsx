import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

import { rentalListings, type RentalListing } from "@/data/rentals";
import { fetchJson } from "@/services/api";

type ListingsContextValue = {
  listings: RentalListing[];
  addListing: (listing: Omit<RentalListing, "id" | "status">) => Promise<void>;
  editListing: (id: string, listing: Partial<RentalListing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  getUserListings: (email: string) => RentalListing[];
};

const ListingsContext = createContext<ListingsContextValue | undefined>(
  undefined,
);
const STORAGE_KEY = "listings_data";

export function ListingsProvider({ children }: PropsWithChildren) {
  const [listings, setListings] = useState<RentalListing[]>(rentalListings);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const backendListings =
          await fetchJson<RentalListing[]>("/api/listings");
        setListings(backendListings);
      } catch {
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
      }
    };

    void loadListings();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listings)).catch(() => {
      // ignore write failures silently
    });
  }, [listings]);

  const addListing = async (listing: Omit<RentalListing, "id" | "status">) => {
    const newListing = {
      ...listing,
      status: "available" as const,
    };

    try {
      const created = await fetchJson<RentalListing>("/api/listings", {
        method: "POST",
        body: JSON.stringify(newListing),
      });
      setListings((prev) => [created, ...prev]);
    } catch {
      setListings((prev) => [
        {
          ...newListing,
          id: `room-${Date.now()}`,
        },
        ...prev,
      ]);
    }
  };

  const editListing = async (id: string, updates: Partial<RentalListing>) => {
    try {
      const updated = await fetchJson<RentalListing>(`/api/listings/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      setListings((prev) =>
        prev.map((listing) => (listing.id === id ? updated : listing)),
      );
    } catch {
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id ? { ...listing, ...updates } : listing,
        ),
      );
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await fetchJson<void>(`/api/listings/${id}`, { method: "DELETE" });
    } catch {
      // if backend delete fails, still remove locally
    }
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  const getUserListings = (email: string) => {
    return listings.filter((listing) => listing.ownerEmail === email);
  };

  const value = useMemo(
    () => ({
      listings,
      addListing,
      editListing,
      deleteListing,
      getUserListings,
    }),
    [listings],
  );

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used within ListingsProvider");
  }
  return context;
}
