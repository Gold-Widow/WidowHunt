interface behaviorsArray {
    (args:string[]) : void
}
interface displayStyles{
    [index: string]: string
}

export interface keyConfig{
    behavior: behaviorsArray,
    displayStyles: displayStyles
}

const testGenericFn = <T>(input: T): T => {
    return input
}

let map : { [key: string]: boolean} = {};

