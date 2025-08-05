import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

export async function getCabins() {
    const { data, error } = await supabase.from("cabins").select("*");

    if (error) {
        console.error();
        throw new Error("Cabins could not be loaded");
    }
    return data;
}

export async function createCabin(newCabin) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images//${imageName}`;

    // 1. Create cabin 
    const { data, error } = await supabase.from("cabins").insert([{ ...newCabin, image: imagePath }]);

    if (error) {
        console.error();
        throw new Error("Cabin could not be created");
    }

    // 2. Upload image
    const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

    // 3. Delete the cabin if there is an error in uploading image.
    if (storageError) {
        await supabase
            .from("cabins")
            .delete()
            .eq("id", data.id);
        console.error();
        throw new Error("Cabin image could not be uploaded and cabin could not be created");
    }

    return data;
}

export async function deleteCabin(id) {
    const { data, error } = await supabase
        .from("cabins")
        .delete()
        .eq("id", id);

    if (error) {
        console.error();
        throw new Error("Cabin could not be deleted");
    }
    return data;
}