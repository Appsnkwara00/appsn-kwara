import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const PAGES = [
  {
    path: '/find-a-surveyor',
    title: 'Find a Registered Surveyor | APPSN Kwara State',
    description: 'Search and verify certified SURCON registered private practicing surveyors across all 16 LGAs of Kwara State.',
    heading: 'Find a Registered Surveyor in Kwara State',
    content: 'Search and verify licensed private practicing surveyors registered under SURCON across Asa, Baruten, Edu, Ekiti, Ifelodun, Ilorin East, Ilorin South, Ilorin West, Irepodun, Isin, Kaiama, Moro, Offa, Oke Ero, Oyun, and Pategi.',
    canonical: 'https://appsnkwara.com/find-a-surveyor'
  },
  {
    path: '/services',
    title: 'Surveying Services & Standards | APPSN Kwara State',
    description: 'Explore professional land surveying services in Kwara State: perimeter demarcation, cadastral charting, topography, and official KW-GIS lodgements.',
    heading: 'Professional Land Surveying Services in Kwara State',
    content: 'Comprehensive spatial and land boundary services: Cadastral Boundary Surveys, Topographic & Engineering Surveys, Layout & Subdivision Design, Hydrographic Surveys, and Official KW-GIS Lodgement & Pillar Certification.',
    canonical: 'https://appsnkwara.com/services'
  },
  {
    path: '/about',
    title: 'About Us & Branch Secretariat | APPSN Kwara State',
    description: 'Learn about the Association of Private Practicing Surveyors of Nigeria (APPSN) Kwara State Branch, its mission, executive council, and 40+ years of dedicated service.',
    heading: 'About APPSN Kwara State Branch',
    content: 'The Association of Private Practicing Surveyors of Nigeria (APPSN), Kwara State Branch is the professional body governing licensed private surveyors dedicated to ethical surveying, land tenure security, and public enlightenment.',
    canonical: 'https://appsnkwara.com/about'
  },
  {
    path: '/resources',
    title: 'Resources & Citizen Guide | APPSN Kwara State',
    description: 'Essential statutory checklists, SURCON seal inspection guides, and public advisories against quackery for land buyers and developers in Kwara State.',
    heading: 'Landowner Guides & Anti-Quackery Advisories',
    content: 'Essential guidelines for land buyers in Kwara State: How to identify authentic SURCON red seals, verify registered surveyors, avoid counterfeit survey plans, and understand KW-GIS charting requirements.',
    canonical: 'https://appsnkwara.com/resources'
  },
  {
    path: '/contact',
    title: 'Contact Branch Secretariat | APPSN Kwara State',
    description: 'Connect directly with the APPSN Kwara State Secretariat along Ikoyi Avenue, Off New Yidi Rd, Ilorin, or dispatch an inquiry to appsnkwara@gmail.com.',
    heading: 'Contact APPSN Kwara State Secretariat',
    content: 'Visit our Secretariat at Surveyors Secretariat, Ikoyi Avenue, Off New Yidi Road, Ilorin, Kwara State, Nigeria. Phone: +234 913 755 0602. Email: appsnkwara@gmail.com.',
    canonical: 'https://appsnkwara.com/contact'
  },
  {
    path: '/home',
    title: 'APPSN Kwara State - Official Directory of Registered Surveyors',
    description: 'Official Public Directory of the Association of Private Practicing Surveyors of Nigeria (APPSN), Kwara State Branch. Find, verify and contact registered surveyors.',
    heading: 'APPSN Kwara State - Official Directory of Registered Surveyors',
    content: 'Welcome to the official public portal of the Association of Private Practicing Surveyors of Nigeria (APPSN), Kwara State Branch.',
    canonical: 'https://appsnkwara.com/'
  }
];

function generateStaticPages() {
  const baseHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('dist/index.html not found! Run vite build first.');
    return;
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

  for (const page of PAGES) {
    const pageDir = path.join(distDir, page.path.replace(/^\//, ''));
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    let modifiedHtml = baseHtml;

    // Replace Title
    modifiedHtml = modifiedHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${page.title}</title>`
    );

    // Replace Meta Description
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${page.description}" />`
    );

    // Replace Canonical
    modifiedHtml = modifiedHtml.replace(
      /<link\s+rel="canonical".*?href=".*?"\s*\/?>/i,
      `<link rel="canonical" id="meta-canonical" href="${page.canonical}" />`
    );

    // Replace OpenGraph Title, Description, and URL
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property="og:title"\s+id="og-title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" id="og-title" content="${page.title}" />`
    );
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property="og:description"\s+id="og-description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" id="og-description" content="${page.description}" />`
    );
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property="og:url"\s+id="og-url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" id="og-url" content="${page.canonical}" />`
    );

    // Replace Twitter Title, Description, and URL
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name="twitter:title"\s+id="twitter-title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" id="twitter-title" content="${page.title}" />`
    );
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name="twitter:description"\s+id="twitter-description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" id="twitter-description" content="${page.description}" />`
    );
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name="twitter:url"\s+id="twitter-url"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:url" id="twitter-url" content="${page.canonical}" />`
    );

    // Update Noscript block for crawlers
    const noscriptContent = `
    <noscript>
      <div style="padding: 24px; font-family: sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
        <h1>${page.heading}</h1>
        <p>${page.content}</p>
        <p>Association of Private Practicing Surveyors of Nigeria (APPSN), Kwara State Branch.</p>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/find-a-surveyor">Find a Registered Surveyor</a></li>
            <li><a href="/services">Surveying Services & Standards</a></li>
            <li><a href="/about">About APPSN Kwara State Branch</a></li>
            <li><a href="/resources">Citizen Verification Guide</a></li>
            <li><a href="/contact">Contact Secretariat</a></li>
          </ul>
        </nav>
      </div>
    </noscript>`;

    modifiedHtml = modifiedHtml.replace(/<noscript>[\s\S]*?<\/noscript>/i, noscriptContent);

    const targetPath = path.join(pageDir, 'index.html');
    fs.writeFileSync(targetPath, modifiedHtml, 'utf8');
    console.log(`Generated pre-rendered static page: ${page.path}/index.html`);
  }

  console.log('All static route pages generated successfully for SEO indexing.');
}

generateStaticPages();
