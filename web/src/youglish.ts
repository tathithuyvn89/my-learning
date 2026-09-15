export type YouglishLang = "english" | "chinese";

export function youglishHref(
  phrase: string,
  lang: YouglishLang = "english",
): string {
  const path =
    lang === "chinese"
      ? `pronounce/${encodeURIComponent(phrase)}/chinese/cn`
      : `pronounce/${encodeURIComponent(phrase)}/english`;
  return `https://youglish.com/${path}`;
}
