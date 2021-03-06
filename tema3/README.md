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
```js
{
  node: 'Legs',
  partitions: [
    Partition { elements: [ 2, 5 ] },
    Partition { elements: [ 3, 0 ] }
  ],
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
        Y: { value: 'M' },
        N: { value: 'H' }
      },
      T: { value: 'H' }
    },
    Y: {
      node: 'Height',
      partitions: [
        Partition { elements: [ 0, 1 ] },
        Partition { elements: [ 1, 0 ] }
      ],
      S: { value: 'H' },
      T: { value: 'M' }
    }
  },
  '3': { value: 'M' }
}
```

Testing:

```js
model.solve(['N','3','S','Y']); // Solving N,3,S,Y Answer:  M
```

The functions and the used formulas can be found in [lib](../library/)