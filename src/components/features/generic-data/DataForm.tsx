import React, { useState } from 'react';
import { z } from 'zod';
import { createGenericDataSchema, updateGenericDataSchema } from '../../../validation/generic-data';
import { GenericData, CreateGenericDataDTO, UpdateGenericDataDTO, GenericDataStatus } from '../../../types/generic-data';
import { useCreateGenericData, useUpdateGenericData } from '../../../hooks/useGenericData';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

export type DataFormValues = z.infer<typeof createGenericDataSchema>;

interface DataFormProps {
  initialData?: GenericData;
  onSuccess?: (data: GenericData) => void;
  onCancel?: () => void;
  hideTitle?: boolean;
  actionToken?: string | null;
}

const statusOptions = Object.values(GenericDataStatus);

export const DataForm: React.FC<DataFormProps> = ({ initialData, onSuccess, onCancel, hideTitle = false, actionToken }) => {
  const isEdit = Boolean(initialData);
  const [values, setValues] = useState<DataFormValues>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    status: initialData?.status || undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DataFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = useCreateGenericData();
  const updateMutation = useUpdateGenericData();

  const loading = createMutation.isPending || updateMutation.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) }));
  };

  const validate = () => {
    const schema = isEdit ? updateGenericDataSchema : createGenericDataSchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DataFormValues, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof DataFormValues] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    try {
      if (isEdit && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: values as UpdateGenericDataDTO });
        if (onSuccess) onSuccess({ ...initialData, ...values });
      } else {
        const created = await createMutation.mutateAsync({ data: values as CreateGenericDataDTO, actionToken });
        if (onSuccess) onSuccess(created);
      }
    } catch (err: any) {
      setFormError(err?.message || 'Erreur lors de la soumission du formulaire.');
    }
  };

  return (
    <Card
      header={hideTitle ? undefined : (isEdit ? 'Modifier la donnée' : 'Créer une donnée')}
      className="max-w-lg mx-auto"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-1">Titre *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={values.title}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            className="w-full border rounded px-3 py-2"
            value={values.description || ''}
            onChange={handleChange}
            disabled={loading}
            rows={3}
          />
          {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block font-medium mb-1">Tags (séparés par des virgules)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={values.tags?.join(', ') || ''}
            onChange={handleTagsChange}
            disabled={loading}
            placeholder="ex: projet, urgent, client"
          />
          {errors.tags && <div className="text-red-600 text-sm mt-1">{errors.tags}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block font-medium mb-1">Statut</label>
          <select
            id="status"
            name="status"
            className="w-full border rounded px-3 py-2"
            value={values.status || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">-- Sélectionner --</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && <div className="text-red-600 text-sm mt-1">{errors.status}</div>}
        </div>
        {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
        <div className="flex gap-2 justify-end mt-6">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              Annuler
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Card>
  );
}; 