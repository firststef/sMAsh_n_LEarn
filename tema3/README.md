# ID3 Algorithm modeling

Input:
```js
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
let model = algor.train();
model.show();
```

Output:
```json
{
  '2': {
    node: 'Green',
    partitions: [
      Partition { elements: [ 1, 4 ] },
      Partition { elements: [ 1, 1 ] }
    ],
    N: {
      node: 'Height',
      partitions: [
        Partition { elements: [ 1, 1 ] },
        Partition { elements: [ 0, 3 ] }
      ],
      S: {
        node: 'Smelly',
        partitions: [
          Partition { elements: [ 1, 0 ] },
          Partition { elements: [ 0, 1 ] }
        ],
        Y: {},
        N: {}
      },
      T: {}
    },
    Y: {
      node: 'Height',
      partitions: [
        Partition { elements: [ 0, 1 ] },
        Partition { elements: [ 1, 0 ] }
      ],
      S: {},
      T: {}
    }
  },
  '3': {},
  node: 'Legs',
  partitions: [
    Partition { elements: [ 2, 5 ] },
    Partition { elements: [ 3, 0 ] }
  ]
}
```

The functions and the used formulas can be found in [lib](../library/)