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
  .command("log [type] [message]")
  .option("-n, --notAdd [notAdd]", "不运行 git add .")
  .option("-p, --push [push]", "git push")
  .option("-u, --u [u]", "git push -u")
  .description("开始生成提交信息")
  .action(async (p1, p2, option) => {
    const { notAdd } = option;
    let _type, _message;
    if (p1 && p2) {
      _type = p1;
      _message = p2;
      toLog(_type, _message);
      (option.push || option.u) && push();
    } else if (p1 && !p2) {
      _message = p1;
      exec("git symbolic-ref --short -q HEAD", async (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        const branch = stdout.trim();
        // 检测分支名是否包含 type
        _type = Object.keys(typeMap).find((key) => branch.includes(key));
        if (!_type) {
          console.log("分支名不包含 type, 请手动输入 type");
          const type_answer = await inquirer.prompt([
            {
              type: "list",
              name: "type",
              message: "请选择提交类型:",
              choices: Object.keys(typeMap),
            },
          ]);
          _type = type_answer.type;
        }
        toLog(_type, _message);
        (option.push || option.u) && push();
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
      (option.push || option.u) && push();
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
    function push() {
      exec("git symbolic-ref --short -q HEAD", async (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        const branch = stdout.trim();
        exec(
          option.u ? `git push -u origin ${branch}:${branch}` : "git push",
          (err, stdout, stderr) => {
            if (err) {
              console.log(stdout, stderr);
              return;
            }
            console.log(stdout);
          }
        );
      });
    }
  });

program.parse(process.argv);
