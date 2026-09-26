const $=id=>document.getElementById(id);
let state=JSON.parse(localStorage.getItem("tiLekolMwenV1")||'{"level":"","stars":0,"done":0,"child":"","speech":true,"badges":[]}');
let currentSubject="francais", quizIndex=0, quizSet=[];

const data={
francais:{icon:"📖",title:"Français",sub:"Les premiers pas en lecture.",lessons:{
"Kindergarten":[["Les voyelles","A • E • I • O • U","Apprenons les voyelles !"],["Les couleurs","rouge • bleu • jaune • vert","Reconnais les couleurs."]],
"1re année":[["Les syllabes","ma • me • mi • mo • mu","Lis chaque syllabe doucement."],["Les mots simples","maman • papa • école","Lis les mots à voix haute."]],
"2e année":[["Les phrases","Le chat dort.","Une phrase commence par une majuscule et se termine par un signe de ponctuation."],["Vocabulaire","maison • cahier • crayon","Apprenons de nouveaux mots."]],
"3e année":[["Lecture","Le petit oiseau chante dans l'arbre.","Lis attentivement puis réponds à la question."],["Orthographe","chat • école • maison","Observe l'orthographe des mots."]]}},
math:{icon:"🧮",title:"Mathématiques",sub:"Comptons et calculons.",lessons:{
"Kindergarten":[["Compter","1 • 2 • 3 • 4 • 5","Compte les objets autour de toi."],["Formes","○ cercle • □ carré • △ triangle","Reconnais les formes."]],
"1re année":[["Addition","2 + 3 = 5","Additionner, c'est réunir des quantités."],["Nombres","1 à 20","Compte et reconnais les nombres."]],
"2e année":[["Addition","12 + 7 = 19","Aligne les unités et les dizaines."],["Soustraction","15 − 6 = 9","Soustraire, c'est enlever une quantité."]],
"3e année":[["Multiplication","3 × 4 = 12","3 groupes de 4 donnent 12."],["Petits problèmes","Lina a 8 billes et reçoit 5 billes. Elle en a 13.","Lis le problème et cherche l'opération."]]}},
eveil:{icon:"🌍",title:"Éveil",sub:"Découvrons le monde.",lessons:{
"Kindergarten":[["Les animaux","🐶 chien • 🐱 chat • 🐮 vache","Reconnais les animaux."],["Le corps","👁️ yeux • 👂 oreilles • 👃 nez","Découvrons notre corps."]],
"1re année":[["La famille","papa • maman • frère • sœur","Parlons de la famille."],["Hygiène","Je me lave les mains.","Se laver les mains aide à rester propre."]],
"2e année":[["Les jours","lundi • mardi • mercredi • jeudi • vendredi","Apprenons les jours de la semaine."],["La nature","arbre • fleur • eau • soleil","Protégeons notre environnement."]],
"3e année":[["Les mois","janvier • février • mars • avril • mai • juin","Il y a douze mois dans une année."],["Notre environnement","eau • air • sol • plantes","Prenons soin de notre environnement."]]}}
};

const quizzes={
francais:[
 {q:"Quelle est une voyelle ?",a:["A","B","D"],ok:0},
 {q:"Quelle syllabe commence par M ?",a:["sa","mi","ta"],ok:1},
 {q:"Quel mot désigne un animal ?",a:["chat","cahier","table"],ok:0},
 {q:"Une phrase commence généralement par…",a:["une majuscule","un chiffre","un point"],ok:0}
],
math:[
 {q:"Combien font 2 + 3 ?",a:["4","5","6"],ok:1},
 {q:"Combien font 10 − 4 ?",a:["5","6","7"],ok:1},
 {q:"Combien font 3 × 4 ?",a:["7","10","12"],ok:2},
 {q:"Quel nombre vient après 19 ?",a:["18","20","21"],ok:1}
],
eveil:[
 {q:"Quel animal fait « miaou » ?",a:["🐶 chien","🐱 chat","🐮 vache"],ok:1},
 {q:"Combien y a-t-il de jours dans une semaine ?",a:["5","7","10"],ok:1},
 {q:"Quel organe sert à voir ?",a:["👁️ œil","👂 oreille","👃 nez"],ok:0},
 {q:"Quelle saison est souvent chaude ?",a:["été","hiver","automne"],ok:0}
]};

function save(){localStorage.setItem("tiLekolMwenV1",JSON.stringify(state))}
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");if(id==="rewards")renderRewards();if(id==="parent")renderParent();window.scrollTo(0,0)}
function selectLevel(level){state.level=level;save();$("levelTitle").textContent=level;$("levelEmoji").textContent=({Kindergarten:"🧸","1re année":"🌱","2e année":"📘","3e année":"🎓"})[level];showScreen("level");speak(level+". Choisis une matière.")}
function openLesson(subject){currentSubject=subject;const d=data[subject];$("lessonIcon").textContent=d.icon;$("lessonTitle").textContent=d.title;$("lessonSub").textContent=d.sub;let lessons=d.lessons[state.level]||d.lessons["1re année"];let html=lessons.map((x,i)=>`<div class="lesson-card"><h3>${i+1}. ${x[0]}</h3><div class="word">${x[1]}</div><p>${x[2]}</p><button class="speakWord" onclick="speak(${JSON.stringify(x[1]+" . "+x[2])})">🔊 Écouter</button></div>`).join("");html+=`<div class="lesson-card"><h3>🎮 Défi</h3><p>Teste tes connaissances.</p><button class="primary startQuiz" onclick="startQuiz()">Commencer le quiz</button></div>`;$("lessonContent").innerHTML=html;showScreen("lesson")}
function startQuiz(){quizSet=quizzes[currentSubject];quizIndex=0;showScreen("quiz");renderQuestion()}
function renderQuestion(){const x=quizSet[quizIndex];$("quizProgress").style.width=((quizIndex)/quizSet.length*100)+"%";$("quizIcon").textContent=data[currentSubject].icon;$("question").textContent=x.q;$("feedback").textContent="";$("answers").innerHTML=x.a.map((a,i)=>`<button class="answer" onclick="answer(${i},this)">${a}</button>`).join("");}
function answer(i,btn){const x=quizSet[quizIndex];document.querySelectorAll(".answer").forEach(b=>b.disabled=true);if(i===x.ok){btn.classList.add("correct");state.stars+=10;state.done++;$("feedback").textContent="🎉 Bravo ! Maître Jules Enock te félicite !";speak("Bravo ! Maître Jules Enock te félicite !");}else{btn.classList.add("wrong");$("feedback").textContent="🙂 Essaie encore !";speak("Essaie encore !")}save();setTimeout(()=>{quizIndex++;if(quizIndex<quizSet.length)renderQuestion();else finishQuiz()},900)}
function finishQuiz(){state.stars+=20;state.done++;if(state.done>=1&&!state.badges.includes("premier"))state.badges.push("premier");if(state.stars>=50&&!state.badges.includes("etoiles"))state.badges.push("etoiles");save();$("quizProgress").style.width="100%";$("question").textContent="🏆 Défi terminé !";$("answers").innerHTML=`<button class="primary" onclick="showScreen('rewards')">Voir mes récompenses</button>`;$("feedback").textContent="Tu as gagné des étoiles. Continue !";speak("Défi terminé ! Tu as gagné des étoiles. Continue tes efforts !")}
function speak(text){if(!state.speech||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="fr-FR";u.rate=.82;u.pitch=1.05;window.speechSynthesis.speak(u)}
function speakCurrentQuestion(){speak($("question").textContent)}
function toggleSpeech(){state.speech=!state.speech;save();updateSpeech();if(state.speech)speak("La synthèse vocale est activée.")}
function updateSpeech(){$("speechState").textContent=state.speech?"ON":"OFF";$("soundToggle").textContent=state.speech?"🔊":"🔇"}
function renderRewards(){$("stars").textContent=state.stars;$("done").textContent=state.done;$("badges").textContent=state.badges.length;let items=[];if(state.badges.includes("premier"))items.push(["🌟","Premier défi","Tu as terminé ton premier défi !"]);if(state.badges.includes("etoiles"))items.push(["🏅","50 étoiles","Tu as gagné 50 étoiles !"]);$("badgeList").innerHTML=items.length?items.map(b=>`<div class="badge"><div class="ico">${b[0]}</div><div><b>${b[1]}</b><br><small>${b[2]}</small></div></div>`).join(""):`<div class="badge"><div class="ico">🔒</div><div><b>Continue à apprendre</b><br><small>Les badges apparaîtront ici.</small></div></div>`}
function saveChild(){state.child=$("childName").value.trim();save();renderParent();speak("Le prénom a été enregistré.")}
function renderParent(){$("childName").value=state.child||"";$("parentSummary").innerHTML=`<b>👧 Élève :</b> ${state.child||"Non renseigné"}<br><b>⭐ Étoiles :</b> ${state.stars}<br><b>🎯 Exercices :</b> ${state.done}<br><b>🏅 Badges :</b> ${state.badges.length}`}
function clearProgress(){if(confirm("Réinitialiser toute la progression ?")){state={level:"",stars:0,done:0,child:"",speech:true,badges:[]};save();renderRewards();renderParent();updateSpeech();speak("La progression a été réinitialisée.")}}
$("soundToggle").onclick=toggleSpeech;
updateSpeech();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
