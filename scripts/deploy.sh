#!/usr/bin/env bash
set -euo pipefail

BUCKET="grindgains-frontend-prod"
DISTRIBUTION_ID="EZZPO5FMVTZX1"

cd "$(dirname "$0")/.."

echo "Building..."
npm run build

echo "Syncing to s3://$BUCKET ..."
aws s3 sync dist/ "s3://$BUCKET" --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"

echo "Done. https://d5kmvgwcspew2.cloudfront.net/"
