import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "@nextui-org/react";
import { Separator } from "./ui/separator";
import { Pizza, Trash } from "lucide-react";

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeFromCart: (cartItem: CartItem) => void;
};
const OrderSummary = ({ restaurant, cartItems, removeFromCart }: Props) => {
  const getTotalCost = () => {
    const totalInRupees = cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
    const totalWithDelivery = totalInRupees + restaurant.deliveryPrice;
    return totalWithDelivery;
  };
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Your Order</span>₹{getTotalCost()} <span></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <Badge
                variant="shadow"
                showOutline={false}
                color="primary"
                content={item.quantity}
                className="mr-2"
              >
                <Pizza />
              </Badge>
              {item.name}
            </span>
            <span className="flex items-center gap-1">
                <Trash className="cursor-pointer" color="red" size={20} onClick={() => removeFromCart(item)} />
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <span>Delivery</span> <span>₹{restaurant.deliveryPrice}</span>
        </div>
        <Separator />
      </CardContent>
    </>
  );
};

export default OrderSummary;
