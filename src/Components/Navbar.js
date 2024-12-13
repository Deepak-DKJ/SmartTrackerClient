import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DialogActions, Menu, TextField, Tooltip } from '@mui/material';
import { TrackerContext } from '../Context/TrackerContext';
import { Slide } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {
    Paper,
    Chip,
    Fab,
} from '@mui/material';

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
    "Entertainment",
    "Fuel/Travel",
    "Healthcare",
    "Investment",
    "Salary",
    "Others"
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

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const { page } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const { catList, setCatList, summaryItems, setValueNav, searchString, setSearchString, filters, setFilters, items, setItems, filteredItems, setFilteredItems, setSearchedItems, Label, chartItems } = React.useContext(TrackerContext);
    const [openFilterModal, setOpenFilterModal] = React.useState(false);
    const user = JSON.parse(localStorage.getItem("userdata"));
    // console.log(user)
    // Handlers for opening and closing the modal
    const handleOpenFilterModal = () => {
        setOpenFilterModal(true);
    };

    const handleCloseFilterModal = () => {
        setOpenFilterModal(false);
    };

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [newCategory, setNewCategory] = React.useState("");
    const handleAddCategory = () => {
        if (newCategory.trim() && !catList.includes(newCategory.trim())) {
            setCatList((categories) => [...categories, newCategory.trim()]);
            setNewCategory(""); // Reset input
        }
    };

    const handleSave = () => {
        localStorage.setItem("catList", JSON.stringify(catList));
        console.log("hello")
        setDialogOpen(false); // Close dialog after saving
    };

    const handleDelete = (categoryToDelete) => () => {
        setCatList((categories) => categories.filter((cat) => cat !== categoryToDelete));
    };

    const handleExportToExcel = () => {
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

        // Export File
        XLSX.writeFile(workbook, `Detailed Summary - ${Label}.xlsx`);
    };



    const handleExportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const currentDate = dayjs().format("DD MMM, YYYY");
        const title = `Expenses & Earnings Summary - ${Label}`;

        // Add Title
        doc.setFontSize(16);
        const textWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - textWidth) / 2, 10);

        // Add Summary Table
        const tableRows = [];
        const startY = 20;
        Object.entries(chartItems).forEach(([date, { expense, earning }]) => {
            tableRows.push([date, `Rs. ${expense}`, `Rs. ${earning}`]);
        });
        tableRows.push([]);
        tableRows.push(["Total", `Rs. ${summaryItems?.Expense}`, `Rs. ${summaryItems?.Earning}`]);

        doc.autoTable({
            head: [["Date", "Expenses", "Earnings"]],
            body: tableRows,
            startY,
            styles: { fontSize: 14, halign: "center" },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
        });

        // Add Report Generated Date Caption
        const caption = `Report generated on: ${currentDate}`;
        doc.setFontSize(13);
        doc.text(caption, pageWidth - doc.getTextWidth(caption) - 10, doc.internal.pageSize.getHeight() - 10);

        // Start Detailed Summary on New Page
        doc.addPage();
        doc.setFontSize(15);
        const detailedSummaryTitle = "Detailed Summary";
        const detailedTextWidth = doc.getTextWidth(detailedSummaryTitle);
        doc.text(detailedSummaryTitle, (pageWidth - detailedTextWidth) / 2, 10);

        // Iterate Through Items By Date
        let detailedStartY = 20;
        Object.entries(chartItems).forEach(([date]) => {
            const records = items[date]
            doc.setFontSize(14);
            doc.text(`Date: ${date}`, 10, detailedStartY); // Add Date as Header
            detailedStartY += 10;

            // Prepare Table Rows for Each Date
            const detailedRows = records.map((record) => [
                record.itemName,
                `Rs. ${record.totalPrice}`,
                record.quantity,
                record.category,
                record.type,
                record.desc === "" ? "NA" : record.desc,
            ]);

            // Add Table for Current Date
            doc.autoTable({
                head: [["Item Name", "Quantity", "Price", "Category", "Type", "Item Notes"]],
                body: detailedRows,
                startY: detailedStartY,
                styles: { fontSize: 12, halign: "center" },
                headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
                margin: { top: 10 },
            });

            // Update Y Position for Next Date
            detailedStartY = doc.lastAutoTable.finalY + 10;

            // Add Page If Space is Insufficient
            if (detailedStartY + 20 > doc.internal.pageSize.getHeight()) {
                doc.addPage();
                detailedStartY = 20;
            }
        });

        // Save PDF
        doc.save(`Summary - ${Label}.pdf`);
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

    const [daysNumber, setDaysNumber] = React.useState(filters.lastxdays);
    const [filterType, setFilterType] = React.useState(filters.type);
    const [catType, setCatType] = React.useState(filters.cat);

    const container = window !== undefined ? () => window().document.body : undefined;


    return (
        <>

            <Dialog
                open={openFilterModal}
                onClose={handleCloseFilterModal}
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

            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar component="nav">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Smart Tracker */}


                        {page === 'dashboard' && (
                            <>
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
                                <Typography sx={{ ml: 7 }} variant="h6" noWrap component="div">
                                    Smart Tracker
                                </Typography>
                                <Tooltip title="Configure Tags" arrow>
                                    <LocalOfferIcon
                                        onClick={() => { console.log(catList); setDialogOpen(true) }}
                                        sx={{ marginLeft: 'auto', fontSize: "27px", marginRight: "4px" }}
                                    />
                                </Tooltip>


                                <div>
                                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                                        <DialogTitle>Manage Categories</DialogTitle>
                                        {console.log(catList)}
                                        <DialogContent>
                                            <Paper
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap',
                                                    listStyle: 'none',
                                                    p: 0.5,
                                                    m: 0,
                                                }}
                                                component="ul"
                                            >
                                                {catList.map((category, index) => (
                                                    <ListItem key={index}>
                                                        <Chip
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
                                                        backgroundColor:"white",
                                                        color:"black"
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
                                                onClick={handleSave}
                                                variant="contained"
                                                sx={{ marginBottom: "20px", color:"black", backgroundColor:"white" }}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Dialog>
                                </div>
                            </>
                        )}

                        {page === 'reports' && (
                            <>
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
                                            backgroundColor: "cyan", // Gradient background
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
                                        horizontal: "right",
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
                                        onClick={handleExportToPDF}
                                    >
                                        <Typography sx={{ textAlign: "center" }}>
                                            Export to PDF
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
                                            Export to Excel
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