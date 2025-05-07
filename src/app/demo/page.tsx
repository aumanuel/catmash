"use client";
import React, { useState } from 'react';
import { DataForm } from '../../components/features/generic-data/DataForm';
import { DataList } from '../../components/features/generic-data/DataList';
import { Modal } from '../../components/ui/Modal';
import { useAuthorizeActionToken } from '../../hooks/useAuthorizeActionToken';

export default function DemoPage() {
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const {
    token: actionToken,
    loading: tokenLoading,
    error: tokenError,
    requestToken,
  } = useAuthorizeActionToken();

  React.useEffect(() => {
    if (isModalOpen) {
      requestToken('create');
    }
  }, [isModalOpen, requestToken]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSuccess(true);
    setFormKey((k) => k + 1);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-semibold text-center mb-2 tracking-tight text-gray-900">Données Génériques</h1>
        <p className="text-lg text-center text-gray-500 mb-10">Gérez et visualisez vos données dans une interface moderne et épurée.</p>
        <div className="flex flex-col items-center mb-8">
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-center shadow-sm transition-all">
              Donnée créée avec succès !
            </div>
          )}
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-medium transition mb-2"
            onClick={() => setIsModalOpen(true)}
          >
            Créer une donnée
          </button>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer une donnée">
          {/* Affiche un loader ou une erreur si besoin */}
          {tokenLoading ? (
            <div className="py-8 text-center text-gray-500">Autorisation en cours…</div>
          ) : tokenError ? (
            <div className="py-8 text-center text-red-600">Erreur d'autorisation : {tokenError}</div>
          ) : (
            <DataForm key={formKey} onSuccess={handleSuccess} hideTitle={true} actionToken={actionToken} />
          )}
        </Modal>
        <div className="mt-8">
          <DataList />
        </div>
      </div>
    </div>
  );
} 