import { useEffect } from "react";
import "../css/style.css";
import "../css/grid.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productAction";
import CategoryProductList from "./CategoryProductList";
import manImg from "../img/Manpage.webp";
import longVuNam from "../img/LongVuNam.webp";
import jeanNam from "../img/JeanNam.webp";

const ManPage = () => {
  const products = useSelector((state) => state.products?.products || []);
  const loading = useSelector((state) => state.products?.loading || false);
  const error = useSelector((state) => state.products?.error || null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="man-img" style={{ marginTop: "100px" }}>
            <img
              src={manImg}
              alt="manImg"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                marginTop: "50px",
              }}
            />
          </div>
          <div className="code">
            <p>NHẬN CODE ÁP DỤNG ƯU ĐÃI ONLINE</p>
          </div>
          <div className="code-content">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="voucher-items-list">
                <div className="vocher-item">
                  <div className="voucher-item-info">
                    <div className="voucher-item-detail ">
                      <div className="voucher-item-title">
                        <span style={{ color: "#ba372a" }}>
                          GIẢM THÊM 6% TỐI ĐA 60K
                        </span>
                      </div>
                      <div className="voucher-item-des">
                        <span style={{ fontSize: "10pt" }}>Nhập mã </span>
                        <strong>
                          <span style={{ fontSize: "12pt" }}>TOKYO60</span>
                        </strong>
                      </div>
                      <div className="voucher-item-des">
                        <span style={{ fontSize: "10pt" }}>
                          Cho đơn hàng từ 199,000đ
                        </span>
                      </div>
                      <div className="voucher-item-date">
                        <span className="expire" style={{ fontSize: "10pt" }}>
                          Hết hạn: 28/02/2025
                        </span>
                      </div>
                    </div>
                    <div className="voucher-item-action">
                      <div className="action">
                        <span
                          className="copy-content"
                          style={{ cursor: "pointer", fontSize: "8pt" }}
                        >
                          Sao chép mã
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vocher-item">
                  <div className="voucher-item-info">
                    <div className="voucher-item-detail ">
                      <div className="voucher-item-title">
                        <span style={{ color: "#ba372a" }}>
                          GIẢM THÊM 8% TỐI ĐA 200K
                        </span>
                      </div>
                      <div className="voucher-item-des">
                        <span style={{ fontSize: "10pt" }}>Nhập mã </span>
                        <strong>
                          <span style={{ fontSize: "12pt" }}>LIFE200</span>
                        </strong>
                      </div>
                      <div className="voucher-item-des">
                        <span style={{ fontSize: "10pt" }}>
                          Cho đơn hàng từ 349,000đ
                        </span>
                      </div>
                      <div className="voucher-item-date">
                        <span className="expire" style={{ fontSize: "10pt" }}>
                          Hết hạn: 28/02/2025
                        </span>
                      </div>
                    </div>
                    <div className="voucher-item-action">
                      <div className="action">
                        <span
                          className="copy-content"
                          style={{ cursor: "pointer", fontSize: "8pt" }}
                        >
                          Sao chép mã
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vocher-item">
                  <div className="voucher-item-info">
                    <div className="voucher-item-detail ">
                      <div className="voucher-item-title">
                        <span style={{ color: "#ba372a" }}>
                          GIẢM THÊM 100,000đ
                        </span>
                      </div>
                      <div className="voucher-item-des">
                        <span style={{ fontSize: "10pt" }}>Nhập mã </span>
                        <strong>
                          <span style={{ fontSize: "12pt" }}>CLEAR200</span>
                        </strong>
                      </div>
                      <div className="voucher-item-des">
                        <span style={{ fontSize: "10pt" }}>
                          Cho đơn hàng từ 799,000đ
                        </span>
                      </div>
                      <div className="voucher-item-date">
                        <span className="expire" style={{ fontSize: "10pt" }}>
                          Hết hạn: 28/02/2025
                        </span>
                      </div>
                    </div>
                    <div className="voucher-item-action">
                      <div className="action">
                        <span
                          className="copy-content"
                          style={{ cursor: "pointer", fontSize: "8pt" }}
                        >
                          Sao chép mã
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="code">
            <p>ÁO KHOÁC PHAO & LÔNG VŨ NAM</p>
          </div>
          <div className="jacket-img">
            <img
              src={longVuNam}
              alt="longVuNam"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                marginTop: "50px",
              }}
            />
          </div>
          <div className="line-home-page">
            <span></span>
          </div>

          <div className="home-page">
            <CategoryProductList slug="ao-khoac-phao-va-long-vu-nam" />
          </div>

          <div className="code">
            <p>QUẦN DÀI VÀ JEAN NAM</p>
          </div>
          <div className="sunblock jacket">
            <img
              src={jeanNam}
              alt="jeanNam"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                marginTop: "50px",
              }}
            />
          </div>
          <div className="line-home-page">
            <span></span>
          </div>
          <div className="home-page">
            <CategoryProductList slug="quan-dai-va-jean-nam" />
          </div>

          <div className="code">
            <p>GIÀY THỂ THAO & GIÀY CHẠY NAM</p>
          </div>

          <div className="line-home-page">
            <span></span>
          </div>
          <div className="home-page">
            <CategoryProductList slug="giay-the-thao-va-giay-chay-nam" />
          </div>

          <div className="code">
            <p>ĐỒ LÓT NAM</p>
          </div>
          <div className="line-home-page">
            <span></span>
          </div>
          <div className="home-page">
            <CategoryProductList slug="do-lot-nam" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManPage;
