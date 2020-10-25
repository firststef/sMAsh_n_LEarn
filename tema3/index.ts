

import { DatasetTable } from '../library/datasetTable';
import {ID3Algorithm } from '../library/id3';

(function main(){
    let algor: ID3Algorithm<Array<string>, string> = new ID3Algorithm<Array<string>, string>();
    algor.import(new DatasetTable(
        ['Green','Legs','Height','Smelly', 'Species'],
        [
            ['N','3','S','Y','M'],
            ['Y','2','T','N','M'],
            ['Y','3','T','N','M'],
            ['N','2','S','Y','M'],
            ['Y','3','T','N','M'],
            ['N','2','T','Y','H'],
            ['N','2','S','N','H'],
            ['N','2','T','N','H'],
            ['Y','2','S','N','H'],
            ['N','2','T','Y','H']
        ]
    ));
    algor.train();
    algor.show();

})();