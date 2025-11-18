# 测试领域标准模版

## 📋 文档信息

**版本:** V1.0
**创建日期:** 2025-11-18
**状态:** 标准模版
**用途:** 规范化测试文档的编写,支持知识采集和复用

---

## 🎯 模版说明

本文档定义了测试领域的标准化模版,包括:
- **测试计划模版** - 整体测试策略和计划
- **测试用例模版** - 详细的测试用例文档
- **测试报告模版** - 测试执行结果报告

所有模版都遵循"元数据头 + 语义标签 + 结构化内容"的标准化格式。

---

## 📐 1. 测试计划模版 (Test Plan Template)

### 1.1 模版结构

```markdown
---
metadata:
  doc_type: test_plan
  version: "1.0"
  project_id: [项目ID]
  project_name: [项目名称]
  test_type: [functional/integration/e2e/performance/security/regression]
  test_level: [unit/integration/system/acceptance]
  scope: [测试范围描述]
  priority: [high/medium/low]
  created_by: [创建人]
  team: [测试团队]
  tags: []
---

# [项目名称] 测试计划

<!-- @section:overview -->
## 测试概述

### 测试目标
[描述测试的主要目标,例如:验证核心功能、确保性能指标、保证安全合规等]

### 测试范围
**包含:**
- 功能模块1
- 功能模块2
- 接口测试
- 性能测试

**不包含:**
- 第三方服务
- 遗留系统
<!-- @end:overview -->

<!-- @section:test_strategy -->
## 测试策略

### 测试层级
<!-- @test_level:type=strategy -->
- **单元测试:** 覆盖率目标 80%+
- **集成测试:** 主要业务流程覆盖
- **系统测试:** 端到端场景验证
- **验收测试:** 用户故事验收
<!-- @end:test_level -->

### 测试类型
<!-- @test_types -->
- **功能测试:** 验证功能需求
- **性能测试:** 负载、压力、稳定性
- **安全测试:** 漏洞扫描、渗透测试
- **兼容性测试:** 浏览器、设备、操作系统
- **回归测试:** 自动化回归套件
<!-- @end:test_types -->

### 测试方法
- **手动测试:** [描述需要手动测试的场景]
- **自动化测试:** [描述自动化测试的范围和工具]
- **探索性测试:** [描述探索性测试的策略]
<!-- @end:test_strategy -->

<!-- @section:test_environment -->
## 测试环境

<!-- @environment:env=dev -->
### 开发环境 (DEV)
- **服务器:** [服务器配置]
- **数据库:** [数据库类型和版本]
- **测试数据:** [测试数据来源]
- **访问地址:** https://dev.example.com
<!-- @end:environment -->

<!-- @environment:env=staging -->
### 预发布环境 (STAGING)
- **服务器:** [服务器配置]
- **数据库:** [数据库类型和版本]
- **测试数据:** [测试数据来源]
- **访问地址:** https://staging.example.com
<!-- @end:environment -->

<!-- @environment:env=production -->
### 生产环境 (PRODUCTION)
- **监控方式:** [生产环境监控策略]
- **回滚方案:** [问题回滚方案]
<!-- @end:environment -->
<!-- @end:test_environment -->

<!-- @section:test_tools -->
## 测试工具

<!-- @tools:category=automation -->
### 自动化测试工具
- **单元测试:** Jest, Mocha, PyTest
- **E2E测试:** Playwright, Cypress, Selenium
- **API测试:** Postman, REST Assured, Supertest
- **性能测试:** JMeter, K6, Gatling
<!-- @end:tools -->

<!-- @tools:category=management -->
### 测试管理工具
- **用例管理:** TestRail, Zephyr, qTest
- **缺陷管理:** Jira, Bugzilla
- **CI/CD:** Jenkins, GitHub Actions, GitLab CI
<!-- @end:tools -->

<!-- @tools:category=monitoring -->
### 监控工具
- **性能监控:** New Relic, Datadog, Prometheus
- **日志分析:** ELK Stack, Splunk
- **错误追踪:** Sentry, Rollbar
<!-- @end:tools -->
<!-- @end:test_tools -->

<!-- @section:test_deliverables -->
## 测试交付物

<!-- @deliverable:id=TD-001 type=test_cases -->
### 测试用例
- **数量:** [预计测试用例数量]
- **格式:** [测试用例文档格式]
- **存储位置:** [测试用例存储路径]
<!-- @end:deliverable -->

<!-- @deliverable:id=TD-002 type=test_scripts -->
### 自动化测试脚本
- **框架:** [测试框架]
- **覆盖率:** [目标覆盖率]
- **存储位置:** [代码仓库路径]
<!-- @end:deliverable -->

<!-- @deliverable:id=TD-003 type=test_reports -->
### 测试报告
- **日报:** 每日测试执行摘要
- **周报:** 每周测试进展和问题汇总
- **最终报告:** 测试完成报告
<!-- @end:deliverable -->
<!-- @end:test_deliverables -->

<!-- @section:schedule -->
## 测试进度

<!-- @milestone:id=MS-001 phase=preparation -->
### 阶段1: 测试准备
- **开始时间:** YYYY-MM-DD
- **结束时间:** YYYY-MM-DD
- **主要任务:**
  - [ ] 测试计划评审
  - [ ] 测试环境搭建
  - [ ] 测试数据准备
  - [ ] 测试用例设计
<!-- @end:milestone -->

<!-- @milestone:id=MS-002 phase=execution -->
### 阶段2: 测试执行
- **开始时间:** YYYY-MM-DD
- **结束时间:** YYYY-MM-DD
- **主要任务:**
  - [ ] 功能测试执行
  - [ ] 集成测试执行
  - [ ] 性能测试执行
  - [ ] 安全测试执行
<!-- @end:milestone -->

<!-- @milestone:id=MS-003 phase=reporting -->
### 阶段3: 报告与总结
- **开始时间:** YYYY-MM-DD
- **结束时间:** YYYY-MM-DD
- **主要任务:**
  - [ ] 缺陷汇总分析
  - [ ] 测试报告编写
  - [ ] 经验教训总结
  - [ ] 测试评审会议
<!-- @end:milestone -->
<!-- @end:schedule -->

<!-- @section:risks -->
## 风险管理

<!-- @risk:id=RISK-001 severity=high probability=medium -->
### 风险1: 测试环境不稳定
- **描述:** 测试环境频繁宕机或性能不佳
- **影响:** 延迟测试进度,降低测试效率
- **缓解措施:**
  - 提前验证环境稳定性
  - 准备备用环境
  - 建立快速恢复机制
<!-- @end:risk -->

<!-- @risk:id=RISK-002 severity=medium probability=high -->
### 风险2: 需求变更频繁
- **描述:** 开发过程中需求频繁变更
- **影响:** 测试用例需要频繁更新,增加工作量
- **缓解措施:**
  - 采用敏捷测试方法
  - 建立快速响应机制
  - 自动化回归测试
<!-- @end:risk -->
<!-- @end:risks -->

<!-- @section:entry_exit_criteria -->
## 进入/退出准则

### 测试进入准则
- [ ] 测试计划已批准
- [ ] 测试环境已就绪
- [ ] 测试数据已准备
- [ ] 待测功能已开发完成
- [ ] 冒烟测试已通过

### 测试退出准则
- [ ] 所有计划测试用例已执行
- [ ] 关键缺陷已修复并验证
- [ ] 代码覆盖率达标(≥80%)
- [ ] 性能指标达标
- [ ] 测试报告已完成
<!-- @end:entry_exit_criteria -->

<!-- @section:approval -->
## 审批

| 角色 | 姓名 | 签名 | 日期 |
|------|------|------|------|
| 测试经理 | | | |
| 项目经理 | | | |
| 技术负责人 | | | |
<!-- @end:approval -->
```

---

## 📝 2. 测试用例模版 (Test Case Template)

### 2.1 模版结构

```markdown
---
metadata:
  doc_type: test_case
  version: "1.0"
  project_id: [项目ID]
  module: [功能模块]
  test_type: [functional/integration/performance/security]
  priority: [critical/high/medium/low]
  automation: [yes/no/planned]
  created_by: [创建人]
  tags: []
---

# [模块名称] 测试用例

<!-- @section:test_suite_overview -->
## 测试套件概述

### 测试目标
[描述本测试套件的目标]

### 覆盖范围
- 功能点1
- 功能点2
- 功能点3

### 前置条件
- 系统已部署到测试环境
- 测试数据已准备完成
- 测试账号已创建
<!-- @end:test_suite_overview -->

<!-- @section:test_cases -->
## 测试用例

<!-- @test_case:id=TC-001 priority=high type=positive automation=yes -->
### TC-001: 用户登录成功

**测试目标:** 验证用户使用正确的用户名和密码可以成功登录系统

**前置条件:**
- 用户账号已注册且处于激活状态
- 用户记得正确的用户名和密码

**测试步骤:**
1. 打开登录页面
2. 输入正确的用户名: `testuser@example.com`
3. 输入正确的密码: `Test@123456`
4. 点击"登录"按钮

**预期结果:**
- 系统验证通过
- 页面跳转到用户首页
- 显示用户名和头像
- 生成登录日志

**测试数据:**
```json
{
  "username": "testuser@example.com",
  "password": "Test@123456"
}
```

**实际结果:** [待填写]

**状态:** [Pass/Fail/Blocked/Skip]

**备注:** [可选]
<!-- @end:test_case -->

<!-- @test_case:id=TC-002 priority=high type=negative automation=yes -->
### TC-002: 用户登录失败 - 密码错误

**测试目标:** 验证用户使用错误的密码无法登录系统

**前置条件:**
- 用户账号已注册且处于激活状态

**测试步骤:**
1. 打开登录页面
2. 输入正确的用户名: `testuser@example.com`
3. 输入错误的密码: `WrongPassword123`
4. 点击"登录"按钮

**预期结果:**
- 系统显示错误提示: "用户名或密码错误"
- 用户停留在登录页面
- 登录失败次数+1
- 生成失败日志

**测试数据:**
```json
{
  "username": "testuser@example.com",
  "password": "WrongPassword123"
}
```

**实际结果:** [待填写]

**状态:** [Pass/Fail/Blocked/Skip]

**备注:** [可选]
<!-- @end:test_case -->

<!-- @test_case:id=TC-003 priority=medium type=boundary automation=yes -->
### TC-003: 用户名长度边界测试

**测试目标:** 验证系统对用户名长度的边界处理

**前置条件:**
- 系统用户名长度限制: 3-50字符

**测试步骤:**
1. 测试最小边界: 输入2个字符的用户名
2. 测试最小有效值: 输入3个字符的用户名
3. 测试最大有效值: 输入50个字符的用户名
4. 测试最大边界: 输入51个字符的用户名

**预期结果:**
- 2字符: 显示"用户名长度不能少于3个字符"
- 3字符: 接受输入
- 50字符: 接受输入
- 51字符: 显示"用户名长度不能超过50个字符"

**测试数据:**
```json
[
  {"username": "ab", "expected": "error"},
  {"username": "abc", "expected": "success"},
  {"username": "a".repeat(50), "expected": "success"},
  {"username": "a".repeat(51), "expected": "error"}
]
```

**实际结果:** [待填写]

**状态:** [Pass/Fail/Blocked/Skip]

**备注:** [可选]
<!-- @end:test_case -->

<!-- @test_case:id=TC-004 priority=medium type=security automation=yes -->
### TC-004: SQL注入防护测试

**测试目标:** 验证系统对SQL注入攻击的防护能力

**前置条件:**
- 系统已部署到测试环境

**测试步骤:**
1. 在用户名输入框输入: `admin' OR '1'='1`
2. 在密码输入框输入: `anything`
3. 点击登录按钮
4. 观察系统响应

**预期结果:**
- 系统拒绝登录请求
- 显示"用户名或密码错误"
- 不会暴露数据库错误信息
- 记录可疑登录尝试

**测试数据:**
```json
{
  "username": "admin' OR '1'='1",
  "password": "anything"
}
```

**实际结果:** [待填写]

**状态:** [Pass/Fail/Blocked/Skip]

**备注:** 安全测试,需要特别关注
<!-- @end:test_case -->

<!-- @test_case:id=TC-005 priority=critical type=performance automation=yes -->
### TC-005: 登录接口性能测试

**测试目标:** 验证登录接口在负载下的性能表现

**前置条件:**
- 系统已部署到性能测试环境
- 性能测试工具已配置

**测试步骤:**
1. 配置并发用户数: 100
2. 配置持续时间: 5分钟
3. 执行性能测试
4. 收集性能数据

**预期结果:**
- **响应时间:**
  - 平均响应时间 < 500ms
  - 95分位响应时间 < 1s
  - 99分位响应时间 < 2s
- **吞吐量:** ≥ 200 TPS
- **错误率:** < 1%
- **CPU使用率:** < 70%
- **内存使用率:** < 80%

**测试数据:**
```json
{
  "concurrent_users": 100,
  "duration": "5m",
  "ramp_up": "30s"
}
```

**实际结果:** [待填写]

**状态:** [Pass/Fail/Blocked/Skip]

**备注:** 需要在独立的性能测试环境执行
<!-- @end:test_case -->
<!-- @end:test_cases -->

<!-- @section:test_data -->
## 测试数据

<!-- @test_data:category=users -->
### 用户测试数据
```json
{
  "valid_users": [
    {
      "username": "testuser1@example.com",
      "password": "Test@123456",
      "role": "user"
    },
    {
      "username": "admin@example.com",
      "password": "Admin@123456",
      "role": "admin"
    }
  ],
  "invalid_users": [
    {
      "username": "nonexistent@example.com",
      "password": "Test@123456"
    }
  ]
}
```
<!-- @end:test_data -->

<!-- @test_data:category=boundary -->
### 边界值测试数据
```json
{
  "username_length": {
    "below_min": "ab",
    "min_valid": "abc",
    "max_valid": "a".repeat(50),
    "above_max": "a".repeat(51)
  },
  "password_length": {
    "below_min": "Aa1!",
    "min_valid": "Aa1!1234",
    "max_valid": "Aa1!" + "x".repeat(124),
    "above_max": "Aa1!" + "x".repeat(125)
  }
}
```
<!-- @end:test_data -->
<!-- @end:test_data -->

<!-- @section:dependencies -->
## 测试依赖

### 系统依赖
- 认证服务API
- 用户数据库
- Redis缓存

### 测试工具
- Playwright (自动化测试)
- JMeter (性能测试)
- OWASP ZAP (安全测试)

### 外部服务
- 邮件服务(用于注册验证)
- SMS服务(用于短信验证码)
<!-- @end:dependencies -->

<!-- @section:notes -->
## 备注

### 已知问题
- [列出已知但暂不影响测试的问题]

### 特殊说明
- [列出需要特别注意的事项]
<!-- @end:notes -->
```

---

## 📊 3. 测试报告模版 (Test Report Template)

### 3.1 模版结构

```markdown
---
metadata:
  doc_type: test_report
  version: "1.0"
  project_id: [项目ID]
  project_name: [项目名称]
  test_cycle: [测试周期]
  report_type: [daily/weekly/final]
  report_date: YYYY-MM-DD
  test_lead: [测试负责人]
  tags: []
---

# [项目名称] 测试报告

**报告周期:** [开始日期] - [结束日期]
**报告类型:** [日报/周报/最终报告]
**测试负责人:** [姓名]

---

<!-- @section:executive_summary -->
## 执行摘要

### 测试概况
本次测试周期内,测试团队完成了[模块名称]的功能测试、集成测试和性能测试。总体测试进展顺利,发现并修复了多个中高优先级缺陷。

### 关键结论
- ✅ **核心功能:** 已通过测试,可以发布
- ⚠️ **性能指标:** 部分指标未达标,需要优化
- ❌ **安全测试:** 发现2个高危漏洞,必须修复

### 发布建议
[建议发布/建议延期发布/有条件发布]

**理由:** [简要说明建议的理由]
<!-- @end:executive_summary -->

<!-- @section:test_progress -->
## 测试进度

<!-- @metrics:type=progress -->
### 总体进度

| 指标 | 计划 | 实际 | 完成率 |
|------|------|------|--------|
| 测试用例数 | 500 | 480 | 96% |
| 执行用例数 | 500 | 450 | 90% |
| 通过用例数 | - | 420 | 93.3% |
| 失败用例数 | - | 30 | 6.7% |
| 阻塞用例数 | - | 30 | 6% |

**进度图表:**
```
执行进度: ████████████████░░░░ 90%
通过率:   ████████████████████ 93.3%
```
<!-- @end:metrics -->

<!-- @metrics:type=module_progress -->
### 模块测试进度

| 模块 | 计划用例 | 已执行 | 通过 | 失败 | 阻塞 | 通过率 |
|------|----------|--------|------|------|------|--------|
| 用户管理 | 100 | 95 | 90 | 5 | 5 | 94.7% |
| 订单管理 | 150 | 140 | 130 | 10 | 10 | 92.9% |
| 支付模块 | 80 | 75 | 70 | 5 | 5 | 93.3% |
| 商品管理 | 120 | 110 | 100 | 10 | 10 | 90.9% |
| 报表统计 | 50 | 30 | 30 | 0 | 20 | 100% |
<!-- @end:metrics -->
<!-- @end:test_progress -->

<!-- @section:defect_summary -->
## 缺陷汇总

<!-- @metrics:type=defect_overview -->
### 缺陷概览

**新增缺陷:** 45个
**已修复:** 30个
**已关闭:** 25个
**遗留缺陷:** 20个

**缺陷修复率:** 66.7%
<!-- @end:metrics -->

<!-- @metrics:type=defect_by_severity -->
### 按严重程度分布

| 严重程度 | 新增 | 已修复 | 遗留 | 修复率 |
|----------|------|--------|------|--------|
| 致命(Blocker) | 2 | 2 | 0 | 100% |
| 严重(Critical) | 8 | 6 | 2 | 75% |
| 一般(Major) | 15 | 10 | 5 | 66.7% |
| 次要(Minor) | 20 | 12 | 8 | 60% |

**趋势图:**
```
致命: ██ → 0 (已全部修复)
严重: ████████ → ██ (75%修复)
一般: ███████████████ → █████ (66.7%修复)
次要: ████████████████████ → ████████ (60%修复)
```
<!-- @end:metrics -->

<!-- @metrics:type=defect_by_module -->
### 按模块分布

| 模块 | 缺陷数 | 占比 | 主要问题 |
|------|--------|------|----------|
| 用户管理 | 8 | 17.8% | 权限验证不严格 |
| 订单管理 | 15 | 33.3% | 状态流转异常 |
| 支付模块 | 10 | 22.2% | 回调处理不完善 |
| 商品管理 | 7 | 15.6% | 库存同步延迟 |
| 报表统计 | 5 | 11.1% | 数据统计不准确 |
<!-- @end:metrics -->

<!-- @defect_list:severity=critical -->
### 关键缺陷列表

<!-- @defect:id=BUG-001 severity=critical status=open -->
**BUG-001: SQL注入漏洞**
- **模块:** 用户管理
- **描述:** 登录接口存在SQL注入风险,可绕过认证
- **重现步骤:**
  1. 访问登录页面
  2. 用户名输入: `admin' OR '1'='1--`
  3. 点击登录
- **影响:** 可能导致未授权访问,数据泄露
- **优先级:** P0
- **状态:** 待修复
- **负责人:** [开发人员]
- **计划修复时间:** YYYY-MM-DD
<!-- @end:defect -->

<!-- @defect:id=BUG-002 severity=critical status=fixed -->
**BUG-002: 支付金额计算错误**
- **模块:** 支付模块
- **描述:** 优惠券和折扣同时使用时,金额计算不正确
- **重现步骤:**
  1. 添加商品到购物车,总价100元
  2. 使用10元优惠券
  3. 使用9折折扣码
  4. 实际扣款金额错误
- **影响:** 可能导致财务损失
- **优先级:** P0
- **状态:** 已修复
- **修复版本:** v1.2.1
- **验证结果:** 通过
<!-- @end:defect -->
<!-- @end:defect_list -->
<!-- @end:defect_summary -->

<!-- @section:test_coverage -->
## 测试覆盖率

<!-- @coverage:type=code -->
### 代码覆盖率

| 类型 | 覆盖率 | 目标 | 状态 |
|------|--------|------|------|
| 语句覆盖率 | 82% | 80% | ✅ 达标 |
| 分支覆盖率 | 75% | 70% | ✅ 达标 |
| 函数覆盖率 | 88% | 80% | ✅ 达标 |
| 行覆盖率 | 83% | 80% | ✅ 达标 |

**详细报告:** [链接到覆盖率报告]
<!-- @end:coverage -->

<!-- @coverage:type=requirements -->
### 需求覆盖率

| 需求类型 | 总数 | 已覆盖 | 覆盖率 |
|----------|------|--------|--------|
| 用户故事 | 50 | 48 | 96% |
| 功能需求 | 120 | 115 | 95.8% |
| 非功能需求 | 30 | 25 | 83.3% |

**未覆盖需求:**
- REQ-045: 数据导出功能(计划下个版本)
- REQ-078: 多语言支持(计划下个版本)
<!-- @end:coverage -->
<!-- @end:test_coverage -->

<!-- @section:performance_test -->
## 性能测试

<!-- @performance:test_id=PERF-001 type=load -->
### 负载测试结果

**测试场景:** 模拟100个并发用户访问系统

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| 平均响应时间 | < 500ms | 420ms | ✅ 通过 |
| 95分位响应时间 | < 1s | 850ms | ✅ 通过 |
| 99分位响应时间 | < 2s | 1.8s | ✅ 通过 |
| 吞吐量(TPS) | ≥ 200 | 235 | ✅ 通过 |
| 错误率 | < 1% | 0.3% | ✅ 通过 |
| CPU使用率 | < 70% | 62% | ✅ 通过 |
| 内存使用率 | < 80% | 68% | ✅ 通过 |

**性能趋势:**
```
响应时间: ████░░░░░░ 420ms (目标500ms)
吞吐量:   ██████████████ 235 TPS (目标200 TPS)
```
<!-- @end:performance -->

<!-- @performance:test_id=PERF-002 type=stress -->
### 压力测试结果

**测试场景:** 逐步增加并发用户,直到系统崩溃

| 并发用户数 | 响应时间 | 吞吐量 | 错误率 | 状态 |
|-----------|----------|--------|--------|------|
| 100 | 420ms | 235 TPS | 0.3% | 正常 |
| 200 | 680ms | 410 TPS | 0.8% | 正常 |
| 300 | 950ms | 520 TPS | 1.5% | 降级 |
| 400 | 1850ms | 480 TPS | 5.2% | 严重降级 |
| 500 | 3200ms | 350 TPS | 15% | 崩溃 |

**最大承载能力:** 约300并发用户

**建议:**
- 优化数据库查询
- 增加缓存层
- 考虑水平扩展
<!-- @end:performance -->
<!-- @end:performance_test -->

<!-- @section:security_test -->
## 安全测试

<!-- @security:test_type=vulnerability_scan -->
### 漏洞扫描结果

| 风险等级 | 数量 | 主要漏洞类型 |
|----------|------|-------------|
| 高危 | 2 | SQL注入、XSS |
| 中危 | 5 | CSRF、信息泄露 |
| 低危 | 10 | 配置问题 |

<!-- @vulnerability:id=SEC-001 severity=high -->
**SEC-001: SQL注入漏洞**
- **位置:** /api/login
- **描述:** 用户输入未经过滤直接拼接SQL
- **CVSS评分:** 9.8 (严重)
- **修复建议:** 使用参数化查询
- **状态:** 待修复
<!-- @end:vulnerability -->

<!-- @vulnerability:id=SEC-002 severity=high -->
**SEC-002: 跨站脚本(XSS)**
- **位置:** /api/comments
- **描述:** 用户评论内容未经转义直接显示
- **CVSS评分:** 7.5 (高危)
- **修复建议:** 对用户输入进行HTML转义
- **状态:** 已修复
<!-- @end:vulnerability -->
<!-- @end:security -->
<!-- @end:security_test -->

<!-- @section:automation_status -->
## 自动化测试

<!-- @automation:framework=e2e -->
### E2E自动化测试

**框架:** Playwright
**用例总数:** 150
**自动化用例:** 120
**自动化率:** 80%

**执行结果:**
- 通过: 115
- 失败: 3
- 跳过: 2
- 通过率: 95.8%

**失败用例:**
1. TC-045: 订单列表分页 (环境问题)
2. TC-078: 文件上传 (超时)
3. TC-092: 导出报表 (数据问题)
<!-- @end:automation -->

<!-- @automation:framework=api -->
### API自动化测试

**框架:** Supertest + Jest
**接口总数:** 80
**自动化接口:** 75
**自动化率:** 93.75%

**执行结果:**
- 通过: 72
- 失败: 3
- 通过率: 96%
<!-- @end:automation -->
<!-- @end:automation_status -->

<!-- @section:risks_issues -->
## 风险与问题

<!-- @risk:id=RISK-001 level=high -->
### 高风险: 遗留高危缺陷
- **描述:** 2个高危安全漏洞尚未修复
- **影响:** 可能导致安全事故,不建议发布
- **缓解措施:** 延期发布,优先修复安全漏洞
- **责任人:** 开发团队负责人
- **截止日期:** YYYY-MM-DD
<!-- @end:risk -->

<!-- @issue:id=ISSUE-001 status=open -->
### 问题: 测试环境不稳定
- **描述:** 测试环境频繁宕机,影响测试进度
- **影响:** 测试效率降低约30%
- **解决方案:** IT团队正在升级服务器
- **预计解决时间:** YYYY-MM-DD
<!-- @end:issue -->
<!-- @end:risks_issues -->

<!-- @section:recommendations -->
## 建议

### 发布建议
基于当前测试结果,**不建议立即发布**,主要原因:
1. 存在2个高危安全漏洞未修复
2. 性能测试显示系统在高负载下表现不佳
3. 部分核心功能的缺陷尚未修复

**建议发布时间:** 待高危缺陷修复并验证通过后

### 改进建议

1. **代码质量:**
   - 加强代码审查
   - 增加单元测试覆盖率
   - 引入静态代码分析工具

2. **测试流程:**
   - 建立更完善的自动化测试体系
   - 增加安全测试频率
   - 优化测试环境管理

3. **团队协作:**
   - 加强开发和测试团队的沟通
   - 建立缺陷修复优先级机制
   - 定期组织技术分享会
<!-- @end:recommendations -->

<!-- @section:next_steps -->
## 后续计划

- [ ] 修复所有高危和严重缺陷
- [ ] 完成剩余30个测试用例的执行
- [ ] 进行全面的回归测试
- [ ] 更新自动化测试脚本
- [ ] 准备生产环境部署方案
- [ ] 制定应急回滚计划

**下次测试评审会议:** YYYY-MM-DD HH:MM
<!-- @end:next_steps -->

<!-- @section:appendix -->
## 附录

### 测试环境信息
- **服务器:** AWS EC2 t3.medium
- **数据库:** PostgreSQL 13.5
- **操作系统:** Ubuntu 20.04 LTS
- **浏览器:** Chrome 120, Firefox 121, Safari 17

### 参考文档
- 测试计划: [链接]
- 测试用例: [链接]
- 缺陷跟踪: [JIRA链接]
- 自动化测试报告: [链接]
<!-- @end:appendix -->
```

---

## 🏷️ 标签使用规范

### 元数据标签
- `doc_type`: 文档类型 (test_plan/test_case/test_report)
- `test_type`: 测试类型 (functional/integration/performance/security)
- `priority`: 优先级 (critical/high/medium/low)
- `automation`: 是否自动化 (yes/no/planned)

### 章节标签
- `@section:xxx`: 标记文档章节
- `@end:xxx`: 章节结束标记

### 测试用例标签
- `@test_case:id=xxx priority=xxx type=xxx`: 测试用例
- `@test_data:category=xxx`: 测试数据
- `@test_level:type=xxx`: 测试层级
- `@test_types`: 测试类型列表

### 环境和工具标签
- `@environment:env=xxx`: 测试环境
- `@tools:category=xxx`: 测试工具

### 缺陷标签
- `@defect:id=xxx severity=xxx status=xxx`: 缺陷记录
- `@defect_list:severity=xxx`: 缺陷列表

### 度量标签
- `@metrics:type=xxx`: 测试度量数据
- `@coverage:type=xxx`: 覆盖率数据
- `@performance:test_id=xxx type=xxx`: 性能测试
- `@security:test_type=xxx`: 安全测试
- `@automation:framework=xxx`: 自动化测试

### 风险和问题标签
- `@risk:id=xxx level=xxx`: 风险项
- `@issue:id=xxx status=xxx`: 问题项
- `@vulnerability:id=xxx severity=xxx`: 安全漏洞

---

## 🎯 使用指南

### 对于测试工程师

1. **编写测试计划时:**
   - 使用测试计划模版
   - 填写完整的元数据头
   - 使用标签标记关键信息
   - 确保所有章节都有对应的标签

2. **编写测试用例时:**
   - 使用测试用例模版
   - 每个测试用例使用`@test_case`标签
   - 包含完整的测试步骤和预期结果
   - 标注是否支持自动化

3. **编写测试报告时:**
   - 使用测试报告模版
   - 使用`@metrics`标签记录测试数据
   - 使用`@defect`标签记录缺陷信息
   - 提供明确的发布建议

### 对于Agent开发者

1. **在Agent提示词中引用模版:**
```typescript
const TEST_PLAN_PROMPT = `
你是一个测试专家AI助手,负责生成测试计划文档。

**重要:你必须严格按照测试领域标准模版生成文档**

模版位置: docs/test-domain-template.md

请使用"测试计划模版"部分,确保:
1. 填写完整的元数据头
2. 使用所有必需的标签
3. 包含所有必需的章节

现在,请根据用户需求生成测试计划:
{user_input}
`;
```

2. **验证生成的文档:**
- 检查元数据完整性
- 验证标签格式正确
- 确保必需章节存在

---

## 🔧 工具支持

### 推荐工具

1. **测试管理:**
   - TestRail
   - Zephyr
   - qTest

2. **自动化测试:**
   - Playwright (E2E)
   - Jest (单元测试)
   - Supertest (API测试)
   - K6 (性能测试)

3. **缺陷跟踪:**
   - Jira
   - Bugzilla
   - GitHub Issues

4. **文档编辑:**
   - VSCode (推荐安装Markdown插件)
   - Typora
   - Notion

---

## 📊 质量标准

### 测试计划质量要求
- [ ] 元数据完整性 ≥ 90%
- [ ] 包含所有必需章节
- [ ] 测试策略明确
- [ ] 风险识别完整

### 测试用例质量要求
- [ ] 每个用例有唯一ID
- [ ] 测试步骤清晰可执行
- [ ] 预期结果明确
- [ ] 测试数据完整

### 测试报告质量要求
- [ ] 数据准确性 100%
- [ ] 包含执行摘要
- [ ] 缺陷分析完整
- [ ] 提供明确建议

---

## 📚 参考资料

- [IEEE 829测试文档标准](https://standards.ieee.org/standard/829-2008.html)
- [ISO/IEC/IEEE 29119软件测试标准](https://www.iso.org/standard/45142.html)
- [ISTQB测试术语表](https://glossary.istqb.org/)
- [测试金字塔模型](https://martinfowler.com/articles/practical-test-pyramid.html)

---

**文档状态:** 标准模版
**维护者:** 测试团队
**最后更新:** 2025-11-18
