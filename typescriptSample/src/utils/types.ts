export interface Schema<T> {
  _id?: T;
}

export interface Appointment<T = undefined> extends Schema<T> {
  _id?: T;
  customerId: string;
  hairdresserId: string;
  startTime: number;
  endTime: number;
  service: string;
  comments: string;
  price: number;
}

export interface Review<T = undefined> extends Schema<T> {
  _id?: T;
  posterId: string;
  hairdresserId: string;
  body: string;
  rating: number;
}
