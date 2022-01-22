import applyTimerBehavior from './applyTimerBehavior';

test("Timer update is accurate", () => {
  const yaml = "reee:\n   t(1) t(2)\n   konnichiwa: t(3)";
  const timeRegex:RegExp = /t\(.*?\)/g;
  expect(applyTimerBehavior(yaml, timeRegex, "t(", ")",5)).toBe("reee:\n   t(0006) t(0007)\n   konnichiwa: t(0008)");
  expect(applyTimerBehavior(yaml, timeRegex, "t(", ")",10)).toBe("reee:\n   t(0011) t(0012)\n   konnichiwa: t(0013)");
})