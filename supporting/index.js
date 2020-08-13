const fs = require('fs');
const readline = require('readline');

const linesArray = [];

let linesRead = 0;
let lineProps = [];

const readInterface = readline.createInterface({
  input: fs.createReadStream('./supporting/loadProfile.csv'),
  output: process.stdOut,
  console: false,
});

readInterface.on('line', (line) => {
  console.log(`reading line: ${linesRead}`);

  if (linesRead === 0) {
    lineProps = line.split(',');
  } else {
    const newDateTimeObj = {};
    const lineVals = line.split(',');

    for (let i = 0; i < lineProps.length; i += 1) {
      newDateTimeObj[lineProps[i]] = lineVals[i];
    }

    linesArray.push(newDateTimeObj);
  }

  linesRead += 1;
}).on('close', () => {
  console.log('done reading');

  const linesOut = JSON.stringify(linesArray);

  fs.writeFile('./sourceData/loadProfile.json', linesOut, (err) => {
    if (err) {
      return console.log(err);
    }

    return console.log('loadProfile.json output');
  });
});
