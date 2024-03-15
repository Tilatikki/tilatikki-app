export const SpaceActionTypes = {
  GET_SPACES_BEGINS: "GET_SPACES_BEGINS",
  GET_SPACES_SUCCESS: "GET_SPACES_SUCCESS",
  GET_SPACES_FAILURE: "GET_SPACES_FAILURE",

  GET_SPACE_BEGINS: "GET_SPACE_BEGINS",
  GET_SPACE_SUCCESS: "GET_SPACE_SUCCESS",
  GET_SPACE_FAILURE: "GET_SPACE_FAILURE",

  UPDATE_SPACE_BEGINS: "UPDATE_SPACE_BEGINS",
  UPDATE_SPACE_SUCCESS: "UPDATE_SPACE_SUCCESS",
  UPDATE_SPACE_FAILURE: "UPDATE_SPACE_FAILURE",

  DELETE_SPACE_BEGINS: "DELETE_SPACE_BEGINS",
  DELETE_SPACE_SUCCESS: "DELETE_SPACE_SUCCESS",
  DELETE_SPACE_FAILURE: "DELETE_SPACE_FAILURE",

  CREATE_SPACE_BEGINS: "CREATE_SPACE_BEGINS",
  CREATE_SPACE_SUCCESS: "CREATE_SPACE_SUCCESS",
  CREATE_SPACE_FAILURE: "CREATE_SPACE_FAILURE",
} as const;

export type SpaceActionType =
  (typeof SpaceActionTypes)[keyof typeof SpaceActionTypes];