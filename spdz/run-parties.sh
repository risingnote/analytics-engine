#!/bin/bash
# Convenience script to run n parties on same host without Server.x startup coordination program.
# IPs of parties read from config file - lines need to match players count.

HERE=$(cd `dirname $0`; pwd)
echo "HERE is $HERE"
SPDZROOT=$HERE/..

mpc_program=${1:-tutorial}
players=${2:-2}
port_base=${3:-13000}
hosts_file=${4:-HOSTS.config}
bits=${5:-128}
g=${6:-0}
mem=${7:-empty}

params="-ip ${hosts_file} -pn $port_base -lgp ${bits} -lg2 ${g} -m ${mem}"

if ! test -e $SPDZROOT/logs; then
    mkdir $SPDZROOT/logs
fi

# Run first player in background, output to console and file
echo "Starting player 0 in background, output to console : $SPDZROOT/Player-Online.x $params 0 $mpc_program"
$SPDZROOT/Player-Online.x $params 0 $mpc_program 2>&1 | tee $SPDZROOT/logs/0 &

# Run 2 ... n-1 players in background, output to file
rem=$(($players - 2))
for i in $(seq 1 $rem); do
  echo "Starting player $i in background, output to file : $SPDZROOT/Player-Online.x $params $i $mpc_program"
  $SPDZROOT/Player-Online.x $params $i $mpc_program > $SPDZROOT/logs/$i 2>&1 &
done

last_player=$(($players - 1))
echo "Starting player $last_player in foreground, output to file : $SPDZROOT/Player-Online.x $params $last_player $mpc_program"
$SPDZROOT/Player-Online.x $params $last_player $mpc_program > $SPDZROOT/logs/$last_player 2>&1

exit 1