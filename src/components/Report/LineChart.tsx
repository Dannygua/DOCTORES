import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ chartData }:any) {
  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Perdida de peso(en kg) en los últimos meses"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}

export default LineChart;