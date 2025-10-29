/*!
 * ONNX Runtime Web v1.19.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var Rn=Object.defineProperty;var op=Object.getOwnPropertyDescriptor;var ip=Object.getOwnPropertyNames;var ap=Object.prototype.hasOwnProperty;var Mn=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var U=(e,t)=>()=>(e&&(t=e(e=0)),t);var Ft=(e,t)=>{for(var r in t)Rn(e,r,{get:t[r],enumerable:!0})},sp=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of ip(t))!ap.call(e,o)&&o!==r&&Rn(e,o,{get:()=>t[o],enumerable:!(n=op(t,o))||n.enumerable});return e};var br=e=>sp(Rn({},"__esModule",{value:!0}),e);var wr,$t,_t,up,vr,$r=U(()=>{"use strict";wr=new Map,$t=[],_t=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let n=wr.get(e);if(n===void 0)wr.set(e,{backend:t,priority:r});else{if(n.priority>r)return;if(n.priority===r&&n.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let o=$t.indexOf(e);o!==-1&&$t.splice(o,1);for(let i=0;i<$t.length;i++)if(wr.get($t[i]).priority<=r){$t.splice(i,0,e);return}$t.push(e)}return}throw new TypeError("not a valid backend")},up=async e=>{let t=wr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(n){return r||(t.error=`${n}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},vr=async e=>{let t=e.executionProviders||[],r=t.map(d=>typeof d=="string"?d:d.name),n=r.length===0?$t:r,o,i=[],a=new Set;for(let d of n){let p=await up(d);typeof p=="string"?i.push({name:d,err:p}):(o||(o=p),o===p&&a.add(d))}if(!o)throw new Error(`no available backend found. ERR: ${i.map(d=>`[${d.name}] ${d.err}`).join(", ")}`);for(let{name:d,err:p}of i)r.includes(d)&&console.warn(`removing requested execution provider "${d}" from session options because it is not available: ${p}`);let l=t.filter(d=>a.has(typeof d=="string"?d:d.name));return[o,new Proxy(e,{get:(d,p)=>p==="executionProviders"?l:Reflect.get(d,p)})]}});var Yi=U(()=>{"use strict";$r()});var Xi,Zi=U(()=>{"use strict";Xi="1.19.0"});var Qi,Ne,Un=U(()=>{"use strict";Zi();Qi="warning",Ne={wasm:{},webgl:{},webgpu:{},versions:{common:Xi},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Qi=e}},get logLevel(){return Qi}};Object.defineProperty(Ne,"logLevel",{enumerable:!0})});var be,Ji=U(()=>{"use strict";Un();be=Ne});var ea,ta,ra=U(()=>{"use strict";ea=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let n=r.getContext("2d");if(n!=null){let o,i;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(o=e.dims[2],i=e.dims[3]):(o=e.dims[3],i=e.dims[2]);let a=t?.format!==void 0?t.format:"RGB",l=t?.norm,d,p;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],0],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?p=[0,0,0,0]:typeof l.bias=="number"?p=[l.bias,l.bias,l.bias,l.bias]:(p=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(p[3]=l.bias[3]));let m=i*o,u=0,h=m,w=m*2,g=-1;a==="RGBA"?(u=0,h=m,w=m*2,g=m*3):a==="RGB"?(u=0,h=m,w=m*2):a==="RBG"&&(u=0,w=m,h=m*2);for(let b=0;b<i;b++)for(let x=0;x<o;x++){let _=(e.data[u++]-p[0])*d[0],$=(e.data[h++]-p[1])*d[1],S=(e.data[w++]-p[2])*d[2],I=g===-1?255:(e.data[g++]-p[3])*d[3];n.fillStyle="rgba("+_+","+$+","+S+","+I+")",n.fillRect(x,b,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},ta=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),n;if(r!=null){let o,i,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(o=e.dims[2],i=e.dims[1],a=e.dims[3]):(o=e.dims[3],i=e.dims[2],a=e.dims[1]);let l=t!==void 0&&t.format!==void 0?t.format:"RGB",d=t?.norm,p,m;d===void 0||d.mean===void 0?p=[255,255,255,255]:typeof d.mean=="number"?p=[d.mean,d.mean,d.mean,d.mean]:(p=[d.mean[0],d.mean[1],d.mean[2],255],d.mean[3]!==void 0&&(p[3]=d.mean[3])),d===void 0||d.bias===void 0?m=[0,0,0,0]:typeof d.bias=="number"?m=[d.bias,d.bias,d.bias,d.bias]:(m=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(m[3]=d.bias[3]));let u=i*o;if(t!==void 0&&(t.format!==void 0&&a===4&&t.format!=="RGBA"||a===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,w=0,g=1,b=2,x=3,_=0,$=u,S=u*2,I=-1;l==="RGBA"?(_=0,$=u,S=u*2,I=u*3):l==="RGB"?(_=0,$=u,S=u*2):l==="RBG"&&(_=0,S=u,$=u*2),n=r.createImageData(o,i);for(let T=0;T<i*o;w+=h,g+=h,b+=h,x+=h,T++)n.data[w]=(e.data[_++]-m[0])*p[0],n.data[g]=(e.data[$++]-m[1])*p[1],n.data[b]=(e.data[S++]-m[2])*p[2],n.data[x]=I===-1?255:(e.data[I++]-m[3])*p[3]}else throw new Error("Can not access image data");return n}});var Vn,na,oa,ia,aa,sa=U(()=>{"use strict";_r();Vn=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:n}=t,o=t.norm??{mean:255,bias:0},i,a;typeof o.mean=="number"?i=[o.mean,o.mean,o.mean,o.mean]:i=[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],typeof o.bias=="number"?a=[o.bias,o.bias,o.bias,o.bias]:a=[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];let l=t.format!==void 0?t.format:"RGBA",d=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",p=r*n,m=d==="RGBA"?new Float32Array(p*4):new Float32Array(p*3),u=4,h=0,w=1,g=2,b=3,x=0,_=p,$=p*2,S=-1;l==="RGB"&&(u=3,h=0,w=1,g=2,b=-1),d==="RGBA"?S=p*3:d==="RBG"?(x=0,$=p,_=p*2):d==="BGR"&&($=0,_=p,x=p*2);for(let T=0;T<p;T++,h+=u,g+=u,w+=u,b+=u)m[x++]=(e[h]+a[0])/i[0],m[_++]=(e[w]+a[1])/i[1],m[$++]=(e[g]+a[2])/i[2],S!==-1&&b!==-1&&(m[S++]=(e[b]+a[3])/i[3]);return d==="RGBA"?new Be("float32",m,[1,4,r,n]):new Be("float32",m,[1,3,r,n])},na=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,n=typeof ImageData<"u"&&e instanceof ImageData,o=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,i=typeof e=="string",a,l=t??{},d=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},p=m=>m instanceof HTMLCanvasElement||m instanceof OffscreenCanvas?m.getContext("2d"):null;if(r){let m=d();m.width=e.width,m.height=e.height;let u=p(m);if(u!=null){let h=e.height,w=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,w=t.resizedWidth),t!==void 0){if(l=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");l.tensorFormat="RGBA",l.height=h,l.width=w}else l.tensorFormat="RGBA",l.height=h,l.width=w;u.drawImage(e,0,0),a=u.getImageData(0,0,w,h).data}else throw new Error("Can not access image data")}else if(n){let m,u;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(m=t.resizedHeight,u=t.resizedWidth):(m=e.height,u=e.width),t!==void 0&&(l=t),l.format="RGBA",l.height=m,l.width=u,t!==void 0){let h=d();h.width=u,h.height=m;let w=p(h);if(w!=null)w.putImageData(e,0,0),a=w.getImageData(0,0,u,m).data;else throw new Error("Can not access image data")}else a=e.data}else if(o){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let m=d();m.width=e.width,m.height=e.height;let u=p(m);if(u!=null){let h=e.height,w=e.width;return u.drawImage(e,0,0,w,h),a=u.getImageData(0,0,w,h).data,l.height=h,l.width=w,Vn(a,l)}else throw new Error("Can not access image data")}else{if(i)return new Promise((m,u)=>{let h=d(),w=p(h);if(!e||!w)return u();let g=new Image;g.crossOrigin="Anonymous",g.src=e,g.onload=()=>{h.width=g.width,h.height=g.height,w.drawImage(g,0,0,h.width,h.height);let b=w.getImageData(0,0,h.width,h.height);l.height=h.height,l.width=h.width,m(Vn(b.data,l))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(a!==void 0)return Vn(a,l);throw new Error("Input data provided is not supported - aborted tensor creation")},oa=(e,t)=>{let{width:r,height:n,download:o,dispose:i}=t,a=[1,n,r,4];return new Be({location:"texture",type:"float32",texture:e,dims:a,download:o,dispose:i})},ia=(e,t)=>{let{dataType:r,dims:n,download:o,dispose:i}=t;return new Be({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:n,download:o,dispose:i})},aa=(e,t,r)=>new Be({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})});var xt,qt,ua,da,la=U(()=>{"use strict";xt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array]]),qt=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),ua=!1,da=()=>{if(!ua){ua=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=typeof Float16Array<"u"&&Float16Array.from;e&&(xt.set("int64",BigInt64Array),qt.set(BigInt64Array,"int64")),t&&(xt.set("uint64",BigUint64Array),qt.set(BigUint64Array,"uint64")),r?(xt.set("float16",Float16Array),qt.set(Float16Array,"float16")):xt.set("float16",Uint16Array)}}});var ca,pa,ma=U(()=>{"use strict";_r();ca=e=>{let t=1;for(let r=0;r<e.length;r++){let n=e[r];if(typeof n!="number"||!Number.isSafeInteger(n))throw new TypeError(`dims[${r}] must be an integer, got: ${n}`);if(n<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${n}`);t*=n}return t},pa=(e,t)=>{switch(e.location){case"cpu":return new Be(e.type,e.data,t);case"cpu-pinned":return new Be({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Be({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Be({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}});var Be,_r=U(()=>{"use strict";ra();sa();la();ma();Be=class{constructor(t,r,n){da();let o,i;if(typeof t=="object"&&"location"in t)switch(this.dataLocation=t.location,o=t.type,i=t.dims,t.location){case"cpu-pinned":{let l=xt.get(o);if(!l)throw new TypeError(`unsupported type "${o}" to create tensor from pinned buffer`);if(!(t.data instanceof l))throw new TypeError(`buffer should be of type ${l.name}`);this.cpuData=t.data;break}case"texture":{if(o!=="float32")throw new TypeError(`unsupported type "${o}" to create tensor from texture`);this.gpuTextureData=t.texture,this.downloader=t.download,this.disposer=t.dispose;break}case"gpu-buffer":{if(o!=="float32"&&o!=="float16"&&o!=="int32"&&o!=="int64"&&o!=="uint32"&&o!=="uint8"&&o!=="bool")throw new TypeError(`unsupported type "${o}" to create tensor from gpu buffer`);this.gpuBufferData=t.gpuBuffer,this.downloader=t.download,this.disposer=t.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let l,d;if(typeof t=="string")if(o=t,d=n,t==="string"){if(!Array.isArray(r))throw new TypeError("A string tensor's data must be a string array.");l=r}else{let p=xt.get(t);if(p===void 0)throw new TypeError(`Unsupported tensor type: ${t}.`);if(Array.isArray(r)){if(t==="float16"&&p===Uint16Array)throw new TypeError("Creating a float16 tensor from number array is not supported. Please use Uint16Array as data.");t==="uint64"||t==="int64"?l=p.from(r,BigInt):l=p.from(r)}else if(r instanceof p)l=r;else throw new TypeError(`A ${o} tensor's data must be type of ${p}`)}else if(d=r,Array.isArray(t)){if(t.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let p=typeof t[0];if(p==="string")o="string",l=t;else if(p==="boolean")o="bool",l=Uint8Array.from(t);else throw new TypeError(`Invalid element type of data array: ${p}.`)}else{let p=qt.get(t.constructor);if(p===void 0)throw new TypeError(`Unsupported type for tensor data: ${t.constructor}.`);o=p,l=t}if(d===void 0)d=[l.length];else if(!Array.isArray(d))throw new TypeError("A tensor's dims must be a number array");i=d,this.cpuData=l,this.dataLocation="cpu"}let a=ca(i);if(this.cpuData&&a!==this.cpuData.length)throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=o,this.dims=i,this.size=a}static async fromImage(t,r){return na(t,r)}static fromTexture(t,r){return oa(t,r)}static fromGpuBuffer(t,r){return ia(t,r)}static fromPinnedBuffer(t,r,n){return aa(t,r,n)}toDataURL(t){return ea(this,t)}toImageData(t){return ta(this,t)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}async getData(t){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let r=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=r,t&&this.disposer&&(this.disposer(),this.disposer=void 0),r}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(t){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return pa(this,t)}}});var De,xr=U(()=>{"use strict";_r();De=Be});var Sr,fa,We,Me,Nn=U(()=>{"use strict";Un();Sr=(e,t)=>{(typeof Ne.trace>"u"?!Ne.wasm.trace:!Ne.trace)||console.timeStamp(`${e}::ORT::${t}`)},fa=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],n=!1;for(let o=0;o<r.length;o++){if(n&&!r[o].includes("TRACE_FUNC")){let i=`FUNC_${e}::${r[o].trim().split(" ")[1]}`;t&&(i+=`::${t}`),Sr("CPU",i);return}r[o].includes("TRACE_FUNC")&&(n=!0)}},We=e=>{(typeof Ne.trace>"u"?!Ne.wasm.trace:!Ne.trace)||fa("BEGIN",e)},Me=e=>{(typeof Ne.trace>"u"?!Ne.wasm.trace:!Ne.trace)||fa("END",e)}});var Ir,ha=U(()=>{"use strict";$r();xr();Nn();Ir=class e{constructor(t){this.handler=t}async run(t,r,n){We();let o={},i={};if(typeof t!="object"||t===null||t instanceof De||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let a=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof De)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");a=!1;for(let p of r){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);o[p]=null}if(typeof n=="object"&&n!==null)i=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,m=Object.getOwnPropertyNames(r);for(let u of this.outputNames)if(m.indexOf(u)!==-1){let h=r[u];(h===null||h instanceof De)&&(p=!0,a=!1,o[u]=h)}if(p){if(typeof n=="object"&&n!==null)i=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else i=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of this.inputNames)if(typeof t[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(a)for(let p of this.outputNames)o[p]=null;let l=await this.handler.run(t,o,i),d={};for(let p in l)if(Object.hasOwnProperty.call(l,p)){let m=l[p];m instanceof De?d[p]=m:d[p]=new De(m.type,m.data,m.dims)}return Me(),d}async release(){return this.handler.dispose()}static async create(t,r,n,o){We();let i,a={};if(typeof t=="string"){if(i=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(i=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let m=t,u=0,h=t.byteLength;if(typeof r=="object"&&r!==null)a=r;else if(typeof r=="number"){if(u=r,!Number.isSafeInteger(u))throw new RangeError("'byteOffset' must be an integer.");if(u<0||u>=m.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${m.byteLength}).`);if(h=t.byteLength-u,typeof n=="number"){if(h=n,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||u+h>m.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${m.byteLength-u}].`);if(typeof o=="object"&&o!==null)a=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(typeof n<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(m,u,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[l,d]=await vr(a),p=await l.createInferenceSessionHandler(i,d);return Me(),new e(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}}});var dp,ga=U(()=>{"use strict";ha();dp=Ir});var ya=U(()=>{"use strict"});var ba=U(()=>{"use strict"});var wa=U(()=>{"use strict"});var va=U(()=>{"use strict"});var lp,Cr,$a=U(()=>{"use strict";$r();xr();lp="Training backend could not be resolved. Make sure you're using the correct configuration & WebAssembly files.",Cr=class e{constructor(t,r,n){this.handler=t,this.hasOptimizerModel=r,this.hasEvalModel=n}get trainingInputNames(){return this.handler.inputNames}get trainingOutputNames(){return this.handler.outputNames}get evalInputNames(){if(this.hasEvalModel)return this.handler.evalInputNames;throw new Error("This training session has no evalModel loaded.")}get evalOutputNames(){if(this.hasEvalModel)return this.handler.evalOutputNames;throw new Error("This training session has no evalModel loaded.")}static async create(t,r){let n=t.evalModel||"",o=t.optimizerModel||"",i=r||{},[a,l]=await vr(i);if(a.createTrainingSessionHandler){let d=await a.createTrainingSessionHandler(t.checkpointState,t.trainModel,n,o,l);return new e(d,!!t.optimizerModel,!!t.evalModel)}else throw new Error(lp)}typeNarrowingForRunStep(t,r,n,o,i){let a={},l={};if(typeof n!="object"||n===null||n instanceof De||Array.isArray(n))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let d=!0;if(typeof o=="object"){if(o===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(o instanceof De)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(o)){if(o.length===0)throw new TypeError("'fetches' cannot be an empty array.");d=!1;for(let p of o){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(r.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);a[p]=null}if(typeof i=="object"&&i!==null)l=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,m=Object.getOwnPropertyNames(o);for(let u of r)if(m.indexOf(u)!==-1){let h=o[u];(h===null||h instanceof De)&&(p=!0,d=!1,a[u]=h)}if(p){if(typeof i=="object"&&i!==null)l=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else l=o}}else if(typeof o<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of t)if(typeof n[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(d)for(let p of r)a[p]=null;return[a,l]}convertHandlerReturnTypeToMapOfTensors(t){let r={};for(let n in t)if(Object.hasOwnProperty.call(t,n)){let o=t[n];o instanceof De?r[n]=o:r[n]=new De(o.type,o.data,o.dims)}return r}async lazyResetGrad(){await this.handler.lazyResetGrad()}async runTrainStep(t,r,n){let[o,i]=this.typeNarrowingForRunStep(this.trainingInputNames,this.trainingOutputNames,t,r,n),a=await this.handler.runTrainStep(t,o,i);return this.convertHandlerReturnTypeToMapOfTensors(a)}async runOptimizerStep(t){if(this.hasOptimizerModel)await this.handler.runOptimizerStep(t||{});else throw new Error("This TrainingSession has no OptimizerModel loaded.")}async runEvalStep(t,r,n){if(this.hasEvalModel){let[o,i]=this.typeNarrowingForRunStep(this.evalInputNames,this.evalOutputNames,t,r,n),a=await this.handler.runEvalStep(t,o,i);return this.convertHandlerReturnTypeToMapOfTensors(a)}else throw new Error("This TrainingSession has no EvalModel loaded.")}async getParametersSize(t=!0){return this.handler.getParametersSize(t)}async loadParametersBuffer(t,r=!0){let n=await this.getParametersSize(r);if(t.length!==4*n)throw new Error("Size of the buffer passed into loadParametersBuffer must match the number of parameters in the model. Please use getParametersSize method to check.");return this.handler.loadParametersBuffer(t,r)}async getContiguousParameters(t=!0){return this.handler.getContiguousParameters(t)}async release(){return this.handler.dispose()}}});var cp,_a=U(()=>{"use strict";$a();cp=Cr});var Wn={};Ft(Wn,{InferenceSession:()=>dp,TRACE:()=>Sr,TRACE_FUNC_BEGIN:()=>We,TRACE_FUNC_END:()=>Me,Tensor:()=>De,TrainingSession:()=>cp,env:()=>be,registerBackend:()=>_t});var Ke=U(()=>{"use strict";Yi();Ji();ga();xr();ya();ba();Nn();wa();va();_a()});var Tr=U(()=>{"use strict"});var Ca={};Ft(Ca,{default:()=>pp});var Sa,Ia,pp,Ta=U(()=>{"use strict";Hn();St();jt();Sa="ort-wasm-proxy-worker",Ia=globalThis.self?.name===Sa;Ia&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":Ar(r.wasm).then(()=>{Er(r).then(()=>{postMessage({type:t})},n=>{postMessage({type:t,err:n})})},n=>{postMessage({type:t,err:n})});break;case"init-ep":{let{epName:n,env:o}=r;kr(o,n).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})});break}case"copy-from":{let{buffer:n}=r,o=Kt(n);postMessage({type:t,out:o});break}case"create":{let{model:n,options:o}=r;Pr(n,o).then(i=>{postMessage({type:t,out:i})},i=>{postMessage({type:t,err:i})});break}case"release":Or(r),postMessage({type:t});break;case"run":{let{sessionId:n,inputIndices:o,inputs:i,outputIndices:a,options:l}=r;Dr(n,o,i,a,new Array(a.length).fill(null),l).then(d=>{d.some(p=>p[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:d},Br([...i,...d]))},d=>{postMessage({type:t,err:d})});break}case"end-profiling":zr(r),postMessage({type:t});break;default:}}catch(n){postMessage({type:t,err:n})}});pp=Ia?null:e=>new Worker(e??Ut,{type:"module",name:Sa})});var Ea={};Ft(Ea,{default:()=>mp});var Gn,Aa,mp,ka=U(()=>{"use strict";Aa=(Gn=import.meta.url,async function(e={}){function t(){return le.buffer!=re.buffer&&we(),re}function r(){return le.buffer!=re.buffer&&we(),se}function n(){return le.buffer!=re.buffer&&we(),Z}function o(){return le.buffer!=re.buffer&&we(),ne}function i(){return le.buffer!=re.buffer&&we(),J}function a(){return le.buffer!=re.buffer&&we(),ke}function l(){return le.buffer!=re.buffer&&we(),R}function d(){return le.buffer!=re.buffer&&we(),Re}var p,m,u=Object.assign({},e),h=new Promise((s,c)=>{p=s,m=c}),w=typeof window=="object",g=typeof importScripts=="function",b=g&&self.name=="em-pthread";u.mountExternalData=(s,c)=>{(u.Fb||(u.Fb=new Map)).set(s,c)},u.unmountExternalData=()=>{delete u.Fb};var x=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let _=()=>{let s=(f,y,v)=>(...C)=>{let O=Je,B=y?.();C=f(...C);let N=y?.();return B!==N&&(f=N,v(B),y=v=null),Je!=O?new Promise((L,j)=>{An={resolve:L,reject:j}}):C},c=f=>async(...y)=>{try{if(u.Eb)throw Error("Session already started");let v=u.Eb={bc:y[0],errors:[]},C=await f(...y);if(u.Eb!==v)throw Error("Session mismatch");u.Mb?.flush();let O=v.errors;if(0<O.length){let B=await Promise.all(O);if(B=B.filter(N=>N),0<B.length)throw Error(B.join(`
`))}return C}finally{u.Eb=null}};u._OrtCreateSession=s(u._OrtCreateSession,()=>u._OrtCreateSession,f=>u._OrtCreateSession=f),u._OrtRun=c(s(u._OrtRun,()=>u._OrtRun,f=>u._OrtRun=f)),u._OrtRunWithBinding=c(s(u._OrtRunWithBinding,()=>u._OrtRunWithBinding,f=>u._OrtRunWithBinding=f)),u._OrtBindInput=s(u._OrtBindInput,()=>u._OrtBindInput,f=>u._OrtBindInput=f),_=void 0};u.jsepInit=(s,c)=>{if(_?.(),s==="webgpu"){[u.Mb,u.Tb,u.Xb,u.Nb,u.Wb,u.jb,u.Yb,u.$b,u.Ub,u.Vb,u.Zb]=c;let f=u.Mb;u.jsepRegisterBuffer=(y,v,C,O)=>f.registerBuffer(y,v,C,O),u.jsepGetBuffer=y=>f.getBuffer(y),u.jsepCreateDownloader=(y,v,C)=>f.createDownloader(y,v,C),u.jsepOnReleaseSession=y=>{f.onReleaseSession(y)},u.jsepOnRunStart=y=>f.onRunStart(y)}};var $,S,I=Object.assign({},u),T="./this.program",A=(s,c)=>{throw c},D="";(w||g)&&(g?D=self.location.href:typeof document<"u"&&document.currentScript&&(D=document.currentScript.src),Gn&&(D=Gn),D=D.startsWith("blob:")?"":D.substr(0,D.replace(/[?#].*/,"").lastIndexOf("/")+1),g&&(S=s=>{var c=new XMLHttpRequest;return c.open("GET",s,!1),c.responseType="arraybuffer",c.send(null),new Uint8Array(c.response)}),$=(s,c,f)=>{var y=new XMLHttpRequest;y.open("GET",s,!0),y.responseType="arraybuffer",y.onload=()=>{y.status==200||y.status==0&&y.response?c(y.response):f()},y.onerror=f,y.send(null)});var z,H=console.log.bind(console),W=console.error.bind(console),X=H,Y=W;if(Object.assign(u,I),I=null,b){let s=function(c){try{var f=c.data,y=f.cmd;if(y==="load"){let v=[];self.onmessage=C=>v.push(C),self.startWorker=()=>{postMessage({cmd:"loaded"});for(let C of v)s(C);self.onmessage=s};for(let C of f.handlers)u[C]&&!u[C].proxy||(u[C]=(...O)=>{postMessage({Lb:"callHandler",kc:C,args:O})},C=="print"&&(X=u[C]),C=="printErr"&&(Y=u[C]));le=f.wasmMemory,we(),pe(f.wasmModule)}else if(y==="run"){On(f.pthread_ptr,0,0,1,0,0),In(f.pthread_ptr),Hl(),No(),ue||(Mi(),ue=!0);try{Gl(f.start_routine,f.arg)}catch(v){if(v!="unwind")throw v}}else y==="cancel"?Mt()&&gr(-1):f.target!=="setimmediate"&&(y==="checkMailbox"?ue&&sr():y&&(Y(`worker: received unknown command ${y}`),Y(f)))}catch(v){throw Ui(),v}};var Ih=s,pe,ue=!1;Y=function(...c){c=c.join(" "),console.error(c)},self.alert=function(...c){postMessage({Lb:"alert",text:c.join(" "),mc:Mt()})},u.instantiateWasm=(c,f)=>new Promise(y=>{pe=v=>{v=new WebAssembly.Instance(v,Bo()),f(v),y()}}),self.onunhandledrejection=c=>{throw c.reason||c},self.onmessage=s}u.wasmBinary&&(z=u.wasmBinary);var le,K,de,re,se,Z,ne,J,ke,R,F,ce,Re,Se=!1;function we(){var s=le.buffer;u.HEAP8=re=new Int8Array(s),u.HEAP16=Z=new Int16Array(s),u.HEAPU8=se=new Uint8Array(s),u.HEAPU16=ne=new Uint16Array(s),u.HEAP32=J=new Int32Array(s),u.HEAPU32=ke=new Uint32Array(s),u.HEAPF32=R=new Float32Array(s),u.HEAPF64=Re=new Float64Array(s),u.HEAP64=F=new BigInt64Array(s),u.HEAPU64=ce=new BigUint64Array(s)}if(!b){if(!((le=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0})).buffer instanceof x))throw Y("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),Error("bad memory");we()}var Lt=[],Pe=[],ze=[],Fe=0,Ot=null,yt=null;function ko(){if(--Fe==0&&(Ot!==null&&(clearInterval(Ot),Ot=null),yt)){var s=yt;yt=null,s()}}function Dt(s){throw Y(s="Aborted("+s+")"),Se=!0,de=1,s=new WebAssembly.RuntimeError(s+". Build with -sASSERTIONS for more info."),m(s),s}var mn,Po=s=>s.startsWith("data:application/octet-stream;base64,"),Oo=s=>s.startsWith("file://");function Do(s){if(s==mn&&z)return new Uint8Array(z);if(S)return S(s);throw"both async and sync fetching of the wasm failed"}function zo(s,c,f){return function(y){if(!z&&(w||g)){if(typeof fetch=="function"&&!Oo(y))return fetch(y,{credentials:"same-origin"}).then(v=>{if(!v.ok)throw`failed to load wasm binary file at '${y}'`;return v.arrayBuffer()}).catch(()=>Do(y));if($)return new Promise((v,C)=>{$(y,O=>v(new Uint8Array(O)),C)})}return Promise.resolve().then(()=>Do(y))}(s).then(y=>WebAssembly.instantiate(y,c)).then(f,y=>{Y(`failed to asynchronously prepare wasm: ${y}`),Dt(y)})}function Bo(){return{a:{M:Wl,za:Nl,b:Fl,$:Lo,z:jo,pa:Ko,X:Xo,Z:Zo,qa:Qo,na:Jo,ga:ei,ma:ti,J:ri,Y:ni,V:oi,oa:ii,W:ai,va:ql,D:Kl,P:Yl,O:Zl,C:Jl,s:ec,p:tc,E:rc,y:dc,Q:lc,ta:cc,ja:pc,T:mc,aa:fc,F:hc,ia:In,sa:gc,u:yc,B:vc,o:$c,m:xc,c:xn,n:Sc,k:Tc,Aa:Ac,r:Ec,f:kc,v:Pc,l:Oc,g:Dc,i:zc,j:Bc,h:Rc,e:Mc,da:Uc,ea:Vc,fa:Nc,ba:vi,ca:$i,S:Wc,d:Hc,N:Gc,G:Lc,K:Fc,w:qc,ra:jc,U:Kc,t:xi,x:Yc,L:Xc,R:Zc,ya:Qc,xa:Jc,ka:Ci,la:Ti,_:bn,A:Ai,I:Ei,ha:ki,H:Pi,a:le,wa:yn,ua:zi,q:rp}}}var fn={849460:(s,c,f,y)=>{if(u===void 0||!u.Fb)return 1;if((s=Ae(s>>>0)).startsWith("./")&&(s=s.substring(2)),!(s=u.Fb.get(s)))return 2;if(y>>>=0,(c>>>=0)+(f>>>=0)>s.byteLength)return 3;try{return r().set(s.subarray(c,c+f),y>>>0),0}catch{return 4}},849961:()=>{u.Ub()},849992:()=>{u.Vb()},850021:()=>{u.Zb()},850046:s=>u.Tb(s),850079:s=>u.Xb(s),850111:(s,c,f)=>{u.Nb(s,c,f,!0)},850150:(s,c,f)=>{u.Nb(s,c,f)},850183:()=>typeof wasmOffsetConverter<"u",850240:s=>{u.jb("Abs",s,void 0)},850291:s=>{u.jb("Neg",s,void 0)},850342:s=>{u.jb("Floor",s,void 0)},850395:s=>{u.jb("Ceil",s,void 0)},850447:s=>{u.jb("Reciprocal",s,void 0)},850505:s=>{u.jb("Sqrt",s,void 0)},850557:s=>{u.jb("Exp",s,void 0)},850608:s=>{u.jb("Erf",s,void 0)},850659:s=>{u.jb("Sigmoid",s,void 0)},850714:(s,c,f)=>{u.jb("HardSigmoid",s,{alpha:c,beta:f})},850793:s=>{u.jb("Log",s,void 0)},850844:s=>{u.jb("Sin",s,void 0)},850895:s=>{u.jb("Cos",s,void 0)},850946:s=>{u.jb("Tan",s,void 0)},850997:s=>{u.jb("Asin",s,void 0)},851049:s=>{u.jb("Acos",s,void 0)},851101:s=>{u.jb("Atan",s,void 0)},851153:s=>{u.jb("Sinh",s,void 0)},851205:s=>{u.jb("Cosh",s,void 0)},851257:s=>{u.jb("Asinh",s,void 0)},851310:s=>{u.jb("Acosh",s,void 0)},851363:s=>{u.jb("Atanh",s,void 0)},851416:s=>{u.jb("Tanh",s,void 0)},851468:s=>{u.jb("Not",s,void 0)},851519:(s,c,f)=>{u.jb("Clip",s,{min:c,max:f})},851588:s=>{u.jb("Clip",s,void 0)},851640:(s,c)=>{u.jb("Elu",s,{alpha:c})},851698:s=>{u.jb("Relu",s,void 0)},851750:(s,c)=>{u.jb("LeakyRelu",s,{alpha:c})},851814:(s,c)=>{u.jb("ThresholdedRelu",s,{alpha:c})},851884:(s,c)=>{u.jb("Cast",s,{to:c})},851942:s=>{u.jb("Add",s,void 0)},851993:s=>{u.jb("Sub",s,void 0)},852044:s=>{u.jb("Mul",s,void 0)},852095:s=>{u.jb("Div",s,void 0)},852146:s=>{u.jb("Pow",s,void 0)},852197:s=>{u.jb("Equal",s,void 0)},852250:s=>{u.jb("Greater",s,void 0)},852305:s=>{u.jb("GreaterOrEqual",s,void 0)},852367:s=>{u.jb("Less",s,void 0)},852419:s=>{u.jb("LessOrEqual",s,void 0)},852478:(s,c,f,y,v)=>{u.jb("ReduceMean",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},852637:(s,c,f,y,v)=>{u.jb("ReduceMax",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},852795:(s,c,f,y,v)=>{u.jb("ReduceMin",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},852953:(s,c,f,y,v)=>{u.jb("ReduceProd",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},853112:(s,c,f,y,v)=>{u.jb("ReduceSum",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},853270:(s,c,f,y,v)=>{u.jb("ReduceL1",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},853427:(s,c,f,y,v)=>{u.jb("ReduceL2",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},853584:(s,c,f,y,v)=>{u.jb("ReduceLogSum",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},853745:(s,c,f,y,v)=>{u.jb("ReduceSumSquare",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},853909:(s,c,f,y,v)=>{u.jb("ReduceLogSumExp",s,{keepDims:!!c,noopWithEmptyAxes:!!f,axes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},854073:s=>{u.jb("Where",s,void 0)},854126:(s,c,f)=>{u.jb("Transpose",s,{perm:c?Array.from(i().subarray(c>>>0,f>>>0)):[]})},854234:(s,c,f,y)=>{u.jb("DepthToSpace",s,{blocksize:c,mode:Ae(f),format:y?"NHWC":"NCHW"})},854367:(s,c,f,y)=>{u.jb("DepthToSpace",s,{blocksize:c,mode:Ae(f),format:y?"NHWC":"NCHW"})},854500:(s,c,f,y,v,C,O,B,N,L,j,me,he,P,ee)=>{u.jb("ConvTranspose",s,{format:N?"NHWC":"NCHW",autoPad:c,dilations:[f],group:y,kernelShape:[v],pads:[C,O],strides:[B],wIsConst:()=>!!t()[L>>>0],outputPadding:j?Array.from(i().subarray(j>>>0,me>>>0)):[],outputShape:he?Array.from(i().subarray(he>>>0,P>>>0)):[],activation:Ae(ee)})},854901:(s,c,f,y,v,C,O,B,N,L,j,me,he,P)=>{u.jb("ConvTranspose",s,{format:B?"NHWC":"NCHW",autoPad:c,dilations:Array.from(i().subarray(f>>>0,2+(f>>>0)>>>0)),group:y,kernelShape:Array.from(i().subarray(v>>>0,2+(v>>>0)>>>0)),pads:Array.from(i().subarray(C>>>0,4+(C>>>0)>>>0)),strides:Array.from(i().subarray(O>>>0,2+(O>>>0)>>>0)),wIsConst:()=>!!t()[N>>>0],outputPadding:L?Array.from(i().subarray(L>>>0,j>>>0)):[],outputShape:me?Array.from(i().subarray(me>>>0,he>>>0)):[],activation:Ae(P)})},855466:(s,c,f,y,v,C,O,B,N,L,j,me,he,P,ee)=>{u.jb("ConvTranspose",s,{format:N?"NHWC":"NCHW",autoPad:c,dilations:[f],group:y,kernelShape:[v],pads:[C,O],strides:[B],wIsConst:()=>!!t()[L>>>0],outputPadding:j?Array.from(i().subarray(j>>>0,me>>>0)):[],outputShape:he?Array.from(i().subarray(he>>>0,P>>>0)):[],activation:Ae(ee)})},855867:(s,c,f,y,v,C,O,B,N,L,j,me,he,P)=>{u.jb("ConvTranspose",s,{format:B?"NHWC":"NCHW",autoPad:c,dilations:Array.from(i().subarray(f>>>0,2+(f>>>0)>>>0)),group:y,kernelShape:Array.from(i().subarray(v>>>0,2+(v>>>0)>>>0)),pads:Array.from(i().subarray(C>>>0,4+(C>>>0)>>>0)),strides:Array.from(i().subarray(O>>>0,2+(O>>>0)>>>0)),wIsConst:()=>!!t()[N>>>0],outputPadding:L?Array.from(i().subarray(L>>>0,j>>>0)):[],outputShape:me?Array.from(i().subarray(me>>>0,he>>>0)):[],activation:Ae(P)})},856432:(s,c)=>{u.jb("GlobalAveragePool",s,{format:c?"NHWC":"NCHW"})},856523:(s,c,f,y,v,C,O,B,N,L,j,me,he,P,ee,ye)=>{u.jb("AveragePool",s,{format:ye?"NHWC":"NCHW",auto_pad:c,ceil_mode:f,count_include_pad:y,storage_order:v,dilations:[C,O],kernel_shape:[B,N],pads:[L,j,me,he],strides:[P,ee]})},856807:(s,c)=>{u.jb("GlobalAveragePool",s,{format:c?"NHWC":"NCHW"})},856898:(s,c,f,y,v,C,O,B,N,L,j,me,he,P,ee,ye)=>{u.jb("AveragePool",s,{format:ye?"NHWC":"NCHW",auto_pad:c,ceil_mode:f,count_include_pad:y,storage_order:v,dilations:[C,O],kernel_shape:[B,N],pads:[L,j,me,he],strides:[P,ee]})},857182:(s,c)=>{u.jb("GlobalMaxPool",s,{format:c?"NHWC":"NCHW"})},857269:(s,c,f,y,v,C,O,B,N,L,j,me,he,P,ee,ye)=>{u.jb("MaxPool",s,{format:ye?"NHWC":"NCHW",auto_pad:c,ceil_mode:f,count_include_pad:y,storage_order:v,dilations:[C,O],kernel_shape:[B,N],pads:[L,j,me,he],strides:[P,ee]})},857549:(s,c)=>{u.jb("GlobalMaxPool",s,{format:c?"NHWC":"NCHW"})},857636:(s,c,f,y,v,C,O,B,N,L,j,me,he,P,ee,ye)=>{u.jb("MaxPool",s,{format:ye?"NHWC":"NCHW",auto_pad:c,ceil_mode:f,count_include_pad:y,storage_order:v,dilations:[C,O],kernel_shape:[B,N],pads:[L,j,me,he],strides:[P,ee]})},857916:(s,c,f,y,v)=>{u.jb("Gemm",s,{alpha:c,beta:f,transA:y,transB:v})},858020:s=>{u.jb("MatMul",s,void 0)},858074:(s,c,f,y)=>{u.jb("ArgMax",s,{keepDims:!!c,selectLastIndex:!!f,axis:y})},858182:(s,c,f,y)=>{u.jb("ArgMin",s,{keepDims:!!c,selectLastIndex:!!f,axis:y})},858290:(s,c)=>{u.jb("Softmax",s,{axis:c})},858353:(s,c)=>{u.jb("Concat",s,{axis:c})},858413:(s,c,f,y,v)=>{u.jb("Split",s,{axis:c,numOutputs:f,splitSizes:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},858553:s=>{u.jb("Expand",s,void 0)},858607:(s,c)=>{u.jb("Gather",s,{axis:Number(c)})},858678:(s,c)=>{u.jb("GatherElements",s,{axis:Number(c)})},858757:(s,c,f,y,v,C,O,B,N,L,j)=>{u.jb("Resize",s,{antialias:c,axes:f?Array.from(i().subarray(f>>>0,y>>>0)):[],coordinateTransformMode:Ae(v),cubicCoeffA:C,excludeOutside:O,extrapolationValue:B,keepAspectRatioPolicy:Ae(N),mode:Ae(L),nearestMode:Ae(j)})},859103:(s,c,f,y,v,C,O)=>{u.jb("Slice",s,{starts:c?Array.from(i().subarray(c>>>0,f>>>0)):[],ends:y?Array.from(i().subarray(y>>>0,v>>>0)):[],axes:C?Array.from(i().subarray(C>>>0,O>>>0)):[]})},859319:s=>{u.jb("Tile",s,void 0)},859371:(s,c,f)=>{u.jb("InstanceNormalization",s,{epsilon:c,format:f?"NHWC":"NCHW"})},859485:(s,c,f)=>{u.jb("InstanceNormalization",s,{epsilon:c,format:f?"NHWC":"NCHW"})},859599:s=>{u.jb("Range",s,void 0)},859652:(s,c)=>{u.jb("Einsum",s,{equation:Ae(c)})},859733:(s,c,f,y,v)=>{u.jb("Pad",s,{mode:c,value:f,pads:y?Array.from(i().subarray(y>>>0,v>>>0)):[]})},859860:(s,c,f,y,v,C)=>{u.jb("BatchNormalization",s,{epsilon:c,momentum:f,spatial:!!v,trainingMode:!!y,format:C?"NHWC":"NCHW"})},860029:(s,c,f,y,v,C)=>{u.jb("BatchNormalization",s,{epsilon:c,momentum:f,spatial:!!v,trainingMode:!!y,format:C?"NHWC":"NCHW"})},860198:(s,c,f)=>{u.jb("CumSum",s,{exclusive:Number(c),reverse:Number(f)})},860295:(s,c,f,y,v,C,O,B,N)=>{u.jb("Attention",s,{numHeads:c,isUnidirectional:f,maskFilterValue:y,scale:v,doRotary:C,qkvHiddenSizes:O?Array.from(i().subarray(Number(B)>>>0,Number(B)+O>>>0)):[],pastPresentShareBuffer:!!N})},860567:s=>{u.jb("BiasAdd",s,void 0)},860622:s=>{u.jb("BiasSplitGelu",s,void 0)},860683:s=>{u.jb("FastGelu",s,void 0)},860739:(s,c,f,y,v,C,O,B,N,L,j,me,he,P,ee,ye)=>{u.jb("Conv",s,{format:me?"NHWC":"NCHW",auto_pad:c,dilations:f?Array.from(i().subarray(f>>>0,y>>>0)):[],group:v,kernel_shape:C?Array.from(i().subarray(C>>>0,O>>>0)):[],pads:B?Array.from(i().subarray(B>>>0,N>>>0)):[],strides:L?Array.from(i().subarray(L>>>0,j>>>0)):[],w_is_const:()=>!!t()[he>>>0],activation:Ae(P),activation_params:ee?Array.from(l().subarray(ee>>>0,ye>>>0)):[]})},861235:s=>{u.jb("Gelu",s,void 0)},861287:(s,c,f,y)=>{u.jb("GroupQueryAttention",s,{numHeads:c,kvNumHeads:f,scale:y})},861400:(s,c,f,y)=>{u.jb("LayerNormalization",s,{axis:c,epsilon:f,simplified:!!y})},861511:(s,c,f,y)=>{u.jb("LayerNormalization",s,{axis:c,epsilon:f,simplified:!!y})},861622:(s,c,f,y,v,C)=>{u.jb("MatMulNBits",s,{k:c,n:f,accuracyLevel:y,bits:v,blockSize:C})},861749:(s,c,f,y,v,C)=>{u.jb("MultiHeadAttention",s,{numHeads:c,isUnidirectional:f,maskFilterValue:y,scale:v,doRotary:C})},861908:(s,c)=>{u.jb("QuickGelu",s,{alpha:c})},861972:(s,c,f,y,v)=>{u.jb("RotaryEmbedding",s,{interleaved:!!c,numHeads:f,rotaryEmbeddingDim:y,scale:v})},862111:(s,c,f)=>{u.jb("SkipLayerNormalization",s,{epsilon:c,simplified:!!f})},862213:s=>{u.Yb(s)},862247:(s,c)=>u.$b(s,c,u.Eb.bc,u.Eb.errors),862359:(s,c,f)=>{u.jb("SkipLayerNormalization",s,{epsilon:c,simplified:!!f})}};function Nl(s,c,f){return hi(async()=>{await u.Wb(s,c,f)})}function Wl(){return typeof wasmOffsetConverter<"u"}function hn(s){this.name="ExitStatus",this.message=`Program terminated with exit(${s})`,this.status=s}var gn=s=>{s.terminate(),s.onmessage=()=>{}},Ro=s=>{ct.length==0&&(Ho(),Wo(ct[0]));var c=ct.pop();if(!c)return 6;wt.push(c),Ze[s.Ab]=c,c.Ab=s.Ab;var f={cmd:"run",start_routine:s.cc,arg:s.Pb,pthread_ptr:s.Ab};return c.postMessage(f,s.ic),0},bt=0,xe=(s,c,...f)=>{for(var y=2*f.length,v=Bn(),C=zn(8*y),O=C>>>3,B=0;B<f.length;B++){var N=f[B];typeof N=="bigint"?(F[O+2*B]=1n,F[O+2*B+1]=N):(F[O+2*B]=0n,d()[O+2*B+1>>>0]=N)}return s=Vi(s,0,y,C,c),yr(v),s};function yn(s){if(b)return xe(0,1,s);if(de=s,!(0<bt)){for(var c of wt)gn(c);for(c of ct)gn(c);ct=[],wt=[],Ze=[],Se=!0}A(s,new hn(s))}function Mo(s){if(b)return xe(1,0,s);bn(s)}var bn=s=>{if(de=s,b)throw Mo(s),"unwind";yn(s)},ct=[],wt=[],Uo=[],Ze={},Vo=s=>{var c=s.Ab;delete Ze[c],ct.push(s),wt.splice(wt.indexOf(s),1),s.Ab=0,Dn(c)};function No(){Uo.forEach(s=>s())}var Wo=s=>new Promise(c=>{s.onmessage=v=>{var C=(v=v.data).cmd;if(v.targetThread&&v.targetThread!=Mt()){var O=Ze[v.targetThread];O?O.postMessage(v,v.transferList):Y(`Internal error! Worker sent a message "${C}" to target pthread ${v.targetThread}, but that thread no longer exists!`)}else C==="checkMailbox"?sr():C==="spawnThread"?Ro(v):C==="cleanupThread"?Vo(Ze[v.thread]):C==="killThread"?(v=v.thread,C=Ze[v],delete Ze[v],gn(C),Dn(v),wt.splice(wt.indexOf(C),1),C.Ab=0):C==="cancelThread"?Ze[v.thread].postMessage({cmd:"cancel"}):C==="loaded"?(s.loaded=!0,c(s)):C==="alert"?alert(`Thread ${v.threadId}: ${v.text}`):v.target==="setimmediate"?s.postMessage(v):C==="callHandler"?u[v.handler](...v.args):C&&Y(`worker sent an unknown command ${C}`)},s.onerror=v=>{throw Y(`worker sent an error! ${v.filename}:${v.lineno}: ${v.message}`),v};var f,y=[];for(f of[])u.hasOwnProperty(f)&&y.push(f);s.postMessage({cmd:"load",handlers:y,wasmMemory:le,wasmModule:K})});function Ho(){var s=new Worker(new URL(import.meta.url),{type:"module",workerData:"em-pthread",name:"em-pthread"});ct.push(s)}var ar=s=>{for(;0<s.length;)s.shift()(u)},Hl=()=>{var s=Mt(),c=a()[s+52>>>2>>>0];s=a()[s+56>>>2>>>0],Wi(c,c-s),yr(c)},Gl=(s,c)=>{bt=0,s=Hi(s,c),0<bt?de=s:gr(s)};class Ll{constructor(c){this.Ib=c-24}}function Fl(s,c,f){var y=new Ll(s>>>=0);throw c>>>=0,f>>>=0,a()[y.Ib+16>>>2>>>0]=0,a()[y.Ib+4>>>2>>>0]=c,a()[y.Ib+8>>>2>>>0]=f,s}function Go(s,c,f,y){return b?xe(2,1,s,c,f,y):Lo(s,c,f,y)}function Lo(s,c,f,y){if(s>>>=0,c>>>=0,f>>>=0,y>>>=0,x===void 0)return Y("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var v=[];return b&&v.length===0?Go(s,c,f,y):(s={cc:f,Ab:s,Pb:y,ic:v},b?(s.Lb="spawnThread",postMessage(s,v),0):Ro(s))}var Fo=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0,qo=(s,c,f)=>{var y=(c>>>=0)+f;for(f=c;s[f]&&!(f>=y);)++f;if(16<f-c&&s.buffer&&Fo)return Fo.decode(s.buffer instanceof x?s.slice(c,f):s.subarray(c,f));for(y="";c<f;){var v=s[c++];if(128&v){var C=63&s[c++];if((224&v)==192)y+=String.fromCharCode((31&v)<<6|C);else{var O=63&s[c++];65536>(v=(240&v)==224?(15&v)<<12|C<<6|O:(7&v)<<18|C<<12|O<<6|63&s[c++])?y+=String.fromCharCode(v):(v-=65536,y+=String.fromCharCode(55296|v>>10,56320|1023&v))}}else y+=String.fromCharCode(v)}return y},Ae=(s,c)=>(s>>>=0)?qo(r(),s,c):"";function jo(s,c,f){return b?xe(3,1,s,c,f):0}function Ko(s,c){if(b)return xe(4,1,s,c)}var wn=s=>{for(var c=0,f=0;f<s.length;++f){var y=s.charCodeAt(f);127>=y?c++:2047>=y?c+=2:55296<=y&&57343>=y?(c+=4,++f):c+=3}return c},Yo=(s,c,f,y)=>{if(!(0<y))return 0;var v=f>>>=0;y=f+y-1;for(var C=0;C<s.length;++C){var O=s.charCodeAt(C);if(55296<=O&&57343>=O&&(O=65536+((1023&O)<<10)|1023&s.charCodeAt(++C)),127>=O){if(f>=y)break;c[f++>>>0]=O}else{if(2047>=O){if(f+1>=y)break;c[f++>>>0]=192|O>>6}else{if(65535>=O){if(f+2>=y)break;c[f++>>>0]=224|O>>12}else{if(f+3>=y)break;c[f++>>>0]=240|O>>18,c[f++>>>0]=128|O>>12&63}c[f++>>>0]=128|O>>6&63}c[f++>>>0]=128|63&O}}return c[f>>>0]=0,f-v},zt=(s,c,f)=>Yo(s,r(),c,f);function Xo(s,c){if(b)return xe(5,1,s,c)}function Zo(s,c,f){if(b)return xe(6,1,s,c,f)}function Qo(s,c,f){return b?xe(7,1,s,c,f):0}function Jo(s,c){if(b)return xe(8,1,s,c)}function ei(s,c,f){if(b)return xe(9,1,s,c,f)}function ti(s,c,f,y){if(b)return xe(10,1,s,c,f,y)}function ri(s,c,f,y){if(b)return xe(11,1,s,c,f,y)}function ni(s,c,f,y){if(b)return xe(12,1,s,c,f,y)}function oi(s){if(b)return xe(13,1,s)}function ii(s,c){if(b)return xe(14,1,s,c)}function ai(s,c,f){if(b)return xe(15,1,s,c,f)}var si,pt,ql=()=>{Dt("")},Qe=s=>{for(var c="";r()[s>>>0];)c+=si[r()[s++>>>0]];return c},vn={},$n={},jl={};function st(s,c,f={}){if(!("argPackAdvance"in c))throw new TypeError("registerType registeredInstance requires argPackAdvance");return function(y,v,C={}){var O=v.name;if(!y)throw new pt(`type "${O}" must have a positive integer typeid pointer`);if($n.hasOwnProperty(y)){if(C.Rb)return;throw new pt(`Cannot register type '${O}' twice`)}$n[y]=v,delete jl[y],vn.hasOwnProperty(y)&&(v=vn[y],delete vn[y],v.forEach(B=>B()))}(s,c,f)}var ui=(s,c,f)=>{switch(c){case 1:return f?y=>t()[y>>>0]:y=>r()[y>>>0];case 2:return f?y=>n()[y>>>1>>>0]:y=>o()[y>>>1>>>0];case 4:return f?y=>i()[y>>>2>>>0]:y=>a()[y>>>2>>>0];case 8:return f?y=>F[y>>>3]:y=>ce[y>>>3];default:throw new TypeError(`invalid integer width (${c}): ${s}`)}};function Kl(s,c,f){f>>>=0,st(s>>>=0,{name:c=Qe(c>>>0),fromWireType:y=>y,toWireType:function(y,v){if(typeof v!="bigint"&&typeof v!="number")throw v=v===null?"null":(y=typeof v)=="object"||y==="array"||y==="function"?v.toString():""+v,new TypeError(`Cannot convert "${v}" to ${this.name}`);return typeof v=="number"&&(v=BigInt(v)),v},argPackAdvance:mt,readValueFromPointer:ui(c,f,c.indexOf("u")==-1),Db:null})}var mt=8;function Yl(s,c,f,y){st(s>>>=0,{name:c=Qe(c>>>0),fromWireType:function(v){return!!v},toWireType:function(v,C){return C?f:y},argPackAdvance:mt,readValueFromPointer:function(v){return this.fromWireType(r()[v>>>0])},Db:null})}var _n=[],ut=[];function xn(s){9<(s>>>=0)&&--ut[s+1]==0&&(ut[s]=void 0,_n.push(s))}var qe=s=>{if(!s)throw new pt("Cannot use deleted val. handle = "+s);return ut[s]},je=s=>{switch(s){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let c=_n.pop()||ut.length;return ut[c]=s,ut[c+1]=1,c}};function Sn(s){return this.fromWireType(a()[s>>>2>>>0])}var Xl={name:"emscripten::val",fromWireType:s=>{var c=qe(s);return xn(s),c},toWireType:(s,c)=>je(c),argPackAdvance:mt,readValueFromPointer:Sn,Db:null};function Zl(s){return st(s>>>0,Xl)}var Ql=(s,c)=>{switch(c){case 4:return function(f){return this.fromWireType(l()[f>>>2>>>0])};case 8:return function(f){return this.fromWireType(d()[f>>>3>>>0])};default:throw new TypeError(`invalid float width (${c}): ${s}`)}};function Jl(s,c,f){f>>>=0,st(s>>>=0,{name:c=Qe(c>>>0),fromWireType:y=>y,toWireType:(y,v)=>v,argPackAdvance:mt,readValueFromPointer:Ql(c,f),Db:null})}function ec(s,c,f,y,v){if(s>>>=0,f>>>=0,c=Qe(c>>>0),v===-1&&(v=4294967295),v=B=>B,y===0){var C=32-8*f;v=B=>B<<C>>>C}var O=c.includes("unsigned")?function(B,N){return N>>>0}:function(B,N){return N};st(s,{name:c,fromWireType:v,toWireType:O,argPackAdvance:mt,readValueFromPointer:ui(c,f,y!==0),Db:null})}function tc(s,c,f){function y(C){var O=a()[C>>>2>>>0];return C=a()[C+4>>>2>>>0],new v(t().buffer,C,O)}var v=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][c];st(s>>>=0,{name:f=Qe(f>>>0),fromWireType:y,argPackAdvance:mt,readValueFromPointer:y},{Rb:!0})}function rc(s,c){s>>>=0;var f=(c=Qe(c>>>0))==="std::string";st(s,{name:c,fromWireType:function(y){var v=a()[y>>>2>>>0],C=y+4;if(f)for(var O=C,B=0;B<=v;++B){var N=C+B;if(B==v||r()[N>>>0]==0){if(O=Ae(O,N-O),L===void 0)var L=O;else L+=String.fromCharCode(0),L+=O;O=N+1}}else{for(L=Array(v),B=0;B<v;++B)L[B]=String.fromCharCode(r()[C+B>>>0]);L=L.join("")}return et(y),L},toWireType:function(y,v){v instanceof ArrayBuffer&&(v=new Uint8Array(v));var C=typeof v=="string";if(!(C||v instanceof Uint8Array||v instanceof Uint8ClampedArray||v instanceof Int8Array))throw new pt("Cannot pass non-string to std::string");var O=f&&C?wn(v):v.length,B=hr(4+O+1),N=B+4;if(a()[B>>>2>>>0]=O,f&&C)zt(v,N,O+1);else if(C)for(C=0;C<O;++C){var L=v.charCodeAt(C);if(255<L)throw et(N),new pt("String has UTF-16 code units that do not fit in 8 bits");r()[N+C>>>0]=L}else for(C=0;C<O;++C)r()[N+C>>>0]=v[C];return y!==null&&y.push(et,B),B},argPackAdvance:mt,readValueFromPointer:Sn,Db(y){et(y)}})}var di=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,nc=(s,c)=>{for(var f=s>>1,y=f+c/2;!(f>=y)&&o()[f>>>0];)++f;if(32<(f<<=1)-s&&di)return di.decode(r().slice(s,f));for(f="",y=0;!(y>=c/2);++y){var v=n()[s+2*y>>>1>>>0];if(v==0)break;f+=String.fromCharCode(v)}return f},oc=(s,c,f)=>{if(f??=2147483647,2>f)return 0;var y=c;f=(f-=2)<2*s.length?f/2:s.length;for(var v=0;v<f;++v){var C=s.charCodeAt(v);n()[c>>>1>>>0]=C,c+=2}return n()[c>>>1>>>0]=0,c-y},ic=s=>2*s.length,ac=(s,c)=>{for(var f=0,y="";!(f>=c/4);){var v=i()[s+4*f>>>2>>>0];if(v==0)break;++f,65536<=v?(v-=65536,y+=String.fromCharCode(55296|v>>10,56320|1023&v)):y+=String.fromCharCode(v)}return y},sc=(s,c,f)=>{if(c>>>=0,f??=2147483647,4>f)return 0;var y=c;f=y+f-4;for(var v=0;v<s.length;++v){var C=s.charCodeAt(v);if(55296<=C&&57343>=C&&(C=65536+((1023&C)<<10)|1023&s.charCodeAt(++v)),i()[c>>>2>>>0]=C,(c+=4)+4>f)break}return i()[c>>>2>>>0]=0,c-y},uc=s=>{for(var c=0,f=0;f<s.length;++f){var y=s.charCodeAt(f);55296<=y&&57343>=y&&++f,c+=4}return c};function dc(s,c,f){if(s>>>=0,c>>>=0,f=Qe(f>>>=0),c===2)var y=nc,v=oc,C=ic,O=B=>o()[B>>>1>>>0];else c===4&&(y=ac,v=sc,C=uc,O=B=>a()[B>>>2>>>0]);st(s,{name:f,fromWireType:B=>{for(var N,L=a()[B>>>2>>>0],j=B+4,me=0;me<=L;++me){var he=B+4+me*c;me!=L&&O(he)!=0||(j=y(j,he-j),N===void 0?N=j:(N+=String.fromCharCode(0),N+=j),j=he+c)}return et(B),N},toWireType:(B,N)=>{if(typeof N!="string")throw new pt(`Cannot pass non-string to C++ string type ${f}`);var L=C(N),j=hr(4+L+c);return a()[j>>>2>>>0]=L/c,v(N,j+4,L+c),B!==null&&B.push(et,j),j},argPackAdvance:mt,readValueFromPointer:Sn,Db(B){et(B)}})}function lc(s,c){st(s>>>=0,{Sb:!0,name:c=Qe(c>>>0),argPackAdvance:0,fromWireType:()=>{},toWireType:()=>{}})}var cc=()=>1;function pc(s){On(s>>>0,!g,1,!w,131072,!1),No()}var li=s=>{if(!Se)try{if(s(),!(0<bt))try{b?gr(de):bn(de)}catch(c){c instanceof hn||c=="unwind"||A(1,c)}}catch(c){c instanceof hn||c=="unwind"||A(1,c)}};function In(s){s>>>=0,typeof Atomics.jc=="function"&&(Atomics.jc(i(),s>>>2,s).value.then(sr),s+=128,Atomics.store(i(),s>>>2,1))}var sr=()=>{var s=Mt();s&&(In(s),li(Ni))};function mc(s,c){(s>>>=0)==c>>>0?setTimeout(sr):b?postMessage({targetThread:s,cmd:"checkMailbox"}):(s=Ze[s])&&s.postMessage({cmd:"checkMailbox"})}var Cn=[];function fc(s,c,f,y,v){for(c>>>=0,y/=2,Cn.length=y,f=v>>>0>>>3,v=0;v<y;v++)Cn[v]=F[f+2*v]?F[f+2*v+1]:d()[f+2*v+1>>>0];return(c?fn[c]:np[s])(...Cn)}function hc(s){s>>>=0,b?postMessage({cmd:"cleanupThread",thread:s}):Vo(Ze[s])}function gc(s){}var Tn=(s,c)=>{var f=$n[s];if(f===void 0)throw s=Ri(s),f=Qe(s),et(s),new pt(`${c} has unknown type ${f}`);return f},ci=(s,c,f)=>{var y=[];return s=s.toWireType(y,f),y.length&&(a()[c>>>2>>>0]=je(y)),s};function yc(s,c,f){return c>>>=0,f>>>=0,s=qe(s>>>0),c=Tn(c,"emval::as"),ci(c,f,s)}var ur=s=>{try{s()}catch(c){Dt(c)}},ft=0,Je=null,pi=0,dr=[],mi={},fi={},bc=0,An=null,wc=[];function hi(s){return function(c){if(!Se){if(ft===0){var f=!1,y=!1;c((v=0)=>{if(!Se&&(pi=v,f=!0,y)){ft=2,ur(()=>Fi(Je)),typeof Browser<"u"&&Browser.Jb.Qb&&Browser.Jb.resume(),v=!1;try{var C=function(){var N=i()[Je+8>>>2>>>0];return N=q[fi[N]],--bt,N()}()}catch(N){C=N,v=!0}var O=!1;if(!Je){var B=An;B&&(An=null,(v?B.reject:B.resolve)(C),O=!0)}if(v&&!O)throw C}}),y=!0,f||(ft=1,Je=function(){var v=hr(65548),C=v+12;a()[v>>>2>>>0]=C,a()[v+4>>>2>>>0]=C+65536,C=dr[0];var O=mi[C];return O===void 0&&(O=bc++,mi[C]=O,fi[O]=C),C=O,i()[v+8>>>2>>>0]=C,v}(),typeof Browser<"u"&&Browser.Jb.Qb&&Browser.Jb.pause(),ur(()=>Gi(Je)))}else ft===2?(ft=0,ur(qi),et(Je),Je=null,wc.forEach(li)):Dt(`invalid state: ${ft}`);return pi}}(c=>{s().then(c)})}function vc(s){return s>>>=0,hi(()=>(s=qe(s)).then(je))}var lr=[];function $c(s,c,f,y){return f>>>=0,y>>>=0,(s=lr[s>>>0])(null,c=qe(c>>>0),f,y)}var _c={},cr=s=>{var c=_c[s];return c===void 0?Qe(s):c};function xc(s,c,f,y,v){return f>>>=0,y>>>=0,v>>>=0,(s=lr[s>>>0])(c=qe(c>>>0),c[f=cr(f)],y,v)}var gi=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Sc(s){return(s>>>=0)==0?je(gi()):(s=cr(s),je(gi()[s]))}var Ic=s=>{var c=lr.length;return lr.push(s),c},Cc=(s,c)=>{for(var f=Array(s),y=0;y<s;++y)f[y]=Tn(a()[c+4*y>>>2>>>0],"parameter "+y);return f},yi=(s,c)=>Object.defineProperty(c,"name",{value:s});function Tc(s,c,f){var y=(c=Cc(s,c>>>0)).shift();s--;var v=`return function (obj, func, destructorsRef, args) {
`,C=0,O=[];f===0&&O.push("obj");for(var B=["retType"],N=[y],L=0;L<s;++L)O.push("arg"+L),B.push("argType"+L),N.push(c[L]),v+=`  var arg${L} = argType${L}.readValueFromPointer(args${C?"+"+C:""});
`,C+=c[L].argPackAdvance;return v+=`  var rv = ${f===1?"new func":"func.call"}(${O.join(", ")});
`,y.Sb||(B.push("emval_returnValue"),N.push(ci),v+=`  return emval_returnValue(retType, destructorsRef, rv);
`),B.push(v+`};
`),s=function(j){var me=Function;if(!(me instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof me} which is not a function`);var he=yi(me.name||"unknownFunctionName",function(){});return he.prototype=me.prototype,he=new he,(j=me.apply(he,j))instanceof Object?j:he}(B)(...N),f=`methodCaller<(${c.map(j=>j.name).join(", ")}) => ${y.name}>`,Ic(yi(f,s))}function Ac(s){return s=cr(s>>>0),je(u[s])}function Ec(s,c){return c>>>=0,s=qe(s>>>0),c=qe(c),je(s[c])}function kc(s){9<(s>>>=0)&&(ut[s+1]+=1)}function Pc(){return je([])}function Oc(s){s=qe(s>>>0);for(var c=Array(s.length),f=0;f<s.length;f++)c[f]=s[f];return je(c)}function Dc(s){return je(cr(s>>>0))}function zc(){return je({})}function Bc(s){for(var c=qe(s>>>=0);c.length;){var f=c.pop();c.pop()(f)}xn(s)}function Rc(s,c,f){c>>>=0,f>>>=0,s=qe(s>>>0),c=qe(c),f=qe(f),s[c]=f}function Mc(s,c){return c>>>=0,s=(s=Tn(s>>>0,"_emval_take_value")).readValueFromPointer(c),je(s)}function Uc(s,c){s=-9007199254740992>s||9007199254740992<s?NaN:Number(s),c>>>=0,s=new Date(1e3*s),i()[c>>>2>>>0]=s.getUTCSeconds(),i()[c+4>>>2>>>0]=s.getUTCMinutes(),i()[c+8>>>2>>>0]=s.getUTCHours(),i()[c+12>>>2>>>0]=s.getUTCDate(),i()[c+16>>>2>>>0]=s.getUTCMonth(),i()[c+20>>>2>>>0]=s.getUTCFullYear()-1900,i()[c+24>>>2>>>0]=s.getUTCDay(),s=(s.getTime()-Date.UTC(s.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,i()[c+28>>>2>>>0]=s}var Bt=s=>s%4==0&&(s%100!=0||s%400==0),bi=[0,31,60,91,121,152,182,213,244,274,305,335],wi=[0,31,59,90,120,151,181,212,243,273,304,334];function Vc(s,c){s=-9007199254740992>s||9007199254740992<s?NaN:Number(s),c>>>=0,s=new Date(1e3*s),i()[c>>>2>>>0]=s.getSeconds(),i()[c+4>>>2>>>0]=s.getMinutes(),i()[c+8>>>2>>>0]=s.getHours(),i()[c+12>>>2>>>0]=s.getDate(),i()[c+16>>>2>>>0]=s.getMonth(),i()[c+20>>>2>>>0]=s.getFullYear()-1900,i()[c+24>>>2>>>0]=s.getDay();var f=(Bt(s.getFullYear())?bi:wi)[s.getMonth()]+s.getDate()-1|0;i()[c+28>>>2>>>0]=f,i()[c+36>>>2>>>0]=-60*s.getTimezoneOffset(),f=new Date(s.getFullYear(),6,1).getTimezoneOffset();var y=new Date(s.getFullYear(),0,1).getTimezoneOffset();s=0|(f!=y&&s.getTimezoneOffset()==Math.min(y,f)),i()[c+32>>>2>>>0]=s}function Nc(s){s>>>=0;var c=new Date(i()[s+20>>>2>>>0]+1900,i()[s+16>>>2>>>0],i()[s+12>>>2>>>0],i()[s+8>>>2>>>0],i()[s+4>>>2>>>0],i()[s>>>2>>>0],0),f=i()[s+32>>>2>>>0],y=c.getTimezoneOffset(),v=new Date(c.getFullYear(),6,1).getTimezoneOffset(),C=new Date(c.getFullYear(),0,1).getTimezoneOffset(),O=Math.min(C,v);return 0>f?i()[s+32>>>2>>>0]=+(v!=C&&O==y):0<f!=(O==y)&&(v=Math.max(C,v),c.setTime(c.getTime()+6e4*((0<f?O:v)-y))),i()[s+24>>>2>>>0]=c.getDay(),f=(Bt(c.getFullYear())?bi:wi)[c.getMonth()]+c.getDate()-1|0,i()[s+28>>>2>>>0]=f,i()[s>>>2>>>0]=c.getSeconds(),i()[s+4>>>2>>>0]=c.getMinutes(),i()[s+8>>>2>>>0]=c.getHours(),i()[s+12>>>2>>>0]=c.getDate(),i()[s+16>>>2>>>0]=c.getMonth(),i()[s+20>>>2>>>0]=c.getYear(),s=c.getTime(),BigInt(isNaN(s)?-1:s/1e3)}function vi(s,c,f,y,v,C,O){return b?xe(16,1,s,c,f,y,v,C,O):-52}function $i(s,c,f,y,v,C){if(b)return xe(17,1,s,c,f,y,v,C)}function Wc(s,c,f,y){s>>>=0,c>>>=0,f>>>=0,y>>>=0;var v=new Date().getFullYear(),C=new Date(v,0,1),O=new Date(v,6,1);v=C.getTimezoneOffset();var B=O.getTimezoneOffset(),N=Math.max(v,B);a()[s>>>2>>>0]=60*N,i()[c>>>2>>>0]=+(v!=B),C=(s=L=>L.toLocaleTimeString(void 0,{hour12:!1,timeZoneName:"short"}).split(" ")[1])(C),O=s(O),B<v?(zt(C,f,17),zt(O,y,17)):(zt(C,y,17),zt(O,f,17))}var En=[],_i=(s,c)=>{En.length=0;for(var f;f=r()[s++>>>0];){var y=f!=105;c+=(y&=f!=112)&&c%8?4:0,En.push(f==112?a()[c>>>2>>>0]:f==106?F[c>>>3]:f==105?i()[c>>>2>>>0]:d()[c>>>3>>>0]),c+=y?8:4}return En};function Hc(s,c,f){return s>>>=0,c=_i(c>>>0,f>>>0),fn[s](...c)}function Gc(s,c,f){return s>>>=0,c=_i(c>>>0,f>>>0),fn[s](...c)}var Lc=()=>{},Fc=()=>Date.now();function qc(s,c){return Y(Ae(s>>>0,c>>>0))}var xi,jc=()=>{throw bt+=1,"unwind"};function Kc(){return 4294901760}xi=()=>performance.timeOrigin+performance.now();var Yc=()=>navigator.hardwareConcurrency;function Xc(){return Dt("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function Zc(s){s>>>=0;var c=r().length;if(s<=c||4294901760<s)return!1;for(var f=1;4>=f;f*=2){var y=c*(1+.2/f);y=Math.min(y,s+100663296);var v=Math;y=Math.max(s,y);e:{v=(v.min.call(v,4294901760,y+(65536-y%65536)%65536)-le.buffer.byteLength+65535)/65536;try{le.grow(v),we();var C=1;break e}catch{}C=void 0}if(C)return!0}return!1}var pr=()=>(Dt("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Rt={},Si=s=>{s.forEach(c=>{var f=pr();f&&(Rt[f]=c)})};function Qc(){var s=Error().stack.toString().split(`
`);return s[0]=="Error"&&s.shift(),Si(s),Rt.Ob=pr(),Rt.ac=s,Rt.Ob}function Jc(s,c,f){if(s>>>=0,c>>>=0,Rt.Ob==s)var y=Rt.ac;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),Si(y);for(var v=3;y[v]&&pr()!=s;)++v;for(s=0;s<f&&y[s+v];++s)i()[c+4*s>>>2>>>0]=pr();return s}var kn,Pn={},Ii=()=>{if(!kn){var s,c={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:T||"./this.program"};for(s in Pn)Pn[s]===void 0?delete c[s]:c[s]=Pn[s];var f=[];for(s in c)f.push(`${s}=${c[s]}`);kn=f}return kn};function Ci(s,c){if(b)return xe(18,1,s,c);s>>>=0,c>>>=0;var f=0;return Ii().forEach((y,v)=>{var C=c+f;for(v=a()[s+4*v>>>2>>>0]=C,C=0;C<y.length;++C)t()[v++>>>0]=y.charCodeAt(C);t()[v>>>0]=0,f+=y.length+1}),0}function Ti(s,c){if(b)return xe(19,1,s,c);s>>>=0,c>>>=0;var f=Ii();a()[s>>>2>>>0]=f.length;var y=0;return f.forEach(v=>y+=v.length+1),a()[c>>>2>>>0]=y,0}function Ai(s){return b?xe(20,1,s):52}function Ei(s,c,f,y){return b?xe(21,1,s,c,f,y):52}function ki(s,c,f,y){return b?xe(22,1,s,c,f,y):70}var ep=[null,[],[]];function Pi(s,c,f,y){if(b)return xe(23,1,s,c,f,y);c>>>=0,f>>>=0,y>>>=0;for(var v=0,C=0;C<f;C++){var O=a()[c>>>2>>>0],B=a()[c+4>>>2>>>0];c+=8;for(var N=0;N<B;N++){var L=r()[O+N>>>0],j=ep[s];L===0||L===10?((s===1?X:Y)(qo(j,0)),j.length=0):j.push(L)}v+=B}return a()[y>>>2>>>0]=v,0}var Oi=[31,29,31,30,31,30,31,31,30,31,30,31],Di=[31,28,31,30,31,30,31,31,30,31,30,31],tp=(s,c)=>{t().set(s,c>>>0)};function zi(s,c,f,y){function v(P,ee,ye){for(P=typeof P=="number"?P.toString():P||"";P.length<ee;)P=ye[0]+P;return P}function C(P,ee){return v(P,ee,"0")}function O(P,ee){function ye(Ki){return 0>Ki?-1:0<Ki?1:0}var vt;return(vt=ye(P.getFullYear()-ee.getFullYear()))===0&&(vt=ye(P.getMonth()-ee.getMonth()))===0&&(vt=ye(P.getDate()-ee.getDate())),vt}function B(P){switch(P.getDay()){case 0:return new Date(P.getFullYear()-1,11,29);case 1:return P;case 2:return new Date(P.getFullYear(),0,3);case 3:return new Date(P.getFullYear(),0,2);case 4:return new Date(P.getFullYear(),0,1);case 5:return new Date(P.getFullYear()-1,11,31);case 6:return new Date(P.getFullYear()-1,11,30)}}function N(P){var ee=P.Bb;for(P=new Date(new Date(P.Cb+1900,0,1).getTime());0<ee;){var ye=P.getMonth(),vt=(Bt(P.getFullYear())?Oi:Di)[ye];if(!(ee>vt-P.getDate())){P.setDate(P.getDate()+ee);break}ee-=vt-P.getDate()+1,P.setDate(1),11>ye?P.setMonth(ye+1):(P.setMonth(0),P.setFullYear(P.getFullYear()+1))}return ye=new Date(P.getFullYear()+1,0,4),ee=B(new Date(P.getFullYear(),0,4)),ye=B(ye),0>=O(ee,P)?0>=O(ye,P)?P.getFullYear()+1:P.getFullYear():P.getFullYear()-1}s>>>=0,c>>>=0,f>>>=0,y>>>=0;var L=a()[y+40>>>2>>>0];for(var j in y={fc:i()[y>>>2>>>0],ec:i()[y+4>>>2>>>0],Gb:i()[y+8>>>2>>>0],Kb:i()[y+12>>>2>>>0],Hb:i()[y+16>>>2>>>0],Cb:i()[y+20>>>2>>>0],ub:i()[y+24>>>2>>>0],Bb:i()[y+28>>>2>>>0],nc:i()[y+32>>>2>>>0],dc:i()[y+36>>>2>>>0],hc:L?Ae(L):""},f=Ae(f),L={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})f=f.replace(new RegExp(j,"g"),L[j]);var me="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),he="January February March April May June July August September October November December".split(" ");for(j in L={"%a":P=>me[P.ub].substring(0,3),"%A":P=>me[P.ub],"%b":P=>he[P.Hb].substring(0,3),"%B":P=>he[P.Hb],"%C":P=>C((P.Cb+1900)/100|0,2),"%d":P=>C(P.Kb,2),"%e":P=>v(P.Kb,2," "),"%g":P=>N(P).toString().substring(2),"%G":N,"%H":P=>C(P.Gb,2),"%I":P=>((P=P.Gb)==0?P=12:12<P&&(P-=12),C(P,2)),"%j":P=>{for(var ee=0,ye=0;ye<=P.Hb-1;ee+=(Bt(P.Cb+1900)?Oi:Di)[ye++]);return C(P.Kb+ee,3)},"%m":P=>C(P.Hb+1,2),"%M":P=>C(P.ec,2),"%n":()=>`
`,"%p":P=>0<=P.Gb&&12>P.Gb?"AM":"PM","%S":P=>C(P.fc,2),"%t":()=>"	","%u":P=>P.ub||7,"%U":P=>C(Math.floor((P.Bb+7-P.ub)/7),2),"%V":P=>{var ee=Math.floor((P.Bb+7-(P.ub+6)%7)/7);if(2>=(P.ub+371-P.Bb-2)%7&&ee++,ee)ee==53&&((ye=(P.ub+371-P.Bb)%7)==4||ye==3&&Bt(P.Cb)||(ee=1));else{ee=52;var ye=(P.ub+7-P.Bb-1)%7;(ye==4||ye==5&&Bt(P.Cb%400-1))&&ee++}return C(ee,2)},"%w":P=>P.ub,"%W":P=>C(Math.floor((P.Bb+7-(P.ub+6)%7)/7),2),"%y":P=>(P.Cb+1900).toString().substring(2),"%Y":P=>P.Cb+1900,"%z":P=>{var ee=0<=(P=P.dc);return P=Math.abs(P)/60,(ee?"+":"-")+("0000"+(P/60*100+P%60)).slice(-4)},"%Z":P=>P.hc,"%%":()=>"%"},f=f.replace(/%%/g,"\0\0"),L)f.includes(j)&&(f=f.replace(new RegExp(j,"g"),L[j](y)));return j=function(P){var ee=Array(wn(P)+1);return Yo(P,ee,0,ee.length),ee}(f=f.replace(/\0\0/g,"%")),j.length>c?0:(tp(j,s),j.length-1)}function rp(s,c,f,y){return zi(s>>>0,c>>>0,f>>>0,y>>>0)}b||function(){for(var s=u.numThreads-1;s--;)Ho();Lt.unshift(()=>{Fe++,function(c){b?c():Promise.all(ct.map(Wo)).then(c)}(()=>ko())})}();for(var Bi=Array(256),mr=0;256>mr;++mr)Bi[mr]=String.fromCharCode(mr);si=Bi,pt=u.BindingError=class extends Error{constructor(s){super(s),this.name="BindingError"}},u.InternalError=class extends Error{constructor(s){super(s),this.name="InternalError"}},ut.push(0,1,void 0,1,null,1,!0,1,!1,1),u.count_emval_handles=()=>ut.length/2-5-_n.length;var np=[yn,Mo,Go,jo,Ko,Xo,Zo,Qo,Jo,ei,ti,ri,ni,oi,ii,ai,vi,$i,Ci,Ti,Ai,Ei,ki,Pi],q=function(){function s(f,y){return q=f.exports,q=function(){var v=q,C={};for(let[O,B]of Object.entries(v))C[O]=typeof B=="function"?(...N)=>{dr.push(O);try{return B(...N)}finally{Se||(dr.pop(),Je&&ft===1&&dr.length===0&&(ft=0,bt+=1,ur(Li),typeof Fibers<"u"&&Fibers.oc()))}}:B;return C}(),q=function(){var v=q,C=B=>N=>B(N)>>>0,O=B=>()=>B()>>>0;return(v=Object.assign({},v)).Ca=C(v.Ca),v.fb=O(v.fb),v.gb=C(v.gb),v.emscripten_main_runtime_thread_id=O(v.emscripten_main_runtime_thread_id),v.sb=C(v.sb),v.tb=O(v.tb),v}(),Uo.push(q.ib),Pe.unshift(q.Ba),K=y,ko(),q}var c=Bo();if(Fe++,u.instantiateWasm)try{return u.instantiateWasm(c,s)}catch(f){Y(`Module.instantiateWasm callback failed with error: ${f}`),m(f)}return mn||=u.locateFile?Po("ort-wasm-simd-threaded.jsep.wasm")?"ort-wasm-simd-threaded.jsep.wasm":u.locateFile?u.locateFile("ort-wasm-simd-threaded.jsep.wasm",D):D+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,function(f,y){var v=mn;return z||typeof WebAssembly.instantiateStreaming!="function"||Po(v)||Oo(v)||typeof fetch!="function"?zo(v,f,y):fetch(v,{credentials:"same-origin"}).then(C=>WebAssembly.instantiateStreaming(C,f).then(y,function(O){return Y(`wasm streaming compile failed: ${O}`),Y("falling back to ArrayBuffer instantiation"),zo(v,f,y)}))}(c,function(f){s(f.instance,f.module)}).catch(m),{}}(),Ri=s=>(Ri=q.Ca)(s),Mi=()=>(Mi=q.Da)();u._OrtInit=(s,c)=>(u._OrtInit=q.Ea)(s,c),u._OrtGetLastError=(s,c)=>(u._OrtGetLastError=q.Fa)(s,c),u._OrtCreateSessionOptions=(s,c,f,y,v,C,O,B,N,L)=>(u._OrtCreateSessionOptions=q.Ga)(s,c,f,y,v,C,O,B,N,L),u._OrtAppendExecutionProvider=(s,c)=>(u._OrtAppendExecutionProvider=q.Ha)(s,c),u._OrtAddFreeDimensionOverride=(s,c,f)=>(u._OrtAddFreeDimensionOverride=q.Ia)(s,c,f),u._OrtAddSessionConfigEntry=(s,c,f)=>(u._OrtAddSessionConfigEntry=q.Ja)(s,c,f),u._OrtReleaseSessionOptions=s=>(u._OrtReleaseSessionOptions=q.Ka)(s),u._OrtCreateSession=(s,c,f)=>(u._OrtCreateSession=q.La)(s,c,f),u._OrtReleaseSession=s=>(u._OrtReleaseSession=q.Ma)(s),u._OrtGetInputOutputCount=(s,c,f)=>(u._OrtGetInputOutputCount=q.Na)(s,c,f),u._OrtGetInputName=(s,c)=>(u._OrtGetInputName=q.Oa)(s,c),u._OrtGetOutputName=(s,c)=>(u._OrtGetOutputName=q.Pa)(s,c),u._OrtFree=s=>(u._OrtFree=q.Qa)(s),u._OrtCreateTensor=(s,c,f,y,v,C)=>(u._OrtCreateTensor=q.Ra)(s,c,f,y,v,C),u._OrtGetTensorData=(s,c,f,y,v)=>(u._OrtGetTensorData=q.Sa)(s,c,f,y,v),u._OrtReleaseTensor=s=>(u._OrtReleaseTensor=q.Ta)(s),u._OrtCreateRunOptions=(s,c,f,y)=>(u._OrtCreateRunOptions=q.Ua)(s,c,f,y),u._OrtAddRunConfigEntry=(s,c,f)=>(u._OrtAddRunConfigEntry=q.Va)(s,c,f),u._OrtReleaseRunOptions=s=>(u._OrtReleaseRunOptions=q.Wa)(s),u._OrtCreateBinding=s=>(u._OrtCreateBinding=q.Xa)(s),u._OrtBindInput=(s,c,f)=>(u._OrtBindInput=q.Ya)(s,c,f),u._OrtBindOutput=(s,c,f,y)=>(u._OrtBindOutput=q.Za)(s,c,f,y),u._OrtClearBoundOutputs=s=>(u._OrtClearBoundOutputs=q._a)(s),u._OrtReleaseBinding=s=>(u._OrtReleaseBinding=q.$a)(s),u._OrtRunWithBinding=(s,c,f,y,v)=>(u._OrtRunWithBinding=q.ab)(s,c,f,y,v),u._OrtRun=(s,c,f,y,v,C,O,B)=>(u._OrtRun=q.bb)(s,c,f,y,v,C,O,B),u._OrtEndProfiling=s=>(u._OrtEndProfiling=q.cb)(s),u._JsepOutput=(s,c,f)=>(u._JsepOutput=q.db)(s,c,f),u._JsepGetNodeName=s=>(u._JsepGetNodeName=q.eb)(s);var fr,Mt=()=>(Mt=q.fb)(),hr=u._malloc=s=>(hr=u._malloc=q.gb)(s),et=u._free=s=>(et=u._free=q.hb)(s),On=(s,c,f,y,v,C)=>(On=q.kb)(s,c,f,y,v,C),Ui=()=>(Ui=q.lb)(),Vi=(s,c,f,y,v)=>(Vi=q.mb)(s,c,f,y,v),Dn=s=>(Dn=q.nb)(s),gr=s=>(gr=q.ob)(s),Ni=()=>(Ni=q.pb)(),Wi=(s,c)=>(Wi=q.qb)(s,c),yr=s=>(yr=q.rb)(s),zn=s=>(zn=q.sb)(s),Bn=()=>(Bn=q.tb)(),Hi=u.dynCall_ii=(s,c)=>(Hi=u.dynCall_ii=q.vb)(s,c),Gi=s=>(Gi=q.wb)(s),Li=()=>(Li=q.xb)(),Fi=s=>(Fi=q.yb)(s),qi=()=>(qi=q.zb)();function ji(){0<Fe||(b?(p(u),b||ar(Pe),startWorker(u)):(ar(Lt),0<Fe||fr||(fr=!0,u.calledRun=!0,Se||(b||ar(Pe),p(u),b||ar(ze)))))}return u.___start_em_js=862461,u.___stop_em_js=862683,u.stackSave=()=>Bn(),u.stackRestore=s=>yr(s),u.stackAlloc=s=>zn(s),u.UTF8ToString=Ae,u.stringToUTF8=zt,u.lengthBytesUTF8=wn,yt=function s(){fr||ji(),fr||(yt=s)},ji(),h}),mp=Aa;globalThis.self?.name==="em-pthread"&&Aa()});var Ut,fp,hp,gp,Pa,Oa,yp,Da,jt=U(()=>{"use strict";Tr();Ut=!1?void 0:import.meta.url??(typeof document<"u"?document.currentScript?.src:typeof self<"u"?self.location?.href:void 0),fp=!1||typeof location>"u"?void 0:location.origin,hp=(e,t)=>{try{let r=t??Ut;return(r?new URL(e,r):new URL(e)).origin===fp}catch{return!1}},gp=async e=>{let r=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(r)},Pa=(Ta(),br(Ca)).default,Oa=async()=>{if(!Ut)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(hp(Ut))return[void 0,Pa()];let e=await gp(Ut);return[e,Pa(e)]},yp=(ka(),br(Ea)).default,Da=async(e,t,r)=>[void 0,yp]});var Ln,Fn,Rr,za,bp,wp,Ar,Ie,St=U(()=>{"use strict";jt();Fn=!1,Rr=!1,za=!1,bp=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},wp=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Ar=async e=>{if(Fn)return Promise.resolve();if(Rr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(za)throw new Error("previous call to 'initializeWebAssembly()' failed.");Rr=!0;let t=e.initTimeout,r=e.numThreads;if(!wp())throw new Error("WebAssembly SIMD is not supported in the current environment.");let n=bp();r>1&&!n&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let o=e.wasmPaths,i=typeof o=="string"?o:void 0,a=o?.mjs,l=a?.href??a,d=o?.wasm,p=d?.href??d,m=e.wasmBinary,[u,h]=await Da(l,i,r>1),w=!1,g=[];if(t>0&&g.push(new Promise(b=>{setTimeout(()=>{w=!0,b()},t)})),g.push(new Promise((b,x)=>{let _={numThreads:r};m?_.wasmBinary=m:(p||i)&&(_.locateFile=($,S)=>p??(i??S)+$),h(_).then($=>{Rr=!1,Fn=!0,Ln=$,b(),u&&URL.revokeObjectURL(u)},$=>{Rr=!1,za=!0,x($)})})),await Promise.race(g),w)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Ie=()=>{if(Fn&&Ln)return Ln;throw new Error("WebAssembly is not initialized yet.")}});var Te,Yt,_e,Mr=U(()=>{"use strict";St();Te=(e,t)=>{let r=Ie(),n=r.lengthBytesUTF8(e)+1,o=r._malloc(n);return r.stringToUTF8(e,o,n),t.push(o),o},Yt=(e,t,r,n)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([o,i])=>{let a=t?t+o:o;if(typeof i=="object")Yt(i,a+".",r,n);else if(typeof i=="string"||typeof i=="number")n(a,i.toString());else if(typeof i=="boolean")n(a,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},_e=e=>{let t=Ie(),r=t.stackSave();try{let n=t.stackAlloc(8);t._OrtGetLastError(n,n+4);let o=t.HEAP32[n/4],i=t.HEAPU32[n/4+1],a=i?t.UTF8ToString(i):"";throw new Error(`${e} ERROR_CODE: ${o}, ERROR_MESSAGE: ${a}`)}finally{t.stackRestore(r)}}});var Ba,Ra=U(()=>{"use strict";St();Mr();Ba=e=>{let t=Ie(),r=0,n=[],o=e||{};try{if(e?.logSeverityLevel===void 0)o.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)o.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(o.terminate=!1);let i=0;return e?.tag!==void 0&&(i=Te(e.tag,n)),r=t._OrtCreateRunOptions(o.logSeverityLevel,o.logVerbosityLevel,!!o.terminate,i),r===0&&_e("Can't create run options."),e?.extra!==void 0&&Yt(e.extra,"",new WeakSet,(a,l)=>{let d=Te(a,n),p=Te(l,n);t._OrtAddRunConfigEntry(r,d,p)!==0&&_e(`Can't set a run config entry: ${a} - ${l}.`)}),[r,n]}catch(i){throw r!==0&&t._OrtReleaseRunOptions(r),n.forEach(a=>t._free(a)),i}}});var vp,$p,_p,xp,Ma,Ua=U(()=>{"use strict";St();Mr();vp=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},$p=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},_p=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},xp=(e,t,r)=>{for(let n of t){let o=typeof n=="string"?n:n.name;switch(o){case"webnn":if(o="WEBNN",typeof n!="string"){let l=n?.deviceType;if(l){let d=Te("deviceType",r),p=Te(l,r);Ie()._OrtAddSessionConfigEntry(e,d,p)!==0&&_e(`Can't set a session config entry: 'deviceType' - ${l}.`)}}break;case"webgpu":if(o="JS",typeof n!="string"){let a=n;if(a?.preferredLayout){if(a.preferredLayout!=="NCHW"&&a.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${a.preferredLayout}`);let l=Te("preferredLayout",r),d=Te(a.preferredLayout,r);Ie()._OrtAddSessionConfigEntry(e,l,d)!==0&&_e(`Can't set a session config entry: 'preferredLayout' - ${a.preferredLayout}.`)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${o}`)}let i=Te(o,r);Ie()._OrtAppendExecutionProvider(e,i)!==0&&_e(`Can't append execution provider: ${o}.`)}},Ma=e=>{let t=Ie(),r=0,n=[],o=e||{};_p(o);try{let i=vp(o.graphOptimizationLevel??"all"),a=$p(o.executionMode??"sequential"),l=typeof o.logId=="string"?Te(o.logId,n):0,d=o.logSeverityLevel??2;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log serverity level is not valid: ${d}`);let p=o.logVerbosityLevel??0;if(!Number.isInteger(p)||p<0||p>4)throw new Error(`log verbosity level is not valid: ${p}`);let m=typeof o.optimizedModelFilePath=="string"?Te(o.optimizedModelFilePath,n):0;if(r=t._OrtCreateSessionOptions(i,!!o.enableCpuMemArena,!!o.enableMemPattern,a,!!o.enableProfiling,0,l,d,p,m),r===0&&_e("Can't create session options."),o.executionProviders&&xp(r,o.executionProviders,n),o.enableGraphCapture!==void 0){if(typeof o.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);let u=Te("enableGraphCapture",n),h=Te(o.enableGraphCapture.toString(),n);t._OrtAddSessionConfigEntry(r,u,h)!==0&&_e(`Can't set a session config entry: 'enableGraphCapture' - ${o.enableGraphCapture}.`)}if(o.freeDimensionOverrides)for(let[u,h]of Object.entries(o.freeDimensionOverrides)){if(typeof u!="string")throw new Error(`free dimension override name must be a string: ${u}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let w=Te(u,n);t._OrtAddFreeDimensionOverride(r,w,h)!==0&&_e(`Can't set a free dimension override: ${u} - ${h}.`)}return o.extra!==void 0&&Yt(o.extra,"",new WeakSet,(u,h)=>{let w=Te(u,n),g=Te(h,n);t._OrtAddSessionConfigEntry(r,w,g)!==0&&_e(`Can't set a session config entry: ${u} - ${h}.`)}),[r,n]}catch(i){throw r!==0&&t._OrtReleaseSessionOptions(r),n.forEach(a=>t._free(a)),i}}});var qn,ht,It,Ur,Xt,Vr,jn,Q=U(()=>{"use strict";qn=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;default:throw new Error(`unsupported data type: ${e}`)}},ht=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";default:throw new Error(`unsupported data type: ${e}`)}},It=e=>[void 0,4,1,1,2,2,4,8,void 0,1,2,8,4,8,void 0,void 0,void 0][e],Ur=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Xt=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Vr=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool",jn=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;default:throw new Error(`unsupported data location: ${e}`)}}});var Zt,Kn=U(()=>{"use strict";Tr();Zt=async e=>{if(typeof e=="string")if(!1)try{let{readFile:t}=Mn("node:fs/promises");return new Uint8Array(await t(e))}catch(t){if(t.code==="ERR_FS_FILE_TOO_LARGE"){let{createReadStream:r}=Mn("node:fs"),n=r(e),o=[];for await(let i of n)o.push(i);return new Uint8Array(Buffer.concat(o))}throw t}else{let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),n=r?parseInt(r,10):0;if(n<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let o=t.body.getReader(),i;try{i=new ArrayBuffer(n)}catch(l){if(l instanceof RangeError){let d=Math.ceil(n/65536);i=new WebAssembly.Memory({initial:d,maximum:d}).buffer}else throw l}let a=0;for(;;){let{done:l,value:d}=await o.read();if(l)break;let p=d.byteLength;new Uint8Array(i,a,p).set(d),a+=p}return new Uint8Array(i,0,n)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}});var Sp,Ip,Va,Na,Wa,Cp,ve,dt=U(()=>{"use strict";Q();Sp=["V","I","W","E","F"],Ip=(e,t)=>{console.log(`[${Sp[e]},${new Date().toISOString()}]${t}`)},Wa=(e,t)=>{Va=e,Na=t},Cp=(e,t)=>{let r=Xt(e),n=Xt(Va);r>=n&&Ip(r,typeof t=="function"?t():t)},ve=(...e)=>{Na&&Cp(...e)}});var Ha,Ga=U(()=>{"use strict";Q();Ha=(e,t)=>new(Ur(t))(e)});var Nr=U(()=>{"use strict"});var La,Yn,Xn,Tp,Ap,Fa,Qn,Zn,ja,Ka=U(()=>{"use strict";dt();Nr();La=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Yn=[],Xn=e=>Math.ceil(e/16)*16,Tp=e=>{for(let t=0;t<Yn.length;t++){let r=Yn[t];if(e<=r)return r}return Math.ceil(e/16)*16},Ap=1,Fa=()=>Ap++,Qn=async(e,t,r,n)=>{let o=Xn(r),i=e.device.createBuffer({size:o,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let a=e.getCommandEncoder();e.endComputePass(),a.copyBufferToBuffer(t,0,i,0,o),e.flush(),await i.mapAsync(GPUMapMode.READ);let l=i.getMappedRange();if(n){let d=n();return d.set(new Uint8Array(l,0,r)),d}else return new Uint8Array(l.slice(0,r))}finally{i.destroy()}},Zn=class{constructor(t){this.backend=t;this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersForUploadingPending=[],this.buffersPending=[],this.externalBuffers=new Map,this.capturedPendingBuffers=new Map;for(let[r]of La)Yn.push(r),this.freeBuffers.set(r,[]),this.freeUniformBuffers.set(r,[])}upload(t,r){let n=r.buffer,o=r.byteOffset,i=r.byteLength,a=Xn(i),l=this.storageCache.get(t);if(!l)throw new Error("gpu data for uploading does not exist");if(l.originalSize!==i)throw new Error(`inconsistent data size. gpu data size=${l.originalSize}, data size=${i}`);let d=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),p=d.getMappedRange();new Uint8Array(p).set(new Uint8Array(n,o,i)),d.unmap();let m=this.backend.getCommandEncoder();this.backend.endComputePass(),m.copyBufferToBuffer(d,0,l.gpuData.buffer,0,a),ve("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${t})`),this.buffersForUploadingPending.push(d)}memcpy(t,r){let n=this.storageCache.get(t);if(!n)throw new Error("source gpu data for memcpy does not exist");let o=this.storageCache.get(r);if(!o)throw new Error("destination gpu data for memcpy does not exist");if(n.originalSize!==o.originalSize)throw new Error("inconsistent source and destination gpu data size");let i=Xn(n.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(n.gpuData.buffer,0,o.gpuData.buffer,0,i)}registerExternalBuffer(t,r,n){let o;if(n){if(o=this.externalBuffers.get(n),o===void 0)throw new Error("previous buffer is not registered");if(t===n)return ve("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${r}) => id=${o}, buffer is the same, skip.`),o;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`);this.externalBuffers.delete(n)}else o=Fa();return this.storageCache.set(o,{gpuData:{id:o,type:0,buffer:t},originalSize:r}),this.externalBuffers.set(t,o),ve("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${r}) => id=${o}, registered.`),o}unregisterExternalBuffer(t){let r=this.externalBuffers.get(t);r!==void 0&&(this.storageCache.delete(r),this.externalBuffers.delete(t),ve("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${r}`))}create(t,r=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=Tp(t),o,i=(r&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(r&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||a){let p=(i?this.freeBuffers:this.freeUniformBuffers).get(n);p?p.length>0?o=p.pop():o=this.backend.device.createBuffer({size:n,usage:r}):o=this.backend.device.createBuffer({size:n,usage:r})}else o=this.backend.device.createBuffer({size:n,usage:r});let l={id:Fa(),type:0,buffer:o};return this.storageCache.set(l.id,{gpuData:l,originalSize:t}),ve("verbose",()=>`[WebGPU] GpuDataManager.create(size=${t}) => id=${l.id}`),l}get(t){return this.storageCache.get(t)?.gpuData}release(t){let r=this.storageCache.get(t);if(!r)throw new Error("releasing data does not exist");return ve("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(t,r){let n=this.storageCache.get(t);if(!n)throw new Error("data does not exist");await Qn(this.backend,n.gpuData.buffer,n.originalSize,r)}refreshPendingBuffers(){for(let t of this.buffersForUploadingPending)t.destroy();if(this.buffersForUploadingPending=[],this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let t of this.buffersPending){let r=La.get(t.size);if((t.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(t.size)||[];r===void 0||n.length>=r?t.destroy():n.push(t)}else if((t.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(t.size)||[];r===void 0||n.length>=r?t.destroy():n.push(t)}else t.destroy()}this.buffersPending=[]}else{let t=this.capturedPendingBuffers.get(this.backend.currentSessionId);t||(t=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,t));for(let r of this.buffersPending)t.push(r);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(t=>{t.forEach(r=>{r.destroy()})}),this.freeUniformBuffers.forEach(t=>{t.forEach(r=>{r.destroy()})}),this.storageCache.forEach(t=>{t.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(t=>{t.forEach(r=>{r.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onReleaseSession(t){let r=this.capturedPendingBuffers.get(t);r&&(r.forEach(n=>{n.destroy()}),this.capturedPendingBuffers.delete(t))}},ja=(...e)=>new Zn(...e)});var Jn,te,Ce=U(()=>{"use strict";Jn=class{constructor(t){Object.assign(this,t)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(t=>`${this[t]}`).join(";")),this.key}},te=e=>new Jn(e)});var eo,tt,k,Ct,Wr,Hr,Gr,ae=U(()=>{"use strict";eo=class{static calcMatMulShape(t,r){return t[1]!==r[0]?void 0:[t[0],r[1]]}},tt=class{static calcShape(t,r,n=!1){let o=t.length,i=r.length;if(o===0)return r;if(i===0)return t;let a=Math.max(t.length,r.length),l=new Array(a);if(n){if(o<2||i<2)return;let d=eo.calcMatMulShape([t[o-2],t[o-1]],[r[i-2],r[i-1]]);if(d===void 0)return;[l[a-2],l[a-1]]=d}for(let d=n?3:1;d<=a;d++){let p=o-d<0?1:t[o-d],m=i-d<0?1:r[i-d];if(p!==m&&p>1&&m>1)return;let u=Math.max(p,m);if(p&&m)l[a-d]=Math.max(p,m);else{if(u>1)return;l[a-d]=0}}return l}static isValidBroadcast(t,r){let n=t.length,o=r.length;if(n>o)return!1;for(let i=1;i<=n;i++)if(t[n-i]!==1&&t[n-i]!==r[o-i])return!1;return!0}},k=class e{static size(t){return e.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let n=t.length;if(n===0)return[];let o=new Array(n),i=n-1;for(;i>=0;){if(t[i]%r===0){o[i]=t[i]/r;break}if(r%t[i]!==0)throw new Error("cannot convert shape");o[i]=1,r/=t[i],i--}for(i--;i>=0;i--)o[i]=t[i];return o}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,n){let o=1;for(let i=r;i<n;i++){if(t[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");o*=t[i]}return o}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let n=new Array(r);n[r-1]=1,n[r-2]=t[r-1];for(let o=r-3;o>=0;--o)n[o]=n[o+1]*t[o+1];return n}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(n=>this.normalizeAxis(n,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(n=>t[n]):t.slice().reverse()}static padShape(t,r){let n=t.length;return t.map((o,i)=>o+r[i]+r[i+n])}static areEqual(t,r){return t.length!==r.length?!1:t.every((n,o)=>n===r[o])}},Ct=class e{static adjustPoolAttributes(t,r,n,o,i,a){if(!t&&n.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let l=0;l<r.length-2;l++)l>=n.length?n.push(r[l+2]):n[l]=r[l+2];for(let l=0;l<n.length;l++)if(l<o.length){if(o[l]<0)throw new Error("strides should be greater than or equal to 1")}else o.push(1);for(let l=0;l<n.length;l++)if(l<i.length){if(i[l]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let l=0;l<n.length*2;l++)if(l<a.length){if(a[l]<0)throw new Error("pad should be greater than or equal to 1")}else a.push(0);for(let l=0;l<n.length;l++){if(n[l]<=0)throw new Error("kernel shapes need to be greater than 0");if(a[l]>=n[l]||a[l+n.length]>=n[l])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,n,o,i,a,l){if(l){if(i.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(o.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let d=0;d<t.length-2;d++)e.adjustPadAndReturnShape(t[d+(a?1:2)],r[d],n[d],o[d],i,d,d+t.length-2,l)}}static computePoolOutputShape(t,r,n,o,i,a,l){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return e.computeShapeHelper(t,r,d,n,o,i,a,l),d}static computeConvOutputShape(t,r,n,o,i,a,l){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let d=[t[0],r[0]];return e.computeShapeHelper(!1,t,d,n,o,i,a,l),d}static computeShapeHelper(t,r,n,o,i,a,l,d){if(t)for(let p=0;p<r.length-2;p++)n.push(1);else for(let p=0;p<r.length-2;p++)n.push(e.adjustPadAndReturnShape(r[p+2],o[p],i[p],a[p],l,p,p+r.length-2,d))}static adjustPadAndReturnShape(t,r,n,o,i,a,l,d){let p=n*(o-1)+1;if(d&&d!=="NOTSET")switch(d){case"VALID":return i[a]=0,i[l]=0,Math.floor((t-p)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(n!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let u=((t+r-1)/r-1)*r+o-t;return i[a]=Math.floor(d==="SAME_LOWER"?(u+1)/2:u/2),i[l]=u-i[a],Math.floor((t+u-o)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+i[a]+i[l]-p)/r+1)}},Wr=class{static getShapeOfGemmResult(t,r,n,o,i){if(t.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let a,l,d;r?(a=t[1],l=t[0]):(a=t[0],l=t[1]);let p=-1;if(o?(d=n[0],p=1):(d=n[1],p=0),n[p]!==l)throw new Error("dimension mismatch");if(a<=0||d<=0||l<=0)throw new Error("invalid shape specified");if(i&&!tt.isValidBroadcast(i,[a,d]))throw new Error("gemm: invalid bias shape for broadcast");return[a,d,l]}},Hr=-34028234663852886e22,Gr=34028234663852886e22});var Tt,ro,ge,Oe,V,$e,gt,At,Xe,G,no,E,M,Lr,to,Ya,Nt,ie=U(()=>{"use strict";Q();ae();Tt=64,ro=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(e){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];default:throw new Error(`Unknown data type: ${e}`)}},ge=(e,t=1)=>{let r=ro(e,t);return typeof r=="string"?r:r[0]},Oe=(e,t=1)=>{let r=ro(e,t);return typeof r=="string"?r:r[1]},V=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:k.computeStrides(r)})}),t},$e=e=>e%4===0?4:e%2===0?2:1,gt=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,At=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Xe=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,G=(e,t,r,n)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?n==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:n==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,no=(e,t,r,n,o)=>{let i=typeof r=="number",a=i?r:r.length,l=[...new Array(a).keys()],d=a<2?"u32":a<=4?`vec${a}<u32>`:`array<u32, ${a}>`,p=ro(t,o),m=typeof p=="string"?p:p[1],u=typeof p=="string"?p:p[0],h={indices:d,value:m,storage:u,tensor:t},w=R=>typeof R=="string"?R:`${R}u`,g={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=i?"uniforms.":"",x=`${b}${e}_shape`,_=`${b}${e}_strides`,$="";for(let R=0;R<a-1;R++)$+=`
    let dim${R} = current / ${G(_,R,a)};
    let rest${R} = current % ${G(_,R,a)};
    indices[${R}] = dim${R};
    current = rest${R};
    `;$+=`indices[${a-1}] = current;`;let S=a<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${$}
    return indices;
  }`,I=R=>(g.offsetToIndices=!0,a<2?R:`o2i_${e}(${R})`),T=[];if(a>=2)for(let R=a-1;R>=0;R--)T.push(`${G(_,R,a)} * (indices[${R}])`);let A=a<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${T.join("+")};
  }`,D=R=>(g.indicesToOffset=!0,a<2?R:`i2o_${e}(${R})`),z=(...R)=>a===0?"0u":`${h.indices}(${R.map(w).join(",")})`,H=(R,F)=>a<2?`${R}`:`${G(R,F,a)}`,W=(R,F,ce)=>a<2?`${R}=${ce};`:`${G(R,F,a)}=${ce};`,X={},Y=(R,F)=>{g.broadcastedIndicesToOffset=!0;let ce=`${F.name}broadcastedIndicesTo${e}Offset`;if(ce in X)return`${ce}(${R})`;let Re=[];for(let Se=a-1;Se>=0;Se--){let we=F.indicesGet("outputIndices",Se+F.rank-a);Re.push(`${H(_,Se)} * (${we} % ${H(x,Se)})`)}return X[ce]=`fn ${ce}(outputIndices: ${F.type.indices}) -> u32 {
             return ${Re.length>0?Re.join("+"):"0u"};
           }`,`${ce}(${R})`},pe=(R,F)=>(()=>{if(h.storage===h.value)return`${e}[${R}]=${F};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${R}]=vec2<u32>(u32(${F}), select(0u, 0xFFFFFFFFu, ${F} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${R}]=vec2<u32>(u32(${F}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${R}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${F}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),ue=R=>(()=>{if(h.storage===h.value)return`${e}[${R}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${R}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${R}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${R}] & 0xFFu), bool(${e}[${R}] & 0xFF00u), bool(${e}[${R}] & 0xFF0000u), bool(${e}[${R}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),le=a<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${m} {
    return ${ue(`i2o_${e}(indices)`)};
  }`,K=a<2?"":(()=>{let R=l.map(ce=>`d${ce}: u32`).join(", "),F=l.map(ce=>`d${ce}`).join(", ");return`
  fn get_${e}(${R}) -> ${m} {
    return get_${e}ByIndices(${z(F)});
  }`})(),de=(...R)=>{if(R.length!==a)throw new Error(`indices length must be ${a}`);let F=R.map(w).join(",");return a===0?ue("0u"):a===1?ue(F[0]):(g.get=!0,g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}(${F})`)},re=R=>a<2?ue(R):(g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}ByIndices(${R})`),se=a<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${m}) {
    ${pe(`i2o_${e}(indices)`,"value")}
  }`,Z=a<2?"":(()=>{let R=l.map(ce=>`d${ce}: u32`).join(", "),F=l.map(ce=>`d${ce}`).join(", ");return`
  fn set_${e}(${R}, value: ${m}) {
    set_${e}ByIndices(${z(F)}, value);
  }`})();return{impl:()=>{let R=[],F=!1;return g.offsetToIndices&&(R.push(S),F=!0),g.indicesToOffset&&(R.push(A),F=!0),g.broadcastedIndicesToOffset&&(Object.values(X).forEach(ce=>R.push(ce)),F=!0),g.set&&(R.push(Z),F=!0),g.setByIndices&&(R.push(se),F=!0),g.get&&(R.push(K),F=!0),g.getByIndices&&(R.push(le),F=!0),!i&&F&&R.unshift(`const ${x} = ${h.indices}(${r.join(",")});`,`const ${_} = ${h.indices}(${k.computeStrides(r).join(",")});`),R.join(`
`)},type:h,offsetToIndices:I,indicesToOffset:D,broadcastedIndicesToOffset:Y,indices:z,indicesGet:H,indicesSet:W,set:(...R)=>{if(R.length!==a+1)throw new Error(`indices length must be ${a}`);let F=R[a];if(typeof F!="string")throw new Error("value must be string");let ce=R.slice(0,a).map(w).join(",");return a===0?pe("0u",F):a===1?pe(ce[0],F):(g.set=!0,g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}(${ce}, ${F})`)},setByOffset:pe,setByIndices:(R,F)=>a<2?pe(R,F):(g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}ByIndices(${R}, ${F});`),get:de,getByOffset:ue,getByIndices:re,usage:n,name:e,strides:_,shape:x,rank:a}},E=(e,t,r,n=1)=>no(e,t,r,"input",n),M=(e,t,r,n=1)=>no(e,t,r,"output",n),Lr=(e,t,r,n=1)=>no(e,t,r,"internal",n),to=class{constructor(t,r){this.normalizedDispatchGroup=t;this.limits=r;this.internalVariables=[];this.variables=[];this.uniforms=[];this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(t){return`if (global_idx >= ${typeof t=="number"?`${t}u`:t}) { return; }`}mainStart(t=Tt){let r=typeof t=="number"?t:t[0],n=typeof t=="number"?1:t[1],o=typeof t=="number"?1:t[2];if(r>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||o>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${r}, ${n}, ${o}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(r*n*o>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${r}, ${n}, ${o}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,l=i?"let global_idx = global_id.x; let local_idx = local_id.x;":`let global_idx = (workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
          workgroup_id.y * num_workgroups[0] + workgroup_id.x) * ${r*n*o}u + local_idx;`;return`@compute @workgroup_size(${r}, ${n}, ${o})
  fn main(${a}) {
    ${l}
  `}appendVariableUniforms(t){t.rank!==0&&(t.shape.startsWith("uniforms.")&&this.uniforms.push({name:t.shape.replace("uniforms.",""),type:"u32",length:t.rank}),t.strides.startsWith("uniforms.")&&this.uniforms.push({name:t.strides.replace("uniforms.",""),type:"u32",length:t.rank}))}declareVariable(t,r){if(t.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(t),this.appendVariableUniforms(t);let n=t.usage==="input"?"read":"read_write",o=t.type.storage;return`@group(0) @binding(${r}) var<storage, ${n}> ${t.name}: array<${o}>;`}declareVariables(...t){return t.map(r=>this.declareVariable(r,this.variableIndex++)).join(`
`)}registerInternalVariable(t){if(t.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(t),this.appendVariableUniforms(t)}registerInternalVariables(...t){return t.forEach(r=>this.registerInternalVariable(r)),this}registerUniform(t,r,n=1){return this.uniforms.push({name:t,type:r,length:n}),this}registerUniforms(t){return this.uniforms=this.uniforms.concat(t),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let t=[];for(let{name:r,type:n,length:o}of this.uniforms)if(o&&o>4)n==="f16"?t.push(`@align(16) ${r}:array<mat2x4<${n}>, ${Math.ceil(o/8)}>`):t.push(`${r}:array<vec4<${n}>, ${Math.ceil(o/4)}>`);else{let i=o==null||o===1?n:`vec${o}<${n}>`;t.push(`${r}:${i}`)}return`
      struct Uniforms { ${t.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(t=>t.impl()).join(`
`)+this.internalVariables.map(t=>t.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let t=r=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(r)];return this.uniforms.map(r=>[t(r.type),r.length??1])}},Ya=(e,t)=>new to(e,t),Nt=(e,t)=>{let r=e.length,n=[];for(let o=0;o<r;o++){let i=r-1-o,a=e[i]||1;(t[t.length-1-o]||1)>1&&a===1&&n.unshift(i)}return n}});var Ep,Xa,kp,Pp,Ue,Za,Qa,Et=U(()=>{"use strict";Q();ae();Ce();ie();Ep=e=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.")},Xa=(e,t)=>t&&t.length!==e?[...new Array(e).keys()].reverse():t,kp=(e,t)=>k.sortBasedOnPerm(e,Xa(e.length,t)),Pp=(e,t,r,n)=>{let o=[];o.push(`fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let i=0;i<t;++i)o.push(r.indicesSet("a",e[i],`i[${i}]`));return o.push("return a;}"),o.join(`
`)},Ue=(e,t)=>{let r=e.dataType,n=e.dims.length,o=Xa(n,t),i=kp(e.dims,o),a=M("output",r,i.length),l=E("a",r,n),d;if(o.length===2&&o[0]===1&&o[1]===0){let p=a.type.value,m=[16,16,1];d=u=>`
  ${u.registerUniform("output_size","u32").declareVariables(l,a)}
  var<workgroup> tile : array<array<${p}, ${m[0]+1}>, ${m[0]}>;
  ${u.mainStart(m)}
    var x = workgroup_id.x * ${m[0]}u + local_id.x;
    var y = workgroup_id.y * ${m[0]}u + local_id.y;
    let width = uniforms.output_shape[0];
    let height = uniforms.output_shape[1];
    if (x < width && y < height) {
      tile[local_id.y][local_id.x] = ${l.getByOffset("y * width + x")};
    }
    workgroupBarrier();
    x = workgroup_id.y * ${m[0]}u + local_id.x;
    y = workgroup_id.x * ${m[0]}u + local_id.y;
    if (x < height && y < width) {
      ${a.setByOffset("y * height + x","tile[local_id.x][local_id.y]")}
    }
  }`}else d=p=>`
  ${p.registerUniform("output_size","u32").declareVariables(l,a)}

  ${Pp(o,n,l,a)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${a.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${a.setByOffset("global_idx",l.getByIndices("aIndices"))}
  }`;return{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:p=>{let m=k.size(i);return{outputs:[{dims:i,dataType:p[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...V(p[0].dims,i)]}},getShaderSource:d}},Za=(e,t)=>{Ep(e.inputs),e.compute(Ue(e.inputs[0],t.perm))},Qa=e=>te({perm:e.perm})});var Op,Dp,zp,Bp,Rp,Mp,Up,Vp,Np,Wp,rt,Ja,es,ts,rs,ns,os,is,as,ss,us,ds=U(()=>{"use strict";Q();ae();ie();Fr();Et();Op={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Dp={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},zp={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Bp={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Rp=(e,t)=>{let r=[];for(let n=t-e;n<t;++n)r.push(n);return r},Mp=(e,t)=>{let r=[],n=e.length;for(let i=0;i<n;i++)t.indexOf(i)===-1&&r.push(e[i]);let o=t.map(i=>e[i]);return[r,o]},Up=(e,t)=>{let r=e.length+t.length,n=[],o=0;for(let i=0;i<r;i++)t.indexOf(i)===-1?n.push(e[o++]):n.push(1);return n},Vp=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Np=(e,t)=>{let r=[];if(!Vp(e,t)){for(let n=0;n<t;++n)e.indexOf(n)===-1&&r.push(n);e.forEach(n=>r.push(n))}return r},Wp=(e,t,r,n,o,i,a)=>{let l=r[0].dims,d=k.size(i),p=k.size(a),m=E("_A",r[0].dataType,l),u=M("output",o,i),h=32,w=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `;return{name:e,shaderCache:t,getShaderSource:b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(m,u)}
        ${w}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${zp[n]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${m.getByOffset("offset + k")});
           bestValue = ${Op[n]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Dp[n]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${u.setByOffset("outputIndex",`${n==="mean"?`${u.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${u.type.storage}(${Bp[n]})`}`)};
         }
        }`,getRunData:()=>({outputs:[{dims:i,dataType:o}],dispatchGroup:{x:d},programUniforms:[{type:12,data:p}]})}},rt=(e,t,r,n)=>{let o=e.inputs.length===1?r:oo(e.inputs,r),i=o.axes;i.length===0&&!o.noopWithEmptyAxes&&(i=e.inputs[0].dims.map((w,g)=>g));let a=k.normalizeAxes(i,e.inputs[0].dims.length),l=a,d=e.inputs[0],p=Np(l,e.inputs[0].dims.length);p.length>0&&(d=e.compute(Ue(e.inputs[0],p),{inputs:[0],outputs:[-1]})[0],l=Rp(l.length,d.dims.length));let[m,u]=Mp(d.dims,l),h=m;o.keepDims&&(h=Up(m,a)),e.compute(Wp(t,{hint:o.cacheKey,inputDependencies:["type"]},[d],n,e.inputs[0].dataType,h,u),{inputs:[d]})},Ja=(e,t)=>{rt(e,"ReduceMeanShared",t,"mean")},es=(e,t)=>{rt(e,"ReduceL1Shared",t,"l1")},ts=(e,t)=>{rt(e,"ReduceL2Shared",t,"l2")},rs=(e,t)=>{rt(e,"ReduceLogSumExpShared",t,"logSumExp")},ns=(e,t)=>{rt(e,"ReduceMaxShared",t,"max")},os=(e,t)=>{rt(e,"ReduceMinShared",t,"min")},is=(e,t)=>{rt(e,"ReduceProdShared",t,"prod")},as=(e,t)=>{rt(e,"ReduceSumShared",t,"sum")},ss=(e,t)=>{rt(e,"ReduceSumSquareShared",t,"sumSquare")},us=(e,t)=>{rt(e,"ReduceLogSumShared",t,"logSum")}});var nt,Hp,qr,oo,ot,Gp,Lp,Fp,qp,jp,Kp,Yp,Xp,Zp,Qp,it,ls,cs,ps,ms,fs,hs,gs,ys,bs,ws,Fr=U(()=>{"use strict";Q();ae();Ce();ie();ds();nt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Hp=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],qr=(e,t,r,n,o,i,a=!1,l=!1)=>{let d=[],p=r[0].dims,m=p.length,u=k.normalizeAxes(o,m),h=!l&&u.length===0;p.forEach((x,_)=>{h||u.indexOf(_)>=0?a&&d.push(1):d.push(x)});let w=d.length,g=k.size(d);return{name:e,shaderCache:t,getShaderSource:x=>{let _=[],$=E("_A",r[0].dataType,m),S=M("output",i,w),I=n($,S,u),T=I[2];for(let A=0,D=0;A<m;A++)h||u.indexOf(A)>=0?(a&&D++,T=`for(var j${A}: u32 = 0; j${A} < ${p[A]}; j${A}++) {
                  ${I[2].includes("last_index")?`let last_index = j${A};`:""}
                  ${$.indicesSet("input_indices",A,`j${A}`)}
                  ${T}
                }`):(_.push(`${$.indicesSet("input_indices",A,S.indicesGet("output_indices",D))};`),D++);return`

        ${x.registerUniform("output_size","u32").declareVariables($,S)}

        ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${S.offsetToIndices("global_idx")};

          ${_.join(`
`)}
          ${I[0]}       // init ops for reduce max/min
          ${I[1]}
          ${T}
          ${I[3]}
          ${I.length===4?S.setByOffset("global_idx","value"):I.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:d,dataType:i}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...V(p,d)]})}},oo=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),te({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},ot=(e,t,r,n)=>{let o=e.inputs,i=o.length===1?r:oo(o,r);e.compute(qr(t,{hint:i.cacheKey,inputDependencies:["rank"]},[o[0]],i.noopWithEmptyAxes&&i.axes.length===0?Hp:n,i.axes,o[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},Gp=(e,t)=>{nt(e.inputs),ot(e,"ReduceLogSum",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,"value = log(value);"])},Lp=(e,t)=>{nt(e.inputs),ot(e,"ReduceL1",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += abs(${n.getByIndices("input_indices")});`,""])},Fp=(e,t)=>{nt(e.inputs),ot(e,"ReduceL2",t,(n,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},qp=(e,t)=>{nt(e.inputs),ot(e,"ReduceLogSumExp",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += exp(${n.getByIndices("input_indices")});`,"value = log(value);"])},jp=(e,t)=>{nt(e.inputs),ot(e,"ReduceMax",t,(n,o,i)=>{let a=[];for(let l=0;l<n.rank;l++)(i.indexOf(l)>=0||i.length===0)&&a.push(n.indicesSet("input_indices",l,0));return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = max(value, ${n.getByIndices("input_indices")});`,""]})},Kp=(e,t)=>{nt(e.inputs),ot(e,"ReduceMean",t,(n,o,i)=>{let a=1;for(let l=0;l<n.rank;l++)(i.indexOf(l)>=0||i.length===0)&&(a*=e.inputs[0].dims[l]);return["var sum = f32(0);","",`sum += f32(${n.getByIndices("input_indices")});`,`let value = ${o.type.value}(sum / ${a});`]})},Yp=(e,t)=>{nt(e.inputs),ot(e,"ReduceMin",t,(n,o,i)=>{let a=[];for(let l=0;l<n.rank;l++)(i.indexOf(l)>=0||i.length===0)&&a.push(`input_indices[${l}] = 0;`);return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = min(value, ${n.getByIndices("input_indices")});`,""]})},Xp=(e,t)=>{nt(e.inputs),ot(e,"ReduceProd",t,(n,o)=>[`var value = ${o.type.storage}(1);`,"",`value *= ${n.getByIndices("input_indices")};`,""])},Zp=(e,t)=>{nt(e.inputs),ot(e,"ReduceSum",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,""])},Qp=(e,t)=>{nt(e.inputs),ot(e,"ReduceSumSquare",t,(n,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += t * t;`,""])},it=(e,t,r)=>{if(t.length===0)return r;let n=1,o=1;for(let i=0;i<t.length;i++)t.indexOf(i)===-1?n*=e[i]:o*=e[i];return o<32&&n>1024},ls=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Kp(e,t):Ja(e,t)},cs=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lp(e,t):es(e,t)},ps=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fp(e,t):ts(e,t)},ms=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qp(e,t):rs(e,t)},fs=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?jp(e,t):ns(e,t)},hs=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Yp(e,t):os(e,t)},gs=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Xp(e,t):is(e,t)},ys=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Zp(e,t):as(e,t)},bs=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Qp(e,t):ss(e,t)},ws=(e,t)=>{it(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Gp(e,t):us(e,t)}});var vs,$s,_s,io,xs=U(()=>{"use strict";Q();Ce();Fr();vs=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},$s=(e,t)=>{vs(e.inputs);let r=(n,o,i)=>{let a=[];for(let l=0;l<n.rank;l++)(i.indexOf(l)>=0||i.length===0)&&a.push(`input_indices[${l}] = 0;`);return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${n.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};e.compute(qr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},_s=(e,t)=>{vs(e.inputs);let r=(n,o,i)=>{let a=[];for(let l=0;l<n.rank;l++)(i.indexOf(l)>=0||i.length===0)&&a.push(`input_indices[${l}] = 0;`);return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${n.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};e.compute(qr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},io=e=>te(e)});var Jp,em,tm,rm,Wt,nm,Ss,jr=U(()=>{"use strict";Q();Nr();ie();Jp=(e,t)=>{let r=e[0],n=e[1],o=e[2],i=e[3],a=e[4],l=e[5];if(a&&l)throw new Error("Attention cannot have both past and relative_position_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let d=r.dims[0],p=r.dims[1],m=r.dims[2];if(o.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(n.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(n.dims[0]!==m)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(o.dims[0]!==n.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let u=o.dims[0]/3,h=u,w=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");u=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],w=t.qkvHiddenSizes[2]}let g=p;if(u!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(o.dims[0]!==u+h+w)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(a){if(h!==w)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(a.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(a.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(a.dims[1]!==d)throw new Error('Input "past" second dimension must be batch_size');if(a.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(a.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=a.dims[3])}let x=g+b,_=-1,$=0;if(i)throw new Error("Mask not supported");if(a)throw new Error("past is not supported");return{batchSize:d,sequenceLength:p,pastSequenceLength:b,kvSequenceLength:g,totalSequenceLength:x,maxSequenceLength:_,inputHiddenSize:m,hiddenSize:u,vHiddenSize:w,headSize:Math.floor(u/t.numHeads),vHeadSize:Math.floor(w/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:$,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},em=(e,t,r,n)=>{let o=$e(n),i=64,a=n/o;a<i?i=1:a/8<64&&(i=Math.ceil(a/8));let l=Math.ceil(n/o/i),d=[{type:t.dataType,data:1/n},{type:12,data:a},{type:12,data:l}],p=ge(t.dataType,o),m=Oe(1,o),u=h=>{let w=M("x",t.dataType,t.dims,o),b=[{name:"d_inv",type:Oe(t.dataType)},{name:"d_comp",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${i}>;
  var<workgroup> thread_sum: array<f32, ${i}>;
  ${h.registerUniforms(b).declareVariables(w)}
  ${h.mainStart([i,1,1])}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = workgroup_id.x * uniforms.d_comp + local_offset;

    var thread_max_vector = ${m}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(o){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${i}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(o){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${i}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
        x[offset + i] = ${w.type.value}(uniforms.d_inv);
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${i};${p};${o}`},getShaderSource:u,getRunData:()=>({outputs:[],dispatchGroup:{x:r},programUniforms:d})}},tm=(e,t,r,n,o,i,a,l)=>{let d=l+i.kvSequenceLength,p=[i.batchSize,i.numHeads,i.sequenceLength,d],m=i.kvNumHeads===void 0&&e.outputCount>1,u=m?[i.batchSize,i.numHeads,d,i.headSize]:void 0,h=a.scale===0?1/Math.sqrt(i.headSize):a.scale,w=$e(i.headSize),g=i.headSize/w,b=12,x={x:Math.ceil(d/b),y:Math.ceil(i.sequenceLength/b),z:i.batchSize*i.numHeads},_=[{type:12,data:i.sequenceLength},{type:12,data:g},{type:12,data:d},{type:12,data:i.numHeads},{type:1,data:h},{type:12,data:l},{type:12,data:i.kvSequenceLength}],$=["type","type"];n&&$.push("type"),o&&$.push("type");let S=[{dims:p,dataType:t.dataType,gpuDataType:0}];m&&S.push({dims:u,dataType:t.dataType,gpuDataType:0});let I=T=>{let A=E("q",t.dataType,t.dims,w),D=E("key",r.dataType,r.dims,w),z=[A,D];if(n){let pe=E("past_key",n.dataType,n.dims,w);z.push(pe)}o&&z.push(E("relative_position_bias",o.dataType,o.dims));let H=M("output",t.dataType,p),W=[H];m&&W.push(M("present_key",t.dataType,u,w));let X=Oe(1,w),Y=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${A.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${A.type.storage}, ${b*b}>;
  ${T.registerUniforms(Y).declareVariables(...z,...W)}
  ${T.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let qOffset = uniforms.M * uniforms.K * headIdx + m * uniforms.K;
    ${(()=>n&&m?`
    let kOffset = uniforms.kv_sequence_length * uniforms.K * headIdx;
    let pastKeyOffset = uniforms.past_sequence_length * uniforms.K * headIdx;`:`
    let kOffset = uniforms.N * uniforms.K * headIdx + n * uniforms.K;`)()}
    ${m?"let presentKeyOffset = headIdx * uniforms.N * uniforms.K;":""}
    var value = ${X}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${(()=>n&&m?`
              if (n + local_id.y < uniforms.past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else {
                tileK[idx] =
                         key[kOffset + (n + local_id.y - uniforms.past_sequence_length) * uniforms.K + w + local_id.x];
              }`:"tileK[idx] = key[kOffset + local_id.y * uniforms.K + w + local_id.x];")()}
      ${m?"present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];":""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
        value += ${X}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    let headOffset = headIdx * uniforms.M * uniforms.N;
    if (global_id.y < uniforms.M && global_id.x < uniforms.N) {
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(w){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${w}`)}})()};
        output[outputIdx] = ${H.type.value} (sum * uniforms.alpha) + ${o?"relative_position_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${w};${o!==void 0};${n!==void 0};${e.outputCount}`,inputDependencies:$},getRunData:()=>({outputs:S,dispatchGroup:x,programUniforms:_}),getShaderSource:I}},rm=(e,t,r,n,o,i)=>{let a=i+o.kvSequenceLength,l=o.nReps?o.nReps:1,d=o.vHiddenSize*l,p=o.kvNumHeads==null&&e.outputCount>1,m=p?[o.batchSize,o.numHeads,a,o.headSize]:void 0,u=[o.batchSize,o.sequenceLength,d],h=12,w={x:Math.ceil(o.vHeadSize/h),y:Math.ceil(o.sequenceLength/h),z:o.batchSize*o.numHeads},g=[{type:12,data:o.sequenceLength},{type:12,data:a},{type:12,data:o.vHeadSize},{type:12,data:o.numHeads},{type:12,data:d},{type:12,data:i},{type:12,data:o.kvSequenceLength}],b=n?["type","type","type"]:["type","type"],x=[{dims:u,dataType:t.dataType,gpuDataType:0}];p&&x.push({dims:m,dataType:t.dataType,gpuDataType:0});let _=$=>{let S=E("probs",t.dataType,t.dims),I=E("v",r.dataType,r.dims),T=[S,I];n&&T.push(E("past_value",n.dataType,n.dims));let D=[M("output",t.dataType,u)];p&&D.push(M("present_value",t.dataType,m));let z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"}];return`
  const TILE_SIZE = ${h}u;
  var<workgroup> tileQ: array<${S.type.value}, ${h*h}>;
  var<workgroup> tileK: array<${S.type.value}, ${h*h}>;
  ${$.registerUniforms(z).declareVariables(...T,...D)}
  ${$.mainStart([h,h,1])}
   let headIdx = workgroup_id.z;
   let m = global_id.y;
   let n = global_id.x;

   let offsetA = headIdx * (uniforms.M * uniforms.K) + m * uniforms.K;
   ${(()=>n&&p?`
    let pastValueOffset = headIdx * uniforms.N * uniforms.past_sequence_length + n;
    let vOffset = headIdx * uniforms.N * uniforms.kv_sequence_length + n;
      `:`
   let offsetB = headIdx * uniforms.N * uniforms.K + n;
            `)()}
    ${p?"let presentValueOffset = headIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${S.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${(()=>n&&p?`
        if (w + local_id.y < uniforms.past_sequence_length) {
          tileK[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else {
          tileK[idx] = v[vOffset + (w + local_id.y - uniforms.past_sequence_length) * uniforms.N];
        }
      `:`
        tileK[idx] = v[offsetB + (w + local_id.y) * uniforms.N];
      `)()}
        ${p?"present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileK[idx];":""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let currentBatchHeadNumber = workgroup_id.z % uniforms.num_heads;
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + currentBatchHeadNumber * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${n!==void 0};${e.outputCount}`,inputDependencies:b},getRunData:()=>({outputs:x,dispatchGroup:w,programUniforms:g}),getShaderSource:_}},Wt=(e,t,r,n,o,i,a,l,d,p,m)=>{let u=e.outputCount,h=p.kvNumHeads!==void 0||u>1?p.pastSequenceLength:0,w=h+p.kvSequenceLength,g=p.kvNumHeads===void 0&&u>1&&a?[t,r,a]:[t,r];d&&g.push(d);let b=e.compute(tm(e,t,r,u>1?a:void 0,d,p,m,h),{inputs:g,outputs:p.kvNumHeads===void 0&&u>1?[-1,1]:[-1]})[0];e.compute(em(e,b,p.batchSize*p.numHeads*p.sequenceLength,w),{inputs:[b],outputs:[]});let x=p.kvNumHeads===void 0&&u>1&&l?[b,n,l]:[b,n];e.compute(rm(e,b,n,u>1&&l?l:void 0,p,h),{inputs:x,outputs:p.kvNumHeads===void 0&&u>1?[0,2]:[0]})},nm=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],n=t.sequenceLength,o=t.inputHiddenSize,i=t.headSize,a=12,l={x:Math.ceil(t.headSize/a),y:Math.ceil(t.sequenceLength/a),z:t.batchSize*t.numHeads},d=[e.inputs[0],e.inputs[1],e.inputs[2]],p=[{type:12,data:n},{type:12,data:o},{type:12,data:i},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],m=u=>{let h=M("output_q",d[0].dataType,r),w=M("output_k",d[0].dataType,r),g=M("output_v",d[0].dataType,r),b=E("input",d[0].dataType,d[0].dims),x=E("weight",d[1].dataType,d[1].dims),_=E("bias",d[2].dataType,d[2].dims),$=b.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${a}u;
  var<workgroup> tileInput: array<${$}, ${a*a}>;
  var<workgroup> tileWeightQ: array<${$}, ${a*a}>;
  var<workgroup> tileWeightK: array<${$}, ${a*a}>;
  var<workgroup> tileWeightV: array<${$}, ${a*a}>;
  ${u.registerUniforms(S).declareVariables(b,x,_,h,w,g)}
  ${u.mainStart([a,a,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${$}(0);
    var valueK = ${$}(0);
    var valueV = ${$}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:l,programUniforms:p}),getShaderSource:m},{inputs:d,outputs:[-1,-1,-1]})},Ss=(e,t)=>{let r=Jp(e.inputs,t),[n,o,i]=nm(e,r);return Wt(e,n,o,i,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r,t)}});var om,im,am,Is,Cs=U(()=>{"use strict";Ke();Q();ae();Ce();ie();om=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(n,o,i)=>{let a=o.length;if(a!==n.length)throw new Error(`${i}: num dimensions != ${a}`);o.forEach((l,d)=>{if(l!==n[d])throw new Error(`${i}: dim[${d}] do not match`)})};if(e[0].dims.length>1){let n=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,n,"Invalid input scale"),r(e[2].dims,n,"Invalid input B"),r(e[3].dims,n,"Invalid input mean"),r(e[4].dims,n,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},im=(e,t)=>{let{epsilon:r,spatial:n,format:o}=t,i=e[0].dims,a=n?$e(i[i.length-1]):1,l=o==="NHWC"&&i.length>1?a:1,d=k.size(i)/a,p=n,m=p?i.length:i,u=E("x",e[0].dataType,e[0].dims,a),h=E("scale",e[1].dataType,e[1].dims,l),w=E("bias",e[2].dataType,e[2].dims,l),g=E("inputMean",e[3].dataType,e[3].dims,l),b=E("inputVar",e[4].dataType,e[4].dims,l),x=M("y",e[0].dataType,m,a),_=()=>{let S="";if(n)S=`let cOffset = ${i.length===1?"0u":o==="NHWC"?`outputIndices[${i.length-1}] / ${a}`:"outputIndices[1]"};`;else if(o==="NCHW")S=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let I=1;I<h.rank;I++)S+=`cIndices[${I}] = outputIndices[${I}];`;S+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return S},$=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(u,h,w,g,b,x)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${a}`)};
    ${_()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${w.getByOffset("cOffset")};
    let inputMean = ${g.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${u.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${n}_${a}`,inputDependencies:p?["rank","type","type","type","type"]:void 0},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p?[{type:12,data:d},...V(i)]:[{type:12,data:d}]})}},am=e=>te(e),Is=(e,t)=>{let{inputs:r,outputCount:n}=e,o=am({...t,outputCount:n});if(be.webgpu.validateInputContent&&om(r,o),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(im(r,o))}});var sm,um,Ts,As=U(()=>{"use strict";ae();ie();sm=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},um=e=>{let t=e[0].dims,r=e[0].dims[2],n=k.size(t)/4,o=e[0].dataType,i=E("input",o,t,4),a=E("bias",o,[r],4),l=E("residual",o,t,4),d=M("output",o,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:m=>`
  const channels = ${r}u / 4;
  ${m.declareVariables(i,a,l,d)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let value = ${i.getByOffset("global_idx")}
      + ${a.getByOffset("global_idx % channels")} + ${l.getByOffset("global_idx")};
    ${d.setByOffset("global_idx","value")}
  }`}},Ts=e=>{sm(e.inputs),e.compute(um(e.inputs))}});var dm,fe,Es,ks,Ps,Os,Ds,zs,Bs,Rs,Ms,lm,Us,Vs,Ns,Ws,Qt,Hs,Kr,Gs,Ls,Fs,qs,js,Ks,Ys,Xs,Zs,Qs,Js,eu,tu,ru,nu,ou,iu,au,ao,so,su,uu,du,cm,pm,lu,Yr=U(()=>{"use strict";Q();ae();Ce();ie();dm=(e,t,r,n,o,i)=>{let a=Math.ceil(t/4),l="";typeof o=="string"?l=`${o}(a)`:l=o("a");let d=E("inputData",r,[a],4),p=M("outputData",n,[a],4);return`
      ${e.registerUniform("vec_size","u32").declareVariables(d,p)}

  ${i??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${p.setByOffset("global_idx",l)}
  }`},fe=(e,t,r,n,o,i=e.dataType)=>({name:t,shaderCache:{hint:o,inputDependencies:["type"]},getShaderSource:a=>dm(a,k.size(e.dims),e.dataType,i,r,n),getRunData:a=>({outputs:[{dims:e.dims,dataType:i}],dispatchGroup:{x:Math.ceil(k.size(a[0].dims)/64/4)},programUniforms:[{type:12,data:Math.ceil(k.size(e.dims)/4)}]})}),Es=e=>{e.compute(fe(e.inputs[0],"Abs","abs"))},ks=e=>{e.compute(fe(e.inputs[0],"Acos","acos"))},Ps=e=>{e.compute(fe(e.inputs[0],"Acosh","acosh"))},Os=e=>{e.compute(fe(e.inputs[0],"Asin","asin"))},Ds=e=>{e.compute(fe(e.inputs[0],"Asinh","asinh"))},zs=e=>{e.compute(fe(e.inputs[0],"Atan","atan"))},Bs=e=>{e.compute(fe(e.inputs[0],"Atanh","atanh"))},Rs=e=>te(e),Ms=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(fe(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},lm=e=>{let t=e.length>=2&&e[1].data!==0?e[1].getFloat32Array()[0]:Hr,r=e.length>=3&&e[2].data!==0?e[2].getFloat32Array()[0]:Gr;return te({min:t,max:r})},Us=(e,t)=>{let r=e.inputs.length===1?t:lm(e.inputs),n=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Clip",o=>`clamp(${o}, clip_min_, clip_max_)`,`
    const clip_min_: vec4<${n}> = vec4(${n}(${r.min}));
    const clip_max_: vec4<${n}> = vec4(${n}(${r.max}));
`,r.cacheKey),{inputs:[0]})},Vs=e=>{e.compute(fe(e.inputs[0],"Ceil","ceil"))},Ns=e=>{e.compute(fe(e.inputs[0],"Cos","cos"))},Ws=e=>{e.compute(fe(e.inputs[0],"Cosh","cosh"))},Qt=e=>te(e),Hs=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Elu",n=>`elu_vf32(${n})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Kr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Gs=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Kr(t)))},Ls=e=>{e.compute(fe(e.inputs[0],"Exp","exp"))},Fs=e=>{e.compute(fe(e.inputs[0],"Floor","floor"))},qs=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Kr(t)))},js=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"LeakyRelu",n=>`select(leaky_relu_alpha_ * ${n}, ${n}, ${n} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Ks=e=>{e.compute(fe(e.inputs[0],"Not",t=>`!${t}`))},Ys=e=>{e.compute(fe(e.inputs[0],"Neg",t=>`-${t}`))},Xs=e=>{e.compute(fe(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Zs=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Qs=e=>{e.compute(fe(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Js=e=>te(e),eu=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"HardSigmoid",n=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${n} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},tu=e=>{e.compute(fe(e.inputs[0],"Sin","sin"))},ru=e=>{e.compute(fe(e.inputs[0],"Sinh","sinh"))},nu=e=>{e.compute(fe(e.inputs[0],"Sqrt","sqrt"))},ou=e=>{e.compute(fe(e.inputs[0],"Tan","tan"))},iu=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,au=e=>{e.compute(fe(e.inputs[0],"Tanh",iu))},ao=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${iu("v")};
}
`,so=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,su=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"FastGelu",so,ao(t),void 0,e.inputs[0].dataType))},uu=(e,t)=>{let r=Oe(e.inputs[0].dataType);return e.compute(fe(e.inputs[0],"ThresholdedRelu",n=>`select(vec4<${r}>(0.0), ${n}, ${n} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},du=e=>{e.compute(fe(e.inputs[0],"Log","log"))},cm=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,pm=e=>`quick_gelu_impl(${e})`,lu=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"QuickGelu",pm,cm(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}});var mm,fm,pu,mu=U(()=>{"use strict";ae();ie();Yr();mm=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},fm=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=E("input",e[0].dataType,e[0].dims,4),n=E("bias",e[0].dataType,[e[0].dims[2]],4),o=M("output",e[0].dataType,t,4),i=k.size(t)/4,a=ge(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${d.declareVariables(r,n,o)}

  ${Kr(a)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${o.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},pu=e=>{mm(e.inputs),e.compute(fm(e.inputs))}});var hm,gm,at,fu,hu,gu,yu,bu,wu,vu,$u,_u,xu,Su=U(()=>{"use strict";Q();ae();ie();hm=(e,t,r,n,o,i,a,l,d,p,m,u)=>{let h,w;typeof l=="string"?h=w=($,S)=>`${l}((${$}),(${S}))`:typeof l=="function"?h=w=l:(h=l.scalar,w=l.vector);let g=M("outputData",m,n.length,4),b=E("aData",d,t.length,4),x=E("bData",p,r.length,4),_;if(o)if(i){let $=k.size(t)===1,S=k.size(r)===1,I=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;$||S?_=g.setByOffset("global_idx",w($?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),S?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):_=`
            let outputIndices = ${g.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",g)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",g)};
            ${g.setByOffset("global_idx",w(a||I?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,a||T?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else _=g.setByOffset("global_idx",w(b.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let $=(S,I,T="")=>{let A=`aData[indexA${I}][componentA${I}]`,D=`bData[indexB${I}][componentB${I}]`;return`
            let outputIndices${I} = ${g.offsetToIndices(`global_idx * 4u + ${I}u`)};
            let offsetA${I} = ${b.broadcastedIndicesToOffset(`outputIndices${I}`,g)};
            let offsetB${I} = ${x.broadcastedIndicesToOffset(`outputIndices${I}`,g)};
            let indexA${I} = offsetA${I} / 4u;
            let indexB${I} = offsetB${I} / 4u;
            let componentA${I} = offsetA${I} % 4u;
            let componentB${I} = offsetB${I} % 4u;
            ${S}[${I}] = ${T}(${h(A,D)});
          `};m===9?_=`
            var data = vec4<u32>(0);
            ${$("data",0,"u32")}
            ${$("data",1,"u32")}
            ${$("data",2,"u32")}
            ${$("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:_=`
            ${$("outputData[global_idx]",0)}
            ${$("outputData[global_idx]",1)}
            ${$("outputData[global_idx]",2)}
            ${$("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,x,g)}

        ${u??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${_}
      }`},gm=(e,t,r,n,o,i,a=r.dataType)=>{let l=!k.areEqual(r.dims,n.dims),d=r.dims,p=k.size(r.dims),m=!1,u=!1,h=[l];if(l){let w=tt.calcShape(r.dims,n.dims,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");d=w,p=k.size(d);let g=k.size(r.dims)===1,b=k.size(n.dims)===1,x=r.dims.length>0&&r.dims[r.dims.length-1]%4===0,_=n.dims.length>0&&n.dims[n.dims.length-1]%4===0;h.push(g),h.push(b),h.push(x),h.push(_);let $=1;for(let S=1;S<d.length;S++){let I=r.dims[r.dims.length-S]??1,T=n.dims[n.dims.length-S]??1;if(I===T)$*=I;else break}$%4===0?(u=!0,m=!0):(g||b||x||_)&&(m=!0)}else m=!0;return h.push(m),{name:e,shaderCache:{hint:t+h.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>hm(w,r.dims,n.dims,d,m,l,u,o,r.dataType,n.dataType,a,i),getRunData:()=>({outputs:[{dims:d,dataType:a}],dispatchGroup:{x:Math.ceil(p/64/4)},programUniforms:[{type:12,data:Math.ceil(k.size(d)/4)},...V(r.dims,n.dims,d)]})}},at=(e,t,r,n,o,i)=>{e.compute(gm(t,o??"",e.inputs[0],e.inputs[1],r,n,i))},fu=e=>{at(e,"Add",(t,r)=>`${t}+${r}`)},hu=e=>{at(e,"Div",(t,r)=>`${t}/${r}`)},gu=e=>{at(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},yu=e=>{at(e,"Mul",(t,r)=>`${t}*${r}`)},bu=e=>{let t=E("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;at(e,"Pow",{scalar:(n,o)=>`pow_custom(${n},${o})`,vector:(n,o)=>`pow_vector_custom(${n},${o})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},wu=e=>{at(e,"Sub",(t,r)=>`${t}-${r}`)},vu=e=>{at(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},$u=e=>{at(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},_u=e=>{at(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},xu=e=>{at(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}});var bm,wm,vm,$m,Iu,Cu,Tu=U(()=>{"use strict";Q();ae();Ce();ie();bm=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,n=e[r],o=n.dataType,i=n.dims.length;e.forEach((a,l)=>{if(l!==r){if(a.dataType!==o)throw new Error("input tensors should be one type");if(a.dims.length!==i)throw new Error("input tensors should have the same shape");a.dims.forEach((d,p)=>{if(p!==t&&d!==n.dims[p])throw new Error("non concat dimensions must match")})}})},wm=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,vm=(e,t)=>{let r=e.length,n=[];for(let o=0;o<r;++o){let i=t.setByOffset("global_idx",e[o].getByIndices("indices"));r===1?n.push(i):o===0?n.push(`if (inputIndex == ${o}u) { ${i} }`):o===r-1?n.push(`else { ${i} }`):n.push(`else if (inputIndex == ${o}) { ${i} }`)}return n.join(`
`)},$m=(e,t,r,n)=>{let o=k.size(r),i=new Array(e.length),a=new Array(e.length),l=0,d=[],p=[],m=[{type:12,data:o}];for(let b=0;b<e.length;++b)l+=e[b].dims[t],i[b]=l,p.push(e[b].dims.length),a[b]=E(`input${b}`,n,p[b]),d.push("rank"),m.push({type:12,data:i[b]});for(let b=0;b<e.length;++b)m.push(...V(e[b].dims));m.push(...V(r));let u=M("output",n,r.length),h=u.indicesGet("indices",t),w=Array.from(Array(i.length).keys()).map(b=>`uniforms.sizeInConcatAxis${b}`).join(","),g=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)b.registerUniform(`sizeInConcatAxis${x}`,"u32");return b.declareVariables(...a,u)})()}

  ${wm(i.length,w)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${u.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${w});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${vm(a,u)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:r,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:m}),getShaderSource:g}},Iu=(e,t)=>{let r=e.inputs,n=r[0].dims,o=k.normalizeAxis(t.axis,n.length);bm(r,o);let i=n.slice();i[o]=r.reduce((l,d)=>l+(d.dims.length>o?d.dims[o]:0),0);let a=r.filter(l=>k.size(l.dims)>0);e.compute($m(a,o,i,r[0].dataType),{inputs:a})},Cu=e=>te({axis:e.axis})});var He,Ge,Le,Xr,lt=U(()=>{"use strict";Q();ae();He=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Ge=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Le=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Xr=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,n]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:n}}else if(t==="Clip"){let[r,n]=e?.activation_params||[Hr,Gr];return{activation:t,clipMax:n,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}});var Ee,Zr,Jt=U(()=>{"use strict";Ee=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Zr=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `});var Qr,uo=U(()=>{"use strict";Qr=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`});var _m,xm,er,Au,Sm,tr,Im,Jr,rr=U(()=>{"use strict";Q();ae();ie();lt();Jt();_m=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,xm=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,er=(e,t,r="f32",n,o=!1,i=32,a=!1,l=32)=>{let d=t[1]*e[1],p=t[0]*e[0],m=o?d:i,u=o?i:d,h=m/t[0],w=i/t[1];if(!((o&&h===4&&e[1]===4||!o&&(h===3||h===4))&&m%t[0]===0&&i%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${o} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${m} must be divisible by workgroupSize[0]${t[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${r}>, ${m/h}>, ${u}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${p/e[0]}>, ${i}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${a?"0":"i32(globalId.z)"};
  ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${d};

  let num_tiles = ${a?`${Math.ceil(l/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${a?`i32(globalId.z) * ${l}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${w};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${_m(o,n)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${n?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${xm(o,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Au=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Sm=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",tr=(e,t,r="f32",n,o=!1,i=32,a=!1,l=32,d=!1)=>{let p=e[1]*t[1],m=e[0]*t[0],u=o?p:i,h=o?i:p;if(!(h%t[1]===0&&u%t[0]===0&&i%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${u} must be divisible by workgroupSize[0]${t[0]}, tileInner ${i} must be divisible by workgroupSize[1]${t[1]}`);let w=h/t[1],g=u/t[0],b=i/t[1],x=d?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${p};
    let globalColStart = i32(workgroupId.x) * ${m};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${u}; inputCol = inputCol + ${t[0]}) {
          ${Au(o,n)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${n?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${o?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${p};

let tileRowA = i32(localId.y) * ${w};
let tileColA = i32(localId.x) * ${g};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${g}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Au(o,n)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${n?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Sm(o)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${u}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${m}>, ${i}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${a?"0":"i32(globalId.z)"};
    ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${a?`${Math.ceil(l/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${a?`i32(globalId.z) * ${l}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${x}
  }
`},Im=(e,t,r,n,o,i=!1)=>{let[a,l,d]=o,[p,m,u,h]=n,w=Nt(a,d),g=Nt(l,d),b=ge(n[0].type.tensor),x=()=>{let S=m.rank,I=p.rank,T=`var aIndices: ${m.type.indices};`;for(let A=S-2-1,D=I-1;A>=0;A--,D--)T+=`
aIndices[${A}] = ${I>1?`batchIndices[${D}]`:"batchIndices"};`;return w.forEach(A=>{T+=`
aIndices[${A}] = 0;`}),T+=`
aIndices[${S-2}] = u32(row);
                   aIndices[${S-1}] = u32(colIn);`,T},_=()=>{let S=u.rank,I=p.rank,T=`var bIndices: ${u.type.indices};`;for(let A=S-2-1,D=I-1;A>=0;A--,D--)T+=`
bIndices[${A}] = ${I>1?`batchIndices[${D}]`:"batchIndices"};`;return g.forEach(A=>{T+=`
bIndices[${A}] = 0;`}),T+=`
bIndices[${S-2}] = u32(row);
                   bIndices[${S-1}] = u32(colIn);`,T};return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${p.type.indices}) -> ${Ee(e,b)} {
      var value = ${Ee(e,b)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        ${x()}
        value = ${m.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${p.type.indices}) -> ${Ee(e,b)} {
      var value = ${Ee(e,b)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        ${_()}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ee(e,b)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${i?"bias[colIn]":`${Ee(e,b)}(bias[row])`};`:""}
        ${r}
        ${h.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Jr=(e,t,r,n,o=!1)=>{let i=e[0].dims,a=e[1].dims,l=i.slice(0,-2),d=a.slice(0,-2),p=n?n.slice(0,-2):r.slice(0,-2),m=k.size(p),u=i[i.length-2],h=i[i.length-1],w=a[a.length-1],g=h%4===0&&w%4===0,b=u<=8?[4,1,1]:[4,4,1],x=[8,8,1],_=[Math.ceil(w/x[0]/b[0]),Math.ceil(u/x[1]/b[1]),Math.ceil(m/x[2]/b[2])],$=g?4:1,S=[...l,u,h/$],I=S.length,T=[...d,h,w/$],A=T.length,D=[m,u,w/$],z=[{type:6,data:u},{type:6,data:w},{type:6,data:h}];Ge(t,z),z.push(...V(p,S,T));let H=["rank","rank"],W=e.length>2;W&&(z.push(...V(e[2].dims)),H.push("rank")),z.push(...V(D));let X=Y=>{let pe=p.length,ue=Lr("batchDims",e[0].dataType,pe,1),le=ge(e[0].dataType),K=E("a",e[0].dataType,I,$),de=E("b",e[1].dataType,A,$),re=M("result",e[0].dataType,D.length,$),se=[K,de];if(W){let R=o?$:1;se.push(E("bias",e[2].dataType,e[2].dims.length,R))}let Z=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Le(t,Z);let ne=ge(re.type.tensor),J=He(t,re.type.value,ne),ke=Im($,W,J,[ue,K,de,re],[l,d,p],o);return`
  ${Y.registerUniforms(Z).registerInternalVariables(ue).declareVariables(...se,re)}
  ${ke}
  ${g?er(b,x,le,ue):tr(b,x,le,ue)}
                   `};return{name:"MatMul",shaderCache:{hint:`${b};${t.activation};${g};${o}`,inputDependencies:H},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:_[0],y:_[1],z:_[2]},programUniforms:z}),getShaderSource:X}}});var Cm,Eu,ku=U(()=>{"use strict";Q();dt();ie();lt();Jt();uo();rr();Cm=(e,t,r,n,o=!1,i,a=4,l=4,d=4,p="f32")=>{let m=W=>{switch(W){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${p}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},u=W=>{switch(W){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,w=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,g=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",_=e?"col":"row",$=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${_} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${_} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${_} % inChannels;
    var resData = ${Ee(a,p)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${g} && xCol >= 0 && xCol < ${b}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${m(a)}
    }
    return resData;`,S=e?t&&n?`
    let col = colIn * ${a};
    ${$}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${$}
    }
    return ${Ee(a,p)}(0.0);`:n&&r?`
    let col = colIn * ${a};
    ${$}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${$}
    }
    return ${Ee(a,p)}(0.0);`,I=`${u(l)}`,T=Ee(d,p),A=e?Ee(a,p):Ee(l,p),D=e?Ee(l,p):Ee(a,p),z=He(i,T,p);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?S:I}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${D} {
      ${e?I:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${d};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${w}
      ${Zr(o)}
      ${z}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Eu=(e,t,r,n,o,i,a,l)=>{let d=t.format==="NHWC",p=d?e[0].dims[3]:e[0].dims[1],m=r[0],u=d?r[2]:r[3],h=d?r[1]:r[2],w=d?r[3]:r[1],g=d&&(p%4===0||p%3===0)&&w%4===0,b=d?w:u*h,x=d?u*h:w,_=[8,8,1],$=n<=8?[4,1,1]:[4,4,1],S=[Math.ceil(b/_[0]/$[0]),Math.ceil(x/_[1]/$[1]),Math.ceil(m/_[2]/$[2])];ve("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let I=g?d&&p%4!==0?3:4:1,T=_[1]*$[1],A=_[0]*$[0],D=Math.max(_[0]*I,_[1]),z=n%T===0,H=o%A===0,W=i%D===0,X=g?[I,4,4]:[1,1,1],Y=[{type:6,data:n},{type:6,data:o},{type:6,data:i},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Ge(t,Y),Y.push(...V(e[0].dims,e[1].dims));let pe=["rank","rank"];a&&(Y.push(...V(e[2].dims)),pe.push("rank")),Y.push(...V(r));let ue=le=>{let K=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Le(t,K);let de=g?4:1,re=ge(e[0].dataType),se=`
      fn setOutputAtIndex(flatIndex : i32, value : ${g?`vec4<${re}>`:re}) {
        result[flatIndex] = ${g?`vec4<${re}>`:re}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${g?`vec4<${re}>`:re}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${g?"/ 4":""}, value);
      }`,Z=E("x",e[0].dataType,e[0].dims.length,I===3?1:I),ne=E("w",e[1].dataType,e[1].dims.length,de),J=[Z,ne],ke=M("result",e[0].dataType,r.length,de);if(a){let R=E("bias",e[2].dataType,e[2].dims.length,de);J.push(R),se+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${g?`vec4<${re}>`:re} {
          return bias[coords.${d?"w":"y"}${g?"/ 4":""}];
        }`}return`
        ${Qr("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${le.registerUniforms(K).declareVariables(...J,ke)}
        ${se}
        ${Cm(d,z,H,W,a,t,X[0],X[1],X[2],re)}
        ${g?er($,_,re,void 0,!d,D):tr($,_,re,void 0,!d,D,!1,void 0,l)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${g};${z};${H};${W};${T};${A};${D}`,inputDependencies:pe},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:Y}),getShaderSource:ue}}});var Tm,Pu,en,Am,Ou,Em,Du,zu,Bu=U(()=>{"use strict";Q();dt();ae();ie();lt();Jt();Tm=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Pu=e=>typeof e=="number"?[e,e,e]:e,en=(e,t)=>t<=1?e:e+(e-1)*(t-1),Am=(e,t,r,n=1)=>{let o=en(t,n);return Math.floor((e[0]*(r-1)-r+o)/2)},Ou=(e,t,r,n,o)=>{o==null&&(o=Am(e,t[0],n[0]));let i=[0,0,0,r];for(let a=0;a<3;a++)e[a]+2*o>=t[a]&&(i[a]=Math.trunc((e[a]-t[a]+2*o)/n[a]+1));return i},Em=(e,t,r,n,o,i,a,l,d,p)=>{let m,u,h,w;if(e==="VALID"&&(e=0),typeof e=="number"){m={top:e,bottom:e,left:e,right:e,front:e,back:e};let g=Ou([t,r,n,1],[l,d,p],1,[o,i,a],e);u=g[0],h=g[1],w=g[2]}else if(Array.isArray(e)){if(!e.every((b,x,_)=>b===_[0]))throw Error(`Unsupported padding parameter: ${e}`);m={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let g=Ou([t,r,n,1],[l,d,p],1,[o,i,a],e[0]);u=g[0],h=g[1],w=g[2]}else if(e==="SAME_UPPER"){u=Math.ceil(t/o),h=Math.ceil(r/i),w=Math.ceil(n/a);let g=(u-1)*o+l-t,b=(h-1)*i+d-r,x=(w-1)*a+p-n,_=Math.floor(g/2),$=g-_,S=Math.floor(b/2),I=b-S,T=Math.floor(x/2),A=x-T;m={top:S,bottom:I,left:T,right:A,front:_,back:$}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:m,outDepth:u,outHeight:h,outWidth:w}},Du=(e,t,r,n,o,i=!1,a="channelsLast")=>{let l,d,p,m,u;if(a==="channelsLast")[l,d,p,m,u]=e;else if(a==="channelsFirst")[l,u,d,p,m]=e;else throw new Error(`Unknown dataFormat ${a}`);let[h,,w,g,b]=t,[x,_,$]=Pu(r),[S,I,T]=Pu(n),A=en(w,S),D=en(g,I),z=en(b,T),{padInfo:H,outDepth:W,outHeight:X,outWidth:Y}=Em(o,d,p,m,x,_,$,A,D,z),pe=i?h*u:h,ue=[0,0,0,0,0];return a==="channelsFirst"?ue=[l,pe,W,X,Y]:a==="channelsLast"&&(ue=[l,W,X,Y,pe]),{batchSize:l,dataFormat:a,inDepth:d,inHeight:p,inWidth:m,inChannels:u,outDepth:W,outHeight:X,outWidth:Y,outChannels:pe,padInfo:H,strideDepth:x,strideHeight:_,strideWidth:$,filterDepth:w,filterHeight:g,filterWidth:b,effectiveFilterDepth:A,effectiveFilterHeight:D,effectiveFilterWidth:z,dilationDepth:S,dilationHeight:I,dilationWidth:T,inShape:e,outShape:ue,filterShape:t}},zu=(e,t,r,n,o,i)=>{let a=i==="channelsLast",l=a?e[0].dims[3]:e[0].dims[1],d=!1,p=[64,1,1],m={x:r.map(($,S)=>S)},u=[Math.ceil(Tm(m.x.map($=>r[$]))/p[0]),1,1];ve("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${u}`);let h=d?a&&l%4!==0?3:4:1,w=k.size(r),g=[{type:12,data:w},{type:12,data:n},{type:12,data:o},{type:12,data:t.strides},{type:12,data:t.dilations}];Ge(t,g),g.push(...V(e[0].dims,e[1].dims));let b=["rank","rank"],x=e.length===3;x&&(g.push(...V(e[2].dims)),b.push("rank")),g.push(...V(r));let _=$=>{let S=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:n.length},{name:"pads",type:"u32",length:o.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Le(t,S);let I=d?4:1,T=ge(e[0].dataType),A=E("x",e[0].dataType,e[0].dims.length,h===3?1:h),D=E("W",e[1].dataType,e[1].dims.length,I),z=[A,D],H=M("result",e[0].dataType,r.length,I),W="";if(x){let pe=E("bias",e[2].dataType,e[2].dims.length,I);z.push(pe),W+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${d?`vec4<${T}>`:T} {
          return bias[${a?G("coords",4,5):G("coords",1,5)}${d?"/ 4":""}];
        }`}let X=Ee(h,T),Y=He(t,X,T);return`
            ${W}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${A.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${D.getByIndices("aIndices")};
            }
          ${$.registerUniforms(S).declareVariables(...z,H)}
          ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${H.offsetToIndices("global_idx")};
              let batch = ${G("coords",0,A.rank)};
              let d2 = ${a?G("coords",A.rank-1,A.rank):G("coords",1,A.rank)};
              let xFRCCorner = vec3<u32>(${a?G("coords",1,A.rank):G("coords",2,A.rank)},
              ${a?G("coords",2,A.rank):G("coords",3,A.rank)},
              ${a?G("coords",3,A.rank):G("coords",4,A.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${a?G("uniforms.x_shape",1,A.rank):G("uniforms.x_shape",2,A.rank)};
              let xShapeZ = ${a?G("uniforms.x_shape",2,A.rank):G("uniforms.x_shape",3,A.rank)};
              let xShapeW = ${a?G("uniforms.x_shape",3,A.rank):G("uniforms.x_shape",4,A.rank)};
              let xShapeU = ${a?G("uniforms.x_shape",4,A.rank):G("uniforms.x_shape",1,A.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${a?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${a?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${a?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${a?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${x?"value = value + getBiasByOutputCoords(coords)":""};
              ${Y}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${a};${h};${x}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:u[0],y:u[1],z:u[2]},programUniforms:g}),getShaderSource:_}}});var lo,Ru,Mu=U(()=>{"use strict";Q();ae();ie();co();lt();lo=(e,t,r)=>{let n=e.length>2,o=n?"value += b[output_channel];":"",i=e[0].dims,a=e[1].dims,l=a[0]/t.group,d=t.format==="NHWC",p=tn(i,a,t.dilations,t.pads,t.strides,d),m=k.size(p),u=[{type:12,data:m},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:l}];Ge(t,u),u.push(...V(i,a));let h=["rank","rank"];n&&(u.push(...V(e[2].dims)),h.push("rank")),u.push(...V(p));let w=g=>{let b=M("output",e[0].dataType,p.length),x=ge(b.type.tensor),_=He(t,b.type.value,x),$=E("x",e[0].dataType,i.length),S=E("w",e[1].dataType,a.length),I=[$,S];n&&I.push(E("b",e[2].dataType,e[2].dims.length));let T=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];return Le(t,T),`
  ${g.registerUniforms(T).declareVariables(...I,b)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${b.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${d?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${d?1:2}], outputIndices[${d?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel / uniforms.output_channels_per_group;

    var value: ${b.type.value} = ${b.type.value}(0);
    for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
      let input_channel = group_id * uniforms.w_shape[1] + wInChannel;
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[${d?1:2}]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[${d?2:3}]) {
            continue;
          }

          let xVal = ${d?$.get("batch","xHeight","xWidth","input_channel"):$.get("batch","input_channel","xHeight","xWidth")};
          let wVal = ${S.get("output_channel","wInChannel","wHeight","wWidth")};
          value += xVal*wVal;
        }
      }
    }
    ${o}
    ${_}
    ${b.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:t.cacheKey,inputDependencies:h},getRunData:()=>({outputs:[{dims:r?r(p):p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:u}),getShaderSource:w}},Ru=(e,t,r)=>{let n=e.length>2,o=$e(r[3]),i=$e(r[2]),a=k.size(r)/o/i,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/o],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/o],p=[r[0],r[1],r[2],r[3]/o],m=[{type:12,data:a},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Ge(t,m),m.push(...V(l,d,p));let u=(i-1)*t.strides[1]+d[1],h=w=>{let g=M("output",e[0].dataType,p.length,o),b=ge(g.type.tensor),x=He(t,g.type.value,b),_=E("x",e[0].dataType,l.length,o),$=E("w",e[1].dataType,d.length,o),S=[_,$];n&&S.push(E("b",e[2].dataType,e[2].dims,o));let I=n?"value += b[output_channel];":"",T=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Le(t,T),`
  ${w.registerUniforms(T).declareVariables(...S,g)}
  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${i}u;
    let col = (index1 % width1) * ${i}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${_.type.value}, ${u}>;
    var values: array<${g.type.value}, ${i}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${u}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${_.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${_.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${$.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${i}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${i}u; i++) {
      var value = values[i];
      ${I}
      ${x}
      ${g.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${o};${i};${u};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:m}),getShaderSource:h}}});var po,km,Uu,mo=U(()=>{"use strict";Q();ae();rr();ie();lt();po=(e,t,r,n,o=!1)=>{let i=e[0].dims,a=e[1].dims,l=i[i.length-2],d=a[a.length-1],p=i[i.length-1],m=$e(d),u=$e(p),h=$e(l),w=k.size(r)/m/h,g=e.length>2,b=n?n.slice(0,-2):r.slice(0,-2),_=[k.size(b),l,d],$=[{type:12,data:w},{type:12,data:l},{type:12,data:d},{type:12,data:p}];Ge(t,$),$.push(...V(b,i,a)),g&&$.push(...V(e[2].dims)),$.push(...V(_));let S=I=>{let T=Lr("batch_dims",e[0].dataType,b.length),A=E("a",e[0].dataType,i.length,u),D=E("b",e[1].dataType,a.length,m),z=M("output",e[0].dataType,_.length,m),H=ge(z.type.tensor),W=He(t,z.type.value,H),X=[A,D],Y="";if(g){let Z=o?m:1;X.push(E("bias",e[2].dataType,e[2].dims.length,Z)),Y=`${o?`value += bias[col / ${Z}];`:`value += ${z.type.value}(bias[row + i]);`}`}let pe=i.slice(0,-2),ue=a.slice(0,-2),le=Nt(pe,b),K=Nt(ue,b),de=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Le(t,de);let re=(Z,ne)=>{let J=Z.rank,ke=Z.name;if(J===2)return`var ${ke}_indices = ${Z.type.indices}(0u, 0u);`;let R=T.rank,F=`var ${ke}_indices: ${Z.type.indices};`;for(let ce=J-2-1,Re=R-1;ce>=0;ce--,Re--)F+=`
${ke}_indices[${ce}] = ${R>1?`batch_indices[${Re}]`:"batch_indices"};`;return ne.forEach(ce=>{F+=`
${ke}_indices[${ce}] = 0;`}),F+=`${ke}_indices[${J-2}] = 0u;
                     ${ke}_indices[${J-1}] = 0u;`,F},se=()=>{let Z=`var a_data: ${A.type.value};`;for(let ne=0;ne<u;ne++)Z+=`
              let b_data${ne} = b[(b_offset + (k + ${ne}) * uniforms.N + col) / ${m}];`;for(let ne=0;ne<h;ne++){Z+=`a_data = a[(a_offset + (row + ${ne}) * uniforms.K + k) / ${u}];`;for(let J=0;J<u;J++)Z+=`
            values[${ne}] = fma(${D.type.value}(a_data${u===1?"":`[${J}]`}), b_data${J}, values[${ne}]);
`}return Z};return`
  ${I.registerUniforms(de).registerInternalVariables(T).declareVariables(...X,z)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${m})) * ${m};
    var index1 = global_idx / (uniforms.N / ${m});
    let stride1 = uniforms.M / ${h};
    let row = (index1 % stride1) * ${h};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}
    ${re(A,le)}
    let a_offset = ${A.indicesToOffset("a_indices")};
    ${re(D,K)}
    let b_offset = ${D.indicesToOffset("b_indices")};
    var values: array<${z.type.value}, ${h}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${u}) {
      ${se()}
    }
    for (var i = 0u; i < ${h}u; i++) {
      var value = values[i];
      ${Y}
      ${W}
      let cur_indices = ${z.type.indices}(batch, row + i, col);
      let offset = ${z.indicesToOffset("cur_indices")};
      ${z.setByOffset(`offset / ${m}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${m};${u};${h};${o}`,inputDependencies:g?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:$}),getShaderSource:S}},km=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Uu=e=>{km(e.inputs);let t=tt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],n=e.inputs[0].dims[e.inputs[0].dims.length-1];r<8&&n<8?e.compute(po(e.inputs,{activation:""},t)):e.compute(Jr(e.inputs,{activation:""},t))}});var tn,fo,Pm,ho,go,Om,Dm,zm,yo,co=U(()=>{"use strict";ae();ku();Bu();rr();Mu();lt();mo();Et();tn=(e,t,r,n,o,i)=>{let a=e[0],l=e.slice(i?1:2,i?3:4),d=l.length,p=t[0],u=t.slice(2).map((g,b)=>g+(g-1)*(r[b]-1)),w=l.map((g,b)=>g+n[b]+n[b+d]).map((g,b)=>Math.floor((g-u[b]+o[b])/o[b]));return w.splice(0,0,a),w.splice(i?3:1,0,p),w},fo=[2,3,1,0],Pm=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],n=e[1].dims[1]*t.group;if(r!==n)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let o=e[0].dims.length-2;if(t.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(t.strides.length!==o)throw new Error(`strides should be ${o}D`);if(t.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},ho=(e,t)=>{let r=e.kernelShape.slice();for(let i=2;i<t[1].dims.length;++i)r[i-2]===0&&(r[i-2]=t[1].dims[i]);let n=e.pads.slice();Ct.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,n,e.format==="NHWC",e.autoPad);let o=Object.assign({},e);return Object.assign(o,{kernelShape:r,pads:n}),o},go=e=>{let t=Xr(e),r=e.format,n=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],o=e.dilations,i=e.group,a=e.kernel_shape,l=e.pads,d=e.strides,p=e.w_is_const();return{autoPad:n,format:r,dilations:o,group:i,kernelShape:a,pads:l,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Om=(e,t,r)=>{let n=ho(r,t),o=r.format==="NHWC";if(r.group!==1){if(!e.adapterInfo.isArchitecture("ampere")&&o&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1){let D=tn(t[0].dims,t[1].dims,r.dilations,n.pads,r.strides,o),z=e.kernelCustomData.wT??e.compute(Ue(t[1],fo),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=z);let H=[t[0],z];t.length===3&&H.push(t[2]),e.compute(Ru(H,n,D),{inputs:H})}else e.compute(lo(t,n));return}let i=t.length===3,a=t[0].dims[o?1:2],l=t[0].dims[o?2:3],d=t[0].dims[o?3:1],p=t[1].dims[2],m=t[1].dims[3],u=tn(t[0].dims,t[1].dims,r.dilations,n.pads,r.strides,o),h=u[o?1:2],w=u[o?2:3],g=u[o?3:1],b=o&&p===a&&m===l&&r.pads[0]===0&&r.pads[1]===0;if(b||p===1&&m===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let A=u[0],D,z,H,W=[];if(o){let pe=e.kernelCustomData.wT??e.compute(Ue(t[1],fo),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=pe),b){let ue=a*l*d;D=t[0].reshape([1,A,ue]),z=pe.reshape([1,ue,g]),H=[1,A,g]}else D=t[0].reshape([A,a*l,d]),z=pe.reshape([1,d,g]),H=[A,h*w,g];W.push(D),W.push(z)}else D=t[0].reshape([A,d,a*l]),z=t[1].reshape([1,g,d]),H=[A,g,h*w],W.push(z),W.push(D);i&&W.push(t[2]);let X=H[2],Y=W[0].dims[W[0].dims.length-1];X<8&&Y<8?e.compute(po(W,n,u,H,o),{inputs:W}):e.compute(Jr(W,n,u,H,o),{inputs:W});return}let x=!0,_=e.kernelCustomData.wT??e.compute(Ue(t[1],fo),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=_);let $=[t[0],_];i&&$.push(t[2]);let S=o?h*w:g,I=o?g:h*w,T=p*m*d;e.compute(Eu($,n,u,S,I,T,i,x),{inputs:$})},Dm=(e,t)=>{let r=t.format==="NHWC",n=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&n.push(e.inputs[2]);let o=[0,t.pads[0],0,t.pads[1]],i=[1].concat(t.strides),a=[1].concat(t.dilations),l=[1].concat(t.kernelShape),d=ho({...t,pads:o,strides:i,dilations:a,kernelShape:l},n);e.compute(lo(n,d,p=>r?[p[0],p[2],p[3]]:[]))},zm=(e,t,r)=>{let n=r.format==="NHWC"?"channelsLast":"channelsFirst",o=ho(r,t),i=r.autoPad==="NOTSET"?r.pads:r.autoPad,a=Du(t[0].dims,t[1].dims,r.strides,r.dilations,i,!1,n);e.compute(zu(t,o,a.outShape,[a.filterDepth,a.filterHeight,a.filterWidth],[a.padInfo.front,a.padInfo.top,a.padInfo.left],n))},yo=(e,t)=>{Pm(e.inputs,t),e.inputs[0].dims.length===3?Dm(e,t):e.inputs[0].dims.length===5?zm(e,e.inputs,t):Om(e,e.inputs,t)}});var Bm,Vu,Nu=U(()=>{"use strict";Q();dt();ie();lt();Jt();uo();rr();Bm=(e,t=!1,r,n,o=4)=>{let i=_=>{switch(_){case 1:return"return w[getIndexFromCoords4D(coord, vec4<i32>(uniforms.w_shape))];";case 4:return`
            let coord1 = vec4<i32>(coordX, coordY, col + 1, rowInner);
            let coord2 = vec4<i32>(coordX, coordY, col + 2, rowInner);
            let coord3 = vec4<i32>(coordX, coordY, col + 3, rowInner);
            let v0 = w[getIndexFromCoords4D(coord, vec4<i32>(uniforms.w_shape))];
            let v1 = w[getIndexFromCoords4D(coord1, vec4<i32>(uniforms.w_shape))];
            let v2 = w[getIndexFromCoords4D(coord2, vec4<i32>(uniforms.w_shape))];
            let v3 = w[getIndexFromCoords4D(coord3, vec4<i32>(uniforms.w_shape))];
            return ${n}(v0, v1, v2, v3);
            `;default:throw new Error(`innerElementSize ${_} is not supported.`)}},a=e?`
      let coord = vec4<i32>(batch, iXR, iXC, xCh);
      `:`
      let coord = vec4<i32>(batch, xCh, iXR, iXC);
      `,l=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,d=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",p=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",m=e?"row":"col",u=e?"col":"row",h=`
      let inChannels = ${e?"i32(uniforms.x_shape[3])":"i32(uniforms.x_shape[1])"};
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      let outRow = ${m} / outWidth;
      let outCol = ${m} % outWidth;

      let WRow = ${u} / (uniforms.filter_dims[1] * inChannels);
      let WCol = ${u} / inChannels % uniforms.filter_dims[1];
      let xR = f32(outRow - uniforms.pads[0] + uniforms.dilations[0] * WRow) / f32(uniforms.strides[0]);
      let xC = f32(outCol - uniforms.pads[1] + uniforms.dilations[1] * WCol) / f32(uniforms.strides[1]);
      if (xR < 0.0 || xR >= f32(${d}) || fract(xR) > 0.0) {
        return ${n}(0.0);
      }
      if (xC < 0.0 || xC >= f32(${p}) || fract(xC) > 0.0) {
        return ${n}(0.0);
      }
      let iXR = i32(xR);
      let iXC = i32(xC);
      let xCh = ${u} % inChannels;
      ${a}
      return x[getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape))/${o}];`,w=e?`
      let col = colIn * ${o};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
        ${h}
      }
      return ${n}(0.0);`:`
      let col = colIn * ${o};
      if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
        ${h}
      }
      return ${n}(0.0);`,g=`
      let col = colIn * ${o};
      let inChannels = ${e?"i32(uniforms.x_shape[3])":"i32(uniforms.x_shape[1])"};
      let coordX = uniforms.filter_dims[0] - 1 - row / (uniforms.filter_dims[1] * inChannels);
      let coordY = uniforms.filter_dims[1] - 1 - (row / inChannels) % uniforms.filter_dims[1];
      if (${e?"row < uniforms.dim_inner && col < uniforms.dim_b_outer":"row < uniforms.dim_inner && col < uniforms.dim_a_outer"}  && coordX >= 0 && coordY >= 0) {
        let rowInner = row % inChannels;
        let coord = vec4<i32>(coordX, coordY, col, rowInner);
        ${i(o)}
      }
      return ${n}(0.0);
      `,b=He(r,n);return`
  fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${n} {
    ${e?w:g}
  }

  fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${n} {
    ${e?g:w}
  }

  fn mm_write(batch: i32, row : i32, colIn : i32, valueInput : ${n}) {
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
      var value = valueInput;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${l}
      ${Zr(t)}
      ${b}
      result[getIndexFromCoords4D(coords, vec4<i32>(uniforms.result_shape))/${o}] = value;
    }
  }`},Vu=(e,t,r,n,o,i,a,l)=>{let d=t.format==="NHWC",p=d?e[0].dims[3]:e[0].dims[1],m=r[0],u=d?r[2]:r[3],h=d?r[1]:r[2],w=d?r[3]:r[1],g=d&&p%4===0&&p%3&&w%4===0,b=d?w:u*h,x=d?u*h:w,_=[8,8,1],$=n<=8?[4,1,1]:[4,4,1],S=[Math.ceil(b/_[0]/$[0]),Math.ceil(x/_[1]/$[1]),Math.ceil(m/_[2]/$[2])];ve("verbose",()=>`[conv_backprop_mm_webgpu] dispatch = ${S}`);let I=g?4:1,T=Math.max(_[0]*I,_[1]),A=g?4:1,D=[t.kernelShape[d?1:2],t.kernelShape[d?2:3]],z=[D[0]+(t.dilations[0]<=1?0:(D[0]-1)*(t.dilations[0]-1)),D[1]+(t.dilations[1]<=1?0:(D[1]-1)*(t.dilations[1]-1))],H=[z[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),z[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],W=[{type:6,data:n},{type:6,data:o},{type:6,data:i},{type:6,data:t.strides},{type:6,data:t.dilations},{type:6,data:D},{type:6,data:H}];Ge(t,W),W.push(...V(e[0].dims,e[1].dims));let X=["rank","rank"];a&&(W.push(...V(e[2].dims)),X.push("rank")),W.push(...V(r));let Y=pe=>{let ue=E("x",e[0].dataType,e[0].dims.length,A),le=E("w",e[1].dataType,e[1].dims.length,1),K=M("result",e[0].dataType,r.length,A),de=[ue,le],re="";if(a){let ne=E("bias",e[2].dataType,e[2].dims.length,A);de.push(ne),re+=`
          fn getBiasByOutputCoords(coords : vec4<i32>) -> ${ne.type.value} {
            return bias[coords.${d?"w":"y"}${g?"/ 4":""}];
          }`}let se=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"strides",type:"i32",length:2},{name:"dilations",type:"i32",length:2},{name:"filter_dims",type:"i32",length:D.length},{name:"pads",type:"i32",length:H.length}];Le(t,se);let Z=ge(e[0].dataType,1);if(Z!=="f16"&&Z!=="f32")throw new Error(`elemType ${Z} is not supported.`);return`
        ${Qr("uniforms.result_strides")}
        ${pe.registerUniforms(se).declareVariables(...de,K)};
        ${re}
        ${Bm(d,a,t,ue.type.value,I)}
        ${g?er($,_,Z,void 0,!d,T):tr($,_,Z,void 0,!d,T,!1,void 0,l)}`};return{name:"Conv2DTransposeMatMul",shaderCache:{hint:`${t.cacheKey};${$};${_};${g}`,inputDependencies:X},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:W}),getShaderSource:Y}}});var Rm,bo,Wu=U(()=>{"use strict";Q();dt();ae();ie();Rm=(e,t,r,n,o,i=!1,a,l,d=!1)=>{let p=d?1:2,m=d?2:3,u=d?3:1,h=i?2:1,w=`
  fn setOutputAtIndex(flatIndex : u32, value : ${i?`vec4<${a}>`:a}) {
    result[flatIndex] = ${i?`vec4<${a}>`:a}(value);
  }`;n&&(w+=`
    fn getBiasByOutputCoords(coords : vec4<u32>) -> ${i?`vec4<${a}>`:a} {
      return bias[coords.${d?"w":"y"}${i?"/ 4":""}];
    }`);let g=i?4:1,b=E("W",t[1].dataType,t[1].dims.length,g),x=E("Dy",t[0].dataType,t[0].dims.length,g),_=[x,b];n&&_.push(E("bias",t[2].dataType,[r[u]].length,g));let $=M("result",t[0].dataType,r.length,g),S=`{
        let batch: u32 = ${o?"global_id.z":"workgroup_id.z"} / uniforms.result_shape[1];
        let r = ${o?"global_id.z":"workgroup_id.z"} % uniforms.result_shape[1];
        let c = ${o?"global_id.y":"workgroup_id.y"} * ${h};
        let d1: u32 = ${o?"global_id.x":"workgroup_id.x"} * 4;

        let dyCorner = vec2<i32>(i32(r), i32(c)) - vec2<i32>(uniforms.pads);

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        var dotProd: array<vec4<${a}>, ${h}>;
        for (var i = 0; i < ${h}; i++) {
          dotProd[i] = vec4<${a}>(0.0);
        }
        for (var wR: u32 = 0; wR < uniforms.filter_dims[0]; wR = wR + 1) {
          var dyR = (${a}(dyCorner.x) + ${a}(wR)) / ${a}(uniforms.strides.x);
          let wRPerm = uniforms.filter_dims[0] - 1 - wR;
          if (dyR < 0.0 || dyR >= ${a}(uniforms.Dy_shape[1]) ||
              fract(dyR) > 0.0 || wRPerm < 0) {
            continue;
          }
          let idyR: u32 = u32(dyR);

          for (var wC: u32 = 0; wC < uniforms.filter_dims[1]; wC = wC + 1) {
            let dyC = (${a}(dyCorner.y) + ${a}(wC)) / ${a}(uniforms.strides.y);
            let dyC2 = (${a}(dyCorner.y) + 1.0 + ${a}(wC)) / ${a}(uniforms.strides.y);
            let wCPerm = uniforms.filter_dims[1] - 1 - wC;
            if (wCPerm < 0) {
              continue;
            }
            var bDyCVal = true;
            var bDyCVal2 = true;
            if (dyC < 0.0 || dyC >= ${a}(uniforms.Dy_shape[2]) ||
                fract(dyC) > 0.0) {
              bDyCVal = false;
            }
            if (dyC2 < 0.0 || dyC2 >= ${a}(uniforms.Dy_shape[2]) ||
                fract(dyC2) > 0.0) {
              bDyCVal2 = false;
            }

            let idyC: u32 = u32(dyC);
            let idyC2: u32 = u32(dyC2);
            if (bDyCVal && bDyCVal2) {
              let d2Length = uniforms.Dy_shape[3];
              for (var d2 :u32 = 0; d2 < d2Length; d2 = d2 + 4) {
                let wValue0 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1","d2")};
                let wValue1 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 1","d2")};
                let wValue2 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 2","d2")};
                let wValue3 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 3","d2")};

                var xValue = ${x.get("batch","idyR","idyC","d2")};
                let tmpval = vec4<${a}>(dot(xValue, wValue0),
                                      dot(xValue, wValue1),
                                      dot(xValue, wValue2),
                                      dot(xValue, wValue3));
                dotProd[0] = dotProd[0] + tmpval;

                xValue =  ${x.get("batch","idyR","idyC2","d2")};

                dotProd[1] = dotProd[1] + vec4<${a}>(dot(xValue, wValue0),
                                                    dot(xValue, wValue1),
                                                    dot(xValue, wValue2),
                                                    dot(xValue, wValue3));
              }
            } else if (bDyCVal) {
              let d2Length = uniforms.Dy_shape[${u}];
              for (var d2: u32 = 0; d2 < d2Length; d2 = d2 + 4) {
                let wValue0 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1","d2")};
                let wValue1 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 1","d2")};
                let wValue2 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 2","d2")};
                let wValue3 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 3","d2")};

                var xValue = ${x.get("batch","idyR","idyC","d2")};
                let tmpval = vec4<${a}>(dot(xValue, wValue0),
                                      dot(xValue, wValue1),
                                      dot(xValue, wValue2),
                                      dot(xValue, wValue3));
                dotProd[0] = dotProd[0] + tmpval;
              }
            } else if (bDyCVal2) {
              let d2Length = uniforms.Dy_shape[3];
              for (var d2: u32 = 0; d2 < d2Length; d2 = d2 + 4) {
                let wValue0 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1","d2")};
                let wValue1 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 1","d2")};
                let wValue2 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 2","d2")};
                let wValue3 = ${b.get("u32(wRPerm)","u32(wCPerm)","d1 + 3","d2")};

                var xValue = ${x.get("batch","idyR","idyC2","d2")};
                let tmpval = vec4<${a}>(dot(xValue, wValue0),
                                      dot(xValue, wValue1),
                                      dot(xValue, wValue2),
                                      dot(xValue, wValue3));
                dotProd[1] = dotProd[1] + tmpval;
              }
            }
          }
        }

        for (var i: u32 = 0; i < ${h}; i = i + 1) {
          let value = dotProd[i] + ${n?"bias[c+i]":`vec4<${a}>(0.0)`};
          ${$.set("batch","r","c + i","d1","value")};
        }
      }`,I=`
          let outputIndices = ${$.offsetToIndices("global_idx")};
          let batch = ${$.indicesGet("outputIndices",0)};
          let d1 = ${$.indicesGet("outputIndices",u)};
          let r = ${$.indicesGet("outputIndices",p)};
          let c = ${$.indicesGet("outputIndices",m)};
          let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
          let dyRCorner = dyCorner.x;
          let dyCCorner = dyCorner.y;
          let groupId = d1 / uniforms.output_channels_per_group;
          let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
          // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
          // ? = to be determined. : = across all values in that axis.
          var dotProd = ${a}(0.0);
          for (var wR: u32 = 0; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
            if (wR % uniforms.dilations.x != 0) {
              continue;
            }
            let dyR = (${a}(dyRCorner) + ${a}(wR)) / ${a}(uniforms.strides[0]);
            let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
            if (dyR < 0.0 || dyR >= ${a}(uniforms.Dy_shape[${p}]) || fract(dyR) > 0.0 ||
                wRPerm < 0) {
              continue;
            }
            let idyR: u32 = u32(dyR);

            for (var wC: u32 = 0; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
              if (wC % uniforms.dilations.y != 0) {
                continue;
              }
              let dyC = (${a}(dyCCorner) + ${a}(wC)) / ${a}(uniforms.strides.y);
              let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
              if (dyC < 0.0 || dyC >= ${a}(uniforms.Dy_shape[${m}]) ||
                  fract(dyC) > 0.0 || wCPerm < 0) {
                continue;
              }
              let idyC: u32 = u32(dyC);
              var inputChannel = groupId * uniforms.input_channels_per_group;
              for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group; d2 = d2 + 1) {
                let xValue = ${d?x.get("batch","idyR","idyC","inputChannel"):x.get("batch","inputChannel","idyR","idyC")};
                let wValue = ${b.get("inputChannel","wOutChannel","u32(wRPerm)","u32(wCPerm)")};
                dotProd = dotProd + xValue * wValue;
                inputChannel = inputChannel + 1;
              }
            }
          }
          let value = dotProd + ${n?"bias[d1]":`${a}(0.0)`};
          ${$.setByOffset("global_idx","value")};
        `;return`
  ${e.registerUniforms(l).declareVariables(..._,$)}
  ${w}

    ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
  ${i?S:I}}`},bo=(e,t,r)=>{let n=e.length>2,o=t.outputShape,i=k.size(o),a=[Math.ceil(i/64),1,1];ve("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${a}`);let l=t.format==="NHWC",d=["rank","rank"],p=[t.strides[0],t.strides[1]],m=[t.kernelShape[l?1:2],t.kernelShape[l?2:3]],u=[t.dilations[0],t.dilations[1]],h=[m[0]+(t.dilations[0]<=1?0:(t.kernelShape[l?1:2]-1)*(t.dilations[0]-1)),m[1]+(t.dilations[1]<=1?0:(t.kernelShape[l?2:3]-1)*(t.dilations[1]-1))],w=[h[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),h[1]-1-Math.floor(t.pads[1]+t.pads[3])/2],g=!1,b=t.group,x=e[1].dims,_=x[0]/b,$=x[1],S=[{type:12,data:i},{type:12,data:p},{type:12,data:m},{type:12,data:u},{type:12,data:h},{type:6,data:w},{type:12,data:_},{type:12,data:$},...V(e[0].dims,e[1].dims)];n&&(S.push(...V(e[2].dims)),d.push("rank")),S.push(...V(o));let I=a[1]===1&&a[2]===1,T=A=>{let D=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:p.length},{name:"filter_dims",type:"u32",length:m.length},{name:"dilations",type:"u32",length:m.length},{name:"effective_filter_dims",type:"u32",length:h.length},{name:"pads",type:"i32",length:w.length},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],z=ge(e[0].dataType);return`${Rm(A,e,o,n,I,g,z,D,l)}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};`,inputDependencies:d},getRunData:()=>({dispatchGroup:{x:a[0],y:a[1],z:a[2]},outputs:[{dims:r?r(o):o,dataType:e[0].dataType}],programUniforms:S}),getShaderSource:T}}});var Mm,Um,Vm,Hu,Gu,Nm,Wm,Hm,Gm,Lu,Fu=U(()=>{"use strict";Nu();Wu();lt();Et();Mm=(e,t,r,n,o,i)=>(e-1)*t+r+(n-1)*o+1-i,Um=(e,t,r,n,o)=>{let i=Math.floor(e/2);t==="SAME_UPPER"?(r[n]=i,r[o]=e-i):t==="SAME_LOWER"&&(r[n]=e-i,r[o]=i)},Vm=(e,t,r,n,o,i,a,l,d,p)=>{let m=e.length-2,u=p.length===0;if(d.length===0)for(let g=0;g<m;++g)d.push(0);let h=e[0],w=t[l?3:1]*o;for(let g=0,b=e.length-m-(l?1:0);g<m;++g,++b){let x=e[b],_=u?x*a[g]:p[g],$=Mm(x,a[g],i[g],t[b],r[g],_);Um($,n,i,g,g+m),u&&p.push(a[g]*(x-1)+d[g]+(t[b]-1)*r[g]+1-i[g]-i[g+m])}p.splice(0,0,h),p.splice(l?3:1,0,w)},Hu=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((u,h)=>u*h,1)===0){r.length=0;for(let u=2;u<t[1].dims.length;++u)r.push(t[1].dims[u])}let n=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(n?3:1,0,t[1].dims[1]);let o=e.pads.slice(),i=e.outputShape.slice(),a=e.outputPadding.slice(),l=t[0].dims,d=e.dilations.slice();if(d.reduce((u,h)=>u+h,0)===0){let u=t[0].dims.length-2;d=new Array(u).fill(1)}let p=e.strides.slice();if(p.reduce((u,h)=>u+h,0)===0){let u=t[0].dims.length-2;p=new Array(u).fill(1)}Vm(l,r,d,e.autoPad,e.group,o,p,n,a,i);let m=Object.assign({},e);return Object.assign(m,{kernelShape:r,pads:o,outputPadding:a,outputShape:i,dilations:d,strides:p}),m},Gu=e=>{let t=Xr(e),r=e.format,n=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],o=e.dilations,i=e.group,a=e.kernelShape,l=e.pads,d=e.strides,p=e.wIsConst(),m=e.outputPadding,u=e.outputShape;return{autoPad:n,format:r,dilations:o,group:i,kernelShape:a,outputPadding:m,outputShape:u,pads:l,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Nm=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],n=e[1].dims[0];if(r!==n)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let o=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==o))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.reduce((m,u)=>m+u,0)>0&&t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.reduce((m,u)=>m+u,0)>0&&t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.reduce((m,u)=>m+u,0)>0&&t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.outputPadding.length!==i&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(t.kernelShape.reduce((m,u)=>m+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Wm=[2,3,1,0],Hm=(e,t,r)=>{let n=Hu(r,t),o=r.format==="NHWC",i=n.outputShape,a=i[o?3:1],l=t[0].dims[o?3:1];if(n.group!==1||a===1&&l===1){e.compute(bo(t,n));return}let d=i[o?1:2],p=i[o?2:3],m=t[1].dims[2],u=t[1].dims[3],h=o?d*p:a,w=o?a:d*p,g=m*u*l,b=!0,x=e.kernelCustomData.wT??e.compute(Ue(t[1],Wm),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=x);let _=[t[0],x],$=t.length===3;$&&(!o&&t[2].dims.length===1?_.push(t[2].reshape([t[2].dims[0],1,1])):_.push(t[2])),e.compute(Vu(_,n,i,h,w,g,$,b),{inputs:_})},Gm=(e,t)=>{let r=t.format==="NHWC",n=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&n.push(e.inputs[2]);let o=t.kernelShape;(o.length===0||o[0]===0)&&(o=[e.inputs[1].dims[2]]);let i=t.dilations;(i.length===0||i[0]===0)&&(i=[1]);let a=t.strides;(a.length===0||a[0]===0)&&(a=[1]);let l=t.pads;l.length===0&&(l=[0,0]),l=[0,l[0],0,l[1]],a=[1].concat(a),i=[1].concat(i),o=[1].concat(o);let d=Hu({...t,pads:l,strides:a,dilations:i,kernelShape:o},n);e.compute(bo(n,d,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]]))},Lu=(e,t)=>{Nm(e.inputs,t),e.inputs[0].dims.length===3?Gm(e,t):Hm(e,e.inputs,t)}});var Lm,qu,ju,Ku=U(()=>{"use strict";Q();ae();Ce();ie();Lm=(e,t,r,n)=>{let o=k.size(t),i=t.length,a=E("input",e,i),l=M("output",e,i),d=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),p=k.normalizeAxis(d,i),m=u=>{let h=` i32(${a.indicesGet("inputIndices","uniforms.axis")}) `,w=G("uniforms.input_shape","uniforms.axis",i),g=n.reverse?h+(n.exclusive?" + 1":""):"0",b=n.reverse?w:h+(n.exclusive?"":" + 1");return`
                ${u.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(a,l)}
                ${u.mainStart()}
                  ${u.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${l.offsetToIndices("global_idx")};
                  var sum = ${l.type.value}(0);
                  let first : i32 = ${g};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${a.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${a.getByIndices("inputIndices")};
                  }
                  ${l.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:n.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},{type:12,data:p},...V(t,t)]}),getShaderSource:m}},qu=(e,t)=>{let r=e.inputs[0].dims,n=e.inputs[0].dataType,o=e.inputs[1];e.compute(Lm(n,r,o,t),{inputs:[0]})},ju=e=>{let t=e.exclusive===1,r=e.reverse===1;return te({exclusive:t,reverse:r})}});var Fm,qm,jm,Yu,Xu,Zu=U(()=>{"use strict";Q();ae();Ce();ie();Fm=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},qm=(e,t,r,n)=>{let o=[];o.push(`fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let i=0;i<t;++i)o.push(r.indicesSet("a",e[i],`i[${i}]`));return o.push("return a;}"),o.join(`
`)},jm=(e,t)=>{let r,n,o,i,a,l,d=t.format==="NHWC",p=t.blocksize,m=t.mode==="DCR";d?([r,n,o,i]=e.dims,a=m?[r,n,o,p,p,i/p**2]:[r,n,o,i/p**2,p,p],l=m?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,n,o,i]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],a=m?[r,p,p,i/p**2,n,o]:[r,i/p**2,p,p,n,o],l=m?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let u=e.reshape(a),h=u.dims.length,w=e.dataType,g=E("a",w,h),b=M("output",w,h),x=_=>`
  ${_.registerUniform("output_size","u32").declareVariables(g,b)}

  ${qm(l,h,g,b)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",g.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:_=>{let $=d?[r,n*p,o*p,i/p**2]:[r,i/p**2,n*p,o*p],S=k.size($),I=u.dims,T=k.sortBasedOnPerm(I,l);return{outputs:[{dims:$,dataType:_[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...V(I,T)]}},getShaderSource:x}},Yu=(e,t)=>{Fm(e.inputs),e.compute(jm(e.inputs[0],t))},Xu=e=>te({blocksize:e.blocksize,mode:e.mode,format:e.format})});var wo,rn,Qu,Km,Ym,vo,$o,Ju,Xm,ed,td,rd=U(()=>{"use strict";Q();ae();Ce();ie();wo="[a-zA-Z]|\\.\\.\\.",rn="("+wo+")+",Qu="^"+rn+"$",Km="("+rn+",)*"+rn,Ym="^"+Km+"$",vo=class{constructor(t=-1){this.symbolToIndices=new Map,this.inputIndex=t}addSymbol(t,r){let n=this.symbolToIndices.get(t);n===void 0?n=[r]:n.push(r),this.symbolToIndices.set(t,n)}},$o=class{constructor(t,r){this.equation=r;this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[n,o]=r.includes("->")?r.split("->",2):[r,""];if(!n.match(RegExp(Ym)))throw new Error("Invalid LHS term");if(n.split(",").forEach((l,d)=>{let p=t[d].dims.slice();if(!l.match(RegExp(Qu)))throw new Error("Invalid LHS term");let m=this.processTerm(l,!0,p,d);this.lhs.push(m)}),o==="")o+=[...this.symbolToInfo.entries()].filter(([l,d])=>d.count===1||l==="...").map(([l])=>l).join("");else if(!o.match(RegExp(rn)))throw new Error("Invalid RHS");o.match(RegExp(wo,"g"))?.forEach(l=>{if(l==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let d=this.symbolToInfo.get(l);if(d===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(d.dimValue)}}),this.rhs=this.processTerm(o,!1,this.outputDims)}addSymbol(t,r,n){let o=this.symbolToInfo.get(t);if(o!==void 0){if(o.dimValue!==r&&o.count!==1)throw new Error("Dimension mismatch");o.count++,o.inputIndices.push(n)}else o={count:1,dimValue:r,inputIndices:[n]};this.symbolToInfo.set(t,o)}processTerm(t,r,n,o=-1){let i=n.length,a=!1,l=[],d=0;if(!t.match(RegExp(Qu))&&!r&&t!=="")throw new Error("Invalid LHS term");let p=t.match(RegExp(wo,"g")),m=new vo(o);return p?.forEach((u,h)=>{if(u==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let w=i-p.length+1;if(w<0)throw new Error("Ellipsis out of bounds");if(l=n.slice(d,d+w),this.hasEllipsis){if(this.ellipsisDims.length!==l.length||this.ellipsisDims.toString()!==l.toString())throw new Error("Ellipsis dimensions mismatch")}else if(r)this.hasEllipsis=!0,this.ellipsisDims=l;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<l.length;g++){let b=String.fromCharCode("0".charCodeAt(0)+g);m.addSymbol(b,h+g),this.addSymbol(b,n[d++],o)}}else m.addSymbol(u,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(u,n[d++],o)}),m}},Ju=e=>e+"_max",Xm=(e,t,r,n)=>{let i=e.map(m=>m.length).map((m,u)=>E(`input${u}`,t,m)),a=k.size(n),l=M("output",t,n.length),d=[...r.symbolToInfo.keys()].filter(m=>!r.rhs.symbolToIndices.has(m)),p=m=>{let u=[],h="var prod = 1.0;",w="var sum = 0.0;",g="sum += prod;",b=[],x=[],_=[],$=[],S=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((T,A)=>{if(r.rhs.symbolToIndices.has(A)){let D=r.rhs.symbolToIndices.get(A)?.[0];D!==void 0&&r.lhs.forEach((z,H)=>{if(T.inputIndices.includes(H)){let W=z.symbolToIndices.get(A);if(W===void 0)throw new Error("Invalid symbol error");W.forEach(X=>{u.push(`${i[H].indicesSet(`input${H}Indices`,X,l.indicesGet("outputIndices",D))}`)})}})}else r.lhs.forEach((D,z)=>{if(T.inputIndices.includes(z)){let H=D.symbolToIndices.get(A);if(H===void 0)throw new Error("Invalid symbol error");H.forEach(W=>{b.push(`${i[z].indicesSet(`input${z}Indices`,W,`${A}`)}`)}),$.push(`prod *= ${i[z].getByIndices(`input${z}Indices`)};`)}}),x.push(`for(var ${A}: u32 = 0; ${A} < uniforms.${Ju(A)}; ${A}++) {`),_.push("}")});let I=S?[...u,`let sum = ${i.map((T,A)=>T.getByIndices(`input${A}Indices`)).join(" * ")};`]:[...u,w,...x,...b,h,...$,g,..._];return`
            ${m.registerUniforms(d.map(T=>({name:`${Ju(T)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...i,l)}

            ${m.mainStart()}
            ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${l.offsetToIndices("global_idx")};
            ${i.map((T,A)=>`var input${A}Indices: ${i[A].type.indices};`).join(`
`)}
            ${I.join(`
`)};
            ${l.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let m=d.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));m.push({type:12,data:a});let u=e.map((h,w)=>[...V(h)]).reduce((h,w)=>h.concat(w),m);return u.push(...V(n)),{outputs:[{dims:n,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:u}},getShaderSource:p}},ed=(e,t)=>{let r=new $o(e.inputs,t.equation),n=r.outputDims,o=e.inputs.map((i,a)=>i.dims);e.compute(Xm(o,e.inputs[0].dataType,r,n))},td=e=>{let t=e.equation.replace(/\s+/g,"");return te({equation:t})}});var Zm,nd,Qm,Jm,od,id=U(()=>{"use strict";Q();ae();ie();Zm=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),n=r.length<t.length?0:r.length-t.length,o=t.length<r.length?0:t.length-r.length;for(;n<r.length&&o<t.length;++n,++o)if(r[n]!==t[o]&&r[n]!==1&&t[o]!==1)throw new Error("Expand requires shape to be broadcastable to input")},nd=(e,t)=>{let r=e.length-t.length,n=[];for(let o=0;o<r;++o)n.push(e[o]);for(let o=0;o<t.length;++o)n.push(t[o]===1?e[o+r]:t[o]);return n},Qm=(e,t)=>e.length>t.length?nd(e,t):nd(t,e),Jm=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),n=Qm(t,r),o=e[0].dataType,i=o===9?4:1,a=Math.ceil(k.size(n)/i),l=p=>{let m=E("input",o,t.length,i),u=M("output",o,n.length,i),h;if(o===9){let w=(g,b,x="")=>`
          let outputIndices${b} = ${u.offsetToIndices(`outputOffset + ${b}u`)};
          let offset${b} = ${m.broadcastedIndicesToOffset(`outputIndices${b}`,u)};
          let index${b} = offset${b} / 4u;
          let component${b} = offset${b} % 4u;
          ${g}[${b}] = ${x}(${m.getByOffset(`index${b}`)}[component${b}]);
        `;h=`
        let outputOffset = global_idx * ${i};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${u.setByOffset("global_idx","data")}
      }`}else h=`
        let outputIndices = ${u.offsetToIndices("global_idx")};
        let inputOffset = ${m.broadcastedIndicesToOffset("outputIndices",u)};
        ${u.setByOffset("global_idx",m.getByOffset("inputOffset"))}
      }`;return`
    ${p.registerUniform("vec_size","u32").declareVariables(m,u)}
    ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${h}`},d=[{type:12,data:a},...V(t,n)];return{name:"Expand",shaderCache:{hint:`${n.length}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d})}},od=e=>{Zm(e.inputs),e.compute(Jm(e.inputs),{inputs:[0]})}});var ef,ad,sd=U(()=>{"use strict";Q();ae();ie();Yr();ef=e=>{let t=e[0].dataType,r=k.size(e[0].dims),n=k.size(e[1].dims),o=n%4===0,i=a=>{let l=E("x",t,[1],4),d=E("bias",t,[1],4),p=M("y",t,[1],4),m=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],u=w=>`
      let bias${w}_offset: u32 = (global_idx * 4 + ${w}) % uniforms.bias_size;
      let bias${w} = ${d.getByOffset(`bias${w}_offset / 4`)}[bias${w}_offset % 4];`,h=o?`
      let bias = ${d.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${u(0)}${u(1)}${u(2)}${u(3)}
      let bias = ${l.type.value}(bias0, bias1, bias2, bias3);`;return`${a.registerUniforms(m).declareVariables(l,d,p)}

    ${ao(Oe(t))}

    ${a.mainStart(Tt)}
      ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${l.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${p.setByOffset("global_idx",so("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${o}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:a=>({outputs:[{dims:a[0].dims,dataType:a[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:n}],dispatchGroup:{x:Math.ceil(r/Tt/4)}})}},ad=e=>{e.inputs.length<2||k.size(e.inputs[1].dims)===0?su(e):e.compute(ef(e.inputs))}});var tf,rf,ud,dd,ld=U(()=>{"use strict";Q();ae();Ce();ie();tf=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},rf=(e,t)=>{let r=e[0].dims,n=e[1].dims,o=r.length,i=k.normalizeAxis(t.axis,o),a=r.slice(0);a.splice(i,1,...n);let l=r[i],d=e[0].dataType===9?4:1,p=Math.ceil(k.size(a)/d),m=[{type:12,data:p},{type:6,data:l},{type:12,data:i},...V(e[0].dims,e[1].dims,a)],u=h=>{let w=E("data",e[0].dataType,e[0].dims.length,d),g=E("inputIndices",e[1].dataType,e[1].dims.length),b=M("output",e[0].dataType,a.length,d),x=$=>{let S=n.length,I=`var indicesIndices${$}  = ${g.type.indices}(0);`;for(let T=0;T<S;T++)I+=`${S>1?`indicesIndices${$}[${T}]`:`indicesIndices${$}`} = ${a.length>1?`outputIndices${$}[uniforms.axis + ${T}]`:`outputIndices${$}`};`;I+=`
          var idx${$} = ${g.getByIndices(`indicesIndices${$}`)};
          if (idx${$} < 0) {
            idx${$} = idx${$} + uniforms.axisDimLimit;
          }
          var dataIndices${$} : ${w.type.indices};
        `;for(let T=0,A=0;T<o;T++)T===i?(I+=`${o>1?`dataIndices${$}[${T}]`:`dataIndices${$}`} = u32(idx${$});`,A+=S):(I+=`${o>1?`dataIndices${$}[${T}]`:`dataIndices${$}`} = ${a.length>1?`outputIndices${$}[${A}]`:`outputIndices${$}`};`,A++);return I},_;if(e[0].dataType===9){let $=(S,I,T="")=>`
          let outputIndices${I} = ${b.offsetToIndices(`outputOffset + ${I}u`)};
          ${x(I)};
          let offset${I} = ${w.indicesToOffset(`dataIndices${I}`)};
          let index${I} = offset${I} / 4u;
          let component${I} = offset${I} % 4u;
          ${S}[${I}] = ${T}(${w.getByOffset(`index${I}`)}[component${I}]);
        `;_=`
        let outputOffset = global_idx * ${d};
        var value = vec4<u32>(0);
        ${$("value",0,"u32")}
        ${$("value",1,"u32")}
        ${$("value",2,"u32")}
        ${$("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else _=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${w.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(w,g,b)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${_}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:m}),getShaderSource:u}},ud=e=>te({axis:e.axis}),dd=(e,t)=>{let r=e.inputs;tf(r),e.compute(rf(e.inputs,t))}});var nf,of,cd,pd,md=U(()=>{"use strict";Q();ae();Ce();ie();nf=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},of=(e,t)=>{let r=e[0].dims,n=e[0].dataType,o=r.length,i=e[1].dims,a=e[1].dataType,l=k.normalizeAxis(t.axis,o),d=r[l],p=i.slice(0),m=k.size(p),u=E("input",n,o),h=E("indicesInput",a,i.length),w=M("output",n,p.length),g=[{type:12,data:m},{type:6,data:d},{type:12,data:l}];return g.push(...V(r,i,p)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:_=>`
      ${_.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(u,h,w)}
      ${_.mainStart()}
      ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${w.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${u.type.indices}(outputIndices);
      ${u.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${u.getByIndices("inputIndices")};

      ${w.setByOffset("global_idx","value")};
  }`}},cd=e=>te({axis:e.axis}),pd=(e,t)=>{let r=e.inputs;nf(r),e.compute(of(e.inputs,t))}});var af,sf,fd,hd,gd=U(()=>{"use strict";Q();ae();ie();af=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},sf=(e,t)=>{let r=e[0].dims.slice(),n=e[1].dims.slice(),[o,i,a]=Wr.getShapeOfGemmResult(r,t.transA,n,t.transB,e.length===3?e[2].dims:void 0),l=[o,i];if(!l)throw new Error("Can't use gemm on the given tensors");let d=k.size(l),p=[{type:12,data:d},{type:12,data:o},{type:12,data:i},{type:12,data:a},{type:1,data:t.alpha},{type:1,data:t.beta}],m=["type","type"];e.length===3&&(p.push(...V(e[2].dims)),m.push("rank")),p.push(...V(l));let u=h=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let g=t.alpha===1?"":"value *= uniforms.alpha;",b=E("a",e[0].dataType,e[0].dims),x=E("b",e[1].dataType,e[1].dims),_=b.type.value,$=null,S=[b,x];e.length===3&&($=E("c",e[2].dataType,e[2].dims.length),S.push($));let I=M("output",e[0].dataType,l.length);S.push(I);let T=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${h.registerUniforms(T).declareVariables(...S)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${_}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${g}
    ${(()=>$!=null?`let cOffset = ${$.broadcastedIndicesToOffset("vec2(m, n)",I)}; value += ${_}(uniforms.beta) * ${$.getByOffset("cOffset")};`:"")()}
    output[global_idx] = value;
  }`};return{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p}),getShaderSource:u}},fd=e=>{let t=e.transA,r=e.transB,n=e.alpha,o=e.beta;return{transA:t,transB:r,alpha:n,beta:o,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},hd=(e,t)=>{af(e.inputs),e.compute(sf(e.inputs,t))}});var Ve,lf,bd,yd,cf,nr,wd,_o=U(()=>{"use strict";Q();ae();Ce();Nr();jr();ie();Et();Ve=(e,t)=>e.length>t&&e[t].dims.length>0&&k.size(e[t].dims)>0?e[t]:void 0,lf=(e,t)=>{let r=e[0],n=Ve(e,1),o=Ve(e,2),i=Ve(e,3),a=Ve(e,4),l=Ve(e,5),d=Ve(e,6),p=Ve(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let m=!1,u=r.dims[0],h=r.dims[1],w=r.dims.length===3?m?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],g=h,b=0,x=0,_=Math.floor(w/t.numHeads);if(d&&p){if(d.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==u||d.dims[1]!==t.numHeads||d.dims[3]!==_)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==u||p.dims[1]!==t.numHeads||p.dims[3]!==_)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==p.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');b=d.dims[2],x=d.dims[2]}else if(d||p)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(n){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(n.dims.length===3){if(n.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,g=n.dims[1]}else if(n.dims.length===5){if(n.dims[2]!==t.numHeads||n.dims[3]!==2||n.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,g=n.dims[1]}else{if(n.dims[1]!==t.numHeads||n.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,g=n.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(i){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(o&&r.dims.length===5&&r.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let S=0;if(a){S=8;let z=a.dims;throw z.length===1?z[0]===u?S=1:z[0]===3*u+2&&(S=3):z.length===2&&z[0]===u&&z[1]===g&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, kv_sequence_length)'):new Error("Mask not supported")}let I=!1,T=w;if(o){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(g!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=o.dims[2]}else{if(g!==o.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');T=o.dims[1]*o.dims[3],I=!0}}let A=b+g,D=!1;if(a)throw new Error("Key padding mask is not supported");if(l){if(l.dims.length!==4)throw new Error('Input "relative_position_bias" is expected to have 4 dimensions');if(l.dims[0]!==u&&l.dims[0]!==1||l.dims[1]!==t.numHeads||l.dims[2]!==h||l.dims[3]!==A)throw new Error('Input "relative_position_bias" shape (batch_size, 1, sequence_length, kv_sequence_length)')}return{batchSize:u,sequenceLength:h,pastSequenceLength:b,kvSequenceLength:g,totalSequenceLength:A,maxSequenceLength:x,inputHiddenSize:0,hiddenSize:w,vHiddenSize:T,headSize:_,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:D,passPastInKv:I,qkvFormat:$}},bd=e=>te({...e}),yd=te({perm:[0,2,1,3]}),cf=(e,t,r,n,o,i,a)=>{let l=[n,o,i],d=k.size(l),p=[{type:12,data:d},{type:12,data:a},{type:12,data:i}],m=u=>{let h=M("qkv_with_bias",t.dataType,l),w=E("qkv",t.dataType,l),g=E("bias",r.dataType,l),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${u.registerUniforms(b).declareVariables(w,g,h)}
  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p}),getShaderSource:m},{inputs:[t,r],outputs:[-1]})[0]},nr=(e,t,r,n,o,i,a,l)=>{let d=i;if(a){if(n===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return d=cf(e,i,a,t,n,r*o,l),d=d.reshape([t,n,r,o]),e.compute(Ue(d,yd.perm),{inputs:[d],outputs:[-1]})[0]}else return i.dims.length===3&&(d=i.reshape([t,n,r,o])),e.compute(Ue(d,yd.perm),{inputs:[d],outputs:[-1]})[0]},wd=(e,t)=>{let r=lf(e.inputs,t),n=e.inputs[0],o=Ve(e.inputs,1),i=Ve(e.inputs,2),a=Ve(e.inputs,3),l=Ve(e.inputs,4),d=Ve(e.inputs,5),p=Ve(e.inputs,6),m=Ve(e.inputs,7);if(n.dims.length===5)throw new Error("Packed QKV is not implemented");if(o?.dims.length===5)throw new Error("Packed KV is not implemented");let u=o&&i&&o.dims.length===4&&i.dims.length===4,h=nr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,n,a,0);if(u)return Wt(e,h,o,i,l,void 0,p,m,d,r,t);if(!o||!i)throw new Error("key and value must be provided");let w=nr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,o,a,r.hiddenSize),g=nr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,i,a,2*r.hiddenSize);Wt(e,h,w,g,l,void 0,p,m,d,r,t)}});var vd,pf,mf,xo,$d,So=U(()=>{"use strict";Q();ae();ie();vd=e=>Array.from(e.getBigInt64Array(),Number),pf=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(vd(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},mf=(e,t)=>{let r=[];for(let n=0;n<e.length;++n)r.push(e[n]*t[n]);return r},xo=(e,t)=>{let r=e[0].dims,n=t??vd(e[1]),o=mf(r,n),i=k.size(o),a=e[0].dataType,l=E("input",a,r.length),d=M("output",a,o.length),p=m=>`
      const inputShape = ${l.indices(...r)};
      ${m.registerUniform("output_size","u32").declareVariables(l,d)}
      ${m.mainStart()}
      ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${d.offsetToIndices("global_idx")};
      var input_indices: ${l.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${l.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${d.indicesGet("output_indices","i")}  % input_dim_i;

        ${l.indicesSet("input_indices","i","input_dim_value")}
      }
      ${d.setByOffset("global_idx",l.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${n}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...V(e[0].dims,o)]}),getShaderSource:p}},$d=e=>{pf(e.inputs),e.compute(xo(e.inputs),{inputs:[0]})}});var ff,_d,Sd,hf,xd,Id,Cd=U(()=>{"use strict";Q();ae();Ce();jr();ie();_o();So();Et();ff=(e,t)=>{let r=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let l=!1,d=r.dims[0],p=r.dims[1],m=r.dims.length===3?l?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],u=p,h=0,w=0,g=Math.floor(m/t.numHeads),b=i&&i.dims.length!==0,x=a&&a.dims.length!==0,_=!0;if(b&&x){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(a.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');_?(h=i.dims[1],w=i.dims[1]):(h=i.dims[2],w=i.dims[2])}else if(b||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(n){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(n.dims.length===3){if(r.dims[2]%n.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');$=2,u=n.dims[1]}else if(n.dims.length===5){if(n.dims[2]!==t.numHeads||n.dims[3]!==2||n.dims[4]!==g)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,u=n.dims[1]}else{if(n.dims[1]!==t.numHeads||n.dims[3]!==g)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,u=n.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let S=0,I=!1,T=m;if(o){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(u!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=o.dims[2]}else{if(u!==o.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');T=o.dims[1]*o.dims[3],I=!0}}let A=h+u,D=!1;return{batchSize:d,sequenceLength:p,pastSequenceLength:h,kvSequenceLength:u,totalSequenceLength:A,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:m,vHiddenSize:T,headSize:g,vHeadSize:Math.floor(T/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:S,scale:t.scale,broadcastResPosBias:D,passPastInKv:I,qkvFormat:$,isPastkvBSNH:_}},_d=(e,t,r,n)=>{let o=[n.batchSize,n.totalSequenceLength,n.kvNumHeads,n.headSize],i=4,a=k.size(o)/i,l=n.totalSequenceLength,d=M("present_kv",r,o.length,i),p=E("new_kv",e.dataType,e.dims.length,i),m=t?E("past_kv",t.dataType,t.dims.length,i):void 0,u=Math.ceil(n.headSize/i),h={x:l,y:e.dims[0],z:1},w=t?["rank","rank"]:["rank"],g=[{type:12,data:a},{type:12,data:n.pastSequenceLength},{type:12,data:n.kvSequenceLength},{type:12,data:n.totalSequenceLength}],b=[p];m?(g.push(...V(e.dims),...V(t.dims),...V(o)),b.push(m)):g.push(...V(e.dims),...V(o));let x=[{name:"output_size",type:"u32"},{name:"past_seqlen",type:"u32"},{name:"new_seqlen",type:"u32"},{name:"present_seqlen",type:"u32"}],_=`      let past_batch_stride = uniforms.past_seqlen * num_heads * H;
        var past_head_stride = uniforms.past_seqlen * H;
        if (is_bsnh) {
          past_head_stride = H;
        }
        let in_offset = b * past_batch_stride + s * row_stride + n * past_head_stride + h;
        present_kv[out_offset] = past_kv[in_offset];`,$=`      let new_batch_stride = uniforms.new_seqlen * num_heads * H;
        let new_row_stride = num_heads * H;
        let new_head_stride = H;
        let in_offset = b * new_batch_stride + (s - past_seqlen) * new_row_stride + n * new_head_stride + h;
        present_kv[out_offset] = new_kv[in_offset];`,S=t?`if (s < past_seqlen) {
        ${_}
        } else if (s < past_seqlen + uniforms.new_seqlen) {
        ${$}
        }`:`if (s < past_seqlen + uniforms.new_seqlen) {
          ${$}
        }`,I=T=>`

  ${T.registerUniforms(x).declareVariables(...b,d)}
  ${T.mainStart([u,n.kvNumHeads,1])}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    var indices = ${d.offsetToIndices("global_idx")};
    let h = local_id.x;
    let n = local_id.y;
    let s = workgroup_id.x;
    let b = workgroup_id.y;
    let num_heads = ${n.kvNumHeads}u;
    let H = ${u}u;

    let present_seqlen = uniforms.present_seqlen;
    let present_batch_stride = present_seqlen * num_heads * H;
    var row_stride = H;
    let is_bsnh = ${n.isPastkvBSNH};

    if (is_bsnh) {
      row_stride = num_heads * H;
    }
    var present_head_stride = present_seqlen * H;
    if (is_bsnh) {
      present_head_stride = H;
    }

    let past_seqlen = uniforms.past_seqlen;

    let out_offset = b * present_batch_stride + s * row_stride + n * present_head_stride + h;
    ${S}
  }`;return{name:"ConcatPastNew",shaderCache:{hint:`${n.kvNumHeads}${u}${!!t}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:o,dataType:r}],dispatchGroup:h,programUniforms:g}),getShaderSource:I}},Sd=e=>te({...e}),hf=te({perm:[0,2,1,3]}),xd=(e,t,r,n,o)=>{let i=t,a=n.kvNumHeads,l=n.nReps;return t.dims.length===3&&n.kvSequenceLength!==0&&(i=t.reshape([n.batchSize,n.kvSequenceLength,a,n.headSize])),r?i=e.compute(_d(i,r,i.dataType,n),{inputs:[i,r],outputs:[n.isPastkvBSNH?o:-1]})[0]:i=e.compute(_d(i,void 0,i.dataType,n),{inputs:[i],outputs:[n.isPastkvBSNH?o:-1]})[0],l!==1&&(i=e.compute(xo([i],[1,1,1,l]),{inputs:[i],outputs:[-1]})[0],i=i.reshape([n.batchSize,n.totalSequenceLength,a*l,n.headSize])),e.compute(Ue(i,hf.perm),{inputs:[i],outputs:[-1]})[0]},Id=(e,t)=>{let r=ff(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let n=nr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,e.inputs[0],void 0,0),o=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,i=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,a=xd(e,e.inputs[1],o,r,1),l=xd(e,e.inputs[2],i,r,2);Wt(e,n,a,l,void 0,void 0,void 0,void 0,void 0,r,t)}});var gf,yf,bf,Td,Ad=U(()=>{"use strict";Q();ae();ie();gf=(e,t)=>{let r=e[0].dims,n=r,o=2,i=k.sizeToDimension(r,o),a=k.sizeFromDimension(r,o),l=$e(a),d=a/l,p=[r[0],r[1],d],m=["rank","type","type"],u=[{type:12,data:a},{type:12,data:d}];u.push(...V(p,p));let h=w=>{let g=E("x",e[0].dataType,p.length,l),b=E("scale",e[1].dataType,e[1].dims),x=E("bias",e[2].dataType,e[2].dims),_=M("output",e[0].dataType,p.length,l),$=[g,b,x,_],S=g.type.value,I=l===1?"f32":`vec${l}<f32>`,T=64,A=[{name:"normSize",type:"u32"},{name:"normPackedSize",type:"u32"}];return`
  var<workgroup> meanShared : f32;
  var<workgroup> squaredNormShared : f32;
  var<workgroup> workgroupShared : array<${I}, ${T}>;
  const workgroupSize = ${T}u;
  ${w.registerUniforms(A).declareVariables(...$)}
  ${w.mainStart(T)}
    let norm = global_idx / workgroupSize;
    let batch = norm / uniforms.x_shape[1];
    let channel = norm % uniforms.x_shape[1];
    let localIndex = local_id.x;

    // initialize workgroup memory
    var initial = ${I}(0);
    for (var h = localIndex; h < uniforms.normPackedSize; h += workgroupSize) {
      initial = initial + ${I}(${g.get("batch","channel","h")});
    }
    workgroupShared[localIndex] = initial;
    workgroupBarrier();

    // Calculate the mean of current channel data.
    for (var currSize = workgroupSize >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (localIndex < currSize) {
        workgroupShared[localIndex] = workgroupShared[localIndex] + workgroupShared[localIndex + currSize];
      }
      workgroupBarrier();
    }
    if (localIndex == 0) {
      meanShared = ${Xe("workgroupShared[0]",l)} / f32(uniforms.normSize);
    }
    workgroupBarrier();

    // reinitialize workgroup memory.
    initial = ${I}(0);
    for (var h = localIndex; h < uniforms.normPackedSize; h += workgroupSize) {
      let deviation =  ${I}(${g.get("batch","channel","h")}) - ${I}(meanShared);
      initial = initial + deviation * deviation;
    }
    workgroupShared[localIndex] = initial;
    workgroupBarrier();

    // Calculate the sum of square of deviation of current channel data.
    for (var currSize = workgroupSize >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (localIndex < currSize) {
        workgroupShared[localIndex] = workgroupShared[localIndex] + workgroupShared[localIndex + currSize];
      }
      workgroupBarrier();
    }
    if (localIndex == 0) {
      squaredNormShared = ${Xe("workgroupShared[0]",l)};
    }
    workgroupBarrier();

    let invStdDev = inverseSqrt(squaredNormShared / f32(uniforms.normSize) + f32(${t.epsilon}));
    let channelScale = invStdDev * f32(${b.getByOffset("channel")});
    let channelShift = f32(${x.getByOffset("channel")}) - meanShared * channelScale;
    for (var h = localIndex; h < uniforms.normPackedSize; h += workgroupSize) {
      let value = ${g.get("batch","channel","h")} * ${S}(${I}(channelScale)) + ${S}(${I}(channelShift));
      ${_.set("batch","channel","h","value")};
    }
  }`};return{name:"InstanceNormalization",shaderCache:{hint:`${t.epsilon};${l}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:i},programUniforms:u}),getShaderSource:h}},yf=(e,t,r,n,o,i,a,l)=>{let d=$e(a),p=64,m=d===1?"vec2f":`mat2x${d}f`,u=d===1?"f32":`vec${d}f`,h=(A,D)=>`${m}(${A}, ${D})`,w=o*a/d,g=Math.ceil(i/p),b=["type"],x=[{type:12,data:g},{type:12,data:i},{type:12,data:Math.floor(a/d)},{type:12,data:Math.floor(i*a/d)}],_=A=>{let D=E("input",t.dataType,t.dims,d);return`
  ${A.declareVariables(D)}
  @group(0) @binding(1) var<storage, read_write> output : array<${m}>;
  struct Uniforms {wg_size:u32, H:u32, C:u32, image_size:u32};
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  ${A.mainStart(p)}
    let currentImageNumber = global_idx / ${p} / uniforms.C;
    let currentChannelNumber = (global_idx / ${p}) % uniforms.C;
    let wgOffset = local_id.x * uniforms.wg_size;
    if (wgOffset >= uniforms.H) {
        return;
    }
    let wgMax = min(wgOffset + uniforms.wg_size, uniforms.H);

    let offset = currentImageNumber * uniforms.image_size + currentChannelNumber;
    var sum = ${gt("f32",d)};
    var squaredSum = ${gt("f32",d)};
    for (var i: u32 = wgOffset; i < wgMax; i++) {
        let value = ${u}(input[offset + i * uniforms.C]);
        sum += value;
        squaredSum += value * value;
    }
    output[global_idx] = ${h("sum","squaredSum")};
  }`},$=e.compute({name:"InstanceNormComputeMean",shaderCache:{hint:`${d}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:[o,a,p,2],dataType:1}],dispatchGroup:{x:o*a/d},programUniforms:x}),getShaderSource:_},{inputs:[t],outputs:[-1]})[0],S=[{type:12,data:w},{type:12,data:i},{type:12,data:Math.floor(a/d)},{type:12,data:Math.floor(p*a/d)}],I=["type","type","type"],T=A=>{let D=E("scale",r.dataType,r.dims,d),z=E("bias",n.dataType,n.dims,d);return`
  @group(0) @binding(0) var<storage, read> input : array<${m}>;
  @group(0) @binding(1) var<storage, read> scale : array<${D.type.storage}>;
  @group(0) @binding(2) var<storage, read> bias : array<${z.type.storage}>;
  @group(0) @binding(3) var<storage, read_write> output : array<${m}>;
  struct Uniforms {units_of_work : u32, H: u32, C : u32, image_size : u32};
  @group(0) @binding(4) var<uniform> uniforms: Uniforms;

  ${A.mainStart()}
    ${A.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.units_of_work")}
    let currentImageNumber = global_idx / uniforms.C;
    let currentChannelNumber = global_idx % uniforms.C;

    let offset = currentImageNumber * uniforms.image_size;
    var sum = ${gt("f32",d)};
    var squaredSum = ${gt("f32",d)};
    for (var i: u32 = 0; i < min(${p}, uniforms.H); i++) {
        let value = input[offset + i + currentChannelNumber * ${p}];
        sum += value[0];
        squaredSum += value[1];
    }
    sum = sum / f32(uniforms.H);
    squaredSum = squaredSum / f32(uniforms.H);
    let invStdDev = inverseSqrt(squaredSum - sum * sum + f32(${l}));
    let channelScale = invStdDev * ${u}(scale[currentChannelNumber]);
    let channelShift = ${u}(bias[currentChannelNumber]) - sum * channelScale;

    output[global_idx] = ${h("channelScale","channelShift")};
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${d};${l}`,inputDependencies:I},getRunData:()=>({outputs:[{dims:[o,a,2],dataType:1}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:S}),getShaderSource:T},{inputs:[$,r,n],outputs:[-1]})[0]},bf=(e,t,r)=>{let n=t[0].dims,o=n,i=n[0],a=n[n.length-1],l=k.sizeFromDimension(n,1)/a,d=$e(a),p=k.size(o)/d,m=[{type:12,data:l},{type:12,data:Math.floor(a/d)}],u=["type","type"],h=yf(e,t[0],t[1],t[2],i,l,a,r.epsilon),w=g=>{let b=ge(t[0].dataType),x=d===1?"vec2f":`mat2x${d}f`,_=d===1?b:`vec${d}<${b}>`,$=E("input",t[0].dataType,t[0].dims,d),S=M("output",t[0].dataType,o,d);return`
  @group(0) @binding(0) var<storage, read> input : array<${$.type.storage}>;
  @group(0) @binding(1) var<storage, read> scaleInput : array<${x}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${S.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${g.mainStart()}
    let currentImageNumber = global_idx / (uniforms.C * uniforms.H);
    let currentChannelNumber = global_idx % uniforms.C;

    let scaleOffset = currentImageNumber * uniforms.C + currentChannelNumber;
    let scale = scaleInput[scaleOffset];
    output[global_idx] = fma(input[global_idx], ${_}(scale[0]), ${_}(scale[1]));
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${d}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:o,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:m}),getShaderSource:w},{inputs:[t[0],h]})},Td=(e,t)=>{t.format==="NHWC"?bf(e,e.inputs,t):e.compute(gf(e.inputs,t))}});var wf,vf,Ed,kd=U(()=>{"use strict";Q();ae();ie();wf=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},vf=(e,t,r)=>{let n=t.simplified,o=e[0].dims,i=e[1],a=!n&&e[2],l=o,d=k.normalizeAxis(t.axis,o.length),p=k.sizeToDimension(o,d),m=k.sizeFromDimension(o,d),u=k.size(i.dims),h=a?k.size(a.dims):0;if(u!==m||a&&h!==m)throw new Error(`Size of X.shape()[axis:] == ${m}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${u} and bias size of ${h}`);let w=[];for(let T=0;T<o.length;++T)T<d?w.push(o[T]):w.push(1);let g=$e(m),b=["type","type"],x=[{type:12,data:p},{type:1,data:m},{type:12,data:Math.floor(m/g)},{type:1,data:t.epsilon}];a&&b.push("type");let _=r>1,$=r>2,S=T=>{let A=ge(e[0].dataType),D=[E("x",e[0].dataType,e[0].dims,g),E("scale",i.dataType,i.dims,g)];a&&D.push(E("bias",a.dataType,a.dims,g)),D.push(M("output",e[0].dataType,l,g)),_&&D.push(M("mean_data_output",1,w)),$&&D.push(M("inv_std_output",1,w));let z=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms(z).declareVariables(...D)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${gt("f32",g)};
    var mean_square_vector = ${gt("f32",g)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${At(A,g,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Xe("mean_vector",g)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Xe("mean_square_vector",g)} / uniforms.norm_size ${n?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${At(A,g,"x[j + offset]")};
      let f32scale = ${At(A,g,"scale[j]")};
      output[j + offset] = ${D[0].type.value}((f32input ${n?"":"- mean"}) * inv_std_dev * f32scale
        ${a?`+ ${At(A,g,"bias[j]")}`:""}
      );
    }

    ${_?"mean_data_output[global_idx] = mean":""};
    ${$?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},I=[{dims:l,dataType:e[0].dataType}];return _&&I.push({dims:w,dataType:1}),$&&I.push({dims:w,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${g};${r};${n}`,inputDependencies:b},getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(p/64)},programUniforms:x}),getShaderSource:S}},Ed=(e,t)=>{wf(e.inputs),e.compute(vf(e.inputs,t,e.outputCount))}});var $f,_f,Pd,Od,Dd=U(()=>{"use strict";Q();ae();Ce();ie();$f=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],n=r.dims.length;if(r.dims[n-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let o=Math.floor((t.k+t.blockSize-1)/t.blockSize),i=t.blockSize/8*t.bits,a=e[1];if(!k.areEqual(a.dims,[t.n,o,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let d=e[2].dims;if(k.size(d)!==t.n*o)throw new Error("scales input size error.");if(e.length===4){let m=e[3].dims,u=t.bits>4?t.n*o:t.n*Math.floor((o+1)/2);if(k.size(m)!==u)throw new Error("zeroPoints input size error.")}},_f=(e,t,r,n)=>{let o=e[0].dims,i=o.length,a=Math.floor((t.k+t.blockSize-1)/t.blockSize),l=o[i-2],d=t.k,p=t.n,m=o.slice(0,i-2),u=k.size(m),w=t.blockSize/8*t.bits/4,g=e[0].dataType,b=$e(l),x=$e(t.k),_=$e(w),$=It(g),S=l*a*$,I=Math.floor(n/S),T=a<=r[0]&&I>0,A=!T||I>=4?$e(p):I>=2&&$e(p)>=2?2:1,D=m.concat([l,p]),z=k.size(D)/A/b,H=T?[]:[{type:12,data:z},{type:12,data:t.blockSize}],W=[u,l,d/x],X=k.convertShape(e[1].dims).slice();X.splice(-1,1,w/_),H.push(...V(W)),H.push(...V(X)),H.push(...V(e[2].dims)),e.length===4&&H.push(...V(k.convertShape(e[3].dims)));let Y=[u,l,p/A];H.push(...V(Y));let pe=ue=>{let le=W.length,K=E("a",e[0].dataType,le,x),de=E("b",12,X.length,_),re=E("scales",e[2].dataType,e[2].dims.length),se=[K,de,re],Z=e.length===4?E("zero_points",12,e[3].dims.length):void 0;Z&&se.push(Z);let ne=Y.length,J=M("output",e[0].dataType,ne,A),ke=[{name:"output_size",type:"u32"},{name:"block_size",type:"u32"}],R=ge(e[0].dataType),F=(()=>{switch(x){case 1:return`array<${R}, 8>`;case 2:return`mat4x2<${R}>`;case 4:return`mat2x4<${R}>`;default:throw new Error(`${x}-component is not supported.`)}})(),ce=`
        for (var word: u32 = 0; word < ${w}; word += ${_}) {
          ${de.indicesSet("b_indices","2","word")};
          let b_data = ${de.getByIndices("b_indices")};
          for (var i: u32 = 0; i < ${_}; i++) {
            let b_value: u32 = ${_===1?"b_data":"b_data[word + i]"};
            let b_mask: u32 = 0x0F0F0F0Fu;
            let b_value_lower: vec4<u32> = unpack4xU8(b_value & b_mask);
            let b_value_upper: vec4<u32> = unpack4xU8((b_value >> 4) & b_mask);
            let b_quantized_values = ${F}(${Array.from({length:4},(Se,we)=>`${R}(b_value_lower[${we}]), ${R}(b_value_upper[${we}])`).join(", ")});
            let b_dequantized_values = ${(()=>x===1?`${F}(${Array.from({length:8},(Se,we)=>`(b_quantized_values[${we}] - zero_point) * scale`).join(", ")});`:`(b_quantized_values - ${F}(${Array(8).fill("zero_point").join(",")})) * scale;`)()};
            // Number of B elements per 32-bit word is 32/bits = 32/4 = 8
            for (var m: u32 = 0; m < ${T?l:b}u; m++) {
              ${K.indicesSet("a_indices",le-2,T?"m":`row * ${b} + m`)};
              ${K.indicesSet("a_indices",le-1,"word_offset")};
              var input_offset = ${K.indicesToOffset("a_indices")};
              var a_data: ${F};
              for (var j: u32 = 0; j < ${8/x}; j++) {
                a_data[j] = ${K.getByOffset("input_offset")};
                input_offset++;
              }
              ${T?"workgroup_shared[workgroup_shared_offset + m]":"output_values[m]"}${A>1?"[c]":""} += ${Array.from({length:8/x},(Se,we)=>`${x===1?`a_data[${we}] * b_dequantized_values[${we}]`:`dot(a_data[${we}], b_dequantized_values[${we}])`}`).join(" + ")};
            }
            word_offset += ${8/x};
          }
        }`,Re=Z?`
          zero_point_offset += 4;
          if (zero_point_offset == 32) {
            zero_point_offset = 0;
            zero_point_index++;
            zero_point_word = ${Z.getByOffset("zero_point_index")};
          }`:"";return T?`
        var<workgroup> workgroup_shared: array<${J.type.value}, ${l*a}>;
        ${ue.declareVariables(...se,J)}
        ${ue.mainStart([a,1,1])}
          var a_indices: ${K.type.indices};
          var block = local_id.x;
          var col = workgroup_id.y;
          var batch = workgroup_id.z;
          ${K.indicesSet("a_indices","0","batch")};
          // Two zero points are packed into one byte when uniforms.bits is 4.
          for (var c: u32 = 0; c < ${A}; c++) {
            let col_times_components_plus_c = col * ${A} + c;
              ${Z?`
            var zero_point_bytes_per_col: u32 = (${a} + 1) / 2;
            var zero_point_byte_count: u32 = col_times_components_plus_c * zero_point_bytes_per_col + (block >> 0x1u);
            var zero_point_word_index: u32 = zero_point_byte_count >> 0x2u;
            var zero_point_byte_offset: u32 = zero_point_byte_count & 0x3u;
            var zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32 = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            var zero_point_word: u32 = ${Z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;`:""}
            var b_indices: ${de.type.indices};
            ${de.indicesSet("b_indices","0","col_times_components_plus_c")};
            // The scale and zero points are computed per block.
            var scales_index = col_times_components_plus_c * ${a} + block;
            let scale = ${re.getByOffset("scales_index")};
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${R}(${Z?"(zero_point_word) & 0xFu":8});
            ${de.indicesSet("b_indices","1","block")};
            var word_offset: u32 = block * ${t.blockSize/x};
            var workgroup_shared_offset: u32 = block * ${l};
            ${ce}
          }
          workgroupBarrier();
          var output_indices: ${J.type.indices};
          var elements_per_thread: u32 = ${Math.ceil(l/a)};
          ${J.indicesSet("output_indices","0","batch")};
          ${J.indicesSet("output_indices",ne-1,"col")};
          ${J.indicesSet("output_indices",ne-2,"local_id.x * elements_per_thread")};
          var output_offset = ${J.indicesToOffset("output_indices")};
          for (var m: u32 = 0u; m < elements_per_thread; m++) {
            var row = m + local_id.x * elements_per_thread;
            if (row < ${l}) {
              var output_value: ${J.type.value} = ${J.type.value}(0);
              var workgroup_shared_offset: u32 = row;
              for (var b: u32 = 0u; b < ${a}u; b++) {
                output_value += workgroup_shared[workgroup_shared_offset];
                workgroup_shared_offset += ${l};
              }
              ${J.setByOffset("output_offset","output_value")};
              output_offset += ${p/A};
            }
          }
        }`:`
        ${ue.registerUniforms(ke).declareVariables(...se,J)}
        ${ue.mainStart()}
          ${ue.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var output_values: array<${J.type.value}, ${b}>;
          var output_indices = ${J.offsetToIndices("global_idx")};
          var col = ${J.indicesGet("output_indices",ne-1)};
          var row = ${J.indicesGet("output_indices",ne-2)};
          var a_indices: ${K.type.indices} = output_indices;
          // Two zero points are packed into one byte because uniforms.bits <= 4.
          // zero_point_offset is either 0 or 4. It is bit offset within one byte.
          // TODO support zero_point_offset for bits > 4
          ${Z?`
          var zero_point_abs_offset = col * ${A} * ((${a} + 1) / 2);
          var zero_point_index: u32 = zero_point_abs_offset / 4;
          var zero_point_word: u32 = ${Z.getByOffset("zero_point_index")};
          var zero_point_offset: u32 = (zero_point_abs_offset % 4) * 8;`:""}
          var scale_index = col * ${a*A};
          var b_indices: ${de.type.indices};
          for (var c: u32 = 0; c < ${A}; c++) {
            ${de.indicesSet("b_indices","0",`col * ${A} + c`)};
            var block_offset: u32 = 0;
            for (var block: u32 = 0; block < ${a}; block++) {
              // The scale and zero points are computed per block.
              let scale = ${re.getByOffset("scale_index")};
              // The default zero point is 8 for unsigned 4-bit quantization.
              let zero_point = ${R}(${Z?"extractBits(zero_point_word, zero_point_offset, 4)":8});
              ${de.indicesSet("b_indices","1","block")};
              var word_offset: u32 = block_offset;
              ${ce}
              scale_index++;
              ${Re}
              block_offset += uniforms.block_size / ${x};
            }
            // Drop the trailing 4 bits if the zero_poit_offset is not a byte boundary to align with the next byte.
            ${Z?`if (zero_point_offset % 8 > 0) {
                ${Re}
              }`:""}
            }
            for (var k: u32 = 0u; k < ${b}u; k++) {
              ${J.indicesSet("output_indices",ne-2,`${b} * row + k`)};
              ${J.setByIndices("output_indices","output_values[k]")}
            }
        }`};return{name:T?"BlockwiseMatMulNBits":"MatMulNBits",shaderCache:{hint:`${t.cacheKey};${l};${g};${e.length}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:D,dataType:g}],name:T?"BlockwiseMatMulNBits":"MatMulNBits",dispatchGroup:T?{x:1,y:Math.ceil(p/A),z:u}:{x:Math.ceil(z/64)},programUniforms:H}),getShaderSource:pe}},Pd=(e,t)=>{$f(e.inputs,t);let r=e.getMaxComputeWorkgroupSizes(),n=e.getMaxComputeWorkgroupStoragesize();e.compute(_f(e.inputs,t,r,n))},Od=e=>te(e)});var xf,Sf,If,Cf,Tf,Af,Ef,kf,zd,Bd=U(()=>{"use strict";Q();ae();ie();xf=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Sf=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
            k = i32(${e.indicesGet("indices",o)}) - ${G("uniforms.pads",o,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${G("uniforms.x_shape",o,t)})) {
              break;
            }
            offset += k * i32(${G("uniforms.x_strides",o,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${n}
            value = x[offset];
          }
      `},If=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${G("uniforms.pads",o,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${G("uniforms.x_shape",o,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${G("uniforms.x_shape",o,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${G("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},Cf=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${G("uniforms.pads",o,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${G("uniforms.x_shape",o,t)})) {
                  k = i32(${G("uniforms.x_shape",o,t)}) - 1;
                }
                offset += k * i32(${G("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},Tf=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${G("uniforms.pads",o,r)};
                if (k < 0)  {
                  k += i32(${G("uniforms.x_shape",o,t)}]);
                }
                if (k >= i32(${G("uniforms.x_shape",o,t)})) {
                  k -= i32(${G("uniforms.x_shape",o,t)});
                }
                offset += k * i32(${G("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},Af=(e,t,r)=>{switch(r.mode){case 0:return Sf(e,t,r.pads.length);case 1:return If(e,t,r.pads.length);case 2:return Cf(e,t,r.pads.length);case 3:return Tf(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Ef=(e,t)=>{let r=k.padShape(e[0].dims.slice(),t.pads),n=e[0].dims,o=k.size(r),i=[{type:12,data:o},{type:6,data:t.pads}];t.mode===0&&i.push({type:e[0].dataType,data:t.value}),i.push(...V(e[0].dims,r));let a=["rank"],l=d=>{let p=M("output",e[0].dataType,r.length),m=E("x",e[0].dataType,n.length),u=m.type.value,h=Af(p,n.length,t),w=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&w.push({name:"constant_value",type:u}),`
            ${d.registerUniforms(w).declareVariables(m,p)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${p.offsetToIndices("global_idx")};

            var value = ${u}(0);
            ${h}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(k.size(r)/64)},programUniforms:i}),getShaderSource:l}},kf=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),n=e.length>=3&&e[2].data?e[2].getFloat32Array()[0]:0,o=e[0].dims.length,i=new Int32Array(2*o).fill(0);if(e.length>=4){let l=e[3].getBigInt64Array();for(let d=0;d<l.length;d++)i[Number(l[d])]=Number(r[d]),i[Number(l[d])+o]=Number(r[d+l.length])}else r.forEach((l,d)=>i[Number(d)]=Number(l));let a=[];return i.forEach(l=>a.push(l)),{mode:t.mode,value:n,pads:a}}else return t},zd=(e,t)=>{xf(e.inputs);let r=kf(e.inputs,t);e.compute(Ef(e.inputs,r),{inputs:[0]})}});var nn,Rd,Md,Ud,Vd,Pf,Of,Nd,Wd,Hd,Gd,Ld,Fd,qd,jd,Kd,Yd,Xd,Zd,Qd=U(()=>{"use strict";Ke();Q();ae();ie();nn=e=>{if(be.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Rd=(e,t,r)=>{let n=t.format==="NHWC",o=e.dims.slice();n&&o.splice(1,0,o.pop());let i=Object.hasOwnProperty.call(t,"dilations"),a=t.kernelShape.slice(),l=t.strides.slice(),d=i?t.dilations.slice():[],p=t.pads.slice();Ct.adjustPoolAttributes(r,o,a,l,d,p);let m=Ct.computePoolOutputShape(r,o,l,d,a,p,t.autoPad),u=Object.assign({},t);i?Object.assign(u,{kernelShape:a,strides:l,pads:p,dilations:d,cacheKey:t.cacheKey}):Object.assign(u,{kernelShape:a,strides:l,pads:p,cacheKey:t.cacheKey});let h=m.slice();return h.push(h.splice(1,1)[0]),[u,n?h:m]},Md=(e,t)=>{let r=t.format==="NHWC",n=k.size(e),o=k.size(t.kernelShape),i=[{type:12,data:n},{type:12,data:o}],a=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let l=t.kernelShape[t.kernelShape.length-1],d=t.strides[t.strides.length-1],p=t.pads[t.pads.length/2-1],m=t.pads[t.pads.length-1],u=!!(p+m);i.push({type:12,data:l},{type:12,data:d},{type:12,data:p},{type:12,data:m}),a.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let w=t.kernelShape[t.kernelShape.length-2],g=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];h=!!(b+x),i.push({type:12,data:w},{type:12,data:g},{type:12,data:b},{type:12,data:x}),a.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,a,!0,u,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let l=k.computeStrides(t.kernelShape);i.push({type:12,data:l},{type:12,data:t.pads},{type:12,data:t.strides}),a.push({name:"kernelStrides",type:"u32",length:l.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let d=t.pads.reduce((p,m)=>p+m);return[i,a,!!d,!1,!1]}},Ud=(e,t,r,n,o,i,a,l,d,p,m,u)=>{let h=o.format==="NHWC",w=t.type.value,g=M("output",t.type.tensor,n);if(o.kernelShape.length<=2){let b="",x="",_="",$=r-(h?2:1);if(m?b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${$}] < 0 || xIndices[${$}]
                      >= uniforms.x_shape[${$}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`:b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`,o.kernelShape.length===2){let I=r-(h?3:2);u?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${I}] < 0 || xIndices[${I}] >= uniforms.x_shape[${I}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                `,_=`
              }
            `}return`
            ${e.registerUniforms(d).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var value = ${w}(${l});
              var pad = 0;
              ${x}
              ${b}
              ${_}
              ${a}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=o.kernelShape.length,x=o.pads.length,_="";return p?_=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${i}
              }`:_=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${e.registerUniforms(d).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${w}(${l});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${G("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${G("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${r-b}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${G("uniforms.strides",`j - ${r-b}u`,b)}
                    + offsets[j - ${r-b}u] - ${G("uniforms.pads","j - 2u",x)};
                  ${_}
              }
              ${a}

              output[global_idx] = value;
            }`}},Vd=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Pf=e=>`${Vd(e)};${e.countIncludePad}`,Of=e=>`${Vd(e)};${e.storageOrder};${e.dilations}`,Nd=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Wd=(e,t,r,n)=>{let[o,i]=Rd(t,n,r),a=E("x",t.dataType,t.dims.length),l=a.type.value,d="value += x_val;",p="";o.countIncludePad?p+=`value /= ${l}(uniforms.kernelSize);`:p+=`value /= ${l}(i32(uniforms.kernelSize) - pad);`;let[m,u,h,w,g]=Md(i,o);m.push(...V(t.dims,i));let b=["rank"];return{name:e,shaderCache:{hint:`${n.cacheKey};${h};${w};${g}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(k.size(i)/64)},programUniforms:m}),getShaderSource:x=>Ud(x,a,t.dims.length,i.length,o,d,p,0,u,h,w,g)}},Hd=e=>{let t=e.count_include_pad!==0,r=Nd(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let n={countIncludePad:t,...r,cacheKey:""};return{...n,cacheKey:Pf(n)}},Gd=(e,t)=>{nn(e.inputs),e.compute(Wd("AveragePool",e.inputs[0],!1,t))},Ld={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Fd=e=>{let t=e.format;return{format:t,...Ld,cacheKey:t}},qd=(e,t)=>{nn(e.inputs),e.compute(Wd("GlobalAveragePool",e.inputs[0],!0,t))},jd=(e,t,r,n)=>{let[o,i]=Rd(t,n,r),a=`
      value = max(x_val, value);
    `,l="",d=E("x",t.dataType,t.dims.length),p=["rank"],[m,u,h,w,g]=Md(i,o);return m.push(...V(t.dims,i)),{name:e,shaderCache:{hint:`${n.cacheKey};${h};${w};${g}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(k.size(i)/64)},programUniforms:m}),getShaderSource:b=>Ud(b,d,t.dims.length,i.length,o,a,l,t.dataType===10?-65504:-1e5,u,h,w,g)}},Kd=(e,t)=>{nn(e.inputs),e.compute(jd("MaxPool",e.inputs[0],!1,t))},Yd=e=>{let t=e.storage_order,r=e.dilations,n=Nd(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(n.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let o={storageOrder:t,dilations:r,...n,cacheKey:""};return{...o,cacheKey:Of(o)}},Xd=e=>{let t=e.format;return{format:t,...Ld,cacheKey:t}},Zd=(e,t)=>{nn(e.inputs),e.compute(jd("GlobalMaxPool",e.inputs[0],!0,t))}});var zf,Bf,Jd,el=U(()=>{"use strict";Ke();Q();ie();zf=(e,t,r)=>{let n=e===t,o=e<t&&r<0,i=e>t&&r>0;if(n||o||i)throw new Error("Range these inputs' contents are invalid.")},Bf=(e,t,r,n)=>{let o=Math.abs(Math.ceil((t-e)/r)),i=[o],a=o,l=[{type:12,data:a},{type:n,data:e},{type:n,data:r},...V(i)],d=p=>{let m=M("output",n,i.length),u=m.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:u},{name:"delta",type:u}];return`
        ${p.registerUniforms(h).declareVariables(m)}
        ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${u}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${n}`},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:n}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l})}},Jd=e=>{let t=0,r=0,n=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],n=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],n=e.inputs[2].getFloat32Array()[0]),be.webgpu.validateInputContent&&zf(t,r,n),e.compute(Bf(t,r,n,e.inputs[0].dataType),{inputs:[]})}});var Rf,Mf,Uf,Vf,Nf,Wf,Hf,Gf,Lf,Ff,qf,tl,jf,Kf,Yf,Xf,Zf,rl,nl,ol=U(()=>{"use strict";Q();ae();Ce();ie();Rf=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Mf=(e,t,r)=>{t.every(o=>o>=0&&o<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let n=new Array(r).fill(1);return t.forEach((o,i)=>n[o]=e[i]),n},Uf=(e,t,r,n,o,i)=>{let[a,l,d]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],p=e[0].dims.length;if(a>0&&e.length>a&&e[a].dims.length>0)e[a].getFloat32Array().forEach(m=>i.push(m));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(l>0&&e.length>l&&e[l].dims.length>0){if(e[l].getFloat32Array().forEach(m=>n.push(m)),n.length!==0&&n.length!==p&&r>=18&&n.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Rf(n,t),t.axes.length>0&&Mf(n,t.axes,p).forEach((m,u)=>n[u]=m)}if(d>0&&e.length>d&&(e[d].getBigInt64Array().forEach(m=>o.push(Number(m))),o.length!==p||r>=18&&o.length===t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(n.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(o.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof n<"u"&&typeof o<"u"&&n.length>0&&o.length>p)throw new Error("Resize requires only of scales or sizes to be specified")},Vf=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`return ${t}(xResized) / ${t}(xScale);`;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    // The whole part and the fractional part are calculated separately due to inaccuracy of floating
                    // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
                    // offset-by-one error later in floor().
                    let whole = ${t}(xResized * (lengthOriginal - 1) / (lengthResized - 1));
                    let fract =
                        ${t}(xResized * (lengthOriginal - 1) % (lengthResized - 1)) / ${t}(lengthResized - 1);
                    return whole + fract;
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Nf=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Wf=(e,t,r)=>{let n=new Array(r).fill(0).concat(new Array(r).fill(1)),o=e.length===0?n:e.slice();return t.length>0?(t.forEach((i,a)=>{n[i]=o[a],n[a+r]=o[t.length+a]}),n):o},Hf=(e,t,r,n)=>{let o=[];if(r.length>0)if(n.length>0){if(e.forEach(i=>o.push(i)),Math.max(...n)>e.length)throw new Error("axes is out of bound");n.forEach((i,a)=>o[i]=r[a])}else r.forEach(i=>o.push(i));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");o=e.map((i,a)=>Math.round(i*t[a]))}return o},Gf=(e,t,r)=>{let n=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(i=>t[i]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(i=>t[i]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let o=e.slice();return r.axes.length>0?(r.axes.forEach(i=>t[i]=n),r.axes.forEach(i=>o[i]=Math.round(e[i]*t[i]))):(t.fill(n,0,t.length),o.forEach((i,a)=>o[a]=Math.round(i*t[a]))),o},Lf=(e,t,r,n,o)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${G("uniforms.scales","i",n)};
        var roi_low = ${G("uniforms.roi","i",o)};
        var roi_hi = ${G("uniforms.roi",`i + ${t.length}`,o)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${G("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${G("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Ff=(e,t,r,n,o,i,a)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${G("uniforms.scales","i",o)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${G("uniforms.roi","i",i)};
          var roi_hi = ${G("uniforms.roi",`i + ${r.length}`,i)};
          var input_shape_i = ${G("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${G("uniforms.output_shape","i",n.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${a} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i"," input_index")}
      }
      return input_indices;
    }`,qf=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${G("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,tl=(e,t,r,n)=>e.rank>n?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",jf=(e,t,r,n,o)=>{let[a,l,d,p]=r.length===2?[-1,0,1,-1]:[0,2,3,1],m=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${m} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",l,`max(0, min(row, ${r[l]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(col, ${r[d]} - 1))`)};
      ${tl(e,p,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${m} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${m} = originalIndices[${l}];
      var col:${m} = originalIndices[${d}];
      ${n?`if (row < 0 || row > (${r[l]} - 1) || col < 0 || col > (${r[d]} - 1)) {
        return ${o};
      }`:""};
      row = max(0, min(row, ${r[l]} - 1));
      col = max(0, min(col, ${r[d]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${m} = getInputValue(batch, channel, row1, col1);
      var x12: ${m} = getInputValue(batch, channel, row1, col2);
      var x21: ${m} = getInputValue(batch, channel, row2, col1);
      var x22: ${m} = getInputValue(batch, channel, row2, col2);
      var dx1: ${m} = abs(row - ${m}(row1));
      var dx2: ${m} = abs(${m}(row2) - row);
      var dy1: ${m} = abs(col - ${m}(col1));
      var dy2: ${m} = abs(${m}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Kf=(e,t,r,n,o,i,a,l,d,p)=>{let m=r.length===2,u=!0,[h,w]=m?[0,1]:u?[2,3]:[1,2],g=e.type.value,b=x=>{let _=x===h?"row":"col";return`
      fn ${_}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${g} {
        var output_index = ${t.indicesGet("output_indices",x)};
        var originalIdx: ${g} = getOriginalCoordinateFromResizedCoordinate(output_index, ${o[x]},
        ${n[x]}, ${r[x]}, ${i[x]}, ${i[x]} + ${r.length});
        var fractOriginalIdx: ${g} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${l} && (originalIdx < 0 || originalIdx > (${r[x]} - 1))) {
          return ${d};
        }
        var data: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${_}: ${g} = originalIdx + ${g}(i);
          if (${_} < 0 || ${_} >= ${r[x]}) {
            ${(()=>p?`coefs[i + 1] = 0.0;
                        continue;`:l?`return ${d};`:`${_} = max(0, min(${_}, ${r[x]} - 1));`)()};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",x,`u32(${_})`)};
          data[i + 1] = ${x===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${b(h)};
    ${b(w)};
  fn getCubicInterpolationCoefs(s: ${g}) -> array<${g}, 4> {
    var absS = abs(s);
    var coeffs: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${g} = 1.0 - absS;
    var twoMinusAbsS: ${g} = 2.0 - absS;
    var onePlusAbsS: ${g} = 1.0 + absS;
    coeffs[0] = ((${a} * onePlusAbsS - 5 * ${a}) * onePlusAbsS + 8 * ${a}) * onePlusAbsS - 4 * ${a};
    coeffs[1] = ((${a} + 2) * absS - (${a} + 3)) * absS * absS + 1;
    coeffs[2] = ((${a} + 2) * oneMinusAbsS - (${a} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${a} * twoMinusAbsS - 5 * ${a}) * twoMinusAbsS + 8 * ${a}) * twoMinusAbsS - 4 * ${a};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${g}, 4>, coefs: array<${g}, 4>) -> ${g} {
    var coefsSum: ${g} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${g} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Yf=(e,t,r,n,o)=>{let[a,l,d,p,m]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],u=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${u} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",l,`max(0, min(depth, ${r[l]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(height, ${r[d]} - 1))`)};
      ${e.indicesSet("input_indices",p,`max(0, min(width, ${r[p]} - 1))`)};
      ${tl(e,m,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${u} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${u} = originalIndices[${l}];
      var height:${u} = originalIndices[${d}];
      var width:${u} = originalIndices[${p}];
      ${n?`if (depth < 0 || depth > (${r[l]} - 1) || height < 0 || height > (${r[d]} - 1) || width < 0 || (width > ${r[p]} - 1)) {
      return ${o};
        }`:""};

    depth = max(0, min(depth, ${r[l]} - 1));
      height = max(0, min(height, ${r[d]} - 1));
      width = max(0, min(width, ${r[p]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${m}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${u} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${u} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${u} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${u} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${u} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${u} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${u} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${u} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${u} = abs(depth - ${u}(depth1));
      var dx2: ${u} = abs(${u}(depth2) - depth);
      var dy1: ${u} = abs(height - ${u}(height1));
      var dy2: ${u} = abs(${u}(height2) - height);
      var dz1: ${u} = abs(width - ${u}(width1));
      var dz2: ${u} = abs(${u}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Xf=(e,t,r,n,o,i)=>{let a=e.dims,l=Wf(i,t.axes,a.length),d=Hf(a,n,o,t.axes),p=n.slice();n.length===0&&(p=a.map(($,S)=>$===0?1:d[S]/$),t.keepAspectRatioPolicy!=="stretch"&&(d=Gf(a,p,t)));let m=M("output",e.dataType,d.length),u=E("input",e.dataType,a.length),h=k.size(d),w=a.length===d.length&&a.every(($,S)=>$===d[S]),g=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,x=u.type.value,_=$=>`
      ${w?"":`
      ${Vf(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${qf(u,a)};
              ${Nf(t.nearestMode,r,x)};
              ${Ff(u,m,a,d,p.length,l.length,g)};
              `;case"linear":return`
              ${Lf(m,a,d,p.length,l.length)};
              ${(()=>{if(a.length===2||a.length===4)return`${jf(u,m,a,g,b)}`;if(a.length===3||a.length===5)return`${Yf(u,m,a,g,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(a.length===2||a.length===4)return`${Kf(u,m,a,d,p,l,t.cubicCoeffA,g,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${$.registerUniform("output_size","u32").registerUniform("scales","f32",p.length).registerUniform("roi","f32",l.length).declareVariables(u,m)}
      ${$.mainStart()}
        ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${w?"output[global_idx] = input[global_idx];":`
        let output_indices = ${m.offsetToIndices("global_idx")};
        var input_indices: ${u.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${u.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${a.length===2||a.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${p.length>0?p:""}|${o.length>0?o:""}|${l.length>0?l:""}|${w}|${a}`,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:p},{type:1,data:l},...V(a,d)]})}},Zf=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},rl=(e,t)=>{let r=[],n=[],o=[],i=Zf(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Uf(e.inputs,t,i,r,n,o),e.compute(Xf(e.inputs[0],t,i,r,n,o),{inputs:[0]})},nl=e=>{let t=e.antialias,r=e.axes,n=e.coordinateTransformMode,o=e.cubicCoeffA,i=e.excludeOutside!==0,a=e.extrapolationValue,l=e.keepAspectRatioPolicy,d=e.mode,p=e.nearestMode===""?"simple":e.nearestMode;return te({antialias:t,axes:r,coordinateTransformMode:n,cubicCoeffA:o,excludeOutside:i,extrapolationValue:a,keepAspectRatioPolicy:l,mode:d,nearestMode:p})}});var Qf,Jf,il,al=U(()=>{"use strict";Q();ae();Ce();ie();Qf=(e,t)=>{let[r,n,o,i]=e,{numHeads:a,rotaryEmbeddingDim:l}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!k.areEqual(n.dims,[])&&!k.areEqual(n.dims,[1])&&n.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${n.dims.length}`);if(o.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${o.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!k.areEqual(o.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(l>0&&a===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let d=r.dims[0],p=r.dims[r.dims.length-2],m=o.dims[0],u=k.sizeFromDimension(r.dims,1)/p,h=l===0?o.dims[1]*2:u/a;if(l>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(n.dims.length===2){if(d!==n.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${n.dims[0]}`);if(p!==n.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${n.dims[1]}`)}if(h/2!==o.dims[1]&&l/2!==o.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${o.dims[1]}`);if(p>m)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Jf=(e,t)=>{let{interleaved:r,numHeads:n,rotaryEmbeddingDim:o,scale:i}=t,a=e[0].dims[0],l=k.sizeFromDimension(e[0].dims,1),d=e[0].dims[e[0].dims.length-2],p=l/d,m=e[2].dims[1],u=o===0?m*2:p/n,h=new Array(a,d,p/u,u-m),w=k.computeStrides(h),g=[{type:1,data:i},{type:12,data:h},{type:12,data:w},...e[0].dims.length===3?new Array({type:12,data:[l,p,u,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[l,u,d*u,1]}):[],...V(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=x=>{let _=E("input",e[0].dataType,e[0].dims.length),$=E("position_ids",e[1].dataType,e[1].dims.length),S=E("cos_cache",e[2].dataType,e[2].dims.length),I=E("sin_cache",e[3].dataType,e[3].dims.length),T=M("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:w.length},{name:"input_output_strides",type:"u32",length:w.length}]),`
        ${x.declareVariables(_,$,S,I,T)}

        ${x.mainStart(Tt)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${$.broadcastedIndicesToOffset("bsnh.xy",M("",$.type.tensor,2))};
            let position_id =
                u32(${$.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${_.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${_.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${_.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} +
                ${_.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",_.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:te({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(k.size(h)/Tt)},programUniforms:g})}},il=(e,t)=>{Qf(e.inputs,t),e.compute(Jf(e.inputs,t))}});var eh,th,sl,ul=U(()=>{"use strict";Q();ae();ie();eh=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],n=e[2];if(t.dataType!==r.dataType||t.dataType!==n.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let o=t.dims[t.dims.length-1],i=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==o)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(n.dims.length!==1)throw new Error("Gamma must be 1D");if(n.dims[n.dims.length-1]!==o)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let a=e[3];if(a.dims.length!==1)throw new Error("Beta must be 1D");if(a.dims[a.dims.length-1]!==o)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let a=e[4];if(a.dims.length!==1)throw new Error("Bias must be 1D");if(a.dims[a.dims.length-1]!==o)throw new Error("Bias must have the same hidden size as input")}},th=(e,t,r,n)=>{let o=t.simplified,i=e[0].dims,a=k.size(i),l=i,d=a,p=i.slice(-1)[0],m=n?i.slice(0,-1).concat(1):[],u=!o&&e.length>3,h=e.length>4,w=n&&r>1,g=n&&r>2,b=r>3,x=64,_=$e(p),$=[{type:12,data:d},{type:12,data:_},{type:12,data:p},{type:1,data:t.epsilon}],S=T=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],D=[E("x",e[0].dataType,e[0].dims,_),E("skip",e[1].dataType,e[1].dims,_),E("gamma",e[2].dataType,e[2].dims,_)];u&&D.push(E("beta",e[3].dataType,e[3].dims,_)),h&&D.push(E("bias",e[4].dataType,e[4].dims,_)),D.push(M("output",e[0].dataType,l,_)),w&&D.push(M("mean_output",1,m)),g&&D.push(M("inv_std_output",1,m)),b&&D.push(M("input_skip_bias_sum",e[0].dataType,l,_));let z=ge(e[0].dataType),H=ge(1,_);return`

      ${T.registerUniforms(A).declareVariables(...D)}
      var<workgroup> sum_shared : array<${H}, ${x}>;
      var<workgroup> sum_squared_shared : array<${H}, ${x}>;

      ${T.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":z+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${b?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${At(z,_,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Xe("sum",_)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Xe("square_sum",_)} / f32(uniforms.hidden_size) ${o?"":"- mean * mean"} + uniforms.epsilon);
        ${w?"mean_output[global_idx] = mean;":""}
        ${g?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o?"":`- ${z}(mean)`}) *
            ${z}(inv_std_dev) * gamma[offset1d + i]
            ${u?"+ beta[offset1d + i]":""};
        }
      }`},I=[{dims:l,dataType:e[0].dataType}];return r>1&&I.push({dims:m,dataType:1}),r>2&&I.push({dims:m,dataType:1}),r>3&&I.push({dims:i,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${_};${w};${g};${b}`,inputDependencies:e.map((T,A)=>"type")},getShaderSource:S,getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(d/p)},programUniforms:$})}},sl=(e,t)=>{eh(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(th(e.inputs,t,e.outputCount,!1),{outputs:n})}});var rh,on,nh,dl,oh,ih,ll,cl,pl=U(()=>{"use strict";Q();ae();Ce();ie();rh=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,n)=>{if(e[n+1].dataType!==6&&e[n+1].dataType!==7)throw new Error(`Input ${n} must be an array of int32 or int64`)})},on=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(n=>r.push(Number(n)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(n=>r.push(Number(n)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},nh=(e,t)=>{if(e.length>1){let r=on(e,1),n=on(e,2),o=on(e,3);return o.length===0&&(o=[...Array(e[0].dims.length).keys()]),te({starts:r,ends:n,axes:o})}else return t},dl=(e,t,r,n,o)=>{let i=e;return e<0&&(i+=r[n[t]]),o[t]<0?Math.max(0,Math.min(i,r[n[t]]-1)):Math.max(0,Math.min(i,r[n[t]]))},oh=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${G("uniforms.input_shape","i",r.length)};
            let steps_i = ${G("uniforms.steps","i",r.length)};
            let signs_i = ${G("uniforms.signs","i",r.length)};
            let starts_i = ${G("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,ih=(e,t)=>{let r=e[0].dims,n=k.size(r),o=t.axes.length>0?k.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],i=on(e,4);i.forEach(_=>_!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(o.length).fill(1));let a=t.starts.map((_,$)=>dl(_,$,r,o,i)),l=t.ends.map((_,$)=>dl(_,$,r,o,i));if(o.length!==a.length||o.length!==l.length)throw new Error("start, ends and axes should have the same number of elements");if(o.length!==r.length)for(let _=0;_<r.length;++_)o.includes(_)||(a.splice(_,0,0),l.splice(_,0,r[_]),i.splice(_,0,1));let d=i.map(_=>Math.sign(_));i.forEach((_,$,S)=>{if(_<0){let I=(l[$]-a[$])/_,T=a[$],A=T+I*i[$];a[$]=A,l[$]=T,S[$]=-_}});let p=r.slice(0);o.forEach((_,$)=>{p[_]=Math.ceil((l[_]-a[_])/i[_])});let m={dims:p,dataType:e[0].dataType},u=M("output",e[0].dataType,p.length),h=E("input",e[0].dataType,e[0].dims.length),w=k.size(p),g=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:a.length},{name:"signs",type:"i32",length:d.length},{name:"steps",type:"u32",length:i.length}],b=[{type:12,data:w},{type:12,data:a},{type:6,data:d},{type:12,data:i},...V(e[0].dims,p)],x=_=>`
      ${_.registerUniforms(g).declareVariables(h,u)}
        ${oh(h,u,r)}
        ${_.mainStart()}
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${u.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${u.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${d.length}_${a.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[m],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:b})}},ll=(e,t)=>{rh(e.inputs,t);let r=nh(e.inputs,t);e.compute(ih(e.inputs,r),{inputs:[0]})},cl=e=>{let t=e.starts,r=e.ends,n=e.axes;return te({starts:t,ends:r,axes:n})}});var ah,sh,ml,fl,hl=U(()=>{"use strict";Q();ae();Ce();ie();ah=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},sh=(e,t)=>{let r=e.dims,n=k.size(r),o=64,i=t.axis;if(i<0&&(i=r.length+i),i<r.length-1)throw new Error("softmax only supports last axis for now.");let a=r[i],l=n/a,d=$e(a),p=a/d,m=(x,_)=>_===4?`max(max(${x}.x, ${x}.y), max(${x}.z, ${x}.w))`:_===2?`max(${x}.x, ${x}.y)`:_===3?`max(max(${x}.x, ${x}.y), ${x}.z)`:x,u=E("x",e.dataType,e.dims,d),h=M("result",e.dataType,e.dims,d),w=u.type.value,g=ge(e.dataType)==="f32"?`var threadMax = ${w}(-3.402823e+38f);`:`var threadMax = ${w}(-65504.0h);`,b=x=>`
      var<workgroup> rowMaxShared : ${w};
      var<workgroup> rowSumShared : ${w};
      var<workgroup> threadShared : array<${w}, ${o}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${w} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${w}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${x.registerUniform("packedCols","i32").declareVariables(u,h)}
      ${x.mainStart()}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${o};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${g}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${w}(${m("threadShared[0]",d)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${w}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${w}(${Xe("threadShared[0]",d)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`;return{name:"Softmax",shaderCache:{hint:`${d}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.dataType}],dispatchGroup:{x:l},programUniforms:[{type:6,data:p}]}),getShaderSource:b}},ml=(e,t)=>{ah(e.inputs),e.compute(sh(e.inputs[0],t))},fl=e=>te({axis:e.axis})});var uh,dh,lh,ch,ph,gl,yl,bl=U(()=>{"use strict";Q();ae();Ce();ie();uh=e=>{if(!e||e.length<1)throw new Error("too few inputs")},dh=(e,t)=>{let r=[],n=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(o=>r.push(Number(o))),n=r.length),te({numOutputs:n,axis:t.axis,splitSizes:r})},lh=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${G("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,ch=e=>{let t=e.length,r=[];for(let n=0;n<t;++n){let o=e[n].setByIndices("indices","input[global_idx]");t===1?r.push(o):n===0?r.push(`if (output_number == ${n}u) { ${o} }`):n===t-1?r.push(`else { ${o} }`):r.push(`else if (output_number == ${n}) { ${o} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},ph=(e,t)=>{let r=e[0].dims,n=k.size(r),o=e[0].dataType,i=k.normalizeAxis(t.axis,r.length),a=new Array(t.numOutputs),l=E("input",o,r.length),d=new Array(t.numOutputs),p=[],m=[],u=0,h=[{type:12,data:n}];for(let g=0;g<t.numOutputs;g++){u+=t.splitSizes[g],d[g]=u;let b=r.slice();b[t.axis]=t.splitSizes[g],m.push(b),a[g]=M(`output${g}`,o,b.length),p.push({dims:m[g],dataType:e[0].dataType})}h.push({type:12,data:d},...V(r,...m));let w=g=>`
  ${g.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",d.length).declareVariables(l,...a)}
  ${lh(d.length)}
  ${ch(a)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${l.offsetToIndices("global_idx")};
    var index = ${l.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${G("uniforms.size_in_split_axis","output_number - 1u",d.length)};
      ${l.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:w,getRunData:()=>({outputs:p,dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h})}},gl=(e,t)=>{uh(e.inputs);let r=e.inputs.length===1?t:dh(e.inputs,t);e.compute(ph(e.inputs,r),{inputs:[0]})},yl=e=>{let t=e.axis,r=e.splitSizes,n=e.numOutputs<0?r.length:e.numOutputs;if(n!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return te({axis:t,numOutputs:n,splitSizes:r})}});var mh,fh,wl,vl=U(()=>{"use strict";Q();ae();ie();mh=(e,t,r,n,o)=>{let i=M("output_data",o,r.length,4),a=E("a_data",t[1].dataType,t[1].dims.length,4),l=E("b_data",t[2].dataType,t[2].dims.length,4),d=E("c_data",t[0].dataType,t[0].dims.length,4),p,m=(u,h,w)=>`select(${h}, ${u}, ${w})`;if(!n)p=i.setByOffset("global_idx",m(a.getByOffset("global_idx"),l.getByOffset("global_idx"),d.getByOffset("global_idx")));else{let u=(h,w,g="")=>{let b=`a_data[index_a${w}][component_a${w}]`,x=`b_data[index_b${w}][component_b${w}]`,_=`bool(c_data[index_c${w}] & (0xffu << (component_c${w} * 8)))`;return`
            let output_indices${w} = ${i.offsetToIndices(`global_idx * 4u + ${w}u`)};
            let offset_a${w} = ${a.broadcastedIndicesToOffset(`output_indices${w}`,i)};
            let offset_b${w} = ${l.broadcastedIndicesToOffset(`output_indices${w}`,i)};
            let offset_c${w} = ${d.broadcastedIndicesToOffset(`output_indices${w}`,i)};
            let index_a${w} = offset_a${w} / 4u;
            let index_b${w} = offset_b${w} / 4u;
            let index_c${w} = offset_c${w} / 4u;
            let component_a${w} = offset_a${w} % 4u;
            let component_b${w} = offset_b${w} % 4u;
            let component_c${w} = offset_c${w} % 4u;
            ${h}[${w}] = ${g}(${m(b,x,_)});
          `};o===9?p=`
            var data = vec4<u32>(0);
            ${u("data",0,"u32")}
            ${u("data",1,"u32")}
            ${u("data",2,"u32")}
            ${u("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:p=`
            ${u("output_data[global_idx]",0)}
            ${u("output_data[global_idx]",1)}
            ${u("output_data[global_idx]",2)}
            ${u("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(d,a,l,i)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${p}
      }`},fh=e=>{let t=e[1].dims,r=e[2].dims,n=e[0].dims,o=e[1].dataType,i=!(k.areEqual(t,r)&&k.areEqual(r,n)),a=t,l=k.size(t);if(i){let p=tt.calcShape(tt.calcShape(t,r,!1),n,!1);if(!p)throw new Error("Can't perform where op on the given tensors");a=p,l=k.size(a)}let d=Math.ceil(l/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:p=>mh(p,e,a,i,o),getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(l/64/4)},programUniforms:[{type:12,data:d},...V(n,t,r,a)]})}},wl=e=>{e.compute(fh(e.inputs))}});var $l,_l=U(()=>{"use strict";xs();jr();Cs();As();mu();Su();Tu();co();Fu();Ku();Zu();rd();id();sd();ld();md();gd();Cd();Ad();kd();mo();Dd();_o();Bd();Qd();el();Fr();ol();al();ul();pl();hl();bl();So();Et();Yr();vl();$l=new Map([["Abs",[Es]],["Acos",[ks]],["Acosh",[Ps]],["Add",[fu]],["ArgMax",[_s,io]],["ArgMin",[$s,io]],["Asin",[Os]],["Asinh",[Ds]],["Atan",[zs]],["Atanh",[Bs]],["Attention",[Ss]],["AveragePool",[Gd,Hd]],["BatchNormalization",[Is]],["BiasAdd",[Ts]],["BiasSplitGelu",[pu]],["Cast",[Ms,Rs]],["Ceil",[Vs]],["Clip",[Us]],["Concat",[Iu,Cu]],["Conv",[yo,go]],["ConvTranspose",[Lu,Gu]],["Cos",[Ns]],["Cosh",[Ws]],["CumSum",[qu,ju]],["DepthToSpace",[Yu,Xu]],["Div",[hu]],["Einsum",[ed,td]],["Elu",[Hs,Qt]],["Equal",[gu]],["Erf",[Gs]],["Exp",[Ls]],["Expand",[od]],["FastGelu",[ad]],["Floor",[Fs]],["FusedConv",[yo,go]],["Gather",[dd,ud]],["GatherElements",[pd,cd]],["Gelu",[qs]],["Gemm",[hd,fd]],["GlobalAveragePool",[qd,Fd]],["GlobalMaxPool",[Zd,Xd]],["Greater",[vu]],["GreaterOrEqual",[_u]],["GroupQueryAttention",[Id,Sd]],["HardSigmoid",[eu,Js]],["InstanceNormalization",[Td]],["LayerNormalization",[Ed]],["LeakyRelu",[js,Qt]],["Less",[$u]],["LessOrEqual",[xu]],["Log",[du]],["MatMul",[Uu]],["MatMulNBits",[Pd,Od]],["MaxPool",[Kd,Yd]],["Mul",[yu]],["MultiHeadAttention",[wd,bd]],["Neg",[Ys]],["Not",[Ks]],["Pad",[zd]],["Pow",[bu]],["QuickGelu",[lu,Qt]],["Range",[Jd]],["Reciprocal",[Xs]],["ReduceMin",[hs]],["ReduceMean",[ls]],["ReduceMax",[fs]],["ReduceSum",[ys]],["ReduceProd",[gs]],["ReduceL1",[cs]],["ReduceL2",[ps]],["ReduceLogSum",[ws]],["ReduceLogSumExp",[ms]],["ReduceSumSquare",[bs]],["Relu",[Zs]],["Resize",[rl,nl]],["RotaryEmbedding",[il]],["Sigmoid",[Qs]],["Sin",[tu]],["Sinh",[ru]],["Slice",[ll,cl]],["SkipLayerNormalization",[sl]],["Split",[gl,yl]],["Sqrt",[nu]],["Softmax",[ml,fl]],["Sub",[wu]],["Tan",[ou]],["Tanh",[au]],["ThresholdedRelu",[uu,Qt]],["Tile",[$d]],["Transpose",[Za,Qa]],["Where",[wl]]])});var an,xl=U(()=>{"use strict";Ke();dt();ie();an=class{constructor(t){this.backend=t;this.repo=new Map,this.attributesBound=!1}getArtifact(t){return this.repo.get(t)}setArtifact(t,r){this.repo.set(t,r)}run(t,r,n,o,i){We(t.programInfo.name);let a=this.backend.device,l=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let d=[];for(let m of r)d.push({binding:d.length,resource:{buffer:m.buffer}});for(let m of n)d.push({binding:d.length,resource:{buffer:m.buffer}});i&&d.push({binding:d.length,resource:i});let p=a.createBindGroup({layout:t.computePipeline.getBindGroupLayout(0),entries:d,label:t.programInfo.name});if(this.backend.sessionStatus==="capturing"){let m={kernelId:this.backend.currentKernelId,computePipeline:t.computePipeline,bindGroup:p,dispatchGroup:o};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(m)}l.setPipeline(t.computePipeline),l.setBindGroup(0,p),l.dispatchWorkgroups(...o),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Me(t.programInfo.name)}dispose(){}build(t,r){We(t.name);let n=this.backend.device,o=[];n.features.has("shader-f16")&&o.push("enable f16;");let i=Ya(r,this.backend.device.limits),a=t.getShaderSource(i),l=`${o.join(`
`)}
${i.additionalImplementations}
${a}`,d=n.createShaderModule({code:l,label:t.name});ve("verbose",()=>`[WebGPU] ${t.name} shader code: ${l}`);let p=n.createComputePipeline({compute:{module:d,entryPoint:"main"},layout:"auto",label:t.name});return Me(t.name),{programInfo:t,computePipeline:p,uniformVariablesInfo:i.variablesInfo}}normalizeDispatchGroupSize(t){let r=typeof t=="number"?t:t.x,n=typeof t=="number"?1:t.y||1,o=typeof t=="number"?1:t.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(r<=i&&n<=i&&o<=i)return[r,n,o];let a=r*n*o,l=Math.ceil(Math.sqrt(a));if(l>i){if(l=Math.ceil(Math.cbrt(a)),l>i)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[l,l,l]}else return[l,l,1]}}});var hh,gh,Io,sn,Sl=U(()=>{"use strict";Ke();Q();dt();Ga();Ka();_l();xl();hh=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let n=0;n<e.length;++n){let o=e[n].dataType;switch(t[n]){case"none":{r.push("");break}case"type":{r.push(`${o}`);break}case"rank":{let i=e[n].dims.length;r.push(`${o};${i}`);break}case"dims":{let i=e[n].dims.join(",");r.push(`${o};${i}`);break}default:throw new Error(`unsupported input dependency: ${t[n]}`)}}return r.join("|")},gh=(e,t,r)=>{let n=e.name;return e.shaderCache?.hint&&(n+="["+e.shaderCache.hint+"]"),n+=":"+r+`:${hh(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,n},Io=class{constructor(t){t&&(this.architecture=t.architecture,this.vendor=t.vendor)}isArchitecture(t){return this.architecture===t}isVendor(t){return this.vendor===t}},sn=class{constructor(){this.currentSessionId=null;this.currentKernelId=null;this.commandEncoder=null;this.computePassEncoder=null;this.maxDispatchNumber=16;this.pendingDispatchNumber=0;this.pendingKernels=[];this.pendingQueries=new Map;this.sessionStatus="default";this.capturedCommandList=new Map;this.capturedPendingKernels=new Map;this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let t=this.kernelCustomData.get(this.currentKernelId);return t||(t={},this.kernelCustomData.set(this.currentKernelId,t)),t}async initialize(t,r){this.env=t;let n=[],o={requiredLimits:{maxComputeWorkgroupStorageSize:r.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:r.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:r.limits.maxStorageBufferBindingSize,maxBufferSize:r.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:r.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:r.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n};r.features.has("chromium-experimental-timestamp-query-inside-passes")?n.push("chromium-experimental-timestamp-query-inside-passes"):r.features.has("timestamp-query")&&n.push("timestamp-query"),r.features.has("shader-f16")&&n.push("shader-f16"),this.device=await r.requestDevice(o),this.adapterInfo=new Io(r.info||await r.requestAdapterInfo()),this.gpuDataManager=ja(this),this.programManager=new an(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Wa(t.logLevel,!!t.debug),this.device.onuncapturederror=i=>{i.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${i.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:r,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let t=this.getCommandEncoder(),r={};this.queryType==="at-passes"&&(r.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=t.beginComputePass(r)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;We(),this.endComputePass();let t;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),t=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(t,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,t,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&t.mapAsync(GPUMapMode.READ).then(()=>{let r=new BigUint64Array(t.getMappedRange()),n=this.pendingQueries.get(t);for(let o=0;o<r.length/2;o++){let i=n[o],a=i.kernelId,l=this.kernels.get(a),d=l.kernelType,p=l.kernelName,m=i.programName,u=i.inputTensorViews,h=i.outputTensorViews,w=r[o*2],g=r[o*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=w);let b=Number(w-this.queryTimeBase),x=Number(g-this.queryTimeBase);if(!Number.isSafeInteger(b)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:u.map(_=>({dims:_.dims,dataType:ht(_.dataType)})),outputsMetadata:h.map(_=>({dims:_.dims,dataType:ht(_.dataType)})),kernelId:a,kernelType:d,kernelName:p,programName:m,startTime:b,endTime:x});else{let _="";u.forEach((S,I)=>{_+=`input[${I}]: [${S.dims}] | ${ht(S.dataType)}, `});let $="";h.forEach((S,I)=>{$+=`output[${I}]: [${S.dims}] | ${ht(S.dataType)}, `}),console.log(`[profiling] kernel "${a}|${d}|${p}|${m}" ${_}${$}execution time: ${x-b} ns`)}Sr("GPU",`${m}::${w}::${g}`)}t.unmap(),this.pendingQueries.delete(t)}),Me()}run(t,r,n,o,i,a){We(t.name);let l=[];for(let S=0;S<r.length;++S){let I=r[S].data;if(I===0)continue;let T=this.gpuDataManager.get(I);if(!T)throw new Error(`no GPU data for input: ${I}`);l.push(T)}let{outputs:d,dispatchGroup:p,programUniforms:m}=t.getRunData(r),u=n.length===0?d.map((S,I)=>I):n;if(u.length!==d.length)throw new Error(`Output size ${u.length} must be equal to ${d.length}.`);let h=[],w=[];for(let S=0;S<d.length;++S){if(!Number.isInteger(u[S])||u[S]<-3||u[S]>=a)throw new Error(`Invalid output index: ${u[S]}`);if(u[S]===-3)continue;let I=u[S]===-1,T=u[S]===-2,A=I||T?i(d[S].dataType,d[S].dims):o(u[S],d[S].dataType,d[S].dims);if(h.push(A),A.data===0)continue;let D=this.gpuDataManager.get(A.data);if(!D)throw new Error(`no GPU data for output: ${A.data}`);if(I&&this.temporaryData.push(D),T){let z=this.kernelPersistentData.get(this.currentKernelId);z||(z=[],this.kernelPersistentData.set(this.currentKernelId,z)),z.push(D)}w.push(D)}if(l.length!==r.length||w.length!==h.length){if(w.length===0)return Me(t.name),h;throw new Error(`Program ${t.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(m){let S=0,I=[];m.forEach(z=>{let H=typeof z.data=="number"?[z.data]:z.data;if(H.length===0)return;let W=z.type===10?2:4,X,Y;z.type===10?(Y=H.length>4?16:H.length>2?8:H.length*W,X=H.length>4?16:W*H.length):(Y=H.length<=2?H.length*W:16,X=16),S=Math.ceil(S/Y)*Y,I.push(S);let pe=z.type===10?8:4;S+=H.length>4?Math.ceil(H.length/pe)*X:H.length*W});let T=16;S=Math.ceil(S/T)*T;let A=new ArrayBuffer(S);m.forEach((z,H)=>{let W=I[H],X=typeof z.data=="number"?[z.data]:z.data;if(z.type===6)new Int32Array(A,W,X.length).set(X);else if(z.type===12)new Uint32Array(A,W,X.length).set(X);else if(z.type===10)new Uint16Array(A,W,X.length).set(X);else if(z.type===1)new Float32Array(A,W,X.length).set(X);else throw new Error(`Unsupported uniform type: ${ht(z.type)}`)});let D=this.gpuDataManager.create(S,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(D.buffer,0,A,0,S),this.gpuDataManager.release(D.id),g={offset:0,size:S,buffer:D.buffer}}let b=this.programManager.normalizeDispatchGroupSize(p),x=b[1]===1&&b[2]===1,_=gh(t,r,x),$=this.programManager.getArtifact(_);if($||($=this.programManager.build(t,b),this.programManager.setArtifact(_,$),ve("info",()=>`[artifact] key: ${_}, programName: ${t.name}`)),m&&$.uniformVariablesInfo){if(m.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${m.length} in program "${$.programInfo.name}".`);for(let S=0;S<m.length;S++){let I=m[S],T=I.type,A=typeof I.data=="number"?1:I.data.length,[D,z]=$.uniformVariablesInfo[S];if(T!==D||A!==z)throw new Error(`Uniform variable ${S} mismatch: expect type ${D} with size ${z}, got type ${T} with size ${A} in program "${$.programInfo.name}".`)}}if(ve("info",()=>`[ProgramManager] run "${t.name}" (key=${_}) with ${b[0]}x${b[1]}x${b[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let S={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:r,outputTensorViews:h};this.pendingKernels.push(S),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(S)}return this.programManager.run($,l,w,b,g),Me(t.name),h}upload(t,r){this.gpuDataManager.upload(t,r)}memcpy(t,r){this.gpuDataManager.memcpy(t,r)}async download(t,r){await this.gpuDataManager.download(t,r)}alloc(t){return this.gpuDataManager.create(t).id}free(t){return this.gpuDataManager.release(t)}createKernel(t,r,n,o){let i=$l.get(t);if(!i)throw new Error(`kernel not implemented: ${t}`);let a={kernelType:t,kernelName:o,kernelEntry:i[0],attributes:[i[1],n]};this.kernels.set(r,a)}releaseKernel(t){let r=this.kernelPersistentData.get(t);if(r){for(let n of r)this.gpuDataManager.release(n.id);this.kernelPersistentData.delete(t)}this.kernelCustomData.delete(t),this.kernels.delete(t)}computeKernel(t,r,n){let o=this.kernels.get(t);if(!o)throw new Error(`kernel not created: ${t}`);let i=o.kernelType,a=o.kernelName,l=o.kernelEntry,d=o.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${i}] ${a}" is not allowed to be called recursively`);this.currentKernelId=t,d[0]&&(d[1]=d[0](d[1]),d[0]=void 0),ve("info",()=>`[WebGPU] Start to run kernel "[${i}] ${a}"...`);let p=this.env.debug;this.temporaryData=[];try{return p&&this.device.pushErrorScope("validation"),l(r,d[1]),0}catch(m){return n.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${a}" failed. ${m}`)),1}finally{p&&n.push(this.device.popErrorScope().then(m=>m?`GPU validation error for kernel "[${i}] ${a}": ${m.message}`:null));for(let m of this.temporaryData)this.gpuDataManager.release(m.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(t,r,n,o){let i=this.sessionExternalDataMapping.get(t);i||(i=new Map,this.sessionExternalDataMapping.set(t,i));let a=i.get(r),l=this.gpuDataManager.registerExternalBuffer(n,o,a?.[1]);return i.set(r,[l,n]),l}unregisterBuffers(t){let r=this.sessionExternalDataMapping.get(t);r&&(r.forEach(n=>this.gpuDataManager.unregisterExternalBuffer(n[1])),this.sessionExternalDataMapping.delete(t))}getBuffer(t){let r=this.gpuDataManager.get(t);if(!r)throw new Error(`no GPU data for buffer: ${t}`);return r.buffer}createDownloader(t,r,n){return async()=>{let o=await Qn(this,t,r);return Ha(o.buffer,n)}}writeTimestamp(t){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,t)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ve("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ve("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ve("info","replay"),this.sessionStatus="replaying";let t=this.capturedCommandList.get(this.currentSessionId),r=this.capturedPendingKernels.get(this.currentSessionId),n=t.length;this.pendingKernels=[];for(let o=0;o<n;o++){let i=this.getComputePassEncoder(),a=t[o];this.writeTimestamp(this.pendingDispatchNumber*2),i.setPipeline(a.computePipeline),i.setBindGroup(0,a.bindGroup),i.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(r[o]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onReleaseSession(t){this.unregisterBuffers(t),this.capturedCommandList.has(t)&&this.capturedCommandList.delete(t),this.capturedPendingKernels.has(t)&&this.capturedPendingKernels.delete(t),this.gpuDataManager.onReleaseSession(t)}onRunStart(t){this.currentSessionId=t,this.setQueryType()}}});var Il={};Ft(Il,{init:()=>yh});var or,Co,yh,Cl=U(()=>{"use strict";Q();Sl();dt();ae();or=class e{constructor(t,r,n,o){this.module=t;this.dataType=r;this.data=n;this.dims=o}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=k.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=k.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=k.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(k.size(t)!==k.size(this.dims))throw new Error("Invalid new shape");return new e(this.module,this.dataType,this.data,t)}},Co=class{constructor(t,r,n){this.module=t;this.backend=r;this.customDataOffset=0;this.customDataSize=0;this.adapterInfo=r.adapterInfo;let o=t.HEAPU32,i=n>>>2;this.opKernelContext=o[i++];let a=o[i++];this.outputCount=o[i++],this.customDataOffset=o[i++],this.customDataSize=o[i++];let l=[];for(let d=0;d<a;d++){let p=o[i++],m=o[i++],u=o[i++],h=[];for(let w=0;w<u;w++)h.push(o[i++]);l.push(new or(t,p,m,h))}this.inputs=l}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}getMaxComputeWorkgroupSizes(){return[this.backend.device.limits.maxComputeWorkgroupSizeX,this.backend.device.limits.maxComputeWorkgroupSizeY,this.backend.device.limits.maxComputeWorkgroupSizeZ]}getMaxComputeWorkgroupStoragesize(){return this.backend.device.limits.maxComputeWorkgroupStorageSize}compute(t,r){let n=r?.inputs?.map(l=>typeof l=="number"?this.inputs[l]:l)??this.inputs,o=r?.outputs??[],i=(l,d,p)=>new or(this.module,d,this.output(l,p),p),a=(l,d)=>{let p=It(l);if(!p)throw new Error(`Unsupported data type: ${l}`);let m=p*k.size(d),u=m>0?this.backend.gpuDataManager.create(m).id:0;return new or(this.module,l,u,d)};return this.backend.run(t,n,o,i,a,this.outputCount)}output(t,r){let n=this.module.stackSave();try{let o=this.module.stackAlloc((1+r.length)*4),i=o>>2;this.module.HEAPU32[i++]=r.length;for(let a=0;a<r.length;a++)this.module.HEAPU32[i++]=r[a];return this.module._JsepOutput(this.opKernelContext,t,o)}catch(o){throw new Error(`Failed to generate kernel's output[${t}] with dims [${r}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${o}`)}finally{this.module.stackRestore(n)}}},yh=async(e,t,r,n)=>{let o=t.jsepInit;if(!o)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let i=new sn;await i.initialize(r,n),o("webgpu",[i,a=>i.alloc(a),a=>i.free(a),(a,l,d,p=!1)=>{if(p)ve("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${a}, dst=${l}, size=${d}`),i.memcpy(a,l);else{ve("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${a}, gpuDataId=${l}, size=${d}`);let m=t.HEAPU8.subarray(a>>>0,(a>>>0)+d);i.upload(l,m)}},async(a,l,d)=>{ve("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${a}, dataOffset=${l}, size=${d}`),await i.download(a,()=>t.HEAPU8.subarray(l>>>0,(l>>>0)+d))},(a,l,d)=>i.createKernel(a,l,d,t.UTF8ToString(t._JsepGetNodeName(l))),a=>i.releaseKernel(a),(a,l,d,p)=>{ve("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${a}, contextDataOffset=${l}`);let m=new Co(t,i,l);return i.computeKernel(a,m,p)},()=>i.captureBegin(),()=>i.captureEnd(),()=>i.replay()])}else o("webnn")}});var bh,Er,kr,kt,wh,Kt,Pr,Or,Tl,Dr,zr,Br,Hn=U(()=>{"use strict";Ra();Ua();Q();St();Mr();Kn();bh=(e,t)=>{Ie()._OrtInit(e,t)!==0&&_e("Can't initialize onnxruntime.")},Er=async e=>{bh(e.wasm.numThreads,Xt(e.logLevel))},kr=async(e,t)=>{{let r=(Cl(),br(Il)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let n=e.webgpu.adapter;if(n){if(typeof n.limits!="object"||typeof n.features!="object"||typeof n.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let o=e.webgpu.powerPreference;if(o!==void 0&&o!=="low-power"&&o!=="high-performance")throw new Error(`Invalid powerPreference setting: "${o}"`);let i=e.webgpu.forceFallbackAdapter;if(i!==void 0&&typeof i!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${i}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:o,forceFallbackAdapter:i}),!n)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",Ie(),e,n)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",Ie(),e)}}},kt=new Map,wh=e=>{let t=Ie(),r=t.stackSave();try{let n=t.stackAlloc(8);return t._OrtGetInputOutputCount(e,n,n+4)!==0&&_e("Can't get session input/output count."),[t.HEAP32[n/4],t.HEAP32[n/4+1]]}finally{t.stackRestore(r)}},Kt=e=>{let t=Ie(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Pr=async(e,t)=>{let r,n,o=Ie();Array.isArray(e)?[r,n]=e:e.buffer===o.HEAPU8.buffer?[r,n]=[e.byteOffset,e.byteLength]:[r,n]=Kt(e);let i=0,a=0,l=0,d=[],p=[],m=[];try{if([a,d]=Ma(t),t?.externalData&&o.mountExternalData){let $=[];for(let S of t.externalData){let I=typeof S=="string"?S:S.path;$.push(Zt(typeof S=="string"?S:S.data).then(T=>{o.mountExternalData(I,T)}))}await Promise.all($)}for(let $ of t?.executionProviders??[])if((typeof $=="string"?$:$.name)==="webnn"){if(o.currentContext)throw new Error("WebNN execution provider is already set.");if(typeof $!="string"){let I=$,T=I?.context,A=I?.gpuDevice,D=I?.deviceType,z=I?.numThreads,H=I?.powerPreference;T?o.currentContext=T:A?o.currentContext=await navigator.ml.createContext(A):o.currentContext=await navigator.ml.createContext({deviceType:D,numThreads:z,powerPreference:H})}else o.currentContext=await navigator.ml.createContext();break}i=await o._OrtCreateSession(r,n,a),i===0&&_e("Can't create a session."),o.currentContext&&(o.currentContext=void 0);let[u,h]=wh(i),w=!!t?.enableGraphCapture,g=[],b=[],x=[];for(let $=0;$<u;$++){let S=o._OrtGetInputName(i,$);S===0&&_e("Can't get an input name."),p.push(S),g.push(o.UTF8ToString(S))}for(let $=0;$<h;$++){let S=o._OrtGetOutputName(i,$);S===0&&_e("Can't get an output name."),m.push(S);let I=o.UTF8ToString(S);b.push(I);{if(w&&t?.preferredOutputLocation===void 0){x.push("gpu-buffer");continue}let T=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[I]??"cpu";if(T!=="cpu"&&T!=="cpu-pinned"&&T!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${T}.`);if(w&&T!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${T}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);x.push(T)}}let _=null;return x.some($=>$==="gpu-buffer")&&(l=o._OrtCreateBinding(i),l===0&&_e("Can't create IO binding."),_={handle:l,outputPreferredLocations:x,outputPreferredLocationsEncoded:x.map($=>jn($))}),kt.set(i,[i,p,m,_,w,!1]),[i,g,b]}catch(u){throw p.forEach(h=>o._OrtFree(h)),m.forEach(h=>o._OrtFree(h)),l!==0&&o._OrtReleaseBinding(l),i!==0&&o._OrtReleaseSession(i),u}finally{o._free(r),a!==0&&o._OrtReleaseSessionOptions(a),d.forEach(u=>o._free(u)),o.unmountExternalData?.()}},Or=e=>{let t=Ie(),r=kt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[n,o,i,a,l]=r;a&&(l&&t._OrtClearBoundOutputs(a.handle),t._OrtReleaseBinding(a.handle)),t.jsepOnReleaseSession?.(e),o.forEach(d=>t._OrtFree(d)),i.forEach(d=>t._OrtFree(d)),t._OrtReleaseSession(n),kt.delete(e)},Tl=(e,t,r,n,o,i=!1)=>{if(!e){t.push(0);return}let a=Ie(),l=e[0],d=e[1],p=e[3],m,u;if(l==="string"&&p==="gpu-buffer")throw new Error("String tensor is not supported on GPU.");if(i&&p!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${o} when enableGraphCapture is true.`);if(p==="gpu-buffer"){let g=e[2].gpuBuffer,b=It(qn(l));u=d.reduce((_,$)=>_*$,1)*b;let x=a.jsepRegisterBuffer;if(!x)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');m=x(n,o,g,u)}else{let g=e[2];if(Array.isArray(g)){u=4*g.length,m=a._malloc(u),r.push(m);let b=m/4;for(let x=0;x<g.length;x++){if(typeof g[x]!="string")throw new TypeError(`tensor data at index ${x} is not a string`);a.HEAPU32[b++]=Te(g[x],r)}}else u=g.byteLength,m=a._malloc(u),r.push(m),a.HEAPU8.set(new Uint8Array(g.buffer,g.byteOffset,u),m)}let h=a.stackSave(),w=a.stackAlloc(4*d.length);try{let g=w/4;d.forEach(x=>a.HEAP32[g++]=x);let b=a._OrtCreateTensor(qn(l),m,u,w,d.length,jn(p));b===0&&_e(`Can't create tensor for input/output. session=${n}, index=${o}.`),t.push(b)}finally{a.stackRestore(h)}},Dr=async(e,t,r,n,o,i)=>{let a=Ie(),l=kt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],p=l[1],m=l[2],u=l[3],h=l[4],w=l[5],g=t.length,b=n.length,x=0,_=[],$=[],S=[],I=[],T=a.stackSave(),A=a.stackAlloc(g*4),D=a.stackAlloc(g*4),z=a.stackAlloc(b*4),H=a.stackAlloc(b*4);try{[x,_]=Ba(i);for(let K=0;K<g;K++)Tl(r[K],$,I,e,t[K],h);for(let K=0;K<b;K++)Tl(o[K],S,I,e,g+n[K],h);let W=A/4,X=D/4,Y=z/4,pe=H/4;for(let K=0;K<g;K++)a.HEAPU32[W++]=$[K],a.HEAPU32[X++]=p[t[K]];for(let K=0;K<b;K++)a.HEAPU32[Y++]=S[K],a.HEAPU32[pe++]=m[n[K]];if(u&&!w){let{handle:K,outputPreferredLocations:de,outputPreferredLocationsEncoded:re}=u;if(p.length!==g)throw new Error(`input count from feeds (${g}) is expected to be always equal to model's input count (${p.length}).`);for(let se=0;se<g;se++){let Z=t[se];await a._OrtBindInput(K,p[Z],$[se])!==0&&_e(`Can't bind input[${se}] for session=${e}.`)}for(let se=0;se<b;se++){let Z=n[se];o[se]?.[3]?a._OrtBindOutput(K,m[Z],S[se],0)!==0&&_e(`Can't bind pre-allocated output[${se}] for session=${e}.`):a._OrtBindOutput(K,m[Z],0,re[Z])!==0&&_e(`Can't bind output[${se}] to ${de[se]} for session=${e}.`)}kt.set(e,[d,p,m,u,h,!0])}a.jsepOnRunStart?.(d);let ue;u?ue=await a._OrtRunWithBinding(d,u.handle,b,z,x):ue=await a._OrtRun(d,D,A,g,H,b,z,x),ue!==0&&_e("failed to call OrtRun().");let le=[];for(let K=0;K<b;K++){let de=a.HEAPU32[z/4+K];if(de===S[K]){le.push(o[K]);continue}let re=a.stackSave(),se=a.stackAlloc(4*4),Z=!1,ne,J=0;try{a._OrtGetTensorData(de,se,se+4,se+8,se+12)!==0&&_e(`Can't access output tensor data on index ${K}.`);let R=se/4,F=a.HEAPU32[R++];J=a.HEAPU32[R++];let ce=a.HEAPU32[R++],Re=a.HEAPU32[R++],Se=[];for(let Pe=0;Pe<Re;Pe++)Se.push(a.HEAPU32[ce/4+Pe]);a._OrtFree(ce);let we=Se.reduce((Pe,ze)=>Pe*ze,1);ne=ht(F);let Lt=u?.outputPreferredLocations[n[K]];if(ne==="string"){if(Lt==="gpu-buffer")throw new Error("String tensor is not supported on GPU.");let Pe=[],ze=J/4;for(let Fe=0;Fe<we;Fe++){let Ot=a.HEAPU32[ze++],yt=Fe===we-1?void 0:a.HEAPU32[ze]-Ot;Pe.push(a.UTF8ToString(Ot,yt))}le.push([ne,Se,Pe,"cpu"])}else if(Lt==="gpu-buffer"&&we>0){let Pe=a.jsepGetBuffer;if(!Pe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let ze=Pe(J),Fe=It(F);if(Fe===void 0||!Vr(ne))throw new Error(`Unsupported data type: ${ne}`);Z=!0,le.push([ne,Se,{gpuBuffer:ze,download:a.jsepCreateDownloader(ze,we*Fe,ne),dispose:()=>{a._OrtReleaseTensor(de)}},"gpu-buffer"])}else{let Pe=Ur(ne),ze=new Pe(we);new Uint8Array(ze.buffer,ze.byteOffset,ze.byteLength).set(a.HEAPU8.subarray(J,J+ze.byteLength)),le.push([ne,Se,ze,"cpu"])}}finally{a.stackRestore(re),ne==="string"&&J&&a._free(J),Z||a._OrtReleaseTensor(de)}}return u&&!h&&(a._OrtClearBoundOutputs(u.handle),kt.set(e,[d,p,m,u,h,!1])),le}finally{a.stackRestore(T),$.forEach(W=>a._OrtReleaseTensor(W)),S.forEach(W=>a._OrtReleaseTensor(W)),I.forEach(W=>a._free(W)),x!==0&&a._OrtReleaseRunOptions(x),_.forEach(W=>a._free(W))}},zr=e=>{let t=Ie(),r=kt.get(e);if(!r)throw new Error("invalid session id");let n=r[0],o=t._OrtEndProfiling(n);o===0&&_e("Can't get an profile file name."),t._OrtFree(o)},Br=e=>{let t=[];for(let r of e){let n=r[2];!Array.isArray(n)&&"buffer"in n&&t.push(n.buffer)}return t}});var Pt,Ye,ir,dn,ln,un,To,Ao,Ht,Gt,$h,Al,El,kl,Pl,Ol,Dl,zl,Eo=U(()=>{"use strict";Ke();Hn();St();jt();Pt=()=>!!be.wasm.proxy&&typeof document<"u",ir=!1,dn=!1,ln=!1,Ao=new Map,Ht=(e,t)=>{let r=Ao.get(e);r?r.push(t):Ao.set(e,[t])},Gt=()=>{if(ir||!dn||ln||!Ye)throw new Error("worker not ready")},$h=e=>{switch(e.data.type){case"init-wasm":ir=!1,e.data.err?(ln=!0,To[1](e.data.err)):(dn=!0,To[0]()),un&&(URL.revokeObjectURL(un),un=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Ao.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Al=async()=>{if(!dn){if(ir)throw new Error("multiple calls to 'initWasm()' detected.");if(ln)throw new Error("previous call to 'initWasm()' failed.");if(ir=!0,Pt())return new Promise((e,t)=>{Ye?.terminate(),Oa().then(([r,n])=>{try{Ye=n,Ye.onerror=i=>t(i),Ye.onmessage=$h,To=[e,t];let o={type:"init-wasm",in:be};Ye.postMessage(o),un=r}catch(o){t(o)}},t)});try{await Ar(be.wasm),await Er(be),dn=!0}catch(e){throw ln=!0,e}finally{ir=!1}}},El=async e=>{if(Pt())return Gt(),new Promise((t,r)=>{Ht("init-ep",[t,r]);let n={type:"init-ep",in:{epName:e,env:be}};Ye.postMessage(n)});await kr(be,e)},kl=async e=>Pt()?(Gt(),new Promise((t,r)=>{Ht("copy-from",[t,r]);let n={type:"copy-from",in:{buffer:e}};Ye.postMessage(n,[e.buffer])})):Kt(e),Pl=async(e,t)=>{if(Pt()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Gt(),new Promise((r,n)=>{Ht("create",[r,n]);let o={type:"create",in:{model:e,options:{...t}}},i=[];e instanceof Uint8Array&&i.push(e.buffer),Ye.postMessage(o,i)})}else return Pr(e,t)},Ol=async e=>{if(Pt())return Gt(),new Promise((t,r)=>{Ht("release",[t,r]);let n={type:"release",in:e};Ye.postMessage(n)});Or(e)},Dl=async(e,t,r,n,o,i)=>{if(Pt()){if(r.some(a=>a[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(o.some(a=>a))throw new Error("pre-allocated output tensor is not supported for proxy.");return Gt(),new Promise((a,l)=>{Ht("run",[a,l]);let d=r,p={type:"run",in:{sessionId:e,inputIndices:t,inputs:d,outputIndices:n,options:i}};Ye.postMessage(p,Br(d))})}else return Dr(e,t,r,n,o,i)},zl=async e=>{if(Pt())return Gt(),new Promise((t,r)=>{Ht("end-profiling",[t,r]);let n={type:"end-profiling",in:e};Ye.postMessage(n)});zr(e)}});var Bl,_h,cn,Rl=U(()=>{"use strict";Ke();Eo();Q();Tr();Kn();Bl=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},_h=e=>{switch(e[3]){case"cpu":return new De(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Vr(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:n,dispose:o}=e[2];return De.fromGpuBuffer(r,{dataType:t,dims:e[1],download:n,dispose:o})}default:throw new Error(`invalid data location: ${e[3]}`)}},cn=class{async fetchModelAndCopyToWasmMemory(t){return kl(await Zt(t))}async loadModel(t,r){We();let n;typeof t=="string"?!1?n=await Zt(t):n=await this.fetchModelAndCopyToWasmMemory(t):n=t,[this.sessionId,this.inputNames,this.outputNames]=await Pl(n,r),Me()}async dispose(){return Ol(this.sessionId)}async run(t,r,n){We();let o=[],i=[];Object.entries(t).forEach(h=>{let w=h[0],g=h[1],b=this.inputNames.indexOf(w);if(b===-1)throw new Error(`invalid input '${w}'`);o.push(g),i.push(b)});let a=[],l=[];Object.entries(r).forEach(h=>{let w=h[0],g=h[1],b=this.outputNames.indexOf(w);if(b===-1)throw new Error(`invalid output '${w}'`);a.push(g),l.push(b)});let d=o.map((h,w)=>Bl(h,()=>`input "${this.inputNames[i[w]]}"`)),p=a.map((h,w)=>h?Bl(h,()=>`output "${this.outputNames[l[w]]}"`):null),m=await Dl(this.sessionId,i,d,l,p,n),u={};for(let h=0;h<m.length;h++)u[this.outputNames[l[h]]]=a[h]??_h(m[h]);return Me(),u}startProfiling(){}endProfiling(){zl(this.sessionId)}}});var xh,pn,Ml=U(()=>{"use strict";Ke();Eo();Rl();jt();xh=()=>{if((typeof be.wasm.initTimeout!="number"||be.wasm.initTimeout<0)&&(be.wasm.initTimeout=0),be.wasm.simd===!1&&console.warn('Deprecated property "env.wasm.simd" is set to false. non-SIMD build is no longer provided, and this setting will be ignored.'),typeof be.wasm.proxy!="boolean"&&(be.wasm.proxy=!1),typeof be.wasm.trace!="boolean"&&(be.wasm.trace=!1),typeof be.wasm.numThreads!="number"||!Number.isInteger(be.wasm.numThreads)||be.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)be.wasm.numThreads=1;else{let e=typeof navigator>"u"?Mn("node:os").cpus().length:navigator.hardwareConcurrency;be.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},pn=class{async init(t){xh(),await Al(),await El(t)}async createInferenceSessionHandler(t,r){let n=new cn;return await n.loadModel(t,r),Promise.resolve(n)}}});var Ul={};Ft(Ul,{wasmBackend:()=>Sh});var Sh,Vl=U(()=>{"use strict";Ml();Sh=new pn});Ke();Ke();Ke();var xa="1.19.0";var K_=Wn;{let e=(Vl(),br(Ul)).wasmBackend;_t("webgpu",e,5),_t("webnn",e,5),_t("cpu",e,10),_t("wasm",e,10)}Object.defineProperty(be.versions,"web",{value:xa,enumerable:!0});export{dp as InferenceSession,Sr as TRACE,We as TRACE_FUNC_BEGIN,Me as TRACE_FUNC_END,De as Tensor,cp as TrainingSession,K_ as default,be as env,_t as registerBackend};
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
//# sourceMappingURL=ort.webgpu.bundle.min.mjs.map
