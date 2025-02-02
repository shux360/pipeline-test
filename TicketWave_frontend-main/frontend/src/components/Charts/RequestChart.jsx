import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';

const RequestChart = () => {
  const chartRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => document.body.classList.contains('dark');
    setIsDarkMode(checkDarkMode());

    const handleModeChange = () => setIsDarkMode(checkDarkMode());

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Requests",
          data: [
            { x: "Type 1", y: 232 },
            { x: "Type 2", y: 113 },
            { x: "Type 3", y: 341 },
            { x: "Type 4", y: 224 },
            { x: "Type 5", y: 522 },
            { x: "Type 6", y: 411 },
            { x: "Type 7", y: 243 },
            { x: "Type 8", y: 232 },
            { x: "Type 9", y: 113 },
            { x: "Type 10", y: 341 },
            { x: "Type 11", y: 224 },
            { x: "Type 12", y: 522 },
            { x: "Type 13", y: 411 },
            { x: "Type 14", y: 243 },
          ],
        },
      ],
      chart: {
        type: "bar",
        height: "320px",
        width: "1050px",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
          borderRadiusApplication: "end",
          borderRadius: 8,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 1,
          },
        },
      },
      stroke: {
        show: true,
        width: 0,
        colors: ["transparent"],
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -14,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        floating: false,
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-[#EFEFEF]'
          }
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode ? '#EFEFEF' : '#615E83', 
            fontSize: '12px',
            fontFamily: "Inter, sans-serif",
          },
        },
        show: true,
      },
      fill: {
        type: isDarkMode ? 'gradient' : 'solid',
        gradient: isDarkMode ? {
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#B1F5F1"],
          inverseColors: false,
          stops: [0, 100],
        } : undefined,
        colors: isDarkMode ? ["#194AFE"] : ["#0097A9"],
        opacity: 1,
      },
    };

    if (chartRef.current && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [isDarkMode]);

  return (
    <div id="column-chart" ref={chartRef}></div>
  );
};

export default RequestChart;
