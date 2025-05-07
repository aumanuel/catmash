import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataForm } from '../DataForm';
import { GenericData, GenericDataStatus } from '../../../../types/generic-data';

jest.mock('../../../../hooks/useGenericData', () => ({
  useCreateGenericData: jest.fn(),
  useUpdateGenericData: jest.fn(),
}));

const useGenericData = require('../../../../hooks/useGenericData');

const baseData: GenericData = {
  id: '1',
  title: 'Titre',
  description: 'Desc',
  tags: ['a', 'b'],
  status: GenericDataStatus.ACTIVE,
  createdAt: { toDate: () => new Date(), toMillis: () => 0 } as any,
  updatedAt: { toDate: () => new Date(), toMillis: () => 0 } as any,
  createdBy: 'user',
};

describe('DataForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('submits valid data (create)', async () => {
    const mutateAsync = jest.fn().mockResolvedValue({ ...baseData, id: '2' });
    useGenericData.useCreateGenericData.mockImplementation(() => ({ mutateAsync, isPending: false }));
    useGenericData.useUpdateGenericData.mockImplementation(() => ({ mutateAsync: jest.fn(), isPending: false }));
    const onSuccess = jest.fn();
    const { container } = render(<DataForm onSuccess={onSuccess} />);
    await userEvent.type(screen.getByLabelText(/titre/i), 'Test');
    const form = container.querySelector('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);
    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows required field error', async () => {
    useGenericData.useCreateGenericData.mockImplementation(() => ({ mutateAsync: jest.fn(), isPending: false }));
    useGenericData.useUpdateGenericData.mockImplementation(() => ({ mutateAsync: jest.fn(), isPending: false }));
    const { container } = render(<DataForm />);
    const form = container.querySelector('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);
    expect(await screen.findByText(/Le titre est requis/i)).toBeInTheDocument();
  });

  it('submits valid data (edit)', async () => {
    const mutateAsync = jest.fn().mockResolvedValue(baseData);
    useGenericData.useCreateGenericData.mockImplementation(() => ({ mutateAsync: jest.fn(), isPending: false }));
    useGenericData.useUpdateGenericData.mockImplementation(() => ({ mutateAsync, isPending: false }));
    const onSuccess = jest.fn();
    const { container } = render(<DataForm initialData={baseData} onSuccess={onSuccess} />);
    await userEvent.clear(screen.getByLabelText(/titre/i));
    await userEvent.type(screen.getByLabelText(/titre/i), 'Modif');
    const form = container.querySelector('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);
    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalled();
  });

  it('disables submit when loading', () => {
    useGenericData.useCreateGenericData.mockImplementation(() => ({ mutateAsync: jest.fn(), isPending: true }));
    useGenericData.useUpdateGenericData.mockImplementation(() => ({ mutateAsync: jest.fn(), isPending: false }));
    render(<DataForm />);
    expect(screen.getByRole('button', { name: /créer/i })).toBeDisabled();
  });

  it('shows mutation error', async () => {
    const mutateAsync = jest.fn().mockRejectedValue(new Error('fail'));
    useGenericData.useCreateGenericData.mockImplementation(() => ({ mutateAsync, isPending: false }));
    useGenericData.useUpdateGenericData.mockImplementation(() => ({ mutateAsync: jest.fn(), isPending: false }));
    const { container } = render(<DataForm />);
    await userEvent.type(screen.getByLabelText(/titre/i), 'Test');
    const form = container.querySelector('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);
    expect(await screen.findByText(/fail/i)).toBeInTheDocument();
  });
}); 