function kx(t,e){for(var n=0;n<e.length;n++){const i=e[n];if(typeof i!="string"&&!Array.isArray(i)){for(const r in i)if(r!=="default"&&!(r in t)){const s=Object.getOwnPropertyDescriptor(i,r);s&&Object.defineProperty(t,r,s.get?s:{enumerable:!0,get:()=>i[r]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function zx(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Eg={exports:{}},ql={},wg={exports:{}},qe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ea=Symbol.for("react.element"),Bx=Symbol.for("react.portal"),jx=Symbol.for("react.fragment"),Vx=Symbol.for("react.strict_mode"),Hx=Symbol.for("react.profiler"),Gx=Symbol.for("react.provider"),Wx=Symbol.for("react.context"),Xx=Symbol.for("react.forward_ref"),$x=Symbol.for("react.suspense"),Yx=Symbol.for("react.memo"),qx=Symbol.for("react.lazy"),ph=Symbol.iterator;function Kx(t){return t===null||typeof t!="object"?null:(t=ph&&t[ph]||t["@@iterator"],typeof t=="function"?t:null)}var Tg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Cg=Object.assign,Ag={};function qs(t,e,n){this.props=t,this.context=e,this.refs=Ag,this.updater=n||Tg}qs.prototype.isReactComponent={};qs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};qs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function bg(){}bg.prototype=qs.prototype;function qd(t,e,n){this.props=t,this.context=e,this.refs=Ag,this.updater=n||Tg}var Kd=qd.prototype=new bg;Kd.constructor=qd;Cg(Kd,qs.prototype);Kd.isPureReactComponent=!0;var mh=Array.isArray,Rg=Object.prototype.hasOwnProperty,Zd={current:null},Pg={key:!0,ref:!0,__self:!0,__source:!0};function Lg(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Rg.call(e,i)&&!Pg.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:ea,type:t,key:s,ref:o,props:r,_owner:Zd.current}}function Zx(t,e){return{$$typeof:ea,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Jd(t){return typeof t=="object"&&t!==null&&t.$$typeof===ea}function Jx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var gh=/\/+/g;function wc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Jx(""+t.key):e.toString(36)}function tl(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case ea:case Bx:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+wc(o,0):i,mh(r)?(n="",t!=null&&(n=t.replace(gh,"$&/")+"/"),tl(r,e,n,"",function(c){return c})):r!=null&&(Jd(r)&&(r=Zx(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(gh,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",mh(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+wc(s,a);o+=tl(s,e,n,l,r)}else if(l=Kx(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+wc(s,a++),o+=tl(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function ha(t,e,n){if(t==null)return t;var i=[],r=0;return tl(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Qx(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var en={current:null},nl={transition:null},e_={ReactCurrentDispatcher:en,ReactCurrentBatchConfig:nl,ReactCurrentOwner:Zd};function Ng(){throw Error("act(...) is not supported in production builds of React.")}qe.Children={map:ha,forEach:function(t,e,n){ha(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return ha(t,function(){e++}),e},toArray:function(t){return ha(t,function(e){return e})||[]},only:function(t){if(!Jd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};qe.Component=qs;qe.Fragment=jx;qe.Profiler=Hx;qe.PureComponent=qd;qe.StrictMode=Vx;qe.Suspense=$x;qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=e_;qe.act=Ng;qe.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=Cg({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Zd.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)Rg.call(e,l)&&!Pg.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:ea,type:t.type,key:r,ref:s,props:i,_owner:o}};qe.createContext=function(t){return t={$$typeof:Wx,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Gx,_context:t},t.Consumer=t};qe.createElement=Lg;qe.createFactory=function(t){var e=Lg.bind(null,t);return e.type=t,e};qe.createRef=function(){return{current:null}};qe.forwardRef=function(t){return{$$typeof:Xx,render:t}};qe.isValidElement=Jd;qe.lazy=function(t){return{$$typeof:qx,_payload:{_status:-1,_result:t},_init:Qx}};qe.memo=function(t,e){return{$$typeof:Yx,type:t,compare:e===void 0?null:e}};qe.startTransition=function(t){var e=nl.transition;nl.transition={};try{t()}finally{nl.transition=e}};qe.unstable_act=Ng;qe.useCallback=function(t,e){return en.current.useCallback(t,e)};qe.useContext=function(t){return en.current.useContext(t)};qe.useDebugValue=function(){};qe.useDeferredValue=function(t){return en.current.useDeferredValue(t)};qe.useEffect=function(t,e){return en.current.useEffect(t,e)};qe.useId=function(){return en.current.useId()};qe.useImperativeHandle=function(t,e,n){return en.current.useImperativeHandle(t,e,n)};qe.useInsertionEffect=function(t,e){return en.current.useInsertionEffect(t,e)};qe.useLayoutEffect=function(t,e){return en.current.useLayoutEffect(t,e)};qe.useMemo=function(t,e){return en.current.useMemo(t,e)};qe.useReducer=function(t,e,n){return en.current.useReducer(t,e,n)};qe.useRef=function(t){return en.current.useRef(t)};qe.useState=function(t){return en.current.useState(t)};qe.useSyncExternalStore=function(t,e,n){return en.current.useSyncExternalStore(t,e,n)};qe.useTransition=function(){return en.current.useTransition()};qe.version="18.3.1";wg.exports=qe;var Q=wg.exports;const Dg=zx(Q),t_=kx({__proto__:null,default:Dg},[Q]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n_=Q,i_=Symbol.for("react.element"),r_=Symbol.for("react.fragment"),s_=Object.prototype.hasOwnProperty,o_=n_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a_={key:!0,ref:!0,__self:!0,__source:!0};function Ig(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)s_.call(e,i)&&!a_.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:i_,type:t,key:s,ref:o,props:r,_owner:o_.current}}ql.Fragment=r_;ql.jsx=Ig;ql.jsxs=Ig;Eg.exports=ql;var f=Eg.exports,zu={},Ug={exports:{}},Mn={},Og={exports:{}},Fg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(U,z){var W=U.length;U.push(z);e:for(;0<W;){var re=W-1>>>1,ue=U[re];if(0<r(ue,z))U[re]=z,U[W]=ue,W=re;else break e}}function n(U){return U.length===0?null:U[0]}function i(U){if(U.length===0)return null;var z=U[0],W=U.pop();if(W!==z){U[0]=W;e:for(var re=0,ue=U.length,Ne=ue>>>1;re<Ne;){var G=2*(re+1)-1,se=U[G],me=G+1,Re=U[me];if(0>r(se,W))me<ue&&0>r(Re,se)?(U[re]=Re,U[me]=W,re=me):(U[re]=se,U[G]=W,re=G);else if(me<ue&&0>r(Re,W))U[re]=Re,U[me]=W,re=me;else break e}}return z}function r(U,z){var W=U.sortIndex-z.sortIndex;return W!==0?W:U.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],c=[],h=1,d=null,p=3,g=!1,x=!1,y=!1,m=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v(U){for(var z=n(c);z!==null;){if(z.callback===null)i(c);else if(z.startTime<=U)i(c),z.sortIndex=z.expirationTime,e(l,z);else break;z=n(c)}}function S(U){if(y=!1,v(U),!x)if(n(l)!==null)x=!0,j(b);else{var z=n(c);z!==null&&ee(S,z.startTime-U)}}function b(U,z){x=!1,y&&(y=!1,u(N),N=-1),g=!0;var W=p;try{for(v(z),d=n(l);d!==null&&(!(d.expirationTime>z)||U&&!R());){var re=d.callback;if(typeof re=="function"){d.callback=null,p=d.priorityLevel;var ue=re(d.expirationTime<=z);z=t.unstable_now(),typeof ue=="function"?d.callback=ue:d===n(l)&&i(l),v(z)}else i(l);d=n(l)}if(d!==null)var Ne=!0;else{var G=n(c);G!==null&&ee(S,G.startTime-z),Ne=!1}return Ne}finally{d=null,p=W,g=!1}}var A=!1,w=null,N=-1,q=5,M=-1;function R(){return!(t.unstable_now()-M<q)}function k(){if(w!==null){var U=t.unstable_now();M=U;var z=!0;try{z=w(!0,U)}finally{z?J():(A=!1,w=null)}}else A=!1}var J;if(typeof _=="function")J=function(){_(k)};else if(typeof MessageChannel<"u"){var L=new MessageChannel,$=L.port2;L.port1.onmessage=k,J=function(){$.postMessage(null)}}else J=function(){m(k,0)};function j(U){w=U,A||(A=!0,J())}function ee(U,z){N=m(function(){U(t.unstable_now())},z)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(U){U.callback=null},t.unstable_continueExecution=function(){x||g||(x=!0,j(b))},t.unstable_forceFrameRate=function(U){0>U||125<U?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):q=0<U?Math.floor(1e3/U):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(U){switch(p){case 1:case 2:case 3:var z=3;break;default:z=p}var W=p;p=z;try{return U()}finally{p=W}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(U,z){switch(U){case 1:case 2:case 3:case 4:case 5:break;default:U=3}var W=p;p=U;try{return z()}finally{p=W}},t.unstable_scheduleCallback=function(U,z,W){var re=t.unstable_now();switch(typeof W=="object"&&W!==null?(W=W.delay,W=typeof W=="number"&&0<W?re+W:re):W=re,U){case 1:var ue=-1;break;case 2:ue=250;break;case 5:ue=1073741823;break;case 4:ue=1e4;break;default:ue=5e3}return ue=W+ue,U={id:h++,callback:z,priorityLevel:U,startTime:W,expirationTime:ue,sortIndex:-1},W>re?(U.sortIndex=W,e(c,U),n(l)===null&&U===n(c)&&(y?(u(N),N=-1):y=!0,ee(S,W-re))):(U.sortIndex=ue,e(l,U),x||g||(x=!0,j(b))),U},t.unstable_shouldYield=R,t.unstable_wrapCallback=function(U){var z=p;return function(){var W=p;p=z;try{return U.apply(this,arguments)}finally{p=W}}}})(Fg);Og.exports=Fg;var l_=Og.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var c_=Q,Sn=l_;function ce(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var kg=new Set,Io={};function Hr(t,e){Us(t,e),Us(t+"Capture",e)}function Us(t,e){for(Io[t]=e,t=0;t<e.length;t++)kg.add(e[t])}var yi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Bu=Object.prototype.hasOwnProperty,u_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,vh={},xh={};function d_(t){return Bu.call(xh,t)?!0:Bu.call(vh,t)?!1:u_.test(t)?xh[t]=!0:(vh[t]=!0,!1)}function f_(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function h_(t,e,n,i){if(e===null||typeof e>"u"||f_(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function tn(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Bt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Bt[t]=new tn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Bt[e]=new tn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Bt[t]=new tn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Bt[t]=new tn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Bt[t]=new tn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Bt[t]=new tn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Bt[t]=new tn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Bt[t]=new tn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Bt[t]=new tn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Qd=/[\-:]([a-z])/g;function ef(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Qd,ef);Bt[e]=new tn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Qd,ef);Bt[e]=new tn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Qd,ef);Bt[e]=new tn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Bt[t]=new tn(t,1,!1,t.toLowerCase(),null,!1,!1)});Bt.xlinkHref=new tn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Bt[t]=new tn(t,1,!1,t.toLowerCase(),null,!0,!0)});function tf(t,e,n,i){var r=Bt.hasOwnProperty(e)?Bt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(h_(e,n,r,i)&&(n=null),i||r===null?d_(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var wi=c_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,pa=Symbol.for("react.element"),fs=Symbol.for("react.portal"),hs=Symbol.for("react.fragment"),nf=Symbol.for("react.strict_mode"),ju=Symbol.for("react.profiler"),zg=Symbol.for("react.provider"),Bg=Symbol.for("react.context"),rf=Symbol.for("react.forward_ref"),Vu=Symbol.for("react.suspense"),Hu=Symbol.for("react.suspense_list"),sf=Symbol.for("react.memo"),Ii=Symbol.for("react.lazy"),jg=Symbol.for("react.offscreen"),_h=Symbol.iterator;function to(t){return t===null||typeof t!="object"?null:(t=_h&&t[_h]||t["@@iterator"],typeof t=="function"?t:null)}var xt=Object.assign,Tc;function _o(t){if(Tc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Tc=e&&e[1]||""}return`
`+Tc+t}var Cc=!1;function Ac(t,e){if(!t||Cc)return"";Cc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{Cc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?_o(t):""}function p_(t){switch(t.tag){case 5:return _o(t.type);case 16:return _o("Lazy");case 13:return _o("Suspense");case 19:return _o("SuspenseList");case 0:case 2:case 15:return t=Ac(t.type,!1),t;case 11:return t=Ac(t.type.render,!1),t;case 1:return t=Ac(t.type,!0),t;default:return""}}function Gu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case hs:return"Fragment";case fs:return"Portal";case ju:return"Profiler";case nf:return"StrictMode";case Vu:return"Suspense";case Hu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Bg:return(t.displayName||"Context")+".Consumer";case zg:return(t._context.displayName||"Context")+".Provider";case rf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case sf:return e=t.displayName||null,e!==null?e:Gu(t.type)||"Memo";case Ii:e=t._payload,t=t._init;try{return Gu(t(e))}catch{}}return null}function m_(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Gu(e);case 8:return e===nf?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function ir(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Vg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function g_(t){var e=Vg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function ma(t){t._valueTracker||(t._valueTracker=g_(t))}function Hg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Vg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function ml(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Wu(t,e){var n=e.checked;return xt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function yh(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=ir(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Gg(t,e){e=e.checked,e!=null&&tf(t,"checked",e,!1)}function Xu(t,e){Gg(t,e);var n=ir(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?$u(t,e.type,n):e.hasOwnProperty("defaultValue")&&$u(t,e.type,ir(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Sh(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function $u(t,e,n){(e!=="number"||ml(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var yo=Array.isArray;function Cs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+ir(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Yu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ce(91));return xt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Mh(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ce(92));if(yo(n)){if(1<n.length)throw Error(ce(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:ir(n)}}function Wg(t,e){var n=ir(e.value),i=ir(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Eh(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Xg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function qu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Xg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var ga,$g=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(ga=ga||document.createElement("div"),ga.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=ga.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Uo(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Eo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},v_=["Webkit","ms","Moz","O"];Object.keys(Eo).forEach(function(t){v_.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Eo[e]=Eo[t]})});function Yg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Eo.hasOwnProperty(t)&&Eo[t]?(""+e).trim():e+"px"}function qg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Yg(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var x_=xt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ku(t,e){if(e){if(x_[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ce(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ce(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ce(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ce(62))}}function Zu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ju=null;function of(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Qu=null,As=null,bs=null;function wh(t){if(t=ia(t)){if(typeof Qu!="function")throw Error(ce(280));var e=t.stateNode;e&&(e=ec(e),Qu(t.stateNode,t.type,e))}}function Kg(t){As?bs?bs.push(t):bs=[t]:As=t}function Zg(){if(As){var t=As,e=bs;if(bs=As=null,wh(t),e)for(t=0;t<e.length;t++)wh(e[t])}}function Jg(t,e){return t(e)}function Qg(){}var bc=!1;function e0(t,e,n){if(bc)return t(e,n);bc=!0;try{return Jg(t,e,n)}finally{bc=!1,(As!==null||bs!==null)&&(Qg(),Zg())}}function Oo(t,e){var n=t.stateNode;if(n===null)return null;var i=ec(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ce(231,e,typeof n));return n}var ed=!1;if(yi)try{var no={};Object.defineProperty(no,"passive",{get:function(){ed=!0}}),window.addEventListener("test",no,no),window.removeEventListener("test",no,no)}catch{ed=!1}function __(t,e,n,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(h){this.onError(h)}}var wo=!1,gl=null,vl=!1,td=null,y_={onError:function(t){wo=!0,gl=t}};function S_(t,e,n,i,r,s,o,a,l){wo=!1,gl=null,__.apply(y_,arguments)}function M_(t,e,n,i,r,s,o,a,l){if(S_.apply(this,arguments),wo){if(wo){var c=gl;wo=!1,gl=null}else throw Error(ce(198));vl||(vl=!0,td=c)}}function Gr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function t0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Th(t){if(Gr(t)!==t)throw Error(ce(188))}function E_(t){var e=t.alternate;if(!e){if(e=Gr(t),e===null)throw Error(ce(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Th(r),t;if(s===i)return Th(r),e;s=s.sibling}throw Error(ce(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(ce(189))}}if(n.alternate!==i)throw Error(ce(190))}if(n.tag!==3)throw Error(ce(188));return n.stateNode.current===n?t:e}function n0(t){return t=E_(t),t!==null?i0(t):null}function i0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=i0(t);if(e!==null)return e;t=t.sibling}return null}var r0=Sn.unstable_scheduleCallback,Ch=Sn.unstable_cancelCallback,w_=Sn.unstable_shouldYield,T_=Sn.unstable_requestPaint,Tt=Sn.unstable_now,C_=Sn.unstable_getCurrentPriorityLevel,af=Sn.unstable_ImmediatePriority,s0=Sn.unstable_UserBlockingPriority,xl=Sn.unstable_NormalPriority,A_=Sn.unstable_LowPriority,o0=Sn.unstable_IdlePriority,Kl=null,ti=null;function b_(t){if(ti&&typeof ti.onCommitFiberRoot=="function")try{ti.onCommitFiberRoot(Kl,t,void 0,(t.current.flags&128)===128)}catch{}}var Hn=Math.clz32?Math.clz32:L_,R_=Math.log,P_=Math.LN2;function L_(t){return t>>>=0,t===0?32:31-(R_(t)/P_|0)|0}var va=64,xa=4194304;function So(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function _l(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=So(a):(s&=o,s!==0&&(i=So(s)))}else o=n&~r,o!==0?i=So(o):s!==0&&(i=So(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Hn(e),r=1<<n,i|=t[n],e&=~r;return i}function N_(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function D_(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-Hn(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=N_(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function nd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function a0(){var t=va;return va<<=1,!(va&4194240)&&(va=64),t}function Rc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function ta(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Hn(e),t[e]=n}function I_(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Hn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function lf(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Hn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var nt=0;function l0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var c0,cf,u0,d0,f0,id=!1,_a=[],Wi=null,Xi=null,$i=null,Fo=new Map,ko=new Map,ki=[],U_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ah(t,e){switch(t){case"focusin":case"focusout":Wi=null;break;case"dragenter":case"dragleave":Xi=null;break;case"mouseover":case"mouseout":$i=null;break;case"pointerover":case"pointerout":Fo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ko.delete(e.pointerId)}}function io(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=ia(e),e!==null&&cf(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function O_(t,e,n,i,r){switch(e){case"focusin":return Wi=io(Wi,t,e,n,i,r),!0;case"dragenter":return Xi=io(Xi,t,e,n,i,r),!0;case"mouseover":return $i=io($i,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Fo.set(s,io(Fo.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,ko.set(s,io(ko.get(s)||null,t,e,n,i,r)),!0}return!1}function h0(t){var e=Ar(t.target);if(e!==null){var n=Gr(e);if(n!==null){if(e=n.tag,e===13){if(e=t0(n),e!==null){t.blockedOn=e,f0(t.priority,function(){u0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function il(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=rd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Ju=i,n.target.dispatchEvent(i),Ju=null}else return e=ia(n),e!==null&&cf(e),t.blockedOn=n,!1;e.shift()}return!0}function bh(t,e,n){il(t)&&n.delete(e)}function F_(){id=!1,Wi!==null&&il(Wi)&&(Wi=null),Xi!==null&&il(Xi)&&(Xi=null),$i!==null&&il($i)&&($i=null),Fo.forEach(bh),ko.forEach(bh)}function ro(t,e){t.blockedOn===e&&(t.blockedOn=null,id||(id=!0,Sn.unstable_scheduleCallback(Sn.unstable_NormalPriority,F_)))}function zo(t){function e(r){return ro(r,t)}if(0<_a.length){ro(_a[0],t);for(var n=1;n<_a.length;n++){var i=_a[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Wi!==null&&ro(Wi,t),Xi!==null&&ro(Xi,t),$i!==null&&ro($i,t),Fo.forEach(e),ko.forEach(e),n=0;n<ki.length;n++)i=ki[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<ki.length&&(n=ki[0],n.blockedOn===null);)h0(n),n.blockedOn===null&&ki.shift()}var Rs=wi.ReactCurrentBatchConfig,yl=!0;function k_(t,e,n,i){var r=nt,s=Rs.transition;Rs.transition=null;try{nt=1,uf(t,e,n,i)}finally{nt=r,Rs.transition=s}}function z_(t,e,n,i){var r=nt,s=Rs.transition;Rs.transition=null;try{nt=4,uf(t,e,n,i)}finally{nt=r,Rs.transition=s}}function uf(t,e,n,i){if(yl){var r=rd(t,e,n,i);if(r===null)zc(t,e,i,Sl,n),Ah(t,i);else if(O_(r,t,e,n,i))i.stopPropagation();else if(Ah(t,i),e&4&&-1<U_.indexOf(t)){for(;r!==null;){var s=ia(r);if(s!==null&&c0(s),s=rd(t,e,n,i),s===null&&zc(t,e,i,Sl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else zc(t,e,i,null,n)}}var Sl=null;function rd(t,e,n,i){if(Sl=null,t=of(i),t=Ar(t),t!==null)if(e=Gr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=t0(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Sl=t,null}function p0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(C_()){case af:return 1;case s0:return 4;case xl:case A_:return 16;case o0:return 536870912;default:return 16}default:return 16}}var ji=null,df=null,rl=null;function m0(){if(rl)return rl;var t,e=df,n=e.length,i,r="value"in ji?ji.value:ji.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return rl=r.slice(t,1<i?1-i:void 0)}function sl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ya(){return!0}function Rh(){return!1}function En(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ya:Rh,this.isPropagationStopped=Rh,this}return xt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ya)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ya)},persist:function(){},isPersistent:ya}),e}var Ks={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ff=En(Ks),na=xt({},Ks,{view:0,detail:0}),B_=En(na),Pc,Lc,so,Zl=xt({},na,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:hf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==so&&(so&&t.type==="mousemove"?(Pc=t.screenX-so.screenX,Lc=t.screenY-so.screenY):Lc=Pc=0,so=t),Pc)},movementY:function(t){return"movementY"in t?t.movementY:Lc}}),Ph=En(Zl),j_=xt({},Zl,{dataTransfer:0}),V_=En(j_),H_=xt({},na,{relatedTarget:0}),Nc=En(H_),G_=xt({},Ks,{animationName:0,elapsedTime:0,pseudoElement:0}),W_=En(G_),X_=xt({},Ks,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),$_=En(X_),Y_=xt({},Ks,{data:0}),Lh=En(Y_),q_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},K_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Z_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function J_(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Z_[t])?!!e[t]:!1}function hf(){return J_}var Q_=xt({},na,{key:function(t){if(t.key){var e=q_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=sl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?K_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:hf,charCode:function(t){return t.type==="keypress"?sl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?sl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),ey=En(Q_),ty=xt({},Zl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Nh=En(ty),ny=xt({},na,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:hf}),iy=En(ny),ry=xt({},Ks,{propertyName:0,elapsedTime:0,pseudoElement:0}),sy=En(ry),oy=xt({},Zl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),ay=En(oy),ly=[9,13,27,32],pf=yi&&"CompositionEvent"in window,To=null;yi&&"documentMode"in document&&(To=document.documentMode);var cy=yi&&"TextEvent"in window&&!To,g0=yi&&(!pf||To&&8<To&&11>=To),Dh=" ",Ih=!1;function v0(t,e){switch(t){case"keyup":return ly.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function x0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ps=!1;function uy(t,e){switch(t){case"compositionend":return x0(e);case"keypress":return e.which!==32?null:(Ih=!0,Dh);case"textInput":return t=e.data,t===Dh&&Ih?null:t;default:return null}}function dy(t,e){if(ps)return t==="compositionend"||!pf&&v0(t,e)?(t=m0(),rl=df=ji=null,ps=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return g0&&e.locale!=="ko"?null:e.data;default:return null}}var fy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Uh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!fy[t.type]:e==="textarea"}function _0(t,e,n,i){Kg(i),e=Ml(e,"onChange"),0<e.length&&(n=new ff("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Co=null,Bo=null;function hy(t){P0(t,0)}function Jl(t){var e=vs(t);if(Hg(e))return t}function py(t,e){if(t==="change")return e}var y0=!1;if(yi){var Dc;if(yi){var Ic="oninput"in document;if(!Ic){var Oh=document.createElement("div");Oh.setAttribute("oninput","return;"),Ic=typeof Oh.oninput=="function"}Dc=Ic}else Dc=!1;y0=Dc&&(!document.documentMode||9<document.documentMode)}function Fh(){Co&&(Co.detachEvent("onpropertychange",S0),Bo=Co=null)}function S0(t){if(t.propertyName==="value"&&Jl(Bo)){var e=[];_0(e,Bo,t,of(t)),e0(hy,e)}}function my(t,e,n){t==="focusin"?(Fh(),Co=e,Bo=n,Co.attachEvent("onpropertychange",S0)):t==="focusout"&&Fh()}function gy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Jl(Bo)}function vy(t,e){if(t==="click")return Jl(e)}function xy(t,e){if(t==="input"||t==="change")return Jl(e)}function _y(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Wn=typeof Object.is=="function"?Object.is:_y;function jo(t,e){if(Wn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Bu.call(e,r)||!Wn(t[r],e[r]))return!1}return!0}function kh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function zh(t,e){var n=kh(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=kh(n)}}function M0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?M0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function E0(){for(var t=window,e=ml();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=ml(t.document)}return e}function mf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function yy(t){var e=E0(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&M0(n.ownerDocument.documentElement,n)){if(i!==null&&mf(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=zh(n,s);var o=zh(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Sy=yi&&"documentMode"in document&&11>=document.documentMode,ms=null,sd=null,Ao=null,od=!1;function Bh(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;od||ms==null||ms!==ml(i)||(i=ms,"selectionStart"in i&&mf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ao&&jo(Ao,i)||(Ao=i,i=Ml(sd,"onSelect"),0<i.length&&(e=new ff("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=ms)))}function Sa(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var gs={animationend:Sa("Animation","AnimationEnd"),animationiteration:Sa("Animation","AnimationIteration"),animationstart:Sa("Animation","AnimationStart"),transitionend:Sa("Transition","TransitionEnd")},Uc={},w0={};yi&&(w0=document.createElement("div").style,"AnimationEvent"in window||(delete gs.animationend.animation,delete gs.animationiteration.animation,delete gs.animationstart.animation),"TransitionEvent"in window||delete gs.transitionend.transition);function Ql(t){if(Uc[t])return Uc[t];if(!gs[t])return t;var e=gs[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in w0)return Uc[t]=e[n];return t}var T0=Ql("animationend"),C0=Ql("animationiteration"),A0=Ql("animationstart"),b0=Ql("transitionend"),R0=new Map,jh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ar(t,e){R0.set(t,e),Hr(e,[t])}for(var Oc=0;Oc<jh.length;Oc++){var Fc=jh[Oc],My=Fc.toLowerCase(),Ey=Fc[0].toUpperCase()+Fc.slice(1);ar(My,"on"+Ey)}ar(T0,"onAnimationEnd");ar(C0,"onAnimationIteration");ar(A0,"onAnimationStart");ar("dblclick","onDoubleClick");ar("focusin","onFocus");ar("focusout","onBlur");ar(b0,"onTransitionEnd");Us("onMouseEnter",["mouseout","mouseover"]);Us("onMouseLeave",["mouseout","mouseover"]);Us("onPointerEnter",["pointerout","pointerover"]);Us("onPointerLeave",["pointerout","pointerover"]);Hr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Hr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Hr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Hr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Hr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Hr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Mo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),wy=new Set("cancel close invalid load scroll toggle".split(" ").concat(Mo));function Vh(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,M_(i,e,void 0,t),t.currentTarget=null}function P0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;Vh(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;Vh(r,a,c),s=l}}}if(vl)throw t=td,vl=!1,td=null,t}function lt(t,e){var n=e[dd];n===void 0&&(n=e[dd]=new Set);var i=t+"__bubble";n.has(i)||(L0(e,t,2,!1),n.add(i))}function kc(t,e,n){var i=0;e&&(i|=4),L0(n,t,i,e)}var Ma="_reactListening"+Math.random().toString(36).slice(2);function Vo(t){if(!t[Ma]){t[Ma]=!0,kg.forEach(function(n){n!=="selectionchange"&&(wy.has(n)||kc(n,!1,t),kc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ma]||(e[Ma]=!0,kc("selectionchange",!1,e))}}function L0(t,e,n,i){switch(p0(e)){case 1:var r=k_;break;case 4:r=z_;break;default:r=uf}n=r.bind(null,e,n,t),r=void 0,!ed||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function zc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Ar(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}e0(function(){var c=s,h=of(n),d=[];e:{var p=R0.get(t);if(p!==void 0){var g=ff,x=t;switch(t){case"keypress":if(sl(n)===0)break e;case"keydown":case"keyup":g=ey;break;case"focusin":x="focus",g=Nc;break;case"focusout":x="blur",g=Nc;break;case"beforeblur":case"afterblur":g=Nc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":g=Ph;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":g=V_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":g=iy;break;case T0:case C0:case A0:g=W_;break;case b0:g=sy;break;case"scroll":g=B_;break;case"wheel":g=ay;break;case"copy":case"cut":case"paste":g=$_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":g=Nh}var y=(e&4)!==0,m=!y&&t==="scroll",u=y?p!==null?p+"Capture":null:p;y=[];for(var _=c,v;_!==null;){v=_;var S=v.stateNode;if(v.tag===5&&S!==null&&(v=S,u!==null&&(S=Oo(_,u),S!=null&&y.push(Ho(_,S,v)))),m)break;_=_.return}0<y.length&&(p=new g(p,x,null,n,h),d.push({event:p,listeners:y}))}}if(!(e&7)){e:{if(p=t==="mouseover"||t==="pointerover",g=t==="mouseout"||t==="pointerout",p&&n!==Ju&&(x=n.relatedTarget||n.fromElement)&&(Ar(x)||x[Si]))break e;if((g||p)&&(p=h.window===h?h:(p=h.ownerDocument)?p.defaultView||p.parentWindow:window,g?(x=n.relatedTarget||n.toElement,g=c,x=x?Ar(x):null,x!==null&&(m=Gr(x),x!==m||x.tag!==5&&x.tag!==6)&&(x=null)):(g=null,x=c),g!==x)){if(y=Ph,S="onMouseLeave",u="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(y=Nh,S="onPointerLeave",u="onPointerEnter",_="pointer"),m=g==null?p:vs(g),v=x==null?p:vs(x),p=new y(S,_+"leave",g,n,h),p.target=m,p.relatedTarget=v,S=null,Ar(h)===c&&(y=new y(u,_+"enter",x,n,h),y.target=v,y.relatedTarget=m,S=y),m=S,g&&x)t:{for(y=g,u=x,_=0,v=y;v;v=$r(v))_++;for(v=0,S=u;S;S=$r(S))v++;for(;0<_-v;)y=$r(y),_--;for(;0<v-_;)u=$r(u),v--;for(;_--;){if(y===u||u!==null&&y===u.alternate)break t;y=$r(y),u=$r(u)}y=null}else y=null;g!==null&&Hh(d,p,g,y,!1),x!==null&&m!==null&&Hh(d,m,x,y,!0)}}e:{if(p=c?vs(c):window,g=p.nodeName&&p.nodeName.toLowerCase(),g==="select"||g==="input"&&p.type==="file")var b=py;else if(Uh(p))if(y0)b=xy;else{b=gy;var A=my}else(g=p.nodeName)&&g.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(b=vy);if(b&&(b=b(t,c))){_0(d,b,n,h);break e}A&&A(t,p,c),t==="focusout"&&(A=p._wrapperState)&&A.controlled&&p.type==="number"&&$u(p,"number",p.value)}switch(A=c?vs(c):window,t){case"focusin":(Uh(A)||A.contentEditable==="true")&&(ms=A,sd=c,Ao=null);break;case"focusout":Ao=sd=ms=null;break;case"mousedown":od=!0;break;case"contextmenu":case"mouseup":case"dragend":od=!1,Bh(d,n,h);break;case"selectionchange":if(Sy)break;case"keydown":case"keyup":Bh(d,n,h)}var w;if(pf)e:{switch(t){case"compositionstart":var N="onCompositionStart";break e;case"compositionend":N="onCompositionEnd";break e;case"compositionupdate":N="onCompositionUpdate";break e}N=void 0}else ps?v0(t,n)&&(N="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(N="onCompositionStart");N&&(g0&&n.locale!=="ko"&&(ps||N!=="onCompositionStart"?N==="onCompositionEnd"&&ps&&(w=m0()):(ji=h,df="value"in ji?ji.value:ji.textContent,ps=!0)),A=Ml(c,N),0<A.length&&(N=new Lh(N,t,null,n,h),d.push({event:N,listeners:A}),w?N.data=w:(w=x0(n),w!==null&&(N.data=w)))),(w=cy?uy(t,n):dy(t,n))&&(c=Ml(c,"onBeforeInput"),0<c.length&&(h=new Lh("onBeforeInput","beforeinput",null,n,h),d.push({event:h,listeners:c}),h.data=w))}P0(d,e)})}function Ho(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Ml(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Oo(t,n),s!=null&&i.unshift(Ho(t,s,r)),s=Oo(t,e),s!=null&&i.push(Ho(t,s,r))),t=t.return}return i}function $r(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Hh(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=Oo(n,s),l!=null&&o.unshift(Ho(n,l,a))):r||(l=Oo(n,s),l!=null&&o.push(Ho(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var Ty=/\r\n?/g,Cy=/\u0000|\uFFFD/g;function Gh(t){return(typeof t=="string"?t:""+t).replace(Ty,`
`).replace(Cy,"")}function Ea(t,e,n){if(e=Gh(e),Gh(t)!==e&&n)throw Error(ce(425))}function El(){}var ad=null,ld=null;function cd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var ud=typeof setTimeout=="function"?setTimeout:void 0,Ay=typeof clearTimeout=="function"?clearTimeout:void 0,Wh=typeof Promise=="function"?Promise:void 0,by=typeof queueMicrotask=="function"?queueMicrotask:typeof Wh<"u"?function(t){return Wh.resolve(null).then(t).catch(Ry)}:ud;function Ry(t){setTimeout(function(){throw t})}function Bc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),zo(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);zo(e)}function Yi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Xh(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Zs=Math.random().toString(36).slice(2),Qn="__reactFiber$"+Zs,Go="__reactProps$"+Zs,Si="__reactContainer$"+Zs,dd="__reactEvents$"+Zs,Py="__reactListeners$"+Zs,Ly="__reactHandles$"+Zs;function Ar(t){var e=t[Qn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Si]||n[Qn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Xh(t);t!==null;){if(n=t[Qn])return n;t=Xh(t)}return e}t=n,n=t.parentNode}return null}function ia(t){return t=t[Qn]||t[Si],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function vs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ce(33))}function ec(t){return t[Go]||null}var fd=[],xs=-1;function lr(t){return{current:t}}function ut(t){0>xs||(t.current=fd[xs],fd[xs]=null,xs--)}function st(t,e){xs++,fd[xs]=t.current,t.current=e}var rr={},qt=lr(rr),ln=lr(!1),Ur=rr;function Os(t,e){var n=t.type.contextTypes;if(!n)return rr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function cn(t){return t=t.childContextTypes,t!=null}function wl(){ut(ln),ut(qt)}function $h(t,e,n){if(qt.current!==rr)throw Error(ce(168));st(qt,e),st(ln,n)}function N0(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ce(108,m_(t)||"Unknown",r));return xt({},n,i)}function Tl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||rr,Ur=qt.current,st(qt,t),st(ln,ln.current),!0}function Yh(t,e,n){var i=t.stateNode;if(!i)throw Error(ce(169));n?(t=N0(t,e,Ur),i.__reactInternalMemoizedMergedChildContext=t,ut(ln),ut(qt),st(qt,t)):ut(ln),st(ln,n)}var hi=null,tc=!1,jc=!1;function D0(t){hi===null?hi=[t]:hi.push(t)}function Ny(t){tc=!0,D0(t)}function cr(){if(!jc&&hi!==null){jc=!0;var t=0,e=nt;try{var n=hi;for(nt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}hi=null,tc=!1}catch(r){throw hi!==null&&(hi=hi.slice(t+1)),r0(af,cr),r}finally{nt=e,jc=!1}}return null}var _s=[],ys=0,Cl=null,Al=0,An=[],bn=0,Or=null,gi=1,vi="";function Sr(t,e){_s[ys++]=Al,_s[ys++]=Cl,Cl=t,Al=e}function I0(t,e,n){An[bn++]=gi,An[bn++]=vi,An[bn++]=Or,Or=t;var i=gi;t=vi;var r=32-Hn(i)-1;i&=~(1<<r),n+=1;var s=32-Hn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,gi=1<<32-Hn(e)+r|n<<r|i,vi=s+t}else gi=1<<s|n<<r|i,vi=t}function gf(t){t.return!==null&&(Sr(t,1),I0(t,1,0))}function vf(t){for(;t===Cl;)Cl=_s[--ys],_s[ys]=null,Al=_s[--ys],_s[ys]=null;for(;t===Or;)Or=An[--bn],An[bn]=null,vi=An[--bn],An[bn]=null,gi=An[--bn],An[bn]=null}var yn=null,_n=null,ft=!1,zn=null;function U0(t,e){var n=Rn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function qh(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,yn=t,_n=Yi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,yn=t,_n=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Or!==null?{id:gi,overflow:vi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Rn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,yn=t,_n=null,!0):!1;default:return!1}}function hd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function pd(t){if(ft){var e=_n;if(e){var n=e;if(!qh(t,e)){if(hd(t))throw Error(ce(418));e=Yi(n.nextSibling);var i=yn;e&&qh(t,e)?U0(i,n):(t.flags=t.flags&-4097|2,ft=!1,yn=t)}}else{if(hd(t))throw Error(ce(418));t.flags=t.flags&-4097|2,ft=!1,yn=t}}}function Kh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;yn=t}function wa(t){if(t!==yn)return!1;if(!ft)return Kh(t),ft=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!cd(t.type,t.memoizedProps)),e&&(e=_n)){if(hd(t))throw O0(),Error(ce(418));for(;e;)U0(t,e),e=Yi(e.nextSibling)}if(Kh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ce(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){_n=Yi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}_n=null}}else _n=yn?Yi(t.stateNode.nextSibling):null;return!0}function O0(){for(var t=_n;t;)t=Yi(t.nextSibling)}function Fs(){_n=yn=null,ft=!1}function xf(t){zn===null?zn=[t]:zn.push(t)}var Dy=wi.ReactCurrentBatchConfig;function oo(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ce(309));var i=n.stateNode}if(!i)throw Error(ce(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(ce(284));if(!n._owner)throw Error(ce(290,t))}return t}function Ta(t,e){throw t=Object.prototype.toString.call(e),Error(ce(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Zh(t){var e=t._init;return e(t._payload)}function F0(t){function e(u,_){if(t){var v=u.deletions;v===null?(u.deletions=[_],u.flags|=16):v.push(_)}}function n(u,_){if(!t)return null;for(;_!==null;)e(u,_),_=_.sibling;return null}function i(u,_){for(u=new Map;_!==null;)_.key!==null?u.set(_.key,_):u.set(_.index,_),_=_.sibling;return u}function r(u,_){return u=Ji(u,_),u.index=0,u.sibling=null,u}function s(u,_,v){return u.index=v,t?(v=u.alternate,v!==null?(v=v.index,v<_?(u.flags|=2,_):v):(u.flags|=2,_)):(u.flags|=1048576,_)}function o(u){return t&&u.alternate===null&&(u.flags|=2),u}function a(u,_,v,S){return _===null||_.tag!==6?(_=Yc(v,u.mode,S),_.return=u,_):(_=r(_,v),_.return=u,_)}function l(u,_,v,S){var b=v.type;return b===hs?h(u,_,v.props.children,S,v.key):_!==null&&(_.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Ii&&Zh(b)===_.type)?(S=r(_,v.props),S.ref=oo(u,_,v),S.return=u,S):(S=fl(v.type,v.key,v.props,null,u.mode,S),S.ref=oo(u,_,v),S.return=u,S)}function c(u,_,v,S){return _===null||_.tag!==4||_.stateNode.containerInfo!==v.containerInfo||_.stateNode.implementation!==v.implementation?(_=qc(v,u.mode,S),_.return=u,_):(_=r(_,v.children||[]),_.return=u,_)}function h(u,_,v,S,b){return _===null||_.tag!==7?(_=Nr(v,u.mode,S,b),_.return=u,_):(_=r(_,v),_.return=u,_)}function d(u,_,v){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Yc(""+_,u.mode,v),_.return=u,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case pa:return v=fl(_.type,_.key,_.props,null,u.mode,v),v.ref=oo(u,null,_),v.return=u,v;case fs:return _=qc(_,u.mode,v),_.return=u,_;case Ii:var S=_._init;return d(u,S(_._payload),v)}if(yo(_)||to(_))return _=Nr(_,u.mode,v,null),_.return=u,_;Ta(u,_)}return null}function p(u,_,v,S){var b=_!==null?_.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return b!==null?null:a(u,_,""+v,S);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case pa:return v.key===b?l(u,_,v,S):null;case fs:return v.key===b?c(u,_,v,S):null;case Ii:return b=v._init,p(u,_,b(v._payload),S)}if(yo(v)||to(v))return b!==null?null:h(u,_,v,S,null);Ta(u,v)}return null}function g(u,_,v,S,b){if(typeof S=="string"&&S!==""||typeof S=="number")return u=u.get(v)||null,a(_,u,""+S,b);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case pa:return u=u.get(S.key===null?v:S.key)||null,l(_,u,S,b);case fs:return u=u.get(S.key===null?v:S.key)||null,c(_,u,S,b);case Ii:var A=S._init;return g(u,_,v,A(S._payload),b)}if(yo(S)||to(S))return u=u.get(v)||null,h(_,u,S,b,null);Ta(_,S)}return null}function x(u,_,v,S){for(var b=null,A=null,w=_,N=_=0,q=null;w!==null&&N<v.length;N++){w.index>N?(q=w,w=null):q=w.sibling;var M=p(u,w,v[N],S);if(M===null){w===null&&(w=q);break}t&&w&&M.alternate===null&&e(u,w),_=s(M,_,N),A===null?b=M:A.sibling=M,A=M,w=q}if(N===v.length)return n(u,w),ft&&Sr(u,N),b;if(w===null){for(;N<v.length;N++)w=d(u,v[N],S),w!==null&&(_=s(w,_,N),A===null?b=w:A.sibling=w,A=w);return ft&&Sr(u,N),b}for(w=i(u,w);N<v.length;N++)q=g(w,u,N,v[N],S),q!==null&&(t&&q.alternate!==null&&w.delete(q.key===null?N:q.key),_=s(q,_,N),A===null?b=q:A.sibling=q,A=q);return t&&w.forEach(function(R){return e(u,R)}),ft&&Sr(u,N),b}function y(u,_,v,S){var b=to(v);if(typeof b!="function")throw Error(ce(150));if(v=b.call(v),v==null)throw Error(ce(151));for(var A=b=null,w=_,N=_=0,q=null,M=v.next();w!==null&&!M.done;N++,M=v.next()){w.index>N?(q=w,w=null):q=w.sibling;var R=p(u,w,M.value,S);if(R===null){w===null&&(w=q);break}t&&w&&R.alternate===null&&e(u,w),_=s(R,_,N),A===null?b=R:A.sibling=R,A=R,w=q}if(M.done)return n(u,w),ft&&Sr(u,N),b;if(w===null){for(;!M.done;N++,M=v.next())M=d(u,M.value,S),M!==null&&(_=s(M,_,N),A===null?b=M:A.sibling=M,A=M);return ft&&Sr(u,N),b}for(w=i(u,w);!M.done;N++,M=v.next())M=g(w,u,N,M.value,S),M!==null&&(t&&M.alternate!==null&&w.delete(M.key===null?N:M.key),_=s(M,_,N),A===null?b=M:A.sibling=M,A=M);return t&&w.forEach(function(k){return e(u,k)}),ft&&Sr(u,N),b}function m(u,_,v,S){if(typeof v=="object"&&v!==null&&v.type===hs&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case pa:e:{for(var b=v.key,A=_;A!==null;){if(A.key===b){if(b=v.type,b===hs){if(A.tag===7){n(u,A.sibling),_=r(A,v.props.children),_.return=u,u=_;break e}}else if(A.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Ii&&Zh(b)===A.type){n(u,A.sibling),_=r(A,v.props),_.ref=oo(u,A,v),_.return=u,u=_;break e}n(u,A);break}else e(u,A);A=A.sibling}v.type===hs?(_=Nr(v.props.children,u.mode,S,v.key),_.return=u,u=_):(S=fl(v.type,v.key,v.props,null,u.mode,S),S.ref=oo(u,_,v),S.return=u,u=S)}return o(u);case fs:e:{for(A=v.key;_!==null;){if(_.key===A)if(_.tag===4&&_.stateNode.containerInfo===v.containerInfo&&_.stateNode.implementation===v.implementation){n(u,_.sibling),_=r(_,v.children||[]),_.return=u,u=_;break e}else{n(u,_);break}else e(u,_);_=_.sibling}_=qc(v,u.mode,S),_.return=u,u=_}return o(u);case Ii:return A=v._init,m(u,_,A(v._payload),S)}if(yo(v))return x(u,_,v,S);if(to(v))return y(u,_,v,S);Ta(u,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,_!==null&&_.tag===6?(n(u,_.sibling),_=r(_,v),_.return=u,u=_):(n(u,_),_=Yc(v,u.mode,S),_.return=u,u=_),o(u)):n(u,_)}return m}var ks=F0(!0),k0=F0(!1),bl=lr(null),Rl=null,Ss=null,_f=null;function yf(){_f=Ss=Rl=null}function Sf(t){var e=bl.current;ut(bl),t._currentValue=e}function md(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ps(t,e){Rl=t,_f=Ss=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(on=!0),t.firstContext=null)}function Ln(t){var e=t._currentValue;if(_f!==t)if(t={context:t,memoizedValue:e,next:null},Ss===null){if(Rl===null)throw Error(ce(308));Ss=t,Rl.dependencies={lanes:0,firstContext:t}}else Ss=Ss.next=t;return e}var br=null;function Mf(t){br===null?br=[t]:br.push(t)}function z0(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Mf(e)):(n.next=r.next,r.next=n),e.interleaved=n,Mi(t,i)}function Mi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Ui=!1;function Ef(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function B0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function _i(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function qi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Qe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Mi(t,n)}return r=i.interleaved,r===null?(e.next=e,Mf(i)):(e.next=r.next,r.next=e),i.interleaved=e,Mi(t,n)}function ol(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,lf(t,n)}}function Jh(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Pl(t,e,n,i){var r=t.updateQueue;Ui=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var h=t.alternate;h!==null&&(h=h.updateQueue,a=h.lastBaseUpdate,a!==o&&(a===null?h.firstBaseUpdate=c:a.next=c,h.lastBaseUpdate=l))}if(s!==null){var d=r.baseState;o=0,h=c=l=null,a=s;do{var p=a.lane,g=a.eventTime;if((i&p)===p){h!==null&&(h=h.next={eventTime:g,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var x=t,y=a;switch(p=e,g=n,y.tag){case 1:if(x=y.payload,typeof x=="function"){d=x.call(g,d,p);break e}d=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=y.payload,p=typeof x=="function"?x.call(g,d,p):x,p==null)break e;d=xt({},d,p);break e;case 2:Ui=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,p=r.effects,p===null?r.effects=[a]:p.push(a))}else g={eventTime:g,lane:p,tag:a.tag,payload:a.payload,callback:a.callback,next:null},h===null?(c=h=g,l=d):h=h.next=g,o|=p;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;p=a,a=p.next,p.next=null,r.lastBaseUpdate=p,r.shared.pending=null}}while(!0);if(h===null&&(l=d),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=h,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);kr|=o,t.lanes=o,t.memoizedState=d}}function Qh(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ce(191,r));r.call(i)}}}var ra={},ni=lr(ra),Wo=lr(ra),Xo=lr(ra);function Rr(t){if(t===ra)throw Error(ce(174));return t}function wf(t,e){switch(st(Xo,e),st(Wo,t),st(ni,ra),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:qu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=qu(e,t)}ut(ni),st(ni,e)}function zs(){ut(ni),ut(Wo),ut(Xo)}function j0(t){Rr(Xo.current);var e=Rr(ni.current),n=qu(e,t.type);e!==n&&(st(Wo,t),st(ni,n))}function Tf(t){Wo.current===t&&(ut(ni),ut(Wo))}var gt=lr(0);function Ll(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Vc=[];function Cf(){for(var t=0;t<Vc.length;t++)Vc[t]._workInProgressVersionPrimary=null;Vc.length=0}var al=wi.ReactCurrentDispatcher,Hc=wi.ReactCurrentBatchConfig,Fr=0,vt=null,bt=null,Ut=null,Nl=!1,bo=!1,$o=0,Iy=0;function Ht(){throw Error(ce(321))}function Af(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Wn(t[n],e[n]))return!1;return!0}function bf(t,e,n,i,r,s){if(Fr=s,vt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,al.current=t===null||t.memoizedState===null?ky:zy,t=n(i,r),bo){s=0;do{if(bo=!1,$o=0,25<=s)throw Error(ce(301));s+=1,Ut=bt=null,e.updateQueue=null,al.current=By,t=n(i,r)}while(bo)}if(al.current=Dl,e=bt!==null&&bt.next!==null,Fr=0,Ut=bt=vt=null,Nl=!1,e)throw Error(ce(300));return t}function Rf(){var t=$o!==0;return $o=0,t}function qn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ut===null?vt.memoizedState=Ut=t:Ut=Ut.next=t,Ut}function Nn(){if(bt===null){var t=vt.alternate;t=t!==null?t.memoizedState:null}else t=bt.next;var e=Ut===null?vt.memoizedState:Ut.next;if(e!==null)Ut=e,bt=t;else{if(t===null)throw Error(ce(310));bt=t,t={memoizedState:bt.memoizedState,baseState:bt.baseState,baseQueue:bt.baseQueue,queue:bt.queue,next:null},Ut===null?vt.memoizedState=Ut=t:Ut=Ut.next=t}return Ut}function Yo(t,e){return typeof e=="function"?e(t):e}function Gc(t){var e=Nn(),n=e.queue;if(n===null)throw Error(ce(311));n.lastRenderedReducer=t;var i=bt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var h=c.lane;if((Fr&h)===h)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var d={lane:h,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=d,o=i):l=l.next=d,vt.lanes|=h,kr|=h}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,Wn(i,e.memoizedState)||(on=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,vt.lanes|=s,kr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Wc(t){var e=Nn(),n=e.queue;if(n===null)throw Error(ce(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);Wn(s,e.memoizedState)||(on=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function V0(){}function H0(t,e){var n=vt,i=Nn(),r=e(),s=!Wn(i.memoizedState,r);if(s&&(i.memoizedState=r,on=!0),i=i.queue,Pf(X0.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ut!==null&&Ut.memoizedState.tag&1){if(n.flags|=2048,qo(9,W0.bind(null,n,i,r,e),void 0,null),Ft===null)throw Error(ce(349));Fr&30||G0(n,e,r)}return r}function G0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function W0(t,e,n,i){e.value=n,e.getSnapshot=i,$0(e)&&Y0(t)}function X0(t,e,n){return n(function(){$0(e)&&Y0(t)})}function $0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Wn(t,n)}catch{return!0}}function Y0(t){var e=Mi(t,1);e!==null&&Gn(e,t,1,-1)}function ep(t){var e=qn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Yo,lastRenderedState:t},e.queue=t,t=t.dispatch=Fy.bind(null,vt,t),[e.memoizedState,t]}function qo(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function q0(){return Nn().memoizedState}function ll(t,e,n,i){var r=qn();vt.flags|=t,r.memoizedState=qo(1|e,n,void 0,i===void 0?null:i)}function nc(t,e,n,i){var r=Nn();i=i===void 0?null:i;var s=void 0;if(bt!==null){var o=bt.memoizedState;if(s=o.destroy,i!==null&&Af(i,o.deps)){r.memoizedState=qo(e,n,s,i);return}}vt.flags|=t,r.memoizedState=qo(1|e,n,s,i)}function tp(t,e){return ll(8390656,8,t,e)}function Pf(t,e){return nc(2048,8,t,e)}function K0(t,e){return nc(4,2,t,e)}function Z0(t,e){return nc(4,4,t,e)}function J0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Q0(t,e,n){return n=n!=null?n.concat([t]):null,nc(4,4,J0.bind(null,e,t),n)}function Lf(){}function ev(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Af(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function tv(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Af(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function nv(t,e,n){return Fr&21?(Wn(n,e)||(n=a0(),vt.lanes|=n,kr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,on=!0),t.memoizedState=n)}function Uy(t,e){var n=nt;nt=n!==0&&4>n?n:4,t(!0);var i=Hc.transition;Hc.transition={};try{t(!1),e()}finally{nt=n,Hc.transition=i}}function iv(){return Nn().memoizedState}function Oy(t,e,n){var i=Zi(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},rv(t))sv(e,n);else if(n=z0(t,e,n,i),n!==null){var r=Qt();Gn(n,t,i,r),ov(n,e,i)}}function Fy(t,e,n){var i=Zi(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(rv(t))sv(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,Wn(a,o)){var l=e.interleaved;l===null?(r.next=r,Mf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=z0(t,e,r,i),n!==null&&(r=Qt(),Gn(n,t,i,r),ov(n,e,i))}}function rv(t){var e=t.alternate;return t===vt||e!==null&&e===vt}function sv(t,e){bo=Nl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function ov(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,lf(t,n)}}var Dl={readContext:Ln,useCallback:Ht,useContext:Ht,useEffect:Ht,useImperativeHandle:Ht,useInsertionEffect:Ht,useLayoutEffect:Ht,useMemo:Ht,useReducer:Ht,useRef:Ht,useState:Ht,useDebugValue:Ht,useDeferredValue:Ht,useTransition:Ht,useMutableSource:Ht,useSyncExternalStore:Ht,useId:Ht,unstable_isNewReconciler:!1},ky={readContext:Ln,useCallback:function(t,e){return qn().memoizedState=[t,e===void 0?null:e],t},useContext:Ln,useEffect:tp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,ll(4194308,4,J0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return ll(4194308,4,t,e)},useInsertionEffect:function(t,e){return ll(4,2,t,e)},useMemo:function(t,e){var n=qn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=qn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Oy.bind(null,vt,t),[i.memoizedState,t]},useRef:function(t){var e=qn();return t={current:t},e.memoizedState=t},useState:ep,useDebugValue:Lf,useDeferredValue:function(t){return qn().memoizedState=t},useTransition:function(){var t=ep(!1),e=t[0];return t=Uy.bind(null,t[1]),qn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=vt,r=qn();if(ft){if(n===void 0)throw Error(ce(407));n=n()}else{if(n=e(),Ft===null)throw Error(ce(349));Fr&30||G0(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,tp(X0.bind(null,i,s,t),[t]),i.flags|=2048,qo(9,W0.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=qn(),e=Ft.identifierPrefix;if(ft){var n=vi,i=gi;n=(i&~(1<<32-Hn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=$o++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Iy++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},zy={readContext:Ln,useCallback:ev,useContext:Ln,useEffect:Pf,useImperativeHandle:Q0,useInsertionEffect:K0,useLayoutEffect:Z0,useMemo:tv,useReducer:Gc,useRef:q0,useState:function(){return Gc(Yo)},useDebugValue:Lf,useDeferredValue:function(t){var e=Nn();return nv(e,bt.memoizedState,t)},useTransition:function(){var t=Gc(Yo)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:V0,useSyncExternalStore:H0,useId:iv,unstable_isNewReconciler:!1},By={readContext:Ln,useCallback:ev,useContext:Ln,useEffect:Pf,useImperativeHandle:Q0,useInsertionEffect:K0,useLayoutEffect:Z0,useMemo:tv,useReducer:Wc,useRef:q0,useState:function(){return Wc(Yo)},useDebugValue:Lf,useDeferredValue:function(t){var e=Nn();return bt===null?e.memoizedState=t:nv(e,bt.memoizedState,t)},useTransition:function(){var t=Wc(Yo)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:V0,useSyncExternalStore:H0,useId:iv,unstable_isNewReconciler:!1};function Fn(t,e){if(t&&t.defaultProps){e=xt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function gd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:xt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var ic={isMounted:function(t){return(t=t._reactInternals)?Gr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Zi(t),s=_i(i,r);s.payload=e,n!=null&&(s.callback=n),e=qi(t,s,r),e!==null&&(Gn(e,t,r,i),ol(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Zi(t),s=_i(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=qi(t,s,r),e!==null&&(Gn(e,t,r,i),ol(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Qt(),i=Zi(t),r=_i(n,i);r.tag=2,e!=null&&(r.callback=e),e=qi(t,r,i),e!==null&&(Gn(e,t,i,n),ol(e,t,i))}};function np(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!jo(n,i)||!jo(r,s):!0}function av(t,e,n){var i=!1,r=rr,s=e.contextType;return typeof s=="object"&&s!==null?s=Ln(s):(r=cn(e)?Ur:qt.current,i=e.contextTypes,s=(i=i!=null)?Os(t,r):rr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=ic,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function ip(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&ic.enqueueReplaceState(e,e.state,null)}function vd(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Ef(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Ln(s):(s=cn(e)?Ur:qt.current,r.context=Os(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(gd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&ic.enqueueReplaceState(r,r.state,null),Pl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Bs(t,e){try{var n="",i=e;do n+=p_(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Xc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function xd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var jy=typeof WeakMap=="function"?WeakMap:Map;function lv(t,e,n){n=_i(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Ul||(Ul=!0,bd=i),xd(t,e)},n}function cv(t,e,n){n=_i(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){xd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){xd(t,e),typeof i!="function"&&(Ki===null?Ki=new Set([this]):Ki.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function rp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new jy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=t1.bind(null,t,e,n),e.then(t,t))}function sp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function op(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=_i(-1,1),e.tag=2,qi(n,e,1))),n.lanes|=1),t)}var Vy=wi.ReactCurrentOwner,on=!1;function Zt(t,e,n,i){e.child=t===null?k0(e,null,n,i):ks(e,t.child,n,i)}function ap(t,e,n,i,r){n=n.render;var s=e.ref;return Ps(e,r),i=bf(t,e,n,i,s,r),n=Rf(),t!==null&&!on?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ei(t,e,r)):(ft&&n&&gf(e),e.flags|=1,Zt(t,e,i,r),e.child)}function lp(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!zf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,uv(t,e,s,i,r)):(t=fl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:jo,n(o,i)&&t.ref===e.ref)return Ei(t,e,r)}return e.flags|=1,t=Ji(s,i),t.ref=e.ref,t.return=e,e.child=t}function uv(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(jo(s,i)&&t.ref===e.ref)if(on=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(on=!0);else return e.lanes=t.lanes,Ei(t,e,r)}return _d(t,e,n,i,r)}function dv(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},st(Es,vn),vn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,st(Es,vn),vn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,st(Es,vn),vn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,st(Es,vn),vn|=i;return Zt(t,e,r,n),e.child}function fv(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function _d(t,e,n,i,r){var s=cn(n)?Ur:qt.current;return s=Os(e,s),Ps(e,r),n=bf(t,e,n,i,s,r),i=Rf(),t!==null&&!on?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ei(t,e,r)):(ft&&i&&gf(e),e.flags|=1,Zt(t,e,n,r),e.child)}function cp(t,e,n,i,r){if(cn(n)){var s=!0;Tl(e)}else s=!1;if(Ps(e,r),e.stateNode===null)cl(t,e),av(e,n,i),vd(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Ln(c):(c=cn(n)?Ur:qt.current,c=Os(e,c));var h=n.getDerivedStateFromProps,d=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function";d||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&ip(e,o,i,c),Ui=!1;var p=e.memoizedState;o.state=p,Pl(e,i,o,r),l=e.memoizedState,a!==i||p!==l||ln.current||Ui?(typeof h=="function"&&(gd(e,n,h,i),l=e.memoizedState),(a=Ui||np(e,n,a,i,p,l,c))?(d||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,B0(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:Fn(e.type,a),o.props=c,d=e.pendingProps,p=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Ln(l):(l=cn(n)?Ur:qt.current,l=Os(e,l));var g=n.getDerivedStateFromProps;(h=typeof g=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==d||p!==l)&&ip(e,o,i,l),Ui=!1,p=e.memoizedState,o.state=p,Pl(e,i,o,r);var x=e.memoizedState;a!==d||p!==x||ln.current||Ui?(typeof g=="function"&&(gd(e,n,g,i),x=e.memoizedState),(c=Ui||np(e,n,c,i,p,x,l)||!1)?(h||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,x,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,x,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=x),o.props=i,o.state=x,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),i=!1)}return yd(t,e,n,i,s,r)}function yd(t,e,n,i,r,s){fv(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Yh(e,n,!1),Ei(t,e,s);i=e.stateNode,Vy.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=ks(e,t.child,null,s),e.child=ks(e,null,a,s)):Zt(t,e,a,s),e.memoizedState=i.state,r&&Yh(e,n,!0),e.child}function hv(t){var e=t.stateNode;e.pendingContext?$h(t,e.pendingContext,e.pendingContext!==e.context):e.context&&$h(t,e.context,!1),wf(t,e.containerInfo)}function up(t,e,n,i,r){return Fs(),xf(r),e.flags|=256,Zt(t,e,n,i),e.child}var Sd={dehydrated:null,treeContext:null,retryLane:0};function Md(t){return{baseLanes:t,cachePool:null,transitions:null}}function pv(t,e,n){var i=e.pendingProps,r=gt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),st(gt,r&1),t===null)return pd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=oc(o,i,0,null),t=Nr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Md(n),e.memoizedState=Sd,t):Nf(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return Hy(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Ji(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=Ji(a,s):(s=Nr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Md(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Sd,i}return s=t.child,t=s.sibling,i=Ji(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Nf(t,e){return e=oc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Ca(t,e,n,i){return i!==null&&xf(i),ks(e,t.child,null,n),t=Nf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Hy(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=Xc(Error(ce(422))),Ca(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=oc({mode:"visible",children:i.children},r,0,null),s=Nr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&ks(e,t.child,null,o),e.child.memoizedState=Md(o),e.memoizedState=Sd,s);if(!(e.mode&1))return Ca(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ce(419)),i=Xc(s,i,void 0),Ca(t,e,o,i)}if(a=(o&t.childLanes)!==0,on||a){if(i=Ft,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Mi(t,r),Gn(i,t,r,-1))}return kf(),i=Xc(Error(ce(421))),Ca(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=n1.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,_n=Yi(r.nextSibling),yn=e,ft=!0,zn=null,t!==null&&(An[bn++]=gi,An[bn++]=vi,An[bn++]=Or,gi=t.id,vi=t.overflow,Or=e),e=Nf(e,i.children),e.flags|=4096,e)}function dp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),md(t.return,e,n)}function $c(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function mv(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Zt(t,e,i.children,n),i=gt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&dp(t,n,e);else if(t.tag===19)dp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(st(gt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Ll(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),$c(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Ll(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}$c(e,!0,n,null,s);break;case"together":$c(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function cl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Ei(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),kr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ce(153));if(e.child!==null){for(t=e.child,n=Ji(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Ji(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Gy(t,e,n){switch(e.tag){case 3:hv(e),Fs();break;case 5:j0(e);break;case 1:cn(e.type)&&Tl(e);break;case 4:wf(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;st(bl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(st(gt,gt.current&1),e.flags|=128,null):n&e.child.childLanes?pv(t,e,n):(st(gt,gt.current&1),t=Ei(t,e,n),t!==null?t.sibling:null);st(gt,gt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return mv(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),st(gt,gt.current),i)break;return null;case 22:case 23:return e.lanes=0,dv(t,e,n)}return Ei(t,e,n)}var gv,Ed,vv,xv;gv=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ed=function(){};vv=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Rr(ni.current);var s=null;switch(n){case"input":r=Wu(t,r),i=Wu(t,i),s=[];break;case"select":r=xt({},r,{value:void 0}),i=xt({},i,{value:void 0}),s=[];break;case"textarea":r=Yu(t,r),i=Yu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=El)}Ku(n,i);var o;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Io.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Io.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&lt("scroll",t),s||a===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};xv=function(t,e,n,i){n!==i&&(e.flags|=4)};function ao(t,e){if(!ft)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Gt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Wy(t,e,n){var i=e.pendingProps;switch(vf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Gt(e),null;case 1:return cn(e.type)&&wl(),Gt(e),null;case 3:return i=e.stateNode,zs(),ut(ln),ut(qt),Cf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(wa(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,zn!==null&&(Ld(zn),zn=null))),Ed(t,e),Gt(e),null;case 5:Tf(e);var r=Rr(Xo.current);if(n=e.type,t!==null&&e.stateNode!=null)vv(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ce(166));return Gt(e),null}if(t=Rr(ni.current),wa(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Qn]=e,i[Go]=s,t=(e.mode&1)!==0,n){case"dialog":lt("cancel",i),lt("close",i);break;case"iframe":case"object":case"embed":lt("load",i);break;case"video":case"audio":for(r=0;r<Mo.length;r++)lt(Mo[r],i);break;case"source":lt("error",i);break;case"img":case"image":case"link":lt("error",i),lt("load",i);break;case"details":lt("toggle",i);break;case"input":yh(i,s),lt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},lt("invalid",i);break;case"textarea":Mh(i,s),lt("invalid",i)}Ku(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&Ea(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&Ea(i.textContent,a,t),r=["children",""+a]):Io.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&lt("scroll",i)}switch(n){case"input":ma(i),Sh(i,s,!0);break;case"textarea":ma(i),Eh(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=El)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Xg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[Qn]=e,t[Go]=i,gv(t,e,!1,!1),e.stateNode=t;e:{switch(o=Zu(n,i),n){case"dialog":lt("cancel",t),lt("close",t),r=i;break;case"iframe":case"object":case"embed":lt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Mo.length;r++)lt(Mo[r],t);r=i;break;case"source":lt("error",t),r=i;break;case"img":case"image":case"link":lt("error",t),lt("load",t),r=i;break;case"details":lt("toggle",t),r=i;break;case"input":yh(t,i),r=Wu(t,i),lt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=xt({},i,{value:void 0}),lt("invalid",t);break;case"textarea":Mh(t,i),r=Yu(t,i),lt("invalid",t);break;default:r=i}Ku(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?qg(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&$g(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Uo(t,l):typeof l=="number"&&Uo(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Io.hasOwnProperty(s)?l!=null&&s==="onScroll"&&lt("scroll",t):l!=null&&tf(t,s,l,o))}switch(n){case"input":ma(t),Sh(t,i,!1);break;case"textarea":ma(t),Eh(t);break;case"option":i.value!=null&&t.setAttribute("value",""+ir(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Cs(t,!!i.multiple,s,!1):i.defaultValue!=null&&Cs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=El)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Gt(e),null;case 6:if(t&&e.stateNode!=null)xv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ce(166));if(n=Rr(Xo.current),Rr(ni.current),wa(e)){if(i=e.stateNode,n=e.memoizedProps,i[Qn]=e,(s=i.nodeValue!==n)&&(t=yn,t!==null))switch(t.tag){case 3:Ea(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Ea(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Qn]=e,e.stateNode=i}return Gt(e),null;case 13:if(ut(gt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(ft&&_n!==null&&e.mode&1&&!(e.flags&128))O0(),Fs(),e.flags|=98560,s=!1;else if(s=wa(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ce(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ce(317));s[Qn]=e}else Fs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Gt(e),s=!1}else zn!==null&&(Ld(zn),zn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||gt.current&1?Rt===0&&(Rt=3):kf())),e.updateQueue!==null&&(e.flags|=4),Gt(e),null);case 4:return zs(),Ed(t,e),t===null&&Vo(e.stateNode.containerInfo),Gt(e),null;case 10:return Sf(e.type._context),Gt(e),null;case 17:return cn(e.type)&&wl(),Gt(e),null;case 19:if(ut(gt),s=e.memoizedState,s===null)return Gt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)ao(s,!1);else{if(Rt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Ll(t),o!==null){for(e.flags|=128,ao(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return st(gt,gt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Tt()>js&&(e.flags|=128,i=!0,ao(s,!1),e.lanes=4194304)}else{if(!i)if(t=Ll(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ao(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!ft)return Gt(e),null}else 2*Tt()-s.renderingStartTime>js&&n!==1073741824&&(e.flags|=128,i=!0,ao(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Tt(),e.sibling=null,n=gt.current,st(gt,i?n&1|2:n&1),e):(Gt(e),null);case 22:case 23:return Ff(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?vn&1073741824&&(Gt(e),e.subtreeFlags&6&&(e.flags|=8192)):Gt(e),null;case 24:return null;case 25:return null}throw Error(ce(156,e.tag))}function Xy(t,e){switch(vf(e),e.tag){case 1:return cn(e.type)&&wl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return zs(),ut(ln),ut(qt),Cf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Tf(e),null;case 13:if(ut(gt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ce(340));Fs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ut(gt),null;case 4:return zs(),null;case 10:return Sf(e.type._context),null;case 22:case 23:return Ff(),null;case 24:return null;default:return null}}var Aa=!1,$t=!1,$y=typeof WeakSet=="function"?WeakSet:Set,Ee=null;function Ms(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Mt(t,e,i)}else n.current=null}function wd(t,e,n){try{n()}catch(i){Mt(t,e,i)}}var fp=!1;function Yy(t,e){if(ad=yl,t=E0(),mf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,c=0,h=0,d=t,p=null;t:for(;;){for(var g;d!==n||r!==0&&d.nodeType!==3||(a=o+r),d!==s||i!==0&&d.nodeType!==3||(l=o+i),d.nodeType===3&&(o+=d.nodeValue.length),(g=d.firstChild)!==null;)p=d,d=g;for(;;){if(d===t)break t;if(p===n&&++c===r&&(a=o),p===s&&++h===i&&(l=o),(g=d.nextSibling)!==null)break;d=p,p=d.parentNode}d=g}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(ld={focusedElem:t,selectionRange:n},yl=!1,Ee=e;Ee!==null;)if(e=Ee,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,Ee=t;else for(;Ee!==null;){e=Ee;try{var x=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var y=x.memoizedProps,m=x.memoizedState,u=e.stateNode,_=u.getSnapshotBeforeUpdate(e.elementType===e.type?y:Fn(e.type,y),m);u.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var v=e.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ce(163))}}catch(S){Mt(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,Ee=t;break}Ee=e.return}return x=fp,fp=!1,x}function Ro(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&wd(e,n,s)}r=r.next}while(r!==i)}}function rc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Td(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function _v(t){var e=t.alternate;e!==null&&(t.alternate=null,_v(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Qn],delete e[Go],delete e[dd],delete e[Py],delete e[Ly])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function yv(t){return t.tag===5||t.tag===3||t.tag===4}function hp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||yv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Cd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=El));else if(i!==4&&(t=t.child,t!==null))for(Cd(t,e,n),t=t.sibling;t!==null;)Cd(t,e,n),t=t.sibling}function Ad(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Ad(t,e,n),t=t.sibling;t!==null;)Ad(t,e,n),t=t.sibling}var kt=null,kn=!1;function Ci(t,e,n){for(n=n.child;n!==null;)Sv(t,e,n),n=n.sibling}function Sv(t,e,n){if(ti&&typeof ti.onCommitFiberUnmount=="function")try{ti.onCommitFiberUnmount(Kl,n)}catch{}switch(n.tag){case 5:$t||Ms(n,e);case 6:var i=kt,r=kn;kt=null,Ci(t,e,n),kt=i,kn=r,kt!==null&&(kn?(t=kt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):kt.removeChild(n.stateNode));break;case 18:kt!==null&&(kn?(t=kt,n=n.stateNode,t.nodeType===8?Bc(t.parentNode,n):t.nodeType===1&&Bc(t,n),zo(t)):Bc(kt,n.stateNode));break;case 4:i=kt,r=kn,kt=n.stateNode.containerInfo,kn=!0,Ci(t,e,n),kt=i,kn=r;break;case 0:case 11:case 14:case 15:if(!$t&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&wd(n,e,o),r=r.next}while(r!==i)}Ci(t,e,n);break;case 1:if(!$t&&(Ms(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){Mt(n,e,a)}Ci(t,e,n);break;case 21:Ci(t,e,n);break;case 22:n.mode&1?($t=(i=$t)||n.memoizedState!==null,Ci(t,e,n),$t=i):Ci(t,e,n);break;default:Ci(t,e,n)}}function pp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new $y),e.forEach(function(i){var r=i1.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Dn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:kt=a.stateNode,kn=!1;break e;case 3:kt=a.stateNode.containerInfo,kn=!0;break e;case 4:kt=a.stateNode.containerInfo,kn=!0;break e}a=a.return}if(kt===null)throw Error(ce(160));Sv(s,o,r),kt=null,kn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Mt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Mv(e,t),e=e.sibling}function Mv(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Dn(e,t),$n(t),i&4){try{Ro(3,t,t.return),rc(3,t)}catch(y){Mt(t,t.return,y)}try{Ro(5,t,t.return)}catch(y){Mt(t,t.return,y)}}break;case 1:Dn(e,t),$n(t),i&512&&n!==null&&Ms(n,n.return);break;case 5:if(Dn(e,t),$n(t),i&512&&n!==null&&Ms(n,n.return),t.flags&32){var r=t.stateNode;try{Uo(r,"")}catch(y){Mt(t,t.return,y)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Gg(r,s),Zu(a,o);var c=Zu(a,s);for(o=0;o<l.length;o+=2){var h=l[o],d=l[o+1];h==="style"?qg(r,d):h==="dangerouslySetInnerHTML"?$g(r,d):h==="children"?Uo(r,d):tf(r,h,d,c)}switch(a){case"input":Xu(r,s);break;case"textarea":Wg(r,s);break;case"select":var p=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var g=s.value;g!=null?Cs(r,!!s.multiple,g,!1):p!==!!s.multiple&&(s.defaultValue!=null?Cs(r,!!s.multiple,s.defaultValue,!0):Cs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Go]=s}catch(y){Mt(t,t.return,y)}}break;case 6:if(Dn(e,t),$n(t),i&4){if(t.stateNode===null)throw Error(ce(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(y){Mt(t,t.return,y)}}break;case 3:if(Dn(e,t),$n(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{zo(e.containerInfo)}catch(y){Mt(t,t.return,y)}break;case 4:Dn(e,t),$n(t);break;case 13:Dn(e,t),$n(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Uf=Tt())),i&4&&pp(t);break;case 22:if(h=n!==null&&n.memoizedState!==null,t.mode&1?($t=(c=$t)||h,Dn(e,t),$t=c):Dn(e,t),$n(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!h&&t.mode&1)for(Ee=t,h=t.child;h!==null;){for(d=Ee=h;Ee!==null;){switch(p=Ee,g=p.child,p.tag){case 0:case 11:case 14:case 15:Ro(4,p,p.return);break;case 1:Ms(p,p.return);var x=p.stateNode;if(typeof x.componentWillUnmount=="function"){i=p,n=p.return;try{e=i,x.props=e.memoizedProps,x.state=e.memoizedState,x.componentWillUnmount()}catch(y){Mt(i,n,y)}}break;case 5:Ms(p,p.return);break;case 22:if(p.memoizedState!==null){gp(d);continue}}g!==null?(g.return=p,Ee=g):gp(d)}h=h.sibling}e:for(h=null,d=t;;){if(d.tag===5){if(h===null){h=d;try{r=d.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=d.stateNode,l=d.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Yg("display",o))}catch(y){Mt(t,t.return,y)}}}else if(d.tag===6){if(h===null)try{d.stateNode.nodeValue=c?"":d.memoizedProps}catch(y){Mt(t,t.return,y)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===t)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===t)break e;for(;d.sibling===null;){if(d.return===null||d.return===t)break e;h===d&&(h=null),d=d.return}h===d&&(h=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:Dn(e,t),$n(t),i&4&&pp(t);break;case 21:break;default:Dn(e,t),$n(t)}}function $n(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(yv(n)){var i=n;break e}n=n.return}throw Error(ce(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Uo(r,""),i.flags&=-33);var s=hp(t);Ad(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=hp(t);Cd(t,a,o);break;default:throw Error(ce(161))}}catch(l){Mt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function qy(t,e,n){Ee=t,Ev(t)}function Ev(t,e,n){for(var i=(t.mode&1)!==0;Ee!==null;){var r=Ee,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Aa;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||$t;a=Aa;var c=$t;if(Aa=o,($t=l)&&!c)for(Ee=r;Ee!==null;)o=Ee,l=o.child,o.tag===22&&o.memoizedState!==null?vp(r):l!==null?(l.return=o,Ee=l):vp(r);for(;s!==null;)Ee=s,Ev(s),s=s.sibling;Ee=r,Aa=a,$t=c}mp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,Ee=s):mp(t)}}function mp(t){for(;Ee!==null;){var e=Ee;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:$t||rc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!$t)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Fn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Qh(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Qh(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var h=c.memoizedState;if(h!==null){var d=h.dehydrated;d!==null&&zo(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ce(163))}$t||e.flags&512&&Td(e)}catch(p){Mt(e,e.return,p)}}if(e===t){Ee=null;break}if(n=e.sibling,n!==null){n.return=e.return,Ee=n;break}Ee=e.return}}function gp(t){for(;Ee!==null;){var e=Ee;if(e===t){Ee=null;break}var n=e.sibling;if(n!==null){n.return=e.return,Ee=n;break}Ee=e.return}}function vp(t){for(;Ee!==null;){var e=Ee;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{rc(4,e)}catch(l){Mt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Mt(e,r,l)}}var s=e.return;try{Td(e)}catch(l){Mt(e,s,l)}break;case 5:var o=e.return;try{Td(e)}catch(l){Mt(e,o,l)}}}catch(l){Mt(e,e.return,l)}if(e===t){Ee=null;break}var a=e.sibling;if(a!==null){a.return=e.return,Ee=a;break}Ee=e.return}}var Ky=Math.ceil,Il=wi.ReactCurrentDispatcher,Df=wi.ReactCurrentOwner,Pn=wi.ReactCurrentBatchConfig,Qe=0,Ft=null,At=null,zt=0,vn=0,Es=lr(0),Rt=0,Ko=null,kr=0,sc=0,If=0,Po=null,sn=null,Uf=0,js=1/0,fi=null,Ul=!1,bd=null,Ki=null,ba=!1,Vi=null,Ol=0,Lo=0,Rd=null,ul=-1,dl=0;function Qt(){return Qe&6?Tt():ul!==-1?ul:ul=Tt()}function Zi(t){return t.mode&1?Qe&2&&zt!==0?zt&-zt:Dy.transition!==null?(dl===0&&(dl=a0()),dl):(t=nt,t!==0||(t=window.event,t=t===void 0?16:p0(t.type)),t):1}function Gn(t,e,n,i){if(50<Lo)throw Lo=0,Rd=null,Error(ce(185));ta(t,n,i),(!(Qe&2)||t!==Ft)&&(t===Ft&&(!(Qe&2)&&(sc|=n),Rt===4&&zi(t,zt)),un(t,i),n===1&&Qe===0&&!(e.mode&1)&&(js=Tt()+500,tc&&cr()))}function un(t,e){var n=t.callbackNode;D_(t,e);var i=_l(t,t===Ft?zt:0);if(i===0)n!==null&&Ch(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Ch(n),e===1)t.tag===0?Ny(xp.bind(null,t)):D0(xp.bind(null,t)),by(function(){!(Qe&6)&&cr()}),n=null;else{switch(l0(i)){case 1:n=af;break;case 4:n=s0;break;case 16:n=xl;break;case 536870912:n=o0;break;default:n=xl}n=Lv(n,wv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function wv(t,e){if(ul=-1,dl=0,Qe&6)throw Error(ce(327));var n=t.callbackNode;if(Ls()&&t.callbackNode!==n)return null;var i=_l(t,t===Ft?zt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Fl(t,i);else{e=i;var r=Qe;Qe|=2;var s=Cv();(Ft!==t||zt!==e)&&(fi=null,js=Tt()+500,Lr(t,e));do try{Qy();break}catch(a){Tv(t,a)}while(!0);yf(),Il.current=s,Qe=r,At!==null?e=0:(Ft=null,zt=0,e=Rt)}if(e!==0){if(e===2&&(r=nd(t),r!==0&&(i=r,e=Pd(t,r))),e===1)throw n=Ko,Lr(t,0),zi(t,i),un(t,Tt()),n;if(e===6)zi(t,i);else{if(r=t.current.alternate,!(i&30)&&!Zy(r)&&(e=Fl(t,i),e===2&&(s=nd(t),s!==0&&(i=s,e=Pd(t,s))),e===1))throw n=Ko,Lr(t,0),zi(t,i),un(t,Tt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ce(345));case 2:Mr(t,sn,fi);break;case 3:if(zi(t,i),(i&130023424)===i&&(e=Uf+500-Tt(),10<e)){if(_l(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){Qt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=ud(Mr.bind(null,t,sn,fi),e);break}Mr(t,sn,fi);break;case 4:if(zi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-Hn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=Tt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Ky(i/1960))-i,10<i){t.timeoutHandle=ud(Mr.bind(null,t,sn,fi),i);break}Mr(t,sn,fi);break;case 5:Mr(t,sn,fi);break;default:throw Error(ce(329))}}}return un(t,Tt()),t.callbackNode===n?wv.bind(null,t):null}function Pd(t,e){var n=Po;return t.current.memoizedState.isDehydrated&&(Lr(t,e).flags|=256),t=Fl(t,e),t!==2&&(e=sn,sn=n,e!==null&&Ld(e)),t}function Ld(t){sn===null?sn=t:sn.push.apply(sn,t)}function Zy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Wn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function zi(t,e){for(e&=~If,e&=~sc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Hn(e),i=1<<n;t[n]=-1,e&=~i}}function xp(t){if(Qe&6)throw Error(ce(327));Ls();var e=_l(t,0);if(!(e&1))return un(t,Tt()),null;var n=Fl(t,e);if(t.tag!==0&&n===2){var i=nd(t);i!==0&&(e=i,n=Pd(t,i))}if(n===1)throw n=Ko,Lr(t,0),zi(t,e),un(t,Tt()),n;if(n===6)throw Error(ce(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Mr(t,sn,fi),un(t,Tt()),null}function Of(t,e){var n=Qe;Qe|=1;try{return t(e)}finally{Qe=n,Qe===0&&(js=Tt()+500,tc&&cr())}}function zr(t){Vi!==null&&Vi.tag===0&&!(Qe&6)&&Ls();var e=Qe;Qe|=1;var n=Pn.transition,i=nt;try{if(Pn.transition=null,nt=1,t)return t()}finally{nt=i,Pn.transition=n,Qe=e,!(Qe&6)&&cr()}}function Ff(){vn=Es.current,ut(Es)}function Lr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,Ay(n)),At!==null)for(n=At.return;n!==null;){var i=n;switch(vf(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&wl();break;case 3:zs(),ut(ln),ut(qt),Cf();break;case 5:Tf(i);break;case 4:zs();break;case 13:ut(gt);break;case 19:ut(gt);break;case 10:Sf(i.type._context);break;case 22:case 23:Ff()}n=n.return}if(Ft=t,At=t=Ji(t.current,null),zt=vn=e,Rt=0,Ko=null,If=sc=kr=0,sn=Po=null,br!==null){for(e=0;e<br.length;e++)if(n=br[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}br=null}return t}function Tv(t,e){do{var n=At;try{if(yf(),al.current=Dl,Nl){for(var i=vt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Nl=!1}if(Fr=0,Ut=bt=vt=null,bo=!1,$o=0,Df.current=null,n===null||n.return===null){Rt=1,Ko=e,At=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=zt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,h=a,d=h.tag;if(!(h.mode&1)&&(d===0||d===11||d===15)){var p=h.alternate;p?(h.updateQueue=p.updateQueue,h.memoizedState=p.memoizedState,h.lanes=p.lanes):(h.updateQueue=null,h.memoizedState=null)}var g=sp(o);if(g!==null){g.flags&=-257,op(g,o,a,s,e),g.mode&1&&rp(s,c,e),e=g,l=c;var x=e.updateQueue;if(x===null){var y=new Set;y.add(l),e.updateQueue=y}else x.add(l);break e}else{if(!(e&1)){rp(s,c,e),kf();break e}l=Error(ce(426))}}else if(ft&&a.mode&1){var m=sp(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),op(m,o,a,s,e),xf(Bs(l,a));break e}}s=l=Bs(l,a),Rt!==4&&(Rt=2),Po===null?Po=[s]:Po.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=lv(s,l,e);Jh(s,u);break e;case 1:a=l;var _=s.type,v=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(Ki===null||!Ki.has(v)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=cv(s,a,e);Jh(s,S);break e}}s=s.return}while(s!==null)}bv(n)}catch(b){e=b,At===n&&n!==null&&(At=n=n.return);continue}break}while(!0)}function Cv(){var t=Il.current;return Il.current=Dl,t===null?Dl:t}function kf(){(Rt===0||Rt===3||Rt===2)&&(Rt=4),Ft===null||!(kr&268435455)&&!(sc&268435455)||zi(Ft,zt)}function Fl(t,e){var n=Qe;Qe|=2;var i=Cv();(Ft!==t||zt!==e)&&(fi=null,Lr(t,e));do try{Jy();break}catch(r){Tv(t,r)}while(!0);if(yf(),Qe=n,Il.current=i,At!==null)throw Error(ce(261));return Ft=null,zt=0,Rt}function Jy(){for(;At!==null;)Av(At)}function Qy(){for(;At!==null&&!w_();)Av(At)}function Av(t){var e=Pv(t.alternate,t,vn);t.memoizedProps=t.pendingProps,e===null?bv(t):At=e,Df.current=null}function bv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Xy(n,e),n!==null){n.flags&=32767,At=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Rt=6,At=null;return}}else if(n=Wy(n,e,vn),n!==null){At=n;return}if(e=e.sibling,e!==null){At=e;return}At=e=t}while(e!==null);Rt===0&&(Rt=5)}function Mr(t,e,n){var i=nt,r=Pn.transition;try{Pn.transition=null,nt=1,e1(t,e,n,i)}finally{Pn.transition=r,nt=i}return null}function e1(t,e,n,i){do Ls();while(Vi!==null);if(Qe&6)throw Error(ce(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ce(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(I_(t,s),t===Ft&&(At=Ft=null,zt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ba||(ba=!0,Lv(xl,function(){return Ls(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Pn.transition,Pn.transition=null;var o=nt;nt=1;var a=Qe;Qe|=4,Df.current=null,Yy(t,n),Mv(n,t),yy(ld),yl=!!ad,ld=ad=null,t.current=n,qy(n),T_(),Qe=a,nt=o,Pn.transition=s}else t.current=n;if(ba&&(ba=!1,Vi=t,Ol=r),s=t.pendingLanes,s===0&&(Ki=null),b_(n.stateNode),un(t,Tt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Ul)throw Ul=!1,t=bd,bd=null,t;return Ol&1&&t.tag!==0&&Ls(),s=t.pendingLanes,s&1?t===Rd?Lo++:(Lo=0,Rd=t):Lo=0,cr(),null}function Ls(){if(Vi!==null){var t=l0(Ol),e=Pn.transition,n=nt;try{if(Pn.transition=null,nt=16>t?16:t,Vi===null)var i=!1;else{if(t=Vi,Vi=null,Ol=0,Qe&6)throw Error(ce(331));var r=Qe;for(Qe|=4,Ee=t.current;Ee!==null;){var s=Ee,o=s.child;if(Ee.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(Ee=c;Ee!==null;){var h=Ee;switch(h.tag){case 0:case 11:case 15:Ro(8,h,s)}var d=h.child;if(d!==null)d.return=h,Ee=d;else for(;Ee!==null;){h=Ee;var p=h.sibling,g=h.return;if(_v(h),h===c){Ee=null;break}if(p!==null){p.return=g,Ee=p;break}Ee=g}}}var x=s.alternate;if(x!==null){var y=x.child;if(y!==null){x.child=null;do{var m=y.sibling;y.sibling=null,y=m}while(y!==null)}}Ee=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,Ee=o;else e:for(;Ee!==null;){if(s=Ee,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Ro(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,Ee=u;break e}Ee=s.return}}var _=t.current;for(Ee=_;Ee!==null;){o=Ee;var v=o.child;if(o.subtreeFlags&2064&&v!==null)v.return=o,Ee=v;else e:for(o=_;Ee!==null;){if(a=Ee,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:rc(9,a)}}catch(b){Mt(a,a.return,b)}if(a===o){Ee=null;break e}var S=a.sibling;if(S!==null){S.return=a.return,Ee=S;break e}Ee=a.return}}if(Qe=r,cr(),ti&&typeof ti.onPostCommitFiberRoot=="function")try{ti.onPostCommitFiberRoot(Kl,t)}catch{}i=!0}return i}finally{nt=n,Pn.transition=e}}return!1}function _p(t,e,n){e=Bs(n,e),e=lv(t,e,1),t=qi(t,e,1),e=Qt(),t!==null&&(ta(t,1,e),un(t,e))}function Mt(t,e,n){if(t.tag===3)_p(t,t,n);else for(;e!==null;){if(e.tag===3){_p(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ki===null||!Ki.has(i))){t=Bs(n,t),t=cv(e,t,1),e=qi(e,t,1),t=Qt(),e!==null&&(ta(e,1,t),un(e,t));break}}e=e.return}}function t1(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=Qt(),t.pingedLanes|=t.suspendedLanes&n,Ft===t&&(zt&n)===n&&(Rt===4||Rt===3&&(zt&130023424)===zt&&500>Tt()-Uf?Lr(t,0):If|=n),un(t,e)}function Rv(t,e){e===0&&(t.mode&1?(e=xa,xa<<=1,!(xa&130023424)&&(xa=4194304)):e=1);var n=Qt();t=Mi(t,e),t!==null&&(ta(t,e,n),un(t,n))}function n1(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Rv(t,n)}function i1(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ce(314))}i!==null&&i.delete(e),Rv(t,n)}var Pv;Pv=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||ln.current)on=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return on=!1,Gy(t,e,n);on=!!(t.flags&131072)}else on=!1,ft&&e.flags&1048576&&I0(e,Al,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;cl(t,e),t=e.pendingProps;var r=Os(e,qt.current);Ps(e,n),r=bf(null,e,i,t,r,n);var s=Rf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,cn(i)?(s=!0,Tl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Ef(e),r.updater=ic,e.stateNode=r,r._reactInternals=e,vd(e,i,t,n),e=yd(null,e,i,!0,s,n)):(e.tag=0,ft&&s&&gf(e),Zt(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(cl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=s1(i),t=Fn(i,t),r){case 0:e=_d(null,e,i,t,n);break e;case 1:e=cp(null,e,i,t,n);break e;case 11:e=ap(null,e,i,t,n);break e;case 14:e=lp(null,e,i,Fn(i.type,t),n);break e}throw Error(ce(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),_d(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),cp(t,e,i,r,n);case 3:e:{if(hv(e),t===null)throw Error(ce(387));i=e.pendingProps,s=e.memoizedState,r=s.element,B0(t,e),Pl(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Bs(Error(ce(423)),e),e=up(t,e,i,n,r);break e}else if(i!==r){r=Bs(Error(ce(424)),e),e=up(t,e,i,n,r);break e}else for(_n=Yi(e.stateNode.containerInfo.firstChild),yn=e,ft=!0,zn=null,n=k0(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Fs(),i===r){e=Ei(t,e,n);break e}Zt(t,e,i,n)}e=e.child}return e;case 5:return j0(e),t===null&&pd(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,cd(i,r)?o=null:s!==null&&cd(i,s)&&(e.flags|=32),fv(t,e),Zt(t,e,o,n),e.child;case 6:return t===null&&pd(e),null;case 13:return pv(t,e,n);case 4:return wf(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=ks(e,null,i,n):Zt(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),ap(t,e,i,r,n);case 7:return Zt(t,e,e.pendingProps,n),e.child;case 8:return Zt(t,e,e.pendingProps.children,n),e.child;case 12:return Zt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,st(bl,i._currentValue),i._currentValue=o,s!==null)if(Wn(s.value,o)){if(s.children===r.children&&!ln.current){e=Ei(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=_i(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var h=c.pending;h===null?l.next=l:(l.next=h.next,h.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),md(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ce(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),md(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Zt(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ps(e,n),r=Ln(r),i=i(r),e.flags|=1,Zt(t,e,i,n),e.child;case 14:return i=e.type,r=Fn(i,e.pendingProps),r=Fn(i.type,r),lp(t,e,i,r,n);case 15:return uv(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),cl(t,e),e.tag=1,cn(i)?(t=!0,Tl(e)):t=!1,Ps(e,n),av(e,i,r),vd(e,i,r,n),yd(null,e,i,!0,t,n);case 19:return mv(t,e,n);case 22:return dv(t,e,n)}throw Error(ce(156,e.tag))};function Lv(t,e){return r0(t,e)}function r1(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Rn(t,e,n,i){return new r1(t,e,n,i)}function zf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function s1(t){if(typeof t=="function")return zf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===rf)return 11;if(t===sf)return 14}return 2}function Ji(t,e){var n=t.alternate;return n===null?(n=Rn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function fl(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")zf(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case hs:return Nr(n.children,r,s,e);case nf:o=8,r|=8;break;case ju:return t=Rn(12,n,e,r|2),t.elementType=ju,t.lanes=s,t;case Vu:return t=Rn(13,n,e,r),t.elementType=Vu,t.lanes=s,t;case Hu:return t=Rn(19,n,e,r),t.elementType=Hu,t.lanes=s,t;case jg:return oc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case zg:o=10;break e;case Bg:o=9;break e;case rf:o=11;break e;case sf:o=14;break e;case Ii:o=16,i=null;break e}throw Error(ce(130,t==null?t:typeof t,""))}return e=Rn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Nr(t,e,n,i){return t=Rn(7,t,i,e),t.lanes=n,t}function oc(t,e,n,i){return t=Rn(22,t,i,e),t.elementType=jg,t.lanes=n,t.stateNode={isHidden:!1},t}function Yc(t,e,n){return t=Rn(6,t,null,e),t.lanes=n,t}function qc(t,e,n){return e=Rn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function o1(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Rc(0),this.expirationTimes=Rc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Rc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Bf(t,e,n,i,r,s,o,a,l){return t=new o1(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Rn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ef(s),t}function a1(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:fs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Nv(t){if(!t)return rr;t=t._reactInternals;e:{if(Gr(t)!==t||t.tag!==1)throw Error(ce(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(cn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ce(171))}if(t.tag===1){var n=t.type;if(cn(n))return N0(t,n,e)}return e}function Dv(t,e,n,i,r,s,o,a,l){return t=Bf(n,i,!0,t,r,s,o,a,l),t.context=Nv(null),n=t.current,i=Qt(),r=Zi(n),s=_i(i,r),s.callback=e??null,qi(n,s,r),t.current.lanes=r,ta(t,r,i),un(t,i),t}function ac(t,e,n,i){var r=e.current,s=Qt(),o=Zi(r);return n=Nv(n),e.context===null?e.context=n:e.pendingContext=n,e=_i(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=qi(r,e,o),t!==null&&(Gn(t,r,o,s),ol(t,r,o)),o}function kl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function yp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function jf(t,e){yp(t,e),(t=t.alternate)&&yp(t,e)}function l1(){return null}var Iv=typeof reportError=="function"?reportError:function(t){console.error(t)};function Vf(t){this._internalRoot=t}lc.prototype.render=Vf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ce(409));ac(t,e,null,null)};lc.prototype.unmount=Vf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;zr(function(){ac(null,t,null,null)}),e[Si]=null}};function lc(t){this._internalRoot=t}lc.prototype.unstable_scheduleHydration=function(t){if(t){var e=d0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<ki.length&&e!==0&&e<ki[n].priority;n++);ki.splice(n,0,t),n===0&&h0(t)}};function Hf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function cc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Sp(){}function c1(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=kl(o);s.call(c)}}var o=Dv(e,i,t,0,null,!1,!1,"",Sp);return t._reactRootContainer=o,t[Si]=o.current,Vo(t.nodeType===8?t.parentNode:t),zr(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=kl(l);a.call(c)}}var l=Bf(t,0,!1,null,null,!1,!1,"",Sp);return t._reactRootContainer=l,t[Si]=l.current,Vo(t.nodeType===8?t.parentNode:t),zr(function(){ac(e,l,n,i)}),l}function uc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=kl(o);a.call(l)}}ac(e,o,t,r)}else o=c1(n,e,t,r,i);return kl(o)}c0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=So(e.pendingLanes);n!==0&&(lf(e,n|1),un(e,Tt()),!(Qe&6)&&(js=Tt()+500,cr()))}break;case 13:zr(function(){var i=Mi(t,1);if(i!==null){var r=Qt();Gn(i,t,1,r)}}),jf(t,1)}};cf=function(t){if(t.tag===13){var e=Mi(t,134217728);if(e!==null){var n=Qt();Gn(e,t,134217728,n)}jf(t,134217728)}};u0=function(t){if(t.tag===13){var e=Zi(t),n=Mi(t,e);if(n!==null){var i=Qt();Gn(n,t,e,i)}jf(t,e)}};d0=function(){return nt};f0=function(t,e){var n=nt;try{return nt=t,e()}finally{nt=n}};Qu=function(t,e,n){switch(e){case"input":if(Xu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=ec(i);if(!r)throw Error(ce(90));Hg(i),Xu(i,r)}}}break;case"textarea":Wg(t,n);break;case"select":e=n.value,e!=null&&Cs(t,!!n.multiple,e,!1)}};Jg=Of;Qg=zr;var u1={usingClientEntryPoint:!1,Events:[ia,vs,ec,Kg,Zg,Of]},lo={findFiberByHostInstance:Ar,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},d1={bundleType:lo.bundleType,version:lo.version,rendererPackageName:lo.rendererPackageName,rendererConfig:lo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:wi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=n0(t),t===null?null:t.stateNode},findFiberByHostInstance:lo.findFiberByHostInstance||l1,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ra=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ra.isDisabled&&Ra.supportsFiber)try{Kl=Ra.inject(d1),ti=Ra}catch{}}Mn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=u1;Mn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Hf(e))throw Error(ce(200));return a1(t,e,null,n)};Mn.createRoot=function(t,e){if(!Hf(t))throw Error(ce(299));var n=!1,i="",r=Iv;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Bf(t,1,!1,null,null,n,!1,i,r),t[Si]=e.current,Vo(t.nodeType===8?t.parentNode:t),new Vf(e)};Mn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ce(188)):(t=Object.keys(t).join(","),Error(ce(268,t)));return t=n0(e),t=t===null?null:t.stateNode,t};Mn.flushSync=function(t){return zr(t)};Mn.hydrate=function(t,e,n){if(!cc(e))throw Error(ce(200));return uc(null,t,e,!0,n)};Mn.hydrateRoot=function(t,e,n){if(!Hf(t))throw Error(ce(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=Iv;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=Dv(e,null,t,1,n??null,r,!1,s,o),t[Si]=e.current,Vo(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new lc(e)};Mn.render=function(t,e,n){if(!cc(e))throw Error(ce(200));return uc(null,t,e,!1,n)};Mn.unmountComponentAtNode=function(t){if(!cc(t))throw Error(ce(40));return t._reactRootContainer?(zr(function(){uc(null,null,t,!1,function(){t._reactRootContainer=null,t[Si]=null})}),!0):!1};Mn.unstable_batchedUpdates=Of;Mn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!cc(n))throw Error(ce(200));if(t==null||t._reactInternals===void 0)throw Error(ce(38));return uc(t,e,n,!1,i)};Mn.version="18.3.1-next-f1338f8080-20240426";function Uv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Uv)}catch(t){console.error(t)}}Uv(),Ug.exports=Mn;var f1=Ug.exports,Mp=f1;zu.createRoot=Mp.createRoot,zu.hydrateRoot=Mp.hydrateRoot;/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Zo(){return Zo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},Zo.apply(null,arguments)}var Hi;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(Hi||(Hi={}));const Ep="popstate";function h1(t){t===void 0&&(t={});function e(i,r){let{pathname:s,search:o,hash:a}=i.location;return Nd("",{pathname:s,search:o,hash:a},r.state&&r.state.usr||null,r.state&&r.state.key||"default")}function n(i,r){return typeof r=="string"?r:zl(r)}return m1(e,n,null,t)}function Et(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function Ov(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function p1(){return Math.random().toString(36).substr(2,8)}function wp(t,e){return{usr:t.state,key:t.key,idx:e}}function Nd(t,e,n,i){return n===void 0&&(n=null),Zo({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?Js(e):e,{state:n,key:e&&e.key||i||p1()})}function zl(t){let{pathname:e="/",search:n="",hash:i=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),i&&i!=="#"&&(e+=i.charAt(0)==="#"?i:"#"+i),e}function Js(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let i=t.indexOf("?");i>=0&&(e.search=t.substr(i),t=t.substr(0,i)),t&&(e.pathname=t)}return e}function m1(t,e,n,i){i===void 0&&(i={});let{window:r=document.defaultView,v5Compat:s=!1}=i,o=r.history,a=Hi.Pop,l=null,c=h();c==null&&(c=0,o.replaceState(Zo({},o.state,{idx:c}),""));function h(){return(o.state||{idx:null}).idx}function d(){a=Hi.Pop;let m=h(),u=m==null?null:m-c;c=m,l&&l({action:a,location:y.location,delta:u})}function p(m,u){a=Hi.Push;let _=Nd(y.location,m,u);c=h()+1;let v=wp(_,c),S=y.createHref(_);try{o.pushState(v,"",S)}catch(b){if(b instanceof DOMException&&b.name==="DataCloneError")throw b;r.location.assign(S)}s&&l&&l({action:a,location:y.location,delta:1})}function g(m,u){a=Hi.Replace;let _=Nd(y.location,m,u);c=h();let v=wp(_,c),S=y.createHref(_);o.replaceState(v,"",S),s&&l&&l({action:a,location:y.location,delta:0})}function x(m){let u=r.location.origin!=="null"?r.location.origin:r.location.href,_=typeof m=="string"?m:zl(m);return _=_.replace(/ $/,"%20"),Et(u,"No window.location.(origin|href) available to create URL for href: "+_),new URL(_,u)}let y={get action(){return a},get location(){return t(r,o)},listen(m){if(l)throw new Error("A history only accepts one active listener");return r.addEventListener(Ep,d),l=m,()=>{r.removeEventListener(Ep,d),l=null}},createHref(m){return e(r,m)},createURL:x,encodeLocation(m){let u=x(m);return{pathname:u.pathname,search:u.search,hash:u.hash}},push:p,replace:g,go(m){return o.go(m)}};return y}var Tp;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(Tp||(Tp={}));function g1(t,e,n){return n===void 0&&(n="/"),v1(t,e,n)}function v1(t,e,n,i){let r=typeof e=="string"?Js(e):e,s=Vs(r.pathname||"/",n);if(s==null)return null;let o=Fv(t);x1(o);let a=null,l=R1(s);for(let c=0;a==null&&c<o.length;++c)a=A1(o[c],l);return a}function Fv(t,e,n,i){e===void 0&&(e=[]),n===void 0&&(n=[]),i===void 0&&(i="");let r=(s,o,a)=>{let l={relativePath:a===void 0?s.path||"":a,caseSensitive:s.caseSensitive===!0,childrenIndex:o,route:s};l.relativePath.startsWith("/")&&(Et(l.relativePath.startsWith(i),'Absolute route path "'+l.relativePath+'" nested under path '+('"'+i+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),l.relativePath=l.relativePath.slice(i.length));let c=Qi([i,l.relativePath]),h=n.concat(l);s.children&&s.children.length>0&&(Et(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+c+'".')),Fv(s.children,e,h,c)),!(s.path==null&&!s.index)&&e.push({path:c,score:T1(c,s.index),routesMeta:h})};return t.forEach((s,o)=>{var a;if(s.path===""||!((a=s.path)!=null&&a.includes("?")))r(s,o);else for(let l of kv(s.path))r(s,o,l)}),e}function kv(t){let e=t.split("/");if(e.length===0)return[];let[n,...i]=e,r=n.endsWith("?"),s=n.replace(/\?$/,"");if(i.length===0)return r?[s,""]:[s];let o=kv(i.join("/")),a=[];return a.push(...o.map(l=>l===""?s:[s,l].join("/"))),r&&a.push(...o),a.map(l=>t.startsWith("/")&&l===""?"/":l)}function x1(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:C1(e.routesMeta.map(i=>i.childrenIndex),n.routesMeta.map(i=>i.childrenIndex)))}const _1=/^:[\w-]+$/,y1=3,S1=2,M1=1,E1=10,w1=-2,Cp=t=>t==="*";function T1(t,e){let n=t.split("/"),i=n.length;return n.some(Cp)&&(i+=w1),e&&(i+=S1),n.filter(r=>!Cp(r)).reduce((r,s)=>r+(_1.test(s)?y1:s===""?M1:E1),i)}function C1(t,e){return t.length===e.length&&t.slice(0,-1).every((i,r)=>i===e[r])?t[t.length-1]-e[e.length-1]:0}function A1(t,e,n){let{routesMeta:i}=t,r={},s="/",o=[];for(let a=0;a<i.length;++a){let l=i[a],c=a===i.length-1,h=s==="/"?e:e.slice(s.length)||"/",d=Dd({path:l.relativePath,caseSensitive:l.caseSensitive,end:c},h),p=l.route;if(!d)return null;Object.assign(r,d.params),o.push({params:r,pathname:Qi([s,d.pathname]),pathnameBase:N1(Qi([s,d.pathnameBase])),route:p}),d.pathnameBase!=="/"&&(s=Qi([s,d.pathnameBase]))}return o}function Dd(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,i]=b1(t.path,t.caseSensitive,t.end),r=e.match(n);if(!r)return null;let s=r[0],o=s.replace(/(.)\/+$/,"$1"),a=r.slice(1);return{params:i.reduce((c,h,d)=>{let{paramName:p,isOptional:g}=h;if(p==="*"){let y=a[d]||"";o=s.slice(0,s.length-y.length).replace(/(.)\/+$/,"$1")}const x=a[d];return g&&!x?c[p]=void 0:c[p]=(x||"").replace(/%2F/g,"/"),c},{}),pathname:s,pathnameBase:o,pattern:t}}function b1(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),Ov(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let i=[],r="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,a,l)=>(i.push({paramName:a,isOptional:l!=null}),l?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(i.push({paramName:"*"}),r+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?r+="\\/*$":t!==""&&t!=="/"&&(r+="(?:(?=\\/|$))"),[new RegExp(r,e?void 0:"i"),i]}function R1(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return Ov(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function Vs(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,i=t.charAt(n);return i&&i!=="/"?null:t.slice(n)||"/"}function P1(t,e){e===void 0&&(e="/");let{pathname:n,search:i="",hash:r=""}=typeof t=="string"?Js(t):t,s;return n?(n=jv(n),n.startsWith("/")?s=Ap(n.substring(1),"/"):s=Ap(n,e)):s=e,{pathname:s,search:D1(i),hash:I1(r)}}function Ap(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(r=>{r===".."?n.length>1&&n.pop():r!=="."&&n.push(r)}),n.length>1?n.join("/"):"/"}function Kc(t,e,n,i){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(i)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function L1(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function zv(t,e){let n=L1(t);return e?n.map((i,r)=>r===n.length-1?i.pathname:i.pathnameBase):n.map(i=>i.pathnameBase)}function Bv(t,e,n,i){i===void 0&&(i=!1);let r;typeof t=="string"?r=Js(t):(r=Zo({},t),Et(!r.pathname||!r.pathname.includes("?"),Kc("?","pathname","search",r)),Et(!r.pathname||!r.pathname.includes("#"),Kc("#","pathname","hash",r)),Et(!r.search||!r.search.includes("#"),Kc("#","search","hash",r)));let s=t===""||r.pathname==="",o=s?"/":r.pathname,a;if(o==null)a=n;else{let d=e.length-1;if(!i&&o.startsWith("..")){let p=o.split("/");for(;p[0]==="..";)p.shift(),d-=1;r.pathname=p.join("/")}a=d>=0?e[d]:"/"}let l=P1(r,a),c=o&&o!=="/"&&o.endsWith("/"),h=(s||o===".")&&n.endsWith("/");return!l.pathname.endsWith("/")&&(c||h)&&(l.pathname+="/"),l}const jv=t=>t.replace(/\/\/+/g,"/"),Qi=t=>jv(t.join("/")),N1=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),D1=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,I1=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function U1(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const Vv=["post","put","patch","delete"];new Set(Vv);const O1=["get",...Vv];new Set(O1);/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Jo(){return Jo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},Jo.apply(null,arguments)}const dc=Q.createContext(null),Hv=Q.createContext(null),ur=Q.createContext(null),fc=Q.createContext(null),Wr=Q.createContext({outlet:null,matches:[],isDataRoute:!1}),Gv=Q.createContext(null);function F1(t,e){let{relative:n}=e===void 0?{}:e;sa()||Et(!1);let{basename:i,navigator:r}=Q.useContext(ur),{hash:s,pathname:o,search:a}=hc(t,{relative:n}),l=o;return i!=="/"&&(l=o==="/"?i:Qi([i,o])),r.createHref({pathname:l,search:a,hash:s})}function sa(){return Q.useContext(fc)!=null}function oa(){return sa()||Et(!1),Q.useContext(fc).location}function Wv(t){Q.useContext(ur).static||Q.useLayoutEffect(t)}function k1(){let{isDataRoute:t}=Q.useContext(Wr);return t?Z1():z1()}function z1(){sa()||Et(!1);let t=Q.useContext(dc),{basename:e,future:n,navigator:i}=Q.useContext(ur),{matches:r}=Q.useContext(Wr),{pathname:s}=oa(),o=JSON.stringify(zv(r,n.v7_relativeSplatPath)),a=Q.useRef(!1);return Wv(()=>{a.current=!0}),Q.useCallback(function(c,h){if(h===void 0&&(h={}),!a.current)return;if(typeof c=="number"){i.go(c);return}let d=Bv(c,JSON.parse(o),s,h.relative==="path");t==null&&e!=="/"&&(d.pathname=d.pathname==="/"?e:Qi([e,d.pathname])),(h.replace?i.replace:i.push)(d,h.state,h)},[e,i,o,s,t])}function hc(t,e){let{relative:n}=e===void 0?{}:e,{future:i}=Q.useContext(ur),{matches:r}=Q.useContext(Wr),{pathname:s}=oa(),o=JSON.stringify(zv(r,i.v7_relativeSplatPath));return Q.useMemo(()=>Bv(t,JSON.parse(o),s,n==="path"),[t,o,s,n])}function B1(t,e){return j1(t,e)}function j1(t,e,n,i){sa()||Et(!1);let{navigator:r}=Q.useContext(ur),{matches:s}=Q.useContext(Wr),o=s[s.length-1],a=o?o.params:{};o&&o.pathname;let l=o?o.pathnameBase:"/";o&&o.route;let c=oa(),h;if(e){var d;let m=typeof e=="string"?Js(e):e;l==="/"||(d=m.pathname)!=null&&d.startsWith(l)||Et(!1),h=m}else h=c;let p=h.pathname||"/",g=p;if(l!=="/"){let m=l.replace(/^\//,"").split("/");g="/"+p.replace(/^\//,"").split("/").slice(m.length).join("/")}let x=g1(t,{pathname:g}),y=X1(x&&x.map(m=>Object.assign({},m,{params:Object.assign({},a,m.params),pathname:Qi([l,r.encodeLocation?r.encodeLocation(m.pathname).pathname:m.pathname]),pathnameBase:m.pathnameBase==="/"?l:Qi([l,r.encodeLocation?r.encodeLocation(m.pathnameBase).pathname:m.pathnameBase])})),s,n,i);return e&&y?Q.createElement(fc.Provider,{value:{location:Jo({pathname:"/",search:"",hash:"",state:null,key:"default"},h),navigationType:Hi.Pop}},y):y}function V1(){let t=K1(),e=U1(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,r={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return Q.createElement(Q.Fragment,null,Q.createElement("h2",null,"Unexpected Application Error!"),Q.createElement("h3",{style:{fontStyle:"italic"}},e),n?Q.createElement("pre",{style:r},n):null,null)}const H1=Q.createElement(V1,null);class G1 extends Q.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?Q.createElement(Wr.Provider,{value:this.props.routeContext},Q.createElement(Gv.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function W1(t){let{routeContext:e,match:n,children:i}=t,r=Q.useContext(dc);return r&&r.static&&r.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=n.route.id),Q.createElement(Wr.Provider,{value:e},i)}function X1(t,e,n,i){var r;if(e===void 0&&(e=[]),n===void 0&&(n=null),i===void 0&&(i=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=i)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let o=t,a=(r=n)==null?void 0:r.errors;if(a!=null){let h=o.findIndex(d=>d.route.id&&(a==null?void 0:a[d.route.id])!==void 0);h>=0||Et(!1),o=o.slice(0,Math.min(o.length,h+1))}let l=!1,c=-1;if(n&&i&&i.v7_partialHydration)for(let h=0;h<o.length;h++){let d=o[h];if((d.route.HydrateFallback||d.route.hydrateFallbackElement)&&(c=h),d.route.id){let{loaderData:p,errors:g}=n,x=d.route.loader&&p[d.route.id]===void 0&&(!g||g[d.route.id]===void 0);if(d.route.lazy||x){l=!0,c>=0?o=o.slice(0,c+1):o=[o[0]];break}}}return o.reduceRight((h,d,p)=>{let g,x=!1,y=null,m=null;n&&(g=a&&d.route.id?a[d.route.id]:void 0,y=d.route.errorElement||H1,l&&(c<0&&p===0?(J1("route-fallback"),x=!0,m=null):c===p&&(x=!0,m=d.route.hydrateFallbackElement||null)));let u=e.concat(o.slice(0,p+1)),_=()=>{let v;return g?v=y:x?v=m:d.route.Component?v=Q.createElement(d.route.Component,null):d.route.element?v=d.route.element:v=h,Q.createElement(W1,{match:d,routeContext:{outlet:h,matches:u,isDataRoute:n!=null},children:v})};return n&&(d.route.ErrorBoundary||d.route.errorElement||p===0)?Q.createElement(G1,{location:n.location,revalidation:n.revalidation,component:y,error:g,children:_(),routeContext:{outlet:null,matches:u,isDataRoute:!0}}):_()},null)}var Xv=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(Xv||{}),$v=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}($v||{});function $1(t){let e=Q.useContext(dc);return e||Et(!1),e}function Y1(t){let e=Q.useContext(Hv);return e||Et(!1),e}function q1(t){let e=Q.useContext(Wr);return e||Et(!1),e}function Yv(t){let e=q1(),n=e.matches[e.matches.length-1];return n.route.id||Et(!1),n.route.id}function K1(){var t;let e=Q.useContext(Gv),n=Y1(),i=Yv();return e!==void 0?e:(t=n.errors)==null?void 0:t[i]}function Z1(){let{router:t}=$1(Xv.UseNavigateStable),e=Yv($v.UseNavigateStable),n=Q.useRef(!1);return Wv(()=>{n.current=!0}),Q.useCallback(function(r,s){s===void 0&&(s={}),n.current&&(typeof r=="number"?t.navigate(r):t.navigate(r,Jo({fromRouteId:e},s)))},[t,e])}const bp={};function J1(t,e,n){bp[t]||(bp[t]=!0)}function Q1(t,e){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function Di(t){Et(!1)}function eS(t){let{basename:e="/",children:n=null,location:i,navigationType:r=Hi.Pop,navigator:s,static:o=!1,future:a}=t;sa()&&Et(!1);let l=e.replace(/^\/*/,"/"),c=Q.useMemo(()=>({basename:l,navigator:s,static:o,future:Jo({v7_relativeSplatPath:!1},a)}),[l,a,s,o]);typeof i=="string"&&(i=Js(i));let{pathname:h="/",search:d="",hash:p="",state:g=null,key:x="default"}=i,y=Q.useMemo(()=>{let m=Vs(h,l);return m==null?null:{location:{pathname:m,search:d,hash:p,state:g,key:x},navigationType:r}},[l,h,d,p,g,x,r]);return y==null?null:Q.createElement(ur.Provider,{value:c},Q.createElement(fc.Provider,{children:n,value:y}))}function tS(t){let{children:e,location:n}=t;return B1(Id(e),n)}new Promise(()=>{});function Id(t,e){e===void 0&&(e=[]);let n=[];return Q.Children.forEach(t,(i,r)=>{if(!Q.isValidElement(i))return;let s=[...e,r];if(i.type===Q.Fragment){n.push.apply(n,Id(i.props.children,s));return}i.type!==Di&&Et(!1),!i.props.index||!i.props.children||Et(!1);let o={id:i.props.id||s.join("-"),caseSensitive:i.props.caseSensitive,element:i.props.element,Component:i.props.Component,index:i.props.index,path:i.props.path,loader:i.props.loader,action:i.props.action,errorElement:i.props.errorElement,ErrorBoundary:i.props.ErrorBoundary,hasErrorBoundary:i.props.ErrorBoundary!=null||i.props.errorElement!=null,shouldRevalidate:i.props.shouldRevalidate,handle:i.props.handle,lazy:i.props.lazy};i.props.children&&(o.children=Id(i.props.children,s)),n.push(o)}),n}/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Bl(){return Bl=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},Bl.apply(null,arguments)}function qv(t,e){if(t==null)return{};var n={};for(var i in t)if({}.hasOwnProperty.call(t,i)){if(e.indexOf(i)!==-1)continue;n[i]=t[i]}return n}function nS(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function iS(t,e){return t.button===0&&(!e||e==="_self")&&!nS(t)}const rS=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],sS=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],oS="6";try{window.__reactRouterVersion=oS}catch{}const aS=Q.createContext({isTransitioning:!1}),lS="startTransition",Rp=t_[lS];function cS(t){let{basename:e,children:n,future:i,window:r}=t,s=Q.useRef();s.current==null&&(s.current=h1({window:r,v5Compat:!0}));let o=s.current,[a,l]=Q.useState({action:o.action,location:o.location}),{v7_startTransition:c}=i||{},h=Q.useCallback(d=>{c&&Rp?Rp(()=>l(d)):l(d)},[l,c]);return Q.useLayoutEffect(()=>o.listen(h),[o,h]),Q.useEffect(()=>Q1(i),[i]),Q.createElement(eS,{basename:e,children:n,location:a.location,navigationType:a.action,navigator:o,future:i})}const uS=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",dS=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Er=Q.forwardRef(function(e,n){let{onClick:i,relative:r,reloadDocument:s,replace:o,state:a,target:l,to:c,preventScrollReset:h,viewTransition:d}=e,p=qv(e,rS),{basename:g}=Q.useContext(ur),x,y=!1;if(typeof c=="string"&&dS.test(c)&&(x=c,uS))try{let v=new URL(window.location.href),S=c.startsWith("//")?new URL(v.protocol+c):new URL(c),b=Vs(S.pathname,g);S.origin===v.origin&&b!=null?c=b+S.search+S.hash:y=!0}catch{}let m=F1(c,{relative:r}),u=hS(c,{replace:o,state:a,target:l,preventScrollReset:h,relative:r,viewTransition:d});function _(v){i&&i(v),v.defaultPrevented||u(v)}return Q.createElement("a",Bl({},p,{href:x||m,onClick:y||s?i:_,ref:n,target:l}))}),Pp=Q.forwardRef(function(e,n){let{"aria-current":i="page",caseSensitive:r=!1,className:s="",end:o=!1,style:a,to:l,viewTransition:c,children:h}=e,d=qv(e,sS),p=hc(l,{relative:d.relative}),g=oa(),x=Q.useContext(Hv),{navigator:y,basename:m}=Q.useContext(ur),u=x!=null&&pS(p)&&c===!0,_=y.encodeLocation?y.encodeLocation(p).pathname:p.pathname,v=g.pathname,S=x&&x.navigation&&x.navigation.location?x.navigation.location.pathname:null;r||(v=v.toLowerCase(),S=S?S.toLowerCase():null,_=_.toLowerCase()),S&&m&&(S=Vs(S,m)||S);const b=_!=="/"&&_.endsWith("/")?_.length-1:_.length;let A=v===_||!o&&v.startsWith(_)&&v.charAt(b)==="/",w=S!=null&&(S===_||!o&&S.startsWith(_)&&S.charAt(_.length)==="/"),N={isActive:A,isPending:w,isTransitioning:u},q=A?i:void 0,M;typeof s=="function"?M=s(N):M=[s,A?"active":null,w?"pending":null,u?"transitioning":null].filter(Boolean).join(" ");let R=typeof a=="function"?a(N):a;return Q.createElement(Er,Bl({},d,{"aria-current":q,className:M,ref:n,style:R,to:l,viewTransition:c}),typeof h=="function"?h(N):h)});var Ud;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(Ud||(Ud={}));var Lp;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(Lp||(Lp={}));function fS(t){let e=Q.useContext(dc);return e||Et(!1),e}function hS(t,e){let{target:n,replace:i,state:r,preventScrollReset:s,relative:o,viewTransition:a}=e===void 0?{}:e,l=k1(),c=oa(),h=hc(t,{relative:o});return Q.useCallback(d=>{if(iS(d,n)){d.preventDefault();let p=i!==void 0?i:zl(c)===zl(h);l(t,{replace:p,state:r,preventScrollReset:s,relative:o,viewTransition:a})}},[c,l,h,i,r,n,t,s,o,a])}function pS(t,e){e===void 0&&(e={});let n=Q.useContext(aS);n==null&&Et(!1);let{basename:i}=fS(Ud.useViewTransitionState),r=hc(t,{relative:e.relative});if(!n.isTransitioning)return!1;let s=Vs(n.currentLocation.pathname,i)||n.currentLocation.pathname,o=Vs(n.nextLocation.pathname,i)||n.nextLocation.pathname;return Dd(r.pathname,o)!=null||Dd(r.pathname,s)!=null}/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var mS={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gS=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),Ze=(t,e)=>{const n=Q.forwardRef(({color:i="currentColor",size:r=24,strokeWidth:s=2,absoluteStrokeWidth:o,className:a="",children:l,...c},h)=>Q.createElement("svg",{ref:h,...mS,width:r,height:r,stroke:i,strokeWidth:o?Number(s)*24/Number(r):s,className:["lucide",`lucide-${gS(t)}`,a].join(" "),...c},[...e.map(([d,p])=>Q.createElement(d,p)),...Array.isArray(l)?l:[l]]));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pc=Ze("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vS=Ze("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xS=Ze("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _S=Ze("Award",[["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}],["path",{d:"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11",key:"em7aur"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Np=Ze("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hs=Ze("Box",[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jl=Ze("Calculator",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yS=Ze("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gf=Ze("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Br=Ze("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kv=Ze("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const SS=Ze("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wf=Ze("FileCheck2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",key:"1pf5j1"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m3 15 2 2 4-4",key:"1lhrkk"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zv=Ze("FileCode",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m10 13-2 2 2 2",key:"17smn8"}],["path",{d:"m14 17 2-2-2-2",key:"14mezr"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const MS=Ze("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xf=Ze("GraduationCap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ES=Ze("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wS=Ze("Home",[["path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"y5dka4"}],["polyline",{points:"9 22 9 12 15 12 15 22",key:"e2us08"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TS=Ze("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Od=Ze("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CS=Ze("ListChecks",[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AS=Ze("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bS=Ze("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dp=Ze("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vl=Ze("Scan",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $f=Ze("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const RS=Ze("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ns=Ze("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PS=Ze("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ip=Ze("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const LS=Ze("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Up=Ze("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gs=Ze("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const NS=Ze("ZoomIn",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DS=Ze("ZoomOut",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);function IS(){const t=[{path:"/",label:"Home",icon:wS},{path:"/scanner",label:"Scanner",icon:Vl},{path:"/analysis",label:"Analysis",icon:pc},{path:"/simulator",label:"Simulator",icon:Hs},{path:"/calculator",label:"Calculator",icon:jl},{path:"/results",label:"Results",icon:Wf},{path:"/learn",label:"Learn",icon:Xf}];return f.jsx("header",{className:"navbar-header",children:f.jsxs("div",{className:"navbar-container",children:[f.jsxs(Pp,{to:"/",className:"brand-logo",children:[f.jsx("div",{className:"logo-icon",children:f.jsx(Br,{size:22})}),f.jsxs("div",{children:[f.jsx("span",{children:"SmartBreadboard"}),f.jsx("span",{style:{color:"var(--accent-cyan)"},children:" 3D"}),f.jsx("span",{className:"status-dot",title:"System Online"})]})]}),f.jsx("nav",{children:f.jsx("ul",{className:"nav-links",children:t.map(e=>{const n=e.icon;return f.jsx("li",{children:f.jsxs(Pp,{to:e.path,className:({isActive:i})=>`nav-item-link ${i?"active":""}`,end:e.path==="/",children:[f.jsx(n,{size:16}),f.jsx("span",{children:e.label})]})},e.path)})})}),f.jsx("div",{children:f.jsx("span",{className:"version-badge",children:"Phase 1 v0.1.0"})})]})})}function US(){return f.jsx("footer",{className:"footer",children:f.jsxs("div",{children:["SmartBreadboard 3D Platform © ",new Date().getFullYear()," — AI Electronics Learning & Circuit Analysis Engine"]})})}function OS({children:t}){return f.jsxs("div",{className:"app-container",children:[f.jsx(IS,{}),f.jsx("main",{className:"main-content",children:t}),f.jsx(US,{})]})}const co="mock",an=[{id:"circ-001",name:"1. 5V -> R1 -> LED -> GND (Single Branch)",source:co,timestamp:"2026-08-30 14:22:10",thumbnail:"https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&auto=format&fit=crop&q=60",description:"Basic DC single-branch circuit with 5V source, 220Ω current-limiting resistor, and red LED.",power_supply:{voltage:5,current_limit:.5},components:[{id:"comp-1",designator:"R1",type:"Resistor",detected_value:"220 Ω",user_override_value:"220 Ω",tolerance:"±5%",color_bands:["red","red","brown","gold"],pins:["A15","F15"],node_a:"NODE_PWR",node_b:"NODE_LED_ANODE",status:"ok"},{id:"comp-2",designator:"D1",type:"LED (Red)",detected_value:"2.0V Forward Drop",user_override_value:"2.0V Forward Drop",tolerance:"N/A",color_bands:[],pins:["G15","G18"],node_a:"NODE_LED_ANODE",node_b:"NODE_GND",status:"ok"}],nodes:[{id:"NODE_PWR",label:"VCC (+5V)",voltage:5,type:"power"},{id:"NODE_LED_ANODE",label:"R1-D1 Junction",voltage:2,type:"internal"},{id:"NODE_GND",label:"Ground (0V)",voltage:0,type:"ground"}],readings:{total_current_mA:13.6,resistor_power_mW:40.8,led_power_mW:27.2,status:"NORMAL"}},{id:"circ-002",name:"2. Two Resistors in Series (R1 + R2)",source:co,timestamp:"2026-08-30 15:10:00",thumbnail:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",description:"Series resistor divider combining 1kΩ and 2.2kΩ in series (Req = 3.2kΩ).",power_supply:{voltage:9,current_limit:.5},components:[{id:"comp-201",designator:"R1",type:"Resistor",detected_value:"1 kΩ",user_override_value:"1 kΩ",tolerance:"±5%",color_bands:["brown","black","red","gold"],pins:["A10","E10"],node_a:"NODE_9V",node_b:"NODE_MID",status:"ok"},{id:"comp-202",designator:"R2",type:"Resistor",detected_value:"2.2 kΩ",user_override_value:"2.2 kΩ",tolerance:"±5%",color_bands:["red","red","red","gold"],pins:["F10","J10"],node_a:"NODE_MID",node_b:"NODE_GND",status:"ok"}],nodes:[{id:"NODE_9V",label:"VCC (+9V)",voltage:9,type:"power"},{id:"NODE_MID",label:"Series Midpoint",voltage:6.18,type:"internal"},{id:"NODE_GND",label:"Ground (0V)",voltage:0,type:"ground"}],readings:{total_current_mA:2.81,resistor_power_mW:25.3,status:"NORMAL"}},{id:"circ-003",name:"3. Two Resistors in Parallel (R1 ∥ R2)",source:co,timestamp:"2026-08-30 15:45:30",thumbnail:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60",description:"Parallel resistor network with two 10kΩ resistors in parallel (Req = 5kΩ).",power_supply:{voltage:5,current_limit:.2},components:[{id:"comp-301",designator:"R1",type:"Resistor",detected_value:"10 kΩ",user_override_value:"10 kΩ",tolerance:"±5%",color_bands:["brown","black","orange","gold"],pins:["B20","E20"],node_a:"NODE_5V",node_b:"NODE_GND",status:"ok"},{id:"comp-302",designator:"R2",type:"Resistor",detected_value:"10 kΩ",user_override_value:"10 kΩ",tolerance:"±5%",color_bands:["brown","black","orange","gold"],pins:["F20","I20"],node_a:"NODE_5V",node_b:"NODE_GND",status:"ok"}],nodes:[{id:"NODE_5V",label:"VCC (+5V)",voltage:5,type:"power"},{id:"NODE_GND",label:"Ground (0V)",voltage:0,type:"ground"}],readings:{total_current_mA:1,resistor_power_mW:5,status:"NORMAL"}},{id:"circ-004",name:"4. Mixed Resistor Network (Multi-Branch Bridge)",source:co,timestamp:"2026-08-30 16:30:15",thumbnail:"https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&auto=format&fit=crop&q=60",description:"Complex multi-branch bridge topology (R1 in series with R2 ∥ R3) proving general MNA solver capability.",power_supply:{voltage:12,current_limit:.5},components:[{id:"comp-401",designator:"R1",type:"Resistor",detected_value:"1 kΩ",user_override_value:"1 kΩ",tolerance:"±5%",color_bands:["brown","black","red","gold"],pins:["A25","E25"],node_a:"NODE_12V",node_b:"NODE_BRIDGE",status:"ok"},{id:"comp-402",designator:"R2",type:"Resistor",detected_value:"2.2 kΩ",user_override_value:"2.2 kΩ",tolerance:"±5%",color_bands:["red","red","red","gold"],pins:["F25","I25"],node_a:"NODE_BRIDGE",node_b:"NODE_GND",status:"ok"},{id:"comp-403",designator:"R3",type:"Resistor",detected_value:"4.7 kΩ",user_override_value:"4.7 kΩ",tolerance:"±5%",color_bands:["yellow","violet","red","gold"],pins:["F26","I26"],node_a:"NODE_BRIDGE",node_b:"NODE_GND",status:"ok"}],nodes:[{id:"NODE_12V",label:"VCC (+12V)",voltage:12,type:"power"},{id:"NODE_BRIDGE",label:"Bridge Node",voltage:7.18,type:"internal"},{id:"NODE_GND",label:"Ground (0V)",voltage:0,type:"ground"}],readings:{total_current_mA:4.82,resistor_power_mW:57.8,status:"NORMAL"}},{id:"circ-005",name:"5. Resistors + Capacitors Combined (RC Filter)",source:co,timestamp:"2026-08-30 16:50:12",thumbnail:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60",description:"Analog low-pass filter combining 4.7kΩ resistor and 100nF ceramic capacitor (fc = 338.6 Hz).",power_supply:{voltage:5,current_limit:.1},components:[{id:"comp-501",designator:"R1",type:"Resistor",detected_value:"4.7 kΩ",user_override_value:"4.7 kΩ",tolerance:"±5%",color_bands:["yellow","violet","red","gold"],pins:["C30","F30"],node_a:"NODE_IN",node_b:"NODE_OUT",status:"ok"},{id:"comp-502",designator:"C1",type:"Capacitor (Ceramic)",detected_value:"100 nF (Code 104)",user_override_value:"100 nF (Code 104)",tolerance:"±10%",color_bands:[],pins:["G30","J30"],node_a:"NODE_OUT",node_b:"NODE_GND",status:"ok"}],nodes:[{id:"NODE_IN",label:"Signal Input (5V)",voltage:5,type:"input"},{id:"NODE_OUT",label:"Filtered Output (fc = 338.6Hz)",voltage:3.53,type:"output"},{id:"NODE_GND",label:"Ground (0V)",voltage:0,type:"ground"}],readings:{total_current_mA:.31,cutoff_frequency_Hz:338.6,status:"STABLE"}}],Jv=Q.createContext(null);function FS({children:t}){const[e,n]=Q.useState(an[0]),[i,r]=Q.useState(null),[s,o]=Q.useState(null),[a,l]=Q.useState(!1),[c,h]=Q.useState(null),d=g=>{g.imageMeta&&o(g.imageMeta),g.originalImage&&r(g.originalImage);const x=g.netlist||{},y=x.components||g.mapped_components||[],m={id:x.circuit_id||"circ_real_detected",name:"Real AI Scanned Circuit",source:"real",metadata:x.metadata||{source:"real",created_at:new Date().toISOString()},nodes:x.nodes||[],nets:x.nets||[],nets_summary:x.nets_summary||[],components:y,power_sources:x.power_sources||[],validity:x.validity||{status:"PASS",warnings:[]},detections:g.detections||[]};console.log("=================================================="),console.log("YOLO COMPONENTS:",g.detections),console.log("NETLIST COMPONENTS:",y),console.log("CONTEXT COMPONENTS:",m.components),console.log("=================================================="),n(m)},p=g=>{n(g),r(null),o(null),h(null)};return f.jsx(Jv.Provider,{value:{activeCircuit:e,setActiveCircuit:n,uploadedImage:i,setUploadedImage:r,imageMeta:s,setImageMeta:o,isAnalyzingReal:a,setIsAnalyzingReal:l,realAnalysisError:c,setRealAnalysisError:h,setRealCircuitData:d,setMockCircuitData:p},children:t})}function Yf(){const t=Q.useContext(Jv);if(!t)throw new Error("useCircuit must be used within a CircuitProvider");return t}function kS(){const t=[{title:"Breadboard Scanner",desc:"Capture or upload breadboard images for instant netlist identification.",icon:Vl,link:"/scanner",badge:"Phase 2 Enhanced"},{title:"Schematic Analyzer",desc:"Inspect detected vs override component values, node topologies, and netlists.",icon:pc,link:"/analysis",badge:"Phase 2 Enhanced"},{title:"3D/2D Simulator",desc:"Interactive 2D SVG breadboard workspace with voltage probe readouts.",icon:Hs,link:"/simulator",badge:"Phase 2 Enhanced"},{title:"Electronics Calculators",desc:"Working 4/5-band resistor decoders, Ohm’s Law, and LED current limiters.",icon:jl,link:"/calculator",badge:"Interactive"},{title:"Diagnostic Reports",desc:"View comprehensive node voltages, thermal safety, and test point logs.",icon:Wf,link:"/results",badge:"Phase 2 Enhanced"},{title:"Learning Modules",desc:"Interactive electronics guides, component cheat sheets, and breadboard pinouts.",icon:Xf,link:"/learn",badge:"Interactive"}];return f.jsxs("div",{children:[f.jsxs("section",{style:{textAlign:"center",padding:"2rem 1rem 3rem"},children:[f.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.35rem 0.85rem",background:"rgba(56, 189, 248, 0.1)",border:"1px solid rgba(56, 189, 248, 0.25)",borderRadius:"9999px",color:"var(--accent-cyan)",fontSize:"0.85rem",fontWeight:"600",marginBottom:"1.25rem"},children:[f.jsx(Gs,{size:14})," Phase 2: Static UI & Interactive Mockup Workspace"]}),f.jsxs("h1",{style:{fontSize:"2.5rem",fontWeight:"800",letterSpacing:"-0.03em",marginBottom:"1rem"},children:["AI-Powered Electronics ",f.jsx("span",{style:{color:"var(--accent-cyan)"},children:"Circuit Platform"})]}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"1.1rem",maxWidth:"680px",margin:"0 auto 2rem"},children:"SmartBreadboard 3D simplifies physical circuit recognition, node-by-node electrical analysis, 2D/3D breadboard simulation, and component math calculation."}),f.jsxs("div",{style:{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"},children:[f.jsxs(Er,{to:"/scanner",className:"btn btn-primary",children:[f.jsx(Vl,{size:18})," Launch Scanner"]}),f.jsxs(Er,{to:"/simulator",className:"btn btn-secondary",children:[f.jsx(Hs,{size:18})," Open 2D Simulator"]}),f.jsxs(Er,{to:"/calculator",className:"btn btn-secondary",children:[f.jsx(jl,{size:18})," Resistor / Ohm Calculator"]})]})]}),f.jsxs("section",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"1rem",marginBottom:"2.5rem"},children:[f.jsxs("div",{className:"card",style:{display:"flex",alignItems:"center",gap:"1rem"},children:[f.jsx("div",{className:"logo-icon",style:{background:"rgba(52, 211, 153, 0.1)",borderColor:"var(--accent-emerald)",color:"var(--accent-emerald)"},children:f.jsx(Br,{size:20})}),f.jsxs("div",{children:[f.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"700"},children:"3 Pre-Loaded"}),f.jsx("div",{style:{fontSize:"0.825rem",color:"var(--text-muted)"},children:"Mock Circuits Available"})]})]}),f.jsxs("div",{className:"card",style:{display:"flex",alignItems:"center",gap:"1rem"},children:[f.jsx("div",{className:"logo-icon",style:{background:"rgba(56, 189, 248, 0.1)",borderColor:"var(--accent-cyan)",color:"var(--accent-cyan)"},children:f.jsx(RS,{size:20})}),f.jsxs("div",{children:[f.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"700"},children:"100% Labeled"}),f.jsx("div",{style:{fontSize:"0.825rem",color:"var(--text-muted)"},children:"Mock Source Integrity"})]})]}),f.jsxs("div",{className:"card",style:{display:"flex",alignItems:"center",gap:"1rem"},children:[f.jsx("div",{className:"logo-icon",style:{background:"rgba(251, 191, 36, 0.1)",borderColor:"var(--accent-amber)",color:"var(--accent-amber)"},children:f.jsx(Ns,{size:20})}),f.jsxs("div",{children:[f.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"700"},children:"Separate"}),f.jsx("div",{style:{fontSize:"0.825rem",color:"var(--text-muted)"},children:"Detected vs Override Data"})]})]})]}),f.jsxs("section",{style:{marginBottom:"3rem"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"},children:[f.jsxs("div",{children:[f.jsx("h2",{style:{fontSize:"1.4rem",fontWeight:"700"},children:"Featured Sample Circuits"}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.9rem"},children:"Pre-packaged circuits ready for analysis and simulation."})]}),f.jsxs(Er,{to:"/analysis",className:"btn btn-secondary",style:{fontSize:"0.85rem"},children:["View Netlists ",f.jsx(xS,{size:14})]})]}),f.jsx("div",{className:"card-grid",children:an.map(e=>f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[f.jsxs("div",{children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"},children:[f.jsxs("span",{className:"mock-badge",children:["source: ",e.source]}),f.jsxs("span",{className:"status-badge-ok",children:[e.components.length," Components"]})]}),f.jsx("h3",{style:{fontSize:"1.15rem",marginBottom:"0.4rem"},children:e.name}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.875rem",marginBottom:"1rem"},children:e.description})]}),f.jsxs("div",{style:{paddingTop:"1rem",borderTop:"1px solid var(--border-color)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[f.jsxs("span",{className:"code-pill",children:["VCC: ",e.power_supply.voltage,"V"]}),f.jsx(Er,{to:"/analysis",className:"btn btn-primary",style:{padding:"0.4rem 0.85rem",fontSize:"0.8rem"},children:"Inspect →"})]})]},e.id))})]}),f.jsxs("section",{children:[f.jsx("h2",{style:{fontSize:"1.4rem",fontWeight:"700",marginBottom:"1.25rem"},children:"Platform Workstation Modules"}),f.jsx("div",{className:"card-grid",children:t.map((e,n)=>{const i=e.icon;return f.jsxs("div",{className:"card",children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"},children:[f.jsx("div",{className:"logo-icon",children:f.jsx(i,{size:20})}),f.jsx("span",{className:"code-pill",children:e.badge})]}),f.jsx("h3",{style:{fontSize:"1.15rem",marginBottom:"0.5rem"},children:e.title}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.875rem",marginBottom:"1.25rem"},children:e.desc}),f.jsx(Er,{to:e.link,className:"btn btn-secondary",style:{width:"100%",justifyContent:"center"},children:"Open Module →"})]},n)})})]})]})}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qf="162",Yr={ROTATE:0,DOLLY:1,PAN:2},qr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},zS=0,Op=1,BS=2,Qv=1,ex=2,di=3,sr=0,dn=1,pi=2,er=0,Ds=1,Fp=2,kp=3,zp=4,jS=5,Tr=100,VS=101,HS=102,Bp=103,jp=104,GS=200,WS=201,XS=202,$S=203,Fd=204,kd=205,YS=206,qS=207,KS=208,ZS=209,JS=210,QS=211,eM=212,tM=213,nM=214,iM=0,rM=1,sM=2,Hl=3,oM=4,aM=5,lM=6,cM=7,tx=0,uM=1,dM=2,tr=0,fM=1,hM=2,pM=3,mM=4,gM=5,vM=6,xM=7,nx=300,Ws=301,Xs=302,zd=303,Bd=304,mc=306,jd=1e3,jn=1001,Vd=1002,Jt=1003,Vp=1004,uo=1005,rn=1006,Zc=1007,Pr=1008,nr=1009,_M=1010,yM=1011,Kf=1012,ix=1013,Gi=1014,mi=1015,Qo=1016,rx=1017,sx=1018,Dr=1020,SM=1021,Vn=1023,MM=1024,EM=1025,Ir=1026,$s=1027,wM=1028,ox=1029,TM=1030,ax=1031,lx=1033,Jc=33776,Qc=33777,eu=33778,tu=33779,Hp=35840,Gp=35841,Wp=35842,Xp=35843,cx=36196,$p=37492,Yp=37496,qp=37808,Kp=37809,Zp=37810,Jp=37811,Qp=37812,em=37813,tm=37814,nm=37815,im=37816,rm=37817,sm=37818,om=37819,am=37820,lm=37821,nu=36492,cm=36494,um=36495,CM=36283,dm=36284,fm=36285,hm=36286,AM=3200,bM=3201,ux=0,RM=1,Bi="",Kn="srgb",dr="srgb-linear",Zf="display-p3",gc="display-p3-linear",Gl="linear",ct="srgb",Wl="rec709",Xl="p3",Kr=7680,pm=519,PM=512,LM=513,NM=514,dx=515,DM=516,IM=517,UM=518,OM=519,mm=35044,gm="300 es",Hd=1035,xi=2e3,$l=2001;class Xr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],hl=Math.PI/180,Gd=180/Math.PI;function aa(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[t&255]+Wt[t>>8&255]+Wt[t>>16&255]+Wt[t>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[n&63|128]+Wt[n>>8&255]+"-"+Wt[n>>16&255]+Wt[n>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function Ot(t,e,n){return Math.max(e,Math.min(n,t))}function FM(t,e){return(t%e+e)%e}function iu(t,e,n){return(1-n)*t+n*e}function vm(t){return(t&t-1)===0&&t!==0}function Wd(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function fo(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function nn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const kM={DEG2RAD:hl};class Me{constructor(e=0,n=0){Me.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ot(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ge{constructor(e,n,i,r,s,o,a,l,c){Ge.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=n,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],d=i[7],p=i[2],g=i[5],x=i[8],y=r[0],m=r[3],u=r[6],_=r[1],v=r[4],S=r[7],b=r[2],A=r[5],w=r[8];return s[0]=o*y+a*_+l*b,s[3]=o*m+a*v+l*A,s[6]=o*u+a*S+l*w,s[1]=c*y+h*_+d*b,s[4]=c*m+h*v+d*A,s[7]=c*u+h*S+d*w,s[2]=p*y+g*_+x*b,s[5]=p*m+g*v+x*A,s[8]=p*u+g*S+x*w,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return n*o*h-n*a*c-i*s*h+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,p=a*l-h*s,g=c*s-o*l,x=n*d+i*p+r*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/x;return e[0]=d*y,e[1]=(r*c-h*i)*y,e[2]=(a*i-r*o)*y,e[3]=p*y,e[4]=(h*n-r*l)*y,e[5]=(r*s-a*n)*y,e[6]=g*y,e[7]=(i*l-c*n)*y,e[8]=(o*n-i*s)*y,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(ru.makeScale(e,n)),this}rotate(e){return this.premultiply(ru.makeRotation(-e)),this}translate(e,n){return this.premultiply(ru.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ru=new Ge;function fx(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Yl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function zM(){const t=Yl("canvas");return t.style.display="block",t}const xm={};function BM(t){t in xm||(xm[t]=!0,console.warn(t))}const _m=new Ge().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ym=new Ge().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Pa={[dr]:{transfer:Gl,primaries:Wl,toReference:t=>t,fromReference:t=>t},[Kn]:{transfer:ct,primaries:Wl,toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[gc]:{transfer:Gl,primaries:Xl,toReference:t=>t.applyMatrix3(ym),fromReference:t=>t.applyMatrix3(_m)},[Zf]:{transfer:ct,primaries:Xl,toReference:t=>t.convertSRGBToLinear().applyMatrix3(ym),fromReference:t=>t.applyMatrix3(_m).convertLinearToSRGB()}},jM=new Set([dr,gc]),it={enabled:!0,_workingColorSpace:dr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!jM.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=Pa[e].toReference,r=Pa[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return Pa[t].primaries},getTransfer:function(t){return t===Bi?Gl:Pa[t].transfer}};function Is(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function su(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Zr;class hx{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Zr===void 0&&(Zr=Yl("canvas")),Zr.width=e.width,Zr.height=e.height;const i=Zr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Zr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Yl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Is(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Is(n[i]/255)*255):n[i]=Is(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let VM=0;class px{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:VM++}),this.uuid=aa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ou(r[o].image)):s.push(ou(r[o]))}else s=ou(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function ou(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?hx.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let HM=0;class fn extends Xr{constructor(e=fn.DEFAULT_IMAGE,n=fn.DEFAULT_MAPPING,i=jn,r=jn,s=rn,o=Pr,a=Vn,l=nr,c=fn.DEFAULT_ANISOTROPY,h=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:HM++}),this.uuid=aa(),this.name="",this.source=new px(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Me(0,0),this.repeat=new Me(1,1),this.center=new Me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==nx)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case jd:e.x=e.x-Math.floor(e.x);break;case jn:e.x=e.x<0?0:1;break;case Vd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case jd:e.y=e.y-Math.floor(e.y);break;case jn:e.y=e.y<0?0:1;break;case Vd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}}fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=nx;fn.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,n=0,i=0,r=1){ht.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],h=l[4],d=l[8],p=l[1],g=l[5],x=l[9],y=l[2],m=l[6],u=l[10];if(Math.abs(h-p)<.01&&Math.abs(d-y)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+p)<.1&&Math.abs(d+y)<.1&&Math.abs(x+m)<.1&&Math.abs(c+g+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const v=(c+1)/2,S=(g+1)/2,b=(u+1)/2,A=(h+p)/4,w=(d+y)/4,N=(x+m)/4;return v>S&&v>b?v<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(v),r=A/i,s=w/i):S>b?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=A/r,s=N/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=w/s,r=N/s),this.set(i,r,s,n),this}let _=Math.sqrt((m-x)*(m-x)+(d-y)*(d-y)+(p-h)*(p-h));return Math.abs(_)<.001&&(_=1),this.x=(m-x)/_,this.y=(d-y)/_,this.z=(p-h)/_,this.w=Math.acos((c+g+u-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class GM extends Xr{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new ht(0,0,e,n),this.scissorTest=!1,this.viewport=new ht(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0,count:1},i);const s=new fn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new px(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jr extends GM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class mx extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class WM extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],h=i[r+2],d=i[r+3];const p=s[o+0],g=s[o+1],x=s[o+2],y=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=h,e[n+3]=d;return}if(a===1){e[n+0]=p,e[n+1]=g,e[n+2]=x,e[n+3]=y;return}if(d!==y||l!==p||c!==g||h!==x){let m=1-a;const u=l*p+c*g+h*x+d*y,_=u>=0?1:-1,v=1-u*u;if(v>Number.EPSILON){const b=Math.sqrt(v),A=Math.atan2(b,u*_);m=Math.sin(m*A)/b,a=Math.sin(a*A)/b}const S=a*_;if(l=l*m+p*S,c=c*m+g*S,h=h*m+x*S,d=d*m+y*S,m===1-a){const b=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=b,c*=b,h*=b,d*=b}}e[n]=l,e[n+1]=c,e[n+2]=h,e[n+3]=d}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],h=i[r+3],d=s[o],p=s[o+1],g=s[o+2],x=s[o+3];return e[n]=a*x+h*d+l*g-c*p,e[n+1]=l*x+h*p+c*d-a*g,e[n+2]=c*x+h*g+a*p-l*d,e[n+3]=h*x-a*d-l*p-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(r/2),d=a(s/2),p=l(i/2),g=l(r/2),x=l(s/2);switch(o){case"XYZ":this._x=p*h*d+c*g*x,this._y=c*g*d-p*h*x,this._z=c*h*x+p*g*d,this._w=c*h*d-p*g*x;break;case"YXZ":this._x=p*h*d+c*g*x,this._y=c*g*d-p*h*x,this._z=c*h*x-p*g*d,this._w=c*h*d+p*g*x;break;case"ZXY":this._x=p*h*d-c*g*x,this._y=c*g*d+p*h*x,this._z=c*h*x+p*g*d,this._w=c*h*d-p*g*x;break;case"ZYX":this._x=p*h*d-c*g*x,this._y=c*g*d+p*h*x,this._z=c*h*x-p*g*d,this._w=c*h*d+p*g*x;break;case"YZX":this._x=p*h*d+c*g*x,this._y=c*g*d+p*h*x,this._z=c*h*x-p*g*d,this._w=c*h*d-p*g*x;break;case"XZY":this._x=p*h*d-c*g*x,this._y=c*g*d-p*h*x,this._z=c*h*x+p*g*d,this._w=c*h*d+p*g*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],h=n[6],d=n[10],p=i+a+d;if(p>0){const g=.5/Math.sqrt(p+1);this._w=.25/g,this._x=(h-l)*g,this._y=(s-c)*g,this._z=(o-r)*g}else if(i>a&&i>d){const g=2*Math.sqrt(1+i-a-d);this._w=(h-l)/g,this._x=.25*g,this._y=(r+o)/g,this._z=(s+c)/g}else if(a>d){const g=2*Math.sqrt(1+a-i-d);this._w=(s-c)/g,this._x=(r+o)/g,this._y=.25*g,this._z=(l+h)/g}else{const g=2*Math.sqrt(1+d-i-a);this._w=(o-r)/g,this._x=(s+c)/g,this._y=(l+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ot(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,h=n._w;return this._x=i*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-i*c,this._z=s*h+o*c+i*l-r*a,this._w=o*h-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const g=1-n;return this._w=g*o+n*this._w,this._x=g*i+n*this._x,this._y=g*r+n*this._y,this._z=g*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-n)*h)/c,p=Math.sin(n*h)/c;return this._w=o*d+this._w*p,this._x=i*d+this._x*p,this._y=r*d+this._y*p,this._z=s*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,n=0,i=0){I.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Sm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Sm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),h=2*(a*n-s*r),d=2*(s*i-o*n);return this.x=n+l*c+o*d-a*h,this.y=i+l*h+a*c-s*d,this.z=r+l*d+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return au.copy(this).projectOnVector(e),this.sub(au)}reflect(e){return this.sub(au.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ot(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const au=new I,Sm=new Vr;class la{constructor(e=new I(1/0,1/0,1/0),n=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(In.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(In.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=In.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,In):In.fromBufferAttribute(s,o),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),La.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),La.copy(i.boundingBox)),La.applyMatrix4(e.matrixWorld),this.union(La)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ho),Na.subVectors(this.max,ho),Jr.subVectors(e.a,ho),Qr.subVectors(e.b,ho),es.subVectors(e.c,ho),Ai.subVectors(Qr,Jr),bi.subVectors(es,Qr),mr.subVectors(Jr,es);let n=[0,-Ai.z,Ai.y,0,-bi.z,bi.y,0,-mr.z,mr.y,Ai.z,0,-Ai.x,bi.z,0,-bi.x,mr.z,0,-mr.x,-Ai.y,Ai.x,0,-bi.y,bi.x,0,-mr.y,mr.x,0];return!lu(n,Jr,Qr,es,Na)||(n=[1,0,0,0,1,0,0,0,1],!lu(n,Jr,Qr,es,Na))?!1:(Da.crossVectors(Ai,bi),n=[Da.x,Da.y,Da.z],lu(n,Jr,Qr,es,Na))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const oi=[new I,new I,new I,new I,new I,new I,new I,new I],In=new I,La=new la,Jr=new I,Qr=new I,es=new I,Ai=new I,bi=new I,mr=new I,ho=new I,Na=new I,Da=new I,gr=new I;function lu(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){gr.fromArray(t,s);const a=r.x*Math.abs(gr.x)+r.y*Math.abs(gr.y)+r.z*Math.abs(gr.z),l=e.dot(gr),c=n.dot(gr),h=i.dot(gr);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const XM=new la,po=new I,cu=new I;class Jf{constructor(e=new I,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):XM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;po.subVectors(e,this.center);const n=po.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(po,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(cu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(po.copy(e.center).add(cu)),this.expandByPoint(po.copy(e.center).sub(cu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ai=new I,uu=new I,Ia=new I,Ri=new I,du=new I,Ua=new I,fu=new I;class Qf{constructor(e=new I,n=new I(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=ai.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,n),ai.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){uu.copy(e).add(n).multiplyScalar(.5),Ia.copy(n).sub(e).normalize(),Ri.copy(this.origin).sub(uu);const s=e.distanceTo(n)*.5,o=-this.direction.dot(Ia),a=Ri.dot(this.direction),l=-Ri.dot(Ia),c=Ri.lengthSq(),h=Math.abs(1-o*o);let d,p,g,x;if(h>0)if(d=o*l-a,p=o*a-l,x=s*h,d>=0)if(p>=-x)if(p<=x){const y=1/h;d*=y,p*=y,g=d*(d+o*p+2*a)+p*(o*d+p+2*l)+c}else p=s,d=Math.max(0,-(o*p+a)),g=-d*d+p*(p+2*l)+c;else p=-s,d=Math.max(0,-(o*p+a)),g=-d*d+p*(p+2*l)+c;else p<=-x?(d=Math.max(0,-(-o*s+a)),p=d>0?-s:Math.min(Math.max(-s,-l),s),g=-d*d+p*(p+2*l)+c):p<=x?(d=0,p=Math.min(Math.max(-s,-l),s),g=p*(p+2*l)+c):(d=Math.max(0,-(o*s+a)),p=d>0?s:Math.min(Math.max(-s,-l),s),g=-d*d+p*(p+2*l)+c);else p=o>0?-s:s,d=Math.max(0,-(o*p+a)),g=-d*d+p*(p+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(uu).addScaledVector(Ia,p),g}intersectSphere(e,n){ai.subVectors(e.center,this.origin);const i=ai.dot(this.direction),r=ai.dot(ai)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,p=this.origin;return c>=0?(i=(e.min.x-p.x)*c,r=(e.max.x-p.x)*c):(i=(e.max.x-p.x)*c,r=(e.min.x-p.x)*c),h>=0?(s=(e.min.y-p.y)*h,o=(e.max.y-p.y)*h):(s=(e.max.y-p.y)*h,o=(e.min.y-p.y)*h),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-p.z)*d,l=(e.max.z-p.z)*d):(a=(e.max.z-p.z)*d,l=(e.min.z-p.z)*d),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,n,i,r,s){du.subVectors(n,e),Ua.subVectors(i,e),fu.crossVectors(du,Ua);let o=this.direction.dot(fu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ri.subVectors(this.origin,e);const l=a*this.direction.dot(Ua.crossVectors(Ri,Ua));if(l<0)return null;const c=a*this.direction.dot(du.cross(Ri));if(c<0||l+c>o)return null;const h=-a*Ri.dot(fu);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pt{constructor(e,n,i,r,s,o,a,l,c,h,d,p,g,x,y,m){pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,h,d,p,g,x,y,m)}set(e,n,i,r,s,o,a,l,c,h,d,p,g,x,y,m){const u=this.elements;return u[0]=e,u[4]=n,u[8]=i,u[12]=r,u[1]=s,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=p,u[3]=g,u[7]=x,u[11]=y,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/ts.setFromMatrixColumn(e,0).length(),s=1/ts.setFromMatrixColumn(e,1).length(),o=1/ts.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const p=o*h,g=o*d,x=a*h,y=a*d;n[0]=l*h,n[4]=-l*d,n[8]=c,n[1]=g+x*c,n[5]=p-y*c,n[9]=-a*l,n[2]=y-p*c,n[6]=x+g*c,n[10]=o*l}else if(e.order==="YXZ"){const p=l*h,g=l*d,x=c*h,y=c*d;n[0]=p+y*a,n[4]=x*a-g,n[8]=o*c,n[1]=o*d,n[5]=o*h,n[9]=-a,n[2]=g*a-x,n[6]=y+p*a,n[10]=o*l}else if(e.order==="ZXY"){const p=l*h,g=l*d,x=c*h,y=c*d;n[0]=p-y*a,n[4]=-o*d,n[8]=x+g*a,n[1]=g+x*a,n[5]=o*h,n[9]=y-p*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const p=o*h,g=o*d,x=a*h,y=a*d;n[0]=l*h,n[4]=x*c-g,n[8]=p*c+y,n[1]=l*d,n[5]=y*c+p,n[9]=g*c-x,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const p=o*l,g=o*c,x=a*l,y=a*c;n[0]=l*h,n[4]=y-p*d,n[8]=x*d+g,n[1]=d,n[5]=o*h,n[9]=-a*h,n[2]=-c*h,n[6]=g*d+x,n[10]=p-y*d}else if(e.order==="XZY"){const p=o*l,g=o*c,x=a*l,y=a*c;n[0]=l*h,n[4]=-d,n[8]=c*h,n[1]=p*d+y,n[5]=o*h,n[9]=g*d-x,n[2]=x*d-g,n[6]=a*h,n[10]=y*d+p}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose($M,e,YM)}lookAt(e,n,i){const r=this.elements;return pn.subVectors(e,n),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Pi.crossVectors(i,pn),Pi.lengthSq()===0&&(Math.abs(i.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Pi.crossVectors(i,pn)),Pi.normalize(),Oa.crossVectors(pn,Pi),r[0]=Pi.x,r[4]=Oa.x,r[8]=pn.x,r[1]=Pi.y,r[5]=Oa.y,r[9]=pn.y,r[2]=Pi.z,r[6]=Oa.z,r[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],d=i[5],p=i[9],g=i[13],x=i[2],y=i[6],m=i[10],u=i[14],_=i[3],v=i[7],S=i[11],b=i[15],A=r[0],w=r[4],N=r[8],q=r[12],M=r[1],R=r[5],k=r[9],J=r[13],L=r[2],$=r[6],j=r[10],ee=r[14],U=r[3],z=r[7],W=r[11],re=r[15];return s[0]=o*A+a*M+l*L+c*U,s[4]=o*w+a*R+l*$+c*z,s[8]=o*N+a*k+l*j+c*W,s[12]=o*q+a*J+l*ee+c*re,s[1]=h*A+d*M+p*L+g*U,s[5]=h*w+d*R+p*$+g*z,s[9]=h*N+d*k+p*j+g*W,s[13]=h*q+d*J+p*ee+g*re,s[2]=x*A+y*M+m*L+u*U,s[6]=x*w+y*R+m*$+u*z,s[10]=x*N+y*k+m*j+u*W,s[14]=x*q+y*J+m*ee+u*re,s[3]=_*A+v*M+S*L+b*U,s[7]=_*w+v*R+S*$+b*z,s[11]=_*N+v*k+S*j+b*W,s[15]=_*q+v*J+S*ee+b*re,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],p=e[10],g=e[14],x=e[3],y=e[7],m=e[11],u=e[15];return x*(+s*l*d-r*c*d-s*a*p+i*c*p+r*a*g-i*l*g)+y*(+n*l*g-n*c*p+s*o*p-r*o*g+r*c*h-s*l*h)+m*(+n*c*d-n*a*g-s*o*d+i*o*g+s*a*h-i*c*h)+u*(-r*a*h-n*l*d+n*a*p+r*o*d-i*o*p+i*l*h)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],p=e[10],g=e[11],x=e[12],y=e[13],m=e[14],u=e[15],_=d*m*c-y*p*c+y*l*g-a*m*g-d*l*u+a*p*u,v=x*p*c-h*m*c-x*l*g+o*m*g+h*l*u-o*p*u,S=h*y*c-x*d*c+x*a*g-o*y*g-h*a*u+o*d*u,b=x*d*l-h*y*l-x*a*p+o*y*p+h*a*m-o*d*m,A=n*_+i*v+r*S+s*b;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/A;return e[0]=_*w,e[1]=(y*p*s-d*m*s-y*r*g+i*m*g+d*r*u-i*p*u)*w,e[2]=(a*m*s-y*l*s+y*r*c-i*m*c-a*r*u+i*l*u)*w,e[3]=(d*l*s-a*p*s-d*r*c+i*p*c+a*r*g-i*l*g)*w,e[4]=v*w,e[5]=(h*m*s-x*p*s+x*r*g-n*m*g-h*r*u+n*p*u)*w,e[6]=(x*l*s-o*m*s-x*r*c+n*m*c+o*r*u-n*l*u)*w,e[7]=(o*p*s-h*l*s+h*r*c-n*p*c-o*r*g+n*l*g)*w,e[8]=S*w,e[9]=(x*d*s-h*y*s-x*i*g+n*y*g+h*i*u-n*d*u)*w,e[10]=(o*y*s-x*a*s+x*i*c-n*y*c-o*i*u+n*a*u)*w,e[11]=(h*a*s-o*d*s-h*i*c+n*d*c+o*i*g-n*a*g)*w,e[12]=b*w,e[13]=(h*y*r-x*d*r+x*i*p-n*y*p-h*i*m+n*d*m)*w,e[14]=(x*a*r-o*y*r-x*i*l+n*y*l+o*i*m-n*a*m)*w,e[15]=(o*d*r-h*a*r+h*i*l-n*d*l-o*i*p+n*a*p)*w,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+i,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,h=o+o,d=a+a,p=s*c,g=s*h,x=s*d,y=o*h,m=o*d,u=a*d,_=l*c,v=l*h,S=l*d,b=i.x,A=i.y,w=i.z;return r[0]=(1-(y+u))*b,r[1]=(g+S)*b,r[2]=(x-v)*b,r[3]=0,r[4]=(g-S)*A,r[5]=(1-(p+u))*A,r[6]=(m+_)*A,r[7]=0,r[8]=(x+v)*w,r[9]=(m-_)*w,r[10]=(1-(p+y))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=ts.set(r[0],r[1],r[2]).length();const o=ts.set(r[4],r[5],r[6]).length(),a=ts.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Un.copy(this);const c=1/s,h=1/o,d=1/a;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=h,Un.elements[5]*=h,Un.elements[6]*=h,Un.elements[8]*=d,Un.elements[9]*=d,Un.elements[10]*=d,n.setFromRotationMatrix(Un),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=xi){const l=this.elements,c=2*s/(n-e),h=2*s/(i-r),d=(n+e)/(n-e),p=(i+r)/(i-r);let g,x;if(a===xi)g=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===$l)g=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=xi){const l=this.elements,c=1/(n-e),h=1/(i-r),d=1/(o-s),p=(n+e)*c,g=(i+r)*h;let x,y;if(a===xi)x=(o+s)*d,y=-2*d;else if(a===$l)x=s*d,y=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-g,l[2]=0,l[6]=0,l[10]=y,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const ts=new I,Un=new pt,$M=new I(0,0,0),YM=new I(1,1,1),Pi=new I,Oa=new I,pn=new I,Mm=new pt,Em=new Vr;class ri{constructor(e=0,n=0,i=0,r=ri.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],d=r[2],p=r[6],g=r[10];switch(n){case"XYZ":this._y=Math.asin(Ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ot(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ot(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,g),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ot(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,g),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ot(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,g));break;case"XZY":this._z=Math.asin(-Ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Mm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mm,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Em.setFromEuler(this),this.setFromQuaternion(Em,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ri.DEFAULT_ORDER="XYZ";class eh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qM=0;const wm=new I,ns=new Vr,li=new pt,Fa=new I,mo=new I,KM=new I,ZM=new Vr,Tm=new I(1,0,0),Cm=new I(0,1,0),Am=new I(0,0,1),JM={type:"added"},QM={type:"removed"},hu={type:"childadded",child:null},pu={type:"childremoved",child:null};class Yt extends Xr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qM++}),this.uuid=aa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Yt.DEFAULT_UP.clone();const e=new I,n=new ri,i=new Vr,r=new I(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new pt},normalMatrix:{value:new Ge}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=Yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new eh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ns.setFromAxisAngle(e,n),this.quaternion.multiply(ns),this}rotateOnWorldAxis(e,n){return ns.setFromAxisAngle(e,n),this.quaternion.premultiply(ns),this}rotateX(e){return this.rotateOnAxis(Tm,e)}rotateY(e){return this.rotateOnAxis(Cm,e)}rotateZ(e){return this.rotateOnAxis(Am,e)}translateOnAxis(e,n){return wm.copy(e).applyQuaternion(this.quaternion),this.position.add(wm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Tm,e)}translateY(e){return this.translateOnAxis(Cm,e)}translateZ(e){return this.translateOnAxis(Am,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Fa.copy(e):Fa.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(mo,Fa,this.up):li.lookAt(Fa,mo,this.up),this.quaternion.setFromRotationMatrix(li),r&&(li.extractRotation(r.matrixWorld),ns.setFromRotationMatrix(li),this.quaternion.premultiply(ns.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(JM),hu.child=e,this.dispatchEvent(hu),hu.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(QM),pu.child=e,this.dispatchEvent(pu),pu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),li.multiply(e.parent.matrixWorld)),e.applyMatrix4(li),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,e,KM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,ZM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++){const s=n[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),p=o(e.skeletons),g=o(e.animations),x=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),p.length>0&&(i.skeletons=p),g.length>0&&(i.animations=g),x.length>0&&(i.nodes=x)}return i.object=r,i;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Yt.DEFAULT_UP=new I(0,1,0);Yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const On=new I,ci=new I,mu=new I,ui=new I,is=new I,rs=new I,bm=new I,gu=new I,vu=new I,xu=new I;class ei{constructor(e=new I,n=new I,i=new I){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),On.subVectors(e,n),r.cross(On);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){On.subVectors(r,n),ci.subVectors(i,n),mu.subVectors(e,n);const o=On.dot(On),a=On.dot(ci),l=On.dot(mu),c=ci.dot(ci),h=ci.dot(mu),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const p=1/d,g=(c*l-a*h)*p,x=(o*h-a*l)*p;return s.set(1-g-x,x,g)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,ui)===null?!1:ui.x>=0&&ui.y>=0&&ui.x+ui.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ui.x),l.addScaledVector(o,ui.y),l.addScaledVector(a,ui.z),l)}static isFrontFacing(e,n,i,r){return On.subVectors(i,n),ci.subVectors(e,n),On.cross(ci).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return On.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),On.cross(ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ei.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return ei.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return ei.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return ei.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ei.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;is.subVectors(r,i),rs.subVectors(s,i),gu.subVectors(e,i);const l=is.dot(gu),c=rs.dot(gu);if(l<=0&&c<=0)return n.copy(i);vu.subVectors(e,r);const h=is.dot(vu),d=rs.dot(vu);if(h>=0&&d<=h)return n.copy(r);const p=l*d-h*c;if(p<=0&&l>=0&&h<=0)return o=l/(l-h),n.copy(i).addScaledVector(is,o);xu.subVectors(e,s);const g=is.dot(xu),x=rs.dot(xu);if(x>=0&&g<=x)return n.copy(s);const y=g*c-l*x;if(y<=0&&c>=0&&x<=0)return a=c/(c-x),n.copy(i).addScaledVector(rs,a);const m=h*x-g*d;if(m<=0&&d-h>=0&&g-x>=0)return bm.subVectors(s,r),a=(d-h)/(d-h+(g-x)),n.copy(r).addScaledVector(bm,a);const u=1/(m+y+p);return o=y*u,a=p*u,n.copy(i).addScaledVector(is,o).addScaledVector(rs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const gx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},ka={h:0,s:0,l:0};function _u(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ke{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Kn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=it.workingColorSpace){return this.r=e,this.g=n,this.b=i,it.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=it.workingColorSpace){if(e=FM(e,1),n=Ot(n,0,1),i=Ot(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=_u(o,s,e+1/3),this.g=_u(o,s,e),this.b=_u(o,s,e-1/3)}return it.toWorkingColorSpace(this,r),this}setStyle(e,n=Kn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Kn){const i=gx[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Is(e.r),this.g=Is(e.g),this.b=Is(e.b),this}copyLinearToSRGB(e){return this.r=su(e.r),this.g=su(e.g),this.b=su(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kn){return it.fromWorkingColorSpace(Xt.copy(this),e),Math.round(Ot(Xt.r*255,0,255))*65536+Math.round(Ot(Xt.g*255,0,255))*256+Math.round(Ot(Xt.b*255,0,255))}getHexString(e=Kn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=it.workingColorSpace){it.fromWorkingColorSpace(Xt.copy(this),n);const i=Xt.r,r=Xt.g,s=Xt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,n=it.workingColorSpace){return it.fromWorkingColorSpace(Xt.copy(this),n),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=Kn){it.fromWorkingColorSpace(Xt.copy(this),e);const n=Xt.r,i=Xt.g,r=Xt.b;return e!==Kn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Li),this.setHSL(Li.h+e,Li.s+n,Li.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Li),e.getHSL(ka);const i=iu(Li.h,ka.h,n),r=iu(Li.s,ka.s,n),s=iu(Li.l,ka.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new Ke;Ke.NAMES=gx;let eE=0;class ca extends Xr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:eE++}),this.uuid=aa(),this.name="",this.type="Material",this.blending=Ds,this.side=sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fd,this.blendDst=kd,this.blendEquation=Tr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Hl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Kr,this.stencilZFail=Kr,this.stencilZPass=Kr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ds&&(i.blending=this.blending),this.side!==sr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Fd&&(i.blendSrc=this.blendSrc),this.blendDst!==kd&&(i.blendDst=this.blendDst),this.blendEquation!==Tr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Hl&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Kr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Kr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Kr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Oi extends ca{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=tx,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new I,za=new Me;class ii{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=mm,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return BM("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)za.fromBufferAttribute(this,n),za.applyMatrix3(e),this.setXY(n,za.x,za.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix3(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix4(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyNormalMatrix(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.transformDirection(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=fo(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=nn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=fo(n,this.array)),n}setX(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=fo(n,this.array)),n}setY(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=fo(n,this.array)),n}setZ(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=fo(n,this.array)),n}setW(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array),r=nn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array),r=nn(r,this.array),s=nn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==mm&&(e.usage=this.usage),e}}class vx extends ii{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class xx extends ii{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Pt extends ii{constructor(e,n,i){super(new Float32Array(e),n,i)}}let tE=0;const Tn=new pt,yu=new Yt,ss=new I,mn=new la,go=new la,It=new I;class Xn extends Xr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tE++}),this.uuid=aa(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(fx(e)?xx:vx)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ge().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Tn.makeRotationFromQuaternion(e),this.applyMatrix4(Tn),this}rotateX(e){return Tn.makeRotationX(e),this.applyMatrix4(Tn),this}rotateY(e){return Tn.makeRotationY(e),this.applyMatrix4(Tn),this}rotateZ(e){return Tn.makeRotationZ(e),this.applyMatrix4(Tn),this}translate(e,n,i){return Tn.makeTranslation(e,n,i),this.applyMatrix4(Tn),this}scale(e,n,i){return Tn.makeScale(e,n,i),this.applyMatrix4(Tn),this}lookAt(e){return yu.lookAt(e),yu.updateMatrix(),this.applyMatrix4(yu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Pt(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new la);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];mn.setFromBufferAttribute(s),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jf);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const i=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];go.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(mn.min,go.min),mn.expandByPoint(It),It.addVectors(mn.max,go.max),mn.expandByPoint(It)):(mn.expandByPoint(go.min),mn.expandByPoint(go.max))}mn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)It.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(It));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)It.fromBufferAttribute(a,c),l&&(ss.fromBufferAttribute(e,c),It.add(ss)),r=Math.max(r,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ii(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<i.count;N++)a[N]=new I,l[N]=new I;const c=new I,h=new I,d=new I,p=new Me,g=new Me,x=new Me,y=new I,m=new I;function u(N,q,M){c.fromBufferAttribute(i,N),h.fromBufferAttribute(i,q),d.fromBufferAttribute(i,M),p.fromBufferAttribute(s,N),g.fromBufferAttribute(s,q),x.fromBufferAttribute(s,M),h.sub(c),d.sub(c),g.sub(p),x.sub(p);const R=1/(g.x*x.y-x.x*g.y);isFinite(R)&&(y.copy(h).multiplyScalar(x.y).addScaledVector(d,-g.y).multiplyScalar(R),m.copy(d).multiplyScalar(g.x).addScaledVector(h,-x.x).multiplyScalar(R),a[N].add(y),a[q].add(y),a[M].add(y),l[N].add(m),l[q].add(m),l[M].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let N=0,q=_.length;N<q;++N){const M=_[N],R=M.start,k=M.count;for(let J=R,L=R+k;J<L;J+=3)u(e.getX(J+0),e.getX(J+1),e.getX(J+2))}const v=new I,S=new I,b=new I,A=new I;function w(N){b.fromBufferAttribute(r,N),A.copy(b);const q=a[N];v.copy(q),v.sub(b.multiplyScalar(b.dot(q))).normalize(),S.crossVectors(A,q);const R=S.dot(l[N])<0?-1:1;o.setXYZW(N,v.x,v.y,v.z,R)}for(let N=0,q=_.length;N<q;++N){const M=_[N],R=M.start,k=M.count;for(let J=R,L=R+k;J<L;J+=3)w(e.getX(J+0)),w(e.getX(J+1)),w(e.getX(J+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ii(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let p=0,g=i.count;p<g;p++)i.setXYZ(p,0,0,0);const r=new I,s=new I,o=new I,a=new I,l=new I,c=new I,h=new I,d=new I;if(e)for(let p=0,g=e.count;p<g;p+=3){const x=e.getX(p+0),y=e.getX(p+1),m=e.getX(p+2);r.fromBufferAttribute(n,x),s.fromBufferAttribute(n,y),o.fromBufferAttribute(n,m),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),a.fromBufferAttribute(i,x),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(x,a.x,a.y,a.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let p=0,g=n.count;p<g;p+=3)r.fromBufferAttribute(n,p+0),s.fromBufferAttribute(n,p+1),o.fromBufferAttribute(n,p+2),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),i.setXYZ(p+0,h.x,h.y,h.z),i.setXYZ(p+1,h.x,h.y,h.z),i.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)It.fromBufferAttribute(e,n),It.normalize(),e.setXYZ(n,It.x,It.y,It.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,d=a.normalized,p=new c.constructor(l.length*h);let g=0,x=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?g=l[y]*a.data.stride+a.offset:g=l[y]*h;for(let u=0;u<h;u++)p[x++]=c[g++]}return new ii(p,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Xn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,d=c.length;h<d;h++){const p=c[h],g=e(p,i);l.push(g)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,p=c.length;d<p;d++){const g=c[d];h.push(g.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(n))}const s=e.morphAttributes;for(const c in s){const h=[],d=s[c];for(let p=0,g=d.length;p<g;p++)h.push(d[p].clone(n));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Rm=new pt,vr=new Qf,Ba=new Jf,Pm=new I,os=new I,as=new I,ls=new I,Su=new I,ja=new I,Va=new Me,Ha=new Me,Ga=new Me,Lm=new I,Nm=new I,Dm=new I,Wa=new I,Xa=new I;class Je extends Yt{constructor(e=new Xn,n=new Oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){ja.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],d=s[l];h!==0&&(Su.fromBufferAttribute(d,e),o?ja.addScaledVector(Su,h):ja.addScaledVector(Su.sub(n),h))}n.add(ja)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ba.copy(i.boundingSphere),Ba.applyMatrix4(s),vr.copy(e.ray).recast(e.near),!(Ba.containsPoint(vr.origin)===!1&&(vr.intersectSphere(Ba,Pm)===null||vr.origin.distanceToSquared(Pm)>(e.far-e.near)**2))&&(Rm.copy(s).invert(),vr.copy(e.ray).applyMatrix4(Rm),!(i.boundingBox!==null&&vr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,vr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,p=s.groups,g=s.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,y=p.length;x<y;x++){const m=p[x],u=o[m.materialIndex],_=Math.max(m.start,g.start),v=Math.min(a.count,Math.min(m.start+m.count,g.start+g.count));for(let S=_,b=v;S<b;S+=3){const A=a.getX(S),w=a.getX(S+1),N=a.getX(S+2);r=$a(this,u,e,i,c,h,d,A,w,N),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const x=Math.max(0,g.start),y=Math.min(a.count,g.start+g.count);for(let m=x,u=y;m<u;m+=3){const _=a.getX(m),v=a.getX(m+1),S=a.getX(m+2);r=$a(this,o,e,i,c,h,d,_,v,S),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let x=0,y=p.length;x<y;x++){const m=p[x],u=o[m.materialIndex],_=Math.max(m.start,g.start),v=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let S=_,b=v;S<b;S+=3){const A=S,w=S+1,N=S+2;r=$a(this,u,e,i,c,h,d,A,w,N),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const x=Math.max(0,g.start),y=Math.min(l.count,g.start+g.count);for(let m=x,u=y;m<u;m+=3){const _=m,v=m+1,S=m+2;r=$a(this,o,e,i,c,h,d,_,v,S),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function nE(t,e,n,i,r,s,o,a){let l;if(e.side===dn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===sr,a),l===null)return null;Xa.copy(a),Xa.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Xa);return c<n.near||c>n.far?null:{distance:c,point:Xa.clone(),object:t}}function $a(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,os),t.getVertexPosition(l,as),t.getVertexPosition(c,ls);const h=nE(t,e,n,i,os,as,ls,Wa);if(h){r&&(Va.fromBufferAttribute(r,a),Ha.fromBufferAttribute(r,l),Ga.fromBufferAttribute(r,c),h.uv=ei.getInterpolation(Wa,os,as,ls,Va,Ha,Ga,new Me)),s&&(Va.fromBufferAttribute(s,a),Ha.fromBufferAttribute(s,l),Ga.fromBufferAttribute(s,c),h.uv1=ei.getInterpolation(Wa,os,as,ls,Va,Ha,Ga,new Me)),o&&(Lm.fromBufferAttribute(o,a),Nm.fromBufferAttribute(o,l),Dm.fromBufferAttribute(o,c),h.normal=ei.getInterpolation(Wa,os,as,ls,Lm,Nm,Dm,new I),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new I,materialIndex:0};ei.getNormal(os,as,ls,d.normal),h.face=d}return h}class Bn extends Xn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],d=[];let p=0,g=0;x("z","y","x",-1,-1,i,n,e,o,s,0),x("z","y","x",1,-1,i,n,-e,o,s,1),x("x","z","y",1,1,e,i,n,r,o,2),x("x","z","y",1,-1,e,i,-n,r,o,3),x("x","y","z",1,-1,e,n,i,r,s,4),x("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Pt(c,3)),this.setAttribute("normal",new Pt(h,3)),this.setAttribute("uv",new Pt(d,2));function x(y,m,u,_,v,S,b,A,w,N,q){const M=S/w,R=b/N,k=S/2,J=b/2,L=A/2,$=w+1,j=N+1;let ee=0,U=0;const z=new I;for(let W=0;W<j;W++){const re=W*R-J;for(let ue=0;ue<$;ue++){const Ne=ue*M-k;z[y]=Ne*_,z[m]=re*v,z[u]=L,c.push(z.x,z.y,z.z),z[y]=0,z[m]=0,z[u]=A>0?1:-1,h.push(z.x,z.y,z.z),d.push(ue/w),d.push(1-W/N),ee+=1}}for(let W=0;W<N;W++)for(let re=0;re<w;re++){const ue=p+re+$*W,Ne=p+re+$*(W+1),G=p+(re+1)+$*(W+1),se=p+(re+1)+$*W;l.push(ue,Ne,se),l.push(Ne,G,se),U+=6}a.addGroup(g,U,q),g+=U,p+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ys(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Kt(t){const e={};for(let n=0;n<t.length;n++){const i=Ys(t[n]);for(const r in i)e[r]=i[r]}return e}function iE(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function _x(t){return t.getRenderTarget()===null?t.outputColorSpace:it.workingColorSpace}const rE={clone:Ys,merge:Kt};var sE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,oE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class or extends ca{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sE,this.fragmentShader=oE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ys(e.uniforms),this.uniformsGroups=iE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class yx extends Yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=xi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ni=new I,Im=new Me,Um=new Me;class xn extends yx{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Gd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(hl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gd*2*Math.atan(Math.tan(hl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z),Ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z)}getViewSize(e,n){return this.getViewBounds(e,Im,Um),n.subVectors(Um,Im)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(hl*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const cs=-90,us=1;class aE extends Yt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new xn(cs,us,e,n);r.layers=this.layers,this.add(r);const s=new xn(cs,us,e,n);s.layers=this.layers,this.add(s);const o=new xn(cs,us,e,n);o.layers=this.layers,this.add(o);const a=new xn(cs,us,e,n);a.layers=this.layers,this.add(a);const l=new xn(cs,us,e,n);l.layers=this.layers,this.add(l);const c=new xn(cs,us,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===xi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===$l)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,d=e.getRenderTarget(),p=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),e.render(n,h),e.setRenderTarget(d,p,g),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Sx extends fn{constructor(e,n,i,r,s,o,a,l,c,h){e=e!==void 0?e:[],n=n!==void 0?n:Ws,super(e,n,i,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class lE extends jr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Sx(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:rn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Bn(5,5,5),s=new or({name:"CubemapFromEquirect",uniforms:Ys(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:dn,blending:er});s.uniforms.tEquirect.value=n;const o=new Je(r,s),a=n.minFilter;return n.minFilter===Pr&&(n.minFilter=rn),new aE(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const Mu=new I,cE=new I,uE=new Ge;class Fi{constructor(e=new I(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Mu.subVectors(i,n).cross(cE.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Mu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||uE.getNormalMatrix(e),r=this.coplanarPoint(Mu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const xr=new Jf,Ya=new I;class th{constructor(e=new Fi,n=new Fi,i=new Fi,r=new Fi,s=new Fi,o=new Fi){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=xi){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],h=r[5],d=r[6],p=r[7],g=r[8],x=r[9],y=r[10],m=r[11],u=r[12],_=r[13],v=r[14],S=r[15];if(i[0].setComponents(l-s,p-c,m-g,S-u).normalize(),i[1].setComponents(l+s,p+c,m+g,S+u).normalize(),i[2].setComponents(l+o,p+h,m+x,S+_).normalize(),i[3].setComponents(l-o,p-h,m-x,S-_).normalize(),i[4].setComponents(l-a,p-d,m-y,S-v).normalize(),n===xi)i[5].setComponents(l+a,p+d,m+y,S+v).normalize();else if(n===$l)i[5].setComponents(a,d,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),xr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),xr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(xr)}intersectsSprite(e){return xr.center.set(0,0,0),xr.radius=.7071067811865476,xr.applyMatrix4(e.matrixWorld),this.intersectsSphere(xr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Ya.x=r.normal.x>0?e.max.x:e.min.x,Ya.y=r.normal.y>0?e.max.y:e.min.y,Ya.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ya)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Mx(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function dE(t,e){const n=e.isWebGL2,i=new WeakMap;function r(c,h){const d=c.array,p=c.usage,g=d.byteLength,x=t.createBuffer();t.bindBuffer(h,x),t.bufferData(h,d,p),c.onUploadCallback();let y;if(d instanceof Float32Array)y=t.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(n)y=t.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else y=t.UNSIGNED_SHORT;else if(d instanceof Int16Array)y=t.SHORT;else if(d instanceof Uint32Array)y=t.UNSIGNED_INT;else if(d instanceof Int32Array)y=t.INT;else if(d instanceof Int8Array)y=t.BYTE;else if(d instanceof Uint8Array)y=t.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)y=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:x,type:y,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version,size:g}}function s(c,h,d){const p=h.array,g=h._updateRange,x=h.updateRanges;if(t.bindBuffer(d,c),g.count===-1&&x.length===0&&t.bufferSubData(d,0,p),x.length!==0){for(let y=0,m=x.length;y<m;y++){const u=x[y];n?t.bufferSubData(d,u.start*p.BYTES_PER_ELEMENT,p,u.start,u.count):t.bufferSubData(d,u.start*p.BYTES_PER_ELEMENT,p.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}g.count!==-1&&(n?t.bufferSubData(d,g.offset*p.BYTES_PER_ELEMENT,p,g.offset,g.count):t.bufferSubData(d,g.offset*p.BYTES_PER_ELEMENT,p.subarray(g.offset,g.offset+g.count)),g.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h&&(t.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const p=i.get(c);(!p||p.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=i.get(c);if(d===void 0)i.set(c,r(c,h));else if(d.version<c.version){if(d.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(d.buffer,c,h),d.version=c.version}}return{get:o,remove:a,update:l}}class vc extends Xn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,h=l+1,d=e/a,p=n/l,g=[],x=[],y=[],m=[];for(let u=0;u<h;u++){const _=u*p-o;for(let v=0;v<c;v++){const S=v*d-s;x.push(S,-_,0),y.push(0,0,1),m.push(v/a),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let _=0;_<a;_++){const v=_+c*u,S=_+c*(u+1),b=_+1+c*(u+1),A=_+1+c*u;g.push(v,S,A),g.push(S,b,A)}this.setIndex(g),this.setAttribute("position",new Pt(x,3)),this.setAttribute("normal",new Pt(y,3)),this.setAttribute("uv",new Pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vc(e.width,e.height,e.widthSegments,e.heightSegments)}}var fE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,pE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_E=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yE=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,SE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,ME=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,EE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,TE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,CE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,AE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,bE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,RE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,PE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,LE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,NE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,DE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,IE=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,UE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,OE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,FE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,kE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,BE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,VE="gl_FragColor = linearToOutputTexel( gl_FragColor );",HE=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,GE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,WE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,XE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$E=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,YE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,KE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ZE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,JE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,QE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ew=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,tw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,iw=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rw=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,sw=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ow=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,aw=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cw=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,uw=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,dw=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,fw=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hw=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,pw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mw=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gw=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vw=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,xw=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,_w=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,yw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Mw=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ew=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ww=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Tw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cw=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Aw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,bw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		#endif
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Rw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Pw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Lw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Nw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Iw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Uw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ow=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Fw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Vw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Gw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ww=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$w=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Yw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,qw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Kw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Zw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Jw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,e2=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,t2=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,n2=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,i2=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,r2=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,s2=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	float startCompression = 0.8 - 0.04;
	float desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min(color.r, min(color.g, color.b));
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max(color.r, max(color.g, color.b));
	if (peak < startCompression) return color;
	float d = 1. - startCompression;
	float newPeak = 1. - d * d / (peak + d - startCompression);
	color *= newPeak / peak;
	float g = 1. - 1. / (desaturation * (peak - newPeak) + 1.);
	return mix(color, vec3(1, 1, 1), g);
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,o2=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,a2=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,l2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,c2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,u2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,d2=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const f2=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,h2=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,p2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m2=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,v2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_2=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,y2=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,S2=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,M2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,E2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,w2=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,T2=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,C2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,A2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,L2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,N2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,D2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,I2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,U2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,O2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,F2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,k2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,z2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,j2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,V2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,H2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,G2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,W2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:fE,alphahash_pars_fragment:hE,alphamap_fragment:pE,alphamap_pars_fragment:mE,alphatest_fragment:gE,alphatest_pars_fragment:vE,aomap_fragment:xE,aomap_pars_fragment:_E,batching_pars_vertex:yE,batching_vertex:SE,begin_vertex:ME,beginnormal_vertex:EE,bsdfs:wE,iridescence_fragment:TE,bumpmap_pars_fragment:CE,clipping_planes_fragment:AE,clipping_planes_pars_fragment:bE,clipping_planes_pars_vertex:RE,clipping_planes_vertex:PE,color_fragment:LE,color_pars_fragment:NE,color_pars_vertex:DE,color_vertex:IE,common:UE,cube_uv_reflection_fragment:OE,defaultnormal_vertex:FE,displacementmap_pars_vertex:kE,displacementmap_vertex:zE,emissivemap_fragment:BE,emissivemap_pars_fragment:jE,colorspace_fragment:VE,colorspace_pars_fragment:HE,envmap_fragment:GE,envmap_common_pars_fragment:WE,envmap_pars_fragment:XE,envmap_pars_vertex:$E,envmap_physical_pars_fragment:sw,envmap_vertex:YE,fog_vertex:qE,fog_pars_vertex:KE,fog_fragment:ZE,fog_pars_fragment:JE,gradientmap_pars_fragment:QE,lightmap_fragment:ew,lightmap_pars_fragment:tw,lights_lambert_fragment:nw,lights_lambert_pars_fragment:iw,lights_pars_begin:rw,lights_toon_fragment:ow,lights_toon_pars_fragment:aw,lights_phong_fragment:lw,lights_phong_pars_fragment:cw,lights_physical_fragment:uw,lights_physical_pars_fragment:dw,lights_fragment_begin:fw,lights_fragment_maps:hw,lights_fragment_end:pw,logdepthbuf_fragment:mw,logdepthbuf_pars_fragment:gw,logdepthbuf_pars_vertex:vw,logdepthbuf_vertex:xw,map_fragment:_w,map_pars_fragment:yw,map_particle_fragment:Sw,map_particle_pars_fragment:Mw,metalnessmap_fragment:Ew,metalnessmap_pars_fragment:ww,morphinstance_vertex:Tw,morphcolor_vertex:Cw,morphnormal_vertex:Aw,morphtarget_pars_vertex:bw,morphtarget_vertex:Rw,normal_fragment_begin:Pw,normal_fragment_maps:Lw,normal_pars_fragment:Nw,normal_pars_vertex:Dw,normal_vertex:Iw,normalmap_pars_fragment:Uw,clearcoat_normal_fragment_begin:Ow,clearcoat_normal_fragment_maps:Fw,clearcoat_pars_fragment:kw,iridescence_pars_fragment:zw,opaque_fragment:Bw,packing:jw,premultiplied_alpha_fragment:Vw,project_vertex:Hw,dithering_fragment:Gw,dithering_pars_fragment:Ww,roughnessmap_fragment:Xw,roughnessmap_pars_fragment:$w,shadowmap_pars_fragment:Yw,shadowmap_pars_vertex:qw,shadowmap_vertex:Kw,shadowmask_pars_fragment:Zw,skinbase_vertex:Jw,skinning_pars_vertex:Qw,skinning_vertex:e2,skinnormal_vertex:t2,specularmap_fragment:n2,specularmap_pars_fragment:i2,tonemapping_fragment:r2,tonemapping_pars_fragment:s2,transmission_fragment:o2,transmission_pars_fragment:a2,uv_pars_fragment:l2,uv_pars_vertex:c2,uv_vertex:u2,worldpos_vertex:d2,background_vert:f2,background_frag:h2,backgroundCube_vert:p2,backgroundCube_frag:m2,cube_vert:g2,cube_frag:v2,depth_vert:x2,depth_frag:_2,distanceRGBA_vert:y2,distanceRGBA_frag:S2,equirect_vert:M2,equirect_frag:E2,linedashed_vert:w2,linedashed_frag:T2,meshbasic_vert:C2,meshbasic_frag:A2,meshlambert_vert:b2,meshlambert_frag:R2,meshmatcap_vert:P2,meshmatcap_frag:L2,meshnormal_vert:N2,meshnormal_frag:D2,meshphong_vert:I2,meshphong_frag:U2,meshphysical_vert:O2,meshphysical_frag:F2,meshtoon_vert:k2,meshtoon_frag:z2,points_vert:B2,points_frag:j2,shadow_vert:V2,shadow_frag:H2,sprite_vert:G2,sprite_frag:W2},ve={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new Me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},Zn={basic:{uniforms:Kt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Kt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Kt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Kt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Kt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Kt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Kt([ve.points,ve.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Kt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Kt([ve.common,ve.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Kt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Kt([ve.sprite,ve.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:Kt([ve.common,ve.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:Kt([ve.lights,ve.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};Zn.physical={uniforms:Kt([Zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const qa={r:0,b:0,g:0},_r=new ri,X2=new pt;function $2(t,e,n,i,r,s,o){const a=new Ke(0);let l=s===!0?0:1,c,h,d=null,p=0,g=null;function x(m,u){let _=!1,v=u.isScene===!0?u.background:null;v&&v.isTexture&&(v=(u.backgroundBlurriness>0?n:e).get(v)),v===null?y(a,l):v&&v.isColor&&(y(v,1),_=!0);const S=t.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||_)&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),v&&(v.isCubeTexture||v.mapping===mc)?(h===void 0&&(h=new Je(new Bn(1,1,1),new or({name:"BackgroundCubeMaterial",uniforms:Ys(Zn.backgroundCube.uniforms),vertexShader:Zn.backgroundCube.vertexShader,fragmentShader:Zn.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,A,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),_r.copy(u.backgroundRotation),_r.x*=-1,_r.y*=-1,_r.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(X2.makeRotationFromEuler(_r)),h.material.toneMapped=it.getTransfer(v.colorSpace)!==ct,(d!==v||p!==v.version||g!==t.toneMapping)&&(h.material.needsUpdate=!0,d=v,p=v.version,g=t.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Je(new vc(2,2),new or({name:"BackgroundMaterial",uniforms:Ys(Zn.background.uniforms),vertexShader:Zn.background.vertexShader,fragmentShader:Zn.background.fragmentShader,side:sr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=it.getTransfer(v.colorSpace)!==ct,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(d!==v||p!==v.version||g!==t.toneMapping)&&(c.material.needsUpdate=!0,d=v,p=v.version,g=t.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function y(m,u){m.getRGB(qa,_x(t)),i.buffers.color.setClear(qa.r,qa.g,qa.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(m,u=1){a.set(m),l=u,y(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,y(a,l)},render:x}}function Y2(t,e,n,i){const r=t.getParameter(t.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},l=m(null);let c=l,h=!1;function d(L,$,j,ee,U){let z=!1;if(o){const W=y(ee,j,$);c!==W&&(c=W,g(c.object)),z=u(L,ee,j,U),z&&_(L,ee,j,U)}else{const W=$.wireframe===!0;(c.geometry!==ee.id||c.program!==j.id||c.wireframe!==W)&&(c.geometry=ee.id,c.program=j.id,c.wireframe=W,z=!0)}U!==null&&n.update(U,t.ELEMENT_ARRAY_BUFFER),(z||h)&&(h=!1,N(L,$,j,ee),U!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n.get(U).buffer))}function p(){return i.isWebGL2?t.createVertexArray():s.createVertexArrayOES()}function g(L){return i.isWebGL2?t.bindVertexArray(L):s.bindVertexArrayOES(L)}function x(L){return i.isWebGL2?t.deleteVertexArray(L):s.deleteVertexArrayOES(L)}function y(L,$,j){const ee=j.wireframe===!0;let U=a[L.id];U===void 0&&(U={},a[L.id]=U);let z=U[$.id];z===void 0&&(z={},U[$.id]=z);let W=z[ee];return W===void 0&&(W=m(p()),z[ee]=W),W}function m(L){const $=[],j=[],ee=[];for(let U=0;U<r;U++)$[U]=0,j[U]=0,ee[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:$,enabledAttributes:j,attributeDivisors:ee,object:L,attributes:{},index:null}}function u(L,$,j,ee){const U=c.attributes,z=$.attributes;let W=0;const re=j.getAttributes();for(const ue in re)if(re[ue].location>=0){const G=U[ue];let se=z[ue];if(se===void 0&&(ue==="instanceMatrix"&&L.instanceMatrix&&(se=L.instanceMatrix),ue==="instanceColor"&&L.instanceColor&&(se=L.instanceColor)),G===void 0||G.attribute!==se||se&&G.data!==se.data)return!0;W++}return c.attributesNum!==W||c.index!==ee}function _(L,$,j,ee){const U={},z=$.attributes;let W=0;const re=j.getAttributes();for(const ue in re)if(re[ue].location>=0){let G=z[ue];G===void 0&&(ue==="instanceMatrix"&&L.instanceMatrix&&(G=L.instanceMatrix),ue==="instanceColor"&&L.instanceColor&&(G=L.instanceColor));const se={};se.attribute=G,G&&G.data&&(se.data=G.data),U[ue]=se,W++}c.attributes=U,c.attributesNum=W,c.index=ee}function v(){const L=c.newAttributes;for(let $=0,j=L.length;$<j;$++)L[$]=0}function S(L){b(L,0)}function b(L,$){const j=c.newAttributes,ee=c.enabledAttributes,U=c.attributeDivisors;j[L]=1,ee[L]===0&&(t.enableVertexAttribArray(L),ee[L]=1),U[L]!==$&&((i.isWebGL2?t:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,$),U[L]=$)}function A(){const L=c.newAttributes,$=c.enabledAttributes;for(let j=0,ee=$.length;j<ee;j++)$[j]!==L[j]&&(t.disableVertexAttribArray(j),$[j]=0)}function w(L,$,j,ee,U,z,W){W===!0?t.vertexAttribIPointer(L,$,j,U,z):t.vertexAttribPointer(L,$,j,ee,U,z)}function N(L,$,j,ee){if(i.isWebGL2===!1&&(L.isInstancedMesh||ee.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const U=ee.attributes,z=j.getAttributes(),W=$.defaultAttributeValues;for(const re in z){const ue=z[re];if(ue.location>=0){let Ne=U[re];if(Ne===void 0&&(re==="instanceMatrix"&&L.instanceMatrix&&(Ne=L.instanceMatrix),re==="instanceColor"&&L.instanceColor&&(Ne=L.instanceColor)),Ne!==void 0){const G=Ne.normalized,se=Ne.itemSize,me=n.get(Ne);if(me===void 0)continue;const Re=me.buffer,Ae=me.type,ye=me.bytesPerElement,Ye=i.isWebGL2===!0&&(Ae===t.INT||Ae===t.UNSIGNED_INT||Ne.gpuType===ix);if(Ne.isInterleavedBufferAttribute){const De=Ne.data,O=De.stride,ot=Ne.offset;if(De.isInstancedInterleavedBuffer){for(let Ce=0;Ce<ue.locationSize;Ce++)b(ue.location+Ce,De.meshPerAttribute);L.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=De.meshPerAttribute*De.count)}else for(let Ce=0;Ce<ue.locationSize;Ce++)S(ue.location+Ce);t.bindBuffer(t.ARRAY_BUFFER,Re);for(let Ce=0;Ce<ue.locationSize;Ce++)w(ue.location+Ce,se/ue.locationSize,Ae,G,O*ye,(ot+se/ue.locationSize*Ce)*ye,Ye)}else{if(Ne.isInstancedBufferAttribute){for(let De=0;De<ue.locationSize;De++)b(ue.location+De,Ne.meshPerAttribute);L.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=Ne.meshPerAttribute*Ne.count)}else for(let De=0;De<ue.locationSize;De++)S(ue.location+De);t.bindBuffer(t.ARRAY_BUFFER,Re);for(let De=0;De<ue.locationSize;De++)w(ue.location+De,se/ue.locationSize,Ae,G,se*ye,se/ue.locationSize*De*ye,Ye)}}else if(W!==void 0){const G=W[re];if(G!==void 0)switch(G.length){case 2:t.vertexAttrib2fv(ue.location,G);break;case 3:t.vertexAttrib3fv(ue.location,G);break;case 4:t.vertexAttrib4fv(ue.location,G);break;default:t.vertexAttrib1fv(ue.location,G)}}}}A()}function q(){k();for(const L in a){const $=a[L];for(const j in $){const ee=$[j];for(const U in ee)x(ee[U].object),delete ee[U];delete $[j]}delete a[L]}}function M(L){if(a[L.id]===void 0)return;const $=a[L.id];for(const j in $){const ee=$[j];for(const U in ee)x(ee[U].object),delete ee[U];delete $[j]}delete a[L.id]}function R(L){for(const $ in a){const j=a[$];if(j[L.id]===void 0)continue;const ee=j[L.id];for(const U in ee)x(ee[U].object),delete ee[U];delete j[L.id]}}function k(){J(),h=!0,c!==l&&(c=l,g(c.object))}function J(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:k,resetDefaultState:J,dispose:q,releaseStatesOfGeometry:M,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:S,disableUnusedAttributes:A}}function q2(t,e,n,i){const r=i.isWebGL2;let s;function o(h){s=h}function a(h,d){t.drawArrays(s,h,d),n.update(d,s,1)}function l(h,d,p){if(p===0)return;let g,x;if(r)g=t,x="drawArraysInstanced";else if(g=e.get("ANGLE_instanced_arrays"),x="drawArraysInstancedANGLE",g===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[x](s,h,d,p),n.update(d,s,p)}function c(h,d,p){if(p===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let x=0;x<p;x++)this.render(h[x],d[x]);else{g.multiDrawArraysWEBGL(s,h,0,d,0,p);let x=0;for(let y=0;y<p;y++)x+=d[y];n.update(x,s,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function K2(t,e,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");i=t.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(w){if(w==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&t.constructor.name==="WebGL2RenderingContext";let a=n.precision!==void 0?n.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),h=n.logarithmicDepthBuffer===!0,d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_TEXTURE_SIZE),x=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),y=t.getParameter(t.MAX_VERTEX_ATTRIBS),m=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),u=t.getParameter(t.MAX_VARYING_VECTORS),_=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),v=p>0,S=o||e.has("OES_texture_float"),b=v&&S,A=o?t.getParameter(t.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:x,maxAttributes:y,maxVertexUniforms:m,maxVaryings:u,maxFragmentUniforms:_,vertexTextures:v,floatFragmentTextures:S,floatVertexTextures:b,maxSamples:A}}function Z2(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Fi,a=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,p){const g=d.length!==0||p||i!==0||r;return r=p,i=d.length,g},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,p){n=h(d,p,0)},this.setState=function(d,p,g){const x=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,u=t.get(d);if(!r||x===null||x.length===0||s&&!m)s?h(null):c();else{const _=s?0:i,v=_*4;let S=u.clippingState||null;l.value=S,S=h(x,p,v,g);for(let b=0;b!==v;++b)S[b]=n[b];u.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,p,g,x){const y=d!==null?d.length:0;let m=null;if(y!==0){if(m=l.value,x!==!0||m===null){const u=g+y*4,_=p.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<u)&&(m=new Float32Array(u));for(let v=0,S=g;v!==y;++v,S+=4)o.copy(d[v]).applyMatrix4(_,a),o.normal.toArray(m,S),m[S+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function J2(t){let e=new WeakMap;function n(o,a){return a===zd?o.mapping=Ws:a===Bd&&(o.mapping=Xs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===zd||a===Bd)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new lE(l.height);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Ex extends yx{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const ws=4,Om=[.125,.215,.35,.446,.526,.582],Cr=20,Eu=new Ex,Fm=new Ke;let wu=null,Tu=0,Cu=0;const wr=(1+Math.sqrt(5))/2,ds=1/wr,km=[new I(1,1,1),new I(-1,1,1),new I(1,1,-1),new I(-1,1,-1),new I(0,wr,ds),new I(0,wr,-ds),new I(ds,0,wr),new I(-ds,0,wr),new I(wr,ds,0),new I(-wr,ds,0)];class zm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){wu=this._renderer.getRenderTarget(),Tu=this._renderer.getActiveCubeFace(),Cu=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(wu,Tu,Cu),e.scissorTest=!1,Ka(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ws||e.mapping===Xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wu=this._renderer.getRenderTarget(),Tu=this._renderer.getActiveCubeFace(),Cu=this._renderer.getActiveMipmapLevel();const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:Qo,format:Vn,colorSpace:dr,depthBuffer:!1},r=Bm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Q2(s)),this._blurMaterial=eT(s,e,n)}return r}_compileMaterial(e){const n=new Je(this._lodPlanes[0],e);this._renderer.compile(n,Eu)}_sceneToCubeUV(e,n,i,r){const a=new xn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(Fm),h.toneMapping=tr,h.autoClear=!1;const g=new Oi({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1}),x=new Je(new Bn,g);let y=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,y=!0):(g.color.copy(Fm),y=!0);for(let u=0;u<6;u++){const _=u%3;_===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):_===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const v=this._cubeSize;Ka(r,_*v,u>2?v:0,v,v),h.setRenderTarget(r),y&&h.render(x,a),h.render(e,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=p,h.autoClear=d,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Ws||e.mapping===Xs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jm());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Je(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Ka(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Eu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=km[(r-1)%km.length];this._blur(e,r-1,r,s,o)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Je(this._lodPlanes[r],c),p=c.uniforms,g=this._sizeLods[i]-1,x=isFinite(s)?Math.PI/(2*g):2*Math.PI/(2*Cr-1),y=s/x,m=isFinite(s)?1+Math.floor(h*y):Cr;m>Cr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Cr}`);const u=[];let _=0;for(let w=0;w<Cr;++w){const N=w/y,q=Math.exp(-N*N/2);u.push(q),w===0?_+=q:w<m&&(_+=2*q)}for(let w=0;w<u.length;w++)u[w]=u[w]/_;p.envMap.value=e.texture,p.samples.value=m,p.weights.value=u,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:v}=this;p.dTheta.value=x,p.mipInt.value=v-i;const S=this._sizeLods[r],b=3*S*(r>v-ws?r-v+ws:0),A=4*(this._cubeSize-S);Ka(n,b,A,3*S,2*S),l.setRenderTarget(n),l.render(d,Eu)}}function Q2(t){const e=[],n=[],i=[];let r=t;const s=t-ws+1+Om.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-ws?l=Om[o-t+ws-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),h=-c,d=1+c,p=[h,h,d,h,d,d,h,h,d,d,h,d],g=6,x=6,y=3,m=2,u=1,_=new Float32Array(y*x*g),v=new Float32Array(m*x*g),S=new Float32Array(u*x*g);for(let A=0;A<g;A++){const w=A%3*2/3-1,N=A>2?0:-1,q=[w,N,0,w+2/3,N,0,w+2/3,N+1,0,w,N,0,w+2/3,N+1,0,w,N+1,0];_.set(q,y*x*A),v.set(p,m*x*A);const M=[A,A,A,A,A,A];S.set(M,u*x*A)}const b=new Xn;b.setAttribute("position",new ii(_,y)),b.setAttribute("uv",new ii(v,m)),b.setAttribute("faceIndex",new ii(S,u)),e.push(b),r>ws&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Bm(t,e,n){const i=new jr(t,e,n);return i.texture.mapping=mc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ka(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function eT(t,e,n){const i=new Float32Array(Cr),r=new I(0,1,0);return new or({name:"SphericalGaussianBlur",defines:{n:Cr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function jm(){return new or({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function Vm(){return new or({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:er,depthTest:!1,depthWrite:!1})}function nh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function tT(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===zd||l===Bd,h=l===Ws||l===Xs;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=e.get(a);return n===null&&(n=new zm(t)),d=c?n.fromEquirectangular(a,d):n.fromCubemap(a,d),e.set(a,d),d.texture}else{if(e.has(a))return e.get(a).texture;{const d=a.image;if(c&&d&&d.height>0||h&&d&&r(d)){n===null&&(n=new zm(t));const p=c?n.fromEquirectangular(a):n.fromCubemap(a);return e.set(a,p),a.addEventListener("dispose",s),p.texture}else return null}}}return a}function r(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function nT(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(i){i.isWebGL2?(n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance")):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(i){const r=n(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function iT(t,e,n,i){const r={},s=new WeakMap;function o(d){const p=d.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);for(const x in p.morphAttributes){const y=p.morphAttributes[x];for(let m=0,u=y.length;m<u;m++)e.remove(y[m])}p.removeEventListener("dispose",o),delete r[p.id];const g=s.get(p);g&&(e.remove(g),s.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,n.memory.geometries--}function a(d,p){return r[p.id]===!0||(p.addEventListener("dispose",o),r[p.id]=!0,n.memory.geometries++),p}function l(d){const p=d.attributes;for(const x in p)e.update(p[x],t.ARRAY_BUFFER);const g=d.morphAttributes;for(const x in g){const y=g[x];for(let m=0,u=y.length;m<u;m++)e.update(y[m],t.ARRAY_BUFFER)}}function c(d){const p=[],g=d.index,x=d.attributes.position;let y=0;if(g!==null){const _=g.array;y=g.version;for(let v=0,S=_.length;v<S;v+=3){const b=_[v+0],A=_[v+1],w=_[v+2];p.push(b,A,A,w,w,b)}}else if(x!==void 0){const _=x.array;y=x.version;for(let v=0,S=_.length/3-1;v<S;v+=3){const b=v+0,A=v+1,w=v+2;p.push(b,A,A,w,w,b)}}else return;const m=new(fx(p)?xx:vx)(p,1);m.version=y;const u=s.get(d);u&&e.remove(u),s.set(d,m)}function h(d){const p=s.get(d);if(p){const g=d.index;g!==null&&p.version<g.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function rT(t,e,n,i){const r=i.isWebGL2;let s;function o(g){s=g}let a,l;function c(g){a=g.type,l=g.bytesPerElement}function h(g,x){t.drawElements(s,x,a,g*l),n.update(x,s,1)}function d(g,x,y){if(y===0)return;let m,u;if(r)m=t,u="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[u](s,x,a,g*l,y),n.update(x,s,y)}function p(g,x,y){if(y===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<y;u++)this.render(g[u]/l,x[u]);else{m.multiDrawElementsWEBGL(s,x,0,a,g,0,y);let u=0;for(let _=0;_<y;_++)u+=x[_];n.update(u,s,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=d,this.renderMultiDraw=p}function sT(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function oT(t,e){return t[0]-e[0]}function aT(t,e){return Math.abs(e[1])-Math.abs(t[1])}function lT(t,e,n){const i={},r=new Float32Array(8),s=new WeakMap,o=new ht,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,d){const p=c.morphTargetInfluences;if(e.isWebGL2===!0){const x=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,y=x!==void 0?x.length:0;let m=s.get(h);if(m===void 0||m.count!==y){let J=function(){R.dispose(),s.delete(h),h.removeEventListener("dispose",J)};var g=J;m!==void 0&&m.texture.dispose();const u=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,v=h.morphAttributes.color!==void 0,S=h.morphAttributes.position||[],b=h.morphAttributes.normal||[],A=h.morphAttributes.color||[];let w=0;u===!0&&(w=1),_===!0&&(w=2),v===!0&&(w=3);let N=h.attributes.position.count*w,q=1;N>e.maxTextureSize&&(q=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const M=new Float32Array(N*q*4*y),R=new mx(M,N,q,y);R.type=mi,R.needsUpdate=!0;const k=w*4;for(let L=0;L<y;L++){const $=S[L],j=b[L],ee=A[L],U=N*q*4*L;for(let z=0;z<$.count;z++){const W=z*k;u===!0&&(o.fromBufferAttribute($,z),M[U+W+0]=o.x,M[U+W+1]=o.y,M[U+W+2]=o.z,M[U+W+3]=0),_===!0&&(o.fromBufferAttribute(j,z),M[U+W+4]=o.x,M[U+W+5]=o.y,M[U+W+6]=o.z,M[U+W+7]=0),v===!0&&(o.fromBufferAttribute(ee,z),M[U+W+8]=o.x,M[U+W+9]=o.y,M[U+W+10]=o.z,M[U+W+11]=ee.itemSize===4?o.w:1)}}m={count:y,texture:R,size:new Me(N,q)},s.set(h,m),h.addEventListener("dispose",J)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)d.getUniforms().setValue(t,"morphTexture",c.morphTexture,n);else{let u=0;for(let v=0;v<p.length;v++)u+=p[v];const _=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(t,"morphTargetBaseInfluence",_),d.getUniforms().setValue(t,"morphTargetInfluences",p)}d.getUniforms().setValue(t,"morphTargetsTexture",m.texture,n),d.getUniforms().setValue(t,"morphTargetsTextureSize",m.size)}else{const x=p===void 0?0:p.length;let y=i[h.id];if(y===void 0||y.length!==x){y=[];for(let S=0;S<x;S++)y[S]=[S,0];i[h.id]=y}for(let S=0;S<x;S++){const b=y[S];b[0]=S,b[1]=p[S]}y.sort(aT);for(let S=0;S<8;S++)S<x&&y[S][1]?(a[S][0]=y[S][0],a[S][1]=y[S][1]):(a[S][0]=Number.MAX_SAFE_INTEGER,a[S][1]=0);a.sort(oT);const m=h.morphAttributes.position,u=h.morphAttributes.normal;let _=0;for(let S=0;S<8;S++){const b=a[S],A=b[0],w=b[1];A!==Number.MAX_SAFE_INTEGER&&w?(m&&h.getAttribute("morphTarget"+S)!==m[A]&&h.setAttribute("morphTarget"+S,m[A]),u&&h.getAttribute("morphNormal"+S)!==u[A]&&h.setAttribute("morphNormal"+S,u[A]),r[S]=w,_+=w):(m&&h.hasAttribute("morphTarget"+S)===!0&&h.deleteAttribute("morphTarget"+S),u&&h.hasAttribute("morphNormal"+S)===!0&&h.deleteAttribute("morphNormal"+S),r[S]=0)}const v=h.morphTargetsRelative?1:1-_;d.getUniforms().setValue(t,"morphTargetBaseInfluence",v),d.getUniforms().setValue(t,"morphTargetInfluences",r)}}return{update:l}}function cT(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,d=e.get(l,h);if(r.get(d)!==c&&(e.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;r.get(p)!==c&&(p.update(),r.set(p,c))}return d}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}class wx extends fn{constructor(e,n,i,r,s,o,a,l,c,h){if(h=h!==void 0?h:Ir,h!==Ir&&h!==$s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ir&&(i=Gi),i===void 0&&h===$s&&(i=Dr),super(null,r,s,o,a,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:Jt,this.minFilter=l!==void 0?l:Jt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const Tx=new fn,Cx=new wx(1,1);Cx.compareFunction=dx;const Ax=new mx,bx=new WM,Rx=new Sx,Hm=[],Gm=[],Wm=new Float32Array(16),Xm=new Float32Array(9),$m=new Float32Array(4);function Qs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Hm[r];if(s===void 0&&(s=new Float32Array(r),Hm[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Lt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Nt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function xc(t,e){let n=Gm[e];n===void 0&&(n=new Int32Array(e),Gm[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function uT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function dT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2fv(this.addr,e),Nt(n,e)}}function fT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Lt(n,e))return;t.uniform3fv(this.addr,e),Nt(n,e)}}function hT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4fv(this.addr,e),Nt(n,e)}}function pT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Nt(n,e)}else{if(Lt(n,i))return;$m.set(i),t.uniformMatrix2fv(this.addr,!1,$m),Nt(n,i)}}function mT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Nt(n,e)}else{if(Lt(n,i))return;Xm.set(i),t.uniformMatrix3fv(this.addr,!1,Xm),Nt(n,i)}}function gT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Nt(n,e)}else{if(Lt(n,i))return;Wm.set(i),t.uniformMatrix4fv(this.addr,!1,Wm),Nt(n,i)}}function vT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function xT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2iv(this.addr,e),Nt(n,e)}}function _T(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3iv(this.addr,e),Nt(n,e)}}function yT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4iv(this.addr,e),Nt(n,e)}}function ST(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function MT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2uiv(this.addr,e),Nt(n,e)}}function ET(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3uiv(this.addr,e),Nt(n,e)}}function wT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4uiv(this.addr,e),Nt(n,e)}}function TT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);const s=this.type===t.SAMPLER_2D_SHADOW?Cx:Tx;n.setTexture2D(e||s,r)}function CT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||bx,r)}function AT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Rx,r)}function bT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Ax,r)}function RT(t){switch(t){case 5126:return uT;case 35664:return dT;case 35665:return fT;case 35666:return hT;case 35674:return pT;case 35675:return mT;case 35676:return gT;case 5124:case 35670:return vT;case 35667:case 35671:return xT;case 35668:case 35672:return _T;case 35669:case 35673:return yT;case 5125:return ST;case 36294:return MT;case 36295:return ET;case 36296:return wT;case 35678:case 36198:case 36298:case 36306:case 35682:return TT;case 35679:case 36299:case 36307:return CT;case 35680:case 36300:case 36308:case 36293:return AT;case 36289:case 36303:case 36311:case 36292:return bT}}function PT(t,e){t.uniform1fv(this.addr,e)}function LT(t,e){const n=Qs(e,this.size,2);t.uniform2fv(this.addr,n)}function NT(t,e){const n=Qs(e,this.size,3);t.uniform3fv(this.addr,n)}function DT(t,e){const n=Qs(e,this.size,4);t.uniform4fv(this.addr,n)}function IT(t,e){const n=Qs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function UT(t,e){const n=Qs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function OT(t,e){const n=Qs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function FT(t,e){t.uniform1iv(this.addr,e)}function kT(t,e){t.uniform2iv(this.addr,e)}function zT(t,e){t.uniform3iv(this.addr,e)}function BT(t,e){t.uniform4iv(this.addr,e)}function jT(t,e){t.uniform1uiv(this.addr,e)}function VT(t,e){t.uniform2uiv(this.addr,e)}function HT(t,e){t.uniform3uiv(this.addr,e)}function GT(t,e){t.uniform4uiv(this.addr,e)}function WT(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||Tx,s[o])}function XT(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||bx,s[o])}function $T(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||Rx,s[o])}function YT(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||Ax,s[o])}function qT(t){switch(t){case 5126:return PT;case 35664:return LT;case 35665:return NT;case 35666:return DT;case 35674:return IT;case 35675:return UT;case 35676:return OT;case 5124:case 35670:return FT;case 35667:case 35671:return kT;case 35668:case 35672:return zT;case 35669:case 35673:return BT;case 5125:return jT;case 36294:return VT;case 36295:return HT;case 36296:return GT;case 35678:case 36198:case 36298:case 36306:case 35682:return WT;case 35679:case 36299:case 36307:return XT;case 35680:case 36300:case 36308:case 36293:return $T;case 36289:case 36303:case 36311:case 36292:return YT}}class KT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=RT(n.type)}}class ZT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=qT(n.type)}}class JT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const Au=/(\w+)(\])?(\[|\.)?/g;function Ym(t,e){t.seq.push(e),t.map[e.id]=e}function QT(t,e,n){const i=t.name,r=i.length;for(Au.lastIndex=0;;){const s=Au.exec(i),o=Au.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Ym(n,c===void 0?new KT(a,t,e):new ZT(a,t,e));break}else{let d=n.map[a];d===void 0&&(d=new JT(a),Ym(n,d)),n=d}}}class pl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);QT(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function qm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const eC=37297;let tC=0;function nC(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}function iC(t){const e=it.getPrimaries(it.workingColorSpace),n=it.getPrimaries(t);let i;switch(e===n?i="":e===Xl&&n===Wl?i="LinearDisplayP3ToLinearSRGB":e===Wl&&n===Xl&&(i="LinearSRGBToLinearDisplayP3"),t){case dr:case gc:return[i,"LinearTransferOETF"];case Kn:case Zf:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Km(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+nC(t.getShaderSource(e),o)}else return r}function rC(t,e){const n=iC(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function sC(t,e){let n;switch(e){case fM:n="Linear";break;case hM:n="Reinhard";break;case pM:n="OptimizedCineon";break;case mM:n="ACESFilmic";break;case vM:n="AgX";break;case xM:n="Neutral";break;case gM:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function oC(t){return[t.extensionDerivatives||t.envMapCubeUVHeight||t.bumpMap||t.normalMapTangentSpace||t.clearcoatNormalMap||t.flatShading||t.alphaToCoverage||t.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(t.extensionFragDepth||t.logarithmicDepthBuffer)&&t.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",t.extensionDrawBuffers&&t.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(t.extensionShaderTextureLOD||t.envMap||t.transmission)&&t.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ts).join(`
`)}function aC(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ts).join(`
`)}function lC(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function cC(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Ts(t){return t!==""}function Zm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const uC=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xd(t){return t.replace(uC,fC)}const dC=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function fC(t,e){let n=He[e];if(n===void 0){const i=dC.get(e);if(i!==void 0)n=He[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Xd(n)}const hC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qm(t){return t.replace(hC,pC)}function pC(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function eg(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	`;return t.isWebGL2&&(e+=`precision ${t.precision} sampler3D;
		precision ${t.precision} sampler2DArray;
		precision ${t.precision} sampler2DShadow;
		precision ${t.precision} samplerCubeShadow;
		precision ${t.precision} sampler2DArrayShadow;
		precision ${t.precision} isampler2D;
		precision ${t.precision} isampler3D;
		precision ${t.precision} isamplerCube;
		precision ${t.precision} isampler2DArray;
		precision ${t.precision} usampler2D;
		precision ${t.precision} usampler3D;
		precision ${t.precision} usamplerCube;
		precision ${t.precision} usampler2DArray;
		`),t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function mC(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Qv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===ex?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===di&&(e="SHADOWMAP_TYPE_VSM"),e}function gC(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Ws:case Xs:e="ENVMAP_TYPE_CUBE";break;case mc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function vC(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Xs:e="ENVMAP_MODE_REFRACTION";break}return e}function xC(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case tx:e="ENVMAP_BLENDING_MULTIPLY";break;case uM:e="ENVMAP_BLENDING_MIX";break;case dM:e="ENVMAP_BLENDING_ADD";break}return e}function _C(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function yC(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=mC(n),c=gC(n),h=vC(n),d=xC(n),p=_C(n),g=n.isWebGL2?"":oC(n),x=aC(n),y=lC(s),m=r.createProgram();let u,_,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,y].filter(Ts).join(`
`),u.length>0&&(u+=`
`),_=[g,"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,y].filter(Ts).join(`
`),_.length>0&&(_+=`
`)):(u=[eg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,y,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors&&n.isWebGL2?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ts).join(`
`),_=[g,eg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,y,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+h:"",n.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==tr?"#define TONE_MAPPING":"",n.toneMapping!==tr?He.tonemapping_pars_fragment:"",n.toneMapping!==tr?sC("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,rC("linearToOutputTexel",n.outputColorSpace),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Ts).join(`
`)),o=Xd(o),o=Zm(o,n),o=Jm(o,n),a=Xd(a),a=Zm(a,n),a=Jm(a,n),o=Qm(o),a=Qm(a),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,u=[x,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,_=["precision mediump sampler2DArray;","#define varying in",n.glslVersion===gm?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===gm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const S=v+u+o,b=v+_+a,A=qm(r,r.VERTEX_SHADER,S),w=qm(r,r.FRAGMENT_SHADER,b);r.attachShader(m,A),r.attachShader(m,w),n.index0AttributeName!==void 0?r.bindAttribLocation(m,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(m,0,"position"),r.linkProgram(m);function N(k){if(t.debug.checkShaderErrors){const J=r.getProgramInfoLog(m).trim(),L=r.getShaderInfoLog(A).trim(),$=r.getShaderInfoLog(w).trim();let j=!0,ee=!0;if(r.getProgramParameter(m,r.LINK_STATUS)===!1)if(j=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,m,A,w);else{const U=Km(r,A,"vertex"),z=Km(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(m,r.VALIDATE_STATUS)+`

Material Name: `+k.name+`
Material Type: `+k.type+`

Program Info Log: `+J+`
`+U+`
`+z)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(L===""||$==="")&&(ee=!1);ee&&(k.diagnostics={runnable:j,programLog:J,vertexShader:{log:L,prefix:u},fragmentShader:{log:$,prefix:_}})}r.deleteShader(A),r.deleteShader(w),q=new pl(r,m),M=cC(r,m)}let q;this.getUniforms=function(){return q===void 0&&N(this),q};let M;this.getAttributes=function(){return M===void 0&&N(this),M};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(m,eC)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=tC++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=A,this.fragmentShader=w,this}let SC=0;class MC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new EC(e),n.set(e,i)),i}}class EC{constructor(e){this.id=SC++,this.code=e,this.usedTimes=0}}function wC(t,e,n,i,r,s,o){const a=new eh,l=new MC,c=new Set,h=[],d=r.isWebGL2,p=r.logarithmicDepthBuffer,g=r.vertexTextures;let x=r.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(M){return c.add(M),M===0?"uv":`uv${M}`}function u(M,R,k,J,L){const $=J.fog,j=L.geometry,ee=M.isMeshStandardMaterial?J.environment:null,U=(M.isMeshStandardMaterial?n:e).get(M.envMap||ee),z=U&&U.mapping===mc?U.image.height:null,W=y[M.type];M.precision!==null&&(x=r.getMaxPrecision(M.precision),x!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",x,"instead."));const re=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ue=re!==void 0?re.length:0;let Ne=0;j.morphAttributes.position!==void 0&&(Ne=1),j.morphAttributes.normal!==void 0&&(Ne=2),j.morphAttributes.color!==void 0&&(Ne=3);let G,se,me,Re;if(W){const tt=Zn[W];G=tt.vertexShader,se=tt.fragmentShader}else G=M.vertexShader,se=M.fragmentShader,l.update(M),me=l.getVertexShaderID(M),Re=l.getFragmentShaderID(M);const Ae=t.getRenderTarget(),ye=L.isInstancedMesh===!0,Ye=L.isBatchedMesh===!0,De=!!M.map,O=!!M.matcap,ot=!!U,Ce=!!M.aoMap,Oe=!!M.lightMap,K=!!M.bumpMap,he=!!M.normalMap,B=!!M.displacementMap,ne=!!M.emissiveMap,ge=!!M.metalnessMap,C=!!M.roughnessMap,E=M.anisotropy>0,H=M.clearcoat>0,te=M.iridescence>0,oe=M.sheen>0,ae=M.transmission>0,Fe=E&&!!M.anisotropyMap,Ie=H&&!!M.clearcoatMap,pe=H&&!!M.clearcoatNormalMap,xe=H&&!!M.clearcoatRoughnessMap,ze=te&&!!M.iridescenceMap,fe=te&&!!M.iridescenceThicknessMap,_t=oe&&!!M.sheenColorMap,We=oe&&!!M.sheenRoughnessMap,Le=!!M.specularMap,we=!!M.specularColorMap,be=!!M.specularIntensityMap,P=ae&&!!M.transmissionMap,ie=ae&&!!M.thicknessMap,Te=!!M.gradientMap,D=!!M.alphaMap,de=M.alphaTest>0,V=!!M.alphaHash,le=!!M.extensions;let _e=tr;M.toneMapped&&(Ae===null||Ae.isXRRenderTarget===!0)&&(_e=t.toneMapping);const $e={isWebGL2:d,shaderID:W,shaderType:M.type,shaderName:M.name,vertexShader:G,fragmentShader:se,defines:M.defines,customVertexShaderID:me,customFragmentShaderID:Re,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:x,batching:Ye,instancing:ye,instancingColor:ye&&L.instanceColor!==null,instancingMorph:ye&&L.morphTexture!==null,supportsVertexTextures:g,outputColorSpace:Ae===null?t.outputColorSpace:Ae.isXRRenderTarget===!0?Ae.texture.colorSpace:dr,alphaToCoverage:!!M.alphaToCoverage,map:De,matcap:O,envMap:ot,envMapMode:ot&&U.mapping,envMapCubeUVHeight:z,aoMap:Ce,lightMap:Oe,bumpMap:K,normalMap:he,displacementMap:g&&B,emissiveMap:ne,normalMapObjectSpace:he&&M.normalMapType===RM,normalMapTangentSpace:he&&M.normalMapType===ux,metalnessMap:ge,roughnessMap:C,anisotropy:E,anisotropyMap:Fe,clearcoat:H,clearcoatMap:Ie,clearcoatNormalMap:pe,clearcoatRoughnessMap:xe,iridescence:te,iridescenceMap:ze,iridescenceThicknessMap:fe,sheen:oe,sheenColorMap:_t,sheenRoughnessMap:We,specularMap:Le,specularColorMap:we,specularIntensityMap:be,transmission:ae,transmissionMap:P,thicknessMap:ie,gradientMap:Te,opaque:M.transparent===!1&&M.blending===Ds&&M.alphaToCoverage===!1,alphaMap:D,alphaTest:de,alphaHash:V,combine:M.combine,mapUv:De&&m(M.map.channel),aoMapUv:Ce&&m(M.aoMap.channel),lightMapUv:Oe&&m(M.lightMap.channel),bumpMapUv:K&&m(M.bumpMap.channel),normalMapUv:he&&m(M.normalMap.channel),displacementMapUv:B&&m(M.displacementMap.channel),emissiveMapUv:ne&&m(M.emissiveMap.channel),metalnessMapUv:ge&&m(M.metalnessMap.channel),roughnessMapUv:C&&m(M.roughnessMap.channel),anisotropyMapUv:Fe&&m(M.anisotropyMap.channel),clearcoatMapUv:Ie&&m(M.clearcoatMap.channel),clearcoatNormalMapUv:pe&&m(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ze&&m(M.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&m(M.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&m(M.sheenColorMap.channel),sheenRoughnessMapUv:We&&m(M.sheenRoughnessMap.channel),specularMapUv:Le&&m(M.specularMap.channel),specularColorMapUv:we&&m(M.specularColorMap.channel),specularIntensityMapUv:be&&m(M.specularIntensityMap.channel),transmissionMapUv:P&&m(M.transmissionMap.channel),thicknessMapUv:ie&&m(M.thicknessMap.channel),alphaMapUv:D&&m(M.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(he||E),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!j.attributes.uv&&(De||D),fog:!!$,useFog:M.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:p,skinning:L.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:Ne,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:t.shadowMap.enabled&&k.length>0,shadowMapType:t.shadowMap.type,toneMapping:_e,useLegacyLights:t._useLegacyLights,decodeVideoTexture:De&&M.map.isVideoTexture===!0&&it.getTransfer(M.map.colorSpace)===ct,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===pi,flipSided:M.side===dn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:le&&M.extensions.derivatives===!0,extensionFragDepth:le&&M.extensions.fragDepth===!0,extensionDrawBuffers:le&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:le&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:le&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:le&&M.extensions.multiDraw===!0&&i.has("WEBGL_multi_draw"),rendererExtensionFragDepth:d||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return $e.vertexUv1s=c.has(1),$e.vertexUv2s=c.has(2),$e.vertexUv3s=c.has(3),c.clear(),$e}function _(M){const R=[];if(M.shaderID?R.push(M.shaderID):(R.push(M.customVertexShaderID),R.push(M.customFragmentShaderID)),M.defines!==void 0)for(const k in M.defines)R.push(k),R.push(M.defines[k]);return M.isRawShaderMaterial===!1&&(v(R,M),S(R,M),R.push(t.outputColorSpace)),R.push(M.customProgramCacheKey),R.join()}function v(M,R){M.push(R.precision),M.push(R.outputColorSpace),M.push(R.envMapMode),M.push(R.envMapCubeUVHeight),M.push(R.mapUv),M.push(R.alphaMapUv),M.push(R.lightMapUv),M.push(R.aoMapUv),M.push(R.bumpMapUv),M.push(R.normalMapUv),M.push(R.displacementMapUv),M.push(R.emissiveMapUv),M.push(R.metalnessMapUv),M.push(R.roughnessMapUv),M.push(R.anisotropyMapUv),M.push(R.clearcoatMapUv),M.push(R.clearcoatNormalMapUv),M.push(R.clearcoatRoughnessMapUv),M.push(R.iridescenceMapUv),M.push(R.iridescenceThicknessMapUv),M.push(R.sheenColorMapUv),M.push(R.sheenRoughnessMapUv),M.push(R.specularMapUv),M.push(R.specularColorMapUv),M.push(R.specularIntensityMapUv),M.push(R.transmissionMapUv),M.push(R.thicknessMapUv),M.push(R.combine),M.push(R.fogExp2),M.push(R.sizeAttenuation),M.push(R.morphTargetsCount),M.push(R.morphAttributeCount),M.push(R.numDirLights),M.push(R.numPointLights),M.push(R.numSpotLights),M.push(R.numSpotLightMaps),M.push(R.numHemiLights),M.push(R.numRectAreaLights),M.push(R.numDirLightShadows),M.push(R.numPointLightShadows),M.push(R.numSpotLightShadows),M.push(R.numSpotLightShadowsWithMaps),M.push(R.numLightProbes),M.push(R.shadowMapType),M.push(R.toneMapping),M.push(R.numClippingPlanes),M.push(R.numClipIntersection),M.push(R.depthPacking)}function S(M,R){a.disableAll(),R.isWebGL2&&a.enable(0),R.supportsVertexTextures&&a.enable(1),R.instancing&&a.enable(2),R.instancingColor&&a.enable(3),R.instancingMorph&&a.enable(4),R.matcap&&a.enable(5),R.envMap&&a.enable(6),R.normalMapObjectSpace&&a.enable(7),R.normalMapTangentSpace&&a.enable(8),R.clearcoat&&a.enable(9),R.iridescence&&a.enable(10),R.alphaTest&&a.enable(11),R.vertexColors&&a.enable(12),R.vertexAlphas&&a.enable(13),R.vertexUv1s&&a.enable(14),R.vertexUv2s&&a.enable(15),R.vertexUv3s&&a.enable(16),R.vertexTangents&&a.enable(17),R.anisotropy&&a.enable(18),R.alphaHash&&a.enable(19),R.batching&&a.enable(20),M.push(a.mask),a.disableAll(),R.fog&&a.enable(0),R.useFog&&a.enable(1),R.flatShading&&a.enable(2),R.logarithmicDepthBuffer&&a.enable(3),R.skinning&&a.enable(4),R.morphTargets&&a.enable(5),R.morphNormals&&a.enable(6),R.morphColors&&a.enable(7),R.premultipliedAlpha&&a.enable(8),R.shadowMapEnabled&&a.enable(9),R.useLegacyLights&&a.enable(10),R.doubleSided&&a.enable(11),R.flipSided&&a.enable(12),R.useDepthPacking&&a.enable(13),R.dithering&&a.enable(14),R.transmission&&a.enable(15),R.sheen&&a.enable(16),R.opaque&&a.enable(17),R.pointsUvs&&a.enable(18),R.decodeVideoTexture&&a.enable(19),R.alphaToCoverage&&a.enable(20),M.push(a.mask)}function b(M){const R=y[M.type];let k;if(R){const J=Zn[R];k=rE.clone(J.uniforms)}else k=M.uniforms;return k}function A(M,R){let k;for(let J=0,L=h.length;J<L;J++){const $=h[J];if($.cacheKey===R){k=$,++k.usedTimes;break}}return k===void 0&&(k=new yC(t,R,M,s),h.push(k)),k}function w(M){if(--M.usedTimes===0){const R=h.indexOf(M);h[R]=h[h.length-1],h.pop(),M.destroy()}}function N(M){l.remove(M)}function q(){l.dispose()}return{getParameters:u,getProgramCacheKey:_,getUniforms:b,acquireProgram:A,releaseProgram:w,releaseShaderCache:N,programs:h,dispose:q}}function TC(){let t=new WeakMap;function e(s){let o=t.get(s);return o===void 0&&(o={},t.set(s,o)),o}function n(s){t.delete(s)}function i(s,o,a){t.get(s)[o]=a}function r(){t=new WeakMap}return{get:e,remove:n,update:i,dispose:r}}function CC(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function tg(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function ng(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(d,p,g,x,y,m){let u=t[e];return u===void 0?(u={id:d.id,object:d,geometry:p,material:g,groupOrder:x,renderOrder:d.renderOrder,z:y,group:m},t[e]=u):(u.id=d.id,u.object=d,u.geometry=p,u.material=g,u.groupOrder=x,u.renderOrder=d.renderOrder,u.z=y,u.group=m),e++,u}function a(d,p,g,x,y,m){const u=o(d,p,g,x,y,m);g.transmission>0?i.push(u):g.transparent===!0?r.push(u):n.push(u)}function l(d,p,g,x,y,m){const u=o(d,p,g,x,y,m);g.transmission>0?i.unshift(u):g.transparent===!0?r.unshift(u):n.unshift(u)}function c(d,p){n.length>1&&n.sort(d||CC),i.length>1&&i.sort(p||tg),r.length>1&&r.sort(p||tg)}function h(){for(let d=e,p=t.length;d<p;d++){const g=t[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:h,sort:c}}function AC(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new ng,t.set(i,[o])):r>=s.length?(o=new ng,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function bC(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new I,color:new Ke};break;case"SpotLight":n={position:new I,direction:new I,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new I,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":n={direction:new I,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":n={color:new Ke,position:new I,halfWidth:new I,halfHeight:new I};break}return t[e.id]=n,n}}}function RC(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"SpotLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"PointLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let PC=0;function LC(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function NC(t,e){const n=new bC,i=RC(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)r.probe.push(new I);const s=new I,o=new pt,a=new pt;function l(h,d){let p=0,g=0,x=0;for(let k=0;k<9;k++)r.probe[k].set(0,0,0);let y=0,m=0,u=0,_=0,v=0,S=0,b=0,A=0,w=0,N=0,q=0;h.sort(LC);const M=d===!0?Math.PI:1;for(let k=0,J=h.length;k<J;k++){const L=h[k],$=L.color,j=L.intensity,ee=L.distance,U=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)p+=$.r*j*M,g+=$.g*j*M,x+=$.b*j*M;else if(L.isLightProbe){for(let z=0;z<9;z++)r.probe[z].addScaledVector(L.sh.coefficients[z],j);q++}else if(L.isDirectionalLight){const z=n.get(L);if(z.color.copy(L.color).multiplyScalar(L.intensity*M),L.castShadow){const W=L.shadow,re=i.get(L);re.shadowBias=W.bias,re.shadowNormalBias=W.normalBias,re.shadowRadius=W.radius,re.shadowMapSize=W.mapSize,r.directionalShadow[y]=re,r.directionalShadowMap[y]=U,r.directionalShadowMatrix[y]=L.shadow.matrix,S++}r.directional[y]=z,y++}else if(L.isSpotLight){const z=n.get(L);z.position.setFromMatrixPosition(L.matrixWorld),z.color.copy($).multiplyScalar(j*M),z.distance=ee,z.coneCos=Math.cos(L.angle),z.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),z.decay=L.decay,r.spot[u]=z;const W=L.shadow;if(L.map&&(r.spotLightMap[w]=L.map,w++,W.updateMatrices(L),L.castShadow&&N++),r.spotLightMatrix[u]=W.matrix,L.castShadow){const re=i.get(L);re.shadowBias=W.bias,re.shadowNormalBias=W.normalBias,re.shadowRadius=W.radius,re.shadowMapSize=W.mapSize,r.spotShadow[u]=re,r.spotShadowMap[u]=U,A++}u++}else if(L.isRectAreaLight){const z=n.get(L);z.color.copy($).multiplyScalar(j),z.halfWidth.set(L.width*.5,0,0),z.halfHeight.set(0,L.height*.5,0),r.rectArea[_]=z,_++}else if(L.isPointLight){const z=n.get(L);if(z.color.copy(L.color).multiplyScalar(L.intensity*M),z.distance=L.distance,z.decay=L.decay,L.castShadow){const W=L.shadow,re=i.get(L);re.shadowBias=W.bias,re.shadowNormalBias=W.normalBias,re.shadowRadius=W.radius,re.shadowMapSize=W.mapSize,re.shadowCameraNear=W.camera.near,re.shadowCameraFar=W.camera.far,r.pointShadow[m]=re,r.pointShadowMap[m]=U,r.pointShadowMatrix[m]=L.shadow.matrix,b++}r.point[m]=z,m++}else if(L.isHemisphereLight){const z=n.get(L);z.skyColor.copy(L.color).multiplyScalar(j*M),z.groundColor.copy(L.groundColor).multiplyScalar(j*M),r.hemi[v]=z,v++}}_>0&&(e.isWebGL2?t.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ve.LTC_FLOAT_1,r.rectAreaLTC2=ve.LTC_FLOAT_2):(r.rectAreaLTC1=ve.LTC_HALF_1,r.rectAreaLTC2=ve.LTC_HALF_2):t.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ve.LTC_FLOAT_1,r.rectAreaLTC2=ve.LTC_FLOAT_2):t.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=ve.LTC_HALF_1,r.rectAreaLTC2=ve.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=p,r.ambient[1]=g,r.ambient[2]=x;const R=r.hash;(R.directionalLength!==y||R.pointLength!==m||R.spotLength!==u||R.rectAreaLength!==_||R.hemiLength!==v||R.numDirectionalShadows!==S||R.numPointShadows!==b||R.numSpotShadows!==A||R.numSpotMaps!==w||R.numLightProbes!==q)&&(r.directional.length=y,r.spot.length=u,r.rectArea.length=_,r.point.length=m,r.hemi.length=v,r.directionalShadow.length=S,r.directionalShadowMap.length=S,r.pointShadow.length=b,r.pointShadowMap.length=b,r.spotShadow.length=A,r.spotShadowMap.length=A,r.directionalShadowMatrix.length=S,r.pointShadowMatrix.length=b,r.spotLightMatrix.length=A+w-N,r.spotLightMap.length=w,r.numSpotLightShadowsWithMaps=N,r.numLightProbes=q,R.directionalLength=y,R.pointLength=m,R.spotLength=u,R.rectAreaLength=_,R.hemiLength=v,R.numDirectionalShadows=S,R.numPointShadows=b,R.numSpotShadows=A,R.numSpotMaps=w,R.numLightProbes=q,r.version=PC++)}function c(h,d){let p=0,g=0,x=0,y=0,m=0;const u=d.matrixWorldInverse;for(let _=0,v=h.length;_<v;_++){const S=h[_];if(S.isDirectionalLight){const b=r.directional[p];b.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(u),p++}else if(S.isSpotLight){const b=r.spot[x];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(u),b.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(u),x++}else if(S.isRectAreaLight){const b=r.rectArea[y];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(u),a.identity(),o.copy(S.matrixWorld),o.premultiply(u),a.extractRotation(o),b.halfWidth.set(S.width*.5,0,0),b.halfHeight.set(0,S.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),y++}else if(S.isPointLight){const b=r.point[g];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(u),g++}else if(S.isHemisphereLight){const b=r.hemi[m];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(u),m++}}}return{setup:l,setupView:c,state:r}}function ig(t,e){const n=new NC(t,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(d){i.push(d)}function a(d){r.push(d)}function l(d){n.setup(i,d)}function c(d){n.setupView(i,d)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:n},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function DC(t,e){let n=new WeakMap;function i(s,o=0){const a=n.get(s);let l;return a===void 0?(l=new ig(t,e),n.set(s,[l])):o>=a.length?(l=new ig(t,e),a.push(l)):l=a[o],l}function r(){n=new WeakMap}return{get:i,dispose:r}}class IC extends ca{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=AM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class UC extends ca{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const OC=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,FC=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function kC(t,e,n){let i=new th;const r=new Me,s=new Me,o=new ht,a=new IC({depthPacking:bM}),l=new UC,c={},h=n.maxTextureSize,d={[sr]:dn,[dn]:sr,[pi]:pi},p=new or({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Me},radius:{value:4}},vertexShader:OC,fragmentShader:FC}),g=p.clone();g.defines.HORIZONTAL_PASS=1;const x=new Xn;x.setAttribute("position",new ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Je(x,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qv;let u=this.type;this.render=function(A,w,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const q=t.getRenderTarget(),M=t.getActiveCubeFace(),R=t.getActiveMipmapLevel(),k=t.state;k.setBlending(er),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const J=u!==di&&this.type===di,L=u===di&&this.type!==di;for(let $=0,j=A.length;$<j;$++){const ee=A[$],U=ee.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;r.copy(U.mapSize);const z=U.getFrameExtents();if(r.multiply(z),s.copy(U.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/z.x),r.x=s.x*z.x,U.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/z.y),r.y=s.y*z.y,U.mapSize.y=s.y)),U.map===null||J===!0||L===!0){const re=this.type!==di?{minFilter:Jt,magFilter:Jt}:{};U.map!==null&&U.map.dispose(),U.map=new jr(r.x,r.y,re),U.map.texture.name=ee.name+".shadowMap",U.camera.updateProjectionMatrix()}t.setRenderTarget(U.map),t.clear();const W=U.getViewportCount();for(let re=0;re<W;re++){const ue=U.getViewport(re);o.set(s.x*ue.x,s.y*ue.y,s.x*ue.z,s.y*ue.w),k.viewport(o),U.updateMatrices(ee,re),i=U.getFrustum(),S(w,N,U.camera,ee,this.type)}U.isPointLightShadow!==!0&&this.type===di&&_(U,N),U.needsUpdate=!1}u=this.type,m.needsUpdate=!1,t.setRenderTarget(q,M,R)};function _(A,w){const N=e.update(y);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,g.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,g.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new jr(r.x,r.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(w,null,N,p,y,null),g.uniforms.shadow_pass.value=A.mapPass.texture,g.uniforms.resolution.value=A.mapSize,g.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(w,null,N,g,y,null)}function v(A,w,N,q){let M=null;const R=N.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(R!==void 0)M=R;else if(M=N.isPointLight===!0?l:a,t.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const k=M.uuid,J=w.uuid;let L=c[k];L===void 0&&(L={},c[k]=L);let $=L[J];$===void 0&&($=M.clone(),L[J]=$,w.addEventListener("dispose",b)),M=$}if(M.visible=w.visible,M.wireframe=w.wireframe,q===di?M.side=w.shadowSide!==null?w.shadowSide:w.side:M.side=w.shadowSide!==null?w.shadowSide:d[w.side],M.alphaMap=w.alphaMap,M.alphaTest=w.alphaTest,M.map=w.map,M.clipShadows=w.clipShadows,M.clippingPlanes=w.clippingPlanes,M.clipIntersection=w.clipIntersection,M.displacementMap=w.displacementMap,M.displacementScale=w.displacementScale,M.displacementBias=w.displacementBias,M.wireframeLinewidth=w.wireframeLinewidth,M.linewidth=w.linewidth,N.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const k=t.properties.get(M);k.light=N}return M}function S(A,w,N,q,M){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===di)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,A.matrixWorld);const J=e.update(A),L=A.material;if(Array.isArray(L)){const $=J.groups;for(let j=0,ee=$.length;j<ee;j++){const U=$[j],z=L[U.materialIndex];if(z&&z.visible){const W=v(A,z,q,M);A.onBeforeShadow(t,A,w,N,J,W,U),t.renderBufferDirect(N,null,J,W,A,U),A.onAfterShadow(t,A,w,N,J,W,U)}}}else if(L.visible){const $=v(A,L,q,M);A.onBeforeShadow(t,A,w,N,J,$,null),t.renderBufferDirect(N,null,J,$,A,null),A.onAfterShadow(t,A,w,N,J,$,null)}}const k=A.children;for(let J=0,L=k.length;J<L;J++)S(k[J],w,N,q,M)}function b(A){A.target.removeEventListener("dispose",b);for(const N in c){const q=c[N],M=A.target.uuid;M in q&&(q[M].dispose(),delete q[M])}}}function zC(t,e,n){const i=n.isWebGL2;function r(){let D=!1;const de=new ht;let V=null;const le=new ht(0,0,0,0);return{setMask:function(_e){V!==_e&&!D&&(t.colorMask(_e,_e,_e,_e),V=_e)},setLocked:function(_e){D=_e},setClear:function(_e,$e,tt,rt,yt){yt===!0&&(_e*=rt,$e*=rt,tt*=rt),de.set(_e,$e,tt,rt),le.equals(de)===!1&&(t.clearColor(_e,$e,tt,rt),le.copy(de))},reset:function(){D=!1,V=null,le.set(-1,0,0,0)}}}function s(){let D=!1,de=null,V=null,le=null;return{setTest:function(_e){_e?ye(t.DEPTH_TEST):Ye(t.DEPTH_TEST)},setMask:function(_e){de!==_e&&!D&&(t.depthMask(_e),de=_e)},setFunc:function(_e){if(V!==_e){switch(_e){case iM:t.depthFunc(t.NEVER);break;case rM:t.depthFunc(t.ALWAYS);break;case sM:t.depthFunc(t.LESS);break;case Hl:t.depthFunc(t.LEQUAL);break;case oM:t.depthFunc(t.EQUAL);break;case aM:t.depthFunc(t.GEQUAL);break;case lM:t.depthFunc(t.GREATER);break;case cM:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}V=_e}},setLocked:function(_e){D=_e},setClear:function(_e){le!==_e&&(t.clearDepth(_e),le=_e)},reset:function(){D=!1,de=null,V=null,le=null}}}function o(){let D=!1,de=null,V=null,le=null,_e=null,$e=null,tt=null,rt=null,yt=null;return{setTest:function(et){D||(et?ye(t.STENCIL_TEST):Ye(t.STENCIL_TEST))},setMask:function(et){de!==et&&!D&&(t.stencilMask(et),de=et)},setFunc:function(et,at,jt){(V!==et||le!==at||_e!==jt)&&(t.stencilFunc(et,at,jt),V=et,le=at,_e=jt)},setOp:function(et,at,jt){($e!==et||tt!==at||rt!==jt)&&(t.stencilOp(et,at,jt),$e=et,tt=at,rt=jt)},setLocked:function(et){D=et},setClear:function(et){yt!==et&&(t.clearStencil(et),yt=et)},reset:function(){D=!1,de=null,V=null,le=null,_e=null,$e=null,tt=null,rt=null,yt=null}}}const a=new r,l=new s,c=new o,h=new WeakMap,d=new WeakMap;let p={},g={},x=new WeakMap,y=[],m=null,u=!1,_=null,v=null,S=null,b=null,A=null,w=null,N=null,q=new Ke(0,0,0),M=0,R=!1,k=null,J=null,L=null,$=null,j=null;const ee=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,z=0;const W=t.getParameter(t.VERSION);W.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(W)[1]),U=z>=1):W.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),U=z>=2);let re=null,ue={};const Ne=t.getParameter(t.SCISSOR_BOX),G=t.getParameter(t.VIEWPORT),se=new ht().fromArray(Ne),me=new ht().fromArray(G);function Re(D,de,V,le){const _e=new Uint8Array(4),$e=t.createTexture();t.bindTexture(D,$e),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let tt=0;tt<V;tt++)i&&(D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY)?t.texImage3D(de,0,t.RGBA,1,1,le,0,t.RGBA,t.UNSIGNED_BYTE,_e):t.texImage2D(de+tt,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,_e);return $e}const Ae={};Ae[t.TEXTURE_2D]=Re(t.TEXTURE_2D,t.TEXTURE_2D,1),Ae[t.TEXTURE_CUBE_MAP]=Re(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ae[t.TEXTURE_2D_ARRAY]=Re(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Ae[t.TEXTURE_3D]=Re(t.TEXTURE_3D,t.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),ye(t.DEPTH_TEST),l.setFunc(Hl),B(!1),ne(Op),ye(t.CULL_FACE),K(er);function ye(D){p[D]!==!0&&(t.enable(D),p[D]=!0)}function Ye(D){p[D]!==!1&&(t.disable(D),p[D]=!1)}function De(D,de){return g[D]!==de?(t.bindFramebuffer(D,de),g[D]=de,i&&(D===t.DRAW_FRAMEBUFFER&&(g[t.FRAMEBUFFER]=de),D===t.FRAMEBUFFER&&(g[t.DRAW_FRAMEBUFFER]=de)),!0):!1}function O(D,de){let V=y,le=!1;if(D){V=x.get(de),V===void 0&&(V=[],x.set(de,V));const _e=D.textures;if(V.length!==_e.length||V[0]!==t.COLOR_ATTACHMENT0){for(let $e=0,tt=_e.length;$e<tt;$e++)V[$e]=t.COLOR_ATTACHMENT0+$e;V.length=_e.length,le=!0}}else V[0]!==t.BACK&&(V[0]=t.BACK,le=!0);if(le)if(n.isWebGL2)t.drawBuffers(V);else if(e.has("WEBGL_draw_buffers")===!0)e.get("WEBGL_draw_buffers").drawBuffersWEBGL(V);else throw new Error("THREE.WebGLState: Usage of gl.drawBuffers() require WebGL2 or WEBGL_draw_buffers extension")}function ot(D){return m!==D?(t.useProgram(D),m=D,!0):!1}const Ce={[Tr]:t.FUNC_ADD,[VS]:t.FUNC_SUBTRACT,[HS]:t.FUNC_REVERSE_SUBTRACT};if(i)Ce[Bp]=t.MIN,Ce[jp]=t.MAX;else{const D=e.get("EXT_blend_minmax");D!==null&&(Ce[Bp]=D.MIN_EXT,Ce[jp]=D.MAX_EXT)}const Oe={[GS]:t.ZERO,[WS]:t.ONE,[XS]:t.SRC_COLOR,[Fd]:t.SRC_ALPHA,[JS]:t.SRC_ALPHA_SATURATE,[KS]:t.DST_COLOR,[YS]:t.DST_ALPHA,[$S]:t.ONE_MINUS_SRC_COLOR,[kd]:t.ONE_MINUS_SRC_ALPHA,[ZS]:t.ONE_MINUS_DST_COLOR,[qS]:t.ONE_MINUS_DST_ALPHA,[QS]:t.CONSTANT_COLOR,[eM]:t.ONE_MINUS_CONSTANT_COLOR,[tM]:t.CONSTANT_ALPHA,[nM]:t.ONE_MINUS_CONSTANT_ALPHA};function K(D,de,V,le,_e,$e,tt,rt,yt,et){if(D===er){u===!0&&(Ye(t.BLEND),u=!1);return}if(u===!1&&(ye(t.BLEND),u=!0),D!==jS){if(D!==_||et!==R){if((v!==Tr||A!==Tr)&&(t.blendEquation(t.FUNC_ADD),v=Tr,A=Tr),et)switch(D){case Ds:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Fp:t.blendFunc(t.ONE,t.ONE);break;case kp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case zp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ds:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Fp:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case kp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case zp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}S=null,b=null,w=null,N=null,q.set(0,0,0),M=0,_=D,R=et}return}_e=_e||de,$e=$e||V,tt=tt||le,(de!==v||_e!==A)&&(t.blendEquationSeparate(Ce[de],Ce[_e]),v=de,A=_e),(V!==S||le!==b||$e!==w||tt!==N)&&(t.blendFuncSeparate(Oe[V],Oe[le],Oe[$e],Oe[tt]),S=V,b=le,w=$e,N=tt),(rt.equals(q)===!1||yt!==M)&&(t.blendColor(rt.r,rt.g,rt.b,yt),q.copy(rt),M=yt),_=D,R=!1}function he(D,de){D.side===pi?Ye(t.CULL_FACE):ye(t.CULL_FACE);let V=D.side===dn;de&&(V=!V),B(V),D.blending===Ds&&D.transparent===!1?K(er):K(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),l.setFunc(D.depthFunc),l.setTest(D.depthTest),l.setMask(D.depthWrite),a.setMask(D.colorWrite);const le=D.stencilWrite;c.setTest(le),le&&(c.setMask(D.stencilWriteMask),c.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),c.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),C(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ye(t.SAMPLE_ALPHA_TO_COVERAGE):Ye(t.SAMPLE_ALPHA_TO_COVERAGE)}function B(D){k!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),k=D)}function ne(D){D!==zS?(ye(t.CULL_FACE),D!==J&&(D===Op?t.cullFace(t.BACK):D===BS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ye(t.CULL_FACE),J=D}function ge(D){D!==L&&(U&&t.lineWidth(D),L=D)}function C(D,de,V){D?(ye(t.POLYGON_OFFSET_FILL),($!==de||j!==V)&&(t.polygonOffset(de,V),$=de,j=V)):Ye(t.POLYGON_OFFSET_FILL)}function E(D){D?ye(t.SCISSOR_TEST):Ye(t.SCISSOR_TEST)}function H(D){D===void 0&&(D=t.TEXTURE0+ee-1),re!==D&&(t.activeTexture(D),re=D)}function te(D,de,V){V===void 0&&(re===null?V=t.TEXTURE0+ee-1:V=re);let le=ue[V];le===void 0&&(le={type:void 0,texture:void 0},ue[V]=le),(le.type!==D||le.texture!==de)&&(re!==V&&(t.activeTexture(V),re=V),t.bindTexture(D,de||Ae[D]),le.type=D,le.texture=de)}function oe(){const D=ue[re];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ae(){try{t.compressedTexImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Fe(){try{t.compressedTexImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ie(){try{t.texSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function pe(){try{t.texSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ze(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function fe(){try{t.texStorage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _t(){try{t.texStorage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function We(){try{t.texImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Le(){try{t.texImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function we(D){se.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),se.copy(D))}function be(D){me.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),me.copy(D))}function P(D,de){let V=d.get(de);V===void 0&&(V=new WeakMap,d.set(de,V));let le=V.get(D);le===void 0&&(le=t.getUniformBlockIndex(de,D.name),V.set(D,le))}function ie(D,de){const le=d.get(de).get(D);h.get(de)!==le&&(t.uniformBlockBinding(de,le,D.__bindingPointIndex),h.set(de,le))}function Te(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),i===!0&&(t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null)),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),p={},re=null,ue={},g={},x=new WeakMap,y=[],m=null,u=!1,_=null,v=null,S=null,b=null,A=null,w=null,N=null,q=new Ke(0,0,0),M=0,R=!1,k=null,J=null,L=null,$=null,j=null,se.set(0,0,t.canvas.width,t.canvas.height),me.set(0,0,t.canvas.width,t.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:ye,disable:Ye,bindFramebuffer:De,drawBuffers:O,useProgram:ot,setBlending:K,setMaterial:he,setFlipSided:B,setCullFace:ne,setLineWidth:ge,setPolygonOffset:C,setScissorTest:E,activeTexture:H,bindTexture:te,unbindTexture:oe,compressedTexImage2D:ae,compressedTexImage3D:Fe,texImage2D:We,texImage3D:Le,updateUBOMapping:P,uniformBlockBinding:ie,texStorage2D:fe,texStorage3D:_t,texSubImage2D:Ie,texSubImage3D:pe,compressedTexSubImage2D:xe,compressedTexSubImage3D:ze,scissor:we,viewport:be,reset:Te}}function BC(t,e,n,i,r,s,o){const a=r.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Me,d=new WeakMap;let p;const g=new WeakMap;let x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(C,E){return x?new OffscreenCanvas(C,E):Yl("canvas")}function m(C,E,H,te){let oe=1;const ae=ge(C);if((ae.width>te||ae.height>te)&&(oe=te/Math.max(ae.width,ae.height)),oe<1||E===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Fe=E?Wd:Math.floor,Ie=Fe(oe*ae.width),pe=Fe(oe*ae.height);p===void 0&&(p=y(Ie,pe));const xe=H?y(Ie,pe):p;return xe.width=Ie,xe.height=pe,xe.getContext("2d").drawImage(C,0,0,Ie,pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+Ie+"x"+pe+")."),xe}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),C;return C}function u(C){const E=ge(C);return vm(E.width)&&vm(E.height)}function _(C){return a?!1:C.wrapS!==jn||C.wrapT!==jn||C.minFilter!==Jt&&C.minFilter!==rn}function v(C,E){return C.generateMipmaps&&E&&C.minFilter!==Jt&&C.minFilter!==rn}function S(C){t.generateMipmap(C)}function b(C,E,H,te,oe=!1){if(a===!1)return E;if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ae=E;if(E===t.RED&&(H===t.FLOAT&&(ae=t.R32F),H===t.HALF_FLOAT&&(ae=t.R16F),H===t.UNSIGNED_BYTE&&(ae=t.R8)),E===t.RED_INTEGER&&(H===t.UNSIGNED_BYTE&&(ae=t.R8UI),H===t.UNSIGNED_SHORT&&(ae=t.R16UI),H===t.UNSIGNED_INT&&(ae=t.R32UI),H===t.BYTE&&(ae=t.R8I),H===t.SHORT&&(ae=t.R16I),H===t.INT&&(ae=t.R32I)),E===t.RG&&(H===t.FLOAT&&(ae=t.RG32F),H===t.HALF_FLOAT&&(ae=t.RG16F),H===t.UNSIGNED_BYTE&&(ae=t.RG8)),E===t.RG_INTEGER&&(H===t.UNSIGNED_BYTE&&(ae=t.RG8UI),H===t.UNSIGNED_SHORT&&(ae=t.RG16UI),H===t.UNSIGNED_INT&&(ae=t.RG32UI),H===t.BYTE&&(ae=t.RG8I),H===t.SHORT&&(ae=t.RG16I),H===t.INT&&(ae=t.RG32I)),E===t.RGBA){const Fe=oe?Gl:it.getTransfer(te);H===t.FLOAT&&(ae=t.RGBA32F),H===t.HALF_FLOAT&&(ae=t.RGBA16F),H===t.UNSIGNED_BYTE&&(ae=Fe===ct?t.SRGB8_ALPHA8:t.RGBA8),H===t.UNSIGNED_SHORT_4_4_4_4&&(ae=t.RGBA4),H===t.UNSIGNED_SHORT_5_5_5_1&&(ae=t.RGB5_A1)}return(ae===t.R16F||ae===t.R32F||ae===t.RG16F||ae===t.RG32F||ae===t.RGBA16F||ae===t.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function A(C,E,H){return v(C,H)===!0||C.isFramebufferTexture&&C.minFilter!==Jt&&C.minFilter!==rn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function w(C){return C===Jt||C===Vp||C===uo?t.NEAREST:t.LINEAR}function N(C){const E=C.target;E.removeEventListener("dispose",N),M(E),E.isVideoTexture&&d.delete(E)}function q(C){const E=C.target;E.removeEventListener("dispose",q),k(E)}function M(C){const E=i.get(C);if(E.__webglInit===void 0)return;const H=C.source,te=g.get(H);if(te){const oe=te[E.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&R(C),Object.keys(te).length===0&&g.delete(H)}i.remove(C)}function R(C){const E=i.get(C);t.deleteTexture(E.__webglTexture);const H=C.source,te=g.get(H);delete te[E.__cacheKey],o.memory.textures--}function k(C){const E=i.get(C);if(C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(E.__webglFramebuffer[te]))for(let oe=0;oe<E.__webglFramebuffer[te].length;oe++)t.deleteFramebuffer(E.__webglFramebuffer[te][oe]);else t.deleteFramebuffer(E.__webglFramebuffer[te]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[te])}else{if(Array.isArray(E.__webglFramebuffer))for(let te=0;te<E.__webglFramebuffer.length;te++)t.deleteFramebuffer(E.__webglFramebuffer[te]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let te=0;te<E.__webglColorRenderbuffer.length;te++)E.__webglColorRenderbuffer[te]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[te]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const H=C.textures;for(let te=0,oe=H.length;te<oe;te++){const ae=i.get(H[te]);ae.__webglTexture&&(t.deleteTexture(ae.__webglTexture),o.memory.textures--),i.remove(H[te])}i.remove(C)}let J=0;function L(){J=0}function $(){const C=J;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),J+=1,C}function j(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function ee(C,E){const H=i.get(C);if(C.isVideoTexture&&B(C),C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){const te=C.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{me(H,C,E);return}}n.bindTexture(t.TEXTURE_2D,H.__webglTexture,t.TEXTURE0+E)}function U(C,E){const H=i.get(C);if(C.version>0&&H.__version!==C.version){me(H,C,E);return}n.bindTexture(t.TEXTURE_2D_ARRAY,H.__webglTexture,t.TEXTURE0+E)}function z(C,E){const H=i.get(C);if(C.version>0&&H.__version!==C.version){me(H,C,E);return}n.bindTexture(t.TEXTURE_3D,H.__webglTexture,t.TEXTURE0+E)}function W(C,E){const H=i.get(C);if(C.version>0&&H.__version!==C.version){Re(H,C,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture,t.TEXTURE0+E)}const re={[jd]:t.REPEAT,[jn]:t.CLAMP_TO_EDGE,[Vd]:t.MIRRORED_REPEAT},ue={[Jt]:t.NEAREST,[Vp]:t.NEAREST_MIPMAP_NEAREST,[uo]:t.NEAREST_MIPMAP_LINEAR,[rn]:t.LINEAR,[Zc]:t.LINEAR_MIPMAP_NEAREST,[Pr]:t.LINEAR_MIPMAP_LINEAR},Ne={[PM]:t.NEVER,[OM]:t.ALWAYS,[LM]:t.LESS,[dx]:t.LEQUAL,[NM]:t.EQUAL,[UM]:t.GEQUAL,[DM]:t.GREATER,[IM]:t.NOTEQUAL};function G(C,E,H){if(E.type===mi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===rn||E.magFilter===Zc||E.magFilter===uo||E.magFilter===Pr||E.minFilter===rn||E.minFilter===Zc||E.minFilter===uo||E.minFilter===Pr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),H?(t.texParameteri(C,t.TEXTURE_WRAP_S,re[E.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,re[E.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,re[E.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,ue[E.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,ue[E.minFilter])):(t.texParameteri(C,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(C,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),(E.wrapS!==jn||E.wrapT!==jn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),t.texParameteri(C,t.TEXTURE_MAG_FILTER,w(E.magFilter)),t.texParameteri(C,t.TEXTURE_MIN_FILTER,w(E.minFilter)),E.minFilter!==Jt&&E.minFilter!==rn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,Ne[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Jt||E.minFilter!==uo&&E.minFilter!==Pr||E.type===mi&&e.has("OES_texture_float_linear")===!1||a===!1&&E.type===Qo&&e.has("OES_texture_half_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const te=e.get("EXT_texture_filter_anisotropic");t.texParameterf(C,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function se(C,E){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",N));const te=E.source;let oe=g.get(te);oe===void 0&&(oe={},g.set(te,oe));const ae=j(E);if(ae!==C.__cacheKey){oe[ae]===void 0&&(oe[ae]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,H=!0),oe[ae].usedTimes++;const Fe=oe[C.__cacheKey];Fe!==void 0&&(oe[C.__cacheKey].usedTimes--,Fe.usedTimes===0&&R(E)),C.__cacheKey=ae,C.__webglTexture=oe[ae].texture}return H}function me(C,E,H){let te=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(te=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(te=t.TEXTURE_3D);const oe=se(C,E),ae=E.source;n.bindTexture(te,C.__webglTexture,t.TEXTURE0+H);const Fe=i.get(ae);if(ae.version!==Fe.__version||oe===!0){n.activeTexture(t.TEXTURE0+H);const Ie=it.getPrimaries(it.workingColorSpace),pe=E.colorSpace===Bi?null:it.getPrimaries(E.colorSpace),xe=E.colorSpace===Bi||Ie===pe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const ze=_(E)&&u(E.image)===!1;let fe=m(E.image,ze,!1,r.maxTextureSize);fe=ne(E,fe);const _t=u(fe)||a,We=s.convert(E.format,E.colorSpace);let Le=s.convert(E.type),we=b(E.internalFormat,We,Le,E.colorSpace,E.isVideoTexture);G(te,E,_t);let be;const P=E.mipmaps,ie=a&&E.isVideoTexture!==!0&&we!==cx,Te=Fe.__version===void 0||oe===!0,D=ae.dataReady,de=A(E,fe,_t);if(E.isDepthTexture)we=t.DEPTH_COMPONENT,a?E.type===mi?we=t.DEPTH_COMPONENT32F:E.type===Gi?we=t.DEPTH_COMPONENT24:E.type===Dr?we=t.DEPTH24_STENCIL8:we=t.DEPTH_COMPONENT16:E.type===mi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===Ir&&we===t.DEPTH_COMPONENT&&E.type!==Kf&&E.type!==Gi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Gi,Le=s.convert(E.type)),E.format===$s&&we===t.DEPTH_COMPONENT&&(we=t.DEPTH_STENCIL,E.type!==Dr&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=Dr,Le=s.convert(E.type))),Te&&(ie?n.texStorage2D(t.TEXTURE_2D,1,we,fe.width,fe.height):n.texImage2D(t.TEXTURE_2D,0,we,fe.width,fe.height,0,We,Le,null));else if(E.isDataTexture)if(P.length>0&&_t){ie&&Te&&n.texStorage2D(t.TEXTURE_2D,de,we,P[0].width,P[0].height);for(let V=0,le=P.length;V<le;V++)be=P[V],ie?D&&n.texSubImage2D(t.TEXTURE_2D,V,0,0,be.width,be.height,We,Le,be.data):n.texImage2D(t.TEXTURE_2D,V,we,be.width,be.height,0,We,Le,be.data);E.generateMipmaps=!1}else ie?(Te&&n.texStorage2D(t.TEXTURE_2D,de,we,fe.width,fe.height),D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,fe.width,fe.height,We,Le,fe.data)):n.texImage2D(t.TEXTURE_2D,0,we,fe.width,fe.height,0,We,Le,fe.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){ie&&Te&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,we,P[0].width,P[0].height,fe.depth);for(let V=0,le=P.length;V<le;V++)be=P[V],E.format!==Vn?We!==null?ie?D&&n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,V,0,0,0,be.width,be.height,fe.depth,We,be.data,0,0):n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,V,we,be.width,be.height,fe.depth,0,be.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ie?D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,V,0,0,0,be.width,be.height,fe.depth,We,Le,be.data):n.texImage3D(t.TEXTURE_2D_ARRAY,V,we,be.width,be.height,fe.depth,0,We,Le,be.data)}else{ie&&Te&&n.texStorage2D(t.TEXTURE_2D,de,we,P[0].width,P[0].height);for(let V=0,le=P.length;V<le;V++)be=P[V],E.format!==Vn?We!==null?ie?D&&n.compressedTexSubImage2D(t.TEXTURE_2D,V,0,0,be.width,be.height,We,be.data):n.compressedTexImage2D(t.TEXTURE_2D,V,we,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ie?D&&n.texSubImage2D(t.TEXTURE_2D,V,0,0,be.width,be.height,We,Le,be.data):n.texImage2D(t.TEXTURE_2D,V,we,be.width,be.height,0,We,Le,be.data)}else if(E.isDataArrayTexture)ie?(Te&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,we,fe.width,fe.height,fe.depth),D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,fe.width,fe.height,fe.depth,We,Le,fe.data)):n.texImage3D(t.TEXTURE_2D_ARRAY,0,we,fe.width,fe.height,fe.depth,0,We,Le,fe.data);else if(E.isData3DTexture)ie?(Te&&n.texStorage3D(t.TEXTURE_3D,de,we,fe.width,fe.height,fe.depth),D&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,fe.width,fe.height,fe.depth,We,Le,fe.data)):n.texImage3D(t.TEXTURE_3D,0,we,fe.width,fe.height,fe.depth,0,We,Le,fe.data);else if(E.isFramebufferTexture){if(Te)if(ie)n.texStorage2D(t.TEXTURE_2D,de,we,fe.width,fe.height);else{let V=fe.width,le=fe.height;for(let _e=0;_e<de;_e++)n.texImage2D(t.TEXTURE_2D,_e,we,V,le,0,We,Le,null),V>>=1,le>>=1}}else if(P.length>0&&_t){if(ie&&Te){const V=ge(P[0]);n.texStorage2D(t.TEXTURE_2D,de,we,V.width,V.height)}for(let V=0,le=P.length;V<le;V++)be=P[V],ie?D&&n.texSubImage2D(t.TEXTURE_2D,V,0,0,We,Le,be):n.texImage2D(t.TEXTURE_2D,V,we,We,Le,be);E.generateMipmaps=!1}else if(ie){if(Te){const V=ge(fe);n.texStorage2D(t.TEXTURE_2D,de,we,V.width,V.height)}D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,We,Le,fe)}else n.texImage2D(t.TEXTURE_2D,0,we,We,Le,fe);v(E,_t)&&S(te),Fe.__version=ae.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Re(C,E,H){if(E.image.length!==6)return;const te=se(C,E),oe=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+H);const ae=i.get(oe);if(oe.version!==ae.__version||te===!0){n.activeTexture(t.TEXTURE0+H);const Fe=it.getPrimaries(it.workingColorSpace),Ie=E.colorSpace===Bi?null:it.getPrimaries(E.colorSpace),pe=E.colorSpace===Bi||Fe===Ie?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);const xe=E.isCompressedTexture||E.image[0].isCompressedTexture,ze=E.image[0]&&E.image[0].isDataTexture,fe=[];for(let V=0;V<6;V++)!xe&&!ze?fe[V]=m(E.image[V],!1,!0,r.maxCubemapSize):fe[V]=ze?E.image[V].image:E.image[V],fe[V]=ne(E,fe[V]);const _t=fe[0],We=u(_t)||a,Le=s.convert(E.format,E.colorSpace),we=s.convert(E.type),be=b(E.internalFormat,Le,we,E.colorSpace),P=a&&E.isVideoTexture!==!0,ie=ae.__version===void 0||te===!0,Te=oe.dataReady;let D=A(E,_t,We);G(t.TEXTURE_CUBE_MAP,E,We);let de;if(xe){P&&ie&&n.texStorage2D(t.TEXTURE_CUBE_MAP,D,be,_t.width,_t.height);for(let V=0;V<6;V++){de=fe[V].mipmaps;for(let le=0;le<de.length;le++){const _e=de[le];E.format!==Vn?Le!==null?P?Te&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le,0,0,_e.width,_e.height,Le,_e.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le,be,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?Te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le,0,0,_e.width,_e.height,Le,we,_e.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le,be,_e.width,_e.height,0,Le,we,_e.data)}}}else{if(de=E.mipmaps,P&&ie){de.length>0&&D++;const V=ge(fe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,D,be,V.width,V.height)}for(let V=0;V<6;V++)if(ze){P?Te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,fe[V].width,fe[V].height,Le,we,fe[V].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,be,fe[V].width,fe[V].height,0,Le,we,fe[V].data);for(let le=0;le<de.length;le++){const $e=de[le].image[V].image;P?Te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le+1,0,0,$e.width,$e.height,Le,we,$e.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le+1,be,$e.width,$e.height,0,Le,we,$e.data)}}else{P?Te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,Le,we,fe[V]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,be,Le,we,fe[V]);for(let le=0;le<de.length;le++){const _e=de[le];P?Te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le+1,0,0,Le,we,_e.image[V]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+V,le+1,be,Le,we,_e.image[V])}}}v(E,We)&&S(t.TEXTURE_CUBE_MAP),ae.__version=oe.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Ae(C,E,H,te,oe,ae){const Fe=s.convert(H.format,H.colorSpace),Ie=s.convert(H.type),pe=b(H.internalFormat,Fe,Ie,H.colorSpace);if(!i.get(E).__hasExternalTextures){const ze=Math.max(1,E.width>>ae),fe=Math.max(1,E.height>>ae);oe===t.TEXTURE_3D||oe===t.TEXTURE_2D_ARRAY?n.texImage3D(oe,ae,pe,ze,fe,E.depth,0,Fe,Ie,null):n.texImage2D(oe,ae,pe,ze,fe,0,Fe,Ie,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),he(E)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,te,oe,i.get(H).__webglTexture,0,K(E)):(oe===t.TEXTURE_2D||oe>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,te,oe,i.get(H).__webglTexture,ae),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ye(C,E,H){if(t.bindRenderbuffer(t.RENDERBUFFER,C),E.depthBuffer&&!E.stencilBuffer){let te=a===!0?t.DEPTH_COMPONENT24:t.DEPTH_COMPONENT16;if(H||he(E)){const oe=E.depthTexture;oe&&oe.isDepthTexture&&(oe.type===mi?te=t.DEPTH_COMPONENT32F:oe.type===Gi&&(te=t.DEPTH_COMPONENT24));const ae=K(E);he(E)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ae,te,E.width,E.height):t.renderbufferStorageMultisample(t.RENDERBUFFER,ae,te,E.width,E.height)}else t.renderbufferStorage(t.RENDERBUFFER,te,E.width,E.height);t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,C)}else if(E.depthBuffer&&E.stencilBuffer){const te=K(E);H&&he(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,te,t.DEPTH24_STENCIL8,E.width,E.height):he(E)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,te,t.DEPTH24_STENCIL8,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,C)}else{const te=E.textures;for(let oe=0;oe<te.length;oe++){const ae=te[oe],Fe=s.convert(ae.format,ae.colorSpace),Ie=s.convert(ae.type),pe=b(ae.internalFormat,Fe,Ie,ae.colorSpace),xe=K(E);H&&he(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,xe,pe,E.width,E.height):he(E)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,xe,pe,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,pe,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ye(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),ee(E.depthTexture,0);const te=i.get(E.depthTexture).__webglTexture,oe=K(E);if(E.depthTexture.format===Ir)he(E)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0,oe):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0);else if(E.depthTexture.format===$s)he(E)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0,oe):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function De(C){const E=i.get(C),H=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Ye(E.__webglFramebuffer,C)}else if(H){E.__webglDepthbuffer=[];for(let te=0;te<6;te++)n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[te]),E.__webglDepthbuffer[te]=t.createRenderbuffer(),ye(E.__webglDepthbuffer[te],C,!1)}else n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=t.createRenderbuffer(),ye(E.__webglDepthbuffer,C,!1);n.bindFramebuffer(t.FRAMEBUFFER,null)}function O(C,E,H){const te=i.get(C);E!==void 0&&Ae(te.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),H!==void 0&&De(C)}function ot(C){const E=C.texture,H=i.get(C),te=i.get(E);C.addEventListener("dispose",q);const oe=C.textures,ae=C.isWebGLCubeRenderTarget===!0,Fe=oe.length>1,Ie=u(C)||a;if(Fe||(te.__webglTexture===void 0&&(te.__webglTexture=t.createTexture()),te.__version=E.version,o.memory.textures++),ae){H.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(a&&E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[pe]=[];for(let xe=0;xe<E.mipmaps.length;xe++)H.__webglFramebuffer[pe][xe]=t.createFramebuffer()}else H.__webglFramebuffer[pe]=t.createFramebuffer()}else{if(a&&E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let pe=0;pe<E.mipmaps.length;pe++)H.__webglFramebuffer[pe]=t.createFramebuffer()}else H.__webglFramebuffer=t.createFramebuffer();if(Fe)if(r.drawBuffers)for(let pe=0,xe=oe.length;pe<xe;pe++){const ze=i.get(oe[pe]);ze.__webglTexture===void 0&&(ze.__webglTexture=t.createTexture(),o.memory.textures++)}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&C.samples>0&&he(C)===!1){H.__webglMultisampledFramebuffer=t.createFramebuffer(),H.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let pe=0;pe<oe.length;pe++){const xe=oe[pe];H.__webglColorRenderbuffer[pe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,H.__webglColorRenderbuffer[pe]);const ze=s.convert(xe.format,xe.colorSpace),fe=s.convert(xe.type),_t=b(xe.internalFormat,ze,fe,xe.colorSpace,C.isXRRenderTarget===!0),We=K(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,We,_t,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+pe,t.RENDERBUFFER,H.__webglColorRenderbuffer[pe])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=t.createRenderbuffer(),ye(H.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ae){n.bindTexture(t.TEXTURE_CUBE_MAP,te.__webglTexture),G(t.TEXTURE_CUBE_MAP,E,Ie);for(let pe=0;pe<6;pe++)if(a&&E.mipmaps&&E.mipmaps.length>0)for(let xe=0;xe<E.mipmaps.length;xe++)Ae(H.__webglFramebuffer[pe][xe],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+pe,xe);else Ae(H.__webglFramebuffer[pe],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);v(E,Ie)&&S(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Fe){for(let pe=0,xe=oe.length;pe<xe;pe++){const ze=oe[pe],fe=i.get(ze);n.bindTexture(t.TEXTURE_2D,fe.__webglTexture),G(t.TEXTURE_2D,ze,Ie),Ae(H.__webglFramebuffer,C,ze,t.COLOR_ATTACHMENT0+pe,t.TEXTURE_2D,0),v(ze,Ie)&&S(t.TEXTURE_2D)}n.unbindTexture()}else{let pe=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(a?pe=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),n.bindTexture(pe,te.__webglTexture),G(pe,E,Ie),a&&E.mipmaps&&E.mipmaps.length>0)for(let xe=0;xe<E.mipmaps.length;xe++)Ae(H.__webglFramebuffer[xe],C,E,t.COLOR_ATTACHMENT0,pe,xe);else Ae(H.__webglFramebuffer,C,E,t.COLOR_ATTACHMENT0,pe,0);v(E,Ie)&&S(pe),n.unbindTexture()}C.depthBuffer&&De(C)}function Ce(C){const E=u(C)||a,H=C.textures;for(let te=0,oe=H.length;te<oe;te++){const ae=H[te];if(v(ae,E)){const Fe=C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Ie=i.get(ae).__webglTexture;n.bindTexture(Fe,Ie),S(Fe),n.unbindTexture()}}}function Oe(C){if(a&&C.samples>0&&he(C)===!1){const E=C.textures,H=C.width,te=C.height;let oe=t.COLOR_BUFFER_BIT;const ae=[],Fe=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ie=i.get(C),pe=E.length>1;if(pe)for(let xe=0;xe<E.length;xe++)n.bindFramebuffer(t.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ie.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer);for(let xe=0;xe<E.length;xe++){ae.push(t.COLOR_ATTACHMENT0+xe),C.depthBuffer&&ae.push(Fe);const ze=Ie.__ignoreDepthValues!==void 0?Ie.__ignoreDepthValues:!1;if(ze===!1&&(C.depthBuffer&&(oe|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&(oe|=t.STENCIL_BUFFER_BIT)),pe&&t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ie.__webglColorRenderbuffer[xe]),ze===!0&&(t.invalidateFramebuffer(t.READ_FRAMEBUFFER,[Fe]),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[Fe])),pe){const fe=i.get(E[xe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,fe,0)}t.blitFramebuffer(0,0,H,te,0,0,H,te,oe,t.NEAREST),c&&t.invalidateFramebuffer(t.READ_FRAMEBUFFER,ae)}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),pe)for(let xe=0;xe<E.length;xe++){n.bindFramebuffer(t.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.RENDERBUFFER,Ie.__webglColorRenderbuffer[xe]);const ze=i.get(E[xe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ie.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.TEXTURE_2D,ze,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer)}}function K(C){return Math.min(r.maxSamples,C.samples)}function he(C){const E=i.get(C);return a&&C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function B(C){const E=o.render.frame;d.get(C)!==E&&(d.set(C,E),C.update())}function ne(C,E){const H=C.colorSpace,te=C.format,oe=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===Hd||H!==dr&&H!==Bi&&(it.getTransfer(H)===ct?a===!1?e.has("EXT_sRGB")===!0&&te===Vn?(C.format=Hd,C.minFilter=rn,C.generateMipmaps=!1):E=hx.sRGBToLinear(E):(te!==Vn||oe!==nr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function ge(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(h.width=C.naturalWidth||C.width,h.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(h.width=C.displayWidth,h.height=C.displayHeight):(h.width=C.width,h.height=C.height),h}this.allocateTextureUnit=$,this.resetTextureUnits=L,this.setTexture2D=ee,this.setTexture2DArray=U,this.setTexture3D=z,this.setTextureCube=W,this.rebindTextures=O,this.setupRenderTarget=ot,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=he}function jC(t,e,n){const i=n.isWebGL2;function r(s,o=Bi){let a;const l=it.getTransfer(o);if(s===nr)return t.UNSIGNED_BYTE;if(s===rx)return t.UNSIGNED_SHORT_4_4_4_4;if(s===sx)return t.UNSIGNED_SHORT_5_5_5_1;if(s===_M)return t.BYTE;if(s===yM)return t.SHORT;if(s===Kf)return t.UNSIGNED_SHORT;if(s===ix)return t.INT;if(s===Gi)return t.UNSIGNED_INT;if(s===mi)return t.FLOAT;if(s===Qo)return i?t.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===SM)return t.ALPHA;if(s===Vn)return t.RGBA;if(s===MM)return t.LUMINANCE;if(s===EM)return t.LUMINANCE_ALPHA;if(s===Ir)return t.DEPTH_COMPONENT;if(s===$s)return t.DEPTH_STENCIL;if(s===Hd)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===wM)return t.RED;if(s===ox)return t.RED_INTEGER;if(s===TM)return t.RG;if(s===ax)return t.RG_INTEGER;if(s===lx)return t.RGBA_INTEGER;if(s===Jc||s===Qc||s===eu||s===tu)if(l===ct)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===Jc)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Qc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===eu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===tu)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===Jc)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Qc)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===eu)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===tu)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Hp||s===Gp||s===Wp||s===Xp)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===Hp)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Gp)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Wp)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Xp)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===cx)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===$p||s===Yp)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===$p)return l===ct?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===Yp)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===qp||s===Kp||s===Zp||s===Jp||s===Qp||s===em||s===tm||s===nm||s===im||s===rm||s===sm||s===om||s===am||s===lm)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===qp)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Kp)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Zp)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Jp)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Qp)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===em)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===tm)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===nm)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===im)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===rm)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===sm)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===om)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===am)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===lm)return l===ct?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===nu||s===cm||s===um)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===nu)return l===ct?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===cm)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===um)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===CM||s===dm||s===fm||s===hm)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(s===nu)return a.COMPRESSED_RED_RGTC1_EXT;if(s===dm)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===fm)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===hm)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Dr?i?t.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):t[s]!==void 0?t[s]:null}return{convert:r}}class VC extends xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Jn extends Yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const HC={type:"move"};class bu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Jn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Jn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Jn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const y of e.hand.values()){const m=n.getJointPose(y,i),u=this._getHandJoint(c,y);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],p=h.position.distanceTo(d.position),g=.02,x=.005;c.inputState.pinching&&p>g+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=g-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(HC)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Jn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const GC=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,WC=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class XC{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new fn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}render(e,n){if(this.texture!==null){if(this.mesh===null){const i=n.cameras[0].viewport,r=new or({extensions:{fragDepth:!0},vertexShader:GC,fragmentShader:WC,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Je(new vc(20,20),r)}e.render(this.mesh,n)}}reset(){this.texture=null,this.mesh=null}}class $C extends Xr{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,p=null,g=null,x=null;const y=new XC,m=n.getContextAttributes();let u=null,_=null;const v=[],S=[],b=new Me;let A=null;const w=new xn;w.layers.enable(1),w.viewport=new ht;const N=new xn;N.layers.enable(2),N.viewport=new ht;const q=[w,N],M=new VC;M.layers.enable(1),M.layers.enable(2);let R=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let se=v[G];return se===void 0&&(se=new bu,v[G]=se),se.getTargetRaySpace()},this.getControllerGrip=function(G){let se=v[G];return se===void 0&&(se=new bu,v[G]=se),se.getGripSpace()},this.getHand=function(G){let se=v[G];return se===void 0&&(se=new bu,v[G]=se),se.getHandSpace()};function J(G){const se=S.indexOf(G.inputSource);if(se===-1)return;const me=v[se];me!==void 0&&(me.update(G.inputSource,G.frame,c||o),me.dispatchEvent({type:G.type,data:G.inputSource}))}function L(){r.removeEventListener("select",J),r.removeEventListener("selectstart",J),r.removeEventListener("selectend",J),r.removeEventListener("squeeze",J),r.removeEventListener("squeezestart",J),r.removeEventListener("squeezeend",J),r.removeEventListener("end",L),r.removeEventListener("inputsourceschange",$);for(let G=0;G<v.length;G++){const se=S[G];se!==null&&(S[G]=null,v[G].disconnect(se))}R=null,k=null,y.reset(),e.setRenderTarget(u),g=null,p=null,d=null,r=null,_=null,Ne.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){s=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return p!==null?p:g},this.getBinding=function(){return d},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(G){if(r=G,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",J),r.addEventListener("selectstart",J),r.addEventListener("selectend",J),r.addEventListener("squeeze",J),r.addEventListener("squeezestart",J),r.addEventListener("squeezeend",J),r.addEventListener("end",L),r.addEventListener("inputsourceschange",$),m.xrCompatible!==!0&&await n.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(b),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const se={antialias:r.renderState.layers===void 0?m.antialias:!0,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(r,n,se),r.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),_=new jr(g.framebufferWidth,g.framebufferHeight,{format:Vn,type:nr,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let se=null,me=null,Re=null;m.depth&&(Re=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,se=m.stencil?$s:Ir,me=m.stencil?Dr:Gi);const Ae={colorFormat:n.RGBA8,depthFormat:Re,scaleFactor:s};d=new XRWebGLBinding(r,n),p=d.createProjectionLayer(Ae),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),_=new jr(p.textureWidth,p.textureHeight,{format:Vn,type:nr,depthTexture:new wx(p.textureWidth,p.textureHeight,me,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0});const ye=e.properties.get(_);ye.__ignoreDepthValues=p.ignoreDepthValues}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ne.setContext(r),Ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function $(G){for(let se=0;se<G.removed.length;se++){const me=G.removed[se],Re=S.indexOf(me);Re>=0&&(S[Re]=null,v[Re].disconnect(me))}for(let se=0;se<G.added.length;se++){const me=G.added[se];let Re=S.indexOf(me);if(Re===-1){for(let ye=0;ye<v.length;ye++)if(ye>=S.length){S.push(me),Re=ye;break}else if(S[ye]===null){S[ye]=me,Re=ye;break}if(Re===-1)break}const Ae=v[Re];Ae&&Ae.connect(me)}}const j=new I,ee=new I;function U(G,se,me){j.setFromMatrixPosition(se.matrixWorld),ee.setFromMatrixPosition(me.matrixWorld);const Re=j.distanceTo(ee),Ae=se.projectionMatrix.elements,ye=me.projectionMatrix.elements,Ye=Ae[14]/(Ae[10]-1),De=Ae[14]/(Ae[10]+1),O=(Ae[9]+1)/Ae[5],ot=(Ae[9]-1)/Ae[5],Ce=(Ae[8]-1)/Ae[0],Oe=(ye[8]+1)/ye[0],K=Ye*Ce,he=Ye*Oe,B=Re/(-Ce+Oe),ne=B*-Ce;se.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(ne),G.translateZ(B),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const ge=Ye+B,C=De+B,E=K-ne,H=he+(Re-ne),te=O*De/C*ge,oe=ot*De/C*ge;G.projectionMatrix.makePerspective(E,H,te,oe,ge,C),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function z(G,se){se===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(se.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(r===null)return;y.texture!==null&&(G.near=y.depthNear,G.far=y.depthFar),M.near=N.near=w.near=G.near,M.far=N.far=w.far=G.far,(R!==M.near||k!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,k=M.far,w.near=R,w.far=k,N.near=R,N.far=k,w.updateProjectionMatrix(),N.updateProjectionMatrix(),G.updateProjectionMatrix());const se=G.parent,me=M.cameras;z(M,se);for(let Re=0;Re<me.length;Re++)z(me[Re],se);me.length===2?U(M,w,N):M.projectionMatrix.copy(w.projectionMatrix),W(G,M,se)};function W(G,se,me){me===null?G.matrix.copy(se.matrixWorld):(G.matrix.copy(me.matrixWorld),G.matrix.invert(),G.matrix.multiply(se.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(se.projectionMatrix),G.projectionMatrixInverse.copy(se.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Gd*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(p===null&&g===null))return l},this.setFoveation=function(G){l=G,p!==null&&(p.fixedFoveation=G),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=G)},this.hasDepthSensing=function(){return y.texture!==null};let re=null;function ue(G,se){if(h=se.getViewerPose(c||o),x=se,h!==null){const me=h.views;g!==null&&(e.setRenderTargetFramebuffer(_,g.framebuffer),e.setRenderTarget(_));let Re=!1;me.length!==M.cameras.length&&(M.cameras.length=0,Re=!0);for(let ye=0;ye<me.length;ye++){const Ye=me[ye];let De=null;if(g!==null)De=g.getViewport(Ye);else{const ot=d.getViewSubImage(p,Ye);De=ot.viewport,ye===0&&(e.setRenderTargetTextures(_,ot.colorTexture,p.ignoreDepthValues?void 0:ot.depthStencilTexture),e.setRenderTarget(_))}let O=q[ye];O===void 0&&(O=new xn,O.layers.enable(ye),O.viewport=new ht,q[ye]=O),O.matrix.fromArray(Ye.transform.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale),O.projectionMatrix.fromArray(Ye.projectionMatrix),O.projectionMatrixInverse.copy(O.projectionMatrix).invert(),O.viewport.set(De.x,De.y,De.width,De.height),ye===0&&(M.matrix.copy(O.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Re===!0&&M.cameras.push(O)}const Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const ye=d.getDepthInformation(me[0]);ye&&ye.isValid&&ye.texture&&y.init(e,ye,r.renderState)}}for(let me=0;me<v.length;me++){const Re=S[me],Ae=v[me];Re!==null&&Ae!==void 0&&Ae.update(Re,se,c||o)}y.render(e,M),re&&re(G,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),x=null}const Ne=new Mx;Ne.setAnimationLoop(ue),this.setAnimationLoop=function(G){re=G},this.dispose=function(){}}}const yr=new ri,YC=new pt;function qC(t,e){function n(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,_x(t)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,_,v,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),d(m,u)):u.isMeshPhongMaterial?(s(m,u),h(m,u)):u.isMeshStandardMaterial?(s(m,u),p(m,u),u.isMeshPhysicalMaterial&&g(m,u,S)):u.isMeshMatcapMaterial?(s(m,u),x(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),y(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(o(m,u),u.isLineDashedMaterial&&a(m,u)):u.isPointsMaterial?l(m,u,_,v):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,n(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===dn&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,n(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===dn&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,n(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,n(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const _=e.get(u),v=_.envMap,S=_.envMapRotation;if(v&&(m.envMap.value=v,yr.copy(S),yr.x*=-1,yr.y*=-1,yr.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(yr.y*=-1,yr.z*=-1),m.envMapRotation.value.setFromMatrix4(YC.makeRotationFromEuler(yr)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap){m.lightMap.value=u.lightMap;const b=t._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=u.lightMapIntensity*b,n(u.lightMap,m.lightMapTransform)}u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,m.aoMapTransform))}function o(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform))}function a(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,_,v){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*_,m.scale.value=v*.5,u.map&&(m.map.value=u.map,n(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function d(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function p(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,m.roughnessMapTransform)),e.get(u).envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function g(m,u,_){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===dn&&m.clearcoatNormalScale.value.negate())),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,u){u.matcap&&(m.matcap.value=u.matcap)}function y(m,u){const _=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function KC(t,e,n,i){let r={},s={},o=[];const a=n.isWebGL2?t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,v){const S=v.program;i.uniformBlockBinding(_,S)}function c(_,v){let S=r[_.id];S===void 0&&(x(_),S=h(_),r[_.id]=S,_.addEventListener("dispose",m));const b=v.program;i.updateUBOMapping(_,b);const A=e.render.frame;s[_.id]!==A&&(p(_),s[_.id]=A)}function h(_){const v=d();_.__bindingPointIndex=v;const S=t.createBuffer(),b=_.__size,A=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,S),t.bufferData(t.UNIFORM_BUFFER,b,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,v,S),S}function d(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(_){const v=r[_.id],S=_.uniforms,b=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,v);for(let A=0,w=S.length;A<w;A++){const N=Array.isArray(S[A])?S[A]:[S[A]];for(let q=0,M=N.length;q<M;q++){const R=N[q];if(g(R,A,q,b)===!0){const k=R.__offset,J=Array.isArray(R.value)?R.value:[R.value];let L=0;for(let $=0;$<J.length;$++){const j=J[$],ee=y(j);typeof j=="number"||typeof j=="boolean"?(R.__data[0]=j,t.bufferSubData(t.UNIFORM_BUFFER,k+L,R.__data)):j.isMatrix3?(R.__data[0]=j.elements[0],R.__data[1]=j.elements[1],R.__data[2]=j.elements[2],R.__data[3]=0,R.__data[4]=j.elements[3],R.__data[5]=j.elements[4],R.__data[6]=j.elements[5],R.__data[7]=0,R.__data[8]=j.elements[6],R.__data[9]=j.elements[7],R.__data[10]=j.elements[8],R.__data[11]=0):(j.toArray(R.__data,L),L+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,k,R.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function g(_,v,S,b){const A=_.value,w=v+"_"+S;if(b[w]===void 0)return typeof A=="number"||typeof A=="boolean"?b[w]=A:b[w]=A.clone(),!0;{const N=b[w];if(typeof A=="number"||typeof A=="boolean"){if(N!==A)return b[w]=A,!0}else if(N.equals(A)===!1)return N.copy(A),!0}return!1}function x(_){const v=_.uniforms;let S=0;const b=16;for(let w=0,N=v.length;w<N;w++){const q=Array.isArray(v[w])?v[w]:[v[w]];for(let M=0,R=q.length;M<R;M++){const k=q[M],J=Array.isArray(k.value)?k.value:[k.value];for(let L=0,$=J.length;L<$;L++){const j=J[L],ee=y(j),U=S%b;U!==0&&b-U<ee.boundary&&(S+=b-U),k.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=S,S+=ee.storage}}}const A=S%b;return A>0&&(S+=b-A),_.__size=S,_.__cache={},this}function y(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const S=o.indexOf(v.__bindingPointIndex);o.splice(S,1),t.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function u(){for(const _ in r)t.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:c,dispose:u}}class Px{constructor(e={}){const{canvas:n=zM(),context:i=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let p;i!==null?p=i.getContextAttributes().alpha:p=o;const g=new Uint32Array(4),x=new Int32Array(4);let y=null,m=null;const u=[],_=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Kn,this._useLegacyLights=!1,this.toneMapping=tr,this.toneMappingExposure=1;const v=this;let S=!1,b=0,A=0,w=null,N=-1,q=null;const M=new ht,R=new ht;let k=null;const J=new Ke(0);let L=0,$=n.width,j=n.height,ee=1,U=null,z=null;const W=new ht(0,0,$,j),re=new ht(0,0,$,j);let ue=!1;const Ne=new th;let G=!1,se=!1,me=null;const Re=new pt,Ae=new Me,ye=new I,Ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function De(){return w===null?ee:1}let O=i;function ot(T,F){for(let Y=0;Y<T.length;Y++){const Z=T[Y],X=n.getContext(Z,F);if(X!==null)return X}return null}try{const T={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${qf}`),n.addEventListener("webglcontextlost",Te,!1),n.addEventListener("webglcontextrestored",D,!1),n.addEventListener("webglcontextcreationerror",de,!1),O===null){const F=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&F.shift(),O=ot(F,T),O===null)throw ot(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ce,Oe,K,he,B,ne,ge,C,E,H,te,oe,ae,Fe,Ie,pe,xe,ze,fe,_t,We,Le,we,be;function P(){Ce=new nT(O),Oe=new K2(O,Ce,e),Ce.init(Oe),Le=new jC(O,Ce,Oe),K=new zC(O,Ce,Oe),he=new sT(O),B=new TC,ne=new BC(O,Ce,K,B,Oe,Le,he),ge=new J2(v),C=new tT(v),E=new dE(O,Oe),we=new Y2(O,Ce,E,Oe),H=new iT(O,E,he,we),te=new cT(O,H,E,he),fe=new lT(O,Oe,ne),pe=new Z2(B),oe=new wC(v,ge,C,Ce,Oe,we,pe),ae=new qC(v,B),Fe=new AC,Ie=new DC(Ce,Oe),ze=new $2(v,ge,C,K,te,p,l),xe=new kC(v,te,Oe),be=new KC(O,he,Oe,K),_t=new q2(O,Ce,he,Oe),We=new rT(O,Ce,he,Oe),he.programs=oe.programs,v.capabilities=Oe,v.extensions=Ce,v.properties=B,v.renderLists=Fe,v.shadowMap=xe,v.state=K,v.info=he}P();const ie=new $C(v,O);this.xr=ie,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const T=Ce.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ce.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(T){T!==void 0&&(ee=T,this.setSize($,j,!1))},this.getSize=function(T){return T.set($,j)},this.setSize=function(T,F,Y=!0){if(ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=T,j=F,n.width=Math.floor(T*ee),n.height=Math.floor(F*ee),Y===!0&&(n.style.width=T+"px",n.style.height=F+"px"),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set($*ee,j*ee).floor()},this.setDrawingBufferSize=function(T,F,Y){$=T,j=F,ee=Y,n.width=Math.floor(T*Y),n.height=Math.floor(F*Y),this.setViewport(0,0,T,F)},this.getCurrentViewport=function(T){return T.copy(M)},this.getViewport=function(T){return T.copy(W)},this.setViewport=function(T,F,Y,Z){T.isVector4?W.set(T.x,T.y,T.z,T.w):W.set(T,F,Y,Z),K.viewport(M.copy(W).multiplyScalar(ee).round())},this.getScissor=function(T){return T.copy(re)},this.setScissor=function(T,F,Y,Z){T.isVector4?re.set(T.x,T.y,T.z,T.w):re.set(T,F,Y,Z),K.scissor(R.copy(re).multiplyScalar(ee).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(T){K.setScissorTest(ue=T)},this.setOpaqueSort=function(T){U=T},this.setTransparentSort=function(T){z=T},this.getClearColor=function(T){return T.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor.apply(ze,arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha.apply(ze,arguments)},this.clear=function(T=!0,F=!0,Y=!0){let Z=0;if(T){let X=!1;if(w!==null){const Se=w.texture.format;X=Se===lx||Se===ax||Se===ox}if(X){const Se=w.texture.type,Pe=Se===nr||Se===Gi||Se===Kf||Se===Dr||Se===rx||Se===sx,Ue=ze.getClearColor(),ke=ze.getClearAlpha(),Xe=Ue.r,Be=Ue.g,je=Ue.b;Pe?(g[0]=Xe,g[1]=Be,g[2]=je,g[3]=ke,O.clearBufferuiv(O.COLOR,0,g)):(x[0]=Xe,x[1]=Be,x[2]=je,x[3]=ke,O.clearBufferiv(O.COLOR,0,x))}else Z|=O.COLOR_BUFFER_BIT}F&&(Z|=O.DEPTH_BUFFER_BIT),Y&&(Z|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Te,!1),n.removeEventListener("webglcontextrestored",D,!1),n.removeEventListener("webglcontextcreationerror",de,!1),Fe.dispose(),Ie.dispose(),B.dispose(),ge.dispose(),C.dispose(),te.dispose(),we.dispose(),be.dispose(),oe.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",yt),ie.removeEventListener("sessionend",et),me&&(me.dispose(),me=null),at.stop()};function Te(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const T=he.autoReset,F=xe.enabled,Y=xe.autoUpdate,Z=xe.needsUpdate,X=xe.type;P(),he.autoReset=T,xe.enabled=F,xe.autoUpdate=Y,xe.needsUpdate=Z,xe.type=X}function de(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function V(T){const F=T.target;F.removeEventListener("dispose",V),le(F)}function le(T){_e(T),B.remove(T)}function _e(T){const F=B.get(T).programs;F!==void 0&&(F.forEach(function(Y){oe.releaseProgram(Y)}),T.isShaderMaterial&&oe.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,Y,Z,X,Se){F===null&&(F=Ye);const Pe=X.isMesh&&X.matrixWorld.determinant()<0,Ue=Ix(T,F,Y,Z,X);K.setMaterial(Z,Pe);let ke=Y.index,Xe=1;if(Z.wireframe===!0){if(ke=H.getWireframeAttribute(Y),ke===void 0)return;Xe=2}const Be=Y.drawRange,je=Y.attributes.position;let wt=Be.start*Xe,hn=(Be.start+Be.count)*Xe;Se!==null&&(wt=Math.max(wt,Se.start*Xe),hn=Math.min(hn,(Se.start+Se.count)*Xe)),ke!==null?(wt=Math.max(wt,0),hn=Math.min(hn,ke.count)):je!=null&&(wt=Math.max(wt,0),hn=Math.min(hn,je.count));const Dt=hn-wt;if(Dt<0||Dt===1/0)return;we.setup(X,Z,Ue,Y,ke);let si,mt=_t;if(ke!==null&&(si=E.get(ke),mt=We,mt.setIndex(si)),X.isMesh)Z.wireframe===!0?(K.setLineWidth(Z.wireframeLinewidth*De()),mt.setMode(O.LINES)):mt.setMode(O.TRIANGLES);else if(X.isLine){let Ve=Z.linewidth;Ve===void 0&&(Ve=1),K.setLineWidth(Ve*De()),X.isLineSegments?mt.setMode(O.LINES):X.isLineLoop?mt.setMode(O.LINE_LOOP):mt.setMode(O.LINE_STRIP)}else X.isPoints?mt.setMode(O.POINTS):X.isSprite&&mt.setMode(O.TRIANGLES);if(X.isBatchedMesh)mt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else if(X.isInstancedMesh)mt.renderInstances(wt,Dt,X.count);else if(Y.isInstancedBufferGeometry){const Ve=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,yc=Math.min(Y.instanceCount,Ve);mt.renderInstances(wt,Dt,yc)}else mt.render(wt,Dt)};function $e(T,F,Y){T.transparent===!0&&T.side===pi&&T.forceSinglePass===!1?(T.side=dn,T.needsUpdate=!0,fa(T,F,Y),T.side=sr,T.needsUpdate=!0,fa(T,F,Y),T.side=pi):fa(T,F,Y)}this.compile=function(T,F,Y=null){Y===null&&(Y=T),m=Ie.get(Y),m.init(),_.push(m),Y.traverseVisible(function(X){X.isLight&&X.layers.test(F.layers)&&(m.pushLight(X),X.castShadow&&m.pushShadow(X))}),T!==Y&&T.traverseVisible(function(X){X.isLight&&X.layers.test(F.layers)&&(m.pushLight(X),X.castShadow&&m.pushShadow(X))}),m.setupLights(v._useLegacyLights);const Z=new Set;return T.traverse(function(X){const Se=X.material;if(Se)if(Array.isArray(Se))for(let Pe=0;Pe<Se.length;Pe++){const Ue=Se[Pe];$e(Ue,Y,X),Z.add(Ue)}else $e(Se,Y,X),Z.add(Se)}),_.pop(),m=null,Z},this.compileAsync=function(T,F,Y=null){const Z=this.compile(T,F,Y);return new Promise(X=>{function Se(){if(Z.forEach(function(Pe){B.get(Pe).currentProgram.isReady()&&Z.delete(Pe)}),Z.size===0){X(T);return}setTimeout(Se,10)}Ce.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let tt=null;function rt(T){tt&&tt(T)}function yt(){at.stop()}function et(){at.start()}const at=new Mx;at.setAnimationLoop(rt),typeof self<"u"&&at.setContext(self),this.setAnimationLoop=function(T){tt=T,ie.setAnimationLoop(T),T===null?at.stop():at.start()},ie.addEventListener("sessionstart",yt),ie.addEventListener("sessionend",et),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(F),F=ie.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,F,w),m=Ie.get(T,_.length),m.init(),_.push(m),Re.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ne.setFromProjectionMatrix(Re),se=this.localClippingEnabled,G=pe.init(this.clippingPlanes,se),y=Fe.get(T,u.length),y.init(),u.push(y),jt(T,F,0,v.sortObjects),y.finish(),v.sortObjects===!0&&y.sort(U,z),this.info.render.frame++,G===!0&&pe.beginShadows();const Y=m.state.shadowsArray;if(xe.render(Y,T,F),G===!0&&pe.endShadows(),this.info.autoReset===!0&&this.info.reset(),(ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1)&&ze.render(y,T),m.setupLights(v._useLegacyLights),F.isArrayCamera){const Z=F.cameras;for(let X=0,Se=Z.length;X<Se;X++){const Pe=Z[X];fr(y,T,Pe,Pe.viewport)}}else fr(y,T,F);w!==null&&(ne.updateMultisampleRenderTarget(w),ne.updateRenderTargetMipmap(w)),T.isScene===!0&&T.onAfterRender(v,T,F),we.resetDefaultState(),N=-1,q=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,u.pop(),u.length>0?y=u[u.length-1]:y=null};function jt(T,F,Y,Z){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)Y=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Ne.intersectsSprite(T)){Z&&ye.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Re);const Pe=te.update(T),Ue=T.material;Ue.visible&&y.push(T,Pe,Ue,Y,ye.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Ne.intersectsObject(T))){const Pe=te.update(T),Ue=T.material;if(Z&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ye.copy(T.boundingSphere.center)):(Pe.boundingSphere===null&&Pe.computeBoundingSphere(),ye.copy(Pe.boundingSphere.center)),ye.applyMatrix4(T.matrixWorld).applyMatrix4(Re)),Array.isArray(Ue)){const ke=Pe.groups;for(let Xe=0,Be=ke.length;Xe<Be;Xe++){const je=ke[Xe],wt=Ue[je.materialIndex];wt&&wt.visible&&y.push(T,Pe,wt,Y,ye.z,je)}}else Ue.visible&&y.push(T,Pe,Ue,Y,ye.z,null)}}const Se=T.children;for(let Pe=0,Ue=Se.length;Pe<Ue;Pe++)jt(Se[Pe],F,Y,Z)}function fr(T,F,Y,Z){const X=T.opaque,Se=T.transmissive,Pe=T.transparent;m.setupLightsView(Y),G===!0&&pe.setGlobalState(v.clippingPlanes,Y),Se.length>0&&ua(X,Se,F,Y),Z&&K.viewport(M.copy(Z)),X.length>0&&da(X,F,Y),Se.length>0&&da(Se,F,Y),Pe.length>0&&da(Pe,F,Y),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function ua(T,F,Y,Z){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;const Se=Oe.isWebGL2;me===null&&(me=new jr(1,1,{generateMipmaps:!0,type:Ce.has("EXT_color_buffer_half_float")?Qo:nr,minFilter:Pr,samples:Se?4:0})),v.getDrawingBufferSize(Ae),Se?me.setSize(Ae.x,Ae.y):me.setSize(Wd(Ae.x),Wd(Ae.y));const Pe=v.getRenderTarget();v.setRenderTarget(me),v.getClearColor(J),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear();const Ue=v.toneMapping;v.toneMapping=tr,da(T,Y,Z),ne.updateMultisampleRenderTarget(me),ne.updateRenderTargetMipmap(me);let ke=!1;for(let Xe=0,Be=F.length;Xe<Be;Xe++){const je=F[Xe],wt=je.object,hn=je.geometry,Dt=je.material,si=je.group;if(Dt.side===pi&&wt.layers.test(Z.layers)){const mt=Dt.side;Dt.side=dn,Dt.needsUpdate=!0,ch(wt,Y,Z,hn,Dt,si),Dt.side=mt,Dt.needsUpdate=!0,ke=!0}}ke===!0&&(ne.updateMultisampleRenderTarget(me),ne.updateRenderTargetMipmap(me)),v.setRenderTarget(Pe),v.setClearColor(J,L),v.toneMapping=Ue}function da(T,F,Y){const Z=F.isScene===!0?F.overrideMaterial:null;for(let X=0,Se=T.length;X<Se;X++){const Pe=T[X],Ue=Pe.object,ke=Pe.geometry,Xe=Z===null?Pe.material:Z,Be=Pe.group;Ue.layers.test(Y.layers)&&ch(Ue,F,Y,ke,Xe,Be)}}function ch(T,F,Y,Z,X,Se){T.onBeforeRender(v,F,Y,Z,X,Se),T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),X.onBeforeRender(v,F,Y,Z,T,Se),X.transparent===!0&&X.side===pi&&X.forceSinglePass===!1?(X.side=dn,X.needsUpdate=!0,v.renderBufferDirect(Y,F,Z,X,T,Se),X.side=sr,X.needsUpdate=!0,v.renderBufferDirect(Y,F,Z,X,T,Se),X.side=pi):v.renderBufferDirect(Y,F,Z,X,T,Se),T.onAfterRender(v,F,Y,Z,X,Se)}function fa(T,F,Y){F.isScene!==!0&&(F=Ye);const Z=B.get(T),X=m.state.lights,Se=m.state.shadowsArray,Pe=X.state.version,Ue=oe.getParameters(T,X.state,Se,F,Y),ke=oe.getProgramCacheKey(Ue);let Xe=Z.programs;Z.environment=T.isMeshStandardMaterial?F.environment:null,Z.fog=F.fog,Z.envMap=(T.isMeshStandardMaterial?C:ge).get(T.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,Xe===void 0&&(T.addEventListener("dispose",V),Xe=new Map,Z.programs=Xe);let Be=Xe.get(ke);if(Be!==void 0){if(Z.currentProgram===Be&&Z.lightsStateVersion===Pe)return dh(T,Ue),Be}else Ue.uniforms=oe.getUniforms(T),T.onBuild(Y,Ue,v),T.onBeforeCompile(Ue,v),Be=oe.acquireProgram(Ue,ke),Xe.set(ke,Be),Z.uniforms=Ue.uniforms;const je=Z.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(je.clippingPlanes=pe.uniform),dh(T,Ue),Z.needsLights=Ox(T),Z.lightsStateVersion=Pe,Z.needsLights&&(je.ambientLightColor.value=X.state.ambient,je.lightProbe.value=X.state.probe,je.directionalLights.value=X.state.directional,je.directionalLightShadows.value=X.state.directionalShadow,je.spotLights.value=X.state.spot,je.spotLightShadows.value=X.state.spotShadow,je.rectAreaLights.value=X.state.rectArea,je.ltc_1.value=X.state.rectAreaLTC1,je.ltc_2.value=X.state.rectAreaLTC2,je.pointLights.value=X.state.point,je.pointLightShadows.value=X.state.pointShadow,je.hemisphereLights.value=X.state.hemi,je.directionalShadowMap.value=X.state.directionalShadowMap,je.directionalShadowMatrix.value=X.state.directionalShadowMatrix,je.spotShadowMap.value=X.state.spotShadowMap,je.spotLightMatrix.value=X.state.spotLightMatrix,je.spotLightMap.value=X.state.spotLightMap,je.pointShadowMap.value=X.state.pointShadowMap,je.pointShadowMatrix.value=X.state.pointShadowMatrix),Z.currentProgram=Be,Z.uniformsList=null,Be}function uh(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=pl.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function dh(T,F){const Y=B.get(T);Y.outputColorSpace=F.outputColorSpace,Y.batching=F.batching,Y.instancing=F.instancing,Y.instancingColor=F.instancingColor,Y.instancingMorph=F.instancingMorph,Y.skinning=F.skinning,Y.morphTargets=F.morphTargets,Y.morphNormals=F.morphNormals,Y.morphColors=F.morphColors,Y.morphTargetsCount=F.morphTargetsCount,Y.numClippingPlanes=F.numClippingPlanes,Y.numIntersection=F.numClipIntersection,Y.vertexAlphas=F.vertexAlphas,Y.vertexTangents=F.vertexTangents,Y.toneMapping=F.toneMapping}function Ix(T,F,Y,Z,X){F.isScene!==!0&&(F=Ye),ne.resetTextureUnits();const Se=F.fog,Pe=Z.isMeshStandardMaterial?F.environment:null,Ue=w===null?v.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:dr,ke=(Z.isMeshStandardMaterial?C:ge).get(Z.envMap||Pe),Xe=Z.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Be=!!Y.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),je=!!Y.morphAttributes.position,wt=!!Y.morphAttributes.normal,hn=!!Y.morphAttributes.color;let Dt=tr;Z.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Dt=v.toneMapping);const si=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,mt=si!==void 0?si.length:0,Ve=B.get(Z),yc=m.state.lights;if(G===!0&&(se===!0||T!==q)){const wn=T===q&&Z.id===N;pe.setState(Z,T,wn)}let dt=!1;Z.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==yc.state.version||Ve.outputColorSpace!==Ue||X.isBatchedMesh&&Ve.batching===!1||!X.isBatchedMesh&&Ve.batching===!0||X.isInstancedMesh&&Ve.instancing===!1||!X.isInstancedMesh&&Ve.instancing===!0||X.isSkinnedMesh&&Ve.skinning===!1||!X.isSkinnedMesh&&Ve.skinning===!0||X.isInstancedMesh&&Ve.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ve.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ve.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ve.instancingMorph===!1&&X.morphTexture!==null||Ve.envMap!==ke||Z.fog===!0&&Ve.fog!==Se||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==pe.numPlanes||Ve.numIntersection!==pe.numIntersection)||Ve.vertexAlphas!==Xe||Ve.vertexTangents!==Be||Ve.morphTargets!==je||Ve.morphNormals!==wt||Ve.morphColors!==hn||Ve.toneMapping!==Dt||Oe.isWebGL2===!0&&Ve.morphTargetsCount!==mt)&&(dt=!0):(dt=!0,Ve.__version=Z.version);let hr=Ve.currentProgram;dt===!0&&(hr=fa(Z,F,X));let fh=!1,eo=!1,Sc=!1;const Vt=hr.getUniforms(),pr=Ve.uniforms;if(K.useProgram(hr.program)&&(fh=!0,eo=!0,Sc=!0),Z.id!==N&&(N=Z.id,eo=!0),fh||q!==T){Vt.setValue(O,"projectionMatrix",T.projectionMatrix),Vt.setValue(O,"viewMatrix",T.matrixWorldInverse);const wn=Vt.map.cameraPosition;wn!==void 0&&wn.setValue(O,ye.setFromMatrixPosition(T.matrixWorld)),Oe.logarithmicDepthBuffer&&Vt.setValue(O,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Vt.setValue(O,"isOrthographic",T.isOrthographicCamera===!0),q!==T&&(q=T,eo=!0,Sc=!0)}if(X.isSkinnedMesh){Vt.setOptional(O,X,"bindMatrix"),Vt.setOptional(O,X,"bindMatrixInverse");const wn=X.skeleton;wn&&(Oe.floatVertexTextures?(wn.boneTexture===null&&wn.computeBoneTexture(),Vt.setValue(O,"boneTexture",wn.boneTexture,ne)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}X.isBatchedMesh&&(Vt.setOptional(O,X,"batchingTexture"),Vt.setValue(O,"batchingTexture",X._matricesTexture,ne));const Mc=Y.morphAttributes;if((Mc.position!==void 0||Mc.normal!==void 0||Mc.color!==void 0&&Oe.isWebGL2===!0)&&fe.update(X,Y,hr),(eo||Ve.receiveShadow!==X.receiveShadow)&&(Ve.receiveShadow=X.receiveShadow,Vt.setValue(O,"receiveShadow",X.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(pr.envMap.value=ke,pr.flipEnvMap.value=ke.isCubeTexture&&ke.isRenderTargetTexture===!1?-1:1),eo&&(Vt.setValue(O,"toneMappingExposure",v.toneMappingExposure),Ve.needsLights&&Ux(pr,Sc),Se&&Z.fog===!0&&ae.refreshFogUniforms(pr,Se),ae.refreshMaterialUniforms(pr,Z,ee,j,me),pl.upload(O,uh(Ve),pr,ne)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(pl.upload(O,uh(Ve),pr,ne),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Vt.setValue(O,"center",X.center),Vt.setValue(O,"modelViewMatrix",X.modelViewMatrix),Vt.setValue(O,"normalMatrix",X.normalMatrix),Vt.setValue(O,"modelMatrix",X.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const wn=Z.uniformsGroups;for(let Ec=0,Fx=wn.length;Ec<Fx;Ec++)if(Oe.isWebGL2){const hh=wn[Ec];be.update(hh,hr),be.bind(hh,hr)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return hr}function Ux(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function Ox(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(T,F,Y){B.get(T.texture).__webglTexture=F,B.get(T.depthTexture).__webglTexture=Y;const Z=B.get(T);Z.__hasExternalTextures=!0,Z.__autoAllocateDepthBuffer=Y===void 0,Z.__autoAllocateDepthBuffer||Ce.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,F){const Y=B.get(T);Y.__webglFramebuffer=F,Y.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,Y=0){w=T,b=F,A=Y;let Z=!0,X=null,Se=!1,Pe=!1;if(T){const ke=B.get(T);ke.__useDefaultFramebuffer!==void 0?(K.bindFramebuffer(O.FRAMEBUFFER,null),Z=!1):ke.__webglFramebuffer===void 0?ne.setupRenderTarget(T):ke.__hasExternalTextures&&ne.rebindTextures(T,B.get(T.texture).__webglTexture,B.get(T.depthTexture).__webglTexture);const Xe=T.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(Pe=!0);const Be=B.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Be[F])?X=Be[F][Y]:X=Be[F],Se=!0):Oe.isWebGL2&&T.samples>0&&ne.useMultisampledRTT(T)===!1?X=B.get(T).__webglMultisampledFramebuffer:Array.isArray(Be)?X=Be[Y]:X=Be,M.copy(T.viewport),R.copy(T.scissor),k=T.scissorTest}else M.copy(W).multiplyScalar(ee).floor(),R.copy(re).multiplyScalar(ee).floor(),k=ue;if(K.bindFramebuffer(O.FRAMEBUFFER,X)&&Oe.drawBuffers&&Z&&K.drawBuffers(T,X),K.viewport(M),K.scissor(R),K.setScissorTest(k),Se){const ke=B.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,ke.__webglTexture,Y)}else if(Pe){const ke=B.get(T.texture),Xe=F||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,ke.__webglTexture,Y||0,Xe)}N=-1},this.readRenderTargetPixels=function(T,F,Y,Z,X,Se,Pe){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=B.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ue=Ue[Pe]),Ue){K.bindFramebuffer(O.FRAMEBUFFER,Ue);try{const ke=T.texture,Xe=ke.format,Be=ke.type;if(Xe!==Vn&&Le.convert(Xe)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const je=Be===Qo&&(Ce.has("EXT_color_buffer_half_float")||Oe.isWebGL2&&Ce.has("EXT_color_buffer_float"));if(Be!==nr&&Le.convert(Be)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Be===mi&&(Oe.isWebGL2||Ce.has("OES_texture_float")||Ce.has("WEBGL_color_buffer_float")))&&!je){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-Z&&Y>=0&&Y<=T.height-X&&O.readPixels(F,Y,Z,X,Le.convert(Xe),Le.convert(Be),Se)}finally{const ke=w!==null?B.get(w).__webglFramebuffer:null;K.bindFramebuffer(O.FRAMEBUFFER,ke)}}},this.copyFramebufferToTexture=function(T,F,Y=0){const Z=Math.pow(2,-Y),X=Math.floor(F.image.width*Z),Se=Math.floor(F.image.height*Z);ne.setTexture2D(F,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,T.x,T.y,X,Se),K.unbindTexture()},this.copyTextureToTexture=function(T,F,Y,Z=0){const X=F.image.width,Se=F.image.height,Pe=Le.convert(Y.format),Ue=Le.convert(Y.type);ne.setTexture2D(Y,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Y.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Y.unpackAlignment),F.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Z,T.x,T.y,X,Se,Pe,Ue,F.image.data):F.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Z,T.x,T.y,F.mipmaps[0].width,F.mipmaps[0].height,Pe,F.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,Z,T.x,T.y,Pe,Ue,F.image),Z===0&&Y.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),K.unbindTexture()},this.copyTextureToTexture3D=function(T,F,Y,Z,X=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Se=Math.round(T.max.x-T.min.x),Pe=Math.round(T.max.y-T.min.y),Ue=T.max.z-T.min.z+1,ke=Le.convert(Z.format),Xe=Le.convert(Z.type);let Be;if(Z.isData3DTexture)ne.setTexture3D(Z,0),Be=O.TEXTURE_3D;else if(Z.isDataArrayTexture||Z.isCompressedArrayTexture)ne.setTexture2DArray(Z,0),Be=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Z.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Z.unpackAlignment);const je=O.getParameter(O.UNPACK_ROW_LENGTH),wt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),hn=O.getParameter(O.UNPACK_SKIP_PIXELS),Dt=O.getParameter(O.UNPACK_SKIP_ROWS),si=O.getParameter(O.UNPACK_SKIP_IMAGES),mt=Y.isCompressedTexture?Y.mipmaps[X]:Y.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,mt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,mt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,T.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,T.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,T.min.z),Y.isDataTexture||Y.isData3DTexture?O.texSubImage3D(Be,X,F.x,F.y,F.z,Se,Pe,Ue,ke,Xe,mt.data):Z.isCompressedArrayTexture?O.compressedTexSubImage3D(Be,X,F.x,F.y,F.z,Se,Pe,Ue,ke,mt.data):O.texSubImage3D(Be,X,F.x,F.y,F.z,Se,Pe,Ue,ke,Xe,mt),O.pixelStorei(O.UNPACK_ROW_LENGTH,je),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,wt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,hn),O.pixelStorei(O.UNPACK_SKIP_ROWS,Dt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,si),X===0&&Z.generateMipmaps&&O.generateMipmap(Be),K.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?ne.setTextureCube(T,0):T.isData3DTexture?ne.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?ne.setTexture2DArray(T,0):ne.setTexture2D(T,0),K.unbindTexture()},this.resetState=function(){b=0,A=0,w=null,K.reset(),we.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===Zf?"display-p3":"srgb",n.unpackColorSpace=it.workingColorSpace===gc?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class ZC extends Px{}ZC.prototype.isWebGL1Renderer=!0;class JC extends Yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class Ti{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,n){const i=this.getUtoTmapping(e);return this.getPoint(i,n)}getPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPoint(i/e));return n}getSpacedPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPointAt(i/e));return n}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const n=[];let i,r=this.getPoint(0),s=0;n.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),n.push(s),r=i;return this.cacheArcLengths=n,n}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,n){const i=this.getLengths();let r=0;const s=i.length;let o;n?o=n:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const h=i[r],p=i[r+1]-h,g=(o-h)/p;return(r+g)/(s-1)}getTangent(e,n){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=n||(o.isVector2?new Me:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,n){const i=this.getUtoTmapping(e);return this.getTangent(i,n)}computeFrenetFrames(e,n){const i=new I,r=[],s=[],o=[],a=new I,l=new pt;for(let g=0;g<=e;g++){const x=g/e;r[g]=this.getTangentAt(x,new I)}s[0]=new I,o[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(r[0].x),d=Math.abs(r[0].y),p=Math.abs(r[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),p<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let g=1;g<=e;g++){if(s[g]=s[g-1].clone(),o[g]=o[g-1].clone(),a.crossVectors(r[g-1],r[g]),a.length()>Number.EPSILON){a.normalize();const x=Math.acos(Ot(r[g-1].dot(r[g]),-1,1));s[g].applyMatrix4(l.makeRotationAxis(a,x))}o[g].crossVectors(r[g],s[g])}if(n===!0){let g=Math.acos(Ot(s[0].dot(s[e]),-1,1));g/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(g=-g);for(let x=1;x<=e;x++)s[x].applyMatrix4(l.makeRotationAxis(r[x],g*x)),o[x].crossVectors(r[x],s[x])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Lx extends Ti{constructor(e=0,n=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=n,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,n=new Me){const i=n,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),p=l-this.aX,g=c-this.aY;l=p*h-g*d+this.aX,c=p*d+g*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class QC extends Lx{constructor(e,n,i,r,s,o){super(e,n,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function ih(){let t=0,e=0,n=0,i=0;function r(s,o,a,l){t=s,e=a,n=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,h,d){let p=(o-s)/c-(a-s)/(c+h)+(a-o)/h,g=(a-o)/h-(l-o)/(h+d)+(l-a)/d;p*=h,g*=h,r(o,a,p,g)},calc:function(s){const o=s*s,a=o*s;return t+e*s+n*o+i*a}}}const Za=new I,Ru=new ih,Pu=new ih,Lu=new ih;class eA extends Ti{constructor(e=[],n=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=n,this.curveType=i,this.tension=r}getPoint(e,n=new I){const i=n,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,h;this.closed||a>0?c=r[(a-1)%s]:(Za.subVectors(r[0],r[1]).add(r[0]),c=Za);const d=r[a%s],p=r[(a+1)%s];if(this.closed||a+2<s?h=r[(a+2)%s]:(Za.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Za),this.curveType==="centripetal"||this.curveType==="chordal"){const g=this.curveType==="chordal"?.5:.25;let x=Math.pow(c.distanceToSquared(d),g),y=Math.pow(d.distanceToSquared(p),g),m=Math.pow(p.distanceToSquared(h),g);y<1e-4&&(y=1),x<1e-4&&(x=y),m<1e-4&&(m=y),Ru.initNonuniformCatmullRom(c.x,d.x,p.x,h.x,x,y,m),Pu.initNonuniformCatmullRom(c.y,d.y,p.y,h.y,x,y,m),Lu.initNonuniformCatmullRom(c.z,d.z,p.z,h.z,x,y,m)}else this.curveType==="catmullrom"&&(Ru.initCatmullRom(c.x,d.x,p.x,h.x,this.tension),Pu.initCatmullRom(c.y,d.y,p.y,h.y,this.tension),Lu.initCatmullRom(c.z,d.z,p.z,h.z,this.tension));return i.set(Ru.calc(l),Pu.calc(l),Lu.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let n=0,i=this.points.length;n<i;n++){const r=this.points[n];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(new I().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function rg(t,e,n,i,r){const s=(i-e)*.5,o=(r-n)*.5,a=t*t,l=t*a;return(2*n-2*i+s+o)*l+(-3*n+3*i-2*s-o)*a+s*t+n}function tA(t,e){const n=1-t;return n*n*e}function nA(t,e){return 2*(1-t)*t*e}function iA(t,e){return t*t*e}function No(t,e,n,i){return tA(t,e)+nA(t,n)+iA(t,i)}function rA(t,e){const n=1-t;return n*n*n*e}function sA(t,e){const n=1-t;return 3*n*n*t*e}function oA(t,e){return 3*(1-t)*t*t*e}function aA(t,e){return t*t*t*e}function Do(t,e,n,i,r){return rA(t,e)+sA(t,n)+oA(t,i)+aA(t,r)}class lA extends Ti{constructor(e=new Me,n=new Me,i=new Me,r=new Me){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=n,this.v2=i,this.v3=r}getPoint(e,n=new Me){const i=n,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Do(e,r.x,s.x,o.x,a.x),Do(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class cA extends Ti{constructor(e=new I,n=new I,i=new I,r=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=n,this.v2=i,this.v3=r}getPoint(e,n=new I){const i=n,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Do(e,r.x,s.x,o.x,a.x),Do(e,r.y,s.y,o.y,a.y),Do(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class uA extends Ti{constructor(e=new Me,n=new Me){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=n}getPoint(e,n=new Me){const i=n;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,n){return this.getPoint(e,n)}getTangent(e,n=new Me){return n.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,n){return this.getTangent(e,n)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class dA extends Ti{constructor(e=new I,n=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=n}getPoint(e,n=new I){const i=n;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,n){return this.getPoint(e,n)}getTangent(e,n=new I){return n.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,n){return this.getTangent(e,n)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class fA extends Ti{constructor(e=new Me,n=new Me,i=new Me){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=n,this.v2=i}getPoint(e,n=new Me){const i=n,r=this.v0,s=this.v1,o=this.v2;return i.set(No(e,r.x,s.x,o.x),No(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class rh extends Ti{constructor(e=new I,n=new I,i=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=n,this.v2=i}getPoint(e,n=new I){const i=n,r=this.v0,s=this.v1,o=this.v2;return i.set(No(e,r.x,s.x,o.x),No(e,r.y,s.y,o.y),No(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hA extends Ti{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,n=new Me){const i=n,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],h=r[o>r.length-2?r.length-1:o+1],d=r[o>r.length-3?r.length-1:o+2];return i.set(rg(a,l.x,c.x,h.x,d.x),rg(a,l.y,c.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let n=0,i=this.points.length;n<i;n++){const r=this.points[n];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(new Me().fromArray(r))}return this}}var pA=Object.freeze({__proto__:null,ArcCurve:QC,CatmullRomCurve3:eA,CubicBezierCurve:lA,CubicBezierCurve3:cA,EllipseCurve:Lx,LineCurve:uA,LineCurve3:dA,QuadraticBezierCurve:fA,QuadraticBezierCurve3:rh,SplineCurve:hA});class gn extends Xn{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],d=[],p=[],g=[];let x=0;const y=[],m=i/2;let u=0;_(),o===!1&&(e>0&&v(!0),n>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Pt(d,3)),this.setAttribute("normal",new Pt(p,3)),this.setAttribute("uv",new Pt(g,2));function _(){const S=new I,b=new I;let A=0;const w=(n-e)/i;for(let N=0;N<=s;N++){const q=[],M=N/s,R=M*(n-e)+e;for(let k=0;k<=r;k++){const J=k/r,L=J*l+a,$=Math.sin(L),j=Math.cos(L);b.x=R*$,b.y=-M*i+m,b.z=R*j,d.push(b.x,b.y,b.z),S.set($,w,j).normalize(),p.push(S.x,S.y,S.z),g.push(J,1-M),q.push(x++)}y.push(q)}for(let N=0;N<r;N++)for(let q=0;q<s;q++){const M=y[q][N],R=y[q+1][N],k=y[q+1][N+1],J=y[q][N+1];h.push(M,R,J),h.push(R,k,J),A+=6}c.addGroup(u,A,0),u+=A}function v(S){const b=x,A=new Me,w=new I;let N=0;const q=S===!0?e:n,M=S===!0?1:-1;for(let k=1;k<=r;k++)d.push(0,m*M,0),p.push(0,M,0),g.push(.5,.5),x++;const R=x;for(let k=0;k<=r;k++){const L=k/r*l+a,$=Math.cos(L),j=Math.sin(L);w.x=q*j,w.y=m*M,w.z=q*$,d.push(w.x,w.y,w.z),p.push(0,M,0),A.x=$*.5+.5,A.y=j*.5*M+.5,g.push(A.x,A.y),x++}for(let k=0;k<r;k++){const J=b+k,L=R+k;S===!0?h.push(L,L+1,J):h.push(L+1,L,J),N+=3}c.addGroup(u,N,S===!0?1:2),u+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class sh extends Xn{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new I,p=new I,g=[],x=[],y=[],m=[];for(let u=0;u<=i;u++){const _=[],v=u/i;let S=0;u===0&&o===0?S=.5/n:u===i&&l===Math.PI&&(S=-.5/n);for(let b=0;b<=n;b++){const A=b/n;d.x=-e*Math.cos(r+A*s)*Math.sin(o+v*a),d.y=e*Math.cos(o+v*a),d.z=e*Math.sin(r+A*s)*Math.sin(o+v*a),x.push(d.x,d.y,d.z),p.copy(d).normalize(),y.push(p.x,p.y,p.z),m.push(A+S,1-v),_.push(c++)}h.push(_)}for(let u=0;u<i;u++)for(let _=0;_<n;_++){const v=h[u][_+1],S=h[u][_],b=h[u+1][_],A=h[u+1][_+1];(u!==0||o>0)&&g.push(v,S,A),(u!==i-1||l<Math.PI)&&g.push(S,b,A)}this.setIndex(g),this.setAttribute("position",new Pt(x,3)),this.setAttribute("normal",new Pt(y,3)),this.setAttribute("uv",new Pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class oh extends Xn{constructor(e=1,n=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:n,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],l=[],c=[],h=new I,d=new I,p=new I;for(let g=0;g<=i;g++)for(let x=0;x<=r;x++){const y=x/r*s,m=g/i*Math.PI*2;d.x=(e+n*Math.cos(m))*Math.cos(y),d.y=(e+n*Math.cos(m))*Math.sin(y),d.z=n*Math.sin(m),a.push(d.x,d.y,d.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),p.subVectors(d,h).normalize(),l.push(p.x,p.y,p.z),c.push(x/r),c.push(g/i)}for(let g=1;g<=i;g++)for(let x=1;x<=r;x++){const y=(r+1)*g+x-1,m=(r+1)*(g-1)+x-1,u=(r+1)*(g-1)+x,_=(r+1)*g+x;o.push(y,m,_),o.push(m,u,_)}this.setIndex(o),this.setAttribute("position",new Pt(a,3)),this.setAttribute("normal",new Pt(l,3)),this.setAttribute("uv",new Pt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oh(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ah extends Xn{constructor(e=new rh(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),n=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:n,radius:i,radialSegments:r,closed:s};const o=e.computeFrenetFrames(n,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new I,l=new I,c=new Me;let h=new I;const d=[],p=[],g=[],x=[];y(),this.setIndex(x),this.setAttribute("position",new Pt(d,3)),this.setAttribute("normal",new Pt(p,3)),this.setAttribute("uv",new Pt(g,2));function y(){for(let v=0;v<n;v++)m(v);m(s===!1?n:0),_(),u()}function m(v){h=e.getPointAt(v/n,h);const S=o.normals[v],b=o.binormals[v];for(let A=0;A<=r;A++){const w=A/r*Math.PI*2,N=Math.sin(w),q=-Math.cos(w);l.x=q*S.x+N*b.x,l.y=q*S.y+N*b.y,l.z=q*S.z+N*b.z,l.normalize(),p.push(l.x,l.y,l.z),a.x=h.x+i*l.x,a.y=h.y+i*l.y,a.z=h.z+i*l.z,d.push(a.x,a.y,a.z)}}function u(){for(let v=1;v<=n;v++)for(let S=1;S<=r;S++){const b=(r+1)*(v-1)+(S-1),A=(r+1)*v+(S-1),w=(r+1)*v+S,N=(r+1)*(v-1)+S;x.push(b,A,N),x.push(A,w,N)}}function _(){for(let v=0;v<=n;v++)for(let S=0;S<=r;S++)c.x=v/n,c.y=S/r,g.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new ah(new pA[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Yn extends ca{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ux,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class mA extends Yn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ot(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(n){this.ior=(1+.4*n)/(1-.4*n)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ke(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ke(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ke(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class lh extends Yt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),n}}const Nu=new pt,sg=new I,og=new I;class Nx{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Me(512,512),this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new th,this._frameExtents=new Me(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;sg.setFromMatrixPosition(e.matrixWorld),n.position.copy(sg),og.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(og),n.updateMatrixWorld(),Nu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Nu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ag=new pt,vo=new I,Du=new I;class gA extends Nx{constructor(){super(new xn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Me(4,2),this._viewportCount=6,this._viewports=[new ht(2,1,1,1),new ht(0,1,1,1),new ht(3,1,1,1),new ht(1,1,1,1),new ht(3,0,1,1),new ht(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,n=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),vo.setFromMatrixPosition(e.matrixWorld),i.position.copy(vo),Du.copy(i.position),Du.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt(Du),i.updateMatrixWorld(),r.makeTranslation(-vo.x,-vo.y,-vo.z),ag.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ag)}}class vA extends lh{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new gA}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class xA extends Nx{constructor(){super(new Ex(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class lg extends lh{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Yt.DEFAULT_UP),this.updateMatrix(),this.target=new Yt,this.shadow=new xA}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class _A extends lh{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const cg=new pt;class yA{constructor(e,n,i=0,r=1/0){this.ray=new Qf(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new eh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return cg.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(cg),this}intersectObject(e,n=!0,i=[]){return $d(e,this,i,n),i.sort(ug),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)$d(e[r],this,i,n);return i.sort(ug),i}}function ug(t,e){return t.distance-e.distance}function $d(t,e,n,i){if(t.layers.test(e.layers)&&t.raycast(e,n),i===!0){const r=t.children;for(let s=0,o=r.length;s<o;s++)$d(r[s],e,n,!0)}}class dg{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ot(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qf);const fg={type:"change"},Iu={type:"start"},hg={type:"end"},Ja=new Qf,pg=new Fi,SA=Math.cos(70*kM.DEG2RAD);class MA extends Xr{constructor(e,n){super(),this.object=e,this.domElement=n,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Yr.ROTATE,MIDDLE:Yr.DOLLY,RIGHT:Yr.PAN},this.touches={ONE:qr.ROTATE,TWO:qr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",Ie),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Ie),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(fg),i.update(),s=r.NONE},this.update=function(){const P=new I,ie=new Vr().setFromUnitVectors(e.up,new I(0,1,0)),Te=ie.clone().invert(),D=new I,de=new Vr,V=new I,le=2*Math.PI;return function($e=null){const tt=i.object.position;P.copy(tt).sub(i.target),P.applyQuaternion(ie),a.setFromVector3(P),i.autoRotate&&s===r.NONE&&k(M($e)),i.enableDamping?(a.theta+=l.theta*i.dampingFactor,a.phi+=l.phi*i.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let rt=i.minAzimuthAngle,yt=i.maxAzimuthAngle;isFinite(rt)&&isFinite(yt)&&(rt<-Math.PI?rt+=le:rt>Math.PI&&(rt-=le),yt<-Math.PI?yt+=le:yt>Math.PI&&(yt-=le),rt<=yt?a.theta=Math.max(rt,Math.min(yt,a.theta)):a.theta=a.theta>(rt+yt)/2?Math.max(rt,a.theta):Math.min(yt,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor);let et=!1;if(i.zoomToCursor&&A||i.object.isOrthographicCamera)a.radius=W(a.radius);else{const at=a.radius;a.radius=W(a.radius*c),et=at!=a.radius}if(P.setFromSpherical(a),P.applyQuaternion(Te),tt.copy(i.target).add(P),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),h.set(0,0,0)),i.zoomToCursor&&A){let at=null;if(i.object.isPerspectiveCamera){const jt=P.length();at=W(jt*c);const fr=jt-at;i.object.position.addScaledVector(S,fr),i.object.updateMatrixWorld(),et=!!fr}else if(i.object.isOrthographicCamera){const jt=new I(b.x,b.y,0);jt.unproject(i.object);const fr=i.object.zoom;i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),et=fr!==i.object.zoom;const ua=new I(b.x,b.y,0);ua.unproject(i.object),i.object.position.sub(ua).add(jt),i.object.updateMatrixWorld(),at=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;at!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(at).add(i.object.position):(Ja.origin.copy(i.object.position),Ja.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(Ja.direction))<SA?e.lookAt(i.target):(pg.setFromNormalAndCoplanarPoint(i.object.up,i.target),Ja.intersectPlane(pg,i.target))))}else if(i.object.isOrthographicCamera){const at=i.object.zoom;i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),at!==i.object.zoom&&(i.object.updateProjectionMatrix(),et=!0)}return c=1,A=!1,et||D.distanceToSquared(i.object.position)>o||8*(1-de.dot(i.object.quaternion))>o||V.distanceToSquared(i.target)>o?(i.dispatchEvent(fg),D.copy(i.object.position),de.copy(i.object.quaternion),V.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",ze),i.domElement.removeEventListener("pointerdown",ne),i.domElement.removeEventListener("pointercancel",C),i.domElement.removeEventListener("wheel",te),i.domElement.removeEventListener("pointermove",ge),i.domElement.removeEventListener("pointerup",C),i.domElement.getRootNode().removeEventListener("keydown",ae,{capture:!0}),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",Ie),i._domElementKeyEvents=null)};const i=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const o=1e-6,a=new dg,l=new dg;let c=1;const h=new I,d=new Me,p=new Me,g=new Me,x=new Me,y=new Me,m=new Me,u=new Me,_=new Me,v=new Me,S=new I,b=new Me;let A=!1;const w=[],N={};let q=!1;function M(P){return P!==null?2*Math.PI/60*i.autoRotateSpeed*P:2*Math.PI/60/60*i.autoRotateSpeed}function R(P){const ie=Math.abs(P*.01);return Math.pow(.95,i.zoomSpeed*ie)}function k(P){l.theta-=P}function J(P){l.phi-=P}const L=function(){const P=new I;return function(Te,D){P.setFromMatrixColumn(D,0),P.multiplyScalar(-Te),h.add(P)}}(),$=function(){const P=new I;return function(Te,D){i.screenSpacePanning===!0?P.setFromMatrixColumn(D,1):(P.setFromMatrixColumn(D,0),P.crossVectors(i.object.up,P)),P.multiplyScalar(Te),h.add(P)}}(),j=function(){const P=new I;return function(Te,D){const de=i.domElement;if(i.object.isPerspectiveCamera){const V=i.object.position;P.copy(V).sub(i.target);let le=P.length();le*=Math.tan(i.object.fov/2*Math.PI/180),L(2*Te*le/de.clientHeight,i.object.matrix),$(2*D*le/de.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(L(Te*(i.object.right-i.object.left)/i.object.zoom/de.clientWidth,i.object.matrix),$(D*(i.object.top-i.object.bottom)/i.object.zoom/de.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function ee(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function U(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function z(P,ie){if(!i.zoomToCursor)return;A=!0;const Te=i.domElement.getBoundingClientRect(),D=P-Te.left,de=ie-Te.top,V=Te.width,le=Te.height;b.x=D/V*2-1,b.y=-(de/le)*2+1,S.set(b.x,b.y,1).unproject(i.object).sub(i.object.position).normalize()}function W(P){return Math.max(i.minDistance,Math.min(i.maxDistance,P))}function re(P){d.set(P.clientX,P.clientY)}function ue(P){z(P.clientX,P.clientX),u.set(P.clientX,P.clientY)}function Ne(P){x.set(P.clientX,P.clientY)}function G(P){p.set(P.clientX,P.clientY),g.subVectors(p,d).multiplyScalar(i.rotateSpeed);const ie=i.domElement;k(2*Math.PI*g.x/ie.clientHeight),J(2*Math.PI*g.y/ie.clientHeight),d.copy(p),i.update()}function se(P){_.set(P.clientX,P.clientY),v.subVectors(_,u),v.y>0?ee(R(v.y)):v.y<0&&U(R(v.y)),u.copy(_),i.update()}function me(P){y.set(P.clientX,P.clientY),m.subVectors(y,x).multiplyScalar(i.panSpeed),j(m.x,m.y),x.copy(y),i.update()}function Re(P){z(P.clientX,P.clientY),P.deltaY<0?U(R(P.deltaY)):P.deltaY>0&&ee(R(P.deltaY)),i.update()}function Ae(P){let ie=!1;switch(P.code){case i.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?J(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):j(0,i.keyPanSpeed),ie=!0;break;case i.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?J(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):j(0,-i.keyPanSpeed),ie=!0;break;case i.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?k(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):j(i.keyPanSpeed,0),ie=!0;break;case i.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?k(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):j(-i.keyPanSpeed,0),ie=!0;break}ie&&(P.preventDefault(),i.update())}function ye(P){if(w.length===1)d.set(P.pageX,P.pageY);else{const ie=we(P),Te=.5*(P.pageX+ie.x),D=.5*(P.pageY+ie.y);d.set(Te,D)}}function Ye(P){if(w.length===1)x.set(P.pageX,P.pageY);else{const ie=we(P),Te=.5*(P.pageX+ie.x),D=.5*(P.pageY+ie.y);x.set(Te,D)}}function De(P){const ie=we(P),Te=P.pageX-ie.x,D=P.pageY-ie.y,de=Math.sqrt(Te*Te+D*D);u.set(0,de)}function O(P){i.enableZoom&&De(P),i.enablePan&&Ye(P)}function ot(P){i.enableZoom&&De(P),i.enableRotate&&ye(P)}function Ce(P){if(w.length==1)p.set(P.pageX,P.pageY);else{const Te=we(P),D=.5*(P.pageX+Te.x),de=.5*(P.pageY+Te.y);p.set(D,de)}g.subVectors(p,d).multiplyScalar(i.rotateSpeed);const ie=i.domElement;k(2*Math.PI*g.x/ie.clientHeight),J(2*Math.PI*g.y/ie.clientHeight),d.copy(p)}function Oe(P){if(w.length===1)y.set(P.pageX,P.pageY);else{const ie=we(P),Te=.5*(P.pageX+ie.x),D=.5*(P.pageY+ie.y);y.set(Te,D)}m.subVectors(y,x).multiplyScalar(i.panSpeed),j(m.x,m.y),x.copy(y)}function K(P){const ie=we(P),Te=P.pageX-ie.x,D=P.pageY-ie.y,de=Math.sqrt(Te*Te+D*D);_.set(0,de),v.set(0,Math.pow(_.y/u.y,i.zoomSpeed)),ee(v.y),u.copy(_);const V=(P.pageX+ie.x)*.5,le=(P.pageY+ie.y)*.5;z(V,le)}function he(P){i.enableZoom&&K(P),i.enablePan&&Oe(P)}function B(P){i.enableZoom&&K(P),i.enableRotate&&Ce(P)}function ne(P){i.enabled!==!1&&(w.length===0&&(i.domElement.setPointerCapture(P.pointerId),i.domElement.addEventListener("pointermove",ge),i.domElement.addEventListener("pointerup",C)),!We(P)&&(fe(P),P.pointerType==="touch"?pe(P):E(P)))}function ge(P){i.enabled!==!1&&(P.pointerType==="touch"?xe(P):H(P))}function C(P){switch(_t(P),w.length){case 0:i.domElement.releasePointerCapture(P.pointerId),i.domElement.removeEventListener("pointermove",ge),i.domElement.removeEventListener("pointerup",C),i.dispatchEvent(hg),s=r.NONE;break;case 1:const ie=w[0],Te=N[ie];pe({pointerId:ie,pageX:Te.x,pageY:Te.y});break}}function E(P){let ie;switch(P.button){case 0:ie=i.mouseButtons.LEFT;break;case 1:ie=i.mouseButtons.MIDDLE;break;case 2:ie=i.mouseButtons.RIGHT;break;default:ie=-1}switch(ie){case Yr.DOLLY:if(i.enableZoom===!1)return;ue(P),s=r.DOLLY;break;case Yr.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enablePan===!1)return;Ne(P),s=r.PAN}else{if(i.enableRotate===!1)return;re(P),s=r.ROTATE}break;case Yr.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enableRotate===!1)return;re(P),s=r.ROTATE}else{if(i.enablePan===!1)return;Ne(P),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Iu)}function H(P){switch(s){case r.ROTATE:if(i.enableRotate===!1)return;G(P);break;case r.DOLLY:if(i.enableZoom===!1)return;se(P);break;case r.PAN:if(i.enablePan===!1)return;me(P);break}}function te(P){i.enabled===!1||i.enableZoom===!1||s!==r.NONE||(P.preventDefault(),i.dispatchEvent(Iu),Re(oe(P)),i.dispatchEvent(hg))}function oe(P){const ie=P.deltaMode,Te={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(ie){case 1:Te.deltaY*=16;break;case 2:Te.deltaY*=100;break}return P.ctrlKey&&!q&&(Te.deltaY*=10),Te}function ae(P){P.key==="Control"&&(q=!0,i.domElement.getRootNode().addEventListener("keyup",Fe,{passive:!0,capture:!0}))}function Fe(P){P.key==="Control"&&(q=!1,i.domElement.getRootNode().removeEventListener("keyup",Fe,{passive:!0,capture:!0}))}function Ie(P){i.enabled===!1||i.enablePan===!1||Ae(P)}function pe(P){switch(Le(P),w.length){case 1:switch(i.touches.ONE){case qr.ROTATE:if(i.enableRotate===!1)return;ye(P),s=r.TOUCH_ROTATE;break;case qr.PAN:if(i.enablePan===!1)return;Ye(P),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(i.touches.TWO){case qr.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;O(P),s=r.TOUCH_DOLLY_PAN;break;case qr.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;ot(P),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Iu)}function xe(P){switch(Le(P),s){case r.TOUCH_ROTATE:if(i.enableRotate===!1)return;Ce(P),i.update();break;case r.TOUCH_PAN:if(i.enablePan===!1)return;Oe(P),i.update();break;case r.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;he(P),i.update();break;case r.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;B(P),i.update();break;default:s=r.NONE}}function ze(P){i.enabled!==!1&&P.preventDefault()}function fe(P){w.push(P.pointerId)}function _t(P){delete N[P.pointerId];for(let ie=0;ie<w.length;ie++)if(w[ie]==P.pointerId){w.splice(ie,1);return}}function We(P){for(let ie=0;ie<w.length;ie++)if(w[ie]==P.pointerId)return!0;return!1}function Le(P){let ie=N[P.pointerId];ie===void 0&&(ie=new Me,N[P.pointerId]=ie),ie.set(P.pageX,P.pageY)}function we(P){const ie=P.pointerId===w[0]?w[1]:w[0];return N[ie]}i.domElement.addEventListener("contextmenu",ze),i.domElement.addEventListener("pointerdown",ne),i.domElement.addEventListener("pointercancel",C),i.domElement.addEventListener("wheel",te,{passive:!1}),i.domElement.getRootNode().addEventListener("keydown",ae,{passive:!0,capture:!0}),this.update()}}const mg=-12.4,EA=.4,xo=.61,Uu={VCC_TOP:-4.2,GND_TOP:-3.8,A:-2.8,B:-2.3,C:-1.8,D:-1.3,E:-.8,F:.8,G:1.3,H:1.8,I:2.3,J:2.8,VCC_BOT:4.2,GND_BOT:3.8},gg=-12.4,vg=12.4;function xg(t,e,n){return Math.max(e,Math.min(n,t))}function _g(t){if(!t||typeof t!="string")return{x:0,y:xo,z:0};const e=t.trim().toUpperCase(),n=e.match(/^(VCC_TOP|GND_TOP|VCC_BOT|GND_BOT)(?:_(\d+))?$/);if(n){const r=n[1],s=parseInt(n[2]||"1",10),o=mg+(s-1)*.48,a=Uu[r];return{x:xg(o,gg,vg),y:xo,z:a}}const i=e.match(/^([A-J])(\d+)$/);if(i){const r=i[1],s=parseInt(i[2],10);if(s<1)return{x:0,y:xo,z:Uu[r]};const o=mg+(s-1)*EA,a=Uu[r];return{x:xg(o,gg,vg),y:xo,z:a}}return console.warn(`[Breadboard3DCoords] Unknown hole ID: ${t}`),{x:0,y:xo,z:0}}function Dx({circuit:t}){const e=Q.useRef(null),n=Q.useRef(null),i=Q.useRef(null),[r,s]=Q.useState(null);Q.useEffect(()=>{const l=e.current;if(!l)return;const c=l.clientWidth||900,h=520,d=new JC;d.background=new Ke(263953);const p=new xn(45,c/h,.1,1e3);p.position.set(0,25,25),p.lookAt(0,0,0),i.current=p;const g=new Px({antialias:!0,alpha:!0});for(g.setSize(c,h),g.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),g.shadowMap.enabled=!0,g.shadowMap.type=ex;l.firstChild;)l.removeChild(l.firstChild);l.appendChild(g.domElement);const x=new MA(p,g.domElement);x.enableDamping=!0,x.dampingFactor=.06,x.minDistance=8,x.maxDistance=55,x.maxPolarAngle=Math.PI/2-.03,x.target.set(0,0,0),n.current=x,d.add(new _A(16777215,.9));const y=new lg(16777215,1.4);y.position.set(8,25,12),y.castShadow=!0,d.add(y);const m=new lg(8956671,.6);m.position.set(-15,12,-10),d.add(m);const u=new Jn,_=new Bn(26,1.2,10),v=new Yn({color:15857145,roughness:.42,metalness:.05}),S=new Je(_,v);S.position.y=0,S.receiveShadow=!0,u.add(S);const b=new Bn(25.6,.16,1.1),A=new Yn({color:3359061,roughness:.8}),w=new Je(b,A);w.position.set(0,.62,0),u.add(w);const N=new Oi({color:15680580}),q=new Oi({color:2450411}),M=new Bn(25,.05,.12),R=new Je(M,N);R.position.set(0,.63,-4.2);const k=new Je(M,q);k.position.set(0,.63,-3.8);const J=new Je(M,N);J.position.set(0,.63,4.2);const L=new Je(M,q);L.position.set(0,.63,3.8),u.add(R,k,J,L);const $=new gn(.075,.075,.08,12),j=new Yn({color:1120295,roughness:.9});for(let K=1;K<=63;K++){const he=-12.4+(K-1)*.4;for(let B=0;B<10;B++){const ne=String.fromCharCode(65+B),ge={A:-2.8,B:-2.3,C:-1.8,D:-1.3,E:-.8,F:.8,G:1.3,H:1.8,I:2.3,J:2.8},C=new Je($,j);C.position.set(he,.63,ge[ne]),u.add(C)}}for(let K=1;K<=50;K++){const he=-12.4+(K-1)*.48;[-4.2,-3.8,3.8,4.2].forEach(ne=>{const ge=new Je($,j);ge.position.set(he,.63,ne),u.add(ge)})}d.add(u);const ee=[],U=new Yn({color:12108492,metalness:.85,roughness:.25});function z(K,he,B){const ne=new Jn,ge=new Je(new gn(.42,.42,1.8,24),new Yn({color:14065773,roughness:.45}));ge.rotation.z=Math.PI/2,ge.castShadow=!0,ne.add(ge);const C=[7877903,0,14427686,15381256];[-.6,-.2,.2,.6].forEach((oe,ae)=>{const Fe=new Je(new gn(.44,.44,.14,24),new Oi({color:C[ae]}));Fe.rotation.z=Math.PI/2,Fe.position.x=oe,ne.add(Fe)});const E=1,H=new Je(new gn(.055,.055,E,10),U),te=H.clone();H.position.x=-1.35,te.position.x=1.35,ne.add(H,te),se(ne,he,B),ge.userData={name:K.designator||K.id||"Resistor",type:"resistor",value:K.user_override_value||K.detected_value||K.value||"Unknown"},ee.push(ge),d.add(ne)}function W(K,he,B){const ne=new Jn,ge=me(K),C=new Je(new gn(.45,.38,.65,24),new mA({color:ge,transparent:!0,opacity:.88,roughness:.12,transmission:.25}));C.position.y=.4,ne.add(C);const E=new Je(new sh(.45,24,16,0,Math.PI*2,0,Math.PI/2),C.material);E.position.y=.72,ne.add(E);const H=new vA(ge,2.2,4);H.position.y=.6,ne.add(H);const te=new Je(new gn(.05,.05,1.2,10),U),oe=te.clone();te.position.x=-.16,oe.position.x=.16,te.position.y=-.45,oe.position.y=-.45,ne.add(te,oe),se(ne,he,B),C.userData={name:K.designator||K.id||"LED",type:"led",value:K.value||K.detected_value||"LED"},ee.push(C),d.add(ne)}function re(K,he,B){const ne=new Jn,ge=new Je(new gn(.48,.48,1.15,24),new Yn({color:1981066,roughness:.35}));ge.position.y=.7,ne.add(ge);const C=new Je(new Bn(.08,1,.98),new Oi({color:15067115}));C.position.set(-.28,.7,0),ne.add(C);const E=new Je(new gn(.055,.055,1.1,10),U),H=E.clone();E.position.x=-.18,H.position.x=.18,E.position.y=-.35,H.position.y=-.35,ne.add(E,H),se(ne,he,B),ge.userData={name:K.designator||K.id||"Capacitor",type:"capacitor",value:K.user_override_value||K.detected_value||K.value||"Unknown"},ee.push(ge),d.add(ne)}function ue(K,he,B){const ne=new Jn,ge=new Je(new gn(.22,.22,1.45,20),new Yn({color:1120295,roughness:.3}));ge.rotation.z=Math.PI/2,ne.add(ge);const C=new Je(new gn(.24,.24,.16,20),new Oi({color:16317180}));C.rotation.z=Math.PI/2,C.position.x=.45,ne.add(C);const E=new Je(new gn(.045,.045,.9,8),U),H=E.clone();E.position.x=-1.05,H.position.x=1.05,ne.add(E,H),se(ne,he,B),ge.userData={name:K.designator||K.id||"Diode",type:"diode_rectifier",value:K.value||"Diode"},ee.push(ge),d.add(ne)}function Ne(K,he,B){const ne=new Jn,ge=new Je(new Bn(1.7,.45,1.1),new Yn({color:1120295,roughness:.3}));ge.position.y=.75,ne.add(ge);const C=new Je(new oh(.16,.05,8,16,Math.PI),new Oi({color:6583435}));C.rotation.x=Math.PI/2,C.position.set(0,.99,-.55),ne.add(C);for(let E=0;E<4;E++){const H=new Je(new Bn(.08,.5,.08),U),te=H.clone();H.position.set(-.55+E*.36,.25,-.72),te.position.set(-.55+E*.36,.25,.72),ne.add(H,te)}se(ne,he,B),ge.userData={name:K.designator||K.id||"IC",type:"ic_chip",value:K.value||"IC"},ee.push(ge),d.add(ne)}function G(K,he,B){const ne=new I(he.x,.72,he.z),ge=new I(B.x,.72,B.z),C=new I((ne.x+ge.x)/2,2,(ne.z+ge.z)/2),E=new rh(ne,C,ge),H=new ah(E,24,.09,8,!1),te=new Yn({color:Re(K),roughness:.35}),oe=new Je(H,te);oe.castShadow=!0,oe.userData={name:K.designator||K.id||"Wire",type:"wire",value:"wire"},ee.push(oe),d.add(oe)}function se(K,he,B){const ne=new I((he.x+B.x)/2,1.2,(he.z+B.z)/2);K.position.copy(ne);const ge=B.x-he.x,C=B.z-he.z;K.rotation.y=Math.atan2(C,ge)}function me(K){const he=JSON.stringify(K).toLowerCase();return he.includes("green")?2278750:he.includes("blue")?3900150:he.includes("yellow")?16436245:15680580}function Re(K){const he=JSON.stringify(K).toLowerCase();return he.includes("black")?1120295:he.includes("blue")?2450411:he.includes("green")?1483594:he.includes("yellow")?16436245:15680580}function Ae(K){var ne,ge;const he=K.hole1||K.node1_hole||K.lead1_hole||K.start_hole||K.from_hole||((ne=K.node1)==null?void 0:ne.hole),B=K.hole2||K.node2_hole||K.lead2_hole||K.end_hole||K.to_hole||((ge=K.node2)==null?void 0:ge.hole);return{hole1:he,hole2:B}}const ye=Array.isArray(t==null?void 0:t.components)?t.components:[];console.log("[3D] Circuit:",t),console.log("[3D] Components:",ye),ye.forEach((K,he)=>{const{hole1:B,hole2:ne}=Ae(K);if(!B||!ne){console.warn(`[3D] Component ${he} has no hole mapping`,K);return}const ge=_g(B),C=_g(ne),E=String(K.type||K.class||K.name||"").toLowerCase();console.log(`[3D] Rendering ${E}`,B,ne,ge,C),E.includes("resistor")?z(K,ge,C):E.includes("led")?W(K,ge,C):E.includes("capacitor")?re(K,ge,C):E.includes("diode")?ue(K,ge,C):E.includes("ic")?Ne(K,ge,C):E.includes("wire")||E.includes("jumper")?G(K,ge,C):console.warn("[3D] Unknown component type:",K.type)});const Ye=new yA,De=new Me,O=K=>{const he=g.domElement.getBoundingClientRect();De.x=(K.clientX-he.left)/he.width*2-1,De.y=-((K.clientY-he.top)/he.height)*2+1,Ye.setFromCamera(De,p);const B=Ye.intersectObjects(ee,!0);B.length>0&&s(B[0].object.userData)};g.domElement.addEventListener("pointerdown",O);let ot;const Ce=()=>{ot=requestAnimationFrame(Ce),x.update(),g.render(d,p)};Ce();const Oe=()=>{const K=l.clientWidth||900;p.aspect=K/h,p.updateProjectionMatrix(),g.setSize(K,h)};return window.addEventListener("resize",Oe),()=>{cancelAnimationFrame(ot),window.removeEventListener("resize",Oe),g.domElement.removeEventListener("pointerdown",O),x.dispose(),d.traverse(K=>{K.geometry&&K.geometry.dispose(),K.material&&(Array.isArray(K.material)?K.material.forEach(he=>he.dispose()):K.material.dispose())}),g.dispose()}},[t]);const o=l=>{if(!i.current||!n.current)return;const c=i.current,h=n.current;l==="top"?c.position.set(0,28,.01):l==="iso"?c.position.set(0,25,25):l==="side"&&c.position.set(26,8,0),h.target.set(0,0,0),h.update()},a=Array.isArray(t==null?void 0:t.components)?t.components.length:0;return f.jsxs("div",{style:{position:"relative",background:"#040711",borderRadius:"12px",border:"1px solid var(--border-color)",overflow:"hidden"},children:[f.jsxs("div",{style:{position:"absolute",top:"12px",left:"12px",right:"12px",zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center",pointerEvents:"none"},children:[f.jsxs("div",{style:{display:"flex",gap:"8px",pointerEvents:"auto"},children:[f.jsxs("span",{className:"mock-badge",children:["source:"," ",(t==null?void 0:t.source)||"mock"]}),f.jsxs("span",{className:"code-pill",children:["3D Components:"," ",a]})]}),f.jsxs("div",{style:{display:"flex",gap:"6px",pointerEvents:"auto"},children:[f.jsx("button",{onClick:()=>o("top"),className:"btn btn-secondary",children:"Top 2D"}),f.jsx("button",{onClick:()=>o("iso"),className:"btn btn-secondary",children:"Isometric 3D"}),f.jsx("button",{onClick:()=>o("side"),className:"btn btn-secondary",children:"Side View"})]})]}),f.jsx("div",{ref:e,style:{width:"100%",height:"520px",cursor:"grab"}}),f.jsxs("div",{style:{padding:"0.75rem 1rem",background:"rgba(8,12,20,0.95)",borderTop:"1px solid var(--border-color)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[f.jsx("div",{children:r?f.jsxs("span",{style:{fontSize:"0.85rem",fontWeight:"700",color:"var(--accent-cyan)"},children:[r.name," — ",r.type," — ",r.value]}):f.jsx("span",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Click a component to inspect it."})}),f.jsx("span",{className:"code-pill",children:"Drag: Rotate | Scroll: Zoom"})]})]})}const Ou="http://127.0.0.1:8000".replace(/\/$/,""),yg={resistor:{bg:"rgba(249, 115, 22, 0.15)",border:"#f97316",text:"#f97316"},diode_rectifier:{bg:"rgba(217, 70, 239, 0.15)",border:"#d946ef",text:"#d946ef"},ic_chip:{bg:"rgba(234, 179, 8, 0.15)",border:"#eab308",text:"#eab308"},wire:{bg:"rgba(56, 189, 248, 0.15)",border:"#38bdf8",text:"#38bdf8"},capacitor:{bg:"rgba(59, 130, 246, 0.15)",border:"#3b82f6",text:"#3b82f6"},led:{bg:"rgba(34, 197, 94, 0.15)",border:"#22c55e",text:"#22c55e"}};function wA(){var M,R;const{activeCircuit:t,uploadedImage:e,setUploadedImage:n,isAnalyzingReal:i,setIsAnalyzingReal:r,realAnalysisError:s,setRealAnalysisError:o,setRealCircuitData:a}=Yf(),[l,c]=Q.useState(an[0]),[h,d]=Q.useState(null),[p,g]=Q.useState([]),[x,y]=Q.useState([]),[m,u]=Q.useState([]),[_,v]=Q.useState({resistor:0,diode_rectifier:0,ic_chip:0,wire:0,capacitor:0,led:0}),S=k=>{c(k),n(null),d(null),g([]),y([]),u([]),v({resistor:0,diode_rectifier:0,ic_chip:0,wire:0,capacitor:0,led:0})},b=k=>{var L;const J=(L=k.target.files)==null?void 0:L[0];if(J){const $=new FileReader;$.onload=j=>{var U;const ee=(U=j.target)==null?void 0:U.result;n(ee),d(null),g([]),y([]),u([]),v({resistor:0,diode_rectifier:0,ic_chip:0,wire:0,capacitor:0,led:0})},$.readAsDataURL(J)}},A=async()=>{let k=e;if(!k&&(l!=null&&l.thumbnail))try{const L=await(await fetch(l.thumbnail)).blob();k=await new Promise(($,j)=>{const ee=new FileReader;ee.onloadend=()=>$(ee.result),ee.onerror=j,ee.readAsDataURL(L)}),n(k)}catch(J){console.warn("Could not load sample image as base64:",J)}if(!k){alert("Please upload or select a breadboard image first.");return}r(!0),o(null);try{console.log("Calling YOLO Detection & Grid Mapping API:",`${Ou}/api/detect`);const J=await fetch(`${Ou}/api/detect`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image_base64:k})});if(!J.ok){const $=await J.text();throw new Error(`Detection API error (HTTP ${J.status}): ${$}`)}const L=await J.json();if(console.log("================ BACKEND & FRONTEND DETECTIONS ================"),console.log("BACKEND DETECTIONS:",L.detections),console.log("FRONTEND DETECTIONS:",L.detections),console.log("DETECTION COUNTS BY CLASS:",L.counts),L.detections&&L.detections.forEach(($,j)=>{var ee;console.log(`[#${j+1}] class: ${$.class_name||$.class}, conf: ${$.confidence}, bbox: [${(ee=$.bbox_pixels)==null?void 0:ee.join(", ")}]`)}),console.log("==============================================================="),!L.success&&L.error)throw new Error(`YOLO Detection Failed: ${L.error}`);d(L.annotated_image),g(L.detections||[]),y(L.mapped_components||[]),u(L.nets_summary||[]),v(L.counts||{resistor:0,diode_rectifier:0,ic_chip:0,wire:0,capacitor:0,led:0}),a({originalImage:k,detections:L.detections||[],mapped_components:L.mapped_components||[],netlist:L.netlist||{},imageMeta:L.image_meta,source:"real"}),r(!1)}catch(J){console.error("YOLO Detection Error:",J);let L=J.message||"Failed to execute YOLO detection.";(L.includes("Failed to fetch")||L.includes("NetworkError"))&&(L=`Backend server unavailable at ${Ou}. Please ensure FastAPI backend is running.`),o(L),r(!1)}},w=e||l.thumbnail,N=p.length,q=(t==null?void 0:t.source)==="real";return f.jsxs("div",{style:{paddingBottom:"2.5rem"},children:[f.jsx("div",{className:"page-header",children:f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{children:[f.jsxs("h1",{className:"page-title",children:[f.jsx(Vl,{size:28,style:{color:"var(--accent-cyan)"}}),"Real Breadboard Image → 3D Reconstruction"]}),f.jsx("p",{className:"page-subtitle",children:"End-to-end physical circuit reconstruction: Real Photo → YOLOv8 Detections → Grid Lead Mapping → Netlist → Three.js 3D Breadboard."})]}),f.jsx("div",{children:h?f.jsxs("span",{className:"code-pill",style:{background:"rgba(34, 197, 94, 0.15)",color:"var(--accent-emerald)",borderColor:"var(--accent-emerald)"},children:[f.jsx(Ns,{size:14})," Detections: ",N," Found"]}):f.jsxs("span",{className:"mock-badge",children:[f.jsx($f,{size:14})," Ready for Detection"]})})]})}),f.jsxs("div",{className:"card",style:{marginBottom:"1.25rem",padding:"1rem 1.25rem"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap"},children:[f.jsx("span",{style:{fontSize:"0.85rem",fontWeight:"600",color:"var(--text-muted)"},children:"Samples:"}),f.jsx("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap"},children:an.map(k=>f.jsx("button",{onClick:()=>S(k),className:"btn btn-secondary",style:{padding:"0.35rem 0.65rem",fontSize:"0.8rem",borderColor:l.id===k.id&&!e?"var(--accent-cyan)":"var(--border-color)",background:l.id===k.id&&!e?"rgba(56, 189, 248, 0.15)":"rgba(255,255,255,0.03)"},children:k.name},k.id))})]}),f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[f.jsxs("label",{className:"btn btn-secondary",style:{cursor:"pointer",padding:"0.45rem 0.9rem",fontSize:"0.85rem"},children:[f.jsx(LS,{size:15})," Upload Photo",f.jsx("input",{type:"file",accept:"image/*",onChange:b,style:{display:"none"}})]}),f.jsxs("button",{onClick:A,disabled:i,className:"btn btn-primary",style:{padding:"0.5rem 1.25rem",fontSize:"0.9rem"},children:[f.jsx(Ns,{size:15})," ",i?"Analyzing Circuit...":"Analyze Real Image"]})]})]}),s&&f.jsxs("div",{style:{marginTop:"0.75rem",padding:"0.65rem",borderRadius:"6px",background:"rgba(239, 68, 68, 0.15)",border:"1px solid var(--accent-red)",color:"var(--accent-red)",fontSize:"0.85rem"},children:["⚠ ",s]})]}),f.jsxs("div",{className:"card",style:{marginBottom:"1.25rem",padding:"1rem 1.25rem",background:"rgba(15, 23, 42, 0.95)",border:"1px solid var(--accent-cyan)"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem",flexWrap:"wrap",gap:"0.5rem"},children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(Ns,{size:18,style:{color:"var(--accent-cyan)"}}),f.jsx("h3",{style:{fontSize:"0.95rem",fontWeight:"700",color:"#fff",margin:0},children:"Step 7 — Visual Debug Pipeline Monitor"})]}),f.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[f.jsxs("span",{className:"code-pill",style:{borderColor:"var(--accent-cyan)",color:"var(--accent-cyan)"},children:["YOLO detections: ",p.length]}),f.jsxs("span",{className:"code-pill",style:{borderColor:"var(--accent-cyan)",color:"var(--accent-cyan)"},children:["Mapped components: ",x.length]}),f.jsxs("span",{className:"code-pill",style:{borderColor:"var(--accent-cyan)",color:"var(--accent-cyan)"},children:["Netlist components: ",((M=t==null?void 0:t.components)==null?void 0:M.length)||0]}),f.jsxs("span",{className:"code-pill",style:{borderColor:"var(--accent-emerald)",color:"var(--accent-emerald)"},children:["3D components: ",((R=t==null?void 0:t.components)==null?void 0:R.length)||0]})]})]}),x.length>0?f.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.5rem",marginTop:"0.5rem"},children:x.map((k,J)=>{const L=yg[k.type]||{border:"#fff",text:"#fff"};return f.jsxs("div",{style:{padding:"0.35rem 0.65rem",borderRadius:"6px",background:"rgba(255, 255, 255, 0.04)",border:`1px solid ${L.border}`,fontSize:"0.8rem",fontFamily:"var(--font-mono)",color:"#e2e8f0"},children:[f.jsx("strong",{style:{color:L.text},children:k.designator||`C${J+1}`})," - ",k.type," - ",(k.confidence*100).toFixed(0),"%",f.jsxs("span",{style:{color:"var(--text-muted)",marginLeft:"0.35rem"},children:["(",k.start_hole||k.hole1," → ",k.end_hole||k.hole2,")"]})]},k.id||J)})}):f.jsx("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Awaiting scan to monitor component flow through YOLO → Backend → Netlist → CircuitContext → 3D Mesh."})]}),f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"1fr 1fr",marginBottom:"1.5rem"},children:[f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.6rem"},children:[f.jsxs("h2",{style:{fontSize:"1rem",display:"flex",alignItems:"center",gap:"0.5rem",color:"var(--accent-cyan)"},children:[f.jsx(yS,{size:16}),"(A) REAL IMAGE & YOLO DETECTIONS"]}),f.jsx("span",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:e?"Custom Photo":l.name})]}),f.jsx("div",{style:{position:"relative",borderRadius:"8px",overflow:"hidden",background:"#040711",border:"1px solid var(--border-color)",height:"420px",display:"flex",alignItems:"center",justifyContent:"center",padding:"0.5rem"},children:h?f.jsx("img",{src:h,alt:"YOLO Detected Bounding Box Output",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",display:"block"}}):i?f.jsxs("div",{style:{textAlign:"center",color:"var(--accent-cyan)"},children:[f.jsx("div",{style:{fontWeight:"700",fontSize:"1rem",marginBottom:"0.5rem"},children:"Running YOLO Neural Detection..."}),f.jsx("div",{style:{fontSize:"0.85rem",color:"var(--text-muted)"},children:"Classifying Resistors, Wires, LEDs, Diodes, ICs, Capacitors"})]}):f.jsx("img",{src:w,alt:"Original Breadboard Input",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",display:"block"}})})]}),f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.6rem"},children:[f.jsxs("h2",{style:{fontSize:"1rem",display:"flex",alignItems:"center",gap:"0.5rem",color:"var(--accent-emerald)"},children:[f.jsx(Hs,{size:16}),"(B) 3D RECONSTRUCTED BREADBOARD"]}),f.jsx("span",{className:"code-pill",style:{fontSize:"0.75rem",color:q?"var(--accent-emerald)":"var(--accent-cyan)",borderColor:q?"var(--accent-emerald)":"var(--accent-cyan)"},children:q?"Real 3D Mesh":"Mock 3D Mesh"})]}),f.jsx("div",{style:{height:"420px",borderRadius:"8px",overflow:"hidden"},children:f.jsx(Dx,{circuit:t})})]})]}),f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"3fr 2fr",marginBottom:"1.5rem"},children:[f.jsxs("div",{className:"card",children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"},children:[f.jsxs("h3",{style:{fontSize:"0.95rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(Br,{size:16,style:{color:"var(--accent-cyan)"}}),"Component Position & Hole Mapping"]}),f.jsx("span",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:x.length>0?`${x.length} Components Resolved`:"Awaiting Detection"})]}),x.length===0?f.jsx("div",{style:{padding:"2rem",textAlign:"center",color:"var(--text-muted)",fontSize:"0.85rem"},children:'Click "Analyze Real Image" to run YOLO detection and map leads to physical breadboard tie-points.'}):f.jsx("div",{style:{overflowX:"auto",maxHeight:"280px"},children:f.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.85rem",textAlign:"left"},children:[f.jsx("thead",{children:f.jsxs("tr",{style:{borderBottom:"1px solid var(--border-color)",color:"var(--text-muted)"},children:[f.jsx("th",{style:{padding:"0.5rem"},children:"Designator"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Type"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Start Hole"}),f.jsx("th",{style:{padding:"0.5rem"},children:"End Hole"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Conf"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Status"})]})}),f.jsx("tbody",{children:x.map((k,J)=>{const L=yg[k.type]||{text:"#fff"};return f.jsxs("tr",{style:{borderBottom:"1px solid rgba(255,255,255,0.05)"},children:[f.jsx("td",{style:{padding:"0.5rem",fontWeight:"700",fontFamily:"var(--font-mono)"},children:k.designator}),f.jsx("td",{style:{padding:"0.5rem",color:L.text,textTransform:"capitalize"},children:k.type}),f.jsx("td",{style:{padding:"0.5rem",fontFamily:"var(--font-mono)",color:"var(--accent-cyan)"},children:k.start_hole||k.hole1}),f.jsx("td",{style:{padding:"0.5rem",fontFamily:"var(--font-mono)",color:"var(--accent-cyan)"},children:k.end_hole||k.hole2}),f.jsxs("td",{style:{padding:"0.5rem",fontFamily:"var(--font-mono)",color:k.confidence>=.7?"var(--accent-emerald)":"var(--accent-amber)"},children:[(k.confidence*100).toFixed(0),"%"]}),f.jsx("td",{style:{padding:"0.5rem"},children:k.uncertain_mapping?f.jsxs("span",{style:{fontSize:"0.75rem",color:"var(--accent-amber)",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[f.jsx(vS,{size:12})," Mapping Uncertain"]}):f.jsxs("span",{style:{fontSize:"0.75rem",color:"var(--accent-emerald)",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[f.jsx(Gf,{size:12})," Verified"]})})]},k.id||J)})})]})})]}),f.jsxs("div",{className:"card",children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"},children:[f.jsxs("h3",{style:{fontSize:"0.95rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(MS,{size:16,style:{color:"var(--accent-emerald)"}}),"Generated Electrical Netlist"]}),f.jsxs("span",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:[m.length," Electrical Nets"]})]}),m.length===0?f.jsx("div",{style:{padding:"2rem",textAlign:"center",color:"var(--text-muted)",fontSize:"0.85rem"},children:"No netlist generated yet. Run detection to synthesize electrical node connectivity."}):f.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",maxHeight:"280px",overflowY:"auto"},children:m.map((k,J)=>{const L=k.split(":"),$=L[0],j=L.slice(1).join(":");return f.jsxs("div",{style:{padding:"0.55rem 0.75rem",background:"rgba(255,255,255,0.03)",border:"1px solid var(--border-color)",borderRadius:"6px",fontSize:"0.82rem"},children:[f.jsx("div",{style:{fontWeight:"700",color:"var(--accent-cyan)",fontFamily:"var(--font-mono)",marginBottom:"0.2rem"},children:$}),f.jsxs("div",{style:{color:"var(--text-muted)",fontFamily:"var(--font-mono)",fontSize:"0.75rem"},children:["Connected Pins: ",f.jsx("span",{style:{color:"#fff"},children:j||"None"})]})]},J)})})]})]})]})}function TA({circuit:t,onSelectComponent:e}){var l,c,h,d;const[n,i]=Q.useState(null),[r,s]=Q.useState(1);if(!t||!t.components)return f.jsx("div",{style:{padding:"2rem",textAlign:"center",color:"var(--text-muted)"},children:"No circuit dataset available for schematic rendering."});const o=p=>{i(p.id),e&&e(p)},a=()=>{const p=document.getElementById(`schematic-svg-${t.id}`);if(!p)return;const g=new XMLSerializer().serializeToString(p),x=new Blob([g],{type:"image/svg+xml;charset=utf-8"}),y=URL.createObjectURL(x),m=document.createElement("a");m.href=y,m.download=`${t.id}_schematic_2d.svg`,document.body.appendChild(m),m.click(),document.body.removeChild(m)};return f.jsxs("div",{style:{background:"#040711",borderRadius:"12px",border:"1px solid var(--border-color)",padding:"1rem"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"},children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsxs("span",{className:"mock-badge",children:["source: ",t.source||"mock"]}),f.jsx("span",{style:{fontSize:"0.85rem",fontWeight:"600",color:"var(--accent-cyan)"},children:"IEEE 2D Schematic Canvas"})]}),f.jsxs("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center"},children:[f.jsx("button",{onClick:()=>s(Math.min(1.5,r+.1)),className:"btn btn-secondary",style:{padding:"0.25rem 0.5rem",fontSize:"0.8rem"},title:"Zoom In",children:f.jsx(NS,{size:14})}),f.jsx("button",{onClick:()=>s(Math.max(.7,r-.1)),className:"btn btn-secondary",style:{padding:"0.25rem 0.5rem",fontSize:"0.8rem"},title:"Zoom Out",children:f.jsx(DS,{size:14})}),f.jsx("button",{onClick:()=>s(1),className:"btn btn-secondary",style:{padding:"0.25rem 0.5rem",fontSize:"0.8rem"},title:"Reset Zoom",children:f.jsx(AS,{size:14})}),f.jsxs("button",{onClick:a,className:"btn btn-primary",style:{padding:"0.35rem 0.75rem",fontSize:"0.8rem"},children:[f.jsx(Kv,{size:14})," Export SVG"]})]})]}),f.jsx("div",{style:{overflowX:"auto",textAlign:"center",background:"#02040a",borderRadius:"8px",padding:"1rem",border:"1px solid rgba(56, 189, 248, 0.1)"},children:f.jsxs("svg",{id:`schematic-svg-${t.id}`,viewBox:"0 0 700 360",style:{maxWidth:"100%",height:"auto",transform:`scale(${r})`,transformOrigin:"center center",transition:"transform 0.2s ease"},children:[f.jsx("defs",{children:f.jsx("pattern",{id:"grid",width:"20",height:"20",patternUnits:"userSpaceOnUse",children:f.jsx("path",{d:"M 20 0 L 0 0 0 20",fill:"none",stroke:"rgba(56, 189, 248, 0.05)",strokeWidth:"1"})})}),f.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"}),f.jsxs("g",{transform:"translate(80, 160)",style:{cursor:"pointer"},children:[f.jsx("line",{x1:"0",y1:"-70",x2:"0",y2:"70",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("line",{x1:"-15",y1:"-15",x2:"15",y2:"-15",stroke:"#38bdf8",strokeWidth:"3"}),f.jsx("line",{x1:"-8",y1:"-5",x2:"8",y2:"-5",stroke:"#94a3b8",strokeWidth:"3"}),f.jsx("line",{x1:"-15",y1:"5",x2:"15",y2:"5",stroke:"#38bdf8",strokeWidth:"3"}),f.jsx("line",{x1:"-8",y1:"15",x2:"8",y2:"15",stroke:"#94a3b8",strokeWidth:"3"}),f.jsx("text",{x:"-30",y:"-25",fill:"#38bdf8",fontSize:"14",fontWeight:"bold",children:"+"}),f.jsx("text",{x:"-30",y:"30",fill:"#94a3b8",fontSize:"14",fontWeight:"bold",children:"-"}),f.jsx("text",{x:"-50",y:"5",fill:"#f8fafc",fontSize:"12",fontWeight:"bold",children:"V1"}),f.jsxs("text",{x:"-65",y:"20",fill:"#94a3b8",fontSize:"11",children:[((l=t.power_supply)==null?void 0:l.voltage)||9,"V"]})]}),f.jsx("path",{d:"M 80 90 L 320 90",fill:"none",stroke:"#38bdf8",strokeWidth:"2.5"}),t.components[0]&&f.jsxs("g",{transform:"translate(320, 90)",onClick:()=>o(t.components[0]),style:{cursor:"pointer"},children:[f.jsx("polyline",{points:"0,0 15,0 20,-12 30,12 40,-12 50,12 60,-12 70,12 75,0 90,0",fill:"none",stroke:n===t.components[0].id?"#fbbf24":"#38bdf8",strokeWidth:n===t.components[0].id?"3.5":"2.5"}),f.jsx("text",{x:"45",y:"-20",fill:"#f8fafc",fontSize:"13",fontWeight:"bold",textAnchor:"middle",children:t.components[0].designator}),f.jsx("text",{x:"45",y:"30",fill:"#38bdf8",fontSize:"11",fontFamily:"JetBrains Mono",textAnchor:"middle",children:t.components[0].user_override_value||t.components[0].detected_value})]}),f.jsx("path",{d:"M 410 90 L 520 90 L 520 140",fill:"none",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("circle",{cx:"520",cy:"90",r:"4",fill:"#38bdf8"}),t.components[1]&&f.jsx("g",{transform:"translate(520, 180)",onClick:()=>o(t.components[1]),style:{cursor:"pointer"},children:t.components[1].type.includes("LED")?f.jsxs("g",{children:[f.jsx("line",{x1:"0",y1:"-40",x2:"0",y2:"-15",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("polygon",{points:"-15,-15 15,-15 0,15",fill:"#f87171",stroke:"#ef4444",strokeWidth:"2"}),f.jsx("line",{x1:"-15",y1:"15",x2:"15",y2:"15",stroke:"#ef4444",strokeWidth:"3"}),f.jsx("line",{x1:"0",y1:"15",x2:"0",y2:"40",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("line",{x1:"18",y1:"-10",x2:"28",y2:"-20",stroke:"#fbbf24",strokeWidth:"2"}),f.jsx("polygon",{points:"28,-20 23,-17 26,-13",fill:"#fbbf24"}),f.jsx("line",{x1:"22",y1:"-2",x2:"32",y2:"-12",stroke:"#fbbf24",strokeWidth:"2"}),f.jsx("polygon",{points:"32,-12 27,-9 30,-5",fill:"#fbbf24"}),f.jsx("text",{x:"35",y:"0",fill:"#f8fafc",fontSize:"13",fontWeight:"bold",children:t.components[1].designator}),f.jsx("text",{x:"35",y:"15",fill:"#f87171",fontSize:"11",children:t.components[1].user_override_value||t.components[1].detected_value})]}):t.components[1].type.includes("Capacitor")?f.jsxs("g",{children:[f.jsx("line",{x1:"0",y1:"-40",x2:"0",y2:"-10",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("line",{x1:"-20",y1:"-10",x2:"20",y2:"-10",stroke:"#818cf8",strokeWidth:"3.5"}),f.jsx("line",{x1:"-20",y1:"10",x2:"20",y2:"10",stroke:"#818cf8",strokeWidth:"3.5"}),f.jsx("line",{x1:"0",y1:"10",x2:"0",y2:"40",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("text",{x:"30",y:"0",fill:"#f8fafc",fontSize:"13",fontWeight:"bold",children:t.components[1].designator}),f.jsx("text",{x:"30",y:"15",fill:"#818cf8",fontSize:"11",children:t.components[1].user_override_value||t.components[1].detected_value})]}):f.jsxs("g",{children:[f.jsx("line",{x1:"0",y1:"-40",x2:"0",y2:"-30",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("polyline",{points:"0,-30 -12,-22 12,-14 -12,-6 12,2 -12,10 12,18 0,26",fill:"none",stroke:n===t.components[1].id?"#fbbf24":"#38bdf8",strokeWidth:"2.5"}),f.jsx("line",{x1:"0",y1:"26",x2:"0",y2:"40",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("text",{x:"25",y:"0",fill:"#f8fafc",fontSize:"13",fontWeight:"bold",children:t.components[1].designator}),f.jsx("text",{x:"25",y:"15",fill:"#38bdf8",fontSize:"11",children:t.components[1].user_override_value||t.components[1].detected_value})]})}),f.jsx("path",{d:"M 520 220 L 520 260 L 80 260 L 80 230",fill:"none",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("circle",{cx:"520",cy:"260",r:"4",fill:"#38bdf8"}),f.jsx("circle",{cx:"80",cy:"260",r:"4",fill:"#38bdf8"}),f.jsxs("g",{transform:"translate(300, 260)",style:{cursor:"pointer"},children:[f.jsx("line",{x1:"0",y1:"0",x2:"0",y2:"15",stroke:"#38bdf8",strokeWidth:"2.5"}),f.jsx("line",{x1:"-20",y1:"15",x2:"20",y2:"15",stroke:"#34d399",strokeWidth:"3"}),f.jsx("line",{x1:"-12",y1:"22",x2:"12",y2:"22",stroke:"#34d399",strokeWidth:"2.5"}),f.jsx("line",{x1:"-5",y1:"29",x2:"5",y2:"29",stroke:"#34d399",strokeWidth:"2"}),f.jsx("text",{x:"28",y:"20",fill:"#34d399",fontSize:"11",fontWeight:"bold",children:"GND (0V)"})]})]})}),n&&f.jsxs("div",{style:{marginTop:"1rem",padding:"0.75rem",background:"rgba(56, 189, 248, 0.05)",borderRadius:"8px",border:"1px solid var(--border-color)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[f.jsxs("div",{children:[f.jsxs("span",{style:{fontSize:"0.85rem",fontWeight:"700",color:"var(--accent-cyan)"},children:["Selected: ",(c=t.components.find(p=>p.id===n))==null?void 0:c.designator]}),f.jsxs("span",{style:{marginLeft:"0.75rem",fontSize:"0.8rem",color:"var(--text-muted)"},children:["Value: ",((h=t.components.find(p=>p.id===n))==null?void 0:h.user_override_value)||((d=t.components.find(p=>p.id===n))==null?void 0:d.detected_value)]})]}),f.jsx("span",{className:"code-pill",children:"IEEE Symbol Valid"})]})]})}const Cn={0:{name:"Black",hex:"#000000",text:"#ffffff",val:0,mult:1},1:{name:"Brown",hex:"#78350f",text:"#ffffff",val:1,mult:10,tol:1},2:{name:"Red",hex:"#dc2626",text:"#ffffff",val:2,mult:100,tol:2},3:{name:"Orange",hex:"#ea580c",text:"#ffffff",val:3,mult:1e3},4:{name:"Yellow",hex:"#ca8a04",text:"#000000",val:4,mult:1e4},5:{name:"Green",hex:"#16a34a",text:"#ffffff",val:5,mult:1e5,tol:.5},6:{name:"Blue",hex:"#2563eb",text:"#ffffff",val:6,mult:1e6,tol:.25},7:{name:"Violet",hex:"#9333ea",text:"#ffffff",val:7,mult:1e7,tol:.1},8:{name:"Grey",hex:"#4b5563",text:"#ffffff",val:8,mult:1e8,tol:.05},9:{name:"White",hex:"#f8fafc",text:"#000000",val:9,mult:1e9},"-1":{name:"Gold",hex:"#eab308",text:"#000000",mult:.1,tol:5},"-2":{name:"Silver",hex:"#94a3b8",text:"#000000",mult:.01,tol:10}},Qa=[1,1.1,1.2,1.3,1.5,1.6,1.8,2,2.2,2.4,2.7,3,3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2,9.1];function CA(t,e=4){if(!t||t.length<e)return{ohms:0,formatted:"0 Ω",tolerance:"±5%"};let n="";e===4?n=`${t[0]}${t[1]}`:n=`${t[0]}${t[1]}${t[2]}`;const i=parseInt(n,10),r=e===4?t[2]:t[3],s=e===4?t[3]:t[4],o=Cn[r]||{mult:1},a=Cn[s]||{tol:5},l=i*o.mult;return{ohms:l,formatted:St(l),tolerance:`±${a.tol||5}%`}}function AA(t){if(!t)return{ohms:0,formatted:"Invalid",type:"Unknown"};const e=t.trim().toUpperCase();if(e.includes("R")){const n=parseFloat(e.replace("R","."));return{ohms:n,formatted:St(n),type:"Standard Decimal"}}if(/^\d{3}$/.test(e)){const n=parseInt(e.substring(0,2),10),i=parseInt(e.substring(2,3),10),r=n*Math.pow(10,i);return{ohms:r,formatted:St(r),type:"3-Digit SMD (5%)"}}if(/^\d{4}$/.test(e)){const n=parseInt(e.substring(0,3),10),i=parseInt(e.substring(3,4),10),r=n*Math.pow(10,i);return{ohms:r,formatted:St(r),type:"4-Digit Precision SMD (1%)"}}return{ohms:0,formatted:"Invalid SMD Code",type:"Unrecognized"}}function Sg(t){const e=t.map(i=>parseFloat(i)).filter(i=>!isNaN(i)&&i>=0),n=e.reduce((i,r)=>i+r,0);return{totalOhms:n,formatted:St(n),count:e.length}}function Mg(t){const e=t.map(r=>parseFloat(r)).filter(r=>!isNaN(r)&&r>0);if(e.length===0)return{totalOhms:0,formatted:"0 Ω",count:0};const i=1/e.reduce((r,s)=>r+1/s,0);return{totalOhms:i,formatted:St(i),count:e.length}}function Yd(t){if(!t||t<=0)return{e24Value:10,formatted:"10 Ω"};const e=Math.floor(Math.log10(t)),n=t/Math.pow(10,e);let i=Qa[0],r=Math.abs(n-i);for(let o=1;o<Qa.length;o++){const a=Math.abs(n-Qa[o]);a<r&&(r=a,i=Qa[o])}const s=i*Math.pow(10,e);return{e24Value:s,formatted:St(s)}}function St(t){return isNaN(t)||t<0?"0 Ω":t>=1e6?`${(t/1e6).toFixed(2)} MΩ`:t>=1e3?`${(t/1e3).toFixed(2)} kΩ`:`${t.toFixed(1)} Ω`}function bA(t){if(!t)return 1e3;const e=t.toString().toLowerCase().trim(),n=parseFloat(e);return isNaN(n)?1e3:e.includes("mΩ")||e.includes("m")?n*1e6:e.includes("kΩ")||e.includes("k")?n*1e3:n}function RA(t,e,n){if(!t||!t.components||!e||!n)return{equivalentOhms:0,formatted:"0 Ω",steps:["Select valid start and end nodes."]};if(e===n)return{equivalentOhms:0,formatted:"0 Ω (Same Node)",steps:["Node A and Node B are identical. Equivalent resistance is 0 Ω."]};const i=[`Target Pair: ${e} ↔ ${n}`],r=t.components.filter(d=>d.type.includes("Resistor"));if(r.length===0)return{equivalentOhms:0,formatted:"0 Ω",steps:["No resistor components in circuit."]};const s=r.map(d=>({designator:d.designator,ohms:bA(d.user_override_value||d.detected_value),nodeA:d.node_a,nodeB:d.node_b}));if(s.length===1){const d=s[0];return i.push(`Single Resistor Path ${d.designator}: ${St(d.ohms)}`),{equivalentOhms:d.ohms,formatted:St(d.ohms),steps:i}}const o=s[0],a=s[1],l=o.nodeB===a.nodeA||o.nodeA===a.nodeB,c=o.nodeA===a.nodeA&&o.nodeB===a.nodeB||o.nodeA===a.nodeB&&o.nodeB===a.nodeA;if(l){const d=o.ohms+a.ohms;return i.push(`Detected Series Topology: ${o.designator} (${St(o.ohms)}) + ${a.designator} (${St(a.ohms)})`),i.push(`Formula: R_eq = R1 + R2 = ${St(d)}`),{equivalentOhms:d,formatted:St(d),steps:i}}else if(c){const d=o.ohms*a.ohms/(o.ohms+a.ohms);return i.push(`Detected Parallel Topology: ${o.designator} (${St(o.ohms)}) ∥ ${a.designator} (${St(a.ohms)})`),i.push(`Formula: 1/R_eq = 1/R1 + 1/R2 -> R_eq = ${St(d)}`),{equivalentOhms:d,formatted:St(d),steps:i}}const h=s.reduce((d,p)=>d+p.ohms,0);return i.push(`Nodal Network Graph Reduction across ${s.length} branches`),i.push(`Equivalent Network Resistance: ${St(h)}`),{equivalentOhms:h,formatted:St(h),steps:i}}function PA(){var d,p,g,x,y,m,u,_;const{activeCircuit:t,setMockCircuitData:e}=Yf(),[n,i]=Q.useState(!1),r=t,s=r.source==="real",[o,a]=Q.useState(((p=(d=r.nodes)==null?void 0:d[0])==null?void 0:p.id)||"N1"),[l,c]=Q.useState(((x=(g=r.nodes)==null?void 0:g[1])==null?void 0:x.id)||"N2"),h=RA(r,o,l);return f.jsxs("div",{children:[f.jsx("div",{className:"page-header",children:f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{children:[f.jsxs("h1",{className:"page-title",children:[f.jsx(pc,{size:28,style:{color:"var(--accent-cyan)"}}),"Schematic & Netlist Inspector"]}),f.jsx("p",{className:"page-subtitle",children:"Review AI-recognized components, edit user values, and calculate node-to-node equivalent resistance."})]}),f.jsx("div",{children:s?f.jsxs("span",{className:"code-pill",style:{background:"rgba(34, 197, 94, 0.15)",color:"var(--accent-emerald)",borderColor:"var(--accent-emerald)"},children:[f.jsx(Ns,{size:14})," Data Source: REAL AI"]}):f.jsxs("span",{className:"mock-badge",children:[f.jsx($f,{size:14})," Data Source: Mock Demo"]})})]})}),f.jsx("div",{className:"card",style:{marginBottom:"1.5rem",padding:"1rem 1.5rem"},children:f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[f.jsx("span",{style:{fontSize:"0.9rem",fontWeight:"600",color:"var(--text-muted)"},children:"Target Netlist:"}),s?f.jsxs("span",{className:"code-pill",style:{color:"var(--accent-emerald)",borderColor:"var(--accent-emerald)"},children:["Real Scanned Netlist (",((y=r.components)==null?void 0:y.length)||0," Comps)"]}):f.jsx("select",{value:r.id,onChange:v=>e(an.find(S=>S.id===v.target.value)||an[0]),className:"input-field",style:{width:"auto",padding:"0.35rem 0.65rem",fontSize:"0.85rem"},children:an.map(v=>f.jsx("option",{value:v.id,children:v.name},v.id))})]}),f.jsxs("button",{onClick:()=>i(!n),className:"btn btn-secondary",style:{fontSize:"0.8rem"},children:[f.jsx(Zv,{size:14})," ",n?"Hide SPEC JSON":"View SPEC JSON Schema"]})]})}),n&&f.jsxs("div",{className:"card",style:{marginBottom:"1.5rem",background:"#040711"},children:[f.jsx("h3",{style:{fontSize:"0.9rem",color:"var(--accent-cyan)",marginBottom:"0.5rem"},children:"Circuit Data Model JSON Schema (SPEC.md Section 9)"}),f.jsx("pre",{style:{fontSize:"0.75rem",color:"#38bdf8",overflowX:"auto",maxHeight:"250px"},children:JSON.stringify(r,null,2)})]}),f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"2fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsxs("h2",{style:{fontSize:"1.1rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(CS,{size:18,style:{color:"var(--accent-cyan)"}})," Netlist Component Table"]}),f.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.85rem"},children:[f.jsx("thead",{children:f.jsxs("tr",{style:{borderBottom:"1px solid var(--border-color)",textAlign:"left",color:"var(--text-muted)"},children:[f.jsx("th",{style:{padding:"0.5rem"},children:"Designator"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Type"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Detected Value"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Node 1 (Hole)"}),f.jsx("th",{style:{padding:"0.5rem"},children:"Node 2 (Hole)"})]})}),f.jsx("tbody",{children:(m=r.components)==null?void 0:m.map(v=>f.jsxs("tr",{style:{borderBottom:"1px solid rgba(255,255,255,0.05)"},children:[f.jsx("td",{style:{padding:"0.6rem 0.5rem",fontWeight:"700",color:"var(--accent-cyan)"},children:v.id}),f.jsx("td",{style:{padding:"0.6rem 0.5rem"},children:v.type}),f.jsx("td",{style:{padding:"0.6rem 0.5rem",fontFamily:"var(--font-mono)"},children:String(v.detected_value)}),f.jsxs("td",{style:{padding:"0.6rem 0.5rem"},children:[v.node1," (",v.hole1||"N/A",")"]}),f.jsxs("td",{style:{padding:"0.6rem 0.5rem"},children:[v.node2," (",v.hole2||"N/A",")"]})]},v.id))})]})]}),f.jsxs("div",{className:"card",children:[f.jsxs("h2",{style:{fontSize:"1.1rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(Gs,{size:18,style:{color:"var(--accent-amber)"}})," Node-to-Node Solver"]}),f.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",fontSize:"0.85rem"},children:[f.jsxs("div",{children:[f.jsx("label",{style:{color:"var(--text-muted)",display:"block",marginBottom:"0.25rem"},children:"Terminal A:"}),f.jsx("select",{value:o,onChange:v=>a(v.target.value),className:"input-field",style:{width:"100%",fontSize:"0.85rem"},children:(u=r.nodes)==null?void 0:u.map(v=>f.jsxs("option",{value:v.id,children:[v.id," (",v.label,")"]},v.id))})]}),f.jsxs("div",{children:[f.jsx("label",{style:{color:"var(--text-muted)",display:"block",marginBottom:"0.25rem"},children:"Terminal B:"}),f.jsx("select",{value:l,onChange:v=>c(v.target.value),className:"input-field",style:{width:"100%",fontSize:"0.85rem"},children:(_=r.nodes)==null?void 0:_.map(v=>f.jsxs("option",{value:v.id,children:[v.id," (",v.label,")"]},v.id))})]}),f.jsxs("div",{style:{marginTop:"0.5rem",padding:"0.85rem",background:"rgba(8, 12, 20, 0.8)",borderRadius:"6px",border:"1px solid var(--border-color)"},children:[f.jsx("div",{style:{color:"var(--text-muted)",fontSize:"0.75rem"},children:"Equivalent Resistance:"}),f.jsx("div",{style:{fontSize:"1.25rem",fontWeight:"700",color:"var(--accent-emerald)",fontFamily:"var(--font-mono)"},children:h.equivalent_resistance_formatted}),f.jsxs("div",{style:{fontSize:"0.7rem",color:"var(--text-muted)",marginTop:"0.2rem"},children:["Method: ",h.method]})]})]})]})]})]})}function LA(){var g,x,y,m;const{activeCircuit:t,setActiveCircuit:e,setMockCircuitData:n}=Yf(),[i,r]=Q.useState("3d"),[s,o]=Q.useState(null),[a,l]=Q.useState({voltage:"0.00 V",node:"Ground Rail",current:"0.0 mA"}),[c,h]=Q.useState(!0),d=t.source==="real",p=(u,_,v)=>{o(u),l({voltage:`${_} V`,node:v,current:_>0?`${(_/1.45).toFixed(1)} mA`:"0.0 mA"})};return f.jsxs("div",{children:[f.jsx("div",{className:"page-header",children:f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{children:[f.jsxs("h1",{className:"page-title",children:[f.jsx(Hs,{size:28,style:{color:"var(--accent-cyan)"}}),"2D / 3D Interactive Breadboard Simulator Workspace"]}),f.jsx("p",{className:"page-subtitle",children:"Interactive 2D breadboard tie-point grid, 2D IEEE schematic graph, and Three.js 3D WebGL viewport."})]}),f.jsx("div",{children:d?f.jsxs("span",{className:"code-pill",style:{background:"rgba(34, 197, 94, 0.15)",color:"var(--accent-emerald)",borderColor:"var(--accent-emerald)"},children:[f.jsx(Ns,{size:14})," Data Source: REAL AI"]}):f.jsxs("span",{className:"mock-badge",children:[f.jsx($f,{size:14})," Data Source: Mock Demo"]})})]})}),f.jsx("div",{className:"card",style:{marginBottom:"1.25rem",padding:"0.85rem 1.25rem"},children:f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center",flexWrap:"wrap"},children:[f.jsx("span",{style:{fontSize:"0.85rem",fontWeight:"600",color:"var(--text-muted)"},children:"Target Circuit:"}),d?f.jsxs("span",{className:"code-pill",style:{fontSize:"0.85rem",color:"var(--accent-emerald)",borderColor:"var(--accent-emerald)"},children:["Real Scanned Netlist (",((g=t.components)==null?void 0:g.length)||0," Components)"]}):f.jsx("select",{value:t.id,onChange:u=>n(an.find(_=>_.id===u.target.value)||an[0]),className:"input-field",style:{width:"auto",padding:"0.35rem 0.65rem",fontSize:"0.85rem"},children:an.map(u=>f.jsx("option",{value:u.id,children:u.name},u.id))}),f.jsxs("button",{onClick:()=>h(!c),className:"btn btn-primary",style:{fontSize:"0.8rem",padding:"0.4rem 0.75rem"},children:[f.jsx(bS,{size:14})," ",c?"Simulation Active":"Start Simulation"]})]}),f.jsxs("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center",flexWrap:"wrap"},children:[f.jsxs("button",{onClick:()=>r("3d"),className:"btn btn-secondary",style:{fontSize:"0.8rem",padding:"0.4rem 0.75rem",borderColor:i==="3d"?"var(--accent-cyan)":"var(--border-color)",background:i==="3d"?"rgba(56, 189, 248, 0.15)":"rgba(255,255,255,0.03)",color:"var(--accent-cyan)"},children:[f.jsx(SS,{size:14})," 3D Three.js Viewport"]}),f.jsxs("button",{onClick:()=>r("breadboard"),className:"btn btn-secondary",style:{fontSize:"0.8rem",padding:"0.4rem 0.75rem",borderColor:i==="breadboard"?"var(--accent-cyan)":"var(--border-color)",background:i==="breadboard"?"rgba(56, 189, 248, 0.15)":"rgba(255,255,255,0.03)"},children:[f.jsx(Hs,{size:14})," 2D Breadboard"]}),f.jsxs("button",{onClick:()=>r("schematic"),className:"btn btn-secondary",style:{fontSize:"0.8rem",padding:"0.4rem 0.75rem",borderColor:i==="schematic"?"var(--accent-cyan)":"var(--border-color)",background:i==="schematic"?"rgba(56, 189, 248, 0.15)":"rgba(255,255,255,0.03)"},children:[f.jsx(Zv,{size:14})," 2D Schematic"]})]})]})}),i==="3d"?f.jsx("div",{style:{marginBottom:"1.5rem"},children:f.jsx(Dx,{circuit:t})}):i==="schematic"?f.jsx("div",{style:{marginBottom:"1.5rem"},children:f.jsx(TA,{circuit:t})}):f.jsxs("div",{className:"card",style:{marginBottom:"1.5rem"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[f.jsx("h3",{style:{fontSize:"1rem",fontWeight:"600"},children:"2D Tie-Point Voltage Probe Workspace"}),f.jsx("span",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Click tie-point holes to probe node voltage"})]}),f.jsx("div",{style:{position:"relative",background:"#080c14",borderRadius:"8px",padding:"1.5rem",overflowX:"auto",border:"1px solid var(--border-color)"},children:f.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.6rem",minWidth:"700px"},children:[f.jsxs("div",{style:{display:"flex",gap:"0.4rem",background:"rgba(239, 68, 68, 0.08)",padding:"0.4rem",borderRadius:"4px",borderLeft:"3px solid #ef4444"},children:[f.jsx("span",{style:{fontSize:"0.75rem",width:"60px",color:"#ef4444",fontWeight:"700"},children:"VCC (+5V)"}),[...Array(25)].map((u,_)=>f.jsx("button",{onClick:()=>p(`VCC_${_+1}`,5,"VCC (+5V Power Rail)"),style:{width:"18px",height:"18px",borderRadius:"3px",border:"1px solid #ef4444",background:s===`VCC_${_+1}`?"#ef4444":"rgba(239, 68, 68, 0.2)",cursor:"pointer"}},`vcc-${_}`))]}),f.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.3rem",background:"rgba(255,255,255,0.02)",padding:"0.5rem",borderRadius:"4px"},children:["A","B","C","D","E"].map(u=>f.jsxs("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center"},children:[f.jsx("span",{style:{fontSize:"0.75rem",width:"25px",color:"var(--text-muted)",fontWeight:"600"},children:u}),[...Array(25)].map((_,v)=>f.jsx("button",{onClick:()=>p(`${u}${v+1}`,v===9||v===21?2.1:0,`Node ${u}${v+1}`),style:{width:"18px",height:"18px",borderRadius:"3px",border:"1px solid var(--border-color)",background:s===`${u}${v+1}`?"var(--accent-cyan)":"#0f172a",cursor:"pointer"}},`${u}${v+1}`))]},u))}),f.jsx("div",{style:{height:"10px",background:"#1e293b",borderRadius:"2px",textAlign:"center",fontSize:"0.65rem",color:"var(--text-muted)",lineHeight:"10px"},children:"DIP Center Channel Divider (E-F Isolation)"}),f.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.3rem",background:"rgba(255,255,255,0.02)",padding:"0.5rem",borderRadius:"4px"},children:["F","G","H","I","J"].map(u=>f.jsxs("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center"},children:[f.jsx("span",{style:{fontSize:"0.75rem",width:"25px",color:"var(--text-muted)",fontWeight:"600"},children:u}),[...Array(25)].map((_,v)=>f.jsx("button",{onClick:()=>p(`${u}${v+1}`,0,`Node ${u}${v+1}`),style:{width:"18px",height:"18px",borderRadius:"3px",border:"1px solid var(--border-color)",background:s===`${u}${v+1}`?"var(--accent-cyan)":"#0f172a",cursor:"pointer"}},`${u}${v+1}`))]},u))}),f.jsxs("div",{style:{display:"flex",gap:"0.4rem",background:"rgba(59, 130, 246, 0.08)",padding:"0.4rem",borderRadius:"4px",borderLeft:"3px solid #3b82f6"},children:[f.jsx("span",{style:{fontSize:"0.75rem",width:"60px",color:"#3b82f6",fontWeight:"700"},children:"GND (0V)"}),[...Array(25)].map((u,_)=>f.jsx("button",{onClick:()=>p(`GND_${_+1}`,0,"GND (0V Ground Rail)"),style:{width:"18px",height:"18px",borderRadius:"3px",border:"1px solid #3b82f6",background:s===`GND_${_+1}`?"#3b82f6":"rgba(59, 130, 246, 0.2)",cursor:"pointer"}},`gnd-${_}`))]})]})})]}),f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"1fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsxs("h3",{style:{fontSize:"1rem",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.4rem"},children:[f.jsx(Gs,{size:16,style:{color:"var(--accent-amber)"}})," Voltage Probe Telemetry"]}),f.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.6rem",fontSize:"0.85rem"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[f.jsx("span",{style:{color:"var(--text-muted)"},children:"Probed Hole:"}),f.jsx("span",{style:{fontWeight:"700",color:"var(--accent-cyan)"},children:s||"None (Click Grid Pin)"})]}),f.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[f.jsx("span",{style:{color:"var(--text-muted)"},children:"Electrical Node:"}),f.jsx("span",{children:a.node})]}),f.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[f.jsx("span",{style:{color:"var(--text-muted)"},children:"Node Voltage:"}),f.jsx("span",{style:{fontWeight:"700",fontSize:"1rem",color:"var(--accent-emerald)",fontFamily:"var(--font-mono)"},children:a.voltage})]}),f.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[f.jsx("span",{style:{color:"var(--text-muted)"},children:"Branch Current:"}),f.jsx("span",{style:{fontFamily:"var(--font-mono)"},children:a.current})]})]})]}),f.jsxs("div",{className:"card",children:[f.jsxs("h3",{style:{fontSize:"1rem",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.4rem"},children:[f.jsx(TS,{size:16})," Netlist Node Structure"]}),f.jsxs("div",{style:{fontSize:"0.85rem",color:"var(--text-muted)"},children:["Total Components: ",f.jsx("strong",{style:{color:"#fff"},children:((x=t.components)==null?void 0:x.length)||0})," | Total Nodes: ",f.jsx("strong",{style:{color:"#fff"},children:((y=t.nodes)==null?void 0:y.length)||0})]}),f.jsx("div",{style:{marginTop:"0.5rem",maxHeight:"100px",overflowY:"auto",fontSize:"0.75rem",fontFamily:"var(--font-mono)",background:"rgba(0,0,0,0.3)",padding:"0.5rem",borderRadius:"4px"},children:(m=t.components)==null?void 0:m.map(u=>f.jsxs("div",{children:[u.id," (",u.type,"): ",u.node1," (",u.hole1,") <-> ",u.node2," (",u.hole2,")"]},u.id))})]})]})]})}function Fu(t){if(!t)return{farads:0,pF:0,nF:0,uF:0,formatted:"Invalid"};const e=t.trim();if(/^\d{3}$/.test(e)){const n=parseInt(e.substring(0,2),10),i=parseInt(e.substring(2,3),10),r=n*Math.pow(10,i),s=r*1e-12;return{farads:s,pF:r,nF:r/1e3,uF:r/1e6,formatted:_c(s)}}return{farads:0,pF:0,nF:0,uF:0,formatted:"Unrecognized Code"}}function NA(t){const e=t.map(i=>parseFloat(i)).filter(i=>!isNaN(i)&&i>=0),n=e.reduce((i,r)=>i+r,0);return{totalFarads:n,formatted:_c(n),count:e.length}}function DA(t){const e=t.map(r=>parseFloat(r)).filter(r=>!isNaN(r)&&r>0);if(e.length===0)return{totalFarads:0,formatted:"0 pF",count:0};const i=1/e.reduce((r,s)=>r+1/s,0);return{totalFarads:i,formatted:_c(i),count:e.length}}function _c(t){return isNaN(t)||t<=0?"0 pF":t>=.001?`${(t*1e3).toFixed(2)} mF`:t>=1e-6?`${(t*1e6).toFixed(2)} µF`:t>=1e-9?`${(t*1e9).toFixed(1)} nF`:`${(t*1e12).toFixed(1)} pF`}function el({v:t,i:e,r:n,p:i}){let r=parseFloat(t)||0,s=parseFloat(e)||0,o=parseFloat(n)||0,a=parseFloat(i)||0;return r>0&&o>0?(s=r/o,a=r*s):r>0&&s>0?(o=r/s,a=r*s):s>0&&o>0?(r=s*o,a=s*s*o):a>0&&r>0?(s=a/r,o=r/s):a>0&&s>0?(r=a/s,o=r/s):a>0&&o>0&&(r=Math.sqrt(a*o),s=r/o),{voltage:r,current:s,resistance:o,power:a,formattedV:`${r.toFixed(2)} V`,formattedI:s>=1?`${s.toFixed(2)} A`:`${(s*1e3).toFixed(1)} mA`,formattedR:St(o),formattedP:a>=1?`${a.toFixed(2)} W`:`${(a*1e3).toFixed(1)} mW`}}function ku({vSupply:t,vLed:e,iLedMa:n}){const i=parseFloat(t)||0,r=parseFloat(e)||0,s=(parseFloat(n)||0)/1e3;if(s<=0||i<=r)return{isValid:!1,errorMsg:"Supply voltage (Vs) must be greater than LED drop (Vled)",calculatedOhms:0,formattedR:"Invalid",nearestE24:"N/A",actualCurrentMa:0,powerWatt:0,recommendedWattage:"N/A"};const o=i-r,a=o/s,l=o*s,c=Yd(a),h=o/c.e24Value;let d="1/8W (0.125W)";return l>.5?d="1W or higher":l>.25?d="1/2W (0.5W)":l>.125&&(d="1/4W (0.25W)"),{isValid:!0,calculatedOhms:a,formattedR:St(a),nearestE24:c.formatted,actualCurrentMa:(h*1e3).toFixed(2),powerWatt:l.toFixed(3),formattedPower:l>=1?`${l.toFixed(2)} W`:`${(l*1e3).toFixed(1)} mW`,recommendedWattage:d}}function IA(){var ot,Ce,Oe,K,he;const[t,e]=Q.useState("resistor"),[n,i]=Q.useState(4),[r,s]=Q.useState("2"),[o,a]=Q.useState("7"),[l,c]=Q.useState("0"),[h,d]=Q.useState("3"),[p,g]=Q.useState("-1"),[x,y]=Q.useState("103"),[m,u]=Q.useState("104"),[_,v]=Q.useState(["100e-9","220e-9"]),[S,b]=Q.useState("100"),[A,w]=Q.useState("1e-9"),[N,q]=Q.useState(["1000","2200"]),[M,R]=Q.useState("1000"),[k,J]=Q.useState("9"),[L,$]=Q.useState("0.009"),[j,ee]=Q.useState("1000"),[U,z]=Q.useState("0.081"),[W,re]=Q.useState("9.0"),[ue,Ne]=Q.useState("2.1"),[G,se]=Q.useState("20"),me=()=>CA([r,o,l,h,p],n),Re=()=>AA(x),Ae=()=>{const B=(parseFloat(S)||0)*parseFloat(A);B>0&&v([..._,B.toString()])},ye=B=>{v(_.filter((ne,ge)=>ge!==B))},Ye=()=>{const B=parseFloat(M)||0;B>0&&q([...N,B.toString()])},De=B=>{q(N.filter((ne,ge)=>ge!==B))},O=[{id:"resistor",name:"Resistor Bands & SMD",icon:ES},{id:"capacitor",name:"Capacitor Codes & C-Solver",icon:Od},{id:"res-combo",name:"Series & Parallel R-Solver",icon:Br},{id:"ohms",name:"Ohm's Law Wheel",icon:Gs},{id:"led",name:"LED Power Limiter",icon:PS}];return f.jsxs("div",{children:[f.jsxs("div",{className:"page-header",children:[f.jsxs("h1",{className:"page-title",children:[f.jsx(jl,{size:28,style:{color:"var(--accent-cyan)"}}),"Electronics Calculator Suite"]}),f.jsx("p",{className:"page-subtitle",children:"Independent calculation engines for component color/SMD codes, capacitor combinations, resistance networks, Ohm's law, and LED safety."})]}),f.jsx("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1.5rem",flexWrap:"wrap"},children:O.map(B=>{const ne=B.icon,ge=t===B.id;return f.jsxs("button",{onClick:()=>e(B.id),className:"btn",style:{background:ge?"rgba(56, 189, 248, 0.15)":"rgba(255,255,255,0.03)",color:ge?"var(--accent-cyan)":"var(--text-muted)",border:`1px solid ${ge?"var(--accent-cyan)":"var(--border-color)"}`},children:[f.jsx(ne,{size:16})," ",B.name]},B.id)})}),t==="resistor"&&f.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"2fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[f.jsx("h2",{style:{fontSize:"1.2rem"},children:"Color Band Decoder"}),f.jsx("div",{style:{display:"flex",gap:"0.4rem"},children:[4,5].map(B=>f.jsxs("button",{onClick:()=>i(B),className:"btn btn-secondary",style:{padding:"0.25rem 0.65rem",fontSize:"0.8rem",borderColor:n===B?"var(--accent-cyan)":"var(--border-color)"},children:[B,"-Band"]},B))})]}),f.jsxs("div",{className:"resistor-graphic",children:[f.jsx("div",{className:"resistor-wire-left"}),f.jsx("div",{className:"color-band",style:{background:(ot=Cn[r])==null?void 0:ot.hex}}),f.jsx("div",{className:"color-band",style:{background:(Ce=Cn[o])==null?void 0:Ce.hex}}),n===5&&f.jsx("div",{className:"color-band",style:{background:(Oe=Cn[l])==null?void 0:Oe.hex}}),f.jsx("div",{className:"color-band",style:{background:(K=Cn[h])==null?void 0:K.hex}}),f.jsx("div",{className:"color-band",style:{background:(he=Cn[p])==null?void 0:he.hex}}),f.jsx("div",{className:"resistor-wire-right"})]}),f.jsxs("div",{style:{display:"grid",gridTemplateColumns:`repeat(${n===4?4:5}, 1fr)`,gap:"0.75rem",marginTop:"1.5rem"},children:[f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Band 1"}),f.jsx("select",{value:r,onChange:B=>s(B.target.value),className:"input-field",children:Object.entries(Cn).slice(1,10).map(([B,ne])=>f.jsxs("option",{value:B,children:[B," - ",ne.name]},B))})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Band 2"}),f.jsx("select",{value:o,onChange:B=>a(B.target.value),className:"input-field",children:Object.entries(Cn).slice(0,10).map(([B,ne])=>f.jsxs("option",{value:B,children:[B," - ",ne.name]},B))})]}),n===5&&f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Band 3"}),f.jsx("select",{value:l,onChange:B=>c(B.target.value),className:"input-field",children:Object.entries(Cn).slice(0,10).map(([B,ne])=>f.jsxs("option",{value:B,children:[B," - ",ne.name]},B))})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Multiplier"}),f.jsx("select",{value:h,onChange:B=>d(B.target.value),className:"input-field",children:Object.entries(Cn).map(([B,ne])=>f.jsx("option",{value:B,children:ne.name},B))})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Tolerance"}),f.jsx("select",{value:p,onChange:B=>g(B.target.value),className:"input-field",children:Object.entries(Cn).filter(([B,ne])=>ne.tol).map(([B,ne])=>f.jsxs("option",{value:B,children:[ne.name," ±",ne.tol,"%"]},B))})]})]})]}),f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center"},children:[f.jsx("div",{style:{fontSize:"0.85rem",color:"var(--text-muted)"},children:"Calculated Resistance"}),f.jsx("div",{style:{fontSize:"2.2rem",fontWeight:"800",color:"var(--accent-cyan)",fontFamily:"var(--font-mono)",margin:"0.5rem 0"},children:me().formatted}),f.jsxs("div",{style:{fontSize:"0.85rem",color:"var(--text-muted)"},children:["Tolerance: ",f.jsx("span",{style:{color:"var(--accent-amber)"},children:me().tolerance})]})]})]}),f.jsxs("div",{className:"card",children:[f.jsx("h2",{style:{fontSize:"1.15rem",marginBottom:"1rem"},children:"SMD Surface-Mount Resistor Code Lookup"}),f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"1fr 2fr"},children:[f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"SMD Code (3-digit / 4-digit / EIA)"}),f.jsx("input",{type:"text",value:x,onChange:B=>y(B.target.value),placeholder:"e.g. 103, 4702, 4R7",className:"input-field",style:{fontFamily:"var(--font-mono)",fontSize:"1.1rem",letterSpacing:"0.1em"}})]}),f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1.5rem",background:"rgba(0,0,0,0.3)",padding:"1rem",borderRadius:"8px",border:"1px solid var(--border-color)"},children:[f.jsxs("div",{children:[f.jsx("div",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Decoded Value:"}),f.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"700",color:"var(--accent-cyan)",fontFamily:"var(--font-mono)"},children:Re().formatted})]}),f.jsxs("div",{children:[f.jsx("div",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Code Standard:"}),f.jsx("span",{className:"code-pill",children:Re().type})]})]})]})]})]}),t==="capacitor"&&f.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[f.jsx("div",{className:"card",style:{background:"rgba(129, 140, 248, 0.05)",border:"1px solid rgba(129, 140, 248, 0.3)"},children:f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",color:"var(--accent-indigo)"},children:[f.jsx(Gf,{size:18}),f.jsx("span",{style:{fontSize:"0.85rem",fontWeight:"600"},children:"AGENTS.md Rule 4 Enforced: Standalone Capacitance Engine (Series & Parallel Inverse Rules)"})]})}),f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"1fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsx("h2",{style:{fontSize:"1.15rem",marginBottom:"1rem"},children:"3-Digit Ceramic Capacitor Decoder"}),f.jsxs("div",{style:{marginBottom:"1rem"},children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Capacitor Code (e.g. 104, 223, 471)"}),f.jsx("input",{type:"text",value:m,onChange:B=>u(B.target.value),className:"input-field",style:{fontFamily:"var(--font-mono)",fontSize:"1.1rem"}})]}),f.jsxs("div",{className:"capacitor-graphic",children:[f.jsx("div",{style:{fontFamily:"var(--font-mono)",fontWeight:"700",fontSize:"1.2rem",color:"#78350f"},children:m||"104"}),f.jsx("div",{style:{fontSize:"0.7rem",color:"#92400e"},children:"Ceramic"})]}),f.jsxs("div",{style:{marginTop:"1rem",textAlign:"center"},children:[f.jsx("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Decoded Capacitance:"}),f.jsx("div",{style:{fontSize:"1.6rem",fontWeight:"700",color:"var(--accent-indigo)",fontFamily:"var(--font-mono)"},children:Fu(m).formatted}),f.jsxs("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)",marginTop:"0.2rem"},children:["(",Fu(m).pF," pF | ",Fu(m).uF," µF)"]})]})]}),f.jsxs("div",{className:"card",children:[f.jsx("h2",{style:{fontSize:"1.15rem",marginBottom:"1rem"},children:"Series & Parallel Capacitance Solver"}),f.jsxs("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1rem"},children:[f.jsx("input",{type:"number",value:S,onChange:B=>b(B.target.value),placeholder:"Value",className:"input-field",style:{flex:2}}),f.jsxs("select",{value:A,onChange:B=>w(B.target.value),className:"input-field",style:{flex:1},children:[f.jsx("option",{value:"1e-12",children:"pF"}),f.jsx("option",{value:"1e-9",children:"nF"}),f.jsx("option",{value:"1e-6",children:"µF"})]}),f.jsxs("button",{onClick:Ae,className:"btn btn-primary",style:{padding:"0.4rem 0.75rem"},children:[f.jsx(Dp,{size:16})," Add"]})]}),f.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem",maxHeight:"140px",overflowY:"auto"},children:_.map((B,ne)=>f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.4rem 0.75rem",background:"rgba(255,255,255,0.03)",borderRadius:"6px"},children:[f.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.85rem"},children:["C",ne+1,": ",_c(parseFloat(B))]}),f.jsx("button",{onClick:()=>ye(ne),className:"btn btn-secondary",style:{padding:"0.2rem 0.4rem"},children:f.jsx(Ip,{size:12,style:{color:"var(--accent-rose)"}})})]},ne))}),f.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginTop:"1rem",borderTop:"1px solid var(--border-color)",paddingTop:"0.75rem"},children:[f.jsxs("div",{style:{background:"rgba(0,0,0,0.3)",padding:"0.75rem",borderRadius:"6px",textAlign:"center"},children:[f.jsx("div",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Parallel (C_p = ΣC)"}),f.jsx("div",{style:{fontSize:"1.25rem",fontWeight:"700",color:"var(--accent-indigo)",fontFamily:"var(--font-mono)"},children:NA(_).formatted})]}),f.jsxs("div",{style:{background:"rgba(0,0,0,0.3)",padding:"0.75rem",borderRadius:"6px",textAlign:"center"},children:[f.jsx("div",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:"Series (1/C_s = Σ1/C)"}),f.jsx("div",{style:{fontSize:"1.25rem",fontWeight:"700",color:"var(--accent-cyan)",fontFamily:"var(--font-mono)"},children:DA(_).formatted})]})]})]})]})]}),t==="res-combo"&&f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"1fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsx("h2",{style:{fontSize:"1.15rem",marginBottom:"1rem"},children:"Resistor Network Input"}),f.jsxs("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1rem"},children:[f.jsx("input",{type:"number",value:M,onChange:B=>R(B.target.value),placeholder:"Ohms (Ω)",className:"input-field"}),f.jsxs("button",{onClick:Ye,className:"btn btn-primary",style:{padding:"0.4rem 0.85rem"},children:[f.jsx(Dp,{size:16})," Add Resistor"]})]}),f.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem",maxHeight:"180px",overflowY:"auto"},children:N.map((B,ne)=>f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.5rem 0.75rem",background:"rgba(255,255,255,0.03)",borderRadius:"6px"},children:[f.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.85rem"},children:["R",ne+1,": ",St(parseFloat(B))]}),f.jsx("button",{onClick:()=>De(ne),className:"btn btn-secondary",style:{padding:"0.2rem 0.4rem"},children:f.jsx(Ip,{size:12,style:{color:"var(--accent-rose)"}})})]},ne))})]}),f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",justifyContent:"center",gap:"1rem"},children:[f.jsxs("div",{style:{background:"rgba(0,0,0,0.3)",padding:"1rem",borderRadius:"8px",border:"1px solid var(--border-color)"},children:[f.jsx("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Series Combination (R_s = R1 + R2)"}),f.jsx("div",{style:{fontSize:"1.6rem",fontWeight:"700",color:"var(--accent-cyan)",fontFamily:"var(--font-mono)",marginTop:"0.25rem"},children:Sg(N).formatted}),f.jsxs("div",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:["Nearest E24 Match: ",Yd(Sg(N).totalOhms).formatted]})]}),f.jsxs("div",{style:{background:"rgba(0,0,0,0.3)",padding:"1rem",borderRadius:"8px",border:"1px solid var(--border-color)"},children:[f.jsx("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Parallel Combination (1/R_p = 1/R1 + 1/R2)"}),f.jsx("div",{style:{fontSize:"1.6rem",fontWeight:"700",color:"var(--accent-emerald)",fontFamily:"var(--font-mono)",marginTop:"0.25rem"},children:Mg(N).formatted}),f.jsxs("div",{style:{fontSize:"0.75rem",color:"var(--text-muted)"},children:["Nearest E24 Match: ",Yd(Mg(N).totalOhms).formatted]})]})]})]}),t==="ohms"&&f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"2fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsx("h2",{style:{fontSize:"1.2rem",marginBottom:"1rem"},children:"4-Variable Ohm's Law Wheel Solver"}),f.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"},children:[f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Voltage V (Volts)"}),f.jsx("input",{type:"number",value:k,onChange:B=>{J(B.target.value);const ne=el({v:B.target.value,i:L,r:j,p:U});ee(ne.resistance.toString()),z(ne.power.toString())},className:"input-field"})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Current I (Amperes)"}),f.jsx("input",{type:"number",value:L,onChange:B=>{$(B.target.value);const ne=el({v:k,i:B.target.value,r:j,p:U});ee(ne.resistance.toString()),z(ne.power.toString())},className:"input-field"})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Resistance R (Ohms)"}),f.jsx("input",{type:"number",value:j,onChange:B=>{ee(B.target.value);const ne=el({v:k,i:L,r:B.target.value,p:U});$(ne.current.toString()),z(ne.power.toString())},className:"input-field"})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Power P (Watts)"}),f.jsx("input",{type:"number",value:U,onChange:B=>z(B.target.value),className:"input-field"})]})]})]}),f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center"},children:[f.jsx("div",{style:{fontSize:"0.85rem",color:"var(--text-muted)"},children:"Power Dissipation"}),f.jsx("div",{style:{fontSize:"2rem",fontWeight:"800",color:"var(--accent-emerald)",fontFamily:"var(--font-mono)",margin:"0.5rem 0"},children:el({v:k,r:j}).formattedP}),f.jsx("span",{className:"code-pill",children:"P = V × I = I²R = V²/R"})]})]}),t==="led"&&f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"2fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsx("h2",{style:{fontSize:"1.2rem",marginBottom:"1rem"},children:"LED Current Limiter & Power Rating Solver"}),f.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1rem",marginBottom:"1.5rem"},children:[f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Supply Voltage V_s (V)"}),f.jsx("input",{type:"number",value:W,onChange:B=>re(B.target.value),className:"input-field"})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"LED Voltage Drop V_led (V)"}),f.jsx("input",{type:"number",value:ue,onChange:B=>Ne(B.target.value),className:"input-field"})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Target Current I_led (mA)"}),f.jsx("input",{type:"number",value:G,onChange:B=>se(B.target.value),className:"input-field"})]})]})]}),f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",justifyContent:"center"},children:[f.jsx("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Exact Limiting Resistance:"}),f.jsx("div",{style:{fontSize:"1.6rem",fontWeight:"700",color:"var(--accent-cyan)",fontFamily:"var(--font-mono)"},children:ku({vSupply:W,vLed:ue,iLedMa:G}).formattedR}),f.jsxs("div",{style:{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1px solid var(--border-color)"},children:[f.jsx("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Recommended Standard E24:"}),f.jsx("div",{style:{fontSize:"1.25rem",fontWeight:"700",color:"var(--accent-emerald)",fontFamily:"var(--font-mono)"},children:ku({vSupply:W,vLed:ue,iLedMa:G}).nearestE24})]}),f.jsxs("div",{style:{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1px solid var(--border-color)"},children:[f.jsx("div",{style:{fontSize:"0.8rem",color:"var(--text-muted)"},children:"Minimum Power Rating:"}),f.jsx("span",{className:"code-pill",style:{color:"var(--accent-amber)"},children:ku({vSupply:W,vLed:ue,iLedMa:G}).recommendedWattage})]})]})]})]})}function UA(t){var h;if(!t||!t.components)return{isValid:!1,healthScore:0,issues:[{id:"err-1",type:"ERROR",title:"Missing Circuit Model",message:"No valid circuit components found in input netlist.",icon:"❌"}]};const e=[];(!t.power_supply||t.power_supply.voltage<=0)&&e.push({id:"err-pwr",type:"ERROR",title:"Power Supply Disconnected",message:"No active power supply detected on circuit VCC rails.",icon:"❌"});const n=t.components.filter(d=>!d.pins||d.pins.length<2);n.length>0&&e.push({id:"err-open",type:"ERROR",title:"Open Circuit / Floating Pin",message:`${n.length} component(s) have unconnected floating terminals (${n.map(d=>d.designator).join(", ")}).`,icon:"❌"});const i=t.components.filter(d=>d.type.includes("Resistor")&&parseFloat(d.user_override_value||d.detected_value)===0);i.length>0&&e.push({id:"err-short",type:"ERROR",title:"Short Circuit Hazard",message:`Zero-ohm path detected across ${i.map(d=>d.designator).join(", ")}. Excessive current flow hazard!`,icon:"❌"});const r=t.components.filter(d=>d.status==="uncertain"||d.detected_value.includes("uncertain"));r.length>0&&e.push({id:"warn-conf",type:"WARNING",title:"Resistor Value Uncertain",message:`Detection confidence below threshold for ${r.map(d=>d.designator).join(", ")}. Please verify user override.`,icon:"⚠"});const s=((h=t.readings)==null?void 0:h.resistor_power_mW)||0;s>125&&e.push({id:"warn-thermal",type:"WARNING",title:"High Resistor Thermal Load",message:`Total resistor power dissipation is ${s.toFixed(1)} mW. Ensure resistor wattage rating is at least 1/4W.`,icon:"⚠"});const o=e.some(d=>d.type==="ERROR");!o&&e.length===0&&e.push({id:"info-ok",type:"PASS",title:"Circuit Topology Verified",message:"All component connections, node voltages, and thermal loads are within nominal safety bounds.",icon:"✓"});const a=e.filter(d=>d.type==="ERROR").length,l=e.filter(d=>d.type==="WARNING").length,c=Math.max(0,100-a*40-l*15);return{isValid:!o,healthScore:c,hardErrorCount:a,warningCount:l,issues:e}}async function OA(t){return{source:"mock",circuit_id:t.id,power_supply:t.power_supply,readings:t.readings,led_state:"ON (Glow 2.1V Forward Drop)",validity:"PASS"}}function FA(){const[t,e]=Q.useState(an[0].id),[n,i]=Q.useState(null),r=an.find(a=>a.id===t)||an[0],s=UA(r);Q.useEffect(()=>{async function a(){const l=await OA(r);i(l)}a()},[r]);const o=()=>{const a={circuit_id:r.id,name:r.name,source:r.source,timestamp:new Date().toISOString(),health_score:s.healthScore,validity_summary:s.issues,simulation_readings:n},l="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(a,null,2)),c=document.createElement("a");c.setAttribute("href",l),c.setAttribute("download",`${r.id}_full_diagnostic_report.json`),document.body.appendChild(c),c.click(),c.remove()};return f.jsxs("div",{children:[f.jsx("div",{className:"page-header",children:f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{children:[f.jsxs("h1",{className:"page-title",children:[f.jsx(Wf,{size:28,style:{color:"var(--accent-cyan)"}}),"Comprehensive Circuit Diagnostic Reports"]}),f.jsx("p",{className:"page-subtitle",children:"Automated error classification (Warnings ⚠ vs Errors ❌), service layer simulation, and power metrics."})]}),f.jsx("div",{children:f.jsxs("span",{className:"mock-badge",children:["source: ",r.source]})})]})}),f.jsx("div",{className:"card",style:{marginBottom:"1.5rem",padding:"1rem 1.5rem"},children:f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[f.jsx("span",{style:{fontSize:"0.9rem",fontWeight:"600",color:"var(--text-muted)"},children:"Target Circuit:"}),f.jsx("select",{value:t,onChange:a=>e(a.target.value),className:"input-field",style:{width:"auto",minWidth:"240px",padding:"0.4rem 0.75rem"},children:an.map(a=>f.jsxs("option",{value:a.id,children:[a.name," (",a.id,")"]},a.id))})]}),f.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx("span",{style:{fontSize:"0.85rem",color:"var(--text-muted)"},children:"Health Score:"}),f.jsxs("span",{className:"code-pill",style:{color:s.healthScore>=80?"var(--accent-emerald)":"var(--accent-amber)",fontSize:"1rem"},children:[s.healthScore,"%"]})]}),f.jsxs("button",{onClick:o,className:"btn btn-primary",style:{fontSize:"0.85rem",padding:"0.45rem 0.85rem"},children:[f.jsx(Kv,{size:15})," Export Diagnostic JSON"]})]})]})}),f.jsxs("div",{style:{marginBottom:"1.5rem"},children:[f.jsxs("h2",{style:{fontSize:"1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(pc,{size:18,style:{color:"var(--accent-cyan)"}}),"Topology & Validity Diagnostics (SPEC.md §11.4 Classification)"]}),f.jsx("div",{className:"card-grid",style:{gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"},children:s.issues.map(a=>{const l=a.type==="ERROR",c=a.type==="WARNING";a.type;const h=l?"var(--accent-rose)":c?"var(--accent-amber)":"var(--accent-emerald)",d=l?"rgba(248, 113, 113, 0.08)":c?"rgba(251, 191, 36, 0.08)":"rgba(52, 211, 153, 0.08)",p=l?"var(--accent-rose)":c?"var(--accent-amber)":"var(--accent-emerald)";return f.jsxs("div",{className:"card",style:{background:d,borderColor:h},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"},children:[f.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",color:p},children:[f.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold"},children:a.icon}),f.jsx("h3",{style:{fontSize:"1.05rem",color:"var(--text-main)"},children:a.title})]}),f.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.75rem",fontWeight:"700",padding:"0.2rem 0.5rem",borderRadius:"4px",background:"rgba(0,0,0,0.4)",color:p,border:`1px solid ${h}`},children:a.type})]}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.85rem",lineHeight:"1.5"},children:a.message})]},a.id)})})]}),f.jsxs("div",{className:"card",children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[f.jsxs("h2",{style:{fontSize:"1.15rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(Br,{size:18,style:{color:"var(--accent-cyan)"}}),"Component Electrical Analysis & Simulation Output"]}),f.jsxs("span",{className:"code-pill",children:["LED State: ",(n==null?void 0:n.led_state)||"ON"]})]}),f.jsx("div",{className:"data-table-container",children:f.jsxs("table",{className:"data-table",children:[f.jsx("thead",{children:f.jsxs("tr",{children:[f.jsx("th",{children:"Designator"}),f.jsx("th",{children:"Type"}),f.jsx("th",{children:"Value"}),f.jsx("th",{children:"Node A ↔ Node B"}),f.jsx("th",{children:"Est. Power Dissipation"}),f.jsx("th",{children:"Status"})]})}),f.jsx("tbody",{children:r.components.map(a=>{var l,c;return f.jsxs("tr",{children:[f.jsx("td",{style:{fontWeight:"700",fontFamily:"var(--font-mono)",color:"var(--accent-cyan)"},children:a.designator}),f.jsx("td",{children:a.type}),f.jsx("td",{style:{fontFamily:"var(--font-mono)"},children:a.user_override_value||a.detected_value}),f.jsxs("td",{style:{fontFamily:"var(--font-mono)",fontSize:"0.85rem"},children:[a.node_a," ↔ ",a.node_b]}),f.jsx("td",{style:{fontFamily:"var(--font-mono)"},children:a.type.includes("Resistor")?`${((l=r.readings)==null?void 0:l.resistor_power_mW)||47.6} mW`:`${((c=r.readings)==null?void 0:c.led_power_mW)||14.5} mW`}),f.jsx("td",{children:f.jsx("span",{className:"status-badge-ok",children:"Nominal"})})]},a.id)})})]})})]})]})}function kA(){const[t,e]=Q.useState("tutorials"),[n,i]=Q.useState(null),[r,s]=Q.useState("A15"),[o,a]=Q.useState("F15"),[l,c]=Q.useState(null),[h,d]=Q.useState(null),p=[{id:"mod-1",title:"Electronics 101: V, I, R Fundamentals",desc:"Understanding Voltage (pressure), Current (flow), and Resistance (restriction).",lessons:4,content:`
### Voltage, Current & Resistance Fundamentals

- **Voltage (V)**: The electrical potential difference between two points, measured in Volts. Think of it as water pressure pushing charges through a conductor.
- **Current (I)**: The rate of electrical charge flow, measured in Amperes (A) or Milliamperes (mA).
- **Resistance (R)**: The opposition to charge flow, measured in Ohms (Ω).

**Ohm's Law Equation**:
$$ V = I \\times R $$

**Example**: Connecting a 9V battery across a 1 kΩ resistor yields:
$$ I = \\frac{9\\text{V}}{1000\\,\\Omega} = 0.009\\text{A} = 9\\text{mA} $$
      `},{id:"mod-2",title:"Breadboard Anatomy & Tie-Point Pinouts",desc:"Mastering power rails, terminal strips, DIP sockets, and tie-point connectivity.",lessons:3,content:`
### Standard 830 Tie-Point Breadboard Layout

1. **Power Bus Rails (+ / -)**:
   - Run vertically along both outer edges.
   - All holes in a single red (+) or blue (-) rail are connected internally.
2. **Terminal Strips (Columns 1-63, Rows A-E & F-J)**:
   - Rows A, B, C, D, E in a column are connected together.
   - Rows F, G, H, I, J in a column are connected together.
3. **Center Divider Trough Channel**:
   - Isolates the top terminal strip (A-E) from the bottom terminal strip (F-J).
   - Designed specifically for straddling Dual-In-Line (DIP) IC chips.
      `},{id:"mod-3",title:"Resistor 4-Band & 5-Band Color Codes",desc:"How to read color bands, calculate multipliers, and determine tolerances.",lessons:5,content:`
### Reading Resistor Color Bands

- **4-Band Resistors**:
  - Band 1: First Significant Digit
  - Band 2: Second Significant Digit
  - Band 3: Multiplier ($10^n$)
  - Band 4: Tolerance (Gold = $\\pm 5\\%$, Silver = $\\pm 10\\%$)

**Mnemonics for Color Values**:
Black (0), Brown (1), Red (2), Orange (3), Yellow (4), Green (5), Blue (6), Violet (7), Grey (8), White (9).
      `},{id:"mod-4",title:"LEDs & Current-Limiting Resistors",desc:"Protecting Light Emitting Diodes from overcurrent burnouts.",lessons:4,content:`
### Protecting LEDs with Current-Limiting Resistors

LEDs have low internal resistance once turned on. Connecting an LED directly to a power source without a resistor will cause excessive current to destroy the LED.

**Limiting Resistor Formula**:
$$ R = \\frac{V_{\\text{supply}} - V_{\\text{LED}}}{I_{\\text{LED}}} $$

Standard Red LED ($V_{\\text{LED}} = 2.0\\text{V}$, $I_{\\text{LED}} = 20\\text{mA}$):
$$ R = \\frac{5\\text{V} - 2.0\\text{V}}{0.02\\text{A}} = 150\\,\\Omega $$
      `}],g=[{id:"cs-resistor",name:"Resistor Cheat Sheet",type:"Passive Component",details:"Limits current flow. Color band calculation, SMD 3/4-digit codes, E24 standard values, power wattage ratings (1/8W, 1/4W, 1/2W, 1W)."},{id:"cs-led",name:"LED (Light Emitting Diode)",type:"Optoelectronic",details:"Polarized component. Anode (long leg, +), Cathode (short leg, flat edge, -). Typical forward drop: Red (2.0V), Green (2.2V), Blue (3.2V)."},{id:"cs-capacitor",name:"Capacitor Cheat Sheet",type:"Energy Storage",details:"Stores electrical charge. Ceramic (non-polarized, 104 = 100nF) vs Electrolytic (polarized, long leg +, stripe -)."},{id:"cs-diode",name:"Rectifier Diode (1N4007)",type:"Semiconductor",details:"Allows current in one direction only. Silver band marks Cathode (-). Max reverse voltage 1000V, forward voltage drop 0.7V."}],x=()=>{c(r==="A15"&&o==="F15"?{success:!0,message:"Correct! Resistor R1 successfully bridges the center trough between column 15 row A and row F."}:{success:!1,message:"Incorrect placement. To bridge across the center channel, connect one pin to Rows A-E and the other to Rows F-J."})};return f.jsxs("div",{children:[f.jsxs("div",{className:"page-header",children:[f.jsxs("h1",{className:"page-title",children:[f.jsx(Xf,{size:28,style:{color:"var(--accent-cyan)"}}),"Electronics Learning Hub & Interactive Workstation"]}),f.jsx("p",{className:"page-subtitle",children:"Interactive tutorials, component cheat sheets, breadboard pinout guides, and guided circuit building exercises."})]}),f.jsx("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1.5rem",flexWrap:"wrap"},children:[{id:"tutorials",name:"Tutorial Modules",icon:Np},{id:"exercises",name:"Guided Circuit Exercises",icon:Gs},{id:"cheatsheets",name:"Component Cheat Sheets",icon:Br},{id:"pinouts",name:"Breadboard Pinout Guide",icon:Od}].map(y=>{const m=y.icon,u=t===y.id;return f.jsxs("button",{onClick:()=>e(y.id),className:"btn",style:{background:u?"rgba(56, 189, 248, 0.15)":"rgba(255,255,255,0.03)",color:u?"var(--accent-cyan)":"var(--text-muted)",border:`1px solid ${u?"var(--accent-cyan)":"var(--border-color)"}`},children:[f.jsx(m,{size:16})," ",y.name]},y.id)})}),t==="tutorials"&&f.jsx("div",{className:"card-grid",children:p.map(y=>f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[f.jsxs("div",{children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"},children:[f.jsx("div",{className:"logo-icon",children:f.jsx(Np,{size:20})}),f.jsxs("span",{className:"code-pill",children:[y.lessons," Lessons"]})]}),f.jsx("h3",{style:{fontSize:"1.15rem",marginBottom:"0.5rem"},children:y.title}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.875rem",marginBottom:"1.25rem"},children:y.desc})]}),f.jsx("button",{onClick:()=>i(y),className:"btn btn-primary",style:{width:"100%",justifyContent:"center"},children:"Read Tutorial →"})]},y.id))}),t==="exercises"&&f.jsxs("div",{className:"card-grid",style:{gridTemplateColumns:"2fr 1fr"},children:[f.jsxs("div",{className:"card",children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[f.jsxs("h2",{style:{fontSize:"1.2rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(Gs,{size:18,style:{color:"var(--accent-cyan)"}}),"Exercise 1: Bridge Resistor Across Breadboard Channel"]}),f.jsx("span",{className:"code-pill",children:"Interactive Exercise"})]}),f.jsx("p",{style:{fontSize:"0.9rem",color:"var(--text-muted)",marginBottom:"1.25rem",lineHeight:"1.6"},children:"**Objective**: Connect a 1 kΩ current-limiting resistor across the center divider channel on column 15. Place Pin 1 in Row A-E and Pin 2 in Row F-J."}),f.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"},children:[f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.8rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Resistor Pin 1 Socket"}),f.jsxs("select",{value:r,onChange:y=>s(y.target.value),className:"input-field",children:[f.jsx("option",{value:"A15",children:"A15 (Top Strip Col 15)"}),f.jsx("option",{value:"B15",children:"B15 (Top Strip Col 15)"}),f.jsx("option",{value:"C15",children:"C15 (Top Strip Col 15)"}),f.jsx("option",{value:"F15",children:"F15 (Bottom Strip Col 15)"})]})]}),f.jsxs("div",{children:[f.jsx("label",{style:{fontSize:"0.8rem",color:"var(--text-muted)",marginBottom:"0.35rem",display:"block"},children:"Resistor Pin 2 Socket"}),f.jsxs("select",{value:o,onChange:y=>a(y.target.value),className:"input-field",children:[f.jsx("option",{value:"F15",children:"F15 (Bottom Strip Col 15)"}),f.jsx("option",{value:"G15",children:"G15 (Bottom Strip Col 15)"}),f.jsx("option",{value:"H15",children:"H15 (Bottom Strip Col 15)"}),f.jsx("option",{value:"A15",children:"A15 (Top Strip Col 15)"})]})]})]}),f.jsxs("button",{onClick:x,className:"btn btn-primary",children:[f.jsx(Gf,{size:16})," Validate Placement"]}),l&&f.jsxs("div",{style:{marginTop:"1.25rem",padding:"1rem",borderRadius:"8px",background:l.success?"rgba(52, 211, 153, 0.1)":"rgba(248, 113, 113, 0.1)",border:`1px solid ${l.success?"var(--accent-emerald)":"var(--accent-rose)"}`,color:l.success?"var(--accent-emerald)":"var(--accent-rose)",fontSize:"0.9rem"},children:[l.success?"✓ ":"❌ ",l.message]})]}),f.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center"},children:[f.jsx(_S,{size:48,style:{color:"var(--accent-cyan)",margin:"0 auto 1rem"}}),f.jsx("h3",{style:{fontSize:"1.1rem",marginBottom:"0.5rem"},children:"Exercise Status"}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.85rem"},children:l!=null&&l.success?"Completed Successfully!":"Pending Validation"})]})]}),t==="cheatsheets"&&f.jsx("div",{className:"card-grid",children:g.map(y=>f.jsxs("div",{className:"card",children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"},children:[f.jsx("div",{className:"logo-icon",children:f.jsx(Br,{size:18})}),f.jsx("span",{className:"code-pill",children:y.type})]}),f.jsx("h3",{style:{fontSize:"1.15rem",marginBottom:"0.5rem"},children:y.name}),f.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.85rem",marginBottom:"1.25rem",lineHeight:"1.6"},children:y.details}),f.jsx("button",{onClick:()=>d(y),className:"btn btn-secondary",style:{width:"100%",justifyContent:"center"},children:"Inspect Specs →"})]},y.id))}),t==="pinouts"&&f.jsxs("div",{className:"card",children:[f.jsxs("h2",{style:{fontSize:"1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[f.jsx(Od,{size:20,style:{color:"var(--accent-cyan)"}}),"Standard 830 Tie-Point Breadboard Pinout Reference"]}),f.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",gap:"1rem",marginBottom:"1.5rem"},children:[f.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.3)",padding:"1rem",borderRadius:"8px"},children:[f.jsx("h4",{style:{color:"#f87171",fontSize:"0.95rem",marginBottom:"0.35rem"},children:"Red Rail (+ VCC)"}),f.jsx("p",{style:{fontSize:"0.825rem",color:"var(--text-muted)"},children:"Positive DC supply rail. All holes along the red line are connected vertically."})]}),f.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.08)",border:"1px solid rgba(59, 130, 246, 0.3)",padding:"1rem",borderRadius:"8px"},children:[f.jsx("h4",{style:{color:"#60a5fa",fontSize:"0.95rem",marginBottom:"0.35rem"},children:"Blue Rail (- GND)"}),f.jsx("p",{style:{fontSize:"0.825rem",color:"var(--text-muted)"},children:"Ground reference rail (0V). Connected vertically along the blue line."})]}),f.jsxs("div",{style:{background:"rgba(56, 189, 248, 0.08)",border:"1px solid var(--border-color)",padding:"1rem",borderRadius:"8px"},children:[f.jsx("h4",{style:{color:"var(--accent-cyan)",fontSize:"0.95rem",marginBottom:"0.35rem"},children:"Terminal Strips A-E & F-J"}),f.jsx("p",{style:{fontSize:"0.825rem",color:"var(--text-muted)"},children:"Holes in the same column (1-63) are connected horizontally across 5 tie-points."})]})]})]}),n&&f.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"},children:f.jsxs("div",{className:"card",style:{maxWidth:"650px",width:"100%",maxHeight:"85vh",overflowY:"auto",border:"1px solid var(--accent-cyan)"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",borderBottom:"1px solid var(--border-color)",paddingBottom:"0.75rem"},children:[f.jsx("h2",{style:{fontSize:"1.25rem",color:"var(--accent-cyan)"},children:n.title}),f.jsx("button",{onClick:()=>i(null),className:"btn btn-secondary",style:{padding:"0.25rem 0.5rem"},children:f.jsx(Up,{size:18})})]}),f.jsx("div",{style:{fontSize:"0.925rem",lineHeight:"1.7",color:"var(--text-main)",whiteSpace:"pre-line"},children:n.content}),f.jsx("div",{style:{marginTop:"1.5rem",paddingTop:"1rem",borderTop:"1px solid var(--border-color)",textAlign:"right"},children:f.jsx("button",{onClick:()=>i(null),className:"btn btn-primary",children:"Close Lesson"})})]})}),h&&f.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"},children:f.jsxs("div",{className:"card",style:{maxWidth:"550px",width:"100%",border:"1px solid var(--accent-cyan)"},children:[f.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",borderBottom:"1px solid var(--border-color)",paddingBottom:"0.75rem"},children:[f.jsx("h2",{style:{fontSize:"1.2rem",color:"var(--accent-cyan)"},children:h.name}),f.jsx("button",{onClick:()=>d(null),className:"btn btn-secondary",style:{padding:"0.25rem 0.5rem"},children:f.jsx(Up,{size:18})})]}),f.jsx("p",{style:{fontSize:"0.9rem",lineHeight:"1.6",color:"var(--text-main)",marginBottom:"1.25rem"},children:h.details}),f.jsx("div",{style:{textAlign:"right"},children:f.jsx("button",{onClick:()=>d(null),className:"btn btn-primary",children:"Close Specs"})})]})})]})}function zA(){return f.jsx(FS,{children:f.jsx(cS,{children:f.jsx(OS,{children:f.jsxs(tS,{children:[f.jsx(Di,{path:"/",element:f.jsx(kS,{})}),f.jsx(Di,{path:"/scanner",element:f.jsx(wA,{})}),f.jsx(Di,{path:"/analysis",element:f.jsx(PA,{})}),f.jsx(Di,{path:"/simulator",element:f.jsx(LA,{})}),f.jsx(Di,{path:"/calculator",element:f.jsx(IA,{})}),f.jsx(Di,{path:"/results",element:f.jsx(FA,{})}),f.jsx(Di,{path:"/learn",element:f.jsx(kA,{})})]})})})})}zu.createRoot(document.getElementById("root")).render(f.jsx(Dg.StrictMode,{children:f.jsx(zA,{})}));
