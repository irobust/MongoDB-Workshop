db.movies.aggregate([
  // 1. กรองเอาเฉพาะหนังเรื่องที่เราสนใจก่อนเพื่อประสิทธิภาพ (เช่น เรื่อง The Godfather)
  {
    $match: {
      title: "The Godfather"
    }
  },
  // 2. ดึงข้อมูลคอมเมนต์จาก collection "comments"
  {
    $lookup: {
      from: "comments",         // Collection ปลายทางที่จะไปเชื่อม
      localField: "_id",        // ฟิลด์ใน movies (Collection ต้นทาง)
      foreignField: "movie_id", // ฟิลด์ใน comments ที่เก็บ reference
      as: "movie_comments"     // ชื่อฟิลด์ใหม่ที่จะเก็บ Array ของผลลัพธ์
    }
  },
  // 3. (Optional) เลือกเฉพาะฟิลด์ที่ต้องการแสดง
  {
    $project: {
      title: 1,
      year: 1,
      directors: 1,
      movie_comments: { name: 1, text: 1, date: 1 }
    }
  }
])