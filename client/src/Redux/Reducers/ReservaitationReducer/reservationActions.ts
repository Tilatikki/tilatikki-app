import { type Dispatch } from "redux";
import { ReservationActionTypes } from "./reservationTypes";
import axios from "axios";
import { type Space } from "../premiseState";
import Cookies from "universal-cookie";

// Base URL for your API
const domain = 'tilatikki.azurewebsites.net'

const API_BASE_URL = `https://${domain}:5050/api`;; // Adjust this as per your API's URL

const cookie = new Cookies();

const token = cookie.get("tilatikkiToken");

export function getReservation(id: string) {
  return async function (dispatch: Dispatch) {
    dispatch({ type: ReservationActionTypes.GET_RESERVATION_BEGINS });
    try {
      const response = await fetch(`${API_BASE_URL}/reservation/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: ReservationActionTypes.GET_RESERVATION_SUCCESS,
        payload: await response.json(),
      });
    } catch (error) {
      dispatch({
        type: ReservationActionTypes.GET_RESERVATION_FAILURE,
        payload: error as Error,
      });
    }
  };
}

export function getAllReservations() {
  return async function (dispatch: Dispatch) {
    dispatch({ type: ReservationActionTypes.GET_ALL_RESERVATIONS_BEGINS });
    try {
      const response = await fetch(`${API_BASE_URL}/reservation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: ReservationActionTypes.GET_ALL_RESERVATIONS_SUCCESS,
        payload: await response.json(),
      });
    } catch (error) {
      dispatch({
        type: ReservationActionTypes.GET_ALL_RESERVATIONS_FAILURE,
        payload: error as Error,
      });
    }
  };
}

// Action for creating a reservation
export function createReservation(
  startdate: Date,
  enddate: Date,
  availabilityId: string,
) {
  return async function (dispatch: Dispatch) {
    dispatch({ type: ReservationActionTypes.CREATE_RESERVATION_BEGINS });
    try {
      const response = await fetch(`${API_BASE_URL}/reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startdate,
          enddate,
          availabilityId,
        }),
      });
      dispatch({
        type: ReservationActionTypes.CREATE_RESERVATION_SUCCESS,
        payload: await response.json(),
      });
    } catch (error) {
      dispatch({
        type: ReservationActionTypes.CREATE_RESERVATION_FAILURE,
        payload: error as Error,
      });
    }
  };
}

// Action for updating a premise
export function updateReservation(id: string, updatedData: Space) {
  return async function (dispatch: Dispatch) {
    dispatch({ type: ReservationActionTypes.UPDATE_RESERVATION_BEGINS });
    try {
      const response = await axios.put(
        `${API_BASE_URL}/reservation/${id}`,
        updatedData,
      );
      dispatch({
        type: ReservationActionTypes.UPDATE_RESERVATION_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: ReservationActionTypes.UPDATE_RESERVATION_FAILURE,
        payload: error as Error,
      });
    }
  };
}

// Action for deleting a premise
export function deleteReservation(id: string) {
  return async function (dispatch: Dispatch) {
    dispatch({ type: ReservationActionTypes.DELETE_RESERVATION_BEGINS });
    try {
      await axios.delete(`${API_BASE_URL}/reservation/${id}`);
      dispatch({ type: ReservationActionTypes.DELETE_RESERVATION_SUCCESS });
    } catch (error) {
      dispatch({
        type: ReservationActionTypes.DELETE_RESERVATION_FAILURE,
        payload: error as Error,
      });
    }
  };
}
