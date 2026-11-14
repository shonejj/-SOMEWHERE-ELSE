import{$n as e,A as t,An as n,B as r,C as i,Cn as a,Ct as o,D as s,Dn as c,Dt as l,E as u,En as d,Et as f,F as p,Fn as m,Gn as h,H as g,I as _,In as v,J as y,Jn as b,K as x,Kn as S,L as C,Ln as w,M as T,Mn as E,N as D,Nn as O,Nt as k,O as A,On as j,P as M,Pn as ee,Pt as te,Q as ne,Qn as re,R as ie,Rn as N,S as ae,St as oe,T as se,Tn as ce,Tt as le,U as ue,Un as de,V as fe,Vn as pe,W as me,Wn as he,X as P,Xn as ge,Y as _e,Yn as ve,Z as ye,Zn as be,_ as xe,_n as Se,_t as Ce,a as we,ar as Te,at as Ee,b as F,bt as De,cr as Oe,ct as ke,d as Ae,dn as je,dr as Me,dt as I,er as Ne,et as Pe,f as Fe,fn as Ie,fr as Le,ft as Re,g as L,gn as ze,gt as R,hn as Be,ht as Ve,i as z,ir as He,it as Ue,j as B,jn as V,k as We,kt as Ge,l as Ke,lr as qe,lt as Je,m as Ye,mn as Xe,mt as Ze,n as H,nr as Qe,nt as $e,o as U,or as et,ot as tt,p as nt,pn as rt,pr as it,pt as at,q as ot,qn as W,r as st,rr as ct,rt as lt,s as ut,sr as dt,st as ft,t as pt,tr as mt,tt as ht,u as gt,un as _t,ur as vt,ut as yt,v as bt,vn as xt,vt as St,w as Ct,wn as wt,wt as Tt,x as Et,xt as Dt,y as Ot,yt as kt,z as At,zn as jt}from"./index-DJPbmWiy.js";function Mt(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Nt(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Pt={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
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
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
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
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
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
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
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
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
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
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
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
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
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
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
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
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
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
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
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
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
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
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
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
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
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
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
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
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
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
		return 0.5 / max( gv + gl, EPSILON );
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
		float roughness = max( material.clearcoatRoughness, 0.045 );
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
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
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
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
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
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
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
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
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
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#ifdef DOUBLE_SIDED
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
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
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
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
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
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
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
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
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
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
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
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
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
vec3 CineonToneMapping( vec3 color ) {
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
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
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
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
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
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
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
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
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
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
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
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
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
}`,depth_frag:`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
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
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
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
}`,linedashed_frag:`uniform vec3 diffuse;
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
}`,meshbasic_vert:`#include <common>
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
}`,meshbasic_frag:`uniform vec3 diffuse;
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
}`,meshlambert_vert:`#define LAMBERT
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
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,meshmatcap_vert:`#define MATCAP
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
}`,meshmatcap_frag:`#define MATCAP
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
}`,meshnormal_vert:`#define NORMAL
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
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
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
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,meshphysical_vert:`#define STANDARD
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
}`,meshphysical_frag:`#define STANDARD
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
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,meshtoon_vert:`#define TOON
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
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,points_vert:`uniform float size;
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
}`,points_frag:`uniform vec3 diffuse;
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
}`,shadow_vert:`#include <common>
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
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
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
}`,sprite_frag:`uniform vec3 diffuse;
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
}`},G={common:{diffuse:{value:new F(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new W(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new F(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new F(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new F(16777215)},opacity:{value:1},center:{value:new W(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},Ft={basic:{uniforms:dt([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.fog]),vertexShader:Pt.meshbasic_vert,fragmentShader:Pt.meshbasic_frag},lambert:{uniforms:dt([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new F(0)},envMapIntensity:{value:1}}]),vertexShader:Pt.meshlambert_vert,fragmentShader:Pt.meshlambert_frag},phong:{uniforms:dt([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new F(0)},specular:{value:new F(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Pt.meshphong_vert,fragmentShader:Pt.meshphong_frag},standard:{uniforms:dt([G.common,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.roughnessmap,G.metalnessmap,G.fog,G.lights,{emissive:{value:new F(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Pt.meshphysical_vert,fragmentShader:Pt.meshphysical_frag},toon:{uniforms:dt([G.common,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.gradientmap,G.fog,G.lights,{emissive:{value:new F(0)}}]),vertexShader:Pt.meshtoon_vert,fragmentShader:Pt.meshtoon_frag},matcap:{uniforms:dt([G.common,G.bumpmap,G.normalmap,G.displacementmap,G.fog,{matcap:{value:null}}]),vertexShader:Pt.meshmatcap_vert,fragmentShader:Pt.meshmatcap_frag},points:{uniforms:dt([G.points,G.fog]),vertexShader:Pt.points_vert,fragmentShader:Pt.points_frag},dashed:{uniforms:dt([G.common,G.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Pt.linedashed_vert,fragmentShader:Pt.linedashed_frag},depth:{uniforms:dt([G.common,G.displacementmap]),vertexShader:Pt.depth_vert,fragmentShader:Pt.depth_frag},normal:{uniforms:dt([G.common,G.bumpmap,G.normalmap,G.displacementmap,{opacity:{value:1}}]),vertexShader:Pt.meshnormal_vert,fragmentShader:Pt.meshnormal_frag},sprite:{uniforms:dt([G.sprite,G.fog]),vertexShader:Pt.sprite_vert,fragmentShader:Pt.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Pt.background_vert,fragmentShader:Pt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:Pt.backgroundCube_vert,fragmentShader:Pt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Pt.cube_vert,fragmentShader:Pt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Pt.equirect_vert,fragmentShader:Pt.equirect_frag},distance:{uniforms:dt([G.common,G.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Pt.distance_vert,fragmentShader:Pt.distance_frag},shadow:{uniforms:dt([G.lights,G.fog,{color:{value:new F(0)},opacity:{value:1}}]),vertexShader:Pt.shadow_vert,fragmentShader:Pt.shadow_frag}};Ft.physical={uniforms:dt([Ft.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new W(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new F(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new W},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new F(0)},specularColor:{value:new F(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new W},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:Pt.meshphysical_vert,fragmentShader:Pt.meshphysical_frag};var It={r:0,b:0,g:0},Lt=new yt,Rt=new Je;Rt.set(-1,0,0,0,1,0,0,0,1);function zt(t,n,r,i,a,o){let s=new F(0),c=a===!0?0:1,l,u,f=null,p=0,m=null;function h(e){let t=e.isScene===!0?e.background:null;if(t&&t.isTexture){let r=e.backgroundBlurriness>0;t=n.get(t,r)}return t}function g(e){let n=!1,i=h(e);i===null?v(s,c):i&&i.isColor&&(v(i,1),n=!0);let a=t.xr.getEnvironmentBlendMode();a===`additive`?r.buffers.color.setClear(0,0,0,1,o):a===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(t.autoClear||n)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function _(n,r){let a=h(r);a&&a.isCubeTexture?(u===void 0&&(u=new I(new Fe(1,1,1),new d({name:`BackgroundCubeMaterial`,uniforms:e(Ft.backgroundCube.uniforms),vertexShader:Ft.backgroundCube.vertexShader,fragmentShader:Ft.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=a,u.material.uniforms.backgroundBlurriness.value=r.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=r.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Lt.makeRotationFromEuler(r.backgroundRotation)).transpose(),a.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(Rt),u.material.toneMapped=Et.getTransfer(a.colorSpace)!==wt,(f!==a||p!==a.version||m!==t.toneMapping)&&(u.material.needsUpdate=!0,f=a,p=a.version,m=t.toneMapping),u.layers.enableAll(),n.unshift(u,u.geometry,u.material,0,0,null)):a&&a.isTexture&&(l===void 0&&(l=new I(new Tt(2,2),new d({name:`BackgroundMaterial`,uniforms:e(Ft.background.uniforms),vertexShader:Ft.background.vertexShader,fragmentShader:Ft.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=a,l.material.uniforms.backgroundIntensity.value=r.backgroundIntensity,l.material.toneMapped=Et.getTransfer(a.colorSpace)!==wt,a.matrixAutoUpdate===!0&&a.updateMatrix(),l.material.uniforms.uvTransform.value.copy(a.matrix),(f!==a||p!==a.version||m!==t.toneMapping)&&(l.material.needsUpdate=!0,f=a,p=a.version,m=t.toneMapping),l.layers.enableAll(),n.unshift(l,l.geometry,l.material,0,0,null))}function v(e,n){e.getRGB(It,Te(t)),r.buffers.color.setClear(It.r,It.g,It.b,n,o)}function y(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,v(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,v(s,c)},render:g,addToRenderList:_,dispose:y}}function Bt(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Vt(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ht(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(qe(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&qe(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&qe(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Ut(e){let t=this,n=null,r=0,i=!1,a=!1,s=new o,c=new Je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=d(e,t,0)},this.setState=function(t,o,s){let c=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||c===null||c.length===0||a&&!p)a?d(null):u();else{let e=a?0:r,t=e*4,i=m.clippingState||null;l.value=i,i=d(c,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function u(){l.value!==n&&(l.value=n,l.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function d(e,n,r,i){let a=e===null?0:e.length,o=null;if(a!==0){if(o=l.value,i!==!0||o===null){let t=r+a*4,i=n.matrixWorldInverse;c.getNormalMatrix(i),(o===null||o.length<t)&&(o=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)s.copy(e[t]).applyMatrix4(i,c),s.normal.toArray(o,n),o[n+3]=s.constant}l.value=o,l.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,o}}var Wt=class extends be{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new se(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Fe(5,5,5),o=new d({name:`CubemapFromEquirect`,uniforms:e(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:1,blending:0});o.uniforms.tEquirect.value=n;let s=new I(a,o),c=n.minFilter;return n.minFilter===1008&&(n.minFilter=lt),new i(1,10,this).update(t,s),n.minFilter=c,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},Gt=256,Kt=3,qt=20,Jt=256,Yt=16,Xt=3,Zt=new b,Qt=new F,$t=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new i(1,10,null),this._boxMesh=new I(new Fe(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,a={}){let{size:o=256,position:s=Zt}=a,c=this._renderer;this._setSize(o);let l=this._allocateTarget(),u=this._getSourceTarget(!0);t>0&&(u.texture.mipmapsAutoUpdate=!1);let d=c.autoClear,f=c.autoClearColor,p=c.autoClearDepth,m=c.autoClearStencil,h=e.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,h===null&&(e.background=c.getClearColor(Qt));let g=new i(n,r,u);return g.position.copy(s),g.update(c,e),c.autoClear=d,c.autoClearColor=f,c.autoClearDepth=p,c.autoClearStencil=m,e.background=h,t>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sn(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=on(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Gt,ct(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?Gt:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=en(e,!1,!1),n=Math.log2(e)-Kt;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=en(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=sn()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=on()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=nn(),this._integrationMaterial=rn());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/Yt);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-Xt)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(Jt*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=an());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function en(e,t,n){return new Wt(e,{minFilter:Ue,generateMipmaps:t,type:ot,colorSpace:tt,depthBuffer:n})}function tn(e,t,n){return new d({name:e,uniforms:t,vertexShader:Pt.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function nn(){return tn(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Jt}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function rn(){return tn(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Yt}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function an(){return tn(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${qt}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function on(){return tn(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function sn(){return tn(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function cn(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Wt(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new $t(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new $t(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function ln(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&vt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function un(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?w:v)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function dn(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function fn(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:Qe(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function pn(e,t,n){let r=new WeakMap,i=new ve;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new A(h,p,m,u);g.type=fe,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new W(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function mn(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var hn={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function gn(e,t,n,i,a,o){let s=new be(t,n,{type:e,depthBuffer:a,stencilBuffer:o,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),c=null,l=null,u=null,d=new Ye;d.setAttribute(`position`,new r([-1,3,0,-1,-1,0,3,-1,0],3)),d.setAttribute(`uv`,new r([0,2,0,0,2,0],2));let f=new Ie({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new I(d,f),m=new Dt(-1,1,1,-1,0,1),h=null,g=null,_=!1,v,y=null,b=[],x=!1;this.setSize=function(e,t){s.setSize(e,t),c!==null&&c.setSize(e,t),l!==null&&l.setSize(e,t);for(let n=0;n<b.length;n++){let r=b[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){b=e,x=b.length>0&&b[0].isRenderPass===!0;let t=s.width,n=s.height;b.length>0&&c===null&&(c=new be(t,n,{type:ot,depthBuffer:!1,stencilBuffer:!1}),l=new be(t,n,{type:ot,depthBuffer:!1,stencilBuffer:!1}));let r=a===!0&&b.some(e=>e.needsDepthTexture===!0);r!==(s.depthTexture!==null)&&(r===!0&&u===null&&(u=new D(t,n),o===!0&&(u.format=T,u.type=pe)),s.dispose(),s.depthTexture=r?u:null,s.resolveDepthBuffer=r,s.storeMultisampledDepthBuffer=r);for(let e=0;e<b.length;e++){let i=b[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(u)}},this.begin=function(e,t){if(_||e.toneMapping===0&&b.length===0)return!1;if(y=t,t!==null){let e=t.width,n=t.height;(s.width!==e||s.height!==n)&&this.setSize(e,n)}return x===!1&&e.setRenderTarget(s),v=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return x},this.end=function(e,t){e.toneMapping=v,_=!0;let n=s,r=c;for(let i=0;i<b.length;i++){let a=b[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===c?l:c))}if(h!==e.outputColorSpace||g!==e.toneMapping){h=e.outputColorSpace,g=e.toneMapping,f.defines={},Et.getTransfer(h)===`srgb`&&(f.defines.SRGB_TRANSFER=``);let t=hn[g];t&&(f.defines[t]=``),f.needsUpdate=!0}f.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(y),e.render(p,m),y=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){s.dispose(),c!==null&&c.dispose(),l!==null&&l.dispose(),d.dispose(),f.dispose()}}var _n=new O,vn=new D(1,1),yn=new Ct(1),bn=new A,xn=new s,Sn=new se,Cn=[],wn=[],Tn=new Float32Array(16),En=new Float32Array(9),Dn=new Float32Array(4);function On(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Cn[i];if(a===void 0&&(a=new Float32Array(i),Cn[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function kn(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function An(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function jn(e,t){let n=wn[t];n===void 0&&(n=new Int32Array(t),wn[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Mn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Nn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(kn(n,t))return;e.uniform2fv(this.addr,t),An(n,t)}}function Pn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(kn(n,t))return;e.uniform3fv(this.addr,t),An(n,t)}}function Fn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(kn(n,t))return;e.uniform4fv(this.addr,t),An(n,t)}}function In(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(kn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),An(n,t)}else{if(kn(n,r))return;Dn.set(r),e.uniformMatrix2fv(this.addr,!1,Dn),An(n,r)}}function Ln(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(kn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),An(n,t)}else{if(kn(n,r))return;En.set(r),e.uniformMatrix3fv(this.addr,!1,En),An(n,r)}}function Rn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(kn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),An(n,t)}else{if(kn(n,r))return;Tn.set(r),e.uniformMatrix4fv(this.addr,!1,Tn),An(n,r)}}function zn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Bn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(kn(n,t))return;e.uniform2iv(this.addr,t),An(n,t)}}function Vn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(kn(n,t))return;e.uniform3iv(this.addr,t),An(n,t)}}function Hn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(kn(n,t))return;e.uniform4iv(this.addr,t),An(n,t)}}function Un(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Wn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(kn(n,t))return;e.uniform2uiv(this.addr,t),An(n,t)}}function Gn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(kn(n,t))return;e.uniform3uiv(this.addr,t),An(n,t)}}function Kn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(kn(n,t))return;e.uniform4uiv(this.addr,t),An(n,t)}}function qn(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function Jn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?qn(vn):_n,n.setTexture2D(t||a,i)}function Yn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||xn,i)}function Xn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?qn(yn):Sn,n.setTextureCube(t||a,i)}function Zn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||bn,i)}function Qn(e){switch(e){case 5126:return Mn;case 35664:return Nn;case 35665:return Pn;case 35666:return Fn;case 35674:return In;case 35675:return Ln;case 35676:return Rn;case 5124:case 35670:return zn;case 35667:case 35671:return Bn;case 35668:case 35672:return Vn;case 35669:case 35673:return Hn;case 5125:return Un;case 36294:return Wn;case 36295:return Gn;case 36296:return Kn;case 35678:case 36198:case 36298:case 36306:case 35682:return Jn;case 35679:case 36299:case 36307:return Yn;case 35680:case 36300:case 36308:case 36293:return Xn;case 36289:case 36303:case 36311:case 36292:return Zn}}function $n(e,t){e.uniform1fv(this.addr,t)}function er(e,t){let n=On(t,this.size,2);e.uniform2fv(this.addr,n)}function tr(e,t){let n=On(t,this.size,3);e.uniform3fv(this.addr,n)}function nr(e,t){let n=On(t,this.size,4);e.uniform4fv(this.addr,n)}function rr(e,t){let n=On(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function ir(e,t){let n=On(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ar(e,t){let n=On(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function or(e,t){e.uniform1iv(this.addr,t)}function sr(e,t){e.uniform2iv(this.addr,t)}function cr(e,t){e.uniform3iv(this.addr,t)}function lr(e,t){e.uniform4iv(this.addr,t)}function ur(e,t){e.uniform1uiv(this.addr,t)}function dr(e,t){e.uniform2uiv(this.addr,t)}function fr(e,t){e.uniform3uiv(this.addr,t)}function pr(e,t){e.uniform4uiv(this.addr,t)}function mr(e,t,n){let r=this.cache,i=t.length,a=jn(n,i);kn(r,a)||(e.uniform1iv(this.addr,a),An(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?qn(vn):_n;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function hr(e,t,n){let r=this.cache,i=t.length,a=jn(n,i);kn(r,a)||(e.uniform1iv(this.addr,a),An(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||xn,a[e])}function gr(e,t,n){let r=this.cache,i=t.length,a=jn(n,i);kn(r,a)||(e.uniform1iv(this.addr,a),An(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?qn(yn):Sn;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function _r(e,t,n){let r=this.cache,i=t.length,a=jn(n,i);kn(r,a)||(e.uniform1iv(this.addr,a),An(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||bn,a[e])}function vr(e){switch(e){case 5126:return $n;case 35664:return er;case 35665:return tr;case 35666:return nr;case 35674:return rr;case 35675:return ir;case 35676:return ar;case 5124:case 35670:return or;case 35667:case 35671:return sr;case 35668:case 35672:return cr;case 35669:case 35673:return lr;case 5125:return ur;case 36294:return dr;case 36295:return fr;case 36296:return pr;case 35678:case 36198:case 36298:case 36306:case 35682:return mr;case 35679:case 36299:case 36307:return hr;case 35680:case 36300:case 36308:case 36293:return gr;case 36289:case 36303:case 36311:case 36292:return _r}}var yr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Qn(t.type)}},br=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=vr(t.type)}},xr=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Sr=/(\w+)(\])?(\[|\.)?/g;function Cr(e,t){e.seq.push(t),e.map[t.id]=t}function wr(e,t,n){let r=e.name,i=r.length;for(Sr.lastIndex=0;;){let a=Sr.exec(r),o=Sr.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Cr(n,l===void 0?new yr(s,e,t):new br(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new xr(s),Cr(n,e)),n=e}}}var Tr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);wr(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Er(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Dr=37297,Or=0;function kr(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Ar=new Je;function jr(e){Et._getMatrix(Ar,Et.workingColorSpace,e);let t=`mat3( ${Ar.elements.map(e=>e.toFixed(4))} )`;switch(Et.getTransfer(e)){case ft:return[t,`LinearTransferOETF`];case wt:return[t,`sRGBTransferOETF`];default:return qe(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Mr(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+kr(e.getShaderSource(t),r)}return i}function Nr(e,t){let n=jr(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var Pr={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Fr(e,t){let n=Pr[t];return n===void 0?(qe(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ir=new b;function Lr(){return Et.getLuminanceCoefficients(Ir),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ir.x.toFixed(4)}, ${Ir.y.toFixed(4)}, ${Ir.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Rr(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Vr).join(`
`)}function zr(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Br(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Vr(e){return e!==``}function Hr(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Ur(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Wr=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gr(e){return e.replace(Wr,Kr)}function Kr(e,t){let n=Pt[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return Gr(n)}var qr=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jr(e){return e.replace(qr,Yr)}function Yr(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Xr(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Zr={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Qr(e){return Zr[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var $r={302:`ENVMAP_MODE_REFRACTION`};function ei(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:$r[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ti={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function ni(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ti[e.combine]||`ENVMAP_BLENDING_NONE`}function ri(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Qr(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=ei(n),d=ni(n),f=Rr(n),p=zr(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Vr).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Vr).join(`
`),g.length>0&&(g+=`
`)):(h=[Xr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Vr).join(`
`),g=[Xr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Pt.tonemapping_pars_fragment,n.toneMapping===0?``:Fr(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Pt.colorspace_pars_fragment,Nr(`linearToOutputTexel`,n.outputColorSpace),Lr(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Vr).join(`
`)),o=Gr(o),o=Hr(o,n),o=Ur(o,n),s=Gr(s),s=Hr(s,n),s=Ur(s,n),o=Jr(o),s=Jr(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=Er(i,i.VERTEX_SHADER,v),x=Er(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=Mr(i,b,`vertex`),n=Mr(i,x,`fragment`);Qe(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):qe(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Tr(i,m),w=Br(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,Dr)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Or++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var ii=0,ai=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new oi(e),t.set(e,n)),n}},oi=class{constructor(e){this.id=ii++,this.code=e,this.usedTimes=0}};function si(e){return e===1030||e===37490||e===36285}function ci(e,t,n,r,i,a){let o=new ht,s=new ai,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&qe(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=Ft[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,ee=m.isBatchedMesh===!0,te=!!i.map,ne=!!i.matcap,re=!!b,ie=re&&b.isPMREMTexture===!0,N=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,se=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,ue=!!i.metalnessMap,de=!!i.roughnessMap,fe=i.anisotropy>0,pe=i.clearcoat>0,me=i.diffuseRoughness>0,he=i.dispersion>0,P=i.retroreflectivity>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=fe&&!!i.anisotropyMap,be=pe&&!!i.clearcoatMap,xe=pe&&!!i.clearcoatNormalMap,Se=pe&&!!i.clearcoatRoughnessMap,Ce=me&&!!i.diffuseRoughnessMap,we=ge&&!!i.iridescenceMap,Te=ge&&!!i.iridescenceThicknessMap,Ee=_e&&!!i.sheenColorMap,F=_e&&!!i.sheenRoughnessMap,De=!!i.specularMap,Oe=!!i.specularColorMap,ke=!!i.specularIntensityMap,Ae=ve&&!!i.transmissionMap,je=ve&&!!i.thicknessMap,Me=!!i.gradientMap,I=!!i.alphaMap,Ne=i.alphaTest>0,Pe=!!i.alphaHash,Fe=!!i.extensions,Ie=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ie=e.toneMapping);let Le=ie?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Re={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:ee,batchingColor:ee&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Et.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:te,matcap:ne,envMap:re,envMapMode:re&&b.mapping,envMapPMREM:ie,envMapMaxLod:ie?Le.length-1:null,envMapSize:ie?Le[0].width:null,aoMap:N,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:se&&i.normalMapType===1,normalMapTangentSpace:se&&i.normalMapType===0,packedNormalMap:se&&i.normalMapType===0&&si(i.normalMap.format),metalnessMap:ue,roughnessMap:de,anisotropy:fe,anisotropyMap:ye,clearcoat:pe,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,diffuseRoughness:me,diffuseRoughnessMap:Ce,dispersion:he,retroreflection:P,iridescence:ge,iridescenceMap:we,iridescenceThicknessMap:Te,sheen:_e,sheenColorMap:Ee,sheenRoughnessMap:F,specularMap:De,specularColorMap:Oe,specularIntensityMap:ke,transmission:ve,transmissionMap:Ae,thicknessMap:je,gradientMap:Me,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:I,alphaTest:Ne,alphaHash:Pe,combine:i.combine,mapUv:te&&p(i.map.channel),aoMapUv:N&&p(i.aoMap.channel),lightMapUv:ae&&p(i.lightMap.channel),bumpMapUv:oe&&p(i.bumpMap.channel),normalMapUv:se&&p(i.normalMap.channel),displacementMapUv:ce&&p(i.displacementMap.channel),emissiveMapUv:le&&p(i.emissiveMap.channel),metalnessMapUv:ue&&p(i.metalnessMap.channel),roughnessMapUv:de&&p(i.roughnessMap.channel),anisotropyMapUv:ye&&p(i.anisotropyMap.channel),clearcoatMapUv:be&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:Ce&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:we&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:F&&p(i.sheenRoughnessMap.channel),specularMapUv:De&&p(i.specularMap.channel),specularColorMapUv:Oe&&p(i.specularColorMap.channel),specularIntensityMapUv:ke&&p(i.specularIntensityMap.channel),transmissionMapUv:Ae&&p(i.transmissionMap.channel),thicknessMapUv:je&&p(i.thicknessMap.channel),alphaMapUv:I&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(se||fe),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(te||I),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&se===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ie,decodeVideoTexture:te&&i.map.isVideoTexture===!0&&Et.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&Et.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Fe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Fe&&i.extensions.multiDraw===!0||ee)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Re.vertexUv1s=c.has(1),Re.vertexUv2s=c.has(2),Re.vertexUv3s=c.has(3),c.clear(),Re}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Ft[t];n=N.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new ri(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function li(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function ui(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function di(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function fi(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||ui),r.length>1&&r.sort(t||di),i.length>1&&i.sort(t||di)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function pi(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new fi,e.set(t,[i])):n>=r.length?(i=new fi,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function mi(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new b,color:new F};break;case`SpotLight`:n={position:new b,direction:new b,color:new F,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new b,color:new F,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new b,skyColor:new F,groundColor:new F};break;case`RectAreaLight`:n={color:new F,position:new b,halfWidth:new b,halfHeight:new b}}return e[t.id]=n,n}}}function hi(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var gi=0;function _i(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function vi(e){let t=new mi,n=hi(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new b);let i=new b,a=new yt,o=new yt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(_i);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=G.LTC_FLOAT_1,r.rectAreaLTC2=G.LTC_FLOAT_2):(r.rectAreaLTC1=G.LTC_HALF_1,r.rectAreaLTC2=G.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=gi++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function yi(e){let t=new vi(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function bi(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new yi(e),t.set(n,[a])):r>=i.length?(a=new yi(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var xi=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Si=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Ci=[new b(1,0,0),new b(-1,0,0),new b(0,1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1)],wi=[new b(0,-1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1),new b(0,-1,0),new b(0,-1,0)],Ti=new yt,Ei=new b,Di=new b;function Oi(e,t,n){let r=new ue,i=new W,a=new W,o=new ve,s=new at,c=new Ze,l={},u=n.maxTextureSize,f={0:1,1:0,2:2},p=new d({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new W},radius:{value:4}},vertexShader:xi,fragmentShader:Si}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new Ye;h.setAttribute(`position`,new nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new I(h,p),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let v=this.type;this.render=function(t,n,s){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||t.length===0)return;this.type===2&&(qe(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=v!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){qe(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){qe(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new be(i.x,i.y,{format:_t,type:ot,minFilter:lt,magFilter:lt,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new D(i.x,i.y,fe),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=B,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=St,d.map.depthTexture.magFilter=St}else l.isPointLight?(d.map=new Wt(i.x),d.map.depthTexture=new Ct(i.x,de)):(d.map=new be(i.x,i.y),d.map.depthTexture=new D(i.x,i.y,de)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=B,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=lt,d.map.depthTexture.magFilter=lt):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=St,d.map.depthTexture.magFilter=St);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Ei.setFromMatrixPosition(l.matrixWorld),e.position.copy(Ei),Di.copy(e.position),Di.add(Ci[t]),e.up.copy(wi[t]),e.lookAt(Di),e.updateMatrixWorld(),n.makeTranslation(-Ei.x,-Ei.y,-Ei.z),Ti.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Ti,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),x(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&y(d,s),d.needsUpdate=!1}v=this.type,_.needsUpdate=!1,e.setRenderTarget(c,l,d)};function y(n,r){let a=t.update(g);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null?n.mapPass=new be(i.x,i.y,{format:_t,type:ot}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),p.uniforms.shadow_pass.value=n.map.depthTexture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,p,g,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,g,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=b(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)x(l[e],i,a,o,s,c)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function ki(e,t){function n(){let t=!1,n=new ve,r=null,i=new ve(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ue(e.DEPTH_TEST):de(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Se[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ue(e.STENCIL_TEST):de(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new F(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ee=!1,te=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),ee=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(ne)[1]),ee=te>=1);let re=null,ie={},N=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new ve().fromArray(N),se=new ve().fromArray(ae);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ue(e.DEPTH_TEST),o.setFunc(3),ye(!1),be(1),ue(e.CULL_FACE),ge(0);function ue(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function de(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function fe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function pe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function me(t){return h!==t&&(e.useProgram(t),h=t,!0)}let he={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};he[103]=e.MIN,he[104]=e.MAX;let P={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(de(e.BLEND),g=!1);else if(g===!1&&(ue(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Qe(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:Qe(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:Qe(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:Qe(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(he[n],he[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(P[r],P[i],P[o],P[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?de(e.CULL_FACE):ue(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ye(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Ce(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ue(e.SAMPLE_ALPHA_TO_COVERAGE):de(e.SAMPLE_ALPHA_TO_COVERAGE)}function ye(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function be(t){t===0?de(e.CULL_FACE):(ue(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function xe(t){t!==k&&(ee&&e.lineWidth(t),k=t)}function Ce(t,n,r){t?(ue(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):de(e.POLYGON_OFFSET_FILL)}function we(t){t?ue(e.SCISSOR_TEST):de(e.SCISSOR_TEST)}function Te(t){t===void 0&&(t=e.TEXTURE0+M-1),re!==t&&(e.activeTexture(t),re=t)}function Ee(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+M-1:re);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function De(){let t=ie[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Oe(){try{e.compressedTexImage2D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function ke(){try{e.compressedTexImage3D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function Ae(){try{e.texSubImage2D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function je(){try{e.texSubImage3D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function Me(){try{e.compressedTexSubImage2D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function I(){try{e.compressedTexSubImage3D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function Ne(){try{e.texStorage2D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function Pe(){try{e.texStorage3D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function Fe(){try{e.texImage2D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function Ie(){try{e.texImage3D(...arguments)}catch(e){Qe(`WebGLState:`,e)}}function Le(t){return d[t]===void 0?e.getParameter(t):d[t]}function Re(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function L(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function ze(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function R(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Be(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Ve(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},re=null,ie={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new F(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ue,disable:de,bindFramebuffer:fe,drawBuffers:pe,useProgram:me,setBlending:ge,setMaterial:_e,setFlipSided:ye,setCullFace:be,setLineWidth:xe,setPolygonOffset:Ce,setScissorTest:we,activeTexture:Te,bindTexture:Ee,unbindTexture:De,compressedTexImage2D:Oe,compressedTexImage3D:ke,texImage2D:Fe,texImage3D:Ie,pixelStorei:Re,getParameter:Le,updateUBOMapping:R,uniformBlockBinding:Be,texStorage2D:Ne,texStorage3D:Pe,texSubImage2D:Ae,texSubImage3D:je,compressedTexSubImage2D:Me,compressedTexSubImage3D:I,scissor:L,viewport:ze,reset:Ve}}function Ai(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new W,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):mt(`canvas`)}function v(e,t,n){let r=1,i=Pe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),qe(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&qe(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];qe(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||qe(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?ft:Et.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,qe(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function E(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function D(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function O(e){A(e.target)}function k(e){j(e.target)}function A(e){e.removeEventListener(`dispose`,O),D(e),ee(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function j(e){e.removeEventListener(`dispose`,k),D(e),ne(e)}function M(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?j(t):A(t))}m.clear(),d.clear()}function ee(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&te(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function te(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ne(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&A(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let re=0;function ie(){re=0}function N(){return re}function ae(e){re=e}function oe(){let e=re;return e>=i.maxTextures&&qe(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),re+=1,e}function se(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ce(t,i){let a=r.get(t);if(t.isVideoTexture&&I(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)qe(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)qe(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ve(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function le(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ve(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function ue(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ve(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function de(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?ye(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let fe={[ze]:e.REPEAT,[Ot]:e.CLAMP_TO_EDGE,[Ce]:e.MIRRORED_REPEAT},pe={[St]:e.NEAREST,[De]:e.NEAREST_MIPMAP_NEAREST,[kt]:e.NEAREST_MIPMAP_LINEAR,[lt]:e.LINEAR,[Ee]:e.LINEAR_MIPMAP_NEAREST,[Ue]:e.LINEAR_MIPMAP_LINEAR},me={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function he(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&qe(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,fe[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,fe[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,fe[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,pe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,pe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,me[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function P(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,O),E(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=se(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&te(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ge(e,t,n){return Math.floor(Math.floor(e/n)/t)}function _e(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ge(n.start,r.width,4),c=ge(t.start,r.width,4);n.start<=i+1&&a===c&&ge(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ve(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=P(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Et.getPrimaries(Et.workingColorSpace),r=o.colorSpace===``?null:Et.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=Ne(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);he(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,E=u.dataReady,D=w(o,t);if(o.isDepthTexture)m=C(o.format===T,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,D,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?E&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,D,m,t.width,t.height),E&&_e(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,D,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(E){if(o.layerUpdates.size>0){let t=He(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else qe(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?E&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,D,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?E&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?qe(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?E&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,D,m,t.width,t.height,t.depth),E){if(o.layerUpdates.size>0){let i=He(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,D,m,t.width,t.height,t.depth),E&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,D,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<D;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=Pe(g[0]);n.texStorage2D(e.TEXTURE_2D,D,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?E&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=Pe(t);n.texStorage2D(e.TEXTURE_2D,D,m,r.width,r.height)}E&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ye(t,o,s){if(o.image.length!==6)return;let c=P(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Et.getPrimaries(Et.workingColorSpace),r=o.colorSpace===``?null:Et.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Ne(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),E=o.isVideoTexture!==!0,D=u.__version===void 0||c===!0,O=l.dataReady,k=w(o,h);he(e.TEXTURE_CUBE_MAP,o);let A;if(o.isDepthTexture){if(x=C(o.format===T,o.type),D){if(E)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){E&&D&&n.texStorage2D(e.TEXTURE_CUBE_MAP,k,x,h.width,h.height);for(let t=0;t<6;t++){A=m[t].mipmaps;for(let r=0;r<A.length;r++){let i=A[r];o.format===1023?E?O&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?qe(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):E?O&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(A=o.mipmaps,E&&D){A.length>0&&k++;let t=Pe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,k,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){E?O&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<A.length;r++){let i=A[r].image[t].image;E?O&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{E?O&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<A.length;r++){let i=A[r];E?O&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function be(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,je(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function xe(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Me(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);Me(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Se(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?de(i.depthTexture,0):ce(i.depthTexture,0);let u=c.__webglTexture,d=je(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function we(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Se(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?Se(i.__webglFramebuffer[0],t,0):Se(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),xe(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),xe(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Te(t,n,i){let a=r.get(t);n!==void 0&&be(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&we(t)}function F(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,k),E(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Me(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=je(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),xe(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),he(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)be(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else be(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),he(c,a),be(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),he(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)be(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else be(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&we(t)}function Oe(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let ke=[];function Ae(t){if(t.samples>0){if(Me(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(ke.length=0,ke.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&ke.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ke))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function je(e){return Math.min(i.maxSamples,e.samples)}function Me(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function I(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Ne(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Et.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&qe(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):Qe(`WebGLTextures: Unsupported texture color space:`,n)),t}function Pe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=oe,this.resetTextureUnits=ie,this.getTextureUnits=N,this.setTextureUnits=ae,this.setTexture2D=ce,this.setTexture2DArray=le,this.setTexture3D=ue,this.setTextureCube=de,this.rebindTextures=Te,this.setupRenderTarget=F,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=be,this.useMultisampledRTT=Me,this.dispose=M}function ji(e,t){function n(n,r=``){let i,a=Et.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Mi=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ni=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Pi=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ie(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new d({vertexShader:Mi,fragmentShader:Ni,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new I(new Tt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Fi=class extends C{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Pi,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new W,C=null,w=null,E=new oe;E.viewport=new ve;let O=new oe;O.viewport=new ve;let A=[E,O],j=new gt,M=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new re,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new re,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new re,b[e]=t),t.getHandSpace()};function te(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ne(){r.removeEventListener(`select`,te),r.removeEventListener(`selectstart`,te),r.removeEventListener(`selectend`,te),r.removeEventListener(`squeeze`,te),r.removeEventListener(`squeezestart`,te),r.removeEventListener(`squeezeend`,te),r.removeEventListener(`end`,ne),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}M=null,ee=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&qe(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&qe(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,te),r.addEventListener(`selectstart`,te),r.addEventListener(`selectend`,te),r.addEventListener(`squeeze`,te),r.addEventListener(`squeezestart`,te),r.addEventListener(`squeezeend`,te),r.addEventListener(`end`,ne),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?T:B,a=_.stencil?pe:de);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new be(d.textureWidth,d.textureHeight,{format:k,type:jt,depthTexture:new D(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new be(f.framebufferWidth,f.framebufferHeight,{format:k,type:jt,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function ae(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),j.near=O.near=E.near=t,j.far=O.far=E.far=n,(M!==j.near||ee!==j.far)&&(r.updateRenderState({depthNear:j.near,depthFar:j.far}),M=j.near,ee=j.far),j.layers.mask=e.layers.mask|6,E.layers.mask=j.layers.mask&-5,O.layers.mask=j.layers.mask&-3;let i=e.parent,a=j.cameras;ae(j,i);for(let e=0;e<a.length;e++)ae(a[e],i);j.projectionMatrix.copy(E.projectionMatrix),j.projectionMatrixInverse.copy(E.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),se(e,j,i)};function se(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Ge*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(j)},this.getCameraTexture=function(e){return g[e]};let ce=null;function le(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==j.cameras.length&&(j.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=A[n];o===void 0&&(o=new oe,o.layers.enable(n),o.viewport=new ve,A[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(j.matrix.copy(o.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),i===!0&&j.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new ie,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ce&&ce(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ue=new Mt;ue.setAnimationLoop(le),this.setAnimationLoop=function(e){ce=e},this.dispose=function(){}}},Ii=new yt,Li=new Je;Li.set(-1,0,0,0,1,0,0,0,1);function Ri(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Te(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Ii.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Li),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function zi(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?qe(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):qe(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var Bi=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Vi=null;function Hi(){return Vi===null&&(Vi=new We(Bi,16,16,_t,ot),Vi.name=`DFG_LUT`,Vi.minFilter=lt,Vi.magFilter=lt,Vi.wrapS=Ot,Vi.wrapT=Ot,Vi.generateMipmaps=!1,Vi.needsUpdate=!0),Vi}var Ui=class{constructor(e={}){let{canvas:t=Ne(),context:n=null,depth:r=!0,stencil:i=!1,alpha:o=!1,antialias:s=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u=`default`,failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:p=jt}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);m=n.getContextAttributes().alpha}else m=o;let g=p,_=new Set([te,je,Be]),v=new Set([jt,de,S,pe,he,h]),y=new Uint32Array(4),x=new Int32Array(4),C={textures:[],min:[],max:[],resolution:[]},w=null,T=null,E=[],D=[],O=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let k=this,A=!1,j=null,M=null,ee=null,ne=null;this._outputColorSpace=a;let re=0,ie=0,N=null,ae=-1,oe=null,se=new ve,ce=new ve,le=null,fe=new F(0),P=0,_e=t.width,ye=t.height,xe=1,Se=null,Ce=null,we=new ve(0,0,_e,ye),Te=new ve(0,0,_e,ye),Ee=!1,De=new ue,ke=new me,Ae=!1,Me=!1,I=new yt,Pe=new b,Fe=new ve,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Le=!1;function Re(){return N===null?xe:1}let L=n;function ze(e,n){return t.getContext(e,n)}let R,Ve,z,He,B,V,We,Ge,Ke,Je,Ye,Xe,Ze,H,$e,U,tt,nt,rt,it,at,W,st;try{let e={alpha:!0,depth:r,stencil:i,antialias:s,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,ut,!1),t.addEventListener(`webglcontextrestored`,dt,!1),t.addEventListener(`webglcontextcreationerror`,ft,!1),L===null){let t=`webgl2`;if(L=ze(t,e),L===null)throw ze(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}ct()}catch(e){throw t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),Qe(`WebGLRenderer: `+e.message),e}function ct(){R=new ln(L),R.init(),at=new ji(L,R),Ve=new Ht(L,R,e,at),z=new ki(L,R),Ve.reversedDepthBuffer&&f&&z.buffers.depth.setReversed(!0),M=L.createFramebuffer(),ee=L.createFramebuffer(),ne=L.createFramebuffer(),He=new fn(L),B=new li,V=new Ai(L,R,z,B,Ve,at,He),We=new cn(k),Ge=new Nt(L),W=new Bt(L,Ge),Ke=new un(L,Ge,He,W),Je=new mn(L,Ke,Ge,W,He),nt=new pn(L,Ve,V),$e=new Ut(B),Ye=new ci(k,We,R,Ve,W,$e),Xe=new Ri(k,B),Ze=new pi,H=new bi(R),tt=new zt(k,We,z,Je,m,c),U=new Oi(k,Je,Ve),st=new zi(L,He,Ve,z),rt=new Vt(L,R,He),it=new dn(L,R,He),He.programs=Ye.programs,k.capabilities=Ve,k.extensions=R,k.properties=B,k.renderLists=Ze,k.shadowMap=U,k.state=z,k.info=He}g!==1009&&(O=new gn(g,t.width,t.height,s,r,i));let lt=new Fi(k,L);this.xr=lt,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=R.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=R.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return xe},this.setPixelRatio=function(e){e!==void 0&&(xe=e,this.setSize(_e,ye,!1))},this.getSize=function(e){return e.set(_e,ye)},this.setSize=function(e,n,r=!0){lt.isPresenting?qe(`WebGLRenderer: Can't change size while VR device is presenting.`):(_e=e,ye=n,t.width=Math.floor(e*xe),t.height=Math.floor(n*xe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),O!==null&&O.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(_e*xe,ye*xe).floor()},this.setDrawingBufferSize=function(e,n,r){_e=e,ye=n,xe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(g===1009)Qe(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){qe(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}O.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(se)},this.getViewport=function(e){return e.copy(we)},this.setViewport=function(e,t,n,r){e.isVector4?we.set(e.x,e.y,e.z,e.w):we.set(e,t,n,r),z.viewport(se.copy(we).multiplyScalar(Re()).round())},this.getScissor=function(e){return e.copy(Te)},this.setScissor=function(e,t,n,r){e.isVector4?Te.set(e.x,e.y,e.z,e.w):Te.set(e,t,n,r),z.scissor(ce.copy(Te).multiplyScalar(Re()).round())},this.getScissorTest=function(){return Ee},this.setScissorTest=function(e){z.setScissorTest(Ee=e)},this.setOpaqueSort=function(e){Se=e},this.setTransparentSort=function(e){Ce=e},this.getClearColor=function(e){return e.copy(tt.getClearColor())},this.setClearColor=function(){tt.setClearColor(...arguments)},this.getClearAlpha=function(){return tt.getClearAlpha()},this.setClearAlpha=function(){tt.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=_.has(t)}if(e){let e=N.texture.type,t=v.has(e),n=tt.getClearColor(),r=tt.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(y[0]=i,y[1]=a,y[2]=o,y[3]=r,L.clearBufferuiv(L.COLOR,0,y)):(x[0]=i,x[1]=a,x[2]=o,x[3]=r,L.clearBufferiv(L.COLOR,0,x))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),j=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ut,!1),t.removeEventListener(`webglcontextrestored`,dt,!1),t.removeEventListener(`webglcontextcreationerror`,ft,!1),tt.dispose(),Ze.dispose(),H.dispose(),V.dispose(),B.dispose(),We.dispose(),Je.dispose(),Ke.dispose(),W.dispose(),st.dispose(),Ye.dispose(),lt.dispose(),lt.removeEventListener(`sessionstart`,bt),lt.removeEventListener(`sessionend`,xt),St.stop()};function ut(e){e.preventDefault(),et(`WebGLRenderer: Context Lost.`),A=!0}function dt(){et(`WebGLRenderer: Context Restored.`),A=!1;let e=He.autoReset,t=U.enabled,n=U.autoUpdate,r=U.needsUpdate,i=U.type;ct(),He.autoReset=e,U.enabled=t,U.autoUpdate=n,U.needsUpdate=r,U.type=i}function ft(e){Qe(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function pt(e){let t=e.target;t.removeEventListener(`dispose`,pt),mt(t)}function mt(e){ht(e),B.remove(e)}function ht(e){let t=B.get(e).programs;t!==void 0&&(t.forEach(function(e){Ye.releaseProgram(e)}),e.isShaderMaterial&&Ye.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Ie);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=It(e,t,n,r,i);z.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ke.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;W.setup(i,r,s,n,c);let h,g=rt;if(c!==null&&(h=Ge.get(c),g=it,g.setIndex(h)),i.isMesh)r.wireframe===!0?(z.setLineWidth(r.wireframeLinewidth*Re()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),z.setLineWidth(e*Re()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(R.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ge.get(c).bytesPerElement:1,o=B.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function gt(e,t,n,r){j!==null&&e.isNodeMaterial&&j.setObject(r,e),Ae===!0&&$e.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,At(e,t,r),e.side=0,e.needsUpdate=!0,At(e,t,r),e.side=2):At(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),j!==null&&j.renderStart(e,t,n),T=H.get(n),T.init(t),D.push(T),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(T.pushLight(e),e.castShadow&&T.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(T.pushLight(e),e.castShadow&&T.pushShadow(e))}),T.setupLights(),j!==null&&j.updateLights(T.state.lightsArray),Me=this.localClippingEnabled,Ae=$e.init(this.clippingPlanes,Me),Ae===!0&&$e.setGlobalState(this.clippingPlanes,t),j!==null&&U.render(T.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];gt(o,n,t,e),r.add(o)}else gt(i,n,t,e),r.add(i)}}),T=D.pop(),j!==null&&j.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=B.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}R.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let _t=null;function vt(e){_t&&_t(e)}function bt(){St.stop()}function xt(){St.start()}let St=new Mt;St.setAnimationLoop(vt),typeof self<`u`&&St.setContext(self),this.setAnimationLoop=function(e){_t=e,lt.setAnimationLoop(e),e===null?St.stop():St.start()},lt.addEventListener(`sessionstart`,bt),lt.addEventListener(`sessionend`,xt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){Qe(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(A===!0)return;j!==null&&j.renderStart(e,t);let n=lt.enabled===!0&&lt.isPresenting===!0,r=O!==null&&(N===null||n)&&O.begin(k,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(t),t=lt.getCamera()),e.isScene===!0&&e.onBeforeRender(k,e,t,N),T=H.get(e,D.length),T.init(t),T.state.textureUnits=V.getTextureUnits(),D.push(T),I.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?ke.setFromArrayCamera(t):De.setFromProjectionMatrix(I,ge,t.reversedDepth),Me=this.localClippingEnabled,Ae=$e.init(this.clippingPlanes,Me),w=Ze.get(e,E.length),w.init(),E.push(w),this.info.render.frame++,lt.enabled===!0&&lt.isPresenting===!0){let e=k.xr.getDepthSensingMesh();e!==null&&Ct(e,t,-1/0,k.sortObjects)}Ct(e,t,0,k.sortObjects),w.finish(),j!==null&&j.updateLights(T.state.lightsArray),k.sortObjects===!0&&w.sort(Se,Ce),Le=lt.enabled===!1||lt.isPresenting===!1||lt.hasDepthSensing()===!1,Le&&tt.addToRenderList(w,e),this.info.autoReset===!0&&this.info.reset(),Ae===!0&&$e.beginShadows();let i=T.state.shadowsArray;if(U.render(i,e,t),Ae===!0&&$e.endShadows(),(r&&O.hasRenderPass())===!1){let n=w.opaque,r=w.transmissive;if(T.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Tt(n,r,e,a)}Le&&tt.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];wt(w,e,n,n.viewport)}}else r.length>0&&Tt(n,r,e,t),Le&&tt.render(e),wt(w,e,t)}N!==null&&ie===0&&(V.updateMultisampleRenderTarget(N),V.updateRenderTargetMipmap(N)),r&&O.end(k),e.isScene===!0&&e.onAfterRender(k,e,t),W.resetDefaultState(),ae=-1,oe=null,D.pop(),D.length>0?(T=D[D.length-1],V.setTextureUnits(T.state.textureUnits),Ae===!0&&$e.setGlobalState(k.clippingPlanes,T.state.camera)):T=null,E.pop(),w=E.length>0?E[E.length-1]:null,j!==null&&j.renderEnd()};function Ct(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)T.pushLight(e),e.castShadow&&T.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?ke:De;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&Fe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(I);let i=Je.update(e),a=e.material;a.visible&&w.push(e,i,a,n,Fe.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?ke:De;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=Je.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Fe.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Fe.copy(e.boundingSphere.center)),Fe.applyMatrix4(e.matrixWorld).applyMatrix4(I)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&w.push(e,i,c,n,Fe.z,s,t)}}else a.visible&&w.push(e,i,a,n,Fe.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)Ct(i[e],t,n,r)}function wt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;T.setupLightsView(n),Ae===!0&&$e.setGlobalState(k.clippingPlanes,n),r&&z.viewport(se.copy(r)),i.length>0&&Dt(i,t,n),a.length>0&&Dt(a,t,n),o.length>0&&Dt(o,t,n),z.buffers.depth.setTest(!0),z.buffers.depth.setMask(!0),z.buffers.color.setMask(!0),z.setPolygonOffset(!1)}function Tt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[r.id]===void 0){let e=R.has(`EXT_color_buffer_half_float`)||R.has(`EXT_color_buffer_float`);T.state.transmissionRenderTarget[r.id]=new be(1,1,{generateMipmaps:!0,type:e?ot:jt,minFilter:Ue,samples:Math.max(4,Ve.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Et.workingColorSpace})}let a=T.state.transmissionRenderTarget[r.id],o=r.viewport||se;a.setSize(o.z*k.transmissionResolutionScale,o.w*k.transmissionResolutionScale);let s=k.getRenderTarget(),c=k.getActiveCubeFace(),l=k.getActiveMipmapLevel();k.setRenderTarget(a),k.getClearColor(fe),P=k.getClearAlpha(),P<1&&k.setClearColor(16777215,.5),k.clear(),Le&&tt.render(n);let u=k.toneMapping;k.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),T.setupLightsView(r),Ae===!0&&$e.setGlobalState(k.clippingPlanes,r),Dt(e,n,r),V.updateMultisampleRenderTarget(a),V.updateRenderTargetMipmap(a),R.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Ot(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(V.updateMultisampleRenderTarget(a),V.updateRenderTargetMipmap(a))}k.setRenderTarget(s,c,l),k.setClearColor(fe,P),d!==void 0&&(r.viewport=d),k.toneMapping=u}function Dt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Ot(o,t,n,s,l,c)}}function Ot(e,t,n,r,i,a){j!==null&&i.isNodeMaterial&&j.setObject(e,i),e.onBeforeRender(k,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(k,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=2):k.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(k,t,n,r,i,a)}function kt(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function At(e,t,n){t.isScene!==!0&&(t=Ie);let r=B.get(e),i=T.state.lights,a=T.state.shadowsArray,o=i.state.version,s=Ye.getParameters(e,i.state,a,t,n,T.state.lightProbeGridArray),c=Ye.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=We.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,pt),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Ft(e,s),d}else s.uniforms=Ye.getUniforms(e),j!==null&&e.isNodeMaterial&&j.build(e,n,s),e.onBeforeCompile(s,k),d=Ye.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=$e.uniform),Ft(e,s),r.needsLights=Rt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=kt(T.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function Pt(e,t,n,r,i){let a=B.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=At(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function G(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Tr.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Ft(e,t){let n=B.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function It(e,t,n,r,i){t.isScene!==!0&&(t=Ie),V.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?k.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Et.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=We.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=k.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=B.get(r),y=T.state.lights;if(Ae===!0&&(Me===!0||e!==oe)){let t=e===oe&&r.id===ae;$e.setState(r,e,t)}let b=!1,x=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==$e.numPlanes||v.numIntersection!==$e.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===kt(T.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(x=!0):b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;(b===!0||x===!0)&&(S=x===!0?Pt(r,t,i,s,h):At(r,t,i),j&&r.isNodeMaterial&&j.onUpdateProgram(r,S,v));let w=!1,E=!1,D=!1,O=S.getUniforms(),A=v.uniforms;if(z.useProgram(S.program)&&(w=!0,E=!0,D=!0),r.id!==ae&&(ae=r.id,E=!0),w||oe!==e){z.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(L,`projectionMatrix`,e.projectionMatrix),O.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(L,Pe.setFromMatrixPosition(e.matrixWorld)),Ve.logarithmicDepthBuffer&&O.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),oe!==e&&(oe=e,E=!0,D=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(L,`sunShadowMap`,y.state.sunShadowMap,V),y.state.directionalShadowMap.length>0&&O.setValue(L,`directionalShadowMap`,y.state.directionalShadowMap,V),y.state.spotShadowMap.length>0&&O.setValue(L,`spotShadowMap`,y.state.spotShadowMap,V),y.state.pointShadowMap.length>0&&O.setValue(L,`pointShadowMap`,y.state.pointShadowMap,V)),i.isSkinnedMesh){O.setOptional(L,i,`bindMatrix`),O.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(L,`boneTexture`,e.boneTexture,V))}i.isBatchedMesh&&(O.setOptional(L,i,`batchingTexture`),O.setValue(L,`batchingTexture`,i._matricesTexture,V),O.setOptional(L,i,`batchingIdTexture`),O.setValue(L,`batchingIdTexture`,i._indirectTexture,V),O.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(L,`batchingColorTexture`,i._colorsTexture,V));let M=n.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&nt.update(i,n,S),(E||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(L,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(A.envMapIntensity.value=t.environmentIntensity),A.dfgLUT!==void 0&&(A.dfgLUT.value=Hi()),E){if(O.setValue(L,`toneMappingExposure`,k.toneMappingExposure),v.needsLights&&Lt(A,D),a&&r.fog===!0&&Xe.refreshFogUniforms(A,a),Xe.refreshMaterialUniforms(A,r,xe,ye,T.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=C,t=0;for(let n of T.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;A.probesSH.value=e.textures,A.probesMin.value=e.min,A.probesMax.value=e.max,A.probesResolution.value=e.resolution}Tr.upload(L,G(v),A,V)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Tr.upload(L,G(v),A,V),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(L,`center`,i.center),O.setValue(L,`modelViewMatrix`,i.modelViewMatrix),O.setValue(L,`normalMatrix`,i.normalMatrix),O.setValue(L,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];st.update(n,S),st.bind(n,S)}}return S}function Lt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Rt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return re},this.getActiveMipmapLevel=function(){return ie},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=B.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),B.get(e.texture).__webglTexture=t,B.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=B.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,re=t,ie=n;let r=null,i=!1,a=!1;if(e){let o=B.get(e);if(o.__useDefaultFramebuffer!==void 0){z.bindFramebuffer(L.FRAMEBUFFER,o.__webglFramebuffer),se.copy(e.viewport),ce.copy(e.scissor),le=e.scissorTest,z.viewport(se),z.scissor(ce),z.setScissorTest(le),ae=-1;return}if(o.__webglFramebuffer===void 0)V.setupRenderTarget(e);else if(o.__hasExternalTextures)V.rebindTextures(e,B.get(e.texture).__webglTexture,B.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&B.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);V.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=B.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&V.useMultisampledRTT(e)===!1?B.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,se.copy(e.viewport),ce.copy(e.scissor),le=e.scissorTest}else se.copy(we).multiplyScalar(xe).floor(),ce.copy(Te).multiplyScalar(xe).floor(),le=Ee;if(n!==0&&(r=M),z.bindFramebuffer(L.FRAMEBUFFER,r)&&z.drawBuffers(e,r),z.viewport(se),z.scissor(ce),z.setScissorTest(le),i){let r=B.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=B.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=B.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}ae=-1};function Wt(e){let t=B.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ve.textureFormatReadable(e.format),t.__typeReadable=Ve.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){Qe(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=B.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){z.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let u=Wt(o);if(u.__formatReadable===!1){Qe(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){Qe(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&L.readPixels(t,n,r,i,at.convert(c),at.convert(l),a)}finally{let e=N===null?null:B.get(N).__webglFramebuffer;z.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=B.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){z.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let d=Wt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),L.readPixels(t,n,r,i,at.convert(l),at.convert(u),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let p=N===null?null:B.get(N).__webglFramebuffer;z.bindFramebuffer(L.FRAMEBUFFER,p);let m=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Oe(L,m,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(f),L.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;V.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),z.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=at.convert(t.format),_=at.convert(t.type),v;t.isData3DTexture?(V.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(V.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(V.setTexture2D(t,0),v=L.TEXTURE_2D),z.activeTexture(L.TEXTURE0),z.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),z.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),z.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=z.getParameter(L.UNPACK_ROW_LENGTH),b=z.getParameter(L.UNPACK_IMAGE_HEIGHT),x=z.getParameter(L.UNPACK_SKIP_PIXELS),S=z.getParameter(L.UNPACK_SKIP_ROWS),C=z.getParameter(L.UNPACK_SKIP_IMAGES);z.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),z.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),z.pixelStorei(L.UNPACK_SKIP_PIXELS,l),z.pixelStorei(L.UNPACK_SKIP_ROWS,u),z.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=B.get(e),r=B.get(t),h=B.get(n.__renderTarget),g=B.get(r.__renderTarget);z.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),z.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,B.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,B.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,L.DEPTH_BUFFER_BIT,L.NEAREST);z.bindFramebuffer(L.READ_FRAMEBUFFER,null),z.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||B.has(e)){let n=B.get(e),r=B.get(t);z.bindFramebuffer(L.READ_FRAMEBUFFER,ee),z.bindFramebuffer(L.DRAW_FRAMEBUFFER,ne);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,L.COLOR_BUFFER_BIT,L.NEAREST);z.bindFramebuffer(L.READ_FRAMEBUFFER,null),z.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);z.pixelStorei(L.UNPACK_ROW_LENGTH,y),z.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),z.pixelStorei(L.UNPACK_SKIP_PIXELS,x),z.pixelStorei(L.UNPACK_SKIP_ROWS,S),z.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&L.generateMipmap(v),z.unbindTexture()},this.initRenderTarget=function(e){B.get(e).__webglFramebuffer===void 0&&V.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?V.setTextureCube(e,0):e.isData3DTexture?V.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?V.setTexture2DArray(e,0):V.setTexture2D(e,0),z.unbindTexture()},this.resetState=function(){re=0,ie=0,N=null,z.reset(),W.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return ge}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Et._getDrawingBufferColorSpace(e),t.unpackColorSpace=Et._getUnpackColorSpace()}},Wi=-.45,K=.6,Gi={id:`pines`,name:`Pine Lake`},q={x:6,z:58,rx:48,rz:34,depth:7},Ki={x:0,z:0},qi={x:-46,z:-38},Ji={x:44,z:-36},Yi={x:6,zStart:24.5,zEnd:38,width:2.2},Xi=[[[-2,7.2],[-1,11],[2,16],[5,20],[6,24.5]],[[-6.5,2],[-11,-2],[-17,-9],[-25,-17],[-33,-26],[-41,-33],[-44,-36]],[[2,16],[-10,22],[-22,30],[-34,44],[-40,58],[-36,76],[-22,92],[-2,98]],[[6,-4],[14,-10],[24,-20],[34,-29],[42,-34]],[[42,-34],[52,-16],[60,6],[62,30],[58,52],[48,74],[30,92],[10,98],[-2,98]]],Zi=[{id:`living`,name:`Living room`,pos:[-1,0,1.6],yaw:Math.PI*.55},{id:`bedroom`,name:`Bedroom`,pos:[2.6,0,.6],yaw:-Math.PI*.6},{id:`porch`,name:`Porch`,pos:[-.5,0,4.9],yaw:Math.PI},{id:`dock`,name:`Dock`,pos:[6,0,30],yaw:Math.PI},{id:`treehouse`,name:`Tree house`,pos:[qi.x+1.6,0,qi.z-1.1],yaw:Math.atan2(-(6-qi.x-1.6),-(58-qi.z+1.1))},{id:`clearing`,name:`Forest clearing`,pos:[Ji.x-3.2,0,Ji.z+4.2],yaw:Math.atan2(-3.2,4.2)},{id:`lakeshore`,name:`Far lakeshore`,pos:[-20,0,95],yaw:.2}],Qi={pines:{name:`Pine Lake`,blurb:`A log cabin in a rainy pine forest by a quiet lake.`},hollow:{name:`Maple Hollow`,blurb:`An autumn valley: a tea house, a hot spring, koi and a bamboo grove.`}},$i={LAKE:{...q},CABIN:{...Ki},TREEHOUSE:{...qi},CLEARING:{...Ji},DOCK:{...Yi},PATHS:Xi.map(e=>e.map(e=>[...e])),PLACES:Zi.map(e=>({...e}))},ea={LAKE:{x:12,z:34,rx:15,rz:9.5,depth:2.4},CABIN:{x:0,z:0},TREEHOUSE:{x:36,z:-30},CLEARING:{x:-34,z:14},DOCK:{x:12,zStart:23.5,zEnd:44.5,width:1.8},PATHS:[[[0,6.6],[2,11],[7,16],[11,20],[12,23.5]],[[12,44.5],[10,52],[0,58],[-14,56],[-24,46],[-30,30],[-33,18]],[[-6.8,0],[-14,3],[-22,7],[-30,12]],[[6.8,-1],[14,-8],[22,-16],[30,-24],[35,-28]],[[-6,-5],[-12,-12],[-20,-20],[-27,-27],[-34,-30]]],PLACES:[{id:`tearoom`,name:`Tea room`,pos:[-1.5,0,1.2],yaw:Math.PI*.75},{id:`veranda`,name:`Veranda`,pos:[.5,0,3.8],yaw:Math.PI},{id:`spring`,name:`Hot spring`,pos:[-30.5,0,16.5],yaw:Math.atan2(3.5,-2.5)},{id:`bridge`,name:`Koi bridge`,pos:[12,0,31],yaw:Math.PI/2},{id:`bamboo`,name:`Bamboo grove`,pos:[-22,0,-22],yaw:Math.PI*.8},{id:`moondeck`,name:`Moon-viewing deck`,pos:[35,0,-28],yaw:Math.PI*.85},{id:`swing`,name:`Maple swing`,pos:[12,0,-7],yaw:Math.PI*.3}]};function ta(e){let t=e===`hollow`?ea:$i;Gi.id=e===`hollow`?`hollow`:`pines`,Gi.name=Qi[Gi.id].name,Object.assign(q,t.LAKE),Object.assign(Ki,t.CABIN),Object.assign(qi,t.TREEHOUSE),Object.assign(Ji,t.CLEARING),Object.assign(Yi,t.DOCK),Xi.length=0,t.PATHS.forEach(e=>Xi.push(e)),Zi.length=0,t.PLACES.forEach(e=>Zi.push(e))}var na=()=>new Promise(e=>typeof requestAnimationFrame==`function`?requestAnimationFrame(()=>e()):setTimeout(e,0));function ra(e,t=e){let n=document.createElement(`canvas`);return n.width=e,n.height=t,n}function ia(e,t=!0,n=!0){let r=new L(e);return t&&(r.colorSpace=a),n&&(r.wrapS=r.wrapT=ze),r.anisotropy=8,r.generateMipmaps=!0,r.minFilter=Ue,r.needsUpdate=!0,r}function aa(e,t,n=2){let r=ra(e),i=ra(e),a=r.getContext(`2d`).createImageData(e,e),o=new Float32Array(e*e),s={r:0,g:0,b:0,h:.5},c=a.data;for(let n=0;n<e;n++){let r=n/e;for(let i=0;i<e;i++){let a=i/e;s.h=.5,t(a,r,s);let l=n*e+i;o[l]=s.h,c[l*4]=pt(s.r,0,1)*255,c[l*4+1]=pt(s.g,0,1)*255,c[l*4+2]=pt(s.b,0,1)*255,c[l*4+3]=255}}r.getContext(`2d`).putImageData(a,0,0);let l=i.getContext(`2d`).createImageData(e,e),u=l.data,d=n*e/256;for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=o[t*e+(n-1+e)%e],i=o[t*e+(n+1)%e],a=o[(t-1+e)%e*e+n],s=o[(t+1)%e*e+n],c=(r-i)*d,l=(s-a)*d,f=1,p=Math.hypot(c,l,f);c/=p,l/=p,f/=p;let m=(t*e+n)*4;u[m]=(c*.5+.5)*255,u[m+1]=(l*.5+.5)*255,u[m+2]=(f*.5+.5)*255,u[m+3]=255}return i.getContext(`2d`).putImageData(l,0,0),{map:ia(r,!0),normalMap:ia(i,!1)}}var oa=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)};function sa(e,t=[.52,.34,.2],n=6){return aa(e,(e,r,i)=>{let a=Math.floor(r*n),o=r*n-a,s=oa(a*7.13),c=.5+oa(a*3.1)*.5,l=(e+s)/c,u=Math.floor(l),d=l-u,f=a*31+(u%9+9)%9,p=.78+oa(f)*.4,m=H(e*4,r*96,4,4,96),h=Math.sin(r*n*18+H(e*8,r*8,3,8,8)*9+oa(f)*20)*.5+.5,g=p*(.86+m*.25+h*.12),_=ut(e*6,r*n*1,6)[0],v=U(.12,0,_)*+(oa(f+5)>.6);g*=1-v*.5;let y=U(0,.035,o)*U(1,.965,o)*Math.min(U(0,.008,d*c),U(c,c-.008,d*c)),b=Math.min(Math.hypot((d*c-.03)*60,(o-.5)*6),Math.hypot((d*c-(c-.03))*60,(o-.5)*6)),x=U(.6,.3,b)*.6;g*=.35+.65*y,i.r=t[0]*g*(1-x*.7),i.g=t[1]*g*(1-x*.7),i.b=t[2]*g*(1-x*.6),i.h=y*(.9+m*.08)-x*.1},3)}function ca(e){return aa(e,(e,t,n)=>{let r=H(e*24,t*2,5,24,2),i=H(e*60,t*1,3,60,1),a=U(.035,0,Math.abs(we(e*10,t*1.5,10,2)))*U(.2,.6,H(e*3,t*3,2,3,3)+.4),o=ut(e*5,t*3,5),s=U(.1,0,o[0])*+(oa(o[2])>.55),c=.82+r*.28+i*.12;n.r=.52*c,n.g=.37*c,n.b=.25*c;let l=a*.7+s*.55;n.r*=1-l,n.g*=1-l,n.b*=1-l*.9,n.h=.6+r*.15+i*.1-a*.5-s*.15},4)}function la(e){return aa(e,(e,t,n)=>{let r=H(e*8,t*8,4,8,8),i=ut(e*90,t*90,90)[0],a=Math.abs(we(e*6,t*40,6,40)),o=.94+r*.08;n.r=.86*o,n.g=.66*o-r*.02,n.b=.56*o,n.h=.5+r*.08-U(.12,0,i)*.18-U(.05,0,a)*.12},1.6)}function ua(e,t=[.2,.27,.22]){return aa(e,(e,n,r)=>{let i=e*24,a=n*32,o=i-Math.floor(i),s=a-Math.floor(a),c=o<.5?o*2:(1-o)*2,l=Math.sin(Math.min(1,Math.max(0,c*1.1+(o<.5?s:1-s)*.5))*Math.PI),u=H(e*30,n*30,2,30,30),d=.62+l*.4+u*.08;r.r=t[0]*d,r.g=t[1]*d,r.b=t[2]*d,r.h=l*.8+u*.1},3)}function da(e){return aa(e,(e,t,n)=>{let r=Math.sin((e*160+t*160)*Math.PI)*.5+.5,i=H(e*12,t*40,3,12,40),a=H(e*3,t*3,3,3,3)*.5+.5,o=H(e*200,t*8,2,200,8),s=.72+r*.18+i*.12+a*.2+o*.08;n.r=.17*s+a*.05,n.g=.24*s+a*.05,n.b=.38*s+a*.05,n.h=r*.6+i*.2},1.4)}function fa(e){return aa(e,(e,t,n)=>{let[r,i]=ut(e*40,t*40,40),a=U(0,.12,i-r),o=H(e*6,t*6,4,6,6),s=.75+o*.25+a*.1;n.r=.32*s,n.g=.2*s,n.b=.12*s,n.h=a*.4+o*.3},2)}function pa(e,t=[.55,.38,.24]){return aa(e,(e,n,r)=>{let i=H(e*3,n*1,3,3,1)*.6,a=Math.sin((e*18+i*3)*Math.PI)*.5+.5,o=H(e*90,n*3,3,90,3),s=H(e*6,n*4,4,6,4),c=.78+a*.16+o*.14+s*.12;r.r=t[0]*c,r.g=t[1]*c,r.b=t[2]*c,r.h=.5+o*.1+a*.05},1.2)}function ma(e,t=!1){return aa(e,(e,n,r)=>{if(t){let t=H(e*6,n*6,4,6,6),i=U(.55,.75,H(e*3,n*30,3,3,30)*.5+.5+t*.3),a=.86+t*.08;r.r=a*(1-i*.8),r.g=a*.97*(1-i*.8),r.b=a*.92*(1-i*.82),r.h=.5+t*.1-i*.3;return}let i=(1-Math.abs(H(e*8,n*1.5,5,8,2)))**3,a=H(e*20,n*10,3,20,10),o=U(.35,.6,H(e*4+9,n*4,4,4,4)*.5+.5)*.5,s=.25+i*.55+a*.08;r.r=.36*s+o*.12,r.g=.27*s+o*.16,r.b=.2*s+o*.07,r.h=i*.9+a*.1},6)}function ha(e,t=5,n=0){return aa(e,(e,r,i)=>{let a=e+H(e*6,r*6,2,6,6)*.02,o=r+H(e*6+5,r*6,2,6,6)*.02,[s,c,l]=ut(a*t,o*t,t),u=c-s,d=U(.03,.09,u),f=H(e*32,r*32,4,32,32),p=.34+oa(l)*.28+f*.1,m=oa(l+3);i.r=p*(.95+m*.1+n*.12),i.g=p*(.93+n*.04),i.b=p*(.9-n*.08+(1-m)*.06);let h=1-d;i.r=i.r*d+.45*h,i.g=i.g*d+.43*h,i.b=i.b*d+.4*h,i.h=d*(.6+Math.sqrt(Math.min(u*3,1))*.4)+f*.06},5)}function ga(e){return aa(e,(e,t,n)=>{let r=H(e*4,t*4,4,4,4),i=H(e*48,t*48,3,48,48),a=we(e*220,t*40,220,40)*.5+we(e*40,t*220,40,220)*.5,o=U(-.1,.4,r),s=.17+o*.14,c=.25+o*.07,l=.08+o*.03,u=.8+i*.25+a*.18;n.r=s*u,n.g=c*u,n.b=l*u,n.h=.5+a*.25+i*.2},2.5)}function _a(e){return aa(e,(e,t,n)=>{let r=H(e*6,t*6,5,6,6),[i,,a]=ut(e*28,t*28,28),o=U(.32,.18,i)*+(oa(a)>.55),s=.5+oa(a+1)*.3,c=.75+r*.3,l=.34*c,u=.25*c,d=.17*c;l=l*(1-o)+.42*s*o,u=u*(1-o)+.4*s*o,d=d*(1-o)+.37*s*o,n.r=l,n.g=u,n.b=d,n.h=.4+r*.2+o*.35*(1-i*3)},3.5)}function va(e){return aa(e,(e,t,n)=>{let r=Math.floor(t*10),i=t*10-r,a=e*8+r%2*.5+oa(r)*.3,o=Math.floor(a),s=a-o,c=.6+oa(r*17+(o%8+8)%8)*.5,l=H(e*64,t*6,3,64,6),u=U(0,.04,s)*U(1,.96,s),d=.55+.45*i,f=U(.25,.6,H(e*5,t*5,4,5,5)*.5+.5-i*.2)*.8,p=.36*c*(.85+l*.3),m=.25*c*(.85+l*.3),h=.17*c;p=p*(1-f)+.22*f,m=m*(1-f)+.27*f,h=h*(1-f)+.12*f;let g=u*d;n.r=p*g,n.g=m*g,n.b=h*g,n.h=i*.7*u+l*.05},4)}function ya(e,t,n=`weave`){let[r,i,a]=t;return aa(e,(t,o,s)=>{let c=Math.sin(t*e*Math.PI*.5)*Math.sin(o*e*Math.PI*.5)*.5+.5,l=H(t*16,o*16,3,16,16),u=.8+c*.15+l*.1;if(n===`plaid`){let e=+(Math.sin(t*Math.PI*16)>.6)+ +(Math.sin(o*Math.PI*16)>.6),n=+(Math.abs(Math.sin(t*Math.PI*32))<.08)+ +(Math.abs(Math.sin(o*Math.PI*32))<.08);u*=1-e*.22,u*=1+n*.25}s.r=r*u,s.g=i*u,s.b=a*u,s.h=c*.5+l*.1},1.5)}function ba(e){let t=[[.55,.12,.08],[.85,.75,.58],[.12,.16,.22],[.75,.42,.12]];return aa(e,(n,r,i)=>{let a=Math.abs(n-.5)*2,o=Math.abs(r-.5)*2,s=Math.max(a,o),c;if(s>.92)c=t[2];else if(s>.86)c=t[1];else if(s>.8)c=t[0];else{let e=(a+o)*4,i=Math.floor(e*2)%4,s=Math.floor(n*12)%2==Math.floor(r*12)%2;c=t[(i+(s&&e<2?1:0))%4],e>5.2&&(c=t[3])}let l=Math.sin(n*e*1.5)*Math.sin(r*e*1.5)*.5+.5,u=H(n*20,r*20,3,20,20),d=.78+l*.12+u*.15;i.r=c[0]*d,i.g=c[1]*d,i.b=c[2]*d,i.h=l*.6+u*.2},1.5)}function xa(e){let t=[[.62,.2,.16],[.86,.8,.66],[.27,.38,.45],[.55,.5,.26],[.42,.24,.3]];return aa(e,(n,r,i)=>{let a=Math.floor(n*8),o=Math.floor(r*8),s=n*8-a,c=r*8-o,l=t[Math.floor(oa(a*13+o*7)*t.length)];s>c!=s>1-c&&oa(a+o*3)>.5&&(l=t[(a+o)%t.length]);let u=Math.min(s,c,1-s,1-c)<.03?.75:1,d=Math.sin(s*Math.PI)*Math.sin(c*Math.PI),f=Math.sin(n*e*1.4)*Math.sin(r*e*1.4)*.05,p=(.82+d*.18+f)*u;i.r=l[0]*p,i.g=l[1]*p,i.b=l[2]*p,i.h=d*.8},3)}function Sa(e){let t=z(42),n=[];for(let e=0;e<48;e++){let r=1+Math.floor(t()*(e<12?4:18)),i=t()*Math.PI*2;n.push({kx:Math.round(Math.cos(i)*r),ky:Math.round(Math.sin(i)*r),p:t()*6.28,amp:1/(1+r*.6)})}let r=ra(e),i=r.getContext(`2d`),a=i.createImageData(e,e);for(let t=0;t<e;t++)for(let r=0;r<e;r++){let i=r/e*Math.PI*2,o=t/e*Math.PI*2,s=0,c=0;for(let e of n){let t=Math.cos(e.kx*i+e.ky*o+e.p)*e.amp;s+=t*e.kx,c+=t*e.ky}let l=-s*.04,u=-c*.04,d=Math.hypot(l,u,1),f=(t*e+r)*4;a.data[f]=(l/d*.5+.5)*255,a.data[f+1]=(u/d*.5+.5)*255,a.data[f+2]=(1/d*.5+.5)*255,a.data[f+3]=255}return i.putImageData(a,0,0),ia(r,!1)}function Ca(e=256){let t=ra(e),n=t.getContext(`2d`),r=z(7);n.clearRect(0,0,e,e),n.lineCap=`round`;for(let t=0;t<5;t++){let i=e*.5,a=e,o=-Math.PI/2+(t-2)*.33,s=e*(.65+r()*.3)*(t===2?1.05:.85),c=i+Math.cos(o)*s,l=a+Math.sin(o)*s;n.strokeStyle=`rgb(70,52,36)`,n.lineWidth=e*.012,n.beginPath(),n.moveTo(i,a),n.lineTo(c,l),n.stroke();for(let t=0;t<46;t++){let s=.08+t/46*.92,u=i+(c-i)*s,d=a+(l-a)*s;for(let t of[-1,1]){let i=o+t*(.9+r()*.4)-.25*t*s,a=e*(.07+r()*.04)*(1.1-s*.5),c=30+Math.floor(r()*40);n.strokeStyle=`rgb(${18+c*.3},${48+c},${26+c*.4})`,n.lineWidth=e*.007,n.beginPath(),n.moveTo(u,d),n.lineTo(u+Math.cos(i)*a,d+Math.sin(i)*a),n.stroke()}}}return ia(t,!0,!1)}function wa(e=256,t=[70,110,40]){let n=ra(e),r=n.getContext(`2d`),i=z(11);for(let n=0;n<160;n++){let n=i()*Math.PI*2,a=Math.sqrt(i())*e*.42,o=e/2+Math.cos(n)*a,s=e/2+Math.sin(n)*a,c=e*(.04+i()*.03),l=.6+i()*.6;r.fillStyle=`rgb(${t[0]*l|0},${t[1]*l|0},${t[2]*l|0})`,r.save(),r.translate(o,s),r.rotate(i()*Math.PI*2),r.beginPath(),r.ellipse(0,0,c,c*.55,0,0,Math.PI*2),r.fill(),r.strokeStyle=`rgba(30,40,10,0.4)`,r.lineWidth=1,r.beginPath(),r.moveTo(-c,0),r.lineTo(c,0),r.stroke(),r.restore()}return ia(n,!0,!1)}function Ta(e=256){let t=ra(e),n=t.getContext(`2d`),r=z(5),i=e/2;n.strokeStyle=`rgb(60,90,30)`,n.lineWidth=e*.012,n.beginPath(),n.moveTo(i,e),n.quadraticCurveTo(i+e*.05,e*.5,i,0),n.stroke();for(let t=0;t<26;t++){let a=t/26,o=e*(.95-a*.92),s=e*.42*Math.sin((1-a)*Math.PI*.9+.15);for(let t of[-1,1]){let c=.75+r()*.4;n.fillStyle=`rgb(${50*c|0},${105*c|0},${32*c|0})`,n.beginPath(),n.moveTo(i,o),n.quadraticCurveTo(i+t*s*.5,o-e*.03,i+t*s,o-e*.05+a*4),n.quadraticCurveTo(i+t*s*.5,o+e*.012,i,o+e*.012),n.fill()}}return ia(t,!0,!1)}function Ea(e=256,t=[[190,50,30],[220,90,30],[235,150,40]]){let n=ra(e),r=n.getContext(`2d`),i=z(31+t[0][0]),a=(e,t,n,i,a)=>{r.save(),r.translate(e,t),r.rotate(i),r.scale(n,n),r.fillStyle=a,r.beginPath();for(let e=0;e<=10;e++){let t=-Math.PI/2+e/10*Math.PI*2,n=e%2?.42:1;r.lineTo(Math.cos(t)*n,Math.sin(t)*n*(e===5||e===4||e===6?.8:1))}r.closePath(),r.fill(),r.strokeStyle=`rgba(80,30,10,0.35)`,r.lineWidth=.05,r.beginPath();for(let e=0;e<5;e++){let t=-Math.PI/2+e/5*Math.PI*2;r.moveTo(0,0),r.lineTo(Math.cos(t)*.85,Math.sin(t)*.85)}r.stroke(),r.restore()};for(let n=0;n<140;n++){let n=i()*Math.PI*2,r=Math.sqrt(i())*e*.42,o=t[Math.floor(i()*t.length)],s=.7+i()*.45;a(e/2+Math.cos(n)*r,e/2+Math.sin(n)*r,e*(.035+i()*.025),i()*6.28,`rgb(${o[0]*s|0},${o[1]*s|0},${o[2]*s|0})`)}return ia(n,!0,!1)}function Da(e=256){let t=ra(e),n=t.getContext(`2d`),r=z(77);for(let t=0;t<170;t++){let t=r()*Math.PI*2,i=Math.sqrt(r())*e*.42,a=e*(.03+r()*.02),o=.8+r()*.35;n.save(),n.translate(e/2+Math.cos(t)*i,e/2+Math.sin(t)*i),n.rotate(r()*6.28),n.fillStyle=`rgb(${235*o|0},${190*o|0},${50*o|0})`,n.beginPath(),n.moveTo(0,0),n.arc(0,0,a,-Math.PI*.85,-Math.PI*.15),n.closePath(),n.fill(),n.restore()}return ia(t,!0,!1)}function Oa(e){return aa(e,(t,n,r)=>{let i=Math.sin(n*e*1.6)*.5+.5,a=H(t*120,n*4,2,120,4),o=+(t<.035||t>.965),s=.78+i*.14+a*.1;o?(r.r=.12,r.g=.14,r.b=.12,r.h=.7):(r.r=.72*s,r.g=.66*s,r.b=.42*s,r.h=i*.5)},1.5)}function ka(e){return aa(e,(e,t,n)=>{let r=Math.floor(t*8),i=t*8-r,a=(e*10+r%2*.5)%1,o=Math.sin(a*Math.PI),s=H(e*30,t*30,3,30,30),c=(.45+o*.35+s*.1)*(.6+i*.4);n.r=.32*c,n.g=.33*c,n.b=.35*c,n.h=o*.8*i},4)}function Aa(e=256,t=640){let n=ra(e,t),r=n.getContext(`2d`),i=z(5);r.fillStyle=`#efe6d0`,r.fillRect(0,0,e,t);for(let n=0;n<3;n++){r.fillStyle=`rgba(30,30,35,${.18+n*.18})`,r.beginPath();let a=t*(.42+n*.12);r.moveTo(0,t);for(let t=0;t<=e;t+=8)r.lineTo(t,a-Math.sin(t*.02+n*2)*50-i()*20+n*10);r.lineTo(e,t),r.fill()}r.fillStyle=`rgba(160,30,20,0.85)`,r.fillRect(e*.72,t*.08,18,18),r.strokeStyle=`rgba(20,20,20,0.85)`,r.lineWidth=3;for(let n=0;n<6;n++){let i=t*.1+n*26;r.beginPath(),r.moveTo(e*.18,i),r.quadraticCurveTo(e*.24,i+8,e*.2,i+18),r.stroke()}return ia(n,!0,!1)}function ja(e=128){let t=ra(e),n=t.getContext(`2d`);n.fillStyle=`#4a3a2a`,n.fillRect(0,0,e,e);for(let t=0;t<e;t+=4)n.fillStyle=t%8?`#2a2018`:`#5c4a36`,n.fillRect(0,t,e,2);return ia(t,!0,!0)}function Ma(e=256){let t=ra(e),n=t.getContext(`2d`);n.fillStyle=`#efe6d2`,n.beginPath(),n.arc(e/2,e/2,e/2,0,Math.PI*2),n.fill(),n.fillStyle=`#2b2017`,n.textAlign=`center`,n.textBaseline=`middle`,n.font=`${e*.11}px Georgia, serif`;let r=[`XII`,`I`,`II`,`III`,`IV`,`V`,`VI`,`VII`,`VIII`,`IX`,`X`,`XI`];for(let t=0;t<12;t++){let i=t/12*Math.PI*2-Math.PI/2;n.fillText(r[t],e/2+Math.cos(i)*e*.37,e/2+Math.sin(i)*e*.37)}for(let t=0;t<60;t++){let r=t/60*Math.PI*2,i=e*(t%5?.47:.45);n.strokeStyle=`#2b2017`,n.lineWidth=t%5?1:2.5,n.beginPath(),n.moveTo(e/2+Math.cos(r)*i,e/2+Math.sin(r)*i),n.lineTo(e/2+Math.cos(r)*e*.49,e/2+Math.sin(r)*e*.49),n.stroke()}return ia(t,!0,!1)}function Na(e=256){let t=ra(e,e/2),n=t.getContext(`2d`),r=z(99),i=0,a=[`#5b1f1a`,`#1f3a4a`,`#3c4a22`,`#6b4a1e`,`#2a2a2a`,`#7a6a4a`,`#4a2a4a`];for(;i<e;){let t=6+r()*12,o=e/2*(.7+r()*.3);n.fillStyle=a[Math.floor(r()*a.length)],n.fillRect(i,e/2-o,t-1,o),n.fillStyle=`rgba(220,190,120,0.6)`,n.fillRect(i+1,e/2-o+6,t-3,2),n.fillRect(i+1,e/2-10,t-3,2),i+=t}return ia(t,!0,!1)}async function Pa(e,t){let n=e.textureSize,r=Math.max(256,n/2),i={},a=[[`floor`,()=>sa(n,[.46,.32,.22],6)],[`boards`,()=>sa(r,[.42,.3,.2],8)],[`deck`,()=>sa(r,[.46,.42,.37],5)],[`grain`,()=>pa(r)],[`skin`,()=>la(256)],[`knit`,()=>ua(256)],[`denim`,()=>da(256)],[`leather`,()=>fa(256)],[`logs`,()=>ca(n)],[`bark`,()=>ma(r)],[`birch`,()=>ma(r,!0)],[`stone`,()=>ha(n,5,.3)],[`rock`,()=>ha(r,2,0)],[`grass`,()=>ga(n)],[`dirt`,()=>_a(r)],[`shingles`,()=>va(n)],[`sofa`,()=>ya(r,[.36,.22,.14],`weave`)],[`wool`,()=>ya(r,[.55,.18,.12],`plaid`)],[`linen`,()=>ya(r,[.82,.79,.72],`weave`)],[`rug`,()=>ba(n)],[`quilt`,()=>xa(r)]];for(let e=0;e<a.length;e++){let[n,r]=a[e];i[n]=r(),t?.((e+1)/(a.length+6),n),await na()}return i.water=Sa(256),i.pine=Ca(256),i.leaves=wa(256),i.fern=Ta(256),i.grille=ja(),i.clock=Ma(),i.books=Na(),i.maple=Ea(256),i.mapleGold=Ea(256,[[230,150,30],[240,190,60],[200,110,30]]),i.ginkgo=Da(256),i.tatami=Oa(r),i.kawara=ka(r),i.scroll=Aa(),t?.(1,`done`),i}var Fa=[];function Ia(){Fa=[];for(let e of Xi)for(let t=0;t<e.length-1;t++)Fa.push([e[t][0],e[t][1],e[t+1][0],e[t+1][1]]);let e=(e,t)=>H(e/95+10,t/95+4,5)*(2.5+U(25,160,Math.hypot(e,t))*8)+1.2*U(20,80,Math.hypot(e,t));Va=e(Ji.x,Ji.z),Ha=e(qi.x,qi.z)+(Gi.id===`hollow`?3:0)}function La(e,t){let n=1e9;for(let[r,i,a,o]of Fa){let s=a-r,c=o-i,l=Math.max(0,Math.min(1,((e-r)*s+(t-i)*c)/(s*s+c*c))),u=r+s*l-e,d=i+c*l-t,f=u*u+d*d;f<n&&(n=f)}return Math.sqrt(n)}function Ra(e,t){return Math.hypot((e-q.x)/q.rx,(t-q.z)/q.rz)+H(e/40,t/40,3)*.12}function za(e,t){let n=Math.hypot(e-Ki.x,t-Ki.z),r=U(-.25,.35,H(e/70+3,t/70-7,3))*.7+.35;return r*=U(14,32,n),r*=U(1.08,1.35,Ra(e,t)),r*=U(9,18,Math.hypot(e-Ji.x,t-Ji.z)),Math.min(1,r)}function Ba(e,t){let n=Math.hypot(e,t),r=2.5+U(25,160,n)*8,i=H(e/95+10,t/95+4,5)*r+H(e/22,t/22,3)*.8+1.2*U(20,80,n);i+=U(150,290,n)*(34+H(e/60,t/60,4)*26);let a=Ra(e,t),o=Wi+(a-1)*q.depth,s=U(.82,1.45,a);i=st(Math.max(o,Wi-Math.min(4.2,q.depth*.7)),Math.max(i,Wi+(a-1)*4+.15),s);let c=Math.hypot((e-Ki.x)/15,(t-Ki.z-1)/11);i=st(0,i,U(.75,1.9,c));let l=Math.hypot(e-Ji.x,t-Ji.z);i=st(Va,i,U(8,18,l));let u=Math.hypot(e-qi.x,t-qi.z);if(i=st(Ha,i,U(5,12,u)),Gi.id===`hollow`){let n=U(95,40,Math.hypot(e,t-6));i=st(i,i*.35+.4,n*.75);let r=Math.hypot(e-Ji.x,t-Ji.z);i=st(Va*.35+.4,i,U(5,12,r))}let d=La(e,t);return i-=U(1.6,.3,d)*.06,i}var Va=0,Ha=0;Ia();var Ua=class{constructor(e,t){let n=e.terrainSeg;this.seg=n,this.size=640,this.step=640/n,this.half=320;let r=n+1,i=this.H=new Float32Array(r*r);for(let e=0;e<r;e++)for(let t=0;t<r;t++)i[e*r+t]=Ba(-this.half+t*this.step,-this.half+e*this.step);let a=new Tt(640,640,n,n);a.rotateX(-Math.PI/2);let o=a.attributes.position,s=new Float32Array(o.count),c=new Float32Array(o.count*3);for(let e=0;e<o.count;e++){let t=o.getX(e),n=o.getZ(e),a=Math.round((t+this.half)/this.step),l=i[Math.round((n+this.half)/this.step)*r+a];o.setY(e,l);let u=La(t,n),d=Ra(t,n),f=U(1.7,.6,u);f=Math.max(f,U(1.12,1,d)*.9);let p=Math.hypot((t-Ki.x)/9.5,(n-Ki.z-.5)/6.5);f=Math.max(f,U(1.15,.9,p)*.8),f=Math.max(f,U(5,2.5,Math.hypot(t-Ji.x,n-Ji.z))),s[e]=f;let m=za(t,n),h=H(t/30,n/30,2)*.5+.5,g=st(1.05,.78,m)*(.9+h*.2),_=st(1.05,.7,m)*(.9+h*.15),v=st(1,.62,m),y=U(1.02,.94,d);if(g=st(g,.55,y),_=st(_,.5,y),v=st(v,.42,y),Gi.id===`hollow`){let e=m*(.6+h*.4),r=U(.1,-.3,H(t/18,n/18,2));g*=1.18+e*.25,_*=.96-e*.12,v*=.62-e*.1,_+=r*.12*(1-e),g-=r*.08}let b=U(14,40,l);c[e*3]=st(g,.8,b),c[e*3+1]=st(_,.78,b),c[e*3+2]=st(v,.76,b)}a.setAttribute(`aPath`,new nt(s,1)),a.setAttribute(`color`,new nt(c,3)),a.computeVertexNormals(),a.computeBoundingSphere();let l=t.grass,u=t.dirt,d=640/3.5;l.map.repeat.set(d,d),l.normalMap.repeat.set(d,d);let f=new R({map:l.map,normalMap:l.normalMap,vertexColors:!0,roughness:.95,metalness:0,normalScale:new W(.9,.9)});this.uniforms={dirtMap:{value:u.map},dirtNormal:{value:u.normalMap},wet:{value:0},uTime:{value:0},uRain:{value:0},uWL:{value:Wi},uDay:{value:1}},f.onBeforeCompile=e=>{Object.assign(e.uniforms,this.uniforms),e.vertexShader=`attribute float aPath;
varying float vPath;
varying vec3 vWPos;
`+e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
vPath = aPath;
vWPos = (modelMatrix * vec4(position, 1.0)).xyz;`),e.fragmentShader=`uniform sampler2D dirtMap; uniform sampler2D dirtNormal; uniform float wet; uniform float uTime; uniform float uRain; uniform float uWL; uniform float uDay;
varying float vPath; varying vec3 vWPos; float gDirtBlend; float gPuddle;
float th21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float tvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(th21(i), th21(i + vec2(1, 0)), f.x), mix(th21(i + vec2(0, 1)), th21(i + vec2(1, 1)), f.x), f.y); }
vec2 tRings(vec2 p, float t){ vec2 n = vec2(0.0); for (int L = 0; L < 2; L++){ vec2 g = p * 3.0 + float(L) * 11.0; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float r = th21(id); if (r > uRain) continue; float ph = fract(t * (0.9 + r * 0.5) + r * 9.0); vec2 c = (vec2(th21(id + 2.0), th21(id + 5.0)) - 0.5) * 0.5;
  vec2 d = f - c; float dl = length(d); float w = dl - ph * 0.4; n += d / max(dl, 1e-3) * exp(-w * w * 800.0) * (1.0 - ph) * sin(w * 80.0); } return n; }
`+e.fragmentShader.replace(`#include <map_fragment>`,`
          vec4 gC = texture2D(map, vMapUv);
          vec4 dC = texture2D(dirtMap, vMapUv * 1.3);
          gDirtBlend = smoothstep(0.38, 0.62, vPath + (gC.g - 0.22) * 0.9);
          vec4 sampledDiffuseColor = mix(gC, dC, gDirtBlend);
          diffuseColor *= sampledDiffuseColor;
          diffuseColor.rgb *= 1.0 - wet * (0.22 + gDirtBlend * 0.18);
          // puddles collect in hollows of trails and mud when it has rained
          float pn = tvn(vWPos.xz * 0.45) * 0.65 + tvn(vWPos.xz * 1.7) * 0.35;
          gPuddle = smoothstep(0.58, 0.66, pn) * smoothstep(0.35, 0.75, gDirtBlend) * smoothstep(0.35, 0.8, wet) * step(uWL + 0.05, vWPos.y);
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.45 + vec3(0.01, 0.012, 0.015), gPuddle);
          // under water: lake-bed tint by depth + moving caustics
          float uw = uWL - vWPos.y;
          if (uw > 0.0) {
            vec2 cp = vWPos.xz * 0.9;
            float ca = abs(sin(cp.x * 2.1 + uTime * 0.9 + sin(cp.y * 1.7 + uTime * 0.6) * 1.6) * sin(cp.y * 2.3 - uTime * 0.7 + sin(cp.x * 1.3 - uTime * 0.5) * 1.4));
            float caust = pow(ca, 6.0) * exp(-uw * 0.9) * uDay;
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.13, 0.2, 0.17) * diffuseColor.rgb * 3.0, smoothstep(0.0, 2.5, uw) * 0.7);
            diffuseColor.rgb += vec3(0.5, 0.6, 0.45) * caust * 0.35;
          }
        `).replace(`#include <normal_fragment_maps>`,`
          vec3 mapN = mix(texture2D(normalMap, vNormalMapUv).xyz, texture2D(dirtNormal, vNormalMapUv * 1.3).xyz, gDirtBlend) * 2.0 - 1.0;
          mapN.xy *= normalScale * (1.0 - gPuddle);
          mapN.xy += tRings(vWPos.xz, uTime) * gPuddle * 0.8;
          normal = normalize( tbn * mapN );
        `).replace(`#include <roughnessmap_fragment>`,`float roughnessFactor = mix(roughness - wet * (0.25 + gDirtBlend * 0.35), 0.04, gPuddle);`)},f.customProgramCacheKey=()=>`terrain`;let p=this.mesh=new I(a,f);p.receiveShadow=!0,p.name=`terrain`}heightAt(e,t){let n=this.seg+1,r=(e+this.half)/this.step,i=(t+this.half)/this.step;r=Math.max(0,Math.min(this.seg-1e-4,r)),i=Math.max(0,Math.min(this.seg-1e-4,i));let a=Math.floor(r),o=Math.floor(i),s=r-a,c=i-o,l=this.H,u=l[o*n+a],d=l[(o+1)*n+a],f=l[(o+1)*n+a+1],p=l[o*n+a+1];return s+c<=1?u+(p-u)*s+(d-u)*c:f+(d-f)*(1-s)+(p-f)*(1-c)}normalAt(e,t,n=new b){let r=.5,i=this.heightAt(e+r,t)-this.heightAt(e-r,t),a=this.heightAt(e,t+r)-this.heightAt(e,t-r);return n.set(-i,2*r,-a).normalize()}},Wa=`
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`,Ga=`
uniform vec3 zenith; uniform vec3 horizon; uniform vec3 groundCol;
uniform vec3 sunDir; uniform vec3 sunCol; uniform vec3 moonDir;
uniform float cloudCover; uniform float cloudDark; uniform float stars; uniform float time;
uniform float flash; uniform float daylight; uniform float haze; uniform float uPix;
varying vec3 vDir;
float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<6;i++){ s+=a*vnoise(p); p=p*2.03+vec2(1.7,9.2); a*=0.5; } return s; }
void main(){
  vec3 d = normalize(vDir);
  float y = d.y;
  float t = pow(clamp(y,0.0,1.0), 0.45);
  vec3 col = mix(horizon, zenith, t);
  col = mix(col, groundCol, smoothstep(0.0, -0.08, y));
  float sd = max(dot(d, sunDir), 0.0);
  float sunVis = smoothstep(-0.12, 0.02, sunDir.y);
  col += sunCol * (pow(sd, 6.0) * 0.35 + pow(sd, 64.0) * 0.6) * sunVis * (1.0 - cloudCover * 0.75);
  // stars: three layers of point stars in a spherical grid, sized to stay crisp at any zoom
  if (stars > 0.01 && y > -0.05) {
    vec2 sph = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0)));
    float sacc = 0.0; vec3 scol = vec3(0.0);
    for (int L = 0; L < 3; L++) {
      float fl = float(L);
      float cells = 70.0 + fl * 110.0;
      vec2 g = sph * cells / 3.14159;
      vec2 id = floor(g);
      float h = h21(id + fl * 31.7);
      vec2 c = vec2(h21(id + 4.3 + fl), h21(id + 9.1 + fl));
      vec2 off = (g - id - c) * 3.14159 / cells; off.x *= cos(sph.y);
      float dist = length(off);
      float bright = pow(h, 6.0 - fl) * (1.6 - fl * 0.4);
      float r = max(uPix * 0.9, 0.00025);
      float st = smoothstep(r, r * 0.25, dist) * bright;
      float tw = 0.75 + 0.25 * sin(time * (1.5 + h * 7.0) + h * 50.0);
      vec3 tint = mix(vec3(1.0, 0.82, 0.68), vec3(0.75, 0.85, 1.0), h21(id + 2.2));
      scol += tint * st * tw;
    }
    float mw = smoothstep(0.32, 0.0, abs(dot(d, normalize(vec3(0.3, 0.5, -0.8))))) * fbm(d.xz * 9.0 + d.y * 3.0);
    col += (scol * 1.6 + vec3(0.5, 0.55, 0.7) * mw * 0.06) * stars * smoothstep(0.0, 0.15, y);
  }
  // sun disk
  col += sunCol * smoothstep(0.99955, 0.9998, sd) * 18.0 * sunVis * (1.0 - cloudCover * 0.9);
  // moon: a lit sphere with maria, craters and the correct phase from the sun
  float md = dot(d, moonDir);
  vec3 mR = normalize(cross(moonDir, vec3(0.0, 1.0, 0.0))); vec3 mU = cross(mR, moonDir);
  vec2 mp = vec2(dot(d, mR), dot(d, mU)) / 0.0095;
  float mr = length(mp);
  if (md > 0.0 && mr < 1.0) {
    vec3 n = normalize(mR * mp.x + mU * mp.y - moonDir * sqrt(1.0 - mr * mr));
    float lit = clamp(dot(n, normalize(sunDir - moonDir * dot(sunDir, moonDir) + moonDir * 0.0001)), 0.0, 1.0);
    float maria = smoothstep(0.45, 0.7, fbm(mp * 2.2 + 3.0));
    float crat = fbm(mp * 9.0) * 0.25;
    vec3 mc = vec3(0.86, 0.86, 0.82) * (1.0 - maria * 0.35 - crat) * (0.06 + lit * 1.6);
    float edge = smoothstep(1.0, 0.96, mr);
    col = mix(col, mc * (1.0 - cloudCover * 0.85) + col * 0.15, edge * (1.0 - daylight * 0.6));
  }
  col += vec3(0.4, 0.45, 0.6) * pow(max(md, 0.0), 400.0) * 0.2 * (1.0 - cloudCover * 0.6) * (1.0 - daylight);
  // clouds
  if (y > -0.02) {
    vec2 p = d.xz / (y + 0.12) * 1.3 + vec2(time * 0.006, time * 0.0025);
    float n = fbm(p * 1.4);
    float n2 = fbm(p * 3.1 + 5.0);
    float cov = cloudCover;
    float c = smoothstep(1.0 - cov - 0.08, 1.0 - cov + 0.35, n * 0.75 + n2 * 0.35);
    c = clamp(c + cov * cov * 0.6, 0.0, 1.0);
    c *= smoothstep(-0.02, 0.18, y);
    float lit = 0.5 + 0.5 * (n2 - 0.4);
    vec3 cc = mix(horizon * 0.9, vec3(1.0), 0.35) * (0.55 + lit * 0.6) * mix(1.0, 0.45, cloudDark);
    cc += sunCol * pow(sd, 4.0) * 0.4 * sunVis * (1.0 - cloudDark);
    col = mix(col, cc, c * 0.95);
  }
  col = mix(col, horizon, haze * (1.0 - smoothstep(0.0, 0.35, abs(y))));
  col += vec3(0.75,0.8,1.0) * flash * (0.6 + 0.4 * fbm(d.xz * 4.0 + time));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Ka=(e,t,n)=>new F(e,t,n),qa=Ka(.16,.34,.72),Ja=Ka(.6,.72,.86),Ya=Ka(.2,.24,.42),Xa=Ka(1,.5,.26),Za=Ka(.004,.008,.02),Qa=Ka(.02,.03,.055),$a=new F,eo=class{constructor(e,t,n){this.uniforms={zenith:{value:new F},horizon:{value:new F},groundCol:{value:new F},sunDir:{value:new b(0,1,0)},sunCol:{value:new F(1,1,1)},moonDir:{value:new b(0,-1,0)},cloudCover:{value:.3},cloudDark:{value:0},stars:{value:0},time:{value:0},flash:{value:0},uPix:{value:.002},daylight:{value:1},haze:{value:0}};let r=new d({uniforms:this.uniforms,vertexShader:Wa,fragmentShader:Ga,side:1,depthWrite:!1,fog:!1});this.mesh=new I(new V(900,48,24),r),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10,e.add(this.mesh),this.envScene=new ce,this.envMesh=new I(this.mesh.geometry,r),this.envScene.add(this.envMesh),this.pmrem=new $t(t),this.renderer=t,this.scene=e,this.envTimer=99,this.lastEnvKey=-1,this.sun=new M(16777215,2),this.sun.castShadow=n.shadows;let i=this.sun.shadow;i.mapSize.set(n.shadowSize,n.shadowSize),i.camera.left=-38,i.camera.right=38,i.camera.top=38,i.camera.bottom=-38,i.camera.near=1,i.camera.far=220,i.bias=-4e-4,i.normalBias=.04,e.add(this.sun,this.sun.target),this.hemi=new y(12571903,3813408,.6),e.add(this.hemi),this.fogColor=new F,this.state={daylight:1,night:0,sunElev:1},this.sunDir=new b,this.moonDir=new b}update(e,t,n,r,i){let a=(t-6)/24*Math.PI*2;this.sunDir.set(Math.cos(a),Math.sin(a)*.86,.42).normalize(),this.moonDir.set(Math.cos(a+Math.PI)*.9,Math.sin(a+Math.PI)*.8,-.35).normalize();let o=this.sunDir.y,s=U(-.12,.2,o),c=U(.35,.05,Math.abs(o-.03))*U(-.2,0,o),l=pt(n.cloud*.85+n.rain*.3,0,1),u=pt(n.storm*.8+n.rain*.35,0,1),d=this.uniforms;d.zenith.value.copy(Za).lerp(qa,s).lerp(Ya,c*.6),d.horizon.value.copy(Qa).lerp(Ja,s).lerp(Xa,c*.75);let f=(.08+.55*s)*(1-u*.55);$a.setRGB(f*.95,f,f*1.05),d.zenith.value.lerp($a,l*.85),$a.multiplyScalar(1.1),d.horizon.value.lerp($a,l*.8),d.horizon.value.lerp($a.setRGB(.5,.52,.55).multiplyScalar(.1+s*.9),n.fog*.7),d.groundCol.value.copy(d.horizon.value).multiplyScalar(.6),d.sunCol.value.setRGB(1,st(.55,.92,U(0,.35,o)),st(.3,.82,U(0,.4,o))),d.sunDir.value.copy(this.sunDir),d.moonDir.value.copy(this.moonDir),d.cloudCover.value=pt(n.cloud,0,1),d.cloudDark.value=u,d.stars.value=(1-s)*(1-l),d.time.value=i,d.daylight.value=s,d.haze.value=pt(n.fog*.9+n.rain*.3,0,1),d.flash.value=n.flash;let p=o>-.04,m=p?this.sunDir:this.moonDir,h=U(-.04,.18,o)*3.2*(1-l*.78),g=U(0,.25,this.moonDir.y)*.32*(1-l*.75);this.sun.intensity=(p?h:g)+n.flash*2.5,p?this.sun.color.copy(d.sunCol.value).lerp($a.setRGB(.85,.88,.95),l):this.sun.color.setRGB(.6,.7,1),this.sun.position.copy(r).addScaledVector(m,100),this.sun.target.position.copy(r),this.sun.target.updateMatrixWorld(),this.hemi.color.copy(d.zenith.value).lerp(d.horizon.value,.5).multiplyScalar(1),this.hemi.groundColor.setRGB(.18,.15,.1).multiplyScalar(.25+s*.75),this.hemi.intensity=.12+s*1+n.flash*3,this.fogColor.copy(d.horizon.value).lerp(d.zenith.value,.25),this.state.daylight=s,this.state.night=1-s,this.state.sunElev=o,this.state.sunset=c,this.state.overcast=l,this.envTimer+=e;let _=Math.round(o*40)*1e3+Math.round(n.cloud*12)*10+Math.round(n.fog*5);if(_!==this.lastEnvKey&&this.envTimer>1.5||this.envTimer>30){this.envTimer=0,this.lastEnvKey=_;let e=d.flash.value;d.flash.value=0;let t=this.pmrem.fromScene(this.envScene,0,1,1e3);d.flash.value=e,this.envRT&&this.envRT.dispose(),this.envRT=t,this.scene.environment=t.texture}}},to={clear:{cloud:.12,rain:0,fog:.04,wind:.22,storm:0},cloudy:{cloud:.72,rain:0,fog:.14,wind:.45,storm:0},rain:{cloud:.93,rain:.62,fog:.3,wind:.5,storm:0},storm:{cloud:1,rain:1,fog:.35,wind:.95,storm:1},fog:{cloud:.6,rain:.06,fog:1,wind:.08,storm:0}},no=[[`rain`,30],[`cloudy`,24],[`clear`,20],[`fog`,14],[`storm`,12]],ro=`
attribute vec4 aSeed; attribute float aEnd;
uniform vec3 uCam; uniform float uTime; uniform vec3 uBox; uniform float uAmount; uniform vec2 uWind;
uniform vec4 uRoof; uniform float uRoofY; uniform vec4 uRoof2; uniform float uRoof2Y;
varying float vA;
void main(){
  float speed = 8.5 + aSeed.w * 3.5;
  float fall = mod(aSeed.y * uBox.y + uTime * speed, uBox.y);
  vec3 p;
  p.y = uCam.y + uBox.y * 0.55 - fall;
  p.x = uCam.x + mod(aSeed.x * uBox.x + uWind.x * fall * 0.12 - uCam.x, uBox.x) - uBox.x * 0.5;
  p.z = uCam.z + mod(aSeed.z * uBox.z + uWind.y * fall * 0.12 - uCam.z, uBox.z) - uBox.z * 0.5;
  vec3 v = normalize(vec3(uWind.x * 0.12, -1.0, uWind.y * 0.12));
  p += v * aEnd * (0.32 + aSeed.w * 0.2);
  float hidden = step(uAmount, fract(aSeed.w * 7.31));
  if (p.x > uRoof.x && p.x < uRoof.z && p.z > uRoof.y && p.z < uRoof.w && p.y < uRoofY) hidden = 1.0;
  if (p.x > uRoof2.x && p.x < uRoof2.z && p.z > uRoof2.y && p.z < uRoof2.w && p.y < uRoof2Y) hidden = 1.0;
  vA = aEnd;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  if (hidden > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,io=`
uniform vec3 uColor; uniform float uOpacity; varying float vA;
void main(){ gl_FragColor = vec4(uColor, uOpacity * (0.25 + vA * 0.75)); }`,ao=class{constructor(e,t,n){this.w={cloud:.9,rain:.6,fog:.3,wind:.5,storm:0,flash:0,wet:.8},this.target={...to.rain},this.mode=`auto`,this.autoName=`rain`,this.autoTimer=240+Math.random()*120,this.rnd=z(Date.now()&65535),this.lightningTimer=6,this.flashSeq=[],this.onThunder=null,this.windDir=new W(1,.3).normalize(),this.groundQuery=n;let r=t.rain,i=new Float32Array(r*2*4),a=new Float32Array(r*2),o=new Float32Array(r*2*3),s=z(3);for(let e=0;e<r;e++){let t=[s(),s(),s(),s()];for(let n=0;n<2;n++)i.set(t,(e*2+n)*4),a[e*2+n]=n}let c=new Ye;c.setAttribute(`position`,new nt(o,3)),c.setAttribute(`aSeed`,new nt(i,4)),c.setAttribute(`aEnd`,new nt(a,1)),this.rainU={uCam:{value:new b},uTime:{value:0},uBox:{value:new b(44,22,44)},uAmount:{value:0},uWind:{value:new W},uRoof:{value:new ve(-6.8,-4.2,6.8,4.2)},uRoofY:{value:5.9},uRoof2:{value:new ve(-6.5,3.5,2.8,6.6)},uRoof2Y:{value:3.3},uColor:{value:new F(.75,.8,.88)},uOpacity:{value:.35}};let l=new d({uniforms:this.rainU,vertexShader:ro,fragmentShader:io,transparent:!0,depthWrite:!1,fog:!1});this.rain=new $e(c,l),this.rain.frustumCulled=!1,e.add(this.rain),this.splashN=t.rain>5e3?260:120;let u=new Float32Array(this.splashN*3);this.splashLife=new Float32Array(this.splashN);let p=new Ye;p.setAttribute(`position`,new nt(u,3)),this.splashAlpha=new Float32Array(this.splashN),p.setAttribute(`alpha`,new nt(this.splashAlpha,1));let m=new d({uniforms:{uColor:this.rainU.uColor,uSize:{value:70}},vertexShader:`attribute float alpha; varying float vA; uniform float uSize; void main(){ vA = alpha; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = uSize * (0.3 + (1.0-alpha)) / -mv.z; gl_Position = projectionMatrix*mv; }`,fragmentShader:`uniform vec3 uColor; varying float vA; void main(){ vec2 c = gl_PointCoord-0.5; float d = length(c); float ring = smoothstep(0.5,0.35,d)*smoothstep(0.15,0.3,d); gl_FragColor = vec4(uColor, ring*vA*0.35); }`,transparent:!0,depthWrite:!1});this.splash=new f(p,m),this.splash.frustumCulled=!1,e.add(this.splash),this.fog=new g(8947848,.01),e.fog=this.fog}setMode(e){this.mode=e,e===`auto`?(this.autoTimer=200,this.target={...to[this.autoName]}):this.target={...to[e]}}pickAuto(){let e=no.reduce((e,t)=>e+t[1],0),t=this.rnd()*e,n=`rain`;for(let[e,r]of no)if((t-=r)<=0){n=e;break}n===this.autoName&&(n=`cloudy`),this.autoName=n,this.target={...to[n]},this.autoTimer=180+this.rnd()*260}get name(){return this.mode===`auto`?this.autoName:this.mode}update(e,t,n,r){let i=this.w;this.mode===`auto`&&(this.autoTimer-=e,this.autoTimer<=0&&this.pickAuto());let a=1-Math.exp(-e/35);for(let e of[`cloud`,`rain`,`fog`,`wind`,`storm`])i[e]+=(this.target[e]-i[e])*a;let o=pt(i.rain*1.5,0,1);i.wet+=(o-i.wet)*(1-Math.exp(-e/(o>i.wet?20:150)));let s=.75+.25*Math.sin(t*.31)*Math.sin(t*.13+1.3);if(i.gust=i.wind*s,this.windDir.set(Math.cos(t*.01),.3+Math.sin(t*.017)*.3).normalize(),i.storm>.5&&(this.lightningTimer-=e,this.lightningTimer<=0)){this.lightningTimer=7+this.rnd()*22;let e=this.rnd()*.6+.4;this.flashSeq=[[0,e],[.07,0],[.12,e*.7],[.2,.15],[.32,e*.9],[.45,0]],this.flashT=0;let t=.3+this.rnd()*.7;this.onThunder?.(t,.8+t*3.5)}if(this.flashSeq.length){this.flashT+=e;let t=0;for(let[e,n]of this.flashSeq)this.flashT>=e&&(t=n);i.flash=t,this.flashT>.5&&(this.flashSeq=[],i.flash=0)}else i.flash=0;let c=this.rainU;c.uCam.value.copy(n.position),c.uTime.value=t,c.uAmount.value=pt(i.rain*1.05,0,1),c.uWind.value.set(this.windDir.x,this.windDir.y).multiplyScalar(i.gust*9);let l=.12+r.state.daylight*.75+i.flash;c.uColor.value.setRGB(.7*l,.75*l,.82*l),this.rain.visible=i.rain>.02;let u=this.splash.geometry.attributes.position,d=i.rain*this.splashN*3*e;for(let t=0;t<this.splashN;t++)if(this.splashLife[t]>0)this.splashLife[t]-=e*3.5,this.splashAlpha[t]=Math.max(0,this.splashLife[t]);else if(d>0&&this.rnd()<d){--d;let e=this.rnd()*Math.PI*2,r=1+Math.sqrt(this.rnd())*13,i=n.position.x+Math.cos(e)*r,a=n.position.z+Math.sin(e)*r,o=this.groundQuery(i,a,n.position.y);if(o===null){this.splashAlpha[t]=0;continue}u.setXYZ(t,i,o+.03,a),this.splashLife[t]=1,this.splashFx&&r<9&&this.splashFx(i,o,a)}else this.splashAlpha[t]=0;u.needsUpdate=!0,this.splash.geometry.attributes.alpha.needsUpdate=!0,this.splash.visible=i.rain>.05;let f=r.state.night;this.fog.density=.0028+i.fog*.03+i.rain*.005+f*.002,this.fog.color.copy(r.fogColor)}},oo=class e extends I{constructor(t,n={}){super(t),this.isReflector=!0,this.type=`Reflector`,this.forceUpdate=!1,this._reflectionCameras=new WeakMap;let r=this,i=n.color===void 0?new F(8355711):new F(n.color),a=n.textureWidth||512,s=n.textureHeight||512,c=n.clipBias||0,l=n.shader||e.ReflectorShader,u=n.multisample===void 0?4:n.multisample,f=new o,p=new b,m=new b,h=new b,g=new yt,_=new b(0,0,-1),v=new ve,y=new b,x=new b,S=new ve,C=new yt,w=new be(a,s,{samples:u,type:ot}),T=new d({name:l.name===void 0?`unspecified`:l.name,uniforms:N.clone(l.uniforms),fragmentShader:l.fragmentShader,vertexShader:l.vertexShader});T.uniforms.tDiffuse.value=w.texture,T.uniforms.color.value=i,T.uniforms.textureMatrix.value=C,this.material=T,this.onBeforeRender=function(e,t,n){let i=this.getReflectionCamera(n);if(m.setFromMatrixPosition(r.matrixWorld),h.setFromMatrixPosition(n.matrixWorld),g.extractRotation(r.matrixWorld),p.set(0,0,1),p.applyMatrix4(g),y.subVectors(m,h),y.dot(p)>0&&this.forceUpdate===!1)return;y.reflect(p).negate(),y.add(m),g.extractRotation(n.matrixWorld),_.set(0,0,-1),_.applyMatrix4(g),_.add(h),x.subVectors(m,_),x.reflect(p).negate(),x.add(m),i.position.copy(y),i.up.set(0,1,0),i.up.applyMatrix4(g),i.up.reflect(p),i.lookAt(x),i.far=n.far,i.updateMatrixWorld(),i.projectionMatrix.copy(n.projectionMatrix),i.projectionMatrix.elements[8]*=-1,i.projectionMatrix.elements[12]*=-1,C.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),C.multiply(i.projectionMatrix),C.multiply(i.matrixWorldInverse),C.multiply(r.matrixWorld),f.setFromNormalAndCoplanarPoint(p,m),f.applyMatrix4(i.matrixWorldInverse),v.set(f.normal.x,f.normal.y,f.normal.z,f.constant);let a=i.projectionMatrix;i.isOrthographicCamera?(S.x=(Math.sign(v.x)+a.elements[8])/a.elements[0],S.y=(Math.sign(v.y)+a.elements[9])/a.elements[5],S.z=-n.far,S.w=1):(S.x=(Math.sign(v.x)+a.elements[8])/a.elements[0],S.y=(Math.sign(v.y)+a.elements[9])/a.elements[5],S.z=-1,S.w=(1+a.elements[10])/a.elements[14]),v.multiplyScalar(2/v.dot(S)),a.elements[2]=v.x,a.elements[6]=v.y,i.isOrthographicCamera?(a.elements[10]=v.z-c,a.elements[14]=v.w-1):(a.elements[10]=v.z+1-c,a.elements[14]=v.w),r.visible=!1;let o=e.getRenderTarget(),s=e.xr.enabled,l=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(w),e.state.buffers.depth.setMask(!0),e.autoClear===!1&&e.clear(),e.render(t,i),e.xr.enabled=s,e.shadowMap.autoUpdate=l,e.setRenderTarget(o);let u=n.viewport;u!==void 0&&e.state.viewport(u),r.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return w},this.dispose=function(){w.dispose(),r.material.dispose()},this.getReflectionCamera=function(e){let t=this._reflectionCameras.get(e);return t===void 0&&(t=e.clone(),this._reflectionCameras.set(e,t)),t}}};oo.ReflectorShader={name:`ReflectorShader`,uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var so=`
uniform mat4 textureMatrix;
varying vec4 vMirror; varying vec3 vWorld;
#include <common>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
void main(){
  vMirror = textureMatrix * vec4(position, 1.0);
  vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <logdepthbuf_vertex>
  #include <fog_vertex>
}`,co=`
uniform sampler2D tDiffuse; uniform vec3 color; uniform float uMirror;
uniform sampler2D uNormal; uniform sampler2D uDepth; uniform vec4 uDepthRect;
uniform float uTime; uniform float uRain; uniform float uWind; uniform float uDay;
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uZenith; uniform vec3 uHorizon;
uniform vec3 uShallow; uniform vec3 uDeep; uniform float uUnder;
varying vec4 vMirror; varying vec3 vWorld;
#include <common>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 rainRings(vec2 p, float t, float amount){
  vec2 n = vec2(0.0);
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    vec2 g = p * (2.2 + fl * 0.9) + fl * 17.3;
    vec2 id = floor(g); vec2 f = fract(g) - 0.5;
    float r = h21(id + fl * 7.0);
    if (r > amount) continue;
    vec2 c = vec2(h21(id + 3.1), h21(id + 9.7)) - 0.5; c *= 0.6;
    float ph = fract(t * (0.9 + r * 0.6) + r * 13.0);
    vec2 d = f - c; float dl = length(d);
    float w = dl - ph * 0.42;
    float ring = exp(-w * w * 700.0) * (1.0 - ph) * (1.0 - ph);
    n += d / max(dl, 1e-3) * ring * sin(w * 90.0);
  }
  return n;
}
vec3 tn(vec2 uv){ vec3 t = texture2D(uNormal, uv).xyz * 2.0 - 1.0; return t; }
void main(){
  #include <logdepthbuf_fragment>
  vec2 p = vWorld.xz;
  vec3 a = tn(p * 0.045 + vec2(uTime * 0.010, uTime * 0.006));
  vec3 b = tn(p * 0.13 - vec2(uTime * 0.017, -uTime * 0.011));
  vec3 c = tn(p * 0.42 + vec2(uTime * 0.045, uTime * 0.028));
  vec2 nxy = (a.xy * 0.9 + b.xy * 0.6 + c.xy * 0.35) * (0.22 + uWind * 0.75);
  nxy += rainRings(p, uTime, uRain) * 0.55 * min(1.0, uRain * 2.0);
  vec3 N = normalize(vec3(nxy.x, 1.0, nxy.y));
  vec3 V = normalize(cameraPosition - vWorld);
  if (!gl_FrontFacing) {
    // seen from below: a bright window to the sky overhead, darkening to total internal reflection
    float up = clamp(-V.y, 0.0, 1.0);
    float win = smoothstep(0.62, 0.8, up + nxy.x * 0.2);
    vec3 skyc = mix(uHorizon, uZenith, 0.5) * (0.6 + uDay * 0.8) + uSunCol * pow(max(dot(-V, uSunDir), 0.0), 40.0) * 2.0;
    vec3 deepc = uShallow * (0.15 + uDay * 0.5);
    gl_FragColor = vec4(mix(deepc, skyc, win), 0.96);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
    return;
  }
  float ndv = max(dot(N, V), 0.0);
  float fres = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);
  vec3 R = reflect(-V, N);
  vec3 refl = mix(uHorizon, uZenith, pow(clamp(R.y, 0.0, 1.0), 0.5));
  if (uMirror > 0.5) {
    vec4 mc = vMirror; mc.xy += N.xz * 0.9 * mc.w * 0.04;
    refl = mix(refl, texture2DProj(tDiffuse, mc).rgb, 0.92);
  }
  vec2 duv = (p - uDepthRect.xy) / uDepthRect.zw;
  float depth = max(0.0, texture2D(uDepth, duv).r);
  float path = depth / max(V.y, 0.12);
  vec3 body = mix(uShallow, uDeep, 1.0 - exp(-path * 0.28)) * (0.18 + uDay * 0.82);
  float clarity = 1.0 - exp(-path * 0.75);           // 0 = perfectly clear
  vec3 col = mix(body, refl, fres);
  float alpha = max(clarity, fres);
  // sun glints
  vec3 H = normalize(uSunDir + V);
  col += uSunCol * (pow(max(dot(N, H), 0.0), 600.0) * 6.0 + pow(max(dot(N, H), 0.0), 60.0) * 0.12);
  // gentle foam line along the shore
  float shore = smoothstep(0.16, 0.0, depth) * (0.55 + 0.45 * sin(uTime * 1.3 + depth * 55.0 + h21(floor(p * 3.0)) * 3.0));
  col = mix(col, vec3(0.92, 0.95, 0.96) * (0.15 + uDay * 0.85), shore * 0.45);
  alpha = max(alpha, shore * 0.5);
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`,lo=class{constructor(e,t,n,r){let i=q.rx*2+70,a=q.rz*2+70,o=new Tt(i,a,1,1),s=new Float32Array(36864),c=q.x-i/2,l=q.z-a/2;for(let e=0;e<192;e++)for(let t=0;t<192;t++)s[e*192+t]=Wi-r.heightAt(c+(t+.5)/192*i,l+(e+.5)/192*a);let u=new We(s,192,192,Xe,fe);u.magFilter=u.minFilter=St,u.needsUpdate=!0,this.depthTex=u;let f=n.water,p=N.merge([G.fog,{color:{value:new F(1,1,1)},tDiffuse:{value:null},textureMatrix:{value:new yt},uMirror:{value:0},uNormal:{value:null},uDepth:{value:null},uDepthRect:{value:new ve(c,l,i,a)},uTime:{value:0},uRain:{value:0},uWind:{value:.3},uDay:{value:1},uSunDir:{value:new b(0,1,0)},uSunCol:{value:new F},uZenith:{value:new F},uHorizon:{value:new F},uShallow:{value:new F(.16,.26,.22)},uDeep:{value:new F(.02,.06,.07)},uUnder:{value:0}}]);this.reflective=t.waterReflections>0;let m={uniforms:p,vertexShader:so,fragmentShader:co};if(this.reflective)this.mesh=new oo(o,{textureWidth:t.waterReflections,textureHeight:t.waterReflections,clipBias:.02,shader:m}),this.mesh.material.uniforms.uMirror.value=1;else{let e=new d(m);this.mesh=new I(o,e)}let h=this.mesh.material;h.transparent=!0,h.fog=!0,h.depthWrite=!0,h.side=2,h.uniforms.uNormal.value=f,h.uniforms.uDepth.value=u,this.u=h.uniforms,this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(q.x,Wi,q.z),this.mesh.name=`lake`,this.mesh.renderOrder=1,e.add(this.mesh)}update(e,t,n,r){let i=r.w,a=this.u;a.uTime.value=t,a.uRain.value=i.rain,a.uWind.value+=(i.gust-a.uWind.value)*Math.min(1,e),a.uDay.value=n.state.daylight,a.uSunDir.value.copy(n.sun.position).sub(n.sun.target.position).normalize(),a.uSunCol.value.copy(n.sun.color).multiplyScalar(Math.min(1.2,n.sun.intensity/2.5)),a.uZenith.value.copy(n.uniforms.zenith.value),a.uHorizon.value.copy(n.uniforms.horizon.value)}};function uo(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Ye;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=fo(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=fo(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function fo(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new nt(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var po={uTime:{value:0},uWind:{value:.4}};function mo(e,t){e.onBeforeCompile=e=>{e.vertexShader=`varying vec3 vWN;
`+e.vertexShader.replace(`#include <beginnormal_vertex>`,`#include <beginnormal_vertex>
vWN = normalize(mat3(modelMatrix) * objectNormal);`),e.fragmentShader=`varying vec3 vWN;
`+e.fragmentShader.replace(`#include <map_fragment>`,`#include <map_fragment>
      float mossN = fract(sin(dot(floor(vMapUv * 40.0), vec2(12.9898, 78.233))) * 43758.5453);
      float moss = smoothstep(0.35, 0.8, vWN.y + (mossN - 0.5) * 0.25) * ${t.toFixed(2)};
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.22, 0.07) * (0.8 + mossN * 0.4), moss);`)},e.customProgramCacheKey=()=>`moss`+t}function ho(e,t,n,r){e.onBeforeCompile=e=>{e.uniforms.uTime=po.uTime,e.uniforms.uWind=po.uWind,e.vertexShader=`uniform float uTime;
uniform float uWind;
`+e.vertexShader.replace(`#include <begin_vertex>`,`
      vec3 transformed = vec3(position);
      #ifdef USE_INSTANCING
        vec3 iPos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
      #else
        vec3 iPos = vec3(modelMatrix[3][0], modelMatrix[3][1], modelMatrix[3][2]);
      #endif
      float hh = max(position.y, 0.0) * ${n.toFixed(3)};
      float ph = iPos.x * 0.07 + iPos.z * 0.05;
      float sway = sin(uTime * 1.2 + ph) * 0.6 + sin(uTime * 2.6 + ph * 1.7) * 0.3 + sin(uTime * 6.3 + ph * 3.1 + position.x * 5.0 + position.z * 3.0) * 0.18;
      float k = hh * hh * (uWind * 0.85 + 0.12) * ${t.toFixed(3)};
      transformed.x += (sway + uWind * 0.9) * k;
      transformed.z += sin(uTime * 1.05 + ph * 1.3 + position.y) * 0.5 * k;
    `)},e.customProgramCacheKey=()=>`wind-`+r}function go(e,t){let n=new Tt(e,t,1,2);n.translate(0,t/2,0);let r=n.attributes.position;for(let e=0;e<r.count;e++){let n=r.getY(e)/t;r.setZ(e,-n*n*t*.25)}return n}function _o(e,t,n=.5){let r=e.attributes.position,i=e.attributes.normal,a=new b;for(let e=0;e<r.count;e++)a.set(r.getX(e)-t.x,r.getY(e)-t.y,r.getZ(e)-t.z).normalize(),a.y+=n,a.normalize(),i.setXYZ(e,a.x,a.y,a.z)}function vo(e,t=.14){let n=z(e),r=new u(.012,.03,1,8,1);r.translate(0,.5,0);let i=[];for(let e=0;e<17;e++){let r=e/17,a=t+.02+r*(.96-t),o=(.25*(1-r)+.05)*(.8+n()*.4),s=Math.max(5,Math.round(11-r*6));for(let t=0;t<s;t++){let c=t/s*Math.PI*2+n()*.8+e*.9,l=o*(.75+n()*.45),u=go(l*(.7+n()*.3),l);u.rotateY(n()*Math.PI),u.rotateZ(-Math.PI/2-.25-n()*.35+r*.5),u.rotateY(c),u.translate(0,a+(n()-.5)*.03,0),i.push(u)}for(let e=0;e<2;e++){let e=go(o*.6,o*.55);e.rotateZ(-Math.PI/2+.6),e.rotateY(n()*6.28),e.translate(0,a,0),i.push(e)}}for(let e=0;e<3;e++){let t=go(.06,.09);t.rotateY(e*1.05),t.translate(0,.94,0),i.push(t)}let a=uo(i.map(e=>(e.toNonIndexed,e)));return _o(a,new b(0,.45,0),.6),{trunk:r,foliage:a}}function yo(e){let t=z(e),n=new u(.01,.022,1,7,3),r=n.attributes.position;for(let t=0;t<r.count;t++){let n=r.getY(t)+.5;r.setX(t,r.getX(t)+Math.sin(n*4+e)*.012*n)}n.translate(0,.5,0);let i=[];for(let e=0;e<46;e++){let e=.42+t()*.55,n=.17*Math.sin((e-.4)/.6*Math.PI)+.03,r=t()*Math.PI*2,a=.16+t()*.08,o=new Tt(a,a);o.rotateX(-.6+t()*1.2),o.rotateY(t()*Math.PI),o.translate(Math.cos(r)*n*t(),e,Math.sin(r)*n*t()),i.push(o)}let a=uo(i);return _o(a,new b(0,.65,0),.4),{trunk:n,foliage:a}}function bo(e){let t=z(e),n=[],r=new u(.028,.05,.5,9,4),i=r.attributes.position;for(let e=0;e<i.count;e++){let t=i.getY(e)+.25,n=Math.atan2(i.getZ(e),i.getX(e)),r=1+Math.sin(n*5+t*9)*.08+Math.max(0,.08-t)*4;i.setX(e,i.getX(e)*r),i.setZ(e,i.getZ(e)*r)}r.translate(0,.25,0),n.push(r.toNonIndexed());let a=[];for(let e=0;e<6;e++){let r=e/6*Math.PI*2+t()*.6,i=.55+t()*.45,o=.22+t()*.12,s=new b(Math.cos(r)*.8,i,Math.sin(r)*.8).normalize(),c=new u(.008,.02,o,6);c.translate(0,o/2,0),c.applyQuaternion(new l().setFromUnitVectors(new b(0,1,0),s)),c.translate(0,.42,0),n.push(c.toNonIndexed()),a.push(new b(0,.42,0).addScaledVector(s,o))}a.push(new b(0,.82,0));let o=uo(n),s=[];for(let e of a){let n=.16+t()*.06;for(let r=0;r<26;r++){let r=t()*2-1,i=t()*Math.PI*2,a=Math.cbrt(t())*n,o=new b(Math.sqrt(1-r*r)*Math.cos(i),r*.75,Math.sqrt(1-r*r)*Math.sin(i)).multiplyScalar(a).add(e),c=.13+t()*.06,l=new Tt(c,c);l.rotateX(-.7+t()*1.4),l.rotateY(t()*Math.PI),l.translate(o.x,o.y,o.z),s.push(l)}}let c=uo(s);return _o(c,new b(0,.6,0),.5),{trunk:o,foliage:c}}function xo(e){let t=z(e),n=[],r=[];for(let e=0;e<14;e++){let e=t()*Math.PI*2,i=Math.sqrt(t())*.8,a=6+t()*4,o=.022+t()*.016,s=(t()-.5)*.16,c=Math.cos(e)*i,l=Math.sin(e)*i,d=new u(o*.7,o,a,7,Math.round(a/.45));d.translate(0,a/2,0);let f=d.attributes.position;for(let e=0;e<f.count;e++){let t=f.getY(e),n=Math.abs(t/.45%1-.5)<.04?1.18:1;f.setX(e,f.getX(e)*n+s*t*t/a),f.setZ(e,f.getZ(e)*n)}d.translate(c,0,l),n.push(d.toNonIndexed());for(let e=0;e<16;e++){let e=a*(.35+t()*.65),n=.45+t()*.35,i=new Tt(n,n*.6);i.rotateX(-.4+t()*.8),i.rotateY(t()*Math.PI),i.translate(c+s*e*e/a+(t()-.5)*.5,e,l+(t()-.5)*.5),r.push(i)}}let i=uo(r);return _o(i,new b(0,6,0),.4),{culms:uo(n),leaves:i}}function So(e){let t=z(e),n=[];for(let e=0;e<34;e++){let e=t()*Math.PI*2,r=t(),i=Math.sqrt(t())*.5,a=.32+t()*.18,o=new Tt(a,a);o.rotateX(-.9+t()*1.8),o.rotateY(t()*Math.PI),o.translate(Math.cos(e)*i,.15+r*.55*(1-i),Math.sin(e)*i),n.push(o)}let r=uo(n);return _o(r,new b(0,.1,0),.6),r}function Co(e){let t=[],n=[],i=[],a=0;for(let r=0;r<14;r++){let r=e()*6.28,o=e()*.25,s=Math.cos(r)*o,c=Math.sin(r)*o,l=.9+e()*.9,u=e()*Math.PI,d=Math.cos(u),f=Math.sin(u),p=(e()-.5)*.3;for(let e=0;e<=3;e++){let r=e/3,i=.012*(1-r*.7),a=p*r*r*l;for(let e of[-1,1]){t.push(s+d*i*e+a,r*l,c+f*i*e);let o=.5+r*.4;n.push(.25*o,.36*o,.12*o)}}for(let e=0;e<3;e++){let t=a+e*2;i.push(t,t+1,t+2,t+1,t+3,t+2)}a+=8}let o=new Ye;o.setAttribute(`position`,new r(t,3)),o.setAttribute(`color`,new r(n,3)),o.setIndex(i),o.computeVertexNormals();let s=[];for(let t=0;t<4;t++){let t=new xe(.018,.12,3,6),n=1.1+e()*.5;t.translate((e()-.5)*.3,n,(e()-.5)*.3),s.push(t.toNonIndexed())}return{leaves:o,heads:uo(s)}}function wo(e){let t=new _e(1,3),n=t.attributes.position,r=new b;for(let t=0;t<n.count;t++){r.fromBufferAttribute(n,t);let i=H(r.x*1.3+e,r.z*1.3+r.y*.7,4)*.35+1;r.multiplyScalar(i),r.y*=.62,n.setXYZ(t,r.x,r.y,r.z)}return t.computeVertexNormals(),t}var To=class{constructor(e,t,n,{radius:r=70,far:i=null,cast:a=!1}={}){this.mats=t,this.radius=r,this.pos=t.map(e=>new b().setFromMatrixPosition(e));let o=(n,r,i)=>{let a=new ne(n,r,Math.max(1,t.length));return a.count=0,a.castShadow=i,a.receiveShadow=!0,a.frustumCulled=!1,a.instanceMatrix.setUsage(p),e.add(a),a};this.near=n.map(([e,t])=>o(e,t,a)),this.far=i?o(i[0],i[1],!1):null,this.last=new b(1e9,0,0)}update(e,t=!1){if(!t&&this.last.distanceToSquared(e)<36)return;this.last.copy(e);let n=this.radius*this.radius,r=0,i=0;for(let t=0;t<this.mats.length;t++){let a=this.pos[t],o=a.x-e.x,s=a.z-e.z;if(o*o+s*s<n){for(let e of this.near)e.setMatrixAt(r,this.mats[t]);r++}else this.far&&(this.far.setMatrixAt(i,this.mats[t]),i++)}for(let e of this.near)e.count=r,e.instanceMatrix.needsUpdate=!0;this.far&&(this.far.count=i,this.far.instanceMatrix.needsUpdate=!0)}};function Eo(e,t,n=16777215){let r=new ce,i=new Ae;for(let[e,n]of t){e.computeBoundingBox(),i.union(e.boundingBox);let t=new I(e,n);r.add(t)}r.add(new Ke(16777215,1));let a=Math.max(i.max.x-i.min.x,i.max.z-i.min.z)*1.02,o=(i.max.y-i.min.y)*1.02,s=new Dt(-a/2,a/2,i.max.y+.01,i.min.y,-5,5);s.position.set(0,0,2),s.lookAt(0,(i.max.y+i.min.y)/2*0,0),s.position.set(0,0,2);let c=Math.min(1024,Math.round(256*o/a/64)*64||512),l=new be(256,c,{generateMipmaps:!0,minFilter:Ue,magFilter:lt}),u=e.getRenderTarget(),d=e.getClearColor(new F),f=e.getClearAlpha(),p=e.shadowMap.enabled;e.shadowMap.enabled=!1,e.setRenderTarget(l),e.setClearColor(0,0),e.clear(),e.render(r,s),e.setRenderTarget(u),e.setClearColor(d,f),e.shadowMap.enabled=p;let m=[];for(let e=0;e<3;e++){let t=new Tt(a,o);t.translate(0,i.min.y+o/2,0),t.rotateY(e/3*Math.PI),m.push(t)}let h=uo(m);return _o(h,new b(0,i.min.y+o*.45,0),.5),[h,new R({map:l.texture,alphaTest:.45,side:2,roughness:.92,color:n})]}function Do(e,t,n,r,i={}){let a=new Map,o=new b;for(let e of r){o.setFromMatrixPosition(e);let t=Math.floor(o.x/90)+`,`+Math.floor(o.z/90);a.has(t)||a.set(t,[]),a.get(t).push(e)}let s=[];for(let r of a.values()){let a=new ne(t,n,r.length);r.forEach((e,t)=>a.setMatrixAt(t,e)),a.instanceMatrix.needsUpdate=!0,a.castShadow=!!i.cast,a.receiveShadow=!!i.receive,a.computeBoundingSphere(),e.add(a),s.push(a)}return s}var Oo=class{constructor(e,t,n,r,i,a){let o=z(2024),s=(e,t)=>r.heightAt(e,t);new yt;let c=new l,d=new b,f=new b,p=new _,m=(e,t,n,r,i,a=0)=>(p.set(a*(o()-.5),i,a*(o()-.5)),c.setFromEuler(p),new yt().compose(f.set(e,t,n),c,d.set(r,r,r))),h=(e,t,n=2.6)=>Math.abs(e-Ki.x)<11&&t>-7&&t<9.5||Math.abs(e-Yi.x)<4&&t>Yi.zStart-4&&t<Yi.zEnd+2||Gi.id===`hollow`&&(Math.hypot(e-qi.x,t-qi.z)<7||Math.hypot(e-Ji.x,t-Ji.z)<7)||La(e,t)<n||s(e,t)<-.2,g=new R({map:n.bark.map,normalMap:n.bark.normalMap,roughness:.95});n.bark.map.repeat.set(3,6),n.bark.normalMap.repeat.set(3,6);let v=new R({map:n.birch.map,normalMap:n.birch.normalMap,roughness:.8});n.birch.map.repeat.set(2,5),n.birch.normalMap.repeat.set(2,5);let y=new R({map:n.pine,alphaTest:.45,side:2,roughness:.92,color:10795164});ho(y,.035,1,`pine`);let x=new R({map:n.leaves,alphaTest:.45,side:2,roughness:.85});ho(x,.06,1,`leaf`),this.materials={barkMat:g,pineMat:y,leafMat:x};let S=[0,1,2].map(e=>vo(100+e*17)),C=[0,1].map(e=>yo(300+e*13)),w=[0,1].map(e=>bo(500+e*29)),T=S.map(()=>[]),E=C.map(()=>[]),D=w.map(()=>[]),O=Gi.id===`hollow`,k=new R({map:O?n.maple:n.leaves,alphaTest:.45,side:2,roughness:.8,color:O?16777215:10465402});ho(k,.05,1,`oak`);let A=O?new R({map:n.mapleGold,alphaTest:.45,side:2,roughness:.8}):k;O&&ho(A,.05,1,`oak2`),O&&(x.map=n.ginkgo,x.color.set(16777215),v.map=n.bark.map,v.normalMap=n.bark.normalMap,v.color.set(9076848));let j=new R({map:n.bark.map,normalMap:n.bark.normalMap,roughness:.95,color:10128512});for(let[e,t,n]of O?[[12,-9.5,13],[-11,9,12],[10,12,11],[-16,-6,14],[33,-24,16],[-30,20,13],[24,26,12]]:[[15,9,15],[-17,13,13],[24,-6,16],[-12,-14,14],[30,30,17]]){let r=s(e,t)-.1;D[e>0|0].push(m(e,r,t,n,e*.37,.02)),this.trees_pending=(this.trees_pending||[]).concat([[e,t,n*.045,r,n]])}this.trees=[];let M=t.trees,ee=0,te=0,re=new Map;for(;te<M&&ee<M*40;){ee++;let e=(o()*2-1)*300,t=(o()*2-1)*300,n=Math.hypot(e,t);if(n>300)continue;let r=n>185?.8:Math.min(1,za(e,t)*1.25);if(o()>r||h(e,t))continue;{let n=Math.floor(e/4)+`,`+Math.floor(t/4),r=!0;for(let n=-1;n<=1&&r;n++)for(let i=-1;i<=1&&r;i++){let a=re.get(Math.floor(e/4)+n+`,`+(Math.floor(t/4)+i));if(a){for(let n of a)if((n.x-e)**2+(n.z-t)**2<7.5){r=!1;break}}}if(!r)continue;re.has(n)||re.set(n,[]),re.get(n).push({x:e,z:t})}let a=s(e,t)-.15,c=Ra(e,t)<1.6,l=Gi.id===`hollow`,u=(l?o()<.14:c?o()<.45:o()<.12)&&n<175,d=!u&&n<175&&(l?o()<.68:r<.75&&o()<.18),f=u?9+o()*6:d?10+o()*7:11+o()*13,p=m(e,a,t,f,o()*Math.PI*2,.06);u?E[Math.floor(o()*C.length)].push(p):d?D[Math.floor(o()*w.length)].push(p):T[Math.floor(o()*S.length)].push(p);let g=f*(u?.022:d?.045:.03);this.trees.push({x:e,z:t,r:g,birch:u}),n<180&&i.addCylinder(e,t,Math.max(.18,g),a,a+f),te++}s(qi.x,qi.z)-.2,Gi.id!==`hollow`&&this.trees.push({x:qi.x,z:qi.z,r:.8});for(let[e,t,n,r,a]of this.trees_pending)this.trees.push({x:e,z:t,r:n}),i.addCylinder(e,t,n,r,r+a*.4);let ie=t.shadows;this.meshes=[],new R({vertexColors:!0,roughness:.95});let N=t.treeLOD;this.lods=[];let oe=(t,n)=>{t.length&&this.lods.push(new To(e,t,n,{radius:N,far:a?Eo(a,n):null,cast:ie}))};if(S.forEach((e,t)=>oe(T[t],[[e.trunk,g],[e.foliage,y]])),C.forEach((e,t)=>oe(E[t],[[e.trunk,v],[e.foliage,x]])),w.forEach((e,t)=>oe(D[t],[[e.trunk,j],[e.foliage,t===1?A:k]])),O){let r=[0,1].map(e=>xo(900+e*5)),a=new R({color:7309890,roughness:.4,map:n.birch.map});ho(a,.22,.11,`bamboo`);let c=new R({map:n.leaves,alphaTest:.45,side:2,roughness:.7,color:12114064});ho(c,.22,.11,`bambooleaf`);let l=[[],[]];for(let e=0;e<900&&l[0].length+l[1].length<140;e++){let[t,n]=e%3==0?[-24+(o()-.5)*34,-24+(o()-.5)*30]:[(o()-.5)*260,(o()-.5)*260];h(t,n,2.2)||e%3!=0&&o()<.85||(l[e%2].push(m(t,s(t,n)-.05,n,.9+o()*.3,o()*6.28)),Math.hypot(t,n)<175&&i.addCylinder(t,n,.75,s(t,n),s(t,n)+8))}r.forEach((t,n)=>{l[n].length&&this.lods.push(new To(e,l[n],[[t.culms,a],[t.leaves,c]],{radius:N*1.4,cast:ie}))});let u=new Tt(.9,.9);u.rotateX(-Math.PI/2);let d=new R({map:n.maple,alphaTest:.5,roughness:.9,side:2}),f=[];for(let e=0;e<6e3&&f.length<(t.key===`low`?900:2600);e++){let e=(o()-.5)*220,t=(o()-.5)*220;s(e,t)<-.35||Math.abs(e)<7&&t>-5.5&&t<6.5||o()>.25+za(e,t)*.7||f.push(m(e,s(e,t)+.015+o()*.01,t,.6+o()*.9,o()*6.28,.12))}this.lods.push(new To(e,f,[[u,d]],{radius:40}))}let se=vo(901,.42);if(!O){let t=new yt().compose(new b(qi.x,s(qi.x,qi.z)-.2,qi.z),new l,new b(26,26,26));for(let[n,r]of[[se.trunk,g],[se.foliage,y]]){let i=new I(n,r);i.applyMatrix4(t),i.castShadow=ie,i.receiveShadow=!0,e.add(i)}}let ce=new R({map:n.leaves,alphaTest:.42,side:2,roughness:.82,color:9085040});ho(ce,.12,1.2,`bush`);let le=[0,1,2].map(e=>So(700+e*7)),ue=le.map(()=>[]),de=Math.round(t.ferns*.9);for(ee=0;ue.flat().length<de&&ee<de*40;){ee++;let e=(o()*2-1)*160,t=(o()*2-1)*160,n=za(e,t),r=1-Math.abs(n-.45)*2;if(o()>Math.max(.05,r)||h(e,t,1.6))continue;let a=.8+o()*1.1;ue[ee%3].push(m(e,s(e,t)-.05,t,a,o()*6.28,.2)),a>1.4&&Math.hypot(e,t)<175&&i.addCylinder(e,t,.35*a,s(e,t),s(e,t)+a*.6)}le.forEach((t,n)=>{ue[n].length&&this.lods.push(new To(e,ue[n],[[t,ce]],{radius:N*.9,cast:ie}))});let fe=Co(z(3)),pe=new R({vertexColors:!0,side:2,roughness:.8});ho(pe,.12,.9,`reed`);let me=new R({color:4861466,roughness:.9});ho(me,.12,.9,`reedhead`);let he=[];for(let e=0;e<2500&&he.length<(t.key===`low`?160:420);e++){let e=o()*Math.PI*2,t=.9+o()*.16,n=q.x+Math.cos(e)*q.rx*t,r=q.z+Math.sin(e)*q.rz*t,i=s(n,r),a=Ra(n,r);a<.93||a>1.06||i<-.95||Math.abs(n-Yi.x)<4&&r<Yi.zEnd+4||H(n/14,r/14,2)<-.1||he.push(m(n,Math.min(i,Wi)-.05,r,.8+o()*.5,o()*6.28,.15))}he.length&&this.lods.push(new To(e,he,[[fe.leaves,pe],[fe.heads,me]],{radius:N*1.2}));let P=new bt(.22,14,.25,Math.PI*2-.5);P.rotateX(-Math.PI/2);let ge=new R({color:4155946,roughness:.45,side:2,envMapIntensity:.8}),_e=new ae(.06,.06,7,1,!0);_e.rotateX(Math.PI),_e.translate(0,.04,0);let ve=new R({color:16181488,roughness:.5,emissive:3153960,side:2}),ye=[],be=[];for(let e=0;e<3e3&&ye.length<260;e++){let t=[[q.x-25,q.z-8],[q.x+28,q.z+12],[q.x-10,q.z+26],[q.x+14,q.z-22]][e%4],n=t[0]+(o()-.5)*16,r=t[1]+(o()-.5)*12,i=s(n,r);if(i>-.7||i<-2.95)continue;let a=m(n,Wi+.012+o()*.004,r,.6+o()*.8,o()*6.28);ye.push(a),o()<.12&&be.push(m(n+.05,Wi+.01,r,.9+o()*.4,o()*6.28))}let xe=new ne(P,ge,ye.length);ye.forEach((e,t)=>xe.setMatrixAt(t,e)),xe.receiveShadow=!0,e.add(xe),this.meshes.push(xe);let Se=new ne(_e,ve,be.length);be.forEach((e,t)=>Se.setMatrixAt(t,e)),e.add(Se),this.meshes.push(Se);let Ce=new V(.05,12,6,0,Math.PI*2,0,Math.PI/2);Ce.scale(1,.6,1),Ce.translate(0,.07,0);let we=new u(.012,.016,.07,8);we.translate(0,.035,0);let Te=uo([Ce.toNonIndexed(),we.toNonIndexed()]),Ee=new R({roughness:.6}),De=[];for(let e of this.trees)if(!(De.length>600||e.birch===void 0||o()>.35||Math.hypot(e.x,e.z)>140))for(let t=0;t<1+o()*4;t++){let t=o()*6.28,n=e.r+.2+o()*.8,r=e.x+Math.cos(t)*n,i=e.z+Math.sin(t)*n;De.push(m(r,s(r,i)-.01,i,.6+o()*1.2,o()*6.28,.3))}let Oe=new ne(Te,Ee,De.length),ke=[new F(.75,.55,.35),new F(.55,.38,.25),new F(.85,.2,.12),new F(.9,.85,.75)];De.forEach((e,t)=>{Oe.setMatrixAt(t,e),Oe.setColorAt(t,ke[Math.floor(o()*4)])}),Oe.castShadow=!1,Oe.receiveShadow=!0,e.add(Oe),this.meshes.push(Oe);let Ae=new R({map:n.bark.map,normalMap:n.bark.normalMap,roughness:1,color:9079408});mo(Ae,.55);for(let t=0,n=0;t<400&&n<34;t++){let t=(o()*2-1)*140,r=(o()*2-1)*140;if(za(t,r)<.35||h(t,r,3))continue;let a=3+o()*6,c=.18+o()*.18,l=o()*Math.PI,d=new u(c*.85,c,a,12,1);d.rotateZ(Math.PI/2);let f=new I(d,Ae);f.position.set(t,s(t,r)+c*.6,r),f.rotation.y=l,f.castShadow=ie,f.receiveShadow=!0,e.add(f),this.meshes.push(f);for(let e=-1;e<=1;e++)i.addCylinder(t+Math.cos(l)*e*a*.33,r-Math.sin(l)*e*a*.33,c,s(t,r)-1,s(t,r)+c*1.4);n++}let je=new u(.3,.42,.5,12);je.translate(0,.2,0);let Me=[];for(let e=0;e<300&&Me.length<40;e++){let e=(o()*2-1)*130,t=(o()*2-1)*130;if(za(e,t)<.3||h(e,t,2.5))continue;let n=.7+o()*.8;Me.push(m(e,s(e,t)-.05,t,n,o()*6.28,.1)),i.addCylinder(e,t,.38*n,s(e,t)-1,s(e,t)+.45*n)}let Ne=new ne(je,Ae,Me.length);Me.forEach((e,t)=>Ne.setMatrixAt(t,e)),Ne.castShadow=ie,Ne.receiveShadow=!0,e.add(Ne),this.meshes.push(Ne);let Pe=new R({map:n.fern,alphaTest:.4,side:2,roughness:.8});ho(Pe,.25,1.2,`fern`);let Fe=[];for(let e=0;e<7;e++){let t=new Tt(.42,.9,1,3),n=t.attributes.position;for(let e=0;e<n.count;e++){let t=n.getY(e)/.9+.5;n.setZ(e,-t*t*.45),n.setY(e,n.getY(e)+.45)}t.rotateX(-.75),t.rotateY(e/7*Math.PI*2),Fe.push(t)}let Ie=uo(Fe);_o(Ie,new b(0,-.3,0),.5);let Le=[];for(ee=0;Le.length<t.ferns&&ee<t.ferns*30;){ee++;let e=(o()*2-1)*150,t=(o()*2-1)*150;o()>za(e,t)||h(e,t,1.4)||Le.push(m(e,s(e,t)-.05,t,.7+o()*.8,o()*6.28,.2))}Le.length&&this.lods.push(new To(e,Le,[[Ie,Pe]],{radius:N*.8}));let Re=new bt(.035,6);Re.rotateX(-Math.PI/2),Re.translate(0,.28,0);let L=new u(.003,.004,.28,3);L.translate(0,.14,0);let ze=uo([Re.toNonIndexed(),L.toNonIndexed()]),Be=new R({roughness:.7});ho(Be,.6,2,`flower`);let Ve=[];for(let e=0;e<(t.key===`low`?900:2600);e++){let e=o()*6.28,t=9+o()*55,n=Math.cos(e)*t,r=Math.sin(e)*t*.7+4;h(n,r,1.2)||za(n,r)>.4||Ve.push(m(n,s(n,r),r,.8+o()*.6,o()*6.28,.3))}let He=new ne(ze,Be,Ve.length),Ue=[new F(.95,.93,.85),new F(.95,.78,.2),new F(.55,.42,.85),new F(.9,.45,.55)];Ve.forEach((e,t)=>{He.setMatrixAt(t,e),He.setColorAt(t,Ue[Math.floor(o()*Ue.length)])}),He.receiveShadow=!0,e.add(He),this.meshes.push(He);let B=new R({map:n.rock.map,normalMap:n.rock.normalMap,roughness:.9,color:11578274});mo(B,.35),this.rockMat=B;let We=[0,1,2].map(e=>wo(e*11)),Ge=We.map(()=>[]);for(let e=0;e<260;e++){let t=(o()*2-1)*170,n=(o()*2-1)*170;if(h(t,n,1.8)&&!(Ra(t,n)>.9&&Ra(t,n)<1.05))continue;let r=o()<.12,a=r?1.2+o()*1.6:.2+o()*.5,c=s(t,n)-a*.25;Ge[e%3].push(m(t,c,n,a,o()*6.28,.5)),r&&Math.hypot(t,n)<175&&i.addCylinder(t,n,a*.9,c,c+a*.6)}We.forEach((t,n)=>this.meshes.push(...Do(e,t,B,Ge[n],{cast:ie,receive:!0})))}update(e,t,n){if(n)for(let e of this.lods)e.update(n);po.uTime.value=e,po.uWind.value=t.w.gust??.4}},ko=class{constructor(e,n,r){let i=r.seg+1,a=r.H,o=r.step,s=r.half,c=new Uint16Array(i*i*4);for(let e=0;e<i;e++)for(let n=0;n<i;n++){let r=-s+n*o,l=-s+e*o,u=a[e*i+n],d=U(.5,1.9,La(r,l));d*=U(Wi+.02,Wi+.25,u),d*=1-za(r,l)*.6,r>-7.6&&r<7.6&&l>-5.6&&l<7.6&&(d=0),Math.abs(r-Yi.x)<1.8&&l>18&&l<40&&(d*=.3),Math.hypot(r-Ji.x,l-Ji.z)<(Gi.id===`hollow`?4.2:2.2)&&(d=0),d*=.75+.25*(H(r/9,l/9,2)*.5+.5);let f=.75+.6*(H(r/25+3,l/25,3)*.5+.5)+(1-za(r,l))*.1,p=(e*i+n)*4;c[p]=t.toHalfFloat(u),c[p+1]=t.toHalfFloat(d),c[p+2]=t.toHalfFloat(f),c[p+3]=t.toHalfFloat(1)}let l=new We(c,i,i,k,ot);l.magFilter=l.minFilter=lt,l.needsUpdate=!0,this.layers=[],this.tex=l,this.autumn=Gi.id===`hollow`;let u=n.grassNear,d=n.grassFar;this.layers.push(this.makeLayer(e,i,o,s,u[0],u[1],u[2],0,1,11)),this.layers.push(this.makeLayer(e,i,o,s,d[0],d[1],d[2],u[1]*.75,1.35,23))}makeLayer(e,t,i,a,o,s,c,l,u,d){let f=s*2,p=z(d),m=[],h=[],g=[],_=[],v=0;for(let e=0;e<o;e++){let e=p(),t=p(),n=p(),r=p();for(let i=0;i<c;i++){let i=p()*Math.PI*2,a=p()*.17*u,o=Math.cos(i)*a,s=Math.sin(i)*a,c=(.26+p()*.4)*u,l=(.013+p()*.012)*u,d=p()*Math.PI,f=Math.cos(d),y=Math.sin(d),b=(p()-.5)*.6,x=.75+p()*.35,S=this.autumn?r<.3?[.42,.33,.12]:r<.55?[.36,.22,.09]:r<.8?[.24,.27,.09]:[.15,.24,.07]:r<.1?[.34,.31,.13]:r<.35?[.17,.27,.08]:[.11,.24,.06];for(let r=0;r<=2;r++){let i=r/2,a=l*(1-i*.8),u=b*i*i*c,d=i*c;for(let r of[-1,1]){m.push(o+f*a*r+u*y,d,s+y*a*r-u*f),h.push(e,t,n);let c=.38+i*.7;g.push(S[0]*c*x,S[1]*c*x*(.95+i*.15),S[2]*c*x)}}m.push(o+b*c*y*1.2,c*1.08,s-b*c*f*1.2),h.push(e,t,n),g.push(S[0]*1.35*x,S[1]*1.35*x,S[2]*1.2*x),_.push(v,v+1,v+2,v+1,v+3,v+2,v+2,v+3,v+4,v+3,v+5,v+4,v+4,v+5,v+6),v+=7}}let y=new Ye;y.setAttribute(`position`,new r(m,3)),y.setAttribute(`aOff`,new r(h,3)),y.setAttribute(`color`,new r(g,3)),y.setIndex(_),y.boundingSphere=new n(new b,1e6);let x={uCam:{value:new b},uTile:{value:f},uHM:{value:this.tex},uN:{value:t},uStep:{value:i},uHalf:{value:a},uInner:{value:l}},S=new R({vertexColors:!0,side:2,roughness:.75});S.onBeforeCompile=e=>{Object.assign(e.uniforms,x,{uTime:po.uTime,uWind:po.uWind}),e.vertexShader=`uniform vec3 uCam; uniform float uTile; uniform sampler2D uHM; uniform float uN; uniform float uStep; uniform float uHalf; uniform float uTime; uniform float uWind; uniform float uInner;
attribute vec3 aOff;
`+e.vertexShader.replace(`#include <beginnormal_vertex>`,`vec3 objectNormal = vec3(0.0, 1.0, 0.0);`).replace(`#include <begin_vertex>`,`
          vec2 base = aOff.xy * uTile;
          vec2 wp = uCam.xz + mod(base - uCam.xz, uTile) - uTile * 0.5;
          vec2 tuv = ((wp + uHalf) / uStep + 0.5) / uN;
          vec4 hm = texture2D(uHM, tuv);
          float dist = length(wp - uCam.xz);
          float fade = (1.0 - smoothstep(uTile * 0.32, uTile * 0.5, dist)) * smoothstep(uInner * 0.85, uInner * 1.15 + 0.001, dist + (uInner > 0.0 ? 0.0 : 1.0));
          float sc = hm.g * fade * hm.b * (0.75 + aOff.z * 0.55);
          sc = sc < 0.1 ? 0.0 : sc;
          float a = aOff.z * 6.2831;
          vec3 lp = position * sc;
          lp.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * lp.xz;
          float hh = max(position.y, 0.0) * 1.7;
          float ph = wp.x * 0.15 + wp.y * 0.11;
          float gust = sin(uTime * 0.7 + wp.x * 0.05 + wp.y * 0.03) * 0.5 + 0.5;
          float sway = sin(uTime * 1.9 + ph) * 0.5 + sin(uTime * 4.1 + ph * 2.3) * 0.2;
          float k = hh * hh * (0.12 + uWind * (0.6 + gust * 0.8)) * sc;
          lp.x += (sway + uWind * 0.7) * k * 0.55;
          lp.z += sin(uTime * 1.3 + ph * 1.7) * k * 0.25;
          // part the grass around the walker
          vec2 away = wp - uCam.xz; float pd = length(away);
          lp.xz += away / max(pd, 0.01) * smoothstep(0.7, 0.0, pd) * position.y * 0.6;
          vec3 transformed = vec3(wp.x + lp.x, hm.r + lp.y - 0.02, wp.y + lp.z);
        `)},S.customProgramCacheKey=()=>`grassfield`+d;let C=new I(y,S);return C.frustumCulled=!1,C.receiveShadow=!0,e.add(C),{mesh:C,u:x}}get mesh(){return this.layers[0].mesh}setVisible(e){for(let t of this.layers)t.mesh.visible=e}update(e){for(let t of this.layers)t.u.uCam.value.copy(e.position)}},Ao={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},jo=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Mo=new Dt(-1,1,1,-1,0,1),No=new class extends Ye{constructor(){super(),this.setAttribute(`position`,new r([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new r([0,2,0,0,2,0],2))}},Po=class{constructor(e){this._mesh=new I(No,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Mo)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Fo=class extends jo{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof d?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=N.clone(e.uniforms),this.material=new d({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Po(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Io=class extends jo{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Lo=class extends jo{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Ro=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new W);this._width=n.width,this._height=n.height,t=new be(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ot}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Fo(Ao),this.copyPass.material.blending=0,this.timer=new ee}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Io!==void 0&&(r instanceof Io?n=!0:r instanceof Lo&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new W);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},zo=class extends jo{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new F}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Bo={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new F(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Vo=class e extends jo{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new W(256,256):new W(e.x,e.y),this.clearColor=new F(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new be(i,a,{type:ot,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new be(i,a,{type:ot,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new be(i,a,{type:ot,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Bo;this.highPassUniforms=N.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new d({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new b(1,1,1),new b(1,1,1),new b(1,1,1),new b(1,1,1),new b(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=N.clone(Ao.uniforms),this.blendMaterial=new d({uniforms:this.copyUniforms,vertexShader:Ao.vertexShader,fragmentShader:Ao.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new F,this._oldClearAlpha=1,this._basic=new Re,this._fsQuad=new Po(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new d({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new W(.5,.5)},direction:{value:new W(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new d({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Vo.BlurDirectionX=new W(1,0),Vo.BlurDirectionY=new W(0,1);var Ho={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Uo=class extends jo{constructor(){super(),this.isOutputPass=!0,this.uniforms=N.clone(Ho.uniforms),this.material=new Ie({name:Ho.name,uniforms:this.uniforms,vertexShader:Ho.vertexShader,fragmentShader:Ho.fragmentShader}),this._fsQuad=new Po(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Et.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Wo=new b;function Go(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;Wo.copy(t),Wo[r]=0,Wo.normalize();let l=.5*o/(o+s),u=1-Wo.angleTo(e)/c;return Math.sign(Wo[n])===1?u*l:s/(o+s)+l+l*(1-u)}var Ko=class e extends Fe{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let s=new b,c=new b,l=new b(e,t,n).divideScalar(2).subScalar(i),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,m=new b,h=.5/a;for(let r=0,a=0;r<u.length;r+=3,a+=2)switch(s.fromArray(u,r),c.copy(s),c.x-=Math.sign(c.x)*h,c.y-=Math.sign(c.y)*h,c.z-=Math.sign(c.z)*h,c.normalize(),u[r+0]=l.x*Math.sign(s.x)+c.x*i,u[r+1]=l.y*Math.sign(s.y)+c.y*i,u[r+2]=l.z*Math.sign(s.z)+c.z*i,d[r+0]=c.x,d[r+1]=c.y,d[r+2]=c.z,Math.floor(r/p)){case 0:m.set(1,0,0),f[a+0]=Go(m,c,`z`,`y`,i,n),f[a+1]=1-Go(m,c,`y`,`z`,i,t);break;case 1:m.set(-1,0,0),f[a+0]=1-Go(m,c,`z`,`y`,i,n),f[a+1]=1-Go(m,c,`y`,`z`,i,t);break;case 2:m.set(0,1,0),f[a+0]=1-Go(m,c,`x`,`z`,i,e),f[a+1]=Go(m,c,`z`,`x`,i,n);break;case 3:m.set(0,-1,0),f[a+0]=1-Go(m,c,`x`,`z`,i,e),f[a+1]=1-Go(m,c,`z`,`x`,i,n);break;case 4:m.set(0,0,1),f[a+0]=1-Go(m,c,`x`,`y`,i,e),f[a+1]=1-Go(m,c,`y`,`x`,i,t);break;case 5:m.set(0,0,-1),f[a+0]=Go(m,c,`x`,`y`,i,e),f[a+1]=1-Go(m,c,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}};function qo(e,t=1){let n=e.attributes.position,r=e.attributes.normal,i=e.attributes.uv;if(!i)return e;for(let e=0;e<n.count;e++){let a=Math.abs(r.getX(e)),o=Math.abs(r.getY(e)),s=Math.abs(r.getZ(e)),c,l;a>=o&&a>=s?(c=n.getZ(e),l=n.getY(e)):o>=a&&o>=s?(c=n.getX(e),l=n.getZ(e)):(c=n.getX(e),l=n.getY(e)),i.setXY(e,c/t,l/t)}return i.needsUpdate=!0,e}var Jo={value:0},Yo={value:0};function Xo(e){return e.onBeforeCompile=e=>{e.uniforms.uRain=Jo,e.uniforms.uT=Yo,e.vertexShader=`varying vec3 vGW;
`+e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
vGW = (modelMatrix * vec4(position, 1.0)).xyz;`),e.fragmentShader=`uniform float uRain; uniform float uT; varying vec3 vGW;
float gh(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float drops(vec2 uv){
  float d = 0.0;
  // beaded droplets
  vec2 g = uv * 38.0; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float r = gh(id); vec2 c = (vec2(gh(id + 1.3), gh(id + 7.1)) - 0.5) * 0.6;
  d += smoothstep(0.16 * r + 0.03, 0.0, length((f - c) * vec2(1.0, 0.8))) * step(0.45, r);
  // running drops with trails
  vec2 g2 = vec2(uv.x * 14.0, uv.y * 3.0); float col = floor(g2.x); float rr = gh(vec2(col, 3.0));
  float y = fract(g2.y + uT * (0.15 + rr * 0.35) + rr * 7.0);
  float x = fract(g2.x) - 0.5 + sin(uv.y * 30.0 + col) * 0.05;
  d += smoothstep(0.09, 0.0, length(vec2(x * 2.0, (y - 0.5) * 3.0))) * step(0.55, rr);
  d += smoothstep(0.03, 0.0, abs(x)) * smoothstep(0.5, 1.0, y) * step(0.55, rr) * 0.35;
  return d;
}
`+e.fragmentShader.replace(`#include <opaque_fragment>`,`
  vec2 guv = vec2(vGW.x + vGW.z, vGW.y);
  float dr = drops(guv) * uRain;
  outgoingLight += vec3(0.6, 0.65, 0.7) * dr * 0.5;
  diffuseColor.a = min(1.0, diffuseColor.a + dr * 0.35);
  #include <opaque_fragment>`)},e.customProgramCacheKey=()=>`rainy-glass`,e}function Zo(e){let t=e=>new R(e),n=(e,t={})=>({map:e.map,normalMap:e.normalMap,...t}),r={logs:t(n(e.logs,{roughness:.78,color:13483952})),chink:t({color:8747622,roughness:1,envMapIntensity:.2}),floor:t(n(e.floor,{roughness:.5,envMapIntensity:.45})),boards:t(n(e.boards,{roughness:.82})),ceiling:t(n(e.boards,{roughness:.85,color:14272688,envMapIntensity:.3})),deck:t(n(e.deck,{roughness:.85,color:13681844})),trim:t(n(e.boards,{roughness:.7,color:6965810})),darkWood:t(n(e.grain,{roughness:.42,color:8018504,envMapIntensity:.5})),oak:t(n(e.grain,{roughness:.48,color:14729376,envMapIntensity:.5})),stone:t(n(e.stone,{roughness:.92})),soot:t({color:1709330,roughness:1}),shingles:t(n(e.shingles,{roughness:.9})),iron:t({color:1907482,roughness:.55,metalness:.7}),brass:t({color:11831878,roughness:.3,metalness:1}),steel:t({color:13159632,roughness:.25,metalness:1}),glass:Xo(new Ve({color:14674672,roughness:.04,metalness:0,transparent:!0,opacity:.16,depthWrite:!1,envMapIntensity:1.4,side:2})),sofa:t(n(e.sofa,{roughness:.95,envMapIntensity:.3})),wool:t(n(e.wool,{roughness:.95,envMapIntensity:.3})),linen:t(n(e.linen,{roughness:.92,envMapIntensity:.3})),quilt:t(n(e.quilt,{roughness:.92,envMapIntensity:.3})),rug:t(n(e.rug,{roughness:1,envMapIntensity:.2})),ceramic:t({color:15327958,roughness:.25,envMapIntensity:.6}),ceramicBlue:t({color:3889784,roughness:.3,envMapIntensity:.6}),paper:t({color:15261640,roughness:.9}),black:t({color:1118481,roughness:.6}),shade:t({color:15258280,roughness:.8,emissive:16756832,emissiveIntensity:0,side:2}),bulb:t({color:16773840,emissive:16760944,emissiveIntensity:0}),canvas:t({color:10128490,roughness:.95,side:2})};for(let e of[`floor`,`boards`,`ceiling`,`deck`,`trim`,`logs`,`stone`,`shingles`])r[e].map.anisotropy=8;return r.interior=[r.logs,r.floor,r.ceiling,r.boards,r.sofa,r.wool,r.linen,r.quilt,r.rug,r.darkWood,r.oak,r.chink],r}var Qo=class{constructor(){this.groups=new Map}add(e,t,n){let r=e.index?e.toNonIndexed():e.clone();n&&r.applyMatrix4(n);for(let e of Object.keys(r.attributes))[`position`,`normal`,`uv`].includes(e)||r.deleteAttribute(e);this.groups.has(t)||this.groups.set(t,[]),this.groups.get(t).push(r)}flush(e,{cast:t=!0,receive:n=!0}={}){let r=[];for(let[i,a]of this.groups){let o=uo(a),s=new I(o,i);s.castShadow=t,s.receiveShadow=n,e.add(s),r.push(s)}return this.groups.clear(),r}},$o=new yt,es=new l,ts=new _,ns=new b(1,1,1),rs=new b;function J(e,t,n,r=0,i=0,a=0){return ts.set(r,i,a),es.setFromEuler(ts),$o.compose(rs.set(e,t,n),es,ns).clone()}function Y(e,t,n,r=1){return qo(new Fe(e,t,n),r)}function is(e,t,n,r=.04,i=3){return new Ko(e,t,n,i,Math.min(r,e/2-.001,t/2-.001,n/2-.001))}function X(e,t,n=0,r=0,i=0,a,o={}){let s=new I(e,t);return s.position.set(n,r,i),o.rx&&(s.rotation.x=o.rx),o.ry&&(s.rotation.y=o.ry),o.rz&&(s.rotation.z=o.rz),s.castShadow=o.cast!==!1,s.receiveShadow=!0,a&&a.add(s),s}var as=class{constructor(e=0,t=7){this.v=e,this.t=e,this.vel=0,this.k=t}update(e){let t=this.k,n=this.v-this.t,r=-t*t*n-2*t*this.vel;return this.vel+=r*e,this.v+=this.vel*e,Math.abs(this.vel)>.001||Math.abs(n)>.001}},os=class{constructor(e,t,n,r,{collider:i,label:a=`door`,sound:o=`door`,speed:s=5}={}){this.g=e,this.axis=t,this.open=!1,this.base=e.rotation[t],this.angle=n,this.s=new as(0,s),this.ctx=r,this.collider=i,this.label=a,this.sound=o,this.box=new Ae}toggle(){this.open=!this.open,this.s.t=+!!this.open;let e=new b;this.g.getWorldPosition(e);let t=this.ctx.audio;this.sound!==`none`&&(this.sound===`door`?t?.door(e,this.open):this.sound===`window`?t?.windowLatch(e):this.sound===`lid`?(t?.creak(e,.08,.5,220),this.open||setTimeout(()=>t?.thud(e,.3),450)):(t?.creak(e,.05,.35,260),this.open||setTimeout(()=>t?.click(e,.3),300)))}update(e){let t=this.s.update(e);this.g.rotation[this.axis]=this.base+this.s.v*this.angle,t&&this.collider&&this.panel&&(this.panel.updateWorldMatrix(!0,!1),this.box.setFromObject(this.panel),this.collider.min.copy(this.box.min),this.collider.max.copy(this.box.max),this.collider.min.y+=.05)}},ss=class{constructor(e,t,n,r){this.g=e,this.dir=t.clone(),this.dist=n,this.home=e.position.clone(),this.s=new as(0,9),this.open=!1,this.ctx=r}toggle(){this.open=!this.open,this.s.t=+!!this.open;let e=new b;this.g.getWorldPosition(e),this.ctx.audio?.slide(e,this.open)}update(e){this.s.update(e),this.g.position.copy(this.home).addScaledVector(this.dir,this.s.v*this.dist)}},cs=`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,ls=`
uniform float uTime; uniform float uLevel; uniform float uSeed; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<4;i++){ s+=a*n(p); p*=2.1; a*=0.5;} return s; }
void main(){
  vec2 uv = vUv;
  float t = uTime * 1.6 + uSeed * 10.0;
  float nz = fbm(vec2(uv.x * 4.0 + uSeed * 3.0, uv.y * 3.0 - t * 1.8));
  float w = (1.0 - uv.y) * 0.42 * (0.4 + uLevel * 0.6) + 0.02;
  float d = abs(uv.x - 0.5 + (nz - 0.5) * 0.35 * uv.y);
  float top = 0.35 + uLevel * 0.6;
  float f = smoothstep(w, w * 0.2, d) * smoothstep(top, top * 0.25, uv.y + (nz - 0.5) * 0.45) * smoothstep(0.0, 0.1, uv.y);
  vec3 col = mix(vec3(0.9, 0.18, 0.02), vec3(1.0, 0.75, 0.3), smoothstep(0.25, 0.85, f));
  col = mix(col, vec3(1.0, 0.95, 0.8), smoothstep(0.85, 1.0, f) * (1.0 - uv.y));
  gl_FragColor = vec4(col * f * 2.2 * uLevel, f * uLevel);
}`,us=class{constructor(e,t,n,{scale:r=1,intensity:i=12,lightOffset:a=new b(.3,.45,0),smokeAt:o=null,startOn:s=!1}={}){this.ctx=e,this.level=0,this.target=+!!s,this.on=s,this.group=new x,this.group.position.copy(n),t.add(this.group),this.u={uTime:{value:0},uLevel:{value:0}},this.flames=[];for(let e=0;e<4;e++){let t=new d({uniforms:{...this.u,uSeed:{value:e*.37}},vertexShader:cs,fragmentShader:ls,transparent:!0,depthWrite:!1,blending:2,side:2}),n=new I(new Tt(.55*r,.75*r),t);n.position.set((e-1.5)*.06*r,.36*r,(e%2-.5)*.08*r),n.rotation.y=e/4*Math.PI,n.renderOrder=5,this.group.add(n),this.flames.push(n)}let c=z(9);this.logMat=new R({map:e.T.bark.map,normalMap:e.T.bark.normalMap,roughness:1,emissive:16728080,emissiveIntensity:0});for(let e=0;e<4;e++){let t=X(new u(.06*r,.07*r,.55*r,7),this.logMat,0,.07*r+(e>1?.09*r:0),0,this.group);t.rotation.z=Math.PI/2,t.rotation.y=e*1.2+c(),t.rotation.x=(c()-.5)*.3}let l=new Float32Array(120);for(let e=0;e<40;e++)l[e*3]=c(),l[e*3+1]=c(),l[e*3+2]=c();let p=new Ye;p.setAttribute(`position`,new nt(l,3)),this.emberMat=new d({uniforms:{...this.u,uScale:{value:r}},transparent:!0,depthWrite:!1,blending:2,vertexShader:`uniform float uTime; uniform float uLevel; uniform float uScale; varying float vA;
        void main(){ vec3 s = position; float life = fract(s.y + uTime * (0.25 + s.z * 0.3));
          vec3 p = vec3((s.x - 0.5) * 0.4 + sin(uTime * 2.0 + s.z * 20.0) * 0.08 * life, life * 1.4, (s.z - 0.5) * 0.3) * uScale;
          vA = (1.0 - life) * uLevel; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = 30.0 * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(1.0, 0.5, 0.15, smoothstep(0.5, 0.0, d) * vA); }`});let m=new f(p,this.emberMat);m.frustumCulled=!1,this.group.add(m),this.light=new le(16747066,0,9*r+3,1.6),this.light.position.copy(a),this.light.castShadow=!1,this.group.add(this.light),this.baseI=i;let h=new b;this.group.getWorldPosition(h),this.sound=e.audio?.fire(h.clone().add(new b(0,.3,0))),o&&(this.smoke=ds(e.scene,o,this.u))}toggle(){this.on=!this.on,this.target=+!!this.on;let e=new b;return this.group.getWorldPosition(e),this.on&&this.ctx.audio?.match(e),this.on}update(e,t){this.level+=(this.target-this.level)*Math.min(1,e*(this.on?.6:.35)),this.u.uTime.value=t,this.u.uLevel.value=this.level;let n=.82+Math.sin(t*13.1)*.06+Math.sin(t*7.3+1)*.08+Math.sin(t*23.7)*.04;this.light.intensity=this.baseI*this.level*n,this.logMat.emissiveIntensity=this.level*(.7+n*.5)+(this.on?0:this.level*.5),this.flames.forEach(e=>e.visible=this.level>.02),this.sound?.set(this.level)}};function ds(e,t,n){let r=new Float32Array(108),i=z(4);for(let e=0;e<36;e++)r[e*3]=i(),r[e*3+1]=i(),r[e*3+2]=i();let a=new Ye;a.setAttribute(`position`,new nt(r,3));let o=new d({uniforms:n,transparent:!0,depthWrite:!1,vertexShader:`uniform float uTime; uniform float uLevel; varying float vA;
      void main(){ vec3 s = position; float life = fract(s.y + uTime * 0.07);
        vec3 p = vec3((s.x - 0.5) * 0.5 + life * life * 4.0, life * 9.0, (s.z - 0.5) * 0.5 + sin(uTime*0.3 + s.x*6.0) * life);
        vA = smoothstep(0.0, 0.1, life) * (1.0 - life) * uLevel * 0.35; vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (200.0 + life * 900.0) / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.55), smoothstep(0.5, 0.1, d) * vA); }`}),s=new f(a,o);return s.position.copy(t),s.frustumCulled=!1,e.add(s),s}var fs=class{constructor(e,t,n,{intensity:r=8,on:i=!1,label:a=`lamp`}={}){this.ctx=e,this.light=t,this.emissives=n,this.max=r,this.on=i,this.label=a,this.v=+!!i,this.flicker=0,t.intensity=this.v*r}toggle(e){return this.on=!this.on,this.flicker=this.on?.25:0,this.ctx.audio?.lightSwitch(e||this.light.getWorldPosition(new b)),this.on}update(e){let t=+!!this.on;this.v+=(t-this.v)*Math.min(1,e*(this.on?14:9));let n=1;this.flicker>0&&(this.flicker-=e,n=Math.random()<.5?.35:1),this.light.intensity=this.v*this.max*n;for(let[e,t]of this.emissives)e.emissiveIntensity=this.v*t*n}};function ps(){let e=new u(.045,.04,.1,18,1,!1);e.translate(0,.05,0);let t=new m(.03,.009,6,12,Math.PI);return t.rotateZ(-Math.PI/2),t.translate(.045,.05,0),uo([e.toNonIndexed(),t.toNonIndexed()])}function ms(e,t=.15,n=.22,r=.035){let i=new x,a=new I(is(t,n,r,.004,1),e),o=new I(new Fe(t-.01,n-.012,r-.006),new R({color:15656140,roughness:.9}));return o.position.x=.006,a.castShadow=o.castShadow=!0,i.add(a,o),i}function hs(e=.038){let t=new V(e,16,12),n=t.attributes.position;for(let t=0;t<n.count;t++){let r=n.getY(t)/e,i=1-.18*Math.exp(-((r-1)**2)*10)-.1*Math.exp(-((r+1)**2)*10);n.setX(t,n.getX(t)*i),n.setZ(t,n.getZ(t)*i),n.setY(t,n.getY(t)*.9)}return t.computeVertexNormals(),t}function gs(e){let t=new x,n=[];for(let e=0;e<=12;e++){let t=e/12;n.push(new W(.03+Math.sin(t*Math.PI)*.085+(1-t)*.02,t*.17))}let r=X(new Pe(n,20),e.steel,0,0,0,t),i=X(new u(.008,.016,.12,8),e.steel,.1,.09,0,t);return i.rotation.z=-.9,X(new m(.06,.008,6,14,Math.PI),e.black,0,.17,0,t),X(new V(.012,8,6),e.black,0,.19,0,t),r.castShadow=!0,t}function _s(e,t){let n=new x;X(new u(.075,.08,.04,14),e.iron,0,.02,0,n),X(new u(.05,.075,.03,14),e.iron,0,.23,0,n),X(new ae(.05,.05,14),e.iron,0,.27,0,n);let r=X(new u(.055,.06,.17,14,1,!0),e.glass,0,.125,0,n,{cast:!1});for(let t=0;t<4;t++){let r=t/4*Math.PI*2;X(new u(.004,.004,.19,4),e.iron,Math.cos(r)*.065,.125,Math.sin(r)*.065,n)}let i=X(new m(.05,.004,5,14,Math.PI),e.iron,0,.3,0,n),a=new R({color:16760944,emissive:16752704,emissiveIntensity:3}),o=X(new V(.014,8,6),a,0,.1,0,n,{cast:!1});o.scale.y=2.2;let s=new le(16754768,2.2,7,1.7);return s.position.set(0,.12,0),n.add(s),n.userData.flame=o,n.userData.light=s,r.castShadow=!1,i.castShadow=!1,n}function vs(e=0){let t=[],n=z(e+3);for(let e=0;e<26;e++){let n=e/26,r=new ae(.012,.022,4);r.rotateX(Math.PI/2+.6);let i=e*2.4,a=Math.sin(n*Math.PI)*.022+.006;r.rotateY(-i),r.translate(Math.sin(i)*a,n*.085,Math.cos(i)*a),t.push(r.toNonIndexed())}let r=new u(.012,.01,.085,6);r.translate(0,.0425,0),t.push(r.toNonIndexed());let i=uo(t);return i.computeVertexNormals(),i.rotateZ(Math.PI/2*(n()>.5?1:.9)),i}function ys(e,t=.07){let n=new _e(t,2),r=n.attributes.position,i=z(e),a=.8+i()*.5,o=.45+i()*.25,s=.7+i()*.4;for(let e=0;e<r.count;e++)r.setXYZ(e,r.getX(e)*a,r.getY(e)*o,r.getZ(e)*s);return n.computeVertexNormals(),n}function bs(e,t,n,r,i,a){let o=new x;o.position.set(n,r,i),o.rotation.y=a,t.add(o),X(is(.44,.04,.42,.01),e.oak,0,.45,0,o);for(let[t,n]of[[-.19,-.18],[.19,-.18],[-.19,.18],[.19,.18]])X(new u(.018,.016,.45,8),e.oak,t,.225,n,o);for(let t of[-.19,.19])X(new u(.016,.018,.5,8),e.oak,t,.7,.19,o);for(let t=0;t<3;t++)X(Y(.38,.05,.02),e.oak,0,.62+t*.13,.19,o);return o}var xs=.16,Ss=.3,Cs=10,ws=K+3,Ts=K+5,Es=(Ts-ws)/3.5,Ds=(e,t,n)=>new b(e,t,n);function Os(e){let{scene:t,M:n,T:r,ix:i,col:o,phys:s,audio:d}=e,f=new x;f.name=`cabin`,t.add(f);let p=new Qo,h=z(31),g=(e,t,n,r,i,a,c)=>{let l=o.addBox(e,t,n,r,i,a,c);return l.phys&&s.addStaticBox(l),l},v=(e,t,n,r,i,a,o,s=1,c=[0,0,0])=>p.add(Y(e,t,n,s),r,J(i,a,o,...c)),y=e.updaters,S=[],C=[{axis:`x`,c:3.5,from:-6,to:6,inward:-1,open:[{a:-5,b:-3.8,lo:.9,hi:2.1},{a:-2.6,b:-1.6,lo:0,hi:2.15},{a:-.6,b:.6,lo:.9,hi:2.1},{a:3,b:4.2,lo:.9,hi:2.1}]},{axis:`x`,c:-3.5,from:-6,to:6,inward:1,open:[{a:-1.2,b:0,lo:1.05,hi:2.05},{a:3.4,b:4.6,lo:1.15,hi:2.1}]},{axis:`z`,c:-6,from:-3.5,to:3.5,inward:1,open:[{a:-.95,b:.95,lo:-1,hi:3.2}]},{axis:`z`,c:6,from:-3.5,to:3.5,inward:-1,open:[{a:-.6,b:.6,lo:.9,hi:2.1}]}];for(let e of C){let t=[];for(let r=0;r<Cs;r++){let i=.15+r*Ss,a=[[e.from-.32,e.to+.32]];for(let t of e.open)if(t.lo<i+xs*.6&&t.hi>i-xs*.6){let e=[];for(let[n,r]of a)t.b<=n||t.a>=r?e.push([n,r]):(t.a>n&&e.push([n,t.a]),t.b<r&&e.push([t.b,r]));a=e}t.push(a);for(let[t,r]of a){let a=r-t;if(a<.05)continue;let o=xs*(.94+h()*.1),s=new u(o,o,a,14,1),c=s.attributes.uv;for(let e=0;e<c.count;e++)c.setY(e,c.getY(e)*a/2.2+h());let l=(t+r)/2,d=K+i;e.axis===`x`?p.add(s,n.logs,J(l,d,e.c,0,0,Math.PI/2)):p.add(s,n.logs,J(e.c,d,l,Math.PI/2,0,0))}}for(let r=0;r<9;r++)for(let[i,a]of t[r])for(let[o,s]of t[r+1]){let t=Math.max(i,o,e.from+.1),c=Math.min(a,s,e.to-.1);if(c-t<.05)continue;let l=K+.15+r*Ss+Ss/2;e.axis===`x`?v(c-t,Ss,.2,n.chink,(t+c)/2,l,e.c):v(.2,Ss,c-t,n.chink,e.c,l,(t+c)/2)}let r=.17,i=ws+.2,a=[e.from-.32,...e.open.flatMap(e=>[e.a,e.b]),e.to+.32].sort((e,t)=>e-t),o=(t,n,i,a)=>{n-t<.01||a-i<.01||(e.axis===`x`?g(t,i,e.c-r,n,a,e.c+r,{tag:`wood`,walk:!1}):g(e.c-r,i,t,e.c+r,a,n,{tag:`wood`,walk:!1}))};for(let t=0;t<a.length-1;t++){let n=a[t],r=a[t+1],s=(n+r)/2,c=e.open.find(e=>s>e.a&&s<e.b);c?(c.lo>0&&o(n,r,0,K+c.lo),o(n,r,K+c.hi,i)):o(n,r,0,i)}}v(12.5,K+.3,7.5,n.stone,0,(K-.3)/2-.15+0,0,1.4),v(11.7,.06,6.7,n.floor,0,K-.03,0,2.2),g(-6.2,-2,-3.7,6.2,K,3.7,{tag:`wood`});let w=Math.atan(Es),T=4.1,E=T*Es,D=Math.hypot(T,E),O=.16;for(let e of[1,-1]){qo(new Fe(13.4,O,D),2.4);let t=e*T/2,r=Ts-E/2+.17,i=Ds(0,Math.cos(w),e*Math.sin(w)),a=J(0,r+i.y*O/2,t+i.z*O/2,e*w,0,0),o=new Tt(13.4,D);o.rotateX(-Math.PI/2),qo(o,2.2),o.translate(0,.081,0);let s=new Tt(13.4,D);s.rotateX(Math.PI/2),qo(s,1.6),s.translate(0,-.16/2-.001,0),p.add(o,n.shingles,a),p.add(s,n.ceiling,a);let c=new Fe(13.4,O,D-.02);p.add(c,n.trim,a)}v(13.5,.14,.32,n.trim,0,Ts+.3,0,1);for(let e of[-1,1]){let t=new c([new W(-3.66,0),new W(3.66,0),new W(0,Ts-ws+.18)]),r=new At(t,{depth:.14,bevelEnabled:!1});r.rotateY(Math.PI/2),qo(r,1.4),p.add(r,n.boards,J(e*6-.07,ws+.01,0))}for(let e of[-4.2,-2,3.8]){let t=new u(.12,.12,7,12);p.add(t,n.logs,J(e,K+2.88,0,Math.PI/2,0,0))}{let e=new u(.14,.14,12.4,12);p.add(e,n.logs,J(0,Ts-.08,0,0,0,Math.PI/2))}for(let e of[1,-1])for(let t=0;t<4;t++){let n=e>0?t*.9:-(t+1)*.9,r=n+.9,i=Ts-Math.abs(e>0?r:n)*Es+.05;g(-6.1,i,n,6.1,i+.3,r,{walk:!1})}{let e=new c([[-3.34,0],[1.6,0],[1.6,2.1],[2.5,2.1],[2.5,0],[3.34,0],[3.34,3.08],[0,4.98],[-3.34,3.08]].map(([e,t])=>new W(e,t))),t=new At(e,{depth:.12,bevelEnabled:!1});qo(t,1.6),t.rotateY(-Math.PI/2),p.add(t,n.boards,J(1.44,K,0)),g(1.44,K,-3.4,1.56,Ts,1.6,{walk:!1}),g(1.44,K,2.5,1.56,Ts,3.4,{walk:!1}),g(1.44,K+2.1,1.6,1.56,Ts,2.5,{walk:!1}),v(.16,.1,1.04,n.trim,1.5,K+2.15,2.05),v(.16,2.1,.07,n.trim,1.5,K+1.05,1.565),v(.16,2.1,.07,n.trim,1.5,K+1.05,2.535)}let k=-5.85;v(.75,1.5,.6,n.stone,-5.475,K+.75+.12,-.9,1.2),v(.75,1.5,.6,n.stone,-5.475,K+.75+.12,.9,1.2),v(.75,.5,1.2,n.stone,-5.475,K+1.37,0,1.2),v(.12,1,1.2,n.soot,-5.869999999999999,K+.62,0),v(.6,.02,1.2,n.soot,-5.55,K+.13,0),v(1.3,.12,2.9,n.stone,-5.3,K+.06,0,1),v(.95,.12,2.7,n.darkWood,-5.3999999999999995,K+1.68,0,1.5),v(.5,3.4,1.8,n.stone,-5.6,K+1.74+1.7,0,1.2),v(.95,7.2,2,n.stone,-6.65,3.5,0,1.2),v(1.05,.12,2.1,n.stone,-6.65,7.12,0,1.2),g(k,K,-1.45,-4.6,K+.12,1.45,{tag:`stone`}),g(k,K+.12,-1.2,-5.1,K+1.74,1.2,{walk:!1}),g(k,K+1.62,-1.35,-4.8999999999999995,K+1.74,1.35,{walk:!1}),g(-7.12,0,-1,-6.16,7.2,1,{walk:!1});let A=new us(e,f,Ds(-5.52,K+.13,0),{scale:1,intensity:14,lightOffset:Ds(.45,.45,0),smokeAt:Ds(-6.65,7.2,0),startOn:!0});y.push((e,t)=>A.update(e,t));let j=X(new Fe(.7,.9,1.2),new Re({visible:!1}),-5.47,K+.6,0,f);i.register(j,{label:()=>A.on?`Let the fire die down`:`Light the fire`,use:()=>A.toggle()});for(let e=0;e<5;e++){let t=ms(new R({color:[5971738,2046538,3951138,7031326,2763306][e],roughness:.7}));t.position.set(-5.55,K+1.74+.11,.7+e*.045),t.rotation.y=Math.PI/2,f.add(t)}let M=new R({color:15919832,roughness:.6});for(let e of[-.9,-.6])X(new u(.025,.025,.18-e*.1,10),M,-5.5,K+1.74+.1,e,f);{let e=new x;e.position.set(-5,K,-2.2),f.add(e),X(new u(.32,.28,.35,16,1,!0),n.wool,0,.18,0,e).material=new R({color:7033398,roughness:1,side:2}),X(new u(.28,.28,.02,16),n.trim,0,.01,0,e);let t=new R({map:r.bark.map,normalMap:r.bark.normalMap,roughness:1});for(let n=0;n<6;n++){let r=X(new u(.05,.055,.5,7),t,(n%3-1)*.12,.1+Math.floor(n/3)*.1,0,e);r.rotation.z=Math.PI/2,r.rotation.y=.3*(n-2)}g(-5.33,K,-2.53,-4.67,K+.4,-1.87,{walk:!1});let a=X(new u(.05,.06,.42,8),new R({map:r.bark.map,normalMap:r.bark.normalMap,roughness:1}),-4.55,K+.06,-1.7,f);a.rotation.z=Math.PI/2,a.rotation.y=.5,i.item(a,`firewood`,{mass:1.4,shape:`box`,sound:`wood`})}let ee=(t,r,a,s,c,l,u,d,p,h=n.trim)=>{let g=Math.atan2(-s,a),_=Math.sign(s*c-a*l)||1,v=new x;v.position.set(t,K,r),v.rotation.y=g,f.add(v);let b=new x;v.add(b),X(Y(u-.1,d-.03,.055,1.2),h,u/2,d/2,0,b);for(let e of[.35,d-.35])X(Y(u-.12,.12,.03,1.2),h,u/2,e,.04,b);X(Y(u-.12,.12,.03,1.2),h,u/2,te(d),-.04,b);for(let e of[.35,d-.35])X(Y(.35,.045,.01),n.iron,.23,e,.064,b),X(Y(.35,.045,.01),n.iron,.23,e,-.064,b);for(let e of[1,-1]){let t=X(new m(.045,.008,6,12,Math.PI),n.iron,u-.12,1,e*.06,b);t.rotation.z=Math.PI/2}let S=o.addBox(0,0,0,0,0,0,{walk:!1}),C=new os(v,`y`,_*1.75,e,{collider:S,label:p,sound:`door`,speed:3.6});return C.panel=b,C.update(0),C.s.vel=1,C.update(1e-4),C.s.vel=0,b.traverse(e=>{e.isMesh&&(e.userData.door=C)}),i.register(b,{label:()=>(C.open?`Close `:`Open `)+p,use:()=>C.toggle()}),y.push(e=>C.update(e)),i.occluder(b),C};function te(e){return e/2}v(1.12,.12,.36,n.trim,-2.1,K+2.21,3.5),v(.08,2.2,.36,n.trim,-2.64,K+1.1,3.5),v(.08,2.2,.36,n.trim,-1.56,K+1.1,3.5),v(1.12,.05,.4,n.oak,-2.1,K+.02,3.5);let re=ee(-2.6,3.5,1,0,0,-1,1,2.14,`door`),ie=ee(1.5,1.6,0,1,1,0,.9,2.08,`bedroom door`,n.oak);S.push({h:re,w:1});let N=n.glass,ae=(t,r,a,o,s,c)=>{let l=t.c,d=t.inward,m=t.axis===`x`?Ds(1,0,0):Ds(0,0,1),h=t.axis===`x`?Ds(0,0,d):Ds(d,0,0),g=(e,n,r=0)=>t.axis===`x`?Ds(e,n,l+r):Ds(l+r,n,e),_=a-r,v=s-o,b=.36,C=(e,r,i,a)=>{let o=t.axis===`x`?Y(i,a,b,1):Y(b,a,i,1),s=g(e,r);p.add(o,n.trim,J(s.x,s.y,s.z))};C((r+a)/2,K+o-.03,_+.16,.07),C((r+a)/2,K+s+.03,_+.16,.07),C(r-.03,K+(o+s)/2,.07,v),C(a+.03,K+(o+s)/2,.07,v);{let e=t.axis===`x`?Y(_+.24,.04,.2,1):Y(.2,.04,_+.24,1),i=g((r+a)/2,K+o+0,d*.24);p.add(e,n.oak,J(i.x,i.y,i.z))}let w=[],T=_/2;for(let t of[0,1]){let s=t===0?r:a,c=t===0?m.clone():m.clone().negate(),l=Math.atan2(-c.z,c.x),u=Math.sign(c.z*h.x-c.x*h.z)||1,p=g(s,K+o,d*.12),_=new x;_.position.copy(p),_.rotation.y=l,f.add(_);let b=T-.005,S=v-.01,C=.05,E=new x;_.add(E);let D=(e,t,r,i)=>X(Y(r,i,.05),n.trim,e,t,0,E);D(b/2,C/2,b,C),D(b/2,S-C/2,b,C),D(C/2,S/2,C,S),D(b-C/2,S/2,C,S),D(b/2,S/2,b,.03),D(b/2,S*.25,b,.025),D(b/2,S*.75,b,.025);let O=X(new Tt(b-C,S-C),N,b/2,S/2,0,E,{cast:!1});O.receiveShadow=!1;let k=new os(_,`y`,u*1.45,e,{sound:t===0?`window`:`none`,speed:4});w.push(k),y.push(e=>k.update(e)),i.occluder(E)}let E={open:!1},D=()=>{E.open=!E.open,w.forEach(e=>{e.open!==E.open&&e.toggle()})};for(let e of w)i.register(e.g,{label:()=>E.open?`Close window`:`Open window`,use:D});if(S.push({h:E,w:.5,isWin:!0,pos:g((r+a)/2,K+o+.5,0)}),c){for(let i of[-1,1]){let c=n.linen.clone();c.side=2,c.color=new F(14207144);let l={uSway:{value:0},uT:{value:0}};c.onBeforeCompile=e=>{e.uniforms.uSway=l.uSway,e.uniforms.uT=l.uT,e.vertexShader=`uniform float uSway; uniform float uT;
`+e.vertexShader.replace(`#include <begin_vertex>`,`vec3 transformed = position; float k = (1.15 - uv.y); transformed.z += (sin(uT * 2.3 + position.x * 3.0 + position.y * 2.0) * uSway * k * 0.18) ; transformed.x += sin(uT * 1.7 + position.y) * uSway * k * 0.05;`)},c.customProgramCacheKey=()=>`curtain`;let u=new Tt(.42,v+.45,16,8);{let e=u.attributes.position;for(let t=0;t<e.count;t++)e.setZ(t,Math.sin(e.getX(t)*38)*.025);u.computeVertexNormals()}let p=new I(u,c),m=g(i<0?r-.12:a+.12,K+(o+s)/2+.12,d*.24);p.position.copy(m),t.axis===`z`&&(p.rotation.y=Math.PI/2),p.castShadow=!0,f.add(p),y.push((t,n)=>{l.uT.value=n,l.uSway.value+=((E.open?.4+e.weather.w.gust*1.4:.05)-l.uSway.value)*Math.min(1,t)})}let i=t.axis===`x`?new u(.012,.012,_+.7,8).rotateZ(Math.PI/2):new u(.012,.012,_+.7,8).rotateX(Math.PI/2),c=g((r+a)/2,K+s+.42,d*.24);p.add(i,n.iron,J(c.x,c.y,c.z))}return E};ae(C[0],-5,-3.8,.9,2.1,!0),ae(C[0],-.6,.6,.9,2.1,!0),ae(C[0],3,4.2,.9,2.1,!0),ae(C[1],-1.2,0,1.05,2.05,!1),ae(C[1],3.4,4.6,1.15,2.1,!0),ae(C[3],-.6,.6,.9,2.1,!0);let oe=[],se=(e,t,r,a)=>{let o=new x;o.position.set(e,K+1.25,t),f.add(o),X(is(.08,.12,.012,.004,1),n.brass,0,0,0,o);let s=X(Y(.012,.035,.02),n.ceramic,0,0,.012,o),c=()=>{s.rotation.x=a.on?-.5:.5};c(),i.register(o,{label:()=>(a.on?`Switch off `:`Switch on `)+r,use:()=>{a.toggle(o.getWorldPosition(Ds())),c()}})};{let t=new x;t.position.set(-2,K+2.76,0),f.add(t),X(new u(.006,.006,.5,4),n.black,0,-.25,0,t);let r=new R({color:2832942,roughness:.5,metalness:.4,side:2,emissive:16752720,emissiveIntensity:0});X(new u(.08,.28,.22,24,1,!0),r,0,-.6,0,t,{cast:!1});let i=n.bulb.clone();X(new V(.05,12,8),i,0,-.66,0,t,{cast:!1});let a=new le(16762506,0,12,1.5);a.position.set(0,-.72,0),t.add(a);let o=new fs(e,a,[[i,6],[r,.05]],{intensity:9});oe.push(o),se(-2.85,3.33,`ceiling light`,o)}{let t=new x;t.position.set(-2.15,K,-1.5),f.add(t),X(new u(.16,.18,.03,20),n.iron,0,.015,0,t),X(new u(.012,.012,1.45,8),n.brass,0,.74,0,t);let r=n.shade.clone();X(new u(.15,.22,.28,24,1,!0),r,0,1.5,0,t,{cast:!1});let a=n.bulb.clone();X(new V(.04,10,8),a,0,1.47,0,t,{cast:!1});let o=new le(16759160,0,8,1.6);o.position.set(0,1.42,0),t.add(o);let s=new fs(e,o,[[a,5],[r,1.4]],{intensity:5,on:!0});oe.push(s);let c=X(new u(.003,.003,.18,4),n.brass,.08,1.3,0,t);i.register(t,{label:()=>s.on?`Switch off lamp`:`Switch on lamp`,use:()=>{s.toggle(),c.position.y=1.27,setTimeout(()=>c.position.y=1.3,150)}}),g(-2.33,K,-1.68,-1.97,K+1.7,-1.32,{walk:!1})}{let t=new x;t.position.set(-3.1,K+2.05,3.74),f.add(t),X(Y(.12,.2,.06),n.iron,0,0,-.03,t);let r=_s(n,e);r.position.set(0,-.2,.12),t.add(r),r.remove(r.userData.light);let i=r.userData.flame.material;i.emissiveIntensity=0;let a=new le(16756832,0,10,1.6);a.position.set(0,-.08,.15),t.add(a);let o=new fs(e,a,[[i,4]],{intensity:6});oe.push(o),se(-3.05,3.33,`porch light`,o),e.autoPorch=o}y.push(e=>oe.forEach(t=>t.update(e)));{let e=new Tt(3.2,2.3);e.rotateX(-Math.PI/2),X(e,n.rug,-3.45,K+.006,0,f,{cast:!1})}{let t=new x;t.position.set(-2.2,K,0),t.rotation.y=Math.PI/2,f.add(t),X(is(2.1,.26,.9,.05),n.sofa,0,.24,0,t);for(let e of[-.66,0,.66])X(is(.64,.16,.7,.07,4),n.sofa,e,.44,-.08,t);for(let e of[-.66,0,.66]){let r=X(is(.64,.5,.2,.08,4),n.sofa,e,.68,.32,t);r.rotation.x=-.12}for(let e of[-1,1])X(is(.16,.62,.92,.07,4),n.sofa,e,.42,0,t);for(let[e,r]of[[-.95,-.38],[.95,-.38],[-.95,.38],[.95,.38]])X(new u(.025,.02,.11,8),n.darkWood,e,.055,r,t);let r=X(is(.5,.03,.95,.012),n.wool,.98,.72,0,t);r.rotation.z=.1,X(is(.04,.4,.95,.012),n.wool,1.08,.53,0,t),g(-2.65,K,-1.08,-1.75,K+.5,1.08,{walk:!1}),g(-1.95,K,-1.08,-1.75,K+.95,1.08,{walk:!1});for(let n of[-.55,.55]){let r={eye:Ds(-2.28,K+1.12,n),yaw:Math.PI/2,exit:Ds(-3.05,K,n)},a=X(new Fe(.7,.2,.9),new Re({visible:!1}),n*1.2,.48,-.05,t);a.position.x=-n,i.register(a,{label:`Sit on the sofa`,use:()=>e.player.sit(r)})}let a=X(is(.42,.42,.13,.06,4),n.wool,-2.05,K+.72,.75,f);a.rotation.set(0,Math.PI/2+.2,.15),i.item(a,`cushion`,{mass:.4,sound:`soft`})}{let t=.62,r=new x;r.position.set(-4.35,K,2.3),r.rotation.y=t,f.add(r),X(is(.85,.3,.8,.06),n.wool,0,.27,0,r),X(is(.62,.14,.62,.06,4),n.wool,0,.47,-.05,r);let a=X(is(.85,.72,.18,.07,4),n.wool,0,.75,.33,r);a.rotation.x=-.1;for(let e of[-.38,.38])X(is(.14,.55,.8,.06,4),n.wool,e,.45,0,r);let o={eye:Ds(-4.35+Math.sin(t)*-.02,K+1.12,2.3+Math.cos(t)*.02),yaw:t,exit:Ds(-4.35-Math.sin(t)*.85,K,2.3-Math.cos(t)*.85)};i.register(r,{label:`Sit in the armchair`,use:()=>e.player.sit(o)}),g(-4.85,K,1.8,-3.85,K+.55,2.8,{walk:!1})}{let e=new x;e.position.set(-3.4,K,0),f.add(e),X(is(.62,.06,1.15,.015),n.darkWood,0,.42,0,e),X(Y(.5,.03,1),n.darkWood,0,.12,0,e);for(let[t,r]of[[-.26,-.52],[.26,-.52],[-.26,.52],[.26,.52]])X(Y(.05,.4,.05),n.darkWood,t,.2,r,e);g(-3.71,K,-.58,-3.09,K+.45,.58,{walk:!1});let t=X(ps(),n.ceramicBlue,-3.3,K+.45,.25,f);i.item(t,`mug`,{mass:.3,shape:`cylinder`,sound:`ceramic`});let r=ms(new R({color:7023134,roughness:.6}));r.position.set(-3.45,K+.47,-.25),r.rotation.set(-Math.PI/2,0,.4),f.add(r),i.item(r,`book`,{mass:.5,sound:`soft`}),X(is(.18,.06,.18,.01),n.oak,-3.5,K+.48,0,f)}{let e=new x;e.position.set(-4.5,K,-3.17),f.add(e);for(let t of[-.8,.8])X(Y(.04,2,.32),n.darkWood,t,1,0,e);for(let t=0;t<6;t++)X(Y(1.6,.03,.32),n.darkWood,0,.05+t*.38,0,e);X(Y(1.64,2,.02),n.darkWood,0,1,-.15,e);let t=new Fe(1,1,1),r=[5971738,2046538,3951138,7031326,2763306,8022602,4860490,9058842,2310447],a=new ne(t,new R({roughness:.75}),140),o=0,s=new F,c=new yt,d=new l,p=new b;for(let e=0;e<5;e++){let t=-.76;for(;t<.72&&o<140;){let n=.025+h()*.035,i=.2+h()*.12,l=.16+h()*.08;if(h()<.08){t+=.12;continue}let u=h()<.06?.25:0;d.setFromEuler(new _(0,0,u)),c.compose(Ds(t+n/2,.065+e*.38+i/2,.02),d,p.set(n,i,l)),a.setMatrixAt(o,c),a.setColorAt(o,s.setHex(r[Math.floor(h()*r.length)]).multiplyScalar(.8+h()*.4)),t+=n+.002,o++}}a.count=o,a.castShadow=!0,a.receiveShadow=!0,e.add(a),g(-5.32,K,-3.35,-3.68,K+2,-3,{walk:!1});let m=X(new u(.035,.04,.24,12),new Ve({color:3103290,roughness:.1,transparent:!0,opacity:.7}),-4,K+.05+1.9+.13,-3.1,f);i.item(m,`bottle`,{mass:.4,shape:`cylinder`,sound:`glass`});for(let e=0;e<2;e++){let t=ms(new R({color:[2046538,3951138][e],roughness:.6}),.14,.2,.04);t.position.set(-4.95+e*.25,K+.05+.76+.03,-3.08),t.rotation.set(-Math.PI/2,0,.3+e),f.add(t),i.item(t,`book`,{mass:.45,sound:`soft`})}}{let t=-3.34,a=-2.74,o=-2.4,s=.9,c=.9,l=.8400000000000001,p=-6.08/2-.02,_=.5599999999999996;v(.8999999999999999,l,_,n.boards,-3.9/2,K+l/2,p,1.2),v(1,l,_,n.boards,.8/2,K+l/2,p,1.2);let b=new R({map:r.boards.map,color:9075304,roughness:.85});v(1.4,.03,_,b,-.8,K+.075,p,1.2),v(1.4,.02,.5099999999999996,b,-.8,K+.43,-3.08,1.2),v(1.4,l,.02,b,-.8,K+l/2,-3.33,1.2),v(.02,l,_,b,-1.49,K+l/2,p,1.2),v(.02,l,_,b,-.11,K+l/2,p,1.2),v(1.4,.06,.03,n.trim,-.8,K+.04,-2.75,1.2);for(let[e,n]of[[o,-1.5],[-.1,s]])g(e,K,t,n,K+c,a,{walk:!1});g(-1.5,K,t,-.1,K+.09,a,{walk:!0}),g(-1.5,K+.42,t,-.1,K+.44,-2.8000000000000003,{walk:!1}),g(-1.5,K+.78,t,-.1,K+c,a,{walk:!1}),g(-1.5,K,t,-.1,K+c,-3.31,{walk:!1});let S=new x;X(new u(.11,.1,.13,20,1,!0),n.steel,0,.065,0,S).material=new R({color:3815996,metalness:.8,roughness:.4,side:2}),X(new u(.1,.1,.006,20),n.iron,0,.003,0,S),X(new u(.008,.008,.16,6),n.black,.18,.11,0,S).rotation.z=Math.PI/2,S.position.set(-1.15,K+.09,-3),f.add(S),i.item(S,`cooking pot`,{mass:1.2,sound:`metal`});let C=new Ve({color:14214364,roughness:.08,transparent:!0,opacity:.55});[[12076074,-.55],[14725184,-.42],[6961786,-.3]].forEach(([e,t])=>{let r=new x;r.position.set(t,K+.44,-3.02),f.add(r),X(new u(.045,.045,.12,14),C,0,.06,0,r),X(new u(.04,.04,.08,14),new R({color:e,roughness:.5}),0,.045,0,r),X(new u(.048,.048,.02,14),n.brass,0,.125,0,r),i.item(r,`jar of preserves`,{mass:.5,shape:`cylinder`,sound:`glass`})});let w=new x;w.position.set(-.6,K+.09,-2.95),f.add(w),X(is(.16,.03,.06,.01),n.oak,0,.035,0,w),X(Y(.15,.025,.05),new R({color:13152368,roughness:1}),0,.012,0,w),i.item(w,`scrubbing brush`,{mass:.2,sound:`wood`}),X(new u(.02,.02,.35,8),n.steel,-.6,K+.6,-3.15,f);let T=(e,t,r,i)=>v(t-e,.06,i-r,n.oak,(e+t)/2,K+c-.03,(r+i)/2,1.2);T(o,-.95,t,-2.7100000000000004),T(-.25,s,t,-2.7100000000000004),T(-.95,-.25,t,-3.24),T(-.95,-.25,-2.84,-2.7100000000000004),v(.68,.18,.38,n.steel,-.6,K+c-.12,-3.04,1),v(.62,.01,.32,n.soot,-.6,K+c-.2,-3.04,1);let E=new x;E.position.set(-.6,K+c,-3.27),f.add(E),X(new u(.02,.025,.25,10),n.steel,0,.125,0,E);let D=X(new m(.1,.014,8,16,Math.PI),n.steel,0,.25,.1,E);D.rotation.y=Math.PI/2;let O=X(new u(.025,.025,.03,10),n.steel,.08,.06,0,E),k=new Ve({color:13623528,roughness:.05,transparent:!0,opacity:.45,envMapIntensity:1.5}),A=X(new u(.006,.008,.36,8),k,0,.07,.2,E,{cast:!1});A.visible=!1;let j=d?.water(Ds(-.6,K+c,-3.07)),M=!1;i.register(E,{label:()=>M?`Turn off the tap`:`Turn on the tap`,use:()=>{M=!M,A.visible=M,O.rotation.y=M?1.2:0,j?.set(M),d?.creak(E.position,.03,.2,400)}}),y.push((e,t)=>{M&&(A.scale.x=A.scale.z=1+Math.sin(t*40)*.1)});for(let t of[-1.95,.42]){let r=new x;r.position.set(t,K+.72,-2.99),f.add(r),X(Y(.72,.16,.03),n.trim,0,0,.26,r),X(Y(.66,.12,.48),n.boards,0,-.01,0,r).material=n.oak;let a=X(new u(.01,.01,.14,6),n.iron,0,0,.29,r);a.rotation.z=Math.PI/2;for(let e=0;e<4;e++){let t=X(Y(.02,.005,.2),n.steel,-.2+e*.05,.05,0,r,{cast:!1});t.rotation.y=.1*e}let o=new ss(r,Ds(0,0,1),.34,e);i.register(r,{label:()=>o.open?`Close drawer`:`Open drawer`,use:()=>o.toggle()}),y.push(e=>o.update(e));for(let e of[-.36,-.62])v(.72,.24,.03,n.trim,t,K+.72+e,-2.725)}let ee=(t,r,a)=>{let o=new x;o.position.set(t,K+.08,-2.72),f.add(o),o.rotation.y=r>0?0:Math.PI;let s=new x;o.add(s),X(Y(.68,.7,.03),n.trim,.35,.35,0,s),X(new V(.018,8,6),n.iron,.62,.6,.03,s);let c=new os(o,`y`,a*1.6,e,{sound:`cabinet`,speed:6});i.register(s,{label:()=>c.open?`Close cupboard`:`Open cupboard`,use:()=>c.toggle()}),y.push(e=>c.update(e))};ee(-1.48,1,-1),ee(.06,-1,1),X(new u(.07,.08,.3,14),new R({color:5925458,roughness:.6}),-1.1,K+.25,-3,f),v(1.2,.04,.26,n.oak,-1.85,K+1.62,-3.21,1);for(let e=0;e<4;e++){let t=X(new u(.11,.08,.02,20),n.ceramic,-2.3+e*.035,K+1.75,-3.25,f);t.rotation.z=Math.PI/2-.12}for(let e=0;e<3;e++)X(new u(.05,.05,.15,14),new Ve({color:12636360,roughness:.08,transparent:!0,opacity:.5}),-1.8+e*.16,K+1.715,-3.2,f);let te=gs(n);te.position.set(-1.9,K+c,-3),f.add(te),i.item(te,`kettle`,{mass:1,sound:`metal`});let ne=X(is(.4,.025,.28,.01),n.oak,.45,K+c+.012,-3,f);i.item(ne,`cutting board`,{mass:.6,sound:`wood`});for(let e=0;e<2;e++){let t=X(ps(),e?n.ceramic:n.ceramicBlue,-2.2+e*.14,K+c,-2.9,f);t.rotation.y=h()*6,i.item(t,`mug`,{mass:.3,shape:`cylinder`,sound:`ceramic`})}}{let t=new x;t.position.set(0,K,2.35),f.add(t),X(is(1.25,.05,.8,.01),n.oak,0,.75,0,t);for(let[e,r]of[[-.55,-.33],[.55,-.33],[-.55,.33],[.55,.33]])X(Y(.06,.73,.06),n.oak,e,.365,r,t);g(-.63,K,1.95,.63,K+.78,2.75,{walk:!0,tag:`wood`});for(let[t,r]of[[-.85,-Math.PI/2],[.88,Math.PI/2]]){let a=bs(n,f,t,K,2.35,r);g(t-.22,K,2.13,t+.22,K+.48,2.57,{walk:!1});let o={eye:Ds(t-Math.sin(r)*-.04,K+1.12,2.35),yaw:r,exit:Ds(t+-.45,K,2.35)};o.exit.set(t<0?t-.1:t-.15,K,1.6),i.register(a,{label:`Sit down`,use:()=>e.player.sit(o)})}let r=X(new V(.13,20,10,0,Math.PI*2,Math.PI/2,Math.PI/2),new R({color:8016434,roughness:.6,side:2}),.1,K+.9,2.3,f);r.rotation.x=0,g(-.03,K+.775,2.17,.23,K+.8,2.43,{walk:!1});let a=[new R({color:10100244,roughness:.35}),new R({color:8034858,roughness:.4})];for(let e=0;e<3;e++){let t=X(hs(),a[e%2],.06+(e-1)*.07,K+.84+(e===1?.05:0),2.3+e%2*.04,f);i.item(t,`apple`,{mass:.2,shape:`sphere`,sound:`soft`})}let o=new x;o.position.set(-.3,K+.775,2.4),f.add(o),X(new u(.05,.06,.02,14),n.brass,0,.01,0,o),X(new u(.022,.022,.16,12),M,0,.1,0,o);let s=new R({color:16765072,emissive:16751168,emissiveIntensity:0,transparent:!0,opacity:0}),c=X(new V(.01,8,6),s,0,.2,0,o,{cast:!1});c.scale.y=2.4;let l=!1;i.register(o,{label:()=>l?`Blow out the candle`:`Light the candle`,use:()=>{l=!l,l?d?.match(o.position):d?.noiseHit(o.position,{buf:d.pink,type:`bandpass`,f:500,a:.05,d:.3,v:.2})}}),y.push((e,t)=>{s.opacity+=(+!!l-s.opacity)*Math.min(1,e*5),s.emissiveIntensity=s.opacity*(3+Math.sin(t*17)*.5),c.scale.x=1+Math.sin(t*11)*.12,c.visible=s.opacity>.02})}{let t=new x;t.position.set(1.2,K,-1.1),f.add(t),X(is(.46,.85,1.6,.01),n.darkWood,0,.425,0,t),g(.96,K,-1.9,1.44,K+.86,-.3,{walk:!1});for(let t of[-.4,.4]){let r=new x;r.position.set(1.2,K+.7,-1.1+t),f.add(r),X(Y(.03,.18,.74),n.oak,-.235,0,0,r);let a=X(new u(.01,.01,.14,6),n.brass,-.26,0,0,r);if(a.rotation.x=Math.PI/2,X(Y(.4,.12,.68),n.oak,-.02,-.02,0,r),t<0)for(let e=0;e<3;e++){let t=X(Y(.12,.004,.09),n.paper,-.05+e*.03,.045+e*.004,-.1+e*.08,r,{cast:!1});t.rotation.y=e*.3}else X(new m(.03,.01,6,14),n.brass,-.05,.05,0,r).rotation.x=Math.PI/2;let o=new ss(r,Ds(-1,0,0),.3,e);i.register(r,{label:()=>o.open?`Close drawer`:`Open drawer`,use:()=>o.toggle()}),y.push(e=>o.update(e))}let a=new x;a.position.set(1.18,K+.85,-1.45),a.rotation.y=-Math.PI/2,f.add(a),X(is(.42,.26,.18,.03),new R({map:r.grain.map,color:11565648,roughness:.35}),0,.13,0,a);let o=new R({map:r.grille,roughness:.9});X(new Tt(.2,.16),o,-.08,.14,.091,a,{cast:!1});let s=new R({color:15259824,emissive:16752704,emissiveIntensity:0});X(new Tt(.12,.05),s,.12,.17,.091,a,{cast:!1});let p=X(Y(.003,.04,.002),n.black,.08,.17,.094,a,{cast:!1});for(let e of[.08,.16]){let t=X(new u(.018,.018,.02,12),n.brass,e,.07,.095,a);t.rotation.x=Math.PI/2}let h=e.makeRadio(a.getWorldPosition(Ds()).add(Ds(0,.15,0)));i.register(a,{label:()=>!h||!h.on?`Turn on the radio`:h.station===0?`Change station`:`Turn off the radio`,use:()=>{if(!h)return;let t=h.toggle();s.emissiveIntensity=t?1.2:0,p.position.x=h.station===1?.15:.08,e.ui.toast(t?`♪  `+t:`Radio off`)}});let v=new x;v.position.set(1.42,K+2.05,-1.1),v.rotation.y=-Math.PI/2,f.add(v),X(new u(.2,.2,.05,32),n.darkWood,0,0,0,v).rotation.x=Math.PI/2,X(new bt(.175,32),new R({map:r.clock,roughness:.6}),0,0,.027,v,{cast:!1});let b=new x,S=new x;b.position.z=S.position.z=.032,v.add(b,S),X(Y(.012,.09,.003),n.black,0,.04,0,b,{cast:!1}),X(Y(.008,.14,.003),n.black,0,.065,.002,S,{cast:!1}),d?.clock(v.getWorldPosition(Ds())),y.push(()=>{let t=e.clock.hour;b.rotation.z=-(t%12/12)*Math.PI*2,S.rotation.z=-(t%1)*Math.PI*2}),i.register(v,{label:()=>{let t=e.clock.hour,n=Math.floor(t),r=Math.floor(t%1*60);return`It's ${(n+11)%12+1}:${String(r).padStart(2,`0`)} ${n<12?`am`:`pm`}`},use:()=>{}});let C=new x;C.position.set(1.15,K,.55),f.add(C);for(let e of[-.12,.12]){let t=X(Y(.03,.42,.03),n.darkWood,0,.2,e,C);t.rotation.x=e*1.5}X(Y(.18,.03,.3),n.darkWood,.05,.12,0,C);let w=new x,T=new c;T.absellipse(0,0,.2,.24,0,Math.PI*2);let E=new R({color:13671008,roughness:.3,map:r.grain.map});X(new At(T,{depth:.09,bevelEnabled:!0,bevelSize:.01,bevelThickness:.01}),E,0,0,-.045,w);let D=X(new u(.15,.15,.09,24),E,0,.22,0,w);D.rotation.x=Math.PI/2,X(new u(.05,.05,.002,20),n.black,0,.17,.056,w).rotation.x=Math.PI/2,X(Y(.05,.55,.03),n.darkWood,0,.6,.02,w),X(Y(.07,.15,.03),n.darkWood,0,.93,.01,w);for(let e=0;e<6;e++)X(Y(.0015,.75,.0015),n.steel,-.013+e*.0052,.5,.04,w,{cast:!1});w.position.set(1.17,K+.36,.55),w.rotation.set(0,-Math.PI/2,-.22),f.add(w);let O=i.item(w,`guitar`,{mass:2.4,sound:`wood`});O.instrument=!0,O.play=()=>d?.strum(w.getWorldPosition(Ds()));{let e=Ds(-.86,.32,-.38).normalize(),t=Ds(.05,.55,.83),n=t.sub(e.clone().multiplyScalar(t.dot(e))).normalize(),r=Ds().crossVectors(e,n),i=new l().setFromRotationMatrix(new yt().makeBasis(r,e,n));O.holdPose={offset:Ds(.12,-.36,-.52).addScaledVector(e,-.18),euler:new _().setFromQuaternion(i)}}g(1,K,.38,1.3,K+.14,.72,{walk:!0})}let ce=(()=>{let e=document.createElement(`canvas`);e.width=256,e.height=192;let t=e.getContext(`2d`),n=t.createLinearGradient(0,0,0,192);n.addColorStop(0,`#e9b97a`),n.addColorStop(.5,`#c87e5a`),n.addColorStop(1,`#3a3c48`),t.fillStyle=n,t.fillRect(0,0,256,192),t.fillStyle=`#f5d9a0`,t.beginPath(),t.arc(170,88,16,0,7),t.fill(),t.fillStyle=`#5a4a5a`,t.beginPath(),t.moveTo(0,110);for(let e=0;e<=256;e+=16)t.lineTo(e,100-Math.sin(e*.03)*20-Math.random()*6);t.lineTo(256,192),t.lineTo(0,192),t.fill(),t.fillStyle=`#2a3a3a`;for(let e=0;e<256;e+=7){let n=30+Math.random()*30;t.beginPath(),t.moveTo(e,130),t.lineTo(e+4,130-n),t.lineTo(e+8,130),t.fill()}t.fillStyle=`rgba(200,170,140,0.5)`,t.fillRect(0,135,256,4);let r=new L(e);return r.colorSpace=a,r})();{let e=new x;e.position.set(1.58,K+1.6,-1.6),e.rotation.y=Math.PI/2,f.add(e),X(Y(.86,.66,.04),n.darkWood,0,0,0,e),X(new Tt(.76,.56),new R({map:ce,roughness:.8}),0,0,.021,e,{cast:!1})}{let t=new x;t.position.set(4,K,-2.3),f.add(t),X(Y(1.7,.3,2.15,1),n.darkWood,0,.2,0,t),X(Y(1.75,1.05,.08,1),n.darkWood,0,.52,-1.06,t),X(Y(1.75,.55,.06,1),n.darkWood,0,.3,1.07,t);for(let e of[-.85,.85])for(let r of[-1.06,1.07])X(new u(.045,.045,r<0?1.15:.7,10),n.darkWood,e,r<0?.575:.35,r,t);X(is(1.6,.2,2,.06,4),n.linen,0,.45,-.02,t);let r=X(is(1.66,.06,1.45,.03,3),n.quilt,0,.56,.3,t);X(is(1.66,.04,.3,.02,3),n.linen,0,.565,-.45,t);for(let e of[.85,-.85])X(Y(.02,.32,1.45),n.quilt,e*1,.43,.3,t);g(3.15,K,-3.4,4.85,K+.58,-1.2,{walk:!0,tag:`soft`});for(let e of[-.4,.4]){let t=X(is(.6,.14,.38,.07,4),n.linen,4+e,K+.65,-3.05,f);t.rotation.x=-.25,i.item(t,`pillow`,{mass:.4,sound:`soft`})}let a={eye:Ds(4,K+.95,-2.55),yaw:Math.PI,lie:!0,exit:Ds(2.85,K,-2),yawLimit:3};i.register(r,{label:`Lie down and rest`,use:()=>{e.player.sit(a),e.ui.toast(`Resting… time drifts by`)}});let o=new x;o.position.set(5.3,K,-3.05),f.add(o),X(is(.5,.55,.45,.01),n.darkWood,0,.3,0,o),g(5.05,K,-3.3,5.55,K+.58,-2.82,{walk:!1});let s=new x;s.position.set(5.3,K+.45,-3.05),f.add(s),X(Y(.44,.13,.03),n.oak,0,0,.24,s),X(new V(.015,8,6),n.brass,0,0,.26,s),X(Y(.4,.1,.4),n.oak,0,-.01,.02,s),X(new u(.025,.025,.008,16),n.brass,-.08,.05,.05,s,{cast:!1});let c=X(Y(.14,.003,.1),n.paper,.06,.042,0,s,{cast:!1});c.rotation.y=.3,i.register(c,{label:`Read the old letter`,use:()=>e.ui.paper(`A letter, folded many times`,`<p>If you're reading this, you found the cabin. Good.</p><p>The fire draws best with the window cracked open. The radio only gets two stations and that's plenty. Deer come to the meadow at dawn if you're quiet — crouch, and let them come to you.</p><p>There's tea in the jars under the sink, and the dock is the best place in the world to watch the rain.</p><p>Stay as long as you like. Leave the place a little better than you found it.</p><p style="text-align:right">— M.</p>`)});let l=new ss(s,Ds(0,0,1),.28,e);i.register(s,{label:()=>l.open?`Close drawer`:`Open drawer`,use:()=>l.toggle()}),y.push(e=>l.update(e));let d=new x;d.position.set(5.32,K+.575,-3.12),f.add(d),X(new u(.06,.08,.2,16),n.ceramicBlue,0,.1,0,d);let p=n.shade.clone();X(new u(.1,.15,.17,20,1,!0),p,0,.3,0,d,{cast:!1});let m=n.bulb.clone();X(new V(.03,8,6),m,0,.27,0,d,{cast:!1});let h=new le(16756848,0,6,1.7);h.position.set(0,.25,.05),d.add(h);let _=new fs(e,h,[[m,5],[p,1.5]],{intensity:3.5});oe.push(_),i.register(d,{label:()=>_.on?`Switch off the bedside lamp`:`Switch on the bedside lamp`,use:()=>_.toggle()});let v=ms(new R({color:2310447,roughness:.6}),.13,.19,.03);v.position.set(5.2,K+.6,-2.92),v.rotation.set(-Math.PI/2,0,-.5),f.add(v),i.item(v,`book`,{mass:.4,sound:`soft`})}{let t=new x;t.position.set(4,K,-.95),f.add(t),X(is(1,.42,.5,.02),n.oak,0,.21,0,t);for(let e of[-.42,.42])X(Y(.04,.43,.52),n.iron,e,.215,0,t);X(is(.9,.06,.4,.01),n.wool,0,.38,0,t);let r=new x;r.position.set(4,K+.42,-1.2),f.add(r);let a=new x;r.add(a),X(is(1.02,.08,.52,.02),n.oak,0,.04,.25,a),X(Y(.08,.06,.02),n.brass,0,0,.51,a);let o=new os(r,`x`,-1.6,e,{sound:`lid`,speed:4});i.register(a,{label:()=>o.open?`Close the chest`:`Open the chest`,use:()=>o.toggle()}),y.push(e=>o.update(e)),g(3.48,K,-1.22,4.52,K+.48,-.68,{walk:!0,tag:`wood`})}{let t=.85,a=2.25,o=2.05;v(.5999999999999996,o,.03,n.darkWood,11.1/2,K+o/2,t,1.2),v(.5999999999999996,o,.03,n.darkWood,11.1/2,K+o/2,a,1.2),v(.5999999999999996,.04,1.4,n.darkWood,11.1/2,K+o,3.1/2,1.2),v(.5999999999999996,.06,1.4,n.darkWood,11.1/2,K+.03,3.1/2,1.2),v(.02,o,1.4,n.darkWood,5.84,K+o/2,3.1/2,1.2),g(5.25,K,t,5.85,K+o,a,{walk:!1});let s=X(new u(.012,.012,1.4-.05,6),n.brass,5.55,K+1.8,3.1/2,f);s.rotation.x=Math.PI/2,[3820122,8010282,2767402,13154458,4864554].forEach((e,t)=>{let n=X(is(.42,.9,.05,.02),new R({map:r.wool.map,color:e,roughness:1}),5.55,K+1.32,1.05+t*.24,f);n.rotation.y=Math.PI/2+(h()-.5)*.3});let c=(t,r,a)=>{let o=new x;o.position.set(5.235,K+.06,t),o.rotation.y=Math.atan2(-r,0),f.add(o);let s=new x;o.add(s),X(Y(.69,1.9499999999999997,.03),n.oak,.35,1.9499999999999997/2,0,s),X(Y(.5,.7,.012),n.darkWood,.35,1.3,-.02,s),X(Y(.5,.7,.012),n.darkWood,.35,.5,-.02,s),X(new V(.02,8,6),n.brass,.63,1,-.04,s);let c=new os(o,`y`,a*1.7,e,{sound:`cabinet`,speed:4.5});i.register(s,{label:()=>c.open?`Close wardrobe`:`Open wardrobe`,use:()=>c.toggle()}),y.push(e=>c.update(e))};c(t,1,-1),c(a,-1,1)}{let t=new x;t.position.set(3.6,K,3.1),f.add(t),X(is(1.3,.04,.48,.01),n.oak,0,.75,0,t);for(let[e,r]of[[-.6,-.2],[.6,-.2],[-.6,.2],[.6,.2]])X(Y(.045,.73,.045),n.oak,e,.365,r,t);g(2.95,K,2.86,4.25,K+.77,3.34,{walk:!1});let r=bs(n,f,3.6,K,2.45,Math.PI),a={eye:Ds(3.6,K+1.12,2.5),yaw:Math.PI,exit:Ds(3,K,1.9)};i.register(r,{label:`Sit at the desk`,use:()=>e.player.sit(a)}),g(3.38,K,2.24,3.82,K+.48,2.66,{walk:!1});let o=ms(new R({color:3811866,roughness:.8}),.16,.22,.02);o.position.set(3.45,K+.78,3.08),o.rotation.set(-Math.PI/2,0,.1),f.add(o),i.register(o,{label:`Write in your journal`,use:()=>e.ui.journal()});let s=X(new u(.005,.005,.14,6),n.black,3.7,K+.775,3.05,f);s.rotation.set(Math.PI/2,0,.6),i.item(s,`pen`,{mass:.05,sound:`wood`});let c=new x;c.position.set(4.05,K+.77,3.15),f.add(c),X(new u(.06,.045,.1,12),new R({color:10508346,roughness:.8}),0,.05,0,c);for(let e=0;e<7;e++){let t=X(new V(.035,8,6),new R({color:3828266,roughness:.6}),Math.cos(e)*.04,.12+e%3*.03,Math.sin(e)*.04,c);t.scale.set(1,.4,1.8),t.rotation.y=e}{let e=new Tt(1.8,1);e.rotateX(-Math.PI/2),X(e,n.rug,3.9,K+.006,.3,f,{cast:!1})}}v(8.9,.06,2.7,n.deck,-1.85,K-.05,4.98,1.6),v(8.9,.5,.1,n.trim,-1.85,K-.33,6.3,1),g(-6.3,-2,3.6,2.6,K-.02,6.35,{tag:`wood`});for(let e=0;e<3;e++){let t=K-.02-(e+1)*.19,r=6.47+e*.3;v(1.9,.05,.32,n.deck,-2.1,t-.025,r,1.6),v(1.9,t+.05,.06,n.trim,-2.1,t/2,r+.13,1),g(-3.05,-2,r-.16,-1.15,t,r+.16,{tag:`wood`})}for(let e of[-6.2,-3.1,-1.1,2.5]){let t=new u(.1,.11,2.5,12);p.add(t,n.logs,J(e,K+1.2,6.15)),g(e-.11,K,6.04,e+.11,K+2.4,6.26,{walk:!1})}let ue=(e,t,r,i)=>{let a=Math.hypot(r-e,i-t),o=(e+r)/2,s=(t+i)/2,c=Math.atan2(-(i-t),r-e);p.add(Y(a,.08,.1),n.trim,J(o,K+.95,s,0,c,0)),p.add(Y(a,.06,.06),n.trim,J(o,K+.12,s,0,c,0));let l=Math.floor(a/.16);for(let a=1;a<l;a++){let o=a/l;p.add(Y(.04,.8,.04),n.trim,J(e+(r-e)*o,K+.53,t+(i-t)*o))}g(Math.min(e,r)-.06,K,Math.min(t,i)-.06,Math.max(e,r)+.06,K+1,Math.max(t,i)+.06,{walk:!1})};ue(-6.2,6.15,-3.1,6.15),ue(-1.1,6.15,2.5,6.15),ue(-6.25,3.75,-6.25,6.15),ue(2.55,3.75,2.55,6.15);{let e=Math.atan(.42/3),t=Math.hypot(3,.42),r=new Tt(9.3,t);r.rotateX(-Math.PI/2),qo(r,2.2),r.translate(0,.07,0);let i=new Tt(9.3,t);i.rotateX(Math.PI/2),qo(i,1.6),i.translate(0,-.07,0);let a=J(-1.85,K+2.67-.21,5.1,e,0,0);p.add(r,n.shingles,a),p.add(i,n.ceiling,a),p.add(new Fe(9.3,.14,t-.02),n.trim,a),p.add(Y(9,.14,.14),n.trim,J(-1.85,K+2.42,6.15))}{let t=new x;t.position.set(-4.6,K-.02,5),t.rotation.y=Math.PI,f.add(t);let r=new x;t.add(r);for(let e of[-.24,.24]){let t=X(new m(1,.02,6,24,.9),n.oak,e,1.02,0,r);t.rotation.y=Math.PI/2,t.rotation.z=-Math.PI/2-.45,X(Y(.04,.42,.04),n.oak,e,.25,-.2,r),X(Y(.04,1,.04),n.oak,e,.55,.22,r).rotation.x=-.12,X(Y(.05,.04,.5),n.oak,e,.68,0,r)}X(is(.52,.05,.46,.01),n.oak,0,.44,0,r);for(let e=0;e<5;e++)X(Y(.04,.6,.02),n.oak,-.18+e*.09,.8,.27,r).rotation.x=-.12;X(is(.44,.06,.4,.03),n.wool,0,.49,0,r);let a=0,o=0,s={yaw:Math.PI,exit:Ds(-4.6,K,4.2),getEye:()=>{let e=Ds(-4.6,K+1.12,5.05);return e.z+=Math.sin(o)*.06,e.y+=Math.cos(o)*.01,e},onExit:()=>a=0};i.register(t,{label:`Sit in the rocking chair`,use:()=>{a=1,e.player.sit(s)}}),y.push(e=>{(a||Math.abs(r.rotation.x)>.001)&&(o+=e*1.6,r.rotation.x=Math.sin(o)*.09*(a?1:.5),a||(r.rotation.x*=.97),a&&Math.abs(Math.sin(o))<.02&&Math.random()<.3&&d?.creak(t.position,.03,.3,120))}),g(-4.9,K,4.7,-4.3,K+.5,5.3,{walk:!1})}{let t=new x;t.position.set(-5.65,K-.02,4.4),f.add(t),X(new u(.28,.28,.04,20),n.oak,0,.6,0,t),X(new u(.03,.04,.6,8),n.oak,0,.3,0,t),X(new u(.18,.2,.03,16),n.oak,0,.015,0,t),g(-5.93,K,4.12,-5.37,K+.6,4.68,{walk:!0,tag:`wood`});let r=_s(n,e);r.position.set(-5.65,K+.6,4.4),f.add(r),i.item(r,`lantern`,{mass:1.1,sound:`metal`}),e.handLantern=r;let a=X(ps(),new R({color:14209216,roughness:.2,metalness:.6}),-5.5,K+.6,4.25,f);i.item(a,`tin cup`,{mass:.2,shape:`cylinder`,sound:`metal`})}{let t=new u(.07,.07,.4,7);for(let r=0;r<6;r++)for(let i=0;i<11;i++)p.add(t,e.fireLogMat||n.logs,J(.9+i*.145+r%2*.07,K+.07+r*.13,3.92,Math.PI/2,0,0));g(.82,K,3.68,2.55,K+.82,4.14,{walk:!1})}{let t=new x;t.position.set(.6,K+2.3,6),f.add(t),X(new u(.08,.08,.015,12),n.oak,0,0,0,t);let r=[];for(let e=0;e<5;e++){let i=e/5*Math.PI*2,a=new x;a.position.set(Math.cos(i)*.06,-.02,Math.sin(i)*.06),t.add(a),X(new u(.008,.008,.22+e*.04,8),n.steel,0,-.14-e*.02,0,a,{cast:!1}),r.push(a)}let a=0;y.push((n,i)=>{let o=e.weather.w.gust;r.forEach((e,t)=>{e.rotation.x=Math.sin(i*(2.1+t*.3)+t)*.15*o,e.rotation.z=Math.cos(i*(1.7+t*.4)+t*2)*.12*o}),a-=n,a<0&&(a=.4+Math.random()*(5-o*4),o>.2&&Math.random()<o&&d?.chime(t.position,o))}),i.register(t,{label:`Touch the wind chime`,use:()=>d?.chime(t.position,1)})}{let e=new Tt(.9,.55);e.rotateX(-Math.PI/2),X(e,new R({color:5917234,roughness:1,map:r.wool.map}),-2.1,K+.005,3.95,f,{cast:!1})}return p.flush(f).forEach(e=>i.occluder(e)),{root:f,indoor:e=>e.x>-5.95&&e.x<5.95&&e.z>-3.4&&e.z<3.4&&e.y<Ts+.5&&e.y>.6-.5,openness:()=>S.reduce((e,t)=>e+(t.h.open?t.w:0),0)/2,fire:A,lamps:oe,frontDoor:re,bedDoor:ie}}var ks=(e,t,n)=>new b(e,t,n),As=K+4.5,js=K+2.85;function Ms(e){let{scene:t,M:n,T:i,ix:a,col:o,phys:s,audio:c,terrain:l,updaters:d}=e,f=new x;t.add(f);let p=new Qo,h=z(4711),g=(e,t)=>l.heightAt(e,t),_=(e,t,n,r,i,a,c)=>{let l=o.addBox(e,t,n,r,i,a,c);return l.phys&&s.addStaticBox(l),l},v=(e,t,n,r,i,a,o,s=1,c=[0,0,0])=>p.add(Y(e,t,n,s),r,J(i,a,o,...c)),y=new R({map:i.grain.map,color:5914672,roughness:.6}),b=new R({map:i.grain.map,color:12094048,roughness:.55}),S=new R({color:12075050,roughness:.5}),C=new R({color:13156012,roughness:.95,emissive:16760944,emissiveIntensity:0,side:2,envMapIntensity:.25}),w=e.rockMat||n.stone;i.tatami.map.repeat.set(1,1);let T=new R({map:i.tatami.map,normalMap:i.tatami.normalMap,roughness:.85,envMapIntensity:.3}),E=new R({map:i.kawara.map,normalMap:i.kawara.normalMap,roughness:.6,metalness:.1}),D={lamps:[],openables:[],placeY:{}};v(12,.08,9,n.deck,0,K-.04,0,1.6),v(12.2,K,9.2,w,0,K/2-.08,0,1.5),_(-6.1,-2,-4.6,6.1,K,4.6,{tag:`wood`});for(let e=0;e<3;e++){let t=K-(e+1)*.19,n=4.75+e*.3;v(2.4,.06,.32,b,0,t-.03,n,1.2),_(-1.2,-2,n-.16,1.2,t,n+.16,{tag:`wood`})}for(let e=0;e<5;e++)for(let t=0;t<3;t++){let n=new Tt(1.76,1.92);n.rotateX(-Math.PI/2),(e+t)%2&&n.rotateY(Math.PI/2),p.add(n,T,J(-3.6+e*1.8,K+.012,-1.96+t*1.96))}let O=Y(.14,js-K,.14,1.2);for(let e of[-4.5,-3,-1.5,0,1.5,3,4.5])for(let t of[-3,3])p.add(O,y,J(e,(js+K)/2,t));for(let e of[-1.5,0,1.5])for(let t of[-4.5,4.5])p.add(O,y,J(t,(js+K)/2,e));for(let e of[-6,-3,0,3,6])for(let t of[-4.5,4.5])p.add(Y(.16,js-K,.16),y,J(e,(js+K)/2,t)),_(e-.08,K,t-.08,e+.08,js,t+.08,{walk:!1});v(9.2,.2,.2,y,0,js-.1,-3),v(9.2,.2,.2,y,0,js-.1,3),v(.2,.2,6.2,y,-4.5,js-.1,0),v(.2,.2,6.2,y,4.5,js-.1,0),v(12.3,.18,.2,y,0,js-.06,-4.5),v(12.3,.18,.2,y,0,js-.06,4.5),v(.2,.18,9.2,y,-6,js-.06,0),v(.2,.18,9.2,y,6,js-.06,0),v(9,.04,6,n.ceiling,0,K+2.62,0,1.4);for(let e=-4;e<=4;e+=.5)v(.04,.05,6,y,e,K+2.58,0);{let e=6.5,t=3.2,i=[[[-6.5,js,5],[e,js,5],[t,As,0],[-3.2,As,0]],[[e,js,-5],[-6.5,js,-5],[-3.2,As,0],[t,As,0]],[[-6.5,js,-5],[-6.5,js,5],[-3.2,As,0],[-3.2,As,0]],[[e,js,5],[e,js,-5],[t,As,0],[t,As,0]]],a=(e,t)=>{let n=[],a=[];for(let r of i){let i=e?[[0,2,1],[0,3,2]]:[[0,1,2],[0,2,3]];for(let e of i)for(let i of e){let e=r[i];n.push(e[0],e[1]+t,e[2]);let o=Math.hypot(e[2],(e[1]-js)*1.4)+Math.abs(e[0])*.02;a.push((e[0]+e[2]*.2)/1.6,o/1.6)}}let o=new Ye;return o.setAttribute(`position`,new r(n,3)),o.setAttribute(`uv`,new r(a,2)),o.computeVertexNormals(),o};p.add(a(!1,.12),E),p.add(a(!0,0),n.ceiling),v(6.7,.22,.3,E,0,As+.14,0,1);for(let e of[-1,1]){let t=new I(new V(.18,10,8),E);t.position.set(e*3.35,As+.2,0),t.scale.set(1,.8,.6),f.add(t)}for(let e of[-1,1])v(13.2,.14,.08,y,0,js+.05,e*5.02),v(.08,.14,10.1,y,e*6.52,js+.05,0);_(-6,js+.1,-4.6,6,js+.4,4.6,{walk:!1})}let k=(e,t)=>{let n=new x,r=new I(new Tt(e-.06,t-.06),C);r.position.set(e/2,t/2,0),n.add(r);let i=(e,t,r,i)=>{let a=new I(Y(r,i,.035),b);a.position.set(e,t,0),a.castShadow=!0,n.add(a)};i(e/2,.03,e,.06),i(e/2,t-.03,e,.06),i(.03,t/2,.06,t),i(e-.03,t/2,.06,t);for(let n=1;n<3;n++)i(e*n/3,t/2,.018,t);for(let n=1;n<7;n++)i(e/2,t*n/7,e,.018);return i(e/2,.3,e,.5),n},A=js-K-.22,j=(e,t,n,r,i=[])=>{for(let o=n;o<r-.01;o+=1.5){if(i.some(([e,t])=>o>=e-.01&&o<t-.01))continue;let n=k(1.5,A);n.position.set(e===`x`?o:t,K,e===`x`?t:o+1.5),e===`z`&&(n.rotation.y=Math.PI/2),f.add(n),e===`x`?_(o,K,t-.05,o+1.5,K+A,t+.05,{walk:!1}):_(t-.05,K,o,t+.05,K+A,o+1.5,{walk:!1}),n.traverse(e=>e.isMesh&&a.occluder(e))}};j(`x`,-3,-4.5,4.5,[[-1.5,1.5]]),j(`z`,-4.5,-3,3),v(.05,A-.6,6,b,-4.43,K+.3+(A-.6)/2+0,0,1.4),j(`z`,4.5,-3,3,[[0,1.5]]),j(`x`,3,-4.5,4.5,[[-1.5,1.5]]);let M=(e,t,n,r,i)=>{let s=k(1.5,A);f.add(s);let l=n===`x`?ks(e,K,t):ks(t,K,e+1.5);n===`z`&&(s.rotation.y=Math.PI/2);let u=new as(0,6),p=!1,m=o.addBox(0,0,0,0,0,0,{walk:!1}),h=()=>{let e=u.v*1.48*r;n===`x`?(s.position.set(l.x+e,K,l.z+.05*Math.sign(e||1)),m.min.set(l.x+e,K,t-.05),m.max.set(l.x+e+1.5,K+A,t+.05)):(s.position.set(l.x+.05,K,l.z+e),m.min.set(l.x-.05,K,l.z-1.5+e),m.max.set(l.x+.05,K+A,l.z+e))};h(),s.traverse(e=>e.isMesh&&a.occluder(e)),a.register(s,{label:()=>p?`Slide the door closed`:`Slide the door open`,use:()=>{p=!p,u.t=+!!p,c?.slide(s.getWorldPosition(ks()),p)}}),d.push(e=>{u.update(e)&&h()}),D.openables.push({h:{get open(){return p}},w:.6})};M(-1.5,3,`x`,-1),M(0,3,`x`,1),M(0,4.5,`z`,-1);{let t=new x;t.position.set(-1.5,K+2.25,.3),f.add(t);let r=C.clone();r.color.set(15259832),X(new u(.004,.004,.36,4),n.black,0,.18,0,t),X(new u(.22,.28,.32,18,1,!0),r,0,-.12,0,t,{cast:!1});let i=new le(16763024,0,9,1.5);i.position.set(0,-.2,0),t.add(i);let o=new fs(e,i,[[r,1.3]],{intensity:6,on:!0});D.lamps.push(o);let s=X(Y(.07,.11,.02),b,-4.42,K+1.2,2.2,f);s.rotation.y=Math.PI/2,a.register(s,{label:()=>o.on?`Switch off the ceiling lamp`:`Switch on the ceiling lamp`,use:()=>o.toggle(s.position)})}v(3,.12,.7,b,0,K+.06,-3.35,1.2),v(3,A,.06,n.ceiling,0,K+A/2,-3.72,1.4),v(.06,A,.72,y,-1.5,K+A/2,-3.36),v(.06,A,.72,y,1.5,K+A/2,-3.36),_(-1.5,K,-3.75,1.5,K+A,-3,{walk:!1}),X(new Tt(.62,1.55),new R({map:i.scroll,roughness:.9}),0,K+1.25,-3.68,f,{cast:!1}),X(new u(.012,.012,.7,6),y,0,K+2.04,-3.66,f).rotation.z=Math.PI/2;{let e=X(new Pe([0,.05,.075,.07,.04,.045].map((e,t)=>new W(e,t*.05)),16),new R({color:3820122,roughness:.25}),.75,K+.12,-3.35,f);for(let e=0;e<5;e++)X(new u(.004,.006,.6,4),y,.75+(h()-.5)*.1,K+.55,-3.35,f).rotation.set((h()-.5)*.6,0,(h()-.5)*.8);let t=new I(new Tt(.45,.4),new R({map:i.maple,alphaTest:.5,side:2}));t.position.set(.75,K+.82,-3.35),f.add(t),e.castShadow=!0}v(1.1,.05,1.1,y,0,K+.025,0,1),X(new Tt(.92,.92).rotateX(-Math.PI/2),new R({color:4867652,roughness:1}),0,K+.052,0,f,{cast:!1}),_(-.55,K,-.55,.55,K+.05,.55,{walk:!0});let ee=new us(e,f,ks(0,K+.05,0),{scale:.65,intensity:9,lightOffset:ks(0,.45,0),startOn:!0});d.push((e,t)=>ee.update(e,t)),X(new u(.02,.02,1.55,6),n.black,0,K+1.82,0,f),X(Y(.25,.04,.03),y,0,K+1.1,0,f);let te=new x;te.position.set(0,K+.56,0),f.add(te);let re=new R({color:1841689,roughness:.55,metalness:.5});X(new Pe([.02,.1,.135,.14,.12,.06,.035].map((e,t)=>new W(e,t*.035)),20),re,0,0,0,te),X(new u(.012,.022,.12,8),re,.13,.1,0,te).rotation.z=-.9,X(new m(.1,.008,6,16,Math.PI),re,0,.22,0,te);let ie=Ns(t,ks(.17,K+.72,0),24,.6),N=0,oe=X(new Fe(.9,.5,.9),new Re({visible:!1}),0,K+.25,0,f);a.register(oe,{label:()=>ee.on?`Let the hearth die down`:`Light the hearth`,use:()=>ee.toggle()});let se=[];a.register(te,{label:()=>N>0?`The kettle is singing…`:`Brew a pot of tea`,use:()=>{ee.on?N>0||(N=5,e.ui.toast(`The kettle begins to hum…`),c?.noiseHit(te.getWorldPosition(ks()),{buf:c.pink,type:`bandpass`,f:900,a:1.5,d:3,v:.12})):e.ui.toast(`The hearth is cold — light it first.`)}}),d.push(t=>{if(ie.u.uLevel.value+=((N>0?1:ee.on?.25:0)-ie.u.uLevel.value)*Math.min(1,t),N>0&&(N-=t,N<=0)){for(let e of se)e.hot=90;c?.noiseHit(ks(2.6,K+.4,-1.4),{type:`bandpass`,f:1400,q:.7,a:.1,d:1.6,v:.18}),e.ui.toast(`Tea is poured — the cups on the low table are warm.`)}});{let e=new x;e.position.set(2.6,K,-1.4),f.add(e),X(new u(.48,.48,.035,32),b,0,.31,0,e);for(let t=0;t<4;t++){let n=t*Math.PI/2+.78;X(Y(.05,.3,.05),y,Math.cos(n)*.32,.15,Math.sin(n)*.32,e)}_(2.12,K,-1.88,3.08,K+.33,-.92,{walk:!1});let n=new Ve({color:5925450,roughness:.25,clearcoat:.6}),r=new x;r.position.set(2.5,K+.33,-1.5),f.add(r),X(new Pe([0,.06,.075,.07,.04,.03].map((e,t)=>new W(e,t*.025)),18),n,0,0,0,r),X(new u(.008,.012,.09,6),n,.08,.05,0,r).rotation.z=-1,X(new u(.01,.01,.1,6),y,-.09,.06,0,r).rotation.z=Math.PI/2+.3,a.item(r,`teapot`,{mass:.6,sound:`ceramic`});for(let e=0;e<3;e++){let n=new x;n.position.set(2.75+(e-1)*.14,K+.33,-1.25-e%2*.1),f.add(n),X(new Pe([0,.03,.038,.042].map((e,t)=>new W(e,t*.022)),16),new Ve({color:[15261904,9067066,3820122][e],roughness:.3,clearcoat:.5,side:2}),0,0,0,n);let r=X(new bt(.034,14).rotateX(-Math.PI/2),new R({color:8022570,roughness:.1}),0,.05,0,n,{cast:!1}),i=a.item(n,`cup of tea`,{mass:.15,shape:`cylinder`,sound:`ceramic`});i.hot=0,r.visible=!1;let o=Ns(t,ks(),10,.18);d.push(e=>{i.hot=Math.max(0,i.hot-e),r.visible=i.hot>0||i.wasHot,i.hot>0&&(i.wasHot=!0),o.points.position.copy(n.position).add(ks(0,.06,0)),o.u.uLevel.value=Math.min(1,i.hot/30)}),se.push(i)}}let ce=new R({map:i.wool.map,color:6961754,roughness:1});for(let[t,n]of[[0,1.05],[0,-1.05],[1.05,0],[-1.05,0]]){let r=X(is(.6,.08,.6,.04,3),ce,t,K+.04,n,f),i=Math.atan2(t,n),o={eye:ks(t*1.05,K+.86,n*1.05),yaw:i,low:!0,exit:ks(t*1.7,K,n*1.7)};a.register(r,{label:`Sit by the hearth`,use:()=>e.player.sit(o)})}{let t=-3.4;X(is(1,.09,2.05,.04,3),n.linen,t,K+.045,0,f);let r=X(is(1.06,.07,1.5,.03,3),new R({map:i.quilt.map,color:8032456,roughness:.95}),t,K+.12,.25,f);X(is(.5,.1,.3,.04,3),n.linen,t,K+.14,-.8,f);let o={eye:ks(t,K+.42,-.75),yaw:Math.PI,lie:!0,exit:ks(-2.4,K,0),yawLimit:3};a.register(r,{label:`Lie down on the futon`,use:()=>{e.player.sit(o),e.ui.toast(`Resting… the light moves across the paper screens`)}})}let ue=(t,n,r)=>{let i=new x;i.position.set(t,K,n),f.add(i);for(let[e,t]of[[-.14,-.14],[.14,-.14],[-.14,.14],[.14,.14]])X(Y(.025,.7,.025),y,e,.35,t,i);let o=C.clone();for(let e=0;e<4;e++){let t=X(new Tt(.26,.42),o,0,.42,0,i,{cast:!1});t.rotation.y=e*Math.PI/2,t.translateZ(.135)}X(Y(.32,.03,.32),y,0,.66,0,i);let s=new le(16756832,0,7,1.7);s.position.set(0,.42,0),i.add(s);let c=new fs(e,s,[[o,1.6]],{intensity:3.5,on:r});D.lamps.push(c),a.register(i,{label:()=>c.on?`Turn the lantern down`:`Light the paper lantern`,use:()=>c.toggle()}),_(t-.16,K,n-.16,t+.16,K+.7,n+.16,{walk:!1})};ue(-3.9,-2.4,!0),ue(3.9,2.4,!1),d.push(e=>D.lamps.forEach(t=>t.update(e))),v(.5,.9,1.2,y,3.95,K+.45,-1,1.2),_(3.7,K,-1.6,4.2,K+.9,-.4,{walk:!1});for(let e=0;e<3;e++){let t=new x;t.position.set(3.6900000000000004,K+.16+e*.28,-1),f.add(t),X(Y(.03,.24,1.12),b,0,0,0,t),X(new m(.03,.005,5,12),n.iron,-.025,0,0,t).rotation.y=Math.PI/2;let r=X(Y(.42,.18,1.05),b,.21,-.01,0,t);if(r.castShadow=!1,e===1)for(let e=0;e<6;e++)X(new u(.003,.003,.2,4),new R({color:6961706}),.15,.09,-.3+e*.02,t).rotation.x=Math.PI/2;let i=new as(0,9),o=!1;a.register(t,{label:()=>o?`Close drawer`:`Open drawer`,use:()=>{o=!o,i.t=+!!o,c?.slide(t.getWorldPosition(ks()),o)}}),d.push(e=>{i.update(e),t.position.x=3.6900000000000004-i.v*.32})}{let t=new x;t.position.set(0,js-.15,4.4),f.add(t);let r=new x;t.add(r),X(new u(.006,.006,.3,4),n.black,0,-.15,0,r);let o=C.clone();o.color.set(14174762),X(new V(.18,18,12).scale(1,1.3,1),o,0,-.52,0,r,{cast:!1});let s=new le(16748624,0,8,1.6);s.position.set(0,-.52,0),r.add(s);let l=new fs(e,s,[[o,1.4]],{intensity:4});D.lamps.push(l),a.register(r,{label:()=>l.on?`Put out the porch lantern`:`Light the porch lantern`,use:()=>l.toggle()}),d.push((t,n)=>{let i=e.weather.w.gust;r.rotation.z=Math.sin(n*1.3)*.08*i,r.rotation.x=Math.sin(n*.9+1)*.06*i});let p=new x;p.position.set(5.6,js-.1,4.4),f.add(p);let m=new x;p.add(m),X(new V(.06,14,8,0,Math.PI*2,0,Math.PI/2),new Ve({color:14216952,transparent:!0,opacity:.5,roughness:.05,side:2}),0,-.08,0,m);let g=X(new Tt(.06,.22),new R({color:15786144,side:2}),0,-.26,0,m,{cast:!1}),v=0;d.push((t,n)=>{let r=e.weather.w.gust;m.rotation.z=Math.sin(n*2.3)*.2*r,g.rotation.y=Math.sin(n*1.7)*1.2*r,g.rotation.x=Math.sin(n*2.9)*.4*r,v-=t,v<0&&(v=1+h()*(6-r*5),r>.15&&h()<r&&c?.tone(p.position,{f:2900+h()*300,a:.002,d:1.6,v:.05,ref:3}))}),a.register(p,{label:`Ring the wind bell`,use:()=>{c?.tone(p.position,{f:3e3,a:.002,d:2,v:.08,ref:3}),c?.tone(p.position,{f:6100,a:.002,d:.8,v:.02,ref:3})}});let S=new x;S.position.set(-5.4,K,4),f.add(S),X(Y(.5,.35,.4),y,0,.175,0,S),X(Y(.36,.08,.26),new R({color:4864562,roughness:.6}),0,.39,0,S);let w=X(new u(.015,.03,.22,6),n.logs,0,.5,0,S);w.rotation.z=.4;for(let e=0;e<4;e++)X(new V(.07,8,6),new R({map:i.maple,color:16777215,roughness:.8}),-.05+(e-1.5)*.07,.6+e%2*.05,(e%2-.5)*.06,S).scale.set(1.3,.6,1);_(-5.65,K,3.8,-5.15,K+.4,4.2,{walk:!0});for(let e of[-.12,.12]){let t=X(is(.1,.03,.22,.01),b,.9+e,K-.18,4.95,f);t.rotation.y=.1*e}let T=new x;X(new u(.012,.012,1.2,6),b,0,.6,0,T),X(new ae(.12,.3,10),new R({color:10520656,roughness:1}),0,.05,0,T).rotation.x=Math.PI,T.position.set(5.6,K+.15,-4.2),T.rotation.z=.15,f.add(T),a.item(T,`bamboo broom`,{mass:.6,sound:`wood`})}{let e=3.2,t=6.6,n=g(e,t);X(new u(.4,.45,.42,14),w,e,n+.18,t,f),X(new bt(.33,16).rotateX(-Math.PI/2),new Ve({color:2767412,roughness:.05,transmission:0,metalness:.2}),e,n+.38,t,f,{cast:!1}),o.addCylinder(e,t,.45,n,n+.4);let r=new R({color:9085008,roughness:.45}),i=new x;i.position.set(3.85,n+.42,t),f.add(i);let s=X(new u(.035,.035,.8,10),r,0,0,0,i);s.rotation.z=Math.PI/2-.15;for(let e of[-.12,.12])X(Y(.04,.5,.04),r,3.85,n+.22,t+e,f);let l=0,p=0;(c?.water(ks(e,n+.4,t)))?.set(!0),d.push(e=>{l+=e/9,l>=1&&p===0&&(p=1,l=0,setTimeout(()=>c?.noiseHit(i.position,{buf:c.brown,type:`bandpass`,f:520,q:5,a:.001,d:.2,v:1,ref:6}),650)),p=Math.max(0,p-e*.9),i.rotation.z=-.15+l*.3-Math.sin(Math.min(1,p)*Math.PI)*.6});let m=new x;X(new u(.035,.03,.05,10,1,!0),r,0,0,0,m),X(new u(.006,.006,.42,5),r,.21,.02,0,m).rotation.z=Math.PI/2,m.position.set(e,n+.42,6.449999999999999),f.add(m),a.item(m,`bamboo ladle`,{mass:.15,sound:`wood`})}let de=[];{let e=new u(.25,.3,.15,6);e.translate(0,.075,0),de.push(e.toNonIndexed());let t=new u(.1,.12,.7,8);t.translate(0,.5,0),de.push(t.toNonIndexed());let n=new u(.24,.2,.1,6);n.translate(0,.9,0),de.push(n.toNonIndexed());let r=new ae(.38,.28,6);r.translate(0,1.33,0),de.push(r.toNonIndexed());let i=new V(.06,8,6);i.translate(0,1.5,0),de.push(i.toNonIndexed())}let fe=uo(de.map(e=>(e.deleteAttribute(`uv`),e))),pe=new R({color:3153936,emissive:16752704,emissiveIntensity:0}),me=[[2.4,9],[-2.2,9.4],[7,15],[10,19.5],[-10,1.5],[-20,6.5],[-28,10],[14.5,-8],[24,-17.5],[31,-23],[-12,-10],[-24,-23]],he=[],P=[];for(let[e,t]of me){let n=g(e,t)-.03;he.push(new yt().makeTranslation(e,n,t)),P.push(new yt().makeTranslation(e,n+1.08,t)),o.addCylinder(e,t,.3,n,n+1.5)}let ge=new ne(fe,w,he.length);he.forEach((e,t)=>ge.setMatrixAt(t,e)),ge.castShadow=!0,ge.receiveShadow=!0,t.add(ge);let _e=new ne(new Fe(.2,.2,.2),pe,P.length);P.forEach((e,t)=>_e.setMatrixAt(t,e)),t.add(_e),d.push(()=>{let t=e.sky.state.night;pe.emissiveIntensity=t>.4?2.2+Math.sin(performance.now()/300)*.1:0,C.emissiveIntensity=t*(D.lamps[0].on||ee.on?.55:.1)});{let e=.4,t=9.6,n=g(e,t);for(let r of[-1.3,1.3])p.add(new u(.11,.13,3,10),y,J(e+r,n+1.5,t)),o.addCylinder(e+r,t,.13,n,n+3);v(3.4,.16,.2,y,e,n+2.7,t),v(3,.12,.14,y,e,n+2.3,t),v(3.9,.08,1,E,e,n+3.05,t,1.2,[0,0,0])}{let t=Yi.x,n=Yi.zStart,r=Yi.zEnd,i=Wi+.6,o=e=>i+Math.sin(e*Math.PI)*.85,s=Math.ceil((r-n)/.45);for(let e=0;e<s;e++){let i=e/s,a=(e+1)/s,c=n+(r-n)*i,l=n+(r-n)*a,u=o(i),d=o(a),f=Math.hypot(l-c,d-u),m=Math.atan2(d-u,l-c);p.add(Y(Yi.width,.06,f+.02,1.4),b,J(t,(u+d)/2-.03,(c+l)/2,-m,0,0)),_(t-Yi.width/2,-6,c,t+Yi.width/2,Math.max(u,d)-0,l,{tag:`wood`});for(let n of[-1,1])p.add(Y(.06,.06,f+.02),S,J(t+n*(Yi.width/2-.03),(u+d)/2+.9,(c+l)/2,-m,0,0)),e%3==0&&p.add(Y(.08,.95,.08),S,J(t+n*(Yi.width/2-.03),u+.45,c)),_(t+n*(Yi.width/2)-.05,u,c,t+n*(Yi.width/2)+.05,u+1,l,{walk:!1})}for(let e of[n+4,r-4])for(let n of[-1,1])p.add(new u(.1,.12,2.6,8),S,J(t+n*(Yi.width/2+.05),i-1.1,e));let c=(n+r)/2;D.placeY.bridge=o(.36)+.1;let l=X(new Fe(Yi.width,1,3),new Re({visible:!1}),t,o(.5)+.6,c,f);a.register(l,{label:`Scatter food for the koi`,use:()=>{e.koiFeed?.(ks(t+1.3,Wi,c+(h()-.5)*3)),e.ui.toast(`The koi come gliding up from the deep.`)}})}{let n=Ji.x,r=Ji.z,s=g(n,r),l=3.2,m=2.6,_=s+.28;for(let e=0;e<18;e++){let t=e/18*Math.PI*2,i=.45+h()*.35,a=ys(e+40,1);a.scale(i*1.3,i*1.4,i);let c=X(a,w,n+Math.cos(t)*l,s+.12,r+Math.sin(t)*m,f);c.rotation.y=t,o.addCylinder(n+Math.cos(t)*l,r+Math.sin(t)*m,.38,s-1,s+.45)}let v=new bt(1,40);v.rotateX(-Math.PI/2),v.scale(l*.98,1,m*.98);let y=i.water.clone();y.needsUpdate=!0,y.repeat.set(2,2),X(v,new Ve({color:9091248,roughness:.08,normalMap:y,normalScale:new W(.2,.2),transparent:!0,opacity:.82,envMapIntensity:1.2}),n,_,r,f,{cast:!1}),X(new bt(1,30).rotateX(-Math.PI/2).scale(l,1,m),new R({color:3815988,roughness:1}),n,s+.01,r,f,{cast:!1}),d.push(e=>{y.offset.x+=e*.01,y.offset.y+=e*.006});let S=Ns(t,ks(n,_,r),70,2.6);d.push(()=>{S.u.uLevel.value=.55+e.sky.state.night*.35+e.weather.w.rain*.2});let C=new R({color:9085008,roughness:.45}),T=X(new u(.05,.05,1.2,10),C,n+l+.2,s+.85,r-.4,f);T.rotation.z=Math.PI/2-.25,X(new u(.03,.04,.6,8),new Ve({color:13691120,transparent:!0,opacity:.45,roughness:.05}),n+l-.38,s+.6,r-.4,f,{cast:!1}),(c?.water(ks(n+l-.4,s+.4,r-.4)))?.set(!0);for(let e=0;e<26;e++){let t=Math.PI*1.15+e/26*Math.PI*.8,i=n+Math.cos(t)*4.800000000000001,a=r+Math.sin(t)*4.2;p.add(new u(.04,.045,2,7),C,J(i,g(i,a)+1,a))}let E=new x;X(new u(.17,.14,.24,16,1,!0),b,0,.12,0,E).material=new R({map:i.grain.map,color:14200960,side:2}),X(new u(.14,.14,.02,16),b,0,.01,0,E),E.position.set(n-l-.9,s,r+.5),f.add(E),a.item(E,`wooden bucket`,{mass:.8,sound:`wood`});let D=X(is(.5,.04,.3,.02),new R({map:i.linen.map,color:15262960}),n-l-.2,s+.62,r-1.4,f);a.item(D,`towel`,{mass:.3,sound:`soft`});let O={eye:ks(n+.6,_+.42,r-.4),yaw:Math.atan2(-(Yi.x-n),-(Yi.zStart-r)),low:!0,soak:!0,exit:ks(n-l-1.2,s,r),yawLimit:2.6},k=X(new u(l,l,.5,16).scale(1,1,m/l),new Re({visible:!1}),n,_,r,f);a.register(k,{label:`Soak in the hot spring`,use:()=>{e.player.sit(O),c?.splash(O.eye,.4),e.ui.toast(`Warm water, cool air. Breathe out.`)}})}{let t=qi.x,r=qi.z,i=-1e9;for(let e=0;e<6.28;e+=.5)for(let n of[0,1.5,2.5,3.5])i=Math.max(i,g(t+Math.cos(e)*n,r+Math.sin(e)*n));let o=i+.9;D.placeY.moondeck=o;for(let e=r-2.5;e<r+2.5;e+=.2)v(5,.05,.18,b,t,o-.025,e+.1,1.4);for(let[e,n]of[[-2.4,-2.4],[2.4,-2.4],[-2.4,2.4],[2.4,2.4],[0,-2.4],[0,2.4]]){let i=g(t+e,r+n);p.add(Y(.14,o-i+.3,.14),y,J(t+e,(o+i)/2-.15,r+n))}_(t-2.5,o-1.5,r-2.5,t+2.5,o,r+2.5,{tag:`wood`});for(let e=0;e<4;e++){let n=o-(e+1)*.24,i=r+2.65+e*.32;v(1.4,.05,.3,b,t,n,i,1.2),_(t-.7,n-2,i-.16,t+.7,n,i+.16,{tag:`wood`})}let s=(e,t,n,r)=>{let i=Math.hypot(n-e,r-t),a=Math.atan2(-(r-t),n-e);p.add(Y(i,.06,.08),S,J((e+n)/2,o+.9,(t+r)/2,0,a,0)),_(Math.min(e,n)-.05,o,Math.min(t,r)-.05,Math.max(e,n)+.05,o+.95,Math.max(t,r)+.05,{walk:!1})};s(t-2.5,r-2.5,t+2.5,r-2.5),s(t-2.5,r-2.5,t-2.5,r+2.5),s(t+2.5,r-2.5,t+2.5,r+2.5),s(t-2.5,r+2.5,t-.75,r+2.5),s(t+.75,r+2.5,t+2.5,r+2.5),v(1.6,.06,.42,b,t,o+.45,r-1.6,1.2);for(let e of[-.7,.7])v(.06,.45,.4,y,t+e,o+.22,r-1.6);_(t-.8,o,r-1.82,t+.8,o+.48,r-1.38,{walk:!1});let c={eye:ks(t,o+1.1,r-1.6),yaw:Math.PI*.95,exit:ks(t,o,r-.6),yawLimit:2.2},l=X(new Fe(1.6,.4,.5),new Re({visible:!1}),t,o+.5,r-1.6,f);a.register(l,{label:`Sit and watch the sky`,use:()=>e.player.sit(c)});let d=new x;d.position.set(t+1.6,o,r+1.2),f.add(d);for(let e=0;e<3;e++)X(new u(.012,.012,1.2,6),n.brass,Math.cos(e*2.1)*.15,.58,Math.sin(e*2.1)*.15,d).rotation.set(Math.sin(e*2.1)*.25,0,-Math.cos(e*2.1)*.25);let m=X(new u(.04,.055,.8,14),n.brass,0,1.25,0,d);m.rotation.x=Math.PI/2-.5,a.register(d,{label:`Look through the telescope`,use:()=>e.player.scope(Math.PI*.9)}),_(t+1.4,o,r+1,t+1.8,o+1.3,r+1.4,{walk:!1})}{let t=13.6,r=-9.5,i=g(12,-9.5)+4.3,o=g(t,r),s=new x;s.position.set(t,i,r),f.add(s);let l=i-o-.55,m=new R({color:11573872,roughness:1});for(let e of[-.28,.28])X(new u(.012,.012,l,5),m,e,-l/2,0,s);X(is(.7,.05,.25,.015),b,0,-l,0,s),p.add(new u(.08,.12,2,8),n.logs,J(13,i+.05,r,0,0,Math.PI/2-.15));let _=0,v=0,y=Math.PI*.3;s.rotation.y=y;let S={yaw:y,exit:ks(t-Math.sin(y)*-1.2,o,r-Math.cos(y)*-1.2),yawLimit:1.6,getEye:()=>{let e=Math.sin(v)*.55*_;return ks(0,-l*Math.cos(e)+.62,l*Math.sin(e)).applyAxisAngle(ks(0,1,0),y).add(s.position)},onExit:()=>_=0};a.register(s,{label:`Sit on the swing`,use:()=>{_=.05,e.player.sit(S)}}),d.push(t=>{e.player.seat===S?_=Math.min(1,_+t*.15):_*=.98,v+=t*Math.sqrt(9.8/l),s.rotation.x=-Math.sin(v)*.55*_,_>.2&&Math.abs(Math.cos(v))<.02&&h()<.2&&c?.creak(s.position,.03,.35,140)})}{let t=g(-24,-21),n=new u(.2,.22,1.7,12);n.rotateZ(Math.PI/2);let r=X(n,new R({map:i.bark.map,normalMap:i.bark.normalMap,roughness:1}),-24,t+.2,-21,f);r.rotation.y=.4,o.addCylinder(-24,-21,.5,t,t+.42);let s={eye:ks(-24,t+1.02,-21),yaw:.4+Math.PI/2,exit:ks(-23.1,t,-20.5)};a.register(r,{label:`Sit among the bamboo`,use:()=>e.player.sit(s)})}return p.flush(f).forEach(e=>a.occluder(e)),D.indoor=e=>e.x>-4.5&&e.x<4.5&&e.z>-3&&e.z<3&&e.y<As&&e.y>.6-.5,D.openness=()=>D.openables.reduce((e,t)=>e+(t.h.open?t.w:0),0)/1.5,D.roofs=[{x0:-6.5,x1:6.5,z0:-5,z1:5,y:(e,t)=>As-Math.max(Math.abs(t)/5,Math.max(0,Math.abs(e)-3.2)/3.3)*(As-js)+.15}],D.rainRects=[[-6.5,-5,6.5,5,As+.3],[0,0,0,0,-10]],D.eaves=[[-6.5,-5.05,6.5,-5.05,js-.05],[-6.5,5.05,6.5,5.05,js-.05],[-6.55,-5,-6.55,5,js-.05],[6.55,-5,6.55,5,js-.05]],D.fire=ee,D}function Ns(e,t,n,r){let i=new Float32Array(n*3),a=z(n*13);for(let e=0;e<n;e++)i[e*3]=a(),i[e*3+1]=a(),i[e*3+2]=a();let o=new Ye;o.setAttribute(`position`,new nt(i,3));let s={uTime:{value:0},uLevel:{value:0},uSpread:{value:r}},c=new d({uniforms:s,transparent:!0,depthWrite:!1,vertexShader:`uniform float uTime; uniform float uLevel; uniform float uSpread; varying float vA;
      void main(){ vec3 s = position; float life = fract(s.y + uTime * 0.12);
        vec3 p = vec3((s.x - 0.5) * uSpread + sin(uTime * 0.6 + s.z * 9.0) * 0.15 * life, life * (0.6 + uSpread * 0.5), (s.z - 0.5) * uSpread + cos(uTime * 0.5 + s.x * 7.0) * 0.15 * life);
        vA = smoothstep(0.0, 0.15, life) * (1.0 - life) * uLevel * 0.3; vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (60.0 + life * 260.0) * (0.4 + uSpread * 0.3) / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.92), smoothstep(0.5, 0.05, d) * vA); }`}),l=new f(o,c);l.position.copy(t),l.frustumCulled=!1,e.add(l);let u=performance.now();return l.onBeforeRender=()=>{s.uTime.value=(performance.now()-u)/1e3},{points:l,u:s}}var Ps=(e,t,n)=>new b(e,t,n);function Fs(e){let{scene:t,M:n,T:r,ix:i,col:a,phys:o,terrain:s,audio:l,updaters:d}=e,f=(e,t)=>s.heightAt(e,t),p=(e,t,n,r,i,s,c)=>{let l=a.addBox(e,t,n,r,i,s,c);return l.phys&&o.addStaticBox(l),l},m=new Qo,h=z(808),g={};{let a=Yi.zStart;for(let e=12;e<45;e+=.25)if(f(Yi.x,e)<-.4){a=e;break}let o=Wi+.6,s=a-1;for(;s>a-14&&f(Yi.x,s)<o-.12;)s-=.25;let c=a+13,_=Yi.width;for(let e=s;e<c;e+=.2)m.add(Y(_,.05,.18,1.6),n.deck,J(Yi.x+(h()-.5)*.02,o-.025,e+.1,0,(h()-.5)*.01,0));for(let e of[-_/2+.1,_/2-.1])m.add(Y(.12,.18,c-s,1.6),n.trim,J(Yi.x+e,o-.14,(s+c)/2));for(let e=s+.3;e<c;e+=2.2)for(let t of[-_/2,_/2]){let r=new u(.1,.11,3.2,10);m.add(r,n.logs,J(Yi.x+t,o-1.5,e))}p(Yi.x-_/2,-6,s,Yi.x+_/2,o,c,{tag:`wood`});let v=c-.8;m.add(Y(1.6,.05,.4,1.2),n.oak,J(Yi.x,o+.45,v)),m.add(Y(1.6,.35,.04,1.2),n.oak,J(Yi.x,o+.72,v+.2,-.15,0,0));for(let e of[-.7,.7])m.add(Y(.06,.45,.36),n.oak,J(Yi.x+e,o+.22,v));p(Yi.x-.8,o,v-.2,Yi.x+.8,o+.47,v+.22,{walk:!1});let y={eye:Ps(Yi.x,o+1.12,v-.05),yaw:Math.PI,exit:Ps(Yi.x,o,v-.9)},b=X(new Fe(1.6,.4,.5),new Re({visible:!1}),Yi.x,o+.5,v,t);i.register(b,{label:`Sit on the bench`,use:()=>e.player.sit(y)});let S={eye:Ps(Yi.x+.4,o+.75,c-.15),yaw:Math.PI,exit:Ps(Yi.x+.4,o,c-1.6),yawLimit:1.6},C=X(new Fe(1,.1,.3),new Re({visible:!1}),Yi.x+.4,o+.02,c-.2,t);i.register(C,{label:`Sit on the edge of the dock`,use:()=>e.player.sit(S)});let w=new x;w.position.set(Yi.x+2,Wi,(s+c)/2+2),t.add(w);let T=[];for(let e=0;e<=10;e++){let t=e/10;T.push(new W(Math.sin(t*Math.PI/2)*.62+.02,-.38+t*.55))}let E=new Pe(T,24);E.scale(1,1,2.7),X(E,new R({map:r.boards.map,normalMap:r.boards.normalMap,color:5929610,roughness:.7,side:2}),0,.15,0,w);for(let e of[-.5,.45])X(Y(1.1,.04,.24),n.oak,0,.1,e,w);for(let e of[-1,1]){let t=X(new u(.02,.02,2,6),n.oak,e*.45,.25,.1,w);t.rotation.x=Math.PI/2,t.rotation.z=e*.15}let D=X(new u(.01,.01,1.6,4),new R({color:10127978}),Yi.x+1.3,o-.1,(s+c)/2+2-1.4,t);D.rotation.z=1.2,d.push((t,n)=>{let r=e.weather.w.gust;w.position.y=Wi+Math.sin(n*1.3)*.02*(1+r*2),w.rotation.z=Math.sin(n*.9)*.025*(1+r*2),w.rotation.x=Math.sin(n*1.1+1)*.015*(1+r)});let O={yaw:Math.PI,exit:Ps(Yi.x+.6,o,(s+c)/2+2),getEye:()=>{let e=w.position.clone();return e.y+=.95,e.z+=.2,e}};i.register(w,{label:`Sit in the rowboat`,use:()=>{e.player.sit(O),l?.splash(w.position,.3)}}),g.dock={top:o,z0:s,z1:c}}{let r=qi.x,o=qi.z,s=f(r,o),h=s+4.3,_=r-2.7,v=r+2.7,y=o-1.9,b=o+4.4;a.addCylinder(r,o,.75,s-1,s+26);for(let e=y;e<b;e+=.2)m.add(Y(v-_,.06,.18,1.6),n.deck,J(r,h-.03,e+.1));m.add(Y(v-_,.22,.14),n.trim,J(r,h-.17,y)),m.add(Y(v-_,.22,.14),n.trim,J(r,h-.17,b)),m.add(Y(.14,.22,b-y),n.trim,J(_,h-.17,(y+b)/2)),m.add(Y(.14,.22,b-y),n.trim,J(v,h-.17,(y+b)/2));for(let[e,t]of[[_,y],[v,y],[_,b],[v,b]]){let r=f(e,t),i=h-r+.2;m.add(new u(.12,.14,i,10),n.logs,J(e,r+i/2-.2,t)),a.addCylinder(e,t,.14,r-1,h-.05)}for(let[e,t]of[[_+.4,y+.3],[v-.4,y+.3],[_+.4,b-.3],[v-.4,b-.3]]){let i=e-r,a=t-o,s=new u(.06,.07,Math.hypot(i,a,2.2),8),c=new yt().lookAt(Ps(0,0,0),Ps(i,2.2,a),Ps(0,1,0)).multiply(new yt().makeRotationX(Math.PI/2));c.setPosition(r+i/2,h-.2-1.1,o+a/2),m.add(s,n.logs,c)}p(_,h-.3,y,v,h,b,{tag:`wood`});let S=.95,C=(e,t,r,i)=>{let a=Math.hypot(r-e,i-t),o=Math.atan2(-(i-t),r-e);m.add(Y(a,.07,.09),n.trim,J((e+r)/2,h+S,(t+i)/2,0,o,0));let s=Math.max(2,Math.floor(a/.5));for(let a=0;a<=s;a++){let o=a/s;m.add(Y(.06,S,.06),n.trim,J(e+(r-e)*o,h+S/2,t+(i-t)*o))}p(Math.min(e,r)-.05,h,Math.min(t,i)-.05,Math.max(e,r)+.05,h+S+.05,Math.max(t,i)+.05,{walk:!1})};C(_,y,v,y),C(v,y,v,o+1.2),C(_,y,_,o+.2),C(_,o+1.3,_,o+1.4);let w=_-.08,T=o+.35,E=o+1.15,D=f(w-.3,(T+E)/2);for(let e of[T,E])m.add(Y(.07,h-D+.9,.07),n.logs,J(w,(h+D+.9)/2,e));for(let e=D+.3;e<h+.5;e+=.32)m.add(new u(.025,.025,E-T,6),n.oak,J(w,e,(T+E)/2,Math.PI/2,0,0));a.addLadder(Ps(w-.6,D-.5,T),Ps(w+.35,h+.05,E),Ps(1,0,0));let O=r-1.7,k=r+1.7,A=o+1.3,j=b-.05,M=2.25,ee=(e,t,r,i,a)=>{let o=[r,...a.flatMap(e=>[e.a,e.b]),i].sort((e,t)=>e-t);for(let r=0;r<o.length-1;r++){let i=o[r],s=o[r+1],c=(i+s)/2,l=a.find(e=>c>e.a&&c<e.b),u=(r,a)=>{if(a-r<.01)return;let o=e===`x`?Y(s-i,a-r,.07,1.4):Y(.07,a-r,s-i,1.4);m.add(o,n.boards,e===`x`?J(c,h+(r+a)/2,t):J(t,h+(r+a)/2,c)),e===`x`?p(i,h+r,t-.05,s,h+a,t+.05,{walk:!1}):p(t-.05,h+r,i,t+.05,h+a,s,{walk:!1})};l?(u(0,l.lo),u(l.hi,M)):u(0,M)}};ee(`x`,j,O,k,[{a:r-.5,b:r+.5,lo:.8,hi:1.6}]),ee(`x`,A,O,k,[{a:r+.3,b:r+1.1,lo:0,hi:1.9}]),ee(`z`,O,A,j,[{a:A+.9,b:A+1.8,lo:.9,hi:1.5}]),ee(`z`,k,A,j,[{a:A+1,b:A+1.9,lo:.85,hi:1.55}]);let te=k-O+.6,re=(j-A)/2+.4,ie=Math.hypot(re,1),N=Math.atan(1/re);for(let e of[-1,1]){let t=J(r,h+M+1/2,(A+j)/2+e*re/2,e*N,0,0),i=new Tt(te,ie);i.rotateX(-Math.PI/2),qo(i,2),i.translate(0,.05,0);let a=new Tt(te,ie);a.rotateX(Math.PI/2),qo(a,1.4),a.translate(0,-.05,0),m.add(i,n.shingles,t),m.add(a,n.ceiling,t),m.add(new Fe(te,.1,ie-.02),n.trim,t)}for(let e of[O,k]){let t=new c([new W(-(j-A)/2,0),new W((j-A)/2,0),new W(0,1)]),r=new At(t,{depth:.07,bevelEnabled:!1});r.rotateY(Math.PI/2),qo(r,1.4),m.add(r,n.boards,J(e-.035,h+M,(A+j)/2))}p(O,h+M+.02,A,k,h+M+.3,j,{walk:!1});let ae=X(is(.9,.18,.9,.08,4),n.wool,r-.9,h+.09,j-.6,t),oe={eye:Ps(r-.9,h+.85,j-.6),yaw:Math.PI*.85,exit:Ps(r-.2,h,A+.8)};i.register(ae,{label:`Sit on the cushion`,use:()=>e.player.sit(oe)}),X(is(1,.05,.7,.02),n.quilt,r+.8,h+.03,j-.5,t,{cast:!1});let se={eye:Ps(r+.8,h+.32,j-.55),yaw:-Math.PI/2,lie:!0,exit:Ps(r+.4,h,A+.8),yawLimit:3};i.register(t.children[t.children.length-1],{label:`Lie down`,use:()=>{e.player.sit(se),e.ui.toast(`Resting… time drifts by`)}}),m.add(Y(1,.03,.25,1),n.oak,J(k-.6,h+1.4,j-.2));let ce=ms(new R({color:4860490,roughness:.7}),.13,.19,.03);ce.position.set(k-.6,h+1.43,j-.2),ce.rotation.set(-Math.PI/2,0,.4),t.add(ce),i.item(ce,`book`,{mass:.4,sound:`soft`});let le=new x;le.position.set(v-.5,h,y+.5),t.add(le);for(let e=0;e<3;e++)X(new u(.012,.012,1.2,6),n.brass,Math.cos(e*2.1)*.15,.58,Math.sin(e*2.1)*.15,le).rotation.set(Math.sin(e*2.1)*.25,0,-Math.cos(e*2.1)*.25);let ue=Math.atan2(-(q.x-le.position.x),-(q.z-le.position.z)),de=new x;de.position.y=1.2,de.rotation.y=ue,le.add(de);let fe=X(new u(.035,.05,.75,14),n.brass,0,0,-.1,de);fe.rotation.x=Math.PI/2+.1,i.register(le,{label:`Look through the telescope`,use:()=>{e.player.scope(ue)}}),p(v-.7,h,y+.3,v-.3,h+1.3,y+.7,{walk:!1});let pe=[],me=new R({color:16769184,emissive:16756816,emissiveIntensity:0}),he=[[_,y],[v,y],[v,o+1.2]];for(let e=0;e<he.length-1;e++){let[t,n]=he[e],[r,i]=he[e+1];for(let e=0;e<14;e++){let a=e/14;pe.push(Ps(t+(r-t)*a,h+S+.12-Math.sin(a*Math.PI)*.08*0-Math.abs(Math.sin(a*14*Math.PI/2))*.06,n+(i-n)*a))}}let P=new ne(new V(.025,6,4),me,pe.length);pe.forEach((e,t)=>P.setMatrixAt(t,new yt().setPosition(e))),t.add(P);let ge=!1,_e=X(Y(.12,.12,.05),n.iron,k+.08,h+1.2,A+.5,t);i.register(_e,{label:()=>ge?`Switch off the string lights`:`Switch on the string lights`,use:()=>{ge=!ge,l?.lightSwitch(_e.position)}}),d.push((e,t)=>{me.emissiveIntensity+=((ge?2.2+Math.sin(t*3)*.15:0)-me.emissiveIntensity)*Math.min(1,e*6)}),g.treehouse={P:h}}{let o=Ji.x,s=Ji.z,l=f(o,s);for(let t=0;t<12;t++){let r=t/12*Math.PI*2;m.add(ys(t,.16),e.rockMat||n.stone,J(o+Math.cos(r)*.6,l+.04,s+Math.sin(r)*.6,0,r,0))}p(o-.7,l-1,s-.7,o+.7,l+.12,s+.7,{walk:!1,phys:!0});let h=new us(e,t,Ps(o,l+.02,s),{scale:1.3,intensity:18,lightOffset:Ps(0,.6,0),startOn:!1});d.push((e,t)=>h.update(e,t));let _=X(new u(.6,.6,.6,10),new Re({visible:!1}),o,l+.3,s,t);i.register(_,{label:()=>h.on?`Put out the campfire`:`Light the campfire`,use:()=>h.toggle()}),g.campfire=h;let v=new R({map:r.bark.map,normalMap:r.bark.normalMap,roughness:1});for(let n of[.3,2.4,4.2]){let r=o+Math.cos(n)*2.2,c=s+Math.sin(n)*2.2,l=f(r,c),d=new u(.22,.24,1.8,12);d.rotateZ(Math.PI/2);let p=X(d,v,r,l+.2,c,t);p.rotation.y=-n+Math.PI/2;let m=Math.atan2(-(o-r),-(s-c)),h={eye:Ps(r,l+1.02,c),yaw:m,exit:Ps(r+(o-r)*.35,l,c+(s-c)*.35)};i.register(p,{label:`Sit on the log`,use:()=>e.player.sit(h)}),a.addCylinder(r,c,.5,l,l+.42)}let y=o+3.5,b=s-3.2,S=f(y,b),C=new x;C.position.set(y,S,b),C.rotation.y=.5,t.add(C);let w=new R({map:r.linen.map,color:9075290,roughness:1,side:2});for(let e of[-1,1]){let t=X(new Tt(2.4,1.55),w,e*.62,.7,0,C);t.rotation.y=Math.PI/2,t.rotation.x=0,t.rotation.z=0,t.rotation.order=`YXZ`,t.rotation.set(0,Math.PI/2,0),t.rotateX(e*-.9)}let T=new c([new W(-.95,0),new W(.95,0),new W(0,1.28)]);X(new j(T),w,0,0,-1.2,C),X(new u(.02,.02,2.5,6),n.oak,0,1.28,0,C).rotation.x=Math.PI/2,X(is(.7,.08,1.9,.04),new R({color:2771562,roughness:.8}),0,.05,-.1,C);let E={eye:C.localToWorld(Ps(0,.38,-.7)),yaw:C.rotation.y,lie:!0,exit:C.localToWorld(Ps(0,0,1.8)),yawLimit:3};i.register(C,{label:`Crawl into the tent and rest`,use:()=>{e.player.sit(E),e.ui.toast(`Resting… time drifts by`)}}),a.addCylinder(y,b,1,S,S+1.3);let D=o-2.8,O=s-1.5,k=f(D,O);X(new u(.3,.36,.5,14),v,D,k+.25,O,t),X(new bt(.3,14).rotateX(-Math.PI/2),new R({map:r.logs.map,color:14203024}),D,k+.501,O,t),a.addCylinder(D,O,.36,k,k+.5);let A=new x;A.position.set(D+.05,k+.62,O),A.rotation.z=-.5,t.add(A),X(new u(.018,.022,.75,8),n.oak,0,.3,0,A),X(Y(.18,.1,.02),n.steel,.06,-.05,0,A);let M=X(ps(),new R({color:13158592,roughness:.25,metalness:.8}),o+1.6,f(o+1.6,s+1.2)+.02,s+1.2,t);i.item(M,`enamel cup`,{mass:.2,shape:`cylinder`,sound:`metal`})}let _=new R({color:6965802,roughness:.9}),v=new R({map:r.rock.map,roughness:.6,color:10130570}),y=0,b=0,S=[];for(let e=0;e<400&&(y<14||b<12);e++){let n=h()*Math.PI*2,r=9+h()*40,a=Math.cos(n)*r,o=Math.sin(n)*r*1.2+12,s=La(a,o),c=Ra(a,o),l=f(a,o);if(!(l<-.4)){if(y<14&&s<3.5&&s>.6){let n=X(vs(e),_,a,l+.05,o,t);i.item(n,`pine cone`,{mass:.05,shape:`box`,sound:`soft`}),y++}else if(b<12&&c>1&&c<1.15){let n=X(ys(e,.06+h()*.04),v,a,l+.05,o,t),r=i.item(n,`smooth stone`,{mass:.6,shape:`sphere`,sound:`stone`});r.skimmer=!0,b++}S.push([a,o])}}return m.flush(t).forEach(e=>i.occluder(e)),g}var Is=class{constructor(){this.boxes=[],this.cyl=new Map,this.cell=8,this.ladders=[]}addBox(e,t,n,r,i,a,o={}){let s={min:new b(e,t,n),max:new b(r,i,a),enabled:!0,phys:o.phys!==!1,tag:o.tag||``,walk:o.walk!==!1};return this.boxes.push(s),s}addFromObject(e,t){e.updateWorldMatrix(!0,!0);let n=new Ae().setFromObject(e);return this.addBox(n.min.x,n.min.y,n.min.z,n.max.x,n.max.y,n.max.z,t)}addCylinder(e,t,n,r,i){let a={x:e,z:t,r:n,y0:r,y1:i},o=Math.floor(e/this.cell)+`,`+Math.floor(t/this.cell);return this.cyl.has(o)||this.cyl.set(o,[]),this.cyl.get(o).push(a),a}nearbyCylinders(e,t){let n=[],r=Math.floor(e/this.cell),i=Math.floor(t/this.cell);for(let e=-1;e<=1;e++)for(let t=-1;t<=1;t++){let a=this.cyl.get(r+e+`,`+(i+t));a&&n.push(...a)}return n}supportHeight(e,t,n,r){let i=-1/0;for(let a of this.boxes)a.enabled&&a.walk&&(a.max.y>r||a.max.y<=i||e+n*.5<a.min.x||e-n*.5>a.max.x||t+n*.5<a.min.z||t-n*.5>a.max.z||(i=a.max.y));return i}resolve(e,t,n,r,i){let a=!1;for(let n=0;n<3;n++){for(let n of this.boxes){if(!n.enabled||n.max.y<=i||n.min.y>=r)continue;let o=Math.max(n.min.x,Math.min(e.x,n.max.x)),s=Math.max(n.min.z,Math.min(e.z,n.max.z)),c=e.x-o,l=e.z-s,u=c*c+l*l;if(!(u>=t*t)){if(a=!0,u>1e-10){let n=Math.sqrt(u),r=t-n;e.x+=c/n*r,e.z+=l/n*r}else{let r=e.x-n.min.x+t,i=n.max.x-e.x+t,a=e.z-n.min.z+t,o=n.max.z-e.z+t,s=Math.min(r,i,a,o);s===r?e.x=n.min.x-t:s===i?e.x=n.max.x+t:e.z=s===a?n.min.z-t:n.max.z+t}}}for(let n of this.nearbyCylinders(e.x,e.z)){if(n.y1<=i||n.y0>=r)continue;let o=e.x-n.x,s=e.z-n.z,c=Math.hypot(o,s),l=t+n.r;c<l&&c>1e-6&&(e.x=n.x+o/c*l,e.z=n.z+s/c*l,a=!0)}}return a}ceilingHeight(e,t,n,r){let i=1/0;for(let a of this.boxes)!a.enabled||a.min.y<=r+.3||a.min.y>=i||e+n<a.min.x||e-n>a.max.x||t+n<a.min.z||t-n>a.max.z||(i=a.min.y);return i}addLadder(e,t,n){this.ladders.push({min:e,max:t,dir:n})}ladderAt(e){return this.ladders.find(t=>e.x>t.min.x&&e.x<t.max.x&&e.z>t.min.z&&e.z<t.max.z&&e.y>t.min.y-.2&&e.y<t.max.y)||null}},Ls=class e{constructor(e){e===void 0&&(e=[0,0,0,0,0,0,0,0,0]),this.elements=e}identity(){let e=this.elements;e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1}setZero(){let e=this.elements;e[0]=0,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=0,e[6]=0,e[7]=0,e[8]=0}setTrace(e){let t=this.elements;t[0]=e.x,t[4]=e.y,t[8]=e.z}getTrace(e){e===void 0&&(e=new Z);let t=this.elements;return e.x=t[0],e.y=t[4],e.z=t[8],e}vmult(e,t){t===void 0&&(t=new Z);let n=this.elements,r=e.x,i=e.y,a=e.z;return t.x=n[0]*r+n[1]*i+n[2]*a,t.y=n[3]*r+n[4]*i+n[5]*a,t.z=n[6]*r+n[7]*i+n[8]*a,t}smult(e){for(let t=0;t<this.elements.length;t++)this.elements[t]*=e}mmult(t,n){n===void 0&&(n=new e);let r=this.elements,i=t.elements,a=n.elements,o=r[0],s=r[1],c=r[2],l=r[3],u=r[4],d=r[5],f=r[6],p=r[7],m=r[8],h=i[0],g=i[1],_=i[2],v=i[3],y=i[4],b=i[5],x=i[6],S=i[7],C=i[8];return a[0]=o*h+s*v+c*x,a[1]=o*g+s*y+c*S,a[2]=o*_+s*b+c*C,a[3]=l*h+u*v+d*x,a[4]=l*g+u*y+d*S,a[5]=l*_+u*b+d*C,a[6]=f*h+p*v+m*x,a[7]=f*g+p*y+m*S,a[8]=f*_+p*b+m*C,n}scale(t,n){n===void 0&&(n=new e);let r=this.elements,i=n.elements;for(let e=0;e!==3;e++)i[3*e+0]=t.x*r[3*e+0],i[3*e+1]=t.y*r[3*e+1],i[3*e+2]=t.z*r[3*e+2];return n}solve(e,t){t===void 0&&(t=new Z);let n=[],r,i;for(r=0;r<12;r++)n.push(0);for(r=0;r<3;r++)for(i=0;i<3;i++)n[r+4*i]=this.elements[r+3*i];n[3]=e.x,n[7]=e.y,n[11]=e.z;let a=3,o=a,s,c;do{if(r=o-a,n[r+4*r]===0){for(i=r+1;i<o;i++)if(n[r+4*i]!==0){s=4;do c=4-s,n[c+4*r]+=n[c+4*i];while(--s);break}}if(n[r+4*r]!==0)for(i=r+1;i<o;i++){let e=n[r+4*i]/n[r+4*r];s=4;do c=4-s,n[c+4*i]=c<=r?0:n[c+4*i]-n[c+4*r]*e;while(--s)}}while(--a);if(t.z=n[11]/n[10],t.y=(n[7]-n[6]*t.z)/n[5],t.x=(n[3]-n[2]*t.z-n[1]*t.y)/n[0],isNaN(t.x)||isNaN(t.y)||isNaN(t.z)||t.x===1/0||t.y===1/0||t.z===1/0)throw`Could not solve equation! Got x=[${t.toString()}], b=[${e.toString()}], A=[${this.toString()}]`;return t}e(e,t,n){if(n===void 0)return this.elements[t+3*e];this.elements[t+3*e]=n}copy(e){for(let t=0;t<e.elements.length;t++)this.elements[t]=e.elements[t];return this}toString(){let e=``;for(let t=0;t<9;t++)e+=this.elements[t]+`,`;return e}reverse(t){t===void 0&&(t=new e);let n=Rs,r,i;for(r=0;r<3;r++)for(i=0;i<3;i++)n[r+6*i]=this.elements[r+3*i];n[3]=1,n[9]=0,n[15]=0,n[4]=0,n[10]=1,n[16]=0,n[5]=0,n[11]=0,n[17]=1;let a=3,o=a,s,c;do{if(r=o-a,n[r+6*r]===0){for(i=r+1;i<o;i++)if(n[r+6*i]!==0){s=6;do c=6-s,n[c+6*r]+=n[c+6*i];while(--s);break}}if(n[r+6*r]!==0)for(i=r+1;i<o;i++){let e=n[r+6*i]/n[r+6*r];s=6;do c=6-s,n[c+6*i]=c<=r?0:n[c+6*i]-n[c+6*r]*e;while(--s)}}while(--a);r=2;do{i=r-1;do{let e=n[r+6*i]/n[r+6*r];s=6;do c=6-s,n[c+6*i]=n[c+6*i]-n[c+6*r]*e;while(--s)}while(i--)}while(--r);r=2;do{let e=1/n[r+6*r];s=6;do c=6-s,n[c+6*r]=n[c+6*r]*e;while(--s)}while(r--);r=2;do{i=2;do{if(c=n[3+i+6*r],isNaN(c)||c===1/0)throw`Could not reverse! A=[${this.toString()}]`;t.e(r,i,c)}while(i--)}while(r--);return t}setRotationFromQuaternion(e){let t=e.x,n=e.y,r=e.z,i=e.w,a=t+t,o=n+n,s=r+r,c=t*a,l=t*o,u=t*s,d=n*o,f=n*s,p=r*s,m=i*a,h=i*o,g=i*s,_=this.elements;return _[0]=1-(d+p),_[1]=l-g,_[2]=u+h,_[3]=l+g,_[4]=1-(c+p),_[5]=f-m,_[6]=u-h,_[7]=f+m,_[8]=1-(c+d),this}transpose(t){t===void 0&&(t=new e);let n=this.elements,r=t.elements,i;return r[0]=n[0],r[4]=n[4],r[8]=n[8],i=n[1],r[1]=n[3],r[3]=i,i=n[2],r[2]=n[6],r[6]=i,i=n[5],r[5]=n[7],r[7]=i,t}},Rs=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],Z=class e{constructor(e,t,n){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),this.x=e,this.y=t,this.z=n}cross(t,n){n===void 0&&(n=new e);let r=t.x,i=t.y,a=t.z,o=this.x,s=this.y,c=this.z;return n.x=s*a-c*i,n.y=c*r-o*a,n.z=o*i-s*r,n}set(e,t,n){return this.x=e,this.y=t,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(t,n){if(n)n.x=t.x+this.x,n.y=t.y+this.y,n.z=t.z+this.z;else return new e(this.x+t.x,this.y+t.y,this.z+t.z)}vsub(t,n){if(n)n.x=this.x-t.x,n.y=this.y-t.y,n.z=this.z-t.z;else return new e(this.x-t.x,this.y-t.y,this.z-t.z)}crossmat(){return new Ls([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){let e=this.x,t=this.y,n=this.z,r=Math.sqrt(e*e+t*t+n*n);if(r>0){let e=1/r;this.x*=e,this.y*=e,this.z*=e}else this.x=0,this.y=0,this.z=0;return r}unit(t){t===void 0&&(t=new e);let n=this.x,r=this.y,i=this.z,a=Math.sqrt(n*n+r*r+i*i);return a>0?(a=1/a,t.x=n*a,t.y=r*a,t.z=i*a):(t.x=1,t.y=0,t.z=0),t}length(){let e=this.x,t=this.y,n=this.z;return Math.sqrt(e*e+t*t+n*n)}lengthSquared(){return this.dot(this)}distanceTo(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z;return Math.sqrt((i-t)*(i-t)+(a-n)*(a-n)+(o-r)*(o-r))}distanceSquared(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z;return(i-t)*(i-t)+(a-n)*(a-n)+(o-r)*(o-r)}scale(t,n){n===void 0&&(n=new e);let r=this.x,i=this.y,a=this.z;return n.x=t*r,n.y=t*i,n.z=t*a,n}vmul(t,n){return n===void 0&&(n=new e),n.x=t.x*this.x,n.y=t.y*this.y,n.z=t.z*this.z,n}addScaledVector(t,n,r){return r===void 0&&(r=new e),r.x=this.x+t*n.x,r.y=this.y+t*n.y,r.z=this.z+t*n.z,r}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(t){return t===void 0&&(t=new e),t.x=-this.x,t.y=-this.y,t.z=-this.z,t}tangents(e,t){let n=this.length();if(n>0){let r=zs,i=1/n;r.set(this.x*i,this.y*i,this.z*i);let a=Bs;Math.abs(r.x)<.9?(a.set(1,0,0),r.cross(a,e)):(a.set(0,1,0),r.cross(a,e)),r.cross(e,t)}else e.set(1,0,0),t.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}lerp(e,t,n){let r=this.x,i=this.y,a=this.z;n.x=r+(e.x-r)*t,n.y=i+(e.y-i)*t,n.z=a+(e.z-a)*t}almostEquals(e,t){return t===void 0&&(t=1e-6),!(Math.abs(this.x-e.x)>t||Math.abs(this.y-e.y)>t||Math.abs(this.z-e.z)>t)}almostZero(e){return e===void 0&&(e=1e-6),!(Math.abs(this.x)>e||Math.abs(this.y)>e||Math.abs(this.z)>e)}isAntiparallelTo(e,t){return this.negate(Vs),Vs.almostEquals(e,t)}clone(){return new e(this.x,this.y,this.z)}};Z.ZERO=new Z(0,0,0),Z.UNIT_X=new Z(1,0,0),Z.UNIT_Y=new Z(0,1,0),Z.UNIT_Z=new Z(0,0,1);var zs=new Z,Bs=new Z,Vs=new Z,Hs=class e{constructor(e){e===void 0&&(e={}),this.lowerBound=new Z,this.upperBound=new Z,e.lowerBound&&this.lowerBound.copy(e.lowerBound),e.upperBound&&this.upperBound.copy(e.upperBound)}setFromPoints(e,t,n,r){let i=this.lowerBound,a=this.upperBound,o=n;i.copy(e[0]),o&&o.vmult(i,i),a.copy(i);for(let t=1;t<e.length;t++){let n=e[t];o&&(o.vmult(n,Us),n=Us),n.x>a.x&&(a.x=n.x),n.x<i.x&&(i.x=n.x),n.y>a.y&&(a.y=n.y),n.y<i.y&&(i.y=n.y),n.z>a.z&&(a.z=n.z),n.z<i.z&&(i.z=n.z)}return t&&(t.vadd(i,i),t.vadd(a,a)),r&&(i.x-=r,i.y-=r,i.z-=r,a.x+=r,a.y+=r,a.z+=r),this}copy(e){return this.lowerBound.copy(e.lowerBound),this.upperBound.copy(e.upperBound),this}clone(){return new e().copy(this)}extend(e){this.lowerBound.x=Math.min(this.lowerBound.x,e.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,e.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,e.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,e.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,e.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,e.upperBound.z)}overlaps(e){let t=this.lowerBound,n=this.upperBound,r=e.lowerBound,i=e.upperBound,a=r.x<=n.x&&n.x<=i.x||t.x<=i.x&&i.x<=n.x,o=r.y<=n.y&&n.y<=i.y||t.y<=i.y&&i.y<=n.y,s=r.z<=n.z&&n.z<=i.z||t.z<=i.z&&i.z<=n.z;return a&&o&&s}volume(){let e=this.lowerBound,t=this.upperBound;return(t.x-e.x)*(t.y-e.y)*(t.z-e.z)}contains(e){let t=this.lowerBound,n=this.upperBound,r=e.lowerBound,i=e.upperBound;return t.x<=r.x&&n.x>=i.x&&t.y<=r.y&&n.y>=i.y&&t.z<=r.z&&n.z>=i.z}getCorners(e,t,n,r,i,a,o,s){let c=this.lowerBound,l=this.upperBound;e.copy(c),t.set(l.x,c.y,c.z),n.set(l.x,l.y,c.z),r.set(c.x,l.y,l.z),i.set(l.x,c.y,l.z),a.set(c.x,l.y,c.z),o.set(c.x,c.y,l.z),s.copy(l)}toLocalFrame(e,t){let n=Ws,r=n[0],i=n[1],a=n[2],o=n[3],s=n[4],c=n[5],l=n[6],u=n[7];this.getCorners(r,i,a,o,s,c,l,u);for(let t=0;t!==8;t++){let r=n[t];e.pointToLocal(r,r)}return t.setFromPoints(n)}toWorldFrame(e,t){let n=Ws,r=n[0],i=n[1],a=n[2],o=n[3],s=n[4],c=n[5],l=n[6],u=n[7];this.getCorners(r,i,a,o,s,c,l,u);for(let t=0;t!==8;t++){let r=n[t];e.pointToWorld(r,r)}return t.setFromPoints(n)}overlapsRay(e){let{direction:t,from:n}=e,r=1/t.x,i=1/t.y,a=1/t.z,o=(this.lowerBound.x-n.x)*r,s=(this.upperBound.x-n.x)*r,c=(this.lowerBound.y-n.y)*i,l=(this.upperBound.y-n.y)*i,u=(this.lowerBound.z-n.z)*a,d=(this.upperBound.z-n.z)*a,f=Math.max(Math.max(Math.min(o,s),Math.min(c,l)),Math.min(u,d)),p=Math.min(Math.min(Math.max(o,s),Math.max(c,l)),Math.max(u,d));return!(p<0||f>p)}},Us=new Z,Ws=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],Gs=class{constructor(){this.matrix=[]}get(e,t){let{index:n}=e,{index:r}=t;if(r>n){let e=r;r=n,n=e}return this.matrix[(n*(n+1)>>1)+r-1]}set(e,t,n){let{index:r}=e,{index:i}=t;if(i>r){let e=i;i=r,r=e}this.matrix[(r*(r+1)>>1)+i-1]=+!!n}reset(){for(let e=0,t=this.matrix.length;e!==t;e++)this.matrix[e]=0}setNumObjects(e){this.matrix.length=e*(e-1)>>1}},Ks=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;return n[e]===void 0&&(n[e]=[]),n[e].includes(t)||n[e].push(t),this}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return!!(n[e]!==void 0&&n[e].includes(t))}hasAnyEventListener(e){return this._listeners!==void 0&&this._listeners[e]!==void 0}removeEventListener(e,t){if(this._listeners===void 0)return this;let n=this._listeners;if(n[e]===void 0)return this;let r=n[e].indexOf(t);return r!==-1&&n[e].splice(r,1),this}dispatchEvent(e){if(this._listeners===void 0)return this;let t=this._listeners[e.type];if(t!==void 0){e.target=this;for(let n=0,r=t.length;n<r;n++)t[n].call(this,e)}return this}},qs=class e{constructor(e,t,n,r){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=1),this.x=e,this.y=t,this.z=n,this.w=r}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(e,t){let n=Math.sin(t*.5);return this.x=e.x*n,this.y=e.y*n,this.z=e.z*n,this.w=Math.cos(t*.5),this}toAxisAngle(e){e===void 0&&(e=new Z),this.normalize();let t=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(e.x=this.x,e.y=this.y,e.z=this.z):(e.x=this.x/n,e.y=this.y/n,e.z=this.z/n),[e,t]}setFromVectors(e,t){if(e.isAntiparallelTo(t)){let t=Js,n=Ys;e.tangents(t,n),this.setFromAxisAngle(t,Math.PI)}else{let n=e.cross(t);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(e.length()**2*t.length()**2)+e.dot(t),this.normalize()}return this}mult(t,n){n===void 0&&(n=new e);let r=this.x,i=this.y,a=this.z,o=this.w,s=t.x,c=t.y,l=t.z,u=t.w;return n.x=r*u+o*s+i*l-a*c,n.y=i*u+o*c+a*s-r*l,n.z=a*u+o*l+r*c-i*s,n.w=o*u-r*s-i*c-a*l,n}inverse(t){t===void 0&&(t=new e);let n=this.x,r=this.y,i=this.z,a=this.w;this.conjugate(t);let o=1/(n*n+r*r+i*i+a*a);return t.x*=o,t.y*=o,t.z*=o,t.w*=o,t}conjugate(t){return t===void 0&&(t=new e),t.x=-this.x,t.y=-this.y,t.z=-this.z,t.w=this.w,t}normalize(){let e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return e===0?(this.x=0,this.y=0,this.z=0,this.w=0):(e=1/e,this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}normalizeFast(){let e=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return e===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}vmult(e,t){t===void 0&&(t=new Z);let n=e.x,r=e.y,i=e.z,a=this.x,o=this.y,s=this.z,c=this.w,l=c*n+o*i-s*r,u=c*r+s*n-a*i,d=c*i+a*r-o*n,f=-a*n-o*r-s*i;return t.x=l*c+f*-a+u*-s-d*-o,t.y=u*c+f*-o+d*-a-l*-s,t.z=d*c+f*-s+l*-o-u*-a,t}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}toEuler(e,t){t===void 0&&(t=`YZX`);let n,r,i,a=this.x,o=this.y,s=this.z,c=this.w;switch(t){case`YZX`:let e=a*o+s*c;if(e>.499&&(n=2*Math.atan2(a,c),r=Math.PI/2,i=0),e<-.499&&(n=-2*Math.atan2(a,c),r=-Math.PI/2,i=0),n===void 0){let t=a*a,l=o*o,u=s*s;n=Math.atan2(2*o*c-2*a*s,1-2*l-2*u),r=Math.asin(2*e),i=Math.atan2(2*a*c-2*o*s,1-2*t-2*u)}break;default:throw Error(`Euler order ${t} not supported yet.`)}e.y=n,e.z=r,e.x=i}setFromEuler(e,t,n,r){r===void 0&&(r=`XYZ`);let i=Math.cos(e/2),a=Math.cos(t/2),o=Math.cos(n/2),s=Math.sin(e/2),c=Math.sin(t/2),l=Math.sin(n/2);return r===`XYZ`?(this.x=s*a*o+i*c*l,this.y=i*c*o-s*a*l,this.z=i*a*l+s*c*o,this.w=i*a*o-s*c*l):r===`YXZ`?(this.x=s*a*o+i*c*l,this.y=i*c*o-s*a*l,this.z=i*a*l-s*c*o,this.w=i*a*o+s*c*l):r===`ZXY`?(this.x=s*a*o-i*c*l,this.y=i*c*o+s*a*l,this.z=i*a*l+s*c*o,this.w=i*a*o-s*c*l):r===`ZYX`?(this.x=s*a*o-i*c*l,this.y=i*c*o+s*a*l,this.z=i*a*l-s*c*o,this.w=i*a*o+s*c*l):r===`YZX`?(this.x=s*a*o+i*c*l,this.y=i*c*o+s*a*l,this.z=i*a*l-s*c*o,this.w=i*a*o-s*c*l):r===`XZY`&&(this.x=s*a*o-i*c*l,this.y=i*c*o-s*a*l,this.z=i*a*l+s*c*o,this.w=i*a*o+s*c*l),this}clone(){return new e(this.x,this.y,this.z,this.w)}slerp(t,n,r){r===void 0&&(r=new e);let i=this.x,a=this.y,o=this.z,s=this.w,c=t.x,l=t.y,u=t.z,d=t.w,f,p,m,h,g;return p=i*c+a*l+o*u+s*d,p<0&&(p=-p,c=-c,l=-l,u=-u,d=-d),1-p>1e-6?(f=Math.acos(p),m=Math.sin(f),h=Math.sin((1-n)*f)/m,g=Math.sin(n*f)/m):(h=1-n,g=n),r.x=h*i+g*c,r.y=h*a+g*l,r.z=h*o+g*u,r.w=h*s+g*d,r}integrate(t,n,r,i){i===void 0&&(i=new e);let a=t.x*r.x,o=t.y*r.y,s=t.z*r.z,c=this.x,l=this.y,u=this.z,d=this.w,f=n*.5;return i.x+=f*(a*d+o*u-s*l),i.y+=f*(o*d+s*c-a*u),i.z+=f*(s*d+a*l-o*c),i.w+=f*(-a*c-o*l-s*u),i}},Js=new Z,Ys=new Z,Xs={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256},Q=class e{constructor(t){t===void 0&&(t={}),this.id=e.idCounter++,this.type=t.type||0,this.boundingSphereRadius=0,this.collisionResponse=!t.collisionResponse||t.collisionResponse,this.collisionFilterGroup=t.collisionFilterGroup===void 0?1:t.collisionFilterGroup,this.collisionFilterMask=t.collisionFilterMask===void 0?-1:t.collisionFilterMask,this.material=t.material?t.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(e,t){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(e,t,n,r){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}};Q.idCounter=0,Q.types=Xs;var Zs=class e{constructor(e){e===void 0&&(e={}),this.position=new Z,this.quaternion=new qs,e.position&&this.position.copy(e.position),e.quaternion&&this.quaternion.copy(e.quaternion)}pointToLocal(t,n){return e.pointToLocalFrame(this.position,this.quaternion,t,n)}pointToWorld(t,n){return e.pointToWorldFrame(this.position,this.quaternion,t,n)}vectorToWorldFrame(e,t){return t===void 0&&(t=new Z),this.quaternion.vmult(e,t),t}static pointToLocalFrame(e,t,n,r){return r===void 0&&(r=new Z),n.vsub(e,r),t.conjugate(Qs),Qs.vmult(r,r),r}static pointToWorldFrame(e,t,n,r){return r===void 0&&(r=new Z),t.vmult(n,r),r.vadd(e,r),r}static vectorToWorldFrame(e,t,n){return n===void 0&&(n=new Z),e.vmult(t,n),n}static vectorToLocalFrame(e,t,n,r){return r===void 0&&(r=new Z),t.w*=-1,t.vmult(n,r),t.w*=-1,r}},Qs=new qs,$s=class e extends Q{constructor(e){e===void 0&&(e={});let{vertices:t=[],faces:n=[],normals:r=[],axes:i,boundingSphereRadius:a}=e;super({type:Q.types.CONVEXPOLYHEDRON}),this.vertices=t,this.faces=n,this.faceNormals=r,this.faceNormals.length===0&&this.computeNormals(),a?this.boundingSphereRadius=a:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=i?i.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){let e=this.faces,t=this.vertices,n=this.uniqueEdges;n.length=0;let r=new Z;for(let i=0;i!==e.length;i++){let a=e[i],o=a.length;for(let e=0;e!==o;e++){let i=(e+1)%o;t[a[e]].vsub(t[a[i]],r),r.normalize();let s=!1;for(let e=0;e!==n.length;e++)if(n[e].almostEquals(r)||n[e].almostEquals(r)){s=!0;break}s||n.push(r.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let e=0;e<this.faces.length;e++){for(let t=0;t<this.faces[e].length;t++)if(!this.vertices[this.faces[e][t]])throw Error(`Vertex ${this.faces[e][t]} not found!`);let t=this.faceNormals[e]||new Z;this.getFaceNormal(e,t),t.negate(t),this.faceNormals[e]=t;let n=this.vertices[this.faces[e][0]];if(t.dot(n)<0){console.error(`.faceNormals[${e}] = Vec3(${t.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let t=0;t<this.faces[e].length;t++)console.warn(`.vertices[${this.faces[e][t]}] = Vec3(${this.vertices[this.faces[e][t]].toString()})`)}}}getFaceNormal(t,n){let r=this.faces[t],i=this.vertices[r[0]],a=this.vertices[r[1]],o=this.vertices[r[2]];e.computeNormal(i,a,o,n)}static computeNormal(e,t,n,r){let i=new Z,a=new Z;t.vsub(e,a),n.vsub(t,i),i.cross(a,r),r.isZero()||r.normalize()}clipAgainstHull(e,t,n,r,i,a,o,s,c){let l=new Z,u=-1,d=-Number.MAX_VALUE;for(let e=0;e<n.faces.length;e++){l.copy(n.faceNormals[e]),i.vmult(l,l);let t=l.dot(a);t>d&&(d=t,u=e)}let f=[];for(let e=0;e<n.faces[u].length;e++){let t=n.vertices[n.faces[u][e]],a=new Z;a.copy(t),i.vmult(a,a),r.vadd(a,a),f.push(a)}u>=0&&this.clipFaceAgainstHull(a,e,t,f,o,s,c)}findSeparatingAxis(e,t,n,r,i,a,o,s){let c=new Z,l=new Z,u=new Z,d=new Z,f=new Z,p=new Z,m=Number.MAX_VALUE,h=this;if(h.uniqueAxes)for(let o=0;o!==h.uniqueAxes.length;o++){n.vmult(h.uniqueAxes[o],c);let s=h.testSepAxis(c,e,t,n,r,i);if(s===!1)return!1;s<m&&(m=s,a.copy(c))}else{let s=o?o.length:h.faces.length;for(let l=0;l<s;l++){let s=o?o[l]:l;c.copy(h.faceNormals[s]),n.vmult(c,c);let u=h.testSepAxis(c,e,t,n,r,i);if(u===!1)return!1;u<m&&(m=u,a.copy(c))}}if(e.uniqueAxes)for(let o=0;o!==e.uniqueAxes.length;o++){i.vmult(e.uniqueAxes[o],l);let s=h.testSepAxis(l,e,t,n,r,i);if(s===!1)return!1;s<m&&(m=s,a.copy(l))}else{let o=s?s.length:e.faces.length;for(let c=0;c<o;c++){let o=s?s[c]:c;l.copy(e.faceNormals[o]),i.vmult(l,l);let u=h.testSepAxis(l,e,t,n,r,i);if(u===!1)return!1;u<m&&(m=u,a.copy(l))}}for(let o=0;o!==h.uniqueEdges.length;o++){n.vmult(h.uniqueEdges[o],d);for(let o=0;o!==e.uniqueEdges.length;o++)if(i.vmult(e.uniqueEdges[o],f),d.cross(f,p),!p.almostZero()){p.normalize();let o=h.testSepAxis(p,e,t,n,r,i);if(o===!1)return!1;o<m&&(m=o,a.copy(p))}}return r.vsub(t,u),u.dot(a)>0&&a.negate(a),!0}testSepAxis(t,n,r,i,a,o){let s=this;e.project(s,t,r,i,ec),e.project(n,t,a,o,tc);let c=ec[0],l=ec[1],u=tc[0],d=tc[1];if(c<d||u<l)return!1;let f=c-d,p=u-l;return f<p?f:p}calculateLocalInertia(e,t){let n=new Z,r=new Z;this.computeLocalAABB(r,n);let i=n.x-r.x,a=n.y-r.y,o=n.z-r.z;t.x=1/12*e*(2*a*2*a+2*o*2*o),t.y=1/12*e*(2*i*2*i+2*o*2*o),t.z=1/12*e*(2*a*2*a+2*i*2*i)}getPlaneConstantOfFace(e){let t=this.faces[e],n=this.faceNormals[e],r=this.vertices[t[0]];return-n.dot(r)}clipFaceAgainstHull(e,t,n,r,i,a,o){let s=new Z,c=new Z,l=new Z,u=new Z,d=new Z,f=new Z,p=new Z,m=new Z,h=this,g=[],_=r,v=g,y=-1,b=Number.MAX_VALUE;for(let t=0;t<h.faces.length;t++){s.copy(h.faceNormals[t]),n.vmult(s,s);let r=s.dot(e);r<b&&(b=r,y=t)}if(y<0)return;let x=h.faces[y];x.connectedFaces=[];for(let e=0;e<h.faces.length;e++)for(let t=0;t<h.faces[e].length;t++)x.indexOf(h.faces[e][t])!==-1&&e!==y&&x.connectedFaces.indexOf(e)===-1&&x.connectedFaces.push(e);let S=x.length;for(let e=0;e<S;e++){let r=h.vertices[x[e]],i=h.vertices[x[(e+1)%S]];r.vsub(i,c),l.copy(c),n.vmult(l,l),t.vadd(l,l),u.copy(this.faceNormals[y]),n.vmult(u,u),t.vadd(u,u),l.cross(u,d),d.negate(d),f.copy(r),n.vmult(f,f),t.vadd(f,f);let a=x.connectedFaces[e];p.copy(this.faceNormals[a]);let o=this.getPlaneConstantOfFace(a);m.copy(p),n.vmult(m,m);let s=o-m.dot(t);for(this.clipFaceAgainstPlane(_,v,m,s);_.length;)_.shift();for(;v.length;)_.push(v.shift())}p.copy(this.faceNormals[y]);let C=this.getPlaneConstantOfFace(y);m.copy(p),n.vmult(m,m);let w=C-m.dot(t);for(let e=0;e<_.length;e++){let t=m.dot(_[e])+w;if(t<=i&&(console.log(`clamped: depth=${t} to minDist=${i}`),t=i),t<=a){let n=_[e];if(t<=1e-6){let e={point:n,normal:m,depth:t};o.push(e)}}}}clipFaceAgainstPlane(e,t,n,r){let i,a,o=e.length;if(o<2)return t;let s=e[e.length-1],c=e[0];i=n.dot(s)+r;for(let l=0;l<o;l++){if(c=e[l],a=n.dot(c)+r,i<0){if(a<0){let e=new Z;e.copy(c),t.push(e)}else{let e=new Z;s.lerp(c,i/(i-a),e),t.push(e)}}else if(a<0){let e=new Z;s.lerp(c,i/(i-a),e),t.push(e),t.push(c)}s=c,i=a}return t}computeWorldVertices(e,t){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new Z);let n=this.vertices,r=this.worldVertices;for(let i=0;i!==this.vertices.length;i++)t.vmult(n[i],r[i]),e.vadd(r[i],r[i]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(e,t){let n=this.vertices;e.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),t.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let r=0;r<this.vertices.length;r++){let i=n[r];i.x<e.x?e.x=i.x:i.x>t.x&&(t.x=i.x),i.y<e.y?e.y=i.y:i.y>t.y&&(t.y=i.y),i.z<e.z?e.z=i.z:i.z>t.z&&(t.z=i.z)}}computeWorldFaceNormals(e){let t=this.faceNormals.length;for(;this.worldFaceNormals.length<t;)this.worldFaceNormals.push(new Z);let n=this.faceNormals,r=this.worldFaceNormals;for(let i=0;i!==t;i++)e.vmult(n[i],r[i]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let e=0,t=this.vertices;for(let n=0;n!==t.length;n++){let r=t[n].lengthSquared();r>e&&(e=r)}this.boundingSphereRadius=Math.sqrt(e)}calculateWorldAABB(e,t,n,r){let i=this.vertices,a,o,s,c,l,u,d=new Z;for(let n=0;n<i.length;n++){d.copy(i[n]),t.vmult(d,d),e.vadd(d,d);let r=d;(a===void 0||r.x<a)&&(a=r.x),(c===void 0||r.x>c)&&(c=r.x),(o===void 0||r.y<o)&&(o=r.y),(l===void 0||r.y>l)&&(l=r.y),(s===void 0||r.z<s)&&(s=r.z),(u===void 0||r.z>u)&&(u=r.z)}n.set(a,o,s),r.set(c,l,u)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(e){e===void 0&&(e=new Z);let t=this.vertices;for(let n=0;n<t.length;n++)e.vadd(t[n],e);return e.scale(1/t.length,e),e}transformAllPoints(e,t){let n=this.vertices.length,r=this.vertices;if(t){for(let e=0;e<n;e++){let n=r[e];t.vmult(n,n)}for(let e=0;e<this.faceNormals.length;e++){let n=this.faceNormals[e];t.vmult(n,n)}}if(e)for(let t=0;t<n;t++){let n=r[t];n.vadd(e,n)}}pointIsInside(e){let t=this.vertices,n=this.faces,r=this.faceNormals,i=new Z;this.getAveragePointLocal(i);for(let a=0;a<this.faces.length;a++){let o=r[a],s=t[n[a][0]],c=new Z;e.vsub(s,c);let l=o.dot(c),u=new Z;i.vsub(s,u);let d=o.dot(u);if(l<0&&d>0||l>0&&d<0)return!1}return-1}static project(e,t,n,r,i){let a=e.vertices.length,o=nc,s=0,c=0,l=rc,u=e.vertices;l.setZero(),Zs.vectorToLocalFrame(n,r,t,o),Zs.pointToLocalFrame(n,r,l,l);let d=l.dot(o);c=s=u[0].dot(o);for(let e=1;e<a;e++){let t=u[e].dot(o);t>s&&(s=t),t<c&&(c=t)}if(c-=d,s-=d,c>s){let e=c;c=s,s=e}i[0]=s,i[1]=c}},ec=[],tc=[];new Z;var nc=new Z,rc=new Z,ic=class e extends Q{constructor(e){super({type:Q.types.BOX}),this.halfExtents=e,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){let e=this.halfExtents.x,t=this.halfExtents.y,n=this.halfExtents.z,r=Z,i=new $s({vertices:[new r(-e,-t,-n),new r(e,-t,-n),new r(e,t,-n),new r(-e,t,-n),new r(-e,-t,n),new r(e,-t,n),new r(e,t,n),new r(-e,t,n)],faces:[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],axes:[new r(0,0,1),new r(0,1,0),new r(1,0,0)]});this.convexPolyhedronRepresentation=i,i.material=this.material}calculateLocalInertia(t,n){return n===void 0&&(n=new Z),e.calculateInertia(this.halfExtents,t,n),n}static calculateInertia(e,t,n){let r=e;n.x=1/12*t*(2*r.y*2*r.y+2*r.z*2*r.z),n.y=1/12*t*(2*r.x*2*r.x+2*r.z*2*r.z),n.z=1/12*t*(2*r.y*2*r.y+2*r.x*2*r.x)}getSideNormals(e,t){let n=e,r=this.halfExtents;if(n[0].set(r.x,0,0),n[1].set(0,r.y,0),n[2].set(0,0,r.z),n[3].set(-r.x,0,0),n[4].set(0,-r.y,0),n[5].set(0,0,-r.z),t!==void 0)for(let e=0;e!==n.length;e++)t.vmult(n[e],n[e]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(e,t,n){let r=this.halfExtents,i=[[r.x,r.y,r.z],[-r.x,r.y,r.z],[-r.x,-r.y,r.z],[-r.x,-r.y,-r.z],[r.x,-r.y,-r.z],[r.x,r.y,-r.z],[-r.x,r.y,-r.z],[r.x,-r.y,r.z]];for(let r=0;r<i.length;r++)ac.set(i[r][0],i[r][1],i[r][2]),t.vmult(ac,ac),e.vadd(ac,ac),n(ac.x,ac.y,ac.z)}calculateWorldAABB(e,t,n,r){let i=this.halfExtents;oc[0].set(i.x,i.y,i.z),oc[1].set(-i.x,i.y,i.z),oc[2].set(-i.x,-i.y,i.z),oc[3].set(-i.x,-i.y,-i.z),oc[4].set(i.x,-i.y,-i.z),oc[5].set(i.x,i.y,-i.z),oc[6].set(-i.x,i.y,-i.z),oc[7].set(i.x,-i.y,i.z);let a=oc[0];t.vmult(a,a),e.vadd(a,a),r.copy(a),n.copy(a);for(let i=1;i<8;i++){let a=oc[i];t.vmult(a,a),e.vadd(a,a);let o=a.x,s=a.y,c=a.z;o>r.x&&(r.x=o),s>r.y&&(r.y=s),c>r.z&&(r.z=c),o<n.x&&(n.x=o),s<n.y&&(n.y=s),c<n.z&&(n.z=c)}}},ac=new Z,oc=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],sc={DYNAMIC:1,STATIC:2,KINEMATIC:4},cc={AWAKE:0,SLEEPY:1,SLEEPING:2},lc=class e extends Ks{constructor(t){t===void 0&&(t={}),super(),this.id=e.idCounter++,this.index=-1,this.world=null,this.vlambda=new Z,this.collisionFilterGroup=typeof t.collisionFilterGroup==`number`?t.collisionFilterGroup:1,this.collisionFilterMask=typeof t.collisionFilterMask==`number`?t.collisionFilterMask:-1,this.collisionResponse=typeof t.collisionResponse!=`boolean`||t.collisionResponse,this.position=new Z,this.previousPosition=new Z,this.interpolatedPosition=new Z,this.initPosition=new Z,t.position&&(this.position.copy(t.position),this.previousPosition.copy(t.position),this.interpolatedPosition.copy(t.position),this.initPosition.copy(t.position)),this.velocity=new Z,t.velocity&&this.velocity.copy(t.velocity),this.initVelocity=new Z,this.force=new Z;let n=typeof t.mass==`number`?t.mass:0;this.mass=n,this.invMass=n>0?1/n:0,this.material=t.material||null,this.linearDamping=typeof t.linearDamping==`number`?t.linearDamping:.01,this.type=n<=0?e.STATIC:e.DYNAMIC,typeof t.type==typeof e.STATIC&&(this.type=t.type),this.allowSleep=t.allowSleep===void 0||t.allowSleep,this.sleepState=e.AWAKE,this.sleepSpeedLimit=t.sleepSpeedLimit===void 0?.1:t.sleepSpeedLimit,this.sleepTimeLimit=t.sleepTimeLimit===void 0?1:t.sleepTimeLimit,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new Z,this.quaternion=new qs,this.initQuaternion=new qs,this.previousQuaternion=new qs,this.interpolatedQuaternion=new qs,t.quaternion&&(this.quaternion.copy(t.quaternion),this.initQuaternion.copy(t.quaternion),this.previousQuaternion.copy(t.quaternion),this.interpolatedQuaternion.copy(t.quaternion)),this.angularVelocity=new Z,t.angularVelocity&&this.angularVelocity.copy(t.angularVelocity),this.initAngularVelocity=new Z,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new Z,this.invInertia=new Z,this.invInertiaWorld=new Ls,this.invMassSolve=0,this.invInertiaSolve=new Z,this.invInertiaWorldSolve=new Ls,this.fixedRotation=t.fixedRotation!==void 0&&t.fixedRotation,this.angularDamping=t.angularDamping===void 0?.01:t.angularDamping,this.linearFactor=new Z(1,1,1),t.linearFactor&&this.linearFactor.copy(t.linearFactor),this.angularFactor=new Z(1,1,1),t.angularFactor&&this.angularFactor.copy(t.angularFactor),this.aabb=new Hs,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new Z,this.isTrigger=!!t.isTrigger,t.shape&&this.addShape(t.shape),this.updateMassProperties()}wakeUp(){let t=this.sleepState;this.sleepState=e.AWAKE,this.wakeUpAfterNarrowphase=!1,t===e.SLEEPING&&this.dispatchEvent(e.wakeupEvent)}sleep(){this.sleepState=e.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(t){if(this.allowSleep){let n=this.sleepState,r=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),i=this.sleepSpeedLimit**2;n===e.AWAKE&&r<i?(this.sleepState=e.SLEEPY,this.timeLastSleepy=t,this.dispatchEvent(e.sleepyEvent)):n===e.SLEEPY&&r>i?this.wakeUp():n===e.SLEEPY&&t-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(e.sleepEvent))}}updateSolveMassProperties(){this.sleepState===e.SLEEPING||this.type===e.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(e,t){return t===void 0&&(t=new Z),e.vsub(this.position,t),this.quaternion.conjugate().vmult(t,t),t}vectorToLocalFrame(e,t){return t===void 0&&(t=new Z),this.quaternion.conjugate().vmult(e,t),t}pointToWorldFrame(e,t){return t===void 0&&(t=new Z),this.quaternion.vmult(e,t),t.vadd(this.position,t),t}vectorToWorldFrame(e,t){return t===void 0&&(t=new Z),this.quaternion.vmult(e,t),t}addShape(e,t,n){let r=new Z,i=new qs;return t&&r.copy(t),n&&i.copy(n),this.shapes.push(e),this.shapeOffsets.push(r),this.shapeOrientations.push(i),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,e.body=this,this}removeShape(e){let t=this.shapes.indexOf(e);return t===-1?(console.warn(`Shape does not belong to the body`),this):(this.shapes.splice(t,1),this.shapeOffsets.splice(t,1),this.shapeOrientations.splice(t,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,e.body=null,this)}updateBoundingRadius(){let e=this.shapes,t=this.shapeOffsets,n=e.length,r=0;for(let i=0;i!==n;i++){let n=e[i];n.updateBoundingSphereRadius();let a=t[i].length(),o=n.boundingSphereRadius;a+o>r&&(r=a+o)}this.boundingRadius=r}updateAABB(){let e=this.shapes,t=this.shapeOffsets,n=this.shapeOrientations,r=e.length,i=uc,a=dc,o=this.quaternion,s=this.aabb,c=fc;for(let l=0;l!==r;l++){let r=e[l];o.vmult(t[l],i),i.vadd(this.position,i),o.mult(n[l],a),r.calculateWorldAABB(i,a,c.lowerBound,c.upperBound),l===0?s.copy(c):s.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(e){let t=this.invInertia;if(t.x!==t.y||t.y!==t.z||e){let e=pc,n=mc;e.setRotationFromQuaternion(this.quaternion),e.transpose(n),e.scale(t,e),e.mmult(n,this.invInertiaWorld)}}applyForce(t,n){if(n===void 0&&(n=new Z),this.type!==e.DYNAMIC)return;this.sleepState===e.SLEEPING&&this.wakeUp();let r=hc;n.cross(t,r),this.force.vadd(t,this.force),this.torque.vadd(r,this.torque)}applyLocalForce(t,n){if(n===void 0&&(n=new Z),this.type!==e.DYNAMIC)return;let r=gc,i=_c;this.vectorToWorldFrame(t,r),this.vectorToWorldFrame(n,i),this.applyForce(r,i)}applyTorque(t){this.type===e.DYNAMIC&&(this.sleepState===e.SLEEPING&&this.wakeUp(),this.torque.vadd(t,this.torque))}applyImpulse(t,n){if(n===void 0&&(n=new Z),this.type!==e.DYNAMIC)return;this.sleepState===e.SLEEPING&&this.wakeUp();let r=n,i=vc;i.copy(t),i.scale(this.invMass,i),this.velocity.vadd(i,this.velocity);let a=yc;r.cross(t,a),this.invInertiaWorld.vmult(a,a),this.angularVelocity.vadd(a,this.angularVelocity)}applyLocalImpulse(t,n){if(n===void 0&&(n=new Z),this.type!==e.DYNAMIC)return;let r=bc,i=xc;this.vectorToWorldFrame(t,r),this.vectorToWorldFrame(n,i),this.applyImpulse(r,i)}updateMassProperties(){let e=Sc;this.invMass=this.mass>0?1/this.mass:0;let t=this.inertia,n=this.fixedRotation;this.updateAABB(),e.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),ic.calculateInertia(e,this.mass,t),this.invInertia.set(t.x>0&&!n?1/t.x:0,t.y>0&&!n?1/t.y:0,t.z>0&&!n?1/t.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(e,t){let n=new Z;return e.vsub(this.position,n),this.angularVelocity.cross(n,t),this.velocity.vadd(t,t),t}integrate(t,n,r){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),this.type!==e.DYNAMIC&&this.type!==e.KINEMATIC||this.sleepState===e.SLEEPING)return;let i=this.velocity,a=this.angularVelocity,o=this.position,s=this.force,c=this.torque,l=this.quaternion,u=this.invMass,d=this.invInertiaWorld,f=this.linearFactor,p=u*t;i.x+=s.x*p*f.x,i.y+=s.y*p*f.y,i.z+=s.z*p*f.z;let m=d.elements,h=this.angularFactor,g=c.x*h.x,_=c.y*h.y,v=c.z*h.z;a.x+=t*(m[0]*g+m[1]*_+m[2]*v),a.y+=t*(m[3]*g+m[4]*_+m[5]*v),a.z+=t*(m[6]*g+m[7]*_+m[8]*v),o.x+=i.x*t,o.y+=i.y*t,o.z+=i.z*t,l.integrate(this.angularVelocity,t,this.angularFactor,l),n&&(r?l.normalizeFast():l.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}};lc.idCounter=0,lc.COLLIDE_EVENT_NAME=`collide`,lc.DYNAMIC=sc.DYNAMIC,lc.STATIC=sc.STATIC,lc.KINEMATIC=sc.KINEMATIC,lc.AWAKE=cc.AWAKE,lc.SLEEPY=cc.SLEEPY,lc.SLEEPING=cc.SLEEPING,lc.wakeupEvent={type:`wakeup`},lc.sleepyEvent={type:`sleepy`},lc.sleepEvent={type:`sleep`};var uc=new Z,dc=new qs,fc=new Hs,pc=new Ls,mc=new Ls;new Ls;var hc=new Z,gc=new Z,_c=new Z,vc=new Z,yc=new Z,bc=new Z,xc=new Z,Sc=new Z,Cc=class{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(e,t,n){throw Error(`collisionPairs not implemented for this BroadPhase class!`)}needBroadphaseCollision(e,t){return(e.collisionFilterGroup&t.collisionFilterMask)!==0&&(t.collisionFilterGroup&e.collisionFilterMask)!==0&&((e.type&lc.STATIC)===0&&e.sleepState!==lc.SLEEPING||(t.type&lc.STATIC)===0&&t.sleepState!==lc.SLEEPING)}intersectionTest(e,t,n,r){this.useBoundingBoxes?this.doBoundingBoxBroadphase(e,t,n,r):this.doBoundingSphereBroadphase(e,t,n,r)}doBoundingSphereBroadphase(e,t,n,r){let i=wc;t.position.vsub(e.position,i);let a=(e.boundingRadius+t.boundingRadius)**2;i.lengthSquared()<a&&(n.push(e),r.push(t))}doBoundingBoxBroadphase(e,t,n,r){e.aabbNeedsUpdate&&e.updateAABB(),t.aabbNeedsUpdate&&t.updateAABB(),e.aabb.overlaps(t.aabb)&&(n.push(e),r.push(t))}makePairsUnique(e,t){let n=Tc,r=Ec,i=Dc,a=e.length;for(let n=0;n!==a;n++)r[n]=e[n],i[n]=t[n];e.length=0,t.length=0;for(let e=0;e!==a;e++){let t=r[e].id,a=i[e].id,o=t<a?`${t},${a}`:`${a},${t}`;n[o]=e,n.keys.push(o)}for(let a=0;a!==n.keys.length;a++){let a=n.keys.pop(),o=n[a];e.push(r[o]),t.push(i[o]),delete n[a]}}setWorld(e){}static boundingSphereCheck(e,t){let n=new Z;e.position.vsub(t.position,n);let r=e.shapes[0],i=t.shapes[0];return(r.boundingSphereRadius+i.boundingSphereRadius)**2>n.lengthSquared()}aabbQuery(e,t,n){return console.warn(`.aabbQuery is not implemented in this Broadphase subclass.`),[]}},wc=new Z;new Z,new qs,new Z;var Tc={keys:[]},Ec=[],Dc=[];new Z,new Z,new Z;var Oc=class extends Cc{constructor(){super()}collisionPairs(e,t,n){let r=e.bodies,i=r.length,a,o;for(let e=0;e!==i;e++)for(let i=0;i!==e;i++)a=r[e],o=r[i],this.needBroadphaseCollision(a,o)&&this.intersectionTest(a,o,t,n)}aabbQuery(e,t,n){n===void 0&&(n=[]);for(let r=0;r<e.bodies.length;r++){let i=e.bodies[r];i.aabbNeedsUpdate&&i.updateAABB(),i.aabb.overlaps(t)&&n.push(i)}return n}},kc=class{constructor(){this.rayFromWorld=new Z,this.rayToWorld=new Z,this.hitNormalWorld=new Z,this.hitPointWorld=new Z,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(e,t,n,r,i,a,o){this.rayFromWorld.copy(e),this.rayToWorld.copy(t),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(r),this.shape=i,this.body=a,this.distance=o}},Ac,jc,Mc,Nc,Pc,Fc,Ic,Lc={CLOSEST:1,ANY:2,ALL:4};Ac=Q.types.SPHERE,jc=Q.types.PLANE,Mc=Q.types.BOX,Nc=Q.types.CYLINDER,Pc=Q.types.CONVEXPOLYHEDRON,Fc=Q.types.HEIGHTFIELD,Ic=Q.types.TRIMESH;var Rc=class e{get[Ac](){return this._intersectSphere}get[jc](){return this._intersectPlane}get[Mc](){return this._intersectBox}get[Nc](){return this._intersectConvex}get[Pc](){return this._intersectConvex}get[Fc](){return this._intersectHeightfield}get[Ic](){return this._intersectTrimesh}constructor(t,n){t===void 0&&(t=new Z),n===void 0&&(n=new Z),this.from=t.clone(),this.to=n.clone(),this.direction=new Z,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=e.ANY,this.result=new kc,this.hasHit=!1,this.callback=e=>{}}intersectWorld(t,n){return this.mode=n.mode||e.ANY,this.result=n.result||new kc,this.skipBackfaces=!!n.skipBackfaces,this.collisionFilterMask=n.collisionFilterMask===void 0?-1:n.collisionFilterMask,this.collisionFilterGroup=n.collisionFilterGroup===void 0?-1:n.collisionFilterGroup,this.checkCollisionResponse=n.checkCollisionResponse===void 0||n.checkCollisionResponse,n.from&&this.from.copy(n.from),n.to&&this.to.copy(n.to),this.callback=n.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(zc),Bc.length=0,t.broadphase.aabbQuery(t,zc,Bc),this.intersectBodies(Bc),this.hasHit}intersectBody(e,t){t&&(this.result=t,this.updateDirection());let n=this.checkCollisionResponse;if(n&&!e.collisionResponse||(this.collisionFilterGroup&e.collisionFilterMask)===0||(e.collisionFilterGroup&this.collisionFilterMask)===0)return;let r=Uc,i=Wc;for(let t=0,a=e.shapes.length;t<a;t++){let a=e.shapes[t];if((!n||a.collisionResponse)&&(e.quaternion.mult(e.shapeOrientations[t],i),e.quaternion.vmult(e.shapeOffsets[t],r),r.vadd(e.position,r),this.intersectShape(a,i,r,e),this.result.shouldStop))break}}intersectBodies(e,t){t&&(this.result=t,this.updateDirection());for(let t=0,n=e.length;!this.result.shouldStop&&t<n;t++)this.intersectBody(e[t])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(e,t,n,r){let i=this.from;if(pl(i,this.direction,n)>e.boundingSphereRadius)return;let a=this[e.type];a&&a.call(this,e,t,n,r,e)}_intersectBox(e,t,n,r,i){return this._intersectConvex(e.convexPolyhedronRepresentation,t,n,r,i)}_intersectPlane(e,t,n,r,i){let a=this.from,o=this.to,s=this.direction,c=new Z(0,0,1);t.vmult(c,c);let l=new Z;a.vsub(n,l);let u=l.dot(c);if(o.vsub(n,l),u*l.dot(c)>0||a.distanceTo(o)<u)return;let d=c.dot(s);if(Math.abs(d)<this.precision)return;let f=new Z,p=new Z,m=new Z;a.vsub(n,f);let h=-c.dot(f)/d;s.scale(h,p),a.vadd(p,m),this.reportIntersection(c,m,i,r,-1)}getAABB(e){let{lowerBound:t,upperBound:n}=e,r=this.to,i=this.from;t.x=Math.min(r.x,i.x),t.y=Math.min(r.y,i.y),t.z=Math.min(r.z,i.z),n.x=Math.max(r.x,i.x),n.y=Math.max(r.y,i.y),n.z=Math.max(r.z,i.z)}_intersectHeightfield(e,t,n,r,i){e.data,e.elementSize;let a=Zc;a.from.copy(this.from),a.to.copy(this.to),Zs.pointToLocalFrame(n,t,a.from,a.from),Zs.pointToLocalFrame(n,t,a.to,a.to),a.updateDirection();let o=Qc,s,c,l,u;s=c=0,l=u=e.data.length-1;let d=new Hs;a.getAABB(d),e.getIndexOfPosition(d.lowerBound.x,d.lowerBound.y,o,!0),s=Math.max(s,o[0]),c=Math.max(c,o[1]),e.getIndexOfPosition(d.upperBound.x,d.upperBound.y,o,!0),l=Math.min(l,o[0]+1),u=Math.min(u,o[1]+1);for(let o=s;o<l;o++)for(let s=c;s<u;s++){if(this.result.shouldStop)return;if(e.getAabbAtIndex(o,s,d),d.overlapsRay(a)){if(e.getConvexTrianglePillar(o,s,!1),Zs.pointToWorldFrame(n,t,e.pillarOffset,Xc),this._intersectConvex(e.pillarConvex,t,Xc,r,i,Yc),this.result.shouldStop)return;e.getConvexTrianglePillar(o,s,!0),Zs.pointToWorldFrame(n,t,e.pillarOffset,Xc),this._intersectConvex(e.pillarConvex,t,Xc,r,i,Yc)}}}_intersectSphere(e,t,n,r,i){let a=this.from,o=this.to,s=e.radius,c=(o.x-a.x)**2+(o.y-a.y)**2+(o.z-a.z)**2,l=2*((o.x-a.x)*(a.x-n.x)+(o.y-a.y)*(a.y-n.y)+(o.z-a.z)*(a.z-n.z)),u=(a.x-n.x)**2+(a.y-n.y)**2+(a.z-n.z)**2-s**2,d=l**2-4*c*u,f=$c,p=el;if(!(d<0)){if(d===0)a.lerp(o,d,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,i,r,-1);else{let e=(-l-Math.sqrt(d))/(2*c),t=(-l+Math.sqrt(d))/(2*c);if(e>=0&&e<=1&&(a.lerp(o,e,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,i,r,-1)),this.result.shouldStop)return;t>=0&&t<=1&&(a.lerp(o,t,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,i,r,-1))}}}_intersectConvex(t,n,r,i,a,o){let s=tl,c=nl,l=o&&o.faceList||null,u=t.faces,d=t.vertices,f=t.faceNormals,p=this.direction,m=this.from,h=this.to,g=m.distanceTo(h),_=l?l.length:u.length,v=this.result;for(let t=0;!v.shouldStop&&t<_;t++){let o=l?l[t]:t,h=u[o],_=f[o],y=n,b=r;c.copy(d[h[0]]),y.vmult(c,c),c.vadd(b,c),c.vsub(m,c),y.vmult(_,s);let x=p.dot(s);if(Math.abs(x)<this.precision)continue;let S=s.dot(c)/x;if(!(S<0)){p.scale(S,Gc),Gc.vadd(m,Gc),Kc.copy(d[h[0]]),y.vmult(Kc,Kc),b.vadd(Kc,Kc);for(let t=1;!v.shouldStop&&t<h.length-1;t++){qc.copy(d[h[t]]),Jc.copy(d[h[t+1]]),y.vmult(qc,qc),y.vmult(Jc,Jc),b.vadd(qc,qc),b.vadd(Jc,Jc);let n=Gc.distanceTo(m);!(e.pointInTriangle(Gc,Kc,qc,Jc)||e.pointInTriangle(Gc,qc,Kc,Jc))||n>g||this.reportIntersection(s,Gc,a,i,o)}}}}_intersectTrimesh(t,n,r,i,a,o){let s=rl,c=ll,l=ul,u=nl,d=il,f=al,p=ol,m=cl,h=sl,g=t.indices;t.vertices;let _=this.from,v=this.to,y=this.direction;l.position.copy(r),l.quaternion.copy(n),Zs.vectorToLocalFrame(r,n,y,d),Zs.pointToLocalFrame(r,n,_,f),Zs.pointToLocalFrame(r,n,v,p),p.x*=t.scale.x,p.y*=t.scale.y,p.z*=t.scale.z,f.x*=t.scale.x,f.y*=t.scale.y,f.z*=t.scale.z,p.vsub(f,d),d.normalize();let b=f.distanceSquared(p);t.tree.rayQuery(this,l,c);for(let o=0,l=c.length;!this.result.shouldStop&&o!==l;o++){let l=c[o];t.getNormal(l,s),t.getVertex(g[l*3],Kc),Kc.vsub(f,u);let p=d.dot(s),_=s.dot(u)/p;if(_<0)continue;d.scale(_,Gc),Gc.vadd(f,Gc),t.getVertex(g[l*3+1],qc),t.getVertex(g[l*3+2],Jc);let v=Gc.distanceSquared(f);!(e.pointInTriangle(Gc,qc,Kc,Jc)||e.pointInTriangle(Gc,Kc,qc,Jc))||v>b||(Zs.vectorToWorldFrame(n,s,h),Zs.pointToWorldFrame(r,n,Gc,m),this.reportIntersection(h,m,a,i,l))}c.length=0}reportIntersection(t,n,r,i,a){let o=this.from,s=this.to,c=o.distanceTo(n),l=this.result;if(!(this.skipBackfaces&&t.dot(this.direction)>0))switch(l.hitFaceIndex=a===void 0?-1:a,this.mode){case e.ALL:this.hasHit=!0,l.set(o,s,t,n,r,i,c),l.hasHit=!0,this.callback(l);break;case e.CLOSEST:(c<l.distance||!l.hasHit)&&(this.hasHit=!0,l.hasHit=!0,l.set(o,s,t,n,r,i,c));break;case e.ANY:this.hasHit=!0,l.hasHit=!0,l.set(o,s,t,n,r,i,c),l.shouldStop=!0}}static pointInTriangle(e,t,n,r){r.vsub(t,dl),n.vsub(t,Vc),e.vsub(t,Hc);let i=dl.dot(dl),a=dl.dot(Vc),o=dl.dot(Hc),s=Vc.dot(Vc),c=Vc.dot(Hc),l,u;return(l=s*o-a*c)>=0&&(u=i*c-a*o)>=0&&l+u<i*s-a*a}};Rc.CLOSEST=Lc.CLOSEST,Rc.ANY=Lc.ANY,Rc.ALL=Lc.ALL;var zc=new Hs,Bc=[],Vc=new Z,Hc=new Z,Uc=new Z,Wc=new qs,Gc=new Z,Kc=new Z,qc=new Z,Jc=new Z;new Z,new kc;var Yc={faceList:[0]},Xc=new Z,Zc=new Rc,Qc=[],$c=new Z,el=new Z,tl=new Z;new Z,new Z;var nl=new Z,rl=new Z,il=new Z,al=new Z,ol=new Z,sl=new Z,cl=new Z;new Hs;var ll=[],ul=new Zs,dl=new Z,fl=new Z;function pl(e,t,n){n.vsub(e,dl);let r=dl.dot(t);return t.scale(r,fl),fl.vadd(e,fl),n.distanceTo(fl)}var ml=class e extends Cc{static checkBounds(e,t,n){let r,i;n===0?(r=e.position.x,i=t.position.x):n===1?(r=e.position.y,i=t.position.y):n===2&&(r=e.position.z,i=t.position.z);let a=e.boundingRadius,o=t.boundingRadius,s=r+a;return i-o<s}static insertionSortX(e){for(let t=1,n=e.length;t<n;t++){let n=e[t],r;for(r=t-1;r>=0&&!(e[r].aabb.lowerBound.x<=n.aabb.lowerBound.x);r--)e[r+1]=e[r];e[r+1]=n}return e}static insertionSortY(e){for(let t=1,n=e.length;t<n;t++){let n=e[t],r;for(r=t-1;r>=0&&!(e[r].aabb.lowerBound.y<=n.aabb.lowerBound.y);r--)e[r+1]=e[r];e[r+1]=n}return e}static insertionSortZ(e){for(let t=1,n=e.length;t<n;t++){let n=e[t],r;for(r=t-1;r>=0&&!(e[r].aabb.lowerBound.z<=n.aabb.lowerBound.z);r--)e[r+1]=e[r];e[r+1]=n}return e}constructor(e){super(),this.axisList=[],this.world=null,this.axisIndex=0;let t=this.axisList;this._addBodyHandler=e=>{t.push(e.body)},this._removeBodyHandler=e=>{let n=t.indexOf(e.body);n!==-1&&t.splice(n,1)},e&&this.setWorld(e)}setWorld(e){this.axisList.length=0;for(let t=0;t<e.bodies.length;t++)this.axisList.push(e.bodies[t]);e.removeEventListener(`addBody`,this._addBodyHandler),e.removeEventListener(`removeBody`,this._removeBodyHandler),e.addEventListener(`addBody`,this._addBodyHandler),e.addEventListener(`removeBody`,this._removeBodyHandler),this.world=e,this.dirty=!0}collisionPairs(t,n,r){let i=this.axisList,a=i.length,o=this.axisIndex,s,c;for(this.dirty&&(this.sortList(),this.dirty=!1),s=0;s!==a;s++){let t=i[s];for(c=s+1;c<a;c++){let a=i[c];if(this.needBroadphaseCollision(t,a)){if(!e.checkBounds(t,a,o))break;this.intersectionTest(t,a,n,r)}}}}sortList(){let t=this.axisList,n=this.axisIndex,r=t.length;for(let e=0;e!==r;e++){let n=t[e];n.aabbNeedsUpdate&&n.updateAABB()}n===0?e.insertionSortX(t):n===1?e.insertionSortY(t):n===2&&e.insertionSortZ(t)}autoDetectAxis(){let e=0,t=0,n=0,r=0,i=0,a=0,o=this.axisList,s=o.length,c=1/s;for(let c=0;c!==s;c++){let s=o[c],l=s.position.x;e+=l,t+=l*l;let u=s.position.y;n+=u,r+=u*u;let d=s.position.z;i+=d,a+=d*d}let l=t-e*e*c,u=r-n*n*c,d=a-i*i*c;this.axisIndex=l>u?l>d?0:2:u>d?1:2}aabbQuery(e,t,n){n===void 0&&(n=[]),this.dirty&&(this.sortList(),this.dirty=!1);let r=this.axisIndex,i=`x`;r===1&&(i=`y`),r===2&&(i=`z`);let a=this.axisList;t.lowerBound[i],t.upperBound[i];for(let e=0;e<a.length;e++){let r=a[e];r.aabbNeedsUpdate&&r.updateAABB(),r.aabb.overlaps(t)&&n.push(r)}return n}},hl=class{static defaults(e,t){e===void 0&&(e={});for(let n in t)n in e||(e[n]=t[n]);return e}},gl=class{constructor(){this.spatial=new Z,this.rotational=new Z}multiplyElement(e){return e.spatial.dot(this.spatial)+e.rotational.dot(this.rotational)}multiplyVectors(e,t){return e.dot(this.spatial)+t.dot(this.rotational)}},_l=class e{constructor(t,n,r,i){r===void 0&&(r=-1e6),i===void 0&&(i=1e6),this.id=e.idCounter++,this.minForce=r,this.maxForce=i,this.bi=t,this.bj=n,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new gl,this.jacobianElementB=new gl,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(e,t,n){let r=t,i=e,a=n;this.a=4/(a*(1+4*r)),this.b=4*r/(1+4*r),this.eps=4/(a*a*i*(1+4*r))}computeB(e,t,n){let r=this.computeGW(),i=this.computeGq(),a=this.computeGiMf();return-i*e-r*t-a*n}computeGq(){let e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,r=this.bj,i=n.position,a=r.position;return e.spatial.dot(i)+t.spatial.dot(a)}computeGW(){let e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,r=this.bj,i=n.velocity,a=r.velocity,o=n.angularVelocity,s=r.angularVelocity;return e.multiplyVectors(i,o)+t.multiplyVectors(a,s)}computeGWlambda(){let e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,r=this.bj,i=n.vlambda,a=r.vlambda,o=n.wlambda,s=r.wlambda;return e.multiplyVectors(i,o)+t.multiplyVectors(a,s)}computeGiMf(){let e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,r=this.bj,i=n.force,a=n.torque,o=r.force,s=r.torque,c=n.invMassSolve,l=r.invMassSolve;return i.scale(c,vl),o.scale(l,yl),n.invInertiaWorldSolve.vmult(a,bl),r.invInertiaWorldSolve.vmult(s,xl),e.multiplyVectors(vl,bl)+t.multiplyVectors(yl,xl)}computeGiMGt(){let e=this.jacobianElementA,t=this.jacobianElementB,n=this.bi,r=this.bj,i=n.invMassSolve,a=r.invMassSolve,o=n.invInertiaWorldSolve,s=r.invInertiaWorldSolve,c=i+a;return o.vmult(e.rotational,Sl),c+=Sl.dot(e.rotational),s.vmult(t.rotational,Sl),c+=Sl.dot(t.rotational),c}addToWlambda(e){let t=this.jacobianElementA,n=this.jacobianElementB,r=this.bi,i=this.bj,a=Cl;r.vlambda.addScaledVector(r.invMassSolve*e,t.spatial,r.vlambda),i.vlambda.addScaledVector(i.invMassSolve*e,n.spatial,i.vlambda),r.invInertiaWorldSolve.vmult(t.rotational,a),r.wlambda.addScaledVector(e,a,r.wlambda),i.invInertiaWorldSolve.vmult(n.rotational,a),i.wlambda.addScaledVector(e,a,i.wlambda)}computeC(){return this.computeGiMGt()+this.eps}};_l.idCounter=0;var vl=new Z,yl=new Z,bl=new Z,xl=new Z,Sl=new Z,Cl=new Z,wl=class extends _l{constructor(e,t,n){n===void 0&&(n=1e6),super(e,t,0,n),this.restitution=0,this.ri=new Z,this.rj=new Z,this.ni=new Z}computeB(e){let t=this.a,n=this.b,r=this.bi,i=this.bj,a=this.ri,o=this.rj,s=Tl,c=El,l=r.velocity,u=r.angularVelocity;r.force,r.torque;let d=i.velocity,f=i.angularVelocity;i.force,i.torque;let p=Dl,m=this.jacobianElementA,h=this.jacobianElementB,g=this.ni;a.cross(g,s),o.cross(g,c),g.negate(m.spatial),s.negate(m.rotational),h.spatial.copy(g),h.rotational.copy(c),p.copy(i.position),p.vadd(o,p),p.vsub(r.position,p),p.vsub(a,p);let _=g.dot(p),v=this.restitution+1,y=v*d.dot(g)-v*l.dot(g)+f.dot(c)-u.dot(s),b=this.computeGiMf();return-_*t-y*n-e*b}getImpactVelocityAlongNormal(){let e=Ol,t=kl,n=Al,r=jl,i=Ml;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,r),this.bi.getVelocityAtWorldPoint(n,e),this.bj.getVelocityAtWorldPoint(r,t),e.vsub(t,i),this.ni.dot(i)}},Tl=new Z,El=new Z,Dl=new Z,Ol=new Z,kl=new Z,Al=new Z,jl=new Z,Ml=new Z;new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z;var Nl=class extends _l{constructor(e,t,n){super(e,t,-n,n),this.ri=new Z,this.rj=new Z,this.t=new Z}computeB(e){this.a;let t=this.b;this.bi,this.bj;let n=this.ri,r=this.rj,i=Pl,a=Fl,o=this.t;n.cross(o,i),r.cross(o,a);let s=this.jacobianElementA,c=this.jacobianElementB;o.negate(s.spatial),i.negate(s.rotational),c.spatial.copy(o),c.rotational.copy(a);let l=this.computeGW(),u=this.computeGiMf();return-l*t-e*u}},Pl=new Z,Fl=new Z,Il=class e{constructor(t,n,r){r=hl.defaults(r,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=e.idCounter++,this.materials=[t,n],this.friction=r.friction,this.restitution=r.restitution,this.contactEquationStiffness=r.contactEquationStiffness,this.contactEquationRelaxation=r.contactEquationRelaxation,this.frictionEquationStiffness=r.frictionEquationStiffness,this.frictionEquationRelaxation=r.frictionEquationRelaxation}};Il.idCounter=0;var Ll=class e{constructor(t){t===void 0&&(t={});let n=``;typeof t==`string`&&(n=t,t={}),this.name=n,this.id=e.idCounter++,this.friction=t.friction===void 0?-1:t.friction,this.restitution=t.restitution===void 0?-1:t.restitution}};Ll.idCounter=0,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Rc,new Z,new Z,new Z,new Z(1,0,0),new Z(0,1,0),new Z(0,0,1),new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z;var Rl=class extends Q{constructor(e){if(super({type:Q.types.SPHERE}),this.radius=e===void 0?1:e,this.radius<0)throw Error(`The sphere radius cannot be negative.`);this.updateBoundingSphereRadius()}calculateLocalInertia(e,t){t===void 0&&(t=new Z);let n=2*e*this.radius*this.radius/5;return t.x=n,t.y=n,t.z=n,t}volume(){return 4*Math.PI*this.radius**3/3}updateBoundingSphereRadius(){this.boundingSphereRadius=this.radius}calculateWorldAABB(e,t,n,r){let i=this.radius,a=[`x`,`y`,`z`];for(let t=0;t<a.length;t++){let o=a[t];n[o]=e[o]-i,r[o]=e[o]+i}}};new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z;var zl=class extends $s{constructor(e,t,n,r){if(e===void 0&&(e=1),t===void 0&&(t=1),n===void 0&&(n=1),r===void 0&&(r=8),e<0)throw Error(`The cylinder radiusTop cannot be negative.`);if(t<0)throw Error(`The cylinder radiusBottom cannot be negative.`);let i=r,a=[],o=[],s=[],c=[],l=[],u=Math.cos,d=Math.sin;a.push(new Z(-t*d(0),-n*.5,t*u(0))),c.push(0),a.push(new Z(-e*d(0),n*.5,e*u(0))),l.push(1);for(let r=0;r<i;r++){let f=2*Math.PI/i*(r+1),p=2*Math.PI/i*(r+.5);r<i-1?(a.push(new Z(-t*d(f),-n*.5,t*u(f))),c.push(2*r+2),a.push(new Z(-e*d(f),n*.5,e*u(f))),l.push(2*r+3),s.push([2*r,2*r+1,2*r+3,2*r+2])):s.push([2*r,2*r+1,1,0]),(i%2==1||r<i/2)&&o.push(new Z(-d(p),0,u(p)))}s.push(c),o.push(new Z(0,1,0));let f=[];for(let e=0;e<l.length;e++)f.push(l[l.length-e-1]);s.push(f),super({vertices:a,faces:s,axes:o}),this.type=Q.types.CYLINDER,this.radiusTop=e,this.radiusBottom=t,this.height=n,this.numSegments=r}};new Z;var Bl=class extends Q{constructor(e,t){t===void 0&&(t={}),t=hl.defaults(t,{maxValue:null,minValue:null,elementSize:1}),super({type:Q.types.HEIGHTFIELD}),this.data=e,this.maxValue=t.maxValue,this.minValue=t.minValue,this.elementSize=t.elementSize,t.minValue===null&&this.updateMinValue(),t.maxValue===null&&this.updateMaxValue(),this.cacheEnabled=!0,this.pillarConvex=new $s,this.pillarOffset=new Z,this.updateBoundingSphereRadius(),this._cachedPillars={}}update(){this._cachedPillars={}}updateMinValue(){let e=this.data,t=e[0][0];for(let n=0;n!==e.length;n++)for(let r=0;r!==e[n].length;r++){let i=e[n][r];i<t&&(t=i)}this.minValue=t}updateMaxValue(){let e=this.data,t=e[0][0];for(let n=0;n!==e.length;n++)for(let r=0;r!==e[n].length;r++){let i=e[n][r];i>t&&(t=i)}this.maxValue=t}setHeightValueAtIndex(e,t,n){let r=this.data;r[e][t]=n,this.clearCachedConvexTrianglePillar(e,t,!1),e>0&&(this.clearCachedConvexTrianglePillar(e-1,t,!0),this.clearCachedConvexTrianglePillar(e-1,t,!1)),t>0&&(this.clearCachedConvexTrianglePillar(e,t-1,!0),this.clearCachedConvexTrianglePillar(e,t-1,!1)),t>0&&e>0&&this.clearCachedConvexTrianglePillar(e-1,t-1,!0)}getRectMinMax(e,t,n,r,i){i===void 0&&(i=[]);let a=this.data,o=this.minValue;for(let i=e;i<=n;i++)for(let e=t;e<=r;e++){let t=a[i][e];t>o&&(o=t)}i[0]=this.minValue,i[1]=o}getIndexOfPosition(e,t,n,r){let i=this.elementSize,a=this.data,o=Math.floor(e/i),s=Math.floor(t/i);return n[0]=o,n[1]=s,r&&(o<0&&(o=0),s<0&&(s=0),o>=a.length-1&&(o=a.length-1),s>=a[0].length-1&&(s=a[0].length-1)),!(o<0||s<0||o>=a.length-1||s>=a[0].length-1)}getTriangleAt(e,t,n,r,i,a){let o=Vl;this.getIndexOfPosition(e,t,o,n);let s=o[0],c=o[1],l=this.data;n&&(s=Math.min(l.length-2,Math.max(0,s)),c=Math.min(l[0].length-2,Math.max(0,c)));let u=this.elementSize,d=(e/u-s)**2+(t/u-c)**2>(e/u-(s+1))**2+(t/u-(c+1))**2;return this.getTriangle(s,c,d,r,i,a),d}getNormalAt(e,t,n,r){let i=Kl,a=ql,o=Jl,s=Yl,c=Xl;this.getTriangleAt(e,t,n,i,a,o),a.vsub(i,s),o.vsub(i,c),s.cross(c,r),r.normalize()}getAabbAtIndex(e,t,n){let{lowerBound:r,upperBound:i}=n,a=this.data,o=this.elementSize;r.set(e*o,t*o,a[e][t]),i.set((e+1)*o,(t+1)*o,a[e+1][t+1])}getHeightAt(e,t,n){let r=this.data,i=Ul,a=Wl,o=Gl,s=Vl;this.getIndexOfPosition(e,t,s,n);let c=s[0],l=s[1];n&&(c=Math.min(r.length-2,Math.max(0,c)),l=Math.min(r[0].length-2,Math.max(0,l)));let u=this.getTriangleAt(e,t,n,i,a,o);Zl(e,t,i.x,i.y,a.x,a.y,o.x,o.y,Hl);let d=Hl;return u?r[c+1][l+1]*d.x+r[c][l+1]*d.y+r[c+1][l]*d.z:r[c][l]*d.x+r[c+1][l]*d.y+r[c][l+1]*d.z}getCacheConvexTrianglePillarKey(e,t,n){return`${e}_${t}_${+!!n}`}getCachedConvexTrianglePillar(e,t,n){return this._cachedPillars[this.getCacheConvexTrianglePillarKey(e,t,n)]}setCachedConvexTrianglePillar(e,t,n,r,i){this._cachedPillars[this.getCacheConvexTrianglePillarKey(e,t,n)]={convex:r,offset:i}}clearCachedConvexTrianglePillar(e,t,n){delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(e,t,n)]}getTriangle(e,t,n,r,i,a){let o=this.data,s=this.elementSize;n?(r.set((e+1)*s,(t+1)*s,o[e+1][t+1]),i.set(e*s,(t+1)*s,o[e][t+1]),a.set((e+1)*s,t*s,o[e+1][t])):(r.set(e*s,t*s,o[e][t]),i.set((e+1)*s,t*s,o[e+1][t]),a.set(e*s,(t+1)*s,o[e][t+1]))}getConvexTrianglePillar(e,t,n){let r=this.pillarConvex,i=this.pillarOffset;if(this.cacheEnabled){let a=this.getCachedConvexTrianglePillar(e,t,n);if(a){this.pillarConvex=a.convex,this.pillarOffset=a.offset;return}r=new $s,i=new Z,this.pillarConvex=r,this.pillarOffset=i}let a=this.data,o=this.elementSize,s=r.faces;r.vertices.length=6;for(let e=0;e<6;e++)r.vertices[e]||(r.vertices[e]=new Z);s.length=5;for(let e=0;e<5;e++)s[e]||(s[e]=[]);let c=r.vertices,l=(Math.min(a[e][t],a[e+1][t],a[e][t+1],a[e+1][t+1])-this.minValue)/2+this.minValue;n?(i.set((e+.75)*o,(t+.75)*o,l),c[0].set(.25*o,.25*o,a[e+1][t+1]-l),c[1].set(-.75*o,.25*o,a[e][t+1]-l),c[2].set(.25*o,-.75*o,a[e+1][t]-l),c[3].set(.25*o,.25*o,-Math.abs(l)-1),c[4].set(-.75*o,.25*o,-Math.abs(l)-1),c[5].set(.25*o,-.75*o,-Math.abs(l)-1),s[0][0]=0,s[0][1]=1,s[0][2]=2,s[1][0]=5,s[1][1]=4,s[1][2]=3,s[2][0]=2,s[2][1]=5,s[2][2]=3,s[2][3]=0,s[3][0]=3,s[3][1]=4,s[3][2]=1,s[3][3]=0,s[4][0]=1,s[4][1]=4,s[4][2]=5,s[4][3]=2):(i.set((e+.25)*o,(t+.25)*o,l),c[0].set(-.25*o,-.25*o,a[e][t]-l),c[1].set(.75*o,-.25*o,a[e+1][t]-l),c[2].set(-.25*o,.75*o,a[e][t+1]-l),c[3].set(-.25*o,-.25*o,-Math.abs(l)-1),c[4].set(.75*o,-.25*o,-Math.abs(l)-1),c[5].set(-.25*o,.75*o,-Math.abs(l)-1),s[0][0]=0,s[0][1]=1,s[0][2]=2,s[1][0]=5,s[1][1]=4,s[1][2]=3,s[2][0]=0,s[2][1]=2,s[2][2]=5,s[2][3]=3,s[3][0]=1,s[3][1]=0,s[3][2]=3,s[3][3]=4,s[4][0]=4,s[4][1]=5,s[4][2]=2,s[4][3]=1),r.computeNormals(),r.computeEdges(),r.updateBoundingSphereRadius(),this.setCachedConvexTrianglePillar(e,t,n,r,i)}calculateLocalInertia(e,t){return t===void 0&&(t=new Z),t.set(0,0,0),t}volume(){return Number.MAX_VALUE}calculateWorldAABB(e,t,n,r){n.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),r.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE)}updateBoundingSphereRadius(){let e=this.data,t=this.elementSize;this.boundingSphereRadius=new Z(e.length*t,e[0].length*t,Math.max(Math.abs(this.maxValue),Math.abs(this.minValue))).length()}setHeightsFromImage(e,t){let{x:n,z:r,y:i}=t,a=document.createElement(`canvas`);a.width=e.width,a.height=e.height;let o=a.getContext(`2d`);o.drawImage(e,0,0);let s=o.getImageData(0,0,e.width,e.height),c=this.data;c.length=0,this.elementSize=Math.abs(n)/s.width;for(let e=0;e<s.height;e++){let t=[];for(let i=0;i<s.width;i++){let a=s.data[(e*s.height+i)*4],o=s.data[(e*s.height+i)*4+1],c=s.data[(e*s.height+i)*4+2],l=(a+o+c)/4/255*r;n<0?t.push(l):t.unshift(l)}i<0?c.unshift(t):c.push(t)}this.updateMaxValue(),this.updateMinValue(),this.update()}},Vl=[],Hl=new Z,Ul=new Z,Wl=new Z,Gl=new Z,Kl=new Z,ql=new Z,Jl=new Z,Yl=new Z,Xl=new Z;function Zl(e,t,n,r,i,a,o,s,c){c.x=((a-s)*(e-o)+(o-i)*(t-s))/((a-s)*(n-o)+(o-i)*(r-s)),c.y=((s-r)*(e-o)+(n-o)*(t-s))/((a-s)*(n-o)+(o-i)*(r-s)),c.z=1-c.x-c.y}new Z,new Hs,new Z,new Hs,new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Hs,new Z,new Zs,new Hs;var Ql=class{constructor(){this.equations=[]}solve(e,t){return 0}addEquation(e){e.enabled&&!e.bi.isTrigger&&!e.bj.isTrigger&&this.equations.push(e)}removeEquation(e){let t=this.equations,n=t.indexOf(e);n!==-1&&t.splice(n,1)}removeAllEquations(){this.equations.length=0}},$l=class extends Ql{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(e,t){let n=0,r=this.iterations,i=this.tolerance*this.tolerance,a=this.equations,o=a.length,s=t.bodies,c=s.length,l=e,u,d,f,p,m,h;if(o!==0)for(let e=0;e!==c;e++)s[e].updateSolveMassProperties();let g=tu,_=nu,v=eu;g.length=o,_.length=o,v.length=o;for(let e=0;e!==o;e++){let t=a[e];v[e]=0,_[e]=t.computeB(l),g[e]=1/t.computeC()}if(o!==0){for(let e=0;e!==c;e++){let t=s[e],n=t.vlambda,r=t.wlambda;n.set(0,0,0),r.set(0,0,0)}for(n=0;n!==r;n++){p=0;for(let e=0;e!==o;e++){let t=a[e];u=_[e],d=g[e],h=v[e],m=t.computeGWlambda(),f=d*(u-m-t.eps*h),h+f<t.minForce?f=t.minForce-h:h+f>t.maxForce&&(f=t.maxForce-h),v[e]+=f,p+=f>0?f:-f,t.addToWlambda(f)}if(p*p<i)break}for(let e=0;e!==c;e++){let t=s[e],n=t.velocity,r=t.angularVelocity;t.vlambda.vmul(t.linearFactor,t.vlambda),n.vadd(t.vlambda,n),t.wlambda.vmul(t.angularFactor,t.wlambda),r.vadd(t.wlambda,r)}let e=a.length,t=1/l;for(;e--;)a[e].multiplier=v[e]*t}return n}},eu=[],tu=[],nu=[];lc.STATIC;var ru=class{constructor(){this.objects=[],this.type=Object}release(){let e=arguments.length;for(let t=0;t!==e;t++)this.objects.push(t<0||arguments.length<=t?void 0:arguments[t]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw Error(`constructObject() not implemented in this Pool subclass yet!`)}resize(e){let t=this.objects;for(;t.length>e;)t.pop();for(;t.length<e;)t.push(this.constructObject());return this}},iu=class extends ru{constructor(){super(...arguments),this.type=Z}constructObject(){return new Z}},au={sphereSphere:Q.types.SPHERE,spherePlane:Q.types.SPHERE|Q.types.PLANE,boxBox:Q.types.BOX|Q.types.BOX,sphereBox:Q.types.SPHERE|Q.types.BOX,planeBox:Q.types.PLANE|Q.types.BOX,convexConvex:Q.types.CONVEXPOLYHEDRON,sphereConvex:Q.types.SPHERE|Q.types.CONVEXPOLYHEDRON,planeConvex:Q.types.PLANE|Q.types.CONVEXPOLYHEDRON,boxConvex:Q.types.BOX|Q.types.CONVEXPOLYHEDRON,sphereHeightfield:Q.types.SPHERE|Q.types.HEIGHTFIELD,boxHeightfield:Q.types.BOX|Q.types.HEIGHTFIELD,convexHeightfield:Q.types.CONVEXPOLYHEDRON|Q.types.HEIGHTFIELD,sphereParticle:Q.types.PARTICLE|Q.types.SPHERE,planeParticle:Q.types.PLANE|Q.types.PARTICLE,boxParticle:Q.types.BOX|Q.types.PARTICLE,convexParticle:Q.types.PARTICLE|Q.types.CONVEXPOLYHEDRON,cylinderCylinder:Q.types.CYLINDER,sphereCylinder:Q.types.SPHERE|Q.types.CYLINDER,planeCylinder:Q.types.PLANE|Q.types.CYLINDER,boxCylinder:Q.types.BOX|Q.types.CYLINDER,convexCylinder:Q.types.CONVEXPOLYHEDRON|Q.types.CYLINDER,heightfieldCylinder:Q.types.HEIGHTFIELD|Q.types.CYLINDER,particleCylinder:Q.types.PARTICLE|Q.types.CYLINDER,sphereTrimesh:Q.types.SPHERE|Q.types.TRIMESH,planeTrimesh:Q.types.PLANE|Q.types.TRIMESH},ou=class{get[au.sphereSphere](){return this.sphereSphere}get[au.spherePlane](){return this.spherePlane}get[au.boxBox](){return this.boxBox}get[au.sphereBox](){return this.sphereBox}get[au.planeBox](){return this.planeBox}get[au.convexConvex](){return this.convexConvex}get[au.sphereConvex](){return this.sphereConvex}get[au.planeConvex](){return this.planeConvex}get[au.boxConvex](){return this.boxConvex}get[au.sphereHeightfield](){return this.sphereHeightfield}get[au.boxHeightfield](){return this.boxHeightfield}get[au.convexHeightfield](){return this.convexHeightfield}get[au.sphereParticle](){return this.sphereParticle}get[au.planeParticle](){return this.planeParticle}get[au.boxParticle](){return this.boxParticle}get[au.convexParticle](){return this.convexParticle}get[au.cylinderCylinder](){return this.convexConvex}get[au.sphereCylinder](){return this.sphereConvex}get[au.planeCylinder](){return this.planeConvex}get[au.boxCylinder](){return this.boxConvex}get[au.convexCylinder](){return this.convexConvex}get[au.heightfieldCylinder](){return this.heightfieldCylinder}get[au.particleCylinder](){return this.particleCylinder}get[au.sphereTrimesh](){return this.sphereTrimesh}get[au.planeTrimesh](){return this.planeTrimesh}constructor(e){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new iu,this.world=e,this.currentContactMaterial=e.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(e,t,n,r,i,a){let o;this.contactPointPool.length?(o=this.contactPointPool.pop(),o.bi=e,o.bj=t):o=new wl(e,t),o.enabled=e.collisionResponse&&t.collisionResponse&&n.collisionResponse&&r.collisionResponse;let s=this.currentContactMaterial;o.restitution=s.restitution,o.setSpookParams(s.contactEquationStiffness,s.contactEquationRelaxation,this.world.dt);let c=n.material||e.material,l=r.material||t.material;return c&&l&&c.restitution>=0&&l.restitution>=0&&(o.restitution=c.restitution*l.restitution),o.si=i||n,o.sj=a||r,o}createFrictionEquationsFromContact(e,t){let n=e.bi,r=e.bj,i=e.si,a=e.sj,o=this.world,s=this.currentContactMaterial,c=s.friction,l=i.material||n.material,u=a.material||r.material;if(l&&u&&l.friction>=0&&u.friction>=0&&(c=l.friction*u.friction),c>0){let i=c*(o.frictionGravity||o.gravity).length(),a=n.invMass+r.invMass;a>0&&(a=1/a);let l=this.frictionEquationPool,u=l.length?l.pop():new Nl(n,r,i*a),d=l.length?l.pop():new Nl(n,r,i*a);return u.bi=d.bi=n,u.bj=d.bj=r,u.minForce=d.minForce=-i*a,u.maxForce=d.maxForce=i*a,u.ri.copy(e.ri),u.rj.copy(e.rj),d.ri.copy(e.ri),d.rj.copy(e.rj),e.ni.tangents(u.t,d.t),u.setSpookParams(s.frictionEquationStiffness,s.frictionEquationRelaxation,o.dt),d.setSpookParams(s.frictionEquationStiffness,s.frictionEquationRelaxation,o.dt),u.enabled=d.enabled=e.enabled,t.push(u,d),!0}return!1}createFrictionFromAverage(e){let t=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(t,this.frictionResult)||e===1)return;let n=this.frictionResult[this.frictionResult.length-2],r=this.frictionResult[this.frictionResult.length-1];su.setZero(),cu.setZero(),lu.setZero();let i=t.bi;t.bj;for(let n=0;n!==e;n++)t=this.result[this.result.length-1-n],t.bi===i?(su.vsub(t.ni,su),cu.vadd(t.rj,cu),lu.vadd(t.ri,lu)):(su.vadd(t.ni,su),cu.vadd(t.ri,cu),lu.vadd(t.rj,lu));let a=1/e;cu.scale(a,n.ri),lu.scale(a,n.rj),r.ri.copy(n.ri),r.rj.copy(n.rj),su.normalize(),su.tangents(n.t,r.t)}getContacts(e,t,n,r,i,a,o){this.contactPointPool=i,this.frictionEquationPool=o,this.result=r,this.frictionResult=a;let s=fu,c=pu,l=uu,u=du;for(let r=0,i=e.length;r!==i;r++){let i=e[r],a=t[r],o=null;i.material&&a.material&&(o=n.getContactMaterial(i.material,a.material)||null);let d=i.type&lc.KINEMATIC&&a.type&lc.STATIC||i.type&lc.STATIC&&a.type&lc.KINEMATIC||i.type&lc.KINEMATIC&&a.type&lc.KINEMATIC;for(let e=0;e<i.shapes.length;e++){i.quaternion.mult(i.shapeOrientations[e],s),i.quaternion.vmult(i.shapeOffsets[e],l),l.vadd(i.position,l);let t=i.shapes[e];for(let e=0;e<a.shapes.length;e++){a.quaternion.mult(a.shapeOrientations[e],c),a.quaternion.vmult(a.shapeOffsets[e],u),u.vadd(a.position,u);let r=a.shapes[e];if(!(t.collisionFilterMask&r.collisionFilterGroup&&r.collisionFilterMask&t.collisionFilterGroup)||l.distanceTo(u)>t.boundingSphereRadius+r.boundingSphereRadius)continue;let f=null;t.material&&r.material&&(f=n.getContactMaterial(t.material,r.material)||null),this.currentContactMaterial=f||o||n.defaultContactMaterial;let p=t.type|r.type,m=this[p];if(m){let e=!1;e=t.type<r.type?m.call(this,t,r,l,u,s,c,i,a,t,r,d):m.call(this,r,t,u,l,c,s,a,i,t,r,d),e&&d&&(n.shapeOverlapKeeper.set(t.id,r.id),n.bodyOverlapKeeper.set(i.id,a.id))}}}}}sphereSphere(e,t,n,r,i,a,o,s,c,l,u){if(u)return n.distanceSquared(r)<(e.radius+t.radius)**2;let d=this.createContactEquation(o,s,e,t,c,l);r.vsub(n,d.ni),d.ni.normalize(),d.ri.copy(d.ni),d.rj.copy(d.ni),d.ri.scale(e.radius,d.ri),d.rj.scale(-t.radius,d.rj),d.ri.vadd(n,d.ri),d.ri.vsub(o.position,d.ri),d.rj.vadd(r,d.rj),d.rj.vsub(s.position,d.rj),this.result.push(d),this.createFrictionEquationsFromContact(d,this.frictionResult)}spherePlane(e,t,n,r,i,a,o,s,c,l,u){let d=this.createContactEquation(o,s,e,t,c,l);if(d.ni.set(0,0,1),a.vmult(d.ni,d.ni),d.ni.negate(d.ni),d.ni.normalize(),d.ni.scale(e.radius,d.ri),n.vsub(r,Mu),d.ni.scale(d.ni.dot(Mu),Nu),Mu.vsub(Nu,d.rj),-Mu.dot(d.ni)<=e.radius){if(u)return!0;let e=d.ri,t=d.rj;e.vadd(n,e),e.vsub(o.position,e),t.vadd(r,t),t.vsub(s.position,t),this.result.push(d),this.createFrictionEquationsFromContact(d,this.frictionResult)}}boxBox(e,t,n,r,i,a,o,s,c,l,u){return e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,t.convexPolyhedronRepresentation,n,r,i,a,o,s,e,t,u)}sphereBox(e,t,n,r,i,a,o,s,c,l,u){let d=this.v3pool,f=Hu;n.vsub(r,Ru),t.getSideNormals(f,a);let p=e.radius,m=!1,h=Wu,g=Gu,_=Ku,v=null,y=0,b=0,x=0,S=null;for(let e=0,t=f.length;e!==t&&m===!1;e++){let t=zu;t.copy(f[e]);let n=t.length();t.normalize();let r=Ru.dot(t);if(r<n+p&&r>0){let i=Bu,a=Vu;i.copy(f[(e+1)%3]),a.copy(f[(e+2)%3]);let o=i.length(),s=a.length();i.normalize(),a.normalize();let c=Ru.dot(i),l=Ru.dot(a);if(c<o&&c>-o&&l<s&&l>-s){let e=Math.abs(r-n-p);if((S===null||e<S)&&(S=e,b=c,x=l,v=n,h.copy(t),g.copy(i),_.copy(a),y++,u))return!0}}}if(y){m=!0;let i=this.createContactEquation(o,s,e,t,c,l);h.scale(-p,i.ri),i.ni.copy(h),i.ni.negate(i.ni),h.scale(v,h),g.scale(b,g),h.vadd(g,h),_.scale(x,_),h.vadd(_,i.rj),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),i.rj.vadd(r,i.rj),i.rj.vsub(s.position,i.rj),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult)}let C=d.get(),w=Uu;for(let i=0;i!==2&&!m;i++)for(let a=0;a!==2&&!m;a++)for(let d=0;d!==2&&!m;d++)if(C.set(0,0,0),i?C.vadd(f[0],C):C.vsub(f[0],C),a?C.vadd(f[1],C):C.vsub(f[1],C),d?C.vadd(f[2],C):C.vsub(f[2],C),r.vadd(C,w),w.vsub(n,w),w.lengthSquared()<p*p){if(u)return!0;m=!0;let i=this.createContactEquation(o,s,e,t,c,l);i.ri.copy(w),i.ri.normalize(),i.ni.copy(i.ri),i.ri.scale(p,i.ri),i.rj.copy(C),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),i.rj.vadd(r,i.rj),i.rj.vsub(s.position,i.rj),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult)}d.release(C),C=null;let T=d.get(),E=d.get(),D=d.get(),O=d.get(),k=d.get(),A=f.length;for(let i=0;i!==A&&!m;i++)for(let a=0;a!==A&&!m;a++)if(i%3!=a%3){f[a].cross(f[i],T),T.normalize(),f[i].vadd(f[a],E),D.copy(n),D.vsub(E,D),D.vsub(r,D);let d=D.dot(T);T.scale(d,O);let h=0;for(;h===i%3||h===a%3;)h++;k.copy(n),k.vsub(O,k),k.vsub(E,k),k.vsub(r,k);let g=Math.abs(d),_=k.length();if(g<f[h].length()&&_<p){if(u)return!0;m=!0;let i=this.createContactEquation(o,s,e,t,c,l);E.vadd(O,i.rj),i.rj.copy(i.rj),k.negate(i.ni),i.ni.normalize(),i.ri.copy(i.rj),i.ri.vadd(r,i.ri),i.ri.vsub(n,i.ri),i.ri.normalize(),i.ri.scale(p,i.ri),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),i.rj.vadd(r,i.rj),i.rj.vsub(s.position,i.rj),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult)}}d.release(T,E,D,O,k)}planeBox(e,t,n,r,i,a,o,s,c,l,u){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,t.convexPolyhedronRepresentation.id=t.id,this.planeConvex(e,t.convexPolyhedronRepresentation,n,r,i,a,o,s,e,t,u)}convexConvex(e,t,n,r,i,a,o,s,c,l,u,d,f){let p=sd;if(!(n.distanceTo(r)>e.boundingSphereRadius+t.boundingSphereRadius)&&e.findSeparatingAxis(t,n,i,r,a,p,d,f)){let d=[],f=cd;e.clipAgainstHull(n,i,t,r,a,p,-100,100,d);let m=0;for(let i=0;i!==d.length;i++){if(u)return!0;let a=this.createContactEquation(o,s,e,t,c,l),h=a.ri,g=a.rj;p.negate(a.ni),d[i].normal.negate(f),f.scale(d[i].depth,f),d[i].point.vadd(f,h),g.copy(d[i].point),h.vsub(n,h),g.vsub(r,g),h.vadd(n,h),h.vsub(o.position,h),g.vadd(r,g),g.vsub(s.position,g),this.result.push(a),m++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(a,this.frictionResult)}this.enableFrictionReduction&&m&&this.createFrictionFromAverage(m)}}sphereConvex(e,t,n,r,i,a,o,s,c,l,u){let d=this.v3pool;n.vsub(r,qu);let f=t.faceNormals,p=t.faces,m=t.vertices,h=e.radius,g=!1;for(let i=0;i!==m.length;i++){let d=m[i],f=Zu;a.vmult(d,f),r.vadd(f,f);let p=Xu;if(f.vsub(n,p),p.lengthSquared()<h*h){if(u)return!0;g=!0;let i=this.createContactEquation(o,s,e,t,c,l);i.ri.copy(p),i.ri.normalize(),i.ni.copy(i.ri),i.ri.scale(h,i.ri),f.vsub(r,i.rj),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),i.rj.vadd(r,i.rj),i.rj.vsub(s.position,i.rj),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult);return}}for(let i=0,_=p.length;i!==_&&g===!1;i++){let _=f[i],v=p[i],y=Qu;a.vmult(_,y);let b=$u;a.vmult(m[v[0]],b),b.vadd(r,b);let x=ed;y.scale(-h,x),n.vadd(x,x);let S=td;x.vsub(b,S);let C=S.dot(y),w=nd;if(n.vsub(b,w),C<0&&w.dot(y)>0){let i=[];for(let e=0,t=v.length;e!==t;e++){let t=d.get();a.vmult(m[v[e]],t),r.vadd(t,t),i.push(t)}if(Lu(i,y,n)){if(u)return!0;g=!0;let a=this.createContactEquation(o,s,e,t,c,l);y.scale(-h,a.ri),y.negate(a.ni);let f=d.get();y.scale(-C,f);let p=d.get();y.scale(-h,p),n.vsub(r,a.rj),a.rj.vadd(p,a.rj),a.rj.vadd(f,a.rj),a.rj.vadd(r,a.rj),a.rj.vsub(s.position,a.rj),a.ri.vadd(n,a.ri),a.ri.vsub(o.position,a.ri),d.release(f),d.release(p),this.result.push(a),this.createFrictionEquationsFromContact(a,this.frictionResult);for(let e=0,t=i.length;e!==t;e++)d.release(i[e]);return}for(let f=0;f!==v.length;f++){let p=d.get(),g=d.get();a.vmult(m[v[(f+1)%v.length]],p),a.vmult(m[v[(f+2)%v.length]],g),r.vadd(p,p),r.vadd(g,g);let _=Ju;g.vsub(p,_);let y=Yu;_.unit(y);let b=d.get(),x=d.get();n.vsub(p,x);let S=x.dot(y);y.scale(S,b),b.vadd(p,b);let C=d.get();if(b.vsub(n,C),S>0&&S*S<_.lengthSquared()&&C.lengthSquared()<h*h){if(u)return!0;let a=this.createContactEquation(o,s,e,t,c,l);b.vsub(r,a.rj),b.vsub(n,a.ni),a.ni.normalize(),a.ni.scale(h,a.ri),a.rj.vadd(r,a.rj),a.rj.vsub(s.position,a.rj),a.ri.vadd(n,a.ri),a.ri.vsub(o.position,a.ri),this.result.push(a),this.createFrictionEquationsFromContact(a,this.frictionResult);for(let e=0,t=i.length;e!==t;e++)d.release(i[e]);d.release(p),d.release(g),d.release(b),d.release(C),d.release(x);return}d.release(p),d.release(g),d.release(b),d.release(C),d.release(x)}for(let e=0,t=i.length;e!==t;e++)d.release(i[e])}}}planeConvex(e,t,n,r,i,a,o,s,c,l,u){let d=rd,f=id;f.set(0,0,1),i.vmult(f,f);let p=0,m=ad;for(let i=0;i!==t.vertices.length;i++)if(d.copy(t.vertices[i]),a.vmult(d,d),r.vadd(d,d),d.vsub(n,m),f.dot(m)<=0){if(u)return!0;let i=this.createContactEquation(o,s,e,t,c,l),a=od;f.scale(f.dot(m),a),d.vsub(a,a),a.vsub(n,i.ri),i.ni.copy(f),d.vsub(r,i.rj),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),i.rj.vadd(r,i.rj),i.rj.vsub(s.position,i.rj),this.result.push(i),p++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(i,this.frictionResult)}this.enableFrictionReduction&&p&&this.createFrictionFromAverage(p)}boxConvex(e,t,n,r,i,a,o,s,c,l,u){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,t,n,r,i,a,o,s,e,t,u)}sphereHeightfield(e,t,n,r,i,a,o,s,c,l,u){let d=t.data,f=e.radius,p=t.elementSize,m=Sd,h=xd;Zs.pointToLocalFrame(r,a,n,h);let g=Math.floor((h.x-f)/p)-1,_=Math.ceil((h.x+f)/p)+1,v=Math.floor((h.y-f)/p)-1,y=Math.ceil((h.y+f)/p)+1;if(_<0||y<0||g>d.length||v>d[0].length)return;g<0&&(g=0),_<0&&(_=0),v<0&&(v=0),y<0&&(y=0),g>=d.length&&(g=d.length-1),_>=d.length&&(_=d.length-1),y>=d[0].length&&(y=d[0].length-1),v>=d[0].length&&(v=d[0].length-1);let b=[];t.getRectMinMax(g,v,_,y,b);let x=b[0],S=b[1];if(h.z-f>S||h.z+f<x)return;let C=this.result;for(let c=g;c<_;c++)for(let l=v;l<y;l++){let d=C.length,f=!1;if(t.getConvexTrianglePillar(c,l,!1),Zs.pointToWorldFrame(r,a,t.pillarOffset,m),n.distanceTo(m)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(f=this.sphereConvex(e,t.pillarConvex,n,m,i,a,o,s,e,t,u)),u&&f||(t.getConvexTrianglePillar(c,l,!0),Zs.pointToWorldFrame(r,a,t.pillarOffset,m),n.distanceTo(m)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(f=this.sphereConvex(e,t.pillarConvex,n,m,i,a,o,s,e,t,u)),u&&f))return!0;if(C.length-d>2)return}}boxHeightfield(e,t,n,r,i,a,o,s,c,l,u){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexHeightfield(e.convexPolyhedronRepresentation,t,n,r,i,a,o,s,e,t,u)}convexHeightfield(e,t,n,r,i,a,o,s,c,l,u){let d=t.data,f=t.elementSize,p=e.boundingSphereRadius,m=yd,h=bd,g=vd;Zs.pointToLocalFrame(r,a,n,g);let _=Math.floor((g.x-p)/f)-1,v=Math.ceil((g.x+p)/f)+1,y=Math.floor((g.y-p)/f)-1,b=Math.ceil((g.y+p)/f)+1;if(v<0||b<0||_>d.length||y>d[0].length)return;_<0&&(_=0),v<0&&(v=0),y<0&&(y=0),b<0&&(b=0),_>=d.length&&(_=d.length-1),v>=d.length&&(v=d.length-1),b>=d[0].length&&(b=d[0].length-1),y>=d[0].length&&(y=d[0].length-1);let x=[];t.getRectMinMax(_,y,v,b,x);let S=x[0],C=x[1];if(!(g.z-p>C||g.z+p<S))for(let c=_;c<v;c++)for(let l=y;l<b;l++){let d=!1;if(t.getConvexTrianglePillar(c,l,!1),Zs.pointToWorldFrame(r,a,t.pillarOffset,m),n.distanceTo(m)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(d=this.convexConvex(e,t.pillarConvex,n,m,i,a,o,s,null,null,u,h,null)),u&&d||(t.getConvexTrianglePillar(c,l,!0),Zs.pointToWorldFrame(r,a,t.pillarOffset,m),n.distanceTo(m)<t.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&(d=this.convexConvex(e,t.pillarConvex,n,m,i,a,o,s,null,null,u,h,null)),u&&d))return!0}}sphereParticle(e,t,n,r,i,a,o,s,c,l,u){let d=fd;if(d.set(0,0,1),r.vsub(n,d),d.lengthSquared()<=e.radius*e.radius){if(u)return!0;let n=this.createContactEquation(s,o,t,e,c,l);d.normalize(),n.rj.copy(d),n.rj.scale(e.radius,n.rj),n.ni.copy(d),n.ni.negate(n.ni),n.ri.set(0,0,0),this.result.push(n),this.createFrictionEquationsFromContact(n,this.frictionResult)}}planeParticle(e,t,n,r,i,a,o,s,c,l,u){let d=ld;d.set(0,0,1),o.quaternion.vmult(d,d);let f=ud;if(r.vsub(o.position,f),d.dot(f)<=0){if(u)return!0;let n=this.createContactEquation(s,o,t,e,c,l);n.ni.copy(d),n.ni.negate(n.ni),n.ri.set(0,0,0);let i=dd;d.scale(d.dot(r),i),r.vsub(i,i),n.rj.copy(i),this.result.push(n),this.createFrictionEquationsFromContact(n,this.frictionResult)}}boxParticle(e,t,n,r,i,a,o,s,c,l,u){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexParticle(e.convexPolyhedronRepresentation,t,n,r,i,a,o,s,e,t,u)}convexParticle(e,t,n,r,i,a,o,s,c,l,u){let d=-1,f=hd,p=_d,m=null,h=md;if(h.copy(r),h.vsub(n,h),i.conjugate(pd),pd.vmult(h,h),e.pointIsInside(h)){e.worldVerticesNeedsUpdate&&e.computeWorldVertices(n,i),e.worldFaceNormalsNeedsUpdate&&e.computeWorldFaceNormals(i);for(let t=0,n=e.faces.length;t!==n;t++){let n=[e.worldVertices[e.faces[t][0]]],i=e.worldFaceNormals[t];r.vsub(n[0],gd);let a=-i.dot(gd);if(m===null||Math.abs(a)<Math.abs(m)){if(u)return!0;m=a,d=t,f.copy(i)}}if(d!==-1){let i=this.createContactEquation(s,o,t,e,c,l);f.scale(m,p),p.vadd(r,p),p.vsub(n,p),i.rj.copy(p),f.negate(i.ni),i.ri.set(0,0,0);let a=i.ri,u=i.rj;a.vadd(r,a),a.vsub(s.position,a),u.vadd(n,u),u.vsub(o.position,u),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult)}else console.warn(`Point found inside convex, but did not find penetrating face!`)}}heightfieldCylinder(e,t,n,r,i,a,o,s,c,l,u){return this.convexHeightfield(t,e,r,n,a,i,s,o,c,l,u)}particleCylinder(e,t,n,r,i,a,o,s,c,l,u){return this.convexParticle(t,e,r,n,a,i,s,o,c,l,u)}sphereTrimesh(e,t,n,r,i,a,o,s,c,l,u){let d=xu,f=Su,p=Cu,m=wu,h=Tu,g=Eu,_=Au,v=bu,y=vu,b=ju;Zs.pointToLocalFrame(r,a,n,h);let x=e.radius;_.lowerBound.set(h.x-x,h.y-x,h.z-x),_.upperBound.set(h.x+x,h.y+x,h.z+x),t.getTrianglesInAABB(_,b);let S=yu,C=e.radius*e.radius;for(let i=0;i<b.length;i++)for(let d=0;d<3;d++)if(t.getVertex(t.indices[b[i]*3+d],S),S.vsub(h,y),y.lengthSquared()<=C){if(v.copy(S),Zs.pointToWorldFrame(r,a,v,S),S.vsub(n,y),u)return!0;let i=this.createContactEquation(o,s,e,t,c,l);i.ni.copy(y),i.ni.normalize(),i.ri.copy(i.ni),i.ri.scale(e.radius,i.ri),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),i.rj.copy(S),i.rj.vsub(s.position,i.rj),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult)}for(let i=0;i<b.length;i++)for(let _=0;_<3;_++){t.getVertex(t.indices[b[i]*3+_],d),t.getVertex(t.indices[b[i]*3+(_+1)%3],f),f.vsub(d,p),h.vsub(f,g);let v=g.dot(p);h.vsub(d,g);let y=g.dot(p);if(y>0&&v<0&&(h.vsub(d,g),m.copy(p),m.normalize(),y=g.dot(m),m.scale(y,g),g.vadd(d,g),g.distanceTo(h)<e.radius)){if(u)return!0;let i=this.createContactEquation(o,s,e,t,c,l);g.vsub(h,i.ni),i.ni.normalize(),i.ni.scale(e.radius,i.ri),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),Zs.pointToWorldFrame(r,a,g,g),g.vsub(s.position,i.rj),Zs.vectorToWorldFrame(a,i.ni,i.ni),Zs.vectorToWorldFrame(a,i.ri,i.ri),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult)}}let w=Du,T=Ou,E=ku,D=_u;for(let i=0,d=b.length;i!==d;i++){t.getTriangleVertices(b[i],w,T,E),t.getNormal(b[i],D),h.vsub(w,g);let d=g.dot(D);if(D.scale(d,g),h.vsub(g,g),d=g.distanceTo(h),Rc.pointInTriangle(g,w,T,E)&&d<e.radius){if(u)return!0;let i=this.createContactEquation(o,s,e,t,c,l);g.vsub(h,i.ni),i.ni.normalize(),i.ni.scale(e.radius,i.ri),i.ri.vadd(n,i.ri),i.ri.vsub(o.position,i.ri),Zs.pointToWorldFrame(r,a,g,g),g.vsub(s.position,i.rj),Zs.vectorToWorldFrame(a,i.ni,i.ni),Zs.vectorToWorldFrame(a,i.ri,i.ri),this.result.push(i),this.createFrictionEquationsFromContact(i,this.frictionResult)}}b.length=0}planeTrimesh(e,t,n,r,i,a,o,s,c,l,u){let d=new Z,f=mu;f.set(0,0,1),i.vmult(f,f);for(let i=0;i<t.vertices.length/3;i++){t.getVertex(i,d);let p=new Z;p.copy(d),Zs.pointToWorldFrame(r,a,p,d);let m=hu;if(d.vsub(n,m),f.dot(m)<=0){if(u)return!0;let n=this.createContactEquation(o,s,e,t,c,l);n.ni.copy(f);let r=gu;f.scale(m.dot(f),r),d.vsub(r,r),n.ri.copy(r),n.ri.vsub(o.position,n.ri),n.rj.copy(d),n.rj.vsub(s.position,n.rj),this.result.push(n),this.createFrictionEquationsFromContact(n,this.frictionResult)}}}},su=new Z,cu=new Z,lu=new Z,uu=new Z,du=new Z,fu=new qs,pu=new qs,mu=new Z,hu=new Z,gu=new Z,_u=new Z,vu=new Z;new Z;var yu=new Z,bu=new Z,xu=new Z,Su=new Z,Cu=new Z,wu=new Z,Tu=new Z,Eu=new Z,Du=new Z,Ou=new Z,ku=new Z,Au=new Hs,ju=[],Mu=new Z,Nu=new Z,Pu=new Z,Fu=new Z,Iu=new Z;function Lu(e,t,n){let r=null,i=e.length;for(let a=0;a!==i;a++){let o=e[a],s=Pu;e[(a+1)%i].vsub(o,s);let c=Fu;s.cross(t,c);let l=Iu;n.vsub(o,l);let u=c.dot(l);if(r===null||u>0&&r===!0||u<=0&&r===!1)r===null&&(r=u>0);else return!1}return!0}var Ru=new Z,zu=new Z,Bu=new Z,Vu=new Z,Hu=[new Z,new Z,new Z,new Z,new Z,new Z],Uu=new Z,Wu=new Z,Gu=new Z,Ku=new Z,qu=new Z,Ju=new Z,Yu=new Z,Xu=new Z,Zu=new Z,Qu=new Z,$u=new Z,ed=new Z,td=new Z,nd=new Z;new Z,new Z;var rd=new Z,id=new Z,ad=new Z,od=new Z,sd=new Z,cd=new Z,ld=new Z,ud=new Z,dd=new Z,fd=new Z,pd=new qs,md=new Z;new Z;var hd=new Z,gd=new Z,_d=new Z,vd=new Z,yd=new Z,bd=[0],xd=new Z,Sd=new Z,Cd=class{constructor(){this.current=[],this.previous=[]}getKey(e,t){if(t<e){let n=t;t=e,e=n}return e<<16|t}set(e,t){let n=this.getKey(e,t),r=this.current,i=0;for(;n>r[i];)i++;if(n!==r[i]){for(let e=r.length-1;e>=i;e--)r[e+1]=r[e];r[i]=n}}tick(){let e=this.current;this.current=this.previous,this.previous=e,this.current.length=0}getDiff(e,t){let n=this.current,r=this.previous,i=n.length,a=r.length,o=0;for(let t=0;t<i;t++){let i=!1,a=n[t];for(;a>r[o];)o++;i=a===r[o],i||wd(e,a)}o=0;for(let e=0;e<a;e++){let i=!1,a=r[e];for(;a>n[o];)o++;i=n[o]===a,i||wd(t,a)}}};function wd(e,t){e.push((t&4294901760)>>16,t&65535)}var Td=(e,t)=>e<t?`${e}-${t}`:`${t}-${e}`,Ed=class{constructor(){this.data={keys:[]}}get(e,t){let n=Td(e,t);return this.data[n]}set(e,t,n){let r=Td(e,t);this.get(e,t)||this.data.keys.push(r),this.data[r]=n}delete(e,t){let n=Td(e,t),r=this.data.keys.indexOf(n);r!==-1&&this.data.keys.splice(r,1),delete this.data[n]}reset(){let e=this.data,t=e.keys;for(;t.length>0;){let n=t.pop();delete e[n]}}},Dd=class extends Ks{constructor(e){e===void 0&&(e={}),super(),this.dt=-1,this.allowSleep=!!e.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=e.quatNormalizeSkip===void 0?0:e.quatNormalizeSkip,this.quatNormalizeFast=e.quatNormalizeFast!==void 0&&e.quatNormalizeFast,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new Z,e.gravity&&this.gravity.copy(e.gravity),e.frictionGravity&&(this.frictionGravity=new Z,this.frictionGravity.copy(e.frictionGravity)),this.broadphase=e.broadphase===void 0?new Oc:e.broadphase,this.bodies=[],this.hasActiveBodies=!1,this.solver=e.solver===void 0?new $l:e.solver,this.constraints=[],this.narrowphase=new ou(this),this.collisionMatrix=new Gs,this.collisionMatrixPrevious=new Gs,this.bodyOverlapKeeper=new Cd,this.shapeOverlapKeeper=new Cd,this.contactmaterials=[],this.contactMaterialTable=new Ed,this.defaultMaterial=new Ll(`default`),this.defaultContactMaterial=new Il(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:`addBody`,body:null},this.removeBodyEvent={type:`removeBody`,body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(e,t){return this.contactMaterialTable.get(e.id,t.id)}collisionMatrixTick(){let e=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=e,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(e){this.constraints.push(e)}removeConstraint(e){let t=this.constraints.indexOf(e);t!==-1&&this.constraints.splice(t,1)}rayTest(e,t,n){n instanceof kc?this.raycastClosest(e,t,{skipBackfaces:!0},n):this.raycastAll(e,t,{skipBackfaces:!0},n)}raycastAll(e,t,n,r){return n===void 0&&(n={}),n.mode=Rc.ALL,n.from=e,n.to=t,n.callback=r,Od.intersectWorld(this,n)}raycastAny(e,t,n,r){return n===void 0&&(n={}),n.mode=Rc.ANY,n.from=e,n.to=t,n.result=r,Od.intersectWorld(this,n)}raycastClosest(e,t,n,r){return n===void 0&&(n={}),n.mode=Rc.CLOSEST,n.from=e,n.to=t,n.result=r,Od.intersectWorld(this,n)}addBody(e){this.bodies.includes(e)||(e.index=this.bodies.length,this.bodies.push(e),e.world=this,e.initPosition.copy(e.position),e.initVelocity.copy(e.velocity),e.timeLastSleepy=this.time,e instanceof lc&&(e.initAngularVelocity.copy(e.angularVelocity),e.initQuaternion.copy(e.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=e,this.idToBodyMap[e.id]=e,this.dispatchEvent(this.addBodyEvent))}removeBody(e){e.world=null;let t=this.bodies.length-1,n=this.bodies,r=n.indexOf(e);if(r!==-1){n.splice(r,1);for(let e=0;e!==n.length;e++)n[e].index=e;this.collisionMatrix.setNumObjects(t),this.removeBodyEvent.body=e,delete this.idToBodyMap[e.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(e){return this.idToBodyMap[e]}getShapeById(e){let t=this.bodies;for(let n=0;n<t.length;n++){let r=t[n].shapes;for(let t=0;t<r.length;t++){let n=r[t];if(n.id===e)return n}}return null}addContactMaterial(e){this.contactmaterials.push(e),this.contactMaterialTable.set(e.materials[0].id,e.materials[1].id,e)}removeContactMaterial(e){let t=this.contactmaterials.indexOf(e);t!==-1&&(this.contactmaterials.splice(t,1),this.contactMaterialTable.delete(e.materials[0].id,e.materials[1].id))}fixedStep(e,t){e===void 0&&(e=1/60),t===void 0&&(t=10);let n=kd.now()/1e3;if(!this.lastCallTime)this.step(e,void 0,t);else{let r=n-this.lastCallTime;this.step(e,r,t)}this.lastCallTime=n}step(e,t,n){if(n===void 0&&(n=10),t===void 0)this.internalStep(e),this.time+=e;else{this.accumulator+=t;let r=kd.now(),i=0;for(;this.accumulator>=e&&i<n&&(this.internalStep(e),this.accumulator-=e,i++,!(kd.now()-r>e*1e3)););this.accumulator%=e;let a=this.accumulator/e;for(let e=0;e!==this.bodies.length;e++){let t=this.bodies[e];t.previousPosition.lerp(t.position,a,t.interpolatedPosition),t.previousQuaternion.slerp(t.quaternion,a,t.interpolatedQuaternion),t.previousQuaternion.normalize()}this.time+=t}}internalStep(e){this.dt=e;let t=this.contacts,n=Fd,r=Id,i=this.bodies.length,a=this.bodies,o=this.solver,s=this.gravity,c=this.doProfiling,l=this.profile,u=lc.DYNAMIC,d=-1/0,f=this.constraints,p=Pd;s.length();let m=s.x,h=s.y,g=s.z,_=0;for(c&&(d=kd.now()),_=0;_!==i;_++){let e=a[_];if(e.type===u){let t=e.force,n=e.mass;t.x+=n*m,t.y+=n*h,t.z+=n*g}}for(let e=0,t=this.subsystems.length;e!==t;e++)this.subsystems[e].update();c&&(d=kd.now()),n.length=0,r.length=0,this.broadphase.collisionPairs(this,n,r),c&&(l.broadphase=kd.now()-d);let v=f.length;for(_=0;_!==v;_++){let e=f[_];if(!e.collideConnected)for(let t=n.length-1;t>=0;--t)(e.bodyA===n[t]&&e.bodyB===r[t]||e.bodyB===n[t]&&e.bodyA===r[t])&&(n.splice(t,1),r.splice(t,1))}this.collisionMatrixTick(),c&&(d=kd.now());let y=Nd,b=t.length;for(_=0;_!==b;_++)y.push(t[_]);t.length=0;let x=this.frictionEquations.length;for(_=0;_!==x;_++)p.push(this.frictionEquations[_]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,r,this,t,y,this.frictionEquations,p),c&&(l.narrowphase=kd.now()-d),c&&(d=kd.now()),_=0;_<this.frictionEquations.length;_++)o.addEquation(this.frictionEquations[_]);let S=t.length;for(let e=0;e!==S;e++){let n=t[e],r=n.bi,i=n.bj,a=n.si,s=n.sj,c;c=r.material&&i.material&&this.getContactMaterial(r.material,i.material)||this.defaultContactMaterial,c.friction,r.material&&i.material&&(r.material.friction>=0&&i.material.friction>=0&&r.material.friction*i.material.friction,r.material.restitution>=0&&i.material.restitution>=0&&(n.restitution=r.material.restitution*i.material.restitution)),o.addEquation(n),r.allowSleep&&r.type===lc.DYNAMIC&&r.sleepState===lc.SLEEPING&&i.sleepState===lc.AWAKE&&i.type!==lc.STATIC&&i.velocity.lengthSquared()+i.angularVelocity.lengthSquared()>=i.sleepSpeedLimit**2*2&&(r.wakeUpAfterNarrowphase=!0),i.allowSleep&&i.type===lc.DYNAMIC&&i.sleepState===lc.SLEEPING&&r.sleepState===lc.AWAKE&&r.type!==lc.STATIC&&r.velocity.lengthSquared()+r.angularVelocity.lengthSquared()>=r.sleepSpeedLimit**2*2&&(i.wakeUpAfterNarrowphase=!0),this.collisionMatrix.set(r,i,!0),this.collisionMatrixPrevious.get(r,i)||(Md.body=i,Md.contact=n,r.dispatchEvent(Md),Md.body=r,i.dispatchEvent(Md)),this.bodyOverlapKeeper.set(r.id,i.id),this.shapeOverlapKeeper.set(a.id,s.id)}for(this.emitContactEvents(),c&&(l.makeContactConstraints=kd.now()-d,d=kd.now()),_=0;_!==i;_++){let e=a[_];e.wakeUpAfterNarrowphase&&(e.wakeUp(),e.wakeUpAfterNarrowphase=!1)}for(v=f.length,_=0;_!==v;_++){let e=f[_];e.update();for(let t=0,n=e.equations.length;t!==n;t++){let n=e.equations[t];o.addEquation(n)}}o.solve(e,this),c&&(l.solve=kd.now()-d),o.removeAllEquations();let C=Math.pow;for(_=0;_!==i;_++){let t=a[_];if(t.type&u){let n=C(1-t.linearDamping,e),r=t.velocity;r.scale(n,r);let i=t.angularVelocity;if(i){let n=C(1-t.angularDamping,e);i.scale(n,i)}}}this.dispatchEvent(jd),c&&(d=kd.now());let w=this.stepnumber%(this.quatNormalizeSkip+1)===0,T=this.quatNormalizeFast;for(_=0;_!==i;_++)a[_].integrate(e,w,T);this.clearForces(),this.broadphase.dirty=!0,c&&(l.integrate=kd.now()-d),this.stepnumber+=1,this.dispatchEvent(Ad);let E=!0;if(this.allowSleep)for(E=!1,_=0;_!==i;_++){let e=a[_];e.sleepTick(this.time),e.sleepState!==lc.SLEEPING&&(E=!0)}this.hasActiveBodies=E}emitContactEvents(){let e=this.hasAnyEventListener(`beginContact`),t=this.hasAnyEventListener(`endContact`);if((e||t)&&this.bodyOverlapKeeper.getDiff(Ld,Rd),e){for(let e=0,t=Ld.length;e<t;e+=2)zd.bodyA=this.getBodyById(Ld[e]),zd.bodyB=this.getBodyById(Ld[e+1]),this.dispatchEvent(zd);zd.bodyA=zd.bodyB=null}if(t){for(let e=0,t=Rd.length;e<t;e+=2)Bd.bodyA=this.getBodyById(Rd[e]),Bd.bodyB=this.getBodyById(Rd[e+1]),this.dispatchEvent(Bd);Bd.bodyA=Bd.bodyB=null}Ld.length=Rd.length=0;let n=this.hasAnyEventListener(`beginShapeContact`),r=this.hasAnyEventListener(`endShapeContact`);if((n||r)&&this.shapeOverlapKeeper.getDiff(Ld,Rd),n){for(let e=0,t=Ld.length;e<t;e+=2){let t=this.getShapeById(Ld[e]),n=this.getShapeById(Ld[e+1]);Vd.shapeA=t,Vd.shapeB=n,t&&(Vd.bodyA=t.body),n&&(Vd.bodyB=n.body),this.dispatchEvent(Vd)}Vd.bodyA=Vd.bodyB=Vd.shapeA=Vd.shapeB=null}if(r){for(let e=0,t=Rd.length;e<t;e+=2){let t=this.getShapeById(Rd[e]),n=this.getShapeById(Rd[e+1]);Hd.shapeA=t,Hd.shapeB=n,t&&(Hd.bodyA=t.body),n&&(Hd.bodyB=n.body),this.dispatchEvent(Hd)}Hd.bodyA=Hd.bodyB=Hd.shapeA=Hd.shapeB=null}}clearForces(){let e=this.bodies,t=e.length;for(let n=0;n!==t;n++){let t=e[n];t.force,t.torque,t.force.set(0,0,0),t.torque.set(0,0,0)}}};new Hs;var Od=new Rc,kd=globalThis.performance||{};if(!kd.now){let e=Date.now();kd.timing&&kd.timing.navigationStart&&(e=kd.timing.navigationStart),kd.now=()=>Date.now()-e}new Z;var Ad={type:`postStep`},jd={type:`preStep`},Md={type:lc.COLLIDE_EVENT_NAME,body:null,contact:null},Nd=[],Pd=[],Fd=[],Id=[],Ld=[],Rd=[],zd={type:`beginContact`,bodyA:null,bodyB:null},Bd={type:`endContact`,bodyA:null,bodyB:null},Vd={type:`beginShapeContact`,bodyA:null,bodyB:null,shapeA:null,shapeB:null},Hd={type:`endShapeContact`,bodyA:null,bodyB:null,shapeA:null,shapeB:null},Ud=class{constructor(){let e=this.world=new Dd({gravity:new Z(0,-9.82,0)});e.broadphase=new ml(e),e.allowSleep=!0,e.solver.iterations=8,this.defaultMat=new Ll(`default`),e.defaultContactMaterial.friction=.45,e.defaultContactMaterial.restitution=.25,this.items=[],this.onImpact=null}addStaticBox(e){let t=new Z((e.max.x-e.min.x)/2,(e.max.y-e.min.y)/2,(e.max.z-e.min.z)/2);if(t.x<=0||t.y<=0||t.z<=0)return null;let n=new lc({mass:0,shape:new ic(t)});return n.position.set((e.max.x+e.min.x)/2,(e.max.y+e.min.y)/2,(e.max.z+e.min.z)/2),this.world.addBody(n),e.body=n,n}setBoxEnabled(e,t){if(!e.body)return;let n=this.world.bodies.includes(e.body);t&&!n?this.world.addBody(e.body):!t&&n&&this.world.removeBody(e.body)}addTerrain(e,t,n,r,i=1){let a=Math.floor(r/i)+1,o=t-r/2,s=n+r/2,c=[];for(let t=0;t<a;t++){let n=[];for(let r=0;r<a;r++)n.push(e.heightAt(o+t*i,s-r*i));c.push(n)}let l=new Bl(c,{elementSize:i}),u=new lc({mass:0});u.addShape(l),u.quaternion.setFromEuler(-Math.PI/2,0,0),u.position.set(o,0,s),this.world.addBody(u)}addCylinder(e){let t=new lc({mass:0,shape:new zl(e.r,e.r,e.y1-e.y0,8)});t.position.set(e.x,(e.y0+e.y1)/2,e.z),this.world.addBody(t)}addItem(e,{mass:t=.5,shape:n=`box`,sound:r=`wood`}={}){e.updateWorldMatrix(!0,!1);let i=e.geometry,a;if(i)i.computeBoundingBox(),a=i.boundingBox.clone();else{a=new Ae().setFromObject(e);let t=new yt().copy(e.matrixWorld).invert();a.applyMatrix4(t)}let o=a.getSize(new b).multiply(e.scale),s=a.getCenter(new b).multiply(e.scale),c;c=n===`sphere`?new Rl(Math.max(o.x,o.y,o.z)/2):n===`cylinder`?new zl(o.x/2,o.x/2,o.y,10):new ic(new Z(o.x/2,o.y/2,o.z/2));let u=new lc({mass:t,linearDamping:.05,angularDamping:.15,sleepSpeedLimit:.15,sleepTimeLimit:.6});u.addShape(c,new Z(s.x,s.y,s.z));let d=new b,f=new l;e.getWorldPosition(d),e.getWorldQuaternion(f),u.position.set(d.x,d.y,d.z),u.quaternion.set(f.x,f.y,f.z,f.w),e.parent&&e.parent.type!==`Scene`&&(()=>{let t=e;for(;t.parent;)t=t.parent;return t})().attach(e);let p={mesh:e,body:u,sound:r,held:!1,lastImpact:0,size:o.length()};return u.addEventListener(`collide`,e=>{let t=Math.abs(e.contact.getImpactVelocityAlongNormal()),n=performance.now();t>.6&&n-p.lastImpact>90&&(p.lastImpact=n,this.onImpact?.(p,t))}),u.sleep(),this.world.addBody(u),this.items.push(p),e.userData.item=p,p}step(e){this.world.step(1/60,e,3);for(let e of this.items)e.held||(e.mesh.position.copy(e.body.position),e.mesh.quaternion.copy(e.body.quaternion),e.body.position.y<-30&&(e.body.position.set(0,3,0),e.body.velocity.set(0,0,0)))}},Wd=class{constructor(e,t){this.dom=e,this.ui=t,this.keys=new Set,this.look={x:0,y:0},this.move={x:0,y:0},this.pressed=new Set,this.mouse={left:!1,right:!1},this.wheel=0,this.locked=!1,this.enabled=!0,this.touch=Le,this.stick=null,this.lookTouch=null,addEventListener(`keydown`,e=>{this.enabled&&(e.code===`Tab`&&e.preventDefault(),this.keys.has(e.code)||this.pressed.add(e.code),this.keys.add(e.code))}),addEventListener(`keyup`,e=>this.keys.delete(e.code)),addEventListener(`blur`,()=>{this.keys.clear(),this.mouse.left=this.mouse.right=!1}),this.lastTouch=0;let n=e.parentElement||e;if(n.addEventListener(`mousedown`,e=>{performance.now()-this.lastTouch<800||e.target.closest&&e.target.closest(`button, select, input, #menu`)||(this.locked?(e.button===0&&(this.mouse.left=!0,this.pressed.add(`Mouse0`)),e.button===2&&(this.mouse.right=!0,this.pressed.add(`Mouse2`))):this.requestLock())}),addEventListener(`mouseup`,e=>{e.button===0&&(this.mouse.left=!1),e.button===2&&(this.mouse.right=!1)}),n.addEventListener(`contextmenu`,e=>e.preventDefault()),addEventListener(`mousemove`,e=>{this.locked&&(this.look.x+=e.movementX,this.look.y+=e.movementY)}),n.addEventListener(`wheel`,e=>{this.wheel+=Math.sign(e.deltaY)},{passive:!0}),document.addEventListener(`pointerlockchange`,()=>{this.locked=document.pointerLockElement===e,this.locked||(this.keys.clear(),this.onUnlock?.())}),this.touch)this.setupTouch();else{let e=()=>{removeEventListener(`touchstart`,e,!0),this.touch||(this.touch=!0,this.exitLock(),this.setupTouch(),this.onTouchMode?.())};addEventListener(`touchstart`,e,!0)}addEventListener(`touchstart`,()=>this.lastTouch=performance.now(),{capture:!0,passive:!0})}requestLock(){if(!this.touch)try{let e=this.dom.requestPointerLock({unadjustedMovement:!0});e&&e.catch&&e.catch(()=>this.dom.requestPointerLock())}catch{this.dom.requestPointerLock()}}exitLock(){document.pointerLockElement&&document.exitPointerLock()}setupTouch(){let e=document.getElementById(`touch-layer`);e.hidden=!1;let t=document.getElementById(`stick`),n=document.getElementById(`stick-knob`);e.addEventListener(`touchstart`,e=>{for(let r of e.changedTouches)r.target.closest(`.tbtn`)||(r.clientX<innerWidth*.42&&!this.stick?(this.stick={id:r.identifier,x:r.clientX,y:r.clientY},t.style.left=r.clientX+`px`,t.style.top=r.clientY+`px`,t.classList.add(`on`),n.style.transform=`translate(-50%,-50%)`):this.lookTouch||(this.lookTouch={id:r.identifier,x:r.clientX,y:r.clientY,t0:performance.now(),moved:0}));e.cancelable&&e.preventDefault()},{passive:!1}),e.addEventListener(`touchmove`,e=>{for(let t of e.changedTouches)if(this.stick&&t.identifier===this.stick.id){let e=t.clientX-this.stick.x,r=t.clientY-this.stick.y,i=Math.hypot(e,r);i>55&&(e*=55/i,r*=55/i),this.move.x=e/55,this.move.y=-r/55,n.style.transform=`translate(calc(-50% + ${e}px), calc(-50% + ${r}px))`}else if(this.lookTouch&&t.identifier===this.lookTouch.id){let e=t.clientX-this.lookTouch.x,n=t.clientY-this.lookTouch.y;this.look.x+=e*2.2,this.look.y+=n*2.2,this.lookTouch.moved+=Math.abs(e)+Math.abs(n),this.lookTouch.x=t.clientX,this.lookTouch.y=t.clientY}e.cancelable&&e.preventDefault()},{passive:!1});let r=e=>{for(let n of e.changedTouches)this.stick&&n.identifier===this.stick.id&&(this.stick=null,this.move.x=this.move.y=0,t.classList.remove(`on`)),this.lookTouch&&n.identifier===this.lookTouch.id&&(this.lookTouch.moved<10&&performance.now()-this.lookTouch.t0<250&&this.pressed.add(`Tap`),this.lookTouch=null)};e.addEventListener(`touchend`,r),e.addEventListener(`touchcancel`,r);let i=(e,t,n)=>{let r=document.getElementById(e);r.addEventListener(`touchstart`,e=>{e.preventDefault(),e.stopPropagation(),this.pressed.add(t),n&&this.keys.add(t),r.classList.add(`down`)},{passive:!1}),r.addEventListener(`touchend`,e=>{e.preventDefault(),this.keys.delete(t),r.classList.remove(`down`)})};i(`tb-use`,`KeyE`),i(`tb-jump`,`Space`),i(`tb-crouch`,`KeyC`),i(`tb-light`,`KeyF`),i(`tb-run`,`ShiftLeft`,!0),i(`tb-drop`,`KeyQ`),i(`tb-throw`,`Mouse0`),i(`tb-inspect`,`KeyR`,!0),i(`tb-menu`,`Escape`),i(`tb-view`,`KeyV`),i(`tb-music`,`KeyM`)}down(e){return this.keys.has(e)}hit(e){return this.pressed.has(e)}axis(){let e=this.move.x,t=this.move.y;(this.keys.has(`KeyW`)||this.keys.has(`ArrowUp`))&&(t+=1),(this.keys.has(`KeyS`)||this.keys.has(`ArrowDown`))&&--t,(this.keys.has(`KeyD`)||this.keys.has(`ArrowRight`))&&(e+=1),(this.keys.has(`KeyA`)||this.keys.has(`ArrowLeft`))&&--e;let n=Math.hypot(e,t);return n>1&&(e/=n,t/=n),{x:e,y:t,mag:Math.min(1,n)}}endFrame(){this.pressed.clear(),this.look.x=this.look.y=0,this.wheel=0}},Gd=1.72,Kd=1.12,qd=.27,Jd=.42,Yd=new b,Xd=class{constructor(e,t,n,r,i,a){this.camera=e,this.input=t,this.terrain=n,this.col=r,this.audio=i,this.settings=a,this.pos=new b(-1,0,9),this.vel=new b,this.yaw=0,this.pitch=0,this.height=Gd,this.crouching=!1,this.onGround=!0,this.mode=`walk`,this.travel=0,this.lastStep=0,this.eyeY=this.pos.y+Gd-.1,this.bob=new W,this.seat=null,this.surface=`grass`,this.fovTarget=a.fov,this.zoom=1,e.rotation.order=`YXZ`,this.flashlight=new E(16773596,0,32,.45,.55,1.6),this.flashlight.position.set(.18,-.2,0),this.flashlight.target.position.set(0,-.3,-5),this.flashlight.castShadow=!1,e.add(this.flashlight,this.flashlight.target),this.flashOn=!1,this.swimming=!1,this.swimPhase=0,this.stepLen=1.25,this.speedH=0,this.onSplash=null,this.onStroke=null,this.view=`first`,this.eyePos=new b,this.occluders=[],this.camDist=3.2,this.dive=0,this.diving=!1,this.tpRay=new rt}toggleView(){this.view=this.view===`first`?`third`:`first`,this.camDist=1}placeThirdPerson(e){let t=this.camera,n=this.eyePos,r=this.mode===`seat`&&this.seat?.lie,i=r?.9:Math.max(-.9,Math.min(.55,this.pitch)),a=r?this.seat.yaw+Math.PI:this.yaw,o=Yd.set(-Math.sin(a)*Math.cos(i),Math.sin(i),-Math.cos(a)*Math.cos(i)),s=new b(Math.cos(a),0,-Math.sin(a)),c=r?2.2:3,l=o.clone().negate().multiplyScalar(c).addScaledVector(s,r?0:.45).add(new b(0,r?1.2:.3,0)),u=l.length();l.normalize(),this.tpRay.set(n,l),this.tpRay.far=u;let d=this.tpRay.intersectObjects(this.occluders,!0)[0],f=d?Math.max(.35,d.distance-.25):u;this.camDist+=(f-this.camDist)*Math.min(1,e*(f<this.camDist?18:3)),t.position.copy(n).addScaledVector(l,this.camDist);let p=this.terrain.heightAt(t.position.x,t.position.z)+.25;t.position.y<p&&(t.position.y=p),r&&t.lookAt(n.x,n.y-.3,n.z)}teleport(e,t,n,r){let i=t??this.terrain.heightAt(e,n);this.pos.set(e,0,n);let a=this.findSupport(e,n,i+.8);this.pos.y=a.y,this.swimming=!a.box&&-.45-a.y>1.38&&Ra(e,n)<1.3,this.swimming&&(this.pos.y=Wi-1.42),this.vel.set(0,0,0),r!==void 0&&(this.yaw=r),this.pitch=0,this.eyeY=this.pos.y+this.height-.1,this.mode=`walk`,this.seat=null,this.camera.position.set(e,this.eyeY,n)}surfaceAt(){return this.supportBox?this.supportBox.tag||`wood`:this.pos.y<-.5?`water`:La(this.pos.x,this.pos.z)<1.4?`dirt`:`grass`}findSupport(e,t,n){let r=null,i=-1/0;for(let a of this.col.boxes)!a.enabled||!a.walk||a.max.y>n||a.max.y<=i||e+qd*.5<a.min.x||e-qd*.5>a.max.x||t+qd*.5<a.min.z||t-qd*.5>a.max.z||(i=a.max.y,r=a);let a=this.terrain.heightAt(e,t);return r&&i>a-.05?{y:i,box:r}:{y:a,box:null}}sit(e){this.mode=`seat`,this.seat=e,this.vel.set(0,0,0),this.seatBlend=0,this.seatFrom=this.camera.position.clone(),this.yaw=e.yaw,this.pitch=e.lie?1.1:-.08,this.audio?.creak(e.eye,.06,.4,140)}stand(){if(!this.seat)return;let e=this.seat;this.seat=null,this.mode=`walk`,this.pos.copy(e.exit),this.pos.y=this.findSupport(e.exit.x,e.exit.z,e.exit.y+1.5).y,this.eyeY=this.camera.position.y,this.pitch=0,e.onExit?.()}scope(e){this.mode=`scope`,this.scopeYaw=e,this.yaw=e,this.pitch=.05,this.scopeZoom=8,this.onScope?.(!0)}toggleFlashlight(){this.flashOn=!this.flashOn,this.flashlight.intensity=this.flashOn?22:0,this.audio?.click(null,.25)}update(e){this.input.hit(`KeyV`)&&this.toggleView(),this.updateInner(e),this.eyePos.copy(this.camera.position),this.view===`third`&&this.mode!==`scope`&&this.placeThirdPerson(e)}updateInner(e){let t=this.input,n=this.camera,r=this.settings,i=.0022*r.sensitivity*(this.mode===`scope`?1/Math.max(1,this.zoom):1);this.lookLocked||(this.yaw-=t.look.x*i,this.pitch-=t.look.y*i*(r.invertY?-1:1)),this.pitch=Math.max(-1.52,Math.min(1.52,this.pitch));let a=t.axis();if(this.mode===`seat`)return this.updateSeat(e,a);this.mode===`scope`?((a.mag>.3||t.hit(`Space`)||t.hit(`KeyE`)||t.hit(`Tap`))&&(this.mode=`walk`,this.onScope?.(!1),t.pressed.delete(`KeyE`),t.pressed.delete(`Tap`)),this.scopeZoom=Math.max(2,Math.min(40,this.scopeZoom*1.15**-t.wheel)),this.zoom+=(this.scopeZoom-this.zoom)*Math.min(1,e*4)):this.zoom+=(1-this.zoom)*Math.min(1,e*6),!this.swimming&&(t.hit(`KeyC`)||t.hit(`ControlLeft`))&&(this.crouchToggle=!this.crouchToggle);let o=this.crouchToggle||t.down(`ControlLeft`),s=this.col.ceilingHeight(this.pos.x,this.pos.z,qd,this.pos.y);this.crouching=!o&&this.pos.y+Gd>s||o;let c=this.crouching?Kd:Gd;this.height+=(c-this.height)*Math.min(1,e*10);let l=(t.down(`ShiftLeft`)||t.down(`ShiftRight`))&&!this.crouching,u=this.pos.y<Wi-.15,d=this.crouching?1.35:l?4.6:2.45;u&&(d*=.55+Math.max(0,this.pos.y-(Wi-1.2))*.3),this.swimming&&(d=l?2.2:1.45,this.crouchToggle=!1);let f=Math.sin(this.yaw),p=Math.cos(this.yaw),m=(-f*a.y+p*a.x)*d,h=(-p*a.y-f*a.x)*d,g=this.swimming?2.6:this.onGround?11:2.2,_=1-Math.exp(-g*e);this.vel.x+=(m-this.vel.x)*_,this.vel.z+=(h-this.vel.z)*_;let v=this.col.ladderAt(this.pos);if(v&&(a.y!==0||!this.onGround)){let t=Yd.set(-f,0,-p).dot(v.dir)>.2;this.vel.y=(t?a.y:-a.y)*1.9,this.vel.x*=.35,this.vel.z*=.35,this.pos.y>v.max.y-.3&&a.y>0&&(this.vel.x+=v.dir.x*1.2,this.vel.z+=v.dir.z*1.2,this.vel.y=Math.max(this.vel.y,1)),this.climbing=!0,this.travel+=Math.abs(this.vel.y)*e*1.6}else if(this.swimming){this.climbing=!1,(t.hit(`KeyC`)||t.hit(`ControlLeft`))&&(this.diving=!this.diving),t.hit(`Space`)&&(this.diving=!1);let n=this.findSupport(this.pos.x,this.pos.z,this.pos.y+.5).y,r=Math.max(0,Wi-1.42-(n+.25));this.dive+=((this.diving?r:0)-this.dive)*Math.min(1,e*(this.diving?.7:1.2));let i=Wi-1.42-this.dive+Math.sin(this.swimPhase*2)*(this.dive>.3?.01:.03);this.vel.y+=((i-this.pos.y)*9-this.vel.y*4)*e,this.pos.y<i-.4&&(this.vel.y=Math.max(this.vel.y,2.5))}else this.climbing=!1,this.vel.y-=9.81*e,t.hit(`Space`)&&this.onGround&&!this.crouching&&(this.vel.y=4.1,this.onGround=!1);let y=Math.ceil(e/.012),b=e/y,x=this.onGround,S=0;for(let e=0;e<y;e++){this.pos.x,this.pos.z,this.pos.x+=this.vel.x*b,this.pos.z+=this.vel.z*b,this.pos.y+=this.vel.y*b,this.col.resolve(this.pos,qd,this.pos.y,this.pos.y+this.height,this.pos.y+Jd);let e=Math.hypot(this.pos.x,this.pos.z);e>175&&(this.pos.x*=175/e,this.pos.z*=175/e);let t=this.findSupport(this.pos.x,this.pos.z,this.pos.y+Jd),n=!t.box&&-.45-t.y>1.38&&Ra(this.pos.x,this.pos.z)<1.3;if(n!==this.swimming&&(this.swimming=n,n||(this.diving=!1,this.dive=0),n&&(this.onSplash?.(this.pos,1),this.vel.y*=.3)),this.swimming){this.onGround=!1,this.supportBox=null;continue}let r=this.col.ceilingHeight(this.pos.x,this.pos.z,qd*.8,this.pos.y);this.pos.y+this.height>r&&this.vel.y>0&&(this.vel.y=0,this.pos.y=r-this.height),this.pos.y<=t.y?(this.vel.y<-3&&(S=-this.vel.y),this.pos.y=t.y,this.vel.y<0&&(this.vel.y=0),this.onGround=!0,this.supportBox=t.box):x&&this.vel.y<=0&&this.pos.y-t.y<.3&&!this.climbing?(this.pos.y=t.y,this.vel.y=0,this.onGround=!0,this.supportBox=t.box):this.climbing?(this.onGround=this.pos.y<=t.y+.01,this.supportBox=t.box):this.onGround=!1}S>0&&(this.surface=this.surfaceAt(),this.audio?.footstep(this.surface,this.pos,Math.min(2,S/3)));let C=Math.hypot(this.vel.x,this.vel.z),w=l?1.55:this.crouching?.85:1.25;if(this.speedH=C,this.stepLen=w,this.swimming){this.swimPhase+=e*(1.6+C*1.4);let t=Math.floor(this.swimPhase/Math.PI);t!==this.lastStroke&&(this.lastStroke=t,C>.2&&this.onStroke?.(this.pos,C))}this.onGround&&C>.3&&(this.travel+=C*e),Math.floor(this.travel/w)!==this.lastStep&&(this.lastStep=Math.floor(this.travel/w),this.surface=this.climbing?`wood`:this.surfaceAt(),this.audio?.footstep(this.surface,Yd.copy(this.pos),this.crouching?.45:l?1.3:.9),this.surface===`water`&&this.onSplash?.(this.pos,.35+(l?.3:0)));let T=this.travel/w*Math.PI,E=this.swimming?0:r.headBob?Math.min(1,C/4)*(l?.05:.032):0;this.bob.x+=(Math.sin(T)*E*.6-this.bob.x)*Math.min(1,e*12),this.bob.y+=(-Math.abs(Math.sin(T))*E-this.bob.y)*Math.min(1,e*12);let D=this.pos.y+this.height-.1-this.eyeY;this.eyeY+=D*Math.min(1,e*(Math.abs(D)>.6?30:14)),n.position.set(this.pos.x+Math.cos(this.yaw)*this.bob.x,this.eyeY+this.bob.y,this.pos.z-Math.sin(this.yaw)*this.bob.x),n.rotation.set(this.pitch,this.yaw,0),this.applyFov(e,l&&C>3)}applyFov(e,t){let n=this.settings.fov,r=this.camera.aspect;if(r<1.3){let e=ke.degToRad(n*1.25);n=Math.min(105,ke.radToDeg(2*Math.atan(Math.tan(e/2)/r)))}let i=n/this.zoom+(t?4:0);Math.abs(this.camera.fov-i)>.01&&(this.camera.fov+=(i-this.camera.fov)*Math.min(1,e*6),this.camera.updateProjectionMatrix())}updateSeat(e,t){let n=this.seat,r=this.input;if(t.mag>.4||r.hit(`Space`)){this.stand();return}if(!n.lie){let e=this.yaw-n.yaw;e=Math.atan2(Math.sin(e),Math.cos(e));let t=n.yawLimit??1.9;Math.abs(e)>t&&(this.yaw=n.yaw+Math.sign(e)*t)}this.seatBlend=Math.min(1,this.seatBlend+e*2.2);let i=this.seatBlend*this.seatBlend*(3-2*this.seatBlend),a=n.getEye?n.getEye():n.eye;this.camera.position.lerpVectors(this.seatFrom,a,i),this.camera.rotation.set(this.pitch,this.yaw,n.roll||0),this.pos.set(a.x,a.y-1.2,a.z),this.applyFov(e,!1)}},Zd=new b,Qd=new b,$d=new l,ef=new l,tf=new b,nf=class{constructor({camera:e,input:t,physics:n,audio:r,player:i,ui:a}){Object.assign(this,{camera:e,input:t,physics:n,audio:r,player:i,ui:a}),this.targets=[],this.occluders=[],this.updaters=[],this.ray=new rt,this.ray.far=2.7,this.held=null,this.focus=null,this.coneAngle=.11,this.holdQ=new l}register(e,t){return e.userData.interact=t,this.targets.push(e),t}item(e,t,n){let r=this.physics.addItem(e,n);return r.name=t,this.targets.push(e),r}occluder(e){this.occluders.push(e)}onUpdate(e){this.updaters.push(e)}get eye(){return this.player.eyePos||this.camera.position}pick(){this.camera.getWorldDirection(Zd),this.ray.set(this.eye,Zd);let e=this.ray.intersectObjects(this.held?this.occluders:this.targets.concat(this.occluders),!0),t=this.resolveHits(e);if(t||this.held)return t;let n=e.length?e[0].distance:1/0,r=null,i=this.coneAngle;for(let e of this.physics.items){if(e.held)continue;Qd.copy(e.mesh.position).sub(this.eye);let t=Qd.length();if(t>this.ray.far||t>n+.15||t<.05)continue;let a=Math.acos(Math.min(1,Qd.dot(Zd)/t));a<i&&(i=a,r=e)}if(!r)return null;Qd.copy(r.mesh.position).sub(this.eye);let a=Qd.length();this.ray.set(this.eye,Qd.normalize());let o=this.ray.intersectObjects(this.occluders,!0)[0];return o&&o.distance<a-.1?null:{kind:`item`,obj:r.mesh,item:r,point:r.mesh.position.clone()}}resolveHits(e){for(let t of e){let e=t.object;if(!(this.held&&e===this.held.mesh)){for(;e;){if(e.userData.interact)return{kind:`use`,obj:e,spec:e.userData.interact,point:t.point};if(e.userData.item&&!e.userData.item.held)return{kind:`item`,obj:e,item:e.userData.item,point:t.point};e=e.parent}return null}}return null}grab(e){this.held=e,e.held=!0,this.physics.world.removeBody(e.body),ef.copy(this.camera.quaternion).invert(),this.holdQ.copy(ef).multiply(e.mesh.quaternion),this.audio?.pickup(e.mesh.position),this.holdDist=.75,e.holdPose&&this.holdQ.setFromEuler(e.holdPose.euler),this.ui.setHolding(e.name,!!e.instrument)}release(e=0){let t=this.held;if(!t)return;this.held=null,t.held=!1;let n=t.body;n.position.copy(t.mesh.position),n.quaternion.copy(t.mesh.quaternion),this.camera.getWorldDirection(Zd),n.velocity.set(Zd.x*e+this.player.vel.x,Zd.y*e+.4+(e?1.2:0),Zd.z*e+this.player.vel.z),n.angularVelocity.set((Math.random()-.5)*e,(Math.random()-.5)*e,(Math.random()-.5)*e),this.physics.world.addBody(n),n.wakeUp(),e&&this.audio?.whoosh(.15),this.player.lookLocked=!1,this.ui.setHolding(null)}update(e){let t=this.input,n=this.player;for(let t of this.updaters)t(e);let r=t.hit(`KeyE`)||t.hit(`Tap`);if(n.mode===`seat`){this.ui.hint(n.seat?.lie?`Get up`:`Stand up`,!0),r&&n.stand();return}if(n.mode===`scope`){this.ui.hint(`Step back`,!0);return}if(this.held){let i=this.held,a=!i.holdPose&&(t.down(`KeyR`)||t.mouse.right);n.lookLocked=a,this.camera.getWorldDirection(Zd);let o=n.view===`third`,s=this.eye;if(i.holdPose&&!o)Qd.copy(i.holdPose.offset).applyQuaternion(this.camera.quaternion).add(this.camera.position);else{let t=a?.5+i.size*.25:.7+i.size*.3;o&&(t=.45+i.size*.2),this.ray.set(s,Zd);let n=this.ray.intersectObjects(this.occluders,!0)[0];n&&(t=Math.min(t,Math.max(.25,n.distance-i.size*.4))),this.holdDist+=(t-this.holdDist)*Math.min(1,e*10),o&&(Zd.y=0,Zd.normalize()),Qd.copy(s).addScaledVector(Zd,this.holdDist),o?Qd.y-=.42:a||(Qd.y-=.16,Qd.addScaledVector(tf.set(1,0,0).applyQuaternion(this.camera.quaternion),.12))}if(i.mesh.position.lerp(Qd,Math.min(1,e*16)),a){let e=t.look.y*.008,n=t.look.x*.008;ef.setFromAxisAngle(tf.set(0,1,0),n),this.holdQ.premultiply(ef),ef.setFromAxisAngle(tf.set(1,0,0),e),this.holdQ.premultiply(ef)}if($d.copy(this.camera.quaternion).multiply(this.holdQ),i.mesh.quaternion.slerp($d,Math.min(1,e*14)),i.instrument){this.ui.hint(this.ui.touch?`Strum · Drop to put it down`:`Click to strum · E to put it down`,!0),t.hit(`Mouse0`)?(i.play(),this.hands?.strum()):(r||t.hit(`KeyQ`))&&this.release(0);return}t.hit(`Mouse0`)?this.release(7.5):(r||t.hit(`KeyQ`))&&this.release(0),this.ui.hint(null);return}let i=this.pick();if(this.focus=i,!i){this.ui.hint(null);return}let a=this.hands?.reachState;if(i.kind===`item`)this.ui.hint(`Pick up `+i.item.name),r&&!a&&(this.hands?this.hands.reach(i.item.mesh.position,`grab`,()=>this.grab(i.item)):this.grab(i.item));else{let e=typeof i.spec.label==`function`?i.spec.label():i.spec.label;if(this.ui.hint(e),r&&!a){let t=/sit|lie|look through|crawl|step back|it's/i.test(e)?null:/door|window|drawer|cupboard|wardrobe|chest/i.test(e)?`push`:`press`;t&&this.hands?this.hands.reach(i.point,t,()=>i.spec.use(i)):i.spec.use(i)}}}},rf=(e,t)=>new W(e,t);function af(e,t=16){let n=new Pe(e.map(([e,t])=>rf(Math.max(5e-4,e),t)),t);return n.rotateX(Math.PI/2),n}function of(e,t,n,r=0){let i=e.attributes.position,a=new Float32Array(i.count*3);e.computeBoundingBox();let o=e.boundingBox;for(let e=0;e<i.count;e++){let s=ke.smoothstep((i.getY(e)-o.min.y)/Math.max(1e-4,o.max.y-o.min.y),r,r+.35);a[e*3]=n[0]+(t[0]-n[0])*s,a[e*3+1]=n[1]+(t[1]-n[1])*s,a[e*3+2]=n[2]+(t[2]-n[2])*s}return e.setAttribute(`color`,new nt(a,3)),e}function sf(e=!1,t){let n=new x,r=new R({vertexColors:!0,roughness:.9,map:t?.knit?.map||null}),i=new R({color:1380364,roughness:.35}),a=new R({color:1971986,roughness:.6}),o=new R({color:12101e3,roughness:.8}),s=[.5,.33,.2],c=[.86,.78,.66],l=(e,t,n,r=0,i=0,a=0)=>{let o=new I(e,t);return o.position.set(r,i,a),o.castShadow=!0,o.receiveShadow=!0,n.add(o),o},d=af([[0,-.62],[.16,-.58],[.24,-.45],[.27,-.2],[.24,.05],[.22,.25],[.24,.42],[.2,.56],[0,.64]],18);d.scale(.82,1,1);let f=d.attributes.position;for(let e=0;e<f.count;e++){let t=f.getZ(e);f.getY(e)<0&&f.setY(e,f.getY(e)*(t<-.1?1.15:.85))}d.computeVertexNormals(),l(of(d,s,c,0),r,n,0,1,0);let p=new x;p.position.set(0,1.12,-.48),n.add(p);let m=af([[.12,0],[.11,-.12],[.085,-.3],[.07,-.44],[0,-.48]],12);m.rotateX(-.95),l(of(m,s,c,.3),r,p,0,0,.04);let h=new x;h.position.set(0,.39,-.28),p.add(h);let g=af([[0,.07],[.07,.05],[.085,-.03],[.07,-.12],[.045,-.22],[.035,-.27],[0,-.29]],12);g.scale(.85,1,1),l(of(g,s,c,.4),r,h,0,0,0).rotation.x=.35,l(new V(.022,8,6),i,h,0,-.1,-.265).scale.set(1.2,.8,.8);for(let t of[-1,1]){l(new V(.016,10,8),i,h,t*.058,.025,-.06);let n=l(new V(.06,10,8),r,h,t*.075,.09,.04);if(n.scale.set(.45,1.1,.22),n.rotation.set(-.2,t*.3,t*-.55),e){let e=[],n=new u(.008,.014,.32,6);n.translate(0,.16,0),n.rotateZ(t*-.45),n.rotateX(-.3),e.push(n.toNonIndexed());for(let n=0;n<3;n++){let r=new u(.004,.008,.12,5);r.translate(0,.06,0),r.rotateX(-.6),r.translate(t*(.05+n*.035),.08+n*.08,-.02*n),e.push(r.toNonIndexed())}l(uo(e),o,h,t*.03,.08,.02)}}let _=l(new V(.05,8,6),new R({color:15788254,roughness:.9}),n,0,1.08,.6);_.scale.set(.8,1.3,.6);let v=[];for(let[e,t,i]of[[-.12,-.4,0],[.12,-.4,0],[-.12,.42,1],[.12,.42,1]]){let o=new x;o.position.set(e,.98,t),n.add(o);let d=af([[0,0],i?[.085,.04]:[.065,.02],i?[.075,.2]:[.055,.2],[.04,.38],[0,.4]],10);d.rotateX(Math.PI/2),d.rotateZ(0),l(of(d,s,c,.2),r,o,0,0,0);let f=new x;f.position.y=-.4,o.add(f);let p=new u(.022,.018,.48,8);p.translate(0,-.24,0),l(p,r,f).material=new R({color:6965810,roughness:.9}),l(new u(.02,.026,.05,8),a,f,0,-.5,-.008),v.push({hip:o,knee:f,hind:i})}return n.userData={legs:v,neckPivot:p,head:h,tail:_},n}function cf(e=!0){let t=new x,n=new R({vertexColors:!0,roughness:.75}),r=new Ve({color:e?1002026:6967352,roughness:.35,sheen:.8,sheenColor:new F(e?2787946:6967352)}),i=new R({color:e?14200880:11565616,roughness:.5}),a=(e,n,r=0,i=0,a=0,o=t)=>{let s=new I(e,n);return s.position.set(r,i,a),s.castShadow=!0,o.add(s),s},o=af([[0,-.2],[.08,-.17],[.12,-.08],[.125,.04],[.1,.14],[.05,.22],[0,.25]],16);o.scale(.95,.75,1),of(o,e?[.55,.52,.5]:[.45,.33,.22],e?[.62,.5,.42]:[.6,.48,.34],.2),a(o,n,0,.04,0),a(new ae(.05,.1,8),new R({color:e?2236962:4864040}),0,.09,.22).rotation.x=Math.PI/2+.6;let s=a(new Tt(.06,.03),new R({color:2767536,emissive:1054816,side:2}),.112,.08,.05);s.rotation.y=Math.PI/2;let c=s.clone();c.position.x=-.112,t.add(c);let l=new x;l.position.set(0,.1,-.13),t.add(l),a(new u(.032,.045,.12,10),r,0,.05,0,l).rotation.x=-.25,e&&(a(new m(.04,.007,6,14),new R({color:15921386}),0,0,0,l).rotation.x=Math.PI/2),a(new V(.052,14,10),r,0,.12,-.02,l).scale.set(.9,.95,1.15);let d=a(new Fe(.035,.014,.065),i,0,.105,-.09,l);d.rotation.x=.15;for(let e of[-1,1])a(new V(.008,6,6),new R({color:328965}),e*.037,.13,-.04,l);return t.userData={neck:l},t}function lf(){let e=new x,t=new R({vertexColors:!0,roughness:.95}),n=(t,n,r=0,i=0,a=0,o=e)=>{let s=new I(t,n);return s.position.set(r,i,a),s.castShadow=!0,o.add(s),s},r=[.48,.38,.28],i=[.82,.76,.68];n(of(af([[0,-.14],[.07,-.11],[.09,-.02],[.1,.06],[.08,.12],[0,.15]],14),r,i,.2),t,0,.1,0);let a=new x;a.position.set(0,.17,-.13),e.add(a),n(of(new V(.05,12,10).scale(.85,.9,1.15),r,i,.3),t,0,0,0,a);for(let e of[-1,1])n(of(new V(.05,10,8).scale(.32,1.35,.14),r,r),t,e*.02,.075,.02,a).rotation.set(.25,0,e*.18),n(new V(.008,6,6),new R({color:526344,roughness:.2}),e*.032,.012,-.03,a);return n(new V(.025,8,6),new R({color:16052458}),0,.13,.15),e.userData={head:a},e}function uf(e,t,n,i=!1){let a=af([[0,-.12],[.022,-.1],[.032,-.04],[.028,.04],[.012,.1],[.004,.12]],10);a.scale(.6,1,1);let o=new Ye;o.setAttribute(`position`,new r([0,0,.11,0,.035,.17,0,-.035,.17],3)),o.computeVertexNormals();let s=a.toNonIndexed();s.deleteAttribute(`uv`);let c=uo([s,o]);i?of(c,[1,1,1],[1,.97,.94],.3):of(c,[.32,.36,.3],[.8,.78,.7],.3);let l=new R({vertexColors:!0,roughness:.3,metalness:.35,side:2}),u={uTime:{value:0}};l.onBeforeCompile=e=>{e.uniforms.uTime=u.uTime,e.vertexShader=`uniform float uTime;
`+e.vertexShader.replace(`#include <begin_vertex>`,`vec3 transformed = position;
      float ph = float(gl_InstanceID) * 1.7;
      transformed.x += sin(uTime * 7.0 + ph - position.z * 18.0) * 0.03 * smoothstep(-0.05, 0.17, position.z);`)};let d=new ne(c,l,t);if(i){let e=[16738848,16052456,15219232,15773744,2763306];for(let n=0;n<t;n++)d.setColorAt(n,new F(e[n%e.length]))}return d.frustumCulled=!1,e.add(d),{mesh:d,u}}var $=z(4242);function df(e){let t=new x,n=new I(new V(.06,8,6),e);n.scale.set(.7,.6,1.6),t.add(n);let i=new Ye;i.setAttribute(`position`,new r([0,0,-.05,.28,0,.02,0,0,.07],3)),i.computeVertexNormals();let a=[];for(let n of[-1,1]){let r=new I(i,e);r.scale.x=n,t.add(r),a.push(r)}return t.userData.wings=a,t}var ff=class{constructor(e){this.ctx=e;let{scene:t,terrain:n}=e;this.h=(e,t)=>n.heightAt(e,t),this.deer=[];let i=[[22,-8],[-26,8],[36,20]];for(let n=0;n<4;n++){let r=sf(n===0,e.T),[a,o]=i[n%i.length],s={m:r,pos:new b(a+$()*8,0,o+$()*8),yaw:$()*6,state:`graze`,t:3+$()*5,target:new b,speed:0,phase:$()*6,home:new W(a,o),head:0};n===3&&s.m.scale.setScalar(.75),t.add(r),this.deer.push(s)}let a=new R({color:2762274,roughness:.8,side:2});this.birds=[];for(let e=0;e<11;e++){let e=df(a);t.add(e),this.birds.push({m:e,off:new b(($()-.5)*8,($()-.5)*3,($()-.5)*8),ph:$()*6,glide:0})}this.flockT=0,this.flockAlt=0,this.ducks=[];for(let e=0;e<4;e++){let n=cf(e%2==0);t.add(n),this.ducks.push({m:n,a:$()*6,r:Math.min(q.rx,q.rz)*(.3+$()*.25),c:new W(q.x+(e-1.5)*q.rx*.15,q.z+(e%2?.15:-.1)*q.rz),sp:.04+$()*.03,quack:8+$()*20})}let o=new Float32Array(420);for(let e=0;e<140;e++){let t,n,r=0;do t=($()-.5)*80,n=$()*50-8,r++;while((this.h(t,n)<-.25||Math.abs(t)<7&&n>-4&&n<7)&&r<20);o[e*3]=t,o[e*3+1]=this.h(t,n)+.4+$()*1.6,o[e*3+2]=n}let s=new Ye;s.setAttribute(`position`,new nt(o,3)),this.flyU={uTime:{value:0},uAmount:{value:0}},this.flies=new f(s,new d({uniforms:this.flyU,transparent:!0,depthWrite:!1,blending:2,vertexShader:`uniform float uTime; uniform float uAmount; varying float vA;
        void main(){ vec3 p = position; float s = p.x * 1.7 + p.z * 2.3;
          p += vec3(sin(uTime * 0.31 + s) * 1.6, sin(uTime * 0.53 + s * 1.3) * 0.5, cos(uTime * 0.27 + s * 0.7) * 1.6);
          float blink = smoothstep(0.55, 1.0, sin(uTime * (0.8 + fract(s) * 1.4) + s * 5.0));
          vA = blink * uAmount; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = 150.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float core = smoothstep(0.12, 0.0, d); float halo = smoothstep(0.5, 0.0, d) * 0.35; gl_FragColor = vec4(mix(vec3(0.7, 1.0, 0.3), vec3(1.0, 1.0, 0.8), core), (core + halo) * vA); }`})),this.flies.frustumCulled=!1,t.add(this.flies),this.rings=[];let c=new Re({color:13623530,transparent:!0,opacity:0,depthWrite:!1}),u=new xt(.9,1,24);u.rotateX(-Math.PI/2);for(let e=0;e<70;e++){let e=new I(u,c.clone());e.visible=!1,t.add(e),this.rings.push({m:e,life:0,size:1})}this.ringIdx=0,this.jumper=new I(new V(.1,10,6),new R({color:9083530,roughness:.3,metalness:.4})),this.jumper.scale.set(.5,.7,2.2),this.jumper.visible=!1,t.add(this.jumper),this.fishT=8,this.fishJump=null,this.rabbits=[];for(let e=0;e<6;e++){let e=lf();t.add(e);let n=0,r=0;for(let e=0;e<30&&(n=($()-.5)*70,r=$()*50-15,!(this.h(n,r)>-.45+.3&&Math.abs(n)>9&&za(n,r)<.5));e++);this.rabbits.push({m:e,pos:new b(n,0,r),yaw:$()*6,t:$()*3,hop:0,hopping:!1,flee:0,target:new b(n,0,r)})}this.koi=Gi.id===`hollow`;let p=this.koi?22:36;this.fish=uf(t,p,e.T,this.koi);let m=Math.min(q.rx,q.rz);this.fishData=Array.from({length:p},(e,t)=>({a:$()*6.28,r:m*(.15+$()*.45),c:new W(q.x+($()-.5)*q.rx*.6,q.z+($()-.5)*q.rz*.6),d:this.koi?.25+$()*.7:.6+$()*2.2,sp:(.25+$()*.35)*($()<.5?1:-1),x:0,z:0})),this.feedAt=null,this.fishM=new yt,this.fishQ=new l,this.fishS=new b(1,1,1);let h=new Ye;h.setAttribute(`position`,new r([0,0,.012,.05,0,.03,.055,0,-.005,0,0,-.012,.04,0,-.035],3)),h.setIndex([0,1,2,0,2,3,3,2,4]),h.computeVertexNormals();let g=[15241258,15921120,5933784,15781952];this.butterflies=[];for(let e=0;e<16;e++){let n=new x,r=new R({color:g[e%4],side:2,roughness:.6,emissive:g[e%4],emissiveIntensity:.08}),i=new I(h,r),a=new I(h,r);a.scale.x=-1;let o=new I(new xe(.004,.025,2,4),new R({color:1709072}));o.rotation.x=Math.PI/2,n.add(i,a,o),t.add(n);let s=$()*6.28,c=9+$()*25;this.butterflies.push({g:n,wl:i,wr:a,home:new b(Math.cos(s)*c,0,Math.sin(s)*c*.7+6),ph:$()*10,sp:.6+$()*.5,rest:0})}this.dragonflies=[];let _=new R({color:13625599,transparent:!0,opacity:.35,side:2,roughness:.1,depthWrite:!1}),v=new R({color:2058874,metalness:.6,roughness:.3});for(let e=0;e<7;e++){let e=new x,n=new I(new xe(.005,.07,2,5),v);n.rotation.x=Math.PI/2,e.add(n);let r=[];for(let t of[-.008,.008])for(let n of[-1,1]){let i=new I(new Tt(.06,.012),_);i.position.set(n*.03,.003,t),i.rotation.x=-Math.PI/2,e.add(i),r.push(i)}t.add(e);let i=$()*6.28;this.dragonflies.push({g:e,wings:r,a:i,pos:new b(q.x+Math.cos(i)*q.rx*.97,Wi+.4,q.z+Math.sin(i)*q.rz*.97),target:new b,t:0})}let y=new ye().copy(new Tt(.06,.04)),S=new Float32Array(280);for(let e=0;e<280;e++)S[e]=$();y.setAttribute(`aSeed`,new P(S,4)),y.instanceCount=70,this.leafU={uCam:{value:new b},uTime:{value:0},uWind:{value:0},uAmount:{value:1}};let C=new R({color:11569722,side:2,roughness:.8});C.onBeforeCompile=e=>{Object.assign(e.uniforms,this.leafU),e.vertexShader=`uniform vec3 uCam; uniform float uTime; uniform float uWind; uniform float uAmount; attribute vec4 aSeed; varying vec3 vTint;
`+e.vertexShader.replace(`#include <begin_vertex>`,`
        float B = 24.0, Hh = 9.0;
        float fall = mod(aSeed.y * Hh + uTime * (0.35 + aSeed.w * 0.3), Hh);
        vec3 c;
        c.y = uCam.y + 6.0 - fall;
        c.x = uCam.x + mod(aSeed.x * B + uTime * uWind * 1.8 + sin(uTime * 0.8 + aSeed.z * 9.0) * 0.6 - uCam.x, B) - B * 0.5;
        c.z = uCam.z + mod(aSeed.z * B + sin(uTime * 0.6 + aSeed.x * 7.0) * 0.6 - uCam.z, B) - B * 0.5;
        float a1 = uTime * (1.5 + aSeed.w * 3.0) + aSeed.x * 6.28, a2 = uTime * (1.1 + aSeed.y * 2.0);
        vec3 p = position;
        p.yz = mat2(cos(a1), -sin(a1), sin(a1), cos(a1)) * p.yz;
        p.xy = mat2(cos(a2), -sin(a2), sin(a2), cos(a2)) * p.xy;
        float hide = step(uAmount, aSeed.w) + ((abs(c.x) < 6.8 && abs(c.z) < 4.2) ? 1.0 : 0.0);
        vec3 transformed = c + p * (1.0 - min(hide, 1.0));
        vTint = mix(vec3(0.9, 0.55, 0.2), vec3(0.6, 0.65, 0.2), aSeed.z);`),e.fragmentShader=`varying vec3 vTint;
`+e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
diffuseColor.rgb *= vTint * 1.4;`)},C.customProgramCacheKey=()=>`leaves-fall`,this.leaves=new I(y,C),this.leaves.frustumCulled=!1,t.add(this.leaves)}ring(e,t,n=1,r=.5){let i=this.rings[this.ringIdx=(this.ringIdx+1)%this.rings.length];i.m.position.set(e,Wi+.01,t),i.life=1,i.size=n,i.alpha=r,i.m.visible=!0}update(e,t,n,r,i,a){let o=i.w,s=r.state.daylight,c=n.pos;this.updateSmall(e,t,c,s,o);for(let r of this.deer){let i=Math.hypot(r.pos.x-c.x,r.pos.z-c.z);r.t-=e;let o=n.crouching?.55:1;if(this.crouchQuiet=n.crouching,r.state!==`flee`&&i<11*o&&n.mode!==`seat`){r.state=`flee`,r.t=3+$()*2;let e=Math.atan2(r.pos.x-c.x,r.pos.z-c.z)+($()-.5)*.8;r.target.set(r.pos.x+Math.sin(e)*30,0,r.pos.z+Math.cos(e)*30),a?.noiseHit(r.pos,{buf:a.pink,type:`bandpass`,f:900,q:1,a:.01,d:.25,v:.3,ref:4})}else if((r.state===`graze`||r.state===`walk`)&&i<22&&$()<e*.4)r.state=`alert`,r.t=2+$()*3;else if(r.t<=0){if(r.state===`graze`||r.state===`flee`||r.state===`alert`){r.state=`walk`,r.t=6+$()*8,r.state===`alert`&&(r.state=`graze`);for(let e=0;e<10;e++){let e=$()*6.28,t=4+$()*14,n=r.home.x+Math.cos(e)*t,i=r.home.y+Math.sin(e)*t;if(this.h(n,i)>-.45+.4&&Math.hypot(n-Ki.x,i-Ki.z)>14){r.target.set(n,0,i);break}}}else r.state=`graze`,r.t=5+$()*9}let s=0;if(r.state===`walk`||r.state===`flee`){let t=r.target.x-r.pos.x,n=r.target.z-r.pos.z;if(Math.hypot(t,n)<.5)r.state=`graze`,r.t=4+$()*6;else{s=r.state===`flee`?6.5:1;let i=Math.atan2(-t,-n)-r.yaw;i=Math.atan2(Math.sin(i),Math.cos(i)),r.yaw+=i*Math.min(1,e*(r.state===`flee`?5:2));let a=r.pos.x-Math.sin(r.yaw)*s*e,o=r.pos.z-Math.cos(r.yaw)*s*e;this.h(a,o)>-.25&&Math.hypot(a,o)<170?(r.pos.x=a,r.pos.z=o):(r.state=`graze`,r.t=2)}}r.speed+=(s-r.speed)*Math.min(1,e*4),r.pos.y=this.h(r.pos.x,r.pos.z);let l=r.m,u=l.userData;l.position.copy(r.pos),l.rotation.y=r.yaw,r.phase+=e*(r.speed>3?r.speed*1.5:r.speed*4.5);let d=r.speed>3;u.legs.forEach((e,t)=>{let n=d?(t<2?0:Math.PI*.8)+t%2*.3:[0,Math.PI,Math.PI*.5,Math.PI*1.5][t],i=Math.min(1,r.speed/1)*(d?.7:.35),a=Math.sin(r.phase+n);e.hip.rotation.x=a*i,e.knee.rotation.x=Math.max(0,-Math.cos(r.phase+n))*i*1.4});let f=r.state===`graze`?1.3:r.state===`alert`?-.25:d?.2:.1;if(r.head+=(f-r.head)*Math.min(1,e*2.5),u.neckPivot.rotation.x=r.head+(r.state===`graze`?Math.sin(t*3+r.phase)*.05:0),r.state===`alert`){let e=Math.atan2(-(c.x-r.pos.x),-(c.z-r.pos.z))-r.yaw;u.neckPivot.rotation.y=Math.max(-1,Math.min(1,Math.atan2(Math.sin(e),Math.cos(e))))}else u.neckPivot.rotation.y*=.95;u.tail.rotation.x=2.4+(r.state===`flee`?-.8:Math.sin(t*6)*.1),l.position.y+=d?Math.abs(Math.sin(r.phase))*.12:0,l.visible=i<160}let l=s>.3&&o.rain<.55;this.flockAlt+=(+!!l-this.flockAlt)*Math.min(1,e*.15),this.flockT+=e*.05;let u=new b(q.x+Math.sin(this.flockT)*40,14+Math.sin(this.flockT*2.3)*4+(1-this.flockAlt)*120,q.z-10+Math.sin(this.flockT*1.7)*30),d=new b(Math.cos(this.flockT)*40*.05,0,Math.cos(this.flockT*1.7)*30*1.7*.05).normalize();for(let n of this.birds){n.ph+=e*(n.glide>0?2:14),$()<e*.3&&(n.glide=1.5),n.glide-=e;let r=n.glide>0?.15:Math.sin(n.ph)*.9;n.m.userData.wings.forEach((e,t)=>e.rotation.z=(t?-1:1)*r);let i=u.clone().add(n.off).add(new b(Math.sin(t*.7+n.ph)*1.5,Math.sin(t*.9+n.ph*2)*.8,Math.cos(t*.6+n.ph)*1.5));n.m.position.lerp(i,Math.min(1,e*1.5)),n.m.rotation.y=Math.atan2(-d.x,-d.z),n.m.visible=this.flockAlt>.02}for(let n of this.ducks){n.a+=e*n.sp;let r=n.c.x+Math.cos(n.a)*n.r,i=n.c.y+Math.sin(n.a*1.3)*n.r*.6,o=n.c.x+Math.cos(n.a+.05)*n.r,c=n.c.y+Math.sin((n.a+.05)*1.3)*n.r*.6;n.m.position.set(r,Wi+Math.sin(t*2+n.a*10)*.01,i),n.m.rotation.y=Math.atan2(-(o-r),-(c-i));let l=Math.max(0,Math.sin(t*.23+n.r*3))>.92;if(n.m.rotation.x+=((l?-1.1:0)-n.m.rotation.x)*Math.min(1,e*3),n.m.userData.neck.rotation.x=Math.sin(t*1.3+n.r)*.08,n.quack-=e,n.quack<0&&(n.quack=12+$()*30,s>.2&&a))for(let e=0;e<2+Math.floor($()*3);e++)a.tone(n.m.position,{f:520+$()*60,type:`sawtooth`,a:.01,d:.12,v:.05,slide:.7,delay:e*.18,ref:6});$()<e*.4&&this.ring(r,i+.2,.25,.25)}this.flyU.uTime.value=t;let f=(1-s)*(1-Math.min(1,o.rain*3))*(1-o.fog*.5);this.flyU.uAmount.value+=(f-this.flyU.uAmount.value)*Math.min(1,e*.3),this.flies.visible=this.flyU.uAmount.value>.01;for(let t of this.rings){if(t.life<=0)continue;t.life-=e*1.2;let n=t.size*(1.6-t.life*1.2);t.m.scale.set(n,1,n),t.m.material.opacity=Math.max(0,t.life)*t.alpha,t.life<=0&&(t.m.visible=!1)}if(this.fishT-=e,this.fishT<0&&!this.fishJump){this.fishT=12+$()*30;for(let e=0;e<8;e++){let e=$()*6.28,t=8+$()*25,n=c.x+Math.cos(e)*t,r=c.z+Math.sin(e)*t;if(this.h(n,r)<-1.25){this.fishJump={x:n,z:r,t:0,yaw:$()*6.28};break}}}if(this.fishJump){let t=this.fishJump;t.t+=e;let n=t.t/.7;t.t===e&&(this.ring(t.x,t.z,.5,.7),this.ctx.splashes?.burst({x:t.x,z:t.z},.6,14),a?.splash(new b(t.x,Wi,t.z),.5)),this.jumper.visible=n<1,this.jumper.position.set(t.x+Math.sin(t.yaw)*n*.8,Wi+Math.sin(n*Math.PI)*.6,t.z+Math.cos(t.yaw)*n*.8),this.jumper.rotation.set(-Math.cos(n*Math.PI)*1,t.yaw,0),n>=1&&(this.ring(this.jumper.position.x,this.jumper.position.z,.6,.7),this.ctx.splashes?.burst(this.jumper.position,.8,18),a?.splash(this.jumper.position,.6),this.fishJump=null,this.jumper.visible=!1)}}updateSmall(e,t,n,r,i){this.t=t,this.fish.u.uTime.value=t,this.fishData.forEach((n,r)=>{n.a+=e*n.sp/Math.max(2,n.r)*2;let i=n.c.x+Math.cos(n.a)*n.r,a=n.c.y+Math.sin(n.a)*n.r*.7;if(this.feedAt&&t<this.feedAt.until){let r=Math.min(1,(t-this.feedAt.t0)*.25);i+=(this.feedAt.p.x+Math.cos(n.a*3)*.9-i)*r,a+=(this.feedAt.p.z+Math.sin(n.a*3)*.9-a)*r,$()<e*.4&&(this.ring(i,a,.2,.5),this.ctx.splashes?.burst({x:i,z:a},.25,4))}this.koi&&(n.x+=(i-n.x)*Math.min(1,e*2),n.z+=(a-n.z)*Math.min(1,e*2),i=n.x,a=n.z);let o=this.h(i,a),s=Math.max(o+.25,Wi-n.d)+Math.sin(t*.7+r)*.08,c=-Math.sin(n.a)*Math.sign(n.sp),l=Math.cos(n.a)*.7*Math.sign(n.sp);this.fishQ.setFromAxisAngle(new b(0,1,0),Math.atan2(-c,-l)+Math.PI),this.fishS.setScalar((this.koi?1.9:.8)+r%5*.15),this.fishM.compose(new b(i,o>-.45-.4?-50:s,a),this.fishQ,this.fishS),this.fish.mesh.setMatrixAt(r,this.fishM)}),this.fish.mesh.instanceMatrix.needsUpdate=!0;for(let r of this.rabbits){let i=Math.hypot(r.pos.x-n.x,r.pos.z-n.z);if(r.m.visible=i<90,!r.m.visible)continue;if(r.t-=e,i<(this.crouchQuiet?3.5:7)&&r.flee<=0){r.flee=3;let e=Math.atan2(r.pos.x-n.x,r.pos.z-n.z);r.target.set(r.pos.x+Math.sin(e)*14,0,r.pos.z+Math.cos(e)*14)}if(r.flee>0&&(r.flee-=e),!r.hopping&&(r.flee>0||r.t<=0)){if(r.hopping=!0,r.hop=0,r.flee<=0){r.t=1.5+$()*5;let e=$()*6.28;r.target.set(r.pos.x+Math.cos(e)*1.5,0,r.pos.z+Math.sin(e)*1.5)}let e=r.target.x-r.pos.x,t=r.target.z-r.pos.z;r.yaw=Math.atan2(-e,-t)}if(r.hopping){r.hop+=e*(r.flee>0?3.2:2.2);let t=r.flee>0?4.5:1.4,n=r.pos.x-Math.sin(r.yaw)*t*e,i=r.pos.z-Math.cos(r.yaw)*t*e;this.h(n,i)>-.25&&(r.pos.x=n,r.pos.z=i),r.hop>=1&&(r.hopping=r.flee>0&&Math.hypot(r.target.x-r.pos.x,r.target.z-r.pos.z)>1,r.hop=0)}let a=r.hopping?Math.sin(r.hop*Math.PI)*.12:0;r.m.position.set(r.pos.x,this.h(r.pos.x,r.pos.z)+a,r.pos.z),r.m.rotation.set(r.hopping?-Math.cos(r.hop*Math.PI)*.3:0,r.yaw,0),r.m.userData.head.rotation.x=r.hopping?0:Math.sin(t*.8+r.yaw*9)>.3?.5:-.1}let a=r>.35&&i.rain<.3;for(let r of this.butterflies){if(r.g.visible=a&&Math.hypot(r.home.x-n.x,r.home.z-n.z)<70,!r.g.visible)continue;r.ph+=e*r.sp;let i=r.home.x+Math.sin(r.ph*.7)*3+Math.sin(r.ph*1.9)*.8,o=r.home.z+Math.cos(r.ph*.5)*3+Math.cos(r.ph*2.3)*.8,s=this.h(i,o)+.6+Math.abs(Math.sin(r.ph*1.3))*.7,c=r.g.position.clone();r.g.position.set(i,s,o),r.g.rotation.y=Math.atan2(-(i-c.x),-(o-c.z));let l=Math.sin(t*22+r.ph*10)*1.1;r.wl.rotation.z=l,r.wr.rotation.z=-l}for(let a of this.dragonflies){if(a.g.visible=r>.3&&i.rain<.4&&Math.hypot(a.pos.x-n.x,a.pos.z-n.z)<80,!a.g.visible)continue;if(a.t-=e,a.t<=0){a.t=.4+$()*1.6,a.a+=($()-.5)*.15;let e=.9+$()*.15;a.target.set(q.x+Math.cos(a.a)*q.rx*e,Wi+.25+$()*.9,q.z+Math.sin(a.a)*q.rz*e)}let o=a.g.position.clone();a.pos.lerp(a.target,Math.min(1,e*3)),a.g.position.copy(a.pos),o.distanceToSquared(a.pos)>1e-6&&(a.g.rotation.y=Math.atan2(-(a.pos.x-o.x),-(a.pos.z-o.z))),a.wings.forEach((e,n)=>e.rotation.y=Math.sin(t*60+n)*.4)}this.leafU.uCam.value.copy(n),this.leafU.uTime.value=t,this.leafU.uWind.value=i.gust,this.leafU.uAmount.value=.15+i.gust*.6}feed(e){this.feedAt={p:e.clone(),t0:this.t||0,until:(this.t||0)+14}}splashAt(e){this.ring(e.x,e.z,.4,.7)}},pf=e=>440*2**((e-69)/12),mf=[`Evening keys`,`Slow light`,`Static`],hf=class{constructor(e,t){this.a=e;let n=e.ctx;this.out=e.gain(0);let r=e.filter(`highpass`,140),i=e.filter(`lowpass`,5200),a=n.createWaveShaper(),o=new Float32Array(1024);for(let e=0;e<1024;e++){let t=e/512-1;o[e]=Math.tanh(t*1.6)/Math.tanh(1.6)}a.curve=o,this.panner=e.panner(t,1.6,1.3),this.bus=e.gain(.5),e.chain(this.bus,r,i,a,this.out,this.panner,e.sfx);let s=e.src(e.white,!0),c=e.filter(`bandpass`,5e3,.5);this.hissG=e.gain(0),e.chain(s,c,this.hissG,this.out),s.start(),this.station=-1,this.on=!1,this.rnd=z(5150),this.nextTime=0,this.step=0,this.bar=0,this.timer=setInterval(()=>this.schedule(),100)}toggle(){this.on?this.station===0?this.station=1:this.on=!1:(this.on=!0,this.station=0);let e=this.a.now;return this.a.click(this.panner.positionX?{x:this.panner.positionX.value,y:this.panner.positionY.value,z:this.panner.positionZ.value}:null,.3),this.hissG.gain.cancelScheduledValues(e),this.hissG.gain.setValueAtTime(this.on?.25:0,e),this.hissG.gain.linearRampToValueAtTime(this.on?.012:0,e+.6),this.out.gain.setTargetAtTime(this.on?.9:0,e,.08),this.nextTime=e+.4,this.step=0,this.on?mf[this.station]:null}voice(e,t,n,r,i){let a=this.a,o=a.ctx;if(e===`ep`){let e=o.createOscillator(),s=o.createOscillator(),c=a.gain(t*1.6),l=a.gain(0);e.frequency.value=t,s.frequency.value=t,s.connect(c).connect(e.frequency),c.gain.setValueAtTime(t*2.2*i,n),c.gain.exponentialRampToValueAtTime(t*.15,n+.8),e.connect(l).connect(this.bus),l.gain.setValueAtTime(0,n),l.gain.linearRampToValueAtTime(.12*i,n+.006),l.gain.exponentialRampToValueAtTime(.03*i,n+.6),l.gain.exponentialRampToValueAtTime(1e-4,n+r),e.start(n),s.start(n),e.stop(n+r+.1),s.stop(n+r+.1)}else if(e===`bass`){let e=o.createOscillator(),s=a.gain(0),c=a.filter(`lowpass`,400);e.type=`triangle`,e.frequency.value=t,a.chain(e,c,s,this.bus),s.gain.setValueAtTime(0,n),s.gain.linearRampToValueAtTime(.22*i,n+.02),s.gain.exponentialRampToValueAtTime(1e-4,n+r),e.start(n),e.stop(n+r+.05)}else if(e===`pad`){let e=a.gain(0),s=a.filter(`lowpass`,900,.5);for(let e of[-7,0,6]){let i=o.createOscillator();i.type=`sawtooth`,i.frequency.value=t,i.detune.value=e,i.connect(s),i.start(n),i.stop(n+r+.1)}a.chain(s,e,this.bus),e.gain.setValueAtTime(0,n),e.gain.linearRampToValueAtTime(.03*i,n+r*.4),e.gain.linearRampToValueAtTime(0,n+r)}else if(e===`bell`)[1,2.76,5.4].forEach((e,s)=>{let c=o.createOscillator(),l=a.gain(0);c.frequency.value=t*e,c.connect(l).connect(this.bus),l.gain.setValueAtTime(0,n),l.gain.linearRampToValueAtTime(.05*i/(s+1),n+.004),l.gain.exponentialRampToValueAtTime(1e-4,n+r/(s+1)),c.start(n),c.stop(n+r)});else if(e===`hat`){let e=a.src(a.white,!1),t=a.filter(`highpass`,7e3),r=a.gain(0);a.chain(e,t,r,this.bus),r.gain.setValueAtTime(.05*i,n),r.gain.exponentialRampToValueAtTime(1e-4,n+.05),e.start(n,this.rnd()*2),e.stop(n+.08)}else if(e===`kick`){let e=o.createOscillator(),t=a.gain(0);e.frequency.setValueAtTime(110,n),e.frequency.exponentialRampToValueAtTime(42,n+.15),e.connect(t).connect(this.bus),t.gain.setValueAtTime(.35*i,n),t.gain.exponentialRampToValueAtTime(1e-4,n+.3),e.start(n),e.stop(n+.35)}}schedule(){if(!this.on)return;let e=this.a.now;this.nextTime<e&&(this.nextTime=e+.05);let t=this.rnd;for(;this.nextTime<e+.4;){let e=this.nextTime;if(this.station===0){let n=[[50,[62,65,69,72]],[55,[62,65,67,71]],[52,[61,64,67,71]],[57,[61,64,67,69]],[47,[62,66,69,71]],[52,[62,64,67,71]],[45,[61,64,67,69]],[50,[62,66,69,73]]],r=60/74,i=r/2,a=this.step%8,o=n[this.bar%n.length],s=a%2?i*.16:0;if(a===0&&(o[1].forEach((t,n)=>this.voice(`ep`,pf(t),e+n*.012,r*3.5,.7)),this.voice(`bass`,pf(o[0]-12),e,r*1.8,1),this.voice(`kick`,0,e,0,.8)),a===5&&this.voice(`bass`,pf(o[0]-12+(t()<.5?7:12)),e+s,r,.7),a===4&&this.voice(`kick`,0,e,0,.5),this.voice(`hat`,0,e+s,0,a%2?.5:.9),t()<.38){let n=[62,64,66,69,71,74,76,78];this.voice(`ep`,pf(n[Math.floor(t()*n.length)]+12),e+s,r*1.2,.45+t()*.3)}this.nextTime+=i,this.step++,this.step%8==0&&this.bar++}else{let n=[[45,52,57,60,64],[41,48,53,57,64],[43,50,55,59,62],[40,47,52,55,59]],r=n[this.bar%n.length];r.forEach(t=>this.voice(`pad`,pf(t),e,6.5,.8));for(let n=0;n<4;n++)t()<.6&&this.voice(`bell`,pf(r[Math.floor(t()*r.length)]+24),e+.5+t()*5,3,.6);this.nextTime+=6,this.bar++}}}},gf=e=>document.getElementById(e),_f=class{constructor(e,t){this.s=e,this.h=t,this.hintEl=gf(`hint`),this.hintText=gf(`hint-text`),this.hintKey=gf(`hint-key`),this.toastEl=gf(`toast`),this.menu=gf(`menu`),this.lastHint=null,this.setTouch(Le),addEventListener(`keydown`,e=>{e.code===`Escape`&&gf(`paper`).classList.contains(`show`)&&(e.preventDefault(),this.closeOverlay())});let n=gf(`opt-quality`);n.innerHTML=Object.entries(Me).map(([e,t])=>`<option value="${e}">${t.name}</option>`).join(``),n.value=e.quality,n.onchange=()=>t.quality(n.value);let r=(n,r,i=e=>e,a)=>{let o=gf(n);o.type===`checkbox`?o.checked=!!e[r]:o.value=e[r],o.oninput=o.onchange=()=>{e[r]=o.type===`checkbox`?o.checked:i(o.value),t.changed(r),a?.()}};r(`opt-volume`,`volume`,Number),r(`opt-fps`,`maxFps`,Number),r(`opt-sens`,`sensitivity`,Number),r(`opt-fov`,`fov`,Number),r(`opt-invert`,`invertY`),r(`opt-bob`,`headBob`),r(`opt-timeflow`,`timeFlow`),r(`opt-weather`,`weather`);let i=gf(`opt-time`);i.oninput=()=>t.setHour(Number(i.value)),this.timeEl=i,this.timeLabel=gf(`opt-time-label`),gf(`menu-resume`).onclick=()=>t.resume(),gf(`menu-exit`).onclick=()=>t.exit();let a=gf(`places`);a.innerHTML=Zi.map(e=>`<button class="place" data-id="${e.id}">${e.name}</button>`).join(``),a.onclick=e=>{let n=e.target.closest(`.place`);n&&t.travel(n.dataset.id)};let o=gf(`journeys`);o.innerHTML=Object.entries(Qi).map(([e,t])=>`<button class="journey ${e===Gi.id?`here`:``}" data-id="${e}"><b>${t.name}${e===Gi.id?` · you are here`:``}</b><span>${t.blurb}</span></button>`).join(``),o.onclick=e=>{let t=e.target.closest(`.journey`);t&&this.h.journey?.(t.dataset.id)}}setTouch(e){this.touch=e,this.hintKey.textContent=e?`Tap`:`E`,document.body.classList.toggle(`touch`,e),gf(`controls-help`).innerHTML=e?`<b>Left side</b> move · <b>Right side</b> look · <b>Tap</b> to use or pick up · buttons for jump, crouch, run and torch`:`<b>WASD</b> walk · <b>Shift</b> run · <b>C / Ctrl</b> crouch · <b>Space</b> jump · <b>E</b> use / pick up · <b>Click</b> throw · <b>Hold R / right-click</b> inspect · <b>Q</b> drop · <b>F</b> torch · <b>Esc</b> menu`}hint(e,t=!1){e!==this.lastHint&&(this.lastHint=e,e?(this.hintText.textContent=e,this.hintEl.classList.add(`show`),gf(`crosshair`).classList.add(`active`)):(this.hintEl.classList.remove(`show`),gf(`crosshair`).classList.remove(`active`)))}toast(e,t=2600){this.toastEl.textContent=e,this.toastEl.classList.add(`show`),clearTimeout(this._t),this._t=setTimeout(()=>this.toastEl.classList.remove(`show`),t)}setHolding(e,t=!1){document.body.classList.toggle(`holding`,!!e),gf(`tb-throw`).textContent=t?`Strum`:`Throw`,gf(`tb-inspect`).style.display=t?`none`:``}paper(e,t,n=!1){let r=gf(`paper`);gf(`paper-title`).textContent=e,gf(`paper-body`).innerHTML=t,gf(`paper-edit`).hidden=!n,r.classList.add(`show`),this.h.overlay?.(!0);let i=()=>{r.classList.remove(`show`),this.h.overlay?.(!1)};gf(`paper-close`).onclick=i,this._closePaper=i}journal(){let e=[];try{e=JSON.parse(localStorage.getItem(`se-journal`)||`[]`)}catch{}let t=e=>e.replace(/[&<>]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`})[e]),n=e.slice().reverse().map(e=>`<div class="entry"><div class="when">${t(e.when)}</div><div>${t(e.text).replace(/\n/g,`<br>`)}</div></div>`).join(``);this.paper(`Journal`,n||`<p class="muted">The first page is empty. Write whatever you like — it stays on this device.</p>`,!0);let r=gf(`paper-text`);r.value=``,setTimeout(()=>r.focus(),50),gf(`paper-save`).onclick=()=>{let t=r.value.trim();if(!t)return;let n=this.h.hour?.()??12,i=new Date().toLocaleDateString(void 0,{weekday:`long`,month:`long`,day:`numeric`})+` · ${String(Math.floor(n)).padStart(2,`0`)}:${String(Math.floor(n%1*60)).padStart(2,`0`)} at the cabin`;e.push({when:i,text:t});try{localStorage.setItem(`se-journal`,JSON.stringify(e.slice(-200)))}catch{}this.toast(`Written down.`),this.journal()}}get overlayOpen(){return gf(`paper`).classList.contains(`show`)||gf(`player`).classList.contains(`open`)}closeOverlay(){gf(`paper`).classList.contains(`show`)&&this._closePaper?.()}setScope(e){document.body.classList.toggle(`scoping`,e)}showMenu(e){this.menu.classList.toggle(`show`,e),document.body.classList.toggle(`paused`,e)}updateTime(e){document.activeElement!==this.timeEl&&(this.timeEl.value=e.toFixed(2));let t=Math.floor(e),n=Math.floor(e%1*60);this.timeLabel.textContent=`${String(t).padStart(2,`0`)}:${String(n).padStart(2,`0`)}`}fade(e,t=600){let n=gf(`fade`);return n.style.transitionDuration=t+`ms`,n.classList.toggle(`show`,e),new Promise(e=>setTimeout(e,t))}},vf=[{x:-.0255,z:-.087,L:[.043,.026,.02],r:.0082,splay:-.07},{x:-.0083,z:-.091,L:[.047,.029,.021],r:.0084,splay:-.015},{x:.0088,z:-.088,L:[.044,.027,.02],r:.0078,splay:.045},{x:.0245,z:-.081,L:[.034,.021,.018],r:.0068,splay:.11}],yf={relaxed:{c:[.32,.38,.44,.5],t:.25,o:.2,s:.3},open:{c:[.06,.05,.07,.1],t:.05,o:0,s:1},point:{c:[0,.85,.9,.92],t:.6,o:.6,s:.1},grip:{c:[.48,.52,.56,.6],t:.42,o:.85,s:.35},pinch:{c:[.36,.5,.62,.68],t:.4,o:1,s:.25},hold:{c:[.34,.37,.42,.48],t:.3,o:.65,s:.5},strum:{c:[.25,.4,.5,.55],t:.2,o:.5,s:.3}},bf=(e,t,n=!1,r=.86)=>{let i=[];for(let a=0;a<=10;a++){let o=a/10,s=e*(1-(1-r)*o);s*=1+Math.exp(-(((o-.08)*9)**2))*.08,o<.12&&(s*=Math.sqrt(Math.max(0,o/.12))*.4+.6),n&&o>.7&&(s*=Math.sqrt(Math.max(0,1-((o-.7)/.3)**2))),i.push(new W(Math.max(4e-4,s),-o*t))}n||i.push(new W(4e-4,-t-e*.15)),i.unshift(new W(4e-4,e*.25));let a=new Pe(i,12);return a.scale(1,1,.82),a.rotateX(Math.PI/2),a.scale(1,1,1),a},xf=e=>e*e*(3-2*e);function Sf(e,t,n,r){let i=new x,a=new x;i.add(a);let o=(e,t,n,r=0,i=0,a=0)=>{let o=new I(e,t);return o.position.set(r,i,a),o.castShadow=!1,o.receiveShadow=!0,o.frustumCulled=!1,n.add(o),o},s=new Ko(.074,.024,.09,4,.011),c=s.attributes.position;for(let e=0;e<c.count;e++){let t=c.getZ(e),n=c.getY(e),r=c.getX(e),i=(t+.046)/.092;c.setY(e,n*(.85+i*.35)+(n<0?-.004*Math.sin(i*Math.PI):0)),c.setX(e,r*(1-i*.12)),n>0&&c.setY(e,c.getY(e)+Math.cos(r*40)*.0012)}s.computeVertexNormals(),o(s,t,a,0,0,-.045),o(new V(.022,14,10),t,a,-.026,-.008,-.03).scale.set(.9,.6,1.4),o(new u(.026,.03,.05,16).rotateX(Math.PI/2),t,a,0,-.002,.012).scale.set(1.25,.75,1);let l=[];for(let e of vf){o(new V(e.r*1.05,10,8),t,a,e.x,.004,e.z+.004).scale.set(1,.65,1);let n=new x;n.position.set(e.x,.002,e.z),n.rotation.y=-e.splay,a.add(n);let i=[n],s=n;e.L.forEach((n,a)=>{let c=e.r*(1-a*.12);if(o(bf(c,n,a===2),t,s),a===2){let e=o(new Ko(c*1.5,.002,n*.55,2,8e-4),r,s,0,c*.82,-n*.62);e.rotation.x=.05}if(a<2){let e=new x;e.position.z=-n+c*.3,s.add(e),i.push(e),s=e}}),l.push({joints:i,splay:e.splay,base:n})}let d=new x;d.position.set(-.034,-.006,-.018),a.add(d);let f=[d],p=d;[.034,.029,.024].forEach((e,n)=>{let i=.0108-n*.0011;if(o(bf(i,e,n===2),t,p),n===2&&o(new Ko(i*1.5,.002,e*.5,2,8e-4),r,p,0,i*.8,-e*.6),n<2){let t=new x;t.position.z=-e+i*.3,p.add(t),f.push(t),p=t}});let m=new x;m.position.set(0,-.004,.03),a.add(m);let h=new u(.038,.047,.4,20,1,!0).rotateX(Math.PI/2);h.translate(0,0,.2);let g=o(h,n,m,0,0,.012);g.material.side=2;let _=new u(.036,.039,.05,28,1,!0).rotateX(Math.PI/2),v=_.attributes.position;for(let e=0;e<v.count;e++){let t=Math.atan2(v.getY(e),v.getX(e)),n=1+Math.cos(t*28)*.03;v.setX(e,v.getX(e)*n),v.setY(e,v.getY(e)*n)}return _.computeVertexNormals(),o(_,n,m,0,0,.012),{root:i,wrist:a,fingers:l,thumb:f,sleeve:m}}var Cf=class{constructor(e,t){this.camera=e;let n=new Ve({map:t.skin.map,normalMap:t.skin.normalMap,normalScale:new W(.35,.35),color:15782592,roughness:.58,sheen:.6,sheenRoughness:.5,sheenColor:new F(.9,.45,.35),clearcoat:.08,clearcoatRoughness:.6,envMapIntensity:.6}),r=new Ve({color:15847624,roughness:.25,clearcoat:.6,sheen:.2});t.knit.map.repeat.set(3,2),t.knit.normalMap.repeat.set(3,2);let i=new R({map:t.knit.map,normalMap:t.knit.normalMap,roughness:1,color:16777215,envMapIntensity:.4});this.R=Sf(t,n,i,r),this.L=Sf(t,n,i,r),this.L.root.scale.x=-1,e.add(this.R.root,this.L.root);for(let e of[this.R,this.L])e.pos=new b(.24,-.62,-.3),e.q=new l,e.pose={...yf.relaxed,c:[...yf.relaxed.c]},e.root.position.copy(e.pos);this.L.pos.x=-.24,this.reachState=null,this.t=0;let a=this.device=new x,o=new I(new Ko(.058,.098,.011,3,.008),new Ve({color:15262940,roughness:.3,clearcoat:.6}));this.devScreen=new R({color:1384479,emissive:7000232,emissiveIntensity:.15,roughness:.2});let s=new I(new Tt(.046,.034),this.devScreen);s.position.set(0,.024,.0058);let c=new I(new bt(.019,24),new R({color:14012613,roughness:.5}));c.position.set(0,-.021,.0058),a.add(o,s,c),a.position.set(-.004,.012,-.055),a.rotation.set(-Math.PI/2,0,0),this.L.wrist.add(a),a.visible=!1,a.scale.x=-1,this.tmp=new b,this.e=new _,this.qi=new l,this.zAxis=new b(0,0,1)}strum(){this.strumT=.35}reach(e,t,n){let r=this.camera.worldToLocal(e.clone()),i=r.length();i>.62&&r.multiplyScalar(.62/i),this.reachState={p:r,kind:t,t:0,fired:!1,onArrive:n}}setPose(e,t,n){let r=yf[t];for(let t=0;t<4;t++)e.pose.c[t]+=(r.c[t]-e.pose.c[t])*n;e.pose.t+=(r.t-e.pose.t)*n,e.pose.o+=(r.o-e.pose.o)*n,e.pose.s+=(r.s-e.pose.s)*n}applyPose(e,t){let n=e.pose;e.fingers.forEach((e,r)=>{let i=n.c[r]+Math.sin(t*.9+r)*.015;e.joints[0].rotation.x=-i*1.35,e.joints[1].rotation.x=-i*1.7,e.joints[2].rotation.x=-i*1.15,e.base.rotation.y=-e.splay*(.4+n.s)});let r=e.thumb;r[0].rotation.set(-.25-n.o*.35,.75-n.o*.45,-.55-n.o*.5),r[1].rotation.x=-n.t*.9,r[2].rotation.x=-n.t*1.1}update(e,t){this.t+=e;let n=this.R,r=this.L,i=Math.min(1,e*10),a=t.bob?t.bob.x*1.6:0,o=t.bob?t.bob.y*1.2:0,s=Math.sin(this.t*1.3)*.004,c,u,d=`relaxed`,f=new b(-.26,-.7,-.32),p=[.2,.2,.3],m=`relaxed`;if(t.swim){let e=(t.swimPhase/(Math.PI*2)%1+1)%1,n=[[0,.07,-.15,-.56],[.35,.34,-.21,-.42],[.6,.11,-.24,-.26],[1,.07,-.15,-.56]],r=0;for(;e>n[r+1][0];)r++;let i=n[r],a=n[r+1],o=xf((e-i[0])/(a[0]-i[0])),s=i[1]+(a[1]-i[1])*o,l=i[2]+(a[2]-i[2])*o,h=i[3]+(a[3]-i[3])*o,g=+(r===0);c=new b(s,l,h),f=new b(-s,l,h),u=[-.15,.1,-.4-g*.5],p=[-.15,.1,-.4-g*.5],d=`open`,m=`open`}else if(t.mode===`seat`||t.mode===`scope`)c=new b(.26,-.75,-.3),u=[0,0,0];else if(t.held&&t.held.instrument){let n=t.held.mesh,r=this.camera.worldToLocal(n.localToWorld(new b(0,.12,.09))),i=this.camera.worldToLocal(n.localToWorld(new b(0,.78,.06)));this.strumT=Math.max(0,(this.strumT||0)-e);let a=this.strumT>0?Math.sin((.35-this.strumT)/.35*Math.PI):0;c=r.add(this.tmp.set(.04,.05-a*.1,.06)),u=[.5+a*.4,.2,-.9],d=`strum`,f=i.add(this.tmp.set(-.02,-.04,.05)),p=[.3,-.6,-1.3],m=`grip`}else if(t.held){let e=t.held,n=e.mesh,r=Math.min(.5,e.size),i=this.camera.worldToLocal(n.position.clone());t.inspecting?(c=i.clone().add(this.tmp.set(r*.42+.035,-r*.18-.01,.06)),u=[.1,.25,-1.25],d=r>.25?`hold`:`grip`,f=i.clone().add(this.tmp.set(-(r*.42+.035),-r*.18-.01,.06)),p=[.1,.25,-1.25],m=`hold`):(c=i.clone().add(this.tmp.set(r*.22+.02,-r*.3-.03,.06)),u=[.45,.25,-.75],d=r<.12?`pinch`:r>.3?`hold`:`grip`)}else if(this.reachState){let t=this.reachState;t.t+=e/.62;let n=t.t<.4?xf(t.t/.4):t.t<.6?1:1-xf((t.t-.6)/.4),r=new b(.2,-.36,-.36),i=t.p.clone().add(this.tmp.set(.012,-.03,.16));c=r.lerp(i,n);let a=t.kind;d=a===`press`?`point`:a===`push`?`open`:n>.7?`grip`:`open`,u=a===`push`?[.25+n*.5,.15,-.35]:a===`press`?[.1,.1,-.3]:[.2,.2,-.8*n],!t.fired&&t.t>=.38&&(t.fired=!0,t.onArrive?.()),t.t>=1&&(this.reachState=null)}else t.hover?(c=new b(.23,-.4,-.4),u=[.15,.15,-.35],d=`relaxed`):(c=new b(.25,-.66,-.32),u=[.2,.15,-.3]);this.device.visible=!!t.music,t.music&&(f=new b(-.09,-.19,-.33),p=[1.15,-.2,.3],m=`hold`,this.devScreen.emissiveIntensity=t.musicOn?.6+Math.sin(this.t*2)*.05:.15),t.held||this.reachState||t.swim||(c.x+=a,c.y+=o+s,f.x+=a,f.y+=o);for(let[a,o,s,h]of[[n,c,u,d],[r,f,p,m]]){let n=a===r;a.pos.lerp(o,t.held?Math.min(1,e*22):i),this.e.set(s[0],n?-s[1]:s[1],n?-s[2]:s[2]);let c=new l().setFromEuler(this.e);a.q.slerp(c,i),a.root.position.copy(a.pos),a.root.quaternion.copy(a.q);let u=this.tmp.set(n?-.3:.3,-.5,.02).sub(a.pos),d=u.length();u.normalize().applyQuaternion(this.qi.copy(a.q).invert()),n&&(u.x=-u.x),a.sleeve.quaternion.setFromUnitVectors(this.zAxis,u),a.sleeve.scale.set(1,1,Math.max(.4,Math.min(1.2,d/.4))),this.setPose(a,h,Math.min(1,e*12)),this.applyPose(a,this.t),a.root.visible=a.pos.y>-.62||o.y>-.6}}},wf=.43,Tf=.43,Ef=.085;function Df(e,t=18){return new Pe(e.map(([e,t])=>new W(e,t)),t)}var Of=class{constructor(e,t){let n=new Ve({map:t.skin.map,normalMap:t.skin.normalMap,normalScale:new W(.3,.3),color:15782592,roughness:.58,sheen:.5,sheenColor:new F(.9,.45,.35)}),r=t.knit.map.clone();r.repeat.set(4,3),r.needsUpdate=!0;let i=t.knit.normalMap.clone();i.repeat.set(4,3),i.needsUpdate=!0;let a=new R({map:r,normalMap:i,roughness:1,side:2}),o=t.denim.map.clone();o.repeat.set(2,3),o.needsUpdate=!0;let s=t.denim.normalMap.clone();s.repeat.set(2,3),s.needsUpdate=!0;let c=new R({map:o,normalMap:s,roughness:.9,side:2}),l=new R({map:t.leather.map,normalMap:t.leather.normalMap,roughness:.55,color:16777215}),d=new R({color:1907223,roughness:.9}),f=new R({color:2759698,roughness:.5});this.mats={skin:n,sweater:a,jeans:c};let p=this.root=new x;e.add(p);let h=(e,t,n,r=0,i=0,a=0)=>{let o=new I(e,t);return o.position.set(r,i,a),o.castShadow=!0,o.receiveShadow=!0,n.add(o),o},g=this.pelvis=new x;g.position.y=.92,p.add(g);let _=Df([[0,-.13],[.13,-.12],[.165,-.04],[.16,.06],[.145,.1],[0,.1]]);_.scale(1.1,1,.78),h(_,c,g),h(new m(.152,.012,6,28).rotateX(Math.PI/2).scale(1.1,1,.78),f,g,0,.075,0),h(new Ko(.05,.035,.01,2,.004),new R({color:10520656,metalness:1,roughness:.3}),g,0,.075,-.125),this.legs=[];for(let e of[-1,1]){let t=new x;t.position.set(e*.092,-.05,0),g.add(t),h(Df([[0,.02],[.08,0],[.083,-.12],[.07,-.3],[.058,-.41],[0,-.45]]),c,t);let n=new x;n.position.y=-.43,t.add(n),h(Df([[0,.03],[.058,.02],[.062,-.1],[.05,-.25],[.056,-.4],[0,-.43]]),c,n);let r=new x;r.position.y=-.43,n.add(r),h(new u(.058,.062,.14,16),l,r,0,0,.005);let i=new Ko(.105,.09,.27,4,.04),a=i.attributes.position;for(let e=0;e<a.count;e++){let t=a.getZ(e),n=a.getY(e);t<-.05&&n>0&&a.setY(e,n- -(t+.05)*.35)}i.computeVertexNormals(),h(i,l,r,0,-.085+.045,-.06),h(new Ko(.112,.022,.285,2,.008),d,r,0,-.085-.003,-.06);for(let e=0;e<4;e++)h(new Fe(.05,.004,.006),f,r,0,0-e*.025+.02,-.06-e*.012).rotation.x=.4;this.legs.push({hip:t,knee:n,ankle:r,side:e})}let v=this.spine=new x;v.position.y=.05,g.add(v);let y=Df([[0,-.02],[.148,-.01],[.155,.08],[.17,.2],[.182,.32],[.178,.4],[.15,.46],[.09,.5],[.06,.52],[0,.52]],24);y.scale(1.18,1,.74),this.torso=h(y,a,v),h(new m(.15,.014,6,30).rotateX(Math.PI/2).scale(1.18,1,.74),a,v,0,0,0),h(new m(.065,.016,6,20).rotateX(Math.PI/2),a,v,0,.51,0);let S=this.head=new x;S.position.set(0,.6,0),v.add(S);let C=new R({color:3811870,roughness:.75,map:t.knit.map}),w=new R({color:15920872,roughness:.2}),T=new R({color:3811866,roughness:.1}),E=new R({color:12089966,roughness:.5});this.headMeshes=[];let D=(e,t,n,r,i)=>{let a=h(e,t,S,n,r,i);return this.headMeshes.push(a),a};D(new u(.052,.058,.12,14),n,0,-.06,.005);let O=new V(.1,28,22),k=O.attributes.position;for(let e=0;e<k.count;e++){let t=k.getX(e),n=k.getY(e),r=k.getZ(e),i=Math.max(0,-n/.1);t*=1-i*.28,r*=1-i*.12,r<0&&n>.01&&n<.04&&(r-=.006),k.setXYZ(e,t*.86,n*1.18,r)}O.computeVertexNormals(),D(O,n,0,.065,-.005);let A=D(new ae(.014,.04,10),n,0,.06,-.103);A.rotation.x=-Math.PI/2-.35,A.scale.set(1,1,.8);for(let e of[-1,1]){D(new V(.0115,12,10),w,e*.032,.085,-.084).scale.set(1,.7,.6),D(new V(.006,10,8),T,e*.032,.085,-.091).scale.set(1,1,.4);let t=D(new Fe(.03,.006,.01),C,e*.033,.104,-.09);t.rotation.z=e*-.12,D(new V(.022,10,8),n,e*.084,.065,0).scale.set(.35,1,.75)}D(new Fe(.034,.006,.008),E,0,.022,-.096);let j=new V(.107,24,16,0,Math.PI*2,0,Math.PI*.58),M=j.attributes.position;for(let e=0;e<M.count;e++){let t=M.getZ(e),n=M.getY(e);t<-.06&&n<.06&&M.setY(e,n+.02)}j.computeVertexNormals(),D(j,C,0,.083,.008).scale.set(.9,1.08,1.05),D(new V(.09,16,10,0,Math.PI*2,Math.PI*.45,Math.PI*.3),C,0,.06,.02).scale.set(.95,1.1,1.1),this.setHeadVisible(!1),this.arms=[];for(let e of[-1,1]){let t=new x;t.position.set(e*.2,.44,0),v.add(t),h(new V(.06,12,10),a,t).scale.set(1,.9,1),h(Df([[0,.02],[.056,0],[.054,-.12],[.047,-.29+.02],[0,-.31]]),a,t);let r=new x;r.position.y=-.29,t.add(r),h(Df([[0,.02],[.047,.01],[.046,-.1],[.04,-.26+.02],[0,-.26]]),a,r);let i=new x;i.position.y=-.26,r.add(i),h(new u(.026,.03,.05,12),n,i,0,-.015,0).scale.set(1.2,1,.8),h(new Ko(.075,.09,.03,3,.012),n,i,0,-.075,0).scale.set(1,1,1),h(new Ko(.07,.075,.026,3,.012),n,i,0,-.15,-.006).rotation.x=.35,h(new xe(.012,.045,3,8),n,i,e*-0,-.07,-.03).rotation.set(.3,0,e*.5),this.arms.push({sh:t,el:r,wr:i,side:e})}this.armsGroup=this.arms.map(e=>e.sh),this.yaw=0,this.t=0,this.visible=!0,this.lean=0,this.pelvisY=.92,this.swimBlend=0,this.crouchBlend=0,this.tmp=new b}solveLeg(e,t,n,r=0){let i=Math.hypot(t,n);i=Math.min(.858,Math.max(.12,i));let a=Math.atan2(t,n),o=Math.acos(Math.min(1,Math.max(-1,(wf*wf+i*i-Tf*Tf)/(2*wf*i)))),s=Math.acos(Math.min(1,Math.max(-1,(.36979999999999996-i*i)/(2*wf*Tf)))),c=a+o,l=Math.PI-s;e.hip.rotation.set(c,0,r*e.side),e.knee.rotation.x=-l,e.ankle.rotation.x=-(c-l)-this.lean*0}update(e,t){this.t+=e;let n=this.root;if(t.third!==this.third&&(this.third=t.third,this.setHeadVisible(!!t.third)),t.swim&&!t.third){n.visible=!1;return}if(n.visible=!0,t.mode===`seat`&&t.seat?.lie){this.lie(t.seat.getEye?t.seat.getEye():t.seat.eye,t.seat.yaw);return}n.rotation.order=`XYZ`;let r=t.yaw-this.yaw;r=Math.atan2(Math.sin(r),Math.cos(r)),(t.speed>.3||Math.abs(r)>.7||t.mode!==`walk`)&&(this.yaw+=r*Math.min(1,e*(t.speed>.3?10:5))),n.rotation.set(0,this.yaw,0);let i=.12,a=Math.sin(this.yaw),o=Math.cos(this.yaw),s=+!!t.swim;if(this.swimBlend+=(s-this.swimBlend)*Math.min(1,e*4),this.crouchBlend+=(t.crouch-this.crouchBlend)*Math.min(1,e*8),t.mode===`seat`){let e=t.eye,r=!!t.seat?.low,i=e.y-(r?.86:1.12);n.position.set(e.x+a*.12,i,e.z+o*.12),this.pelvis.position.y=r?.16:.5,this.pelvis.rotation.x=0,this.spine.rotation.x=r?.05:-.12;for(let e of this.legs)r?(this.solveLeg(e,.4,.05,.95),e.knee.rotation.z=0):this.solveLeg(e,.48,.48,.05);for(let e of this.arms)e.sh.rotation.set(.55,0,e.side*.15),e.el.rotation.x=.9,e.wr.rotation.x=0;this.armsVisible(!t.handsActive);return}n.position.set(t.pos.x+a*i,t.pos.y,t.pos.z+o*i);let c=Math.min(1,t.speed/4.6),l=Math.min(1,t.speed/1.2),u=t.travel/t.stepLen*Math.PI,d=.915-this.crouchBlend*.38-Math.abs(Math.sin(u))*.025*l;if(t.onGround||t.climbing||t.swim||(d-=.06),this.lean=this.crouchBlend*.35+c*.12+Math.max(-.2,Math.min(.35,-t.pitch*.25)),this.swimBlend>.01){let e=this.swimBlend,r=t.swimPhase;n.position.y=t.waterY-1.32,this.pelvis.position.y=.92,this.pelvis.rotation.x=-1.15*e,this.spine.rotation.x=.35*e;for(let t of this.legs)t.hip.rotation.set(Math.sin(r*2.2+(t.side>0?Math.PI:0))*.3*e-.05,0,t.side*.06),t.knee.rotation.x=-.25-Math.max(0,Math.sin(r*2.2+(t.side>0?0:Math.PI)))*.4,t.ankle.rotation.x=.9;for(let e of this.arms){r%(Math.PI*2);let t=Math.sin(r)*.5+.5;e.sh.rotation.set(-2.6+t*1.6,0,e.side*(.3+(1-t)*.9)),e.el.rotation.x=.2+(1-t)*1.2,e.wr.rotation.x=0}this.armsVisible(!t.handsActive)}else{this.pelvis.position.y=d,this.pelvis.rotation.x=0,this.spine.rotation.x=this.lean,this.torso.scale.set(1,1+Math.sin(this.t*1.6)*.008,1+Math.sin(this.t*1.6)*.012);for(let e of this.legs){let n=u+(e.side>0?Math.PI:0),r=(.2+c*.32)*l,i=(.07+c*.14)*l;this.crouchBlend>.5&&(r*=.7,i*=.6);let a=Math.cos(n)*r+this.crouchBlend*.12,o=d-.05-Ef-Math.max(0,-Math.sin(n))*i;t.climbing&&(a=.22,o=d-.05-Ef-(Math.sin(this.t*4+(e.side>0?Math.PI:0))*.5+.5)*.3),!t.onGround&&!t.climbing&&(a=.08,o-=.08),this.solveLeg(e,a,o,.03+this.crouchBlend*.08)}for(let e of this.arms){let n=u+(e.side>0?0:Math.PI),r=Math.cos(n)*(.25+c*.55)*l,i=.15+c*.9+this.crouchBlend*.3;t.climbing&&(r=-2.5+Math.sin(this.t*4+(e.side>0?0:Math.PI))*.3,i=.4),e.sh.rotation.set(r-this.lean*.6+Math.sin(this.t*1.6)*.01,0,e.side*.08),e.el.rotation.x=i,e.wr.rotation.x=.1}this.armsVisible(!t.handsActive)}}armsVisible(e){for(let t of this.arms)t.el.visible=e}setHeadVisible(e){for(let t of this.headMeshes){if(!t.userData.base){t.userData.base=t.material;let e=t.material.clone();e.colorWrite=!1,e.depthWrite=!1,t.userData.ghost=e}t.material=e?t.userData.base:t.userData.ghost}}lie(e,t){let n=new b(-Math.sin(t),0,-Math.cos(t)),r=n.clone().negate(),i=new b(0,-1,0),a=new b().crossVectors(r,i);this.root.quaternion.setFromRotationMatrix(new yt().makeBasis(a,r,i)),this.root.position.copy(e).addScaledVector(n,1.6).add(this.tmp.set(0,-.16,0)),this.pelvis.position.y=.92,this.pelvis.rotation.x=0,this.spine.rotation.x=0;for(let e of this.legs)e.hip.rotation.set(.04,0,e.side*.05),e.knee.rotation.x=-.12,e.ankle.rotation.x=.4;for(let e of this.arms)e.sh.rotation.set(.1,0,e.side*.12),e.el.rotation.x=.3,e.wr.rotation.x=0;this.armsVisible(!0)}},kf=e=>440*2**((e-69)/12),Af=[[[2,`m7`],[7,`7`],[0,`maj7`],[9,`m7`]],[[0,`maj7`],[4,`m7`],[9,`m7`],[5,`maj7`]],[[9,`m9`],[5,`maj9`],[0,`maj9`],[7,`7sus`]],[[5,`maj7`],[4,`m7`],[2,`m7`],[0,`maj9`]],[[0,`maj9`],[5,`maj7`],[2,`m9`],[7,`13`]],[[9,`m7`],[2,`m7`],[7,`7`],[0,`maj7`]]],jf={maj7:[0,4,7,11],maj9:[0,4,7,11,14],m7:[0,3,7,10],m9:[0,3,7,10,14],7:[0,4,7,10],"7sus":[0,5,7,10],13:[0,4,10,14,21]},Mf=[0,2,4,7,9,12,14,16],Nf=[{title:`Rain on the Porch`,seed:11,key:62,bpm:74,prog:0,lead:`vibes`},{title:`Kettle's On`,seed:23,key:65,bpm:80,prog:1,lead:`guitar`},{title:`Moss & Lantern`,seed:37,key:57,bpm:70,prog:2,lead:`lead`},{title:`Slow Lake`,seed:41,key:63,bpm:68,prog:3,lead:`vibes`},{title:`Pine Needles`,seed:53,key:60,bpm:84,prog:4,lead:`guitar`},{title:`Window Seat`,seed:67,key:64,bpm:76,prog:5,lead:`lead`},{title:`Embers`,seed:71,key:58,bpm:72,prog:0,lead:`guitar`},{title:`After the Storm`,seed:89,key:61,bpm:78,prog:2,lead:`vibes`}],Pf=class{constructor(e){this.a=e;let t=this.ctx=e.ctx;this.out=e.gain(.75),this.out.connect(e.musicBus),this.tone=e.filter(`lowpass`,7e3,.4);let n=t.createWaveShaper(),r=new Float32Array(2048);for(let e=0;e<2048;e++){let t=e/1024-1;r[e]=Math.tanh(t*1.4)/Math.tanh(1.4)}n.curve=r,this.bus=e.gain(.8),e.chain(this.bus,n,this.tone,this.out),this.verb=t.createConvolver(),this.verb.buffer=this.impulse(2.2),this.verbSend=e.gain(.22),this.bus.connect(this.verbSend),this.verbSend.connect(this.verb),this.verb.connect(this.tone);let i=e.src(e.pink,!0);this.hissG=e.gain(0),e.chain(i,e.filter(`highpass`,2500),this.hissG,this.out),i.start();let a=e.src(e.pink,!0,.8);this.natureG=e.gain(0),e.chain(a,e.filter(`bandpass`,2400,.5),this.natureG,this.out),a.start(),this.nature=!0,this.track=0,this.playing=!1,this.pos=0,this.duration=180,this.timer=setInterval(()=>this.schedule(),60),this.crackleT=0}impulse(e){let t=this.ctx.sampleRate,n=Math.floor(t*e),r=this.ctx.createBuffer(2,n,t);for(let e=0;e<2;e++){let t=r.getChannelData(e);for(let e=0;e<n;e++)t[e]=(Math.random()*2-1)*(1-e/n)**2.6}return r}load(e){this.track=(e+Nf.length)%Nf.length;let t=Nf[this.track];this.r=z(t.seed),this.beat=60/t.bpm,this.step=0,this.bar=0,this.prog=Af[t.prog],this.bars=48+Math.floor(this.r()*16),this.duration=this.bars*4*this.beat,this.motif=Array.from({length:8},()=>this.r()<.55?Mf[Math.floor(this.r()*Mf.length)]:null),this.next=this.ctx.currentTime+.15,this.startTime=this.next}play(e=this.track){this.a.resume(),e!==this.track||!this.r?this.load(e):(this.next=this.ctx.currentTime+.1,this.startTime=this.ctx.currentTime-this.pos),this.playing=!0,this.fade(!0)}pause(){this.playing=!1,this.fade(!1)}toggle(){this.playing?this.pause():this.play()}nextTrack(){this.load(this.track+1),this.playing&&this.fade(!0),this.pos=0}prevTrack(){this.load(this.track-1),this.playing&&this.fade(!0),this.pos=0}setVolume(e){this.out.gain.setTargetAtTime(e,this.ctx.currentTime,.1)}setNature(e){this.nature=e,this.fade(this.playing)}fade(e){let t=this.ctx.currentTime;this.bus.gain.setTargetAtTime(e?.8:0,t,.15),this.hissG.gain.setTargetAtTime(e?.012:0,t,.3),this.natureG.gain.setTargetAtTime(e&&this.nature?.035:0,t,.6)}get title(){return Nf[this.track].title}env(e,t,n,r,i,a=1e-4){e.gain.setValueAtTime(1e-4,t),e.gain.linearRampToValueAtTime(r,t+n),e.gain.exponentialRampToValueAtTime(Math.max(a,1e-4),t+n+i)}wobble(e,t,n){e.detune.setValueAtTime(Math.sin(t*.7)*9,t),e.detune.linearRampToValueAtTime(Math.sin((t+n)*.7)*9,t+n)}keys(e,t,n,r){let i=this.ctx,a=i.createOscillator(),o=i.createOscillator(),s=this.a.gain(0),c=this.a.gain(0),l=this.a.filter(`lowpass`,2400,.6);a.frequency.value=e,o.frequency.value=e*1.002,o.connect(s).connect(a.frequency),s.gain.setValueAtTime(e*1.6*r,t),s.gain.exponentialRampToValueAtTime(e*.08,t+.9),this.wobble(a,t,n),this.a.chain(a,l,c,this.bus),c.gain.setValueAtTime(1e-4,t),c.gain.linearRampToValueAtTime(.07*r,t+.012),c.gain.exponentialRampToValueAtTime(.025*r,t+.5),c.gain.exponentialRampToValueAtTime(1e-4,t+n),a.start(t),o.start(t),a.stop(t+n+.05),o.stop(t+n+.05)}bass(e,t,n,r){let i=this.ctx,a=i.createOscillator(),o=i.createOscillator(),s=this.a.gain(0),c=this.a.filter(`lowpass`,420,1.2);a.type=`triangle`,a.frequency.value=e,o.type=`sine`,o.frequency.value=e/2,a.connect(c),o.connect(c),this.a.chain(c,s,this.bus),this.env(s,t,.008,.2*r,Math.min(n,.9)),a.start(t),o.start(t),a.stop(t+n+.05),o.stop(t+n+.05)}noise(e,t,n,r,i,a,o=1){let s=this.a.src(this.a.white,!1,o),c=this.a.filter(n,t,r),l=this.a.gain(0);this.a.chain(s,c,l,this.bus),this.env(l,e,.002,a,i),s.start(e,Math.random()*2),s.stop(e+i+.05)}kick(e,t){let n=this.ctx.createOscillator(),r=this.a.gain(0);n.frequency.setValueAtTime(115,e),n.frequency.exponentialRampToValueAtTime(42,e+.14),n.connect(r).connect(this.bus),this.env(r,e,.003,.5*t,.32),n.start(e),n.stop(e+.4),this.noise(e,3e3,`bandpass`,1,.01,.05*t)}snare(e,t){this.noise(e,1900,`bandpass`,.7,.16,.18*t);let n=this.ctx.createOscillator(),r=this.a.gain(0);n.frequency.value=185,n.connect(r).connect(this.bus),this.env(r,e,.002,.12*t,.08),n.start(e),n.stop(e+.12)}lead(e,t,n,r,i){if(e===`guitar`){let e=this.ctx.sampleRate,r=Math.floor(e*1.6),a=this.ctx.createBuffer(1,r,e),o=a.getChannelData(0),s=Math.max(2,Math.round(e/t));for(let e=0;e<s;e++)o[e]=Math.random()*2-1;for(let e=s;e<r;e++)o[e]=(o[e-s]+o[e-s+1])*.497;let c=this.a.src(a,!1),l=this.a.gain(.12*i),u=this.a.filter(`lowpass`,2800);this.a.chain(c,u,l,this.bus),c.start(n);return}let a=this.ctx.createOscillator(),o=this.a.gain(0);if(e===`vibes`){[1,4,10].forEach((e,r)=>{let a=this.ctx.createOscillator(),o=this.a.gain(0);a.frequency.value=t*e,a.connect(o).connect(this.bus),this.env(o,n,.003,.06*i/(r*2+1),1.4/(r+1)),a.start(n),a.stop(n+1.6)});return}a.type=`triangle`,a.frequency.value=t,this.wobble(a,n,r);let s=this.ctx.createOscillator(),c=this.a.gain(t*.008);s.frequency.value=5,s.connect(c).connect(a.frequency),this.a.chain(a,this.a.filter(`lowpass`,1800),o,this.bus),o.gain.setValueAtTime(1e-4,n),o.gain.linearRampToValueAtTime(.05*i,n+.06),o.gain.setValueAtTime(.05*i,n+r*.7),o.gain.linearRampToValueAtTime(1e-4,n+r),a.start(n),s.start(n),a.stop(n+r+.05),s.stop(n+r+.05)}pad(e,t,n){let r=this.a.gain(0),i=this.a.filter(`lowpass`,900,.4);for(let r of e)for(let e of[-8,7]){let a=this.ctx.createOscillator();a.type=`sawtooth`,a.frequency.value=r,a.detune.value=e,a.connect(i),a.start(t),a.stop(t+n+.1)}this.a.chain(i,r,this.bus),r.gain.setValueAtTime(1e-4,t),r.gain.linearRampToValueAtTime(.012,t+n*.35),r.gain.linearRampToValueAtTime(1e-4,t+n)}schedule(){if(!this.playing||!this.r)return;let e=this.ctx.currentTime;this.pos=e-this.startTime,Math.random()<.25&&this.noise(e+.05,3e3+Math.random()*4e3,`bandpass`,3,.004,.02+Math.random()*.04),this.next<e&&(this.next=e+.05);let t=Nf[this.track],n=this.r,r=this.beat,i=r/4;for(;this.next<e+.35;){let e=this.next,a=this.step%16,o=this.bar;if(o>=this.bars){this.nextTrack();return}let s=o<4?`intro`:o>=this.bars-4?`outro`:Math.floor((o-4)/8)%3==2?`break`:`main`,[c,l]=this.prog[Math.floor(o/1)%this.prog.length],u=t.key+c,d=e+(a%2?i*.18:0)+(n()-.5)*.006,f=.75+n()*.25;if(a===0){let t=jf[l].map(e=>u+e);t.forEach((t,n)=>this.keys(kf(t),e+n*.018,r*(s===`intro`?4:3.4),.8)),s!==`intro`&&this.pad(t.slice(0,3).map(e=>kf(e-12)),e,r*4)}if(a===10&&n()<.5&&jf[l].slice(1).forEach((e,t)=>this.keys(kf(u+e),d+t*.015,r*1.2,.45)),(s===`main`||s===`outro`)&&((a===0||a===10&&n()<.7||a===7&&n()<.25)&&this.kick(d,f),(a===4||a===12)&&this.snare(d,f),a%2==0&&this.noise(d,8e3,`highpass`,.7,a%4==0?.05:.03,(a%4==0?.045:.025)*f),a%4==2&&n()<.5&&this.noise(d,5500,`bandpass`,2,.06,.02,.6),a===14&&n()<.3&&this.noise(d,2600,`bandpass`,6,.03,.08)),s!==`intro`&&(a===0&&this.bass(kf(u-24),d,r*1.6,1),a===8&&n()<.8&&this.bass(kf(u-24+(n()<.5?7:12)),d,r*1.2,.8),a===14&&n()<.4&&this.bass(kf(u-24+10),d,r*.4,.6)),s===`main`&&a%2==0){let e=(a/2+o*3)%8,i=this.motif[e];i!==null&&(o%4<2||n()<.4)&&(o%8>=4&&n()<.35&&(i=Mf[Math.floor(n()*Mf.length)]),this.lead(t.lead,kf(t.key+12+i),d,r*(.5+n()*.8),.9))}s===`break`&&a===0&&n()<.6&&this.lead(`vibes`,kf(t.key+24+Mf[Math.floor(n()*5)]),d,r,.6),this.next+=i,this.step++,this.step%16==0&&this.bar++}}},Ff=class{constructor(e,t=600){this.n=t,this.pos=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.size=new Float32Array(t),this.alpha=new Float32Array(t),this.floor=new Float32Array(t).fill(-100),this.kind=new Uint8Array(t);let n=new Ye;this.pa=new nt(this.pos,3),this.pa.setUsage(p),this.aa=new nt(this.alpha,1),this.aa.setUsage(p),this.sa=new nt(this.size,1),this.sa.setUsage(p),n.setAttribute(`position`,this.pa),n.setAttribute(`alpha`,this.aa),n.setAttribute(`size`,this.sa),this.u={uLight:{value:new F(1,1,1)}};let r=new d({uniforms:this.u,transparent:!0,depthWrite:!1,vertexShader:`attribute float alpha; attribute float size; varying float vA;
        void main(){ vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * 260.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform vec3 uLight; varying float vA;
        void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c);
          float body = smoothstep(0.5, 0.2, d); float hi = smoothstep(0.22, 0.0, length(c - vec2(-0.12, -0.12)));
          gl_FragColor = vec4(uLight * (0.75 + hi * 0.6), body * vA * 0.75); }`});this.points=new f(n,r),this.points.frustumCulled=!1,e.add(this.points),this.next=0}spawn(e,t,n,r,i,a,o,s,c=0,l=-100){let u=this.next;this.next=(this.next+1)%this.n,this.pos[u*3]=e,this.pos[u*3+1]=t,this.pos[u*3+2]=n,this.vel[u*3]=r,this.vel[u*3+1]=i,this.vel[u*3+2]=a,this.size[u]=o,this.life[u]=s,this.kind[u]=c,this.floor[u]=l}burst(e,t=1,n=18,r=Wi){let i=Math.round(n*t);for(let n=0;n<i;n++){let n=Math.random()*Math.PI*2,i=Math.random(),a=(1.2+Math.random()*2.2)*t;this.spawn(e.x+Math.cos(n)*i*.15,r+.02,e.z+Math.sin(n)*i*.15,Math.cos(n)*(.4+i)*t,a,Math.sin(n)*(.4+i)*t,.012+Math.random()*.02*t,.5+Math.random()*.5,0,r-.02)}}drip(e,t,n,r){this.spawn(e,t,n,0,-.5,0,.014,3,1,r)}bubbles(e,t=6){for(let n=0;n<t;n++)this.spawn(e.x+(Math.random()-.5)*.3,e.y+(Math.random()-.5)*.2,e.z+(Math.random()-.5)*.3,0,.2,0,.01+Math.random()*.015,4,2)}update(e,t){this.u.uLight.value.copy(t);let n=this.pos,r=this.vel;for(let t=0;t<this.n;t++)if(this.life[t]<=0)this.alpha[t]=0;else{if(this.life[t]-=e,this.kind[t]===2){if(r[t*3+1]=Math.min(.9,r[t*3+1]+e*1.5),r[t*3]=Math.sin(this.life[t]*9+t)*.08,r[t*3+2]=Math.cos(this.life[t]*7+t)*.08,n[t*3+1]>-.48){this.life[t]=0;continue}}else r[t*3+1]-=9.8*e;if(n[t*3]+=r[t*3]*e,n[t*3+1]+=r[t*3+1]*e,n[t*3+2]+=r[t*3+2]*e,this.kind[t]!==2&&n[t*3+1]<this.floor[t]){if(this.kind[t]===1){let e=n[t*3],r=this.floor[t],i=n[t*3+2];this.life[t]=0;for(let t=0;t<3;t++){let t=Math.random()*6.28;this.spawn(e,r+.01,i,Math.cos(t)*.4,.6+Math.random()*.6,Math.sin(t)*.4,.008,.3,0,r-.01)}continue}this.life[t]=0}this.alpha[t]=Math.min(1,this.life[t]*3)}this.pa.needsUpdate=!0,this.aa.needsUpdate=!0,this.sa.needsUpdate=!0}},If=()=>new Promise(e=>requestAnimationFrame(()=>e()));async function Lf({container:e,settings:t,audio:n,onProgress:r,onExit:i}){let o=Me[t.quality];ta(t.region||`pines`),Ia();let s=Gi.id===`hollow`,c={roofs:[],indoor:()=>!1,openness:()=>0,eaves:[]},l=(e,t)=>r?.(e,t);l(.02,`Waking the renderer`);let u=new Ui({antialias:o.antialias,powerPreference:`high-performance`,stencil:!1}),d=Math.min(window.devicePixelRatio||1,o.maxPixelRatio),f=o.pixelRatio;u.setPixelRatio(d*f),u.setSize(innerWidth,innerHeight),u.toneMapping=4,u.toneMappingExposure=1,u.outputColorSpace=a,u.shadowMap.enabled=o.shadows,u.shadowMap.type=1,u.shadowMap.autoUpdate=!1,u.domElement.id=`world-canvas`,e.insertBefore(u.domElement,e.firstChild);let p=new ce,m=new oe(t.fov,innerWidth/innerHeight,.05,2e3);p.add(m);let h=await Pa(o,(e,t)=>l(.05+e*.45,`Weaving textures · `+t)),g=u.capabilities.getMaxAnisotropy();for(let e of Object.values(h))(e.map?[e.map,e.normalMap]:[e]).forEach(e=>e&&(e.anisotropy=Math.min(8,g)));let _=Zo(h);l(.52,`Shaping the valley`),await If();let v=new Ua(o,h);p.add(v.mesh);let y=new Is,x=new Ud,S=new eo(p,u,o),C=(e,t)=>{for(let n of c.roofs)if(e>n.x0&&e<n.x1&&t>n.z0&&t<n.z1)return n.y(e,t);return null},w=new ao(p,o,(e,t,n)=>{let r=C(e,t);if(r!==null)return r;let i=v.heightAt(e,t),a=y.supportHeight(e,t,.01,n+.5),o=Math.max(i,a);return o<-.45?Wi:o});w.setMode(t.weather),l(.58,`Filling the lake`),await If();let T=new lo(p,o,h,v);l(.62,`Growing the forest`),await If();let E=new Oo(p,o,h,v,y,u),D=new ko(p,o,v),O=new Ff(p,o.key===`low`?300:700);if(T.reflective){let e=T.mesh.onBeforeRender,t=0;T.mesh.onBeforeRender=function(...n){t++&1&&o.key!==`ultra`||(D.setVisible(!1),O.points.visible=!1,w.rain.visible=!1,e.apply(this,n),D.setVisible(!0),O.points.visible=!0,w.rain.visible=w.w.rain>.02)}}let k=new _f(t,{}),A=new Wd(u.domElement,k),j=new Xd(m,A,v,y,n,t),M=new nf({camera:m,input:A,physics:x,audio:n,player:j,ui:k}),ee=new Cf(m,h),te=new Of(p,h);S.sun.shadow.camera.layers.enableAll(),j.onSplash=(e,t)=>{O.burst(e,t,22),n?.splash(e.clone?e.clone():e,Math.min(1,.3+t*.6)),ne?.splashAt(e)},j.onStroke=(e,t)=>{let r=new b(-Math.sin(j.yaw),0,-Math.cos(j.yaw));for(let t of[-1,1])O.burst({x:e.x+r.x*.5+r.z*t*.35,z:e.z+r.z*.5-r.x*t*.35},.45,10);n?.noiseHit(new b(e.x,Wi,e.z),{type:`bandpass`,f:700+Math.random()*500,q:.8,a:.03,d:.35,v:.22}),n?.noiseHit(new b(e.x,Wi,e.z),{buf:n.pink,type:`highpass`,f:2200,a:.05,d:.3,v:.1}),ne?.ring(e.x,e.z,.8,.5)};let ne=null;j.onScope=e=>k.setScope(e),w.splashFx=(e,t,n)=>{for(let r=0;r<2;r++){let r=Math.random()*6.28;O.spawn(e,t+.02,n,Math.cos(r)*.5,.8+Math.random()*.9,Math.sin(r)*.5,.007+Math.random()*.006,.4,0,t)}},M.hands=ee,A.touch&&(M.coneAngle=.16);let re={hour:t.startHour},ie=[],N={scene:p,M:_,T:h,ix:M,col:y,phys:x,audio:n,terrain:v,weather:w,player:j,ui:k,clock:re,updaters:ie,quality:o,rockMat:E.rockMat,makeRadio:e=>n?new hf(n,e):null};if(N.sky=S,l(.72,s?`Raising the tea house`:`Raising the cabin`),await If(),s)c=Ms(N);else{let e=Os(N);l(.8,`Building the dock and tree house`),await If(),Fs(N),c={indoor:e.indoor,openness:e.openness,placeY:{},roofs:[{x0:-6.7,x1:6.7,z0:-4.1,z1:4.1,y:(e,t)=>K+5-2/3.5*Math.abs(t)+.26},{x0:-6.5,x1:2.8,z0:4.1,z1:6.6,y:(e,t)=>K+2.46-(t-5.1)*.14+.08}],rainRects:[[-6.8,-4.2,6.8,4.2,5.9],[-6.5,3.5,2.8,6.6,3.3]],eaves:[[-6.6,-4.12,6.6,-4.12,K+2.66],[2.85,4.12,6.65,4.12,K+2.66],[-6.4,6.62,2.7,6.62,K+2.18]]}}j.occluders=M.occluders;{let[e,t]=c.rainRects;w.rainU.uRoof.value.set(e[0],e[1],e[2],e[3]),w.rainU.uRoofY.value=e[4],w.rainU.uRoof2.value.set(t[0],t[1],t[2],t[3]),w.rainU.uRoof2Y.value=t[4]}N.splashes=O,ne=new ff(N),N.koiFeed=e=>ne.feed(e),x.addTerrain(v,0,18,150,1);for(let e of y.cyl.values())for(let t of e)Math.hypot(t.x,t.z-18)<75&&x.addCylinder(t);x.onImpact=(e,t)=>n?.impact(e,t),s?j.teleport(1.2,void 0,13.5,.15):j.teleport(-1.6,void 0,11.5,.05),j.pitch=.02;let ae=null;o.bloom&&(ae=new Ro(u),ae.addPass(new zo(p,m)),ae.addPass(new Vo(new W(innerWidth,innerHeight),.32,.55,.88)),ae.addPass(new Uo));let se=()=>ae?ae.render():u.render(p,m),le=()=>{u.setSize(innerWidth,innerHeight),ae&&(ae.setPixelRatio(u.getPixelRatio()),ae.setSize(innerWidth,innerHeight))};l(.88,`Warming shaders`),await If(),S.update(.016,re.hour,w.w,m.position,0);try{await u.compileAsync(p,m)}catch{u.compile(p,m)}l(1,`Ready`);let ue=!1,de=!0,fe=!1,pe=e=>{ue=e,k.showMenu(e),n&&(e?n.master.gain.setTargetAtTime(t.volume*.35,n.now,.2):n.setVolume(t.volume))},me=!1,he=e=>document.getElementById(e),P=n?new Pf(n):null,ge=e=>`${Math.floor(e/60)}:${String(Math.floor(e%60)).padStart(2,`0`)}`,_e=()=>{P&&(he(`pl-title`).textContent=P.title,he(`pl-state`).textContent=P.playing?`Now playing`:`Paused`,he(`pl-num`).textContent=`${P.track+1} / 8`,he(`pl-nature`).classList.toggle(`on`,P.nature),he(`pl-dur`).textContent=ge(P.duration))},ve=!1,ye=e=>{ve=e,he(`player`).classList.toggle(`open`,e),e&&P&&!P.r&&P.load(0),_e(),me=e,e?A.exitLock():!A.touch&&!ue&&A.requestLock()};P&&(he(`pl-play`).onclick=()=>{P.toggle(),_e()},he(`pl-next`).onclick=()=>{P.nextTrack(),P.playing||P.play(P.track),_e()},he(`pl-prev`).onclick=()=>{P.prevTrack(),P.playing||P.play(P.track),_e()},he(`pl-nature`).onclick=()=>{P.setNature(!P.nature),_e()},he(`pl-vol`).oninput=e=>P.setVolume(Number(e.target.value)),addEventListener(`keydown`,e=>{ve&&(e.code===`Space`&&(e.preventDefault(),P.toggle(),_e()),e.code===`ArrowRight`&&(P.nextTrack(),_e()),e.code===`ArrowLeft`&&(P.prevTrack(),_e()))}),setInterval(()=>{P.playing&&(he(`pl-time`).textContent=ge(P.pos),he(`pl-prog`).style.width=Math.min(100,P.pos/P.duration*100)+`%`,_e())},500)),Object.assign(k.h,{hour:()=>re.hour,journey:e=>{if(e!==Gi.id){t.region=e,it(t);try{sessionStorage.setItem(`se-autoenter`,`1`)}catch{}k.fade(!0,600).then(()=>location.reload())}},overlay:e=>{me=e,A.enabled=!e,e?(A.keys.clear(),A.exitLock()):A.touch||A.requestLock()},resume:()=>{pe(!1),A.touch||A.requestLock()},exit:()=>{de=!1,A.exitLock(),i?.()},quality:e=>{t.quality=e,it(t);try{sessionStorage.setItem(`se-autoenter`,`1`)}catch{}location.reload()},changed:e=>{it(t),e===`volume`&&n?.setVolume(t.volume*(ue?.35:1)),e===`weather`&&w.setMode(t.weather),e===`fov`&&(j.fovTarget=t.fov)},setHour:e=>{re.hour=e},travel:async e=>{let t=Zi.find(t=>t.id===e);await k.fade(!0,400),M.held&&M.release(0),j.mode===`seat`&&j.stand(),e===`treehouse`?j.teleport(t.pos[0],v.heightAt(qi.x,qi.z)+4.4,t.pos[2],t.yaw):e===`dock`?j.teleport(t.pos[0],Wi+.65,t.pos[2],t.yaw):c.placeY?.[e]===void 0?[`living`,`bedroom`,`porch`,`tearoom`,`veranda`].includes(e)?j.teleport(t.pos[0],K,t.pos[2],t.yaw):j.teleport(t.pos[0],void 0,t.pos[2],t.yaw):j.teleport(t.pos[0],c.placeY[e],t.pos[2],t.yaw),pe(!1),A.touch||A.requestLock(),await k.fade(!1,700)}}),A.onUnlock=()=>{de&&!A.touch&&!me&&pe(!0)},addEventListener(`keydown`,e=>{e.code===`KeyM`&&ve&&ye(!1)}),A.onTouchMode=()=>{k.setTouch(!0),M.coneAngle=.16},addEventListener(`resize`,()=>{m.aspect=innerWidth/innerHeight,m.updateProjectionMatrix(),le()}),document.addEventListener(`visibilitychange`,()=>{document.hidden&&pe(!0)});let be=performance.now(),xe=0,Se=0,Ce=0,we=new b,Te=new b,Ee=new F(.07,.09,.15),De=()=>{let e=E.trees[Math.floor(Math.random()*E.trees.length)];for(let e=0;e<20;e++){let e=E.trees[Math.floor(Math.random()*E.trees.length)];if(Math.hypot(e.x-m.position.x,e.z-m.position.z)<45)return new b(e.x,v.heightAt(e.x,e.z)+8,e.z)}return new b(e.x,8,e.z)};return w.onThunder=(e,t)=>setTimeout(()=>n?.thunder(e),t*1e3),u.setAnimationLoop(()=>{if(!de)return;let e=performance.now(),r=t.maxFps?1e3/t.maxFps-1.5:0;if(e-be<r)return;let i=Math.min(.1,(e-be)/1e3);if(be=e,ue){fe||(se(),fe=!0),A.endFrame();return}fe=!1,xe+=i;let a=j.mode===`seat`&&j.seat?.lie,s=(t.timeFlow?1/150:0)*(a?40:1);if(re.hour=(re.hour+i*s+24)%24,Ce%15==0&&k.updateTime(re.hour),A.look.x=A.look.x,j.update(i),A.hit(`KeyF`)&&j.toggleFlashlight(),A.hit(`KeyM`)&&ye(!ve),A.hit(`Escape`)&&A.touch){A.endFrame(),pe(!0);return}M.update(i);let l=j.view===`third`&&j.mode!==`scope`;ee.R.root.parent.visible=!0,ee.update(i,{held:M.held,inspecting:M.held&&(A.down(`KeyR`)||A.mouse.right),hover:!!M.focus&&!j.swimming,mode:j.mode,bob:j.bob,swim:j.swimming,swimPhase:j.swimPhase,music:ve&&!j.swimming,musicOn:P?.playing}),l&&(ee.R.root.visible=!1,ee.L.root.visible=!1),te.update(i,{pos:j.pos,yaw:j.yaw,pitch:j.pitch,mode:j.mode,seat:j.seat,camera:m,eye:j.eyePos,speed:j.speedH,running:j.speedH>3,crouch:Math.max(0,Math.min(1,(1.72-j.height)/.6)),onGround:j.onGround,travel:j.travel,stepLen:j.stepLen,swim:j.swimming,swimPhase:j.swimPhase,waterY:Wi-j.dive,climbing:j.climbing,handsActive:ee.R.root.visible,third:l}),x.step(i);for(let e of x.items){if(e.held)continue;let t=e.body.position.y,r=t<-.45&&Ra(e.body.position.x,e.body.position.z)<1.05;if(r&&e.wasAbove){let t=e.body.velocity,r=Math.hypot(t.x,t.z);ne.splashAt(e.body.position),O.burst(e.body.position,Math.min(1.2,.4+Math.hypot(e.body.velocity.x,e.body.velocity.y,e.body.velocity.z)*.12),16),e.skimmer&&r>4&&-t.y<r*.6?(t.y=Math.abs(t.y)*.55+.6,t.x*=.8,t.z*=.8,e.body.position.y=Wi+.02,n?.noiseHit(e.mesh.position,{type:`bandpass`,f:1800,q:1,d:.08,v:.25,ref:4})):(n?.splash(e.mesh.position,Math.min(1,.3+e.body.mass*.4)),e.body.linearDamping=.9,e.body.angularDamping=.9)}if(!r&&t>-.35&&(e.body.linearDamping=.05,e.body.angularDamping=.15),r&&(e.sound===`wood`||e.sound===`soft`)){let n=Math.min(1,(Wi+.02-t)/.12);e.body.applyForce(new Z(Math.sin(xe*.3)*.02,e.body.mass*9.82*(1+n*1.4),Math.cos(xe*.27)*.02),e.body.position),e.body.wakeUp(),e.body.linearDamping=.6}e.wasAbove=!r}for(let e of ie)e(i,xe);let p=Te.copy(m.position);if(S.update(i,re.hour,w.w,p,xe),w.update(i,xe,m,S),T.update(i,xe,S,w),E.update(xe,w,m.position),O.update(i,S.sun.color.clone().multiplyScalar(.25+S.state.daylight*.7)),Jo.value=w.w.rain,Yo.value=xe,v.uniforms.uTime.value=xe,v.uniforms.uRain.value=w.w.rain,v.uniforms.uDay.value=S.state.daylight,w.w.rain>.12&&m.position.distanceToSquared(Te.set(0,2,2))<900){let e=w.w.rain*30*i;for(let t=0;t<e+ +(Math.random()<e%1);t++){let[e,t,n,r,i]=c.eaves[Math.floor(Math.random()*c.eaves.length)],a=Math.random(),o=e+(n-e)*a,s=t+(r-t)*a,l=Math.max(v.heightAt(o,s),y.supportHeight(o,s,.01,i-.3));O.drip(o,i,s,l)}}ne.update(i,xe,j,S,w,n),v.uniforms.wet.value=w.w.wet;for(let e of[_.deck,_.shingles])e.roughness=.85-w.w.wet*.4;let h=c.indoor(m.position),g=S.state.night,C=.95+g*.35+(h?.2:0)-S.state.daylight*w.w.flash*.3;u.toneMappingExposure+=(C-u.toneMappingExposure)*Math.min(1,i*1.5),g>.3&&S.hemi.color.lerp(Ee,.85*g),S.hemi.intensity*=h?.55-g*.3:1;for(let e of _.interior)e.envMapIntensity=h?.25:.6;S.uniforms.uPix.value=m.fov*Math.PI/180/innerHeight;let N=m.position.y<-.48&&Ra(m.position.x,m.position.z)<1.2;if(N){let e=S.state.daylight;w.fog.color.setRGB(.04+e*.07,.11+e*.18,.12+e*.16),w.fog.density=.16,Math.random()<i*3&&O.bubbles(m.position.clone().add(new b(0,-.2,-.3).applyQuaternion(m.quaternion)),3)}if(T.mesh.material.uniforms.uUnder.value=+!!N,n&&n.setUnderwater(N),n){let e=m.position.x-q.x,t=m.position.z-q.z,r=Math.atan2(t/q.rz,e/q.rx);we.set(q.x+Math.cos(r)*q.rx*.95,Wi,q.z+Math.sin(r)*q.rz*.95),n.tickListener(m),n.updateAmbience(i,{rain:w.w.rain,wind:w.w.gust,night:g,daylight:S.state.daylight,indoor:+!!h,openness:c.openness(),shorePos:we,trees:De,listenerPos:m.position,forest:h?.2:1})}if(D.update(m),u.shadowMap.needsUpdate=Ce%o.shadowEvery===0,se(),A.endFrame(),Ce++,Se+=i,Se>2){let e=Se/Ce;Ce=0,Se=0;let t=f;e>1/42&&f>.55?t=f-.1:e<1/58&&f<o.pixelRatio&&(t=Math.min(o.pixelRatio,f+.05)),t!==f&&(f=t,u.setPixelRatio(d*f),le())}}),window.__SE={scene:p,camera:m,player:j,renderer:u,weather:w,clock:re,sky:S,ix:M,physics:x,site:c,settings:t,colliders:y,terrain:v,setPaused:pe,travel:k.h.travel},{renderer:u,scene:p,camera:m,player:j,stop:()=>{de=!1,u.setAnimationLoop(null)}}}export{Lf as startWorld};