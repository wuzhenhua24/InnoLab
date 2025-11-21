import React, { useState, useEffect } from 'react';
import { Modal, Typography, Tree, message, Button, Space } from 'antd';
import {
  FileOutlined,
  FolderOutlined,
  SaveOutlined,
  CloseOutlined,
  GitlabOutlined,
  DownloadOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import GitCommitModal from './GitCommitModal';
import DeployModal from './DeployModal';
import { exportFilesToZip } from '../utils/fileExporter';
import type { IDEFile } from '../types/pipeline';

// 添加Monaco Editor加载错误的详细日志
if (typeof window !== 'undefined') {
  // 监听Monaco Editor的加载错误
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('monacoeditorwork')) {
      console.error('❌ Monaco Worker加载失败:', {
        filename: event.filename,
        message: event.message,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });

      // 尝试解析具体是哪个worker文件失败了
      const workerType = event.filename.match(/(\w+)\.worker/)?.[1] || 'unknown';
      console.error(`❌ 失败的Worker类型: ${workerType}`);
      console.error(`❌ 完整URL: ${event.filename}`);
      console.error(`❌ 当前页面URL: ${window.location.href}`);
      console.error(`❌ Base路径: ${window.location.origin}${window.location.pathname}`);
    }
  }, true);

  // 检查MonacoEnvironment配置
  console.log('🔍 检查Monaco Environment配置:', (window as any).MonacoEnvironment);

  // 输出当前环境信息
  console.log('🌍 当前环境信息:', {
    url: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
    baseURI: document.baseURI
  });
}

const { Text } = Typography;

interface WebIDEProps {
  visible: boolean;
  title: string;
  files: IDEFile[];
  projectName: string;
  onSave: (files: IDEFile[]) => void;
  onCommit?: (message: string) => Promise<void>;
  onClose: () => void;
}

interface TreeNode {
  title: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  isLeaf?: boolean;
  fileId?: string;
}

const WebIDE: React.FC<WebIDEProps> = ({ visible, title, files, projectName, onSave, onCommit, onClose }) => {
  const [currentFile, setCurrentFile] = useState<IDEFile | null>(null);
  const [editedFiles, setEditedFiles] = useState<Map<string, IDEFile>>(new Map());
  const [originalFiles, setOriginalFiles] = useState<IDEFile[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [gitModalVisible, setGitModalVisible] = useState(false);
  const [deployModalVisible, setDeployModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 初始化时选择第一个文件并保存原始状态
  useEffect(() => {
    if (visible && files.length > 0 && !currentFile) {
      setCurrentFile(files[0]);
      setEditedFiles(new Map(files.map(f => [f.id, { ...f }])));
      setOriginalFiles(files.map(f => ({ ...f }))); // 保存原始文件用于变更检测
    }
  }, [visible, files, currentFile]);

  // 构建文件树结构
  const buildFileTree = (): TreeNode[] => {
    const tree: TreeNode[] = [];
    const pathMap = new Map<string, TreeNode>();

    files.forEach((file) => {
      const parts = file.path.split('/').filter(Boolean);
      let currentPath = '';

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!pathMap.has(currentPath)) {
          const node: TreeNode = {
            title: part,
            key: currentPath,
            icon: isFile ? (
              <FileOutlined />
            ) : (
              <FolderOutlined />
            ),
            isLeaf: isFile,
            fileId: isFile ? file.id : undefined,
          };

          if (index === 0) {
            tree.push(node);
          } else {
            const parentPath = parts.slice(0, index).join('/');
            const parent = pathMap.get(parentPath);
            if (parent) {
              parent.children = parent.children || [];
              parent.children.push(node);
            }
          }

          pathMap.set(currentPath, node);
        }
      });
    });

    return tree;
  };

  // 处理文件选择
  const handleFileSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      const node = findNodeByKey(buildFileTree(), key);

      if (node?.fileId) {
        const file = editedFiles.get(node.fileId) || files.find(f => f.id === node.fileId);
        if (file) {
          setCurrentFile(file);
        }
      }
    }
  };

  // 查找树节点
  const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 处理代码编辑
  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      const updatedFile = {
        ...currentFile,
        content: value,
        isModified: value !== files.find(f => f.id === currentFile.id)?.content,
      };

      setCurrentFile(updatedFile);
      setEditedFiles(new Map(editedFiles).set(currentFile.id, updatedFile));
    }
  };

  // 保存所有修改
  const handleSave = () => {
    const modifiedFiles = Array.from(editedFiles.values()).filter(f => f.isModified);

    if (modifiedFiles.length === 0) {
      message.info('没有需要保存的修改');
      return;
    }

    // 合并修改到原始文件列表
    const updatedFiles = files.map(file => {
      const edited = editedFiles.get(file.id);
      return edited || file;
    });

    onSave(updatedFiles);
    message.success(`已保存 ${modifiedFiles.length} 个文件的修改`);
  };

  // 关闭IDE
  const handleClose = () => {
    const hasUnsavedChanges = Array.from(editedFiles.values()).some(f => f.isModified);

    if (hasUnsavedChanges) {
      Modal.confirm({
        title: '确认关闭',
        content: '有未保存的修改，确定要关闭吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          setCurrentFile(null);
          setEditedFiles(new Map());
          onClose();
        },
      });
    } else {
      setCurrentFile(null);
      setEditedFiles(new Map());
      onClose();
    }
  };

  // 导出文件到本地
  const handleExport = async () => {
    if (files.length === 0) {
      message.warning('没有可导出的文件');
      return;
    }

    setIsExporting(true);

    try {
      // 使用当前编辑状态的文件（包括未保存的修改）
      const filesToExport = Array.from(editedFiles.values()).length > 0
        ? Array.from(editedFiles.values())
        : files;

      await exportFilesToZip(filesToExport, projectName);
      message.success(`成功导出 ${filesToExport.length} 个文件`);
    } catch (error) {
      message.error('导出失败，请重试');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 一键部署
  const handleDeploy = async () => {
    // Mock实现，实际应调用后端API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('部署完成');
        resolve();
      }, 100);
    });
  };

  // 获取修改文件的数量
  const getModifiedCount = () => {
    return Array.from(editedFiles.values()).filter(f => f.isModified).length;
  };

  return (
    <Modal
      title={
        <Space>
          <Text strong>{title}</Text>
          {getModifiedCount() > 0 && (
            <Text type="warning">({getModifiedCount()} 个文件已修改)</Text>
          )}
        </Space>
      }
      open={visible}
      width="95%"
      style={{ top: 20 }}
      onCancel={handleClose}
      footer={
        <Space>
          <Button icon={<CloseOutlined />} onClick={handleClose}>
            关闭
          </Button>
          <Button
            icon={<GitlabOutlined />}
            onClick={() => setGitModalVisible(true)}
          >
            源代码管理
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={isExporting}
            disabled={isExporting}
          >
            导出代码
          </Button>
          <Button
            icon={<RocketOutlined />}
            onClick={() => setDeployModalVisible(true)}
            type="default"
          >
            一键部署
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={getModifiedCount() === 0}
          >
            保存修改
          </Button>
        </Space>
      }
      bodyStyle={{ height: 'calc(100vh - 200px)', padding: 0 }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* 左侧：文件树 */}
        <div
          style={{
            width: '250px',
            borderRight: '1px solid #f0f0f0',
            overflowY: 'auto',
            padding: '12px',
            background: '#fafafa',
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: '12px' }}>
            文件资源管理器
          </Text>
          <Tree
            showIcon
            defaultExpandAll
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
            onSelect={handleFileSelect}
            selectedKeys={currentFile ? [currentFile.path] : []}
            treeData={buildFileTree()}
          />
        </div>

        {/* 右侧：代码编辑器 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 文件标签 */}
          {currentFile && (
            <div
              style={{
                padding: '8px 16px',
                borderBottom: '1px solid #f0f0f0',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Space>
                <FileOutlined />
                <Text strong>{currentFile.name}</Text>
                {currentFile.isModified && (
                  <Text type="warning" style={{ fontSize: '12px' }}>
                    • 未保存
                  </Text>
                )}
              </Space>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {currentFile.path}
              </Text>
            </div>
          )}

          {/* 编辑器区域 */}
          <div style={{ flex: 1 }}>
            {currentFile ? (
              <Editor
                height="100%"
                language={currentFile.language}
                value={currentFile.content}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8c8c8c',
                }}
              >
                <Text type="secondary">请从左侧选择一个文件</Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Git提交模态框 */}
      <GitCommitModal
        visible={gitModalVisible}
        files={Array.from(editedFiles.values())}
        originalFiles={originalFiles}
        projectName={projectName}
        onCommit={async (commitMsg) => {
          if (onCommit) {
            await onCommit(commitMsg);
          } else {
            // 如果没有提供onCommit，显示提示信息
            message.info('Git功能需要后端支持');
          }
        }}
        onClose={() => setGitModalVisible(false)}
      />

      {/* 一键部署模态框 */}
      <DeployModal
        visible={deployModalVisible}
        projectName={projectName}
        onDeploy={handleDeploy}
        onClose={() => setDeployModalVisible(false)}
      />
    </Modal>
  );
};

export default WebIDE;
