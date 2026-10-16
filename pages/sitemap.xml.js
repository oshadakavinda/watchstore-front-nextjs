import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function getServerSideProps({ res }) {
  await mongooseConnect();

  const baseUrl = process.env.PUBLIC_URL || 'https://watchstore.luxury';

  const products = await Product.find({}, '_id updatedAt').lean();
  const categories = await Category.find({}, '_id updatedAt').lean();

  const staticPages = [
    '',
    '/products',
    '/categories',
    '/compare',
    '/faq',
    '/returns',
    '/terms',
    '/privacy',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(route => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <changefreq>daily</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
  ${products
    .map(p => `
    <url>
      <loc>${baseUrl}/product/${p._id}</loc>
      <lastmod>${new Date(p.updatedAt || Date.now()).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
  `).join('')}
  ${categories
    .map(c => `
    <url>
      <loc>${baseUrl}/category/${c._id}</loc>
      <lastmod>${new Date(c.updatedAt || Date.now()).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {}
