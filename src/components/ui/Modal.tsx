import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);
  const titleId = title ? 'modal-title-' + Math.random().toString(36).substr(2, 9) : undefined;

  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusableSelectors = [
      'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])',
      'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed',
      '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
    ];
    const focusableEls = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelectors.join(',')))
      .filter(el => el.offsetParent !== null);
    if (focusableEls.length > 0) {
      firstFocusableRef.current = focusableEls[0];
      lastFocusableRef.current = focusableEls[focusableEls.length - 1];
      focusableEls[0].focus();
    } else {
      modal.focus();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        if (focusableEls.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            e.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            e.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
      {...(titleId ? { 'aria-labelledby': titleId } : {})}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative outline-none"
        ref={modalRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
          aria-label="Fermer la modale"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {title && <h2 id={titleId} className="text-xl font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}; 