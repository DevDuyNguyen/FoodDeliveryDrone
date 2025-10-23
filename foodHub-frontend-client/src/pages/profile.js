import React, { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PortraitImage from '../components/PortraitCard';
import DeliveryInfoCard from '../components/DeliveryInfoCard'
//material-ui
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  root: {
    flexGrow: 1,
    marginTop: 40,
  },
  paper: {
    padding: theme.spacing(2),
  },
  address: {
    "& > *": {
      margin: theme.spacing(4),
      width: "25ch",
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', /* Thay đổi để căn giữa các component */
    maxWidth: '80%', /* Giới hạn chiều rộng tối đa là 80% của parent */
    margin: '0 auto', /* Căn giữa container trong parent */
  },
  flexItem: {
    flex: 1, /* Giãn các phần tử con để lấp đầy container */
    maxWidth: '100%', /* Đảm bảo không vượt quá container */
  },
}));
export default function AddImgDelivery() {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <div className={classes.flexItem}>
          <PortraitImage />
      </div>
      <div className={classes.flexItem}>
        <DeliveryInfoCard />
      </div>
    </div>
  );
}