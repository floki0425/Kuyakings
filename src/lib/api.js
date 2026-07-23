import { supabase } from "./supabaseClient";

// Helpers for frontend to interact with Supabase tables used by this project.

export async function getFlavors() {
	const { data, error } = await supabase
		.from("product_flavors")
		.select("id, name, is_available, sort_order, price, image_url")
		.order("sort_order", { ascending: true });

	return { data, error };
}

export async function getSitePhotoSlots() {
	const { data, error } = await supabase
		.from("site_photo_slots")
		.select("slot, url");

	return { data, error };
}

export async function getPaymentSettings() {
	const { data, error } = await supabase
		.from("payment_settings")
		.select("method, account_name, account_number, bank_name, qr_code_url");

	return { data, error };
}

export async function getProducts() {
	const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
	return { data, error };
}

export async function createOrder(order) {
	const { data, error } = await supabase.from("orders").insert([order]).select();
	return { data, error };
}

export async function getOrdersByEmail(email) {
	const { data, error } = await supabase.from("orders").select("*").eq("email", email).order("created_at", { ascending: false });
	return { data, error };
}

export async function getOrdersForAdmin() {
	const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50);
	return { data, error };
}



