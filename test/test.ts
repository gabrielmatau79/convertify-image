import { ConvertifyImage } from '../src/Convertify'

describe('ConvertifyImage Tests', () => {
  let converter: ConvertifyImage

  beforeAll(() => {
    converter = new ConvertifyImage()
  })

  test('Check if ImageMagick is installed', async () => {
    const isInstalled = await converter.checkImageMagick()
    expect(typeof isInstalled).toBe('boolean')
  })
})
