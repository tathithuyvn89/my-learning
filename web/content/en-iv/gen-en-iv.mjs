import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
mkdirSync(dir, { recursive: true });

const TIMER = { review: 4, vocab: 5, grammar: 8, talk: 8, ai: 5 };

const METHOD =
  "Ẩn chữ. Nghe 1–2 lần (video hoặc TTS). Làm task. Mới mở transcript. Shadow 3 lượt: nghe → nói theo → nói một mình.";

const V1 = {
  title: "How to: Work at Google — Example Coding/Engineering Interview",
  url: "https://www.youtube.com/watch?v=XKu_SEDKoi8",
  watchFrom: "0:00",
  watchTo: "2:00",
  whyVi: "Coding interview mở bài. Nghe cách restatement và nghĩ to, không gõ im lặng.",
};
const V2 = {
  title: "ByteByteGo — Design a URL Shortener",
  url: "https://www.youtube.com/watch?v=JPD84tQFP0I",
  watchFrom: "0:00",
  watchTo: "2:00",
  whyVi: "System design mở: requirements rồi high-level. Nghe scale / API, không chép kiến thức.",
};
const V3 = {
  title: "How successful software engineers answer Tell me about yourself",
  url: "https://www.youtube.com/watch?v=0PN_W-7fBRo",
  watchFrom: "0:00",
  watchTo: "2:00",
  whyVi: "Intro/behavioral. Chép Present → Past → Future rồi nói bản của bạn, không đọc CV mẫu.",
};

function p(en, note, vi, exEn, exVi, slot) {
  const item = { en, note, vi, example: { en: exEn, vi: exVi } };
  if (slot) item.slot = slot;
  else if (en.includes("…")) {
    item.slot = en.replaceAll("…", " ___").replaceAll(/\s+/g, " ").trim();
  }
  return item;
}

function d(speaker, en, vi) {
  return { speaker, en, vi };
}

function sys(scenario, phrases, extra = "") {
  const list = phrases.map((item) => item.en).join("; ");
  return `You are a software interviewer at a foreign company. Speak natural interview English. Keep each turn to 1–2 short sentences. You MAY use extra interview English so the learner practices listening. Interrupt with a follow-up. Nudge the learner to use these phrases: ${list}. Ask about their real experience. Wait for the learner to reply. Scenario: ${scenario}${extra ? ` ${extra}` : ""}`;
}

function listen(title, video, unseen, tasks) {
  return { title, video: video ?? null, unseen, tasks, methodVi: METHOD };
}

function gist(prompt, answer) {
  return { type: "gist", prompt, answer };
}
function cloze(prompt, answer) {
  return { type: "cloze", prompt, answer };
}
function repair(prompt, answer) {
  return { type: "repair", prompt, answer };
}

function lesson({
  id,
  week,
  theme,
  kind,
  phrases,
  pattern,
  dialogue,
  scenario,
  extra = "",
  listen: listenBlock,
}) {
  return {
    id,
    week,
    theme,
    kind,
    phrases,
    pattern,
    listen: listenBlock,
    dialogue,
    exercises: pattern.drills.slice(0, 2).map((item) => ({
      type: "say",
      prompt: item.prompt,
      answer: item.answer,
    })),
    aiPrompt: {
      scenario,
      system: sys(scenario, phrases, extra),
      allowedPhrases: phrases.map((item) => item.en),
      turns: 8,
    },
    timer: TIMER,
  };
}

const w1 = {
  1: [
    p("Let me restate the problem", "Clarify: nói lại đề trước khi gõ. Không nhảy vào code.", "Mình restated đề nhé", "Let me restate the problem in my own words.", "Mình restated đề bằng lời mình."),
    p("What are the constraints?", "Hỏi constraint: n, memory, sorted?.", "Constraint là gì ạ?", "What are the constraints on n?", "n tối đa bao nhiêu ạ?"),
    p("Can I assume…?", "Xin giả định. Tốt hơn im rồi sai.", "Mình giả định… được không?", "Can I assume the array is unsorted?", "Mình giả định mảng chưa sort được không?"),
    p("Can I use an example?", "Xin 1 input mẫu nếu đề khô.", "Mình lấy một ví dụ được không?", "Can I use an example before I code?", "Mình lấy ví dụ trước khi code được không?"),
    p("So the input is…", "Chốt input/output. Interviewer gật rồi mới code.", "Vậy input là…", "So the input is an array of ints, output is the index.", "Input là mảng int, output là index."),
  ],
  2: [
    p("Let me think out loud", "Báo sẽ nghĩ to. Đừng gõ im 3 phút.", "Mình nghĩ to nhé", "Let me think out loud for a bit.", "Mình nghĩ to một chút."),
    p("I'll start with a brute force", "Luôn có phương án 1. Dù xấu.", "Mình bắt đầu bằng brute force", "I'll start with a brute force, then optimize.", "Mình brute force trước, rồi optimize."),
    p("Then I'd optimize", "Bước 2 sau brute force.", "Rồi mình optimize", "Then I'd optimize with a hash map.", "Rồi optimize bằng hash map."),
    p("First I'd…", "Bước nhỏ đầu. Một câu.", "Đầu tiên mình sẽ…", "First I'd scan once and count.", "Đầu tiên mình scan một lượt rồi đếm."),
    p("Does that approach make sense?", "Check với interviewer trước khi gõ nhiều.", "Hướng đó ổn chứ ạ?", "Does that approach make sense before I code?", "Hướng này ổn trước khi mình code chứ ạ?"),
  ],
  3: [
    p("Time is O(…)", "Nói big-O time. Điền n / n log n.", "Time là O(…)", "Time is O(n log n) after the sort.", "Time là O(n log n) sau sort.", "Time is O(___)."),
    p("Space is O(…)", "Nói extra space.", "Space là O(…)", "Space is O(n) for the map.", "Space là O(n) cho map.", "Space is O(___)."),
    p("That would TLE if…", "Khi brute force không đủ.", "Cái đó TLE nếu…", "That would TLE if n is a million.", "TLE nếu n một triệu."),
    p("We can do better", "Chuyển sang phương án 2.", "Mình làm tốt hơn được", "We can do better than nested loops.", "Tốt hơn nested loop được."),
    p("That's acceptable for n = …", "Khi O(n) là đủ.", "Với n = … thì chấp nhận được", "That's acceptable for n = 10^5.", "n = 10^5 thì chấp nhận được."),
  ],
  4: [
    p("Let me trace this", "Dry-run trước khi tuyên bố xong.", "Mình trace cái này", "Let me trace this on the example.", "Mình trace trên ví dụ."),
    p("For this input…", "Chỉ input đang trace.", "Với input này…", "For this input [1, 2, 3], i starts at 0.", "Input [1,2,3], i bắt đầu 0."),
    p("That's an off-by-one", "Tự bắt lỗi index. Nghe senior.", "Đó là off-by-one", "That's an off-by-one — I should stop at n-1.", "Off-by-one — phải dừng ở n-1."),
    p("I'll dry-run the example", "Xin 30 giây chạy tay.", "Mình dry-run ví dụ", "I'll dry-run the example on the board.", "Mình dry-run ví dụ trên bảng."),
    p("That matches the expected output", "Chốt trace đúng.", "Khớp output kỳ vọng", "That matches the expected output, 4.", "Khớp output kỳ vọng, 4."),
  ],
  5: [
    p("I'm not sure yet", "Kẹt. Nói thật, đừng bịa.", "Mình chưa chắc", "I'm not sure yet — give me a second.", "Mình chưa chắc — cho mình giây lát."),
    p("Give me 20 seconds", "Xin thời gian nghĩ. Tốt hơn im.", "Cho mình 20 giây", "Give me 20 seconds to think.", "Cho mình 20 giây nghĩ."),
    p("I'd look that up", "API / syntax. Không giả vờ nhớ.", "Mình sẽ tra cái đó", "I'd look that up — the exact map API.", "Mình tra — đúng API của map."),
    p("Let me try a smaller case", "Thu nhỏ đề khi stuck.", "Mình thử case nhỏ hơn", "Let me try a smaller case, n = 2.", "Mình thử case nhỏ, n = 2."),
    p("I might be missing something", "Mời interviewer gợi ý, không cầu cứu.", "Mình có thể đang miss gì đó", "I might be missing something on duplicates.", "Mình có thể miss phần trùng."),
  ],
};

const w2 = {
  8: [
    p("Let's start with requirements", "Design: đừng vẽ DB trước.", "Mình bắt đầu từ requirements", "Let's start with requirements before the boxes.", "Requirements trước, rồi mới vẽ hộp."),
    p("Functional requirements", "User làm được gì.", "Functional requirements", "Functional: create a short URL and redirect.", "Functional: tạo short URL và redirect."),
    p("Non-functional requirements", "Scale, latency, consistency.", "Non-functional requirements", "Non-functional: low latency reads, 100M URLs.", "Non-functional: đọc nhanh, 100 triệu URL."),
    p("What's the scale?", "Hỏi QPS / storage. Đừng đoán thầm.", "Scale cỡ nào ạ?", "What's the scale — QPS and storage?", "Scale thế nào — QPS và storage ạ?"),
    p("Any latency target?", "Hỏi SLO. Một số.", "Có mục tiêu latency không ạ?", "Any latency target for the redirect?", "Redirect có mục tiêu latency không ạ?"),
  ],
  9: [
    p("I'd sketch this first", "Báo sẽ vẽ high-level.", "Mình sketch cái này trước", "I'd sketch this first, four boxes.", "Mình sketch bốn hộp trước."),
    p("Clients talk to…", "Entry: client → API.", "Client nói chuyện với…", "Clients talk to an API gateway.", "Client nói với API gateway."),
    p("I'd draw an API layer", "Hộp API. Đừng nhảy DB.", "Mình vẽ lớp API", "I'd draw an API layer in front of the service.", "Mình vẽ API trước service."),
    p("Store goes in…", "Chỗ lưu. Một câu.", "Phần lưu nằm ở…", "Store goes in a key-value store.", "Lưu ở key-value store."),
    p("High-level, we have…", "Tóm 3–4 hộp.", "High-level mình có…", "High-level, we have clients, API, store, cache.", "High-level: client, API, store, cache."),
  ],
  10: [
    p("I'd pick X because…", "Chọn rồi nói lý do. Một lý do.", "Mình chọn X vì…", "I'd pick Postgres because we need joins.", "Mình chọn Postgres vì cần join."),
    p("The downside is…", "Luôn có downside. Đừng bán hàng.", "Nhược điểm là…", "The downside is write throughput.", "Nhược điểm là write throughput."),
    p("We could also…", "Phương án 2, không defend forever.", "Mình cũng có thể…", "We could also use a key-value store.", "Cũng có thể dùng key-value store."),
    p("Trade-off is…", "Nêu trục trade-off.", "Trade-off là…", "Trade-off is consistency vs availability.", "Trade-off là consistency và availability."),
    p("I'd rather keep it simple", "Khi over-design. Senior.", "Mình nghiêng về giữ đơn giản", "I'd rather keep it simple for v1.", "V1 mình giữ đơn giản."),
  ],
  11: [
    p("This breaks when…", "Nói điều kiện vỡ. Có số thì tốt.", "Cái này vỡ khi…", "This breaks when writes hit one shard.", "Vỡ khi write dồn một shard."),
    p("The bottleneck is…", "Chỉ bottleneck, đừng liệt kê 8 cái.", "Bottleneck là…", "The bottleneck is the redirect read path.", "Bottleneck là đường đọc redirect."),
    p("I'd cache…", "Một lớp cache, nói key.", "Mình sẽ cache…", "I'd cache the short-to-long mapping.", "Mình cache map short → long."),
    p("We'd shard by…", "Shard key. Đừng nói shard xong im.", "Mình shard theo…", "We'd shard by the short key hash.", "Shard theo hash của short key."),
    p("To scale reads…", "Đọc nhiều hơn ghi.", "Để scale read…", "To scale reads, add replicas and a cache.", "Scale read: replica + cache."),
  ],
  12: [
    p("I haven't operated this in prod", "Gap thật. Không bịa Kafka cluster.", "Mình chưa vận hành cái này trên prod", "I haven't operated Kafka in prod.", "Mình chưa vận hành Kafka trên prod."),
    p("I'd ask the team", "Khi không chắc ops.", "Mình sẽ hỏi team", "I'd ask the team how they page on this.", "Mình hỏi team họ page việc này thế nào."),
    p("I know the idea, not the ops", "Tách kiến thức sách / thực chiến.", "Mình biết ý tưởng, chưa biết ops", "I know the idea, not the ops of sharding.", "Mình biết ý sharding, chưa biết ops."),
    p("I'd read the runbook first", "Khi oncall phần lạ.", "Mình đọc runbook trước", "I'd read the runbook first, then change anything.", "Mình đọc runbook trước, rồi mới đụng."),
    p("I'm not an expert here", "Một câu, rồi vẫn đề xuất hướng.", "Mình không phải expert phần này", "I'm not an expert here, but I'd start with metrics.", "Không expert, nhưng mình bắt đầu từ metric."),
  ],
};

const w3 = {
  15: [
    p("I disagreed", "Conflict: nói thẳng đã không đồng ý.", "Mình không đồng ý", "I disagreed with shipping without a flag.", "Mình không đồng ý ship khi chưa có flag."),
    p("I stated the risk", "STAR A: nói risk, không cá nhân.", "Mình nêu risk", "I stated the risk of a bad deploy on Friday.", "Mình nêu risk deploy thứ Sáu."),
    p("We aligned on…", "Kết: không I won.", "Hai bên thống nhất…", "We aligned on a flag and a Monday ship.", "Thống nhất flag và ship thứ Hai."),
    p("I pushed back because…", "Lý do push-back. Một câu.", "Mình push back vì…", "I pushed back because we had no rollback.", "Push back vì chưa có rollback."),
    p("In the end we…", "Kết quả chung, không win/lose.", "Cuối cùng mình…", "In the end we delayed one day and it was fine.", "Cuối cùng delay một ngày, ổn."),
  ],
  16: [
    p("What I missed was…", "Failure: miss của mình, không họ.", "Mình miss…", "What I missed was the null path in retry.", "Mình miss nhánh null lúc retry."),
    p("I owned the miss", "Nhận. Không The test didn't catch it as excuse duy nhất.", "Mình nhận miss đó", "I owned the miss — I should have added a test.", "Mình nhận — lẽ ra phải thêm test."),
    p("The impact was…", "Số hoặc user impact.", "Impact là…", "The impact was 20 minutes of failed checkouts.", "Impact: 20 phút checkout fail."),
    p("What I changed after", "Hành động sau. Một thay đổi.", "Sau đó mình đổi…", "What I changed after: a checklist before merge.", "Sau đó: checklist trước merge."),
    p("Next time I'd…", "Hướng khác. Cụ thể.", "Lần sau mình sẽ…", "Next time I'd page earlier.", "Lần sau mình page sớm hơn."),
  ],
  17: [
    p("I'm looking for…", "Why us: cụ thể, không growth.", "Mình đang tìm…", "I'm looking for more ownership on backend.", "Mình tìm ownership backend nhiều hơn."),
    p("This role…", "Gắn JD. Một điểm.", "Role này…", "This role owns payments, which matches what I do.", "Role này own payments, khớp việc mình làm."),
    p("Why I'm leaving is…", "Không chê sếp. Hướng tới.", "Lý do mình đi là…", "Why I'm leaving is I've hit the ceiling on scope.", "Mình đi vì scope đã chạm trần."),
    p("What I want next is…", "Mục tiêu 12–18 tháng.", "Mình muốn tiếp theo là…", "What I want next is to own a service end to end.", "Tiếp theo mình muốn own một service end to end."),
    p("That's why I applied", "Chốt. Một hơi.", "Vì vậy mình apply", "That's why I applied to this team.", "Vì vậy mình apply team này."),
  ],
  18: [
    p("I haven't used X in prod", "Gap stack. Điền tool thật.", "Mình chưa dùng X trên prod", "I haven't used Kubernetes in prod.", "Mình chưa dùng Kubernetes trên prod.", "I haven't used ___ in prod."),
    p("I've used something similar", "Cầu nối. Đừng fake.", "Mình đã dùng cái tương tự", "I've used something similar — Docker Compose and ECS.", "Mình dùng cái tương tự — Compose và ECS."),
    p("I'd ramp by…", "Kế hoạch 30 ngày. Cụ thể.", "Mình ramp bằng…", "I'd ramp by pairing on on-call the first month.", "Ramp: pair on-call tháng đầu."),
    p("Give me a week on the docs", "Xin thời gian học, có hạn.", "Cho mình một tuần với docs", "Give me a week on the docs and I'll be useful.", "Một tuần với docs là mình hữu ích."),
    p("I'm honest about the gap", "Chốt. Interviewer ghét bluff.", "Mình nói thẳng gap", "I'm honest about the gap — I haven't run k8s.", "Nói thẳng — mình chưa chạy k8s."),
  ],
  19: [
    p("I'm targeting…", "Band lương. Số của bạn, đừng bịa trên app.", "Mình targeting…", "I'm targeting 2.4 to 2.8 billion VND total.", "Mình targeting 2.4–2.8 tỷ total.", "I'm targeting ___."),
    p("What's the range for this level?", "Hỏi band. Lịch sự.", "Range level này là sao ạ?", "What's the range for this level in Vietnam / remote?", "Range level này ở VN / remote sao ạ?"),
    p("Notice period is…", "Số tuần thật.", "Notice period là…", "Notice period is 30 days.", "Notice 30 ngày.", "Notice period is ___."),
    p("I'm flexible on title", "Title vs scope. Một câu.", "Title mình linh hoạt", "I'm flexible on title if the scope is right.", "Title linh hoạt nếu scope đúng."),
    p("Total comp, not just base", "Nhắc equity/bonus. Không hỏi sớm vòng 1 trừ khi họ hỏi.", "Total comp, không chỉ base", "I care about total comp, not just base.", "Mình nhìn total, không chỉ base."),
  ],
};

function pick(days, bank) {
  return days
    .flatMap((day) => bank[day].slice(0, 1))
    .concat(
      days.length >= 5
        ? [bank[days[0]][1], bank[days[2]][1]].filter(Boolean)
        : [],
    )
    .slice(0, 5);
}

function drills(items) {
  return items.map((item) => ({
    prompt: item.slot
      ? `Nói việc thật hôm nay: ${item.slot}`
      : `Nói to, đừng chỉ đọc thầm: ${item.vi}`,
    answer: item.en,
  }));
}

function L(title, video, lines, tasks) {
  return listen(title, video, lines, tasks);
}

const lessons = [
  lesson({
    id: 1, week: 1, theme: "Clarify", kind: "learn", phrases: w1[1],
    pattern: {
      title: "Restate then constraints",
      pattern: "Let me restate the problem → What are the constraints? / Can I assume…? → So the input is…",
      explainVi: "Trước khi gõ: restated đề, hỏi constraint, xin giả định, chốt input/output. Không nhảy vào code.",
      drills: drills(w1[1]).slice(0, 4),
    },
    dialogue: [
      d("B", "Let's start with two-sum. Any questions?", "Bắt đầu two-sum. Hỏi gì không?"),
      d("A", "Let me restate the problem in my own words.", "Mình restated đề bằng lời mình."),
      d("A", "Return two indices that add up to a target.", "Trả hai index cộng thành target."),
      d("A", "What are the constraints on n?", "n tối đa bao nhiêu ạ?"),
      d("B", "Up to 10^5. Can be duplicates.", "Tới 10^5. Có thể trùng."),
      d("A", "Can I assume the array is unsorted?", "Giả định mảng chưa sort được không?"),
      d("B", "Yes. Unsorted.", "Ừ. Chưa sort."),
      d("A", "So the input is an array of ints, output is the two indices. Can I use an example?", "Input mảng int, output hai index. Lấy ví dụ được không?"),
    ],
    listen: L(
      "Interviewer mở bài coding",
      V1,
      [
        d("B", "You have 25 minutes. Two-sum variant, then follow-ups.", "25 phút. Two-sum variant, rồi follow-up."),
        d("A", "Let me restate the problem. Find a pair that sums to target.", "Mình restated. Tìm cặp cộng thành target."),
        d("B", "Right. What are the constraints?", "Đúng. Constraint?"),
        d("A", "Can I assume n is up to a million?", "n tới một triệu được không?"),
        d("B", "No — 10^4. Integers can be negative.", "Không — 10^4. Int có thể âm."),
        d("A", "Can I use an example? [2, 7, 11] target 9.", "Lấy ví dụ? [2,7,11] target 9."),
        d("B", "Yes. So the input is that array, output is indices 0 and 1.", "Ừ. Input mảng đó, output index 0 và 1."),
        d("A", "Got it. I'll think out loud next.", "Rõ. Lát mình nghĩ to."),
      ],
      [
        gist("Video 0:00–2:00: ghi 1 việc candidate làm trước khi gõ code.", "Restate / clarify / ask questions (hoặc tương đương trong clip)"),
        cloze("Trong hội thoại lạ, n tối đa là bao nhiêu?", "10^4"),
        cloze("Integer có được âm không?", "Có"),
      ],
    ),
    scenario: "Coding interview opening. Push the learner to restate a REAL problem they know, then ask constraints.",
  }),
  lesson({
    id: 2, week: 1, theme: "Think out loud", kind: "learn", phrases: w1[2],
    pattern: {
      title: "Brute force then optimize",
      pattern: "Let me think out loud → I'll start with a brute force → Then I'd optimize → Does that approach make sense?",
      explainVi: "Nói hướng trước khi gõ: brute force, rồi optimize, hỏi interviewer có ổn không.",
      drills: drills(w1[2]).slice(0, 4),
    },
    dialogue: [
      d("A", "Let me think out loud for a bit.", "Mình nghĩ to một chút."),
      d("A", "I'll start with a brute force: check every pair.", "Brute force: kiểm mọi cặp."),
      d("B", "Okay — then what?", "Ok — rồi sao?"),
      d("A", "Then I'd optimize with a hash map of value to index.", "Rồi optimize bằng map value → index."),
      d("A", "First I'd scan once and store what I need.", "Đầu tiên scan một lượt, lưu cái cần."),
      d("A", "Does that approach make sense before I code?", "Hướng này ổn trước khi code chứ ạ?"),
      d("B", "Yes. Watch duplicates.", "Ừ. Coi trùng."),
      d("A", "Got it — I'll skip using the same index twice.", "Rõ — không dùng cùng index hai lần."),
    ],
    listen: L(
      "Interviewer cắt khi bạn nghĩ to",
      null,
      [
        d("A", "Let me think out loud. Nested loops first.", "Mình nghĩ to. Nested loop trước."),
        d("B", "That's fine. What's the next step?", "Được. Bước tiếp?"),
        d("A", "I'll start with a brute force, then I'd optimize.", "Brute force rồi optimize."),
        d("B", "How?", "Bằng gì?"),
        d("A", "Then I'd optimize with a set of seen values.", "Optimize bằng set các giá trị đã thấy."),
        d("A", "First I'd walk left to right.", "Đầu tiên đi trái sang phải."),
        d("B", "Does that approach make sense on duplicates?", "Hướng đó ổn với trùng không?"),
        d("A", "I'd store counts, not just presence. Does that approach make sense?", "Mình lưu count, không chỉ có/không. Ổn chứ ạ?"),
      ],
      [
        gist("Phương án 2 dùng gì?", "Set / hash của giá trị đã thấy, rồi counts khi trùng"),
        cloze("Interviewer cắt ở điểm nào?", "Duplicates / trùng"),
        repair("Nếu miss follow-up, bạn nói gì?", "Could you repeat that? / Let me think out loud"),
      ],
    ),
    scenario: "You explain brute force then optimize on a problem you actually know. The interviewer interrupts once.",
  }),
  lesson({
    id: 3, week: 1, theme: "Complexity", kind: "learn", phrases: w1[3],
    pattern: {
      title: "Time and space out loud",
      pattern: "Time is O(…) · Space is O(…) · That would TLE if… / That's acceptable for n = …",
      explainVi: "Sau hướng: nói time, space, khi nào TLE, khi nào chấp nhận được. Điền n thật.",
      drills: drills(w1[3]).slice(0, 4),
    },
    dialogue: [
      d("B", "Complexity?", "Độ phức tạp?"),
      d("A", "Time is O(n) after one pass.", "Time O(n) một lượt."),
      d("A", "Space is O(n) for the map.", "Space O(n) cho map."),
      d("B", "What about the nested version?", "Còn bản nested?"),
      d("A", "That would TLE if n is a million.", "TLE nếu n một triệu."),
      d("A", "We can do better than nested loops.", "Tốt hơn nested loop được."),
      d("A", "That's acceptable for n = 10^5.", "n = 10^5 thì chấp nhận được."),
      d("B", "Good. Code the linear one.", "Ổn. Code bản tuyến tính."),
    ],
    listen: L(
      "Interviewer hỏi big-O nhanh",
      null,
      [
        d("B", "Before you type — time and space.", "Trước khi gõ — time và space."),
        d("A", "Time is O(n log n) if I sort first.", "Time O(n log n) nếu sort trước."),
        d("A", "Space is O(1) extra if I sort in place.", "Space O(1) extra nếu sort tại chỗ."),
        d("B", "And if n is 10^7?", "n 10^7 thì sao?"),
        d("A", "That would TLE if we sort on a tight limit.", "Sort sẽ TLE nếu limit chặt."),
        d("A", "We can do better with a linear scan.", "Làm tốt hơn bằng scan tuyến tính."),
        d("B", "Is O(n) okay here?", "O(n) ổn chứ?"),
        d("A", "That's acceptable for n = 10^5. I'd skip the sort.", "n = 10^5 thì ổn. Mình bỏ sort."),
      ],
      [
        gist("Vì sao sort có thể TLE?", "n lớn / 10^7 / limit chặt"),
        cloze("Space của sort in-place?", "O(1) extra"),
        cloze("n nào được nêu là chấp nhận O(n)?", "10^5"),
      ],
    ),
    scenario: "Ask for time and space of the learner's last coding approach. Interrupt if they skip space.",
  }),
  lesson({
    id: 4, week: 1, theme: "Walkthrough", kind: "learn", phrases: w1[4],
    pattern: {
      title: "Dry-run the example",
      pattern: "Let me trace this → For this input… → That's an off-by-one / That matches the expected output",
      explainVi: "Chạy tay một example. Tự bắt off-by-one. Chốt khớp output.",
      drills: drills(w1[4]).slice(0, 4),
    },
    dialogue: [
      d("A", "I'll dry-run the example on the board.", "Mình dry-run ví dụ trên bảng."),
      d("A", "For this input [1, 2, 3], i starts at 0.", "Input [1,2,3], i bắt đầu 0."),
      d("B", "Where do you stop?", "Dừng ở đâu?"),
      d("A", "That's an off-by-one — I should stop at n-1.", "Off-by-one — dừng ở n-1."),
      d("A", "Let me trace this again after the fix.", "Mình trace lại sau khi sửa."),
      d("A", "i = 0, 1, then stop. Sum is 6.", "i = 0, 1, rồi dừng. Tổng 6."),
      d("A", "That matches the expected output, 6.", "Khớp output kỳ vọng, 6."),
      d("B", "Good catch. Keep going.", "Bắt hay. Làm tiếp."),
    ],
    listen: L(
      "Dry-run bị interviewer cắt",
      null,
      [
        d("A", "Let me trace this on [2, 7, 11], target 9.", "Mình trace [2,7,11], target 9."),
        d("A", "For this input, I put 2 in the map.", "Input này, mình bỏ 2 vào map."),
        d("B", "Index?", "Index?"),
        d("A", "Index 0. Then 7, need 2 — found.", "Index 0. Rồi 7, cần 2 — thấy."),
        d("B", "Loop bound?", "Biên loop?"),
        d("A", "That's an off-by-one if I go to n. I'll stop at n-1.", "Off-by-one nếu tới n. Dừng n-1."),
        d("A", "I'll dry-run the example once more. Output 0 and 1.", "Dry-run thêm lần. Output 0 và 1."),
        d("A", "That matches the expected output.", "Khớp output kỳ vọng."),
      ],
      [
        gist("Cặp index đúng là gì?", "0 và 1"),
        cloze("Lỗi loop nào được nhắc?", "Off-by-one"),
        cloze("Target là bao nhiêu?", "9"),
      ],
    ),
    scenario: "Walk through one example out loud. Catch an off-by-one. Use a real snippet if the learner has one.",
  }),
  lesson({
    id: 5, week: 1, theme: "Stuck", kind: "learn", phrases: w1[5],
    pattern: {
      title: "Stuck without freezing",
      pattern: "I'm not sure yet → Give me 20 seconds → Let me try a smaller case / I'd look that up",
      explainVi: "Kẹt: nói chưa chắc, xin 20 giây, thử case nhỏ, hoặc nói sẽ tra. Không im, không bịa.",
      drills: drills(w1[5]).slice(0, 4),
    },
    dialogue: [
      d("B", "What if there are duplicates?", "Nếu có trùng thì sao?"),
      d("A", "I'm not sure yet — give me a second.", "Mình chưa chắc — cho mình giây lát."),
      d("A", "Give me 20 seconds to think.", "Cho mình 20 giây nghĩ."),
      d("A", "Let me try a smaller case, n = 2.", "Thử case nhỏ, n = 2."),
      d("B", "Map API?", "API của map?"),
      d("A", "I'd look that up — the exact map API.", "Mình tra — đúng API map."),
      d("A", "I might be missing something on duplicates.", "Mình có thể miss phần trùng."),
      d("B", "Store counts. Then continue.", "Lưu count. Rồi làm tiếp."),
    ],
    listen: L(
      "Kẹt khi interviewer follow-up",
      null,
      [
        d("B", "Negative numbers?", "Số âm?"),
        d("A", "I'm not sure yet.", "Mình chưa chắc."),
        d("A", "Give me 20 seconds.", "Cho mình 20 giây."),
        d("A", "Let me try a smaller case: [-1, 2], target 1.", "Case nhỏ: [-1,2], target 1."),
        d("B", "What's the JavaScript map method you want?", "Bạn muốn method map JS nào?"),
        d("A", "I'd look that up. I mean set vs object.", "Mình tra. Ý là set với object."),
        d("A", "I might be missing something if zero is allowed.", "Có thể miss nếu 0 được phép."),
        d("B", "Zero is allowed. Keep going.", "0 được. Làm tiếp."),
      ],
      [
        gist("Learner xin gì khi kẹt?", "20 seconds / case nhỏ / look up"),
        cloze("Case nhỏ dùng mảng nào?", "[-1, 2]"),
        cloze("Zero có được phép không?", "Có"),
      ],
    ),
    scenario: "The learner gets stuck on a follow-up. They must speak, not freeze. Use a real gap they have.",
  }),
];

const reviewWeek1 = pick([1, 2, 3, 4, 5], w1);
lessons.push(
  lesson({
    id: 6, week: 1, theme: "Tổng hợp tuần 1", kind: "review", phrases: reviewWeek1,
    pattern: {
      title: "Một vòng coding nói",
      pattern: "Restate → brute force → time/space → trace",
      explainVi: "Ghép tuần 1: clarify, nghĩ to, complexity, dry-run. Không thêm cụm mới.",
      drills: drills(reviewWeek1).slice(0, 4),
    },
    dialogue: [
      d("A", "Let me restate the problem. Two indices, one target.", "Mình restated. Hai index, một target."),
      d("A", "What are the constraints?", "Constraint?"),
      d("B", "n is 10^5.", "n 10^5."),
      d("A", "I'll start with a brute force, then I'd optimize.", "Brute rồi optimize."),
      d("A", "Time is O(n). Space is O(n).", "Time O(n). Space O(n)."),
      d("A", "Let me trace this on the example.", "Mình trace ví dụ."),
      d("A", "That matches the expected output.", "Khớp output."),
      d("B", "If you get stuck, say so.", "Kẹt thì nói."),
    ],
    listen: L(
      "Ghép một vòng coding",
      V1,
      [
        d("A", "Let me restate the problem.", "Mình restated đề."),
        d("A", "I'll start with a brute force.", "Mình brute force trước."),
        d("B", "Complexity of that?", "Độ phức tạp cái đó?"),
        d("A", "That would TLE if n is huge. Time is O(n) after the map.", "TLE nếu n lớn. Time O(n) sau map."),
        d("A", "Let me trace this.", "Mình trace."),
        d("A", "That's an off-by-one. Fixed.", "Off-by-one. Sửa rồi."),
        d("B", "Stuck on anything?", "Kẹt gì không?"),
        d("A", "I'm not sure yet on duplicates. Give me 20 seconds.", "Chưa chắc phần trùng. 20 giây."),
      ],
      [
        gist("Video 0:00–2:00: candidate nói hay im lúc đầu?", "Nói / hỏi / think out loud (tuỳ clip)"),
        cloze("Brute force TLE khi nào?", "n huge / n lớn"),
        cloze("Kẹt ở điểm nào?", "Duplicates / trùng"),
      ],
    ),
    scenario: "Full coding opener: restate, brute force, complexity, trace. Use a problem the learner actually knows.",
  }),
  lesson({
    id: 7, week: 1, theme: "AI live coding", kind: "review", phrases: reviewWeek1,
    pattern: {
      title: "Easy bài, interviewer cắt",
      pattern: "Clarify → think out loud → stuck phrases if needed",
      explainVi: "Mock một bài easy. Interviewer cắt ngang. Không thêm cụm. Không cần ra test pass — cần nói.",
      drills: drills(reviewWeek1).slice(0, 4),
    },
    dialogue: [
      d("B", "Reverse a string in place. Go.", "Reverse string tại chỗ. Làm đi."),
      d("A", "Let me restate the problem. Swap from both ends.", "Restated. Đổi hai đầu."),
      d("A", "Can I assume it's a mutable array of characters?", "Giả định mảng ký tự mutable được không?"),
      d("B", "Yes. Complexity?", "Ừ. Độ phức tạp?"),
      d("A", "Time is O(n). Space is O(1).", "Time O(n). Space O(1)."),
      d("B", "What if it's Unicode?", "Nếu Unicode thì sao?"),
      d("A", "I'm not sure yet. Give me 20 seconds.", "Chưa chắc. 20 giây."),
      d("A", "I'd look that up. For ASCII, two pointers.", "Mình tra. ASCII thì two pointer."),
    ],
    listen: L(
      "Interviewer cắt bài easy",
      null,
      [
        d("B", "Palindrome check. 15 minutes.", "Check palindrome. 15 phút."),
        d("A", "Let me restate the problem. Ignore spaces?", "Restated. Bỏ space chứ?"),
        d("B", "Keep letters only. Case insensitive.", "Chỉ chữ. Không phân hoa thường."),
        d("A", "I'll start with a brute force: reverse a copy.", "Brute: copy rồi reverse."),
        d("B", "Can we do better on space?", "Space làm tốt hơn được không?"),
        d("A", "Then I'd optimize with two pointers.", "Optimize two pointer."),
        d("B", "Empty string?", "Chuỗi rỗng?"),
        d("A", "I might be missing something. Empty is true. Let me trace this.", "Có thể miss. Rỗng là true. Mình trace."),
      ],
      [
        gist("Bài là gì?", "Palindrome check"),
        cloze("Empty string xử lý sao?", "True"),
        cloze("Optimize bằng gì?", "Two pointers"),
      ],
    ),
    scenario: "Easy live-coding mock. Interrupt twice. If they freeze, ask them to use I'm not sure yet.",
  }),
);

lessons.push(
  lesson({
    id: 8, week: 2, theme: "Requirements", kind: "learn", phrases: w2[8],
    pattern: {
      title: "Ask scale first",
      pattern: "Let's start with requirements → Functional / Non-functional → What's the scale? / Any latency target?",
      explainVi: "Design: requirements trước hộp. Hỏi scale và latency. Đừng vẽ DB ngay.",
      drills: drills(w2[8]).slice(0, 4),
    },
    dialogue: [
      d("B", "Design a URL shortener. 15 minutes.", "Design URL shortener. 15 phút."),
      d("A", "Let's start with requirements before the boxes.", "Requirements trước, rồi mới vẽ hộp."),
      d("A", "Functional: create a short URL and redirect.", "Functional: tạo short URL và redirect."),
      d("A", "Non-functional: low latency reads, 100M URLs.", "Non-functional: đọc nhanh, 100 triệu URL."),
      d("A", "What's the scale — QPS and storage?", "Scale thế nào — QPS và storage ạ?"),
      d("B", "Reads 10k QPS. Writes much less.", "Read 10k QPS. Write ít hơn nhiều."),
      d("A", "Any latency target for the redirect?", "Redirect có mục tiêu latency không ạ?"),
      d("B", "Under 50ms p99.", "Dưới 50ms p99."),
    ],
    listen: L(
      "Mở system design",
      V2,
      [
        d("B", "URL shortener. Don't jump to databases.", "URL shortener. Đừng nhảy tới database."),
        d("A", "Let's start with requirements.", "Bắt đầu từ requirements."),
        d("A", "Functional requirements: shorten and redirect.", "Functional: rút và redirect."),
        d("A", "Non-functional requirements: availability over perfect consistency.", "Non-functional: availability hơn consistency tuyệt đối."),
        d("A", "What's the scale?", "Scale cỡ nào ạ?"),
        d("B", "A hundred million URLs, mostly reads.", "100 triệu URL, chủ yếu đọc."),
        d("A", "Any latency target?", "Có mục tiêu latency không ạ?"),
        d("B", "Redirect should feel instant. Under 100ms.", "Redirect phải tức thì. Dưới 100ms."),
      ],
      [
        gist("Video 0:00–2:00: họ bắt đầu từ requirements hay từ DB?", "Requirements / high-level (tuỳ clip, không phải DB ngay)"),
        cloze("Chủ yếu read hay write?", "Read"),
        cloze("Latency redirect mục tiêu?", "Under 100ms / dưới 100ms"),
      ],
    ),
    scenario: "System design opening for URL shortener or notifications. Force requirements and scale questions.",
  }),
  lesson({
    id: 9, week: 2, theme: "High-level", kind: "learn", phrases: w2[9],
    pattern: {
      title: "Four boxes out loud",
      pattern: "I'd sketch this first → Clients talk to… → API → Store goes in…",
      explainVi: "Vẽ 4 hộp bằng lời: client, API, store, (cache). Đừng deep-dive một hộp quá sớm.",
      drills: drills(w2[9]).slice(0, 4),
    },
    dialogue: [
      d("A", "I'd sketch this first, four boxes.", "Mình sketch bốn hộp trước."),
      d("A", "Clients talk to an API gateway.", "Client nói với API gateway."),
      d("A", "I'd draw an API layer in front of the service.", "Mình vẽ API trước service."),
      d("A", "Store goes in a key-value store.", "Lưu ở key-value store."),
      d("A", "High-level, we have clients, API, store, cache.", "High-level: client, API, store, cache."),
      d("B", "Where does the cache sit?", "Cache nằm đâu?"),
      d("A", "In front of the store, on the read path.", "Trước store, trên đường đọc."),
      d("B", "Good. Don't drill into hash IDs yet.", "Ổn. Đừng đào hash ID vội."),
    ],
    listen: L(
      "Sketch high-level bị cắt",
      null,
      [
        d("A", "I'd sketch this first.", "Mình sketch trước."),
        d("A", "Clients talk to the API.", "Client nói với API."),
        d("B", "One service or two?", "Một service hay hai?"),
        d("A", "I'd draw an API layer, then a write service and a redirect service.", "Vẽ API, rồi service ghi và service redirect."),
        d("A", "Store goes in Redis plus Postgres for durable mapping.", "Lưu Redis cộng Postgres cho mapping bền."),
        d("B", "That's two stores already.", "Hai store rồi đó."),
        d("A", "High-level, we have clients, API, KV, cache. Postgres only if we need analytics.", "High-level: client, API, KV, cache. Postgres chỉ khi cần analytics."),
        d("B", "Keep v1 to one store.", "V1 giữ một store."),
      ],
      [
        gist("V1 interviewer muốn bao nhiêu store?", "Một"),
        cloze("Hai service được nêu là gì?", "Write và redirect"),
        cloze("Cache nằm trên path nào?", "Read"),
      ],
    ),
    scenario: "Describe four boxes for a system the learner knows. Stop them if they dive into one box.",
  }),
  lesson({
    id: 10, week: 2, theme: "Trade-off", kind: "learn", phrases: w2[10],
    pattern: {
      title: "Pick and name the downside",
      pattern: "I'd pick X because… The downside is… We could also… I'd rather keep it simple",
      explainVi: "Chọn một hướng, nói lý do, nói downside, nêu phương án 2. V1 nghiêng đơn giản.",
      drills: drills(w2[10]).slice(0, 4),
    },
    dialogue: [
      d("B", "SQL or NoSQL for the mapping?", "Mapping dùng SQL hay NoSQL?"),
      d("A", "I'd pick a key-value store because lookups are by key.", "Mình chọn KV vì lookup theo key."),
      d("A", "The downside is we lose ad-hoc queries.", "Nhược điểm là mất query linh tinh."),
      d("A", "We could also use Postgres with an index on the short key.", "Cũng có thể Postgres + index short key."),
      d("A", "Trade-off is query flexibility vs simple lookups.", "Trade-off: query linh hoạt với lookup đơn giản."),
      d("A", "I'd rather keep it simple for v1.", "V1 mình giữ đơn giản."),
      d("B", "Why not both on day one?", "Sao không cả hai ngày đầu?"),
      d("A", "Ops cost. One store until we need analytics.", "Chi phí ops. Một store đến khi cần analytics."),
    ],
    listen: L(
      "SQL vs NoSQL, nói nhanh",
      null,
      [
        d("B", "Why not Cassandra?", "Sao không Cassandra?"),
        d("A", "I'd pick Redis because we need very low latency reads.", "Chọn Redis vì đọc phải rất nhanh."),
        d("A", "The downside is persistence and memory cost.", "Nhược: persistence và RAM."),
        d("A", "We could also put the mapping in DynamoDB.", "Cũng có thể DynamoDB."),
        d("B", "Consistency?", "Consistency?"),
        d("A", "Trade-off is consistency vs availability. Redirects can be eventually consistent.", "Trade-off consistency và availability. Redirect eventual được."),
        d("A", "I'd rather keep it simple. Redis plus nightly backup.", "Giữ đơn giản. Redis + backup đêm."),
        d("B", "Fine for v1.", "V1 được."),
      ],
      [
        gist("Vì sao chọn Redis?", "Low latency reads / đọc nhanh"),
        cloze("Downside Redis?", "Persistence / memory"),
        cloze("Redirect cần consistency kiểu gì?", "Eventually consistent"),
      ],
    ),
    scenario: "Force one real trade-off (SQL vs KV, or cache vs source of truth). They must name a downside.",
  }),
  lesson({
    id: 11, week: 2, theme: "Bottleneck", kind: "learn", phrases: w2[11],
    pattern: {
      title: "Name the break point",
      pattern: "This breaks when… The bottleneck is… I'd cache… / We'd shard by…",
      explainVi: "Nói chỗ vỡ, bottleneck, một cách scale (cache hoặc shard). Có số thì tốt.",
      drills: drills(w2[11]).slice(0, 4),
    },
    dialogue: [
      d("B", "This dies at 10x traffic. Where?", "Traffic x10 thì chết. Ở đâu?"),
      d("A", "This breaks when writes hit one shard.", "Vỡ khi write dồn một shard."),
      d("A", "The bottleneck is the redirect read path.", "Bottleneck là đường đọc redirect."),
      d("A", "I'd cache the short-to-long mapping.", "Mình cache map short → long."),
      d("A", "We'd shard by the short key hash.", "Shard theo hash short key."),
      d("A", "To scale reads, add replicas and a cache.", "Scale read: replica + cache."),
      d("B", "Hot key?", "Hot key?"),
      d("A", "This breaks when one celebrity link is cached poorly. Replicate that key.", "Vỡ khi một link hot cache kém. Replicate key đó."),
    ],
    listen: L(
      "Scale follow-up",
      null,
      [
        d("B", "Ten times the QPS. What dies first?", "QPS x10. Chết trước?"),
        d("A", "The bottleneck is the single primary on writes.", "Bottleneck là một primary lúc write."),
        d("A", "This breaks when the cache misses stampede the store.", "Vỡ khi cache miss dồn store."),
        d("A", "I'd cache aggressively with a short TTL.", "Cache mạnh, TTL ngắn."),
        d("A", "We'd shard by user ID if writes grow.", "Write tăng thì shard theo user ID."),
        d("B", "Reads?", "Read?"),
        d("A", "To scale reads, read replicas plus the cache.", "Scale read: replica + cache."),
        d("B", "Good enough.", "Đủ."),
      ],
      [
        gist("Write chết ở đâu trước?", "Single primary"),
        cloze("Cache miss gây gì?", "Stampede store"),
        cloze("Shard write theo gì nếu tăng?", "User ID"),
      ],
    ),
    scenario: "Ask where the design breaks at 10x. They must name bottleneck plus cache or shard.",
  }),
  lesson({
    id: 12, week: 2, theme: "Honest gap", kind: "learn", phrases: w2[12],
    pattern: {
      title: "Don't bluff ops",
      pattern: "I haven't operated this in prod → I know the idea, not the ops → I'd ask the team / I'd read the runbook first",
      explainVi: "Phần lạ: nói chưa vận hành prod, biết ý tưởng chứ chưa ops, hỏi team hoặc đọc runbook. Vẫn đề xuất hướng.",
      drills: drills(w2[12]).slice(0, 4),
    },
    dialogue: [
      d("B", "How would you operate Kafka here?", "Kafka ở đây vận hành thế nào?"),
      d("A", "I haven't operated Kafka in prod.", "Mình chưa vận hành Kafka trên prod."),
      d("A", "I know the idea, not the ops of consumer lag.", "Mình biết ý, chưa biết ops consumer lag."),
      d("A", "I'd ask the team how they page on this.", "Mình hỏi team họ page việc này thế nào."),
      d("A", "I'd read the runbook first, then change anything.", "Đọc runbook trước, rồi mới đụng."),
      d("A", "I'm not an expert here, but I'd start with metrics.", "Không expert, nhưng bắt đầu từ metric."),
      d("B", "Which metric?", "Metric nào?"),
      d("A", "Consumer lag and error rate. Then I'd ask the team.", "Consumer lag và error rate. Rồi hỏi team."),
    ],
    listen: L(
      "Câu hỏi ops ngoài comfort zone",
      null,
      [
        d("B", "Walk me through multi-region failover.", "Kể failover đa region."),
        d("A", "I haven't operated this in prod.", "Mình chưa vận hành cái này trên prod."),
        d("A", "I know the idea, not the ops — active-active is hard.", "Biết ý, chưa biết ops — active-active khó."),
        d("A", "I'd read the runbook first.", "Mình đọc runbook trước."),
        d("B", "No runbook. You're on-call.", "Không có runbook. Bạn đang on-call."),
        d("A", "I'd ask the team who last did a failover.", "Mình hỏi ai failover gần nhất."),
        d("A", "I'm not an expert here, but I'd start with metrics and traffic drain.", "Không expert, bắt đầu metric và drain traffic."),
        d("B", "That's honest. Good.", "Thành thật. Ổn."),
      ],
      [
        gist("Learner có giả vờ expert không?", "Không — nói chưa vận hành prod"),
        cloze("Không có runbook thì hỏi ai?", "Team / người failover gần nhất"),
        cloze("Bắt đầu từ gì?", "Metrics / traffic drain"),
      ],
    ),
    scenario: "Ask about a tool the learner has NOT run in prod. They must not bluff.",
  }),
);

const reviewWeek2 = pick([8, 9, 10, 11, 12], w2);
lessons.push(
  lesson({
    id: 13, week: 2, theme: "Tổng hợp tuần 2", kind: "review", phrases: reviewWeek2,
    pattern: {
      title: "Design 5 nhịp",
      pattern: "Requirements → sketch → trade-off → bottleneck → honest gap",
      explainVi: "Ghép tuần 2. Không thêm cụm. URL shortener hoặc notification — khung.",
      drills: drills(reviewWeek2).slice(0, 4),
    },
    dialogue: [
      d("A", "Let's start with requirements. What's the scale?", "Requirements. Scale cỡ nào ạ?"),
      d("A", "I'd sketch this first. Clients talk to the API.", "Sketch. Client nói với API."),
      d("A", "Store goes in a key-value store.", "Lưu KV."),
      d("A", "I'd pick Redis because reads dominate. The downside is memory.", "Chọn Redis vì đọc nhiều. Nhược: RAM."),
      d("A", "This breaks when the cache misses. I'd cache the mapping.", "Vỡ khi cache miss. Cache mapping."),
      d("B", "Kafka for click events?", "Kafka cho click?"),
      d("A", "I haven't operated this in prod. I'd rather keep it simple for v1.", "Chưa ops prod. V1 giữ đơn giản."),
      d("B", "Okay.", "Ok."),
    ],
    listen: L(
      "Ghép một vòng design",
      V2,
      [
        d("A", "Let's start with requirements.", "Bắt đầu requirements."),
        d("A", "High-level, we have clients, API, store, cache.", "High-level bốn hộp."),
        d("A", "I'd pick X because lookups are by key. The downside is analytics.", "Chọn X vì lookup theo key. Nhược: analytics."),
        d("A", "The bottleneck is the redirect path.", "Bottleneck đường redirect."),
        d("A", "To scale reads, cache plus replicas.", "Scale read: cache + replica."),
        d("B", "How do you operate the cache in prod?", "Cache prod vận hành sao?"),
        d("A", "I know the idea, not the ops. I'd ask the team.", "Biết ý, chưa ops. Hỏi team."),
        d("A", "I'd rather keep it simple.", "Giữ đơn giản."),
      ],
      [
        gist("Video: họ nói scale/API sớm hay muộn?", "Sớm / trong 2 phút đầu (tuỳ clip)"),
        cloze("Bottleneck nêu ở path nào?", "Redirect"),
        cloze("Khi bị hỏi ops cache, họ làm gì?", "Ask the team / không bluff"),
      ],
    ),
    scenario: "15-minute design recap: requirements, four boxes, one trade-off, one bottleneck, one honest gap.",
  }),
  lesson({
    id: 14, week: 2, theme: "AI design 15 phút", kind: "review", phrases: reviewWeek2,
    pattern: {
      title: "Khung 15 phút",
      pattern: "Requirements 3 phút → sketch 5 → trade-off + bottleneck 5 → gap 2",
      explainVi: "Mock URL shortener hoặc notification. Khoá cụm tuần 2. Không nhồi kiến thức.",
      drills: drills(reviewWeek2).slice(0, 4),
    },
    dialogue: [
      d("B", "Notifications: push when an order ships. 15 minutes.", "Notification khi order ship. 15 phút."),
      d("A", "Let's start with requirements. What's the scale?", "Requirements. Scale?"),
      d("B", "10k orders an hour at peak.", "Giờ cao điểm 10k order/giờ."),
      d("A", "I'd sketch this first. Clients talk to an API, store goes in a queue.", "Sketch. Client → API, lưu queue."),
      d("A", "I'd pick a queue because we can retry. The downside is delay.", "Chọn queue vì retry được. Nhược: delay."),
      d("A", "This breaks when workers stall. I'd cache user device tokens.", "Vỡ khi worker đứng. Cache device token."),
      d("B", "Kafka exactly-once?", "Kafka exactly-once?"),
      d("A", "I haven't operated this in prod. I'd rather keep it simple — at-least-once plus idempotency.", "Chưa ops. Giữ đơn giản — at-least-once + idempotent."),
    ],
    listen: L(
      "Mock notification 15 phút",
      null,
      [
        d("B", "Clock starts. Design notifications.", "Bắt đầu. Design notification."),
        d("A", "Functional: notify the user when status changes.", "Functional: báo khi status đổi."),
        d("A", "Non-functional: don't lose the message; a few seconds delay is okay.", "Non-functional: đừng mất tin; delay vài giây được."),
        d("A", "I'd draw an API layer and a worker pool.", "Vẽ API và worker pool."),
        d("B", "Why not call FCM from the request?", "Sao không gọi FCM ngay trong request?"),
        d("A", "The downside is timeouts. I'd pick a queue because… retries.", "Nhược: timeout. Chọn queue vì retry."),
        d("A", "The bottleneck is the worker count at peak.", "Bottleneck là số worker lúc peak."),
        d("A", "I'm not an expert here on FCM quotas. I'd ask the team.", "Không expert quota FCM. Hỏi team."),
      ],
      [
        gist("Vì sao không gọi FCM trong request?", "Timeout / muốn retry"),
        cloze("Delay vài giây có được không?", "Được / okay"),
        cloze("Bottleneck?", "Worker count at peak"),
      ],
    ),
    scenario: "15-minute mock: URL shortener OR order notifications. Interrupt on Kafka/exactly-once. No bluffing.",
  }),
);

lessons.push(
  lesson({
    id: 15, week: 3, theme: "Conflict STAR", kind: "learn", phrases: w3[15],
    pattern: {
      title: "Disagree without a fight",
      pattern: "I disagreed → I stated the risk → I pushed back because… → We aligned on… / In the end we…",
      explainVi: "Conflict: không đồng ý, nêu risk, push back vì lý do kỹ thuật, thống nhất. Không I won.",
      drills: drills(w3[15]).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about a time you disagreed with a decision.", "Kể lần bạn không đồng ý một quyết định."),
      d("A", "I disagreed with shipping without a flag.", "Mình không đồng ý ship khi chưa có flag."),
      d("A", "I stated the risk of a bad deploy on Friday.", "Mình nêu risk deploy thứ Sáu."),
      d("A", "I pushed back because we had no rollback.", "Push back vì chưa có rollback."),
      d("A", "We aligned on a flag and a Monday ship.", "Thống nhất flag và ship thứ Hai."),
      d("A", "In the end we delayed one day and it was fine.", "Cuối cùng delay một ngày, ổn."),
      d("B", "Did they think you were blocking?", "Họ nghĩ bạn cản chứ?"),
      d("A", "I framed it as risk, not taste. We aligned.", "Mình nói risk, không phải gu. Rồi thống nhất."),
    ],
    listen: L(
      "Behavioral conflict, interviewer cắt",
      V3,
      [
        d("B", "A time you disagreed with your lead.", "Lần không đồng ý với lead."),
        d("A", "I disagreed on rewriting the service in a week.", "Không đồng ý rewrite service trong một tuần."),
        d("A", "I stated the risk: we would miss the launch.", "Nêu risk: miss launch."),
        d("B", "What did you actually say?", "Bạn nói thật ra sao?"),
        d("A", "I pushed back because we had no tests on the old path.", "Push back vì path cũ chưa có test."),
        d("A", "We aligned on a strangler change, not a rewrite.", "Thống nhất strangler, không rewrite."),
        d("A", "In the end we shipped a slice and kept the old API.", "Cuối cùng ship một slice, giữ API cũ."),
        d("B", "Good. Don't say I won.", "Ổn. Đừng nói I won."),
      ],
      [
        gist("Video 0:00–2:00: intro có đọc CV dài không? Ghi 1 khung.", "Present/past/future hoặc ngắn, không CV (tuỳ clip)"),
        cloze("Họ thống nhất cách nào, không rewrite?", "Strangler / slice"),
        cloze("Risk nêu ra là gì?", "Miss the launch"),
      ],
    ),
    scenario: "Behavioral: a REAL disagreement at work. Interrupt 'what did you actually say?'. No I won.",
  }),
  lesson({
    id: 16, week: 3, theme: "Failure", kind: "learn", phrases: w3[16],
    pattern: {
      title: "Own the miss",
      pattern: "What I missed was… I owned the miss → The impact was… → What I changed after / Next time I'd…",
      explainVi: "Failure: miss của mình, nhận, impact, một thay đổi sau. Không đổ QA / không I learned to work harder.",
      drills: drills(w3[16]).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about a failure.", "Kể một failure."),
      d("A", "What I missed was the null path in retry.", "Mình miss nhánh null lúc retry."),
      d("A", "I owned the miss — I should have added a test.", "Mình nhận — lẽ ra thêm test."),
      d("A", "The impact was 20 minutes of failed checkouts.", "Impact: 20 phút checkout fail."),
      d("A", "What I changed after: a checklist before merge.", "Sau đó: checklist trước merge."),
      d("A", "Next time I'd page earlier.", "Lần sau mình page sớm hơn."),
      d("B", "Why didn't tests catch it?", "Sao test không bắt?"),
      d("A", "I owned that too — I skipped the null fixture.", "Mình nhận luôn — bỏ fixture null."),
    ],
    listen: L(
      "Failure follow-up",
      null,
      [
        d("B", "A production miss you caused.", "Một miss prod do bạn."),
        d("A", "What I missed was a config default in staging vs prod.", "Miss: default config staging khác prod."),
        d("A", "I owned the miss. I copied staging blindly.", "Mình nhận. Copy staging mù."),
        d("A", "The impact was 12 minutes of empty search.", "Impact: 12 phút search rỗng."),
        d("B", "Then what changed?", "Rồi đổi gì?"),
        d("A", "What I changed after: prod/staging diffs in the PR template.", "Sau đó: diff prod/staging trong PR template."),
        d("A", "Next time I'd compare configs before merge.", "Lần sau so config trước merge."),
        d("B", "Don't blame QA.", "Đừng đổ QA."),
      ],
      [
        gist("Miss là gì?", "Config default staging vs prod"),
        cloze("Impact bao lâu?", "12 minutes"),
        cloze("Đổi gì sau đó?", "PR template / prod-staging diffs"),
      ],
    ),
    scenario: "A real miss the learner owned. Push for impact numbers and one process change. No blaming QA.",
  }),
  lesson({
    id: 17, week: 3, theme: "Why us / leave", kind: "learn", phrases: w3[17],
    pattern: {
      title: "Toward, not away",
      pattern: "I'm looking for… This role… Why I'm leaving is… That's why I applied",
      explainVi: "Why us / why leave: hướng tới (ownership, scope), gắn JD, không chê sếp. Chốt that's why I applied.",
      drills: drills(w3[17]).slice(0, 4),
    },
    dialogue: [
      d("B", "Why this company, and why leave?", "Sao công ty này, sao đi?"),
      d("A", "I'm looking for more ownership on backend.", "Mình tìm ownership backend nhiều hơn."),
      d("A", "This role owns payments, which matches what I do.", "Role này own payments, khớp việc mình."),
      d("A", "Why I'm leaving is I've hit the ceiling on scope.", "Đi vì scope đã chạm trần."),
      d("A", "What I want next is to own a service end to end.", "Tiếp theo muốn own một service end to end."),
      d("A", "That's why I applied to this team.", "Vì vậy apply team này."),
      d("B", "Anything about your manager?", "Còn sếp cũ?"),
      d("A", "No complaints. Why I'm leaving is scope, not people.", "Không than. Đi vì scope, không vì người."),
    ],
    listen: L(
      "Hiring manager hỏi why us",
      null,
      [
        d("B", "Why us over the other offer?", "Sao mình hơn offer kia?"),
        d("A", "I'm looking for a smaller team where I can own a slice.", "Tìm team nhỏ để own một slice."),
        d("A", "This role has on-call on a product I already understand.", "Role này on-call product mình đã hiểu."),
        d("B", "Why leave a stable job?", "Sao bỏ việc ổn?"),
        d("A", "Why I'm leaving is I've hit the ceiling on scope.", "Đi vì scope chạm trần."),
        d("A", "What I want next is more production ownership.", "Muốn ownership prod nhiều hơn."),
        d("A", "That's why I applied.", "Vì vậy mình apply."),
        d("B", "Good. Skip culture-fit poetry.", "Ổn. Bỏ thơ culture-fit."),
      ],
      [
        gist("Lý do đi là gì, không phải người?", "Ceiling on scope"),
        cloze("Tìm team kiểu gì?", "Smaller / own a slice"),
        cloze("Câu chốt?", "That's why I applied"),
      ],
    ),
    scenario: "Why this role and why leave — using the learner's real situation. Stop them if they trash a manager.",
  }),
  lesson({
    id: 18, week: 3, theme: "Gap stack", kind: "learn", phrases: w3[18],
    pattern: {
      title: "Name the gap and the ramp",
      pattern: "I haven't used X in prod → I've used something similar → I'd ramp by… / Give me a week on the docs",
      explainVi: "Gap stack: nói chưa dùng prod, cầu nối tool tương tự, kế hoạch ramp. Không bluff Kafka/k8s.",
      drills: drills(w3[18]).slice(0, 4),
    },
    dialogue: [
      d("B", "We run Kubernetes. Have you?", "Bên mình k8s. Bạn đã chạy chưa?"),
      d("A", "I haven't used Kubernetes in prod.", "Mình chưa dùng Kubernetes trên prod."),
      d("A", "I've used something similar — Docker Compose and ECS.", "Mình dùng cái tương tự — Compose và ECS."),
      d("A", "I'd ramp by pairing on on-call the first month.", "Ramp: pair on-call tháng đầu."),
      d("A", "Give me a week on the docs and I'll be useful.", "Một tuần với docs là mình hữu ích."),
      d("A", "I'm honest about the gap — I haven't run k8s.", "Nói thẳng — mình chưa chạy k8s."),
      d("B", "Will you be lost in week one?", "Tuần 1 có lạc không?"),
      d("A", "On YAML, maybe. I'd ramp by pairing, not by pretending.", "YAML thì có. Ramp bằng pair, không giả vờ."),
    ],
    listen: L(
      "Hỏi stack chưa dùng",
      null,
      [
        d("B", "Kafka in production — yes or no?", "Kafka trên prod — có hay không?"),
        d("A", "I haven't used Kafka in prod.", "Mình chưa dùng Kafka trên prod."),
        d("A", "I've used something similar — SQS and a worker.", "Cái tương tự — SQS và worker."),
        d("B", "How fast can you ramp?", "Ramp nhanh cỡ nào?"),
        d("A", "I'd ramp by reading the consumer lag dashboard with a teammate.", "Ramp: đọc dashboard consumer lag với teammate."),
        d("A", "Give me a week on the docs.", "Cho mình một tuần với docs."),
        d("A", "I'm honest about the gap.", "Mình nói thẳng gap."),
        d("B", "That's better than a fake cluster story.", "Tốt hơn chuyện cluster giả."),
      ],
      [
        gist("Learner đã chạy Kafka prod chưa?", "Chưa"),
        cloze("Cầu nối tool nào?", "SQS / worker"),
        cloze("Xin bao lâu với docs?", "A week / một tuần"),
      ],
    ),
    scenario: "Ask about a tool on the JD the learner has not used in prod. Demand a ramp plan, not a bluff.",
  }),
  lesson({
    id: 19, week: 3, theme: "Lương", kind: "learn", phrases: w3[19],
    pattern: {
      title: "Comp in one breath",
      pattern: "I'm targeting… What's the range for this level? Notice period is… Total comp, not just base",
      explainVi: "Lương: band của bạn, hỏi range, notice, title linh hoạt, nhìn total. Điền số thật. Không mặc cả vòng 1 trừ khi họ hỏi.",
      drills: drills(w3[19]).slice(0, 4),
    },
    dialogue: [
      d("B", "Comp expectations?", "Kỳ vọng lương?"),
      d("A", "I'm targeting 2.4 to 2.8 billion VND total.", "Targeting 2.4–2.8 tỷ total."),
      d("A", "What's the range for this level in Vietnam / remote?", "Range level này ở VN / remote sao ạ?"),
      d("B", "I can't share a number yet. Notice?", "Chưa share số. Notice?"),
      d("A", "Notice period is 30 days.", "Notice 30 ngày."),
      d("A", "I'm flexible on title if the scope is right.", "Title linh hoạt nếu scope đúng."),
      d("A", "I care about total comp, not just base.", "Nhìn total, không chỉ base."),
      d("B", "We'll come back with a band.", "Lát mình gửi band."),
    ],
    listen: L(
      "Recruiter hỏi comp",
      null,
      [
        d("B", "What's your current and target?", "Hiện tại và target?"),
        d("A", "I'm targeting a 15 to 20 percent bump on total.", "Targeting tăng 15–20% total."),
        d("A", "What's the range for this level?", "Range level này sao ạ?"),
        d("B", "Depends on equity. When can you start?", "Tuỳ equity. Khi nào onboard?"),
        d("A", "Notice period is 30 days.", "Notice 30 ngày."),
        d("A", "I'm flexible on title.", "Title linh hoạt."),
        d("A", "Total comp, not just base — equity matters.", "Total, không chỉ base — equity cũng tính."),
        d("B", "Understood.", "Rõ."),
      ],
      [
        gist("Target tăng khoảng bao nhiêu?", "15–20% total"),
        cloze("Notice bao lâu?", "30 days"),
        cloze("Ngoài base họ nhắc gì?", "Equity / total comp"),
      ],
    ),
    scenario: "Recruiter asks for comp. Learner uses THEIR real band and notice. Don't invent a number in the prompt.",
  }),
);

const reviewWeek3 = pick([15, 16, 17, 18, 19], w3);
const mockLoop = [
  p("I'm a software engineer", "Tái dùng intro IT ngày 22. Câu 1, không đọc CV.", "Mình là software engineer", "I'm a software engineer focused on backend.", "Mình là software engineer, thiên backend.", "I'm a software engineer focused on ___."),
  w1[1][0],
  w1[2][1],
  w3[15][0],
  w3[19][0],
];
lessons.push(
  lesson({
    id: 20, week: 3, theme: "Ôn tuần 3", kind: "review", phrases: reviewWeek3,
    pattern: {
      title: "Conflict + why + lương",
      pattern: "I disagreed… I'm looking for… I'm targeting…",
      explainVi: "Ôn tuần 3: một STAR conflict, why us, band lương. Không thêm cụm.",
      drills: drills(reviewWeek3).slice(0, 4),
    },
    dialogue: [
      d("A", "I disagreed with a Friday ship. I stated the risk.", "Không đồng ý ship thứ Sáu. Nêu risk."),
      d("A", "We aligned on Monday. In the end we delayed one day.", "Thống nhất thứ Hai. Delay một ngày."),
      d("B", "Why us?", "Sao bên mình?"),
      d("A", "I'm looking for more ownership. That's why I applied.", "Tìm ownership. Vì vậy apply."),
      d("B", "Comp?", "Lương?"),
      d("A", "I'm targeting a range I already thought about. What's the range for this level?", "Mình có band. Range level này sao ạ?"),
      d("A", "Notice period is 30 days. I'm flexible on title.", "Notice 30 ngày. Title linh hoạt."),
      d("B", "Thanks.", "Cảm ơn."),
    ],
    listen: L(
      "Behavioral + lương",
      V3,
      [
        d("A", "I disagreed. I pushed back because we had no rollback.", "Không đồng ý. Push back vì chưa rollback."),
        d("A", "What I missed later was a test. I owned the miss.", "Sau đó miss test. Mình nhận."),
        d("A", "I'm looking for this role's scope.", "Tìm scope của role này."),
        d("A", "I haven't used Kubernetes in prod. I'd ramp by pairing.", "Chưa k8s prod. Ramp bằng pair."),
        d("B", "Numbers on comp?", "Số lương?"),
        d("A", "I'm targeting total comp, not just base.", "Targeting total, không chỉ base."),
        d("A", "What's the range for this level?", "Range level này?"),
        d("A", "Notice period is 30 days.", "Notice 30 ngày."),
      ],
      [
        gist("Video: intro ngắn hay đọc CV?", "Ngắn / present-past-future (tuỳ clip)"),
        cloze("Gap stack nêu tool nào?", "Kubernetes"),
        cloze("Notice?", "30 days"),
      ],
    ),
    scenario: "Recap week 3: one conflict STAR, why this role, honest stack gap, then comp. Use the learner's real stories.",
  }),
  lesson({
    id: 21, week: 3, theme: "Mock loop AI", kind: "review", phrases: mockLoop,
    pattern: {
      title: "Intro + coding + STAR + hỏi ngược",
      pattern: "60s intro (IT) → restate/brute force → I disagreed → I'm targeting / 2 questions",
      explainVi: "Loop ngắn: intro tái dùng IT ngày 22, một đoạn coding talk, một STAR, lương nếu họ hỏi, 2 câu hỏi ngược. Không thêm cụm mới.",
      drills: drills(mockLoop).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about yourself, then a short coding warm-up, then a story.", "Giới thiệu, coding ấm, rồi một story."),
      d("A", "I'm a software engineer focused on backend.", "Mình là software engineer, thiên backend."),
      d("A", "Let me restate the problem. I'll start with a brute force.", "Restated đề. Brute force trước."),
      d("B", "A disagreement?", "Một lần không đồng ý?"),
      d("A", "I disagreed with shipping without a flag. We aligned.", "Không đồng ý ship không flag. Rồi thống nhất."),
      d("B", "Comp?", "Lương?"),
      d("A", "I'm targeting a band I prepared. What's the range for this level?", "Mình có band. Range level này sao ạ?"),
      d("A", "What's the team like, and how do you measure success?", "Team thế nào, và đo success ra sao ạ?"),
    ],
    listen: L(
      "Full loop ngắn, interviewer cắt",
      null,
      [
        d("B", "Sixty seconds, then two-sum, then a conflict.", "60 giây, rồi two-sum, rồi conflict."),
        d("A", "I'm a software engineer. I currently own payments.", "Software engineer. Hiện own payments."),
        d("A", "Let me restate the problem. I'll start with a brute force.", "Restated. Brute force trước."),
        d("B", "Time?", "Time?"),
        d("A", "Time is O(n) with a map. Let me trace this — later if we need.", "Time O(n) với map. Trace sau nếu cần."),
        d("A", "I disagreed on a Friday deploy. We aligned on a flag.", "Không đồng ý deploy thứ Sáu. Thống nhất flag."),
        d("A", "I'm targeting total, not just base.", "Targeting total, không chỉ base."),
        d("A", "What does success look like in six months, and what's the team like?", "Success sáu tháng nữa thế nào, team ra sao ạ?"),
      ],
      [
        gist("Loop gồm những phần nào?", "Intro, coding, conflict STAR, comp, hỏi ngược"),
        cloze("Coding mở bằng cụm nào?", "Let me restate / brute force"),
        cloze("Hai câu hỏi ngược về gì?", "Success / team"),
      ],
    ),
    extra: "Also allow reverse questions: What's the team like?; How do you measure success?. Keep the loop moving.",
    scenario: "Full short loop: 60s intro (learner's real one), coding talk, one STAR, comp if asked, two reverse questions.",
  }),
);

for (const item of lessons) {
  const name = `${String(item.id).padStart(3, "0")}.json`;
  writeFileSync(join(dir, name), `${JSON.stringify(item, null, 2)}\n`);
}

console.log(`Wrote ${lessons.length} lessons to ${dir}`);
