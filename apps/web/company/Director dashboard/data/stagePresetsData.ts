export interface StageItem {
  order: number;
  title: string;
  evidence: string;
  weightPercent?: number;
}

export interface StagePreset {
  id: string;
  name: string;
  category:
    | "Residential"
    | "Commercial"
    | "Infrastructure"
    | "Industrial"
    | "Specialized";
  stagesCount: number;
  typicalDuration: string;
  description: string;
  isCustom?: boolean;
  isModified?: boolean;
  source?: "platform" | "admin" | "company";
  stages: StageItem[];
}

export const BUILT_IN_PLATFORM_PRESETS: StagePreset[] = [
  {
    id: "preset_duplex",
    name: "4-Bedroom Detached Duplex (Standard Nigerian Typology)",
    category: "Residential",
    stagesCount: 7,
    typicalDuration: "6 to 9 Months",
    description:
      "Standard residential milestone framework with foundation soil signoff, casting cube tests, and roof covering stages.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Substructure & Foundation",
        evidence:
          "Excavation depth log, blind concrete photo, rebar cage inspection, cube compressive test result",
      },
      {
        order: 2,
        title: "Superstructure Frame (Ground Floor)",
        evidence:
          "Column formwork, lintel rebar inspection, German floor / slab casting photos",
      },
      {
        order: 3,
        title: "First Floor Suspended Slab & Columns",
        evidence:
          "Props and decking inspection, electrical conduit placement, concrete pour certificate",
      },
      {
        order: 4,
        title: "Roof Framing, Trusses & Covering",
        evidence:
          "Hardwood/steel truss alignment, aluminium/stone-coated sheet installation, rainwater gutter test",
      },
      {
        order: 5,
        title: "Wall Blockwork & External Plastering",
        evidence:
          "Wall plumb lines, lintels over openings, screeding & exterior rendering photos",
      },
      {
        order: 6,
        title: "MEP Rough-in & Piping Pressure Test",
        evidence:
          "PEX plumbing pressure gauge test, conduit wiring continuity, septic/soakaway installation",
      },
      {
        order: 7,
        title: "Architectural Finishes, Snagging & Handover",
        evidence:
          "Floor tiling, sanitary fixtures, doors/glazing, snagging resolution checklist",
      },
    ],
  },
  {
    id: "preset_bungalow",
    name: "3-Bedroom Bungalow (Suburban Residential)",
    category: "Residential",
    stagesCount: 5,
    typicalDuration: "4 to 6 Months",
    description:
      "Optimized residential flow for single-level construction with rapid milestone cycles.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Substructure, Trenching & DPC Slab",
        evidence: "Trench depth, hardcore compaction, DPC damp-proof membrane, slab pour",
      },
      {
        order: 2,
        title: "Blockwork to Lintel Level & Casting",
        evidence: "Plumb line alignment, lintel beam casting, door/window frame anchoring",
      },
      {
        order: 3,
        title: "Roof Carcass & Longspan Covering",
        evidence: "Truss spacing check, roofing sheet fastening, ceiling nogging installation",
      },
      {
        order: 4,
        title: "Plumbing, Electrical & Internal Screeding",
        evidence: "Conduit layout, pipe pressure test, wall plastering & floor screed",
      },
      {
        order: 5,
        title: "Finishes, Fittings & Key Handover",
        evidence: "Painting, tiling, sanitary ware, electrical fittings, final cleaning",
      },
    ],
  },
  {
    id: "preset_terrace_block",
    name: "Multi-Unit Terrace Housing Block (G+2 / 6 Units)",
    category: "Residential",
    stagesCount: 8,
    typicalDuration: "9 to 14 Months",
    description:
      "Multi-family high-density residential development with reinforced foundation piling, multiple suspended floors, communal utility rough-ins, and perimeter finishes.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Substructure & Deep Foundation Piling",
        evidence:
          "Piling rig depth logs, borehole soil test, pile cap rebar inspection, lean concrete blinding",
      },
      {
        order: 2,
        title: "Ground Floor Suspended Deck & Columns",
        evidence:
          "Beam reinforcement check, electrical conduit sleeve layout, concrete crush cube certificate (28-day)",
      },
      {
        order: 3,
        title: "Upper Floors Frame & Intermediate Decks",
        evidence:
          "Decking formwork props safety audit, stirrup spacing, slab pour inspection signoff",
      },
      {
        order: 4,
        title: "Roof Trusses & Longspan Aluminium Covering",
        evidence:
          "Anti-rot timber treatment check or steel truss weld test, aluminium gauge certificate, fascia board alignment",
      },
      {
        order: 5,
        title: "Sandcrete Blockwork & External Plastering",
        evidence:
          "Plumb line verticality report, lintel castings above door/window openings, external roughcast plaster",
      },
      {
        order: 6,
        title: "MEP Rough-in & Pressure Testing",
        evidence:
          "Water supply pressure gauge hold test (5 bar / 24 hrs), electrical conduit continuity, septic soakaway soak test",
      },
      {
        order: 7,
        title: "Interior POP Ceilings, Screeding & Glazing",
        evidence:
          "POP ceiling suspension wire inspection, wall screeding smoothness check, anodized aluminium window latching",
      },
      {
        order: 8,
        title: "Finishes, Interlocking Compound & Commissioning",
        evidence:
          "Floor tiling leveling, sanitary ware seal test, estate transformer energization, client snagging signoff",
      },
    ],
  },
  {
    id: "preset_commercial_plaza",
    name: "Commercial Office Complex & Retail Plaza (Mid-Rise G+4)",
    category: "Commercial",
    stagesCount: 8,
    typicalDuration: "12 to 18 Months",
    description:
      "Multi-tenant commercial center framework with reinforced elevator shafts, central HVAC rough-in, curtain wall facade, and statutory fire compliance.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Site Demolition, Piling & Raft Foundation",
        evidence:
          "Bored pile depth logs, pile integrity testing (PIT), rebar mesh inspection, raft concrete batch records",
      },
      {
        order: 2,
        title: "RC Shear Walls, Columns & Post-Tensioned Slabs",
        evidence:
          "Shear wall formwork plumbness, tendon elongation logs, cube compressive strength certificates",
      },
      {
        order: 3,
        title: "Curtain Wall Facade, Glazing & External Cladding",
        evidence:
          "Aluminium mullion wind-load anchoring, tempered safety glass certificates, silicone weather-seal test",
      },
      {
        order: 4,
        title: "Central HVAC, Fire Suppression & Sprinkler Grid",
        evidence:
          "Chilled water pipe hydrostatic pressure test, ductwork smoke damper inspection, fire pump installation test",
      },
      {
        order: 5,
        title: "Electrical Substation, Transformer & Standby Power",
        evidence:
          "High-voltage cable megger insulation tests, ATS panel switching logs, grounding earth resistance (<2 ohms)",
      },
      {
        order: 6,
        title: "Passenger Lifts & Vertical Circulation",
        evidence:
          "Elevator shaft plumb report, car safety brake drop test, emergency recall sensor signoff",
      },
      {
        order: 7,
        title: "Public Restrooms, Lobby Granite & Tenant Demarcation",
        evidence:
          "Common area floor tiling levelness, acoustic drywall partitions, emergency exit signage",
      },
      {
        order: 8,
        title: "Final Commissioning, Statutory Fire & Handover",
        evidence:
          "State Fire Service safety certificate, occupancy permit signoff, operation manuals delivery",
      },
    ],
  },
  {
    id: "preset_mep",
    name: "Commercial MEP & Systems Retrofit",
    category: "Commercial",
    stagesCount: 4,
    typicalDuration: "2 to 3 Months",
    description:
      "Dedicated mechanical, electrical, and plumbing staging with engineering certification requirements.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Site Surveys & Equipment Procurements",
        evidence: "BOQ verification, manufacturer datasheets, equipment delivery receipts",
      },
      {
        order: 2,
        title: "Piping, Trunking & Containment Installation",
        evidence: "Cable tray routing, pipe support brackets, fire damper rough-in",
      },
      {
        order: 3,
        title: "Cabling, Panel Terminations & Testing",
        evidence: "Megger insulation resistance test, panel distribution schedule, pump alignment",
      },
      {
        order: 4,
        title: "Commissioning & COREN Engineering Signoff",
        evidence: "Integrated testing certificate, operation manuals, statutory compliance signoff",
      },
    ],
  },
  {
    id: "preset_estate_road",
    name: "Estate Access Road & Reinforced Stormwater Drainage",
    category: "Infrastructure",
    stagesCount: 5,
    typicalDuration: "3 to 5 Months",
    description:
      "Civil works template for private estate road paving, reinforced stormwater culverts, stone base compaction, and solar streetlighting.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Site Clearing, Topsoil Stripping & Sub-Grade Compaction",
        evidence:
          "Surveyor centerline GPS benchmarks, California Bearing Ratio (CBR) soil test, sub-grade nuclear density test",
      },
      {
        order: 2,
        title: "Concrete Box Culverts & U-Drain Channels",
        evidence:
          "Drain invert levels check, culvert rebar spacing, precast drain cover load certificates",
      },
      {
        order: 3,
        title: "Crushed Granite Stone Base & Prime Coat",
        evidence:
          "Stone aggregate grading sieve analysis, prime coat bitumen spray rate test, rolling pass compaction",
      },
      {
        order: 4,
        title: "Heavy-Duty Interlocking Paving Stones / Asphalt Surfacing",
        evidence:
          "80mm heavy-duty paver crushing strength (>=45 MPa), sand bed leveling, asphalt core temperature & thickness test",
      },
      {
        order: 5,
        title: "Solar Streetlight Poles, Kerb Painting & Signage",
        evidence:
          "Galvanized pole footing depth, solar battery storage autonomy check, thermoplastic road marking reflectivity",
      },
    ],
  },
  {
    id: "preset_perimeter_wall",
    name: "Perimeter Security Enclosure & Automated Gatehouse",
    category: "Infrastructure",
    stagesCount: 4,
    typicalDuration: "3 to 6 Weeks",
    description:
      "Rapid security perimeter framework covering trenching, reinforced stiffener pillars, anti-climb electric wiring, and motorized access gate.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Boundary Trenching, Lean Concrete & Strip Footing",
        evidence:
          "Cadastral survey boundary beacon verification, footing trench depth photo, starter rebar bars",
      },
      {
        order: 2,
        title: "Sandcrete Blockwork & Reinforced Stiffener Columns",
        evidence:
          "Vibrated sandcrete block test, vertical column stirrup ties every 3 meters, lintel beam casting",
      },
      {
        order: 3,
        title: "Concrete Wall Coping, Razor Wire & Electric Fencing",
        evidence:
          "Water-drip coping mold inspection, concertina razor wire bracket welds, electric fence energizer voltage test",
      },
      {
        order: 4,
        title: "Security Gatehouse, Automated Vehicular Gate & Turnstile",
        evidence:
          "Gatehouse roof & glazing, heavy-duty track roller alignment, motor remote transmitter testing",
      },
    ],
  },
  {
    id: "preset_warehouse",
    name: "Industrial Warehouse & Steel Portal Frame Logistics Shed",
    category: "Industrial",
    stagesCount: 6,
    typicalDuration: "4 to 6 Months",
    description:
      "Industrial logistics template covering column pad footings, pre-engineered steel frames, high-load industrial floors, and loading bays.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Earthworks, Isolated Column Bases & Anchor Bolts",
        evidence:
          "Plate bearing soil load test, anchor bolt template alignment survey, high-strength grouting under baseplates",
      },
      {
        order: 2,
        title: "Pre-Engineered Steel Portal Frames & Purlins",
        evidence:
          "Mill test certificates, ultrasonic weld testing on rafter joints, high-tensile torque wrench log",
      },
      {
        order: 3,
        title: "Insulated Wall & Roof Cladding Panels",
        evidence:
          "Aluzinc insulated sandwich panels, translucent skylight sheet alignment, rain gutter slope test",
      },
      {
        order: 4,
        title: "Laser-Screeded High-Tolerance Floor Slab",
        evidence:
          "Vapour barrier membrane, dual-layer BRC wire mesh, dry-shake quartz surface hardener, saw-cut joints",
      },
      {
        order: 5,
        title: "High-Bay LED Lighting, Industrial Power & Fire Mains",
        evidence:
          "Three-phase busbar trunking, emergency luminaire lux meter reading, fire hose reel flow test",
      },
      {
        order: 6,
        title: "Hydraulic Dock Levelers, Industrial Roller Doors & Handover",
        evidence:
          "Dock bumper installation check, motorized roller shutter cycle test, perimeter apron concrete pour",
      },
    ],
  },
  {
    id: "preset_swimming_pool",
    name: "Reinforced Concrete Swimming Pool & Leisure Deck",
    category: "Specialized",
    stagesCount: 4,
    typicalDuration: "6 to 10 Weeks",
    description:
      "Specialized aquatic construction template requiring hydrostatic water tightness testing, mosaic tiling, and recirculating pumps.",
    source: "platform",
    stages: [
      {
        order: 1,
        title: "Excavation, Blinding & Double-Layer Rebar Cage",
        evidence:
          "Excavation profile check, lean concrete blinding, anti-rust rebar mesh, main drain pot embeds",
      },
      {
        order: 2,
        title: "Waterproof Monolithic Concrete Shell & Water Test",
        evidence:
          "Concrete waterproofing admixture docket, pneumatic vibrator pour log, 72-hour hydrostatic water test report",
      },
      {
        order: 3,
        title: "Hydraulic Plumbing, Filtration & Pump Room",
        evidence:
          "Schedule 40 PVC pipe pressure test, sand filter media loading, chlorinator and pump wiring",
      },
      {
        order: 4,
        title: "Glass Mosaic Tiling, Non-Slip Coping & Underwater LED",
        evidence:
          "Epoxy pool grout inspection, bullnose granite coping levelness, 12V transformer underwater lighting signoff",
      },
    ],
  },
];
