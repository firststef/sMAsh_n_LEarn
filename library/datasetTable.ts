export class DatasetTable {
    head: Array<any>|undefined;
    innerTable: Array<any>|undefined;
    outIndex: number;

    tempValue: Array<any>|undefined;

    constructor(names: Array<string>, data:Array<Array<any>>, outIndex: number = names.length > 1 ? names.length - 1: 0){
        this.head = names;
        this.innerTable = data;
        this.outIndex = outIndex;
        this.reset();
    }

    length(){
        return this.innerTable?.length;
    }

    size(){
        return this.head?.length;
    }

    pop(x: number){
        return this.tempValue?.splice(x, 1);
    }

    reset(){
        this.tempValue = this.innerTable;
    }
}