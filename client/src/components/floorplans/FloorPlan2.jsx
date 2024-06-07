import React, { useState } from 'react';
import '../../styles/FloorPlan.css';

const reservations = [
  {
    name: "Meeting with Project Team",
    time: "2024-06-15T10:00:00Z",
    user: "648c9f2c9e5b6a2f9e37b3c8",
    school: "648c9f2c9e5b6a2f9e37b3c9",
    building: "648c9f2c9e5b6a2f9e37b3ca",
    room: {
      _id: "room1",
      name: "Room 1",
      capacity: 20,
      building: "648c9f2c9e5b6a2f9e37b3ca",
      bookings: ["648c9f2c9e5b6a2f9e37b3c8"]
    },
    groupsize: 10
  },
  {
    name: "Math Study Group",
    time: "2024-06-16T14:00:00Z",
    user: "648c9f2c9e5b6a2f9e37b3cc",
    school: "648c9f2c9e5b6a2f9e37b3cd",
    building: "648c9f2c9e5b6a2f9e37b3ce",
    room: {
      _id: "room2",
      name: "Room 2",
      capacity: 15,
      building: "648c9f2c9e5b6a2f9e37b3cb",
      bookings: ["648c9f2c9e5b6a2f9e37b3cc"]
    },
    groupsize: 15
  },
  {
    name: "Science Club Meeting",
    time: "2024-06-17T09:00:00Z",
    user: "648c9f2c9e5b6a2f9e37b3d0",
    school: "648c9f2c9e5b6a2f9e37b3d1",
    building: "648c9f2c9e5b6a2f9e37b3d2",
    room: {
      _id: "room3",
      name: "Room 3",
      capacity: 12,
      building: "648c9f2c9e5b6a2f9e37b3d2",
      bookings: ["648c9f2c9e5b6a2f9e37b3d0"]
    },
    groupsize: 8
  },
  {
    name: "English Literature Class",
    time: "2024-06-18T11:00:00Z",
    user: "648c9f2c9e5b6a2f9e37b3d4",
    school: "648c9f2c9e5b6a2f9e37b3d5",
    building: "648c9f2c9e5b6a2f9e37b3d6",
    room: {
      _id: "room4",
      name: "Room 4",
      capacity: 25,
      building: "648c9f2c9e5b6a2f9e37b3d6",
      bookings: ["648c9f2c9e5b6a2f9e37b3d4"]
    },
    groupsize: 25
  },
  {
    name: "History Lecture",
    time: "2024-06-19T13:00:00Z",
    user: "648c9f2c9e5b6a2f9e37b3d8",
    school: "648c9f2c9e5b6a2f9e37b3d9",
    building: "648c9f2c9e5b6a2f9e37b3da",
    room: {
      _id: "room5",
      name: "Room 5",
      capacity: 30,
      building: "648c9f2c9e5b6a2f9e37b3da",
      bookings: ["648c9f2c9e5b6a2f9e37b3d8"]
    },
    groupsize: 15
  }
];

const FloorPlan = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);

  const handleRoomClick = (roomId) => {
    setSelectedRoom(roomId);
    fetchRoomData(roomId);
  };

  const fetchRoomData = (roomId) => {
    const reservation = reservations.find(res => res.room._id === roomId);
    if (reservation) {
      setRoomData({ id: roomId, info: `Reservation: ${reservation.name}, Time: ${new Date(reservation.time).toLocaleString()}` });
    } else {
      setRoomData({ id: roomId, info: `No reservations for ${roomId}` });
    }
  };

  const getRoomColor = (roomId) => {
    const reservation = reservations.find(res => res.room._id === roomId);
    if(reservation){
      if (reservation.room.capacity > reservation.groupsize) {
        return '#F4BD89';    
      } else if (reservation.room.capacity <= reservation.groupsize){
        return '#EA7272';
      }
    } else {
      return '#94D0AD';
    }
  };

  const fetchRoomCapacity = (roomId) => {
    const reservation = reservations.find(res => res.room._id === roomId);
    if (reservation.room.capacity > reservation.groupsize) {
      return reservation.room.capacity;
    } else {
      return null; // or return a default value or handle the error as needed
    }
  };

  const roomCapacity = fetchRoomCapacity('room1');
  console.log(`Room capacity: ${roomCapacity}`);

  return (
    <div className="floor-plan">
      <svg viewBox="0 0 552 307" xmlns="http://www.w3.org/2000/svg">
        {/* Room 1 */}
        <rect
          className='room'
          id="room1"
          x="0"
          y="0"
          width="127"
          height="81"
          fill={getRoomColor('room1')}
          onClick={() => handleRoomClick('room1')}
        />

        {/* Room 2 */}
        <rect
          className='room'
          id="room2"
          x="0"
          y="85"
          width="82"
          height="81"
          fill={getRoomColor('room2')}
          onClick={() => handleRoomClick('room2')}
        />

        {/* Room 3 */}
        <rect
          className='room'
          id="room3"
          x="0"
          y="170"
          width="48"
          height="47"
          fill={getRoomColor('room3')}
          onClick={() => handleRoomClick('room3')}
        />

        {/* Room 4 */}
        <rect
          className='room'
          id="room4"
          x="402"
          y="0"
          width="150"
          height="81"
          fill={getRoomColor('room4')}
          onClick={() => handleRoomClick('room4')}
        />

        {/* Room 5 */}
        <rect
          className='room'
          id="room5"
          x="131"
          y="0"
          width="107"
          height="60"
          fill={getRoomColor('room5')}
          onClick={() => handleRoomClick('room5')}
        />

        {/* Room 6 */}
        <rect
          className='room'
          id="room6"
          x="242"
          y="0"
          width="107"
          height="60"
          fill={getRoomColor('room6')}
          onClick={() => handleRoomClick('room6')}
        />

        {/* Room 7 */}
        <rect
          className='room'
          id="room7"
          x="353"
          y="0"
          width="45"
          height="45"
          fill={getRoomColor('room7')}
          onClick={() => handleRoomClick('room7')}
        />

        {/* Room 8 */}
        <rect
          className='room'
          id="room8"
          x="468"
          y="85"
          width="84"
          height="78"
          fill={getRoomColor('room8')}
          onClick={() => handleRoomClick('room8')}
        />

        {/* Room 9 */}
        <rect
          className='room'
          id="room9"
          x="468"
          y="167"
          width="84"
          height="46"
          fill={getRoomColor('room9')}
          onClick={() => handleRoomClick('room9')}
        />

        {/* Room 10 */}
        <rect
          className='room'
          id="room10"
          x="468"
          y="217"
          width="84"
          height="46"
          fill={getRoomColor('room10')}
          onClick={() => handleRoomClick('room10')}
          style={{ cursor: 'pointer' }}
        />

        {/* Room 11 */}
        <rect
          className='room'
          id="room11"
          x="512"
          y="267"
          width="40"
          height="40"
          fill={getRoomColor('room11')}
          onClick={() => handleRoomClick('room11')}
          style={{ cursor: 'pointer' }}
        />
      </svg>
      {roomData && (
        <div className="room-data">
          <h2>{roomData.info}</h2>
        </div>
      )}
    </div>
  );
};

export default FloorPlan;