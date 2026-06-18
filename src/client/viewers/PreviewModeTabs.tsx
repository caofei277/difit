import { Eye, FileDiff } from 'lucide-react';
import { useT } from '../i18n';

export type PreviewMode = 'diff' | 'diff-preview' | 'full-preview';

type PreviewModeTabsProps = {
  mode: PreviewMode;
  hasFullPreview: boolean;
  onModeChange: (mode: PreviewMode) => void;
};

export const PreviewModeTabs = ({ mode, hasFullPreview, onModeChange }: PreviewModeTabsProps) => {
  const t = useT();

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onModeChange('diff')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
          mode === 'diff'
            ? 'text-github-text-primary'
            : 'text-github-text-secondary hover:text-github-text-primary'
        }`}
        title={t('previewModeTabs.codeDiff')}
      >
        <FileDiff size={14} />
        {t('previewModeTabs.diff')}
      </button>
      <button
        onClick={() => onModeChange('diff-preview')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
          mode === 'diff-preview'
            ? 'text-github-text-primary'
            : 'text-github-text-secondary hover:text-github-text-primary'
        }`}
        title={t('previewModeTabs.diffPreview')}
      >
        <Eye size={14} />
        {t('previewModeTabs.diffPreview')}
      </button>
      {hasFullPreview && (
        <button
          onClick={() => onModeChange('full-preview')}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
            mode === 'full-preview'
              ? 'text-github-text-primary'
              : 'text-github-text-secondary hover:text-github-text-primary'
          }`}
          title={t('previewModeTabs.fullPreview')}
        >
          <Eye size={14} />
          {t('previewModeTabs.fullPreview')}
        </button>
      )}
    </div>
  );
};
