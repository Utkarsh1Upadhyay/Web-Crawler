import {parse} from "node-html-parser";
import Semaphore from "./semaphore.js";
import CircuitBreaker from "./circuitBreaker.js";

function Crawler(concurrency){
    this.semaphore= new Semaphore(concurrency);
    this.circuitBreaker=new CircuitBreaker(3);
    this.results=[];
}

Crawler.prototype.crawlOne=async function (url){
    
    if(this.circuitBreaker.isOpen(url))
    {
        return{
            url,
            status:"skipped",
            reason:"URL open"
        };
    }
    await this.semaphore.acquire();

    const start=Date.now();
    try{
      const response= await fetch(url);
      const responseTime=Date.now()-start;
      const html=await response.text();
      const root=parse(html);

      const titleTag=root.querySelector("title");
      const title= titleTag?titleTag.text:"Title not found";

      const linkAll=root.querySelectorAll("a");
      const urlAll=linkAll.map(a=>a.getAttribute("href")).filter(href=> href && href.startsWith("http")).slice(0,10);

      return{
        url,
        status:response.status,
        responsetime:`${responseTime}ms`,
        title,
        urlAll
      };
    }
    catch(err){
       this.circuitBreaker.recordFailure(url);
       return{
        url,
        status:"error",
        reason:err.message
       };
    }
    finally{
        this.semaphore.release();
    }
}

Crawler.prototype.crawl=async function (urls) {
    const promises=urls.map(url=>this.crawlOne(url));
    const result=await Promise.all(promises);
    return result;
}

export default Crawler;

