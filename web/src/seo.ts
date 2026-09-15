import {
  COURSE_TITLE,
  enCourseTitle,
  enTrackLabel,
} from "./course";
import { loadLesson } from "./content";
import { loadEnLesson } from "./en-content";
import type { Route } from "./router";

/** URL production. */
export const SITE_URL = "https://hoc.thungchitieu.com.vn";

export const SITE_NAME = COURSE_TITLE;

export const DEFAULT_TITLE =
  "Học tiếng Trung HSK 1–6 và tiếng Anh IT — 30 phút/ngày";

export const DEFAULT_DESCRIPTION =
  "Web học miễn phí, 30 phút mỗi ngày: HSK 1–6 (336 bài), tiếng Anh IT và phỏng vấn. Giao diện tiếng Việt, không tài khoản. Tiến độ lưu trên máy.";

export type SeoPayload = {
  title: string;
  description: string;
  robots: "index,follow" | "noindex,follow";
};

function themeOfZh(day: number): string {
  try {
    return loadLesson(day).theme;
  } catch {
    return `Ngày ${day}`;
  }
}

function themeOfEn(day: number, course: "it" | "iv"): string {
  try {
    return loadEnLesson(day, course).theme;
  } catch {
    return `Ngày ${day}`;
  }
}

export function seoForRoute(route: Route): SeoPayload {
  if (route.name === "not-found") {
    return {
      title: `Không tìm thấy trang · ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      robots: "noindex,follow",
    };
  }

  if (route.track === "en") {
    const label = enTrackLabel(route.course);
    const courseTitle = enCourseTitle(route.course);
    const days = route.course === "iv" ? "21 ngày" : "30 ngày";
    const enDesc = `${label}: ${days} nghe–nói, 30 phút/ngày. Cụm thật cho họp, Slack, phỏng vấn. Không cần tài khoản.`;
    switch (route.name) {
      case "home":
        return {
          title: `${courseTitle} — 30 phút/ngày`,
          description: enDesc,
          robots: "index,follow",
        };
      case "calendar":
        return {
          title: `Lịch · ${label}`,
          description: `Lịch ${days} ${label.toLowerCase()}. ${DEFAULT_DESCRIPTION}`,
          robots: "index,follow",
        };
      case "words":
        return {
          title: `Sổ cụm · ${label}`,
          description: `Sổ cụm ${label.toLowerCase()}, lọc theo tuần, nghe tiếng Anh. ${DEFAULT_DESCRIPTION}`,
          robots: "index,follow",
        };
      case "progress":
        return {
          title: `Tiến độ · ${label}`,
          description: `Theo dõi streak và % hoàn thành ${label.toLowerCase()}. ${DEFAULT_DESCRIPTION}`,
          robots: "index,follow",
        };
      case "day": {
        const theme = themeOfEn(route.day, route.course);
        return {
          title: `${label} ngày ${route.day}: ${theme} — 30 phút`,
          description: `Bài ${route.day} — ${theme}. ${enDesc}`,
          robots: "index,follow",
        };
      }
    }
  }

  const hsk = route.hsk;
  const zhDesc = `Học tiếng Trung HSK ${hsk}, 30 phút/ngày, chữ giản thể và pinyin. ${DEFAULT_DESCRIPTION}`;
  switch (route.name) {
    case "home":
      return {
        title: `Học tiếng Trung HSK ${hsk} — 30 phút/ngày`,
        description: zhDesc,
        robots: "index,follow",
      };
    case "calendar":
      return {
        title: `Lịch HSK ${hsk} — 56 ngày`,
        description: `Lịch 56 bài HSK ${hsk}. ${DEFAULT_DESCRIPTION}`,
        robots: "index,follow",
      };
    case "words":
      return {
        title: `Sổ từ HSK ${hsk}`,
        description: `Sổ từ HSK ${hsk}, lọc tuần, nghe tiếng Trung, YouGlish. ${DEFAULT_DESCRIPTION}`,
        robots: "index,follow",
      };
    case "progress":
      return {
        title: `Tiến độ HSK ${hsk}`,
        description: `Streak và % hoàn thành HSK ${hsk}. ${DEFAULT_DESCRIPTION}`,
        robots: "index,follow",
      };
    case "day": {
      const theme = themeOfZh(route.day);
      return {
        title: `HSK ${hsk} ngày ${route.day}: ${theme} — 30 phút`,
        description: `Bài ${route.day} — ${theme}. ${zhDesc}`,
        robots: "index,follow",
      };
    }
  }
}

function canonicalUrl(): string {
  if (typeof window === "undefined") return `${SITE_URL}/`;
  const base = window.location.origin + window.location.pathname;
  return base.endsWith("/") ? base : `${base}/`;
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.append(el);
  }
  el.setAttribute("content", content);
}

export function applySeo(route: Route): void {
  if (typeof document === "undefined") return;
  const seo = seoForRoute(route);
  const url = canonicalUrl();
  document.title = seo.title;
  upsertMeta("name", "description", seo.description);
  upsertMeta("name", "robots", seo.robots);
  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:locale", "vi_VN");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("name", "twitter:card", "summary");
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);

  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.append(link);
  }
  link.href = url;
}
