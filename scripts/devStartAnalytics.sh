#!/bin/bash
# Run 2 analytics engines referencing 2 different databases for testing.
HERE=$(cd `dirname $0`; pwd)
PROXYROOT=$HERE/..

if ! test -e $PROXYROOT/logs; then
    mkdir $PROXYROOT/logs
fi

NODE_ENV=development LOG_LEVEL=debug DB_CONFIG_FILE='../config/dbConfig.bank' KEY_PAIR_FILE='../config/dhKeyPair.bank' node src/index.js > $PROXYROOT/logs/analytics_bank.log 2>&1 &
echo $! > $PROXYROOT/logs/analytics_bank.pid
echo "Started analytics engine for acme bank, pid $!."

NODE_ENV=development LOG_LEVEL=debug DB_CONFIG_FILE='../config/dbConfig.ins' KEY_PAIR_FILE='../config/dhKeyPair.ins' node src/index.js > $PROXYROOT/logs/analytics_ins.log 2>&1 &
echo $! > $PROXYROOT/logs/analytics_ins.pid
echo "Started analytics engine for acme insurance, pid $!."
