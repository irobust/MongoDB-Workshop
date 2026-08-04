db.products.createIndex({ price: 1 });

db.products.find(
  { price: { $lt: 2000 } },
  { "name": 1, "price": 1, "_id": 0 }
  ).sort({ price: 1 }
);

db.products.createIndex(
    { category: 1, price: -1 }
);

db.products.find(
  { category: "laptops" },
  { "name": 1, "category": 1, "_id": 0 }
  ).sort({ category: 1, price: -1 }
);

db.products.createIndex({ category: 1 });

db.products.find(
  { category: { $in: ["electronics", 
    "computers"] } },
  { "name": 1, "category": 1, "_id": 0 }
);
