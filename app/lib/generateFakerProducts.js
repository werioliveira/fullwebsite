import {faker} from "@faker-js/faker"


const generateFakeProduct = () =>{

    const createSize = () =>{
        return {
            text:faker.helpers.arrayElement(['S','M','L']),
            price: faker.commerce.price({min: 1, max: 20})
        }
    }
    const createColor = () =>{
        return {
            text:faker.helpers.arrayElement(['red','green','gray','black']),
            price: faker.commerce.price({min: 1, max: 20})
        }
    }
    const createSizes = faker.helpers.multiple(createSize, 1)
    const createColors = faker.helpers.multiple(createColor,2)

    const product = {
        title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            img: faker.image.url(),
            price: faker.commerce.price({min: 10, max: 100}),
            sizes: createSizes,
            colors: createColors,
            categories: faker.helpers.arrayElements(['sapatos','sandalias','calças','camisas']),
            subcategories: faker.helpers.arrayElements(['cano alto', 'rasteiras','manga longa','skinny'],1),
            quantity: 5
    }
    
    return product
}
export const generateFakeProducts = (length) =>{
    const products = []
    Array.from({length: length}).forEach(()=>{
        products.push(generateFakeProduct())
    })
    return products
}