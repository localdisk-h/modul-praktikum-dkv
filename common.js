const MODULE_KEY = "dkv_html_progress_v1";

function loadProgress(){
  try{return JSON.parse(localStorage.getItem(MODULE_KEY)) || {}}
  catch(e){return {}}
}
function saveProgress(data){
  localStorage.setItem(MODULE_KEY, JSON.stringify(data));
}
function setModuleProgress(id, percent, score=null){
  const data = loadProgress();
  data[id] = {percent:Math.max(0,Math.min(100,percent)), score, updated:new Date().toISOString()};
  saveProgress(data);
  updateProgressUI();
}
function getModuleProgress(id){
  return loadProgress()[id] || {percent:0,score:null};
}
function updateProgressUI(){
  const data=loadProgress();
  document.querySelectorAll("[data-progress-id]").forEach(el=>{
    const id=el.dataset.progressId;
    const p=data[id]?.percent || 0;
    const bar=el.querySelector(".progress span");
    const text=el.querySelector(".progress-text");
    if(bar) bar.style.width=p+"%";
    if(text) text.textContent=p+"%";
  });
}
function resetAllProgress(){
  localStorage.removeItem(MODULE_KEY);
  updateProgressUI();
  alert("Progres lokal berhasil dihapus.");
}
function checkQuiz(moduleId, answers, total){
  let score=0;
  for(const [name,correct] of Object.entries(answers)){
    const chosen=document.querySelector(`input[name="${name}"]:checked`);
    if(chosen && chosen.value===correct) score++;
  }
  const percent=Math.round((score/total)*100);
  const box=document.getElementById("quizScore");
  if(box) box.textContent=`Nilai: ${percent} (${score}/${total} benar)`;
  setModuleProgress(moduleId, Math.max(getModuleProgress(moduleId).percent, percent>=75?100:75), percent);
}
document.addEventListener("DOMContentLoaded", updateProgressUI);
