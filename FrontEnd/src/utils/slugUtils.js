export const createSlug = (title) => {
  return title
    .toLowerCase() // Chuyển đổi thành chữ thường
    .replace(/ /g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, "") // Loại bỏ các ký tự không phải chữ cái, số hoặc dấu gạch ngang
    .replace(/--+/g, "-") // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
    .trim(); // Loại bỏ dấu gạch ngang ở đầu và cuối
};
