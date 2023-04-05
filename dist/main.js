(()=>{"use strict";function t(){chrome.runtime.lastError&&console.log("Looks like a tab died while we were processing it:",chrome.runtime.lastError.message)}let e={tab_id:0,last_domain:"",https_pattern:/^https:\/\//,domain_pattern:/^http(s|):\/\//,api_url:"https://api.ssllabs.com/api/v3/analyze?fromCache=on&maxAge=48&host=",detail_url:"https://www.ssllabs.com/ssltest/analyze.html?&hideResults=on&d=",onChange:function(t,o){if(e.tab_id=o,!t.match(this.https_pattern))return this.setIcon("no");{let o=this.getDomainFromUrl(t);fetch(e.api_url+o).then((t=>t.json())).then((t=>{console.log(t);const o=["A+","A","A-","B","C","D","E","F","M","T"];let n=-1,s=!0,r=!1;if(t&&"ERROR"===t.status)r=!0;else if(t&&"IN_PROGRESS"===t.status||"DNS"===t.status)s=!1;else if(t&&"READY"===t.status&&t.endpoints)for(const e of t.endpoints){const t=o.indexOf(e.grade);t>n&&(n=t)}r?e.setIcon("error"):s?s&&n>-1&&e.setIcon(o[n]):e.setIcon("waiting")})).catch((t=>{console.error("Error fetching JSON data:",t)}))}},setIcon:function(o){console.log("*** GRADE: "+o);let n={tabId:e.tab_id,path:"../icons/"+o.toLowerCase()+".png"};return chrome.action.setIcon(n,t),!0},getDomainFromUrl:function(t){return t.replace(this.domain_pattern,"").split("/")[0]}};chrome.action.onClicked.addListener((async function(t){if(console.log("Click"),"undefined"==typeof browser);else{console.log("Requesting permissions");const t={origins:["https://api.ssllabs.com/"]};await browser.permissions.request(t)}let o;if(t.url)o=t.url;else{if(!t.pendingUrl)return void console.log("Error locating tab URL");o=t.pendingUrl}let n=e.getDomainFromUrl(o);chrome.tabs.create({url:e.detail_url+n})})),chrome.tabs.onUpdated.addListener((async function(t,o,n){let s;if(n.url)s=n.url;else{if(!n.pendingUrl)return void console.log("Error locating tab URL");s=n.pendingUrl}"loading"==o.status&&e.onChange(s,t)}))})();