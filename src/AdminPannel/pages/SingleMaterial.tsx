import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ArrowLeft, MoreVertical, Share2 } from "lucide-react";
import { ProductAttributeValue } from "@/components/swatchBook/interfaces";
import {
  EditMaterialModal,
  newPath,
  path,
} from "../components/products/EditMaterialModal";
import { useParams } from "react-router-dom";

interface ProductAttribute {
  id: number;
  name: string;
  value: string;
}

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: { [key: string]: string };
}

interface Product {
  id: number;
  name: string;
  brand_id: { id: number; name: string };
  product_category_id: { id: number; name: string };
  created_at: string;
  description: string;
  photo: string;
  bucket_path: string;
  new_bucket: number;
  ai_summary: string | null;
  base_price: number | null;
}

interface ProductDetailProps {
  productId?: number;
  onBack?: () => void;
}

interface AttributeWithId {
  [key: string | number]: ProductAttributeValue[];
}

export interface VariantAttributeValue {
  id: number;
  value: string;
  variant_id: number;
  attribute_id: number;
}

export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  stock: number;
  image_url: string | null;
  price: number;
  variant_attribute_values: VariantAttributeValue[];
}

export const MaterialDetail = ({ onBack }: ProductDetailProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [attributes, setAttributes] = useState<AttributeWithId>({});
  const [loading, setLoading] = useState(true);
  const [variant, setVariant] = useState<Variant[]>([]);
  const [editData, setEditData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { id: productId } = useParams();

  const openModal = (section: string, data: any) => {
    setActiveSection(section);
    setIsModalOpen(true);
    setEditData(data);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveSection(null);
    setEditData(null);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select(`*, brand_id(id,name), product_category_id(id,name)`)
          .eq("id", productId)
          .single();

        if (!error && data) {
          const { data: attr, error: attrerr } = await supabase
            .from("product_attribute_values_duplicate")
            .select(`*, attribute_id(*)`)
            .eq("product_id", data.id);

          if (!attrerr && attr) {
            let res: {
              [key: string | number]: any;
            } = {};
            for (let i of attr) {
              if (!(i.attribute_id.name in res)) {
                res[i.attribute_id.name] = [];
              }
              res[i.attribute_id.name].push(i);
            }
            setAttributes(res);
          }

          const { data: vary, error: varyerr } = await supabase
            .from("product_variants")
            .select(
              `id,product_id, sku,stock,image_url, price,variant_attribute_values(*)`
            )
            .eq("product_id", data.id);

          if (vary && !varyerr) {
            setVariant(vary);
          }
          setProduct(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const mappedName: Record<string, string> = {
    id: "ID",
    product_id: "Product ID",
    sku: "SKU",
    stock: "STOCK",
    image_url: "IMAGE",
    price: "PRICE",
    variant_attribute_values: "VARIANTS",
  };

  const headersVariant = variant.length > 0 ? Object.keys(variant[0]) : null;

  const imageURL =
    product?.bucket_path == "default" && product.new_bucket != 1
      ? `${path}/${product.photo}`
      : `${newPath}/${product?.photo}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isModalOpen && (
        <EditMaterialModal
          isModalOpen={isModalOpen}
          activeSection={activeSection}
          closeModal={closeModal}
          data={editData}
          id={product.id}
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-full">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Published
              </span>
              <button
                onClick={() => openModal("Product", product)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h2 className="text-sm font-medium text-gray-500 mb-4">
                  Description
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Product Details */}
            {/* <div className="bg-white rounded-lg border border-gray-200">
              <div className="divide-y divide-gray-200">
                <div className="p-6 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Subtitle
                  </span>
                  <span className="text-sm text-gray-700">
                    {product.subtitle}
                  </span>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Handle
                  </span>
                  <span className="text-sm text-gray-700">
                    {product.handle}
                  </span>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Discountable
                  </span>
                  <span className="text-sm text-gray-700">
                    {product.discountable ? "True" : "False"}
                  </span>
                </div>
              </div>
            </div> */}

            {/* Media */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-900">Media</h2>
                  <button
                    onClick={() => openModal("Media", imageURL)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg flex items-center justify-center relative border-2">
                    <img src={imageURL ? imageURL : ""} alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-900">
                    Attributes
                  </h2>
                  <button
                    onClick={() => openModal("Attributes", attributes)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.keys(attributes).map((attr: string) => (
                    <div
                      key={attr}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-gray-500">
                        {attr}
                      </span>
                      <span className="text-sm text-gray-700">
                        {attributes[attr]
                          .map((attri: ProductAttributeValue) => {
                            // Convert value to string
                            if (typeof attri.value === "object") {
                              return JSON.stringify(attri.value); // Or pick the property you want
                            }
                            return attri.value;
                          })
                          .join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-900">
                    Variants
                  </h2>
                  {/* <button className="text-sm text-gray-600 hover:text-gray-900">
                    + Add variant
                  </button> */}
                  <button
                    onClick={() => openModal("Variant", variant)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Edit Variants
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {headersVariant != null &&
                          headersVariant.map((vary, idx) => {
                            return (
                              <th
                                key={idx}
                                className="py-3 text-left text-xs font-medium text-gray-500 uppercase"
                              >
                                {mappedName[vary]}
                              </th>
                            );
                          })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {variant?.map((vari: any) => {
                        return (
                          <tr key={vari.id} className="hover:bg-gray-50">
                            {headersVariant?.length &&
                              headersVariant.map((str: string) => {
                                return (
                                  <td className="py-3 text-sm text-gray-900">
                                    {Array.isArray(vari[str])
                                      ? vari[str].length
                                      : vari[str]?.toString()}
                                  </td>
                                );
                              })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sales Channels */}
            {/* <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-900">
                    Sales Channels
                  </h2>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Share2 className="w-4 h-4 text-gray-400" />
                    <span>{product.sales_channels?.join(", ")}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Available in {product.available_channels} of{" "}
                    {product.total_channels} sales channels
                  </div>
                </div>
              </div>
            </div> */}

            {/* Shipping Configuration */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-medium text-gray-900">
                    Shipping configuration
                  </h2>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Organize */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-900">
                    Organize
                  </h2>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Tags
                    </label>
                    {/* <div className="text-sm text-gray-700">
                      {product.tags?.length ? product.tags.join(", ") : "-"}
                    </div> */}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Brand
                    </label>
                    <div className="text-sm text-gray-700">
                      {product.brand_id.name}
                    </div>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Collection
                    </label>
                    <div className="inline-block px-2 py-1 text-xs text-blue-700 bg-blue-50 rounded">
                      {product.collection}
                    </div>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Categories
                    </label>
                    <div className="inline-block px-2 py-1 text-xs text-blue-700 bg-blue-50 rounded">
                      {product.product_category_id?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
