import React, { useState } from 'react';
import { useGenericDataList } from '../../../hooks/useGenericData';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { GenericData, PaginatedGenericDataResponse } from '../../../types/generic-data';

const PAGE_SIZE = 10;

interface GenericDataSerialized extends Omit<GenericData, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export const DataList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useGenericDataList({ page, limit: PAGE_SIZE }) as {
    data: (Omit<PaginatedGenericDataResponse, 'items'> & { items: GenericDataSerialized[] }) | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
    isFetching: boolean;
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => {
    if (data?.hasMore) setPage((p) => p + 1);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des données…</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        Erreur lors du chargement des données.<br />
        <Button variant="secondary" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune donnée à afficher.</div>;
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item: GenericDataSerialized) => (
          <Card key={item.id} header={item.title}>
            <div className="text-sm text-gray-600 mb-2">{item.status}</div>
            <div className="mb-2">{item.description}</div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-xs px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              Créé par {item.createdBy} le {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <Button onClick={handlePrev} disabled={page === 1 || isFetching} variant="secondary">
          Précédent
        </Button>
        <span className="text-sm text-gray-700">
          Page {data.page} / {Math.ceil(data.total / data.limit)}
        </span>
        <Button onClick={handleNext} disabled={!data.hasMore || isFetching} variant="secondary">
          Suivant
        </Button>
      </div>
    </div>
  );
}; 