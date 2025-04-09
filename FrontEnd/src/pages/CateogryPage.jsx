import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryProductList from "../components/CategoryProductList";

const CategoryPage = () => {
  // const { id } = useParams();
  const { slug } = useParams(); // Thay đổi từ id sang slug
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // const response = await fetch(
        //   `http://127.0.0.1:9999/api/category/${id}`
        // );
        const response = await fetch(
          `http://127.0.0.1:9999/api/category/slug/${slug}` // Sử dụng slug để fetch
        );
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) return <p>Đang tải...</p>;
  if (!category) return <p>Không tìm thấy danh mục</p>;

  return <CategoryProductList category={category} />;
};

export default CategoryPage;
