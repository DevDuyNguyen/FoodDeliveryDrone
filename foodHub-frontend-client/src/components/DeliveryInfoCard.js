import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: "auto", // Giữ để card center ngang so với parent
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(2),
    overflow: "hidden",
  },
  media: {
    height: 250,
    width: "100%",
    borderBottom: "2px solid #808080", // Giữ border bottom cho mỗi hình
    objectFit: "cover",
  },
  mediaContainer: {
    padding: theme.spacing(2, 2, 2, 0), // Padding top/right/bottom/left=0 để không padding trái
  },
  content: {
    padding: theme.spacing(2, 2, 2, 0), // Padding top/right/bottom/left=0 để content sát trái
    textAlign: "left", // Giữ căn trái cho text
  },
  title: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  infoItem: {
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
}));

const DeliveryInfoCard = () => {
  const classes = useStyles();

  // Lấy dữ liệu từ Redux state (giả định từ state.auth)
  let { licenseBackPhotoUrl, licenseFrontPhotoUrl, firstName, lastName, email, phone,CCCD } = useSelector((state) => state.auth);
  licenseBackPhotoUrl = licenseBackPhotoUrl.replace(/\\/g, "/");
  licenseBackPhotoUrl = process.env.REACT_APP_SERVER_URL + "/" + licenseBackPhotoUrl;
  licenseFrontPhotoUrl = licenseFrontPhotoUrl.replace(/\\/g, "/");
  licenseFrontPhotoUrl = process.env.REACT_APP_SERVER_URL + "/" + licenseFrontPhotoUrl;

  // Tạo tên đầy đủ
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

  return (
    <Card className={classes.root}>
      <Grid container direction="column" spacing={0} className={classes.mediaContainer}>
        {/* Ảnh 1: LicenseFrontPhotoUrl (đổi comment cho đúng) */}
        <Grid item xs={12}>
          <CardMedia
            className={classes.media}
            image={licenseFrontPhotoUrl || "https://via.placeholder.com/300x250"}
            title="Ảnh giấy phép mặt trước"
          />
        </Grid>
        {/* Ảnh 2: LicenseBackPhotoUrl */}
        <Grid item xs={12}>
          <CardMedia
            className={classes.media}
            image={licenseBackPhotoUrl || "https://via.placeholder.com/300x250"}
            title="Ảnh giấy phép mặt sau"
          />
        </Grid>
      </Grid>
      <CardContent className={classes.content}>
        <Typography variant="h6" className={classes.title}>
          {fullName || "Tên không có"}
        </Typography>
        <Typography variant="body2" className={classes.infoItem}>
          Email: {email || "Chưa cập nhật"}
        </Typography>
        <Typography variant="body2" className={classes.infoItem}>
          Số điện thoại: {phone || "Chưa cập nhật"}
        </Typography>
        <Typography variant="body2" className={classes.infoItem}>
          Số căn cước công dân: {CCCD || "Chưa cập nhật"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DeliveryInfoCard;