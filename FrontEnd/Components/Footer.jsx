import "../css/style.css";
import "../css/grid.css";
import tiktok from "../img/tiktok-svgrepo-com.svg";
import facebook from "../img/facebook-svgrepo-com.svg";
import zalo from "../img/Icon_of_Zalo.svg.png";
import tokyolifeGif from "../img/tokyolife.gif";
import footerLogo from "../img/footer-logo.png";
import bocongthuong from "../img/bocongthuong.png"; // Thêm import cho hình ảnh bocongthuong nếu cần

const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="footer-header">
                <div className="row">
                  <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                    <div className="footer-header">
                      <span>VỀ TOKYOLIFE</span>
                      <ul>
                        <li>
                          <a href="#">Chúng tôi là ai</a>
                        </li>
                        <li>
                          <a href="#">Cam kết của chúng tôi</a>
                        </li>
                        <li>
                          <a href="#">Tin tuyển dụng</a>
                        </li>
                        <li>
                          <a href="#">Hệ thống cửa hàng</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                    <div className="footer-header">
                      <span>HỖ TRỢ KHÁCH HÀNG</span>
                      <ul>
                        <li>
                          <a href="#">Hướng dẫn đặt hàng</a>
                        </li>
                        <li>
                          <a href="#">Phương thức thanh toán</a>
                        </li>
                        <li>
                          <a href="#">Chính sách thành viên</a>
                        </li>
                        <li>
                          <a href="#">Chính sách tích - tiêu điểm</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                    <div className="footer-header">
                      <span>CHÍNH SÁCH</span>
                      <ul>
                        <li>
                          <a href="#">Chính sách vận chuyển</a>
                        </li>
                        <li>
                          <a href="#">Chính sách kiểm hàng</a>
                        </li>
                        <li>
                          <a href="#">Chính sách đổi trả</a>
                        </li>
                        <li>
                          <a href="#">Điều kiện & Điều khoản</a>
                        </li>
                        <li>
                          <a href="#">Chính sách bảo mật</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                    <div className="footer-header">
                      <span>LIÊN HỆ</span>
                      <ul>
                        <li>
                          <a href="#">Tư vấn mua online: 024 7308 2882 </a>
                        </li>
                        <li>
                          <a href="#">Khiếu nại và bảo hành: 024 7300 6999</a>
                        </li>
                        <li>
                          <a href="#">Email: cskh@tokyolife.vn</a>
                        </li>
                        <li>
                          <a href="#">Giờ làm việc: 8:30 - 22:00 hàng ngày</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-media">
                <div className="footer-sub">
                  <span>Kết nối với TOKYOLIFE </span>
                </div>
                <div className="footer-img">
                  <ul>
                    <li>
                      <a href="https://www.tiktok.com/@tokyolife.channel">
                        <img src={tiktok} alt="tiktok" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/TokyoLifeOnline">
                        <img src={facebook} alt="facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="https://zalo.me/4260866750527113904">
                        <img src={zalo} alt="zalo" />
                      </a>
                    </li>
                    <li>
                      <a href="https://tokyolife.vn/blog">
                        <img src={tokyolifeGif} alt="tokyolife" />
                      </a>
                    </li>
                    <li>
                      <span>
                        TokyoLife <br />
                        News
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="line"></div>
                <div className="company">
                  <div className="footer-sub">
                    <div className="footer-text">
                      <span>Công ty cổ phần STAAAR</span>
                      <ul>
                        <li>
                          <u>Địa chỉ</u>: Tầng 6, số 96 Thái Hà Phường Trung
                          Liệt, Quận Đống Đa, Thành phố Hà Nội, Việt Nam.
                        </li>
                        <li>
                          <u>Mã số thuế</u>: 0109749326, ngày cấp ĐKKD
                          29/04/2021.
                          <u> Nơi cấp</u>: Sở kế hoạch và đầu tư thành phố Hà
                          Nội.
                        </li>
                        <li>
                          <u>Điện thoại</u>: 024.7300.6999 Email:
                          cskh@tokyolife.vn
                        </li>
                      </ul>
                    </div>
                    <div className="footer-notification">
                      <img src={bocongthuong} alt="bocongthuong" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="footer-last">
        <img src={footerLogo} alt="footer-logo" />
        <span style={{ color: "#fff" }}>
          Copyright © 2014-2024 Tokyolife.vn All Rights Reserved.
        </span>
      </div>
    </div>
  );
};

export default Footer;
