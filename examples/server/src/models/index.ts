const users = [
  { id: '1', name: 'William Shakespeare', email: 'wshakespeare@email.com' },
  { id: '2', name: 'Ernest Hemingway', email: 'ehemingway@email.com' },
  { id: '3', name: 'Franz Kafka', email: 'fkafka@email.com' },
  { id: '4', name: 'James Joyce', email: 'jjoyce@email.com' },
];

const books = [
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
];

export const userMap = new Map(users.map((user) => [user.id, user]));
export const bookMap = new Map(books.map((book) => [book.id, book]));
