import { mockInstance } from '../builder';

mockInstance.createModel('Book', [
  { id: '1', title: 'Hamlet', numPages: 214, authorId: '1' },
  { id: '2', title: 'Macbeth', numPages: 110, authorId: '1' },
  { id: '3', title: 'Othello', numPages: 320, authorId: '1' },
  { id: '4', title: 'The Old Man and the Sea', numPages: 127, authorId: '2' },
  { id: '5', title: 'For Whom the Bell Tolls', numPages: 471, authorId: '2' },
  { id: '6', title: 'A Farewell to Arms', numPages: 355, authorId: '2' },
  { id: '7', title: 'The Metamorphosis', numPages: 64, authorId: '3' },
  { id: '8', title: 'Letters to Milena', numPages: 298, authorId: '3' },
  { id: '9', title: 'Ulysses', numPages: 732, authorId: '4' },
  { id: '10', title: 'Dubliners', numPages: 152, authorId: '4' },
]);
