import { useEffect } from "react";
import "../css/style.css";
import "../css/grid.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productAction";
import Slider from "../Components/Slider";
import aoKhoacGiuAm from "../img/Áo khoác giữ ấm.webp";
import giayNu from "../img/Giày Nữ .webp";
import quanNu from "../img/Quần nữ.webp";
import doLotNu from "../img/Đồ Lót Nữ.webp";
import aoChongNang from "../img/Áo chống Nắng.webp";
import giayNam from "../img/Giày Nam.webp";
import quanNam from "../img/Quần Nam.webp";
import doLotNam from "../img/Quần Lót Nam.webp";
import aoKhoacLongvu from "../img/ÁOKHOÁCPHAO&LÔNG VŨ.webp";
import aoChongNangUV from "../img/ÁoChốngNắng.webp";
import giayTheThao from "../img/GiayTheThao.webp";
import jean from "../img/JEAN.webp";
import CategoryProductList from "./CategoryProductList";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="carousel">
            <Slider />
          </div>
          <div className="product-home-name">
            <span className="text-home-name">HÔM NAY MUA GÌ?</span>
          </div>
          <div className="home-content">
            <div className="col-lg-10 col-md-12 col-sm-12 col-12">
              <div className="home-img">
                <Link to={`/category/ao-khoac-phao-and-long-vu`}>
                  <img src={aoKhoacGiuAm} alt="Áo Khoác Phao & Lông Vũ" />
                  <span>Áo Khoác Phao & Lông Vũ</span>
                </Link>

                <Link to={`/category/giay-the-thao-va-giay-chay-bo-nu`}>
                  <img src={giayNu} alt="GIÀY THỂ THAO & GIÀY CHẠY BỘ NỮ" />
                  <span>Giày Thể Thao Nữ</span>
                </Link>
                <Link to={`/category/quan-dai-va-jean-nu`}>
                  <img src={quanNu} alt="quanNu" />
                  <span>Quần Nữ</span>
                </Link>
                <Link to={`/category/do-lot-nu`}>
                  <img src={doLotNu} alt="doLotNu" />
                  <span>Đồ Lót Nữ</span>
                </Link>
                <Link to={`/category/ao-chong-nang-ngan-ngua-tia-uv`}>
                  <img src={aoChongNang} alt="aoChongNang" />
                  <span>Áo Chống Nắng</span>
                </Link>
                <Link to={`/category/giay-the-thao-va-giay-chay-nam`}>
                  <img src={giayNam} alt="giayNam" />
                  <span>Giày Thể Thao Nam</span>
                </Link>
                <Link to={`/category/quan-dai-va-jean-nam`}>
                  <img src={quanNam} alt="quanNam" />
                  <span>Quần Nam</span>
                </Link>
                <Link to={`/category/do-lot-nam`}>
                  <img src={doLotNam} alt="doLotNam" />
                  <span>Đồ Lót Nam</span>
                </Link>
              </div>
            </div>
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
            <p>ÁO KHOÁC PHAO & LÔNG VŨ</p>
          </div>
          <div className="jacket-img">
            <img
              src={aoKhoacLongvu}
              alt="aoKhoacLongvu"
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
            <CategoryProductList slug="ao-khoac-phao-and-long-vu" />
          </div>

          <div className="code">
            <p>ÁO CHỐNG NẮNG NGĂN NGỪA TIA UV</p>
          </div>
          <div className="sunblock jacket">
            <img
              src={aoChongNangUV}
              alt="aoChongNangUV"
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
            <CategoryProductList slug="ao-chong-nang-ngan-ngua-tia-uv" />
          </div>

          <div className="code">
            <p>GIÀY THỂ THAO & GIÀY CHẠY BỘ</p>
          </div>
          <div className="sneaker">
            <img
              src={giayTheThao}
              alt="giayTheThao"
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
            <CategoryProductList slug="giay-the-thao-va-giay-chay-bo" />
          </div>

          <div className="code">
            <p>QUẦN DÀI & JEAN</p>
          </div>
          <div className="jean">
            <img
              src={jean}
              alt="jean"
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
            <CategoryProductList slug="quan-dai-and-jean" />
          </div>

          <div className="code">
            <p>NHÀ CỬA VÀ ĐỜI SỐNG</p>
          </div>
          <div className="line-home-page">
            <span></span>
          </div>
          <div className="home-page">
            <CategoryProductList slug="nha-cua-va-doi-song" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
