const applyTimerBehavior = (
  yaml: string,
  timerRegex: RegExp,
  timeStartString: string,
  timeEndString: string,
  secondsToAdd: number
): string => {
  // 1. Find every instance of a timer in this yaml. If there aren't any, return the original
  const Times = yaml.match(timerRegex)
  if (!Times || Times.length === 0) {
    return yaml;
  }

  // 2. Otherwise, split the yaml apart. We will update each timer, and glue them back together later
  const restOfYaml = yaml.split(timerRegex)

  const updatedTimes = Times?.map((match) => {
    var numberString = match;
    if (timeStartString) {
        numberString = numberString.replace(timeStartString, "")
    }
    if (timeEndString) {
        numberString = numberString.replace(timeEndString, "")
    }
    // OK, this is an important step. When we're replacing / updating a number 
    // we NEED to make sure that we're not accidentally wiping out a swath of yaml
    // unintentionally
    const number: number = Number(numberString);
    if(number === NaN){
        return match;
    }
    return timeStartString.concat(("0000" + (number + secondsToAdd)).slice(-4)).concat(timeEndString);
  })

  const output = restOfYaml.reduce((prev, current, index) => {
    if(index < updatedTimes.length){
        return prev.concat(current).concat(updatedTimes[index]);
    }
    return prev.concat(current);
  }, "");

  return output;
}

export const convertSecondsToTimeString = (totalSeconds: number) => {
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60)
  const hours = Math.floor(totalSeconds / (60 * 60))

  if (hours == 0 && minutes != 0) {
    return `${minutes} min`
  }
  if (minutes == 0) {
    return `Less than a minute`
  }
  return `${hours} hr, ${minutes} min`;
}

export default applyTimerBehavior
