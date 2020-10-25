import {DatasetTable} from './datasetTable';
import {Model} from './model';
export {Model} from './model';

export abstract class ModelCreatorAlgorithm<InType, OutType> {
    table: DatasetTable|undefined;

    constructor(){}

    import(table: DatasetTable){
        this.table = table;
    }

    abstract train(): Model<InType, OutType>;

    abstract show(): void;
}