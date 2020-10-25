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
        let children = this.table.names().filter((attr, ia) => attr != thisRef.table?.outAttr).map(
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
                    values: Object.keys(inValueFreq),
                    finalValues: Object.keys(inValueFreq).map(
                        (k: string) => Object.keys(inValueFreq[k])
                    ),
                };
            }
        );
        let condEntropies = children?.map(
            (child) => {
                return {
                    ...child,
                    entropy: (new DecisionCompass(child.partitions)).averageConditionalEntropy(),
                }
            }
        );

        if (condEntropies?.every((c)=>c.entropy == 0)){
            currentNode['node'] = condEntropies[0].attr;
            currentNode['partitions'] = condEntropies[0].partitions;

            let chosenChild =  condEntropies[0];
            chosenChild?.values.forEach((val, iv) => {
                currentNode[val] = {};
                for (let ii = 0; chosenChild && ii < chosenChild.partitions[iv].elements.length; ++ii){
                    if (chosenChild.partitions[iv].elements[ii] != 0){
                        currentNode[val]["value"] = chosenChild.finalValues[iv][ii];
                        return;
                    }
                }
            });
            return;
        }
        
        let entropies = condEntropies?.map((el) => el.entropy);
        if (condEntropies && entropies){
            let chosenIndex = entropies.indexOf(Math.min.apply(Math, entropies));
            let chosenAttr = condEntropies[chosenIndex].attr;
            currentNode['node'] = chosenAttr;
            let chosenChild =  children?.find((p) => p.attr == chosenAttr);
            currentNode['partitions'] = chosenChild?.partitions;
            chosenChild?.values.forEach((val, iv) => {
                currentNode[val] = {};
                if (chosenChild?.partitions[iv].elements.some((el) => el == 0)){
                    for (let ii = 0; chosenChild && ii < chosenChild.partitions[iv].elements.length; ++ii){
                        if (chosenChild.partitions[iv].elements[ii] != 0){
                            currentNode[val]["value"] = chosenChild.finalValues[iv][ii];
                            return;
                        }
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