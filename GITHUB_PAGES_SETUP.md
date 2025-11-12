# GitHub Pages Setup Guide

This guide will help you deploy the TipJar static HTML version to GitHub Pages.

## Quick Setup (5 minutes)

### Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
git add .
git commit -m "Add TipJar static HTML version"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository
2. Click on **Settings** (top right)
3. Scroll down and click on **Pages** (left sidebar)
4. Under **Source**:
   - Select branch: `main`
   - Select folder: `/docs`
5. Click **Save**

### Step 3: Wait for Deployment

- GitHub will automatically build and deploy your site
- This usually takes 1-3 minutes
- You'll see a green checkmark when it's ready

### Step 4: Access Your Site

Your site will be available at:
```
https://[your-username].github.io/[repository-name]/
```

For example:
- Username: `johnsmith`
- Repository: `tipjar`
- URL: `https://johnsmith.github.io/tipjar/`

## Troubleshooting

### Site Not Loading?

1. **Check the Actions tab** in your repository to see if the deployment succeeded
2. **Wait a few minutes** - initial deployment can take up to 10 minutes
3. **Clear your browser cache** and try again
4. **Check the URL** - make sure you're using the correct format

### 404 Error?

1. Make sure you selected `/docs` folder (not root `/`)
2. Verify that `index.html` exists in the `docs/` folder
3. Check that the `.nojekyll` file exists in `docs/`

### OCR Not Working?

1. Make sure you're using HTTPS (not HTTP)
2. Try a different browser (Chrome/Edge recommended)
3. Check browser console for errors (F12)
4. Ensure the image is clear and high quality

## Custom Domain (Optional)

To use a custom domain like `tipjar.yourdomain.com`:

1. Add a `CNAME` file to the `docs/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

See [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## Updating Your Site

To update your site after making changes:

```bash
git add docs/
git commit -m "Update TipJar"
git push origin main
```

GitHub will automatically redeploy your site within a few minutes.

## Features of This Static Version

✅ **No Build Process** - Just HTML, CSS, and JavaScript
✅ **No Backend Required** - Everything runs in the browser
✅ **Free Hosting** - GitHub Pages is completely free
✅ **HTTPS Enabled** - Secure by default
✅ **Fast Loading** - Optimized for performance
✅ **Mobile Friendly** - Responsive design
✅ **Offline Capable** - Works after initial load

## File Structure

```
docs/
├── index.html          # Main application
├── app.js             # JavaScript logic
├── README.md          # Documentation
├── sample-report.md   # Example report formats
└── .nojekyll         # Prevents Jekyll processing
```

## Need Help?

- Check the [docs/README.md](docs/README.md) for usage instructions
- Review [sample-report.md](docs/sample-report.md) for OCR tips
- Open an issue on GitHub if you encounter problems

## Next Steps

1. ✅ Deploy to GitHub Pages
2. 📱 Test on mobile devices
3. 🎨 Customize colors and branding
4. 📊 Test with your actual reports
5. 🔗 Share the URL with your team

Enjoy using TipJar! 🎉
