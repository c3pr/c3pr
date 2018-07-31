import c3prLOG4 from "../c3prLOG4/index";

const awaw = require('./c3prLOG3-demo');

function awaw2() {
    awaw();
}

awaw2();
let error = new Error('foo');
c3prLOG4('from2', {lcid: "lcid", euuid: "euuid", error});