#!/usr/bin/env node
const { program } = require("commander");
const { exec } = require("child_process");
const inquirer = require("inquirer");
const typeMap = {
  feat: "feat",
  fix: "fix",
  docs: "docs",
  style: "style",
  refactor: "refactor",
  test: "test",
  chore: "chore",
  perf: "perf",
  ci: "ci",
  revert: "revert",
};
program.version("0.0.1").name("crisp-log").description(`
    欢迎使用 crisp-log\n
    快速生成清晰、简洁的提交信息\n
`);

program
  .command("run [type] [message]")
  .option("-n, --notAdd [notAdd]", "add .")
  .description("开始生成提交信息")
  .action(async (p1, p2, option) => {
    const { notAdd } = option;
    let _type, _message;
    if (p1 && p2) {
      _type = p1;
      _message = p2;
      toLog(_type, _message);
    } else if (p1 && !p2) {
      _message = p1;
      exec("git symbolic-ref --short -q HEAD", (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        const branch = stdout.trim();
        // 检测分支名是否包含 type
        _type = Object.keys(typeMap).find((key) => branch.includes(key));
        toLog(_type, _message);
      });
    } else {
      const type_answer = await inquirer.prompt([
        {
          type: "list",
          name: "type",
          message: "请选择提交类型:",
          choices: Object.keys(typeMap),
        },
      ]);
      _type = type_answer.type;
      const message_answer = await inquirer.prompt([
        {
          type: "input",
          name: "message",
          message: "请输入提交信息:",
        },
      ]);
      _message = message_answer.message;
      toLog(_type, _message);
    }
    function toLog(type, message) {
      const commitMessage = `${typeMap[type] || type}: ${message}`;
      exec(
        notAdd
          ? `git commit -m "${commitMessage}`
          : `git add . && git commit -m "${commitMessage}"`,
        (err, stdout, stderr) => {
          if (err) {
            console.log(stdout, stderr);
            return;
          }
          console.log(stdout);
        }
      );
    }
  });

program.parse(process.argv);
