import { describe, expect, it } from "vitest";
import { charAnnotation, radicalVi, structureVi } from "./radical";

describe("radicalVi", () => {
  it("trả về tên tiếng Việt cho bộ quen thuộc", () => {
    expect(radicalVi("女")).toBe("nữ");
    expect(radicalVi("氵")).toBe("thủy (ba chấm)");
  });

  it("giữ nguyên chữ nếu chưa có trong bảng", () => {
    expect(radicalVi("某")).toBe("某");
  });
});

describe("structureVi", () => {
  it("dịch kiểu cấu trúc phổ biến", () => {
    expect(structureVi("吅")).toBe("trái–phải");
    expect(structureVi("吕")).toBe("trên–dưới");
  });
});

describe("charAnnotation", () => {
  it("có dữ liệu cho chữ trong bài học", () => {
    const info = charAnnotation("好");
    expect(info).not.toBeNull();
    expect(info?.radical).toBe("女");
    expect(info?.parts).toContain("女");
    expect(info?.parts).toContain("子");
  });
});
