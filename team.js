/* ================= EDIT THIS FILE: office + team data (open in Notepad, save, refresh the page) =================
   Each department is a "pod": pod(name, centerX, rowZ, facingDegrees, [ [person, role, 'M' or 'F'], ... ])
   Office is centered at 0,0 (1 unit ~ 1 metre). Facing: 0 = toward +z, 180 = toward -z.
   Per-person extras (optional, add after pod): photo:'photos/xyz.jpg', fact:'...', says:['line 1','line 2']
   The looks (skin, hair, shirt) are auto-picked as placeholders; override with PEOPLE_OVERRIDE below.          */
const OFFICE = { width: 36, depth: 22, labels: [] };

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
const TEAM = []; let n = 0;
function pod(dept, cx, z, face, members) {
  OFFICE.labels.push({text: dept, x: cx, z});
  members.forEach((m, k) => {
    const i = n++, female = m[2] === 'F';
    TEAM.push({
      name: m[0], dept, role: m[1] + ', ' + dept, does: DEPT_DOES[dept], fact: 'This is a placeholder fun fact about me.',
      x: cx + (k - (members.length - 1) / 2) * 2.4, z, face,
      skin: SK[i % SK.length], hair: HR[i % HR.length], shirt: SH[i % SH.length], pants: PT[i % PT.length],
      style: female ? (i % 2 ? 'long' : 'bun') : (i % 3 ? 'short' : 'cap'),
      ...(m[3] || {}),
    });
  });
}

// ---- Row A (back row, faces +z) ----
pod('Senior Management',               -13, -6, 0,   [['Musreen','Senior Manager','M']]);
pod('Physical Asset Management',       -4.5,-6, 0,   [['Nora','Manager','F'],['Roy','Executive','M']]);
pod('Logistics & Maritime',             4.5,-6, 0,   [['Hazman','Executive','M'],['Amni','Executive','F']]);
pod('Refining',                         13, -6, 0,   [['Adilah','Manager','F'],['Zack','Executive','M'],['Hanafi','Executive','M']]);
// ---- Row B (front row, faces -z) ----
pod('Manufacturing',                   -13,  6, 180, [['Faiz','Manager','M'],['Nurin','Executive','F'],['Hanif','Executive','M']]);
pod('Pipeline & Transmission',         -4.5, 6, 180, [['Syed Sofwan','Manager','M'],['Naz','Executive','M']]);
pod('Process & Operations',             4.5, 6, 180, [['Quah','Manager','F'],['Azfar','Executive','M'],['Nina','Executive','F']]);
pod('Production & Operations Data Analysts', 13, 6, 180, [['Doriah','Manager','F'],['Zainul','Executive','M']]);

// Empty seats you can sit on (press E next to one)
const SEATS = [
  {x:-6,z:0,face:0},{x:6,z:0,face:180},{x:0,z:0,face:0},
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

window.GAME_DATA = {OFFICE, TEAM, SEATS, PLAYER, CHATTER, SMALLTALK, SOLO, REACT};
