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
  {
    id: 225,
    theme: "Sự nghiệp",
    kind: "learn",
    vocab: [
      v("事业", "shìyè", "Sự nghiệp", "我想发展自己的事业。", "Wǒ xiǎng fāzhǎn zìjǐ de shìyè.", "Tôi muốn phát triển sự nghiệp."),
      v("职位", "zhíwèi", "Chức vụ", "这个职位很重要。", "Zhège zhíwèi hěn zhòngyào.", "Chức vụ này rất quan trọng."),
      v("待遇", "dàiyù", "Đãi ngộ", "公司待遇不错。", "Gōngsī dàiyù búcuò.", "Đãi ngộ công ty khá."),
      v("压力", "yālì", "Áp lực", "工作压力很大。", "Gōngzuò yālì hěn dà.", "Áp lực công việc rất lớn."),
      v("面对", "miànduì", "Đối mặt", "我们要面对问题。", "Wǒmen yào miànduì wèntí.", "Chúng ta phải đối mặt vấn đề."),
    ],
    grammar: {
      title: "面对 + danh từ",
      pattern: "面对 + N",
      explainVi: "面对: đối mặt với việc gì. 面对压力、面对问题.",
      drills: [
        drill("Dịch: Tôi muốn phát triển sự nghiệp.", "我想发展自己的事业。"),
        drill("Dịch: Chức vụ này rất quan trọng.", "这个职位很重要。"),
        drill("Dịch: Áp lực công việc rất lớn.", "工作压力很大。"),
        drill("Dịch: Chúng ta phải đối mặt vấn đề.", "我们要面对问题。"),
      ],
    },
    dialogue: [
      line("A", "你现在的职位怎么样？", "Nǐ xiànzài de zhíwèi zěnmeyàng?", "Chức vụ hiện tại của bạn thế nào?"),
      line("B", "还可以。待遇不错，可是压力很大。", "Hái kěyǐ. Dàiyù búcuò, kěshì yālì hěn dà.", "Ổn. Đãi ngộ khá, nhưng áp lực lớn."),
      line("A", "你怎么面对这些压力？", "Nǐ zěnme miànduì zhèxiē yālì?", "Bạn đối mặt áp lực thế nào?"),
      line("B", "我想好好发展事业，所以继续努力。", "Wǒ xiǎng hǎohǎo fāzhǎn shìyè, suǒyǐ jìxù nǔlì.", "Tôi muốn phát triển sự nghiệp nên tiếp tục cố."),
    ],
    exercises: [
      ex("Tự viết: Áp lực công việc rất lớn.", "工作压力很大。"),
      ex("Tự viết: Phải đối mặt vấn đề.", "要面对问题。"),
    ],
    scenario: "Nói về chức vụ, đãi ngộ, áp lực và cách đối mặt.",
    start: "你现在的职位怎么样？",
  },
  {
    id: 226,
    theme: "Mục tiêu",
    kind: "learn",
    vocab: [
      v("挑战", "tiǎozhàn", "Thách thức", "这是一个挑战。", "Zhè shì yí ge tiǎozhàn.", "Đây là một thách thức."),
      v("目标", "mùbiāo", "Mục tiêu", "我有明确的目标。", "Wǒ yǒu míngquè de mùbiāo.", "Tôi có mục tiêu rõ."),
      v("成就", "chéngjiù", "Thành tựu", "他有很多成就。", "Tā yǒu hěn duō chéngjiù.", "Anh ấy có nhiều thành tựu."),
      v("竞争", "jìngzhēng", "Cạnh tranh", "这个行业竞争很大。", "Zhège hángyè jìngzhēng hěn dà.", "Ngành này cạnh tranh lớn."),
      v("承受", "chéngshòu", "Chịu đựng", "我能承受压力。", "Wǒ néng chéngshòu yālì.", "Tôi chịu được áp lực."),
    ],
    grammar: {
      title: "承受 + danh từ",
      pattern: "承受 + N",
      explainVi: "承受: chịu đựng. 承受压力、承受挑战.",
      drills: [
        drill("Dịch: Đây là một thách thức.", "这是一个挑战。"),
        drill("Dịch: Tôi có mục tiêu rõ.", "我有明确的目标。"),
        drill("Dịch: Ngành này cạnh tranh lớn.", "这个行业竞争很大。"),
        drill("Dịch: Tôi chịu được áp lực.", "我能承受压力。"),
      ],
    },
    dialogue: [
      line("A", "你能承受这么大的竞争吗？", "Nǐ néng chéngshòu zhème dà de jìngzhēng ma?", "Bạn chịu được cạnh tranh lớn thế không?"),
      line("B", "能。这是挑战，也是目标。", "Néng. Zhè shì tiǎozhàn, yě shì mùbiāo.", "Được. Đây là thách thức, cũng là mục tiêu."),
      line("A", "你希望有什么成就？", "Nǐ xīwàng yǒu shénme chéngjiù?", "Bạn muốn thành tựu gì?"),
      line("B", "先完成今年的目标。", "Xiān wánchéng jīnnián de mùbiāo.", "Trước hết hoàn thành mục tiêu năm nay."),
    ],
    exercises: [
      ex("Tự viết: Đây là một thách thức.", "这是一个挑战。"),
      ex("Tự viết: Tôi chịu được áp lực.", "我能承受压力。"),
    ],
    scenario: "Nói mục tiêu, thách thức, cạnh tranh và chịu áp lực.",
    start: "你能承受这么大的竞争吗？",
  },
  {
    id: 227,
    theme: "Thăng tiến",
    kind: "learn",
    vocab: [
      v("资格", "zīgé", "Tư cách / đủ điều kiện", "我有这个资格。", "Wǒ yǒu zhège zīgé.", "Tôi có tư cách này."),
      v("晋升", "jìnshēng", "Thăng chức", "他明年可能晋升。", "Tā míngnián kěnéng jìnshēng.", "Sang năm anh ấy có thể thăng chức."),
      v("加班", "jiābān", "Làm thêm giờ", "今晚要加班。", "Jīnwǎn yào jiābān.", "Tối nay phải làm thêm."),
      v("效率", "xiàolǜ", "Hiệu suất", "我们要提高效率。", "Wǒmen yào tígāo xiàolǜ.", "Chúng ta phải nâng hiệu suất."),
      v("稳定", "wěndìng", "Ổn định", "这份工作很稳定。", "Zhè fèn gōngzuò hěn wěndìng.", "Công việc này rất ổn định."),
    ],
    grammar: {
      title: "提高 + 效率",
      pattern: "提高 + 效率",
      explainVi: "提高效率: nâng hiệu suất. Cũng nói 工作效率很高.",
      drills: [
        drill("Dịch: Tôi có tư cách này.", "我有这个资格。"),
        drill("Dịch: Tối nay phải làm thêm.", "今晚要加班。"),
        drill("Dịch: Chúng ta phải nâng hiệu suất.", "我们要提高效率。"),
        drill("Dịch: Công việc này rất ổn định.", "这份工作很稳定。"),
      ],
    },
    dialogue: [
      line("A", "你想晋升吗？", "Nǐ xiǎng jìnshēng ma?", "Bạn muốn thăng chức không?"),
      line("B", "想。可是要有资格，还要提高效率。", "Xiǎng. Kěshì yào yǒu zīgé, hái yào tígāo xiàolǜ.", "Muốn. Nhưng phải có tư cách, còn phải nâng hiệu suất."),
      line("A", "你常常加班吗？", "Nǐ chángcháng jiābān ma?", "Bạn thường làm thêm không?"),
      line("B", "加班不少。工作稳定，我还能承受。", "Jiābān bù shǎo. Gōngzuò wěndìng, wǒ hái néng chéngshòu.", "Làm thêm khá nhiều. Việc ổn định, tôi còn chịu được."),
    ],
    exercises: [
      ex("Tự viết: Chúng ta phải nâng hiệu suất.", "我们要提高效率。"),
      ex("Tự viết: Tối nay phải làm thêm.", "今晚要加班。"),
    ],
    scenario: "Nói thăng chức, làm thêm, hiệu suất và việc ổn định.",
    start: "你想晋升吗？",
  },
  {
    id: 228,
    theme: "Nhóm",
    kind: "learn",
    vocab: [
      v("项目", "xiàngmù", "Dự án", "这个项目很重要。", "Zhège xiàngmù hěn zhòngyào.", "Dự án này rất quan trọng."),
      v("合作", "hézuò", "Hợp tác", "我们合作得很好。", "Wǒmen hézuò de hěn hǎo.", "Chúng ta hợp tác rất tốt."),
      v("团队", "tuánduì", "Nhóm", "团队需要合作。", "Tuánduì xūyào hézuò.", "Nhóm cần hợp tác."),
      v("领导", "lǐngdǎo", "Lãnh đạo", "领导安排了任务。", "Lǐngdǎo ānpái le rènwu.", "Lãnh đạo đã sắp nhiệm vụ."),
      v("员工", "yuángōng", "Nhân viên", "员工都很努力。", "Yuángōng dōu hěn nǔlì.", "Nhân viên đều rất cố gắng."),
    ],
    grammar: {
      title: "跟 + người + 合作",
      pattern: "跟 + người + 合作",
      explainVi: "跟…合作: hợp tác với ai. 跟团队合作、跟领导合作.",
      drills: [
        drill("Dịch: Dự án này rất quan trọng.", "这个项目很重要。"),
        drill("Dịch: Chúng ta hợp tác rất tốt.", "我们合作得很好。"),
        drill("Dịch: Nhóm cần hợp tác.", "团队需要合作。"),
        drill("Dịch: Nhân viên đều rất cố gắng.", "员工都很努力。"),
      ],
    },
    dialogue: [
      line("A", "这个项目谁负责？", "Zhège xiàngmù shéi fùzé?", "Dự án này ai phụ trách?"),
      line("B", "领导和团队一起合作。", "Lǐngdǎo hé tuánduì yìqǐ hézuò.", "Lãnh đạo và nhóm hợp tác cùng."),
      line("A", "员工跟谁合作？", "Yuángōng gēn shéi hézuò?", "Nhân viên hợp tác với ai?"),
      line("B", "跟我合作。我们要提高效率。", "Gēn wǒ hézuò. Wǒmen yào tígāo xiàolǜ.", "Với tôi. Chúng ta phải nâng hiệu suất."),
    ],
    exercises: [
      ex("Tự viết: Dự án này rất quan trọng.", "这个项目很重要。"),
      ex("Tự viết: Nhóm cần hợp tác.", "团队需要合作。"),
    ],
    scenario: "Phân công dự án: lãnh đạo, nhóm, nhân viên hợp tác.",
    start: "这个项目谁负责？",
  },
  {
    id: 229,
    theme: "Tuyển dụng",
    kind: "learn",
    vocab: [
      v("职业", "zhíyè", "Nghề nghiệp", "你喜欢这个职业吗？", "Nǐ xǐhuan zhège zhíyè ma?", "Bạn thích nghề này không?"),
      v("行业", "hángyè", "Ngành", "这个行业发展很快。", "Zhège hángyè fāzhǎn hěn kuài.", "Ngành này phát triển nhanh."),
      v("招聘", "zhāopìn", "Tuyển dụng", "公司在招聘员工。", "Gōngsī zài zhāopìn yuángōng.", "Công ty đang tuyển nhân viên."),
      v("简历", "jiǎnlì", "Sơ yếu lý lịch", "请把简历发给我。", "Qǐng bǎ jiǎnlì fā gěi wǒ.", "Hãy gửi CV cho tôi."),
      v("录用", "lùyòng", "Thu nhận (vào làm)", "我被录用了。", "Wǒ bèi lùyòng le.", "Tôi được nhận vào làm."),
    ],
    grammar: {
      title: "被 + 录用",
      pattern: "被 + 录用",
      explainVi: "被录用: được nhận vào làm. 我被录用了、他还没被录用.",
      drills: [
        drill("Dịch: Bạn thích nghề này không?", "你喜欢这个职业吗？"),
        drill("Dịch: Công ty đang tuyển nhân viên.", "公司在招聘员工。"),
        drill("Dịch: Hãy gửi CV cho tôi.", "请把简历发给我。"),
        drill("Dịch: Tôi được nhận vào làm.", "我被录用了。"),
      ],
    },
    dialogue: [
      line("A", "你们公司在招聘吗？", "Nǐmen gōngsī zài zhāopìn ma?", "Công ty các bạn đang tuyển không?"),
      line("B", "在招聘。这个行业发展很快。", "Zài zhāopìn. Zhège hángyè fāzhǎn hěn kuài.", "Đang tuyển. Ngành này phát triển nhanh."),
      line("A", "我已经把简历发给你了。", "Wǒ yǐjīng bǎ jiǎnlì fā gěi nǐ le.", "Tôi đã gửi CV cho bạn rồi."),
      line("B", "很好。希望你被录用。", "Hěn hǎo. Xīwàng nǐ bèi lùyòng.", "Tốt. Mong bạn được nhận."),
    ],
    exercises: [
      ex("Tự viết: Công ty đang tuyển nhân viên.", "公司在招聘员工。"),
      ex("Tự viết: Tôi được nhận vào làm.", "我被录用了。"),
    ],
    scenario: "Xin việc: ngành nghề, gửi CV, được nhận.",
    start: "你们公司在招聘吗？",
  },
  {
    id: 230,
    theme: "Tổng hợp sự nghiệp",
    kind: "review",
    vocab: [
      v("面对", "miànduì", "Đối mặt (ôn)", "面对压力。", "Miànduì yālì.", "Đối mặt áp lực."),
      v("承受", "chéngshòu", "Chịu đựng (ôn)", "承受挑战。", "Chéngshòu tiǎozhàn.", "Chịu thách thức."),
      v("目标", "mùbiāo", "Mục tiêu (ôn)", "完成目标。", "Wánchéng mùbiāo.", "Hoàn thành mục tiêu."),
      v("团队", "tuánduì", "Nhóm (ôn)", "团队合作。", "Tuánduì hézuò.", "Nhóm hợp tác."),
      v("效率", "xiàolǜ", "Hiệu suất (ôn)", "提高效率。", "Tígāo xiàolǜ.", "Nâng hiệu suất."),
    ],
    grammar: {
      title: "面对 / 承受",
      pattern: "面对 + N；承受 + N",
      explainVi: "Ôn tuần 33: nói áp lực tuần này, mục tiêu và hợp tác.",
      drills: [
        drill("Dịch: Đối mặt áp lực.", "面对压力。"),
        drill("Dịch: Chịu thách thức.", "承受挑战。"),
        drill("Dịch: Hoàn thành mục tiêu.", "完成目标。"),
        drill("Dịch: Nâng hiệu suất.", "提高效率。"),
      ],
    },
    dialogue: [
      line("A", "这周压力大吗？你怎么面对？", "Zhè zhōu yālì dà ma? Nǐ zěnme miànduì?", "Tuần này áp lực lớn không? Bạn đối mặt thế nào?"),
      line("B", "还能承受。团队一起提高效率。", "Hái néng chéngshòu. Tuánduì yìqǐ tígāo xiàolǜ.", "Còn chịu được. Nhóm cùng nâng hiệu suất."),
      line("A", "你们的目标完成了吗？", "Nǐmen de mùbiāo wánchéng le ma?", "Mục tiêu các bạn xong chưa?"),
      line("B", "还没有。可是我们继续合作。", "Hái méiyǒu. Kěshì wǒmen jìxù hézuò.", "Chưa. Nhưng chúng tôi tiếp tục hợp tác."),
    ],
    exercises: [
      ex("Tự viết: Đối mặt áp lực tuần này.", "面对这周的压力。"),
      ex("Tự viết: Nhóm cùng nâng hiệu suất.", "团队一起提高效率。"),
    ],
    scenario: "Tổng hợp tuần: áp lực, mục tiêu, hợp tác nhóm.",
    start: "这周压力大吗？你怎么面对？",
  },
  {
    id: 231,
    theme: "Sếp vs nhân viên",
    kind: "review",
    vocab: [
      v("领导", "lǐngdǎo", "Lãnh đạo (ôn)", "领导安排工作。", "Lǐngdǎo ānpái gōngzuò.", "Lãnh đạo sắp việc."),
      v("员工", "yuángōng", "Nhân viên (ôn)", "员工很努力。", "Yuángōng hěn nǔlì.", "Nhân viên rất cố."),
      v("加班", "jiābān", "Làm thêm (ôn)", "今晚加班。", "Jīnwǎn jiābān.", "Tối nay làm thêm."),
      v("晋升", "jìnshēng", "Thăng chức (ôn)", "想晋升。", "Xiǎng jìnshēng.", "Muốn thăng chức."),
      v("项目", "xiàngmù", "Dự án (ôn)", "完成项目。", "Wánchéng xiàngmù.", "Hoàn thành dự án."),
    ],
    grammar: {
      title: "Chỉ công việc",
      pattern: "面对 / 合作 / 提高效率",
      explainVi: "Roleplay sếp vs nhân viên. Khoá từ tuần 33.",
      drills: [
        drill("Dịch: Lãnh đạo sắp việc.", "领导安排工作。"),
        drill("Dịch: Tối nay làm thêm.", "今晚加班。"),
        drill("Dịch: Muốn thăng chức.", "想晋升。"),
        drill("Dịch: Hoàn thành dự án.", "完成项目。"),
      ],
    },
    dialogue: [
      line("A", "这个项目很重要。今晚要加班。", "Zhège xiàngmù hěn zhòngyào. Jīnwǎn yào jiābān.", "Dự án này quan trọng. Tối nay phải làm thêm."),
      line("B", "好。我能承受。员工都在合作。", "Hǎo. Wǒ néng chéngshòu. Yuángōng dōu zài hézuò.", "Được. Tôi chịu được. Nhân viên đều đang hợp tác."),
      line("A", "提高效率，你才有资格晋升。", "Tígāo xiàolǜ, nǐ cái yǒu zīgé jìnshēng.", "Nâng hiệu suất thì mới có tư cách thăng chức."),
      line("B", "明白。我会面对这个挑战。", "Míngbai. Wǒ huì miànduì zhège tiǎozhàn.", "Hiểu. Tôi sẽ đối mặt thách thức này."),
    ],
    exercises: [
      ex("Tự viết: Tối nay phải làm thêm.", "今晚要加班。"),
      ex("Tự viết: Nâng hiệu suất mới thăng chức.", "提高效率才能晋升。"),
    ],
    scenario: "Sếp giao dự án, nhân viên chịu làm thêm để thăng chức.",
    start: "这个项目很重要。今晚要加班。",
  },
  {
    id: 232,
    theme: "Xã hội",
    kind: "learn",
    vocab: [
      v("社会", "shèhuì", "Xã hội", "这是社会问题。", "Zhè shì shèhuì wèntí.", "Đây là vấn đề xã hội."),
      v("现象", "xiànxiàng", "Hiện tượng", "这种现象很普遍。", "Zhè zhǒng xiànxiàng hěn pǔbiàn.", "Hiện tượng này khá phổ biến."),
      v("观点", "guāndiǎn", "Quan điểm", "我同意你的观点。", "Wǒ tóngyì nǐ de guāndiǎn.", "Tôi đồng ý quan điểm bạn."),
      v("态度", "tàidu", "Thái độ", "他的态度很好。", "Tā de tàidu hěn hǎo.", "Thái độ anh ấy rất tốt."),
      v("评价", "píngjià", "Đánh giá", "请评价一下。", "Qǐng píngjià yíxià.", "Hãy đánh giá một chút."),
    ],
    grammar: {
      title: "对…来说",
      pattern: "对 + người + 来说",
      explainVi: "对…来说: đối với ai thì. 对我来说、对社会来说.",
      drills: [
        drill("Dịch: Đây là vấn đề xã hội.", "这是社会问题。"),
        drill("Dịch: Tôi đồng ý quan điểm bạn.", "我同意你的观点。"),
        drill("Dịch: Thái độ anh ấy rất tốt.", "他的态度很好。"),
        drill("Dịch: Đối với tôi, việc này quan trọng.", "对我来说，这件事很重要。"),
      ],
    },
    dialogue: [
      line("A", "对社会来说，这个现象严重吗？", "Duì shèhuì lái shuō, zhège xiànxiàng yánzhòng ma?", "Đối với xã hội, hiện tượng này nghiêm trọng không?"),
      line("B", "我觉得严重。你有什么观点？", "Wǒ juéde yánzhòng. Nǐ yǒu shénme guāndiǎn?", "Tôi thấy nghiêm trọng. Bạn có quan điểm gì?"),
      line("A", "对我来说，态度比评价更重要。", "Duì wǒ lái shuō, tàidu bǐ píngjià gèng zhòngyào.", "Đối với tôi, thái độ quan trọng hơn đánh giá."),
      line("B", "我同意你的观点。", "Wǒ tóngyì nǐ de guāndiǎn.", "Tôi đồng ý quan điểm bạn."),
    ],
    exercises: [
      ex("Tự viết: Đây là vấn đề xã hội.", "这是社会问题。"),
      ex("Tự viết: Đối với tôi, việc này quan trọng.", "对我来说，这件事很重要。"),
    ],
    scenario: "Thảo luận hiện tượng xã hội, nêu quan điểm và thái độ.",
    start: "对社会来说，这个现象严重吗？",
  },
  {
    id: 233,
    theme: "Truyền thông",
    kind: "learn",
    vocab: [
      v("媒体", "méitǐ", "Truyền thông", "媒体报道了这件事。", "Méitǐ bàodào le zhè jiàn shì.", "Truyền thông đưa tin việc này."),
      v("舆论", "yúlùn", "Dư luận", "舆论的影响很大。", "Yúlùn de yǐngxiǎng hěn dà.", "Ảnh hưởng dư luận rất lớn."),
      v("分析", "fēnxī", "Phân tích", "请分析这个问题。", "Qǐng fēnxī zhège wèntí.", "Hãy phân tích vấn đề này."),
      v("表明", "biǎomíng", "Bày tỏ / cho thấy", "这表明他同意。", "Zhè biǎomíng tā tóngyì.", "Điều này cho thấy anh ấy đồng ý."),
      v("反映", "fǎnyìng", "Phản ánh", "新闻反映了社会问题。", "Xīnwén fǎnyìng le shèhuì wèntí.", "Tin tức phản ánh vấn đề xã hội."),
    ],
    grammar: {
      title: "表明 + 观点",
      pattern: "表明 + 观点 / 态度",
      explainVi: "表明: bày tỏ, cho thấy. 表明观点、表明态度.",
      drills: [
        drill("Dịch: Truyền thông đưa tin việc này.", "媒体报道了这件事。"),
        drill("Dịch: Hãy phân tích vấn đề này.", "请分析这个问题。"),
        drill("Dịch: Điều này cho thấy anh ấy đồng ý.", "这表明他同意。"),
        drill("Dịch: Tin tức phản ánh vấn đề xã hội.", "新闻反映了社会问题。"),
      ],
    },
    dialogue: [
      line("A", "媒体怎么分析这个现象？", "Méitǐ zěnme fēnxī zhège xiànxiàng?", "Truyền thông phân tích hiện tượng này thế nào?"),
      line("B", "他们表明了自己的观点。", "Tāmen biǎomíng le zìjǐ de guāndiǎn.", "Họ bày tỏ quan điểm của mình."),
      line("A", "舆论也反映了社会态度。", "Yúlùn yě fǎnyìng le shèhuì tàidu.", "Dư luận cũng phản ánh thái độ xã hội."),
      line("B", "对。影响很大。", "Duì. Yǐngxiǎng hěn dà.", "Đúng. Ảnh hưởng rất lớn."),
    ],
    exercises: [
      ex("Tự viết: Hãy phân tích vấn đề này.", "请分析这个问题。"),
      ex("Tự viết: Bày tỏ quan điểm của mình.", "表明自己的观点。"),
    ],
    scenario: "Phân tích tin: truyền thông, dư luận, bày tỏ quan điểm.",
    start: "媒体怎么分析这个现象？",
  },
  {
    id: 234,
    theme: "Xu hướng",
    kind: "learn",
    vocab: [
      v("公众", "gōngzhòng", "Công chúng", "公众很关心这件事。", "Gōngzhòng hěn guānxīn zhè jiàn shì.", "Công chúng rất quan tâm việc này."),
      v("热点", "rèdiǎn", "Điểm nóng", "这是网上的热点。", "Zhè shì wǎng shàng de rèdiǎn.", "Đây là điểm nóng trên mạng."),
      v("趋势", "qūshì", "Xu hướng", "这个趋势很清楚。", "Zhège qūshì hěn qīngchu.", "Xu hướng này rất rõ."),
      v("广泛", "guǎngfàn", "Rộng rãi", "大家广泛讨论这个问题。", "Dàjiā guǎngfàn tǎolùn zhège wèntí.", "Mọi người thảo luận rộng vấn đề này."),
      v("深刻", "shēnkè", "Sâu sắc", "他的分析很深刻。", "Tā de fēnxī hěn shēnkè.", "Phân tích của anh ấy rất sâu."),
    ],
    grammar: {
      title: "广泛 + động từ",
      pattern: "广泛 + V",
      explainVi: "广泛: rộng rãi. 广泛讨论、广泛关注.",
      drills: [
        drill("Dịch: Công chúng rất quan tâm việc này.", "公众很关心这件事。"),
        drill("Dịch: Đây là điểm nóng trên mạng.", "这是网上的热点。"),
        drill("Dịch: Xu hướng này rất rõ.", "这个趋势很清楚。"),
        drill("Dịch: Phân tích của anh ấy rất sâu.", "他的分析很深刻。"),
      ],
    },
    dialogue: [
      line("A", "这个热点对公众来说重要吗？", "Zhège rèdiǎn duì gōngzhòng lái shuō zhòngyào ma?", "Điểm nóng này với công chúng có quan trọng không?"),
      line("B", "重要。趋势已经很清楚。", "Zhòngyào. Qūshì yǐjīng hěn qīngchu.", "Quan trọng. Xu hướng đã rất rõ."),
      line("A", "媒体广泛报道了吗？", "Méitǐ guǎngfàn bàodào le ma?", "Truyền thông đưa tin rộng chưa?"),
      line("B", "报道了。分析也很深刻。", "Bàodào le. Fēnxī yě hěn shēnkè.", "Rồi. Phân tích cũng rất sâu."),
    ],
    exercises: [
      ex("Tự viết: Đây là điểm nóng trên mạng.", "这是网上的热点。"),
      ex("Tự viết: Xu hướng này rất rõ.", "这个趋势很清楚。"),
    ],
    scenario: "Nói xu hướng, điểm nóng và thảo luận rộng.",
    start: "这个热点对公众来说重要吗？",
  },
  {
    id: 235,
    theme: "Tranh luận",
    kind: "learn",
    vocab: [
      v("争论", "zhēnglùn", "Tranh luận", "他们在争论这个问题。", "Tāmen zài zhēnglùn zhège wèntí.", "Họ đang tranh luận vấn đề này."),
      v("立场", "lìchǎng", "Lập trường", "我的立场很清楚。", "Wǒ de lìchǎng hěn qīngchu.", "Lập trường tôi rất rõ."),
      v("客观", "kèguān", "Khách quan", "请客观地分析。", "Qǐng kèguān de fēnxī.", "Hãy phân tích khách quan."),
      v("主观", "zhǔguān", "Chủ quan", "这个评价太主观。", "Zhège píngjià tài zhǔguān.", "Đánh giá này quá chủ quan."),
      v("偏见", "piānjiàn", "Thành kiến", "我们不要有偏见。", "Wǒmen bú yào yǒu piānjiàn.", "Chúng ta đừng thành kiến."),
    ],
    grammar: {
      title: "客观 / 主观",
      pattern: "客观 / 主观 + 分析 / 评价",
      explainVi: "客观: khách quan. 主观: chủ quan. 客观分析、主观评价.",
      drills: [
        drill("Dịch: Họ đang tranh luận vấn đề này.", "他们在争论这个问题。"),
        drill("Dịch: Lập trường tôi rất rõ.", "我的立场很清楚。"),
        drill("Dịch: Hãy phân tích khách quan.", "请客观地分析。"),
        drill("Dịch: Chúng ta đừng thành kiến.", "我们不要有偏见。"),
      ],
    },
    dialogue: [
      line("A", "我们争论一下。你的立场是什么？", "Wǒmen zhēnglùn yíxià. Nǐ de lìchǎng shì shénme?", "Tranh luận một chút. Lập trường bạn là gì?"),
      line("B", "我尽量客观，不要主观。", "Wǒ jǐnliàng kèguān, bú yào zhǔguān.", "Tôi cố khách quan, đừng chủ quan."),
      line("A", "媒体有没有偏见？", "Méitǐ yǒu méiyǒu piānjiàn?", "Truyền thông có thành kiến không?"),
      line("B", "有时候有。所以要客观分析。", "Yǒu shíhou yǒu. Suǒyǐ yào kèguān fēnxī.", "Đôi khi có. Nên phải phân tích khách quan."),
    ],
    exercises: [
      ex("Tự viết: Lập trường tôi rất rõ.", "我的立场很清楚。"),
      ex("Tự viết: Hãy phân tích khách quan.", "请客观地分析。"),
    ],
    scenario: "Tranh luận: lập trường, khách quan hay chủ quan, tránh thành kiến.",
    start: "我们争论一下。你的立场是什么？",
  },
  {
    id: 236,
    theme: "Phỏng vấn báo",
    kind: "learn",
    vocab: [
      v("采访", "cǎifǎng", "Phỏng vấn (báo)", "记者来采访你。", "Jìzhě lái cǎifǎng nǐ.", "Phóng viên đến phỏng vấn bạn."),
      v("编辑", "biānjí", "Biên tập", "编辑改了标题。", "Biānjí gǎi le biāotí.", "Biên tập sửa tiêu đề."),
      v("发布", "fābù", "Đăng / phát hành", "他们发布了新闻。", "Tāmen fābù le xīnwén.", "Họ đăng tin tức."),
      v("传播", "chuánbō", "Lan truyền", "这个消息传播很快。", "Zhège xiāoxi chuánbō hěn kuài.", "Tin này lan rất nhanh."),
      v("标题", "biāotí", "Tiêu đề", "这个标题很清楚。", "Zhège biāotí hěn qīngchu.", "Tiêu đề này rất rõ."),
    ],
    grammar: {
      title: "发布 + tin",
      pattern: "发布 + 新闻 / 消息",
      explainVi: "发布: đăng, phát. 发布新闻、发布消息.",
      drills: [
        drill("Dịch: Phóng viên đến phỏng vấn bạn.", "记者来采访你。"),
        drill("Dịch: Họ đăng tin tức.", "他们发布了新闻。"),
        drill("Dịch: Tin này lan rất nhanh.", "这个消息传播很快。"),
        drill("Dịch: Tiêu đề này rất rõ.", "这个标题很清楚。"),
      ],
    },
    dialogue: [
      line("A", "我可以采访你吗？", "Wǒ kěyǐ cǎifǎng nǐ ma?", "Tôi có thể phỏng vấn bạn không?"),
      line("B", "可以。你们什么时候发布？", "Kěyǐ. Nǐmen shénme shíhou fābù?", "Được. Các bạn đăng khi nào?"),
      line("A", "编辑先改标题，然后发布。", "Biānjí xiān gǎi biāotí, ránhòu fābù.", "Biên tập sửa tiêu đề rồi đăng."),
      line("B", "好。希望传播时没有偏见。", "Hǎo. Xīwàng chuánbō shí méiyǒu piānjiàn.", "Tốt. Mong khi lan truyền không thành kiến."),
    ],
    exercises: [
      ex("Tự viết: Họ đăng tin tức.", "他们发布了新闻。"),
      ex("Tự viết: Tôi có thể phỏng vấn bạn không?", "我可以采访你吗？"),
    ],
    scenario: "Phỏng vấn báo: sửa tiêu đề, đăng tin, lan truyền.",
    start: "我可以采访你吗？",
  },
  {
    id: 237,
    theme: "Tổng hợp xã hội",
    kind: "review",
    vocab: [
      v("观点", "guāndiǎn", "Quan điểm (ôn)", "表明观点。", "Biǎomíng guāndiǎn.", "Bày tỏ quan điểm."),
      v("现象", "xiànxiàng", "Hiện tượng (ôn)", "社会现象。", "Shèhuì xiànxiàng.", "Hiện tượng xã hội."),
      v("分析", "fēnxī", "Phân tích (ôn)", "客观分析。", "Kèguān fēnxī.", "Phân tích khách quan."),
      v("媒体", "méitǐ", "Truyền thông (ôn)", "媒体报道。", "Méitǐ bàodào.", "Truyền thông đưa tin."),
      v("公众", "gōngzhòng", "Công chúng (ôn)", "对公众来说。", "Duì gōngzhòng lái shuō.", "Đối với công chúng."),
    ],
    grammar: {
      title: "对…来说",
      pattern: "对 + người + 来说",
      explainVi: "Ôn tuần 34: thảo luận một tin, nêu quan điểm.",
      drills: [
        drill("Dịch: Bày tỏ quan điểm.", "表明观点。"),
        drill("Dịch: Phân tích khách quan.", "客观分析。"),
        drill("Dịch: Truyền thông đưa tin.", "媒体报道。"),
        drill("Dịch: Đối với công chúng thì quan trọng.", "对公众来说很重要。"),
      ],
    },
    dialogue: [
      line("A", "对公众来说，这个热点说明什么？", "Duì gōngzhòng lái shuō, zhège rèdiǎn shuōmíng shénme?", "Với công chúng, điểm nóng này nói lên gì?"),
      line("B", "它反映了一个社会现象。", "Tā fǎnyìng le yí ge shèhuì xiànxiàng.", "Nó phản ánh một hiện tượng xã hội."),
      line("A", "你的观点呢？请客观分析。", "Nǐ de guāndiǎn ne? Qǐng kèguān fēnxī.", "Quan điểm bạn? Hãy phân tích khách quan."),
      line("B", "媒体不要有偏见，要广泛报道。", "Méitǐ bú yào yǒu piānjiàn, yào guǎngfàn bàodào.", "Truyền thông đừng thành kiến, hãy đưa tin rộng."),
    ],
    exercises: [
      ex("Tự viết: Bày tỏ quan điểm.", "表明观点。"),
      ex("Tự viết: Phân tích khách quan.", "客观分析。"),
    ],
    scenario: "Thảo luận một tin: hiện tượng, quan điểm, phân tích khách quan.",
    start: "对公众来说，这个热点说明什么？",
  },
  {
    id: 238,
    theme: "Phóng viên vs khách",
    kind: "review",
    vocab: [
      v("采访", "cǎifǎng", "Phỏng vấn (ôn)", "开始采访。", "Kāishǐ cǎifǎng.", "Bắt đầu phỏng vấn."),
      v("标题", "biāotí", "Tiêu đề (ôn)", "看标题。", "Kàn biāotí.", "Xem tiêu đề."),
      v("发布", "fābù", "Đăng (ôn)", "发布新闻。", "Fābù xīnwén.", "Đăng tin."),
      v("态度", "tàidu", "Thái độ (ôn)", "态度很好。", "Tàidu hěn hǎo.", "Thái độ rất tốt."),
      v("评价", "píngjià", "Đánh giá (ôn)", "请评价。", "Qǐng píngjià.", "Hãy đánh giá."),
    ],
    grammar: {
      title: "Chỉ xã hội",
      pattern: "对…来说 / 表明 / 发布",
      explainVi: "Roleplay phóng viên vs khách. Khoá từ đến tuần 34.",
      drills: [
        drill("Dịch: Bắt đầu phỏng vấn.", "开始采访。"),
        drill("Dịch: Đăng tin.", "发布新闻。"),
        drill("Dịch: Thái độ rất tốt.", "态度很好。"),
        drill("Dịch: Hãy đánh giá.", "请评价。"),
      ],
    },
    dialogue: [
      line("A", "我是记者。可以采访你吗？", "Wǒ shì jìzhě. Kěyǐ cǎifǎng nǐ ma?", "Tôi là phóng viên. Phỏng vấn bạn được không?"),
      line("B", "可以。请客观，不要偏见。", "Kěyǐ. Qǐng kèguān, bú yào piānjiàn.", "Được. Hãy khách quan, đừng thành kiến."),
      line("A", "好。标题怎么写？什么时候发布？", "Hǎo. Biāotí zěnme xiě? Shénme shíhou fābù?", "Tốt. Tiêu đề viết sao? Đăng khi nào?"),
      line("B", "标题要清楚。对公众来说，态度很重要。", "Biāotí yào qīngchu. Duì gōngzhòng lái shuō, tàidu hěn zhòngyào.", "Tiêu đề phải rõ. Với công chúng, thái độ rất quan trọng."),
    ],
    exercises: [
      ex("Tự viết: Bắt đầu phỏng vấn.", "开始采访。"),
      ex("Tự viết: Đăng tin, tiêu đề phải rõ.", "发布新闻，标题要清楚。"),
    ],
    scenario: "Phóng viên phỏng vấn khách: khách quan, tiêu đề, đăng tin.",
    start: "我是记者。可以采访你吗？",
  },
  mk(
    239, "Giáo dục", "learn",
    [
      ["教育", "jiàoyù", "Giáo dục", "教育很重要。", "Jiàoyù hěn zhòngyào.", "Giáo dục rất quan trọng."],
      ["知识", "zhīshi", "Kiến thức", "学习新知识。", "Xuéxí xīn zhīshi.", "Học kiến thức mới."],
      ["研究", "yánjiū", "Nghiên cứu", "他在研究这个问题。", "Tā zài yánjiū zhège wèntí.", "Anh ấy đang nghiên cứu vấn đề này."],
      ["理论", "lǐlùn", "Lý thuyết", "理论要清楚。", "Lǐlùn yào qīngchu.", "Lý thuyết phải rõ."],
      ["通过", "tōngguò", "Thông qua / vượt qua", "通过学习提高能力。", "Tōngguò xuéxí tígāo nénglì.", "Thông qua học để nâng năng lực."],
    ],
    ["通过 + động từ", "通过 + V", "通过: nhờ / bằng cách. 通过学习、通过研究.", [
      ["Dịch: Giáo dục rất quan trọng.", "教育很重要。"],
      ["Dịch: Học kiến thức mới.", "学习新知识。"],
      ["Dịch: Anh ấy đang nghiên cứu vấn đề này.", "他在研究这个问题。"],
      ["Dịch: Thông qua học để nâng năng lực.", "通过学习提高能力。"],
    ]],
    [
      ["A", "你怎么得到这些知识？", "Nǐ zěnme dédào zhèxiē zhīshi?", "Bạn có kiến thức này bằng cách nào?"],
      ["B", "通过学习和研究。", "Tōngguò xuéxí hé yánjiū.", "Thông qua học và nghiên cứu."],
      ["A", "理论难吗？", "Lǐlùn nán ma?", "Lý thuyết có khó không?"],
      ["B", "有一点儿难。可是教育很重要。", "Yǒu yìdiǎnr nán. Kěshì jiàoyù hěn zhòngyào.", "Hơi khó. Nhưng giáo dục rất quan trọng."],
    ],
    [
      ["Tự viết: Giáo dục rất quan trọng.", "教育很重要。"],
      ["Tự viết: Thông qua học để nâng năng lực.", "通过学习提高能力。"],
    ],
    "Nói học tập, kiến thức, nghiên cứu và lý thuyết.",
    "你怎么得到这些知识？",
  ),
  mk(
    240, "Tốt nghiệp", "learn",
    [
      ["培养", "péiyǎng", "Bồi dưỡng", "学校培养了很多学生。", "Xuéxiào péiyǎng le hěn duō xuésheng.", "Trường bồi dưỡng nhiều học sinh."],
      ["毕业", "bìyè", "Tốt nghiệp", "我明年毕业。", "Wǒ míngnián bìyè.", "Sang năm tôi tốt nghiệp."],
      ["论文", "lùnwén", "Luận văn", "论文还没写完。", "Lùnwén hái méi xiě wán.", "Luận văn chưa viết xong."],
      ["导师", "dǎoshī", "Giáo viên hướng dẫn", "导师帮助我研究。", "Dǎoshī bāngzhù wǒ yánjiū.", "Thầy hướng dẫn giúp tôi nghiên cứu."],
      ["掌握", "zhǎngwò", "Nắm vững", "我掌握了这个理论。", "Wǒ zhǎngwò le zhège lǐlùn.", "Tôi đã nắm lý thuyết này."],
    ],
    ["培养 + danh từ", "培养 + N", "培养: bồi dưỡng. 培养学生、培养能力.", [
      ["Dịch: Trường bồi dưỡng nhiều học sinh.", "学校培养了很多学生。"],
      ["Dịch: Sang năm tôi tốt nghiệp.", "我明年毕业。"],
      ["Dịch: Luận văn chưa viết xong.", "论文还没写完。"],
      ["Dịch: Tôi đã nắm lý thuyết này.", "我掌握了这个理论。"],
    ]],
    [
      ["A", "导师怎么培养你？", "Dǎoshī zěnme péiyǎng nǐ?", "Thầy hướng dẫn bồi dưỡng bạn thế nào?"],
      ["B", "通过写论文。我要掌握研究方法。", "Tōngguò xiě lùnwén. Wǒ yào zhǎngwò yánjiū fāngfǎ.", "Bằng viết luận. Tôi phải nắm phương pháp nghiên cứu."],
      ["A", "你什么时候毕业？", "Nǐ shénme shíhou bìyè?", "Bạn tốt nghiệp khi nào?"],
      ["B", "论文写完就毕业。", "Lùnwén xiě wán jiù bìyè.", "Luận xong thì tốt nghiệp."],
    ],
    [
      ["Tự viết: Sang năm tôi tốt nghiệp.", "我明年毕业。"],
      ["Tự viết: Tôi đã nắm lý thuyết này.", "我掌握了这个理论。"],
    ],
    "Nói luận văn, thầy hướng dẫn, nắm kiến thức và tốt nghiệp.",
    "导师怎么培养你？",
  ),
  mk(
    241, "Lớp học", "learn",
    [
      ["课程", "kèchéng", "Khóa học", "这门课程很有用。", "Zhè mén kèchéng hěn yǒuyòng.", "Khóa học này rất hữu ích."],
      ["教材", "jiàocái", "Giáo trình", "请看教材。", "Qǐng kàn jiàocái.", "Hãy xem giáo trình."],
      ["讲座", "jiǎngzuò", "Bài giảng / seminar", "下午有讲座。", "Xiàwǔ yǒu jiǎngzuò.", "Chiều có bài giảng."],
      ["课堂", "kètáng", "Lớp học (giờ học)", "在课堂上记笔记。", "Zài kètáng shàng jì bǐjì.", "Ở lớp hãy ghi chú."],
      ["笔记", "bǐjì", "Ghi chú", "我的笔记很清楚。", "Wǒ de bǐjì hěn qīngchu.", "Ghi chú của tôi rất rõ."],
    ],
    ["在 + 课堂", "在 + 课堂 + V", "在课堂上: trong giờ học. 在课堂上记笔记.", [
      ["Dịch: Khóa học này rất hữu ích.", "这门课程很有用。"],
      ["Dịch: Hãy xem giáo trình.", "请看教材。"],
      ["Dịch: Chiều có bài giảng.", "下午有讲座。"],
      ["Dịch: Ở lớp hãy ghi chú.", "在课堂上记笔记。"],
    ]],
    [
      ["A", "这门课程的教材在哪儿？", "Zhè mén kèchéng de jiàocái zài nǎr?", "Giáo trình khóa này ở đâu?"],
      ["B", "在课堂上。讲座以后我给你笔记。", "Zài kètáng shàng. Jiǎngzuò yǐhòu wǒ gěi nǐ bǐjì.", "Ở lớp. Sau bài giảng tôi đưa ghi chú."],
      ["A", "通过这门课程能掌握理论吗？", "Tōngguò zhè mén kèchéng néng zhǎngwò lǐlùn ma?", "Qua khóa này nắm được lý thuyết không?"],
      ["B", "能。导师讲得很清楚。", "Néng. Dǎoshī jiǎng de hěn qīngchu.", "Được. Thầy giảng rất rõ."],
    ],
    [
      ["Tự viết: Hãy xem giáo trình.", "请看教材。"],
      ["Tự viết: Ở lớp hãy ghi chú.", "在课堂上记笔记。"],
    ],
    "Nói khóa học, giáo trình, bài giảng và ghi chú trên lớp.",
    "这门课程的教材在哪儿？",
  ),
  mk(
    242, "Tư duy", "learn",
    [
      ["智慧", "zhìhuì", "Trí tuệ", "他很有智慧。", "Tā hěn yǒu zhìhuì.", "Anh ấy rất có trí tuệ."],
      ["逻辑", "luójí", "Logic", "这个逻辑不清楚。", "Zhège luójí bù qīngchu.", "Logic này không rõ."],
      ["判断", "pànduàn", "Phán đoán", "请你判断一下。", "Qǐng nǐ pànduàn yíxià.", "Hãy phán đoán một chút."],
      ["理解", "lǐjiě", "Hiểu", "我理解你的意思。", "Wǒ lǐjiě nǐ de yìsi.", "Tôi hiểu ý bạn."],
      ["记忆", "jìyì", "Trí nhớ", "我的记忆不好。", "Wǒ de jìyì bù hǎo.", "Trí nhớ tôi không tốt."],
    ],
    ["理解 + danh từ", "理解 + N", "理解: hiểu. 理解问题、理解意思.", [
      ["Dịch: Anh ấy rất có trí tuệ.", "他很有智慧。"],
      ["Dịch: Logic này không rõ.", "这个逻辑不清楚。"],
      ["Dịch: Hãy phán đoán một chút.", "请你判断一下。"],
      ["Dịch: Tôi hiểu ý bạn.", "我理解你的意思。"],
    ]],
    [
      ["A", "你理解这个问题的逻辑吗？", "Nǐ lǐjiě zhège wèntí de luójí ma?", "Bạn hiểu logic vấn đề này không?"],
      ["B", "理解。可是记忆不太好。", "Lǐjiě. Kěshì jìyì bú tài hǎo.", "Hiểu. Nhưng trí nhớ không tốt lắm."],
      ["A", "要用智慧判断，不要太快。", "Yào yòng zhìhuì pànduàn, bú yào tài kuài.", "Phải dùng trí tuệ mà phán đoán, đừng quá nhanh."],
      ["B", "好。我再想想。", "Hǎo. Wǒ zài xiǎngxiang.", "Được. Tôi nghĩ lại."],
    ],
    [
      ["Tự viết: Tôi hiểu ý bạn.", "我理解你的意思。"],
      ["Tự viết: Logic này không rõ.", "这个逻辑不清楚。"],
    ],
    "Phân tích vấn đề: logic, phán đoán, hiểu và nhớ.",
    "你理解这个问题的逻辑吗？",
  ),
  mk(
    243, "Sáng tạo", "learn",
    [
      ["创新", "chuàngxīn", "Đổi mới", "我们需要创新。", "Wǒmen xūyào chuàngxīn.", "Chúng ta cần đổi mới."],
      ["启发", "qǐfā", "Gợi mở", "这次讲座启发了我。", "Zhè cì jiǎngzuò qǐfā le wǒ.", "Bài giảng này gợi mở cho tôi."],
      ["探索", "tànsuǒ", "Khám phá", "一起探索新方法。", "Yìqǐ tànsuǒ xīn fāngfǎ.", "Cùng khám phá cách mới."],
      ["独立", "dúlì", "Độc lập", "请独立思考。", "Qǐng dúlì sīkǎo.", "Hãy suy nghĩ độc lập."],
      ["思考", "sīkǎo", "Suy nghĩ", "我需要时间思考。", "Wǒ xūyào shíjiān sīkǎo.", "Tôi cần thời gian suy nghĩ."],
    ],
    ["独立 + động từ", "独立 + V", "独立: độc lập. 独立思考、独立研究.", [
      ["Dịch: Chúng ta cần đổi mới.", "我们需要创新。"],
      ["Dịch: Bài giảng này gợi mở cho tôi.", "这次讲座启发了我。"],
      ["Dịch: Cùng khám phá cách mới.", "一起探索新方法。"],
      ["Dịch: Hãy suy nghĩ độc lập.", "请独立思考。"],
    ]],
    [
      ["A", "怎么培养创新？", "Zěnme péiyǎng chuàngxīn?", "Làm sao bồi dưỡng đổi mới?"],
      ["B", "通过独立思考。讲座给了我启发。", "Tōngguò dúlì sīkǎo. Jiǎngzuò gěi le wǒ qǐfā.", "Bằng suy nghĩ độc lập. Bài giảng gợi mở cho tôi."],
      ["A", "我们一起探索好不好？", "Wǒmen yìqǐ tànsuǒ hǎo bu hǎo?", "Chúng ta cùng khám phá nhé?"],
      ["B", "好。我先思考一下。", "Hǎo. Wǒ xiān sīkǎo yíxià.", "Được. Tôi suy nghĩ trước một chút."],
    ],
    [
      ["Tự viết: Hãy suy nghĩ độc lập.", "请独立思考。"],
      ["Tự viết: Chúng ta cần đổi mới.", "我们需要创新。"],
    ],
    "Nói đổi mới, gợi mở, khám phá và suy nghĩ độc lập.",
    "怎么培养创新？",
  ),
  mk(
    244, "Tổng hợp giáo dục", "review",
    [
      ["培养", "péiyǎng", "Bồi dưỡng (ôn)", "培养学生。", "Péiyǎng xuésheng.", "Bồi dưỡng học sinh."],
      ["通过", "tōngguò", "Thông qua (ôn)", "通过研究。", "Tōngguò yánjiū.", "Thông qua nghiên cứu."],
      ["毕业", "bìyè", "Tốt nghiệp (ôn)", "快毕业了。", "Kuài bìyè le.", "Sắp tốt nghiệp."],
      ["理解", "lǐjiě", "Hiểu (ôn)", "理解理论。", "Lǐjiě lǐlùn.", "Hiểu lý thuyết."],
      ["思考", "sīkǎo", "Suy nghĩ (ôn)", "独立思考。", "Dúlì sīkǎo.", "Suy nghĩ độc lập."],
    ],
    ["培养 / 通过", "培养 + N；通过 + V", "Ôn tuần 35: kế hoạch học, nghiên cứu, tốt nghiệp.", [
      ["Dịch: Bồi dưỡng học sinh.", "培养学生。"],
      ["Dịch: Thông qua nghiên cứu.", "通过研究。"],
      ["Dịch: Sắp tốt nghiệp.", "快毕业了。"],
      ["Dịch: Suy nghĩ độc lập.", "独立思考。"],
    ]],
    [
      ["A", "毕业以前，你想掌握什么？", "Bìyè yǐqián, nǐ xiǎng zhǎngwò shénme?", "Trước tốt nghiệp, bạn muốn nắm gì?"],
      ["B", "通过课程培养研究能力。", "Tōngguò kèchéng péiyǎng yánjiū nénglì.", "Qua khóa học bồi dưỡng năng lực nghiên cứu."],
      ["A", "论文呢？导师满意吗？", "Lùnwén ne? Dǎoshī mǎnyì ma?", "Luận văn? Thầy có hài lòng không?"],
      ["B", "还在写。我需要独立思考。", "Hái zài xiě. Wǒ xūyào dúlì sīkǎo.", "Đang viết. Tôi cần suy nghĩ độc lập."],
    ],
    [
      ["Tự viết: Thông qua nghiên cứu.", "通过研究。"],
      ["Tự viết: Suy nghĩ độc lập.", "独立思考。"],
    ],
    "Kế hoạch học: bồi dưỡng, nắm kiến thức, chuẩn bị tốt nghiệp.",
    "毕业以前，你想掌握什么？",
  ),
  mk(
    245, "Học viên vs giảng viên", "review",
    [
      ["导师", "dǎoshī", "Thầy hướng dẫn (ôn)", "问导师。", "Wèn dǎoshī.", "Hỏi thầy hướng dẫn."],
      ["论文", "lùnwén", "Luận văn (ôn)", "改论文。", "Gǎi lùnwén.", "Sửa luận văn."],
      ["课堂", "kètáng", "Lớp học (ôn)", "在课堂上。", "Zài kètáng shàng.", "Ở trên lớp."],
      ["启发", "qǐfā", "Gợi mở (ôn)", "很有启发。", "Hěn yǒu qǐfā.", "Rất gợi mở."],
      ["知识", "zhīshi", "Kiến thức (ôn)", "新知识。", "Xīn zhīshi.", "Kiến thức mới."],
    ],
    ["Chỉ học", "通过 / 培养 / 独立思考", "Roleplay học viên vs giảng viên. Khoá từ đến tuần 35.", [
      ["Dịch: Hỏi thầy hướng dẫn.", "问导师。"],
      ["Dịch: Sửa luận văn.", "改论文。"],
      ["Dịch: Ở trên lớp.", "在课堂上。"],
      ["Dịch: Rất gợi mở.", "很有启发。"],
    ]],
    [
      ["A", "你的论文怎么样？课堂上听懂了吗？", "Nǐ de lùnwén zěnmeyàng? Kètáng shàng tīng dǒng le ma?", "Luận văn thế nào? Trên lớp nghe hiểu chưa?"],
      ["B", "还没掌握。请再启发我一下。", "Hái méi zhǎngwò. Qǐng zài qǐfā wǒ yíxià.", "Chưa nắm. Xin gợi mở thêm."],
      ["A", "通过独立思考，知识才会清楚。", "Tōngguò dúlì sīkǎo, zhīshi cái huì qīngchu.", "Nhờ suy nghĩ độc lập, kiến thức mới rõ."],
      ["B", "明白。我回去改论文。", "Míngbai. Wǒ huíqù gǎi lùnwén.", "Hiểu. Tôi về sửa luận."],
    ],
    [
      ["Tự viết: Hỏi thầy hướng dẫn.", "问导师。"],
      ["Tự viết: Sửa luận văn.", "改论文。"],
    ],
    "Giảng viên gợi mở, học viên sửa luận và suy nghĩ độc lập.",
    "你的论文怎么样？课堂上听懂了吗？",
  ),
  mk(
    246, "Nghệ thuật", "learn",
    [
      ["艺术", "yìshù", "Nghệ thuật", "我喜欢艺术。", "Wǒ xǐhuan yìshù.", "Tôi thích nghệ thuật."],
      ["创作", "chuàngzuò", "Sáng tác", "他在创作新作品。", "Tā zài chuàngzuò xīn zuòpǐn.", "Anh ấy đang sáng tác tác phẩm mới."],
      ["欣赏", "xīnshǎng", "Thưởng thức", "我们一起欣赏。", "Wǒmen yìqǐ xīnshǎng.", "Chúng ta cùng thưởng thức."],
      ["作品", "zuòpǐn", "Tác phẩm", "这个作品很有名。", "Zhège zuòpǐn hěn yǒumíng.", "Tác phẩm này rất nổi tiếng."],
      ["风格", "fēnggé", "Phong cách", "我喜欢这种风格。", "Wǒ xǐhuan zhè zhǒng fēnggé.", "Tôi thích phong cách này."],
    ],
    ["欣赏 + danh từ", "欣赏 + N", "欣赏: thưởng thức. 欣赏作品、欣赏艺术.", [
      ["Dịch: Tôi thích nghệ thuật.", "我喜欢艺术。"],
      ["Dịch: Anh ấy đang sáng tác tác phẩm mới.", "他在创作新作品。"],
      ["Dịch: Chúng ta cùng thưởng thức.", "我们一起欣赏。"],
      ["Dịch: Tôi thích phong cách này.", "我喜欢这种风格。"],
    ]],
    [
      ["A", "你欣赏这个作品吗？", "Nǐ xīnshǎng zhège zuòpǐn ma?", "Bạn thưởng thức tác phẩm này không?"],
      ["B", "欣赏。风格很特别。", "Xīnshǎng. Fēnggé hěn tèbié.", "Có. Phong cách rất đặc biệt."],
      ["A", "谁创作的？", "Shéi chuàngzuò de?", "Ai sáng tác?"],
      ["B", "一位老师。他的艺术很有启发。", "Yí wèi lǎoshī. Tā de yìshù hěn yǒu qǐfā.", "Một thầy. Nghệ thuật của ông rất gợi mở."],
    ],
    [
      ["Tự viết: Chúng ta cùng thưởng thức.", "我们一起欣赏。"],
      ["Tự viết: Tôi thích phong cách này.", "我喜欢这种风格。"],
    ],
    "Xem và khen tác phẩm: nghệ thuật, sáng tác, phong cách.",
    "你欣赏这个作品吗？",
  ),
  mk(
    247, "Triển lãm", "learn",
    [
      ["展览", "zhǎnlǎn", "Triển lãm", "这个展览很有意思。", "Zhège zhǎnlǎn hěn yǒu yìsi.", "Triển lãm này rất thú vị."],
      ["博物馆", "bówùguǎn", "Bảo tàng", "我们去博物馆。", "Wǒmen qù bówùguǎn.", "Chúng ta đi bảo tàng."],
      ["雕塑", "diāosù", "Điêu khắc", "这座雕塑很大。", "Zhè zuò diāosù hěn dà.", "Tác phẩm điêu khắc này rất lớn."],
      ["绘画", "huìhuà", "Hội họa", "我学过绘画。", "Wǒ xué guo huìhuà.", "Tôi đã học hội họa."],
      ["摄影", "shèyǐng", "Nhiếp ảnh", "他喜欢摄影。", "Tā xǐhuan shèyǐng.", "Anh ấy thích nhiếp ảnh."],
    ],
    ["在 + 博物馆", "在 + 博物馆 + V", "在博物馆: ở bảo tàng. 在博物馆欣赏作品.", [
      ["Dịch: Triển lãm này rất thú vị.", "这个展览很有意思。"],
      ["Dịch: Chúng ta đi bảo tàng.", "我们去博物馆。"],
      ["Dịch: Tác phẩm điêu khắc này rất lớn.", "这座雕塑很大。"],
      ["Dịch: Anh ấy thích nhiếp ảnh.", "他喜欢摄影。"],
    ]],
    [
      ["A", "展览在博物馆里吗？", "Zhǎnlǎn zài bówùguǎn lǐ ma?", "Triển lãm ở trong bảo tàng à?"],
      ["B", "对。有雕塑，也有绘画和摄影。", "Duì. Yǒu diāosù, yě yǒu huìhuà hé shèyǐng.", "Đúng. Có điêu khắc, hội họa và nhiếp ảnh."],
      ["A", "我们可以一起欣赏吗？", "Wǒmen kěyǐ yìqǐ xīnshǎng ma?", "Chúng ta cùng thưởng thức được không?"],
      ["B", "可以。我很喜欢这种风格。", "Kěyǐ. Wǒ hěn xǐhuan zhè zhǒng fēnggé.", "Được. Tôi thích phong cách này."],
    ],
    [
      ["Tự viết: Chúng ta đi bảo tàng.", "我们去博物馆。"],
      ["Tự viết: Triển lãm này rất thú vị.", "这个展览很有意思。"],
    ],
    "Tham quan bảo tàng: triển lãm, điêu khắc, hội họa, nhiếp ảnh.",
    "展览在博物馆里吗？",
  ),
  mk(
    248, "Văn học", "learn",
    [
      ["文学", "wénxué", "Văn học", "我喜欢中国文学。", "Wǒ xǐhuan Zhōngguó wénxué.", "Tôi thích văn học Trung Quốc."],
      ["诗歌", "shīgē", "Thơ", "这首诗歌很美。", "Zhè shǒu shīgē hěn měi.", "Bài thơ này rất đẹp."],
      ["小说", "xiǎoshuō", "Tiểu thuyết", "他在写小说。", "Tā zài xiě xiǎoshuō.", "Anh ấy đang viết tiểu thuyết."],
      ["导演", "dǎoyǎn", "Đạo diễn", "这部电影的导演很有名。", "Zhè bù diànyǐng de dǎoyǎn hěn yǒumíng.", "Đạo diễn phim này rất nổi tiếng."],
      ["演员", "yǎnyuán", "Diễn viên", "演员演得很好。", "Yǎnyuán yǎn de hěn hǎo.", "Diễn viên diễn rất hay."],
    ],
    ["由…导演", "由 + người + 导演", "由…导演: do ai đạo diễn. 这部电影由他导演.", [
      ["Dịch: Tôi thích văn học Trung Quốc.", "我喜欢中国文学。"],
      ["Dịch: Bài thơ này rất đẹp.", "这首诗歌很美。"],
      ["Dịch: Anh ấy đang viết tiểu thuyết.", "他在写小说。"],
      ["Dịch: Diễn viên diễn rất hay.", "演员演得很好。"],
    ]],
    [
      ["A", "这部电影由谁导演？", "Zhè bù diànyǐng yóu shéi dǎoyǎn?", "Phim này do ai đạo diễn?"],
      ["B", "由一位有名的导演。演员也不错。", "Yóu yí wèi yǒumíng de dǎoyǎn. Yǎnyuán yě búcuò.", "Do một đạo diễn nổi tiếng. Diễn viên cũng khá."],
      ["A", "你更喜欢诗歌还是小说？", "Nǐ gèng xǐhuan shīgē háishi xiǎoshuō?", "Bạn thích thơ hay tiểu thuyết hơn?"],
      ["B", "小说。文学对我来说很重要。", "Xiǎoshuō. Wénxué duì wǒ lái shuō hěn zhòngyào.", "Tiểu thuyết. Văn học với tôi rất quan trọng."],
    ],
    [
      ["Tự viết: Tôi thích văn học Trung Quốc.", "我喜欢中国文学。"],
      ["Tự viết: Diễn viên diễn rất hay.", "演员演得很好。"],
    ],
    "Nói phim và sách: đạo diễn, diễn viên, thơ, tiểu thuyết.",
    "这部电影由谁导演？",
  ),
  mk(
    249, "Phong cách", "learn",
    [
      ["现代", "xiàndài", "Hiện đại", "这是现代艺术。", "Zhè shì xiàndài yìshù.", "Đây là nghệ thuật hiện đại."],
      ["古典", "gǔdiǎn", "Cổ điển", "我喜欢古典音乐。", "Wǒ xǐhuan gǔdiǎn yīnyuè.", "Tôi thích nhạc cổ điển."],
      ["流行", "liúxíng", "Thịnh hành", "这种风格很流行。", "Zhè zhǒng fēnggé hěn liúxíng.", "Phong cách này rất thịnh hành."],
      ["特色", "tèsè", "Nét đặc trưng", "这个地方很有特色。", "Zhège dìfang hěn yǒu tèsè.", "Nơi này rất có nét riêng."],
      ["魅力", "mèilì", "Sức hút", "这部作品很有魅力。", "Zhè bù zuòpǐn hěn yǒu mèilì.", "Tác phẩm này rất có sức hút."],
    ],
    ["既…又… (ôn)", "既 + adj + 又 + adj", "Ôn HSK 4: vừa… vừa…. 既现代又有特色.", [
      ["Dịch: Đây là nghệ thuật hiện đại.", "这是现代艺术。"],
      ["Dịch: Tôi thích nhạc cổ điển.", "我喜欢古典音乐。"],
      ["Dịch: Phong cách này rất thịnh hành.", "这种风格很流行。"],
      ["Dịch: Tác phẩm này rất có sức hút.", "这部作品很有魅力。"],
    ]],
    [
      ["A", "你喜欢现代风格还是古典风格？", "Nǐ xǐhuan xiàndài fēnggé háishi gǔdiǎn fēnggé?", "Bạn thích phong cách hiện đại hay cổ điển?"],
      ["B", "都喜欢。既流行又有特色。", "Dōu xǐhuan. Jì liúxíng yòu yǒu tèsè.", "Thích cả. Vừa thịnh hành vừa có nét riêng."],
      ["A", "这部作品的魅力在哪儿？", "Zhè bù zuòpǐn de mèilì zài nǎr?", "Sức hút của tác phẩm ở đâu?"],
      ["B", "风格清楚，也容易欣赏。", "Fēnggé qīngchu, yě róngyì xīnshǎng.", "Phong cách rõ, cũng dễ thưởng thức."],
    ],
    [
      ["Tự viết: Đây là nghệ thuật hiện đại.", "这是现代艺术。"],
      ["Tự viết: Phong cách này rất thịnh hành.", "这种风格很流行。"],
    ],
    "So sánh phong cách hiện đại, cổ điển, thịnh hành và sức hút.",
    "你喜欢现代风格还是古典风格？",
  ),
  mk(
    250, "Di sản", "learn",
    [
      ["体现", "tǐxiàn", "Thể hiện", "作品体现了他的思想。", "Zuòpǐn tǐxiàn le tā de sīxiǎng.", "Tác phẩm thể hiện tư tưởng của anh ấy."],
      ["组成", "zǔchéng", "Cấu thành", "团队由五个人组成。", "Tuánduì yóu wǔ ge rén zǔchéng.", "Nhóm gồm năm người."],
      ["遗产", "yíchǎn", "Di sản", "这是文化遗产。", "Zhè shì wénhuà yíchǎn.", "Đây là di sản văn hóa."],
      ["仪式", "yíshì", "Nghi lễ", "他们在举行仪式。", "Tāmen zài jǔxíng yíshì.", "Họ đang tổ chức nghi lễ."],
      ["风俗", "fēngsú", "Phong tục", "当地风俗很有特色。", "Dāngdì fēngsú hěn yǒu tèsè.", "Phong tục địa phương rất có nét riêng."],
    ],
    ["由…组成", "由 + N + 组成", "由…组成: được cấu thành từ. 由五个人组成.", [
      ["Dịch: Tác phẩm thể hiện tư tưởng của anh ấy.", "作品体现了他的思想。"],
      ["Dịch: Nhóm gồm năm người.", "团队由五个人组成。"],
      ["Dịch: Đây là di sản văn hóa.", "这是文化遗产。"],
      ["Dịch: Phong tục địa phương rất có nét riêng.", "当地风俗很有特色。"],
    ]],
    [
      ["A", "这个仪式体现了什么风俗？", "Zhège yíshì tǐxiàn le shénme fēngsú?", "Nghi lễ này thể hiện phong tục gì?"],
      ["B", "当地遗产。由很多传统组成。", "Dāngdì yíchǎn. Yóu hěn duō chuántǒng zǔchéng.", "Di sản địa phương. Gồm nhiều truyền thống."],
      ["A", "我们可以去看吗？", "Wǒmen kěyǐ qù kàn ma?", "Chúng ta có thể đi xem không?"],
      ["B", "可以。在博物馆里也有展览。", "Kěyǐ. Zài bówùguǎn lǐ yě yǒu zhǎnlǎn.", "Được. Trong bảo tàng cũng có triển lãm."],
    ],
    [
      ["Tự viết: Đây là di sản văn hóa.", "这是文化遗产。"],
      ["Tự viết: Nhóm gồm năm người.", "团队由五个人组成。"],
    ],
    "Nói di sản, nghi lễ, phong tục và cấu thành.",
    "这个仪式体现了什么风俗？",
  ),
  mk(251, "Tổng hợp văn hóa", "review", [
    ["体现", "tǐxiàn", "Thể hiện (ôn)", "体现风俗。", "Tǐxiàn fēngsú.", "Thể hiện phong tục."],
    ["组成", "zǔchéng", "Cấu thành (ôn)", "由传统组成。", "Yóu chuántǒng zǔchéng.", "Gồm truyền thống."],
    ["作品", "zuòpǐn", "Tác phẩm (ôn)", "欣赏作品。", "Xīnshǎng zuòpǐn.", "Thưởng thức tác phẩm."],
    ["展览", "zhǎnlǎn", "Triển lãm (ôn)", "去看展览。", "Qù kàn zhǎnlǎn.", "Đi xem triển lãm."],
    ["风格", "fēnggé", "Phong cách (ôn)", "现代风格。", "Xiàndài fēnggé.", "Phong cách hiện đại."],
  ], ["体现 / 组成", "体现 + N；由…组成", "Ôn tuần 36: giới thiệu một tác phẩm.", [
    ["Dịch: Thể hiện phong tục.", "体现风俗。"],
    ["Dịch: Gồm truyền thống.", "由传统组成。"],
    ["Dịch: Thưởng thức tác phẩm.", "欣赏作品。"],
    ["Dịch: Đi xem triển lãm.", "去看展览。"],
  ]], [
    ["A", "这个作品体现了什么？", "Zhège zuòpǐn tǐxiàn le shénme?", "Tác phẩm này thể hiện gì?"],
    ["B", "体现当地风俗。风格既现代又古典。", "Tǐxiàn dāngdì fēngsú. Fēnggé jì xiàndài yòu gǔdiǎn.", "Thể hiện phong tục địa phương. Phong cách vừa hiện đại vừa cổ điển."],
    ["A", "展览在博物馆吗？", "Zhǎnlǎn zài bówùguǎn ma?", "Triển lãm ở bảo tàng à?"],
    ["B", "对。由绘画和摄影组成。", "Duì. Yóu huìhuà hé shèyǐng zǔchéng.", "Đúng. Gồm hội họa và nhiếp ảnh."],
  ], [
    ["Tự viết: Thưởng thức tác phẩm.", "欣赏作品。"],
    ["Tự viết: Đi xem triển lãm.", "去看展览。"],
  ], "Giới thiệu tác phẩm: phong cách, triển lãm, phong tục.", "这个作品体现了什么？"),
  mk(252, "Hướng dẫn viên vs khách", "review", [
    ["博物馆", "bówùguǎn", "Bảo tàng (ôn)", "欢迎来博物馆。", "Huānyíng lái bówùguǎn.", "Hoan nghênh đến bảo tàng."],
    ["遗产", "yíchǎn", "Di sản (ôn)", "文化遗产。", "Wénhuà yíchǎn.", "Di sản văn hóa."],
    ["导演", "dǎoyǎn", "Đạo diễn (ôn)", "谁导演？", "Shéi dǎoyǎn?", "Ai đạo diễn?"],
    ["魅力", "mèilì", "Sức hút (ôn)", "很有魅力。", "Hěn yǒu mèilì.", "Rất có sức hút."],
    ["欣赏", "xīnshǎng", "Thưởng thức (ôn)", "慢慢欣赏。", "Mànmàn xīnshǎng.", "Từ từ thưởng thức."],
  ], ["Chỉ nghệ thuật", "欣赏 / 体现 / 由…组成", "Roleplay hướng dẫn viên vs khách. Khoá từ đến tuần 36.", [
    ["Dịch: Hoan nghênh đến bảo tàng.", "欢迎来博物馆。"],
    ["Dịch: Di sản văn hóa.", "文化遗产。"],
    ["Dịch: Rất có sức hút.", "很有魅力。"],
    ["Dịch: Từ từ thưởng thức.", "慢慢欣赏。"],
  ]], [
    ["A", "欢迎来博物馆。这是文化遗产。", "Huānyíng lái bówùguǎn. Zhè shì wénhuà yíchǎn.", "Hoan nghênh đến bảo tàng. Đây là di sản văn hóa."],
    ["B", "真有魅力。我可以拍照吗？", "Zhēn yǒu mèilì. Wǒ kěyǐ pāi zhào ma?", "Thật có sức hút. Tôi chụp ảnh được không?"],
    ["A", "可以。请慢慢欣赏这些作品。", "Kěyǐ. Qǐng mànmàn xīnshǎng zhèxiē zuòpǐn.", "Được. Hãy từ từ thưởng thức các tác phẩm."],
    ["B", "谢谢。风格我很喜欢。", "Xièxie. Fēnggé wǒ hěn xǐhuan.", "Cảm ơn. Phong cách tôi rất thích."],
  ], [
    ["Tự viết: Hoan nghênh đến bảo tàng.", "欢迎来博物馆。"],
    ["Tự viết: Hãy từ từ thưởng thức.", "请慢慢欣赏。"],
  ], "Hướng dẫn viên giới thiệu di sản; khách thưởng thức tác phẩm.", "欢迎来博物馆。这是文化遗产。"),
  mk(253, "Khoa học", "learn", [
    ["科学", "kēxué", "Khoa học", "科学改变生活。", "Kēxué gǎibiàn shēnghuó.", "Khoa học thay đổi đời sống."],
    ["发明", "fāmíng", "Phát minh", "这是新发明。", "Zhè shì xīn fāmíng.", "Đây là phát minh mới."],
    ["实验", "shíyàn", "Thí nghiệm", "我们做实验。", "Wǒmen zuò shíyàn.", "Chúng ta làm thí nghiệm."],
    ["数据", "shùjù", "Dữ liệu", "请看这些数据。", "Qǐng kàn zhèxiē shùjù.", "Hãy xem dữ liệu này."],
    ["根据", "gēnjù", "Dựa theo", "根据数据来判断。", "Gēnjù shùjù lái pànduàn.", "Dựa theo dữ liệu mà phán đoán."],
  ], ["根据 + danh từ", "根据 + N", "根据: dựa theo. 根据数据、根据研究.", [
    ["Dịch: Khoa học thay đổi đời sống.", "科学改变生活。"],
    ["Dịch: Đây là phát minh mới.", "这是新发明。"],
    ["Dịch: Chúng ta làm thí nghiệm.", "我们做实验。"],
    ["Dịch: Dựa theo dữ liệu mà phán đoán.", "根据数据来判断。"],
  ]], [
    ["A", "这个发明根据什么数据？", "Zhège fāmíng gēnjù shénme shùjù?", "Phát minh này dựa dữ liệu gì?"],
    ["B", "根据实验。科学需要清楚的数据。", "Gēnjù shíyàn. Kēxué xūyào qīngchu de shùjù.", "Dựa thí nghiệm. Khoa học cần dữ liệu rõ."],
    ["A", "我们可以一起做实验吗？", "Wǒmen kěyǐ yìqǐ zuò shíyàn ma?", "Chúng ta cùng làm thí nghiệm được không?"],
    ["B", "可以。先看数据。", "Kěyǐ. Xiān kàn shùjù.", "Được. Xem dữ liệu trước."],
  ], [
    ["Tự viết: Chúng ta làm thí nghiệm.", "我们做实验。"],
    ["Tự viết: Dựa theo dữ liệu mà phán đoán.", "根据数据来判断。"],
  ], "Nói thí nghiệm, dữ liệu và phát minh khoa học.", "这个发明根据什么数据？"),
  mk(254, "Kết luận", "learn", [
    ["结论", "jiélùn", "Kết luận", "结论已经清楚了。", "Jiélùn yǐjīng qīngchu le.", "Kết luận đã rõ rồi."],
    ["应用", "yìngyòng", "Ứng dụng", "这个理论有应用。", "Zhège lǐlùn yǒu yìngyòng.", "Lý thuyết này có ứng dụng."],
    ["证明", "zhèngmíng", "Chứng minh", "实验证明了这一点。", "Shíyàn zhèngmíng le zhè yì diǎn.", "Thí nghiệm chứng minh điều này."],
    ["导致", "dǎozhì", "Dẫn đến", "这个问题导致失败。", "Zhège wèntí dǎozhì shībài.", "Vấn đề này dẫn đến thất bại."],
    ["原因", "yuányīn", "Nguyên nhân", "原因还不清楚。", "Yuányīn hái bù qīngchu.", "Nguyên nhân còn chưa rõ."],
  ], ["导致 + danh từ", "导致 + N", "导致: dẫn đến. 导致失败、导致问题.", [
    ["Dịch: Kết luận đã rõ rồi.", "结论已经清楚了。"],
    ["Dịch: Thí nghiệm chứng minh điều này.", "实验证明了这一点。"],
    ["Dịch: Vấn đề này dẫn đến thất bại.", "这个问题导致失败。"],
    ["Dịch: Nguyên nhân còn chưa rõ.", "原因还不清楚。"],
  ]], [
    ["A", "失败的原因是什么？", "Shībài de yuányīn shì shénme?", "Nguyên nhân thất bại là gì?"],
    ["B", "数据不清楚，导致结论不对。", "Shùjù bù qīngchu, dǎozhì jiélùn bú duì.", "Dữ liệu không rõ, dẫn đến kết luận sai."],
    ["A", "实验能证明应用吗？", "Shíyàn néng zhèngmíng yìngyòng ma?", "Thí nghiệm chứng minh được ứng dụng không?"],
    ["B", "能。根据研究，应用是有的。", "Néng. Gēnjù yánjiū, yìngyòng shì yǒu de.", "Được. Theo nghiên cứu, là có ứng dụng."],
  ], [
    ["Tự viết: Nguyên nhân còn chưa rõ.", "原因还不清楚。"],
    ["Tự viết: Vấn đề này dẫn đến thất bại.", "这个问题导致失败。"],
  ], "Giải thích nguyên nhân, kết luận, chứng minh và ứng dụng.", "失败的原因是什么？"),
  mk(255, "Quan sát", "learn", [
    ["观察", "guānchá", "Quan sát", "请仔细观察。", "Qǐng zǐxì guānchá.", "Hãy quan sát kỹ."],
    ["预测", "yùcè", "Dự đoán", "很难预测。", "Hěn nán yùcè.", "Rất khó dự đoán."],
    ["假设", "jiǎshè", "Giả thuyết", "这只是假设。", "Zhè zhǐ shì jiǎshè.", "Đây chỉ là giả thuyết."],
    ["证据", "zhèngjù", "Bằng chứng", "我们需要证据。", "Wǒmen xūyào zhèngjù.", "Chúng ta cần bằng chứng."],
    ["准确", "zhǔnquè", "Chính xác", "这个数据很准确。", "Zhège shùjù hěn zhǔnquè.", "Dữ liệu này rất chính xác."],
  ], ["假设 + câu", "假设 + câu", "假设: giả sử. 假设数据准确、假设原因清楚.", [
    ["Dịch: Hãy quan sát kỹ.", "请仔细观察。"],
    ["Dịch: Rất khó dự đoán.", "很难预测。"],
    ["Dịch: Đây chỉ là giả thuyết.", "这只是假设。"],
    ["Dịch: Dữ liệu này rất chính xác.", "这个数据很准确。"],
  ]], [
    ["A", "假设数据准确，结论是什么？", "Jiǎshè shùjù zhǔnquè, jiélùn shì shénme?", "Giả sử dữ liệu chính xác, kết luận là gì?"],
    ["B", "还需要证据。现在很难预测。", "Hái xūyào zhèngjù. Xiànzài hěn nán yùcè.", "Còn cần bằng chứng. Giờ khó dự đoán."],
    ["A", "那我们先观察实验。", "Nà wǒmen xiān guānchá shíyàn.", "Vậy chúng ta quan sát thí nghiệm trước."],
    ["B", "好。根据观察再判断。", "Hǎo. Gēnjù guānchá zài pànduàn.", "Được. Dựa quan sát rồi phán đoán."],
  ], [
    ["Tự viết: Đây chỉ là giả thuyết.", "这只是假设。"],
    ["Tự viết: Chúng ta cần bằng chứng.", "我们需要证据。"],
  ], "Đưa giả thuyết, quan sát, tìm bằng chứng và dự đoán.", "假设数据准确，结论是什么？"),
  mk(256, "Môi trường khoa", "learn", [
    ["能源", "néngyuán", "Năng lượng", "我们要节约能源。", "Wǒmen yào jiéyuē néngyuán.", "Chúng ta phải tiết kiệm năng lượng."],
    ["气候", "qìhòu", "Khí hậu", "气候在改变。", "Qìhòu zài gǎibiàn.", "Khí hậu đang thay đổi."],
    ["物种", "wùzhǒng", "Loài", "很多物种有危险。", "Hěn duō wùzhǒng yǒu wēixiǎn.", "Nhiều loài đang gặp nguy hiểm."],
    ["生态", "shēngtài", "Sinh thái", "保护生态很重要。", "Bǎohù shēngtài hěn zhòngyào.", "Bảo vệ sinh thái rất quan trọng."],
    ["可持续", "kěchíxù", "Bền vững", "这是可持续发展。", "Zhè shì kěchíxù fāzhǎn.", "Đây là phát triển bền vững."],
  ], ["可持续 + danh từ", "可持续 + N", "可持续: bền vững. 可持续发展、可持续能源.", [
    ["Dịch: Chúng ta phải tiết kiệm năng lượng.", "我们要节约能源。"],
    ["Dịch: Khí hậu đang thay đổi.", "气候在改变。"],
    ["Dịch: Bảo vệ sinh thái rất quan trọng.", "保护生态很重要。"],
    ["Dịch: Đây là phát triển bền vững.", "这是可持续发展。"],
  ]], [
    ["A", "气候变化导致什么问题？", "Qìhòu gǎibiàn dǎozhì shénme wèntí?", "Thay đổi khí hậu dẫn đến vấn đề gì?"],
    ["B", "能源不够，物种也有危险。", "Néngyuán bú gòu, wùzhǒng yě yǒu wēixiǎn.", "Năng lượng không đủ, loài cũng gặp nguy."],
    ["A", "可持续的方法是什么？", "Kěchíxù de fāngfǎ shì shénme?", "Cách bền vững là gì?"],
    ["B", "保护生态，节约能源。", "Bǎohù shēngtài, jiéyuē néngyuán.", "Bảo vệ sinh thái, tiết kiệm năng lượng."],
  ], [
    ["Tự viết: Khí hậu đang thay đổi.", "气候在改变。"],
    ["Tự viết: Đây là phát triển bền vững.", "这是可持续发展。"],
  ], "Nói khí hậu, năng lượng, loài và phát triển bền vững.", "气候变化导致什么问题？"),
  mk(257, "Thiết bị", "learn", [
    ["设备", "shèbèi", "Thiết bị", "设备需要检查。", "Shèbèi xūyào jiǎnchá.", "Thiết bị cần kiểm tra."],
    ["仪器", "yíqì", "Dụng cụ đo", "这个仪器很准。", "Zhège yíqì hěn zhǔn.", "Dụng cụ này rất chính xác."],
    ["材料", "cáiliào", "Vật liệu", "材料不够了。", "Cáiliào bú gòu le.", "Vật liệu không đủ rồi."],
    ["过程", "guòchéng", "Quá trình", "过程要清楚。", "Guòchéng yào qīngchu.", "Quá trình phải rõ."],
    ["成果", "chéngguǒ", "Thành quả", "这是研究的成果。", "Zhè shì yánjiū de chéngguǒ.", "Đây là thành quả nghiên cứu."],
  ], ["通过 + 过程", "通过 + 过程", "通过这个过程: qua quá trình này.", [
    ["Dịch: Thiết bị cần kiểm tra.", "设备需要检查。"],
    ["Dịch: Vật liệu không đủ rồi.", "材料不够了。"],
    ["Dịch: Quá trình phải rõ.", "过程要清楚。"],
    ["Dịch: Đây là thành quả nghiên cứu.", "这是研究的成果。"],
  ]], [
    ["A", "通过这个过程，我们得到什么成果？", "Tōngguò zhège guòchéng, wǒmen dédào shénme chéngguǒ?", "Qua quá trình này, ta được thành quả gì?"],
    ["B", "新材料。设备也更稳定。", "Xīn cáiliào. Shèbèi yě gèng wěndìng.", "Vật liệu mới. Thiết bị cũng ổn định hơn."],
    ["A", "仪器准不准？", "Yíqì zhǔn bu zhǔn?", "Dụng cụ có chính xác không?"],
    ["B", "很准。根据数据可以证明。", "Hěn zhǔn. Gēnjù shùjù kěyǐ zhèngmíng.", "Rất chính. Dựa dữ liệu có thể chứng minh."],
  ], [
    ["Tự viết: Thiết bị cần kiểm tra.", "设备需要检查。"],
    ["Tự viết: Đây là thành quả nghiên cứu.", "这是研究的成果。"],
  ], "Mô tả quá trình: thiết bị, vật liệu, thành quả.", "通过这个过程，我们得到什么成果？"),
  mk(258, "Tổng hợp khoa học", "review", [
    ["根据", "gēnjù", "Dựa theo (ôn)", "根据数据。", "Gēnjù shùjù.", "Dựa theo dữ liệu."],
    ["导致", "dǎozhì", "Dẫn đến (ôn)", "导致问题。", "Dǎozhì wèntí.", "Dẫn đến vấn đề."],
    ["实验", "shíyàn", "Thí nghiệm (ôn)", "做实验。", "Zuò shíyàn.", "Làm thí nghiệm."],
    ["结论", "jiélùn", "Kết luận (ôn)", "结论清楚。", "Jiélùn qīngchu.", "Kết luận rõ."],
    ["气候", "qìhòu", "Khí hậu (ôn)", "气候变化。", "Qìhòu gǎibiàn.", "Khí hậu thay đổi."],
  ], ["根据 / 导致", "根据 + N；导致 + N", "Ôn tuần 37: giải thích một số liệu.", [
    ["Dịch: Dựa theo dữ liệu.", "根据数据。"],
    ["Dịch: Dẫn đến vấn đề.", "导致问题。"],
    ["Dịch: Làm thí nghiệm.", "做实验。"],
    ["Dịch: Kết luận rõ.", "结论清楚。"],
  ]], [
    ["A", "根据这些数据，气候怎么样？", "Gēnjù zhèxiē shùjù, qìhòu zěnmeyàng?", "Dựa dữ liệu này, khí hậu thế nào?"],
    ["B", "在改变。这导致很多问题。", "Zài gǎibiàn. Zhè dǎozhì hěn duō wèntí.", "Đang đổi. Điều này dẫn đến nhiều vấn đề."],
    ["A", "实验的结论是什么？", "Shíyàn de jiélùn shì shénme?", "Kết luận thí nghiệm là gì?"],
    ["B", "需要可持续的方法。", "Xūyào kěchíxù de fāngfǎ.", "Cần cách bền vững."],
  ], [
    ["Tự viết: Dựa theo dữ liệu.", "根据数据。"],
    ["Tự viết: Dẫn đến vấn đề.", "导致问题。"],
  ], "Giải thích số liệu: khí hậu, nguyên nhân, kết luận.", "根据这些数据，气候怎么样？"),
  mk(259, "Nhà nghiên cứu vs sinh viên", "review", [
    ["观察", "guānchá", "Quan sát (ôn)", "先观察。", "Xiān guānchá.", "Quan sát trước."],
    ["证据", "zhèngjù", "Bằng chứng (ôn)", "没有证据。", "Méiyǒu zhèngjù.", "Không có bằng chứng."],
    ["假设", "jiǎshè", "Giả thuyết (ôn)", "这是假设。", "Zhè shì jiǎshè.", "Đây là giả thuyết."],
    ["设备", "shèbèi", "Thiết bị (ôn)", "检查设备。", "Jiǎnchá shèbèi.", "Kiểm tra thiết bị."],
    ["成果", "chéngguǒ", "Thành quả (ôn)", "研究的成果。", "Yánjiū de chéngguǒ.", "Thành quả nghiên cứu."],
  ], ["Chỉ khoa học", "根据 / 导致 / 假设", "Roleplay nhà nghiên cứu vs sinh viên. Khoá từ đến tuần 37.", [
    ["Dịch: Quan sát trước.", "先观察。"],
    ["Dịch: Không có bằng chứng.", "没有证据。"],
    ["Dịch: Đây là giả thuyết.", "这是假设。"],
    ["Dịch: Kiểm tra thiết bị.", "检查设备。"],
  ]], [
    ["A", "请先观察设备，再做实验。", "Qǐng xiān guānchá shèbèi, zài zuò shíyàn.", "Hãy quan sát thiết bị rồi làm thí nghiệm."],
    ["B", "好。我的假设需要证据。", "Hǎo. Wǒ de jiǎshè xūyào zhèngjù.", "Được. Giả thuyết tôi cần bằng chứng."],
    ["A", "根据过程，才能有成果。", "Gēnjù guòchéng, cái néng yǒu chéngguǒ.", "Dựa quá trình mới có thành quả."],
    ["B", "明白。我开始记录数据。", "Míngbai. Wǒ kāishǐ jìlù shùjù.", "Hiểu. Tôi bắt đầu ghi dữ liệu."],
  ], [
    ["Tự viết: Quan sát trước.", "先观察。"],
    ["Tự viết: Kiểm tra thiết bị.", "检查设备。"],
  ], "Nghiên cứu: quan sát thiết bị, giả thuyết, bằng chứng.", "请先观察设备，再做实验。"),
  mk(260, "Tiêu dùng", "learn", [
    ["消费", "xiāofèi", "Tiêu dùng", "消费要小心。", "Xiāofèi yào xiǎoxīn.", "Tiêu dùng phải cẩn thận."],
    ["投资", "tóuzī", "Đầu tư", "我想投资这个项目。", "Wǒ xiǎng tóuzī zhège xiàngmù.", "Tôi muốn đầu tư dự án này."],
    ["市场", "shìchǎng", "Thị trường", "市场很大。", "Shìchǎng hěn dà.", "Thị trường rất lớn."],
    ["产品", "chǎnpǐn", "Sản phẩm", "这个产品质量好。", "Zhège chǎnpǐn zhìliàng hǎo.", "Sản phẩm này chất lượng tốt."],
    ["质量", "zhìliàng", "Chất lượng", "质量很重要。", "Zhìliàng hěn zhòngyào.", "Chất lượng rất quan trọng."],
  ], ["市场 + 产品", "市场 + 的 + 产品", "市场的产品: sản phẩm trên thị trường.", [
    ["Dịch: Tiêu dùng phải cẩn thận.", "消费要小心。"],
    ["Dịch: Tôi muốn đầu tư dự án này.", "我想投资这个项目。"],
    ["Dịch: Thị trường rất lớn.", "市场很大。"],
    ["Dịch: Sản phẩm này chất lượng tốt.", "这个产品质量好。"],
  ]], [
    ["A", "市场上的产品质量怎么样？", "Shìchǎng shàng de chǎnpǐn zhìliàng zěnmeyàng?", "Sản phẩm trên thị trường chất lượng thế nào?"],
    ["B", "有的好。消费以前要看清楚。", "Yǒu de hǎo. Xiāofèi yǐqián yào kàn qīngchu.", "Có cái tốt. Trước khi tiêu dùng phải xem rõ."],
    ["A", "你还想投资吗？", "Nǐ hái xiǎng tóuzī ma?", "Bạn còn muốn đầu tư không?"],
    ["B", "想。市场还在发展。", "Xiǎng. Shìchǎng hái zài fāzhǎn.", "Muốn. Thị trường còn đang phát triển."],
  ], [
    ["Tự viết: Thị trường rất lớn.", "市场很大。"],
    ["Tự viết: Sản phẩm này chất lượng tốt.", "这个产品质量好。"],
  ], "Nói thị trường, sản phẩm, chất lượng và đầu tư.", "市场上的产品质量怎么样？"),
  mk(261, "Giá cả", "learn", [
    ["价格", "jiàgé", "Giá", "价格有点儿高。", "Jiàgé yǒudiǎnr gāo.", "Giá hơi cao."],
    ["品牌", "pǐnpái", "Thương hiệu", "这个品牌很有名。", "Zhège pǐnpái hěn yǒumíng.", "Thương hiệu này rất nổi tiếng."],
    ["需求", "xūqiú", "Nhu cầu", "需求越来越大。", "Xūqiú yuè lái yuè dà.", "Nhu cầu ngày càng lớn."],
    ["供应", "gōngyìng", "Cung ứng", "供应不够。", "Gōngyìng bú gòu.", "Cung không đủ."],
    ["取决于", "qǔjuéyú", "Phụ thuộc vào", "价格取决于需求。", "Jiàgé qǔjuéyú xūqiú.", "Giá phụ thuộc nhu cầu."],
  ], ["取决于 + danh từ", "取决于 + N", "取决于: phụ thuộc vào. 取决于需求、取决于质量.", [
    ["Dịch: Giá hơi cao.", "价格有点儿高。"],
    ["Dịch: Thương hiệu này rất nổi tiếng.", "这个品牌很有名。"],
    ["Dịch: Nhu cầu ngày càng lớn.", "需求越来越大。"],
    ["Dịch: Giá phụ thuộc nhu cầu.", "价格取决于需求。"],
  ]], [
    ["A", "这个品牌的价格为什么高？", "Zhège pǐnpái de jiàgé wèishénme gāo?", "Giá thương hiệu này sao cao?"],
    ["B", "取决于质量和需求。", "Qǔjuéyú zhìliàng hé xūqiú.", "Phụ thuộc chất lượng và nhu cầu."],
    ["A", "供应够吗？", "Gōngyìng gòu ma?", "Cung có đủ không?"],
    ["B", "不够。所以价格提高了。", "Bú gòu. Suǒyǐ jiàgé tígāo le.", "Không đủ. Nên giá tăng."],
  ], [
    ["Tự viết: Giá hơi cao.", "价格有点儿高。"],
    ["Tự viết: Giá phụ thuộc nhu cầu.", "价格取决于需求。"],
  ], "Nói giá, thương hiệu, nhu cầu và cung.", "这个品牌的价格为什么高？"),
  mk(262, "Bán hàng", "learn", [
    ["销售", "xiāoshòu", "Bán hàng", "我负责销售。", "Wǒ fùzé xiāoshòu.", "Tôi phụ trách bán hàng."],
    ["广告", "guǎnggào", "Quảng cáo", "广告太多了。", "Guǎnggào tài duō le.", "Quảng cáo quá nhiều."],
    ["促销", "cùxiāo", "Khuyến mãi", "这周有促销。", "Zhè zhōu yǒu cùxiāo.", "Tuần này có khuyến mãi."],
    ["折扣", "zhékòu", "Chiết khấu", "可以给折扣吗？", "Kěyǐ gěi zhékòu ma?", "Có thể giảm giá không?"],
    ["客户", "kèhù", "Khách hàng", "客户很重要。", "Kèhù hěn zhòngyào.", "Khách hàng rất quan trọng."],
  ], ["给 + 客户", "给 + 客户 + N", "给客户折扣: giảm giá cho khách.", [
    ["Dịch: Tôi phụ trách bán hàng.", "我负责销售。"],
    ["Dịch: Tuần này có khuyến mãi.", "这周有促销。"],
    ["Dịch: Có thể giảm giá không?", "可以给折扣吗？"],
    ["Dịch: Khách hàng rất quan trọng.", "客户很重要。"],
  ]], [
    ["A", "给客户什么折扣？", "Gěi kèhù shénme zhékòu?", "Giảm giá gì cho khách?"],
    ["B", "促销的时候有折扣。广告已经发布了。", "Cùxiāo de shíhou yǒu zhékòu. Guǎnggào yǐjīng fābù le.", "Khi khuyến mãi có giảm. Quảng cáo đã đăng."],
    ["A", "销售怎么样？", "Xiāoshòu zěnmeyàng?", "Bán hàng thế nào?"],
    ["B", "还可以。客户需要好产品。", "Hái kěyǐ. Kèhù xūyào hǎo chǎnpǐn.", "Ổn. Khách cần sản phẩm tốt."],
  ], [
    ["Tự viết: Tuần này có khuyến mãi.", "这周有促销。"],
    ["Tự viết: Có thể giảm giá không?", "可以给折扣吗？"],
  ], "Khuyến mãi, quảng cáo, giảm giá cho khách hàng.", "给客户什么折扣？"),
  mk(263, "Thương mại", "learn", [
    ["企业", "qǐyè", "Doanh nghiệp", "这是一家大企业。", "Zhè shì yì jiā dà qǐyè.", "Đây là một doanh nghiệp lớn."],
    ["贸易", "màoyì", "Thương mại", "两国贸易很多。", "Liǎng guó màoyì hěn duō.", "Hai nước thương mại nhiều."],
    ["出口", "chūkǒu", "Xuất khẩu", "这些产品出口。", "Zhèxiē chǎnpǐn chūkǒu.", "Các sản phẩm này xuất khẩu."],
    ["进口", "jìnkǒu", "Nhập khẩu", "我们进口材料。", "Wǒmen jìnkǒu cáiliào.", "Chúng ta nhập vật liệu."],
    ["汇率", "huìlǜ", "Tỷ giá", "汇率在改变。", "Huìlǜ zài gǎibiàn.", "Tỷ giá đang thay đổi."],
  ], ["出口 / 进口", "出口 / 进口 + N", "出口产品、进口材料.", [
    ["Dịch: Đây là một doanh nghiệp lớn.", "这是一家大企业。"],
    ["Dịch: Các sản phẩm này xuất khẩu.", "这些产品出口。"],
    ["Dịch: Chúng ta nhập vật liệu.", "我们进口材料。"],
    ["Dịch: Tỷ giá đang thay đổi.", "汇率在改变。"],
  ]], [
    ["A", "你们企业做出口还是进口？", "Nǐmen qǐyè zuò chūkǒu háishi jìnkǒu?", "Doanh nghiệp các bạn xuất hay nhập?"],
    ["B", "都做。贸易取决于汇率。", "Dōu zuò. Màoyì qǔjuéyú huìlǜ.", "Làm cả. Thương mại phụ thuộc tỷ giá."],
    ["A", "现在汇率怎么样？", "Xiànzài huìlǜ zěnmeyàng?", "Tỷ giá hiện tại thế nào?"],
    ["B", "有变化。我们还在观察市场。", "Yǒu biànhuà. Wǒmen hái zài guānchá shìchǎng.", "Có biến. Chúng tôi còn quan sát thị trường."],
  ], [
    ["Tự viết: Các sản phẩm này xuất khẩu.", "这些产品出口。"],
    ["Tự viết: Chúng ta nhập vật liệu.", "我们进口材料。"],
  ], "Nói xuất nhập khẩu, doanh nghiệp và tỷ giá.", "你们企业做出口还是进口？"),
  mk(264, "Rủi ro", "learn", [
    ["随着", "suízhe", "Cùng với", "随着市场发展，需求提高。", "Suízhe shìchǎng fāzhǎn, xūqiú tígāo.", "Cùng thị trường phát triển, nhu cầu tăng."],
    ["利润", "lìrùn", "Lợi nhuận", "利润不多。", "Lìrùn bù duō.", "Lợi nhuận không nhiều."],
    ["成本", "chéngběn", "Chi phí", "成本太高了。", "Chéngběn tài gāo le.", "Chi phí quá cao."],
    ["风险", "fēngxiǎn", "Rủi ro", "这个投资有风险。", "Zhège tóuzī yǒu fēngxiǎn.", "Đầu tư này có rủi ro."],
    ["收益", "shōuyì", "Thu lợi", "收益取决于市场。", "Shōuyì qǔjuéyú shìchǎng.", "Thu lợi phụ thuộc thị trường."],
  ], ["随着…", "随着 + N / V", "随着: cùng với. 随着市场发展.", [
    ["Dịch: Cùng thị trường phát triển, nhu cầu tăng.", "随着市场发展，需求提高。"],
    ["Dịch: Lợi nhuận không nhiều.", "利润不多。"],
    ["Dịch: Chi phí quá cao.", "成本太高了。"],
    ["Dịch: Đầu tư này có rủi ro.", "这个投资有风险。"],
  ]], [
    ["A", "随着成本提高，利润怎么样？", "Suízhe chéngběn tígāo, lìrùn zěnmeyàng?", "Cùng chi phí tăng, lợi nhuận thế nào?"],
    ["B", "利润少了。收益也有风险。", "Lìrùn shǎo le. Shōuyì yě yǒu fēngxiǎn.", "Lợi nhuận giảm. Thu lợi cũng có rủi ro."],
    ["A", "还投资吗？", "Hái tóuzī ma?", "Còn đầu tư không?"],
    ["B", "先看市场，再判断。", "Xiān kàn shìchǎng, zài pànduàn.", "Xem thị trường trước, rồi phán đoán."],
  ], [
    ["Tự viết: Chi phí quá cao.", "成本太高了。"],
    ["Tự viết: Đầu tư này có rủi ro.", "这个投资有风险。"],
  ], "Nói chi phí, lợi nhuận, rủi ro khi thị trường đổi.", "随着成本提高，利润怎么样？"),
  mk(265, "Tổng hợp kinh tế", "review", [
    ["随着", "suízhe", "Cùng với (ôn)", "随着市场改变。", "Suízhe shìchǎng gǎibiàn.", "Cùng thị trường đổi."],
    ["取决于", "qǔjuéyú", "Phụ thuộc (ôn)", "取决于质量。", "Qǔjuéyú zhìliàng.", "Phụ thuộc chất lượng."],
    ["产品", "chǎnpǐn", "Sản phẩm (ôn)", "选择产品。", "Xuǎnzé chǎnpǐn.", "Chọn sản phẩm."],
    ["客户", "kèhù", "Khách hàng (ôn)", "给客户折扣。", "Gěi kèhù zhékòu.", "Giảm giá cho khách."],
    ["品牌", "pǐnpái", "Thương hiệu (ôn)", "有名的品牌。", "Yǒumíng de pǐnpái.", "Thương hiệu nổi tiếng."],
  ], ["随着 / 取决于", "随着…；取决于 + N", "Ôn tuần 38: chọn sản phẩm.", [
    ["Dịch: Cùng thị trường đổi.", "随着市场改变。"],
    ["Dịch: Phụ thuộc chất lượng.", "取决于质量。"],
    ["Dịch: Chọn sản phẩm.", "选择产品。"],
    ["Dịch: Giảm giá cho khách.", "给客户折扣。"],
  ]], [
    ["A", "怎么选择产品？", "Zěnme xuǎnzé chǎnpǐn?", "Chọn sản phẩm thế nào?"],
    ["B", "取决于质量和价格。品牌也重要。", "Qǔjuéyú zhìliàng hé jiàgé. Pǐnpái yě zhòngyào.", "Phụ thuộc chất lượng và giá. Thương hiệu cũng quan trọng."],
    ["A", "随着促销，客户多吗？", "Suízhe cùxiāo, kèhù duō ma?", "Cùng khuyến mãi, khách có đông không?"],
    ["B", "多。销售提高了。", "Duō. Xiāoshòu tígāo le.", "Đông. Bán hàng tăng."],
  ], [
    ["Tự viết: Phụ thuộc chất lượng.", "取决于质量。"],
    ["Tự viết: Giảm giá cho khách.", "给客户折扣。"],
  ], "Chọn sản phẩm: chất lượng, giá, thương hiệu, khuyến mãi.", "怎么选择产品？"),
  mk(266, "Nhân viên bán vs khách", "review", [
    ["销售", "xiāoshòu", "Bán hàng (ôn)", "负责销售。", "Fùzé xiāoshòu.", "Phụ trách bán hàng."],
    ["折扣", "zhékòu", "Chiết khấu (ôn)", "给折扣。", "Gěi zhékòu.", "Cho giảm giá."],
    ["广告", "guǎnggào", "Quảng cáo (ôn)", "看广告。", "Kàn guǎnggào.", "Xem quảng cáo."],
    ["投资", "tóuzī", "Đầu tư (ôn)", "想投资。", "Xiǎng tóuzī.", "Muốn đầu tư."],
    ["风险", "fēngxiǎn", "Rủi ro (ôn)", "有风险。", "Yǒu fēngxiǎn.", "Có rủi ro."],
  ], ["Chỉ kinh tế", "随着 / 取决于 / 给客户", "Roleplay nhân viên bán vs khách. Khoá từ đến tuần 38.", [
    ["Dịch: Phụ trách bán hàng.", "负责销售。"],
    ["Dịch: Cho giảm giá.", "给折扣。"],
    ["Dịch: Xem quảng cáo.", "看广告。"],
    ["Dịch: Có rủi ro.", "有风险。"],
  ]], [
    ["A", "欢迎。这周促销，可以给折扣。", "Huānyíng. Zhè zhōu cùxiāo, kěyǐ gěi zhékòu.", "Hoan nghênh. Tuần này khuyến mãi, có thể giảm giá."],
    ["B", "质量怎么样？价格取决于什么？", "Zhìliàng zěnmeyàng? Jiàgé qǔjuéyú shénme?", "Chất lượng thế nào? Giá phụ thuộc gì?"],
    ["A", "取决于品牌和成本。投资也有风险。", "Qǔjuéyú pǐnpái hé chéngběn. Tóuzī yě yǒu fēngxiǎn.", "Phụ thuộc thương hiệu và chi phí. Đầu tư cũng có rủi ro."],
    ["B", "好。我先看看产品。", "Hǎo. Wǒ xiān kànkan chǎnpǐn.", "Được. Tôi xem sản phẩm trước."],
  ], [
    ["Tự viết: Tuần này khuyến mãi, có thể giảm giá.", "这周促销，可以给折扣。"],
    ["Tự viết: Có rủi ro.", "有风险。"],
  ], "Bán hàng: khuyến mãi, chất lượng, giá và rủi ro.", "欢迎。这周促销，可以给折扣。"),
  mk(267, "尽管 / 否则", "learn", [
    ["尽管", "jǐnguǎn", "Mặc dù", "尽管很难，我还做。", "Jǐnguǎn hěn nán, wǒ hái zuò.", "Dù khó, tôi vẫn làm."],
    ["然而", "rán'ér", "Tuy nhiên", "工作好，然而压力大。", "Gōngzuò hǎo, rán'ér yālì dà.", "Việc tốt, tuy nhiên áp lực lớn."],
    ["否则", "fǒuzé", "Nếu không thì", "快点，否则来不及。", "Kuài diǎn, fǒuzé lái bu jí.", "Nhanh lên, không thì không kịp."],
    ["除非", "chúfēi", "Trừ khi", "除非下雨，否则我们去。", "Chúfēi xià yǔ, fǒuzé wǒmen qù.", "Trừ khi mưa, không thì chúng ta đi."],
    ["以便", "yǐbiàn", "Để mà", "早点出发，以便不迟到。", "Zǎo diǎn chūfā, yǐbiàn bù chídào.", "Xuất phát sớm để không muộn."],
  ], ["尽管…但是…", "尽管…，但是 / 还是…", "尽管: mặc dù. 尽管很难，还是要做.", [
    ["Dịch: Dù khó, tôi vẫn làm.", "尽管很难，我还做。"],
    ["Dịch: Việc tốt, tuy nhiên áp lực lớn.", "工作好，然而压力大。"],
    ["Dịch: Nhanh lên, không thì không kịp.", "快点，否则来不及。"],
    ["Dịch: Trừ khi mưa, không thì chúng ta đi.", "除非下雨，否则我们去。"],
  ]], [
    ["A", "尽管压力大，你还加班吗？", "Jǐnguǎn yālì dà, nǐ hái jiābān ma?", "Dù áp lực lớn, bạn vẫn làm thêm à?"],
    ["B", "加班，以便完成项目。否则不能晋升。", "Jiābān, yǐbiàn wánchéng xiàngmù. Fǒuzé bù néng jìnshēng.", "Làm thêm để xong dự án. Không thì không thăng chức."],
    ["A", "除非领导同意，否则别走。", "Chúfēi lǐngdǎo tóngyì, fǒuzé bié zǒu.", "Trừ khi lãnh đạo đồng ý, không thì đừng đi."],
    ["B", "好。然而我也需要休息。", "Hǎo. Rán'ér wǒ yě xūyào xiūxi.", "Được. Tuy nhiên tôi cũng cần nghỉ."],
  ], [
    ["Tự viết: Dù khó, tôi vẫn làm.", "尽管很难，我还做。"],
    ["Tự viết: Nhanh lên, không thì không kịp.", "快点，否则来不及。"],
  ], "Dù khó vẫn làm: 尽管, 否则, 除非, 以便.", "尽管压力大，你还加班吗？"),
  mk(268, "与其 / 从而", "learn", [
    ["与其", "yǔqí", "Thà rằng", "与其等待，不如开始。", "Yǔqí děngdài, bùrú kāishǐ.", "Thà bắt đầu còn hơn đợi."],
    ["不如", "bùrú", "Không bằng", "坐车不如走路。", "Zuò chē bùrú zǒu lù.", "Ngồi xe không bằng đi bộ."],
    ["以免", "yǐmiǎn", "Để tránh", "早点儿走，以免迟到。", "Zǎo diǎnr zǒu, yǐmiǎn chídào.", "Đi sớm để tránh muộn."],
    ["至于", "zhìyú", "Còn về", "至于价格，还可以。", "Zhìyú jiàgé, hái kěyǐ.", "Còn về giá thì ổn."],
    ["从而", "cóng'ér", "Từ đó mà", "努力学习，从而进步。", "Nǔlì xuéxí, cóng'ér jìnbù.", "Học chăm, từ đó tiến bộ."],
  ], ["与其…不如…", "与其 + V，不如 + V", "与其…不如…: thà… còn hơn. 与其等待，不如开始.", [
    ["Dịch: Thà bắt đầu còn hơn đợi.", "与其等待，不如开始。"],
    ["Dịch: Ngồi xe không bằng đi bộ.", "坐车不如走路。"],
    ["Dịch: Đi sớm để tránh muộn.", "早点儿走，以免迟到。"],
    ["Dịch: Học chăm, từ đó tiến bộ.", "努力学习，从而进步。"],
  ]], [
    ["A", "与其争论，不如客观分析。", "Yǔqí zhēnglùn, bùrú kèguān fēnxī.", "Thà phân tích khách quan còn hơn tranh luận."],
    ["B", "对。从而可以表明观点。", "Duì. Cóng'ér kěyǐ biǎomíng guāndiǎn.", "Đúng. Từ đó có thể bày tỏ quan điểm."],
    ["A", "至于标题，要清楚，以免有偏见。", "Zhìyú biāotí, yào qīngchu, yǐmiǎn yǒu piānjiàn.", "Còn tiêu đề phải rõ, để tránh thành kiến."],
    ["B", "好。我现在开始写。", "Hǎo. Wǒ xiànzài kāishǐ xiě.", "Được. Tôi bắt đầu viết ngay."],
  ], [
    ["Tự viết: Thà bắt đầu còn hơn đợi.", "与其等待，不如开始。"],
    ["Tự viết: Còn về giá thì ổn.", "至于价格，还可以。"],
  ], "Chọn cách tốt hơn: 与其不如, 以免, 从而, 至于.", "与其争论，不如客观分析。"),
  mk(269, "之所以", "learn", [
    ["之所以", "zhīsuǒyǐ", "Sở dĩ", "我之所以来，是因为工作。", "Wǒ zhīsuǒyǐ lái, shì yīnwèi gōngzuò.", "Sở dĩ tôi đến là vì việc."],
    ["可见", "kějiàn", "Có thể thấy", "可见这个问题重要。", "Kějiàn zhège wèntí zhòngyào.", "Có thể thấy vấn đề này quan trọng."],
    ["总之", "zǒngzhī", "Tóm lại", "总之，我们要合作。", "Zǒngzhī, wǒmen yào hézuò.", "Tóm lại, chúng ta phải hợp tác."],
    ["此外", "cǐwài", "Ngoài ra", "此外，还要提高效率。", "Cǐwài, hái yào tígāo xiàolǜ.", "Ngoài ra còn phải nâng hiệu suất."],
    ["例如", "lìrú", "Ví dụ", "例如这个项目。", "Lìrú zhège xiàngmù.", "Ví dụ dự án này."],
  ], ["之所以…是因为…", "之所以…，是因为…", "Sở dĩ… là vì…. 我之所以来，是因为工作.", [
    ["Dịch: Sở dĩ tôi đến là vì việc.", "我之所以来，是因为工作。"],
    ["Dịch: Có thể thấy vấn đề này quan trọng.", "可见这个问题重要。"],
    ["Dịch: Tóm lại, chúng ta phải hợp tác.", "总之，我们要合作。"],
    ["Dịch: Ví dụ dự án này.", "例如这个项目。"],
  ]], [
    ["A", "你之所以加班，是因为什么？", "Nǐ zhīsuǒyǐ jiābān, shì yīnwèi shénme?", "Sở dĩ bạn làm thêm là vì gì?"],
    ["B", "是因为项目。例如明天要发布。", "Shì yīnwèi xiàngmù. Lìrú míngtiān yào fābù.", "Vì dự án. Ví dụ ngày mai phải đăng."],
    ["A", "可见压力很大。此外呢？", "Kějiàn yālì hěn dà. Cǐwài ne?", "Thấy áp lực lớn. Ngoài ra?"],
    ["B", "总之，面对挑战就好。", "Zǒngzhī, miànduì tiǎozhàn jiù hǎo.", "Tóm lại, đối mặt thách thức là được."],
  ], [
    ["Tự viết: Sở dĩ tôi đến là vì việc.", "我之所以来，是因为工作。"],
    ["Tự viết: Tóm lại, chúng ta phải hợp tác.", "总之，我们要合作。"],
  ], "Giải thích lý do: 之所以是因为, 可见, 总之, 例如.", "你之所以加班，是因为什么？"),
  mk(270, "Giả định", "learn", [
    ["假如", "jiǎrú", "Nếu như", "假如下雨，我们就不去。", "Jiǎrú xià yǔ, wǒmen jiù bú qù.", "Nếu mưa thì chúng ta không đi."],
    ["一旦", "yídàn", "Một khi", "一旦决定，就要完成。", "Yídàn juédìng, jiù yào wánchéng.", "Một khi quyết thì phải xong."],
    ["万一", "wànyī", "Nhỡ mà", "万一失败，怎么办？", "Wànyī shībài, zěnme bàn?", "Nhỡ thất bại thì sao?"],
    ["倘若", "tǎngruò", "Nếu như (trang trọng)", "倘若有时间，请来。", "Tǎngruò yǒu shíjiān, qǐng lái.", "Nếu có thời gian, xin đến."],
    ["始终", "shǐzhōng", "Trước sau / luôn", "他始终很努力。", "Tā shǐzhōng hěn nǔlì.", "Anh ấy luôn rất cố gắng."],
  ], ["假如 / 一旦", "假如 / 一旦 + câu，就…", "假如、一旦: nếu / một khi. 一旦决定，就要完成.", [
    ["Dịch: Nếu mưa thì chúng ta không đi.", "假如下雨，我们就不去。"],
    ["Dịch: Một khi quyết thì phải xong.", "一旦决定，就要完成。"],
    ["Dịch: Nhỡ thất bại thì sao?", "万一失败，怎么办？"],
    ["Dịch: Anh ấy luôn rất cố gắng.", "他始终很努力。"],
  ]], [
    ["A", "假如市场改变，你还投资吗？", "Jiǎrú shìchǎng gǎibiàn, nǐ hái tóuzī ma?", "Nếu thị trường đổi, bạn còn đầu tư không?"],
    ["B", "一旦有风险，我就观察。万一失败，再想办法。", "Yídàn yǒu fēngxiǎn, wǒ jiù guānchá. Wànyī shībài, zài xiǎng bànfǎ.", "Một khi có rủi ro tôi quan sát. Nhỡ thất bại, nghĩ cách khác."],
    ["A", "你始终这么判断吗？", "Nǐ shǐzhōng zhème pànduàn ma?", "Bạn luôn phán đoán vậy à?"],
    ["B", "对。倘若数据不准，结论就不可靠。", "Duì. Tǎngruò shùjù bù zhǔn, jiélùn jiù bù kěkào.", "Đúng. Nếu dữ liệu không chính, kết luận không đáng tin."],
  ], [
    ["Tự viết: Nếu mưa thì chúng ta không đi.", "假如下雨，我们就不去。"],
    ["Tự viết: Một khi quyết thì phải xong.", "一旦决定，就要完成。"],
  ], "Giả định: 假如, 一旦, 万一, 始终.", "假如市场改变，你还投资吗？"),
  mk(271, "Sắc thái", "learn", [
    ["反而", "fǎn'ér", "Ngược lại", "不但没进步，反而更累。", "Búdàn méi jìnbù, fǎn'ér gèng lèi.", "Không những không tiến, ngược lại còn mệt hơn."],
    ["何必", "hébì", "Cần gì phải", "何必着急？", "Hébì zháojí?", "Cần gì phải sốt ruột?"],
    ["不妨", "bùfáng", "Không ngại gì", "不妨试试。", "Bùfáng shìshi.", "Không ngại thử."],
    ["毕竟", "bìjìng", "Dù sao thì", "毕竟这是挑战。", "Bìjìng zhè shì tiǎozhàn.", "Dù sao đây cũng là thách thức."],
    ["何况", "hékuàng", "Huống chi", "我都累，何况他。", "Wǒ dōu lèi, hékuàng tā.", "Tôi còn mệt, huống chi anh ấy."],
  ], ["不但不…反而…", "不但不 / 没…，反而…", "不但没…反而…: không những không… ngược lại….", [
    ["Dịch: Không những không tiến, ngược lại còn mệt hơn.", "不但没进步，反而更累。"],
    ["Dịch: Cần gì phải sốt ruột?", "何必着急？"],
    ["Dịch: Không ngại thử.", "不妨试试。"],
    ["Dịch: Dù sao đây cũng là thách thức.", "毕竟这是挑战。"],
  ]], [
    ["A", "何必这么着急？不妨先思考。", "Hébì zhème zháojí? Bùfáng xiān sīkǎo.", "Cần gì sốt ruột? Không ngại suy nghĩ trước."],
    ["B", "毕竟项目重要。何况领导在等。", "Bìjìng xiàngmù zhòngyào. Hékuàng lǐngdǎo zài děng.", "Dù sao dự án quan trọng. Huống chi lãnh đạo đang đợi."],
    ["A", "尽管很难，也不要反而放弃。", "Jǐnguǎn hěn nán, yě bú yào fǎn'ér fàngqì.", "Dù khó cũng đừng ngược lại bỏ cuộc."],
    ["B", "好。与其着急，不如提高效率。", "Hǎo. Yǔqí zháojí, bùrú tígāo xiàolǜ.", "Được. Thà nâng hiệu suất còn hơn sốt ruột."],
  ], [
    ["Tự viết: Cần gì phải sốt ruột?", "何必着急？"],
    ["Tự viết: Không ngại thử.", "不妨试试。"],
  ], "Sắc thái: 反而, 何必, 不妨, 毕竟, 何况.", "何必这么着急？不妨先思考。"),
  mk(272, "Tổng hợp ngữ pháp", "review", [
    ["尽管", "jǐnguǎn", "Mặc dù (ôn)", "尽管很难。", "Jǐnguǎn hěn nán.", "Dù khó."],
    ["与其", "yǔqí", "Thà rằng (ôn)", "与其等待。", "Yǔqí děngdài.", "Thà đợi..."],
    ["之所以", "zhīsuǒyǐ", "Sở dĩ (ôn)", "之所以来。", "Zhīsuǒyǐ lái.", "Sở dĩ đến."],
    ["从而", "cóng'ér", "Từ đó (ôn)", "从而进步。", "Cóng'ér jìnbù.", "Từ đó tiến bộ."],
    ["总之", "zǒngzhī", "Tóm lại (ôn)", "总之要努力。", "Zǒngzhī yào nǔlì.", "Tóm lại phải cố."],
  ], ["尽管 / 与其", "尽管…；与其…不如…", "Ôn tuần 39: tranh luận ngắn.", [
    ["Dịch: Dù khó.", "尽管很难。"],
    ["Dịch: Thà đợi còn hơn bỏ.", "与其等待，不如开始。"],
    ["Dịch: Sở dĩ đến.", "之所以来。"],
    ["Dịch: Tóm lại phải cố.", "总之要努力。"],
  ]], [
    ["A", "尽管很难，与其放弃，不如继续。", "Jǐnguǎn hěn nán, yǔqí fàngqì, bùrú jìxù.", "Dù khó, thà tiếp tục còn hơn bỏ."],
    ["B", "对。我之所以来，是因为这个目标。", "Duì. Wǒ zhīsuǒyǐ lái, shì yīnwèi zhège mùbiāo.", "Đúng. Sở dĩ tôi đến là vì mục tiêu này."],
    ["A", "从而可以有成就。总之，面对挑战。", "Cóng'ér kěyǐ yǒu chéngjiù. Zǒngzhī, miànduì tiǎozhàn.", "Từ đó có thành tựu. Tóm lại, đối mặt thách thức."],
    ["B", "好。除非没办法，否则我做完。", "Hǎo. Chúfēi méi bànfǎ, fǒuzé wǒ zuò wán.", "Được. Trừ khi hết cách, không thì tôi làm xong."],
  ], [
    ["Tự viết: Dù khó vẫn làm.", "尽管很难，我还做。"],
    ["Tự viết: Thà bắt đầu còn hơn đợi.", "与其等待，不如开始。"],
  ], "Tranh luận ngắn dùng 尽管, 与其, 之所以, 从而.", "尽管很难，与其放弃，不如继续。"),
  mk(273, "Giải thích quyết định", "review", [
    ["除非", "chúfēi", "Trừ khi (ôn)", "除非下雨。", "Chúfēi xià yǔ.", "Trừ khi mưa."],
    ["否则", "fǒuzé", "Nếu không (ôn)", "否则不去。", "Fǒuzé bú qù.", "Không thì không đi."],
    ["反而", "fǎn'ér", "Ngược lại (ôn)", "反而更好。", "Fǎn'ér gèng hǎo.", "Ngược lại còn tốt hơn."],
    ["毕竟", "bìjìng", "Dù sao (ôn)", "毕竟重要。", "Bìjìng zhòngyào.", "Dù sao cũng quan trọng."],
    ["可见", "kějiàn", "Có thể thấy (ôn)", "可见清楚。", "Kějiàn qīngchu.", "Thấy là rõ."],
  ], ["Chỉ mẫu luận", "尽管 / 之所以 / 除非否则", "Roleplay giải thích quyết định. Khoá từ đến tuần 39.", [
    ["Dịch: Trừ khi mưa.", "除非下雨。"],
    ["Dịch: Không thì không đi.", "否则不去。"],
    ["Dịch: Ngược lại còn tốt hơn.", "反而更好。"],
    ["Dịch: Dù sao cũng quan trọng.", "毕竟重要。"],
  ]], [
    ["A", "你为什么选择这个职业？", "Nǐ wèishénme xuǎnzé zhège zhíyè?", "Vì sao bạn chọn nghề này?"],
    ["B", "我之所以选择，是因为兴趣。毕竟适合我。", "Wǒ zhīsuǒyǐ xuǎnzé, shì yīnwèi xìngqù. Bìjìng shìhé wǒ.", "Sở dĩ chọn là vì thích. Dù sao cũng phù hợp tôi."],
    ["A", "可见你想清楚了。除非失败，否则继续。", "Kějiàn nǐ xiǎng qīngchu le. Chúfēi shībài, fǒuzé jìxù.", "Thấy bạn nghĩ rõ. Trừ khi thất bại, không thì tiếp tục."],
    ["B", "对。困难反而让我进步。", "Duì. Kùnnan fǎn'ér ràng wǒ jìnbù.", "Đúng. Khó khăn ngược lại giúp tôi tiến."],
  ], [
    ["Tự viết: Trừ khi mưa, không thì chúng ta đi.", "除非下雨，否则我们去。"],
    ["Tự viết: Dù sao cũng quan trọng.", "毕竟重要。"],
  ], "Giải thích quyết định nghề nghiệp bằng mẫu luận HSK 5.", "你为什么选择这个职业？"),
  mk(274, "Ôn sự nghiệp", "review", [
    ["面对", "miànduì", "Đối mặt (ôn)", "面对压力。", "Miànduì yālì.", "Đối mặt áp lực."],
    ["承受", "chéngshòu", "Chịu đựng (ôn)", "承受挑战。", "Chéngshòu tiǎozhàn.", "Chịu thách thức."],
    ["目标", "mùbiāo", "Mục tiêu (ôn)", "完成目标。", "Wánchéng mùbiāo.", "Hoàn thành mục tiêu."],
    ["团队", "tuánduì", "Nhóm (ôn)", "团队合作。", "Tuánduì hézuò.", "Nhóm hợp tác."],
    ["效率", "xiàolǜ", "Hiệu suất (ôn)", "提高效率。", "Tígāo xiàolǜ.", "Nâng hiệu suất."],
  ], ["面对 承受", "面对 / 承受 + N", "Ôn sự nghiệp: áp lực và mục tiêu.", [
    ["Dịch: Đối mặt áp lực.", "面对压力。"],
    ["Dịch: Chịu thách thức.", "承受挑战。"],
    ["Dịch: Hoàn thành mục tiêu.", "完成目标。"],
    ["Dịch: Nâng hiệu suất.", "提高效率。"],
  ]], [
    ["A", "面对压力，你怎么承受？", "Miànduì yālì, nǐ zěnme chéngshòu?", "Đối mặt áp lực, bạn chịu thế nào?"],
    ["B", "跟团队合作，提高效率。", "Gēn tuánduì hézuò, tígāo xiàolǜ.", "Hợp tác với nhóm, nâng hiệu suất."],
    ["A", "目标完成了吗？", "Mùbiāo wánchéng le ma?", "Mục tiêu xong chưa?"],
    ["B", "还没有。尽管很难，我始终努力。", "Hái méiyǒu. Jǐnguǎn hěn nán, wǒ shǐzhōng nǔlì.", "Chưa. Dù khó, tôi luôn cố."],
  ], [
    ["Tự viết: Đối mặt áp lực.", "面对压力。"],
    ["Tự viết: Nâng hiệu suất.", "提高效率。"],
  ], "Ôn áp lực công việc, mục tiêu và hợp tác nhóm.", "面对压力，你怎么承受？"),
  mk(275, "Ôn xã hội", "review", [
    ["观点", "guāndiǎn", "Quan điểm (ôn)", "表明观点。", "Biǎomíng guāndiǎn.", "Bày tỏ quan điểm."],
    ["现象", "xiànxiàng", "Hiện tượng (ôn)", "社会现象。", "Shèhuì xiànxiàng.", "Hiện tượng xã hội."],
    ["媒体", "méitǐ", "Truyền thông (ôn)", "媒体分析。", "Méitǐ fēnxī.", "Truyền thông phân tích."],
    ["客观", "kèguān", "Khách quan (ôn)", "客观评价。", "Kèguān píngjià.", "Đánh giá khách quan."],
    ["公众", "gōngzhòng", "Công chúng (ôn)", "对公众来说。", "Duì gōngzhòng lái shuō.", "Đối với công chúng."],
  ], ["对…来说", "对 + người + 来说", "Ôn xã hội: thảo luận một hiện tượng.", [
    ["Dịch: Bày tỏ quan điểm.", "表明观点。"],
    ["Dịch: Hiện tượng xã hội.", "社会现象。"],
    ["Dịch: Đánh giá khách quan.", "客观评价。"],
    ["Dịch: Đối với công chúng thì quan trọng.", "对公众来说很重要。"],
  ]], [
    ["A", "对公众来说，这个现象说明什么？", "Duì gōngzhòng lái shuō, zhège xiànxiàng shuōmíng shénme?", "Với công chúng, hiện tượng này nói lên gì?"],
    ["B", "可见媒体影响很大。我们要客观。", "Kějiàn méitǐ yǐngxiǎng hěn dà. Wǒmen yào kèguān.", "Thấy truyền thông ảnh hưởng lớn. Chúng ta phải khách quan."],
    ["A", "你的观点呢？", "Nǐ de guāndiǎn ne?", "Quan điểm bạn?"],
    ["B", "与其争论，不如分析。", "Yǔqí zhēnglùn, bùrú fēnxī.", "Thà phân tích còn hơn tranh luận."],
  ], [
    ["Tự viết: Bày tỏ quan điểm.", "表明观点。"],
    ["Tự viết: Đánh giá khách quan.", "客观评价。"],
  ], "Thảo luận hiện tượng xã hội, nêu quan điểm khách quan.", "对公众来说，这个现象说明什么？"),
  mk(276, "Ôn giáo dục", "review", [
    ["培养", "péiyǎng", "Bồi dưỡng (ôn)", "培养能力。", "Péiyǎng nénglì.", "Bồi dưỡng năng lực."],
    ["体现", "tǐxiàn", "Thể hiện (ôn)", "体现风格。", "Tǐxiàn fēnggé.", "Thể hiện phong cách."],
    ["毕业", "bìyè", "Tốt nghiệp (ôn)", "快毕业了。", "Kuài bìyè le.", "Sắp tốt nghiệp."],
    ["欣赏", "xīnshǎng", "Thưởng thức (ôn)", "欣赏作品。", "Xīnshǎng zuòpǐn.", "Thưởng thức tác phẩm."],
    ["独立", "dúlì", "Độc lập (ôn)", "独立思考。", "Dúlì sīkǎo.", "Suy nghĩ độc lập."],
  ], ["培养 体现", "培养 + N；体现 + N", "Ôn giáo dục và nghệ thuật.", [
    ["Dịch: Bồi dưỡng năng lực.", "培养能力。"],
    ["Dịch: Thể hiện phong cách.", "体现风格。"],
    ["Dịch: Sắp tốt nghiệp.", "快毕业了。"],
    ["Dịch: Suy nghĩ độc lập.", "独立思考。"],
  ]], [
    ["A", "毕业以前，你想去展览吗？", "Bìyè yǐqián, nǐ xiǎng qù zhǎnlǎn ma?", "Trước tốt nghiệp, bạn muốn đi triển lãm không?"],
    ["B", "想。通过欣赏作品培养思考。", "Xiǎng. Tōngguò xīnshǎng zuòpǐn péiyǎng sīkǎo.", "Muốn. Qua thưởng thức tác phẩm bồi dưỡng suy nghĩ."],
    ["A", "作品体现了什么？", "Zuòpǐn tǐxiàn le shénme?", "Tác phẩm thể hiện gì?"],
    ["B", "体现创新。我们要独立探索。", "Tǐxiàn chuàngxīn. Wǒmen yào dúlì tànsuǒ.", "Thể hiện đổi mới. Chúng ta phải khám phá độc lập."],
  ], [
    ["Tự viết: Bồi dưỡng năng lực.", "培养能力。"],
    ["Tự viết: Thưởng thức tác phẩm.", "欣赏作品。"],
  ], "Học rồi xem triển lãm: bồi dưỡng, thưởng thức, thể hiện.", "毕业以前，你想去展览吗？"),
  mk(277, "Ôn khoa học", "review", [
    ["根据", "gēnjù", "Dựa theo (ôn)", "根据数据。", "Gēnjù shùjù.", "Dựa theo dữ liệu."],
    ["随着", "suízhe", "Cùng với (ôn)", "随着市场。", "Suízhe shìchǎng.", "Cùng với thị trường."],
    ["导致", "dǎozhì", "Dẫn đến (ôn)", "导致变化。", "Dǎozhì biànhuà.", "Dẫn đến thay đổi."],
    ["市场", "shìchǎng", "Thị trường (ôn)", "观察市场。", "Guānchá shìchǎng.", "Quan sát thị trường."],
    ["质量", "zhìliàng", "Chất lượng (ôn)", "产品质量。", "Chǎnpǐn zhìliàng.", "Chất lượng sản phẩm."],
  ], ["根据 随着", "根据 + N；随着…", "Ôn khoa học và kinh tế.", [
    ["Dịch: Dựa theo dữ liệu.", "根据数据。"],
    ["Dịch: Cùng với thị trường.", "随着市场。"],
    ["Dịch: Dẫn đến thay đổi.", "导致变化。"],
    ["Dịch: Quan sát thị trường.", "观察市场。"],
  ]], [
    ["A", "根据数据，市场怎么样？", "Gēnjù shùjù, shìchǎng zěnmeyàng?", "Dựa dữ liệu, thị trường thế nào?"],
    ["B", "随着需求提高，价格也高了。", "Suízhe xūqiú tígāo, jiàgé yě gāo le.", "Cùng nhu cầu tăng, giá cũng cao."],
    ["A", "这导致什么？", "Zhè dǎozhì shénme?", "Điều này dẫn đến gì?"],
    ["B", "企业更重视质量。", "Qǐyè gèng zhòngshì zhìliàng.", "Doanh nghiệp coi trọng chất lượng hơn."],
  ], [
    ["Tự viết: Dựa theo dữ liệu.", "根据数据。"],
    ["Tự viết: Quan sát thị trường.", "观察市场。"],
  ], "Số liệu và thị trường: theo dữ liệu, cùng nhu cầu, chất lượng.", "根据数据，市场怎么样？"),
  mk(278, "Ôn ngữ pháp", "review", [
    ["尽管", "jǐnguǎn", "Mặc dù (ôn)", "尽管很难。", "Jǐnguǎn hěn nán.", "Dù khó."],
    ["之所以", "zhīsuǒyǐ", "Sở dĩ (ôn)", "之所以选择。", "Zhīsuǒyǐ xuǎnzé.", "Sở dĩ chọn."],
    ["除非", "chúfēi", "Trừ khi (ôn)", "除非同意。", "Chúfēi tóngyì.", "Trừ khi đồng ý."],
    ["从而", "cóng'ér", "Từ đó (ôn)", "从而成功。", "Cóng'ér chénggōng.", "Từ đó thành công."],
    ["毕竟", "bìjìng", "Dù sao (ôn)", "毕竟重要。", "Bìjìng zhòngyào.", "Dù sao cũng quan trọng."],
  ], ["尽管 之所以", "尽管…；之所以…是因为…", "Ôn ngữ pháp luận: giải thích lựa chọn.", [
    ["Dịch: Dù khó.", "尽管很难。"],
    ["Dịch: Sở dĩ chọn.", "之所以选择。"],
    ["Dịch: Trừ khi đồng ý.", "除非同意。"],
    ["Dịch: Dù sao cũng quan trọng.", "毕竟重要。"],
  ]], [
    ["A", "你之所以选择这个目标，是因为什么？", "Nǐ zhīsuǒyǐ xuǎnzé zhège mùbiāo, shì yīnwèi shénme?", "Sở dĩ bạn chọn mục tiêu này là vì gì?"],
    ["B", "因为适合我。尽管很难，毕竟值得。", "Yīnwèi shìhé wǒ. Jǐnguǎn hěn nán, bìjìng zhíde.", "Vì phù hợp tôi. Dù khó, dù sao cũng đáng."],
    ["A", "从而你会有成就。除非放弃，否则继续。", "Cóng'ér nǐ huì yǒu chéngjiù. Chúfēi fàngqì, fǒuzé jìxù.", "Từ đó bạn sẽ có thành tựu. Trừ khi bỏ, không thì tiếp tục."],
    ["B", "好。我始终面对挑战。", "Hǎo. Wǒ shǐzhōng miànduì tiǎozhàn.", "Được. Tôi luôn đối mặt thách thức."],
  ], [
    ["Tự viết: Sở dĩ chọn là vì phù hợp.", "我之所以选择，是因为适合。"],
    ["Tự viết: Dù khó vẫn làm.", "尽管很难，我还做。"],
  ], "Giải thích lựa chọn bằng 尽管 và 之所以.", "你之所以选择这个目标，是因为什么？"),
  mk(279, "Mock mini-test", "review", [
    ["可见", "kějiàn", "Có thể thấy (ôn)", "可见清楚。", "Kějiàn qīngchu.", "Thấy là rõ."],
    ["总之", "zǒngzhī", "Tóm lại (ôn)", "总之努力。", "Zǒngzhī nǔlì.", "Tóm lại hãy cố."],
    ["例如", "lìrú", "Ví dụ (ôn)", "例如这个。", "Lìrú zhège.", "Ví dụ cái này."],
    ["假设", "jiǎshè", "Giả thuyết (ôn)", "假设准确。", "Jiǎshè zhǔnquè.", "Giả sử chính xác."],
    ["评价", "píngjià", "Đánh giá (ôn)", "客观评价。", "Kèguān píngjià.", "Đánh giá khách quan."],
  ], ["Nghe + đọc hiểu ngắn", "HSK 5 mẫu luận", "Mock mini-test ~799 từ. Nghe + đọc hiểu câu luận.", [
    ["Dịch: Thấy là rõ.", "可见清楚。"],
    ["Dịch: Tóm lại hãy cố.", "总之努力。"],
    ["Dịch: Ví dụ cái này.", "例如这个。"],
    ["Dịch: Đánh giá khách quan.", "客观评价。"],
  ]], [
    ["A", "请直接回答：之所以成功，是因为什么？", "Qǐng zhíjiē huídá: zhīsuǒyǐ chénggōng, shì yīnwèi shénme?", "Trả lời trực tiếp: sở dĩ thành công là vì gì?"],
    ["B", "因为始终努力。例如面对压力。", "Yīnwèi shǐzhōng nǔlì. Lìrú miànduì yālì.", "Vì luôn cố. Ví dụ đối mặt áp lực."],
    ["A", "可见方法对。总之要客观评价。", "Kějiàn fāngfǎ duì. Zǒngzhī yào kèguān píngjià.", "Thấy cách đúng. Tóm lại phải đánh giá khách quan."],
    ["B", "假设再有挑战，我也能承受。", "Jiǎshè zài yǒu tiǎozhàn, wǒ yě néng chéngshòu.", "Giả sử còn thách thức, tôi cũng chịu được."],
  ], [
    ["Tự viết: Sở dĩ thành công là vì luôn cố.", "之所以成功，是因为始终努力。"],
    ["Tự viết: Tóm lại phải đánh giá khách quan.", "总之要客观评价。"],
  ], "Mini-test: trả lời trực tiếp câu ngữ pháp HSK 5.", "请直接回答：之所以成功，是因为什么？"),
  mk(280, "AI tốt nghiệp", "review", [
    ["项目", "xiàngmù", "Dự án (ôn)", "讨论项目。", "Tǎolùn xiàngmù.", "Thảo luận dự án."],
    ["合作", "hézuò", "Hợp tác (ôn)", "团队合作。", "Tuánduì hézuò.", "Nhóm hợp tác."],
    ["创新", "chuàngxīn", "Đổi mới (ôn)", "需要创新。", "Xūyào chuàngxīn.", "Cần đổi mới."],
    ["成果", "chéngguǒ", "Thành quả (ôn)", "展示成果。", "Zhǎnshì chéngguǒ.", "Trình bày thành quả."],
    ["挑战", "tiǎozhàn", "Thách thức (ôn)", "面对挑战。", "Miànduì tiǎozhàn.", "Đối mặt thách thức."],
  ], ["HSK 1–5 toàn mẫu", "HSK 1–5 toàn mẫu", "Tốt nghiệp HSK 5: thuyết trình dự án nhóm. Chỉ từ đã khoá.", [
    ["Dịch: Thảo luận dự án.", "讨论项目。"],
    ["Dịch: Nhóm hợp tác.", "团队合作。"],
    ["Dịch: Cần đổi mới.", "需要创新。"],
    ["Dịch: Đối mặt thách thức.", "面对挑战。"],
  ]], [
    ["A", "我们讨论一下新项目。谁负责？", "Wǒmen tǎolùn yíxià xīn xiàngmù. Shéi fùzé?", "Thảo luận dự án mới. Ai phụ trách?"],
    ["B", "我负责。尽管很难，团队会合作。", "Wǒ fùzé. Jǐnguǎn hěn nán, tuánduì huì hézuò.", "Tôi phụ trách. Dù khó, nhóm sẽ hợp tác."],
    ["A", "之所以选这个目标，是因为需要创新。", "Zhīsuǒyǐ xuǎn zhège mùbiāo, shì yīnwèi xūyào chuàngxīn.", "Sở dĩ chọn mục tiêu này là vì cần đổi mới."],
    ["B", "好。面对挑战，从而展示成果。", "Hǎo. Miànduì tiǎozhàn, cóng'ér zhǎnshì chéngguǒ.", "Được. Đối mặt thách thức, từ đó trình bày thành quả."],
  ], [
    ["Tự viết: Thảo luận dự án mới. Tôi phụ trách.", "讨论新项目。我负责。"],
    ["Tự viết: Dù khó, nhóm sẽ hợp tác.", "尽管很难，团队会合作。"],
  ], "Thuyết trình dự án nhóm: phân công, đổi mới, thành quả.", "我们讨论一下新项目。谁负责？"),
];

function weekOf(id) {
  return Math.ceil(id / 7);
}

function systemPrompt(level, words, start) {
  return `Bạn là bạn nói tiếng Trung trình độ HSK ${level}. Chỉ dùng các từ: ${words.join(", ")}. Mỗi lượt 1–2 câu ngắn. Viết Hán + pinyin. Nếu học viên sai, sửa nhẹ bằng tiếng Việt rồi hỏi lại. Không thêm từ mới. Bắt đầu bằng: ${start}`;
}

const hsk4 = JSON.parse(readFileSync(join(dir, "224.json"), "utf8"));
let allowed = [...hsk4.aiPrompt.allowedWords];

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
    hsk: 5,
    theme: lesson.theme,
    kind: lesson.kind,
    vocab: lesson.vocab,
    grammar: lesson.grammar,
    dialogue: lesson.dialogue,
    exercises: lesson.exercises,
    aiPrompt: {
      scenario: lesson.scenario,
      system: systemPrompt(5, allowed, lesson.start),
      allowedWords: [...allowed],
      turns: 5,
    },
    timer: TIMER,
  };
  const name = `${String(lesson.id).padStart(3, "0")}.json`;
  writeFileSync(join(dir, name), `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(`Wrote ${LESSONS.length} lessons, last allowed ${allowed.length} words`);
