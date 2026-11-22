// Run: bun build.js  -> writes ../index.html (self-contained except team.js + photos/)
const r = await Bun.build({ entrypoints: ['./main.js'], minify: true, target: 'browser', format: 'iife' });
if (!r.success) { console.error(r.logs); process.exit(1); }
const js = (await r.outputs[0].text()).replace(/<\/script/gi, '<\/script');
const tpl = await Bun.file('./template.html').text();
await Bun.write('../index.html', tpl.replace('/*BUNDLE*/', () => js));
console.log('index.html', (js.length/1024).toFixed(0)+' KB script');
