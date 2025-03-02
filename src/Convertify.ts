import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import logger from './logger'

/**
 * ConvertifyImage - A class for image conversion using Base64 and ImageMagick.
 */
export class ConvertifyImage {
  private static tempDir = path.join(__dirname, 'temp')

  /**
   * Ensures the temporary directory exists.
   */
  constructor() {
    if (!fs.existsSync(ConvertifyImage.tempDir)) {
      fs.mkdirSync(ConvertifyImage.tempDir, { recursive: true })
    }
  }

  /**
   * Checks if ImageMagick is installed.
   * @returns A Promise resolving to true if ImageMagick is installed, otherwise false.
   */
  public async checkImageMagick(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('convert -version', (error, stdout) => {
        if (error) {
          logger.warn('ImageMagick is not installed.')
          return resolve(false)
        }
        logger.info(`ImageMagick detected: ${stdout.split('\n')[0]}`)
        resolve(true)
      })
    })
  }

  /**
   * Attempts to install ImageMagick based on the detected OS.
   * @returns A Promise that resolves when the installation is complete.
   */
  public async installImageMagick(): Promise<void> {
    return new Promise((resolve, reject) => {
      const platform = os.platform()
      let installCommand = ''

      if (platform === 'linux') {
        installCommand = 'sudo apt update && sudo apt install -y imagemagick libopenjp2-7 ghostscript'
      } else if (platform === 'darwin') {
        installCommand = 'brew install imagemagick'
      } else if (platform === 'win32') {
        logger.warn(
          'Automatic installation is not supported on Windows. Please install ImageMagick manually: https://imagemagick.org/script/download.php#windows',
        )
        return reject(new Error('Windows automatic installation not supported'))
      } else {
        return reject(new Error(`Unsupported platform: ${platform}`))
      }

      logger.info(`Installing ImageMagick...`)
      exec(installCommand, (error, stdout, stderr) => {
        if (error) {
          logger.error('Failed to install ImageMagick:', stderr)
          return reject(error)
        }
        logger.info('ImageMagick installed successfully!')
        resolve()
      })
    })
  }

  /**
   * Converts a Base64-encoded image to a specified format.
   * @param base64Image - The input image in Base64 format.
   * @param outputFormat - Desired output format (jpg, png, gif, webp, tiff, jp2).
   * @returns A Promise resolving to the converted image in Base64 format.
   */
  public async convertBase64(base64Image: string, outputFormat: string): Promise<string> {
    const isInstalled = await this.checkImageMagick()
    if (!isInstalled) {
      throw new Error('ImageMagick is not installed. Run installImageMagick() to install it.')
    }

    return new Promise((resolve, reject) => {
      try {
        const supportedFormats = ['jpg', 'png', 'gif', 'webp', 'tiff', 'jp2']
        if (!supportedFormats.includes(outputFormat)) {
          return reject(new Error(`Unsupported output format: ${outputFormat}`))
        }

        const match = base64Image.match(/^data:image\/(png|jpeg|jpg|jp2|gif|bmp|tiff|webp|heic);base64,/)
        if (!match) {
          return reject(new Error('Invalid Base64 image format'))
        }

        const inputFormat = match[1]
        const inputFilename = `input_${Date.now()}.${inputFormat}`
        const inputPath = path.join(ConvertifyImage.tempDir, inputFilename)
        const outputFilename = `output_${Date.now()}.${outputFormat}`
        const outputPath = path.join(ConvertifyImage.tempDir, outputFilename)

        // Save Base64 image as a file
        const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        fs.writeFileSync(inputPath, buffer)

        // Convert image using ImageMagick
        const command = `convert "${inputPath}" "${outputPath}"`

        exec(command, (err, stdout, stderr) => {
          if (err) {
            logger.error('Conversion error:', stderr)
            return reject(new Error('Error converting image'))
          }

          // Read converted image and return as Base64
          const outputBase64 = fs.readFileSync(outputPath, { encoding: 'base64' })

          // Cleanup temporary files
          fs.unlinkSync(inputPath)
          fs.unlinkSync(outputPath)

          resolve(`data:image/${outputFormat};base64,${outputBase64}`)
        })
      } catch (error) {
        logger.log('Error processing the image:', error)
        reject(new Error('Error processing the image'))
      }
    })
  }

  /**
   * Converts an image file to another format using ImageMagick.
   * @param inputPath - Path to the input image file.
   * @param outputPath - Path to save the converted image file.
   * @returns A Promise resolving when the conversion is complete.
   */
  public async convertImageMagick(inputPath: string, outputPath: string): Promise<void> {
    const isInstalled = await this.checkImageMagick()
    if (!isInstalled) {
      throw new Error('ImageMagick is not installed. Run installImageMagick() to install it.')
    }

    return new Promise((resolve, reject) => {
      const command = `convert "${inputPath}" "${outputPath}"`

      exec(command, (err, stdout, stderr) => {
        if (err) {
          logger.error('ImageMagick conversion error:', stderr)
          return reject(new Error('Error converting image using ImageMagick'))
        }

        resolve()
      })
    })
  }

  /**
   * Converts an image file to a Base64 string.
   * @param imagePath - Path to the input image file.
   * @returns A Promise resolving to the Base64 string of the image.
   */
  public async imageToBase64(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(imagePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
          return reject(new Error('Error reading image file'))
        }

        const extension = path.extname(imagePath).replace('.', '')
        const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'jp2', 'bmp', 'heic']

        if (!supportedFormats.includes(extension)) {
          return reject(new Error(`Unsupported file format: ${extension}`))
        }

        const base64Image = `data:image/${extension};base64,${data.toString('base64')}`
        resolve(base64Image)
      })
    })
  }
}
