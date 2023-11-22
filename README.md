# crisp-log

### 快速生成清晰、简洁的提交信息

```
npm i crisp-log -g

or

npm i crisp-log -D

```

### feature

1. 一句命令生成规范 commit
2. 可视化生成 commit
3. 自动识别分支生成 commit type

### 命令

#### crisp log [type] [message]

例如：

```js
crisp log feat 开发购物车功能

↓👇等价于↓

git add .
git commit -m 'feat: 开发购物车功能'

```

#### crisp log

可视化生成 commit

```
可视化手动选择type 生成message
```

#### crisp log [message]

如果 type 没有设定，会自动识别当前分支关键词，例如当前分支为 fix/cart-zero

```
crisp log 修复购物车删除异常

↓👇等价于↓

git add .
git commit -m 'fix: 修复购物车删除异常'  //此处的fix 是通过识别分支名获取的

```

### 其他参数

crisp log [type] [message] -n // 加上-n 参数表示 只进行 git commit，不执行 git add .

crisp log [type] [message] -p // 加上-p 参数表示 commit 之后自动 git push

crisp log [type] [message] -u // 加上-u 参数表示 commit 之后自动 git push -u origin branch:branch
