import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Input,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

import API from "../api/subscriptionApi";
import SubscriptionList from "../components/subscriptions/SubscriptionList";
import AddSubscriptionModal from "../components/subscriptions/AddSubscriptionModal";
import EditSubscriptionModal from "../components/subscriptions/EditSubscriptionModal";
import { useAppSettings } from "../context/AppSettingsContext";

function Subscriptions() {
  const {
    cardBg,
    inputBg,
    textColor,
    mutedText,
    borderColor,
  } = useAppSettings();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const selectStyle = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: `1px solid ${borderColor}`,
    backgroundColor: inputBg,
    color: textColor,
    minWidth: "190px",
    outline: "none",
  };

  const optionStyle = {
    backgroundColor: inputBg,
    color: textColor,
  };

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

    const matchesSearch =
      subscription.service_name.toLowerCase().includes(search) ||
      subscription.owner_name.toLowerCase().includes(search) ||
      subscription.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || subscription.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <HStack justify="space-between" mb={8} wrap="wrap">
        <Box>
          <Heading size="xl" color={textColor}>
            Subscriptions
          </Heading>

          <Text color={mutedText} mt={1}>
            View, search, add, edit, and delete your subscriptions.
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

      <Box
        bg={cardBg}
        p={5}
        borderRadius="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        mb={8}
      >
        <HStack gap={4} wrap="wrap">
          <Input
            placeholder="Search by service, owner, or category..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            maxW="420px"
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
            _placeholder={{ color: mutedText }}
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            style={selectStyle}
          >
            <option value="all" style={optionStyle}>
              All Categories
            </option>
            <option value="entertainment" style={optionStyle}>
              Entertainment
            </option>
            <option value="productivity" style={optionStyle}>
              Productivity
            </option>
            <option value="fitness" style={optionStyle}>
              Fitness
            </option>
            <option value="utilities" style={optionStyle}>
              Utilities
            </option>
            <option value="education" style={optionStyle}>
              Education
            </option>
            <option value="other" style={optionStyle}>
              Other
            </option>
          </select>
        </HStack>
      </Box>

      {loading ? (
        <Text color={mutedText}>Loading subscriptions...</Text>
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

export default Subscriptions;