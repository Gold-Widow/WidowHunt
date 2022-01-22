import { BlitzPage, Head, useMutation, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import React, { useEffect, useState } from "react"
import jsYaml from "app/core/utils/jsYaml"
import textAreaUtils from "app/core/utils/textAreaUtils"
import DisplayJson from "app/user-entries/components/DisplayJson"
import { DisplayRawJson } from "app/user-entries/components/DisplayRawJson"
import updateUserEntry from "app/user-entries/mutations/updateUserEntry"
import { useEntry } from "app/user-entries/hooks/useEntry"
import createEntry from "app/user-entries/mutations/createUserEntry"
import applyTimerBehavior from "app/user-entries/logic/applyTimerBehavior"
import { useUserConfig } from "app/entry-configs/hooks/useUserConfig"
import { DefaultSystemConfig, systemConfigJson } from "app/user-entries/SystemConfig"
import toast from "react-hot-toast"
import Cookies from "js-cookie"

const YamlEntry: BlitzPage = () => {
  const savedEntryCookieName = "savedYamlEntry"

  const user = useCurrentUser()
  const router = useRouter()

  const [entryId, updateEntryId] = useState(router.query.entryId as string)
  const entryFromDb = useEntry(entryId || "", true, true)
  const [refetched, updateRefetched] = useState(false)

  // Placeholder for the config object which will hold things like
  // whether to run times, what those timer's pre and post tokens are etc.
  const configEntry = useUserConfig({ userId: user?.id ?? "" })
  const config = configEntry
    ? ((configEntry.json as unknown) as systemConfigJson)
    : DefaultSystemConfig
  // const [config, updateConfig] = useState("default config")

  const getDefaultYaml = () => {
    if (entryFromDb?.yaml) {
      return entryFromDb.yaml
    }
    var savedYaml = Cookies.get(savedEntryCookieName)
    if (savedYaml) {
      return savedYaml
    }
    return config.DefaultYaml ?? "Title: Untitled"
  }

  const defaultYaml = getDefaultYaml()
  const defaultJson = tryParseJson(defaultYaml) ?? {}
  const [yaml, updateYaml] = useState(defaultYaml)
  const [jsObj, updateEntryJsObj] = useState(defaultJson)
  const [saveEntryMutation] = useMutation(updateUserEntry)
  const [createEntryMutation] = useMutation(createEntry)

  const mainTextAreaInputId = "Main-Text-Area-Input"
  const mainInput: HTMLTextAreaElement = document.getElementById(
    mainTextAreaInputId
  ) as HTMLTextAreaElement

  const postSaveAction = () => {
    toast.success("Entry saved")
    Cookies.remove(savedEntryCookieName)
  }

  const saveCurrentEntry = async (
    yaml: string,
    json: any,
    user: ReturnType<typeof useCurrentUser>
  ) => {
    if (!user) {
      const encodedUrl = encodeURI("/user-entries%3FsaveOnPageLoad%3Dtrue")
      router.push(`/login?next=${encodedUrl}`)
      return
    }
    if (!entryId || entryId.length === 0) {
      const id = await createEntryMutation({ yaml, json, ownerId: user.id })
      router.push(`/user-entries?entryId=${id}`)
      updateEntryId(id)
      postSaveAction()
      return
    }
    console.log(yaml)
    const returned = await saveEntryMutation({
      yaml: yaml,
      json: jsObj,
      id: entryId,
      ownerId: user.id,
    })
    postSaveAction()
  }

  const reloadCurrentEntry = async () => {
    if (!entryFromDb) {
      console.log(`Could not find entry id ${entryId} to reload`)
      toast.error(`Failed loading entry id ${entryId}`)
      return
    }
    if (!user) {
      router.push("/login")
      return
    }
    await entryFromDb.refetch()
    updateRefetched(true)
    toast.success(`Reloaded from db`)
  }

  useEffect(() => {
    if (!refetched) {
      return
    }
    updateYaml(entryFromDb?.yaml ?? "")
    updateEntryId(entryFromDb?.id ?? "")
    updateRefetched(false)
  }, [refetched])

  useEffect(() => {
    if (user && router.query.saveOnPageLoad && (!entryId || entryId.length === 0)) {
      saveCurrentEntry(yaml, jsObj, user)
    }
  }, [router.query.saveOnPageLoad, entryId, user])

  // Update the timers in the application:
  useEffect(() => {
    const updateBehavior = setInterval(() => {
      updateYaml((prev) => applyTimerBehavior(prev, /t\(.*?\)/g, "t(", ")", 1))
    }, 1000)

    return () => clearInterval(updateBehavior)
  }, [config])

  // this is where we convert the yaml to json WHENEVER ISSUEYAML IS CHANGED
  // However, we will eventually want to manually trigger it based on conditions such
  // as whether the user typed in a new line, etc
  useEffect(() => {
    const json = tryParseJson(yaml)
    json && updateEntryJsObj(json)

    if (!mainInput) {
      return
    }
    const currentPos = [mainInput.selectionStart, mainInput.selectionEnd]

    mainInput.value = yaml
    mainInput.selectionStart = currentPos[0]
    mainInput.selectionEnd = currentPos[1]

    if (!entryId) {
      saveCookie()
    }
  }, [yaml, mainInput])

  useEffect(() => {
    const saveOnCtrlS = async (e) => {
      if (e.key === "s" && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        await saveCurrentEntry(yaml, jsObj, user)
      }
    }

    // const processShiftEnter = (e) => {
    //   if (e.key === "s" && (navigator.platform.match("Mac") ? e.metaKey : e.shiftKey)) {
    //     e.preventDefault()
    //     saveCurrentEntry()
    //   }
    // }

    document.addEventListener("keydown", saveOnCtrlS, false)

    return () => {
      document.removeEventListener("keydown", saveOnCtrlS)
    }
  }, [yaml, jsObj, user, entryId])

  const saveCookie = () => {
    console.log("saving entry: " + yaml)
    Cookies.set(savedEntryCookieName, yaml, { expires: 7, sameSite: "strict" })
  }

  return (
    <main>
      <div className="row"></div>
      <div className="row">
        <div className="col-auto mx-auto">
          <div className="card p-2 m-1">
            <div className="row align-items-center">
              <div className="col-auto">
                <a
                  type="button"
                  className="btn btn-success"
                  tabIndex={0}
                  onClick={async () => await saveCurrentEntry(yaml, jsObj, user)}
                  style={{ width: "10rem" }}
                  role="button"
                  onKeyDown={async (ev) => {
                    if (ev.key === "Enter") {
                      await saveCurrentEntry(yaml, jsObj, user)
                    }
                  }}
                >
                  Save
                </a>
              </div>
              <div className="col-auto mx-1">
                <img src="/logo.png" alt="widow hunt" style={{ height: "48px" }} />
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-success"
                  tabIndex={0}
                  onClick={async () => await reloadCurrentEntry()}
                  style={{ width: "10rem" }}
                  disabled={!entryId}
                  onKeyDown={async (ev) => {
                    if (ev.key === "Enter") {
                      await reloadCurrentEntry()
                    }
                  }}
                >
                  Re-Load
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row" style={{ height: "80vh" }}>
        <div className="col-sm-12 col-md-6">
          <div className="card border border-dark p-2 m-1 h-100" style={{ overflow: "auto" }}>
            {/* Note: We are not doing value={yaml} because if yaml is updated by a method that is 
              not the user, there is a flicker where the cursor is moved to the end. For this reason, we */}
            <textarea
              id={mainTextAreaInputId}
              spellCheck="false"
              onKeyDown={(evt) => {
                textAreaUtils.insertTab(evt.target, evt)
                textAreaUtils.processEnter(evt.target, evt)
                setTimeout(() => updateYaml(mainInput.value), 1)
              }}
              name="yaml-entry"
              // onChange={(evt) => {
              //   console.log("updating yaml")
              // }}
              className="h-100 border rounded form-control"
            ></textarea>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 mt-1 mt-md-0">
          <div
            className="card border border-dark p-2 m-1"
            style={{ overflow: "auto", minHeight: "30vh", maxHeight: "50vh" }}
          >
            <DisplayJson jsObj={jsObj} config={config} />
          </div>
          <div
            className="card border border-muted p-2 m-1"
            style={{ overflow: "auto", maxHeight: "30vh" }}
          >
            <DisplayRawJson jsObj={jsObj} />
          </div>
        </div>
      </div>
    </main>
  )
}

const tryParseJson = (yaml: string): any => {
  try {
    var json = jsYaml.load(yaml)
    return json
  } catch (exception) {
    console.log("Parsing failed")
  }
}
YamlEntry.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default YamlEntry
