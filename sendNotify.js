const querystring=require("querystring"),$=new require('./env').Env(),timeout=15e3;let SCKEY="",BARK_PUSH="",BARK_SOUND="",TG_BOT_TOKEN="",TG_USER_ID="",TG_PROXY_HOST="",TG_PROXY_PORT="",TG_PROXY_AUTH="",TG_API_HOST="api.telegram.org",DD_BOT_TOKEN="",DD_BOT_SECRET="",QYWX_KEY="",QYWX_AM="",IGOT_PUSH_KEY="",PUSH_PLUS_TOKEN="",PUSH_PLUS_USER="";async function sendNotify(e,o,n={},s=""){o+=s,await Promise.all([serverNotify(e,o),pushPlusNotify(e,o)]),e=e.match(/.*?(?=\s?-)/g)?e.match(/.*?(?=\s?-)/g)[0]:e,await Promise.all([BarkNotify(e,o,n),tgBotNotify(e,o),ddBotNotify(e,o),qywxBotNotify(e,o),qywxamNotify(e,o),iGotNotify(e,o,n)])}function serverNotify(e,o,n=2100){return new Promise((s=>{if(SCKEY){o=o.replace(/[\n\r]/g,"\n\n");const t={url:SCKEY.includes("SCT")?`https://sctapi.ftqq.com/${SCKEY}.send`:`https://sc.ftqq.com/${SCKEY}.send`,body:`text=${e}&desp=${o}`,headers:{"Content-Type":"application/x-www-form-urlencoded"},timeout:15e3};setTimeout((()=>{$.post(t,((e,o,n)=>{try{e?(console.log("发送通知调用API失败！！\n"),console.log(e)):0===(n=JSON.parse(n)).errno||0===n.data.errno?console.log("server酱发送通知消息成功🎉\n"):1024===n.errno?console.log(`server酱发送通知消息异常: ${n.errmsg}\n`):console.log(`server酱发送通知消息异常\n${JSON.stringify(n)}`)}catch(e){$.logErr(e,o)}finally{s(n)}}))}),n)}else console.log("\n\n您未提供server酱的SCKEY，取消微信推送消息通知🚫\n"),s()}))}function CoolPush(e,o){return new Promise((n=>{if(QQ_SKEY){let s={url:`https://push.xuthus.cc/${QQ_MODE}/${QQ_SKEY}`,headers:{"Content-Type":"application/json"}};switch(e=e.replace(/京豆/g,"豆豆"),o=(o=(o=o.replace(/京豆/g,"")).replace(/🐶/g,"")).replace(/红包/g,"H包"),QQ_MODE){case"email":s.json={t:e,c:o};break;default:s.body=`${e}\n\n${o}`}let t=function(e){switch(e){case"send":return"个人";case"group":return"QQ群";case"wx":return"微信";case"ww":return"企业微信";case"email":return"邮件";default:return"未知方式"}};$.post(s,((e,o,s)=>{try{e?(console.log(`发送${t(QQ_MODE)}通知调用API失败！！\n`),console.log(e)):200===(s=JSON.parse(s)).code?console.log(`酷推发送${t(QQ_MODE)}通知消息成功🎉\n`):400===s.code?console.log(`QQ酷推(Cool Push)发送${t(QQ_MODE)}推送失败：${s.msg}\n`):503===s.code?console.log(`QQ酷推出错，${s.message}：${s.data}\n`):console.log(`酷推推送异常: ${JSON.stringify(s)}`)}catch(e){$.logErr(e,o)}finally{n(s)}}))}else console.log("您未提供酷推的SKEY，取消QQ推送消息通知🚫\n"),n()}))}function BarkNotify(e,o,n={}){return new Promise((s=>{if(BARK_PUSH){const t={url:`${BARK_PUSH}/${encodeURIComponent(e)}/${encodeURIComponent(o)}?sound=${BARK_SOUND}&${querystring.stringify(n)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"},timeout:15e3};$.get(t,((e,o,n)=>{try{e?(console.log("Bark APP发送通知调用API失败！！\n"),console.log(e)):200===(n=JSON.parse(n)).code?console.log("Bark APP发送通知消息成功🎉\n"):console.log(`${n.message}\n`)}catch(e){$.logErr(e,o)}finally{s()}}))}else console.log("您未提供Bark的APP推送BARK_PUSH，取消Bark推送消息通知🚫\n"),s()}))}function tgBotNotify(e,o){return new Promise((n=>{if(TG_BOT_TOKEN&&TG_USER_ID){const s={url:`https://${TG_API_HOST}/bot${TG_BOT_TOKEN}/sendMessage`,body:`chat_id=${TG_USER_ID}&text=${e}\n\n${o}&disable_web_page_preview=true`,headers:{"Content-Type":"application/x-www-form-urlencoded"},timeout:15e3};if(TG_PROXY_HOST&&TG_PROXY_PORT){const e={https:require("tunnel").httpsOverHttp({proxy:{host:TG_PROXY_HOST,port:1*TG_PROXY_PORT,proxyAuth:TG_PROXY_AUTH}})};Object.assign(s,{agent:e})}$.post(s,((e,o,s)=>{try{e?(console.log("telegram发送通知消息失败！！\n"),console.log(e)):(s=JSON.parse(s)).ok?console.log("Telegram发送通知消息成功🎉。\n"):400===s.error_code?console.log("请主动给bot发送一条消息并检查接收用户ID是否正确。\n"):401===s.error_code&&console.log("Telegram bot token 填写错误。\n")}catch(e){$.logErr(e,o)}finally{n(s)}}))}else console.log("您未提供telegram机器人推送所需的TG_BOT_TOKEN和TG_USER_ID，取消telegram推送消息通知🚫\n"),n()}))}function ddBotNotify(e,o){return new Promise((n=>{const s={url:`https://oapi.dingtalk.com/robot/send?access_token=${DD_BOT_TOKEN}`,json:{msgtype:"text",text:{content:` ${e}\n\n${o}`}},headers:{"Content-Type":"application/json"},timeout:15e3};if(DD_BOT_TOKEN&&DD_BOT_SECRET){const e=require("crypto"),o=Date.now(),t=e.createHmac("sha256",DD_BOT_SECRET);t.update(`${o}\n${DD_BOT_SECRET}`);const r=encodeURIComponent(t.digest("base64"));s.url=`${s.url}&timestamp=${o}&sign=${r}`,$.post(s,((e,o,s)=>{try{e?(console.log("钉钉发送通知消息失败！！\n"),console.log(e)):0===(s=JSON.parse(s)).errcode?console.log("钉钉发送通知消息成功🎉。\n"):console.log(`${s.errmsg}\n`)}catch(e){$.logErr(e,o)}finally{n(s)}}))}else DD_BOT_TOKEN?$.post(s,((e,o,s)=>{try{e?(console.log("钉钉发送通知消息失败！！\n"),console.log(e)):0===(s=JSON.parse(s)).errcode?console.log("钉钉发送通知消息完成。\n"):console.log(`${s.errmsg}\n`)}catch(e){$.logErr(e,o)}finally{n(s)}})):(console.log("您未提供钉钉机器人推送所需的DD_BOT_TOKEN或者DD_BOT_SECRET，取消钉钉推送消息通知🚫\n"),n())}))}function qywxBotNotify(e,o){return new Promise((n=>{const s={url:`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${QYWX_KEY}`,json:{msgtype:"text",text:{content:` ${e}\n\n${o}`}},headers:{"Content-Type":"application/json"},timeout:15e3};QYWX_KEY?$.post(s,((e,o,s)=>{try{e?(console.log("企业微信发送通知消息失败！！\n"),console.log(e)):0===(s=JSON.parse(s)).errcode?console.log("企业微信发送通知消息成功🎉。\n"):console.log(`${s.errmsg}\n`)}catch(e){$.logErr(e,o)}finally{n(s)}})):(console.log("您未提供企业微信机器人推送所需的QYWX_KEY，取消企业微信推送消息通知🚫\n"),n())}))}function ChangeUserId(e){const o=QYWX_AM.split(",");if(o[2]){const n=o[2].split("|");let s="";for(let o=0;o<n.length;o++){const t="签到号 "+(o+1);e.match(t)&&(s=n[o])}return s||(s=o[2]),s}return"@all"}function qywxamNotify(e,o){return new Promise((n=>{if(QYWX_AM){const s=QYWX_AM.split(","),t={url:"https://qyapi.weixin.qq.com/cgi-bin/gettoken",json:{corpid:`${s[0]}`,corpsecret:`${s[1]}`},headers:{"Content-Type":"application/json"},timeout:15e3};$.post(t,((t,r,c)=>{html=o.replace(/\n/g,"<br/>");var l=JSON.parse(c);let _;switch(accesstoken=l.access_token,s[4]){case"0":_={msgtype:"textcard",textcard:{title:`${e}`,description:`${o}`,url:"",btntxt:"更多"}};break;case"1":_={msgtype:"text",text:{content:`${e}\n\n${o}`}};break;default:_={msgtype:"mpnews",mpnews:{articles:[{title:`${e}`,thumb_media_id:`${s[4]}`,author:"智能助手",content_source_url:"",content:`${html}`,digest:`${o}`}]}}}s[4]||(_={msgtype:"text",text:{content:`${e}\n\n${o}`}}),_={url:`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accesstoken}`,json:{touser:`${ChangeUserId(o)}`,agentid:`${s[3]}`,safe:"0",..._},headers:{"Content-Type":"application/json"}},$.post(_,((e,s,t)=>{try{e?(console.log("成员ID:"+ChangeUserId(o)+"企业微信应用消息发送通知消息失败！！\n"),console.log(e)):0===(t=JSON.parse(t)).errcode?console.log("成员ID:"+ChangeUserId(o)+"企业微信应用消息发送通知消息成功🎉。\n"):console.log(`${t.errmsg}\n`)}catch(e){$.logErr(e,s)}finally{n(t)}}))}))}else console.log("您未提供企业微信应用消息推送所需的QYWX_AM，取消企业微信应用消息推送消息通知🚫\n"),n()}))}function iGotNotify(e,o,n={}){return new Promise((s=>{if(IGOT_PUSH_KEY){if(!new RegExp("^[a-zA-Z0-9]{24}$").test(IGOT_PUSH_KEY))return console.log("您所提供的IGOT_PUSH_KEY无效\n"),void s();const t={url:`https://push.hellyw.com/${IGOT_PUSH_KEY.toLowerCase()}`,body:`title=${e}&content=${o}&${querystring.stringify(n)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"},timeout:15e3};$.post(t,((e,o,n)=>{try{e?(console.log("发送通知调用API失败！！\n"),console.log(e)):("string"==typeof n&&(n=JSON.parse(n)),0===n.ret?console.log("iGot发送通知消息成功🎉\n"):console.log(`iGot发送通知消息失败：${n.errMsg}\n`))}catch(e){$.logErr(e,o)}finally{s(n)}}))}else console.log("您未提供iGot的推送IGOT_PUSH_KEY，取消iGot推送消息通知🚫\n"),s()}))}function pushPlusNotify(e,o){return new Promise((n=>{if(PUSH_PLUS_TOKEN){o=o.replace(/[\n\r]/g,"<br>");const s={token:`${PUSH_PLUS_TOKEN}`,title:`${e}`,content:`${o}`,topic:`${PUSH_PLUS_USER}`},t={url:"http://www.pushplus.plus/send",body:JSON.stringify(s),headers:{"Content-Type":" application/json"},timeout:15e3};$.post(t,((e,o,s)=>{try{e?(console.log(`push+发送${PUSH_PLUS_USER?"一对多":"一对一"}通知消息失败！！\n`),console.log(e)):200===(s=JSON.parse(s)).code?console.log(`push+发送${PUSH_PLUS_USER?"一对多":"一对一"}通知消息完成。\n`):console.log(`push+发送${PUSH_PLUS_USER?"一对多":"一对一"}通知消息失败：${s.msg}\n`)}catch(e){$.logErr(e,o)}finally{n(s)}}))}else console.log("您未提供push+推送所需的PUSH_PLUS_TOKEN，取消push+推送消息通知🚫\n"),n()}))}process.env.PUSH_KEY&&(SCKEY=process.env.PUSH_KEY),process.env.QQ_SKEY&&(QQ_SKEY=process.env.QQ_SKEY),process.env.QQ_MODE&&(QQ_MODE=process.env.QQ_MODE),process.env.BARK_PUSH?(BARK_PUSH=process.env.BARK_PUSH.indexOf("https")>-1||process.env.BARK_PUSH.indexOf("http")>-1?process.env.BARK_PUSH:`https://api.day.app/${process.env.BARK_PUSH}`,process.env.BARK_SOUND&&(BARK_SOUND=process.env.BARK_SOUND)):BARK_PUSH&&-1===BARK_PUSH.indexOf("https")&&-1===BARK_PUSH.indexOf("http")&&(BARK_PUSH=`https://api.day.app/${BARK_PUSH}`),process.env.TG_BOT_TOKEN&&(TG_BOT_TOKEN=process.env.TG_BOT_TOKEN),process.env.TG_USER_ID&&(TG_USER_ID=process.env.TG_USER_ID),process.env.TG_PROXY_AUTH&&(TG_PROXY_AUTH=process.env.TG_PROXY_AUTH),process.env.TG_PROXY_HOST&&(TG_PROXY_HOST=process.env.TG_PROXY_HOST),process.env.TG_PROXY_PORT&&(TG_PROXY_PORT=process.env.TG_PROXY_PORT),process.env.TG_API_HOST&&(TG_API_HOST=process.env.TG_API_HOST),process.env.DD_BOT_TOKEN&&(DD_BOT_TOKEN=process.env.DD_BOT_TOKEN,process.env.DD_BOT_SECRET&&(DD_BOT_SECRET=process.env.DD_BOT_SECRET)),process.env.QYWX_KEY&&(QYWX_KEY=process.env.QYWX_KEY),process.env.QYWX_AM&&(QYWX_AM=process.env.QYWX_AM),process.env.IGOT_PUSH_KEY&&(IGOT_PUSH_KEY=process.env.IGOT_PUSH_KEY),process.env.PUSH_PLUS_TOKEN&&(PUSH_PLUS_TOKEN=process.env.PUSH_PLUS_TOKEN),process.env.PUSH_PLUS_USER&&(PUSH_PLUS_USER=process.env.PUSH_PLUS_USER),module.exports={sendNotify:sendNotify,BARK_PUSH:BARK_PUSH};
//# sourceMappingURL=/sm/eeb84bbfbc943f4c0c6d0a528f5ae6b30e281cf6c575ecb79acebdb4f85bea5f.map
