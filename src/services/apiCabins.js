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

export async function createEditCabin(newCabin, id) {
    // If the image is already there when we are editing a cabin, 
    // we will use that imagePath else create a new one.
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
    const imagePath = hasImagePath
        ? newCabin.image
        : `${supabaseUrl}/storage/v1/object/public/cabin-images//${imageName}`;

    let query = supabase.from("cabins");

    // 1. Create/Edit cabin 
    // CREATE
    if (!id)
        query = query.insert([{ ...newCabin, image: imagePath }])

    // EDIT
    if (id)
        query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

    const { data, error } = await query.select().single();

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