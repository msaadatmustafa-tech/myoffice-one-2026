import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const appPath=fileURLToPath(new URL('./main.js', import.meta.url));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'myoffice-launch-'));
const input=path.join(tmp,'Report.docx'), secondary=path.join(tmp,'Budget.xlsx'), output=path.join(tmp,'out.docx');
fs.writeFileSync(input,Buffer.from([80,75,3,4,0,0]));
fs.writeFileSync(secondary,Buffer.from([80,75,3,4,5,6]));
const listeners={};
const handlers={};
let testWin;
const events=[];
class MockWindow {
 constructor(opts){testWin=this;this.opts=opts;this.webContents={isLoading:()=>false,on:(name,cb)=>events.push(['webcontents-event',name]),setWindowOpenHandler:()=>{},send:(event)=>events.push(['ipc-send',event])};}
 setMenuBarVisibility(){} loadFile(file){this.loaded=file;} on(){} isDestroyed(){return false;} show(){events.push(['show']);} focus(){events.push(['focus']);}
 static getAllWindows(){return [testWin];}
}
const app={
  isPackaged:true, requestSingleInstanceLock:()=>true,quit:()=>{},
  whenReady:async()=>{},on:(name,cb)=>{listeners[name]=cb;}
};
const dialog={showOpenDialog:async()=>({canceled:true}),showSaveDialog:async()=>({canceled:false,filePath:output})};
const electron={app,BrowserWindow:MockWindow,ipcMain:{handle:(n,f)=>{handlers[n]=f;}},dialog,shell:{openExternal:()=>{}}};
const fakeProcess={argv:['C:\\Program Files\\MyOffice One\\MyOffice One.exe',input],cwd:()=>tmp,platform:'win32'};
const source=fs.readFileSync(appPath,'utf8');
vm.runInNewContext(source,{require:(n)=>n==='electron'?electron:requireShim(n),process:fakeProcess,__dirname:path.dirname(appPath),Buffer,console,Set,Error,String,Array,Promise},{filename:'main.js'});
function requireShim(n){if(n==='node:fs/promises')return fsp;if(n==='node:path')return path;throw Error('Unexpected module '+n);}
await new Promise(resolve=>setImmediate(resolve));
assert(testWin?.loaded.endsWith('index.html'),'Main window did not load');
assert(Object.hasOwn(handlers,'myoffice:consume-launch-files'),'Missing startup file IPC');
let opened=await handlers['myoffice:consume-launch-files']();
assert.equal(opened.length,1);
assert.equal(opened[0].name,'Report.docx');
assert.deepEqual(opened[0].bytes,[80,75,3,4,0,0]);
assert.equal((await handlers['myoffice:consume-launch-files']()).length,0);
listeners['second-instance']({},['MyOfficeOne.exe',secondary],tmp);
opened=await handlers['myoffice:consume-launch-files']();
assert.equal(opened.length,1);
assert.equal(opened[0].name,'Budget.xlsx');
assert(events.some(([type,e])=>type==='ipc-send'&&e==='myoffice:files-available'),'Missing UI file notification');
const saved=await handlers['myoffice:save']({}, {name:'out.docx',bytes:[1,2,3],ext:'docx'});
assert.equal(saved.cancelled,false);
assert.deepEqual([...fs.readFileSync(output)],[1,2,3]);
let unsafe=false;
try{await handlers['myoffice:save']({}, {name:'out.exe',bytes:[1,2,3],ext:'exe'});}catch(e){unsafe=true;}
assert(unsafe,'Invalid save extension accepted');
const pkg=JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url),'utf8'));
assert.equal(pkg.build.nsis.perMachine,true);
assert.deepEqual(pkg.build.win.fileAssociations.map(x=>x.ext),['docx','xlsx','pptx','myoffice']);
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const inline=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
for(const [index,match] of inline.entries())new vm.Script(match[1],{filename:'inline-'+index+'.js'});
fs.rmSync(tmp,{recursive:true,force:true});
console.log('Explorer initial file launch: PASS');
console.log('Explorer Open with while already running: PASS');
console.log('Native Save dialog payload: PASS');
console.log('Unsafe save extension rejected: PASS');
console.log('File association setup config: PASS');
console.log('HTML inline JS syntax: PASS');

