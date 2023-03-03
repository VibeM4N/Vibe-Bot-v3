const { glob } = require("glob");
const { promisify } = require("util");
const PG = promisify(glob);
const fs = require("fs");

async function loadFiles(dirName) {
  const Files = await PG(
    `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
  );
  Files.forEach((file) => delete require.cache[require.resolve(file)]);
  return Files;
}

const getFiles = (path, ending) => {
  return fs.readdirSync(path).filter((f) => f.endsWith(ending));
};

module.exports = { loadFiles, getFiles };
