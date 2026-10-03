import { appName } from "@grainmate/shared";
import { describe, expect, it } from "vitest";

describe("shared package", () => {
  it("can be imported by the server", () => {
    expect(appName()).toBe("GrainMate");
  });
});
