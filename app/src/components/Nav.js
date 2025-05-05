import React, { useState } from 'react';
import {
    useTheme,
    AppBar,
    Tabs,
    Tab
 } from '@mui/material';


import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import { Link } from 'react-router';


function LinkTab(props) {
  return (
    <Tab
      component={Link}
      {...props}
    />
  );
}

const Nav = ({ children }) => {
const theme = useTheme();

  // Use state to manage the current tab value
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 
  return (
    <>
      <AppBar 
        position='static'
        centered
        sx= {{
          backgroundColor: `${theme.palette.primary.light}96`,
          mx: 'auto',
          maxWidth: '29rem',
          padding: { 
            xs: '.1em',
            sm: '.185em',
            md: '.25em',
            lg: '.3em'
          },
          borderRadius: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '0.75rem',
            lg: '1.75rem',
            xl: '2.25rem'
          },
          mt: {xs:3, sm:4, md: 6, lg:6, xl:7},
          width: '50%'
          // margin: 'auto'
        }}
        > 
          <Tabs
            value={value}
            onChange={handleChange}
            textColor='inherit'
            indicatorColor= 'secondary'
            centered
            aria-label="navigation tabs"
            sx= {{
              '& .MuiTab-root':{
                padding: { 
                  xs: '.1em',
                  sm: '.185em',
                  md: '.25em',
                  lg: '.3em'
                },
                // paddingTop: theme.spacing(0),
                // paddingBottom: theme.spacing(0),
                typography: 'button',
                fontSize: {
                  xs: '0.7rem',
                  sm: '1rem',
                  md: '1.28rem',
                  lg: '1.3rem',
                  xl: '1.31rem',
                 },
                fontWeight: 'bold',
                letterSpacing: '.06em'
              }
            }}
            >
              <LinkTab
                label='Enter Book'
                to="/book"
                icon={<MenuBookIcon />}
                iconPosition="start"
                // icon2={<MenuBookIcon />}
                // icon2Position= "top"
                
                
                />
                <LinkTab
                label='Enter Vibe'
                to="/vibe"
                icon={<AutoAwesome />}
                iconPosition="start"
                />
            </Tabs>
        </AppBar>
        <main>
        {children}
      </main>
    </> 
  );
};


export default Nav;