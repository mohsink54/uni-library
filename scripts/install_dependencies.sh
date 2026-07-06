#!/bin/bash
set -e

cd /home/ec2-user/uni-library
sudo chown -R ec2-user:ec2-user .

# Clean up old lockfile if root-owned
rm -f package-lock.json

npm install --legacy-peer-deps

# Ensure dotenv is present
npm install dotenv --save

# Run migrations
npx drizzle-kit migrate
