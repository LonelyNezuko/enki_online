const functions = {
    sqlInParser: (array, key, brackets = true) =>
    {
        if(!Array.isArray(array))return ''

        let values = brackets ? "(" : ""
        array.forEach((item, i) =>
        {
            if(typeof item === 'object' && item[key])
            {
                values += item[key]
                values += i === array.length - 1 ? brackets ? ")" : "" : ","
            }
        })
        if(brackets
            && values === '(') values = ''

        return values
    },
    arrayObjectCollecting: (firstArray, lastArray, innerArray, firstKey, lastKey, innerIsObject = false) =>
    {
        if(!Array.isArray(firstArray)
            || !Array.isArray(lastArray))return firstArray

        firstArray.forEach((fItem, fID) =>
        {
            firstArray[fID][innerArray] = !innerIsObject ? [] : {}
            lastArray.forEach((lItem, lID) =>
            {
                if(fItem[firstKey] === lItem[lastKey])
                {
                    if(!innerIsObject) firstArray[fID][innerArray].push(lItem)
                    else firstArray[fID][innerArray] = lItem
                }
            })
        })
        return firstArray
    }
}

module.exports = functions
