const fs = require("fs");
const path = require("path");
const svgson = require("svgson");

const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

const toLowerFirst = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const optimizeSVGFiles = async (directoryPath) => {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    if (file.endsWith(".svg")) {
      const filePath = path.join(directoryPath, file);
      const svg = fs.readFileSync(filePath, "utf8");

      const svgJSON = await svgson.parse(svg);

      // Modify the file name if needed, and add icon to the end of fileName
      const hasIconSuffix = /-icon\.svg$/.test(file);

      const newFileName = !hasIconSuffix
        ? toKebabCase(toLowerFirst(file)).replace(".svg", "-icon.svg")
        : file;

      // Update the width and height properties to "1em"
      svgJSON.attributes.width = "1em";
      svgJSON.attributes.height = "1em";
      svgJSON.attributes.stroke = "currentColor";

      const modifiedSVG = svgson.stringify(svgJSON);

      // Save the modified SVG to a new file with the updated file name
      const newFilePath = path.join(directoryPath, newFileName);
      fs.writeFileSync(newFilePath, modifiedSVG, "utf8");

      console.log(`SVG attributes changed for file: ${file}`);
    }
  }
};

const directoryPath = "./svgs";
optimizeSVGFiles(directoryPath);
