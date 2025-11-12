# 🚀 TipJar - Vercel Deployment Guide

## ✅ Deployment Complete!

Your TipJar app is now live on Vercel!

### 🌐 Your App URLs

- **Production:** https://tipjar-sbux.vercel.app
- **Latest Preview:** https://tipjar-sbux-9qkeglc27-devwalshy.vercel.app

### 🔐 Environment Variables Set

All environment variables have been configured in production:

- ✅ `AZURE_DI_KEY` - Your Azure Document Intelligence API Key
- ✅ `AZURE_DI_ENDPOINT` - https://sbux-tips.cognitiveservices.azure.com
- ✅ `SESSION_SECRET` - Secure session secret
- ✅ `OCR_ENGINE` - Set to "auto" (tries Azure first, falls back to Tesseract)

### 📝 What Was Done

1. ✅ Removed all Fly.io files (fly.toml, Dockerfile, deploy scripts, etc.)
2. ✅ Installed Vercel CLI
3. ✅ Created Vercel configuration (vercel.json)
4. ✅ Added .npmrc for handling dependency conflicts
5. ✅ Modified server to work with Vercel serverless
6. ✅ Deployed to Vercel preview
7. ✅ Set all environment variables
8. ✅ Deployed to production

### 🔄 How to Update Your App

Whenever you make changes:

```powershell
# Option 1: Deploy automatically (recommended)
npx vercel --prod

# Option 2: Deploy preview first, then promote
npx vercel        # Deploy to preview
npx vercel --prod # Promote to production
```

### 📊 Useful Vercel Commands

```powershell
# View your deployments
npx vercel ls

# View logs
npx vercel logs tipjar-sbux

# View environment variables
npx vercel env ls

# Add new environment variable
npx vercel env add VARIABLE_NAME production

# Remove environment variable
npx vercel env rm VARIABLE_NAME production

# Open project in dashboard
npx vercel --open
```

### 🔗 Connect GitHub for Auto-Deploy (Optional)

To automatically deploy on every git push:

1. Go to: https://vercel.com/devwalshy/tipjar-sbux
2. Click "Settings" → "Git"
3. Connect your GitHub repository
4. Every push to main will auto-deploy!

### 📱 Features Available

Your deployed app includes:
- ✅ Complete React frontend
- ✅ Express backend API
- ✅ Azure Document Intelligence OCR
- ✅ Tesseract OCR fallback
- ✅ Partner management
- ✅ Distribution history
- ✅ All calculation features

### 💰 Vercel Free Tier Includes

- ✅ Unlimited deployments
- ✅ 100GB bandwidth per month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Preview deployments

### 🐛 Troubleshooting

**If the app doesn't work:**

1. Check the logs:
   ```powershell
   npx vercel logs tipjar-sbux --follow
   ```

2. Verify environment variables:
   ```powershell
   npx vercel env ls
   ```

3. Redeploy:
   ```powershell
   npx vercel --prod --force
   ```

### 📞 Support

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Your Project:** https://vercel.com/devwalshy/tipjar-sbux

---

**🎉 Your app is live and ready to use!**

Visit: **https://tipjar-sbux.vercel.app**

