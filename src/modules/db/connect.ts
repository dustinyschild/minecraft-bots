import mongoose from 'mongoose';

export const connect = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/minecraft').then(() => {
    console.log('Connected to: mongodb://localhost:27017/minecraft');
  });
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
