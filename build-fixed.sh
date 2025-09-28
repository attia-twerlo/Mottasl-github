#!/bin/bash

echo "🚀 Building SPA with proper routing fixes..."

# Clean previous builds
rm -rf dist

# Build the application
npm run build

# Ensure correct vercel.json is in dist
echo "📝 Ensuring correct vercel.json..."
cat > dist/vercel.json << 'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF

# Ensure _redirects file is correct for Netlify
echo "📝 Ensuring correct _redirects..."
cat > dist/_redirects << 'EOF'
/*    /index.html   200
EOF

# Verify the files
echo "✅ Verifying deployment files..."
echo "=== dist/vercel.json ==="
cat dist/vercel.json
echo ""
echo "=== dist/_redirects ==="
cat dist/_redirects

echo ""
echo "🎉 Build completed with SPA routing fixes!"
echo "💡 Deploy this dist folder and all routes should work on refresh."