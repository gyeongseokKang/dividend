/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LoadingProgress from "src/component/main/common/wiget/LoadingProgress";
import { FrontierData, getEfficientFrontier, RRSW } from "src/service/getEfficientFrontier";
import CurrentSelectedPF from "./component/CurrentSelectedPF";
import PortfolioTabLayout from "./component/PortfolioTabLayout";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { ETFData, getSimilarETF } from "src/service/getSimilarETF";

interface stockInfo {
  name: string;
  code: string;
  weight: number;
}

interface SelectedPortfolioProp {
  stockList: stockInfo[];
  selectedPF: RRSW;
  onChangeSelectedPF: (PF: RRSW) => void;
}

const SelectedPortfolio = ({ stockList, selectedPF, onChangeSelectedPF }: SelectedPortfolioProp) => {
  const [frontierData, setFrontierData] = useState<FrontierData>();
  const [similarETFData, setSimilarETFData] = useState<ETFData[]>();
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number>();

  const handleSelectedPF = (portfolio: RRSW) => {
    setLoading(true);
    onChangeSelectedPF(portfolio);
    timer.current = window.setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  useEffect(() => {
    getEfficientFrontier(stockList).then((res) => {
      setFrontierData(res);
    });
    getSimilarETF(stockList).then((res) => {
      setSimilarETFData(res);
    });
  }, [stockList]);

  return (
    <>
      <div className="SelectedPortfolio" style={{ display: "flex" }}>
        <div style={{ paddingRight: "20px" }}>
          <PortfolioTabLayout handleSelectedPF={handleSelectedPF} stockList={stockList} frontierData={frontierData} similarETFData={similarETFData} />
        </div>
        <DoubleArrowIcon style={{ fontSize: "5rem", margin: "auto", marginLeft: "10px", marginRight: "10px" }} />
        <div>
          <Card style={{ textAlign: "center", marginTop: "73px" }}>
            {!loading ? (
              <CurrentSelectedPF selectedPF={selectedPF} />
            ) : (
              <Card
                style={{
                  textAlign: "center",
                  backgroundColor: "#F5F5F5",
                  width: "280px",
                  height: "450px",
                }}
              >
                <LoadingProgress height={350} description={"포트폴리오 적용중..."} />
              </Card>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default SelectedPortfolio;
