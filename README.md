

node_modules 用yarn 装 不要用 npm


code push 自动化发布 （node.js）
node codepush.js     默认ios平台
node codepush.js ios cp899 


-- bug 修复 发布命令
node codepush.js ios test
node codepush.js android test


code push 自动化发布 （python）
cd packer/codepush
python packer.py -o ios -d Production
python packer.py -a cp899 -o android -d Production

code-push 发布版本
code-push release-react hatsune-ios ios -d Production -m true

code-push deployment ls hatsune-ios -k 查询key
code-push deployment history hatsune-ios Production 查询发布的历史版本

 参数：
-m true 强制更新
-d Production 生产环境参数，如果不加默认测试环境


注意事项
（1）导入CodePush
#import "CodePush.h"
（2）将代码中的
jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
替换为：
jsCodeLocation = [CodePush bundleURL];

该替换在Release下进行相关的操作，如果是debug版本加上如下代码，系统在运行时候会自动切换。
NSURL *jsCodeLocation;
#ifdef DEBUG
jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
#else
jsCodeLocation = [CodePush bundleURL];
#endif

#清理资源文件
```
for FILE in $(git ls-files ./app/src/sound); do
echo $(basename "$FILE")
done
```
```
for FILE in $(git ls-files ./app/src/sound); do
git grep $(basename "$FILE") > /dev/null || git rm "$FILE"
done
```
```
for FILE in $(git ls-files ./app); do
  echo $(basename ${FILE%.*})
done
```
```
for FILE in $(git ls-files ./app); do
git grep $(basename ${FILE%.*}) > /dev/null || git rm "$FILE"
done
```
```
depcheck
ncu
```
