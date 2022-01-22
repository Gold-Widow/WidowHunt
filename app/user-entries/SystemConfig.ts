import * as z from "zod"

export const SystemConfigZodSchema = z.object({
  titleKey: z.string().max(50),
  Behaviors: z.number().array(),
  DisplayBehaviors: z.number().array(),
  DefaultYaml: z.string(),
})

export type systemConfigJson = z.infer<typeof SystemConfigZodSchema>

export const DefaultSystemConfig: systemConfigJson = {
  titleKey: "Title",
  Behaviors: [],
  DisplayBehaviors: [],
  DefaultYaml: "Title: Untitled",
}

export class configBuilder {
  config: systemConfigJson

  constructor() {
    this.config = { ...DefaultSystemConfig }
  }

  useTitleKey(newKey: string): configBuilder {
    this.config.titleKey = newKey
    return this
  }

  addBehavior: () => {}
  addDisplay: () => {}
}
