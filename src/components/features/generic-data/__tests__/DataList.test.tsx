import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataList } from '../DataList';

jest.mock('../../../../hooks/useGenericData', () => ({
  useGenericDataList: jest.fn(),
}));
import { useGenericDataList } from '../../../../hooks/useGenericData';

const mockedUseGenericDataList = useGenericDataList as jest.Mock;

describe('DataList', () => {
  const refetch = jest.fn();
  const baseData = {
    items: [
      {
        id: 'id1',
        title: 'Title',
        description: 'Description',
        status: 'active',
        tags: ['tag1'],
        createdBy: 'user',
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date('2023-01-02').toISOString(),
      },
    ],
    page: 1,
    total: 1,
    limit: 10,
    hasMore: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading', () => {
    mockedUseGenericDataList.mockReturnValue({ isLoading: true });
    render(<DataList />);
    expect(screen.getByText(/chargement des données/i)).toBeInTheDocument();
  });

  it('renders error and allows retry', () => {
    mockedUseGenericDataList.mockReturnValue({ isError: true, refetch });
    render(<DataList />);
    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it('renders empty state', () => {
    mockedUseGenericDataList.mockReturnValue({ data: { ...baseData, items: [] }, isLoading: false, isError: false });
    render(<DataList />);
    expect(screen.getByText(/aucune donnée à afficher/i)).toBeInTheDocument();
  });

  it('renders data and pagination', () => {
    mockedUseGenericDataList.mockReturnValue({ data: baseData, isLoading: false, isError: false, isFetching: false });
    render(<DataList />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /précédent/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /suivant/i })).toBeDisabled();
    expect(screen.getByText(/page 1/i)).toBeInTheDocument();
  });
}); 