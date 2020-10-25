import {ModelCreatorAlgorithm, Model} from './modelCreator';
import {DecisionCompass, Partition} from './decisionCompass';

export class ID3Algorithm<InType, OutType> extends ModelCreatorAlgorithm<InType, OutType>{
    train(): Model<InType, OutType>{
        let model: Model<InType, OutType> = new Model();

        let thisRef = this;
        while(this.table?.length()){
            let outValues:{[key: string]: any} = {};
            this.table?.tempValue?.forEach(
                (row) => {
                    if (thisRef.table && thisRef.table?.tempValue){
                        outValues[String(row[thisRef.table?.outIndex])] = 0;
                    }
                }
            )
            let condEntropies = this.table.head?.filter((attr, ia) => ia != this.table?.outIndex).map(
                (attr, ia) => {
                    let inValueFreq: {[key: string]: any}= {};
                    this.table?.tempValue?.forEach(
                        (row, ir) => {
                            if (thisRef.table?.outIndex){
                                if (String(row[ia]) in inValueFreq){
                                    if (!(String(row[thisRef.table?.outIndex]) in inValueFreq[String(row[ia])])){
                                        inValueFreq[String(row[ia])][String(row[thisRef.table?.outIndex])] = 0;
                                    }
                                    inValueFreq[String(row[ia])][String(row[thisRef.table?.outIndex])]++;
                                }
                                else{
                                    inValueFreq[String(row[ia])] = {...outValues};
                                    inValueFreq[String(row[ia])][String(row[thisRef.table?.outIndex])] = 1;
                                }
                            }
                        }
                    )

                    return (new DecisionCompass(Object.keys(inValueFreq).map((k: string) => new Partition(Object.values(inValueFreq[k]))))).averageConditionalEntropy();
                }
            );
        }

        return model;
    }

    show(): void{
        console.log('arbore');
    }
}