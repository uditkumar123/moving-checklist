// Kanata to Stittsville Moving Checklist - Detailed Tasks Database
const defaultChecklist = [
  // --- PRE-MOVE PREP (NOW TO MAY 31) ---
  {
    id: "pre-rent-june",
    title: "Pay June 2026 Rent",
    description: "Pay the full monthly lawful rent of $2,600.00 to Anastasya and Gennady Peymer in the ordinary course. (As agreed in Section 5 of Cash for Keys agreement).",
    category: "finance",
    timeframe: "pre-move",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "pre-book-movers",
    title: "Book Movers or Rent Truck",
    description: "Secure your moving date (e.g., June 1st for big items, or mid-overlap). Get quotes from Ottawa moving companies (e.g., First Rate Movers, Ottawa Moving Advisors) or rent a U-Haul truck from Kanata locations.",
    category: "logistics",
    timeframe: "pre-move",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "pre-hydro-ottawa",
    title: "Transfer Hydro Ottawa Service",
    description: "Log in to your Hydro Ottawa portal. Set up a move-out date of June 15 for 239 Tandalee Crescent, and a move-in date of June 1 for your new Stittsville address. Save confirmation numbers.",
    category: "utilities",
    timeframe: "pre-move",
    isImportant: true,
    isOttawaSpecific: true
  },
  {
    id: "pre-enbridge-gas",
    title: "Transfer Enbridge Gas Service",
    description: "Contact Enbridge Gas to schedule the gas account transfer. Close the Tandalee Crescent account on June 15, and open the Stittsville account on June 1.",
    category: "utilities",
    timeframe: "pre-move",
    isImportant: true,
    isOttawaSpecific: true
  },
  {
    id: "pre-internet-transfer",
    title: "Schedule Internet/TV Move (Rogers/Bell)",
    description: "Call Rogers or Bell to schedule a technician installation at the new Stittsville home on June 1. Request to keep internet running at Tandalee Crescent until June 15 if you need it while cleaning.",
    category: "utilities",
    timeframe: "pre-move",
    isImportant: false,
    isOttawaSpecific: true
  },
  {
    id: "pre-declutter-sorting",
    title: "Declutter and Sort Tandalee Home",
    description: "Go room by room. Categorize items: Keep, Sell, Donate, Toss. Donate items to local Ottawa charities (Matthew House, Habitat ReStore on Iber Road in Stittsville, or Kanata Salvation Army).",
    category: "packing",
    timeframe: "pre-move",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "pre-supplies",
    title: "Gather Packing Supplies",
    description: "Buy or collect boxes, bubble wrap, packing tape, and markers. Tip: Check Ottawa classifieds (Kijiji, Facebook Marketplace) for free moving boxes, or buy them at Home Depot on Terry Fox Drive.",
    category: "packing",
    timeframe: "pre-move",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "pre-pack-nonessentials",
    title: "Pack Non-Essential Items First",
    description: "Pack off-season clothing, books, decorative items, guest room supplies, and infrequently used kitchenware. Clearly label boxes with their destination rooms in the new house.",
    category: "packing",
    timeframe: "pre-move",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "pre-home-insurance",
    title: "Setup Stittsville Home Insurance & Transfer",
    description: "Contact your insurance broker. Arrange home insurance coverage for the new Stittsville property effective June 1. Extend your tenant insurance for Tandalee Crescent until June 15 at 6:00 PM.",
    category: "finance",
    timeframe: "pre-move",
    isImportant: true,
    isOttawaSpecific: false
  },

  // --- OVERLAP PERIOD (JUNE 1 - JUNE 14) ---
  {
    id: "overlap-keys-new",
    title: "Collect Keys for Stittsville House (June 1)",
    description: "Receive the keys to your new house from your lawyer or builder. Verify closing documents are completed.",
    category: "logistics",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "overlap-inspection-new",
    title: "Inspect the Stittsville House (June 1)",
    description: "Walk through the empty Stittsville house. Take high-resolution photos of every room, wall, appliance, and window to document the initial condition. Test light switches and water taps.",
    category: "logistics",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "overlap-change-locks",
    title: "Change Locks on New House",
    description: "For safety, change all exterior deadbolts at your new house on June 1. Program new codes for the garage door openers.",
    category: "logistics",
    timeframe: "overlap",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "overlap-meters-new",
    title: "Record Meter Readings at New House",
    description: "Locate and read the electricity (Hydro Ottawa), gas (Enbridge), and water meters at the Stittsville house. Take photos of the dials for your records.",
    category: "utilities",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: true
  },
  {
    id: "overlap-city-water-tax",
    title: "Notify City of Ottawa (Water & Property Tax)",
    description: "Register your new Stittsville property water account and property tax account with the City of Ottawa. Set up pre-authorized payments if preferred. Request final water reading setup for Tandalee Crescent.",
    category: "utilities",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: true
  },
  {
    id: "overlap-mail-forwarding",
    title: "Set up Canada Post Mail Forwarding",
    description: "Purchase a 6-month or 12-month mail forwarding service from Canada Post, redirecting mail from 239 Tandalee Crescent, Ottawa, ON K2M 0A2 to your new Stittsville address.",
    category: "admin",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "overlap-service-ontario",
    title: "Update ServiceOntario (License, Health Card, Vehicle)",
    description: "Update your address online with ServiceOntario within 6 days of your move. This updates your Ontario Driver's License, Health Card (OHIP), and Vehicle Permits for free. New cards will be mailed to Stittsville.",
    category: "admin",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: true
  },
  {
    id: "overlap-address-banks",
    title: "Change Address with Banks and Credit Cards",
    description: "Update billing addresses for your credit cards and bank accounts (TD, RBC, CIBC, Scotiabank, BMO, etc.) to ensure statements and legal notices go to the correct home.",
    category: "admin",
    timeframe: "overlap",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "overlap-address-cra",
    title: "Update Address with CRA",
    description: "Log in to your CRA 'My Account' or call the Canada Revenue Agency to update your residential address. Important for tax documents and benefit payments (GST/HST credit, CCB, etc.).",
    category: "admin",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "overlap-address-work-sub",
    title: "Update Employer, Subscriptions, and Delivery Apps",
    description: "Change your address in employer portals, online shopping accounts (Amazon), delivery apps (UberEats, Instacart), and streaming/online services to prevent packages going to Tandalee.",
    category: "admin",
    timeframe: "overlap",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "overlap-remove-ring",
    title: "Remove Ring Camera & Reinstall Doorbell",
    description: "Uninstall the Ring video doorbell from the front door and replace it with the original standard doorbell before handover.",
    category: "utilities",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "overlap-nest-cover",
    title: "Reinstall Nest Thermostat Cover",
    description: "Ensure the original wall plate cover for the Nest thermostat is put back on the wall properly.",
    category: "utilities",
    timeframe: "overlap",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "overlap-bedroom-light",
    title: "Revert Bedroom Automatic Light Switch",
    description: "Remove the smart/automatic light switch in the bedroom and reinstall the original standard light switch.",
    category: "utilities",
    timeframe: "overlap",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "overlap-gradual-moving",
    title: "Gradually Move Boxes & Fragiles",
    description: "Utilize the 2-week overlap window. Pack and drive carloads of boxes, plants, delicate items, and clothes from Kanata to Stittsville. This reduces moving day stress.",
    category: "logistics",
    timeframe: "overlap",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "overlap-new-house-cleaning",
    title: "Deep Clean new Stittsville House",
    description: "Clean kitchen drawers, wipe inside closets, sanitize bathrooms, and steam clean/vacuum carpets in Stittsville *before* moving large furniture in.",
    category: "cleaning",
    timeframe: "overlap",
    isImportant: false,
    isOttawaSpecific: false
  },

  // --- HANDOVER DAY (JUNE 15 - BY 6:00 PM) ---
  {
    id: "handover-final-move",
    title: "Move Remaining Large Items & Furniture",
    description: "Ensure the last of your large furniture, electronics, and boxes are completely moved out of 239 Tandalee Crescent by morning.",
    category: "logistics",
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "handover-deep-clean",
    title: "Deep Clean 239 Tandalee Crescent",
    description: "Sweep, vacuum, mop all floors. Clean kitchen appliances inside/out (fridge, oven, dishwasher). Wipe countertops, cabinets, and bathroom fixtures. Remove all trash.",
    category: "cleaning",
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "handover-photo-proof",
    title: "Take Condition Photos of 239 Tandalee",
    description: "Take high-quality photos and a walkthrough video of the completely clean and empty rental unit (every room, appliances, walls) to prove the good condition of the property at handover.",
    category: "admin",
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "handover-read-meters",
    title: "Read Final Meters at 239 Tandalee",
    description: "Read gas (Enbridge), water (City of Ottawa), and electricity (Hydro Ottawa) meters. Take close-up photos of all meters. Provide these final numbers to utility companies for final bill closure.",
    category: "utilities",
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: true
  },
  {
    id: "handover-pack-access",
    title: "Gather All Access Items for Landlord",
    description: "Place all access items in a clear bag/box: front door keys, back door keys, mailbox keys, garage door openers/remotes, and fobs. (Required by Section 4 of Agreement).",
    category: "handover_deal",
    isHandoverDeal: true,
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "handover-meet-landlords",
    title: "Conduct Handover Walkthrough Meeting",
    description: "Meet Anastasya Peymer and Gennady Peymer at 239 Tandalee Crescent at or before 6:00 PM. Walk the property together to confirm vacancy and condition.",
    category: "handover_deal",
    isHandoverDeal: true,
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "handover-receive-payment",
    title: "Collect and Verify $8,900.00 Payment",
    description: "Before handing over the keys, verify receipt of the total $8,900.00 payment from the landlords. Breakdown: $5,000.00 Move-out incentive + $2,600.00 Last Month Deposit + $1,300.00 June 16-30 Refund. Confirm funds (e.g. certified cheque, bank draft, or bank transfer).",
    category: "handover_deal",
    isHandoverDeal: true,
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "handover-n11-sign",
    title: "Exchange Signed Handover & N11 Documents",
    description: "Ensure the landlord signs a receipt for the returned keys, and verify both parties have copy of the Cash for Keys agreement and the N11 form signed and dated.",
    category: "handover_deal",
    isHandoverDeal: true,
    timeframe: "handover",
    isImportant: true,
    isOttawaSpecific: false
  },

  // --- POST-MOVE (SETTLING IN STITTSVILLE) ---
  {
    id: "post-waste-schedule",
    title: "Check Stittsville Waste Collection Schedule",
    description: "Stittsville garbage schedules differ from Kanata. Go to the City of Ottawa website, enter your new Stittsville address, download the calendar, and sign up for email/app alerts for green bin, recycling, and garbage collection days.",
    category: "utilities",
    timeframe: "post-move",
    isImportant: true,
    isOttawaSpecific: true
  },
  {
    id: "post-library-card",
    title: "Update Ottawa Public Library Card",
    description: "Visit the Stittsville Library Branch (1637 Stittsville Main St) or do it online. Update your library account with the new residential address.",
    category: "admin",
    timeframe: "post-move",
    isImportant: false,
    isOttawaSpecific: true
  },
  {
    id: "post-school-registration",
    title: "Transfer/Update School Registrations (If applicable)",
    description: "If children are changing schools, update registration details with the local school board (OCDSB, OCSB, CEPEO, or CSDCEO) for their new Stittsville boundary school.",
    category: "admin",
    timeframe: "post-move",
    isImportant: false,
    isOttawaSpecific: true
  },
  {
    id: "post-local-pharmacy",
    title: "Transfer Prescriptions to Stittsville Pharmacy",
    description: "Visit a pharmacy close to your new home (e.g., Shoppers Drug Mart on Main St or Hazeldean Road) and ask them to transfer prescriptions from your old Kanata pharmacy.",
    category: "admin",
    timeframe: "post-move",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "post-unpack-essentials",
    title: "Unpack Essentials First",
    description: "Set up the bedrooms, kitchen essentials (coffee maker, basic utensils, plates), bathroom (toilet paper, shower curtains, soap, towels), and phone/laptop chargers.",
    category: "logistics",
    timeframe: "post-move",
    isImportant: true,
    isOttawaSpecific: false
  },
  {
    id: "post-grocery-scouting",
    title: "Scout Nearest Grocery Stores",
    description: "Locate your nearest shops: Foodland on Stittsville Main St, Sobeys on Hazeldean Road, or the Real Canadian Superstore on Eagleson Road.",
    category: "logistics",
    timeframe: "post-move",
    isImportant: false,
    isOttawaSpecific: false
  },
  {
    id: "post-smoke-detectors",
    title: "Check Smoke & Carbon Monoxide Detectors",
    description: "Ensure all smoke alarms and carbon monoxide detectors in the new Stittsville home have working batteries and are functioning properly. Replace batteries if unsure.",
    category: "cleaning",
    timeframe: "post-move",
    isImportant: true,
    isOttawaSpecific: false
  }
];

// Export to window object for access by app.js (plain HTML/JS import compatible)
window.MOVING_CHECKLIST_DATA = defaultChecklist;
