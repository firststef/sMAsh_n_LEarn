'use strict';
import * as cp from '../library/decisionCompass';


(function main(){
    let compass = cp.getDecisionCompass1();
    console.log("Entropy of root", compass.outputVarEntropy());
    console.log("Entropy of leaf node partitions", compass.specificConditionalEntropies());
    console.log("Average conditional entropy of compass", compass.averageConditionalEntropy());
    console.log("Information gain", compass.informationGain());
})();