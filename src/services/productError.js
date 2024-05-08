const generateGetProductsError = () => {
    return `
    Could not get the list of products
    `
}

const generateGetProductByIdError = (id) => {
    return `
    Could not obtain the product with the id: ${id}
    `
}

const generateAddProductError = () => {
    return `
    Any of the fields are incomplete or do not meet the requirements
    `
}

const generateUpdateProductError = (id) => {
    return `
    The id: ${id} is not correct or one of the fields is incomplete
    `
}

const generateDeleteProductError = (id) => {
    return `
    Could not delete the product with the id: ${id}
    `
}

const productErrorOptions = {
    generateGetProductsError,
    generateGetProductByIdError,
    generateAddProductError,
    generateUpdateProductError,
    generateDeleteProductError,
}

export default productErrorOptions;