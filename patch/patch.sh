#!/bin/bash

ndkRootPath="Library/Android/sdk/ndk-local"
ndkFolderName="android-ndk-r10e"
ndkEnvPath="$ndkRootPath/$ndkFolderName"

reactNativeGitlabUrl="git@gitlab.kosun.net:frontend/react-native-source.git"
reactNativeFolderName="react-native-source"
reactNativeBranchName="v0.39.2"

if [ ! -d "$reactNativeFolderName" ]; then
  git clone -b $reactNativeBranchName $reactNativeGitlabUrl
else
  cd $reactNativeFolderName
  git reset --hard
  git pull origin
  git checkout $reactNativeBranchName
  cd -
fi

if [ ! -d "$HOME/$ndkEnvPath" ]; then
  if read -t 5 -p "你的 NDK 编译环境还未安装，是否立刻进行安装(此脚本只适用於 MAC)？[y|n] :" yn
  then
    if [[ $yn == [Yy] ]];then
      echo "正在安装环境"
      chmod +x $reactNativeFolderName/mac.env.build.sh
      ./$reactNativeFolderName/mac.env.build.sh
    elif [[ $yn == [Nn] ]];then
      echo "请稍后自己手动安装环境 ... "
    else [[ $yn != [YyNn] ]]
      echo "请确认你的输入!"
    fi
  else
    echo " "
    echo -e "输入超时 ... "
  fi
fi

echo "正在打补丁 ... "
echo `pwd`
cp -R -f $reactNativeFolderName/react-native/* ../node_modules/react-native/
echo "补丁完成 ... "

echo "清理 ... "
rm -rf $reactNativeFolderName
echo "结束，你可以编译 react native 源代码了 ... "
