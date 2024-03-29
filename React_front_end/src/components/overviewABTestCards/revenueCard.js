import {Form} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import { Line } from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
} from 'chart.js';
import SmallInformationCard from "../smallInformationCard";
import SmoothingLineCard from "../smoothingLineChar";

const RevenueCard = (props) => {
    const navigation = useNavigate();
    const [labels, Letlabels] = React.useState([]);
    const [datasets, setDatasets]  = React.useState([]);
    const [totalRevenue, setTotalRevenue]  = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [daySelector, setDaySelector] = React.useState("revenue0");
    const graphColors =  ['#84c98b', '#ED5C77', '#bc1ed7', '#0c1f3d', '#D4A418', '#00AAB5', '#D9730C', '#A7AABD','#328984']


    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function processData(begin, end){
        setLoading(true);
        setDatasets([]);
        setTotalRevenue([]);
        let allData = props.abTestData;

        Letlabels(allData.points.slice(begin, end + 1));

        let data = [];
        let totalRev = 0;
        allData.NotAlgDependent.slice(begin, end + 1).map((value, index) =>{
                    data.push(value.Revenue);
                    totalRev += value.Revenue;
                });

        setTotalRevenue(totalRevenue => [...totalRevenue,
                  ["total", totalRev.toFixed(2)]
                ]);

        setDatasets(datasets => [...datasets, {
                  label: "Revenue",
                  data: data,
                }]);

        let colorCounter = 0;
        for(let algorithm in allData.algorithms){
            let data = [];
            let avargeRevenuePerUserTemp = 0;
            allData.algorithms[algorithm].points.slice(begin, end + 1).map((value1, index) =>{
                data.push(value1[daySelector]);
                avargeRevenuePerUserTemp += value1[daySelector];
            });

            let colorGraph = graphColors[colorCounter];
            setDatasets(datasets => [...datasets, {
                  label: algorithm,
                  data: data,
                  backgroundColor: colorGraph,
                  borderColor: colorGraph + 80,
                }]);

            let avarge = (avargeRevenuePerUserTemp/props.abTestData.points.slice(begin, end + 1).length).toFixed(2);
            setTotalRevenue(totalRevenue => [...totalRevenue,
                  ["alg id " + algorithm, avarge]
                ]);
            colorCounter++;
            if(colorCounter >= graphColors.length){
                colorCounter = 0;
            }
        }

        setLoading(false);
    }

    useEffect(() => {
        processData(props.startDate,props.endDate);
    }, [props.abTestData, props.startDate, props.endDate, daySelector]);

    return (
        <LargeInformationCard
            settings={
            <div>
                {props.slider}
                <Form.Select aria-label="Default select example" onChange={(e)=>{setDaySelector(e.target.value)}}>
                  <option value="revenue0">Aanbevolen dezelfde dag</option>
                  <option value="revenue7">Aanbevolen binnen 7 dagen</option>
                  <option value="revenue30">Aanbevolen binnen 30 dagen</option>
                </Form.Select>
            </div>
            } loading={loading} title={"Revenue"} tooltip={"Revenue from day x to day y"}>
            <h5>
                {
                    totalRevenue.map((value, index) => {
                        {return <h5>Revenue for {value[0]} in interval:€ {value[1]}</h5>}
                    })
                }
            </h5>
            {labels.length < 500 &&
            <SmoothingLineCard height={"100%"} smoothingWindow={props.smoothingWindow} options={{
                backgroundColor: 'rgba(13,110,253,1)',
                borderColor: 'rgba(13,110,253,0.5)',
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 1
                            }
                        }
                    }
                  },
                }}
            labels={labels}
            data={datasets}
            />}
            {labels.length >= 500 &&
                <p style={{color: "red"}}>To many datapoints to show in a graph</p>}
        </LargeInformationCard>
        )
};

export default RevenueCard;
