function Semaphore(lim)
{
    this.limit=lim;
    this.running=0;
    this.queue=[];
}

Semaphore.prototype.acquire=async function(){
    if(this.running<this.limit)
    {
        this.running++;
        return;
    }
    await new Promise(resolve=>{
        this.queue.push(resolve);
    });
}

Semaphore.prototype.release=function(){
    if(this.queue.length>0)
    {
        const next=this.queue.shift();
        next();
    }
    else
    {
        this.running--;
    }
}

export default Semaphore;

