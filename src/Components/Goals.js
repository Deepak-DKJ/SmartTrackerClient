import { Badge, Box, Button, Card, Divider, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Slider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TrackerContext } from '../Context/TrackerContext';
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { ArcElement } from "chart.js";
import WalletIcon from '@mui/icons-material/Wallet';
import { styled } from '@mui/material/styles';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import ModeStandbyRoundedIcon from '@mui/icons-material/ModeStandbyRounded';
import MuiInput from '@mui/material/Input';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InsightsIcon from '@mui/icons-material/Insights';
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { Gauge } from '@mui/x-charts/Gauge';
// const chartSettings = {
//     xAxis: [
//         {
//             label: 'Amount Spent (₹)',
//         },
//     ],
//     width: 325,
//     height: 300,
// };


dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const Input = styled(MuiInput)`
  width: 50px;
`;


const Goals = () => {
    const { currentRange, setCurrentRange, items, pieChartData, setPieChartData, barChartData, setBarChartData, fetch_data, goalSettings, setGoalSettings, showGoalInsights, setShowGoalInsights } = React.useContext(TrackerContext);
    const [goalPeriodString, setGoalPeriodString] = React.useState("Daily");
    const [goalType, setGoalType] = React.useState(goalSettings.goalType);
    const [goalDuration, setGoalDuration] = React.useState(goalSettings.goalDuration);
    const [goalTags, setGoalTags] = React.useState(goalSettings.goalTags);
    const [goalAmount, setGoalAmount] = React.useState(goalSettings.goalAmount);

    const handlePrevious = () => {
        const { goalDuration } = goalSettings; // 1 for daily, 7 for weekly, 30 for monthly
        setCurrentRange((prevRange) => {
            let newStartDate, newEndDate;
            if (goalDuration === 1) {
                // Daily
                newStartDate = prevRange.startDate.subtract(1, "day");
                newEndDate = prevRange.endDate.subtract(1, "day");
            } else if (goalDuration === 7) {
                // Weekly
                newStartDate = prevRange.startDate.subtract(1, "week");
                newEndDate = prevRange.endDate.subtract(1, "week");
            } else if (goalDuration === 30) {
                // Monthly
                newStartDate = prevRange.startDate.subtract(1, "month");
                newEndDate = prevRange.endDate.subtract(1, "month");
            }
            return { startDate: newStartDate, endDate: newEndDate };
        });
    };

    const handleNext = () => {
        const { goalDuration } = goalSettings; // 1 for daily, 7 for weekly, 30 for monthly
        setCurrentRange((prevRange) => {
            let newStartDate, newEndDate;
            if (goalDuration === 1) {
                // Daily
                newStartDate = prevRange.startDate.add(1, "day");
                newEndDate = prevRange.endDate.add(1, "day");
            } else if (goalDuration === 7) {
                // Weekly
                newStartDate = prevRange.startDate.add(1, "week");
                newEndDate = prevRange.endDate.add(1, "week");
            } else if (goalDuration === 30) {
                // Monthly
                newStartDate = prevRange.startDate.add(1, "month");
                newEndDate = prevRange.endDate.add(1, "month");
            }
            return { startDate: newStartDate, endDate: newEndDate };
        });
    };

    useEffect(() => {
        fetch_data();
    }, [])

    const handleDurationChange = (e) => {
        setGoalDuration(Number(e.target.value));
    };

    const handleSliderChange = (event, newValue) => {
        setGoalAmount(newValue);
    };
    const [showChart, setShowChart] = useState(0); // 0 for Pie Chart, 1 for Bar Chart

    const handleGoalInsightsChange = () => {
        localStorage.setItem(
            'goalSettingsLocal',
            JSON.stringify({
                goalType: goalType,
                goalDuration: goalDuration,
                goalAmount: goalAmount,
                goalTags: goalTags
            })
        );
        setGoalSettings({
            goalType: goalType,
            goalDuration: goalDuration,
            goalTags: goalTags,
            goalAmount: goalAmount
        });
        if (goalDuration === 1)
            setGoalPeriodString("Daily");
        else if (goalDuration === 7)
            setGoalPeriodString("Weekly");
        else if (goalDuration === 30)
            setGoalPeriodString("Monthly");
        const now = dayjs();
        let startDate, endDate;

        if (goalDuration === 1) {
            // Daily: today only
            startDate = now.startOf("day");
            endDate = now.endOf("day");
        } else if (goalDuration === 7) {
            // Weekly: Monday to Sunday of the current week
            if (now.weekday() === 0) {
                // Special case: Sunday (treat as the current week)
                startDate = now.subtract(6, "days").startOf("day"); // Go back to Monday
                endDate = now.endOf("day"); // Today (Sunday)
            } else {
                startDate = now.startOf("week").add(1, "day"); // Monday
                endDate = startDate.add(6, "days").endOf("day"); // Sunday
            }
        } else if (goalDuration === 30) {
            // Monthly: Start to end of the current month
            startDate = now.startOf("month");
            endDate = now.endOf("month");
        }

        // Update currentRange state
        setCurrentRange({ startDate, endDate });

        // Clear previous chart data
        setPieChartData(null);
        setBarChartData(null);

        // console.log({ startDate, endDate }); // Debugging to ensure the range is correct

        // Fetch new data based on updated range
        fetchChartsData({ startDate, endDate });

        // Show Goal Insights panel
        setShowGoalInsights(true);

    }

    const fetchChartsData = ({ startDate, endDate }) => {
        if (items === null)
            return;
        // console.log("START :", startDate);
        // console.log("END :", endDate);

        const filteredItems = Object.entries(items)
            .filter(([date]) => {
                const parsedDate = dayjs(date, "DD/MM/YYYY");
                return parsedDate.isSameOrAfter(startDate) && parsedDate.isSameOrBefore(endDate);
            })
            .map(([_, dailyItems]) => dailyItems)
            .flat();

        const totalSpent = filteredItems
            .filter((item) => item.type === goalSettings.goalType)
            .reduce((sum, item) => sum + item.totalPrice, 0);

        const categoryWiseData = filteredItems.reduce((acc, item) => {
            if (item.type === goalSettings.goalType) {
                acc[item.category] = (acc[item.category] || 0) + item.totalPrice;
            }
            return acc;
        }, {});

        const barChart = Object.keys(categoryWiseData).map((category) => ({
            category: category,
            totalSpent: categoryWiseData[category],
        }));

        setPieChartData({
            goalAmount: goalSettings.goalAmount,
            totalSpent: totalSpent,
        });
        setBarChartData(barChart);
        // console.log("Pie Chart Data : ", {
        //     goalAmount: goalSettings.goalAmount,
        //     totalSpent: totalSpent,
        // });
        // console.log("Bar Chart Data : ", barChart);
    };

    // useEffect(() => {
    //     if (items === null)
    //         return;
    //     fetchChartsData();
    // }, [items, goalSettings])

    useEffect(() => {
        if (items === null)
            return;
        // console.log(currentRange)
        // console.log("ITEMS Current Range : ", currentRange);
        // console.log("Items : ", items);
        fetchChartsData(currentRange);
    }, [currentRange, items]);

    const handleInputChange = (event) => {
        setGoalAmount(event.target.value === '' ? 50 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (goalAmount < 10) {
            setGoalAmount(10);
        } else if (goalAmount > 15000) {
            // setAmount(15000);
        }
    };

    useEffect(() => {
        if (goalDuration === '1')
            setGoalPeriodString("Daily");
        else if (goalDuration === '7')
            setGoalPeriodString("Weekly");
        else if (goalDuration === '30')
            setGoalPeriodString("Monthly");
        setGoalAmount(500 * goalDuration);
    }, [goalDuration])

    const data = {
        labels: (goalSettings?.goalType === "Expense") ? ["Spent", "Remaining"] : ["Earned", "Remaining"],
        datasets: [
            {
                data: [
                    pieChartData?.totalSpent,
                    (pieChartData?.goalAmount - pieChartData?.totalSpent < 0) ? 0 : pieChartData?.goalAmount - pieChartData?.totalSpent
                ],
                backgroundColor: (goalSettings?.goalType === "Expense") ? ["orange", "#00D26A"] : ["#00D26A", "orange"], // Spent (red) and Remaining (blue)
                hoverBackgroundColor: (goalSettings?.goalType === "Expense") ? ["orange", "#00D26A"] : ["#00D26A", "orange"],
                borderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        cutout: "85%", // Controls the inner radius
        plugins: {
            legend: {
                display: true, // Hides the legend
                position: "bottom",
                labels: {
                    color: "#B0B0B0",
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 1)',
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const label = context.label;
                        return `${label}: ₹${value}`;
                    },
                },
            },
        },
    };
    const getTimeLeft = (goalPeriodString, currentRange) => {
        const now = dayjs(); // Current date-time
        const startDate = dayjs(currentRange.startDate);
        const endDate = dayjs(currentRange.endDate);

        if (goalPeriodString === "Daily") {
            if (now.isSame(startDate, "day")) {
                const hoursLeft = 24 - now.hour(); // Remaining hours today
                return `${hoursLeft} hour(s) left`;
            }
            return "0 hour(s) left";
        }

        if (goalPeriodString === "Weekly") {
            if (now.isBetween(startDate, endDate, "day", "[]")) {
                const daysElapsed = now.diff(startDate, "days");
                const daysLeft = 7 - daysElapsed; // Monday to Sunday (7 days)
                return `${daysLeft} day(s) left`;
            }
            return "0 day(s) left";
        }

        if (goalPeriodString === "Monthly") {
            if (now.isBetween(startDate, endDate, "day", "[]")) {
                const totalDays = endDate.date(); // Last date of month
                const daysLeft = totalDays - now.date() + 1;
                return `${daysLeft} day(s) left`;
            }
            return "0 day(s) left";
        }

        return "N/A";
    };
    const plugins = [
        {
            beforeDraw: function (chart) {
                const { width, height, ctx } = chart;
                ctx.restore();

                const topText = (goalSettings?.goalType === "Expense") ? "Spent" : "Earned";
                const centerText = `₹${pieChartData?.totalSpent}`;
                const bottomText = getTimeLeft(goalPeriodString, currentRange);

                const centerX = width / 2;
                const centerY = height / 2.3;

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#B0B0B0";

                ctx.font = `${height / 20}px sans-serif`;
                ctx.fillText(topText, centerX, centerY - 38);

                ctx.fillStyle = "white";
                ctx.font = `bold ${height / 8}px sans-serif`;
                ctx.fillText(centerText, centerX, centerY);

                ctx.fillStyle = "#B0B0B0";
                ctx.font = `${height / 20}px sans-serif`;
                ctx.fillText(bottomText, centerX, centerY + 35);
                ctx.save();
            },
        },
    ];



    const data2 = {
        labels: barChartData?.map((item) => item.category), // Categories as labels
        datasets: [
            {
                label: (goalSettings?.goalType === "Expense") ? "Total Spent (₹)" : "Total Earned (₹)", // Label for the dataset
                data: barChartData?.map((item) => item.totalSpent), // Total spent values
                backgroundColor: [
                    "#FF6384", // Add colors for each category
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                ],
                hoverOffset: 4, // Offset for hover effect

                borderColor: "black", // Bar border color
                borderWidth: 2.5,
            },
        ],
    };

    // Chart configuration options
    const options2 = {
        responsive: true,
        indexAxis: "y", // Horizontal Bar Chart
        plugins: {
            legend: {
                display: false,
                position: "bottom", // Legend position
            },
            title: {
                display: false,
                text: "Category-wise Spending", // Chart title
            },
        },
        scales: {
            x: {
                beginAtZero: true, // Ensure bars start at zero
                ticks: {
                    color: '#B0B0B0',
                    callback: (value) => `₹${value}`, // Format x-axis labels with currency symbol
                },
                grid: {
                    display: true, // Enable x-axis grid
                    color: "rgba(255, 255, 255, 0.2)", // Light grid lines for dark mode
                    borderDash: [5, 5], // Dashed grid lines
                },
            },
            y: {
                ticks: {
                    color: '#B0B0B0',
                    maxRotation: 0, // Prevent label rotation
                    minRotation: 0,
                },
                grid: {
                    display: true, // Enable y-axis grid
                    color: "rgba(255, 255, 255, 0.2)", // Light grid lines for dark mode
                    borderDash: [5, 5], // Dashed grid lines
                },
            },
        },
    };


    const shouldHideNext = (goalPeriodString, currentRange) => {
        const now = dayjs(); // Current date-time
        const endDate = dayjs(currentRange.endDate); // End date of the selected period
        // console.log(endDate)
        if (goalPeriodString === "Daily") {
            return endDate.isSame(now, "day"); // Hide if the end date is in the future
        }

        if (goalPeriodString === "Weekly") {
            const thisWeekEnd = now.endOf("week"); // This week's Sunday
            return endDate.isAfter(thisWeekEnd, "day");
        }

        if (goalPeriodString === "Monthly") {
            return endDate.isSame(now, "month");
        }

        return false;
    };



    return (
        <>
            {!showGoalInsights ? (
                <Box sx={{ padding: 3.5 }}>
                    <Box
                        sx={{
                            marginTop: 0,
                            padding: 1.5,
                            borderRadius: 2,
                            bgcolor: "#2E2E2E",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            boxShadow: 0
                        }}
                    >
                        <TipsAndUpdatesIcon sx={{ color: "#FFD700" }} />
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Track & Achieve Your Goals
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: "#B8B8B8" }}>
                                Set a goal for your expenses or earnings and stay on top of your finances effortlessly.
                            </Typography>
                        </Box>
                    </Box>
                    <hr style={{marginTop:"25px"}}/>
                    <Typography sx={{ textAlign: 'center', marginTop: 2.5 }} variant="h6" gutterBottom>
                        <span><AdsClickIcon sx={{ marginBottom: "5px" }} /> Configure your Goals</span>
                    </Typography>

                    <Typography variant="subtitle2" sx={{ color: "#B8B8B8", marginTop: 3 }} gutterBottom>
                        Select Goal Type :
                    </Typography>
                    <RadioGroup row value={goalType} onChange={(e) => setGoalType(e.target.value)}>
                        <FormControlLabel value="Expense" control={<Radio />} label="Expenses" />
                        <FormControlLabel value="Earning" control={<Radio />} label="Earnings" />
                    </RadioGroup>
                    <Typography variant="subtitle2" sx={{ color: "#B8B8B8", marginTop: 3.5 }} gutterBottom>
                        Select Goal Period :
                    </Typography>
                    <RadioGroup row value={goalDuration} onChange={handleDurationChange}>
                        <FormControlLabel value={1} control={<Radio />} label="Daily" />
                        <FormControlLabel value={7} control={<Radio />} label="Weekly" />
                        <FormControlLabel value={30} control={<Radio />} label="Monthly" />
                    </RadioGroup>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: "#B8B8B8", marginTop: 3.5 }}>
                        {goalPeriodString} Goal Amount (₹) :
                    </Typography>
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid item xs>
                            <Slider
                                value={typeof goalAmount === 'number' ? goalAmount : 50}
                                onChange={handleSliderChange}
                                min={50}
                                max={2000 * goalDuration}
                                step={50}
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={goalAmount}
                                size="small"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 10,
                                    min: 50,
                                    max: 50000,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                        <Button
                            onClick={() => {
                                handleGoalInsightsChange();
                            }}

                            size='small'
                            color="inherit"
                            variant="contained"
                            sx={{ marginTop: "10px", color: "black", backgroundColor: "white" }}
                            startIcon={<InsightsIcon />}
                        >
                            Goal Insights
                        </Button>
                    </Box>



                </Box>
            ) : (
                <Box>
                    <Typography sx={{ textAlign: 'center', margin: "10px" }} variant="h6" gutterBottom>
                        <span><InsightsIcon sx={{ marginBottom: "5px" }} /> {goalPeriodString} Goal Insights</span>
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "0px" }}>
                        <Box sx={{ width: "94%", maxWidth: "600px" }}>
                            {(barChartData !== null) && (
                                 <Card sx={{ backgroundColor:"#323232" ,marginBottom: "0px", p: 1.5, borderRadius: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                 <Box display="flex" justifyContent="space-between" alignItems="center">
                                     {(goalSettings?.goalType === "Expense") ? (
                                         <Typography variant="subtitle1">
                                             {(pieChartData?.goalAmount >= pieChartData?.totalSpent) ? "Awesome! You have saved :" : "Oops! You are over budget by :"}
                                         </Typography>
                                     ) : (
                                         <Typography variant="subtitle1">
                                             {(pieChartData?.goalAmount > pieChartData?.totalSpent) ? "Keep going, Earnings remaining:" : "Awesome! You've earned an extra :"}
                                         </Typography>
                                     )}
 
                                     {(goalSettings?.goalType === "Expense") ? (
                                         <Box sx={{ p: 0.7, color: "black", backgroundColor: ((pieChartData?.goalAmount >= pieChartData?.totalSpent) ? "#00D26A" : "#FF673A"), borderRadius: 3, fontSize: "16px", fontWeight: "bold" }}>
                                             <CurrencyRupeeIcon sx={{ fontSize: "16px", marginBottom: "2px" }} />{(pieChartData?.goalAmount >= pieChartData?.totalSpent) ? (pieChartData?.goalAmount - pieChartData?.totalSpent) : (-pieChartData?.goalAmount + pieChartData?.totalSpent)}
                                         </Box>
                                     ) : (
                                         <Box sx={{ p: 0.7, color: "black", backgroundColor: ((pieChartData?.goalAmount > pieChartData?.totalSpent) ? "orange" : "#00D26A"), borderRadius: 3, fontSize: "16px", fontWeight: "bold" }}>
                                             <CurrencyRupeeIcon sx={{ fontSize: "16px", marginBottom: "2px" }} />{(pieChartData?.goalAmount >= pieChartData?.totalSpent) ? (pieChartData?.goalAmount - pieChartData?.totalSpent) : (-pieChartData?.goalAmount + pieChartData?.totalSpent)}
                                         </Box>
                                     )}
                                 </Box>
 
                                 <Divider />
 
                                 <Box display="flex" justifyContent="space-between">
                                     <Typography variant="subtitle2"><WalletIcon sx={{ marginBottom: "4px", fontSize: "18px" }} /> {(goalSettings?.goalType === "Expense") ? "Spent :" : "Earned :"} ₹{pieChartData?.totalSpent}</Typography>
                                     <Typography variant="subtitle2"><ModeStandbyRoundedIcon sx={{ marginBottom: "4px", fontSize: "18px" }} /> Goal : ₹{goalSettings.goalAmount}</Typography>
                                 </Box>
                             </Card>
                            )}
                           
                            <Box sx={{ bgcolor: 'background.paper', width: "100%", marginTop: "12px", borderRadius: 2 }}>

                                <Box p={1.8} sx={{ width: "100%", height: '59vh', paddingBottom: '0px', overflowY: 'auto' }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginLeft: "55px",
                                            marginRight: "55px",
                                            padding: "5px 8px",
                                            backgroundColor: "#323232", // Subtle dark background for contrast
                                            borderRadius: "12px", // Rounded corners
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Soft shadow for a card effect
                                        }}
                                    >
                                        <ArrowLeftRoundedIcon
                                            onClick={handlePrevious}
                                            sx={{
                                                fontSize: "25px",
                                                color: "white", // Cyan color for arrow icons
                                                cursor: "pointer",
                                                // transition: "transform 0.2s, color 0.2s",
                                                transform: "scale(1.3)", // Hover effect
                                            }}
                                        />
                                        <div
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                                color: "#E2E8F0", // Light color for text
                                                textAlign: "center",
                                            }}
                                        >
                                            {goalPeriodString === "Daily" && (
                                                <>{currentRange.startDate.format("DD MMM YYYY")}</>
                                            )}
                                            {goalPeriodString === "Weekly" && (
                                                <>
                                                    {currentRange.startDate.format("DD MMM")} -{" "}
                                                    {currentRange.endDate.format("DD MMM")}
                                                </>
                                            )}
                                            {goalPeriodString === "Monthly" && (
                                                <>{currentRange.startDate.format("MMM YYYY")}</>
                                            )}
                                        </div>
                                        <ArrowRightRoundedIcon
                                            onClick={handleNext}
                                            sx={{
                                                fontSize: "25px",
                                                color: "white", // Cyan color for arrow icons
                                                cursor: "pointer",
                                                // transition: "transform 0.2s, color 0.2s",
                                                transform: shouldHideNext(goalPeriodString, currentRange) ? "scale(0)" : "scale(1.3)",
                                            }}
                                        />
                                    </div>
                                    <>
                                        {(items !== null && Object.keys(items) !== undefined && Object.keys(items) !== null && Object.keys(items).length === 0) ? (
                                            <h6 style={{ textAlign: "center" }}>No Entries found!</h6>
                                        ) : (
                                            <>
                                                <div style={{ width: '100%', maxWidth: 400, height: '49.5vh', margin: 'auto' }}>


                                                    {showChart === 0 && (
                                                        <div style={{ width: '100%', maxWidth: 400, height: '40vh', margin: 'auto' }}>
                                                            {(barChartData !== null && barChartData.length > 0) ? (
                                                                <Box sx={{ padding: "25px" }} mb={2} mt={1}>
                                                                    <div>
                                                                        <Doughnut data={data} key={pieChartData.totalSpent} plugins={plugins} options={options} />

                                                                    </div>
                                                                  
                                                                </Box>
                                                            ) : (
                                                                <Box display="flex" alignItems="center" justifyContent={"center"} mb={2} mt={1}>
                                                                    <div style={{ position: "relative", width: "240px", height: "240px" }}>
                                                                        <h6 style={{ textAlign: "center", marginTop: "60%" }}>No data found!</h6>
                                                                    </div>
                                                                </Box>
                                                            )}

                                                        </div>
                                                    )}

                                                    {showChart === 1 && (
                                                        <div style={{ width: '100%', maxWidth: 400, height: '41.1vh', margin: 'auto' }}>
                                                            {(barChartData !== null && barChartData.length > 0) ? (
                                                                <>
                                                                    <Bar data={data2} options={options2} height={300} />
                                                                </>
                                                            ) : (
                                                                <Box display="flex" alignItems="center" justifyContent={"center"} mb={2} mt={0}>
                                                                    <div style={{ position: "relative", width: "240px", height: "240px" }}>
                                                                        <h6 style={{ textAlign: "center", marginTop: "63%" }}>No data found!</h6>
                                                                    </div>
                                                                </Box>
                                                            )}

                                                        </div>
                                                    )}
                                                    <hr style={{ margin: "16px" }} />

                                                    <Box display="flex" alignItems="center" justifyContent="center" >
                                                        {/* Line Chart Button */}
                                                        <Button
                                                            onClick={() => setShowChart(0)}
                                                            sx={{
                                                                backgroundColor: showChart === 0 ? "white" : "#323232", // Highlighted color for active button
                                                                color: showChart === 0 ? "black" : "#fff",
                                                                borderRadius: "20px",
                                                                fontWeight: "bold",
                                                                padding: "2px 16px",
                                                                margin: "0 6px"
                                                            }}
                                                            startIcon={<DonutLargeIcon />}
                                                        >
                                                            Overview
                                                        </Button>

                                                        {/* Pie Chart Button */}
                                                        <Button
                                                            onClick={() => setShowChart(1)}
                                                            sx={{
                                                                backgroundColor: showChart === 1 ? "white" : "#323232", // Highlighted color for active button
                                                                color: showChart === 1 ? "black" : "#fff",
                                                                borderRadius: "20px",
                                                                fontWeight: "bold",
                                                                padding: "2px 16px",
                                                                margin: "0 6px",
                                                            }}
                                                            startIcon={<BarChartIcon />}
                                                        >
                                                            Bar Chart
                                                        </Button>
                                                    </Box>

                                                </div>

                                            </>
                                        )}
                                    </>
                                </Box>

                            </Box>


                        </Box>
                    </Box>
                </Box>

            )}
        </>
    )
}

export default Goals
