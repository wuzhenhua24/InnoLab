import React from 'react';
import { Modal, Form, Input, Button, Space, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined, FolderOutlined, GithubOutlined, BranchesOutlined } from '@ant-design/icons';
import type { CreateProjectInput } from '../types/project';
import { useTheme } from '../contexts/ThemeContext';

interface NewProjectModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateProjectInput) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FolderOutlined style={{ color: isDark ? '#0a0e17' : '#ffffff', fontSize: '16px' }} />
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '16px' }}>新建项目</span>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="创建"
      cancelText="取消"
      width={640}
      styles={{
        content: {
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '16px',
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid var(--border-primary)',
          paddingBottom: '16px',
        },
        body: {
          padding: '24px',
        },
        footer: {
          background: 'transparent',
          borderTop: '1px solid var(--border-primary)',
          paddingTop: '16px',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ repositories: [{}] }}
      >
        {/* 项目名称 */}
        <Form.Item
          label={
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
              项目名称
            </span>
          }
          name="name"
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 100, message: '项目名称不能超过100个字符' },
          ]}
        >
          <Input
            placeholder="我的AI项目"
            size="large"
            style={{
              background: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--text-primary)',
            }}
          />
        </Form.Item>

        {/* 分隔线 */}
        <Divider
          orientation="left"
          style={{
            marginTop: '28px',
            marginBottom: '20px',
            borderColor: 'var(--border-primary)',
          }}
        >
          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em' }}>
            Git 仓库配置
          </span>
        </Divider>

        {/* 仓库列表 */}
        <Form.List name="repositories">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div
                  key={key}
                  style={{
                    marginBottom: 16,
                    padding: '20px',
                    background: 'var(--bg-surface)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-primary)',
                    position: 'relative',
                  }}
                >
                  {/* 仓库序号标签 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '16px',
                      padding: '2px 10px',
                      background: isDark ? 'rgba(0, 212, 255, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                      border: `1px solid ${isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(14, 165, 233, 0.2)'}`,
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                    }}
                  >
                    仓库 {index + 1}
                  </div>

                  {/* 删除按钮 */}
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        fontSize: '16px',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'color 0.2s ease',
                      }}
                      onClick={() => remove(name)}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-red)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                    />
                  )}

                  <Space direction="vertical" style={{ width: '100%' }} size={12}>
                    {/* 仓库名称 */}
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: '请输入仓库名称' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        prefix={<FolderOutlined style={{ color: 'var(--text-tertiary)' }} />}
                        placeholder="如：frontend、backend"
                        style={{
                          background: 'var(--bg-primary)',
                          borderColor: 'var(--border-primary)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </Form.Item>

                    {/* 仓库地址 */}
                    <Form.Item
                      {...restField}
                      name={[name, 'url']}
                      rules={[
                        { required: true, message: '请输入仓库地址' },
                        {
                          pattern: /^(https?:\/\/|git@).+/,
                          message: '请输入有效的Git仓库地址',
                        },
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        prefix={<GithubOutlined style={{ color: 'var(--text-tertiary)' }} />}
                        placeholder="https://github.com/your-org/repo.git"
                        style={{
                          background: 'var(--bg-primary)',
                          borderColor: 'var(--border-primary)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </Form.Item>

                    {/* 分支 */}
                    <Form.Item
                      {...restField}
                      name={[name, 'branch']}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        prefix={<BranchesOutlined style={{ color: 'var(--text-tertiary)' }} />}
                        placeholder="如：main、develop（可选）"
                        style={{
                          background: 'var(--bg-primary)',
                          borderColor: 'var(--border-primary)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </Form.Item>
                  </Space>
                </div>
              ))}

              {/* 添加仓库按钮 */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{
                    height: '44px',
                    background: 'transparent',
                    borderColor: 'var(--border-secondary)',
                    color: 'var(--text-secondary)',
                    borderRadius: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-accent)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-secondary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  添加仓库
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default NewProjectModal;
