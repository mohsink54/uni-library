#!/bin/bash
set -e  # fail fast

cd /home/ec2-user/uni-library

# Fix ownership so ec2-user can write files
sudo chown -R ec2-user:ec2-user .

# Remove node_modules and package-lock.json if they were created by root
rm -rf node_modules package-lock.json

# Install dependencies cleanly
npm install --unsafe-perm

# Ensure dotenv is installed
npm install dotenv --save

# Run migrations (requires .env with DATABASE_URL)
npx drizzle-kit migrate
