#!/bin/bash
# run from home directory
HERE=$(cd `dirname $0`; pwd)
cd $HERE/..

docker run -d --rm --name mysqlDev -v $(pwd)/datadir:/var/lib/mysql -p 3306:3306 -e MYSQL_ALLOW_EMPTY_PASSWORD=yes mysql:5.7

#-v /my/custom:/etc/mysql/conf.d or pass startup flags
