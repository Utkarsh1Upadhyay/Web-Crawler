function CircuitBreaker(thresholdvalue)
{
    this.threshold=thresholdvalue;
    this.failures={};
}

CircuitBreaker.prototype.recordFailure=function(url){
    const domain=new URL(url).hostname;
    if(this.failures[domain]===undefined)
    {
        this.failures[domain]=0;
    }
    this.failures[domain]++;
}

CircuitBreaker.prototype.isOpen=function(url){
    const domain=new URL(url).hostname;
    if(this.failures[domain]===undefined)
    {
        return false;
    }
    return this.failures[domain]>=this.threshold;
}

export default CircuitBreaker;

