#!/usr/bin/env bash

# help
#java -jar walle-cli-all.jar -h

# show channel and ext data
#java -jar walle-cli-all.jar show app.apk

# put channel and ext data to the app.apk
#java -jar walle-cli-all.jar put -c meituan app.apk
#java -jar walle-cli-all.jar put -c meituan -e buildtime=20161212,hash=xxxxxxx app.apk

# put channel from file
#java -jar walle-cli-all.jar put -c meituan app.apk app-new-hahha.apk
#java -jar walle-cli-all.jar batch -c meituan,meituan2,meituan3 app.apk
#java -jar walle-cli-all.jar batch -f channel  app.apk

build_dir='../app/build/outputs/apk'
source_dir='source'
dist_dir='outputs/channels'

source_files="${source_dir}/*.apk"

# init
rm -rf ${dist_dir}
mkdir -p ${dist_dir}
\cp ${build_dir}/* ${source_dir}/

mkdir -p ${dist_dir}/default

for file in ${source_files}
do
  if test -f $file
  then
    file_name=${file##*/}
    cp $file ${dist_dir}
    java -jar ./walle-cli-all.jar batch -f ./channel  ${dist_dir}/${file_name}
    # hack, mv default to release, and mv source to file_source.apk
    cp ${dist_dir}/${file_name%.*}_default.apk ${dist_dir}/default/${file_name}
    rm -rf ${dist_dir}/${file_name}
  fi
done
