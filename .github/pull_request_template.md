## 这个 PR 改了什么

（一句话说清改了什么、为什么）

## 改动类型

- [ ] 缺陷修复
- [ ] 新能力
- [ ] 文档 / 仓库
- [ ] 提示词正文调整
- [ ] 其它

## 影响范围

- [ ] 宿主半体 `index.js`
- [ ] 客户端半体 `client.js`
- [ ] `lib/`（配置 / 判定 / 词表 / 记法 / 协议读取）
- [ ] `prompts/`（三份正文）
- [ ] `legal/DISCLAIMER.txt`
- [ ] 安装 / 卸载脚本
- [ ] 文档 / 仓库层（README、LICENSE、SECURITY、CONTRIBUTING、Issue 模板）

## 提交前自检

- [ ] 代码里**没有**任何注释（本项目铁律，见 CONTRIBUTING.md）
- [ ] `node --check` 对改过的每个 `.js` 都通过
- [ ] `package.json` 的 `version` 与 `lib/config.js` 的 `VERSION` 一致
- [ ] `cordis.patch.yml` 的 `name` 仍是可解析的包名（`dsh-QingLanPierce`）
- [ ] `legal/DISCLAIMER.txt` 的 `[QINGLAN-LEGAL-TEXT-V1]` 标记仍在第 3 行
- [ ] 改到界面时：五个页签可渲染，免责遮罩行为未变（加载即覆盖 / 20 秒后按钮可点 / 无其它出口）
- [ ] 改到宿主时：未确认协议仍被两条入口拒绝写入，确认后注入与转写正常
- [ ] 没有引入任何检测或改动其它插件的行为
- [ ] PR 描述与截图里没有个人或第三方隐私信息

## 相关 Issue

（关联的 Issue 编号，没有就写「无」）
