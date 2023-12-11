import fs from "fs";
import path from "path";

export const createFile = (filePath: string) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, "");
};
