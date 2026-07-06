#!/bin/bash
# This script stops the existing Next.js application before installing new files.

# We use "|| true" so the deployment doesn't fail if the app isn't running yet (like on the very first deployment)
pm2 stop uni-library || true