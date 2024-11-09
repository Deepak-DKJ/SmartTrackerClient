import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
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

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DialogActions, TextField } from '@mui/material';
import { TrackerContext } from '../Context/TrackerContext';
import { Slide } from "@mui/material";
import { useNavigate } from 'react-router-dom';
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
    const { page } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const { value, setValue, searchString, setSearchString, filters, setFilters, items, setItems, filteredItems, setFilteredItems, setSearchedItems } = React.useContext(TrackerContext);
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
        setValue(1)
        setItems({})
        setFilteredItems({})
        localStorage.removeItem('token');
        navigate("/smart-tracker")
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mt: 2, color: 'cyan' }}>
                Welcome!
            </Typography>
            <hr />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => navigate('/smart-tracker')} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => { setValue(1); navigate('/smart-tracker/create') }} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Create" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => { setValue(0); navigate('/smart-tracker/create') }} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={(e) => { setValue(2); navigate('/smart-tracker/create') }} sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Reports" />
                    </ListItemButton>
                </ListItem>

                <hr />

                <Typography variant='h6' sx={{ color:"cyan", fontWeight: 'bold' }}>
                               User Profile
                            </Typography>
            {/* <hr /> */}
                <ListItem sx={{ mt:2,  textAlign: 'center' }} >
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
                            <Typography component="span" sx={{ ml:1, color: 'white' }}>
                                {user?.created}
                            </Typography>
                        }
                    />
                </ListItem>


                <Button sx={{my:3}} variant='contained' color='primary' onClick={handleSignOut} >Sign out</Button>
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
                            <MenuItem value="Groceries">Groceries</MenuItem>
                            <MenuItem value="Food & Drinks">Food & Drinks</MenuItem>
                            <MenuItem value="Household">Household</MenuItem>
                            <MenuItem value="Shopping">Shopping</MenuItem>
                            <MenuItem value="Entertainment">Entertainment</MenuItem>
                            <MenuItem value="Travel & Fuel">Travel & Fuel</MenuItem>
                            <MenuItem value="Healthcare">Healthcare</MenuItem>
                            <MenuItem value="Investment">Investment</MenuItem>
                            <MenuItem value="Salary">Salary</MenuItem>
                            <MenuItem value="Savings">Savings</MenuItem>
                            <MenuItem value="Refund">Refund</MenuItem>
                            <MenuItem value="Profit">Profit</MenuItem>
                            <MenuItem value="Returns">Returns</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
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
                                {searchString === "" ? (<FilterAltIcon onClick={handleOpenFilterModal} sx={{ marginLeft: 'auto', fontSize: "27px" }} />) : ( <ClearIcon onClick={() => setSearchString("")} sx={{ marginLeft: 'auto', fontSize: "27px" }} />)}

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
                            </>
                        )}

                        {page === 'reports' && (

                            <Typography sx={{ ml: 7 }} variant="h6" noWrap component="div">
                                Smart Tracker
                            </Typography>

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