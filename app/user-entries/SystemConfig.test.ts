import { DefaultSystemConfig, SystemConfigZodSchema } from "./SystemConfig"

test("System default config is valid according to zod schema", () => {
  expect(() => SystemConfigZodSchema.parse(DefaultSystemConfig)).not.toThrowError()
})

test("Invalid config throws zod schema parse error", () => {
  const invalidConfig = { ree: "nani" }
  expect(() => SystemConfigZodSchema.parse(invalidConfig)).toThrowError()
})

export {}
