var engineCore={};window.onload=function(){function e(e){return e.stopPropagation?e.stopPropagation():window.event&&(window.event.cancelBubble=!0),e.preventDefault(),!1}document.addEventListener("contextmenu",(function(e){e.preventDefault()}),!1),document.addEventListener("keydown",(function(t){t.ctrlKey&&t.shiftKey&&74==t.keyCode&&e(t),83==t.keyCode&&(navigator.platform.match("Mac")?t.metaKey:t.ctrlKey)&&e(t),t.ctrlKey&&85==t.keyCode&&e(t),123==event.keyCode&&e(t)}),!1)};class QElement{constructor(e,t){this.element=e,this.priority=t}}class PriorityQueue{constructor(e){if(null==e)this.items=[],this.length=0;else{this.items=[];for(var t=0;t<e.length;t++)this.enqueue(e[t]);this.length=e.length}}enqueue(e,t){var n=new QElement(e,t),r=!1;this.length++;for(var a=0;a<this.items.length;a++)if(this.items[a].priority>n.priority){this.items.splice(a,0,n),r=!0;break}r||this.items.push(n)}remove(e){for(var t=0;t<this.items.length;t++)this.items[t].element.id==e&&(this.items.splice(t,1),this.length--)}getRaw(e){for(var t=0;t<this.items.length;t++)if(this.items[t].element.id==e)return this.items[t];return null}changeRaw(e,t){for(var n=0;n<this.items.length;n++)if(this.items[n].element.id==e)return this.items[n].element=t,!0;return!1}dequeue(){return this.isEmpty()?null:(this.length--,this.items.shift())}front(){return this.isEmpty()?null:this.items[0]}rear(){return this.isEmpty()?null:this.items[this.items.length-1]}isEmpty(){return 0==this.items.length}printPQueue(){for(var e="",t=0;t<this.items.length;t++)e+=this.items[t].element+" ";return e}}export var math={};math.distance=function(e,t){var n=e.x-t.x,r=e.y-t.y;return Math.sqrt(n*n+r*r)},math.OneDDistance=function(e,t){var n=e-t;return Math.abs(n)},math.lerp=function(e,t,n){return e*(1-n)+t*n},math.veclerp=function(e,t,n){return new Vec2(e.x*(1-n)+t.x*n,e.y*(1-n)+t.y*n)},math.clamp=function(e,t,n){return e>n&&(e=n),e<t&&(e=t),e},math.high=function(e,t){return e>t?e:t>e?t:void 0},math.low=function(e,t){return t>e?e:e>t?t:void 0},math.getBoundingBox=function(e,t){if(e.length<1)return{width:t,height:t,center:new Vec2(0,0)};if(e.length<2)return{width:t,height:t,center:e[0]};var n,r,a,i,s={width:0,height:0,center:new Vec2(0,0),minX:0,maxX:0,minY:0,maxY:0};for(let t=0;t<e.length;t++){const s=e[t];(null==r||s.x<r)&&(r=s.x),(null==n||s.y<n)&&(n=s.y),(null==i||s.x>i)&&(i=s.x),(null==a||s.y>a)&&(a=s.y)}return s.width=i-r+t,s.height=a-n+t,s.minX=r,s.minY=n,s.maxX=i,s.maxY=a,s.center=new Vec2(Math.round(r+s.width/2),Math.round(n+s.height/2)),Number.isNaN(s.center.x)&&(s.center=new Vec2(0,0)),console.log(s.center),s};var canvas=document.getElementById("maincanvas");engineCore.canvas=canvas;var c=canvas.getContext("2d"),drawables=new PriorityQueue,updatefuncs=[],resizefuncs=[],idsInUse=[],lastID=0,renderScale=1,currentZoom=1,safeRenderScales=[.1,.5,1,2,3,4,5,6,7,8,9,10],mouseIsOverCanvas=!0,drawFuncs=[],lastFrameTime=0,currentFrameTime=0;export var mouseX=0;export var mouseY=0;export var width=canvas.width;export var height=canvas.height;export var camPos=new Vec2(0,0);var mouseMoveEvent=function(e){mouseX=e.x,mouseY=height-e.y,mouseIsOverCanvas=!(-e.y>0)};function getDrawableTypeInteger(e){switch(e){case"rect":return 0;case"sprite":return 1;case"text":return 2;case"line":return 3;case"circle":return 4;case"cluster":return 1;default:return 0}}function inRenderFrame(e,t,n,r){return"center"==r?!(math.OneDDistance(e.x,engineCore.getCamCenter().x)>(canvas.width/2+t)/renderScale||math.OneDDistance(e.y,engineCore.getCamCenter().y)>(canvas.height/2+n+height)/renderScale):!(math.OneDDistance(e.x-canvas.width/2,engineCore.getCamCenter().x)>(canvas.width/2+t)/renderScale||math.OneDDistance(e.y+canvas.height/2,engineCore.getCamCenter().y)>(canvas.height/2+n+height)/renderScale)}function frame(){c.translate(0,height),updatefuncs.forEach((e=>{e()})),c.clearRect(0,-canvas.height,canvas.width,2*canvas.height);for(var e=new PriorityQueue(drawables.items),t=e.length,n=0;n<t;n++){var r=e.dequeue().element.element;if(null==r)return console.log("ILLEGAL DRAWABLE"),void requestAnimationFrame(frame);if(3==r.type&&(r.x=(r.args.x1+r.args.x2)/2,r.y=(r.args.y1+r.args.y2)/2,r.w=Math.abs(r.args.x1-r.args.x2),r.h=Math.abs(r.args.y1-r.args.y2)),inRenderFrame(new Vec2(r.x,r.y),r.w,r.h,r.anchor)||!r.global){var a=0,i=0,s=r.x,o=r.y,h=r.w,l=r.h;"center"==r.anchor&&(a=-Math.round(canvas.width/2)/renderScale,i=-Math.round(canvas.height/2)/renderScale),r.global?(s=(r.x-camPos.x-a)*renderScale,o=(-r.y+camPos.y+i)*renderScale,h=r.w*renderScale,l=r.h*renderScale):(s=r.x-a,o=-r.y+i),c.globalAlpha=r.transparency,drawFuncs[r.type](r,s,o,h,l,c,a,i)}}currentFrameTime=Date.now()-lastFrameTime,lastFrameTime=Date.now(),c.translate(0,-height),requestAnimationFrame(frame)}engineCore.init=function(){requestAnimationFrame(frame),initializeFunctions(),window.addEventListener("mousemove",mouseMoveEvent)},engineCore.moveCamera=function(e){camPos=e},engineCore.localToGlobalPos=function(e){return new Vec2((e.x+camPos.x)*renderScale,(e.y+camPos.y)*renderScale)},engineCore.localToGlobalX=function(e){return(e+camPos.x)/renderScale},engineCore.localToGlobalY=function(e){return(e-camPos.y)/renderScale},engineCore.draw=function(e){if(null!=e)return e.type=getDrawableTypeInteger(e.type),idsInUse[idsInUse.length]=e.id,drawables.enqueue(e,e.priority),e;console.log("ILLEGAL DRAWABLE")},engineCore.removeDraw=function(e){drawables.remove(e)},engineCore.changeDraw=function(e,t){var n=drawables.getRaw(e);null!=n&&n.element==t||(null!=n?(t.type=getDrawableTypeInteger(t.type),drawables.changeRaw(e,t)):engineCore.draw(t))},engineCore.moveDraw=function(e,t){var n=drawables.getRaw(e);if(null==n||n.element!=r){var r=n.element;r.x=t.x,r.y=t.y,null!=n?drawables.changeRaw(e,r):engineCore.draw(r)}},engineCore.registerUpdateEvent=function(e){updatefuncs[updatefuncs.length]=e},engineCore.getDrawableID=function(){for(var e=Math.round(Math.random()*Number.MAX_SAFE_INTEGER),t=0;t<idsInUse.length;t++)idsInUse[t]==e&&(e=Math.round(Math.random()*Number.MAX_SAFE_INTEGER));return e},engineCore.getCamCenter=function(){return new Vec2(camPos.x,camPos.y)},engineCore.Drawable=function(e,t,n,r,a,i,s,o,h,c,l=1){this.type=e,this.priority=t,this.id=n,this.x=r,this.y=a,this.w=i,this.h=s,this.global=o,this.anchor=h,this.args=c,this.transparency=l};export function Vec2(e,t){null==t?(this.x=e,this.y=e):(this.x=e,this.y=t),this.addV=function(e){return new Vec2(this.x+e.x,this.y+e.y)},this.subV=function(e){return new Vec2(this.x-e.x,this.y-e.y)},this.dot=function(e){return this.x*e.x+this.y*e.y},this.length=function(){return Math.sqrt(this.dot(this))},this.divS=function(e){return new Vec2(this.x/e,this.y/e)},this.mulV=function(e){return new Vec2(this.x*e.x,this.y*e.y)},this.mulS=function(e){return new Vec2(this.x*e,this.y*e)},this.clamp=function(e,t){var n=this.x,r=this.y;return this.x>t?n=t:this.x<e&&(n=e),this.y>t?r=t:this.y<e&&(r=e),new Vec2(n,r)}}function initializeFunctions(){drawFuncs.push(((e,t,n,r,a,i)=>{i.translate(t,n),i.beginPath(),i.rect(0,0,r,a),i.fillStyle=e.args,i.fill(),i.translate(-t,-n)})),drawFuncs.push(((e,t,n,r,a,i)=>{i.drawImage(e.args,t,n,r,a)})),drawFuncs.push(((e,t,n,r,a,i)=>{var s=1;e.global&&(s=renderScale),i.font="bold "+30*s+"px Arial",i.textAlign=e.args.align,i.textBaseline="middle",i.fillStyle=e.args.color,i.fillText(e.args.text,t,n)})),drawFuncs.push(((e,t,n,r,a,i,s,o)=>{var h,c,l,u;e.global&&(h=(e.args.x1-camPos.x-s)*renderScale,c=(-e.args.y1+camPos.y-o)*renderScale,l=(e.args.x2-camPos.x-s)*renderScale,u=(-e.args.y2+camPos.y-o)*renderScale,e.w*renderScale,e.h),i.strokeStyle=e.args.color,i.beginPath(),i.moveTo(h,c),i.lineTo(l,u),i.closePath(),i.lineWidth=e.args.width*renderScale,i.stroke()})),drawFuncs.push(((e,t,n,r,a,i)=>{i.beginPath(),i.arc(t,n,r,0,2*Math.PI),i.fillStyle=e.args,i.fill()}))}resizefuncs.push((()=>{canvas.width=window.innerWidth,canvas.height=window.innerHeight,width=canvas.width,height=canvas.height})),engineCore.registerResizeEvent=function(e){resizefuncs.push(e)},engineCore.doResize=()=>{for(let e=0;e<resizefuncs.length;e++){(0,resizefuncs[e])()}},window.onresize=engineCore.doResize;export default engineCore;