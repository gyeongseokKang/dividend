import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import PortfolioInfoCardWithBtn from "src/component/common/widget/PortfolioInfoCardWithBtn";
import { ETFData } from "src/service/getSimilarETF";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import React from "react";
import { Paper } from "@material-ui/core";
import "./tapSimilarETF.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "490px",
    },
    slider: {
      overflow: "hidden",
      height: "100%",
    },
    content: {
      display: "flex",
      "& > *": {
        margin: "auto",
        fontSize: "1rem",
      },
    },
  })
);

interface RRSW {
  returns: number;
  risk: number;
  sharpe: number;
  weights: {
    items: string[];
    values: number[];
  };
}

interface TapSimilarETFProp {
  holdings: { name: string; code: string }[];
  similarETFData: ETFData[];
  handleSelectedPF: (portfolio: RRSW) => void;
}

const TapSimilarETF = ({ handleSelectedPF, holdings, similarETFData }: TapSimilarETFProp) => {
  const classes = useStyles();
  let similarETF: ETFData[] = similarETFData;
  return (
    <>
      <div className={classes.root}>
        <AwesomeSlider className={classes.slider} bullets={true}>
          {similarETF.map((item: ETFData, index: number) => {
            let info = {
              returns: item.returns,
              risk: item.risk,
              sharpe: 1,
              weights: {
                items: item.info.map((item) => {
                  return item.name;
                }),
                values: item.info.map((item) => {
                  return Number((Number(item.percent) / 100).toFixed(2));
                }),
              },
            };
            return (
              <div className={classes.content} key={item.name} style={{ backgroundColor: "white" }}>
                <PortfolioInfoCardWithBtn title={item.name} info={info} onPfClick={handleSelectedPF} />
                <Paper elevation={0} style={{ paddingLeft: "20px", marginTop: "120px" }}>
                  <div style={{ fontSize: "1.5rem" }}>ETF 정보</div>
                  <div>ETF명 : {item.name}</div>
                  <div>종목코드 : {item.code}</div>
                  <div>유사율 : {item.match_weight.toFixed(2)}%</div>
                  <div>순위 : {index + 1}</div>
                </Paper>
              </div>
            );
          })}
        </AwesomeSlider>
      </div>
    </>
  );
};

export default TapSimilarETF;
