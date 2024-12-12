import {createSlice} from "@reduxjs/toolkit"

const compnaySlice = createSlice({
    name : "company",
    initialState : {
        singleCompany : null,
        companies : [],
        searchCompanyByText : ""
    },
    reducers : {
        setSingleCompany : (state, action) => {
            state.singleCompany = action.payload;
        },
        setCompanies : (state, action) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText : (state, action) => {
            state.searchCompanyByText = action.payload;
        },
    }
})

export const {setSingleCompany, setCompanies, setSearchCompanyByText} = compnaySlice.actions
export default compnaySlice.reducer;
