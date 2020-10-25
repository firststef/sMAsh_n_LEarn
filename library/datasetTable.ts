export class DatasetTable {
    innerNames: Array<any>;
    innerTable: Array<any>;
    outAttr: string;

    tableStack: Array<{names:Array<string>, table:Array<any>}>;

    constructor(names: Array<string>, data:Array<Array<any>>, outAttr:string = names[names.length - 1]){
        this.innerNames = names;
        this.innerTable = data;
        this.outAttr = outAttr;
        this.tableStack = [{names:JSON.parse(JSON.stringify(names)), table:JSON.parse(JSON.stringify(data))}];
    }

    length(){
        return this.tableStack[this.tableStack.length - 1].table.length;
    }

    table(){
        return this.tableStack[this.tableStack.length - 1].table;
    }

    names(){
        return this.tableStack[this.tableStack.length - 1].names;
    }

    size(){
        return this.tableStack[this.tableStack.length - 1].names.length;
    }

    popEntry(x: number){
        return this.tableStack[this.tableStack.length - 1].table.splice(x, 1);
    }

    popAttr(attr: string){
        let idx = this.colOf(attr);
        this.tableStack[this.tableStack.length - 1].names.splice(idx, 1);
        return this.tableStack[this.tableStack.length - 1].table.map((row) => row.splice(idx, 1));
    }

    filter(func: any){
        this.tableStack[this.tableStack.length - 1].table = this.tableStack[this.tableStack.length - 1].table.filter(func);
    };

    crush(){
        if (this.tableStack.length > 1)
            return this.tableStack.pop();
        else
            return this.innerTable;
    }

    clone(){
        return this.tableStack.push(JSON.parse(JSON.stringify(this.tableStack[this.tableStack.length - 1])));
    }

    reset(){
        this.tableStack[this.tableStack.length - 1] = JSON.parse(JSON.stringify(this.tableStack[this.tableStack.length - 1]));
    }

    colOf(attr: string){
        return this.tableStack[this.tableStack.length - 1].names.indexOf(attr);
    }

    colOfOut(){
        return this.colOf(this.outAttr);
    }

    possibleValues():{[key: string]:{[key: string]: any}} {
        let retObj: {[key: string]:{[key: string]: any}} = {};
        let thisRef = this;
        retObj[this.outAttr] = {};
        this.innerTable.forEach(
            (row) => {
                retObj[this.outAttr][String(row[thisRef.innerNames.indexOf(thisRef.outAttr)])] = 0;
            }
        );
        this.innerNames.filter((attr) => attr != thisRef.outAttr).forEach(
            (attr) => {
                this.innerTable.forEach(
                    (row) => {
                        if (!(attr in retObj)) {
                            retObj[attr] = {};
                        }
                        if (!(String(row[thisRef.innerNames.indexOf(attr)]) in retObj[attr])) {
                            retObj[attr][String(row[thisRef.innerNames.indexOf(attr)])] = {};
                        }
                        retObj[attr][String(row[thisRef.innerNames.indexOf(attr)])] = JSON.parse(JSON.stringify(retObj[this.outAttr]));
                    }
                )
            }
        );
        return retObj;
    }
}