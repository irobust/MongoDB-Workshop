# Implementing Thai Full-Text Search with MongoDB Atlas Search

This repository provides a comprehensive guide and configuration templates for implementing efficient **Thai Full-Text Search** using **MongoDB Atlas Search**. 

Since the Thai language does not use whitespaces to separate words, standard tokenizers fail to index Thai text correctly. This guide demonstrates how to leverage Atlas Search's native Lucene integration using `lucene.thai` and specialized `icuTokenizer` custom analyzers to achieve highly accurate search results.

---

## Prerequisites
- A MongoDB Atlas Account.
- A deployed cluster (M0 Free Tier, M2, M5, or M10+ dedicated instances).
*Note: M0 Free Tier supports up to 3 Search Indexes per cluster.*

---

## How to Access Atlas Search Indexing
If you cannot find the **Search** tab on your Atlas dashboard, follow these steps:
1. Navigate to your **project** dashboard.
2. On the **Application Development** panels, click on **Search**.
3. Alternatively, click **Database** on the left menu, find your cluster, click **Browse Collections**, and then select the **Search Indexes** tab from the top row inside the collection view.
4. Click **Create Search Index** and choose **JSON Editor**.

---

## Configuration 1: Standard Thai Analyzer (Quick Start)

For basic applications, you can use the built-in `lucene.thai` analyzer. This handles basic Thai word segmentation out-of-the-box.

### Index Definition (JSON)
Select your Database and Collection, then paste the following configuration in the **JSON Editor**:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.thai"
      },
      "description": {
        "type": "string",
        "analyzer": "lucene.thai"
      }
    }
  }
}
```

---

## Querying the Index (Aggregation Pipeline)

### Preparing data
```
[
  {
    "title": "เรียนรู้ MongoDB เริ่มต้น",
    "description": "MongoDB คือฐานข้อมูลแบบ NoSQL สำหรับการพัฒนาแอปพลิเคชันยุคใหม่",
    "category": "ฐานข้อมูล",
    "author": "สมชาย สมบัติ",
    "price": 399
  },
  {
    "title": "เจาะลึกการใช้งาน Docker",
    "description": "การใช้งาน Docker เพื่อจัดเตรียมสภาพแวดล้อมและจัดการคอนเทนเนอร์ให้การ deploy แอปพลิเคชันเป็นเรื่องง่าย",
    "category": "เดฟออปส์ (DevOps)",
    "author": "วิชาญ ลี",
    "price": 450
  },
  {
    "title": "เริ่มต้นใช้งาน Kubernetes",
    "description": "เรียนรู้การทำ Container Orchestration และระบบการจัดการคอนเทนเนอร์ด้วย Kubernetes",
    "category": "เดฟออปส์ (DevOps)",
    "author": "อลิสา บราวน์",
    "price": 299
  },
  {
    "title": "ภาษา Python สำหรับผู้เริ่มต้น",
    "description": "ปูพื้นฐานการเขียนโปรแกรมด้วยภาษา Python และการสร้างระบบอัตโนมัติ (Automation)",
    "category": "การเขียนโปรแกรม",
    "author": "ธนพล วิลสัน",
    "price": 299
  },
  {
    "title": "MongoDB ระดับสูง",
    "description": "เรียนรู้เรื่องการทำ Replication, Sharding, Aggregation Pipeline และการจัดการ Indexes เพื่อประสิทธิภาพสูงสุด",
    "category": "ฐานข้อมูล",
    "author": "สมชาย สมบัติ",
    "price": 399
  },
  {
    "title": "การพัฒนา API ด้วย Node.js",
    "description": "สร้าง RESTful API ที่มีประสิทธิภาพสูงด้วย Express framework และเชื่อมต่อกับ MongoDB",
    "category": "การเขียนโปรแกรม",
    "author": "กิตติพงษ์ จอห์นสัน",
    "price": 499
  },
  {
    "title": "ความมั่นคงปลอดภัยไซเบอร์ขั้นพื้นฐาน",
    "description": "เรียนรู้เรื่องความปลอดภัยของระบบเครือข่าย, ระบบการยืนยันตัวตน และการเข้ารหัสข้อมูล",
    "category": "ความปลอดภัยไซเบอร์",
    "author": "ศิริพร มิลเลอร์",
    "price": 599
  },
  {
    "title": "เรียนรู้การใช้งาน Terraform",
    "description": "การจัดการโครงสร้างพื้นฐานในรูปแบบโค้ด (Infrastructure as Code) ด้วย Terraform",
    "category": "คลาวด์คอมพิวติ้ง",
    "author": "ไมเคิล ไวท์",
    "price": 599
  }
]
```

### Query
Once the index status transitions to **Active**, execute searches using the `$search` stage at the very beginning of your aggregation pipeline.

```javascript
db.books.aggregate([
  {
    $search: {
      index: "default", // Replace with your actual search index name if different
      text: {
        query: "การพัฒนาซอฟต์แวร์", // Search query: "Software Development"
        path: ["title", "description"] // Fields to look up
      }
    }
  },
  {
    $project: {
      _id: 1,
      title: 1,
      description: 1,
      score: { $meta: "searchScore" } // Tracks text relevance rank
    }
  }
])
```

---

## Configuration 2: Custom Thai Analyzer (Advanced)

For production environments, a **Custom Analyzer** is highly recommended. By utilizing `icuTokenizer` (International Components for Unicode), you gain better segmenting capabilities, mixed English-Thai text optimization, case insensitivity, and custom stopword filtering.

### Index Definition (JSON)
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "thaiCustomAnalyzer"
      },
      "description": {
        "type": "string",
        "analyzer": "thaiCustomAnalyzer"
      }
    }
  },
  "analyzers": [
    {
      "name": "thaiCustomAnalyzer",
      "charFilters": [],
      "tokenizer": {
        "type": "icuTokenizer"
      },
      "tokenFilters": [
        {
          "type": "lowercase"
        },
        {
          "type": "stopword",
          "tokens": [
            "และ",
            "หรือ",
            "ที่",
            "ซึ่ง",
            "อัน",
            "แต่",
            "ของ",
            "ใน",
            "โดย"
          ]
        }
      ]
    }
  ]
}
```

### Key Components Explained:
- **`icuTokenizer`**: The algorithmic foundation capable of detecting word boundaries in script-adjoined languages like Thai, Khmer, Chinese, and Japanese.
- **`lowercase` Filter**: Converts any English terms mixed inside the text into lowercase, ensuring searches are case-insensitive.
- **`stopword` Filter**: Eliminates common Thai conjunctions or prepositions (e.g., "and", "or", "of", "in") to save index space and boost relevance scoring.

---

## Best Practices & Limitations

1. **Re-indexing Time**: Modifying custom analyzers or mappings will prompt Atlas to rebuild the search index. Large collections may take several minutes to reflect changes.
2. **Autocomplete vs. Full-Text**: If you are aiming for a *search-as-you-type* feature, define your mapping type as `autocomplete` rather than standard text strings.
3. **Synonyms Configuration**: To associate words with identical definitions (e.g., "รถยนต์" and "รถเก๋ง"), define a `synonyms` source collection within your search index configuration mapping.

