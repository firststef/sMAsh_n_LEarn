import {Model} from './model';
//import * as open from 'open';
const util = require('util');


export class DecisionTree extends Model<Array<any>, string>{
    tree: {[key: string]: any};

    constructor(){
        super();
        this.tree = {};
    }

    async show(): Promise<void>{
        //await open.default('./images/explanation.png', {wait: true, app: 'firefox'});
        console.log(util.inspect(this.tree, {showHidden: false, depth: null}));
    }
}