import React, { useState } from 'react';
import { Modal, Input, Typography, Space } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { TextArea } = Input;
const { Text } = Typography;

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

  const handleSave = () => {
    onSave(content);
  };

  const handleCancel = () => {
    // 恢复初始内容
    setContent(initialContent);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <Text>编辑:</Text>
          <Text strong>{title}</Text>
        </Space>
      }
      open={visible}
      onOk={handleSave}
      onCancel={handleCancel}
      width="90%"
      style={{ top: 20 }}
      okText="保存并关闭"
      cancelText="取消"
      bodyStyle={{ height: 'calc(100vh - 200px)', padding: 0 }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* 左侧：编辑器 */}
        <div
          style={{
            flex: 1,
            borderRight: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              background: '#fafafa',
            }}
          >
            <Text strong>编辑</Text>
          </div>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              resize: 'none',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '14px',
              padding: '16px',
            }}
            placeholder="输入Markdown内容..."
          />
        </div>

        {/* 右侧：预览 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              background: '#fafafa',
            }}
          >
            <Text strong>预览</Text>
          </div>
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflow: 'auto',
            }}
          >
            <div className="markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*暂无内容*'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* 添加Markdown预览样式 */}
      <style>{`
        .markdown-preview {
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.85);
        }
        .markdown-preview h1 {
          font-size: 2em;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 16px;
          padding-bottom: 0.3em;
          border-bottom: 1px solid #eaecef;
        }
        .markdown-preview h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 16px;
          padding-bottom: 0.3em;
          border-bottom: 1px solid #eaecef;
        }
        .markdown-preview h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        .markdown-preview h4 {
          font-size: 1em;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        .markdown-preview p {
          margin-top: 0;
          margin-bottom: 16px;
        }
        .markdown-preview ul,
        .markdown-preview ol {
          margin-top: 0;
          margin-bottom: 16px;
          padding-left: 2em;
        }
        .markdown-preview li {
          margin-bottom: 4px;
        }
        .markdown-preview code {
          background-color: rgba(27, 31, 35, 0.05);
          border-radius: 3px;
          font-size: 85%;
          margin: 0;
          padding: 0.2em 0.4em;
          font-family: Monaco, Consolas, "Courier New", monospace;
        }
        .markdown-preview pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          font-size: 85%;
          line-height: 1.45;
          overflow: auto;
          padding: 16px;
          margin-bottom: 16px;
        }
        .markdown-preview pre code {
          background-color: transparent;
          border: 0;
          display: inline;
          line-height: inherit;
          margin: 0;
          max-width: auto;
          overflow: visible;
          padding: 0;
          word-wrap: normal;
        }
        .markdown-preview blockquote {
          border-left: 4px solid #dfe2e5;
          color: #6a737d;
          padding: 0 1em;
          margin: 0 0 16px 0;
        }
        .markdown-preview table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
          margin-bottom: 16px;
        }
        .markdown-preview table th,
        .markdown-preview table td {
          border: 1px solid #dfe2e5;
          padding: 6px 13px;
        }
        .markdown-preview table th {
          background-color: #f6f8fa;
          font-weight: 600;
        }
        .markdown-preview table tr:nth-child(2n) {
          background-color: #f6f8fa;
        }
        .markdown-preview a {
          color: #0366d6;
          text-decoration: none;
        }
        .markdown-preview a:hover {
          text-decoration: underline;
        }
        .markdown-preview img {
          max-width: 100%;
          box-sizing: content-box;
        }
        .markdown-preview hr {
          height: 0.25em;
          padding: 0;
          margin: 24px 0;
          background-color: #e1e4e8;
          border: 0;
        }
      `}</style>
    </Modal>
  );
};

export default MarkdownEditor;
