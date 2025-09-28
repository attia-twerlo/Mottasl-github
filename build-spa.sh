#!/bin/bash

# Build the application
npm run build

# Create fallback routes for SPA
echo "Creating SPA fallback routes..."
cd dist

# Create directories for each route and copy index.html
mkdir -p campaigns contacts analytics messages notifications settings
cp index.html campaigns/index.html
cp index.html contacts/index.html  
cp index.html analytics/index.html
cp index.html messages/index.html
cp index.html notifications/index.html
cp index.html settings/index.html

# Create nested route directories
mkdir -p campaigns/create campaigns/settings campaigns/templates campaigns/ai-bots
cp index.html campaigns/create/index.html
cp index.html campaigns/settings/index.html
cp index.html campaigns/templates/index.html
cp index.html campaigns/ai-bots/index.html

mkdir -p contacts/create
cp index.html contacts/create/index.html

echo "SPA fallback routes created successfully!"