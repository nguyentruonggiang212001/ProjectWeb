import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
      <List>
        <ListItem
          sx={{
            backgroundColor: "#6A5ACD",
            color: "white",
            textAlign: "center",
            py: 2,
            position: "relative",
            top: "-10px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Trang Admin
          </Typography>
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/products/add"
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="➕ Thêm Sản Phẩm" />
        </ListItem>
        <ListItem component={Link} to="/admin/users" sx={{ cursor: "pointer" }}>
          <ListItemText primary="👥 Quản lý Người Dùng" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/orders"
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="📝 Quản Lý Đơn Hàng" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/categories"
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="📂 Quản Lý Danh Mục" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/variant"
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="🔀 Quản Lý Biến Thể" />
        </ListItem>
        <ListItem
          component={Link}
          to="/admin/attribute"
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="⚙️  Quản Lý Thuộc Tính" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
