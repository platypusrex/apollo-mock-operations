import { mockInstance } from '../builder';

mockInstance.createModel('User', [
  {
    id: '1',
    name: 'William Shakespeare',
    email: 'wshakespeare@email.com',
    address: [
      {
        addressLineOne: '100 Baker Ave',
        city: 'Charleston',
        state: 'SC',
        zip: '29412',
      },
    ],
  },
  {
    id: '2',
    name: 'Ernest Hemingway',
    email: 'ehemingway@email.com',
    address: [
      {
        addressLineOne: '200 Lakeside Dr',
        city: 'Charleston',
        state: 'SC',
        zip: '29412',
      },
    ],
  },
  {
    id: '3',
    name: 'Franz Kafka',
    email: 'fkafka@email.com',
    address: [
      {
        addressLineOne: '300 Franklin Dr',
        city: 'Mt Pleasant',
        state: 'SC',
        zip: '29464',
      },
    ],
  },
  {
    id: '4',
    name: 'James Joyce',
    email: 'jjoyce@email.com',
    address: [
      {
        addressLineOne: '500 Sycamore Ln',
        city: 'Mt Pleasant',
        state: 'SC',
        zip: '29464',
      },
    ],
  },
]);
