
const initialState = {
    typeRegister:'pendiente',
};

//Use reducer que valida los objetos
const reducer = (state, action) => {
    if (reducerObject(state)[action.type]) {
        return reducerObject(state, action.payload)[action.type];
    } else {
        return state;
    }
}

const actionTypes = {
    
}

//Use reducer con estrutura de objetos 
const reducerObject = (state, payload) => ({

    [actionTypes.setManiobrasCheck]: {
        ...state,
        maniobrasCheckList: payload
    },

});

export { initialState, reducer, actionTypes }