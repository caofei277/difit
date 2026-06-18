import { RefreshCw } from 'lucide-react';
import { useT } from '../i18n';

interface ReloadButtonProps {
  shouldReload: boolean;
  isReloading: boolean;
  onReload: () => void;
  changeType?: 'file' | 'commit' | 'staging' | null;
  className?: string;
  compact?: boolean;
}

export function ReloadButton({
  shouldReload,
  isReloading,
  onReload,
  changeType,
  className = '',
  compact = false,
}: ReloadButtonProps) {
  const t = useT();

  if (!shouldReload) {
    return null;
  }

  const getChangeMessage = () => {
    switch (changeType) {
      case 'commit':
        return t('reloadButton.newCommits');
      case 'staging':
        return t('reloadButton.stagingChanges');
      case 'file':
        return t('reloadButton.fileChanges');
      default:
        return t('reloadButton.changesDetected');
    }
  };

  return (
    <button
      onClick={onReload}
      disabled={isReloading}
      className={`
        flex items-center gap-1.5 text-xs rounded-md border ${className} ${
          compact ? 'px-2 py-2' : 'px-3 py-1.5'
        }
        ${
          isReloading
            ? 'bg-github-text-primary text-github-bg-primary border-github-text-primary cursor-not-allowed'
            : 'bg-github-text-primary text-github-bg-primary border-github-text-primary'
        }
      `}
      title={t('reloadButton.clickToRefresh', { message: getChangeMessage() })}
      aria-label={compact ? t('reloadButton.refresh') : undefined}
    >
      <RefreshCw size={12} className={`${isReloading ? 'animate-spin' : ''}`} />
      {compact ? (
        <span className="sr-only">{t('reloadButton.refresh')}</span>
      ) : (
        t('reloadButton.refresh')
      )}
    </button>
  );
}
