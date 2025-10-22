import { MaterialModel } from "@/models/swatchBook/material/MaterialModel";

 
    const s3DefaultBase =
        "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
    const s3NewBase = "https://betadzinly.s3.us-east-2.amazonaws.com/material";

 export const computeImageUrl = (swatch: MaterialModel): string | null => {
        const clean = (v?: string | null) =>
            (v ?? "")
                .toString()
                .trim()
                .replace(/^null$|^undefined$/i, "");
        const bucket = clean((swatch as any).bucket_path);
        const photo = clean((swatch as any).photo);

        if (bucket && bucket !== "default") {
            return `${s3NewBase}/${bucket}`;
        }
        if (bucket === "default" && photo) {
            return `${s3DefaultBase}/${photo}`;
        }
        return null;
    }