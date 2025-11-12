# TipJar - Static HTML Version

This is a standalone HTML/JavaScript version of TipJar that works with GitHub Pages.

## Features

- ✅ Pure HTML, CSS, and JavaScript (no build process required)
- ✅ Tailwind CSS via CDN
- ✅ OCR processing using Tesseract.js
- ✅ Fully responsive design
- ✅ Works offline after initial load
- ✅ No backend required

## How to Deploy to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add docs/
   git commit -m "Add static HTML version"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Select the `main` branch and `/docs` folder
   - Click "Save"

3. **Access your site:**
   - Your site will be available at: `https://[username].github.io/[repository-name]/`
   - It may take a few minutes for the site to be published

## How to Use

1. **Upload a Report:**
   - Click "Upload Report" or drag and drop an image file
   - The app will use OCR to extract partner names and hours
   - Supported formats: PNG, JPG, JPEG, GIF

2. **Enter Tip Amount:**
   - Enter the total tip amount to distribute

3. **Calculate:**
   - Click "Calculate Distribution"
   - View the results including:
     - Distribution summary
     - Hourly rate calculation
     - Individual partner payouts
     - Bill breakdown for each partner

## File Structure

```
docs/
├── index.html    # Main HTML file
├── app.js        # JavaScript application logic
└── README.md     # This file
```

## Technologies Used

- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Tesseract.js** - OCR library for text extraction from images
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## Notes

- OCR processing happens entirely in the browser
- No data is sent to any server
- All calculations are done client-side
- The app works offline after the initial page load

## Customization

To customize the app:

1. **Colors:** Edit the CSS variables in `index.html` under the `:root` selector
2. **Store Info:** Update the footer text in `index.html`
3. **OCR Settings:** Modify the `performOCR()` function in `app.js`

## Limitations

- OCR accuracy depends on image quality
- Works best with clear, high-contrast images
- Partner names should be clearly separated from hours in the report
