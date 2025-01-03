import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import HomeIcon from '@mui/icons-material/Home';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import MovieIcon from '@mui/icons-material/Movie';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';

import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InputBase from '@mui/material/InputBase';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SavingsIcon from '@mui/icons-material/Savings';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DialogActions, Menu, Snackbar, TextField, Tooltip, ListItemIcon, TableContainer, Table, TableBody, TableRow, TableCell, CircularProgress } from '@mui/material';
import { TrackerContext } from '../Context/TrackerContext';
import { Slide } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoIcon from '@mui/icons-material/Info';
import {
    Paper,
    Chip,
    Fab,
} from '@mui/material';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});



const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '90px', // Fixed width for the search bar
    marginLeft: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        width: '300px', // Slightly wider on larger screens
    },
}));

const hardcodedCategories = [
    "Groceries",
    "Food/Drinks",
    "Household",
    "Shopping",
    "Fuel/Travel",
    "Healthcare",
    "Entertainment",
    "Salary",
    "Savings",
    "Others"
];

const categoryIcons = {
    "Groceries": <ShoppingCartIcon />,          // Representing shopping for groceries
    "Food/Drinks": <RestaurantMenuIcon />,    // Representing dining and beverages
    "Household": <HomeIcon />,                  // Representing household items
    "Shopping": <LocalMallIcon />,              // Representing general shopping
    "Entertainment": <MovieIcon />,             // Representing movies and fun activities
    "Fuel/Travel": <LocalGasStationIcon />,   // Representing fuel or travel expenses
    "Healthcare": <MedicalServicesIcon />,      // Representing medical and healthcare
    "Savings": <SavingsIcon />,       // Representing financial investments
    "Salary": <AttachMoneyIcon />,              // Representing salary or earnings
    "Others": <CategoryIcon />,                 // Generic icon for miscellaneous items
};

const sampleInputs = [
    "Flat rent paid 18.5k",
    "Laundry 370 rupees",
    "Amazonpay cashback 750",
    "25 kilo aata ek hazar rupya",
    "Netflix subscription 499 rs",
    "Petrol 430 rs 4.1 litres",
    "Antibiotic 5 tablets 132 rs",
    "Salary credited 1.1 lakhs",
];
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 0.7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(0.9, 0.9, 0.9, 0),
        paddingLeft: `calc(1em + ${theme.spacing(1.3)})`, // Adjusting for the icon
    },
}));

function DrawerAppBar(props) {
    const { window } = props;
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleClickUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const theme = useTheme();

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setShowTags(
            typeof value === "string" ? value.split(",") : value // Handle single or multiple selections
        );
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleChange1 = () => {
        if (expEarnings && expExpenses) {
            setExpEarnings(false);
            setExpExpenses(false);
        }
        else {
            setExpEarnings(true);
            setExpExpenses(true);
        }
    };
    const { catList, setCatList, summaryItems, setValueNav, searchString, setSearchString, filters, setFilters, filtersExport, setFiltersExport, items, setItems, filteredItems, setFilteredItems, setSearchedItems, Label, chartItems, setInputMsg, baseUrl } = React.useContext(TrackerContext);

    const [expExpenses, setExpExpenses] = React.useState(filtersExport.showExpenses);
    const [expEarnings, setExpEarnings] = React.useState(filtersExport.showEarnings);
    const [expReport, setExpReport] = React.useState(filtersExport.detailedReport);
    const [showTags, setShowTags] = React.useState(filtersExport.tags);

    const handleChange2 = (event) => {
        if (expExpenses === false)
            setExpExpenses(true)
        else
            setExpExpenses(false)
    };

    const handleChange3 = (event) => {
        if (expEarnings === false)
            setExpEarnings(true)
        else
            setExpEarnings(false)
    };

    const handleChange4 = () => {
        if (expReport === true)
            setExpReport(false)
        else setExpReport(true)
    };

    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'row', ml: 3 }}>
            <FormControlLabel
                label="Expenses"
                control={<Checkbox size="small" checked={expExpenses} onChange={handleChange2} />}
            />
            <FormControlLabel
                label="Earnings"
                control={<Checkbox size="small" checked={expEarnings} onChange={handleChange3} />}
            />
        </Box>
    );

    const { page } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [openFilterModal, setOpenFilterModal] = React.useState(false);
    const [openExportModal, setOpenExportModal] = React.useState(false);
    const user = JSON.parse(localStorage.getItem("userdata"));
    // console.log(user)
    // Handlers for opening and closing the modal
    const handleOpenFilterModal = () => {
        setOpenFilterModal(true);
    };

    const handleCloseFilterModal = () => {
        setOpenFilterModal(false);
    };

    const handleOpenExportModal = () => {
        handleCloseUserMenu()
        setOpenExportModal(true);
    };

    const handleCloseExportModal = () => {
        setOpenExportModal(false);
    };

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [showInfo, setShowInfo] = React.useState(() => {
        const storedValue = localStorage.getItem('showInfo');
        return storedValue !== null ? JSON.parse(storedValue) : true;
    });
    const [savedList, setSavedList] = React.useState(catList);
    const [newCategory, setNewCategory] = React.useState("");
    const handleAddCategory = () => {
        if (newCategory.trim() && !catList.includes(newCategory.trim())) {
            setCatList((categories) => [...categories, newCategory.trim()]);
            setNewCategory(""); // Reset input
        }
    };
    const [alert, setAlert] = React.useState({
        vis: false,
        msg: "",
    });

    const handleUnderstand = () => {
        setShowInfo(false);
        localStorage.setItem('showInfo', false)
    }
    const handleTry = (input) => {
        handleUnderstand(); // Close dialog after trying the input
        setInputMsg(input);
    };
    const handleSave = async () => {
        let ls = []
        if (newCategory.trim() && !catList.includes(newCategory.trim())) {
            const updatedCatList = [...catList, newCategory.trim()]; // Create updated list
            ls = updatedCatList
            setCatList(updatedCatList); // Update state
            // localStorage.setItem("catList", JSON.stringify(updatedCatList)); // Store updated list
        }
        else ls = catList;

        setNewCategory(""); // Reset input
        setDialogOpen(false); // Close dialog after saving
        setAlert({
            "vis": true,
            "msg": "Categories modified successfully !"
        })

        if (ls.length === 0)
            return;

        try {
            const data = {
                "cats": ls
            };
            let authToken = localStorage.getItem("token");
            // console.log(authToken);
            const response = await axios.put(`${baseUrl}/items/updateCategory`, data, {
                headers: {
                    Token: authToken, // Set the Authorization header with Bearer token
                    withCredentials: true,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            setSavedList(ls)

        } catch (err) {
            console.log("Error2: ", err.response);
        }
    };

    const handleDelete = (categoryToDelete) => () => {
        setCatList((categories) => categories.filter((cat) => cat !== categoryToDelete));
    };

    const [loadingExcel, setLoadingExcel] = React.useState(false);

    const handleExportToExcel = () => {
        setLoadingExcel(true)
        const headerTitle = `Expenses & Earnings Summary - ${Label}`;

        // Rows for the summary section
        const rows = [
            [headerTitle],                // Header Title
            [],                           // Empty Row for spacing
            ["Date", "Expenses", "Earnings"], // Column Headers
        ];

        // Add Summary Table
        Object.entries(chartItems).forEach(([date, { expense, earning }]) => {
            rows.push([date, expense, earning]);
        });

        rows.push([]);
        rows.push(["Total", summaryItems?.Expense, summaryItems?.Earning]);
        rows.push([]);

        // Add Report Generated Date
        const currentDate = dayjs().format("DD MMM, YYYY");
        rows.push([`Report generated on: ${currentDate}`]);
        rows.push([]); // Empty row for spacing before detailed report

        // Add Detailed Report Header
        rows.push(["Detailed Report"]);
        rows.push([]);
        rows.push(["Date", "Item Name", "Price", "Quantity", "Category", "Type", "Item Notes"]); // Common Header

        // Add Date-Wise Detailed Summary
        // console.log(items)
        Object.entries(chartItems).forEach(([date]) => {
            rows.push([date]); // Date in the first column
            const records = items[date];
            records.forEach((record) => {
                rows.push([
                    "", // Empty cell to align with the first column for date
                    record.itemName,
                    record.totalPrice,
                    record.quantity,
                    record.category,
                    record.type,
                    record.desc === "" ? "NA" : record.desc,
                ]);
            });

            rows.push([]); // Empty row after each date's records
        });

        // Create Worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(rows);

        // Merge Header Title (A1:C1)
        worksheet["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: 5, r: 0 } }];

        // Adjust Column Widths
        worksheet["!cols"] = [
            { wch: 18 }, // Date
            { wch: 20 }, // Item Name
            { wch: 15 }, // NOtes
            { wch: 15 }, // Quantity
            { wch: 15 }, // Price
            { wch: 20 }, // Category
            { wch: 15 }, // Type
        ];

        // Create Workbook and Append Worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SmartTracker Detailed Report");
        setLoadingExcel(false)
        // Export File
        XLSX.writeFile(workbook, `Detailed Summary - ${Label}.xlsx`);
    };
    const [loading, setLoading] = React.useState(false);

    const handleExportToPDF = (IsCustom) => {
        // console.log(expExpenses)
        // console.log(expEarnings)
        // console.log(expReport)
        // console.log(showTags)
        setLoading(true);
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const currentDate = dayjs().format("DD MMM, YYYY");
        const title = `Smart Tracker Report - ${Label}`;

        const logoPath = "/smarttracker3.png"; // Path to the logo

        const loadLogo = (callback) => {
            const img = new Image();
            img.src = logoPath;
            img.onload = () => {
                callback(img);
            };
        };

        loadLogo((img) => {
            // Add Title at the Top
            let flag = false
            if ((IsCustom === false || (expEarnings || expExpenses)) && (Object.entries(chartItems)).length > 0) {
                flag = true;
                doc.setFontSize(16);

                const textWidth = doc.getTextWidth(title);
                const titleY = 20; // Fixed position at the top
                doc.text(title, (pageWidth - textWidth) / 2, titleY);

                // Dynamically create table headers and rows
                const tableHeaders = ["Date"];
                if (IsCustom === false || expExpenses) tableHeaders.push("Expenses");
                if (IsCustom === false || expEarnings) tableHeaders.push("Earnings");

                const tableRows = [];
                const startY = titleY + 10; // Start further below the title

                Object.entries(chartItems).forEach(([date, { expense, earning }]) => {
                    const row = [date];
                    if (IsCustom === false || expExpenses) row.push(`Rs. ${expense}`);
                    if (IsCustom === false || expEarnings) row.push(`Rs. ${earning}`);
                    tableRows.push(row);
                });

                // Add totals row if applicable
                const totalRow = ["Total"];
                if (IsCustom === false || expExpenses) totalRow.push(`Rs. ${summaryItems?.Expense}`);
                if (IsCustom === false || expEarnings) totalRow.push(`Rs. ${summaryItems?.Earning}`);
                tableRows.push([]);
                tableRows.push(totalRow);

                // Generate the table
                doc.autoTable({
                    head: [tableHeaders],
                    body: tableRows,
                    startY,
                    styles: { fontSize: 14, halign: "center" },
                    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
                });

                // Add Report Generated Date Caption
                const caption = `Report generated on: ${currentDate}`;
                doc.setFontSize(13);
                doc.text(caption, pageWidth - doc.getTextWidth(caption) - 10, pageHeight - 10);

                // Add Watermark as Background
                const logoWidth = pageWidth * 0.6; // Adjust logo size (50% of page width)
                const logoHeight = (img.height / img.width) * logoWidth; // Maintain aspect ratio
                const x = (pageWidth - logoWidth) / 2; // Center horizontally
                const y = (pageHeight - logoHeight) / 2; // Center vertically

                doc.setGState(new doc.GState({ opacity: 0.18 })); // Light opacity
                doc.addImage(img, "PNG", x, y, logoWidth, logoHeight, undefined, "SLOW"); // Set blend mode
                doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity
            }

            // Re-add watermark for the new page
            // doc.setGState(new doc.GState({ opacity: 0.08 }));
            // doc.addImage(img, "PNG", x, y, logoWidth, logoHeight, undefined, "SLOW");
            // doc.setGState(new doc.GState({ opacity: 1 }));
            if ((IsCustom === false || expReport) && (Object.entries(chartItems)).length > 0) {
                if (IsCustom === false || flag)
                    doc.addPage();
                doc.setFontSize(15);
                const detailedSummaryTitle = "Detailed Summary";
                const detailedTextWidth = doc.getTextWidth(detailedSummaryTitle);
                doc.text(detailedSummaryTitle, (pageWidth - detailedTextWidth) / 2, 10);

                // Iterate Through Items By Date
                let detailedStartY = 30; // Start content slightly lower
                Object.entries(chartItems).forEach(([date]) => {
                    const records = items[date];

                    // Prepare Table Rows for Each Date
                    const detailedRows = records
                        .filter((record) => showTags.length === 0 || showTags.includes(record.category)) // Filter based on showTags or include all if empty
                        .map((record) => [
                            record.itemName,
                            `Rs. ${record.totalPrice}`,
                            record.quantity,
                            record.category,
                            record.type,
                            record.desc === "" ? "NA" : record.desc,
                        ]);
                    // console.log(detailedRows)
                    if(detailedRows.length === 0)
                        return;
                    doc.setFontSize(14);
                    doc.text(`Date: ${date}`, 10, detailedStartY); // Add Date as Header
                    detailedStartY += 10;

                    // Add Table for Current Date
                    doc.autoTable({
                        head: [["Item Name", "Price", "Quantity", "Category", "Type", "Item Notes"]],
                        body: detailedRows,
                        startY: detailedStartY,
                        styles: { fontSize: 12, halign: "center" },
                        headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
                        margin: { top: 10 },
                    });
                    // doc.setGState(new doc.GState({ opacity: 0.08 }));
                    // doc.addImage(img, "PNG", x, y, logoWidth, logoHeight, undefined, "SLOW");
                    // doc.setGState(new doc.GState({ opacity: 1 }));

                    // Update Y Position for Next Date
                    detailedStartY = doc.lastAutoTable.finalY + 10;

                    // Add Page If Space is Insufficient
                    if (detailedStartY + 20 > pageHeight) {
                        doc.addPage();

                        // Re-add watermark for new page
                        // doc.setGState(new doc.GState({ opacity: 0.08 }));
                        // doc.addImage(img, "PNG", x, y, logoWidth, logoHeight, undefined, "SLOW");
                        // doc.setGState(new doc.GState({ opacity: 1 }));

                        detailedStartY = 30; // Start new content lower
                    }
                });
            }

            if ((!expReport && !expEarnings && !expExpenses) || (Object.entries(chartItems)).length === 0) {
                doc.setFontSize(15);
                const detailedSummaryTitle = "No data available to display";
                const detailedTextWidth = doc.getTextWidth(detailedSummaryTitle);
                doc.text(detailedSummaryTitle, (pageWidth - detailedTextWidth) / 2, 10);
            }

            // Save PDF
            setLoading(false);
            doc.save(`Summary - ${Label}.pdf`);
        });

        if(IsCustom === true)
         handleCloseExportModal();
        
    };

    const getStringDate = (date) => {
        // const date = new Date();
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const yyyy = date.getFullYear();

        const formattedDate = `${dd}/${mm}/${yyyy}`;
        return formattedDate

    }


    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    const navigate = useNavigate()
    const handleSignOut = () => {
        setValueNav(1)
        setItems({})
        setFilteredItems({})
        localStorage.removeItem('token');
        localStorage.removeItem('periodDuration');
        localStorage.removeItem('navTab')
        // localStorage.removeItem('userData');
        localStorage.removeItem('userdata');
        localStorage.removeItem('showInfo');
        localStorage.removeItem('filterLocal');
        navigate("/smart-tracker")
    }

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mt: 2, color: 'cyan' }}>
                Welcome!
            </Typography>
            <hr />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => { setSearchString(""); navigate('/smart-tracker') }} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => { setSearchString(""); setValueNav(1); navigate('/smart-tracker/create') }} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Create" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => { setSearchString(""); setValueNav(0); navigate('/smart-tracker/create') }} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => { setSearchString(""); setValueNav(2); navigate('/smart-tracker/create') }} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Reports" />
                    </ListItemButton>
                </ListItem>

                <hr />

                <Typography variant='h6' sx={{ color: "cyan", fontWeight: 'bold' }}>
                    User Profile
                </Typography>
                {/* <hr /> */}
                <ListItem sx={{ mt: 2, textAlign: 'center' }} >
                    <ListItemText
                        primary={
                            <Typography component="span" sx={{ color: '#B0B0B0', fontWeight: 'bold' }}>
                                Name:
                            </Typography>
                        }
                        secondary={
                            <Typography component="span" sx={{ ml: 1, color: 'white' }}>
                                {user?.name}
                            </Typography>
                        }
                    />
                </ListItem>

                <ListItem sx={{ textAlign: 'center' }} >
                    <ListItemText
                        primary={
                            <Typography component="span" sx={{ color: '#B0B0B0', fontWeight: 'bold' }}>
                                Email:
                            </Typography>
                        }
                        secondary={
                            <Typography component="span" sx={{ ml: 1, color: 'white' }}>
                                {user?.email}
                            </Typography>
                        }
                    />
                </ListItem>

                <ListItem sx={{ textAlign: 'center' }} >
                    <ListItemText
                        primary={
                            <Typography component="span" sx={{ color: '#B0B0B0', fontWeight: 'bold' }}>
                                Created On:
                            </Typography>
                        }
                        secondary={
                            <Typography component="span" sx={{ ml: 1, color: 'white' }}>
                                {user?.created}
                            </Typography>
                        }
                    />
                </ListItem>


                <Button sx={{ my: 3 }} variant='contained' color='primary' onClick={handleSignOut} >Sign out</Button>
                <hr />
            </List>
        </Box>
    );
    React.useEffect(() => {
        if (savedList.length === 0)
            setSavedList(catList)
    }, [catList])
    const [daysNumber, setDaysNumber] = React.useState(filters.lastxdays);
    const [filterType, setFilterType] = React.useState(filters.type);
    const [catType, setCatType] = React.useState(filters.cat);

    const container = window !== undefined ? () => window().document.body : undefined;
    const handleTagClose = () => {
        setDialogOpen(false)
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar component="nav">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: page === "reports" ? 0 : 2, display: { sm: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Smart Tracker */}


                        {page === 'dashboard' && (
                            <>

                                <Dialog
                                    open={openFilterModal}
                                    onClose={(event, reason) => {
                                        if (reason === "backdropClick") {
                                            // Do nothing to prevent dialog close
                                            return;
                                        }
                                        handleCloseFilterModal(); // Handle explicit close actions
                                    }}
                                    maxWidth="xs"
                                    keepMounted
                                    TransitionComponent={Transition}

                                    BackdropProps={{
                                        style: {
                                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        },
                                    }}
                                >
                                    <DialogTitle>Filter Options</DialogTitle>
                                    <DialogContent>
                                        <Box>
                                            {/* Last X Days Selection */}
                                            <TextField
                                                select
                                                fullWidth
                                                label="Select Duration"
                                                value={daysNumber}
                                                onChange={(e) => setDaysNumber(parseInt(e.target.value, 10))}
                                                style={{ marginBottom: "20px", marginTop: "20px" }}
                                            >
                                                <MenuItem value={7}>One week</MenuItem>
                                                <MenuItem value={30}>One month </MenuItem>
                                                <MenuItem value={180}>Six months </MenuItem>
                                                <MenuItem value={365}>One year </MenuItem>
                                            </TextField>

                                            {/* Type Selection */}
                                            <TextField
                                                select
                                                fullWidth
                                                label="Select Type"
                                                value={filterType}
                                                onChange={(e) => setFilterType(e.target.value)}
                                                style={{ marginBottom: "15px" }}
                                            >
                                                <MenuItem value="All">Any</MenuItem>
                                                <MenuItem value="Expense">Expense</MenuItem>
                                                <MenuItem value="Earning">Earning</MenuItem>
                                            </TextField>

                                            <TextField
                                                select
                                                fullWidth
                                                label="Select Tag"
                                                value={catType}
                                                onChange={(e) => setCatType(e.target.value)}
                                                style={{ marginBottom: "15px" }}

                                            >
                                                <MenuItem value="Any">Any</MenuItem>
                                                {catList.map((catgry) => (
                                                    <MenuItem key={catgry} value={catgry}>{catgry}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Box>
                                    </DialogContent>
                                    <Box
                                        sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                                    >
                                        <Button
                                            onClick={() => {
                                                handleCloseFilterModal();
                                            }}
                                            size='small'
                                            variant="contained"
                                            sx={{ marginBottom: "20px", marginRight: "12px", backgroundColor: 'lightgrey', color: 'black' }}
                                        >
                                            close
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setFilters({
                                                    lastxdays: daysNumber,
                                                    type: filterType,
                                                    cat: catType
                                                });

                                                localStorage.setItem('filterLocal', JSON.stringify({
                                                    lastxdays: daysNumber,
                                                    type: filterType,
                                                    cat: catType
                                                }))
                                                // Handle filter application here
                                                //   getLastxDaysData(filters.lastxdays)
                                                handleCloseFilterModal();
                                            }}
                                            color="primary"
                                            variant="contained"
                                            sx={{ marginBottom: "20px" }}
                                        >
                                            Apply Filters
                                        </Button>
                                    </Box>
                                </Dialog>
                                <Typography variant="h6" noWrap component="div">
                                    Smart Tracker
                                </Typography>

                                {searchString === "" ? (
                                    <Tooltip title="Filters" arrow>
                                        <FilterAltIcon onClick={handleOpenFilterModal} sx={{ marginLeft: 'auto', fontSize: "27px" }} />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Clear" arrow>
                                        <ClearIcon onClick={() => setSearchString("")} sx={{ marginLeft: 'auto', fontSize: "27px" }} />
                                    </Tooltip>
                                )
                                }

                                <Search sx={{ marginLeft: 'auto' }}>
                                    <SearchIconWrapper>
                                        <SearchIcon fontSize='small' />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search"
                                        value={searchString}
                                        onChange={(e) => setSearchString(e.target.value)}
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </Search>
                            </>
                        )}

                        {page === 'create' && (
                            <>

                                <Typography sx={{ ml: 4 }} variant="h6" noWrap component="div">
                                    Smart Tracker
                                </Typography>
                                <Tooltip title="Configure Tags" arrow>
                                    <LocalOfferIcon
                                        onClick={() => {
                                            setCatList(savedList)
                                            // setCatList(JSON.parse(localStorage.getItem("catList")) || hardcodedCategories)
                                            setDialogOpen(true)
                                        }}
                                        sx={{ marginLeft: 'auto', fontSize: "24px" }}
                                    />
                                </Tooltip>
                                <Tooltip title="How to Use" arrow>
                                    <InfoIcon
                                        onClick={() => setShowInfo(true)}
                                        sx={{ marginLeft: '18px', fontSize: "27px", marginRight: "6px" }}
                                    />
                                </Tooltip>

                                <Snackbar
                                    autoHideDuration={3000}
                                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                                    open={alert.vis}
                                    onClose={() => {
                                        setAlert({
                                            vis: false,
                                            msg: "",
                                        });
                                    }}
                                    sx={{
                                        position: "fixed",
                                        top: "8.2vh"
                                    }}
                                    TransitionComponent={Slide}
                                    message={alert.msg}

                                    ContentProps={{
                                        style: {
                                            backgroundColor: "#333",  // Dark background
                                            color: "#fff",            // Light text color
                                        },
                                    }}
                                />


                                <Box>
                                    <Dialog open={dialogOpen}
                                        onClose={(event, reason) => {
                                            if (reason === "backdropClick") {
                                                // Do nothing to prevent dialog close
                                                return;
                                            }
                                            handleTagClose(); // Handle explicit close actions
                                        }}
                                        TransitionComponent={Transition}
                                        fullWidth maxWidth="sm" BackdropProps={{
                                            sx: {
                                                backgroundColor: "rgba(0, 0, 0, 0.9)", // Semi-transparent black background
                                            },
                                        }}>
                                        <DialogTitle>Manage Categories</DialogTitle>
                                        <DialogContent>
                                            <Paper
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap',
                                                    listStyle: 'none',
                                                    p: 0,
                                                    paddingTop: "8px",
                                                    paddingBottom: "8px",
                                                    m: 0,
                                                }}
                                                component="ul"
                                            >
                                                {catList !== undefined && catList.map((category, index) => (
                                                    <ListItem key={index}>
                                                        <Chip
                                                            variant="contained"
                                                            icon={categoryIcons[category]}
                                                            label={category}
                                                            onDelete={!hardcodedCategories.includes(category) ? handleDelete(category) : undefined}
                                                            color={hardcodedCategories.includes(category) ? "default" : "primary"} // Optional to differentiate
                                                        />

                                                    </ListItem>
                                                ))}
                                            </Paper>

                                            {/* Add New Category */}
                                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                                <TextField
                                                    label="New Category"
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                    fullWidth
                                                />
                                                <Fab
                                                    size="small" // Ensures proper dimensions
                                                    onClick={handleAddCategory}
                                                    sx={{
                                                        marginLeft: 1.5,
                                                        width: 50, // Ensures a perfect circular size
                                                        height: 45,
                                                        padding: "10px",
                                                        backgroundColor: "white",
                                                        color: "black"
                                                    }}
                                                >
                                                    <AddIcon />
                                                </Fab>

                                            </Box>
                                        </DialogContent>

                                        <Box
                                            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                                        >
                                            <Button
                                                onClick={() => {
                                                    handleTagClose();
                                                }}
                                                size='small'
                                                variant="contained"
                                                sx={{ marginBottom: "20px", marginRight: "12px", backgroundColor: 'lightgrey', color: 'black' }}
                                            >
                                                close
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                variant="contained"
                                                sx={{ marginBottom: "20px", color: "black", backgroundColor: "white" }}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Dialog>
                                </Box>

                                <Box>
                                    <Dialog
                                        open={showInfo}
                                        fullWidth
                                        TransitionComponent={Transition}
                                        maxWidth="sm"
                                        onClose={(event, reason) => {
                                            if (reason === "backdropClick") {
                                                // Do nothing to prevent dialog close
                                                return;
                                            }
                                            handleUnderstand(); // Handle explicit close actions
                                        }}
                                        BackdropProps={{
                                            sx: {
                                                backgroundColor: "rgba(0, 0, 0, 0.9)", // Semi-transparent black background
                                            },
                                        }}
                                    >
                                        <DialogContent sx={{ paddingBottom: "0px" }}>
                                            {/* Step-by-step instructions */}
                                            <Box sx={{ marginBottom: 2 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        textAlign: "center",
                                                        marginBottom: 1,
                                                        fontWeight: "bold",
                                                        color: "white",
                                                    }}
                                                >
                                                    How to add an entry?
                                                </Typography>
                                                <TableContainer>
                                                    <Table>
                                                        <TableBody>
                                                            {/* Step 1 */}
                                                            <TableRow>
                                                                <TableCell
                                                                    sx={{
                                                                        width: "75px", // Consistent width for the step column
                                                                    }}
                                                                >
                                                                    Step 1
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        color: "lightgrey",
                                                                        padding: "0px"
                                                                    }}
                                                                >
                                                                    Type in the textbox or Tap mic to speak
                                                                </TableCell>
                                                            </TableRow>

                                                            {/* Step 2 */}
                                                            <TableRow>
                                                                <TableCell>
                                                                    Step 2
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        color: "lightgrey",
                                                                        padding: "0px"
                                                                    }}
                                                                >
                                                                    Hit on CREATE
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>

                                            </Box>



                                        </DialogContent>
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    marginBottom: 1,
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Sample Inputs:
                                            </Typography>
                                            {/* Scrollable Box Container */}
                                            <Box
                                                sx={{
                                                    maxHeight: "260px", // Limit height of the scrollable container
                                                    overflowY: "auto", // Enable vertical scrolling
                                                    padding: 1, // Padding to avoid content touching dialog borders
                                                    backgroundColor: "#434343", // Background color for the container
                                                    borderRadius: 2, // Rounded corners
                                                    margin: "5px",
                                                    // boxShadow: "0 4px 10px rgba(0,0,0,0.3)", // Add subtle shadow for better UI
                                                }}
                                            >
                                                {sampleInputs.map((input, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: 1.3, // Padding inside each card
                                                            borderRadius: 2, // Rounded corners for cards
                                                            backgroundColor: "#2c2c2c", // Card background color
                                                            marginBottom: 1, // Spacing between cards
                                                            "&:last-child": {
                                                                marginBottom: 0, // Remove margin for the last card
                                                            },
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "lightgrey",
                                                                wordBreak: "break-word", // Prevent overflow of long text
                                                                flex: 1, // Take up available space
                                                            }}
                                                        >
                                                            {input}
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            // color=''
                                                            onClick={() => handleTry(input)}
                                                            sx={{
                                                                // color: "black",
                                                                // borderColor: "red",
                                                                // backgroundColor:'white',
                                                                textTransform: "none",
                                                                fontWeight: "bold",
                                                                padding: "2px 8px",
                                                                fontSize: "0.7rem",
                                                                marginLeft: 0.3, // Space between text and button
                                                            }}
                                                        >
                                                            Try
                                                        </Button>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>


                                        {/* Bottom button */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                width: '100%',
                                                padding: 2,
                                            }}
                                        >
                                            <Button
                                                onClick={() => handleUnderstand()}
                                                variant="contained"
                                                // size='small'
                                                sx={{
                                                    color: 'black',
                                                    backgroundColor: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Got it
                                            </Button>
                                        </Box>
                                    </Dialog>
                                </Box>
                            </>
                        )}

                        {page === 'reports' && (
                            <>
                                <Dialog
                                    open={openExportModal}
                                    onClose={(event, reason) => {
                                        if (reason === "backdropClick") {
                                            // Do nothing to prevent dialog close
                                            return;
                                        }
                                        handleCloseExportModal(); // Handle explicit close actions
                                    }}
                                    maxWidth="xs"
                                    keepMounted
                                    TransitionComponent={Transition}

                                    BackdropProps={{
                                        style: {
                                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        },
                                    }}
                                >
                                    <DialogTitle>Export Custom Report</DialogTitle>
                                    <DialogContent>
                                        <Box>
                                            <Typography variant="body2"
                                                sx={{
                                                    color: "lightgrey",
                                                    marginBottom: "10px",
                                                    wordBreak: "break-word", // Prevent overflow of long text
                                                    flex: 1, // Take up available space
                                                }}
                                            >Choose desired fields for the report:</Typography>
                                            <div>
                                                <FormControlLabel
                                                    label="Show Summary"
                                                    control={
                                                        <Checkbox
                                                            checked={expEarnings && expExpenses}
                                                            indeterminate={expEarnings !== expExpenses}
                                                            onChange={handleChange1}
                                                        />
                                                    }
                                                />
                                                {children}

                                                <FormControlLabel sx={{ marginBottom: "20px" }} control={<Checkbox checked={expReport} onChange={handleChange4} />} label="Show Detailed Report" />
                                            </div>

                                            {/* <TextField
                                                select
                                                fullWidth
                                                label="Select Tag"
                                                value={catType}
                                                onChange={(e) => setCatType(e.target.value)}
                                                style={{ marginBottom: "15px" }}

                                            >
                                                <MenuItem value="Any">Any</MenuItem>
                                                {catList.map((catgry) => (
                                                    <MenuItem key={catgry} value={catgry}>{catgry}</MenuItem>
                                                ))}
                                            </TextField> */}

                                            <FormControl fullWidth style={{ marginBottom: "10px" }}>
                                                <InputLabel id="multi-select-checkbox-label">Display Selective Tag(s)</InputLabel>
                                                <Select
                                                    labelId="multi-select-checkbox-label"
                                                    id="multi-select-checkbox"
                                                    multiple
                                                    value={showTags}
                                                    onChange={handleChange}
                                                    input={<OutlinedInput label="Display Selective Tag(s)" />}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                            {selected.map((value) => (
                                                                <Chip key={value} label={value} />
                                                            ))}
                                                        </Box>
                                                    )}
                                                    MenuProps={MenuProps}
                                                >
                                                    {catList.map((catgry) => (
                                                        <MenuItem key={catgry} value={catgry}>
                                                            <Checkbox checked={showTags.includes(catgry)} />
                                                            <ListItemText primary={catgry} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </DialogContent>
                                    <Box
                                        sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                                    >
                                        <Button
                                            onClick={() => {
                                                handleCloseExportModal();
                                            }}
                                            size='small'
                                            variant="contained"
                                            sx={{ marginBottom: "20px", marginRight: "12px", backgroundColor: 'lightgrey', color: 'black' }}
                                        >
                                            close
                                        </Button>
                                        <LoadingButton
            onClick={() => {
                localStorage.setItem(
                    'filterExport',
                    JSON.stringify({
                        showExpenses: true, // Example values
                        showEarnings: true,
                        detailedReport: true,
                        tags: [],
                    })
                );
                handleExportToPDF(true);
            }}
            endIcon={<PictureAsPdfIcon />}
            loading={loading}
            loadingPosition="end" // Places spinner at the end
            color="primary"
            variant="contained"
            sx={{ marginBottom: "20px" }}
        >
            {loading ? "Generating..." : "Download"}
        </LoadingButton>
                                    </Box>
                                </Dialog>
                                <Typography variant="h6" noWrap component="div" sx={{ marginLeft: "auto" }}>
                                    Smart Tracker
                                </Typography>
                                <Tooltip title="Download Report" arrow>
                                    <DownloadIcon
                                        onClick={handleClickUserMenu}
                                        sx={{
                                            marginLeft: "auto",
                                            fontSize: "28px",
                                            marginRight: "8px",
                                            backgroundColor: "cyan",
                                            borderRadius: "50%", // Circular shape for the icon
                                            padding: "3px", // Add padding for a larger clickable area
                                            color: "black", // White icon color
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Add subtle shadow
                                            transition: "all 0.3s ease", // Smooth transition for hover effects
                                            "&:hover": {
                                                transform: "scale(1.1)", // Slightly increase the size on hover
                                            },
                                            "&:active": {
                                                transform: "scale(0.80)", // Slightly reduce size on click
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Shadow reduction on click
                                            },
                                        }}
                                    />
                                </Tooltip>


                                <Menu
                                    sx={{
                                        mt: "45px",
                                        "& .MuiPaper-root": {
                                            backgroundColor: "#333", // Dark background for the menu
                                            color: "white", // White text color
                                        },
                                    }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >

                                    <MenuItem
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#444", // Darker background on hover
                                            },
                                            color: "white", // White text color
                                        }}
                                        onClick={() => handleExportToPDF(false)}
                                    >
                                        <Typography sx={{ textAlign: "center" }}>
                                            {loading === true ? (
                                                <span className='text-center'>Downloading <CircularProgress color="inherit" size={16} /></span>
                                            ) : "Export to PDF"}
                                        </Typography>
                                    </MenuItem>


                                    <MenuItem
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#444", // Darker background on hover
                                            },
                                            color: "white", // White text color
                                        }}
                                        onClick={handleExportToExcel}
                                    >
                                        <Typography sx={{ textAlign: "center" }}>
                                            {loadingExcel === true ? (
                                                <span className='text-center'>Downloading <CircularProgress color="inherit" size={16} /></span>
                                            ) : "Export to Excel"}
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#444", // Darker background on hover
                                            },
                                            color: "white", // White text color
                                        }}
                                        onClick={handleOpenExportModal}
                                    >
                                        <Typography sx={{ textAlign: "center" }}>
                                            Custom Export
                                        </Typography>
                                    </MenuItem>
                                </Menu>

                            </>

                        )}

                    </Toolbar>

                </AppBar>
                <nav>
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', minWidth: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </nav>
                <Box component="main">
                    <Toolbar />
                </Box>
            </Box>
        </>
    );
}

export default DrawerAppBar;