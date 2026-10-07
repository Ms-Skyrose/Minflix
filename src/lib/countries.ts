// Every country, as [name, ISO 3166-1 alpha-2 code]. Used by the join form and the network leaderboard.
const RAW =
  "Afghanistan:AF|Albania:AL|Algeria:DZ|Andorra:AD|Angola:AO|Antigua and Barbuda:AG|Argentina:AR|Armenia:AM|Australia:AU|Austria:AT|Azerbaijan:AZ|Bahamas:BS|Bahrain:BH|Bangladesh:BD|Barbados:BB|Belarus:BY|Belgium:BE|Belize:BZ|Benin:BJ|Bhutan:BT|Bolivia:BO|Bosnia and Herzegovina:BA|Botswana:BW|Brazil:BR|Brunei:BN|Bulgaria:BG|Burkina Faso:BF|Burundi:BI|Cabo Verde:CV|Cambodia:KH|Cameroon:CM|Canada:CA|Central African Republic:CF|Chad:TD|Chile:CL|China:CN|Colombia:CO|Comoros:KM|Congo:CG|Costa Rica:CR|Côte d’Ivoire:CI|Croatia:HR|Cuba:CU|Cyprus:CY|Czechia:CZ|DR Congo:CD|Denmark:DK|Djibouti:DJ|Dominica:DM|Dominican Republic:DO|Ecuador:EC|Egypt:EG|El Salvador:SV|Equatorial Guinea:GQ|Eritrea:ER|Estonia:EE|Eswatini:SZ|Ethiopia:ET|Fiji:FJ|Finland:FI|France:FR|Gabon:GA|Gambia:GM|Georgia:GE|Germany:DE|Ghana:GH|Greece:GR|Grenada:GD|Guatemala:GT|Guinea:GN|Guinea-Bissau:GW|Guyana:GY|Haiti:HT|Honduras:HN|Hungary:HU|Iceland:IS|India:IN|Indonesia:ID|Iran:IR|Iraq:IQ|Ireland:IE|Israel:IL|Italy:IT|Jamaica:JM|Japan:JP|Jordan:JO|Kazakhstan:KZ|Kenya:KE|Kiribati:KI|Kuwait:KW|Kyrgyzstan:KG|Laos:LA|Latvia:LV|Lebanon:LB|Lesotho:LS|Liberia:LR|Libya:LY|Liechtenstein:LI|Lithuania:LT|Luxembourg:LU|Madagascar:MG|Malawi:MW|Malaysia:MY|Maldives:MV|Mali:ML|Malta:MT|Marshall Islands:MH|Mauritania:MR|Mauritius:MU|Mexico:MX|Micronesia:FM|Moldova:MD|Monaco:MC|Mongolia:MN|Montenegro:ME|Morocco:MA|Mozambique:MZ|Myanmar:MM|Namibia:NA|Nauru:NR|Nepal:NP|Netherlands:NL|New Zealand:NZ|Nicaragua:NI|Niger:NE|Nigeria:NG|North Korea:KP|North Macedonia:MK|Norway:NO|Oman:OM|Pakistan:PK|Palau:PW|Palestine:PS|Panama:PA|Papua New Guinea:PG|Paraguay:PY|Peru:PE|Philippines:PH|Poland:PL|Portugal:PT|Qatar:QA|Romania:RO|Russia:RU|Rwanda:RW|Saint Kitts and Nevis:KN|Saint Lucia:LC|Saint Vincent and the Grenadines:VC|Samoa:WS|San Marino:SM|São Tomé and Príncipe:ST|Saudi Arabia:SA|Senegal:SN|Serbia:RS|Seychelles:SC|Sierra Leone:SL|Singapore:SG|Slovakia:SK|Slovenia:SI|Solomon Islands:SB|Somalia:SO|South Africa:ZA|South Korea:KR|South Sudan:SS|Spain:ES|Sri Lanka:LK|Sudan:SD|Suriname:SR|Sweden:SE|Switzerland:CH|Syria:SY|Taiwan:TW|Tajikistan:TJ|Tanzania:TZ|Thailand:TH|Timor-Leste:TL|Togo:TG|Tonga:TO|Trinidad and Tobago:TT|Tunisia:TN|Türkiye:TR|Turkmenistan:TM|Tuvalu:TV|Uganda:UG|Ukraine:UA|United Arab Emirates:AE|United Kingdom:GB|United States:US|Uruguay:UY|Uzbekistan:UZ|Vanuatu:VU|Vatican City:VA|Venezuela:VE|Vietnam:VN|Yemen:YE|Zambia:ZM|Zimbabwe:ZW";

export type Country = { name: string; code: string };

export const COUNTRIES: Country[] = RAW.split("|").map((pair) => {
  const [name, code] = pair.split(":");
  return { name, code };
});

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function countryByCode(code: string | null | undefined): Country | undefined {
  return code ? BY_CODE.get(code.toUpperCase()) : undefined;
}

const CONTINENT_CODES = {
  Africa: "DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW",
  Europe: "AL AD AT BY BE BA BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA",
  Asia: "AF AM AZ BH BD BT BN KH CN GE IN ID IR IQ IL JP JO KZ KW KG LA LB MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE",
  "North America": "AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US",
  "South America": "AR BO BR CL CO EC GY PY PE SR UY VE",
  Oceania: "AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU",
} as const;

export type Continent = keyof typeof CONTINENT_CODES;
export const CONTINENTS = Object.keys(CONTINENT_CODES) as Continent[];

/** Country codes in a continent, or undefined if the name isn't one of ours. */
export function codesIn(continent: string | undefined): string[] | undefined {
  return continent && continent in CONTINENT_CODES ? CONTINENT_CODES[continent as Continent].split(" ") : undefined;
}

export const FESTIVAL_TYPES = [
  "Film festival",
  "Short film festival",
  "Documentary festival",
  "Student festival",
  "Animation festival",
  "Genre festival",
  "Other",
] as const;

export const FILMS_PER_EDITION = ["Under 25", "25–100", "100–300", "300+", "First edition, not sure yet"] as const;

export const NEXT_EDITION = ["Q4 2026", "Q1 2027", "Q2 2027", "Q3 2027", "Q4 2027", "Not set yet"] as const;

export const HEADACHES = [
  "Submissions",
  "Registration",
  "Payments",
  "Filmmaker management",
  "Programme management",
  "Promotion",
  "Something else",
] as const;
