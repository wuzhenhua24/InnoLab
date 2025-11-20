/**
 * 产出物文件加载工具
 * 用于从public目录加载真实的artifact文件内容
 */

/**
 * 加载artifact文件内容
 * @param url artifact文件URL
 * @returns 文件内容
 */
export async function loadArtifactContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`加载文件失败: ${response.statusText}`);
    }
    const content = await response.text();
    return content;
  } catch (error) {
    console.error('加载artifact失败:', error);
    return `# 文件加载失败\n\n无法加载文件: ${url}\n\n错误信息: ${error}`;
  }
}

/**
 * 预加载所有artifact文件内容
 * @param artifacts artifact列表
 * @returns 包含内容的artifact列表
 */
export async function preloadArtifacts<T extends { url: string; content?: string }>(
  artifacts: T[]
): Promise<T[]> {
  const loadPromises = artifacts.map(async (artifact) => {
    if (!artifact.content) {
      const content = await loadArtifactContent(artifact.url);
      return { ...artifact, content };
    }
    return artifact;
  });

  return Promise.all(loadPromises);
}
