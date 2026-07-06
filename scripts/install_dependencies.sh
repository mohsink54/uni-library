#!/bin/bash
# This script installs your production Node modules and runs your database migrations.

cd /home/ec2-user/uni-library

# Install only production dependencies to save time and memory
npm install

# Run the Drizzle ORM migrations we talked about earlier!
npm run db:migrate