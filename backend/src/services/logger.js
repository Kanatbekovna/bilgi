import fs from "fs";

export function log(message) {
  const time = new Date().toISOString();
  const line = `[${time}] ${message}\n`;

  console.log(line);

  fs.appendFileSync("./logs/app.log", line);
}
