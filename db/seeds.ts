import { DefaultSystemConfig } from "app/user-entries/SystemConfig"
import db, { configType, Role } from "db"
import { SecurePassword } from "blitz"
import { getDefaultPermissionsForUser } from "app/user-entries/Permissions"
/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }
  // await seedDevDataWrapper()
  await seedSystemDefault()
}

const seedDevDataWrapper = async () => {
  if (process.env.NODE_ENV !== "production") {
    await db.$reset()
    await seedSystemDefault()
    await seedDevData()
    return
  }
}

const seedSystemDefault = async () => {
  await db.entryConfig.create({
    data: {
      type: configType.SYSTEM_DEFAULT,
      json: DefaultSystemConfig as any,
    },
  })
}

const seedDevData = async () => {
  const user = await db.user.create({
    data: {
      email: "test@test.com",
      hashedPassword: await SecurePassword.hash("!Abcdefgg123"),
      role: Role.USER,
    },
  })

  await db.userEntry.create({
    data: {
      ownerId: user.id,
      json: { Title: "interesting title" },
      permissions: getDefaultPermissionsForUser(user.id),
      yaml: "Title: interesting title",
    },
  })

  await db.user.create({
    data: {
      email: "test2@test.com",
      hashedPassword: await SecurePassword.hash("!Abcdefgg123"),
      role: Role.USER,
    },
  })
}

export default seed
