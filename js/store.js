/* Transactional browser persistence. Never reads, copies, or migrates API keys. */
class CampaignStore {
    constructor(factory=globalThis.indexedDB) { this.factory=factory; this.db=null; }
    async open() {
        if(!this.factory) throw Error('Browser database is unavailable. Enable browser storage to play safely.');
        this.db=await new Promise((resolve,reject)=>{
            const req=this.factory.open('nexus-campaigns',1);
            req.onupgradeneeded=()=>{
                const db=req.result;
                db.createObjectStore('campaigns',{keyPath:'campaign_id'});
                db.createObjectStore('checkpoints',{keyPath:'checkpoint_id'}).createIndex('campaign_id','campaign_id');
                db.createObjectStore('meta');
            };
            req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
            req.onblocked=()=>reject(Error('Close other Nexus tabs to upgrade browser storage.'));
        });
        this.db.onversionchange=()=>this.db.close();
    }
    async read(store,key) { return new Promise((resolve,reject)=>{const r=this.db.transaction(store).objectStore(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}); }
    async all(store) { return new Promise((resolve,reject)=>{const r=this.db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}); }
    async save(value,expectedRevision=null,checkpoint=null) {
        return new Promise((resolve,reject)=>{
            const tx=this.db.transaction(['campaigns','checkpoints','meta'],'readwrite');
            let conflict;
            const store=tx.objectStore('campaigns'),req=store.get(value.campaign_id);
            req.onsuccess=()=>{
                const existing=req.result;
                if(expectedRevision!==null && (existing?.revision??0)!==expectedRevision) {
                    conflict=Error('This campaign changed in another tab. Download your work, then reload the saved campaign.'); tx.abort(); return;
                }
                store.put(value);
                if(checkpoint) tx.objectStore('checkpoints').put(checkpoint);
                tx.objectStore('meta').put(value.campaign_id,'last_active');
            };
            tx.oncomplete=()=>resolve();
            tx.onerror=()=>reject(tx.error||Error('Save failed.'));
            tx.onabort=()=>reject(conflict||tx.error||Error('Save cancelled.'));
        });
    }
    async checkpoints(campaignId) {
        return new Promise((resolve,reject)=>{const r=this.db.transaction('checkpoints').objectStore('checkpoints').index('campaign_id').getAll(campaignId);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    }
    async remove(campaignId) {
        return new Promise((resolve,reject)=>{
            const tx=this.db.transaction(['campaigns','meta'],'readwrite');tx.objectStore('campaigns').delete(campaignId);
            const r=tx.objectStore('meta').get('last_active');r.onsuccess=()=>{if(r.result===campaignId) tx.objectStore('meta').delete('last_active');};
            // Checkpoints remain recoverable through recovery export until browser data is cleared.
            tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
        });
    }
    async importLegacy(storage,core) {
        if(await this.read('meta','legacy_imported')) return [];
        const raw=storage.getItem('nexus_sessions');
        const failures=[];
        if(raw) {
            let sessions; try {sessions=JSON.parse(raw);} catch {throw Error('Legacy browser sessions are malformed. Original storage has been left untouched.');}
            for(const [name,value] of Object.entries(sessions)) {
                try {
                    const data=core.migrate(value);
                    data.name=name; data.campaign_id='legacy-'+name;
                    if(!await this.read('campaigns',data.campaign_id)) await this.save(data);
                } catch { failures.push(name); }
            }
        }
        if(!failures.length) await new Promise((resolve,reject)=>{const tx=this.db.transaction('meta','readwrite');tx.objectStore('meta').put(true,'legacy_imported');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
        return failures;
    }
}
globalThis.CampaignStore=CampaignStore;
if(typeof module!=='undefined') module.exports=CampaignStore;
