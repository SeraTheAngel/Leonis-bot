import fs from 'node:fs';
import path from 'node:path';
const dir=path.resolve('data'); const file=path.join(dir,'economy.json'); fs.mkdirSync(dir,{recursive:true});
let db={}; try{db=JSON.parse(fs.readFileSync(file,'utf8'));}catch{}
export function getEconomy(guildId,userId){db[guildId]??={}; db[guildId][userId]??={balance:1000,lastDaily:0}; return db[guildId][userId];}
export function addCoins(guildId,userId,amount){getEconomy(guildId,userId).balance+=amount;}
export function saveEconomy(){fs.writeFileSync(file,JSON.stringify(db,null,2));}
