import { X } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useHotkeys, useHotkeysContext } from 'react-hotkeys-hook';

import type { CommentThread } from '../../types/diff';
import { useT } from '../i18n';

import { CommentThreadCard } from './CommentThreadCard';
import type { AppearanceSettings } from './SettingsModal';

interface CommentsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (thread: CommentThread) => void;
  comments: CommentThread[];
  showAuthorBadges?: boolean;
  onRemoveThread: (threadId: string) => void;
  onGenerateThreadPrompt: (thread: CommentThread) => string;
  onReplyToThread: (threadId: string, body: string) => Promise<void>;
  onRemoveMessage: (threadId: string, messageId: string) => void;
  onUpdateMessage: (threadId: string, messageId: string, newBody: string) => void;
  syntaxTheme?: AppearanceSettings['syntaxTheme'];
}

export function CommentsListModal({
  isOpen,
  onClose,
  onNavigate,
  comments,
  showAuthorBadges = false,
  onRemoveThread,
  onGenerateThreadPrompt,
  onReplyToThread,
  onRemoveMessage,
  onUpdateMessage,
  syntaxTheme,
}: CommentsListModalProps) {
  const t = useT();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { enableScope, disableScope } = useHotkeysContext();

  const sortedThreads = [...comments].sort((a, b) => {
    const fileCompare = a.file.localeCompare(b.file);
    if (fileCompare !== 0) return fileCompare;

    const aLine = Array.isArray(a.line) ? a.line[0] : a.line;
    const bLine = Array.isArray(b.line) ? b.line[0] : b.line;
    if (aLine !== bLine) return aLine - bLine;

    return a.createdAt.localeCompare(b.createdAt);
  });

  const handleThreadClick = useCallback(
    (thread: CommentThread) => {
      onNavigate(thread);
      onClose();
    },
    [onClose, onNavigate],
  );

  const handleDeleteThread = useCallback(
    (thread: CommentThread) => {
      const preview = thread.messages[0]?.body || '';
      if (confirm(t('commentThreadCard.resolveConfirm', { body: preview }))) {
        onRemoveThread(thread.id);
        if (selectedIndex >= sortedThreads.length - 1 && selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        }
      }
    },
    [onRemoveThread, selectedIndex, sortedThreads.length, t],
  );

  useEffect(() => {
    if (isOpen) {
      enableScope('comments-list');
      disableScope('navigation');
    } else {
      enableScope('navigation');
      disableScope('comments-list');
      setSelectedIndex(0);
    }

    return () => {
      enableScope('navigation');
      disableScope('comments-list');
    };
  }, [disableScope, enableScope, isOpen]);

  const hotkeyOptions = { scopes: 'comments-list', enableOnFormTags: false };

  useHotkeys('escape', () => onClose(), hotkeyOptions, [onClose]);

  useHotkeys(
    'j, down',
    () => setSelectedIndex((prev) => Math.min(prev + 1, sortedThreads.length - 1)),
    hotkeyOptions,
    [sortedThreads.length],
  );

  useHotkeys('k, up', () => setSelectedIndex((prev) => Math.max(prev - 1, 0)), hotkeyOptions, []);

  useHotkeys(
    'enter',
    () => {
      if (sortedThreads[selectedIndex]) {
        handleThreadClick(sortedThreads[selectedIndex]);
      }
    },
    hotkeyOptions,
    [handleThreadClick, selectedIndex, sortedThreads],
  );

  useHotkeys(
    'd',
    () => {
      if (sortedThreads[selectedIndex]) {
        handleDeleteThread(sortedThreads[selectedIndex]);
      }
    },
    hotkeyOptions,
    [handleDeleteThread, selectedIndex, sortedThreads],
  );

  useEffect(() => {
    if (commentRefs.current[selectedIndex]) {
      commentRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg border border-github-border bg-github-bg-primary shadow-lg">
        <div className="sticky top-0 border-b border-github-border bg-github-bg-primary px-6 py-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-github-text-primary">
              {t('commentsListModal.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-github-text-secondary transition-colors hover:text-github-text-primary"
              aria-label={t('commentsListModal.closeAriaLabel')}
            >
              <X size={20} />
            </button>
          </div>
          <div className="text-xs text-github-text-secondary">{t('commentsListModal.helpBar')}</div>
        </div>

        <div className="max-h-[calc(80vh-120px)] overflow-y-auto">
          <div className="p-6">
            {sortedThreads.length === 0 ? (
              <p className="text-center text-github-text-secondary">
                {t('commentsListModal.noComments')}
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {sortedThreads.map((thread, index) => (
                    <div
                      key={thread.id}
                      ref={(el) => {
                        commentRefs.current[index] = el;
                      }}
                      className={selectedIndex === index ? 'rounded ring-2 ring-blue-500' : ''}
                    >
                      <CommentThreadCard
                        thread={thread}
                        showAuthorBadges={showAuthorBadges}
                        confirmRootAction={false}
                        onGeneratePrompt={onGenerateThreadPrompt}
                        onRemoveThread={(threadId) => {
                          if (threadId === thread.id) {
                            handleDeleteThread(thread);
                          }
                        }}
                        onReplyToThread={onReplyToThread}
                        onRemoveMessage={onRemoveMessage}
                        onUpdateMessage={onUpdateMessage}
                        syntaxTheme={syntaxTheme}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex(index);
                          handleThreadClick(thread);
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-github-border pt-4 text-center text-xs text-github-text-secondary">
                  {t('commentsListModal.ofThreads', {
                    current: selectedIndex + 1,
                    total: sortedThreads.length,
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
