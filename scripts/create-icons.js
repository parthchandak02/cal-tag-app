const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Define the sizes for different use cases
const sizes = {
  favicon: 48,        // standard favicon size
  splash: { width: 1080, height: 1920 }  // 16:9 ratio vertical, Full HD resolution
};

// Input and output paths
const assetsDir = path.join(__dirname, '..', 'assets/images');
const inputPath = path.join(assetsDir, 'icon.png');
const outputPaths = {
  adaptiveIcon: path.join(assetsDir, 'adaptive-icon.png'),
  favicon: path.join(assetsDir, 'favicon.png'),
  splash: path.join(assetsDir, 'splash.png')
};

// Process and save the images
async function processImages() {
  try {
    // Ensure the assets directory exists
    await fs.mkdir(assetsDir, { recursive: true });

    // Copy original icon to adaptive icon without processing
    await fs.copyFile(inputPath, outputPaths.adaptiveIcon);
    console.log('Adaptive icon created successfully (copied from original).');

    // Resize and save for favicon
    await sharp(inputPath)
      .resize(sizes.favicon, sizes.favicon, {
        fit: 'contain',
        kernel: sharp.kernel.lanczos3
      })
      .toFormat('png', { quality: 100 })
      .toFile(outputPaths.favicon);
    console.log('Favicon created successfully.');

    // Create vertical splash screen with centered logo and no background
    const logoMetadata = await sharp(inputPath).metadata();
    const logoAspectRatio = logoMetadata.width / logoMetadata.height;
    const maxLogoWidth = Math.min(logoMetadata.width, sizes.splash.width * 0.8); // Limit logo width to 80% of splash width
    const logoWidth = maxLogoWidth;
    const logoHeight = Math.round(logoWidth / logoAspectRatio);

    await sharp({
      create: {
        width: sizes.splash.width,
        height: sizes.splash.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }  // Transparent background
      }
    })
      .composite([{
        input: await sharp(inputPath)
          .resize(logoWidth, logoHeight, {
            fit: 'contain',
            kernel: sharp.kernel.lanczos3
          })
          .toBuffer(),
        gravity: 'center'
      }])
      .toFormat('png', { quality: 100 })
      .toFile(outputPaths.splash);
    console.log('Splash image created successfully.');
  } catch (err) {
    console.error('Error processing images:', err);
  }
}

// Run the function
processImages();
