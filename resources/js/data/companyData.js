/**
 * Company Profile & Statistics Mock Data
 * Structure matches future Laravel API: GET /api/v1/company-profile or /api/v1/settings
 */
export const companyProfile = {
  name: "Ciplon Pharma Private Limited",
  legalName: "Ciplon Pharma Private Limited",
  shortName: "Ciplon Pharma",
  tagline: "Committed to Healthcare Excellence",
  logoUrl: "/images/ciplon_logo.png",
  logo_url: "/images/ciplon_logo.png",
  description: "An ISO 9001: 2015 certified company dedicated to marketing high-quality, accessible healthcare formulations across diverse therapeutic areas.",
  foundedYear: 2024,
  headquarters: "M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi, New Delhi, Delhi, India - 110025",
  email: "info@ciplonpharma.in",
  enquiriesEmail: "info@ciplonpharma.in",
  website: "https://www.ciplonpharma.in",
  fssaiLicNo: "10426340000172",
  trademarkStatus: "TM-Trademark Under Registration",
  isoCertification: "An ISO 9001: 2015 certified company",
  manufacturer: {
    name: "WALPAR WELLNESS PVT.LTD.",
    certification: "WHO-GMP & An ISO 9001 : 2015 Certified Company",
    address: "PLOT NO.2/A & 06, OPP, SABARMATI GAS STATION, KHATRAJ, KALOL, GANDHINAGAR., Gujarat-382721"
  },
  
  stats: [
    {
      id: "stat-products",
      value: "180+",
      label: "Pharmaceutical Formulations",
      subtext: "Across solid, liquid, and semi-solid dosage forms"
    },
    {
      id: "stat-therapeutic",
      value: "12+",
      label: "Therapeutic Areas",
      subtext: "Covering acute and chronic medical indications"
    },
    {
      id: "stat-experience",
      value: "20+",
      label: "Years of Excellence",
      subtext: "Committed to scientific precision and safety"
    },
    {
      id: "stat-markets",
      value: "45+",
      label: "Distribution Markets",
      subtext: "Serving global healthcare partners and institutions"
    }
  ],

  corePillars: [
    {
      id: "quality",
      title: "Quality by Design",
      description: "Rigorous analytical testing, in-process controls, and continuous verification at every phase of pharmaceutical manufacturing.",
      iconName: "ShieldCheck"
    },
    {
      id: "innovation",
      title: "Scientific Innovation",
      description: "Dedicated formulation development and stability studies to enhance drug bio-availability and therapeutic performance.",
      iconName: "Microscope"
    },
    {
      id: "integrity",
      title: "Regulatory Integrity",
      description: "Strict adherence to Good Manufacturing and Good Laboratory Practices with full audit-trail compliance and traceability.",
      iconName: "FileCheck"
    },
    {
      id: "patient-focus",
      title: "Patient-Centric Care",
      description: "Every formulation is engineered with safety, consistent efficacy, and accessible healthcare solutions in mind.",
      iconName: "HeartHandshake"
    }
  ]
};

