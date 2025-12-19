import React, { useState, useRef, useCallback } from 'react';
import { Modal } from 'antd';
import { EditOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../contexts/ThemeContext';

interface MarkdownEditorProps {
  visible: boolean;
  title: string;
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  visible,
  title,
  initialContent,
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [syncScroll, setSyncScroll] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Refs for scroll sync
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle editor scroll
  const handleEditorScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!syncScroll || isScrollingRef.current === 'preview') return;

    const editor = e.currentTarget;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    isScrollingRef.current = 'editor';

    const maxEditorScroll = editor.scrollHeight - editor.clientHeight;
    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight;

    if (maxEditorScroll > 0 && maxPreviewScroll > 0) {
      const scrollRatio = editor.scrollTop / maxEditorScroll;
      preview.scrollTop = scrollRatio * maxPreviewScroll;
    }

    // Reset scrolling flag after a short delay
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 100);
  }, [syncScroll]);

  // Handle preview scroll
  const handlePreviewScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!syncScroll || isScrollingRef.current === 'editor') return;

    const preview = e.currentTarget;
    const editor = editorRef.current;
    if (!editor || !preview) return;

    isScrollingRef.current = 'preview';

    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight;
    const maxEditorScroll = editor.scrollHeight - editor.clientHeight;

    if (maxPreviewScroll > 0 && maxEditorScroll > 0) {
      const scrollRatio = preview.scrollTop / maxPreviewScroll;
      editor.scrollTop = scrollRatio * maxEditorScroll;
    }

    // Reset scrolling flag after a short delay
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 100);
  }, [syncScroll]);

  const handleSave = () => {
    onSave(content);
  };

  const handleCancel = () => {
    setContent(initialContent);
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>编辑:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{title}</span>
        </div>
      }
      open={visible}
      onOk={handleSave}
      onCancel={handleCancel}
      width="90%"
      style={{ top: 20 }}
      okText="保存并关闭"
      cancelText="取消"
      styles={{
        body: { height: 'calc(100vh - 200px)', padding: 0 },
        content: {
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        },
        header: {
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-primary)',
        },
        footer: {
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
        },
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* 左侧：编辑器 */}
        <div
          style={{
            flex: 1,
            borderRight: '1px solid var(--border-primary)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-primary)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditOutlined style={{ color: 'var(--color-primary)', fontSize: '14px' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>编辑</span>
            </div>
            {/* Sync Scroll Toggle */}
            <button
              onClick={() => setSyncScroll(!syncScroll)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: `1px solid ${syncScroll ? 'var(--color-primary)' : 'var(--border-primary)'}`,
                background: syncScroll ? (isDark ? 'rgba(0, 212, 255, 0.1)' : 'rgba(14, 165, 233, 0.1)') : 'transparent',
                color: syncScroll ? 'var(--color-primary)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              title={syncScroll ? '点击关闭同步滚动' : '点击开启同步滚动'}
            >
              <LinkOutlined style={{ fontSize: '12px' }} />
              <span>同步滚动</span>
            </button>
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              background: 'var(--bg-primary)',
            }}
          >
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onScroll={handleEditorScroll}
              style={{
                width: '100%',
                minHeight: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none',
                overflow: 'auto',
                fontFamily: "'JetBrains Mono', Monaco, Consolas, monospace",
                fontSize: '13px',
                lineHeight: 1.7,
                padding: '20px',
                background: 'transparent',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
              placeholder="输入 Markdown 内容..."
            />
          </div>
        </div>

        {/* 右侧：预览 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--bg-secondary)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-primary)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <EyeOutlined style={{ color: 'var(--color-secondary)', fontSize: '14px' }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>预览</span>
            {syncScroll && (
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-primary)',
                  marginLeft: '4px',
                }}
              >
                • 同步中
              </span>
            )}
          </div>
          <div
            ref={previewRef}
            onScroll={handlePreviewScroll}
            style={{
              flex: 1,
              padding: '24px',
              overflow: 'auto',
            }}
          >
            <div className={isDark ? 'markdown-preview-dark' : 'markdown-preview-light'}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*暂无内容*'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* 深色主题 Markdown 预览样式 */}
      <style>{`
        .markdown-preview-dark {
          line-height: 1.7;
          color: #e2e8f0;
          font-size: 14px;
        }
        .markdown-preview-dark h1 {
          font-size: 1.875em;
          font-weight: 700;
          margin-top: 32px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .markdown-preview-dark h1:first-child {
          margin-top: 0;
        }
        .markdown-preview-dark h2 {
          font-size: 1.5em;
          font-weight: 700;
          margin-top: 28px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: #f8fafc;
          letter-spacing: -0.01em;
        }
        .markdown-preview-dark h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 12px;
          color: #f8fafc;
        }
        .markdown-preview-dark h4 {
          font-size: 1.1em;
          font-weight: 600;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #f1f5f9;
        }
        .markdown-preview-dark p {
          margin-top: 0;
          margin-bottom: 16px;
          color: #cbd5e1;
        }
        .markdown-preview-dark ul,
        .markdown-preview-dark ol {
          margin-top: 0;
          margin-bottom: 16px;
          padding-left: 1.5em;
          color: #cbd5e1;
        }
        .markdown-preview-dark li {
          margin-bottom: 6px;
        }
        .markdown-preview-dark li::marker {
          color: #64748b;
        }
        .markdown-preview-dark strong {
          color: #f8fafc;
          font-weight: 600;
        }
        .markdown-preview-dark em {
          color: #94a3b8;
          font-style: italic;
        }
        .markdown-preview-dark code {
          background-color: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 4px;
          font-size: 0.875em;
          margin: 0;
          padding: 2px 6px;
          font-family: 'JetBrains Mono', Monaco, Consolas, monospace;
          color: #00d4ff;
        }
        .markdown-preview-dark pre {
          background-color: rgba(10, 14, 23, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.6;
          overflow: auto;
          padding: 16px 20px;
          margin-bottom: 16px;
        }
        .markdown-preview-dark pre code {
          background-color: transparent;
          border: 0;
          display: inline;
          line-height: inherit;
          margin: 0;
          max-width: auto;
          overflow: visible;
          padding: 0;
          word-wrap: normal;
          color: #e2e8f0;
        }
        .markdown-preview-dark blockquote {
          border-left: 4px solid #a855f7;
          background: rgba(168, 85, 247, 0.08);
          color: #94a3b8;
          padding: 12px 16px;
          margin: 0 0 16px 0;
          border-radius: 0 8px 8px 0;
        }
        .markdown-preview-dark blockquote p:last-child {
          margin-bottom: 0;
        }
        .markdown-preview-dark table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
          margin-bottom: 16px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .markdown-preview-dark table th,
        .markdown-preview-dark table td {
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 16px;
          text-align: left;
        }
        .markdown-preview-dark table th {
          background-color: rgba(0, 212, 255, 0.1);
          font-weight: 600;
          color: #f8fafc;
        }
        .markdown-preview-dark table tr {
          background-color: transparent;
        }
        .markdown-preview-dark table tr:nth-child(2n) {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .markdown-preview-dark table tr:hover {
          background-color: rgba(255, 255, 255, 0.04);
        }
        .markdown-preview-dark a {
          color: #00d4ff;
          text-decoration: none;
          border-bottom: 1px solid rgba(0, 212, 255, 0.3);
          transition: all 0.2s ease;
        }
        .markdown-preview-dark a:hover {
          color: #5ce1ff;
          border-bottom-color: #00d4ff;
        }
        .markdown-preview-dark img {
          max-width: 100%;
          box-sizing: content-box;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .markdown-preview-dark hr {
          height: 1px;
          padding: 0;
          margin: 28px 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          border: 0;
        }

        /* TextArea 深色样式覆盖 */
        .ant-input[style*="background: #0a0e17"]::placeholder,
        .ant-input[style*="background: rgb(10, 14, 23)"]::placeholder {
          color: #475569 !important;
        }

        /* 滚动条样式 */
        .markdown-preview-dark::-webkit-scrollbar {
          width: 6px;
        }
        .markdown-preview-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .markdown-preview-dark::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .markdown-preview-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* ========== Light Theme Markdown Preview ========== */
        .markdown-preview-light {
          line-height: 1.7;
          color: #334155;
          font-size: 14px;
        }
        .markdown-preview-light h1 {
          font-size: 1.875em;
          font-weight: 700;
          margin-top: 32px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .markdown-preview-light h1:first-child {
          margin-top: 0;
        }
        .markdown-preview-light h2 {
          font-size: 1.5em;
          font-weight: 700;
          margin-top: 28px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          color: #0f172a;
          letter-spacing: -0.01em;
        }
        .markdown-preview-light h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 12px;
          color: #1e293b;
        }
        .markdown-preview-light h4 {
          font-size: 1.1em;
          font-weight: 600;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #334155;
        }
        .markdown-preview-light p {
          margin-top: 0;
          margin-bottom: 16px;
          color: #475569;
        }
        .markdown-preview-light ul,
        .markdown-preview-light ol {
          margin-top: 0;
          margin-bottom: 16px;
          padding-left: 1.5em;
          color: #475569;
        }
        .markdown-preview-light li {
          margin-bottom: 6px;
        }
        .markdown-preview-light li::marker {
          color: #94a3b8;
        }
        .markdown-preview-light strong {
          color: #0f172a;
          font-weight: 600;
        }
        .markdown-preview-light em {
          color: #64748b;
          font-style: italic;
        }
        .markdown-preview-light code {
          background-color: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 4px;
          font-size: 0.875em;
          margin: 0;
          padding: 2px 6px;
          font-family: 'JetBrains Mono', Monaco, Consolas, monospace;
          color: #0284c7;
        }
        .markdown-preview-light pre {
          background-color: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.6;
          overflow: auto;
          padding: 16px 20px;
          margin-bottom: 16px;
        }
        .markdown-preview-light pre code {
          background-color: transparent;
          border: 0;
          display: inline;
          line-height: inherit;
          margin: 0;
          max-width: auto;
          overflow: visible;
          padding: 0;
          word-wrap: normal;
          color: #334155;
        }
        .markdown-preview-light blockquote {
          border-left: 4px solid #8b5cf6;
          background: rgba(139, 92, 246, 0.06);
          color: #64748b;
          padding: 12px 16px;
          margin: 0 0 16px 0;
          border-radius: 0 8px 8px 0;
        }
        .markdown-preview-light blockquote p:last-child {
          margin-bottom: 0;
        }
        .markdown-preview-light table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
          margin-bottom: 16px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .markdown-preview-light table th,
        .markdown-preview-light table td {
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 10px 16px;
          text-align: left;
        }
        .markdown-preview-light table th {
          background-color: rgba(14, 165, 233, 0.08);
          font-weight: 600;
          color: #0f172a;
        }
        .markdown-preview-light table tr {
          background-color: transparent;
        }
        .markdown-preview-light table tr:nth-child(2n) {
          background-color: rgba(0, 0, 0, 0.02);
        }
        .markdown-preview-light table tr:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }
        .markdown-preview-light a {
          color: #0ea5e9;
          text-decoration: none;
          border-bottom: 1px solid rgba(14, 165, 233, 0.3);
          transition: all 0.2s ease;
        }
        .markdown-preview-light a:hover {
          color: #0284c7;
          border-bottom-color: #0ea5e9;
        }
        .markdown-preview-light img {
          max-width: 100%;
          box-sizing: content-box;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .markdown-preview-light hr {
          height: 1px;
          padding: 0;
          margin: 28px 0;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
          border: 0;
        }
        .markdown-preview-light::-webkit-scrollbar {
          width: 6px;
        }
        .markdown-preview-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .markdown-preview-light::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .markdown-preview-light::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Modal>
  );
};

export default MarkdownEditor;
