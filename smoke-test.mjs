import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('./index.html', import.meta.url),'utf8');
let scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
let src=scripts[1].slice(0,scripts[1].lastIndexOf("$$('[data-nav]').forEach(b=>b.onclick=()=>nav(b.dataset.nav));"));
const fauxDoc={
 querySelector:()=>({innerHTML:'',textContent:'',classList:{add(){},remove(){}},style:{},disabled:false}),
 querySelectorAll:()=>[],
 createElement(tag){let inner='';const e={nodeType:1,tagName:tag.toUpperCase(),style:{},childNodes:[],querySelectorAll:()=>[],get innerHTML(){return inner},set innerHTML(v){inner=v;const text=String(v).replace(/<[^>]+>/g,'');e.childNodes=text?[{nodeType:1,tagName:'P',style:{},childNodes:[{nodeType:3,textContent:text}]}]:[];}};return e;},
 addEventListener(){}
};
const ctx=vm.createContext({
 TextEncoder, TextDecoder, Uint8Array, DataView, Blob, Response, ReadableStream, atob, btoa, DecompressionStream, CompressionStream,
 console, setTimeout, clearTimeout, Date, Math,
 window:{addEventListener(){},requestAnimationFrame(){}}, document:fauxDoc,
 localStorage:{getItem(){return null},setItem(){}},
});
try { vm.runInContext(scripts[0],ctx,{timeout:10000}); vm.runInContext(src,ctx,{timeout:10000}); }catch(e){ console.error('APP INIT ERROR:',e); process.exit(1); }
const test=async()=>{
 const calc=vm.runInContext("calcCell('D1',{cells:{A1:'140',A2:'60',B1:'=SUM(A1:A2)',D1:'=B1*2'}})",ctx);
 if(calc!==400)throw Error('Formula result unexpected '+calc);
 console.log('Formula SUM, reference and multiplication: PASS =',calc);
 const vals=vm.runInContext("Object.keys(formats).map(x=>[x,formats[x].map(y=>y[1])])",ctx);
 console.log('Format chooser',vals);
 const xlsx=await vm.runInContext("makeXlsx({sheets:[{name:'Sheet1',cells:{A1:'Revenue',A2:'140',A3:'60',B1:'Total',B2:'=SUM(A2:A3)'}}]})",ctx);
 fs.writeFileSync(new URL('./qa-export.xlsx', import.meta.url),Buffer.from(await xlsx.arrayBuffer()));
 console.log('XLSX bytes',xlsx.size);
 const docx=await vm.runInContext("makeDocx({html:'<p>MyOffice One Document Test</p>'})",ctx);
 fs.writeFileSync(new URL('./qa-export.docx', import.meta.url),Buffer.from(await docx.arrayBuffer()));
 console.log('DOCX bytes',docx.size);
 // Test the native save bridge route without accessing the real Windows filesystem.
 vm.runInContext("window.myOfficeDisk={saveFile:async r=>{globalThis.savedBytes=r.bytes.length;return {path:'C:/Test/QA.xlsx'}}}; data.items=[{id:'qa',name:'QA',type:'sheets',sheets:[{name:'Sheet1',cells:{A1:'4',A2:'6',A3:'=SUM(A1:A2)'}}]}]; data.active='qa';",ctx);
 await vm.runInContext("putFile(data.items[0],'xlsx',true,'QA.xlsx')",ctx);
 const count=vm.runInContext('globalThis.savedBytes',ctx);if(count<1000)throw Error('Native file bridge wrote no bytes');
 console.log('Save As native disk IPC payload bytes: PASS',count);

 const archive=await vm.runInContext("zipWrite({'hello.txt':'Hello office'})",ctx);
 ctx.archiveBuffer=await archive.arrayBuffer();
 assert.equal(new TextDecoder().decode((await vm.runInContext('zipRead(archiveBuffer)',ctx))['hello.txt']),'Hello office');
 const damaged=new Uint8Array(ctx.archiveBuffer.slice(0));damaged[30+'hello.txt'.length]^=1;ctx.damagedBuffer=damaged.buffer;
 await assert.rejects(vm.runInContext('zipRead(damagedBuffer)',ctx),/damaged/);
 ctx.truncatedBuffer=ctx.archiveBuffer.slice(0,10);
 await assert.rejects(vm.runInContext('zipRead(truncatedBuffer)',ctx),/valid Office ZIP/);
 assert.throws(()=>vm.runInContext("normalizeBackupItem({type:'slides',slides:null})",ctx),/Invalid backup slides/);
 const normalized=vm.runInContext("normalizeBackupItem({type:'slides',name:'Test',slides:[{title:'Title',bg:'red;position:fixed',layout:'bad'}]})",ctx);
 assert.equal(normalized.slides[0].bg,'#273775');
 assert.equal(normalized.slides[0].layout,'content');
 assert.match(normalized.updated,/^\d{4}-/);
 const originalPayload=vm.runInContext('makePayload',ctx),errors=[];ctx.makePayload=async()=>{throw Error('Serializer failed');};
 ctx.console={...console,error:error=>errors.push(error)};
 try{await vm.runInContext("putFile({id:'bad',name:'Bad'},'docx')",ctx);}finally{ctx.makePayload=originalPayload;ctx.console=console;}
 assert.equal(errors[0]?.message,'Serializer failed');
 console.log('ZIP roundtrip, corrupt/truncated ZIP rejection, backup normalization and save error handling: PASS');

 // PPTX serializer uses browser DOMParser, which this Node smoke harness does not provide.
 console.log('PPTX browser XML test: NOT RUN (requires DOMParser).');
};
try{await test();}catch(e){console.error('FAIL',e);process.exitCode=1;}
