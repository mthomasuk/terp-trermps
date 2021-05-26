import { toTitleCase, rgbToHex } from "./__helpers__";

describe("toTitleCase", () => {
  it("should covert single words to title-case", () => {
    expect(toTitleCase("poo")).toMatch("Poo");
  });

  it("should covert kebab-case to title-case", () => {
    expect(toTitleCase("magic_poo")).toMatch("Magic Poo");
  });
});

describe("rgbToHex", () => {
  it("should convert an rgb string to a hex code", () => {
    expect(rgbToHex("rgb(255, 255, 255)")).toMatch("#ffffff");
  });

  it("should convert an rgba string to a hex code", () => {
    expect(rgbToHex("rgba(0, 0, 0, 0.5)")).toMatch("#000000");
  });

  it("should return a hex string if it is provided as an arg", () => {
    expect(rgbToHex("#efefef")).toMatch("#efefef");
  });

  it("should throw a readable error if no rgb/hex string is provided", () => {
    expect(() => {
      rgbToHex("hello banana");
    }).toThrow(
      "Failed to convert rgb input (hello banana) to hex: Cannot read property 'toString' of undefined"
    );
  });
});
