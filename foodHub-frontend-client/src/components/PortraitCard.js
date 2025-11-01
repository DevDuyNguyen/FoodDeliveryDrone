import React from "react";
import { useSelector } from "react-redux"; // Thêm useSelector
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center", // Căn giữa nội dung bên trong theo ngang
    alignItems: "center",     // Căn giữa nội dung bên trong theo dọc
    maxWidth: 300 + theme.spacing(4), // Giới hạn width tối đa (300px media + padding), để margin auto hoạt động
    margin: "0 auto",         // Căn giữa ngang toàn bộ Card so với parent (margin left/right auto)
    height: "auto",           // Thay vì "100%", để Card tự điều chỉnh height theo nội dung (có thể giữ "100%" nếu cần full height)
    padding: theme.spacing(2),
  },
  media: {
    height: 400,
    width: 300,
    border: "2px solid #808080",
    borderRadius: theme.spacing(1),
    objectFit: "cover",
  },
}));

const PortraitImage = () => {
  const classes = useStyles();

  // Lấy PortraitPhotoUrl trực tiếp từ Redux state
  let { loading, PortraitPhotoUrl } = useSelector((state) => state.auth);
  PortraitPhotoUrl = PortraitPhotoUrl.replace(/\\/g, "/");
  PortraitPhotoUrl = process.env.REACT_APP_SERVER_URL + "/" + PortraitPhotoUrl;
  console.log(process.env.REACT_APP_SERVER_URL);

  return (
    <Card className={classes.root}>
      {loading ? (
        // Hiển thị loading khi đang tải
        <div
          style={{
            height: 400,
            width: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          Đang tải...
        </div>
      ) : (
        // Hiển thị ảnh khi đã tải xong
        <>
          <CardMedia
            className={classes.media}
            image={PortraitPhotoUrl || "https://via.placeholder.com/300x400"}
            title="Ảnh chân dung"
          />
        </>
      )}
    </Card>
  );
};

export default PortraitImage;
