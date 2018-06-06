import c3prLOG3 from "../c3prLOG3/index";

const awaw = require('./c3prLOG3-demo');

function awaw2() {
    awaw();
}

awaw2();
let error = new Error('foo');
c3prLOG3({msg: 'from2', ids: [1,2,"3","1"], error});