# 🎨 FontTier - Advanced Font Styling & Preview Tool



A powerful, modern web application for styling custom fonts with real-time preview, multiple text boxes, advanced 3D effects, and professional export capabilities. Perfect for designers, developers, and typography enthusiasts.

## ✨ Features

### 🔤 **Multiple Text Boxes**
- **Add unlimited text boxes** with the "+ Add Text" button
- **Independent styling** for each text box (font, size, color, position)
- **Individual font selection** - each text box can use different custom fonts
- **Click to select** any text box for editing
- **Visual selection indicators** with clean borders (hidden by default, shown on hover/selection)
- **Smart border management** - borders excluded from exports for clean results

### 🖱️ **Interactive Controls**
- **Drag & Drop** - Move text boxes freely around the preview area
- **Touch Support** - Full mobile and tablet compatibility
- **No boundaries** - Position text anywhere within the preview canvas
- **Real-time updates** - See changes instantly as you style
- **Hover effects** - Intuitive visual feedback for better UX

### 🎨 **Advanced Styling Options**
- **Custom font upload** support (TTF, OTF, WOFF, WOFF2)
- **Font size** control with real-time preview
- **Vibrant color palette** - Enhanced with bright, modern colors
- **Letter spacing** and line height adjustment
- **Text alignment** (left, center, right) with auto-align feature
- **Text effects** - Bold, Italic, Underline
- **Drop shadows** with customizable colors
- **Text width** and positioning controls
- **3D Text Effects** - Complete 3D transformation suite:
  - **3D Rotations** (X, Y, Z axis) for dynamic angles
  - **Perspective control** for depth perception
  - **Skew transformations** for stylistic distortions
  - **3D Depth** with translateZ positioning
  - **Gradient text colors** with dual-color blending
  - **Real-time 3D preview** with hardware acceleration

### 🖼️ **Background & Export**
- **Custom background images** upload and preview
- **Smart transparency** - unoccupied space remains transparent with custom backgrounds
- **Clean exports** - no UI elements or borders in exported images
- **Multiple export formats** (PNG, JPEG, SVG)
- **Custom resolution** export options
- **Professional quality** exports ready for production use

### 🌐 **Offline Support**
- **Custom offline page** with branded design
- **Offline indicator** shows connection status
- **Service worker** caching for core functionality
- **Graceful degradation** when internet is unavailable
- **Feature availability breakdown** on offline page

### 🔐 **Authentication & Security**
- **Google OAuth integration** via Supabase
- **Secure user sessions** and profile management
- **Protected editor access** - sign in required
- **Session persistence** across browser refreshes

### 📱 **Modern UI/UX**
- **Responsive design** for all screen sizes
- **Vibrant color scheme** with coral and ocean blue accents
- **Glassmorphism effects** with backdrop blur and transparency
- **3D card transforms** for interactive elements
- **Smooth animations** and transitions
- **Toast notifications** for user feedback
- **Live background** effects
- **Clean export workflow** with comprehensive border removal

## 🚀 Run Locally

**Prerequisites:** Node.js 16+ and npm

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fonttier
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🛠️ Build & Deploy

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 🧱 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6.3.6
- **Styling:** Tailwind CSS with custom vibrant color palette
- **Authentication:** Supabase Auth with Google OAuth
- **Export:** html-to-image library with fallback mechanisms
- **Font Loading:** CSS Font Loading API with error handling
- **State Management:** React Hooks with comprehensive error boundaries
- **Offline Support:** Service Worker with custom offline experience
- **UI Effects:** Glassmorphism, 3D transforms, backdrop blur

## 📝 Usage Guide

### Getting Started
1. **Sign in** with your Google account
2. **Upload a custom font** or use the default Lexend font
3. **Type your text** in the text area
4. **Style your text** using the control panel
5. **Add more text boxes** with the "+ Add Text" button
6. **Drag text boxes** to position them perfectly
7. **Apply 3D effects** by enabling 3D mode and adjusting transformations
8. **Export your design** in your preferred format

### Multiple Text Boxes
- Each text box can have its own **unique font file**
- **Click any text box** to select it for editing
- **Drag text boxes** around the preview area freely
- **Hover over text boxes** to see selection borders
- **Selected text box** shows primary color border
- **Style controls** apply only to the selected text box

### Smart Border System
- **Hidden by default** - Clean preview without visual clutter
- **Show on interaction** - Borders appear on hover, selection, or dragging
- **Export exclusion** - No borders in exported images for professional results
- **Multiple detection layers** - CSS classes + inline styles for bulletproof removal

### Background Handling
- **Custom backgrounds** - Upload any image format
- **Smart transparency** - Unoccupied areas stay transparent with custom backgrounds
- **Export accuracy** - What you see is what you export
- **Multiple formats** - Support for various image types

### 3D Text Effects
- **Enable 3D mode** to unlock transformation controls
- **Rotate text** on X, Y, and Z axes for dynamic angles
- **Adjust perspective** to control depth perception
- **Apply skew** transformations for stylistic effects
- **Set 3D depth** with translateZ positioning
- **Use gradient colors** for vibrant text effects
- **Real-time preview** shows changes instantly

### Export Options
- **PNG** - For web use with transparency support
- **JPEG** - For print or web with smaller file sizes
- **SVG** - Vector format for scalable graphics
- **Custom dimensions** - Set exact pixel dimensions
- **Quality control** - Adjust compression for optimal results
- **Clean output** - No UI elements, borders, or artifacts

## 🎯 Perfect For

- **Font designers** showcasing new typefaces with professional presentations
- **Graphic designers** creating text layouts and typography experiments
- **Web developers** testing font combinations and responsive text styling
- **Content creators** making social media graphics and branded content
- **Typography enthusiasts** exploring advanced font effects and 3D transformations
- **Marketing teams** creating promotional materials with custom typography
- **Educators** demonstrating font principles and design concepts

## 🔄 Recent Updates

### v2.0.0 - Major UI & Export Overhaul
- ✅ **Vibrant Color Scheme** - Coral and ocean blue palette for modern appeal
- ✅ **Glassmorphism UI** - Backdrop blur, transparency, and 3D card effects
- ✅ **Smart Border System** - Hidden by default, show on hover/selection, excluded from exports
- ✅ **Custom Background Transparency** - Unoccupied space stays transparent with uploaded backgrounds
- ✅ **Comprehensive Export Fixes** - Bulletproof border removal with CSS + inline style overrides
- ✅ **Offline Experience** - Custom branded offline page with feature breakdown
- ✅ **Enhanced 3D Effects** - Complete transformation suite with real-time preview
- ✅ **Improved Export Quality** - Professional-grade outputs with fallback mechanisms
- ✅ **Performance Optimizations** - Better state management and render optimization
- ✅ **Mobile Enhancements** - Touch support and responsive design improvements

### Previous Updates
- ✅ Multiple text box support with individual styling
- ✅ Per-text-box font selection and loading
- ✅ Drag and drop functionality for text positioning
- ✅ Touch support for mobile devices
- ✅ Enhanced visual selection indicators
- ✅ Improved authentication workflow
- ✅ Global scrollbar hiding for cleaner UI

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">
Made with ❤️ using React, TypeScript, and Tailwind CSS
</div>
