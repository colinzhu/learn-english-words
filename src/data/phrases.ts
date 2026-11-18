import type { PackId } from './types'

export interface Phrase {
  id: string
  text: string
  meaning: string
  /** 带省略号的句型，用完整例句朗读 */
  speakText?: string
}

export interface PhraseUnit {
  packId: PackId
  phrases: Phrase[]
}

type Seed = [text: string, meaning: string, speakText?: string]

function make(packId: PackId, seeds: Seed[]): PhraseUnit {
  return {
    packId,
    phrases: seeds.map(([text, meaning, speakText], index) => ({
      id: `${packId}-p${index + 1}`,
      text,
      meaning,
      speakText,
    })),
  }
}

export const PHRASE_UNITS: PhraseUnit[] = [
  make('g3a-u1', [
    ['Show me ..., please.', '请让我看看……', 'Show me your ruler, please.'],
    ['I am ...', '我是……（姓名）', 'I am Lily.'],
    ["You're ...", '你的座位是……（座位号）', "You're in Row One."],
    ["I'm ...", '我的座位是……（座位号）', "I'm in Row Two."],
  ]),
  make('g3a-u2', [
    ["What's this?", '这是什么？'],
    ["It's ...", '这是……', "It's a ruler."],
  ]),
  make('g3a-u3', [
    ['last name', '姓氏'],
    ['Good morning!', '早上好！'],
    ['Nice to meet you!', '很高兴认识你！'],
    ["What's your name?", '你叫什么名字？'],
    ["My name is ... / I'm ...", '我叫……', 'My name is Lily.'],
  ]),
  make('g3a-u4', [
    ['coloured pencil', '彩色铅笔'],
    ['left hand', '左手'],
    ['right hand', '右手'],
    ['How do you spell ...?', '……要怎么拼写？', 'How do you spell ruler?'],
  ]),
  make('g3a-u5', [
    ["What's the ...?", '……是什么？', "What's the word?"],
    ['Can you say that again?', '你能再说一遍吗？'],
    ['Sure! ...', '当然！……', 'Sure! I can help.'],
  ]),
  make('g3a-u6', [
    ['Draw a ...', '画一个……', 'Draw a face.'],
    ['This is ...', '这是……', 'This is my nose.'],
    ['These are ...', '这些是……', 'These are my eyes.'],
    ['What colour is ...?', '……是什么颜色？', 'What colour is the sky?'],
  ]),
  make('g3a-u7', [
    ['face the speaker', '面向说话者'],
    ['nod my head', '点头'],
    ['keep quiet', '保持安静'],
    ['listen to my teacher', '听老师的话'],
    ['put up my hand', '举手'],
    ['wait your turn', '等着轮到你'],
    ['How can you be a good listener?', '你要怎样才能做一个好的倾听者？'],
    ['I see.', '我明白了。'],
    ['I have a question.', '我有一个问题。'],
  ]),
  make('g3a-u8', [
    ['fly like a bird', '像小鸟一样飞翔'],
    ['run like a horse', '像马一样奔跑'],
    ['swim like a fish', '像鱼一样游泳'],
    ['jump like a monkey', '像猴子一样跳'],
    ['walk like a bear', '像熊一样走路'],
    ["Let's ...", '让我们……', "Let's jump like a rabbit."],
    ['Are you ready?', '你准备好了吗？'],
    ['Follow me!', '跟我做！'],
    ['Come on!', '加把劲！'],
  ]),
  make('g3b-u1', [
    ['get up', '起床'],
    ['get dressed', '穿衣'],
    ['brush my teeth', '刷牙'],
    ['wash my face', '洗脸'],
    ['comb my hair', '梳头'],
    ['have breakfast', '吃早饭'],
    ['I ...', '我……', 'I get up at seven.'],
    ['Then, I ...', '然后，我……', 'Then, I wash my face.'],
    ['After that, I ...', '那之后，我……', 'After that, I have breakfast.'],
    ["Don't forget to ...", '别忘了……', "Don't forget to brush your teeth."],
  ]),
  make('g3b-u2', [
    ["ten o'clock", '十点整'],
    ['half past ten', '十点半'],
    ['ten thirty', '十点三十分'],
    ['have class', '上课'],
    ['go home', '回家'],
    ['go to school', '去上学'],
    ['go to bed', '去睡觉'],
    ['hurry up', '快点'],
    ['What time is it?', '现在几点了？'],
    ["It's ...", '现在……了。', "It's eight o'clock."],
    ["It's time to / for ...", '是该……的时候了。', "It's time for school."],
    ["I'm late!", '我迟到了！'],
  ]),
  make('g3b-u3', [
    ['nine ten', '九点十分'],
    ['eight twenty', '八点二十分'],
    ['seven forty', '七点四十分'],
    ['six fifty', '六点五十分'],
    ['have dinner', '吃晚饭'],
    ['read books', '看书'],
    ['play sports', '做运动'],
    ['watch TV', '看电视'],
    ['have lunch', '吃午饭'],
    ['go to a school club', '参加学校社团'],
    ['pack my schoolbag', '收拾书包'],
    ['half an hour', '半小时'],
    ['What time do you ...?', '你几点……？', 'What time do you get up?'],
    ['I ... at ...', '我……的时候……', 'I have lunch at twelve.'],
    ['I ... from ... to ...', '我从……到……之间……', 'I read books from seven to eight.'],
  ]),
  make('g3b-u4', [
    ['Do you want to join us?', '你想加入我们吗？'],
    ['Do you want to try?', '你想试试吗？'],
    ['Can I join you?', '我能加入你们吗？'],
    ["You're up next!", '下一个该你了！'],
    ['Come and play!', '来玩吧！'],
    ["I'd love to!", '我很愿意！'],
    ['No, thanks!', '不了，谢谢！'],
    ['... is just not my thing.', '我不是很喜欢……', 'Football is just not my thing.'],
    ['That looks like fun.', '看起来真有趣。'],
    ['Can I have a turn?', '我能玩一次吗？'],
    ['You can go first.', '你先来。'],
  ]),
  make('g3b-u5', [
    ['classroom rules', '班规'],
    ["don't run in the classroom", '不要在教室里奔跑'],
    ['do your best', '尽自己最大努力'],
    ['take turns to speak', '轮流说话'],
    ['say nice words', '用语得体'],
    ['give a helping hand', '向别人伸出援手'],
    ['put away your things', '收拾好自己的东西'],
    ['listen carefully', '仔细听'],
    ['What rules do you like?', '你喜欢哪些规则？'],
    ['I like "...".', '我喜欢“……”。', "I like 'Listen carefully'."],
  ]),
  make('g3b-u6', [
    ['on duty', '值日'],
    ['line leader', '列队小帮手'],
    ['lunch helper', '午餐小帮手'],
    ['teacher helper', '老师小帮手'],
    ['help everyone stand in line', '帮助大家站好队'],
    ['lead the way', '带路'],
    ['carry food boxes', '搬运食物盒'],
    ['hand out food', '分发食物'],
    ['hand out papers', '分发试卷'],
    ['put away books', '收好书'],
    ['What do you want to be?', '你想成为什么？'],
    ['I want to be a/an ...', '我想成为……', 'I want to be a teacher.'],
    ['What do you want to do?', '你想做什么？'],
    ['I want to ...', '我想……', 'I want to help.'],
  ]),
  make('g3b-u7', [
    ['keep to the right', '靠右走'],
    ['get in line', '排队'],
    ['hold the door', '扶着门'],
    ['say "excuse me"', '说“打扰一下”'],
    ["don't run in the hallway", '不要在走廊奔跑'],
    ['keep your voice down', '小声一点'],
    ["don't eat or drink", '不要吃东西或喝饮料'],
    ['in the toilet', '在厕所里'],
    ['What should we do at school?', '我们在学校应该怎么做？'],
    ['We should ... and ...', '我们应该……和……', 'We should be polite and keep quiet.'],
    ['Oh, sorry!', '哦，对不起！'],
    ["It's okay.", '没关系。'],
  ]),
  make('g3b-u8', [
    ['close the window', '关窗'],
    ['turn on the lights', '开灯'],
    ['use the computer with care', '小心使用电脑'],
    ['wash your hands', '洗手'],
    ['music classroom', '音乐教室'],
    ['computer classroom', '电脑教室'],
    ['What do you do in ...?', '你在……做什么？', 'What do you do in the library?'],
    ['road sign', '路标'],
    ['safety rules', '安全规则'],
    ['stop on red', '红灯停'],
    ['before you go', '在你走之前'],
    ['look left', '向左看'],
    ['look right', '向右看'],
    ['go on green', '绿灯行'],
    ['be careful', '小心'],
    ['What would you like to do?', '你想做什么？'],
    ["I'd like to ...", '我想……', "I'd like to read."],
  ]),
]

export const TOTAL_PHRASES = PHRASE_UNITS.reduce((sum, unit) => sum + unit.phrases.length, 0)
