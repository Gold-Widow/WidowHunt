import Head from "next/head"
import { JsxElement } from "typescript"
import { convertSecondsToTimeString } from "../logic/applyTimerBehavior"
import { systemConfigJson } from "../SystemConfig"
import * as marked from "marked"

// OK, might wanna make the input props an interface so that we can do better things with it, and so on.
// this works for now
interface Props {
  json: Object
  displayJsonProps: {}
}

interface DisplayNodeProps {
  keyStyle: JsxElement // Describes the jsx element that displays the key
  collapseChildren: boolean
}

// Learn to use maps in typescript
// I actually don\'t know much type script so I'm gonna have to look at tutorials
interface Node {
  node: Object
}

// TODO: Use typescript and pass in values to the "child display" component (which is probably acutyllay thois
// component, we could use it recursively, and depoending on the "type" it could be3 displayed differently
// So string children would ust be displayed in italics, array shildren would be displayed in <ul> tags, etc,
// and each of those <ul>s will display more things under them if there is more there etc.)
const isValueString = (value: any) => value instanceof String || typeof value === "string"
const isValueNumber = (value: any) => value instanceof Number || typeof value === "number"
const isValueBoolean = (value: any) => value instanceof Boolean || typeof value === "boolean"

const DisplayJson: React.FC<{ jsObj; config: systemConfigJson }> = ({ jsObj, config }) => {
  // TODO: Ok, interesting idea, function is a primitive, and I'm thinking of adding the ability to add a "function" key,
  // and maybe a certian component will evaluate an array of values specified in the values
  // E.g.: (input) => console.log(input): ["a","b","c","d"]
  if (!jsObj) {
    return null
  }
  // TODO: Convert this into : Handle non-array key method, and in that medhot, check for all primitives such as string, number, bigint, boolean etc.
  if (isValueString(jsObj)) {
    const transformedValue = getMarkedString(jsObj, config)
    // console.log(transformedValue);
    // https://reactjs.org/docs/dom-elements.html
    return <strong dangerouslySetInnerHTML={{ __html: transformedValue }}></strong>
  }
  if (isValueNumber(jsObj)) {
    return <strong>{jsObj as number}</strong>
  }
  if (isValueBoolean(jsObj)) {
    return <strong>{jsObj as boolean}</strong>
  }

  const output = Object.keys(jsObj).map((key, index) => {
    // const topLevel = <h1 key={index}>{key}</h1> // We will lookup "key" in a list of nodeconfigs and use that to set the component that it is rendered within This wil
    // As demonstrated below, each key can have a value that is either a string, a list of strings or a list of Objects
    // The node config will allow users to specify which of those are allowed for that key, and based on that,
    // we will display the key and its values
    const value = jsObj[key] // Default to the simplest, an empty string
    try {
      // TODO: Convert this into : Handle non-array value method, and in that medhot, check for all primitives such as string, number, bigint, boolean etc.
      if (isValueString(value)) {
        const transformedValue = getMarkedString(value, config)
        return (
          <div className="card shadow-0 ps-2" key={index}>
            <span>
              <strong>{key}</strong>&nbsp;
              <div dangerouslySetInnerHTML={{ __html: transformedValue }}></div>
            </span>
          </div>
        )
      } else if (Array.isArray(value)) {
        if (value.length !== 0) {
          return (
            <div className="card shadow-0 ps-2" key={index}>
              <strong>{key}</strong>
              <br />
              {value.map((obj, index) => (
                <ul key={index} className="list-group">
                  <li className="list-group-item">
                    <DisplayJson jsObj={obj} config={config} />
                  </li>
                </ul>
              ))}
            </div>
          )
        }
      } else {
        return (
          <div className="card shadow-0 ps-2" key={index}>
            <strong>{key}</strong>
            <DisplayJson jsObj={value} config={config} />
          </div>
        )
      }
    } catch (error) {
      console.log(error)
    }

    return null
  })

  return <>{output}</>
}

// Marked is imported from a <Head /> tag
const getMarkedString = (input: string, config) => marked(transformString(input, config))

// TODO: Make this transform tie ot the applytimer behavior logic? They share a lot of
// logic
const transformString = (input: string, config) => {
  // TODO: Get "display" key from config which will be used to apply the transforms
  const timerRegex = /t\(.*?\)/g
  const timeStartString = "t("
  const timeEndString = ")"
  // Example timer transform:
  // 1. Find every instance of a timer in this input. If there aren't any, return the original
  const Times = input.match(timerRegex)
  if (!Times || Times.length === 0) {
    return input
  }

  // 2. Otherwise, split the input apart. We will update each timer, and glue them back together later
  const restOfinput = input.split(timerRegex)

  const updatedTimes = Times?.map((match) => {
    var numberString = match
    if (timeStartString) {
      numberString = numberString.replace(timeStartString, "")
    }
    if (timeEndString) {
      numberString = numberString.replace(timeEndString, "")
    }
    // OK, this is an important step. When we're replacing / updating a number
    // we NEED to make sure that we're not accidentally wiping out a swath of yaml
    // unintentionally
    const number: number = Number(numberString)
    if (number === NaN) {
      return match
    }

    return timeStartString
      .concat(numberString)
      .concat(" sec - " + convertSecondsToTimeString(number))
      .concat(timeEndString)
  })

  const output = restOfinput.reduce((prev, current, index) => {
    if (index < updatedTimes.length) {
      return prev.concat(current).concat(updatedTimes[index])
    }
    return prev.concat(current)
  }, "")

  return output
}
export default DisplayJson
