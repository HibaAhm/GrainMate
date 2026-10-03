import { describe, expect, it } from "vitest";
import { appName } from "./index";

describe("appName", () => {
  it("returns GrainMate", () => {
    expect(appName()).toBe("GrainMate");
  });
});
