const {GITHUB_REPOSITORY:repo,GITHUB_RUN_ID:run,GITHUB_RUN_ATTEMPT:att,RUNNER_NAME:rn,GITHUB_TOKEN:t}=process.env;
const h={Authorization:`Bearer ${t}`,Accept:'application/vnd.github+json'};
const api=async p=>{const r=await fetch('https://api.github.com'+p,{headers:h});return {status:r.status,body:await r.text()}};
(async()=>{
 const j=await api(`/repos/${repo}/actions/runs/${run}/attempts/${att}/jobs`);
 console.log('JOBS status',j.status);
 const jobs=JSON.parse(j.body).jobs||[];
 const me=jobs.find(x=>x.runner_name===rn&&x.status==='in_progress');
 console.log('ME',me&&me.id);
 console.log('STEPS',JSON.stringify((me?.steps||[]).map(s=>[s.number,s.name,s.status,s.conclusion])));
 const a=await api(`/repos/${repo}/check-runs/${me.id}/annotations`);
 console.log('ANNOTATIONS status',a.status,a.body);
 const l=await api(`/repos/${repo}/actions/jobs/${me.id}/logs`);
 console.log('LOGS status',l.status,l.body.slice(0,200));
})().catch(e=>console.log('ERR',e));
