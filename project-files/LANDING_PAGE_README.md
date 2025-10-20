# COSONE Landing Page

## Overview

The COSONE Landing Page is a modern, responsive web page that serves as the main entry point for visitors. It features a comprehensive navigation menu and content sections that can be easily integrated with WordPress for content management.

## Features

### 🧭 Navigation Menu
- **Fixed left sidebar** with smooth animations
- **7 main sections**:
  1. **Actualités** (News) - Default view
  2. **Qui sommes-nous** (About Us)
  3. **Nos activités** (Our Activities)
  4. **Nos centres** (Our Centers) - Dynamic data from CSV file with ratings and website links
  5. **Nos conventions** (Our Conventions)
  6. **Espace galerie et vidéothèque** (Gallery & Video Library)
  7. **Espace recherche** (Search Space)
  8. **Page contact** (Contact Page)

### 🎨 Design Features
- **Modern gradient backgrounds** with smooth transitions
- **Responsive design** that works on all devices
- **Interactive elements** with hover effects and animations
- **Professional color scheme** using blues, purples, and grays
- **Font Awesome icons** for visual appeal

### 📱 Responsive Design
- **Desktop**: Full sidebar navigation (280px width)
- **Tablet**: Collapsible sidebar with hamburger menu
- **Mobile**: Optimized layout with stacked elements

### ⚡ Interactive Features
- **Content switching** without page reload
- **Smooth animations** and transitions
- **Form validation** and submission handling
- **Search functionality** with mock results
- **Tabbed content** in gallery section
- **Login button** in header for easy access

## File Structure

```
src/main/resources/
├── templates/
│   └── landing.html          # Main HTML template
├── static/
│   ├── css/
│   │   └── landing.css       # Landing page styles
│   ├── js/
│   │   └── landing.js        # Landing page functionality
│   └── csv/
│       └── output.csv        # Centres data source
src/main/java/com/cosone/cosone/service/
└── CentresCsvService.java    # CSV parsing service
```

## Usage

### Accessing the Landing Page
- **URL**: `/` (root) or `/home`
- **Controller**: `HomeController.home()` (now serves landing page)
- **Template**: `landing.html`

### Default View
The landing page automatically displays the **"Actualités"** (News) section by default, as requested.

### Navigation
- Click any menu item in the left sidebar to switch content
- Content sections load instantly with smooth animations
- Active menu item is highlighted with blue accent

## WordPress Integration

### Current State
The landing page is designed to be **WordPress-ready** with:
- Placeholder content that can be replaced with WordPress data
- Structured sections that match typical WordPress page layouts
- CSS classes that can be easily customized for WordPress themes

### Future Integration
To integrate with WordPress:
1. **Replace placeholder content** with WordPress API calls
2. **Add WordPress authentication** if needed
3. **Customize CSS** to match WordPress theme
4. **Add dynamic content loading** from WordPress posts/pages

### CSV Data Integration
The centres section now loads data from a CSV file:
- **File location**: `src/main/resources/static/csv/output.csv`
- **Service**: `CentresCsvService.java` handles CSV parsing
- **Features**: Displays name, address, phone, description, rating, and website links
- **Auto-update**: Simply replace the CSV file to update centres data

## Customization

### Colors
The main color scheme can be modified in `landing.css`:
```css
/* Primary colors */
--primary-blue: #667eea;
--primary-purple: #764ba2;
--accent-blue: #3498db;
--success-green: #28a745;
```

### Layout
- **Sidebar width**: Modify `.navigation-menu` width (default: 280px)
- **Content spacing**: Adjust padding and margins in `.content-container`
- **Grid layouts**: Modify grid-template-columns for different screen sizes

### Content
Each section can be customized by editing the HTML in `landing.html`:
- **Text content**: Update French text as needed
- **Images**: Replace Font Awesome icons with actual images
- **Forms**: Modify form fields and validation

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Performance

- **Lightweight**: Minimal JavaScript dependencies
- **Fast loading**: Optimized CSS and efficient DOM manipulation
- **Smooth animations**: Hardware-accelerated CSS transitions
- **Responsive images**: Placeholder system ready for image optimization

## Accessibility

- **Keyboard navigation**: Full keyboard support for menu items
- **Screen reader friendly**: Proper ARIA labels and semantic HTML
- **High contrast**: Good color contrast ratios
- **Focus indicators**: Clear focus states for interactive elements

## Development

### Adding New Sections
1. Add new menu item to `.menu-items` in HTML
2. Create corresponding section with `content-section` class
3. Add JavaScript functionality if needed
4. Update CSS for styling

### Modifying Existing Sections
- **Content**: Edit HTML within each section
- **Styling**: Modify CSS classes in `landing.css`
- **Functionality**: Update JavaScript in `landing.js`

## Troubleshooting

### Common Issues
1. **Menu not working**: Check JavaScript console for errors
2. **Styling issues**: Verify CSS file is loaded correctly
3. **Responsive problems**: Test on different screen sizes
4. **Animation glitches**: Check browser compatibility

### Debug Mode
Enable debug logging by adding this to `landing.js`:
```javascript
const DEBUG = true;
function log(message) {
    if (DEBUG) console.log('[Landing Page]:', message);
}
```

## Future Enhancements

- **WordPress REST API integration**
- **Dynamic content loading**
- **User authentication integration**
- **Multi-language support**
- **Advanced search with filters**
- **Content management system**
- **Analytics integration**
- **SEO optimization**

## Support

For technical support or customization requests, please contact the development team or refer to the main project documentation.
