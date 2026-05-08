export function parseQA(input) {
  if (!input) return [];

  const blocks = input
    .split(/\n\s*\n/) // split by empty lines
    .map((block) => block.trim())
    .filter(Boolean);

  const result = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim());

    let question = "";
    let answer = "";
    let current = null;

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (lower.startsWith("q:")) {
        current = "q";
        question = line.slice(2).trim();
      } else if (lower.startsWith("a:")) {
        current = "a";
        answer = line.slice(2).trim();
      } else {
        // multiline support
        if (current === "q") {
          question += " " + line;
        } else if (current === "a") {
          answer += "\n" + line;
        }
      }
    }

    // validate
    if (question && answer) {
      result.push({
        que: question.trim(),
        ans: answer.trim(),
      });
    }
  }

  return result;
}