#!/bin/bash
# Load the environment (NVM often needs this)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# If you installed Node via NVM, this line ensures it is found
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd /home/ec2-user/uni-library

# Now run npm with a explicit check
if ! command -v npm &> /dev/null; then
    echo "npm could not be found, attempting to locate..."
    # If NVM isn't the issue, try the full path if you know it, e.g.:
    # /usr/local/bin/npm install
    exit 1
fi

npm install
npm run db:migrate