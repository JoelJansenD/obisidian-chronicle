export function replaceLastOccurance(val: string, pattern: string, replacement: string) {
    const lastIndex = val.lastIndexOf(pattern);
    if(lastIndex === -1) {
        return val;
    }

    let result = val.substring(0, lastIndex);
    result += replacement;
    result += val.substring(lastIndex + pattern.length);
    return result;
};