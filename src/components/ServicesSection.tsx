import React from 'react';
import { 
  Compass, 
  Mountain, 
  Home, 
  Map, 
  Waves, 
  Crosshair, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface ServicesSectionProps {
  onExploreAll?: () => void;
  onSelectService?: (serviceName: string) => void;
  isFullPage?: boolean;
}

export const SURVEYING_SERVICES = [
  {
    id: 'boundary',
    name: 'Land Ownership & Boundary',
    icon: Compass,
    shortDesc: 'Precise boundary delineation, beacon layout, and perimeter validation to safeguard title ownership.',
    fullDesc: 'Boundary and perimeter determination using high-precision GNSS RTK and total station instrumentation. Essential for land acquisition, dispute prevention, and title perfection with the Kwara State Ministry of Housing & Urban Development.',
    useCase: 'Residential land acquisition, perimeter fencing, farm demarcations, and perimeter disputes resolution.'
  },
  {
    id: 'topographic',
    name: 'Topographic Survey',
    icon: Mountain,
    shortDesc: 'Contour generation, natural elevation mapping, and relief detail for architecture and civil works.',
    fullDesc: 'Comprehensive mapping of natural and man-made site features, ground contours, slope variations, and terrain elevations to assist architects, structural engineers, and site planners.',
    useCase: 'Commercial estate planning, road design, flood risk modelling, and agricultural slope analysis.'
  },
  {
    id: 'setting-out',
    name: 'Construction Setting Out',
    icon: Home,
    shortDesc: 'Transferring architectural blueprints directly to ground coordinates with millimetric precision.',
    fullDesc: 'Accurate stakeout of building baselines, foundation piers, column grid centers, road alignments, and drainage conduits straight from structural engineering drawings to physical site pegs.',
    useCase: 'High-rise foundations, bridge piers, road corridors, factory alignments, and retaining walls.'
  },
  {
    id: 'gis-mapping',
    name: 'GIS & Mapping',
    icon: Map,
    shortDesc: 'Spatial database development, thematic map generation, and geo-analytical decision intelligence.',
    fullDesc: 'Integration of geographic data, spatial asset layers, satellite rasters, and demographic info into enterprise Geographic Information Systems for local governments, utility providers, and investors.',
    useCase: 'Municipal revenue mapping, utility asset management, logistics route planning, and land use zoning.'
  },
  {
    id: 'hydrographic',
    name: 'Hydrographic Survey',
    icon: Waves,
    shortDesc: 'Bathymetric depth sounding, watercourse profiling, and riverbed sediment contouring.',
    fullDesc: 'Underwater topography and waterbed elevation mapping across the River Niger, Asa River, and related water reservoirs in Kwara State for maritime navigation, dredging, and dam maintenance.',
    useCase: 'Bridge pier water clearance, river dredging volume calculation, dam siltation checks, and floodplains.'
  },
  {
    id: 'aerial-drone',
    name: 'Aerial Survey & Drone Mapping',
    icon: Crosshair,
    shortDesc: 'High-resolution drone orthomosaics, photogrammetric 3D point clouds, and LiDAR elevation models.',
    fullDesc: 'Rapid large-acreage photogrammetric capture deploying certified UAV aircraft to produce high-density 3D digital surface models (DSM) and orthorectified aerial mosaics.',
    useCase: 'Commercial plantations, mining quarries, corridor mapping, and urban master planning.'
  },
  {
    id: 'property-verification',
    name: 'Property Boundary Verification',
    icon: ShieldCheck,
    shortDesc: 'SURCON beacon authenticity checks, government acquisition status verification, and coordinate checks.',
    fullDesc: 'Pre-purchase due diligence verifying whether land is free from government acquisitions, forest reserves, agricultural overrides, or counterfeit beacon coordinates.',
    useCase: 'Pre-purchase due diligence, corporate investment security, estate partition, and legal land searches.'
  },
  {
    id: 'survey-plan',
    name: 'Survey Plan Preparation',
    icon: FileCheck,
    shortDesc: 'SURCON-sealed survey plans compliant with Kwara State Geographic Information Service (KW-GIS).',
    fullDesc: 'Official survey drafting, beacon charting, and lodgement with the Office of the Surveyor General of Kwara State to produce authentic survey plans eligible for Certificate of Occupancy (C of O).',
    useCase: 'Governor’s Consent, C of O processing, bank loan collateralization, and registered deed of transfer.'
  }
];

export default function ServicesSection({ onExploreAll, onSelectService, isFullPage = false }: ServicesSectionProps) {
  return (
    <section className={`py-16 sm:py-24 ${isFullPage ? 'bg-white' : 'bg-[#FAF9F5]'} border-b border-slate-200/70`} id="appsn-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#0D3829] font-mono block">
              — OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B251D] tracking-tight leading-tight">
              Professional Surveying Solutions <br className="hidden sm:inline" />
              for a Better Tomorrow
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1">
              We provide accurate, reliable and timely surveying solutions for individuals, businesses and government institutions across Kwara State.
            </p>
          </div>

          {!isFullPage && onExploreAll && (
            <button
              onClick={onExploreAll}
              id="services-explore-all-btn"
              className="inline-flex items-center gap-2 bg-[#0D3829] hover:bg-[#08281D] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-xs hover:shadow-md transition-all duration-200 shrink-0 cursor-pointer self-start md:self-auto group"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* 8-Card Grid (4 cols on lg, 2 cols on md, 1 col on sm) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SURVEYING_SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                onClick={() => onSelectService && onSelectService(service.name)}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-900/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF4F0] text-[#0D3829] flex items-center justify-center mb-5 group-hover:bg-[#0D3829] group-hover:text-white transition-colors duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#0D3829] transition-colors">
                    {service.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed font-normal">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Optional full details on full services page */}
                {isFullPage && (
                  <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                    <p className="font-medium text-slate-700">{service.fullDesc}</p>
                    <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/70 text-[11px] text-[#0D3829] font-medium flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Key Application:</strong> {service.useCase}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
