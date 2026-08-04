// 1. Create Collection
db.products.insertMany([
  {
    "name": "MacBook Pro 16-inch",
    "price": 2499.99,
    "currency": "USD",
    "category": ["electronics", "computers", "laptops"],
    "specifications": {
      "processor": "Apple M2 Pro",
      "memory": "16GB",
      "display": "16-inch Liquid Retina XDR"
    },
    "reviews": [{
      "rating": 5,
      "comment": "Incredible performance and battery life",
      "reviewer": "Alex M."
    },{
      "rating": 5,
      "comment": "Best design",
      "reviewer": "Karen H."
    }],
    "warranty": {
      "duration": "1 year",
      "type": "limited",
      "coverage": "hardware defects"
    },
    "availability_status": {
      "in_stock": true,
      "quantity_available": 15,
      "estimated_shipping": "2-3 business days"
    }
  },
  {
    "name": "Dell XPS 15",
    "price": 1899.99,
    "currency": "USD",
    "category": ["electronics", "computers", "laptops"],
    "specifications": {
      "processor": "Intel Core i9-13900H",
      "memory": "32GB",
      "display": "15.6-inch 4K OLED"
    },
    "reviews": [{
      "rating": 4,
      "comment": "Great build quality and screen, but runs hot under load",
      "reviewer": "Jamie T."
    }],
    "warranty": {
      "duration": "2 years",
      "type": "premium support",
      "coverage": "hardware and software support"
    },
    "availability_status": {
      "in_stock": false,
      "quantity_available": 0,
      "estimated_shipping": "1-2 weeks (backordered)"
    }
  },
  {
    "name": "Lenovo ThinkPad X1 Carbon",
    "price": 1599.99,
    "currency": "USD",
    "category": ["electronics", "computers", "laptops"],
    "specifications": {
      "processor": "Intel Core i7-13700U",
      "memory": "16GB",
      "display": "14-inch WUXGA IPS"
    },
    "reviews": [{
      "rating": 4.5,
      "comment": "Excellent keyboard and build quality. Perfect for business use.",
      "reviewer": "Sam K."
    }],
    "warranty": {
      "duration": "3 years",
      "type": "business",
      "coverage": "on-site service"
    },
    "availability_status": {
      "in_stock": true,
      "quantity_available": 8,
      "estimated_shipping": "next business day"
    }
  }
])


// 2. Read data - Find all in-stock laptops
db.products.find({
  "category": "laptops",
  "availability_status.in_stock": true
})


// 3. CRUD Operations
// Create - Insert new product
db.products.insertOne({
  "name": "MacBook Air 13-inch",
  "price": 1099.99,
  "currency": "USD",
  "category": ["electronics", "computers", "laptops"],
  "specifications": {
    "processor": "Apple M2",
    "memory": "8GB",
    "display": "13.6-inch Liquid Retina"
  },
  "reviews": [{
    "rating": 5,
    "comment": "Great performance and portability. Perfect for everyday tasks.",
    "reviewer": "Lisa R."
  },{
    "rating": 4.5,
    "comment": "Excellent battery life, but limited ports",
    "reviewer": "Mike D."
  }],
  "warranty": {
    "duration": "1 year",
    "type": "limited",
    "coverage": "hardware defects"
  },
  "availability_status": {
    "in_stock": true,
    "quantity_available": 10,
    "estimated_shipping": "next business day"
  }
})

db.products.insertOne({
  "name": "HP Spectre x360",
  "price": 1399.99,
  "currency": "USD",
  "category": ["electronics", "computers", "laptops"],
  "specifications": {
    "processor": "Intel Core i7-1260P",
    "memory": "16GB",
    "display": "13.5-inch OLED"
  },
  "reviews": [],
  "warranty": {
    "duration": "2 years",
    "type": "premium",
    "coverage": "accidental damage"
  },
  "availability_status": {
    "in_stock": true,
    "quantity_available": 5,
    "estimated_shipping": "3-5 business days"
  }
})

// Update - Change price of MacBook Pro
db.products.updateOne(
  { "name": "MacBook Pro 16-inch" },
  { $set: { "price": 2599.99 } }
)

// Delete - Remove a product
db.products.deleteOne({ "name": "HP Spectre x360" })


// 4. Aggregation Queries
// Average price by category
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  },
  { $sort: { averagePrice: -1 } }
])

// Top-rated products (with at least 1 review)
db.products.aggregate([
  { $match: { "reviews.0": { $exists: true } } },
  { $unwind: "$reviews" },
  {
    $group: {
      _id: "$name",
      averageRating: { $avg: "$reviews.rating" },
      totalReviews: { $sum: 1 }
    }
  },
  { $sort: { averageRating: -1 } }
])

// Inventory summary by warranty type
db.products.aggregate([
  {
    $group: {
      _id: "$warranty.type",
      totalInventory: { $sum: "$availability_status.quantity_available" },
      products: { $push: "$name" }
    }
  }
])

// 5. Indexing Strategies
// Compound index for category and price filtering/sorting
db.products.createIndex({ "category": 1, "price": -1 })

// Index for availability status
db.products.createIndex({ "availability_status.in_stock": 1 })

// Index for processor specifications
db.products.createIndex({ "specifications.processor": "text" })
