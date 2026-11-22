/* ================= EDIT THIS FILE: office + team data (open in Notepad, save, refresh the page) =================
   x,z   = where the person sits (office is centered at 0,0; 1 unit ~ 1 metre)
   face  = direction they look, in degrees (0 = toward +z, 90 = toward +x, 180 = toward -z, 270 = toward -x)
   photo = file in photos/ (optional, shown in the chat box)
   does  = what they do in the team (they say this when you talk to them)
   says  = (optional) your own lines instead of the automatic ones                                          */
const OFFICE = { width: 20, depth: 14 };

const TEAM = [
  {name:'Alice Tan',   role:'Product Manager', does:'I decide what we build next and make sure it solves a real problem for customers.', fact:'I run marathons on weekends.', photo:'photos/alice.jpg', x:-6,z:-3, face:0,   skin:'#f1c27d',hair:'#3b2417',shirt:'#e5484d',pants:'#2b2d42',style:'long'},
  {name:'Budi Santoso',role:'Backend Engineer',does:'I build the APIs and databases behind the app. If something is slow, it is probably my fault.', fact:'I am a serious coffee snob.', photo:'photos/budi.jpg',  x:-2,z:-3, face:0,   skin:'#c68642',hair:'#111111',shirt:'#3b82f6',pants:'#334155',style:'short'},
  {name:'Chen Wei',    role:'Designer',        does:'I design how everything looks and feels, from screens to icons.', fact:'I draw something every single day.', photo:'photos/chen.jpg',   x: 2,z:-3, face:0,   skin:'#f5d0a9',hair:'#222222',shirt:'#22c55e',pants:'#1f2937',style:'cap'},
  {name:'Dina Putri',  role:'QA Engineer',     does:'I test everything before it ships and break things so customers do not have to.', fact:'I have three cats.', photo:'photos/dina.jpg',   x: 6,z:-3, face:0,   skin:'#e0ac69',hair:'#5a3825',shirt:'#a855f7',pants:'#3f3f46',style:'long'},
  {name:'Eko Prasetyo',role:'Frontend Developer',does:'I turn the designs into the screens you click on in the browser.', fact:'I can solve a Rubik\'s cube in under a minute.', photo:'photos/eko.jpg', x:-4,z: 4, face:180, skin:'#8d5524',hair:'#111111',shirt:'#f59e0b',pants:'#27272a',style:'short'},
  {name:'Fiona Lee',   role:'Team Lead',       does:'I keep the team unblocked, plan the sprints and talk to the stakeholders.', fact:'I host a board game night every month.', photo:'photos/fiona.jpg', x: 4,z: 4, face:180, skin:'#f1c27d',hair:'#c8a2c8',shirt:'#14b8a6',pants:'#1e293b',style:'bun'},
];

// Empty seats you can sit on (press E next to one)
const SEATS = [
  {x:-8,z: 4, face:180},
  {x: 0,z: 4, face:180},
  {x: 8,z: 4, face:180},
  {x: 0,z:-3, face:0},
];

// Your own character
const PLAYER = {name:'You', skin:'#f1c27d', hair:'#222222', shirt:'#ef4444', pants:'#1d4ed8', style:'short'};

// Office water-cooler chatter. "text" alone = a random teammate says it. ["Budi","text"] = that person says it.
const CHATTER = [
  "Who keeps microwaving fish at lunch?",
  "Is the printer broken again?",
  "Anyone up for coffee?",
  "I swear the AC is set to arctic.",
  "Did you see the new ticket? Oh no.",
  "Lunch at 12? I'm starving.",
  "Who took my stapler?!",
  "It works on my machine...",
  ["Budi Santoso","The server is fine. It's always fine. Until it isn't."],
  ["Dina Putri","I found another bug. You're welcome."],
  ["Alice Tan","Quick sync? It'll only take five minutes. (It won't.)"],
  ["Fiona Lee","Don't forget board game night on Friday!"],
  ["Chen Wei","Can we make that button 2 pixels to the left?"],
  ["Eko Prasetyo","Who changed the CSS... again?"],
];

window.GAME_DATA = {OFFICE, TEAM, SEATS, PLAYER, CHATTER};
