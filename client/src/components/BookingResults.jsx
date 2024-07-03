import React, { useState, useEffect } from 'react';
import ReservationCard from './ReservationCard'; // Make sure this path is correct
import { Box, Button } from '@mui/material';
import { fetchUserDataByEmail } from '../api/userApi';
import { getCookie } from '../utils/Cookies';


const BookingResults = ({ classrooms }) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [filterMode, setFilterMode] = useState('free');
	const [user, setUser] = useState({})


	useEffect(() => {
		const email = getCookie('UserEmail');
		if (email) {
			fetchUserDataByEmail(email)
				.then(userData => {
					setUser(userData)
				})
				.catch(error => {
					console.error('Error fetching user data:', error);
				});
		}
	}, []);

	const itemsPerPage = 5;

	console.log('classrooms: ', classrooms);

	const handleNextPage = () => {
		if (currentPage < Math.ceil(Object.keys(classrooms).length / itemsPerPage) - 1) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleFilterChange = (mode) => {
		setFilterMode(mode);
		setCurrentPage(0);
	};

	// Filter the classrooms

	const filteredClassrooms = Object.entries(classrooms).filter(([key, value]) => {
		const userReservations = value.reservations.filter((reservation) => {
			return reservation.user._id === user._id
		})
		if (filterMode === 'reservations') {
			return userReservations.length > 0
		} else if (filterMode === 'free') {
			return true
		}
		return false;
	});


	const paginatedClassrooms = filteredClassrooms.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);


	//TODO: show reservations as free even if the room has reservations


	return (
		<Box>
			<h3>Huoneet</h3>
			{Object.keys(classrooms).length > 0 && (
				<>
					<Box display="flex" justifyContent="center" mb={2}>
						<Button onClick={() => handleFilterChange('reservations')} variant={filterMode === 'reservations' ? 'contained' : 'outlined'}>
							Varaukset
						</Button>
						<Button onClick={() => handleFilterChange('free')} variant={filterMode === 'free' ? 'contained' : 'outlined'}>
							Vapaat
						</Button>
					</Box>
					<Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
						{paginatedClassrooms.map(([key, value]) => {
							// Filter the reservations from the classrooms
							const filteredReservations = value.reservations.filter(reservation => reservation.user._id === user._id);
							return (
								<React.Fragment key={key}>
									{filteredReservations.length > 0 && filterMode === 'reservations' ? (
										filteredReservations.map((reservation) => (
											<ReservationCard
												key={reservation._id}
												roomId={reservation.room}
												roomNumber={value.number}
												purpose={reservation.purpose}
												status="Varattu"
												capacity={value.capacity}
												reservationDate={reservation.reservationDate}
												reservationEndDate={reservation.reservationEndDate}
												startTime={reservation.startTime}
												endTime={reservation.endTime}
												groupsize={reservation.groupsize}
											/>
										))
									) : (
										<ReservationCard
											key={key}
											roomId={value._id}
											roomNumber={value.number}
											purpose="Ei varauksia"
											status="Vapaa"
											capacity={value.capacity}
											reservationDate=""
											startTime=""
											endTime=""
											groupsize={0}
										/>
									)}
								</React.Fragment>
							);
						})}
					</Box>
					<Box display="flex" justifyContent="space-between" mt={2}>
						<Button onClick={handlePreviousPage} disabled={currentPage === 0}>
							Edellinen
						</Button>
						<Button
							onClick={handleNextPage}
							disabled={currentPage >= Math.ceil(filteredClassrooms.length / itemsPerPage) - 1}
						>
							Seuraava
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
};

export default BookingResults;
