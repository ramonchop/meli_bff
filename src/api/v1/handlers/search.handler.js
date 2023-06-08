const axios = require('axios');
const Error = require('../models/error.model');
const { remoteHost, maxResults } = require('../constants');


const search = async (query) => {
    try {
        const response = await axios.get(`${remoteHost}/sites/MLA/search?q=${query}&limit=${maxResults}`,)
        const data = response.data;

        const categoriesResult = await getCategories(data)
        if (categoriesResult == undefined) return new Error(404, 'Not Found');
        const categories = categoriesResult.categories;
        const pathFromRoot = categoriesResult.path_from_root;
        const items = await getItems(data);

        return {
            categories: categories,
            path_from_root: pathFromRoot,
            items: items,
        };
    } catch (e) {
        return new Error(500, 'Internal Server Error');
    }
}




const getCategories = async (data) => {
    let result
    if (hasFilters(data)) {
        result = categoriesWithFilters(data);
    } else if (hasAvailableFilters(data)) {
        result = await categoriesWithAvailableFilters(data);

    }
    return result;
}

const hasFilters = (data) => {
    return data.filters !== undefined && data.filters.length > 0
}
const hasAvailableFilters = (data) => {
    return data.available_filters !== undefined && data.available_filters.length > 0
}

const categoriesWithFilters = (data) => {
    const categoriesList = data.filters.find((filter) => filter.id === "category").values;

    const pathFromRoot = categoriesList[0].path_from_root;
    const categories = mapCategories(categoriesList);
    return {
        categories: categories,
        path_from_root: pathFromRoot
    }
}

const categoriesWithAvailableFilters = async (data) => {
    const categoriesList = data.available_filters.find((filter) => filter.id === "category").values;
    const currentCategory = categoriesList.reduce((prev, current) => (prev.results > current.results) ? prev : current).id;
    const categoryPathResponse = await axios.get(`${remoteHost}/categories/${currentCategory}`);
    if (categoryPathResponse.status !== 200) {
        return new Error(500, 'Internal Server Error');
    }
    const categoryPathData = categoryPathResponse.data

    const pathFromRoot = categoryPathData.path_from_root;
    const categories = mapCategories(categoriesList);

    return {
        categories: categories,
        path_from_root: pathFromRoot
    }
}

const mapCategories = (categoriesList) => {
    const categories = categoriesList.map((category) => { return category.id });
    return categories;
}


const getItems = async (data) => {
    return await Promise.all(data?.results?.map(async (item) => {
        const currencyId = item.currency_id;
        const address = item.seller_address;
        const countryId = address.country.id;

        const currencyResponse = await axios.get(`${remoteHost}/currencies/${currencyId}`);

        if (currencyResponse.status !== 200) {
            throw new Error("Error");
        }

        const localeResponse = await axios.get(`${remoteHost}/countries/${countryId}`);

        if (localeResponse.status !== 200) {
            throw new Error("Error");
        }

        const currencyData = currencyResponse.data
        const localeData = localeResponse.data
        const locale = localeData.locale.replace("_", "-");
        const itemPrice = item.price;
        const decimals = currencyData.decimal_places;
        const price = {
            currency: currencyId,
            amount: itemPrice,
            decimals: decimals,
        }

        const state = address.state.name;

        const id = item.id;
        const title = item.title;
        const picture = item.thumbnail;
        const condition = item.condition;
        const free_shipping = item.shipping.free_shipping;

        return {
            id: id,
            title: title,
            price: price,
            picture: picture,
            condition: condition,
            free_shipping: free_shipping,
            locale: locale,
            state: state,
        }
    }));
}


module.exports = {
    search,
}