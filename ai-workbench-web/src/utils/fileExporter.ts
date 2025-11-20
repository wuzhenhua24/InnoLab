import JSZip from 'jszip';
import type { IDEFile } from '../types/pipeline';

/**
 * 导出文件到ZIP并下载
 * @param files - IDE文件数组
 * @param projectName - 项目名称（用于生成ZIP文件名）
 */
export async function exportFilesToZip(
  files: IDEFile[],
  projectName: string = 'workspace'
): Promise<void> {
  try {
    // 创建ZIP实例
    const zip = new JSZip();

    // 添加文件到ZIP，保持目录结构
    files.forEach((file) => {
      // 移除路径开头的 '/' 以避免ZIP中出现空目录
      const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
      zip.file(cleanPath, file.content);
    });

    // 生成ZIP文件
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6, // 压缩级别 0-9，6是推荐值
      },
    });

    // 生成文件名：项目名-时间戳.zip
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `${projectName}-${timestamp}.zip`;

    // 触发浏览器下载
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('导出文件失败:', error);
    throw new Error('导出文件失败，请重试');
  }
}

/**
 * 触发浏览器下载Blob
 * @param blob - 文件Blob对象
 * @param filename - 文件名
 */
function downloadBlob(blob: Blob, filename: string): void {
  // 创建临时链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 获取文件大小的可读格式
 * @param bytes - 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
