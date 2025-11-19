import React, { useState, useEffect } from 'react';
import { Modal, Steps, Progress, Typography, Space, Alert, Button } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export type DeployStatus = 'idle' | 'deploying' | 'success' | 'failed';

export interface DeployStep {
  title: string;
  description: string;
  status: 'wait' | 'process' | 'finish' | 'error';
  log?: string;
  duration?: number;
}

interface DeployModalProps {
  visible: boolean;
  projectName: string;
  onClose: () => void;
  onDeploy: () => Promise<void>;
}

const DeployModal: React.FC<DeployModalProps> = ({
  visible,
  projectName,
  onClose,
  onDeploy,
}) => {
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<DeployStep[]>([
    { title: '环境准备', description: '检查部署环境和依赖', status: 'wait' },
    { title: '代码构建', description: '编译和打包项目代码', status: 'wait' },
    { title: '资源上传', description: '上传构建产物到服务器', status: 'wait' },
    { title: '服务启动', description: '启动应用服务', status: 'wait' },
    { title: '健康检查', description: '验证服务运行状态', status: 'wait' },
  ]);

  // 重置状态
  useEffect(() => {
    if (visible) {
      setDeployStatus('idle');
      setCurrentStep(0);
      setProgress(0);
      setLogs([]);
      setSteps([
        { title: '环境准备', description: '检查部署环境和依赖', status: 'wait' },
        { title: '代码构建', description: '编译和打包项目代码', status: 'wait' },
        { title: '资源上传', description: '上传构建产物到服务器', status: 'wait' },
        { title: '服务启动', description: '启动应用服务', status: 'wait' },
        { title: '健康检查', description: '验证服务运行状态', status: 'wait' },
      ]);
    }
  }, [visible]);

  // 添加日志
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // 更新步骤状态
  const updateStep = (index: number, status: DeployStep['status'], log?: string) => {
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, status, log } : step
      )
    );
  };

  // 模拟部署流程
  const startDeploy = async () => {
    setDeployStatus('deploying');
    setProgress(0);

    try {
      // 步骤1: 环境准备
      setCurrentStep(0);
      updateStep(0, 'process');
      addLog(`开始部署项目: ${projectName}`);
      addLog('正在检查部署环境...');
      await sleep(1000);
      addLog('✓ Node.js 环境检查通过 (v20.11.0)');
      await sleep(500);
      addLog('✓ Docker 环境检查通过 (v24.0.5)');
      await sleep(500);
      addLog('✓ 依赖包检查完成');
      updateStep(0, 'finish', '环境准备完成');
      setProgress(20);

      // 步骤2: 代码构建
      setCurrentStep(1);
      updateStep(1, 'process');
      addLog('开始构建项目...');
      await sleep(800);
      addLog('正在安装依赖包...');
      await sleep(1200);
      addLog('✓ 依赖安装完成 (233 packages)');
      await sleep(500);
      addLog('正在执行 TypeScript 编译...');
      await sleep(1000);
      addLog('✓ TypeScript 编译成功');
      await sleep(500);
      addLog('正在打包生产环境代码...');
      await sleep(1500);
      addLog('✓ 构建产物生成完成 (dist/index.html, 1.35 MB)');
      updateStep(1, 'finish', '代码构建完成');
      setProgress(40);

      // 步骤3: 资源上传
      setCurrentStep(2);
      updateStep(2, 'process');
      addLog('开始上传构建产物...');
      await sleep(800);
      addLog('连接到部署服务器 (deploy.example.com)...');
      await sleep(600);
      addLog('✓ 服务器连接成功');

      // 模拟上传进度
      for (let i = 0; i < 10; i++) {
        await sleep(200);
        const uploadProgress = Math.round(40 + (i + 1) * 2);
        setProgress(uploadProgress);
        if (i % 3 === 0) {
          addLog(`上传进度: ${(i + 1) * 10}%`);
        }
      }

      addLog('✓ 所有文件上传完成 (42 files, 1.35 MB)');
      updateStep(2, 'finish', '资源上传完成');
      setProgress(60);

      // 步骤4: 服务启动
      setCurrentStep(3);
      updateStep(3, 'process');
      addLog('开始启动应用服务...');
      await sleep(800);
      addLog('正在停止旧版本服务...');
      await sleep(600);
      addLog('✓ 旧版本服务已停止');
      await sleep(500);
      addLog('正在启动新版本容器...');
      await sleep(1000);
      addLog('✓ 容器启动成功 (container-id: a3f2b9c1)');
      await sleep(500);
      addLog('正在配置负载均衡...');
      await sleep(700);
      addLog('✓ 负载均衡配置完成');
      updateStep(3, 'finish', '服务启动完成');
      setProgress(80);

      // 步骤5: 健康检查
      setCurrentStep(4);
      updateStep(4, 'process');
      addLog('开始健康检查...');
      await sleep(800);
      addLog('正在检查服务端口 (8080)...');
      await sleep(500);
      addLog('✓ 端口检查通过');
      await sleep(500);
      addLog('正在检查 HTTP 服务...');
      await sleep(600);
      addLog('✓ HTTP 200 OK');
      await sleep(500);
      addLog('正在检查 API 端点...');
      await sleep(700);
      addLog('✓ 所有 API 端点响应正常');
      updateStep(4, 'finish', '健康检查通过');
      setProgress(100);

      // 部署成功
      await sleep(500);
      addLog('🎉 部署成功！');
      addLog(`访问地址: https://${projectName}.example.com`);
      setDeployStatus('success');

      // 调用外部部署回调
      await onDeploy();
    } catch (error) {
      // 部署失败
      setDeployStatus('failed');
      addLog('❌ 部署失败: ' + (error as Error).message);
      updateStep(currentStep, 'error', '部署失败');
    }
  };

  // 关闭弹窗
  const handleClose = () => {
    if (deployStatus === 'deploying') {
      Modal.confirm({
        title: '确认关闭',
        content: '部署正在进行中，确定要关闭吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <Modal
      title={
        <Space>
          <RocketOutlined />
          <span>一键部署 - {projectName}</span>
        </Space>
      }
      open={visible}
      width={800}
      onCancel={handleClose}
      footer={
        <Space>
          <Button onClick={handleClose}>
            {deployStatus === 'deploying' ? '取消' : '关闭'}
          </Button>
          {deployStatus === 'idle' && (
            <Button type="primary" icon={<RocketOutlined />} onClick={startDeploy}>
              开始部署
            </Button>
          )}
          {deployStatus === 'success' && (
            <Button type="primary" onClick={startDeploy}>
              重新部署
            </Button>
          )}
          {deployStatus === 'failed' && (
            <Button type="primary" danger onClick={startDeploy}>
              重试
            </Button>
          )}
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 部署状态提示 */}
        {deployStatus === 'success' && (
          <Alert
            message="部署成功"
            description={`项目已成功部署到生产环境，访问地址: https://${projectName}.example.com`}
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}
        {deployStatus === 'failed' && (
          <Alert
            message="部署失败"
            description="部署过程中出现错误，请查看日志并重试"
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
          />
        )}

        {/* 部署进度 */}
        {deployStatus === 'deploying' && (
          <div>
            <Text type="secondary">部署进度</Text>
            <Progress percent={progress} status="active" />
          </div>
        )}

        {/* 部署步骤 */}
        <Steps
          current={currentStep}
          direction="vertical"
          size="small"
          items={steps.map((step) => ({
            title: step.title,
            description: step.description,
            status: step.status,
            icon:
              step.status === 'process' ? (
                <LoadingOutlined />
              ) : step.status === 'finish' ? (
                <CheckCircleOutlined />
              ) : step.status === 'error' ? (
                <CloseCircleOutlined />
              ) : undefined,
          }))}
        />

        {/* 部署日志 */}
        {logs.length > 0 && (
          <div>
            <Text type="secondary">部署日志</Text>
            <div
              style={{
                marginTop: 8,
                padding: 12,
                background: '#000',
                borderRadius: 4,
                maxHeight: 200,
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              {logs.map((log, index) => (
                <Paragraph
                  key={index}
                  style={{
                    color: log.includes('✓') || log.includes('🎉')
                      ? '#52c41a'
                      : log.includes('❌')
                      ? '#ff4d4f'
                      : '#d9d9d9',
                    margin: '2px 0',
                    fontSize: 12,
                  }}
                >
                  {log}
                </Paragraph>
              ))}
            </div>
          </div>
        )}
      </Space>
    </Modal>
  );
};

// 辅助函数：延迟
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default DeployModal;
