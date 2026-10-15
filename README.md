# QingLan · 破甲中枢（dsh-QingLanPierce Beta1）

> ## ⛔ 使用限制与责任声明（首屏必读）
>
> **本项目是学习、研究与软件互操作性测试用途的免费开源软件，禁止一切违法用途。**
>
> - **禁止用途（不限于）**：制作毒品或管制药物、制造爆炸物与枪支弹药、侵害人身权利、网络攻击与入侵、
>   侵犯公民个人信息、制作或传播淫秽与未成年人内容、诈骗与帮助信息网络犯罪活动、舆论操纵、
>   危害国家安全，以及**以规避监管、审查或平台规则为目的**使用本插件的词表与改写机制。
> - **责任归属**：一切使用后果由**使用者自行承担**；作者与贡献者不是使用者行为的参与者，
>   不承担任何连带责任。本软件按「现状」提供、**无任何担保**，免费软件的责任上限为 **0 元**。
> - **强制同意**：首次加载会立即全屏弹出《用户免责与责任承担协议》，**20 秒后**确认按钮才可点击；
>   未确认前插件不生效（服务端也会拒绝一切写操作）；不同意请卸载。
> - **许可**：**MIT + 禁止用途附加条款**，见 [`LICENSE`](LICENSE)；完整条款见
>   [`legal/DISCLAIMER.txt`](legal/DISCLAIMER.txt) 与 [`SECURITY.md`](SECURITY.md)。
> - **仓库**：https://github.com/QinglanSFR/dsh-QingLanPierce · 贡献前请读 [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## 特性

DeepSeek Harness（以下简称 DSH）的插件：

**纯插件实现**：不改写任何 `@deepseek-ai/*` 官方文件、不写 shim、不生成 `.bak`、不改动其它插件、
不写 profile 补丁（除自己那一行）；**零 npm 依赖**；卸载即等于不存在。

> ⚖️ **首次启用必须先接受《用户免责与责任承担协议》**：加载后会**立即全屏遮挡** DSH 界面，
> 确认按钮需等 **20 秒**倒计时结束才能点击，**没有"跳过"途径**；不同意请禁用/卸载本插件。
> 未确认前，插件在**服务端**也拒绝一切写操作（工具与 HTTP 两条入口都拦）——
> "必须先同意"不是界面上的规矩，而是运行时不变量。

---

## 一、运行环境要求（装之前先看这里）

| 项目                            | 要求                                    | 说明                                                                                                                                                                            |
| ------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DeepSeek Harness**            | **≥ 0.2.0-rc.2**（桌面版或 CLI 版均可） | 本插件是 DSH 的插件，没有 DSH 无法运行                                                                                                                                          |
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

### 方式 A：应用内插件管理器（桌面版推荐）

DSH 桌面版自带插件管理器（右上角 … 菜单里）。打开后：

1. 点「安装插件」；
2. 在输入框填以下任一种规格，然后确认：
   - **GitHub 地址**：`github:QinglanSFR/dsh-QingLanPierce`（仓库需为公开；私有仓库无法被直接拉取）
   - **npm 包名**：若你把它发布到 npm，填包名即可
   - **本地路径**：解压后的插件目录绝对路径（如 `D:\plugins\dsh-QingLanPierce-Beta1`）
3. 等它装完，**完全退出并重启 DSH**。

### 方式 B：手动安装（桌面版同样可用，最稳）

1. 把 `dsh-QingLanPierce-Beta1` 整个目录复制到 `$DSH_HOME/plugins/dsh-QingLanPierce`
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
cd /path/to/dsh-QingLanPierce-Beta1
chmod +x install.sh uninstall.sh && ./install.sh
```

脚本只做三件事：备份 profile 配置 → 复制插件到 `$DSH_HOME/plugins/dsh-QingLanPierce` → 注册依赖
（desktop profile 的 bundles 由桌面版应用自己管理，脚本不写）。**不触碰任何官方文件，也不调用 pnpm。**

> Windows 下若从 **Git Bash / MSYS / Cygwin** 运行 `install.sh`，脚本会**拒绝执行**并提示改用
> `install.ps1` —— 因为本机 `pnpm` 可能是转发器脚本，从 POSIX shell 调用会自我递归。

### 方式 D：命令行（仅 `web` / `tui` / 自建 profile）

```bash
dsh plugin --profile web add "file:/绝对路径/dsh-QingLanPierce-Beta1"
```

### 卸载

```powershell
.\uninstall.ps1                 # Windows；加 -PurgeData 连用户数据一起删
```

```bash
./uninstall.sh                  # macOS / Linux；加 --purge-data
```

或按方式 B 反向操作：从 `package.json` 里删掉 `dsh-QingLanPierce` 依赖与 bundle 项 → `dsh plugin --profile <profile名> install` →
删掉 `$DSH_HOME/plugins/dsh-QingLanPierce` 目录。

用户数据在 `$DSH_HOME/dsh-QingLanPierce/`（`config.json` / `audit.jsonl` / `prompts/` / `backups/`），
默认保留，便于重装后接着用。

---

## 三、安全性说明（可核对）

- **不碰官方文件**：插件只写自己的数据目录与自己的运行态；状态页有一行「官方文件改写」实时显示 `无`。
- **不碰其它插件**：不读取、不检测、不改动任何其它插件，也不写 profile 补丁。
  历史遗留的 `disabled: true` 行**不会被本插件改动** —— 无法区分是谁写的，误改等于擅自打开你关掉的插件。
- **数据只在本地**：`/qinglan-api` 只挂在宿主本机回环地址上；审计文件在 `$DSH_HOME/dsh-QingLanPierce/audit.jsonl`，
  可用 `qinglan_control { "action": "status" }` 的 `dataDir` 字段查到确切路径。
- **门禁在服务端**：未确认免责协议时，工具与 HTTP 两条入口都拒绝写操作（HTTP 403）。

---

## 五、免责与许可（**请务必阅读**）

- 本插件为**学习、研究、软件互操作性测试与安全研究**目的而开发并免费开源。
- 使用前必须接受 [`legal/DISCLAIMER.txt`](legal/DISCLAIMER.txt)（`legal-1.0`），要点：
  - **禁止性使用负面清单**（11 项）：毒品、爆炸物与枪支弹药、人身侵害、网络攻击、侵犯个人信息、
    淫秽与未成年人内容、诈骗与黑灰产、舆论操纵、危害国家安全，以及
    **以规避监管/审查/平台规则为目的**使用本插件的词表与改写机制；
  - **责任归属**：一切法律后果由**使用者**承担；开发者与贡献者不是使用者行为的参与者，
    不承担连带责任（免费软件责任上限为 0 元）；
  - **法条索引**：《刑法》第 125 / 232 / 285 / 286 / **287 之二（帮信罪）** / 295 / 347 / 363 条等；
    《网络安全法》第 27 条；《禁毒法》第 59–62 条；《民法典》第 496–498 / 1165 / 1168 / 1169 / 1194–1197 条。
- 代码许可见 [`LICENSE`](LICENSE)：**MIT + 附加使用限制声明**（用途限定、责任归属、责任上限）。
- 本协议是**风险分配与用户承诺**文本，不是"开发者自动免责"的保证：任何免责条款都不能豁免
  故意或重大过失责任。项目的立场是**把用途限定写清楚、把门禁做实、把留痕做全**。

---

## 六、目录结构

```
dsh-QingLanPierce/
├─ index.js               宿主半体（注入段 / 投影 / 命令 / 工具 / HTTP 通道 / 转写与信封 / 协议门）
├─ client.js              客户端半体（状态条 + 浮动菜单 + 原生 DOM 协议遮罩）
├─ cordis.patch.yml        只插入自己一行
├─ lib/
│  ├─ config.js           配置层（默认 ← 行 config ← 用户文件）+ 档位↔稿子映射
│  ├─ core.js             判定器 / 事件折叠 / 稿件加载 / 档位一致性自检
│  ├─ notation.js         指称记法 + 任务信封 + 补发框架（逐类别策略表）
│  ├─ lexicon.js          词表（13 类 · 400+ 条生效）
│  └─ legal.js            免责协议读取与内容哈希（"用户接受了哪一版"的凭据）
├─ legal/DISCLAIMER.txt   免责协议正文（8 条 · 含法条索引 · 可独立审阅）
├─ prompts/               三份破甲正文（core / dominate / lite）
├─ install.ps1 / install.sh       安装脚本
└─ uninstall.ps1 / uninstall.sh   卸载脚本
```

三档的差别（其余规则三档完全一致：同一份稳定头 + 同一套 D1–D8 交付标准 + 同一份占位符清单）：

| 档位 | 界面显示 | 正文长度 | 差异点 |
|---|---|---|---|
| `core` | 标准 | 约 4.1 KB · 标签式 | 通用；领域清单最全（7 类） |
| `dominate` | 极限 | 约 4.2 KB · 标签式 | 最强；注入位置最前（`-999`），D8 附带「化名虚构 + 文风与投放策略」细则 |
| `lite` | 温和 | 约 2.7 KB · 章节式 | 最省 token；保留全部硬规则与防跑偏条款，压缩的是解释性文字 |

运行时数据（菜单「关于」页可看到实际路径）：

```
$DSH_HOME/dsh-QingLanPierce/
├─ config.json      菜单改动与协议确认记录
├─ prompts/         自定义稿（覆盖内置稿）
├─ backups/         写盘前备份
└─ audit.jsonl      本地审计（含 legal-accept 确认凭据）
```

---

## 七、常见问题

| 现象                   | 处理                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| 启动后界面被全屏遮住   | 这是免责协议，**必须**等 20 秒倒计时结束点确认；不同意就退出并卸载  |
| 状态条不出现           | 确认插件已启用、已**完全重启** DSH；`/qinglan status` 看是否报错    |
| 提示词不生效           | 菜单「状态」页看「注入正文」字数；为 0 说明稿件读取失败             |
| 协议窗反复出现         | 说明 `legal/DISCLAIMER.txt` 被改动过（内容哈希变化 → 必须重新确认） |
| 档位显示与实跑不一致   | 菜单「状态」页看「档位自检」；标题栏档位 chip 会标橙提示            |
| 想看这句话会怎么发出去 | 菜单「对抗」页 → 转写自检                                           |
