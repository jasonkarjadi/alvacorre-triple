const listable: [string, string, string][] = [
  ["萬", "万", "万"],
  ["畫", "画", "画"],
  ["晝", "昼", "昼"],
  ["蠶", "蚕", "蚕"],
  ["舊", "旧", "旧"],
  ["爭", "争", "争"],
  ["來", "来", "来"],
  ["寫", "写", "写"],
  ["區", "区", "区"],
  ["醫", "医", "医"],
  ["點", "点", "点"],
  ["參", "参", "参"],
  ["號", "号", "号"],
  ["國", "国", "国"],
  ["聲", "声", "声"],
  ["條", "条", "条"],
  ["學", "学", "学"],
  ["寶", "宝", "宝"],
  ["當", "当", "当"],
  ["黨", "党", "党"],
  ["屆", "届", "届"],
  ["屬", "属", "属"],
  ["擔", "担", "担"],
  ["數", "数", "数"],
  ["斷", "断", "断"],
  ["橫", "横", "横"],
  ["殘", "残", "残"],
  ["淺", "浅", "浅"],
  ["溫", "温", "温"],
  ["燈", "灯", "灯"],
  ["狀", "状", "状"],
  ["將", "将", "将"],
  ["獨", "独", "独"],
  ["硏", "研", "研"],
  ["禮", "礼", "礼"],
  ["祕", "秘", "秘"],
  ["亂", "乱", "乱"],
  ["辭", "辞", "辞"],
  ["蟲", "虫", "虫"],
  ["靜", "静", "静"],
  ["麥", "麦", "麦"],
  ["黃", "黄", "黄"],
  ["會", "会", "会"],
  ["體", "体", "体"],
  ["裝", "装", "装"],
  ["冰", "冰", "氷"],
  ["巢", "巢", "巣"],
  ["乘", "乘", "乗"],
  ["佛", "佛", "仏"],
  ["假", "假", "仮"],
  ["舍", "舍", "舎"],
  ["效", "效", "効"],
  ["增", "增", "増"],
  ["卷", "卷", "巻"],
  ["德", "德", "徳"],
  ["拜", "拜", "拝"],
  ["藏", "藏", "蔵"],
  ["黑", "黑", "黒"],
  ["窗", "窗", "窓"],
  ["缺", "缺", "欠"],
  ["步", "步", "歩"],
  ["每", "每", "毎"],
  ["辨", "辨", "弁"],
  ["瓣", "瓣", "弁"],
  ["稻", "稻", "稲"],
  ["業", "业", "業"],
  ["東", "东", "東"],
  ["島", "岛", "島"],
  ["劇", "剧", "劇"],
  ["願", "愿", "願"],
  ["裏", "里", "裏"],
  ["係", "系", "係"],
  ["個", "个", "個"],
  ["倉", "仓", "倉"],
  ["側", "侧", "側"],
  ["備", "备", "備"],
  ["傷", "伤", "傷"],
  ["億", "亿", "億"],
  ["優", "优", "優"],
  ["貧", "贫", "貧"],
  ["興", "兴", "興"],
  ["軍", "军", "軍"],
  ["創", "创", "創"],
  ["動", "动", "動"],
  ["勢", "势", "勢"],
  ["協", "协", "協"],
  ["準", "准", "準"],
  ["幹", "干", "幹"],
  ["員", "员", "員"],
  ["鳴", "鸣", "鳴"],
  ["園", "园", "園"],
  ["場", "场", "場"],
  ["報", "报", "報"],
  ["執", "执", "執"],
  ["奮", "奋", "奮"],
  ["婦", "妇", "婦"],
  ["孫", "孙", "孫"],
  ["憲", "宪", "憲"],
  ["導", "导", "導"],
  ["層", "层", "層"],
  ["災", "灾", "災"],
  ["順", "顺", "順"],
  ["帳", "帐", "帳"],
  ["庫", "库", "庫"],
  ["張", "张", "張"],
  ["後", "后", "後"],
  ["術", "术", "術"],
  ["復", "复", "復"],
  ["衛", "卫", "衛"],
  ["態", "态", "態"],
  ["慣", "惯", "慣"],
  ["採", "采", "採"],
  ["捨", "舍", "捨"],
  ["揮", "挥", "揮"],
  ["損", "损", "損"],
  ["漢", "汉", "漢"],
  ["敵", "敌", "敵"],
  ["時", "时", "時"],
  ["題", "题", "題"],
  ["極", "极", "極"],
  ["構", "构", "構"],
  ["標", "标", "標"],
  ["機", "机", "機"],
  ["樹", "树", "樹"],
  ["橋", "桥", "橋"],
  ["決", "决", "決"],
  ["減", "减", "減"],
  ["測", "测", "測"],
  ["湯", "汤", "湯"],
  ["漁", "渔", "漁"],
  ["潔", "洁", "潔"],
  ["無", "无", "無"],
  ["熱", "热", "熱"],
  ["愛", "爱", "愛"],
  ["現", "现", "現"],
  ["節", "节", "節"],
  ["聖", "圣", "聖"],
  ["穀", "谷", "穀"],
  ["異", "异", "異"],
  ["務", "务", "務"],
  ["確", "确", "確"],
  ["種", "种", "種"],
  ["積", "积", "積"],
  ["殺", "杀", "殺"],
  ["競", "竞", "競"],
  ["筆", "笔", "筆"],
  ["築", "筑", "築"],
  ["簡", "简", "簡"],
  ["約", "约", "約"],
  ["級", "级", "級"],
  ["紅", "红", "紅"],
  ["紀", "纪", "紀"],
  ["紙", "纸", "紙"],
  ["納", "纳", "納"],
  ["純", "纯", "純"],
  ["組", "组", "組"],
  ["終", "终", "終"],
  ["細", "细", "細"],
  ["結", "结", "結"],
  ["給", "给", "給"],
  ["統", "统", "統"],
  ["絹", "绢", "絹"],
  ["綿", "绵", "綿"],
  ["線", "线", "線"],
  ["網", "网", "網"],
  ["緯", "纬", "緯"],
  ["編", "编", "編"],
  ["縮", "缩", "縮"],
  ["績", "绩", "績"],
  ["織", "织", "織"],
  ["買", "买", "買"],
  ["義", "义", "義"],
  ["養", "养", "養"],
  ["習", "习", "習"],
  ["職", "职", "職"],
  ["書", "书", "書"],
  ["脈", "脉", "脈"],
  ["勝", "胜", "勝"],
  ["腸", "肠", "腸"],
  ["臨", "临", "臨"],
  ["葉", "叶", "葉"],
  ["夢", "梦", "夢"],
  ["衆", "众", "衆"],
  ["補", "补", "補"],
  ["製", "制", "製"],
  ["複", "复", "複"],
  ["見", "见", "見"],
  ["規", "规", "規"],
  ["親", "亲", "親"],
  ["計", "计", "計"],
  ["記", "记", "記"],
  ["討", "讨", "討"],
  ["訓", "训", "訓"],
  ["設", "设", "設"],
  ["許", "许", "許"],
  ["訪", "访", "訪"],
  ["評", "评", "評"],
  ["詞", "词", "詞"],
  ["話", "话", "話"],
  ["試", "试", "試"],
  ["詩", "诗", "詩"],
  ["誠", "诚", "誠"],
  ["語", "语", "語"],
  ["認", "认", "認"],
  ["誤", "误", "誤"],
  ["誌", "志", "誌"],
  ["調", "调", "調"],
  ["論", "论", "論"],
  ["談", "谈", "談"],
  ["課", "课", "課"],
  ["誕", "诞", "誕"],
  ["講", "讲", "講"],
  ["謝", "谢", "謝"],
  ["識", "识", "識"],
  ["議", "议", "議"],
  ["護", "护", "護"],
  ["頭", "头", "頭"],
  ["貝", "贝", "貝"],
  ["負", "负", "負"],
  ["則", "则", "則"],
  ["財", "财", "財"],
  ["敗", "败", "敗"],
  ["責", "责", "責"],
  ["貨", "货", "貨"],
  ["費", "费", "費"],
  ["貸", "贷", "貸"],
  ["視", "视", "視"],
  ["貴", "贵", "貴"],
  ["貯", "贮", "貯"],
  ["賀", "贺", "賀"],
  ["貿", "贸", "貿"],
  ["資", "资", "資"],
  ["賃", "赁", "賃"],
  ["質", "质", "質"],
  ["車", "车", "車"],
  ["輪", "轮", "輪"],
  ["輸", "输", "輸"],
  ["農", "农", "農"],
  ["連", "连", "連"],
  ["進", "进", "進"],
  ["週", "周", "週"],
  ["過", "过", "過"],
  ["運", "运", "運"],
  ["達", "达", "達"],
  ["遊", "游", "遊"],
  ["遠", "远", "遠"],
  ["適", "适", "適"],
  ["選", "选", "選"],
  ["遺", "遗", "遺"],
  ["郵", "邮", "郵"],
  ["針", "针", "針"],
  ["銀", "银", "銀"],
  ["銅", "铜", "銅"],
  ["鋼", "钢", "鋼"],
  ["鏡", "镜", "鏡"],
  ["長", "长", "長"],
  ["門", "门", "門"],
  ["問", "问", "問"],
  ["閉", "闭", "閉"],
  ["間", "间", "間"],
  ["開", "开", "開"],
  ["聞", "闻", "聞"],
  ["閣", "阁", "閣"],
  ["陸", "陆", "陸"],
  ["隊", "队", "隊"],
  ["階", "阶", "階"],
  ["陽", "阳", "陽"],
  ["際", "际", "際"],
  ["難", "难", "難"],
  ["雲", "云", "雲"],
  ["電", "电", "電"],
  ["頂", "顶", "頂"],
  ["類", "类", "類"],
  ["預", "预", "預"],
  ["領", "领", "領"],
  ["額", "额", "額"],
  ["風", "风", "風"],
  ["飛", "飞", "飛"],
  ["飲", "饮", "飲"],
  ["飯", "饭", "飯"],
  ["飼", "饲", "飼"],
  ["館", "馆", "館"],
  ["馬", "马", "馬"],
  ["魚", "鱼", "魚"],
  ["鳥", "鸟", "鳥"],
  ["兩", "两", "両"],
  ["惡", "恶", "悪"],
  ["單", "单", "単"],
  ["嚴", "严", "厳"],
  ["傳", "传", "伝"],
  ["價", "价", "価"],
  ["兒", "儿", "児"],
  ["變", "变", "変"],
  ["圓", "圆", "円"],
  ["勞", "劳", "労"],
  ["壓", "压", "圧"],
  ["營", "营", "営"],
  ["團", "团", "団"],
  ["圖", "图", "図"],
  ["圍", "围", "囲"],
  ["賣", "卖", "売"],
  ["鹽", "盐", "塩"],
  ["處", "处", "処"],
  ["據", "据", "拠"],
  ["實", "实", "実"],
  ["專", "专", "専"],
  ["縣", "县", "県"],
  ["廣", "广", "広"],
  ["應", "应", "応"],
  ["歸", "归", "帰"],
  ["戰", "战", "戦"],
  ["擴", "扩", "拡"],
  ["擧", "举", "挙"],
  ["從", "从", "従"],
  ["戲", "戏", "戯"],
  ["對", "对", "対"],
  ["榮", "荣", "栄"],
  ["櫻", "樱", "桜"],
  ["檢", "检", "検"],
  ["樂", "乐", "楽"],
  ["樣", "样", "様"],
  ["權", "权", "権"],
  ["產", "产", "産"],
  ["氣", "气", "気"],
  ["濟", "济", "済"],
  ["齋", "斋", "斎"],
  ["滿", "满", "満"],
  ["帶", "带", "帯"],
  ["殼", "壳", "殻"],
  ["歷", "历", "歴"],
  ["莊", "庄", "荘"],
  ["歲", "岁", "歳"],
  ["肅", "肃", "粛"],
  ["龍", "龙", "竜"],
  ["龜", "龟", "亀"],
  ["靈", "灵", "霊"],
  ["麵", "面", "麺"],
  ["燒", "烧", "焼"],
  ["發", "发", "発"],
  ["顯", "显", "顕"],
  ["絲", "丝", "糸"],
  ["經", "经", "経"],
  ["繪", "绘", "絵"],
  ["續", "续", "続"],
  ["總", "总", "総"],
  ["綠", "绿", "緑"],
  ["緣", "缘", "縁"],
  ["繩", "绳", "縄"],
  ["絕", "绝", "絶"],
  ["繼", "继", "継"],
  ["縱", "纵", "縦"],
  ["纖", "纤", "繊"],
  ["腦", "脑", "脳"],
  ["臟", "脏", "臓"],
  ["藥", "药", "薬"],
  ["覺", "觉", "覚"],
  ["覽", "览", "覧"],
  ["頰", "颊", "頬"],
  ["觀", "观", "観"],
  ["譯", "译", "訳"],
  ["證", "证", "証"],
  ["讀", "读", "読"],
  ["說", "说", "説"],
  ["讓", "让", "譲"],
  ["豐", "丰", "豊"],
  ["贊", "赞", "賛"],
  ["轉", "转", "転"],
  ["輕", "轻", "軽"],
  ["邊", "边", "辺"],
  ["遞", "递", "逓"],
  ["遲", "迟", "遅"],
  ["鄕", "乡", "郷"],
  ["鐵", "铁", "鉄"],
  ["鑛", "矿", "鉱"],
  ["礦", "矿", "砿"],
  ["錢", "钱", "銭"],
  ["鑒", "鉴", "鑑"],
  ["銳", "锐", "鋭"],
  ["錄", "录", "録"],
  ["鑄", "铸", "鋳"],
  ["鍊", "炼", "錬"],
  ["關", "关", "関"],
  ["險", "险", "険"],
  ["隱", "隐", "隠"],
  ["雜", "杂", "雑"],
  ["顏", "颜", "顔"],
  ["驛", "驿", "駅"],
  ["驅", "驱", "駆"],
  ["驗", "验", "験"],
  ["齒", "齿", "歯"],
  ["聽", "厅", "庁"],
  ["辯", "辩", "弁"],
  ["澀", "涩", "渋"],
];
export default listable;
