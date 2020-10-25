import * as fs from 'fs';

export class Partition{
    elements: number[];

    constructor(elements:number[]){
        this.elements = elements;
    }

    entropy(){
        // H(X) = SUM of x (p(x) * log2(1 / p(x)))
        let entropy: number = 0;
        let allPossib: number = this.elements.reduce((a: number, b: number): number => a + b);
        for (let el of this.elements){
            entropy += el ? el / allPossib * Math.log2(allPossib / el): 0;
        }
        return entropy;
    }
}

export class DecisionCompass {
    numOfOutputValues: number;
    numOfAttributes: number;
    listOfPartitions: Partition[];
    rootPartition: Partition;

    constructor(listOfPartitions: Partition[], numOfOutputValues: number = -1, numOfAttributes: number = -1){
        if (numOfAttributes == -1){
            listOfPartitions.length;
        }
        if (numOfOutputValues == -1){
            numOfOutputValues = listOfPartitions[0].elements.length;
        }
        this.numOfOutputValues = numOfOutputValues;
        this.numOfAttributes = numOfAttributes;
        this.numOfAttributes = numOfAttributes;
        this.listOfPartitions = listOfPartitions;
        let rootPartitionArr: Array<number> = new Array<number>(this.numOfOutputValues).fill(0);
        this.listOfPartitions.forEach((part: Partition, index) => {
            for (let i = 0; i < this.numOfOutputValues; ++i){
                rootPartitionArr[index] += part.elements[i];
            }
        });
        this.rootPartition = new Partition(rootPartitionArr);
    }

    outputVarEntropy(): number{
        return this.rootPartition.entropy();
    }

    averageConditionalEntropy(){
        // H(Y|X) = SUM of x in X (p(x) * H(Y|X=x))
        let entropy: number = 0;
        let allPossib: number = this.rootPartition.elements.reduce((a: number, b: number): number => a + b);
        for (let part of this.listOfPartitions){
            let sumPart: number = part.elements.reduce((a: number, b: number): number => a + b);
            entropy += sumPart ? sumPart / allPossib * part.entropy() : 0;
        }
        return entropy;
    }

    specificConditionalEntropies(){
        // for each partition => H(Y|X=x) = SUM of y in Y (p(y|x) * log2(p(y|x)))
        return this.listOfPartitions.map((p) => p.entropy());
    }

    informationGain(){
        // IG(all, S) = H(all)−H(all|S)
        return this.outputVarEntropy() - this.averageConditionalEntropy();
    }
}

export function getDecisionCompass(p: string){
    let lines = fs.readFileSync(p).toString().split('\n');
    let numOfOutputValues = Number(lines[0]);
    let numOfAttributes = Number(lines[1]);
    let listOfPartitions: Partition[] = JSON.parse(lines[2]).map((el: number[]) =>  new Partition(el));
    return new DecisionCompass(listOfPartitions, numOfOutputValues, numOfAttributes);
}