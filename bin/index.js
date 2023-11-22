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
  .description("开始生成提交信息")
  .action(async (type, message) => {
    let _type, _message;
    if (type) {
      _type = type;
    } else {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "type",
          message: "请选择提交类型:",
          choices: Object.keys(typeMap),
        },
      ]);
      _type = answers.type;
    }
    if (message) {
      _message = message;
    } else {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "message",
          message: "请输入提交信息:",
        },
      ]);
      _message = answers.message;
    }
    const commitMessage = `${typeMap[_type]|| _type} : ${_message}`;
    console.log(`\n${commitMessage}\n`);
  });

program.parse(process.argv);
