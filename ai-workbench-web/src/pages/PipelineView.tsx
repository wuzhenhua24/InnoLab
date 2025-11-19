import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Space, Divider, Modal, message } from 'antd';
import { ThunderboltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import StageCard from '../components/StageCard';
import WebIDE from '../components/WebIDE';
import DeployConfigModal from '../components/DeployConfigModal';
import DeploymentStageCard from '../components/DeploymentStageCard';
import type { Pipeline, LogEntry, ExecutionMetrics, StageArtifact, IDEFile } from '../types/pipeline';
import { StageStatus, StageType, LogLevel, ArtifactType } from '../types/pipeline';
import { loadArtifactContent } from '../utils/artifactLoader';

const { Title, Text } = Typography;

const PipelineView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Mock初始流水线数据
  const [pipeline, setPipeline] = useState<Pipeline>({
    id: 'pipeline-1',
    projectId: projectId || '1',
    projectName: 'E-Commerce Platform',
    isAutoRunning: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stages: [
      {
        id: 'stage-0',
        type: StageType.PROJECT_ANALYSIS,
        name: '项目分析',
        description: '自动分析代码库结构、技术栈、主要逻辑',
        status: StageStatus.COMPLETED,
        order: 0,
        autoRun: true,
        artifacts: [
          {
            name: 'PROJECT_ANALYSIS.md',
            url: '/artifacts/project-analysis.md',
            type: ArtifactType.MARKDOWN,
            content: '', // 将在useEffect中加载
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'stage-1',
        type: StageType.DOC_UPLOAD,
        name: '文档上传',
        description: '上传需求文档、设计稿等原始资料',
        status: StageStatus.COMPLETED,
        order: 1,
        requiresInput: true,
        artifacts: [
          {
            name: '需求文档.md',
            url: '/artifacts/requirement-doc.md',
            type: ArtifactType.MARKDOWN,
            content: '', // 将在useEffect中加载
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
        completedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'stage-2',
        type: StageType.PRD_GEN,
        name: 'PRD生成',
        description: '基于上传的文档自动生成标准化的PRD',
        status: StageStatus.PENDING,
        order: 2,
        artifacts: [],
      },
      {
        id: 'stage-3',
        type: StageType.ARCHITECTURE,
        name: '架构设计',
        description: '基于PRD和项目分析生成系统架构设计',
        status: StageStatus.PENDING,
        order: 3,
        artifacts: [],
      },
      {
        id: 'stage-4',
        type: StageType.DETAILED_DESIGN,
        name: '详细设计',
        description: '生成详细的技术设计文档和接口定义',
        status: StageStatus.PENDING,
        order: 4,
        artifacts: [],
      },
      {
        id: 'stage-5',
        type: StageType.CODE_DEV,
        name: '开发代码',
        description: '根据详细设计生成完整的代码实现',
        status: StageStatus.PENDING,
        order: 5,
        artifacts: [],
      },
      {
        id: 'stage-6',
        type: StageType.TEST_CASE,
        name: '测试用例',
        description: '为生成的代码创建单元测试和集成测试用例',
        status: StageStatus.PENDING,
        order: 6,
        artifacts: [],
      },
      {
        id: 'stage-7',
        type: StageType.TEST_SCRIPT,
        name: '测试脚本',
        description: '生成自动化测试脚本和测试执行工具',
        status: StageStatus.PENDING,
        order: 7,
        artifacts: [],
      },
      {
        id: 'stage-8',
        type: StageType.DEPLOYMENT,
        name: '部署',
        description: '将代码部署到目标环境（Dev/Staging/Production）',
        status: StageStatus.PENDING,
        order: 8,
        artifacts: [],
      },
    ],
  });

  // IDE相关状态
  const [ideVisible, setIdeVisible] = useState(false);
  const [ideFiles, setIdeFiles] = useState<IDEFile[]>([]);
  const [ideTitle, setIdeTitle] = useState('');
  const [currentEditingStageId, setCurrentEditingStageId] = useState<string | null>(null);

  // 部署相关状态
  const [deployConfigVisible, setDeployConfigVisible] = useState(false);
  const [deploymentEnvironment, setDeploymentEnvironment] = useState<'dev' | 'staging' | 'production'>('dev');
  const [deploymentLogs, setDeploymentLogs] = useState<Array<{ timestamp: string; message: string; level: 'info' | 'success' | 'error' | 'warning' }>>([]);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  // 加载artifact文件内容
  useEffect(() => {
    const loadArtifactContents = async () => {
      const updatedStages = await Promise.all(
        pipeline.stages.map(async (stage) => {
          if (stage.artifacts.length > 0) {
            const updatedArtifacts = await Promise.all(
              stage.artifacts.map(async (artifact) => {
                if (artifact.type === ArtifactType.MARKDOWN && !artifact.content) {
                  const content = await loadArtifactContent(artifact.url);
                  return { ...artifact, content };
                }
                return artifact;
              })
            );
            return { ...stage, artifacts: updatedArtifacts };
          }
          return stage;
        })
      );

      setPipeline((prev) => ({
        ...prev,
        stages: updatedStages,
      }));
    };

    loadArtifactContents();
  }, []); // 只在组件挂载时执行一次

  // Mock: 生成模拟日志
  const generateMockLogs = (stageName: string): LogEntry[] => {
    const baseTime = Date.now();
    const logs: LogEntry[] = [
      {
        id: `${baseTime}-1`,
        level: LogLevel.STATUS_UPDATE,
        message: `开始执行 ${stageName} 阶段...`,
        timestamp: new Date(baseTime).toISOString(),
      },
      {
        id: `${baseTime}-2`,
        level: LogLevel.INFO,
        message: '正在初始化执行环境...',
        timestamp: new Date(baseTime + 200).toISOString(),
      },
      {
        id: `${baseTime}-3`,
        level: LogLevel.SUCCESS,
        message: '环境初始化完成',
        timestamp: new Date(baseTime + 500).toISOString(),
      },
      {
        id: `${baseTime}-4`,
        level: LogLevel.INFO,
        message: '正在加载项目上下文...',
        timestamp: new Date(baseTime + 700).toISOString(),
      },
      {
        id: `${baseTime}-5`,
        level: LogLevel.INFO,
        message: '分析代码库结构...',
        timestamp: new Date(baseTime + 1000).toISOString(),
        metadata: { files_analyzed: 142, directories: 28 },
      },
      {
        id: `${baseTime}-6`,
        level: LogLevel.SUCCESS,
        message: '代码库分析完成',
        timestamp: new Date(baseTime + 1500).toISOString(),
      },
      {
        id: `${baseTime}-7`,
        level: LogLevel.INFO,
        message: '调用AI模型生成内容...',
        timestamp: new Date(baseTime + 1700).toISOString(),
      },
      {
        id: `${baseTime}-8`,
        level: LogLevel.SUCCESS,
        message: 'AI模型响应成功',
        timestamp: new Date(baseTime + 3200).toISOString(),
      },
      {
        id: `${baseTime}-9`,
        level: LogLevel.INFO,
        message: '正在生成产出物...',
        timestamp: new Date(baseTime + 3400).toISOString(),
      },
      {
        id: `${baseTime}-10`,
        level: LogLevel.SUCCESS,
        message: '产出物生成完成',
        timestamp: new Date(baseTime + 4000).toISOString(),
      },
      {
        id: `${baseTime}-11`,
        level: LogLevel.STATUS_UPDATE,
        message: `${stageName} 阶段执行完成，等待审核`,
        timestamp: new Date(baseTime + 4200).toISOString(),
      },
    ];
    return logs;
  };

  // Mock: 生成执行指标
  const generateMockMetrics = (): ExecutionMetrics => {
    return {
      duration: Math.floor(Math.random() * 10 + 5), // 5-15秒
      tokenUsage: Math.floor(Math.random() * 5000 + 1000), // 1000-6000 tokens
    };
  };

  // Mock: 模拟实时日志流
  const simulateLogStreaming = (
    stageId: string,
    logs: LogEntry[],
    onComplete: () => void
  ) => {
    let currentIndex = 0;
    const interval = 400; // 每400ms推送一条日志

    const streamInterval = setInterval(() => {
      if (currentIndex < logs.length) {
        const logToAdd = logs[currentIndex];
        setPipeline((prev) => ({
          ...prev,
          stages: prev.stages.map((stage) =>
            stage.id === stageId
              ? {
                  ...stage,
                  logs: [...(stage.logs || []), logToAdd],
                }
              : stage
          ),
        }));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        // 日志推送完成，执行回调
        onComplete();
      }
    }, interval);

    return streamInterval;
  };

  // 运行单个阶段
  const handleRunStage = useCallback((stageId: string) => {
    // 获取阶段名称
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return;

    // 如果是部署节点，弹出配置对话框
    if (stage.type === StageType.DEPLOYMENT) {
      setDeployConfigVisible(true);
      return;
    }

    // 设置阶段为运行中并自动展开
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((s) =>
        s.id === stageId
          ? {
              ...s,
              status: StageStatus.RUNNING,
              startedAt: new Date().toISOString(),
              expanded: true,
              logs: [],
              metrics: undefined,
            }
          : s
      ),
    }));

    // 生成模拟日志并开始流式推送
    const mockLogs = generateMockLogs(stage.name);
    simulateLogStreaming(stageId, mockLogs, () => {
      // 日志推送完成后，更新状态为等待审核，并添加执行指标
      setPipeline((prev) => ({
        ...prev,
        stages: prev.stages.map((s) => {
          if (s.id !== stageId) return s;

          // 根据阶段类型决定产出物类型和文件名
          const isCodeStage = s.type === StageType.CODE_DEV || s.type === StageType.TEST_SCRIPT;
          const artifactType = isCodeStage ? ArtifactType.CODE : ArtifactType.MARKDOWN;
          const fileExtension = isCodeStage ? 'ts' : 'md';
          const fileName = `${s.type}.${fileExtension}`;
          const artifactUrl = `/artifacts/${fileName}`;

          // 异步加载文件内容
          const loadContentAsync = async () => {
            const content = await loadArtifactContent(artifactUrl);
            setPipeline((prev) => ({
              ...prev,
              stages: prev.stages.map((stage) =>
                stage.id === s.id
                  ? {
                      ...stage,
                      artifacts: stage.artifacts.map((art) =>
                        art.url === artifactUrl ? { ...art, content } : art
                      ),
                    }
                  : stage
              ),
            }));
          };

          // 立即开始加载内容
          loadContentAsync();

          return {
            ...s,
            status: StageStatus.WAITING_REVIEW,
            metrics: generateMockMetrics(),
            artifacts: [
              {
                name: `${s.name}_产出.${fileExtension}`,
                url: artifactUrl,
                type: artifactType,
                content: '', // 初始为空，将异步加载
                filePath: isCodeStage ? `/src/generated/${fileName}` : undefined,
                language: isCodeStage ? 'typescript' : undefined,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
      }));
      message.success(`${stage.name} 执行完成，等待审核`);
    });
  }, [pipeline.stages]);

  // 批准阶段
  const handleApproveStage = useCallback((stageId: string) => {
    setPipeline((prev) => {
      const stageIndex = prev.stages.findIndex((s) => s.id === stageId);
      const updatedStages = prev.stages.map((stage, index) => {
        if (stage.id === stageId) {
          return {
            ...stage,
            status: StageStatus.COMPLETED,
            completedAt: new Date().toISOString(),
          };
        }
        // 激活下一个阶段
        if (index === stageIndex + 1 && stage.status === StageStatus.PENDING) {
          return { ...stage };
        }
        return stage;
      });

      return { ...prev, stages: updatedStages };
    });
    message.success('阶段已批准，下一阶段已激活');
  }, []);

  // 一键执行所有
  const handleRunAll = useCallback(() => {
    Modal.confirm({
      title: '确认一键执行',
      content: '这将自动执行所有待处理的阶段，且无需人工审核。确认继续？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setPipeline((prev) => ({ ...prev, isAutoRunning: true }));
        message.info('开始一键执行流水线...');

        // Mock: 模拟自动执行所有待处理的阶段
        const pendingStages = pipeline.stages.filter((s) => s.status === StageStatus.PENDING);
        let cumulativeDelay = 500;

        pendingStages.forEach((stage, index) => {
          // 开始运行阶段
          setTimeout(() => {
            setPipeline((prev) => ({
              ...prev,
              stages: prev.stages.map((s) =>
                s.id === stage.id
                  ? {
                      ...s,
                      status: StageStatus.RUNNING,
                      startedAt: new Date().toISOString(),
                      expanded: true,
                      logs: [],
                      metrics: undefined,
                    }
                  : s
              ),
            }));

            // 生成并推送日志
            const mockLogs = generateMockLogs(stage.name);
            simulateLogStreaming(stage.id, mockLogs, () => {
              // 日志推送完成后直接标记为完成（一键执行无需审核），并添加执行指标
              setPipeline((prev) => ({
                ...prev,
                stages: prev.stages.map((s) => {
                  if (s.id !== stage.id) return s;

                  const isCodeStage = s.type === StageType.CODE_DEV || s.type === StageType.TEST_SCRIPT;
                  const artifactType = isCodeStage ? ArtifactType.CODE : ArtifactType.MARKDOWN;
                  const fileExtension = isCodeStage ? 'ts' : 'md';
                  const fileName = `${s.type}.${fileExtension}`;
                  const artifactUrl = `/artifacts/${fileName}`;

                  // 异步加载文件内容
                  const loadContentAsync = async () => {
                    const content = await loadArtifactContent(artifactUrl);
                    setPipeline((prev) => ({
                      ...prev,
                      stages: prev.stages.map((stage) =>
                        stage.id === s.id
                          ? {
                              ...stage,
                              artifacts: stage.artifacts.map((art) =>
                                art.url === artifactUrl ? { ...art, content } : art
                              ),
                            }
                          : stage
                      ),
                    }));
                  };

                  // 立即开始加载内容
                  loadContentAsync();

                  return {
                    ...s,
                    status: StageStatus.COMPLETED,
                    completedAt: new Date().toISOString(),
                    metrics: generateMockMetrics(),
                    artifacts: [
                      {
                        name: `${s.name}_产出.${fileExtension}`,
                        url: artifactUrl,
                        type: artifactType,
                        content: '', // 初始为空，将异步加载
                        filePath: isCodeStage ? `/src/generated/${fileName}` : undefined,
                        language: isCodeStage ? 'typescript' : undefined,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  };
                }),
              }));

              // 最后一个阶段完成时结束
              if (index === pendingStages.length - 1) {
                message.success('流水线执行完成！');
                setPipeline((prev) => ({ ...prev, isAutoRunning: false }));
              }
            });
          }, cumulativeDelay);

          // 每个阶段间隔约5秒（日志推送时间）
          cumulativeDelay += 5500;
        });
      },
    });
  }, [pipeline.stages]);

  // 编辑产出物
  const handleEditArtifact = useCallback((stageId: string, artifact: StageArtifact, newContent: string) => {
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) => {
        if (stage.id !== stageId) return stage;

        return {
          ...stage,
          artifacts: stage.artifacts.map((art) =>
            art.url === artifact.url
              ? { ...art, content: newContent }
              : art
          ),
        };
      }),
    }));
    message.success('产出物已保存');
  }, []);

  // 在IDE中打开代码
  const handleOpenInIDE = useCallback(async (stageId: string) => {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return;

    const codeArtifacts = stage.artifacts.filter((a) => a.type === ArtifactType.CODE);
    if (codeArtifacts.length === 0) {
      message.warning('该阶段没有代码产出物');
      return;
    }

    // 将artifacts转换为IDE文件格式
    const files: IDEFile[] = await Promise.all(
      codeArtifacts.map(async (artifact, index) => {
        // 如果没有内容，尝试加载
        let content = artifact.content || '';
        if (!content && artifact.url) {
          content = await loadArtifactContent(artifact.url);
        }

        // 从文件扩展名推断语言
        const getLanguage = (fileName: string): string => {
          const ext = fileName.split('.').pop()?.toLowerCase();
          const languageMap: Record<string, string> = {
            ts: 'typescript',
            tsx: 'typescript',
            js: 'javascript',
            jsx: 'javascript',
            py: 'python',
            java: 'java',
            go: 'go',
            rs: 'rust',
            cpp: 'cpp',
            c: 'c',
            cs: 'csharp',
            json: 'json',
            md: 'markdown',
          };
          return languageMap[ext || ''] || 'plaintext';
        };

        return {
          id: `${stageId}-file-${index}`,
          name: artifact.name,
          path: artifact.filePath || `/generated/${artifact.name}`,
          content,
          language: artifact.language || getLanguage(artifact.name),
          isModified: false,
        };
      })
    );

    setIdeFiles(files);
    setIdeTitle(`${stage.name} - 代码编辑器`);
    setCurrentEditingStageId(stageId);
    setIdeVisible(true);
  }, [pipeline.stages]);

  // 保存IDE中的文件修改
  const handleSaveIDEFiles = useCallback((updatedFiles: IDEFile[]) => {
    if (!currentEditingStageId) return;

    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) => {
        if (stage.id !== currentEditingStageId) return stage;

        return {
          ...stage,
          artifacts: stage.artifacts.map((artifact) => {
            // 找到对应的更新文件
            const updatedFile = updatedFiles.find(
              (f) => f.name === artifact.name || f.path === artifact.filePath
            );

            if (updatedFile && artifact.type === ArtifactType.CODE) {
              return {
                ...artifact,
                content: updatedFile.content,
              };
            }

            return artifact;
          }),
        };
      }),
    }));

    message.success('代码已保存到流水线');
  }, [currentEditingStageId]);

  // 关闭IDE
  const handleCloseIDE = useCallback(() => {
    setIdeVisible(false);
    setIdeFiles([]);
    setIdeTitle('');
    setCurrentEditingStageId(null);
  }, []);

  // Git提交和推送
  const handleGitCommit = useCallback(async (commitMessage: string) => {
    // 这里是Git操作的Mock实现
    // 实际项目中应该调用后端API执行真实的Git命令
    return new Promise<void>((resolve, reject) => {
      // 模拟Git操作延迟
      setTimeout(() => {
        try {
          console.log('执行Git操作:');
          console.log('1. git add .');
          console.log('2. git commit -m "' + commitMessage + '"');
          console.log('3. git push');

          // 模拟成功
          resolve();

          // 如果需要模拟失败，可以使用：
          // reject('推送被拒绝，请先拉取远程更改');
        } catch (error) {
          reject(error);
        }
      }, 2000); // 模拟2秒的网络延迟
    });
  }, []);

  // 处理部署配置确认
  const handleDeployConfirm = useCallback(async (config: { environment: 'dev' | 'staging' | 'production'; mode: 'auto' | 'manual'; commitMessage: string }) => {
    setDeployConfigVisible(false);
    setDeploymentEnvironment(config.environment);
    setDeploymentLogs([]);
    setDeploymentProgress(0);

    // 找到部署节点
    const deploymentStage = pipeline.stages.find((s) => s.type === StageType.DEPLOYMENT);
    if (!deploymentStage) return;

    // 设置部署节点为运行中
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((s) =>
        s.type === StageType.DEPLOYMENT
          ? {
              ...s,
              status: StageStatus.RUNNING,
              startedAt: new Date().toISOString(),
              expanded: true,
              logs: [],
              metrics: undefined,
            }
          : s
      ),
    }));

    // Mock部署流程
    const addLog = (message: string, level: 'info' | 'success' | 'error' | 'warning' = 'info') => {
      const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
      setDeploymentLogs((prev) => [...prev, { timestamp, message, level }]);
    };

    try {
      // 步骤1: Git提交（如果是auto模式）
      if (config.mode === 'auto') {
        addLog(`📝 提交代码到Git仓库...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addLog(`✓ Git提交成功: ${config.commitMessage}`, 'success');
        setDeploymentProgress(10);
      }

      // 步骤2: 触发CI/CD
      addLog(`🚀 触发${config.environment}环境的CI/CD流程...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addLog(`✓ CI/CD任务已创建 (Job ID: ${Math.random().toString(36).substring(7)})`, 'success');
      setDeploymentProgress(20);

      // 步骤3: 环境检查
      addLog(`🔍 检查${config.environment}环境状态...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog(`✓ 环境检查通过`, 'success');
      setDeploymentProgress(30);

      // 步骤4: 代码构建
      addLog(`🔨 开始构建应用...`);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      addLog(`  - 安装依赖包...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addLog(`  - 执行TypeScript编译...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog(`  - 打包生产环境代码...`);
      await new Promise((resolve) => setTimeout(resolve, 1800));
      addLog(`✓ 构建完成 (build-${Date.now()}.tar.gz)`, 'success');
      setDeploymentProgress(60);

      // 步骤5: 部署到环境
      addLog(`📦 部署到${config.environment}环境...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog(`  - 上传部署包...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addLog(`  - 停止旧版本服务...`);
      await new Promise((resolve) => setTimeout(resolve, 800));
      addLog(`  - 启动新版本服务...`);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      addLog(`  - 配置负载均衡...`);
      await new Promise((resolve) => setTimeout(resolve, 600));
      addLog(`✓ 部署成功`, 'success');
      setDeploymentProgress(80);

      // 步骤6: 健康检查
      addLog(`💊 执行健康检查...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog(`  - 端口检查: ✓`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLog(`  - HTTP健康检查: ✓`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLog(`  - API端点验证: ✓`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLog(`✓ 健康检查通过`, 'success');
      setDeploymentProgress(100);

      // 部署成功
      const envDomain = {
        dev: 'dev.example.com',
        staging: 'staging.example.com',
        production: 'www.example.com',
      };
      addLog(`🎉 部署成功！访问地址: https://${envDomain[config.environment]}`, 'success');

      // 更新部署节点状态为完成
      setPipeline((prev) => ({
        ...prev,
        stages: prev.stages.map((s) =>
          s.type === StageType.DEPLOYMENT
            ? {
                ...s,
                status: StageStatus.COMPLETED,
                completedAt: new Date().toISOString(),
                metrics: {
                  duration: 15,
                  cost: 0.02,
                },
              }
            : s
        ),
      }));

      message.success(`成功部署到${config.environment}环境！`);
    } catch (error) {
      addLog(`❌ 部署失败: ${error}`, 'error');
      setPipeline((prev) => ({
        ...prev,
        stages: prev.stages.map((s) =>
          s.type === StageType.DEPLOYMENT
            ? {
                ...s,
                status: StageStatus.FAILED,
              }
            : s
        ),
      }));
      message.error('部署失败，请重试');
    }
  }, [pipeline.stages]);

  // 渲染流水线可视化
  const renderPipelineVisualization = () => {
    return (
      <div
        style={{
          padding: '40px 20px',
          background: '#fafafa',
          borderRadius: '8px',
          marginBottom: '32px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            minWidth: 'fit-content',
          }}
        >
          {pipeline.stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* 节点 */}
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background:
                    stage.status === StageStatus.COMPLETED
                      ? '#52c41a'
                      : stage.status === StageStatus.RUNNING
                      ? '#1890ff'
                      : stage.status === StageStatus.WAITING_REVIEW
                      ? '#faad14'
                      : stage.status === StageStatus.FAILED
                      ? '#ff4d4f'
                      : '#d9d9d9',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  writingMode: 'vertical-rl',
                  letterSpacing: '2px',
                }}
              >
                {stage.name}
              </div>

              {/* 连接线 */}
              {index < pipeline.stages.length - 1 && (
                <ArrowRightOutlined style={{ fontSize: '20px', color: '#bfbfbf' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 顶部标题和操作 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            项目: {pipeline.projectName}
          </Title>
          <Text type="secondary">/ AI流水线</Text>
        </Space>

        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleRunAll}
          disabled={pipeline.isAutoRunning}
          loading={pipeline.isAutoRunning}
        >
          {pipeline.isAutoRunning ? '执行中...' : '一键执行所有'}
        </Button>
      </div>

      {/* 流水线可视化 */}
      {renderPipelineVisualization()}

      <Divider orientation="left">
        <Text strong style={{ fontSize: '16px' }}>
          阶段详情
        </Text>
      </Divider>

      {/* 阶段列表 */}
      <div>
        {pipeline.stages.map((stage) =>
          stage.type === StageType.DEPLOYMENT ? (
            <DeploymentStageCard
              key={stage.id}
              stageName={stage.name}
              stageOrder={stage.order}
              environment={deploymentEnvironment}
              status={
                stage.status === StageStatus.PENDING
                  ? 'pending'
                  : stage.status === StageStatus.RUNNING
                  ? 'deploying'
                  : stage.status === StageStatus.COMPLETED
                  ? 'success'
                  : 'failed'
              }
              logs={deploymentLogs}
              deployUrl={
                stage.status === StageStatus.COMPLETED
                  ? `https://jenkins.example.com/job/deploy-${deploymentEnvironment}/123`
                  : undefined
              }
              progress={deploymentProgress}
              onDeploy={() => handleRunStage(stage.id)}
            />
          ) : (
            <StageCard
              key={stage.id}
              stage={stage}
              onRun={handleRunStage}
              onApprove={handleApproveStage}
              onEditArtifact={handleEditArtifact}
              onOpenInIDE={handleOpenInIDE}
            />
          )
        )}
      </div>

      {/* 部署配置弹窗 */}
      <DeployConfigModal
        visible={deployConfigVisible}
        projectName={pipeline.projectName}
        onConfirm={handleDeployConfirm}
        onCancel={() => setDeployConfigVisible(false)}
      />

      {/* Web IDE */}
      <WebIDE
        visible={ideVisible}
        title={ideTitle}
        files={ideFiles}
        projectName={pipeline.projectName}
        onSave={handleSaveIDEFiles}
        onCommit={handleGitCommit}
        onClose={handleCloseIDE}
      />
    </div>
  );
};

export default PipelineView;
