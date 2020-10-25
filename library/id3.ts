import {ModelCreatorAlgorithm, Model} from './modelCreator';
import {DecisionCompass, Partition} from './decisionCompass';
import {DecisionTree} from './decisionTree';

export class ID3Algorithm<InType, OutType> extends ModelCreatorAlgorithm<InType, OutType, DecisionTree>{
    recurseTravel(currentNode: {[key: string]: any}){
        let thisRef = this;

        if(this.table == undefined){
            return;
        }

        let possibleValues = this.table.possibleValues();
        let partitions = this.table.names().filter((attr, ia) => attr != thisRef.table?.outAttr).map(
            (attr, ia) => {
                let inValueFreq: {[key: string]: any}= JSON.parse(JSON.stringify(possibleValues[attr]));
                this.table?.table().forEach(
                    (row, ir) => {
                        if (thisRef.table?.colOfOut()){
                            inValueFreq[String(row[ia])][String(row[thisRef.table?.colOfOut()])]++;
                        }
                    }
                );
                
                return {
                    attr: attr, 
                    partitions: Object.keys(inValueFreq).map(
                        (k: string) => new Partition(Object.values(inValueFreq[k]))
                    ),
                    values: Object.keys(inValueFreq)
                };
            }
        );
        let condEntropies = partitions?.map(
            (part) => {
                return {
                    ...part,
                    entropy: (new DecisionCompass(part.partitions)).averageConditionalEntropy(),
                }
            }
        );

        if (condEntropies?.every((c)=>c.entropy == 0)){
            currentNode['node'] = condEntropies[0].attr;
            currentNode['partitions'] = condEntropies[0].partitions;
            condEntropies[0].values.forEach((val) => {
                currentNode[val] = {};
            });
            return;
        }
        
        let entropies = condEntropies?.map((el) => el.entropy);
        if (condEntropies && entropies){
            let chosenIndex = entropies.indexOf(Math.min.apply(Math, entropies));
            let chosenAttr = condEntropies[chosenIndex].attr;
            currentNode['node'] = chosenAttr;
            currentNode['partitions'] = partitions?.find((p) => p.attr == chosenAttr)?.partitions;
            partitions?.find((p) => p.attr == chosenAttr)?.values.forEach((val, iv) => {
                currentNode[val] = {};
                let partE = partitions?.find((p) => p.attr == chosenAttr);
                for (let ii = 0; partE && ii < partE.partitions[iv].elements.length; ++ii){
                    if (partE.partitions[iv].elements[ii] == 0 && thisRef.table){
                        currentNode[val]["value"] = thisRef.table.table()[0][thisRef.table.colOfOut()];
                        return;
                    }
                }
                let newNode = {};
                thisRef.table?.clone();
                thisRef.table?.filter(
                    (row: Array<any>) => thisRef.table && row[thisRef.table.colOf(chosenAttr)] == val
                );
                thisRef.table?.popAttr(chosenAttr);
                thisRef.recurseTravel(newNode);
                thisRef.table?.crush();
                currentNode[val] = newNode;
            });
        }
    }

    train(): DecisionTree{
        let model:DecisionTree = new DecisionTree();

        this.recurseTravel(model.tree);

        return model;
    }
}