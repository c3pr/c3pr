function Hello()
{
    console.log('1');
    console.log(Hello.caller.name);
    console.log('2');
    console.log(Hello.caller.caller);
    console.log('3');
}

function garb() { return Hello(); }


garb();

console.log('-----------')

(() => { Hello(); })();