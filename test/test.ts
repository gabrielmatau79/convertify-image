import { ConvertifyImage } from '../src/Convertify'

const converter = new ConvertifyImage()

// Check if ImageMagick is installed
converter.checkImageMagick().then((isInstalled) => {
  if (!isInstalled) {
    console.log('Installing ImageMagick...')
    converter
      .installImageMagick()
      .then(() => console.log('Installation complete!'))
      .catch((error) => console.error('Installation failed:', error))
  }
})

// Convert Base64 image

const imagePath = '/images/example.jpg'
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
