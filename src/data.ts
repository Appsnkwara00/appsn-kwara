import { Surveyor, AdminAccount, ContactMessage, Executive, AimObjective } from './types';

export const KWARA_LGAS = [
  "Asa",
  "Baruten",
  "Edu",
  "Ekiti",
  "Ifelodun",
  "Ilorin East",
  "Ilorin South",
  "Ilorin West",
  "Irepodun",
  "Isin",
  "Kaiama",
  "Moro",
  "Offa",
  "Oke Ero",
  "Oyun",
  "Pategi"
];

export const SPECIALIZATIONS = [
  "Cadastral & Boundary Surveying",
  "Engineering & Construction Surveying",
  "Hydrographic & Marine Surveying",
  "Geodetic Surveying & GNSS Control",
  "GIS, Digital Mapping & Spatial Analysis",
  "Remote Sensing & Drone Photogrammetry",
  "Mining & Volumetric Surveying"
];

export const DEFAULT_ADMINS: AdminAccount[] = [
  {
    id: "admin-1",
    username: "appsn_kwara_admin",
    email: "appsnkwara0@gmail.com",
    role: "Super Admin",
    lastLogin: "2026-06-26T08:30:00Z"
  },
  {
    id: "admin-2",
    username: "secretary_appsn",
    email: "secretary@appsnkwara.com",
    role: "Branch Admin",
    lastLogin: "2026-06-25T14:15:00Z"
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Alhaji Kolawole Yusuf",
    email: "kola.yusuf@gmail.com",
    phone: "+234 803 123 4567",
    subject: "Land Verification in Fate Area, Ilorin",
    message: "Hello APPSN Secretariat, I am planning to purchase a double plot of land around Fate Area, Ilorin. I would like to verify if the coordinates are clean and request a registered surveyor to carry out the boundary validation. Kindly assist with a recommendation. Thank you.",
    status: "unread",
    createdAt: "2026-06-25T10:00:00Z"
  },
  {
    id: "msg-2",
    name: "Dr. Olayemi Balogun",
    email: "o.balogun@unilorin.edu.ng",
    phone: "+234 805 987 6543",
    subject: "GIS Training Collaboration Request",
    message: "Greetings. I am writing from the Department of Geography at the University of Ilorin. We would love to collaborate with APPSN Kwara State Branch for our upcoming spatial GIS symposium and hands-on workshop in September. We want to see how we can align academia and private practice.",
    status: "replied",
    createdAt: "2026-06-23T11:45:00Z"
  },
  {
    id: "msg-3",
    name: "Supreme Builders Ltd",
    email: "info@supremebuilders.ng",
    phone: "+234 812 345 6789",
    subject: "Inquiry on Construction Control Surveying",
    message: "We need Geodetic and Control Surveying services for a new estate development project along Ilorin-Ajase Ipo road. Please let us know the approved APPSN scale of fees for boundary beacon layout and topographic surveys in this zone.",
    status: "unread",
    createdAt: "2026-06-26T02:15:00Z"
  }
];

export const INITIAL_SURVEYORS: Surveyor[] = [
  {
    id: "surv-1",
    fullName: "Surv. Abdulraheem Kunle Bello, fnis",
    registrationNumber: "SURV/2008/112",
    phoneNumber: "+234 803 351 2345",
    email: "k.bello@bellosurveys.com",
    officeAddress: "Plot 12, Taiwo Road, Near General Hospital, Ilorin, Kwara State",
    lga: "Ilorin West",
    specialization: "Cadastral & Boundary Surveying",
    yearsOfExperience: 18,
    profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
    aboutMe: "Surv. Abdulraheem Kunle Bello is a veteran Fellow of the Nigerian Institution of Surveyors (fnis). He serves as the Principal Consultant at Bello & Associates Surveying Firm. With nearly two decades of experience, he specializes in high-precision cadastral surveys, land title processing, and dispute-free boundary layouts across Kwara and surrounding states."
  },
  {
    id: "surv-2",
    fullName: "Surv. Mrs. Toyin Florence Adebayo, mnis",
    registrationNumber: "SURV/2012/245",
    phoneNumber: "+234 806 720 9811",
    email: "toyin.adebayo@spatialsolutions.com",
    officeAddress: "Block D, Heritage Plaza, Fate Road, Ilorin, Kwara State",
    lga: "Ilorin South",
    specialization: "GIS, Digital Mapping & Spatial Analysis",
    yearsOfExperience: 14,
    profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-02-15T09:30:00Z",
    aboutMe: "Surv. Mrs. Toyin Florence Adebayo is an advocate for women in geospatial technology and a registered surveyor. Her passion lies in transforming physical surveying data into intelligent Geographic Information Systems (GIS). She has handled large-scale urban mapping projects and digital land registers for both municipal governments and corporate developers."
  },
  {
    id: "surv-3",
    fullName: "Surv. Abubakar Mustapha, mnis",
    registrationNumber: "SURV/2015/389",
    phoneNumber: "+234 813 440 1234",
    email: "a.mustapha@edusurveys.com",
    officeAddress: "Opposite High Court, Patigi-Edu Road, Lafiagi, Kwara State",
    lga: "Edu",
    specialization: "Engineering & Construction Surveying",
    yearsOfExperience: 11,
    profilePhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-03-01T14:20:00Z",
    aboutMe: "Surv. Abubakar Mustapha focuses on infrastructure, engineering support, and heavy civil construction alignment. Based in Lafiagi, he plays a key role in route mapping, pipeline alignments, and structural monitoring. His team utilizes high-end Trimble robotic total stations to deliver millimetric accuracy."
  },
  {
    id: "surv-4",
    fullName: "Surv. Dr. Olusegun Michael Taiwo, mnis",
    registrationNumber: "SURV/2003/054",
    phoneNumber: "+234 802 445 6677",
    email: "segun.taiwo@geotech-ng.com",
    officeAddress: "5, APPSN Close, Omu-Aran Road, Ajase-Ipo, Kwara State",
    lga: "Irepodun",
    specialization: "Geodetic Surveying & GNSS Control",
    yearsOfExperience: 23,
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-01-05T08:00:00Z",
    aboutMe: "Dr. Olusegun Michael Taiwo combines academic depth with extensive fieldwork. A specialist in Geodetic Networks, GNSS observation, and tectonic crustal deformation, he has established fundamental geodetic benchmarks in Kwara State. He is currently an advisor to the national space research committee."
  },
  {
    id: "surv-5",
    fullName: "Surv. Chidi Kingsley Nwachukwu, mnis",
    registrationNumber: "SURV/2018/512",
    phoneNumber: "+234 905 111 8899",
    email: "chidi.kingsley@dronesurvey.ng",
    officeAddress: "Avenue Mall, Sango Area, Ilorin, Kwara State",
    lga: "Ilorin East",
    specialization: "Remote Sensing & Drone Photogrammetry",
    yearsOfExperience: 8,
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-04-12T11:10:00Z",
    aboutMe: "Surv. Chidi Kingsley Nwachukwu is a forward-thinking surveyor specializing in unmanned aerial vehicle (UAV) photogrammetry and remote sensing. He provides rapid, high-resolution orthophotos, digital elevation models (DEM), and volumetric reports for large farms and open-pit mines across North Central Nigeria."
  },
  {
    id: "surv-6",
    fullName: "Surv. Alhaji Yekini Gbadamosi, fnis",
    registrationNumber: "SURV/1999/012",
    phoneNumber: "+234 803 555 9012",
    email: "y.gbadamosi@offasurveys.com",
    officeAddress: "32, Ibrahim Taiwo Road, Offa, Kwara State",
    lga: "Offa",
    specialization: "Cadastral & Boundary Surveying",
    yearsOfExperience: 27,
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-01-02T10:00:00Z",
    aboutMe: "Alhaji Yekini Gbadamosi is one of the foundational private practicing surveyors in Offa and Oyun LGAs. Over his 27-year career, he has surveyed thousands of hectares, earning a stellar reputation for boundary accuracy, clean records with the Ministry of Lands, and mentoring younger generations of surveyors."
  },
  {
    id: "surv-7",
    fullName: "Surv. Kehinde Joseph Olorunsola, mnis",
    registrationNumber: "SURV/2021/680",
    phoneNumber: "+234 815 667 8890",
    email: "k.olorunsola@apexgeospatial.com",
    officeAddress: "Plot 8, Erin-Ile Road, Ilemona, Kwara State",
    lga: "Oyun",
    specialization: "Engineering & Construction Surveying",
    yearsOfExperience: 5,
    profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-05-20T16:45:00Z",
    aboutMe: "Surv. Kehinde Joseph Olorunsola represents the vibrant next generation of private practitioners. Focused on digital construction, concrete layout control, and vertical engineering alignment, he uses state-of-the-art GNSS RTK and CAD platforms to deliver swift, modern results."
  },
  {
    id: "surv-8",
    fullName: "Surv. Aminat Bukola Shittu, mnis",
    registrationNumber: "SURV/2019/578",
    phoneNumber: "+234 703 112 3456",
    email: "a.shittu@geovision.ng",
    officeAddress: "Moro Junction, Jebba Road, Shao, Kwara State",
    lga: "Moro",
    specialization: "GIS, Digital Mapping & Spatial Analysis",
    yearsOfExperience: 7,
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    isActive: true,
    createdAt: "2026-03-18T10:15:00Z",
    aboutMe: "Surv. Aminat Bukola Shittu is a registered GIS and Mapping expert. Situated at the Shao/Jebba industrial axis in Moro LGA, she works heavily with agricultural cooperatives, planning departments, and transport companies to design and implement smart logistics routing and cadastral land assets."
  }
];

export const INITIAL_EXECUTIVES: Executive[] = [
  {
    id: "1ea52925-5126-45ae-babf-3ec717bf6b55",
    full_name: "Surv. Funsho-Salawu Ayodeji",
    position: "Chairman",
    profile_image: "https://res.cloudinary.com/dc6tajmzv/image/upload/v1782755714/a558eoko81s5c4kms897.jpg",
    bio: "Leading APPSN Kwara State Branch to maintain professional surveying excellence, promote ethical land administration, and eradicate quackery across all 16 Local Government Areas.",
    display_order: 1
  },
  {
    id: "3d3984d9-a54a-4e66-ab90-22628ded7b03",
    full_name: "Surv. (Alh) S.K Adebayo",
    position: "Vice Chairman",
    profile_image: "https://res.cloudinary.com/dc6tajmzv/image/upload/v1782827105/hzcjjzak8em8ortyae8p.jpg",
    bio: "Committed to fostering professional unity, member development, and transparent cadastral quality standards throughout Kwara State.",
    display_order: 2
  },
  {
    id: "be73e676-3e14-4c91-9023-cd50e96de64b",
    full_name: "Surv. Samuel O. Muyiwa",
    position: "Secretary",
    profile_image: "https://res.cloudinary.com/dc6tajmzv/image/upload/v1782904207/si2izzvn6p9boojhhlms.jpg",
    bio: "Coordinating branch secretariat operations, official registry records, and citizen inquiries to ensure verified surveying practice.",
    display_order: 3
  }
];

export const INITIAL_AIMS_OBJECTIVES: AimObjective[] = [
  {
    id: "aim-1",
    title: "Representation & Welfare",
    description: "Represent and promote the views, interests, and professional welfare of private practicing surveyors in Nigeria.",
    icon: "ShieldCheck",
    display_order: 1,
    is_active: true
  },
  {
    id: "aim-2",
    title: "Ethics & Integrity",
    description: "Uphold the highest standards of professionalism, ethics, integrity, and discipline within the profession.",
    icon: "Award",
    display_order: 2,
    is_active: true
  },
  {
    id: "aim-3",
    title: "Capacity Building & CPD",
    description: "Strengthen the surveying and geoinformatics industry through capacity building, continuous professional development, seminars, workshops, symposia, and publications.",
    icon: "BookOpen",
    display_order: 3,
    is_active: true
  },
  {
    id: "aim-4",
    title: "Member Interests Protection",
    description: "Protect the economic, political, social, and professional interests of members.",
    icon: "Scale",
    display_order: 4,
    is_active: true
  },
  {
    id: "aim-5",
    title: "Collaboration & Unity",
    description: "Foster collaboration, unity, and strong relationships among members and with other professional organizations, both within Nigeria and internationally.",
    icon: "Users",
    display_order: 5,
    is_active: true
  },
  {
    id: "aim-6",
    title: "Global Knowledge Exchange",
    description: "Encourage the free exchange of ideas, knowledge, and best practices with similar professional bodies worldwide.",
    icon: "Globe",
    display_order: 6,
    is_active: true
  },
  {
    id: "aim-7",
    title: "Advisory to Institutions",
    description: "Advise the Nigerian Institution of Surveyors (NIS), educational institutions, and government on matters relating to surveying and geoinformatics.",
    icon: "Landmark",
    display_order: 7,
    is_active: true
  },
  {
    id: "aim-8",
    title: "Student Mentorship",
    description: "Mentor surveying students and support the development of future professionals.",
    icon: "GraduationCap",
    display_order: 8,
    is_active: true
  },
  {
    id: "aim-9",
    title: "Safeguarding Practice",
    description: "Promote and safeguard the interests of private practicing surveyors in all areas of professional practice.",
    icon: "Shield",
    display_order: 9,
    is_active: true
  },
  {
    id: "aim-10",
    title: "Scale of Fees & Practice Guidelines",
    description: "Develop, review, and implement professional fees and practice guidelines in collaboration with relevant professional and regulatory bodies at both the state and national levels.",
    icon: "FileCheck",
    display_order: 10,
    is_active: true
  }
];

export const EXECUTIVE_COMMITTEE = INITIAL_EXECUTIVES.map(e => ({
  role: e.position,
  name: e.full_name,
  image: e.profile_image,
  msg: e.bio
}));

export const INITIAL_SERVICES: import('./types').ServiceItem[] = [
  {
    id: 'boundary',
    name: 'Land Ownership & Boundary',
    shortDesc: 'Precise boundary delineation, beacon layout, and perimeter validation to safeguard title ownership.',
    fullDesc: 'Boundary and perimeter determination using high-precision GNSS RTK and total station instrumentation. Essential for land acquisition, dispute prevention, and title perfection with the Kwara State Ministry of Housing & Urban Development.',
    useCase: 'Residential land acquisition, perimeter fencing, farm demarcations, and perimeter disputes resolution.',
    iconName: 'Compass',
    display_order: 1,
    is_active: true
  },
  {
    id: 'topographic',
    name: 'Topographic Survey',
    shortDesc: 'Contour generation, natural elevation mapping, and relief detail for architecture and civil works.',
    fullDesc: 'Comprehensive mapping of natural and man-made site features, ground contours, slope variations, and terrain elevations to assist architects, structural engineers, and site planners.',
    useCase: 'Commercial estate planning, road design, flood risk modelling, and agricultural slope analysis.',
    iconName: 'Mountain',
    display_order: 2,
    is_active: true
  },
  {
    id: 'setting-out',
    name: 'Construction Setting Out',
    shortDesc: 'Transferring architectural blueprints directly to ground coordinates with millimetric precision.',
    fullDesc: 'Accurate stakeout of building baselines, foundation piers, column grid centers, road alignments, and drainage conduits straight from structural engineering drawings to physical site pegs.',
    useCase: 'High-rise foundations, bridge piers, road corridors, factory alignments, and retaining walls.',
    iconName: 'Home',
    display_order: 3,
    is_active: true
  },
  {
    id: 'gis-mapping',
    name: 'GIS & Mapping',
    shortDesc: 'Spatial database development, thematic map generation, and geo-analytical decision intelligence.',
    fullDesc: 'Integration of geographic data, spatial asset layers, satellite rasters, and demographic info into enterprise Geographic Information Systems for local governments, utility providers, and investors.',
    useCase: 'Municipal revenue mapping, utility asset management, logistics route planning, and land use zoning.',
    iconName: 'Map',
    display_order: 4,
    is_active: true
  },
  {
    id: 'hydrographic',
    name: 'Hydrographic Survey',
    shortDesc: 'Bathymetric depth sounding, watercourse profiling, and riverbed sediment contouring.',
    fullDesc: 'Underwater topography and waterbed elevation mapping across the River Niger, Asa River, and related water reservoirs in Kwara State for maritime navigation, dredging, and dam maintenance.',
    useCase: 'Bridge pier water clearance, river dredging volume calculation, dam siltation checks, and floodplains.',
    iconName: 'Waves',
    display_order: 5,
    is_active: true
  },
  {
    id: 'route-survey',
    name: 'Route & Corridor Survey',
    shortDesc: 'Linear alignment profiling for highways, high-voltage transmission, and municipal water mains.',
    fullDesc: 'Longitudinal profile leveling, cross-section staking, and right-of-way easement survey for roads, pipelines, irrigation channels, and rail tracks across urban and rural Kwara corridors.',
    useCase: 'Highway corridor design, pipeline right-of-way, overhead transmission corridors, and municipal drainage.',
    iconName: 'Crosshair',
    display_order: 6,
    is_active: true
  },
  {
    id: 'title-perfection',
    name: 'Survey Plan for C of O',
    shortDesc: 'Official survey plans drafted to strict SURCON & Kwara State Geographic Information Service (KW-GIS) standards.',
    fullDesc: 'Statutory cadastral lodgement, pillar coordinate computation, and preparation of original cloth plans strictly required for Governor Consent, Certificate of Occupancy (C of O), and registered conveyance.',
    useCase: 'Commercial bank mortgage collateral, deed of assignment registration, and statutory land registration.',
    iconName: 'FileCheck',
    display_order: 7,
    is_active: true
  },
  {
    id: 'dispute-resolution',
    name: 'Boundary Dispute Resolution',
    shortDesc: 'Authoritative boundary relocation, historical survey reconstitution, and expert courtroom witness.',
    fullDesc: 'Independent retracement surveys, overlapping title investigation, beacon re-establishment, and sworn expert witness documentation for traditional community arbitration and judicial dispute settlement.',
    useCase: 'Family boundary reconciliation, communal land boundary demarcation, and courtroom litigation.',
    iconName: 'ShieldCheck',
    display_order: 8,
    is_active: true
  }
];

export const INITIAL_VERIFICATION_PILLARS: import('./types').VerificationPillar[] = [
  {
    id: 'pillar-1',
    title: 'Legal Court Admissibility',
    description: 'Only survey plans prepared, signed, and sealed by SURCON-registered surveyors are recognized as legal evidence in Nigerian courts and Kwara State registries.',
    iconName: 'ShieldCheck',
    display_order: 1
  },
  {
    id: 'pillar-2',
    title: 'Authentic Surcon Seal & Beacons',
    description: 'Every genuine boundary demarcation is monumented with traceable survey beacons bearing registered surveyor identification and strict geodetic coordinates.',
    iconName: 'Stamp',
    display_order: 2
  },
  {
    id: 'pillar-3',
    title: 'Zero Tolerance for Quackery',
    description: 'Protect your hard-earned capital. Dealing with unregistered individuals invalidates land documentation and risks permanent title revocation by Kwara authorities.',
    iconName: 'AlertTriangle',
    display_order: 3
  },
  {
    id: 'pillar-4',
    title: 'KW-GIS & Ministry Approval',
    description: 'Only accredited APPSN practicing surveyors have authorized clearance for survey plan lodgement with the Kwara State Geographic Information Service (KW-GIS).',
    iconName: 'FileCheck',
    display_order: 4
  }
];

export const INITIAL_ABOUT_CONTENT: import('./types').AboutContent = {
  headlineBadge: '40+ Years of Dedicated Service',
  heroHeading: 'Association of Private Practicing Surveyors of Nigeria (APPSN)',
  leadParagraph: 'APPSN Kwara State Branch is the premier professional body of licensed, SURCON-accredited private practicing surveyors in Kwara State. For over four decades, our members have delivered boundary precision, cadastral integrity, and trusted land administration across all 16 Local Government Areas.',
  visionTitle: 'Our Vision',
  visionText: 'To build an orderly, legally secure, and technology-driven geospatial environment in Kwara State where land boundaries are indisputable, real estate investments thrive, and private surveying remains a trusted bedrock of societal planning.',
  missionTitle: 'Our Mission',
  missionText: 'To unite registered private practicing surveyors, foster peer collaboration, eliminate quackery through stringent public awareness, and guarantee that every survey document originating from our members meets the highest statutory requirements.',
  coreValuesTitle: 'Core Values',
  coreValuesText: 'Accuracy: Millimeter precision in every measurement.\nIntegrity: Honest, dispute-free boundary demarcation.\nEthics: Full compliance with SURCON standards & statutory fees.',
  heroPhoto: '/about_surveyor.jpg',
  yearsExperience: '40+ Years',
  yearsSubtitle: 'Certified SURCON Practitioners',
  secretariatAddress: 'Along Ikoyi Avenue, Off New Yidi Rd, Ilorin, Kwara State, Nigeria',
  secretariatPhone: '+234 803 502 5960',
  secretariatEmail: 'appsnkwara0@gmail.com'
};

export const INITIAL_SITE_SETTINGS: import('./types').SiteSettings = {
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.png',
  siteTitle: 'APPSN Kwara State - Official Directory of Registered Surveyors',
  tagline: 'TRUSTED / VERIFIED / PROFESSIONAL',
  branchName: 'APPSN Kwara State Branch',
  heroHeadline: 'Find a Registered Surveyor in Kwara',
  heroSubtitle: 'Connect with verified and registered practising surveyors across Kwara State. Get professional support for your land, property and construction needs.',
  phone: '+234 803 502 5960',
  email: 'appsnkwara0@gmail.com',
  address: 'Along Ikoyi Avenue, Off New Yidi Rd, Ilorin, Kwara State, Nigeria'
};
