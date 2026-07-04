import { useEffect, useState } from "react";
import { Box, Heading, Text, HStack, Button } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import EditSubscriptionModal from "../components/subscriptions/EditSubscriptionModal";

import Header from "../components/layout/Header";
import StatsCards from "../components/dashboard/StatsCards";
import SubscriptionList from "../components/subscriptions/SubscriptionList";
import AddSubscriptionModal from "../components/subscriptions/AddSubscriptionModal";
import API from "../api/subscriptionApi";

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await API.get("/subscriptions/");
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = (newSubscription) => {
    setSubscriptions((prev) => [newSubscription, ...prev]);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subscription?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/subscriptions/${id}/`);

      setSubscriptions((prev) =>
        prev.filter((subscription) => subscription.id !== id)
      );
    } catch (error) {
      console.error("Error deleting subscription:", error);
      alert("Failed to delete subscription.");
    }
  };
  
  const handleEditClick = (subscription) => {
    setSelectedSubscription(subscription);
    setIsEditOpen(true);
  };
  
  const handleUpdated = (updatedSubscription) => {
    setSubscriptions((prev) =>
      prev.map((subscription) =>
        subscription.id === updatedSubscription.id
          ? updatedSubscription
          : subscription
      )
    );
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const search = searchTerm.toLowerCase();

    return (
      subscription.service_name.toLowerCase().includes(search) ||
      subscription.owner_name.toLowerCase().includes(search) ||
      subscription.category.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <StatsCards subscriptions={subscriptions} />

      <HStack justify="space-between" mt={10} mb={2} wrap="wrap">
        <Box>
          <Heading size="lg" color="gray.900">
            All Subscriptions
          </Heading>

          <Text color="gray.500">
            Manage your active and upcoming subscription payments.
          </Text>
        </Box>

        <Button
          colorPalette="purple"
          size="lg"
          onClick={() => setIsAddOpen(true)}
        >
          <FiPlus />
          Add Subscription
        </Button>
      </HStack>

      {loading ? (
        <Text mt={8} color="gray.500">
          Loading subscriptions...
        </Text>
      ) : (
        <SubscriptionList
         subscriptions={filteredSubscriptions}
         onDelete={handleDelete}
         onEdit={handleEditClick}
        />
      )}

      <AddSubscriptionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreated={handleCreated}
        subscriptions={subscriptions}
      />
      <EditSubscriptionModal
        isOpen={isEditOpen}
        onClose={() => {
        setIsEditOpen(false);
        setSelectedSubscription(null);
       }}
        subscription={selectedSubscription}
        onUpdated={handleUpdated}
        subscriptions={subscriptions}
       />
    </>
  );
}

export default Dashboard;