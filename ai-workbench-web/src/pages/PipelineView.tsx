import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Modal, message, Tooltip } from 'antd';
import { ThunderboltOutlined, ArrowLeftOutlined, CheckCircleFilled, ClockCircleFilled, LoadingOutlined, CloseCircleFilled, EyeFilled } from '@ant-design/icons';
import StageCard from '../components/StageCard';
import WebIDE from '../components/WebIDE';
import DeployConfigModal from '../components/DeployConfigModal';
import DeploymentStageCard from '../components/DeploymentStageCard';
import type { Pipeline, LogEntry, ExecutionMetrics, StageArtifact, IDEFile } from '../types/pipeline';
import { StageStatus, StageType, LogLevel, ArtifactType } from '../types/pipeline';
import { loadArtifactContent } from '../utils/artifactLoader';
import { useThemeColors } from '../contexts/ThemeContext';

const { Title, Text } = Typography;

const PipelineView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const colors = useThemeColors();

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
            content: '',
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
            content: '',
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
  const [deploymentEnvironment, setDeploymentEnvironment] = useState<'test' | 'staging' | 'production'>('test');
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
  }, []);

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
      duration: Math.floor(Math.random() * 10 + 5),
      tokenUsage: Math.floor(Math.random() * 5000 + 1000),
    };
  };

  // Mock: 模拟实时日志流
  const simulateLogStreaming = (
    stageId: string,
    logs: LogEntry[],
    onComplete: () => void
  ) => {
    let currentIndex = 0;
    const interval = 400;

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
        onComplete();
      }
    }, interval);

    return streamInterval;
  };

  // 运行单个阶段
  const handleRunStage = useCallback((stageId: string) => {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return;

    if (stage.type === StageType.DEPLOYMENT) {
      setDeployConfigVisible(true);
      return;
    }

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

    const mockLogs = generateMockLogs(stage.name);
    simulateLogStreaming(stageId, mockLogs, () => {
      setPipeline((prev) => ({
        ...prev,
        stages: prev.stages.map((s) => {
          if (s.id !== stageId) return s;

          const isCodeStage = s.type === StageType.CODE_DEV || s.type === StageType.TEST_SCRIPT;
          const artifactType = isCodeStage ? ArtifactType.CODE : ArtifactType.MARKDOWN;
          const fileExtension = isCodeStage ? 'ts' : 'md';
          const fileName = `${s.type}.${fileExtension}`;
          const artifactUrl = `/artifacts/${fileName}`;

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
                content: '',
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
        if (index === stageIndex + 1 && stage.status === StageStatus.PENDING) {
          return { ...stage };
        }
        return stage;
      });

      return { ...prev, stages: updatedStages };
    });
    message.success('阶段已批准，下一阶段已激活');
  }, []);

  // 拒绝阶段（重新生成）
  const handleRejectStage = useCallback((stageId: string) => {
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) => {
        if (stage.id === stageId) {
          return {
            ...stage,
            status: StageStatus.PENDING,
            artifacts: [],
            logs: [],
            metrics: undefined,
            startedAt: undefined,
            completedAt: undefined,
            error: undefined,
          };
        }
        return stage;
      }),
    }));
    message.info('已拒绝，请重新输入需求并生成');
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

        const pendingStages = pipeline.stages.filter((s) => s.status === StageStatus.PENDING);
        let cumulativeDelay = 500;

        pendingStages.forEach((stage, index) => {
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

            const mockLogs = generateMockLogs(stage.name);
            simulateLogStreaming(stage.id, mockLogs, () => {
              setPipeline((prev) => ({
                ...prev,
                stages: prev.stages.map((s) => {
                  if (s.id !== stage.id) return s;

                  const isCodeStage = s.type === StageType.CODE_DEV || s.type === StageType.TEST_SCRIPT;
                  const artifactType = isCodeStage ? ArtifactType.CODE : ArtifactType.MARKDOWN;
                  const fileExtension = isCodeStage ? 'ts' : 'md';
                  const fileName = `${s.type}.${fileExtension}`;
                  const artifactUrl = `/artifacts/${fileName}`;

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
                        content: '',
                        filePath: isCodeStage ? `/src/generated/${fileName}` : undefined,
                        language: isCodeStage ? 'typescript' : undefined,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  };
                }),
              }));

              if (index === pendingStages.length - 1) {
                message.success('流水线执行完成！');
                setPipeline((prev) => ({ ...prev, isAutoRunning: false }));
              }
            });
          }, cumulativeDelay);

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

    const files: IDEFile[] = await Promise.all(
      codeArtifacts.map(async (artifact, index) => {
        let content = artifact.content || '';
        if (!content && artifact.url) {
          content = await loadArtifactContent(artifact.url);
        }

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
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('执行Git操作:');
          console.log('1. git add .');
          console.log('2. git commit -m "' + commitMessage + '"');
          console.log('3. git push');
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 2000);
    });
  }, []);

  // 处理部署配置确认
  const handleDeployConfirm = useCallback(async (config: { environment: 'test' | 'staging' | 'production'; mode: 'auto' | 'manual'; commitMessage: string }) => {
    setDeployConfigVisible(false);
    setDeploymentEnvironment(config.environment);
    setDeploymentLogs([]);
    setDeploymentProgress(0);

    const deploymentStage = pipeline.stages.find((s) => s.type === StageType.DEPLOYMENT);
    if (!deploymentStage) return;

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

    const addLog = (message: string, level: 'info' | 'success' | 'error' | 'warning' = 'info') => {
      const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
      setDeploymentLogs((prev) => [...prev, { timestamp, message, level }]);
    };

    try {
      if (config.mode === 'auto') {
        addLog(`📝 提交代码到Git仓库...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addLog(`✓ Git提交成功: ${config.commitMessage}`, 'success');
        setDeploymentProgress(10);
      }

      addLog(`🚀 触发${config.environment}环境的CI/CD流程...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addLog(`✓ CI/CD任务已创建 (Job ID: ${Math.random().toString(36).substring(7)})`, 'success');
      setDeploymentProgress(20);

      addLog(`🔍 检查${config.environment}环境状态...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog(`✓ 环境检查通过`, 'success');
      setDeploymentProgress(30);

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

      const envDomain = {
        test: 'test.example.com',
        staging: 'staging.example.com',
        production: 'www.example.com',
      };
      addLog(`🎉 部署成功！访问地址: https://${envDomain[config.environment]}`, 'success');

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

  // 获取状态图标
  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case StageStatus.COMPLETED:
        return <CheckCircleFilled style={{ color: colors.success, fontSize: '16px' }} />;
      case StageStatus.RUNNING:
        return <LoadingOutlined style={{ color: colors.primary, fontSize: '16px' }} spin />;
      case StageStatus.WAITING_REVIEW:
        return <EyeFilled style={{ color: colors.warning, fontSize: '16px' }} />;
      case StageStatus.FAILED:
        return <CloseCircleFilled style={{ color: colors.error, fontSize: '16px' }} />;
      default:
        return <ClockCircleFilled style={{ color: colors.textMuted, fontSize: '16px' }} />;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: StageStatus) => {
    switch (status) {
      case StageStatus.COMPLETED:
        return { bg: `${colors.success}26`, border: `${colors.success}66`, glow: `${colors.success}4d` };
      case StageStatus.RUNNING:
        return { bg: `${colors.primary}26`, border: `${colors.primary}80`, glow: `${colors.primary}66` };
      case StageStatus.WAITING_REVIEW:
        return { bg: `${colors.warning}26`, border: `${colors.warning}66`, glow: `${colors.warning}4d` };
      case StageStatus.FAILED:
        return { bg: `${colors.error}26`, border: `${colors.error}66`, glow: `${colors.error}4d` };
      default:
        return { bg: `${colors.textMuted}26`, border: `${colors.textMuted}4d`, glow: 'transparent' };
    }
  };

  // 计算完成进度
  const completedStages = pipeline.stages.filter(s => s.status === StageStatus.COMPLETED).length;
  const progressPercent = Math.round((completedStages / pipeline.stages.length) * 100);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/projects')}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: colors.bgSurface,
              border: `1px solid ${colors.borderPrimary}`,
              color: colors.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.borderAccent;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.borderPrimary;
              e.currentTarget.style.color = colors.textSecondary;
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: '18px' }} />
          </button>

          {/* Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Title level={2} style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: colors.textPrimary }}>
                {pipeline.projectName}
              </Title>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  background: `${colors.primary}1a`,
                  border: `1px solid ${colors.primary}33`,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.primary,
                }}
              >
                开发者流水线
              </span>
            </div>
            <Text style={{ color: colors.textTertiary, fontSize: '14px' }}>
              AI 驱动的智能研发流程 · {completedStages}/{pipeline.stages.length} 阶段完成
            </Text>
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleRunAll}
          disabled={pipeline.isAutoRunning}
          loading={pipeline.isAutoRunning}
          style={{
            height: '48px',
            padding: '0 28px',
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {pipeline.isAutoRunning ? '执行中...' : '一键执行全部'}
        </Button>
      </div>

      {/* Pipeline Visualization */}
      <div
        style={{
          position: 'relative',
          padding: '40px 32px',
          marginBottom: '40px',
          borderRadius: '20px',
          background: colors.gradientSecondary,
          border: `1px solid ${colors.borderPrimary}`,
          overflow: 'hidden',
        }}
      >
        {/* Background Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${colors.borderPrimary} 1px, transparent 1px),
              linear-gradient(90deg, ${colors.borderPrimary} 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
          }}
        />

        {/* Progress Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: colors.bgSurface,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.success} 100%)`,
              transition: 'width 0.5s ease',
              boxShadow: `0 0 20px ${colors.primaryGlow}`,
            }}
          />
        </div>

        {/* Pipeline Nodes */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {pipeline.stages.map((stage, index) => {
            const statusColors = getStatusColor(stage.status);
            return (
              <React.Fragment key={stage.id}>
                {/* Node */}
                <Tooltip
                  title={
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{stage.name}</div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>{stage.description}</div>
                    </div>
                  }
                  placement="top"
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Circle Node */}
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: statusColors.bg,
                        border: `2px solid ${statusColors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: stage.status === StageStatus.RUNNING ? `0 0 30px ${statusColors.glow}` : 'none',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                      }}
                    >
                      {getStatusIcon(stage.status)}

                      {/* Pulse animation for running */}
                      {stage.status === StageStatus.RUNNING && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: '-4px',
                            borderRadius: '20px',
                            border: `2px solid ${statusColors.border}`,
                            animation: 'pulse 2s infinite',
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: colors.textTertiary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '2px',
                        }}
                      >
                        {stage.order === 0 ? 'S' : `0${stage.order}`}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: stage.status === StageStatus.PENDING ? colors.textTertiary : colors.textPrimary,
                          maxWidth: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {stage.name}
                      </div>
                    </div>
                  </div>
                </Tooltip>

                {/* Connector Line */}
                {index < pipeline.stages.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      margin: '0 8px',
                      marginBottom: '36px',
                      background: index < completedStages
                        ? `linear-gradient(90deg, ${colors.success}80 0%, ${colors.primary}80 100%)`
                        : `${colors.textMuted}4d`,
                      borderRadius: '1px',
                      position: 'relative',
                    }}
                  >
                    {/* Arrow */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '-4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderLeft: `6px solid ${index < completedStages ? `${colors.primary}80` : `${colors.textMuted}4d`}`,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Inline keyframes */}
        <style>{`
          @keyframes pulse {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0;
              transform: scale(1.2);
            }
            100% {
              opacity: 0;
              transform: scale(1.2);
            }
          }
        `}</style>
      </div>

      {/* Section Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: '4px',
            height: '24px',
            borderRadius: '2px',
            background: colors.gradientPrimary,
          }}
        />
        <Title level={4} style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
          阶段详情
        </Title>
      </div>

      {/* Stage Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              onReject={handleRejectStage}
              onEditArtifact={handleEditArtifact}
              onOpenInIDE={handleOpenInIDE}
            />
          )
        )}
      </div>

      {/* Modals */}
      <DeployConfigModal
        visible={deployConfigVisible}
        projectName={pipeline.projectName}
        onConfirm={handleDeployConfirm}
        onCancel={() => setDeployConfigVisible(false)}
      />

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
