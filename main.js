// MyOffice One 2026 — desktop shell and Windows Explorer integration.
'use strict';
const {app, BrowserWindow, ipcMain, dialog, shell} = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const MAX_BYTES = 75 * 1024 * 1024;
const ALLOWED = new Set(['.docx','.xlsx','.pptx','.myoffice','.html','.htm','.txt','.csv','.tsv']);
let win;
let pendingPaths = [];

function filesFromArgs(args, cwd=process.cwd()) {
  return args.filter(arg=>typeof arg==='string' && ALLOWED.has(path.extname(arg).toLowerCase()))
    .slice(0,10).map(arg=>path.resolve(cwd,arg));
}
function addOpenPaths(args, cwd) {
  const paths=filesFromArgs(args,cwd);
  for(const file of paths) if(!pendingPaths.includes(file)) pendingPaths.push(file);
  if(paths.length && win && !win.isDestroyed()) {
    win.show(); win.focus();
    if(!win.webContents.isLoading()) win.webContents.send('myoffice:files-available');
  }
}
async function readForRenderer(file) {
  const name=path.basename(file);
  try {
    if(!ALLOWED.has(path.extname(file).toLowerCase())) throw Error('Unsupported file format.');
    const stat=await fs.stat(file);
    if(!stat.isFile()) throw Error('Not a regular file.');
    if(stat.size>MAX_BYTES) throw Error('File exceeds 75 MB safety limit.');
    return {path:file,name,bytes:Array.from(await fs.readFile(file))};
  }catch(error){ return {path:file,name,error:String(error?.message||error)}; }
}
function createWindow() {
  win=new BrowserWindow({
    width:1420,height:900,minWidth:900,minHeight:600,title:'MyOffice One 2026',
    backgroundColor:'#f2f5fb',icon:path.join(__dirname,'assets','myoffice-icon.png'),
    webPreferences:{preload:path.join(__dirname,'preload.js'),nodeIntegration:false,
      contextIsolation:true,sandbox:true,webSecurity:true}
  });
  win.setMenuBarVisibility(false);
  win.webContents.on('will-navigate',(event,url)=>{event.preventDefault();});
  win.webContents.setWindowOpenHandler(({url})=>{
    if(/^https:\/\//i.test(url))shell.openExternal(url);
    return {action:'deny'};
  });
  win.webContents.on('did-finish-load',()=>{
    if(pendingPaths.length)win.webContents.send('myoffice:files-available');
  });
  win.loadFile(path.join(__dirname,'index.html'));
}
function registerIpc() {
  ipcMain.handle('myoffice:open',async()=>{
    const selection=await dialog.showOpenDialog(win,{title:'Open Office File',
      properties:['openFile'],filters:[{name:'Office and text files',extensions:[...ALLOWED].map(x=>x.slice(1))}]});
    if(selection.canceled||!selection.filePaths?.length)return null;
    return readForRenderer(selection.filePaths[0]);
  });
  ipcMain.handle('myoffice:consume-launch-files',async()=>{
    const paths=pendingPaths.splice(0,pendingPaths.length);
    return Promise.all(paths.map(readForRenderer));
  });
  ipcMain.handle('myoffice:save',async(_event,req)=>{
    if(!req||!Array.isArray(req.bytes)||req.bytes.length>MAX_BYTES||!req.bytes.every(b=>Number.isInteger(b)&&b>=0&&b<=255))throw Error('Invalid or oversized save data.');
    if(typeof req.ext!=='string'||!ALLOWED.has('.'+req.ext.toLowerCase()))throw Error('Unsupported save extension.');
    let out=typeof req.existingPath==='string'?req.existingPath:null;
    if(out && path.extname(out).toLowerCase()!=='.'+req.ext.toLowerCase())out=null;
    if(!out){
      const selection=await dialog.showSaveDialog(win,{title:'Save Office File',defaultPath:req.name,
        filters:[{name:req.ext.toUpperCase()+' file',extensions:[req.ext]}],showOverwriteConfirmation:true});
      if(selection.canceled||!selection.filePath)return{cancelled:true};
      out=selection.filePath;
    }
    await fs.writeFile(out,Buffer.from(req.bytes));
    return {cancelled:false,path:out};
  });
}
if(!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  // Windows passes a filename as an argv argument when selected via "Open with".
  addOpenPaths(process.argv.slice(app.isPackaged?1:2));
  app.on('second-instance',(_event,argv,workingDirectory)=>{
    addOpenPaths(argv.slice(app.isPackaged?1:2),workingDirectory);
  });
  app.whenReady().then(()=>{
    registerIpc();
    createWindow();
    app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
  });
}
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
