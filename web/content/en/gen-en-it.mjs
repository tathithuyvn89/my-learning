import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
mkdirSync(dir, { recursive: true });

const TIMER = { review: 4, vocab: 5, grammar: 8, talk: 8, ai: 5 };

const METHOD =
  "Ẩn chữ. Nghe 1–2 lần (video hoặc TTS). Làm task. Mới mở transcript. Shadow 3 lượt: nghe → nói theo → nói một mình.";

const V1 = {
  title: "BBC English at Work — box set ep. 0–5",
  url: "https://www.youtube.com/watch?v=PyL2HDKwR9E",
  watchFrom: "0:00",
  watchTo: "1:30",
  whyVi: "Office small talk thật: chào, hỏi thăm. Nghe giọng Anh-Anh, không TTS.",
};
const V2 = {
  title: "BBC English at Work — box set ep. 6–10",
  url: "https://www.youtube.com/watch?v=4zB8KhyYlx4",
  watchFrom: "0:00",
  watchTo: "2:00",
  whyVi: "Họp và điện thoại văn phòng. Bắt tên, số, deadline. Xin nhắc nếu miss.",
};
const V3 = {
  title: "Harvard CS50 — Lecture 0 opening",
  url: "https://www.youtube.com/watch?v=8mAITcNt710",
  watchFrom: "0:00",
  watchTo: "2:00",
  whyVi: "Giọng academic rõ. Nghe người ta giải thích vấn đề; ghi symptom / when / expected nếu nghe được.",
};
const V4 = {
  title: "How successful software engineers answer Tell me about yourself",
  url: "https://www.youtube.com/watch?v=0PN_W-7fBRo",
  watchFrom: "0:00",
  watchTo: "2:00",
  whyVi: "Intro phỏng vấn engineer. Chép Present → Past → Future, rồi nói bản của bạn, không đọc CV mẫu.",
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
  return `You are a friendly teammate (or interviewer) at a software company. Speak natural meeting English. Keep each turn to 1–2 short sentences. You MAY use extra workplace English so the learner practices listening. Nudge the learner to use these phrases: ${list}. If they ask you to slow down or repeat, do that. Ask one concrete detail about their real work (ticket, bug, PR, or project). Wait for the learner to reply. Scenario: ${scenario}${extra ? ` ${extra}` : ""}`;
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
    p("Morning, team", "Chào channel buổi sáng, không cần dài.", "Chào team buổi sáng", "Morning, team — I'll be in standup.", "Chào team — lát nữa mình vào standup."),
    p("Hey everyone", "Informal hơn Morning. Dùng Slack nội bộ.", "Chào mọi người", "Hey everyone, quick question.", "Chào mọi người, hỏi nhanh một chút."),
    p("How's it going?", "Hỏi thăm ngắn. Trả lời Okay / Pretty good là đủ.", "Dạo này thế nào?", "Hey, how's it going?", "Ê, dạo này thế nào?"),
    p("Quick ping", "Báo sắp hỏi một việc nhỏ, không phải khẩn.", "Ping nhanh", "Quick ping — is the API up?", "Ping nhanh — API còn sống không?", "Quick ping — ___?"),
    p("Have a good one", "Kết Slack nhẹ cuối ngày / sau khi xong việc.", "Chúc làm việc vui", "Thanks, have a good one.", "Cảm ơn, chúc làm việc vui."),
  ],
  2: [
    p("Yesterday I finished…", "Standup: câu 1. Nói việc đã xong, không kể dài.", "Hôm qua mình xong…", "Yesterday I finished the login bug.", "Hôm qua mình xong bug login."),
    p("Today I'll work on…", "Standup: câu 2. Một việc chính trong ngày.", "Hôm nay mình sẽ làm…", "Today I'll work on the API timeout.", "Hôm nay mình sẽ làm timeout API."),
    p("No blockers", "Không bị kẹt. Nói rõ, đừng im.", "Không blocker", "Today I'll work on tests. No blockers.", "Hôm nay làm test. Không blocker."),
    p("I'm blocked on…", "Bị kẹt. Nói người / ticket, không xin lỗi dài.", "Mình đang bị kẹt ở…", "I'm blocked on the staging deploy.", "Mình bị kẹt ở deploy staging."),
    p("That's it from me", "Kết lượt standup. Nhường người sau.", "Mình hết rồi", "No blockers. That's it from me.", "Không blocker. Mình hết rồi."),
  ],
  3: [
    p("Could you take a look?", "Nhờ xem giúp. Lịch sự hơn Can you look?", "Bạn xem giúp được không?", "Could you take a look at this PR?", "Bạn xem giúp PR này được không?"),
    p("I'm stuck on…", "Nói đang kẹt, không nói I don't know anything.", "Mình đang kẹt ở…", "I'm stuck on this flaky test.", "Mình đang kẹt ở test bị flaky."),
    p("When you have a minute", "Không khẩn. Tránh ping rồi im.", "Khi bạn rảnh một chút", "When you have a minute, could you take a look?", "Khi bạn rảnh, xem giúp mình với."),
    p("No rush", "Giảm áp lực cho người nhận.", "Không gấp", "No rush — whenever you can.", "Không gấp — lúc nào tiện cũng được."),
    p("Thanks in advance", "Kết tin nhờ việc. Không lặp thank you 3 lần.", "Cảm ơn trước", "No rush. Thanks in advance.", "Không gấp. Cảm ơn trước."),
  ],
  4: [
    p("Just to confirm", "Mở câu hỏi lại ticket, không nghe như cãi.", "Chỉ để xác nhận", "Just to confirm: we ship Friday, right?", "Xác nhận lại: mình ship thứ Sáu chứ?"),
    p("Do you mean…?", "Hỏi lại ý, không hỏi What? cộc lốc.", "Ý bạn là…?", "Do you mean the old endpoint?", "Ý bạn là endpoint cũ à?"),
    p("What's the expected behavior?", "Hỏi AC. Dùng khi ticket mơ hồ.", "Hành vi kỳ vọng là gì?", "What's the expected behavior on empty search?", "Search rỗng thì kỳ vọng thế nào?"),
    p("So the next step is…", "Chốt hiểu xong. Lặp lại bước tiếp.", "Vậy bước tiếp theo là…", "So the next step is to update the copy.", "Vậy bước tiếp là sửa copy."),
    p("Got it, thanks", "Chốt đã hiểu. Kết thread.", "Rõ rồi, cảm ơn", "Got it, thanks. I'll update the ticket.", "Rõ rồi, cảm ơn. Mình cập nhật ticket."),
  ],
  5: [
    p("Still working on…", "Update giữa ngày. Chưa xong.", "Vẫn đang làm…", "Still working on the payment retry.", "Vẫn đang làm retry thanh toán."),
    p("Shipped", "Đã lên prod / đã merge xong. Ngắn, rõ.", "Đã ship", "Shipped the fix to prod.", "Đã ship fix lên prod."),
    p("Waiting on…", "Kẹt vì người khác / job. Không phải mình ngồi không.", "Đang chờ…", "Waiting on design for the empty state.", "Đang chờ design cho empty state."),
    p("Quick update", "Mở một dòng status, không essay.", "Update nhanh", "Quick update: still working on the query.", "Update nhanh: vẫn đang làm query."),
    p("I'll post here when it's done", "Hứa đóng loop trên Slack.", "Xong mình sẽ báo ở đây", "Waiting on QA. I'll post here when it's done.", "Đang chờ QA. Xong mình báo ở đây."),
  ],
};

const w2 = {
  8: [
    p("Can you hear me?", "30 giây đầu Zoom. Hỏi âm thanh, không xin lỗi dài.", "Mọi người nghe mình không?", "Can you hear me? I'll share in a second.", "Nghe mình không? Lát mình share."),
    p("I'll share my screen", "Báo trước khi share. Đừng share im lặng.", "Mình sẽ share màn hình", "I'll share my screen — one sec.", "Mình share màn hình — chờ một chút."),
    p("Sorry I'm a couple minutes late", "Muộn nhẹ. Một câu rồi vào việc.", "Xin lỗi mình muộn vài phút", "Sorry I'm a couple minutes late — traffic.", "Xin lỗi muộn vài phút — kẹt đường."),
    p("Let's get started", "Mở họp khi đã đủ người.", "Bắt đầu nhé", "Everyone's here. Let's get started.", "Đủ người rồi. Bắt đầu nhé."),
    p("I might be on mute", "Khi người ta không nghe. Kiểm tra mute trước.", "Có thể mình đang mute", "I might be on mute — hang on.", "Có thể mình đang mute — chờ xíu."),
  ],
  9: [
    p("That works for me", "Đồng ý giờ / cách làm. Ngắn, rõ.", "Mình ok với cái đó", "3pm? That works for me.", "3 giờ? Mình ok."),
    p("I'd prefer…", "Từ chối mềm. Đưa phương án khác.", "Mình nghiêng về…", "I'd prefer tomorrow morning.", "Mình nghiêng về sáng mai."),
    p("Can we push this to tomorrow?", "Dời họp. Hỏi, không ra lệnh.", "Dời sang mai được không?", "Can we push this to tomorrow? I have a deploy.", "Dời mai được không? Mình có deploy."),
    p("I'm good either way", "Không có preference. Tránh kéo dài chọn giờ.", "Sao cũng được", "I'm good either way — you pick.", "Sao cũng được — bạn chọn."),
    p("Let's lock that in", "Chốt giờ. Kết thread lịch.", "Chốt vậy nhé", "Tomorrow 10. Let's lock that in.", "Mai 10 giờ. Chốt vậy nhé."),
  ],
  10: [
    p("Could you repeat that?", "Không nghe kịp. Lịch sự hơn What?", "Bạn nhắc lại được không?", "Could you repeat that? I missed the name.", "Nhắc lại được không? Mình miss cái tên."),
    p("Could you slow down a bit?", "Accent / tốc độ. Không xin lỗi vì tiếng Anh.", "Bạn nói chậm hơn một chút được không?", "Could you slow down a bit? I want to catch the numbers.", "Nói chậm hơn chút được không? Mình muốn bắt kịp số."),
    p("What I heard is…", "Lặp lại để confirm. Tránh hiểu sai.", "Mình nghe là…", "What I heard is we ship on Friday.", "Mình nghe là mình ship thứ Sáu."),
    p("I missed the last part", "Cụ thể phần miss, đừng nói I don't understand everything.", "Mình miss đoạn cuối", "I missed the last part — the owner of the ticket.", "Mình miss đoạn cuối — ai owner ticket."),
    p("Thanks, that helps", "Sau khi người ta nhắc. Đóng loop.", "Cảm ơn, rõ rồi", "Ah, got it. Thanks, that helps.", "À, rõ rồi. Cảm ơn."),
  ],
  11: [
    p("Looks good overall", "Mở review. Khen ngắn rồi mới nit.", "Nhìn chung ổn", "Looks good overall. One small nit.", "Nhìn chung ổn. Một nit nhỏ."),
    p("Small nit", "Góp ý nhỏ, không blocker.", "Nit nhỏ", "Small nit: this name is a bit vague.", "Nit nhỏ: tên này hơi mơ hồ."),
    p("Have you considered…?", "Gợi ý, không ra lệnh change this.", "Bạn đã nghĩ tới… chưa?", "Have you considered a feature flag?", "Bạn đã nghĩ tới feature flag chưa?"),
    p("I'd rename this", "Nói rõ mình đề xuất, không This is wrong.", "Mình sẽ đổi tên cái này", "I'd rename this to fetchUserById.", "Mình sẽ đổi tên thành fetchUserById."),
    p("Happy to merge after that", "Chốt: không blocker lớn.", "Sửa xong là merge được", "Happy to merge after that nit.", "Sửa nit đó xong là merge được."),
  ],
  12: [
    p("I'll follow up", "Nhận việc sau họp. Nêu kênh nếu được.", "Mình sẽ follow up", "I'll follow up in Slack after this.", "Họp xong mình follow up trên Slack."),
    p("Let's sync tomorrow", "Hẹn check lại. Có ngày.", "Mai mình sync nhé", "Let's sync tomorrow on the rollout.", "Mai sync về rollout nhé."),
    p("Action item for me", "Nhận action rõ. Tránh mọi người đều nghĩ người kia làm.", "Việc này mình nhận", "Action item for me: update the runbook.", "Việc mình nhận: cập nhật runbook."),
    p("I'll send a recap", "Hứa gửi tóm tắt. Async-friendly.", "Mình sẽ gửi recap", "I'll send a recap with owners.", "Mình gửi recap kèm owner."),
    p("Anything else before we jump?", "Đóng họp. Cho 5 giây hỏi.", "Còn gì nữa trước khi kết không?", "Anything else before we jump? Cool.", "Còn gì nữa không? Ok."),
  ],
};

const w3 = {
  15: [
    p("We're seeing…", "Câu 1 kể bug: triệu chứng, không kể cảm xúc.", "Bên mình đang thấy…", "We're seeing 500s on checkout.", "Bên mình đang thấy 500 ở checkout."),
    p("It happens when…", "Câu 2: bước tái hiện.", "Nó xảy ra khi…", "It happens when the cart is empty.", "Nó xảy ra khi giỏ hàng trống."),
    p("Expected vs actual", "Câu 3: kỳ vọng / thực tế. Có thể nói đủ câu.", "Kỳ vọng so với thực tế", "Expected: a warning. Actual: a crash.", "Kỳ vọng: cảnh báo. Thực tế: crash."),
    p("I already tried…", "Câu 4: đã thử gì. Tránh họ hỏi Have you tried…", "Mình đã thử…", "I already tried clearing cache.", "Mình đã thử xóa cache."),
    p("Can you take a look?", "Nhờ người khác sau khi đã kể đủ 4 câu.", "Bạn xem giúp được không?", "Can you take a look? I already tried a restart.", "Bạn xem giúp? Mình đã thử restart."),
  ],
  16: [
    p("Act as a senior engineer", "Mở prompt. Gán vai, đừng viết Please help me.", "Hãy đóng vai senior engineer", "Act as a senior engineer reviewing this diff.", "Đóng vai senior engineer review diff này."),
    p("Given this code", "Dán context. Prompt không được thiếu input.", "Với đoạn code này", "Given this code, find the null crash.", "Với đoạn code này, tìm crash null."),
    p("Don't change unrelated files", "Khóa scope. Cursor hay sửa lung tung.", "Đừng sửa file không liên quan", "Don't change unrelated files.", "Đừng sửa file không liên quan."),
    p("Return only…", "Khóa output: code / list / yes-no.", "Chỉ trả về…", "Return only the patch.", "Chỉ trả về patch."),
    p("Be concise", "Tránh essay. Cuối prompt.", "Viết ngắn", "Be concise. No preamble.", "Ngắn gọn. Không mở bài."),
  ],
  17: [
    p("This PR…", "Mở 45 giây. Một câu mục đích.", "PR này…", "This PR adds retry on payments.", "PR này thêm retry thanh toán."),
    p("The main change is…", "Phần người review cần nhìn.", "Thay đổi chính là…", "The main change is in PaymentService.", "Thay đổi chính nằm ở PaymentService."),
    p("The risk is…", "Nói risk thật, không This is safe I think.", "Rủi ro là…", "The risk is double charges if retry races.", "Rủi ro là charge hai lần nếu retry đua."),
    p("Please review the…", "Chỉ đúng chỗ cần mắt người.", "Nhờ review phần…", "Please review the timeout logic.", "Nhờ review logic timeout."),
    p("Ready to merge if LGTM", "Chốt. Không cầu xin merge gấp.", "LGTM thì merge được", "Ready to merge if LGTM.", "LGTM thì merge được."),
  ],
  18: [
    p("Review this for bugs", "Meta-prompt: nhờ AI soi, không nhờ viết lại hết.", "Review giúp tìm bug", "Review this for bugs and race conditions.", "Review giúp tìm bug và race."),
    p("List edge cases", "Xin danh sách, dễ đọc hơn paragraph.", "Liệt kê edge case", "List edge cases I missed.", "Liệt kê edge case mình miss."),
    p("Suggest tests", "Nhờ test ý, chưa nhờ generate 40 file.", "Gợi ý test", "Suggest tests for the retry path.", "Gợi ý test cho nhánh retry."),
    p("Don't rewrite everything", "Khóa: AI hay refactor cả file.", "Đừng viết lại hết", "Don't rewrite everything. Comments only.", "Đừng viết lại hết. Chỉ comment."),
    p("Be concise", "Lặp tuần 3: prompt ngắn vẫn thắng.", "Viết ngắn", "Be concise — bullet points.", "Ngắn — gạch đầu dòng."),
  ],
  19: [
    p("You're looking at…", "Mở demo. Định vị màn hình.", "Mọi người đang thấy…", "You're looking at the staging dashboard.", "Mọi người đang thấy dashboard staging."),
    p("I'll go top to bottom", "Báo cấu trúc demo. Người nghe dễ theo.", "Mình đi từ trên xuống", "I'll go top to bottom, then questions.", "Mình đi từ trên xuống, rồi hỏi."),
    p("This part is new", "Chỉ đúng chỗ mới. Đừng đọc hết file.", "Phần này là mới", "This part is new — the retry badge.", "Phần này mới — badge retry."),
    p("Any questions so far?", "Pause. Đừng demo 8 phút không thở.", "Tới đây có hỏi gì không?", "Any questions so far?", "Tới đây có hỏi gì không?"),
    p("I'll pause here", "Dừng chủ động khi sắp hết giờ.", "Mình pause ở đây", "I'll pause here for questions.", "Mình pause ở đây để hỏi."),
  ],
};

const w4 = {
  22: [
    p("I'm a software engineer", "60s intro: câu 1. Role, không đọc CV.", "Mình là software engineer", "I'm a software engineer focused on backend.", "Mình là software engineer, thiên backend.", "I'm a software engineer focused on ___."),
    p("I currently work on…", "Câu 2: việc hiện tại, một product.", "Hiện mình đang làm…", "I currently work on payments at a logistics company.", "Hiện mình làm payments ở công ty logistics."),
    p("I enjoy…", "Câu 3: một điều thật, không I am passionate about synergy.", "Mình thích…", "I enjoy debugging messy production issues.", "Mình thích debug issue production lộn xộn."),
    p("I'm looking for…", "Câu 4: vì sao apply. Cụ thể.", "Mình đang tìm…", "I'm looking for a role with more ownership.", "Mình tìm role được ownership nhiều hơn."),
    p("Happy to dive into a project", "Câu 5: nhường interviewer hỏi sâu.", "Mình sẵn sàng kể một project", "Happy to dive into a project if useful.", "Nếu hữu ích mình kể một project."),
  ],
  23: [
    p("The problem was…", "Kể project: vấn đề user / business, không We used React.", "Vấn đề là…", "The problem was checkout failing at peak.", "Vấn đề là checkout fail giờ cao điểm."),
    p("My role was…", "Phần mình làm. Tránh we we we.", "Role của mình là…", "My role was owning the retry path.", "Role mình là chịu trách nhiệm nhánh retry."),
    p("We used…", "Stack một hơi, không liệt kê 12 tool.", "Mình dùng…", "We used Node, Postgres, and Redis.", "Mình dùng Node, Postgres và Redis."),
    p("The outcome was…", "Số hoặc kết quả. Không It went well.", "Kết quả là…", "The outcome was 40% fewer failed payments.", "Kết quả là giảm 40% thanh toán fail."),
    p("If I did it again…", "Một câu học được. Nghe senior hơn.", "Nếu làm lại…", "If I did it again, I'd add a feature flag first.", "Nếu làm lại, mình sẽ gắn feature flag trước."),
  ],
  24: [
    p("The situation was…", "STAR S: bối cảnh 1 câu.", "Tình huống là…", "The situation was a Friday incident.", "Tình huống là incident thứ Sáu."),
    p("My task was…", "STAR T: việc mình phải làm.", "Task của mình là…", "My task was to restore checkout.", "Task mình là khôi phục checkout."),
    p("I did…", "STAR A: 2 hành động cụ thể.", "Mình đã…", "I did a rollback, then added a guard.", "Mình rollback, rồi thêm guard."),
    p("The result was…", "STAR R: impact.", "Kết quả là…", "The result was we recovered in 20 minutes.", "Kết quả là khôi phục trong 20 phút."),
    p("What I learned…", "Một câu học. Không I learned to work harder.", "Mình học được…", "What I learned is to page earlier.", "Mình học được là page sớm hơn."),
  ],
  25: [
    p("I'd start by reproducing it", "Debug speaking: bước 1. Không đoán linh tinh.", "Mình sẽ bắt đầu bằng reproduce", "I'd start by reproducing it locally.", "Mình bắt đầu bằng reproduce local."),
    p("I'd check the logs", "Bước 2: evidence.", "Mình sẽ xem log", "I'd check the logs around the timestamp.", "Mình xem log quanh timestamp đó."),
    p("Then I'd isolate…", "Bước 3: thu hẹp.", "Rồi mình isolate…", "Then I'd isolate whether it's data or code.", "Rồi isolate xem do data hay code."),
    p("After that I'd fix and add a test", "Bước 4: fix + chặn tái phát.", "Sau đó mình fix và thêm test", "After that I'd fix and add a test.", "Sau đó fix và thêm test."),
    p("That's my first pass", "Khi chưa đủ data. Không giả vờ biết hết.", "Đó là hướng đầu tiên của mình", "That's my first pass — I'd need the stack trace.", "Đó là hướng đầu — mình cần stack trace."),
  ],
  26: [
    p("What's the team like?", "Hỏi ngược: người, không hỏi lương trước.", "Team như thế nào ạ?", "What's the team like day to day?", "Team ngày thường như thế nào ạ?"),
    p("How do you measure success?", "Hỏi kỳ vọng role. Nghe trưởng thành.", "Bạn đo success thế nào?", "How do you measure success in this role?", "Role này đo success thế nào ạ?"),
    p("What does the first 90 days look like?", "Onboarding. Thực tế hơn What's the culture?", "90 ngày đầu trông thế nào?", "What does the first 90 days look like?", "90 ngày đầu trông thế nào ạ?"),
    p("How do you handle on-call?", "IT: trực. Hỏi thẳng, lịch sự.", "On-call bên mình thế nào?", "How do you handle on-call and incidents?", "On-call và incident bên mình thế nào ạ?"),
    p("What are you hoping this hire owns?", "Ownership. Tốt hơn What tech stack?", "Bạn mong hire này own phần nào?", "What are you hoping this hire owns in six months?", "Sáu tháng nữa bạn mong người này own gì ạ?"),
  ],
};

function pick(days, bank) {
  return days.flatMap((day) => bank[day].slice(0, 1)).concat(
    days.length >= 5 ? [bank[days[0]][1], bank[days[2]][1]].filter(Boolean) : [],
  ).slice(0, 5);
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
    id: 1, week: 1, theme: "Chào Slack", kind: "learn", phrases: w1[1],
    pattern: {
      title: "Greeting + check-in",
      pattern: "Morning / Hey + (How's it going?) + Quick ping",
      explainVi: "Slack buổi sáng: một câu chào, hỏi thăm tối đa một câu, rồi mới ping việc. Không viết đoạn dài.",
      drills: drills(w1[1]).slice(0, 4),
    },
    dialogue: [
      d("A", "Morning, team", "Chào team buổi sáng"),
      d("B", "Hey everyone. How's it going?", "Chào mọi người. Dạo này thế nào?"),
      d("A", "Pretty good. Quick ping — is standup still at 10?", "Ổn. Ping nhanh — standup vẫn 10 giờ chứ?"),
      d("B", "Yep, 10 sharp. Priya moved it from 9:30.", "Ừ, đúng 10. Priya dời từ 9:30."),
      d("A", "Got it. I'll be there.", "Rõ. Mình sẽ vào."),
      d("B", "Cool. Have a good one.", "Ok. Chúc làm việc vui."),
      d("A", "You too — ping me if the API is down.", "Bạn cũng vậy — API chết thì ping mình."),
      d("B", "Will do. See you in standup.", "Ok. Gặp ở standup."),
    ],
    listen: L(
      "Chào buổi sáng trong office",
      V1,
      [
        d("B", "Morning. Standup's in five.", "Chào. Standup còn năm phút."),
        d("A", "Hey. How's it going?", "Chào. Dạo này thế nào?"),
        d("B", "Busy — the API flake came back overnight.", "Bận — API flake lại xuất hiện lúc đêm."),
        d("A", "Quick ping: is the war room in Slack or Zoom?", "Ping nhanh: war room ở Slack hay Zoom?"),
        d("B", "Slack first. Zoom only if it lasts past 10:15.", "Slack trước. Zoom chỉ khi kéo quá 10:15."),
        d("A", "I'll drop a note in #backend.", "Mình nhắn #backend."),
        d("B", "Thanks. Have a good one.", "Cảm ơn. Chúc làm việc vui."),
        d("A", "You too.", "Bạn cũng vậy."),
      ],
      [
        gist("Video 0:00–1:30: ghi 3 cụm chào / hỏi thăm bạn nghe được.", "Morning / hello / how's it going (hoặc tương đương trong clip)"),
        cloze("Trong hội thoại lạ, war room diễn ra ở đâu trước?", "Slack"),
        cloze("Zoom chỉ dùng khi nào?", "Nếu kéo quá 10:15"),
      ],
    ),
    scenario: "Morning Slack in the team channel. Ask the learner what they are actually working on today.",
  }),
  lesson({
    id: 2, week: 1, theme: "Standup", kind: "learn", phrases: w1[2],
    pattern: {
      title: "Yesterday / today / blocker",
      pattern: "Yesterday I finished… Today I'll… No blockers / I'm blocked on… That's it from me",
      explainVi: "Standup 3 nhịp: hôm qua, hôm nay, blocker. Mỗi nhịp một câu. Kết bằng That's it from me.",
      drills: drills(w1[2]).slice(0, 4),
    },
    dialogue: [
      d("A", "I'll go first.", "Mình nói trước."),
      d("B", "Go ahead — keep it to three beats.", "Nói đi — giữ ba nhịp."),
      d("A", "Yesterday I finished the login bug.", "Hôm qua mình xong bug login."),
      d("A", "Today I'll work on the API timeout. No blockers.", "Hôm nay làm timeout API. Không blocker."),
      d("A", "That's it from me.", "Mình hết rồi."),
      d("B", "Thanks. I'm blocked on staging, so I may ping you.", "Cảm ơn. Mình kẹt staging, lát có thể ping."),
      d("A", "Sure — after 11 is better.", "Ok — sau 11 thì tiện hơn."),
      d("B", "Copy that.", "Rõ."),
    ],
    listen: L(
      "Standup nói nhanh",
      null,
      [
        d("B", "Let's go around. Minh, you're up.", "Đi vòng. Minh, tới bạn."),
        d("A", "Yesterday I finished the retry tests.", "Hôm qua mình xong test retry."),
        d("B", "Nice. Today?", "Ổn. Hôm nay?"),
        d("A", "Today I'll work on the dashboard query. I'm blocked on analytics access.", "Hôm nay làm query dashboard. Mình kẹt quyền analytics."),
        d("B", "Who owns that access — Priya or Ops?", "Ai own quyền đó — Priya hay Ops?"),
        d("A", "Priya. I'll ping her after this.", "Priya. Họp xong mình ping."),
        d("B", "That's it from you?", "Bạn hết chứ?"),
        d("A", "That's it from me.", "Mình hết rồi."),
      ],
      [
        gist("Ai đang blocked, và blocked ở đâu?", "Minh / learner blocked on analytics access"),
        cloze("Ai own quyền analytics?", "Priya"),
        repair("Nếu miss tên, bạn nói gì?", "Could you repeat that? / What I heard is…"),
      ],
    ),
    scenario: "Daily standup. You speak first, then a teammate replies. Push the learner to fill yesterday/today with a real ticket.",
  }),
  lesson({
    id: 3, week: 1, theme: "Xin giúp", kind: "learn", phrases: w1[3],
    pattern: {
      title: "Soft request",
      pattern: "I'm stuck on… / Could you take a look? / When you have a minute. No rush.",
      explainVi: "Nhờ giúp: nói đang kẹt ở đâu, nhờ look, giảm áp lực (When you have a minute / No rush). Không nói I know nothing.",
      drills: drills(w1[3]).slice(0, 4),
    },
    dialogue: [
      d("A", "Hey — I'm stuck on this flaky test.", "Ê — mình kẹt test flaky."),
      d("A", "When you have a minute, could you take a look?", "Lúc rảnh bạn xem giúp với?"),
      d("B", "Sure. Which file — payment.spec or cart.spec?", "Được. File nào — payment.spec hay cart.spec?"),
      d("A", "payment.spec, the retry case.", "payment.spec, case retry."),
      d("B", "No rush on your side?", "Bên bạn không gấp chứ?"),
      d("A", "No rush. Thanks in advance.", "Không gấp. Cảm ơn trước."),
      d("B", "I'll check after standup and drop a thread.", "Standup xong mình xem rồi để thread."),
      d("A", "Perfect.", "Được luôn."),
    ],
    listen: L(
      "DM nhờ giúp, người kia nói nhanh",
      null,
      [
        d("A", "I'm stuck on the staging deploy script.", "Mình kẹt script deploy staging."),
        d("B", "Could you take a look when you have a minute? Wait — I can look at 2:30.", "Rảnh thì xem giúp? Khoan — 2:30 mình xem được."),
        d("A", "2:30 works. No rush.", "2:30 được. Không gấp."),
        d("B", "Is it the npm token or the Docker tag?", "Là npm token hay Docker tag?"),
        d("A", "Docker tag. It still points at latest.", "Docker tag. Vẫn trỏ latest."),
        d("B", "Okay, I'll ping you in-thread.", "Ok, mình ping trong thread."),
        d("A", "Thanks in advance.", "Cảm ơn trước."),
        d("B", "Anytime.", "Không sao."),
      ],
      [
        gist("Người nhờ đang kẹt việc gì?", "Staging deploy script / Docker tag"),
        cloze("Họ hẹn giờ nào?", "2:30"),
        cloze("Nguyên nhân nghi ngờ là gì?", "Docker tag vẫn trỏ latest"),
      ],
    ),
    scenario: "You DM a teammate because you are stuck on a real ticket. Stay calm and specific.",
  }),
  lesson({
    id: 4, week: 1, theme: "Hỏi lại ticket", kind: "learn", phrases: w1[4],
    pattern: {
      title: "Confirm + clarify",
      pattern: "Just to confirm… / Do you mean…? / What's the expected behavior? So the next step is…",
      explainVi: "Ticket mơ hồ: xác nhận, hỏi lại ý, hỏi expected, rồi chốt next step. Đừng bắt đầu code khi chưa rõ.",
      drills: drills(w1[4]).slice(0, 4),
    },
    dialogue: [
      d("A", "Just to confirm: this is only for empty search, right?", "Xác nhận: chỉ cho search rỗng thôi chứ?"),
      d("B", "Do you mean the search box on home or on orders?", "Ý bạn là ô search trang chủ hay trang orders?"),
      d("A", "Home. What's the expected behavior?", "Trang chủ. Kỳ vọng là gì?"),
      d("B", "Show a hint, don't crash. Copy from design ticket 441.", "Hiện hint, đừng crash. Copy từ ticket design 441."),
      d("A", "So the next step is to add the empty state.", "Vậy bước tiếp là thêm empty state."),
      d("B", "Yes — and skip the spinner.", "Ừ — và bỏ spinner."),
      d("A", "Got it, thanks. I'll update the ticket.", "Rõ, cảm ơn. Mình cập nhật ticket."),
      d("B", "Ping me if 441 is stale.", "Ticket 441 cũ thì ping mình."),
    ],
    listen: L(
      "Ticket mơ hồ, PM nói nhanh",
      null,
      [
        d("B", "Just to confirm we ship the empty state Friday, not Thursday.", "Xác nhận mình ship empty state thứ Sáu, không phải thứ Năm."),
        d("A", "Do you mean production Friday or staging Friday?", "Ý bạn là prod thứ Sáu hay staging thứ Sáu?"),
        d("B", "Staging Thursday. Production Friday after QA sign-off.", "Staging thứ Năm. Prod thứ Sáu sau QA ký."),
        d("A", "What's the expected behavior on zero results?", "Zero results thì kỳ vọng gì?"),
        d("B", "A hint plus a search-again button. No toast.", "Một hint và nút search lại. Không toast."),
        d("A", "So the next step is to update the copy in the ticket.", "Vậy bước tiếp là cập nhật copy trong ticket."),
        d("B", "Yep. Got it, thanks.", "Ừ. Rõ, cảm ơn."),
        d("A", "I'll post the AC in the thread.", "Mình post AC trong thread."),
      ],
      [
        gist("Prod ship ngày nào?", "Thứ Sáu, sau QA sign-off"),
        cloze("Staging ship ngày nào?", "Thứ Năm"),
        cloze("Zero results thì KHÔNG được hiện gì?", "Toast"),
      ],
    ),
    scenario: "Clarify a vague ticket with the PM before you code. Use a real ticket if the learner has one.",
  }),
  lesson({
    id: 5, week: 1, theme: "Update Slack", kind: "learn", phrases: w1[5],
    pattern: {
      title: "Status line",
      pattern: "Quick update: still working on… / shipped / waiting on… I'll post here when it's done.",
      explainVi: "Một dòng trạng thái: đang làm / đã ship / đang chờ. Hứa đóng loop. Không viết nhật ký.",
      drills: drills(w1[5]).slice(0, 4),
    },
    dialogue: [
      d("A", "Quick update: still working on the payment retry.", "Update nhanh: vẫn đang làm retry thanh toán."),
      d("B", "Need anything? QA is free after 3.", "Cần gì không? QA rảnh sau 3 giờ."),
      d("A", "Waiting on QA for the last case.", "Đang chờ QA case cuối."),
      d("B", "Okay, I'll poke them.", "Ok, mình nhắc họ."),
      d("A", "I'll post here when it's done.", "Xong mình báo ở đây."),
      d("B", "Shipped on my side. Have a good one.", "Bên mình đã ship. Chúc làm việc vui."),
      d("A", "Nice — which ticket?", "Hay — ticket nào?"),
      d("B", "VEHO-218, the timeout banner.", "VEHO-218, banner timeout."),
    ],
    listen: L(
      "Status Slack giữa ngày",
      null,
      [
        d("A", "Quick update: still working on the export job.", "Update nhanh: vẫn đang làm job export."),
        d("B", "Blocked?", "Bị kẹt?"),
        d("A", "Waiting on the warehouse dump. ETA 4pm.", "Đang chờ dump warehouse. ETA 4 giờ."),
        d("B", "Shipped the UI stub already.", "UI stub đã ship rồi."),
        d("A", "I'll post here when the dump lands.", "Dump về là mình báo ở đây."),
        d("B", "If it slips past 5, flag #data.", "Nếu trễ quá 5 giờ, báo #data."),
        d("A", "Copy.", "Rõ."),
        d("B", "Thanks. Have a good one.", "Cảm ơn. Chúc làm việc vui."),
      ],
      [
        gist("Việc nào vẫn đang làm, việc nào đã ship?", "Export job vẫn làm; UI stub đã ship"),
        cloze("ETA dump là mấy giờ?", "4pm / 4 giờ"),
        cloze("Trễ quá 5 giờ thì báo channel nào?", "#data"),
      ],
    ),
    scenario: "Post a short status in Slack during the day about a real task.",
  }),
];

const reviewWeek1Phrases = pick([1, 2, 3, 4, 5], w1);
lessons.push(
  lesson({
    id: 6, week: 1, theme: "Tổng hợp tuần 1", kind: "review", phrases: reviewWeek1Phrases,
    pattern: {
      title: "Ghép standup + Slack",
      pattern: "Morning → standup 3 câu → quick update",
      explainVi: "Nói hết một buổi sáng: chào, standup, một ping nhờ việc hoặc update. Không thêm cụm mới.",
      drills: drills(reviewWeek1Phrases).slice(0, 4),
    },
    dialogue: [
      d("A", "Morning, team", "Chào team buổi sáng"),
      d("B", "How's it going?", "Dạo này thế nào?"),
      d("A", "Yesterday I finished the login bug. Today I'll work on tests.", "Hôm qua xong bug login. Hôm nay làm test."),
      d("A", "No blockers. That's it from me.", "Không blocker. Mình hết rồi."),
      d("B", "Could you take a look when you have a minute?", "Rảnh thì xem giúp mình với?"),
      d("A", "No rush. I'll post here when it's done.", "Không gấp. Xong mình báo ở đây."),
      d("B", "Quick ping later about staging?", "Lát ping nhanh về staging nhé?"),
      d("A", "Sure. Just to confirm: after 2pm.", "Ok. Xác nhận: sau 2 giờ."),
    ],
    listen: L(
      "Một buổi sáng: chào, standup, ping",
      V1,
      [
        d("A", "Morning, team. Yesterday I finished the timeout fix.", "Chào team. Hôm qua xong fix timeout."),
        d("A", "Today I'll work on tests. I'm blocked on staging.", "Hôm nay làm test. Mình kẹt staging."),
        d("B", "Got it. Quick ping — can you take a look at VEHO-301 when you have a minute?", "Rõ. Ping nhanh — rảnh thì xem VEHO-301?"),
        d("A", "No rush on my side. What's the expected behavior?", "Bên mình không gấp. Kỳ vọng là gì?"),
        d("B", "Empty cart should warn, not 500.", "Giỏ trống thì cảnh báo, đừng 500."),
        d("A", "So the next step is a guard. I'll post here when it's done.", "Bước tiếp là guard. Xong mình báo."),
        d("B", "Thanks in advance.", "Cảm ơn trước."),
        d("A", "Have a good one.", "Chúc làm việc vui."),
      ],
      [
        gist("Video: thêm 2 cụm chào khác ngày 1.", "Ví dụ hello / see you / how's work (tuỳ clip)"),
        cloze("Ticket được nhắc tên là gì?", "VEHO-301"),
        cloze("Empty cart kỳ vọng gì?", "Warn, not 500"),
      ],
    ),
    scenario: "A full quiet morning: greeting, standup, then one Slack ping about a real ticket.",
  }),
  lesson({
    id: 7, week: 1, theme: "AI standup", kind: "review", phrases: reviewWeek1Phrases,
    pattern: {
      title: "Chỉ dùng mẫu tuần 1",
      pattern: "Standup + one Slack ping",
      explainVi: "Roleplay: standup rồi một tin Slack. AI chỉ được dùng cụm tuần 1.",
      drills: drills(reviewWeek1Phrases).slice(0, 4),
    },
    dialogue: [
      d("B", "Your turn.", "Tới bạn."),
      d("A", "Yesterday I finished the timeout fix.", "Hôm qua xong fix timeout."),
      d("A", "Today I'll work on tests. I'm blocked on staging.", "Hôm nay làm test. Mình kẹt staging."),
      d("A", "That's it from me.", "Mình hết rồi."),
      d("B", "Got it, thanks. Quick ping later?", "Rõ. Lát ping nhanh nhé?"),
      d("A", "Sure. Thanks in advance.", "Ok. Cảm ơn trước."),
      d("B", "Just to confirm: you're blocked on the deploy, not the tests.", "Xác nhận: bạn kẹt deploy, không phải test."),
      d("A", "Yes. Waiting on staging.", "Đúng. Đang chờ staging."),
    ],
    listen: L(
      "Standup rồi một ping Slack",
      null,
      [
        d("B", "I'll start. Yesterday I shipped the banner.", "Mình nói trước. Hôm qua ship banner."),
        d("B", "Today I'll work on copy. No blockers.", "Hôm nay làm copy. Không blocker."),
        d("A", "Yesterday I finished the timeout. Today I'll work on tests. I'm blocked on staging.", "Hôm qua xong timeout. Hôm nay test. Kẹt staging."),
        d("B", "Could you take a look at my PR when you have a minute?", "Rảnh xem PR mình với?"),
        d("A", "No rush. Just to confirm it's the retry PR?", "Không gấp. Xác nhận là PR retry chứ?"),
        d("B", "Yes, VEHO-218.", "Ừ, VEHO-218."),
        d("A", "I'll post here when it's done.", "Xong mình báo ở đây."),
        d("B", "Thanks in advance. Have a good one.", "Cảm ơn trước. Chúc làm việc vui."),
      ],
      [
        gist("Bạn (A) bị blocked ở đâu?", "Staging"),
        cloze("PR cần xem là ticket nào?", "VEHO-218"),
        cloze("Bên B hôm qua đã ship gì?", "Banner"),
      ],
    ),
    scenario: "Standup plus one Slack ping. Stay inside week 1 phrases when you speak; the teammate may add workplace English.",
    extra: "You start the standup. Ask what ticket they shipped.",
  }),
);

lessons.push(
  lesson({
    id: 8, week: 2, theme: "Vào meeting", kind: "learn", phrases: w2[8],
    pattern: {
      title: "Join + setup",
      pattern: "Can you hear me? I'll share my screen. Let's get started.",
      explainVi: "30 giây đầu: âm thanh, xin lỗi nếu muộn một câu, share, bắt đầu. Đừng kể lý do 1 phút.",
      drills: drills(w2[8]).slice(0, 4),
    },
    dialogue: [
      d("A", "Can you hear me?", "Mọi người nghe mình không?"),
      d("B", "Yes. I might be on mute — hang on.", "Nghe. Có thể mình đang mute — chờ xíu."),
      d("A", "Sorry I'm a couple minutes late.", "Xin lỗi mình muộn vài phút."),
      d("B", "All good. Priya's still joining.", "Không sao. Priya vẫn đang vào."),
      d("A", "I'll share my screen. Let's get started.", "Mình share màn hình. Bắt đầu nhé."),
      d("B", "Ready — you're looking at staging, right?", "Sẵn sàng — bạn đang mở staging chứ?"),
      d("A", "Yes, staging dashboard.", "Đúng, dashboard staging."),
      d("B", "Loud and clear.", "Nghe rõ."),
    ],
    listen: L(
      "30 giây đầu cuộc họp",
      V2,
      [
        d("A", "Can you hear me? I might be on mute.", "Nghe mình không? Có thể mình đang mute."),
        d("B", "We can. Sorry, I was a couple minutes late too.", "Nghe. Xin lỗi mình cũng muộn vài phút."),
        d("A", "I'll share my screen — one sec.", "Mình share màn hình — chờ xíu."),
        d("B", "You're sharing the local build, not staging.", "Bạn đang share bản local, không phải staging."),
        d("A", "Ah — switching. Let's get started.", "À — đổi. Bắt đầu nhé."),
        d("B", "Can we start with the 500s from 9:12?", "Bắt đầu với mấy cái 500 lúc 9:12 được không?"),
        d("A", "Yes. Timestamp 9:12.", "Được. Timestamp 9:12."),
        d("B", "Got it.", "Rõ."),
      ],
      [
        gist("Video 0:00–2:00: cuộc nói chuyện đang ở đâu (họp / điện thoại / bàn)?", "Office / meeting / phone (tuỳ đoạn clip)"),
        cloze("Họ bắt đầu với timestamp nào?", "9:12"),
        cloze("Lúc đầu share nhầm môi trường nào?", "Local build, không phải staging"),
      ],
    ),
    scenario: "The first 30 seconds of a Zoom meeting about a real ticket.",
  }),
  lesson({
    id: 9, week: 2, theme: "Đồng ý / từ chối lịch sự", kind: "learn", phrases: w2[9],
    pattern: {
      title: "Soft yes / no",
      pattern: "That works for me / I'd prefer… / Can we push this to tomorrow? Let's lock that in.",
      explainVi: "Đồng ý ngắn. Từ chối thì đưa giờ khác. Chốt bằng Let's lock that in. Tránh Sorry sorry sorry.",
      drills: drills(w2[9]).slice(0, 4),
    },
    dialogue: [
      d("B", "Can we do 4pm?", "4 giờ được không?"),
      d("A", "I'd prefer tomorrow morning.", "Mình nghiêng về sáng mai."),
      d("B", "10am? Minh has a deploy at 9.", "10 giờ? Minh có deploy lúc 9."),
      d("A", "That works for me.", "Mình ok."),
      d("B", "I'm good either way.", "Sao cũng được."),
      d("A", "Tomorrow 10. Let's lock that in.", "Mai 10 giờ. Chốt vậy nhé."),
      d("B", "Can we push the Friday review if this slips?", "Review thứ Sáu mà trễ thì dời được không?"),
      d("A", "Yes — I'd prefer Monday.", "Được — mình nghiêng về thứ Hai."),
    ],
    listen: L(
      "Dời họp, người kia nói giờ nhanh",
      null,
      [
        d("B", "Can we do 3:45 today?", "Hôm nay 3:45 được không?"),
        d("A", "I'd prefer tomorrow. I have a deploy at 4.", "Mình nghiêng về mai. 4 giờ mình có deploy."),
        d("B", "Tomorrow 9:30 or 11?", "Mai 9:30 hay 11?"),
        d("A", "11 works for me.", "11 mình ok."),
        d("B", "I'm good either way — let's lock 11.", "Sao cũng được — chốt 11."),
        d("A", "Can we push the design review to Wednesday if needed?", "Design review dời thứ Tư nếu cần được không?"),
        d("B", "That works. I'll move the invite.", "Được. Mình chuyển invite."),
        d("A", "Thanks. Let's lock that in.", "Cảm ơn. Chốt vậy."),
      ],
      [
        gist("Họ chốt giờ nào cho cuộc họp chính?", "11:00 tomorrow"),
        cloze("Vì sao không họp 3:45 hôm nay?", "Có deploy lúc 4"),
        cloze("Design review có thể dời sang ngày nào?", "Wednesday / thứ Tư"),
      ],
    ),
    scenario: "Reschedule a meeting politely over Slack using a real calendar conflict.",
  }),
  lesson({
    id: 10, week: 2, theme: "Xin nói chậm", kind: "learn", phrases: w2[10],
    pattern: {
      title: "Repair",
      pattern: "Could you repeat that? / slow down a bit / What I heard is… / I missed the last part",
      explainVi: "Không bắt kịp: xin nhắc, xin chậm, lặp lại điều mình nghe. Không xin lỗi vì tiếng Anh kém.",
      drills: drills(w2[10]).slice(0, 4),
    },
    dialogue: [
      d("B", "We'll roll this out to EU first, then US next week, then APAC on the 21st.", "Roll EU trước, rồi US tuần sau, APAC ngày 21."),
      d("A", "Could you slow down a bit? I missed the last part.", "Nói chậm hơn chút? Mình miss đoạn cuối."),
      d("B", "EU first. US next week. APAC on the 21st.", "EU trước. US tuần sau. APAC ngày 21."),
      d("A", "What I heard is EU first, then US next week, APAC on the 21st.", "Mình nghe là EU trước, US tuần sau, APAC ngày 21."),
      d("B", "Exactly. Owner is Priya.", "Đúng. Owner là Priya."),
      d("A", "Could you repeat that — the owner?", "Nhắc lại owner được không?"),
      d("B", "Priya.", "Priya."),
      d("A", "Thanks, that helps.", "Cảm ơn, rõ rồi."),
    ],
    listen: L(
      "Teammate nói nhanh: số, vùng, tên",
      null,
      [
        d("B", "We cut over EU at 09:00 UTC, US at 14:00, then APAC Monday.", "Cắt EU 09:00 UTC, US 14:00, APAC thứ Hai."),
        d("A", "Could you slow down a bit? I missed the last part.", "Nói chậm hơn? Mình miss đoạn cuối."),
        d("B", "APAC Monday. Not Tuesday.", "APAC thứ Hai. Không phải thứ Ba."),
        d("A", "What I heard is EU 09:00 UTC, US 14:00, APAC Monday.", "Mình nghe EU 09:00 UTC, US 14:00, APAC thứ Hai."),
        d("B", "Yes. On-call is Minh until 18:00.", "Đúng. On-call là Minh đến 18:00."),
        d("A", "Could you repeat the on-call name?", "Nhắc lại tên on-call?"),
        d("B", "Minh, until 18:00.", "Minh, đến 18:00."),
        d("A", "Thanks, that helps.", "Cảm ơn, rõ rồi."),
      ],
      [
        gist("APAC cắt khi nào?", "Monday / thứ Hai"),
        cloze("EU cắt lúc mấy giờ UTC?", "09:00"),
        repair("Viết đúng một câu xin nhắc owner/on-call.", "Could you repeat that? / Could you repeat the on-call name?"),
      ],
    ),
    scenario: "A fast-speaking teammate in a meeting. Repair without apologizing for your English.",
  }),
  lesson({
    id: 11, week: 2, theme: "Code review", kind: "learn", phrases: w2[11],
    pattern: {
      title: "Review comment",
      pattern: "Looks good overall. Small nit / Have you considered…? I'd rename this. Happy to merge after that.",
      explainVi: "Nói và viết comment: khen ngắn, nit, gợi ý, chốt merge. Không This is bad.",
      drills: drills(w2[11]).slice(0, 4),
    },
    dialogue: [
      d("A", "Looks good overall.", "Nhìn chung ổn."),
      d("A", "Small nit: I'd rename this to fetchUserById.", "Nit nhỏ: mình đổi tên thành fetchUserById."),
      d("B", "Have you considered a cache here?", "Bạn đã nghĩ tới cache ở đây chưa?"),
      d("A", "Not yet. I can add a follow-up.", "Chưa. Mình có thể làm follow-up."),
      d("B", "Happy to merge after that nit.", "Sửa nit đó xong là merge được."),
      d("A", "Sounds good. I'll push in ten.", "Ok. Mười phút nữa mình push."),
      d("B", "Also — have you considered a feature flag?", "À — đã nghĩ feature flag chưa?"),
      d("A", "Good call. I'll add it on the retry path.", "Hợp lý. Mình gắn trên nhánh retry."),
    ],
    listen: L(
      "Review call nói nhanh",
      null,
      [
        d("B", "Looks good overall. Small nit on line 84.", "Nhìn chung ổn. Nit nhỏ dòng 84."),
        d("A", "I'd rename this to fetchUserById — is that the nit?", "Mình đổi tên fetchUserById — đó là nit chứ?"),
        d("B", "Yes. Have you considered memoizing the client?", "Đúng. Đã nghĩ memoize client chưa?"),
        d("A", "Not in this PR. Follow-up?", "PR này chưa. Follow-up?"),
        d("B", "Happy to merge after the rename. Flag the follow-up in the ticket.", "Rename xong là merge. Ghi follow-up vào ticket."),
        d("A", "Will do.", "Ok."),
        d("B", "Please don't bike-shed the tests.", "Đừng cãi vã test nữa."),
        d("A", "Copy. Thanks.", "Rõ. Cảm ơn."),
      ],
      [
        gist("Nit nằm ở đâu / dòng nào?", "Line 84 / rename fetchUserById"),
        cloze("Merge được sau khi làm gì?", "Rename"),
        cloze("Follow-up nên ghi ở đâu?", "In the ticket"),
      ],
    ),
    scenario: "Talk through a PR comment, then say the same idea in one spoken line about a real PR.",
  }),
  lesson({
    id: 12, week: 2, theme: "Next steps", kind: "learn", phrases: w2[12],
    pattern: {
      title: "Close the loop",
      pattern: "I'll follow up / Let's sync tomorrow / Action item for me / I'll send a recap / Anything else before we jump?",
      explainVi: "4 câu cuối họp: ai làm gì, bao giờ sync, recap, đóng cửa. Tránh họp tan mà không có owner.",
      drills: drills(w2[12]).slice(0, 4),
    },
    dialogue: [
      d("A", "Action item for me: update the runbook.", "Việc mình nhận: cập nhật runbook."),
      d("B", "I'll follow up with design by Thursday.", "Mình follow up design trước thứ Năm."),
      d("A", "Let's sync tomorrow on the rollout.", "Mai sync về rollout nhé."),
      d("B", "I'll send a recap with owners.", "Mình gửi recap kèm owner."),
      d("A", "Anything else before we jump?", "Còn gì nữa trước khi kết không?"),
      d("B", "Nope. Thanks.", "Không. Cảm ơn."),
      d("A", "I'll follow up in Slack if the flag slips.", "Flag trễ thì mình follow up Slack."),
      d("B", "Let's lock that in.", "Chốt vậy."),
    ],
    listen: L(
      "Đóng họp: owner và deadline",
      null,
      [
        d("B", "Action item for me: the rollback plan.", "Việc mình: plan rollback."),
        d("A", "I'll follow up with QA after this.", "Họp xong mình follow up QA."),
        d("B", "Let's sync tomorrow at 10:30 on the rollout.", "Mai 10:30 sync rollout."),
        d("A", "I'll send a recap. Owners: you on rollback, me on QA.", "Mình gửi recap. Owner: bạn rollback, mình QA."),
        d("B", "Anything else before we jump?", "Còn gì nữa không?"),
        d("A", "If EU slips, page Priya, not the whole channel.", "EU trễ thì page Priya, đừng page cả channel."),
        d("B", "Copy. Thanks.", "Rõ. Cảm ơn."),
        d("A", "Let's lock that in.", "Chốt vậy."),
      ],
      [
        gist("Ai nhận rollback, ai nhận QA?", "B rollback; A / learner QA"),
        cloze("Sync mai lúc mấy giờ?", "10:30"),
        cloze("EU trễ thì page ai?", "Priya"),
      ],
    ),
    scenario: "Close a 15-minute meeting with owners and a recap. Use a real meeting if you have one today.",
  }),
);

const reviewWeek2Phrases = pick([8, 9, 10, 11, 12], w2);
lessons.push(
  lesson({
    id: 13, week: 2, theme: "Tổng hợp tuần 2", kind: "review", phrases: reviewWeek2Phrases,
    pattern: {
      title: "Họp ngắn",
      pattern: "Join → one repair → next steps",
      explainVi: "Vào họp, xin nhắc một câu nếu miss, rồi chốt next steps. Không thêm cụm.",
      drills: drills(reviewWeek2Phrases).slice(0, 4),
    },
    dialogue: [
      d("A", "Can you hear me? Let's get started.", "Nghe mình không? Bắt đầu nhé."),
      d("B", "That works for me.", "Mình ok."),
      d("A", "Could you repeat that?", "Nhắc lại được không?"),
      d("B", "I'll follow up in Slack after 3.", "Sau 3 giờ mình follow up Slack."),
      d("A", "What I heard is you'll follow up in Slack after 3.", "Mình nghe là sau 3 giờ bạn follow up Slack."),
      d("A", "I'll send a recap. Anything else before we jump?", "Mình gửi recap. Còn gì nữa không?"),
      d("B", "Action item for me: the invite.", "Việc mình: cái invite."),
      d("A", "Let's lock that in.", "Chốt vậy."),
    ],
    listen: L(
      "Họp ngắn: join, repair, next steps",
      V2,
      [
        d("A", "Can you hear me? Sorry I'm a couple minutes late.", "Nghe không? Xin lỗi muộn vài phút."),
        d("B", "All good. I'll share — wait, I might be on mute.", "Không sao. Mình share — khoan, có thể đang mute."),
        d("A", "Could you slow down a bit? I missed the last part.", "Nói chậm hơn? Miss đoạn cuối."),
        d("B", "Next week EU, then US on the 18th.", "Tuần sau EU, rồi US ngày 18."),
        d("A", "What I heard is EU next week, US on the 18th.", "Mình nghe EU tuần sau, US ngày 18."),
        d("B", "I'll follow up with a recap.", "Mình follow up recap."),
        d("A", "Action item for me: the flag. Anything else before we jump?", "Việc mình: cái flag. Còn gì nữa không?"),
        d("B", "Nope. Let's lock that in.", "Không. Chốt vậy."),
      ],
      [
        gist("Video: bắt một số hoặc một deadline trong clip.", "Ghi đúng số/ngày bạn nghe được"),
        cloze("US roll ngày nào?", "18th / ngày 18"),
        repair("Viết câu confirm lại lịch EU/US.", "What I heard is EU next week, US on the 18th."),
      ],
    ),
    scenario: "A short meeting from join to next steps. Repair if you miss a date.",
  }),
  lesson({
    id: 14, week: 2, theme: "AI họp 15 phút", kind: "review", phrases: [...reviewWeek1Phrases.slice(0, 2), ...reviewWeek2Phrases.slice(0, 3)],
    pattern: {
      title: "Standup rồi daily sync",
      pattern: "Week 1 standup + week 2 meeting close",
      explainVi: "AI: standup ngắn rồi họp 15 phút. Chỉ dùng cụm tuần 1–2.",
      drills: drills([...reviewWeek1Phrases.slice(0, 2), ...reviewWeek2Phrases.slice(0, 3)]).slice(0, 4),
    },
    dialogue: [
      d("A", "Yesterday I finished the retry. Today I'll work on tests. That's it from me.", "Hôm qua xong retry. Hôm nay làm test. Mình hết."),
      d("B", "Let's get started on the sync.", "Bắt đầu sync nhé."),
      d("A", "Could you slow down a bit?", "Nói chậm hơn chút?"),
      d("B", "I'll follow up after this — owners by 4pm.", "Xong họp mình follow up — owner trước 4 giờ."),
      d("A", "Action item for me: the recap. Let's lock that in.", "Việc mình: recap. Chốt vậy."),
      d("B", "Anything else before we jump?", "Còn gì nữa không?"),
      d("A", "What I heard is owners by 4pm.", "Mình nghe là owner trước 4 giờ."),
      d("B", "Yes. Thanks.", "Đúng. Cảm ơn."),
    ],
    listen: L(
      "Standup rồi sync 15 phút",
      null,
      [
        d("A", "Yesterday I finished the retry. Today I'll work on tests. No blockers.", "Hôm qua xong retry. Hôm nay test. Không blocker."),
        d("B", "Can you hear me? Let's get started.", "Nghe không? Bắt đầu nhé."),
        d("A", "Could you repeat the rollout window?", "Nhắc lại cửa sổ rollout?"),
        d("B", "Thursday 21:00 UTC. Not Friday.", "Thứ Năm 21:00 UTC. Không phải thứ Sáu."),
        d("A", "What I heard is Thursday 21:00 UTC.", "Mình nghe thứ Năm 21:00 UTC."),
        d("B", "I'll follow up in Slack. Action item for me: the flag.", "Mình follow up Slack. Việc mình: flag."),
        d("A", "I'll send a recap. Anything else before we jump?", "Mình gửi recap. Còn gì không?"),
        d("B", "That's it. Let's lock that in.", "Hết. Chốt vậy."),
      ],
      [
        gist("Rollout lúc nào?", "Thursday 21:00 UTC"),
        cloze("Không phải ngày nào?", "Friday / thứ Sáu"),
        cloze("Action item của B là gì?", "The flag"),
      ],
    ),
    scenario: "Standup, then a 15-minute sync. Speak with week 1–2 phrases; the teammate may add extra English.",
  }),
);

lessons.push(
  lesson({
    id: 15, week: 3, theme: "Kể bug 4 câu", kind: "learn", phrases: w3[15],
    pattern: {
      title: "Bug in 4 beats",
      pattern: "We're seeing… It happens when… Expected vs actual. I already tried…",
      explainVi: "Bốn nhịp: triệu chứng, reproduce, expected/actual, đã thử gì. Rồi mới nhờ look.",
      drills: drills(w3[15]).slice(0, 4),
    },
    dialogue: [
      d("A", "We're seeing 500s on checkout.", "Bên mình đang thấy 500 ở checkout."),
      d("A", "It happens when the cart is empty.", "Nó xảy ra khi giỏ trống."),
      d("A", "Expected: a warning. Actual: a crash.", "Kỳ vọng: cảnh báo. Thực tế: crash."),
      d("A", "I already tried clearing cache.", "Mình đã thử xóa cache."),
      d("A", "Can you take a look?", "Bạn xem giúp được không?"),
      d("B", "Yes — send the timestamp. Was it 10:04 or 10:14?", "Được — gửi timestamp. 10:04 hay 10:14?"),
      d("A", "10:04 UTC. Logs in #incidents.", "10:04 UTC. Log ở #incidents."),
      d("B", "Got it. I'll look after standup.", "Rõ. Standup xong mình xem."),
    ],
    listen: L(
      "Kể bug: symptom / when / expected",
      V3,
      [
        d("A", "We're seeing timeouts on export, not 500s.", "Bên mình thấy timeout ở export, không phải 500."),
        d("B", "It happens when the file is over 50MB?", "Xảy ra khi file trên 50MB?"),
        d("A", "Yes. Expected: a warning. Actual: the job dies silently.", "Đúng. Kỳ vọng: cảnh báo. Thực tế: job chết im."),
        d("A", "I already tried bumping the timeout to 120 seconds.", "Mình đã thử tăng timeout lên 120 giây."),
        d("B", "Can you take a look at the worker logs from 08:12?", "Bạn xem log worker lúc 08:12 được không?"),
        d("A", "I'll pull them. Can you take a look after that?", "Mình kéo log. Xong bạn xem giúp?"),
        d("B", "Send the request id too.", "Gửi luôn request id."),
        d("A", "Will do.", "Ok."),
      ],
      [
        gist("Video 0:00–2:00: speaker đang giải thích vấn đề gì? Một câu.", "Ghi gist CS50 / computer science intro (tuỳ đoạn)"),
        cloze("Export fail khi file thế nào?", "Over 50MB"),
        cloze("Expected vs actual là gì?", "Warning vs job dies silently"),
      ],
    ),
    scenario: "Explain a real bug to a teammate in four short beats.",
  }),
  lesson({
    id: 16, week: 3, theme: "Viết prompt Cursor", kind: "learn", phrases: w3[16],
    pattern: {
      title: "Work prompt",
      pattern: "Act as… Given this code… Don't change unrelated files. Return only… Be concise.",
      explainVi: "Prompt làm việc: vai, context, khóa scope, khóa output. Không Please kindly help me write…",
      drills: drills(w3[16]).slice(0, 4),
    },
    dialogue: [
      d("A", "I need a prompt for this timeout bug.", "Mình cần prompt cho bug timeout này."),
      d("B", "Start with Act as a senior engineer.", "Bắt đầu bằng Act as a senior engineer."),
      d("A", "Given this code, find the null crash.", "Với đoạn code này, tìm crash null."),
      d("A", "Don't change unrelated files. Return only the patch.", "Đừng sửa file lạ. Chỉ trả về patch."),
      d("B", "Add Be concise at the end. Then read it out loud.", "Cuối thêm Be concise. Rồi đọc thành tiếng."),
      d("A", "Act as a senior engineer. Given this code, don't change unrelated files. Return only the patch. Be concise.", "Đóng vai senior. Với code này, đừng sửa file lạ. Chỉ trả patch. Ngắn."),
      d("B", "Good. Paste the failing test too.", "Ổn. Dán luôn test đang fail."),
      d("A", "Got it.", "Rõ."),
    ],
    listen: L(
      "Nghe rồi đọc một prompt Cursor",
      null,
      [
        d("B", "Read your prompt out loud before you paste it.", "Đọc prompt thành tiếng trước khi dán."),
        d("A", "Act as a senior engineer reviewing this timeout.", "Đóng vai senior engineer review timeout này."),
        d("A", "Given this code, find why retry fires twice.", "Với đoạn code này, tìm vì sao retry bắn hai lần."),
        d("A", "Don't change unrelated files.", "Đừng sửa file không liên quan."),
        d("A", "Return only the patch. Be concise.", "Chỉ trả về patch. Ngắn."),
        d("B", "Add: list edge cases in two bullets after the patch.", "Thêm: sau patch, hai bullet edge case."),
        d("A", "Okay. I'll say that too.", "Ok. Mình nói luôn."),
        d("B", "Go.", "Nói đi."),
      ],
      [
        gist("Prompt này nhờ AI tìm gì?", "Why retry fires twice / timeout"),
        cloze("Output bị khóa thế nào?", "Return only the patch"),
        cloze("Còn phải liệt kê gì sau patch?", "Two bullets of edge cases"),
      ],
    ),
    scenario: "Together you write one Cursor prompt for a real task, then speak it out loud.",
  }),
  lesson({
    id: 17, week: 3, theme: "Giải thích PR", kind: "learn", phrases: w3[17],
    pattern: {
      title: "PR walkthrough",
      pattern: "This PR… The main change is… The risk is… Please review the… Ready to merge if LGTM",
      explainVi: "45 giây trước khi người ta mở diff: mục đích, chỗ chính, risk, nhờ đúng chỗ.",
      drills: drills(w3[17]).slice(0, 4),
    },
    dialogue: [
      d("A", "This PR adds retry on payments.", "PR này thêm retry thanh toán."),
      d("A", "The main change is in PaymentService.", "Thay đổi chính ở PaymentService."),
      d("A", "The risk is double charges if retry races.", "Rủi ro là charge hai lần nếu retry đua."),
      d("A", "Please review the timeout logic.", "Nhờ review logic timeout."),
      d("B", "Will do. Tests in the same PR?", "Ok mình xem. Test nằm cùng PR chứ?"),
      d("A", "Yes. Ready to merge if LGTM.", "Có. LGTM thì merge được."),
      d("B", "I'll look at PaymentService first.", "Mình xem PaymentService trước."),
      d("A", "Thanks — comment on the race, please.", "Cảm ơn — comment chỗ race giúp."),
    ],
    listen: L(
      "Walkthrough PR 45 giây",
      null,
      [
        d("A", "This PR adds a circuit breaker on export.", "PR này thêm circuit breaker cho export."),
        d("A", "The main change is in ExportWorker.", "Thay đổi chính ở ExportWorker."),
        d("A", "The risk is jobs getting stuck open if the breaker never resets.", "Rủi ro là job kẹt mở nếu breaker không reset."),
        d("A", "Please review the reset timer.", "Nhờ review timer reset."),
        d("B", "Is there a metric for open vs closed?", "Có metric open vs closed không?"),
        d("A", "Not yet — follow-up. Ready to merge if LGTM on the timer.", "Chưa — follow-up. Timer LGTM thì merge."),
        d("B", "I'll comment in 20 minutes.", "20 phút nữa mình comment."),
        d("A", "Thanks.", "Cảm ơn."),
      ],
      [
        gist("PR này thêm gì?", "Circuit breaker on export"),
        cloze("File/class chính là gì?", "ExportWorker"),
        cloze("Risk là gì?", "Jobs stuck open if breaker never resets"),
      ],
    ),
    scenario: "Walk a teammate through your real PR in 45 seconds.",
  }),
  lesson({
    id: 18, week: 3, theme: "Nhờ AI review", kind: "learn", phrases: w3[18],
    pattern: {
      title: "Meta-prompt",
      pattern: "Review this for bugs. List edge cases. Suggest tests. Don't rewrite everything. Be concise.",
      explainVi: "Nhờ AI soi, không nhờ viết lại cả PR. Khóa rewrite, xin list và test ý.",
      drills: drills(w3[18]).slice(0, 4),
    },
    dialogue: [
      d("A", "I'll paste the diff.", "Mình dán diff."),
      d("A", "Review this for bugs. List edge cases.", "Review tìm bug. Liệt kê edge case."),
      d("A", "Suggest tests for the retry path.", "Gợi ý test cho nhánh retry."),
      d("A", "Don't rewrite everything.", "Đừng viết lại hết."),
      d("B", "Be concise — bullet points. Then read it.", "Ngắn — gạch đầu dòng. Rồi đọc."),
      d("A", "Review this for bugs. List edge cases. Suggest tests. Don't rewrite everything. Be concise.", "Review tìm bug. Liệt kê edge. Gợi ý test. Đừng viết lại. Ngắn."),
      d("B", "Good. Add 'comments only'.", "Ổn. Thêm comments only."),
      d("A", "Yes.", "Ừ."),
    ],
    listen: L(
      "Nghe meta-prompt, rồi đọc thành tiếng",
      null,
      [
        d("B", "Dictate the meta-prompt. I will interrupt if it's vague.", "Đọc meta-prompt. Câu mơ hồ mình cắt."),
        d("A", "Review this for bugs and race conditions.", "Review tìm bug và race."),
        d("A", "List edge cases I missed.", "Liệt kê edge case mình miss."),
        d("A", "Suggest tests for the retry path.", "Gợi ý test nhánh retry."),
        d("A", "Don't rewrite everything. Comments only.", "Đừng viết lại hết. Chỉ comment."),
        d("A", "Be concise — bullet points.", "Ngắn — gạch đầu dòng."),
        d("B", "What file is in scope?", "File nào trong scope?"),
        d("A", "PaymentService only.", "Chỉ PaymentService."),
      ],
      [
        gist("AI được phép viết lại code không?", "Không — comments only / don't rewrite"),
        cloze("Cần gợi ý test cho nhánh nào?", "Retry path"),
        cloze("Scope file nào?", "PaymentService only"),
      ],
    ),
    scenario: "Dictate a meta-prompt asking AI to review a PR, not rewrite it. Speak the prompt out loud.",
  }),
  lesson({
    id: 19, week: 3, theme: "Share màn hình", kind: "learn", phrases: w3[19],
    pattern: {
      title: "Demo talk",
      pattern: "You're looking at… I'll go top to bottom. This part is new. Any questions so far? I'll pause here.",
      explainVi: "Demo 1 phút: định vị màn hình, đi có thứ tự, chỉ chỗ mới, pause hỏi.",
      drills: drills(w3[19]).slice(0, 4),
    },
    dialogue: [
      d("A", "You're looking at the staging dashboard.", "Mọi người đang thấy dashboard staging."),
      d("A", "I'll go top to bottom, then questions.", "Mình đi từ trên xuống, rồi hỏi."),
      d("A", "This part is new — the retry badge.", "Phần này mới — badge retry."),
      d("A", "Any questions so far?", "Tới đây có hỏi gì không?"),
      d("B", "Not yet. What does red mean?", "Chưa. Đỏ nghĩa là gì?"),
      d("A", "Red is a failed retry. I'll pause here for questions.", "Đỏ là retry fail. Mình pause để hỏi."),
      d("B", "How long before it goes green?", "Bao lâu thì thành xanh?"),
      d("A", "Thirty seconds after a success.", "30 giây sau lần thành công."),
    ],
    listen: L(
      "Demo 1 phút, người nghe cắt ngang",
      V3,
      [
        d("A", "You're looking at the local orders table.", "Mọi người đang thấy bảng orders local."),
        d("A", "I'll go top to bottom. This part is new — the empty-state hint.", "Mình đi từ trên xuống. Phần mới — hint empty state."),
        d("B", "Any questions so far? Wait, that's my line.", "Tới đây có hỏi? Khoan, đó là câu của mình."),
        d("A", "Any questions so far?", "Tới đây có hỏi gì không?"),
        d("B", "Does it show on mobile?", "Mobile có hiện không?"),
        d("A", "Not yet. I'll pause here. That's a follow-up.", "Chưa. Mình pause. Đó là follow-up."),
        d("B", "Okay, continue.", "Ok, tiếp đi."),
        d("A", "Top to bottom: search, hint, then CTA.", "Từ trên xuống: search, hint, rồi CTA."),
      ],
      [
        gist("Video: speaker đang giới thiệu chủ đề gì? Một câu.", "CS50 / computer science (tuỳ đoạn 0:00–2:00)"),
        cloze("Phần mới trên màn hình là gì?", "Empty-state hint"),
        cloze("Mobile đã có chưa?", "Not yet"),
      ],
    ),
    scenario: "A one-minute screen-share demo of something you actually built.",
  }),
);

const reviewWeek3Phrases = pick([15, 16, 17, 18, 19], w3);
lessons.push(
  lesson({
    id: 20, week: 3, theme: "Tổng hợp tuần 3", kind: "review", phrases: reviewWeek3Phrases,
    pattern: {
      title: "Bug + prompt + PR",
      pattern: "4-beat bug → one prompt line → PR walkthrough",
      explainVi: "Nối kể bug, một câu prompt, rồi giải thích PR. Không thêm cụm.",
      drills: drills(reviewWeek3Phrases).slice(0, 4),
    },
    dialogue: [
      d("A", "We're seeing 500s on checkout. It happens when the cart is empty.", "Checkout 500 khi giỏ trống."),
      d("A", "I already tried clearing cache.", "Mình đã thử xóa cache."),
      d("A", "Act as a senior engineer. Given this code, return only the patch.", "Đóng vai senior. Với code này, chỉ trả patch."),
      d("A", "This PR adds retry. The main change is in PaymentService.", "PR thêm retry. Đổi chính ở PaymentService."),
      d("A", "Please review the timeout logic.", "Nhờ review timeout."),
      d("B", "I'll pause here. Any questions so far?", "Pause. Có hỏi gì không?"),
      d("A", "The risk is double charges. Ready to merge if LGTM.", "Rủi ro charge hai lần. LGTM thì merge."),
      d("B", "Got it. Be concise in the ticket too.", "Rõ. Ticket cũng viết ngắn."),
    ],
    listen: L(
      "Nối bug + prompt + PR",
      null,
      [
        d("A", "We're seeing timeouts. It happens when retry fires twice.", "Timeout. Xảy ra khi retry bắn hai lần."),
        d("A", "Expected: one retry. Actual: three. I already tried a feature flag.", "Kỳ vọng một retry. Thực tế ba. Mình đã thử feature flag."),
        d("A", "Act as a senior engineer. Don't change unrelated files. Return only the patch.", "Đóng vai senior. Đừng sửa file lạ. Chỉ trả patch."),
        d("A", "This PR adds a guard. The main change is in RetryPolicy.", "PR thêm guard. Đổi chính ở RetryPolicy."),
        d("A", "The risk is dropping legit retries. Please review that.", "Rủi ro bỏ retry hợp lệ. Nhờ review."),
        d("B", "You're looking at staging? Any questions so far?", "Đang nhìn staging? Có hỏi gì không?"),
        d("A", "Yes staging. I'll pause here.", "Đúng staging. Mình pause."),
        d("B", "Be concise in Slack after this.", "Xong thì Slack cho ngắn."),
      ],
      [
        gist("Bug xảy ra khi nào?", "When retry fires twice"),
        cloze("Class/file chính của PR?", "RetryPolicy"),
        cloze("Risk của guard là gì?", "Dropping legit retries"),
      ],
    ),
    scenario: "Explain work: bug, one prompt spoken out loud, then the PR.",
  }),
  lesson({
    id: 21, week: 3, theme: "AI explain + prompt", kind: "review", phrases: reviewWeek3Phrases,
    pattern: {
      title: "Kể bug rồi viết 1 prompt",
      pattern: "Four beats, then Act as… Given this code…",
      explainVi: "Roleplay: kể bug 4 câu, rồi đọc một prompt Cursor. Khoá cụm đến tuần 3.",
      drills: drills(reviewWeek3Phrases).slice(0, 4),
    },
    dialogue: [
      d("B", "What are you seeing?", "Bạn đang thấy gì?"),
      d("A", "We're seeing timeouts. It happens when retry fires twice.", "Timeout. Xảy ra khi retry bắn hai lần."),
      d("A", "I already tried feature-flagging it off.", "Mình đã thử tắt flag."),
      d("A", "Act as a senior engineer. Don't change unrelated files.", "Đóng vai senior. Đừng sửa file lạ."),
      d("A", "Return only the patch. Be concise.", "Chỉ trả patch. Ngắn."),
      d("B", "The risk is double charges. Please review that.", "Rủi ro charge hai lần. Nhờ review chỗ đó."),
      d("A", "This PR adds a guard. Ready to merge if LGTM.", "PR thêm guard. LGTM thì merge."),
      d("B", "I'll pause here. Any questions so far?", "Mình pause. Có hỏi không?"),
    ],
    listen: L(
      "Kể bug rồi đọc prompt",
      null,
      [
        d("B", "What are you seeing in prod?", "Prod đang thấy gì?"),
        d("A", "We're seeing 500s on export. It happens when the file is huge.", "500 ở export. Khi file rất lớn."),
        d("A", "I already tried raising memory. Can you take a look?", "Mình đã thử tăng memory. Bạn xem giúp?"),
        d("A", "Act as a senior engineer. Given this code, find the leak.", "Đóng vai senior. Với code này, tìm leak."),
        d("A", "Don't change unrelated files. Return only the patch. Be concise.", "Đừng sửa file lạ. Chỉ trả patch. Ngắn."),
        d("B", "This PR — what's the main change?", "PR này — đổi chính là gì?"),
        d("A", "The main change is a stream instead of a buffer.", "Đổi chính: stream thay vì buffer."),
        d("B", "Please review the backpressure.", "Nhờ review backpressure."),
      ],
      [
        gist("Triệu chứng prod là gì?", "500s on export when file is huge"),
        cloze("Prompt nhờ tìm gì?", "The leak"),
        cloze("Main change của PR?", "A stream instead of a buffer"),
      ],
    ),
    scenario: "Explain a bug, then speak one Cursor prompt out loud.",
  }),
);

lessons.push(
  lesson({
    id: 22, week: 4, theme: "60s about yourself", kind: "learn", phrases: w4[22],
    pattern: {
      title: "Mini intro",
      pattern: "I'm… I currently work on… I enjoy… I'm looking for… Happy to dive into a project",
      explainVi: "Năm câu, khoảng 60 giây. Không đọc CV. Không I am a hard-working team player.",
      drills: drills(w4[22]).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about yourself.", "Kể về bạn đi."),
      d("A", "I'm a software engineer focused on backend.", "Mình là software engineer, thiên backend."),
      d("A", "I currently work on payments at a logistics company.", "Hiện mình làm payments ở công ty logistics."),
      d("A", "I enjoy debugging messy production issues.", "Mình thích debug issue production lộn xộn."),
      d("A", "I'm looking for a role with more ownership.", "Mình tìm role được ownership nhiều hơn."),
      d("A", "Happy to dive into a project if useful.", "Nếu hữu ích mình kể một project."),
      d("B", "How long have you been on payments?", "Làm payments bao lâu rồi?"),
      d("A", "Three years. Happy to dive into a project.", "Ba năm. Sẵn sàng kể một project."),
    ],
    listen: L(
      "Intro 60 giây — nghe cấu trúc rồi nói bản của bạn",
      V4,
      [
        d("B", "Tell me about yourself — keep it under a minute.", "Kể về bạn — dưới một phút."),
        d("A", "I'm a software engineer focused on backend.", "Mình là engineer, thiên backend."),
        d("A", "I currently work on routing at a logistics company.", "Hiện mình làm routing ở công ty logistics."),
        d("A", "I enjoy debugging messy production issues more than greenfield.", "Mình thích debug prod lộn xộn hơn greenfield."),
        d("A", "I'm looking for a role with more ownership of on-call.", "Mình tìm role own on-call nhiều hơn."),
        d("A", "Happy to dive into a project if useful.", "Nếu hữu ích mình kể một project."),
        d("B", "Present, past, future — you hit all three.", "Hiện tại, quá khứ, tương lai — đủ ba."),
        d("A", "That's the idea.", "Đúng ý đó."),
      ],
      [
        gist("Video 0:00–2:00: cấu trúc intro là gì? (Present → Past → Future hoặc tương đương)", "Present → Past → Future / current role then path then why this job"),
        cloze("Người nói đang tìm ownership phần nào?", "On-call"),
        cloze("Họ thích việc gì hơn greenfield?", "Debugging messy production issues"),
      ],
    ),
    scenario: "Interview opening: 60-second intro about YOUR real work. The interviewer only cues you.",
  }),
  lesson({
    id: 23, week: 4, theme: "Walk through project", kind: "learn", phrases: w4[23],
    pattern: {
      title: "Project story",
      pattern: "The problem was… My role was… We used… The outcome was… If I did it again…",
      explainVi: "Một project: vấn đề, role, stack ngắn, outcome có số, một câu làm lại.",
      drills: drills(w4[23]).slice(0, 4),
    },
    dialogue: [
      d("B", "Walk me through a project.", "Kể một project đi."),
      d("A", "The problem was checkout failing at peak.", "Vấn đề là checkout fail giờ cao điểm."),
      d("A", "My role was owning the retry path.", "Role mình là chịu trách nhiệm nhánh retry."),
      d("A", "We used Node, Postgres, and Redis.", "Dùng Node, Postgres và Redis."),
      d("A", "The outcome was 40% fewer failed payments.", "Kết quả giảm 40% thanh toán fail."),
      d("A", "If I did it again, I'd add a feature flag first.", "Nếu làm lại, mình gắn feature flag trước."),
      d("B", "What was peak TPS?", "Peak TPS là bao nhiêu?"),
      d("A", "Around 200. The outcome still held at 180.", "Khoảng 200. Kết quả vẫn giữ ở 180."),
    ],
    listen: L(
      "Project story — số và role",
      null,
      [
        d("B", "Walk me through a project that actually shipped.", "Kể một project thực sự đã ship."),
        d("A", "The problem was drivers losing jobs on flaky GPS.", "Vấn đề: tài xế mất việc vì GPS flake."),
        d("A", "My role was owning the fallback location service.", "Role mình: own service fallback location."),
        d("A", "We used Go, Postgres, and Redis.", "Dùng Go, Postgres và Redis."),
        d("A", "The outcome was 25% fewer dropped jobs in two weeks.", "Kết quả: giảm 25% job rớt trong hai tuần."),
        d("A", "If I did it again, I'd add a shadow traffic test first.", "Nếu làm lại, mình gắn shadow traffic trước."),
        d("B", "Who was on-call with you?", "On-call với ai?"),
        d("A", "Two backend, one mobile.", "Hai backend, một mobile."),
      ],
      [
        gist("Vấn đề user là gì?", "Drivers losing jobs on flaky GPS"),
        cloze("Outcome số là bao nhiêu?", "25% fewer dropped jobs"),
        cloze("Nếu làm lại sẽ thêm gì trước?", "Shadow traffic test"),
      ],
    ),
    scenario: "Walk through one REAL project in five beats.",
  }),
  lesson({
    id: 24, week: 4, theme: "STAR", kind: "learn", phrases: w4[24],
    pattern: {
      title: "STAR ngắn",
      pattern: "Situation → Task → I did… → Result → What I learned",
      explainVi: "Deadline hoặc incident: mỗi chữ STAR một câu. Không kể 5 phút.",
      drills: drills(w4[24]).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about a tight deadline.", "Kể một deadline căng."),
      d("A", "The situation was a Friday incident.", "Tình huống là incident thứ Sáu."),
      d("A", "My task was to restore checkout.", "Task mình là khôi phục checkout."),
      d("A", "I did a rollback, then added a guard.", "Mình rollback, rồi thêm guard."),
      d("A", "The result was we recovered in 20 minutes.", "Kết quả khôi phục trong 20 phút."),
      d("A", "What I learned is to page earlier.", "Mình học được là page sớm hơn."),
      d("B", "Who did you page?", "Bạn page ai?"),
      d("A", "The on-call plus the PM. What I learned is to page earlier.", "On-call và PM. Học được là page sớm hơn."),
    ],
    listen: L(
      "STAR incident — bắt số phút",
      null,
      [
        d("B", "Tell me about an incident, STAR please.", "Kể một incident, dùng STAR."),
        d("A", "The situation was a Saturday deploy that broke search.", "Tình huống: deploy thứ Bảy làm hỏng search."),
        d("A", "My task was to restore search without a full rollback if possible.", "Task: khôi phục search, tránh rollback hết nếu được."),
        d("A", "I did a config revert, then isolated the query planner change.", "Mình revert config, rồi isolate thay đổi query planner."),
        d("A", "The result was we recovered in 12 minutes. Traffic came back.", "Kết quả khôi phục 12 phút. Traffic trở lại."),
        d("A", "What I learned is to canary DDL.", "Mình học được là canary DDL."),
        d("B", "12 minutes from detect or from start of fix?", "12 phút từ lúc detect hay lúc bắt đầu fix?"),
        d("A", "From detect. Fix itself was about six.", "Từ lúc detect. Fix khoảng sáu phút."),
      ],
      [
        gist("Incident làm hỏng gì?", "Search after a Saturday deploy"),
        cloze("Recover trong bao lâu kể từ detect?", "12 minutes"),
        cloze("Bài học là gì?", "Canary DDL"),
      ],
    ),
    scenario: "A short STAR story about a real incident or deadline of yours.",
  }),
  lesson({
    id: 25, week: 4, theme: "Debug speaking", kind: "learn", phrases: w4[25],
    pattern: {
      title: "Debug out loud",
      pattern: "I'd start by reproducing… check the logs… isolate… fix and add a test. That's my first pass.",
      explainVi: "Không leetcode. Nói quy trình debug. Nếu thiếu data: That's my first pass.",
      drills: drills(w4[25]).slice(0, 4),
    },
    dialogue: [
      d("B", "Users can't log in. How would you debug it?", "User không login được. Bạn debug thế nào?"),
      d("A", "I'd start by reproducing it locally.", "Mình bắt đầu bằng reproduce local."),
      d("A", "I'd check the logs around the timestamp.", "Xem log quanh timestamp."),
      d("A", "Then I'd isolate whether it's data or code.", "Rồi isolate data hay code."),
      d("A", "After that I'd fix and add a test.", "Sau đó fix và thêm test."),
      d("A", "That's my first pass — I'd need the stack trace.", "Đó là hướng đầu — mình cần stack trace."),
      d("B", "Assume you don't have a stack trace yet.", "Giả sử chưa có stack trace."),
      d("A", "Then I'd check the logs and isolate auth vs network. That's my first pass.", "Thì mình xem log và isolate auth vs network. Đó là hướng đầu."),
    ],
    listen: L(
      "Debug out loud — interviewer cắt ngang",
      null,
      [
        d("B", "Checkout 500s. Walk me through your first 10 minutes.", "Checkout 500. 10 phút đầu bạn làm gì?"),
        d("A", "I'd start by reproducing it locally with the same payload.", "Mình reproduce local với cùng payload."),
        d("A", "I'd check the logs around the timestamp, request id included.", "Xem log quanh timestamp, kèm request id."),
        d("A", "Then I'd isolate whether it's payments or cart.", "Rồi isolate payments hay cart."),
        d("B", "Logs are empty. Now what?", "Log trống. Giờ sao?"),
        d("A", "That's my first pass — I'd enable debug on the gateway and try again.", "Đó là hướng đầu — bật debug gateway rồi thử lại."),
        d("A", "After that I'd fix and add a test once I have a trace.", "Có trace rồi thì fix và thêm test."),
        d("B", "Good. Don't jump to rewriting the client.", "Ổn. Đừng nhảy sang viết lại client."),
      ],
      [
        gist("Bước 1 trong 10 phút đầu là gì?", "Reproduce locally with the same payload"),
        cloze("Khi log trống, hướng đầu là gì?", "Enable debug on the gateway and try again"),
        cloze("Không được nhảy sang làm gì?", "Rewriting the client"),
      ],
    ),
    scenario: "Speak your debug plan for a real-looking incident. No whiteboard algorithms.",
  }),
  lesson({
    id: 26, week: 4, theme: "Câu hỏi ngược", kind: "learn", phrases: w4[26],
    pattern: {
      title: "Ask back",
      pattern: "What's the team like? How do you measure success? First 90 days? On-call? What should this hire own?",
      explainVi: "Ba câu đủ. Chọn team / success / 90 ngày / on-call / ownership. Đừng hỏi What's the stack? trước.",
      drills: drills(w4[26]).slice(0, 4),
    },
    dialogue: [
      d("B", "Do you have questions for us?", "Bạn có hỏi gì không?"),
      d("A", "What's the team like day to day?", "Team ngày thường như thế nào ạ?"),
      d("B", "Small, lots of pairing. Six people.", "Nhỏ, pair nhiều. Sáu người."),
      d("A", "How do you measure success in this role?", "Role này đo success thế nào ạ?"),
      d("A", "What does the first 90 days look like?", "90 ngày đầu trông thế nào ạ?"),
      d("A", "How do you handle on-call?", "On-call bên mình thế nào ạ?"),
      d("B", "Week-long primary, then a week backup.", "Một tuần primary, rồi một tuần backup."),
      d("A", "What are you hoping this hire owns in six months?", "Sáu tháng nữa bạn mong người này own gì ạ?"),
    ],
    listen: L(
      "Hỏi ngược — nghe câu trả lời có số",
      null,
      [
        d("B", "Do you have questions for us?", "Bạn có hỏi gì không?"),
        d("A", "What's the team like day to day?", "Team ngày thường thế nào ạ?"),
        d("B", "Eight people, two time zones, pairing on Tuesdays.", "Tám người, hai múi giờ, pair thứ Ba."),
        d("A", "How do you measure success in this role?", "Role này đo success thế nào ạ?"),
        d("B", "Time-to-detect under 10 minutes, and two shipped bets a quarter.", "Time-to-detect dưới 10 phút, và hai bet ship mỗi quý."),
        d("A", "What does the first 90 days look like?", "90 ngày đầu trông thế nào ạ?"),
        d("B", "On-call shadow in month two.", "Tháng hai thì shadow on-call."),
        d("A", "What are you hoping this hire owns in six months?", "Sáu tháng nữa mong own gì ạ?"),
      ],
      [
        gist("Team lớn cỡ nào / bao nhiêu múi giờ?", "Eight people, two time zones"),
        cloze("Time-to-detect mục tiêu?", "Under 10 minutes"),
        cloze("On-call shadow vào tháng nào?", "Month two / tháng hai"),
      ],
    ),
    scenario: "Ask three thoughtful questions at the end of an interview. Listen to the answers.",
  }),
);

const reviewWeek4Phrases = pick([22, 23, 24, 25, 26], w4);
lessons.push(
  lesson({
    id: 27, week: 4, theme: "Ôn cụm phỏng vấn", kind: "review", phrases: reviewWeek4Phrases,
    pattern: {
      title: "Intro + STAR",
      pattern: "60s intro, then one STAR",
      explainVi: "Nói lại intro và một STAR. Không thêm cụm.",
      drills: drills(reviewWeek4Phrases).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about yourself, then one incident.", "Giới thiệu, rồi một incident."),
      d("A", "I'm a software engineer. I currently work on payments.", "Mình là engineer. Hiện làm payments."),
      d("A", "I'm looking for more ownership. Happy to dive into a project.", "Mình tìm ownership hơn. Sẵn sàng kể project."),
      d("A", "The situation was a Friday incident. My task was to restore checkout.", "Incident thứ Sáu. Task: khôi phục checkout."),
      d("A", "I did a rollback. The result was 20 minutes.", "Mình rollback. Kết quả 20 phút."),
      d("A", "What I learned is to page earlier.", "Học được là page sớm hơn."),
      d("B", "If I did it again — what would you change?", "Nếu làm lại — bạn đổi gì?"),
      d("A", "If I did it again, I'd add a feature flag first.", "Nếu làm lại, mình gắn feature flag trước."),
    ],
    listen: L(
      "Ôn intro + STAR",
      V4,
      [
        d("B", "Sixty seconds, then one STAR.", "60 giây, rồi một STAR."),
        d("A", "I'm a software engineer. I currently work on routing.", "Mình là engineer. Hiện làm routing."),
        d("A", "I enjoy debugging messy production issues. I'm looking for more ownership.", "Thích debug prod. Tìm ownership hơn."),
        d("A", "Happy to dive into a project.", "Sẵn sàng kể project."),
        d("A", "The situation was a Saturday search outage. My task was to restore it.", "Outage search thứ Bảy. Task: khôi phục."),
        d("A", "I did a config revert. The result was 12 minutes.", "Revert config. Kết quả 12 phút."),
        d("A", "What I learned is to canary DDL.", "Học được là canary DDL."),
        d("B", "Present past future, then STAR. Good.", "Hiện tại quá khứ tương lai, rồi STAR. Ổn."),
      ],
      [
        gist("Video: chép 1 ý từ phần đầu, rồi nói intro CỦA BẠN (không đọc mẫu).", "Ghi 1 ý Present/Past/Future rồi nói bản thân"),
        cloze("STAR này recover trong bao lâu?", "12 minutes"),
        cloze("Bài học STAR?", "Canary DDL"),
      ],
    ),
    scenario: "Rehearse YOUR intro plus one STAR. Interviewer only cues.",
  }),
  lesson({
    id: 28, week: 4, theme: "Mock interview AI", kind: "review", phrases: reviewWeek4Phrases,
    pattern: {
      title: "Chỉ phỏng vấn",
      pattern: "Intro → project → STAR → one question back",
      explainVi: "Mock: AI hỏi lần lượt. Bạn trả lời bằng cụm đến tuần 4.",
      drills: drills(reviewWeek4Phrases).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about yourself.", "Kể về bạn đi."),
      d("A", "I'm a software engineer. I currently work on payments.", "Engineer. Hiện làm payments."),
      d("B", "Walk me through a project.", "Kể một project."),
      d("A", "The problem was checkout failing at peak. The outcome was 40% fewer failures.", "Checkout fail giờ cao điểm. Giảm 40% fail."),
      d("B", "Any questions for me?", "Bạn hỏi gì không?"),
      d("A", "What are you hoping this hire owns in six months?", "Sáu tháng nữa bạn mong người này own gì ạ?"),
      d("B", "The on-call rotation and the retry service.", "Vòng on-call và service retry."),
      d("A", "How do you measure success in this role?", "Role này đo success thế nào ạ?"),
    ],
    listen: L(
      "Mock interview: intro, project, hỏi ngược",
      null,
      [
        d("B", "Tell me about yourself.", "Kể về bạn đi."),
        d("A", "I'm a software engineer. I currently work on routing. I'm looking for more ownership.", "Engineer. Hiện routing. Tìm ownership hơn."),
        d("B", "Walk me through a project.", "Kể một project."),
        d("A", "The problem was dropped jobs. My role was the fallback. The outcome was 25% fewer drops.", "Job rớt. Role: fallback. Giảm 25%."),
        d("B", "How would you debug a silent 500?", "Bạn debug 500 im lặng thế nào?"),
        d("A", "I'd start by reproducing it. I'd check the logs. That's my first pass.", "Reproduce. Xem log. Đó là hướng đầu."),
        d("B", "Questions for me?", "Hỏi mình không?"),
        d("A", "What does the first 90 days look like? How do you handle on-call?", "90 ngày đầu thế nào? On-call ra sao ạ?"),
      ],
      [
        gist("Outcome của project là gì?", "25% fewer dropped jobs"),
        cloze("Câu debug bắt đầu bằng bước nào?", "Reproducing it"),
        cloze("Hai câu hỏi ngược là gì?", "First 90 days and on-call"),
      ],
    ),
    scenario: "Mock interview: intro, project, then you ask questions back.",
    extra: "Ask one question at a time. Keep your questions short. Speak natural interviewer English.",
  }),
);

const quiet29 = pick([2, 5, 8, 10, 12], { ...w1, ...w2 });
const quiet30 = pick([16, 17, 22, 24, 26], { ...w3, ...w4 });

lessons.push(
  lesson({
    id: 29, week: 5, theme: "Ôn ngày IT", kind: "review", phrases: quiet29,
    pattern: {
      title: "Một buổi làm việc",
      pattern: "Slack + standup + họp ngắn",
      explainVi: "Ngày ôn nhẹ tuần 1–2. Không thêm cụm. Nói như một buổi làm việc yên.",
      drills: drills(quiet29).slice(0, 4),
    },
    dialogue: [
      d("A", "Morning, team. Yesterday I finished the retry.", "Chào team. Hôm qua xong retry."),
      d("A", "Today I'll work on tests. That's it from me.", "Hôm nay làm test. Mình hết."),
      d("B", "Can you hear me? Let's get started.", "Nghe không? Bắt đầu nhé."),
      d("A", "Could you repeat that? I missed the last part.", "Nhắc lại? Mình miss đoạn cuối."),
      d("A", "I'll follow up. I'll send a recap.", "Mình follow up. Mình gửi recap."),
      d("B", "I'll post here when it's done. Owners by 4.", "Xong mình báo ở đây. Owner trước 4 giờ."),
      d("A", "What I heard is owners by 4. Let's lock that in.", "Mình nghe owner trước 4 giờ. Chốt vậy."),
      d("B", "Anything else before we jump?", "Còn gì nữa không?"),
    ],
    listen: L(
      "Một ngày IT: Slack + họp",
      null,
      [
        d("A", "Morning, team. Yesterday I finished the retry. Today I'll work on tests.", "Chào team. Hôm qua xong retry. Hôm nay test."),
        d("A", "I'm blocked on staging. That's it from me.", "Kẹt staging. Mình hết."),
        d("B", "Can you hear me? I'll share my screen.", "Nghe không? Mình share màn hình."),
        d("A", "Could you slow down a bit? I missed the last part.", "Nói chậm hơn? Miss đoạn cuối."),
        d("B", "Rollout Thursday 21:00 UTC. I'll follow up in Slack.", "Rollout thứ Năm 21:00 UTC. Mình follow up Slack."),
        d("A", "What I heard is Thursday 21:00 UTC.", "Mình nghe thứ Năm 21:00 UTC."),
        d("A", "Action item for me: the recap. I'll post here when it's done.", "Việc mình: recap. Xong mình báo."),
        d("B", "Anything else before we jump? Let's lock that in.", "Còn gì không? Chốt vậy."),
      ],
      [
        gist("Rollout khi nào?", "Thursday 21:00 UTC"),
        cloze("A bị blocked ở đâu?", "Staging"),
        repair("Viết câu confirm lại giờ rollout.", "What I heard is Thursday 21:00 UTC."),
      ],
    ),
    scenario: "A calm workday: standup, then a short meeting. Week 1–2 phrases when you speak.",
  }),
  lesson({
    id: 30, week: 5, theme: "Ôn phỏng vấn + prompt", kind: "review", phrases: quiet30,
    pattern: {
      title: "Intro + 1 prompt",
      pattern: "60s intro, one STAR, one work prompt",
      explainVi: "Ôn nhẹ tuần 3–4: intro, một STAR, đọc một prompt. Không thêm cụm.",
      drills: drills(quiet30).slice(0, 4),
    },
    dialogue: [
      d("B", "Tell me about yourself.", "Kể về bạn đi."),
      d("A", "I'm a software engineer. I'm looking for more ownership.", "Mình là engineer. Đang tìm ownership hơn."),
      d("A", "The situation was a Friday incident. The result was we recovered in 20 minutes.", "Incident thứ Sáu. Khôi phục 20 phút."),
      d("A", "Act as a senior engineer. Given this code, return only the patch.", "Đóng vai senior. Với code này, chỉ trả patch."),
      d("A", "This PR adds retry. Please review the timeout logic.", "PR thêm retry. Nhờ review timeout."),
      d("A", "What does the first 90 days look like?", "90 ngày đầu trông thế nào ạ?"),
      d("B", "On-call shadow in month two. Any other questions?", "Tháng hai shadow on-call. Còn hỏi gì không?"),
      d("A", "How do you measure success in this role?", "Role này đo success thế nào ạ?"),
    ],
    listen: L(
      "Ôn intro, STAR, đọc prompt",
      null,
      [
        d("B", "Tell me about yourself, then speak one prompt.", "Giới thiệu, rồi đọc một prompt."),
        d("A", "I'm a software engineer. I currently work on routing. I'm looking for more ownership.", "Engineer. Hiện routing. Tìm ownership hơn."),
        d("A", "The situation was a search outage. I did a config revert. The result was 12 minutes.", "Outage search. Revert config. 12 phút."),
        d("A", "Act as a senior engineer. Given this code, don't change unrelated files.", "Đóng vai senior. Với code này, đừng sửa file lạ."),
        d("A", "Return only the patch. Be concise.", "Chỉ trả patch. Ngắn."),
        d("A", "This PR adds a guard. The risk is dropping legit retries. Please review that.", "PR thêm guard. Rủi ro bỏ retry hợp lệ. Nhờ review."),
        d("B", "Questions?", "Hỏi gì không?"),
        d("A", "What are you hoping this hire owns in six months?", "Sáu tháng nữa mong own gì ạ?"),
      ],
      [
        gist("STAR recover bao lâu?", "12 minutes"),
        cloze("Prompt khóa output thế nào?", "Return only the patch"),
        cloze("Risk của PR?", "Dropping legit retries"),
      ],
    ),
    scenario: "Quiet review: YOUR intro, one STAR, then speak one prompt.",
  }),
);

for (const item of lessons) {
  const name = `${String(item.id).padStart(3, "0")}.json`;
  writeFileSync(join(dir, name), `${JSON.stringify(item, null, 2)}\n`);
}

console.log(`Wrote ${lessons.length} lessons to ${dir}`);
