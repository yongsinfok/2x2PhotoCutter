# 📸 Photo Cutter

A premium, browser-based tool to automatically split 2x2 grid images into separate high-quality photos with built-in size optimization.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Aesthetics](https://img.shields.io/badge/Aesthetics-Premium-ff69b4.svg)

## ✨ Features

- **🚀 Instant Splitting**: Automatically detects and splits 2x2 grid images into 4 individual files.
- **📉 Intelligent Compression**: Ensures every output image is **under 1MB** by dynamically adjusting quality using a recursive compression algorithm.
- **🎨 Premium UI/UX**: 
  - Modern Dark Mode aesthetic.
  - Glassmorphism effects.
  - Smooth micro-animations and transitions.
  - Responsive design (Mobile & Desktop).
- **🔒 Privacy First**: All processing happens locally in your browser. No images are uploaded to any server.

## 🛠️ Tech Stack

- **HTML5**: Semantic structure and SEO optimized.
- **CSS3**: Vanilla CSS with custom design tokens, animations, and glassmorphism.
- **JavaScript**: Pure ES6+ logic utilizing the **Canvas API** for high-performance image manipulation.

## 🚀 Getting Started

No installation required! Since this is a pure client-side application, you can run it directly:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/photo-cutter.git
   ```
2. Open `index.html` in any modern web browser.
3. Drag and drop your grid image and click **"Split & Optimize"**.

## 📖 Usage

1. **Upload**: Drag an image onto the glowing upload zone or click to browse.
2. **Preview**: Verify your original image in the preview window.
3. **Process**: Click **Split & Optimize**. 
4. **Download**: Each quadrant will appear in the "Extracted Photos" section with its calculated file size. Click the download icon on each card.

## ⚙️ How it Works

The application uses the `CanvasRenderingContext2D.drawImage()` method to extract four equal quadrants from the source image. Each quadrant is then converted to a Blob with an initial quality setting. If the resulting Blob exceeds 1MB, the algorithm recursively reduces the JPEG quality until the constraint is met.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ for creators.*
