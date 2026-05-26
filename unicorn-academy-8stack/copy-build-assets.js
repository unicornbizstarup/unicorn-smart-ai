const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const buildDir = path.join(__dirname, '.open-next');
const destDir = path.join(__dirname, 'dist-pages');

console.log('Starting assets copy to dist-pages...');

try {
  // 1. Clean and recreate destDir
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  // 2. Copy .open-next/assets to dist-pages
  const assetsSrc = path.join(buildDir, 'assets');
  if (fs.existsSync(assetsSrc)) {
    copyRecursiveSync(assetsSrc, destDir);
    console.log('Copied assets folder successfully.');
  } else {
    console.warn('Warning: .open-next/assets does not exist!');
  }

  // 3. Copy worker.js to dist-pages/_worker.js
  const workerSrc = path.join(buildDir, 'worker.js');
  const workerDest = path.join(destDir, '_worker.js');
  if (fs.existsSync(workerSrc)) {
    fs.copyFileSync(workerSrc, workerDest);
    console.log('Copied worker.js to _worker.js successfully.');
  }

  // 4. Copy cloudflare, middleware, .build, server-functions to dist-pages
  const foldersToCopy = ['cloudflare', 'middleware', '.build', 'server-functions'];
  foldersToCopy.forEach((folder) => {
    const srcFolder = path.join(buildDir, folder);
    const destFolder = path.join(destDir, folder);
    if (fs.existsSync(srcFolder)) {
      copyRecursiveSync(srcFolder, destFolder);
      console.log(`Copied ${folder} folder successfully.`);
    }
  });

  console.log('✅ Prepare build assets completed successfully in dist-pages!');
} catch (error) {
  console.error('❌ Error preparing build assets:', error);
  process.exit(1);
}
