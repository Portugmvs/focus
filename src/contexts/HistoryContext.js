import React, { createContext, useContext, useReducer } from 'react';

const HistoryContext = createContext();

const historyReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ENTRY':
      return [...state.slice(-9), action.payload];
    default:
      return state;
  }
};

export const HistoryProvider = ({ children }) => {
  const [history, dispatch] = useReducer(historyReducer, []);

  const addHistoryEntry = (entry) => {
    dispatch({
      type: 'ADD_ENTRY',
      payload: {
        ...entry,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <HistoryContext.Provider value={{ history, addHistoryEntry }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);