#!/bin/bash
# Run from home diretory, depends on spdzdev docker container and therefore checked out and built spdz code. 
HERE=$(cd `dirname $0`; pwd)
cd $HERE/..

docker run -it --rm -p 14000-14010:14000-14010 -v ${HOME}/Development/spdz:/spdz -v $(pwd)/spdz:/spdz/analytics spdz/spdzdev

# To compile and run mpc analytics program:
# cd analytics
# ../compile.py analytics_avg
# ../Scripts/run-online.sh analytics_avg
