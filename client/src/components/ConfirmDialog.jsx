import { useEffect } from 'react';

/**
 * Reusable confirmation dialog for destructive actions (delete, reject...).
 * Renders above any open modal (z-[300]) and only runs onConfirm after the
 * user explicitly verifies their intent. Escape or clicking the backdrop cancels.
 */
const ConfirmDialog = ({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[300] p-6"
      onClick={onCancel}>
      <div className="bg-bg-card border border-border rounded-xl w-full max-w-sm shadow-[var(--shadow-modal)] animate-modal-in"
        onClick={(e) => e.stopPropagation()}>

        <div className="px-6 pt-6 pb-1 flex flex-col items-center text-center gap-3">
          <div className="w-11 h-11 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
          <p className="text-[13px] text-text-muted leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-2.5 p-6 pt-4">
          <button type="button" onClick={onCancel}
            className="flex-1 py-2.5 bg-bg-input text-text-muted border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-bg-hover hover:text-text-primary transition-all font-sans">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} autoFocus
            className="flex-1 py-2.5 bg-danger/10 text-danger border border-danger/30 rounded-lg text-sm font-semibold cursor-pointer hover:bg-danger/20 transition-all font-sans">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
