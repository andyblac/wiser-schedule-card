function e(e,t,i,s){var o,r=arguments.length,a=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,s);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(a=(r<3?o(a):r>3?o(t,i,a):o(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(i,e,s)},n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:d,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,v=g?g.emptyScript:"",y=m.reactiveElementPolyfillSupport,_=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},f=(e,t)=>!d(e,t),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:f};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const r=s?.call(this);o?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s;const r=o.fromAttribute(t,e.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(void 0!==e){const r=this.constructor;if(!1===s&&(o=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??f)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==o||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,y?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,S=e=>e,k=$.trustedTypes,C=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+A,T=`<${D}>`,M=document,N=()=>M.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,z=Array.isArray,L="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,R=/>/g,H=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,j=/"/g,V=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),F=new WeakMap,Y=M.createTreeWalker(M,129);function J(e,t){if(!z(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,s=[];let o,r=2===t?"<svg>":3===t?"<math>":"",a=P;for(let t=0;t<i;t++){const i=e[t];let n,d,l=-1,c=0;for(;c<i.length&&(a.lastIndex=c,d=a.exec(i),null!==d);)c=a.lastIndex,a===P?"!--"===d[1]?a=I:void 0!==d[1]?a=R:void 0!==d[2]?(V.test(d[2])&&(o=RegExp("</"+d[2],"g")),a=H):void 0!==d[3]&&(a=H):a===H?">"===d[0]?(a=o??P,l=-1):void 0===d[1]?l=-2:(l=a.lastIndex-d[2].length,n=d[1],a=void 0===d[3]?H:'"'===d[3]?j:U):a===j||a===U?a=H:a===I||a===R?a=P:(a=H,o=void 0);const h=a===H&&e[t+1].startsWith("/>")?" ":"";r+=a===P?i+T:l>=0?(s.push(n),i.slice(0,l)+E+i.slice(l)+A+h):i+A+(-2===l?t:h)}return[J(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class G{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,r=0;const a=e.length-1,n=this.parts,[d,l]=Z(e,t);if(this.el=G.createElement(d,i),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=Y.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(E)){const t=l[r++],i=s.getAttribute(e).split(A),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(A)&&(n.push({type:6,index:o}),s.removeAttribute(e));if(V.test(s.tagName)){const e=s.textContent.split(A),t=e.length-1;if(t>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],N()),Y.nextNode(),n.push({type:2,index:++o});s.append(e[t],N())}}}else if(8===s.nodeType)if(s.data===D)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(A,e+1));)n.push({type:7,index:o}),e+=A.length-1}o++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function K(e,t,i=e,s){if(t===W)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=O(t)?void 0:t._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=K(e,o._$AS(e,t.values),o,s)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);Y.currentNode=s;let o=Y.nextNode(),r=0,a=0,n=i[0];for(;void 0!==n;){if(r===n.index){let t;2===n.type?t=new Q(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new oe(o,this,e)),this._$AV.push(t),n=i[++a]}r!==n?.index&&(o=Y.nextNode(),r++)}return Y.currentNode=M,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),O(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>z(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new X(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=F.get(e.strings);return void 0===t&&F.set(e.strings,t=new G(e)),t}k(e){z(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new Q(this.O(N()),this.O(N()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=S(e).nextSibling;S(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(e,t=this,i,s){const o=this.strings;let r=!1;if(void 0===o)e=K(this,e,t,0),r=!O(e)||e!==this._$AH&&e!==W,r&&(this._$AH=e);else{const s=e;let a,n;for(e=o[0],a=0;a<o.length-1;a++)n=K(this,s[i+a],t,a),n===W&&(n=this._$AH[a]),r||=!O(n)||n!==this._$AH[a],n===q?e=q:e!==q&&(e+=(n??"")+o[a+1]),this._$AH[a]=n}r&&!s&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class se extends ee{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??q)===W)return;const i=this._$AH,s=e===q&&i!==q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(G,Q),($.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ne extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new Q(t.insertBefore(N(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const de=ae.litElementPolyfillSupport;de?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ce={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:f},he=(e=ce,t,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pe(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return pe({...e,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var me,ge;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(me||(me={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ge||(ge={}));var ve=function(e,t,i,s){s=s||{},i=null==i?{}:i;var o=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,e.dispatchEvent(o),o};const ye="2.0.0-dev.35",_e=86400;var be,fe,we;!function(e){e.Overview="OVERVIEW",e.RoomSchedule="ROOM_SCHEDULE",e.ScheduleEdit="SCHEDULE_EDIT",e.ScheduleCopy="SCHEDULE_COPY",e.ScheduleAdd="SCHEDULE_ADD",e.ScheduleRename="SCHEDULE_RENAME"}(be||(be={})),function(e){e.Heating="19",e.OnOff="Off",e.Lighting="0",e.Shutters="100"}(fe||(fe={})),function(e){e.Heating="°C",e.OnOff="",e.Lighting="%",e.Shutters="%"}(we||(we={}));const xe=["Heating","OnOff","Lighting","Shutters"],$e=["Lighting","Shutters"],Se=["Weekdays","Weekend"],ke=["Monday","Tuesday","Wednesday","Thursday","Friday"],Ce=["Saturday","Sunday"],Ee=ke.concat(Ce),Ae=["Sunrise","Sunset"];var De;!function(e){e.Sunrise="3000",e.Sunset="4000"}(De||(De={}));var Te={version:"Version",invalid_configuration:"Invalid configuration",no_schedules:"No Schedules Found",name_required:"Name is required",loading:"Loading schedules…",retry:"Try again",load_failed:"Unable to load schedules.",integration_unavailable:"The Wiser integration is not available."},Me={actions:{copy:"Copy",files:"Files",rename:"Rename",add:"Add",view:"View",add_schedule:"Add Schedule",export:"Export schedule",import:"Import schedule"},labels:{setting:"Setting",name:"Name",assigns:"Assigns",start:"Start",end:"End",to:"to"},days:{monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday",weekdays:"Weekdays",weekend:"Weekend",all:"All",short:{monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat",sunday:"Sun"}},headings:{schedule_actions:"Schedule Actions",schedule_type:"Schedule Type",schedule_id:"Schedule Id",schedule_name:"Schedule Name",schedule_assignment:"Room/Device Assignment",not_assigned:"(Not Assigned)",rename_schedule:"Rename Schedule",copy_schedule:"Copy Schedule",delete_schedule:"Delete Schedule"},helpers:{enter_new_name:"Enter the new name for the Schedule",select_copy_schedule:"Select the schedule to copy to",delete_schedule_confirm:"Are you sure you wish to delete the schedule",select_a_schedule:"Select a schedule to view",add_schedule:"Select the schedule type and enter a name for the schedule to create",add_schedule_name:"Enter a name for the new schedule",no_supported_types:"No compatible schedule types are available for this device."},rooms:{title:"Rooms",schedules:"Schedules",manage:"Manage schedules",back:"Back to home",missing:"This room or device is no longer available.",current:"Current schedule",unassigned:"No schedule assigned",choose:"Choose a schedule",no_schedules:"No compatible schedules available. Create one using + in the toolbar.",assigning:"Assigning…",assign:"Assign schedule",saved:"Schedule assigned.",view_schedule:"View / edit schedule",shared:"This schedule is shared. Editing its times affects every assigned room or device.",select:"Select a room to choose its schedule",empty:"No Wiser rooms found.",edit:"Edit schedule",save_edit:"Save schedule",cancel_edit:"Cancel editing",delete:"Delete schedule",available:"Available schedule",none:"No schedule",removed:"Schedule unassigned."},moments:{title:"Moments",heating:"Room heating",description:"Preset actions for your home. Use Home Assistant automations to run them on a schedule.",loading:"Loading Moments…",failed:"Moments could not be loaded. Registry access may be restricted for this account.",empty:"No enabled Wiser Moments found for this hub. Create Moments in the Wiser app.",open:"Open controls",unavailable:"Unavailable"},home:{title:"Home",heating:"Heating",hotwater:"Hot water",devices:"Lighting & devices",empty:"No scheduled Wiser rooms or devices found."}},Ne={common:Te,wiser:Me},Oe={version:"Déclinaison",invalid_configuration:"Configuration Invalide",no_schedules:"Aucun Programme Trouvé",name_required:"Nom est obligatoire",loading:"Chargement des programmes…",retry:"Réessayer",load_failed:"Impossible de charger les programmes.",integration_unavailable:"L’intégration Wiser n’est pas disponible."},ze={actions:{copy:"Copie",files:"Fichier",rename:"Renommer",add:"Ajouter",view:"Voir",add_schedule:"Ajouter un Programme",export:"Exporter le programme",import:"Importer un programme"},labels:{setting:"Paramètre",name:"Nom",assigns:"Attribuers",start:"Début",end:"Fin",to:"à"},days:{monday:"Lundi",tuesday:"Mardi",wednesday:"Mercredi",thursday:"Jeudi",friday:"Vendredi",saturday:"Samedi",sunday:"Dimanche",weekdays:"Lun à Ven",weekend:"Sam et Dim",all:"Toute",short:{monday:"Lun",tuesday:"Mar",wednesday:"Mer",thursday:"Jeu",friday:"Ven",saturday:"Sam",sunday:"Dim"}},headings:{schedule_actions:"Programmer des Actions",schedule_type:"Type de Programme",schedule_id:"Numéro de Programme",schedule_name:"Nom de Programme",schedule_assignment:"Attribuer de Programme",not_assigned:"(Non Attribué)",rename_schedule:"Renommer le Programme",copy_schedule:"Copier le Programme",delete_schedule:"Supprimer le Programme"},helpers:{enter_new_name:"Entrez un nom pour le Programme",select_copy_schedule:"Sélectionnez le calendrier ci-dessous pour le copier",delete_schedule_confirm:"Êtes-vous sûr de vouloir effacer ce programme",select_a_schedule:"Sélectionner un programme à afficher",add_schedule:"Sélectionnez le type de programme et entrez un nom pour la programme à créer",add_schedule_name:"Saisissez un nom pour le nouveau programme",no_supported_types:"Aucun type de programme compatible avec cet appareil."},rooms:{title:"Pièces",schedules:"Programmes",manage:"Gérer les programmes",back:"Retour à l’accueil",missing:"Cette pièce ou cet appareil n’est plus disponible.",current:"Programme actuel",unassigned:"Aucun programme attribué",choose:"Choisir un programme",no_schedules:"Aucun programme compatible. Créez-en un avec +.",assigning:"Attribution…",assign:"Attribuer le programme",saved:"Programme attribué.",view_schedule:"Voir / modifier le programme",shared:"Ce programme est partagé : les modifications affectent toutes les pièces et appareils associés.",select:"Sélectionnez une pièce pour choisir son programme",empty:"Aucune pièce Wiser trouvée.",edit:"Modifier le programme",save_edit:"Enregistrer le programme",cancel_edit:"Annuler les modifications",delete:"Supprimer le programme",available:"Programme disponible",none:"Aucun programme",removed:"Programme désaffecté."},moments:{title:"Moments",heating:"Chauffage des pièces",description:"Actions prédéfinies pour votre maison. Utilisez les automatisations Home Assistant pour les programmer.",loading:"Chargement des Moments…",failed:"Impossible de charger les Moments. L’accès aux registres peut être limité pour ce compte.",empty:"Aucun Moment Wiser activé pour ce hub. Créez des Moments dans l’application Wiser.",open:"Ouvrir les commandes",unavailable:"Indisponible"},home:{title:"Maison",heating:"Chauffage",hotwater:"Eau chaude",devices:"Éclairage et appareils",empty:"Aucune pièce ni appareil Wiser programmable trouvé."}},Le={common:Oe,wiser:ze};const Pe={en:Object.freeze({__proto__:null,common:Te,default:Ne,wiser:Me}),fr:Object.freeze({__proto__:null,common:Oe,default:Le,wiser:ze})};function Ie(e,t="",i=""){const s=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let o;try{o=e.split(".").reduce((e,t)=>e[t],Pe[s]),o||(o=e.split(".").reduce((e,t)=>e[t],Pe.en))}catch(t){try{o=e.split(".").reduce((e,t)=>e[t],Pe.en)}catch(e){o=""}}return void 0===o&&(o=e.split(".").reduce((e,t)=>e[t],Pe.en)),""!==t&&""!==i&&(o=o.replace(t,i)),o}const Re=e=>e.callWS({type:"wiser/hubs"}),He=(e,t,i="")=>e.callWS({type:"wiser/schedules",hub:t,schedule_type:i}),Ue=(e,t,i,s)=>e.callWS({type:"wiser/schedule/id",hub:t,schedule_type:i,schedule_id:s}),je=(e,t)=>e.callWS({type:"wiser/rooms",hub:t}),Ve=(e,t,i)=>e.callWS({type:"wiser/devices",device_type:i,hub:t}),Be=(e,t,i,s,o,r=!1)=>e.callWS({type:"wiser/schedule/assign",hub:t,schedule_type:i,schedule_id:s,entity_id:o,remove:r});function We(e,t,i){ve(e,"show-dialog",{dialogTag:"wiser-dialog-error",dialogImport:()=>Promise.resolve().then(function(){return Ut}),dialogParams:{title:t,error:i}})}let qe=class extends ne{constructor(){super(...arguments),this.hub="",this.entities=[],this.loading=!0,this.failed=!1,this.request=0}updated(e){(e.has("hub")||e.has("hass")&&!e.get("hass"))&&this.load()}async load(){if(!this.hass)return;const e=++this.request;this.loading=!0,this.failed=!1;try{const[t,i,s]=await Promise.all([this.hass.callWS({type:"config/entity_registry/list"}),this.hass.callWS({type:"config/device_registry/list"}),this.hub?Promise.resolve([this.hub]):Re(this.hass)]);if(e!==this.request)return;const o=this.hub||s[0],r=new Set(i.filter(e=>e.identifiers.some(([e,t])=>"wiser"===e&&t===o)).map(e=>e.id));this.entities=t.filter(e=>{var t;return"wiser"===e.platform&&e.entity_id.startsWith("button.")&&!e.disabled_by&&!e.hidden_by&&e.device_id&&r.has(e.device_id)&&("moment"===e.translation_key||(null===(t=e.original_name)||void 0===t?void 0:t.startsWith("Moments "))||e.unique_id.includes("-button-Moments "))})}catch(t){e===this.request&&(this.entities=[],this.failed=!0)}finally{e===this.request&&(this.loading=!1)}}renderMoment(e){const t=this.hass.states[e.entity_id];return B`<button
      class="moment"
      @click=${()=>ve(this,"hass-more-info",{entityId:e.entity_id})}
    >
      <ha-icon .icon=${"mdi:play-circle-outline"} aria-hidden="true"></ha-icon>
      <span
        ><strong>${t.attributes.friendly_name||e.original_name||e.entity_id}</strong>
        <small
          >${Ie("unavailable"===t.state?"wiser.moments.unavailable":"wiser.moments.open")}</small
        ></span
      >
      <span aria-hidden="true">›</span>
    </button>`}render(){const e=this.entities.filter(e=>{var t;return null===(t=this.hass)||void 0===t?void 0:t.states[e.entity_id]});if(!this.loading&&!this.failed&&!e.length)return B``;let t;return t=this.loading?B`<p role="status">${Ie("wiser.moments.loading")}</p>`:this.failed?B`<p role="status">${Ie("wiser.moments.failed")}</p>
        <button @click=${this.load}>${Ie("common.retry")}</button>`:B`<div class="moments">${e.map(e=>this.renderMoment(e))}</div>`,B`<section>
      <h3>${Ie("wiser.moments.title")}</h3>
      <p>${Ie("wiser.moments.description")}</p>
      ${t}
    </section>`}};qe.styles=a`
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
  `,e([pe({attribute:!1})],qe.prototype,"hass",void 0),e([pe({attribute:!1})],qe.prototype,"hub",void 0),e([ue()],qe.prototype,"entities",void 0),e([ue()],qe.prototype,"loading",void 0),e([ue()],qe.prototype,"failed",void 0),qe=e([le("wiser-moments")],qe);const Fe={GB:"uk",IE:"uk",MT:"uk",CY:"uk",SG:"uk",MY:"uk",HK:"uk",US:"us",CA:"us",MX:"us",AU:"au",NZ:"au",CN:"au",AR:"au",JP:"jp",CH:"ch",LI:"ch",IT:"it",FR:"fr",BE:"fr",PL:"fr",CZ:"fr",SK:"fr",DE:"de",AT:"de",NL:"de",ES:"de",PT:"de",SE:"de",NO:"de",FI:"de",IS:"de",GR:"de"};function Ye(e){const t=Fe[(null==e?void 0:e.trim().toUpperCase())||""];return t?`mdi:power-socket-${t}`:"mdi:power-plug"}let Je;const Ze="a-f\\d",Ge=`#?[${Ze}]{3}[${Ze}]?`,Ke=`#?[${Ze}]{6}([${Ze}]{2})?`,Xe=new RegExp(`[^#${Ze}]`,"gi"),Qe=new RegExp(`^${Ge}$|^${Ke}$`,"i");const et=Math.trunc;function tt(e){return null!=e}function it(e){if(function(e){return 6===(e=String(e).replace("#","")).length&&!isNaN(Number("0x"+e))}(e)){const t=function(e,t={}){if("string"!=typeof e||Xe.test(e)||!Qe.test(e))throw new TypeError("Expected a valid hex string");let i=1;8===(e=e.replace(/^#/,"")).length&&(i=Number.parseInt(e.slice(6,8),16)/255,e=e.slice(0,6)),4===e.length&&(i=Number.parseInt(e.slice(3,4).repeat(2),16)/255,e=e.slice(0,3)),3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]);const s=Number.parseInt(e,16),o=s>>16,r=s>>8&255,a=255&s,n="number"==typeof t.alpha?t.alpha:i;if("array"===t.format)return[o,r,a,n];if("css"===t.format)return`rgb(${o} ${r} ${a}${1===n?"":` / ${Number((100*n).toFixed(2))}%`})`;return{red:o,green:r,blue:a,alpha:n}}(e);return String(t.red+","+t.green+","+t.blue+","+t.alpha)}return"100,100,100"}function st(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function ot(e,t,i){if("Unknown"==i)return"100,100,100";if("onoff"===t.toLowerCase())return it(st(e,"On"==i?"--green-color":"--red-color"));if(["lighting","shutters"].includes(t.toLowerCase()))return(0==(s=parseInt(i))?"50,50,50":et(50+1.85*s)+","+et(50+1.5*s)+",0")+",1";{if(-20==parseFloat(i))return"138, 138, 138";const e=45,t=-10,s=(parseFloat(i)-t)/(e-t);return 235+","+Math.floor(255*(1-s))+","+0+",1"}var s}function rt(e,t){return!t.display_only&&!!(t.admin_only&&e.user.is_admin||!t.admin_only)}function at(e,t){return 0==e.slots.length||e.slots.length-1==t?"23:59":e.slots[t+1].Time}function nt(e,t,i){return-1==t?function(e,t){const i=[...Ee.slice(Ee.indexOf(e.day)),...Ee.slice(0,Ee.indexOf(e.day))].reverse();let s;for(s of i){const e=t.ScheduleData.filter(e=>e.day==s)[0];if(e&&e.slots.length>0)return e.slots[e.slots.length-1].Setpoint}return"Unknown"}(e,i):e.slots[t].Setpoint}function dt(e){const[t,i]=e.split(":");return 3600*+t+60*+i}const lt=e=>e.locale||{language:e.selectedLanguage,number_format:me.system,time_format:ge.system},ct=t=>{class i extends t{connectedCallback(){super.connectedCallback(),this.__checkSubscribed()}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):tt(e)&&e()}this.__unsubs=void 0}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed()}hassSubscribe(){return[]}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe())}}return e([pe({attribute:!1})],i.prototype,"hass",void 0),i};async function ht(e){await e.updateComplete,e.isConnected&&e.dispatchEvent(new CustomEvent("wiser-view-ready",{bubbles:!0,composed:!0}))}let pt=class extends(ct(ne)){constructor(){super(...arguments),this.target_type="heating",this.openCreatedEditor=!1,this.devices=[],this.rooms=[],this.schedules=[],this.loading=!0,this.loaded=!1,this.error="",this.saving=!1,this.selected="",this.saved=!1,this.editing=!1,this.editorSaving=!1,this.editorReady=!1,this.requestId=0}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>{"wiser_updated"!==e.event||this.config.hub&&e.hub!==this.config.hub||this.saving||this.editing||this.loadData()},{type:"wiser_updated"})]}updated(e){super.updated(e),(e.has("config")||e.has("room_id")||e.has("target_type")||e.has("hass")&&!e.get("hass"))&&(this.loaded=!1,this.selected="",this.saved=!1,this.loadData())}compatible(e){return this.schedules.filter(t=>"hotwater"===e?1e3===t.Id:1e3!==t.Id&&("heating"===e?t.Type:t.SubType||t.Type).toLowerCase()===e)}get target(){return"heating"===this.target_type?this.rooms.find(e=>e.Id===this.room_id):this.devices.find(e=>e.Id===this.room_id&&e.kind===this.target_type)}currentSchedule(e,t=this.target_type){return"hotwater"===t?this.schedules.find(e=>1e3===e.Id):this.compatible(t).find(t=>t.Assignments.some(t=>{var i,s;const o=t,r=null!==(i=o.id)&&void 0!==i?i:o.Id;return void 0!==r?String(r)===String(e.Id):(null!==(s=o.name)&&void 0!==s?s:o.Name)===e.Name}))}async loadData(){var e,t,i,s;if(!this.hass||!this.config)return;const o=++this.requestId;this.loading=!0,this.error="";try{await(customElements.get("ha-selector")?Promise.resolve():(Je||(Je=(async()=>{var e;const t=window;if(!t.loadCardHelpers)throw new Error("Home Assistant controls are not available yet. Please retry.");const i=(await t.loadCardHelpers()).createCardElement({type:"entities",entities:[]}).constructor;if(await(null===(e=i.getConfigElement)||void 0===e?void 0:e.call(i)),!customElements.get("ha-selector"))throw new Error("Home Assistant controls could not be loaded. Please retry.")})().catch(e=>{throw Je=void 0,e})),Je));const[r,a,...n]=await Promise.all([je(this.hass,this.config.hub),He(this.hass,this.config.hub),...["lighting","onoff","shutters"].map(e=>Ve(this.hass,this.config.hub,e))]),d=await Promise.all(a.map(e=>Ue(this.hass,this.config.hub,e.Type,e.Id)));if(o!==this.requestId)return;this.rooms=[...r].sort((e,t)=>e.Name.localeCompare(t.Name)),this.schedules=d,this.devices=n.reduce((e,t,i)=>e.concat(t.map(e=>Object.assign(Object.assign({},e),{kind:["lighting","onoff","shutters"][i]}))),[]),d.some(e=>1e3===e.Id)&&this.devices.unshift({Id:1e3,Name:Ie("wiser.home.hotwater"),kind:"hotwater"}),this.loaded=!0;const l=this.target;if(l){const o=this.compatible(this.target_type);this.created_schedule&&o.some(e=>e.Id===this.created_schedule.Id&&e.Type===this.created_schedule.Type)?(this.selected=String(this.created_schedule.Id),this.openCreatedEditor=!0,this.dispatchEvent(new CustomEvent("createdScheduleOpened"))):"none"===this.selected||(o.length<=1?this.selected=String(null!==(t=null===(e=o[0])||void 0===e?void 0:e.Id)&&void 0!==t?t:""):o.some(e=>String(e.Id)===this.selected)||(this.selected=String(null!==(s=null===(i=this.currentSchedule(l))||void 0===i?void 0:i.Id)&&void 0!==s?s:"none")))}}catch(e){o===this.requestId&&(this.error=(null==e?void 0:e.message)||Ie("common.load_failed"))}finally{o===this.requestId&&(this.loading=!1,await this.updateComplete,this.editor&&!this.editorReady||await ht(this))}}async assign(){const e=this.target,t="none"===this.selected,i=t&&e?this.currentSchedule(e):this.compatible(this.target_type).find(e=>String(e.Id)===this.selected);if("hotwater"!==this.target_type&&e&&i&&!this.saving&&rt(this.hass,this.config)){this.saving=!0,this.saved=!1,this.error="";try{await Be(this.hass,this.config.hub,i.Type,i.Id,String(e.Id),t),await this.loadData(),this.saved=!this.error}catch(e){this.error=(null==e?void 0:e.message)||Ie("common.load_failed")}finally{this.saving=!1,await ht(this)}}}get editor(){return this.renderRoot.querySelector("wiser-schedule-edit-card")}scheduleAction(e,t){this.dispatchEvent(new CustomEvent("scheduleAction",{detail:{schedule_type:e.Type,schedule_id:e.Id,action:t}}))}tool(e,t,i,s=!1){const o=Ie(e);return B`<button
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
            ← ${Ie("wiser.rooms.back")}
          </button>`:"";if(this.loading&&!this.loaded)return B`${i}
        <div class="status" role="status">${Ie("common.loading")}</div>`;if(this.error)return B`${i}
        <div class="status" role="alert">${this.error}</div>
        <button @click=${()=>this.loadData()}>${Ie("common.retry")}</button>`;if(void 0!==this.room_id){if(!t)return B`${i}
          <div class="status">${Ie("wiser.rooms.missing")}</div>`;const s=this.currentSchedule(t),o=this.compatible(this.target_type),r="hotwater"===this.target_type,a="none"===this.selected?void 0:o.find(e=>String(e.Id)===this.selected)||s,n=rt(this.hass,this.config),d=this.saving||this.editing||this.editorSaving;return B`
        <input
          class="import-file"
          type="file"
          accept=".json,application/json"
          hidden
          @change=${e=>{var t,i;const s=e.target,o=null===(t=s.files)||void 0===t?void 0:t[0];s.value="",o&&(null===(i=this.editor)||void 0===i||i.importSchedule(o))}}
        />
        <div class="room-heading">
          <h3>${t.Name}</h3>
          <div class="tools">
            ${this.editing?B`
                    ${this.tool("wiser.rooms.cancel_edit","mdi:close",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.cancelClick()},this.editorSaving)}
                    ${this.tool("wiser.rooms.save_edit","mdi:content-save",()=>{var e;null===(e=this.editor)||void 0===e||e.saveClick()},this.editorSaving)}
                  `:B`
                    ${this.tool("wiser.rooms.back","mdi:arrow-left",()=>this.dispatchEvent(new CustomEvent("roomsBack")),d)}
                    ${a?this.tool("wiser.actions.export","mdi:download",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.exportSchedule()},d||!this.editorReady):""}
                    ${n&&a?this.tool("wiser.actions.import","mdi:upload",()=>{var e;return null===(e=this.renderRoot.querySelector(".import-file"))||void 0===e?void 0:e.click()},d||!this.editorReady):""}
                    ${n&&a?B`
                            ${this.tool("wiser.rooms.edit","mdi:pencil",()=>{var e;return null===(e=this.editor)||void 0===e?void 0:e.editClick()},d||!this.editorReady)}
                            ${this.tool("wiser.actions.rename","mdi:form-textbox",()=>this.scheduleAction(a,"rename"),d)}
                            ${this.tool("wiser.actions.copy","mdi:content-copy",()=>this.scheduleAction(a,"copy"),d||r)}
                            ${this.tool("wiser.rooms.delete","mdi:delete-outline",()=>{var e;null===(e=this.editor)||void 0===e||e.deleteClick()},d||!this.editorReady||r)}
                          `:""}
                    ${n&&!r?B`
                            ${this.tool("wiser.actions.add_schedule","mdi:plus",()=>this.dispatchEvent(new CustomEvent("addScheduleClick")),d)}
                            ${this.tool("wiser.rooms.assign","mdi:check",()=>{this.assign()},d||!this.selected||("none"===this.selected?!s:this.selected===String(null==s?void 0:s.Id)))}
                          `:""}
                  `}
          </div>
        </div>
        <p class="secondary">
          ${Ie("wiser.rooms.current")}: <strong>${null!==(e=null==s?void 0:s.Name)&&void 0!==e?e:Ie("wiser.rooms.unassigned")}</strong>
        </p>
        ${n&&!r?B`
                ${o.length>0?B`<ha-selector
                        class="schedule-picker"
                        .hass=${this.hass}
                        .label=${Ie("wiser.rooms.choose")}
                        .selector=${{select:{mode:"dropdown",options:o.map(e=>({value:String(e.Id),label:e.Name}))}}}
                        .value=${"none"===this.selected?void 0:this.selected||void 0}
                        .required=${!1}
                        .disabled=${d}
                        @value-changed=${e=>{e.stopPropagation(),d||null!=e.detail.value&&""!==e.detail.value&&!o.some(t=>String(t.Id)===e.detail.value)||(this.selected=e.detail.value||"none",this.saved=!1)}}
                      ></ha-selector>`:1!==o.length||s?"":B`<p class="secondary">
                          ${Ie("wiser.rooms.available")}: <strong>${o[0].Name}</strong>
                        </p>`}
                ${o.length?"":B`<p class="secondary">${Ie("wiser.rooms.no_schedules")}</p>`}
              `:""}
        ${a?B`
                <wiser-schedule-edit-card
                  .hass=${this.hass}
                  .config=${this.config}
                  .embedded=${!0}
                  .schedule_id=${a.Id}
                  .schedule_type=${a.Type}
                  @editor-state=${e=>{var t;this.editing=e.detail.editing,this.editorSaving=e.detail.saving,this.editorReady=e.detail.ready,this.openCreatedEditor&&e.detail.ready&&!e.detail.editing&&(this.openCreatedEditor=!1,null===(t=this.editor)||void 0===t||t.editClick())}}
                  @scheduleDeleted=${()=>{this.selected="",this.loadData()}}
                >
                </wiser-schedule-edit-card>
              `:""}
        ${this.saved?B`<p role="status">${Ie("none"===this.selected?"wiser.rooms.removed":"wiser.rooms.saved")}</p>`:""}
        ${a&&a.Assignments.length>1?B`<p class="secondary">${Ie("wiser.rooms.shared")}</p>`:""}
        ${this.saving?B`<p role="status">${Ie("wiser.rooms.assigning")}</p>`:""}
      `}const s=[{title:"heating",items:this.rooms.map(e=>Object.assign(Object.assign({},e),{kind:"heating"}))},{title:"hotwater",items:this.devices.filter(e=>"hotwater"===e.kind)},{title:"devices",items:this.devices.filter(e=>"hotwater"!==e.kind)}];return B`
      ${s.filter(e=>e.items.length).map(e=>B` <section>
              <h3 class="section-heading">${Ie("wiser.home."+e.title)}</h3>
              <div class=${"list"===this.config.view_type?"rooms list":"rooms"}>
                ${e.items.map(e=>{var t,i,s,o;return B` <button
                      class="room"
                      @click=${()=>this.dispatchEvent(new CustomEvent("roomClick",{detail:{id:e.Id,kind:e.kind}}))}
                    >
                      <span class="icon" aria-hidden="true"
                        ><ha-icon
                          .icon=${{heating:"mdi:home-thermometer-outline",hotwater:"mdi:water-boiler",lighting:"mdi:lightbulb-outline",onoff:Ye(null===(i=null===(t=this.hass)||void 0===t?void 0:t.config)||void 0===i?void 0:i.country),shutters:"mdi:window-shutter"}[e.kind]}
                        ></ha-icon
                      ></span>
                      <span class="room-text"
                        ><strong>${e.Name}</strong
                        ><span class="secondary"
                          >${null!==(o=null===(s=this.currentSchedule(e,e.kind))||void 0===s?void 0:s.Name)&&void 0!==o?o:Ie("wiser.rooms.unassigned")}</span
                        ></span
                      >
                      <span class="chevron" aria-hidden="true">›</span>
                    </button>`})}
              </div>
            </section>`)}
      ${this.rooms.length||this.devices.length?"":B`<p class="secondary">${Ie("wiser.home.empty")}</p>`}
      <wiser-moments .hass=${this.hass} .hub=${this.config.hub||""}></wiser-moments>
    `}};pt.styles=a`
    :host {
      display: block;
      color: var(--primary-text-color);
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
      color: var(--primary-color);
    }
    h3 {
      margin: 16px 0 8px;
      font-size: calc(22px + 1pt);
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
    .rooms {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
      gap: 10px;
    }
    .rooms.list {
      grid-template-columns: 1fr;
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
    .room {
      display: flex;
      gap: 12px;
      align-items: center;
      text-align: start;
      padding: 14px;
      min-height: 82px;
    }
    .room-text {
      display: flex;
      flex: 1;
      min-width: 0;
      flex-direction: column;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .room-text strong {
      font-weight: 500;
    }
    .room-text .secondary {
      font-size: calc(12px + 1pt);
    }
    .icon {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: var(--secondary-background-color);
      color: var(--primary-color);
    }
    .chevron {
      color: var(--secondary-text-color);
      font-size: calc(24px + 1pt);
    }
    .back {
      border: 0;
      background: none;
      color: var(--primary-color);
      padding-inline-start: 0;
    }
    .schedule-picker {
      display: block;
      width: 100%;
      max-width: 420px;
      margin: 20px 0 12px;
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
  `,e([pe({attribute:!1})],pt.prototype,"config",void 0),e([pe({attribute:!1})],pt.prototype,"room_id",void 0),e([pe({attribute:!1})],pt.prototype,"target_type",void 0),e([pe({attribute:!1})],pt.prototype,"created_schedule",void 0),e([ue()],pt.prototype,"devices",void 0),e([ue()],pt.prototype,"rooms",void 0),e([ue()],pt.prototype,"schedules",void 0),e([ue()],pt.prototype,"loading",void 0),e([ue()],pt.prototype,"loaded",void 0),e([ue()],pt.prototype,"error",void 0),e([ue()],pt.prototype,"saving",void 0),e([ue()],pt.prototype,"selected",void 0),e([ue()],pt.prototype,"saved",void 0),e([ue()],pt.prototype,"editing",void 0),e([ue()],pt.prototype,"editorSaving",void 0),e([ue()],pt.prototype,"editorReady",void 0),pt=e([le("wiser-room-schedules")],pt);const ut=a`
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
`,mt=a`
  ${ut}
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
`;let gt=class extends ne{async showDialog(e){this._params=e,await this.updateComplete}async closeDialog(){const e=this._params;this._params=void 0,null==e||e.cancel()}render(){var e;return this._params?B`
      <ha-dialog
        open
        header-title=${Ie("wiser.headings.delete_schedule")}
        .heading=${Ie("wiser.headings.delete_schedule")}
        @closed=${this.closeDialog}
        @close-dialog=${this.closeDialog}
      >
        <div class="wrapper">${Ie("wiser.helpers.delete_schedule_confirm")+" "+this._params.name+"?"}</div>
        <div
          class="actions"
          slot=${"headerTitle"in((null===(e=customElements.get("ha-dialog"))||void 0===e?void 0:e.prototype)||{})?"footer":q}
        >
          <ha-button appearance="plain" @click=${this.cancelClick}>${this.hass.localize("ui.common.cancel")}</ha-button>
          <ha-button variant="danger" @click=${this.confirmClick}>${this.hass.localize("ui.common.delete")}</ha-button>
        </div>
      </ha-dialog>
    `:B``}confirmClick(){const e=this._params;this._params=void 0,null==e||e.confirm()}cancelClick(){this.closeDialog()}static get styles(){return a`
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 16px;
      }
      div.wrapper {
        color: var(--primary-text-color);
      }
    `}};e([pe({attribute:!1})],gt.prototype,"hass",void 0),e([ue()],gt.prototype,"_params",void 0),gt=e([le("wiser-dialog-delete-confirm")],gt);var vt=Object.freeze({__proto__:null,get DialogDeleteConfirm(){return gt}});function yt(e){if(e.match(/^([0-9:]+)$/)){const t=e.split(":").map(Number);return 3600*t[0]+60*t[1]+(t[2]||0)}const t=new Date(e);return 3600*t.getHours()+60*t.getMinutes()+t.getSeconds()}function _t(e){const t=Math.floor(e/3600);e-=3600*t;const i=Math.floor(e/60);e-=60*i;const s=Math.round(e);return String(t%24).padStart(2,"0")+":"+String(i).padStart(2,"0")+":"+String(s).padStart(2,"0")}function bt(e){const t=Math.floor(e/3600);e-=3600*t;const i=Math.floor(e/60);return String(t%24).padStart(2,"0")+":"+String(i).padStart(2,"0")}function ft(e,t,i={wrapAround:!0}){let s=e>=0?Math.floor(e/3600):Math.ceil(e/3600),o=Math.floor((e-3600*s)/60);o%t!=0&&(o=Math.round(o/t)*t),o>=60?(s++,o-=60):o<0&&(s--,o+=60),i.wrapAround&&(s>=24?s-=24:s<0&&(s+=24));const r=3600*s+60*o;if(i.maxHours){if(r>3600*i.maxHours)return 3600*i.maxHours;if(r<3600*-i.maxHours)return 3600*-i.maxHours}return r}var wt=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,xt=/\[([^]*?)\]/gm;function $t(e,t){for(var i=[],s=0,o=e.length;s<o;s++)i.push(e[s].substr(0,t));return i}function St(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];for(var s=0,o=t;s<o.length;s++){var r=o[s];for(var a in r)e[a]=r[a]}return e}var kt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Ct=["January","February","March","April","May","June","July","August","September","October","November","December"],Et=$t(Ct,3),At=St({},{dayNamesShort:$t(kt,3),dayNames:kt,monthNamesShort:Et,monthNames:Ct,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}}),Dt=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},Tt={D:function(e){return String(e.getDate())},DD:function(e){return Dt(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return Dt(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return Dt(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return Dt(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return Dt(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return Dt(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return Dt(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return Dt(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return Dt(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return Dt(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return Dt(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+Dt(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+Dt(Math.floor(Math.abs(t)/60),2)+":"+Dt(Math.abs(t)%60,2)}},Mt={default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},Nt=function(e,t,i){if(void 0===t&&(t=Mt.default),void 0===i&&(i={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var s=[];t=(t=Mt[t]||t).replace(xt,function(e,t){return s.push(t),"@@@"});var o=St(St({},At),i);return(t=t.replace(wt,function(t){return Tt[t](e,o)})).replace(/@@@/g,function(){return s.shift()})};const Ot=e=>{if(e.time_format===ge.language||e.time_format===ge.system){const t=e.time_format===ge.language?e.language:void 0,i=(new Date).toLocaleString(t);return i.includes("AM")||i.includes("PM")}return e.time_format===ge.am_pm};function zt(e,t,i){return i===ge.am_pm||!i&&t.time_format===ge.am_pm?Nt(e,"h:mm A"):i===ge.twenty_four||!i&&t.time_format===ge.twenty_four?Nt(e,"shortTime"):(()=>{try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}return!1})()?e.toLocaleTimeString(t.language,{hour:"numeric",minute:"2-digit",hour12:Ot(t)}):Ot(t)?zt(e,t,ge.am_pm):zt(e,t,ge.twenty_four)}function Lt(e){const t=new Date,i=(e||"").match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})/);null!==i&&t.setFullYear(Number(i[1]),Number(i[2])-1,Number(i[3]));const s=(e||"").match(/([0-9]{2}):([0-9]{2})(:([0-9]{2}))?$/);return null!==s&&t.setHours(Number(s[1]),Number(s[2]),s.length>4?Number(s[4]):t.getSeconds()),t}let Pt=class extends ne{constructor(){super(...arguments),this.min=0,this.max=255,this.step=1,this.scaleFactor=1,this.unit="",this.optional=!1,this.disabled=!1,this._displayedValue=0}set value(e){e=isNaN(e)?this.min:this._roundedValue(e/this.scaleFactor),this._displayedValue=e}render(){return B`
      <div class="checkbox-container">
        <div class="checkbox">${this.getCheckbox()}</div>
        <div class="slider">${this.getSlider()}</div>
        <div class="value${this.disabled?" disabled":""}">${this._displayedValue}${this.unit}</div>
      </div>
    `}getSlider(){return B`<input
      type="range"
      aria-label=${"°C"===this.unit?"Temperature":"Level"}
      min=${this.min}
      max=${this.max}
      step=${this.step}
      .value=${String(this._displayedValue)}
      ?disabled=${this.disabled}
      @input=${this._updateValue}
    />`}getCheckbox(){return this.optional?B`
      <input type="checkbox" aria-label="Enable value" @change=${this._toggleChecked} .checked=${!this.disabled} />
    `:B``}_toggleChecked(e){const t=e.target.checked;this.disabled=!t;const i=this.disabled?null:this._scaledValue(this._displayedValue);ve(this,"value-changed",{value:i})}_updateValue(e){let t=Number(e.target.value);this._displayedValue=t,t=this._scaledValue(this._displayedValue),ve(this,"value-changed",{value:t})}_roundedValue(e){return e=Math.round(e/this.step)*this.step,(e=parseFloat(e.toPrecision(12)))>this.max?e=this.max:e<this.min&&(e=this.min),e}_scaledValue(e){return e=this._roundedValue(e),e*=this.scaleFactor,e=parseFloat(e.toFixed(2))}};Pt.styles=a`
    ${mt} :host {
      width: 100%;
    }
    input[type='range'] {
      width: 100%;
    }
  `,e([pe({type:Number})],Pt.prototype,"min",void 0),e([pe({type:Number})],Pt.prototype,"max",void 0),e([pe({type:Number})],Pt.prototype,"step",void 0),e([pe({type:Number})],Pt.prototype,"value",null),e([pe({type:Number})],Pt.prototype,"scaleFactor",void 0),e([pe({type:String})],Pt.prototype,"unit",void 0),e([pe({type:Boolean})],Pt.prototype,"optional",void 0),e([pe({type:Boolean})],Pt.prototype,"disabled",void 0),e([pe({type:Number})],Pt.prototype,"_displayedValue",void 0),Pt=e([le("wiser-variable-slider")],Pt);let It=class extends ne{render(){return B` <div id="time-bar" class="time-wrapper">${this.renderTimes()}</div> `}renderTimes(){if(this.hass){const e=parseFloat(getComputedStyle(this).getPropertyValue("width"))||460,t=[1,2,3,4,6,8,12],i=Ot(lt(this.hass))?55:40;let s=Math.ceil(24/(e/i));for(;!t.includes(s);)s++;const o=[0,...Array.from(Array(24/s-1).keys()).map(e=>(e+1)*s),24];return o.map(e=>{const t=0==e||24==e,i=t?s/48*100:s/24*100;return B`
          <div style="width: ${Math.floor(100*i)/100}%" class="${t?"":"time"}">
            ${t?"":zt(Lt(_t(3600*e)),lt(this.hass))}
          </div>
        `})}return B``}static get styles(){return a`
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
    `}};e([pe({attribute:!1})],It.prototype,"hass",void 0),It=e([le("wiser-time-bar")],It);let Rt=class extends ne{constructor(){super(),this.editMode=!1,this._activeSlot=-99,this._activeDay="",this._show_short_days=!1,this.schedule_type=xe[0],this.activeMarker=0,this.isDragging=!1,this.currentTime=0,this.timer=0,this.timeout=0,this.zoomFactor=1,this.rangeMin=0,this.rangeMax=_e,this.stepSize=5,this.initialise()}async initialise(){return this.schedule&&(this.schedule_type=this.schedule.Type),!0}shouldUpdate(){return this.editMode||(this._activeSlot=-99,this._activeDay=""),!0}render(){const e=parseFloat(getComputedStyle(this).getPropertyValue("width"));return this._show_short_days=e<500,this.hass&&this.config&&this.suntimes&&this.schedule?B`
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
            ${this.editMode&&$e.includes(this.schedule_type)?this.renderSpecialTimeButtons():null}
            ${this.editMode?this.renderAddDeleteButtons():null}
            ${this.editMode?this.renderSetPointControl():null}
            ${this.editMode?this.renderCopyDay():null}
        `:B``}renderDay(e){return B`
      <div class="wrapper">
        ${this.computeDayLabel(e.day)}
        <div class="outer" id="${e.day}">
          <div class="wrapper selectable">
            ${e.slots.length>0?e.slots.map((t,i)=>this.renderSlot(t,i,e)):this.renderEmptySlot({Time:"23:59",Setpoint:"0",SpecialTime:""},-1,e,!0)}
          </div>
        </div>
      </div>
    `}renderEmptySlot(e,t,i,s=!1){const o="00:00",r=e.Time,a=nt(i,t,this.schedule),n=parseFloat(getComputedStyle(this).getPropertyValue("width")),d=this.config.theme_colors?"rgba(var(--rgb-primary-color), 0.7)":"rgba("+ot(this,this.schedule_type,a)+")",l=(dt(r)-dt(o))/_e*100,c=Ie("wiser.labels.start")+" - "+o+"\n"+Ie("wiser.labels.end")+" - "+r+"\n"+Ie("wiser.labels.setting")+" - "+this.computeSetpointLabel(a),h=l/100*n<35?"setpoint rotate":"setpoint";return B`
      <div
        id=${i.day+"|-1"}
        class="slot previous ${this.editMode&&s?"selectable":null} ${this._activeSlot==t&&this._activeDay==i.day?"selected":null} ${this.config.theme_colors?"theme-colors":null}"
        style="width:${Math.floor(1e3*l)/1e3}%; background:${d};"
        title="${c}"
        @click=${s?this._slotClick:null}
        slot="${-1}"
      >
        <div class="slotoverlay previous">
          <span class="${h}">${this.computeSetpointLabel(a)}</span>
        </div>
      </div>
    `}renderSlot(e,t,i){const s=e.Time,o=at(i,t),r=e.Setpoint,a=(dt(o)-dt(s))/_e*100,n=this.config.theme_colors?"rgba(var(--rgb-primary-color), 0.7)":"rgba("+ot(this,this.schedule_type,r)+")",d=a/100*parseFloat(getComputedStyle(this).getPropertyValue("width"))<35?"setpoint rotate":"setpoint",l=Ie("wiser.labels.start")+" - "+(e.SpecialTime?e.SpecialTime+" ("+s+")":s)+"\n"+Ie("wiser.labels.end")+" - "+o+"\n"+Ie("wiser.labels.setting")+" - "+this.computeSetpointLabel(r);return B`
      ${0==t&&"00:00"!=s&&"0:00"!=s?this.renderEmptySlot(e,-1,i,!1):""}
      <div
        id=${i.day+"|"+t}
        class="slot ${this.editMode?"selectable":null} ${this._activeSlot==t&&this._activeDay==i.day?"selected":null}"
        style="width:${Math.floor(1e3*a)/1e3}%; background:${n};"
        title="${l}"
        @click=${this._slotClick}
        slot="${t}"
      >
        <div class="slotoverlay ${this.editMode?"selectable":null}">
          <span class="${d}">${this.computeSetpointLabel(r)}</span>
        </div>
        ${this._activeSlot==t&&this._activeDay==i.day?B`
                ${yt(i.slots[t].Time)>0?this.renderBoundaryHandle(i,t,!1):""}
                ${t<i.slots.length-1?this.renderBoundaryHandle(i,t+1,!0):""}
              `:""}
      </div>
    `}renderBoundaryHandle(e,t,i){return B`
      <div class=${i?"handle end-handle":"handle"}>
        <div class="button-holder">
          <ha-icon-button
            class="time-handle"
            .label=${i?"Adjust end time":"Adjust start time"}
            .path=${"M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z"}
            data-boundary=${t}
            @click=${e=>e.stopPropagation()}
            @mousedown=${this._handleTouchStart}
            @touchstart=${this._handleTouchStart}
          ></ha-icon-button>
        </div>
      </div>
      ${this.renderTooltip(e,t,i)}
    `}renderSpecialTimeButtons(){const e=this._activeDay?this.schedule.ScheduleData.filter(e=>e.day==this._activeDay)[0].slots[this._activeSlot]:null;return B`
      <div class="wrapper special-times" style="white-space: normal;">
        <div class="day  ${this._show_short_days?"short":""}">&nbsp;</div>
        <div class="sub-section">
          <div class="sub-heading">Set Special Time</div>
          <button type="button" id=${"sunrise"} @click=${this._setSpecialTime} ?disabled=${!e}>
            <ha-icon id=${"sunrise"} icon="hass:weather-sunny" class="padded-right"></ha-icon>
            Sunrise
          </button>
          <button type="button" id=${"sunset"} @click=${this._setSpecialTime} ?disabled=${!e}>
            <ha-icon id=${"sunset"} icon="hass:weather-night" class="padded-right"></ha-icon>
            Sunset
          </button>
        </div>
      </div>
    `}renderAddDeleteButtons(){let e=0;return this.schedule.ScheduleData.filter(e=>e.day==this._activeDay).length>0&&(e=this._activeDay?this.schedule.ScheduleData.filter(e=>e.day==this._activeDay)[0].slots.length:0),B`
      <div class="wrapper" style="white-space: normal;">
        <div class="day  ${this._show_short_days?"short":""}">&nbsp;</div>
        <div class="sub-section">
          <button
            type="button"
            size="small"
            style="padding: 0 2px"
            @click=${this._addSlot}
            .disabled=${this._activeSlot<-1||e>=24}
          >
            <ha-icon slot="start" icon="hass:plus-circle-outline" class="padded-right"></ha-icon>
            ${Ie("wiser.actions.add")}
          </button>
          <button
            type="button"
            size="small"
            style="padding: 0 2px"
            @click=${this._removeSlot}
            .disabled=${this._activeSlot<0||e<1}
          >
            <ha-icon slot="start" icon="hass:minus-circle-outline" class="padded-right"></ha-icon>
            ${this.hass.localize("ui.common.delete")}
          </button>
        </div>
      </div>
    `}renderSetPointControl(){let e={};return this.editMode?(this.schedule.ScheduleData.filter(e=>e.day==this._activeDay).length>0&&(e=this._activeDay?this.schedule.ScheduleData.filter(e=>e.day==this._activeDay)[0].slots:{}),"Heating"==this.schedule_type?B`
          <div class="temperature-row">
            <div class="temperature-controls">
              <div class="section-header">${this._show_short_days?"Temp":"Temperature"}</div>
              <div class="temperature-input">
                <button
                  type="button"
                  aria-label="Heating off"
                  class="set-off-button"
                  .disabled=${this._activeSlot<0}
                  @click=${()=>this._updateSetPoint("-20")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${"M3.28,2L2,3.27L4.77,6.04L5.64,7.39L4.22,9.6L5.95,10.5L7.23,8.5L10.73,12H4A2,2 0 0,0 2,14V22H4V20H18.73L20,21.27V22H22V20.73L22,20.72V20.72L3.28,2M7,17A1,1 0 0,1 6,18A1,1 0 0,1 5,17V15A1,1 0 0,1 6,14A1,1 0 0,1 7,15V17M11,17A1,1 0 0,1 10,18A1,1 0 0,1 9,17V15A1,1 0 0,1 10,14A1,1 0 0,1 11,15V17M15,17A1,1 0 0,1 14,18A1,1 0 0,1 13,17V15C13,14.79 13.08,14.61 13.18,14.45L15,16.27V17M16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5M22,14V18.18L19,15.18V15A1,1 0 0,0 18,14C17.95,14 17.9,14 17.85,14.03L15.82,12H20C21.11,12 22,12.9 22,14M11.64,7.3L10.22,5.1L12.22,2L13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L12.84,9L11.44,7.62L11.64,7.3M7.5,3.69L6.1,2.28L6.22,2.09L7.95,3L7.5,3.69Z"}></path></svg>
                </button>
                <wiser-variable-slider
                  min="5"
                  max="30"
                  step="0.5"
                  value=${this._activeSlot>=0?parseFloat(e[this._activeSlot].Setpoint):0}
                  unit="°C"
                  .optional=${!1}
                  .disabled=${this._activeSlot<0}
                  @value-changed=${e=>{this._updateSetPoint(Number(e.detail.value))}}
                >
                </wiser-variable-slider>
              </div>
            </div>
          </div>
        `:"OnOff"==this.schedule_type?B`
          <div class="wrapper" style="height: 36px;">
            <div class="day  ${this._show_short_days?"short":""}">&nbsp;</div>
            <div class="sub-section">
              <div style="display: flex; justify-content: center;">
                <div class="section-header" style="padding-right: 30%">State</div>
                <div style="display: flex; line-height: 32px;">
                  <span>Off</span>
                  <input
                    type="checkbox"
                    role="switch"
                    aria-label="Scheduled state"
                    style="margin: 8px 10px;"
                    .checked=${this._activeSlot>=0&&"On"==e[this._activeSlot].Setpoint}
                    .disabled=${this._activeSlot<0}
                    @change=${()=>"On"==e[this._activeSlot].Setpoint?this._updateSetPoint("Off"):this._updateSetPoint("On")}
                  />
                  <span>On</span>
                </div>
              </div>
            </div>
          </div>
        `:["Lighting","Shutters"].includes(this.schedule_type)?B`
          <div class="wrapper" style="white-space: normal;">
            <div class="day  ${this._show_short_days?"short":""}">&nbsp;</div>
            <div class="sub-section">
              <div class="section-header">Level</div>
              <div style="display: flex; line-height: 32px; width: 100%; max-width: 400px;">
                <wiser-variable-slider
                  min="0"
                  max="100"
                  step="1"
                  value=${this._activeSlot>=0?parseFloat(e[this._activeSlot].Setpoint):0}
                  unit="%"
                  .optional=${!1}
                  .disabled=${this._activeSlot<0}
                  @value-changed=${e=>{this._updateSetPoint(Number(e.detail.value))}}
                >
                </wiser-variable-slider>
              </div>
            </div>
          </div>
        `:B``):B``}renderCopyDay(){return B`
      <div class="wrapper" style="white-space: normal; padding-top: 10px;">
        <div class="day  ${this._show_short_days?"short":""}">&nbsp;</div>
        <div>
          <div class="section-header">
            ${this._activeDay?Ie("wiser.actions.copy")+" "+Ie("wiser.days."+this._activeDay.toLowerCase())+" "+Ie("wiser.labels.to"):Ie("wiser.actions.copy")+" "+Ie("wiser.labels.to")}
          </div>
          <div>
            ${Ee.concat(Se).concat("All").map(e=>this.renderCopyToButton(e))}
          </div>
        </div>
      </div>
    `}renderCopyToButton(e){return B`
      <button
        type="button"
        id=${e}
        appearance="plain"
        size="small"
        @click=${this._copyDay}
        ?disabled=${this._activeDay==e||!this._activeDay}
      >
        ${Ee.includes(e)&&this._show_short_days?Ie("wiser.days.short."+e.toLowerCase()):Ie("wiser.days."+e.toLowerCase())}
      </button>
    `}renderTooltip(e,t,i=!1){const s=e.slots,o=Ae.includes(s[t].SpecialTime);return B`
      <div class=${i?"tooltip-container center end-time":"tooltip-container center"}>
        <div class="tooltip ${this._activeSlot===t?"active":""}">
          ${o?B`
                  <ha-icon
                    icon="hass:${s[t].SpecialTime==Ae[0]?"weather-sunny":"weather-night"}"
                  ></ha-icon>
                  ${s[t].SpecialTime}
                `:zt(Lt(_t(yt(s[t].Time))),lt(this.hass))}
        </div>
      </div>
    `}_slotClick(e){const t=e.currentTarget;if(t.id){const e=t.id.split("|")[0],i=t.id.split("|")[1];i!=this._activeSlot||e!=this._activeDay?(this._activeSlot=parseInt(i),this._activeDay=e):(this._activeSlot=-99,this._activeDay="");const s=new CustomEvent("slotClicked",{detail:{day:this._activeDay,slot:this._activeSlot}});this.dispatchEvent(s)}}_copyDay(e){const t=e.currentTarget,i=JSON.stringify(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots);Ee.includes(t.id)?this.schedule.ScheduleData[Ee.indexOf(t.id)].slots=JSON.parse(i):t.id==Se[0]?ke.map(e=>{this.schedule.ScheduleData[Ee.indexOf(e)].slots=JSON.parse(i)}):t.id==Se[1]?Ce.map(e=>{this.schedule.ScheduleData[Ee.indexOf(e)].slots=JSON.parse(i)}):"All"==t.id&&Ee.map(e=>{this.schedule.ScheduleData[Ee.indexOf(e)].slots=JSON.parse(i)}),this.requestUpdate()}_updateSetPoint(e){this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots=Object.assign(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots,{[this._activeSlot]:Object.assign(Object.assign({},this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot]),{Setpoint:e})});const t=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(t),this.requestUpdate()}getSunTime(e,t){return t==Ae[0]?this.suntimes.Sunrises[Ee.indexOf(e)].time:this.suntimes.Sunsets[Ee.indexOf(e)].time}convertScheduleDay(e){const t=e.slots.map(t=>Ae.includes(t.SpecialTime)?{Time:this.getSunTime(e.day,t.SpecialTime),Setpoint:t.Setpoint,SpecialTime:t.SpecialTime}:{Time:t.Time,Setpoint:t.Setpoint,SpecialTime:t.SpecialTime}).sort((e,t)=>parseInt(e.Time.replace(":",""))<parseInt(t.Time.replace(":",""))?0:1),i=new Set(t.map(e=>JSON.stringify(e))),s=Array.from(i).map(e=>JSON.parse(e));return{day:e.day,slots:s}}_setSpecialTime(e){const t=e.currentTarget.id.replace(/\w\S*/g,e=>e.charAt(0).toUpperCase()+e.substr(1).toLowerCase());this._activeDay&&this._activeSlot>=0&&(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot].SpecialTime!=t&&(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots=Object.assign(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots,{[this._activeSlot]:Object.assign(Object.assign({},this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots[this._activeSlot]),{SpecialTime:t,Time:this.getSunTime(this._activeDay,t)})})),this.schedule.ScheduleData[Ee.indexOf(this._activeDay)]=this.convertScheduleDay(this.schedule.ScheduleData[Ee.indexOf(this._activeDay)]),this.schedule.ScheduleData[Ee.indexOf(this._activeDay)].slots.forEach((e,i)=>{e.SpecialTime==t&&(this._activeSlot=i)}),this.requestUpdate())}_addSlot(){if(this._activeSlot<-1)return;const e=Ee.indexOf(this._activeDay);if(this._activeSlot<0)this.schedule.ScheduleData[e].slots=[{Time:bt(yt("06:00")),Setpoint:fe[this.schedule_type],SpecialTime:""}],this._activeSlot=0;else{const t=this.schedule.ScheduleData[e].slots[this._activeSlot];let i=yt(t.Time),s=yt(at(this.schedule.ScheduleData[e],this._activeSlot));s<i&&(s+=_e);const o=ft(i+(s-i)/2,this.stepSize);t.SpecialTime?(i=ft(i-yt("01:00"),this.stepSize),this.schedule.ScheduleData[e].slots=[...this.schedule.ScheduleData[e].slots.slice(0,this._activeSlot),{Time:bt(i),Setpoint:t.Setpoint,SpecialTime:""},...this.schedule.ScheduleData[e].slots.slice(this._activeSlot)]):this.schedule.ScheduleData[e].slots=[...this.schedule.ScheduleData[e].slots.slice(0,this._activeSlot),{Time:bt(i),Setpoint:t.Setpoint,SpecialTime:""},Object.assign(Object.assign({},this.schedule.ScheduleData[e].slots[this._activeSlot]),{Time:bt(o)}),...this.schedule.ScheduleData[e].slots.slice(this._activeSlot+1)],this._activeSlot++}const t=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(t),this.requestUpdate()}_removeSlot(){if(this._activeSlot<0)return;const e=Ee.indexOf(this._activeDay),t=this._activeSlot;this.schedule.ScheduleData[e].slots=0==t?[...this.schedule.ScheduleData[e].slots.slice(t+1)]:[...this.schedule.ScheduleData[e].slots.slice(0,t),...this.schedule.ScheduleData[e].slots.slice(t+1)],this._activeSlot==this.schedule.ScheduleData[e].slots.length&&this._activeSlot--;const i=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(i),this.requestUpdate()}_handleTouchStart(e){const t=Ee.indexOf(this._activeDay);let i=this.schedule.ScheduleData.filter(e=>e.day==this._activeDay)[0].slots;const s=e.currentTarget;let o=s;for(;!o.classList.contains("outer");)o=o.parentElement;const r=parseFloat(getComputedStyle(o).getPropertyValue("width")),a=_e/(this.rangeMax-this.rangeMin)*r,n=-(-this.rangeMin/(this.rangeMax-this.rangeMin)*r)/a*_e;let d=s;for(;!d.classList.contains("slot");)d=d.parentElement;const l=d,c=Number(s.dataset.boundary);if(!Number.isInteger(c)||c<0||c>=i.length)return;const h=c>0?yt(i[c-1].Time)+60*this.stepSize:0,p=c<i.length-1?(yt(at(this.schedule.ScheduleData[t],c))||_e)-60*this.stepSize:_e-60*this.stepSize;this.isDragging=!0;const u=l.parentElement.parentElement.getBoundingClientRect();let m=e=>{let s;s="undefined"!=typeof TouchEvent&&e instanceof TouchEvent?e.changedTouches[0].pageX:e.pageX;let o=s-u.left;o>r-1&&(o=r-1),o<-18&&(o=-18);let d=Math.round(o/a*_e+n);d<h&&(d=h),d>p&&(d=p),this.currentTime=d,d=Math.round(d)>=_e?_e:ft(d,this.stepSize);const l=bt(d);l!=at(this.schedule.ScheduleData[t],c)&&(i=Object.assign(i,{[c]:Object.assign(Object.assign({},i[c]),{Time:l,SpecialTime:""})}),this.requestUpdate())};const g=()=>{window.removeEventListener("mousemove",m),window.removeEventListener("touchmove",m),window.removeEventListener("mouseup",g),window.removeEventListener("touchend",g),window.removeEventListener("blur",g),m=()=>{},setTimeout(()=>{this.isDragging=!1},100),s.blur();const e=new CustomEvent("scheduleChanged",{detail:{schedule:this.schedule}});this.dispatchEvent(e)};window.addEventListener("mouseup",g),window.addEventListener("touchend",g),window.addEventListener("blur",g),window.addEventListener("mousemove",m),window.addEventListener("touchmove",m)}computeDayLabel(e){return B`
      <div class="day  ${this._show_short_days?"short":""}">
        ${this._show_short_days?Ie("wiser.days.short."+e.toLowerCase()):Ie("wiser.days."+e.toLowerCase())}
      </div>
    `}computeSetpointLabel(e){return"Unknown"==e?e:"Heating"==this.schedule_type&&-20==e?"Off":e+we[this.schedule_type]}static get styles(){return a`
      ${ut}
      :host {
        display: block;
        max-width: 100%;
      }
      div.outer {
        width: 100%;
        overflow: visible;
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
      .special-times {
        justify-content: flex-end;
        line-height: 40px;
        padding: 0 5px;
        text-transform: uppercase;
        font-size: calc(13px + 1pt);
      }
      .temperature-row {
        display: flex;
        justify-content: center;
        width: 100%;
        padding-top: 10px;
      }
      .temperature-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
        width: min(100%, 540px);
      }
      .temperature-input {
        display: flex;
        align-items: center;
        flex: 1 1 240px;
        min-width: 0;
        max-width: 400px;
      }
      .temperature-input wiser-variable-slider {
        min-width: 0;
      }
      .section-header {
        color: var(--primary-text-color);
        text-transform: uppercase;
        font-weight: 500;
        font-size: calc(var(--material-small-font-size, 12px) + 1pt);
        padding: 5px 10px;
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
      }
      div.slot.selectable {
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
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 36px;
        transform: translateX(-50%);
        display: grid;
        place-items: center;
        z-index: 5;
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
    `}};e([pe({attribute:!1})],Rt.prototype,"hass",void 0),e([pe({attribute:!1})],Rt.prototype,"config",void 0),e([pe({attribute:!1})],Rt.prototype,"schedule",void 0),e([pe({attribute:!1})],Rt.prototype,"suntimes",void 0),e([pe({attribute:!1})],Rt.prototype,"editMode",void 0),e([ue()],Rt.prototype,"_activeSlot",void 0),e([ue()],Rt.prototype,"_activeDay",void 0),e([ue()],Rt.prototype,"_show_short_days",void 0),e([ue()],Rt.prototype,"rangeMin",void 0),e([ue()],Rt.prototype,"rangeMax",void 0),e([ue()],Rt.prototype,"stepSize",void 0),e([function(e){return(t,i)=>{const s="function"==typeof t?t:t[i];Object.assign(s,e)}}({passive:!0})],Rt.prototype,"_handleTouchStart",null),Rt=e([le("wiser-schedule-slot-editor")],Rt);let Ht=class extends ne{async showDialog(e){this._params=e,await this.updateComplete}async closeDialog(){this._params=void 0}render(){var e;return this._params?B`
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
    `:B``}static get styles(){return a`
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 16px;
      }
      div.wrapper {
        color: var(--primary-text-color);
      }
    `}};e([pe({attribute:!1})],Ht.prototype,"hass",void 0),e([ue()],Ht.prototype,"_params",void 0),Ht=e([le("wiser-dialog-error")],Ht);var Ut=Object.freeze({__proto__:null,get DialogError(){return Ht}});let jt=class extends(ct(ne)){constructor(){var e;super(...arguments),this.schedule_id=0,this.use_heat_colors=!0,this.embedded=!1,this.rooms=[],this.entities=[],this._activeSlot=null,this._activeDay=null,this.editMode=!1,this._current_user=null===(e=this.hass)||void 0===e?void 0:e.user,this._assigning_in_progress=0,this._save_in_progress=!1,this.stepSize=5}async initialise(){return await this._isComponentLoaded()&&(this.component_loaded=!0,await this.loadData()),!0}hassSubscribe(){return this.initialise(),[this.hass.connection.subscribeMessage(e=>this.handleUpdate(e),{type:"wiser_updated"})]}async handleUpdate(e){this.config.hub&&e.hub!=this.config.hub||"wiser_updated"!=e.event||await this.loadData()}async _isComponentLoaded(){return Boolean(this.hass&&this.config&&this.hass.config.components.includes("wiser"))}getSunTime(e,t){return t==Ae[0]?this.suntimes.Sunrises[Ee.indexOf(e)].time:this.suntimes.Sunsets[Ee.indexOf(e)].time}convertLoadedSchedule(e){const t=e.ScheduleData.map(e=>this.convertLoadedScheduleDay(e));return e.ScheduleData=t,e}convertLoadedScheduleDay(e){const t=e.slots.map(t=>Ae.includes(t.Time)?{Time:this.getSunTime(e.day,t.Time),Setpoint:t.Setpoint,SpecialTime:t.Time}:{Time:t.Time,Setpoint:t.Setpoint,SpecialTime:""}).sort((e,t)=>parseInt(e.Time.replace(":",""))<parseInt(t.Time.replace(":",""))?0:1),i=new Set(t.map(e=>JSON.stringify(e))),s=Array.from(i).map(e=>JSON.parse(e));return{day:e.day,slots:s}}convertScheduleForSaving(e){const t=e.ScheduleData.map(e=>this.convertScheduleDayForSaving(e));return e.ScheduleData=t,e}convertScheduleDayForSaving(e){const t=e.slots.map(e=>Ae.includes(e.SpecialTime)?{Time:e.SpecialTime,Setpoint:e.Setpoint,SpecialTime:e.SpecialTime}:{Time:e.Time,Setpoint:e.Setpoint,SpecialTime:""}).sort((e,t)=>e.Time.replace(":","")<t.Time.replace(":","")?0:1),i=new Set(t.map(e=>JSON.stringify(e))),s=Array.from(i).map(e=>JSON.parse(e));return{day:e.day,slots:s}}async loadData(){var e,t;this.error=void 0,this.schedule_type&&this.schedule_id&&!this.editMode&&(await(e=this.hass,t=this.config.hub,e.callWS({type:"wiser/suntimes",hub:t})).then(e=>{this.suntimes=e}).catch(e=>{this.error=e}),await Ue(this.hass,this.config.hub,this.schedule_type,this.schedule_id).then(e=>{this.schedule=this.convertLoadedSchedule(e)}).catch(e=>{this.schedule=void 0,this.error=e}),this.schedule&&await this.get_entity_list(this.hass,this.config.hub).then(e=>{this.entities=e}).catch(e=>{this.error=e})),await ht(this)}async get_entity_list(e,t){return"heating"==this.schedule.Type.toLowerCase()?await je(e,t):await Ve(e,t,this.schedule.SubType)}shouldUpdate(e){return!(!e.has("hass")&&!e.has("component_loaded"))||(e.has("schedule_id")||e.has("schedule_type")||e.has("config")||e.has("editMode")?(this.loadData(),!0):!!(e.has("schedule")||e.has("entities")||e.has("editMode")||e.has("_assigning_in_progress")||e.has("_save_in_progress")||e.has("error")&&tt(this.error)))}updated(e){super.updated(e),this.embedded&&this.dispatchEvent(new CustomEvent("editor-state",{detail:{editing:this.editMode,saving:this._save_in_progress,ready:Boolean(this.schedule&&this.schedule.Id===this.schedule_id&&this.suntimes&&!this.error)}}))}render(){return this.hass&&this.config&&this.component_loaded?tt(this.error)?B` <div role="alert">${this.error.message}</div> `:this.schedule&&this.entities&&this.suntimes?B`
        <div>
          ${this.embedded?"":B`<div class="schedule-info">
                    <span class="sub-heading">${Ie("wiser.headings.schedule_type")}: </span>
                    ${this.schedule.SubType}
                  </div>
                  <div class="schedule-info">
                    <span class="sub-heading">${Ie("wiser.headings.schedule_id")}: </span> ${this.schedule.Id}
                  </div>
                  <div class="schedule-info">
                    <span class="sub-heading">${Ie("wiser.headings.schedule_name")}: </span> ${this.schedule.Name}
                  </div> `}
          ${this.embedded?"":B`<div class=${this.editMode?"mode":""}>${this.editMode?"Edit Mode":null}</div>`}
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
                  @scheduleChanged=${this.scheduleChanged}
                ></wiser-schedule-slot-editor>
              </div>
            </div>
          </div>
          ${this.embedded?"":this.renderScheduleAssignment(this.entities,this.schedule.Assignments)}
          ${this.embedded?"":this.renderScheduleActionButtonSection()}
        </div>
        ${this.embedded?"":this.renderCardActions()}
      `:B``:B``}renderScheduleAssignment(e,t){if(this.schedule&&!this.editMode)return rt(this.hass,this.config)?B`
          <div class="assignment-wrapper">
            <div class="sub-heading">${Ie("wiser.headings.schedule_assignment")}</div>
            ${e.length>0?e.map(e=>this.renderEntityButton(e,t.map(function(e){return e.name}).includes(e.Name))):B`<div class="schedule-info">(No Assignable Devices)</div>`}
          </div>
        `:B`
          <div class="assignment-wrapper">
            <div class="sub-heading">${Ie("wiser.headings.schedule_assignment")}</div>
            ${t.length>0?e.filter(e=>t.map(function(e){return e.name}).includes(e.Name)).map(e=>this.renderEntityLabel(e)):B`<span class="assignment-label">${Ie("wiser.headings.not_assigned")}</span>`}
          </div>
        `}renderEntityButton(e,t){return B`
      <button
        type="button"
        id=${e.Id}
        class=${t?"active":""}
        appearance=${t?"accent":"plain"}
        size="small"
        @click=${this.entityAssignmentClick}
      >
        ${this._assigning_in_progress==e.Id?B`<span class="waiting"><progress aria-label="Working"></progress></span>`:null}
        ${e.Name}
      </button>
    `}renderScheduleActionButtonSection(){if(this.schedule&&!this.editMode&&rt(this.hass,this.config))return B`
          <div class="actions-wrapper">
            <div class="sub-heading">${Ie("wiser.headings.schedule_actions")}</div>
            <div class="wrapper schedule-action-wrapper">
              ${this.renderScheduleRenameButton()} ${this.renderEditScheduleButton()} ${this.renderCopyScheduleButton()}
              ${this.renderDeleteScheduleButton()}
            </div>
          </div>
        `}renderEntityLabel(e){return B` <span class="assignment-label"> ${e.Name} </span> `}renderCardActions(){if(!this.config.selected_schedule||this.editMode)return B`
        <div class="card-actions">
          <div class="action-buttons">
            ${this.editMode?null:this.renderBackButton()} ${this.editMode?this.renderCancelButton():null}
            ${this.editMode?this.renderSaveScheduleButton():null}
          </div>
        </div>
      `}renderBackButton(){return B`
      <button type="button" appearance="plain" @click=${this.backClick}>
        ${this.hass.localize("ui.common.back")}
      </button>
    `}renderCancelButton(){return B`
      <button type="button" appearance="plain" @click=${this.cancelClick}>
        ${this.hass.localize("ui.common.cancel")}
      </button>
    `}renderScheduleRenameButton(){return B`
      <button type="button" class="schedule-action-button" @click=${this.renameScheduleClick}>
        ${Ie("wiser.actions.rename")}
      </button>
    `}renderDeleteScheduleButton(){return B`
      <button
        type="button"
        class="schedule-action-button"
        variant="danger"
        .disabled=${1e3==this.schedule_id}
        @click=${this.deleteClick}
      >
        ${this.hass.localize("ui.common.delete")}
      </button>
    `}renderCopyScheduleButton(){return B`
      <button
        type="button"
        class="schedule-action-button"
        .disabled=${1e3==this.schedule_id}
        @click=${this.copyClick}
      >
        ${Ie("wiser.actions.copy")}
      </button>
    `}renderEditScheduleButton(){return B`
      <button type="button" class="schedule-action-button" @click=${this.editClick}>
        ${this.hass.localize("ui.common.edit")}
      </button>
    `}renderFilesScheduleButton(){return B`
      <button type="button" class="schedule-action-button" @click=${this.filesClick}>
        ${Ie("wiser.actions.files")}
      </button>
    `}renderSaveScheduleButton(){if(rt(this.hass,this.config))return B`
        <button type="button" appearance="plain" style="float: right" @click=${this.saveClick}>
          ${this._save_in_progress?B`<progress aria-label="Working"></progress>`:this.hass.localize("ui.common.save")}
        </button>
      `}async entityAssignmentClick(e){const t=e.target;this._assigning_in_progress=parseInt(t.id),rt(this.hass,this.config)&&await Be(this.hass,this.config.hub,this.schedule_type,this.schedule_id,t.id,t.classList.contains("active")),this._assigning_in_progress=0}backClick(){const e=new CustomEvent("backClick");this.dispatchEvent(e)}editClick(){this.schedule&&this.schedule.Id===this.schedule_id&&rt(this.hass,this.config)&&(this._tempSchedule=JSON.parse(JSON.stringify(this.schedule)),this.editMode=!this.editMode)}copyClick(){const e=new CustomEvent("copyClick");this.dispatchEvent(e)}exportSchedule(){if(!this.schedule)return;const e=this.convertScheduleForSaving(JSON.parse(JSON.stringify(this.schedule))),t={format:"wiser-schedule",version:1,schedule:{Name:e.Name,Type:e.Type,SubType:e.SubType,ScheduleData:e.ScheduleData}},i=URL.createObjectURL(new Blob([JSON.stringify(t,null,2)],{type:"application/json"})),s=document.createElement("a");s.href=i,s.download=`${e.Name.replace(/[^a-z0-9_-]/gi,"_")||"schedule"}.json`,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}async importSchedule(e){if(this.schedule&&!this.editMode&&rt(this.hass,this.config))try{if(e.size>1048576)throw new Error("Schedule file is too large.");const t=function(e,t){var i;const s=JSON.parse(e);if("wiser-schedule"!==s.format||1!==s.version)throw new Error("Unsupported schedule file.");const o=s.schedule,r=(t.SubType||t.Type).toLowerCase();if(!o||(null===(i=o.SubType||o.Type)||void 0===i?void 0:i.toLowerCase())!==r)throw new Error("This file is for a different schedule type.");if(!Array.isArray(o.ScheduleData)||7!==o.ScheduleData.length)throw new Error("The file must contain all seven days.");const a=new Set;let n=0;const d=o.ScheduleData.map(e=>{if(!Ee.includes(e.day)||a.has(e.day)||!Array.isArray(e.slots)||e.slots.length>24)throw new Error("Invalid schedule days or slots.");a.add(e.day);const t=new Set;return{day:e.day,slots:e.slots.map(e=>{const i=Ae.includes(e.Time);if(!i&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.Time)||i&&!["lighting","shutters"].includes(r)||t.has(e.Time))throw new Error("Invalid or duplicate slot time.");t.add(e.Time);const s=String(e.Setpoint),o=Number(s);if(!("heating"===r?Number.isFinite(o)&&(-20===o||o>=5&&o<=30):["lighting","shutters"].includes(r)?Number.isFinite(o)&&o>=0&&o<=100:["On","Off"].includes(s)))throw new Error("Invalid schedule setting.");return n++,{Time:e.Time,Setpoint:s,SpecialTime:i?e.Time:""}})}});if(!n)throw new Error("The schedule has no time slots.");return Object.assign(Object.assign({},t),{ScheduleData:d})}(await e.text(),this.schedule);this._tempSchedule=this.convertLoadedSchedule(t),this.editMode=!0}catch(e){We(this,"Import schedule",e.message)}}filesClick(){const e=new CustomEvent("filesClick");this.dispatchEvent(e)}async renameScheduleClick(){const e=new CustomEvent("renameClick");this.dispatchEvent(e)}async deleteClick(e){if(!rt(this.hass,this.config))return;const t=(null==e?void 0:e.target)||this;if(await new Promise(e=>{ve(t,"show-dialog",{dialogTag:"wiser-dialog-delete-confirm",dialogImport:()=>Promise.resolve().then(function(){return vt}),dialogParams:{cancel:()=>{e(!1)},confirm:()=>{e(!0)},name:this.schedule.Name}})})){this.schedule_id=0,await(i=this.hass,s=this.config.hub,o=this.schedule.Type,r=this.schedule.Id,i.callWS({type:"wiser/schedule/delete",hub:s,schedule_type:o,schedule_id:r}));const e=new CustomEvent("scheduleDeleted");this.dispatchEvent(e)}var i,s,o,r}cancelClick(){this.editMode=!1}validateSchedule(e){return e.ScheduleData.map(e=>e.slots).map(e=>e.length>0).includes(!0)}async saveClick(){if(!this._save_in_progress&&this._tempSchedule&&rt(this.hass,this.config)){this._save_in_progress=!0;try{if(this.validateSchedule(this._tempSchedule)){const e=JSON.parse(JSON.stringify(this._tempSchedule)),t=$e.includes(this.schedule_type)?this.convertScheduleForSaving(e):e;await((e,t,i,s,o)=>e.callWS({type:"wiser/schedule/save",hub:t,schedule_type:i,schedule_id:s,schedule:o}))(this.hass,this.config.hub,this.schedule_type,this.schedule_id,t),this.editMode=!1}else We(this,"Error Saving Schedule","The schedule you are trying to save has no time slots.")}catch(e){We(this,"Error Saving Schedule",(null==e?void 0:e.message)||Ie("common.load_failed"))}finally{this._save_in_progress=!1}}}scheduleChanged(e){this._tempSchedule=e.detail.schedule,this.render()}static get styles(){return a`
      ${mt}
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
    `}};e([pe({attribute:!1})],jt.prototype,"config",void 0),e([pe({attribute:!1})],jt.prototype,"schedule_id",void 0),e([pe({attribute:!1})],jt.prototype,"schedule_type",void 0),e([pe({attribute:!1})],jt.prototype,"use_heat_colors",void 0),e([pe({attribute:!1})],jt.prototype,"embedded",void 0),e([ue()],jt.prototype,"schedule",void 0),e([ue()],jt.prototype,"rooms",void 0),e([ue()],jt.prototype,"entities",void 0),e([ue()],jt.prototype,"suntimes",void 0),e([ue()],jt.prototype,"component_loaded",void 0),e([ue()],jt.prototype,"_activeSlot",void 0),e([ue()],jt.prototype,"_activeDay",void 0),e([ue()],jt.prototype,"editMode",void 0),e([ue()],jt.prototype,"_current_user",void 0),e([ue()],jt.prototype,"_assigning_in_progress",void 0),e([ue()],jt.prototype,"_save_in_progress",void 0),e([ue()],jt.prototype,"error",void 0),jt=e([le("wiser-schedule-edit-card")],jt);let Vt=class extends ne{constructor(){super(...arguments),this.component_loaded=!1,this._saving=!1,this._schedule_types=[],this._schedule_info={Name:"",Type:""},this._loadError=""}firstUpdated(){this.loadData().then(()=>{this.component_loaded=!0}).catch(e=>{this._loadError=(null==e?void 0:e.message)||Ie("common.load_failed")}).then(()=>ht(this))}async loadData(){const e=await(t=this.hass,i=this.config.hub,t.callWS({type:"wiser/schedules/types",hub:i}));var t,i;if(this._schedule_types=e.filter(e=>!this.allowed_types||this.allowed_types.some(t=>t.toLowerCase()===e.toLowerCase())),this._schedule_info={Name:"",Type:this._schedule_types[0]||""},!this._schedule_types.length)throw new Error(Ie("wiser.helpers.no_supported_types"))}render(){var e,t,i;return this.hass&&this.config?this._loadError?B`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize("ui.common.back")}</button>`:this.component_loaded?B`
      <div>
        <div>${Ie("wiser.actions.add_schedule")}</div>
        <div class="wrapper" style="white-space: normal">
          ${Ie(1===this._schedule_types.length?"wiser.helpers.add_schedule_name":"wiser.helpers.add_schedule")}
        </div>
        ${this._schedule_types.length>1?B`<div class="wrapper">${this._schedule_types.map((e,t)=>this.renderScheduleTypeButtons(e,t))}</div>`:""}
        <label class="schedule-name">
          <span>${Ie("wiser.headings.schedule_name")}</span>
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
      <div class="card-actions">
        <button
          type="button"
          appearance="plain"
          style="float: right"
          .disabled=${this._saving||!(null===(t=this._schedule_info)||void 0===t?void 0:t.Name.trim())||!(null===(i=this._schedule_info)||void 0===i?void 0:i.Type)}
          @click=${this.confirmClick}
          dialogAction="close"
        >
          ${this.hass.localize("ui.common.save")}
        </button>
        <button type="button" appearance="plain" @click=${this.cancelClick}>
          ${this.hass.localize("ui.common.cancel")}
        </button>
      </div>
    `:B`<div role="status">${Ie("common.loading")}</div>`:B``}renderScheduleTypeButtons(e,t){return B`
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
    `}async confirmClick(){await this.createSchedule()}async createSchedule(){const e=this._schedule_info;if(this.hass&&this.config&&rt(this.hass,this.config)&&!this._saving&&(null==e?void 0:e.Name.trim())&&this._schedule_types.includes(e.Type)){this._saving=!0;try{const r=await He(this.hass,this.config.hub,e.Type);await(t=this.hass,i=this.config.hub,s=e.Type,o=e.Name.trim(),t.callWS({type:"wiser/schedule/create",hub:i,schedule_type:s,name:o}));const a=(await He(this.hass,this.config.hub,e.Type)).find(t=>t.Name===e.Name.trim()&&!r.some(e=>e.Id===t.Id&&e.Type===t.Type));a&&void 0!==this.assign_to&&await Be(this.hass,this.config.hub,a.Type,a.Id,String(this.assign_to)),this.dispatchEvent(new CustomEvent("scheduleAdded",{detail:a}))}catch(e){this._loadError=(null==e?void 0:e.message)||Ie("common.load_failed")}finally{this._saving=!1}var t,i,s,o}}cancelClick(){const e=new CustomEvent("backClick");this.dispatchEvent(e)}_valueChanged(e){const t=e.currentTarget;t.configValue&&(this._schedule_info=Object.assign(Object.assign({},this._schedule_info),{[t.configValue]:void 0!==t.checked?t.checked:t.value}))}static get styles(){return a`
      ${mt}
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
    `}};e([pe({attribute:!1})],Vt.prototype,"hass",void 0),e([pe({attribute:!1})],Vt.prototype,"config",void 0),e([pe({attribute:!1})],Vt.prototype,"component_loaded",void 0),e([pe({attribute:!1})],Vt.prototype,"allowed_types",void 0),e([pe({attribute:!1})],Vt.prototype,"assign_to",void 0),e([ue()],Vt.prototype,"_saving",void 0),e([ue()],Vt.prototype,"_schedule_types",void 0),e([ue()],Vt.prototype,"_schedule_info",void 0),e([ue()],Vt.prototype,"_loadError",void 0),Vt=e([le("wiser-schedule-add-card")],Vt);let Bt=class extends ne{constructor(){super(...arguments),this.schedule_id=0,this.component_loaded=!1,this._copy_in_progress=0,this._schedule_list=[],this._loadError=""}firstUpdated(){this.loadData().then(()=>{this.component_loaded=!0}).catch(e=>{this._loadError=(null==e?void 0:e.message)||Ie("common.load_failed")}).then(()=>ht(this))}async loadData(){this.schedule=await Ue(this.hass,this.config.hub,this.schedule_type,this.schedule_id),this._schedule_list=await He(this.hass,this.config.hub,this.schedule_type)}render(){return this.hass&&this.config?this._loadError?B`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize("ui.common.back")}</button>`:this.component_loaded&&this.schedule?B`
      <div>
        <div>${Ie("wiser.headings.copy_schedule")}</div>
        <div class="schedule-info">
          <span class="sub-heading">${Ie("wiser.headings.schedule_type")}:</span> ${this.schedule.Type}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${Ie("wiser.headings.schedule_id")}:</span> ${this.schedule.Id}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${Ie("wiser.headings.schedule_name")}:</span> ${this.schedule.Name}
        </div>
        <div class="wrapper" style="margin: 20px 0 0 0;">${Ie("wiser.helpers.select_copy_schedule")}</div>
        <div class="assignment-wrapper">
          ${this._schedule_list.filter(e=>{var t;return e.Id!=(null===(t=this.schedule)||void 0===t?void 0:t.Id)}).map(e=>this.renderScheduleButtons(e))}
        </div>
      </div>
      <div class="card-actions">
        <button type="button" appearance="plain" @click=${this.cancelClick}>
          ${this.hass.localize("ui.common.cancel")}
        </button>
      </div>
    `:B`<div role="status">${Ie("common.loading")}</div>`:B``}renderScheduleButtons(e){return B`
      <button
        type="button"
        class="schedule-button"
        id=${e.Id}
        size="small"
        @click=${this._copySchedule}
        .value=${e.Name}
      >
        ${this._copy_in_progress==e.Id?B`<span class="waiting"><progress aria-label="Working"></progress></span>`:null}
        ${e.Name}
      </button>
    `}cancelClick(){const e=new CustomEvent("backClick",{detail:be.ScheduleEdit});this.dispatchEvent(e)}async _copySchedule(e){const t=e.currentTarget;if(t.id){this._copy_in_progress=parseInt(t.id),await(i=this.hass,s=this.config.hub,o=this.schedule_type,r=this.schedule_id,a=parseInt(t.id),i.callWS({type:"wiser/schedule/copy",hub:s,schedule_type:o,schedule_id:r,to_schedule_id:a})),this._copy_in_progress=0;const e=new CustomEvent("scheduleCopied");this.dispatchEvent(e)}var i,s,o,r,a}static get styles(){return a`
      ${mt}
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
    `}};e([pe({attribute:!1})],Bt.prototype,"hass",void 0),e([pe({attribute:!1})],Bt.prototype,"config",void 0),e([pe({attribute:!1})],Bt.prototype,"schedule_id",void 0),e([pe({attribute:!1})],Bt.prototype,"schedule_type",void 0),e([ue()],Bt.prototype,"schedule",void 0),e([ue()],Bt.prototype,"component_loaded",void 0),e([ue()],Bt.prototype,"_copy_in_progress",void 0),e([ue()],Bt.prototype,"_schedule_list",void 0),e([ue()],Bt.prototype,"_loadError",void 0),Bt=e([le("wiser-schedule-copy-card")],Bt);let Wt=class extends ne{constructor(){super(...arguments),this.component_loaded=!1,this._newScheduleName="",this._rename_in_progress=!1,this._loadError=""}firstUpdated(){this.loadData().then(()=>{this.component_loaded=!0}).catch(e=>{this._loadError=(null==e?void 0:e.message)||Ie("common.load_failed")}).then(()=>ht(this))}async loadData(){this._schedule=await Ue(this.hass,this.config.hub,this.schedule_type,this.schedule_id),this._newScheduleName=this._schedule.Name}render(){var e;return this.hass&&this.config?this._loadError?B`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize("ui.common.back")}</button>`:this.component_loaded?B`
      <div>
        <div>${Ie("wiser.headings.rename_schedule")}</div>
        <div class="wrapper">${Ie("wiser.helpers.enter_new_name")}</div>
        <label class="schedule-name">
          <span>${Ie("wiser.headings.schedule_name")}</span>
          <input
            type="text"
            required
            .value=${this._newScheduleName}
            ?disabled=${this._rename_in_progress}
            @input=${e=>{this._newScheduleName=e.target.value}}
          />
        </label>
      </div>
      <div class="card-actions">
        <button
          type="button"
          appearance="plain"
          style="float: right"
          .disabled=${!this._newScheduleName.trim()||this._newScheduleName===(null===(e=this._schedule)||void 0===e?void 0:e.Name)||this._rename_in_progress}
          @click=${this.confirmClick}
        >
          ${this._rename_in_progress?B`<span class="waiting"><progress aria-label="Working"></progress></span>`:this.hass.localize("ui.common.save")}
        </button>
        <button type="button" appearance="plain" @click=${this.cancelClick}>
          ${this.hass.localize("ui.common.cancel")}
        </button>
      </div>
    `:B`<div role="status">${Ie("common.loading")}</div>`:B``}async confirmClick(){await this.renameSchedule()}async renameSchedule(){var e,t,i,s,o;this._rename_in_progress=!0,await(e=this.hass,t=this.config.hub,i=this.schedule_type,s=this.schedule_id,o=this._newScheduleName,e.callWS({type:"wiser/schedule/rename",hub:t,schedule_type:i,schedule_id:s,schedule_name:o}));const r=new CustomEvent("scheduleRenamed");this.dispatchEvent(r),this._rename_in_progress=!1}cancelClick(){const e=new CustomEvent("backClick",{detail:be.ScheduleEdit});this.dispatchEvent(e)}static get styles(){return a`
      ${mt}
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
      .card-actions {
        padding-top: 8px;
      }
      .schedule-type-select {
        margin: 20px 0 0 0;
      }
      .schedule-name {
        max-width: 420px;
        margin: 20px 0 0 0;
        width: 100%;
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
    `}};e([pe({attribute:!1})],Wt.prototype,"hass",void 0),e([pe({attribute:!1})],Wt.prototype,"config",void 0),e([pe({attribute:!1})],Wt.prototype,"component_loaded",void 0),e([pe({attribute:!1})],Wt.prototype,"schedule_type",void 0),e([pe({attribute:!1})],Wt.prototype,"schedule_id",void 0),e([ue()],Wt.prototype,"_newScheduleName",void 0),e([ue()],Wt.prototype,"_schedule",void 0),e([ue()],Wt.prototype,"_rename_in_progress",void 0),e([ue()],Wt.prototype,"_loadError",void 0),Wt=e([le("wiser-schedule-rename-card")],Wt);let qt=class extends ne{constructor(){super(...arguments),this._hubs=[],this._schedules=[],this._error="",this._requestId=0}setConfig(e){this._config=Object.assign({},e)}updated(e){var t;const i=e.get("_config");(e.has("hass")&&!e.get("hass")||e.has("_config")&&(!i||i.hub!==(null===(t=this._config)||void 0===t?void 0:t.hub)))&&this.loadData()}async loadData(){if(!this.hass||!this._config)return;const e=++this._requestId;this._error="",this._schedules=[];try{const t=await Re(this.hass),i=await He(this.hass,this._config.hub||t[0]);if(e!==this._requestId)return;this._hubs=t,this._schedules=i}catch(t){e===this._requestId&&(this._error=(null==t?void 0:t.message)||"Unable to load schedules.")}}change(e,t){if(!this._config)return;const i=Object.assign({},this._config);""===t?delete i[e]:i[e]=t,"hub"===e&&delete i.selected_schedule,this._config=i,ve(this,"config-changed",{config:i})}toggle(e,t,i=!1){var s;return B`<label class="toggle">
      <span>${t}</span>
      <input
        type="checkbox"
        .checked=${Boolean(null===(s=this._config)||void 0===s?void 0:s[e])}
        ?disabled=${i}
        @change=${t=>this.change(e,t.target.checked)}
      />
    </label>`}render(){var e;if(!this._config)return B``;const t=this._config,i="list"===t.view_type;return B`
      <div class="fields">
        <label
          >Title<input
            type="text"
            .value=${null!==(e=t.name)&&void 0!==e?e:""}
            placeholder="Wiser Schedule"
            @input=${e=>this.change("name",e.target.value)}
        /></label>
        ${this._hubs.length>1?B`<label
                >Wiser hub<select
                  .value=${t.hub||this._hubs[0]}
                  @change=${e=>this.change("hub",e.target.value)}
                >
                  ${this._hubs.map(e=>B`<option .value=${e} ?selected=${e===(t.hub||this._hubs[0])}>${e}</option>`)}
                </select></label
              >`:""}
        <label
          >Schedule<select
            @change=${e=>this.change("selected_schedule",e.target.value)}
          >
            <option value="" ?selected=${!t.selected_schedule}>All schedules</option>
            ${this._schedules.map(e=>B`<option .value=${e.Type+"|"+e.Id} ?selected=${t.selected_schedule===e.Type+"|"+e.Id}>${e.Name}</option>`)}
          </select></label
        >
        <label
          >Layout<select @change=${e=>this.change("view_type",e.target.value)}>
            <option value="default" ?selected=${!i}>Tiles</option>
            <option value="list" ?selected=${i}>List</option>
          </select></label
        >
      </div>
      ${this._error?B`<div role="alert">${this._error} <button @click=${()=>this.loadData()}>Try again</button></div>`:""}
      <fieldset>
        <legend>Permissions</legend>
        ${this.toggle("display_only","Display schedules only")}
        ${this.toggle("admin_only","Only admins can manage schedules",t.display_only)}
      </fieldset>
      <fieldset>
        <legend>Appearance</legend>
        ${this.toggle("theme_colors","Use theme colours")} ${this.toggle("hide_card_borders","Hide card borders")}
      </fieldset>
      <div class="version">Wiser Schedule Card · ${ye}</div>
    `}};qt.styles=a`
    :host {
      display: block;
      color: var(--primary-text-color);
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
    input[type='checkbox'] {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      accent-color: var(--primary-color);
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
    }
  `,e([pe({attribute:!1})],qt.prototype,"hass",void 0),e([ue()],qt.prototype,"_config",void 0),e([ue()],qt.prototype,"_hubs",void 0),e([ue()],qt.prototype,"_schedules",void 0),e([ue()],qt.prototype,"_error",void 0),qt=e([le("wiser-schedule-card-editor")],qt),console.info(`%c  WISER-SCHEDULE-CARD \n%c  ${Ie("common.version")} ${ye}    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"wiser-schedule-card",name:"Wiser Schedule Card",description:"A card to manage Wiser schedules",preview:!1});let Ft=class extends ne{constructor(){super(...arguments),this._view=be.Overview,this.component_loaded=!1,this._schedule_id=0,this._schedule_type="heating",this._target_type="heating",this._returnView=be.Overview}static async getConfigElement(){return document.createElement("wiser-schedule-card-editor")}static getStubConfig(){return{}}setConfig(e){if(!e)throw new Error(Ie("common.invalid_configuration"));e.test_gui&&function(){var e=document.querySelector("home-assistant");if(e=(e=(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-root")){var t=e.lovelace;return t.current_view=e.___curView,t}return null}().setEditMode(!0),this.config=Object.assign({name:"Wiser Schedule"},e)}set hass(e){this._hass=e}processConfigSchedule(){var e,t,i;(null===(e=this.config)||void 0===e?void 0:e.selected_schedule)?(this._schedule_type=null===(t=this.config)||void 0===t?void 0:t.selected_schedule.split("|")[0],this._schedule_id=parseInt(null===(i=this.config)||void 0===i?void 0:i.selected_schedule.split("|")[1]),this._view=be.ScheduleEdit):(this._schedule_type="",this._schedule_id=0,this._view=be.Overview)}getCardSize(){return 9}willUpdate(e){var t,i;if(e.has("config"))this.style.removeProperty("--wiser-view-min-height"),this.processConfigSchedule();else if(e.has("_view")){const e=this.renderRoot.querySelector(".card-content");e&&this.style.setProperty("--wiser-view-min-height",`${e.getBoundingClientRect().height}px`)}this.component_loaded=null!==(i=null===(t=this._hass)||void 0===t?void 0:t.config.components.includes("wiser"))&&void 0!==i&&i}_viewReady(e){const t=this.renderRoot.querySelector(".card-content");e.target===(null==t?void 0:t.firstElementChild)&&this.style.removeProperty("--wiser-view-min-height")}renderHeader(){var e;const t=null===(e=this.config)||void 0===e?void 0:e.name;if(!t)return B``;const i=this._view===be.Overview||this._view===be.RoomSchedule,s="Wiser Schedule"===t?i?"":Ie("wiser.rooms.schedules"):t;return B`<header class="card-header">
      <h2 class="brand-header">
        <span class="brand-name">Wiser</span>${s?B`<span class="brand-title">${s}</span>`:""}
      </h2>
    </header>`}render(){if(!this._hass||!this.config)return B``;if(!this.component_loaded)return B`<ha-card
        ><div class="status" role="status">${Ie("common.integration_unavailable")}</div></ha-card
      >`;const e=this.config.hide_card_borders?"border-width: 0px":"";return this._view===be.Overview||this._view===be.RoomSchedule?B` <ha-card style=${e}>
        ${this.renderHeader()}
        <div class="card-content" @wiser-view-ready=${this._viewReady}>
          <wiser-room-schedules
            .hass=${this._hass}
            .config=${this.config}
            .room_id=${this._view===be.RoomSchedule?this._room_id:void 0}
            .target_type=${this._target_type}
            .created_schedule=${this._created_schedule}
            @createdScheduleOpened=${()=>{this._created_schedule=void 0}}
            @roomClick=${e=>{this._room_id=e.detail.id,this._target_type=e.detail.kind,this._view=be.RoomSchedule}}
            @roomsBack=${()=>{this._view=be.Overview}}
            @scheduleAction=${e=>{this._schedule_id=e.detail.schedule_id,this._schedule_type=e.detail.schedule_type,this._returnView=be.RoomSchedule,this._view="rename"===e.detail.action?be.ScheduleRename:be.ScheduleCopy}}
            @addScheduleClick=${this._addScheduleClick}
          >
          </wiser-room-schedules>
        </div>
      </ha-card>`:this._view==be.ScheduleEdit&&this._schedule_id?B`
        <ha-card style=${e}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
            <wiser-schedule-edit-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @renameClick=${this._renameClick}
              @editClick=${this._editClick}
              @copyClick=${this._copyClick}
              @scheduleDeleted=${this._scheduleDeleted}
            ></wiser-schedule-edit-card>
          </div>
        </ha-card>
      `:this._view==be.ScheduleAdd?B`
        <ha-card style=${e}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
            <wiser-schedule-add-card
              .assign_to=${this._returnView===be.RoomSchedule?this._room_id:void 0}
              .allowed_types=${this._returnView===be.RoomSchedule?[this._target_type]:void 0}
              .hass=${this._hass}
              .config=${this.config}
              @backClick=${this._backClick}
              @scheduleAdded=${this._scheduleAdded}
            ></wiser-schedule-add-card>
          </div>
        </ha-card>
      `:this._view==be.ScheduleCopy?B`
        <ha-card style=${e}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
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
      `:this._view==be.ScheduleRename?B`
        <ha-card style=${e}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
            <wiser-schedule-rename-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @scheduleRenamed=${this._scheduleRenamed}
            ></wiser-schedule-rename-card>
          </div>
        </ha-card>
      `:B``}_addScheduleClick(){this._returnView=this._view,this._view=be.ScheduleAdd}_renameClick(){this._view=be.ScheduleRename}_editClick(){this._view=be.ScheduleEdit}_copyClick(){this._view=be.ScheduleCopy}_backClick(e){e.detail?this._view=e.detail===be.ScheduleEdit&&this._returnView===be.RoomSchedule?be.RoomSchedule:e.detail:this._view=this._returnView}_scheduleDeleted(){this._view=this._returnView}_scheduleAdded(e){this._created_schedule=e.detail,this._view=this._returnView}_scheduleCopied(){this._view=this._returnView===be.RoomSchedule?be.RoomSchedule:be.ScheduleEdit}_scheduleRenamed(){this._view=this._returnView===be.RoomSchedule?be.RoomSchedule:be.ScheduleEdit}};Ft.styles=a`
    :host {
      font-size: calc(14px + 1pt);
      --mdc-typography-body1-font-size: calc(16px + 1pt);
      --mdc-typography-subtitle1-font-size: calc(16px + 1pt);
      --ha-font-size-m: calc(14px + 1pt);
      display: block;
      color: var(--primary-text-color);
    }
    ha-card {
      overflow: hidden;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      padding: 22px 20px 20px;
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 0;
      min-width: 0;
      line-height: 1.2;
    }
    .brand-name {
      flex-shrink: 0;
      color: var(--wiser-brand-color, #279f43);
      font-family: 'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif;
      font-size: calc(32px + 1pt);
      font-weight: 700;
      letter-spacing: -1.5px;
    }
    .brand-title {
      min-width: 0;
      padding-inline-start: 14px;
      border-inline-start: 1px solid var(--divider-color, #ddd);
      color: var(--primary-text-color);
      font-size: calc(15px + 1pt);
      font-weight: 500;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    .card-content {
      box-sizing: border-box;
      min-height: var(--wiser-view-min-height, 0px);
      padding: 0 20px 20px;
    }
    .status {
      padding: 20px;
      color: var(--secondary-text-color);
    }
    @media (max-width: 400px) {
      .card-header {
        padding: 18px 12px;
      }
      .brand-header {
        gap: 12px;
      }
      .brand-title {
        padding-inline-start: 12px;
      }
      .card-content {
        padding: 0 12px 12px;
      }
    }
  `,e([pe({attribute:!1})],Ft.prototype,"_hass",void 0),e([ue()],Ft.prototype,"config",void 0),e([ue()],Ft.prototype,"_view",void 0),e([ue()],Ft.prototype,"component_loaded",void 0),e([ue()],Ft.prototype,"_schedule_id",void 0),e([ue()],Ft.prototype,"_schedule_type",void 0),e([ue()],Ft.prototype,"_room_id",void 0),e([ue()],Ft.prototype,"_target_type",void 0),e([ue()],Ft.prototype,"_created_schedule",void 0),Ft=e([le("wiser-schedule-card")],Ft);export{Ft as WiserScheduleCard};
