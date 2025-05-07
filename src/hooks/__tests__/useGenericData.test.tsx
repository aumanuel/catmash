import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenericData } from '../useGenericData';

jest.mock('../../services/client/generic-data', () => ({
  getGenericDataById: jest.fn(),
}));

import { getGenericDataById } from '../../services/client/generic-data';

describe('useGenericData', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  it('fetches and returns generic data by id', async () => {
    const mockData = { id: '123', name: 'Test' };
    (getGenericDataById as jest.Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGenericData('123'), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('does not fetch if id is falsy', () => {
    const { result } = renderHook(() => useGenericData(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
}); 