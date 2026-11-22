/* ================= EDIT THIS FILE (open in Notepad, save, refresh the page) =================
   MAP   = the floor plan, in PLAN PIXELS (taken from the furniture layout photo). scale = metres per pixel.
   Desks are numbered like the plan (001-061). The person list below says who sits at which desk number.
   Looks (LOOKS) are hand-made from reference photos.                                                     */

const DEPT_DOES = {
  'Senior Management': 'I set the direction for the whole department and make sure our priorities line up with the company.',
  'Physical Asset Management': 'We look after our physical assets, keeping plants and equipment healthy and reliable.',
  'Logistics & Maritime': 'We plan and track the movement of products by sea and land, from vessels to terminals.',
  'Refining': 'We keep the refineries running efficiently and safely, and track their performance.',
  'Manufacturing': 'We focus on manufacturing plants and making sure production meets plan.',
  'Pipeline & Transmission': 'We look after the pipelines and transmission network that move product around.',
  'Process & Operations': 'We study how our processes run day to day and look for ways to improve operations.',
  'Production & Operations Data Analysts': 'We turn production and operations data into dashboards and insights people can act on.',
};

const SK=['#f1c27d','#c68642','#e0ac69','#8d5524','#f5d0a9'], HR=['#111111','#3b2417','#222222','#5a3825'];
const SH=['#e5484d','#3b82f6','#22c55e','#a855f7','#f59e0b','#14b8a6','#ec4899','#64748b','#0ea5e9'], PT=['#2b2d42','#334155','#1f2937','#3f3f46','#27272a','#1e293b'];

// ---- Looks (hand-made, based on reference photos) ----
// outfit: suit | zip | shirt | polo | baju | blouse   style: short | quiff | bob | songkok   beard: full | goatee
// top = jacket/shirt colour, shirt = inner shirt, hijab/drape = hijab and chest drape, eyeY = where the eyes sit on the photo (0-1)
const LOOKS = {
  musreen:{skin:'#bf8665',moustache:1,brow:2,outfit:'suit',top:'#1b2338',shirt:'#f4f4f4',pants:'#1b2030',hair:'#4a4a50',style:'short',beard:'full',beardColor:'#6a6a70',glasses:'#555a60',eyeY:.46},
  nora:   {skin:'#956a53',smile:1,teeth:1,lash:1,outfit:'shirt',top:'#d7dde6',pattern:['#c4cfdc','#e9c5d0','#aab4c2'],hijab:'#7f8ea0',drape:'#b8c3d2',pants:'#3a3f52',eyeY:.5},
  roy:    {skin:'#ba876c',brow:2,moustache:1,stubble:1,outfit:'suit',top:'#233a63',shirt:'#f4f4f4',pants:'#1c2740',hair:'#16161a',style:'quiff',beard:'full',beardColor:'#26262a',glasses:'#2a2a2e',eyeY:.45},
  doriah: {skin:'#d2ac9c',smile:1,teeth:1,lash:1,outfit:'shirt',top:'#efe9ee',pattern:['#f3d9e2','#dfe9e6'],hijab:'#efe8ee',drape:'#ece4ea',pants:'#2a2f45',eyeY:.43},
  hazman: {skin:'#c09e87',glassStyle:'round',outfit:'suit',top:'#3a3d42',shirt:'#f4f4f4',tie:'#222c4c',pants:'#2f3238',hair:'#1a1a1d',style:'quiff',glasses:'#8a8a92',eyeY:.58},
  amni:   {skin:'#b68774',smile:1,teeth:1,lash:1,glassStyle:'round',outfit:'shirt',top:'#f2b5c6',pattern:['#f6c8d4','#eaa0b8','#f9d8e0'],hijab:'#f1bfd0',drape:'#f3c3d2',pants:'#e99bb0',glasses:'#9a8078',eyeY:.4},
  adilah: {skin:'#efcbb1',lip:'#c27a80',lash:1,outfit:'suit',top:'#c2305e',shirt:'#f6f6f6',pants:'#2d2d3a',hijab:'#e6d0cc',drape:'#e9d6d2',drapeW:.26,eyeY:.5},
  zack:   {skin:'#a87b66',moustache:1,outfit:'zip',top:'#1a1a1c',pants:'#2b2b30',hair:'#151518',style:'quiff',beard:'goatee',beardColor:'#222222',eyeY:.46},
  hanafi: {skin:'#a07f6c',smile:1,teeth:1,outfit:'suit',top:'#2a2c31',shirt:'#f4f4f4',tie:'#111114',pants:'#2a2c31',hair:'#16161a',style:'quiff',glasses:'#111111',eyeY:.47},
  faiz:   {skin:'#dcb4a0',moustache:1,glassStyle:'rect',outfit:'zip',top:'#1c1d20',logo:'#2fa89a',pants:'#2b2f3a',hair:'#17171a',style:'quiff',beard:'goatee',beardColor:'#2b2b2e',glasses:'#4a4a50',eyeY:.49},
  nurin:  {skin:'#cd9c83',smile:1,lip:'#b8605c',lash:1,outfit:'suit',top:'#1f6a60',shirt:'#f4f4f4',pants:'#2a2f3a',hijab:'#aeb8d0',drape:'#b4bdd4',drapeW:.26,eyeY:.5},
  hanif:  {apron:'#17171b',skin:'#9b7465',brow:2,workstation:'chop',outfit:'baju',top:'#1d56b8',pants:'#1f2438',hair:'#0e0e10',style:'songkok',glasses:'#161616',eyeY:.65},
  syed:   {skin:'#de9370',brow:2,moustache:1,smile:1,outfit:'shirt',top:'#17171a',pants:'#26262c',hair:'#111114',style:'quiff',beard:'full',beardColor:'#151518',eyeY:.45},
  naz:    {skin:'#8f5f41',smile:1,teeth:1,stubble:1,outfit:'polo',sleeve:'short',top:'#1d2349',pants:'#2b3046',hair:'#18181c',style:'short',beard:'goatee',beardColor:'#2a2a30',eyeY:.48},
  quah:   {skin:'#987d77',smile:1,lash:1,glassStyle:'round',outfit:'blouse',top:'#1c2a4c',pants:'#2c3044',hair:'#1c1a1e',style:'bob',glasses:'#9a9aa5',eyeY:.5},
  azfar:  {skin:'#e0ad94',smile:1,outfit:'suit',top:'#16161a',shirt:'#a9c8e8',pants:'#1f2433',hair:'#0e0e12',style:'quiff',beard:'goatee',beardColor:'#2a2a2a',eyeY:.46},
  nina:   {skin:'#d1a6a1',smile:1,lip:'#b0707a',lash:1,glassStyle:'round',outfit:'suit',top:'#7c3345',shirt:'#f4f4f4',pants:'#2c2b36',hijab:'#c4768a',drape:'#cf8499',drapeW:.26,glasses:'#b89a8a',eyeY:.48},
  zainul: {skin:'#ac7b61',smile:1,glassStyle:'round',moustache:1,outfit:'suit',top:'#1c2547',shirt:'#b7c8e4',tie:'#1a2150',pants:'#232b4a',hair:'#4a3524',style:'quiff',beard:'goatee',beardColor:'#33291f',glasses:'#888888',eyeY:.47},
};
const TEAM = []; let n = 0;
function person(name, role, dept, g, desk) {
  const i = n++, female = g === 'F', key = name.split(' ')[0].toLowerCase();
  TEAM.push({
    name, role: role + ', ' + dept, dept, desk, does: DEPT_DOES[dept], fact: 'This is a placeholder fun fact about me.',
    skin: SK[i % SK.length], hair: HR[i % HR.length], shirt: SH[i % SH.length], pants: PT[i % PT.length],
    style: female ? 'long' : 'short', look: LOOKS[key],
  });
}
//      name            role              department                                  M/F  desk no.
person('Musreen',      'Senior Manager', 'Senior Management',                         'M', 55);
person('Nora',         'Manager',        'Physical Asset Management',                 'F', 3);
person('Roy',          'Executive',      'Physical Asset Management',                 'M', 5);
person('Hazman',       'Executive',      'Logistics & Maritime',                      'M', 17);
person('Amni',         'Executive',      'Logistics & Maritime',                      'F', 16);
person('Adilah',       'Manager',        'Refining',                                  'F', 6);
person('Zack',         'Executive',      'Refining',                                  'M', 7);
person('Hanafi',       'Executive',      'Refining',                                  'M', 8);
person('Faiz',         'Manager',        'Manufacturing',                             'M', 15);
person('Nurin',        'Executive',      'Manufacturing',                             'F', 12);
person('Hanif',        'Executive',      'Manufacturing',                             'M', 13);
person('Syed Sofwan',  'Manager',        'Pipeline & Transmission',                   'M', 10);
person('Naz',          'Executive',      'Pipeline & Transmission',                   'M', 9);
person('Quah',         'Manager',        'Process & Operations',                      'F', 61);
person('Azfar',        'Executive',      'Process & Operations',                      'M', 60);
person('Nina',         'Executive',      'Process & Operations',                      'F', 59);
person('Doriah',       'Manager',        'Production & Operations Data Analysts',     'F', 56);
person('Zainul',       'Executive',      'Production & Operations Data Analysts',     'M', 57);

// ---- Floor plan (plan pixels from the furniture layout photo; angles in degrees) ----
const MAP = {
  scale: 0.045, origin: [900, 600],
  outline: [[110,335],[100,495],[1555,1365],[1700,1290],[1710,-60],[921,-60]],          // outer glass walls
  core: [[543,414],[1362,-2],[1362,278],[1452,278],[1452,612],[1362,612],[1362,870],[1295,892],[543,443]], // lifts, stairs, toilets, rooms (solid, not walkable)
  barriers: [ {a:[845,-23], b:[963,220]}, {a:[1330,25], b:[1710,25]} ],                 // "area under cleaning" (the plan is cut off there)
  walls: { sw:{from:[100,495], to:[1555,1365]}, nw:{from:[110,335], to:[921,-60]} },    // window walls with the pods
  podOffset: 3.4,
  // desks in the pods along the window walls: [desk no, wall, metres along the wall, 'win' = window side | 'corr' = corridor side]
  // (from your pod sheet; sw numbers count up towards the apex). A desk is only drawn when somebody is assigned to it.
  desks: [
    [3,'sw',40.6,'win'],  [5,'sw',35.4,'corr'],
    [6,'sw',29.4,'corr'], [7,'sw',29.4,'win'],  [8,'sw',24.2,'win'],  [9,'sw',24.2,'corr'],
    [10,'sw',18.2,'corr'],[12,'sw',13.0,'win'], [13,'sw',13.0,'corr'],
    [15,'sw',7.0,'win'],
    [16,'nw',7.0,'corr'], [17,'nw',7.0,'win'],
  ],
  // thin cubicle dividers between the pods (metres along the wall)
  dividers: [ {wall:'sw', u:32.4}, {wall:'sw', u:21.2}, {wall:'sw', u:10.0} ],
  // long partition walls (plan pixels): behind the east block's top row of desks
  screens: [ {a:[1425,730], b:[1692,730]} ],
  // free-standing desks: [desk no, plan x, plan y, facing] (facing 0 = south/down the plan, 180 = north)
  clusters: [
    [55,1628,598,180],                                   // Musreen's room
    [57,1558,770,180],[56,1648,770,180],                 // top row (face north)
    [59,1470,880,0],[60,1558,880,0],[61,1648,880,0],     // bottom row (face south)
  ],
  start: [1440, 1000],                                                                  // where you start
  // furniture: at = plan pixels, w/d/h in metres, ang = direction of the long side (0 = east, 90 = south)
  //   chairs:n = table with n chairs per long side, sofa:true + sits:n = sofa / armchair, eat:true = people eat here
  blocks: [
    {at:[1535,1175], ang:54,  w:7.4, d:1.8, h:.75, color:'#b88a5a', chairs:8},          // meeting table 1
    {at:[1043,955],  ang:31,  w:5.2, d:1.8, h:.75, color:'#b88a5a', chairs:6},          // meeting table 2
    {at:[1230,1035], ang:31,  w:2.6, d:.9,  color:'#5b6b82', sofa:true, sits:3},        // lounge sofa
    {at:[1135,1000], ang:-33, w:.9,  d:.9,  color:'#5b6b82', sofa:true, sits:1},        // lounge armchairs
    {at:[1130,1120], ang:-135,w:.9,  d:.9,  color:'#5b6b82', sofa:true, sits:1},
    {at:[1180,1070], ang:31,  w:1.0, d:1.0, h:.4,  color:'#c9b08a'},                    // coffee table
    {at:[1440,110],  ang:90,  w:3.8, d:1.2, h:1.0, color:'#8a6d4b', tall:true},         // pantry counter
    {at:[1440,92],   ang:90,  w:.5,  d:.5,  h:.5,  color:'#222222', nosolid:true},      // coffee machine
    {at:[1540,170],  ang:0,   w:1.8, d:1.0, h:.75, color:'#c9a46a', chairs:2, eat:true}, // pantry tables
    {at:[1540,255],  ang:0,   w:1.8, d:1.0, h:.75, color:'#c9a46a', chairs:2, eat:true},
  ],
  machines: [                                                                            // vending machines (people take a drink / snack from here)
    {at:[1680,160], label:'DRINKS', color:'#2b7fd0', drinks:true},
    {at:[1680,205], label:'SNACKS', color:'#d9482b'},
  ],
  trash: {at:[1440,195]},                                                                // trash can
  labels: [ ['Pantry',[1500,150]] ],                                  // department signs are added automatically above each team
};

// Cleaners who guard the parts of the floor I could not map (north). Talk to them with E.
const CLEANERS = [
  {name:'Cleaner', role:'Housekeeping', at:[854,89],   face:-64, says:['Sorry, this area is under cleaning.','Please use the rest of the floor for now. Thank you!']},
  {name:'Cleaner', role:'Housekeeping', at:[1500,58],  face:0,   says:['Sorry, this area is under cleaning.','Please come back later. Thank you!']},
];

// Your own character
const PLAYER = {name:'You', skin:'#f1c27d', hair:'#222222', shirt:'#ef4444', pants:'#1d4ed8', style:'short'};

// Office water-cooler chatter. "text" alone = a random teammate says it. ["Name","text"] = that person says it.
const CHATTER = [
  "Who keeps microwaving fish at lunch?",
  "Is the printer broken again?",
  "Anyone up for teh tarik?",
  "I swear the AC is set to arctic.",
  "Did you see the new report request? Oh no.",
  "Lunch at 12? I'm starving.",
  "Who took my stapler?!",
  "The dashboard works on my machine...",
  ["Musreen","Please send me the weekly update by Friday."],
  ["Hazman","The vessel is on schedule. I think."],
  ["Zainul","The data has been cleaned. Mostly."],
  ["Doriah","Who changed the Excel formula?"],
  ["Nora","Reminder: asset inspection next week."],
  ["Hanif","Can someone check the pipeline numbers?"],
];

// Small talk at the pantry: [first person says, second person replies]
const SMALLTALK = [
  ["Teh tarik or coffee today?","Coffee. I really need it."],
  ["Did you watch the match last night?","Don't remind me..."],
  ["Any plans for the weekend?","Just sleeping, honestly."],
  ["Where do we go for lunch?","Nasi lemak again?"],
  ["Is it Friday yet?","Not even close."],
  ["Did you see the traffic this morning?","Worst ever. I was late."],
  ["Who finished the biscuits?","Not me. Probably Hazman."],
  ["It is so cold in here.","Tell that to the AC."],
  ["Have you tried the new cafe nearby?","Not yet. Is it good?"],
  ["How is your week going?","Busy, but okay!"],
];
// What someone mutters when they go to the pantry alone
const SOLO = ["Ahh, I needed this.","Where did the sugar go?","Just five minutes of peace.","Who left the cup here?"];
// A third person chiming in
const REACT = ["Haha, true.","Same here!","Wait, what?","Right?!"];

window.GAME_DATA = {MAP, TEAM, PLAYER, CHATTER, SMALLTALK, SOLO, REACT, CLEANERS};
