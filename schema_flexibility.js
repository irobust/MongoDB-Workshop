db.products.updateMany(
  { "category": { $in: ["laptops"] } },
  { $set: { "warrantyYears": 2 } }
);

db.products.find(
  { category: { $in: ["laptops"] } },
  { name: 1, warrantyYears: 1, _id: 0 }
);

db.products.updateOne(
  { name: "MacBook Pro 16-inch" },
  {
    $set: {
      availability_status: {
        in_stock: true,
        quantity_available: 15,
        estimated_shipping: "2-3 business days"
      }
    }
  }
);

db.products.find(
  { name: "MacBook Pro 16-inch" },
  { name: 1, availability_status: 1, _id: 0 }
);

db.products.updateOne(
  { name: "Dell XPS 15" },
  {
    $set: {
      availability_status: {
        in_stock: false,
        quantity_available: 0,
        estimated_shipping: "1-2 weeks (backordered)"
      }
    }
  }
);

db.products.find(
  { name: "Dell XPS 15" },
  { name: 1, availability_status: 1, _id: 0 }
);

db.products.updateOne(
  { name: "Lenovo ThinkPad X1 Carbon" },
  {
    $set: {
      availability_status: {
        in_stock: true,
        quantity_available: 8,
        estimated_shipping: "next business day"
      }
    }
  }
);

db.products.find(
  { name: "Lenovo ThinkPad X1 Carbon" },
  { name: 1, availability_status: 1, _id: 0 }
);
