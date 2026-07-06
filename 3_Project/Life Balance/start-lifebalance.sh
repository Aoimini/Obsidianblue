#!/bin/bash
cd ~/lifebalance_mvp
exec /usr/bin/python3 -m src.lifebalance serve --host 0.0.0.0 --port 8080
