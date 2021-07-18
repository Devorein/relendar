export function generateSplitInput(inputStr: string) {
  const inputChunks = inputStr.split(' '),
    generatedChunks: string[] = [];
  let tempStr: string[] = [];
  for (let index = 0; index < inputChunks.length; index++) {
    const inputChunk = inputChunks[index];
    if (inputChunk.startsWith('"')) {
      tempStr.push(inputChunk.slice(1));
    } else if (inputChunk.endsWith('"')) {
      generatedChunks.push(
        tempStr.concat(inputChunk.slice(0, inputChunk.length - 1)).join(' ')
      );
      tempStr = [];
    } else if (tempStr.length !== 0) {
      tempStr.push(inputChunk);
    } else {
      generatedChunks.push(inputChunk);
    }
  }
  return generatedChunks;
}
