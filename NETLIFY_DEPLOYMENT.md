# 🚀 TipJar - Netlify Deployment Guide

## Quick Start

Deploy your TipJar app to Netlify in just a few steps!

### Prerequisites

- A [Netlify account](https://app.netlify.com/signup) (free tier is sufficient)
- Git repository (GitHub, GitLab, or Bitbucket)
- Azure Document Intelligence credentials (optional, falls back to Tesseract OCR)

---

## 📦 Deployment Methods

### Method 1: Deploy via Netlify UI (Recommended for First Deploy)

This is the easiest way to get started:

1. **Push your code to Git:**
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider and repository
   - Netlify will auto-detect the configuration from `netlify.toml`

3. **Configure Environment Variables:**
   - In your site settings, go to "Site configuration" → "Environment variables"
   - Add the following variables:

   ```
   SESSION_SECRET=<generate-a-random-secret-string>
   AZURE_DI_KEY=<your-azure-document-intelligence-key>
   AZURE_DI_ENDPOINT=<your-azure-endpoint-url>
   OCR_ENGINE=auto
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your app automatically!

### Method 2: Deploy via Netlify CLI

For developers who prefer the command line:

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Install Netlify CLI globally (optional):**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login to Netlify:**
   ```bash
   netlify login
   ```

4. **Initialize your site:**
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Choose a site name (or let Netlify generate one)

5. **Set environment variables:**
   ```bash
   netlify env:set SESSION_SECRET "your-random-secret-here"
   netlify env:set AZURE_DI_KEY "your-azure-key-here"
   netlify env:set AZURE_DI_ENDPOINT "your-azure-endpoint-here"
   netlify env:set OCR_ENGINE "auto"
   netlify env:set NODE_ENV "production"
   ```

6. **Deploy:**
   ```bash
   # Deploy to preview
   npm run netlify:deploy

   # Deploy to production
   npm run netlify:deploy:prod
   ```

---

## 🔧 Configuration Details

### netlify.toml

The project includes a `netlify.toml` file with the following configuration:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist/public` (your built React app)
- **Functions Directory:** `netlify/functions` (serverless API)
- **Redirects:** API requests are routed to serverless functions
- **Node Version:** 20
- **Install Flags:** `--legacy-peer-deps --include=optional`

### Project Structure for Netlify

```
project/
├── netlify/
│   └── functions/
│       └── api.ts          # Serverless function wrapping Express
├── netlify.toml            # Netlify configuration
├── dist/
│   └── public/             # Built frontend (auto-generated)
├── client/                 # React frontend source
├── server/                 # Express backend source
└── package.json
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SESSION_SECRET` | Secret key for session encryption | `my-super-secret-key-12345` |

### Optional Variables (for Azure OCR)

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_DI_KEY` | Azure Document Intelligence API key | `abc123def456...` |
| `AZURE_DI_ENDPOINT` | Azure endpoint URL | `https://your-resource.cognitiveservices.azure.com` |
| `OCR_ENGINE` | OCR engine to use | `auto` (tries Azure, falls back to Tesseract) |

### Setting Environment Variables

**Via Netlify UI:**
1. Go to Site settings → Environment variables
2. Click "Add a variable"
3. Enter key and value
4. Save and redeploy

**Via CLI:**
```bash
netlify env:set VARIABLE_NAME "value"
```

**Via .env file (local development only):**
```bash
cp env.example .env
# Edit .env with your values
```

⚠️ **Never commit `.env` files to Git!**

---

## 🛠️ Development Workflow

### Local Development

```bash
# Run development server
npm run dev

# Test with Netlify Dev (simulates Netlify environment)
npm run netlify:dev
```

### Making Changes

1. **Make your changes locally**
2. **Test locally:**
   ```bash
   npm run dev
   ```

3. **Deploy preview:**
   ```bash
   npm run netlify:deploy
   ```

4. **Test preview deployment** at the URL Netlify provides

5. **Deploy to production:**
   ```bash
   npm run netlify:deploy:prod
   ```

### Continuous Deployment

Once connected to Git, Netlify automatically:
- ✅ Deploys every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Runs builds and tests
- ✅ Provides unique URLs for each deployment

---

## 📊 Netlify Features You Get

### Free Tier Includes:
- ✅ **100 GB bandwidth/month**
- ✅ **300 build minutes/month**
- ✅ **Unlimited sites**
- ✅ **Instant rollbacks**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Form handling**
- ✅ **Serverless functions** (125,000 requests/month)
- ✅ **Deploy previews**
- ✅ **Split testing**

### Serverless Functions

Your API runs as a Netlify Function with:
- **Execution limit:** 10 seconds (free tier), 26 seconds (Pro)
- **Memory:** 1024 MB
- **Request size:** 6 MB
- **Response size:** 6 MB

For OCR processing, this should be sufficient. If you need longer execution times, consider:
- Netlify Pro plan ($19/month) - 26 second timeout
- Background Functions (available on Pro+)

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** Build fails with dependency errors

**Solution:**
```bash
# Clear cache and rebuild
netlify build --clear-cache
```

### Function Timeout

**Problem:** OCR processing takes too long

**Solutions:**
1. Optimize image size before upload
2. Use Azure OCR (faster than Tesseract)
3. Upgrade to Netlify Pro for longer timeouts
4. Use background functions for heavy processing

### Environment Variables Not Working

**Problem:** App can't find environment variables

**Solution:**
1. Check variable names match exactly (case-sensitive)
2. Redeploy after adding variables
3. Verify in Netlify UI: Site settings → Environment variables

### API Routes Return 404

**Problem:** API endpoints not found

**Solution:**
1. Verify `netlify.toml` redirects are correct
2. Check function deployed: Site overview → Functions
3. Check function logs in Netlify dashboard

### Static Assets Not Loading

**Problem:** Images, CSS, or JS not loading

**Solution:**
1. Verify `publish = "dist/public"` in netlify.toml
2. Check build output includes assets
3. Verify paths are relative (not absolute)

---

## 📱 Useful Netlify CLI Commands

```bash
# Login to Netlify
netlify login

# Check site status
netlify status

# View site info
netlify sites:list

# Open site in browser
netlify open

# Open admin dashboard
netlify open:admin

# View function logs
netlify functions:list
netlify functions:invoke api

# View recent deploys
netlify deploy:list

# Link to existing site
netlify link

# Unlink from site
netlify unlink

# Run build command locally
netlify build

# View environment variables
netlify env:list
```

---

## 🔄 Migrating from Vercel

If you're migrating from Vercel:

1. ✅ **Keep your environment variables:** Copy them from Vercel to Netlify
2. ✅ **Update DNS:** Point your custom domain to Netlify
3. ✅ **Remove Vercel files (optional):**
   ```bash
   rm -rf .vercel
   rm vercel.json
   rm api/index.js
   ```

4. ✅ **Update git remotes** if using different repos

### Key Differences

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Serverless timeout** | 10s (Hobby), 60s (Pro) | 10s (Free), 26s (Pro) |
| **Bandwidth** | 100 GB/month | 100 GB/month |
| **Build minutes** | 6,000/month | 300/month |
| **Edge network** | Yes | Yes |
| **Forms** | No | Yes (built-in) |
| **Split testing** | No | Yes |

---

## 🎯 Best Practices

1. **Use Git-based deployments** for automatic deploys
2. **Test in preview** before deploying to production
3. **Monitor function logs** for errors
4. **Optimize images** before uploading
5. **Use environment variables** for all secrets
6. **Enable branch deploys** for testing features
7. **Set up custom domains** in Netlify settings
8. **Use Deploy Previews** for pull requests
9. **Monitor bandwidth usage** in Netlify dashboard
10. **Keep dependencies updated** for security

---

## 📞 Support & Resources

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Forums:** https://answers.netlify.com
- **Netlify Status:** https://www.netlifystatus.com
- **Support:** support@netlify.com

### Useful Links

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Build Configuration](https://docs.netlify.com/configure-builds/overview/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Custom Domains](https://docs.netlify.com/domains-https/custom-domains/)
- [Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)

---

## 🎉 You're All Set!

Your TipJar app is now running on Netlify with:
- ✅ Automatic deployments
- ✅ HTTPS enabled
- ✅ Global CDN
- ✅ Serverless API
- ✅ OCR processing
- ✅ Partner management
- ✅ Distribution tracking

**Need help?** Check the troubleshooting section or open an issue on GitHub.

Happy tip tracking! 💰

