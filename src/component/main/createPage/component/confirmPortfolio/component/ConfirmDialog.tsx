import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Dialog, Button } from "@material-ui/core";
import Plot from "react-plotly.js";
import { DiscreteAmount, getDiscreteAmount } from "src/service/getDiscreteAmount";
import LoadingProgress from "src/component/common/widget/LoadingProgress";
import { BackTestData, getBackTest } from "src/service/getBackTest";
import StockTable from "./StockTable";
import { Holding } from "../../../CreatePage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { width: "800px", height: "500px" },
    card: {
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
      height: "500px",
      margin: "10px 100px 100px 100px",
      position: "relative",
    },
    button: {
      "& .MuiSvgIcon-root": {
        transition: "all 0.3s ease",
      },
      "&:hover": {
        background: "#B6EBFF",
        boxShadow: "0 16px 24px 0 rgba(172, 34, 34, 0.2)",
        cursor: "pointer",
        "& .MuiSvgIcon-root": {
          transform: "rotate(180deg)",
        },
      },
    },
    "@global": {
      "*::-webkit-scrollbar": {
        width: "0.4em",
      },
      "*::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "#2E2E2E",
        outline: "1px solid #E6E6FF",
        borderRadius: "20px",
      },
    },
    backTestDescription: {
      fontSize: "1.0rem",
    },
  })
);

interface ConfirmDialogProp {
  open: boolean;
  finalWeightList: {
    items: string[];
    values: number[];
  };
  onClose: () => void;
  holdings: Holding[];
}

export default function ConfirmDialog({ holdings, open, finalWeightList, onClose }: ConfirmDialogProp) {
  const classes = useStyles();
  const [discreteAmount, setDiscreteAmount] = useState<DiscreteAmount>();
  const [backTest, setBackTest] = useState<BackTestData>();
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    let codeList = finalWeightList.items.map((item) => {
      return holdings.find((target) => (target.name === item ? target.code : ""))?.code || "";
    });
    getDiscreteAmount({ code: codeList, weight: finalWeightList.values }).then((res) => {
      setDiscreteAmount(res);
    });

    getBackTest({ code: codeList, weight: finalWeightList.values }).then((res) => {
      setBackTest(res);
    });
  }, [finalWeightList, open, holdings]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth={"md"}>
      <div className={classes.root}>
        <h1 style={{ paddingLeft: "300px" }}>최종 투자 정보</h1>
        <div style={{ float: "left", width: "50%" }}>
          {backTest !== undefined ? (
            <div style={{ paddingLeft: "60px", paddingTop: "30px" }}>
              <div style={{ fontSize: "1.2rem", paddingLeft: "100px" }}> 예상 투자 실적</div>
              <Plot
                data={[
                  {
                    x: backTest.days,
                    y: backTest.values.map((item) => Math.round(item * 1000)),
                    mode: "lines",
                    line: { shape: "spline" },
                    name: "Lines",
                  },
                ]}
                layout={{
                  margin: { t: 0, b: 30, r: 50, l: 0 },
                  width: 300,
                  height: 200,
                  showlegend: false,
                  xaxis: {
                    tickformat: "%Y %b %d",
                  },
                  yaxis: {
                    side: "right",
                  },
                }}
                config={{ displayModeBar: false }}
              />
              <div className={classes.backTestDescription}>
                <div> 1000만원 투자시</div>
                <div>
                  예상 평가액 :
                  <span style={{ color: "black", fontWeight: "bold", fontSize: "1.2rem" }}>
                    {" "}
                    {Math.round(backTest.values[backTest.values.length - 1] * 1000)}
                  </span>
                  만원
                </div>
                <div>
                  예상 수익율 :
                  <span style={{ color: "black", fontWeight: "bold", fontSize: "1.2rem" }}>
                    {" "}
                    {Math.round(backTest.values[backTest.values.length - 1] * 100)}
                  </span>
                  %
                </div>
              </div>
            </div>
          ) : (
            <div>
              <LoadingProgress width={300} height={200} description={"ETF 분석중..."} />
            </div>
          )}
        </div>
        <div style={{ float: "left", width: "50%" }}>
          <div style={{ paddingLeft: "60px", paddingTop: "20px" }}>
            {discreteAmount !== undefined ? (
              <div>
                <div style={{ width: "100px", float: "left" }}> 총 투자 금액 :</div>
                <div> 1000만원</div>
                <div style={{ width: "100px", float: "left" }}> 남은 금액 :</div>
                <div> {Math.round(discreteAmount.remains / 10000)}만원</div>
                <br />
                <StockTable amounts={discreteAmount.amounts} />
              </div>
            ) : (
              <div>
                <LoadingProgress width={300} height={200} description={"ETF 분석중..."} />
              </div>
            )}
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
        >
          Buy
        </Button>
      </div>
    </Dialog>
  );
}
