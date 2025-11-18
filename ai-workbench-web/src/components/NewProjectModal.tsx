import React from 'react';
import { Modal, Form, Input, Button, Space, Typography, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { CreateProjectInput } from '../types/project';

const { Text } = Typography;

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
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '24px' }}
        initialValues={{ repositories: [{}] }}
      >
        <Form.Item
          label="项目名称"
          name="name"
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 100, message: '项目名称不能超过100个字符' },
          ]}
        >
          <Input placeholder="我的AI项目" size="large" />
        </Form.Item>

        <Divider orientation="left" style={{ marginTop: '32px', marginBottom: '24px' }}>
          <Text type="secondary">Git 仓库配置</Text>
        </Divider>

        <Form.List name="repositories">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 16,
                    padding: '16px',
                    background: '#fafafa',
                    borderRadius: '8px',
                    position: 'relative',
                  }}
                  align="start"
                >
                  <div style={{ flex: 1, width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: '请输入仓库名称' }]}
                        style={{ marginBottom: '8px' }}
                      >
                        <Input
                          placeholder="如：frontend、backend"
                          size="large"
                        />
                      </Form.Item>

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
                        style={{ marginBottom: '8px' }}
                      >
                        <Input
                          placeholder="https://github.com/your-org/repo.git"
                          size="large"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'branch']}
                        style={{ marginBottom: 0 }}
                      >
                        <Input
                          placeholder="如：main、develop"
                          size="large"
                        />
                      </Form.Item>
                    </Space>
                  </div>

                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      style={{
                        fontSize: '18px',
                        color: '#ff4d4f',
                        cursor: 'pointer',
                        marginTop: '8px',
                      }}
                      onClick={() => remove(name)}
                    />
                  )}
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
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
