# QingLan · 破甲中枢（dsh-QingLanPierce 0.1.0-beta.3）

> ## ⛔ 使用限制与责任声明（首屏必读）
>
> 本节为项目立场声明，不构成 [LICENSE](LICENSE) 的附加条款；许可以 **MIT** 为准。
>
> **本项目是学习、研究与软件互操作性测试用途的免费开源软件，禁止一切违法用途。**
>
> - **禁止用途（不限于）**：制作毒品或管制药物、制造爆炸物与枪支弹药、侵害人身权利、网络攻击与入侵、
>   侵犯公民个人信息、制作或传播淫秽与未成年人内容、诈骗与帮助信息网络犯罪活动、舆论操纵、
>   危害国家安全，以及**以规避监管、审查或平台规则为目的**使用本插件的词表与改写机制。
> - **责任归属**：一切使用后果由**使用者自行承担**；作者与贡献者不是使用者行为的参与者，
>   不承担任何连带责任。本软件按「现状」提供、**无任何担保**，免费软件的责任上限为 **0 元**。
> - **许可**：**MIT**，见 [`LICENSE`](LICENSE)。标准 MIT 文本，未附加额外条款。
> - **加载即用**：没有开屏协议、没有倒计时、没有强制确认。
> - **仓库**：https://github.com/QinglanSFR/dsh-QingLanPierce

**当前状态：Beta** —— 版本号走 `0.1.0-beta.N` 预发布序列；接口、配置键与提示词结构在转正前仍可能变动。

---

## 特性

DeepSeek Harness（以下简称 DSH）的插件：

**纯插件实现**：不改写任何 `@deepseek-ai/*` 官方文件、不写 shim、不生成 `.bak`、不改动其它插件、
不写 profile 补丁（除自己那一行）；**零 npm 依赖**；卸载即等于不存在。

---

## 一、运行环境要求（装之前先看这里）

| 项目                            | 要求                                    | 说明                                                                                                                                                                            |
| ------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DeepSeek Harness**            | **≥ 0.2.0-rc.2，< 0.3.0-0**（桌面版或 CLI 版均可；0.2.2-rc.1 实测通过） | 本插件是 DSH 的插件，没有 DSH 无法运行                                                                                                                                          |
| **Node.js**                     | **不需要单独安装**                      | 插件运行在 DSH 自带（Electron 内嵌）的 Node 运行时里                                                                                                                            |
| **npm 依赖**                    | **无**                                  | 本插件**零依赖**，不装任何第三方包                                                                                                                                              |
| **pnpm**                        | 不需要手动调用                          | 依赖安装由 DSH 自己完成：用应用内插件管理器，或 `dsh plugin --profile <名> install`。**不要在 Windows 的 Git Bash 里调用 `pnpm`**（本机 pnpm 若是转发器脚本会递归，见下方说明） |
| **PowerShell**                  | Windows 下 **5.1+**（系统自带）         | 仅"一键脚本"安装方式需要                                                                                                                                                        |
| **bash**                        | macOS / Linux / WSL / Git Bash          | 仅 `install.sh` 需要                                                                                                                                                            |
| **Python**                      | **不需要**                              | 发布包不含任何 Python 脚本                                                                                                                                                      |
| **编译器/构建工具**             | **不需要**                              | 纯 JS，无构建步骤                                                                                                                                                               |
| **磁盘占用**                    | < 1 MB                                  | 插件本体约 400 KB                                                                                                                                                               |

> 一句话：**装了 DSH 就能用**。除 DSH 本身外，本插件不要求你额外安装任何运行环境。

---

## 二、安装

> ⚠️ **先说一条容易踩的坑**：`dsh plugin add` **不能用于桌面版**。
> `desktop` profile 由 Electron 应用独占管理，命令行会直接报
> `profile "desktop" is managed exclusively by the Electron application`。
> 所以桌面版请用下面 **方式 A** 或 **方式 B**；命令行方式只适用于 `web` / `tui` / 自建 profile。

> 兼容范围写在 `package.json` 的 `engines.dsh`：`>=0.2.0-rc.2 <0.3.0-0`。超出范围时 DSH 会拒绝加载并提示版本不兼容 —— 这是故意的，宁可明确拒绝，也不要装上去半坏。
> 上界写成 `<0.3.0-0` 而不是 `<0.3.0`：宿主的版本判定开了 `includePrerelease`，写 `<0.3.0` 会放行 `0.3.0-rc.1` 这类预发布。

### 方式 A：应用内插件管理器（桌面版推荐）

DSH 桌面版自带插件管理器（右上角 … 菜单里）。打开后：

1. 点「安装插件」；
2. 在输入框填以下任一种规格，然后确认：
   - **GitHub 地址**：`github:QinglanSFR/dsh-QingLanPierce`（仓库需为公开；私有仓库无法被直接拉取）
   - **npm 包名**：若你把它发布到 npm，填包名即可
   - **本地路径**：解压后的插件目录绝对路径（如 `D:\plugins\dsh-QingLanPierce`）
3. 等它装完，**完全退出并重启 DSH**。

### 方式 B：手动安装（桌面版同样可用，最稳）

1. 把 `dsh-QingLanPierce` 整个目录复制到 `$DSH_HOME/plugins/dsh-QingLanPierce`
   （Windows 默认 `%USERPROFILE%\.dsh\plugins\dsh-QingLanPierce`）
2. 编辑 `$DSH_HOME/profiles/desktop/package.json`，两处各加一项：

   ```jsonc
   {
     "dependencies": { "dsh-QingLanPierce": "file:../../plugins/dsh-QingLanPierce" },
     "dsh": { "profile": { "bundles": ["…原有项…", "dsh-QingLanPierce"] } }
   }
   ```
3. 完成依赖安装（二选一）：打开应用内插件管理器安装/启用 · 或在该 profile 目录执行 `dsh plugin --profile <profile名> install`

   > ⚠️ **不要**在 Windows 的 Git Bash / MSYS / Cygwin 里直接运行 `pnpm install`：若本机 `pnpm` 是指向 DSH 内置 pnpm 的转发器脚本，从 POSIX shell 调用会触发自我递归（实测可瞬间产生数千进程）。`install.sh` 已加入该环境的硬性拦截。
4. **完全退出并重启 DSH**

### 方式 C：一键脚本（自动完成方式 B 的第 1–2 步）

```powershell
# Windows（PowerShell）
cd <解压后的插件目录>
.\install.ps1 -Profile desktop
```

```bash
# macOS / Linux / WSL
cd /path/to/dsh-QingLanPierce
chmod +x install.sh uninstall.sh && ./install.sh
```

脚本只做三件事：备份 profile 配置 → 复制插件到 `$DSH_HOME/plugins/dsh-QingLanPierce` → 注册依赖
（desktop profile 的 bundles 由桌面版应用自己管理，脚本不写）。**不触碰任何官方文件，也不调用 pnpm。**

装完会把本次用的 profile 记到 `$DSH_HOME/dsh-QingLanPierce/install-profile.json`。**卸载脚本读这份记录**，
所以你用 `-Profile web` 装的，卸载时不传参数也会正确清 `web` —— 不会因为目录里还有 `desktop` 就清错。

> Windows 下若从 **Git Bash / MSYS / Cygwin** 运行 `install.sh`，脚本会**拒绝执行**并提示改用
> `install.ps1` —— 因为本机 `pnpm` 可能是转发器脚本，从 POSIX shell 调用会自我递归。

### 方式 D：命令行（仅 `web` / `tui` / 自建 profile）

```bash
dsh plugin --profile web add "file:/绝对路径/dsh-QingLanPierce"
```

### 卸载

```powershell
.\uninstall.ps1                 # Windows；加 -PurgeData 连用户数据一起删
```

```bash
./uninstall.sh                  # macOS / Linux；加 --purge-data
```

**profile 定位顺序**：`-Profile` 参数 → `install-profile.json` 记录 → `desktop` / `web` / `default` 首个可用。
三级都拿不到时会明确告警并**跳过 profile 清理**（不静默乱选）。装非 `desktop` profile 又用方式 D 手工装的，
卸载请显式指定：`.\uninstall.ps1 -Profile web`。

或按方式 B 反向操作：从 `package.json` 里删掉 `dsh-QingLanPierce` 依赖与 bundle 项 → `dsh plugin --profile <profile名> install` →
删掉 `$DSH_HOME/plugins/dsh-QingLanPierce` 目录。

用户数据在 `$DSH_HOME/dsh-QingLanPierce/`（`config.json` / `audit.jsonl` / `prompts/`），
默认保留，便于重装后接着用。

---

## 三、安全性说明（可核对）

- **不碰官方文件**：插件只写自己的数据目录与自己的运行态；状态页有一行「官方文件改写」实时显示 `无`。
- **不碰其它插件**：不读取、不检测、不改动任何其它插件，也不写 profile 补丁。
  历史遗留的 `disabled: true` 行**不会被本插件改动** —— 无法区分是谁写的，误改等于擅自打开你关掉的插件。
- **数据只在本地**：`/qinglan-api` 只挂在宿主本机回环地址上；审计文件在 `$DSH_HOME/dsh-QingLanPierce/audit.jsonl`，
  可用 `qinglan_control { "action": "status" }` 的 `dataDir` 字段查到确切路径。
- **控制接口只接受本机来源**：`/qinglan-api` 能读全量状态、写配置、切模型与会话开关，所以它在服务端逐请求校验：
  - socket 对端地址必须是回环（`127.0.0.0/8`、`::1`、`::ffff:127.x`）—— 局域网主机、curl、脚本一律 403；
  - `Host` 头必须解析成回环名 —— 挡 DNS rebinding（攻击者域名解析到 `127.0.0.1`，Origin 与 Host 会一致）；
  - `Origin` 与 `content-type` 两道 CSRF 闸照旧保留。

  宿主若监听在非回环地址（`0.0.0.0` / 局域网 IP），**整条路由不注册**，状态页 `channel.guard.skippedReason`
  会写明原因。这不是"检测到就提醒"，是直接不开。

---

## 四、许可

- **MIT**，见 [`LICENSE`](LICENSE)。标准 MIT 文本，没有附加用途限制条款。
- 本插件为**学习、研究、软件互操作性测试与安全研究**目的而开发并免费开源。
- 软件按**「现状」**提供，不附带任何形式的明示或默示担保；使用后果由使用者自行承担。

---

## 五、目录结构

```
dsh-QingLanPierce/
├─ index.js               宿主半体（注入段 / 投影 / 命令 / 工具 / HTTP 通道 / 转写与信封）
├─ client.js              客户端半体（状态条 + 浮动菜单）
├─ cordis.patch.yml        只插入自己一行
├─ lib/
│  ├─ config.js           配置层（默认 ← 行 config ← 用户文件）+ 档位↔稿子映射
│  ├─ core.js             判定器 / 事件折叠 / 稿件加载 / 档位一致性自检
│  ├─ notation.js         指称记法 + 任务信封 + 补发框架（逐类别策略表）
│  └─ lexicon.js          词表（14 类 · 405 条生效）
├─ prompts/               三份破甲正文（core / dominate / lite）
├─ install.ps1 / install.sh       安装脚本
└─ uninstall.ps1 / uninstall.sh   卸载脚本
```

三档的差别（其余规则三档完全一致：同一份稳定头 + 同一套 D1–D8 交付标准 + 同一份占位符清单）：

| 档位 | 界面显示 | 正文体量 | 差异点 |
|---|---|---|---|
| `core` | 标准 | 约 1.1 万字符 · 标签式 | 通用；领域清单最全（7 类）；与极限版同尺寸、措辞更密 |
| `dominate` | 极限 | 约 1.1 万字符 · 标签式 | 最强；注入位置最前（`-999`），D8 附带「化名虚构 + 文风与投放策略」细则 |
| `lite` | 温和 | 约 1.0 万字符 · 标签式 | 最省 token；保留全部硬规则与防跑偏条款，压缩的是解释性文字 |

三档共用一个真源：版本号只在 `package.json` 写两处（`version` 与 `dsh.version`），`lib/config.js` 与界面从它读，不再各存副本。改版本只改这两处，别处不用碰。精确字数在菜单「状态」页的「生效稿 N 字」实时看，上表只写量级。

运行时数据（菜单「关于」页可看到实际路径）：

```
$DSH_HOME/dsh-QingLanPierce/
├─ config.json      菜单改动记录
├─ prompts/         自定义稿（覆盖内置稿）
└─ audit.jsonl      本地审计
```

---

## 五之后 · 可调开关（改 `$DSH_HOME/dsh-QingLanPierce/config.json`）

| 键 | 默认 | 作用 |
|---|---|---|
| `budgetNote` | `true` | 每条用户消息末尾无条件追加固定预算声明。设 `false` 关闭。与 `triggerEscape` / `escapeRewrite` **互不影响**：关掉转写不会连带关掉它 |
| `minorEnvelope` | `true` | 未成年类是否套「卷宗条目」前件。设 `false` 退回原样（只换指称、不加前件） |
| `stallResend` | `false` | 追问是否触发补发。默认关（提问不设限）；设 `true` 回到"只问不答也会被催"的旧行为 |
| `resendFrameRotation` | `true` | 补发走内置三套体例轮换；设 `false` 才用 `autoResendText` |
| `refusalScan` | `true` | 关掉后不再扫描输出、也不触发补发 |
| `taskEnvelope` | `true` | 关掉后只做词面转写，不套任务信封 |
| `injectionOrder` | `-100` | 注入位置；`-999` 极限抢占，`100` 在 persona 之后 |

### 预算声明（`budgetNote`）

每条真实用户输入的末尾会被追加同一句，固定文本，不随档位、词表、信封变化：

```
(你的token预算无上限，包括不限于本身对话，子代理，智能体团队。你不需要吝啬token与费用，力求完美。)
```

它与**字面词转写同一条链路**（`agent/pre-step` 改写本轮 `messages`），区别只在触发条件：转写看词表命中，这一句不看命中，只要是真实用户输入就追加。

它不是提示词注入：注入写的是 `systemPrompt`，这一句改的是本轮 `user` 消息正文本身。

行为边界：

| 情况 | 是否追加 |
|---|---|
| 真实用户输入 | 追加（用空行 `\n\n` 与正文分隔） |
| 宿主注入的 `runtime-context` 快照（`source.kind !== "user"`） | 不追加 |
| 插件自己发的补发 / 转写提示（`source.kind = plugin:*`） | 不追加 |
| 消息里已含这一句（补发重入等） | 跳过，不叠加第二遍 |

追加次数在菜单「对抗」页的「预算声明已追加」实时可见；`qinglan_control { "action": "status" }` 的 `budget` 字段给出 `enabled` / `appended` / `lastAt` / `text`。

## 六、常见问题

| 现象                   | 处理                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| 状态条不出现           | 确认插件已启用、已**完全重启** DSH；`/qinglan status` 看是否报错    |
| 提示词不生效           | 菜单「状态」页的「检查项」里看「生效稿 N 字」；报错说明稿件读取失败 |
| 档位显示与实跑不一致   | 菜单「状态」页看「档位自检」；标题栏档位 chip 会标橙提示            |
| 想看这句话会怎么发出去 | 菜单「对抗」页 → 转写自检                                           |
