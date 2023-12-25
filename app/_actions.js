"use server";

import { updateUser, updateWishList, updateCartList } from "./lib/mongo/users";

export async function updateName(name, email) {
	await updateUser(email, { name });
}
export async function updateWish(update, email){
	await updateWishList(email, update)
}
export async function updateCart(update, email){
	await updateCartList(email, update)
}