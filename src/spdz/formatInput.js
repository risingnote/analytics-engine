// Use in SPDZ MPC program to ignore data
const IGNORE_NUMBER = 0

/**
 * SPDZ expects fixed size inputs, if arrayData does not meet expected buffer length
 * then pad with IGNORE_NUMBER. 
 * @param {Array} arrayData array of input data  
 * @param {Number} colCount columns in input data 
 * @param {Number} rowBufferSize maximum number of rows that can be input
 * 
 * @return {Array} padded array with length colCount * rowBufferSize
 */
const padData = (arrayData, colCount, rowBufferSize) => {
  if (arrayData.length != rowBufferSize * colCount) {
    const filler = new Array(rowBufferSize * colCount - arrayData.length).fill(
      IGNORE_NUMBER
    )
    return arrayData.concat(filler)
  } else {
    return arrayData
  }
}

/**
 * Format extracted DB values into data structure suitable for SPDZ input.
 * 
 * @param {Array} inputData array of input data  
 * @param {Number} colCount columns in input data 
 * @param {Number} rowBufferSize maximum number of rows that can be input
 * 
 * @returns {Array<Array>} array of chunked input data to support batching inputs.
 * Each chunk will start with length of real values and end with continue (0) 
 * or end of input (1).
 */
const formatInput = (inputData, colCount, rowBufferSize) => {
  const maxChunkLgth = colCount * rowBufferSize
  let inputDataChunks = inputData.length === 0 ? [[]] : []

  for (let i = 0; i < inputData.length; i += maxChunkLgth) {
    inputDataChunks.push(inputData.slice(i, i + maxChunkLgth))
  }

  const numChunks = inputDataChunks.length

  return inputDataChunks.map((chunk, index) => {
    const chunkLength = [chunk.length]
    const paddedChunk =
      chunk.length !== maxChunkLgth
        ? padData(chunk, colCount, rowBufferSize)
        : chunk
    const moreChunks = index + 1 < numChunks ? [0] : [1]
    return chunkLength.concat(paddedChunk).concat(moreChunks)
  })
}

module.exports = formatInput
