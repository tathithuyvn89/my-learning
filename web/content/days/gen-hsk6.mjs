import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const TIMER = { review: 5, vocab: 8, grammar: 8, talk: 5, ai: 4 };

function v(han, pinyin, vi, exHan, exPy, exVi) {
  return {
    han,
    pinyin,
    vi,
    example: { han: exHan, pinyin: exPy, vi: exVi },
  };
}

function line(speaker, han, pinyin, vi) {
  return { speaker, han, pinyin, vi };
}

function drill(prompt, answer) {
  return { prompt, answer };
}

function ex(prompt, answer) {
  return { type: "write", prompt, answer };
}

function mk(id, theme, kind, vocab, grammar, dialogue, exercises, scenario, start) {
  return {
    id,
    theme,
    kind,
    vocab: vocab.map((item) => v(...item)),
    grammar: {
      title: grammar[0],
      pattern: grammar[1],
      explainVi: grammar[2],
      drills: grammar[3].map((item) => drill(...item)),
    },
    dialogue: dialogue.map((item) => line(...item)),
    exercises: exercises.map((item) => ex(...item)),
    scenario,
    start,
  };
}

const LESSONS = [
  mk(281, "Công lý", "learn", [
    ["权利", "quánlì", "Quyền", "人人都有权利。", "Rénrén dōu yǒu quánlì.", "Mọi người đều có quyền."],
    ["义务", "yìwù", "Nghĩa vụ", "我们也有义务。", "Wǒmen yě yǒu yìwù.", "Chúng ta cũng có nghĩa vụ."],
    ["公正", "gōngzhèng", "Công bằng / công chính", "审判必须公正。", "Shěnpàn bìxū gōngzhèng.", "Xét xử phải công chính."],
    ["合法", "héfǎ", "Hợp pháp", "这样做是合法的。", "Zhèyàng zuò shì héfǎ de.", "Làm vậy là hợp pháp."],
    ["视为", "shìwéi", "Coi là", "他把工作视为责任。", "Tā bǎ gōngzuò shìwéi zérèn.", "Anh ấy coi việc là trách nhiệm."],
  ], ["将…视为", "将 + N + 视为 + N", "将 A 视为 B: coi A là B. 将权利视为义务.", [
    ["Dịch: Mọi người đều có quyền.", "人人都有权利。"],
    ["Dịch: Chúng ta cũng có nghĩa vụ.", "我们也有义务。"],
    ["Dịch: Làm vậy là hợp pháp.", "这样做是合法的。"],
    ["Dịch: Anh ấy coi việc là trách nhiệm.", "他把工作视为责任。"],
  ]], [
    ["A", "你把权利视为义务吗？", "Nǐ bǎ quánlì shìwéi yìwù ma?", "Bạn coi quyền là nghĩa vụ không?"],
    ["B", "对。权利合法，义务也要公正。", "Duì. Quánlì héfǎ, yìwù yě yào gōngzhèng.", "Đúng. Quyền hợp pháp, nghĩa vụ cũng phải công chính."],
    ["A", "如果有人不合法呢？", "Rúguǒ yǒu rén bù héfǎ ne?", "Nếu có người không hợp pháp thì sao?"],
    ["B", "那就不能视为公正。", "Nà jiù bù néng shìwéi gōngzhèng.", "Thế thì không thể coi là công chính."],
  ], [
    ["Tự viết: Mọi người đều có quyền.", "人人都有权利。"],
    ["Tự viết: Anh ấy coi việc là trách nhiệm.", "他把工作视为责任。"],
  ], "Nói quyền, nghĩa vụ, hợp pháp và coi việc gì là gì.", "你把权利视为义务吗？"),

  mk(282, "Tư pháp", "learn", [
    ["司法", "sīfǎ", "Tư pháp", "司法必须独立。", "Sīfǎ bìxū dúlì.", "Tư pháp phải độc lập."],
    ["审判", "shěnpàn", "Xét xử", "明天进行审判。", "Míngtiān jìnxíng shěnpàn.", "Ngày mai tiến hành xét xử."],
    ["辩护", "biànhù", "Bào chữa", "律师为他辩护。", "Lǜshī wèi tā biànhù.", "Luật sư bào chữa cho anh ấy."],
    ["诉讼", "sùsòng", "Kiện tụng", "他们开始诉讼。", "Tāmen kāishǐ sùsòng.", "Họ bắt đầu kiện."],
    ["裁决", "cáijué", "Phán quyết", "裁决已经出来了。", "Cáijué yǐjīng chūlái le.", "Phán quyết đã ra."],
  ], ["进行 + 审判", "进行 + 审判 / 诉讼", "进行审判: tiến hành xét xử. 进行诉讼: tiến hành kiện.", [
    ["Dịch: Tư pháp phải độc lập.", "司法必须独立。"],
    ["Dịch: Ngày mai tiến hành xét xử.", "明天进行审判。"],
    ["Dịch: Luật sư bào chữa cho anh ấy.", "律师为他辩护。"],
    ["Dịch: Phán quyết đã ra.", "裁决已经出来了。"],
  ]], [
    ["A", "这场诉讼什么时候审判？", "Zhè chǎng sùsòng shénme shíhou shěnpàn?", "Vụ kiện này khi nào xét xử?"],
    ["B", "明天进行审判。律师会辩护。", "Míngtiān jìnxíng shěnpàn. Lǜshī huì biànhù.", "Ngày mai xét xử. Luật sư sẽ bào chữa."],
    ["A", "司法能公正吗？", "Sīfǎ néng gōngzhèng ma?", "Tư pháp có công chính được không?"],
    ["B", "能。裁决会合法。", "Néng. Cáijué huì héfǎ.", "Được. Phán quyết sẽ hợp pháp."],
  ], [
    ["Tự viết: Ngày mai tiến hành xét xử.", "明天进行审判。"],
    ["Tự viết: Luật sư bào chữa cho anh ấy.", "律师为他辩护。"],
  ], "Nói xét xử, bào chữa, kiện tụng và phán quyết.", "这场诉讼什么时候审判？"),

  mk(283, "Tội phạm", "learn", [
    ["违法", "wéifǎ", "Vi phạm pháp luật", "这样做违法。", "Zhèyàng zuò wéifǎ.", "Làm vậy là phạm pháp."],
    ["犯罪", "fànzuì", "Phạm tội", "他没有犯罪。", "Tā méiyǒu fànzuì.", "Anh ấy không phạm tội."],
    ["惩罚", "chéngfá", "Trừng phạt", "违法要受惩罚。", "Wéifǎ yào shòu chéngfá.", "Phạm pháp phải chịu phạt."],
    ["制裁", "zhìcái", "Trừng phạt / chế tài", "法院给出制裁。", "Fǎyuàn gěichū zhìcái.", "Tòa đưa ra chế tài."],
    ["赔偿", "péicháng", "Bồi thường", "公司必须赔偿。", "Gōngsī bìxū péicháng.", "Công ty phải bồi thường."],
  ], ["因…而…", "因 + nguyên nhân + 而 + kết quả", "因违法而受惩罚: vì phạm pháp mà bị phạt.", [
    ["Dịch: Làm vậy là phạm pháp.", "这样做违法。"],
    ["Dịch: Anh ấy không phạm tội.", "他没有犯罪。"],
    ["Dịch: Phạm pháp phải chịu phạt.", "违法要受惩罚。"],
    ["Dịch: Công ty phải bồi thường.", "公司必须赔偿。"],
  ]], [
    ["A", "他是因违法而受惩罚吗？", "Tā shì yīn wéifǎ ér shòu chéngfá ma?", "Anh ấy vì phạm pháp mà bị phạt à?"],
    ["B", "对。可是他还没犯罪。", "Duì. Kěshì tā hái méi fànzuì.", "Đúng. Nhưng anh ấy chưa phạm tội."],
    ["A", "那还要制裁和赔偿吗？", "Nà hái yào zhìcái hé péicháng ma?", "Thế còn chế tài và bồi thường không?"],
    ["B", "要赔偿，制裁会轻一些。", "Yào péicháng, zhìcái huì qīng yìxiē.", "Phải bồi thường, chế tài sẽ nhẹ hơn."],
  ], [
    ["Tự viết: Làm vậy là phạm pháp.", "这样做违法。"],
    ["Tự viết: Công ty phải bồi thường.", "公司必须赔偿。"],
  ], "Nói vi phạm, phạm tội, chế tài và bồi thường.", "他是因违法而受惩罚吗？"),

  mk(284, "Giám sát", "learn", [
    ["监督", "jiāndū", "Giám sát", "公众可以监督。", "Gōngzhòng kěyǐ jiāndū.", "Công chúng có thể giám sát."],
    ["腐败", "fǔbài", "Tham nhũng", "我们反对腐败。", "Wǒmen fǎnduì fǔbài.", "Chúng ta chống tham nhũng."],
    ["透明", "tòumíng", "Minh bạch", "过程必须透明。", "Guòchéng bìxū tòumíng.", "Quá trình phải minh bạch."],
    ["追究", "zhuījiū", "Truy cứu", "要追究责任。", "Yào zhuījiū zérèn.", "Phải truy cứu trách nhiệm."],
    ["维护", "wéihù", "Bảo vệ / gìn giữ", "维护公正很重要。", "Wéihù gōngzhèng hěn zhòngyào.", "Gìn giữ công chính rất quan trọng."],
  ], ["对…进行监督", "对 + N + 进行监督", "对政府进行监督: giám sát chính phủ.", [
    ["Dịch: Công chúng có thể giám sát.", "公众可以监督。"],
    ["Dịch: Chúng ta chống tham nhũng.", "我们反对腐败。"],
    ["Dịch: Quá trình phải minh bạch.", "过程必须透明。"],
    ["Dịch: Phải truy cứu trách nhiệm.", "要追究责任。"],
  ]], [
    ["A", "怎么维护公正？", "Zěnme wéihù gōngzhèng?", "Làm sao gìn giữ công chính?"],
    ["B", "对权力进行监督，过程要透明。", "Duì quánlì jìnxíng jiāndū, guòchéng yào tòumíng.", "Giám sát quyền lực, quá trình phải minh bạch."],
    ["A", "如果发现腐败呢？", "Rúguǒ fāxiàn fǔbài ne?", "Nếu phát hiện tham nhũng thì sao?"],
    ["B", "马上追究责任。", "Mǎshàng zhuījiū zérèn.", "Truy cứu trách nhiệm ngay."],
  ], [
    ["Tự viết: Chúng ta chống tham nhũng.", "我们反对腐败。"],
    ["Tự viết: Phải truy cứu trách nhiệm.", "要追究责任。"],
  ], "Nói giám sát, minh bạch, chống tham nhũng và truy cứu.", "怎么维护公正？"),

  mk(285, "Hiến pháp", "learn", [
    ["宪法", "xiànfǎ", "Hiến pháp", "宪法保护公民。", "Xiànfǎ bǎohù gōngmín.", "Hiến pháp bảo vệ công dân."],
    ["公民", "gōngmín", "Công dân", "每个公民都有权利。", "Měi ge gōngmín dōu yǒu quánlì.", "Mỗi công dân đều có quyền."],
    ["尊严", "zūnyán", "Phẩm giá", "人的尊严不能丢。", "Rén de zūnyán bùnéng diū.", "Phẩm giá con người không thể mất."],
    ["权威", "quánwēi", "Uy quyền / thẩm quyền", "法律有权威。", "Fǎlǜ yǒu quánwēi.", "Pháp luật có uy quyền."],
    ["鉴于", "jiànyú", "Xét rằng / căn cứ", "鉴于这个问题，我们要改。", "Jiànyú zhège wèntí, wǒmen yào gǎi.", "Xét vấn đề này, chúng ta phải sửa."],
  ], ["鉴于 + N", "鉴于 + N / 情况，…", "鉴于: xét/căn cứ. 鉴于宪法，公民有权利.", [
    ["Dịch: Hiến pháp bảo vệ công dân.", "宪法保护公民。"],
    ["Dịch: Mỗi công dân đều có quyền.", "每个公民都有权利。"],
    ["Dịch: Phẩm giá con người không thể mất.", "人的尊严不能丢。"],
    ["Dịch: Xét vấn đề này, chúng ta phải sửa.", "鉴于这个问题，我们要改。"],
  ]], [
    ["A", "鉴于宪法，公民有什么权利？", "Jiànyú xiànfǎ, gōngmín yǒu shénme quánlì?", "Xét hiến pháp, công dân có quyền gì?"],
    ["B", "有合法权利，也有尊严。", "Yǒu héfǎ quánlì, yě yǒu zūnyán.", "Có quyền hợp pháp, cũng có phẩm giá."],
    ["A", "法律的权威在哪儿？", "Fǎlǜ de quánwēi zài nǎr?", "Uy quyền của pháp luật ở đâu?"],
    ["B", "在公正的审判里。", "Zài gōngzhèng de shěnpàn lǐ.", "Ở trong xét xử công chính."],
  ], [
    ["Tự viết: Hiến pháp bảo vệ công dân.", "宪法保护公民。"],
    ["Tự viết: Xét vấn đề này, chúng ta phải sửa.", "鉴于这个问题，我们要改。"],
  ], "Nói hiến pháp, công dân, phẩm giá và căn cứ.", "鉴于宪法，公民有什么权利？"),

  mk(286, "Tổng hợp luật", "review", [
    ["权利", "quánlì", "Quyền (ôn)", "保护权利。", "Bǎohù quánlì.", "Bảo vệ quyền."],
    ["审判", "shěnpàn", "Xét xử (ôn)", "进行审判。", "Jìnxíng shěnpàn.", "Tiến hành xét xử."],
    ["赔偿", "péicháng", "Bồi thường (ôn)", "必须赔偿。", "Bìxū péicháng.", "Phải bồi thường."],
    ["监督", "jiāndū", "Giám sát (ôn)", "公众监督。", "Gōngzhòng jiāndū.", "Công chúng giám sát."],
    ["鉴于", "jiànyú", "Xét rằng (ôn)", "鉴于情况。", "Jiànyú qíngkuàng.", "Xét tình hình."],
  ], ["视为 / 鉴于", "将…视为 / 鉴于 + N", "Ôn tuần 41: coi là, xét rằng.", [
    ["Dịch: Bảo vệ quyền.", "保护权利。"],
    ["Dịch: Tiến hành xét xử.", "进行审判。"],
    ["Dịch: Phải bồi thường.", "必须赔偿。"],
    ["Dịch: Xét tình hình.", "鉴于情况。"],
  ]], [
    ["A", "鉴于这次诉讼，你怎么看？", "Jiànyú zhè cì sùsòng, nǐ zěnme kàn?", "Xét vụ kiện này, bạn nghĩ sao?"],
    ["B", "将公正视为最重要的义务。", "Jiāng gōngzhèng shìwéi zuì zhòngyào de yìwù.", "Coi công chính là nghĩa vụ quan trọng nhất."],
    ["A", "如果有腐败呢？", "Rúguǒ yǒu fǔbài ne?", "Nếu có tham nhũng thì sao?"],
    ["B", "要监督，也要追究。", "Yào jiāndū, yě yào zhuījiū.", "Phải giám sát, cũng phải truy cứu."],
  ], [
    ["Tự viết: Coi công chính là nghĩa vụ.", "将公正视为义务。"],
    ["Tự viết: Xét tình hình phải sửa.", "鉴于情况，要改。"],
  ], "Tổng hợp tuần luật: quyền, xét xử, giám sát.", "鉴于这次诉讼，你怎么看？"),

  mk(287, "Thẩm phán vs công dân", "review", [
    ["辩护", "biànhù", "Bào chữa (ôn)", "请律师辩护。", "Qǐng lǜshī biànhù.", "Mời luật sư bào chữa."],
    ["裁决", "cáijué", "Phán quyết (ôn)", "等待裁决。", "Děngdài cáijué.", "Chờ phán quyết."],
    ["公民", "gōngmín", "Công dân (ôn)", "我是公民。", "Wǒ shì gōngmín.", "Tôi là công dân."],
    ["尊严", "zūnyán", "Phẩm giá (ôn)", "维护尊严。", "Wéihù zūnyán.", "Gìn giữ phẩm giá."],
    ["透明", "tòumíng", "Minh bạch (ôn)", "过程透明。", "Guòchéng tòumíng.", "Quá trình minh bạch."],
  ], ["Chỉ luật", "视为 / 鉴于 / 审判", "Roleplay thẩm phán vs công dân. Khoá từ tuần 41.", [
    ["Dịch: Mời luật sư bào chữa.", "请律师辩护。"],
    ["Dịch: Chờ phán quyết.", "等待裁决。"],
    ["Dịch: Tôi là công dân.", "我是公民。"],
    ["Dịch: Gìn giữ phẩm giá.", "维护尊严。"],
  ]], [
    ["A", "鉴于宪法，你有权辩护。", "Jiànyú xiànfǎ, nǐ yǒu quán biànhù.", "Xét hiến pháp, bạn có quyền bào chữa."],
    ["B", "谢谢。请进行公正的审判。", "Xièxie. Qǐng jìnxíng gōngzhèng de shěnpàn.", "Cảm ơn. Xin xét xử công chính."],
    ["A", "过程会透明。裁决会合法。", "Guòchéng huì tòumíng. Cáijué huì héfǎ.", "Quá trình sẽ minh bạch. Phán quyết sẽ hợp pháp."],
    ["B", "我把尊严视为最重要的权利。", "Wǒ bǎ zūnyán shìwéi zuì zhòngyào de quánlì.", "Tôi coi phẩm giá là quyền quan trọng nhất."],
  ], [
    ["Tự viết: Bạn có quyền bào chữa.", "你有权辩护。"],
    ["Tự viết: Xin xét xử công chính.", "请进行公正的审判。"],
  ], "Thẩm phán giải thích quyền bào chữa; công dân đòi xét xử công chính.", "鉴于宪法，你有权辩护。"),

  mk(288, "Triết học", "learn", [
    ["哲学", "zhéxué", "Triết học", "我在学哲学。", "Wǒ zài xué zhéxué.", "Tôi đang học triết học."],
    ["本质", "běnzhì", "Bản chất", "问题的本质是什么？", "Wèntí de běnzhì shì shénme?", "Bản chất vấn đề là gì?"],
    ["抽象", "chōuxiàng", "Trừu tượng", "这个概念很抽象。", "Zhège gàiniàn hěn chōuxiàng.", "Khái niệm này rất trừu tượng."],
    ["辩证", "biànzhèng", "Biện chứng", "我们辩证地看。", "Wǒmen biànzhèng de kàn.", "Chúng ta nhìn một cách biện chứng."],
    ["范畴", "fànchóu", "Phạm trù", "这属于道德范畴。", "Zhè shǔyú dàodé fànchóu.", "Đây thuộc phạm trù đạo đức."],
  ], ["以…为…", "以 + N + 为 + N", "以 A 为 B: lấy A làm B. 以本质为起点.", [
    ["Dịch: Tôi đang học triết học.", "我在学哲学。"],
    ["Dịch: Bản chất vấn đề là gì?", "问题的本质是什么？"],
    ["Dịch: Khái niệm này rất trừu tượng.", "这个概念很抽象。"],
    ["Dịch: Đây thuộc phạm trù đạo đức.", "这属于道德范畴。"],
  ]], [
    ["A", "哲学以什么为本质？", "Zhéxué yǐ shénme wéi běnzhì?", "Triết học lấy gì làm bản chất?"],
    ["B", "以思考为本质。有时很抽象。", "Yǐ sīkǎo wéi běnzhì. Yǒushí hěn chōuxiàng.", "Lấy suy nghĩ làm bản chất. Đôi khi rất trừu tượng."],
    ["A", "能辩证地看这个问题吗？", "Néng biànzhèng de kàn zhège wèntí ma?", "Có thể nhìn biện chứng vấn đề này không?"],
    ["B", "能。它属于哲学范畴。", "Néng. Tā shǔyú zhéxué fànchóu.", "Được. Nó thuộc phạm trù triết học."],
  ], [
    ["Tự viết: Tôi đang học triết học.", "我在学哲学。"],
    ["Tự viết: Bản chất vấn đề là gì?", "问题的本质是什么？"],
  ], "Nói triết học, bản chất, trừu tượng và phạm trù.", "哲学以什么为本质？"),

  mk(289, "Đạo đức", "learn", [
    ["道德", "dàodé", "Đạo đức", "这是道德问题。", "Zhè shì dàodé wèntí.", "Đây là vấn đề đạo đức."],
    ["良心", "liángxīn", "Lương tâm", "要对得起良心。", "Yào duìdeqǐ liángxīn.", "Phải không phụ lương tâm."],
    ["美德", "měidé", "Đức hạnh", "诚实是一种美德。", "Chéngshí shì yì zhǒng měidé.", "Thành thật là một đức hạnh."],
    ["修养", "xiūyǎng", "Tu dưỡng", "他很有修养。", "Tā hěn yǒu xiūyǎng.", "Anh ấy rất có tu dưỡng."],
    ["境界", "jìngjiè", "Cảnh giới", "这是很高的境界。", "Zhè shì hěn gāo de jìngjiè.", "Đây là cảnh giới rất cao."],
  ], ["具有 + 美德", "具有 + 美德 / 修养", "具有美德: có đức hạnh. 很有修养.", [
    ["Dịch: Đây là vấn đề đạo đức.", "这是道德问题。"],
    ["Dịch: Phải không phụ lương tâm.", "要对得起良心。"],
    ["Dịch: Thành thật là một đức hạnh.", "诚实是一种美德。"],
    ["Dịch: Anh ấy rất có tu dưỡng.", "他很有修养。"],
  ]], [
    ["A", "什么是美德？", "Shénme shì měidé?", "Đức hạnh là gì?"],
    ["B", "对得起良心，就是美德。", "Duìdeqǐ liángxīn, jiù shì měidé.", "Không phụ lương tâm, đó là đức hạnh."],
    ["A", "修养能提高境界吗？", "Xiūyǎng néng tígāo jìngjiè ma?", "Tu dưỡng có nâng cảnh giới không?"],
    ["B", "能。道德以良心为起点。", "Néng. Dàodé yǐ liángxīn wéi qǐdiǎn.", "Được. Đạo đức lấy lương tâm làm điểm bắt đầu."],
  ], [
    ["Tự viết: Đây là vấn đề đạo đức.", "这是道德问题。"],
    ["Tự viết: Thành thật là một đức hạnh.", "诚实是一种美德。"],
  ], "Nói đạo đức, lương tâm, đức hạnh và tu dưỡng.", "什么是美德？"),

  mk(290, "Thành thật", "learn", [
    ["诚实", "chéngshí", "Thành thật", "他很诚实。", "Tā hěn chéngshí.", "Anh ấy rất thành thật."],
    ["虚伪", "xūwěi", "Giả dối", "我讨厌虚伪。", "Wǒ tǎoyàn xūwěi.", "Tôi ghét giả dối."],
    ["欺骗", "qīpiàn", "Lừa dối", "不要欺骗朋友。", "Bú yào qīpiàn péngyou.", "Đừng lừa bạn."],
    ["背叛", "bèipàn", "Phản bội", "这不是背叛。", "Zhè bú shì bèipàn.", "Đây không phải phản bội."],
    ["牺牲", "xīshēng", "Hy sinh", "他为理想牺牲了很多。", "Tā wèi lǐxiǎng xīshēng le hěn duō.", "Anh ấy hy sinh nhiều vì lý tưởng."],
  ], ["不是…而是…", "不是 A，而是 B", "Không phải A mà là B. 不是虚伪，而是保护.", [
    ["Dịch: Anh ấy rất thành thật.", "他很诚实。"],
    ["Dịch: Tôi ghét giả dối.", "我讨厌虚伪。"],
    ["Dịch: Đừng lừa bạn.", "不要欺骗朋友。"],
    ["Dịch: Đây không phải phản bội.", "这不是背叛。"],
  ]], [
    ["A", "你觉得他诚实吗？", "Nǐ juéde tā chéngshí ma?", "Bạn thấy anh ấy thành thật không?"],
    ["B", "是。他不是虚伪，而是小心。", "Shì. Tā bú shì xūwěi, ér shì xiǎoxīn.", "Có. Không phải giả dối mà là cẩn thận."],
    ["A", "他会欺骗或者背叛吗？", "Tā huì qīpiàn huòzhě bèipàn ma?", "Anh ấy sẽ lừa hoặc phản bội không?"],
    ["B", "不会。他宁愿牺牲自己。", "Bú huì. Tā nìngyuàn xīshēng zìjǐ.", "Không. Anh ấy thà hy sinh mình."],
  ], [
    ["Tự viết: Anh ấy rất thành thật.", "他很诚实。"],
    ["Tự viết: Đừng lừa bạn.", "不要欺骗朋友。"],
  ], "Nói thành thật, giả dối, lừa dối và hy sinh.", "你觉得他诚实吗？"),

  mk(291, "Cống hiến", "learn", [
    ["奉献", "fèngxiàn", "Cống hiến", "她一生奉献给教育。", "Tā yìshēng fèngxiàn gěi jiàoyù.", "Bà cả đời cống hiến cho giáo dục."],
    ["自私", "zìsī", "Ích kỷ", "不要太自私。", "Bú yào tài zìsī.", "Đừng quá ích kỷ."],
    ["慷慨", "kāngkǎi", "Hào phóng", "他为人慷慨。", "Tā wéirén kāngkǎi.", "Anh ấy đối người hào phóng."],
    ["怜悯", "liánmǐn", "Thương xót", "怜悯不是软弱。", "Liánmǐn bú shì ruǎnruò.", "Thương xót không phải yếu đuối."],
    ["荣誉", "róngyù", "Danh dự", "这是大家的荣誉。", "Zhè shì dàjiā de róngyù.", "Đây là danh dự của mọi người."],
  ], ["为…而奉献", "为 + N + 而奉献", "为教育而奉献: cống hiến vì giáo dục.", [
    ["Dịch: Bà cả đời cống hiến cho giáo dục.", "她一生奉献给教育。"],
    ["Dịch: Đừng quá ích kỷ.", "不要太自私。"],
    ["Dịch: Anh ấy đối người hào phóng.", "他为人慷慨。"],
    ["Dịch: Đây là danh dự của mọi người.", "这是大家的荣誉。"],
  ]], [
    ["A", "奉献和自私有什么不同？", "Fèngxiàn hé zìsī yǒu shénme bùtóng?", "Cống hiến và ích kỷ khác gì?"],
    ["B", "奉献是为别人，自私只想自己。", "Fèngxiàn shì wèi biérén, zìsī zhǐ xiǎng zìjǐ.", "Cống hiến vì người khác, ích kỷ chỉ nghĩ mình."],
    ["A", "慷慨和怜悯呢？", "Kāngkǎi hé liánmǐn ne?", "Còn hào phóng và thương xót?"],
    ["B", "都是美德，也能带来荣誉。", "Dōu shì měidé, yě néng dàilái róngyù.", "Đều là đức hạnh, cũng mang lại danh dự."],
  ], [
    ["Tự viết: Đừng quá ích kỷ.", "不要太自私。"],
    ["Tự viết: Đây là danh dự của mọi người.", "这是大家的荣誉。"],
  ], "Nói cống hiến, ích kỷ, hào phóng và danh dự.", "奉献和自私有什么不同？"),

  mk(292, "Niềm tin", "learn", [
    ["信念", "xìnniàn", "Niềm tin", "我有自己的信念。", "Wǒ yǒu zìjǐ de xìnniàn.", "Tôi có niềm tin của mình."],
    ["追求", "zhuīqiú", "Theo đuổi", "他追求平等。", "Tā zhuīqiú píngděng.", "Anh ấy theo đuổi bình đẳng."],
    ["歧视", "qíshì", "Kỳ thị", "我们反对歧视。", "Wǒmen fǎnduì qíshì.", "Chúng ta chống kỳ thị."],
    ["平等", "píngděng", "Bình đẳng", "人人应该平等。", "Rénrén yīnggāi píngděng.", "Mọi người nên bình đẳng."],
    ["无非", "wúfēi", "Chẳng qua chỉ là", "这无非是个选择。", "Zhè wúfēi shì ge xuǎnzé.", "Đây chẳng qua là một lựa chọn."],
  ], ["无非", "无非 + 是 / 就是", "无非: chẳng qua chỉ là. 无非是信念不同.", [
    ["Dịch: Tôi có niềm tin của mình.", "我有自己的信念。"],
    ["Dịch: Anh ấy theo đuổi bình đẳng.", "他追求平等。"],
    ["Dịch: Chúng ta chống kỳ thị.", "我们反对歧视。"],
    ["Dịch: Đây chẳng qua là một lựa chọn.", "这无非是个选择。"],
  ]], [
    ["A", "你追求什么？", "Nǐ zhuīqiú shénme?", "Bạn theo đuổi gì?"],
    ["B", "追求平等。反对歧视。", "Zhuīqiú píngděng. Fǎnduì qíshì.", "Theo đuổi bình đẳng. Chống kỳ thị."],
    ["A", "这很难吧？", "Zhè hěn nán ba?", "Khó lắm phải không?"],
    ["B", "无非是信念。我不会放弃。", "Wúfēi shì xìnniàn. Wǒ bú huì fàngqì.", "Chẳng qua là niềm tin. Tôi sẽ không bỏ."],
  ], [
    ["Tự viết: Chúng ta chống kỳ thị.", "我们反对歧视。"],
    ["Tự viết: Đây chẳng qua là một lựa chọn.", "这无非是个选择。"],
  ], "Nói niềm tin, theo đuổi bình đẳng và chống kỳ thị.", "你追求什么？"),

  mk(293, "Tổng hợp triết", "review", [
    ["哲学", "zhéxué", "Triết học (ôn)", "讨论哲学。", "Tǎolùn zhéxué.", "Thảo luận triết học."],
    ["道德", "dàodé", "Đạo đức (ôn)", "道德问题。", "Dàodé wèntí.", "Vấn đề đạo đức."],
    ["诚实", "chéngshí", "Thành thật (ôn)", "要诚实。", "Yào chéngshí.", "Phải thành thật."],
    ["奉献", "fèngxiàn", "Cống hiến (ôn)", "愿意奉献。", "Yuànyì fèngxiàn.", "Sẵn sàng cống hiến."],
    ["无非", "wúfēi", "Chẳng qua (ôn)", "无非是选择。", "Wúfēi shì xuǎnzé.", "Chẳng qua là lựa chọn."],
  ], ["以…为 / 无非", "以…为… / 无非", "Ôn tuần 42: lấy…làm…, chẳng qua.", [
    ["Dịch: Thảo luận triết học.", "讨论哲学。"],
    ["Dịch: Phải thành thật.", "要诚实。"],
    ["Dịch: Sẵn sàng cống hiến.", "愿意奉献。"],
    ["Dịch: Chẳng qua là lựa chọn.", "无非是选择。"],
  ]], [
    ["A", "你以什么为信念？", "Nǐ yǐ shénme wéi xìnniàn?", "Bạn lấy gì làm niềm tin?"],
    ["B", "以诚实为美德，反对歧视。", "Yǐ chéngshí wéi měidé, fǎnduì qíshì.", "Lấy thành thật làm đức hạnh, chống kỳ thị."],
    ["A", "这属于什么范畴？", "Zhè shǔyú shénme fànchóu?", "Đây thuộc phạm trù gì?"],
    ["B", "无非是道德和哲学。", "Wúfēi shì dàodé hé zhéxué.", "Chẳng qua là đạo đức và triết học."],
  ], [
    ["Tự viết: Lấy thành thật làm đức hạnh.", "以诚实为美德。"],
    ["Tự viết: Chẳng qua là lựa chọn.", "无非是选择。"],
  ], "Tổng hợp tuần triết: bản chất, đạo đức, niềm tin.", "你以什么为信念？"),

  mk(294, "Triết gia vs học trò", "review", [
    ["本质", "běnzhì", "Bản chất (ôn)", "看本质。", "Kàn běnzhì.", "Nhìn bản chất."],
    ["良心", "liángxīn", "Lương tâm (ôn)", "问良心。", "Wèn liángxīn.", "Hỏi lương tâm."],
    ["境界", "jìngjiè", "Cảnh giới (ôn)", "提高境界。", "Tígāo jìngjiè.", "Nâng cảnh giới."],
    ["牺牲", "xīshēng", "Hy sinh (ôn)", "愿意牺牲。", "Yuànyì xīshēng.", "Sẵn sàng hy sinh."],
    ["平等", "píngděng", "Bình đẳng (ôn)", "追求平等。", "Zhuīqiú píngděng.", "Theo đuổi bình đẳng."],
  ], ["Chỉ đạo đức", "以…为 / 无非 / 美德", "Roleplay triết gia vs học trò. Khoá từ đến tuần 42.", [
    ["Dịch: Nhìn bản chất.", "看本质。"],
    ["Dịch: Hỏi lương tâm.", "问良心。"],
    ["Dịch: Nâng cảnh giới.", "提高境界。"],
    ["Dịch: Theo đuổi bình đẳng.", "追求平等。"],
  ]], [
    ["A", "学习哲学以什么为起点？", "Xuéxí zhéxué yǐ shénme wéi qǐdiǎn?", "Học triết lấy gì làm điểm bắt đầu?"],
    ["B", "以良心为起点，看问题的本质。", "Yǐ liángxīn wéi qǐdiǎn, kàn wèntí de běnzhì.", "Lấy lương tâm làm điểm bắt đầu, nhìn bản chất."],
    ["A", "追求平等会不会太抽象？", "Zhuīqiú píngděng huì bú huì tài chōuxiàng?", "Theo đuổi bình đẳng có quá trừu tượng không?"],
    ["B", "无非是提高境界。愿意牺牲也没关系。", "Wúfēi shì tígāo jìngjiè. Yuànyì xīshēng yě méi guānxi.", "Chẳng qua là nâng cảnh giới. Hy sinh cũng không sao."],
  ], [
    ["Tự viết: Lấy lương tâm làm điểm bắt đầu.", "以良心为起点。"],
    ["Tự viết: Theo đuổi bình đẳng.", "追求平等。"],
  ], "Triết gia gợi mở; học trò nói lương tâm và bình đẳng.", "学习哲学以什么为起点？"),

  mk(295, "Ngoại giao", "learn", [
    ["外交", "wàijiāo", "Ngoại giao", "他做外交工作。", "Tā zuò wàijiāo gōngzuò.", "Anh ấy làm ngoại giao."],
    ["谈判", "tánpàn", "Đàm phán", "明天进行谈判。", "Míngtiān jìnxíng tánpàn.", "Ngày mai tiến hành đàm phán."],
    ["协议", "xiéyì", "Thỏa thuận", "双方签署协议。", "Shuāngfāng qiānshǔ xiéyì.", "Hai bên ký thỏa thuận."],
    ["签署", "qiānshǔ", "Ký kết", "他们签署了文件。", "Tāmen qiānshǔ le wénjiàn.", "Họ đã ký văn bản."],
    ["大使", "dàshǐ", "Đại sứ", "大使参加了会议。", "Dàshǐ cānjiā le huìyì.", "Đại sứ đã dự họp."],
  ], ["进行谈判", "就 + N + 进行谈判", "就贸易进行谈判: đàm phán về thương mại.", [
    ["Dịch: Anh ấy làm ngoại giao.", "他做外交工作。"],
    ["Dịch: Ngày mai tiến hành đàm phán.", "明天进行谈判。"],
    ["Dịch: Hai bên ký thỏa thuận.", "双方签署协议。"],
    ["Dịch: Đại sứ đã dự họp.", "大使参加了会议。"],
  ]], [
    ["A", "大使就什么进行谈判？", "Dàshǐ jiù shénme jìnxíng tánpàn?", "Đại sứ đàm phán về việc gì?"],
    ["B", "就贸易进行谈判，然后签署协议。", "Jiù màoyì jìnxíng tánpàn, ránhòu qiānshǔ xiéyì.", "Đàm phán thương mại, rồi ký thỏa thuận."],
    ["A", "外交工作难吗？", "Wàijiāo gōngzuò nán ma?", "Việc ngoại giao khó không?"],
    ["B", "难。可是协议对双方都重要。", "Nán. Kěshì xiéyì duì shuāngfāng dōu zhòngyào.", "Khó. Nhưng thỏa thuận với cả hai bên đều quan trọng."],
  ], [
    ["Tự viết: Ngày mai tiến hành đàm phán.", "明天进行谈判。"],
    ["Tự viết: Hai bên ký thỏa thuận.", "双方签署协议。"],
  ], "Nói ngoại giao, đàm phán, ký thỏa thuận.", "大使就什么进行谈判？"),

  mk(296, "Xung đột", "learn", [
    ["冲突", "chōngtū", "Xung đột", "那里发生了冲突。", "Nàlǐ fāshēng le chōngtū.", "Ở đó xảy ra xung đột."],
    ["争端", "zhēngduān", "Tranh chấp", "两国有边境争端。", "Liǎng guó yǒu biānjìng zhēngduān.", "Hai nước có tranh chấp biên giới."],
    ["妥协", "tuǒxié", "Thỏa hiệp", "双方愿意妥协。", "Shuāngfāng yuànyì tuǒxié.", "Hai bên sẵn sàng thỏa hiệp."],
    ["调解", "tiáojiě", "Hòa giải", "大使进行调解。", "Dàshǐ jìnxíng tiáojiě.", "Đại sứ tiến hành hòa giải."],
    ["斡旋", "wòxuán", "Điều đình", "他们从中斡旋。", "Tāmen cóngzhōng wòxuán.", "Họ điều đình ở giữa."],
  ], ["通过 + 调解", "通过 + 调解 / 斡旋", "通过调解解决争端: giải quyết tranh chấp bằng hòa giải.", [
    ["Dịch: Ở đó xảy ra xung đột.", "那里发生了冲突。"],
    ["Dịch: Hai nước có tranh chấp biên giới.", "两国有边境争端。"],
    ["Dịch: Hai bên sẵn sàng thỏa hiệp.", "双方愿意妥协。"],
    ["Dịch: Họ điều đình ở giữa.", "他们从中斡旋。"],
  ]], [
    ["A", "冲突能通过调解解决吗？", "Chōngtū néng tōngguò tiáojiě jiějué ma?", "Xung đột có giải được bằng hòa giải không?"],
    ["B", "能。大使正在斡旋。", "Néng. Dàshǐ zhèngzài wòxuán.", "Được. Đại sứ đang điều đình."],
    ["A", "双方会妥协吗？", "Shuāngfāng huì tuǒxié ma?", "Hai bên sẽ thỏa hiệp không?"],
    ["B", "会。争端不能再大了。", "Huì. Zhēngduān bù néng zài dà le.", "Sẽ. Tranh chấp không thể lớn thêm."],
  ], [
    ["Tự viết: Ở đó xảy ra xung đột.", "那里发生了冲突。"],
    ["Tự viết: Hai bên sẵn sàng thỏa hiệp.", "双方愿意妥协。"],
  ], "Nói xung đột, tranh chấp, hòa giải và điều đình.", "冲突能通过调解解决吗？"),

  mk(297, "Chiến lược", "learn", [
    ["战略", "zhànlüè", "Chiến lược", "这是长期战略。", "Zhè shì chángqī zhànlüè.", "Đây là chiến lược dài hạn."],
    ["联盟", "liánméng", "Liên minh", "两国建立联盟。", "Liǎng guó jiànlì liánméng.", "Hai nước lập liên minh."],
    ["局势", "júshì", "Cục diện", "局势比较紧张。", "Júshì bǐjiào jǐnzhāng.", "Cục diện khá căng."],
    ["危机", "wēijī", "Khủng hoảng", "我们面对危机。", "Wǒmen miànduì wēijī.", "Chúng ta đối mặt khủng hoảng."],
    ["和平", "hépíng", "Hòa bình", "大家都要和平。", "Dàjiā dōu yào hépíng.", "Mọi người đều muốn hòa bình."],
  ], ["达成 + 和平", "达成 + 协议 / 和平", "达成和平: đạt được hòa bình.", [
    ["Dịch: Đây là chiến lược dài hạn.", "这是长期战略。"],
    ["Dịch: Hai nước lập liên minh.", "两国建立联盟。"],
    ["Dịch: Cục diện khá căng.", "局势比较紧张。"],
    ["Dịch: Mọi người đều muốn hòa bình.", "大家都要和平。"],
  ]], [
    ["A", "面对危机，战略是什么？", "Miànduì wēijī, zhànlüè shì shénme?", "Đối mặt khủng hoảng, chiến lược là gì?"],
    ["B", "建立联盟，达成和平。", "Jiànlì liánméng, dáchéng hépíng.", "Lập liên minh, đạt hòa bình."],
    ["A", "现在局势怎么样？", "Xiànzài júshì zěnmeyàng?", "Cục diện hiện nay thế nào?"],
    ["B", "还紧张，可是双方愿意谈判。", "Hái jǐnzhāng, kěshì shuāngfāng yuànyì tánpàn.", "Còn căng, nhưng hai bên sẵn sàng đàm phán."],
  ], [
    ["Tự viết: Đây là chiến lược dài hạn.", "这是长期战略。"],
    ["Tự viết: Mọi người đều muốn hòa bình.", "大家都要和平。"],
  ], "Nói chiến lược, liên minh, khủng hoảng và hòa bình.", "面对危机，战略是什么？"),

  mk(298, "Di cư", "learn", [
    ["移民", "yímín", "Di cư / người nhập cư", "很多移民来这里。", "Hěn duō yímín lái zhèlǐ.", "Nhiều người nhập cư đến đây."],
    ["难民", "nànmín", "Người tị nạn", "难民需要帮助。", "Nànmín xūyào bāngzhù.", "Người tị nạn cần giúp."],
    ["边境", "biānjìng", "Biên giới", "边境检查很严。", "Biānjìng jiǎnchá hěn yán.", "Kiểm tra biên giới rất chặt."],
    ["驱逐", "qūzhú", "Trục xuất", "不要随便驱逐。", "Bú yào suíbiàn qūzhú.", "Đừng tùy tiện trục xuất."],
    ["庇护", "bìhù", "Tị nạn / che chở", "国家给予庇护。", "Guójiā jǐyǔ bìhù.", "Quốc gia cho tị nạn."],
  ], ["给予 + 庇护", "给予 + 庇护 / 帮助", "给予庇护: cho tị nạn/che chở.", [
    ["Dịch: Nhiều người nhập cư đến đây.", "很多移民来这里。"],
    ["Dịch: Người tị nạn cần giúp.", "难民需要帮助。"],
    ["Dịch: Đừng tùy tiện trục xuất.", "不要随便驱逐。"],
    ["Dịch: Quốc gia cho tị nạn.", "国家给予庇护。"],
  ]], [
    ["A", "边境的难民怎么办？", "Biānjìng de nànmín zěnme bàn?", "Người tị nạn ở biên giới thì sao?"],
    ["B", "应该给予庇护，不要驱逐。", "Yīnggāi jǐyǔ bìhù, bú yào qūzhú.", "Nên cho tị nạn, đừng trục xuất."],
    ["A", "移民和难民一样吗？", "Yímín hé nànmín yíyàng ma?", "Người nhập cư và tị nạn giống nhau à?"],
    ["B", "不一样。难民更需要帮助。", "Bù yíyàng. Nànmín gèng xūyào bāngzhù.", "Không. Người tị nạn cần giúp hơn."],
  ], [
    ["Tự viết: Người tị nạn cần giúp.", "难民需要帮助。"],
    ["Tự viết: Quốc gia cho tị nạn.", "国家给予庇护。"],
  ], "Nói người nhập cư, tị nạn, biên giới và che chở.", "边境的难民怎么办？"),

  mk(299, "Toàn cầu", "learn", [
    ["全球", "quánqiú", "Toàn cầu", "这是全球问题。", "Zhè shì quánqiú wèntí.", "Đây là vấn đề toàn cầu."],
    ["主权", "zhǔquán", "Chủ quyền", "每个国家都有主权。", "Měi ge guójiā dōu yǒu zhǔquán.", "Mỗi nước đều có chủ quyền."],
    ["干预", "gānyù", "Can thiệp", "不要随便干预。", "Bú yào suíbiàn gānyù.", "Đừng tùy tiện can thiệp."],
    ["援助", "yuánzhù", "Viện trợ", "他们提供援助。", "Tāmen tígōng yuánzhù.", "Họ cung cấp viện trợ."],
    ["裁军", "cáijūn", "Giảm quân bị", "双方同意裁军。", "Shuāngfāng tóngyì cáijūn.", "Hai bên đồng ý giảm quân bị."],
  ], ["对…进行援助", "对 + N + 进行援助", "对难民进行援助: viện trợ người tị nạn.", [
    ["Dịch: Đây là vấn đề toàn cầu.", "这是全球问题。"],
    ["Dịch: Mỗi nước đều có chủ quyền.", "每个国家都有主权。"],
    ["Dịch: Đừng tùy tiện can thiệp.", "不要随便干预。"],
    ["Dịch: Hai bên đồng ý giảm quân bị.", "双方同意裁军。"],
  ]], [
    ["A", "全球危机怎么处理？", "Quánqiú wēijī zěnme chǔlǐ?", "Khủng hoảng toàn cầu xử lý thế nào?"],
    ["B", "对需要的国家进行援助，同时裁军。", "Duì xūyào de guójiā jìnxíng yuánzhù, tóngshí cáijūn.", "Viện trợ nước cần, đồng thời giảm quân bị."],
    ["A", "这会干预主权吗？", "Zhè huì gānyù zhǔquán ma?", "Việc này có can thiệp chủ quyền không?"],
    ["B", "援助不是干预。主权还在。", "Yuánzhù bú shì gānyù. Zhǔquán hái zài.", "Viện trợ không phải can thiệp. Chủ quyền vẫn còn."],
  ], [
    ["Tự viết: Đây là vấn đề toàn cầu.", "这是全球问题。"],
    ["Tự viết: Đừng tùy tiện can thiệp.", "不要随便干预。"],
  ], "Nói toàn cầu, chủ quyền, viện trợ và giảm quân bị.", "全球危机怎么处理？"),

  mk(300, "Tổng hợp quốc tế", "review", [
    ["外交", "wàijiāo", "Ngoại giao (ôn)", "外交谈判。", "Wàijiāo tánpàn.", "Đàm phán ngoại giao."],
    ["冲突", "chōngtū", "Xung đột (ôn)", "减少冲突。", "Jiǎnshǎo chōngtū.", "Giảm xung đột."],
    ["和平", "hépíng", "Hòa bình (ôn)", "达成和平。", "Dáchéng hépíng.", "Đạt hòa bình."],
    ["难民", "nànmín", "Người tị nạn (ôn)", "帮助难民。", "Bāngzhù nànmín.", "Giúp người tị nạn."],
    ["主权", "zhǔquán", "Chủ quyền (ôn)", "尊重主权。", "Zūnzhòng zhǔquán.", "Tôn trọng chủ quyền."],
  ], ["谈判 / 协议", "进行谈判 / 签署协议", "Ôn tuần 43: đàm phán, ký thỏa thuận.", [
    ["Dịch: Đàm phán ngoại giao.", "外交谈判。"],
    ["Dịch: Giảm xung đột.", "减少冲突。"],
    ["Dịch: Đạt hòa bình.", "达成和平。"],
    ["Dịch: Tôn trọng chủ quyền.", "尊重主权。"],
  ]], [
    ["A", "全球局势怎么样？", "Quánqiú júshì zěnmeyàng?", "Cục diện toàn cầu thế nào?"],
    ["B", "有冲突，也有谈判。", "Yǒu chōngtū, yě yǒu tánpàn.", "Có xung đột, cũng có đàm phán."],
    ["A", "能达成和平吗？", "Néng dáchéng hépíng ma?", "Có đạt hòa bình được không?"],
    ["B", "能。先签署协议，再援助难民。", "Néng. Xiān qiānshǔ xiéyì, zài yuánzhù nànmín.", "Được. Trước ký thỏa thuận, rồi viện trợ người tị nạn."],
  ], [
    ["Tự viết: Giảm xung đột.", "减少冲突。"],
    ["Tự viết: Đạt hòa bình.", "达成和平。"],
  ], "Tổng hợp tuần quốc tế: đàm phán, xung đột, hòa bình.", "全球局势怎么样？"),

  mk(301, "Nhà ngoại giao vs phóng viên", "review", [
    ["大使", "dàshǐ", "Đại sứ (ôn)", "采访大使。", "Cǎifǎng dàshǐ.", "Phỏng vấn đại sứ."],
    ["斡旋", "wòxuán", "Điều đình (ôn)", "从中斡旋。", "Cóngzhōng wòxuán.", "Điều đình ở giữa."],
    ["联盟", "liánméng", "Liên minh (ôn)", "建立联盟。", "Jiànlì liánméng.", "Lập liên minh."],
    ["庇护", "bìhù", "Tị nạn (ôn)", "给予庇护。", "Jǐyǔ bìhù.", "Cho tị nạn."],
    ["裁军", "cáijūn", "Giảm quân bị (ôn)", "同意裁军。", "Tóngyì cáijūn.", "Đồng ý giảm quân bị."],
  ], ["Chỉ ngoại giao", "谈判 / 调解 / 援助", "Roleplay nhà ngoại giao vs phóng viên. Khoá từ đến tuần 43.", [
    ["Dịch: Phỏng vấn đại sứ.", "采访大使。"],
    ["Dịch: Điều đình ở giữa.", "从中斡旋。"],
    ["Dịch: Cho tị nạn.", "给予庇护。"],
    ["Dịch: Đồng ý giảm quân bị.", "同意裁军。"],
  ]], [
    ["A", "大使，你们如何斡旋这次争端？", "Dàshǐ, nǐmen rúhé wòxuán zhè cì zhēngduān?", "Thưa đại sứ, các vị điều đình tranh chấp này thế nào?"],
    ["B", "通过谈判建立联盟，同时裁军。", "Tōngguò tánpàn jiànlì liánméng, tóngshí cáijūn.", "Đàm phán để lập liên minh, đồng thời giảm quân bị."],
    ["A", "难民会得到庇护吗？", "Nànmín huì dédào bìhù ma?", "Người tị nạn sẽ được che chở không?"],
    ["B", "会。援助不是干预主权。", "Huì. Yuánzhù bú shì gānyù zhǔquán.", "Sẽ. Viện trợ không phải can thiệp chủ quyền."],
  ], [
    ["Tự viết: Điều đình ở giữa.", "从中斡旋。"],
    ["Tự viết: Cho tị nạn.", "给予庇护。"],
  ], "Phóng viên hỏi; đại sứ nói điều đình, liên minh và tị nạn.", "大使，你们如何斡旋这次争端？"),

  mk(302, "Tâm lý", "learn", [
    ["心理", "xīnlǐ", "Tâm lý", "这是心理问题。", "Zhè shì xīnlǐ wèntí.", "Đây là vấn đề tâm lý."],
    ["焦虑", "jiāolǜ", "Lo âu", "工作让我焦虑。", "Gōngzuò ràng wǒ jiāolǜ.", "Công việc khiến tôi lo âu."],
    ["抑郁", "yìyù", "Trầm cảm", "他有点抑郁。", "Tā yǒudiǎn yìyù.", "Anh ấy hơi trầm cảm."],
    ["障碍", "zhàng'ài", "Rào cản / rối loạn", "这是心理障碍。", "Zhè shì xīnlǐ zhàng'ài.", "Đây là rào cản tâm lý."],
    ["人格", "réngé", "Nhân cách", "人格要健康。", "Réngé yào jiànkāng.", "Nhân cách phải khỏe."],
  ], ["产生 + 焦虑", "产生 + 焦虑 / 障碍", "产生焦虑: nảy sinh lo âu.", [
    ["Dịch: Đây là vấn đề tâm lý.", "这是心理问题。"],
    ["Dịch: Công việc khiến tôi lo âu.", "工作让我焦虑。"],
    ["Dịch: Anh ấy hơi trầm cảm.", "他有点抑郁。"],
    ["Dịch: Nhân cách phải khỏe.", "人格要健康。"],
  ]], [
    ["A", "你最近为什么焦虑？", "Nǐ zuìjìn wèishénme jiāolǜ?", "Gần đây bạn lo âu vì sao?"],
    ["B", "压力大，有点抑郁。", "Yālì dà, yǒudiǎn yìyù.", "Áp lực lớn, hơi trầm cảm."],
    ["A", "这是心理障碍吗？", "Zhè shì xīnlǐ zhàng'ài ma?", "Đây có phải rào cản tâm lý không?"],
    ["B", "也许。我希望人格还能健康。", "Yěxǔ. Wǒ xīwàng réngé hái néng jiànkāng.", "Có lẽ. Tôi mong nhân cách vẫn khỏe."],
  ], [
    ["Tự viết: Công việc khiến tôi lo âu.", "工作让我焦虑。"],
    ["Tự viết: Đây là vấn đề tâm lý.", "这是心理问题。"],
  ], "Nói tâm lý, lo âu, trầm cảm và nhân cách.", "你最近为什么焦虑？"),

  mk(303, "Cảm xúc", "learn", [
    ["情绪", "qíngxù", "Cảm xúc / tâm trạng", "情绪不太稳定。", "Qíngxù bú tài wěndìng.", "Tâm trạng không ổn."],
    ["冲动", "chōngdòng", "Bốc đồng", "不要太冲动。", "Bú yào tài chōngdòng.", "Đừng quá bốc đồng."],
    ["冷静", "lěngjìng", "Bình tĩnh", "先冷静一下。", "Xiān lěngjìng yíxià.", "Bình tĩnh đã."],
    ["调节", "tiáojié", "Điều chỉnh", "我在调节情绪。", "Wǒ zài tiáojié qíngxù.", "Tôi đang điều chỉnh cảm xúc."],
    ["缓解", "huǎnjiě", "Làm dịu / giảm", "运动能缓解压力。", "Yùndòng néng huǎnjiě yālì.", "Tập thể dục giảm được áp lực."],
  ], ["调节 + 情绪", "调节 + 情绪", "调节情绪: điều chỉnh cảm xúc. 缓解压力.", [
    ["Dịch: Tâm trạng không ổn.", "情绪不太稳定。"],
    ["Dịch: Đừng quá bốc đồng.", "不要太冲动。"],
    ["Dịch: Bình tĩnh đã.", "先冷静一下。"],
    ["Dịch: Tập thể dục giảm được áp lực.", "运动能缓解压力。"],
  ]], [
    ["A", "你怎么调节情绪？", "Nǐ zěnme tiáojié qíngxù?", "Bạn điều chỉnh cảm xúc thế nào?"],
    ["B", "先冷静，再运动缓解压力。", "Xiān lěngjìng, zài yùndòng huǎnjiě yālì.", "Bình tĩnh đã, rồi tập để giảm áp lực."],
    ["A", "你以前很冲动吗？", "Nǐ yǐqián hěn chōngdòng ma?", "Trước đây bạn rất bốc đồng à?"],
    ["B", "有一点。现在好很多。", "Yǒu yìdiǎn. Xiànzài hǎo hěn duō.", "Có một chút. Giờ khá hơn nhiều."],
  ], [
    ["Tự viết: Đừng quá bốc đồng.", "不要太冲动。"],
    ["Tự viết: Bình tĩnh đã.", "先冷静一下。"],
  ], "Nói cảm xúc, bốc đồng, bình tĩnh và giảm áp lực.", "你怎么调节情绪？"),

  mk(304, "Chẩn đoán", "learn", [
    ["症状", "zhèngzhuàng", "Triệu chứng", "有什么症状？", "Yǒu shénme zhèngzhuàng?", "Có triệu chứng gì?"],
    ["诊断", "zhěnduàn", "Chẩn đoán", "医生给出诊断。", "Yīshēng gěichū zhěnduàn.", "Bác sĩ đưa ra chẩn đoán."],
    ["处方", "chǔfāng", "Đơn thuốc", "这是新处方。", "Zhè shì xīn chǔfāng.", "Đây là đơn thuốc mới."],
    ["手术", "shǒushù", "Phẫu thuật", "可能需要手术。", "Kěnéng xūyào shǒushù.", "Có thể cần phẫu thuật."],
    ["康复", "kāngfù", "Phục hồi", "手术后要康复。", "Shǒushù hòu yào kāngfù.", "Sau mổ phải phục hồi."],
  ], ["经过 + 诊断", "经过 + 诊断", "经过诊断: sau khi chẩn đoán.", [
    ["Dịch: Có triệu chứng gì?", "有什么症状？"],
    ["Dịch: Bác sĩ đưa ra chẩn đoán.", "医生给出诊断。"],
    ["Dịch: Đây là đơn thuốc mới.", "这是新处方。"],
    ["Dịch: Có thể cần phẫu thuật.", "可能需要手术。"],
  ]], [
    ["A", "经过诊断，是什么问题？", "Jīngguò zhěnduàn, shì shénme wèntí?", "Sau chẩn đoán, là vấn đề gì?"],
    ["B", "症状不重，先用处方。", "Zhèngzhuàng bù zhòng, xiān yòng chǔfāng.", "Triệu chứng không nặng, dùng đơn trước."],
    ["A", "需要手术吗？", "Xūyào shǒushù ma?", "Cần phẫu thuật không?"],
    ["B", "现在不用。注意康复就行。", "Xiànzài bú yòng. Zhùyì kāngfù jiù xíng.", "Giờ chưa. Chú ý phục hồi là được."],
  ], [
    ["Tự viết: Có triệu chứng gì?", "有什么症状？"],
    ["Tự viết: Có thể cần phẫu thuật.", "可能需要手术。"],
  ], "Nói triệu chứng, chẩn đoán, đơn thuốc và phục hồi.", "经过诊断，是什么问题？"),

  mk(305, "Miễn dịch", "learn", [
    ["传染", "chuánrǎn", "Lây nhiễm", "这种病会传染。", "Zhè zhǒng bìng huì chuánrǎn.", "Bệnh này sẽ lây."],
    ["疫苗", "yìmiáo", "Vắc-xin", "我打了疫苗。", "Wǒ dǎ le yìmiáo.", "Tôi đã tiêm vắc-xin."],
    ["免疫", "miǎnyì", "Miễn dịch", "免疫力提高了。", "Miǎnyìlì tígāo le.", "Sức miễn dịch đã tăng."],
    ["保健", "bǎojiàn", "Chăm sóc sức khỏe", "平时要注意保健。", "Píngshí yào zhùyì bǎojiàn.", "Thường ngày phải chú ý sức khỏe."],
    ["以至于", "yǐzhìyú", "Đến nỗi", "他太累了，以至于病了。", "Tā tài lèi le, yǐzhìyú bìng le.", "Anh ấy mệt quá, đến nỗi ốm."],
  ], ["以至于", "…，以至于 + kết quả", "Mức độ cao đến nỗi… 太累以至于病了.", [
    ["Dịch: Bệnh này sẽ lây.", "这种病会传染。"],
    ["Dịch: Tôi đã tiêm vắc-xin.", "我打了疫苗。"],
    ["Dịch: Sức miễn dịch đã tăng.", "免疫力提高了。"],
    ["Dịch: Anh ấy mệt quá, đến nỗi ốm.", "他太累了，以至于病了。"],
  ]], [
    ["A", "不打疫苗会怎样？", "Bù dǎ yìmiáo huì zěnyàng?", "Không tiêm vắc-xin thì sao?"],
    ["B", "可能传染，以至于更严重。", "Kěnéng chuánrǎn, yǐzhìyú gèng yánzhòng.", "Có thể lây, đến nỗi nặng hơn."],
    ["A", "保健能提高免疫吗？", "Bǎojiàn néng tígāo miǎnyì ma?", "Chăm sóc sức khỏe có tăng miễn dịch không?"],
    ["B", "能。睡眠和运动都很重要。", "Néng. Shuìmián hé yùndòng dōu hěn zhòngyào.", "Được. Ngủ và vận động đều quan trọng."],
  ], [
    ["Tự viết: Bệnh này sẽ lây.", "这种病会传染。"],
    ["Tự viết: Tôi đã tiêm vắc-xin.", "我打了疫苗。"],
  ], "Nói lây nhiễm, vắc-xin, miễn dịch và đến nỗi.", "不打疫苗会怎样？"),

  mk(306, "Sức khỏe", "learn", [
    ["睡眠", "shuìmián", "Giấc ngủ", "睡眠不够。", "Shuìmián bú gòu.", "Ngủ không đủ."],
    ["疲劳", "píláo", "Mệt mỏi", "长期疲劳不好。", "Chángqī píláo bù hǎo.", "Mệt lâu không tốt."],
    ["寿命", "shòumìng", "Tuổi thọ", "保健能延长寿命。", "Bǎojiàn néng yáncháng shòumìng.", "Chăm sóc sức khỏe kéo dài tuổi thọ."],
    ["遗传", "yíchuán", "Di truyền", "这和遗传有关。", "Zhè hé yíchuán yǒuguān.", "Cái này liên quan di truyền."],
    ["体质", "tǐzhì", "Thể chất", "他体质比较弱。", "Tā tǐzhì bǐjiào ruò.", "Thể chất anh ấy khá yếu."],
  ], ["由于 + 疲劳", "由于 + N，…", "由于疲劳，睡眠不好: vì mệt nên ngủ kém.", [
    ["Dịch: Ngủ không đủ.", "睡眠不够。"],
    ["Dịch: Mệt lâu không tốt.", "长期疲劳不好。"],
    ["Dịch: Cái này liên quan di truyền.", "这和遗传有关。"],
    ["Dịch: Thể chất anh ấy khá yếu.", "他体质比较弱。"],
  ]], [
    ["A", "你寿命会受遗传影响吗？", "Nǐ shòumìng huì shòu yíchuán yǐngxiǎng ma?", "Tuổi thọ bạn có bị di truyền ảnh hưởng không?"],
    ["B", "有一点。可是疲劳更重要。", "Yǒu yìdiǎn. Kěshì píláo gèng zhòngyào.", "Có một chút. Nhưng mệt quan trọng hơn."],
    ["A", "体质弱怎么改善？", "Tǐzhì ruò zěnme gǎishàn?", "Thể chất yếu cải thiện thế nào?"],
    ["B", "先保证睡眠，再注意保健。", "Xiān bǎozhèng shuìmián, zài zhùyì bǎojiàn.", "Trước hết đảm bảo ngủ, rồi chú ý sức khỏe."],
  ], [
    ["Tự viết: Ngủ không đủ.", "睡眠不够。"],
    ["Tự viết: Mệt lâu không tốt.", "长期疲劳不好。"],
  ], "Nói giấc ngủ, mệt mỏi, tuổi thọ và thể chất.", "你寿命会受遗传影响吗？"),

  mk(307, "Tổng hợp sức khỏe", "review", [
    ["焦虑", "jiāolǜ", "Lo âu (ôn)", "减少焦虑。", "Jiǎnshǎo jiāolǜ.", "Giảm lo âu."],
    ["情绪", "qíngxù", "Cảm xúc (ôn)", "调节情绪。", "Tiáojié qíngxù.", "Điều chỉnh cảm xúc."],
    ["诊断", "zhěnduàn", "Chẩn đoán (ôn)", "经过诊断。", "Jīngguò zhěnduàn.", "Sau chẩn đoán."],
    ["疫苗", "yìmiáo", "Vắc-xin (ôn)", "打疫苗。", "Dǎ yìmiáo.", "Tiêm vắc-xin."],
    ["以至于", "yǐzhìyú", "Đến nỗi (ôn)", "以至于病了。", "Yǐzhìyú bìng le.", "Đến nỗi ốm."],
  ], ["以至于", "…，以至于…", "Ôn tuần 44: đến nỗi.", [
    ["Dịch: Giảm lo âu.", "减少焦虑。"],
    ["Dịch: Điều chỉnh cảm xúc.", "调节情绪。"],
    ["Dịch: Tiêm vắc-xin.", "打疫苗。"],
    ["Dịch: Đến nỗi ốm.", "以至于病了。"],
  ]], [
    ["A", "焦虑会影响到什么程度？", "Jiāolǜ huì yǐngxiǎng dào shénme chéngdù?", "Lo âu ảnh hưởng đến mức nào?"],
    ["B", "以至于睡眠和情绪都不稳定。", "Yǐzhìyú shuìmián hé qíngxù dōu bù wěndìng.", "Đến nỗi ngủ và cảm xúc đều không ổn."],
    ["A", "经过诊断要做什么？", "Jīngguò zhěnduàn yào zuò shénme?", "Sau chẩn đoán phải làm gì?"],
    ["B", "调节情绪，必要时打疫苗。", "Tiáojié qíngxù, bìyào shí dǎ yìmiáo.", "Điều chỉnh cảm xúc, khi cần thì tiêm vắc-xin."],
  ], [
    ["Tự viết: Giảm lo âu.", "减少焦虑。"],
    ["Tự viết: Đến nỗi ngủ không ổn.", "以至于睡眠不稳定。"],
  ], "Tổng hợp tuần sức khỏe: lo âu, chẩn đoán, đến nỗi.", "焦虑会影响到什么程度？"),

  mk(308, "Bác sĩ vs bệnh nhân", "review", [
    ["症状", "zhèngzhuàng", "Triệu chứng (ôn)", "说明症状。", "Shuōmíng zhèngzhuàng.", "Nói triệu chứng."],
    ["处方", "chǔfāng", "Đơn thuốc (ôn)", "开处方。", "Kāi chǔfāng.", "Kê đơn."],
    ["康复", "kāngfù", "Phục hồi (ôn)", "注意康复。", "Zhùyì kāngfù.", "Chú ý phục hồi."],
    ["免疫", "miǎnyì", "Miễn dịch (ôn)", "提高免疫。", "Tígāo miǎnyì.", "Tăng miễn dịch."],
    ["体质", "tǐzhì", "Thể chất (ôn)", "改善体质。", "Gǎishàn tǐzhì.", "Cải thiện thể chất."],
  ], ["Chỉ sức khỏe", "诊断 / 以至于 / 调节", "Roleplay bác sĩ vs bệnh nhân. Khoá từ đến tuần 44.", [
    ["Dịch: Nói triệu chứng.", "说明症状。"],
    ["Dịch: Kê đơn.", "开处方。"],
    ["Dịch: Chú ý phục hồi.", "注意康复。"],
    ["Dịch: Tăng miễn dịch.", "提高免疫。"],
  ]], [
    ["A", "请说明症状。疲劳到什么程度？", "Qǐng shuōmíng zhèngzhuàng. Píláo dào shénme chéngdù?", "Xin nói triệu chứng. Mệt đến mức nào?"],
    ["B", "以至于不能冷静调节情绪。", "Yǐzhìyú bù néng lěngjìng tiáojié qíngxù.", "Đến nỗi không bình tĩnh điều chỉnh cảm xúc."],
    ["A", "我开处方。注意康复，提高免疫。", "Wǒ kāi chǔfāng. Zhùyì kāngfù, tígāo miǎnyì.", "Tôi kê đơn. Chú ý phục hồi, tăng miễn dịch."],
    ["B", "好。我也改善体质。", "Hǎo. Wǒ yě gǎishàn tǐzhì.", "Được. Tôi cũng cải thiện thể chất."],
  ], [
    ["Tự viết: Xin nói triệu chứng.", "请说明症状。"],
    ["Tự viết: Kê đơn, chú ý phục hồi.", "开处方，注意康复。"],
  ], "Bác sĩ hỏi triệu chứng; bệnh nhân nói mệt đến nỗi mất bình tĩnh.", "请说明症状。疲劳到什么程度？"),

  mk(309, "Văn xuôi", "learn", [
    ["散文", "sǎnwén", "Tản văn", "我喜欢读散文。", "Wǒ xǐhuan dú sǎnwén.", "Tôi thích đọc tản văn."],
    ["寓言", "yùyán", "Ngụ ngôn", "这是一篇寓言。", "Zhè shì yì piān yùyán.", "Đây là một bài ngụ ngôn."],
    ["典故", "diǎngù", "Điển cố", "文章用了很多典故。", "Wénzhāng yòng le hěn duō diǎngù.", "Bài viết dùng nhiều điển cố."],
    ["修辞", "xiūcí", "Tu từ", "修辞很重要。", "Xiūcí hěn zhòngyào.", "Tu từ rất quan trọng."],
    ["讽刺", "fěngcì", "Châm biếm", "他的风格带讽刺。", "Tā de fēnggé dài fěngcì.", "Phong cách anh ấy mang châm biếm."],
  ], ["运用 + 修辞", "运用 + 修辞 / 典故", "运用修辞: dùng tu từ.", [
    ["Dịch: Tôi thích đọc tản văn.", "我喜欢读散文。"],
    ["Dịch: Đây là một bài ngụ ngôn.", "这是一篇寓言。"],
    ["Dịch: Tu từ rất quan trọng.", "修辞很重要。"],
    ["Dịch: Phong cách anh ấy mang châm biếm.", "他的风格带讽刺。"],
  ]], [
    ["A", "这篇散文运用了什么修辞？", "Zhè piān sǎnwén yùnyòng le shénme xiūcí?", "Tản văn này dùng tu từ gì?"],
    ["B", "有典故，也有讽刺。", "Yǒu diǎngù, yě yǒu fěngcì.", "Có điển cố, cũng có châm biếm."],
    ["A", "像寓言吗？", "Xiàng yùyán ma?", "Giống ngụ ngôn à?"],
    ["B", "有一点。读起来很有意思。", "Yǒu yìdiǎn. Dú qǐlái hěn yǒu yìsi.", "Có một chút. Đọc rất thú vị."],
  ], [
    ["Tự viết: Tôi thích đọc tản văn.", "我喜欢读散文。"],
    ["Tự viết: Tu từ rất quan trọng.", "修辞很重要。"],
  ], "Nói tản văn, ngụ ngôn, điển cố và tu từ.", "这篇散文运用了什么修辞？"),

  mk(310, "Cốt truyện", "learn", [
    ["比喻", "bǐyù", "Ẩn dụ / so sánh", "这个比喻很清楚。", "Zhège bǐyù hěn qīngchu.", "Hình ảnh so sánh này rất rõ."],
    ["象征", "xiàngzhēng", "Tượng trưng", "鸟象征自由。", "Niǎo xiàngzhēng zìyóu.", "Chim tượng trưng tự do."],
    ["情节", "qíngjié", "Cốt truyện", "情节发展很快。", "Qíngjié fāzhǎn hěn kuài.", "Cốt truyện diễn biến nhanh."],
    ["高潮", "gāocháo", "Cao trào", "高潮在最后。", "Gāocháo zài zuìhòu.", "Cao trào ở cuối."],
    ["结局", "jiéjú", "Kết cục", "结局让人意外。", "Jiéjú ràng rén yìwài.", "Kết cục khiến người ta bất ngờ."],
  ], ["以…为象征", "以 + N + 为象征", "以鸟为象征: lấy chim làm biểu tượng.", [
    ["Dịch: Hình ảnh so sánh này rất rõ.", "这个比喻很清楚。"],
    ["Dịch: Chim tượng trưng tự do.", "鸟象征自由。"],
    ["Dịch: Cốt truyện diễn biến nhanh.", "情节发展很快。"],
    ["Dịch: Kết cục khiến người ta bất ngờ.", "结局让人意外。"],
  ]], [
    ["A", "情节的高潮在哪儿？", "Qíngjié de gāocháo zài nǎr?", "Cao trào của cốt truyện ở đâu?"],
    ["B", "在结局以前。比喻也很清楚。", "Zài jiéjú yǐqián. Bǐyù yě hěn qīngchu.", "Trước kết cục. Hình ảnh so sánh cũng rõ."],
    ["A", "作者以什么为象征？", "Zuòzhě yǐ shénme wéi xiàngzhēng?", "Tác giả lấy gì làm biểu tượng?"],
    ["B", "以鸟为象征，象征自由。", "Yǐ niǎo wéi xiàngzhēng, xiàngzhēng zìyóu.", "Lấy chim làm biểu tượng, tượng trưng tự do."],
  ], [
    ["Tự viết: Cốt truyện diễn biến nhanh.", "情节发展很快。"],
    ["Tự viết: Chim tượng trưng tự do.", "鸟象征自由。"],
  ], "Nói ẩn dụ, biểu tượng, cốt truyện và kết cục.", "情节的高潮在哪儿？"),

  mk(311, "Nghị luận", "learn", [
    ["评述", "píngshù", "Bình luận / nhận xét", "请评述这篇文章。", "Qǐng píngshù zhè piān wénzhāng.", "Xin nhận xét bài này."],
    ["见解", "jiànjiě", "Kiến giải", "他有独特的见解。", "Tā yǒu dútè de jiànjiě.", "Anh ấy có kiến giải độc đáo."],
    ["论证", "lùnzhèng", "Lập luận / chứng minh", "论证还不够。", "Lùnzhèng hái bú gòu.", "Lập luận còn chưa đủ."],
    ["反驳", "fǎnbó", "Bác bỏ", "我可以反驳吗？", "Wǒ kěyǐ fǎnbó ma?", "Tôi có thể bác bỏ không?"],
    ["引用", "yǐnyòng", "Trích dẫn", "他引用了一个典故。", "Tā yǐnyòng le yí ge diǎngù.", "Anh ấy trích một điển cố."],
  ], ["进行论证", "进行论证 / 反驳", "进行论证: tiến hành lập luận.", [
    ["Dịch: Xin nhận xét bài này.", "请评述这篇文章。"],
    ["Dịch: Anh ấy có kiến giải độc đáo.", "他有独特的见解。"],
    ["Dịch: Lập luận còn chưa đủ.", "论证还不够。"],
    ["Dịch: Tôi có thể bác bỏ không?", "我可以反驳吗？"],
  ]], [
    ["A", "你怎么评述他的见解？", "Nǐ zěnme píngshù tā de jiànjiě?", "Bạn nhận xét kiến giải của anh ấy thế nào?"],
    ["B", "见解有意思，可是论证不够。", "Jiànjiě yǒu yìsi, kěshì lùnzhèng bú gòu.", "Kiến giải thú vị, nhưng lập luận chưa đủ."],
    ["A", "你想反驳还是引用？", "Nǐ xiǎng fǎnbó háishi yǐnyòng?", "Bạn muốn bác bỏ hay trích dẫn?"],
    ["B", "先引用，再进行论证。", "Xiān yǐnyòng, zài jìnxíng lùnzhèng.", "Trước trích dẫn, rồi lập luận."],
  ], [
    ["Tự viết: Xin nhận xét bài này.", "请评述这篇文章。"],
    ["Tự viết: Tôi có thể bác bỏ không?", "我可以反驳吗？"],
  ], "Nói nhận xét, kiến giải, lập luận và bác bỏ.", "你怎么评述他的见解？"),

  mk(312, "Tu từ", "learn", [
    ["严谨", "yánjǐn", "Nghiêm cẩn", "论证必须严谨。", "Lùnzhèng bìxū yánjǐn.", "Lập luận phải nghiêm cẩn."],
    ["鲜明", "xiānmíng", "Rõ nét / sắc", "立场很鲜明。", "Lìchǎng hěn xiānmíng.", "Lập trường rất rõ."],
    ["含蓄", "hánxù", "Hàm súc / kín đáo", "散文比较含蓄。", "Sǎnwén bǐjiào hánxù.", "Tản văn khá hàm súc."],
    ["夸张", "kuāzhāng", "Khoa trương", "这个比喻有点夸张。", "Zhège bǐyù yǒudiǎn kuāzhāng.", "Hình ảnh này hơi khoa trương."],
    ["恰恰", "qiàqià", "Đúng / vừa khéo", "恰恰相反。", "Qiàqià xiāngfǎn.", "Đúng ngược lại."],
  ], ["恰恰相反", "恰恰相反 / 恰恰是", "恰恰相反: đúng ngược lại.", [
    ["Dịch: Lập luận phải nghiêm cẩn.", "论证必须严谨。"],
    ["Dịch: Lập trường rất rõ.", "立场很鲜明。"],
    ["Dịch: Tản văn khá hàm súc.", "散文比较含蓄。"],
    ["Dịch: Đúng ngược lại.", "恰恰相反。"],
  ]], [
    ["A", "你觉得文章夸张吗？", "Nǐ juéde wénzhāng kuāzhāng ma?", "Bạn thấy bài viết khoa trương không?"],
    ["B", "恰恰相反。风格很含蓄。", "Qiàqià xiāngfǎn. Fēnggé hěn hánxù.", "Đúng ngược lại. Phong cách rất hàm súc."],
    ["A", "论证严谨吗？", "Lùnzhèng yánjǐn ma?", "Lập luận nghiêm cẩn không?"],
    ["B", "严谨，立场也鲜明。", "Yánjǐn, lìchǎng yě xiānmíng.", "Nghiêm cẩn, lập trường cũng rõ."],
  ], [
    ["Tự viết: Lập luận phải nghiêm cẩn.", "论证必须严谨。"],
    ["Tự viết: Đúng ngược lại.", "恰恰相反。"],
  ], "Nói nghiêm cẩn, hàm súc, khoa trương và đúng ngược lại.", "你觉得文章夸张吗？"),

  mk(313, "Xuất bản", "learn", [
    ["草稿", "cǎogǎo", "Bản nháp", "这只是草稿。", "Zhè zhǐ shì cǎogǎo.", "Đây chỉ là bản nháp."],
    ["修改", "xiūgǎi", "Sửa", "还要修改几次。", "Hái yào xiūgǎi jǐ cì.", "Còn phải sửa vài lần."],
    ["发表", "fābiǎo", "Đăng / công bố", "下周可以发表。", "Xià zhōu kěyǐ fābiǎo.", "Tuần sau có thể đăng."],
    ["读者", "dúzhě", "Bạn đọc", "读者会有共鸣。", "Dúzhě huì yǒu gòngmíng.", "Bạn đọc sẽ có sự đồng cảm."],
    ["共鸣", "gòngmíng", "Sự đồng cảm", "引起广泛共鸣。", "Yǐnqǐ guǎngfàn gòngmíng.", "Gây đồng cảm rộng."],
  ], ["引起 + 共鸣", "引起 + 共鸣", "引起共鸣: gây sự đồng cảm.", [
    ["Dịch: Đây chỉ là bản nháp.", "这只是草稿。"],
    ["Dịch: Còn phải sửa vài lần.", "还要修改几次。"],
    ["Dịch: Tuần sau có thể đăng.", "下周可以发表。"],
    ["Dịch: Gây đồng cảm rộng.", "引起广泛共鸣。"],
  ]], [
    ["A", "草稿什么时候发表？", "Cǎogǎo shénme shíhou fābiǎo?", "Bản nháp khi nào đăng?"],
    ["B", "修改以后。希望引起读者共鸣。", "Xiūgǎi yǐhòu. Xīwàng yǐnqǐ dúzhě gòngmíng.", "Sau khi sửa. Mong gây đồng cảm nơi bạn đọc."],
    ["A", "与其现在发表，不如再改。", "Yǔqí xiànzài fābiǎo, bùrú zài gǎi.", "Thà đăng giờ, chẳng bằng sửa thêm."],
    ["B", "对。严谨比快更重要。", "Duì. Yánjǐn bǐ kuài gèng zhòngyào.", "Đúng. Nghiêm cẩn hơn tốc độ."],
  ], [
    ["Tự viết: Đây chỉ là bản nháp.", "这只是草稿。"],
    ["Tự viết: Gây đồng cảm rộng.", "引起广泛共鸣。"],
  ], "Nói bản nháp, sửa, đăng và đồng cảm bạn đọc.", "草稿什么时候发表？"),

  mk(314, "Tổng hợp văn học", "review", [
    ["散文", "sǎnwén", "Tản văn (ôn)", "读散文。", "Dú sǎnwén.", "Đọc tản văn."],
    ["情节", "qíngjié", "Cốt truyện (ôn)", "分析情节。", "Fēnxī qíngjié.", "Phân tích cốt truyện."],
    ["论证", "lùnzhèng", "Lập luận (ôn)", "进行论证。", "Jìnxíng lùnzhèng.", "Tiến hành lập luận."],
    ["恰恰", "qiàqià", "Đúng / vừa khéo (ôn)", "恰恰相反。", "Qiàqià xiāngfǎn.", "Đúng ngược lại."],
    ["共鸣", "gòngmíng", "Đồng cảm (ôn)", "引起共鸣。", "Yǐnqǐ gòngmíng.", "Gây đồng cảm."],
  ], ["与其说 / 恰恰", "与其说…不如说… / 恰恰相反", "Ôn tuần 45: chẳng bằng nói là, đúng ngược lại.", [
    ["Dịch: Đọc tản văn.", "读散文。"],
    ["Dịch: Phân tích cốt truyện.", "分析情节。"],
    ["Dịch: Đúng ngược lại.", "恰恰相反。"],
    ["Dịch: Gây đồng cảm.", "引起共鸣。"],
  ]], [
    ["A", "与其说这是小说，不如说是散文。", "Yǔqí shuō zhè shì xiǎoshuō, bùrú shuō shì sǎnwén.", "Thà nói đây là tiểu thuyết, chẳng bằng nói là tản văn."],
    ["B", "恰恰相反，情节更像小说。", "Qiàqià xiāngfǎn, qíngjié gèng xiàng xiǎoshuō.", "Đúng ngược lại, cốt truyện giống tiểu thuyết hơn."],
    ["A", "论证严谨吗？", "Lùnzhèng yánjǐn ma?", "Lập luận nghiêm cẩn không?"],
    ["B", "严谨，也能引起共鸣。", "Yánjǐn, yě néng yǐnqǐ gòngmíng.", "Nghiêm cẩn, cũng gây được đồng cảm."],
  ], [
    ["Tự viết: Đúng ngược lại.", "恰恰相反。"],
    ["Tự viết: Gây đồng cảm.", "引起共鸣。"],
  ], "Tổng hợp tuần văn học: tản văn, lập luận, đồng cảm.", "与其说这是小说，不如说是散文。"),

  mk(315, "Biên tập vs tác giả", "review", [
    ["修辞", "xiūcí", "Tu từ (ôn)", "改修辞。", "Gǎi xiūcí.", "Sửa tu từ."],
    ["见解", "jiànjiě", "Kiến giải (ôn)", "保留见解。", "Bǎoliú jiànjiě.", "Giữ kiến giải."],
    ["草稿", "cǎogǎo", "Bản nháp (ôn)", "交草稿。", "Jiāo cǎogǎo.", "Nộp bản nháp."],
    ["修改", "xiūgǎi", "Sửa (ôn)", "再修改。", "Zài xiūgǎi.", "Sửa thêm."],
    ["读者", "dúzhě", "Bạn đọc (ôn)", "为读者写。", "Wèi dúzhě xiě.", "Viết cho bạn đọc."],
  ], ["Chỉ văn học", "评述 / 恰恰 / 发表", "Roleplay biên tập vs tác giả. Khoá từ đến tuần 45.", [
    ["Dịch: Sửa tu từ.", "改修辞。"],
    ["Dịch: Giữ kiến giải.", "保留见解。"],
    ["Dịch: Nộp bản nháp.", "交草稿。"],
    ["Dịch: Viết cho bạn đọc.", "为读者写。"],
  ]], [
    ["A", "草稿的修辞有点夸张。", "Cǎogǎo de xiūcí yǒudiǎn kuāzhāng.", "Tu từ bản nháp hơi khoa trương."],
    ["B", "恰恰相反，我想写得含蓄。", "Qiàqià xiāngfǎn, wǒ xiǎng xiě de hánxù.", "Đúng ngược lại, tôi muốn viết hàm súc."],
    ["A", "见解可以保留，请再修改。", "Jiànjiě kěyǐ bǎoliú, qǐng zài xiūgǎi.", "Kiến giải có thể giữ, xin sửa thêm."],
    ["B", "好。修改以后再发表给读者。", "Hǎo. Xiūgǎi yǐhòu zài fābiǎo gěi dúzhě.", "Được. Sửa xong rồi đăng cho bạn đọc."],
  ], [
    ["Tự viết: Tu từ hơi khoa trương.", "修辞有点夸张。"],
    ["Tự viết: Xin sửa thêm rồi đăng.", "请再修改，然后发表。"],
  ], "Biên tập góp ý tu từ; tác giả giữ kiến giải và sửa bản nháp.", "草稿的修辞有点夸张。"),

  mk(316, "Trí tuệ nhân tạo", "learn", [
    ["智能", "zhìnéng", "Thông minh (AI)", "智能技术发展很快。", "Zhìnéng jìshù fāzhǎn hěn kuài.", "Công nghệ thông minh phát triển nhanh."],
    ["算法", "suànfǎ", "Thuật toán", "算法决定结果。", "Suànfǎ juédìng jiéguǒ.", "Thuật toán quyết định kết quả."],
    ["虚拟", "xūnǐ", "Ảo / ảo hóa", "这是虚拟世界。", "Zhè shì xūnǐ shìjiè.", "Đây là thế giới ảo."],
    ["隐私", "yǐnsī", "Quyền riêng tư", "要保护隐私。", "Yào bǎohù yǐnsī.", "Phải bảo vệ quyền riêng tư."],
    ["黑客", "hēikè", "Hacker", "小心黑客。", "Xiǎoxīn hēikè.", "Cẩn thận hacker."],
  ], ["保护 + 隐私", "保护 + 隐私", "保护隐私: bảo vệ quyền riêng tư.", [
    ["Dịch: Công nghệ thông minh phát triển nhanh.", "智能技术发展很快。"],
    ["Dịch: Thuật toán quyết định kết quả.", "算法决定结果。"],
    ["Dịch: Đây là thế giới ảo.", "这是虚拟世界。"],
    ["Dịch: Phải bảo vệ quyền riêng tư.", "要保护隐私。"],
  ]], [
    ["A", "智能算法会伤害隐私吗？", "Zhìnéng suànfǎ huì shānghài yǐnsī ma?", "Thuật toán thông minh có hại quyền riêng tư không?"],
    ["B", "会。虚拟世界里还有黑客。", "Huì. Xūnǐ shìjiè lǐ hái yǒu hēikè.", "Có. Trong thế giới ảo còn có hacker."],
    ["A", "那怎么保护？", "Nà zěnme bǎohù?", "Thế bảo vệ thế nào?"],
    ["B", "先保护隐私，再监督算法。", "Xiān bǎohù yǐnsī, zài jiāndū suànfǎ.", "Trước bảo vệ quyền riêng tư, rồi giám sát thuật toán."],
  ], [
    ["Tự viết: Phải bảo vệ quyền riêng tư.", "要保护隐私。"],
    ["Tự viết: Cẩn thận hacker.", "小心黑客。"],
  ], "Nói AI, thuật toán, thế giới ảo và quyền riêng tư.", "智能算法会伤害隐私吗？"),

  mk(317, "Bảo mật", "learn", [
    ["监控", "jiānkòng", "Giám sát (kỹ thuật)", "平台在监控数据。", "Píngtái zài jiānkòng shùjù.", "Nền tảng đang giám sát dữ liệu."],
    ["泄露", "xièlòu", "Rò rỉ", "防止隐私泄露。", "Fángzhǐ yǐnsī xièlòu.", "Ngăn rò rỉ quyền riêng tư."],
    ["加密", "jiāmì", "Mã hóa", "信息已经加密。", "Xìnxī yǐjīng jiāmì.", "Thông tin đã mã hóa."],
    ["漏洞", "lòudòng", "Lỗ hổng", "系统有漏洞。", "Xìtǒng yǒu lòudòng.", "Hệ thống có lỗ hổng."],
    ["平台", "píngtái", "Nền tảng", "这个平台很大。", "Zhège píngtái hěn dà.", "Nền tảng này rất lớn."],
  ], ["防止 + 泄露", "防止 + 泄露", "防止泄露: ngăn rò rỉ.", [
    ["Dịch: Nền tảng đang giám sát dữ liệu.", "平台在监控数据。"],
    ["Dịch: Ngăn rò rỉ quyền riêng tư.", "防止隐私泄露。"],
    ["Dịch: Thông tin đã mã hóa.", "信息已经加密。"],
    ["Dịch: Hệ thống có lỗ hổng.", "系统有漏洞。"],
  ]], [
    ["A", "平台怎么防止泄露？", "Píngtái zěnme fángzhǐ xièlòu?", "Nền tảng ngăn rò rỉ thế nào?"],
    ["B", "加密，同时修补漏洞。", "Jiāmì, tóngshí xiūbǔ lòudòng.", "Mã hóa, đồng thời vá lỗ hổng."],
    ["A", "监控会不会太多？", "Jiānkòng huì bú huì tài duō?", "Giám sát có quá nhiều không?"],
    ["B", "要平衡。隐私仍然重要。", "Yào pínghéng. Yǐnsī réngrán zhòngyào.", "Phải cân bằng. Quyền riêng tư vẫn quan trọng."],
  ], [
    ["Tự viết: Ngăn rò rỉ quyền riêng tư.", "防止隐私泄露。"],
    ["Tự viết: Hệ thống có lỗ hổng.", "系统有漏洞。"],
  ], "Nói giám sát, rò rỉ, mã hóa và lỗ hổng.", "平台怎么防止泄露？"),

  mk(318, "Tự động hóa", "learn", [
    ["自动化", "zìdònghuà", "Tự động hóa", "工厂在自动化。", "Gōngchǎng zài zìdònghuà.", "Nhà máy đang tự động hóa."],
    ["机器人", "jīqìrén", "Robot", "机器人代替工人。", "Jīqìrén dàitì gōngrén.", "Robot thay công nhân."],
    ["替代", "tìdài", "Thay thế", "技术替代人力。", "Jìshù tìdài rénlì.", "Công nghệ thay sức người."],
    ["失业", "shīyè", "Thất nghiệp", "有人担心失业。", "Yǒu rén dānxīn shīyè.", "Có người lo thất nghiệp."],
    ["宁可", "nìngkě", "Thà… còn hơn", "我宁可慢，也不出错。", "Wǒ nìngkě màn, yě bù chūcuò.", "Tôi thà chậm còn hơn sai."],
  ], ["宁可…也不…", "宁可 A，也不 B", "Thà A chứ không B. 宁可学习，也不失业.", [
    ["Dịch: Nhà máy đang tự động hóa.", "工厂在自动化。"],
    ["Dịch: Robot thay công nhân.", "机器人代替工人。"],
    ["Dịch: Có người lo thất nghiệp.", "有人担心失业。"],
    ["Dịch: Tôi thà chậm còn hơn sai.", "我宁可慢，也不出错。"],
  ]], [
    ["A", "自动化会让人失业吗？", "Zìdònghuà huì ràng rén shīyè ma?", "Tự động hóa có khiến người thất nghiệp không?"],
    ["B", "会替代一部分。机器人越来越多。", "Huì tìdài yí bùfen. Jīqìrén yuè lái yuè duō.", "Sẽ thay một phần. Robot ngày càng nhiều."],
    ["A", "那你怎么办？", "Nà nǐ zěnme bàn?", "Thế bạn làm sao?"],
    ["B", "我宁可学习新技术，也不等待失业。", "Wǒ nìngkě xuéxí xīn jìshù, yě bù děngdài shīyè.", "Tôi thà học kỹ thuật mới còn hơn chờ thất nghiệp."],
  ], [
    ["Tự viết: Robot thay công nhân.", "机器人代替工人。"],
    ["Tự viết: Tôi thà chậm còn hơn sai.", "我宁可慢，也不出错。"],
  ], "Nói tự động hóa, robot thay người và thà… không…", "自动化会让人失业吗？"),

  mk(319, "Toàn cầu hóa", "learn", [
    ["全球化", "quánqiúhuà", "Toàn cầu hóa", "全球化改变市场。", "Quánqiúhuà gǎibiàn shìchǎng.", "Toàn cầu hóa thay đổi thị trường."],
    ["产业链", "chǎnyèliàn", "Chuỗi ngành", "产业链很长。", "Chǎnyèliàn hěn cháng.", "Chuỗi ngành rất dài."],
    ["外包", "wàibāo", "Thuê ngoài", "公司把工作外包。", "Gōngsī bǎ gōngzuò wàibāo.", "Công ty thuê ngoài công việc."],
    ["垄断", "lǒngduàn", "Độc quyền", "反对市场垄断。", "Fǎnduì shìchǎng lǒngduàn.", "Chống độc quyền thị trường."],
    ["转型", "zhuǎnxíng", "Chuyển đổi mô hình", "企业必须转型。", "Qǐyè bìxū zhuǎnxíng.", "Doanh nghiệp phải chuyển đổi."],
  ], ["随着 + 全球化", "随着 + 全球化，…", "随着全球化: theo đà toàn cầu hóa.", [
    ["Dịch: Toàn cầu hóa thay đổi thị trường.", "全球化改变市场。"],
    ["Dịch: Chuỗi ngành rất dài.", "产业链很长。"],
    ["Dịch: Công ty thuê ngoài công việc.", "公司把工作外包。"],
    ["Dịch: Doanh nghiệp phải chuyển đổi.", "企业必须转型。"],
  ]], [
    ["A", "随着全球化，产业链怎么变？", "Suízhe quánqiúhuà, chǎnyèliàn zěnme biàn?", "Theo đà toàn cầu hóa, chuỗi ngành đổi thế nào?"],
    ["B", "更长，外包也更多。", "Gèng cháng, wàibāo yě gèng duō.", "Dài hơn, thuê ngoài cũng nhiều hơn."],
    ["A", "会不会垄断？", "Huì bú huì lǒngduàn?", "Có độc quyền không?"],
    ["B", "有风险。所以企业要转型。", "Yǒu fēngxiǎn. Suǒyǐ qǐyè yào zhuǎnxíng.", "Có rủi ro. Vì vậy doanh nghiệp phải chuyển đổi."],
  ], [
    ["Tự viết: Toàn cầu hóa thay đổi thị trường.", "全球化改变市场。"],
    ["Tự viết: Doanh nghiệp phải chuyển đổi.", "企业必须转型。"],
  ], "Nói toàn cầu hóa, chuỗi ngành, thuê ngoài và chuyển đổi.", "随着全球化，产业链怎么变？"),

  mk(320, "Công bằng xã hội", "learn", [
    ["贫困", "pínkùn", "Nghèo đói", "减少贫困。", "Jiǎnshǎo pínkùn.", "Giảm nghèo đói."],
    ["差距", "chājù", "Khoảng cách", "收入差距很大。", "Shōurù chājù hěn dà.", "Khoảng cách thu nhập rất lớn."],
    ["公平", "gōngpíng", "Công bằng", "机会应该公平。", "Jīhuì yīnggāi gōngpíng.", "Cơ hội nên công bằng."],
    ["福利", "fúlì", "Phúc lợi", "提高社会福利。", "Tígāo shèhuì fúlì.", "Tăng phúc lợi xã hội."],
    ["保障", "bǎozhàng", "Bảo đảm", "生活要有保障。", "Shēnghuó yào yǒu bǎozhàng.", "Cuộc sống phải có bảo đảm."],
  ], ["缩小 + 差距", "缩小 + 差距", "缩小差距: thu hẹp khoảng cách.", [
    ["Dịch: Giảm nghèo đói.", "减少贫困。"],
    ["Dịch: Khoảng cách thu nhập rất lớn.", "收入差距很大。"],
    ["Dịch: Cơ hội nên công bằng.", "机会应该公平。"],
    ["Dịch: Cuộc sống phải có bảo đảm.", "生活要有保障。"],
  ]], [
    ["A", "怎么缩小收入差距？", "Zěnme suōxiǎo shōurù chājù?", "Làm sao thu hẹp khoảng cách thu nhập?"],
    ["B", "提高福利，给贫困家庭保障。", "Tígāo fúlì, gěi pínkùn jiātíng bǎozhàng.", "Tăng phúc lợi, bảo đảm cho gia đình nghèo."],
    ["A", "这样公平吗？", "Zhèyàng gōngpíng ma?", "Như vậy công bằng không?"],
    ["B", "比现在公平。机会也会多一些。", "Bǐ xiànzài gōngpíng. Jīhuì yě huì duō yìxiē.", "Công bằng hơn hiện nay. Cơ hội cũng nhiều hơn."],
  ], [
    ["Tự viết: Giảm nghèo đói.", "减少贫困。"],
    ["Tự viết: Cơ hội nên công bằng.", "机会应该公平。"],
  ], "Nói nghèo đói, khoảng cách, phúc lợi và bảo đảm.", "怎么缩小收入差距？"),

  mk(321, "Tổng hợp công nghệ", "review", [
    ["智能", "zhìnéng", "Thông minh (ôn)", "智能技术。", "Zhìnéng jìshù.", "Công nghệ thông minh."],
    ["隐私", "yǐnsī", "Quyền riêng tư (ôn)", "保护隐私。", "Bǎohù yǐnsī.", "Bảo vệ quyền riêng tư."],
    ["宁可", "nìngkě", "Thà… (ôn)", "宁可学习。", "Nìngkě xuéxí.", "Thà học."],
    ["转型", "zhuǎnxíng", "Chuyển đổi (ôn)", "企业转型。", "Qǐyè zhuǎnxíng.", "Doanh nghiệp chuyển đổi."],
    ["公平", "gōngpíng", "Công bằng (ôn)", "机会公平。", "Jīhuì gōngpíng.", "Cơ hội công bằng."],
  ], ["宁可 / 替代", "宁可…也不… / 替代", "Ôn tuần 46: thà… không…, thay thế.", [
    ["Dịch: Bảo vệ quyền riêng tư.", "保护隐私。"],
    ["Dịch: Thà học.", "宁可学习。"],
    ["Dịch: Doanh nghiệp chuyển đổi.", "企业转型。"],
    ["Dịch: Cơ hội công bằng.", "机会公平。"],
  ]], [
    ["A", "智能会替代很多人吗？", "Zhìnéng huì tìdài hěn duō rén ma?", "AI sẽ thay nhiều người không?"],
    ["B", "会。我宁可转型，也不等待失业。", "Huì. Wǒ nìngkě zhuǎnxíng, yě bù děngdài shīyè.", "Sẽ. Tôi thà chuyển đổi còn hơn chờ thất nghiệp."],
    ["A", "隐私和公平呢？", "Yǐnsī hé gōngpíng ne?", "Còn quyền riêng tư và công bằng?"],
    ["B", "都要保障。差距不能再大。", "Dōu yào bǎozhàng. Chājù bù néng zài dà.", "Đều phải bảo đảm. Khoảng cách không thể lớn thêm."],
  ], [
    ["Tự viết: Bảo vệ quyền riêng tư.", "保护隐私。"],
    ["Tự viết: Tôi thà chuyển đổi còn hơn thất nghiệp.", "我宁可转型，也不失业。"],
  ], "Tổng hợp tuần công nghệ: AI, việc làm, công bằng.", "智能会替代很多人吗？"),

  mk(322, "Kỹ sư vs nhà hoạch định", "review", [
    ["算法", "suànfǎ", "Thuật toán (ôn)", "改进算法。", "Gǎijìn suànfǎ.", "Cải tiến thuật toán."],
    ["加密", "jiāmì", "Mã hóa (ôn)", "数据加密。", "Shùjù jiāmì.", "Mã hóa dữ liệu."],
    ["机器人", "jīqìrén", "Robot (ôn)", "使用机器人。", "Shǐyòng jīqìrén.", "Dùng robot."],
    ["垄断", "lǒngduàn", "Độc quyền (ôn)", "防止垄断。", "Fángzhǐ lǒngduàn.", "Ngăn độc quyền."],
    ["保障", "bǎozhàng", "Bảo đảm (ôn)", "社会保障。", "Shèhuì bǎozhàng.", "Bảo đảm xã hội."],
  ], ["Chỉ công nghệ", "宁可 / 替代 / 隐私", "Roleplay kỹ sư vs nhà hoạch định. Khoá từ đến tuần 46.", [
    ["Dịch: Cải tiến thuật toán.", "改进算法。"],
    ["Dịch: Mã hóa dữ liệu.", "数据加密。"],
    ["Dịch: Ngăn độc quyền.", "防止垄断。"],
    ["Dịch: Bảo đảm xã hội.", "社会保障。"],
  ]], [
    ["A", "算法会不会泄露隐私？", "Suànfǎ huì bú huì xièlòu yǐnsī?", "Thuật toán có rò rỉ quyền riêng tư không?"],
    ["B", "会加密。宁可慢，也不出漏洞。", "Huì jiāmì. Nìngkě màn, yě bù chū lòudòng.", "Sẽ mã hóa. Thà chậm còn hơn có lỗ hổng."],
    ["A", "机器人替代工人以后，如何保障公平？", "Jīqìrén tìdài gōngrén yǐhòu, rúhé bǎozhàng gōngpíng?", "Robot thay công nhân rồi, bảo đảm công bằng thế nào?"],
    ["B", "防止垄断，提高福利。", "Fángzhǐ lǒngduàn, tígāo fúlì.", "Ngăn độc quyền, tăng phúc lợi."],
  ], [
    ["Tự viết: Mã hóa dữ liệu.", "数据加密。"],
    ["Tự viết: Ngăn độc quyền, tăng phúc lợi.", "防止垄断，提高福利。"],
  ], "Kỹ sư nói mã hóa; nhà hoạch định hỏi công bằng sau tự động hóa.", "算法会不会泄露隐私？"),

  mk(323, "即便 / 纵然", "learn", [
    ["即便", "jíbiàn", "Dù cho", "即便很难，也要做。", "Jíbiàn hěn nán, yě yào zuò.", "Dù khó vẫn phải làm."],
    ["未免", "wèimiǎn", "Thật sự hơi…", "这样未免太快。", "Zhèyàng wèimiǎn tài kuài.", "Như vậy thật sự hơi nhanh."],
    ["岂", "qǐ", "Há / lẽ nào", "岂能放弃？", "Qǐ néng fàngqì?", "Há có thể bỏ?"],
    ["纵然", "zòngrán", "Dù rằng", "纵然失败，也不后悔。", "Zòngrán shībài, yě bù hòuhuǐ.", "Dù thất bại cũng không hối."],
    ["譬如", "pìrú", "Ví như", "譬如保护隐私。", "Pìrú bǎohù yǐnsī.", "Ví như bảo vệ quyền riêng tư."],
  ], ["即便…也…", "即便 / 纵然 + …，也…", "Dù… vẫn…. 即便很难，也要做.", [
    ["Dịch: Dù khó vẫn phải làm.", "即便很难，也要做。"],
    ["Dịch: Như vậy thật sự hơi nhanh.", "这样未免太快。"],
    ["Dịch: Há có thể bỏ?", "岂能放弃？"],
    ["Dịch: Dù thất bại cũng không hối.", "纵然失败，也不后悔。"],
  ]], [
    ["A", "即便局势紧张，也要谈判吗？", "Jíbiàn júshì jǐnzhāng, yě yào tánpàn ma?", "Dù cục diện căng vẫn phải đàm phán à?"],
    ["B", "对。岂能放弃和平？", "Duì. Qǐ néng fàngqì hépíng?", "Đúng. Há có thể bỏ hòa bình?"],
    ["A", "这样未免太理想吧？", "Zhèyàng wèimiǎn tài lǐxiǎng ba?", "Như vậy thật sự hơi lý tưởng phải không?"],
    ["B", "纵然很难，譬如裁军，也值得。", "Zòngrán hěn nán, pìrú cáijūn, yě zhídé.", "Dù khó, ví như giảm quân bị, cũng đáng."],
  ], [
    ["Tự viết: Dù khó vẫn phải làm.", "即便很难，也要做。"],
    ["Tự viết: Há có thể bỏ?", "岂能放弃？"],
  ], "Dùng 即便, 纵然, 岂, 未免 để tranh luận.", "即便局势紧张，也要谈判吗？"),

  mk(324, "岂止 / 况且", "learn", [
    ["何尝", "hécháng", "Chẳng phải là… sao", "我何尝不想？", "Wǒ hécháng bù xiǎng?", "Tôi chẳng phải không muốn sao?"],
    ["未尝", "wèicháng", "Chưa hẳn không", "这未尝不是好事。", "Zhè wèicháng bú shì hǎoshì.", "Đây chưa hẳn không phải việc tốt."],
    ["岂止", "qǐzhǐ", "Há chỉ", "岂止是技术问题。", "Qǐzhǐ shì jìshù wèntí.", "Há chỉ là vấn đề kỹ thuật."],
    ["况且", "kuàngqiě", "Huống chi", "况且还要公平。", "Kuàngqiě hái yào gōngpíng.", "Huống chi còn cần công bằng."],
    ["若是", "ruòshì", "Nếu như", "若是泄露，就麻烦了。", "Ruòshì xièlòu, jiù máfan le.", "Nếu rò rỉ thì rắc rối."],
  ], ["岂止 / 况且", "岂止…，况且…", "Há chỉ…, huống chi…. 岂止失业，况且差距更大.", [
    ["Dịch: Tôi chẳng phải không muốn sao?", "我何尝不想？"],
    ["Dịch: Đây chưa hẳn không phải việc tốt.", "这未尝不是好事。"],
    ["Dịch: Há chỉ là vấn đề kỹ thuật.", "岂止是技术问题。"],
    ["Dịch: Huống chi còn cần công bằng.", "况且还要公平。"],
  ]], [
    ["A", "自动化只是技术问题吗？", "Zìdònghuà zhǐ shì jìshù wèntí ma?", "Tự động hóa chỉ là vấn đề kỹ thuật à?"],
    ["B", "岂止是技术。况且还有失业。", "Qǐzhǐ shì jìshù. Kuàngqiě hái yǒu shīyè.", "Há chỉ kỹ thuật. Huống chi còn thất nghiệp."],
    ["A", "若是转型呢？", "Ruòshì zhuǎnxíng ne?", "Nếu chuyển đổi thì sao?"],
    ["B", "我何尝不想。这未尝不是机会。", "Wǒ hécháng bù xiǎng. Zhè wèicháng bú shì jīhuì.", "Tôi chẳng phải không muốn. Đây chưa hẳn không phải cơ hội."],
  ], [
    ["Tự viết: Há chỉ là vấn đề kỹ thuật.", "岂止是技术问题。"],
    ["Tự viết: Huống chi còn cần công bằng.", "况且还要公平。"],
  ], "Dùng 岂止, 况且, 何尝, 若是 để bổ sung lập luận.", "自动化只是技术问题吗？"),

  mk(325, "Liên kết luận", "learn", [
    ["换言之", "huànyánzhī", "Nói cách khác", "换言之，要公正。", "Huànyánzhī, yào gōngzhèng.", "Nói cách khác, phải công chính."],
    ["综上所述", "zōngshàngsuǒshù", "Tóm lại những điều trên", "综上所述，应当改革。", "Zōngshàngsuǒshù, yīngdāng gǎigé.", "Tóm lại như trên, nên cải cách."],
    ["由此可见", "yóucǐkějiàn", "Từ đó có thể thấy", "由此可见问题的本质。", "Yóucǐkějiàn wèntí de běnzhì.", "Từ đó thấy bản chất vấn đề."],
    ["总而言之", "zǒngéryánzhī", "Tóm lại", "总而言之，不能放弃。", "Zǒngéryánzhī, bù néng fàngqì.", "Tóm lại, không thể bỏ."],
    ["姑且", "gūqiě", "Tạm thời", "我们姑且先这样。", "Wǒmen gūqiě xiān zhèyàng.", "Chúng ta tạm thời làm vậy đã."],
  ], ["综上所述", "综上所述 / 换言之 / 由此可见", "Liên kết đoạn luận: tóm lại, nói cách khác, từ đó thấy.", [
    ["Dịch: Nói cách khác, phải công chính.", "换言之，要公正。"],
    ["Dịch: Tóm lại như trên, nên cải cách.", "综上所述，应当改革。"],
    ["Dịch: Từ đó thấy bản chất vấn đề.", "由此可见问题的本质。"],
    ["Dịch: Tóm lại, không thể bỏ.", "总而言之，不能放弃。"],
  ]], [
    ["A", "综上所述，智能会替代人力吗？", "Zōngshàngsuǒshù, zhìnéng huì tìdài rénlì ma?", "Tóm lại như trên, AI sẽ thay sức người không?"],
    ["B", "由此可见会替代一部分。", "Yóucǐkějiàn huì tìdài yí bùfen.", "Từ đó thấy sẽ thay một phần."],
    ["A", "换言之，我们该怎么办？", "Huànyánzhī, wǒmen gāi zěnme bàn?", "Nói cách khác, chúng ta nên làm sao?"],
    ["B", "总而言之，姑且先学习转型。", "Zǒngéryánzhī, gūqiě xiān xuéxí zhuǎnxíng.", "Tóm lại, tạm thời học chuyển đổi đã."],
  ], [
    ["Tự viết: Nói cách khác, phải công chính.", "换言之，要公正。"],
    ["Tự viết: Tóm lại, không thể bỏ.", "总而言之，不能放弃。"],
  ], "Dùng 综上所述, 换言之, 由此可见 để tóm tắt luận.", "综上所述，智能会替代人力吗？"),

  mk(326, "Sắc thái", "learn", [
    ["索性", "suǒxìng", "Đành / một mạch", "索性把话说清楚。", "Suǒxìng bǎ huà shuō qīngchu.", "Đành nói cho rõ."],
    ["偏偏", "piānpiān", "Lại cố / đúng lúc", "他偏偏不同意。", "Tā piānpiān bù tóngyì.", "Anh ấy lại cố không đồng ý."],
    ["竟然", "jìngrán", "Không ngờ", "他竟然成功了。", "Tā jìngrán chénggōng le.", "Không ngờ anh ấy thành công."],
    ["不免", "bùmiǎn", "Không tránh khỏi", "不免有点焦虑。", "Bùmiǎn yǒudiǎn jiāolǜ.", "Không tránh khỏi hơi lo âu."],
    ["终究", "zhōngjiū", "Rốt cuộc", "终究还是要面对。", "Zhōngjiū háishi yào miànduì.", "Rốt cuộc vẫn phải đối mặt."],
  ], ["竟然 / 偏偏", "竟然 / 偏偏 / 终究", "竟然: không ngờ. 偏偏: lại cố/đúng lúc. 终究: rốt cuộc.", [
    ["Dịch: Đành nói cho rõ.", "索性把话说清楚。"],
    ["Dịch: Anh ấy lại cố không đồng ý.", "他偏偏不同意。"],
    ["Dịch: Không ngờ anh ấy thành công.", "他竟然成功了。"],
    ["Dịch: Rốt cuộc vẫn phải đối mặt.", "终究还是要面对。"],
  ]], [
    ["A", "谈判竟然失败了？", "Tánpàn jìngrán shībài le?", "Không ngờ đàm phán thất bại à?"],
    ["B", "对。对方偏偏不愿妥协。", "Duì. Duìfāng piānpiān bú yuàn tuǒxié.", "Đúng. Đối phương lại cố không chịu thỏa hiệp."],
    ["A", "那不免让人焦虑。", "Nà bùmiǎn ràng rén jiāolǜ.", "Thế thì không tránh khỏi lo âu."],
    ["B", "终究还要继续。索性把立场说清楚。", "Zhōngjiū hái yào jìxù. Suǒxìng bǎ lìchǎng shuō qīngchu.", "Rốt cuộc vẫn phải tiếp. Đành nói rõ lập trường."],
  ], [
    ["Tự viết: Không ngờ anh ấy thành công.", "他竟然成功了。"],
    ["Tự viết: Rốt cuộc vẫn phải đối mặt.", "终究还是要面对。"],
  ], "Dùng 竟然, 偏偏, 终究, 不免 để nói sắc thái.", "谈判竟然失败了？"),

  mk(327, "尚且 / 固然", "learn", [
    ["尚且", "shàngqiě", "Còn… huống chi", "专家尚且失败，何况我。", "Zhuānjiā shàngqiě shībài, hékuàng wǒ.", "Chuyên gia còn thất bại, huống chi tôi."],
    ["反之", "fǎnzhī", "Ngược lại", "反之会更危险。", "Fǎnzhī huì gèng wēixiǎn.", "Ngược lại sẽ nguy hơn."],
    ["进而", "jìn'ér", "Tiến mà / từ đó", "先学习，进而转型。", "Xiān xuéxí, jìn'ér zhuǎnxíng.", "Trước học, từ đó chuyển đổi."],
    ["无奈", "wúnài", "Đành chịu / bất lực", "我也感到无奈。", "Wǒ yě gǎndào wúnài.", "Tôi cũng cảm thấy bất lực."],
    ["固然", "gùrán", "Cố nhiên / quả là", "固然有风险，但是值得。", "Gùrán yǒu fēngxiǎn, dànshì zhídé.", "Quả là có rủi ro, nhưng đáng."],
  ], ["固然…但是…", "固然…，但是 / 尚且…何况", "固然: thừa nhận rồi phản bác. 尚且: còn… huống chi.", [
    ["Dịch: Chuyên gia còn thất bại, huống chi tôi.", "专家尚且失败，何况我。"],
    ["Dịch: Ngược lại sẽ nguy hơn.", "反之会更危险。"],
    ["Dịch: Tôi cũng cảm thấy bất lực.", "我也感到无奈。"],
    ["Dịch: Quả là có rủi ro, nhưng đáng.", "固然有风险，但是值得。"],
  ]], [
    ["A", "智能固然方便，但是公平呢？", "Zhìnéng gùrán fāngbiàn, dànshì gōngpíng ne?", "AI quả tiện, nhưng công bằng thì sao?"],
    ["B", "专家尚且担心失业，何况工人。", "Zhuānjiā shàngqiě dānxīn shīyè, hékuàng gōngrén.", "Chuyên gia còn lo thất nghiệp, huống chi công nhân."],
    ["A", "反之不管它？", "Fǎnzhī bù guǎn tā?", "Ngược lại không quản nó à?"],
    ["B", "不行。我也很无奈，还是要进而改革。", "Bù xíng. Wǒ yě hěn wúnài, háishì yào jìn'ér gǎigé.", "Không được. Tôi cũng bất lực, vẫn phải tiến tới cải cách."],
  ], [
    ["Tự viết: Quả là có rủi ro, nhưng đáng.", "固然有风险，但是值得。"],
    ["Tự viết: Tôi cũng cảm thấy bất lực.", "我也感到无奈。"],
  ], "Dùng 固然, 尚且, 反之, 无奈 để thừa nhận rồi phản bác.", "智能固然方便，但是公平呢？"),

  mk(328, "Tổng hợp ngữ pháp", "review", [
    ["即便", "jíbiàn", "Dù cho (ôn)", "即便很难。", "Jíbiàn hěn nán.", "Dù khó."],
    ["况且", "kuàngqiě", "Huống chi (ôn)", "况且不公平。", "Kuàngqiě bù gōngpíng.", "Huống chi không công bằng."],
    ["换言之", "huànyánzhī", "Nói cách khác (ôn)", "换言之要改。", "Huànyánzhī yào gǎi.", "Nói cách khác phải sửa."],
    ["竟然", "jìngrán", "Không ngờ (ôn)", "竟然成功。", "Jìngrán chénggōng.", "Không ngờ thành công."],
    ["固然", "gùrán", "Cố nhiên (ôn)", "固然方便。", "Gùrán fāngbiàn.", "Quả là tiện."],
  ], ["即便 / 换言之", "即便…也… / 换言之", "Ôn tuần 47: dù… vẫn…, nói cách khác.", [
    ["Dịch: Dù khó.", "即便很难。"],
    ["Dịch: Huống chi không công bằng.", "况且不公平。"],
    ["Dịch: Nói cách khác phải sửa.", "换言之要改。"],
    ["Dịch: Quả là tiện.", "固然方便。"],
  ]], [
    ["A", "即便智能方便，也要保护隐私吗？", "Jíbiàn zhìnéng fāngbiàn, yě yào bǎohù yǐnsī ma?", "Dù AI tiện vẫn phải bảo vệ quyền riêng tư à?"],
    ["B", "对。况且差距已经很大。", "Duì. Kuàngqiě chājù yǐjīng hěn dà.", "Đúng. Huống chi khoảng cách đã lớn."],
    ["A", "换言之，不能只看效率？", "Huànyánzhī, bù néng zhǐ kàn xiàolǜ?", "Nói cách khác, không thể chỉ nhìn hiệu suất?"],
    ["B", "固然要效率，但是公平更重要。", "Gùrán yào xiàolǜ, dànshì gōngpíng gèng zhòngyào.", "Quả cần hiệu suất, nhưng công bằng quan trọng hơn."],
  ], [
    ["Tự viết: Dù khó vẫn phải làm.", "即便很难，也要做。"],
    ["Tự viết: Nói cách khác phải sửa.", "换言之要改。"],
  ], "Tổng hợp mẫu luận HSK 6: 即便, 况且, 换言之, 固然.", "即便智能方便，也要保护隐私吗？"),

  mk(329, "Giải thích quyết định lớn", "review", [
    ["纵然", "zòngrán", "Dù rằng (ôn)", "纵然失败。", "Zòngrán shībài.", "Dù thất bại."],
    ["岂止", "qǐzhǐ", "Há chỉ (ôn)", "岂止如此。", "Qǐzhǐ rúcǐ.", "Há chỉ như vậy."],
    ["综上所述", "zōngshàngsuǒshù", "Tóm lại như trên (ôn)", "综上所述。", "Zōngshàngsuǒshù.", "Tóm lại như trên."],
    ["终究", "zhōngjiū", "Rốt cuộc (ôn)", "终究要面对。", "Zhōngjiū yào miànduì.", "Rốt cuộc phải đối mặt."],
    ["无奈", "wúnài", "Bất lực (ôn)", "感到无奈。", "Gǎndào wúnài.", "Cảm thấy bất lực."],
  ], ["Chỉ mẫu luận", "即便 / 综上所述 / 固然", "Roleplay giải thích quyết định lớn. Khoá từ đến tuần 47.", [
    ["Dịch: Dù thất bại.", "纵然失败。"],
    ["Dịch: Há chỉ như vậy.", "岂止如此。"],
    ["Dịch: Tóm lại như trên.", "综上所述。"],
    ["Dịch: Cảm thấy bất lực.", "感到无奈。"],
  ]], [
    ["A", "你为什么选择这个项目？", "Nǐ wèishénme xuǎnzé zhège xiàngmù?", "Vì sao bạn chọn dự án này?"],
    ["B", "综上所述，贫困差距不能再大。", "Zōngshàngsuǒshù, pínkùn chājù bù néng zài dà.", "Tóm lại như trên, khoảng cách nghèo không thể lớn thêm."],
    ["A", "纵然有人反对呢？", "Zòngrán yǒu rén fǎnduì ne?", "Dù có người phản đối thì sao?"],
    ["B", "纵然很难，终究要保障公平。岂止是福利。", "Zòngrán hěn nán, zhōngjiū yào bǎozhàng gōngpíng. Qǐzhǐ shì fúlì.", "Dù khó, rốt cuộc phải bảo đảm công bằng. Há chỉ phúc lợi."],
  ], [
    ["Tự viết: Tóm lại như trên phải cải cách.", "综上所述，应当改革。"],
    ["Tự viết: Cảm thấy bất lực cũng phải tiếp.", "感到无奈，也要继续。"],
  ], "Giải thích quyết định lớn bằng mẫu luận HSK 6.", "你为什么选择这个项目？"),

  mk(330, "Ôn luật pháp", "review", [
    ["视为", "shìwéi", "Coi là (ôn)", "将权利视为义务。", "Jiāng quánlì shìwéi yìwù.", "Coi quyền là nghĩa vụ."],
    ["鉴于", "jiànyú", "Xét rằng (ôn)", "鉴于宪法。", "Jiànyú xiànfǎ.", "Xét hiến pháp."],
    ["审判", "shěnpàn", "Xét xử (ôn)", "公正审判。", "Gōngzhèng shěnpàn.", "Xét xử công chính."],
    ["监督", "jiāndū", "Giám sát (ôn)", "公众监督。", "Gōngzhòng jiāndū.", "Công chúng giám sát."],
    ["尊严", "zūnyán", "Phẩm giá (ôn)", "维护尊严。", "Wéihù zūnyán.", "Gìn giữ phẩm giá."],
  ], ["视为 鉴于", "将…视为 / 鉴于", "Ôn luật: coi là, xét rằng.", [
    ["Dịch: Coi quyền là nghĩa vụ.", "将权利视为义务。"],
    ["Dịch: Xét hiến pháp.", "鉴于宪法。"],
    ["Dịch: Xét xử công chính.", "公正审判。"],
    ["Dịch: Gìn giữ phẩm giá.", "维护尊严。"],
  ]], [
    ["A", "鉴于这次诉讼，什么最重要？", "Jiànyú zhè cì sùsòng, shénme zuì zhòngyào?", "Xét vụ kiện này, cái gì quan trọng nhất?"],
    ["B", "将公正视为义务，维护公民尊严。", "Jiāng gōngzhèng shìwéi yìwù, wéihù gōngmín zūnyán.", "Coi công chính là nghĩa vụ, gìn giữ phẩm giá công dân."],
    ["A", "如何避免腐败？", "Rúhé bìmiǎn fǔbài?", "Làm sao tránh tham nhũng?"],
    ["B", "过程透明，公众进行监督。", "Guòchéng tòumíng, gōngzhòng jìnxíng jiāndū.", "Quá trình minh bạch, công chúng giám sát."],
  ], [
    ["Tự viết: Coi công chính là nghĩa vụ.", "将公正视为义务。"],
    ["Tự viết: Xét hiến pháp bảo vệ công dân.", "鉴于宪法保护公民。"],
  ], "Ôn quyền, xét xử, giám sát và phẩm giá.", "鉴于这次诉讼，什么最重要？"),

  mk(331, "Ôn triết học", "review", [
    ["哲学", "zhéxué", "Triết học (ôn)", "讨论哲学。", "Tǎolùn zhéxué.", "Thảo luận triết học."],
    ["无非", "wúfēi", "Chẳng qua (ôn)", "无非是选择。", "Wúfēi shì xuǎnzé.", "Chẳng qua là lựa chọn."],
    ["美德", "měidé", "Đức hạnh (ôn)", "诚实是美德。", "Chéngshí shì měidé.", "Thành thật là đức hạnh."],
    ["平等", "píngděng", "Bình đẳng (ôn)", "追求平等。", "Zhuīqiú píngděng.", "Theo đuổi bình đẳng."],
    ["境界", "jìngjiè", "Cảnh giới (ôn)", "提高境界。", "Tígāo jìngjiè.", "Nâng cảnh giới."],
  ], ["以…为 无非", "以…为… / 无非", "Ôn triết: lấy…làm…, chẳng qua.", [
    ["Dịch: Thảo luận triết học.", "讨论哲学。"],
    ["Dịch: Chẳng qua là lựa chọn.", "无非是选择。"],
    ["Dịch: Thành thật là đức hạnh.", "诚实是美德。"],
    ["Dịch: Theo đuổi bình đẳng.", "追求平等。"],
  ]], [
    ["A", "你以什么为美德？", "Nǐ yǐ shénme wéi měidé?", "Bạn lấy gì làm đức hạnh?"],
    ["B", "以诚实为美德，追求平等。", "Yǐ chéngshí wéi měidé, zhuīqiú píngděng.", "Lấy thành thật làm đức hạnh, theo đuổi bình đẳng."],
    ["A", "这属于哲学还是道德？", "Zhè shǔyú zhéxué háishi dàodé?", "Đây thuộc triết hay đạo đức?"],
    ["B", "无非是提高境界。", "Wúfēi shì tígāo jìngjiè.", "Chẳng qua là nâng cảnh giới."],
  ], [
    ["Tự viết: Lấy thành thật làm đức hạnh.", "以诚实为美德。"],
    ["Tự viết: Chẳng qua là lựa chọn.", "无非是选择。"],
  ], "Ôn triết học, đức hạnh và bình đẳng.", "你以什么为美德？"),

  mk(332, "Ôn quốc tế + sức khỏe", "review", [
    ["谈判", "tánpàn", "Đàm phán (ôn)", "进行谈判。", "Jìnxíng tánpàn.", "Tiến hành đàm phán."],
    ["以至于", "yǐzhìyú", "Đến nỗi (ôn)", "以至于危机更大。", "Yǐzhìyú wēijī gèng dà.", "Đến nỗi khủng hoảng lớn hơn."],
    ["难民", "nànmín", "Người tị nạn (ôn)", "援助难民。", "Yuánzhù nànmín.", "Viện trợ người tị nạn."],
    ["焦虑", "jiāolǜ", "Lo âu (ôn)", "缓解焦虑。", "Huǎnjiě jiāolǜ.", "Giảm lo âu."],
    ["和平", "hépíng", "Hòa bình (ôn)", "达成和平。", "Dáchéng hépíng.", "Đạt hòa bình."],
  ], ["谈判 以至于", "进行谈判 / 以至于", "Ôn quốc tế và sức khỏe.", [
    ["Dịch: Tiến hành đàm phán.", "进行谈判。"],
    ["Dịch: Đến nỗi khủng hoảng lớn hơn.", "以至于危机更大。"],
    ["Dịch: Viện trợ người tị nạn.", "援助难民。"],
    ["Dịch: Đạt hòa bình.", "达成和平。"],
  ]], [
    ["A", "冲突若不谈判，会怎样？", "Chōngtū ruò bù tánpàn, huì zěnyàng?", "Xung đột nếu không đàm phán thì sao?"],
    ["B", "以至于难民更多，全球焦虑。", "Yǐzhìyú nànmín gèng duō, quánqiú jiāolǜ.", "Đến nỗi người tị nạn nhiều hơn, cả thế giới lo âu."],
    ["A", "如何缓解？", "Rúhé huǎnjiě?", "Làm sao giảm?"],
    ["B", "先达成和平，再给予庇护。", "Xiān dáchéng hépíng, zài jǐyǔ bìhù.", "Trước đạt hòa bình, rồi cho tị nạn."],
  ], [
    ["Tự viết: Tiến hành đàm phán.", "进行谈判。"],
    ["Tự viết: Đến nỗi người tị nạn nhiều hơn.", "以至于难民更多。"],
  ], "Ôn đàm phán, tị nạn, lo âu và hòa bình.", "冲突若不谈判，会怎样？"),

  mk(333, "Ôn văn học + công nghệ", "review", [
    ["恰恰", "qiàqià", "Đúng / vừa khéo (ôn)", "恰恰相反。", "Qiàqià xiāngfǎn.", "Đúng ngược lại."],
    ["宁可", "nìngkě", "Thà… (ôn)", "宁可学习。", "Nìngkě xuéxí.", "Thà học."],
    ["论证", "lùnzhèng", "Lập luận (ôn)", "严谨论证。", "Yánjǐn lùnzhèng.", "Lập luận nghiêm cẩn."],
    ["隐私", "yǐnsī", "Quyền riêng tư (ôn)", "保护隐私。", "Bǎohù yǐnsī.", "Bảo vệ quyền riêng tư."],
    ["共鸣", "gòngmíng", "Đồng cảm (ôn)", "引起共鸣。", "Yǐnqǐ gòngmíng.", "Gây đồng cảm."],
  ], ["恰恰 宁可", "恰恰相反 / 宁可…也不…", "Ôn văn học và công nghệ.", [
    ["Dịch: Đúng ngược lại.", "恰恰相反。"],
    ["Dịch: Thà học.", "宁可学习。"],
    ["Dịch: Lập luận nghiêm cẩn.", "严谨论证。"],
    ["Dịch: Bảo vệ quyền riêng tư.", "保护隐私。"],
  ]], [
    ["A", "智能会替代作家吗？", "Zhìnéng huì tìdài zuòjiā ma?", "AI sẽ thay nhà văn không?"],
    ["B", "恰恰相反。读者要共鸣，不是算法。", "Qiàqià xiāngfǎn. Dúzhě yào gòngmíng, bú shì suànfǎ.", "Đúng ngược lại. Bạn đọc cần đồng cảm, không phải thuật toán."],
    ["A", "那你怎么选？", "Nà nǐ zěnme xuǎn?", "Thế bạn chọn thế nào?"],
    ["B", "我宁可自己论证，也不把隐私交给平台。", "Wǒ nìngkě zìjǐ lùnzhèng, yě bù bǎ yǐnsī jiāo gěi píngtái.", "Tôi thà tự lập luận còn hơn giao quyền riêng tư cho nền tảng."],
  ], [
    ["Tự viết: Đúng ngược lại.", "恰恰相反。"],
    ["Tự viết: Tôi thà học còn hơn thất nghiệp.", "我宁可学习，也不失业。"],
  ], "Ôn lập luận, đồng cảm, AI và quyền riêng tư.", "智能会替代作家吗？"),

  mk(334, "Ôn ngữ pháp luận", "review", [
    ["即便", "jíbiàn", "Dù cho (ôn)", "即便很难。", "Jíbiàn hěn nán.", "Dù khó."],
    ["综上所述", "zōngshàngsuǒshù", "Tóm lại như trên (ôn)", "综上所述。", "Zōngshàngsuǒshù.", "Tóm lại như trên."],
    ["况且", "kuàngqiě", "Huống chi (ôn)", "况且不公平。", "Kuàngqiě bù gōngpíng.", "Huống chi không công bằng."],
    ["固然", "gùrán", "Cố nhiên (ôn)", "固然方便。", "Gùrán fāngbiàn.", "Quả là tiện."],
    ["由此可见", "yóucǐkějiàn", "Từ đó thấy (ôn)", "由此可见本质。", "Yóucǐkějiàn běnzhì.", "Từ đó thấy bản chất."],
  ], ["即便 综上所述", "即便…也… / 综上所述", "Ôn mẫu luận HSK 6.", [
    ["Dịch: Dù khó.", "即便很难。"],
    ["Dịch: Tóm lại như trên.", "综上所述。"],
    ["Dịch: Huống chi không công bằng.", "况且不公平。"],
    ["Dịch: Từ đó thấy bản chất.", "由此可见本质。"],
  ]], [
    ["A", "综上所述，你为什么这样选择？", "Zōngshàngsuǒshù, nǐ wèishénme zhèyàng xuǎnzé?", "Tóm lại như trên, vì sao bạn chọn vậy?"],
    ["B", "即便很难，也要公平。况且差距已经很大。", "Jíbiàn hěn nán, yě yào gōngpíng. Kuàngqiě chājù yǐjīng hěn dà.", "Dù khó vẫn phải công bằng. Huống chi khoảng cách đã lớn."],
    ["A", "智能固然方便吧？", "Zhìnéng gùrán fāngbiàn ba?", "AI quả là tiện phải không?"],
    ["B", "是。由此可见，方便不等于公正。", "Shì. Yóucǐkějiàn, fāngbiàn bù děngyú gōngzhèng.", "Đúng. Từ đó thấy tiện không bằng công chính."],
  ], [
    ["Tự viết: Dù khó vẫn phải công bằng.", "即便很难，也要公平。"],
    ["Tự viết: Tóm lại như trên nên cải cách.", "综上所述，应当改革。"],
  ], "Ôn 即便, 综上所述, 固然 để giải thích lựa chọn.", "综上所述，你为什么这样选择？"),

  mk(335, "Mock mini-test", "review", [
    ["鉴于", "jiànyú", "Xét rằng (ôn)", "鉴于情况。", "Jiànyú qíngkuàng.", "Xét tình hình."],
    ["无非", "wúfēi", "Chẳng qua (ôn)", "无非是信念。", "Wúfēi shì xìnniàn.", "Chẳng qua là niềm tin."],
    ["以至于", "yǐzhìyú", "Đến nỗi (ôn)", "以至于失败。", "Yǐzhìyú shībài.", "Đến nỗi thất bại."],
    ["宁可", "nìngkě", "Thà… (ôn)", "宁可转型。", "Nìngkě zhuǎnxíng.", "Thà chuyển đổi."],
    ["即便", "jíbiàn", "Dù cho (ôn)", "即便失败。", "Jíbiàn shībài.", "Dù thất bại."],
  ], ["Nghe + đọc hiểu ngắn", "HSK 6 mẫu luận", "Mock mini-test ~974 từ. Nghe + đọc hiểu câu luận.", [
    ["Dịch: Xét tình hình.", "鉴于情况。"],
    ["Dịch: Chẳng qua là niềm tin.", "无非是信念。"],
    ["Dịch: Thà chuyển đổi.", "宁可转型。"],
    ["Dịch: Dù thất bại.", "即便失败。"],
  ]], [
    ["A", "请直接回答：鉴于危机，战略是什么？", "Qǐng zhíjiē huídá: jiànyú wēijī, zhànlüè shì shénme?", "Xin trả lời trực tiếp: xét khủng hoảng, chiến lược là gì?"],
    ["B", "宁可谈判，也不冲突。", "Nìngkě tánpàn, yě bù chōngtū.", "Thà đàm phán còn hơn xung đột."],
    ["A", "若不妥协会怎样？", "Ruò bù tuǒxié huì zěnyàng?", "Nếu không thỏa hiệp thì sao?"],
    ["B", "以至于和平失败。即便很难，也要斡旋。", "Yǐzhìyú hépíng shībài. Jíbiàn hěn nán, yě yào wòxuán.", "Đến nỗi hòa bình thất bại. Dù khó vẫn phải điều đình."],
  ], [
    ["Tự viết: Thà đàm phán còn hơn xung đột.", "宁可谈判，也不冲突。"],
    ["Tự viết: Dù khó vẫn phải điều đình.", "即便很难，也要斡旋。"],
  ], "Mini-test: trả lời trực tiếp câu ngữ pháp HSK 6.", "请直接回答：鉴于危机，战略是什么？"),

  mk(336, "AI tốt nghiệp", "review", [
    ["项目", "xiàngmù", "Dự án (ôn)", "讨论项目。", "Tǎolùn xiàngmù.", "Thảo luận dự án."],
    ["公正", "gōngzhèng", "Công chính (ôn)", "维护公正。", "Wéihù gōngzhèng.", "Gìn giữ công chính."],
    ["保障", "bǎozhàng", "Bảo đảm (ôn)", "社会保障。", "Shèhuì bǎozhàng.", "Bảo đảm xã hội."],
    ["转型", "zhuǎnxíng", "Chuyển đổi (ôn)", "推动转型。", "Tuīdòng zhuǎnxíng.", "Thúc đẩy chuyển đổi."],
    ["综上所述", "zōngshàngsuǒshù", "Tóm lại như trên (ôn)", "综上所述。", "Zōngshàngsuǒshù.", "Tóm lại như trên."],
  ], ["HSK 1–6 toàn mẫu", "HSK 1–6 toàn mẫu", "Tốt nghiệp HSK 6: thuyết trình chính sách công. Chỉ từ đã khoá.", [
    ["Dịch: Thảo luận dự án.", "讨论项目。"],
    ["Dịch: Gìn giữ công chính.", "维护公正。"],
    ["Dịch: Bảo đảm xã hội.", "社会保障。"],
    ["Dịch: Tóm lại như trên.", "综上所述。"],
  ]], [
    ["A", "请谈谈这个公共项目。谁负责？", "Qǐng tántan zhège gōnggòng xiàngmù. Shéi fùzé?", "Xin nói dự án công này. Ai phụ trách?"],
    ["B", "我负责。综上所述，要缩小差距，保障公平。", "Wǒ fùzé. Zōngshàngsuǒshù, yào suōxiǎo chājù, bǎozhàng gōngpíng.", "Tôi phụ trách. Tóm lại như trên, phải thu hẹp khoảng cách, bảo đảm công bằng."],
    ["A", "智能转型固然快，但是失业呢？", "Zhìnéng zhuǎnxíng gùrán kuài, dànshì shīyè ne?", "Chuyển đổi AI quả nhanh, nhưng thất nghiệp thì sao?"],
    ["B", "即便很难，也宁可学习，也不放弃公正。", "Jíbiàn hěn nán, yě nìngkě xuéxí, yě bù fàngqì gōngzhèng.", "Dù khó vẫn thà học, không bỏ công chính."],
  ], [
    ["Tự viết: Tóm lại như trên phải thu hẹp khoảng cách.", "综上所述，要缩小差距。"],
    ["Tự viết: Dù khó vẫn thà học.", "即便很难，也宁可学习。"],
  ], "Thuyết trình dự án công: công bằng, chuyển đổi, bảo đảm.", "请谈谈这个公共项目。谁负责？"),
];

function weekOf(id) {
  return Math.ceil(id / 7);
}

function systemPrompt(level, words, start) {
  return `Bạn là bạn nói tiếng Trung trình độ HSK ${level}. Chỉ dùng các từ: ${words.join(", ")}. Mỗi lượt 1–2 câu ngắn. Viết Hán + pinyin. Nếu học viên sai, sửa nhẹ bằng tiếng Việt rồi hỏi lại. Không thêm từ mới. Bắt đầu bằng: ${start}`;
}

const hsk5 = JSON.parse(readFileSync(join(dir, "280.json"), "utf8"));
let allowed = [...hsk5.aiPrompt.allowedWords];

for (const lesson of LESSONS) {
  if (lesson.kind === "learn") {
    for (const item of lesson.vocab) {
      if (!item.vi.includes("(ôn") && !allowed.includes(item.han)) {
        allowed.push(item.han);
      }
    }
  }
  const week = weekOf(lesson.id);
  const payload = {
    id: lesson.id,
    week,
    hsk: 6,
    theme: lesson.theme,
    kind: lesson.kind,
    vocab: lesson.vocab,
    grammar: lesson.grammar,
    dialogue: lesson.dialogue,
    exercises: lesson.exercises,
    aiPrompt: {
      scenario: lesson.scenario,
      system: systemPrompt(6, allowed, lesson.start),
      allowedWords: [...allowed],
      turns: 5,
    },
    timer: TIMER,
  };
  const name = `${String(lesson.id).padStart(3, "0")}.json`;
  writeFileSync(join(dir, name), `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(`Wrote ${LESSONS.length} lessons, last allowed ${allowed.length} words`);
