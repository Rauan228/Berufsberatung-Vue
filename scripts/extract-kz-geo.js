import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

function extractCountry() {
  const src = path.join(publicDir, 'ne-countries.json');
  if (!fs.existsSync(src)) {
    console.error('Missing ne-countries.json');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(src, 'utf8'));
  const feats = data.features.filter((f) => {
    const p = f.properties || {};
    const n = (p.ADMIN || p.NAME || p.name || p.NAME_EN || '').toLowerCase();
    const a3 = (p.ADM0_A3 || p.ISO_A3 || p.iso_a3 || '').toUpperCase();
    return a3 === 'KAZ' || n.includes('kazakhstan');
  });
  console.log('country features', feats.length, feats.map((f) => f.properties.ADMIN || f.properties.NAME));
  const out = path.join(publicDir, 'kz-country.geojson');
  fs.writeFileSync(out, JSON.stringify({ type: 'FeatureCollection', features: feats }));
  console.log('wrote', out, fs.statSync(out).size);
}

function extractRegions() {
  // Prefer 50m if present, else 10m
  const candidates = ['ne-admin1-50m.json', 'ne-admin1.json'];
  const srcName = candidates.find((n) => fs.existsSync(path.join(publicDir, n)));
  if (!srcName) {
    console.warn('No admin1 source found');
    return;
  }
  const src = path.join(publicDir, srcName);
  console.log('reading', src, fs.statSync(src).size);
  const data = JSON.parse(fs.readFileSync(src, 'utf8'));
  const feats = data.features.filter((f) => {
    const p = f.properties || {};
    const a3 = (p.adm0_a3 || p.ADM0_A3 || '').toUpperCase();
    const admin = (p.admin || p.ADMIN || '').toLowerCase();
    return a3 === 'KAZ' || admin === 'kazakhstan';
  });
  console.log('region features', feats.length);
  console.log(feats.map((f) => f.properties.name || f.properties.NAME || f.properties.name_ru).join(', '));
  const out = path.join(publicDir, 'kz-regions.geojson');
  fs.writeFileSync(out, JSON.stringify({ type: 'FeatureCollection', features: feats }));
  console.log('wrote', out, fs.statSync(out).size);
}

extractCountry();
extractRegions();
