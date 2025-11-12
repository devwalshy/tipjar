# 🎯 TipJar - Static HTML Version

A standalone tip distribution calculator that works with GitHub Pages. No build process, no backend, just pure HTML, CSS, and JavaScript.

## 🌟 What This Is

This is a **static HTML version** of the TipJar React application, specifically designed for easy deployment to GitHub Pages. It maintains all the functionality of the original while being completely self-contained.

## ✨ Features

- 📤 **File Upload** - Drag & drop or click to upload partner hours reports
- 🔍 **OCR Processing** - Automatic text extraction using Tesseract.js
- 💰 **Tip Distribution** - Calculate fair distribution based on hours worked
- 💵 **Bill Breakdown** - Shows exact bills needed ($20, $10, $5, $1)
- 📱 **Fully Responsive** - Works on all devices
- 🎨 **Beautiful UI** - Modern design with smooth animations
- 🔒 **Privacy First** - All processing happens in your browser
- ⚡ **Fast & Lightweight** - No build process required

## 🚀 Quick Start

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Push to GitHub:**
   ```bash
   git add docs/
   git commit -m "Add TipJar static version"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: `main` branch, `/docs` folder
   - Save and wait 2-5 minutes

3. **Access your site:**
   ```
   https://[username].github.io/[repository-name]/
   ```

### Option 2: Run Locally

Simply open `docs/index.html` in your web browser. That's it!

## 📁 File Structure

```
docs/
├── index.html          # Main application (open this!)
├── app.js             # JavaScript logic
├── .nojekyll          # GitHub Pages config
├── test.html          # Testing page
├── README.md          # Documentation
├── QUICK_START.md     # Quick reference
└── sample-report.md   # OCR format examples
```

## 📖 Documentation

- **[GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** - Complete deployment guide
- **[TRANSFORMATION_COMPLETE.md](TRANSFORMATION_COMPLETE.md)** - Transformation details
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-launch checklist
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - User guide
- **[docs/README.md](docs/README.md)** - Technical documentation
- **[docs/sample-report.md](docs/sample-report.md)** - OCR format tips

## 🎯 How to Use

1. **Upload Report** - Click "Upload Report" or drag & drop an image
2. **Enter Tip Amount** - Type the total tips to distribute
3. **Calculate** - Click "Calculate Distribution"
4. **View Results** - See individual payouts and bill breakdowns

## 🖼️ Report Format

For best OCR results, your report should look like:

```
John Smith 8.5
Jane Doe 7.25
Mike Johnson 6.0
Sarah Williams 8.75
```

Or with colons:
```
John Smith: 8.5
Jane Doe: 7.25
```

See [docs/sample-report.md](docs/sample-report.md) for more examples.

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling with custom properties
- **JavaScript (ES6+)** - Application logic
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Tesseract.js** - OCR text extraction (via CDN)
- **Font Awesome** - Icons (via CDN)
- **Google Fonts** - Inter font family

## 🎨 Customization

### Change Colors

Edit CSS variables in `docs/index.html`:

```css
:root {
  --app-bg: #2F4F4F;        /* Main background */
  --spring-green: #93EC93;   /* Primary color */
  --spring-blue: #9FD6E9;    /* Secondary color */
  --spring-accent: #DD7895;  /* Accent color */
}
```

### Update Store Info

Edit the footer in `docs/index.html`:

```html
<div class="font-medium">Made by Your Name</div>
<div class="text-xs">Your Store Info</div>
```

## 🧪 Testing

Before deploying, test locally:

1. Open `docs/test.html` - Run automated tests
2. Open `docs/index.html` - Test the full application
3. Try uploading a sample report image
4. Verify calculations are correct

## 🌐 Browser Support

Works on all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Support

Fully responsive design:
- Touch-friendly interface
- Optimized for small screens
- Works in portrait and landscape
- Add to home screen capable

## 🔒 Privacy & Security

- ✅ All processing happens in your browser
- ✅ No data sent to external servers
- ✅ Images are not stored anywhere
- ✅ No cookies or tracking
- ✅ HTTPS enabled by default (GitHub Pages)

## 🐛 Troubleshooting

### OCR Not Working?
- Ensure image is clear and high quality
- Check that text is horizontal
- Try a different image format
- Review [docs/sample-report.md](docs/sample-report.md)

### Page Not Loading?
- Clear browser cache
- Try incognito/private mode
- Check browser console (F12) for errors
- Wait 10 minutes after enabling GitHub Pages

### Calculations Wrong?
- Verify tip amount is correct
- Check that all partners were detected
- Run tests in `docs/test.html`

## 📊 Comparison: React vs Static

| Feature | React Version | Static Version |
|---------|--------------|----------------|
| Framework | React | Vanilla JS |
| Build Process | Vite | None |
| Backend | Express | None |
| OCR | Server-side | Client-side |
| Hosting | Node.js | GitHub Pages |
| Deployment | Complex | Simple |
| Dependencies | npm packages | CDN links |
| Offline | Requires setup | Works after load |

## 🎓 Learning Resources

Want to understand how it works?

1. **HTML Structure** - Check `docs/index.html`
2. **JavaScript Logic** - Review `docs/app.js`
3. **Testing** - Run `docs/test.html`
4. **Documentation** - Read all `.md` files

## 🤝 Contributing

Found a bug or want to improve something?

1. Fork the repository
2. Make your changes in the `docs/` folder
3. Test thoroughly with `docs/test.html`
4. Submit a pull request

## 📄 License

MIT License - Feel free to use and modify!

## 👤 Author

**William Walsh**
- Store: Starbucks #66900
- Created for easy tip distribution

## 🙏 Acknowledgments

- Original React version team
- Tesseract.js for OCR capabilities
- Tailwind CSS for styling utilities
- GitHub Pages for free hosting

## 📞 Support

Need help?

1. Check the documentation files
2. Run `docs/test.html` to verify setup
3. Review browser console for errors
4. Open an issue on GitHub

## 🗺️ Roadmap

Future enhancements:
- [ ] Export results as PDF
- [ ] Save/load previous calculations
- [ ] Multiple currency support
- [ ] Custom bill denominations
- [ ] Print-friendly view

## ⭐ Star This Repo

If you find this useful, please star the repository!

---

**Ready to deploy?** Follow [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) now!

**Need help?** Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Quick reference?** See [docs/QUICK_START.md](docs/QUICK_START.md)

---

Made with ❤️ for the Starbucks team
