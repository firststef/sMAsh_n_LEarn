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

    solve(input: Array<any>): string|undefined{
        if (!this.tree) {
            return undefined;
        }

        let currentPos = this.tree;
        let final: string|undefined;
        while(!final || input.some((el) => el in currentPos) || "value" in currentPos){
            if ("value" in currentPos)
                return currentPos["value"];
            let present = input.find((el: any) => el in currentPos);
            if (present){
                currentPos = currentPos[present];
                input.slice(input.indexOf(present),1);
            }
            else
                break;
        }
        return final;
    }
}