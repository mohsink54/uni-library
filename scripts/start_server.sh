#!/bin/bash
# This script starts the Next.js application using PM2 to keep it running in the background.

cd /home/ec2-user/uni-library

# Start the Next.js server and name the PM2 process "uni-library"
pm2 start npm --name "uni-library" -- start

# Save the PM2 list so the app automatically restarts if the EC2 server reboots
pm2 save