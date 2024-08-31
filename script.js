const characters = [

{ rank:'1', char: '的', pinyin: 'dè', example: '他的书 （tā dè shū）', 			english: "Definition: of, genetive marker.  Example: His book" },
{ rank:'1', char: '的', pinyin: 'dí', example: '的确 （dí què）', 				english: "Indeed" },
{ rank:'1', char: '的', pinyin: 'dì', example: '目的 （mù dì）', 					english: "Objective, Goal" },
{ rank:'2', char: '一', pinyin: 'yī', example: '我有一只猫 （wǒ yǒu yī zhī māo）', english: "one, a.  Example: I have a cat"  },

// 3. 是
{ rank:'3', char: '是', pinyin: 'shì', example: '这是我的书 （zhè shì wǒ de shū）', english: "Definition: is.  Example: This is my book" },

// 4. 不
{ rank:'4', char: '不', pinyin: 'bù', example: '不喜欢 （bù xǐ huān）' },
{ rank:'4', char: '不', pinyin: 'bú', example: '不要 （bú yào）' },

// 5. 了
{ rank:'5', char: '了', pinyin: 'le', example: '我吃饭了 （wǒ chīfàn le）' },
{ rank:'5', char: '了', pinyin: 'liǎo', example: '事已经了解了 （shì yǐjīng liǎo jiě le）' },

// 6. 在
{ rank:'6', char: '在', pinyin: 'zài', example: '我在家里 （wǒ zài jiālǐ）' },

// 7. 人
{ rank:'7', char: '人', pinyin: 'rén', example: '她是一个好人 （tā shì yī gè hǎo rén）' },

// 8. 有
{ rank:'8', char: '有', pinyin: 'yǒu', example: '我有一个朋友 （wǒ yǒu yī gè péngyǒu）' },

// 9. 我
{ rank:'9', char: '我', pinyin: 'wǒ', example: '我是学生 （wǒ shì xuéshēng）' },

// 10. 他
{ rank:'10', char: '他', pinyin: 'tā', example: '他是我的老师 （tā shì wǒ de lǎoshī）' },

// 11. 这
{ rank:'11', char: '这', pinyin: 'zhè', example: '这是我的书 （zhè shì wǒ de shū）' },
{ rank:'11', char: '这', pinyin: 'zhèi', example: '"' },

// 12. 个
{ rank:'12', char: '个', pinyin: 'gè', example: '我买了一个苹果 （wǒ mǎi le yī gè píngguǒ）' },

// 13. 们
{ rank:'13', char: '们', pinyin: 'men', example: '我们一起去 （wǒmen yīqǐ qù）' },

// 14. 中
{ rank:'14', char: '中', pinyin: 'zhōng', example: '他在中学 （tā zài zhōngxué）' },
{ rank:'14', char: '中', pinyin: 'zhòng', example: '他打中目标了 （tā dǎ zhòng mùbiāo le）' },

// 15. 来
{ rank:'15', char: '来', pinyin: 'lái', example: '请来这里 （qǐng lái zhè lǐ）' },

// 16. 上
{ rank:'16', char: '上', pinyin: 'shàng', example: '我上了楼 （wǒ shàng le lóu）' },

// 17. 大
{ rank:'17', char: '大', pinyin: 'dà', example: '这是一辆大车 （zhè shì yī liàng dà chē）' },

// 18. 为
{ rank:'18', char: '为', pinyin: 'wéi', example: '为所欲为（wéi suǒ yù wéi）' },
{ rank:'18', char: '为', pinyin: 'wèi', example: '这是为了你 （zhè shì wèi nǐ）' },

// 19. 和
{ rank:'19', char: '和', pinyin: 'hé', example: '我和你一起去 （wǒ hé nǐ yī qǐ qù）' },
{ rank:'19', char: '和', pinyin: 'hè', example: '附和 （fù hè）' },
{ rank:'19', char: '和', pinyin: 'huò', example: '搅和 （jiǎo huo）' },

// 20. 国
{ rank:'20', char: '国', pinyin: 'guó', example: '国家 （Guó jiā）' },

// 21. 地
{ rank:'21', char: '地', pinyin: 'dì', example: '土地 （tǔ dì）' },

// 22. 到
{ rank:'22', char: '到', pinyin: 'dào', example: '到家了 （dào jiā le）' },

// 23. 以
{ rank:'23', char: '以', pinyin: 'yǐ', example: '我以他为例 （wǒ yǐ tā wéi lì）' },

// 24. 说
{ rank:'24', char: '说', pinyin: 'shuō', example: '说话 （shuō huà）' },

// 25. 时
{ rank:'25', char: '时', pinyin: 'shí', example: '时间 （shí jiān）' },

// 26. 要
{ rank:'26', char: '要', pinyin: 'yāo', example: '要求 （yāo qiú）' },
{ rank:'26', char: '要', pinyin: 'yào', example: '需要 （xū yào）' },

// 27. 就
{ rank:'27', char: '就', pinyin: 'jiù', example: '我们就这样做 （wǒ men jiù zhè yàng zuò）' },

// 28. 出
{ rank:'28', char: '出', pinyin: 'chū', example: '出发 （Chū fā）' },

// 29. 会
{ rank:'29', char: '会', pinyin: 'huì', example: '会见 （huì jiàn）' },
{ rank:'29', char: '会', pinyin: 'kuài', example: '会计 （kuài jì）' },

// 30. 可
{ rank:'30', char: '可', pinyin: 'kě', example: '可以 （kě yǐ）' },

// 31. 也
{ rank:'31', char: '也', pinyin: 'yě', example: '我也喜欢这个 （wǒ yě xǐhuān zhè ge）' },

// 32. 你
{ rank:'32', char: '你', pinyin: 'nǐ', example: '你好吗？ （nǐ hǎo ma?）' },

// 33. 对
{ rank:'33', char: '对', pinyin: 'duì', example: '这对我很重要 （zhè duì wǒ hěn zhòng yào）' },

{ rank:'34', char: '生', pinyin: '', example: '生活 （Shēng huó）' },

{ rank:'35', char: '能', pinyin: 'néng', example: '能量 (Néng liàng)' },
{ rank:'36', char: '而', pinyin: 'ér', example: '他而来 (tā ér lái)' },
{ rank:'37', char: '子', pinyin: 'zǐ', example: '儿子 (ér zi)' },
{ rank:'38', char: '那', pinyin: 'nèi/nà', example: '那个 (nèi/nà gè)' },
{ rank:'39', char: '得', pinyin: 'dé', example: '得到 (dé dào)' },
{ rank:'39', char: '得', pinyin: 'děi', example: '我得去 (wǒ děi qù)' },
{ rank:'40', char: '于', pinyin: 'yú', example: '由于 (yóu yú)' },
	
{ rank:'41', char: '着', pinyin: 'zhāo', example: '着急 (zhāo jí)' },
{ rank:'41', char: '着', pinyin: 'zháo', example: '睡着 (shuì zháo)' },
{ rank:'41', char: '着', pinyin: 'zhe', example: '我看着你 (wǒ kàn zhe nǐ)' },
{ rank:'41', char: '着', pinyin: 'zhuó', example: '着陆 (zhuó lù)' },
{ rank:'42', char: '下', pinyin: 'xià', example: '下楼 (xià lóu)' },
{ rank:'43', char: '自', pinyin: 'zì', example: '自己 (zì jǐ)' },
{ rank:'44', char: '之', pinyin: 'zhī', example: '之前 (zhī qián)' },
{ rank:'45', char: '年', pinyin: 'nián', example: '一年 (yī nián)' },
{ rank:'46', char: '过', pinyin: 'guò', example: '过生日 (guò shēng rì)' },
{ rank:'47', char: '发', pinyin: 'fā', example: '发消息 (fā xiāo xī)' },
{ rank:'47', char: '发', pinyin: 'fà', example: '头发 (tóu fà)' },
{ rank:'48', char: '后', pinyin: 'hòu', example: '后天 (hòu tiān)' },
{ rank:'49', char: '作', pinyin: 'zuò', example: '工作 (gōng zuò)' },
{ rank:'50', char: '里', pinyin: 'lǐ', example: '家里 (jiā lǐ)' },
{ rank:'51', char: '用', pinyin: 'yòng', example: '使用 (shǐ yòng)' },
{ rank:'52', char: '道', pinyin: 'dào', example: '知道 (zhī dào)' },
{ rank:'53', char: '行', pinyin: 'háng', example: '银行 (yín háng)' },
{ rank:'53', char: '行', pinyin: 'xíng', example: '行走 (xíng zǒu)' },
{ rank:'54', char: '所', pinyin: 'suǒ', example: '厕所 (cè suǒ)' },
{ rank:'55', char: '然', pinyin: 'rán', example: '当然 (dāng rán)' },
{ rank:'56', char: '家', pinyin: 'jiā', example: '我的家 (wǒ de jiā)' },
{ rank:'57', char: '种', pinyin: 'zhǒng', example: '种类 (zhǒng lèi)' },
{ rank:'57', char: '种', pinyin: 'zhòng', example: '种地 (zhòng dì)' },
{ rank:'58', char: '事', pinyin: 'shì', example: '事情 (shì qíng)' },
{ rank:'59', char: '成', pinyin: 'chéng', example: '成功 (chéng gōng)' },
{ rank:'60', char: '方', pinyin: 'fāng', example: '方法 (fāng fǎ)' },
{ rank:'61', char: '多', pinyin: 'duō', example: '很多 (hěn duō)' },
{ rank:'62', char: '经', pinyin: 'jīng', example: '已经 (yǐ jīng)' },	
{ rank:'63', char: '么', pinyin: 'ma', example: '干么 (gàn ma)' },
{ rank:'63', char: '么', pinyin: 'me', example: '什么 (shén me)' },
	
{ rank:'64', char: '去', pinyin: 'qù', example: '去学校 (qù xué xiào)' },
{ rank:'65', char: '法', pinyin: 'fǎ', example: '法律 (fǎ lǜ)' },
{ rank:'66', char: '学', pinyin: 'xué', example: '学生 (xué shēng)' },
{ rank:'67', char: '如', pinyin: 'rú', example: '如果 (rú guǒ)' },
{ rank:'68', char: '都', pinyin: 'dōu', example: '他们都去 (tā men dōu qù)' },
{ rank:'68', char: '都', pinyin: 'dū', example: '首都 (shǒu dū)' },
{ rank:'69', char: '同', pinyin: 'tóng', example: '同学 (tóng xué)' },
{ rank:'70', char: '现', pinyin: 'xiàn', example: '现在 (xiàn zài)' },
{ rank:'71', char: '当', pinyin: 'dāng', example: '当老师 (dāng lǎo shī)' },
{ rank:'71', char: '当', pinyin: 'dàng', example: '当场 (dàng chǎng)' },
{ rank:'72', char: '没', pinyin: 'méi', example: '没有 (méi yǒu)' },
{ rank:'72', char: '没', pinyin: 'mò', example: '淹没 (yān mò)' },
{ rank:'73', char: '动', pinyin: 'dòng', example: '活动 (huó dòng)' },
{ rank:'74', char: '面', pinyin: 'miàn', example: '面包 (miàn bāo)' },
{ rank:'75', char: '起', pinyin: 'qǐ', example: '起来 (qǐ lái)' },
{ rank:'76', char: '看', pinyin: 'kān', example: '看守 (kān shǒu)' },
{ rank:'76', char: 'kàn', example: '看书 (kàn shū)' },
{ rank:'77', char: '定', pinyin: 'dìng', example: '确定 (què dìng)' },
{ rank:'78', char: '天', pinyin: 'tiān', example: '天气 (tiān qì)' },
{ rank:'79', char: '分', pinyin: 'fēn', example: '分开 (fēn kāi)' },
{ rank:'79', char: 'fèn', example: '部分 (bù fèn)' },
{ rank:'80', char: '还', pinyin: 'hái', example: '还有 (hái yǒu)' },
{ rank:'80', char: 'huán', example: '还钱 (huán qián)' },
{ rank:'81', char: '进', pinyin: 'jìn', example: '进来 (jìn lái)' },
{ rank:'82', char: '好', pinyin: 'hǎo', example: '你好 (nǐ hǎo)' },
{ rank:'82', char: 'hào', example: '好学 (hào xué)' },
{ rank:'83', char: '小', pinyin: 'xiǎo', example: '小孩 (xiǎo hái)' },
{ rank:'84', char: '部', pinyin: 'bù', example: '部分 (bù fèn)' },
{ rank:'85', char: '其', pinyin: 'qí', example: '其实 (qí shí)' },
{ rank:'86', char: '些', pinyin: 'xiē', example: '这些 (zhè xiē)' },
{ rank:'87', char: '主', pinyin: 'zhǔ', example: '主意 (zhǔ yi)' },
{ rank:'88', char: '样', pinyin: 'yàng', example: '样子 (yàng zi)' },
{ rank:'89', char: '理', pinyin: 'lǐ', example: '道理 (dào lǐ)' },
{ rank:'90', char: '心', pinyin: 'xīn', example: '心情 (xīn qíng)' },
{ rank:'91', char: '她', pinyin: 'tā', example: '她的 (tā de)' },
{ rank:'92', char: '本', pinyin: 'běn', example: '本书 (běn shū)' },
{ rank:'93', char: '前', pinyin: 'qián', example: '前面 (qián miàn)' },
{ rank:'94', char: '开', pinyin: 'kāi', example: '开门 (kāi mén)' },
{ rank:'95', char: '但', pinyin: 'dàn', example: '但是 (dàn shì)' },
{ rank:'96', char: '因', pinyin: 'yīn', example: '因为 (yīn wèi)' },
{ rank:'97', char: '只', pinyin: 'zhī', example: '只要 (zhī yào)' },
{ rank:'97', char: 'zhǐ', example: '只好 (zhǐ hǎo)' },
{ rank:'98', char: '从', pinyin: 'cóng', example: '从来 (cóng lái)' },
{ rank:'99', char: '想', pinyin: 'xiǎng', example: '我想你 (wǒ xiǎng nǐ)' },
{ rank:'100', char: '实', pinyin: 'shí', example: '真实 (zhēn shí)' },



{ rank: '101', char: '日', pinyin: 'rì', example: '今天是星期日 (jīn tiān shì xīng qī rì)' },
{ rank: '102', char: '军', pinyin: 'jūn', example: '军队 (jūn duì)' },
{ rank: '103', char: '者', pinyin: 'zhě', example: '作者 (zuò zhě)' },
{ rank: '104', char: '意', pinyin: 'yì', example: '意思 (yì sī)' },
{ rank: '105', char: '无', pinyin: 'wú', example: '没有 (méi yǒu)' },
{ rank: '106', char: '力', pinyin: 'lì', example: '力量 (lì liàng)' },
{ rank: '107', char: '它', pinyin: 'tā', example: '它是我的猫 (tā shì wǒ de māo)' },
{ rank: '108', char: '与', pinyin: 'yǔ', example: '与我同行 (yǔ wǒ tóng xíng)' },
{ rank: '108', char: '与', pinyin: 'yù', example: '给予帮助 (jǐ yǔ bāng zhù)' },
{ rank: '108', char: '与', pinyin: 'yù', example: '与会 (yù huì)' },
{ rank: '109', char: '长', pinyin: 'cháng', example: '长时间 (cháng shí jiān)' },
{ rank: '109', char: '长', pinyin: 'zhǎng', example: '校长 (xiào zhǎng)' },
{ rank: '110', char: '把', pinyin: 'bǎ', example: '把书放下 (bǎ shū fàng xià)' },
{ rank: '110', char: '把', pinyin: 'bà', example: '把握机会 (bà wò jī huì)' },
{ rank: '111', char: '机', pinyin: 'jī', example: '计算机 (jì suàn jī)' },
{ rank: '112', char: '十', pinyin: 'shí', example: '十个苹果 (shí gè píng guǒ)' },
{ rank: '113', char: '民', pinyin: 'mín', example: '人民 (rén mín)' },
{ rank: '114', char: '第', pinyin: 'dì', example: '第一名 (dì yī míng)' },
{ rank: '115', char: '公', pinyin: 'gōng', example: '公共交通 (gōng gòng jiāo tōng)' },
{ rank: '116', char: '此', pinyin: 'cǐ', example: '此时此刻 (cǐ shí cǐ kè)' },
{ rank: '117', char: '已', pinyin: 'yǐ', example: '已经完成 (yǐ jīng wán chéng)' },
{ rank: '118', char: '工', pinyin: 'gōng', example: '工人 (gōng rén)' },
{ rank: '119', char: '使', pinyin: 'shǐ', example: '使用电脑 (shǐ yòng diàn nǎo)' },
{ rank: '120', char: '情', pinyin: 'qíng', example: '感情 (gǎn qíng)' },
{ rank: '121', char: '明', pinyin: 'míng', example: '明亮 (míng liàng)' },
{ rank: '122', char: '性', pinyin: 'xìng', example: '性格 (xìng gé)' },
{ rank: '123', char: '知', pinyin: 'zhī', example: '知道 (zhī dào)' },
{ rank: '124', char: '全', pinyin: 'quán', example: '全家 (quán jiā)' },
{ rank: '125', char: '三', pinyin: 'sān', example: '三个人 (sān gè rén)' },
{ rank: '126', char: '又', pinyin: 'yòu', example: '又一次 (yòu yī cì)' },
{ rank: '127', char: '关', pinyin: 'guān', example: '关门 (guān mén)' },
{ rank: '128', char: '点', pinyin: 'diǎn', example: '一点儿 (yī diǎn er)' },
{ rank: '129', char: '正', pinyin: 'zhèng', example: '正确 (zhèng què)' },
{ rank: '129', char: '正', pinyin: 'zhēng', example: '正月 (zhēng yuè)' },
{ rank: '130', char: '业', pinyin: 'yè', example: '职业 (zhí yè)' },
{ rank: '131', char: '外', pinyin: 'wài', example: '外国 (wài guó)' },
{ rank: '132', char: '将', pinyin: 'jiāng', example: '将来 (jiāng lái)' },
{ rank: '132', char: '将', pinyin: 'jiàng', example: '将军 (jiāng jūn)' },
{ rank: '133', char: '两', pinyin: 'liǎng', example: '两个人 (liǎng gè rén)' },
{ rank: '134', char: '高', pinyin: 'gāo', example: '高楼 (gāo lóu)' },
{ rank: '135', char: '间', pinyin: 'jiān', example: '房间 (fáng jiān)' },
{ rank: '135', char: '间', pinyin: 'jiàn', example: '时间间隔 (shí jiān jiàn gé)' },
{ rank: '136', char: '由', pinyin: 'yóu', example: '由我决定 (yóu wǒ jué dìng)' },
{ rank: '137', char: '问', pinyin: 'wèn', example: '请问 (qǐng wèn)' },
{ rank: '138', char: '很', pinyin: 'hěn', example: '很高兴 (hěn gāo xìng)' },
{ rank: '139', char: '最', pinyin: 'zuì', example: '最好 (zuì hǎo)' },
{ rank: '140', char: '重', pinyin: 'zhòng', example: '重量 (zhòng liàng)' },
{ rank: '140', char: '重', pinyin: 'chóng', example: '重复 (chóng fù)' },
{ rank: '141', char: '并', pinyin: 'bìng', example: '并且 (bìng qiě)' },
{ rank: '142', char: '物', pinyin: 'wù', example: '物品 (wù pǐn)' },
{ rank: '143', char: '手', pinyin: 'shǒu', example: '手表 (shǒu biǎo)' },
{ rank: '144', char: '应', pinyin: 'yīng', example: '应该 (yīng gāi)' },
{ rank: '144', char: '应', pinyin: 'yìng', example: '回答 (huí dá)' },
{ rank: '145', char: '战', pinyin: 'zhàn', example: '战争 (zhàn zhēng)' },
{ rank: '146', char: '向', pinyin: 'xiàng', example: '方向 (fāng xiàng)' },
{ rank: '147', char: '头', pinyin: 'tóu', example: '头发 (tóu fà)' },
{ rank: '148', char: '文', pinyin: 'wén', example: '文化 (wén huà)' },
{ rank: '149', char: '体', pinyin: 'tǐ', example: '身体 (shēn tǐ)' },
{ rank: '150', char: '政', pinyin: 'zhèng', example: '政府 (zhèng fǔ)' },
{ rank: '151', char: '美', pinyin: 'měi', example: '美丽 (měi lì)' },
{ rank: '152', char: '相', pinyin: 'xiāng', example: '相互 (xiāng hù)' },
{ rank: '152', char: '相', pinyin: 'xiàng', example: '相片 (xiàng piàn)' },
{ rank: '153', char: '见', pinyin: 'jiàn', example: '见面 (jiàn miàn)' },
{ rank: '153', char: '见', pinyin: 'xiàn', example: '出现 (chū xiàn)' },
{ rank: '154', char: '被', pinyin: 'bèi', example: '被动 (bèi dòng)' },
{ rank: '155', char: '利', pinyin: 'lì', example: '利益 (lì yì)' },
{ rank: '156', char: '什', pinyin: 'shén', example: '什么 (shén me)' },
{ rank: '156', char: '什', pinyin: 'shí', example: '十分 (shí fēn)' },
{ rank: '157', char: '二', pinyin: 'èr', example: '二十 (èr shí)' },
{ rank: '158', char: '等', pinyin: 'děng', example: '等级 (děng jí)' },
{ rank: '159', char: '产', pinyin: 'chǎn', example: '生产 (shēng chǎn)' },
{ rank: '160', char: '或', pinyin: 'huò', example: '或者 (huò zhě)' },
{ rank: '161', char: '新', pinyin: 'xīn', example: '新鲜 (xīn xiān)' },
{ rank: '162', char: '己', pinyin: 'jǐ', example: '自己 (zì jǐ)' },
{ rank: '163', char: '制', pinyin: 'zhì', example: '制造 (zhì zào)' },
{ rank: '164', char: '身', pinyin: 'shēn', example: '身体 (shēn tǐ)' },
{ rank: '165', char: '果', pinyin: 'guǒ', example: '水果 (shuǐ guǒ)' },
{ rank: '166', char: '加', pinyin: 'jiā', example: '增加 (zēng jiā)' },
{ rank: '167', char: '西', pinyin: 'xī', example: '西方 (xī fāng)' },
{ rank: '168', char: '斯', pinyin: 'sī', example: '这是 (zhè shì)' },
{ rank: '169', char: '月', pinyin: 'yuè', example: '月份 (yuè fèn)' },
{ rank: '170', char: '话', pinyin: 'huà', example: '说话 (shuō huà)' },
{ rank: '171', char: '合', pinyin: 'hé', example: '结合 (jié hé)' },
{ rank: '171', char: '合', pinyin: 'gē', example: '合一 (gē yī)' },
{ rank: '172', char: '回', pinyin: 'huí', example: '回来 (huí lái)' },
{ rank: '173', char: '特', pinyin: 'tè', example: '特别 (tè bié)' },
{ rank: '173', char: '特', pinyin: 'tè', example: '特种 (tè zhǒng)' },
{ rank: '174', char: '代', pinyin: 'dài', example: '代替 (dài tì)' },
{ rank: '175', char: '内', pinyin: 'nèi', example: '国内 (guó nèi)' },
{ rank: '176', char: '信', pinyin: 'xìn', example: '信任 (xìn rèn)' },
{ rank: '177', char: '表', pinyin: 'biǎo', example: '表格 (biǎo gé)' },
{ rank: '178', char: '化', pinyin: 'huà', example: '变化 (biàn huà)' },
{ rank: '179', char: '老', pinyin: 'lǎo', example: '老人 (lǎo rén)' },
{ rank: '180', char: '给', pinyin: 'gěi', example: '给我 (gěi wǒ)' },
{ rank: '180', char: '给', pinyin: 'jǐ', example: '给予 (jǐ yǔ)' },
{ rank: '181', char: '世', pinyin: 'shì', example: '世界 (shì jiè)' },
{ rank: '182', char: '位', pinyin: 'wèi', example: '位置 (wèi zhì)' },
{ rank: '183', char: '次', pinyin: 'cì', example: '一次 (yī cì)' },
{ rank: '184', char: '度', pinyin: 'dù', example: '温度 (wēn dù)' },
{ rank: '185', char: '门', pinyin: 'mén', example: '大门 (dà mén)' },
{ rank: '186', char: '任', pinyin: 'rèn', example: '任命 (rèn mìng)' },
{ rank: '187', char: '常', pinyin: 'cháng', example: '常见 (cháng jiàn)' },
{ rank: '188', char: '先', pinyin: 'xiān', example: '先走 (xiān zǒu)' },
{ rank: '189', char: '海', pinyin: 'hǎi', example: '海洋 (hǎi yáng)' },
{ rank: '190', char: '通', pinyin: 'tōng', example: '通行 (tōng xíng)' },
{ rank: '191', char: '教', pinyin: 'jiāo', example: '教书 (jiāo shū)' },
{ rank: '191', char: '教', pinyin: 'jiào', example: '宗教 (zōng jiào)' },
{ rank: '192', char: '儿', pinyin: 'ér', example: '儿子 (ér zi)' },
{ rank: '192', char: '儿', pinyin: 'r', example: '小儿 (xiǎo r)' },
{ rank: '193', char: '原', pinyin: 'yuán', example: '原因 (yuán yīn)' },
{ rank: '194', char: '东', pinyin: 'dōng', example: '东方 (dōng fāng)' },
{ rank: '195', char: '声', pinyin: 'shēng', example: '声音 (shēng yīn)' },
{ rank: '196', char: '提', pinyin: 'tí', example: '提问 (tí wèn)' },
{ rank: '196', char: '提', pinyin: 'tī', example: '提起 (tī qǐ)' },
{ rank: '197', char: '立', pinyin: 'lì', example: '立刻 (lì kè)' },
{ rank: '198', char: '及', pinyin: 'jí', example: '及时 (jí shí)' },
{ rank: '199', char: '比', pinyin: 'bǐ', example: '比较 (bǐ jiào)' },
{ rank: '199', char: '比', pinyin: 'bì', example: '比喻 (bǐ yù)' },
{ rank: '200', char: '员', pinyin: 'yuán', example: '成员 (chéng yuán)' },

{ rank: "201", char: "解", pinyin: "jiě/xiè", example: "解释 (jiě shì) / 解决 (jiě jué)" },
{ rank: "202", char: "水", pinyin: "shuǐ", example: "水瓶 (shuǐ píng)" },
{ rank: "203", char: "名", pinyin: "míng", example: "名字 (míng zì)" },
{ rank: "204", char: "真", pinyin: "zhēn", example: "真实 (zhēn shí)" },
{ rank: "205", char: "论", pinyin: "lùn", example: "讨论 (tǎo lùn)" },
{ rank: "206", char: "处", pinyin: "chù", example: "地址 (dì zhǐ)" },
{ rank: "207", char: "走", pinyin: "zǒu", example: "走路 (zǒu lù)" },
{ rank: "208", char: "义", pinyin: "yì", example: "意义 (yì yì)" },
{ rank: "209", char: "各", pinyin: "gè", example: "各自 (gè zì)" },
{ rank: "210", char: "入", pinyin: "rù", example: "进入 (jìn rù)" },
{ rank: "211", char: "几", pinyin: "jǐ/jī", example: "几个 (jǐ gè)" },
{ rank: "212", char: "口", pinyin: "kǒu", example: "人口 (rén kǒu)" },
{ rank: "213", char: "认", pinyin: "rèn", example: "认识 (rèn shi)" },
{ rank: "214", char: "条", pinyin: "tiáo", example: "一条 (yī tiáo)" },
{ rank: "215", char: "平", pinyin: "píng", example: "平静 (píng jìng)" },
{ rank: "216", char: "系", pinyin: "xì", example: "系统 (xì tǒng)" },
{ rank: "217", char: "气", pinyin: "qì", example: "空气 (kōng qì)" },
{ rank: "218", char: "题", pinyin: "tí", example: "问题 (wèn tí)" },
{ rank: "219", char: "活", pinyin: "huó", example: "生活 (shēng huó)" },
{ rank: "220", char: "尔", pinyin: "ěr", example: "尔后 (ěr hòu)" },
{ rank: "221", char: "更", pinyin: "gèng", example: "更好 (gèng hǎo)" },
{ rank: "222", char: "别", pinyin: "bié", example: "别的 (bié de)" },
{ rank: "223", char: "打", pinyin: "dǎ", example: "打球 (dǎ qiú)" },
{ rank: "224", char: "女", pinyin: "nǚ", example: "女生 (nǚ shēng)" },
{ rank: "225", char: "变", pinyin: "biàn", example: "变化 (biàn huà)" },
{ rank: "226", char: "四", pinyin: "sì", example: "四个 (sì gè)" },
{ rank: "227", char: "神", pinyin: "shén", example: "神话 (shén huà)" },
{ rank: "228", char: "总", pinyin: "zǒng", example: "总是 (zǒng shì)" },
{ rank: "229", char: "何", pinyin: "hé", example: "何时 (hé shí)" },
{ rank: "230", char: "电", pinyin: "diàn", example: "电池 (diàn chí)" },
{ rank: "231", char: "数", pinyin: "shǔ/shù", example: "数字 (shù zì)" },
{ rank: "232", char: "安", pinyin: "ān", example: "安全 (ān quán)" },
{ rank: "233", char: "少", pinyin: "shǎo", example: "少量 (shǎo liàng)" },
{ rank: "234", char: "报", pinyin: "bào", example: "报纸 (bào zhǐ)" },
{ rank: "235", char: "才", pinyin: "cái", example: "才华 (cái huá)" },
{ rank: "236", char: "结", pinyin: "jié", example: "结果 (jié guǒ)" },
{ rank: "237", char: "反", pinyin: "fǎn", example: "反对 (fǎn duì)" },
{ rank: "238", char: "受", pinyin: "shòu", example: "受害 (shòu hài)" },
{ rank: "239", char: "目", pinyin: "mù", example: "目标 (mù biāo)" },
{ rank: "240", char: "太", pinyin: "tài", example: "太多 (tài duō)" },
{ rank: "241", char: "量", pinyin: "liàng", example: "数量 (shù liàng)" },
{ rank: "242", char: "再", pinyin: "zài", example: "再见 (zài jiàn)" },
{ rank: "243", char: "感", pinyin: "gǎn", example: "感受 (gǎn shòu)" },
{ rank: "244", char: "建", pinyin: "jiàn", example: "建筑 (jiàn zhú)" },
{ rank: "245", char: "务", pinyin: "wù", example: "事务 (shì wù)" },
{ rank: "246", char: "做", pinyin: "zuò", example: "做事 (zuò shì)" },
{ rank: "247", char: "接", pinyin: "jiē", example: "接受 (jiē shòu)" },
{ rank: "248", char: "必", pinyin: "bì", example: "必须 (bì xū)" },
{ rank: "249", char: "场", pinyin: "chǎng", example: "比赛场 (bǐ sài chǎng)" },
{ rank: "250", char: "件", pinyin: "jiàn", example: "一件事 (yī jiàn shì)" },
{ rank: "251", char: "计", pinyin: "jì", example: "计划 (jì huà)" },
{ rank: "252", char: "管", pinyin: "guǎn", example: "管理 (guǎn lǐ)" },
{ rank: "253", char: "期", pinyin: "qī", example: "期限 (qī xiàn)" },
{ rank: "254", char: "市", pinyin: "shì", example: "城市 (chéng shì)" },
{ rank: "255", char: "直", pinyin: "zhí", example: "直接 (zhí jiē)" },
{ rank: "256", char: "德", pinyin: "dé", example: "道德 (dào dé)" },
{ rank: "257", char: "资", pinyin: "zī", example: "资源 (zī yuán)" },
{ rank: "258", char: "命", pinyin: "mìng", example: "生命 (shēng mìng)" },
{ rank: "259", char: "山", pinyin: "shān", example: "山脉 (shān mài)" },
{ rank: "260", char: "金", pinyin: "jīn", example: "黄金 (huáng jīn)" },
{ rank: "261", char: "指", pinyin: "zhǐ", example: "指出 (zhǐ chū)" },
{ rank: "262", char: "克", pinyin: "kè", example: "克服 (kè fú)" },
{ rank: "263", char: "许", pinyin: "xǔ", example: "允许 (xǔ rǔ)" },
{ rank: "264", char: "统", pinyin: "tǒng", example: "统一 (tǒng yī)" },
{ rank: "265", char: "区", pinyin: "qū", example: "区域 (qū yù)" },
{ rank: "266", char: "保", pinyin: "bǎo", example: "保护 (bǎo hù)" },
{ rank: "267", char: "至", pinyin: "zhì", example: "至今 (zhì jīn)" },
{ rank: "268", char: "队", pinyin: "duì", example: "队伍 (duì wǔ)" },
{ rank: "269", char: "形", pinyin: "xíng", example: "形状 (xíng zhuàng)" },
{ rank: "270", char: "社", pinyin: "shè", example: "社会 (shè huì)" },
{ rank: "271", char: "便", pinyin: "biàn/pián", example: "方便 (fāng biàn)" },
{ rank: "272", char: "空", pinyin: "kōng", example: "空旷 (kōng kuàng)" },
{ rank: "273", char: "决", pinyin: "jué", example: "决定 (jué dìng)" },
{ rank: "274", char: "治", pinyin: "zhì", example: "治理 (zhì lǐ)" },
{ rank: "275", char: "展", pinyin: "zhǎn", example: "展开 (zhǎn kāi)" },
{ rank: "276", char: "马", pinyin: "mǎ", example: "马车 (mǎ chē)" },
{ rank: "277", char: "科", pinyin: "kē", example: "科学 (kē xué)" },
{ rank: "278", char: "司", pinyin: "sī", example: "公司 (gōng sī)" },
{ rank: "279", char: "五", pinyin: "wǔ", example: "五个 (wǔ gè)" },
{ rank: "280", char: "基", pinyin: "jī", example: "基础 (jī chǔ)" },
{ rank: "281", char: "眼", pinyin: "yǎn", example: "眼睛 (yǎn jīng)" },
{ rank: "282", char: "书", pinyin: "shū", example: "书籍 (shū jí)" },
{ rank: "283", char: "非", pinyin: "fēi", example: "非常 (fēi cháng)" },
{ rank: "284", char: "则", pinyin: "zé", example: "则是 (zé shì)" },
{ rank: "285", char: "听", pinyin: "tīng", example: "听说 (tīng shuō)" },
{ rank: "286", char: "白", pinyin: "bái", example: "白色 (bái sè)" },
{ rank: "287", char: "却", pinyin: "què", example: "却是 (què shì)" },
{ rank: "288", char: "界", pinyin: "jiè", example: "界限 (jiè xiàn)" },
{ rank: "289", char: "达", pinyin: "dá", example: "达到 (dá dào)" },
{ rank: "290", char: "光", pinyin: "guāng", example: "光线 (guāng xiàn)" },
{ rank: "291", char: "放", pinyin: "fàng", example: "放松 (fàng sōng)" },
{ rank: "292", char: "强", pinyin: "qiáng", example: "强大 (qiáng dà)" },
{ rank: "293", char: "即", pinyin: "jí", example: "即刻 (jí kè)" },
{ rank: "294", char: "像", pinyin: "xiàng", example: "像样 (xiàng yàng)" },
{ rank: "295", char: "难", pinyin: "nán", example: "难题 (nán tí)" },
{ rank: "296", char: "且", pinyin: "qiě", example: "且慢 (qiě màn)" },
{ rank: "297", char: "权", pinyin: "quán", example: "权力 (quán lì)" },
{ rank: "298", char: "思", pinyin: "sī", example: "思考 (sī kǎo)" },
{ rank: "299", char: "王", pinyin: "wáng", example: "国王 (guó wáng)" },
{ rank: "300", char: "象", pinyin: "xiàng", example: "象征 (xiàng zhēng)" }


];

const rowsPerPage = 10;
let currentPage = 1;
var lastPage = 0;
var showEng = 0;

function renderTable(page) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const tableBody = document.querySelector('#characters-table tbody');
    tableBody.innerHTML = '';
	
	const pagechars = characters.slice(start, end)

	const tableHdr = `<th>Frequency Rank</th><th>Character</th><th>Pinyin</th><th>Example</th>${showEng ? `<th>English</th>`:``}`
    const rows = pagechars.map(item => `
        <tr ${item.english ? ` title="${item.english}"` : ''} >
            <td>${item.rank}</td>
			<td>${item.char}</td>
            <td>${item.pinyin}</td>
            <td>${item.example}</td>
			${showEng ? `<td>${item.english ? `${item.english}` : ''}</td>`:``}

        </tr>
    `).join('');
	
    tableBody.innerHTML = tableHdr + rows;

    document.querySelector('.prev').disabled = page === 1;
    document.querySelector('.next').disabled = page === lastPage;
	document.getElementById("infospan").textContent=`Page: ${page} of ${lastPage} `;

	var cbaretable = document.getElementById("cbare");
	cbaretable.innerHTML = '';
	var row = cbaretable.insertRow(0);
	var row2 = cbaretable.insertRow(1);

	const seen = new Set();
	pagechars.forEach(item => { seen.add(item.char) });
	
	uniarry = Array.from(seen)
	const midpt = Math.ceil(uniarry.length / 2);
	
	if( uniarry.length > 4 ) {
		const c1 = uniarry.slice(0, midpt).map(item => `<td>${item}</td> `).join('');
		row.innerHTML = c1;
		const c2 = uniarry.slice(midpt).map(item => `<td>${item}</td> `).join('');
		row2.innerHTML = c2;

	} else {
		const charcols = uniarry.map(item => `<td>${item}</td> `).join('');
		row.innerHTML = charcols;
	}
	
	const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    params.set('eng', showEng);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

}

function changePage(offset) {
    currentPage += offset;	
    renderTable(currentPage);
}

function jumpToPage( jumpPage ) {
	
	if( jumpPage && ( jumpPage == 1 ) )
		currentPage = jumpPage
	else if( jumpPage && ( jumpPage == -1 ) )
		currentPage = lastPage
	else {
        const pageInput = document.getElementById('jump-page').value;
        const page = parseInt(pageInput, 10);
        if (page >= 1 && page <= lastPage) {
            currentPage = page;
        } else {
            alert('Please enter a valid page number.');
			return;
        }
	}
	
    renderTable(currentPage);
}

function parseBoolean(str) {
    return str.toLowerCase() === 'true';
}

function launchPage() {
	lastPage = Math.ceil(characters.length / rowsPerPage);
	const params = new URLSearchParams(window.location.search);
	const page = parseInt(params.get('page'));
	if ( page )
		currentPage = Math.min(Math.max( page, 1), lastPage);
	showEng = parseBoolean(params.get('eng') ? `params.get('eng')` : `` );
	toggle = document.getElementById('toggleEnglish').checked = showEng;


	console.log("launchPage currentPage ",currentPage);
	
	renderTable(currentPage);
		
}

document.addEventListener('DOMContentLoaded', () => launchPage());
document.getElementById('toggleEnglish').addEventListener('change', function() {
	showEng = this.checked
	renderTable(currentPage);
});
