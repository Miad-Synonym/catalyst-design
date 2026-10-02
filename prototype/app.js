var liveParent=null;
/* Local live generation. Legacy demo helpers are retained but saved playback is disabled. */
const $ = s => document.querySelector(s);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = name => `<img src="assets/icons/${name}.svg" alt="">`;
const headline = 'Retail sales last month surged by the most since March, when a spike in gasoline prices and a boost from tax refunds helped account for higher spending totals.';
const exampleInputs = [
  'Fed raises rates a quarter point in first move of Warsh era',
  headline,
  'EU chief floats associate membership for Canada after U.S. trade attacks',
  'https://www.wsj.com/cio-journal/why-companies-are-unlikely-to-hit-pause-on-ai-9a4f6818'
];
const articleDemoText='Businesses can keep using established AI models even if progress on new models slows. Existing tools can still sort documents or support everyday work. Continued adoption may support software demand, but does not guarantee more chip purchases or higher supplier profits.';
let articleRecovery=null;
const clips = [
  {id:'article-headline',seconds:34.28,title:'Why AI adoption may continue',subject:'General context for the headline',file:'../experiments/article-access-v1/headline.mp4',poster:'../experiments/article-access-v1/poster.png',detail:'Headline-only general mechanism, not an article summary.',renderedOnly:true,label:'EXPLAINER TEST',audio:true,headlineOnly:true,scope:'Headline only · Full article not read'},
  { id:'eu-exposure', seconds:47.04, title:'Which companies are exposed?', subject:'Customers, suppliers and operations', file:'../experiments/eu-article-followups-v1/exposure.mp4', poster:'../experiments/eu-article-followups-v1/exposure-poster.png', detail:'Narrated D3 follow-up with sourced concepts and labeled illustrations.', renderedOnly:true, label:'EXPLAINER TEST', audio:true },
  { id:'eu-agreement', seconds:44.64, title:'What changes beyond CETA?', subject:'Existing access versus additional rights', file:'../experiments/eu-article-followups-v1/agreement.mp4', poster:'../experiments/eu-article-followups-v1/agreement-poster.png', detail:'Narrated D3 follow-up with sourced concepts and labeled illustrations.', renderedOnly:true, label:'EXPLAINER TEST', audio:true },
  { id:'article-adoption', seconds:48.24, title:'Is AI adoption slowing?', subject:'Growth, usage and comparable evidence', file:'../experiments/eu-article-followups-v1/adoption.mp4', poster:'../experiments/eu-article-followups-v1/adoption-poster.png', detail:'Narrated D3 follow-up with sourced concepts and labeled illustrations.', renderedOnly:true, label:'EXPLAINER TEST', audio:true },
  { id:'article-chips', seconds:43.52, title:'From AI use to chip demand', subject:'Capacity, efficiency and hardware orders', file:'../experiments/eu-article-followups-v1/chips.mp4', poster:'../experiments/eu-article-followups-v1/chips-poster.png', detail:'Narrated D3 follow-up with sourced concepts and labeled illustrations.', renderedOnly:true, label:'EXPLAINER TEST', audio:true },
  { id:'fed-loans', seconds:35.68, title:'Rate hikes and existing loans', subject:'Fixed rates, resets and refinancing', file:'../experiments/followup-presenters-v1/fed-loans.mp4', poster:'../experiments/followup-presenters-v1/fed-loans-poster.png', detail:'Human presenter opening, followed by graphics distinguishing fixed contracts, adjustable resets and new borrowing.', label:'EXPLAINER TEST', audio:true },
  { id:'fed-stocks', seconds:37.44, title:'Why stocks can rise after a hike', subject:'The surprise versus expectations', file:'../experiments/followup-presenters-v1/fed-stocks.mp4', poster:'../experiments/followup-presenters-v1/fed-stocks-poster.png', detail:'Human presenter opening, followed by a hypothetical comparison explaining policy surprises without predicting returns.', label:'EXPLAINER TEST', audio:true },
  { id:'fed', title:'The Fed hike, explained', subject:'How a quarter point reaches markets', file:'../experiments/fed-storyboard-v2/output-graphs.mp4', poster:'../experiments/fed-storyboard-v2/poster.png', detail:'One continuous narration, human presenter, illustrative café footage and coded diagrams. Based on the supplied example headline.', label:'EXPLAINER TEST', audio:true, seconds:35.04 },
  { id:'retail', title:'Retail sales, explained', subject:'Behind the retail sales headline', file:'../experiments/retail-system-v3/output.mp4', poster:'../experiments/retail-system-v3/poster.png', detail:'Fresh presenter performance and grocery footage, one continuous narration, and synchronized D3 graphics. Basket values are illustrative.', label:'EXPLAINER TEST', audio:true, seconds:41.68 },
  { id:'retail-report', title:'Reading the retail report', subject:'What to check in the full report', file:'../experiments/followup-presenters-v1/retail-report.mp4', poster:'../experiments/followup-presenters-v1/retail-report-poster.png', detail:'Human presenter opening, followed by D3 graphics about comparison periods, revisions and breadth. Diagrams are conceptual.', label:'EXPLAINER TEST', audio:true, seconds:35.92 },
  { id:'retail-stocks', title:'When sales rise but stocks fall', subject:'Growth versus investor expectations', file:'../experiments/retail-stocks-v1/output.mp4', poster:'../experiments/retail-stocks-v1/poster.png', detail:'Fresh presenter opening and narration, with illustrative D3 charts explaining expectations, costs and the earnings outlook.', label:'EXPLAINER TEST', audio:true, seconds:42 },
  { id:'eu', seconds:39.36, title:'Europe and Canada, explained', subject:'From political intent to business effects', file:'../experiments/eu-ai-explainers-v1/eu.mp4', poster:'../experiments/eu-ai-explainers-v1/eu-poster.png', detail:'Conditional trade mechanisms, existing CETA context, and what to watch. Narrated D3 graphics.', renderedOnly:true, label:'EXPLAINER TEST', audio:true },
  { id:'article', seconds:40.8, title:'Why AI adoption may continue', subject:'Frontier research and business adoption', file:'../experiments/eu-ai-explainers-v1/article.mp4', poster:'../experiments/eu-ai-explainers-v1/article-poster.png', detail:'Based on accessible WSJ text, with clearly labeled hypothetical workflow and market inference.', renderedOnly:true, label:'EXPLAINER TEST', audio:true },
  { id:'cinematic', title:'A familiar place to start', subject:'Original visual study', file:'../experiments/retail-cinematic-01/output.mp4', poster:'../experiments/retail-cinematic-01/frame-2.png', detail:'Original five-second fal shopping shot, reused in the complete test.', label:'VISUAL STUDY', audio:false, seconds:5 },
  { id:'baseline', title:'Retail sales · first model test', subject:'Retail sales: the baseline', file:'../experiments/plain-baseline-01/retail/output.mp4', poster:'../experiments/plain-baseline-01/retail/frame-0.png', detail:'An earlier fal experiment. Generated narration has not been fact-checked.', label:'UNREVIEWED BASELINE', audio:true, seconds:15 },
  { id:'workflow', title:'Agent workflow · motion study', subject:'From data to explanation', file:'../experiments/agent-workflow-01/output.mp4', poster:'../experiments/agent-workflow-01/input.png', detail:'An illustrative diagram animation from an earlier fal experiment.', label:'MOTION STUDY', audio:false, seconds:5 }
];
const retailClip=clips.find(clip=>clip.id==='retail'),fedClip=clips.find(clip=>clip.id==='fed');
let activeClip=retailClip, generation=0, busy=false, toastTimer, localURLs=[], nodes=[], activeNodeId=null, pendingNodeId=null, revealTimer;
const messages=$('#messages'), canvas=$('#canvas-content');
const sentSuggestionActions=new Set(),sentInputs=new Set();
const normalizeInput=text=>text.trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').replace(/[?.!]+$/,'');
const followupAction=id=>({'fed-loans':'fed-fixed','retail-report':'retail-data','eu-exposure':'eu-detail','article-adoption':'article-detail','article-chips':'article-demand'}[id]||id);
const chatScrollShell=document.createElement('div');chatScrollShell.className='chat-scroll-shell';messages.before(chatScrollShell);chatScrollShell.append(messages);
function clearTyping(){messages.querySelectorAll('.chat-typing').forEach(el=>el.remove());}

function setBusy(value){busy=value;$('#send').disabled=value || !$('#prompt').value.trim();$('#prompt').disabled=value;}
let followChat=true;
messages.addEventListener('wheel',event=>{if(event.deltaY<0)followChat=false;},{passive:true});
messages.addEventListener('touchstart',()=>{followChat=false;},{passive:true});
messages.addEventListener('scroll',()=>{if(messages.scrollHeight-messages.clientHeight-messages.scrollTop<12)followChat=true;},{passive:true});
let chatScrollFrame=null;
function scrollChat(){if(!followChat||chatScrollFrame!==null)return;chatScrollFrame=requestAnimationFrame(()=>{chatScrollFrame=null;if(followChat)messages.scrollTo({top:messages.scrollHeight,behavior:'instant'});});}
function addMessage(body, user=false){
  if(user){followChat=true;const plain=document.createElement('div');plain.innerHTML=body;sentInputs.add(normalizeInput(plain.textContent));}
  $('.conversation').classList.add('has-messages');
  const el=document.createElement('article'); el.className=`message ${user?'user-message':'assistant-message'}`;
  el.setAttribute('aria-label',user?'Your input':'Catalyst response');
  el.innerHTML=`<div class="message-body">${body}</div>`;
  messages.insertBefore(el,messages.querySelector('.chat-typing'));
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const height=el.getBoundingClientRect().height, margin=getComputedStyle(el).marginBottom;
    // Expand the space separately so the bubble and its text never stretch.
    const layout=el.animate([
      {height:'0px',marginBottom:'0px',overflow:'hidden'},
      {height:`${height}px`,marginBottom:margin,overflow:'hidden'}
    ],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
    const entrance=el.querySelector('.message-body').animate([
      {opacity:0,transform:'translateY(6px)',filter:'blur(2px)'},
      {opacity:1,transform:'translateY(0)',filter:'blur(0)'}
    ],{duration:480,delay:50,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
    Promise.all([layout.finished,entrance.finished]).then(scrollChat).catch(()=>{});
    const followReveal=()=>{if(layout.playState==='running'&&el.isConnected){scrollChat();requestAnimationFrame(followReveal);}};
    requestAnimationFrame(followReveal);
  }
  scrollChat();return el;
}
function suggestions(items){
  $('#chat-suggestions').replaceChildren();
  messages.querySelectorAll('.suggestion-message').forEach(el=>el.remove());
  for(const [text,action] of items){
    if(sentSuggestionActions.has(action)||sentInputs.has(normalizeInput(text)))continue;
    const message=addMessage(`<button class="suggestion-bubble" data-action="${escapeHTML(action)}">${escapeHTML(text)}${icon('arrow-up-right')}</button>`);
    message.classList.add('suggestion-message');
    message.setAttribute('aria-label','Suggested follow-up');
  }
  return '';
}
function delivery(){return `<button class="delivery" data-action="view-clip"><span class="clip-icon">${icon('play')}</span><span><strong>A familiar place to start</strong><small>5 sec · Silent visual study</small></span>${icon('arrow-up-right')}</button>`;}
function title(text,kicker='YOUR EXPLAINER'){$('.canvas').hidden=false;$('#video-title').textContent=text;$('#canvas-kicker').textContent=kicker;}
function stopPlayback(){document.querySelectorAll('.clip-video').forEach(v=>v.pause());document.querySelectorAll('.sequence-frame').forEach(f=>f.contentWindow?.postMessage({type:'pause-sequence'},location.origin));}
function home(){newConversation();}
function newConversation({preserveSent=false}={}){
  if(!preserveSent){sentSuggestionActions.clear();sentInputs.clear();}
  clearTimeout(revealTimer);$('.canvas').classList.remove('revealing');$('.connections').classList.remove('revealing');
  liveParent=null;generation++;articleRecovery=null;stopPlayback();clearTyping();messages.replaceChildren();$('#thread-title').textContent='New conversation';$('#prompt').value='';setBusy(false);
  $('.conversation').classList.remove('has-messages');$('.chat-heading').textContent='What’s the play?';
  $('.canvas').hidden=true;$('.canvas').classList.remove('has-branches');canvas.replaceChildren();nodes=[];activeNodeId=null;pendingNodeId=null;$('#prompt').placeholder='Paste a headline or ask about a market move…';
  $('#chat-suggestions').innerHTML=exampleInputs.map((text,index)=>sentSuggestionActions.has('example-'+['fed','retail','eu','article'][index])?'':`<button class="followup example-input" data-example="${index}" ><span class="suggestion-elbow" aria-hidden="true"></span><span>${escapeHTML(text)}</span></button>`).join('');
}
function renderVideo(clip){
  if(!clip.live&&clip.label!=='LOCAL VIDEO'){toast('Choose an input to generate a new explainer.');return;}
  stopPlayback();activeClip=clip;title(clip.subject);$('.chat-heading').textContent=clip.title;
  let node;
  if(pendingNodeId){node=nodes.find(n=>n.id===pendingNodeId);Object.assign(node,{clip,pending:false});pendingNodeId=null;}
  else{node=nodes.find(n=>n.clip?.id===clip.id);if(!node){node={id:'n'+crypto.randomUUID(),clip,parent:null};nodes.push(node);}}
  activeNodeId=node.id;renderGraph();
}
function videoMarkup(node){
  const clip=node.clip;
  return `${clip.scope?`<div class="video-scope" role="note">${escapeHTML(clip.scope)}</div>`:''}<article class="video-card" data-node="${node.id}"><div class="video-topline"><span class="node-heading">${icon('film')}<span><strong>${escapeHTML(clip.title)}</strong><small>${clip.label==='LOCAL VIDEO'?'Local video':clip.label==='UNREVIEWED BASELINE'?'Unreviewed model test':clip.label==='EXPLAINER TEST'?(clip.renderedOnly?'Generated narration · rendered graphics':'Generated footage · rendered graphics'):'AI-generated visual study'}</small></span></span><span class="clip-time">${clip.seconds?clip.seconds+' sec':''} ${clip.audio?'':'· Silent'}</span></div><div class="video-inset"><div class="video-stage"><video class="clip-video" playsinline ${clip.label==='EXPLAINER TEST'?'':'loop muted'} ${node.id===activeNodeId?'autoplay':''} preload="metadata" ${clip.poster?`poster="${escapeHTML(clip.poster)}"`:''} aria-label="${escapeHTML(clip.title)}"><source src="${escapeHTML(clip.file)}" type="${clip.type||'video/mp4'}"></video><button class="big-play" data-action="play" aria-label="Play video"><span>${icon('play')}</span></button></div><div class="player-controls"><button data-action="play" class="play-button" aria-label="Play video">${icon('play')}</button><span class="player-clock">0:00 / ${formatTime(clip.seconds||0)}</span><input class="seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Video position"><button data-action="mute" class="mute-button" aria-label="${clip.label==='EXPLAINER TEST'?'Mute video':'Unmute video'}">${icon(clip.label==='EXPLAINER TEST'?'volume-2':'volume-x')}</button><button data-action="fullscreen" aria-label="Full screen">${icon('expand')}</button></div></div><div class="node-footer"><span class="watch-state">${node.watched?'Watched':'Ready to watch'}</span><button class="text-button" data-action="source">Context ${icon('arrow-up-right')}</button></div></article>`;
}
function renderGraph(){
  suggestions([]);
  $('.canvas').classList.toggle('has-branches',nodes.length>1);
  canvas.querySelectorAll('.video-card').forEach(card=>{const node=nodes.find(n=>n.id===card.dataset.node);const v=card.querySelector('video');if(node&&v)node.time=v.currentTime;});
  const focusedId=pendingNodeId||activeNodeId;
  const history=nodes.filter(node=>node.id!==focusedId);
  const historyMarkup=history.length?`<nav class="video-history" aria-label="Earlier videos">${history.map(node=>`<button class="history-video" data-action="open-node" data-target="${node.id}">${node.clip?.poster?`<img src="${escapeHTML(node.clip.poster)}" alt="">`:'<span class="history-placeholder">↗</span>'}<span><small>${node.pending?'Follow-up draft':'Earlier video'}</small>${escapeHTML(node.clip?.title||node.title)}</span></button>`).join('')}</nav>`:'';
  canvas.innerHTML=historyMarkup+nodes.filter(node=>node.id===focusedId).map(node=>`<div class="video-node ${node.parent?'child-node':''}" data-branch="${node.id}" ${node.parent?`data-parent="${node.parent}"`:''}>${node.parent?'<div class="branch-label">Follow-up</div>':''}${node.pending?`<article class="video-card draft-card" data-node="${node.id}"><div class="video-topline"><span class="node-heading">${icon('film')}<span><strong>${escapeHTML(node.title)}</strong><small>Next video · draft</small></span></span></div><div class="pending-video">${icon('play')}<p>Your next question, visualized.</p><small>No new video generated yet.</small><button class="secondary-button" data-action="upload" data-target="${node.id}">Add generated video</button></div></article>`:videoMarkup(node)}</div>`).join('');
  canvas.querySelectorAll('.video-card').forEach(card=>{
    const video=card.querySelector('video');if(!video)return;const node=nodes.find(n=>n.id===card.dataset.node);
    const clock=card.querySelector('.player-clock'),seek=card.querySelector('.seek'),play=card.querySelector('.play-button'),cover=card.querySelector('.big-play');
    video.addEventListener('loadedmetadata',()=>{clock.textContent=`0:00 / ${formatTime(video.duration)}`;if(node.replay){node.time=0;node.replay=false;}else if(node.time)video.currentTime=Math.min(node.time,video.duration);});
    let lastTime=0;
    video.addEventListener('timeupdate',()=>{if(node.clip.label!=='EXPLAINER TEST'&&lastTime>video.currentTime+.5)markWatched();lastTime=video.currentTime;seek.value=video.duration?video.currentTime/video.duration*100:0;clock.textContent=`${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;});
    const sync=()=>{cover.hidden=!video.paused;play.innerHTML=icon(video.paused?'play':'pause');play.setAttribute('aria-label',video.paused?'Play video':'Pause video');};
    ['play','pause','ended'].forEach(event=>video.addEventListener(event,sync));
    video.addEventListener('play',()=>{suggestions([]);document.querySelectorAll('.clip-video').forEach(v=>{if(v!==video)v.pause();});activeNodeId=node.id;});
    const markWatched=()=>{if(node.clip.live){node.watched=true;suggestions(node.clip.questions.map((q,i)=>[q,'live-question-'+i]));return;}if(['eu','article'].includes(node.clip.id.split('-')[0])){card.querySelector('.watch-state').textContent='Watched';node.watched=true;topicSuggestions(node.clip.id);return;}if(node.clip.id.startsWith('retail')){card.querySelector('.watch-state').textContent='Watched';node.watched=true;retailSuggestions(node.clip.id);return;}if(node.clip.id.startsWith('fed')){card.querySelector('.watch-state').textContent='Watched';node.watched=true;fedSuggestions(node.clip.id);return;}card.querySelector('.watch-state').textContent='Watched';if(node.watched)return;node.watched=true;activeNodeId=node.id;$('#prompt').placeholder='Ask for the next video…';suggestions([['How do prices and purchases affect sales?','draft'],['What does this headline leave out?','limits'],['Can I watch that explanation again?','view-clip']]);};
    video.addEventListener('ended',markWatched);
    if(node.clip.label==='EXPLAINER TEST'){video.muted=false;video.play().catch(()=>{play.innerHTML=icon('play');play.setAttribute('aria-label','Play video');});}
    video.addEventListener('error',()=>{toast('This video could not be loaded. Choose another clip or add a local video.');cover.hidden=true;});
    seek.addEventListener('input',e=>{if(Number.isFinite(video.duration))video.currentTime=Number(e.target.value)/100*video.duration;});
  });
}
function formatTime(n){if(!Number.isFinite(n))return '0:00';return `${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;}
function explain(){
  addMessage('Explain price vs. volume.',true);
  addMessage('<p><strong>Price is what each item costs. Volume is how much people buy.</strong></p><p>Keep the groceries in a basket the same. If their prices go up, the total rises even though the shopper bought no more.</p><p>Add more groceries at the same prices, and the total rises because they bought more.</p>'+suggestions([['Can you explain this with a video?','draft'],['What does the headline leave out?','limits']]));
}
function limits(){
  addMessage('What can this headline tell us?',true);
  addMessage('<p>It reports an increase in the dollar value of retail sales. It doesn’t separate price changes from changes in how much people bought.</p><p>The gasoline-price and tax-refund explanation refers to <strong>March</strong>. We shouldn’t assume it explains the latest increase.</p><p class="muted">We’d need the underlying report to check the drivers.</p>'+suggestions([['What was the original headline?','source'],['How do price and volume differ?','explain']]));
}
function draft(request='Make the next video about prices versus purchases.'){
  if(busy)return;stopPlayback();
  if(!nodes.some(n=>!n.pending)){renderVideo(retailClip);}
  const parent=nodes.find(n=>n.id===activeNodeId&&!n.pending)||nodes.find(n=>!n.pending);
  let child=nodes.find(n=>n.pending&&n.parent===parent.id);
  if(!child){child={id:'n'+crypto.randomUUID(),parent:parent.id,pending:true,title:'Prices vs. purchases'};nodes.push(child);}
  pendingNodeId=child.id;
  addMessage(escapeHTML(request),true);
  addMessage('<p>The same basket can cost more even when you buy nothing extra.</p>');
  addMessage('<p>Buying more items is a different change. Both can raise the total, but only one means more purchases.</p>');
  suggestions([['Can I add the next generated video?','upload'],['How do price and volume differ?','explain']]);
  title('Your video conversation');renderGraph();
  requestAnimationFrame(()=>canvas.querySelector(`[data-branch="${child.id}"]`).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'}));
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function retailSuggestions(current='retail'){
  const items=[];
  if(current!=='retail-report')items.push(['What should I look for in the full report?','retail-data']);
  if(current!=='retail-stocks')items.push(['Why can retail stocks fall even when sales rise?','retail-stocks']);
  if(current==='retail-stocks')items.push(['Can I open the source links?','source']);
  else if(current!=='retail')items.push(['Which source should I check first?','source']);
  suggestions(items);
}
const followupQuestions={
 'retail-report':'What should I look for in the full report?',
 'retail-stocks':'Why can retail stocks fall even when sales rise?',
 'fed-loans':'Does a rate hike change an existing fixed-rate loan?',
 'fed-stocks':'Why might stocks rise after a rate hike?',
 'eu-exposure':'How can I tell which companies are most exposed?',
 'eu-agreement':'What could change beyond the existing trade agreement?',
 'article-adoption':'What evidence would show AI adoption is slowing?',
 'article-chips':'Does continued AI adoption mean stronger chip demand?'
};
// Each chat answers the question before its saved video develops the explanation.
// Keep actual events, conditional mechanisms and teaching examples distinct.
const explanationMessages={
  fed:[
    'A quarter-point hike means <strong>0.25 percentage points</strong>, or 25 basis points.',
    '<strong>New borrowing may cost more.</strong> Existing fixed-rate loans don’t automatically change.',
    'Higher financing costs can <strong>slow spending and investment</strong>, putting pressure on earnings.',
    '<strong>Market expectations matter too.</strong> We haven’t verified this example’s announcement or actual market reaction.'
  ],
  retail:[
    'Retail sales measure <strong>dollars spent</strong>, not how many items shoppers bought.',
    '<strong>Higher prices, more purchases, or both</strong> can lift the total.',
    'Higher sales help retailers only if <strong>costs don’t eat up the gains</strong>.',
    'We need the breakdown to explain this jump. The gasoline and tax-refund comparison refers to <strong>March</strong>.'
  ],
  eu:[
    'This is a <strong>proposal for closer EU–Canada ties</strong>, not a completed deal.',
    'A trade agreement, <strong>CETA</strong>, already exists. What would the new arrangement add?',
    'Easier cross-border business could <strong>open markets or reduce costs</strong> for affected companies.',
    'The earnings impact depends on <strong>the final rules and each company’s exposure</strong>. Benefits aren’t established yet.'
  ],
  article:[
    'The article argues <strong>AI adoption can continue</strong> even if progress on new models slows.',
    'Existing tools can still <strong>save businesses time</strong> without another breakthrough.',
    'That may support software demand, but <strong>doesn’t guarantee more chip orders or higher profits</strong>.',
    'Watch <strong>repeat use, renewals and business results</strong> to see whether adoption lasts.'
  ],
  'article-headline':[
    '<strong>Based on the headline only.</strong> We can explore why AI adoption might continue, without claiming to know the article’s evidence.',
    'Existing tools may still <strong>save businesses time</strong>, even if newer models improve more slowly.',
    'That could support software demand. <strong>More use doesn’t guarantee more chip orders or higher profits.</strong>',
    'The video illustrates this general mechanism. It is <strong>not a summary of the unread article</strong>.'
  ],
  'retail-report':[
    'Start with <strong>the comparison period and any revisions</strong>. A monthly change and a yearly change answer different questions, and early estimates can be updated.',
    'Then check <strong>which categories drove the total</strong>. Broad gains tell a different demand story from a jump concentrated in one category; prices still matter.',
    'For markets, that helps judge whether consumer strength may persist. A single headline can’t settle the earnings outlook; we haven’t matched this example to a dated release.'
  ],
  'retail-stocks':[
    'A national spending increase doesn’t tell us <strong>how any one retailer performed</strong>.',
    'Shares can fall if results or the outlook <strong>disappoint investors</strong>, even when sales grow.',
    'The video uses a <strong>made-up company</strong> to show growth versus expectations, then checks what reaches profit.'
  ],
  'fed-loans':[
    '<strong>An existing fixed interest rate usually stays fixed.</strong> A Fed hike doesn’t rewrite the contract. A mortgage’s total payment can still change through taxes or insurance.',
    'Adjustable-rate loans can reset under their terms. <strong>New borrowing or refinancing</strong> faces the rates available then, rather than the borrower’s old fixed rate.',
    'For markets, <strong>when debt reprices matters</strong>. Companies that need to refinance soon may feel rising financing costs sooner than those with long-term fixed debt.'
  ],
  'fed-stocks':[
    'Stocks respond to <strong>what changed versus expectations</strong>, not just whether the Fed raised rates. Investors may have already prepared for a larger increase.',
    'A smaller-than-expected hike can ease those concerns. Guidance about future decisions also matters, so <strong>the same-sized hike can produce different reactions</strong>.',
    'That’s why a hike doesn’t guarantee falling stocks. The video shows <strong>a hypothetical surprise</strong>; it doesn’t report how markets reacted to this example headline.'
  ],
  'eu-exposure':[
    'Look at <strong>where a company earns revenue, buys inputs and operates</strong>. Being based in Canada doesn’t tell you how much its business depends on Europe.',
    'Use company reports to map those links, then check <strong>which activities the proposed rules would cover</strong>. Regional sales alone won’t reveal every cost or constraint.',
    'More exposure means more potential for a business effect, <strong>not a guaranteed benefit</strong>. Earnings depend on whether the actual terms change that company’s sales or costs.'
  ],
  'eu-agreement':[
    '<strong>CETA already covers trade in goods, services and some public procurement</strong>, subject to conditions. Start there before counting any benefit from a new proposal.',
    'Look for <strong>additional rights or fewer obstacles</strong>: different eligibility, fewer conditions or simpler procedures. A new relationship label alone doesn’t establish any of those.',
    'For markets, the relevant gain is <strong>what changes beyond today’s access</strong>. Until terms and timing are clear, treating existing benefits as new would overstate the opportunity.'
  ],
  'article-adoption':[
    '<strong>Slower growth isn’t the same as falling usage.</strong> Fewer new companies starting with AI could coexist with current users continuing or expanding their use.',
    'Check <strong>repeat usage, renewals and comparable surveys</strong>. Lower spending alone is ambiguous: prices may have fallen or the same work may need less computing.',
    'For suppliers, persistent declines across usage and renewals would raise demand concerns. <strong>One canceled pilot isn’t enough</strong> to conclude the whole market is retreating.'
  ],
  'article-chips':[
    '<strong>Not necessarily.</strong> Businesses can run more AI tasks using spare capacity, or use more efficient models that need less computing per task.',
    'New chip demand becomes more likely when workloads outgrow available capacity. Even then, <strong>capacity needs must turn into hardware purchases</strong> before suppliers see orders.',
    'For chipmakers, watch <strong>workload growth, capacity use and purchasing plans</strong> together. An AI-adoption headline alone doesn’t establish future chip sales or profits.'
  ]
};
const readingTime=(body,initial=false)=>{
  const words=body.replace(/<[^>]*>/g,'').split(/\s+/).length;
  return initial?Math.min(3600,Math.max(1800,words*140+400)):Math.min(5500,Math.max(2800,words*180+500));
};
async function explainBeforeVideo(clip,run){
  if(run!==generation)return false;
  const beats=explanationMessages[clip.id],initial=!followupQuestions[clip.id];
  clearTyping();
  const typing=document.createElement('div');
  typing.className='chat-typing';typing.setAttribute('role','status');typing.setAttribute('aria-label','Catalyst is responding');
  typing.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
  // Keep one indicator directly after the newest reply throughout the response.
  messages.append(typing);scrollChat();
  try{
    for(let i=0;i<beats.length;i++){
      if(run!==generation)return false;
      // Keep the same indicator through reading pauses and message reveals.
      if(i){await delay(readingTime(beats[i-1],initial));if(run!==generation)return false;}
      await delay(650);
      if(run!==generation)return false;
      const message=addMessage('<p>'+beats[i]+'</p>');
      message.classList.add('explanation-message');message.dataset.clipId=clip.id;
    }
    await delay(readingTime(beats.at(-1),initial));
    return run===generation;
  }finally{
    // Remove only this run's indicator, including after cancellation.
    typing.remove();
  }
}
async function prepareVideoReference(clip,run){
  const reference=addMessage('<div class="chat-video-reference preparing" role="status"><span class="video-loading-spinner" aria-hidden="true"></span><span><strong>'+escapeHTML(clip.title)+'</strong><small>Preparing video · prototype preview</small></span></div>');
  await delay(3000);
  return run===generation?reference:null;
}
function readyVideoReference(reference,clip){
  reference.querySelector('.message-body').innerHTML=`<button class="chat-video-reference" data-action="open-node" data-target="${activeNodeId}" aria-label="Replay ${escapeHTML(clip.title)}">${icon('play')}<span><strong>${escapeHTML(clip.title)}</strong><small>${clip.headlineOnly?'Headline only · ':''}Ready · Play again</small></span></button>`;
}
async function videoFollowup(id){if(!busy)await liveExplain(followupQuestions[id]||'Explain this topic further.');}
const topicFollowups={
 'eu-detail':{question:followupQuestions['eu-exposure'],clip:'eu-exposure'},
 'eu-agreement':{question:followupQuestions['eu-agreement'],clip:'eu-agreement'},
 'article-detail':{question:followupQuestions['article-adoption'],clip:'article-adoption'},
 'article-demand':{question:followupQuestions['article-chips'],clip:'article-chips'}
};
function topicSuggestions(current){const root=current.split('-')[0],keys=root==='eu'?['eu-detail','eu-agreement']:['article-detail','article-demand'];const items=keys.filter(k=>topicFollowups[k].clip!==current).map(k=>[topicFollowups[k].question,k]);if(current!==root)items.push(['Which sources support this explanation?','source']);suggestions(items);}
function answerTopic(key){videoFollowup(topicFollowups[key].clip);}
function fedSuggestions(current='fed'){const items=[];if(current!=='fed-loans')items.push([followupQuestions['fed-loans'],'fed-fixed']);if(current!=='fed-stocks')items.push([followupQuestions['fed-stocks'],'fed-stocks']);if(current!=='fed')items.push(['Which sources support this explanation?','source']);suggestions(items);}
async function demo(input=headline,topic='retail'){
 sentSuggestionActions.add('example-'+topic);await liveExplain(input);
}
async function articleAccess(input){
  newConversation({preserveSent:true});sentSuggestionActions.add('example-article');suggestions([]);articleRecovery={mode:'choice'};
  const run=++generation;setBusy(true);$('.chat-heading').textContent='Why companies may keep using AI';
  addMessage(escapeHTML(input),true);
  const reading=addMessage('<p>Reading article…</p>');reading.classList.add('article-reading');
  const typing=document.createElement('div');typing.className='chat-typing';typing.setAttribute('role','status');typing.setAttribute('aria-label','Reading article');typing.innerHTML='<span></span><span></span><span></span>';messages.append(typing);scrollChat();
  await delay(1400);typing.remove();reading.remove();if(run!==generation)return;
  setBusy(false);
  const error=addMessage('<p><strong>I couldn’t read the full article.</strong> It may require a subscription. Paste the text, or continue with a headline-only explanation.</p><p class="access-demo-note">Demo scenario · article access is simulated</p>');error.classList.add('article-access-error');
  suggestions([['Paste article text','article-paste'],['Explain the headline only','article-headline']]);
}
function pasteArticle(){
  if(busy)return;articleRecovery={mode:'paste'};suggestions([]);addMessage('Paste article text',true);
  addMessage('<p>Paste the article text below.</p><p class="access-demo-note">For this demo, use the sample text to preview recovery. New article analysis isn’t connected.</p>');
  suggestions([['Try with sample text','article-sample'],['Explain the headline only','article-headline']]);
  $('#prompt').placeholder='Paste article text here…';$('#prompt').focus();
}
function headlineArticle(){
  if(busy)return;articleRecovery={mode:'headline'};
  demo('Explain the headline only.','article-headline',{keepConversation:true});
}
function sampleArticle(){
  if(busy)return;articleRecovery={mode:'sample'};
  demo(articleDemoText,'article',{keepConversation:true,sample:true});
}
function receiveArticleText(input){
  addMessage(escapeHTML(input),true);
  if(input===articleDemoText){articleRecovery={mode:'sample'};messages.lastElementChild.remove();sampleArticle();return;}
  addMessage('<p>'+(/^https?:\/\//i.test(input)?'That’s another link. Please paste the article’s text.':'Your text is saved in this conversation. This demo can’t generate a new explanation from pasted text yet.')+'</p>');
  suggestions([['Try with sample text','article-sample'],['Explain the headline only','article-headline']]);
}
function revealVideo(){
  clearTimeout(revealTimer);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  drawConnections();
  const surface=$('.canvas'),line=$('.connections');
  surface.classList.remove('revealing');line.classList.remove('revealing');
  void surface.offsetWidth;
  surface.classList.add('revealing');line.classList.add('revealing');
  revealTimer=setTimeout(()=>{surface.classList.remove('revealing');line.classList.remove('revealing');},1150);
}
function showDialog(name,html){$('#dialog-title').textContent=name;$('#dialog-content').innerHTML=html;$('#dialog').showModal();}
function closeDialog(){if($('#dialog').open)$('#dialog').close();}
function library(){showDialog('Your video studies',`<p>Videos generated in this conversation.</p><div class="library-grid">${clips.filter(c=>c.live||c.label==='LOCAL VIDEO').map(c=>`<button class="library-item" data-clip="${c.id}">${c.poster?`<img src="${escapeHTML(c.poster)}" alt="">`:`<span class="icon-fallback">${icon('film')}</span>`}<span><strong>${escapeHTML(c.title)}</strong><small>${c.seconds?c.seconds+' sec · ':''}${c.label.toLowerCase()}</small></span></button>`).join('')}</div><button class="secondary-button" style="margin-top:17px" data-action="upload">Add a local video</button>`);}
function settings(){showDialog('About this prototype','<p>A working interface study using Catalyst’s observed design system and real fal-generated clips.</p><p>Chat replies are scripted. Generation progress is simulated. No AI service is connected and no credits are spent. Added videos stay in this browser session.</p><div class="settings-actions"><button class="primary-button" data-action="demo">Replay generation flow</button><button class="secondary-button" data-action="upload">Add a fal video</button><button class="secondary-button" data-action="new">Try a new conversation</button></div>');}
function sourceContent(){
const content=(title,html)=>({title,html});
if(activeClip.headlineOnly){return content('Headline-only context','<p>The full WSJ article was not read in this simulated recovery flow. This is a general explanation prompted by its title, not a summary of its contents.</p><p>The insurer is an illustrative example. No actual company results, article evidence or market reaction are established.</p><p>Follow-ups explore general AI-adoption mechanisms. They do not establish the article’s claims.</p>');}
if(activeClip.id.startsWith('eu-')){return content('Sources for the EU follow-ups',`<p>These follow-ups explain how to investigate exposure and additional trade access. They do not identify investment winners or confirm new agreement terms.</p><p><a href="https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/canada/eu-canada-agreements/agreement-explained_en" target="_blank" rel="noopener noreferrer">European Commission: CETA coverage and conditions</a></p><p><a href="https://www.investor.gov/introduction-investing/getting-started/researching-investments/how-read-10-k" target="_blank" rel="noopener noreferrer">Investor.gov: using business reports and risk disclosures</a></p><p>The two Canadian firms and the bidding supplier are hypothetical. The diagrams contain no measured company exposures. Apply the research framework to the appropriate company's own filings and the actual proposed terms.</p><p class="muted">Fresh narration with code-rendered graphics. This prototype loads saved videos.</p>`);}
if(activeClip.id.startsWith('article-')){return content('Sources for the AI follow-ups',`<p>These videos extend the article with analytical frameworks; they do not report a current decline in AI use or predict chip sales.</p><p><a href="https://www.census.gov/library/stories/2026/05/ai-use-businesses.html" target="_blank" rel="noopener noreferrer">U.S. Census: measuring business AI use and changed survey wording</a></p><p><a href="https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary" target="_blank" rel="noopener noreferrer">IEA: efficiency, adoption and task intensity</a></p><p><a href="https://www.wsj.com/cio-journal/why-companies-are-unlikely-to-hit-pause-on-ai-9a4f6818" target="_blank" rel="noopener noreferrer">Original WSJ article</a></p><p>The spending alternatives, user paths and spare-capacity example are illustrative. The IEA describes computing and energy drivers, not a one-to-one forecast of supplier orders. No actual utilization, adoption or sales values are shown.</p><p class="muted">Fresh narration with code-rendered graphics. This prototype loads saved videos.</p>`);}

if(activeClip.id.startsWith('fed-')){return content('Sources for the Fed follow-ups',`<p>These videos explain general mechanisms. They do not independently verify the supplied headline, a current target range, or an actual market reaction.</p><p><a href="https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-fixed-rate-and-adjustable-rate-mortgage-arm-loan-en-100/" target="_blank" rel="noopener noreferrer">CFPB: fixed and adjustable mortgage rates</a></p><p><a href="https://www.consumerfinance.gov/ask-cfpb/why-did-my-monthly-mortgage-payment-go-up-or-change-en-213/" target="_blank" rel="noopener noreferrer">CFPB: why mortgage payments can change</a></p><p><a href="https://www.federalreserve.gov/BoardDocs/Speeches/2003/20031002/default.htm" target="_blank" rel="noopener noreferrer">Federal Reserve: policy surprises and stock-market reactions</a></p><p>The 50-basis-point expectation and 25-basis-point decision are hypothetical teaching values. No observed stock return is shown. Loan graphics are conceptual; product terms differ.</p><p class="muted">Fresh fal narration and code-rendered graphics, played as saved videos. Preparation in this prototype is simulated.</p>`);}

if(activeClip.id==='eu'){return content('Sources for Europe and Canada',`<p>The headline matches a September 16, 2026 report about a proposed closer relationship. The video explains a conditional business mechanism, not enacted new trade terms.</p><p><a href="https://www.axios.com/2026/09/16/eu-canada-associate-membership-carney-trump" target="_blank" rel="noopener noreferrer">Axios: the matching headline and proposal</a></p><p><a href="https://www.consilium.europa.eu/en/infographics/eu-canada-trade/" target="_blank" rel="noopener noreferrer">Council of the EU: existing Canada–EU trade relationship and CETA</a></p><p>The manufacturer is hypothetical. The diagrams do not depict actual trade flows, savings, a forecast, or a recommended investment. A completed new agreement is not assumed.</p><p class="muted">Saved narrated video with code-rendered graphics. The preparation sequence is simulated.</p>`);}
if(activeClip.id==='article'){return content('Source and scope of the AI explainer',`<p><a href="https://www.wsj.com/cio-journal/why-companies-are-unlikely-to-hit-pause-on-ai-9a4f6818" target="_blank" rel="noopener noreferrer">The Wall Street Journal: Why Companies Are Unlikely to Hit Pause on AI</a>, by Steven Rosenbush.</p><p>The accessible text discusses customers using established models. This is a focused explanation of that argument, not a summary of the entire newsletter or its linked stories.</p><p>The insurer is an invented teaching example. The distinction between software demand and computing expectations is our analytical framing, not a quoted forecast. No supplier revenue, stock movement, or investment return is predicted.</p><p class="muted">Saved narrated video with code-rendered graphics. If a future article is inaccessible, its text would be needed for an article-specific explanation.</p>`);}
if(activeClip.id==='retail-stocks'){return content('Sources behind retail stocks and expectations',`<p>This is a general explanation, not a report of a particular company’s results or stock reaction.</p><p><a href="https://www.schwab.com/learn/story/how-to-read-an-earnings-report" target="_blank" rel="noopener noreferrer">Schwab: reading earnings, expectations and guidance</a></p><p><a href="https://www.finra.org/investors/insights/financial-performance-metrics-every-investor-should-know" target="_blank" rel="noopener noreferrer">FINRA: revenue, expenses and profit</a></p><p><a href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/how-read" target="_blank" rel="noopener noreferrer">Investor.gov: reading company financial reports</a></p><p>The fictional retailer’s 6% sales growth, 10% expected growth, and $100m/$106m revenue with $90m/$96m costs are teaching values. Profit is $10m in both periods. These are not figures from the supplied headline, and no share-price change is forecast.</p><p class="muted">Fresh generated narration and presenter performance, followed by charts rendered in code. This prototype plays a saved video.</p>`);}if(activeClip.id==='retail-report'){return content('Sources for the retail follow-ups',`<p>These explainers teach report reading and source checking. We have not matched the supplied example headline to a dated release.</p><p><a href="https://www.census.gov/retail/" target="_blank" rel="noopener noreferrer">U.S. Census Bureau: retail releases and data</a></p><p><a href="https://www.census.gov/retail/definitions.html" target="_blank" rel="noopener noreferrer">Census definitions and survey terminology</a></p><p>Period comparisons, revisions and category breadth are reading tools. The diagrams are conceptual and contain no actual retail results. The headline came from the take-home brief; the basket amounts in the first video were teaching examples.</p><p class="muted">Both follow-ups use newly generated narration and code-rendered graphics. Playback is a saved prototype example.</p>`);}if(activeClip.id==='fed'){return content('Sources behind the Fed explainer',`<p>Supplied example headline. This revision explains a general mechanism; it does not independently verify the event or leadership claim.</p><blockquote>${escapeHTML(exampleInputs[0])}</blockquote><p><a href="https://www.federalreserve.gov/faqs/money_12856.htm" target="_blank" rel="noopener noreferrer">Federal Reserve: borrowing costs and spending</a>. Effects are not immediate or identical for every loan.</p><p><a href="https://www.federalreserve.gov/BoardDocs/Speeches/2003/20031002/default.htm" target="_blank" rel="noopener noreferrer">Federal Reserve: monetary policy and stocks</a>. Market reactions depend in part on surprises and expectations.</p><p>The presenter and cafe are AI-generated. Graphics explain the quarter-point definition and a conditional business decision. No current target range is shown. No actual stock-price reaction, forecast or trade recommendation is shown.</p><p class="muted">This example replays a saved generated video. Chat and waiting messages are a scripted prototype sequence.</p>`);}return content('The context behind this video',`<p>Example input from Catalyst’s take-home brief. This is a test headline, not a verified current report.</p><blockquote>${escapeHTML(headline)}</blockquote><p><a href="https://www.census.gov/retail/definitions.html" target="_blank" rel="noopener noreferrer">U.S. Census Bureau: retail sales definitions</a>. Retail sales are dollar values, not adjusted to constant dollars.</p><p>The $50 and $55 ten-item baskets are illustrative values, not reported retail data. They do not establish what drove the headline. The profit diagram shows a possible outcome, not a stock-price forecast.</p><p>The presenter performance, grocery footage and voice were newly generated for this revision. Graphics were rendered in code.</p><p class="muted">This prototype replays a saved video. Chat and preparation timing are simulated.</p>`);}
async function replyInChat(question,html){
  if(busy)return false;
  const run=++generation;setBusy(true);closeDialog();suggestions([]);
  addMessage(escapeHTML(question),true);
  const typing=document.createElement('div');typing.className='chat-typing';typing.setAttribute('role','status');typing.setAttribute('aria-label','Catalyst is responding');typing.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
  messages.append(typing);scrollChat();
  try{
    await delay(650);if(run!==generation)return false;
    addMessage(html).classList.add('suggested-answer');
    return true;
  }finally{typing.remove();if(run===generation)setBusy(false);}
}
async function source(question='Which sources support this explanation?'){
  if(activeClip.live)return replyInChat(question,'<p>This explanation is based on your supplied text, not independently verified reporting. Its diagrams show a possible mechanism, not measured data. Paste a source passage if you want to explore its specific evidence.</p>');
  const content=sourceContent();
  return replyInChat(question,content.html);
}
function exampleQuestions(){suggestions([
  ['How does a Fed rate hike affect markets?','example-fed'],
  ['What does the retail sales headline mean?','example-retail'],
  ['What could closer EU–Canada ties mean?','example-eu'],
  ['Can you explain the WSJ AI article?','example-article']
]);}
async function suggestionReply(action,question){
  if(action==='source'){await source(question);return true;}
  if(action==='library'||action==='demo'){
    const remaining=['fed','retail','eu','article'].some(topic=>!sentSuggestionActions.has('example-'+topic));
    if(await replyInChat(question,remaining?'<p>Choose an example you haven’t explored yet below.</p>':'<p>You’ve explored all four examples. You can replay a video from the conversation or start a new conversation.</p>'))exampleQuestions();return true;
  }
  if(action.startsWith('example-')){
    const topic=action.slice(8);
    sentSuggestionActions.add('example-'+topic);await liveExplain(exampleInputs[['fed','retail','eu','article'].indexOf(topic)]||question);
    return true;
  }
  if(action==='upload'){
    await replyInChat(question,'<p>Yes. Choose a video file to add it to this conversation. It stays in this browser session.</p><button class="secondary-button" data-action="upload">Choose video file</button>');return true;
  }
  if(action==='settings'){
    await replyInChat(question,'<p>This is a guided prototype with saved videos and scripted replies. Selecting an example doesn’t submit a new generation request.</p>');return true;
  }
  if(action==='view-clip'||action==='retail-replay'){
    const clip=action==='retail-replay'?retailClip:(nodes.find(n=>n.id===activeNodeId)?.clip||retailClip);
    if(await replyInChat(question,'<p>Here’s that explanation again.</p>')){
      const node=nodes.find(n=>n.clip?.id===clip.id);if(node){node.replay=true;node.time=0;}
      pendingNodeId=null;renderVideo(clip);
    }return true;
  }
  if(action==='explain'){
    if(await replyInChat(question,'<p><strong>Price is what each item costs. Volume is how much people buy.</strong></p><p>The same groceries can cost more without adding anything to the basket. Buying more items at the same prices is a different reason for a higher total.</p>'))suggestions([['Can you explain this with a video?','draft'],['What does the headline leave out?','limits']]);return true;
  }
  if(action==='limits'){
    if(await replyInChat(question,'<p>The headline reports higher dollar sales, but doesn’t separate <strong>price changes from quantities bought</strong>.</p><p>Its gasoline-price and tax-refund explanation refers to March. We’d need the full report to explain the latest increase.</p>'))suggestions([['What was the original headline?','source'],['How do price and volume differ?','explain']]);return true;
  }
  if(action==='draft'){draft(question);return true;}
  return false;
}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4000);}
async function submit(){
 const input=$('#prompt').value.trim();if(!input||busy)return;$('#prompt').value='';
 if(activeClip.live && /^(which sources|what sources|what is the source)/i.test(input)){await source(input);return;}
 await liveExplain(input);
}
document.addEventListener('click',async event=>{
  const example=event.target.closest('[data-example]');
  if(example){if(busy||example.disabled)return;sentSuggestionActions.add('example-'+['fed','retail','eu','article'][Number(example.dataset.example)]);$('#prompt').value=exampleInputs[Number(example.dataset.example)];await submit();return;}
  const clipButton=event.target.closest('[data-clip]');if(clipButton){closeDialog();pendingNodeId=null;renderVideo(clips.find(c=>c.id===clipButton.dataset.clip));return;}
  const button=event.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action;
  if(action.startsWith('live-question-')){if(!busy)await liveExplain(button.textContent.trim());return;}
  if(action==='live-retry'){if(!busy)await liveResume(button.dataset.job);return;}
  if(button.classList.contains('suggestion-bubble')){
    if(busy)return;
    if(await suggestionReply(action,button.textContent.trim()))return;
  }
  if(['demo','new','home','upload'].includes(action))closeDialog();
  const card=button.closest('.video-card');
  const video=card?.querySelector('video');
  if(action==='open-node'){
    const node=nodes.find(n=>n.id===button.dataset.target);if(!node)return;
    // Choosing an earlier video cancels any in-flight chat delivery.
    if(busy){generation++;clearTyping();messages.querySelectorAll('.chat-video-reference.preparing').forEach(el=>el.closest('.message').remove());setBusy(false);}
    node.replay=button.classList.contains('chat-video-reference');activeClip=node.clip;liveParent=node.clip?.jobId||null;$('.chat-heading').textContent=node.clip?.title||node.title;
    stopPlayback();pendingNodeId=node.pending?node.id:null;activeNodeId=node.id;renderGraph();return;
  }
  if(action==='upload'&&button.dataset.target)pendingNodeId=button.dataset.target;
  const actions={'article-paste':pasteArticle,'article-headline':headlineArticle,'article-sample':sampleArticle,'eu-detail':()=>answerTopic('eu-detail'),'eu-agreement':()=>answerTopic('eu-agreement'),'article-detail':()=>answerTopic('article-detail'),'article-demand':()=>answerTopic('article-demand'),'fed-fixed':()=>videoFollowup('fed-loans'),'fed-stocks':()=>videoFollowup('fed-stocks'),'retail-data':()=>videoFollowup('retail-report'),'retail-stocks':()=>videoFollowup('retail-stocks'),'retail-replay':()=>{const n=nodes.find(n=>n.clip?.id==='retail');if(n){n.replay=true;n.time=0;}pendingNodeId=null;renderVideo(retailClip);},'fed-basis':()=>{addMessage('What does 25 basis points mean?',true);addMessage('<p>A basis point is 0.01 percentage points. <strong>25 basis points is 0.25 percentage points.</strong> This defines the size of a change, not the starting or ending rate.</p>');fedSuggestions();},home,new:newConversation,library,settings,source,explain,limits,draft,demo:()=>demo(),'close-dialog':closeDialog,'view-clip':()=>{const node=nodes.find(n=>n.id===activeNodeId&&!n.pending)||nodes.find(n=>!n.pending);if(node){pendingNodeId=null;renderVideo(node.clip);}else renderVideo(retailClip);},upload:()=>$('#video-file').click(),play:async()=>{if(!video)return;if(video.paused){if(video.ended)video.currentTime=0;try{await video.play();}catch{toast('Playback could not start. Try a different clip.');}}else video.pause();},mute:()=>{if(!video)return;video.muted=!video.muted;card.querySelector('.mute-button').innerHTML=icon(video.muted?'volume-x':'volume-2')+'<span class="sound-label">'+(video.muted?'Sound on':'Sound off')+'</span>';card.querySelector('.mute-button').setAttribute('aria-label',video.muted?'Unmute video':'Mute video');},fullscreen:async()=>{if(!video)return;try{if(video.requestFullscreen)await video.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else toast('Full screen is unavailable in this browser.');}catch{toast('Full screen is unavailable in this preview.');}}};
  if(actions[action])await actions[action]();
});
$('#composer').addEventListener('submit',event=>{event.preventDefault();submit();});
$('#prompt').addEventListener('input',()=>{$('#send').disabled=busy||!$('#prompt').value.trim();});
$('#prompt').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();submit();}});
$('#video-file').addEventListener('change',event=>{
  const file=event.target.files[0];if(!file)return;
  if(!file.type.startsWith('video/')){toast('Please choose a video file.');return;}
  const url=URL.createObjectURL(file);localURLs.push(url);
  const clip={id:`local-${Date.now()}`,title:file.name,subject:'Your latest video',file:url,type:file.type,detail:'A local video added to this conversation. Not uploaded to a server.',label:'LOCAL VIDEO',audio:true};clips.push(clip);renderVideo(clip);
  suggestions([['What is the source context?','source'],['What could a follow-up video explain?','draft']]);
  event.target.value='';
});
function drawConnections(){
  const svg=$('.connections'),target=canvas.querySelector('.video-card,.loading-stage');
  if(innerWidth<=800||$('.canvas').hidden||!target){svg.replaceChildren();return;}
  const root=$('.split-workspace').getBoundingClientRect(),a=$('#composer').getBoundingClientRect(),b=target.getBoundingClientRect();
  const x1=a.right-root.left+3,y1=a.top+a.height/2-root.top,x2=b.left-root.left-3,y2=b.top+b.height/2-root.top,m=(x1+x2)/2,r=Math.min(20,Math.abs(y2-y1)/2),d=y2>y1?1:-1;
  svg.style.setProperty('--line-start',`${x1-4}px`);
  svg.innerHTML=`<path d="M ${x1} ${y1} H ${m-r} Q ${m} ${y1} ${m} ${y1+d*r} V ${y2-d*r} Q ${m} ${y2} ${m+r} ${y2} H ${x2}" fill="none" stroke="#4d4d4d" stroke-width="1" stroke-dasharray="4 3"/><circle cx="${x1}" cy="${y1}" r="3" fill="#696969"/><circle cx="${x2}" cy="${y2}" r="3" fill="#696969"/>`;
}
const scheduleConnections=()=>requestAnimationFrame(drawConnections);
new ResizeObserver(scheduleConnections).observe($('.conversation'));
new ResizeObserver(scheduleConnections).observe($('.canvas'));
new MutationObserver(scheduleConnections).observe(canvas,{childList:true,subtree:true});
window.addEventListener('resize',scheduleConnections);
$('.canvas').addEventListener('scroll',scheduleConnections);
window.addEventListener('beforeunload' ,()=>localURLs.forEach(URL.revokeObjectURL));
home();

window.addEventListener('message',event=>{
  const frame=document.querySelector('.sequence-frame');
  if(event.origin!==location.origin||!frame||event.source!==frame.contentWindow)return;
  if(event.data?.type==='sequence-playing')suggestions([]);
  if(event.data?.type==='sequence-ended')suggestions([['What should I look for in the full report?','retail-data'],['Why can retail stocks fall even when sales rise?','retail-stocks']]);
});

// Live generation uses the local backend; saved examples remain explicitly reproducible.
async function liveConfig(){const r=await fetch('/api/status');if(!r.ok)throw Error('Live generation requires the local backend. The shared site is not connected to the generation backend yet.');return r.json();}
async function liveExplain(input){
 const run=++generation;setBusy(true);stopPlayback();suggestions([]);addMessage(escapeHTML(input),true);
 try{const config=await liveConfig();if(!config.available)throw Error('The server needs the Catalyst credential.');
 const id=crypto.randomUUID(),r=await fetch('/api/jobs',{method:'POST',headers:{'Content-Type':'application/json','X-Catalyst-Token':config.token},body:JSON.stringify({id,input,parent:liveParent||undefined})});const data=await r.json();if(!r.ok)throw Error(data.error);liveParent=id;await livePoll(id,run);
 }catch(e){if(run===generation)addMessage('<p>'+escapeHTML(e.message)+'</p>');}finally{if(run===generation){clearTyping();setBusy(false);}}
}
async function liveResume(id){const run=++generation;setBusy(true);try{const c=await liveConfig();const r=await fetch('/api/jobs/'+id+'/retry',{method:'POST',headers:{'X-Catalyst-Token':c.token}});const d=await r.json();if(!r.ok)throw Error(d.error);await livePoll(id,run);}catch(e){addMessage('<p>'+escapeHTML(e.message)+'</p>');}finally{if(run===generation){clearTyping();setBusy(false);}}}
async function livePoll(id,run){
 const typing=document.createElement('div');typing.className='chat-typing';typing.setAttribute('aria-label','Catalyst is responding');typing.innerHTML='<span></span><span></span><span></span>';messages.append(typing);scrollChat();let reference=null,shown=false;
 const labels={queued:'Waiting for worker',planning:'Preparing explanation',narrating:'Recording narration',presenter:'Animating presenter',rendering:'Rendering graphics and video'};
 const deadline=Date.now()+25*60*1000;
 try{while(run===generation&&Date.now()<deadline){const r=await fetch('/api/jobs/'+id);if(!r.ok)throw Error('Could not retrieve generation status.');const job=await r.json();
 if(job.plan&&!shown){shown=true;$('.chat-heading').textContent=job.plan.title;for(const line of job.plan.chat){if(run!==generation)return;addMessage('<p>'+escapeHTML(line)+'</p>');await delay(1500);}typing.remove();if(run!==generation)return;reference=addMessage('<div class="chat-video-reference preparing"><span class="video-loading-spinner"></span><span><strong>'+escapeHTML(job.plan.title)+'</strong><small>Preparing video</small></span></div>');}
 if(reference&&labels[job.stage])reference.querySelector('small').textContent=labels[job.stage];
 if(job.stage==='ready'){liveParent=id;typing.remove();const clip={id:'live-'+id,jobId:id,live:true,renderedOnly:job.renderedOnly,title:job.plan.title,subject:job.plan.title,scope:job.plan.scope,questions:job.plan.questions,file:job.file,seconds:job.duration,audio:true,label:'EXPLAINER TEST'};clips.push(clip);$('.canvas').hidden=false;pendingNodeId=null;renderVideo(clip);if(reference)readyVideoReference(reference,clip);return;}
 if(job.stage==='needs_text'){typing.remove();if(reference)reference.remove();addMessage('<p>'+escapeHTML(job.message)+'</p>');return;}
 if(job.stage==='failed'||job.interrupted){typing.remove();if(reference)reference.remove();addMessage('<p>'+escapeHTML(job.message||'Generation was interrupted. Resume the saved job to continue.')+'</p><button class="secondary-button" data-action="live-retry" data-job="'+id+'">Resume generation</button>');return;}
 await delay(1500);
 }if(run===generation)throw Error('Generation is still pending. Saved job: '+id);
 }finally{typing.remove();}
}
const sharedLocalJob=new URLSearchParams(location.search).get('job');
if(sharedLocalJob&&/^[a-f0-9-]{36}$/.test(sharedLocalJob)){
 setBusy(true);livePoll(sharedLocalJob,generation).catch(e=>addMessage('<p>'+escapeHTML(e.message)+'</p>')).finally(()=>setBusy(false));
}
