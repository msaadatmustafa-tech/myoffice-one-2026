// The renderer has no direct filesystem or Node.js access.
'use strict';
const {contextBridge, ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('myOfficeDisk', Object.freeze({
  openFile:()=>ipcRenderer.invoke('myoffice:open'),
  saveFile:req=>ipcRenderer.invoke('myoffice:save',req),
  consumeLaunchFiles:()=>ipcRenderer.invoke('myoffice:consume-launch-files'),
  onExternalFilesReady:callback=>{
    if(typeof callback!=='function')return;
    ipcRenderer.on('myoffice:files-available',()=>callback());
  }
}));
