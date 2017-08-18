// Use in SPDZ MPC program to ignore data
const IGNORE_NUMBER = -1

/**
 * SPDZ expects fixed size inputs, if arrayData does not meet expected buffer length
 * then pad with IGNORE_NUMBER. 
 * @param {Array} arrayData array of input data  
 * @param {Number} colCount columns in input data 
 * @param {String} functionId function name
 */
const padData = (arrayData, colCount, bufferSize, batch) => {
  batch
  if (arrayData.length != bufferSize * colCount) {
    const filler = new Array(bufferSize * colCount - arrayData.length).fill(
      IGNORE_NUMBER
    )
    return arrayData.concat(filler)
  } else {
    return arrayData
  }
}

/**
 * Format extracted DB values into data structure suitable for SPDZ input.
 */
const formatInput = (inputData, colCount, bufferSize, batch) => {
  //is buffersize row count or is it number of spdz input values ???
  //TOOD return array of arrays if batched.
  //Each buffer will start with length of real values and end with continue (0) or end of input (1)
  //padding value not important for batching as will not be read.
  return padData(inputData, colCount, bufferSize, batch)
}

module.exports = {
  formatInput: formatInput
}
