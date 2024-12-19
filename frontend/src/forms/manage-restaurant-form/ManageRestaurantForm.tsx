import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import { Button } from "@nextui-org/react";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z
  .object({
    restaurantName: z.string({ required_error: "Restaurant Name is Required" }),
    city: z.string({ required_error: "City Name is Required" }),
    country: z.string({ required_error: "Country Name is Required" }),
    deliveryPrice: z.coerce.number({
      required_error: "Delivery Price is Required",
      invalid_type_error: "Must be a Valid Number",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "Estimated Delivery Time is Required",
      invalid_type_error: "Must be a Valid Number",
    }),
    cuisines: z.array(z.string()).nonempty({
      message: "Please Select at Least One item",
    }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "Name is Required"),
        price: z.coerce.number().min(1, "Price is Required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "Image is Required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either Image URL or image file must be provided",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;
type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    form.reset(restaurant);
  }, [form, restaurant]);

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);

    formData.append("deliveryPrice", formDataJson.deliveryPrice.toString());
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    );
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString());
    });

    if (formDataJson.imageFile) {
      formData.append(`imageFile`, formDataJson.imageFile);
    }

    onSave(formData);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        <Button isLoading={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
