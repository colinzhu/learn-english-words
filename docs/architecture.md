# 架构说明

## 分层

```text
┌────────────────────────────────────────────────────────┐
│ features/  页面业务：home / adventure / wordbook /      │
│            progress                                    │
├────────────────────────────────────────────────────────┤
│ components/ 可复用 UI：WordArt、Icon、Stars、           │
│            AudioButton、Mascot、Shell                  │
├────────────────────────────────────────────────────────┤
│ audio/      发音与音效能力                              │
│ progress/   学习进度模型、持久化、Context                │
│ data/       词库、类型（纯数据）                         │
└────────────────────────────────────────────────────────┘
```

依赖方向自上而下。`data` 和 `progress/model` 不依赖 React，方便单测和未来复用到小程序 / App。

## 内容模型

当前覆盖 **广州教科版（教育科学出版社）2026 三年级上册 + 下册 Word List**，共 16 个单元、283 个全量词条（不含短语/句型）。其中 110 个核心词有完整例句与拼读提示，173 个拓展词由 `fullWordLists.ts` 补齐；另有 16 个单元的 141 张 Chunks and Sentence Stems 句型卡。

```text
WORD_PACKS
├── grade3a.ts (8 units, core words with examples)
│   ├── g3a-u1  Letters in Our Life
│   ├── g3a-u2  English and Chinese
│   ├── g3a-u3  Who's Who?
│   ├── ...
│   └── g3a-u8  It's Time to Exercise!
├── grade3b.ts (8 units, core words with examples)
│   ├── g3b-u1  Get Up
│   ├── g3b-u2  What a Day!
│   ├── ...
│   └── g3b-u8  A Polite Way
├── fullWordLists.ts
│   ├── EXTRA_WORDS        # 173 个 Word List 拓展词
│   └── FULL_WORD_ORDER    # 全部 283 个词的教材顺序
└── phrases.ts             # 16 个单元的 141 张句型卡
```

`WordPack` 包含 `volume`、`unit`、`unitTitle`、主题色、封面 emoji 和词条数组。`packs.ts` 负责把核心词和 Word List 拓展词按教材顺序合并、按册查询、按 ID 查找，并导出 `ALL_WORDS` 供统计与测试使用。

### 单词视觉描述

每个单词不绑定具体组件，而是携带一个可序列化的 `WordArt` 描述：

```ts
type WordArt =
  | { kind: 'emoji'; emoji: string }
  | { kind: 'color'; color: string; name: string }
  | { kind: 'number'; value: number; dots?: boolean }
  | { kind: 'preposition'; position: 'on' | 'in' | 'under' }
  | { kind: 'object'; shape: 'eraser' }
  | { kind: 'text' }
```

`WordArt` 组件负责把这些描述统一渲染到“光晕 + 装饰 + 投影”的视觉框架中。普通具象名词使用 emoji；没有贴切图片的功能词/抽象词统一使用 `text` 形态，用大号英文文字代替图片，中文释义保留在词卡与详情页中，避免错误配图。新增普通名词只需要写 emoji；抽象概念可以扩展新的 kind，而不必修改每个页面。

## 状态管理

应用只有两类长期状态：

1. **学习进度**：`ProgressProvider` 持有，写入 `localStorage` 的 `word-planet.progress.v1`。
2. **声音开关**：`SoundProvider` 持有，写入 `word-planet.muted.v1`。

学习会话内部状态（当前单词、当前步骤、本次获得星星）只存在 `AdventureScreen` 中，退出即结束，避免把临时 UI 状态放进全局。

### 进度结构

```ts
interface ProgressState {
  version: 1
  words: Record<
    string,
    {
      stars: number // 0-3：认识 / 听懂 / 会拼
      discoverAt?: string
      listenAt?: string
      spellAt?: string
      lastSeenAt?: string
    }
  >
  completedSessions: number
  lastPlayedAt?: string
}
```

- 星星只会增加，不会因为重玩而减少。
- `storage.ts` 会过滤非法版本、非法星星数和损坏字段，避免旧数据让页面崩溃。
- 旧版本中遗留的、当前词库不存在的单词记录不会影响统计，统计只认 `WORD_PACKS` 里的当前词条。
- 新增学习步骤时，在 `LearnStep`、`STEP_STAR` 和对应页面中扩展即可。

## 单词学习状态机

```text
discover ──(我记住啦)──► listen ──(选对图片 + 继续)──► spell
   ▲                                                       │
   │                                                       │
   └──────────── 下一个单词（步骤回到 discover） ◄──────────┘
                                                           │
                                             最后一个单词 ──► result
```

- 每个单元词很多，`selectSessionWords()` 每次取最多 8 个未满星单词；完成一组后结果页可继续下一组。
- 看一看 / 听一听 / 拼一拼三个步骤标签可点击切换，支持“上一步”回退；已完成的步骤会显示勾选状态，重复进入不会重复加星。
- 进入单元时从第一个未满星单词开始；全部满星时取前 8 个词复习。
- `AdventureScreen` 只负责流程推进、分组选择和星星入账。
- 三个步骤组件只负责当前交互，并通过 `onPass` / `onContinue` 回调向上沟通。
- 步骤切换时自动回到页面顶部，移动端不会停留在上一步的滚动位置。
- 长单词（如 `chocolate`、`classroom`）使用紧凑字母格和自动换行，避免横向溢出。
- 图鉴支持按册、按单元筛选，以及英文/中文搜索。
- 句型卡使用独立的 `PhraseUnit` 数据，不参与单词星星和掌握度统计；按册、按单元切换，支持整句/慢速朗读。

## 发音与音效

- `speech.ts` 使用浏览器 `speechSynthesis`，优先挑选英文女声，支持 rate 控制。
- `sfx.ts` 使用 `AudioContext` 合成正确、错误、星星、通关音效，不依赖音频文件。
- `SoundProvider` 统一处理静音、音频解锁和 Provider 接口，页面不直接调用底层 API。
- 单词可带 `speakText` 覆盖朗读文本（Mr → Mister、Mrs → Missus、TV → T V），所有页面统一通过 `getWordSpeech()` 取朗读内容。
- 如果要换成真人录音，只需新增 `audio/wordAudio.ts`（或替换 `speakWord` 实现），页面不用改。

## 样式组织

- `global.css`：设计 token、按钮、页头、首页、册别切换。
- `pages.css`：单词图鉴、星星罐、弹窗。
- `adventure.css`：学习流程三步与结算页。
- `word-art.css`：视觉图形系统与各上下文的尺寸。
- `responsive.css`：集中处理断点，最后导入以覆盖基础样式。
- 字体：Baloo 2（界面标题）+ Andika（英文学习内容/字母卡），均为本地打包。

## 测试策略

- 纯逻辑优先单测：词库完整性、句型卡完整性、无图词文字卡规则、选项生成、字母卡（含重复字母）、拼写判题、8 词分组、进度计算、损坏数据恢复。
- 端到端 smoke 用真实 Chrome 跑完整 8 词分组流程，验证路由、交互、星星落盘和结果页。
- UI 截图在 `docs/images/`，用于 README 和回归对照。

## 后续模块化方向

- **content**：把词库拆成 JSON / CMS，支持教材版本和单元筛选。
- **review**：基于错题和星星的间隔重复队列。
- **parent**：家长报告、周目标、学习时长。
- **audio**：真人音频 CDN、口型视频或跟读评分。
- **pwa**：离线缓存、桌面安装。
