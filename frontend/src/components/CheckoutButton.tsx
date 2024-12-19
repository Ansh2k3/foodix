import { useGetMyUser } from "@/api/MyUserApi";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useLocation } from "react-router-dom";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({disabled, onCheckout, isLoading}: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();
  const { pathname } = useLocation();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };
  if (!isAuthenticated) {
    return (
      <Button onPress={onLogin} className="bg-orange-500 flex-1 text-white">
        Login to Check Out!
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading) {
    return <Button color="primary" isLoading className="flex-1">
    Loading
  </Button>;
  }
  return (
    <>
      <Button isDisabled={disabled} onPress={onOpen} className="bg-orange-500 flex-1">
        Go to Check Out
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
          {(onClose) => (
            <>
              <ModalHeader>Verify Your Information</ModalHeader>
              <UserProfileForm
                currentUser={currentUser}
                onSave={onCheckout}
                isLoading={isGetUserLoading}
                title="Confirm Delivery Details"
                buttonText="Continue to Payment"
              />
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckoutButton;