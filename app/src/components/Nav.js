import React from 'react';
import {
    useTheme,
    AppBar,
    Tabs,
    Tab,
 } from '@mui/material';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link, useLocation } from 'react-router';


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
  const location = useLocation();

  let currentTabValue = 0;
  if (location.pathname === '/vibe') {
      currentTabValue = 1;
  }

  const getBorderRadius = (index) => ({
    ...(index === 0 ? {
      borderTopLeftRadius: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1.75rem',
        xl: '2.25rem'
      },
      borderBottomLeftRadius: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1.75rem',
        xl: '2.25rem'
      },
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    } : 
    // Second tab (index 1) gets right-side rounded corners only
    {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1.75rem',
        xl: '2.25rem'
      },
      borderBottomRightRadius: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1.75rem',
        xl: '2.25rem'
      }
    })
  });
 
  return (
    <>
      <AppBar 
        position='static'
        sx= {{
          backgroundColor: 'rgba(192, 183, 172, .85)',
          mx: 'auto', //center the AppBar
          maxWidth: '29rem',
          borderRadius: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '0.75rem',
            lg: '1.75rem',
            xl: '2.25rem'
          },
          mt: {xs:3, sm:4, md: 6, lg:6, xl:7}, //top margin
          width: '50%',
          padding: 0,
          overflow: 'hidden'
          
        }}
        > 
          <Tabs
            value={currentTabValue}
            textColor='inherit'
            centered
            variant= 'fullWidth'
            aria-label="navigation tabs"
            sx= {{
              width: '100%',
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTabs-flexContainer': {
                width: '100%',
              },

              '& .MuiTab-root': {
                width: '50%',
                maxWidth: 'none', 
                typography: 'button',
                fontSize: {
                  xs: '0.7rem',
                  sm: '1rem',
                  md: '1.28rem',
                  lg: '1.3rem',
                  xl: '1.31rem',
                },
                fontWeight: 'bold',
                letterSpacing: '.06em',
                margin: 0,
                padding: '0.5rem 0.5rem 0.5rem 0.5rem' ,
                minHeight: '3rem',
                // borderRadius: 0, // Removes border radius from individual tabs
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1,
                border: '2px solid transparent',
                
                //icon styling for unselected tab
                '& .MuiSvgIcon-root': {
                color: 'rgba(65, 65, 65, 0.99)', // Slightly dimmed white
                opacity: 0.9,
                transition: 'all 0.3s ease',
                fontSize: '1.5rem', // Slightly larger icons
                marginRight: '0.5rem',
              },
            },

               //(left)tab
            '& .MuiTab-root:first-of-type': {
              ...getBorderRadius(0),
              // (left)hover effect
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}`,
                ...getBorderRadius(0)
              },

               //(left)clicking state
              '&:active': {
                backgroundColor: theme.palette.secondary.light,
              },

              //(left)selctive state tab
               '&.Mui-selected': {
                border: `2px solid ${theme.palette.primary.dark}`, 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                ...getBorderRadius(0),
                boxShadow: `0 0 8px ${theme.palette.primary.dark}40`,

                // Book icon gets green when selected
                '& .MuiSvgIcon-root': {
                  color: `${theme.palette.secondary.main}`,
                  opacity: 1,
                  transform: 'scale(1.1)', // Slightly larger when selected
                },
                
                // (left)Selected hover state
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}`,
                  ...getBorderRadius(0)
                },
                
                // (left)Selected active state
                '&:active': {
                  backgroundColor: theme.palette.primary.main,
                }
              }
            },

            //(right)tab
            '& .MuiTab-root:last-of-type': {
              ...getBorderRadius(1),
              // (right)hover effect
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}`,
                ...getBorderRadius(1)
              },

               //(right)clicking state
              '&:active': {
                backgroundColor: theme.palette.secondary.light,
              },

              //(right)selctive state tab
               '&.Mui-selected': {
                border: `2px solid ${theme.palette.primary.dark}`,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                ...getBorderRadius(1),
                boxShadow: `0 0 8px ${theme.palette.primary.dark}40`,

                 // Vibe icon amber/gold when selected
                '& .MuiSvgIcon-root': {
                  color: 'rgb(51, 215, 188)', 
                  opacity: 1,
                  transform: 'scale(1.1)', // Slightly larger when selected
                },
                
                // (right)Selected hover state
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  ...getBorderRadius(1)
                },
                
                // (right)Selected active state
                '&:active': {
                  backgroundColor: theme.palette.primary.light,
                }
              }
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
                icon={<AutoAwesomeIcon />}
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