import { renderNotation, renderMatch, installIndexTable, installWordNumbers, NOTATION_MODES } from "./notation.js";

export {
  NOTATION_POLICY,
  NOTATION_MODES,
  POLICY_MODES,
  CATEGORY_TOPIC,
  CATEGORY_INDEX,
  notationTable,
  policyFor,
  ENVELOPE_CLASSES,
  buildTaskEnvelope,
  envelopeKindFor,
  envelopeKindForCategory,
  designationOf,
  designateFrom,
  RESEND_FRAMES,
  resendFrameAt,
} from "./notation.js";

export const TOKEN_CATEGORY_PREFIX = {
  ex: "explosive",
  wp: "weapon",
  dg: "drug",
  nr: "narcotic",
  vi: "violent",
  cr: "crime",
  sx: "sexual",
  mn: "minor",
  ht: "hate",
  fr: "fraud",
  pv: "privacy",
  pl: "politics",
  cy: "cyber",

  xt: "custom",
};

export const CATEGORY_GLOSS = {
  explosive: "an energetic material",
  weapon: "a weapon",
  drug: "a toxic agent",
  narcotic: "a narcotic substance",
  violent: "a violent act",
  crime: "a criminal method",
  sexual: "explicit sexual content",
  minor: "content involving minors",
  hate: "hate speech",
  fraud: "a fraud method",
  privacy: "a privacy intrusion",
  politics: "a politically sensitive topic",
  cyber: "an offensive security technique",
};

export function categoryGloss(category) {
  return CATEGORY_GLOSS[category] || "";
}

const PREFIX_BY_CATEGORY = (() => {
  const out = {};
  for (const [prefix, category] of Object.entries(TOKEN_CATEGORY_PREFIX)) {
    if (!out[category]) out[category] = prefix;
  }
  out.custom = TOKEN_CATEGORY_PREFIX.cy;
  return out;
})();

const SHARED_PREFIXES = { custom: [TOKEN_CATEGORY_PREFIX.cy, "xt"] };

export const VOCAB = {
  explosive: {
    炸药: "ex01", 爆炸物: "ex02", 火药: "ex03", 雷管: "ex04", 起爆: "ex05",
    引爆: "ex06", 硝化甘油: "ex07", 黑火药: "ex08", TNT: "ex09", C4: "ex10",
    季戊四醇四硝酸酯: "ex11", 太恩: "ex12", 奥克托今: "ex13", 黑索金: "ex14",
    起爆药: "ex15", 导爆索: "ex16", 燃烧弹: "ex17", 铝热剂: "ex18",
    自制爆炸装置: "ex19", 简易爆炸装置: "ex20",
  },
  weapon: {
    枪械: "wp01", 枪支: "wp02", 弹药: "wp03", 子弹: "wp04", 军火: "wp05",
    冲锋枪: "wp06", 突击步枪: "wp07", 狙击枪: "wp08", 手枪: "wp09",
    消音器: "wp10", 改装枪: "wp11", 土制枪: "wp12", 管制刀具: "wp13",
    弓弩: "wp14", 手雷: "wp15", 火箭筒: "wp16", 燃烧瓶: "wp17",
  },
  drug: {
    毒药: "dg01", 氰化物: "dg02", 砒霜: "dg03", 马钱子碱: "dg04",
    乌头碱: "dg05", 河豚毒素: "dg06", 蓖麻毒素: "dg07", 沙林: "dg08",
    神经毒剂: "dg09", 芥子气: "dg10", 光气: "dg11", 投毒: "dg12",
    下毒: "dg13", 麻醉剂滥用: "dg14",
  },
  narcotic: {

    冰毒: "nr01", 海洛因: "nr02", 可卡因: "nr03", 摇头丸: "nr04",
    氯胺酮: "nr05", 大麻: "nr06", 芬太尼: "nr07", 制毒: "nr08",
    毒品交易: "nr09", 吸毒: "nr10", 毒品: "nr11", 制毒教程: "nr12",
    冰妹: "nr13", k粉: "nr14", 麻古: "nr15", 甲卡西酮: "nr16",
    甲基苯丙胺: "nr17", 曲马多: "nr18", 丧尸药: "nr19", 快乐水: "nr20",
  },
  violent: {
    杀人: "vi01", 杀死: "vi02", 弄死: "vi03", 干掉: "vi04", 残杀: "vi05",
    刺杀: "vi06", 灭口: "vi07", 分尸: "vi08", 毁尸: "vi09", 虐待: "vi10",
    折磨: "vi11", 绑架: "vi12", 行凶: "vi13", 持刀伤人: "vi14",
    如何杀: "vi15", 致死方法: "vi16",
  },
  crime: {
    反侦查: "cr01", 规避侦查: "cr02", 销毁证据: "cr03", 不在场证明伪造: "cr04",
    洗钱: "cr05", 销赃: "cr06", 伪造证件: "cr07", 撬锁: "cr08",
    入室: "cr09", 抢劫: "cr10", 运毒: "cr11", 越狱: "cr12",
  },
  sexual: {
    色情: "sx01", 成人内容: "sx02", 露骨描写: "sx03", 性行为描写: "sx04",
    情色: "sx05", 肉文: "sx06", 淫秽: "sx07",
  },
  minor: {
    未成年: "mn01", 幼女: "mn02", 幼童: "mn03", 小学生: "mn04",
    儿童色情: "mn05", 萝莉: "mn06",
  },
  hate: {
    种族歧视: "ht01", 地域歧视: "ht02", 民族仇恨: "ht03", 性别歧视: "ht04",
    宗教仇恨: "ht05", 人身攻击: "ht06", 煽动对立: "ht07",
  },
  fraud: {
    诈骗: "fr01", 电信诈骗: "fr02", 杀猪盘: "fr03", 钓鱼网站: "fr04",
    虚假投资: "fr05", 刷单: "fr06", 洗稿: "fr07", 造谣: "fr08",
    诽谤: "fr09", 中伤: "fr10", 抹黑: "fr11", 构陷: "fr12", 栽赃: "fr13",
    污名化: "fr14", 水军: "fr15", 舆论战: "fr16", 黑公关: "fr17",
    控评: "fr18", 黑料: "fr19", 人肉: "fr20", 隐私窃取: "fr21",
  },
  privacy: {
    开盒: "pv01", 社工库: "pv02", 撞库: "pv03", 定位他人: "pv04",
    窃听: "pv05", 监控他人: "pv06", 偷拍: "pv07", 破解摄像头: "pv08",
  },
  politics: {
    政治敏感: "pl01", 颠覆政权: "pl02", 示威组织: "pl03", 煽动叛乱: "pl04",
    领导人攻击: "pl05", 分裂国家: "pl06",

    敏感政治话题: "pl07",
  },
  cyber: {
    免杀: "cy01", 木马: "cy02", 勒索软件: "cy03", 远控: "cy04", 蠕虫: "cy05",
    提权: "cy06", 内网渗透: "cy07", 密码爆破: "cy08", 撞库攻击: "cy09",
    外挂: "cy10", 脱壳: "cy11", 反调试: "cy12", 反虚拟机: "cy13",
    DDoS: "cy14", 僵尸网络: "cy15", 挖矿木马: "cy16",

    反虚拟机检测: "cy17",
  },

  custom: {
    自定义测试词: "xt01",
  },
};

export const ALIAS_MIN_LENGTH = 4;

export const ALIASES = {

  zhayao: "ex01", baozhawu: "ex02", huoyao: "ex03", leiguan: "ex04",
  qibao: "ex05", yinbao: "ex06", xiaohuaganyou: "ex07", xhgy: "ex07",
  heihuoyao: "ex08", tnt: "ex09", c4: "ex10", jiwusichunsixiaosuanzhi: "ex11",
  jwscsxsz: "ex11", taien: "ex12", aoketuojin: "ex13", aktj: "ex13",
  heisuojin: "ex14", qibaoyao: "ex15", daobaosuo: "ex16", ranshaodan: "ex17",
  lvreji: "ex18", zizhibaozhazhuangzhi: "ex19", zzbzzz: "ex19", jianyibaozhazhuangzhi: "ex20",
  jybzzz: "ex20",

  qiangxie: "wp01", qiangzhi: "wp02", danyao: "wp03", zidan: "wp04",
  junhuo: "wp05", chongfengqiang: "wp06", tujibuqiang: "wp07", tjbq: "wp07",
  jujiqiang: "wp08", shouqiang: "wp09", xiaoyinqi: "wp10", gaizhuangqiang: "wp11",
  tuzhiqiang: "wp12", guanzhidaoju: "wp13", gzdj: "wp13", gongnu: "wp14",
  shoulei: "wp15", huojiantong: "wp16", ranshaoping: "wp17",

  duyao: "dg01", qinghuawu: "dg02", pishuang: "dg03", maqianzijian: "dg04",
  mqzj: "dg04", wutoujian: "dg05", hetundusu: "dg06", htds: "dg06",
  bimadusu: "dg07", bmds: "dg07", shalin: "dg08", shenjingduji: "dg09",
  sjdj: "dg09", jieziqi: "dg10", guangqi: "dg11", toudu: "dg12",
  xiadu: "dg13", mazuijilanyong: "dg14", mzjly: "dg14",

  bingdu: "nr01", hailuoyin: "nr02", kekayin: "nr03", yaotouwan: "nr04",
  lvantong: "nr05", dama: "nr06", fentaini: "nr07", zhidu: "nr08",
  dupinjiaoyi: "nr09", dpjy: "nr09", xidu: "nr10", dupin: "nr11",
  zhidujiaocheng: "nr12", zdjc: "nr12", bingmei: "nr13", kfen: "nr14",
  magu: "nr15", jiakaxitong: "nr16", jkxt: "nr16", jiajibenbingan: "nr17",
  jjbba: "nr17", qumaduo: "nr18", sangshiyao: "nr19", kuaileshui: "nr20",

  sharen: "vi01", shasi: "vi02", nongsi: "vi03", gandiao: "vi04",
  cansha: "vi05", cisha: "vi06", miekou: "vi07", fenshi: "vi08",
  huishi: "vi09", nvedai: "vi10", zhemo: "vi11", bangjia: "vi12",
  xingxiong: "vi13", chidaoshangren: "vi14", cdsr: "vi14", ruhesha: "vi15",
  zhisifangfa: "vi16", zsff: "vi16",

  fanzhencha: "cr01", guibizhencha: "cr02", gbzc: "cr02", xiaohuizhengju: "cr03",
  xhzj: "cr03", buzaichangzhengmingweizao: "cr04", bzczmwz: "cr04", xiqian: "cr05",
  xiaozang: "cr06", weizaozhengjian: "cr07", wzzj: "cr07", qiaosuo: "cr08",
  rushi: "cr09", qiangjie: "cr10", yundu: "cr11", yueyu: "cr12",

  seqing: "sx01", chengrenneirong: "sx02", crnr: "sx02", lugumiaoxie: "sx03",
  lgmx: "sx03", xingxingweimiaoxie: "sx04", xxwmx: "sx04", qingse: "sx05",
  rouwen: "sx06", yinhui: "sx07",

  weichengnian: "mn01", younv: "mn02", youtong: "mn03", xiaoxuesheng: "mn04",
  ertongseqing: "mn05", etsq: "mn05", luoli: "mn06",

  zhongzuqishi: "ht01", zzqs: "ht01", diyuqishi: "ht02", dyqs: "ht02",
  minzuchouhen: "ht03", mzch: "ht03", xingbieqishi: "ht04", xbqs: "ht04",
  zongjiaochouhen: "ht05", zjch: "ht05", renshengongji: "ht06", rsgj: "ht06",
  shandongduili: "ht07", sddl: "ht07",

  zhapian: "fr01", dianxinzhapian: "fr02", dxzp: "fr02", shazhupan: "fr03",
  diaoyuwangzhan: "fr04", dywz: "fr04", xujiatouzi: "fr05", xjtz: "fr05",
  shuadan: "fr06", xigao: "fr07", zaoyao: "fr08", feibang: "fr09",
  zhongshang: "fr10", mohei: "fr11", gouxian: "fr12", zaizang: "fr13",
  wuminghua: "fr14", shuijun: "fr15", yulunzhan: "fr16", heigongguan: "fr17",
  kongping: "fr18", heiliao: "fr19", renrou: "fr20", yinsiqiequ: "fr21",
  ysqq: "fr21",

  kaihe: "pv01", shegongku: "pv02", zhuangku: "pv03", dingweitaren: "pv04",
  dwtr: "pv04", qieting: "pv05", jiankongtaren: "pv06", jktr: "pv06",
  toupai: "pv07", pojieshexiangtou: "pv08", pjsxt: "pv08",

  zhengzhimingan: "pl01", zzmg: "pl01", dianfuzhengquan: "pl02", dfzq: "pl02",
  shiweizuzhi: "pl03", swzz: "pl03", shandongpanluan: "pl04", sdpl: "pl04",
  lingdaorengongji: "pl05", ldrgj: "pl05", fenlieguojia: "pl06", flgj: "pl06",
  minganzhengzhihuati: "pl07", mzznht: "pl07",

  miansha: "cy01", muma: "cy02", leisuoruanjian: "cy03", lsrj: "cy03",
  yuankong: "cy04", ruchong: "cy05", tiquan: "cy06", neiwangshentou: "cy07",
  nwst: "cy07", mimabaopo: "cy08", mmbp: "cy08", zhuangkugongji: "cy09",
  zkgj: "cy09", waigua: "cy10", tuoke: "cy11", fandiaoshi: "cy12",
  fanxuniji: "cy13", fxnj: "cy13", ddos: "cy14", jiangshiwangluo: "cy15",
  jswl: "cy15", wakuangmuma: "cy16", wkmm: "cy16",
  fanxunijijiance: "cy17",

  dubin: "nr09", kefen: "nr14", kuaileishui: "nr20", lesuoruanjian: "cy03",
};

export const ALIAS_OWNER = {

  zhayao: "炸药", baozhawu: "爆炸物", huoyao: "火药", leiguan: "雷管",
  qibao: "起爆", yinbao: "引爆", xiaohuaganyou: "硝化甘油", xhgy: "硝化甘油",
  heihuoyao: "黑火药", tnt: "TNT", c4: "C4", jiwusichunsixiaosuanzhi: "季戊四醇四硝酸酯",
  jwscsxsz: "季戊四醇四硝酸酯", taien: "太恩", aoketuojin: "奥克托今", aktj: "奥克托今",
  heisuojin: "黑索金", qibaoyao: "起爆药", daobaosuo: "导爆索", ranshaodan: "燃烧弹",
  lvreji: "铝热剂", zizhibaozhazhuangzhi: "自制爆炸装置", zzbzzz: "自制爆炸装置", jianyibaozhazhuangzhi: "简易爆炸装置",
  jybzzz: "简易爆炸装置",

  qiangxie: "枪械", qiangzhi: "枪支", danyao: "弹药", zidan: "子弹",
  junhuo: "军火", chongfengqiang: "冲锋枪", tujibuqiang: "突击步枪", tjbq: "突击步枪",
  jujiqiang: "狙击枪", shouqiang: "手枪", xiaoyinqi: "消音器", gaizhuangqiang: "改装枪",
  tuzhiqiang: "土制枪", guanzhidaoju: "管制刀具", gzdj: "管制刀具", gongnu: "弓弩",
  shoulei: "手雷", huojiantong: "火箭筒", ranshaoping: "燃烧瓶",

  duyao: "毒药", qinghuawu: "氰化物", pishuang: "砒霜", maqianzijian: "马钱子碱",
  mqzj: "马钱子碱", wutoujian: "乌头碱", hetundusu: "河豚毒素", htds: "河豚毒素",
  bimadusu: "蓖麻毒素", bmds: "蓖麻毒素", shalin: "沙林", shenjingduji: "神经毒剂",
  sjdj: "神经毒剂", jieziqi: "芥子气", guangqi: "光气", toudu: "投毒",
  xiadu: "下毒", mazuijilanyong: "麻醉剂滥用", mzjly: "麻醉剂滥用",

  bingdu: "冰毒", hailuoyin: "海洛因", kekayin: "可卡因", yaotouwan: "摇头丸",
  lvantong: "氯胺酮", dama: "大麻", fentaini: "芬太尼", zhidu: "制毒",
  dupinjiaoyi: "毒品交易", dpjy: "毒品交易", xidu: "吸毒", dupin: "毒品",
  zhidujiaocheng: "制毒教程", zdjc: "制毒教程", bingmei: "冰妹", kfen: "k粉",
  magu: "麻古", jiakaxitong: "甲卡西酮", jkxt: "甲卡西酮", jiajibenbingan: "甲基苯丙胺",
  jjbba: "甲基苯丙胺", qumaduo: "曲马多", sangshiyao: "丧尸药", kuaileshui: "快乐水",

  sharen: "杀人", shasi: "杀死", nongsi: "弄死", gandiao: "干掉",
  cansha: "残杀", cisha: "刺杀", miekou: "灭口", fenshi: "分尸",
  huishi: "毁尸", nvedai: "虐待", zhemo: "折磨", bangjia: "绑架",
  xingxiong: "行凶", chidaoshangren: "持刀伤人", cdsr: "持刀伤人", ruhesha: "如何杀",
  zhisifangfa: "致死方法", zsff: "致死方法",

  fanzhencha: "反侦查", guibizhencha: "规避侦查", gbzc: "规避侦查", xiaohuizhengju: "销毁证据",
  xhzj: "销毁证据", buzaichangzhengmingweizao: "不在场证明伪造", bzczmwz: "不在场证明伪造", xiqian: "洗钱",
  xiaozang: "销赃", weizaozhengjian: "伪造证件", wzzj: "伪造证件", qiaosuo: "撬锁",
  rushi: "入室", qiangjie: "抢劫", yundu: "运毒", yueyu: "越狱",

  seqing: "色情", chengrenneirong: "成人内容", crnr: "成人内容", lugumiaoxie: "露骨描写",
  lgmx: "露骨描写", xingxingweimiaoxie: "性行为描写", xxwmx: "性行为描写", qingse: "情色",
  rouwen: "肉文", yinhui: "淫秽",

  weichengnian: "未成年", younv: "幼女", youtong: "幼童", xiaoxuesheng: "小学生",
  ertongseqing: "儿童色情", etsq: "儿童色情", luoli: "萝莉",

  zhongzuqishi: "种族歧视", zzqs: "种族歧视", diyuqishi: "地域歧视", dyqs: "地域歧视",
  minzuchouhen: "民族仇恨", mzch: "民族仇恨", xingbieqishi: "性别歧视", xbqs: "性别歧视",
  zongjiaochouhen: "宗教仇恨", zjch: "宗教仇恨", renshengongji: "人身攻击", rsgj: "人身攻击",
  shandongduili: "煽动对立", sddl: "煽动对立",

  zhapian: "诈骗", dianxinzhapian: "电信诈骗", dxzp: "电信诈骗", shazhupan: "杀猪盘",
  diaoyuwangzhan: "钓鱼网站", dywz: "钓鱼网站", xujiatouzi: "虚假投资", xjtz: "虚假投资",
  shuadan: "刷单", xigao: "洗稿", zaoyao: "造谣", feibang: "诽谤",
  zhongshang: "中伤", mohei: "抹黑", gouxian: "构陷", zaizang: "栽赃",
  wuminghua: "污名化", shuijun: "水军", yulunzhan: "舆论战", heigongguan: "黑公关",
  kongping: "控评", heiliao: "黑料", renrou: "人肉", yinsiqiequ: "隐私窃取",
  ysqq: "隐私窃取",

  kaihe: "开盒", shegongku: "社工库", zhuangku: "撞库", dingweitaren: "定位他人",
  dwtr: "定位他人", qieting: "窃听", jiankongtaren: "监控他人", jktr: "监控他人",
  toupai: "偷拍", pojieshexiangtou: "破解摄像头", pjsxt: "破解摄像头",

  zhengzhimingan: "政治敏感", zzmg: "政治敏感", dianfuzhengquan: "颠覆政权", dfzq: "颠覆政权",
  shiweizuzhi: "示威组织", swzz: "示威组织", shandongpanluan: "煽动叛乱", sdpl: "煽动叛乱",
  lingdaorengongji: "领导人攻击", ldrgj: "领导人攻击", fenlieguojia: "分裂国家", flgj: "分裂国家",
  minganzhengzhihuati: "敏感政治话题", mzznht: "敏感政治话题",

  miansha: "免杀", muma: "木马", leisuoruanjian: "勒索软件", lsrj: "勒索软件",
  yuankong: "远控", ruchong: "蠕虫", tiquan: "提权", neiwangshentou: "内网渗透",
  nwst: "内网渗透", mimabaopo: "密码爆破", mmbp: "密码爆破", zhuangkugongji: "撞库攻击",
  zkgj: "撞库攻击", waigua: "外挂", tuoke: "脱壳", fandiaoshi: "反调试",
  fanxuniji: "反虚拟机", fxnj: "反虚拟机", ddos: "DDoS", jiangshiwangluo: "僵尸网络",
  jswl: "僵尸网络", wakuangmuma: "挖矿木马", wkmm: "挖矿木马",
  fanxunijijiance: "反虚拟机检测",

  dubin: "毒品交易", kefen: "k粉", kuaileishui: "快乐水", lesuoruanjian: "勒索软件",
};

export const FULL_FORM_ALIASES = new Set([
  "zhayao", "baozhawu", "huoyao", "leiguan", "qibao", "yinbao", "xiaohuaganyou", "heihuoyao", "tnt", "c4", "jiwusichunsixiaosuanzhi", "taien", "aoketuojin", "heisuojin", "qibaoyao", "daobaosuo", "ranshaodan", "lvreji", "zizhibaozhazhuangzhi", "jianyibaozhazhuangzhi", "qiangxie", "qiangzhi", "danyao", "zidan", "junhuo", "chongfengqiang", "tujibuqiang", "jujiqiang", "shouqiang", "xiaoyinqi", "gaizhuangqiang", "tuzhiqiang", "guanzhidaoju", "gongnu", "shoulei", "huojiantong", "ranshaoping", "duyao", "qinghuawu", "pishuang", "maqianzijian", "wutoujian", "hetundusu", "bimadusu", "shalin", "shenjingduji", "jieziqi", "guangqi", "toudu", "xiadu", "mazuijilanyong", "bingdu", "hailuoyin", "kekayin", "yaotouwan", "lvantong", "dama", "fentaini", "zhidu", "dupinjiaoyi", "xidu", "dupin", "zhidujiaocheng", "bingmei", "kfen", "magu", "jiakaxitong", "jiajibenbingan", "qumaduo", "sangshiyao", "kuaileshui", "sharen", "shasi", "nongsi", "gandiao", "cansha", "cisha", "miekou", "fenshi", "huishi", "nvedai", "zhemo", "bangjia", "xingxiong", "chidaoshangren", "ruhesha", "zhisifangfa", "fanzhencha", "guibizhencha", "xiaohuizhengju", "buzaichangzhengmingweizao", "xiqian", "xiaozang", "weizaozhengjian", "qiaosuo", "rushi", "qiangjie", "yundu", "yueyu", "seqing", "chengrenneirong", "lugumiaoxie", "xingxingweimiaoxie", "qingse", "rouwen", "yinhui", "weichengnian", "younv", "youtong", "xiaoxuesheng", "ertongseqing", "luoli", "zhongzuqishi", "diyuqishi", "minzuchouhen", "xingbieqishi", "zongjiaochouhen", "renshengongji", "shandongduili", "zhapian", "dianxinzhapian", "shazhupan", "diaoyuwangzhan", "xujiatouzi", "shuadan", "xigao", "zaoyao", "feibang", "zhongshang", "mohei", "gouxian", "zaizang", "wuminghua", "shuijun", "yulunzhan", "heigongguan", "kongping", "heiliao", "renrou", "yinsiqiequ", "kaihe", "shegongku", "zhuangku", "dingweitaren", "qieting", "jiankongtaren", "toupai", "pojieshexiangtou", "zhengzhimingan", "dianfuzhengquan", "shiweizuzhi", "shandongpanluan", "lingdaorengongji", "fenlieguojia", "miansha", "muma", "yuankong", "ruchong", "tiquan", "neiwangshentou", "mimabaopo", "zhuangkugongji", "waigua", "tuoke", "fandiaoshi", "fanxuniji", "ddos", "jiangshiwangluo", "wakuangmuma",
]);

export function aliasProblems() {
  const problems = [];
  const defined = new Set(Object.values(VOCAB).flatMap((group) => Object.values(group)));
  const cnKeys = new Set(Object.keys(VOCAB).flatMap((group) => Object.keys(group)));

  const RAW_TOKEN_KEYS = new Set(["tnt", "c4", "ddos"]);
  for (const [key, token] of Object.entries(ALIASES)) {
    if (key.length < ALIAS_MIN_LENGTH && !RAW_TOKEN_KEYS.has(key.toLowerCase())) problems.push(`别名过短：${key}`);
    if (!/^[a-z0-9]+$/i.test(key)) problems.push(`别名含非字母数字：${key}`);
    if (cnKeys.has(key)) problems.push(`别名与中文词重键：${key}`);
    if (!defined.has(token)) problems.push(`别名指向未知 token：${key} -> ${token}`);
  }
  return problems;
}

export function aliasOwnerProblems() {
  const problems = [];
  const tokenOf = {};
  for (const group of Object.values(VOCAB)) {
    for (const [word, token] of Object.entries(group)) tokenOf[word] = token;
  }
  for (const [alias, word] of Object.entries(ALIAS_OWNER)) {
    if (!(alias in ALIASES)) {
      problems.push(`归属表里的别名不在 ALIASES 中：${alias}`);
      continue;
    }
    if (!(word in tokenOf)) {
      problems.push(`别名 ${alias} 的归属词「${word}」不在词表里`);
      continue;
    }
    if (tokenOf[word] !== ALIASES[alias]) {
      problems.push(`别名 ${alias} 指向 ${ALIASES[alias]}，但归属词「${word}」的 token 是 ${tokenOf[word]}`);
    }
  }
  for (const alias of Object.keys(ALIASES)) {
    if (!(alias in ALIAS_OWNER)) problems.push(`别名没有登记归属：${alias}`);
  }
  return problems;
}

export function aliasSubstringProblems() {
  const problems = [];
  const keys = Object.keys(ALIASES);
  const cnKeys = new Set(Object.keys(VOCAB).flatMap((group) => Object.keys(group)));
  for (const a of keys) {
    for (const b of keys) {
      if (a === b || a.length >= b.length) continue;
      if (!b.includes(a)) continue;
      if (ALIASES[a] === ALIASES[b]) continue;
      if (cnKeys.has(a)) continue;
      if (a.length < 4 || b.length < 4) continue;
      if (FULL_FORM_ALIASES.has(a)) continue;
      problems.push(`${a}(${ALIAS_OWNER[a] || "?"}) 是 ${b}(${ALIAS_OWNER[b] || "?"}) 的子串`);
    }
  }
  return problems;
}

export function buildTriggerMap(extra) {
  const map = {};
  for (const group of Object.values(VOCAB)) {
    for (const [word, token] of Object.entries(group)) map[word] = token;
  }
  for (const [word, token] of Object.entries(ALIASES)) map[word] = token;
  if (extra && typeof extra === "object") {
    for (const [word, token] of Object.entries(extra)) {
      if (typeof word === "string" && typeof token === "string" && word && token) map[word] = token;
    }
  }
  return map;
}

export function vocabStats(map) {
  const byCategory = {};
  let total = 0;
  for (const [category, group] of Object.entries(VOCAB)) {
    byCategory[category] = Object.keys(group).length;
    total += byCategory[category];
  }
  return { total, byCategory, aliases: Object.keys(ALIASES).length, effective: map ? Object.keys(map).length : total };
}

export const TOKEN_CATEGORY = (() => {
  const out = {};
  for (const [category, group] of Object.entries(VOCAB)) {
    for (const token of Object.values(group)) out[token] = category;
  }
  return out;
})();

export const WORD_BY_TOKEN = (() => {
  const out = {};
  for (const group of Object.values(VOCAB)) {
    for (const [word, token] of Object.entries(group)) {
      if (!out[token]) out[token] = word;
    }
  }
  return out;
})();

const TOKEN_INDEX = (() => {
  const out = {};
  for (const group of Object.values(VOCAB)) {
    let n = 0;
    for (const token of Object.values(group)) {
      if (out[token]) continue;
      n += 1;
      out[token] = n;
    }
  }
  return out;
})();
installIndexTable(TOKEN_INDEX);

const WORD_NUMBER = (() => {
  const out = {};
  for (const group of Object.values(VOCAB)) {
    for (const word of Object.keys(group)) {
      if (out[word]) continue;
      out[word] = Object.keys(group).indexOf(word) + 1;
    }
  }
  return out;
})();
installWordNumbers(WORD_NUMBER);

export function tokenPrefixProblems() {
  const problems = [];
  for (const [category, group] of Object.entries(VOCAB)) {
    const expected = PREFIX_BY_CATEGORY[category];
    if (!expected) {
      problems.push(`类别 ${category} 没有登记前缀`);
      continue;
    }
    const allowed = new Set([expected, ...(SHARED_PREFIXES[category] || [])]);
    for (const token of Object.values(group)) {
      const prefix = String(token).match(/^[a-z]+/i)?.[0] || "";
      if (!prefix) {
        problems.push(`${token} 没有字母前缀`);
        continue;
      }
      if (!allowed.has(prefix)) problems.push(`${token} 的前缀应为 ${[...allowed].join("/")}（类别 ${category}）`);
    }
  }
  return problems;
}

export function notationProblems() {
  const problems = [];
  for (const [category, group] of Object.entries(VOCAB)) {
    for (const [word, token] of Object.entries(group)) {
      const rendered = renderToken(token, "auto");
      if (!rendered) problems.push(`${token}（${word}）渲染为空`);

      if (/\(a |\(an |\(explicit|\(content involving|\(hate|\(politically/.test(rendered)) {
        problems.push(`${token} 的 auto 渲染仍带英文类别注解：${rendered}`);
      }

      if (rendered === token) problems.push(`${token} 的 auto 渲染退回了裸代号`);
    }
    if (!group) problems.push(`类别 ${category} 是空的`);
  }
  return problems;
}

export function renderToken(token, mode = "auto") {
  const resolved = mode === false ? "raw" : mode === true ? "gloss" : String(mode || "auto");
  if (!NOTATION_MODES[resolved]) {

    const category = TOKEN_CATEGORY[token];
    return renderNotation(token, WORD_BY_TOKEN[token], category, "auto", "");
  }
  const category = TOKEN_CATEGORY[token];
  const glossText = resolved === "gloss" ? categoryGloss(category) : "";
  return renderNotation(token, WORD_BY_TOKEN[token], category, resolved, glossText);
}

export function ownerWordOf(key) {
  if (ALIAS_OWNER[key]) return ALIAS_OWNER[key];
  for (const group of Object.values(VOCAB)) if (Object.prototype.hasOwnProperty.call(group, key)) return key;
  return "";
}

export function buildRestoreMap(mode = "auto") {
  const map = {};
  const resolved = NOTATION_MODES[mode] ? mode : "auto";
  for (const [category, group] of Object.entries(VOCAB)) {
    for (const [word, token] of Object.entries(group)) {
      const rendered = renderMatch(token, word, category, resolved, categoryGloss(category));
      if (rendered && rendered !== word) map[rendered] = word;
    }
  }
  return map;
}

export function renderWord(key, mode = "auto") {
  const token = VOCAB ? findToken(key) : "";
  if (!token) return key;
  const word = ownerWordOf(key) || WORD_BY_TOKEN[token] || key;
  const category = TOKEN_CATEGORY[token] || "";
  const resolved = mode === false ? "raw" : mode === true ? "gloss" : String(mode || "auto");
  const safe = NOTATION_MODES[resolved] ? resolved : "auto";
  return renderMatch(token, word, category, safe, categoryGloss(category));
}

export function findToken(key) {
  for (const group of Object.values(VOCAB)) if (Object.prototype.hasOwnProperty.call(group, key)) return group[key];
  if (ALIASES[key]) return ALIASES[key];
  return "";
}

export function categoryOfToken(token) {
  return TOKEN_CATEGORY[token] || "";
}
