import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Button, Space, Radio } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export interface DeployConfig {
  environment: 'dev' | 'staging' | 'production';
  mode: 'auto' | 'manual';
  commitMessage: string;
}

interface DeployConfigModalProps {
  visible: boolean;
  projectName: string;
  onConfirm: (config: DeployConfig) => void;
  onCancel: () => void;
}

const DeployConfigModal: React.FC<DeployConfigModalProps> = ({
  visible,
  projectName,
  onConfirm,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [environment, setEnvironment] = useState<DeployConfig['environment']>('dev');

  // 重置表单
  useEffect(() => {
    if (visible) {
      // 生成默认commit message
      const defaultMessage = `feat: [AI] Deploy ${projectName} to development environment`;
      form.setFieldsValue({
        environment: 'dev',
        mode: 'auto',
        commitMessage: defaultMessage,
      });
      setEnvironment('dev');
    }
  }, [visible, projectName, form]);

  // 环境变更时更新commit message
  const handleEnvironmentChange = (value: DeployConfig['environment']) => {
    setEnvironment(value);
    const envMap = {
      dev: 'development',
      staging: 'staging',
      production: 'production',
    };
    const newMessage = `feat: [AI] Deploy ${projectName} to ${envMap[value]} environment`;
    form.setFieldsValue({ commitMessage: newMessage });
  };

  // 提交表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <RocketOutlined />
          <span>部署应用 (Deploy Application)</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" icon={<RocketOutlined />} onClick={handleOk}>
            部署到 {environment === 'dev' ? 'Dev' : environment === 'staging' ? 'Staging' : 'Production'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          environment: 'dev',
          mode: 'auto',
          commitMessage: `feat: [AI] Deploy ${projectName} to development environment`,
        }}
      >
        {/* 目标环境 */}
        <Form.Item
          label="目标环境 (Target Environment)"
          name="environment"
          rules={[{ required: true, message: '请选择部署环境' }]}
        >
          <Select
            size="large"
            onChange={handleEnvironmentChange}
            options={[
              {
                value: 'dev',
                label: '🔧 Dev/测试环境 (Development)',
                description: '用于开发和功能测试',
              },
              {
                value: 'staging',
                label: '🔬 Staging/回归环境 (Staging)',
                description: '用于集成测试和验收',
              },
              {
                value: 'production',
                label: '🚀 Production/生产环境 (Production)',
                description: '正式生产环境',
              },
            ]}
            optionRender={(option) => (
              <div>
                <div style={{ fontWeight: 500 }}>{option.data.label}</div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  {option.data.description}
                </div>
              </div>
            )}
          />
        </Form.Item>

        {/* 部署模式 */}
        <Form.Item
          label="部署模式 (Mode)"
          name="mode"
          rules={[{ required: true, message: '请选择部署模式' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="auto">
                <strong>自动提交并部署 (Commit & Push)</strong>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginLeft: 24 }}>
                  自动将当前更改提交到Git并触发CI/CD流程
                </div>
              </Radio>
              <Radio value="manual">
                <strong>仅触发部署 (Deploy Only)</strong>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginLeft: 24 }}>
                  基于当前分支最新commit触发部署
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        {/* Commit Message (仅在自动模式下显示) */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.mode !== currentValues.mode}>
          {({ getFieldValue }) =>
            getFieldValue('mode') === 'auto' ? (
              <Form.Item
                label="Commit Message (自动生成，可编辑)"
                name="commitMessage"
                rules={[
                  { required: true, message: '请输入commit message' },
                  { min: 10, message: 'Commit message至少10个字符' },
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="请输入commit message"
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        {/* 提示信息 */}
        <div
          style={{
            padding: 12,
            background: '#f0f5ff',
            borderRadius: 4,
            fontSize: 12,
            color: '#1890ff',
          }}
        >
          💡 <strong>提示：</strong>
          部署将触发外部CI/CD系统（如Jenkins、GitLab CI等），请确保已配置正确的部署流水线。
          {environment === 'production' && (
            <div style={{ marginTop: 8, color: '#ff4d4f' }}>
              ⚠️ <strong>警告：</strong>您正在部署到生产环境，请谨慎操作！
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default DeployConfigModal;
