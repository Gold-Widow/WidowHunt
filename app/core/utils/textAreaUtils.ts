//https://sumtips.com/snippets/javascript/tab-in-textarea/
function insertTab(o, e) {
  // TODO: Eventually, we will want to pass in a "context" and this context will contain maps
  // that describe what to do when one action is performed
  var characterToReplaceTabWith = "\t" //
  characterToReplaceTabWith = "    " // Replace tab with four spaces

  var lengthOfReplacingCharacters = characterToReplaceTabWith.length

  var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which
  if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
    var oS = o.scrollTop
    if (o.setSelectionRange) {
      var sS = o.selectionStart
      var sE = o.selectionEnd
      o.value = o.value.substring(0, sS) + characterToReplaceTabWith + o.value.substr(sE)
      // Update the cursor's position, put it at the end of the characters we replaced
      o.setSelectionRange(sS + lengthOfReplacingCharacters, sS + lengthOfReplacingCharacters)
      o.focus()
    } else if (o.createTextRange) {
      //@ts-ignore
      document.selection.createRange().text = characterToReplaceTabWith
      e.returnValue = false
    }
    o.scrollTop = oS
    if (e.preventDefault) {
      e.preventDefault()
    }
    return true
  }
  return false
  // const newSpace =
  //       whitespace.length < 4
  //         ? ""
  //         : whitespace.substring(whitespace.length - 5, whitespace.length - 1)

  //     const newLines = lines.reduce((prev, current, index) => {
  //       if (index === lines.length - 1) {
  //         return prev.concat("\n")
  //       }
  //       prev.concat("\n").concat(current)
  //     }, "")
  //     o.value = newLines?.concat(newSpace)
}

function processEnter(o, e) {
  var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which

  if (o.value.length)
    if (kC == 13) {
      var val: string = o.value
      if (o.selectionStart < val.trimEnd().length) {
        return false
      }
      o.value = val.trimEnd()
      // if (!e.ctrlKey && !e.altKey) {
      //   // Do something else:
      // }
      // if(e.ctrlKey || e.){
      //   console.log("REE");
      // }
      var stringToReplaceEnterWith = "\n"

      const lines: string[] = (o.value as string).split("\n")
      const lastLine = lines[lines.length - 1]
      const whitespace = lastLine.split(/[^\s]/g)[0]

      const lastLineTrimmed = lastLine.trimEnd()
      const lastCharOfLastLine = lastLineTrimmed[lastLineTrimmed.length - 1]

      // Need to use this to check if shift is pressed
      // https://stackoverflow.com/questions/12118944/how-can-i-check-if-shiftenter-is-pressed-on-a-textarea
      if (e.shiftKey) {
        // alert("shifting")
        const newSpace = whitespace.length < 4 ? "" : whitespace.substring(0, whitespace.length - 5)

        stringToReplaceEnterWith = stringToReplaceEnterWith.concat(newSpace)
      } else if (lastCharOfLastLine === ":") {
        stringToReplaceEnterWith = stringToReplaceEnterWith.concat(whitespace).concat("    ")
      } else {
        stringToReplaceEnterWith = stringToReplaceEnterWith.concat(whitespace)
      }

      // var lengthOfReplacingCharacters = characterToReplaceEnterWith.length

      var oS = o.scrollTop
      o.value = o.value.concat(stringToReplaceEnterWith)

      o.scrollTop = oS
      if (e.preventDefault) {
        e.preventDefault()
      }
      return true
    }
  return false
}

function getLineNumber(tArea) {
  return tArea.value.substr(0, tArea.selectionStart).split("\n").length
}

function getCursorPos(tArea) {
  var el = tArea
  var pos = 0
  if ("selectionStart" in el) {
    pos = el.selectionStart
  } else if ("selection" in document) {
    el.focus()
    //@ts-ignore
    var Sel = document.selection.createRange()
    //@ts-ignore
    var SelLength = document.selection.createRange().text.length
    Sel.moveStart("character", -el.value.length)
    pos = Sel.text.length - SelLength
  }
  var ret = pos - prevLine(tArea)
  alert(ret)

  return ret
}

function prevLine(tArea) {
  var lineArr = tArea.value.substr(0, tArea.selectionStart).split("\n")

  var numChars = 0

  for (var i = 0; i < lineArr.length - 1; i++) {
    numChars += lineArr[i].length + 1
  }

  return numChars
}

var textAreaUtils = {
  insertTab: insertTab,
  processEnter: processEnter,
}

export default textAreaUtils
