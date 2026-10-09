const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Paths to dependencies in ecommerce-admin
const S3_SDK_PATH = path.resolve(__dirname, '../../ecommerce-admin/node_modules/@aws-sdk/client-s3');
const MIME_PATH = path.resolve(__dirname, '../../ecommerce-admin/node_modules/mime-types');

const { S3Client, PutObjectCommand } = require(S3_SDK_PATH);
const mime = require(MIME_PATH);

const PICS_DIR = path.resolve(__dirname, '../../pics');

// Product Title to filenames mapping
const PRODUCT_MAPPINGS = [
  {
    title: 'Citizen',
    files: ['CC4065-61Y_Catalog.png'],
  },
  {
    title: 'Seiko',
    files: ['seiko.jpg'],
  },
  {
    title: "Casio G-Shock GM-2100N-2AER Blue Analogue Digital Men's Watch",
    files: [
      'gshock-removebg-preview.png',
      'gshock2-removebg-preview.png',
      'download-removebg-preview.png',
    ],
  },
  {
    title: 'Timex',
    files: ['6205_TX_TC24_flatlay_background_TW2W73300-copy-removebg.png'],
  },
  {
    title: 'Swatch',
    files: ['omega swatch.webp'],
  },
  {
    title: 'Casio F-91W',
    files: ['f-91w-1xy-front_1-removebg-preview.png'],
  },
  {
    title: 'Edifice',
    files: [
      'Casio-Men-s-Edifice-Classic-Stainless-Steel-Bracelet-Watch-with-Black-Dial-EFB108D-1AV_de7c0d1f-e209-4d40-a1de-445750ea14e7.edfa1e51744d0fe3ef7b73fa3b8fb703-removebg-preview.png',
    ],
  },
  {
    title: 'Naviforce',
    files: ['naviforce-removebg-preview.png'],
  },
];

async function main() {
  const bucketName = process.env.S3_BUCKET_NAME;
  const region = process.env.S3_REGION || 'eu-north-1';
  const mongoUri = process.env.MONGODB_URI;

  if (!bucketName) throw new Error('Missing S3_BUCKET_NAME in environment');
  if (!mongoUri) throw new Error('Missing MONGODB_URI in environment');

  console.log('Connecting to S3...');
  console.log('Bucket:', bucketName);
  console.log('Region:', region);

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  // Upload all files in PICS_DIR and record their public URLs
  const uploadedUrls = {};
  const allFiles = fs.readdirSync(PICS_DIR);
  console.log(`\nFound ${allFiles.length} files in ${PICS_DIR}`);

  for (const fileName of allFiles) {
    const filePath = path.join(PICS_DIR, fileName);
    if (!fs.statSync(filePath).isFile()) continue;

    const fileContent = fs.readFileSync(filePath);
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    const s3Key = `${Date.now()}-${fileName}`;

    console.log(`Uploading ${fileName} -> ${s3Key} (${contentType})...`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
      })
    );

    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    uploadedUrls[fileName] = publicUrl;
    console.log(`  Uploaded: ${publicUrl}`);
  }

  console.log('\nConnecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  const db = mongoose.connection.db;
  const productsCollection = db.collection('products');

  console.log('\nUpdating Products in MongoDB...');
  for (const item of PRODUCT_MAPPINGS) {
    const urls = item.files
      .map((f) => uploadedUrls[f])
      .filter(Boolean);

    if (urls.length === 0) {
      console.warn(`No uploaded URLs for product "${item.title}"`);
      continue;
    }

    const res = await productsCollection.updateOne(
      { title: item.title },
      { $set: { images: urls } }
    );

    console.log(`Updated "${item.title}": matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    console.log(`  New Images:`, urls);
  }

  console.log('\nAll images uploaded and MongoDB records successfully updated!');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Error occurred:', err);
  process.exit(1);
});
