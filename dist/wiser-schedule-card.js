/*! WISER-CARD-VERSION wiser-schedule-card 2.1.6 */
function e(e,t,i,s){var o,a=arguments.length,r=a<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(r=(a<3?o(r):a>3?o(t,i,r):o(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}function t(e){return t=>{customElements.get(e)||customElements.define(e,t)}}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */"function"==typeof SuppressedError&&SuppressedError;const i=globalThis,s=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),a=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(i,e,o)},l=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:d,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,m=globalThis,v=m.trustedTypes,_=v?v.emptyScript:"",y=m.reactiveElementPolyfillSupport,b=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},w=(e,t)=>!d(e,t),x={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:w};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const a=s?.call(this);o?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),o=i.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=s.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=s;const a=o.fromAttribute(t,e.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(void 0!==e){const a=this.constructor;if(!1===s&&(o=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??w)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==o||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[b("elementProperties")]=new Map,S[b("finalized")]=new Map,y?.({ReactiveElement:S}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,k=e=>e,z=$.trustedTypes,C=z?z.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+T,A=`<${P}>`,D=document,M=()=>D.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,O=Array.isArray,I="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,U=/>/g,j=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,W=/"/g,V=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),Z=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),F=new WeakMap,Y=D.createTreeWalker(D,129);function K(e,t){if(!O(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,s=[];let o,a=2===t?"<svg>":3===t?"<math>":"",r=H;for(let t=0;t<i;t++){const i=e[t];let n,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===H?"!--"===l[1]?r=L:void 0!==l[1]?r=U:void 0!==l[2]?(V.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=j):void 0!==l[3]&&(r=j):r===j?">"===l[0]?(r=o??H,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?j:'"'===l[3]?W:R):r===W||r===R?r=j:r===L||r===U?r=H:(r=j,o=void 0);const h=r===j&&e[t+1].startsWith("/>")?" ":"";a+=r===H?i+A:d>=0?(s.push(n),i.slice(0,d)+E+i.slice(d)+T+h):i+T+(-2===d?t:h)}return[K(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class J{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,a=0;const r=e.length-1,n=this.parts,[l,d]=G(e,t);if(this.el=J.createElement(l,i),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=Y.nextNode())&&n.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(E)){const t=d[a++],i=s.getAttribute(e).split(T),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?ie:"?"===r[1]?se:"@"===r[1]?oe:te}),s.removeAttribute(e)}else e.startsWith(T)&&(n.push({type:6,index:o}),s.removeAttribute(e));if(V.test(s.tagName)){const e=s.textContent.split(T),t=e.length-1;if(t>0){s.textContent=z?z.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],M()),Y.nextNode(),n.push({type:2,index:++o});s.append(e[t],M())}}}else if(8===s.nodeType)if(s.data===P)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(T,e+1));)n.push({type:7,index:o}),e+=T.length-1}o++}}static createElement(e,t){const i=D.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,s){if(t===Z)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const a=N(t)?void 0:t._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=X(e,o._$AS(e,t.values),o,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??D).importNode(t,!0);Y.currentNode=s;let o=Y.nextNode(),a=0,r=0,n=i[0];for(;void 0!==n;){if(a===n.index){let t;2===n.type?t=new ee(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new ae(o,this,e)),this._$AV.push(t),n=i[++r]}a!==n?.index&&(o=Y.nextNode(),a++)}return Y.currentNode=D,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ee{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),N(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==Z&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>O(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=F.get(e.strings);return void 0===t&&F.set(e.strings,t=new J(e)),t}k(e){O(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new ee(this.O(M()),this.O(M()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(e,t=this,i,s){const o=this.strings;let a=!1;if(void 0===o)e=X(this,e,t,0),a=!N(e)||e!==this._$AH&&e!==Z,a&&(this._$AH=e);else{const s=e;let r,n;for(e=o[0],r=0;r<o.length-1;r++)n=X(this,s[i+r],t,r),n===Z&&(n=this._$AH[r]),a||=!N(n)||n!==this._$AH[r],n===q?e=q:e!==q&&(e+=(n??"")+o[r+1]),this._$AH[r]=n}a&&!s&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends te{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class se extends te{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class oe extends te{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??q)===Z)return;const i=this._$AH,s=e===q&&i!==q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(J,ee),($.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class le extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new ee(t.insertBefore(M(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}}le._$litElement$=!0,le.finalized=!0,ne.litElementHydrateSupport?.({LitElement:le});const de=ne.litElementPolyfillSupport;de?.({LitElement:le}),(ne.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:w},he=(e=ce,t,i)=>{const{kind:s,metadata:o}=i;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pe(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return pe({...e,state:!0,attribute:!1})}var ge,me;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(ge||(ge={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(me||(me={}));var ve=function(e,t,i,s){s=s||{},i=null==i?{}:i;var o=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,e.dispatchEvent(o),o};const _e="2.1.6",ye=86400,be={low:"#ebff00",high:"#eb0000",on:"#43a047",off:"#db4437",hot_water_on:"#ff0000",hot_water_off:"#8a8a8a",lighting_off:"#8a8a8a",lighting_on:"#ffcc00",shutter_closed:"#8a8a8a",shutter_open:"#ffcc00"};var fe,we,xe;!function(e){e.Overview="OVERVIEW",e.RoomSchedule="ROOM_SCHEDULE",e.ScheduleEdit="SCHEDULE_EDIT",e.ScheduleCopy="SCHEDULE_COPY",e.ScheduleAdd="SCHEDULE_ADD"}(fe||(fe={})),function(e){e.Heating="19",e.HotWater="45",e.OnOff="Off",e.Lighting="0",e.Shutters="100"}(we||(we={})),function(e){e.Heating="°C",e.HotWater="°C",e.OnOff="",e.Lighting="%",e.Shutters="%"}(xe||(xe={}));const Se=["Heating","HotWater","OnOff","Lighting","Shutters"],$e=["Lighting","Shutters"],ke=["Weekdays","Weekend"],ze=["Monday","Tuesday","Wednesday","Thursday","Friday"],Ce=["Saturday","Sunday"],Ee=ze.concat(Ce),Te=["Sunrise","Sunset"];var Pe;!function(e){e.Sunrise="3000",e.Sunset="4000"}(Pe||(Pe={}));var Ae={version:"Version",invalid_configuration:"Invalid configuration",no_schedules:"No Schedules Found",name_required:"Name is required",loading:"Loading schedules…",retry:"Try again",load_failed:"Unable to load schedules.",integration_unavailable:"The Wiser integration is not available."},De={actions:{files:"Files",view:"View",add_schedule:"Add Schedule",export:"Export schedule",export_all:"Export all schedules",import:"Import schedule",duplicate_new:"Duplicate to new schedule",add_period:"Add period",delete_period:"Delete period",saving_schedule:"Saving schedule…",deleting_schedule:"Deleting schedule…"},labels:{setting:"Setting",assigns:"Assigns",to:"to",level:"Level",special_time:"Set special time",selected_period:"Selected period",time:"Time",fixed:"Fixed",preset:"Preset",custom_temperature:"Temperature",lower_temperature:"Lower temperature",upper_temperature:"Upper temperature",passive_schedule:"Schedule passive mode"},days:{weekdays:"Weekdays",weekend:"Weekend",all:"All"},headings:{schedule_actions:"Schedule Actions",schedule_type:"Schedule Type",schedule_id:"Schedule Id",schedule_name:"Schedule Name",schedule_assignment:"Room/Device Assignment",not_assigned:"(Not Assigned)",rename_schedule:"Rename Schedule",copy_schedule:"Copy Schedule",delete_schedule:"Delete Schedule",new_copy_name:"New schedule name"},helpers:{enter_new_name:"Enter the new name for the Schedule",select_copy_schedule:"Select the schedule to copy to",delete_schedule_confirm:"Are you sure you wish to delete the schedule",delete_schedule_failed:"Unable to delete the schedule.",save_schedule_failed:"Unable to save the schedule. Check the Home Assistant logs for details.",too_many_periods:"{day} has too many periods. Wiser allows a maximum of {max} per day.",select_a_schedule:"Select a schedule to view",add_schedule:"Select the schedule type and enter a name for the schedule to create",add_schedule_name:"Enter a name for the new schedule",no_supported_types:"No compatible schedule types are available for this device.",copy_target_missing:"Could not identify the new schedule. Check the schedules list before trying again."},rooms:{title:"Rooms",schedules:"Schedules",manage:"Manage schedules",missing:"This room or device is no longer available.",current:"Current schedule",unassigned:"No schedule assigned",choose:"Choose a schedule",no_schedules:"No compatible schedules available. Create one using + in the toolbar.",assigning:"Assigning…",assign:"Assign schedule",saved:"Schedule assigned.",view_schedule:"View / edit schedule",shared:"This schedule is shared. Editing its times affects every assigned room or device.",select:"Select a room to choose its schedule",empty:"No Wiser rooms found.",available:"Available schedule",none:"No schedule",removed:"Schedule unassigned."},moments:{title:"Moments",heating:"Room heating",description:"Preset actions for your home. Use Home Assistant automations to run them on a schedule.",loading:"Loading Moments…",failed:"Moments could not be loaded. Registry access may be restricted for this account.",empty:"No enabled Wiser Moments found for this hub. Create Moments in the Wiser app.",open:"Open controls"},home:{title:"Home",heating:"Heating",hotwater:"Hot water",devices:"Lighting & devices",empty:"No scheduled Wiser rooms or devices found.",screen:"Home screen",no_schedules:"No schedules yet. Use + to create one.",assignments:"assigned",assign_devices:"Assigned rooms / devices",apply_devices:"Apply assignments",no_devices:"No compatible devices available.",schedules:"Schedules",overview_hint:"Planned schedule changes for each device, shown in the Home Assistant timezone.",schedule_name:"Schedule name",schedule_id:"Schedule ID",schedule_type:"Schedule type",next_day:"Next day",next_change:"Next change",next_setting:"Next scheduled setting",no_next_change:"No upcoming timed change available.",overview_details:"Overview Details",device_details:"Schedule details",lighting:"Lighting",shutters:"Shutters",onoff:"On/Off",other:"Other"},editor:{hub:"Wiser hub",permissions:"Permissions",display_only:"Read-only mode",admin_only:"Only admins can manage schedules",theme_colors:"Use theme colors",temperature_colors:"Temperatures",control_colors:"Controls",hot_water_colors:"Hot water",lighting_colors:"Lighting",shutter_colors:"Shutters",low_color:"Low",high_color:"High",on_color:"On",off_color:"Off",closed_color:"Closed",open_color:"Open",reset_color:"Reset to default",hide_card_borders:"Hide card borders",display_only_help:"Prevent schedule and heating changes, including for admins.",hide_card_background:"Hide card background"},panel:{title:"Wiser Schedules",menu:"Toggle sidebar",hubs:"Wiser hubs",settings:"Panel settings",settings_for_hub:"{hub} - Panel settings",edit_settings:"Edit schedule card settings",loading:"Loading Wiser schedules…",editor_error:"Unable to open the editor. Close this dialog and try again.",save_error:"Unable to save settings to Home Assistant. Please try again.",load_error:"Unable to load Wiser schedules. Please try again.",version_error:"Wiser Schedules needs its matching schedule card build. Update the card resource and refresh the browser."},heating:{status:"Schedule status",activity:"Activity",following:"Following schedule",manual:"Manual",override:"Temporary override",boost:"Boost active",away:"Away mode",comfort:"Comfort adjustment",eco:"EcoIQ adjustment",passive:"Passive mode",passive_strategy:"Passive strategy",strategy_modulating:"Modulating",strategy_temperature_limiter:"Temperature limiter",unavailable:"Status unavailable",unassigned:"No schedule assigned",resume:"Resume schedule",failed:"Unable to change heating mode."}},Me={common:Ae,wiser:De},Ne={version:"Déclinaison",invalid_configuration:"Configuration Invalide",no_schedules:"Aucun Programme Trouvé",name_required:"Nom est obligatoire",loading:"Chargement des programmes…",retry:"Réessayer",load_failed:"Impossible de charger les programmes.",integration_unavailable:"L’intégration Wiser n’est pas disponible."},Oe={actions:{files:"Fichier",view:"Voir",add_schedule:"Ajouter un Programme",export:"Exporter le programme",export_all:"Exporter tous les programmes",import:"Importer un programme",duplicate_new:"Dupliquer dans un nouveau programme",add_period:"Ajouter une période",delete_period:"Supprimer la période",saving_schedule:"Enregistrement du programme…",deleting_schedule:"Suppression du programme…"},labels:{setting:"Paramètre",assigns:"Attribuers",to:"à",level:"Niveau",special_time:"Définir une heure spéciale",selected_period:"Période sélectionnée",time:"Heure",fixed:"Fixe",passive_schedule:"Programmer le mode passif"},days:{weekdays:"Lun à Ven",weekend:"Sam et Dim",all:"Toute"},headings:{schedule_actions:"Programmer des Actions",schedule_type:"Type de Programme",schedule_id:"Numéro de Programme",schedule_name:"Nom de Programme",schedule_assignment:"Attribuer de Programme",not_assigned:"(Non Attribué)",rename_schedule:"Renommer le Programme",copy_schedule:"Copier le Programme",delete_schedule:"Supprimer le Programme",new_copy_name:"Nom du nouveau programme"},helpers:{enter_new_name:"Entrez un nom pour le Programme",select_copy_schedule:"Sélectionnez le calendrier ci-dessous pour le copier",delete_schedule_confirm:"Êtes-vous sûr de vouloir effacer ce programme",delete_schedule_failed:"Impossible de supprimer le programme.",save_schedule_failed:"Impossible d’enregistrer le programme. Consultez les journaux de Home Assistant pour plus de détails.",too_many_periods:"{day} contient trop de périodes. Wiser autorise un maximum de {max} par jour.",select_a_schedule:"Sélectionner un programme à afficher",add_schedule:"Sélectionnez le type de programme et entrez un nom pour la programme à créer",add_schedule_name:"Saisissez un nom pour le nouveau programme",no_supported_types:"Aucun type de programme compatible avec cet appareil.",copy_target_missing:"Impossible d’identifier le nouveau programme. Vérifiez la liste avant de réessayer."},rooms:{title:"Pièces",schedules:"Programmes",manage:"Gérer les programmes",missing:"Cette pièce ou cet appareil n’est plus disponible.",current:"Programme actuel",unassigned:"Aucun programme attribué",choose:"Choisir un programme",no_schedules:"Aucun programme compatible. Créez-en un avec +.",assigning:"Attribution…",assign:"Attribuer le programme",saved:"Programme attribué.",view_schedule:"Voir / modifier le programme",shared:"Ce programme est partagé : les modifications affectent toutes les pièces et appareils associés.",select:"Sélectionnez une pièce pour choisir son programme",empty:"Aucune pièce Wiser trouvée.",available:"Programme disponible",none:"Aucun programme",removed:"Programme désaffecté."},moments:{title:"Moments",heating:"Chauffage des pièces",description:"Actions prédéfinies pour votre maison. Utilisez les automatisations Home Assistant pour les programmer.",loading:"Chargement des Moments…",failed:"Impossible de charger les Moments. L’accès aux registres peut être limité pour ce compte.",empty:"Aucun Moment Wiser activé pour ce hub. Créez des Moments dans l’application Wiser.",open:"Ouvrir les commandes"},home:{title:"Maison",heating:"Chauffage",hotwater:"Eau chaude",devices:"Éclairage et appareils",empty:"Aucune pièce ni appareil Wiser programmable trouvé.",screen:"Écran d’accueil",no_schedules:"Aucun programme. Utilisez + pour en créer un.",assignments:"affectations",assign_devices:"Pièces / appareils affectés",apply_devices:"Appliquer les affectations",no_devices:"Aucun appareil compatible disponible.",schedules:"Plannings",overview_hint:"Changements planifiés par appareil, dans le fuseau horaire de Home Assistant.",schedule_name:"Nom du planning",schedule_id:"ID du planning",schedule_type:"Type de planning",next_day:"Prochain jour",next_change:"Prochain changement",next_setting:"Prochaine consigne planifiée",no_next_change:"Aucun prochain changement horaire disponible.",overview_details:"Détails de la vue d’ensemble",device_details:"Détails du planning",lighting:"Éclairage",shutters:"Volets",onoff:"Marche/arrêt",other:"Autres"},editor:{hub:"Hub Wiser",permissions:"Autorisations",display_only:"Mode lecture seule",admin_only:"Seuls les administrateurs peuvent gérer les plannings",theme_colors:"Utiliser les couleurs du thème",temperature_colors:"Températures",control_colors:"Commandes",hot_water_colors:"Eau chaude",lighting_colors:"Éclairage",shutter_colors:"Volets",low_color:"Basse",high_color:"Haute",on_color:"Marche",off_color:"Arrêt",closed_color:"Fermé",open_color:"Ouvert",reset_color:"Rétablir la valeur par défaut",hide_card_borders:"Masquer les bordures de la carte",display_only_help:"Empêcher les modifications des plannings et du chauffage, même pour les administrateurs.",hide_card_background:"Masquer le fond de la carte"},panel:{title:"Programmes Wiser",menu:"Afficher ou masquer la barre latérale",hubs:"Hubs Wiser",settings:"Paramètres du panneau",settings_for_hub:"{hub} - Paramètres du panneau",edit_settings:"Modifier les paramètres de la carte des programmes",loading:"Chargement des programmes Wiser…",editor_error:"Impossible d’ouvrir l’éditeur. Fermez cette boîte de dialogue et réessayez.",save_error:"Impossible d’enregistrer les paramètres dans Home Assistant. Veuillez réessayer.",load_error:"Impossible de charger les programmes Wiser. Veuillez réessayer.",version_error:"La version correspondante de la carte des programmes Wiser est requise. Mettez à jour la ressource de la carte et actualisez le navigateur."},heating:{status:"État du planning",activity:"Activité",following:"Suit le planning",manual:"Manuel",override:"Dérogation temporaire",boost:"Boost actif",away:"Mode absence",comfort:"Ajustement Comfort",eco:"Ajustement EcoIQ",passive:"Mode passif",passive_strategy:"Stratégie passive",strategy_modulating:"Modulation",strategy_temperature_limiter:"Limiteur de température",unavailable:"État indisponible",unassigned:"Aucun planning attribué",resume:"Reprendre le planning",failed:"Impossible de changer le mode de chauffage."}},Ie={common:Ne,wiser:Oe},He={version:"Version",invalid_configuration:"Ungültige Konfiguration",no_schedules:"Keine Zeitpläne gefunden",name_required:"Ein Name ist erforderlich",loading:"Zeitpläne werden geladen…",retry:"Erneut versuchen",load_failed:"Zeitpläne konnten nicht geladen werden.",integration_unavailable:"Die Wiser-Integration ist nicht verfügbar."},Le={actions:{files:"Dateien",view:"Anzeigen",add_schedule:"Zeitplan hinzufügen",export:"Zeitplan exportieren",export_all:"Alle Zeitpläne exportieren",import:"Zeitplan importieren",duplicate_new:"Als neuen Zeitplan duplizieren",add_period:"Zeitraum hinzufügen",delete_period:"Zeitraum löschen",saving_schedule:"Zeitplan wird gespeichert…",deleting_schedule:"Zeitplan wird gelöscht…"},labels:{setting:"Einstellung",assigns:"Zuordnungen",to:"bis",level:"Stufe",special_time:"Besondere Zeit festlegen",selected_period:"Ausgewählter Zeitraum",time:"Zeit",fixed:"Fest",passive_schedule:"Passivmodus planen"},days:{weekdays:"Montag bis Freitag",weekend:"Wochenende",all:"Alle"},headings:{schedule_actions:"Zeitplanaktionen",schedule_type:"Zeitplantyp",schedule_id:"Zeitplan-ID",schedule_name:"Zeitplanname",schedule_assignment:"Raum-/Gerätezuordnung",not_assigned:"(Nicht zugeordnet)",rename_schedule:"Zeitplan umbenennen",copy_schedule:"Zeitplan kopieren",delete_schedule:"Zeitplan löschen",new_copy_name:"Name des neuen Zeitplans"},helpers:{enter_new_name:"Neuen Namen für den Zeitplan eingeben",select_copy_schedule:"Zielzeitplan zum Kopieren auswählen",delete_schedule_confirm:"Soll dieser Zeitplan wirklich gelöscht werden",delete_schedule_failed:"Der Zeitplan konnte nicht gelöscht werden.",save_schedule_failed:"Der Zeitplan konnte nicht gespeichert werden. Weitere Details stehen in den Home-Assistant-Protokollen.",too_many_periods:"{day} enthält zu viele Zeiträume. Wiser erlaubt maximal {max} pro Tag.",select_a_schedule:"Zeitplan zum Anzeigen auswählen",add_schedule:"Zeitplantyp auswählen und einen Namen für den neuen Zeitplan eingeben",add_schedule_name:"Namen für den neuen Zeitplan eingeben",no_supported_types:"Für dieses Gerät sind keine kompatiblen Zeitplantypen verfügbar.",copy_target_missing:"Der neue Zeitplan konnte nicht gefunden werden. Vor einem erneuten Versuch die Zeitplanliste prüfen."},rooms:{title:"Räume",schedules:"Zeitpläne",manage:"Zeitpläne verwalten",missing:"Dieser Raum oder dieses Gerät ist nicht mehr verfügbar.",current:"Aktueller Zeitplan",unassigned:"Kein Zeitplan zugeordnet",choose:"Zeitplan auswählen",no_schedules:"Keine kompatiblen Zeitpläne verfügbar. Über + in der Symbolleiste einen erstellen.",assigning:"Wird zugeordnet…",assign:"Zeitplan zuordnen",saved:"Zeitplan zugeordnet.",view_schedule:"Zeitplan anzeigen / bearbeiten",shared:"Dieser Zeitplan wird gemeinsam verwendet. Änderungen an den Zeiten wirken sich auf alle zugeordneten Räume und Geräte aus.",select:"Raum auswählen, um dessen Zeitplan festzulegen",empty:"Keine Wiser-Räume gefunden.",available:"Verfügbarer Zeitplan",none:"Kein Zeitplan",removed:"Zeitplanzuordnung aufgehoben."},moments:{title:"Momente",heating:"Raumheizung",description:"Voreingestellte Aktionen für das Zuhause. Mit Home Assistant-Automatisierungen lassen sie sich zeitgesteuert ausführen.",loading:"Momente werden geladen…",failed:"Momente konnten nicht geladen werden. Der Zugriff auf die Registrierungen ist für dieses Konto möglicherweise eingeschränkt.",empty:"Für diesen Hub wurden keine aktivierten Wiser-Momente gefunden. Momente lassen sich in der Wiser-App erstellen.",open:"Steuerung öffnen"},home:{title:"Startseite",heating:"Heizung",hotwater:"Warmwasser",devices:"Beleuchtung und Geräte",empty:"Keine Wiser-Räume oder -Geräte mit Zeitplan gefunden.",screen:"Startansicht",no_schedules:"Noch keine Zeitpläne vorhanden. Über + einen erstellen.",assignments:"zugeordnet",assign_devices:"Zugeordnete Räume / Geräte",apply_devices:"Zuordnungen übernehmen",no_devices:"Keine kompatiblen Geräte verfügbar.",schedules:"Zeitpläne",overview_hint:"Geplante Zeitplanänderungen für jedes Gerät, angezeigt in der Zeitzone von Home Assistant.",schedule_name:"Zeitplanname",schedule_id:"Zeitplan-ID",schedule_type:"Zeitplantyp",next_day:"Nächster Tag",next_change:"Nächste Änderung",next_setting:"Nächste geplante Einstellung",no_next_change:"Keine bevorstehende zeitgesteuerte Änderung verfügbar.",overview_details:"Details in der Übersicht",device_details:"Zeitplandetails",lighting:"Beleuchtung",shutters:"Rollläden",onoff:"Ein/Aus",other:"Sonstige"},editor:{hub:"Wiser-Hub",permissions:"Berechtigungen",display_only:"Nur-Lese-Modus",admin_only:"Nur Administratoren dürfen Zeitpläne verwalten",theme_colors:"Theme-Farben verwenden",temperature_colors:"Temperaturen",control_colors:"Steuerungen",hot_water_colors:"Warmwasser",lighting_colors:"Beleuchtung",shutter_colors:"Rollläden",low_color:"Niedrig",high_color:"Hoch",on_color:"Ein",off_color:"Aus",closed_color:"Geschlossen",open_color:"Offen",reset_color:"Auf Standard zurücksetzen",hide_card_borders:"Kartenrahmen ausblenden",display_only_help:"Änderungen an Zeitplänen und Heizung verhindern, auch für Administratoren.",hide_card_background:"Kartenhintergrund ausblenden"},panel:{title:"Wiser-Zeitpläne",menu:"Seitenleiste ein- oder ausblenden",hubs:"Wiser Hubs",settings:"Panel-Einstellungen",settings_for_hub:"{hub} - Panel-Einstellungen",edit_settings:"Einstellungen der Zeitplankarte bearbeiten",loading:"Wiser-Zeitpläne werden geladen…",editor_error:"Der Editor konnte nicht geöffnet werden. Schließen Sie diesen Dialog und versuchen Sie es erneut.",save_error:"Die Einstellungen konnten nicht in Home Assistant gespeichert werden. Bitte versuchen Sie es erneut.",load_error:"Die Wiser-Zeitpläne konnten nicht geladen werden. Bitte versuchen Sie es erneut.",version_error:"Für Wiser-Zeitpläne ist die passende Version der Zeitplankarte erforderlich. Aktualisieren Sie die Kartenressource und laden Sie den Browser neu."},heating:{status:"Zeitplanstatus",activity:"Aktivität",following:"Zeitplan wird befolgt",manual:"Manuell",override:"Vorübergehende Übersteuerung",boost:"Boost aktiv",away:"Abwesenheitsmodus",comfort:"Komfortanpassung",eco:"EcoIQ-Anpassung",passive:"Passiver Modus",passive_strategy:"Passivstrategie",strategy_modulating:"Modulierend",strategy_temperature_limiter:"Temperaturbegrenzer",unavailable:"Status nicht verfügbar",unassigned:"Kein Zeitplan zugeordnet",resume:"Zeitplan fortsetzen",failed:"Heizmodus konnte nicht geändert werden."}},Ue={common:He,wiser:Le},je={version:"Verzió",invalid_configuration:"Érvénytelen konfiguráció",no_schedules:"Nem találhatók időprogramok",name_required:"A név megadása kötelező",loading:"Időprogramok betöltése…",retry:"Próbálja újra",load_failed:"Nem sikerült betölteni az időprogramokat.",integration_unavailable:"A Wiser integráció nem érhető el."},Re={actions:{files:"Fájlok",view:"Megtekintés",add_schedule:"Időprogram hozzáadása",export:"Időprogram exportálása",export_all:"Összes időprogram exportálása",import:"Időprogram importálása",duplicate_new:"Másolás új időprogramként",add_period:"Időszak hozzáadása",delete_period:"Időszak törlése",saving_schedule:"Időprogram mentése…",deleting_schedule:"Időprogram törlése…"},labels:{setting:"Beállítás",assigns:"Hozzárendelések",to:"ide",level:"Szint",special_time:"Speciális időpont beállítása",selected_period:"Kiválasztott időszak",time:"Időpont",fixed:"Rögzített",passive_schedule:"Passzív mód ütemezése"},days:{weekdays:"Hétköznapok",weekend:"Hétvége",all:"Összes"},headings:{schedule_actions:"Időprogram-műveletek",schedule_type:"Időprogram típusa",schedule_id:"Időprogram azonosítója",schedule_name:"Időprogram neve",schedule_assignment:"Helyiség/eszköz hozzárendelése",not_assigned:"(Nincs hozzárendelve)",rename_schedule:"Időprogram átnevezése",copy_schedule:"Időprogram másolása",delete_schedule:"Időprogram törlése",new_copy_name:"Új időprogram neve"},helpers:{enter_new_name:"Adja meg az időprogram új nevét",select_copy_schedule:"Válassza ki a célidőprogramot a másoláshoz",delete_schedule_confirm:"Biztosan törölni szeretné az időprogramot",delete_schedule_failed:"Nem sikerült törölni az időprogramot.",save_schedule_failed:"Nem sikerült menteni az időprogramot. További részletekért tekintse meg a Home Assistant naplóit.",too_many_periods:"{day} túl sok időszakot tartalmaz. A Wiser naponta legfeljebb {max} időszakot engedélyez.",select_a_schedule:"Válasszon egy időprogramot a megtekintéshez",add_schedule:"Válassza ki az időprogram típusát, és adja meg az új időprogram nevét",add_schedule_name:"Adja meg az új időprogram nevét",no_supported_types:"Ehhez az eszközhöz nem érhető el kompatibilis időprogramtípus.",copy_target_missing:"Nem sikerült azonosítani az új időprogramot. Ellenőrizze az időprogramok listáját, mielőtt újra próbálkozna."},rooms:{title:"Helyiségek",schedules:"Időprogramok",manage:"Időprogramok kezelése",missing:"Ez a helyiség vagy eszköz már nem érhető el.",current:"Aktuális időprogram",unassigned:"Nincs hozzárendelt időprogram",choose:"Válasszon időprogramot",no_schedules:"Nem érhető el kompatibilis időprogram. Hozzon létre egyet az eszköztár + gombjával.",assigning:"Hozzárendelés…",assign:"Időprogram hozzárendelése",saved:"Időprogram hozzárendelve.",view_schedule:"Időprogram megtekintése / szerkesztése",shared:"Ez az időprogram több helyiséghez vagy eszközhöz van hozzárendelve. Az időpontok módosítása mindegyiket érinti.",select:"Válasszon helyiséget az időprogram kiválasztásához",empty:"Nem találhatók Wiser-helyiségek.",available:"Elérhető időprogram",none:"Nincs időprogram",removed:"Időprogram hozzárendelése megszüntetve."},moments:{title:"Pillanatok",heating:"Helyiségfűtés",description:"Előre beállított otthoni műveletek. A Home Assistant automatizálásaival időzítve is futtathatók.",loading:"Pillanatok betöltése…",failed:"Nem sikerült betölteni a Pillanatokat. Lehetséges, hogy ennél a fióknál korlátozott a nyilvántartáshoz való hozzáférés.",empty:"Ehhez a központhoz nem találhatók engedélyezett Wiser Pillanatok. Hozzon létre Pillanatokat a Wiser alkalmazásban.",open:"Vezérlők megnyitása"},home:{title:"Otthon",heating:"Fűtés",hotwater:"Meleg víz",devices:"Világítás és eszközök",empty:"Nem találhatók időprogrammal rendelkező Wiser-helyiségek vagy eszközök.",screen:"Kezdőképernyő",no_schedules:"Még nincsenek időprogramok. Hozzon létre egyet a + gombbal.",assignments:"hozzárendelve",assign_devices:"Hozzárendelt helyiségek / eszközök",apply_devices:"Hozzárendelések alkalmazása",no_devices:"Nem érhetők el kompatibilis eszközök.",schedules:"Időprogramok",overview_hint:"Az egyes eszközök tervezett időprogram-változásai a Home Assistant időzónájában.",schedule_name:"Időprogram neve",schedule_id:"Időprogram azonosítója",schedule_type:"Időprogram típusa",next_day:"Következő nap",next_change:"Következő változás",next_setting:"Következő ütemezett beállítás",no_next_change:"Nincs közelgő időzített változás.",overview_details:"Áttekintés részletei",device_details:"Időprogram részletei",lighting:"Világítás",shutters:"Redőnyök",onoff:"Be/Ki",other:"Egyéb"},editor:{hub:"Wiser központ",permissions:"Jogosultságok",display_only:"Csak olvasható mód",admin_only:"Csak rendszergazdák kezelhetik az időprogramokat",theme_colors:"Téma színeinek használata",temperature_colors:"Hőmérsékletek",control_colors:"Vezérlők",hot_water_colors:"Meleg víz",lighting_colors:"Világítás",shutter_colors:"Redőnyök",low_color:"Alacsony",high_color:"Magas",on_color:"Be",off_color:"Ki",closed_color:"Zárt",open_color:"Nyitott",reset_color:"Alapérték visszaállítása",hide_card_borders:"Kártyaszegélyek elrejtése",display_only_help:"Az időprogramok és a fűtés módosításának megakadályozása, rendszergazdák számára is.",hide_card_background:"Kártyaháttér elrejtése"},panel:{title:"Wiser időprogramok",menu:"Oldalsáv ki-/bekapcsolása",hubs:"Wiser központok",settings:"Panel beállításai",settings_for_hub:"{hub} – Panel beállításai",edit_settings:"Időprogramkártya beállításainak szerkesztése",loading:"Wiser időprogramok betöltése…",editor_error:"Nem sikerült megnyitni a szerkesztőt. Zárja be ezt az ablakot, majd próbálja újra.",save_error:"Nem sikerült menteni a beállításokat a Home Assistantba. Próbálja újra.",load_error:"Nem sikerült betölteni a Wiser időprogramokat. Próbálja újra.",version_error:"A Wiser időprogramokhoz a megfelelő időprogramkártya-verzió szükséges. Frissítse a kártya erőforrását, majd frissítse a böngészőoldalt."},heating:{status:"Időprogram állapota",activity:"Tevékenység",following:"Időprogram követése",manual:"Kézi",override:"Ideiglenes felülbírálás",boost:"Gyorsfelfűtés aktív",away:"Távolléti mód",comfort:"Komfortkorrekció",eco:"EcoIQ-korrekció",passive:"Passzív mód",passive_strategy:"Passzív stratégia",strategy_modulating:"Moduláló",strategy_temperature_limiter:"Hőmérséklet-korlátozó",unavailable:"Az állapot nem érhető el",unassigned:"Nincs hozzárendelt időprogram",resume:"Visszatérés az időprogramhoz",failed:"Nem sikerült módosítani a fűtési módot."}},We={common:je,wiser:Re},Ve={editor:{theme_colors:"Use theme colours",temperature_colors:"Temperatures",control_colors:"Controls",hot_water_colors:"Hot water",lighting_colors:"Lighting",shutter_colors:"Shutters",low_color:"Low",high_color:"High",on_color:"On",off_color:"Off",closed_color:"Closed",open_color:"Open",reset_color:"Reset to default"}},Be={wiser:Ve};const Ze={en:Object.freeze({__proto__:null,common:Ae,default:Me,wiser:De}),fr:Object.freeze({__proto__:null,common:Ne,default:Ie,wiser:Oe}),de:Object.freeze({__proto__:null,common:He,default:Ue,wiser:Le}),hu:Object.freeze({__proto__:null,common:je,default:We,wiser:Re}),"en-gb":Object.freeze({__proto__:null,default:Be,wiser:Ve})},qe={"wiser.labels.state":"ui.dialogs.more_info_control.state","wiser.labels.sunrise":"ui.panel.config.automation.editor.triggers.type.sun.sunrise","wiser.labels.sunset":"ui.panel.config.automation.editor.triggers.type.sun.sunset","wiser.labels.on":"component.switch.entity_component._.state.on","wiser.labels.off":"component.switch.entity_component._.state.off","wiser.labels.open":"component.cover.entity_component._.state.open","wiser.labels.closed":"component.cover.entity_component._.state.closed","wiser.labels.name":"ui.common.name","wiser.labels.start":"ui.dialogs.helper_settings.schedule.start","wiser.labels.end":"ui.dialogs.helper_settings.schedule.end","wiser.labels.temperature":"ui.dialogs.more_info_control.climate.temperature","wiser.editor.appearance":"ui.panel.profile.user_preferences_header","wiser.moments.unavailable":"state.default.unavailable","wiser.heating.off":"component.climate.entity_component._.state.off","wiser.heating.heating":"component.climate.entity_component._.state_attributes.hvac_action.state.heating","wiser.heating.idle":"component.climate.entity_component._.state_attributes.hvac_action.state.idle","wiser.days.monday":"ui.weekdays.monday","wiser.days.short.monday":"ui.components.calendar.event.repeat.weekly.weekday.mo","wiser.days.tuesday":"ui.weekdays.tuesday","wiser.days.short.tuesday":"ui.components.calendar.event.repeat.weekly.weekday.tu","wiser.days.wednesday":"ui.weekdays.wednesday","wiser.days.short.wednesday":"ui.components.calendar.event.repeat.weekly.weekday.we","wiser.days.thursday":"ui.weekdays.thursday","wiser.days.short.thursday":"ui.components.calendar.event.repeat.weekly.weekday.th","wiser.days.friday":"ui.weekdays.friday","wiser.days.short.friday":"ui.components.calendar.event.repeat.weekly.weekday.fr","wiser.days.saturday":"ui.weekdays.saturday","wiser.days.short.saturday":"ui.components.calendar.event.repeat.weekly.weekday.sa","wiser.days.sunday":"ui.weekdays.sunday","wiser.days.short.sunday":"ui.components.calendar.event.repeat.weekly.weekday.su","wiser.heating.auto":"ui.common.auto","wiser.heating.unknown":"state.default.unknown","wiser.heating.mode":"ui.card.climate.mode","wiser.heating.strategy_modulating":"component.wiser.entity.select.passive_mode_strategy.state.modulating","wiser.heating.strategy_temperature_limiter":"component.wiser.entity.select.passive_mode_strategy.state.temperature_limiter","wiser.home.overview":"panel.states","wiser.home.show":"ui.common.show","wiser.home.hide":"ui.common.hide","wiser.actions.rename":"ui.common.rename","wiser.actions.copy":"ui.common.copy","wiser.actions.add":"ui.common.add","wiser.actions.undo":"ui.common.undo","wiser.actions.redo":"ui.common.redo","wiser.panel.cancel":"ui.common.cancel","wiser.panel.save":"ui.common.save","wiser.panel.retry":"ui.common.retry","wiser.rooms.back":"ui.common.back","wiser.rooms.edit":"ui.common.edit","wiser.rooms.delete":"ui.common.delete","wiser.rooms.cancel_edit":"ui.common.cancel","wiser.rooms.save_edit":"ui.common.save"};function Fe(e,t){const i=t.split(".").reduce((e,t)=>e&&"object"==typeof e?e[t]:void 0,Ze[e]);return"string"==typeof i?i:void 0}function Ye(e,t="",i="",s){const o=(s||localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").toLowerCase().replace(/_/g,"-"),a=Fe(o,e)||Fe(o.split("-")[0],e)||Fe("en",e)||e;return t&&i?a.replace(t,i):a}function Ke(e,t,i="",s=""){var o;const a=qe[t];if(a){const t=(null==e?void 0:e.localize(a))||"";return i&&s?t.replace(i,s):t}return Ye(t,i,s,(null===(o=null==e?void 0:e.locale)||void 0===o?void 0:o.language)||(null==e?void 0:e.language))}const Ge=n`
  .tool {
    color: var(--secondary-text-color);
  }
  .tool[aria-pressed='true'],
  .tool:not(:disabled):hover {
    color: var(--primary-color);
  }
  .tool:disabled {
    color: var(--disabled-text-color);
    opacity: 1;
  }
`;let Je=class extends le{constructor(){super(...arguments),this.editable=!1,this.assigned=!1,this.busy=!1,this.error=""}text(e){return Ke(this.hass,"wiser.heating."+e)}get entity(){var e;return this.entityId?null===(e=this.hass)||void 0===e?void 0:e.states[this.entityId]:void 0}get available(){return this.entity&&!["unknown","unavailable"].includes(this.entity.state)}get canResume(){var e,t,i;const s=null===(e=this.entity)||void 0===e?void 0:e.attributes;return this.assigned&&"auto"===(null===(t=this.entity)||void 0===t?void 0:t.state)&&((null==s?void 0:s.is_boosted)||(null==s?void 0:s.is_override))&&(null===(i=null==s?void 0:s.preset_modes)||void 0===i?void 0:i.includes("Cancel Overrides"))}async change(e){var t,i,s;if(!this.hass||!this.entityId||!this.editable||this.busy||!this.available)return;if(!["auto","heat","off"].includes(e)||!(null===(t=this.entity.attributes.hvac_modes)||void 0===t?void 0:t.includes(e))||"auto"===e&&!this.assigned)return;const o=this.entityId;this.busy=!0,this.error="";try{this.entity.state!==e&&await this.hass.callService("climate","set_hvac_mode",{entity_id:o,hvac_mode:e}),"auto"===e&&(null===(s=null===(i=this.entity)||void 0===i?void 0:i.attributes.preset_modes)||void 0===s?void 0:s.includes("Cancel Overrides"))&&(this.entity.attributes.is_override||this.entity.attributes.is_boosted)&&await this.hass.callService("climate","set_preset_mode",{entity_id:o,preset_mode:"Cancel Overrides"})}catch(e){this.error=e.message||this.text("failed")}finally{this.busy=!1}}render(){var e;const t=this.entity;if(!this.hass)return B``;const i=null==t?void 0:t.attributes,s=this.passiveStrategyEntityId?null===(e=this.hass.states[this.passiveStrategyEntityId])||void 0===e?void 0:e.state:void 0,o=null==i?void 0:i.target_temperature_origin,a=this.available?this.assigned?"off"===t.state?"off":"heat"===t.state?"manual":(null==i?void 0:i.is_passive)?"passive":(null==i?void 0:i.is_boosted)?"boost":(null==i?void 0:i.is_override)?"override":{FromSchedule:"following",FromAwayMode:"away",FromComfortMode:"comfort",FromEcoIQ:"eco",FromManualOverrideDuringAway:"away",FromBoostDuringAway:"away"}[o]||"unknown":"unassigned":"unavailable",r=((null==t?void 0:t.attributes.hvac_modes)||[]).filter(e=>["auto","heat","off"].includes(e)&&("auto"!==e||this.assigned)),n=!0===(null==i?void 0:i.is_heating)||"heating"===(null==i?void 0:i.hvac_action)?this.text("heating"):!1===(null==i?void 0:i.is_heating)||"idle"===(null==i?void 0:i.hvac_action)?this.text("idle"):this.text("unknown");return B`<div class="details">
        <div class="detail" role="status">
          <span>${this.text("status")}:</span>
          <span>${this.text(a)}</span>
        </div>
        ${"passive"===a&&["modulating","temperature_limiter"].includes(s||"")?B`<div class="detail">
                <span>${this.text("passive_strategy")}:</span>
                <span>${this.text(`strategy_${s}`)}</span>
              </div>`:""}
        ${this.available?B`<div class="detail">
                <span>${this.text("activity")}:</span>
                <span>${n}</span>
              </div>`:""}
      </div>
      ${this.editable&&t?B`<ha-selector
                .hass=${this.hass}
                .label=${this.text("mode")}
                .selector=${{select:{mode:"dropdown",options:r.map(e=>({value:e,label:this.text("heat"===e?"manual":e)}))}}}
                .value=${t.state}
                .required=${!0}
                .disabled=${!this.available||this.busy}
                @value-changed=${e=>{e.stopPropagation(),this.change(e.detail.value)}}
              ></ha-selector>
              ${this.canResume?B`<ha-button .disabled=${this.busy} @click=${()=>this.change("auto")}>${this.text("resume")}</ha-button>`:""}`:""}
      ${this.error?B`<p role="alert">${this.error}</p>`:""}`}};Je.styles=n`
    :host {
      display: block;
      border-top: 1px solid var(--divider-color);
      margin-top: 12px;
      padding-top: 12px;
    }
    .details {
      display: grid;
      gap: 8px;
    }
    .detail {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      font-size: inherit;
      line-height: 1.5;
    }
    .detail > :first-child {
      color: var(--secondary-text-color);
    }
    .detail > :last-child {
      color: var(--primary-text-color);
      text-align: right;
    }
    p {
      margin: 8px 0;
      color: var(--secondary-text-color);
    }
    ha-selector {
      display: block;
      margin-top: 12px;
      max-width: 300px;
    }
  `,e([pe({attribute:!1})],Je.prototype,"hass",void 0),e([pe()],Je.prototype,"entityId",void 0),e([pe()],Je.prototype,"passiveStrategyEntityId",void 0),e([pe({type:Boolean})],Je.prototype,"editable",void 0),e([pe({type:Boolean})],Je.prototype,"assigned",void 0),e([ue()],Je.prototype,"busy",void 0),e([ue()],Je.prototype,"error",void 0),Je=e([t("wiser-heating-status")],Je);const Xe=e=>e.callWS({type:"wiser/hubs"}),Qe=(e,t)=>e.callWS({type:"wiser/suntimes",hub:t}),et=(e,t,i="")=>e.callWS({type:"wiser/schedules",hub:t,schedule_type:i}),tt=(e,t,i,s)=>e.callWS({type:"wiser/schedule/id",hub:t,schedule_type:i,schedule_id:s}),it=(e,t)=>e.callWS({type:"wiser/rooms",hub:t}),st=(e,t,i)=>e.callWS({type:"wiser/devices",device_type:i,hub:t}),ot=(e,t,i,s,o,a=!1)=>e.callWS({type:"wiser/schedule/assign",hub:t,schedule_type:i,schedule_id:s,entity_id:o,remove:a}),at=(e,t,i,s)=>e.callWS({type:"wiser/schedule/create",hub:t,schedule_type:i,name:s}),rt=(e,t,i,s,o)=>e.callWS({type:"wiser/schedule/copy",hub:t,schedule_type:i,schedule_id:s,to_schedule_id:o}),nt=(e,t,i,s,o)=>e.callWS({type:"wiser/schedule/rename",hub:t,schedule_type:i,schedule_id:s,schedule_name:o});function lt(e,t,i){ve(e,"show-dialog",{dialogTag:"wiser-dialog-error",dialogImport:()=>Promise.resolve().then(function(){return wi}),dialogParams:{title:t,error:i}})}async function dt(e,t){const[i,s,o]=await Promise.all([e.callWS({type:"config/entity_registry/list"}),e.callWS({type:"config/device_registry/list"}),t?Promise.resolve([t]):Xe(e)]),a=new Set(s.filter(e=>e.identifiers.some(([e,i])=>"wiser"===e&&i===(t||o[0]))).map(e=>e.id)),r=new Set(s.filter(e=>e.via_device_id&&a.has(e.via_device_id)).map(e=>e.id)),n=i.filter(e=>"wiser"===e.platform&&!e.disabled_by&&e.device_id&&r.has(e.device_id));return{climates:n.filter(e=>e.entity_id.startsWith("climate.")),passiveStrategies:n.filter(e=>e.entity_id.startsWith("select.")&&"passive_mode_strategy"===e.translation_key)}}let ct=class extends le{constructor(){super(...arguments),this.active="schedules",this.canAdd=!1,this.canExport=!1}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}render(){return B`${["schedules","overview"].map(e=>B`<button
            class="tool"
            type="button"
            title=${this.localize("wiser.home."+e)}
            aria-label=${this.localize("wiser.home."+e)}
            aria-pressed=${this.active===e}
            @click=${()=>this.dispatchEvent(new CustomEvent("home-view-changed",{detail:e,bubbles:!0,composed:!0}))}
          >
            <ha-icon .icon=${"schedules"===e?"mdi:calendar-clock":"mdi:view-dashboard-outline"}></ha-icon>
          </button>`)}${"schedules"===this.active?B`<button
              class="tool"
              type="button"
              title=${this.localize("wiser.actions.export_all")}
              aria-label=${this.localize("wiser.actions.export_all")}
              ?disabled=${!this.canExport}
              @click=${()=>{this.canExport&&this.dispatchEvent(new CustomEvent("exportAllSchedulesClick",{bubbles:!0,composed:!0}))}}
            >
              <ha-icon .icon=${"mdi:archive-arrow-down-outline"}></ha-icon>
            </button>`:""}<button
        class="tool"
        type="button"
        title=${this.localize("wiser.actions.add_schedule")}
        aria-label=${this.localize("wiser.actions.add_schedule")}
        ?disabled=${!this.canAdd||"schedules"!==this.active}
        @click=${()=>{this.canAdd&&"schedules"===this.active&&this.dispatchEvent(new CustomEvent("addScheduleClick",{bubbles:!0,composed:!0}))}}
      >
        <ha-icon .icon=${"mdi:plus"}></ha-icon>
      </button>`}};ct.styles=n`
    :host {
      display: inline-flex;
      gap: 6px;
    }
    button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    button[aria-pressed='true'] {
      color: var(--primary-color);
      background: var(--secondary-background-color);
      border-color: var(--secondary-text-color);
    }
    button:disabled {
      color: var(--disabled-text-color);
      opacity: 1;
      cursor: default;
    }
    button:not(:disabled):hover {
      background: var(--secondary-background-color);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    ${Ge}
  `,e([pe({attribute:!1})],ct.prototype,"hass",void 0),e([pe()],ct.prototype,"active",void 0),e([pe({type:Boolean})],ct.prototype,"canAdd",void 0),e([pe({type:Boolean})],ct.prototype,"canExport",void 0),ct=e([t("wiser-home-navigation")],ct);const ht=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];let pt=class extends le{render(){var e,t;const i=null===(e=this.config)||void 0===e?void 0:e.name,s=(null===(t=this.config)||void 0===t?void 0:t.panel_mode)||!i||["Wiser Schedule","Wiser Schedules"].includes(i)?void 0:i;return B`<header>
      ${s?B`<h2>${s}</h2>`:""}
      <slot name="heading"></slot>
      <div class="actions"><slot></slot></div>
    </header>`}};pt.styles=n`
    :host {
      display: block;
      margin-bottom: 20px;
    }
    header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      min-height: 44px;
    }
    h2 {
      margin: 0;
      min-width: 0;
      color: var(--primary-text-color);
      font-size: calc(15px + 1pt);
      font-weight: 500;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    ::slotted([slot='heading']) {
      margin: 0;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .actions {
      margin-inline-start: auto;
      min-width: 0;
      max-width: 100%;
    }
    @media (max-width: 600px) {
      .actions {
        width: 100%;
        margin-inline-start: 0;
      }
    }
  `,e([pe({attribute:!1})],pt.prototype,"config",void 0),pt=e([t("wiser-card-header")],pt);let ut=class extends le{constructor(){super(...arguments),this.hub="",this.entities=[],this.loading=!0,this.failed=!1,this.request=0}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}updated(e){(e.has("hub")||e.has("hass")&&!e.get("hass"))&&this.load()}async load(){if(!this.hass)return;const e=++this.request;this.loading=!0,this.failed=!1;try{const[t,i,s]=await Promise.all([this.hass.callWS({type:"config/entity_registry/list"}),this.hass.callWS({type:"config/device_registry/list"}),this.hub?Promise.resolve([this.hub]):Xe(this.hass)]);if(e!==this.request)return;const o=this.hub||s[0],a=new Set(i.filter(e=>e.identifiers.some(([e,t])=>"wiser"===e&&t===o)).map(e=>e.id));this.entities=t.filter(e=>{var t;return"wiser"===e.platform&&e.entity_id.startsWith("button.")&&!e.disabled_by&&!e.hidden_by&&e.device_id&&a.has(e.device_id)&&("moment"===e.translation_key||(null===(t=e.original_name)||void 0===t?void 0:t.startsWith("Moments "))||e.unique_id.includes("-button-Moments "))})}catch(t){e===this.request&&(this.entities=[],this.failed=!0)}finally{e===this.request&&(this.loading=!1)}}renderMoment(e){const t=this.hass.states[e.entity_id],i=this.hass.formatEntityName,s=null==i?void 0:i.call(this.hass,t,void 0);return B`<button
      class="moment"
      @click=${()=>ve(this,"hass-more-info",{entityId:e.entity_id})}
    >
      <ha-icon .icon=${"mdi:play-circle-outline"} aria-hidden="true"></ha-icon>
      <span
        ><strong>${s||t.attributes.friendly_name||e.original_name||e.entity_id}</strong>
        <small
          >${this.localize("unavailable"===t.state?"wiser.moments.unavailable":"wiser.moments.open")}</small
        ></span
      >
      <span aria-hidden="true">›</span>
    </button>`}render(){const e=this.entities.filter(e=>{var t;return null===(t=this.hass)||void 0===t?void 0:t.states[e.entity_id]});if(!this.loading&&!this.failed&&!e.length)return B``;let t;return t=this.loading?B`<p role="status">${this.localize("wiser.moments.loading")}</p>`:this.failed?B`<p role="status">${this.localize("wiser.moments.failed")}</p>
        <button @click=${this.load}>${this.localize("common.retry")}</button>`:B`<div class="moments">${e.map(e=>this.renderMoment(e))}</div>`,B`<section>
      <h3>${this.localize("wiser.moments.title")}</h3>
      <p>${this.localize("wiser.moments.description")}</p>
      ${t}
    </section>`}};ut.styles=n`
    :host {
      display: block;
    }
    section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--divider-color, #ddd);
    }
    h3 {
      font-size: calc(15px + 1pt);
      font-weight: 600;
      margin: 0 0 8px;
      color: var(--primary-text-color);
    }
    p {
      font-size: calc(14px + 1pt);
      line-height: 1.5;
      margin: 0 0 14px;
      color: var(--secondary-text-color);
    }
    .moments {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
      gap: 10px;
    }
    button {
      font: inherit;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      background: var(--card-background-color, white);
      padding: 14px;
      min-height: 44px;
      cursor: pointer;
    }
    .moment {
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: start;
    }
    .moment span:nth-child(2) {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    strong {
      display: block;
      font-size: calc(14px + 1pt);
      font-weight: 500;
    }
    small {
      display: block;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
    ha-icon {
      color: var(--primary-color);
      flex-shrink: 0;
    }
    button:hover {
      border-color: var(--primary-color);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }
  `,e([pe({attribute:!1})],ut.prototype,"hass",void 0),e([pe({attribute:!1})],ut.prototype,"hub",void 0),e([ue()],ut.prototype,"entities",void 0),e([ue()],ut.prototype,"loading",void 0),e([ue()],ut.prototype,"failed",void 0),ut=e([t("wiser-moments")],ut);const gt={GB:"uk",IE:"uk",MT:"uk",CY:"uk",SG:"uk",MY:"uk",HK:"uk",US:"us",CA:"us",MX:"us",AU:"au",NZ:"au",CN:"au",AR:"au",JP:"jp",CH:"ch",LI:"ch",IT:"it",FR:"fr",BE:"fr",PL:"fr",CZ:"fr",SK:"fr",DE:"de",AT:"de",NL:"de",ES:"de",PT:"de",SE:"de",NO:"de",FI:"de",IS:"de",GR:"de"};function mt(e){const t=gt[(null==e?void 0:e.trim().toUpperCase())||""];return t?`mdi:power-socket-${t}`:"mdi:power-plug"}let vt;function _t(){return customElements.get("ha-selector")?Promise.resolve():(vt||(vt=(async()=>{var e;const t=window;if(!t.loadCardHelpers)throw new Error("Home Assistant controls are not available yet. Please retry.");const i=(await t.loadCardHelpers()).createCardElement({type:"entities",entities:[]}).constructor;if(await(null===(e=i.getConfigElement)||void 0===e?void 0:e.call(i)),!customElements.get("ha-selector"))throw new Error("Home Assistant controls could not be loaded. Please retry.")})().catch(e=>{throw vt=void 0,e})),vt)}const yt="a-f\\d",bt=`#?[${yt}]{3}[${yt}]?`,ft=`#?[${yt}]{6}([${yt}]{2})?`,wt=new RegExp(`[^#${yt}]`,"gi"),xt=new RegExp(`^${bt}$|^${ft}$`,"i");function St(e,t={}){if("string"!=typeof e||wt.test(e)||!xt.test(e))throw new TypeError("Expected a valid hex string");let i=1;8===(e=e.replace(/^#/,"")).length&&(i=Number.parseInt(e.slice(6,8),16)/255,e=e.slice(0,6)),4===e.length&&(i=Number.parseInt(e.slice(3,4).repeat(2),16)/255,e=e.slice(0,3)),3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]);const s=Number.parseInt(e,16),o=s>>16,a=s>>8&255,r=255&s,n="number"==typeof t.alpha?t.alpha:i;if("array"===t.format)return[o,a,r,n];if("css"===t.format){return`rgb(${o} ${a} ${r}${1===n?"":` / ${Number((100*n).toFixed(2))}%`})`}return{red:o,green:a,blue:r,alpha:n}}const $t=Math.trunc;function kt(e){return null!=e}function zt(e){return 6===(e=String(e).replace("#","")).length&&!isNaN(Number("0x"+e))}function Ct(e){if(zt(e)){const t=St(e);return String(t.red+","+t.green+","+t.blue+","+t.alpha)}return"100,100,100"}function Et(e,t,i){const s=St(e),o=St(t),a=Math.max(0,Math.min(1,i)),r=(e,t)=>Math.floor(e+(t-e)*a);return`${r(s.red,o.red)},${r(s.green,o.green)},${r(s.blue,o.blue)},1`}function Tt(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function Pt(e,t,i,s=!1,o={}){if("Unknown"==i)return"100,100,100";const a=t.toLowerCase();if("onoff"===a&&s)return"on"===i.trim().toLowerCase()?zt(o.hot_water_on_color||"")?Ct(o.hot_water_on_color):Ct(Tt(e,"--red-color")):zt(o.hot_water_off_color||"")?Ct(o.hot_water_off_color):"138,138,138,1";if("onoff"===a)return"on"===i.trim().toLowerCase()?zt(o.on_color||"")?Ct(o.on_color):Ct(Tt(e,"--green-color")):zt(o.off_color||"")?Ct(o.off_color):Ct(Tt(e,"--red-color"));if(["lighting","shutters"].includes(a)){const e="lighting"===a?o.lighting_off_color:o.shutter_closed_color,t="lighting"===a?o.lighting_on_color:o.shutter_open_color;if(!zt(e||"")&&!zt(t||""))return(0==(r=parseInt(i))?"50,50,50":$t(50+2.05*r)+","+$t(50+1.54*r)+",0")+",1";const s="lighting"===a?be.lighting_off:be.shutter_closed,n="lighting"===a?be.lighting_on:be.shutter_open;return Et(zt(e||"")?e:s,zt(t||"")?t:n,parseInt(i)/100)}{if(-20==parseFloat(i))return"138, 138, 138";const e="hotwater"===a?65:45,t="hotwater"===a?20:-10;return Et(zt(o.low_color||"")?o.low_color:be.low,zt(o.high_color||"")?o.high_color:be.high,(parseFloat(i)-t)/(e-t))}var r}function At(e,t){return!t.display_only&&!!(t.admin_only&&e.user.is_admin||!t.admin_only)}function Dt(e,t){return 0==e.slots.length||e.slots.length-1==t?"23:59":e.slots[t+1].Time}function Mt(e,t){const i=[...Ee.slice(Ee.indexOf(e.day)),...Ee.slice(0,Ee.indexOf(e.day))].reverse();let s;for(s of i){const e=t.ScheduleData.filter(e=>e.day==s)[0];if(e&&e.slots.length>0)return e.slots[e.slots.length-1]}}function Nt(e,t,i){return-1==t?function(e,t){const i=Mt(e,t);return i?i.Setpoint:"Unknown"}(e,i):e.slots[t].Setpoint}function Ot(e){const[t,i]=e.split(":");return 3600*+t+60*+i}const It=e=>e.locale||{language:e.selectedLanguage,number_format:ge.system,time_format:me.system},Ht=t=>{class i extends t{connectedCallback(){super.connectedCallback(),this.__checkSubscribed()}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):kt(e)&&e()}this.__unsubs=void 0}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed()}hassSubscribe(){return[]}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe())}}return e([pe({attribute:!1})],i.prototype,"hass",void 0),i};async function Lt(e){await e.updateComplete,e.isConnected&&e.dispatchEvent(new CustomEvent("wiser-view-ready",{bubbles:!0,composed:!0}))}let Ut=class extends(Ht(le)){constructor(){super(...arguments),this.roomControlEntities={climates:[],passiveStrategies:[]},this.now=new Date,this.expandedDevices={},this.target_type="heating",this.openCreatedEditor=!1,this.devices=[],this.rooms=[],this.schedules=[],this.loading=!0,this.loaded=!1,this.error="",this.saving=!1,this.selected="",this.saved=!1,this.editing=!1,this.editorSaving=!1,this.editorReady=!1,this.editorCanUndo=!1,this.editorCanRedo=!1,this.editorCanAddPeriod=!1,this.editorCanDeletePeriod=!1,this.editorName="",this.requestId=0}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}connectedCallback(){super.connectedCallback(),this.clock=setInterval(()=>{this.now=new Date},3e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.clock)}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>{"wiser_updated"!==e.event||this.config.hub&&e.hub!==this.config.hub||this.saving||this.editing||this.loadData()},{type:"wiser_updated"})]}updated(e){super.updated(e),e.has("config")||e.has("hass")&&!e.get("hass")?(this.loaded=!1,this.selected="",this.saved=!1,this.loadData()):(e.has("room_id")||e.has("target_type"))&&(this.selected="",this.saved=!1,this.selectTargetSchedule())}selectTargetSchedule(){var e,t,i,s;const o=this.target;if(!o)return;const a=this.compatible(this.target_type);this.created_schedule&&a.some(e=>e.Id===this.created_schedule.Id&&e.Type===this.created_schedule.Type)?(this.selected=String(this.created_schedule.Id),this.openCreatedEditor=!0,this.dispatchEvent(new CustomEvent("createdScheduleOpened"))):"none"===this.selected||(a.length<=1?this.selected=String(null!==(t=null===(e=a[0])||void 0===e?void 0:e.Id)&&void 0!==t?t:""):a.some(e=>String(e.Id)===this.selected)||(this.selected=String(null!==(s=null===(i=this.currentSchedule(o))||void 0===i?void 0:i.Id)&&void 0!==s?s:"none")))}compatible(e){return this.schedules.filter(t=>"hotwater"===e?1e3===t.Id||"hotwater"===t.Type.toLowerCase():1e3!==t.Id&&("heating"===e?t.Type:t.SubType||t.Type).toLowerCase()===e)}get target(){return"heating"===this.target_type?this.rooms.find(e=>e.Id===this.room_id):this.devices.find(e=>e.Id===this.room_id&&e.kind===this.target_type)}currentSchedule(e,t=this.target_type){return"hotwater"===t?this.compatible(t).find(t=>t.Id===e.Id):this.compatible(t).find(t=>t.Assignments.some(t=>{var i,s;const o=t,a=null!==(i=o.id)&&void 0!==i?i:o.Id;return void 0!==a?String(a)===String(e.Id):(null!==(s=o.name)&&void 0!==s?s:o.Name)===e.Name}))}async loadData(){if(!this.hass||!this.config)return;const e=++this.requestId;this.loading=!0,this.error="";try{await _t();const[t,i,s,o,...a]=await Promise.all([it(this.hass,this.config.hub),et(this.hass,this.config.hub),Qe(this.hass,this.config.hub).catch(()=>{}),dt(this.hass,this.config.hub).catch(()=>({climates:[],passiveStrategies:[]})),...["lighting","onoff","shutters"].map(e=>st(this.hass,this.config.hub,e))]),r=await Promise.all(i.map(e=>tt(this.hass,this.config.hub,e.Type,e.Id)));if(e!==this.requestId)return;this.rooms=[...t].sort((e,t)=>e.Name.localeCompare(t.Name)),this.schedules=r,this.sun=s,this.roomControlEntities=o,this.devices=a.reduce((e,t,i)=>e.concat(t.map(e=>Object.assign(Object.assign({},e),{kind:["lighting","onoff","shutters"][i]}))),[]);const n=r.filter(e=>1e3===e.Id||"hotwater"===e.Type.toLowerCase());this.devices.unshift(...n.map(e=>({Id:e.Id,Name:n.length>1?e.Name:this.localize("wiser.home.hotwater"),kind:"hotwater"}))),this.loaded=!0,this.selectTargetSchedule()}catch(t){e===this.requestId&&(this.error=(null==t?void 0:t.message)||this.localize("common.load_failed"))}finally{e===this.requestId&&(this.loading=!1,await this.updateComplete,this.editor&&!this.editorReady||await Lt(this))}}async assign(){const e=this.target,t="none"===this.selected,i=t&&e?this.currentSchedule(e):this.compatible(this.target_type).find(e=>String(e.Id)===this.selected);if("hotwater"!==this.target_type&&e&&i&&!this.saving&&At(this.hass,this.config)){this.saving=!0,this.saved=!1,this.error="";try{await ot(this.hass,this.config.hub,i.Type,i.Id,String(e.Id),t),await this.loadData(),this.saved=!this.error}catch(e){this.error=(null==e?void 0:e.message)||this.localize("common.load_failed")}finally{this.saving=!1,await Lt(this)}}}get editor(){return this.renderRoot.querySelector("wiser-schedule-edit-card")}scheduleAction(e,t){this.dispatchEvent(new CustomEvent("scheduleAction",{detail:{schedule_type:e.Type,schedule_id:e.Id,action:t}}))}tool(e,t,i,s=!1){const o=this.localize(e);return B`<button
      class="tool"
      type="button"
      aria-label=${o}
      title=${o}
      ?disabled=${s}
      @click=${i}
    >
      <ha-icon .icon=${t} aria-hidden="true"></ha-icon>
    </button>`}render(){var e;if(!this.hass||!this.config)return B``;const t=this.target,i=void 0!==this.room_id?B`<button
            class="back"
            ?disabled=${this.saving}
            @click=${()=>this.dispatchEvent(new CustomEvent("roomsBack"))}
          >
            ← ${this.localize("wiser.rooms.back")}
          </button>`:"";if(this.loading&&!this.loaded)return B`${i}
        <div class="status" role="status">${this.localize("common.loading")}</div>`;if(this.error)return B`${i}
        <div class="status" role="alert">${this.error}</div>
        <button @click=${()=>this.loadData()}>${this.localize("common.retry")}</button>`;if(void 0!==this.room_id){if(!t)return B`${i}
          <div class="status">${this.localize("wiser.rooms.missing")}</div>`;const s=this.currentSchedule(t),o=this.compatible(this.target_type),a="hotwater"===this.target_type,r="none"===this.selected?void 0:o.find(e=>String(e.Id)===this.selected)||s,n=At(this.hass,this.config),l=this.saving||this.editing||this.editorSaving;return B`
        <input
          class="import-file"
          type="file"
          accept=".json,application/json"
          hidden
          @change=${e=>{var t,i;const s=e.target,o=null===(t=s.files)||void 0===t?void 0:t[0];s.value="",o&&(null===(i=this.editor)||void 0===i||i.importSchedule(o))}}
        />
        <wiser-card-header .config=${this.config}>
          ${this.editing?B`<input
                  slot="heading"
                  class="editable-title"
                  type="text"
                  required
                  aria-label=${this.localize("wiser.headings.schedule_name")}
                  .value=${this.editorName}
                  ?disabled=${this.editorSaving}
                  @focus=${()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.beginNameEdit()}}
                  @input=${e=>{var t;this.editorName=e.target.value,null===(t=this.editor)||void 0===t||t.updateName(this.editorName)}}
                  @change=${()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.commitNameEdit()}}
                />`:B`<h3 slot="heading">${t.Name}</h3>`}
          <div class="tools" role="toolbar" aria-label=${this.localize("wiser.headings.schedule_actions")}>
            ${this.tool("wiser.rooms.back","mdi:arrow-left",()=>{var e;return this.editing?null===(e=this.editor)||void 0===e?void 0:e.cancelClick():this.dispatchEvent(new CustomEvent("roomsBack"))},this.saving||this.editorSaving)}
            ${n&&r?this.tool("wiser.actions.export","mdi:download",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.exportSchedule()},l||!this.editorReady):""}
            ${n&&r?this.tool("wiser.actions.import","mdi:upload",()=>{var e;return null===(e=this.renderRoot.querySelector(".import-file"))||void 0===e?void 0:e.click()},l||!this.editorReady):""}
            ${n&&r?B`
                    ${this.tool("wiser.actions.undo","mdi:undo",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.undoClick()},!this.editorCanUndo||this.editorSaving)}
                    ${this.tool("wiser.actions.redo","mdi:redo",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.redoClick()},!this.editorCanRedo||this.editorSaving)}
                    ${this.tool("wiser.rooms.edit","mdi:pencil",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.editClick()},l||!this.editorReady)}
                    ${this.tool("wiser.actions.copy","mdi:content-copy",()=>this.scheduleAction(r,"copy"),l||a)}
                    ${this.editing?this.tool("wiser.actions.delete_period","mdi:delete-outline",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.deletePeriod()},!this.editorCanDeletePeriod||this.editorSaving):this.tool("wiser.rooms.delete","mdi:delete-outline",()=>{var e;null===(e=this.editor)||void 0===e||e.deleteClick()},l||!this.editorReady||a)}
                  `:""}
            ${n?B`
                    ${this.editing?this.tool("wiser.actions.add_period","mdi:plus",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.addPeriod()},!this.editorCanAddPeriod||this.editorSaving):this.tool("wiser.actions.add_schedule","mdi:plus",()=>this.dispatchEvent(new CustomEvent("addScheduleClick")),l||a)}
                  `:""}
          </div>
        </wiser-card-header>
        <p class="secondary">
          ${this.localize("wiser.rooms.current")}:
          <strong>${null!==(e=null==s?void 0:s.Name)&&void 0!==e?e:this.localize("wiser.rooms.unassigned")}</strong>
        </p>
        ${n&&!a?B`
                ${o.length>0?B`<ha-selector
                        class="schedule-picker"
                        .hass=${this.hass}
                        .label=${this.localize("wiser.rooms.choose")}
                        .selector=${{select:{mode:"dropdown",options:o.map(e=>({value:String(e.Id),label:e.Name}))}}}
                        .value=${"none"===this.selected?void 0:this.selected||void 0}
                        .required=${!1}
                        .disabled=${l}
                        @value-changed=${e=>{e.stopPropagation(),l||null!=e.detail.value&&""!==e.detail.value&&!o.some(t=>String(t.Id)===e.detail.value)||(this.selected=e.detail.value||"none",this.saved=!1)}}
                      ></ha-selector>`:1!==o.length||s?"":B`<p class="secondary">
                          ${this.localize("wiser.rooms.available")}: <strong>${o[0].Name}</strong>
                        </p>`}
                ${o.length?"":B`<p class="secondary">${this.localize("wiser.rooms.no_schedules")}</p>`}
              `:""}
        ${r?B`
                <wiser-schedule-edit-card
                  .hass=${this.hass}
                  .config=${this.config}
                  .embedded=${!0}
                  .schedule_id=${r.Id}
                  .schedule_type=${r.Type}
                  @editor-state=${e=>{var t;this.editing=e.detail.editing,this.editorSaving=e.detail.saving,this.editorReady=e.detail.ready,this.editorCanUndo=e.detail.canUndo,this.editorCanRedo=e.detail.canRedo,this.editorCanAddPeriod=e.detail.canAddPeriod,this.editorCanDeletePeriod=e.detail.canDeletePeriod,this.editorName=e.detail.name,this.openCreatedEditor&&e.detail.ready&&!e.detail.editing&&(this.openCreatedEditor=!1,null===(t=this.editor)||void 0===t||t.editClick())}}
                  @scheduleDeleted=${()=>{this.selected="",this.loadData()}}
                >
                </wiser-schedule-edit-card>
              `:""}
        ${this.saved?B`<p role="status">${this.localize("none"===this.selected?"wiser.rooms.removed":"wiser.rooms.saved")}</p>`:""}
        ${r&&r.Assignments.length>1?B`<p class="secondary">${this.localize("wiser.rooms.shared")}</p>`:""}
        ${this.saving?B`<p role="status">${this.localize("wiser.rooms.assigning")}</p>`:""}
        ${!n||a||this.editing?"":B`<div class="save-actions">
                <ha-button
                  .disabled=${l||!this.selected||("none"===this.selected?!s:this.selected===String(null==s?void 0:s.Id))}
                  @click=${()=>this.assign()}
                  >${this.localize("wiser.rooms.save_edit")}</ha-button
                >
              </div>`}
      `}const s=[{title:"heating",items:this.rooms.map(e=>Object.assign(Object.assign({},e),{kind:"heating"}))},{title:"hotwater",items:this.devices.filter(e=>"hotwater"===e.kind)},...["lighting","shutters","onoff"].map(e=>({title:e,items:this.devices.filter(t=>t.kind===e)}))];return B`
      <wiser-card-header .config=${this.config}>
        <h3 slot="heading">${this.localize("wiser.home.overview")}</h3>
        <wiser-home-navigation
          .hass=${this.hass}
          active="overview"
          @home-view-changed=${e=>{if("overview"!==e.detail)return;e.stopPropagation();const t=Array.from(this.renderRoot.querySelectorAll(".details-toggle:not(:disabled)")),i=t.some(e=>"true"!==e.getAttribute("aria-expanded"));this.expandedDevices=Object.assign(Object.assign({},this.expandedDevices),t.reduce((e,t)=>(e[t.dataset.key]=i,e),{})),Lt(this)}}
        ></wiser-home-navigation
      ></wiser-card-header>
      ${"overview"!==this.config.home_screen||!1!==this.config.overview_details?B`<p class="secondary">${this.localize("wiser.home.overview_hint")}</p>`:""}
      ${s.filter(e=>e.items.length).map(e=>B` <section>
              <h3 class="section-heading">${this.localize("wiser.home."+e.title)}</h3>
              <div class="overview-grid">${e.items.map(e=>this.renderDeviceOverview(e))}</div>
            </section>`)}
      ${this.rooms.length||this.devices.length?"":B`<p class="secondary">${this.localize("wiser.home.empty")}</p>`}
      <wiser-moments .hass=${this.hass} .hub=${this.config.hub||""}></wiser-moments>
    `}renderDeviceOverview(e){var t,i,s,o;const a=this.currentSchedule(e,e.kind),r=a?function(e,t,i,s){var o;const a=new Intl.DateTimeFormat("en-GB",{timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).formatToParts(t),r=e=>{var t;return Number(null===(t=a.find(t=>t.type===e))||void 0===t?void 0:t.value)},n=Date.UTC(r("year"),r("month")-1,r("day")),l=3600*r("hour")+60*r("minute")+r("second");for(let t=0;t<=7;t++){const i=new Date(n+864e5*t),a=ht[i.getUTCDay()],r=((null===(o=e.ScheduleData.find(e=>e.day.toLowerCase()===a.toLowerCase()))||void 0===o?void 0:o.slots)||[]).map(e=>{var o;let r=e.Time;if("sunrise"===r.toLowerCase()||"sunset"===r.toLowerCase()){const e="sunrise"===r.toLowerCase()?null==s?void 0:s.Sunrises:null==s?void 0:s.Sunsets;r=(null===(o=null==e?void 0:e.find(e=>e.day.toLowerCase()===a.toLowerCase()))||void 0===o?void 0:o.time)||""}const n=/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(r);if(!n)return;const[,d,c,h="0"]=n,p=3600*Number(d)+60*Number(c)+Number(h);return Number(d)>23||Number(c)>59||Number(h)>59||!t&&p<=l?void 0:{day:a,date:i.toISOString().slice(0,10),time:`${d.padStart(2,"0")}:${c}`,setpoint:e.Setpoint,seconds:p}}).filter(e=>Boolean(e)).sort((e,t)=>e.seconds-t.seconds);if(r.length)return r[0]}}(a,this.now,this.hass.config.time_zone||"UTC",this.sun):void 0,n=r?`${r.setpoint}${["heating","hotwater"].includes(e.kind)&&Number.isFinite(Number(r.setpoint))?"°C":["lighting","shutters"].includes(e.kind)?"%":""}`:"",l=`${e.kind}-${e.Id}`,d=null!==(t=this.expandedDevices[l])&&void 0!==t?t:"overview"!==this.config.home_screen||!1!==this.config.overview_details,c=(e,t)=>B`<div>
        <dt>${this.localize("wiser.home."+e)}</dt>
        <dd>${t}</dd>
      </div>`;return B`<article class="device-overview">
      <div class="device-heading">
        <button
          class="details-toggle"
          type="button"
          data-key=${l}
          aria-label=${this.localize("wiser.home.device_details")+": "+e.Name}
          title=${this.localize("wiser.home.device_details")}
          aria-expanded=${Boolean((a||"heating"===e.kind)&&d)}
          aria-controls=${"details-"+l}
          ?disabled=${!a&&"heating"!==e.kind}
          @click=${()=>{this.expandedDevices=Object.assign(Object.assign({},this.expandedDevices),{[l]:!d}),Lt(this)}}
        >
          <ha-icon
            .icon=${{heating:"mdi:home-thermometer-outline",hotwater:"mdi:water-boiler",lighting:"mdi:lightbulb-outline",onoff:mt(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.country),shutters:"mdi:window-shutter"}[e.kind]}
          ></ha-icon>
        </button>
        <button
          class="overview-device"
          type="button"
          @click=${()=>this.dispatchEvent(new CustomEvent("roomClick",{detail:{id:e.Id,kind:e.kind}}))}
        >
          <span class="device-summary"
            ><strong>${e.Name}</strong
            ><span class="secondary">${(null==a?void 0:a.Name)||this.localize("wiser.rooms.unassigned")}</span></span
          ><span aria-hidden="true">›</span>
        </button>
      </div>
      ${a?B`<div class="device-details" id=${"details-"+l} ?hidden=${!d}>
              <dl>
                ${c("schedule_name",a.Name)}${c("schedule_id",a.Id)}
                ${c("schedule_type",a.SubType||a.Type)}
                ${r?B`${c("next_day",this.localize("wiser.days."+r.day.toLowerCase()))}${c("next_change",new Intl.DateTimeFormat((null===(o=this.hass.locale)||void 0===o?void 0:o.language)||"en",{year:"numeric",month:"short",day:"numeric",timeZone:"UTC"}).format(new Date(r.date+"T00:00:00Z"))+" · "+r.time)}${c("next_setting",n)}`:B`<p class="secondary">${this.localize("wiser.home.no_next_change")}</p>`}
              </dl>
              ${"heating"===e.kind?this.renderHeating(e,!0):""}
            </div>`:"heating"===e.kind?B`<div class="device-details" id=${"details-"+l} ?hidden=${!d}>
                ${this.renderHeating(e,!1)}
              </div>`:""}
    </article>`}renderHeating(e,t){const i=function(e,t,i){const s=t.climates.filter(t=>{var s;return(null===(s=e.states[t.entity_id])||void 0===s?void 0:s.attributes.name)===i});if(1!==s.length)return{};const o=s[0],a=t.passiveStrategies.filter(e=>e.device_id===o.device_id);return{climate:o.entity_id,passiveStrategy:1===a.length?a[0].entity_id:void 0}}(this.hass,this.roomControlEntities,e.Name);return B`<wiser-heating-status
      .hass=${this.hass}
      .entityId=${i.climate}
      .passiveStrategyEntityId=${i.passiveStrategy}
      .editable=${At(this.hass,this.config)}
      .assigned=${t}
    ></wiser-heating-status>`}};function jt(e,t=""){const i=e.replace(/[^a-z0-9_-]/gi,"_")||"schedule",s=t.replace(/[^a-z0-9_-]/gi,"_");return`${s?`${s}-`:""}${i}.json`}function Rt(e){const t=!0===e.PassiveRange,i=!0===e.PassiveControl,s=t||i,o=e.ScheduleData.map(e=>({day:e.day,slots:e.slots.map(e=>{const t=Te.includes(e.SpecialTime)?e.SpecialTime:Te.includes(e.Time)?e.Time:"";return Object.assign(Object.assign(Object.assign({Time:t||e.Time,Setpoint:e.Setpoint},s?{UpperSetpoint:e.UpperSetpoint}:{}),i?{PassiveScheduled:Boolean(e.PassiveScheduled),PassiveMode:e.PassiveMode,PassiveStrategy:e.PassiveStrategy}:{}),{SpecialTime:t})})}));return JSON.stringify({format:"wiser-schedule",version:s?2:1,schedule:Object.assign(Object.assign(Object.assign({Name:e.Name,Type:e.Type,SubType:e.SubType},t?{PassiveRange:!0}:{}),i?{PassiveControl:!0}:{}),{ScheduleData:o})},null,2)}Ut.styles=n`
    .device-heading {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .device-heading .details-toggle {
      flex: 0 0 44px;
      padding: 0;
      width: 44px;
      border: 0;
      background: transparent;
      color: var(--primary-color);
    }
    .device-heading .overview-device {
      border: 0;
      background: transparent;
      padding: 8px;
      min-width: 0;
    }
    .overview-grid {
      align-items: start;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
      gap: 12px;
    }
    .device-overview {
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      padding: 16px;
      background: var(--card-background-color);
      min-width: 0;
    }
    .overview-device {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      text-align: start;
    }
    .device-summary {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .device-summary {
      flex: 1;
      overflow-wrap: anywhere;
    }
    .overview-device ha-icon {
      color: var(--primary-color);
    }
    dl {
      margin: 12px 0 0;
    }
    dl > div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 0;
    }
    dt {
      color: var(--secondary-text-color);
    }
    dd {
      margin: 0;
      text-align: end;
      overflow-wrap: anywhere;
    }

    :host {
      display: block;
      color: var(--primary-text-color);
      --wiser-schedule-picker-width: clamp(260px, 20vw, 420px);
    }
    section + section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--divider-color, #ddd);
    }
    .room-heading {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .tools {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-inline-start: auto;
    }
    .tool {
      width: 44px;
      padding: 0;
      display: grid;
      place-items: center;
      color: var(--secondary-text-color);
    }
    .tool:disabled {
      color: var(--disabled-text-color);
      opacity: 1;
    }
    .tool:not(:disabled):hover {
      color: var(--primary-color);
    }
    @media (max-width: 600px) {
      .tools {
        width: 100%;
        flex-wrap: nowrap;
        justify-content: space-between;
        gap: 2px;
        margin-inline-start: 0;
      }
      .tool {
        flex: 1 1 0;
        width: auto;
        min-width: 0;
        max-width: 44px;
        min-height: 40px;
        padding: 0;
      }
    }

    h3 {
      margin: 16px 0 8px;
      font-size: calc(22px + 1pt);
    }
    h3[slot='heading'] {
      margin: 0;
    }
    input.editable-title {
      display: block;
      width: 420px;
      max-width: 100%;
      height: 28px;
      min-height: 28px;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: var(--primary-text-color);
      font-size: calc(22px + 1pt);
      font-weight: 700;
      line-height: normal;
      border: 0;
      border-bottom: 1px solid var(--divider-color);
      border-radius: 0;
      background: transparent;
    }
    @media (min-width: 601px) and (max-width: 900px) {
      input.editable-title {
        width: 80px;
      }
    }
    @media (max-width: 600px) {
      input.editable-title {
        width: 100%;
      }
    }
    .section-heading {
      font-size: calc(15px + 1pt);
      font-weight: 600;
      margin: 0 0 8px;
    }
    .intro,
    .secondary {
      color: var(--secondary-text-color);
      font-size: calc(14px + 1pt);
      line-height: 1.5;
    }
    .intro {
      margin: 0 0 16px;
    }
    button,
    select {
      font: inherit;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      background: var(--card-background-color, white);
      min-height: 44px;
      padding: 10px 14px;
    }
    button {
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button:not(:disabled):hover {
      border-color: var(--primary-color);
    }
    button:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }
    .back {
      border: 0;
      background: none;
      color: var(--primary-color);
      padding-inline-start: 0;
    }
    .schedule-picker {
      display: block;
      width: min(100%, var(--wiser-schedule-picker-width));
      max-width: none;
      margin: 20px 0 12px;
    }
    @media (max-width: 600px) {
      .schedule-picker {
        width: 100%;
      }
    }
    label {
      display: grid;
      gap: 8px;
      margin: 20px 0 12px;
      font-size: calc(14px + 1pt);
    }
    select {
      width: 100%;
      box-sizing: border-box;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: transparent;
    }
    .schedule-link {
      margin-top: 24px;
      border-top: 1px solid var(--divider-color, #ddd);
      padding-top: 16px;
    }
    .status {
      padding: 24px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .save-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }
    ${Ge}
  `,e([pe({attribute:!1})],Ut.prototype,"config",void 0),e([ue()],Ut.prototype,"roomControlEntities",void 0),e([ue()],Ut.prototype,"sun",void 0),e([ue()],Ut.prototype,"now",void 0),e([ue()],Ut.prototype,"expandedDevices",void 0),e([pe({attribute:!1})],Ut.prototype,"room_id",void 0),e([pe({attribute:!1})],Ut.prototype,"target_type",void 0),e([pe({attribute:!1})],Ut.prototype,"created_schedule",void 0),e([ue()],Ut.prototype,"devices",void 0),e([ue()],Ut.prototype,"rooms",void 0),e([ue()],Ut.prototype,"schedules",void 0),e([ue()],Ut.prototype,"loading",void 0),e([ue()],Ut.prototype,"loaded",void 0),e([ue()],Ut.prototype,"error",void 0),e([ue()],Ut.prototype,"saving",void 0),e([ue()],Ut.prototype,"selected",void 0),e([ue()],Ut.prototype,"saved",void 0),e([ue()],Ut.prototype,"editing",void 0),e([ue()],Ut.prototype,"editorSaving",void 0),e([ue()],Ut.prototype,"editorReady",void 0),e([ue()],Ut.prototype,"editorCanUndo",void 0),e([ue()],Ut.prototype,"editorCanRedo",void 0),e([ue()],Ut.prototype,"editorCanAddPeriod",void 0),e([ue()],Ut.prototype,"editorCanDeletePeriod",void 0),e([ue()],Ut.prototype,"editorName",void 0),Ut=e([t("wiser-room-schedules")],Ut);const Wt=new TextEncoder;function Vt(e){let t=4294967295;for(const i of e){t^=i;for(let e=0;e<8;e++)t=t>>>1^(1&t?3988292384:0)}return(4294967295^t)>>>0}function Bt(e){const t=new Uint8Array(new ArrayBuffer(e.reduce((e,t)=>e+t.length,0)));let i=0;for(const s of e)t.set(s,i),i+=s.length;return t}function Zt(e){const t=[],i=[],s=(o=new Date,{date:Math.max(1980,o.getFullYear())-1980<<9|o.getMonth()+1<<5|o.getDate(),time:o.getHours()<<11|o.getMinutes()<<5|Math.floor(o.getSeconds()/2)});var o;let a=0;for(const o of e){const e=Wt.encode(o.name),r=Wt.encode(o.contents),n=Vt(r),l=new Uint8Array(30+e.length),d=new DataView(l.buffer);d.setUint32(0,67324752,!0),d.setUint16(4,20,!0),d.setUint16(6,2048,!0),d.setUint16(8,0,!0),d.setUint16(10,s.time,!0),d.setUint16(12,s.date,!0),d.setUint32(14,n,!0),d.setUint32(18,r.length,!0),d.setUint32(22,r.length,!0),d.setUint16(26,e.length,!0),l.set(e,30),t.push(l,r);const c=new Uint8Array(46+e.length),h=new DataView(c.buffer);h.setUint32(0,33639248,!0),h.setUint16(4,20,!0),h.setUint16(6,20,!0),h.setUint16(8,2048,!0),h.setUint16(10,0,!0),h.setUint16(12,s.time,!0),h.setUint16(14,s.date,!0),h.setUint32(16,n,!0),h.setUint32(20,r.length,!0),h.setUint32(24,r.length,!0),h.setUint16(28,e.length,!0),h.setUint32(42,a,!0),c.set(e,46),i.push(c),a+=l.length+r.length}const r=Bt(i),n=new Uint8Array(22),l=new DataView(n.buffer);l.setUint32(0,101010256,!0),l.setUint16(8,e.length,!0),l.setUint16(10,e.length,!0),l.setUint32(12,r.length,!0),l.setUint32(16,a,!0);const d=Bt([...t,r,n]);return new Blob([d.buffer],{type:"application/zip"})}let qt=class extends(Ht(le)){constructor(){super(...arguments),this.schedules=[],this.loading=!0,this.exporting=!1,this.error="",this.request=0}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>{"wiser_updated"!==e.event||this.config.hub&&e.hub!==this.config.hub||this.load()},{type:"wiser_updated"})]}updated(e){super.updated(e),(e.has("config")||e.has("hass")&&!e.get("hass"))&&this.load()}async load(){if(!this.hass||!this.config)return;const e=++this.request;this.error="";try{const t=await et(this.hass,this.config.hub);e===this.request&&(this.schedules=[...t].sort((e,t)=>e.Name.localeCompare(t.Name)))}catch(t){e===this.request&&(this.error=t.message||this.localize("common.load_failed"))}finally{e===this.request&&(this.loading=!1,await Lt(this))}}category(e){if(1e3===e.Id||"hotwater"===e.Type.toLowerCase())return"hotwater";return{heating:"heating",lighting:"lighting",light:"lighting",shutters:"shutters",shutter:"shutters",onoff:"onoff"}[(e.SubType||e.Type).toLowerCase()]||"other"}async exportAllSchedules(){if(this.hass&&!this.exporting&&At(this.hass,this.config)&&this.schedules.length){this.exporting=!0;try{const e=await Promise.all(this.schedules.map(e=>tt(this.hass,this.config.hub,e.Type,e.Id))),t=new Map,i=e.map(e=>{const i=jt(e.Name,e.SubType||e.Type),s=(t.get(i.toLowerCase())||0)+1;t.set(i.toLowerCase(),s);return{name:1===s?i:i.replace(/\.json$/,`-${s}.json`),contents:Rt(e)}}),s=URL.createObjectURL(Zt(i)),o=document.createElement("a");o.href=s,o.download=`${(this.config.hub||"wiser").replace(/[^a-z0-9_-]/gi,"_")||"wiser"}-schedules.zip`,o.click(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}catch(e){lt(this,this.localize("wiser.actions.export_all"),e.message)}finally{this.exporting=!1}}}render(){return this.hass?B`
      <wiser-card-header .config=${this.config}>
        <h3 slot="heading">${this.localize("wiser.rooms.schedules")}</h3>
        <div class="home-tools" role="toolbar" aria-label="Home">
          <wiser-home-navigation
            .hass=${this.hass}
            active="schedules"
            .canAdd=${At(this.hass,this.config)&&!this.loading&&!this.error}
            .canExport=${At(this.hass,this.config)&&!this.loading&&!this.error&&!this.exporting&&this.schedules.length>0}
            @exportAllSchedulesClick=${this.exportAllSchedules}
          ></wiser-home-navigation></div
      ></wiser-card-header>
      ${this.error?B`<p role="alert">${this.error}</p>
              <button @click=${this.load}>${this.localize("common.retry")}</button>`:this.loading?B`<p role="status">${this.localize("common.loading")}</p>`:this.schedules.length?B`${["heating","hotwater","lighting","shutters","onoff","other"].map(e=>{const t=this.schedules.filter(t=>this.category(t)===e);return t.length?B`<section data-category=${e}>
                        <h4>${this.localize("wiser.home."+e)}</h4>
                        <div class=${"list"===this.config.view_type?"tiles list":"tiles"}>
                          ${t.map(t=>B`<button
                                class="schedule-tile"
                                @click=${()=>this.dispatchEvent(new CustomEvent("scheduleClick",{detail:t}))}
                              >
                                <ha-icon
                                  .icon=${1e3===t.Id||"hotwater"===t.Type.toLowerCase()?"mdi:water-boiler":"mdi:calendar-clock"}
                                ></ha-icon>
                                <span
                                  ><strong>${t.Name}</strong
                                  ><small
                                    >${this.localize("wiser.home."+e)} · ${t.Assignments}
                                    ${this.localize("wiser.home.assignments")}</small
                                  ></span
                                ><span aria-hidden="true">›</span>
                              </button>`)}
                        </div>
                      </section>`:""})}`:B`<p>${this.localize("wiser.home.no_schedules")}</p>`}
    `:B``}};function Ft(e){if(e.match(/^([0-9:]+)$/)){const t=e.split(":").map(Number);return 3600*t[0]+60*t[1]+(t[2]||0)}const t=new Date(e);return 3600*t.getHours()+60*t.getMinutes()+t.getSeconds()}function Yt(e){const t=Math.floor(e/3600);e-=3600*t;const i=Math.floor(e/60);e-=60*i;const s=Math.round(e);return String(t%24).padStart(2,"0")+":"+String(i).padStart(2,"0")+":"+String(s).padStart(2,"0")}function Kt(e){const t=Math.floor(e/3600);e-=3600*t;const i=Math.floor(e/60);return String(t%24).padStart(2,"0")+":"+String(i).padStart(2,"0")}function Gt(e,t,i={wrapAround:!0}){let s=e>=0?Math.floor(e/3600):Math.ceil(e/3600),o=Math.floor((e-3600*s)/60);o%t!=0&&(o=Math.round(o/t)*t),o>=60?(s++,o-=60):o<0&&(s--,o+=60),i.wrapAround&&(s>=24?s-=24:s<0&&(s+=24));const a=3600*s+60*o;if(i.maxHours){if(a>3600*i.maxHours)return 3600*i.maxHours;if(a<3600*-i.maxHours)return 3600*-i.maxHours}return a}qt.styles=n`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    section + section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--divider-color);
    }
    h4 {
      margin: 0 0 8px;
      font-size: calc(15px + 1pt);
      font-weight: 600;
    }
    .home-tools {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    h3 {
      margin: 0;
      font-size: calc(22px + 1pt);
    }
    button {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 14px;
      min-height: 44px;
      cursor: pointer;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }
    button:hover {
      border-color: var(--primary-color);
    }
    ha-icon {
      color: var(--primary-color);
      flex-shrink: 0;
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
      gap: 10px;
    }
    .tiles.list {
      grid-template-columns: 1fr;
    }
    .schedule-tile {
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: start;
      min-height: 82px;
    }
    .schedule-tile span:first-of-type {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    strong {
      display: block;
      font-weight: 500;
    }
    small {
      display: block;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
  `,e([pe({attribute:!1})],qt.prototype,"config",void 0),e([ue()],qt.prototype,"schedules",void 0),e([ue()],qt.prototype,"loading",void 0),e([ue()],qt.prototype,"exporting",void 0),e([ue()],qt.prototype,"error",void 0),qt=e([t("wiser-schedules-home")],qt);const Jt=n`
  button {
    font: inherit;
    color: var(--primary-color, #16859a);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 10px;
    min-height: 44px;
    padding: 8px 14px;
    margin: 3px 0;
    cursor: pointer;
  }
  button:not(:disabled):hover {
    background: var(--secondary-background-color, #eee);
  }
  button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  button[appearance='filled'],
  button.active {
    background: var(--primary-color);
    color: var(--text-primary-color, white);
  }
  button[variant='danger'] {
    color: var(--error-color, #c33);
  }
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
  }
  input {
    font: inherit;
    accent-color: var(--primary-color);
  }
  input[type='text'] {
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    border: 1px solid var(--divider-color, #aaa);
    border-radius: 10px;
    padding: 10px 12px;
    background: var(--card-background-color, white);
    color: var(--primary-text-color);
  }
  input[type='checkbox'] {
    width: 22px;
    height: 22px;
  }
  input[type='range'] {
    width: 100%;
    min-height: 44px;
  }
  label.schedule-name {
    display: grid;
    gap: 8px;
  }
  progress {
    width: 36px;
    height: 6px;
    accent-color: var(--primary-color);
  }
  button svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
    pointer-events: none;
  }
`,Xt=n`
  ${Jt}
  :host {
    display: block;
    color: var(--primary-text-color);
  }
  ha-textfield {
    width: 100%;
  }
  ha-button {
    margin: 3px 0;
  }
  .card-actions {
    margin-top: 20px;
  }
  ha-button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
  }
  .card-header .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
  }
  .card-header ha-switch {
    padding: 5px;
  }
  .card-header ha-icon-button {
    position: absolute;
    right: 6px;
    top: 6px;
  }
  .card-content {
    flex: 1;
  }
  .card-content > *:first-child {
    margin-top: 0;
  }
  .card-content > *:last-child {
    margin-bottom: 0;
  }
  div.text-field,
  div.secondary {
    color: var(--secondary-text-color);
  }
  .disabled {
    color: var(--disabled-text-color);
  }
  div.header {
    color: var(--secondary-text-color);
    text-transform: uppercase;
    font-weight: 500;
    font-size: calc(12px + 1pt);
    margin: 20px 0px 0px 0px;
    display: flex;
    flex-direction: row;
  }
  div.header .switch {
    text-transform: none;
    font-weight: normal;
    font-size: calc(14px + 1pt);
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
  }
  div.header ha-switch {
    display: flex;
    align-self: center;
    margin: 0px 8px;
    line-height: 24px;
  }
  mwc-button {
    margin: 2px 0px;
  }
  mwc-button.active {
    background: var(--primary-color);
    --mdc-theme-primary: var(--text-primary-color);
    border-radius: 4px;
  }
  mwc-button ha-icon {
    margin-right: 11px;
  }
  mwc-button.warning {
    --mdc-theme-primary: var(--error-color);
  }
  div.checkbox-container {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    grid-template-rows: min-content;
    grid-template-areas: 'checkbox slider value';
    grid-gap: 0px 10px;
  }
  div.checkbox-container div.checkbox {
    grid-area: checkbox;
    display: flex;
    align-items: center;
  }
  div.checkbox-container div.slider {
    grid-area: slider;
    display: flex;
    align-items: center;
  }
  div.checkbox-container div.value {
    grid-area: value;
    min-width: 40px;
    display: flex;
    align-items: center;
  }
  a {
    color: var(--primary-color);
  }
  a:visited {
    color: var(--accent-color);
  }
`;var Qt="M3.28,2L2,3.27L4.77,6.04L5.64,7.39L4.22,9.6L5.95,10.5L7.23,8.5L10.73,12H4A2,2 0 0,0 2,14V22H4V20H18.73L20,21.27V22H22V20.73L22,20.72V20.72L3.28,2M7,17A1,1 0 0,1 6,18A1,1 0 0,1 5,17V15A1,1 0 0,1 6,14A1,1 0 0,1 7,15V17M11,17A1,1 0 0,1 10,18A1,1 0 0,1 9,17V15A1,1 0 0,1 10,14A1,1 0 0,1 11,15V17M15,17A1,1 0 0,1 14,18A1,1 0 0,1 13,17V15C13,14.79 13.08,14.61 13.18,14.45L15,16.27V17M16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5M22,14V18.18L19,15.18V15A1,1 0 0,0 18,14C17.95,14 17.9,14 17.85,14.03L15.82,12H20C21.11,12 22,12.9 22,14M11.64,7.3L10.22,5.1L12.22,2L13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L12.84,9L11.44,7.62L11.64,7.3M7.5,3.69L6.1,2.28L6.22,2.09L7.95,3L7.5,3.69Z";let ei=class extends le{localize(e,t="",i=""){return Ke(this.hass,e,t,i)}async showDialog(e){this._params=e,await this.updateComplete}async closeDialog(){const e=this._params;this._params=void 0,null==e||e.cancel()}render(){var e;return this._params?B`
      <ha-dialog
        open
        header-title=${this.localize("wiser.headings.delete_schedule")}
        .heading=${this.localize("wiser.headings.delete_schedule")}
        @closed=${this.closeDialog}
        @close-dialog=${this.closeDialog}
      >
        <div class="wrapper">
          ${this.localize("wiser.helpers.delete_schedule_confirm")+" "+this._params.name+"?"}
        </div>
        <div
          class="actions"
          slot=${"headerTitle"in((null===(e=customElements.get("ha-dialog"))||void 0===e?void 0:e.prototype)||{})?"footer":q}
        >
          <ha-button appearance="plain" @click=${this.cancelClick}>${this.hass.localize("ui.common.cancel")}</ha-button>
          <ha-button variant="danger" @click=${this.confirmClick}>${this.hass.localize("ui.common.delete")}</ha-button>
        </div>
      </ha-dialog>
    `:B``}confirmClick(){const e=this._params;this._params=void 0,null==e||e.confirm()}cancelClick(){this.closeDialog()}static get styles(){return n`
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 16px;
      }
      div.wrapper {
        color: var(--primary-text-color);
      }
    `}};e([pe({attribute:!1})],ei.prototype,"hass",void 0),e([ue()],ei.prototype,"_params",void 0),ei=e([t("wiser-dialog-delete-confirm")],ei);var ti=Object.freeze({__proto__:null,get DialogDeleteConfirm(){return ei}}),ii=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,si=/\[([^]*?)\]/gm;function oi(e,t){for(var i=[],s=0,o=e.length;s<o;s++)i.push(e[s].substr(0,t));return i}function ai(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];for(var s=0,o=t;s<o.length;s++){var a=o[s];for(var r in a)e[r]=a[r]}return e}var ri=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],ni=["January","February","March","April","May","June","July","August","September","October","November","December"],li=oi(ni,3),di=ai({},{dayNamesShort:oi(ri,3),dayNames:ri,monthNamesShort:li,monthNames:ni,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}}),ci=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},hi={D:function(e){return String(e.getDate())},DD:function(e){return ci(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return ci(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return ci(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return ci(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return ci(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return ci(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return ci(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return ci(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return ci(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return ci(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return ci(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ci(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ci(Math.floor(Math.abs(t)/60),2)+":"+ci(Math.abs(t)%60,2)}},pi={default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},ui=function(e,t,i){if(void 0===t&&(t=pi.default),void 0===i&&(i={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var s=[];t=(t=pi[t]||t).replace(si,function(e,t){return s.push(t),"@@@"});var o=ai(ai({},di),i);return(t=t.replace(ii,function(t){return hi[t](e,o)})).replace(/@@@/g,function(){return s.shift()})};const gi=e=>{if(e.time_format===me.language||e.time_format===me.system){const t=e.time_format===me.language?e.language:void 0,i=(new Date).toLocaleString(t);return i.includes("AM")||i.includes("PM")}return e.time_format===me.am_pm};function mi(e,t,i){return i===me.am_pm||!i&&t.time_format===me.am_pm?ui(e,"h:mm A"):i===me.twenty_four||!i&&t.time_format===me.twenty_four?ui(e,"shortTime"):(()=>{try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}return!1})()?e.toLocaleTimeString(t.language,{hour:"numeric",minute:"2-digit",hour12:gi(t)}):gi(t)?mi(e,t,me.am_pm):mi(e,t,me.twenty_four)}function vi(e){const t=new Date,i=(e||"").match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})/);null!==i&&t.setFullYear(Number(i[1]),Number(i[2])-1,Number(i[3]));const s=(e||"").match(/([0-9]{2}):([0-9]{2})(:([0-9]{2}))?$/);return null!==s&&t.setHours(Number(s[1]),Number(s[2]),s.length>4?Number(s[4]):t.getSeconds()),t}let _i=class extends le{constructor(){super(...arguments),this.min=0,this.max=255,this.step=1,this.scaleFactor=1,this.unit="",this.optional=!1,this.disabled=!1,this.deferChange=!1,this._displayedValue=0,this.label="",this.minLabel="",this.maxLabel=""}set value(e){e=isNaN(e)?this.min:this._roundedValue(e/this.scaleFactor),this._displayedValue=e}render(){return B`
      <div class="checkbox-container">
        <div class="checkbox">${this.getCheckbox()}</div>
        <div class="slider">${this.getSlider()}</div>
        <div class="value${this.disabled?" disabled":""}">${this._displayedValue}${this.unit}</div>
        ${this.minLabel||this.maxLabel?B`<div class="end-labels${this.disabled?" disabled":""}"><span>${this.minLabel}</span><span>${this.maxLabel}</span></div>`:""}
      </div>
    `}getSlider(){return B`<input
      type="range"
      aria-label=${this.label}
      min=${this.min}
      max=${this.max}
      step=${this.step}
      .value=${String(this._displayedValue)}
      ?disabled=${this.disabled}
      @input=${this._updateValue}
      @change=${this._commitValue}
    />`}getCheckbox(){return this.optional?B`
      <input type="checkbox" aria-label="Enable value" @change=${this._toggleChecked} .checked=${!this.disabled} />
    `:B``}_toggleChecked(e){const t=e.target.checked;this.disabled=!t;const i=this.disabled?null:this._scaledValue(this._displayedValue);ve(this,"value-changed",{value:i})}_updateValue(e){let t=Number(e.target.value);this._displayedValue=t,t=this._scaledValue(this._displayedValue),this.deferChange?this.dispatchEvent(new CustomEvent("value-input",{detail:{value:t},bubbles:!0,composed:!0})):ve(this,"value-changed",{value:t})}_commitValue(){this.deferChange&&ve(this,"value-changed",{value:this._scaledValue(this._displayedValue)})}_roundedValue(e){return e=Math.round(e/this.step)*this.step,(e=parseFloat(e.toPrecision(12)))>this.max?e=this.max:e<this.min&&(e=this.min),e}_scaledValue(e){return e=this._roundedValue(e),e*=this.scaleFactor,e=parseFloat(e.toFixed(2))}};_i.styles=n`
    ${Xt} :host {
      width: 100%;
    }
    div.checkbox-container {
      grid-template-rows: 36px auto;
    }
    .end-labels {
      grid-column: 2;
      grid-row: 2;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      color: var(--secondary-text-color);
      font-size: calc(12px + 1pt);
    }
    input[type='range'] {
      margin: 0;
      width: 100%;
    }
    input[type='range']:disabled {
      opacity: 0.38;
      cursor: default;
    }
    div.checkbox-container div.value {
      width: 6.5ch;
      min-width: 6.5ch;
      justify-content: flex-end;
    }
  `,e([pe({type:Number})],_i.prototype,"min",void 0),e([pe({type:Number})],_i.prototype,"max",void 0),e([pe({type:Number})],_i.prototype,"step",void 0),e([pe({type:Number})],_i.prototype,"value",null),e([pe({type:Number})],_i.prototype,"scaleFactor",void 0),e([pe({type:String})],_i.prototype,"unit",void 0),e([pe({type:Boolean})],_i.prototype,"optional",void 0),e([pe({type:Boolean})],_i.prototype,"disabled",void 0),e([pe({type:Boolean})],_i.prototype,"deferChange",void 0),e([pe({type:Number})],_i.prototype,"_displayedValue",void 0),e([pe({type:String})],_i.prototype,"label",void 0),e([pe({type:String})],_i.prototype,"minLabel",void 0),e([pe({type:String})],_i.prototype,"maxLabel",void 0),_i=e([t("wiser-variable-slider")],_i);let yi=class extends le{render(){return B` <div id="time-bar" class="time-wrapper">${this.renderTimes()}</div> `}renderTimes(){if(this.hass){const e=parseFloat(getComputedStyle(this).getPropertyValue("width"))||460,t=[1,2,3,4,6,8,12],i=gi(It(this.hass))?55:40;let s=Math.ceil(24/(e/i));for(;!t.includes(s);)s++;const o=[0,...Array.from(Array(24/s-1).keys()).map(e=>(e+1)*s),24];return o.map(e=>{const t=0==e||24==e,i=t?s/48*100:s/24*100;return B`
          <div style="width: ${Math.floor(100*i)/100}%" class="${t?"":"time"}">
            ${t?"":mi(vi(Yt(3600*e)),It(this.hass))}
          </div>
        `})}return B``}static get styles(){return n`
      :host {
        display: block;
        max-width: 100%;
        overflow: hidden;
      }
      div.outer {
        width: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        border-radius: 5px;
      }
      div.time-wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        overflow: auto;
      }
      div.time-wrapper div {
        float: left;
        display: flex;
        position: relative;
        height: 25px;
        line-height: 25px;
        font-size: calc(12px + 1pt);
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;
      }
      div.time-wrapper div.time:before {
        content: ' ';
        background: var(--disabled-text-color);
        position: absolute;
        left: 0px;
        top: 0px;
        width: 1px;
        height: 5px;
        margin-left: 50%;
        margin-top: 0px;
      }
      @keyframes fadeIn {
        99% {
          visibility: hidden;
        }
        100% {
          visibility: visible;
        }
      }
    `}};e([pe({attribute:!1})],yi.prototype,"hass",void 0),yi=e([t("wiser-time-bar")],yi);let bi=class extends le{localize(e,t="",i=""){return Ke(this.hass,e,t,i)}constructor(){super(),this.editMode=!1,this.editable=!1,this.compactCopyPlacement=!1,this._activeSlot=-99,this._activeDay="",this._show_short_days=!1,this._dropDay="",this.schedule_type=Se[0],this.activeMarker=0,this.isDragging=!1,this.currentTime=0,this.timer=0,this.timeout=0,this.zoomFactor=1,this.rangeMin=0,this.rangeMax=ye,this.stepSize=5,this.initialise()}async initialise(){return this.schedule&&(this.schedule_type=this.schedule.Type),!0}shouldUpdate(){return this.editMode||(this._activeSlot=-99,this._activeDay=""),!0}clearSelection(){this._activeSlot=-99,this._activeDay="",this._dropDay="",this._dragGhost=void 0,this.isDragging=!1}selectPeriod(e,t){var i;const s=null===(i=this.schedule)||void 0===i?void 0:i.ScheduleData.find(t=>t.day===e);!this.editMode||!s||t<0||t>=s.slots.length||(this._activeDay=e,this._activeSlot=t)}get scheduleTypeKey(){var e,t;for(const i of[this.schedule_type,null===(e=this.schedule)||void 0===e?void 0:e.SubType,null===(t=this.schedule)||void 0===t?void 0:t.Type]){const e=Se.find(e=>e.toLowerCase()===(null==i?void 0:i.toLowerCase()));if(e)return e}return Se[0]}get passiveTemperatureRange(){var e;return Boolean((null===(e=this.schedule)||void 0===e?void 0:e.PassiveRange)&&"Heating"===this.scheduleTypeKey)}get supportsScheduledPassiveControl(){var e,t;return Boolean((null===(t=null===(e=this.schedule)||void 0===e?void 0:e.Capabilities)||void 0===t?void 0:t.PassiveControl)&&"Heating"===this.scheduleTypeKey)}toggleScheduledPassiveControl(e){var t,i,s,o,a,r,n,l,d,c,h,p,u;if(!this.schedule||!this.supportsScheduledPassiveControl)return;const g=this.activeSlot();if(!g)return;e?(g.PassiveScheduled=!0,null!==(t=g.PassiveMode)&&void 0!==t||(g.PassiveMode=null!==(s=null===(i=this.schedule.PassiveControlDefaults)||void 0===i?void 0:i.Enabled)&&void 0!==s&&s),null!==(o=g.PassiveStrategy)&&void 0!==o||(g.PassiveStrategy=null!==(r=null===(a=this.schedule.PassiveControlDefaults)||void 0===a?void 0:a.Strategy)&&void 0!==r?r:"modulating"),null!==(n=g.UpperSetpoint)&&void 0!==n||(g.UpperSetpoint=g.Setpoint),this.schedule.PassiveRange=!0,null!==(l=(h=this.schedule).PassiveRangeType)&&void 0!==l||(h.PassiveRangeType="scheduled"),null!==(d=(p=this.schedule).MinUpperSetpoint)&&void 0!==d||(p.MinUpperSetpoint=5),null!==(c=(u=this.schedule).MaxUpperSetpoint)&&void 0!==c||(u.MaxUpperSetpoint=30)):(delete g.PassiveScheduled,delete g.PassiveMode,delete g.PassiveStrategy);if(this.schedule.ScheduleData.some(e=>e.slots.some(e=>e.PassiveScheduled))){this.schedule.PassiveControl=!0;for(const e of this.schedule.ScheduleData)for(const t of e.slots)t.PassiveScheduled=Boolean(t.PassiveScheduled)}else if(delete this.schedule.PassiveControl,"scheduled"===this.schedule.PassiveRangeType){delete this.schedule.PassiveRange,delete this.schedule.PassiveRangeType,delete this.schedule.MinUpperSetpoint,delete this.schedule.MaxUpperSetpoint;for(const e of this.schedule.ScheduleData)for(const t of e.slots)delete t.UpperSetpoint}this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}})),this.requestUpdate()}updateScheduledPassiveControl(e){const t=this.activeSlot();(null==t?void 0:t.PassiveScheduled)&&(t.PassiveMode="off"!==e,"off"!==e&&(t.PassiveStrategy=e),this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}})),this.requestUpdate())}scheduledPassiveOffTemperature(e){var t;return"temperature_limiter"===e.PassiveStrategy?e.Setpoint:null!==(t=e.UpperSetpoint)&&void 0!==t?t:e.Setpoint}get canAddPeriod(){var e;if(!this.editMode||!this._activeDay||this._activeSlot<-1)return!1;const t=null===(e=this.schedule)||void 0===e?void 0:e.ScheduleData.find(e=>e.day===this._activeDay);return Boolean(t&&t.slots.length<8)}get canDeletePeriod(){return Boolean(this.editMode&&this._activeDay&&this._activeSlot>=0)}addPeriod(){this.canAddPeriod&&this._addSlot()}deletePeriod(){this.canDeletePeriod&&this._removeSlot()}updated(){this.dispatchEvent(new CustomEvent("period-state",{detail:{canAdd:this.canAddPeriod,canDelete:this.canDeletePeriod}}))}render(){const e=parseFloat(getComputedStyle(this).getPropertyValue("width"));return this._show_short_days=e<500,this.hass&&this.config&&this.suntimes&&this.schedule?B`
            <div class = "slots-wrapper">
                ${Ee.map(e=>this.renderDay(this.schedule.ScheduleData.filter(t=>t.day==e)[0]?this.schedule.ScheduleData.filter(t=>t.day==e)[0]:{day:e,slots:[]}))}
                <div class="wrapper" style="display:flex; height:28px;">
                    <div class="day  ${this._show_short_days?"short":""}">&nbsp;</div>
                        <wiser-time-bar style="width:100%"
                            .hass=${this.hass}
                            ></wiser-time-bar>
                    </div>
                </div>
            </div>
            ${this.editMode?B`
                    <div class="schedule-editor-area ${this._show_short_days?"short":""}">
                      ${this.renderSelectedPeriod()}
                    </div>
                  `:null}
            ${this.editMode?this.renderCopyDay():null}
            ${this._dragGhost?B`<div
                    class="period-drag-ghost ${this._dragGhost.valid?"valid":""}"
                    style="left:${this._dragGhost.left}px; top:${this._dragGhost.top}px; width:${this._dragGhost.width}px; height:${this._dragGhost.height}px; background:${this._dragGhost.background}; color:${this._dragGhost.colour};"
                    aria-hidden="true"
                  >
                    ${this._dragGhost.label}
                  </div>`:""}
        `:B``}renderDay(e){return B`
      <div class="wrapper">
        ${this.computeDayLabel(e.day)}
        <div class="outer ${this._dropDay===e.day?"drop-target":""}" id="${e.day}">
          <div class="wrapper ${this.editMode||this.editable?"selectable":""}">
            ${e.slots.length>0?e.slots.map((t,i)=>this.renderSlot(t,i,e)):this.renderEmptySlot({Time:"23:59",Setpoint:"0",SpecialTime:""},-1,e,!0)}
          </div>
        </div>
      </div>
    `}renderEmptySlot(e,t,i,s=!1){const o="00:00",a=e.Time,r=Nt(i,t,this.schedule),n=Mt(i,this.schedule),l=(null==n?void 0:n.PassiveScheduled)&&!n.PassiveMode?this.scheduledPassiveOffTemperature(n):r,d=this.computeTemperatureRangeLabel(Object.assign(Object.assign({},e),{Setpoint:String(l),UpperSetpoint:null==n?void 0:n.UpperSetpoint,PassiveScheduled:null==n?void 0:n.PassiveScheduled,PassiveMode:null==n?void 0:n.PassiveMode,PassiveStrategy:null==n?void 0:n.PassiveStrategy})),c=parseFloat(getComputedStyle(this).getPropertyValue("width")),h=!this.config.theme_colors&&["Lighting","Shutters"].includes(this.schedule_type)&&0===Number(r)&&!this.hasCustomInactiveLevelColor(),p=this.config.theme_colors?"rgba(var(--rgb-primary-color), 0.7)":h?"var(--secondary-background-color, #eeeeee)":"rgba("+Pt(this,this.schedule_type,this.colourSetpoint(l),this.isNativeHotWaterTimer(),this.config)+")",u=this.config.theme_colors||h?"var(--primary-text-color)":this.contrastColour(p),g=(Ot(a)-Ot(o))/ye*100,m=this.localize("wiser.labels.start")+" - "+o+"\n"+this.localize("wiser.labels.end")+" - "+a+"\n"+this.localize("wiser.labels.setting")+" - "+d+this.passiveControlTitle(n),v=g/100*c<35?"setpoint rotate":"setpoint";return B`
      <div
        id=${i.day+"|-1"}
        class="slot previous ${this.editMode&&s?"selectable":null} ${this._activeSlot==t&&this._activeDay==i.day?"selected":null} ${this.config.theme_colors?"theme-colors":null} ${h?"inactive-level":null}"
        style="width:${Math.floor(1e3*g)/1e3}%; background:${p}; --slot-label-color:${u};"
        title="${m}"
        @click=${s?this._slotClick:null}
        slot="${-1}"
      >
        <div class="slotoverlay previous">
          <span class="${v}">${d}</span>
        </div>
      </div>
    `}renderSlot(e,t,i){const s=e.Time,o=Dt(i,t),a=e.PassiveScheduled&&!e.PassiveMode?this.scheduledPassiveOffTemperature(e):e.Setpoint,r=(Ot(o)-Ot(s))/ye*100,n=!this.config.theme_colors&&["Lighting","Shutters"].includes(this.schedule_type)&&0===Number(a)&&!this.hasCustomInactiveLevelColor(),l=this.config.theme_colors?"rgba(var(--rgb-primary-color), 0.7)":n?"var(--secondary-background-color, #eeeeee)":"rgba("+Pt(this,this.schedule_type,this.colourSetpoint(a),this.isNativeHotWaterTimer(),this.config)+")",d=this.config.theme_colors||n?"var(--primary-text-color)":this.contrastColour(l),c=this._activeSlot==t&&this._activeDay==i.day,h=this.editMode||this.editable,p=this.editMode&&this._activeDay===i.day&&(t===this._activeSlot||t===this._activeSlot+1),u=c&&t<i.slots.length-1&&!Te.includes(e.SpecialTime)&&!Te.includes(i.slots[t+1].SpecialTime),g=r/100*parseFloat(getComputedStyle(this).getPropertyValue("width"))<35?"setpoint rotate":"setpoint",m=this.computeTemperatureRangeLabel(e),v=this.localize("wiser.labels.start")+" - "+(e.SpecialTime?e.SpecialTime+" ("+s+")":s)+"\n"+this.localize("wiser.labels.end")+" - "+o+"\n"+this.localize("wiser.labels.setting")+" - "+m+this.passiveControlTitle(e);return B`
      ${0==t&&"00:00"!=s&&"0:00"!=s?this.renderEmptySlot(e,-1,i,!1):""}
      <div
        id=${i.day+"|"+t}
        class="slot ${h?"selectable":null} ${c?"selected":null} ${u?"movable":null} ${n?"inactive-level":null}"
        style="width:${Math.floor(1e3*r)/1e3}%; background:${l}; --slot-label-color:${d};"
        title="${v}"
        @click=${h?this._slotClick:null}
        @pointerdown=${u?e=>this._handleSlotPointerStart(e,i,t):null}
        slot="${t}"
      >
        <div class="slotoverlay ${h?"selectable":null}">
          <span class="${g}">${m}</span>
        </div>
        ${Te.includes(e.SpecialTime)&&!p?this.renderSpecialTimeMarker(e.SpecialTime):""}
        ${c?B`
                ${Ft(i.slots[t].Time)>0?this.renderBoundaryHandle(i,t,!1):""}
                ${t<i.slots.length-1?this.renderBoundaryHandle(i,t+1,!0):""}
              `:""}
      </div>
    `}renderBoundaryHandle(e,t,i){var s;const o=null===(s=e.slots[t])||void 0===s?void 0:s.SpecialTime;return Te.includes(o)?this.renderTooltip(e,t,i):B`
      <div
        class=${i?"handle end-handle":"handle"}
        data-boundary=${t}
        @click=${e=>e.stopPropagation()}
        @pointerdown=${this._handlePointerStart}
      >
        <div class="button-holder">
          <ha-icon-button
            class="time-handle"
            .label=${i?"Adjust end time":"Adjust start time"}
            .path=${"M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z"}
            @click=${e=>e.stopPropagation()}
          ></ha-icon-button>
        </div>
      </div>
      ${this.renderTooltip(e,t,i)}
    `}renderSpecialTimeMarker(e){const t=this.localize(`wiser.labels.${e.toLowerCase()}`);return B`<span class="special-time-marker" role="img" aria-label=${t} title=${t}>
      <ha-icon
        icon="hass:${e===Te[0]?"weather-sunny":"weather-night"}"
        aria-hidden="true"
      ></ha-icon>
    </span>`}contrastColour(e){var t;const i=null===(t=e.match(/[\d.]+/g))||void 0===t?void 0:t.slice(0,3).map(Number);if(!i||i.length<3)return"var(--primary-text-color)";const[s,o,a]=i.map(e=>{const t=e/255;return t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)});return.2126*s+.7152*o+.0722*a>.42?"#1c1c1c":"#ffffff"}activeSlot(){var e,t;if(this._activeDay&&!(this._activeSlot<0))return null===(t=null===(e=this.schedule)||void 0===e?void 0:e.ScheduleData.find(e=>e.day===this._activeDay))||void 0===t?void 0:t.slots[this._activeSlot]}presetOption(e){var t,i;const s=String(e).toLocaleLowerCase();return null===(i=null===(t=this.schedule)||void 0===t?void 0:t.PresetOptions)||void 0===i?void 0:i.find(e=>e.name.toLocaleLowerCase()===s)}setpointTemperature(e){var t,i;return null!==(i=null===(t=this.presetOption(e))||void 0===t?void 0:t.temperature)&&void 0!==i?i:Number(e)}colourSetpoint(e){var t,i;return String(null!==(i=null===(t=this.presetOption(e))||void 0===t?void 0:t.temperature)&&void 0!==i?i:e)}isNativeHotWaterTimer(){var e,t,i;return"OnOff"===this.scheduleTypeKey&&(1e3===Math.abs(Number(null===(e=this.schedule)||void 0===e?void 0:e.Id))||"hotwater"===(null===(i=null===(t=this.schedule)||void 0===t?void 0:t.SubType)||void 0===i?void 0:i.toLowerCase()))}hasCustomInactiveLevelColor(){var e,t;return zt(("Lighting"===this.scheduleTypeKey?null===(e=this.config)||void 0===e?void 0:e.lighting_off_color:null===(t=this.config)||void 0===t?void 0:t.shutter_closed_color)||"")}activePeriodLabel(){var e;const t=null===(e=this.schedule)||void 0===e?void 0:e.ScheduleData.find(e=>e.day===this._activeDay),i=this.activeSlot();if(!t||!i)return"";return`${mi(vi(Yt(Ft(i.Time))),It(this.hass))}–${mi(vi(Yt(Ft(Dt(t,this._activeSlot)))),It(this.hass))}`}renderSelectedPeriod(){const e=this._activeSlot>=0;return B`
      <section
        class="selected-period ${e?"":"disabled"}"
        aria-label=${this.localize("wiser.labels.selected_period")}
        aria-disabled=${!e}
      >
        <div class="selected-period-header">
          <div>
            <h3>${this.localize("wiser.labels.selected_period")}</h3>
            <span>${this.activePeriodLabel()||" "}</span>
          </div>
        </div>
        <div class="selected-period-controls">
          ${$e.includes(this.schedule_type)?this.renderSpecialTimeButtons():null}
          ${this.renderScheduledPassivePeriodControl()} ${this.renderSetPointControl()}
        </div>
      </section>
    `}renderScheduledPassivePeriodControl(){if(!this.supportsScheduledPassiveControl)return null;const e=this.activeSlot(),t=(null==e?void 0:e.PassiveMode)?e.PassiveStrategy||"modulating":"off";return B`
      <div class="editor-control-row passive-period-toggle">
        <div class="section-header" aria-disabled=${!e}>${this.localize("wiser.labels.passive_schedule")}</div>
        <div class="control-content switch-control">
          <ha-switch
            .checked=${Boolean(null==e?void 0:e.PassiveScheduled)}
            .disabled=${!e}
            aria-label=${this.localize("wiser.labels.passive_schedule")}
            @change=${e=>this.toggleScheduledPassiveControl(Boolean(e.currentTarget.checked))}
          ></ha-switch>
        </div>
      </div>
      ${(null==e?void 0:e.PassiveScheduled)?B`<div class="editor-control-row state-control-row passive-strategy-row">
              <div class="section-header">${this.localize("wiser.heating.passive")}</div>
              <div
                class="control-content special-times passive-strategy-controls"
                role="radiogroup"
                aria-label=${this.localize("wiser.heating.passive")}
              >
                ${["off","modulating","temperature_limiter"].map(e=>B`<ha-button
                      class=${t===e?"selected":""}
                      appearance="plain"
                      aria-pressed=${t===e}
                      @click=${()=>this.updateScheduledPassiveControl(e)}
                    >
                      ${"off"===e?this.localize("wiser.heating.off"):this.localize(`wiser.heating.strategy_${e}`)}
                    </ha-button>`)}
              </div>
            </div>`:null}
    `}renderSpecialTimeButtons(){var e;const t=this._activeDay?this.schedule.ScheduleData.find(e=>e.day===this._activeDay):null,i=null==t?void 0:t.slots[this._activeSlot],s=null==t?void 0:t.slots[this._activeSlot+1],o="Sunrise"===(null==i?void 0:i.SpecialTime),a="Sunset"===(null===(e=s||i)||void 0===e?void 0:e.SpecialTime),r=!o&&!a;return B`
      <div class="editor-control-row">
        <div class="section-header" aria-disabled=${!i}>${this.localize("wiser.labels.time")}</div>
        <div
          class="control-content special-times"
          role="group"
          aria-label=${this.localize("wiser.labels.special_time")}
        >
          <ha-button
            id="fixed"
            class=${r?"selected":""}
            appearance="plain"
            @click=${this._setSpecialTime}
            .disabled=${!i}
          >
            ${this.localize("wiser.labels.fixed")}
          </ha-button>
          <ha-button
            id="sunrise"
            class=${o?"selected":""}
            appearance="plain"
            @click=${this._setSpecialTime}
            .disabled=${!i}
          >
            ${this.localize("wiser.labels.sunrise")}
          </ha-button>
          <ha-button
            id="sunset"
            class=${a?"selected":""}
            appearance="plain"
            @click=${this._setSpecialTime}
            .disabled=${!i}
          >
            ${this.localize("wiser.labels.sunset")}
          </ha-button>
        </div>
      </div>
    `}renderSetPointControl(){var e,t,i,s,o,a,r,n,l,d,c;let h={};if(this.editMode){this.schedule.ScheduleData.filter(e=>e.day==this._activeDay).length>0&&(h=this._activeDay?this.schedule.ScheduleData.filter(e=>e.day==this._activeDay)[0].slots:{});const p=this.scheduleTypeKey;if(["Heating","HotWater"].includes(p)){const u="HotWater"===p,g=this._activeSlot>=0?h[this._activeSlot]:void 0,m=Boolean((null==g?void 0:g.PassiveScheduled)&&!g.PassiveMode),v=g?m?this.scheduledPassiveOffTemperature(g):g.Setpoint:0,_=u?this.presetOption(v):void 0,y=u&&null!==(t=null===(e=this.schedule)||void 0===e?void 0:e.PresetOptions)&&void 0!==t?t:[];return B`
          ${y.length?B`
                  <div class="editor-control-row preset-control-row">
                    <div class="section-header" aria-disabled=${this._activeSlot<0}>
                      ${this.localize("wiser.labels.preset")}
                    </div>
                    <div
                      class="control-content preset-controls"
                      role="radiogroup"
                      aria-label=${this.localize("wiser.labels.preset")}
                    >
                      <label class="preset-choice">
                        <span>${this.localize("wiser.labels.custom_temperature")}</span>
                        <input
                          type="radio"
                          name="scheduled-hot-water-preset"
                          .checked=${this._activeSlot>=0&&!_}
                          .disabled=${this._activeSlot<0}
                          @change=${()=>this._updateSetPoint(this.setpointTemperature(v))}
                        />
                      </label>
                      ${y.map(e=>B`
                          <label class="preset-choice">
                            <ha-icon icon=${e.icon}></ha-icon>
                            <span>${e.name}</span>
                            <input
                              type="radio"
                              name="scheduled-hot-water-preset"
                              value=${e.name}
                              .checked=${(null==_?void 0:_.name)===e.name}
                              .disabled=${this._activeSlot<0}
                              @change=${()=>this._updateSetPoint(e.name)}
                            />
                          </label>
                        `)}
                    </div>
                  </div>
                `:""}
          <div class="editor-control-row heating-control-row">
            <div class="section-header" aria-disabled=${this._activeSlot<0}>
              ${this.passiveTemperatureRange&&!m?this.localize("wiser.labels.lower_temperature"):this.localize("wiser.labels.temperature")}
            </div>
            <div class="control-content temperature-input">
              ${u?"":B`<button
                      type="button"
                      aria-label=${this.localize("wiser.heating.off")}
                      class="set-off-button"
                      .disabled=${this._activeSlot<0}
                      @click=${()=>m?this._updateScheduledOffTemperature(-20):this._updateSetPoint("-20")}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${Qt}></path></svg>
                    </button>`}
              <wiser-variable-slider
                min=${u?null!==(s=null===(i=this.schedule)||void 0===i?void 0:i.MinSetpoint)&&void 0!==s?s:35:5}
                max=${u?null!==(a=null===(o=this.schedule)||void 0===o?void 0:o.MaxSetpoint)&&void 0!==a?a:55:30}
                step="0.5"
                value=${this._activeSlot>=0?this.setpointTemperature(v):0}
                unit="°C"
                .label=${this.localize("wiser.labels.temperature")}
                .optional=${!1}
                .disabled=${this._activeSlot<0}
                .deferChange=${!0}
                @value-input=${e=>{m?this._previewScheduledOffTemperature(Number(e.detail.value)):this._previewSetPoint(Number(e.detail.value))}}
                @value-changed=${e=>{m?this._updateScheduledOffTemperature(Number(e.detail.value)):this._updateSetPoint(Number(e.detail.value))}}
              >
              </wiser-variable-slider>
            </div>
          </div>
          ${this.passiveTemperatureRange&&!m?B`
                  <div class="editor-control-row heating-control-row">
                    <div class="section-header" aria-disabled=${this._activeSlot<0}>
                      ${this.localize("wiser.labels.upper_temperature")}
                    </div>
                    <div class="control-content temperature-input">
                      <button
                        type="button"
                        class="set-off-button slider-leading-spacer"
                        disabled
                        aria-hidden="true"
                        tabindex="-1"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${Qt}></path></svg>
                      </button>
                      <wiser-variable-slider
                        min=${null!==(n=null===(r=this.schedule)||void 0===r?void 0:r.MinUpperSetpoint)&&void 0!==n?n:5}
                        max=${null!==(d=null===(l=this.schedule)||void 0===l?void 0:l.MaxUpperSetpoint)&&void 0!==d?d:30}
                        step="0.5"
                        value=${this._activeSlot>=0?Number(null!==(c=h[this._activeSlot].UpperSetpoint)&&void 0!==c?c:18):0}
                        unit="°C"
                        .label=${this.localize("wiser.labels.upper_temperature")}
                        .optional=${!1}
                        .disabled=${this._activeSlot<0}
                        .deferChange=${!0}
                        @value-input=${e=>{this._previewUpperSetPoint(Number(e.detail.value))}}
                        @value-changed=${e=>{this._updateUpperSetPoint(Number(e.detail.value))}}
                      >
                      </wiser-variable-slider>
                    </div>
                  </div>
                `:""}
        `}return"OnOff"===p?B`
          <div class="editor-control-row state-control-row">
            <div class="section-header" aria-disabled=${this._activeSlot<0}>
              ${this.localize("wiser.labels.state")}
            </div>
            <div
              class="control-content state-controls"
              role="radiogroup"
              aria-label=${this.localize("wiser.labels.state")}
            >
              ${["Off","On"].map(e=>B`
                  <label class="state-choice">
                    <span>${this.localize("wiser.labels."+e.toLowerCase())}</span>
                    <input
                      type="radio"
                      name="scheduled-state"
                      value=${e}
                      .checked=${this._activeSlot>=0&&h[this._activeSlot].Setpoint===e}
                      .disabled=${this._activeSlot<0}
                      @change=${()=>this._updateSetPoint(e)}
                    />
                  </label>
                `)}
            </div>
          </div>
        `:["Lighting","Shutters"].includes(p)?B`
          <div class="editor-control-row level-control-row">
            <div class="section-header" aria-disabled=${this._activeSlot<0}>
              ${this.localize("wiser.labels.level")}
            </div>
            <div class="control-content level-control">
              <wiser-variable-slider
                min="0"
                max="100"
                step="1"
                value=${this._activeSlot>=0?parseFloat(h[this._activeSlot].Setpoint):0}
                unit="%"
                .label=${this.localize("wiser.labels.level")}
                .minLabel=${"Shutters"===p?this.localize("wiser.labels.closed"):""}
                .maxLabel=${"Shutters"===p?this.localize("wiser.labels.open"):""}
                .optional=${!1}
                .disabled=${this._activeSlot<0}
                @value-changed=${e=>this._updateSetPoint(Number(e.detail.value))}
              ></wiser-variable-slider>
            </div>
          </div>
        `:B``}return B``}renderCopyDay(){return B`
      <div class="copy-section ${this.compactCopyPlacement?"compact":""}">
        <div>
          <div class="section-header" aria-disabled=${!this._activeDay}>
            ${this._activeDay?this.localize("wiser.actions.copy")+" "+this.localize("wiser.days."+this._activeDay.toLowerCase())+" "+this.localize("wiser.labels.to"):this.localize("wiser.actions.copy")+" "+this.localize("wiser.labels.to")}
          </div>
          <div class="copy-options">
            ${Ee.concat(ke).concat("All").filter(e=>e!==this._activeDay).map(e=>this.renderCopyToButton(e))}
          </div>
        </div>
      </div>
    `}renderCopyToButton(e){return B`
      <ha-button
        appearance="plain"
        id=${e}
        @click=${this._copyDay}
        .disabled=${this._activeDay==e||!this._activeDay}
      >
        ${Ee.includes(e)&&this._show_short_days?this.localize("wiser.days.short."+e.toLowerCase()):this.localize("wiser.days."+e.toLowerCase())}
      </ha-button>
    `}renderTooltip(e,t,i=!1){const s=e.slots,o=Te.includes(s[t].SpecialTime);return B`
      <div class=${i?"tooltip-container center end-time":"tooltip-container center"}>
        <div class="tooltip ${this._activeSlot===t?"active":""}">
          ${o?B`
                  <ha-icon
                    icon="hass:${s[t].SpecialTime==Te[0]?"weather-sunny":"weather-night"}"
                  ></ha-icon>
                  ${s[t].SpecialTime}
                `:mi(vi(Yt(Ft(s[t].Time))),It(this.hass))}
        </div>
      </div>
    `}_slotClick(e){if(this.isDragging)return;const t=e.currentTarget;if(t.id){const e=t.id.split("|")[0],i=parseInt(t.id.split("|")[1]);if(!this.editMode)return void(this.editable&&i>=0&&this.dispatchEvent(new CustomEvent("period-edit-requested",{detail:{day:e,slot:i}})));i!=this._activeSlot||e!=this._activeDay?(this._activeSlot=i,this._activeDay=e):(this._activeSlot=-99,this._activeDay="");const s=new CustomEvent("slotClicked",{detail:{day:this._activeDay,slot:this._activeSlot}});this.dispatchEvent(s)}}_copyDay(e){const t=e.currentTarget,i=JSON.stringify(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots);Ee.includes(t.id)?this.schedule.ScheduleData[Ee.indexOf(t.id)].slots=JSON.parse(i):t.id==ke[0]?ze.map(e=>{this.schedule.ScheduleData[Ee.indexOf(e)].slots=JSON.parse(i)}):t.id==ke[1]?Ce.map(e=>{this.schedule.ScheduleData[Ee.indexOf(e)].slots=JSON.parse(i)}):"All"==t.id&&Ee.map(e=>{this.schedule.ScheduleData[Ee.indexOf(e)].slots=JSON.parse(i)}),this.requestUpdate()}_updateSetPoint(e){const t=this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot],i=Number(t.UpperSetpoint);this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots=Object.assign(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots,{[this._activeSlot]:Object.assign(Object.assign({},this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot]),{Setpoint:e,UpperSetpoint:this.passiveTemperatureRange&&Number.isFinite(i)&&i<Number(e)?e:t.UpperSetpoint})});const s=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(s),this.requestUpdate()}_previewSetPoint(e){this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot].Setpoint=String(e)}_updateScheduledOffTemperature(e){const t=this.activeSlot();if(!t)return;const i=Number(e);"temperature_limiter"===t.PassiveStrategy?(t.Setpoint=String(e),-20!==i&&Number(t.UpperSetpoint)<i&&(t.UpperSetpoint=e)):(t.UpperSetpoint=e,(-20===i||Number(t.Setpoint)>i)&&(t.Setpoint=String(e))),this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}})),this.requestUpdate()}_previewScheduledOffTemperature(e){const t=this.activeSlot();t&&("temperature_limiter"===t.PassiveStrategy?this._previewSetPoint(e):this._previewUpperSetPoint(e))}_updateUpperSetPoint(e){const t=Number(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot].Setpoint);this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots=Object.assign(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots,{[this._activeSlot]:Object.assign(Object.assign({},this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot]),{Setpoint:Number(e)<t?e:t,UpperSetpoint:e})}),this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}})),this.requestUpdate()}_previewUpperSetPoint(e){this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot].UpperSetpoint=e}getSunTime(e,t){var i,s;const o=t===Te[0]?this.suntimes.Sunrises:this.suntimes.Sunsets;return(null===(i=o.find(t=>{var i;return(null===(i=t.day)||void 0===i?void 0:i.toLowerCase())===e.toLowerCase()}))||void 0===i?void 0:i.time)||(null===(s=o[Ee.indexOf(e)])||void 0===s?void 0:s.time)||"00:00"}convertScheduleDay(e){const t=e.slots.map(t=>Te.includes(t.SpecialTime)?Object.assign(Object.assign({},t),{Time:this.getSunTime(e.day,t.SpecialTime),SpecialTime:t.SpecialTime}):Object.assign(Object.assign({},t),{Time:t.Time,SpecialTime:t.SpecialTime})).sort((e,t)=>Ft(e.Time)-Ft(t.Time)),i=new Set(t.map(e=>JSON.stringify(e))),s=Array.from(i).map(e=>JSON.parse(e));return{day:e.day,slots:s}}_setSpecialTime(e){const t=e.currentTarget.id.replace(/\w\S*/g,e=>e.charAt(0).toUpperCase()+e.substr(1).toLowerCase());if(this._activeDay&&this._activeSlot>=0){const e=Ee.indexOf(this._activeDay),i=this.schedule.ScheduleData[e],s=i.slots[this._activeSlot];if(!s)return;if("Fixed"===t)return i.slots[this._activeSlot]=Object.assign(Object.assign({},s),{SpecialTime:""}),i.slots[this._activeSlot+1]&&(i.slots[this._activeSlot+1]=Object.assign(Object.assign({},i.slots[this._activeSlot+1]),{SpecialTime:""})),this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}})),void this.requestUpdate();const o={Time:s.Time,Setpoint:s.Setpoint,SpecialTime:s.SpecialTime},a="Sunset"===t&&this._activeSlot===i.slots.length-1,r="Sunrise"===t||a?this._activeSlot:this._activeSlot+1,n=i.slots[r],l=Object.assign(Object.assign({},n||s),{Time:this.getSunTime(this._activeDay,t),SpecialTime:t}),d=n?i.slots.map((e,t)=>t===r?l:e):[...i.slots,l];i.slots=d.filter(e=>e===l||e.SpecialTime!==t),this.schedule.ScheduleData[e]=this.convertScheduleDay(i);const c=this.schedule.ScheduleData[e].slots,h=c.findIndex(e=>"Sunrise"===t||a?e.SpecialTime===t:e.Time===o.Time&&e.Setpoint===o.Setpoint&&e.SpecialTime===o.SpecialTime);this._activeSlot=h>=0?h:Math.min(this._activeSlot,c.length-1),this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}})),this.requestUpdate()}}_addSlot(){if(this._activeSlot<-1)return;const e=Ee.indexOf(this._activeDay);if(this._activeSlot<0)this.schedule.ScheduleData[e].slots=[{Time:Kt(Ft("06:00")),Setpoint:we[this.scheduleTypeKey],UpperSetpoint:this.passiveTemperatureRange?Math.max(18,Number(we[this.scheduleTypeKey])):void 0,SpecialTime:""}],this._activeSlot=0;else{const t=this.schedule.ScheduleData[e].slots[this._activeSlot];let i=Ft(t.Time),s=Ft(Dt(this.schedule.ScheduleData[e],this._activeSlot));s<i&&(s+=ye);const o=Gt(i+(s-i)/2,this.stepSize);t.SpecialTime?(i=Gt(i-Ft("01:00"),this.stepSize),this.schedule.ScheduleData[e].slots=[...this.schedule.ScheduleData[e].slots.slice(0,this._activeSlot),{Time:Kt(i),Setpoint:t.Setpoint,UpperSetpoint:t.UpperSetpoint,PassiveScheduled:t.PassiveScheduled,PassiveMode:t.PassiveMode,PassiveStrategy:t.PassiveStrategy,SpecialTime:""},...this.schedule.ScheduleData[e].slots.slice(this._activeSlot)]):(this.schedule.ScheduleData[e].slots=[...this.schedule.ScheduleData[e].slots.slice(0,this._activeSlot),{Time:Kt(i),Setpoint:t.Setpoint,UpperSetpoint:t.UpperSetpoint,PassiveScheduled:t.PassiveScheduled,PassiveMode:t.PassiveMode,PassiveStrategy:t.PassiveStrategy,SpecialTime:""},Object.assign(Object.assign({},this.schedule.ScheduleData[e].slots[this._activeSlot]),{Time:Kt(o)}),...this.schedule.ScheduleData[e].slots.slice(this._activeSlot+1)],this._activeSlot++)}const t=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(t),this.requestUpdate()}_removeSlot(){if(this._activeSlot<0)return;const e=Ee.indexOf(this._activeDay),t=this._activeSlot;this.schedule.ScheduleData[e].slots=0==t?[...this.schedule.ScheduleData[e].slots.slice(t+1)]:[...this.schedule.ScheduleData[e].slots.slice(0,t),...this.schedule.ScheduleData[e].slots.slice(t+1)],this._activeSlot==this.schedule.ScheduleData[e].slots.length&&this._activeSlot--;const i=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(i),this.requestUpdate()}_handlePointerStart(e){var t;if(0!==e.button)return;e.preventDefault(),e.stopPropagation();const i=Ee.indexOf(this._activeDay);let s=this.schedule.ScheduleData.filter(e=>e.day==this._activeDay)[0].slots;const o=e.currentTarget;let a=o;for(;!a.classList.contains("outer");)a=a.parentElement;const r=parseFloat(getComputedStyle(a).getPropertyValue("width")),n=ye/(this.rangeMax-this.rangeMin)*r,l=-(-this.rangeMin/(this.rangeMax-this.rangeMin)*r)/n*ye;let d=o;for(;!d.classList.contains("slot");)d=d.parentElement;const c=d,h=Number(o.dataset.boundary);if(!Number.isInteger(h)||h<0||h>=s.length)return;const p=h>0?Ft(s[h-1].Time)+60*this.stepSize:0,u=h<s.length-1?(Ft(Dt(this.schedule.ScheduleData[i],h))||ye)-60*this.stepSize:ye-60*this.stepSize;this.isDragging=!0;const g=c.parentElement.parentElement.getBoundingClientRect(),m=e.pointerId;null===(t=o.setPointerCapture)||void 0===t||t.call(o,m);let v=e=>{if(e.pointerId!==m)return;e.preventDefault();let t=e.clientX-g.left;t>r-1&&(t=r-1),t<-18&&(t=-18);let o=Math.round(t/n*ye+l);o<p&&(o=p),o>u&&(o=u),this.currentTime=o,o=Math.round(o)>=ye?ye:Gt(o,this.stepSize);const a=Kt(o);a!=Dt(this.schedule.ScheduleData[i],h)&&(s=Object.assign(s,{[h]:Object.assign(Object.assign({},s[h]),{Time:a,SpecialTime:""})}),this.requestUpdate())};const _=e=>{var t;if(e&&e.pointerId!==m)return;window.removeEventListener("pointermove",v),window.removeEventListener("pointerup",_),window.removeEventListener("pointercancel",_),window.removeEventListener("blur",y),(null===(t=o.hasPointerCapture)||void 0===t?void 0:t.call(o,m))&&o.releasePointerCapture(m),v=()=>{},setTimeout(()=>{this.isDragging=!1},100),o.blur();const i=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(i)},y=()=>_();window.addEventListener("pointerup",_),window.addEventListener("pointercancel",_),window.addEventListener("blur",y),window.addEventListener("pointermove",v,{passive:!1})}_handleSlotPointerStart(e,t,i){var s,o,a;if(0!==e.button||i>=t.slots.length-1)return;e.preventDefault();const r=e.currentTarget,n=null===(s=r.parentElement)||void 0===s?void 0:s.parentElement;if(!n)return;const l=n.getBoundingClientRect().width,d=this.schedule.ScheduleData[Ee.indexOf(t.day)].slots,c=Ft(d[i].Time),h=Ft(d[i+1].Time),p=i>0?Ft(d[i-1].Time):60*-this.stepSize,u=i+2<d.length?Ft(d[i+2].Time):ye,g=Math.max(0,p+60*this.stepSize),m=u-60*this.stepSize,v=g-c,_=m-h,y=e.pointerId,b=e.clientX,f=e.clientY,w=r.getBoundingClientRect(),x=this.getBoundingClientRect(),S=b-w.left,$=f-w.top,k=getComputedStyle(r),z=r.querySelector(".setpoint"),C={width:w.width,height:w.height,background:k.backgroundColor,colour:z?getComputedStyle(z).color:k.color,label:(null===(o=null==z?void 0:z.textContent)||void 0===o?void 0:o.trim())||""};let E=!1,T=!1;this.isDragging=!0,null===(a=r.setPointerCapture)||void 0===a||a.call(r,y);let P=e=>{var s,o,a,r,n;if(e.pointerId!==y)return;e.preventDefault();const p=null===(s=this.shadowRoot)||void 0===s?void 0:s.elementFromPoint(e.clientX,e.clientY),u=(null===(o=null==p?void 0:p.closest(".outer"))||void 0===o?void 0:o.id)||"",g=u&&u!==t.day&&Ee.includes(u)?u:"";if(g){const t=null===(a=this.shadowRoot)||void 0===a?void 0:a.querySelector(`.outer#${CSS.escape(g)}`),s=null==t?void 0:t.getBoundingClientRect();return T=!0,d[i]=Object.assign(Object.assign({},d[i]),{Time:Kt(c)}),d[i+1]=Object.assign(Object.assign({},d[i+1]),{Time:Kt(h)}),this._dropDay=g,this._dragGhost=Object.assign(Object.assign({},C),{left:e.clientX-S-x.left,top:(null!==(r=null==s?void 0:s.top)&&void 0!==r?r:e.clientY-$)-x.top,height:null!==(n=null==s?void 0:s.height)&&void 0!==n?n:C.height,valid:!0}),E=!0,void this.requestUpdate()}if(T&&u!==t.day)return this._dropDay="",this._dragGhost=Object.assign(Object.assign({},C),{left:e.clientX-S-x.left,top:e.clientY-$-x.top,valid:!1}),void this.requestUpdate();T=!1,this._dragGhost=void 0,this._dropDay&&(this._dropDay="",this.requestUpdate());const m=Gt((e.clientX-b)/l*ye,this.stepSize,{wrapAround:!1,maxHours:24}),f=Math.min(_,Math.max(v,m));(0!==f||E)&&(d[i]=Object.assign(Object.assign({},d[i]),{Time:Kt(c+f),SpecialTime:""}),d[i+1]=Object.assign(Object.assign({},d[i+1]),{Time:Kt(h+f),SpecialTime:""}),E=!0,this.requestUpdate())};const A=e=>{var s;if(e&&e.pointerId!==y)return;window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",A),window.removeEventListener("pointercancel",A),window.removeEventListener("blur",D),(null===(s=r.hasPointerCapture)||void 0===s?void 0:s.call(r,y))&&r.releasePointerCapture(y);const o=this._dropDay;this._dropDay="",this._dragGhost=void 0,P=()=>{},setTimeout(()=>{this.isDragging=!1},100),o?(d[i]=Object.assign(Object.assign({},d[i]),{Time:Kt(c)}),d[i+1]=Object.assign(Object.assign({},d[i+1]),{Time:Kt(h)}),this._copyPeriodToDay(t.day,i,o,c,h)):E&&this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}}))},D=()=>A();window.addEventListener("pointerup",A),window.addEventListener("pointercancel",A),window.addEventListener("blur",D),window.addEventListener("pointermove",P,{passive:!1})}_copyPeriodToDay(e,t,i,s,o){const a=this.schedule.ScheduleData[Ee.indexOf(e)].slots[t],r=this.schedule.ScheduleData[Ee.indexOf(i)],n=[...r.slots].sort((e,t)=>Ft(e.Time)-Ft(t.Time));let l,d,c,h,p=Nt(r,-1,this.schedule);for(const e of n){if(!(Ft(e.Time)<=o))break;p=e.Setpoint,l=e.UpperSetpoint,d=e.PassiveScheduled,c=e.PassiveMode,h=e.PassiveStrategy}const u=n.filter(e=>{const t=Ft(e.Time);return t<s||t>=o});u.push({Time:Kt(s),Setpoint:a.Setpoint,UpperSetpoint:a.UpperSetpoint,PassiveScheduled:a.PassiveScheduled,PassiveMode:a.PassiveMode,PassiveStrategy:a.PassiveStrategy,SpecialTime:""}),o<ye&&!u.some(e=>Ft(e.Time)===o)&&u.push({Time:Kt(o),Setpoint:p,UpperSetpoint:l,PassiveScheduled:d,PassiveMode:c,PassiveStrategy:h,SpecialTime:""}),r.slots=u.sort((e,t)=>Ft(e.Time)-Ft(t.Time)),this.dispatchEvent(new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}})),this.requestUpdate()}computeDayLabel(e){return B`
      <div class="day  ${this._show_short_days?"short":""}">
        ${this._show_short_days?this.localize("wiser.days.short."+e.toLowerCase()):this.localize("wiser.days."+e.toLowerCase())}
      </div>
    `}computeSetpointLabel(e){var t;if("Unknown"==e)return e;const i=this.scheduleTypeKey;return"Heating"===i&&-20==e?"Off":"HotWater"===i&&this.presetOption(e)?e:e+(null!==(t=xe[i])&&void 0!==t?t:"")}computeTemperatureRangeLabel(e){if(e.PassiveScheduled&&!e.PassiveMode)return this.computeSetpointLabel(this.scheduledPassiveOffTemperature(e));const t=this.computeSetpointLabel(e.Setpoint);return this.passiveTemperatureRange&&void 0!==e.UpperSetpoint?-20===Number(e.UpperSetpoint)?t:`${t}–${e.UpperSetpoint}°C`:t}passiveControlTitle(e){if(!(null==e?void 0:e.PassiveScheduled))return"";const t=e.PassiveMode?this.localize(`wiser.heating.strategy_${e.PassiveStrategy||"modulating"}`):this.localize("wiser.heating.off");return`\n${this.localize("wiser.heating.passive")} - ${t}`}static get styles(){return n`
      ${Jt}
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        max-width: 100%;
        container: schedule-editor / inline-size;
      }
      .copy-section {
        order: 3;
      }
      .slots-wrapper {
        order: 1;
      }
      .schedule-editor-area {
        order: 2;
      }
      div.outer {
        width: 100%;
        overflow: visible;
      }
      div.outer.drop-target {
        border-radius: 7px;
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      }
      .period-drag-ghost {
        position: absolute;
        z-index: 1000;
        box-sizing: border-box;
        display: grid;
        place-items: center;
        overflow: hidden;
        border: 2px dashed var(--disabled-text-color);
        border-radius: 5px;
        opacity: 0.62;
        box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.3));
        font-size: calc(12px + 1pt);
        font-weight: 700;
        line-height: 1;
        pointer-events: none;
        user-select: none;
      }
      .period-drag-ghost.valid {
        border-color: var(--primary-color);
        opacity: 0.82;
      }
      div.wrapper,
      div.time-wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        display: flex;
      }
      div.sub-section {
        display: flex;
        justify-content: center;
        width: 100%;
      }
      .schedule-editor-area {
        box-sizing: border-box;
        width: 100%;
        margin-inline-start: 0;
      }
      .schedule-editor-area.short {
        width: 100%;
        margin-inline-start: 0;
      }
      .selected-period {
        box-sizing: border-box;
        width: min(100% - 24px, 780px);
        margin: 0 auto 14px;
        padding: 18px 22px 16px;
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        background: var(--ha-card-background, var(--card-background-color));
        box-shadow: var(--ha-card-box-shadow, none);
      }
      .selected-period.disabled {
        opacity: 0.45;
      }
      .selected-period-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
      }
      .selected-period-controls {
        box-sizing: border-box;
        width: 100%;
        max-width: 736px;
        margin-inline: auto;
        padding-top: 2px;
      }
      .selected-period-header h3 {
        margin: 0 0 3px;
        color: var(--primary-text-color);
        font-size: var(--ha-font-size-l, 18px);
        line-height: 1.3;
      }
      .selected-period-header span {
        color: var(--secondary-text-color);
        font-size: var(--ha-font-size-m, 16px);
        line-height: 1.4;
      }
      .editor-control-row {
        display: grid;
        grid-template-columns: minmax(148px, 170px) minmax(0, 1fr);
        align-items: start;
        gap: 12px;
        width: 100%;
        padding-top: 4px;
      }
      .editor-control-row > .section-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-height: 44px;
        box-sizing: border-box;
        padding-inline: 0;
        text-align: end;
      }
      .heating-control-row > .section-header {
        transform: translateY(3px);
      }
      .level-control-row > .section-header {
        transform: translateY(-4px);
      }
      .control-content {
        min-width: 0;
      }
      .switch-control {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-height: 44px;
      }
      .special-times,
      .state-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        min-height: 44px;
      }
      .special-times {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--secondary-background-color, var(--card-background-color));
      }
      .special-times ha-button {
        flex: 1 1 0;
        min-height: 46px;
        border: 0;
        border-radius: 0;
        color: var(--primary-text-color);
        background: transparent;
        --mdc-theme-primary: var(--primary-text-color);
        --ha-button-height: 46px;
      }
      .special-times ha-button:first-child {
        border-radius: 11px 0 0 11px;
      }
      .special-times ha-button + ha-button {
        border-left: 1px solid var(--divider-color);
      }
      .special-times ha-button.selected {
        color: var(--text-primary-color, #fff);
        background: var(--primary-color);
        --mdc-theme-primary: var(--text-primary-color, #fff);
        --ha-button-filled-container-color: var(--primary-color);
        --ha-button-filled-label-text-color: var(--text-primary-color, #fff);
      }
      .special-times ha-button::part(base) {
        min-height: 46px;
        border: 0;
        border-radius: 0;
        color: var(--primary-text-color);
        background: transparent;
      }
      .passive-strategy-controls ha-button::part(base) {
        padding-inline: 8px;
        white-space: normal;
      }
      .special-times ha-button.selected::part(base) {
        color: var(--text-primary-color, #fff);
        background: var(--primary-color);
      }
      .state-controls {
        gap: 20px;
      }
      .state-choice {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        cursor: pointer;
      }
      .state-choice:has(input:disabled) {
        opacity: 0.38;
        cursor: default;
      }
      .preset-controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px 18px;
        min-height: 44px;
      }
      .preset-choice {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 38px;
        cursor: pointer;
      }
      .preset-choice ha-icon {
        color: var(--primary-color);
      }
      .preset-choice:has(input:disabled) {
        opacity: 0.38;
        cursor: default;
      }
      .temperature-input {
        display: flex;
        align-items: center;
        width: 100%;
      }
      .temperature-input wiser-variable-slider,
      .level-control wiser-variable-slider {
        display: block;
        min-width: 0;
      }
      .slider-leading-spacer {
        visibility: hidden;
        pointer-events: none;
      }
      .section-header {
        color: var(--primary-text-color);
        text-transform: uppercase;
        font-weight: 500;
        font-size: calc(var(--material-small-font-size, 12px) + 1pt);
        padding: 5px 10px;
      }
      .copy-section {
        box-sizing: border-box;
        width: min(100% - 24px, 1040px);
        margin: 0 auto;
        padding-top: 2px;
      }
      .copy-section > div > .section-header {
        padding-inline: 0;
      }
      .copy-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .copy-options ha-button {
        border: 1px solid var(--primary-color);
        border-radius: 10px;
      }
      @container schedule-editor (min-width: 1350px) {
        .copy-section.compact {
          position: absolute;
          z-index: 4;
          bottom: calc(100% + 42px);
          right: 12px;
          left: calc(var(--wiser-schedule-picker-width, 420px) + 20px);
          width: auto;
          max-width: none;
          padding-top: 0;
        }
        .copy-section.compact .copy-options {
          flex-wrap: nowrap;
        }
        .copy-section.compact .copy-options ha-button {
          flex: 1 1 auto;
          min-width: 0;
        }
      }
      @media (max-width: 600px) {
        .copy-section,
        .copy-section.compact {
          order: 3;
        }
        .schedule-editor-area,
        .schedule-editor-area.short {
          width: 100%;
          margin-inline-start: 0;
        }
        .selected-period {
          width: 100%;
          padding: 14px 12px;
        }
        .selected-period-controls {
          max-width: none;
        }
        .editor-control-row {
          grid-template-columns: minmax(0, 1fr);
          gap: 4px;
        }
        .passive-period-toggle {
          grid-template-columns: minmax(0, 1fr) auto;
        }
        .editor-control-row.passive-period-toggle > .section-header {
          min-height: 44px;
        }
        .editor-control-row > .section-header {
          justify-content: flex-start;
          min-height: 28px;
          text-align: start;
        }
        .special-times {
          width: 100%;
          flex-wrap: nowrap;
          gap: 0;
        }
        .special-times ha-button,
        .special-times ha-button:first-child,
        .special-times ha-button:last-child {
          flex: 1 1 0;
          border: 0;
        }
        .special-times ha-button + ha-button {
          border-top: 0;
          border-left: 1px solid var(--divider-color);
        }
        .heating-control-row > .section-header,
        .level-control-row > .section-header {
          display: none;
        }
        .state-control-row {
          grid-template-columns: minmax(72px, 88px) minmax(0, 1fr);
          gap: 8px;
        }
        .state-control-row > .section-header {
          justify-content: flex-end;
          min-height: 44px;
          text-align: end;
        }
        .passive-strategy-row > .section-header {
          display: none;
        }
        .passive-strategy-controls {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: stretch;
          width: 100%;
        }
        .passive-strategy-controls ha-button {
          display: block;
          width: 100%;
          height: 56px;
          min-width: 0;
          --ha-button-height: 56px;
        }
      }
      .slot {
        float: left;
        background: rgba(var(--rgb-primary-color), 0.7);
        height: 60px;
        box-sizing: border-box;
        transition: background 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        position: relative;
        height: 40px;
        line-height: 40px;
        font-size: calc(10px + 1pt);
        text-align: center;
      }
      .slot:first-child {
        border-radius: 5px 0 0 5px;
      }
      .slot:last-child {
        border-radius: 0 5px 5px 0;
      }
      .slot:only-child {
        border-radius: 5px;
      }
      .slot.previous {
        cursor: default;
      }
      .slot.selected {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      .slot.selected.movable,
      .slot.selected.movable .slotoverlay {
        cursor: grab;
        touch-action: none;
        user-select: none;
      }
      .slot.selected.movable:active,
      .slot.selected.movable:active .slotoverlay {
        cursor: grabbing;
      }
      .setpoint {
        z-index: 3;
        position: relative;
        text-align: center;
      }
      .slotoverlay {
        position: absolute;
        display: hidden;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /*background-color: rgba(0,0,0,0.5);*/
        z-index: 2;
      }
      div.slot.selectable {
        cursor: pointer;
      }

      .previous {
        display: block;
        background: repeating-linear-gradient(
          135deg,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0) 7px,
          rgba(255, 255, 255, 0.12) 7px,
          rgba(255, 255, 255, 0.12) 12px
        );
        border-radius: 5px 0 0 5px;
      }
      .previous.selected {
        border: 2px solid var(--primary-color);
      }
      .previous.selected.theme-colors {
        border: 2px solid var(--warning-color);
      }
      .wrapper.selectable .slot:hover {
        background: rgba(var(--rgb-primary-color), 0.85);
      }
      .wrapper.selectable .slot.inactive-level:hover {
        background: var(--secondary-background-color, #eeeeee);
      }
      .slot:not(:first-child) {
        border-left: 1px solid var(--card-background-color);
      }
      .slot.active {
        background: rgba(var(--rgb-accent-color), 0.7);
      }
      .slot.noborder {
        border: none;
      }
      .wrapper.selectable .slot.active:hover {
        background: rgba(var(--rgb-accent-color), 0.85);
      }
      .wrapper .day.short {
        max-width: 50px;
      }
      .wrapper .day {
        line-height: 42px;
        float: left;
        width: 20%;
        max-width: 100px;
      }
      .wrapper .schedule {
        position: relative;
        width: 100%;
        height: 40px;
        border-radius: 5px;
        overflow: auto;
        margin-bottom: 2px;
        display: flex;
      }
      .setpoint.rotate {
        z-index: 3;
        transform: rotate(-90deg);
        position: absolute;
        top: 20px;
        height: 0px !important;
        width: 100%;
        overflow: visible !important;
      }
      div.time-wrapper div {
        float: left;
        display: flex;
        position: relative;
        height: 25px;
        line-height: 25px;
        font-size: calc(12px + 1pt);
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;
      }
      div.time-wrapper div.time:before {
        content: ' ';
        background: var(--disabled-text-color);
        position: absolute;
        left: 0px;
        top: 0px;
        width: 1px;
        height: 5px;
        margin-left: 50%;
        margin-top: 0px;
      }
      .slot span {
        font-size: calc(12px + 1pt);
        color: var(--slot-label-color, var(--text-primary-color));
        font-weight: 700;
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        transition: margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        word-break: nowrap;
        white-space: normal;
        overflow: hidden;
        line-height: 1em;
      }
      div.handle {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 36px;
        transform: translateX(-50%);
        display: grid;
        place-items: center;
        z-index: 5;
        cursor: ew-resize;
        touch-action: none;
        user-select: none;
      }
      div.handle.end-handle {
        left: 100%;
      }
      div.tooltip-container.end-time {
        left: 100%;
      }
      div.button-holder {
        line-height: 0;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
      }
      ha-icon-button.time-handle {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        --ha-button-height: 32px;
        --wa-form-control-height: 32px;
        --ha-icon-button-padding-inline: 0px;
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 24px;
        --ha-icon-button-size: 32px;
        width: 32px;
        height: 32px;
        margin: 0;
        padding: 0;
        color: var(--primary-color);
        cursor: ew-resize;
        touch-action: none;
        pointer-events: none;
      }
      .slot .special-time-marker {
        position: absolute;
        z-index: 4;
        top: 0;
        bottom: 0;
        left: -1px;
        width: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateX(-50%);
        line-height: 0;
        --primary-color: var(--primary-text-color);
        color: var(--primary-text-color);
        filter: drop-shadow(0 0 1px var(--card-background-color));
        pointer-events: none;
      }
      .slot .special-time-marker ha-icon {
        display: block;
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        color: var(--primary-text-color) !important;
      }
      div.tooltip-container {
        position: absolute;
        margin-top: 0;
        margin-left: -40px;
        width: 80px;
        height: 0px;
        text-align: center;
        line-height: 35px;
        z-index: 3;
        top: -48px;
      }

      div.tooltip-container.visible {
        display: block;
      }
      div.tooltip-container.left {
        margin-left: -80px;
        text-align: right;
      }
      div.tooltip-container.right {
        margin-left: 0px;
        text-align: left;
      }
      div.tooltip {
        display: inline-flex;
        margin: 0px auto;
        border-radius: 5px;
        color: var(--text-primary-color);
        font-size: calc(18px + 1pt);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        padding: 4px 10px;
        text-align: center;
        line-height: 28px;
        z-index: 5;
        transition: all 0.1s ease-in;
        transform-origin: center bottom;
        --tooltip-color: var(--primary-color);
        background: var(--primary-color);
      }
      div.tooltip.active {
        --tooltip-color: rgba(var(--rgb-accent-color), 0.7);
      }
      div.tooltip-container.left div.tooltip {
        transform-origin: right bottom;
      }
      div.tooltip-container.right div.tooltip {
        transform-origin: left bottom;
      }
      div.tooltip-container.center div.tooltip:before {
        content: ' ';
        width: 0px;
        height: 0px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid var(--primary-color);
        position: absolute;
        margin-top: 36px;
        margin-left: calc(50% - 6px);
        top: 0px;
        left: 0px;
      }
      div.tooltip-container.left div.tooltip:before {
        content: ' ';
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 8px solid var(--tooltip-color);
        opacity: 1;
        position: absolute;
        margin-top: 15px;
        margin-left: calc(100% - 8px);
        left: 0px;
        top: 0px;
        width: 0px;
        height: 0px;
      }
      div.tooltip-container.right div.tooltip:before {
        content: ' ';
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 8px solid var(--tooltip-color);
        opacity: 1;
        position: absolute;
        margin-top: 15px;
        margin-left: 0px;
        left: 0px;
        top: 0px;
        width: 0px;
        height: 0px;
      }
      div.tooltip ha-icon {
        --mdc-icon-size: 18px;
      }

      mwc-button.state-button {
        padding: 0px 10px;
        margin: 0 2px;
        max-width: 100px;
      }

      mwc-button.warning {
        --mdc-theme-primary: var(--error-color);
      }
      mwc-button.warning .mdc-button .mdc-button__label {
        color: var(--primary-text-color);
      }
      mwc-button.right {
        float: right;
      }
      ha-icon-button {
        --mdc-icon-button-size: 36px;
        margin-top: -6px;
        margin-left: -6px;
      }
      @keyframes fadeIn {
        99% {
          visibility: hidden;
        }
        100% {
          visibility: visible;
        }
      }

      mwc-button ha-icon {
        margin-right: 2px;
      }
      mwc-button.active {
        background: var(--primary-color);
        --mdc-theme-primary: var(--text-primary-color);
        border-radius: 4px;
      }
      ha-icon-button.set-off-button {
        margin-left: 0px;
      }
      .sub-heading {
        padding: 0px 10px 0px 10px;
        font-weight: 500;
      }
      .section-header[aria-disabled='true'] {
        color: var(--disabled-text-color);
      }
    `}};e([pe({attribute:!1})],bi.prototype,"hass",void 0),e([pe({attribute:!1})],bi.prototype,"config",void 0),e([pe({attribute:!1})],bi.prototype,"schedule",void 0),e([pe({attribute:!1})],bi.prototype,"suntimes",void 0),e([pe({attribute:!1})],bi.prototype,"editMode",void 0),e([pe({attribute:!1})],bi.prototype,"editable",void 0),e([pe({attribute:!1})],bi.prototype,"compactCopyPlacement",void 0),e([ue()],bi.prototype,"_activeSlot",void 0),e([ue()],bi.prototype,"_activeDay",void 0),e([ue()],bi.prototype,"_show_short_days",void 0),e([ue()],bi.prototype,"_dropDay",void 0),e([ue()],bi.prototype,"_dragGhost",void 0),e([ue()],bi.prototype,"rangeMin",void 0),e([ue()],bi.prototype,"rangeMax",void 0),e([ue()],bi.prototype,"stepSize",void 0),bi=e([t("wiser-schedule-slot-editor")],bi);let fi=class extends le{async showDialog(e){this._params=e,await this.updateComplete}async closeDialog(){this._params=void 0}render(){var e;return this._params?B`
      <ha-dialog
        open
        header-title=${this._params.title||this.hass.localize("state_badge.default.error")}
        .heading=${this._params.title||this.hass.localize("state_badge.default.error")}
        @closed=${this.closeDialog}
        @close-dialog=${this.closeDialog}
      >
        <div class="wrapper">${this._params.error||""}</div>
        <div
          class="actions"
          slot=${"headerTitle"in((null===(e=customElements.get("ha-dialog"))||void 0===e?void 0:e.prototype)||{})?"footer":q}
        >
          <ha-button @click=${this.closeDialog}>${this.hass.localize("ui.dialogs.generic.ok")}</ha-button>
        </div>
      </ha-dialog>
    `:B``}static get styles(){return n`
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 16px;
      }
      div.wrapper {
        color: var(--primary-text-color);
      }
    `}};e([pe({attribute:!1})],fi.prototype,"hass",void 0),e([ue()],fi.prototype,"_params",void 0),fi=e([t("wiser-dialog-error")],fi);var wi=Object.freeze({__proto__:null,get DialogError(){return fi}});let xi=class extends(Ht(le)){constructor(){var e;super(...arguments),this.schedule_id=0,this.use_heat_colors=!0,this.embedded=!1,this.assignmentSelection=[],this.assigningDevices=!1,this.rooms=[],this.entities=[],this.editMode=!1,this._current_user=null===(e=this.hass)||void 0===e?void 0:e.user,this._assigning_in_progress=0,this._save_in_progress=!1,this._delete_in_progress=!1,this._saveError="",this._undoHistory=[],this._redoHistory=[],this._canAddPeriod=!1,this._canDeletePeriod=!1,this.stepSize=5}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}isFixedSchedule(e=this.schedule){return Boolean(e&&(1e3===Math.abs(Number(e.Id))||"hotwater"===e.Type.toLowerCase()))}async initialise(){return await this._isComponentLoaded()&&(this.component_loaded=!0,await this.loadData()),!0}hassSubscribe(){return this.initialise(),[this.hass.connection.subscribeMessage(e=>this.handleUpdate(e),{type:"wiser_updated"})]}async handleUpdate(e){this.assigningDevices||this._save_in_progress||this.config.hub&&e.hub!=this.config.hub||"wiser_updated"!=e.event||await this.loadData()}async _isComponentLoaded(){return Boolean(this.hass&&this.config&&this.hass.config.components.includes("wiser"))}getSunTime(e,t){var i,s;const o=t===Te[0]?this.suntimes.Sunrises:this.suntimes.Sunsets;return(null===(i=o.find(t=>{var i;return(null===(i=t.day)||void 0===i?void 0:i.toLowerCase())===e.toLowerCase()}))||void 0===i?void 0:i.time)||(null===(s=o[Ee.indexOf(e)])||void 0===s?void 0:s.time)||"00:00"}convertLoadedSchedule(e){const t=e.ScheduleData.map(e=>this.convertLoadedScheduleDay(e));return e.ScheduleData=t,e}convertLoadedScheduleDay(e){const t=e.slots.map(t=>Te.includes(t.Time)?Object.assign(Object.assign({},t),{Time:this.getSunTime(e.day,t.Time),SpecialTime:t.Time}):Object.assign(Object.assign({},t),{Time:t.Time,SpecialTime:""})).sort((e,t)=>Ft(e.Time)-Ft(t.Time)),i=new Set(t.map(e=>JSON.stringify(e))),s=Array.from(i).map(e=>JSON.parse(e));return{day:e.day,slots:s}}convertScheduleForSaving(e){const t=e.ScheduleData.map(e=>this.convertScheduleDayForSaving(e));return e.ScheduleData=t,e}convertScheduleDayForSaving(e){const t=e.slots.map(e=>Te.includes(e.SpecialTime)?Object.assign(Object.assign({},e),{Time:e.SpecialTime,SpecialTime:e.SpecialTime}):Object.assign(Object.assign({},e),{Time:e.Time,SpecialTime:""})),i=new Set(t.map(e=>JSON.stringify(e))),s=Array.from(i).map(e=>JSON.parse(e));return{day:e.day,slots:s}}async loadData(){this.error=void 0,this.embedded||await _t(),this.schedule_type&&this.schedule_id&&!this.editMode&&(await Qe(this.hass,this.config.hub).then(e=>{this.suntimes=e}).catch(e=>{this.error=e}),await tt(this.hass,this.config.hub,this.schedule_type,this.schedule_id).then(e=>{this.schedule=this.convertLoadedSchedule(e)}).catch(e=>{this.schedule=void 0,this.error=e}),this.schedule&&await this.get_entity_list(this.hass,this.config.hub).then(e=>{this.entities=e,this.assignmentSelection=e.filter(e=>this.isAssigned(e)).map(e=>String(e.Id))}).catch(e=>{this.error=e})),await Lt(this)}async get_entity_list(e,t){return this.isFixedSchedule()?[]:"heating"==this.schedule.Type.toLowerCase()?await it(e,t):await st(e,t,this.schedule.SubType||this.schedule.Type)}shouldUpdate(e){return!(!e.has("hass")&&!e.has("component_loaded"))||(e.has("schedule_id")||e.has("schedule_type")||e.has("config")||e.has("editMode")?(this.loadData(),!0):!!(e.has("schedule")||e.has("entities")||e.has("editMode")||e.has("_assigning_in_progress")||e.has("_save_in_progress")||e.has("_saveError")||e.has("_delete_in_progress")||e.has("_tempSchedule")||e.has("_undoHistory")||e.has("_redoHistory")||e.has("_canAddPeriod")||e.has("_canDeletePeriod")||e.has("assignmentSelection")||e.has("assigningDevices")||e.has("error")&&kt(this.error)))}updated(e){var t,i;super.updated(e),this.embedded&&this.dispatchEvent(new CustomEvent("editor-state",{detail:{editing:this.editMode,saving:this._save_in_progress,ready:Boolean(this.schedule&&this.schedule.Id===this.schedule_id&&this.suntimes&&!this.error),canUndo:this.editMode&&!this._save_in_progress&&this._undoHistory.length>0,canRedo:this.editMode&&!this._save_in_progress&&this._redoHistory.length>0,canAddPeriod:this.editMode&&!this._save_in_progress&&this._canAddPeriod,canDeletePeriod:this.editMode&&!this._save_in_progress&&this._canDeletePeriod,name:this.editMode?(null===(t=this._tempSchedule)||void 0===t?void 0:t.Name)||"":(null===(i=this.schedule)||void 0===i?void 0:i.Name)||""}}))}render(){var e;return this.hass&&this.config&&this.component_loaded?kt(this.error)?B` <div role="alert">${this.error.message}</div> `:this.schedule&&this.entities&&this.suntimes?B`
        <div>
          ${this.embedded?"":this.renderToolbar()}
          ${this.embedded||this.isFixedSchedule()?"":this.renderScheduleAssignment(this.entities,this.schedule.Assignments)}
          ${this.editMode&&this._saveError?B`<p role="alert">${this._saveError}</p>`:""}
          ${this._save_in_progress?B`<p class="operation-status" role="status" aria-live="polite">
                  <span class="operation-spinner" aria-hidden="true"></span>
                  ${this.localize(this._delete_in_progress?"wiser.actions.deleting_schedule":"wiser.actions.saving_schedule")}
                </p>`:""}
          <div class="wrapper">
            <div class="schedules">
              <div class="slots-wrapper">
                <wiser-schedule-slot-editor
                  .hass=${this.hass}
                  .config=${this.config}
                  .schedule=${this.editMode?this._tempSchedule:this.schedule}
                  .schedule_type=${this.schedule_type}
                  .suntimes=${this.suntimes}
                  .editMode=${this.editMode}
                  .editable=${At(this.hass,this.config)}
                  .compactCopyPlacement=${this.embedded}
                  @scheduleChanged=${this.scheduleChanged}
                  @period-edit-requested=${this.periodEditRequested}
                  @period-state=${e=>{this._canAddPeriod=e.detail.canAdd,this._canDeletePeriod=e.detail.canDelete}}
                ></wiser-schedule-slot-editor>
              </div>
            </div>
          </div>
          ${this.editMode&&At(this.hass,this.config)?B` <div class="save-actions">
                  <ha-button appearance="plain" .disabled=${this._save_in_progress} @click=${()=>this.cancelClick()}
                    >${this.hass.localize("ui.common.cancel")}</ha-button
                  >
                  <ha-button
                    .disabled=${this._save_in_progress||!(null===(e=this._tempSchedule)||void 0===e?void 0:e.Name.trim())}
                    @click=${()=>this.saveClick()}
                    >${this.hass.localize("ui.common.save")}</ha-button
                  >
                </div>`:""}
          ${this.embedded||this.editMode||this.isFixedSchedule()||!At(this.hass,this.config)?"":B`<div class="save-actions">
                  <ha-button
                    .disabled=${this.assigningDevices||this._save_in_progress||!this.entities.some(e=>this.isAssigned(e)!==this.assignmentSelection.includes(String(e.Id)))}
                    @click=${()=>this.applyDeviceAssignments()}
                    >${this.hass.localize("ui.common.save")}</ha-button
                  >
                </div>`}
        </div>
      `:B``:B``}isAssigned(e){var t;return Boolean(null===(t=this.schedule)||void 0===t?void 0:t.Assignments.some(t=>{var i,s;const o=t,a=null!==(i=o.id)&&void 0!==i?i:o.Id;return void 0!==a?String(a)===String(e.Id):(null!==(s=o.name)&&void 0!==s?s:o.Name)===e.Name}))}renderScheduleAssignment(e,t){if(this.schedule&&!this.isFixedSchedule())return At(this.hass,this.config)?B`<div class="device-assignment ${this.editMode?"disabled":""}" aria-disabled=${this.editMode}>
      <ha-selector
        .hass=${this.hass}
        .label=${this.localize("wiser.home.assign_devices")}
        .selector=${{select:{multiple:!0,mode:"dropdown",options:e.map(e=>({value:String(e.Id),label:e.Name}))}}}
        .value=${this.assignmentSelection}
        .required=${!1}
        .disabled=${this.assigningDevices||this.editMode||!e.length}
        @value-changed=${t=>{var i;if(t.stopPropagation(),this.assigningDevices||this.editMode)return;const s=null!==(i=t.detail.value)&&void 0!==i?i:[];Array.isArray(s)&&s.every(t=>e.some(e=>String(e.Id)===t))&&(this.assignmentSelection=s)}}
      ></ha-selector>
      ${e.length?"":B`<p>${this.localize("wiser.home.no_devices")}</p>`}
    </div>`:B`<p>
        ${e.filter(e=>this.isAssigned(e)).map(e=>e.Name).join(", ")||this.localize("wiser.headings.not_assigned")}
      </p>`}async applyDeviceAssignments(){if(!this.schedule||this.assigningDevices||this.editMode||this.isFixedSchedule()||!At(this.hass,this.config))return;const e=(this.entities||[]).filter(e=>this.isAssigned(e)!==this.assignmentSelection.includes(String(e.Id)));this.assigningDevices=!0;try{for(const t of e)await ot(this.hass,this.config.hub,this.schedule.Type,this.schedule.Id,String(t.Id),!this.assignmentSelection.includes(String(t.Id)));await this.loadData()}catch(e){await this.loadData(),lt(this,"Schedule assignment",e.message||this.localize("common.load_failed"))}finally{this.assigningDevices=!1}}renderEntityButton(e,t){return B`
      <button
        type="button"
        id=${e.Id}
        class=${t?"active":""}
        appearance=${t?"accent":"plain"}
        size="small"
        ?disabled=${Boolean(this._assigning_in_progress)}
        aria-pressed=${t}
        @click=${this.entityAssignmentClick}
      >
        ${this._assigning_in_progress==e.Id?B`<span class="waiting"><progress aria-label="Working"></progress></span>`:null}
        ${e.Name}
      </button>
    `}tool(e,t,i,s=!1){return B`<button
      type="button"
      class="tool"
      title=${e}
      aria-label=${e}
      ?disabled=${s}
      @click=${i}
    >
      <ha-icon .icon=${t} aria-hidden="true"></ha-icon>
    </button>`}renderEditableTitle(){var e;return B`<input
      slot="heading"
      class="editable-title"
      type="text"
      required
      aria-label=${this.localize("wiser.headings.schedule_name")}
      .value=${(null===(e=this._tempSchedule)||void 0===e?void 0:e.Name)||""}
      ?disabled=${this._save_in_progress}
      @focus=${()=>this.beginNameEdit()}
      @input=${e=>{this.updateName(e.target.value)}}
      @change=${()=>this.commitNameEdit()}
    />`}renderToolbar(){var e;const t=At(this.hass,this.config),i=this.assigningDevices||this._save_in_progress,s=this.isFixedSchedule();return B` <input
        class="import-file"
        type="file"
        accept=".json,application/json"
        hidden
        @change=${e=>{var t;const i=e.target,s=null===(t=i.files)||void 0===t?void 0:t[0];i.value="",s&&this.importSchedule(s)}}
      />
      <wiser-card-header .config=${this.config}>
        ${this.editMode&&!s?this.renderEditableTitle():B`<h3 slot="heading" class="schedule-title">
                ${this.editMode&&(null===(e=this._tempSchedule)||void 0===e?void 0:e.Name)||this.schedule.Name}
              </h3>`}
        <div class="tools" role="toolbar" aria-label=${this.localize("wiser.headings.schedule_actions")}>
          ${this.config.selected_schedule?"":this.tool(this.hass.localize("ui.common.back"),"mdi:arrow-left",()=>this.editMode?this.cancelClick():this.backClick(),i)}
          ${t?this.tool(this.localize("wiser.actions.export"),"mdi:download",()=>this.exportSchedule(),i||this.editMode):""}
          ${t?this.tool(this.localize("wiser.actions.import"),"mdi:upload",()=>{var e;return null===(e=this.renderRoot.querySelector(".import-file"))||void 0===e?void 0:e.click()},i||this.editMode):""}
          ${this.tool(this.hass.localize("ui.common.undo"),"mdi:undo",()=>this.undoClick(),!this.editMode||this._save_in_progress||!this._undoHistory.length)}
          ${this.tool(this.hass.localize("ui.common.redo"),"mdi:redo",()=>this.redoClick(),!this.editMode||this._save_in_progress||!this._redoHistory.length)}
          ${t?B`
                  ${this.tool(this.hass.localize("ui.common.edit"),"mdi:pencil",()=>this.editClick(),i||this.editMode)}
                  ${this.tool(this.localize("wiser.actions.copy"),"mdi:content-copy",()=>this.copyClick(),i||this.editMode||s)}
                  ${this.editMode?this.tool(this.localize("wiser.actions.delete_period"),"mdi:delete-outline",()=>this.deletePeriod(),i||!this._canDeletePeriod):this.tool(this.hass.localize("ui.common.delete"),"mdi:delete-outline",()=>this.deleteClick(),i||s)}
                  ${this.tool(this.localize("wiser.actions.add_period"),"mdi:plus",()=>this.addPeriod(),i||!this.editMode||!this._canAddPeriod)}
                `:""}
        </div>
      </wiser-card-header>`}async entityAssignmentClick(e){const t=e.currentTarget;if(!(this._assigning_in_progress||this.editMode||this.isFixedSchedule())&&At(this.hass,this.config)){this._assigning_in_progress=parseInt(t.id);try{await ot(this.hass,this.config.hub,this.schedule_type,this.schedule_id,t.id,t.classList.contains("active")),await this.loadData()}catch(e){lt(this,"Schedule assignment",e.message||this.localize("common.load_failed"))}finally{this._assigning_in_progress=0}}}backClick(){const e=new CustomEvent("backClick");this.dispatchEvent(e)}editClick(){this.schedule&&this.schedule.Id===this.schedule_id&&At(this.hass,this.config)&&(this._tempSchedule=this.cloneSchedule(this.schedule),this.resetHistory(this._tempSchedule),this.editMode=!this.editMode)}async periodEditRequested(e){var t,i;if(e.stopPropagation(),this.editMode||!At(this.hass,this.config))return;const{day:s,slot:o}=e.detail;this.editClick(),await this.updateComplete,null===(i=null===(t=this.renderRoot.querySelector("wiser-schedule-slot-editor"))||void 0===t?void 0:t.selectPeriod)||void 0===i||i.call(t,s,o)}copyClick(){const e=new CustomEvent("copyClick");this.dispatchEvent(e)}exportSchedule(){if(!this.schedule)return;const e=URL.createObjectURL(new Blob([Rt(this.schedule)],{type:"application/json"})),t=document.createElement("a");t.href=e,t.download=jt(this.schedule.Name,this.schedule.SubType||this.schedule.Type),t.click(),setTimeout(()=>URL.revokeObjectURL(e),1e3)}async importSchedule(e){if(this.schedule&&!this.editMode&&At(this.hass,this.config))try{if(e.size>1048576)throw new Error("Schedule file is too large.");const t=function(e,t){var i,s,o,a,r;const n=JSON.parse(e);if("wiser-schedule"!==n.format||![1,2].includes(n.version))throw new Error("Unsupported schedule file.");const l=n.schedule,d=(t.SubType||t.Type).toLowerCase();if(!l||(null===(i=l.SubType||l.Type)||void 0===i?void 0:i.toLowerCase())!==d)throw new Error("This file is for a different schedule type.");const c=2===n.version&&!0===l.PassiveRange,h=2===n.version&&!0===l.PassiveControl,p=c||h;if(p&&"heating"!==d)throw new Error("Passive scheduling requires a heating schedule.");if(c&&!h&&!0!==t.PassiveRange)throw new Error("This schedule does not use a Passive Mode temperature range.");if(h&&!0!==(null===(s=t.Capabilities)||void 0===s?void 0:s.PassiveControl))throw new Error("This Wiser integration does not support Passive Mode scheduling.");if(!Array.isArray(l.ScheduleData)||7!==l.ScheduleData.length)throw new Error("The file must contain all seven days.");const u=new Set;let g=0;const m=l.ScheduleData.map(e=>{if(!Ee.includes(e.day)||u.has(e.day)||!Array.isArray(e.slots)||e.slots.length>8)throw new Error("Invalid schedule days or slots.");u.add(e.day);const t=new Set;return{day:e.day,slots:e.slots.map(e=>{const i=Te.includes(e.Time)?e.Time:"",s=Te.includes(e.SpecialTime)?e.SpecialTime:"";if(e.SpecialTime&&!s||i&&s&&i!==s)throw new Error("Invalid special time.");const o=s||i,a=Boolean(o),r=o||e.Time;if(!a&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.Time)||a&&!["lighting","shutters"].includes(d)||t.has(r))throw new Error("Invalid or duplicate slot time.");t.add(r);const n=String(e.Setpoint),l=Number(n);if(!("heating"===d?Number.isFinite(l)&&(-20===l||l>=5&&l<=30):["lighting","shutters"].includes(d)?Number.isFinite(l)&&l>=0&&l<=100:["On","Off"].includes(n)))throw new Error("Invalid schedule setting.");const u={Time:r,Setpoint:n,SpecialTime:o};if(p){const t=!!h&&e.PassiveScheduled,i=void 0!==e.UpperSetpoint&&null!==e.UpperSetpoint&&""!==e.UpperSetpoint,s=Number(e.UpperSetpoint);if(c&&!h&&!i||h&&"boolean"!=typeof t||i&&(!Number.isFinite(s)||-20!==s&&(s<5||s>30)||s<l)||t&&(!i||"boolean"!=typeof e.PassiveMode||!["modulating","temperature_limiter"].includes(e.PassiveStrategy)))throw new Error("Invalid passive schedule setting.");i&&(u.UpperSetpoint=s),h&&(u.PassiveScheduled=t,t&&(u.PassiveMode=e.PassiveMode,u.PassiveStrategy=e.PassiveStrategy))}return g++,u})}});if(!g)throw new Error("The schedule has no time slots.");const v=Object.assign(Object.assign({},t),{ScheduleData:m});return h?(v.PassiveControl=!0,v.PassiveRange=!0,null!==(o=v.PassiveRangeType)&&void 0!==o||(v.PassiveRangeType="scheduled"),null!==(a=v.MinUpperSetpoint)&&void 0!==a||(v.MinUpperSetpoint=5),null!==(r=v.MaxUpperSetpoint)&&void 0!==r||(v.MaxUpperSetpoint=30)):c?(delete v.PassiveControl,v.PassiveRange=!0):(delete v.PassiveControl,delete v.PassiveRange,delete v.PassiveRangeType,delete v.MinUpperSetpoint,delete v.MaxUpperSetpoint),v}(await e.text(),this.schedule);this._tempSchedule=this.convertLoadedSchedule(t),this.resetHistory(this._tempSchedule),this.editMode=!0}catch(e){lt(this,"Import schedule",e.message)}}filesClick(){const e=new CustomEvent("filesClick");this.dispatchEvent(e)}async deleteClick(e){if(this._save_in_progress||!At(this.hass,this.config))return;const t=(null==e?void 0:e.target)||this;if(await new Promise(e=>{ve(t,"show-dialog",{dialogTag:"wiser-dialog-delete-confirm",dialogImport:()=>Promise.resolve().then(function(){return ti}),dialogParams:{cancel:()=>{e(!1)},confirm:()=>{e(!0)},name:this.schedule.Name}})})){this._delete_in_progress=!0,this._save_in_progress=!0,await this.updateComplete;try{await(i=this.hass,s=this.config.hub,o=this.schedule.Type,a=this.schedule.Id,i.callWS({type:"wiser/schedule/delete",hub:s,schedule_type:o,schedule_id:a})),this.dispatchEvent(new CustomEvent("scheduleDeleted"))}catch(e){lt(this,this.localize("wiser.headings.delete_schedule"),this.operationError(e,"wiser.helpers.delete_schedule_failed"))}finally{this._delete_in_progress=!1,this._save_in_progress=!1}}var i,s,o,a}cancelClick(){this.editMode=!1,this._saveError="",this.resetHistory()}addPeriod(){var e,t;null===(t=null===(e=this.renderRoot.querySelector("wiser-schedule-slot-editor"))||void 0===e?void 0:e.addPeriod)||void 0===t||t.call(e)}deletePeriod(){var e,t;null===(t=null===(e=this.renderRoot.querySelector("wiser-schedule-slot-editor"))||void 0===e?void 0:e.deletePeriod)||void 0===t||t.call(e)}cloneSchedule(e){return JSON.parse(JSON.stringify(e))}resetHistory(e){this._undoHistory=[],this._redoHistory=[],this._historySnapshot=e?this.cloneSchedule(e):void 0,this._nameEditSnapshot=void 0}schedulesMatch(e,t){return Boolean(e&&t&&JSON.stringify(e)===JSON.stringify(t))}recordHistory(e){const t=this.cloneSchedule(e);if(!this._historySnapshot)return this._historySnapshot=t,void(this._tempSchedule=t);this.schedulesMatch(this._historySnapshot,t)||(this._undoHistory=[...this._undoHistory.slice(-99),this.cloneSchedule(this._historySnapshot)],this._redoHistory=[],this._historySnapshot=this.cloneSchedule(t),this._tempSchedule=t)}beginNameEdit(){this._tempSchedule&&!this._nameEditSnapshot&&(this._nameEditSnapshot=this.cloneSchedule(this._tempSchedule))}updateName(e){this._tempSchedule&&(this._tempSchedule=Object.assign(Object.assign({},this._tempSchedule),{Name:e}))}commitNameEdit(){if(!this._nameEditSnapshot||!this._tempSchedule)return;const e=this._nameEditSnapshot;this._nameEditSnapshot=void 0,this.schedulesMatch(e,this._tempSchedule)||(this._undoHistory=[...this._undoHistory.slice(-99),e],this._redoHistory=[],this._historySnapshot=this.cloneSchedule(this._tempSchedule))}clearEditorSelection(){var e,t;null===(t=null===(e=this.renderRoot.querySelector("wiser-schedule-slot-editor"))||void 0===e?void 0:e.clearSelection)||void 0===t||t.call(e)}undoClick(){this.commitNameEdit();const e=this._undoHistory[this._undoHistory.length-1];e&&this._tempSchedule&&(this._redoHistory=[...this._redoHistory,this.cloneSchedule(this._tempSchedule)],this._undoHistory=this._undoHistory.slice(0,-1),this._tempSchedule=this.cloneSchedule(e),this._historySnapshot=this.cloneSchedule(e),this.clearEditorSelection())}redoClick(){this.commitNameEdit();const e=this._redoHistory[this._redoHistory.length-1];e&&this._tempSchedule&&(this._undoHistory=[...this._undoHistory,this.cloneSchedule(this._tempSchedule)],this._redoHistory=this._redoHistory.slice(0,-1),this._tempSchedule=this.cloneSchedule(e),this._historySnapshot=this.cloneSchedule(e),this.clearEditorSelection())}validateSchedule(e){return e.ScheduleData.some(e=>e.slots.length>0)}scheduleValidationError(e){const t=e.ScheduleData.find(e=>e.slots.length>8);return t?this.localize("wiser.helpers.too_many_periods").replace("{day}",this.localize(`wiser.days.${t.day.toLowerCase()}`)).replace("{max}",String(8)):""}operationError(e,t){const i=null==e?void 0:e.message;return!i||/^unknown error\b/i.test(i)?this.localize(t):i}async saveClick(){var e,t,i;if(this._save_in_progress||!(null===(e=this._tempSchedule)||void 0===e?void 0:e.Name.trim())||!At(this.hass,this.config))return;const s=this.scheduleValidationError(this._tempSchedule);if(s)this._saveError=s;else{this._save_in_progress=!0,this._saveError="";try{if(await this.updateComplete,this.validateSchedule(this._tempSchedule)){const e=JSON.parse(JSON.stringify(this._tempSchedule)),s=$e.includes((null===(t=this.schedule)||void 0===t?void 0:t.SubType)||this.schedule_type)?this.convertScheduleForSaving(e):e;await((e,t,i,s,o)=>e.callWS({type:"wiser/schedule/save",hub:t,schedule_type:i,schedule_id:s,schedule:o}))(this.hass,this.config.hub,this.schedule_type,this.schedule_id,s);const o=e.Name.trim();o!==(null===(i=this.schedule)||void 0===i?void 0:i.Name)&&await nt(this.hass,this.config.hub,this.schedule_type,this.schedule_id,o),this.editMode=!1,this.resetHistory(),await this.loadData()}else lt(this,"Error Saving Schedule","The schedule you are trying to save has no time slots.")}catch(e){this._saveError=this.operationError(e,"wiser.helpers.save_schedule_failed")}finally{this._save_in_progress=!1}}}scheduleChanged(e){this.recordHistory(e.detail.schedule)}static get styles(){return n`
      ${Xt}
      .schedule-heading {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .schedule-title {
        margin: 0;
        font-size: calc(22px + 1pt);
      }
      .tools {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-inline-start: auto;
      }
      .tool {
        width: 44px;
        height: 44px;
        padding: 0;
        display: grid;
        place-items: center;
        color: var(--secondary-text-color);
      }
      .tool:disabled {
        color: var(--disabled-text-color);
        opacity: 1;
      }
      .tool:not(:disabled):hover {
        color: var(--primary-color);
      }
      .operation-status {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 24px;
        margin: 12px 0;
        color: var(--secondary-text-color);
      }
      .operation-spinner {
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        border: 2px solid currentColor;
        border-inline-end-color: transparent;
        border-radius: 50%;
        animation: operation-spin 0.8s linear infinite;
      }
      @keyframes operation-spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .operation-spinner {
          animation: none;
        }
      }
      @media (max-width: 600px) {
        .tools {
          width: 100%;
          flex-wrap: nowrap;
          justify-content: flex-start;
          gap: 2px;
          margin-inline-start: 0;
        }
        .tool {
          flex: 1 1 0;
          width: auto;
          min-width: 0;
          max-width: 44px;
          height: 40px;
          min-height: 40px;
          padding: 0;
        }
      }

      .device-assignment {
        max-width: 420px;
        margin: 20px 0;
        display: grid;
        gap: 8px;
      }
      .device-assignment.disabled {
        opacity: 0.45;
        pointer-events: none;
      }
      .device-assignment button {
        justify-self: start;
      }
      :host {
        display: block;
        max-width: 100%;
      }
      div.outer {
        width: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        border-radius: 5px;
      }
      div.wrapper,
      div.time-wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
      }
      div.assignment-wrapper,
      div.actions-wrapper {
        border-top: 1px solid var(--divider-color, #e8e8e8);
        padding: 5px 0px;
        min-height: 40px;
      }
      div.mode {
        position: absolute;
        right: 10px;
        top: 64px;
        background: var(--primary-color);
        padding: 2px 10px;
        border-radius: 20px;
        font-size: smaller;
        color: var(--app-header-text-color);
      }
      div.action-buttons {
        display: flow-root;
      }
      span.assignment-label {
        color: var(--primary-color);
        text-transform: uppercase;
        font-weight: 500;
        font-size: calc(var(--material-small-font-size, 12px) + 1pt);
        padding: 5px 10px;
      }
      .slot {
        float: left;
        background: rgba(var(--rgb-primary-color), 0.7);
        height: 60px;
        cursor: pointer;
        box-sizing: border-box;
        transition: background 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        position: relative;
        height: 40px;
        line-height: 40px;
        font-size: calc(10px + 1pt);
        text-align: center;
        overflow: hidden;
      }
      .slot.previous {
        cursor: default;
      }
      .slot.selected {
        background: rgba(52, 143, 255, 1);
      }
      .setpoint {
        z-index: 3;
        position: relative;
        text-align: center;
      }
      .slotoverlay {
        position: absolute;
        display: hidden;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /*background-color: rgba(0,0,0,0.5);*/
        z-index: 2;
        cursor: pointer;
      }
      .previous {
        display: block;
        background: repeating-linear-gradient(
          135deg,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0) 5px,
          rgba(255, 255, 255, 0.2) 5px,
          rgba(255, 255, 255, 0.2) 10px
        );
      }
      .wrapper.selectable .slot:hover {
        background: rgba(var(--rgb-primary-color), 0.85);
      }
      .slot:not(:first-child) {
        border-left: 1px solid var(--card-background-color);
      }
      .slot:not(:last-child) {
        border-right: 1px solid var(--card-background-color);
      }
      .slot.active {
        background: rgba(var(--rgb-accent-color), 0.7);
      }
      .slot.noborder {
        border: none;
      }
      .wrapper.selectable .slot.active:hover {
        background: rgba(var(--rgb-accent-color), 0.85);
      }
      .wrapper .days .day {
        line-height: 42px;
        float: left;
        width: 100%;
      }
      .wrapper .schedules {
        position: relative;
        padding-top: 30px;
        width: 100%;
      }
      .wrapper .schedules .slots {
        height: 40px;
        border-radius: 5px;
        overflow: auto;
        margin-bottom: 2px;
        display: flex;
      }

      .setpoint.rotate {
        z-index: 3;
        transform: rotate(-90deg);
        position: absolute;
        top: 20px;
        height: 0px !important;
        width: 100%;
        overflow: visible !important;
      }
      div.schedule-action-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      div.time-wrapper div {
        float: left;
        display: flex;
        position: relative;
        height: 25px;
        line-height: 25px;
        font-size: calc(12px + 1pt);
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      div.time-wrapper div.time:before {
        content: ' ';
        background: var(--disabled-text-color);
        position: absolute;
        left: 0px;
        top: 0px;
        width: 1px;
        height: 5px;
        margin-left: 50%;
        margin-top: 0px;
      }
      .slot span {
        font-size: calc(10px + 1pt);
        color: var(--text-primary-color);
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        transition: margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        word-break: nowrap;
        white-space: normal;
        overflow: hidden;
        line-height: 1em;
      }
      div.handle {
        display: flex;
        height: 100%;
        width: 36px;
        margin-left: -19px;
        margin-bottom: -60px;
        align-content: center;
        align-items: center;
        justify-content: center;
      }
      div.button-holder {
        background: var(--card-background-color);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        visibility: hidden;
        animation: 0.2s fadeIn;
        animation-fill-mode: forwards;
      }
      .schedule-action-button {
        flex: 1 1 100px;
        padding: 0 5px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 36px;
        margin-top: -6px;
        margin-left: -6px;
      }
      @keyframes fadeIn {
        99% {
          visibility: hidden;
        }
        100% {
          visibility: visible;
        }
      }
      .card-header ha-icon-button {
        position: absolute;
        right: 6px;
        top: 6px;
      }
      .sub-heading {
        padding-bottom: 10px;
        font-weight: 500;
      }
      span.waiting {
        position: absolute;
        height: 28px;
        width: 100%;
        margin: 4px;
      }
      div.schedule-info {
        margin: 3px 0;
      }
      input.editable-title {
        display: block;
        width: 420px;
        max-width: 100%;
        height: 28px;
        min-height: 28px;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-size: calc(22px + 1pt);
        font-weight: 700;
        line-height: normal;
        border: 0;
        border-bottom: 1px solid var(--divider-color);
        border-radius: 0;
        background: transparent;
      }
      @media (min-width: 601px) and (max-width: 900px) {
        input.editable-title {
          width: 80px;
        }
      }
      @media (max-width: 600px) {
        input.editable-title {
          width: 100%;
        }
      }
      .save-actions {
        gap: 8px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-top: 24px;
      }
      ${Ge}
    `}};e([pe({attribute:!1})],xi.prototype,"config",void 0),e([pe({attribute:!1})],xi.prototype,"schedule_id",void 0),e([pe({attribute:!1})],xi.prototype,"schedule_type",void 0),e([pe({attribute:!1})],xi.prototype,"use_heat_colors",void 0),e([pe({attribute:!1})],xi.prototype,"embedded",void 0),e([ue()],xi.prototype,"assignmentSelection",void 0),e([ue()],xi.prototype,"assigningDevices",void 0),e([ue()],xi.prototype,"schedule",void 0),e([ue()],xi.prototype,"rooms",void 0),e([ue()],xi.prototype,"entities",void 0),e([ue()],xi.prototype,"suntimes",void 0),e([ue()],xi.prototype,"component_loaded",void 0),e([ue()],xi.prototype,"editMode",void 0),e([ue()],xi.prototype,"_current_user",void 0),e([ue()],xi.prototype,"_assigning_in_progress",void 0),e([ue()],xi.prototype,"_save_in_progress",void 0),e([ue()],xi.prototype,"_delete_in_progress",void 0),e([ue()],xi.prototype,"error",void 0),e([ue()],xi.prototype,"_tempSchedule",void 0),e([ue()],xi.prototype,"_saveError",void 0),e([ue()],xi.prototype,"_undoHistory",void 0),e([ue()],xi.prototype,"_redoHistory",void 0),e([ue()],xi.prototype,"_canAddPeriod",void 0),e([ue()],xi.prototype,"_canDeletePeriod",void 0),xi=e([t("wiser-schedule-edit-card")],xi);let Si=class extends le{constructor(){super(...arguments),this.component_loaded=!1,this._saving=!1,this._schedule_types=[],this._schedule_info={Name:"",Type:""},this._loadError=""}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}firstUpdated(){this.loadData().then(()=>{this.component_loaded=!0}).catch(e=>{this._loadError=(null==e?void 0:e.message)||this.localize("common.load_failed")}).then(()=>Lt(this))}async loadData(){const e=await(t=this.hass,i=this.config.hub,t.callWS({type:"wiser/schedules/types",hub:i}));var t,i;if(this._schedule_types=e.filter(e=>"hotwater"!==e.toLowerCase()&&(!this.allowed_types||this.allowed_types.some(t=>t.toLowerCase()===e.toLowerCase()))),this._schedule_info={Name:"",Type:this._schedule_types[0]||""},!this._schedule_types.length)throw new Error(this.localize("wiser.helpers.no_supported_types"))}render(){var e,t,i;return this.hass&&this.config?this._loadError?B`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize("ui.common.back")}</button>`:this.component_loaded?B`
      <div>
        <div>${this.localize("wiser.actions.add_schedule")}</div>
        <div class="wrapper" style="white-space: normal">
          ${this.localize(1===this._schedule_types.length?"wiser.helpers.add_schedule_name":"wiser.helpers.add_schedule")}
        </div>
        ${this._schedule_types.length>1?B`<div class="wrapper">${this._schedule_types.map((e,t)=>this.renderScheduleTypeButtons(e,t))}</div>`:""}
        <label class="schedule-name">
          <span>${this.localize("wiser.headings.schedule_name")}</span>
          <input
            type="text"
            required
            autocomplete="off"
            .value=${(null===(e=this._schedule_info)||void 0===e?void 0:e.Name)||""}
            ?disabled=${this._saving}
            @input=${e=>{this._schedule_info=Object.assign(Object.assign({},this._schedule_info),{Name:e.target.value})}}
          />
        </label>
      </div>
      <div class="save-actions">
        <ha-button appearance="plain" .disabled=${this._saving} @click=${this.cancelClick}
          >${this.hass.localize("ui.common.cancel")}</ha-button
        >
        <ha-button
          .disabled=${this._saving||!(null===(t=this._schedule_info)||void 0===t?void 0:t.Name.trim())||!(null===(i=this._schedule_info)||void 0===i?void 0:i.Type)}
          @click=${this.confirmClick}
        >
          ${this.hass.localize("ui.common.save")}
        </ha-button>
      </div>
    `:B`<div role="status">${this.localize("common.loading")}</div>`:B``}renderScheduleTypeButtons(e,t){return B`
      <button
        type="button"
        id=${t}
        size="small"
        appearance=${this._schedule_info&&this._schedule_info.Type==e?"filled":"plain"}
        @click=${this._valueChanged}
        .configValue=${"Type"}
        .value=${e}
      >
        ${e}
      </button>
    `}async confirmClick(){await this.createSchedule()}async createSchedule(){const e=this._schedule_info;if(this.hass&&this.config&&At(this.hass,this.config)&&!this._saving&&(null==e?void 0:e.Name.trim())&&this._schedule_types.includes(e.Type)){this._saving=!0;try{const t=await et(this.hass,this.config.hub,e.Type);await at(this.hass,this.config.hub,e.Type,e.Name.trim());const i=(await et(this.hass,this.config.hub,e.Type)).find(i=>i.Name===e.Name.trim()&&!t.some(e=>e.Id===i.Id&&e.Type===i.Type));i&&void 0!==this.assign_to&&await ot(this.hass,this.config.hub,i.Type,i.Id,String(this.assign_to)),this.dispatchEvent(new CustomEvent("scheduleAdded",{detail:i}))}catch(e){this._loadError=(null==e?void 0:e.message)||this.localize("common.load_failed")}finally{this._saving=!1}}}cancelClick(){const e=new CustomEvent("backClick");this.dispatchEvent(e)}_valueChanged(e){const t=e.currentTarget;t.configValue&&(this._schedule_info=Object.assign(Object.assign({},this._schedule_info),{[t.configValue]:void 0!==t.checked?t.checked:t.value}))}static get styles(){return n`
      ${Xt}
      .save-actions {
        gap: 8px;
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
      }
      .header-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 6px;
      }
      div.wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        overflow: auto;
      }
      div.wrapper {
        color: var(--primary-text-color);
        padding: 5px 0;
      }
      .schedule-type-select {
        margin: 20px 0 0 0;
      }
      .schedule-name {
        max-width: 420px;
        display: grid;
        gap: 8px;
        color: var(--primary-text-color);
        margin: 20px 0 0 0;
        width: 100%;
      }
      input {
        box-sizing: border-box;
        width: 100%;
        min-height: 44px;
        padding: 10px 12px;
        border: 1px solid var(--divider-color, #aaa);
        border-radius: 10px;
        background: var(--card-background-color, white);
        color: var(--primary-text-color, #222);
        font: inherit;
      }
      input:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 36px;
        margin-top: -6px;
        margin-left: -6px;
      }
      .card-header ha-icon-button {
        position: absolute;
        right: 6px;
        top: 6px;
      }
      mwc-button.active {
        background: var(--primary-color);
        --mdc-theme-primary: var(--text-primary-color);
        border-radius: 4px;
      }
    `}};e([pe({attribute:!1})],Si.prototype,"hass",void 0),e([pe({attribute:!1})],Si.prototype,"config",void 0),e([pe({attribute:!1})],Si.prototype,"component_loaded",void 0),e([pe({attribute:!1})],Si.prototype,"allowed_types",void 0),e([pe({attribute:!1})],Si.prototype,"assign_to",void 0),e([ue()],Si.prototype,"_saving",void 0),e([ue()],Si.prototype,"_schedule_types",void 0),e([ue()],Si.prototype,"_schedule_info",void 0),e([ue()],Si.prototype,"_loadError",void 0),Si=e([t("wiser-schedule-add-card")],Si);let $i=class extends le{constructor(){super(...arguments),this.schedule_id=0,this.component_loaded=!1,this._copy_in_progress=0,this._schedule_list=[],this._loadError="",this._name="",this._copyError="",this._creating=!1,this._createdName=""}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}firstUpdated(){this.loadData().then(()=>{this.component_loaded=!0}).catch(e=>{this._loadError=(null==e?void 0:e.message)||this.localize("common.load_failed")}).then(()=>Lt(this))}async loadData(){this.schedule=await tt(this.hass,this.config.hub,this.schedule_type,this.schedule_id),this._schedule_list=await et(this.hass,this.config.hub,this.schedule_type)}render(){return this.hass&&this.config?this._loadError?B`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize("ui.common.back")}</button>`:this.component_loaded&&this.schedule?B`
      <div>
        <div>${this.localize("wiser.headings.copy_schedule")}</div>
        <div class="schedule-info">
          <span class="sub-heading">${this.localize("wiser.headings.schedule_type")}:</span> ${this.schedule.Type}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${this.localize("wiser.headings.schedule_id")}:</span> ${this.schedule.Id}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${this.localize("wiser.headings.schedule_name")}:</span> ${this.schedule.Name}
        </div>
        <div class="wrapper" style="margin: 20px 0 0 0;">${this.localize("wiser.helpers.select_copy_schedule")}</div>
        <div class="assignment-wrapper">
          ${this._schedule_list.filter(e=>{var t;return e.Id!=(null===(t=this.schedule)||void 0===t?void 0:t.Id)}).map(e=>this.renderScheduleButtons(e))}
        </div>
      </div>
      <label class="new-name"
        >${this.localize("wiser.headings.new_copy_name")}
        <input
          type="text"
          .value=${this._name}
          ?disabled=${this._creating||!!this._copy_in_progress}
          @input=${e=>{this._name=e.target.value}}
        />
      </label>
      <wiser-schedule-edit-card
        .hass=${this.hass}
        .config=${Object.assign(Object.assign({},this.config),{display_only:!0})}
        .embedded=${!0}
        .schedule_id=${this.schedule_id}
        .schedule_type=${this.schedule_type}
      ></wiser-schedule-edit-card>
      ${this._copyError?B`<p role="alert">${this._copyError}</p>`:""}
      <div class="save-actions">
        <ha-button appearance="plain" .disabled=${this._creating||!!this._copy_in_progress} @click=${this.cancelClick}
          >${this.hass.localize("ui.common.cancel")}</ha-button
        >
        <ha-button
          .disabled=${this._creating||!!this._copy_in_progress||!this._name.trim()||!At(this.hass,this.config)}
          @click=${this.duplicateNew}
          >${this.localize("wiser.actions.duplicate_new")}</ha-button
        >
      </div>
    `:B`<div role="status">${this.localize("common.loading")}</div>`:B``}async duplicateNew(){if(this.hass&&this.config&&At(this.hass,this.config)&&!this._creating&&!this._copy_in_progress&&this._name.trim()){this._creating=!0,this._copyError="";try{if(!this._createdId){const e=await et(this.hass,this.config.hub,this.schedule_type);await at(this.hass,this.config.hub,this.schedule_type,this._name.trim());const t=(await et(this.hass,this.config.hub,this.schedule_type)).filter(t=>t.Name===this._name.trim()&&!e.some(e=>e.Id===t.Id));if(1!==t.length)throw new Error(this.localize("wiser.helpers.copy_target_missing"));this._createdId=t[0].Id,this._createdName=this._name.trim()}this._createdName!==this._name.trim()&&(await nt(this.hass,this.config.hub,this.schedule_type,this._createdId,this._name.trim()),this._createdName=this._name.trim()),await rt(this.hass,this.config.hub,this.schedule_type,this.schedule_id,this._createdId),this.dispatchEvent(new CustomEvent("scheduleCopied",{detail:{Id:this._createdId,Type:this.schedule_type}}))}catch(e){this._copyError=e.message||this.localize("common.load_failed")}finally{this._creating=!1}}}renderScheduleButtons(e){return B`
      <button
        type="button"
        class="schedule-button"
        id=${e.Id}
        size="small"
        .disabled=${this._creating||!!this._copy_in_progress||!At(this.hass,this.config)}
        @click=${this._copySchedule}
        .value=${e.Name}
      >
        ${this._copy_in_progress==e.Id?B`<span class="waiting"><progress aria-label="Working"></progress></span>`:null}
        ${e.Name}
      </button>
    `}cancelClick(){const e=new CustomEvent("backClick",{detail:fe.ScheduleEdit});this.dispatchEvent(e)}async _copySchedule(e){if(!At(this.hass,this.config)||this._creating||this._copy_in_progress)return;const t=e.currentTarget;if(t.id){this._copy_in_progress=parseInt(t.id),this._copyError="";try{await rt(this.hass,this.config.hub,this.schedule_type,this.schedule_id,this._copy_in_progress),this.dispatchEvent(new CustomEvent("scheduleCopied",{detail:{Id:this._copy_in_progress,Type:this.schedule_type}}))}catch(e){this._copyError=(null==e?void 0:e.message)||this.localize("common.load_failed")}finally{this._copy_in_progress=0}}}static get styles(){return n`
      ${Xt}
      .new-name {
        display: grid;
        gap: 8px;
        width: 420px;
        max-width: 100%;
        margin: 20px 0;
      }
      .new-name input {
        box-sizing: border-box;
        width: 100%;
        min-height: 44px;
        padding: 10px 12px;
        font: inherit;
        color: var(--primary-text-color);
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
      }
      .save-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
      }

      .header-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 6px;
      }
      div.wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        overflow: auto;
      }
      div.card-actions {
        border-top: 1px solid var(--divider-color, #e8e8e8);
        padding: 5px 0px;
        min-height: 40px;
      }
      div.wrapper {
        color: var(--primary-text-color);
        padding: 5px 0;
      }
      .schedule-type-select {
        margin: 20px 0 0 0;
      }
      .schedule-name {
        margin: 20px 0 0 0;
        width: 100%;
      }
      .sub-heading {
        padding-bottom: 10px;
        font-weight: 500;
      }
      .schedule-button {
        padding: 5px;
      }
      span.waiting {
        position: absolute;
        height: 28px;
        width: 100%;
        margin: 4px;
      }
      div.schedule-info {
        margin: 3px 0;
      }
    `}};e([pe({attribute:!1})],$i.prototype,"hass",void 0),e([pe({attribute:!1})],$i.prototype,"config",void 0),e([pe({attribute:!1})],$i.prototype,"schedule_id",void 0),e([pe({attribute:!1})],$i.prototype,"schedule_type",void 0),e([ue()],$i.prototype,"schedule",void 0),e([ue()],$i.prototype,"component_loaded",void 0),e([ue()],$i.prototype,"_copy_in_progress",void 0),e([ue()],$i.prototype,"_schedule_list",void 0),e([ue()],$i.prototype,"_loadError",void 0),e([ue()],$i.prototype,"_name",void 0),e([ue()],$i.prototype,"_copyError",void 0),e([ue()],$i.prototype,"_creating",void 0),$i=e([t("wiser-schedule-copy-card")],$i);let ki=class extends le{constructor(){super(...arguments),this.hideHubSelector=!1,this.hideCardAppearance=!1,this._hubs=[],this._error="",this._requestId=0,this._dismissColorPicker=e=>{const t=this.renderRoot.querySelector('input[type="color"]:focus');t&&!e.composedPath().includes(t)&&t.blur()}}localize(e,t="",i=""){return Ke(this.hass,e,t,i)}connectedCallback(){super.connectedCallback(),this.ownerDocument.addEventListener("pointerdown",this._dismissColorPicker,!0)}disconnectedCallback(){this.ownerDocument.removeEventListener("pointerdown",this._dismissColorPicker,!0),super.disconnectedCallback()}setConfig(e){this._config=Object.assign({},e)}updated(e){var t;const i=e.get("_config");(e.has("hass")&&!e.get("hass")||e.has("_config")&&(!i||i.hub!==(null===(t=this._config)||void 0===t?void 0:t.hub)))&&this.loadData()}async loadData(){if(!this.hass||!this._config)return;const e=++this._requestId;this._error="";try{await _t();const t=await Xe(this.hass);if(e!==this._requestId)return;this._hubs=t}catch(t){e===this._requestId&&(this._error=(null==t?void 0:t.message)||"Unable to load schedules.")}}change(e,t){if(!this._config)return;const i=Object.assign({},this._config);""===t?delete i[e]:i[e]=t,"home_screen"===e&&delete i.selected_schedule,"hub"===e&&delete i.selected_schedule,this._config=i,ve(this,"config-changed",{config:i})}toggle(e,t,i=!1){var s;return B`<label class="toggle">
      <span>${t}</span>
      <ha-switch
        aria-label=${t}
        .checked=${Boolean(null===(s=this._config)||void 0===s?void 0:s[e])}
        .disabled=${i}
        @change=${t=>this.change(e,t.target.checked)}
      ></ha-switch>
    </label>`}color(e,t,i){var s,o,a;const r=be[e.replace("_color","")],n=null===(s=this._config)||void 0===s?void 0:s[e];return B`<div class="color-field">
      <span>${t}</span>
      <span class="color-actions">
        <input
          type="color"
          aria-label=${`${i}: ${t}`}
          .value=${zt(n||"")?n:r}
          .disabled=${Boolean(null===(o=this._config)||void 0===o?void 0:o.theme_colors)}
          @input=${t=>this.change(e,t.currentTarget.value)}
        />
        <button
          class="color-reset"
          type="button"
          aria-label=${`${i}: ${t}: ${this.localize("wiser.editor.reset_color")}`}
          title=${this.localize("wiser.editor.reset_color")}
          ?disabled=${void 0===n||Boolean(null===(a=this._config)||void 0===a?void 0:a.theme_colors)}
          @click=${()=>this.change(e,"")}
        >
          <ha-icon icon="mdi:restore"></ha-icon>
        </button>
      </span>
    </div>`}render(){if(!this._config)return B``;const e=this._config;return B`
      <div class="fields">
        ${this.hideHubSelector?"":B`<ha-selector
                class="hub-picker"
                .hass=${this.hass}
                .label=${this.localize("wiser.editor.hub")}
                .selector=${{select:{mode:"dropdown",options:this._hubs.map(e=>({value:e,label:e}))}}}
                .value=${e.hub||this._hubs[0]}
                .required=${!0}
                .disabled=${this._hubs.length<2}
                @value-changed=${e=>{e.stopPropagation(),e.detail.value&&this._hubs.includes(e.detail.value)&&this.change("hub",e.detail.value)}}
              ></ha-selector>`}
        <div class="home-screen">
          <span>${this.localize("wiser.home.screen")}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{button_toggle:{options:[{value:"schedules",label:this.localize("wiser.rooms.schedules")},{value:"overview",label:this.localize("wiser.home.overview")}]}}}
            .value=${"devices"===e.home_screen?"overview":e.home_screen||"schedules"}
            @value-changed=${e=>{e.stopPropagation(),["schedules","overview"].includes(e.detail.value)&&this.change("home_screen",e.detail.value)}}
          ></ha-selector>
        </div>
        ${"overview"===e.home_screen||"devices"===e.home_screen?B`
                <div class="home-screen">
                  <span>${this.localize("wiser.home.overview_details")}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{button_toggle:{options:[{value:"show",label:this.localize("wiser.home.show")},{value:"hide",label:this.localize("wiser.home.hide")}]}}}
                    .value=${!1===e.overview_details?"hide":"show"}
                    @value-changed=${e=>{e.stopPropagation(),["show","hide"].includes(e.detail.value)&&this.change("overview_details","show"===e.detail.value)}}
                  ></ha-selector>
                </div>
              `:""}
      </div>
      ${this._error?B`<div role="alert">${this._error} <button @click=${()=>this.loadData()}>${this.localize("common.retry")}</button></div>`:""}
      <fieldset>
        <legend>${this.localize("wiser.editor.permissions")}</legend>
        ${this.toggle("display_only",this.localize("wiser.editor.display_only"))}
        <p class="field-help">${this.localize("wiser.editor.display_only_help")}</p>
        ${this.toggle("admin_only",this.localize("wiser.editor.admin_only"),e.display_only)}
      </fieldset>
      <fieldset>
        <legend>${this.localize("wiser.editor.appearance")}</legend>
        ${this.toggle("theme_colors",this.localize("wiser.editor.theme_colors"))}
        <div class="color-fields">
          <section class="color-group">
            <h4>${this.localize("wiser.editor.temperature_colors")}</h4>
            ${this.color("low_color",this.localize("wiser.editor.low_color"),this.localize("wiser.editor.temperature_colors"))}
            ${this.color("high_color",this.localize("wiser.editor.high_color"),this.localize("wiser.editor.temperature_colors"))}
          </section>
          <section class="color-group">
            <h4>${this.localize("wiser.editor.control_colors")}</h4>
            ${this.color("off_color",this.localize("wiser.editor.off_color"),this.localize("wiser.editor.control_colors"))}
            ${this.color("on_color",this.localize("wiser.editor.on_color"),this.localize("wiser.editor.control_colors"))}
          </section>
          <section class="color-group">
            <h4>${this.localize("wiser.editor.hot_water_colors")}</h4>
            ${this.color("hot_water_off_color",this.localize("wiser.editor.off_color"),this.localize("wiser.editor.hot_water_colors"))}
            ${this.color("hot_water_on_color",this.localize("wiser.editor.on_color"),this.localize("wiser.editor.hot_water_colors"))}
          </section>
          <section class="color-group">
            <h4>${this.localize("wiser.editor.lighting_colors")}</h4>
            ${this.color("lighting_off_color",this.localize("wiser.editor.off_color"),this.localize("wiser.editor.lighting_colors"))}
            ${this.color("lighting_on_color",this.localize("wiser.editor.on_color"),this.localize("wiser.editor.lighting_colors"))}
          </section>
          <section class="color-group">
            <h4>${this.localize("wiser.editor.shutter_colors")}</h4>
            ${this.color("shutter_closed_color",this.localize("wiser.editor.closed_color"),this.localize("wiser.editor.shutter_colors"))}
            ${this.color("shutter_open_color",this.localize("wiser.editor.open_color"),this.localize("wiser.editor.shutter_colors"))}
          </section>
        </div>
        ${this.hideCardAppearance?"":B`
                ${this.toggle("hide_card_borders",this.localize("wiser.editor.hide_card_borders"))}
                ${this.toggle("hide_card_background",this.localize("wiser.editor.hide_card_background"))}
              `}
      </fieldset>
      <div class="version">Wiser Schedule Card · ${_e}</div>
    `}};ki.styles=n`
    .field-help {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 0 0 12px;
    }
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    .home-screen {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .home-screen ha-selector {
      width: max-content;
      margin-inline-start: auto;
      display: flex;
      justify-content: flex-end;
      max-width: 100%;
    }
    .hub-picker {
      width: 420px;
      max-width: 100%;
    }
    .fields {
      display: grid;
      gap: 16px;
    }
    label {
      display: grid;
      gap: 8px;
      font-size: calc(14px + 1pt);
    }
    input[type='text'],
    select {
      box-sizing: border-box;
      width: 100%;
      min-height: 44px;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      padding: 10px 12px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      font: inherit;
    }
    fieldset {
      border: 0;
      border-top: 1px solid var(--divider-color, #ddd);
      padding: 16px 0 0;
      margin: 24px 0 0;
      min-width: 0;
    }
    legend {
      padding-right: 12px;
      color: var(--secondary-text-color);
      font-size: calc(13px + 1pt);
    }
    .toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      min-height: 44px;
    }
    .color-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 8px;
    }
    .color-group {
      display: grid;
      align-content: start;
      gap: 4px;
      min-width: 0;
    }
    .color-group h4 {
      margin: 0 0 4px;
      color: var(--secondary-text-color);
      font-size: calc(13px + 1pt);
      font-weight: 500;
    }
    .color-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 44px;
    }
    .color-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    input[type='color'] {
      box-sizing: border-box;
      width: 52px;
      height: 36px;
      padding: 2px;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 8px;
      background: var(--card-background-color, white);
      cursor: pointer;
    }
    input[type='color']:disabled {
      cursor: default;
      opacity: 0.45;
    }
    .color-reset {
      display: grid;
      place-items: center;
      box-sizing: border-box;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .color-reset:hover:not(:disabled) {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .color-reset:disabled {
      opacity: 0.3;
      cursor: default;
    }
    @media (max-width: 720px) {
      .color-fields {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
    ha-switch {
      flex-shrink: 0;
    }
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .version {
      margin-top: 24px;
      color: var(--secondary-text-color);
      font-size: calc(12px + 1pt);
      text-align: right;
    }
  `,e([pe({attribute:!1})],ki.prototype,"hass",void 0),e([pe({attribute:!1})],ki.prototype,"hideHubSelector",void 0),e([pe({attribute:!1})],ki.prototype,"hideCardAppearance",void 0),e([ue()],ki.prototype,"_config",void 0),e([ue()],ki.prototype,"_hubs",void 0),e([ue()],ki.prototype,"_error",void 0),ki=e([t("wiser-schedule-card-editor")],ki);class zi extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style>\n        :host { display: flex; flex-direction: column; height: 100%; min-width: 0; overflow: auto;\n          color: var(--primary-text-color); background: var(--primary-background-color); }\n        header { display: flex; flex-shrink: 0; align-items: center; gap: 16px; height: 64px;\n          padding: 0 16px; background: var(--app-header-background-color);\n          color: var(--app-header-text-color); }\n        h1 { flex: 0 0 auto; font-size: 20px; font-weight: 400; margin: 0; }\n        #menu, #settings { flex-shrink: 0; }\n        #menu, #settings { color: inherit; }\n        #menu ha-icon, #settings ha-icon {\n          color: var(--app-header-text-color, var(--primary-text-color));\n        }\n        #settings[disabled] ha-icon { color: var(--disabled-text-color); }\n        ha-dialog { --ha-dialog-width-md: 600px;\n          --ha-dialog-surface-background: var(--primary-background-color, var(--ha-color-surface-default, #fff)); }\n        .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }\n        #editor-error:empty { display: none; }\n        #editor-error { color: var(--error-color, #db4437); }\n        main { display: flex; flex-direction: column; flex: 1 0 auto;\n          box-sizing: border-box; width: 100%; min-width: 0; padding: 16px; }\n        #hub-tabs { display: flex; flex: 1; min-width: 0; margin-inline-start: 24px; align-self: stretch; overflow-x: auto; }\n        :host([nested]) header { flex-basis:56px; height:56px; }\n        :host([nested]) #menu, :host([nested]) h1 { display:none; }\n        :host([nested]) #hub-tabs { margin-inline-start:0; }\n        :host([nested]) #settings { display:none; }\n        :host([nested][single-hub]) header { display:none; }\n        #hub-tabs[hidden], wiser-schedule-card[hidden] { display: none; }\n        .hub-tab { flex: 0 0 auto; min-height: 48px; padding: 0 24px;\n          border: 0; border-bottom: 2px solid transparent; background: transparent;\n          color: var(--secondary-text-color); font: inherit; cursor: pointer; }\n        .hub-tab[aria-selected="true"] { color: var(--app-header-text-color, var(--primary-text-color));\n          border-bottom-color: currentColor; }\n        .hub-tab:focus-visible { outline: 2px solid currentColor; outline-offset: -4px; }\n        @media (max-width: 600px) {\n          header { gap: 8px; padding: 0 8px; }\n          #hub-tabs { margin-inline-start: 0; }\n          h1 { flex: 0 1 auto; min-width: 0; max-width: 30%; font-size: 16px; }\n          .hub-tab { padding: 0 12px; }\n        }\n        wiser-schedule-card { display: flex; flex-direction: column; flex: 1; min-width: 0; }\n      </style>\n      <header><ha-button id="menu" appearance="plain" aria-label="Toggle sidebar"><ha-icon icon="mdi:menu"></ha-icon></ha-button>\n        <h1 id="panel-title">Wiser Schedules</h1>\n        <nav id="hub-tabs" role="tablist" aria-label="Wiser hubs" hidden></nav>\n        <ha-button id="settings" appearance="plain" aria-label="Edit schedule card settings" title="Edit schedule card settings" disabled>\n          <ha-icon icon="mdi:cog"></ha-icon>\n      </ha-button></header>\n      <ha-dialog id="editor-dialog" header-title="Panel settings" width="medium">\n        <div id="editors"></div><p id="editor-error" role="alert"></p>\n        <div class="dialog-actions" id="editor-actions" slot="footer">\n          <ha-button id="cancel" appearance="plain">Cancel</ha-button>\n          <ha-button id="save">Save</ha-button>\n        </div>\n      </ha-dialog>\n      <main><p id="loading" role="status">Loading Wiser schedules…</p></main>',this.shadowRoot.getElementById("menu").addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}),this.shadowRoot.getElementById("settings").addEventListener("click",()=>this._openEditor()),this.shadowRoot.getElementById("cancel").addEventListener("click",()=>this._closeEditor()),this.shadowRoot.getElementById("save").addEventListener("click",()=>this._saveEditor()),this.shadowRoot.getElementById("editor-dialog").addEventListener("closed",()=>this._closeEditor()),this.shadowRoot.getElementById("editor-dialog").addEventListener("close-dialog",()=>this._closeEditor()),this._editors=[],this._cards=[],this._generation=0}_t(e,t="",i=""){return Ke(this._hass,e,t,i)}_editorHeading(){const e=this._config?.hubs||[],t=e.includes(this._activeHub)?this._activeHub:e[0];return t?this._t("wiser.panel.settings_for_hub","{hub}",t):this._t("wiser.panel.settings")}_updateEditorHeading(){const e=this.shadowRoot.getElementById("editor-dialog"),t=this._editorHeading();e.setAttribute("header-title",t);try{e.headerTitle=t}catch{}e.heading=t}_localizeControls(){const e=this.shadowRoot;e.getElementById("panel-title").textContent=this._t("wiser.panel.title"),e.getElementById("hub-tabs").setAttribute("aria-label",this._t("wiser.panel.hubs"));for(const[t,i]of[["menu","wiser.panel.menu"],["settings","wiser.panel.edit_settings"]]){const s=e.getElementById(t);s.setAttribute("aria-label",this._t(i)),s.title=this._t(i)}const t=e.getElementById("loading");t&&(t.textContent=this._t("wiser.panel.loading")),e.getElementById("cancel").textContent=this._t("wiser.panel.cancel"),e.getElementById("save").textContent=this._t("wiser.panel.save"),this._updateEditorHeading()}set hass(e){this._hass=e,this._localizeControls();for(const t of this._cards)t.hass=e;for(const t of this._editors)t.hass=e;this.shadowRoot.getElementById("settings").hidden=!e?.user?.is_admin}set panel(e){const t=e.config;JSON.stringify(t)!==JSON.stringify(this._config)&&(this._config=t,this._loadCards())}_cardConfig(e){return{...this._storedCardConfig(e),panel_mode:!0}}_storedCardConfig(e){const{name:t,panel_mode:i,...s}=this._config.card_configs?.[e]||{};return{...s,type:"custom:wiser-schedule-card",hub:e}}_activeHubStorageKey(){return`wiser-schedules-panel:${this._config.panel_id}:active-hub`}_rememberActiveHub(e){try{window.sessionStorage?.setItem(this._activeHubStorageKey(),e)}catch{}}_restoredActiveHub(){if(this._activeHub)return this._activeHub;try{return window.sessionStorage?.getItem(this._activeHubStorageKey())}catch{return}}_selectHub(e){this._activeHub=e,this._rememberActiveHub(e),this._cards.forEach((t,i)=>{const s=this._config.hubs[i]===e;t.hidden=!s,this._tabs[i].setAttribute("aria-selected",String(s)),this._tabs[i].tabIndex=s?0:-1})}_renderHubTabs(){const e=this._config.hubs,t=this.shadowRoot.getElementById("hub-tabs");e.length<=1?this.setAttribute("single-hub",""):this.removeAttribute("single-hub"),t.hidden=e.length<=1,this._tabs=e.map((t,i)=>{const s=document.createElement("button");s.type="button",s.className="hub-tab",s.textContent=t,s.id=`hub-tab-${i}`,s.setAttribute("role","tab"),s.setAttribute("aria-controls",`hub-panel-${i}`),s.addEventListener("click",()=>this._selectHub(t)),s.addEventListener("keydown",t=>{let s;if("ArrowRight"===t.key)s=(i+1)%e.length;else if("ArrowLeft"===t.key)s=(i+e.length-1)%e.length;else if("Home"===t.key)s=0;else{if("End"!==t.key)return;s=e.length-1}t.preventDefault(),this._selectHub(e[s]),this._tabs[s].focus()});const o=this._cards[i];return o.id=`hub-panel-${i}`,o.setAttribute("role","tabpanel"),o.setAttribute("aria-labelledby",s.id),s}),t.replaceChildren(...this._tabs);const i=this._restoredActiveHub();this._selectHub(e.includes(i)?i:e[0])}_closeEditor(){this.shadowRoot.getElementById("editor-dialog").open=!1,this._editors=[]}async _openEditor(){const e=this.shadowRoot.getElementById("editor-dialog");if(e.open||!this._cards.length||!this._hass?.user?.is_admin)return;const t=this.shadowRoot.getElementById("editors"),i=this.shadowRoot.getElementById("editor-error"),s=this.shadowRoot.getElementById("save"),o=this._config.hubs.includes(this._activeHub)?this._activeHub:this._config.hubs[0];this._drafts=Object.fromEntries(this._config.hubs.map(e=>[e,this._storedCardConfig(e)])),this._editors=[],i.textContent="",t.replaceChildren(),s.disabled=!0,this._updateEditorHeading(),"headerTitle"in(customElements.get("ha-dialog")?.prototype||{})||this.shadowRoot.getElementById("editor-actions").removeAttribute("slot"),e.open=!0;try{if(!window.loadCardHelpers){const e=document.createElement("partial-panel-resolver"),t=e._getRoutes?.({lovelace:{component_name:"lovelace",url_path:"lovelace"}});await(t?.routes?.lovelace?.load?.())}const i=customElements.get("wiser-schedule-card"),a=await i.getConfigElement();if(!e.open)return;const r=this._drafts[o];a.hass=this._hass,a.hideHubSelector=!0,a.hideCardAppearance=!0,a.setConfig({...r}),a.addEventListener("config-changed",e=>{e.stopPropagation();const{name:t,panel_mode:i,...s}=e.detail.config;this._drafts[o]={...s,type:"custom:wiser-schedule-card",hub:o}}),t.append(a),this._editors.push(a),s.disabled=!1}catch(e){i.textContent=this._t("wiser.panel.editor_error"),console.error("Unable to open Wiser editor",e)}}async _saveEditor(){const e=this.shadowRoot.getElementById("save");e.disabled=!0;try{await this._hass.callWS({type:"wiser/panel/configure",panel_id:this._config.panel_id,configs:this._drafts}),this._config={...this._config,card_configs:{...this._config.card_configs,...this._drafts}},this._closeEditor(),this._editors=[],this._loadCards()}catch(e){this.shadowRoot.getElementById("editor-error").textContent=this._t("wiser.panel.save_error"),console.error("Unable to save Wiser panel settings",e)}finally{e.disabled=!1}}async _loadCards(){const e=++this._generation,t=this._config,i=this.shadowRoot.querySelector("main");try{const s=customElements.get("wiser-schedule-card");if(1!==s?.panelApiVersion)throw new Error(this._t("wiser.panel.version_error"));if(e!==this._generation)return;const o=t.hubs.map(e=>{const t=document.createElement("wiser-schedule-card");return t.setConfig(this._cardConfig(e)),t.hass=this._hass,t});this._cards=o,i.replaceChildren(...o),this._renderHubTabs(),this.shadowRoot.getElementById("settings").disabled=!1}catch(t){if(e!==this._generation)return;this._cards=[],this.shadowRoot.getElementById("hub-tabs").hidden=!0,this.shadowRoot.getElementById("settings").disabled=!0;const s=document.createElement("p");s.setAttribute("role","alert"),s.textContent=t.message||this._t("wiser.panel.load_error");const o=document.createElement("ha-button");o.textContent=this._t("wiser.panel.retry"),o.addEventListener("click",()=>this._loadCards()),i.replaceChildren(s,o),console.error("Unable to load Wiser schedules",t)}}}customElements.get("wiser-schedules-panel")||customElements.define("wiser-schedules-panel",zi),console.info(`%c  WISER-SCHEDULE-CARD \n%c  ${Ye("common.version")} ${_e}    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.some(e=>"wiser-schedule-card"===e.type)||window.customCards.push({type:"wiser-schedule-card",name:"Wiser Schedule Card",description:"A card to manage Wiser schedules",preview:!1});let Ci=class extends le{constructor(){super(...arguments),this._view=fe.Overview,this.component_loaded=!1,this._schedule_id=0,this._schedule_type="heating",this._homeView="schedules",this._target_type="heating",this._returnView=fe.Overview,this._preserveNavigationHeight=()=>{const e=Math.ceil(this.getBoundingClientRect().height);e>(Number.parseFloat(this.style.getPropertyValue("--wiser-navigation-min-height"))||0)&&this.style.setProperty("--wiser-navigation-min-height",`${e}px`)}}static async getConfigElement(){return document.createElement("wiser-schedule-card-editor")}static getStubConfig(){return{}}setConfig(e){var t;if(!e)throw new Error(Ye("common.invalid_configuration"));e.test_gui&&function(){var e=document.querySelector("home-assistant");if(e=(e=(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-root")){var t=e.lovelace;return t.current_view=e.___curView,t}return null}().setEditMode(!0),this.config=Object.assign(Object.assign({name:"Wiser Schedule"},e),{home_screen:"devices"===e.home_screen?"overview":null!==(t=e.home_screen)&&void 0!==t?t:"schedules"})}set hass(e){this._hass=e}processConfigSchedule(){var e,t,i;(null===(e=this.config)||void 0===e?void 0:e.selected_schedule)?(this._schedule_type=null===(t=this.config)||void 0===t?void 0:t.selected_schedule.split("|")[0],this._schedule_id=parseInt(null===(i=this.config)||void 0===i?void 0:i.selected_schedule.split("|")[1]),this._view=fe.ScheduleEdit):(this._schedule_type="",this._schedule_id=0,this._view=fe.Overview)}getCardSize(){return 9}willUpdate(e){var t,i,s;e.has("config")?(this.style.removeProperty("--wiser-navigation-min-height"),this._returnView=fe.Overview,this._homeView=(null===(t=this.config)||void 0===t?void 0:t.home_screen)||"schedules",this.processConfigSchedule()):(e.has("_view")||e.has("_homeView"))&&this._preserveNavigationHeight(),this.component_loaded=null!==(s=null===(i=this._hass)||void 0===i?void 0:i.config.components.includes("wiser"))&&void 0!==s&&s}render(){if(!this._hass||!this.config)return B``;const e=`${this.config.hide_card_borders?"border-width: 0px;":""}${this.config.hide_card_background?"background: transparent; box-shadow: none; backdrop-filter: none;":""}`;return this.component_loaded?this._view===fe.Overview&&"schedules"===this._homeView?B`<ha-card style=${e}>
        <div
          class="card-content"
          @home-view-changed=${e=>{"schedules"!==e.detail&&"overview"!==e.detail||(this._homeView=e.detail)}}
        >
          <wiser-schedules-home
            .hass=${this._hass}
            .config=${this.config}
            @addScheduleClick=${this._addScheduleClick}
            @scheduleClick=${e=>{this._schedule_id=e.detail.Id,this._schedule_type=e.detail.Type,this._returnView=fe.Overview,this._view=fe.ScheduleEdit}}
          ></wiser-schedules-home></div
      ></ha-card>`:this._view===fe.Overview||this._view===fe.RoomSchedule?B` <ha-card style=${e}>
        <div
          class="card-content"
          @home-view-changed=${e=>{"schedules"!==e.detail&&"overview"!==e.detail||(this._homeView=e.detail)}}
        >
          <wiser-room-schedules
            .hass=${this._hass}
            .config=${this.config}
            .room_id=${this._view===fe.RoomSchedule?this._room_id:void 0}
            .target_type=${this._target_type}
            .created_schedule=${this._created_schedule}
            @createdScheduleOpened=${()=>{this._created_schedule=void 0}}
            @roomClick=${e=>{this._room_id=e.detail.id,this._target_type=e.detail.kind,this._view=fe.RoomSchedule}}
            @roomsBack=${()=>{this._view=fe.Overview}}
            @scheduleAction=${e=>{this._schedule_id=e.detail.schedule_id,this._schedule_type=e.detail.schedule_type,this._returnView=fe.RoomSchedule,this._view=fe.ScheduleCopy}}
            @addScheduleClick=${this._addScheduleClick}
          >
          </wiser-room-schedules>
        </div>
      </ha-card>`:this._view==fe.ScheduleEdit&&this._schedule_id?B`
        <ha-card style=${e}>
          <div
            class="card-content"
            @home-view-changed=${e=>{"schedules"!==e.detail&&"overview"!==e.detail||(this._homeView=e.detail)}}
          >
            <wiser-schedule-edit-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @editClick=${this._editClick}
              @copyClick=${this._copyClick}
              @scheduleDeleted=${this._scheduleDeleted}
            ></wiser-schedule-edit-card>
          </div>
        </ha-card>
      `:this._view==fe.ScheduleAdd?B`
        <ha-card style=${e}>
          <div
            class="card-content"
            @home-view-changed=${e=>{"schedules"!==e.detail&&"overview"!==e.detail||(this._homeView=e.detail)}}
          >
            <wiser-schedule-add-card
              .assign_to=${this._returnView===fe.RoomSchedule?this._room_id:void 0}
              .allowed_types=${this._returnView===fe.RoomSchedule?[this._target_type]:void 0}
              .hass=${this._hass}
              .config=${this.config}
              @backClick=${this._backClick}
              @scheduleAdded=${this._scheduleAdded}
            ></wiser-schedule-add-card>
          </div>
        </ha-card>
      `:this._view==fe.ScheduleCopy?B`
        <ha-card style=${e}>
          <div
            class="card-content"
            @home-view-changed=${e=>{"schedules"!==e.detail&&"overview"!==e.detail||(this._homeView=e.detail)}}
          >
            <wiser-schedule-copy-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @scheduleCopied=${this._scheduleCopied}
            ></wiser-schedule-copy-card>
          </div>
        </ha-card>
      `:B``:B`<ha-card style=${e}
        ><div class="status" role="status">${Ye("common.integration_unavailable")}</div></ha-card
      >`}_addScheduleClick(){this._returnView=this._view,this._view=fe.ScheduleAdd}_editClick(){this._view=fe.ScheduleEdit}_copyClick(){this._view=fe.ScheduleCopy}_backClick(e){e.detail?this._view=e.detail===fe.ScheduleEdit&&this._returnView===fe.RoomSchedule?fe.RoomSchedule:e.detail:this._view=this._returnView}_scheduleDeleted(){this._view=this._returnView}_scheduleAdded(e){var t;if(this._created_schedule=e.detail,"schedules"===(null===(t=this.config)||void 0===t?void 0:t.home_screen)&&e.detail)return this._schedule_id=e.detail.Id,this._schedule_type=e.detail.Type,void(this._view=fe.ScheduleEdit);this._view=this._returnView}_scheduleCopied(e){if(e.detail)return this._schedule_id=e.detail.Id,this._schedule_type=e.detail.Type,this._returnView=fe.Overview,void(this._view=fe.ScheduleEdit);this._view=this._returnView===fe.RoomSchedule?fe.RoomSchedule:fe.ScheduleEdit}};Ci.panelApiVersion=1,Ci.styles=n`
    :host {
      font-size: calc(14px + 1pt);
      --mdc-typography-body1-font-size: calc(16px + 1pt);
      --mdc-typography-subtitle1-font-size: calc(16px + 1pt);
      --ha-font-size-m: calc(14px + 1pt);
      display: block;
      min-height: var(--wiser-navigation-min-height, 0px);
      color: var(--primary-text-color);
    }
    ha-card {
      flex: 1;
      overflow: hidden;
    }
    .card-content {
      box-sizing: border-box;
      padding: 22px 20px 20px;
    }
    .status {
      padding: 20px;
      color: var(--secondary-text-color);
    }
    @media (max-width: 400px) {
      .card-content {
        padding: 18px 12px 12px;
      }
    }
  `,e([pe({attribute:!1})],Ci.prototype,"_hass",void 0),e([ue()],Ci.prototype,"config",void 0),e([ue()],Ci.prototype,"_view",void 0),e([ue()],Ci.prototype,"component_loaded",void 0),e([ue()],Ci.prototype,"_schedule_id",void 0),e([ue()],Ci.prototype,"_schedule_type",void 0),e([ue()],Ci.prototype,"_room_id",void 0),e([ue()],Ci.prototype,"_homeView",void 0),e([ue()],Ci.prototype,"_target_type",void 0),e([ue()],Ci.prototype,"_created_schedule",void 0),Ci=e([t("wiser-schedule-card")],Ci);export{Ci as WiserScheduleCard};
