# Convertify Image

## 🚀 A Powerful TypeScript Library for Image Conversion

**Convertify Image** is a lightweight and powerful TypeScript library for converting images between multiple formats using **Base64 encoding** and **ImageMagick**.

---

## 📦 Installation

### Using pnpm:

```sh
pnpm add convertify-image
```

### Using npm:

```sh
npm install convertify-image
```

### Using yarn:

```sh
yarn add convertify-image
```

---

## 🔧 Requirements

Before using Convertify Image, ensure you have **ImageMagick** installed on your system.

### **Linux (Ubuntu/Debian)**

```sh
sudo apt update && sudo apt install -y imagemagick libopenjp2-7 ghostscript
```

### **macOS**

```sh
brew install imagemagick
```

### **Windows**

Download and install ImageMagick from:
[ImageMagick Official Site](https://imagemagick.org/script/download.php#windows)

---

## 🚀 Usage

### **1️⃣ Check if ImageMagick is Installed and Install if Necessary**

```typescript
import { ConvertifyImage } from '../src/Convertify'

const converter = new ConvertifyImage()

converter.checkImageMagick().then((isInstalled) => {
  if (!isInstalled) {
    console.log('Installing ImageMagick...')
    converter
      .installImageMagick()
      .then(() => console.log('Installation complete!'))
      .catch((error) => console.error('Installation failed:', error))
  }
})
```

### **2️⃣ Convert Image File to Base64 and Convert to Another Format**

```typescript
const imagePath = '50239.jpg'
const outputFormat = 'jp2'

converter
  .imageToBase64(imagePath)
  .then((base64Image) => {
    console.log('Base64 Image:', base64Image)

    // Now use it for conversion
    return converter.convertBase64(base64Image, outputFormat)
  })
  .then((convertedBase64) => {
    console.log(convertedBase64)
    console.log('Converted Image (Base64):')
  })
  .catch((error) => {
    console.error('Error:', error)
  })
```

---

## 🎯 Features

✅ Convert between multiple formats: **PNG, JPG, GIF, WEBP, TIFF, JP2, BMP, HEIC**  
✅ Supports **Base64 encoding and decoding**  
✅ Uses **ImageMagick** for high-quality image transformations  

---

## 🛠️ Development & Contribution

### Clone the Repository

```sh
git clone https://github.com/your-username/convertify-image.git
cd convertify-image
```

### Install Dependencies

```sh
pnpm install
```

### Run Tests

```sh
pnpm test
```

### Build the Project

```sh
pnpm build
```

### Format & Lint Code

```sh
pnpm format && pnpm lint
```

---

## 📜 License

MIT License © 2025 - Gabriel Mata

---

## 🌎 Connect with Us

💬 [GitHub Issues](https://github.com/gabrielmatau79/convertify-image/issues) - Report bugs and suggest features
