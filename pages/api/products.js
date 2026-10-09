import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import mongoose from "mongoose";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default async function handle(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Method not allowed'});
  }

  await mongooseConnect();
  const {categories, sort, phrase, ...filters} = req.query;
  let [sortField, sortOrder] = (sort || '_id-desc').split('-');

  // Validate sort field to prevent arbitrary field sorting
  const allowedSortFields = ['_id', 'price', 'title'];
  if (!allowedSortFields.includes(sortField)) {
    sortField = '_id';
  }

  const productsQuery = {};
  if (categories) {
    const catIds = categories.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
    if (catIds.length > 0) {
      productsQuery.category = catIds;
    }
  }
  if (phrase) {
    const safePhrase = escapeRegex(phrase.toString().slice(0, 100));
    productsQuery['$or'] = [
      {title:{$regex:safePhrase,$options:'i'}},
      {description:{$regex:safePhrase,$options:'i'}},
    ];
  }
  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach(filterName => {
      // Only allow alphanumeric filter names to prevent query injection
      if (/^[a-zA-Z0-9_]+$/.test(filterName)) {
        productsQuery['properties.'+filterName] = filters[filterName].toString().slice(0, 100);
      }
    });
  }
  res.json(await Product.find(
    productsQuery,
    null,
    {
      sort:{[sortField]:sortOrder==='asc' ? 1 : -1},
      limit: 100,
    })
  );
}