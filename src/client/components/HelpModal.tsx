import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useHotkeys, useHotkeysContext } from 'react-hotkeys-hook';
import { useT } from '../i18n';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const t = useT();
  const { enableScope, disableScope } = useHotkeysContext();

  // Handle Escape key to close modal
  useHotkeys('escape', () => onClose(), { enabled: isOpen }, [onClose, isOpen]);

  // Manage scopes when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Disable navigation scope when help modal is open
      disableScope('navigation');
    } else {
      // Re-enable navigation scope when modal closes
      enableScope('navigation');
    }

    return () => {
      // Cleanup: ensure navigation scope is enabled
      enableScope('navigation');
    };
  }, [isOpen, enableScope, disableScope]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-github-bg-primary border border-github-border rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-github-bg-primary border-b border-github-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-github-text-primary">{t('helpModal.title')}</h2>
          <button
            onClick={onClose}
            className="text-github-text-secondary hover:text-github-text-primary transition-colors"
            aria-label={t('helpModal.closeAriaLabel')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <h3 className="text-sm font-semibold text-github-text-primary mb-2">
              {t('helpModal.lineNavigation')}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    j
                  </kbd>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    ↓
                  </kbd>
                </div>
                <span className="text-github-text-secondary">{t('helpModal.nextLine')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    k
                  </kbd>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    ↑
                  </kbd>
                </div>
                <span className="text-github-text-secondary">{t('helpModal.previousLine')}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-github-text-primary mb-2">
              {t('helpModal.fileNavigation')}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  ]
                </kbd>
                <span className="text-github-text-secondary">{t('helpModal.nextFile')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  [
                </kbd>
                <span className="text-github-text-secondary">{t('helpModal.previousFile')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    Shift
                  </kbd>
                  <span className="text-github-text-muted">+</span>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    [
                  </kbd>
                </div>
                <span className="text-github-text-secondary">{t('helpModal.jumpToFirstFile')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    Shift
                  </kbd>
                  <span className="text-github-text-muted">+</span>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    ]
                  </kbd>
                </div>
                <span className="text-github-text-secondary">{t('helpModal.jumpToLastFile')}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-github-text-primary mb-2">
              {t('helpModal.chunkNavigation')}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  n
                </kbd>
                <span className="text-github-text-secondary">{t('helpModal.nextChunk')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  p
                </kbd>
                <span className="text-github-text-secondary">{t('helpModal.previousChunk')}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-github-text-primary mb-2">
              {t('helpModal.commentNavigation')}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  N
                </kbd>
                <span className="text-github-text-secondary">{t('helpModal.nextComment')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  P
                </kbd>
                <span className="text-github-text-secondary">{t('helpModal.previousComment')}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-github-text-primary mb-2">
              {t('helpModal.sideNavigation')}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    h
                  </kbd>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    ←
                  </kbd>
                </div>
                <span className="text-github-text-secondary">{t('helpModal.focusLeftSide')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    l
                  </kbd>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    →
                  </kbd>
                </div>
                <span className="text-github-text-secondary">{t('helpModal.focusRightSide')}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-github-text-primary mb-2">
              {t('helpModal.commentManagement')}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    Shift
                  </kbd>
                  <span className="text-github-text-muted">+</span>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    L
                  </kbd>
                </div>
                <span className="text-github-text-secondary">
                  {t('helpModal.viewAllCommentsList')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    Shift
                  </kbd>
                  <span className="text-github-text-muted">+</span>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    C
                  </kbd>
                </div>
                <span className="text-github-text-secondary">
                  {t('helpModal.copyAllCommentsPrompt')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    Shift
                  </kbd>
                  <span className="text-github-text-muted">+</span>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    D
                  </kbd>
                </div>
                <span className="text-github-text-secondary">
                  {t('helpModal.deleteAllComments')}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-github-text-primary mb-2">
              {t('helpModal.actions')}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  v
                </kbd>
                <span className="text-github-text-secondary">
                  {t('helpModal.toggleViewedState')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    Shift
                  </kbd>
                  <span className="text-github-text-muted">+</span>
                  <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                    R
                  </kbd>
                </div>
                <span className="text-github-text-secondary">{t('helpModal.refreshDiff')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  c
                </kbd>
                <span className="text-github-text-secondary">
                  {t('helpModal.addCommentAtLine')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  .
                </kbd>
                <span className="text-github-text-secondary">
                  {t('helpModal.moveCursorToCenter')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <kbd className="px-2 py-1 bg-github-bg-tertiary border border-github-border rounded text-github-text-primary font-mono">
                  ?
                </kbd>
                <span className="text-github-text-secondary">{t('helpModal.showHideHelp')}</span>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-github-border lg:col-span-2">
            <p className="text-xs text-github-text-secondary">{t('helpModal.shortcutsDisabled')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
