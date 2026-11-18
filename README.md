# 单词星球 · Word Planet

面向小学三年级学生的英语单词学习 Web App。孩子通过 **看图 → 听音 → 拼写** 三步，把单词的“样子、声音、拼写、用法”连在一起，在游戏化的探险里自然记忆。

当前词库为 **广州教科版（教育科学出版社）2026 三年级上册 + 下册 Word List 全量词表**：

- **2 册 × 8 单元 = 16 个单元**
- **283 个全量词条**（不含短语和句型）
- 110 个核心词带完整例句、拼读提示和场景说明
- 173 个 Word List 拓展词带图形、音标、中文释义和发音，同样可以听音、选图、拼写
- 另有 **16 个单元的 141 张 Chunks and Sentence Stems 句型卡**，支持听句子、慢速跟读和替换练习提示

![单词星球首页](docs/images/home.png)

## 产品亮点

- **全量词表**：覆盖教材 Word List 中的单字词条，按单元和教材顺序排列。
- **句型卡**：教材 Chunks and Sentence Stems 按单元整理，支持整句朗读、慢速听读和句型骨架示例。
- **分组学习**：每个单元 12–27 个词，每次学习最多 8 个未满星单词，完成一组后可以继续下一组。
- **自由回退**：看一看 / 听一听 / 拼一拼三个步骤都可以点击切换，也可以点“上一步”回到上一步。
- **多感官学习**：视觉图形、浏览器英文语音、音效反馈和字母拼写互动。
- **完整学习闭环**：每个单词经历“看一看 → 听一听 → 拼一拼”，完成后点亮 3 颗星。
- **即时正反馈**：答对有小星星和音效，答错不扣分、可以重试，并可查看提示。
- **单词图鉴**：支持按册、按单元筛选，支持搜索英文单词或中文意思。
- **学习数据可保存**：星星、单词掌握度和已完成探险保存在浏览器 `localStorage`。
- **模块化、可扩展**：词库、发音、音效、进度、页面和视觉图形彼此独立。

## 界面预览

### 学习三步曲

| 看一看 | 听一听 | 拼一拼 |
| --- | --- | --- |
| ![看一看：图形、单词、音标和例句](docs/images/discover.png) | ![听一听：听单词选图片](docs/images/listen.png) | ![拼一拼：点击字母卡拼写](docs/images/spell.png) |

### 分组完成

![本组完成结果页](docs/images/result.png)

### 步骤回退

![可点击切换、支持上一步的步骤导航](docs/images/steps.png)

### 句型卡

![教材语块与句型卡](docs/images/phrases.png)

### 单词图鉴与星星罐

| 单词图鉴 | 星星罐 |
| --- | --- |
| ![单词图鉴](docs/images/wordbook.png) | ![星星罐](docs/images/progress.png) |

### 手机端

<img src="docs/images/mobile-home.png" alt="手机端首页" width="320" />

## 内容范围

| 册别 | 单元 | 主题 | 词条数 |
| --- | --- | --- | --- |
| 三上 | Unit 1 | Letters in Our Life | 15 |
| 三上 | Unit 2 | English and Chinese | 19 |
| 三上 | Unit 3 | Who's Who? | 22 |
| 三上 | Unit 4 | Colour a Keyboard | 19 |
| 三上 | Unit 5 | Set a Password | 15 |
| 三上 | Unit 6 | I Can Draw | 14 |
| 三上 | Unit 7 | Be a Good Listener | 13 |
| 三上 | Unit 8 | It's Time to Exercise! | 27 |
| 三下 | Unit 1 | Get Up | 13 |
| 三下 | Unit 2 | What a Day! | 17 |
| 三下 | Unit 3 | Plan My Day | 27 |
| 三下 | Unit 4 | Come and Join Us! | 12 |
| 三下 | Unit 5 | Our Classroom, Our Call | 14 |
| 三下 | Unit 6 | I'm on Duty | 22 |
| 三下 | Unit 7 | School Rules | 16 |
| 三下 | Unit 8 | A Polite Way | 18 |

> 全量词表覆盖的是教材 Word List 中的单词，句型与语块单独放在“句型卡”模块。Review 和 Road Helper Day 的句型暂未收录。实际教学请以孩子手中的教材版本为准。
>
> 词表参考：[广州教科版三年级上册 Unit 1 单词表](https://yy.suyang123.com/xiaoxue/sannianji/gzjkb_shangce_words1.html)、[广州教科版三年级下册 Word List](https://yy.suyang123.com/xiaoxue/sannianji/gzjkb_2025xiace_listen10.html)、[2026 广州教科版三年级上册 Review](https://yyld.51jiaoxi.com/sanshang/gzjkb_danyuan010.html)。

## 快速开始

要求：Node.js 20.19+、pnpm 11+。

```bash
pnpm install
pnpm dev
```

打开 <http://127.0.0.1:5173>。

生产构建与本地预览：

```bash
pnpm build
pnpm preview
```

运行单元测试：

```bash
pnpm test
```

端到端冒烟测试（需要先启动 `pnpm dev`，并安装 Chrome）：

```bash
pnpm smoke
```

可通过环境变量指定地址和浏览器：

```bash
BASE_URL=http://127.0.0.1:5173 CHROME_PATH="/path/to/Chrome" pnpm smoke
```


## 部署

`pnpm build` 会生成完整的静态站点，产物在 `dist/`：

```text
dist/
├── index.html
├── favicon.svg
└── assets/
    ├── index-*.js
    ├── index-*.css
    └── *.woff2 / *.woff
```

部署时只需要把 `dist/` **里面的全部内容**上传到服务器即可，不需要上传 `src/`、`node_modules/` 或项目根目录。已经配置为相对资源路径，因此可以放在域名根目录，也可以放在任意子目录：

- `https://example.com/`：上传 `dist/` 内文件到网站根目录
- `https://example.com/word-planet/`：上传 `dist/` 内文件到 `word-planet` 目录

应用使用 HashRouter，刷新和分享链接时会保留在 `#/...` 路由中，**不需要配置 Nginx/Apache 的 history fallback 重写规则**。项目没有后端接口，单词发音使用浏览器自带语音，学习进度保存在浏览器 `localStorage`。

> 构建说明：`pnpm-workspace.yaml` 中使用了 `@rollup/wasm-node` 覆盖 Rollup 原生包，以兼容当前 macOS Node 运行环境对原生模块加载的限制。对业务代码没有影响。

## 学习流程

```text
首页选择册别 / 单元
    ↓
自动选择本单元最多 8 个未满星单词
    ↓
看一看：图形 + 单词 + 音标 + 发音（核心词含例句和拼读提示）
    ↓
听一听：听单词，从 3 张图片中选出正确的一张
    ↓
拼一拼：按顺序点击字母卡，拼出完整单词
    ↓
点亮星星 → 本组结算 → 继续下一组 / 回地图
```

每个步骤的星星会即时写入本地进度。再次进入单元时会从第一个未满星单词开始；全部满星后，再次进入会取前 8 个词复习。

## 项目结构

```text
src/
├── app 入口
│   ├── App.tsx                 # 路由与 Provider 组装
│   └── main.tsx                # React 入口、字体与样式导入
├── data/                       # 内容层：只放数据与类型
│   ├── types.ts
│   ├── grade3a.ts              # 三上核心词（完整例句/提示）
│   ├── grade3b.ts              # 三下核心词（完整例句/提示）
│   ├── fullWordLists.ts        # Word List 拓展词 + 全量词序
│   ├── phrases.ts              # 16 个单元的 141 张句型卡
│   ├── packs.ts                # 合并、排序、册别与查询函数
│   └── packs.test.ts           # 词库完整性测试
├── audio/                      # 声音能力：可独立替换
│   ├── speech.ts               # Web Speech API 英文朗读
│   ├── sfx.ts                  # Web Audio 音效
│   └── SoundProvider.tsx       # 静音、发音、音效上下文
├── progress/                   # 学习进度：纯函数 + 存储 + Context
│   ├── model.ts                # 星星计算、统计（纯函数，可测试）
│   ├── storage.ts              # localStorage 读写与数据清洗
│   ├── ProgressProvider.tsx
│   └── model.test.ts
├── features/                   # 业务页面：按功能模块拆分
│   ├── home/                   # 首页 + 册别切换
│   ├── adventure/              # 学习主流程
│   │   ├── AdventureScreen.tsx # 会话状态机 + 8 词分组
│   │   ├── DiscoverStep.tsx    # 看一看
│   │   ├── ListenStep.tsx      # 听一听
│   │   ├── SpellStep.tsx       # 拼一拼
│   │   ├── ResultStep.tsx      # 分组结算 + 彩纸
│   │   └── helpers.ts          # 选项、字母卡、判题、分组逻辑
│   ├── wordbook/               # 单词图鉴 + 搜索 + 单元筛选
│   ├── phrases/                # 句型卡 + 单元切换 + 听读
│   └── progress/               # 星星罐 + 徽章
├── components/                 # 可复用 UI
│   ├── WordArt.tsx             # 统一视觉图形渲染器
│   ├── AudioButton.tsx
│   ├── Icon.tsx
│   ├── Mascot.tsx
│   └── ...
└── styles/                     # 设计 token、页面样式、响应式
```

更细的模块边界和扩展方式见 [docs/architecture.md](docs/architecture.md)。

## 视觉图形系统

`WordArt` 用一个统一的“贴纸 + 光晕 + 装饰”框架渲染不同类型的单词图形：

- `emoji`：动物、食物、人物、文具、身体、场所等具象词。
- `color`：带表情的色块，帮助记忆颜色词。
- `number`：大数字 + 十格点阵，把数量可视化；30/40/50 可关闭点阵。
- `preposition`：盒子与小球的方位示意图，表达 on / in / under。
- `object`：没有合适 emoji 的文具（如 eraser）用自绘 SVG 补齐。
- `text`：代词、介词、连词、功能词和没有贴切图片的抽象词使用大号英文文字卡代替图片，不强行配 emoji；中文释义仍在单词卡和详情页中展示。

这样新增单词时，大多数情况只需要填一个 emoji；抽象词自动使用文字图形，不需要为新词单独画图。

## 新增单词或单元

1. 在 `src/data/types.ts` 的 `PackId` 中加入新值（如果新增单元）。
2. 核心词写入 `grade3a.ts` / `grade3b.ts`，包含完整例句和拼读提示。
3. 全量词表拓展词写入 `fullWordLists.ts`，并同步 `FULL_WORD_ORDER` 的教材顺序。
4. `packs.ts` 会自动合并核心词和拓展词，首页、图鉴、星星罐、进度统计会自动更新。
5. 运行 `pnpm test && pnpm build` 验证。

## 设计取舍

- **不惩罚错误**：错选只会让选项变灰，可以继续尝试；拼写错误可以退格、清空或看提示。
- **全量不等于全部精讲**：核心词有完整例句和拼读提示；拓展词以词表记忆为主，同样可以进入听音和拼写流程。
- **不强行配图**：没有合适图片的词用英文文字卡代替图片，避免给孩子建立错误的图像联想；中文释义保留在词卡和详情页。
- **缩写朗读修正**：Mr / Mrs / Ms / Miss 等缩写使用专门的朗读文本（如 Mr → Mister），避免语音合成读错。
- **先理解再拼写**：拼写阶段不直接显示英文单词，只给图形、中文和发音，避免“照抄”。
- **可访问性**：语音不可用时，会提示家长/老师读出单词，保证流程仍可完成。
- **识字友好字体**：英文单词和字母卡使用 Andika，界面标题使用 Baloo 2。
- **无账号、无上传**：所有进度只存在本机浏览器，适合儿童使用，也便于快速验证。

## 当前边界与下一步

暂未包含：

- Review / Road Helper Day 的句型卡
- 拓展词的逐词例句（目前拓展词以词表记忆和拼写为主）
- 统一录制的高质量单词音频（目前依赖设备内置英文语音，音色会因系统不同而变化）
- 间隔重复算法 / 错词本 / 每日任务
- 云端同步、账号体系、教师后台
- PWA 离线安装和更完整的无障碍审计

建议下一阶段优先确认：**是否继续补 Review 句型卡、是否要真人录音、是否需要错词本和间隔复习**。

## 测试

- `src/data/packs.test.ts`：16 个单元、283 个词条的数量与字段完整性、ID 唯一性、无图词文字卡规则、缩写朗读覆盖。
- `src/data/phrases.test.ts`：16 个句型单元、141 张句型卡、ID 唯一性和朗读示例完整性。
- `src/features/adventure/helpers.test.ts`：字母卡、拼写判题、听音选项去重、8 词分组。
- `src/progress/model.test.ts`：星星只增不减、完成次数统计、损坏本地数据的容错。
- `scripts/smoke.mjs`：真实浏览器跑完整 8 词分组流程并校验落盘数据。
