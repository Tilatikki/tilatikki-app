import React from 'react';
import { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import Header from '../components/Header';
import FilterForm from '../components/FilterForm';
import BookingResults from '../components/BookingResults';
import FloorPlan1 from '../components/floorplans/FloorPlan1';
// import FloorPlan2 from '../components/floorplans/FloorPlan2';
// import FloorPlan3 from '../components/floorplans/FloorPlan3';
// import FloorPlan4 from '../components/floorplans/FloorPlan4';

const ReservationPage = () => {
	const [filterValues, setFilterValues] = useState({});

	const handleFilterChange = (newFilterValues) => {
		setFilterValues(newFilterValues);
	}

  return (
    <>
    <Header/>
    <Container maxWidth="" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
      <Box sx={{ width: '30%', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
		<FilterForm onFilterChange={handleFilterChange} />
      </Box>

      {/* Middle Section - Data Display */}
      <Box sx={{ width: '30%', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <Typography variant="h6" gutterBottom>
          Data Display
        </Typography>
        <Box>
          {/* Placeholder for dynamic data */}
          <Typography variant="body1">
            No data to display yet.
          </Typography>

			<BookingResults filterValues={filterValues}/>

        </Box>
      </Box>
      <Box sx={{ width: '100%', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <Typography variant="h6" gutterBottom>
          Pohjapiirrustus
        </Typography>
        <Box>
          <FloorPlan1 />
        </Box>
      </Box>
    </Container>
    <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#94D0AD', marginRight: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)' }} />
          <Typography>Vapaa</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#F4BD89', marginRight: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)' }} />
          <Typography>Osittain vapaa</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#EA7272', marginRight: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)' }} />
          <Typography>Varattu</Typography>
        </Box>
      </Box>
    </>
  );
}

export default ReservationPage;