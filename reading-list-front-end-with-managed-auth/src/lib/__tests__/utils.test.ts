import { cn, formatStatus, capitalize, truncateText, isValidEmail } from "../utils";

describe("Utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
    });

    it("handles conditional classes", () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn("base", isTrue && "conditional", isFalse && "hidden")).toBe("base conditional");
    });

    it("resolves Tailwind conflicts", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
    });
  });

  describe("formatStatus", () => {
    it("formats status correctly", () => {
      expect(formatStatus("to_read")).toBe("To Read");
      expect(formatStatus("reading")).toBe("Reading");
      expect(formatStatus("read")).toBe("Read");
    });
  });

  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("WORLD");
      expect(capitalize("")).toBe("");
    });
  });

  describe("truncateText", () => {
    it("truncates text when longer than max length", () => {
      expect(truncateText("This is a long text", 10)).toBe("This is a ...");
    });

    it("returns original text when shorter than max length", () => {
      expect(truncateText("Short", 10)).toBe("Short");
    });
  });

  describe("isValidEmail", () => {
    it("validates email correctly", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });
  });
});
