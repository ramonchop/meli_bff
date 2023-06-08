const axios = require('axios');
const Error = require('../models/error.model');
const { remoteHost } = require('../constants');


const detail = async (productId) => {
    try {

        const detailProduct = await getDetailProductById(productId);

        const descriptionData = await getDescriptionByProductId(productId);

        const description = descriptionData.plain_text;

        const currencyId = detailProduct.currency_id;
        const address = detailProduct.seller_address;
        const countryId = address.country.id;
        const categoryId = detailProduct.category_id;

        const currency = await getCurrencyById(currencyId);

        const locale = await getLocaleByCountryId(countryId);

        const categoryData = await getCategoryById(categoryId);


        const picture = getPicture(detailProduct);

        const price = {
            currency: currencyId,
            amount: detailProduct.price,
            decimals: currency.decimal_places,
        }

        const pathFromRoot = categoryData.path_from_root;
        const id = detailProduct.id
        const title = detailProduct.title
        const soldQuantity = detailProduct.sold_quantity
        const condition = detailProduct.condition
        const freeShipping = detailProduct.shipping.free_shipping

        const result = {
            item: {
                id: id,
                title: title,
                price: price,
                picture: picture,
                condition: condition,
                free_shipping: freeShipping,
                sold_quantity: soldQuantity,
                locale: locale,
                description: description
            },
            path_from_root: pathFromRoot,
        }


        return result;
    } catch (e) {
        if (e?.response?.status === 404){
            return new Error(404, 'Not Found');
        }
        return new Error(500, 'Internal Server Error');
    }




}


const getDetailProductById = async (productId) => {
    const productUrl = `${remoteHost}/items/${productId}`;
    const itemsResponse = await axios.get(productUrl);

    if (itemsResponse.status !== 200) {
        throw new Error("Error");
    }
    return itemsResponse.data;
}

const getDescriptionByProductId = async (productId) => {
    const productUrl = `${remoteHost}/items/${productId}`;
    const descriptionUrl = `${productUrl}/description`;

    const descriptionResponse = await axios.get(descriptionUrl);

    if (descriptionResponse.status !== 200) {
        throw new Error("Error");
    }
    return descriptionResponse.data;
}

const getCurrencyById = async (currencyId) => {
    const currencyResponse = await axios.get(`${remoteHost}/currencies/${currencyId}`);

    if (currencyResponse.status !== 200) {
        throw new Error("Error");
    }
    return currencyResponse.data;
}

const getLocaleByCountryId = async (countryId) => {
    const localeResponse = await axios.get(`${remoteHost}/countries/${countryId}`);

    if (localeResponse.status !== 200) {
        throw new Error("Error");
    }
    const localeData = localeResponse.data
    const locale = localeData.locale.replace("_", "-");
    return locale;
}
const getCategoryById = async (categoryId) => {
    const categoryResponse = await axios.get(`${remoteHost}/categories/${categoryId}`);

    if (categoryResponse.status !== 200) {
        throw new Error("Error");
    }
    const categoryData = categoryResponse.data
    return categoryData;
}

const getPicture = (itemData) => {
    let picture = itemData.secure_thumbnail;

    if (itemData.pictures !== undefined && itemData.pictures.length > 0) {
        picture = itemData.pictures[0].secure_url ?? picture;
    }
    return picture;
}


module.exports = {
    detail,
}