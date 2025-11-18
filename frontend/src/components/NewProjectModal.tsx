import React from 'react';
import { Modal, Form, Input } from 'antd';
import type { CreateProjectInput } from '../types/project';

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
      title="新建项目"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="创建"
      cancelText="取消"
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          label="项目名称"
          name="name"
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 100, message: '项目名称不能超过100个字符' },
          ]}
        >
          <Input placeholder="WebApp-Frontend" />
        </Form.Item>

        <Form.Item
          label="Git 仓库地址 (可选)"
          name="repository"
          rules={[
            {
              pattern: /^(https?:\/\/|git@).+/,
              message: '请输入有效的Git仓库地址',
            },
          ]}
        >
          <Input placeholder="https://github.com/your-org/webapp-frontend.git" />
        </Form.Item>

        <Form.Item
          label="分支名 (可选)"
          name="branch"
        >
          <Input placeholder="main" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewProjectModal;
