import { describe, expect, it } from "vitest";
import { hanChars } from "./hanzi";

describe("hanChars", () => {
  it("tách từng chữ Hán, giữ thứ tự", () => {
    expect(hanChars("你好")).toEqual(["你", "好"]);
    expect(hanChars("谢谢")).toEqual(["谢", "谢"]);
  });

  it("bỏ pinyin và dấu câu", () => {
    expect(hanChars("nǐ hǎo 你好！")).toEqual(["你", "好"]);
  });

  it("trả về rỗng nếu không có Hán", () => {
    expect(hanChars("hello")).toEqual([]);
    expect(hanChars("")).toEqual([]);
  });
});
