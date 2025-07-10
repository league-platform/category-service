import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import Category from './model.js';

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0'
});

server.route([
  {
    method: 'POST',
    path: '/categories',
    handler: async (request, h) => {
      const category = new Category(request.payload);
      await category.save();
      console.log(`EVENT: category.created -> ${category.name}`);
      return h.response({ message: 'Category created', category }).code(201);
    }
  },
  {
    method: 'GET',
    path: '/categories',
    handler: async () => {
      return await Category.find();
    }
  }
]);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/categories_db');
  await server.start();
  console.log('Category service running on %s', server.info.uri);
};

start();
