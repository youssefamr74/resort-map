import { useState, useEffect, useCallback } from 'react';
import { getMap } from '../api/client';
import type { ResortMapResponse, Cabana } from '../types/resortMap';

interface UseResortMapResult {
  map: ResortMapResponse | null;
  loading: boolean;
  error: string | null;
  markCabanaBooked: (cabanaId: string) => void;
}

export function useResortMap(): UseResortMapResult {
  const [map, setMap] = useState<ResortMapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMap()
      .then((data) => setMap(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const markCabanaBooked = useCallback((cabanaId: string) => {
    setMap((prev) => {
      if (!prev) return prev;

      const updatedCabanas: Cabana[] = prev.cabanas.map((c) =>
        c.id === cabanaId ? { ...c, status: 'booked' } : c
      );

      return { ...prev, cabanas: updatedCabanas };
    });
  }, []);

  return { map, loading, error, markCabanaBooked };
}