export type AppView = 'home' | 'directory' | 'services' | 'about' | 'resources' | 'contact' | 'admin';

export interface RouteMeta {
  view: AppView;
  path: string;
  label: string;
  title: string;
  description: string;
  aliases?: string[];
}

export const ROUTES: Record<AppView, RouteMeta> = {
  home: {
    view: 'home',
    path: '/home',
    label: 'Home',
    title: 'APPSN Kwara State - Official Directory of Registered Surveyors',
    description: 'Official Public Directory of the Association of Private Practicing Surveyors of Nigeria (APPSN), Kwara State Branch. Find, verify and contact registered surveyors.',
    aliases: ['/', '']
  },
  directory: {
    view: 'directory',
    path: '/find-a-surveyor',
    label: 'Find a Surveyor',
    title: 'Find a Registered Surveyor | APPSN Kwara State',
    description: 'Search and verify certified SURCON registered private practicing surveyors across all 16 LGAs of Kwara State.',
    aliases: ['/find a surveyor', '/find%20a%20surveyor', '/directory', '/surveyors']
  },
  services: {
    view: 'services',
    path: '/services',
    label: 'Services',
    title: 'Surveying Services & Standards | APPSN Kwara State',
    description: 'Explore professional land surveying services in Kwara State: perimeter demarcation, cadastral charting, topography, and official KW-GIS lodgements.',
    aliases: ['/our-services']
  },
  about: {
    view: 'about',
    path: '/about',
    label: 'About Us',
    title: 'About Us & Branch Secretariat | APPSN Kwara State',
    description: 'Learn about the Association of Private Practicing Surveyors of Nigeria (APPSN) Kwara State Branch, its mission, executive council, and 40+ years of dedicated service.',
    aliases: ['/about-us']
  },
  resources: {
    view: 'resources',
    path: '/resources',
    label: 'Resources',
    title: 'Resources & Citizen Guide | APPSN Kwara State',
    description: 'Essential statutory checklists, SURCON seal inspection guides, and public advisories against quackery for land buyers and developers in Kwara State.',
    aliases: ['/citizen-guide', '/guides']
  },
  contact: {
    view: 'contact',
    path: '/contact',
    label: 'Contact',
    title: 'Contact Branch Secretariat | APPSN Kwara State',
    description: 'Connect directly with the APPSN Kwara State Secretariat along Ikoyi Avenue, Off New Yidi Rd, Ilorin, or dispatch an inquiry to appsnkwara@gmail.com.',
    aliases: ['/contact-us']
  },
  admin: {
    view: 'admin',
    path: '/admin',
    label: 'Admin Portal',
    title: 'Admin Portal | APPSN Kwara State',
    description: 'Administrative portal for managing registered surveyors, executive council profiles, aims, and citizen messages.',
    aliases: ['/portal', '/login']
  }
};

export function getViewFromLocation(pathname: string, search: string = ''): AppView {
  // 1. Check ?view= query parameter fallback for backward compatibility
  try {
    const params = new URLSearchParams(search);
    const viewParam = params.get('view') as AppView | null;
    if (viewParam && ROUTES[viewParam]) {
      return viewParam;
    }
  } catch (e) {}

  // 2. Parse pathname
  let decoded = '';
  try {
    decoded = decodeURIComponent(pathname).toLowerCase().trim().replace(/\/+$/, '');
  } catch (e) {
    decoded = pathname.toLowerCase().trim().replace(/\/+$/, '');
  }

  if (!decoded || decoded === '' || decoded === '/') {
    return 'home';
  }

  for (const key of Object.keys(ROUTES) as AppView[]) {
    const route = ROUTES[key];
    if (decoded === route.path.toLowerCase()) {
      return route.view;
    }
    if (route.aliases) {
      for (const alias of route.aliases) {
        if (decoded === alias.toLowerCase() || decoded === encodeURI(alias).toLowerCase()) {
          return route.view;
        }
      }
    }
  }

  // Fallback matching partial keywords in path
  if (decoded.includes('surveyor') || decoded.includes('find') || decoded.includes('directory')) return 'directory';
  if (decoded.includes('service')) return 'services';
  if (decoded.includes('about')) return 'about';
  if (decoded.includes('resource') || decoded.includes('guide')) return 'resources';
  if (decoded.includes('contact')) return 'contact';
  if (decoded.includes('admin') || decoded.includes('portal')) return 'admin';

  return 'home';
}

export function getPathForView(view: string): string {
  const route = ROUTES[view as AppView];
  return route ? route.path : '/home';
}

export function updatePageMeta(view: AppView) {
  const route = ROUTES[view];
  if (!route) return;
  if (typeof document !== 'undefined') {
    document.title = route.title;
    
    // 1. Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', route.description);
    }

    // Determine current canonical URL
    const baseUrl = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('run.app'))
      ? window.location.origin
      : 'https://appsnkwara.com';
    const canonicalPath = route.path === '/home' ? '/' : route.path;
    const fullCanonicalUrl = `${baseUrl}${canonicalPath}`;

    // 2. Canonical Link Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', fullCanonicalUrl);

    // 3. OpenGraph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', route.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', route.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonicalUrl);

    // 4. Twitter Card Tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', route.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', route.description);

    const twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute('content', fullCanonicalUrl);
  }
}
